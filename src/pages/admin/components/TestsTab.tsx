import { useState, useEffect } from "react"
import {
  Search,
  Plus,
  Trash2,
  Eye,
  Code,
  Check,
  AlertCircle,
  X,
  Edit2,
  Volume2,
  FileJson,
  BookOpen
} from "lucide-react"
import {
  adminPracticeApi,
  AdminPracticeTestListItem,
  AdminPracticeTestDetail
} from "@/api/practice/adminPractice.api"

// Window size hook for responsive layouts
function useWindowSize() {
  const [size, setSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200
  })

  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth })
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return size
}

const SKILL_MAP: Record<string, number> = {
  listening: 1,
  reading: 2,
  writing: 3,
  speaking: 4
}

const DEFAULT_TEMPLATES: Record<string, any> = {
  listening: {
    sections: [
      {
        name: "Section 1",
        questions: [
          {
            id: "q1",
            text: "Write ONE WORD AND/OR A NUMBER for the answer: What is the customer's name?",
            correctAnswer: "Smith"
          }
        ]
      }
    ]
  },
  reading: {
    sections: [
      {
        name: "Passage 1",
        questions: [
          {
            id: "q1",
            text: "Is the statement True, False or Not Given? The company was founded in 1995.",
            correctAnswer: "TRUE"
          }
        ]
      }
    ]
  },
  writing: {
    task1: {
      prompt: "The chart below shows the percentage of waste recycled..."
    },
    task2: {
      prompt: "Some people believe that university education should be free..."
    }
  },
  speaking: {
    part1: [
      { id: "q1", text: "Do you like to study in the morning or in the evening?" }
    ],
    part2: {
      cueCard: "Describe a book you read recently that you found useful."
    },
    part3: [
      { id: "q2", text: "Why do you think some people read books instead of watching movies?" }
    ]
  }
}

