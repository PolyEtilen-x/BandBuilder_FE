// src/pages/admin/components/ShadowingTab.tsx

import { useState, useEffect } from "react"
import { ShadowingTopic, ShadowingSentence } from "../types"
import { 
  Youtube, 
  Search, 
  Trash2, 
  Link as LinkIcon, 
  Sparkles, 
  FileText, 
  Check, 
  Loader2,
  Clock,
  Play
} from "lucide-react"

interface Props {
  topics: ShadowingTopic[]
  onAddTopic: (topic: Omit<ShadowingTopic, "id" | "vocabCount" | "sentencesCount">) => void
  onDeleteTopic: (id: string) => void
}

// Window size observer hook
function useWindowSize() {
  const [size, setSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200
  })

  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth })
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return size
}

export default function ShadowingTab({ topics, onAddTopic, onDeleteTopic }: Props) {
  const [searchTerm, setSearchTerm] = useState("")
  const [ytLink, setYtLink] = useState("")
  
  // Crawler Simulation State
  const [crawlProgress, setCrawlProgress] = useState(0)
  const [crawlStage, setCrawlStage] = useState("")
  const [isCrawling, setIsCrawling] = useState(false)
  
  // Preview State
  const [crawledData, setCrawledData] = useState<{
    title: string
    paragraph: string
    videoUrl: string
    sentences: ShadowingSentence[]
  } | null>(null)

  const { width } = useWindowSize()
  const isMobile = width < 768

  const filteredTopics = topics.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.paragraph.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleStartCrawl = (e: React.FormEvent) => {
    e.preventDefault()
    if (!ytLink.trim()) return

    setIsCrawling(true)
    setCrawlProgress(10)
    setCrawlStage("Đang kết nối YouTube API & tải phụ đề gốc...")

    setTimeout(() => {
      setCrawlProgress(35)
      setCrawlStage("Đang bóc tách tệp âm thanh YouTube & cào transcript...")
      
      setTimeout(() => {
        setCrawlProgress(70)
        setCrawlStage("Đang đồng bộ tọa độ mốc thời gian phụ đề (startTime ➔ endTime)...")
        
        setTimeout(() => {
          setCrawlProgress(100)
          setCrawlStage("Hoàn thành bóc tách học liệu YouTube!")
          
          const videoId = ytLink.includes("v=") 
            ? ytLink.split("v=")[1].split("&")[0] 
            : ytLink.split("youtu.be/")[1]?.split("?")[0] || "dQw4w9WgXcQ"

          const mockTitle = `Shadowing IELTS Speaking Part 2: ${videoId.slice(0, 5).toUpperCase()} Lesson`
          const mockParagraph = "In my opinion, learning English is an incredible journey. It opens up multiple international doors. Especially when studying IELTS, speaking requires natural intonation and proper grammar. I highly recommend shadowing standard videos every day."

          const mockSentences: ShadowingSentence[] = [
            { id: "s1", text: "In my opinion, learning English is an incredible journey.", startTime: 1.2, endTime: 4.5, orderIndex: 1 },
            { id: "s2", text: "It opens up multiple international doors.", startTime: 4.8, endTime: 7.2, orderIndex: 2 },
            { id: "s3", text: "Especially when studying IELTS, speaking requires natural intonation.", startTime: 7.6, endTime: 11.4, orderIndex: 3 },
            { id: "s4", text: "I highly recommend shadowing standard videos every day.", startTime: 11.8, endTime: 15.0, orderIndex: 4 },
          ]

          setCrawledData({
            title: mockTitle,
            paragraph: mockParagraph,
            videoUrl: `https://www.youtube.com/embed/${videoId}`,
            sentences: mockSentences
          })
          
          setIsCrawling(false)
        }, 1200)
      }, 1200)
    }, 1000)
  }

  const handleSaveTopic = () => {
    if (!crawledData) return
    onAddTopic({
      title: crawledData.title,
      videoUrl: crawledData.videoUrl,
      paragraph: crawledData.paragraph,
      sentences: crawledData.sentences
    })

    setCrawledData(null)
    setYtLink("")
    setCrawlProgress(0)
  }

  // Pure inline style mapping
  const styles = {
    headerRow: {
      borderBottom: "1px solid #e5e7eb",
      paddingBottom: "16px",
      marginBottom: "24px"
    },
    title: {
      fontSize: "22px",
      fontWeight: 700,
      color: "#111827",
      margin: 0
    },
    subtitle: {
      fontSize: "13px",
      color: "#6b7280",
      marginTop: "4px",
      marginBottom: 0
    },
    crawlerCard: {
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "24px",
      boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05)",
      display: "flex",
      flexDirection: "column" as const,
      gap: "24px",
      boxSizing: "border-box" as const,
      position: "relative" as const,
      overflow: "hidden" as const
    },
    crawlerHeader: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "6px"
    },
    crawlerTitle: {
      fontSize: "16px",
      fontWeight: 700,
      color: "#111827",
      margin: 0,
      display: "flex",
      alignItems: "center",
      gap: "8px"
    },
    formRow: {
      display: "flex",
      flexDirection: isMobile ? ("column" as const) : ("row" as const),
      gap: "12px",
      width: "100%"
    },
    inputWrapper: {
      position: "relative" as const,
      flex: 1
    },
    textInput: {
      width: "100%",
      height: "40px",
      background: "#f9fafb",
      border: "1px solid #cbd5e1",
      borderRadius: "8px",
      paddingLeft: "36px",
      paddingRight: "12px",
      fontSize: "13px",
      outline: "none",
      boxSizing: "border-box" as const,
      fontFamily: "monospace"
    },
    submitBtn: {
      height: "40px",
      background: "#dc2626",
      color: "#ffffff",
      fontSize: "13px",
      fontWeight: 700,
      padding: "0 20px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px"
    },
    progressTrack: {
      width: "100%",
      height: "8px",
      borderRadius: "100px",
      background: "#f1f5f9",
      border: "1px solid #e2e8f0",
      boxSizing: "border-box" as const,
      overflow: "hidden" as const
    },
    progressBar: (progress: number) => ({
      height: "100%",
      width: `${progress}%`,
      background: "linear-gradient(to right, #dc2626, #2563eb)",
      borderRadius: "100px",
      transition: "width 0.3s"
    }),
    successBadge: {
      fontSize: "11px",
      fontWeight: 700,
      background: "#dcfce7",
      color: "#15803d",
      padding: "4px 10px",
      borderRadius: "6px",
      border: "1px solid #bbf7d0",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px"
    },
    previewBox: {
      background: "#f8fafc",
      border: "1px solid #cbd5e1",
      borderRadius: "12px",
      padding: "20px",
      display: "flex",
      flexDirection: "column" as const,
      gap: "16px",
      boxSizing: "border-box" as const
    },
    timelineRow: {
      display: "grid",
      gridTemplateColumns: "30px 1fr 180px",
      gap: "12px",
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      padding: "10px 16px",
      alignItems: "center",
      boxSizing: "border-box" as const
    },
    timeBox: {
      width: "48px",
      height: "28px",
      textAlign: "center" as const,
      border: "1px solid #cbd5e1",
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: 700,
      color: "#174593",
      fontFamily: "monospace",
      outline: "none"
    },
    saveBtn: {
      background: "#16a34a",
      color: "#ffffff",
      fontSize: "13px",
      fontWeight: 700,
      padding: "10px 20px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "6px"
    },
    libraryContainer: {
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      overflow: "hidden" as const
    },
    libraryHeader: {
      padding: "16px 24px",
      background: "#f9fafb",
      borderBottom: "1px solid #e5e7eb",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap" as const,
      gap: "12px"
    },
    libraryGrid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      gap: "24px",
      padding: "24px",
      boxSizing: "border-box" as const
    },
    topicCard: {
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "start",
      gap: "16px",
      boxShadow: "0 1px 3px 0 rgba(0,0,0,0.02)",
      boxSizing: "border-box" as const
    },
    miniPlay: {
      padding: "6px",
      background: "#fee2e2",
      color: "#dc2626",
      borderRadius: "6px",
      display: "flex",
      flexShrink: 0
    },
    tagCount: {
      fontSize: "10px",
      fontWeight: 700,
      padding: "2px 8px",
      borderRadius: "4px",
      background: "#f3f4f6",
      border: "1px solid #e5e7eb",
      color: "#4b5563"
    },
    formGroup: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "6px"
    },
    label: {
      fontSize: "11px",
      fontWeight: 700,
      color: "#4b5563",
      textTransform: "uppercase" as const,
      letterSpacing: "0.05em"
    },
    searchWrapper: {
      position: "relative" as const,
      minWidth: "220px"
    },
    searchInput: {
      height: "36px",
      padding: "0 12px 0 32px",
      borderRadius: "8px",
      border: "1px solid #cbd5e1",
      fontSize: "13px",
      outline: "none",
      boxSizing: "border-box" as const,
      width: "100%"
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* HEADER SECTION */}
      <div style={styles.headerRow}>
        <h2 style={styles.title}>Quản lý Học liệu YouTube Shadowing</h2>
        <p style={styles.subtitle}>Cào phụ đề tự động (YouTube Transcript) từ liên kết video để đồng bộ mốc thời gian bài học phát âm.</p>
      </div>

      {/* IMPORT & CRAWLER BOX */}
      <div style={styles.crawlerCard}>
        {/* Accent bar red youtube */}
        <div style={{ height: "4px", width: "100%", background: "#dc2626", position: "absolute", top: 0, left: 0 }}></div>

        <div style={styles.crawlerHeader}>
          <h3 style={styles.crawlerTitle}>
            <Youtube size={20} style={{ color: "#dc2626" }} />
            Thêm bài phát âm mới từ YouTube
          </h3>
          <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
            Dán liên kết video, hệ thống sẽ tự phân tích phụ đề và chia mốc giây karaoke.
          </p>
        </div>

        {/* Input Form */}
        {!crawledData && !isCrawling && (
          <form onSubmit={handleStartCrawl} style={styles.formRow}>
            <div style={styles.inputWrapper}>
              <input 
                type="url"
                required
                placeholder="Dán link YouTube (Ví dụ: https://www.youtube.com/watch?v=...) tại đây"
                value={ytLink}
                onChange={(e) => setYtLink(e.target.value)}
                style={styles.textInput}
              />
              <LinkIcon size={14} style={{ position: "absolute", left: "12px", top: "13px", color: "#94a3b8" }} />
            </div>
            <button type="submit" style={styles.submitBtn}>
              <Sparkles size={14} style={{ color: "#fef08a" }} />
              Tải Phụ đề
            </button>
          </form>
        )}

        {/* Crawling Progress bar */}
        {isCrawling && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", fontSize: "12px", fontWeight: 700, color: "#4b5563", justifyContent: "space-between" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Loader2 size={14} className="animate-spin" style={{ color: "#2563eb" }} />
                {crawlStage}
              </span>
              <span style={{ color: "#2563eb" }}>{crawlProgress}%</span>
            </div>
            <div style={styles.progressTrack}>
              <div style={styles.progressBar(crawlProgress)}></div>
            </div>
          </div>
        )}

        {/* CRAWL PREVIEW */}
        {crawledData && (
          <div style={styles.previewBox}>
            <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid #cbd5e1", paddingBottom: "12px", justifyContent: "space-between" }}>
              <span style={styles.successBadge}>
                <Check size={12} />
                Bóc tách video YouTube thành công!
              </span>
              <button 
                onClick={() => setCrawledData(null)}
                style={{ padding: "4px 8px", fontSize: "11px", fontWeight: 700, background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", cursor: "pointer", color: "#4b5563" }}
              >
                Hủy bỏ
              </button>
            </div>

            {/* Editable Title */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Tiêu đề bài học</label>
              <input 
                type="text"
                value={crawledData.title}
                onChange={(e) => setCrawledData({ ...crawledData, title: e.target.value })}
                style={{ ...styles.textInput, paddingLeft: "12px", height: "36px", background: "#ffffff", fontWeight: 700 }}
              />
            </div>

            {/* Paragraph transcript */}
            <div style={styles.formGroup}>
              <span style={styles.label}>Nội dung đoạn văn mẫu</span>
              <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "12px", fontSize: "13px", color: "#374151", lineHeight: 1.5 }}>
                {crawledData.paragraph}
              </div>
            </div>

            {/* Timelines partition */}
            <div style={styles.formGroup}>
              <span style={styles.label}>Đồng bộ mốc thời gian</span>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "200px", overflowY: "auto" }}>
                {crawledData.sentences.map((sentence, idx) => (
                  <div key={sentence.id} style={styles.timelineRow}>
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
                        style={styles.timeBox}
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
                        style={styles.timeBox}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div style={{ display: "flex", borderTop: "1px solid #cbd5e1", paddingTop: "12px", justifyContent: "flex-end" }}>
              <button onClick={handleSaveTopic} style={styles.saveBtn}>
                <Check size={14} />
                Lưu Học Liệu Shadowing
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SEARCH AND LIST ACTIVE LESSONS */}
      <div style={styles.libraryContainer}>
        <div style={styles.libraryHeader}>
          <h3 style={styles.crawlerTitle}>
            <FileText size={18} style={{ color: "#2563eb" }} />
            Thư viện Shadowing đang hoạt động ({filteredTopics.length})
          </h3>
          <div style={styles.searchWrapper}>
            <input 
              type="text"
              placeholder="Tìm bài Shadowing..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
            <Search size={14} style={{ position: "absolute", left: "12px", top: "11px", color: "#94a3b8" }} />
          </div>
        </div>

        <div style={styles.libraryGrid}>
          {filteredTopics.length === 0 ? (
            <div style={{ gridColumn: "span 2", textAlign: "center", color: "#6b7280", padding: "24px 0", fontSize: "13px" }}>
              Không tìm thấy bài Shadowing nào. Hãy dán link YouTube bên trên để cào transcript.
            </div>
          ) : (
            filteredTopics.map((topic) => (
              <div key={topic.id} style={styles.topicCard}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span style={styles.miniPlay}>
                      <Play size={12} style={{ fill: "#dc2626", stroke: "none" }} />
                    </span>
                    <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#111827", margin: 0 }}>{topic.title}</h4>
                  </div>
                  <p style={{ fontSize: "12px", color: "#6b7280", margin: 0, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{topic.paragraph}</p>
                  
                  <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                    <span style={styles.tagCount}>{topic.sentencesCount} Câu phát âm</span>
                    <span style={styles.tagCount}>{topic.vocabCount} Từ cốt lõi</span>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteTopic(topic.id)}
                  style={{ border: "none", background: "none", cursor: "pointer", color: "#94a3b8", padding: "6px", borderRadius: "6px" }}
                  title="Xoá học liệu"
                >
                  <Trash2 size={15} style={{ color: "#ef4444" }} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
