import { useVocabStore } from "@/services/dictionary/vocab.store"
import "@/components/vocab/topic/topic_details/style.css"

type Props = {
  date: string
  onBack: () => void
}

/**
 * Renders the saved words for a selected date with premium options matching TopicDetail styling.
 */
export default function NotebookDetail({ date, onBack }: Props): React.ReactElement {
  const savedWords = useVocabStore((state) => state.savedWords)
  const removeWord = useVocabStore((state) => state.removeWord)

  // Helper to extract local date portion (YYYY-MM-DD)
  const getLocalDateString = (isoString: string | null): string => {
    if (!isoString) return ""
    try {
      const d = new Date(isoString)
      if (isNaN(d.getTime())) return ""
      const yyyy = d.getFullYear()
      const mm = String(d.getMonth() + 1).padStart(2, "0")
      const dd = String(d.getDate()).padStart(2, "0")
      return `${yyyy}-${mm}-${dd}`
    } catch {
      return ""
    }
  }

  // Format local date string into human-readable format
  const formatHumanDate = (dateStr: string): string => {
    try {
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return dateStr
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return dateStr
    }
  }

  // Filter words belonging to the selected local date
  const wordsForDate = savedWords.filter(
    (w) => getLocalDateString(w.dateSaved) === date
  )

  // Play audio utilizing the cached URL, fallback to speech synthesis
  const playAudio = (word: string, audioUrl?: string): void => {
    if (audioUrl) {
      const audio = new Audio(audioUrl)
      audio.play().catch((err) => {
        console.error("Audio play failed, falling back to speech synthesis:", err)
        speak(word)
      })
    } else {
      speak(word)
    }
  }

  // Speech Synthesis fallback pronunciation
  const speak = (word: string): void => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const voices = window.speechSynthesis.getVoices()
    const voice = voices.find((v) => v.lang === "en-US")
    const utterance = new SpeechSynthesisUtterance(word)
    utterance.voice = voice || null
    utterance.rate = 0.9
    window.speechSynthesis.speak(utterance)
  }

  const handleRemove = (word: string): void => {
    removeWord(word)

    // Check if there will be any remaining words for this date
    const remaining = savedWords.filter(
      (w) => w.word.toLowerCase() !== word.toLowerCase() && getLocalDateString(w.dateSaved) === date
    )

    // If no words are left, automatically navigate back to the list
    if (remaining.length === 0) {
      onBack()
    }
  }

  if (wordsForDate.length === 0) {
    return (
      <div className="vocab-content">
        <div className="detail-header">
          <button onClick={onBack}>← Quay lại</button>
        </div>
        <p style={{ textAlign: "center", color: "#64748b", marginTop: "40px" }}>
          Không tìm thấy từ vựng nào cho ngày này.
        </p>
      </div>
    )
  }

  return (
    <div className="vocab-content" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="detail-header" style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 className="detail-title" style={{ margin: 0, fontSize: "20px" }}>
          Từ đã lưu ngày {formatHumanDate(date)}
        </h2>
        <button
          onClick={onBack}
          style={{
            background: "#f1f5ff",
            color: "#174593",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s"
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = "#e2ebff" }}
          onMouseOut={(e) => { e.currentTarget.style.background = "#f1f5ff" }}
        >
          ← Quay lại
        </button>
      </div>

      <div className="detail-container">
        {wordsForDate.map((w) => (
          <div key={w.word} className="word-card">
            {/* LEFT - CONTENT */}
            <div className="word-content">
              <div className="word-top">
                <h3 style={{ textTransform: "capitalize" }}>{w.word}</h3>
                <button
                  className="audio-btn"
                  onClick={() => playAudio(w.word, w.audio)}
                  title="Nghe phát âm"
                >
                  🔊
                </button>
              </div>

              {w.phonetic && <span className="pronunciation">[{w.phonetic}]</span>}

              <p className="meaning" style={{ fontWeight: 600, color: "#1e293b", margin: "8px 0 4px 0" }}>
                Nghĩa tiếng Việt: <span style={{ color: "#174593", fontWeight: 700 }}>{w.explainVN}</span>
              </p>

              {w.meaning && w.meaning !== "Definition not found" && (
                <p className="meaning-eng" style={{ fontSize: "13px", color: "#475569", margin: "4px 0" }}>
                  <strong>Định nghĩa:</strong> {w.meaning}
                </p>
              )}

              {w.example && w.example !== "N/A" && (
                <p className="example" style={{ margin: "4px 0" }}>
                  Ví dụ: "{w.example}"
                </p>
              )}

              {w.translation && (
                <p className="translation" style={{ fontSize: "13px", color: "#64748b", fontStyle: "italic", margin: "4px 0" }}>
                  Dịch câu ví dụ: "{w.translation}"
                </p>
              )}

              {w.related && w.related !== "N/A" && (
                <p className="synonyms" style={{ margin: "4px 0" }}>
                  Từ liên quan: {w.related}
                </p>
              )}
            </div>

            {/* RIGHT - ACTIONS */}
            <div className="word-action">
              <button
                className="save-btn"
                onClick={() => handleRemove(w.word)}
                style={{
                  backgroundColor: "#fee2e2",
                  color: "#ef4444",
                  border: "1px solid #fecaca",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#fecaca" }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#fee2e2" }}
              >
                Xóa từ
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
