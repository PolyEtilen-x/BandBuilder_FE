import { useState } from "react"
import { usePracticeStore } from "@/services/practice/practice.store"
import { useNavigate, useParams } from "react-router-dom"
import { practiceApi } from "@/api/practice/practice.api"
import { useUIStore } from "@/services/ui/ui.store"

export default function QuestionNavigator({ questionBlocks = [], examId: propExamId, currentUnit, isWriting = false, taskNumber }: any) {
  const { id: urlId } = useParams()
  const examId = propExamId || urlId
  const { answers, startTime, sidebar, clearAnswers } = usePracticeStore()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { language } = useUIStore()

  const parseRange = (range: string) => {
    if (!range) return []
    const parts = range.split("-").map(p => parseInt(p.trim()))
    if (parts.length === 1) return [parts[0]]
    if (parts.length === 2) {
      const res = []; for (let i = parts[0]; i <= parts[1]; i++) res.push(i)
      return res
    }
    return []
  }

  const flatQuestions = questionBlocks.flatMap((block: any, index: number) => {
    if (block.questions && block.questions.length > 0) return block.questions
    return parseRange(block.questions_range).map(num => ({
      id: `${block.id || index}_${num}`,
      number: num
    }))
  })

  const goToQuestion = (id: string) => {
    const el = document.getElementById(`question-${id}`)
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  const handleFinish = async () => {
    if (!window.confirm(language === "vi" ? "Bạn có chắc chắn muốn nộp bài thi không?" : "Are you sure you want to finish the test?")) return

    setIsSubmitting(true)
    try {
      const timeSpentSec = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0

      if (isWriting) {
        // Writing: submit the essay via task-specific endpoint
        const task = taskNumber ?? 1
        const storageKey = `task${task}` as "task1" | "task2"
        const essay = (answers[storageKey] as string | undefined) ?? ""

        const minWords = task === 1 ? 100 : 200
        const wordCount = essay.trim() === "" ? 0 : essay.trim().split(/\s+/).length

        if (wordCount < minWords) {
          alert(
            language === "vi"
              ? `Bài viết của bạn quá ngắn (${wordCount} từ). Bạn cần viết ít nhất ${minWords} từ cho Task ${task}.`
              : `Your essay is too short (${wordCount} words). You need at least ${minWords} words for Task ${task}.`
          );
          setIsSubmitting(false)
          return
        }

        const formattedAnswers = [{ questionId: storageKey, userAnswer: essay }]

        try {
          if (task === 1) {
            await practiceApi.submitWritingTask1(examId, { answers: formattedAnswers, timeSpentSec })
          } else {
            await practiceApi.submitWritingTask2(examId, { answers: formattedAnswers, timeSpentSec })
          }
        } catch (err: any) {
          if (err?.response?.status === 409) {
            console.log("Writing task already submitted, proceeding to result page.")
          } else {
            throw err
          }
        }
      } else {
        // Reading / Listening: generic submit
        const formattedAnswers = Object.entries(answers).map(([questionId, userAnswer]) => ({
          questionId,
          userAnswer: String(userAnswer)
        }))

        try {
          await practiceApi.submitSkillAnswers(examId, sidebar.skill, {
            answers: formattedAnswers,
            timeSpentSec
          })
        } catch (err: any) {
          if (err?.response?.status === 409) {
            console.log("Answers already submitted on server, proceeding to Result Page.")
          } else {
            throw err
          }
        }
      }

      // Clear answers and navigate to result
      clearAnswers()
      navigate(`/practice-ielts/result/${examId}`, {
        state: {
          examData: { sections: [currentUnit] }
        }
      })
    } catch (err) {
      console.error("Submit failed:", err)
      alert(language === "vi" ? "Nộp bài thất bại. Vui lòng thử lại." : "Failed to submit test results. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <nav style={{
      height: "100%", padding: "0 30px", display: "flex", justifyContent: "space-between",
      alignItems: "center", backgroundColor: "#fff", boxShadow: "0 -4px 12px rgba(0,0,0,0.05)"
    }}>
      {/* Question grid — hidden for writing */}
      {!isWriting && (
        <div style={{ display: "flex", gap: "12px", overflowX: "auto", padding: "10px 0", flex: 1, marginRight: "30px" }} className="no-scrollbar">
          {flatQuestions.map((q: any) => {
            const answered = !!answers[q.id]
            return (
              <button
                key={q.id} onClick={() => goToQuestion(q.id)}
                style={{
                  minWidth: "40px", height: "40px", borderRadius: "10px", fontWeight: 800,
                  border: `2px solid ${answered ? "#174593" : "#f1f5f9"}`,
                  background: answered ? "#174593" : "#fff", color: answered ? "#fff" : "#94a3b8",
                  cursor: "pointer", transition: "all 0.2s", fontSize: "14px"
                }}
              >
                {q.number}
              </button>
            )
          })}
        </div>
      )}

      {/* Writing status label */}
      {isWriting && (() => {
        const task = taskNumber ?? 1
        const storageKey = `task${task}` as "task1" | "task2"
        const essay = (answers[storageKey] as string | undefined) ?? ""
        const wordCount = essay.trim() === "" ? 0 : essay.trim().split(/\s+/).length
        const minWords = task === 1 ? 100 : 200
        const ready = wordCount >= minWords
        return (
          <div style={{ flex: 1, fontSize: "13px", color: ready ? "#16a34a" : "#64748b", fontWeight: 500 }}>
            {ready
              ? `✅ Task ${task} ready — ${wordCount} words written`
              : `Task ${task} — ${wordCount} / ${minWords} min words`}
          </div>
        )
      })()}

      <button
        onClick={handleFinish}
        disabled={isSubmitting}
        style={{
          padding: "12px 28px", borderRadius: "12px", background: isSubmitting ? "#64748b" : "#0f172a", color: "#fff",
          border: "none", fontWeight: 800, fontSize: "14px", cursor: isSubmitting ? "not-allowed" : "pointer", transition: "all 0.2s"
        }}
      >
        {isWriting
          ? (language === "vi" ? `NỘP BÀI TASK ${taskNumber ?? 1}` : `SUBMIT TASK ${taskNumber ?? 1}`)
          : (language === "vi" ? "NỘP BÀI THI" : "FINISH TEST")}
      </button>

      {/* Full screen glassmorphism loading overlay while scoring/submitting */}
      {isSubmitting && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(15, 23, 42, 0.75)",
          backdropFilter: "blur(8px)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "24px",
          color: "#ffffff",
          fontFamily: "'Inter', sans-serif"
        }}>
          <div style={{
            background: "rgba(255, 255, 255, 0.1)",
            padding: "40px",
            borderRadius: "24px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: "400px",
            textAlign: "center",
            border: "1px solid rgba(255, 255, 255, 0.15)"
          }}>
            <div className="submit-scoring-spinner" style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              border: "4px solid rgba(255, 255, 255, 0.1)",
              borderTop: "4px solid #3b82f6",
              animation: "spin 1s linear infinite",
              marginBottom: "24px"
            }} />
            <h3 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 10px 0", color: "#fff" }}>
              {language === "vi" ? "Đang chấm điểm..." : "Scoring your essay..."}
            </h3>
            <p style={{ fontSize: "14px", color: "#cbd5e1", margin: 0, lineHeight: 1.5 }}>
              {language === "vi"
                ? "Trí tuệ nhân tạo (AI) đang chấm điểm và phân tích bài viết của bạn. Quá trình này có thể mất tới 1 phút. Vui lòng không đóng trình duyệt."
                : "AI is currently scoring and analyzing your essay. This process might take up to 1 minute. Please do not close your browser."}
            </p>
          </div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
    </nav>
  )
}