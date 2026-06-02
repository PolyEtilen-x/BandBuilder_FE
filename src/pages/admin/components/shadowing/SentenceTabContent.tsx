// src/pages/admin/components/shadowing/SentenceTabContent.tsx

import React, { useState } from "react"
import { PronunciationTopicDetailDto, PronunciationSentenceDto } from "@/api/practiceGeneral.api"
import { Plus, Edit2, Trash2 } from "lucide-react"
import "./shadowing-admin.css"

interface SentenceTabContentProps {
  topicDetail: PronunciationTopicDetailDto
  onAddSentence: (data: { text: string; startTime: number; endTime: number; orderIndex: number }) => Promise<void>
  onUpdateSentence: (sentenceId: string, data: { text: string; startTime: number; endTime: number; orderIndex: number }) => Promise<void>
  onDeleteSentence: (sentenceId: string) => Promise<void>
}

export default function SentenceTabContent({
  topicDetail,
  onAddSentence,
  onUpdateSentence,
  onDeleteSentence
}: SentenceTabContentProps) {
  const [showSentenceForm, setShowSentenceForm] = useState(false)
  const [editingSentence, setEditingSentence] = useState<PronunciationSentenceDto | null>(null)

  // Form states
  const [sentenceText, setSentenceText] = useState("")
  const [sentenceStart, setSentenceStart] = useState(0)
  const [sentenceEnd, setSentenceEnd] = useState(0)
  const [sentenceOrder, setSentenceOrder] = useState(0)
  const [saving, setSaving] = useState(false)

  const openAddForm = () => {
    setEditingSentence(null)
    setSentenceText("")
    setSentenceStart(0.0)
    setSentenceEnd(3.0)
    setSentenceOrder(topicDetail.sentences.length)
    setShowSentenceForm(true)
  }

  const openEditForm = (s: PronunciationSentenceDto) => {
    setEditingSentence(s)
    setSentenceText(s.text)
    setSentenceStart(s.startTime)
    setSentenceEnd(s.endTime)
    setSentenceOrder(s.orderIndex)
    setShowSentenceForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sentenceText.trim()) return

    setSaving(true)
    try {
      const payload = {
        text: sentenceText.trim(),
        startTime: sentenceStart,
        endTime: sentenceEnd,
        orderIndex: sentenceOrder
      }

      if (editingSentence) {
        await onUpdateSentence(editingSentence.id, payload)
      } else {
        await onAddSentence(payload)
      }
      setShowSentenceForm(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {!showSentenceForm ? (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="shadowing-admin-label">Câu thoại karaoke tương tác ({topicDetail.sentences.length})</span>
            <button
              onClick={openAddForm}
              className="shadowing-admin-create-btn"
              style={{ padding: "6px 12px", fontSize: "11px" }}
            >
              <Plus size={12} /> Thêm câu tương tác
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {topicDetail.sentences.length === 0 ? (
              <div style={{ textAlign: "center", color: "#6b7280", padding: "16px 0", fontSize: "13px" }}>
                Chưa có câu thoại nào. Hãy cào video YouTube hoặc bấm nút phía trên để thêm mới!
              </div>
            ) : (
              topicDetail.sentences.map((sentence) => (
                <div key={sentence.id} className="shadowing-admin-timeline-row-sentence">
                  <span style={{ fontSize: "11px", fontWeight: 750, color: "#6b7280" }}>#{sentence.orderIndex}</span>
                  <span style={{ fontSize: "12px", fontWeight: 500, color: "#1f2937" }}>{sentence.text}</span>
                  <div style={{ display: "flex", gap: "4px", fontSize: "11px", color: "#2563eb", fontFamily: "monospace", fontWeight: 700 }}>
                    <span>{sentence.startTime.toFixed(2)}s</span>
                    <span style={{ color: "#cbd5e1" }}>➔</span>
                    <span>{sentence.endTime.toFixed(2)}s</span>
                  </div>
                  <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                    <button
                      onClick={() => openEditForm(sentence)}
                      className="shadowing-admin-tab-button"
                      style={{ border: "none", background: "#f3f4f6", padding: "5px", borderRadius: "4px", color: "#4b5563" }}
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Bạn có chắc chắn muốn xóa câu tương tác này?")) {
                          onDeleteSentence(sentence.id)
                        }
                      }}
                      className="shadowing-admin-tab-button"
                      style={{ border: "none", background: "#fee2e2", padding: "5px", borderRadius: "4px", color: "#ef4444" }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e5e7eb", paddingBottom: "10px" }}>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#111827" }}>
              {editingSentence ? "Sửa Câu Tương Tác" : "Thêm Câu Tương Tác Mới"}
            </span>
            <button type="button" onClick={() => setShowSentenceForm(false)} className="shadowing-admin-tab-button" style={{ padding: "4px 8px", fontSize: "11px", fontWeight: 700, background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px" }}>Quay lại</button>
          </div>

          <div className="shadowing-admin-form-group">
            <label className="shadowing-admin-label">Nội dung câu tiếng Anh</label>
            <textarea required value={sentenceText} onChange={(e) => setSentenceText(e.target.value)} className="shadowing-admin-textarea" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            <div className="shadowing-admin-form-group">
              <label className="shadowing-admin-label">StartTime (giây)</label>
              <input type="number" required step="0.01" min="0" value={sentenceStart} onChange={(e) => setSentenceStart(parseFloat(e.target.value) || 0)} className="shadowing-admin-text-input" />
            </div>
            <div className="shadowing-admin-form-group">
              <label className="shadowing-admin-label">EndTime (giây)</label>
              <input type="number" required step="0.01" min="0" value={sentenceEnd} onChange={(e) => setSentenceEnd(parseFloat(e.target.value) || 0)} className="shadowing-admin-text-input" />
            </div>
            <div className="shadowing-admin-form-group">
              <label className="shadowing-admin-label">Thứ tự (OrderIndex)</label>
              <input type="number" required min="0" value={sentenceOrder} onChange={(e) => setSentenceOrder(parseInt(e.target.value) || 0)} className="shadowing-admin-text-input" />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid #e5e7eb", paddingTop: "12px" }}>
            <button type="submit" disabled={saving} className="shadowing-admin-create-btn" style={{ background: "#16a34a", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Đang lưu..." : "Lưu Câu Tương Tác"}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
