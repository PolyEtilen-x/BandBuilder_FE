// src/pages/admin/components/writing/EssaysDrawer.tsx

import React, { useState } from "react"
import { WritingSampleTopicDetailDto, WritingEssayDto } from "@/api/practiceGeneral.api"
import { X, Plus, Edit2, Trash2 } from "lucide-react"
import EssayForm from "./EssayForm"
import "./writing-admin.css"

interface EssaysDrawerProps {
  selectedTopic: WritingSampleTopicDetailDto
  onClose: () => void
  onAddEssay: (data: { bandScore: number; essayText: string; essayTranslation: string; analysis: any }) => Promise<void>
  onUpdateEssay: (essayId: string, data: { bandScore: number; essayText: string; essayTranslation: string; analysis: any }) => Promise<void>
  onDeleteEssay: (essayId: string) => Promise<void>
}

export default function EssaysDrawer({
  selectedTopic,
  onClose,
  onAddEssay,
  onUpdateEssay,
  onDeleteEssay
}: EssaysDrawerProps) {
  const [showEssayForm, setShowEssayForm] = useState(false)
  const [editingEssay, setEditingEssay] = useState<WritingEssayDto | null>(null)

  const handleOpenAdd = () => {
    setEditingEssay(null)
    setShowEssayForm(true)
  }

  const handleOpenEdit = (ess: WritingEssayDto) => {
    setEditingEssay(ess)
    setShowEssayForm(true)
  }

  const handleSave = async (data: { bandScore: number; essayText: string; essayTranslation: string; analysis: any }) => {
    if (editingEssay) {
      await onUpdateEssay(editingEssay.id, data)
    } else {
      await onAddEssay(data)
    }
    setShowEssayForm(false)
  }

  const getBandBadgeClass = (band: number) => {
    if (band >= 8) return "writing-admin-badge-band-high"
    if (band >= 7) return "writing-admin-badge-band-mid"
    return "writing-admin-badge-band-low"
  }

  return (
    <div className="writing-admin-modal-overlay" onClick={onClose}>
      <div className="writing-admin-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="writing-admin-modal-header">
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#111827", margin: 0 }}>
              Danh sách Bài mẫu ({selectedTopic.category})
            </h3>
            <span style={{ fontSize: "11px", color: "#6b7280", fontStyle: "italic", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "500px" }}>
              Prompt: {selectedTopic.prompt}
            </span>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ flex: 1, padding: "24px", display: "flex", flexDirection: "column", gap: "20px", overflowY: "auto", boxSizing: "border-box" }}>
          {!showEssayForm ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="writing-admin-label">
                  Bài viết mẫu ({selectedTopic.essays.length})
                </span>
                <button
                  onClick={handleOpenAdd}
                  className="writing-admin-create-btn"
                  style={{ padding: "6px 12px", fontSize: "12px" }}
                >
                  <Plus size={14} /> Thêm bài mẫu
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {selectedTopic.essays.length === 0 ? (
                  <div style={{ textAlign: "center", color: "#94a3b8", padding: "24px 0", fontSize: "13px" }}>
                    Chưa có bài luận mẫu nào cho đề viết này. Bấm nút phía trên để thêm mới!
                  </div>
                ) : (
                  selectedTopic.essays.map((ess) => (
                    <div key={ess.id} className="writing-admin-essay-card">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                          <span className={getBandBadgeClass(ess.bandScore)}>
                            Band {ess.bandScore.toFixed(1)}
                          </span>
                          <span style={{ fontSize: "11px", color: "#94a3b8", fontFamily: "monospace" }}>ID: {ess.id.slice(0, 8)}</span>
                        </div>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            onClick={() => handleOpenEdit(ess)}
                            className="writing-admin-filter-btn"
                            style={{ padding: "6px", borderRadius: "6px", border: "none", background: "#f3f4f6" }}
                            title="Sửa bài mẫu"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Bạn có chắc chắn muốn xóa bài mẫu này?")) {
                                onDeleteEssay(ess.id)
                              }
                            }}
                            className="writing-admin-filter-btn"
                            style={{ padding: "6px", borderRadius: "6px", border: "none", background: "#fee2e2", color: "#ef4444" }}
                            title="Xóa bài mẫu"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                      
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <p style={{ fontSize: "12px", color: "#374151", margin: 0, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", fontStyle: "italic" }}>
                          "{ess.essayText}"
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <EssayForm
              editingEssay={editingEssay}
              onBack={() => setShowEssayForm(false)}
              onSave={handleSave}
            />
          )}
        </div>
      </div>
    </div>
  )
}
