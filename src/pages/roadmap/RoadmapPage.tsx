import { useState } from "react"
import MainLayout from "@/components/layout/MainLayout/MainLayout"
import { Check, Lock, BookOpen, Mic, PenTool, Headphones, Brain, Star, TrendingUp } from "lucide-react"
import "./style.css"

interface Skill {
  name: string
  icon: any
}

interface RoadmapStep {
  id: string
  level: string
  title: string
  desc: string
  skills: Skill[]
  progress: number
  isLocked: boolean
}

const GENERAL_ROADMAP: RoadmapStep[] = [
  {
    id: "a1",
    level: "A1",
    title: "English Starter",
    desc: "Foundation for beginners. Focus on basic grammar, everyday vocabulary, and simple introductions.",
    progress: 100,
    isLocked: false,
    skills: [
      { name: "Grammar", icon: BookOpen },
      { name: "Family & Food", icon: Star },
      { name: "Greetings", icon: Mic },
      { name: "Basic Words", icon: Headphones }
    ]
  },
  {
    id: "a2",
    level: "A2",
    title: "Communication Builder",
    desc: "Build your confidence in daily situations like shopping, traveling, and talking about hobbies.",
    progress: 45,
    isLocked: false,
    skills: [
      { name: "Past Simple", icon: BookOpen },
      { name: "Daily Routine", icon: Brain },
      { name: "Travel Talk", icon: Mic },
      { name: "Short Stories", icon: PenTool }
    ]
  },
  {
    id: "b1",
    level: "B1",
    title: "Intermediate Speaker",
    desc: "Express opinions, tell detailed stories, and handle most situations while traveling in an English-speaking area.",
    progress: 0,
    isLocked: true,
    skills: [
      { name: "Opinions", icon: Mic },
      { name: "Storytelling", icon: PenTool },
      { name: "Articles", icon: BookOpen },
      { name: "Main Ideas", icon: Headphones }
    ]
  }
]

const IELTS_ROADMAP: RoadmapStep[] = [
  {
    id: "foundation",
    level: "Band 4.0",
    title: "IELTS Foundation",
    desc: "Master the basics of the IELTS format. Focus on number spelling, keyword recognition, and basic skimming.",
    progress: 100,
    isLocked: false,
    skills: [
      { name: "Spelling", icon: PenTool },
      { name: "Skimming", icon: BookOpen },
      { name: "Keywords", icon: Brain },
      { name: "Pronunciation", icon: Mic }
    ]
  },
  {
    id: "band5",
    level: "Band 5.5",
    title: "Band 5 Builder",
    desc: "Learn core strategies for every section. Focus on note completion, sentence building, and fluency.",
    progress: 60,
    isLocked: false,
    skills: [
      { name: "Note Completion", icon: Headphones },
      { name: "Sentence Structure", icon: PenTool },
      { name: "TFNG Basics", icon: BookOpen },
      { name: "Elaboration", icon: Mic }
    ]
  },
  {
    id: "band6",
    level: "Band 6.5",
    title: "Band 6 Mastery",
    desc: "Deep dive into complex question types and academic vocabulary. Handle distractors and inference with ease.",
    progress: 0,
    isLocked: true,
    skills: [
      { name: "Map Labeling", icon: Headphones },
      { name: "Heading Matching", icon: BookOpen },
      { name: "Coherence", icon: PenTool },
      { name: "Abstract Topics", icon: Mic }
    ]
  },
  {
    id: "band7",
    level: "Band 7.5+",
    title: "Band 7 Elite",
    desc: "Polishing your skills to perfection. Focus on native-like fluency, complex grammar, and advanced paraphrasing.",
    progress: 0,
    isLocked: true,
    skills: [
      { name: "Fast Speech", icon: Headphones },
      { name: "Time Pressure", icon: TrendingUp },
      { name: "Complex Grammar", icon: BookOpen },
      { name: "Natural Speaking", icon: Mic }
    ]
  }
]

export default function RoadmapPage() {
  const [activeTab, setActiveTab] = useState<"general" | "ielts">("ielts")
  const data = activeTab === "general" ? GENERAL_ROADMAP : IELTS_ROADMAP

  return (
    <MainLayout>
      <div className="roadmap-container">
        <div className="roadmap-header">
          <h1>Learning Roadmap</h1>
          <p>Your personalized path to mastering English and reaching your target IELTS band score.</p>
        </div>

        <div className="roadmap-tabs">
          <button
            className={`roadmap-tab ${activeTab === "general" ? "active" : ""}`}
            onClick={() => setActiveTab("general")}
          >
            General English
          </button>
          <button
            className={`roadmap-tab ${activeTab === "ielts" ? "active" : ""}`}
            onClick={() => setActiveTab("ielts")}
          >
            IELTS Journey
          </button>
        </div>

        <div className="journey-path">
          {data.map((step) => (
            <div key={step.id} className={`journey-step ${step.isLocked ? "step-locked" : ""}`}>
              <div className="step-node">
                {step.isLocked ? <Lock size={18} /> : (step.progress === 100 ? <Check size={20} /> : <div className="step-num-icon">{data.indexOf(step) + 1}</div>)}
              </div>

              <div className="step-content">
                <div className="step-header">
                  <span className="step-badge">{step.level}</span>
                  {!step.isLocked && step.progress > 0 && <span className="step-percent">{step.progress}%</span>}
                </div>

                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>

                <div className="skill-grid">
                  {step.skills.map((skill, idx) => (
                    <div key={idx} className="skill-item">
                      <div className="skill-icon"><skill.icon size={16} /></div>
                      <span className="skill-name">{skill.name}</span>
                    </div>
                  ))}
                </div>

                {!step.isLocked && (
                  <div className="step-progress">
                    <div className="progress-info">
                      <span>Mastery</span>
                      <span>{step.progress}%</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${step.progress}%` }}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
