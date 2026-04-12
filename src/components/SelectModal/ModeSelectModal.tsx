import { useState, useEffect } from "react"
import { X } from "lucide-react"
import "./ModeSelectModal.css"
 
type Mode = "exam" | "practice"

type Props = {
  open: boolean
  onClose: () => void
  onStart: (mode: Mode) => any
}

const MODES = [
  {
    id: "exam",
    label: "Real Exam Interface",
    description:
      "Simulates the computer-based test environment so you're fully prepared on exam day",
    badge: "100% Identical",
  },
  {
    id: "practice",
    label: "Practice Interface",
    description:
      "Vocabulary lookup, writing hints, and more — perfect for daily practice",
    badge: null,
  },
]

export default function ModeSelectModal({ open, onClose, onStart }: Props) {
  const [selected, setSelected] = useState<"exam" | "practice">("practice")
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    const saved = localStorage.getItem("practice_mode")
    if (saved === "exam" || saved === "practice") {
      setSelected(saved)
    }
  }, [])

  const handleStart = async () => {
    
    try {
      setLoading(true)

      localStorage.setItem("practice_mode", selected)

      await onStart(selected) 
      console.log("AFTER onStart")
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Close */}
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Header */}
        <h2 className="modal-title">Choose your test interface</h2>

        {/* Cards */}
        <div className="modal-cards">
          {MODES.map((mode) => {
            const isSelected = selected === mode.id

            return (
              <div
                key={mode.id}
                className={`modal-card ${isSelected ? "selected" : ""}`}
                onClick={() => setSelected(mode.id as any)}
              >
                {/* Preview */}
                <div className="modal-preview">
                  <span>Preview</span>

                  {mode.badge && (
                    <div className="modal-badge">{mode.badge}</div>
                  )}
                </div>

                {/* Text */}
                <div className="modal-text">
                  <p className="modal-label">{mode.label}</p>
                  <p className="modal-desc">{mode.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Button */}
        <button
          className="modal-button"
          onClick={() => {
            console.log("BUTTON CLICKED")
            handleStart()
          }}
          disabled={loading}
        >
          {loading ? "Starting..." : "Start test"}
        </button>
      </div>
    </div>
  )
}