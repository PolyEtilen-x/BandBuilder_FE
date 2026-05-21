import { useState, useEffect } from "react"
import MainLayout from "@/components/layout/MainLayout/MainLayout"
import {
  getWritingSampleTopics,
  getWritingSampleTopicDetail,
  type WritingTaskType,
  type WritingSampleTopicListItemDto,
  type WritingSampleTopicDetailDto,
  type WritingEssayDto,
} from "@/api/practiceGeneral.api"
import "./SampleWritings.css"

// ── Constants ──────────────────────────────────────────────────────────────

const BAND_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  "6": { bg: "#1c1917", border: "#78716c", text: "#d6d3d1" },
  "7": { bg: "#0c1a2e", border: "#3b82f6", text: "#bfdbfe" },
  "8": { bg: "#0d1f0d", border: "#22c55e", text: "#bbf7d0" },
}

function getBandColor(score: number) {
  const key = String(Math.floor(score))
  return BAND_COLORS[key] ?? { bg: "#1e1b4b", border: "#6366f1", text: "#e0e7ff" }
}

// ── Sub-components ─────────────────────────────────────────────────────────

function TaskTypeTab({
  active,
  label,
  id,
  onClick,
}: {
  active: boolean
  label: string
  id: string
  onClick: () => void
}): React.ReactElement {
  return (
    <button
      id={id}
      onClick={onClick}
      className={`sw-tab ${active ? "sw-tab--active" : "sw-tab--inactive"}`}
    >
      {label}
    </button>
  )
}

function TopicCard({
  topic,
  onSelect,
}: {
  topic: WritingSampleTopicListItemDto
  onSelect: (id: string) => void
}): React.ReactElement {
  return (
    <button
      id={`writing-topic-${topic.id}`}
      onClick={() => onSelect(topic.id)}
      className="sw-topic-card"
    >
      <div className="sw-topic-card__meta">
        <span
          className={`sw-topic-card__task-badge ${topic.taskType === "TASK_1"
            ? "sw-topic-card__task-badge--task1"
            : "sw-topic-card__task-badge--task2"
            }`}
        >
          {topic.taskType === "TASK_1" ? "Task 1" : "Task 2"}
        </span>
        <span className="sw-topic-card__category">{topic.category}</span>
      </div>
      <p className="sw-topic-card__preview">{topic.promptPreview}</p>
    </button>
  )
}

