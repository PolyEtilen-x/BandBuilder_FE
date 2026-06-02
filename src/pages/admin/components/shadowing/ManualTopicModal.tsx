// src/pages/admin/components/shadowing/ManualTopicModal.tsx

import React, { useState } from "react"
import { X } from "lucide-react"
import "./shadowing-admin.css"

interface ManualTopicModalProps {
  onClose: () => void
  onSave: (data: { title: string; paragraph: string; audioUrl?: string }) => Promise<void>
}

export default function ManualTopicModal({
  onClose,
  onSave
}: ManualTopicModalProps) {
  const [title, setTitle] = useState("")
  const [paragraph, setParagraph] = useState("")
  const [audioUrl, setAudioUrl] = useState("")
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !paragraph.trim()) return

    setSaving(true)
    try {
      await onSave({
        title: title.trim(),
        paragraph: paragraph.trim(),
        audioUrl: audioUrl.trim() ? audioUrl.trim() : undefined
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="shadowing-admin-modal-overlay">
      <div className="shadowing-admin-modal-card" style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "16px", width: "100%", maxWidth: "520px", display: "flex", flexDirection: "column" }}>
        <div className="shadowing-admin-library-header" style={{ padding: "18px 24px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#111827", margin: 0 }}>
            Tạo Chủ Đề Phát Âm Thủ Công
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="shadowing-admin-preview-box" style={{ background: "transparent", border: "none", padding: "24px", gap: "16px" }}>
            <div className="shadowing-admin-form-group">
              <label className="shadowing-admin-label">Tiêu đề bài phát âm</label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Daily Conversation Practice, Hobbies, v.v."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="shadowing-admin-text-input"
              />
            </div>

            <div className="shadowing-admin-form-group">
              <label className="shadowing-admin-label">Đoạn văn mẫu (Paragraph)</label>
              <textarea
                required
                placeholder="Nhập nội dung đoạn văn học viên cần nghe và phát âm theo..."
                value={paragraph}
                onChange={(e) => setParagraph(e.target.value)}
                className="shadowing-admin-textarea"
                style={{ minHeight: "120px" }}
              />
            </div>

            <div className="shadowing-admin-form-group">
              <label className="shadowing-admin-label">Backup Audio URL (mp3)</label>
              <input
                type="url"
                placeholder="Dán link file âm thanh (nếu có)"
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                className="shadowing-admin-text-input"
              />
            </div>
          </div>

          <div style={{ padding: "16px 24px", background: "#f9fafb", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <button
              type="button"
              onClick={onClose}
              className="shadowing-admin-tab-button"
              style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#ffffff", fontSize: "13px", fontWeight: 650, cursor: "pointer", color: "#4b5563" }}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="shadowing-admin-save-btn"
              style={{ opacity: saving ? 0.7 : 1 }}
            >
              {saving ? "Đang lưu..." : "Lưu Chủ Đề"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
