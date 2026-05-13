import { useMemo } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { usePracticeStore } from "@/services/practice/practice.store"
import { ArrowLeft, CheckCircle2, XCircle, HelpCircle, Clock, ChevronRight } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { practiceApi } from "@/api/practice.api"

export default function ResultPage() {
  const location = useLocation()
  const { id } = useParams()
  const navigate = useNavigate()
  const answers = usePracticeStore(state => state.answers)
  const clearAnswers = usePracticeStore(state => state.clearAnswers)

  // Lấy dữ liệu từ state hoặc fetch mới nếu refresh trang
  const stateData = location.state?.examData
  
  const { data: fetchedTest, isLoading } = useQuery({
    queryKey: ["practice-test", id],
    queryFn: () => practiceApi.getSkillPreview(id!).then(res => res.data),
    enabled: !stateData && !!id
  })

  // Chuẩn hóa dữ liệu
  const examData = useMemo(() => {
    if (stateData) return stateData
    if (fetchedTest) return fetchedTest
    return null
  }, [stateData, fetchedTest])

  const stats = useMemo(() => {
    if (!examData) return null

    let total = 0
    let correct = 0
    let skipped = 0
    const details: any[] = []

    // Xử lý linh hoạt các cấu trúc dữ liệu khác nhau của bài thi
    const sections = examData.sections || (examData.content?.passages ? examData.content.passages : [examData])

    sections.forEach((section: any) => {
      if (!section.question_blocks) return
      section.question_blocks.forEach((block: any) => {
        const type = block.question_type || "Questions"
        let blockTotal = 0
        let blockCorrect = 0

        const questions = block.questions || []
        questions.forEach((q: any) => {
          total++
          blockTotal++
          const userAns = answers[q.id]
          const isCorrect = userAns?.toString().trim().toLowerCase() === q.correct_answer?.toString().trim().toLowerCase()
          
          if (!userAns) skipped++
          else if (isCorrect) {
            correct++
            blockCorrect++
          }
        })

        if (blockTotal > 0) {
            const existing = details.find(d => d.type === type)
            if (existing) {
              existing.total += blockTotal
              existing.correct += blockCorrect
            } else {
              details.push({ type, total: blockTotal, correct: blockCorrect })
            }
        }
      })
    })

    const wrong = total - correct - skipped
    const score = total > 0 ? Math.round((correct / total) * 100) : 0
    
    return { total, correct, wrong, skipped, score, details }
  }, [examData, answers])

  if (isLoading) return <div className="flex items-center justify-center h-screen font-bold text-slate-500">Đang phân tích kết quả...</div>
  if (!stats || stats.total === 0) return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-slate-500 font-medium">Không tìm thấy dữ liệu câu hỏi để tính điểm.</p>
        <button onClick={() => navigate("/practice")} className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold">Quay lại</button>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 hover:text-[#174593] transition-colors font-semibold">
            <ArrowLeft size={20} />
            Quay lại
          </button>
          <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Kết quả luyện tập</div>
          <div className="w-20"></div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <CheckCircle2 size={120} color="#174593" />
              </div>
              
              <div className="relative z-10">
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
                  {stats.score >= 80 ? "Xuất sắc! 🔥" : stats.score >= 50 ? "Khá lắm! 👍" : "Cố gắng thêm nhé! 💪"}
                </h1>
                <p className="text-slate-500 font-medium mb-8">Bạn đã hoàn thành bài luyện tập với tỉ lệ chính xác {stats.score}%.</p>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#f0fdf4] rounded-2xl p-4 border border-[#bbf7d0]">
                    <div className="text-[#166534] text-xs font-bold uppercase mb-1">Đúng</div>
                    <div className="text-2xl font-black text-[#166534]">{stats.correct}</div>
                  </div>
                  <div className="bg-[#fef2f2] rounded-2xl p-4 border border-[#fecaca]">
                    <div className="text-[#991b1b] text-xs font-bold uppercase mb-1">Sai</div>
                    <div className="text-2xl font-black text-[#991b1b]">{stats.wrong}</div>
                  </div>
                  <div className="bg-[#f8fafc] rounded-2xl p-4 border border-slate-200">
                    <div className="text-slate-500 text-xs font-bold uppercase mb-1">Bỏ qua</div>
                    <div className="text-2xl font-black text-slate-600">{stats.skipped}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <h2 className="font-bold text-slate-800">Chi tiết theo loại câu hỏi</h2>
              </div>
              <div className="divide-y divide-slate-50">
                {stats.details.map((item: any, idx: number) => (
                  <div key={idx} className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#174593]">
                        <HelpCircle size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-700 capitalize">{item.type.replace(/_/g, " ")}</div>
                        <div className="text-xs text-slate-400 font-medium">{item.total} câu hỏi</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="font-black text-slate-900">{Math.round((item.correct / item.total) * 100)}%</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase leading-none">Chính xác</div>
                      </div>
                      <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#174593] rounded-full" 
                          style={{ width: `${(item.correct / item.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#0f172a] rounded-3xl p-8 text-white shadow-xl shadow-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Clock size={20} className="text-blue-400" />
                </div>
                <div className="font-bold uppercase text-[10px] tracking-widest text-slate-400 leading-tight">Analysis</div>
              </div>

              <div className="text-5xl font-black mb-2">{stats.score}<span className="text-2xl text-blue-400">%</span></div>
              <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">
                Hãy xem lại giải thích để hiểu rõ tại sao mình sai và cải thiện ở bài tiếp theo nhé!
              </p>

              <div className="space-y-3">
                <button 
                  onClick={() => navigate(`/practice/review/${id}`)}
                  className="w-full bg-white text-slate-900 h-14 rounded-2xl font-extrabold flex items-center justify-center gap-2 hover:bg-blue-50 transition-all active:scale-95"
                >
                  XEM GIẢI THÍCH <ChevronRight size={18} />
                </button>
                <button 
                  onClick={() => {
                    clearAnswers()
                    navigate("/practice")
                  }}
                  className="w-full bg-white/10 text-white h-14 rounded-2xl font-extrabold flex items-center justify-center gap-2 hover:bg-white/20 transition-all"
                >
                  LÀM BÀI KHÁC
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
