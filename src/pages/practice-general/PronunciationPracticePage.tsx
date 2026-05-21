import { useState } from "react"
import MainLayout from "@/components/layout/MainLayout/MainLayout"
import {
  getPronunciationTopics,
  getPronunciationTopicDetail,
  type PronunciationTopicListItemDto,
  type PronunciationTopicDetailDto,
  type PronunciationVocabDto,
} from "@/api/practiceGeneral.api"
import "./Pronunciatione.css"

// ── Sub-components ─────────────────────────────────────────────────────────

function TopicCard({
  topic,
  onSelect,
}: {
  topic: PronunciationTopicListItemDto
  onSelect: (id: string) => void
}): React.ReactElement {
  return (
    <button
      id={`pronunciation-topic-${topic.id}`}
      onClick={() => onSelect(topic.id)}
      className="pp-topic-card"
    >
      <span className="pp-topic-card__title">{topic.title}</span>
      <span className="pp-topic-card__meta">
        <span>📚</span>
        {topic.vocabCount} key vocabularies
      </span>
    </button>
  )
}

function VocabCard({ vocab }: { vocab: PronunciationVocabDto }): React.ReactElement {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="pp-vocab-card">
      <button
        id={`vocab-card-${vocab.id}`}
        onClick={() => setIsExpanded((v) => !v)}
        className="pp-vocab-card__toggle"
      >
        <div className="pp-vocab-card__left">
          <span className="pp-vocab-card__word">{vocab.word}</span>
          <span className="pp-vocab-card__ipa">{vocab.ipa}</span>
          {vocab.audioUrl && (
            <a
              href={vocab.audioUrl}
              id={`vocab-audio-${vocab.id}`}
              onClick={(e) => e.stopPropagation()}
              className="pp-vocab-card__audio"
              aria-label={`Play pronunciation of ${vocab.word}`}
            >
              🔊
            </a>
          )}
        </div>
        <span className="pp-vocab-card__chevron">{isExpanded ? "▲" : "▼"}</span>
      </button>

      {isExpanded && (
        <div className="pp-vocab-card__body">
          <div>
            <span className="pp-vocab-card__field-label">Meaning</span>
            <p className="pp-vocab-card__meaning">{vocab.meaning}</p>
          </div>
          <div>
            <span className="pp-vocab-card__field-label">Example</span>
            <p className="pp-vocab-card__example">{vocab.example}</p>
            <p className="pp-vocab-card__translation">{vocab.exampleTranslation}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function TopicDetail({
  detail,
  onBack,
}: {
  detail: PronunciationTopicDetailDto
  onBack: () => void
}): React.ReactElement {
  return (
    <div className="pp-detail">
      {/* Back + title */}
      <div className="pp-detail__nav">
        <button
          id="pronunciation-back-btn"
          onClick={onBack}
          className="pp-detail__back-btn"
        >
          ← Back
        </button>
        <h2 className="pp-detail__title">{detail.title}</h2>
      </div>

      {/* Video */}
      {detail.videoUrl && (
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

      {/* Passage */}
      <div className="pp-passage">
        <div className="pp-passage__controls">
          {detail.audioUrl && (
            <a
              href={detail.audioUrl}
              id="pronunciation-passage-audio"
              className="pp-passage__listen-btn"
              aria-label="Play passage audio"
            >
              🔊 Listen
            </a>
          )}
          <span className="pp-passage__label">Reading Passage</span>
        </div>
        <p className="pp-passage__text">{detail.paragraph}</p>
      </div>

      {/* Vocab list */}
      {detail.vocabs.length > 0 && (
        <div className="pp-vocab">
          <h3 className="pp-vocab__heading">
            Key Vocabulary ({detail.vocabs.length})
          </h3>
          <div className="pp-vocab__list">
            {detail.vocabs.map((v) => (
              <VocabCard key={v.id} vocab={v} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────

type ViewState =
  | { type: "list" }
  | { type: "detail"; id: string }

export default function PronunciationPracticePage(): React.ReactElement {
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

  // Load list on mount via effect-free pattern: lazy init on first render
  if (!hasLoadedList && !isLoading && view.type === "list") {
    loadTopics()
  }

  return (
    <MainLayout>
      <div className="pp-page">
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
    </MainLayout>
  )
}