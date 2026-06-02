import { useState, useEffect, ReactElement, useMemo } from "react"
import MainLayout from "@/components/layout/MainLayout/MainLayout"
import GeneralPracticeSidebar from "@/components/general_practice/GeneralPracticeSidebar"
import {
  Search,
  BookOpen,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  FileText,
  Clock,
  Crown,
} from "lucide-react"
import {
  getWritingSampleTopics,
  getWritingSampleTopicDetail,
  type WritingTaskType,
  type WritingSampleTopicListItemDto,
  type WritingSampleTopicDetailDto,
  type WritingEssayDto,
  type EssayAnalysis,
} from "@/api/practiceGeneral.api"
import "./SampleWritings.css"

// ── Constants ──────────────────────────────────────────────────────────────

const BAND_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  "6": { bg: "#f9fafb", border: "#e5e7eb", text: "#4b5563" },
  "7": { bg: "#eff6ff", border: "#bfdbfe", text: "#1e40af" },
  "8": { bg: "#ecfdf5", border: "#a7f3d0", text: "#065f46" },
}

function getBandColor(score: number) {
  const key = String(Math.floor(score))
  return BAND_COLORS[key] ?? { bg: "#f5f3ff", border: "#ddd6fe", text: "#5b21b6" }
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
}): ReactElement {
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
}): ReactElement {
  return (
    <button
      id={`writing-topic-${topic.id}`}
      onClick={() => onSelect(topic.id)}
      className="sw-topic-card"
    >
      <div className="sw-topic-card__meta">
        <span
          className={`sw-topic-card__task-badge ${
            topic.taskType === "TASK_1"
              ? "sw-topic-card__task-badge--task1"
              : "sw-topic-card__task-badge--task2"
          }`}
        >
          {topic.taskType === "TASK_1" ? "Task 1" : "Task 2"}
        </span>
        <span className="sw-topic-card__category">{topic.category}</span>
      </div>
      <p className="sw-topic-card__prompt-text">
        {topic.prompt && topic.prompt.length > 165
          ? topic.prompt.substring(0, 165) + "..."
          : topic.prompt || "No prompt available"}
      </p>
      
      <div className="sw-topic-card__footer">
        <span className="sw-topic-card__count">
          <BookOpen size={13} style={{ marginRight: 4 }} />
          {topic.essayCount} {topic.essayCount === 1 ? "Sample Essay" : "Sample Essays"}
        </span>
        <span className="sw-topic-card__action">Study →</span>
      </div>
    </button>
  )
}

