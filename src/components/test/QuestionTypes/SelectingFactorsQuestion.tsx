export default function SelectingFactorsQuestion({
  question,
  options,
  value = [],
  onChange,
  isReview = false
}: any) {

  const correctAnswers = Array.isArray(question.correct_answer) ? question.correct_answer : [question.correct_answer]

  function toggle(op: string) {
    if (isReview) return
    const currentValues = Array.isArray(value) ? value : [];
    if (currentValues.includes(op)) {
      onChange(question.id, currentValues.filter((v: string) => v !== op))
    } else {
      onChange(question.id, [...currentValues, op])
    }
  }

  return (
    <div
      id={`question-${question.id}`}
      style={{ marginBottom: 30 }}
    >
      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <span style={{ fontWeight: 700, color: "#174593" }}>
          {question.number || question.question_number}.
        </span>
        <p style={{ fontWeight: 500, margin: 0, color: "#1e293b" }}>{question.text || "Select the correct factors:"}</p>
      </div>

      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        paddingLeft: 24
      }}>
        {options.map((op: string) => {
          const isSelected = Array.isArray(value) && value.includes(op);
          const isCorrect = correctAnswers.includes(op)

          let borderColor = isSelected ? "#174593" : "#e2e8f0"
          let bgColor = isSelected ? "#eff6ff" : "#fff"

          if (isReview) {
            if (isCorrect) {
              borderColor = "#22c55e"
              bgColor = "#f0fdf4"
            } else if (isSelected && !isCorrect) {
              borderColor = "#ef4444"
              bgColor = "#fef2f2"
            }
          }

          return (
            <label
              key={op}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 16px",
                borderRadius: "6px",
                border: `2px solid ${borderColor}`,
                background: bgColor,
                cursor: isReview ? "default" : "pointer",
                transition: "all 0.2s",
                maxWidth: "fit-content"
              }}
            >
              <input
                type="checkbox"
                checked={isSelected}
                disabled={isReview}
                onChange={() => toggle(op)}
                style={{ cursor: isReview ? "default" : "pointer" }}
              />
              <span style={{
                fontSize: "14px",
                fontWeight: (isSelected || (isReview && isCorrect)) ? 600 : 400,
                color: isReview && isCorrect ? "#15803d" : (isSelected ? "#174593" : "#475569")
              }}>
                {op}
              </span>
            </label>
          );
        })}
      </div>

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
