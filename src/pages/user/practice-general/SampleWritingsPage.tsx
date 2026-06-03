import { useState, useEffect, ReactElement, useMemo } from "react"
import MainLayout from "@/components/layout/MainLayout/MainLayout"
import GeneralPracticeSidebar from "@/components/general_practice/GeneralPracticeSidebar"
import {
  Search,
  BookOpen,
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
          className={`sw-topic-card__task-badge ${topic.taskType === "TASK_1"
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

const renderParagraphs = (text: string) => {
  if (!text) return null
  return text.split(/\n+/).map((para, i) => {
    const trimmed = para.trim()
    if (!trimmed) return null
    return (
      <p key={i} className="sw-blog-paragraph">
        {trimmed}
      </p>
    )
  })
}

function EssayCard({ essay }: { essay: WritingEssayDto }): ReactElement {
  const wordCount = useMemo(() => {
    if (!essay.essayText) return 0
    return essay.essayText.trim().split(/\s+/).filter(Boolean).length
  }, [essay.essayText])

  const sectionNum = (n: number) => <span className="sw-blog-section-number">{n}.</span>

  // Compute section numbers dynamically
  let sectionCounter = 0
  const nextSec = () => { sectionCounter++; return sectionCounter }

  const hasSec1 = !!essay.analysis
  const hasSec3 = !!(essay.essayTranslation)
  const hasSec4 = !!(essay.analysis?.keyVocabulary && essay.analysis.keyVocabulary.length > 0)

  return (
    <div className="sw-blog-post">

      {/* ── 1. DÀN Ý & PHÂN TÍCH ── */}
      {hasSec1 && (
        <div className="sw-blog-section sw-blog-section--analysis">
          <h3 className="sw-blog-section-title">
            {sectionNum(nextSec())} Dàn ý &amp; Phân tích chi tiết (Outline &amp; Analysis)
          </h3>

          <div className="sw-blog-analysis-card">

            {/* ── Outline box ── */}
            {essay.analysis!.outline && (
              <div className="sw-blog-outline-box">
                <h4 className="sw-blog-outline-title">📋 Dàn ý (Outline)</h4>
                <div className="sw-blog-outline-content">
                  {renderParagraphs(essay.analysis!.outline)}
                </div>
              </div>
            )}

            {/* ── Overall comment ── */}
            {essay.analysis!.overallComment && (
              <div className="sw-blog-overall-comment">
                <p className="sw-blog-comment-text">{essay.analysis!.overallComment}</p>
              </div>
            )}

            {/* ── Criteria Breakdown ── */}
            <div className="sw-blog-scores-grid">
              {[
                { label: "Task Achievement / Response", score: essay.analysis!.taskAchievement },
                { label: "Coherence & Cohesion", score: essay.analysis!.coherenceCohesion },
                { label: "Lexical Resource", score: essay.analysis!.lexicalResource },
                { label: "Grammatical Range & Accuracy", score: essay.analysis!.grammaticalRange },
              ].map((c, idx) => {
                if (c.score === undefined || c.score === null) return null
                const percentage = (c.score / 9) * 100

                let barColor = "var(--color-brand)"
                if (c.score >= 8.0) barColor = "#10b981"
                else if (c.score >= 7.0) barColor = "#3b82f6"
                else if (c.score >= 6.0) barColor = "#f59e0b"

                return (
                  <div key={idx} className="sw-blog-score-row">
                    <div className="sw-blog-score-info">
                      <span className="sw-blog-score-label">{c.label}</span>
                      <span className="sw-blog-score-val">Band {c.score.toFixed(1)}</span>
                    </div>
                    <div className="sw-blog-progress-track">
                      <div
                        className="sw-blog-progress-fill"
                        style={{ width: `${percentage}%`, backgroundColor: barColor }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* ── Strengths & Areas to Improve ── */}
            <div className="sw-blog-feedback-grid">
              {essay.analysis!.strengths && essay.analysis!.strengths.length > 0 && (
                <div className="sw-blog-feedback-col sw-blog-feedback-col--strengths">
                  <h4 className="sw-blog-feedback-title">✓ Điểm mạnh nổi bật (Key Strengths)</h4>
                  <ul className="sw-blog-feedback-list">
                    {essay.analysis!.strengths.map((s: string, i: number) => (
                      <li key={i} className="sw-blog-feedback-item">
                        <span className="sw-feedback-bullet">•</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {essay.analysis!.improvements && essay.analysis!.improvements.length > 0 && (
                <div className="sw-blog-feedback-col sw-blog-feedback-col--improvements">
                  <h4 className="sw-blog-feedback-title">! Điểm cần cải thiện (Areas to Improve)</h4>
                  <ul className="sw-blog-feedback-list">
                    {essay.analysis!.improvements.map((imp: string, i: number) => (
                      <li key={i} className="sw-blog-feedback-item">
                        <span className="sw-feedback-bullet">•</span> {imp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 2. BÀI VIẾT MẪU (MODEL ESSAY) ── */}
      <div className="sw-blog-section sw-blog-section--essay">
        <div className="sw-blog-essay-header">
          <h3 className="sw-blog-section-title">
            {sectionNum(nextSec())} Bài viết mẫu (Model Essay — Band {essay.bandScore.toFixed(1)})
          </h3>
          <span className="sw-blog-wordcount">
            <FileText size={14} style={{ marginRight: 4 }} /> {wordCount} words
          </span>
        </div>
        <div className="sw-blog-essay-card">
          <div className="sw-blog-essay-text">
            {renderParagraphs(essay.essayText)}
          </div>
        </div>
      </div>

      {/* ── 3. BẢN DỊCH TIẾNG VIỆT ── */}
      {hasSec3 && (
        <div className="sw-blog-section sw-blog-section--translation">
          <h3 className="sw-blog-section-title">
            {sectionNum(nextSec())} Bản dịch tiếng Việt (Translation)
          </h3>
          <div className="sw-blog-translation-card">
            {renderParagraphs(essay.essayTranslation!)}
          </div>
        </div>
      )}

      {/* ── 4. TỪ VỰNG NỔI BẬT ── */}
      {hasSec4 && (
        <div className="sw-blog-section sw-blog-section--vocab">
          <h3 className="sw-blog-section-title">
            {sectionNum(nextSec())} Từ vựng &amp; Cấu trúc "ăn điểm" (Vocabulary &amp; Collocations)
          </h3>
          <div className="sw-blog-vocab-table-container">
            <table className="sw-blog-vocab-table">
              <thead>
                <tr>
                  <th>Từ / Cụm từ (Phrase)</th>
                  <th>Ý nghĩa (Meaning)</th>
                  <th>Ngữ cảnh sử dụng (Context)</th>
                </tr>
              </thead>
              <tbody>
                {essay.analysis!.keyVocabulary!.map((item: any, i: number) => (
                  <tr key={i}>
                    <td className="sw-blog-vocab-phrase">{item.phrase}</td>
                    <td className="sw-blog-vocab-meaning">{item.meaning}</td>
                    <td className="sw-blog-vocab-context">"{item.context}"</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
    return list.sort((a, b) => b - a)
  }, [detail.essays])

  useEffect(() => {
    if (detail.essays.length > 0 && activeBand === null) {
      const highest = Math.max(...detail.essays.map((e) => e.bandScore))
      setActiveBand(highest)
    }
  }, [detail.essays, activeBand])

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
            className={`sw-detail__task-badge ${detail.taskType === "TASK_1"
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
            <span className="sw-prompt-card__label">Đề thi IELTS Writing</span>
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
          {detail.chartDescription && (
            <div className="sw-chart-description-box">
              <h4 className="sw-chart-description-title">📊 Mô tả biểu đồ</h4>
              <div className="sw-chart-description-content">
                {renderParagraphs(detail.chartDescription)}
              </div>
            </div>
          )}
        </div>

        <div className="sw-band-filter-section">
          <span className="sw-band-filter-label">Bài mẫu Band score khác:</span>
          <div className="sw-band-filter">
            <button
              id="band-filter-all"
              onClick={() => setActiveBand(null)}
              className={`sw-band-btn sw-band-btn--all ${activeBand === null ? "sw-band-btn--all-active" : "sw-band-btn--all-inactive"
                }`}
            >
              Tất cả bài mẫu
            </button>
            {bands.map((b) => {
              const isActive = activeBand === b
              const colors = getBandColor(b)
              return (
                <button
                  key={b}
                  id={`band-filter-${b}`}
                  onClick={() => setActiveBand(b)}
                  className={`sw-band-btn sw-band-btn--band ${isActive ? "sw-band-btn--active" : "sw-band-btn--inactive"
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
              <p className="sw-essay-empty">Chưa có bài mẫu nào cho mức điểm này.</p>
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
                  Study band 6.0+ to 8.5+ model essays for IELTS Writing Task 1 &amp; Task 2.
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
                          className={`sw-cat-chip ${isActive ? "sw-cat-chip--active" : "sw-cat-chip--inactive"
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