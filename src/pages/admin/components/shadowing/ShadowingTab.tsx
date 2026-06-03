// src/pages/admin/components/shadowing/ShadowingTab.tsx

import { useState, useEffect } from "react"
import { ShadowingTopic } from "../../types"
import {
  getPronunciationTopicDetail,
  updatePronunciationTopicAdmin,
  createPronunciationVocabAdmin,
  updatePronunciationVocabAdmin,
  deletePronunciationVocabAdmin,
  createPronunciationSentenceAdmin,
  updatePronunciationSentenceAdmin,
  deletePronunciationSentenceAdmin,
  PronunciationTopicDetailDto
} from "@/api/practice/practiceGeneral.api"
import { FileText, Search, Plus } from "lucide-react"

import ShadowingTopicCard from "./ShadowingTopicCard"
import YoutubeScraperBox from "./YoutubeScraperBox"
import ManualTopicModal from "./ManualTopicModal"
import ShadowingDetailDrawer from "./ShadowingDetailDrawer"
import "./shadowing-admin.css"

interface Props {
  topics: ShadowingTopic[]
  onAddTopic: (topic: Omit<ShadowingTopic, "id" | "vocabCount" | "sentencesCount">) => void
  onDeleteTopic: (id: string) => void
}

export default function ShadowingTab({ topics, onAddTopic, onDeleteTopic }: Props) {
  const [searchTerm, setSearchTerm] = useState("")
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Topic Creation state
  const [showManualModal, setShowManualModal] = useState(false)

  // Side Drawer state for editing a topic in detail
  const [selectedTopicDetail, setSelectedTopicDetail] = useState<PronunciationTopicDetailDto | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const filteredTopics = topics.filter(t =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.paragraph.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleOpenDetail = async (id: string) => {
    try {
      const data = await getPronunciationTopicDetail(id)
      setSelectedTopicDetail(data)
    } catch (e: any) {
      showToast("Lỗi tải chi tiết: " + (e.message || e))
    }
  }

  const handleSaveTopic = async (crawledData: { title: string; paragraph: string; videoUrl: string; sentences: any[] }) => {
    onAddTopic({
      title: crawledData.title,
      videoUrl: crawledData.videoUrl,
      paragraph: crawledData.paragraph,
      sentences: crawledData.sentences
    })
  }

  const handleAddManualTopic = async (data: { title: string; paragraph: string; audioUrl?: string }) => {
    try {
      await onAddTopic({
        title: data.title,
        videoUrl: "",
        audioUrl: data.audioUrl,
        paragraph: data.paragraph,
        sentences: []
      })
      setShowManualModal(false)
      showToast("Đã tạo chủ đề phát âm thủ công thành công!")
    } catch (e: any) {
      showToast("Lỗi tạo chủ đề thủ công: " + (e.message || e))
    }
  }

  const handleUpdateMetadata = async (data: { title: string; paragraph: string; videoUrl?: string | null; audioUrl?: string | null }) => {
    if (!selectedTopicDetail) return
    try {
      await updatePronunciationTopicAdmin(selectedTopicDetail.id, data)
      showToast("Cập nhật thông tin chung thành công!")
      await handleOpenDetail(selectedTopicDetail.id)
    } catch (e: any) {
      showToast("Lỗi cập nhật: " + (e.message || e))
    }
  }

  const handleAddVocab = async (vocabData: { word: string; ipa: string; meaning: string; audioUrl?: string; example: string; exampleTranslation: string }) => {
    if (!selectedTopicDetail) return
    try {
      await createPronunciationVocabAdmin(selectedTopicDetail.id, vocabData)
      showToast("Đã thêm từ vựng mới thành công!")
      await handleOpenDetail(selectedTopicDetail.id)
    } catch (err: any) {
      showToast("Lỗi lưu từ vựng: " + (err.message || err))
    }
  }

  const handleUpdateVocab = async (vocabId: string, vocabData: { word: string; ipa: string; meaning: string; audioUrl?: string; example: string; exampleTranslation: string }) => {
    if (!selectedTopicDetail) return
    try {
      await updatePronunciationVocabAdmin(vocabId, vocabData)
      showToast("Cập nhật từ vựng thành công!")
      await handleOpenDetail(selectedTopicDetail.id)
    } catch (err: any) {
      showToast("Lỗi lưu từ vựng: " + (err.message || err))
    }
  }

  const handleDeleteVocab = async (vocabId: string) => {
    if (!selectedTopicDetail) return
    try {
      await deletePronunciationVocabAdmin(vocabId)
      showToast("Đã xóa từ vựng thành công.")
      await handleOpenDetail(selectedTopicDetail.id)
    } catch (e: any) {
      showToast("Lỗi xóa từ vựng: " + (e.message || e))
    }
  }

  const handleAddSentence = async (sentenceData: { text: string; startTime: number; endTime: number; orderIndex: number }) => {
    if (!selectedTopicDetail) return
    try {
      await createPronunciationSentenceAdmin(selectedTopicDetail.id, sentenceData)
      showToast("Đã thêm câu tương tác mới thành công!")
      await handleOpenDetail(selectedTopicDetail.id)
    } catch (err: any) {
      showToast("Lỗi lưu câu phát âm: " + (err.message || err))
    }
  }

  const handleUpdateSentence = async (sentenceId: string, sentenceData: { text: string; startTime: number; endTime: number; orderIndex: number }) => {
    if (!selectedTopicDetail) return
    try {
      await updatePronunciationSentenceAdmin(sentenceId, sentenceData)
      showToast("Cập nhật câu phát âm thành công!")
      await handleOpenDetail(selectedTopicDetail.id)
    } catch (err: any) {
      showToast("Lỗi lưu câu phát âm: " + (err.message || err))
    }
  }

  const handleDeleteSentence = async (sentenceId: string) => {
    if (!selectedTopicDetail) return
    try {
      await deletePronunciationSentenceAdmin(sentenceId)
      showToast("Đã xóa câu phát âm thành công.")
      await handleOpenDetail(selectedTopicDetail.id)
    } catch (e: any) {
      showToast("Lỗi xóa câu: " + (e.message || e))
    }
  }

  return (
    <div className="shadowing-admin-container">
      {/* GLOBAL TOAST */}
      {toastMessage && (
        <div className="shadowing-admin-toast-container">
          <span style={{ padding: "8px", background: "#eff6ff", color: "#2563eb", borderRadius: "8px", display: "flex" }}>
            <FileText size={16} />
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ fontSize: "10px", color: "#6b7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Pronunciation Admin</span>
            <p style={{ fontSize: "12px", color: "#374151", margin: 0, fontWeight: 500 }}>{toastMessage}</p>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="shadowing-admin-header-row">
        <div>
          <h2 className="shadowing-admin-title">Quản lý Học liệu YouTube Shadowing</h2>
          <p className="shadowing-admin-subtitle">Cào phụ đề tự động (YouTube Transcript) từ liên kết video hoặc thiết kế bài đọc tương tác chi tiết.</p>
        </div>
        <button onClick={() => setShowManualModal(true)} className="shadowing-admin-create-btn">
          <Plus size={16} />
          Thêm đề phát âm thủ công
        </button>
      </div>

      {/* IMPORT & CRAWLER BOX */}
      <YoutubeScraperBox
        onSaveTopic={handleSaveTopic}
        showToast={showToast}
      />

      {/* SEARCH AND LIST ACTIVE LESSONS */}
      <div className="shadowing-admin-library-container">
        <div className="shadowing-admin-library-header">
          <h3 className="shadowing-admin-crawler-title">
            <FileText size={18} style={{ color: "#2563eb" }} />
            Thư viện Shadowing đang hoạt động ({filteredTopics.length})
          </h3>
          <div className="shadowing-admin-search-wrapper">
            <input
              type="text"
              placeholder="Tìm bài Shadowing..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="shadowing-admin-search-input"
            />
            <Search size={14} style={{ position: "absolute", left: "12px", top: "11px", color: "#94a3b8" }} />
          </div>
        </div>

        <div className="shadowing-admin-library-grid">
          {filteredTopics.length === 0 ? (
            <div style={{ gridColumn: "span 2", textAlign: "center", color: "#6b7280", padding: "24px 0", fontSize: "13px" }}>
              Không tìm thấy bài Shadowing nào. Hãy dán link YouTube bên trên để cào transcript.
            </div>
          ) : (
            filteredTopics.map((topic) => (
              <ShadowingTopicCard
                key={topic.id}
                topic={topic}
                onClick={() => handleOpenDetail(topic.id)}
                onDelete={(id, title) => {
                  if (confirm(`Bạn có chắc chắn muốn xóa bài phát âm: ${title}?`)) {
                    onDeleteTopic(id)
                  }
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* MANUAL TOPIC MODAL */}
      {showManualModal && (
        <ManualTopicModal
          onClose={() => setShowManualModal(false)}
          onSave={handleAddManualTopic}
        />
      )}

      {/* TOPIC EDITOR DRAWER */}
      {selectedTopicDetail && (
        <ShadowingDetailDrawer
          topicDetail={selectedTopicDetail}
          onClose={() => setSelectedTopicDetail(null)}
          onUpdateMetadata={handleUpdateMetadata}
          onAddVocab={handleAddVocab}
          onUpdateVocab={handleUpdateVocab}
          onDeleteVocab={handleDeleteVocab}
          onAddSentence={handleAddSentence}
          onUpdateSentence={handleUpdateSentence}
          onDeleteSentence={handleDeleteSentence}
        />
      )}
    </div>
  )
}
