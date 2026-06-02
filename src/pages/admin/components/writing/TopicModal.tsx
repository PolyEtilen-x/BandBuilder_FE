// src/pages/admin/components/writing/TopicModal.tsx

import React, { useState, useEffect } from "react"
import { WritingSampleTopicListItemDto, WritingTaskType } from "@/api/practiceGeneral.api"
import { X } from "lucide-react"
import "./writing-admin.css"

interface TopicModalProps {
  editingTopic: WritingSampleTopicListItemDto | null
  onClose: () => void
  onSave: (data: {
    taskType: WritingTaskType
    category: string
    prompt: string
    imageUrl?: string
  }) => Promise<void>
}

export default function TopicModal({
  editingTopic,
  onClose,
  onSave
}: TopicModalProps) {
  const [topicType, setTopicType] = useState<WritingTaskType>("TASK_1")
  const [topicCategory, setTopicCategory] = useState("")
  const [topicPrompt, setTopicPrompt] = useState("")
  const [topicImageUrl, setTopicImageUrl] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (editingTopic) {
      setTopicType(editingTopic.taskType)
      setTopicCategory(editingTopic.category)
      setTopicPrompt(editingTopic.prompt)
      setTopicImageUrl(editingTopic.imageUrl || "")
    } else {
      setTopicType("TASK_1")
      setTopicCategory("")
      setTopicPrompt("")
      setTopicImageUrl("")
    }
  }, [editingTopic])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topicCategory.trim() || !topicPrompt.trim()) return

    setSaving(true)
    try {
      await onSave({
        taskType: topicType,
        category: topicCategory.trim(),
        prompt: topicPrompt.trim(),
        imageUrl: topicImageUrl.trim() ? topicImageUrl.trim() : undefined
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="writing-admin-modal-overlay">
      <div className="writing-admin-modal-card">
        <div className="writing-admin-modal-header">
          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#111827", margin: 0 }}>
            {editingTopic ? "Cập Nhật Đề Luyện Viết" : "Tạo Đề Luyện Viết Mới"}
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="writing-admin-modal-body">
            <div className="writing-admin-form-group">
              <label className="writing-admin-label">Loại hình IELTS Writing</label>
              <div style={{ display: "flex", gap: "8px" }}>
                {(["TASK_1", "TASK_2"] as const).map((type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => setTopicType(type)}
                    className={`writing-admin-filter-btn ${topicType === type ? "writing-admin-filter-btn-active" : ""}`}
                    style={{ flex: 1, height: "38px" }}
                  >
                    {type === "TASK_1" ? "TASK 1 (Report)" : "TASK 2 (Essay)"}
                  </button>
                ))}
              </div>
            </div>

            <div className="writing-admin-form-group">
              <label className="writing-admin-label">Chủ đề / Danh mục</label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Education, Technology, Line Graph, v.v."
                value={topicCategory}
                onChange={(e) => setTopicCategory(e.target.value)}
                className="writing-admin-text-input"
              />
            </div>

            <div className="writing-admin-form-group">
              <label className="writing-admin-label">Đề bài (Prompt Question)</label>
              <textarea
                required
                placeholder="Nhập toàn bộ câu hỏi hoặc yêu cầu đề bài..."
                value={topicPrompt}
                onChange={(e) => setTopicPrompt(e.target.value)}
                className="writing-admin-textarea"
              />
            </div>

            <div className="writing-admin-form-group">
              <label className="writing-admin-label">URL Hình ảnh (Chỉ dành cho Task 1)</label>
              <input
                type="url"
                placeholder="Dán link ảnh biểu đồ biểu diễn (nếu có)"
                value={topicImageUrl}
                onChange={(e) => setTopicImageUrl(e.target.value)}
                className="writing-admin-text-input"
              />
            </div>
          </div>

          <div style={{ padding: "16px 24px", background: "#f9fafb", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <button
              type="button"
              onClick={onClose}
              className="writing-admin-filter-btn"
              style={{ fontWeight: 650 }}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="writing-admin-create-btn"
              style={{ opacity: saving ? 0.7 : 1 }}
            >
              {saving ? "Đang lưu..." : "Lưu Đề Bài"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
