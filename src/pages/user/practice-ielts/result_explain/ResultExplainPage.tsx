import { useState, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, Brain, Sparkles, CheckCircle2, XCircle, Lightbulb, AlertCircle, Coins, ChevronRight } from "lucide-react"
import { userApi } from "@/api/user.api"
import { useUIStore } from "@/services/ui/ui.store"
import MainLayout from "@/components/layout/MainLayout/MainLayout"
import { PageContainer, Section, Card } from "@/components/ui/LayoutPrimitives"

import "./ResultExplainPage.css"

interface ExplanationItem {
  questionId: string
  userAnswer: string | null
  correctAnswer: string
  explanation: string
  tip: string
}

interface ExplanationResponse {
  attemptId: string
  skill: string
  charged: boolean
  explanations: ExplanationItem[]
  message?: string
}

export default function ResultExplainPage() {
  const { attemptId } = useParams<{ attemptId: string }>()
  const navigate = useNavigate()
  const { t, language } = useUIStore()
  const [filter, setFilter] = useState<"all" | "incorrect" | "correct">("all")

  const { data: explanationData, isLoading, error } = useQuery<ExplanationResponse>({
    queryKey: ["attempt-explanation", attemptId],
    queryFn: () => userApi.getAttemptExplanation(attemptId!).then((res) => res.data),
    enabled: !!attemptId && attemptId !== "undefined",
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
    refetchOnWindowFocus: false,
    retry: false
  })

  // Fetch detailed Graded attempt data to get the exact bandScore
  const { data: attemptDetail } = useQuery({
    queryKey: ["attempt-detail", attemptId],
    queryFn: () => userApi.getAttemptDetail(attemptId!).then((res: any) => res.data),
    enabled: !!attemptId && attemptId !== "undefined",
    staleTime: 1000 * 60 * 5,
  })

  // Filter explanations based on user choice
  const filteredExplanations = explanationData?.explanations.filter((item) => {
    const isCorrect = item.userAnswer?.trim().toLowerCase() === item.correctAnswer.trim().toLowerCase()
    if (filter === "correct") return isCorrect
    if (filter === "incorrect") return !isCorrect
    return true
  }) || []

  // Count correct and incorrect answers in explanations
  const stats = explanationData?.explanations.reduce(
    (acc, item) => {
      const isCorrect = item.userAnswer?.trim().toLowerCase() === item.correctAnswer.trim().toLowerCase()
      if (isCorrect) acc.correct++
      else acc.incorrect++
      return acc
    },
    { correct: 0, incorrect: 0 }
  ) || { correct: 0, incorrect: 0 }

  const attemptScore = useMemo(() => {
    if (attemptDetail) {
      const score = attemptDetail.bandScore != null ? attemptDetail.bandScore : (attemptDetail.score != null ? attemptDetail.score : null)
      if (score != null) {
        return {
          score,
          isBand: attemptDetail.bandScore != null && attemptDetail.bandScore <= 9
        }
      }
    }
    // Fallback: calculate raw percentage accuracy from explanations list
    const total = explanationData?.explanations.length || 0
    const rawScore = total > 0 ? Math.round((stats.correct / total) * 100) : 0
    return { score: rawScore, isBand: false }
  }, [attemptDetail, explanationData, stats.correct])

  const recommendations = useMemo(() => {
    if (stats.incorrect === 0) {
      return [t("explain_rec_perfect")]
    }
    return [
      t("explain_rec_improve_1"),
      t("explain_rec_improve_2")
    ]
  }, [stats, language])

  return (
    <MainLayout>
      <div className="profile-page-wrapper">
        <div className="profile-main-container">
          
          {/* LOADING STATE */}
          {isLoading && (
            <div className="loading-state-premium">
              <div className="spinner-wrapper-premium">
                <div className="spinner-bg-premium"></div>
                <div className="spinner-indicator-premium"></div>
                <Brain className="spinner-icon-premium" size={36} />
              </div>
              <h2>
                {t("explain_loading_title")}
              </h2>
              <p>
                {t("explain_loading_desc")}
              </p>
            </div>
          )}

          {/* ERROR STATE */}
          {error && (
            <div className="error-state-premium">
              <AlertCircle className="error-icon-premium" size={48} />
              <h3>
                {t("explain_error_title")}
              </h3>
              <p>
                {(error as any)?.response?.data?.message || t("explain_error_desc")}
              </p>
              <button onClick={() => navigate(-1)} className="btn-action-primary cursor-pointer">
                {t("explain_error_back")}
              </button>
            </div>
          )}

          {/* CONTENT STATE */}
          {explanationData && (
            <>
              {/* TOP SECTION: HERO HEADER CARD */}
              <section className="profile-hero-card">
                <div className="user-profile-info">
                  <div className="profile-avatar-wrapper">
                    <span className="visualizer-score-large">{attemptScore.score}</span>
                    <span className="visualizer-unit-sub">{attemptScore.isBand ? "Band" : "%"}</span>
                  </div>

                  <div className="user-meta-info">
                    <div className="user-name-row">
                      <h1>
                        {t("explain_hero_title")}
                      </h1>
                      <span className="membership-tag pro">
                        {explanationData.skill}
                      </span>
                    </div>
                    <p className="user-email-text">
                      {t("explain_hero_desc")}
                    </p>
                    <div className="user-credits-info">
                      <span>Attempt ID: {explanationData.attemptId.slice(0, 8)}</span>
                    </div>
                  </div>
                </div>

                <div className="profile-header-actions">
                  <button onClick={() => navigate(-1)} className="btn-action-primary cursor-pointer">
                    <span>{t("explain_hero_back")}</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </section>

              {/* BOTTOM SECTION: GRID CONTENT */}
              <div className="profile-bottom-grid">
                
                {/* Left Column Content */}
                <div className="profile-main-column">
                  
                  {/* FILTER PANEL */}
                  <div className="filter-panel-premium">
                    <div className="filter-results-count-explain">
                      {t("explain_filter_showing")} {filteredExplanations.length} {t("result_questions_count")}
                    </div>
                    <div className="filter-tabs-explain">
                      <button
                        onClick={() => setFilter("all")}
                        className={`filter-tab-explain ${filter === "all" ? 'active-all' : ""}`}
                      >
                        {t("explain_filter_all")}
                      </button>
                      <button
                        onClick={() => setFilter("incorrect")}
                        className={`filter-tab-explain ${filter === "incorrect" ? 'active-incorrect' : ""}`}
                      >
                        {t("explain_filter_incorrect")}
                      </button>
                      <button
                        onClick={() => setFilter("correct")}
                        className={`filter-tab-explain ${filter === "correct" ? 'active-correct' : ""}`}
                      >
                        {t("explain_filter_correct")}
                      </button>
                    </div>
                  </div>

                  {/* RECOMMENDATIONS/STRATEGY CARD */}
                  <div className="recent-activity-card">
                    <div className="card-header-row">
                      <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Sparkles size={18} style={{ color: "#f59e0b" }} />
                        {t("explain_advice_title")}
                      </h2>
                    </div>
                    <div className="rec-explain-list">
                      {recommendations.map((rec: string, i: number) => (
                        <div key={i} className="rec-explain-item">
                          <div className="rec-explain-bullet">✓</div>
                          <p className="rec-explain-text">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* EXPLANATIONS LIST */}
                  <div className="explanations-list-premium">
                    {filteredExplanations.length === 0 ? (
                      <div className="empty-list-card-premium">
                        <Brain size={40} className="empty-list-icon-premium" />
                        <p>
                          {t("explain_empty_filter")}
                        </p>
                      </div>
                    ) : (
                      filteredExplanations.map((item, idx) => {
                        const isCorrect = item.userAnswer?.trim().toLowerCase() === item.correctAnswer.trim().toLowerCase()
                        return (
                          <div
                            key={idx}
                            className={`question-item-explain ${isCorrect ? 'correct' : 'incorrect'}`}
                          >
                            {/* Item Header */}
                            <div className="question-header-explain">
                              <div className="question-info-explain">
                                <div className={`question-number-explain ${isCorrect ? 'correct' : 'incorrect'}`}>
                                  {item.questionId.replace(/\D/g, "") || idx + 1}
                                </div>
                                <div className="question-title-explain">
                                  {t("explain_q_title")} {item.questionId}
                                </div>
                              </div>

                              <div className="answers-comparison-box-explain">
                                <div className="answer-meta-column">
                                  <span className="ans-meta-label">{t("explain_ans_yours")}</span>
                                  <span className={`answer-badge-explain ${isCorrect ? 'correct' : 'wrong'}`}>
                                    {item.userAnswer || t("explain_ans_skipped")}
                                  </span>
                                </div>

                                <div className="answer-meta-column">
                                  <span className="ans-meta-label">{t("explain_ans_correct")}</span>
                                  <span className="answer-badge-explain correct">
                                    {item.correctAnswer}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Item Body (AI Examiner Analysis) */}
                            <div className="ai-analysis-block-explain">
                              <div className="ai-analysis-label-explain">
                                <Sparkles size={14} />
                                <span>{t("explain_ai_analysis")}</span>
                              </div>
                              <p className="ai-analysis-text-explain">
                                {item.explanation}
                              </p>

                              {/* Pro Tip Content */}
                              <div className="pro-tip-block-explain">
                                <div className="pro-tip-label-explain">
                                  <Lightbulb size={14} />
                                  <span>{t("explain_ai_tips")}</span>
                                </div>
                                <p className="pro-tip-text-explain">
                                  {item.tip}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>

                {/* Right Column Sidebar */}
                <div className="profile-sidebar-cards">
                  
                  {/* Credit Info Card */}
                  <div className="account-summary-card">
                    <h3>{t("explain_tx_title")}</h3>
                    <div className="summary-row">
                      <span>{t("explain_tx_status")}</span>
                      <strong>
                        {explanationData.charged
                          ? t("explain_tx_charged")
                          : t("explain_tx_free")}
                      </strong>
                    </div>
                  </div>

                  {/* Result Summary Sidebar Card */}
                  <div className="account-summary-card">
                    <h3>{t("explain_summary_title")}</h3>
                    <div className="summary-row">
                      <span>{t("explain_summary_mistakes")}</span>
                      <strong className="incorrect">{stats.incorrect}</strong>
                    </div>
                    <div className="summary-row">
                      <span>{t("explain_summary_correct")}</span>
                      <strong className="correct">{stats.correct}</strong>
                    </div>
                  </div>

                  {/* Pro Upgrade Card */}
                  <div className="pro-upsell-card">
                    <div className="upsell-icon"><Sparkles size={32} /></div>
                    <h4>{t("explain_upsell_title")}</h4>
                    <p>
                      {t("explain_upsell_desc")}
                    </p>
                    <button className="cursor-pointer" onClick={() => navigate("/upgrade")}>
                      {t("explain_upsell_btn")}
                    </button>
                  </div>

                  {/* Action Footer (Back Button Card) */}
                  <div className="account-summary-card">
                    <button onClick={() => navigate(-1)} className="btn-action-secondary cursor-pointer" style={{ width: "100%" }}>
                      <span>{t("explain_footer_back")}</span>
                    </button>
                  </div>

                </div>

              </div>
            </>
          )}

        </div>
      </div>
    </MainLayout>
  )
}
