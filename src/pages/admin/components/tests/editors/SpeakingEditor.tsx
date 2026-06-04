import { useState } from "react"
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react"

interface SpeakingQuestion {
  id: string
  text: string
  hints: string[]
}

function newQuestion(prefix: string, idx: number): SpeakingQuestion {
  return { id: `${prefix}_q${idx + 1}`, text: "", hints: [] }
}

function HintsEditor({ hints, onChange }: { hints: string[]; onChange: (h: string[]) => void }) {
  const add = () => onChange([...hints, ""])
  const update = (i: number, v: string) => { const h = [...hints]; h[i] = v; onChange(h) }
  const remove = (i: number) => { const h = [...hints]; h.splice(i, 1); onChange(h) }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {hints.map((h, i) => (
        <div key={i} className="option-item">
          <input type="text" value={h} onChange={e => update(i, e.target.value)} placeholder={`Gợi ý ${i + 1}...`} />
          <button className="remove-opt-btn" onClick={() => remove(i)}><Trash2 size={12} /></button>
        </div>
      ))}
      <button className="add-row-btn" style={{ width: "auto", padding: "4px 10px", justifyContent: "flex-start" }} onClick={add}>
        <Plus size={12} /> Thêm gợi ý
      </button>
    </div>
  )
}

function QuestionItemEditor({ q, qIndex, prefix, onChange, onRemove }: any) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="qblock-card">
      <div className="qblock-header">
        <span style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>
          {qIndex + 1}. {q.text?.slice(0, 50) || "Câu hỏi chưa nhập"}{q.text?.length > 50 ? "..." : ""}
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          <button className="btn-ghost" style={{ padding: "3px 7px" }} onClick={() => setExpanded(v => !v)}>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button className="btn-danger" onClick={onRemove}><Trash2 size={13} /></button>
        </div>
      </div>
      {expanded && (
        <div className="qblock-body">
          <div className="form-group">
            <label className="form-label">Nội dung câu hỏi</label>
            <textarea className="form-textarea" rows={2} value={q.text}
              onChange={e => onChange({ ...q, text: e.target.value })}
              placeholder="Do you like to study in the morning or in the evening?" />
          </div>
          <div className="form-group">
            <label className="form-label">Gợi ý (Hints)</label>
            <HintsEditor hints={q.hints || []} onChange={hints => onChange({ ...q, hints })} />
          </div>
          <div style={{ fontSize: 10, color: "#94a3b8", fontFamily: "monospace" }}>ID: {q.id}</div>
        </div>
      )}
    </div>
  )
}

interface Props {
  value: any
  onChange: (updated: any) => void
}

