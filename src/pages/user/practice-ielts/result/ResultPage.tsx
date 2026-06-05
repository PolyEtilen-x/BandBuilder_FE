import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { usePracticeStore } from "@/services/practice/practice.store"
import { ArrowLeft, CheckCircle2, XCircle, HelpCircle, Clock, ChevronRight, Sparkles, ChevronDown, ChevronUp } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { practiceApi } from "@/api/practice/practice.api"
import { userApi } from "@/api/user.api"
import { useUIStore } from "@/services/ui/ui.store"
import MainLayout from "@/components/layout/MainLayout/MainLayout"
import { PageContainer, Section, Card } from "@/components/ui/LayoutPrimitives"
import WritingResultView from "./WritingResultView"

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
  const isWriting = (attemptDetail?.skill || sidebar.skill || attemptSkill)?.toLowerCase() === "writing"

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

  const recommendations = useMemo(() => {
    if (!stats) return []
    const acc = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0
    if (acc >= 80) {
      return language === "vi"
        ? [
          "Xuất sắc! Bạn đã làm chủ hoàn toàn kỹ năng này với độ chính xác cực cao.",
          "Hãy duy trì phong độ bằng cách thử thách các đề thi đầy đủ (Full Practice Tests) dưới áp lực phòng thi thật.",
          "Xem lại các lỗi sai nhỏ (nếu có) để triệt tiêu hoàn toàn những sơ suất không đáng có."
        ]
        : [
          "Outstanding! You have fully mastered this skill with exceptional accuracy.",
          "Keep up the momentum by challenging yourself with Full Practice Tests under real exam conditions.",
          "Review minor slip-ups (if any) to eliminate any remaining careless mistakes."
        ]
    } else if (acc >= 50) {
      return language === "vi"
        ? [
          "Kỹ năng nền tảng khá tốt, tuy nhiên bạn vẫn có thể mắc phải các 'bẫy thông tin' (distractors) hoặc hiểu sai ý từ khóa.",
          "Nên tập trung luyện tập lại các dạng câu hỏi có phần trăm chính xác thấp nhất ở bảng dưới.",
          "Sử dụng tính năng 'Giải thích bằng AI' bên dưới để sửa đổi tư duy chọn đáp án."
        ]
        : [
          "Your foundation is decent, but you are still prone to information distractors or misinterpreting keywords.",
          "Focus on practicing the specific question types that yielded the lowest accuracy in the metrics below.",
          "Use the 'Explain with AI' feature to correct and refine your answer selection mindset."
        ]
    } else {
      return language === "vi"
        ? [
          "Kỹ năng hiện tại cần được củng cố kỹ lưỡng hơn về cả từ vựng và phương pháp định vị thông tin.",
          "Hãy học thuộc các bộ từ khóa và đồng nghĩa (synonyms) trước khi tiếp tục làm đề tính giờ.",
          "Kích hoạt 'Giải thích bằng AI' cho các câu sai để nắm rõ lộ trình tư duy giải câu hỏi."
        ]
        : [
          "Your current skill level requires rigorous reinforcement of both vocabulary and keyword-matching strategies.",
          "Learn essential synonyms and paraphrasing groups before taking more timed quizzes.",
          "Activate 'Explain with AI' on incorrect answers to fully comprehend the logic pathway."
        ]
    }
  }, [stats, language])

  if (isLoading) return (
    <MainLayout>
      <div className="loading-state-wrapper">
        <div className="loader-ring"></div>
        <p className="loading-text">{language === "vi" ? "Đang phân tích kết quả..." : "Analyzing results..."}</p>
      </div>
    </MainLayout>
  )

  if (!stats || stats.total === 0) return (
    <MainLayout>
      <div className="error-state-card">
        <XCircle size={48} className="error-icon" />
        <h3>{language === "vi" ? "Thiếu Dữ Liệu" : "Missing Data"}</h3>
        <p>{language === "vi" ? "Không tìm thấy dữ liệu câu hỏi để tính điểm." : "No question data found to calculate score."}</p>
        <button onClick={() => navigate("/practice-ielts")} className="primary-btn" style={{ width: "auto" }}>
          {language === "vi" ? "Quay lại Luyện Tập" : "Back to Practice"}
        </button>
      </div>
    </MainLayout>
  )

  return (
    <MainLayout>
      <div className="profile-page-wrapper">
        <div className="profile-main-container">

          {/* TOP SECTION: RESULT HERO CARD */}
          <section className="profile-hero-card">
            <div className="user-profile-info">
              {/* Score Circular Visualizer (Avatar-like block) */}
              <div className="profile-avatar-wrapper">
                <span className="visualizer-score-large">{stats.score}</span>
                <span className="visualizer-unit-sub">{stats.isBand ? "Band" : "%"}</span>
              </div>

              <div className="user-meta-info">
                <div className="user-name-row">
                  <h1>
                    {stats.isBand
                      ? (stats.score >= 7.5 ? t("result_score_excellent") : stats.score >= 5.5 ? t("result_score_good") : t("result_score_keep_trying"))
                      : (stats.score >= 80 ? t("result_score_excellent") : stats.score >= 50 ? t("result_score_good") : t("result_score_keep_trying"))
                    }
                  </h1>
                  <span className="membership-tag pro">
                    {attemptDetail?.skill || sidebar.skill || attemptSkill || "IELTS"}
                  </span>
                </div>
                <p className="user-email-text">
                  {stats.isBand
                    ? `${language === "vi" ? "Bạn đã đạt mức điểm Band Score cực kỳ ấn tượng:" : "You achieved an impressive Band Score of:"} ${stats.score}`
                    : `${t("result_score_subtitle")} ${stats.score}% ${language === "vi" ? "độ chính xác hoàn hảo." : "perfect accuracy."}`
                  }
                </p>
                {attemptId && (
                  <div className="user-credits-info">
                    <span>Attempt ID: {attemptId.slice(0, 8)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="profile-header-actions">
              {attemptId && (
                <button
                  onClick={() => navigate(`/practice-ielts/explain/${attemptId}`)}
                  className="btn-action-primary cursor-pointer"
                >
                  <Sparkles size={18} />
                  <span>
                    {attemptDetail?.hasExplanation
                      ? (language === "vi" ? "Xem giải thích AI (Miễn phí)" : "View AI Explanation (Free)")
                      : (language === "vi" ? "Giải thích bằng AI (1 Credit)" : "Explain with AI (1 Credit)")
                    }
                  </span>
                </button>
              )}
              <button
                onClick={() => {
                  clearAnswers()
                  navigate("/practice-ielts")
                }}
                className="btn-action-secondary cursor-pointer"
              >
                <ArrowLeft size={18} />
                {language === "vi" ? "Luyện tập tiếp" : "Continue Practice"}
              </button>
            </div>
          </section>

          {/* STATS SECTION */}
          {!isWriting && (
            <div className="profile-stats-grid">
              <div className="profile-stat-box correct">
                <div className="stat-box-icon">
                  <CheckCircle2 size={24} />
                </div>
                <div className="stat-box-content">
                  <div className="stat-box-value">{stats.correct}</div>
                  <div className="stat-box-label">{t("result_correct")}</div>
                </div>
              </div>

              <div className="profile-stat-box wrong">
                <div className="stat-box-icon">
                  <XCircle size={24} />
                </div>
                <div className="stat-box-content">
                  <div className="stat-box-value">{stats.wrong}</div>
                  <div className="stat-box-label">{t("result_wrong")}</div>
                </div>
              </div>

              <div className="profile-stats-grid--skipped-wrapper">
                <div className="profile-stat-box skipped">
                  <div className="stat-box-icon">
                    <HelpCircle size={24} />
                  </div>
                  <div className="stat-box-content">
                    <div className="stat-box-value">{stats.skipped}</div>
                    <div className="stat-box-label">{t("result_skipped")}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BOTTOM SECTION: MAIN CONTENT & SIDEBAR */}
          <div className="profile-bottom-grid">

            {/* Left Content Column */}
            <div className="profile-main-column">
              {isWriting && attemptDetail?.writingEvaluation ? (
                <WritingResultView evaluation={attemptDetail.writingEvaluation} language={language} />
              ) : (
                <>
                  {/* 1. PERFORMANCE METRICS */}
                  <div className="recent-activity-card">
                    <div className="card-header-row">
                      <h2>{t("result_perf_by_type")}</h2>
                    </div>
                    <div className="metrics-list-premium">
                      {stats.details.map((item: any, idx: number) => {
                        const percent = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0
                        return (
                          <div key={idx} className="metric-row-premium">
                            <div className="metric-item-meta">
                              <span className="metric-type-title">{item.type.replace(/_/g, " ")}</span>
                              <span className="metric-question-count">
                                {item.total} {language === "vi" ? "câu hỏi" : "questions"}
                              </span>
                            </div>

                            <div className="metric-progress-wrapper">
                              <div className="progress-bar-background">
                                <div
                                  className={`progress-bar-fill-premium ${percent >= 80 ? 'high' : percent >= 50 ? 'medium' : 'low'}`}
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                              <span className="progress-percent-label">{percent}%</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* 2. AI RECOMMENDATIONS */}
                  <div className="recent-activity-card">
                    <div className="card-header-row">
                      <h2>{language === "vi" ? "Lộ Trình Cải Thiện Cá Nhân Hóa" : "Personalized Improvement Plan"}</h2>
                    </div>
                    <p className="rec-intro">
                      {language === "vi"
                        ? "Dựa trên phân tích kết quả bài thi của bạn, Giám khảo AI khuyên bạn nên thực hiện các bước sau:"
                        : "Based on your test session analytics, the AI Examiner recommends following these customized steps:"}
                    </p>
                    <div className="recommendation-list">
                      {recommendations.map((rec, i) => (
                        <div key={i} className="recommendation-item">
                          <div className="recommendation-bullet">{i + 1}</div>
                          <p className="recommendation-text">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. QUESTION DETAIL REVIEW */}
                  <div className="recent-activity-card">
                    <div className="card-header-row">
                      <div>
                        <h2>{language === "vi" ? "Xem Đáp Án Chi Tiết" : "Detailed Answer Review"}</h2>
                        <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "#64748b" }}>
                          {language === "vi"
                            ? "Nhấp vào nút giải thích AI ở trên đầu trang để nhận phân tích chi tiết của toàn bộ đáp án."
                            : "Click the AI explanation button at the top header to parse detailed errors."}
                        </p>
                      </div>
                    </div>

                    <div className="questions-review-list">
                      {attemptDetail ? (
                        (attemptDetail.answers || []).map((ans: any, idx: number) => (
                          <div key={idx} className="review-question-row">
                            <div className="q-row-left">
                              <div className={`q-number-badge ${ans.isCorrect === true ? 'correct' : ans.isCorrect === false ? 'wrong' : 'skipped'}`}>
                                {idx + 1}
                              </div>

                              <div className="q-meta-content">
                                <div className="q-title-label">
                                  {language === "vi" ? `Câu hỏi ${idx + 1}` : `Question ${idx + 1}`}
                                  <span className="q-id-sub">({ans.questionId.replace(/_/g, " ")})</span>
                                </div>
                                <div className="q-user-ans">
                                  {language === "vi" ? "Đáp án của bạn: " : "Your Answer: "}
                                  <span className={`ans-val ${ans.isCorrect === true ? 'correct' : ans.isCorrect === false ? 'wrong' : 'skipped'}`}>
                                    {ans.userAnswer || (language === "vi" ? "Chưa trả lời" : "Not answered")}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="q-row-right">
                              <div className="q-correct-ans">
                                <span className="correct-ans-label">{language === "vi" ? "Đáp án đúng:" : "Correct Answer:"}</span>
                                <span className="correct-ans-value">{ans.correctAnswer || "N/A"}</span>
                              </div>
                              {ans.timeSpentSec != null && (
                                <div className="time-spent-badge">
                                  ⏱️ {ans.timeSpentSec}s
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="no-answers-placeholder">
                          {language === "vi" ? "Đáp án chi tiết sẽ được tự động hiển thị khi hoàn tất nộp bài." : "Detailed answers will automatically render once submitted successfully."}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Right Column Sidebar */}
            <div className="profile-sidebar-cards">

              {/* Sticky Summary Card */}
              <div className="account-summary-card sticky-sidebar">
                <div className="score-large-display-sidebar">
                  <span className="score-number-large">{stats.score}</span>
                  <span className="score-unit-large">{stats.isBand ? "Band" : "%"}</span>
                </div>
                <h3>{t("result_analysis")}</h3>
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, marginBottom: 20 }}>
                  {t("result_analysis_text")}
                </p>

                <div className="sidebar-action-buttons">
                  {attemptId && (
                    <button
                      onClick={() => navigate(`/practice-ielts/explain/${attemptId}`)}
                      className="btn-action-primary cursor-pointer"
                    >
                      <span>{t("result_btn_review")}</span>
                      <ChevronRight size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      clearAnswers()
                      navigate("/practice-ielts")
                    }}
                    className="btn-action-secondary cursor-pointer"
                  >
                    {t("result_btn_more")}
                  </button>
                </div>
              </div>

              {/* Pro Upsell Card */}
              <div className="pro-upsell-card">
                <div className="upsell-icon"><Sparkles size={32} /></div>
                <h4>{language === "vi" ? "Bứt Phá Điểm Số Cùng Pro" : "Accelerate Scores with Pro"}</h4>
                <p>
                  {language === "vi"
                    ? "Mở khóa giải thích AI không giới hạn, phân tích phát âm chuyên sâu từng âm tiết và lộ trình sửa lỗi ngữ pháp tự động."
                    : "Unlock unlimited expert AI answer breakdowns, detailed pronunciation AI voice analysis, and automated grammar correction pathways."}
                </p>

                <div style={{ marginBottom: 20 }}>
                  <div className="benefit-item">
                    <CheckCircle2 size={14} />
                    <span>{language === "vi" ? "Vô hạn phân tích AI" : "Unlimited AI analytics"}</span>
                  </div>
                  <div className="benefit-item">
                    <CheckCircle2 size={14} />
                    <span>{language === "vi" ? "Chữa nói chi tiết 1-1" : "1-on-1 speaking feedback"}</span>
                  </div>
                  <div className="benefit-item">
                    <CheckCircle2 size={14} />
                    <span>{language === "vi" ? "Tối ưu hóa từ vựng nâng band" : "Band-boosting vocabulary tools"}</span>
                  </div>
                </div>

                <button className="cursor-pointer" onClick={() => navigate("/upgrade")}>
                  {language === "vi" ? "Nâng Cấp Ngay" : "Upgrade Premium"}
                </button>
              </div>

              {/* Sidebar Tip Card */}
              <div className="sidebar-tip-card">
                <h3 className="tip-header-title">💡 {t("result_tip_title")}</h3>
                <p className="tip-paragraph-content">
                  {t("result_tip_text")}
                </p>
              </div>

            </div>

          </div>

        </div>
      </div>
    </MainLayout>
  )
}



