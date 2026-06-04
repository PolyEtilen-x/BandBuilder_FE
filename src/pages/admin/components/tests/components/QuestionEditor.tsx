import { Trash2, Plus, X } from "lucide-react"

// ─── All supported question types ───────────────────────────────────────────
export const QUESTION_TYPES = [
  { value: "multiple_choice",       label: "Multiple Choice (MCQ)" },
  { value: "form_completion",       label: "Form Completion (điền vào mẫu)" },
  { value: "note_completion",       label: "Note Completion (điền ghi chú)" },
  { value: "table_completion",      label: "Table Completion (điền bảng)" },
  { value: "summary_completion",    label: "Summary Completion (hoàn thành tóm tắt)" },
  { value: "matching_features",     label: "Matching Features (nối đặc điểm)" },
  { value: "matching_cause_effect", label: "Matching Cause & Effect (nối nguyên nhân-kết quả)" },
  { value: "yes_no_not_given",      label: "Yes / No / Not Given" },
  { value: "true_false_not_given",  label: "True / False / Not Given" },
  { value: "selecting_factors",     label: "Selecting Factors (chọn nhiều yếu tố)" },
  { value: "matching",              label: "Matching (nối chung)" },
]

// Answer types per question type
function getAnswerType(qType: string) {
  if (["form_completion", "note_completion", "table_completion", "summary_completion", "matching"].includes(qType)) return "text"
  if (["yes_no_not_given"].includes(qType)) return "ynng"
  if (["true_false_not_given"].includes(qType)) return "tfng"
  if (["multiple_choice", "matching_features", "matching_cause_effect"].includes(qType)) return "option_select"
  if (["selecting_factors"].includes(qType)) return "multi_option_select"
  return "text"
}

// ─── Props ───────────────────────────────────────────────────────────────────
interface Props {
  question: any
  qIndex: number
  questionType: string
  blockOptions?: string[]     // global options from the block (matching, matching_cause_effect)
  onChange: (updated: any) => void
  onRemove: () => void
}

export default function QuestionEditor({ question, qIndex, questionType, blockOptions, onChange, onRemove }: Props) {
  const answerType = getAnswerType(questionType)
  const hasOwnOptions = ["multiple_choice", "matching_features"].includes(questionType)

  const update = (field: string, value: any) => onChange({ ...question, [field]: value })

  const addOption = () => update("options", [...(question.options || []), ""])
  const updateOption = (i: number, val: string) => {
    const opts = [...(question.options || [])]
    opts[i] = val
    update("options", opts)
  }
  const removeOption = (i: number) => {
    const opts = [...(question.options || [])]
    opts.splice(i, 1)
    update("options", opts)
  }

  const toggleSelectingFactor = (opt: string) => {
    const current: string[] = Array.isArray(question.answer) ? question.answer : []
    const next = current.includes(opt) ? current.filter(x => x !== opt) : [...current, opt]
    update("answer", next)
  }

  const opts = blockOptions || question.options || []

  return (
    <div className="question-row">
      <div className="question-number-badge">{qIndex + 1}</div>

      <div className="question-fields">
        {/* Question Text / Cause */}
        <div className="form-group">
          <label className="form-label">{questionType === "matching_cause_effect" ? "Nguyên nhân (Cause)" : "Nội dung câu hỏi"}</label>
          <input
            className="form-input"
            value={question.text || question.cause || ""}
            onChange={e => update(questionType === "matching_cause_effect" ? "cause" : "text", e.target.value)}
            placeholder={questionType === "matching_cause_effect" ? "Nhập nguyên nhân..." : "Nhập nội dung câu hỏi..."}
          />
        </div>

        {/* MCQ / Matching Features own options */}
        {hasOwnOptions && (
          <div className="form-group">
            <label className="form-label">Các lựa chọn (Options)</label>
            <div className="option-list">
              {(question.options || []).map((opt: string, i: number) => (
                <div key={i} className="option-item">
                  <input
                    type="text"
                    value={opt}
                    onChange={e => updateOption(i, e.target.value)}
                    placeholder={`Lựa chọn ${String.fromCharCode(65 + i)}`}
                  />
                  <button className="remove-opt-btn" onClick={() => removeOption(i)} title="Xóa lựa chọn">
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button className="add-row-btn" onClick={addOption} style={{ marginTop: 4, justifyContent: "flex-start", width: "auto", padding: "4px 10px" }}>
                <Plus size={12} /> Thêm lựa chọn
              </button>
            </div>
          </div>
        )}

        {/* Answer field */}
        <div className="form-group">
          <label className="form-label">Đáp án đúng</label>

          {answerType === "text" && (
            <input
              className="form-input"
              value={question.answer || ""}
              onChange={e => update("answer", e.target.value)}
              placeholder="Nhập đáp án..."
            />
          )}

          {answerType === "ynng" && (
            <select className="form-select" value={question.answer || ""} onChange={e => update("answer", e.target.value)}>
              <option value="">-- Chọn đáp án --</option>
              <option value="YES">YES</option>
              <option value="NO">NO</option>
              <option value="NOT GIVEN">NOT GIVEN</option>
            </select>
          )}

          {answerType === "tfng" && (
            <select className="form-select" value={question.answer || ""} onChange={e => update("answer", e.target.value)}>
              <option value="">-- Chọn đáp án --</option>
              <option value="TRUE">TRUE</option>
              <option value="FALSE">FALSE</option>
              <option value="NOT GIVEN">NOT GIVEN</option>
            </select>
          )}

          {answerType === "option_select" && (
            <select className="form-select" value={question.answer || ""} onChange={e => update("answer", e.target.value)}>
              <option value="">-- Chọn đáp án đúng --</option>
              {opts.map((o: string, i: number) => (
                <option key={i} value={o}>{o}</option>
              ))}
            </select>
          )}

          {answerType === "multi_option_select" && (
            <div className="option-list">
              {opts.map((o: string, i: number) => {
                const checked = Array.isArray(question.answer) && question.answer.includes(o)
                return (
                  <label key={i} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13 }}>
                    <input type="checkbox" checked={checked} onChange={() => toggleSelectingFactor(o)} />
                    <span>{o}</span>
                  </label>
                )
              })}
              {opts.length === 0 && (
                <span style={{ color: "#94a3b8", fontSize: 12 }}>Nhập danh sách Options ở cấp block trước</span>
              )}
            </div>
          )}
        </div>

        {/* ID (readonly display) */}
        <div style={{ fontSize: 10, color: "#94a3b8", fontFamily: "monospace" }}>
          ID: {question.id || `q${qIndex + 1}`}
        </div>
      </div>

      {/* Remove button */}
      <button className="btn-danger" onClick={onRemove} title="Xóa câu hỏi" style={{ flexShrink: 0, alignSelf: "flex-start", marginTop: 2 }}>
        <Trash2 size={13} />
      </button>
    </div>
  )
}
