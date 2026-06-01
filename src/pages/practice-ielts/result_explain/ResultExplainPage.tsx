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
      <PageContainer className="explain-page-container">
        
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
            <button onClick={() => navigate(-1)} className="btn-retry-premium">
              {language === "vi" ? "Quay lại" : "Go Back"}
            </button>
          </div>
        )}

        {/* CONTENT STATE */}
        {explanationData && (
          <>
            {/* LEFT COLUMN */}
            <Section className="explain-left-column">
              
              {/* HEADER INFO BLOCK (Skill Badge + Page Title + Page Subtitle) */}
              <Card className="overview-card-header-premium">
                <div className="header-meta-row">
                  <span className="skill-badge-explain">
                    {explanationData.skill}
                  </span>
                  <span className="attempt-id-explain">
                    Attempt ID: <span>{explanationData.attemptId.slice(0, 8)}...</span>
                  </span>
                </div>
                <h1 className="page-title-explain">
                  {language === "vi" ? "Phân Tích Chi Tiết & Giải Thích AI" : "AI Answer Explanations"}
                </h1>
                <p className="page-subtitle-explain">
                  {language === "vi"
                    ? "Phát hiện lỗ hổng ngữ pháp, từ vựng và học hỏi kinh nghiệm làm bài trực tiếp từ Giám khảo AI."
                    : "Discover grammar and vocab gaps and master timing strategies directly from the AI Examiner."}
                </p>
              </Card>

              {/* FILTER PANEL */}
              <Card className="filter-panel-premium">
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
              </Card>

              {/* RECOMMENDATIONS CARD */}
              <Card className="recommendations-card-explain-premium">
                <div className="section-header-premium">
                  <Sparkles size={18} className="section-icon text-amber-500 animate-pulse" />
                  <h2>{language === "vi" ? "Lời Khuyên Đột Phá Lỗi Sai" : "AI Strategy Advice"}</h2>
                </div>
                <div className="rec-explain-list">
                  {recommendations.map((rec: string, i: number) => (
                    <div key={i} className="rec-explain-item">
                      <div className="rec-explain-bullet">✓</div>
                      <p className="rec-explain-text">{rec}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* EXPLANATIONS LIST */}
              <div className="explanations-list-premium">
                {filteredExplanations.length === 0 ? (
                  <Card className="empty-list-card-premium">
                    <Brain size={40} className="empty-list-icon-premium" />
                    <p>
                      {language === "vi" ? "Không có câu hỏi nào khớp với bộ lọc hiện tại." : "No questions match your current filter."}
                    </p>
                  </Card>
                ) : (
                  filteredExplanations.map((item, idx) => {
                    const isCorrect = item.userAnswer?.trim().toLowerCase() === item.correctAnswer.trim().toLowerCase()
                    return (
                      <Card
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
                      </Card>
                    )
                  })
                )}
              </div>
            </Section>

            {/* RIGHT COLUMN */}
            <Section className="explain-right-column">
              {/* Credit info card */}
              <Card className="credit-card-sidebar-premium">
                <div className="credit-badge-premium">
                  <div className="credit-icon-container-premium">
                    <Coins size={20} />
                  </div>
                  <div className="credit-details-premium">
                    <div className="credit-title-premium">
                      {language === "vi" ? "Trạng thái giao dịch" : "Transaction"}
                    </div>
                    <div className="credit-status-premium">
                      {explanationData.charged
                        ? (language === "vi" ? "Khấu trừ 1 Credit" : "1 Credit Charged")
                        : (language === "vi" ? "Truy cập miễn phí (Đã lưu)" : "Free (Previously generated)")}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Analysis Panel (Mini Stats Banner) */}
              <Card className="analysis-panel-sidebar-premium">
                <div className="analysis-header-sidebar">
                  <h3>{language === "vi" ? "Thống kê kết quả" : "Result Summary"}</h3>
                </div>
                <div className="stats-sidebar-body-premium">
                  <div className="stat-block-sidebar">
                    <div className="stat-info-left-sidebar">
                      <div className="stat-label-mini-sidebar">
                        {language === "vi" ? "Lỗi sai cần sửa" : "Mistakes Found"}
                      </div>
                      <div className="stat-val-large-sidebar incorrect">{stats.incorrect}</div>
                    </div>
                    <XCircle size={28} className="stat-block-icon-sidebar incorrect" />
                  </div>

                  <div className="stat-block-sidebar">
                    <div className="stat-info-left-sidebar">
                      <div className="stat-label-mini-sidebar">
                        {language === "vi" ? "Câu chính xác" : "Correct Answers"}
                      </div>
                      <div className="stat-val-large-sidebar correct">{stats.correct}</div>
                    </div>
                    <CheckCircle2 size={28} className="stat-block-icon-sidebar correct" />
                  </div>
                </div>
              </Card>

              {/* UPGRADE PREMIUM SIDEBAR CTA */}
              <Card className="upgrade-sidebar-premium">
                <div className="premium-accent-border"></div>
                <div className="upgrade-sidebar-content">
                  <div className="premium-tag">
                    <Sparkles size={12} />
                    <span>PREMIUM</span>
                  </div>
                  <h4>{language === "vi" ? "Đột phá Band Điểm" : "Break Your IELTS Limits"}</h4>
                  <p>
                    {language === "vi"
                      ? "Mở khóa phân tích chi tiết của 100% câu hỏi và chế độ luyện Nói AI 1-1."
                      : "Unlock deep-dive analysis for all queries and 1-on-1 AI Speaking practice."}
                  </p>
                  <button onClick={() => navigate("/upgrade")} className="premium-sidebar-btn">
                    {language === "vi" ? "Nâng Cấp Ngay" : "Upgrade Now"}
                  </button>
                </div>
              </Card>

              {/* ACTION FOOTER */}
              <Card className="action-footer-card-premium">
                <button onClick={() => navigate(-1)} className="primary-btn-premium">
                  <span>{language === "vi" ? "Quay lại kết quả" : "Back to Results"}</span>
                  <ChevronRight size={16} />
                </button>
              </Card>
            </Section>
          </>
        )}

      </PageContainer>
    </MainLayout>
  )
}