export default function TestsTab() {
  const [tests, setTests] = useState<AdminPracticeTestListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [skillFilter, setSkillFilter] = useState("ALL")

  // Modals & Drawers state
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTitleTest, setEditingTitleTest] = useState<{ id: string; title: string } | null>(null)
  
  // Details Drawer state
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null)
  const [testDetail, setTestDetail] = useState<AdminPracticeTestDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [activeSkillTab, setActiveSkillTab] = useState<string>("listening")

  // Skill Editor / Add form state
  const [isEditingSkill, setIsEditingSkill] = useState(false)
  const [isAddingSkill, setIsAddingSkill] = useState(false)
  const [skillSource, setSkillSource] = useState("")
  const [skillAudioUrl, setSkillAudioUrl] = useState("")
  const [skillJsonText, setSkillJsonText] = useState("")
  const [jsonError, setJsonError] = useState<string | null>(null)

  // Add Test Form state
  const [newTitle, setNewTitle] = useState("")

  const { width } = useWindowSize()
  const isMobile = width < 640
  const isTablet = width < 1024

  const skillOptions = ["listening", "reading", "writing", "speaking"]

  const loadTests = async () => {
    try {
      setLoading(true)
      const res = await adminPracticeApi.getAllTests(1, 100)
      setTests(res.data.data)
    } catch (e: any) {
      alert("Lỗi khi tải danh sách đề thi: " + (e.response?.data?.message || e.message))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTests()
  }, [])

  const filteredTests = tests.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSkill = skillFilter === "ALL" || t.skills.some(s => s.skillType === skillFilter.toLowerCase())
    return matchesSearch && matchesSkill
  })

  // Handle opening details of a test
  const handleOpenDetails = async (testId: string) => {
    setSelectedTestId(testId)
    setTestDetail(null)
    setIsEditingSkill(false)
    setIsAddingSkill(false)
    try {
      setDetailLoading(true)
      const res = await adminPracticeApi.getTestById(testId)
      setTestDetail(res.data)
      
      // Auto-select first available skill or default to listening
      if (res.data.skills.length > 0) {
        setActiveSkillTab(res.data.skills[0].skillType)
      } else {
        setActiveSkillTab("listening")
      }
    } catch (e: any) {
      alert("Lỗi khi tải chi tiết đề thi: " + (e.response?.data?.message || e.message))
    } finally {
      setDetailLoading(false)
    }
  }

  // Handle JSON input changes
  const handleJsonChange = (text: string) => {
    setSkillJsonText(text)
    try {
      if (text.trim() === "") {
        setJsonError("JSON không được để trống")
        return
      }
      JSON.parse(text)
      setJsonError(null)
    } catch (e: any) {
      setJsonError(e.message || "Định dạng JSON không hợp lệ")
    }
  }

  // Initialize adding a missing skill to the test
  const handleInitAddSkill = () => {
    setSkillSource("Cambridge")
    setSkillAudioUrl("")
    const starterJson = JSON.stringify(DEFAULT_TEMPLATES[activeSkillTab] || {}, null, 2)
    setSkillJsonText(starterJson)
    setJsonError(null)
    setIsAddingSkill(true)
    setIsEditingSkill(false)
  }

  // Save the newly added skill
  const handleAddSkillSubmit = async () => {
    if (jsonError || !selectedTestId) return
    try {
      let parsedJson = {}
      try {
        parsedJson = JSON.parse(skillJsonText)
      } catch (err) {
        alert("JSON không hợp lệ")
        return
      }

      await adminPracticeApi.addSkillToTest(selectedTestId, {
        skillTypeId: SKILL_MAP[activeSkillTab],
        contentJson: parsedJson,
        source: skillSource,
        audioUrl: skillAudioUrl || undefined
      })

      alert(`Đã thêm kỹ năng ${activeSkillTab.toUpperCase()} vào đề thi thành công!`)
      setIsAddingSkill(false)
      // Reload details
      handleOpenDetails(selectedTestId)
      loadTests()
    } catch (e: any) {
      alert("Lỗi khi thêm kỹ năng: " + (e.response?.data?.message || e.message))
    }
  }

  // Initialize editing an existing skill in the test
  const handleInitEditSkill = (skill: any) => {
    setSkillSource(skill.source || "")
    setSkillAudioUrl(skill.audioUrl || "")
    setSkillJsonText(JSON.stringify(skill.contentJson || {}, null, 2))
    setJsonError(null)
    setIsEditingSkill(true)
    setIsAddingSkill(false)
  }

  // Save updated skill
  const handleUpdateSkillSubmit = async (skillContentId: string) => {
    if (jsonError || !selectedTestId) return
    try {
      let parsedJson = {}
      try {
        parsedJson = JSON.parse(skillJsonText)
      } catch (err) {
        alert("JSON không hợp lệ")
        return
      }

      await adminPracticeApi.updateSkill(skillContentId, {
        contentJson: parsedJson,
        source: skillSource,
        audioUrl: skillAudioUrl || undefined
      })

      alert("Cập nhật nội dung kỹ năng thành công!")
      setIsEditingSkill(false)
      // Reload details
      handleOpenDetails(selectedTestId)
    } catch (e: any) {
      alert("Lỗi khi cập nhật kỹ năng: " + (e.response?.data?.message || e.message))
    }
  }

  // Delete a skill from the test
  const handleDeleteSkill = async (skillTestId: string, skillType: string) => {
    if (!selectedTestId) return
    if (window.confirm(`Bạn có chắc chắn muốn xóa phần thi ${skillType.toUpperCase()} khỏi đề thi này không?`)) {
      try {
        await adminPracticeApi.deleteSkillFromTest(selectedTestId, skillTestId)
        alert(`Đã xóa phần thi ${skillType.toUpperCase()} thành công!`)
        setIsEditingSkill(false)
        setIsAddingSkill(false)
        handleOpenDetails(selectedTestId)
        loadTests()
      } catch (e: any) {
        alert("Lỗi khi xóa phần thi: " + (e.response?.data?.message || e.message))
      }
    }
  }

  // Create a new practice test
  const handleCreateTest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    try {
      await adminPracticeApi.createTest(newTitle)
      alert("Đã tạo đề thi IELTS mới thành công!")
      setNewTitle("")
      setShowAddModal(false)
      loadTests()
    } catch (e: any) {
      alert("Lỗi khi tạo đề thi: " + (e.response?.data?.message || e.message))
    }
  }

  // Update Practice Test Title
  const handleUpdateTitleSubmit = async () => {
    if (!editingTitleTest || !editingTitleTest.title.trim()) return
    try {
      await adminPracticeApi.updateTest(editingTitleTest.id, editingTitleTest.title)
      alert("Đã sửa tiêu đề đề thi thành công!")
      setEditingTitleTest(null)
      loadTests()
    } catch (e: any) {
      alert("Lỗi khi cập nhật tiêu đề: " + (e.response?.data?.message || e.message))
    }
  }

  // Delete a practice test
  const handleDeleteTest = async (id: string, title: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa đề thi: ${title}?\nLưu ý: Chỉ xóa được nếu chưa có học viên nào làm đề thi này.`)) {
      try {
        await adminPracticeApi.deleteTest(id)
        alert("Đã xóa đề thi khỏi hệ thống thành công!")
        loadTests()
      } catch (e: any) {
        alert("Lỗi khi xóa: " + (e.response?.data?.message || e.message))
      }
    }
  }

  // Active skill details in active tab
  const activeSkill = testDetail?.skills.find(s => s.skillType === activeSkillTab)

  // Pure inline styles object
  const styles = {
    headerRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "24px",
      borderBottom: "1px solid #e5e7eb",
      paddingBottom: "16px",
      flexWrap: "wrap" as const
    },
    title: {
      fontSize: "22px",
      fontWeight: 700,
      color: "#111827",
      margin: 0
    },
    subtitle: {
      fontSize: "13px",
      color: "#6b7280",
      marginTop: "4px",
      marginBottom: 0
    },
    createBtn: {
      background: "#2563eb",
      color: "#ffffff",
      fontSize: "13px",
      fontWeight: 600,
      padding: "10px 16px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "6px"
    },
    filterBar: {
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "16px 24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "20px",
      flexWrap: "wrap" as const
    },
    searchWrapper: {
      position: "relative" as const,
      flex: 1,
      minWidth: "220px",
      maxWidth: "400px"
    },
    searchInput: {
      width: "100%",
      height: "36px",
      background: "#f9fafb",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      paddingLeft: "36px",
      paddingRight: "12px",
      fontSize: "13px",
      boxSizing: "border-box" as const,
      outline: "none"
    },
    filterGroup: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      flexWrap: "wrap" as const
    },
    filterBtn: (active: boolean) => ({
      padding: "6px 12px",
      borderRadius: "8px",
      fontSize: "12px",
      fontWeight: 700,
      border: active ? "1px solid #2563eb" : "1px solid #d1d5db",
      background: active ? "#eff6ff" : "#ffffff",
      color: active ? "#2563eb" : "#4b5563",
      cursor: "pointer",
      transition: "all 0.15s"
    }),
    gridList: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3, 1fr)",
      gap: "24px"
    },
    testCard: {
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "24px",
      boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05)",
      display: "flex",
      flexDirection: "column" as const,
      justifyContent: "space-between",
      gap: "24px",
      boxSizing: "border-box" as const
    },
    tag: {
      fontSize: "10px",
      fontWeight: 700,
      textTransform: "uppercase" as const,
      letterSpacing: "0.05em",
      padding: "3px 8px",
      borderRadius: "4px",
      background: "#eff6ff",
      border: "1px solid #dbeafe",
      color: "#2563eb"
    },
    cardActionRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderTop: "1px solid #f3f4f6",
      paddingTop: "16px",
      boxSizing: "border-box" as const
    },
    manageBtn: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "12px",
      fontWeight: 650,
      color: "#2563eb",
      background: "#eff6ff",
      border: "1px solid #dbeafe",
      padding: "6px 12px",
      borderRadius: "8px",
      cursor: "pointer"
    },
    editTitleBtn: {
      padding: "6px",
      borderRadius: "6px",
      border: "1px solid #e2e8f0",
      background: "#ffffff",
      color: "#475569",
      cursor: "pointer",
      display: "flex",
      alignItems: "center"
    },
    trashBtn: {
      padding: "8px",
      borderRadius: "8px",
      border: "none",
      background: "#fee2e2",
      color: "#b91c1c",
      cursor: "pointer"
    },
    modalOverlay: {
      position: "fixed" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(15, 23, 42, 0.4)",
      backdropFilter: "blur(4px)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px"
    },
    modalCard: {
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "16px",
      width: "100%",
      maxWidth: "500px",
      boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
      overflow: "hidden" as const,
      display: "flex",
      flexDirection: "column" as const
    },
    modalHeader: {
      padding: "20px 24px",
      background: "#f9fafb",
      borderBottom: "1px solid #e5e7eb",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    },
    modalBody: {
      padding: "24px",
      display: "flex",
      flexDirection: "column" as const,
      gap: "16px"
    },
    formGroup: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "6px"
    },
    label: {
      fontSize: "12px",
      fontWeight: 600,
      color: "#4b5563",
      textTransform: "uppercase" as const,
      letterSpacing: "0.04em"
    },
    textInput: {
      height: "40px",
      padding: "0 12px",
      borderRadius: "8px",
      border: "1px solid #cbd5e1",
      fontSize: "13px",
      outline: "none",
      boxSizing: "border-box" as const
    },
    drawer: {
      position: "fixed" as const,
      top: 0,
      right: 0,
      bottom: 0,
      background: "#ffffff",
      borderLeft: "1px solid #e5e7eb",
      width: "100%",
      maxWidth: "700px",
      height: "100%",
      zIndex: 1100,
      display: "flex",
      flexDirection: "column" as const,
      boxShadow: "-10px 0 30px -5px rgba(0,0,0,0.1)",
      boxSizing: "border-box" as const
    },
    textarea: {
      flex: 1,
      width: "100%",
      height: "350px",
      background: "#f8fafc",
      border: "1px solid #cbd5e1",
      color: "#1e293b",
      padding: "16px",
      borderRadius: "12px",
      fontFamily: "Consolas, Monaco, monospace",
      fontSize: "12px",
      lineHeight: 1.5,
      outline: "none",
      resize: "none" as const,
      boxSizing: "border-box" as const
    },
    badgeError: (isErr: boolean) => ({
      fontSize: "11px",
      fontWeight: 700,
      padding: "4px 8px",
      borderRadius: "6px",
      background: isErr ? "#fee2e2" : "#dcfce7",
      color: isErr ? "#b91c1c" : "#15803d",
      border: isErr ? "1px solid #fecaca" : "1px solid #bbf7d0",
      display: "flex",
      alignItems: "center",
      gap: "4px"
    }),
    tabBar: {
      display: "flex",
      borderBottom: "2px solid #e2e8f0",
      marginBottom: "20px"
    },
    tabBtn: (active: boolean) => ({
      padding: "10px 20px",
      fontSize: "13px",
      fontWeight: 700,
      background: "none",
      border: "none",
      borderBottom: active ? "2px solid #2563eb" : "2px solid transparent",
      color: active ? "#2563eb" : "#64748b",
      cursor: "pointer",
      textTransform: "uppercase" as const,
      transition: "all 0.15s"
    })
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* HEADER BAR */}
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.title}>Quản trị Ngân hàng Đề thi</h2>
          <p style={styles.subtitle}>Quản lý đề thi tổng hợp (Practice Tests) và các phần thi kỹ năng chi tiết (IELTS Listening, Reading, Writing, Speaking).</p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={styles.createBtn}>
          <Plus size={16} />
          Thêm đề thi mới
        </button>
      </div>

      {/* FILTER PANEL */}
      <div style={styles.filterBar}>
        <div style={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Tìm đề thi theo tiêu đề..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <Search size={14} style={{ position: "absolute", left: "12px", top: "11px", color: "#94a3b8" }} />
        </div>

        <div style={styles.filterGroup}>
          <span style={{ fontSize: "11px", color: "#6b7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>Lọc đề:</span>
          {["ALL", ...skillOptions].map((skill) => (
            <button
              key={skill}
              onClick={() => setSkillFilter(skill)}
              style={styles.filterBtn(skillFilter === skill)}
            >
              {skill.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* LOADING STATE */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "64px 0", color: "#64748b", fontSize: "14px" }}>
          Đang tải danh sách đề thi...
        </div>
      ) : filteredTests.length === 0 ? (
        <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "48px 0", textAlign: "center", color: "#64748b" }}>
          Không tìm thấy đề thi nào phù hợp.
        </div>
      ) : (
        /* TESTS GRID */
        <div style={styles.gridList}>
          {filteredTests.map((test) => (
            <div key={test.id} style={styles.testCard}>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "10px", fontFamily: "monospace", color: "#94a3b8", fontWeight: 650 }}>{test.id}</span>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      onClick={() => setEditingTitleTest({ id: test.id, title: test.title })}
                      style={styles.editTitleBtn}
                      title="Sửa tiêu đề"
                    >
                      <Edit2 size={13} />
                    </button>
                  </div>
                </div>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#111827", margin: 0, lineHeight: 1.4 }}>{test.title}</h3>
              </div>

              <div style={styles.cardActionRow}>
                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", maxWidth: "60%" }}>
                  {test.skills.length === 0 ? (
                    <span style={{ fontSize: "10px", color: "#94a3b8", fontStyle: "italic" }}>Chưa có kỹ năng</span>
                  ) : (
                    test.skills.map((skill, index) => (
                      <span key={index} style={styles.tag}>{skill.skillType}</span>
                    ))
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    onClick={() => handleOpenDetails(test.id)}
                    style={styles.manageBtn}
                  >
                    <BookOpen size={14} />
                    Chi tiết & Skills
                  </button>

                  <button
                    onClick={() => handleDeleteTest(test.id, test.title)}
                    style={styles.trashBtn}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE PRACTICE TEST MODAL */}
      {showAddModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#111827", margin: 0 }}>Tạo Đề Thi IELTS Mới</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTest}>
              <div style={styles.modalBody}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Tiêu đề đề thi</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: IELTS Cambridge 19 - Test 2"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    style={styles.textInput}
                  />
                </div>

                <div style={{ fontSize: "11px", background: "#f8fafc", padding: "12px", borderRadius: "8px", color: "#6b7280", lineHeight: 1.4 }}>
                  Sau khi tạo khung đề thi, bạn sẽ nhấp vào nút <strong>"Chi tiết & Skills"</strong> của đề thi đó để thêm các phần thi (Listening, Reading, Writing, Speaking) và tải câu hỏi lên.
                </div>
              </div>

              <div style={{ padding: "16px 24px", background: "#f9fafb", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#ffffff", fontSize: "13px", fontWeight: 600, cursor: "pointer", color: "#4b5563" }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 16px", borderRadius: "8px", border: "none", background: "#2563eb", fontSize: "13px", fontWeight: 600, cursor: "pointer", color: "#ffffff" }}
                >
                  Tạo Đề Thi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TITLE MODAL */}
      {editingTitleTest && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#111827", margin: 0 }}>Sửa Tiêu Đề Đề Thi</h3>
              <button onClick={() => setEditingTitleTest(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                <X size={20} />
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Tiêu đề đề thi mới</label>
                <input
                  type="text"
                  value={editingTitleTest.title}
                  onChange={(e) => setEditingTitleTest({ ...editingTitleTest, title: e.target.value })}
                  style={styles.textInput}
                />
              </div>
            </div>

            <div style={{ padding: "16px 24px", background: "#f9fafb", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button
                onClick={() => setEditingTitleTest(null)}
                style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#ffffff", fontSize: "13px", fontWeight: 600, cursor: "pointer", color: "#4b5563" }}
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateTitleSubmit}
                style={{ padding: "8px 16px", borderRadius: "8px", border: "none", background: "#2563eb", fontSize: "13px", fontWeight: 600, cursor: "pointer", color: "#ffffff" }}
              >
                Cập Nhật
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAILED SKILLS DRAWER */}
      {selectedTestId && (
        <div style={styles.modalOverlay}>
          <div style={styles.drawer}>
            <div style={styles.modalHeader}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#111827", margin: 0 }}>Cấu hình Kỹ Năng & Câu Hỏi</h3>
                <span style={{ fontSize: "12px", color: "#6b7280", fontStyle: "italic", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "450px" }}>Đề thi: {testDetail?.title || "Đang tải..."}</span>
              </div>
              <button onClick={() => setSelectedTestId(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                <X size={20} />
              </button>
            </div>

            {detailLoading ? (
              <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", color: "#64748b" }}>
                Đang tải chi tiết đề thi...
              </div>
            ) : (
              <div style={{ flex: 1, padding: "24px", display: "flex", flexDirection: "column", overflowY: "auto", boxSizing: "border-box" }}>
                
                {/* SKILLS TABS */}
                <div style={styles.tabBar}>
                  {skillOptions.map(skill => {
                    const isExisted = testDetail?.skills.some(s => s.skillType === skill)
                    return (
                      <button
                        key={skill}
                        onClick={() => {
                          setActiveSkillTab(skill)
                          setIsEditingSkill(false)
                          setIsAddingSkill(false)
                        }}
                        style={styles.tabBtn(activeSkillTab === skill)}
                      >
                        {skill} {isExisted ? "✓" : ""}
                      </button>
                    )
                  })}
                </div>

                {/* ACTIVE TAB CONTENT */}
                {activeSkill ? (
                  /* IF SKILL EXISTS */
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {!isEditingSkill ? (
                      /* READ-ONLY / OVERVIEW MODE */
                      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "16px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "12px" }}>
                          <div>
                            <span style={{ fontSize: "10px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Nguồn (Source):</span>
                            <div style={{ fontSize: "14px", fontWeight: 600, color: "#1e293b", marginTop: "4px" }}>{activeSkill.source}</div>
                          </div>
                          {activeSkill.audioUrl && (
                            <div>
                              <span style={{ fontSize: "10px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Audio URL:</span>
                              <div style={{ fontSize: "13px", fontFamily: "monospace", wordBreak: "break-all", color: "#2563eb", marginTop: "4px" }}>
                                {activeSkill.audioUrl}
                              </div>
                            </div>
                          )}
                          <div>
                            <span style={{ fontSize: "10px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Số câu hỏi:</span>
                            <div style={{ fontSize: "14px", fontWeight: 600, color: "#1e293b", marginTop: "4px" }}>
                              {activeSkill.contentJson?.questionsCount || activeSkill.contentJson?.questions?.length || 0} câu
                            </div>
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: "12px" }}>
                          <button
                            onClick={() => handleInitEditSkill(activeSkill)}
                            style={{ flex: 1, padding: "10px", background: "#2563eb", color: "#ffffff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "6px" }}
                          >
                            <Code size={14} />
                            Sửa JSON & Cấu hình
                          </button>
                          <button
                            onClick={() => handleDeleteSkill(activeSkill.skillTestId, activeSkill.skillType)}
                            style={{ padding: "10px", background: "#fee2e2", color: "#b91c1c", border: "1px solid #fecaca", borderRadius: "8px", cursor: "pointer" }}
                            title="Xóa phần thi này khỏi đề"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* EDITING MODE */
                      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Nguồn (Source)</label>
                          <input
                            type="text"
                            value={skillSource}
                            onChange={(e) => setSkillSource(e.target.value)}
                            style={styles.textInput}
                            placeholder="Ví dụ: Cambridge 19"
                          />
                        </div>

                        {activeSkillTab === "listening" && (
                          <div style={styles.formGroup}>
                            <label style={styles.label}>Audio URL</label>
                            <input
                              type="text"
                              value={skillAudioUrl}
                              onChange={(e) => setSkillAudioUrl(e.target.value)}
                              style={styles.textInput}
                              placeholder="Đường dẫn file Audio (.mp3)"
                            />
                          </div>
                        )}

                        <div style={styles.formGroup}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                            <label style={styles.label}>Cấu trúc JSON Câu hỏi</label>
                            <span style={styles.badgeError(!!jsonError)}>
                              {jsonError ? <AlertCircle size={13} /> : <Check size={13} />}
                              {jsonError ? "JSON lỗi" : "JSON chuẩn"}
                            </span>
                          </div>
                          <textarea
                            value={skillJsonText}
                            onChange={(e) => handleJsonChange(e.target.value)}
                            style={styles.textarea}
                          />
                          {jsonError && (
                            <div style={{ fontSize: "11px", color: "#b91c1c", background: "#fee2e2", padding: "8px 12px", borderRadius: "6px", border: "1px solid #fecaca" }}>
                              {jsonError}
                            </div>
                          )}
                        </div>

                        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                          <button
                            type="button"
                            onClick={() => setIsEditingSkill(false)}
                            style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#ffffff", fontSize: "13px", fontWeight: 600, cursor: "pointer", color: "#4b5563" }}
                          >
                            Hủy
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateSkillSubmit(activeSkill.skillContentId)}
                            disabled={!!jsonError}
                            style={{ padding: "8px 16px", borderRadius: "8px", border: "none", background: jsonError ? "#cbd5e1" : "#2563eb", color: "#ffffff", fontSize: "13px", fontWeight: 600, cursor: jsonError ? "not-allowed" : "pointer" }}
                          >
                            Lưu Thay Đổi
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* IF SKILL DOES NOT EXIST */
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {!isAddingSkill ? (
                      /* SHOW ADD PROMPT */
                      <div style={{ border: "2px dashed #cbd5e1", padding: "48px 24px", borderRadius: "12px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                        <span style={{ fontSize: "13px", color: "#64748b" }}>Đề thi này chưa có cấu hình phần thi <strong>{activeSkillTab.toUpperCase()}</strong>.</span>
                        <button
                          onClick={handleInitAddSkill}
                          style={styles.createBtn}
                        >
                          <Plus size={14} />
                          Thêm kỹ năng {activeSkillTab.toUpperCase()}
                        </button>
                      </div>
                    ) : (
                      /* SHOW ADD FORM */
                      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b", margin: 0 }}>Thêm Phần Thi {activeSkillTab.toUpperCase()} mới</h4>
                        
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Nguồn (Source)</label>
                          <input
                            type="text"
                            value={skillSource}
                            onChange={(e) => setSkillSource(e.target.value)}
                            style={styles.textInput}
                            placeholder="Ví dụ: Cambridge 19"
                          />
                        </div>

                        {activeSkillTab === "listening" && (
                          <div style={styles.formGroup}>
                            <label style={styles.label}>Audio URL</label>
                            <input
                              type="text"
                              value={skillAudioUrl}
                              onChange={(e) => setSkillAudioUrl(e.target.value)}
                              style={styles.textInput}
                              placeholder="Đường dẫn file Audio (.mp3)"
                            />
                          </div>
                        )}

                        <div style={styles.formGroup}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                            <label style={styles.label}>Cấu trúc JSON Câu hỏi khởi tạo</label>
                            <span style={styles.badgeError(!!jsonError)}>
                              {jsonError ? <AlertCircle size={13} /> : <Check size={13} />}
                              {jsonError ? "JSON lỗi" : "JSON chuẩn"}
                            </span>
                          </div>
                          <textarea
                            value={skillJsonText}
                            onChange={(e) => handleJsonChange(e.target.value)}
                            style={styles.textarea}
                          />
                          {jsonError && (
                            <div style={{ fontSize: "11px", color: "#b91c1c", background: "#fee2e2", padding: "8px 12px", borderRadius: "6px", border: "1px solid #fecaca" }}>
                              {jsonError}
                            </div>
                          )}
                        </div>

                        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                          <button
                            type="button"
                            onClick={() => setIsAddingSkill(false)}
                            style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#ffffff", fontSize: "13px", fontWeight: 600, cursor: "pointer", color: "#4b5563" }}
                          >
                            Hủy
                          </button>
                          <button
                            type="button"
                            onClick={handleAddSkillSubmit}
                            disabled={!!jsonError}
                            style={{ padding: "8px 16px", borderRadius: "8px", border: "none", background: jsonError ? "#cbd5e1" : "#2563eb", color: "#ffffff", fontSize: "13px", fontWeight: 600, cursor: jsonError ? "not-allowed" : "pointer" }}
                          >
                            Thêm phần thi
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
