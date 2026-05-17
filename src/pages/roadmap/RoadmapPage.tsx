import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import MainLayout from "@/components/layout/MainLayout/MainLayout"
import { RoadmapDetailResponse, RoadmapNode } from "@/types/roadmap.types"
import { useRoadmap } from "@/hooks/useRoadmap"
import { 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  ChevronRight, 
  PlayCircle, 
  Star, 
  Sparkles, 
  Mic, 
  Headphones, 
  PenTool, 
  GraduationCap,
  Layers,
  HelpCircle,
  Video,
  Award,
  ArrowLeft
} from "lucide-react"
import mockRoadmap from "@/data/roadmap/ielts_5_to_6.json"
import "./style.css"

// Skill category mapping for styles & icons
const getSkillConfig = (type: string) => {
  switch (type) {
    case 'speaking':
      return {
        themeClass: 'speaking-theme',
        badgeClass: 'speaking-badge',
        icon: <Mic size={18} />,
        label: 'Speaking Focus'
      }
    case 'listening':
      return {
        themeClass: 'listening-theme',
        badgeClass: 'listening-badge',
        icon: <Headphones size={18} />,
        label: 'Listening Practice'
      }
    case 'reading':
      return {
        themeClass: 'reading-theme',
        badgeClass: 'reading-badge',
        icon: <BookOpen size={18} />,
        label: 'Reading Strategy'
      }
    case 'writing':
      return {
        themeClass: 'writing-theme',
        badgeClass: 'writing-badge',
        icon: <PenTool size={18} />,
        label: 'Writing Drill'
      }
    case 'foundation':
      return {
        themeClass: 'foundation-theme',
        badgeClass: 'foundation-badge',
        icon: <GraduationCap size={18} />,
        label: 'Core Foundation'
      }
    default:
      return {
        themeClass: 'foundation-theme',
        badgeClass: 'foundation-badge',
        icon: <Star size={18} />,
        label: 'Skill Module'
      }
  }
}

// Resource item type helper
const getResourceConfig = (type: string) => {
  switch (type) {
    case 'video':
      return {
        icon: <Video size={18} />,
        iconClass: 'video-icon',
        label: 'Video Lecture'
      }
    case 'quiz':
      return {
        icon: <HelpCircle size={18} />,
        iconClass: 'quiz-icon',
        label: 'Interactive Quiz'
      }
    case 'practice_test':
      return {
        icon: <Award size={18} />,
        iconClass: 'practice_test-icon',
        label: 'Practice Test'
      }
    case 'reading':
    default:
      return {
        icon: <BookOpen size={18} />,
        iconClass: 'reading-icon',
        label: 'Reading Material'
      }
  }
}

