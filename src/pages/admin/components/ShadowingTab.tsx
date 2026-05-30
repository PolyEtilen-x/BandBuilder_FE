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

  const handleSaveTopic = () => {
    if (!crawledData) return
    onAddTopic({
      title: crawledData.title,
      videoUrl: crawledData.videoUrl,
      paragraph: crawledData.paragraph,
      sentences: crawledData.sentences
    })

    setCrawledData(null)
    setYtLink("")
    setCrawlProgress(0)
  }

  return (
    <div className="space-y-10">
      {/* HEADER SECTION */}
      <div className="pb-4 border-b border-slate-100">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Quản lý Học liệu YouTube Shadowing</h2>
        <p className="text-slate-500 text-sm mt-2 font-medium">
          Dán liên kết video YouTube để cào phụ đề tự động, phân hoạch timeline và đồng bộ karaoke hỗ trợ luyện phát âm.
        </p>
      </div>

      {/* IMPORT & CRAWLER BOX - Spacious card padding */}
      <div className="bg-white border border-slate-100 rounded-[24px] p-8 shadow-sm space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-red-500 to-[#174593]"></div>

        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2.5">
            <Youtube className="w-6 h-6 text-red-600" />
            Nhập bài luyện phát âm mới từ YouTube
          </h3>
          <p className="text-slate-500 text-xs mt-2 font-semibold">
            AI Crawler sẽ bóc tách và phân luồng phụ đề, gán mốc giây tự động từ video gốc.
          </p>
        </div>

        {/* Input Form */}
        {!crawledData && !isCrawling && (
          <form onSubmit={handleStartCrawl} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <input 
                type="url"
                required
                placeholder="Dán link YouTube (Ví dụ: https://www.youtube.com/watch?v=...) tại đây"
                value={ytLink}
                onChange={(e) => setYtLink(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3.5 text-xs text-slate-800 placeholder-slate-450 focus:outline-none focus:border-[#174593] transition-all font-mono font-bold shadow-sm"
              />
              <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-4.5" />
            </div>
            <button
              type="submit"
              className="bg-[#174593] hover:bg-[#1a51ad] text-white font-bold py-3.5 px-6 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow hover:shadow-indigo-500/10 cursor-pointer shrink-0"
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
                <Loader2 className="w-4.5 h-4.5 text-[#174593] animate-spin" />
                {crawlStage}
              </span>
              <span className="text-[#174593] font-extrabold">{crawlProgress}%</span>
            </div>
            
            <div className="w-full bg-slate-100 rounded-full h-2.5 border border-slate-200/50">
              <div 
                className="bg-gradient-to-r from-red-650 to-[#174593] h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${crawlProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* CRAWL SUCCESS PREVIEW PANEL */}
        {crawledData && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1.5 border border-emerald-100 rounded-xl flex items-center gap-1.5 uppercase tracking-wider">
                <Check className="w-3.5 h-3.5" />
                Dữ liệu bóc tách sẵn sàng
              </span>
              <button 
                onClick={() => setCrawledData(null)}
                className="text-slate-500 hover:text-slate-800 text-xs font-bold flex items-center gap-1 bg-white border border-slate-200 px-3 py-2 rounded-xl cursor-pointer"
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
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-850 focus:outline-none focus:border-[#174593] font-bold"
              />
            </div>

            {/* Paragraph */}
            <div>
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-2">Lời thoại mẫu (Paragraph)</span>
              <div className="bg-white border border-slate-200 rounded-2xl p-5 text-xs text-slate-700 leading-relaxed font-semibold">
                {crawledData.paragraph}
              </div>
            </div>

            {/* Sentences with time stamps */}
            <div className="space-y-3">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">Phân chia timeline karaoke</span>
              
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {crawledData.sentences.map((sentence, idx) => (
                  <div key={sentence.id} className="grid grid-cols-12 gap-3 bg-white border border-slate-200 rounded-2xl p-4 items-center">
                    <span className="col-span-1 text-slate-400 text-xs font-bold text-center">#{idx + 1}</span>
                    <input 
                      type="text"
                      value={sentence.text}
                      onChange={(e) => {
                        const newS = [...crawledData.sentences]
                        newS[idx].text = e.target.value
                        setCrawledData({ ...crawledData, sentences: newS })
                      }}
                      className="col-span-7 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-850 font-semibold focus:outline-none focus:border-[#174593]"
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
                className="bg-[#174593] hover:bg-[#1a51ad] text-white font-bold py-3 px-6 rounded-xl text-xs flex items-center gap-2 transition-all shadow hover:shadow-indigo-500/10 cursor-pointer animate-pulse"
              >
                <Check className="w-4 h-4" />
                Lưu vào thư viện học liệu
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SEARCH AND LIST OF ACTIVE LESSONS - Expanded spacing */}
      <div className="bg-white border border-slate-100 rounded-[28px] shadow-sm overflow-hidden p-2">
        {/* Header list */}
        <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/20 rounded-t-[26px]">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5.5 h-5.5 text-[#174593]" />
            Thư viện bài học Shadowing đang hoạt động ({filteredTopics.length})
          </h3>
          <div className="relative">
            <input 
              type="text"
              placeholder="Tìm bài Shadowing..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-850 focus:outline-none focus:border-[#174593] w-64 font-semibold shadow-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          </div>
        </div>

        {/* List Grid */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white">
          {filteredTopics.length === 0 ? (
            <div className="col-span-2 py-12 text-center text-slate-400 font-bold bg-slate-50/10 rounded-2xl">
              Chưa có học liệu Shadowing nào được cào. Dán link video bên trên để cào ngay.
            </div>
          ) : (
            filteredTopics.map((topic) => (
              <div key={topic.id} className="bg-white border border-slate-100 rounded-[24px] p-6.5 flex gap-4.5 hover:border-slate-200 transition-all duration-300 justify-between items-start shadow-sm hover:shadow-md hover:-translate-y-1">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 bg-red-50 text-red-500 rounded-xl flex shrink-0 border border-red-100">
                      <Play className="w-4 h-4 fill-red-500 text-red-550" />
                    </span>
                    <h4 className="text-base font-bold text-slate-850 line-clamp-1">{topic.title}</h4>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-semibold">{topic.paragraph}</p>
                  
                  <div className="flex flex-wrap gap-2.5 pt-1.5 font-bold text-[9px] uppercase tracking-wider">
                    <span className="bg-slate-50 border border-slate-100 text-slate-500 px-2.5 py-1 rounded-xl shadow-sm">
                      {topic.sentencesCount} Câu nói
                    </span>
                    <span className="bg-slate-50 border border-slate-100 text-slate-500 px-2.5 py-1 rounded-xl shadow-sm">
                      {topic.vocabCount} Từ chính
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteTopic(topic.id)}
                  className="text-slate-400 hover:text-rose-600 p-2 hover:bg-rose-50 rounded-xl border border-transparent hover:border-rose-100 transition-all shrink-0 cursor-pointer"
                  title="Xoá học liệu"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
