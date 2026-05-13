export default function MatchingCauseEffectQuestion({
  question,
  effects,
  value,
  onChange
}: any) {

  return (
    <div
      id={`question-${question.id}`}
      style={{
        marginBottom: 20,
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        background: "#fdfdfd",
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #f1f5f9"
      }}
    >
      <div style={{ flex: 1 }}>
        <span style={{ fontWeight: 700, color: "#2563eb", marginRight: 8 }}>
          {question.number || question.question_number}.
        </span>
        <span style={{ color: "#334155", lineHeight: 1.5 }}>
          {question.cause || question.text || "Choose the correct effect"}
        </span>
      </div>

      <select
        value={value || ""}
        onChange={(e) => onChange(question.id, e.target.value)}
        style={{
          padding: "8px 12px",
          borderRadius: "6px",
          border: "1px solid #cbd5e1",
          background: "#fff",
          outline: "none",
          fontSize: "14px",
          minWidth: "160px",
          maxWidth: "240px",
          cursor: "pointer",
          color: "#1e293b"
        }}
      >
        <option value="">Select effect...</option>
        {effects.map((e: string) => (
          <option key={e} value={e}>{e}</option>
        ))}
      </select>

    </div>
  )
}
