type Props = {
  question: any
  value: string
  onChange: (id: string, value: string) => void
  extra?: any
  isReview?: boolean
}

export default function FillBlankQuestion({ question, value, onChange, extra, isReview = false }: Props) {
  const placeholderRegex = /_{3,}/;
  const parts = question.text?.split(placeholderRegex) || [question.text || "", ""];
  const wordBank = extra?.word_bank || [];
  const correctAnswer = question.correct_answer?.toString().trim().toLowerCase();
  const isCorrect = value?.toString().trim().toLowerCase() === correctAnswer;

  return (
    <div id={`question-${question.id}`} style={{ marginBottom: 35, color: "#1e293b" }}>
      <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", gap: "6px 10px", lineHeight: 2 }}>
        <span style={{ fontWeight: 800, color: "#174593", marginRight: 5 }}>
          {question.number || question.question_number}.
        </span>
        {parts.map((part: string, index: number) => (
          <span key={index}>
            {part}
            {index < parts.length - 1 && (
              <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
                <input
                    type="text"
                    value={value || ""}
                    disabled={isReview}
                    onChange={(e) => onChange(question.id, e.target.value)}
                    style={{
                        border: "none", 
                        borderBottom: `2px solid ${isReview ? (isCorrect ? "#22c55e" : "#ef4444") : "#174593"}`, 
                        outline: "none",
                        width: 150, padding: "2px 10px", fontSize: "16px", fontWeight: 700,
                        textAlign: "center", 
                        background: isReview ? (isCorrect ? "#f0fdf4" : "#fef2f2") : "#f8fafc", 
                        borderRadius: "6px 6px 0 0",
                        transition: "all 0.2s",
                        color: isReview ? (isCorrect ? "#166534" : "#991b1b") : "#1e293b"
                    }}
                    placeholder="..."
                />
                {isReview && !isCorrect && (
                    <span style={{ fontSize: "12px", color: "#166534", fontWeight: 800, marginTop: 2 }}>
                        {question.correct_answer}
                    </span>
                )}
              </div>
            )}
          </span>
        ))}
      </div>

      {wordBank.length > 0 && !isReview && (
        <div style={{ 
          marginTop: 20, padding: "20px", background: "#f8fafc", borderRadius: "16px",
          display: "flex", flexWrap: "wrap", gap: "10px", border: "1.5px dashed #174593"
        }}>
          <div style={{ width: "100%", fontSize: "11px", color: "#174593", fontWeight: 800, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Click a word below to fill in the blank:
          </div>
          {wordBank.map((word: string) => {
            const isSelected = value === word;
            return (
              <button 
                key={word} 
                onClick={() => onChange(question.id, word)}
                style={{ 
                  background: isSelected ? "#174593" : "#fff", padding: "8px 16px", 
                  borderRadius: "10px", fontSize: "14px", fontWeight: 600,
                  border: `1px solid ${isSelected ? "#174593" : "#e2e8f0"}`,
                  color: isSelected ? "#fff" : "#334155", cursor: "pointer",
                  transition: "all 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                }}
              >
                {word}
              </button>
            );
          })}
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