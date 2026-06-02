// src/pages/admin/components/shadowing/YoutubeScraperBox.tsx

import React, { useState } from "react"
import { scrapeYoutubeTranscriptAdmin } from "@/api/practiceGeneral.api"
import { ShadowingSentence } from "../../types"
import { Youtube, Link as LinkIcon, Sparkles, Loader2, Check, Clock } from "lucide-react"
import "./shadowing-admin.css"

interface YoutubeScraperBoxProps {
  onSaveTopic: (data: { title: string; paragraph: string; videoUrl: string; sentences: Omit<ShadowingSentence, "id">[] }) => Promise<void>
  showToast: (msg: string) => void
}

export default function YoutubeScraperBox({
  onSaveTopic,
  showToast
}: YoutubeScraperBoxProps) {
  const [ytLink, setYtLink] = useState("")
  const [isCrawling, setIsCrawling] = useState(false)
  const [crawlStage, setCrawlStage] = useState("")
  const [crawledData, setCrawledData] = useState<{
    title: string
    paragraph: string
    videoUrl: string
    sentences: Omit<ShadowingSentence, "id">[]
  } | null>(null)

  const handleStartCrawl = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ytLink.trim()) return

    setIsCrawling(true)
    setCrawlStage("Đang cào phụ đề YouTube từ hệ thống...")

    try {
      const data = await scrapeYoutubeTranscriptAdmin(ytLink.trim())
      setCrawledData({
        title: data.title,
        paragraph: data.paragraph,
        videoUrl: ytLink.trim(),
        sentences: data.sentences.map((s: any) => ({
          text: s.text,
          startTime: s.startTime,
          endTime: s.endTime,
          orderIndex: s.orderIndex
        }))
      })
      showToast("Cào phụ đề YouTube thành công!")
    } catch (err: any) {
      showToast("Lỗi cào phụ đề: " + (err.message || err))
    } finally {
      setIsCrawling(false)
    }
  }

  const handleSave = async () => {
    if (!crawledData) return
    try {
      await onSaveTopic(crawledData)
      setCrawledData(null)
      setYtLink("")
    } catch (e: any) {
      showToast("Lỗi lưu học liệu: " + (e.message || e))
    }
  }

  return (
    <div className="shadowing-admin-crawler-card">
      <div style={{ height: "4px", width: "100%", background: "#dc2626", position: "absolute", top: 0, left: 0 }}></div>

      <div className="shadowing-admin-crawler-header">
        <h3 className="shadowing-admin-crawler-title">
          <Youtube size={20} style={{ color: "#dc2626" }} />
          Thêm bài phát âm mới từ YouTube
        </h3>
        <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
          Dán liên kết video, hệ thống sẽ cào phụ đề thực tế và chia mốc giây karaoke tự động.
        </p>
      </div>

      {!crawledData && !isCrawling && (
        <form onSubmit={handleStartCrawl} className="shadowing-admin-form-row">
          <div className="shadowing-admin-input-wrapper">
            <input
              type="url"
              required
              placeholder="Dán link YouTube (Ví dụ: https://www.youtube.com/watch?v=...) tại đây"
              value={ytLink}
              onChange={(e) => setYtLink(e.target.value)}
              className="shadowing-admin-text-input"
            />
            <LinkIcon size={14} style={{ position: "absolute", left: "12px", top: "13px", color: "#94a3b8" }} />
          </div>
          <button type="submit" className="shadowing-admin-submit-btn">
            <Sparkles size={14} style={{ color: "#fef08a" }} />
            Tải Phụ đề
          </button>
        </form>
      )}

      {isCrawling && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "16px 0", color: "#4b5563" }}>
          <Loader2 size={18} className="animate-spin" style={{ color: "#dc2626" }} />
          <span style={{ fontSize: "13px", fontWeight: 700 }}>{crawlStage}</span>
        </div>
      )}

      {crawledData && (
        <div className="shadowing-admin-preview-box">
          <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid #cbd5e1", paddingBottom: "12px", justifyContent: "space-between" }}>
            <span className="shadowing-admin-success-badge">
              <Check size={12} />
              Đã cào phụ đề YouTube thành công!
            </span>
            <button
              onClick={() => setCrawledData(null)}
              className="shadowing-admin-tab-button"
              style={{ padding: "4px 8px", fontSize: "11px", fontWeight: 700, background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px" }}
            >
              Hủy bỏ
            </button>
          </div>

          <div className="shadowing-admin-form-group">
            <label className="shadowing-admin-label">Tiêu đề bài học</label>
            <input
              type="text"
              value={crawledData.title}
              onChange={(e) => setCrawledData({ ...crawledData, title: e.target.value })}
              className="shadowing-admin-text-input"
              style={{ paddingLeft: "12px", height: "36px", background: "#ffffff", fontWeight: 700 }}
            />
          </div>

          <div className="shadowing-admin-form-group">
            <span className="shadowing-admin-label">Nội dung đoạn văn mẫu</span>
            <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "12px", fontSize: "13px", color: "#374151", lineHeight: 1.5, maxHeight: "150px", overflowY: "auto" }}>
              {crawledData.paragraph}
            </div>
          </div>

          <div className="shadowing-admin-form-group">
            <span className="shadowing-admin-label">Đồng bộ mốc thời gian</span>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "250px", overflowY: "auto" }}>
              {crawledData.sentences.map((sentence, idx) => (
                <div key={idx} className="shadowing-admin-timeline-row">
                  <span style={{ fontSize: "11px", fontWeight: 750, color: "#6b7280" }}>#{idx + 1}</span>
                  <input
                    type="text"
                    value={sentence.text}
                    onChange={(e) => {
                      const newS = [...crawledData.sentences]
                      newS[idx].text = e.target.value
                      setCrawledData({ ...crawledData, sentences: newS })
                    }}
                    style={{ border: "none", background: "transparent", fontSize: "12px", outline: "none", color: "#1f2937", fontWeight: 500 }}
                  />
                  <div style={{ display: "flex", gap: "4px", alignItems: "center", justifyContent: "flex-end" }}>
                    <Clock size={12} style={{ color: "#94a3b8" }} />
                    <input
                      type="number"
                      step="0.1"
                      value={sentence.startTime}
                      onChange={(e) => {
                        const newS = [...crawledData.sentences]
                        newS[idx].startTime = parseFloat(e.target.value) || 0
                        setCrawledData({ ...crawledData, sentences: newS })
                      }}
                      className="shadowing-admin-time-box"
                    />
                    <span style={{ fontSize: "10px", color: "#cbd5e1" }}>➔</span>
                    <input
                      type="number"
                      step="0.1"
                      value={sentence.endTime}
                      onChange={(e) => {
                        const newS = [...crawledData.sentences]
                        newS[idx].endTime = parseFloat(e.target.value) || 0
                        setCrawledData({ ...crawledData, sentences: newS })
                      }}
                      className="shadowing-admin-time-box"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", borderTop: "1px solid #cbd5e1", paddingTop: "12px", justifyContent: "flex-end" }}>
            <button onClick={handleSave} className="shadowing-admin-save-btn">
              <Check size={14} />
              Lưu Học Liệu Shadowing
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