export default function SpeakingEditor({ value, onChange }: Props) {
  // Speaking uses parts: [{part: 1, topics: [{topic, questions}]}, {part: 2, cue_card, followup_questions}, {part: 3, questions}]
  const parts: any[] = value?.parts || []

  const updateParts = (updated: any[]) => onChange({ ...value, parts: updated })

  // ── Part 1 helpers ──────────────────────────────────────
  const getPart = (partNum: number) => parts.find(p => p.part === partNum)
  const upsertPart = (partNum: number, updated: any) => {
    const existing = parts.find(p => p.part === partNum)
    if (existing) {
      updateParts(parts.map(p => p.part === partNum ? updated : p))
    } else {
      updateParts([...parts, updated])
    }
  }

  // Part 1
  const part1 = getPart(1) || { part: 1, topics: [] }

  const addPart1Topic = () => {
    const topics = [...(part1.topics || []), { topic: "", questions: [] }]
    upsertPart(1, { ...part1, topics })
  }
  const updatePart1Topic = (tIdx: number, updated: any) => {
    const topics = [...(part1.topics || [])]; topics[tIdx] = updated
    upsertPart(1, { ...part1, topics })
  }
  const removePart1Topic = (tIdx: number) => {
    const topics = [...(part1.topics || [])]; topics.splice(tIdx, 1)
    upsertPart(1, { ...part1, topics })
  }

  const addPart1Question = (tIdx: number) => {
    const t = { ...(part1.topics || [])[tIdx] }
    const qs = [...(t.questions || []), newQuestion(`p1t${tIdx}`, (t.questions || []).length)]
    updatePart1Topic(tIdx, { ...t, questions: qs })
  }
  const updatePart1Question = (tIdx: number, qIdx: number, updated: any) => {
    const t = { ...(part1.topics || [])[tIdx] }
    const qs = [...(t.questions || [])]; qs[qIdx] = updated
    updatePart1Topic(tIdx, { ...t, questions: qs })
  }
  const removePart1Question = (tIdx: number, qIdx: number) => {
    const t = { ...(part1.topics || [])[tIdx] }
    const qs = [...(t.questions || [])]; qs.splice(qIdx, 1)
    updatePart1Topic(tIdx, { ...t, questions: qs })
  }

  // Part 2
  const part2 = getPart(2) || { part: 2, cue_card: { id: "p2_cue", text: "", hints: [] }, followup_questions: [] }
  const addFollowup = () => {
    const fqs = [...(part2.followup_questions || []), newQuestion("p2_fq", (part2.followup_questions || []).length)]
    upsertPart(2, { ...part2, followup_questions: fqs })
  }
  const updateFollowup = (i: number, updated: any) => {
    const fqs = [...(part2.followup_questions || [])]; fqs[i] = updated
    upsertPart(2, { ...part2, followup_questions: fqs })
  }
  const removeFollowup = (i: number) => {
    const fqs = [...(part2.followup_questions || [])]; fqs.splice(i, 1)
    upsertPart(2, { ...part2, followup_questions: fqs })
  }

  // Part 3
  const part3 = getPart(3) || { part: 3, questions: [] }
  const addPart3Q = () => {
    const qs = [...(part3.questions || []), newQuestion("p3", (part3.questions || []).length)]
    upsertPart(3, { ...part3, questions: qs })
  }
  const updatePart3Q = (i: number, updated: any) => {
    const qs = [...(part3.questions || [])]; qs[i] = updated
    upsertPart(3, { ...part3, questions: qs })
  }
  const removePart3Q = (i: number) => {
    const qs = [...(part3.questions || [])]; qs.splice(i, 1)
    upsertPart(3, { ...part3, questions: qs })
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="info-alert">
        🎤 Speaking được chia thành 3 phần. Part 1 hỏi về chủ đề quen thuộc, Part 2 là cue card, Part 3 là thảo luận sâu hơn.
      </div>

      {/* ── Part 1 ── */}
      <div className="section-card">
        <div className="section-card-header" style={{ cursor: "default" }}>
          <div className="section-card-header-left">
            <span className="section-number-badge">Part 1</span>
            <span className="section-card-title">Câu hỏi chủ đề quen thuộc (Topics & Questions)</span>
          </div>
        </div>
        <div className="section-card-body">
          {(part1.topics || []).map((topic: any, tIdx: number) => (
            <div key={tIdx} className="qblock-card">
              <div className="qblock-header">
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="qblock-type-badge">Chủ đề {tIdx + 1}</span>
                  <span style={{ fontSize: 12, color: "#64748b" }}>{topic.topic || "Chưa có tiêu đề"}</span>
                </div>
                <button className="btn-danger" onClick={() => removePart1Topic(tIdx)}><Trash2 size={12} /></button>
              </div>
              <div className="qblock-body">
                <div className="form-group">
                  <label className="form-label">Tiêu đề chủ đề</label>
                  <input className="form-input" value={topic.topic || ""}
                    onChange={e => updatePart1Topic(tIdx, { ...topic, topic: e.target.value })}
                    placeholder="Work / Study / Family / Free Time..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Câu hỏi ({(topic.questions || []).length})</label>
                  {(topic.questions || []).map((q: any, qIdx: number) => (
                    <QuestionItemEditor key={qIdx} q={q} qIndex={qIdx} prefix={`p1t${tIdx}`}
                      onChange={(upd: any) => updatePart1Question(tIdx, qIdx, upd)}
                      onRemove={() => removePart1Question(tIdx, qIdx)} />
                  ))}
                  <button className="add-row-btn" onClick={() => addPart1Question(tIdx)}>
                    <Plus size={12} /> Thêm câu hỏi
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button className="add-row-btn" onClick={addPart1Topic}>
            <Plus size={14} /> Thêm chủ đề Part 1
          </button>
        </div>
      </div>

      {/* ── Part 2 ── */}
      <div className="section-card">
        <div className="section-card-header" style={{ cursor: "default" }}>
          <div className="section-card-header-left">
            <span className="section-number-badge">Part 2</span>
            <span className="section-card-title">Cue Card & Follow-up Questions</span>
          </div>
        </div>
        <div className="section-card-body">
          <div className="form-group">
            <label className="form-label">Cue Card — Nội dung đề bài</label>
            <textarea className="form-textarea" rows={3}
              value={part2.cue_card?.text || ""}
              onChange={e => upsertPart(2, { ...part2, cue_card: { ...part2.cue_card, text: e.target.value } })}
              placeholder="Describe a book you read recently that you found useful." />
          </div>
          <div className="form-group">
            <label className="form-label">Cue Card — Gợi ý (Hints)</label>
            <HintsEditor
              hints={part2.cue_card?.hints || []}
              onChange={hints => upsertPart(2, { ...part2, cue_card: { ...part2.cue_card, hints } })} />
          </div>
          <hr className="section-divider" />
          <div className="form-group">
            <label className="form-label">Follow-up Questions ({(part2.followup_questions || []).length})</label>
            {(part2.followup_questions || []).map((q: any, i: number) => (
              <QuestionItemEditor key={i} q={q} qIndex={i} prefix="p2_fq"
                onChange={(upd: any) => updateFollowup(i, upd)}
                onRemove={() => removeFollowup(i)} />
            ))}
            <button className="add-row-btn" onClick={addFollowup}>
              <Plus size={12} /> Thêm Follow-up Question
            </button>
          </div>
        </div>
      </div>

      {/* ── Part 3 ── */}
      <div className="section-card">
        <div className="section-card-header" style={{ cursor: "default" }}>
          <div className="section-card-header-left">
            <span className="section-number-badge">Part 3</span>
            <span className="section-card-title">Câu hỏi thảo luận chuyên sâu</span>
          </div>
        </div>
        <div className="section-card-body">
          {(part3.questions || []).map((q: any, i: number) => (
            <QuestionItemEditor key={i} q={q} qIndex={i} prefix="p3"
              onChange={(upd: any) => updatePart3Q(i, upd)}
              onRemove={() => removePart3Q(i)} />
          ))}
          <button className="add-row-btn" onClick={addPart3Q}>
            <Plus size={14} /> Thêm câu hỏi Part 3
          </button>
        </div>
      </div>
    </div>
  )
}
