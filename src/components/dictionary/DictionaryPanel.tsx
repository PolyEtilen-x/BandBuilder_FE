import "./style.css"

export default function DictionaryPanel({ dict, loading, onClose, onSave }: any) {
  if (!dict) return null

  return (
    <div className="dict-bottom">

      {/* HEADER */}
      <div className="dict-header">
        <div>
          <strong>{dict.word}</strong>
          <span>{dict.phonetic}</span>
        </div>

        <div className="actions">
          {dict.audio && (
            <button onClick={() => new Audio(dict.audio).play()}>
              🔊
            </button>
          )}
          <button onClick={onSave}>+ Save</button>
          <button onClick={onClose}>✕</button>
        </div>
      </div>

      {/* MEANING */}
      <div className="dict-meaning">
        {loading ? "Loading..." : dict.meaning}
      </div>

      {/* EXAMPLE */}
      {dict.example && (
        <div className="dict-example">{dict.example}</div>
      )}
    </div>
  )
}