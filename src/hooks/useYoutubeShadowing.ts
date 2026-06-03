import { useState, useEffect, useRef } from "react"
import type { PronunciationSentenceDto } from "@/api/practice/practiceGeneral.api"

interface YTPlayer {
  playVideo: () => void
  pauseVideo: () => void
  seekTo: (seconds: number, allowSeekAhead: boolean) => void
  getCurrentTime: () => number
  getDuration: () => number
  setPlaybackRate: (suggestedRate: number) => void
  destroy: () => void
}

interface YTPlayerConstructor {
  new(
    elementId: string,
    options: {
      height?: string | number
      width?: string | number
      videoId?: string
      playerVars?: {
        playsinline?: number
        controls?: number
        rel?: number
        showinfo?: number
        modestbranding?: number
      }
      events?: {
        onReady?: (event: { target: YTPlayer }) => void
        onStateChange?: (event: { data: number; target: YTPlayer }) => void
      }
    }
  ): YTPlayer
}

interface YTNamespace {
  Player: YTPlayerConstructor
  PlayerState: {
    UNSTARTED: number
    ENDED: number
    PLAYING: number
    PAUSED: number
    BUFFERING: number
    CUED: number
  }
}

declare global {
  interface Window {
    YT?: YTNamespace
    onYouTubeIframeAPIReady?: () => void
  }
}

