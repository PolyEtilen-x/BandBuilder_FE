import { useState } from "react"
import { Plus, Trash2, ChevronDown, ChevronUp, BarChart2 } from "lucide-react"
import QuestionBlockEditor from "../components/QuestionBlockEditor"

function newPassage(index: number) {
  return {
    passage_number: index + 1,
    title: "",
    topic: "",
    content: "",
    time_suggested_minutes: 20,
    question_blocks: [],
  }
}

interface Props {
  value: any
  onChange: (updated: any) => void
}

export default function ReadingEditor({ value, onChange }: Props) {
  const [collapsedPassages, setCollapsedPassages] = useState<Record<number, boolean>>({})

  const passages: any[] = value?.passages || []

  const countQuestions = (psgs: any[]) =>
    psgs.reduce((t, p) => t + p.question_blocks.reduce((bt: number, b: any) => bt + (b.questions?.length || 0), 0), 0)

  const updatePassages = (updated: any[]) => {
    onChange({ ...value, passages: updated, total_questions: countQuestions(updated) })
  }

  const addPassage = () => updatePassages([...passages, newPassage(passages.length)])

  const removePassage = (i: number) => {
    const updated = passages.filter((_, idx) => idx !== i).map((p, idx) => ({ ...p, passage_number: idx + 1 }))
    updatePassages(updated)
  }

  const updatePassage = (i: number, updated: any) => {
    const ps = [...passages]; ps[i] = updated; updatePassages(ps)
  }

  const toggleCollapse = (i: number) => setCollapsedPassages(prev => ({ ...prev, [i]: !prev[i] }))

  const addBlock = (pIdx: number) => {
    const p = { ...passages[pIdx] }
    p.question_blocks = [...(p.question_blocks || []), { question_type: "", questions_range: "", instruction: "", questions: [] }]
    updatePassage(pIdx, p)
  }

  const updateBlock = (pIdx: number, bIdx: number, updated: any) => {
    const p = { ...passages[pIdx] }
    const blocks = [...(p.question_blocks || [])]; blocks[bIdx] = updated
    p.question_blocks = blocks
    updatePassage(pIdx, p)
  }

  const removeBlock = (pIdx: number, bIdx: number) => {
    const p = { ...passages[pIdx] }
    const blocks = [...(p.question_blocks || [])]; blocks.splice(bIdx, 1)
    p.question_blocks = blocks
    updatePassage(pIdx, p)
  }

  const totalQ = countQuestions(passages)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Summary */}
      <div className="info-alert" style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <BarChart2 size={15} style={{ flexShrink: 0 }} />
        <span>
          Tổng: <strong>{passages.length} Passages</strong> — <strong>{totalQ} câu hỏi</strong>
        </span>
      </div>

      {passages.map((passage, pIdx) => (
        <div key={pIdx} className="section-card">
          {/* Passage header */}
          <div className="section-card-header" onClick={() => toggleCollapse(pIdx)}>
            <div className="section-card-header-left">
              <span className="section-number-badge">Passage {passage.passage_number}</span>
              <span className="section-card-title">{passage.title || "Chưa có tiêu đề"}</span>
            </div>
            <div style={{ display: "flex", gap: 8 }} onClick={e => e.stopPropagation()}>
              <span style={{ fontSize: 12, color: "#64748b", alignSelf: "center" }}>
                {passage.question_blocks?.length || 0} blocks
              </span>
              <button className="btn-danger" onClick={() => removePassage(pIdx)} title="Xóa passage">
                <Trash2 size={13} />
              </button>
              <button className="btn-ghost" onClick={() => toggleCollapse(pIdx)} style={{ padding: "4px 8px" }}>
                {collapsedPassages[pIdx] ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              </button>
            </div>
          </div>

          {!collapsedPassages[pIdx] && (
            <div className="section-card-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Tiêu đề bài đọc (Title)</label>
                  <input
                    className="form-input"
                    value={passage.title || ""}
                    onChange={e => updatePassage(pIdx, { ...passage, title: e.target.value })}
                    placeholder="Architecture — Reaching for the Sky"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Thời gian gợi ý (phút)</label>
                  <input
                    className="form-input"
                    type="number"
                    min={5}
                    max={60}
                    value={passage.time_suggested_minutes || 20}
                    onChange={e => updatePassage(pIdx, { ...passage, time_suggested_minutes: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Chủ đề (Topic)</label>
                <input
                  className="form-input"
                  value={passage.topic || ""}
                  onChange={e => updatePassage(pIdx, { ...passage, topic: e.target.value })}
                  placeholder="Architecture / History"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Nội dung bài đọc (Reading Passage Text)
                  <span style={{ fontWeight: 400, color: "#94a3b8", marginLeft: 6 }}>— ngăn cách đoạn bằng Enter trống</span>
                </label>
                <textarea
                  className="form-textarea"
                  rows={8}
                  value={passage.content || ""}
                  onChange={e => updatePassage(pIdx, { ...passage, content: e.target.value })}
                  placeholder="Dán nội dung đoạn văn vào đây..."
                  style={{ minHeight: 160 }}
                />
              </div>

              <hr className="section-divider" />

              {/* Question blocks */}
              <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
                Question Blocks ({passage.question_blocks?.length || 0})
              </div>

              {(passage.question_blocks || []).map((block: any, bIdx: number) => (
                <QuestionBlockEditor
                  key={bIdx}
                  block={block}
                  blockIndex={bIdx}
                  skillType="reading"
                  onChange={updated => updateBlock(pIdx, bIdx, updated)}
                  onRemove={() => removeBlock(pIdx, bIdx)}
                />
              ))}

              <button className="add-row-btn" onClick={() => addBlock(pIdx)}>
                <Plus size={14} /> Thêm Question Block
              </button>
            </div>
          )}
        </div>
      ))}

      <button className="add-row-btn" onClick={addPassage}>
        <Plus size={16} /> Thêm Passage mới
      </button>
    </div>
  )
}
