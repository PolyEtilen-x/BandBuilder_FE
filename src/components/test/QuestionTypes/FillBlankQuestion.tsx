type Props = {
  question: any
  value: string
  onChange: (id: string, value: string) => void
  extra?: any
}

export default function FillBlankQuestion({ question, value, onChange, extra }: Props) {
  const placeholderRegex = /_{3,}/;
  const parts = question.text?.split(placeholderRegex) || [question.text || "", ""];
  const wordBank = extra?.word_bank || [];

  return (
    <div id={`question-${question.id}`} style={{ marginBottom: 35, color: "#1e293b" }}>
      <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", gap: "6px 10px", lineHeight: 2 }}>
        <span style={{ fontWeight: 800, color: "#2563eb", marginRight: 5 }}>
          {question.number || question.question_number}.
        </span>
        {parts.map((part: string, index: number) => (
          <span key={index}>
            {part}
            {index < parts.length - 1 && (
              <input
                type="text"
                value={value || ""}
                onChange={(e) => onChange(question.id, e.target.value)}
                style={{
                  border: "none", borderBottom: "2px solid #3b82f6", outline: "none",
                  width: 150, padding: "2px 10px", fontSize: "16px", fontWeight: 700,
                  textAlign: "center", background: "#f8fafc", borderRadius: "6px 6px 0 0",
                  transition: "all 0.2s"
                }}
                placeholder="..."
              />
            )}
          </span>
        ))}
      </div>

      {wordBank.length > 0 && (
        <div style={{ 
          marginTop: 20, padding: "20px", background: "#f8fafc", borderRadius: "16px",
          display: "flex", flexWrap: "wrap", gap: "10px", border: "1.5px dashed #3b82f6"
        }}>
          <div style={{ width: "100%", fontSize: "11px", color: "#3b82f6", fontWeight: 800, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Click a word below to fill in the blank:
          </div>
          {wordBank.map((word: string) => {
            const isSelected = value === word;
            return (
              <button 
                key={word} 
                onClick={() => onChange(question.id, word)}
                style={{ 
                  background: isSelected ? "#2563eb" : "#fff", padding: "8px 16px", 
                  borderRadius: "10px", fontSize: "14px", fontWeight: 600,
                  border: `1px solid ${isSelected ? "#2563eb" : "#e2e8f0"}`,
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
    </div>
  )
}