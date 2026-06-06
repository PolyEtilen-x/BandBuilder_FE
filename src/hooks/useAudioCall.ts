// src/hooks/useAudioCall.ts

import { useEffect, useRef, useState } from "react"
import { useSpeakingStore } from "@/services/speaking/speaking.store"

export function useAudioCall(options?: { onVolumeChange?: (volume: number) => void }) {
  const {
    callState,
    sendAudioChunk,
    stopRecording,
    isMuted
  } = useSpeakingStore()

  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const isSpeakingRef = useRef(false)

  // Refs to hold browser Audio objects
  const audioContextRef = useRef<AudioContext | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const processorRef = useRef<ScriptProcessorNode | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // VAD Parameters
  const SILENCE_THRESHOLD = 0.02 // RMS threshold for silence (balanced for sensitivity and noise tolerance)
  const SILENCE_DURATION_MS = 1000
  const hasSpokenRef = useRef(false) // Track if speech was detected first to avoid early VAD triggers

  // Clean up references on unmount
  useEffect(() => {
    return () => {
      cleanupAudio()
    }
  }, [])

  // Start / Stop audio recording loop based on global speaking state machine
  useEffect(() => {
    if (callState === "active") {
      startRecordingLoop()
    } else {
      stopRecordingLoop()
    }
  }, [callState])

  // Handle Mute changes
  useEffect(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !isMuted
      })
    }
  }, [isMuted])

  async function startRecordingLoop() {
    try {
      cleanupAudio() // Ensure previous resources are fully freed

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
          sampleRate: 16000 // Optimal for Whisper / speech-to-text
        }
      })

      mediaStreamRef.current = stream

      let audioCtx: AudioContext
      try {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 })
      } catch (e) {
        console.warn("Custom sampleRate not supported, falling back to default:", e)
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
      audioContextRef.current = audioCtx

      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 512
      analyserRef.current = analyser
      source.connect(analyser)

      // ScriptProcessorNode creates continuous buffer slices (bufferSize = 4096 frames ~250ms at 16kHz)
      const processor = audioCtx.createScriptProcessor(4096, 1, 1)
      processorRef.current = processor
      source.connect(processor)
      processor.connect(audioCtx.destination)

      hasSpokenRef.current = false
      setIsRecording(true)

      processor.onaudioprocess = (e) => {
        if (isMuted) return

        const inputBuffer = e.inputBuffer
        const channelData = inputBuffer.getChannelData(0) // Float32 Array

        // Calculate RMS Volume for VAD and UI Waves
        let sum = 0
        for (let i = 0; i < channelData.length; i++) {
          sum += channelData[i] * channelData[i]
        }
        const rms = Math.sqrt(sum / channelData.length)

        // Trigger callback for real-time waveform visualization without state re-render
        if (options?.onVolumeChange) {
          options.onVolumeChange(rms)
        }

        // Debounced speaking indicator state to reduce React re-renders
        const speaking = rms > 0.03
        if (speaking !== isSpeakingRef.current) {
          isSpeakingRef.current = speaking
          setIsSpeaking(speaking)
        }

        // Stream raw binary buffer float array back via websocket
        // Convert Float32Array into Int16Array (16-bit PCM) for extreme bandwidth saving
        const pcmBuffer = new Int16Array(channelData.length)
        for (let i = 0; i < channelData.length; i++) {
          // Clamp value between -1.0 and 1.0
          const val = Math.max(-1, Math.min(1, channelData[i]))
          pcmBuffer[i] = val < 0 ? val * 0x8000 : val * 0x7FFF
        }

        sendAudioChunk(pcmBuffer.buffer)

        // --- Client-Side VAD (Voice Activity Detection) ---
        if (rms > SILENCE_THRESHOLD) {
          hasSpokenRef.current = true
          // Reset silence timer when user speaks
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current)
            silenceTimerRef.current = null
          }
        } else if (hasSpokenRef.current) {
          // If silence is detected AND they have spoken something, start silence timer
          if (!silenceTimerRef.current) {
            silenceTimerRef.current = setTimeout(() => {
              console.log("VAD: Silence detected. Auto-finalizing speech...")
              stopRecording()
              stopRecordingLoop()
            }, SILENCE_DURATION_MS)
          }
        }
      }

    } catch (err) {
      console.error("Failed to capture microphone stream:", err)
      setIsRecording(false)
    }
  }

  function stopRecordingLoop() {
    setIsRecording(false)
    if (isSpeakingRef.current) {
      isSpeakingRef.current = false
      setIsSpeaking(false)
    }
    if (options?.onVolumeChange) {
      options.onVolumeChange(0)
    }
    cleanupAudio()
  }

  function cleanupAudio() {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }

    if (processorRef.current) {
      processorRef.current.disconnect()
      processorRef.current.onaudioprocess = null
      processorRef.current = null
    }

    if (analyserRef.current) {
      analyserRef.current.disconnect()
      analyserRef.current = null
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop())
      mediaStreamRef.current = null
    }

    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
  }

  return {
    isRecording,
    isSpeaking
  }
}
