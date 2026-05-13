import { usePracticeStore } from "@/services/practice/practice.store"

export default function QuestionNavigator({
  questionBlocks = [],
}: any) {
  const answers = usePracticeStore(state => state.answers)

  const parseRange = (range: string) => {
    if (!range) return []
    const parts = range.split("-").map(p => parseInt(p.trim()))
    if (parts.length === 1) return [parts[0]]
    if (parts.length === 2) {
      const result = []
      for (let i = parts[0]; i <= parts[1]; i++) {
        result.push(i)
      }
      return result
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

  function goToQuestion(id: string) {
    const el = document.getElementById(`question-${id}`)
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center"
      })
    }
  }

  return (
    <nav
      style={{
        borderTop: "1px solid #eee",
        padding: "12px 16px",
        display: "flex",
        gap: "8px",
        overflowX: "auto",
        alignItems: "center",
        backgroundColor: "#fff"
      }}
    >
      {flatQuestions.map((q: any) => {
        const answered = !!answers[q.id]
        return (
          <button
            key={q.id}
            onClick={() => goToQuestion(q.id)}
            style={{
              minWidth: 32,
              height: 32,
              padding: "0 6px",
              borderRadius: "4px",
              border: `1px solid ${answered ? "#2563eb" : "#e2e8f0"}`,
              cursor: "pointer",
              background: answered ? "#2563eb" : "#fff",
              color: answered ? "#fff" : "#64748b",
              fontSize: "12px",
              fontWeight: 700,
              transition: "all 0.2s"
            }}
          >
            {q.number}
          </button>
        )
      })}
    </nav>
  )
}