import { useEffect, useMemo } from "react"
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { usePracticeStore } from "@/services/practice/practice.store"
import { ArrowLeft, CheckCircle2, XCircle, HelpCircle, Clock, ChevronRight, Sparkles } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { practiceApi } from "@/api/practice.api"
import { userApi } from "@/api/user.api"
import { useUIStore } from "@/services/ui/ui.store"
import MainLayout from "@/components/layout/MainLayout/MainLayout"

import styles from "./ResultPage.module.css"

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
      <div className={styles.loadingState}>{language === "vi" ? "Đang phân tích kết quả..." : "Analyzing results..."}</div>
    </MainLayout>
  )

  if (!stats || stats.total === 0) return (
    <MainLayout>
      <div className={styles.errorState}>
        <p>{language === "vi" ? "Không tìm thấy dữ liệu câu hỏi để tính điểm." : "No question data found to calculate score."}</p>
        <button onClick={() => navigate("/practice-ielts")} className={styles.primaryBtn} style={{ width: "auto" }}>
          {language === "vi" ? "Quay lại Luyện Tập" : "Back to Practice"}
        </button>
      </div>
    </MainLayout>
  )

  return (
    <MainLayout>
      <div className={styles.pageWrapper}>

        {/* LEFT CONTENT */}
        <div className={styles.leftColumn}>
          
          {/* HEADER INFO BLOCK (Skill Badge + Page Title + Page Subtitle) */}
          <div className={styles.sectionCard}>
            <span className={styles.skillBadge}>
              {attemptDetail?.skill || sidebar.skill || attemptSkill || "IELTS"}
            </span>
            {attemptId && (
              <span className={styles.attemptId}>
                Attempt ID: {attemptId.slice(0, 8)}...
              </span>
            )}
            <h1 className={styles.pageTitle}>
              {stats.isBand
                ? (stats.score >= 7.5 ? t("result_score_excellent") : stats.score >= 5.5 ? t("result_score_good") : t("result_score_keep_trying"))
                : (stats.score >= 80 ? t("result_score_excellent") : stats.score >= 50 ? t("result_score_good") : t("result_score_keep_trying"))
              }
            </h1>
            <p className={styles.pageSubtitle}>
              {stats.isBand
                ? `${language === "vi" ? "Kết quả bài thi đạt Band Score:" : "Achieved Band Score:"} ${stats.score}`
                : `${t("result_score_subtitle")} ${stats.score}% ${language === "vi" ? "độ chính xác." : "accuracy."}`
              }
            </p>

            {/* STAT ROW */}
            <div className={styles.statGrid}>
              <div className={`${styles.statItem} ${styles.correct}`}>
                <div className={styles.statLabel}>{t("result_correct")}</div>
                <div className={`${styles.statNumber} ${styles.correct}`}>{stats.correct}</div>
              </div>
              <div className={`${styles.statItem} ${styles.wrong}`}>
                <div className={styles.statLabel}>{t("result_wrong")}</div>
                <div className={`${styles.statNumber} ${styles.wrong}`}>{stats.wrong}</div>
              </div>
              <div className={`${styles.statItem} ${styles.skipped}`}>
                <div className={styles.statLabel}>{t("result_skipped")}</div>
                <div className={`${styles.statNumber} ${styles.skipped}`}>{stats.skipped}</div>
              </div>
            </div>
          </div>

          {/* PERF BY TYPE DETAILS CARD */}
          <div className={styles.sectionCard}>
            <div className={styles.detailsHeader}>
              <h2>{t("result_perf_by_type")}</h2>
            </div>
            <div className={styles.detailsList}>
              {stats.details.map((item: any, idx: number) => (
                <div key={idx} className={styles.detailsItem}>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemIcon}>
                      <HelpCircle size={20} />
                    </div>
                    <div>
                      <div className={styles.itemType}>{item.type.replace(/_/g, " ")}</div>
                      <div className={styles.itemCount}>{item.total} {language === "vi" ? "câu hỏi" : "questions"}</div>
                    </div>
                  </div>
                  <div className={styles.itemProgressContainer}>
                    <div className={styles.progressText}>
                      <div className={styles.progressPercent}>{Math.round((item.correct / item.total) * 100)}%</div>
                      <div className={styles.progressLabel}>{t("result_accuracy")}</div>
                    </div>
                    <div className={styles.progressBarBg}>
                      <div
                        className={styles.progressBarFill}
                        style={{ width: `${(item.correct / item.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DETAILED ANSWERS KEY */}
          <div className={styles.sectionCard}>
            <div className={styles.detailsHeader}>
              <h2>{language === "vi" ? "Đáp Án Chi Tiết" : "Detailed Answer Review"}</h2>
              {attemptId && (
                <button
                  onClick={() => navigate(`/practice-ielts/explain/${attemptId}`)}
                  className={styles.primaryBtn}
                  style={{ width: "auto" }}
                >
                  <Sparkles size={13} className="animate-pulse" />
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
                  <div key={idx} className={styles.questionItem}>
                    <div className={styles.questionInfo}>
                      <div className={`${styles.questionNumber} ${ans.isCorrect === true ? styles.correct : ans.isCorrect === false ? styles.wrong : ""}`}>
                        {idx + 1}
                      </div>
                      <div>
                        <div className={styles.questionTitle}>
                          {language === "vi" ? `Câu hỏi: ${ans.questionId.replace(/_/g, " ")}` : `Question: ${ans.questionId.replace(/_/g, " ")}`}
                        </div>
                        <div className={styles.answerRow}>
                          {language === "vi" ? "Đáp án của bạn: " : "Your Answer: "}
                          <span className={`${styles.answerBadge} ${ans.isCorrect === true ? styles.correct : ans.isCorrect === false ? styles.wrong : styles.skipped}`}>
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

        {/* RIGHT SIDEBAR COLUMN */}
        <div className={styles.rightColumn}>
          <div className={styles.analysisPanel}>
            <div className={styles.analysisHeader}>
              <div className={styles.itemIcon}>
                <Clock size={20} />
              </div>
              <div className={styles.analysisLabel}>{t("result_analysis")}</div>
            </div>

            <div className={styles.bandScore}>
              {stats.score}
              <span className={styles.bandScoreUnit}>
                {stats.isBand ? "Band" : "%"}
              </span>
            </div>
            <p className={styles.analysisText}>
              {t("result_analysis_text")}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button
                onClick={() => attemptId && navigate(`/practice-ielts/explain/${attemptId}`)}
                className={styles.primaryBtn}
              >
                {t("result_btn_review")} <ChevronRight size={18} />
              </button>
              <button
                onClick={() => {
                  clearAnswers()
                  navigate("/practice-ielts")
                }}
                className={styles.secondaryBtn}
              >
                {t("result_btn_more")}
              </button>
            </div>
          </div>

          <div className={styles.tipCard}>
            <h3 className={styles.tipTitle}>{t("result_tip_title")}</h3>
            <p className={styles.tipText}>
              {t("result_tip_text")}
            </p>
          </div>
        </div>

      </div>
    </MainLayout>
  )
}
