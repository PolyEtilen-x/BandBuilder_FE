export default function MCQQuestion({
  question,
  value,
  onChange,
  extra
}: any) {
  // Determine if it is a multiple choice question (select one or multiple)
  // if extra.max_choices > 1 or type = selecting_factors, use checkbox, else radio
  const isMulti = extra?.max_choices > 1 || extra?.question_type === "selecting_factors";

  const handleToggle = (op: string) => {
    if (isMulti) {
      const currentValues = Array.isArray(value) ? value : (value ? [value] : []);
      if (currentValues.includes(op)) {
        onChange(question.id, currentValues.filter((v: string) => v !== op));
      } else {
        onChange(question.id, [...currentValues, op]);
      }
    } else {
      onChange(question.id, op);
    }
  };

  return (
    <div
      id={`question-${question.id}`}
      style={{ marginBottom: 30 }}
    >
      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <span style={{ fontWeight: 700, color: "#174593" }}>
          {question.number || question.question_number}.
        </span>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 500, margin: 0 }}>{question.text}</p>

          {/* image of question if have */}
          {question.imgUrl && (
            <img
              src={question.imgUrl}
              alt="Question"
              style={{ maxWidth: "100%", borderRadius: 8, marginTop: 10, display: "block" }}
            />
          )}
        </div>
      </div>

      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        {question.options.map((op: any) => {
          const isObject = typeof op === "object";
          const label = isObject ? op.label : op;
          const imgUrl = isObject ? op.imgUrl : null;
          const isSelected = isMulti
            ? (Array.isArray(value) && value.includes(label))
            : value === label;

          return (
            <label
              key={label}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                padding: "10px 14px",
                borderRadius: 8,
                border: `1px solid ${isSelected ? "#174593" : "#e5e7eb"}`,
                background: isSelected ? "#eff6ff" : "transparent",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              <input
                type={isMulti ? "checkbox" : "radio"}
                checked={isSelected}
                onChange={() => handleToggle(label)}
                style={{ marginTop: 4 }}
              />
              <div style={{ flex: 1 }}>
                <span>{label}</span>
                {imgUrl && (
                  <img
                    src={imgUrl}
                    alt={label}
                    style={{ maxWidth: "100%", borderRadius: 4, marginTop: 8, display: "block" }}
                  />
                )}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}