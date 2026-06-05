import { useState, useEffect } from "react"
import { X, Loader2, Trash2, Plus, Save, FileText } from "lucide-react"
import { adminPracticeApi, AdminPracticeTestDetail } from "@/api/practice/adminPractice.api"
import ListeningEditor from "./editors/ListeningEditor"
import ReadingEditor from "./editors/ReadingEditor"
import WritingEditor from "./editors/WritingEditor"
import SpeakingEditor from "./editors/SpeakingEditor"
import "./TestsTab.css"

const SKILL_MAP: Record<string, number> = {
  listening: 1, reading: 2, writing: 3, speaking: 4,
}

// Canonical skill names (backend sends with capital first letter)
const SKILL_NAMES = ["Listening", "Reading", "Writing", "Speaking"]

// Default empty contentJson structures per skill
function defaultContent(skillType: string, writingTask?: number): any {
  const st = skillType.toLowerCase()
  if (st === "listening") return { total_questions: 0, sections: [] }
  if (st === "reading")   return { total_questions: 0, time_minutes: 60, passages: [] }
  if (st === "writing")   return { task: writingTask ?? 1, module: "academic", prompt: "", instruction: "", min_words: writingTask === 2 ? 250 : 150, time_minutes: writingTask === 2 ? 40 : 20 }
  if (st === "speaking")  return { parts: [] }
  return {}
}

interface SkillSlot {
  /** undefined = không tồn tại trong test; object = đã tồn tại */
  skillTestId: string
  skillContentId: string
  audioUrl: string | null
  source: string
  contentJson: any
}

interface Props {
  testId: string
  testTitle: string
  onClose: () => void
  onChanged: () => void
}

