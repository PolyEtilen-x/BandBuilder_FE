import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import MainLayout from "@/components/layout/MainLayout/MainLayout"
import { useGenerateRoadmap } from "@/hooks/useRoadmap"
import { LearningType } from "@/types/roadmap.types"
import {
  ChevronRight,
  Target,
  GraduationCap,
  BookOpen,
  Mic,
  Headphones,
  PenTool,
  Sparkles,
  Compass,
  Zap
} from "lucide-react"
import "./style.css"

export default function RoadmapSetupPage() {
  const navigate = useNavigate()
  const [learningType, setLearningType] = useState<LearningType>("ielts")
  const [currentLevel, setCurrentLevel] = useState("5.0")
  const [targetLevel, setTargetLevel] = useState("6.5")

  const [skills, setSkills] = useState({
    speaking: "5.0",
    reading: "5.0",
    listening: "5.0",
    writing: "5.0"
  })

  const { isPending } = useGenerateRoadmap()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // For now, we navigate to the mock roadmap path
    navigate("/roadmap/ielts_5_to_6")
  }

  const ieltsBands = ["4.0", "4.5", "5.0", "5.5", "6.0", "6.5", "7.0", "7.5", "8.0+"]
  const cefrLevels = ["A1", "A2", "B1", "B2", "C1", "C2"]

  return (
    <MainLayout>
      <div className="roadmap-setup-container">
        {/* Decorative background grid and neon meshes */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-200/40 dark:bg-indigo-900/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-200/30 dark:bg-rose-900/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="roadmap-setup-inner">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="roadmap-hero-badge">
              <Compass size={14} className="animate-spin-slow" />
              Band-Architect Engine v1.0
            </div>
            <h1 className="roadmap-main-title">
              Map Out Your Journey
            </h1>
            <p className="roadmap-main-desc mx-auto">
              Answer a few questions to build a personalized study timeline tailored to your current performance and milestone goals.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            onSubmit={handleSubmit}
            className="roadmap-setup-card"
          >
            {/* LEARNING PATH SELECTION */}
            <div>
              <label className="setup-section-label">
                1. Select Learning Focus
              </label>
              <div className="setup-focus-grid">
                <button
                  type="button"
                  onClick={() => setLearningType("ielts")}
                  className={`setup-focus-card ${learningType === "ielts" ? "active" : ""}`}
                >
                  <div className="setup-focus-icon-wrap">
                    <GraduationCap size={24} />
                  </div>
                  <span className="setup-focus-card-title">IELTS Academic</span>
                  <span className="setup-focus-card-desc">Target Band Score Focus</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLearningType("general")}
                  className={`setup-focus-card ${learningType === "general" ? "active" : ""}`}
                >
                  <div className="setup-focus-icon-wrap">
                    <BookOpen size={24} />
                  </div>
                  <span className="setup-focus-card-title">General English</span>
                  <span className="setup-focus-card-desc">CEFR Communication Levels</span>
                </button>
              </div>
            </div>

            {/* MILESTONE TARGETS */}
            <div className="setup-select-grid">
              <div>
                <label className="setup-select-label-row">
                  <Target size={14} /> 2. Current Baseline Level
                </label>
                <div className="setup-select-field-wrap">
                  <select
                    value={currentLevel}
                    onChange={(e) => setCurrentLevel(e.target.value)}
                    className="setup-select-field"
                  >
                    {(learningType === "ielts" ? ieltsBands : cefrLevels).map(l => (
                      <option key={l} value={l} className="dark:bg-slate-900">Level {l}</option>
                    ))}
                  </select>
                  <div className="setup-select-caret">▼</div>
                </div>
              </div>

              <div>
                <label className="setup-select-label-row">
                  <Sparkles size={14} /> 3. Desired Milestone Goal
                </label>
                <div className="setup-select-field-wrap">
                  <select
                    value={targetLevel}
                    onChange={(e) => setTargetLevel(e.target.value)}
                    className="setup-select-field highlighted"
                  >
                    {(learningType === "ielts" ? ieltsBands : cefrLevels).map(l => (
                      <option key={l} value={l} className="dark:bg-slate-900">Level {l}</option>
                    ))}
                  </select>
                  <div className="setup-select-caret">▼</div>
                </div>
              </div>
            </div>

            {/* DETAILED SKILL GRIDS */}
            <div>
              <label className="setup-section-label">
                4. Specify Current Skill Performance
              </label>
              <div className="setup-skills-grid">
                {Object.entries(skills).map(([skill, value]) => (
                  <div key={skill} className="setup-skill-card">
                    <div className="setup-skill-header">
                      {skill === 'speaking' && <Mic size={14} className="text-rose-500" />}
                      {skill === 'listening' && <Headphones size={14} className="text-violet-500" />}
                      {skill === 'reading' && <BookOpen size={14} className="text-emerald-500" />}
                      {skill === 'writing' && <PenTool size={14} className="text-amber-500" />}
                      <span>{skill}</span>
                    </div>
                    <div className="setup-skill-select-wrap">
                      <select
                        value={value}
                        onChange={(e) => setSkills({ ...skills, [skill]: e.target.value })}
                        className="setup-skill-select"
                      >
                        {(learningType === "ielts" ? ieltsBands : cefrLevels).map(l => (
                          <option key={l} value={l} className="dark:bg-slate-900">{l}</option>
                        ))}
                      </select>
                      <div className="setup-select-caret" style={{ fontSize: "10px", right: "12px" }}>▼</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SUBMIT ENGINE ACTION */}
            <button
              type="submit"
              disabled={isPending}
              className="setup-submit-btn"
            >
              {isPending ? (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Assembling Journey Map...</span>
                </div>
              ) : (
                <>
                  <Zap size={18} className="text-indigo-400 fill-indigo-400 animate-pulse" />
                  Generate Personalized Journey Map
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </motion.form>
        </div>
      </div>
    </MainLayout>
  )
}

