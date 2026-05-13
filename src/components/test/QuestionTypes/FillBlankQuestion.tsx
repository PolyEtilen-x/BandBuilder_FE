type Props = {
  question: any
  value: string
  onChange: (id: string, value: string) => void
  extra?: any
}

export default function FillBlankQuestion({
  question,
  value,
  onChange,
  extra
}: Props) {

  // Regex to find blanks  (ex: ___, _____, ...)
  const placeholderRegex = /_{3,}/;
  const parts = question.text?.split(placeholderRegex) || [question.text || "", ""];

  const wordBank = extra?.word_bank || [];

  return (
    <div
      id={`question-${question.id}`}
      style={{
        marginBottom: 32,
        lineHeight: 1.8,
        color: "#1f2937",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", gap: "4px 8px" }}>
        <span style={{ fontWeight: 700, color: "#2563eb", marginRight: 4 }}>
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
                  border: "none",
                  borderBottom: "2px solid #3b82f6",
                  outline: "none",
                  width: 140,
                  padding: "0 8px",
                  fontSize: "15px",
                  fontWeight: 600,
                  textAlign: "center",
                  background: "#f8fafc",
                  borderRadius: "4px 4px 0 0",
                  transition: "border-color 0.2s"
                }}
                placeholder="..."
              />
            )}
          </span>
        ))}
      </div>

      {wordBank.length > 0 && (
        <div style={{
          marginTop: 16,
          padding: "12px",
          background: "#f1f5f9",
          borderRadius: "8px",
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          border: "1px dashed #cbd5e1"
        }}>
          <span style={{ width: "100%", fontSize: "12px", color: "#64748b", fontWeight: 600, marginBottom: 4 }}>
            WORD BANK:
          </span>
          {wordBank.map((word: string) => (
            <span
              key={word}
              style={{
                background: "#fff",
                padding: "2px 10px",
                borderRadius: "4px",
                fontSize: "13px",
                border: "1px solid #e2e8f0",
                color: "#334155",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
              }}
            >
              {word}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}