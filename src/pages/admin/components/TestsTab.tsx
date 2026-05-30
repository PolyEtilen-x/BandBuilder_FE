// src/pages/admin/components/TestsTab.tsx

import { useState } from "react"
import { PracticeTest } from "../types"
import { 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
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
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Quản trị Ngân hàng Đề thi</h2>
          <p className="text-slate-400 text-sm mt-1">Quản lý đề thi tổng hợp (Practice Tests) và các bộ câu hỏi dạng JSON của từng kỹ năng.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-indigo-500/20 self-start"
        >
          <Plus className="w-4 h-4" />
          Thêm Đề thi mới
        </button>
      </div>

      {/* FILTER PANEL */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input 
            type="text"
            placeholder="Tìm đề thi theo tiêu đề..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-semibold uppercase">Lọc kỹ năng:</span>
          {["ALL", ...skillOptions].map((skill) => (
            <button
              key={skill}
              onClick={() => setSkillFilter(skill)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                skillFilter === skill 
                  ? "bg-indigo-500/10 border-indigo-500 text-indigo-400" 
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {skill.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* TESTS GRID LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTests.map((test) => (
          <div key={test.id} className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-5 shadow-xl transition-all duration-200 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-mono text-slate-500">{test.id}</span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-indigo-400" />
                  <strong>{test.visits}</strong> lượt truy cập
                </span>
              </div>
              <h3 className="text-base font-bold text-white line-clamp-2">{test.title}</h3>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-900 space-y-4">
              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1.5">
                {test.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setEditingTest(test)
                    setJsonText(test.contentJson)
                    setJsonError(null)
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/5 hover:bg-indigo-500/10 px-2.5 py-1.5 rounded-lg border border-indigo-500/10 transition-all cursor-pointer"
                >
                  <Code className="w-3.5 h-3.5" />
                  JSON Câu hỏi
                </button>

                <button
                  onClick={() => {
                    if (confirm(`Bạn có chắc chắn muốn xóa đề thi: ${test.title}?`)) {
                      onDeleteTest(test.id)
                    }
                  }}
                  className="text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-500/5 hover:bg-rose-500/10 p-1.5 rounded-lg border border-rose-500/10 transition-all cursor-pointer"
                  title="Xoá đề thi"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Tạo Đề Thi Mới</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateTest} className="p-6 space-y-4">
              <div>
                <label className="block text-slate-400 text-sm font-semibold mb-1.5">Tiêu đề đề thi</label>
                <input 
                  type="text"
                  required
                  placeholder="Ví dụ: IELTS Cambridge 19 - Test 2"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-sm font-semibold mb-1.5">Chọn các kỹ năng tích hợp</label>
                <div className="grid grid-cols-2 gap-2">
                  {skillOptions.map((skill) => {
                    const active = newSkills.includes(skill)
                    return (
                      <button
                        type="button"
                        key={skill}
                        onClick={() => toggleNewSkill(skill)}
                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border flex items-center justify-between ${
                          active 
                            ? "bg-indigo-500/10 border-indigo-500 text-indigo-400" 
                            : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        <span className="uppercase">{skill}</span>
                        {active && <Check className="w-3.5 h-3.5" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-3 text-xs text-slate-400">
                Khi tạo, cấu trúc câu hỏi JSON sẽ tự động được gán theo định dạng IELTS chuẩn. Bạn có thể bấm vào nút <strong>JSON Câu hỏi</strong> ngoài danh sách để sửa chi tiết đáp án.
              </div>

              <div className="pt-4 border-t border-slate-900 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-800 hover:bg-slate-900 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg text-xs transition-all shadow-lg hover:shadow-indigo-500/20"
                >
                  Tạo Đề Thi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* JSON EDITOR DRAWER/MODAL */}
      {editingTest && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-end">
          <div className="bg-slate-950 border-l border-slate-800 w-full max-w-2xl h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-250">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Code className="w-5 h-5 text-indigo-400" />
                  Cấu trúc JSON Câu hỏi
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 truncate max-w-md">Đề thi: {editingTest.title}</p>
              </div>
              <button 
                onClick={() => setEditingTest(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Editor Area */}
            <div className="flex-1 p-6 flex flex-col space-y-4 overflow-y-auto">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trình soạn thảo JSON (RAW)</span>
                
                {/* Visual Error Badge */}
                {jsonError ? (
                  <span className="inline-flex items-center gap-1 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Lỗi cú pháp
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-medium">
                    <Check className="w-3.5 h-3.5" />
                    JSON Hợp lệ
                  </span>
                )}
              </div>

              <textarea
                value={jsonText}
                onChange={(e) => handleJsonChange(e.target.value)}
                className="flex-1 w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 text-slate-200 p-4 rounded-xl font-mono text-xs focus:outline-none resize-none leading-relaxed"
                style={{ minHeight: "350px" }}
              />

              {jsonError && (
                <div className="bg-rose-500/5 border border-rose-500/10 rounded-lg p-3 flex gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-rose-300">
                    <span className="font-semibold block mb-0.5">Lỗi phân tích JSON:</span>
                    {jsonError}
                  </div>
                </div>
              )}
            </div>

            {/* Actions Footer */}
            <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex justify-between items-center">
              <span className="text-xs text-slate-500">Mẹo: Cấu hình key & value khớp chuẩn schema backend.</span>
              <div className="flex gap-3">
                <button
                  onClick={() => setEditingTest(null)}
                  className="px-4 py-2 border border-slate-800 hover:bg-slate-900 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleSaveJson}
                  disabled={!!jsonError}
                  className={`font-bold py-2 px-4 rounded-lg text-xs transition-all shadow-lg flex items-center gap-1.5 cursor-pointer ${
                    jsonError 
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                      : "bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-indigo-500/20"
                  }`}
                >
                  <Check className="w-4 h-4" />
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
