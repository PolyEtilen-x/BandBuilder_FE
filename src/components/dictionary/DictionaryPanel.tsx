export default function DictionaryPanel({ dict, loading, onClose, onSave }: any) {
  if (!dict) return null

  return (
    <div 
      className="dict-bottom"
      onClick={(e) => e.stopPropagation()} 
    >
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "16px 24px", borderBottom: "1px solid #f1f5f9", background: "#fff"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
          {dict.audio && (
            <button 
              onClick={() => new Audio(dict.audio).play()}
              style={{
                background: "#eff6ff", border: "none", borderRadius: "50%",
                width: "36px", height: "36px", cursor: "pointer", fontSize: "16px"
              }}
            >
              🔊
            </button>
          )}
          <strong style={{ fontSize: "20px", color: "#0f172a", letterSpacing: "-0.01em" }}>{dict.word}</strong>
          <span style={{ color: "#64748b", fontSize: "15px", fontStyle: "italic" }}>
            {dict.phonetic ? `/${dict.phonetic}/` : ""}
          </span>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button 
            onClick={onSave}
            style={{
              background: "#2563eb", color: "#fff", border: "none",
              padding: "8px 16px", borderRadius: "8px", fontSize: "13px",
              fontWeight: 700, cursor: "pointer", transition: "all 0.2s"
            }}
          >
            Lưu từ vựng
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            style={{
              background: "#f1f5f9", border: "none", width: "36px", height: "36px",
              borderRadius: "8px", cursor: "pointer", fontSize: "18px", color: "#64748b"
            }}
          >
            ✕
          </button>
        </div>
      </div>

      <div style={{ padding: "24px", maxHeight: "350px", overflowY: "auto", background: "rgba(255,255,255,0.8)" }}>
        {[
          { label: "Từ liên quan", val: dict.related },
          { label: "Nghĩa tiếng Việt", val: dict.explainVN, bold: true },
          { label: "Ví dụ", val: dict.example, italic: true },
          { label: "Dịch cả câu", val: dict.translation }
        ].map((item, i) => item.val && (
          <div key={i} style={{ marginBottom: "20px" }}>
            <strong style={{ display: "block", fontSize: "11px", color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
              {item.label}
            </strong>
            <p style={{ 
              margin: 0, color: "#334155", fontSize: "16px", lineHeight: 1.6,
              fontWeight: item.bold ? 600 : 400,
              fontStyle: item.italic ? "italic" : "normal"
            }}>
              {item.val}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}