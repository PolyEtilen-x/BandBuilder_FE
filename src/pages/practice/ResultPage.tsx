import { useEffect, useMemo } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { usePracticeStore } from "@/services/practice/practice.store"
import { ArrowLeft, CheckCircle2, XCircle, HelpCircle, Clock, ChevronRight } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { practiceApi } from "@/api/practice.api"
import { useUIStore } from "@/services/ui/ui.store"

import "./ResultPage.css"

export default function ResultPage() {
  const location = useLocation()
  const { id } = useParams()
  const navigate = useNavigate()
  const answers = usePracticeStore(state => state.answers)
  const clearAnswers = usePracticeStore(state => state.clearAnswers)

  // UI state hooks
  const { t, language } = useUIStore()

  // Safety check for undefined ID
  useEffect(() => {
    if (!id || id === "undefined") {
      navigate("/practice")
    }
  }, [id, navigate])

  // Get data from state or fetch new if refreshed
  const stateData = location.state?.examData

  const { data: fetchedTest, isLoading } = useQuery({
    queryKey: ["practice-test", id],
    queryFn: () => practiceApi.getSkillPreview(id!).then(res => res.data),
    enabled: !stateData && !!id && id !== "undefined"
  })

  // Normalize data
  const examData = useMemo(() => {
    if (stateData) return stateData
    if (fetchedTest) return fetchedTest
    return null
  }, [stateData, fetchedTest])

  const stats = useMemo(() => {
    if (!examData) return null

    let total = 0
    let correct = 0
    let skipped = 0
    const details: any[] = []

    const sections = examData.sections || (examData.content?.passages ? examData.content.passages : [examData])

    sections.forEach((section: any) => {
      if (!section.question_blocks) return
      section.question_blocks.forEach((block: any) => {
        const type = block.question_type || "Questions"
        let blockTotal = 0
        let blockCorrect = 0

        const questions = block.questions || []
        questions.forEach((q: any) => {
          total++
          blockTotal++
          const userAns = answers[q.id]
          const isCorrect = userAns?.toString().trim().toLowerCase() === q.correct_answer?.toString().trim().toLowerCase()

          if (!userAns) skipped++
          else if (isCorrect) {
            correct++
            blockCorrect++
          }
        })

        if (blockTotal > 0) {
          const existing = details.find(d => d.type === type)
          if (existing) {
            existing.total += blockTotal
            existing.correct += blockCorrect
          } else {
            details.push({ type, total: blockTotal, correct: blockCorrect })
          }
        }
      })
    })

    const wrong = total - correct - skipped
    const score = total > 0 ? Math.round((correct / total) * 100) : 0

    return { total, correct, wrong, skipped, score, details }
  }, [examData, answers])

  if (isLoading) return <div className="loading-state">{language === "vi" ? "Đang phân tích kết quả..." : "Analyzing results..."}</div>

  if (!stats || stats.total === 0) return (
    <div className="error-state">
      <p>{language === "vi" ? "Không tìm thấy dữ liệu câu hỏi để tính điểm." : "No question data found to calculate score."}</p>
      <button onClick={() => navigate("/practice")} className="back-home-btn cursor-pointer">
        {language === "vi" ? "Quay lại Luyện Tập" : "Back to Practice"}
      </button>
    </div>
  )

  return (
    <div className="result-page-container">
      <header className="result-header">
        <div className="result-header-content">
          <button onClick={() => navigate(-1)} className="back-button cursor-pointer">
            <ArrowLeft size={20} />
            {t("result_back")}
          </button>
          <div className="header-title">{t("result_header_title")}</div>
          <div style={{ width: 40 }}></div>
        </div>
      </header>

      <main className="result-main">
        <div className="result-grid">

          {/* LEFT CONTENT */}
          <div className="result-left-column">
            <div className="overview-card">
              <div className="overview-content">
                <h1 className="overview-title">
                  {stats.score >= 80 ? t("result_score_excellent") : stats.score >= 50 ? t("result_score_good") : t("result_score_keep_trying")}
                </h1>
                <p className="overview-subtitle">{t("result_score_subtitle")} {stats.score}% {language === "vi" ? "độ chính xác." : "accuracy."}</p>

                <div className="stats-grid">
                  <div className="stat-box correct">
                    <div className="stat-label">{t("result_correct")}</div>
                    <div className="stat-value">{stats.correct}</div>
                  </div>
                  <div className="stat-box wrong">
                    <div className="stat-label">{t("result_wrong")}</div>
                    <div className="stat-value">{stats.wrong}</div>
                  </div>
                  <div className="stat-box skipped">
                    <div className="stat-label">{t("result_skipped")}</div>
                    <div className="stat-value">{stats.skipped}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="details-card">
              <div className="details-header">
                <h2>{t("result_perf_by_type")}</h2>
              </div>
              <div className="details-list">
                {stats.details.map((item: any, idx: number) => (
                  <div key={idx} className="details-item">
                    <div className="item-info">
                      <div className="item-icon">
                        <HelpCircle size={20} />
                      </div>
                      <div className="item-text">
                        <div className="item-type">{item.type.replace(/_/g, " ")}</div>
                        <div className="item-count">{item.total} {language === "vi" ? "câu hỏi" : "questions"}</div>
                      </div>
                    </div>
                    <div className="item-progress-container">
                      <div className="progress-text">
                        <div className="progress-percent">{Math.round((item.correct / item.total) * 100)}%</div>
                        <div className="progress-label">{t("result_accuracy")}</div>
                      </div>
                      <div className="progress-bar-bg">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${(item.correct / item.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="result-right-column">
            <div className="analysis-card">
              <div className="analysis-header">
                <div className="analysis-icon-box">
                  <Clock size={20} color="#60a5fa" />
                </div>
                <div className="analysis-label">{t("result_analysis")}</div>
              </div>

              <div className="score-display">
                {stats.score}<span className="score-unit">%</span>
              </div>
              <p className="analysis-text">
                {t("result_analysis_text")}
              </p>

              <div className="action-buttons">
                <button
                  onClick={() => navigate(`/practice/review/${id}`)}
                  className="primary-btn cursor-pointer"
                >
                  {t("result_btn_review")} <ChevronRight size={18} />
                </button>
                <button
                  onClick={() => {
                    clearAnswers()
                    navigate("/practice")
                  }}
                  className="secondary-btn cursor-pointer"
                >
                  {t("result_btn_more")}
                </button>
              </div>
            </div>

            <div className="tip-card">
              <h3 className="tip-title">{t("result_tip_title")}</h3>
              <p className="tip-text">
                {t("result_tip_text")}
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
