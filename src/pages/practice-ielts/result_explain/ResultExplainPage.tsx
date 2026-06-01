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
      return language === "vi"
        ? ["Hoàn hảo! Bạn đã đạt điểm tuyệt đối. Hãy tiếp tục giải đề khác để duy trì phong độ và phản xạ."]
        : ["Perfect! You achieved a perfect score. Continue practicing other modules to maintain your speed."]
    }
    return language === "vi"
      ? [
          "Tập trung học phương pháp định vị từ khóa đồng nghĩa (Synonyms/Paraphrasing) được mô tả trong các mẹo tránh bẫy của AI.",
          "Phân tích kỹ lưỡng các đáp án gây nhiễu (distractors) để học cách loại trừ triệt để."
        ]
      : [
          "Focus on mastering synonym keyword-matching described in the AI pro tips of incorrect answers.",
          "Thoroughly analyze structural distractors to learn precise process-of-elimination techniques."
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
                {language === "vi" ? "Đang phân tích sâu bằng Trí Tuệ Nhân Tạo..." : "Analyzing with deep AI..."}
              </h2>
              <p>
                {language === "vi"
                  ? "Giám khảo AI của BandBuilder đang tổng hợp đề bài, lập đối chiếu ngữ pháp và biên soạn lời giải thích chi tiết cho riêng bạn."
                  : "BandBuilder's AI Examiner is matching grammar pathways, cross-referencing keys, and drafting customized explanations."}
              </p>
            </div>
          )}

          {/* ERROR STATE */}
          {error && (
            <div className="error-state-premium">
              <AlertCircle className="error-icon-premium" size={48} />
              <h3>
                {language === "vi" ? "Không thể tải giải thích" : "Failed to load explanation"}
              </h3>
              <p>
                {(error as any)?.response?.data?.message || (
                  language === "vi"
                    ? "Hệ thống gặp sự cố khi gọi AI phân tích. Vui lòng thử lại sau hoặc kiểm tra số dư credit."
                    : "An error occurred while generating AI feedback. Please check your credit balance or try again."
                )}
              </p>
              <button onClick={() => navigate(-1)} className="btn-action-primary cursor-pointer">
                {language === "vi" ? "Quay lại" : "Go Back"}
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
                        {language === "vi" ? "Giải Thích Chi Tiết & Giải Thích AI" : "AI Answer Explanations"}
                      </h1>
                      <span className="membership-tag pro">
                        {explanationData.skill}
                      </span>
                    </div>
                    <p className="user-email-text">
                      {language === "vi"
                        ? "Phát hiện lỗ hổng ngữ pháp, từ vựng và học hỏi kinh nghiệm làm bài trực tiếp từ Giám khảo AI."
                        : "Discover grammar and vocab gaps and master timing strategies directly from the AI Examiner."}
                    </p>
                    <div className="user-credits-info">
                      <span>Attempt ID: {explanationData.attemptId.slice(0, 8)}</span>
                    </div>
                  </div>
                </div>

                <div className="profile-header-actions">
                  <button onClick={() => navigate(-1)} className="btn-action-primary cursor-pointer">
                    <span>{language === "vi" ? "Quay lại kết quả" : "Back to Results"}</span>
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
                      {language === "vi"
                        ? `Đang hiển thị ${filteredExplanations.length} câu hỏi`
                        : `Showing ${filteredExplanations.length} questions`}
                    </div>
                    <div className="filter-tabs-explain">
                      <button
                        onClick={() => setFilter("all")}
                        className={`filter-tab-explain ${filter === "all" ? 'active-all' : ""}`}
                      >
                        {language === "vi" ? "Tất cả" : "All"}
                      </button>
                      <button
                        onClick={() => setFilter("incorrect")}
                        className={`filter-tab-explain ${filter === "incorrect" ? 'active-incorrect' : ""}`}
                      >
                        {language === "vi" ? "Câu Sai" : "Incorrect"}
                      </button>
                      <button
                        onClick={() => setFilter("correct")}
                        className={`filter-tab-explain ${filter === "correct" ? 'active-correct' : ""}`}
                      >
                        {language === "vi" ? "Câu Đúng" : "Correct"}
                      </button>
                    </div>
                  </div>

                  {/* RECOMMENDATIONS/STRATEGY CARD */}
                  <div className="recent-activity-card">
                    <div className="card-header-row">
                      <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Sparkles size={18} style={{ color: "#f59e0b" }} />
                        {language === "vi" ? "Lời Khuyên Đột Phá Lỗi Sai" : "AI Strategy Advice"}
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
                          {language === "vi" ? "Không có câu hỏi nào khớp với bộ lọc hiện tại." : "No questions match your current filter."}
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
                                  {language === "vi" ? `Câu hỏi: ${item.questionId}` : `Question: ${item.questionId}`}
                                </div>
                              </div>

                              <div className="answers-comparison-box-explain">
                                <div className="answer-meta-column">
                                  <span className="ans-meta-label">{language === "vi" ? "Bạn chọn:" : "Your Answer:"}</span>
                                  <span className={`answer-badge-explain ${isCorrect ? 'correct' : 'wrong'}`}>
                                    {item.userAnswer || (language === "vi" ? "Bỏ qua" : "Skipped")}
                                  </span>
                                </div>

                                <div className="answer-meta-column">
                                  <span className="ans-meta-label">{language === "vi" ? "Đáp án đúng:" : "Correct Answer:"}</span>
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
                                <span>{language === "vi" ? "Giải Thích Lỗi Sai Từ Giám Khảo AI" : "AI Examiner Analysis"}</span>
                              </div>
                              <p className="ai-analysis-text-explain">
                                {item.explanation}
                              </p>

                              {/* Pro Tip Content */}
                              <div className="pro-tip-block-explain">
                                <div className="pro-tip-label-explain">
                                  <Lightbulb size={14} />
                                  <span>{language === "vi" ? "Mẹo tránh bẫy & Chiến lược làm bài" : "Trap Avoidance & Tactics"}</span>
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
                    <h3>{language === "vi" ? "Trạng thái giao dịch" : "Transaction"}</h3>
                    <div className="summary-row">
                      <span>{language === "vi" ? "Trạng thái" : "Status"}</span>
                      <strong>
                        {explanationData.charged
                          ? (language === "vi" ? "Khấu trừ 1 Credit" : "1 Credit Charged")
                          : (language === "vi" ? "Truy cập miễn phí" : "Free (Cached)")}
                      </strong>
                    </div>
                  </div>

                  {/* Result Summary Sidebar Card */}
                  <div className="account-summary-card">
                    <h3>{language === "vi" ? "Thống kê kết quả" : "Result Summary"}</h3>
                    <div className="summary-row">
                      <span>{language === "vi" ? "Lỗi sai cần sửa" : "Mistakes Found"}</span>
                      <strong className="incorrect">{stats.incorrect}</strong>
                    </div>
                    <div className="summary-row">
                      <span>{language === "vi" ? "Câu chính xác" : "Correct Answers"}</span>
                      <strong className="correct">{stats.correct}</strong>
                    </div>
                  </div>

                  {/* Pro Upgrade Card */}
                  <div className="pro-upsell-card">
                    <div className="upsell-icon"><Sparkles size={32} /></div>
                    <h4>{language === "vi" ? "Bứt Phá Band Điểm" : "Break Your IELTS Limits"}</h4>
                    <p>
                      {language === "vi"
                        ? "Mở khóa phân tích chi tiết của 100% câu hỏi và chế độ luyện Nói AI 1-1."
                        : "Unlock deep-dive analysis for all queries and 1-on-1 AI Speaking practice."}
                    </p>
                    <button className="cursor-pointer" onClick={() => navigate("/upgrade")}>
                      {language === "vi" ? "Nâng Cấp Ngay" : "Upgrade Premium"}
                    </button>
                  </div>

                  {/* Action Footer (Back Button Card) */}
                  <div className="account-summary-card">
                    <button onClick={() => navigate(-1)} className="btn-action-secondary cursor-pointer" style={{ width: "100%" }}>
                      <span>{language === "vi" ? "Quay lại kết quả" : "Back to Results"}</span>
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
