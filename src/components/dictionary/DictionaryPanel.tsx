import "./style.css"

export default function DictionaryPanel({ dict, loading, onClose, onSave }: any) {
  if (!dict) return null

  return (
    <div className="dict-bottom">

      {/* HEADER */}
      <div className="dict-header">
        <div className="left">
          {dict.audio && (
            <button onClick={() => new Audio(dict.audio).play()}>🔊</button>
          )}
          <strong>{dict.word}</strong>
          <span className="phonetic">
            {dict.phonetic ? `/${dict.phonetic}/` : ""}
          </span>
        </div>

        <div className="right">
          <button onClick={onSave}>+ Lưu từ vựng</button>
          <button onClick={onClose}>✕</button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="dict-content">

        <div className="dict-section">
          <strong>Từ/Cấu trúc liên quan:</strong>
          <p>{dict.related}</p>
        </div>

        <div className="dict-section">
          <strong>Giải thích nghĩa tiếng Việt:</strong>
          <p>{dict.explainVN}</p>
        </div>

        <div className="dict-section">
          <strong>Ví dụ:</strong>
          <p>{dict.example}</p>
        </div>

        <div className="dict-section">
          <strong>Dịch nghĩa cả câu:</strong>
          <p>{dict.translation}</p>
        </div>
      </div>
    </div>
  )
}