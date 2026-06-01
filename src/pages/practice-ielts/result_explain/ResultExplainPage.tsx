import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, Brain, Sparkles, CheckCircle2, XCircle, Lightbulb, AlertCircle, Coins, ChevronRight } from "lucide-react"
import { userApi } from "@/api/user.api"
import { useUIStore } from "@/services/ui/ui.store"
import MainLayout from "@/components/layout/MainLayout/MainLayout"
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

  return (
    <MainLayout>
      <div className="explain-page-container">
        {/* HEADER SECTION */}
        <header className="explain-header">
          <div className="header-content">
            <button onClick={() => navigate(-1)} className="back-btn">
              <ArrowLeft size={18} />
              <span>{t("result_back") || "Back"}</span>
            </button>

            <div className="brand-wrapper">
              <Brain className="brand-icon" size={24} />
              <span className="brand-text">BandBuilder AI</span>
            </div>

            <div style={{ width: "32px" }}></div>
          </div>
        </header>

        <main className="explain-main">
          {/* LOADING STATE */}
          {isLoading && (
            <div className="loading-state">
              <div className="spinner-wrapper">
                <div className="spinner-bg"></div>
                <div className="spinner-indicator"></div>
                <Brain className="spinner-icon" size={32} />
              </div>
              <h2>
                {language === "vi" ? "Đang phân tích với Trí Tuệ Nhân Tạo..." : "Analyzing with AI..."}
              </h2>
              <p>
                {language === "vi"
                  ? "Giám khảo AI của BandBuilder đang đối chiếu đáp án, phân tích lỗi sai và soạn các gợi ý dành riêng cho bạn."
                  : "BandBuilder's AI Examiner is matching answers, parsing mistakes, and writing personalized tips for you."}
              </p>
            </div>
          )}

          {/* ERROR STATE */}
          {error && (
            <div className="error-state">
              <AlertCircle className="error-icon" size={48} />
              <h3>
                {language === "vi" ? "Không thể tải giải thích" : "Failed to load explanation"}
              </h3>
              <p>
                {(error as any)?.response?.data?.message || (
                  language === "vi"
                    ? "Đã xảy ra lỗi khi gọi AI phân tích. Vui lòng kiểm tra lại số dư credit của bạn."
                    : "An error occurred while generating AI feedback. Please check your credit balance."
                )}
              </p>
              <button onClick={() => navigate(-1)} className="btn-retry">
                {language === "vi" ? "Quay lại" : "Go Back"}
              </button>
            </div>
          )}

          {/* CONTENT STATE */}
          {explanationData && (
            <div className="animate-fade-in">
              {/* HERO OVERVIEW CARD */}
              <div className="overview-card">
                <div className="overview-top">
                  <div>
                    <div className="badge-skill-wrapper">
                      <span className="badge-skill">{explanationData.skill}</span>
                      <span className="badge-attempt-id">
                        Attempt ID: <span>{explanationData.attemptId.slice(0, 8)}...</span>
                      </span>
                    </div>
                    <h1 className="title-main">
                      {language === "vi" ? "Phân Tích Lỗi Sai & Giải Thích AI" : "AI Answer Explanations"}
                    </h1>
                    <p className="description-meta">
                      {language === "vi"
                        ? "Xem phân tích chi tiết từng đáp án sai và lời khuyên để bứt phá band điểm."
                        : "Review comprehensive insights on every incorrect answer and expert tips."}
                    </p>
                  </div>

                  {/* Credit info badge */}
                  <div className="credit-badge">
                    <div className="credit-icon-container">
                      <Coins size={20} />
                    </div>
                    <div className="credit-details">
                      <div className="credit-title">
                        {language === "vi" ? "Trạng thái giao dịch" : "Transaction"}
                      </div>
                      <div className="credit-status">
                        {explanationData.charged
                          ? (language === "vi" ? "Đã khấu trừ 1 Credit" : "1 Credit Charged")
                          : (language === "vi" ? "Truy cập miễn phí (Đã lưu)" : "Free (Previously Generated)")}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mini Stats Banner */}
                <div className="stats-banner">
                  <div className="stat-block">
                    <div className="stat-info-left">
                      <div className="stat-label-mini">
                        {language === "vi" ? "Số câu trả lời sai" : "Mistakes Found"}
                      </div>
                      <div className="stat-val-large incorrect">{stats.incorrect}</div>
                    </div>
                    <XCircle size={28} className="stat-block-icon incorrect" />
                  </div>

                  <div className="stat-block">
                    <div className="stat-info-left">
                      <div className="stat-label-mini">
                        {language === "vi" ? "Số câu chính xác" : "Correct Answers"}
                      </div>
                      <div className="stat-val-large correct">{stats.correct}</div>
                    </div>
                    <CheckCircle2 size={28} className="stat-block-icon correct" />
                  </div>
                </div>
              </div>

              {/* FILTER PANEL */}
              <div className="filter-panel">
                <div className="filter-results-count">
                  {language === "vi"
                    ? `Đang hiển thị ${filteredExplanations.length} câu hỏi`
                    : `Showing ${filteredExplanations.length} questions`}
                </div>
                <div className="filter-tabs">
                  <button
                    onClick={() => setFilter("all")}
                    className={`filter-tab ${filter === "all" ? "active-all" : ""}`}
                  >
                    {language === "vi" ? "Tất cả" : "All"}
                  </button>
                  <button
                    onClick={() => setFilter("incorrect")}
                    className={`filter-tab ${filter === "incorrect" ? "active-incorrect" : ""}`}
                  >
                    {language === "vi" ? "Câu Sai" : "Incorrect"}
                  </button>
                  <button
                    onClick={() => setFilter("correct")}
                    className={`filter-tab ${filter === "correct" ? "active-correct" : ""}`}
                  >
                    {language === "vi" ? "Câu Đúng" : "Correct"}
                  </button>
                </div>
              </div>

              {/* EXPLANATIONS LIST */}
              <div className="explanations-list">
                {filteredExplanations.length === 0 ? (
                  <div className="empty-list-card">
                    <Brain size={40} className="empty-list-icon" />
                    <p>
                      {language === "vi" ? "Không có câu hỏi nào khớp với bộ lọc." : "No questions match your filter."}
                    </p>
                  </div>
                ) : (
                  filteredExplanations.map((item, idx) => {
                    const isCorrect = item.userAnswer?.trim().toLowerCase() === item.correctAnswer.trim().toLowerCase()
                    return (
                      <div
                        key={idx}
                        className={`explain-item-card ${isCorrect ? "correct-card" : "incorrect-card"}`}
                      >
                        {/* Item Header */}
                        <div className="card-header">
                          <div className="card-title-left">
                            <div className={`question-num-badge ${isCorrect ? "correct" : "incorrect"}`}>
                              {item.questionId.replace(/\D/g, "") || idx + 1}
                            </div>
                            <div className="question-title">
                              {language === "vi" ? `Câu hỏi: ${item.questionId}` : `Question: ${item.questionId}`}
                            </div>
                          </div>

                          <div className="answers-comparison-box">
                            <span className="answer-meta-span">
                              <label>{language === "vi" ? "Bạn chọn:" : "Your Answer:"}</label>
                              <span className={`badge-answer-box user ${isCorrect ? "correct" : "incorrect"}`}>
                                {item.userAnswer || (language === "vi" ? "Bỏ qua" : "Skipped")}
                              </span>
                            </span>

                            <span className="answer-meta-span">
                              <label>{language === "vi" ? "Đáp án đúng:" : "Correct Answer:"}</label>
                              <span className="badge-answer-box correct-badge">
                                {item.correctAnswer}
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* Item Body */}
                        <div className="card-body">
                          {/* Explanation Content */}
                          <div className="explain-text-row">
                            <div className="row-icon-container sparkle">
                              <Sparkles size={18} />
                            </div>
                            <div>
                              <div className="content-label">
                                {language === "vi" ? "Phân tích từ Giám khảo AI" : "AI Examiner Analysis"}
                              </div>
                              <p className="content-text">
                                {item.explanation}
                              </p>
                            </div>
                          </div>

                          {/* Tip Content */}
                          <div className="tip-box-container">
                            <div className="tip-box-row">
                              <div className="row-icon-container lightbulb">
                                <Lightbulb size={18} />
                              </div>
                              <div>
                                <div className="tip-content-label">
                                  {language === "vi" ? "Mẹo tránh bẫy & kinh nghiệm" : "Pro Tip & Strategy"}
                                </div>
                                <p className="tip-content-text">
                                  {item.tip}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* ACTION FOOTER */}
              <div className="action-footer">
                <button onClick={() => navigate(-1)} className="btn-back-results">
                  <span>{language === "vi" ? "Quay lại trang kết quả" : "Back to Results"}</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </MainLayout>
  )
}
