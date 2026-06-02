// src/pages/admin/components/shadowing/ShadowingTopicCard.tsx

import React from "react"
import { ShadowingTopic } from "../../types"
import { Play, Trash2 } from "lucide-react"
import "./shadowing-admin.css"

interface ShadowingTopicCardProps {
  topic: ShadowingTopic
  onClick: () => void
  onDelete: (id: string, title: string) => void
}

export default function ShadowingTopicCard({
  topic,
  onClick,
  onDelete
}: ShadowingTopicCardProps) {
  return (
    <div className="shadowing-admin-topic-card" onClick={onClick}>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span className="shadowing-admin-mini-play">
            <Play size={12} style={{ fill: "#dc2626", stroke: "none" }} />
          </span>
          <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#111827", margin: 0 }}>{topic.title}</h4>
        </div>
        <p className="shadowing-admin-card-paragraph">
          {topic.paragraph}
        </p>

        <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
          <span className="shadowing-admin-tag-count">{topic.sentencesCount} Câu phát âm</span>
          <span className="shadowing-admin-tag-count">{topic.vocabCount} Từ cốt lõi</span>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete(topic.id, topic.title)
        }}
        style={{ border: "none", background: "none", cursor: "pointer", color: "#94a3b8", padding: "6px", borderRadius: "6px" }}
        title="Xoá học liệu"
      >
        <Trash2 size={15} style={{ color: "#ef4444" }} />
      </button>
    </div>
  )
}
