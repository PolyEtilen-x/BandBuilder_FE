export default function MatchingFeaturesQuestion({
  question,
  options,
  value,
  onChange,
  isReview = false
}: any) {

  const correctAnswer = question.correct_answer?.toString()
  const isCorrect = value?.toString() === correctAnswer

  return (
    <div
      id={`question-${question.id}`}
      style={{ marginBottom: 20 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: isReview ? (isCorrect ? "#f0fdf4" : "#fef2f2") : "#fdfdfd",
          padding: "10px 16px",
          borderRadius: "8px",
          border: `1px solid ${isReview ? (isCorrect ? "#22c55e" : "#ef4444") : "#f1f5f9"}`
        }}
      >
        <div style={{ flex: 1 }}>
          <span style={{ fontWeight: 700, color: "#174593", marginRight: 8 }}>
            {question.number || question.question_number}.
          </span>
          <span style={{ color: "#1e293b", fontWeight: 500 }}>{question.text || "Choose the correct answer"}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
          <select
            value={value || ""}
            disabled={isReview}
            onChange={(e) => onChange(question.id, e.target.value)}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: `1px solid ${isReview ? (isCorrect ? "#22c55e" : "#ef4444") : "#cbd5e1"}`,
              background: "#fff",
              outline: "none",
              fontSize: "14px",
              minWidth: "120px",
              cursor: isReview ? "default" : "pointer",
              color: isReview ? (isCorrect ? "#166534" : "#991b1b") : "#1e293b",
              fontWeight: isReview ? 700 : 400
            }}
          >
            <option value="">Select...</option>
            {options.map((op: string) => (
              <option key={op} value={op}>{op}</option>
            ))}
          </select>
          
          {isReview && !isCorrect && (
            <span style={{ fontSize: "12px", color: "#166534", fontWeight: 800 }}>
              Đáp án: {correctAnswer}
            </span>
          )}
        </div>
      </div>

      {isReview && question.explanation && (
        <div style={{ 
          marginTop: 10, padding: "10px 16px", background: "#f8fafc", 
          borderLeft: "4px solid #174593", borderRadius: "8px", fontSize: "14px"
        }}>
          <strong style={{ color: "#174593", display: "block", marginBottom: 2 }}>GIẢI THÍCH:</strong>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.5 }}>{question.explanation}</p>
        </div>
      )}
    </div>
  )
}
