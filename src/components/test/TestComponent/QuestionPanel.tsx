import { QuestionBlock } from "@/types/practice.types"
import QuestionRenderer from "./QuestionRenderer"
import { usePracticeStore } from "@/services/practice/practice.store"

interface QuestionPanelProps {
  questionBlocks: QuestionBlock[]
  mode?: "exam" | "practice"
  isReview?: boolean
}

export default function QuestionPanel({
  questionBlocks = [],
  isReview = false
}: QuestionPanelProps) {
  const answers = usePracticeStore(state => state.answers)
  const updateAnswer = usePracticeStore(state => state.setAnswer)

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

  if (!questionBlocks.length) {
    return <p>No questions</p>
  }

  return (
    <aside
      style={{
        padding: "24px",
        overflowY: "auto",
        color: "#000",
        fontSize: "15px",
        lineHeight: 1.6
      }}
    >
      {questionBlocks.map((block: any, index: number) => {
        const questionsFromRange = !block.questions || block.questions.length === 0
          ? parseRange(block.questions_range).map(num => ({
            id: `${block.id || index}_${num}`, // Tạo ID tạm thời nếu không có
            number: num,
            text: "", // Thường là matching hoặc fill blank sẽ có text ở instruction
          }))
          : []

        const displayQuestions = block.questions?.length > 0 ? block.questions : questionsFromRange

        return (
          <div key={index} style={{ marginBottom: 32 }}>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 600,
                marginBottom: "16px",
                paddingBottom: "8px",
                borderBottom: "1px solid #f1f5f9",
                color: "#334155"
              }}
            >
              {block.instruction}
            </h3>

            {displayQuestions.map((q: any) => (
              <div id={`question-${q.id || q.number}`} key={q.id || q.number}>
                <QuestionRenderer
                  question={q}
                  type={block.question_type}
                  value={answers[q.id || q.number]}
                  onChange={updateAnswer}
                  extra={block}
                  isReview={isReview}
                />
              </div>
            ))}
          </div>
        )
      })}
    </aside>
  )
}