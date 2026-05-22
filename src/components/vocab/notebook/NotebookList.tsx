import { useVocabStore } from "@/services/dictionary/vocab.store"
import "@/components/vocab/topic/topic_list/style.css"

type Props = {
  onSelectDate: (date: string) => void
}

/**
 * Renders a grid of saved dates (Client State from Zustand) matching TopicList styling.
 */
export default function NotebookList({ onSelectDate }: Props): React.ReactElement {
  const savedWords = useVocabStore((state) => state.savedWords)

  // Helper to extract local date portion (YYYY-MM-DD)
  const getLocalDateString = (isoString: string | null): string => {
    if (!isoString) {
      return new Date().toISOString().split("T")[0]
    }
    try {
      const d = new Date(isoString)
      if (isNaN(d.getTime())) {
        return new Date().toISOString().split("T")[0]
      }
      const yyyy = d.getFullYear()
      const mm = String(d.getMonth() + 1).padStart(2, "0")
      const dd = String(d.getDate()).padStart(2, "0")
      return `${yyyy}-${mm}-${dd}`
    } catch {
      return new Date().toISOString().split("T")[0]
    }
  }

  // Format local date string into human-readable format
  const formatHumanDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return dateStr
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return dateStr
    }
  }

  // Group saved words by local date string
  const grouped: Record<string, typeof savedWords> = {}
  savedWords.forEach((word) => {
    const dateKey = getLocalDateString(word.dateSaved)
    if (!grouped[dateKey]) {
      grouped[dateKey] = []
    }
    grouped[dateKey].push(word)
  })

  // Sort dates descending (newest first)
  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  )

  // 1. EMPTY STATE
  if (savedWords.length === 0) {
    return (
      <div className="topic-container" style={{ height: "100%", overflowY: "auto" }}>
        <h1 className="topic-title">My Notebook</h1>
        <div 
          style={{ 
            background: "#ffffff", 
            borderRadius: "16px", 
            padding: "48px 24px", 
            border: "1px solid #e6eaf0",
            boxShadow: "0 4px 20px rgba(23, 69, 147, 0.05)",
            maxWidth: "500px",
            margin: "60px auto",
            textAlign: "center"
          }}
        >
          <div style={{ fontSize: "56px", marginBottom: "20px" }}>📓</div>
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1e293b", marginBottom: "8px" }}>
            Notebook của bạn đang trống
          </h3>
          <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.6, margin: 0 }}>
            Không có từ vựng nào được lưu. Hãy dùng công cụ tra từ điển khi luyện tập các kỹ năng Listening hoặc Reading để lưu các từ mới vào đây nhé!
          </p>
        </div>
      </div>
    )
  }

  // 2. GRID LIST VIEW
  return (
    <div className="topic-container">
      <h1 className="topic-title">My Notebook</h1>
      <div className="topic-grid">
        {sortedDates.map((dateKey) => {
          const count = grouped[dateKey].length
          return (
            <div
              key={dateKey}
              className="topic-card"
              onClick={() => onSelectDate(dateKey)}
            >
              <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#1e293b", marginBottom: "10px" }}>
                {formatHumanDate(dateKey)}
              </h2>

              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "100%" }} />
              </div>

              <p className="topic-info">
                {count} {count === 1 ? "từ" : "từ"} đã lưu
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
