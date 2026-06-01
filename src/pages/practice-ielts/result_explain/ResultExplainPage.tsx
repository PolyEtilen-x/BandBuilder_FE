import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, Brain, Sparkles, CheckCircle2, XCircle, Lightbulb, AlertCircle, Coins, ChevronRight } from "lucide-react"
import { userApi } from "@/api/user.api"
import { useUIStore } from "@/services/ui/ui.store"
import MainLayout from "@/components/layout/MainLayout/MainLayout"

import styles from "./ResultExplainPage.module.css"

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
      <div className={styles.pageWrapper}>
        
        {/* LOADING STATE */}
        {isLoading && (
          <div className={styles.loadingState}>
            <div className={styles.spinnerWrapper}>
              <div className={styles.spinnerBg}></div>
              <div className={styles.spinnerIndicator}></div>
              <Brain className={styles.spinnerIcon} size={32} />
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
          <div className={styles.errorState}>
            <AlertCircle className={styles.errorIcon} size={48} />
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
            <button onClick={() => navigate(-1)} className={styles.btnRetry}>
              {language === "vi" ? "Quay lại" : "Go Back"}
            </button>
          </div>
        )}

        {/* CONTENT STATE */}
        {explanationData && (
          <>
            {/* LEFT COLUMN */}
            <div className={styles.leftColumn}>
              
              {/* HEADER INFO BLOCK (Skill Badge + Page Title + Page Subtitle) */}
              <div className={styles.sectionCard}>
                <span className={styles.skillBadge}>
                  {explanationData.skill}
                </span>
                <span className={styles.attemptId}>
                  Attempt ID: <span>{explanationData.attemptId.slice(0, 8)}...</span>
                </span>
                <h1 className={styles.pageTitle}>
                  {language === "vi" ? "Phân Tích Lỗi Sai & Giải Thích AI" : "AI Answer Explanations"}
                </h1>
                <p className={styles.pageSubtitle}>
                  {language === "vi"
                    ? "Xem phân tích chi tiết từng đáp án sai và lời khuyên để bứt phá band điểm."
                    : "Review comprehensive insights on every incorrect answer and expert tips."}
                </p>
              </div>

              {/* FILTER PANEL */}
              <div className={styles.filterPanel}>
                <div className={styles.filterResultsCount}>
                  {language === "vi"
                    ? `Đang hiển thị ${filteredExplanations.length} câu hỏi`
                    : `Showing ${filteredExplanations.length} questions`}
                </div>
                <div className={styles.filterTabs}>
                  <button
                    onClick={() => setFilter("all")}
                    className={`${styles.filterTab} ${filter === "all" ? styles.activeAll : ""}`}
                  >
                    {language === "vi" ? "Tất cả" : "All"}
                  </button>
                  <button
                    onClick={() => setFilter("incorrect")}
                    className={`${styles.filterTab} ${filter === "incorrect" ? styles.activeIncorrect : ""}`}
                  >
                    {language === "vi" ? "Câu Sai" : "Incorrect"}
                  </button>
                  <button
                    onClick={() => setFilter("correct")}
                    className={`${styles.filterTab} ${filter === "correct" ? styles.activeCorrect : ""}`}
                  >
                    {language === "vi" ? "Câu Đúng" : "Correct"}
                  </button>
                </div>
              </div>

              {/* EXPLANATIONS LIST */}
              <div className={styles.explanationsList}>
                {filteredExplanations.length === 0 ? (
                  <div className={styles.emptyListCard}>
                    <Brain size={40} className={styles.emptyListIcon} />
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
                        className={`${styles.questionItem} ${isCorrect ? styles.correctCard : styles.incorrectCard}`}
                      >
                        {/* Item Header */}
                        <div className={styles.questionHeader}>
                          <div className={styles.questionInfo}>
                            <div className={`${styles.questionNumber} ${isCorrect ? styles.correct : styles.incorrect}`}>
                              {item.questionId.replace(/\D/g, "") || idx + 1}
                            </div>
                            <div className={styles.questionTitle}>
                              {language === "vi" ? `Câu hỏi: ${item.questionId}` : `Question: ${item.questionId}`}
                            </div>
                          </div>

                          <div className={styles.answersComparisonBox}>
                            <span className={styles.answerMetaSpan}>
                              <label>{language === "vi" ? "Bạn chọn:" : "Your Answer:"}</label>
                              <span className={`${styles.answerBadge} ${isCorrect ? styles.correct : styles.wrong}`}>
                                {item.userAnswer || (language === "vi" ? "Bỏ qua" : "Skipped")}
                              </span>
                            </span>

                            <span className={styles.answerMetaSpan}>
                              <label>{language === "vi" ? "Đáp án đúng:" : "Correct Answer:"}</label>
                              <span className={`${styles.answerBadge} ${styles.correct}`}>
                                {item.correctAnswer}
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* Item Body (AI Examiner Analysis) */}
                        <div className={styles.aiAnalysisBlock}>
                          <div className={styles.aiAnalysisLabel}>
                            <Sparkles size={14} />
                            {language === "vi" ? "Phân tích từ Giám khảo AI" : "AI Examiner Analysis"}
                          </div>
                          <p className={styles.aiAnalysisText}>
                            {item.explanation}
                          </p>

                          {/* Pro Tip Content */}
                          <div className={styles.proTipBlock}>
                            <div className={styles.proTipLabel}>
                              <Lightbulb size={14} style={{ marginRight: "4px" }} />
                              {language === "vi" ? "Mẹo tránh bẫy & kinh nghiệm" : "Pro Tip & Strategy"}
                            </div>
                            <p className={styles.proTipText}>
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

            {/* RIGHT COLUMN */}
            <div className={styles.rightColumn}>
              {/* Credit info card */}
              <div className={styles.sectionCard}>
                <div className={styles.creditBadge}>
                  <div className={styles.creditIconContainer}>
                    <Coins size={20} />
                  </div>
                  <div className={styles.creditDetails}>
                    <div className={styles.creditTitle}>
                      {language === "vi" ? "Trạng thái giao dịch" : "Transaction"}
                    </div>
                    <div className={styles.creditStatus}>
                      {explanationData.charged
                        ? (language === "vi" ? "Đã khấu trừ 1 Credit" : "1 Credit Charged")
                        : (language === "vi" ? "Truy cập miễn phí (Đã lưu)" : "Free (Previously Generated)")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Analysis Panel (Mini Stats Banner) */}
              <div className={styles.analysisPanel}>
                <div className={styles.analysisHeader}>
                  <h3>{language === "vi" ? "Thống kê kết quả" : "Result Summary"}</h3>
                </div>
                <div className={styles.statsSidebarBody}>
                  <div className={styles.statBlock}>
                    <div className={styles.statInfoLeft}>
                      <div className={styles.statLabelMini}>
                        {language === "vi" ? "Số câu trả lời sai" : "Mistakes Found"}
                      </div>
                      <div className={`${styles.statValLarge} ${styles.incorrect}`}>{stats.incorrect}</div>
                    </div>
                    <XCircle size={28} className={`${styles.statBlockIcon} ${styles.incorrect}`} />
                  </div>

                  <div className={styles.statBlock}>
                    <div className={styles.statInfoLeft}>
                      <div className={styles.statLabelMini}>
                        {language === "vi" ? "Số câu chính xác" : "Correct Answers"}
                      </div>
                      <div className={`${styles.statValLarge} ${styles.correct}`}>{stats.correct}</div>
                    </div>
                    <CheckCircle2 size={28} className={`${styles.statBlockIcon} ${styles.correct}`} />
                  </div>
                </div>
              </div>

              {/* ACTION FOOTER */}
              <div className={styles.sectionCard} style={{ padding: "12px var(--space-6)" }}>
                <button onClick={() => navigate(-1)} className={styles.primaryBtn}>
                  <span>{language === "vi" ? "Quay lại trang kết quả" : "Back to Results"}</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </MainLayout>
  )
}
