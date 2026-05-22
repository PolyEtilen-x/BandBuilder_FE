import { useState, useEffect, useRef, ReactElement } from "react"
import MainLayout from "@/components/layout/MainLayout/MainLayout"
import GeneralPracticeSidebar from "@/components/general_practice/GeneralPracticeSidebar"
import { useVocabStore } from "@/services/dictionary/vocab.store"
import { useDictionary } from "@/services/dictionary/useDictionary"
import DictionaryPanel from "@/components/dictionary/DictionaryPanel"
import {
  getPronunciationTopics,
  getPronunciationTopicDetail,
  type PronunciationTopicListItemDto,
  type PronunciationTopicDetailDto,
  type PronunciationVocabDto,
  type PronunciationSentenceDto,
} from "@/api/practiceGeneral.api"
import { useYoutubeShadowing } from "./useYoutubeShadowing"
import "./Pronunciation.css"

// ── Sub-components ─────────────────────────────────────────────────────────

function TopicCard({
  topic,
  onSelect,
}: {
  topic: PronunciationTopicListItemDto
  onSelect: (id: string) => void
}): ReactElement {
  return (
    <button
      id={`pronunciation-topic-${topic.id}`}
      onClick={() => onSelect(topic.id)}
      className="pp-topic-card"
    >
      <div className="pp-topic-card__header-row">
        <span className="pp-topic-card__icon">🎙️</span>
        <span className="pp-topic-card__title">{topic.title}</span>
      </div>
      <div className="pp-topic-card__meta">
        <span>📚</span>
        {topic.vocabCount} key vocabularies
      </div>
    </button>
  )
}

