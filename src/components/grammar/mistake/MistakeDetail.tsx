import { MistakeCategory } from "@/data/grammar/mistake.model"
import { Info } from "lucide-react"

type Props = {
  data: MistakeCategory | null
  onBack: () => void
}

export default function MistakeDetail({ data, onBack }: Props) {
  if (!data || data.mistakes.length === 0) {
    return <div style={{ padding: 20 }}>No data</div>
  }

  return (
    <div className="grammar-container">

      <div className="detail-header">
        <button onClick={onBack}>← Back</button>
        <h1>{data.category}</h1>
      </div>

      <div className="mistake-list">
        {data.mistakes.map((m) => (
          <div key={m.id} className="mistake-card">

            {/* WRONG */}
            <div className="block wrong">
              <div className="tag">
                <span className="icon">❌</span> Wrong
              </div>
              <p>{m.incorrect}</p>
            </div>

            {/* CORRECT */}
            <div className="block correct">
              <div className="tag">✅ Correct</div>
              <p>{m.correct}</p>
            </div>

            {/* NOTE */}
            <div className="block note" style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <Info size={16} style={{ flexShrink: 0, marginTop: 2, color: "#3a6cf4" }} />
              <span>{m.note}</span>
            </div>

          </div>
        ))}
      </div>

    </div>
  )
}