export default function RoadmapPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selectedNode, setSelectedNode] = useState<any>(null)

  // 1. TanStack Query integration
  const { data: serverRoadmap, isLoading, error } = useRoadmap(id || "")

  // 2. Dynamic state setup - Falls back elegantly to mock data if API is offline or not found
  const roadmap: RoadmapDetailResponse = (serverRoadmap || mockRoadmap) as any

  useEffect(() => {
    if (roadmap && roadmap.nodes && roadmap.nodes.length > 0) {
      // Preserve currently selected node if it still exists in the new roadmap, or select the first node by default
      const exists = roadmap.nodes.find(n => n.id === selectedNode?.id)
      if (!exists) {
        setSelectedNode(roadmap.nodes[0])
      }
    }
  }, [roadmap, selectedNode])

  // Progress stats calculation
  const totalNodes = roadmap?.nodes?.length || 0
  const completedNodes = roadmap?.nodes?.filter(n => n.isCompleted).length || 0
  const progressPercent = totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0

  // 3. RENDER STUNNING SKELETON SCREEN WHILE LOADING
  if (isLoading) {
    return (
      <MainLayout>
        <div className="bg-slate-50 min-h-screen relative overflow-hidden">
          <div className="glowing-bg-mesh"></div>
          <div className="roadmap-container relative z-10">
            {/* Header Skeleton */}
            <div className="mb-12">
              <div className="h-6 w-36 skeleton-pulse rounded-md mb-4"></div>
              <div className="h-10 w-96 skeleton-pulse rounded-lg mb-4"></div>
              <div className="h-5 w-full max-w-2xl skeleton-pulse rounded-md"></div>
            </div>

            {/* Dashboard Cards Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white/80 border border-slate-100 rounded-2xl p-6 h-28 skeleton-pulse"></div>
              ))}
            </div>

            {/* Content Skeleton */}
            <div className="roadmap-layout">
              {/* Timeline skeleton */}
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div className="w-8 h-8 rounded-full skeleton-pulse flex-shrink-0 mt-3"></div>
                    <div className="bg-white/80 border border-slate-100 rounded-3xl p-6 h-40 w-full skeleton-pulse"></div>
                  </div>
                ))}
              </div>
              {/* Detail panel skeleton */}
              <div className="bg-white/80 border border-slate-100 rounded-3xl p-8 h-[500px] skeleton-pulse"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="bg-slate-50 min-h-screen relative overflow-hidden">
        {/* Soft background decor mesh */}
        <div className="glowing-bg-mesh"></div>

        <div className="roadmap-container relative z-10">
          {/* HEADER NAV */}
          <button 
            onClick={() => navigate('/roadmap')}
            className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-sm mb-6"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Journeys
          </button>

          {/* MAIN HEADER WITH METRICS */}
          <div className="mb-12">
            <div className="flex items-center gap-3 text-indigo-600 font-extrabold text-sm uppercase tracking-wider mb-3">
              <Sparkles size={16} className="animate-pulse" />
              Dynamic Intelligent Journey
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
              {roadmap.title}
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
              {roadmap.description}
            </p>
          </div>

          {/* DYNAMIC PROGRESS DASHBOARD CARD GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {/* Metric 1 */}
            <div className="bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-3xl p-6 shadow-sm flex items-center gap-4">
              <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
                <Layers size={22} />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Duration</span>
                <span className="text-lg font-black text-slate-800">{roadmap.estimatedDuration}</span>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-3xl p-6 shadow-sm flex items-center gap-4">
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Completion</span>
                <span className="text-lg font-black text-slate-800">{completedNodes}/{totalNodes} Stages</span>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-3xl p-6 shadow-sm flex items-center gap-4">
              <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                <GraduationCap size={22} />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Current Level</span>
                <span className="text-lg font-black text-slate-800">Band {roadmap.currentLevel}</span>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-3xl p-6 shadow-sm flex items-center gap-4">
              <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
                <Star size={22} />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Goal Target</span>
                <span className="text-lg font-black text-slate-800 text-indigo-600">Band {roadmap.targetLevel}</span>
              </div>
            </div>
          </div>

          {/* PROGRESS PERCENT BAR */}
          <div className="bg-white/80 border border-slate-200/50 rounded-3xl p-6 mb-12 shadow-sm flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 w-full">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-slate-700">Journey Progression Gauge</span>
                <span className="text-sm font-black text-indigo-600">{progressPercent}% Unlocked</span>
              </div>
              <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 rounded-full"
                />
              </div>
            </div>
            <div className="px-6 py-2.5 bg-indigo-50 rounded-2xl text-xs font-extrabold text-indigo-700 uppercase tracking-wider">
              {progressPercent === 100 ? "Mastery Achieved!" : "Keep up the momentum!"}
            </div>
          </div>

          {/* TIMELINE LAYOUT SECTION */}
          <div className="roadmap-layout">
            {/* TIMELINE */}
            <div className="journey-timeline">
              {/* Visual timeline connectors */}
              <div className="journey-line">
                <div 
                  className="journey-line-progress" 
                  style={{ height: `${Math.max(10, progressPercent)}%` }}
                ></div>
              </div>

              {roadmap.nodes.map((node, index) => {
                const config = getSkillConfig(node.iconType)
                const isActive = selectedNode?.id === node.id

                return (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.12 }}
                    className={`node-item ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedNode(node)}
                  >
                    {/* Node connector dot */}
                    <div className={`node-dot ${config.themeClass} ${node.isCompleted ? 'completed' : ''}`}>
                      {node.isCompleted ? (
                        <CheckCircle2 size={16} />
                      ) : (
                        isActive && <div className="absolute w-5 h-5 bg-indigo-500 rounded-full animate-ping opacity-35"></div>
                      )}
                    </div>

                    {/* Node Interactive Card */}
                    <div className={`node-card ${config.themeClass}`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-black text-slate-400 tracking-wider bg-slate-100 py-1.5 px-3 rounded-xl uppercase">
                          {node.estimatedTime}
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-500">
                          {config.icon}
                          <span className="text-[11px] font-extrabold uppercase tracking-wider hidden sm:inline">
                            {config.label}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-2">
                        {node.title}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed mb-4">
                        {node.description}
                      </p>
                      
                      {/* Interactive focus skills */}
                      <div className="flex flex-wrap gap-2">
                        {node.focusSkills.map(f => (
                          <span key={f} className={`skill-badge ${config.badgeClass}`}>
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* DETAILS CONTAINER (STICKY ON RIGHT) */}
            <div className="detail-panel-container">
              <AnimatePresence mode="wait">
                {selectedNode && (
                  <motion.div
                    key={selectedNode.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className={`detail-panel ${getSkillConfig(selectedNode.iconType).themeClass}`}
                  >
                    <div className="mb-6">
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <span className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm shadow-indigo-100">
                          {selectedNode.isCompleted ? "Completed Module" : "Current Focus Zone"}
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-400 text-sm font-bold">
                          <Clock size={16} />
                          {selectedNode.estimatedTime}
                        </div>
                      </div>
                      <h2 className="detail-title mb-3">
                        {selectedNode.title}
                      </h2>
                      <p className="detail-desc leading-relaxed">
                        {selectedNode.description}
                      </p>
                    </div>

                    {/* FOCUS SKILLS */}
                    <div className="border-t border-slate-100 pt-6 mt-6">
                      <h4 className="detail-section-title">
                        <Star size={14} className="text-amber-500" /> Core Focus Area
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedNode.focusSkills.map((skill: string) => (
                          <div 
                            key={skill} 
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50/50 border border-indigo-100/50 text-indigo-700 rounded-xl font-bold text-xs"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                            {skill}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* RESOURCES */}
                    <div className="border-t border-slate-100 pt-6 mt-6">
                      <h4 className="detail-section-title">
                        <BookOpen size={14} className="text-indigo-500" /> Learning Material & Tasks ({selectedNode.resources.length})
                      </h4>
                      <div className="resource-list">
                        {selectedNode.resources.map((res: any, idx: number) => {
                          const resConfig = getResourceConfig(res.type)
                          return (
                            <div 
                              key={res.id || idx} 
                              onClick={() => {
                                // Dynamic router redirect depending on material type
                                if (res.type === 'video') {
                                  navigate(`/materials/grammar`)
                                } else if (res.type === 'reading') {
                                  navigate(`/materials/vocabulary`)
                                } else {
                                  navigate(`/practice`)
                                }
                              }}
                              className="resource-item group"
                            >
                              <div className={`resource-icon-container ${resConfig.iconClass} group-hover:scale-105 transition-transform`}>
                                {resConfig.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="resource-name truncate leading-snug">{res.title}</div>
                                <div className="text-[11px] text-slate-400 font-extrabold uppercase mt-0.5 tracking-wider">
                                  {resConfig.label}
                                </div>
                              </div>
                              <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-800 transition-colors flex-shrink-0" />
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* CALL TO ACTION BUTTON */}
                    <button 
                      onClick={() => navigate(`/practice`)}
                      className="launch-button"
                    >
                      {selectedNode.isCompleted ? "Review Completed Tasks" : "Launch Target Practice"}
                      <ChevronRight size={18} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
