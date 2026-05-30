// src/pages/admin/components/TestsTab.tsx

import { useState } from "react"
import { PracticeTest } from "../types"
import { 
  Search, 
  Plus, 
  Trash2, 
  Eye, 
  Code,
  Check, 
  AlertCircle,
  X
} from "lucide-react"

interface Props {
  tests: PracticeTest[]
  onAddTest: (test: Omit<PracticeTest, "id" | "visits">) => void
  onUpdateTest: (id: string, updated: Partial<PracticeTest>) => void
  onDeleteTest: (id: string) => void
}

export default function TestsTab({ tests, onAddTest, onUpdateTest, onDeleteTest }: Props) {
  const [searchTerm, setSearchTerm] = useState("")
  const [skillFilter, setSkillFilter] = useState("ALL")
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTest, setEditingTest] = useState<PracticeTest | null>(null)
  const [jsonText, setJsonText] = useState("")
  const [jsonError, setJsonError] = useState<string | null>(null)

  // Form state
  const [newTitle, setNewTitle] = useState("")
  const [newSkills, setNewSkills] = useState<string[]>([])
  
  const skillOptions = ["listening", "reading", "writing", "speaking"]

  // Filter list
  const filteredTests = tests.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSkill = skillFilter === "ALL" || t.skills.includes(skillFilter.toLowerCase())
    return matchesSearch && matchesSkill
  })

  // Validate JSON on change
  const handleJsonChange = (text: string) => {
    setJsonText(text)
    try {
      if (text.trim() === "") {
        setJsonError("JSON không thể trống")
        return
      }
      JSON.parse(text)
      setJsonError(null)
    } catch (e: any) {
      setJsonError(e.message || "Định dạng JSON không hợp lệ")
    }
  }

  // Handle Save JSON
  const handleSaveJson = () => {
    if (jsonError || !editingTest) return
    onUpdateTest(editingTest.id, { contentJson: jsonText })
    setEditingTest(null)
  }

  // Handle Create Test
  const handleCreateTest = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    const defaultJson = JSON.stringify({
      questions: [
        {
          id: "q1",
          type: "multiple-choice",
          text: "Sample IELTS multiple-choice question?",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: "A"
        }
      ]
    }, null, 2)

    onAddTest({
      title: newTitle,
      skills: newSkills.length > 0 ? newSkills : ["listening"],
      contentJson: defaultJson
    })

    // Reset
    setNewTitle("")
    setNewSkills([])
    setShowAddModal(false)
  }

  const toggleNewSkill = (skill: string) => {
    if (newSkills.includes(skill)) {
      setNewSkills(newSkills.filter(s => s !== skill))
    } else {
      setNewSkills([...newSkills, skill])
    }
  }

  return (
    <div className="space-y-10">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Quản trị Ngân hàng Đề thi</h2>
          <p className="text-slate-500 text-sm font-medium">Quản lý đề thi tổng hợp (Practice Tests) và các bộ câu hỏi chuẩn dạng JSON cho từng kỹ năng.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#174593] hover:bg-[#1a51ad] text-white font-bold py-3.5 px-6 rounded-xl flex items-center gap-2 transition-all shadow hover:shadow-indigo-500/10 self-start md:self-auto cursor-pointer shrink-0"
        >
          <Plus className="w-4.5 h-4.5" />
          Thêm đề thi mới
        </button>
      </div>

      {/* FILTER PANEL */}
      <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="relative flex-1 max-w-md w-full">
          <input 
            type="text"
            placeholder="Tìm đề thi theo tiêu đề..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#174593] transition-all font-semibold shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Lọc kỹ năng:</span>
          {["ALL", ...skillOptions].map((skill) => (
            <button
              key={skill}
              onClick={() => setSkillFilter(skill)}
              className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                skillFilter === skill 
                  ? "bg-blue-50 border-blue-200 text-[#174593]" 
                  : "bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {skill.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* TESTS GRID LIST - Expanded card size and gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTests.map((test) => (
          <div key={test.id} className="bg-white border border-slate-100 hover:border-slate-200/80 rounded-[24px] p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[220px] gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">{test.id}</span>
                <span className="text-xs text-slate-500 flex items-center gap-1.5 font-bold">
                  <Eye className="w-4.5 h-4.5 text-[#174593]" />
                  <strong>{test.visits}</strong> xem
                </span>
              </div>
              <h3 className="text-base font-extrabold text-slate-800 leading-snug tracking-tight line-clamp-2">{test.title}</h3>
            </div>

            <div className="pt-5 border-t border-slate-50 space-y-5">
              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1.5">
                {test.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-slate-500"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-1.5">
                <button
                  onClick={() => {
                    setEditingTest(test)
                    setJsonText(test.contentJson)
                    setJsonError(null)
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#174593] hover:text-[#1a51ad] bg-blue-50 hover:bg-blue-100/60 px-4 py-2.5 rounded-xl transition-all cursor-pointer border border-transparent shadow-sm"
                >
                  <Code className="w-4 h-4" />
                  Sửa JSON câu hỏi
                </button>

                <button
                  onClick={() => {
                    if (confirm(`Bạn có chắc chắn muốn xóa đề thi: ${test.title}?`)) {
                      onDeleteTest(test.id)
                    }
                  }}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 p-2.5 rounded-xl transition-all cursor-pointer border border-transparent"
                  title="Xoá đề thi"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-[28px] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-8 py-5.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Tạo Đề Thi IELTS Mới</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateTest} className="p-8 space-y-6">
              <div>
                <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Tiêu đề đề thi</label>
                <input 
                  type="text"
                  required
                  placeholder="Ví dụ: IELTS Cambridge 19 - Test 2"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-[#174593] focus:ring-1 focus:ring-[#174593] font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Chọn các kỹ năng tích hợp</label>
                <div className="grid grid-cols-2 gap-3">
                  {skillOptions.map((skill) => {
                    const active = newSkills.includes(skill)
                    return (
                      <button
                        type="button"
                        key={skill}
                        onClick={() => toggleNewSkill(skill)}
                        className={`px-4.5 py-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-between cursor-pointer ${
                          active 
                            ? "bg-blue-50 border-blue-200 text-[#174593]" 
                            : "bg-white border-slate-200 text-slate-500 hover:text-slate-850 hover:bg-slate-50"
                        }`}
                      >
                        <span className="uppercase">{skill}</span>
                        {active && <Check className="w-4 h-4" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-xs text-slate-500 leading-relaxed font-semibold">
                Khi tạo, cấu trúc câu hỏi JSON sẽ tự động được khởi tạo theo định dạng IELTS tiêu chuẩn. Bạn có thể thay đổi chi tiết sau khi khởi tạo hoàn tất.
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-500 transition-all cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="bg-[#174593] hover:bg-[#1a51ad] text-white font-bold py-3 px-6 rounded-xl text-xs transition-all shadow hover:shadow-indigo-500/10 cursor-pointer"
                >
                  Khởi tạo ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* JSON EDITOR DRAWER */}
      {editingTest && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-end">
          <div className="bg-white border-l border-slate-100 w-full max-w-2xl h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-250">
            {/* Header */}
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Code className="w-5 h-5 text-[#174593]" />
                  Cấu trúc JSON Câu hỏi
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-semibold truncate max-w-md">Đề thi: {editingTest.title}</p>
              </div>
              <button 
                onClick={() => setEditingTest(null)}
                className="text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Editor Area */}
            <div className="flex-1 p-8 flex flex-col space-y-4 overflow-y-auto">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Trình soạn thảo JSON</span>
                
                {/* Visual Error Badge */}
                {jsonError ? (
                  <span className="inline-flex items-center gap-1.5 text-[10px] text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Lỗi cú pháp
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider">
                    <Check className="w-3.5 h-3.5" />
                    JSON Hợp lệ
                  </span>
                )}
              </div>

              <textarea
                value={jsonText}
                onChange={(e) => handleJsonChange(e.target.value)}
                className="flex-1 w-full bg-slate-50 border border-slate-200 focus:border-[#174593] text-slate-700 p-5 rounded-2xl font-mono text-xs focus:outline-none resize-none leading-relaxed"
                style={{ minHeight: "350px" }}
              />

              {jsonError && (
                <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 flex gap-3">
                  <AlertCircle className="w-4.5 h-4.5 text-rose-500 shrink-0 mt-0.5" />
                  <div className="text-xs text-rose-700 font-semibold leading-relaxed">
                    <span className="font-bold block mb-1">Chi tiết lỗi phân tích:</span>
                    {jsonError}
                  </div>
                </div>
              )}
            </div>

            {/* Actions Footer */}
            <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-between items-center gap-6">
              <span className="text-[10px] text-slate-400 font-semibold leading-relaxed">Lưu ý: Mọi chỉnh sửa JSON sẽ ảnh hưởng trực tiếp đến đáp án làm bài ở client.</span>
              <div className="flex gap-4 shrink-0">
                <button
                  onClick={() => setEditingTest(null)}
                  className="px-5 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-500 transition-all cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveJson}
                  disabled={!!jsonError}
                  className={`font-bold py-3 px-6 rounded-xl text-xs transition-all shadow flex items-center gap-1.5 cursor-pointer ${
                    jsonError 
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none" 
                      : "bg-[#174593] hover:bg-[#1a51ad] text-white hover:shadow-indigo-500/10"
                  }`}
                >
                  <Check className="w-4 h-4" />
                  Lưu cấu trúc
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
