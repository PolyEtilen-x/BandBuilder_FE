import { CheckCircle2, XCircle } from "lucide-react"

export default function MCQQuestion({
  question,
  value,
  onChange,
  extra,
  isReview = false
}: any) {
  const isMulti = extra?.max_choices > 1 || extra?.question_type === "selecting_factors";
  const correctAnswer = question.correct_answer

  const handleToggle = (op: string) => {
    if (isReview) return
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

          const isCorrect = isMulti
            ? (Array.isArray(correctAnswer) && correctAnswer.includes(label))
            : correctAnswer === label;

          let borderColor = isSelected ? "#174593" : "#e5e7eb"
          let bgColor = isSelected ? "#eff6ff" : "transparent"

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
              key={label}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                padding: "10px 14px",
                borderRadius: 8,
                border: `2px solid ${borderColor}`,
                background: bgColor,
                cursor: isReview ? "default" : "pointer",
                transition: "all 0.2s"
              }}
            >
              <input
                type={isMulti ? "checkbox" : "radio"}
                checked={isSelected}
                disabled={isReview}
                onChange={() => handleToggle(label)}
                style={{ marginTop: 4 }}
              />
              <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <span style={{ 
                        fontWeight: (isSelected || (isReview && isCorrect)) ? 700 : 400,
                        color: isReview && isCorrect ? "#166534" : (isSelected ? "#174593" : "#1e293b")
                    }}>
                        {label}
                    </span>
                    {imgUrl && (
                    <img
                        src={imgUrl}
                        alt={label}
                        style={{ maxWidth: "100%", borderRadius: 4, marginTop: 8, display: "block" }}
                    />
                    )}
                </div>
                {isReview && isCorrect && <CheckCircle2 size={18} color="#22c55e" />}
                {isReview && isSelected && !isCorrect && <XCircle size={18} color="#ef4444" />}
              </div>
            </label>
          );
        })}
      </div>

      {isReview && question.explanation && (
        <div style={{ 
          marginTop: 16, padding: "12px 16px", background: "#f8fafc", 
          borderLeft: "4px solid #174593", borderRadius: "8px", fontSize: "14px"
        }}>
          <strong style={{ color: "#174593", display: "block", marginBottom: 4 }}>GIẢI THÍCH:</strong>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>{question.explanation}</p>
        </div>
      )}
    </div>
  );
}