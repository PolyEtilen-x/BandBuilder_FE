export default function SelectingFactorsQuestion({
  question,
  options,
  value = [],
  onChange
}: any) {

  function toggle(op: string) {
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
        <span style={{ fontWeight: 700, color: "#2563eb" }}>
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
          return (
            <label
              key={op}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 16px",
                borderRadius: "6px",
                border: `1px solid ${isSelected ? "#3b82f6" : "#e2e8f0"}`,
                background: isSelected ? "#eff6ff" : "#fff",
                cursor: "pointer",
                transition: "all 0.2s",
                maxWidth: "fit-content"
              }}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggle(op)}
                style={{ cursor: "pointer" }}
              />
              <span style={{
                fontSize: "14px",
                fontWeight: isSelected ? 600 : 400,
                color: isSelected ? "#1d4ed8" : "#475569"
              }}>
                {op}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  )
}