function EssayCard({ essay }: { essay: WritingEssayDto }): React.ReactElement {
  const [showTranslation, setShowTranslation] = useState(false)
  const colors = getBandColor(essay.bandScore)

  return (
    <div
      className="sw-essay-card"
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
      }}
    >
      {/* Band header */}
      <div
        className="sw-essay-card__header"
        style={{ borderBottom: `1px solid ${colors.border}` }}
      >
        <span className="sw-essay-card__band-label" style={{ color: colors.text }}>
          <span
            className="sw-essay-card__band-pill"
            style={{ background: colors.border }}
          >
            Band {essay.bandScore.toFixed(1)}
          </span>
          Sample Essay
        </span>
        <button
          id={`essay-toggle-translation-${essay.id}`}
          onClick={() => setShowTranslation((v) => !v)}
          className="sw-essay-card__translation-btn"
          style={{ border: `1px solid ${colors.border}`, color: colors.text }}
        >
          {showTranslation ? "Hide Translation" : "Show Translation 🇻🇳"}
        </button>
      </div>

      {/* Essay text */}
      <div className="sw-essay-card__body">
        <p className="sw-essay-card__text" style={{ color: colors.text }}>
          {essay.essayText}
        </p>

        {showTranslation && (
          <div
            className="sw-essay-card__translation"
            style={{ borderTop: `1px dashed ${colors.border}` }}
          >
            <p className="sw-essay-card__translation-text">
              {essay.essayTranslation}
            </p>
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
  detail: WritingSampleTopicDetailDto
  onBack: () => void
}): React.ReactElement {
  const [activeBand, setActiveBand] = useState<number | null>(null)

  const bands = [...new Set(detail.essays.map((e) => e.bandScore))].sort()

  const visibleEssays: WritingEssayDto[] =
    activeBand !== null
      ? detail.essays.filter((e) => e.bandScore === activeBand)
      : detail.essays

  return (
    <div className="sw-detail">
      {/* Back + badges */}
      <div className="sw-detail__nav">
        <button
          id="writing-back-btn"
          onClick={onBack}
          className="sw-detail__back-btn"
        >
          ← Back
        </button>
        <span
          className={`sw-detail__task-badge ${detail.taskType === "TASK_1"
            ? "sw-detail__task-badge--task1"
            : "sw-detail__task-badge--task2"
            }`}
        >
          {detail.taskType === "TASK_1" ? "Task 1" : "Task 2"}
        </span>
        <span className="sw-detail__category">{detail.category}</span>
      </div>

      {/* Prompt */}
      <div className="sw-prompt">
        <p className="sw-prompt__label">Writing Prompt</p>
        <p className="sw-prompt__text">{detail.prompt}</p>
        {detail.imageUrl && (
          <img
            src={detail.imageUrl}
            alt="Writing prompt diagram"
            className="sw-prompt__image"
          />
        )}
      </div>

      {/* Band filter */}
      {bands.length > 1 && (
        <div className="sw-band-filter">
          <button
            id="band-filter-all"
            onClick={() => setActiveBand(null)}
            className={`sw-band-btn ${activeBand === null ? "sw-band-btn--all-active" : "sw-band-btn--all-inactive"
              }`}
          >
            All bands
          </button>
          {bands.map((b) => (
            <button
              key={b}
              id={`band-filter-${b}`}
              onClick={() => setActiveBand(b)}
              className={`sw-band-btn ${activeBand === b ? "sw-band-btn--active" : "sw-band-btn--inactive"
                }`}
            >
              Band {b.toFixed(1)}
            </button>
          ))}
        </div>
      )}

      {/* Essays */}
      <div className="sw-essay-list">
        {visibleEssays.length === 0 ? (
          <p className="sw-essay-empty">No essays for this band yet.</p>
        ) : (
          visibleEssays.map((e) => <EssayCard key={e.id} essay={e} />)
        )}
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────

type ViewState = { type: "list" } | { type: "detail"; id: string }

export default function SampleWritingsPage(): React.ReactElement {
  const [view, setView] = useState<ViewState>({ type: "list" })
  const [activeTask, setActiveTask] = useState<WritingTaskType | "ALL">("ALL")
  const [topics, setTopics] = useState<WritingSampleTopicListItemDto[]>([])
  const [detail, setDetail] = useState<WritingSampleTopicDetailDto | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDetailLoading, setIsDetailLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    const taskType = activeTask === "ALL" ? undefined : activeTask
    getWritingSampleTopics(taskType)
      .then(setTopics)
      .catch(() => setError("Unable to load writing samples. Please try again."))
      .finally(() => setIsLoading(false))
  }, [activeTask])

  const handleSelectTopic = async (id: string): Promise<void> => {
    setIsDetailLoading(true)
    setError(null)
    try {
      const data = await getWritingSampleTopicDetail(id)
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

  const isSpinning = isLoading || isDetailLoading

  return (
    <MainLayout>
      <div className="sw-page">
        <div className="sw-container">

          {/* Header */}
          {view.type === "list" && (
            <div className="sw-header">
              <div className="sw-header__title-row">
                <span className="sw-header__icon">✍️</span>
                <h1 className="sw-header__title">Sample Writings</h1>
              </div>
              <p className="sw-header__subtitle">
                Study band 6+ to 8+ model essays for IELTS Writing Task 1 & Task 2.
              </p>

              {/* Task type tabs */}
              <div className="sw-tabs">
                <TaskTypeTab
                  id="tab-all"
                  label="All"
                  active={activeTask === "ALL"}
                  onClick={() => setActiveTask("ALL")}
                />
                <TaskTypeTab
                  id="tab-task1"
                  label="Task 1"
                  active={activeTask === "TASK_1"}
                  onClick={() => setActiveTask("TASK_1")}
                />
                <TaskTypeTab
                  id="tab-task2"
                  label="Task 2"
                  active={activeTask === "TASK_2"}
                  onClick={() => setActiveTask("TASK_2")}
                />
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="sw-error" role="alert">
              {error}
            </div>
          )}

          {/* Loading */}
          {isSpinning && (
            <div className="sw-loading" aria-busy="true" aria-label="Loading">
              <span className="sw-loading__spinner">⟳</span>
              Loading…
            </div>
          )}

          {/* Topic list */}
          {!isSpinning && view.type === "list" && (
            <>
              {topics.length === 0 && !error && (
                <div className="sw-empty">
                  <div className="sw-empty__icon">📭</div>
                  No writing samples available yet. Check back soon!
                </div>
              )}
              <div className="sw-topic-grid">
                {topics.map((t) => (
                  <TopicCard key={t.id} topic={t} onSelect={handleSelectTopic} />
                ))}
              </div>
            </>
          )}

          {/* Detail */}
          {!isSpinning && view.type === "detail" && detail && (
            <TopicDetail detail={detail} onBack={handleBack} />
          )}
        </div>
      </div>
    </MainLayout>
  )
}