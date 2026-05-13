export default function TableCompletionQuestion({
  question,
  value,
  onChange
}: any) {

  return (
    <div 
      id={`question-${question.id}`} 
      style={{ 
        marginBottom: 16, 
        display: "flex", 
        alignItems: "center", 
        gap: 12 
      }}
    >
      <span style={{ fontWeight: 700, color: "#174593", minWidth: "24px" }}>
        {question.number || question.question_number}.
      </span>

      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(question.id, e.target.value)}
        style={{
          border: "1px solid #e2e8f0",
          borderBottom: "2px solid #174593",
          outline: "none",
          padding: "6px 12px",
          borderRadius: "4px",
          fontSize: "14px",
          width: "100%",
          background: "#fff",
          transition: "all 0.2s"
        }}
        placeholder="Enter answer..."
      />
    </div>
  )
}