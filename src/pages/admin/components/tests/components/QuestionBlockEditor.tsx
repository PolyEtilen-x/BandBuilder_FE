import { useState } from "react"
import { Plus, Trash2, ChevronDown, ChevronUp, X } from "lucide-react"
import QuestionEditor, { QUESTION_TYPES } from "./QuestionEditor"

interface Props {
  block: any
  blockIndex: number
  skillType: "listening" | "reading"
  onChange: (updated: any) => void
  onRemove: () => void
}

// Types that need a global options list on the block (shared across questions)
const BLOCK_LEVEL_OPTIONS_TYPES = [
  "matching_features",
  "matching_cause_effect",
  "selecting_factors",
  "summary_completion",
]

function generateQuestionId(prefix: string, blockIdx: number, qIdx: number) {
  const skillPfx = prefix.toUpperCase()
  return `${skillPfx}${blockIdx + 1}Q${qIdx + 1}`
}

export default function QuestionBlockEditor({ block, blockIndex, skillType, onChange, onRemove }: Props) {
  const [collapsed, setCollapsed] = useState(false)

  const update = (field: string, value: any) => onChange({ ...block, [field]: value })

  const addQuestion = () => {
    const questions = block.questions || []
    const newQ: any = {
      id: generateQuestionId(skillType === "listening" ? "L" : "R", blockIndex, questions.length),
      number: questions.length + 1,
      text: "",
      answer: "",
    }
    // For MCQ/matching: add default options array
    if (["multiple_choice", "matching_features"].includes(block.question_type)) {
      newQ.options = []
    }
    update("questions", [...questions, newQ])
  }

  const updateQuestion = (i: number, updated: any) => {
    const qs = [...(block.questions || [])]
    qs[i] = updated
    update("questions", qs)
  }

  const removeQuestion = (i: number) => {
    const qs = [...(block.questions || [])]
    qs.splice(i, 1)
    // Re-number
    const renumbered = qs.map((q: any, idx: number) => ({ ...q, number: idx + 1 }))
    update("questions", renumbered)
  }

  const needsBlockOptions = BLOCK_LEVEL_OPTIONS_TYPES.includes(block.question_type)
  const needsWordBank = block.question_type === "summary_completion"

  // Block-level options (effects for cause/effect, options list for selecting_factors / matching_features)
  const blockOptionsKey = block.question_type === "matching_cause_effect" ? "effects" : "options"
  const blockOpts: string[] = block[blockOptionsKey] || block.options || []
  const wordBank: string[] = block.word_bank || []

  const addBlockOption = () => onChange({ ...block, [blockOptionsKey]: [...blockOpts, ""] })
  const updateBlockOption = (i: number, val: string) => {
    const opts = [...blockOpts]; opts[i] = val
    onChange({ ...block, [blockOptionsKey]: opts })
  }
  const removeBlockOption = (i: number) => {
    const opts = [...blockOpts]; opts.splice(i, 1)
    onChange({ ...block, [blockOptionsKey]: opts })
  }

  const addWordBankItem = () => update("word_bank", [...wordBank, ""])
  const updateWordBankItem = (i: number, val: string) => {
    const wb = [...wordBank]; wb[i] = val; update("word_bank", wb)
  }
  const removeWordBankItem = (i: number) => {
    const wb = [...wordBank]; wb.splice(i, 1); update("word_bank", wb)
  }

  return (
    <div className="qblock-card">
      {/* Block header */}
      <div className="qblock-header">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="qblock-type-badge">{block.question_type || "Chưa chọn loại"}</span>
          <span style={{ fontSize: 12, color: "#64748b" }}>
            {(block.questions || []).length} câu hỏi
          </span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button className="btn-ghost" onClick={() => setCollapsed(v => !v)} style={{ padding: "4px 8px" }}>
            {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
          <button className="btn-danger" onClick={onRemove} title="Xóa block này">
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="qblock-body">
          {/* Question type selector */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Loại câu hỏi (Question Type)</label>
              <select
                className="form-select"
                value={block.question_type || ""}
                onChange={e => update("question_type", e.target.value)}
              >
                <option value="">-- Chọn loại câu hỏi --</option>
                {QUESTION_TYPES.map(qt => (
                  <option key={qt.value} value={qt.value}>{qt.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Questions Range (Ví dụ: 1-5)</label>
              <input
                className="form-input"
                value={block.questions_range || ""}
                onChange={e => update("questions_range", e.target.value)}
                placeholder="1-5"
              />
            </div>
          </div>

          {/* Instruction */}
          <div className="form-group">
            <label className="form-label">Hướng dẫn làm bài (Instruction)</label>
            <input
              className="form-input"
              value={block.instruction || ""}
              onChange={e => update("instruction", e.target.value)}
              placeholder="Circle the appropriate letter..."
            />
          </div>

          {/* Block-level options (for matching / selecting_factors / cause_effect) */}
          {needsBlockOptions && !needsWordBank && (
            <div className="form-group">
              <label className="form-label">
                {block.question_type === "matching_cause_effect" ? "Danh sách Kết quả (Effects)" :
                  block.question_type === "matching_features" ? "Danh sách đặc điểm (Features A, B, C...)" :
                  "Danh sách tùy chọn (Options)"}
              </label>
              <div className="option-list">
                {blockOpts.map((opt: string, i: number) => (
                  <div key={i} className="option-item">
                    <input
                      type="text"
                      value={opt}
                      onChange={e => updateBlockOption(i, e.target.value)}
                      placeholder={`${String.fromCharCode(65 + i)}: ...`}
                    />
                    <button className="remove-opt-btn" onClick={() => removeBlockOption(i)}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                <button className="add-row-btn" style={{ width: "auto", padding: "5px 12px", justifyContent: "flex-start" }} onClick={addBlockOption}>
                  <Plus size={12} /> Thêm lựa chọn
                </button>
              </div>
            </div>
          )}

          {/* Word bank for summary_completion */}
          {needsWordBank && (
            <div className="form-group">
              <label className="form-label">Word Bank (Ngân hàng từ)</label>
              <div className="option-list">
                {wordBank.map((w: string, i: number) => (
                  <div key={i} className="option-item">
                    <input type="text" value={w} onChange={e => updateWordBankItem(i, e.target.value)} placeholder="Từ..." />
                    <button className="remove-opt-btn" onClick={() => removeWordBankItem(i)}><X size={14} /></button>
                  </div>
                ))}
                <button className="add-row-btn" style={{ width: "auto", padding: "5px 12px", justifyContent: "flex-start" }} onClick={addWordBankItem}>
                  <Plus size={12} /> Thêm từ
                </button>
              </div>
            </div>
          )}

          {/* Questions list */}
          {block.question_type && (
            <div className="form-group">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label className="form-label">Danh sách Câu hỏi ({(block.questions || []).length} câu)</label>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(block.questions || []).map((q: any, i: number) => (
                  <QuestionEditor
                    key={i}
                    question={q}
                    qIndex={i}
                    questionType={block.question_type}
                    blockOptions={blockOpts.length > 0 ? blockOpts : undefined}
                    onChange={updated => updateQuestion(i, updated)}
                    onRemove={() => removeQuestion(i)}
                  />
                ))}

                <button className="add-row-btn" onClick={addQuestion}>
                  <Plus size={14} /> Thêm câu hỏi
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
