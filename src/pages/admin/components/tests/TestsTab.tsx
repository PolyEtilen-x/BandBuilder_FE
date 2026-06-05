import { useState, useEffect, useCallback } from "react"
import { Search, Plus, Pencil, Trash2, BookOpen, Loader2, Layers, Headphones, PenTool, Mic, AlertTriangle } from "lucide-react"
import { adminPracticeApi, AdminPracticeTestListItem } from "@/api/practice/adminPractice.api"
import SkillEditorDrawer from "./SkillEditorDrawer"
import "./TestsTab.css"

const SKILL_COLORS: Record<string, string> = {
  listening: "listening",
  reading: "reading",
  writing: "writing",
  speaking: "speaking",
}

const getSkillIcon = (skill: string) => {
  switch (skill.toLowerCase()) {
    case "listening": return <Headphones size={13} style={{ marginRight: 4 }} />;
    case "reading": return <BookOpen size={13} style={{ marginRight: 4 }} />;
    case "writing": return <PenTool size={13} style={{ marginRight: 4 }} />;
    case "speaking": return <Mic size={13} style={{ marginRight: 4 }} />;
    default: return null;
  }
}

// ── Create Test Modal ─────────────────────────────────────────────────────────
interface CreateModalProps {
  onClose: () => void
  onCreate: (title: string) => Promise<void>
}
function CreateTestModal({ onClose, onCreate }: CreateModalProps) {
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    const t = title.trim()
    if (!t) { alert("Vui lòng nhập tiêu đề đề thi!"); return }
    setLoading(true)
    try { await onCreate(t) } finally { setLoading(false) }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Tạo Đề Thi Mới</h3>
          <button className="btn-ghost" onClick={onClose} style={{ padding: "4px 8px" }}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Tiêu đề đề thi <span style={{ color: "#ef4444" }}>*</span></label>
            <input
              id="new-test-title"
              className="form-input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder="Cambridge IELTS 18 — Academic Test 1"
              autoFocus
            />
          </div>
          <div className="info-alert">
            Sau khi tạo đề thi, bạn sẽ có thể thêm nội dung cho từng phần thi (Listening, Reading, Writing, Speaking).
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Hủy</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 size={14} className="spinner" /> : <Plus size={14} />}
            Tạo đề thi
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Rename Modal ──────────────────────────────────────────────────────────────
interface RenameModalProps {
  test: AdminPracticeTestListItem
  onClose: () => void
  onRename: (id: string, title: string) => Promise<void>
}
function RenameTestModal({ test, onClose, onRename }: RenameModalProps) {
  const [title, setTitle] = useState(test.title)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    const t = title.trim()
    if (!t || t === test.title) { onClose(); return }
    setLoading(true)
    try { await onRename(test.id, t) } finally { setLoading(false) }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Đổi tên Đề Thi</h3>
          <button className="btn-ghost" onClick={onClose} style={{ padding: "4px 8px" }}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Tiêu đề mới</label>
            <input
              className="form-input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              autoFocus
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Hủy</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 size={14} className="spinner" /> : <Pencil size={14} />}
            Lưu
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Delete Confirm Modal ──────────────────────────────────────────────────────
interface DeleteModalProps {
  test: AdminPracticeTestListItem
  onClose: () => void
  onDelete: (id: string) => Promise<void>
}
function DeleteTestModal({ test, onClose, onDelete }: DeleteModalProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try { await onDelete(test.id) } finally { setLoading(false) }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <AlertTriangle size={18} style={{ color: "#b91c1c" }} />
          <h3 style={{ color: "#b91c1c", margin: 0 }}>Xóa Đề Thi</h3>
          <button className="btn-ghost" onClick={onClose} style={{ padding: "4px 8px" }}>✕</button>
        </div>
        <div className="modal-body">
          <p style={{ fontSize: 14, color: "#374151" }}>
            Bạn có chắc muốn xóa đề thi <strong>"{test.title}"</strong>?
            Toàn bộ nội dung các phần thi sẽ bị xóa vĩnh viễn và không thể khôi phục.
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Hủy</button>
          <button className="btn-danger" onClick={handleDelete} disabled={loading}
            style={{ padding: "9px 18px", fontSize: 13, fontWeight: 600 }}>
            {loading ? <Loader2 size={14} className="spinner" /> : <Trash2 size={14} />}
            Xóa vĩnh viễn
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Test Card ─────────────────────────────────────────────────────────────────
interface TestCardProps {
  test: AdminPracticeTestListItem
  onEdit: (test: AdminPracticeTestListItem) => void
  onRename: (test: AdminPracticeTestListItem) => void
  onDelete: (test: AdminPracticeTestListItem) => void
  onOpenSkills: (test: AdminPracticeTestListItem) => void
}

function TestCard({ test, onEdit, onRename, onDelete, onOpenSkills }: TestCardProps) {
  const allSkillTypes = ["listening", "reading", "writing", "speaking"]

  // Get unique skill types covered
  const coveredTypes = new Set(test.skills.map(s => s.skillType?.toLowerCase()))
  // Writing: check if has both tasks
  const writingCount = test.skills.filter(s => s.skillType?.toLowerCase() === "writing").length

  return (
    <div className="tests-card">
      {/* Top */}
      <div>
        <div className="tests-card-id">{test.id.slice(0, 8)}...</div>
        <div className="tests-card-title">{test.title}</div>
      </div>

      {/* Skill tags */}
      <div className="tests-card-tags">
        {allSkillTypes.map(skill => {
          const has = coveredTypes.has(skill)
          return (
            <span
              key={skill}
              className={`tests-skill-tag ${has ? SKILL_COLORS[skill] : ""}`}
              style={{ opacity: has ? 1 : 0.35, display: "inline-flex", alignItems: "center" }}
              title={has ? `Đã có nội dung ${skill}` : `Chưa có ${skill}`}
            >
              {getSkillIcon(skill)}
              <span style={{ textTransform: "capitalize" }}>{skill}</span>
              {skill === "writing" && writingCount > 1 && <span style={{ fontSize: 9, marginLeft: 3 }}>×{writingCount}</span>}
            </span>
          )
        })}
      </div>

      {/* Footer actions */}
      <div className="tests-card-footer">
        <div style={{ display: "flex", gap: 6 }}>
          <button
            id={`edit-skills-${test.id}`}
            className="btn-primary"
            onClick={() => onOpenSkills(test)}
            style={{ fontSize: 12, padding: "7px 12px" }}
          >
            <Layers size={13} /> Cấu hình Skills
          </button>
          <button
            id={`rename-test-${test.id}`}
            className="btn-ghost"
            onClick={() => onRename(test)}
            title="Đổi tên đề thi"
          >
            <Pencil size={13} />
          </button>
          <button
            id={`delete-test-${test.id}`}
            className="btn-danger"
            onClick={() => onDelete(test)}
            title="Xóa đề thi"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function TestsTab() {
  const [tests, setTests] = useState<AdminPracticeTestListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [skillFilter, setSkillFilter] = useState<string>("all")

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [renameTest, setRenameTest] = useState<AdminPracticeTestListItem | null>(null)
  const [deleteTest, setDeleteTest] = useState<AdminPracticeTestListItem | null>(null)
  const [skillsTest, setSkillsTest] = useState<AdminPracticeTestListItem | null>(null)

  const loadTests = useCallback(async () => {
    try {
      setLoading(true)
      const res = await adminPracticeApi.getAllTests(1, 100)
      setTests(res.data.data || [])
    } catch (e: any) {
      console.error("Load tests error:", e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadTests() }, [loadTests])

  const handleCreate = async (title: string) => {
    await adminPracticeApi.createTest(title)
    setShowCreateModal(false)
    await loadTests()
  }

  const handleRename = async (id: string, title: string) => {
    await adminPracticeApi.updateTest(id, title)
    setRenameTest(null)
    await loadTests()
  }

  const handleDelete = async (id: string) => {
    await adminPracticeApi.deleteTest(id)
    setDeleteTest(null)
    await loadTests()
  }

  // Filtered tests
  const filtered = tests.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase())
    const matchSkill = skillFilter === "all"
      ? true
      : t.skills.some(s => s.skillType?.toLowerCase() === skillFilter)
    return matchSearch && matchSkill
  })

  const SKILL_FILTERS = [
    { value: "all", label: "Tất cả" },
    { value: "listening", label: "Listening" },
    { value: "reading", label: "Reading" },
    { value: "writing", label: "Writing" },
    { value: "speaking", label: "Speaking" },
  ]

  return (
    <div className="tests-container">
      {/* Header */}
      <div className="tests-header">
        <div>
          <h2 className="tests-title">Quản lý Đề Thi IELTS</h2>
          <p className="tests-subtitle">{tests.length} đề thi trong hệ thống</p>
        </div>
        <button id="create-test-btn" className="btn-primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={16} /> Tạo đề thi mới
        </button>
      </div>

      {/* Filter bar */}
      <div className="tests-filter-bar">
        <div className="tests-search-wrap">
          <Search size={14} />
          <input
            id="test-search-input"
            className="tests-search-input"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm kiếm đề thi..."
          />
        </div>
        <div className="tests-filter-group">
          <span className="tests-filter-label">Lọc theo:</span>
          {SKILL_FILTERS.map(f => (
            <button
              key={f.value}
              id={`filter-${f.value}`}
              className={`tests-filter-btn ${skillFilter === f.value ? "active" : ""}`}
              onClick={() => setSkillFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="tests-loading">
          <Loader2 size={28} className="spinner" style={{ color: "#2563eb" }} />
          <span style={{ marginLeft: 12 }}>Đang tải danh sách đề thi...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="tests-empty">
          <BookOpen size={40} style={{ margin: "0 auto 12px", color: "#cbd5e1", display: "block" }} />
          <p style={{ fontWeight: 600, color: "#374151", marginBottom: 4 }}>Không có đề thi nào</p>
          <p style={{ color: "#94a3b8", fontSize: 13 }}>
            {search || skillFilter !== "all" ? "Thử thay đổi bộ lọc." : "Hãy tạo đề thi đầu tiên để bắt đầu!"}
          </p>
        </div>
      ) : (
        <div className="tests-grid">
          {filtered.map(test => (
            <TestCard
              key={test.id}
              test={test}
              onEdit={() => setSkillsTest(test)}
              onRename={() => setRenameTest(test)}
              onDelete={() => setDeleteTest(test)}
              onOpenSkills={() => setSkillsTest(test)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateTestModal onClose={() => setShowCreateModal(false)} onCreate={handleCreate} />
      )}
      {renameTest && (
        <RenameTestModal
          test={renameTest}
          onClose={() => setRenameTest(null)}
          onRename={handleRename}
        />
      )}
      {deleteTest && (
        <DeleteTestModal
          test={deleteTest}
          onClose={() => setDeleteTest(null)}
          onDelete={handleDelete}
        />
      )}

      {/* Skill Editor Drawer */}
      {skillsTest && (
        <SkillEditorDrawer
          testId={skillsTest.id}
          testTitle={skillsTest.title}
          onClose={() => setSkillsTest(null)}
          onChanged={loadTests}
        />
      )}
    </div>
  )
}
