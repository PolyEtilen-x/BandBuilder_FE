import { create } from "zustand"
import { io, Socket } from "socket.io-client"
import { speakingApi } from "@/api/speaking/speaking.api"

export type DialogueTurn = {
  sender: "ai" | "user"
  text: string
  isPartial?: boolean
}

export type SpeakingState = {
  // Socket & Connection
  socket: Socket | null
  isConnected: boolean

  // Call Session State
  callState: "idle" | "calling" | "active" | "thinking" | "feedback"
  selectedVoiceId: string
  timer: number
  isMuted: boolean
  isSpeakerOn: boolean

  // Dialogue Transcripts
  dialogue: DialogueTurn[]

  // Feedback Report Metrics
  overallBand: number
  metrics: {
    fluency: number
    lexical: number
    grammar: number
    pronunciation: number
  }
  corrections: Array<{
    type: "grammar" | "vocab" | "positive"
    original?: string
    correction?: string
    explanation: string
  }>

  // Actions
  initSocket: () => void
  startCall: (voiceId: string) => void
  sendAudioChunk: (chunk: Blob | ArrayBuffer) => void
  stopRecording: () => void
  hangUp: () => void
  resetStore: () => void

  setMuted: (muted: boolean) => void
  setSpeakerOn: (speakerOn: boolean) => void
  incrementTimer: () => void
}

const VOICE_WS_URL = import.meta.env.VITE_VOICE_WS_URL || "http://localhost:8000"

export const useSpeakingStore = create<SpeakingState>((set, get) => ({
  socket: null,
  isConnected: false,
  callState: "idle",
  selectedVoiceId: "sophia",
  timer: 0,
  isMuted: false,
  isSpeakerOn: true,
  dialogue: [],
  overallBand: 0,
  metrics: { fluency: 0, lexical: 0, grammar: 0, pronunciation: 0 },
  corrections: [],

  initSocket: () => {
    // Prevent duplicate connections
    if (get().socket) return

    const socket = io(VOICE_WS_URL, {
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
    })

    socket.on("connect", () => {
      set({ isConnected: true })
      console.log("Speaking Gateway Connected successfully")
    })

    socket.on("disconnect", () => {
      set({ isConnected: false })
      console.log("Speaking Gateway Disconnected")
    })

    // Listen for session state synchronization
    socket.on("session_state", (data: { state: "idle" | "calling" | "active" | "thinking" | "feedback" }) => {
      set({ callState: data.state })
    })

    // Listen for real-time partial Whisper transcripts
    socket.on("partial_transcript", (data: { text: string }) => {
      const dialogue = [...get().dialogue]

      // If last turn is already a partial user transcript, update it. Otherwise, add new.
      const lastTurn = dialogue[dialogue.length - 1]
      if (lastTurn && lastTurn.sender === "user" && lastTurn.isPartial) {
        lastTurn.text = data.text
      } else {
        dialogue.push({ sender: "user", text: data.text, isPartial: true })
      }
      set({ dialogue })
    })

    // Listen for finalized user transcript
    socket.on("final_transcript", (data: { text: string }) => {
      const dialogue = [...get().dialogue]

      // Remove any partial user transcripts at the end
      while (dialogue.length > 0 && dialogue[dialogue.length - 1].sender === "user" && dialogue[dialogue.length - 1].isPartial) {
        dialogue.pop()
      }

      dialogue.push({ sender: "user", text: data.text, isPartial: false })
      set({ dialogue, callState: "thinking" })
    })

    // Listen for streaming LLM text responses
    socket.on("ai_stream", (data: { token: string }) => {
      const dialogue = [...get().dialogue]
      const lastTurn = dialogue[dialogue.length - 1]

      if (lastTurn && lastTurn.sender === "ai") {
        lastTurn.text += data.token
      } else {
        dialogue.push({ sender: "ai", text: data.token })
      }
      set({ dialogue, callState: "active" })
    })

    // Listen for full voice feedback analysis
    socket.on("feedback_report", (data: {
      overallBand: number
      metrics: { fluency: number; lexical: number; grammar: number; pronunciation: number }
      corrections: Array<any>
    }) => {
      set({
        overallBand: data.overallBand,
        metrics: data.metrics,
        corrections: data.corrections,
        callState: "feedback"
      })

      // Auto-save speaking session to database via NestJS API
      const dialogue = get().dialogue.map(d => ({
        sender: d.sender,
        text: d.text
      }))
      const voiceId = get().selectedVoiceId

      speakingApi.saveSession({
        voiceId,
        dialogue,
        overallBand: data.overallBand,
        fluency: data.metrics.fluency,
        lexical: data.metrics.lexical,
        grammar: data.metrics.grammar,
        pronunciation: data.metrics.pronunciation,
        corrections: data.corrections
      }).catch(err => {
        console.error("Failed to auto-save speaking session to database:", err)
      })
    })

    // Listen for synthesized voice audio streaming
    socket.on("tts_audio", (data: { audio: string }) => {
      console.log("Received synthesized TTS audio buffer chunk. Playing...")
      try {
        const audioUrl = `data:audio/mp3;base64,${data.audio}`
        const audio = new Audio(audioUrl)
        audio.play().catch(err => {
          console.error("Browser audio playback blocked or failed:", err)
        })
      } catch (err) {
        console.error("Failed to construct or play HTML5 Audio player:", err)
      }
    })

    set({ socket })
  },

  startCall: (voiceId: string) => {
    const { socket } = get()
    set({
      selectedVoiceId: voiceId,
      callState: "calling",
      dialogue: [],
      timer: 0
    })

    if (socket) {
      socket.emit("start_session", { voiceId })
    }
  },

  sendAudioChunk: (chunk: Blob | ArrayBuffer) => {
    const { socket } = get()
    if (socket && socket.connected) {
      socket.emit("audio_chunk", chunk)
    }
  },

  stopRecording: () => {
    const { socket } = get()
    set({ callState: "thinking" })
    if (socket) {
      socket.emit("stop_recording")
    }
  },

  hangUp: () => {
    const { socket } = get()
    set({ callState: "idle", timer: 0 })
    if (socket) {
      socket.emit("end_session")
    }
  },

  resetStore: () => {
    const { socket } = get()
    if (socket) {
      socket.disconnect()
    }
    set({
      socket: null,
      isConnected: false,
      callState: "idle",
      timer: 0,
      dialogue: [],
      overallBand: 0,
      corrections: []
    })
  },

  setMuted: (muted: boolean) => set({ isMuted: muted }),
  setSpeakerOn: (speakerOn: boolean) => set({ isSpeakerOn: speakerOn }),
  incrementTimer: () => set((state) => ({ timer: state.timer + 1 }))
}))
