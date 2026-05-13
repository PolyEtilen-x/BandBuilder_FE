export default function TableCompletionQuestion({
  question,
  value,
  onChange,
  isReview = false
}: any) {

  const correctAnswer = question.correct_answer?.toString().trim().toLowerCase()
  const isCorrect = value?.toString().trim().toLowerCase() === correctAnswer

  return (
    <div 
      id={`question-${question.id}`} 
      style={{ marginBottom: 16, display: "flex", flexDirection: "column", gap: 4 }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontWeight: 700, color: "#174593", minWidth: "24px" }}>
          {question.number || question.question_number}.
        </span>

        <input
          type="text"
          value={value || ""}
          disabled={isReview}
          onChange={(e) => onChange(question.id, e.target.value)}
          style={{
            border: "1px solid #e2e8f0",
            borderBottom: `2px solid ${isReview ? (isCorrect ? "#22c55e" : "#ef4444") : "#174593"}`,
            outline: "none",
            padding: "6px 12px",
            borderRadius: "4px",
            fontSize: "14px",
            width: "100%",
            background: isReview ? (isCorrect ? "#f0fdf4" : "#fef2f2") : "#fff",
            transition: "all 0.2s",
            color: isReview ? (isCorrect ? "#166534" : "#991b1b") : "#1e293b",
            fontWeight: isReview ? 700 : 400
          }}
          placeholder="..."
        />
      </div>

      {isReview && !isCorrect && (
        <div style={{ paddingLeft: 36, fontSize: "12px", color: "#166534", fontWeight: 800 }}>
          Đáp án: {question.correct_answer}
        </div>
      )}

      {isReview && question.explanation && (
        <div style={{ 
          marginTop: 16, padding: "12px 16px", background: "#f8fafc", 
          borderLeft: "4px solid #174593", borderRadius: "8px", fontSize: "14px"
        }}>
          <strong style={{ color: "#174593", display: "block", marginBottom: 4 }}>EXPLANATION:</strong>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>{question.explanation}</p>
        </div>
      )}
    </div>
  )
}