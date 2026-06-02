// src/pages/admin/components/writing/EssayForm.tsx

import React, { useState, useEffect } from "react"
import { WritingEssayDto } from "@/api/practiceGeneral.api"
import { Award, Check, AlertCircle } from "lucide-react"
import "./writing-admin.css"

interface EssayFormProps {
  editingEssay: WritingEssayDto | null
  onBack: () => void
  onSave: (data: {
    bandScore: number
    essayText: string
    essayTranslation: string
    analysis: any
  }) => Promise<void>
}

export default function EssayForm({
  editingEssay,
  onBack,
  onSave
}: EssayFormProps) {
  const [essayBand, setEssayBand] = useState(8.0)
  const [essayText, setEssayText] = useState("")
  const [essayTranslation, setEssayTranslation] = useState("")
  const [essayAnalysisText, setEssayAnalysisText] = useState("")
  const [jsonError, setJsonError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (editingEssay) {
      setEssayBand(editingEssay.bandScore)
      setEssayText(editingEssay.essayText)
      setEssayTranslation(editingEssay.essayTranslation)
      setEssayAnalysisText(editingEssay.analysis ? JSON.stringify(editingEssay.analysis, null, 2) : "")
      setJsonError(null)
    } else {
      setEssayBand(8.0)
      setEssayText("")
      setEssayTranslation("")
      setEssayAnalysisText("")
      setJsonError(null)
    }
  }, [editingEssay])

  const handleJsonChange = (val: string) => {
    setEssayAnalysisText(val)
    try {
      if (!val.trim()) {
        setJsonError(null)
        return
      }
      JSON.parse(val)
      setJsonError(null)
    } catch (err: any) {
      setJsonError(err.message || "Định dạng JSON không hợp lệ")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!essayText.trim() || !essayTranslation.trim() || jsonError) return

    let parsedAnalysis = null
    if (essayAnalysisText.trim()) {
      try {
        parsedAnalysis = JSON.parse(essayAnalysisText)
      } catch (err) {
        alert("JSON Phân tích không hợp lệ, hãy kiểm tra lại!")
        return
      }
    } else {
      // Default structure if empty
      parsedAnalysis = {
        taskAchievement: essayBand,
        coherenceCohesion: essayBand,
        lexicalResource: essayBand,
        grammaticalRange: essayBand,
        strengths: ["Good usage of academic structures.", "Clear paragraph structuring."],
        improvements: ["Ensure more cohesive links.", "Vary sentence beginnings."],
        overallComment: `An excellent essay showing clean layout and proper vocabulary usage representing band ${essayBand}.`,
        keyVocabulary: []
      }
    }

    setSaving(true)
    try {
      await onSave({
        bandScore: essayBand,
        essayText: essayText.trim(),
        essayTranslation: essayTranslation.trim(),
        analysis: parsedAnalysis
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="writing-admin-container" style={{ gap: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #cbd5e1", paddingBottom: "12px" }}>
        <span style={{ fontSize: "12px", fontWeight: 700, color: "#111827", display: "flex", alignItems: "center", gap: "6px" }}>
          <Award size={16} style={{ color: "#f59e0b" }} />
          {editingEssay ? "Cập Nhật Bài Mẫu" : "Thêm Bài Mẫu Mới"}
        </span>
        <button
          type="button"
          onClick={onBack}
          className="writing-admin-filter-btn"
        >
          Quay lại
        </button>
      </div>

      <div className="writing-admin-form-group">
        <label className="writing-admin-label">Điểm Band Score (0.0 - 9.0)</label>
        <input
          type="number"
          required
          step="0.5"
          min="0"
          max="9"
          value={essayBand}
          onChange={(e) => setEssayBand(parseFloat(e.target.value) || 0)}
          className="writing-admin-text-input"
        />
      </div>

      <div className="writing-admin-form-group">
        <label className="writing-admin-label">Nội dung bài viết mẫu (Essay Text)</label>
        <textarea
          required
          placeholder="Dán toàn bộ bài mẫu bằng tiếng Anh..."
          value={essayText}
          onChange={(e) => setEssayText(e.target.value)}
          className="writing-admin-textarea"
          style={{ minHeight: "150px" }}
        />
      </div>

      <div className="writing-admin-form-group">
        <label className="writing-admin-label">Bản dịch tiếng Việt (Translation)</label>
        <textarea
          required
          placeholder="Dán bản dịch tiếng Việt tương ứng..."
          value={essayTranslation}
          onChange={(e) => setEssayTranslation(e.target.value)}
          className="writing-admin-textarea"
          style={{ minHeight: "150px" }}
        />
      </div>

      <div className="writing-admin-form-group">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <label className="writing-admin-label">Phân tích AI & Từ vựng (AI Analysis JSON)</label>
          {jsonError ? (
            <span style={{ fontSize: "10px", color: "#ef4444", fontWeight: 700, display: "flex", alignItems: "center", gap: "2px" }}>
              <AlertCircle size={10} /> Cú pháp lỗi
            </span>
          ) : (
            <span style={{ fontSize: "10px", color: "#16a34a", fontWeight: 750, display: "flex", alignItems: "center", gap: "2px" }}>
              <Check size={10} /> JSON chuẩn
            </span>
          )}
        </div>
        <textarea
          placeholder="Dán cấu trúc JSON chứa phân tích tiêu chí, điểm mạnh, từ vựng nổi bật... (Để trống để tự động sinh cấu trúc mặc định)"
          value={essayAnalysisText}
          onChange={(e) => handleJsonChange(e.target.value)}
          className="writing-admin-textarea"
          style={{ minHeight: "200px", fontFamily: "monospace", fontSize: "12px", background: "#f8fafc" }}
        />
      </div>

      {jsonError && (
        <div style={{ background: "#fee2e2", border: "1px solid #fecaca", padding: "12px", borderRadius: "8px", display: "flex", gap: "8px" }}>
          <AlertCircle size={15} style={{ color: "#ef4444", flexShrink: 0, marginTop: "2px" }} />
          <span style={{ fontSize: "11px", color: "#ef4444", fontWeight: 500, lineHeight: 1.4 }}>
            {jsonError}
          </span>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid #cbd5e1", paddingTop: "16px" }}>
        <button
          type="submit"
          disabled={!!jsonError || saving}
          className="writing-admin-create-btn"
          style={{
            background: jsonError ? "#cbd5e1" : "#16a34a",
            cursor: jsonError || saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.7 : 1
          }}
        >
          <Check size={14} /> {saving ? "Đang lưu..." : "Lưu Bài Luận Mẫu"}
        </button>
      </div>
    </form>
  )
}
