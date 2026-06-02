// src/pages/admin/components/shadowing/VocabTabContent.tsx

import React, { useState } from "react"
import { PronunciationTopicDetailDto, PronunciationVocabDto } from "@/api/practiceGeneral.api"
import { Plus, Edit2, Trash2 } from "lucide-react"
import "./shadowing-admin.css"

interface VocabTabContentProps {
  topicDetail: PronunciationTopicDetailDto
  onAddVocab: (data: { word: string; ipa: string; meaning: string; audioUrl?: string; example: string; exampleTranslation: string }) => Promise<void>
  onUpdateVocab: (vocabId: string, data: { word: string; ipa: string; meaning: string; audioUrl?: string; example: string; exampleTranslation: string }) => Promise<void>
  onDeleteVocab: (vocabId: string) => Promise<void>
}

export default function VocabTabContent({
  topicDetail,
  onAddVocab,
  onUpdateVocab,
  onDeleteVocab
}: VocabTabContentProps) {
  const [showVocabForm, setShowVocabForm] = useState(false)
  const [editingVocab, setEditingVocab] = useState<PronunciationVocabDto | null>(null)

  // Form states
  const [vocabWord, setVocabWord] = useState("")
  const [vocabIpa, setVocabIpa] = useState("")
  const [vocabMeaning, setVocabMeaning] = useState("")
  const [vocabAudioUrl, setVocabAudioUrl] = useState("")
  const [vocabExample, setVocabExample] = useState("")
  const [vocabExampleTranslation, setVocabExampleTranslation] = useState("")
  const [saving, setSaving] = useState(false)

  const openAddForm = () => {
    setEditingVocab(null)
    setVocabWord("")
    setVocabIpa("")
    setVocabMeaning("")
    setVocabAudioUrl("")
    setVocabExample("")
    setVocabExampleTranslation("")
    setShowVocabForm(true)
  }

  const openEditForm = (v: PronunciationVocabDto) => {
    setEditingVocab(v)
    setVocabWord(v.word)
    setVocabIpa(v.ipa)
    setVocabMeaning(v.meaning)
    setVocabAudioUrl(v.audioUrl || "")
    setVocabExample(v.example)
    setVocabExampleTranslation(v.exampleTranslation)
    setShowVocabForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!vocabWord.trim() || !vocabIpa.trim() || !vocabMeaning.trim()) return

    setSaving(true)
    try {
      const payload = {
        word: vocabWord.trim(),
        ipa: vocabIpa.trim(),
        meaning: vocabMeaning.trim(),
        audioUrl: vocabAudioUrl.trim() ? vocabAudioUrl.trim() : undefined,
        example: vocabExample.trim(),
        exampleTranslation: vocabExampleTranslation.trim()
      }

      if (editingVocab) {
        await onUpdateVocab(editingVocab.id, payload)
      } else {
        await onAddVocab(payload)
      }
      setShowVocabForm(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {!showVocabForm ? (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="shadowing-admin-label">Từ vựng cốt lõi ({topicDetail.vocabs.length})</span>
            <button
              onClick={openAddForm}
              className="shadowing-admin-create-btn"
              style={{ padding: "6px 12px", fontSize: "11px" }}
            >
              <Plus size={12} /> Thêm từ vựng
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {topicDetail.vocabs.length === 0 ? (
              <div style={{ textAlign: "center", color: "#6b7280", padding: "16px 0", fontSize: "13px" }}>
                Chưa có từ vựng nào được thêm vào bài học.
              </div>
            ) : (
              topicDetail.vocabs.map((vocab) => (
                <div key={vocab.id} className="shadowing-admin-timeline-row-wide">
                  <div>
                    <span style={{ fontWeight: 800, color: "#111827", fontSize: "14px" }}>{vocab.word}</span>
                    <span style={{ fontStyle: "italic", color: "#2563eb", marginLeft: "8px", fontSize: "12px" }}>{vocab.ipa}</span>
                    <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#4b5563" }}><strong>Nghĩa:</strong> {vocab.meaning}</p>
                  </div>
                  <div style={{ fontSize: "11px", color: "#94a3b8", fontStyle: "italic" }}>
                    {vocab.example ? `"${vocab.example.slice(0, 30)}..."` : "Không có ví dụ"}
                  </div>
                  <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                    <button
                      onClick={() => openEditForm(vocab)}
                      className="shadowing-admin-tab-button"
                      style={{ border: "none", background: "#f3f4f6", padding: "5px", borderRadius: "4px", color: "#4b5563" }}
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Bạn có chắc chắn muốn xóa từ vựng này khỏi bài học?")) {
                          onDeleteVocab(vocab.id)
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
              {editingVocab ? "Sửa Từ Vựng" : "Thêm Từ Vựng Mới"}
            </span>
            <button type="button" onClick={() => setShowVocabForm(false)} className="shadowing-admin-tab-button" style={{ padding: "4px 8px", fontSize: "11px", fontWeight: 700, background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px" }}>Quay lại</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className="shadowing-admin-form-group">
              <label className="shadowing-admin-label">Từ vựng</label>
              <input type="text" required value={vocabWord} onChange={(e) => setVocabWord(e.target.value)} className="shadowing-admin-text-input" />
            </div>
            <div className="shadowing-admin-form-group">
              <label className="shadowing-admin-label">Phiên âm IPA</label>
              <input type="text" required value={vocabIpa} onChange={(e) => setVocabIpa(e.target.value)} placeholder="/.../" className="shadowing-admin-text-input" />
            </div>
          </div>

          <div className="shadowing-admin-form-group">
            <label className="shadowing-admin-label">Ý nghĩa tiếng Việt</label>
            <input type="text" required value={vocabMeaning} onChange={(e) => setVocabMeaning(e.target.value)} className="shadowing-admin-text-input" />
          </div>

          <div className="shadowing-admin-form-group">
            <label className="shadowing-admin-label">Audio URL</label>
            <input type="url" value={vocabAudioUrl} onChange={(e) => setVocabAudioUrl(e.target.value)} placeholder="Link âm thanh phát âm mẫu" className="shadowing-admin-text-input" />
          </div>

          <div className="shadowing-admin-form-group">
            <label className="shadowing-admin-label">Câu ví dụ tiếng Anh</label>
            <input type="text" required value={vocabExample} onChange={(e) => setVocabExample(e.target.value)} className="shadowing-admin-text-input" />
          </div>

          <div className="shadowing-admin-form-group">
            <label className="shadowing-admin-label">Dịch câu ví dụ</label>
            <input type="text" required value={vocabExampleTranslation} onChange={(e) => setVocabExampleTranslation(e.target.value)} className="shadowing-admin-text-input" />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid #e5e7eb", paddingTop: "12px" }}>
            <button type="submit" disabled={saving} className="shadowing-admin-create-btn" style={{ background: "#16a34a", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Đang lưu..." : "Lưu Từ Vựng"}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