function extractYoutubeVideoId(url: string): string | null {
  if (!url) return null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

export interface UseYoutubeShadowingReturn {
  isPlaying: boolean
  playbackSpeed: number
  isLooping: boolean
  currentTime: number
  duration: number
  isPlayerReady: boolean
  selectedSentence: PronunciationSentenceDto | null
  activeSentence: PronunciationSentenceDto | null
  playSentence: (sentence: PronunciationSentenceDto) => void
  clearSelectedSentence: () => void
  togglePlay: () => void
  setSpeed: (speed: number) => void
  toggleLoop: () => void
  seekTo: (time: number) => void
}

/**
 * Custom React hook to control a vanilla YouTube Iframe player
 * and orchestrate precision seek-and-pause shadowing playback.
 * 
 * @param videoUrl The URL of the YouTube video.
 * @param sentences Array of transcript sentences with precise start/end float timestamps.
 */
export function useYoutubeShadowing(
  videoUrl: string | null,
  sentences: PronunciationSentenceDto[]
): UseYoutubeShadowingReturn {
  const [isPlayerReady, setIsPlayerReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [isLooping, setIsLooping] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const [selectedSentence, setSelectedSentence] = useState<PronunciationSentenceDto | null>(null)
  const [activeSentence, setActiveSentence] = useState<PronunciationSentenceDto | null>(null)

  const playerRef = useRef<YTPlayer | null>(null)

  const selectedSentenceRef = useRef<PronunciationSentenceDto | null>(null)
  const isLoopingRef = useRef(isLooping)
  const playbackSpeedRef = useRef(playbackSpeed)
  const isPlayingRef = useRef(isPlaying)
  const sentencesRef = useRef<PronunciationSentenceDto[]>([])

  // Keep refs up-to-date for the interval polling loop to avoid stale closure state
  useEffect(() => {
    selectedSentenceRef.current = selectedSentence
  }, [selectedSentence])

  useEffect(() => {
    isLoopingRef.current = isLooping
  }, [isLooping])

  useEffect(() => {
    playbackSpeedRef.current = playbackSpeed
  }, [playbackSpeed])

  useEffect(() => {
    isPlayingRef.current = isPlaying
  }, [isPlaying])

  useEffect(() => {
    sentencesRef.current = sentences
  }, [sentences])

  const videoId = videoUrl ? extractYoutubeVideoId(videoUrl) : null

  // Initialize YouTube Iframe Player
  useEffect(() => {
    if (!videoId) {
      setIsPlayerReady(false)
      return
    }

    // Dynamic injection of the YouTube Iframe API if not already present
    if (typeof window !== "undefined" && !window.YT) {
      const tag = document.createElement("script")
      tag.src = "https://www.youtube.com/iframe_api"
      const firstScriptTag = document.getElementsByTagName("script")[0]
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
      }
    }

    let playerInstance: YTPlayer | null = null
    let checkYTInterval: NodeJS.Timeout | null = null
    let isDestroyed = false

    const initPlayer = (): void => {
      if (isDestroyed) return
      if (!window.YT || !window.YT.Player) return

      try {
        playerInstance = new window.YT.Player("shadowing-youtube-player", {
          height: "100%",
          width: "100%",
          videoId: videoId,
          playerVars: {
            playsinline: 1,
            controls: 1, // Let native controls remain for fallback, custom controls overlayed
            rel: 0,
            showinfo: 0,
            modestbranding: 1,
          },
          events: {
            onReady: (event) => {
              if (isDestroyed) return
              playerRef.current = event.target
              setIsPlayerReady(true)
              setDuration(event.target.getDuration() || 0)
              event.target.setPlaybackRate(playbackSpeedRef.current)
            },
            onStateChange: (event) => {
              if (isDestroyed) return
              const state = event.data
              // YT.PlayerState.PLAYING = 1, PAUSED = 2, BUFFERING = 3, CUED = 5, ENDED = 0
              if (state === 1) {
                setIsPlaying(true)
              } else {
                setIsPlaying(false)
              }
            },
          },
        })
      } catch (err) {
        console.error("Failed to construct YouTube player instance:", err)
      }
    }

    // Safely poll for the availability of window.YT namespace
    checkYTInterval = setInterval(() => {
      if (window.YT && window.YT.Player) {
        if (checkYTInterval) {
          clearInterval(checkYTInterval)
        }
        initPlayer()
      }
    }, 100)

    return () => {
      isDestroyed = true
      if (checkYTInterval) {
        clearInterval(checkYTInterval)
      }
      if (playerInstance && typeof playerInstance.destroy === "function") {
        try {
          playerInstance.destroy()
        } catch (e) {
          console.warn("YouTube player destroy error:", e)
        }
      }
      playerRef.current = null
      setIsPlayerReady(false)
      setIsPlaying(false)
      setSelectedSentence(null)
      setActiveSentence(null)
    }
  }, [videoId])

  // Precision time-tracking & seek-and-pause loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isPlaying && isPlayerReady) {
      interval = setInterval(() => {
        const player = playerRef.current
        if (!player || typeof player.getCurrentTime !== "function") return

        const time = player.getCurrentTime()
        setCurrentTime(time)

        const selected = selectedSentenceRef.current
        if (selected) {
          // Shadowing Mode: check if video exceeded selected sentence end time
          if (time >= selected.endTime) {
            if (isLoopingRef.current) {
              player.seekTo(selected.startTime, true)
            } else {
              player.pauseVideo()
              setSelectedSentence(null)
            }
          }
          setActiveSentence(selected)
        } else {
          // Continuous Play Mode: dynamically highlight active spoken sentence
          const currentSentences = sentencesRef.current
          const matchingSentence = currentSentences.find(
            (s) => time >= s.startTime && time <= s.endTime
          )
          if (matchingSentence) {
            setActiveSentence(matchingSentence)
          } else {
            setActiveSentence(null)
          }
        }
      }, 80)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isPlaying, isPlayerReady])

  // Hook actions
  const playSentence = (sentence: PronunciationSentenceDto): void => {
    const player = playerRef.current
    if (!player) return
    setSelectedSentence(sentence)
    setActiveSentence(sentence)
    player.seekTo(sentence.startTime, true)
    player.playVideo()
  }

  const clearSelectedSentence = (): void => {
    setSelectedSentence(null)
  }

  const togglePlay = (): void => {
    const player = playerRef.current
    if (!player) return
    if (isPlayingRef.current) {
      player.pauseVideo()
    } else {
      player.playVideo()
    }
  }

  const setSpeed = (speed: number): void => {
    setPlaybackSpeed(speed)
    const player = playerRef.current
    if (player && typeof player.setPlaybackRate === "function") {
      player.setPlaybackRate(speed)
    }
  }

  const toggleLoop = (): void => {
    setIsLooping((prev) => !prev)
  }

  const seekTo = (time: number): void => {
    const player = playerRef.current
    if (player && typeof player.seekTo === "function") {
      player.seekTo(time, true)
      setCurrentTime(time)
    }
  }

  return {
    isPlaying,
    playbackSpeed,
    isLooping,
    currentTime,
    duration,
    isPlayerReady,
    selectedSentence,
    activeSentence,
    playSentence,
    clearSelectedSentence,
    togglePlay,
    setSpeed,
    toggleLoop,
    seekTo,
  }
}
