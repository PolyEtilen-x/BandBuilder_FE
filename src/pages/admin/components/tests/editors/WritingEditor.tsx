import { useState } from "react"
import { Plus, Trash2, Upload, X } from "lucide-react"
import { adminPracticeApi } from "@/api/practice/adminPractice.api"

interface Visual { type: string; label: string; imageUrl?: string }

interface Props {
  value: any
  taskNumber: 1 | 2
  onChange: (updated: any) => void
}

const VISUAL_TYPES = [
  "bar_chart", "pie_chart", "line_graph", "table", "map", "diagram", "flow_chart", "mixed"
]

const ESSAY_TYPES = [
  { value: "opinion_essay", label: "Opinion / Agree-Disagree" },
  { value: "discuss_both_views", label: "Discuss Both Views" },
  { value: "two_part_question", label: "Two-Part Question" },
  { value: "problem_solution", label: "Problem & Solution" },
  { value: "advantages_disadvantages", label: "Advantages & Disadvantages" },
]

export default function WritingEditor({ value, taskNumber, onChange }: Props) {
  const update = (field: string, val: any) => onChange({ ...value, task: taskNumber, [field]: val })

  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null)

  const visuals: Visual[] = value?.visuals || []

  const handleImageUpload = async (vIdx: number, file: File) => {
    if (!file) return
    setUploadingIdx(vIdx)
    try {
      const res = await adminPracticeApi.uploadImage(file)
      const vs = [...visuals]
      vs[vIdx] = { ...vs[vIdx], imageUrl: res.data.url }
      update("visuals", vs)
    } catch (err) {
      console.error("Failed to upload image:", err)
      alert("Upload ảnh thất bại. Vui lòng thử lại.")
    } finally {
      setUploadingIdx(null)
    }
  }

  const addVisual = () => update("visuals", [...visuals, { type: "bar_chart", label: "" }])
  const updateVisual = (i: number, updated: Visual) => {
    const vs = [...visuals]; vs[i] = updated; update("visuals", vs)
  }
  const removeVisual = (i: number) => {
    const vs = [...visuals]; vs.splice(i, 1); update("visuals", vs)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div className="info-alert">
        {taskNumber === 1
          ? "Writing Task 1 — Mô tả biểu đồ / hình ảnh (Academic). Yêu cầu tối thiểu 150 từ, 20 phút."
          : "Writing Task 2 — Bài luận ý kiến (Academic/General). Yêu cầu tối thiểu 250 từ, 40 phút."}
      </div>

      {/* Module */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Module</label>
          <select className="form-select" value={value?.module || "academic"} onChange={e => update("module", e.target.value)}>
            <option value="academic">Academic</option>
            <option value="general">General Training</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Số từ tối thiểu</label>
          <input className="form-input" type="number" min={50} max={500}
            value={value?.min_words ?? (taskNumber === 1 ? 150 : 250)}
            onChange={e => update("min_words", Number(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Thời gian (phút)</label>
          <input className="form-input" type="number" min={10} max={60}
            value={value?.time_minutes ?? (taskNumber === 1 ? 20 : 40)}
            onChange={e => update("time_minutes", Number(e.target.value))}
          />
        </div>
      </div>

      {/* Instruction */}
      <div className="form-group">
        <label className="form-label">Hướng dẫn làm bài (Instruction)</label>
        <input className="form-input"
          value={value?.instruction || ""}
          onChange={e => update("instruction", e.target.value)}
          placeholder="You should spend about 20 minutes on this task."
        />
      </div>

      {/* Prompt / Question */}
      <div className="form-group">
        <label className="form-label">{taskNumber === 1 ? "Mô tả biểu đồ (Prompt)" : "Đề bài Luận (Essay Question)"}</label>
        <textarea className="form-textarea" rows={5}
          value={value?.prompt || ""}
          onChange={e => update("prompt", e.target.value)}
          placeholder={taskNumber === 1
            ? "The chart below shows the percentage of waste recycled..."
            : "Some people believe that university education should be free..."}
        />
      </div>

      {/* Task 1: Visuals */}
      {taskNumber === 1 && (
        <>
          <div className="form-group">
            <label className="form-label">Loại biểu đồ (Visual Type)</label>
            <select className="form-select" value={value?.visual_type || ""} onChange={e => update("visual_type", e.target.value)}>
              <option value="">-- Chọn --</option>
              {VISUAL_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Mô tả biểu đồ (Visual Description)</label>
            <textarea className="form-textarea" rows={2}
              value={value?.visual_description || ""}
              onChange={e => update("visual_description", e.target.value)}
              placeholder="Bar chart showing reasons why adults decide to study..."
            />
          </div>

          {/* Visuals list */}
          <div className="form-group">
            <label className="form-label">Danh sách biểu đồ / hình ảnh ({visuals.length})</label>
            {visuals.map((v, vIdx) => (
              <div key={vIdx} className="section-card" style={{ marginBottom: 10 }}>
                <div className="section-card-header" style={{ cursor: "default" }}>
                  <div className="section-card-header-left">
                    <span className="section-number-badge">{String.fromCharCode(65 + vIdx)}</span>
                    <span className="section-card-title">{v.type.replace(/_/g, " ")} — {v.label || "Chưa có nhãn"}</span>
                  </div>
                  <button className="btn-danger" onClick={() => removeVisual(vIdx)}><Trash2 size={12} /></button>
                </div>
                <div className="section-card-body">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Loại</label>
                      <select className="form-select" value={v.type} onChange={e => updateVisual(vIdx, { ...v, type: e.target.value })}>
                        {VISUAL_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Nhãn (Label)</label>
                      <input className="form-input" value={v.label}
                        onChange={e => updateVisual(vIdx, { ...v, label: e.target.value })}
                        placeholder="Reasons for adults studying..."
                      />
                    </div>
                  </div>

                  {/* Image upload field */}
                  <div className="form-group" style={{ marginTop: 8, marginBottom: 12 }}>
                    <label className="form-label">Hình ảnh biểu đồ (Chart Image)</label>
                    {v.imageUrl ? (
                      <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 4 }}>
                        <img src={v.imageUrl} alt={v.label} style={{ maxWidth: 200, maxHeight: 120, objectFit: "contain", borderRadius: 4, border: "1px solid #e2e8f0" }} />
                        <button
                          type="button"
                          className="btn-danger"
                          style={{ padding: "4px 8px", display: "flex", alignItems: "center", gap: 4, height: "fit-content" }}
                          onClick={() => {
                            const vs = [...visuals]
                            const updatedVisual = { ...vs[vIdx] }
                            delete updatedVisual.imageUrl
                            vs[vIdx] = updatedVisual
                            update("visuals", vs)
                          }}
                        >
                          <X size={12} /> Xóa ảnh
                        </button>
                      </div>
                    ) : (
                      <div style={{ marginTop: 4 }}>
                        <label
                          className="add-row-btn"
                          style={{
                            width: "fit-content",
                            padding: "6px 12px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            background: "#f1f5f9",
                            border: "1px dashed #cbd5e1"
                          }}
                        >
                          {uploadingIdx === vIdx ? (
                            <span>Đang tải lên...</span>
                          ) : (
                            <>
                              <Upload size={14} /> Chọn ảnh từ máy tính
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingIdx !== null}
                            style={{ display: "none" }}
                            onChange={e => {
                              const file = e.target.files?.[0]
                              if (file) handleImageUpload(vIdx, file)
                            }}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <button className="add-row-btn" onClick={addVisual}>
              <Plus size={14} /> Thêm biểu đồ / hình ảnh
            </button>
          </div>
        </>
      )}

      {/* Task 2: Essay type + Note */}
      {taskNumber === 2 && (
        <>
          <div className="form-group">
            <label className="form-label">Loại bài luận (Essay Type)</label>
            <select className="form-select" value={value?.essay_type || ""} onChange={e => update("essay_type", e.target.value)}>
              <option value="">-- Chọn --</option>
              {ESSAY_TYPES.map(et => <option key={et.value} value={et.value}>{et.label}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Ghi chú (Note)</label>
            <textarea className="form-textarea" rows={2}
              value={value?.note || ""}
              onChange={e => update("note", e.target.value)}
              placeholder="Use your own ideas, knowledge and experience..."
            />
          </div>
        </>
      )}
    </div>
  )
}
