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
    // For now, we navigate to the mock roadmap path
    navigate("/roadmap/ielts_5_to_6")
  }

  const ieltsBands = ["4.0", "4.5", "5.0", "5.5", "6.0", "6.5", "7.0", "7.5", "8.0+"]
  const cefrLevels = ["A1", "A2", "B1", "B2", "C1", "C2"]

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 py-16 px-4 relative overflow-hidden flex items-center justify-center">
        {/* Decorative background grid and neon meshes */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-200/40 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-200/30 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-3xl w-full relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-xl text-xs font-extrabold text-indigo-700 uppercase tracking-widest mb-4">
              <Compass size={14} className="animate-spin-slow" />
              Band-Architect Engine v1.0
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
              Map Out Your Journey
            </h1>
            <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
              Answer a few questions to build a personalized study timeline tailored to your current performance and milestone goals.
            </p>
          </motion.div>

          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            onSubmit={handleSubmit} 
            className="bg-white/80 backdrop-blur-xl rounded-[32px] border border-slate-200/80 shadow-2xl shadow-slate-200/50 p-8 md:p-12 space-y-8"
          >
            {/* LEARNING PATH SELECTION */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                1. Select Learning Focus
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setLearningType("ielts")}
                  className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all text-center relative group ${
                    learningType === "ielts" 
                      ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-md shadow-indigo-100/30" 
                      : "border-slate-100 bg-slate-50/50 text-slate-500 hover:border-slate-200"
                  }`}
                >
                  <div className={`p-3 rounded-xl transition-all ${
                    learningType === "ielts" ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600"
                  }`}>
                    <GraduationCap size={22} />
                  </div>
                  <span className="font-extrabold text-sm block">IELTS Academic</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase hidden sm:block">Target Band Score Focus</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLearningType("general")}
                  className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all text-center relative group ${
                    learningType === "general" 
                      ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-md shadow-indigo-100/30" 
                      : "border-slate-100 bg-slate-50/50 text-slate-500 hover:border-slate-200"
                  }`}
                >
                  <div className={`p-3 rounded-xl transition-all ${
                    learningType === "general" ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600"
                  }`}>
                    <BookOpen size={22} />
                  </div>
                  <span className="font-extrabold text-sm block">General English</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase hidden sm:block">CEFR Communication Levels</span>
                </button>
              </div>
            </div>

            {/* MILESTONE TARGETS */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                  <Target size={14} className="text-indigo-600" /> 2. Current Baseline Level
                </label>
                <div className="relative">
                  <select 
                    value={currentLevel}
                    onChange={(e) => setCurrentLevel(e.target.value)}
                    className="w-full h-14 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/50 rounded-2xl px-4 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
                  >
                    {(learningType === "ielts" ? ieltsBands : cefrLevels).map(l => (
                      <option key={l} value={l}>Level {l}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 font-bold text-xs">▼</div>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                  <Sparkles size={14} className="text-indigo-600" /> 3. Desired Milestone Goal
                </label>
                <div className="relative">
                  <select 
                    value={targetLevel}
                    onChange={(e) => setTargetLevel(e.target.value)}
                    className="w-full h-14 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/50 rounded-2xl px-4 font-bold text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
                  >
                    {(learningType === "ielts" ? ieltsBands : cefrLevels).map(l => (
                      <option key={l} value={l}>Level {l}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 font-bold text-xs">▼</div>
                </div>
              </div>
            </div>

            {/* DETAILED SKILL GRIDS */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                4. Specify Current Skill Performance
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(skills).map(([skill, value]) => (
                  <div key={skill} className="bg-slate-50/50 border border-slate-200/30 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {skill === 'speaking' && <Mic size={14} className="text-rose-500" />}
                      {skill === 'listening' && <Headphones size={14} className="text-violet-500" />}
                      {skill === 'reading' && <BookOpen size={14} className="text-emerald-500" />}
                      {skill === 'writing' && <PenTool size={14} className="text-amber-500" />}
                      <span>{skill}</span>
                    </div>
                    <div className="relative">
                      <select
                        value={value}
                        onChange={(e) => setSkills({...skills, [skill]: e.target.value})}
                        className="w-full h-10 bg-white border border-slate-200/50 rounded-xl px-2.5 font-bold text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer appearance-none"
                      >
                        {(learningType === "ielts" ? ieltsBands : cefrLevels).map(l => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 font-bold text-[9px]">▼</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SUBMIT ENGINE ACTION */}
            <button 
              type="submit" 
              disabled={isPending}
              className="w-full h-16 bg-gradient-to-r from-slate-900 to-indigo-950 hover:from-black hover:to-indigo-900 text-white rounded-2xl font-black text-base shadow-lg shadow-indigo-950/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] cursor-pointer mt-4"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
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
