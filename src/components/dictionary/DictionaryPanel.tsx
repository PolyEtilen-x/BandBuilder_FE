export default function DictionaryPanel({ dict, loading, onClose, onSave }: any) {
  if (!dict) return null

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
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button 
            onClick={onSave}
            style={{
              backgroundColor: "#174593", color: "#fff", border: "none",
              padding: "6px 16px", borderRadius: "2px", fontSize: "12px",
              fontWeight: 700, cursor: "pointer", textTransform: "uppercase"
            }}
          >
            SAVE WORD
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
              Sentence Translation
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
              Related Words
            </span>
            <p style={{ margin: 0, color: "#1e293b", fontSize: "14px", lineHeight: 1.5 }}>
              {dict.related || "N/A"}
            </p>
          </div>

          {/* Example */}
          <div>
            <span style={{ display: "block", fontSize: "11px", color: "#64748b", fontWeight: 800, textTransform: "uppercase", marginBottom: "8px" }}>
              Usage Example
            </span>
            <p style={{ margin: 0, color: "#1e293b", fontSize: "14px", lineHeight: 1.5, fontStyle: "italic" }}>
              {dict.example || "No example available."}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}