function AIAnalysisPanel({ analysis }: { analysis: EssayAnalysis }): ReactElement {
  const criteria = [
    { key: "taskAchievement", label: "Task Achievement / Response", score: analysis.taskAchievement },
    { key: "coherenceCohesion", label: "Coherence & Cohesion", score: analysis.coherenceCohesion },
    { key: "lexicalResource", label: "Lexical Resource", score: analysis.lexicalResource },
    { key: "grammaticalRange", label: "Grammatical Range & Accuracy", score: analysis.grammaticalRange },
  ]

  return (
    <div className="sw-ai-analysis">
      <div className="sw-ai-criteria">
        <span className="sw-ai-heading">Band Breakdown</span>
        <div className="sw-ai-criteria-grid">
          {criteria.map((c) => {
            if (c.score === undefined || c.score === null) return null
            const percentage = (c.score / 9) * 100
            
            let barColor = "linear-gradient(90deg, #94a3b8, #64748b)"
            if (c.score >= 8.0) {
              barColor = "linear-gradient(90deg, #10b981, #047857)"
            } else if (c.score >= 7.0) {
              barColor = "linear-gradient(90deg, #3b82f6, #1d4ed8)"
            } else if (c.score >= 6.0) {
              barColor = "linear-gradient(90deg, #f59e0b, #b45309)"
            }

            return (
              <div key={c.key} className="sw-ai-criterion-row">
                <div className="sw-ai-criterion-info">
                  <span className="sw-ai-criterion-label">{c.label}</span>
                  <span className="sw-ai-criterion-score">Band {c.score.toFixed(1)}</span>
                </div>
                <div className="sw-ai-progress-track">
                  <div 
                    className="sw-ai-progress-fill" 
                    style={{ width: `${percentage}%`, background: barColor }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="sw-ai-highlights-grid">
        {analysis.strengths && analysis.strengths.length > 0 && (
          <div className="sw-ai-highlights sw-ai-highlights--strengths">
            <span className="sw-ai-heading sw-ai-heading--strengths">
              <CheckCircle2 size={13} style={{ marginRight: 6 }} /> Key Strengths
            </span>
            <ul className="sw-ai-list">
              {analysis.strengths.map((s, idx) => (
                <li key={idx} className="sw-ai-list-item">
                  <span className="sw-ai-bullet sw-ai-bullet--strength">✓</span>
                  <span className="sw-ai-list-text">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {analysis.improvements && analysis.improvements.length > 0 && (
          <div className="sw-ai-highlights sw-ai-highlights--improvements">
            <span className="sw-ai-heading sw-ai-heading--improvements">
              <AlertTriangle size={13} style={{ marginRight: 6 }} /> Areas to Improve
            </span>
            <ul className="sw-ai-list">
              {analysis.improvements.map((imp, idx) => (
                <li key={idx} className="sw-ai-list-item">
                  <span className="sw-ai-bullet sw-ai-bullet--improve">!</span>
                  <span className="sw-ai-list-text">{imp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {analysis.overallComment && (
        <div className="sw-ai-overall">
          <span className="sw-ai-heading">AI Summary & Advice</span>
          <p className="sw-ai-comment">{analysis.overallComment}</p>
        </div>
      )}
    </div>
  )
}

function EssayCard({ essay }: { essay: WritingEssayDto }): ReactElement {
  const [showTranslation, setShowTranslation] = useState(false)
  const [isAnalysisExpanded, setIsAnalysisExpanded] = useState(false)
  const [isTextExpanded, setIsTextExpanded] = useState(false)

  const colors = getBandColor(essay.bandScore)
  const wordCount = useMemo(() => {
    if (!essay.essayText) return 0
    return essay.essayText.trim().split(/\s+/).filter(Boolean).length
  }, [essay.essayText])
  
  const isLong = wordCount > 200

  return (
    <div
      className="sw-essay-card"
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
      }}
    >
      <div
        className="sw-essay-card__header"
        style={{ borderBottom: `1px solid ${colors.border}` }}
      >
        <div className="sw-essay-card__header-left">
          <span
            className="sw-essay-card__band-pill"
            style={{ background: colors.border, color: colors.text }}
          >
            Band {essay.bandScore.toFixed(1)}
          </span>
          <span className="sw-essay-card__band-label" style={{ color: colors.text }}>
            Model Essay
          </span>
        </div>
        <div className="sw-essay-card__header-right">
          <span className="sw-essay-card__wordcount" style={{ color: colors.text }}>
            <FileText size={13} style={{ marginRight: 4 }} />
            {wordCount} words
          </span>
          <button
            id={`essay-toggle-translation-${essay.id}`}
            onClick={() => setShowTranslation((v) => !v)}
            className="sw-essay-card__translation-btn"
            style={{ border: `1px solid ${colors.border}`, color: colors.text }}
          >
            {showTranslation ? "Hide Translation" : "Translation 🇻🇳"}
          </button>
        </div>
      </div>

      <div className="sw-essay-card__body">
        <div className={`sw-essay-card__text-container ${!isTextExpanded && isLong ? "sw-essay-card__text-container--collapsed" : ""}`}>
          <p className="sw-essay-card__text" style={{ color: colors.text }}>
            {essay.essayText}
          </p>
        </div>
        
        {isLong && (
          <button 
            onClick={() => setIsTextExpanded(!isTextExpanded)}
            className="sw-essay-card__expand-text-btn"
            style={{ color: colors.text }}
          >
            {isTextExpanded ? (
              <>Show Less <ChevronUp size={13} style={{ marginLeft: 4 }} /></>
            ) : (
              <>Read Full Essay <ChevronDown size={13} style={{ marginLeft: 4 }} /></>
            )}
          </button>
        )}

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

      {essay.analysis && (
        <div className="sw-analysis-panel" style={{ borderTop: `1px solid ${colors.border}` }}>
          <button
            onClick={() => setIsAnalysisExpanded(!isAnalysisExpanded)}
            className="sw-analysis-panel__trigger"
            style={{ color: colors.text }}
          >
            <span className="sw-analysis-panel__trigger-title">
              <Sparkles size={14} className="sw-sparkle-icon" />
              AI Detailed Evaluation
            </span>
            <span className="sw-analysis-panel__trigger-icon">
              {isAnalysisExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </span>
          </button>

          {isAnalysisExpanded && (
            <div className="sw-analysis-panel__content">
              <AIAnalysisPanel analysis={essay.analysis} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function WritingSidebar({ taskType }: { taskType: WritingTaskType }): ReactElement {
  const tips = taskType === "TASK_1" ? [
    { title: "Suggested Time", detail: "Spend no more than 20 minutes." },
    { title: "Target Length", detail: "Write at least 150 words." },
    { title: "Key Focus", detail: "Describe main features and trends clearly. Group data logically and write a robust overview." },
    { title: "Vocabulary", detail: "Use comparative language ('substantially higher') and change verbs ('fluctuated', 'surged')." }
  ] : [
    { title: "Suggested Time", detail: "Spend around 40 minutes." },
    { title: "Target Length", detail: "Write at least 250 words." },
    { title: "Structure", detail: "Use standard 4 paragraphs: Introduction, 2 Body paragraphs with topic sentences, and a Conclusion." },
    { title: "Key Focus", detail: "Clearly state your position, answer all prompt directives, and support points with clear examples." },
    { title: "Vocabulary", detail: "Use academic cohesion linkers ('consequently', 'nevertheless') and precise lexical units." }
  ]

  return (
    <div className="sw-sidebar">
      <div className="sw-sidebar-card">
        <h4 className="sw-sidebar-title">
          <Clock size={15} style={{ marginRight: 6 }} />
          Exam Cheat Sheet
        </h4>
        <div className="sw-sidebar-tips">
          {tips.map((tip, idx) => (
            <div key={idx} className="sw-sidebar-tip-item">
              <span className="sw-sidebar-tip-title">{tip.title}</span>
              <p className="sw-sidebar-tip-desc">{tip.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="sw-sidebar-card sw-sidebar-card--premium">
        <div className="sw-premium-glow" />
        <Crown className="sw-premium-crown" size={32} />
        <h4 className="sw-premium-title">Upgrade to Premium</h4>
        <p className="sw-premium-text">
          Want instant AI scoring and detailed criteria feedback on <strong>your own writing attempts</strong>?
        </p>
        <ul className="sw-premium-list">
          <li>✨ Unlimited essays scored</li>
          <li>📊 Visual category analytics</li>
          <li>📝 1-on-1 vocabulary help</li>
        </ul>
        <a href="/upgrade" className="sw-premium-btn">
          Unlock AI Feedback
        </a>
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
}): ReactElement {
  const [activeBand, setActiveBand] = useState<number | null>(null)

  const bands = useMemo(() => {
    const list = [...new Set(detail.essays.map((e) => e.bandScore))]
    return list.sort((a, b) => a - b)
  }, [detail.essays])

  const visibleEssays: WritingEssayDto[] = useMemo(() => {
    if (activeBand !== null) {
      return detail.essays.filter((e) => e.bandScore === activeBand)
    }
    return detail.essays
  }, [detail.essays, activeBand])

  return (
    <div className="sw-detail-layout-grid">
      <div className="sw-detail-main">
        <div className="sw-detail__nav">
          <button
            id="writing-back-btn"
            onClick={onBack}
            className="sw-detail__back-btn"
          >
            ← Back
          </button>
          <span
            className={`sw-detail__task-badge ${
              detail.taskType === "TASK_1"
                ? "sw-detail__task-badge--task1"
                : "sw-detail__task-badge--task2"
            }`}
          >
            {detail.taskType === "TASK_1" ? "Task 1" : "Task 2"}
          </span>
          <span className="sw-detail__category">{detail.category}</span>
        </div>

        <div className="sw-prompt-card">
          <div className="sw-prompt-card__header">
            <span className="sw-prompt-card__label">IELTS Writing Prompt</span>
            <span className="sw-prompt-card__meta-chip">
              {detail.taskType === "TASK_1" ? "⏱ 20 Min · ✍️ Min 150 words" : "⏱ 40 Min · ✍️ Min 250 words"}
            </span>
          </div>
          <p className="sw-prompt-card__text">{detail.prompt}</p>
          {detail.imageUrl && (
            <div className="sw-prompt-card__image-container">
              <img
                src={detail.imageUrl}
                alt="Writing prompt diagram"
                className="sw-prompt-card__image"
              />
            </div>
          )}
        </div>

        <div className="sw-band-filter-section">
          <span className="sw-band-filter-label">Model essays:</span>
          <div className="sw-band-filter">
            <button
              id="band-filter-all"
              onClick={() => setActiveBand(null)}
              className={`sw-band-btn sw-band-btn--all ${
                activeBand === null ? "sw-band-btn--all-active" : "sw-band-btn--all-inactive"
              }`}
            >
              All Scores
            </button>
            {bands.map((b) => {
              const isActive = activeBand === b
              const colors = getBandColor(b)
              return (
                <button
                  key={b}
                  id={`band-filter-${b}`}
                  onClick={() => setActiveBand(b)}
                  className={`sw-band-btn sw-band-btn--band ${
                    isActive ? "sw-band-btn--active" : "sw-band-btn--inactive"
                  }`}
                  style={isActive ? {
                    backgroundColor: colors.text,
                    color: "#ffffff"
                  } : {
                    borderColor: colors.border,
                    color: colors.text
                  }}
                >
                  Band {b.toFixed(1)}
                </button>
              )
            })}
          </div>
        </div>

        <div className="sw-essay-list">
          {visibleEssays.length === 0 ? (
            <div className="sw-essay-empty-card">
              <p className="sw-essay-empty">No essays for this band score yet.</p>
            </div>
          ) : (
            visibleEssays.map((e) => <EssayCard key={e.id} essay={e} />)
          )}
        </div>
      </div>

      <div className="sw-detail-sidebar">
        <WritingSidebar taskType={detail.taskType} />
      </div>
    </div>
  )
}

function TopicListSkeleton(): ReactElement {
  return (
    <div className="sw-skeleton-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="sw-skeleton-card">
          <div className="sw-skeleton-meta">
            <div className="sw-skeleton-pulse sw-skeleton-badge" />
            <div className="sw-skeleton-pulse sw-skeleton-chip" />
          </div>
          <div className="sw-skeleton-pulse sw-skeleton-text-1" />
          <div className="sw-skeleton-pulse sw-skeleton-text-2" />
          <div className="sw-skeleton-pulse sw-skeleton-footer" />
        </div>
      ))}
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────

type ViewState = { type: "list" } | { type: "detail"; id: string }

export default function SampleWritingsPage(): ReactElement {
  const [view, setView] = useState<ViewState>({ type: "list" })
  const [activeTask, setActiveTask] = useState<WritingTaskType | "ALL">("ALL")
  const [topics, setTopics] = useState<WritingSampleTopicListItemDto[]>([])
  const [detail, setDetail] = useState<WritingSampleTopicDetailDto | null>(null)
  
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const [isLoading, setIsLoading] = useState(false)
  const [isDetailLoading, setIsDetailLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    const taskType = activeTask === "ALL" ? undefined : activeTask
    getWritingSampleTopics(taskType)
      .then((data) => {
        setTopics(data)
        setSelectedCategory("All")
      })
      .catch(() => setError("Unable to load writing samples. Please try again."))
      .finally(() => setIsLoading(false))
  }, [activeTask])

  const categories = useMemo(() => {
    const cats = topics.map((t) => t.category).filter(Boolean)
    return ["All", ...Array.from(new Set(cats))]
  }, [topics])

  const filteredTopics = useMemo(() => {
    return topics.filter((t) => {
      const matchesCategory =
        selectedCategory === "All" ||
        (t.category && t.category.toLowerCase() === selectedCategory.toLowerCase())

      const matchesSearch =
        searchQuery.trim() === "" ||
        (t.category && t.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.prompt && t.prompt.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchesCategory && matchesSearch
    })
  }, [topics, selectedCategory, searchQuery])

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

  return (
    <MainLayout>
      <div
        className="sw-page-wrapper"
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
        <GeneralPracticeSidebar />

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
          <div className="sw-container">
            {view.type === "list" && (
              <div className="sw-header">
                <div className="sw-header__title-row">
                  <span className="sw-header__icon">✍️</span>
                  <h1 className="sw-header__title">Sample Writings</h1>
                </div>
                <p className="sw-header__subtitle">
                  Study band 6.0+ to 8.5+ model essays for IELTS Writing Task 1 & Task 2.
                </p>

                <div className="sw-search-wrapper">
                  <Search size={16} className="sw-search-icon" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search topics by keywords or prompts..."
                    className="sw-search-input"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="sw-search-clear"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="sw-filter-controls">
                  <div className="sw-tabs">
                    <TaskTypeTab
                      id="tab-all"
                      label="All Tasks"
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

                {categories.length > 1 && (
                  <div className="sw-category-chips">
                    {categories.map((cat) => {
                      const isActive = selectedCategory === cat
                      return (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`sw-cat-chip ${
                            isActive ? "sw-cat-chip--active" : "sw-cat-chip--inactive"
                          }`}
                        >
                          {cat}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="sw-error" role="alert">
                ⚠️ {error}
              </div>
            )}

            {isLoading && <TopicListSkeleton />}

            {isDetailLoading && (
              <div className="sw-detail-loading" aria-busy="true" aria-label="Loading">
                <span className="sw-loading__spinner">⟳</span>
                Loading essays...
              </div>
            )}

            {!isLoading && !isDetailLoading && view.type === "list" && (
              <>
                {filteredTopics.length === 0 ? (
                  <div className="sw-empty-card">
                    <div className="sw-empty-card__icon">📭</div>
                    <h3>No topics found</h3>
                    <p>Try refining your search query or choosing another category filter.</p>
                    {(searchQuery || selectedCategory !== "All") && (
                      <button 
                        onClick={() => {
                          setSearchQuery("")
                          setSelectedCategory("All")
                        }} 
                        className="sw-empty-card__reset"
                      >
                        Reset filters
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="sw-topic-grid">
                    {filteredTopics.map((t) => (
                      <TopicCard key={t.id} topic={t} onSelect={handleSelectTopic} />
                    ))}
                  </div>
                )}
              </>
            )}

            {!isLoading && !isDetailLoading && view.type === "detail" && detail && (
              <TopicDetail detail={detail} onBack={handleBack} />
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}