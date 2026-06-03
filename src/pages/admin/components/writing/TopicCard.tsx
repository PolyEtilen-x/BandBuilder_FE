// src/pages/admin/components/writing/TopicCard.tsx

import React from "react"
import { WritingSampleTopicListItemDto } from "@/api/practice/practiceGeneral.api"
import { BookOpen, Edit2, Trash2 } from "lucide-react"
import "./writing-admin.css"

interface TopicCardProps {
  topic: WritingSampleTopicListItemDto
  isActive: boolean
  onClick: () => void
  onEdit: (t: WritingSampleTopicListItemDto, e: React.MouseEvent) => void
  onDelete: (id: string, category: string) => void
}

export default function TopicCard({
  topic,
  isActive,
  onClick,
  onEdit,
  onDelete
}: TopicCardProps) {
  return (
    <div
      className={`writing-admin-topic-card ${isActive ? "writing-admin-topic-card-active" : ""}`}
      onClick={onClick}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <span className={topic.taskType === "TASK_1" ? "writing-admin-badge-task-1" : "writing-admin-badge-task-2"}>
              {topic.taskType === "TASK_1" ? "Task 1" : "Task 2"}
            </span>
            <span className="writing-admin-badge-category">{topic.category}</span>
          </div>
        </div>
        <p className="writing-admin-card-prompt">{topic.prompt}</p>
      </div>

      <div className="writing-admin-card-footer">
        <span className="writing-admin-count-text">
          <BookOpen size={13} style={{ color: "#2563eb" }} />
          {topic.essayCount} Bài mẫu
        </span>
        <div style={{ display: "flex", gap: "6px" }} onClick={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => onEdit(topic, e)}
            className="writing-admin-filter-btn"
            style={{ padding: "6px", borderRadius: "6px", background: "#f3f4f6", border: "none" }}
            title="Sửa thông tin đề"
          >
            <Edit2 size={13} />
          </button>
          <button
            onClick={() => onDelete(topic.id, topic.category)}
            className="writing-admin-filter-btn"
            style={{ padding: "6px", borderRadius: "6px", background: "#fee2e2", border: "none", color: "#ef4444" }}
            title="Xóa đề"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}
