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
  
  // Preview State
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

    setTimeout(() => {
      setCrawlProgress(35)
      setCrawlStage("Đang bóc tách tệp âm thanh YouTube & cào transcript...")
      
      setTimeout(() => {
        setCrawlProgress(70)
        setCrawlStage("Đang đồng bộ tọa độ mốc thời gian phụ đề (startTime ➔ endTime)...")
        
        setTimeout(() => {
          setCrawlProgress(100)
          setCrawlStage("Hoàn thành bóc tách học liệu YouTube!")
          
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
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Quản lý Học liệu YouTube Shadowing</h2>
        <p className="text-slate-500 text-sm mt-2 font-medium">
          Dán liên kết video YouTube để cào phụ đề tự động, phân hoạch timeline và đồng bộ karaoke hỗ trợ luyện phát âm.
        </p>
      </div>

      {/* IMPORT & CRAWLER BOX */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6 relative overflow-hidden">
        {/* Visual red YouTube banner accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-red-500 to-indigo-600"></div>

        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Youtube className="w-6 h-6 text-red-650" />
            Nhập bài luyện phát âm mới từ YouTube
          </h3>
          <p className="text-slate-500 text-xs mt-1.5 font-medium">
            AI Crawler sẽ bóc tách và phân luồng phụ đề, gán mốc giây tự động từ video gốc.
          </p>
        </div>

        {/* Input Form */}
        {!crawledData && !isCrawling && (
          <form onSubmit={handleStartCrawl} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input 
                type="url"
                required
                placeholder="Dán link YouTube (Ví dụ: https://www.youtube.com/watch?v=...) tại đây"
                value={ytLink}
                onChange={(e) => setYtLink(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-800 placeholder-slate-450 focus:outline-none focus:border-red-500 transition-all font-mono font-medium"
              />
              <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
            </div>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-550 text-white font-bold py-3 px-6 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow hover:shadow-red-500/10 cursor-pointer shrink-0"
            >
              <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
              Tải phụ đề tự động
            </button>
          </form>
        )}

        {/* Crawling Progress */}
        {isCrawling && (
          <div className="space-y-4 py-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-500 flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                {crawlStage}
              </span>
              <span className="text-indigo-650 font-extrabold">{crawlProgress}%</span>
            </div>
            
            <div className="w-full bg-slate-100 rounded-full h-2 border border-slate-200/50">
              <div 
                className="bg-gradient-to-r from-red-600 to-indigo-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${crawlProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* CRAWL SUCCESS PREVIEW PANEL */}
        {crawledData && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 border border-emerald-100 rounded-lg flex items-center gap-1 uppercase tracking-wider">
                <Check className="w-3.5 h-3.5" />
                Dữ liệu bóc tách sẵn sàng
              </span>
              <button 
                onClick={() => setCrawledData(null)}
                className="text-slate-500 hover:text-slate-800 text-xs font-bold flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg cursor-pointer"
              >
                Hủy bỏ
              </button>
            </div>

            {/* Editable title */}
            <div>
              <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Tiêu đề bài phát âm</label>
              <input 
                type="text"
                value={crawledData.title}
                onChange={(e) => setCrawledData({ ...crawledData, title: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-850 focus:outline-none focus:border-indigo-500 font-bold"
              />
            </div>

            {/* Paragraph */}
            <div>
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-2">Lời thoại mẫu (Paragraph)</span>
              <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs text-slate-700 leading-relaxed font-medium">
                {crawledData.paragraph}
              </div>
            </div>

            {/* Sentences with time stamps */}
            <div className="space-y-3">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">Phân chia timeline karaoke</span>
              
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {crawledData.sentences.map((sentence, idx) => (
                  <div key={sentence.id} className="grid grid-cols-12 gap-2 bg-white border border-slate-200 rounded-xl p-3 items-center">
                    <span className="col-span-1 text-slate-400 text-xs font-bold text-center">#{idx + 1}</span>
                    <input 
                      type="text"
                      value={sentence.text}
                      onChange={(e) => {
                        const newS = [...crawledData.sentences]
                        newS[idx].text = e.target.value
                        setCrawledData({ ...crawledData, sentences: newS })
                      }}
                      className="col-span-7 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-indigo-500"
                    />
                    <div className="col-span-4 flex items-center gap-1.5 justify-end">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <input 
                        type="number"
                        step="0.1"
                        value={sentence.startTime}
                        onChange={(e) => {
                          const newS = [...crawledData.sentences]
                          newS[idx].startTime = parseFloat(e.target.value) || 0
                          setCrawledData({ ...crawledData, sentences: newS })
                        }}
                        className="w-12 bg-slate-50 border border-slate-200 rounded-lg px-1.5 py-1 text-xs text-center text-indigo-650 font-bold focus:outline-none font-mono"
                      />
                      <span className="text-slate-400 text-xs">➔</span>
                      <input 
                        type="number"
                        step="0.1"
                        value={sentence.endTime}
                        onChange={(e) => {
                          const newS = [...crawledData.sentences]
                          newS[idx].endTime = parseFloat(e.target.value) || 0
                          setCrawledData({ ...crawledData, sentences: newS })
                        }}
                        className="w-12 bg-slate-50 border border-slate-200 rounded-lg px-1.5 py-1 text-xs text-center text-indigo-650 font-bold focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Action */}
            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={handleSaveTopic}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-2 transition-all shadow hover:shadow-indigo-500/10 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                Lưu vào thư viện học liệu
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SEARCH AND LIST OF ACTIVE LESSONS */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        {/* Header list */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Thư viện bài học Shadowing đang hoạt động ({filteredTopics.length})
          </h3>
          <div className="relative">
            <input 
              type="text"
              placeholder="Tìm bài Shadowing..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-850 focus:outline-none focus:border-indigo-500 w-60 font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>

        {/* List Grid */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTopics.length === 0 ? (
            <div className="col-span-2 py-8 text-center text-slate-400 font-semibold">
              Chưa có học liệu Shadowing nào được cào. Dán link video bên trên để cào ngay.
            </div>
          ) : (
            filteredTopics.map((topic) => (
              <div key={topic.id} className="bg-white border border-slate-100 rounded-2xl p-5 flex gap-4 hover:border-slate-200 transition-all duration-200 justify-between items-start group shadow-sm">
                <div className="space-y-2.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-red-50 text-red-500 rounded-lg flex shrink-0 border border-red-100">
                      <Play className="w-3.5 h-3.5 fill-red-500" />
                    </span>
                    <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{topic.title}</h4>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">{topic.paragraph}</p>
                  
                  <div className="flex flex-wrap gap-2 pt-1 font-semibold text-[9px] uppercase tracking-wider">
                    <span className="bg-slate-50 border border-slate-100 text-slate-500 px-2 py-0.5 rounded-lg">
                      {topic.sentencesCount} Câu nói
                    </span>
                    <span className="bg-slate-50 border border-slate-100 text-slate-500 px-2 py-0.5 rounded-lg">
                      {topic.vocabCount} Từ chính
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteTopic(topic.id)}
                  className="text-slate-400 hover:text-rose-600 p-2 hover:bg-rose-50 rounded-xl border border-transparent hover:border-rose-100 transition-all shrink-0 cursor-pointer"
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
