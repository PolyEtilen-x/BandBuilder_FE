import { useState } from "react"
import { useNavigate } from "react-router-dom"
import MainLayout from "@/components/layout/MainLayout/MainLayout"
import { useGenerateRoadmap } from "@/hooks/useRoadmap"
import { LearningType } from "@/types/roadmap.types"
import { ChevronRight, Target, GraduationCap, BookOpen, Mic, Headphones, PenTool } from "lucide-react"

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

  const { mutate: generateRoadmap, isPending } = useGenerateRoadmap()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // For now, we just navigate to a mock ID
    // generateRoadmap({ learningType, currentLevel, targetLevel, ...skills }, {
    //   onSuccess: (data) => navigate(`/roadmap/${data.id}`)
    // })
    navigate("/roadmap/ielts_5_to_6")
  }

  const ieltsBands = ["4.0", "4.5", "5.0", "5.5", "6.0", "6.5", "7.0", "7.5", "8.0+"]
  const cefrLevels = ["A1", "A2", "B1", "B2", "C1"]

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Create Your Journey</h1>
            <p className="text-slate-600 text-lg">Tell us about your current level and goals to get a personalized roadmap.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100">
            {/* LEARNING TYPE */}
            <div className="mb-10">
              <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">I want to learn</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setLearningType("ielts")}
                  className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                    learningType === "ielts" ? "border-blue-600 bg-blue-50 text-blue-700 shadow-md" : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
                  }`}
                >
                  <GraduationCap size={20} />
                  <span className="font-bold">IELTS</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLearningType("general")}
                  className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                    learningType === "general" ? "border-blue-600 bg-blue-50 text-blue-700 shadow-md" : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
                  }`}
                >
                  <BookOpen size={20} />
                  <span className="font-bold">General</span>
                </button>
              </div>
            </div>

            {/* LEVELS */}
            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
                  <Target size={16} className="text-blue-600" /> Current Level
                </label>
                <select 
                  value={currentLevel}
                  onChange={(e) => setCurrentLevel(e.target.value)}
                  className="w-full h-14 bg-slate-50 border-none rounded-xl px-4 font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500"
                >
                  {(learningType === "ielts" ? ieltsBands : cefrLevels).map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
                  <ChevronRight size={16} className="text-blue-600" /> Target Goal
                </label>
                <select 
                   value={targetLevel}
                   onChange={(e) => setTargetLevel(e.target.value)}
                  className="w-full h-14 bg-slate-50 border-none rounded-xl px-4 font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500"
                >
                  {(learningType === "ielts" ? ieltsBands : cefrLevels).map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* SKILLS */}
            <div className="mb-10">
              <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Current Skill Levels</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(skills).map(([skill, value]) => (
                  <div key={skill} className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                      {skill === 'speaking' && <Mic size={14} />}
                      {skill === 'listening' && <Headphones size={14} />}
                      {skill === 'reading' && <BookOpen size={14} />}
                      {skill === 'writing' && <PenTool size={14} />}
                      {skill}
                    </div>
                    <select
                      value={value}
                      onChange={(e) => setSkills({...skills, [skill]: e.target.value})}
                      className="w-full h-12 bg-slate-50 border-none rounded-xl px-3 font-semibold text-slate-700 text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      {(learningType === "ielts" ? ieltsBands : cefrLevels).map(l => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isPending}
              className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              {isPending ? "Generating..." : (
                <>
                  Generate My Roadmap
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  )
}
