import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import MainLayout from "@/components/layout/MainLayout/MainLayout"
import { useRoadmap } from "@/hooks/useRoadmap"
import { Roadmap, RoadmapNode } from "@/types/roadmap.types"
import { Clock, BookOpen, CheckCircle2, ChevronRight, PlayCircle, Star, Sparkles } from "lucide-react"
import mockRoadmap from "@/data/roadmap/ielts_5_to_6.json"
import "./style.css"

export default function RoadmapPage() {
  const { id } = useParams()
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null)
  
  // In a real app, we would use the hook:
  // const { data: roadmap, isLoading } = useRoadmap(id || "")
  
  // For demo, we use the mock data directly
  const roadmap: Roadmap = mockRoadmap as Roadmap

  useEffect(() => {
    if (roadmap.nodes.length > 0 && !selectedNode) {
      setSelectedNode(roadmap.nodes[0])
    }
  }, [roadmap])

  return (
    <MainLayout>
      <div className="bg-slate-50 min-h-screen">
        <div className="roadmap-container">
          {/* HEADER */}
          <div className="mb-12">
            <div className="flex items-center gap-3 text-blue-600 font-bold text-sm uppercase tracking-widest mb-2">
              <Sparkles size={18} />
              Personalized Journey
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-4">{roadmap.title}</h1>
            <p className="text-slate-500 text-lg max-w-2xl">{roadmap.description}</p>
          </div>

          <div className="roadmap-layout">
            {/* LEFT: TIMELINE */}
            <div className="journey-timeline">
              <div className="journey-line">
                <div className="journey-line-progress" style={{ height: '40%' }}></div>
              </div>

              {roadmap.nodes.map((node, index) => (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`node-item ${selectedNode?.id === node.id ? 'active' : ''}`}
                  onClick={() => setSelectedNode(node)}
                >
                  <div className="node-dot">
                    {index === 0 && <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>}
                  </div>
                  <div className="node-card">
                    <span className="node-tag">{node.estimatedTime}</span>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{node.title}</h3>
                    <p className="text-slate-500 text-sm line-clamp-2">{node.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      {node.focus.map(f => (
                        <span key={f} className="px-2 py-1 bg-slate-50 text-slate-500 rounded-md text-[10px] font-bold uppercase border border-slate-100">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* RIGHT: NODE DETAIL */}
            <div className="detail-panel-container">
              <AnimatePresence mode="wait">
                {selectedNode && (
                  <motion.div
                    key={selectedNode.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="detail-panel"
                  >
                    <div className="detail-header">
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-tighter">
                          Currently Focusing
                        </span>
                        <div className="flex items-center gap-2 text-slate-400 text-sm font-bold">
                          <Clock size={16} />
                          {selectedNode.estimatedTime}
                        </div>
                      </div>
                      <h2 className="detail-title">{selectedNode.title}</h2>
                      <p className="detail-desc">{selectedNode.description}</p>
                    </div>

                    <div className="detail-section">
                      <h4 className="detail-section-title">Key Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedNode.skills.map(skill => (
                          <div key={skill} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-bold text-sm">
                            <CheckCircle2 size={16} />
                            {skill}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="detail-section">
                      <h4 className="detail-section-title">Lessons & Resources</h4>
                      <div className="resource-list">
                        {selectedNode.resources.map((res, idx) => (
                          <div key={idx} className="resource-item group">
                            <div className="resource-icon group-hover:scale-110 transition-transform">
                              <PlayCircle size={20} />
                            </div>
                            <div className="flex-1">
                              <div className="resource-name">{res.replace('_', ' ')}</div>
                              <div className="text-[11px] text-slate-400 font-bold uppercase">Video Lesson • 15m</div>
                            </div>
                            <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                          </div>
                        ))}
                        <div className="resource-item group bg-amber-50/50 border-amber-100">
                          <div className="resource-icon text-amber-600 bg-white">
                            <Star size={20} />
                          </div>
                          <div className="flex-1">
                            <div className="resource-name text-amber-900 font-bold">Practice Exercises</div>
                            <div className="text-[11px] text-amber-600/60 font-bold uppercase">Quiz • 10 Questions</div>
                          </div>
                          <ChevronRight size={18} className="text-amber-300" />
                        </div>
                      </div>
                    </div>

                    <button className="w-full mt-8 h-14 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group">
                      Continue Learning
                      <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
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
