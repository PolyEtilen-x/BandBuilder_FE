import { useState, useRef, ReactElement } from "react"
import MainLayout from "@/components/layout/MainLayout/MainLayout"
import GeneralPracticeSidebar from "@/components/general_practice/GeneralPracticeSidebar"
import { useVocabStore } from "@/services/dictionary/vocab.store"
import {
  getPronunciationTopics,
  getPronunciationTopicDetail,
  type PronunciationTopicListItemDto,
  type PronunciationTopicDetailDto,
  type PronunciationVocabDto,
} from "@/api/practiceGeneral.api"
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

function TopicDetail({
  detail,
  onBack,
}: {
  detail: PronunciationTopicDetailDto
  onBack: () => void
}): ReactElement {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const togglePlay = (): void => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleTimeUpdate = (): void => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = (): void => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0)
    }
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const val = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = val
      setCurrentTime(val)
    }
  }

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return "00:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleEnded = (): void => {
    setIsPlaying(false)
    setCurrentTime(0)
  }

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
        {/* LEFT COLUMN: Player & Passage Script */}
        <div className="pp-detail-left">
          {detail.audioUrl && (
            <div className="pp-custom-player">
              <audio
                ref={audioRef}
                src={detail.audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
              />
              <button
                onClick={togglePlay}
                className="pp-player-play-btn"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? "⏸" : "▶"}
              </button>
              <div className="pp-player-progress-container">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSliderChange}
                  className="pp-player-slider"
                />
                <div className="pp-player-timers">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="pp-passage">
            <span className="pp-passage__label">Reading Passage</span>
            <p className="pp-passage__text">{detail.paragraph}</p>
          </div>

          {/* YouTube Video (Hides gracefully if empty/null) */}
          {detail.videoUrl && detail.videoUrl.trim() !== "" && (
            <div className="pp-video">
              <iframe
                id="pronunciation-video"
                src={detail.videoUrl}
                title={`Reading sample: ${detail.title}`}
                className="pp-video__iframe"
                allowFullScreen
              />
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Key Vocabularies */}
        <div className="pp-detail-right">
          <h3 className="pp-vocab__heading">
            Key Vocabulary ({detail.vocabs.length})
          </h3>
          {detail.vocabs.length > 0 ? (
            <div className="pp-vocab__list">
              {detail.vocabs.map((v) => (
                <VocabCard key={v.id} vocab={v} />
              ))}
            </div>
          ) : (
            <div className="pp-vocab-empty">No vocabulary lists available.</div>
          )}
        </div>
      </div>
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

  const loadTopics = async (): Promise<void> => {
    if (hasLoadedList) return
    setIsLoading(true)
    setError(null)
    try {
      const data = await getPronunciationTopics()
      setTopics(data)
      setHasLoadedList(true)
    } catch {
      setError("Unable to load topics. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

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

  // Load list on mount via lazy init
  if (!hasLoadedList && !isLoading && view.type === "list") {
    loadTopics()
  }

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