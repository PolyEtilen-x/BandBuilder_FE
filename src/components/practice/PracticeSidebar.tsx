import { BookOpen, Headphones, PenLine, Mic } from "lucide-react"
import { usePracticeStore } from "@/services/practice/practice.store"
import { useNavigate } from "react-router-dom"

type SkillKey = "reading" | "listening" | "writing" | "speaking"
type Mode = "full" | "single"

export type SidebarState = {
  skill: SkillKey
  mode: Mode
  subSection: number | null // null = cnone sub-section
}

const SKILL_CONFIG: Record<
  SkillKey,
  {
    label: string
    icon: React.ReactNode
    subSections: string[]
    hasFull: boolean
  }
> = {
  reading: {
    label: "Reading",
    icon: <BookOpen size={16} />,
    subSections: ["Passage 1", "Passage 2", "Passage 3"],
    hasFull: true,
  },
  listening: {
    label: "Listening",
    icon: <Headphones size={16} />,
    subSections: ["Section 1", "Section 2", "Section 3", "Section 4"],
    hasFull: true,
  },
  writing: {
    label: "Writing",
    icon: <PenLine size={16} />,
    subSections: ["Task 1", "Task 2"],
    hasFull: false,
  },
  speaking: {
    label: "Speaking",
    icon: <Mic size={16} />,
    subSections: ["Part 1", "Part 2", "Part 3"],
    hasFull: true,
  },
}

const SKILLS: SkillKey[] = ["reading", "listening", "writing", "speaking"]

// ── Styles ─────────────────────────────────────────────────────
const radio: React.CSSProperties = {
  accentColor: "#174593",
  width: 16,
  height: 16,
  cursor: "pointer",
  flexShrink: 0,
}

const rowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "5px 0",
  cursor: "pointer",
  fontSize: 14,
  color: "#333",
}

const subRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "4px 0",
  cursor: "pointer",
  fontSize: 13,
  color: "#555",
  marginLeft: 24,
}

export default function PracticeSidebar() {
  const { sidebar, setSidebar } = usePracticeStore()
  const { skill: activeSkill, mode, subSection } = sidebar
  const navigate = useNavigate()

  function handleSelectSkill(s: SkillKey) {
    // Click another skill → change skill, keep same mode
    if (s !== activeSkill) {
      setSidebar({ skill: s, mode, subSection: mode === "single" ? 1 : null })
      navigate(`/practice/${s}`)
    }
  }

  function handleMode(s: SkillKey, m: Mode) {
    if (s !== activeSkill) {
      // if click skill = no active → active and change page
      setSidebar({ skill: s, mode: m, subSection: m === "single" ? 1 : null })
      navigate(`/practice/${s}`)
    } else {
      setSidebar({
        skill: activeSkill,
        mode: m,
        subSection: m === "single" ? (subSection ?? 1) : null,
      })
    }
  }

  function handleSubSection(idx: number) {
    setSidebar({ skill: activeSkill, mode: "single", subSection: idx })
  }

  return (
    <div style={{ width: 260, flexShrink: 0 }}>
      {SKILLS.map((s) => {
        const cfg = SKILL_CONFIG[s]
        const isActive = s === activeSkill

        return (
          <div
            key={s}
            style={{
              border: isActive ? "2px solid #174593" : "1px solid #e0e0e0",
              borderRadius: 16,
              padding: "12px 16px",
              marginBottom: 12,
              background: isActive ? "#f6fff6" : "#fff",
              transition: "all 0.15s ease",
            }}
          >
            {/* ── Skill header ── */}
            <div
              onClick={() => handleSelectSkill(s)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 10,
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              <span
                style={{
                  color: isActive ? "#174593" : "#888",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {cfg.icon}
              </span>
              <span
                style={{
                  fontWeight: 600,
                  fontSize: 15,
                  color: isActive ? "#174593" : "#444",
                }}
              >
                {cfg.label}
              </span>
            </div>

            {/* ── Bài lẻ ── */}
            <label style={rowStyle}>
              <input
                type="radio"
                style={radio}
                checked={isActive && mode === "single"}
                onChange={() => handleMode(s, "single")}
              />
              Single Section
            </label>

            {isActive && mode === "single" && (
              <div style={{ marginTop: 2, marginBottom: 4 }}>
                {cfg.subSections.map((label, i) => {
                  const idx = i + 1
                  return (
                    <label key={idx} style={subRowStyle}>
                      <input
                        type="radio"
                        style={radio}
                        checked={subSection === idx}
                        onChange={() => handleSubSection(idx)}
                      />
                      {label}
                    </label>
                  )
                })}
              </div>
            )}

            {/* ── Full test ── */}
            {cfg.hasFull && (
              <label style={rowStyle}>
                <input
                  type="radio"
                  style={radio}
                  checked={isActive && mode === "full"}
                  onChange={() => handleMode(s, "full")}
                />
                Full test
              </label>
            )}
          </div>
        )
      })}
    </div>
  )
}