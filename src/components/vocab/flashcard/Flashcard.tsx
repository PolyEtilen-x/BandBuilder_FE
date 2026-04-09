import { useState } from "react"
import "./style.css"

type Mode = "topic" | "band"

export default function Flashcard() {
  const [mode, setMode] = useState<Mode>("topic")
  const [flipped, setFlipped] = useState(false)

  return (
    <div className="flashcard-page">
      
      {/* HEADER */}
      <div className="flashcard-header">
        <h2>Flashcard Learning</h2>

        <div className="mode-toggle">
          <button
            className={mode === "topic" ? "active" : ""}
            onClick={() => setMode("topic")}
          >
            By Topic
          </button>

          <button
            className={mode === "band" ? "active" : ""}
            onClick={() => setMode("band")}
          >
            By Band
          </button>
        </div>
      </div>

      {/* FILTER */}
      <div className="flashcard-filter">
        {mode === "topic" ? (
          <select>
            <option>Travel</option>
            <option>Education</option>
          </select>
        ) : (
          <select>
            <option>Band 5.0+</option>
            <option>Band 6.0+</option>
            <option>Band 7.0+</option>
            <option>Band 8.0+</option>
          </select>
        )}
      </div>

      {/* CARD */}
      <div className="card-container">
        <div
          className={`flashcard ${flipped ? "flipped" : ""}`}
          onClick={() => setFlipped(!flipped)}
        >
          {/* FRONT */}
          <div className="card front">
            <h1>Abandon</h1>
            <p>/əˈbændən/</p>
          </div>

          {/* BACK */}
          <div className="card back">
            <p><b>Meaning:</b> từ bỏ</p>
            <p><b>Example:</b> He abandoned the plan.</p>
          </div>
        </div>
      </div>

      {/* ACTION */}
      <div className="flashcard-actions">
        <button>⏮ Prev</button>
        <button onClick={() => setFlipped(!flipped)}>🔄 Flip</button>
        <button>Next ⏭</button>
        <button className="save">💾 Save</button>
      </div>

    </div>
  )
}