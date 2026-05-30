// src/pages/admin/components/ShadowingTab.tsx

import { useState } from "react"
import { ShadowingTopic, ShadowingSentence } from "../types"
import { 
  Youtube, 
  Search, 
  Trash2, 
  Link as LinkIcon, 
  Sparkles, 
  FileText, 
  Check, 
  Loader2,
  Clock,
  Play
} from "lucide-react"

interface Props {
  topics: ShadowingTopic[]
  onAddTopic: (topic: Omit<ShadowingTopic, "id" | "vocabCount" | "sentencesCount">) => void
  onDeleteTopic: (id: string) => void
}

export default function ShadowingTab({ topics, onAddTopic, onDeleteTopic }: Props) {
  const [searchTerm, setSearchTerm] = useState("")
  const [ytLink, setYtLink] = useState("")
  
  // Crawler Simulation State
  const [crawlProgress, setCrawlProgress] = useState(0)
  const [crawlStage, setCrawlStage] = useState("")
  const [isCrawling, setIsCrawling] = useState(false)
  
  // Preview State (after crawl finishes)
  const [crawledData, setCrawledData] = useState<{
    title: string
    paragraph: string
    videoUrl: string
    sentences: ShadowingSentence[]
  } | null>(null)

  // Filter list
  const filteredTopics = topics.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.paragraph.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Start Simulated Crawling
  const handleStartCrawl = (e: React.FormEvent) => {
    e.preventDefault()
    if (!ytLink.trim()) return

    setIsCrawling(true)
    setCrawlProgress(10)
    setCrawlStage("Đang kết nối YouTube API & tải phụ đề gốc...")

    // Stage 1: metadata
    setTimeout(() => {
      setCrawlProgress(35)
      setCrawlStage("Đang bóc tách tệp âm thanh YouTube & cào transcript...")
      
      // Stage 2: parse sentences
      setTimeout(() => {
        setCrawlProgress(70)
        setCrawlStage("Đang đồng bộ tọa độ mốc thời gian phụ đề (startTime ➔ endTime)...")
        
        // Stage 3: completion
        setTimeout(() => {
          setCrawlProgress(100)
          setCrawlStage("Hoàn thành bóc tách học liệu YouTube!")
          
          // Generate simulated result
          const videoId = ytLink.includes("v=") 
            ? ytLink.split("v=")[1].split("&")[0] 
            : ytLink.split("youtu.be/")[1]?.split("?")[0] || "dQw4w9WgXcQ"

          const mockTitle = `Shadowing IELTS Speaking Part 2: ${videoId.slice(0, 5).toUpperCase()} Lesson`
          const mockParagraph = "In my opinion, learning English is an incredible journey. It opens up multiple international doors. Especially when studying IELTS, speaking requires natural intonation and proper grammar. I highly recommend shadowing standard videos every day."

          const mockSentences: ShadowingSentence[] = [
            { id: "s1", text: "In my opinion, learning English is an incredible journey.", startTime: 1.2, endTime: 4.5, orderIndex: 1 },
            { id: "s2", text: "It opens up multiple international doors.", startTime: 4.8, endTime: 7.2, orderIndex: 2 },
            { id: "s3", text: "Especially when studying IELTS, speaking requires natural intonation.", startTime: 7.6, endTime: 11.4, orderIndex: 3 },
            { id: "s4", text: "I highly recommend shadowing standard videos every day.", startTime: 11.8, endTime: 15.0, orderIndex: 4 },
          ]

          setCrawledData({
            title: mockTitle,
            paragraph: mockParagraph,
            videoUrl: `https://www.youtube.com/embed/${videoId}`,
            sentences: mockSentences
          })
          
          setIsCrawling(false)
        }, 1200)
      }, 1200)
    }, 1000)
  }

  // Handle Save Crawled Topic
  const handleSaveTopic = () => {
    if (!crawledData) return
    onAddTopic({
      title: crawledData.title,
      videoUrl: crawledData.videoUrl,
      paragraph: crawledData.paragraph,
      sentences: crawledData.sentences
    })

    // Reset fields
    setCrawledData(null)
    setYtLink("")
    setCrawlProgress(0)
  }

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Quản lý Học liệu Shadowing ( YouTube )</h2>
        <p className="text-slate-400 text-sm mt-1">
          Cung cấp công cụ cào phụ đề tự động (Crawl YouTube Transcript) từ đường link video để lập tức sinh bài luyện phát âm đồng bộ thời gian.
        </p>
      </div>

      {/* IMPORT & CRAWLER BOX */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 relative overflow-hidden">
        {/* Glowing border accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-orange-500 to-indigo-600"></div>

        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Youtube className="w-6 h-6 text-red-500" />
            Nhập bài học mới từ Video YouTube
          </h3>
          <p className="text-slate-400 text-xs mt-1">
            Chỉ cần dán liên kết video, AI Crawler của BandBuilder sẽ tự bóc tách phụ đề và chia mốc giây karaoke.
          </p>
        </div>

        {/* Input Form */}
        {!crawledData && !isCrawling && (
          <form onSubmit={handleStartCrawl} className="flex gap-3">
            <div className="relative flex-1">
              <input 
                type="url"
                required
                placeholder="Dán link YouTube (Ví dụ: https://www.youtube.com/watch?v=...) tại đây"
                value={ytLink}
                onChange={(e) => setYtLink(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-all font-mono"
              />
              <LinkIcon className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-xl text-sm flex items-center gap-2 transition-all shadow-lg hover:shadow-red-500/20 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              Tải Transcript tự động
            </button>
          </form>
        )}

        {/* Crawling Progress */}
        {isCrawling && (
          <div className="space-y-4 py-4 animate-pulse">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-2 font-medium">
                <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                {crawlStage}
              </span>
              <span className="text-indigo-400 font-extrabold">{crawlProgress}%</span>
            </div>
            
            {/* Dynamic Progress Bar */}
            <div className="w-full bg-slate-900 rounded-full h-2 border border-slate-800">
              <div 
                className="bg-gradient-to-r from-red-600 to-indigo-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${crawlProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* CRAWL SUCCESS PREVIEW PANEL */}
        {crawledData && (
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/10 rounded flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Cào dữ liệu YouTube thành công!
              </span>
              <button 
                onClick={() => setCrawledData(null)}
                className="text-slate-400 hover:text-white text-xs font-bold flex items-center gap-1 bg-slate-800 px-2 py-1 rounded"
              >
                Hủy bỏ
              </button>
            </div>

            {/* Editable title */}
            <div>
              <label className="block text-slate-400 text-xs font-semibold mb-1">Tiêu đề Bài học Phát âm</label>
              <input 
                type="text"
                value={crawledData.title}
                onChange={(e) => setCrawledData({ ...crawledData, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Paragraph transcript display */}
            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-1">Đoạn văn mẫu (Paragraph)</span>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-300 leading-relaxed font-sans">
                {crawledData.paragraph}
              </div>
            </div>

            {/* Sentences with time stamps */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-400 block">Đồng bộ mốc thời gian Karaoke (Karaoke Timeline)</span>
              
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {crawledData.sentences.map((sentence, idx) => (
                  <div key={sentence.id} className="grid grid-cols-12 gap-2 bg-slate-950 border border-slate-900 rounded-lg p-2.5 items-center">
                    <span className="col-span-1 text-slate-500 text-xs font-bold text-center">#{idx + 1}</span>
                    <input 
                      type="text"
                      value={sentence.text}
                      onChange={(e) => {
                        const newS = [...crawledData.sentences]
                        newS[idx].text = e.target.value
                        setCrawledData({ ...crawledData, sentences: newS })
                      }}
                      className="col-span-7 bg-slate-900 border border-slate-850 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                    <div className="col-span-4 flex items-center gap-1.5 justify-end">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <input 
                        type="number"
                        step="0.1"
                        value={sentence.startTime}
                        onChange={(e) => {
                          const newS = [...crawledData.sentences]
                          newS[idx].startTime = parseFloat(e.target.value) || 0
                          setCrawledData({ ...crawledData, sentences: newS })
                        }}
                        className="w-12 bg-slate-900 border border-slate-850 rounded px-1.5 py-1 text-xs text-center text-indigo-400 font-bold focus:outline-none font-mono"
                        title="Start Time (giây)"
                      />
                      <span className="text-slate-500 text-xs">➔</span>
                      <input 
                        type="number"
                        step="0.1"
                        value={sentence.endTime}
                        onChange={(e) => {
                          const newS = [...crawledData.sentences]
                          newS[idx].endTime = parseFloat(e.target.value) || 0
                          setCrawledData({ ...crawledData, sentences: newS })
                        }}
                        className="w-12 bg-slate-900 border border-slate-850 rounded px-1.5 py-1 text-xs text-center text-indigo-400 font-bold focus:outline-none font-mono"
                        title="End Time (giây)"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Action */}
            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={handleSaveTopic}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-6 rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg hover:shadow-indigo-500/20 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                Lưu Học Liệu Phát Âm
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SEARCH AND LIST OF ACTIVE LESSONS */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
        {/* Header list filter */}
        <div className="p-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/30">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            Thư viện bài học Shadowing đang hoạt động ({filteredTopics.length})
          </h3>
          <div className="relative">
            <input 
              type="text"
              placeholder="Tìm bài Shadowing..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-64"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          </div>
        </div>

        {/* List Grid table */}
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTopics.length === 0 ? (
            <div className="col-span-2 py-8 text-center text-slate-500">
              Không tìm thấy bài luyện phát âm nào. Hãy dán link YouTube bên trên để cào transcript bài mới!
            </div>
          ) : (
            filteredTopics.map((topic) => (
              <div key={topic.id} className="bg-slate-900/30 border border-slate-850 rounded-xl p-4 flex gap-4 hover:border-slate-700 transition-all duration-200 justify-between items-start group">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-red-500/10 text-red-400 rounded-lg flex shrink-0">
                      <Play className="w-4 h-4 fill-red-400" />
                    </span>
                    <h4 className="text-sm font-bold text-white line-clamp-1">{topic.title}</h4>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{topic.paragraph}</p>
                  
                  <div className="flex flex-wrap gap-2 pt-1.5 text-[10px] font-semibold">
                    <span className="bg-slate-950 border border-slate-800 text-slate-400 px-2 py-0.5 rounded">
                      {topic.sentencesCount} Câu phát âm
                    </span>
                    <span className="bg-slate-950 border border-slate-800 text-slate-400 px-2 py-0.5 rounded">
                      {topic.vocabCount} Từ vựng cốt lõi
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteTopic(topic.id)}
                  className="text-slate-500 hover:text-rose-400 p-1.5 hover:bg-rose-500/10 rounded-lg border border-transparent hover:border-rose-500/10 transition-all shrink-0 cursor-pointer"
                  title="Xoá học liệu"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