function VocabCard({ vocab }: { vocab: PronunciationVocabDto }): ReactElement {
  const { savedWords, addWord, removeWord } = useVocabStore()

  const isSaved = savedWords.some(
    (w) => w.word.toLowerCase() === vocab.word.toLowerCase()
  )

  const handleSaveToggle = (e: React.MouseEvent): void => {
    e.stopPropagation()
    if (isSaved) {
      removeWord(vocab.word)
    } else {
      addWord({
        word: vocab.word,
        phonetic: vocab.ipa,
        audio: vocab.audioUrl || "",
        meaning: vocab.meaning,
        related: "",
        explainVN: vocab.meaning,
        example: vocab.example || "",
        translation: vocab.exampleTranslation || "",
        isSaved: true,
        dateSaved: new Date().toISOString(),
      })
    }
  }

  const playAudio = (e: React.MouseEvent): void => {
    e.stopPropagation()
    if (vocab.audioUrl) {
      const audio = new Audio(vocab.audioUrl)
      audio.play().catch((err) => {
        console.warn("Audio URL play failed, falling back to speech synthesis", err)
        speakFallback()
      })
    } else {
      speakFallback()
    }
  }

  const speakFallback = (): void => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(vocab.word)
      utterance.lang = "en-US"
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="pp-vocab-card">
      <div className="pp-vocab-card__header">
        <div className="pp-vocab-card__word-section">
          <span className="pp-vocab-card__word">{vocab.word}</span>
          <span className="pp-vocab-card__ipa">{vocab.ipa}</span>
        </div>
        <div className="pp-vocab-card__actions">
          <button
            onClick={playAudio}
            className="pp-vocab-card__audio-btn"
            aria-label={`Play pronunciation of ${vocab.word}`}
          >
            🔊 Listen
          </button>
          <button
            onClick={handleSaveToggle}
            className={`pp-vocab-card__save-btn ${isSaved ? "saved" : ""}`}
          >
            {isSaved ? "✓ Đã lưu" : "+ Lưu từ"}
          </button>
        </div>
      </div>

      <div className="pp-vocab-card__body">
        <div className="pp-vocab-card__field">
          <span className="pp-vocab-card__field-label">Ý nghĩa</span>
          <p className="pp-vocab-card__meaning">{vocab.meaning}</p>
        </div>
        {vocab.example && (
          <div className="pp-vocab-card__field">
            <span className="pp-vocab-card__field-label">Ví dụ</span>
            <p className="pp-vocab-card__example">{vocab.example}</p>
            {vocab.exampleTranslation && (
              <p className="pp-vocab-card__translation">{vocab.exampleTranslation}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Helper to translate English text to Vietnamese using the public translation endpoint.
 */
async function translateToVietnamese(text: string): Promise<string> {
  if (!text || !text.trim()) return ""
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${encodeURIComponent(
      text
    )}`
    const res = await fetch(url)
    if (!res.ok) return ""
    const data = (await res.json()) as Array<Array<[string, ...unknown[]]>>
    return (
      data[0]
        ?.map((segment) => segment[0])
        .filter(Boolean)
        .join("") || ""
    )
  } catch (error) {
    console.error("Failed to translate transcript sentence:", error)
    return ""
  }
}

function TopicDetail({
  detail,
  onBack,
}: {
  detail: PronunciationTopicDetailDto
  onBack: () => void
}): ReactElement {
  const [activeTab, setActiveTab] = useState<"shadowing" | "vocab">("shadowing")

  // Dictionary lookup hook
  const {
    dict,
    loading: dictLoading,
    lookup,
    close: closeDict,
    save: saveDict,
  } = useDictionary()

  // Sentence translation states
  const [translations, setTranslations] = useState<Record<string, string>>({})
  const [translatingIds, setTranslatingIds] = useState<Record<string, boolean>>({})

  // Custom YouTube Shadowing hook
  const {
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
  } = useYoutubeShadowing(detail.videoUrl, detail.sentences || [])

  // Legacy HTML5 Audio Player state (for graceful fallback if videoUrl is missing)
  const [legacyPlaying, setLegacyPlaying] = useState(false)
  const [legacyTime, setLegacyTime] = useState(0)
  const [legacyDuration, setLegacyDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const toggleLegacyPlay = (): void => {
    if (!audioRef.current) return
    if (legacyPlaying) {
      audioRef.current.pause()
      setLegacyPlaying(false)
    } else {
      audioRef.current.play()
      setLegacyPlaying(true)
    }
  }

  const handleLegacyTimeUpdate = (): void => {
    if (audioRef.current) {
      setLegacyTime(audioRef.current.currentTime)
    }
  }

  const handleLegacyLoadedMetadata = (): void => {
    if (audioRef.current) {
      setLegacyDuration(audioRef.current.duration || 0)
    }
  }

  const handleLegacySliderChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const val = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = val
      setLegacyTime(val)
    }
  }

  const handleLegacyEnded = (): void => {
    setLegacyPlaying(false)
    setLegacyTime(0)
  }

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return "00:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`
  }

  const handleWordClick = (word: string, contextSentence: string): void => {
    // Strip trailing or leading punctuation markers for precise lookup dictionary queries
    const cleanWord = word
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'“]/g, "")
      .trim()
    if (cleanWord) {
      lookup(cleanWord, contextSentence)
    }
  }

  const handleTranslateSentence = async (
    e: React.MouseEvent,
    sentenceId: string,
    text: string
  ): Promise<void> => {
    e.stopPropagation() // Avoid triggering play sentence bounds
    if (translations[sentenceId]) {
      setTranslations((prev) => {
        const next = { ...prev }
        delete next[sentenceId]
        return next
      })
      return
    }

    setTranslatingIds((prev) => ({ ...prev, [sentenceId]: true }))
    try {
      const translated = await translateToVietnamese(text)
      setTranslations((prev) => ({ ...prev, [sentenceId]: translated }))
    } catch (err) {
      console.error("Sentence translation error:", err)
    } finally {
      setTranslatingIds((prev) => ({ ...prev, [sentenceId]: false }))
    }
  }

  const renderClickableText = (text: string): ReactElement[] => {
    return text.split(/\s+/).map((word, idx) => {
      return (
        <span
          key={idx}
          className="pp-word-token"
          onClick={(e) => {
            e.stopPropagation()
            handleWordClick(word, text)
          }}
        >
          {word}{" "}
        </span>
      )
    })
  }

  const hasVideo = detail.videoUrl && detail.videoUrl.trim() !== ""

  return (
    <div className="pp-detail">
      {/* Navigation */}
      <div className="pp-detail__nav">
        <button
          id="pronunciation-back-btn"
          onClick={onBack}
          className="pp-detail__back-btn"
        >
          ← Back to Topics
        </button>
        <h2 className="pp-detail__title">{detail.title}</h2>
      </div>

      <div className="pp-detail-grid">
        {/* LEFT COLUMN: Player (YouTube Shadowing or Graceful Fallback) */}
        <div className="pp-detail-left">
          {hasVideo ? (
            <div className="pp-youtube-wrapper">
              <div className="pp-video">
                {/* Standard Youtube Iframe element targeted by the API */}
                <div
                  id="shadowing-youtube-player"
                  style={{ width: "100%", height: "100%" }}
                />
              </div>

              {/* Premium Controls */}
              <div className="pp-youtube-controls">
                <div className="pp-yt-controls-left">
                  <button
                    onClick={togglePlay}
                    disabled={!isPlayerReady}
                    className={`pp-yt-control-btn ${isPlaying ? "active" : ""}`}
                  >
                    {isPlaying ? "⏸ Pause" : "▶ Play"}
                  </button>

                  <button
                    onClick={toggleLoop}
                    disabled={!isPlayerReady}
                    className={`pp-yt-control-btn ${isLooping ? "active" : ""}`}
                  >
                    🔁 Loop Sentence
                  </button>

                  {selectedSentence && (
                    <button
                      onClick={clearSelectedSentence}
                      className="pp-yt-control-btn"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}
                  >
                    SPEED:
                  </span>
                  {[0.75, 1, 1.25, 1.5].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setSpeed(speed)}
                      disabled={!isPlayerReady}
                      className={`pp-yt-control-btn ${
                        playbackSpeed === speed ? "active" : ""
                      }`}
                      style={{ padding: "4px 8px", fontSize: "11px" }}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>

                <div className="pp-yt-status-chip">
                  {selectedSentence
                    ? `Shadowing (Sentence ${selectedSentence.orderIndex + 1})`
                    : "Continuous Playback"}
                  {" · "}
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>
            </div>
          ) : (
            // GRACEFUL LEGACY FALLBACK (Audio + Raw Passage text)
            <>
              {detail.audioUrl && (
                <div className="pp-custom-player">
                  <audio
                    ref={audioRef}
                    src={detail.audioUrl}
                    onTimeUpdate={handleLegacyTimeUpdate}
                    onLoadedMetadata={handleLegacyLoadedMetadata}
                    onEnded={handleLegacyEnded}
                  />
                  <button
                    onClick={toggleLegacyPlay}
                    className="pp-player-play-btn"
                    aria-label={legacyPlaying ? "Pause" : "Play"}
                  >
                    {legacyPlaying ? "⏸" : "▶"}
                  </button>
                  <div className="pp-player-progress-container">
                    <input
                      type="range"
                      min={0}
                      max={legacyDuration || 100}
                      value={legacyTime}
                      onChange={handleLegacySliderChange}
                      className="pp-player-slider"
                    />
                    <div className="pp-player-timers">
                      <span>{formatTime(legacyTime)}</span>
                      <span>{formatTime(legacyDuration)}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="pp-passage">
                <span className="pp-passage__label">Reading Passage</span>
                <p className="pp-passage__text">{detail.paragraph}</p>
              </div>
            </>
          )}

          {/* Passage description text at the bottom */}
          {hasVideo && detail.paragraph && (
            <div className="pp-passage" style={{ marginTop: "16px" }}>
              <span className="pp-passage__label">
                Full Topic Transcript Overview
              </span>
              <p className="pp-passage__text">{detail.paragraph}</p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Premium Workspace Tabs (Shadowing sentences & Key Vocabulary) */}
        <div className="pp-detail-right">
          <div className="pp-workspace-tabs">
            <button
              onClick={() => setActiveTab("shadowing")}
              className={`pp-tab-btn ${
                activeTab === "shadowing" ? "active" : ""
              }`}
            >
              🎙️ Shadowing Practice
            </button>
            <button
              onClick={() => setActiveTab("vocab")}
              className={`pp-tab-btn ${activeTab === "vocab" ? "active" : ""}`}
            >
              📚 Key Vocabulary ({detail.vocabs.length})
            </button>
          </div>

          {activeTab === "shadowing" ? (
            <div className="pp-shadowing-list">
              {detail.sentences && detail.sentences.length > 0 ? (
                detail.sentences.map((sentence) => {
                  const isSentenceActive = activeSentence?.id === sentence.id
                  const isTranslating = translatingIds[sentence.id]
                  const hasTranslation = !!translations[sentence.id]

                  return (
                    <div
                      key={sentence.id}
                      onClick={() => playSentence(sentence)}
                      className={`pp-sentence-row ${
                        isSentenceActive ? "active" : ""
                      }`}
                    >
                      <div className="pp-sentence-header">
                        <span className="pp-sentence-time">
                          ⏱ {formatTime(sentence.startTime)} -{" "}
                          {formatTime(sentence.endTime)}
                        </span>
                        <button
                          onClick={(e) =>
                            handleTranslateSentence(
                              e,
                              sentence.id,
                              sentence.text
                            )
                          }
                          className="pp-sentence-translate-btn"
                        >
                          {isTranslating
                            ? "Translating..."
                            : hasTranslation
                            ? "✕ Hide Trans"
                            : "🌐 Translate"}
                        </button>
                      </div>

                      <div
                        className="pp-sentence-text"
                        style={{
                          fontSize: "14.5px",
                          lineHeight: "1.7",
                          color: "#374151",
                        }}
                      >
                        {renderClickableText(sentence.text)}
                      </div>

                      {hasTranslation && (
                        <p className="pp-sentence-translation-text">
                          {translations[sentence.id]}
                        </p>
                      )}
                    </div>
                  )
                })
              ) : (
                <div className="pp-vocab-empty">
                  No shadowing sentences synced for this topic yet. You can
                  still use the Full Transcript view below the video.
                </div>
              )}
            </div>
          ) : (
            // VOCABULARY TAB
            <>
              {detail.vocabs.length > 0 ? (
                <div className="pp-vocab__list">
                  {detail.vocabs.map((v) => (
                    <VocabCard key={v.id} vocab={v} />
                  ))}
                </div>
              ) : (
                <div className="pp-vocab-empty">
                  No vocabulary lists available.
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Dictionary drawer panel */}
      {dict && (
        <DictionaryPanel
          dict={dict}
          loading={dictLoading}
          onClose={closeDict}
          onSave={saveDict}
        />
      )}
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────

type ViewState =
  | { type: "list" }
  | { type: "detail"; id: string }

export default function PronunciationPracticePage(): ReactElement {
  const [view, setView] = useState<ViewState>({ type: "list" })
  const [topics, setTopics] = useState<PronunciationTopicListItemDto[]>([])
  const [detail, setDetail] = useState<PronunciationTopicDetailDto | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDetailLoading, setIsDetailLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasLoadedList, setHasLoadedList] = useState(false)

  const handleSelectTopic = async (id: string): Promise<void> => {
    setIsDetailLoading(true)
    setError(null)
    try {
      const data = await getPronunciationTopicDetail(id)
      setDetail(data)
      setView({ type: "detail", id })
    } catch {
      setError("Unable to load topic details. Please try again.")
    } finally {
      setIsDetailLoading(false)
    }
  }

  const handleBack = (): void => {
    setView({ type: "list" })
    setDetail(null)
  }

  // Load list on mount
  useEffect(() => {
    if (view.type === "list" && !hasLoadedList) {
      setIsLoading(true)
      setError(null)
      getPronunciationTopics()
        .then((data) => {
          setTopics(data)
          setHasLoadedList(true)
        })
        .catch(() => {
          setError("Unable to load topics. Please try again.")
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [view.type, hasLoadedList])

  return (
    <MainLayout>
      <div
        style={{
          display: "flex",
          gap: 30,
          maxWidth: 1200,
          margin: "0 auto",
          padding: "30px 20px",
          alignItems: "flex-start",
          height: "calc(100vh - 80px)",
          overflow: "hidden",
        }}
      >
        {/* SIDEBAR */}
        <GeneralPracticeSidebar />

        {/* WORKSPACE CONTENT */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            height: "100%",
          }}
        >
          <div className="pp-container">
            {/* Page header */}
            {view.type === "list" && (
              <div className="pp-header">
                <div className="pp-header__title-row">
                  <span className="pp-header__icon">🎙️</span>
                  <h1 className="pp-header__title">Pronunciation Practice</h1>
                </div>
                <p className="pp-header__subtitle">
                  Choose a passage to practise reading aloud with IPA guide and key vocabulary.
                </p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="pp-error" role="alert">
                {error}
              </div>
            )}

            {/* Loading spinner */}
            {(isLoading || isDetailLoading) && (
              <div
                className="pp-loading"
                aria-busy="true"
                aria-label="Loading"
              >
                <span className="pp-loading__spinner">⟳</span>
                Loading…
              </div>
            )}

            {/* Topic list */}
            {!isLoading && !isDetailLoading && view.type === "list" && (
              <>
                {topics.length === 0 && hasLoadedList && !error && (
                  <div className="pp-empty">
                    <div className="pp-empty__icon">📭</div>
                    No pronunciation topics available yet. Check back soon!
                  </div>
                )}
                <div className="pp-topic-grid">
                  {topics.map((t) => (
                    <TopicCard key={t.id} topic={t} onSelect={handleSelectTopic} />
                  ))}
                </div>
              </>
            )}

            {/* Topic detail */}
            {!isDetailLoading && view.type === "detail" && detail && (
              <TopicDetail detail={detail} onBack={handleBack} />
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}