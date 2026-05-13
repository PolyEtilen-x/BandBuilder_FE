export default function TrueFalseQuestion({
  question,
  value,
  onChange,
  type
}: any) {

  const isYesNo = type === "yes_no_not_given";
  const options = isYesNo
    ? ["Yes", "No", "Not Given"]
    : ["True", "False", "Not Given"];

  return (
    <div
      id={`question-${question.id}`}
      style={{ marginBottom: 30 }}
    >
      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <span style={{ fontWeight: 700, color: "#174593" }}>
          {question.number || question.question_number}.
        </span>
        <p style={{ fontWeight: 500, margin: 0, color: "#1e293b" }}>{question.text}</p>
      </div>

      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        paddingLeft: 24
      }}>
        {options.map(op => {
          const isSelected = value === op;
          return (
            <label
              key={op}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 16px",
                borderRadius: "6px",
                border: `1px solid ${isSelected ? "#174593" : "#e2e8f0"}`,
                background: isSelected ? "#eff6ff" : "#fff",
                cursor: "pointer",
                transition: "all 0.2s",
                maxWidth: "fit-content"
              }}
            >
              <input
                type="radio"
                checked={isSelected}
                onChange={() => onChange(question.id, op)}
                style={{ cursor: "pointer" }}
              />
              <span style={{
                fontSize: "14px",
                fontWeight: isSelected ? 600 : 400,
                color: isSelected ? "#174593" : "#475569"
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