import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import MainLayout from "@/components/layout/MainLayout/MainLayout"
import { RoadmapDetailResponse, RoadmapNode } from "@/types/roadmap.types"
import { useRoadmap } from "@/hooks/useRoadmap"
import { useUIStore } from "@/services/ui/ui.store"
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

// Skill category mapping for styles & icons (with dynamic translation t)
const getSkillConfig = (type: string, t: any) => {
  switch (type) {
    case 'speaking':
      return {
        themeClass: 'speaking-theme',
        badgeClass: 'speaking-badge',
        icon: <Mic size={18} />,
        label: t("skill_speaking")
      }
    case 'listening':
      return {
        themeClass: 'listening-theme',
        badgeClass: 'listening-badge',
        icon: <Headphones size={18} />,
        label: t("skill_listening")
      }
    case 'reading':
      return {
        themeClass: 'reading-theme',
        badgeClass: 'reading-badge',
        icon: <BookOpen size={18} />,
        label: t("skill_reading")
      }
    case 'writing':
      return {
        themeClass: 'writing-theme',
        badgeClass: 'writing-badge',
        icon: <PenTool size={18} />,
        label: t("skill_writing")
      }
    case 'foundation':
      return {
        themeClass: 'foundation-theme',
        badgeClass: 'foundation-badge',
        icon: <GraduationCap size={18} />,
        label: t("skill_foundation")
      }
    default:
      return {
        themeClass: 'foundation-theme',
        badgeClass: 'foundation-badge',
        icon: <Star size={18} />,
        label: t("skill_default")
      }
  }
}

// Resource item type helper (with dynamic translation t)
const getResourceConfig = (type: string, t: any) => {
  switch (type) {
    case 'video':
      return {
        icon: <Video size={18} />,
        iconClass: 'video-icon',
        label: t("res_video")
      }
    case 'quiz':
      return {
        icon: <HelpCircle size={18} />,
        iconClass: 'quiz-icon',
        label: t("res_quiz")
      }
    case 'practice_test':
      return {
        icon: <Award size={18} />,
        iconClass: 'practice_test-icon',
        label: t("res_practice")
      }
    case 'reading':
    default:
      return {
        icon: <BookOpen size={18} />,
        iconClass: 'reading-icon',
        label: t("res_reading")
      }
  }
}

