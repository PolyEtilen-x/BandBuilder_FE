import { usePracticeStore } from "@/services/practice/practice.store"
import { useNavigate, useParams } from "react-router-dom"
import { practiceApi } from "@/api/practice/practice.api"

export default function QuestionNavigator({ questionBlocks = [], examId: propExamId, currentUnit, isWriting = false, taskNumber }: any) {
  const { id: urlId } = useParams()
  const examId = propExamId || urlId
  const { answers, startTime, sidebar, clearAnswers } = usePracticeStore()
  const navigate = useNavigate()

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
    if (!window.confirm("Are you sure you want to finish the test?")) return

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
          alert(`Your essay is too short (${wordCount} words). You need at least ${minWords} words for Task ${task}.`)
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
      alert("Failed to submit test results. Please try again.")
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
              : `✍️ Task ${task} — ${wordCount} / ${minWords} min words`}
          </div>
        )
      })()}

      <button
        onClick={handleFinish}
        style={{
          padding: "12px 28px", borderRadius: "12px", background: "#0f172a", color: "#fff",
          border: "none", fontWeight: 800, fontSize: "14px", cursor: "pointer", transition: "all 0.2s"
        }}
      >
        {isWriting ? `SUBMIT TASK ${taskNumber ?? 1}` : "FINISH TEST"}
      </button>
    </nav>
  )
}