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

export default function PracticeSidebar() {
  const { sidebar, setSidebar } = usePracticeStore()
  const { skill: activeSkill, mode, subSection } = sidebar
  const navigate = useNavigate()

  function handleSelectSkill(s: SkillKey) {
    // Click another skill → change skill, keep same mode
    if (s !== activeSkill) {
      setSidebar({ skill: s, mode, subSection: mode === "single" ? 1 : null })
      navigate(`/practice-ielts/${s}`)
    }
  }

  function handleMode(s: SkillKey, m: Mode) {
    if (s !== activeSkill) {
      // if click skill = no active → active and change page
      setSidebar({ skill: s, mode: m, subSection: m === "single" ? 1 : null })
      navigate(`/practice-ielts/${s}`)
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
    <div className="app-sidebar-wrapper practice-sidebar">
      {SKILLS.map((s) => {
        const cfg = SKILL_CONFIG[s]
        const isActive = s === activeSkill

        return (
          <div
            key={s}
            className={`sidebar-skill-block ${isActive ? "active" : ""}`}
          >
            {/* ── Skill header ── */}
            <div
              onClick={() => handleSelectSkill(s)}
              className="sidebar-skill-header"
            >
              <span className="sidebar-skill-icon">
                {cfg.icon}
              </span>
              <span className="sidebar-skill-label">
                {cfg.label}
              </span>
            </div>

            {/* ── Bài lẻ ── */}
            <label className="sidebar-row">
              <input
                type="radio"
                className="sidebar-radio"
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
                    <label key={idx} className="sidebar-sub-row">
                      <input
                        type="radio"
                        className="sidebar-radio"
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
              <label className="sidebar-row">
                <input
                  type="radio"
                  className="sidebar-radio"
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