export default function MatchingFeaturesQuestion({
  question,
  options,
  value,
  onChange
}: any) {

  return (
    <div
      id={`question-${question.id}`}
      style={{
        marginBottom: 20,
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: "#fdfdfd",
        padding: "8px 12px",
        borderRadius: "8px",
        border: "1px solid #f1f5f9"
      }}
    >
      <div style={{ flex: 1 }}>
        <span style={{ fontWeight: 700, color: "#2563eb", marginRight: 8 }}>
          {question.number || question.question_number}.
        </span>
        <span style={{ color: "#334155" }}>{question.text || "Choose the correct answer"}</span>
      </div>

      <select
        value={value || ""}
        onChange={(e) => onChange(question.id, e.target.value)}
        style={{
          padding: "6px 12px",
          borderRadius: "6px",
          border: "1px solid #cbd5e1",
          background: "#fff",
          outline: "none",
          fontSize: "14px",
          minWidth: "120px",
          cursor: "pointer"
        }}
      >
        <option value="">Select...</option>
        {options.map((op: string) => (
          <option key={op} value={op}>{op}</option>
        ))}
      </select>
    </div>
  )
}