export default function SkillEditorDrawer({ testId, testTitle, onClose, onChanged }: Props) {
  const [detail, setDetail] = useState<AdminPracticeTestDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("Listening")

  // Editor state
  const [contentJson, setContentJson] = useState<any>({})
  const [audioUrl, setAudioUrl] = useState("")
  const [source, setSource] = useState("")
  const [writingTask, setWritingTask] = useState<1 | 2>(1)
  const [dirty, setDirty] = useState(false)

  // Load test detail
  useEffect(() => {
    loadDetail()
  }, [testId])

  const loadDetail = async () => {
    try {
      setLoading(true)
      const res = await adminPracticeApi.getTestById(testId)
      setDetail(res.data)
    } catch (e: any) {
      alert("Lỗi khi tải chi tiết đề thi: " + (e.response?.data?.message || e.message))
    } finally {
      setLoading(false)
    }
  }

  // When tab changes, populate editor state from existing skill (if any)
  useEffect(() => {
    if (!detail) return
    loadSkillIntoEditor(activeTab)
    setDirty(false)
  }, [activeTab, detail])

  const getSkillsForTab = (tab: string) => {
    if (!detail) return []
    return detail.skills.filter(s => s.skillType.toLowerCase() === tab.toLowerCase())
  }

  const loadSkillIntoEditor = (tab: string) => {
    const skills = getSkillsForTab(tab)
    if (skills.length > 0) {
      const skill = skills[0]
      setContentJson(skill.contentJson || defaultContent(tab, writingTask))
      setAudioUrl(skill.audioUrl || "")
      setSource(skill.source || "")
    } else {
      setContentJson(defaultContent(tab, writingTask))
      setAudioUrl("")
      setSource("")
    }
  }

  const handleContentChange = (updated: any) => {
    setContentJson(updated)
    setDirty(true)
  }

  // Writing: switch task reloads default
  const handleWritingTaskChange = (task: 1 | 2) => {
    setWritingTask(task)
    const skills = getSkillsForTab("Writing")
    // Find skill matching this task number
    const matching = skills.find(s => s.contentJson?.task === task)
    if (matching) {
      setContentJson(matching.contentJson)
      setAudioUrl(matching.audioUrl || "")
      setSource(matching.source || "")
    } else {
      setContentJson(defaultContent("writing", task))
      setAudioUrl("")
      setSource("")
    }
    setDirty(false)
  }

  // Save (create or update)
  const handleSave = async () => {
    if (!source.trim()) {
      alert("Vui lòng nhập Nguồn (Source) — ví dụ: Cambridge 18")
      return
    }
    setSaving(true)
    try {
      const skillTypeLower = activeTab.toLowerCase()
      const skills = getSkillsForTab(activeTab)

      // For writing, find task-specific skill
      let matchingSkill = null
      if (skillTypeLower === "writing") {
        matchingSkill = skills.find(s => s.contentJson?.task === writingTask)
      } else {
        matchingSkill = skills.length > 0 ? skills[0] : null
      }

      if (matchingSkill) {
        // UPDATE existing
        await adminPracticeApi.updateSkill(matchingSkill.skillContentId, {
          contentJson,
          audioUrl: audioUrl || undefined,
          source,
        })
        alert(`Đã cập nhật phần thi ${activeTab}${skillTypeLower === "writing" ? ` Task ${writingTask}` : ""} thành công!`)
      } else {
        // CREATE new
        await adminPracticeApi.addSkillToTest(testId, {
          skillTypeId: SKILL_MAP[skillTypeLower],
          contentJson,
          audioUrl: audioUrl || undefined,
          source,
        })
        alert(`Đã thêm phần thi ${activeTab}${skillTypeLower === "writing" ? ` Task ${writingTask}` : ""} vào đề thi thành công!`)
      }
      setDirty(false)
      await loadDetail()
      onChanged()
    } catch (e: any) {
      alert("Lỗi khi lưu: " + (e.response?.data?.message || e.message))
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteSkill = async () => {
    const skills = getSkillsForTab(activeTab)
    if (skills.length === 0) return
    const skillTypeLower = activeTab.toLowerCase()
    let matchingSkill = skills[0]
    if (skillTypeLower === "writing") {
      matchingSkill = skills.find(s => s.contentJson?.task === writingTask) || skills[0]
    }
    if (!window.confirm(`Xóa phần thi ${activeTab}${skillTypeLower === "writing" ? ` Task ${writingTask}` : ""} khỏi đề thi?`)) return

    try {
      await adminPracticeApi.deleteSkillFromTest(testId, matchingSkill.skillTestId)
      alert("Đã xóa thành công!")
      await loadDetail()
      onChanged()
    } catch (e: any) {
      alert("Lỗi khi xóa: " + (e.response?.data?.message || e.message))
    }
  }

  const renderEditor = () => {
    const skillTypeLower = activeTab.toLowerCase()
    if (skillTypeLower === "listening") {
      return (
        <ListeningEditor
          value={contentJson}
          onChange={handleContentChange}
          audioUrl={audioUrl}
          onAudioUrlChange={url => { setAudioUrl(url); setDirty(true) }}
        />
      )
    }
    if (skillTypeLower === "reading") {
      return <ReadingEditor value={contentJson} onChange={handleContentChange} />
    }
    if (skillTypeLower === "writing") {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Task switcher */}
          <div style={{ display: "flex", gap: 8 }}>
            {([1, 2] as const).map(t => {
              const skills = getSkillsForTab("Writing")
              const exists = skills.some(s => s.contentJson?.task === t)
              return (
                <button key={t}
                  className={writingTask === t ? "btn-primary" : "btn-ghost"}
                  onClick={() => handleWritingTaskChange(t)}
                  style={{ position: "relative" }}
                >
                  Task {t}
                  {exists && (
                    <span style={{ marginLeft: 6, background: "#dcfce7", color: "#15803d", fontSize: 9, padding: "1px 5px", borderRadius: 4, fontWeight: 800 }}>
                      ✓ ĐÃ CÓ
                    </span>
                  )}
                </button>
              )
            })}
          </div>
          <WritingEditor
            value={contentJson}
            taskNumber={writingTask}
            onChange={handleContentChange}
          />
        </div>
      )
    }
    if (skillTypeLower === "speaking") {
      return <SpeakingEditor value={contentJson} onChange={handleContentChange} />
    }
    return null
  }

  const activeSkillExists = (() => {
    const skills = getSkillsForTab(activeTab)
    if (activeTab.toLowerCase() === "writing") return skills.some(s => s.contentJson?.task === writingTask)
    return skills.length > 0
  })()

  return (
    <>
      {/* Backdrop */}
      <div className="skill-drawer-overlay" onClick={onClose} />

      {/* Drawer */}
      <div className="skill-drawer">
        {/* Header */}
        <div className="skill-drawer-header">
          <div>
            <h3>Cấu hình Nội dung Đề Thi</h3>
            <p className="skill-drawer-subtitle" style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <FileText size={12} style={{ color: "#6b7280" }} /> {testTitle}
            </p>
          </div>
          <button className="btn-ghost" onClick={onClose} style={{ padding: "6px 8px" }}>
            <X size={18} />
          </button>
        </div>

        {/* Skill Tabs */}
        <div className="skill-tabs">
          {SKILL_NAMES.map(skill => {
            const exists = getSkillsForTab(skill).length > 0
            return (
              <button
                key={skill}
                className={`skill-tab-btn ${activeTab === skill ? "active" : ""}`}
                onClick={() => setActiveTab(skill)}
              >
                {skill}
                <span className={`skill-tab-badge ${exists ? "" : "missing"}`}>
                  {exists ? "✓" : "—"}
                </span>
              </button>
            )
          })}
        </div>

        {/* Body */}
        {loading ? (
          <div className="skill-drawer-body" style={{ justifyContent: "center", alignItems: "center" }}>
            <Loader2 size={32} className="spinner" style={{ color: "#2563eb" }} />
          </div>
        ) : (
          <div className="skill-drawer-body">
            {/* Source field */}
            <div className="form-group">
              <label className="form-label">Nguồn tài liệu (Source) <span style={{ color: "#ef4444" }}>*</span></label>
              <input
                className="form-input"
                value={source}
                onChange={e => { setSource(e.target.value); setDirty(true) }}
                placeholder="Ví dụ: Cambridge Practice Tests for IELTS 18 — Test 2"
              />
            </div>

            <hr className="section-divider" />

            {/* Skill-specific editor */}
            {renderEditor()}
          </div>
        )}

        {/* Footer */}
        <div className="skill-drawer-footer">
          <div>
            {activeSkillExists && (
              <button className="btn-danger" onClick={handleDeleteSkill}>
                <Trash2 size={14} />
                Xóa phần thi này
              </button>
            )}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-ghost" onClick={onClose}>Đóng</button>
            <button className="btn-primary" onClick={handleSave} disabled={saving || !dirty}>
              {saving ? <Loader2 size={14} className="spinner" /> : <Save size={14} />}
              {activeSkillExists ? "Lưu thay đổi" : "Tạo phần thi"}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
