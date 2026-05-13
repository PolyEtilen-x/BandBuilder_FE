import { usePracticeStore } from "@/services/practice/practice.store"
import { useNavigate } from "react-router-dom"

export default function QuestionNavigator({ questionBlocks = [] }: any) {
  const answers = usePracticeStore(state => state.answers)
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

  const handleFinish = () => {
    if (window.confirm("Bạn có chắc chắn muốn nộp bài?")) {
      alert("Nộp bài thành công!"); navigate("/profile")
    }
  }

  return (
    <nav style={{
      height: "100%", padding: "0 30px", display: "flex", justifyContent: "space-between",
      alignItems: "center", backgroundColor: "#fff", boxShadow: "0 -4px 12px rgba(0,0,0,0.05)"
    }}>
      <div style={{ display: "flex", gap: "12px", overflowX: "auto", padding: "10px 0", flex: 1, marginRight: "30px" }} className="no-scrollbar">
        {flatQuestions.map((q: any) => {
          const answered = !!answers[q.id]
          return (
            <button
              key={q.id} onClick={() => goToQuestion(q.id)}
              style={{
                minWidth: "40px", height: "40px", borderRadius: "10px", fontWeight: 800,
                border: `2px solid ${answered ? "#2563eb" : "#f1f5f9"}`,
                background: answered ? "#2563eb" : "#fff", color: answered ? "#fff" : "#94a3b8",
                cursor: "pointer", transition: "all 0.2s", fontSize: "14px"
              }}
            >
              {q.number}
            </button>
          )
        })}
      </div>

      <button
        onClick={handleFinish}
        style={{
          padding: "12px 28px", borderRadius: "12px", background: "#0f172a", color: "#fff",
          border: "none", fontWeight: 800, fontSize: "14px", cursor: "pointer", transition: "all 0.2s"
        }}
      >
        FINISH TEST
      </button>
    </nav>
  )
}