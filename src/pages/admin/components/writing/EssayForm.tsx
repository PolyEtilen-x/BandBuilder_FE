// src/pages/admin/components/writing/EssayForm.tsx

import React, { useState, useEffect } from "react"
import { WritingEssayDto, EssayAnalysis, KeyVocabularyItem } from "@/api/practice/practiceGeneral.api"
import { Award, Check, AlertCircle, Plus, Trash2, PenTool, Code } from "lucide-react"
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

  // Editor mode: Visual Form Editor or Raw JSON Text Editor
  const [isVisualMode, setIsVisualMode] = useState(true)

  // Visual Form state fields
  const [taskAchievement, setTaskAchievement] = useState<number>(8.0)
  const [coherenceCohesion, setCoherenceCohesion] = useState<number>(8.0)
  const [lexicalResource, setLexicalResource] = useState<number>(8.0)
  const [grammaticalRange, setGrammaticalRange] = useState<number>(8.0)
  const [outline, setOutline] = useState<string>("")
  const [strengths, setStrengths] = useState<string[]>([])
  const [improvements, setImprovements] = useState<string[]>([])
  const [keyVocabulary, setKeyVocabulary] = useState<KeyVocabularyItem[]>([])
  const [overallComment, setOverallComment] = useState<string>("")

  useEffect(() => {
    if (editingEssay) {
      setEssayBand(editingEssay.bandScore)
      setEssayText(editingEssay.essayText)
      setEssayTranslation(editingEssay.essayTranslation ?? "")

      const analysis = editingEssay.analysis || {}
      setTaskAchievement(analysis.taskAchievement ?? editingEssay.bandScore ?? 8.0)
      setCoherenceCohesion(analysis.coherenceCohesion ?? editingEssay.bandScore ?? 8.0)
      setLexicalResource(analysis.lexicalResource ?? editingEssay.bandScore ?? 8.0)
      setGrammaticalRange(analysis.grammaticalRange ?? editingEssay.bandScore ?? 8.0)
      setOutline(analysis.outline ?? "")
      setStrengths(analysis.strengths ?? [])
      setImprovements(analysis.improvements ?? [])
      setKeyVocabulary(analysis.keyVocabulary ?? [])
      setOverallComment(analysis.overallComment ?? "")

      setEssayAnalysisText(editingEssay.analysis ? JSON.stringify(editingEssay.analysis, null, 2) : "")
      setJsonError(null)
      setIsVisualMode(true)
    } else {
      setEssayBand(8.0)
      setEssayText("")
      setEssayTranslation("")

      // Default structured analysis for new essay
      setTaskAchievement(8.0)
      setCoherenceCohesion(8.0)
      setLexicalResource(8.0)
      setGrammaticalRange(8.0)
      setOutline("")
      setStrengths(["Good usage of academic structures.", "Clear paragraph structuring."])
      setImprovements(["Ensure more cohesive links.", "Vary sentence beginnings."])
      setKeyVocabulary([])
      setOverallComment("An excellent essay showing clean layout and proper vocabulary usage.")

      setEssayAnalysisText("")
      setJsonError(null)
      setIsVisualMode(true)
    }
  }, [editingEssay])

  // Automatically adjust criteria sub-scores if the main band score changes AND we are creating a new essay,
  // or if they currently match the old band score (as a helpful default).
  const handleMainBandChange = (newVal: number) => {
    setEssayBand(newVal)
    if (!editingEssay) {
      setTaskAchievement(newVal)
      setCoherenceCohesion(newVal)
      setLexicalResource(newVal)
      setGrammaticalRange(newVal)
    }
  }

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

  // Toggle between visual form and raw JSON code editor
  const handleToggleMode = (toVisual: boolean) => {
    if (toVisual === isVisualMode) return

    if (toVisual) {
      // Switch from JSON to Visual
      try {
        if (essayAnalysisText.trim()) {
          const parsed = JSON.parse(essayAnalysisText)
          setTaskAchievement(parsed.taskAchievement ?? essayBand)
          setCoherenceCohesion(parsed.coherenceCohesion ?? essayBand)
          setLexicalResource(parsed.lexicalResource ?? essayBand)
          setGrammaticalRange(parsed.grammaticalRange ?? essayBand)
          setOutline(parsed.outline ?? "")
          setStrengths(parsed.strengths ?? [])
          setImprovements(parsed.improvements ?? [])
          setKeyVocabulary(parsed.keyVocabulary ?? [])
          setOverallComment(parsed.overallComment ?? "")
        } else {
          // If empty
          setTaskAchievement(essayBand)
          setCoherenceCohesion(essayBand)
          setLexicalResource(essayBand)
          setGrammaticalRange(essayBand)
          setOutline("")
          setStrengths([])
          setImprovements([])
          setKeyVocabulary([])
          setOverallComment("")
        }
        setJsonError(null)
        setIsVisualMode(true)
      } catch (err: any) {
        setJsonError(err.message || "JSON không hợp lệ")
        alert("Không thể chuyển sang Visual Editor khi cú pháp JSON bị lỗi. Vui lòng sửa lại lỗi cú pháp trước!")
      }
    } else {
      // Switch from Visual to JSON
      const currentAnalysis: EssayAnalysis = {
        taskAchievement,
        coherenceCohesion,
        lexicalResource,
        grammaticalRange,
        outline: outline.trim() || undefined,
        strengths: strengths.filter(s => s.trim() !== ""),
        improvements: improvements.filter(imp => imp.trim() !== ""),
        overallComment: overallComment.trim(),
        keyVocabulary: keyVocabulary.filter(v => v.phrase.trim() !== "")
      }
      setEssayAnalysisText(JSON.stringify(currentAnalysis, null, 2))
      setJsonError(null)
      setIsVisualMode(false)
    }
  }

  // Strength Handlers
  const handleUpdateStrength = (index: number, val: string) => {
    const updated = [...strengths]
    updated[index] = val
    setStrengths(updated)
  }
  const handleAddStrength = () => {
    setStrengths([...strengths, ""])
  }
  const handleRemoveStrength = (index: number) => {
    setStrengths(strengths.filter((_, i) => i !== index))
  }

  // Improvement Handlers
  const handleUpdateImprovement = (index: number, val: string) => {
    const updated = [...improvements]
    updated[index] = val
    setImprovements(updated)
  }
  const handleAddImprovement = () => {
    setImprovements([...improvements, ""])
  }
  const handleRemoveImprovement = (index: number) => {
    setImprovements(improvements.filter((_, i) => i !== index))
  }

  // Vocabulary Handlers
  const handleUpdateVocab = (index: number, key: keyof KeyVocabularyItem, val: string) => {
    const updated = [...keyVocabulary]
    updated[index] = { ...updated[index], [key]: val }
    setKeyVocabulary(updated)
  }
  const handleAddVocab = () => {
    setKeyVocabulary([...keyVocabulary, { phrase: "", meaning: "", context: "" }])
  }
  const handleRemoveVocab = (index: number) => {
    setKeyVocabulary(keyVocabulary.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!essayText.trim() || !essayTranslation.trim()) {
      alert("Vui lòng điền Essay Text và Translation!")
      return
    }

    let parsedAnalysis = null

    if (isVisualMode) {
      parsedAnalysis = {
        taskAchievement,
        coherenceCohesion,
        lexicalResource,
        grammaticalRange,
        outline: outline.trim() || undefined,
        strengths: strengths.filter(s => s.trim() !== ""),
        improvements: improvements.filter(imp => imp.trim() !== ""),
        overallComment: overallComment.trim(),
        keyVocabulary: keyVocabulary.filter(v => v.phrase.trim() !== "")
      }
    } else {
      if (jsonError) {
        alert("Cú pháp JSON phân tích đang bị lỗi. Hãy sửa trước khi lưu!")
        return
      }
      if (essayAnalysisText.trim()) {
        try {
          parsedAnalysis = JSON.parse(essayAnalysisText)
        } catch (err) {
          alert("JSON Phân tích không hợp lệ, hãy kiểm tra lại!")
          return
        }
      } else {
        // Fallback default
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
    }

    setSaving(true)
    try {
      await onSave({
        bandScore: essayBand,
        essayText: essayText.trim(),
        essayTranslation: essayTranslation.trim(),
        analysis: parsedAnalysis
      })
    } catch (err) {
      console.error(err)
      alert("Lỗi khi lưu bài luận mẫu!")
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
          onChange={(e) => handleMainBandChange(parseFloat(e.target.value) || 0)}
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
          style={{ minHeight: "140px" }}
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
          style={{ minHeight: "140px" }}
        />
      </div>

      {/* Editor Mode Tabs */}
      <div className="writing-admin-mode-toggle-bar">
        <button
          type="button"
          className={`writing-admin-mode-btn ${isVisualMode ? "active" : ""}`}
          onClick={() => handleToggleMode(true)}
        >
          <PenTool size={13} style={{ marginRight: 6 }} /> Visual Form
        </button>
        <button
          type="button"
          className={`writing-admin-mode-btn ${!isVisualMode ? "active" : ""}`}
          onClick={() => handleToggleMode(false)}
        >
          <Code size={13} style={{ marginRight: 6 }} /> Raw JSON
        </button>
      </div>

      {/* Visual Form Editor */}
      {isVisualMode && (
        <div className="writing-admin-visual-editor-container">
          <div className="writing-admin-visual-card">
            <h4 className="writing-admin-card-title-small">1. Điểm số tiêu chí (Criteria Breakdown)</h4>
            <div className="writing-admin-subscores-grid">
              <div className="writing-admin-form-group">
                <label className="writing-admin-label-small">Task Achievement</label>
                <input
                  type="number"
                  required
                  step="0.5"
                  min="0"
                  max="9"
                  value={taskAchievement}
                  onChange={(e) => setTaskAchievement(parseFloat(e.target.value) || 0)}
                  className="writing-admin-text-input"
                />
              </div>
              <div className="writing-admin-form-group">
                <label className="writing-admin-label-small">Coherence & Cohesion</label>
                <input
                  type="number"
                  required
                  step="0.5"
                  min="0"
                  max="9"
                  value={coherenceCohesion}
                  onChange={(e) => setCoherenceCohesion(parseFloat(e.target.value) || 0)}
                  className="writing-admin-text-input"
                />
              </div>
              <div className="writing-admin-form-group">
                <label className="writing-admin-label-small">Lexical Resource</label>
                <input
                  type="number"
                  required
                  step="0.5"
                  min="0"
                  max="9"
                  value={lexicalResource}
                  onChange={(e) => setLexicalResource(parseFloat(e.target.value) || 0)}
                  className="writing-admin-text-input"
                />
              </div>
              <div className="writing-admin-form-group">
                <label className="writing-admin-label-small">Grammatical Range</label>
                <input
                  type="number"
                  required
                  step="0.5"
                  min="0"
                  max="9"
                  value={grammaticalRange}
                  onChange={(e) => setGrammaticalRange(parseFloat(e.target.value) || 0)}
                  className="writing-admin-text-input"
                />
              </div>
            </div>
          </div>

          <div className="writing-admin-visual-card" style={{ marginTop: "16px" }}>
            <h4 className="writing-admin-card-title-small">2. Dàn ý / Outline (tùy chọn)</h4>
            <textarea
              placeholder={"Nhập dàn ý cho bài viết...\nVD:\nIntroduction: Paraphrase the prompt and state overview\nBody 1: Describe the highest values...\nBody 2: Compare remaining countries...\nConclusion: Summarise key trends"}
              value={outline}
              onChange={(e) => setOutline(e.target.value)}
              className="writing-admin-textarea"
              style={{ minHeight: "100px" }}
            />
          </div>

          <div className="writing-admin-visual-card" style={{ marginTop: "16px" }}>
            <div className="writing-admin-section-header">
              <h4 className="writing-admin-card-title-small">3. Phân tích điểm mạnh (Key Strengths)</h4>
              <button
                type="button"
                onClick={handleAddStrength}
                className="writing-admin-add-item-btn"
              >
                <Plus size={12} /> Thêm điểm mạnh
              </button>
            </div>
            {strengths.length === 0 ? (
              <p className="writing-admin-empty-list-text">Chưa có điểm mạnh nào. Hãy nhấn nút để thêm.</p>
            ) : (
              <div className="writing-admin-list-items">
                {strengths.map((str, idx) => (
                  <div key={idx} className="writing-admin-list-item-row">
                    <input
                      type="text"
                      placeholder="Ví dụ: Trình bày cấu trúc so sánh dữ liệu mạch lạc..."
                      value={str}
                      onChange={(e) => handleUpdateStrength(idx, e.target.value)}
                      className="writing-admin-text-input"
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveStrength(idx)}
                      className="writing-admin-delete-item-btn"
                      title="Xóa"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="writing-admin-visual-card" style={{ marginTop: "16px" }}>
            <div className="writing-admin-section-header">
              <h4 className="writing-admin-card-title-small">4. Điểm cần cải thiện (Areas to Improve)</h4>
              <button
                type="button"
                onClick={handleAddImprovement}
                className="writing-admin-add-item-btn"
              >
                <Plus size={12} /> Thêm đề xuất cải thiện
              </button>
            </div>
            {improvements.length === 0 ? (
              <p className="writing-admin-empty-list-text">Chưa có điểm cần cải thiện nào. Hãy nhấn nút để thêm.</p>
            ) : (
              <div className="writing-admin-list-items">
                {improvements.map((imp, idx) => (
                  <div key={idx} className="writing-admin-list-item-row">
                    <input
                      type="text"
                      placeholder="Ví dụ: Cần phân chia đoạn văn cân đối hơn giữa 2 phần thân bài..."
                      value={imp}
                      onChange={(e) => handleUpdateImprovement(idx, e.target.value)}
                      className="writing-admin-text-input"
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImprovement(idx)}
                      className="writing-admin-delete-item-btn"
                      title="Xóa"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="writing-admin-visual-card" style={{ marginTop: "16px" }}>
            <div className="writing-admin-section-header" style={{ marginBottom: "12px" }}>
              <h4 className="writing-admin-card-title-small">5. Từ vựng nổi bật (Key Vocabulary)</h4>
              <button
                type="button"
                onClick={handleAddVocab}
                className="writing-admin-add-item-btn"
              >
                <Plus size={12} /> Thêm từ vựng
              </button>
            </div>
            {keyVocabulary.length === 0 ? (
              <p className="writing-admin-empty-list-text">Chưa có từ vựng nào. Hãy nhấn nút để thêm.</p>
            ) : (
              <div className="writing-admin-vocab-container">
                <div className="writing-admin-vocab-header-row">
                  <div>Từ / Cụm từ (Phrase)</div>
                  <div>Ý nghĩa (Meaning)</div>
                  <div>Ngữ cảnh ví dụ (Context)</div>
                  <div></div>
                </div>
                <div className="writing-admin-vocab-items">
                  {keyVocabulary.map((item, idx) => (
                    <div key={idx} className="writing-admin-vocab-row">
                      <input
                        type="text"
                        placeholder="Ví dụ: waste production"
                        value={item.phrase}
                        onChange={(e) => handleUpdateVocab(idx, "phrase", e.target.value)}
                        className="writing-admin-text-input"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Ví dụ: sự sản sinh rác thải"
                        value={item.meaning}
                        onChange={(e) => handleUpdateVocab(idx, "meaning", e.target.value)}
                        className="writing-admin-text-input"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Ví dụ: waste production in six countries"
                        value={item.context}
                        onChange={(e) => handleUpdateVocab(idx, "context", e.target.value)}
                        className="writing-admin-text-input"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveVocab(idx)}
                        className="writing-admin-delete-item-btn"
                        title="Xóa từ vựng này"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="writing-admin-visual-card" style={{ marginTop: "16px" }}>
            <h4 className="writing-admin-card-title-small">5. Nhận xét tổng quan (Overall Comment)</h4>
            <div className="writing-admin-form-group">
              <textarea
                placeholder="Nhập nhận xét tổng quan cho bài mẫu này..."
                value={overallComment}
                onChange={(e) => setOverallComment(e.target.value)}
                className="writing-admin-textarea"
                style={{ minHeight: "100px" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Raw JSON Editor */}
      {!isVisualMode && (
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
            style={{ minHeight: "350px", fontFamily: "monospace", fontSize: "12px", background: "#f8fafc" }}
          />

          {jsonError && (
            <div style={{ background: "#fee2e2", border: "1px solid #fecaca", padding: "12px", borderRadius: "8px", display: "flex", gap: "8px", marginTop: "10px" }}>
              <AlertCircle size={15} style={{ color: "#ef4444", flexShrink: 0, marginTop: "2px" }} />
              <span style={{ fontSize: "11px", color: "#ef4444", fontWeight: 500, lineHeight: 1.4 }}>
                {jsonError}
              </span>
            </div>
          )}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid #cbd5e1", paddingTop: "16px" }}>
        <button
          type="submit"
          disabled={(isVisualMode ? false : !!jsonError) || saving}
          className="writing-admin-create-btn"
          style={{
            background: (!isVisualMode && jsonError) ? "#cbd5e1" : "#16a34a",
            cursor: (!isVisualMode && jsonError) || saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.7 : 1
          }}
        >
          <Check size={14} /> {saving ? "Đang lưu..." : "Lưu Bài Luận Mẫu"}
        </button>
      </div>
    </form>
  )
}
