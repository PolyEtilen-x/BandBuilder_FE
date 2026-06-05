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
        const timer = setTimeout(() => {
          setSelectedNode(roadmap.nodes[0])
        }, 0)
        return () => clearTimeout(timer)
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
        <div className="roadmap-page-bg">
          <div className="glowing-bg-mesh"></div>
          <div className="roadmap-container relative z-10">
            {/* Header Skeleton */}
            <div style={{ marginBottom: "48px" }}>
              <div className="skeleton-pulse rounded-md mb-4" style={{ height: "24px", width: "144px" }}></div>
              <div className="skeleton-pulse rounded-lg mb-4" style={{ height: "40px", width: "384px" }}></div>
              <div className="skeleton-pulse rounded-md" style={{ height: "20px", width: "100%", maxWidth: "672px" }}></div>
            </div>

            {/* Dashboard Cards Skeleton */}
            <div className="roadmap-dashboard-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="roadmap-dashboard-card skeleton-pulse" style={{ height: "112px" }}></div>
              ))}
            </div>

            {/* Content Skeleton */}
            <div className="roadmap-layout">
              {/* Timeline skeleton */}
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="roadmap-skeleton-item">
                    <div className="roadmap-skeleton-dot skeleton-pulse"></div>
                    <div className="roadmap-skeleton-card skeleton-pulse"></div>
                  </div>
                ))}
              </div>
              {/* Detail panel skeleton */}
              <div className="detail-panel skeleton-pulse" style={{ height: "500px" }}></div>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="roadmap-page-bg">
        {/* Soft background decor mesh */}
        <div className="glowing-bg-mesh"></div>

        <div className="roadmap-container relative z-10">
          {/* HEADER NAV */}
          <button 
            onClick={() => navigate('/roadmap')}
            className="roadmap-header-nav"
          >
            <ArrowLeft size={16} className="roadmap-nav-arrow" />
            {t("roadmap_back")}
          </button>

          {/* MAIN HEADER WITH METRICS */}
          <div style={{ marginBottom: "48px" }}>
            <div className="roadmap-hero-badge">
              <Sparkles size={16} className="roadmap-nav-arrow" />
              {t("roadmap_sub")}
            </div>
            <h1 className="roadmap-main-title">
              {roadmap.title}
            </h1>
            <p className="roadmap-main-desc">
              {roadmap.description}
            </p>
          </div>

          {/* DYNAMIC PROGRESS DASHBOARD CARD GRID */}
          <div className="roadmap-dashboard-grid">
            {/* Metric 1 */}
            <div className="roadmap-dashboard-card">
              <div className="roadmap-dashboard-icon-wrap indigo">
                <Layers size={22} />
              </div>
              <div>
                <span className="roadmap-dashboard-label">
                  {t("roadmap_duration")}
                </span>
                <span className="roadmap-dashboard-val">{roadmap.estimatedDuration}</span>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="roadmap-dashboard-card">
              <div className="roadmap-dashboard-icon-wrap emerald">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <span className="roadmap-dashboard-label">
                  {t("roadmap_completion")}
                </span>
                <span className="roadmap-dashboard-val">
                  {completedNodes}/{totalNodes} {t("roadmap_stages")}
                </span>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="roadmap-dashboard-card">
              <div className="roadmap-dashboard-icon-wrap blue">
                <GraduationCap size={22} />
              </div>
              <div>
                <span className="roadmap-dashboard-label">
                  {t("roadmap_current_level")}
                </span>
                <span className="roadmap-dashboard-val">Band {roadmap.currentLevel}</span>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="roadmap-dashboard-card">
              <div className="roadmap-dashboard-icon-wrap amber">
                <Star size={22} />
              </div>
              <div>
                <span className="roadmap-dashboard-label">
                  {t("roadmap_target_level")}
                </span>
                <span className="roadmap-dashboard-val target">Band {roadmap.targetLevel}</span>
              </div>
            </div>
          </div>

          {/* PROGRESS PERCENT BAR */}
          <div className="roadmap-progress-card">
            <div className="roadmap-progress-details">
              <div className="roadmap-progress-text-row">
                <span className="roadmap-progress-title">{t("roadmap_gauge")}</span>
                <span className="roadmap-progress-percent">
                  {progressPercent}% {t("roadmap_unlocked")}
                </span>
              </div>
              <div className="roadmap-progress-bar-bg">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="roadmap-progress-bar-fill"
                />
              </div>
            </div>
            <div className="roadmap-progress-badge">
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
                                  navigate(`/practice-ielts`)
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
                      onClick={() => navigate(`/practice-ielts`)}
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
