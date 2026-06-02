// src/pages/admin/components/writing/WritingSamplesTab.tsx

import { useState, useEffect, useMemo } from "react"
import {
  WritingSampleTopicListItemDto,
  WritingSampleTopicDetailDto,
  WritingTaskType,
  createWritingSampleTopicAdmin,
  updateWritingSampleTopicAdmin,
  deleteWritingSampleTopicAdmin,
  createWritingSampleEssayAdmin,
  updateWritingSampleEssayAdmin,
  deleteWritingSampleEssayAdmin,
  getWritingSampleTopics,
  getWritingSampleTopicDetail
} from "@/api/practiceGeneral.api"
import { Search, Plus, FileText } from "lucide-react"
import TopicCard from "./TopicCard"
import TopicModal from "./TopicModal"
import EssaysDrawer from "./EssaysDrawer"
import "./writing-admin.css"

export default function WritingSamplesTab() {
  const [topics, setTopics] = useState<WritingSampleTopicListItemDto[]>([])
  const [selectedTopic, setSelectedTopic] = useState<WritingSampleTopicDetailDto | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [taskFilter, setTaskFilter] = useState<"ALL" | "TASK_1" | "TASK_2">("ALL")
  const [toast, setToast] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Modals state
  const [showTopicModal, setShowTopicModal] = useState(false)
  const [editingTopic, setEditingTopic] = useState<WritingSampleTopicListItemDto | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  // Load Topics from database
  const loadTopics = async () => {
    setLoading(true)
    try {
      const data = await getWritingSampleTopics(
        taskFilter === "ALL" ? undefined : taskFilter
      )
      setTopics(data)
    } catch (e: any) {
      showToast("Lỗi tải danh sách đề viết: " + (e.message || e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTopics()
  }, [taskFilter])

  // Load selected topic detail (including essays)
  const loadTopicDetail = async (id: string) => {
    try {
      const data = await getWritingSampleTopicDetail(id)
      setSelectedTopic(data)
    } catch (e: any) {
      showToast("Lỗi tải chi tiết bài viết: " + (e.message || e))
    }
  }

  // Filter topics based on client search
  const filteredTopics = useMemo(() => {
    return topics.filter(t =>
      t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.prompt.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [topics, searchTerm])

  // Handle Save/Create Topic
  const handleSaveTopic = async (data: {
    taskType: WritingTaskType
    category: string
    prompt: string
    imageUrl?: string
  }) => {
    try {
      if (editingTopic) {
        await updateWritingSampleTopicAdmin(editingTopic.id, data)
        showToast("Cập nhật đề viết mẫu thành công!")
      } else {
        await createWritingSampleTopicAdmin(data)
        showToast("Đã thêm thành công đề viết mẫu mới!")
      }
      setShowTopicModal(false)
      setEditingTopic(null)
      loadTopics()
    } catch (e: any) {
      showToast("Lỗi khi lưu đề viết: " + (e.message || e))
    }
  }

  // Handle Delete Topic
  const handleDeleteTopic = async (id: string, title: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa đề thi: ${title}? Toàn bộ các bài mẫu liên quan sẽ bị xóa sạch.`)) return
    try {
      await deleteWritingSampleTopicAdmin(id)
      showToast("Đã xóa đề viết thành công.")
      if (selectedTopic?.id === id) {
        setSelectedTopic(null)
      }
      loadTopics()
    } catch (e: any) {
      showToast("Lỗi xóa đề viết: " + (e.message || e))
    }
  }

  // Open Edit Topic modal
  const openEditTopic = (t: WritingSampleTopicListItemDto, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent opening drawer
    setEditingTopic(t)
    setShowTopicModal(true)
  }

  // Handle Save Essay
  const handleAddEssay = async (data: {
    bandScore: number
    essayText: string
    essayTranslation: string
    analysis: any
  }) => {
    if (!selectedTopic) return
    try {
      await createWritingSampleEssayAdmin(selectedTopic.id, data)
      showToast("Đã thêm thành công bài mẫu mới!")
      loadTopicDetail(selectedTopic.id)
      loadTopics()
    } catch (err: any) {
      showToast("Lỗi khi lưu bài viết mẫu: " + (err.message || err))
    }
  }

  const handleUpdateEssay = async (
    essayId: string,
    data: { bandScore: number; essayText: string; essayTranslation: string; analysis: any }
  ) => {
    if (!selectedTopic) return
    try {
      await updateWritingSampleEssayAdmin(essayId, data)
      showToast("Cập nhật bài viết mẫu thành công!")
      loadTopicDetail(selectedTopic.id)
      loadTopics()
    } catch (err: any) {
      showToast("Lỗi khi lưu bài viết mẫu: " + (err.message || err))
    }
  }

  // Handle Delete Essay
  const handleDeleteEssay = async (essayId: string) => {
    try {
      await deleteWritingSampleEssayAdmin(essayId)
      showToast("Đã xóa bài luận mẫu thành công.")
      if (selectedTopic) {
        loadTopicDetail(selectedTopic.id)
        loadTopics()
      }
    } catch (err: any) {
      showToast("Lỗi khi xóa bài luận: " + (err.message || err))
    }
  }

  return (
    <div className="writing-admin-container">
      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="writing-admin-toast">
          <span style={{ padding: "8px", background: "#eff6ff", color: "#2563eb", borderRadius: "8px", display: "flex" }}>
            <FileText size={16} />
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ fontSize: "10px", color: "#6b7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Writing Admin</span>
            <p style={{ fontSize: "12px", color: "#374151", margin: 0, fontWeight: 500 }}>{toast}</p>
          </div>
        </div>
      )}

      {/* HEADER ROW */}
      <div className="writing-admin-header-row">
        <div>
          <h2 className="writing-admin-title">Quản trị Bài Viết Mẫu (IELTS Writing)</h2>
          <p className="writing-admin-subtitle">Quản lý đề thi IELTS Writing Task 1 & 2 cùng kho bài mẫu có phân tích AI chi tiết.</p>
        </div>
        <button onClick={() => { setEditingTopic(null); setShowTopicModal(true); }} className="writing-admin-create-btn">
          <Plus size={16} />
          Thêm đề viết mẫu
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="writing-admin-filter-bar">
        <div className="writing-admin-search-wrapper">
          <input
            type="text"
            placeholder="Tìm đề viết theo chủ đề/đề bài..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="writing-admin-search-input"
          />
          <Search size={14} style={{ position: "absolute", left: "12px", top: "11px", color: "#94a3b8" }} />
        </div>

        <div className="writing-admin-filter-group">
          <span className="writing-admin-label">Lọc đề bài:</span>
          {(["ALL", "TASK_1", "TASK_2"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTaskFilter(filter)}
              className={`writing-admin-filter-btn ${taskFilter === filter ? "writing-admin-filter-btn-active" : ""}`}
            >
              {filter === "ALL" ? "TẤT CẢ" : filter.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* GRID LISTING */}
      {loading ? (
        <div style={{ textAlign: "center", color: "#6b7280", padding: "48px 0" }}>Đang tải danh sách đề thi...</div>
      ) : filteredTopics.length === 0 ? (
        <div style={{ textAlign: "center", color: "#6b7280", padding: "48px 0" }}>Không tìm thấy đề viết mẫu nào. Hãy thêm đề mới ở trên!</div>
      ) : (
        <div className="writing-admin-grid-list">
          {filteredTopics.map((topic) => {
            const active = selectedTopic?.id === topic.id
            return (
              <TopicCard
                key={topic.id}
                topic={topic}
                isActive={active}
                onClick={() => loadTopicDetail(topic.id)}
                onEdit={openEditTopic}
                onDelete={handleDeleteTopic}
              />
            )
          })}
        </div>
      )}

      {/* TOPIC MODAL (ADD & EDIT) */}
      {showTopicModal && (
        <TopicModal
          editingTopic={editingTopic}
          onClose={() => { setShowTopicModal(false); setEditingTopic(null); }}
          onSave={handleSaveTopic}
        />
      )}

      {/* DETAILED ESSAYS DRAWER */}
      {selectedTopic && (
        <EssaysDrawer
          selectedTopic={selectedTopic}
          onClose={() => setSelectedTopic(null)}
          onAddEssay={handleAddEssay}
          onUpdateEssay={handleUpdateEssay}
          onDeleteEssay={handleDeleteEssay}
        />
      )}
    </div>
  )
}
