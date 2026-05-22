import { useState, useEffect } from "react"

export default function DictionaryPanel({ dict, loading, onClose, onSave }: any) {
  const [toast, setToast] = useState<string | null>(null)
  const [prevSaved, setPrevSaved] = useState(dict?.isSaved)

  useEffect(() => {
    if (!dict) return
    if (dict.isSaved && !prevSaved) {
      setToast("Đã lưu từ vựng vào Notebook!")
      const timer = setTimeout(() => setToast(null), 2500)
      return () => clearTimeout(timer)
    } else if (!dict.isSaved && prevSaved) {
      setToast("Đã xóa từ vựng khỏi Notebook!")
      const timer = setTimeout(() => setToast(null), 2500)
      return () => clearTimeout(timer)
    }
    setPrevSaved(dict.isSaved)
  }, [dict?.isSaved, prevSaved])

  if (!dict) return null

  // Play audio utilizing the cached URL, fallback to speech synthesis
  const playAudio = (word: string, audioUrl?: string): void => {
    if (audioUrl && audioUrl.trim() !== "") {
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

  return (
    <div 
      className="dict-bottom"
      style={{
        position: "fixed",
        bottom: "90px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "600px",
        maxWidth: "95%",
        backgroundColor: "#ffffff",
        border: "2px solid #1e293b", 
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        borderRadius: "4px" 
      }}
      onClick={(e) => e.stopPropagation()} 
    >
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: "absolute",
          top: "-48px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: dict.isSaved ? "#10b981" : "#ef4444",
          color: "#ffffff",
          padding: "8px 20px",
          borderRadius: "20px",
          fontSize: "13px",
          fontWeight: 600,
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          zIndex: 1010,
          whiteSpace: "nowrap",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          pointerEvents: "none",
          animation: "fadeIn 0.2s ease-out"
        }}>
          <span>{dict.isSaved ? "✓" : "✕"}</span>
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div style={{
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        padding: "16px 24px", 
        backgroundColor: "#1e293b", 
        color: "#fff"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <strong style={{ fontSize: "20px", letterSpacing: "0.02em" }}>{dict.word.toUpperCase()}</strong>
          <span style={{ color: "#94a3b8", fontSize: "14px", fontWeight: 500 }}>
            {dict.phonetic ? `[ ${dict.phonetic} ]` : ""}
          </span>
          {/* Audio Pronunciation Button */}
          <button
            onClick={() => playAudio(dict.word, dict.audio)}
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              padding: "6px 10px",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              transition: "all 0.2s"
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)" }}
            onMouseOut={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)" }}
            title="Nghe phát âm"
          >
            🔊
          </button>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button 
            onClick={onSave}
            style={{
              backgroundColor: dict.isSaved ? "#10b981" : "#174593", 
              color: "#fff", 
              border: "none",
              padding: "6px 16px", 
              borderRadius: "2px", 
              fontSize: "12px",
              fontWeight: 700, 
              cursor: "pointer", 
              textTransform: "uppercase",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            {dict.isSaved ? "✓ ĐÃ LƯU" : "SAVE WORD"}
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            style={{
              background: "transparent", border: "1px solid #475569", width: "28px", height: "28px",
              borderRadius: "2px", cursor: "pointer", fontSize: "14px", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "24px", maxHeight: "400px", overflowY: "auto", backgroundColor: "#fff" }}>
        {/* Nghĩa tiếng Việt */}
        <div style={{ marginBottom: "24px", borderLeft: "4px solid #174593", paddingLeft: "16px" }}>
          <span style={{ display: "block", fontSize: "11px", color: "#64748b", fontWeight: 800, textTransform: "uppercase", marginBottom: "4px" }}>
            Definition (VN)
          </span>
          <p style={{ margin: 0, color: "#0f172a", fontSize: "18px", fontWeight: 700, lineHeight: 1.4 }}>
            {dict.explainVN || "Đang cập nhật..."}
          </p>
        </div>

        {/* Dịch cả câu */}
        {dict.translation && (
          <div style={{ marginBottom: "24px", backgroundColor: "#f8fafc", padding: "16px", border: "1px solid #e2e8f0" }}>
            <span style={{ display: "block", fontSize: "11px", color: "#64748b", fontWeight: 800, textTransform: "uppercase", marginBottom: "8px" }}>
              Sentence Translation (Ngữ cảnh)
            </span>
            <p style={{ margin: 0, color: "#334155", fontSize: "15px", fontStyle: "italic", lineHeight: 1.6 }}>
              "{dict.translation}"
            </p>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {/* Related words */}
          <div>
            <span style={{ display: "block", fontSize: "11px", color: "#64748b", fontWeight: 800, textTransform: "uppercase", marginBottom: "8px" }}>
              Related Words (Từ đồng nghĩa)
            </span>
            <p style={{ margin: 0, color: "#1e293b", fontSize: "14px", lineHeight: 1.5 }}>
              {dict.related || "N/A"}
            </p>
          </div>

          {/* Example */}
          <div>
            <span style={{ display: "block", fontSize: "11px", color: "#64748b", fontWeight: 800, textTransform: "uppercase", marginBottom: "8px" }}>
              Usage Example (Ví dụ từ điển)
            </span>
            <p style={{ margin: 0, color: "#1e293b", fontSize: "14px", lineHeight: 1.5, fontStyle: "italic" }}>
              {dict.example && dict.example !== "N/A" && dict.example !== "No example found in database" ? `"${dict.example}"` : "No example available."}
            </p>
            {dict.exampleTranslation && (
              <p style={{ margin: "4px 0 0 0", color: "#16a34a", fontSize: "13px", lineHeight: 1.4, fontStyle: "italic" }}>
                Dịch ví dụ: "{dict.exampleTranslation}"
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}