export default function RoadmapPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selectedNode, setSelectedNode] = useState<any>(null)

  // i18n & Theme Stores
  const { t, theme } = useUIStore()

  // 1. TanStack Query integration
  const { data: serverRoadmap, isLoading, error } = useRoadmap(id || "")

  // 2. Dynamic state setup - Falls back elegantly to mock data if API is offline
  const roadmap: RoadmapDetailResponse = (serverRoadmap || mockRoadmap) as any

  useEffect(() => {
    if (roadmap && roadmap.nodes && roadmap.nodes.length > 0) {
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
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen relative overflow-hidden transition-colors duration-300">
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
                <div key={i} className="bg-white/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 h-28 skeleton-pulse"></div>
              ))}
            </div>

            {/* Content Skeleton */}
            <div className="roadmap-layout">
              {/* Timeline skeleton */}
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div className="w-8 h-8 rounded-full skeleton-pulse flex-shrink-0 mt-3"></div>
                    <div className="bg-white/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 h-40 w-full skeleton-pulse"></div>
                  </div>
                ))}
              </div>
              {/* Detail panel skeleton */}
              <div className="bg-white/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 h-[500px] skeleton-pulse"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen relative overflow-hidden transition-colors duration-300">
        {/* Soft background decor mesh */}
        <div className="glowing-bg-mesh"></div>

        <div className="roadmap-container relative z-10">
          {/* HEADER NAV */}
          <button 
            onClick={() => navigate('/roadmap')}
            className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors font-bold text-sm mb-6 cursor-pointer"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            {t("roadmap_back")}
          </button>

          {/* MAIN HEADER WITH METRICS */}
          <div className="mb-12">
            <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 font-extrabold text-sm uppercase tracking-wider mb-3">
              <Sparkles size={16} className="animate-pulse" />
              {t("roadmap_sub")}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight mb-4">
              {roadmap.title}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl leading-relaxed">
              {roadmap.description}
            </p>
          </div>

          {/* DYNAMIC PROGRESS DASHBOARD CARD GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {/* Metric 1 */}
            <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm flex items-center gap-4 transition-colors">
              <div className="p-4 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                <Layers size={22} />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  {t("roadmap_duration")}
                </span>
                <span className="text-lg font-black text-slate-800 dark:text-slate-200">{roadmap.estimatedDuration}</span>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm flex items-center gap-4 transition-colors">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  {t("roadmap_completion")}
                </span>
                <span className="text-lg font-black text-slate-800 dark:text-slate-200">
                  {completedNodes}/{totalNodes} {t("roadmap_stages")}
                </span>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm flex items-center gap-4 transition-colors">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-2xl">
                <GraduationCap size={22} />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  {t("roadmap_current_level")}
                </span>
                <span className="text-lg font-black text-slate-800 dark:text-slate-200">Band {roadmap.currentLevel}</span>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm flex items-center gap-4 transition-colors">
              <div className="p-4 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-2xl">
                <Star size={22} />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  {t("roadmap_target_level")}
                </span>
                <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">Band {roadmap.targetLevel}</span>
              </div>
            </div>
          </div>

          {/* PROGRESS PERCENT BAR */}
          <div className="bg-white/80 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 mb-12 shadow-sm flex flex-col md:flex-row items-center gap-6 transition-colors">
            <div className="flex-1 w-full">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-350">{t("roadmap_gauge")}</span>
                <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                  {progressPercent}% {t("roadmap_unlocked")}
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3.5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 rounded-full"
                />
              </div>
            </div>
            <div className="px-6 py-2.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl text-xs font-extrabold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider transition-colors">
              {progressPercent === 100 ? t("roadmap_mastery") : t("roadmap_keep_momentum")}
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
                const config = getSkillConfig(node.iconType, t)
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
                        <span className="text-xs font-black text-slate-400 dark:text-slate-500 tracking-wider bg-slate-100 dark:bg-slate-800/80 py-1.5 px-3 rounded-xl uppercase">
                          {node.estimatedTime}
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                          {config.icon}
                          <span className="text-[11px] font-extrabold uppercase tracking-wider hidden sm:inline">
                            {config.label}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-150 mb-2 transition-colors">
                        {node.title}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4 transition-colors">
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
                    className={`detail-panel ${getSkillConfig(selectedNode.iconType, t).themeClass}`}
                  >
                    <div className="mb-6">
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <span className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm shadow-indigo-100 dark:shadow-none">
                          {selectedNode.isCompleted ? t("roadmap_completed_module") : t("roadmap_currently_focusing")}
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-sm font-bold">
                          <Clock size={16} />
                          {selectedNode.estimatedTime}
                        </div>
                      </div>
                      <h2 className="detail-title mb-3 dark:text-slate-100 transition-colors">
                        {selectedNode.title}
                      </h2>
                      <p className="detail-desc dark:text-slate-400 leading-relaxed transition-colors">
                        {selectedNode.description}
                      </p>
                    </div>

                    {/* FOCUS SKILLS */}
                    <div className="border-t border-slate-100 dark:border-slate-800/80 pt-6 mt-6">
                      <h4 className="detail-section-title">
                        <Star size={14} className="text-amber-500" /> {t("roadmap_core_focus")}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedNode.focusSkills.map((skill: string) => (
                          <div 
                            key={skill} 
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-xl font-bold text-xs transition-colors"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></div>
                            {skill}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* RESOURCES */}
                    <div className="border-t border-slate-100 dark:border-slate-800/80 pt-6 mt-6">
                      <h4 className="detail-section-title">
                        <BookOpen size={14} className="text-indigo-500" /> {t("roadmap_lessons_resources")} ({selectedNode.resources.length})
                      </h4>
                      <div className="resource-list">
                        {selectedNode.resources.map((res: any, idx: number) => {
                          const resConfig = getResourceConfig(res.type, t)
                          return (
                            <div 
                              key={res.id || idx} 
                              onClick={() => {
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
                                <div className="resource-name truncate leading-snug dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                  {res.title}
                                </div>
                                <div className="text-[11px] text-slate-400 dark:text-slate-500 font-extrabold uppercase mt-0.5 tracking-wider">
                                  {resConfig.label}
                                </div>
                              </div>
                              <ChevronRight size={18} className="text-slate-300 dark:text-slate-600 group-hover:text-slate-800 dark:group-hover:text-slate-300 transition-colors flex-shrink-0" />
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* CALL TO ACTION BUTTON */}
                    <button 
                      onClick={() => navigate(`/practice`)}
                      className="launch-button cursor-pointer"
                    >
                      {selectedNode.isCompleted ? t("roadmap_review_tasks") : t("roadmap_launch_practice")}
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
