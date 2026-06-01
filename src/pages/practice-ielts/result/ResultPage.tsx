import { useEffect, useMemo } from "react"
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { usePracticeStore } from "@/services/practice/practice.store"
import { ArrowLeft, CheckCircle2, XCircle, HelpCircle, Clock, ChevronRight, Sparkles } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { practiceApi } from "@/api/practice.api"
import { userApi } from "@/api/user.api"
import { useUIStore } from "@/services/ui/ui.store"
import MainLayout from "@/components/layout/MainLayout/MainLayout"

import "./ResultPage.css"

export default function ResultPage() {
  const location = useLocation()
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { answers, clearAnswers, sidebar } = usePracticeStore()

  const isDirectAttempt = searchParams.get("type") === "attempt"
  const attemptSkill = searchParams.get("skill")

  // UI state hooks
  const { t, language } = useUIStore()

  // Safety check for undefined ID
  useEffect(() => {
    if (!id || id === "undefined") {
      navigate("/practice-ielts")
    }
  }, [id, navigate])

  // Get data from state or fetch new if refreshed
  const stateData = location.state?.examData

  // 1. Fetch entire Test Session Details (GET /practice/:testId)
  const { data: testSession, isLoading: isLoadingSession } = useQuery({
    queryKey: ["test-session", id],
    queryFn: () => practiceApi.getTestSessionContent(id!).then((res: any) => res.data),
    enabled: !isDirectAttempt && !!id && id !== "undefined",
    staleTime: 1000 * 60 * 5,
  })

  // 2. Extract attemptId for the active skill
  const attemptId = useMemo(() => {
    if (isDirectAttempt) return id || null;
    if (!testSession || !testSession.skills) return null;
    const activeSkillItem = testSession.skills.find(
      (s: any) => s.skillType.toLowerCase() === (sidebar.skill || attemptSkill)?.toLowerCase()
    );
    return activeSkillItem?.attemptId || null;
  }, [id, isDirectAttempt, testSession, sidebar.skill, attemptSkill]);

  // 3. Fetch detailed Graded attempt data (GET /user/attempts/:attemptId)
  const { data: attemptDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["attempt-detail", attemptId],
    queryFn: () => userApi.getAttemptDetail(attemptId!).then((res: any) => res.data),
    enabled: !!attemptId,
    staleTime: 1000 * 60 * 5,
  })

  const isLoading = (!isDirectAttempt && isLoadingSession) || (!!attemptId && isLoadingDetail)

  // Normalize data for fallback
  const examData = useMemo(() => {
    if (stateData) return stateData
    return null
  }, [stateData])

  const stats = useMemo(() => {
    if (attemptDetail) {
      const serverAnswers = attemptDetail.answers || []
      const total = serverAnswers.length
      const correct = serverAnswers.filter((a: any) => a.isCorrect === true).length
      const wrong = serverAnswers.filter((a: any) => a.isCorrect === false).length
      const skipped = serverAnswers.filter((a: any) => !a.userAnswer).length

      // Calculate score: percentage for standard quizzes, band score for IELTS
      const rawScore = total > 0 ? Math.round((correct / total) * 100) : 0
      const score = attemptDetail.bandScore != null ? attemptDetail.bandScore : rawScore
      const isBand = attemptDetail.bandScore != null && attemptDetail.bandScore <= 9

      const details = [
        {
          type: attemptDetail.skill || sidebar.skill || attemptSkill || "Questions",
          total,
          correct
        }
      ]

      return { total, correct, wrong, skipped, score, isBand, details }
    }

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

    return { total, correct, wrong, skipped, score, isBand: false, details }
  }, [attemptDetail, examData, answers, sidebar.skill, attemptSkill])

  if (isLoading) return (
    <MainLayout>
      <div className="loading-state">{language === "vi" ? "Đang phân tích kết quả..." : "Analyzing results..."}</div>
    </MainLayout>
  )

  if (!stats || stats.total === 0) return (
    <MainLayout>
      <div className="error-state">
        <p>{language === "vi" ? "Không tìm thấy dữ liệu câu hỏi để tính điểm." : "No question data found to calculate score."}</p>
        <button onClick={() => navigate("/practice-ielts")} className="back-home-btn cursor-pointer">
          {language === "vi" ? "Quay lại Luyện Tập" : "Back to Practice"}
        </button>
      </div>
    </MainLayout>
  )

  return (
    <MainLayout>
      <div className="result-page-container">
        <header className="result-header">
          <div className="result-header-content">
            <button onClick={() => navigate(-1)} className="back-button cursor-pointer">
              <ArrowLeft size={20} />
              {t("result_back")}
            </button>
            <div className="header-title">{t("result_header_title")}</div>
          </div>
        </header>

        <main className="result-main">
          <div className="result-grid">

            {/* LEFT CONTENT */}
            <div className="result-left-column">
              <div className="overview-card">
                <div className="overview-content">
                  <h1 className="overview-title">
                    {stats.isBand
                      ? (stats.score >= 7.5 ? t("result_score_excellent") : stats.score >= 5.5 ? t("result_score_good") : t("result_score_keep_trying"))
                      : (stats.score >= 80 ? t("result_score_excellent") : stats.score >= 50 ? t("result_score_good") : t("result_score_keep_trying"))
                    }
                  </h1>
                  <p className="overview-subtitle">
                    {stats.isBand
                      ? `${language === "vi" ? "Kết quả bài thi đạt Band Score:" : "Achieved Band Score:"} ${stats.score}`
                      : `${t("result_score_subtitle")} ${stats.score}% ${language === "vi" ? "độ chính xác." : "accuracy."}`
                    }
                  </p>

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

              {/* DETAILED ANSWERS KEY */}
              <div className="details-card" style={{ marginTop: "24px" }}>
                <div className="details-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9", paddingBottom: "16px", marginBottom: "20px" }}>
                  <h2>{language === "vi" ? "Đáp Án Chi Tiết" : "Detailed Answer Review"}</h2>
                  {attemptId && (
                    <button
                      onClick={() => navigate(`/practice-ielts/explain/${attemptId}`)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl font-bold text-[11px] transition-all shadow-sm hover:shadow cursor-pointer select-none border-0"
                    >
                      <Sparkles size={13} className="text-indigo-200 animate-pulse" />
                      {attemptDetail?.hasExplanation
                        ? (language === "vi" ? "Xem giải thích AI (Miễn phí)" : "View AI Explanation (Free)")
                        : (language === "vi" ? "Giải thích bằng AI (1 Credit)" : "Explain with AI (1 Credit)")
                      }
                    </button>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {attemptDetail ? (
                    (attemptDetail.answers || []).map((ans: any, idx: number) => (
                      <div key={idx} style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "16px 20px",
                        borderRadius: "16px",
                        background: ans.isCorrect === true ? "#f0fdf4" : ans.isCorrect === false ? "#fef2f2" : "#f8fafc",
                        border: `1px solid ${ans.isCorrect === true ? "#bbf7d0" : ans.isCorrect === false ? "#fecaca" : "#e2e8f0"}`,
                        transition: "all 0.2s"
                      }}>
                        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                          <div style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            background: ans.isCorrect === true ? "#22c55e" : ans.isCorrect === false ? "#ef4444" : "#94a3b8",
                            color: "#fff",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontWeight: 800,
                            fontSize: "14px"
                          }}>
                            {idx + 1}
                          </div>
                          <div>
                            <div style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b", textTransform: "capitalize" }}>
                              {language === "vi" ? `Câu hỏi: ${ans.questionId.replace(/_/g, " ")}` : `Question: ${ans.questionId.replace(/_/g, " ")}`}
                            </div>
                            <div style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
                              {language === "vi" ? "Đáp án của bạn: " : "Your Answer: "}
                              <span style={{ fontWeight: 700, color: ans.isCorrect === true ? "#15803d" : ans.isCorrect === false ? "#b91c1c" : "#475569" }}>
                                {ans.userAnswer || (language === "vi" ? "Bỏ qua" : "Skipped")}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "13px", color: "#64748b" }}>
                            {language === "vi" ? "Đáp án đúng: " : "Correct Answer: "}
                            <span style={{ fontWeight: 800, color: "#1e293b" }}>{ans.correctAnswer || "N/A"}</span>
                          </div>
                          {ans.timeSpentSec != null && (
                            <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
                              ⏱️ {ans.timeSpentSec}s
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ textAlign: "center", color: "#94a3b8", padding: "20px" }}>
                      {language === "vi" ? "Đáp án chi tiết sẽ được tự động hiển thị khi hoàn tất nộp bài." : "Detailed answers will automatically render once submitted successfully."}
                    </p>
                  )}
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
                  {stats.score}{stats.isBand ? <span className="score-unit" style={{ fontSize: "1.8rem", marginLeft: 6 }}>Band</span> : <span className="score-unit">%</span>}
                </div>
                <p className="analysis-text">
                  {t("result_analysis_text")}
                </p>

                <div className="action-buttons">
                  <button
                    onClick={() => attemptId && navigate(`/practice-ielts/explain/${attemptId}`)}
                    className="primary-btn cursor-pointer"
                  >
                    {t("result_btn_review")} <ChevronRight size={18} />
                  </button>
                  <button
                    onClick={() => {
                      clearAnswers()
                      navigate("/practice-ielts")
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
    </MainLayout>
  )
}
