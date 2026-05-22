import { Mic, PenLine, Phone } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { useUIStore } from "@/services/ui/ui.store"

type PracticeKey = "pronunciation" | "writings" | "call"

const ICONS = {
  pronunciation: <Mic size={16} />,
  writings: <PenLine size={16} />,
  call: <Phone size={16} />,
}

const CATEGORIES: PracticeKey[] = ["pronunciation", "writings", "call"]

export default function GeneralPracticeSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { language } = useUIStore()

  const activeCategory: PracticeKey = location.pathname.includes("pronunciation")
    ? "pronunciation"
    : location.pathname.includes("writings")
      ? "writings"
      : "call"

  const CONFIG: Record<PracticeKey, { label: string; path: string }> = {
    pronunciation: {
      label: language === "vi" ? "Luyện Phát Âm" : "Pronunciation Practice",
      path: "/practice-general/pronunciation-practice",
    },
    writings: {
      label: language === "vi" ? "Bài Mẫu Writing" : "Sample Writings",
      path: "/practice-general/sample-writings",
    },
    call: {
      label: language === "vi" ? "Luyện Nói Với AI" : "Call with AI",
      path: "/practice-general/call-with-ai",
    },
  }

  return (
    <div style={{ width: 260, flexShrink: 0 }}>
      {CATEGORIES.map((c) => {
        const cfg = CONFIG[c]
        const isActive = c === activeCategory

        return (
          <div
            key={c}
            onClick={() => navigate(cfg.path)}
            style={{
              border: isActive ? "2px solid #174593" : "1px solid #e0e0e0",
              borderRadius: 16,
              padding: "12px 16px",
              marginBottom: 12,
              background: isActive ? "#f0f7ff" : "#fff",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
              }}
            >
              <span style={{ color: isActive ? "#174593" : "#444", display: "flex", alignItems: "center" }}>
                {ICONS[c]}
              </span>
              <span
                style={{
                  fontWeight: 600,
                  color: isActive ? "#174593" : "#444",
                  fontSize: 14,
                }}
              >
                {cfg.label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
