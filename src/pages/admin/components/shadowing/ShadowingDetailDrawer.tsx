// src/pages/admin/components/shadowing/ShadowingDetailDrawer.tsx

import React, { useState } from "react"
import { PronunciationTopicDetailDto } from "@/api/practice/practiceGeneral.api"
import { X } from "lucide-react"
import VocabTabContent from "./VocabTabContent"
import SentenceTabContent from "./SentenceTabContent"
import "./shadowing-admin.css"

interface ShadowingDetailDrawerProps {
  topicDetail: PronunciationTopicDetailDto
  onClose: () => void
  onUpdateMetadata: (data: { title: string; paragraph: string; videoUrl?: string | null; audioUrl?: string | null }) => Promise<void>
  onAddVocab: (data: { word: string; ipa: string; meaning: string; audioUrl?: string; example: string; exampleTranslation: string }) => Promise<void>
  onUpdateVocab: (vocabId: string, data: { word: string; ipa: string; meaning: string; audioUrl?: string; example: string; exampleTranslation: string }) => Promise<void>
  onDeleteVocab: (vocabId: string) => Promise<void>
  onAddSentence: (data: { text: string; startTime: number; endTime: number; orderIndex: number }) => Promise<void>
  onUpdateSentence: (sentenceId: string, data: { text: string; startTime: number; endTime: number; orderIndex: number }) => Promise<void>
  onDeleteSentence: (sentenceId: string) => Promise<void>
}

export default function ShadowingDetailDrawer({
  topicDetail,
  onClose,
  onUpdateMetadata,
  onAddVocab,
  onUpdateVocab,
  onDeleteVocab,
  onAddSentence,
  onUpdateSentence,
  onDeleteSentence
}: ShadowingDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<"general" | "vocabs" | "sentences">("general")

  // Topic Metadata Form state
  const [topicTitle, setTopicTitle] = useState(topicDetail.title)
  const [topicParagraph, setTopicParagraph] = useState(topicDetail.paragraph)
  const [topicVideoUrl, setTopicVideoUrl] = useState(topicDetail.videoUrl || "")
  const [topicAudioUrl, setTopicAudioUrl] = useState(topicDetail.audioUrl || "")
  const [savingMeta, setSavingMeta] = useState(false)

  const handleSaveMetadata = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topicTitle.trim() || !topicParagraph.trim()) return

    setSavingMeta(true)
    try {
      await onUpdateMetadata({
        title: topicTitle.trim(),
        paragraph: topicParagraph.trim(),
        videoUrl: topicVideoUrl.trim() ? topicVideoUrl.trim() : null,
        audioUrl: topicAudioUrl.trim() ? topicAudioUrl.trim() : null
      })
    } finally {
      setSavingMeta(false)
    }
  }

  return (
    <div className="shadowing-admin-modal-overlay" onClick={onClose}>
      <div className="shadowing-admin-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="shadowing-admin-library-header" style={{ padding: "18px 24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#111827", margin: 0 }}>Biên Tập Bài Luyện Phát Âm</h3>
            <span style={{ fontSize: "11px", color: "#6b7280", fontStyle: "italic", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "500px" }}>
              Chủ đề: {topicDetail.title}
            </span>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
            <X size={18} />
          </button>
        </div>

        {/* TAB SELECTOR */}
        <div style={{ display: "flex", gap: "6px", background: "#f3f4f6", padding: "6px 12px", borderBottom: "1px solid #e5e7eb" }}>
          <button onClick={() => setActiveTab("general")} className={`shadowing-admin-tab-button ${activeTab === "general" ? "shadowing-admin-tab-button-active" : ""}`}>Thông tin chung</button>
          <button onClick={() => setActiveTab("vocabs")} className={`shadowing-admin-tab-button ${activeTab === "vocabs" ? "shadowing-admin-tab-button-active" : ""}`}>Từ vựng ({topicDetail.vocabs.length})</button>
          <button onClick={() => setActiveTab("sentences")} className={`shadowing-admin-tab-button ${activeTab === "sentences" ? "shadowing-admin-tab-button-active" : ""}`}>Câu tương tác ({topicDetail.sentences.length})</button>
        </div>

        {/* DRAWER BODY */}
        <div style={{ flex: 1, padding: "24px", overflowY: "auto", boxSizing: "border-box" }}>
          {activeTab === "general" && (
            <form onSubmit={handleSaveMetadata} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="shadowing-admin-form-group">
                <label className="shadowing-admin-label">Tiêu đề chủ đề</label>
                <input
                  type="text"
                  required
                  value={topicTitle}
                  onChange={(e) => setTopicTitle(e.target.value)}
                  className="shadowing-admin-text-input"
                />
              </div>

              <div className="shadowing-admin-form-group">
                <label className="shadowing-admin-label">Nội dung đoạn văn luyện đọc (Paragraph)</label>
                <textarea
                  required
                  value={topicParagraph}
                  onChange={(e) => setTopicParagraph(e.target.value)}
                  className="shadowing-admin-textarea"
                  style={{ minHeight: "120px" }}
                />
              </div>

              <div className="shadowing-admin-form-group">
                <label className="shadowing-admin-label">YouTube Video URL</label>
                <input
                  type="url"
                  value={topicVideoUrl}
                  onChange={(e) => setTopicVideoUrl(e.target.value)}
                  placeholder="Dán link YouTube (đổi link sẽ tự dọn phụ đề cũ và cào phụ đề mới)"
                  className="shadowing-admin-text-input"
                />
              </div>

              <div className="shadowing-admin-form-group">
                <label className="shadowing-admin-label">Backup Audio URL</label>
                <input
                  type="url"
                  value={topicAudioUrl}
                  onChange={(e) => setTopicAudioUrl(e.target.value)}
                  placeholder="Đường dẫn file âm thanh backup (mp3)"
                  className="shadowing-admin-text-input"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid #e5e7eb", paddingTop: "16px" }}>
                <button type="submit" disabled={savingMeta} className="shadowing-admin-save-btn" style={{ opacity: savingMeta ? 0.7 : 1 }}>
                  {savingMeta ? "Đang lưu..." : "Lưu Thay Đổi"}
                </button>
              </div>
            </form>
          )}

          {activeTab === "vocabs" && (
            <VocabTabContent
              topicDetail={topicDetail}
              onAddVocab={onAddVocab}
              onUpdateVocab={onUpdateVocab}
              onDeleteVocab={onDeleteVocab}
            />
          )}

          {activeTab === "sentences" && (
            <SentenceTabContent
              topicDetail={topicDetail}
              onAddSentence={onAddSentence}
              onUpdateSentence={onUpdateSentence}
              onDeleteSentence={onDeleteSentence}
            />
          )}
        </div>
      </div>
    </div>
  )
}
