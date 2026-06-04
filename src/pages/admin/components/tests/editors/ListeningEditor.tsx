import { useState } from "react"
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import QuestionBlockEditor from "../components/QuestionBlockEditor"

const CONTEXT_OPTIONS = [
  { value: "social_conversation",  label: "Social Conversation (hội thoại xã hội)" },
  { value: "social_monologue",     label: "Social Monologue (độc thoại xã hội)" },
  { value: "academic_conversation",label: "Academic Conversation (hội thoại học thuật)" },
  { value: "academic_monologue",   label: "Academic Monologue (bài giảng học thuật)" },
]

function newSection(index: number) {
  return {
    section: index + 1,
    context: "social_conversation",
    description: "",
    speakers: [],
    question_blocks: [],
  }
}

interface Props {
  value: any
  onChange: (updated: any) => void
  audioUrl: string
  onAudioUrlChange: (url: string) => void
}

function SpeakersInput({ speakers, onChange }: { speakers: string[]; onChange: (s: string[]) => void }) {
  const [inputVal, setInputVal] = useState("")

  const add = () => {
    const v = inputVal.trim()
    if (v && !speakers.includes(v)) { onChange([...speakers, v]); setInputVal("") }
  }

  return (
    <div className="tags-wrap">
      {speakers.map((s, i) => (
        <span key={i} className="tag-chip">
          {s}
          <button onClick={() => onChange(speakers.filter((_, j) => j !== i))}>×</button>
        </span>
      ))}
      <input
        className="tags-input"
        value={inputVal}
        onChange={e => setInputVal(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add() } }}
        placeholder="Thêm người nói, Enter..."
      />
    </div>
  )
}

export default function ListeningEditor({ value, onChange, audioUrl, onAudioUrlChange }: Props) {
  const [collapsedSections, setCollapsedSections] = useState<Record<number, boolean>>({})

  const sections: any[] = value?.sections || []

  const updateSections = (updated: any[]) => {
    onChange({ ...value, sections: updated, total_questions: countQuestions(updated) })
  }

  const countQuestions = (secs: any[]) => {
    return secs.reduce((total, s) => {
      return total + s.question_blocks.reduce((bt: number, b: any) => bt + (b.questions?.length || 0), 0)
    }, 0)
  }

  const addSection = () => updateSections([...sections, newSection(sections.length)])

  const removeSection = (i: number) => {
    const updated = sections.filter((_, idx) => idx !== i).map((s, idx) => ({ ...s, section: idx + 1 }))
    updateSections(updated)
  }

  const updateSection = (i: number, updated: any) => {
    const secs = [...sections]; secs[i] = updated; updateSections(secs)
  }

  const toggleCollapse = (i: number) => setCollapsedSections(prev => ({ ...prev, [i]: !prev[i] }))

  const addBlock = (sIdx: number) => {
    const sec = { ...sections[sIdx] }
    sec.question_blocks = [...(sec.question_blocks || []), { question_type: "", questions_range: "", instruction: "", questions: [] }]
    updateSection(sIdx, sec)
  }

  const updateBlock = (sIdx: number, bIdx: number, updated: any) => {
    const sec = { ...sections[sIdx] }
    const blocks = [...(sec.question_blocks || [])]
    blocks[bIdx] = updated
    sec.question_blocks = blocks
    updateSection(sIdx, sec)
  }

  const removeBlock = (sIdx: number, bIdx: number) => {
    const sec = { ...sections[sIdx] }
    const blocks = [...(sec.question_blocks || [])]
    blocks.splice(bIdx, 1)
    sec.question_blocks = blocks
    updateSection(sIdx, sec)
  }

  const totalQ = countQuestions(sections)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Audio URL */}
      <div className="form-group">
        <label className="form-label">Audio URL <span style={{ color: "#94a3b8", fontWeight: 400 }}>(link file .mp3 hoặc .wav)</span></label>
        <input
          className="form-input"
          type="url"
          value={audioUrl}
          onChange={e => onAudioUrlChange(e.target.value)}
          placeholder="https://example.com/listening-audio.mp3"
        />
      </div>

      {/* Summary */}
      <div className="info-alert">
        📊 Tổng: <strong>{sections.length} Sections</strong> — <strong>{totalQ} câu hỏi</strong>
      </div>

      {/* Sections */}
      {sections.map((sec, sIdx) => (
        <div key={sIdx} className="section-card">
          {/* Section header */}
          <div className="section-card-header" onClick={() => toggleCollapse(sIdx)}>
            <div className="section-card-header-left">
              <span className="section-number-badge">Section {sec.section}</span>
              <span className="section-card-title">
                {CONTEXT_OPTIONS.find(c => c.value === sec.context)?.label || sec.context || "—"}
              </span>
            </div>
            <div style={{ display: "flex", gap: 8 }} onClick={e => e.stopPropagation()}>
              <span style={{ fontSize: 12, color: "#64748b", alignSelf: "center" }}>
                {sec.question_blocks?.length || 0} blocks
              </span>
              <button className="btn-danger" onClick={() => removeSection(sIdx)} title="Xóa section">
                <Trash2 size={13} />
              </button>
              <button className="btn-ghost" onClick={() => toggleCollapse(sIdx)} style={{ padding: "4px 8px" }}>
                {collapsedSections[sIdx] ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              </button>
            </div>
          </div>

          {!collapsedSections[sIdx] && (
            <div className="section-card-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Loại hội thoại (Context)</label>
                  <select className="form-select" value={sec.context || ""} onChange={e => updateSection(sIdx, { ...sec, context: e.target.value })}>
                    {CONTEXT_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Mô tả tình huống (Description)</label>
                <input
                  className="form-input"
                  value={sec.description || ""}
                  onChange={e => updateSection(sIdx, { ...sec, description: e.target.value })}
                  placeholder="Ví dụ: A woman calls the City Police Station to report a stolen briefcase."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Người nói (Speakers)</label>
                <SpeakersInput
                  speakers={sec.speakers || []}
                  onChange={speakers => updateSection(sIdx, { ...sec, speakers })}
                />
              </div>

              <hr className="section-divider" />

              {/* Question blocks */}
              <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
                Question Blocks ({sec.question_blocks?.length || 0})
              </div>

              {(sec.question_blocks || []).map((block: any, bIdx: number) => (
                <QuestionBlockEditor
                  key={bIdx}
                  block={block}
                  blockIndex={bIdx}
                  skillType="listening"
                  onChange={updated => updateBlock(sIdx, bIdx, updated)}
                  onRemove={() => removeBlock(sIdx, bIdx)}
                />
              ))}

              <button className="add-row-btn" onClick={() => addBlock(sIdx)}>
                <Plus size={14} /> Thêm Question Block
              </button>
            </div>
          )}
        </div>
      ))}

      <button className="add-row-btn" onClick={addSection}>
        <Plus size={16} /> Thêm Section mới
      </button>
    </div>
  )
}
