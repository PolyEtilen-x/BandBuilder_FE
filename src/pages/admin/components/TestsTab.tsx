// src/pages/admin/components/TestsTab.tsx

import { useState, useEffect } from "react"
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

// Window size hook for responsive grids
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
  
  const { width } = useWindowSize()
  const isMobile = width < 640
  const isTablet = width < 1024

  const skillOptions = ["listening", "reading", "writing", "speaking"]

  const filteredTests = tests.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSkill = skillFilter === "ALL" || t.skills.includes(skillFilter.toLowerCase())
    return matchesSearch && matchesSkill
  })

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

  const handleSaveJson = () => {
    if (jsonError || !editingTest) return
    onUpdateTest(editingTest.id, { contentJson: jsonText })
    setEditingTest(null)
  }

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
      background: "#f3f4f6",
      border: "1px solid #e5e7eb",
      color: "#4b5563"
    },
    cardActionRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderTop: "1px solid #f3f4f6",
      paddingTop: "16px",
      boxSizing: "border-box" as const
    },
    jsonBtn: {
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
    skillBtnGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "8px"
    },
    skillSelectBtn: (active: boolean) => ({
      padding: "10px",
      borderRadius: "8px",
      fontSize: "12px",
      fontWeight: 700,
      border: active ? "1px solid #2563eb" : "1px solid #cbd5e1",
      background: active ? "#eff6ff" : "#ffffff",
      color: active ? "#2563eb" : "#4b5563",
      cursor: "pointer",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }),
    drawer: {
      position: "fixed" as const,
      top: 0,
      right: 0,
      bottom: 0,
      background: "#ffffff",
      borderLeft: "1px solid #e5e7eb",
      width: "100%",
      maxWidth: "600px",
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
      background: "#f9fafb",
      border: "1px solid #cbd5e1",
      color: "#1e293b",
      padding: "16px",
      borderRadius: "12px",
      fontFamily: "monospace",
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
      border: isErr ? "1px solid #fee2e2" : "1px solid #dcfce7",
      display: "flex",
      alignItems: "center",
      gap: "4px"
    })
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* HEADER BAR */}
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.title}>Quản trị Ngân hàng Đề thi</h2>
          <p style={styles.subtitle}>Quản lý đề thi tổng hợp (Practice Tests) và các bộ câu hỏi dạng JSON của từng kỹ năng.</p>
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

      {/* TESTS GRID */}
      <div style={styles.gridList}>
        {filteredTests.map((test) => (
          <div key={test.id} style={styles.testCard}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "10px", fontFamily: "monospace", color: "#94a3b8", fontWeight: 650 }}>{test.id}</span>
                <span style={{ fontSize: "12px", color: "#6b7280", display: "flex", alignItems: "center", gap: "4px", fontWeight: 600 }}>
                  <Eye size={14} style={{ color: "#2563eb" }} />
                  <strong>{test.visits}</strong> xem
                </span>
              </div>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#111827", margin: 0, lineHeight: 1.4 }}>{test.title}</h3>
            </div>

            <div style={styles.cardActionRow}>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {test.skills.map((skill, index) => (
                  <span key={index} style={styles.tag}>{skill}</span>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  onClick={() => {
                    setEditingTest(test)
                    setJsonText(test.contentJson)
                    setJsonError(null)
                  }}
                  style={styles.jsonBtn}
                >
                  <Code size={14} />
                  Sửa JSON
                </button>

                <button
                  onClick={() => {
                    if (confirm(`Bạn có chắc chắn muốn xóa đề thi: ${test.title}?`)) {
                      onDeleteTest(test.id)
                    }
                  }}
                  style={styles.trashBtn}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
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

                <div style={styles.formGroup}>
                  <label style={styles.label}>Chọn các kỹ năng tích hợp</label>
                  <div style={styles.skillBtnGrid}>
                    {skillOptions.map((skill) => {
                      const active = newSkills.includes(skill)
                      return (
                        <button
                          type="button"
                          key={skill}
                          onClick={() => toggleNewSkill(skill)}
                          style={styles.skillSelectBtn(active)}
                        >
                          <span style={{ textTransform: "uppercase" }}>{skill}</span>
                          {active && <Check size={14} />}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div style={{ fontSize: "11px", background: "#f8fafc", padding: "12px", borderRadius: "8px", color: "#6b7280", lineHeight: 1.4 }}>
                  Khi tạo, hệ thống sẽ tự sinh bộ khung câu hỏi mẫu chuẩn hóa. Bạn có thể thay đổi cấu trúc chi tiết bằng JSON sau đó.
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

      {/* JSON EDITOR DRAWER */}
      {editingTest && (
        <div style={styles.modalOverlay}>
          <div style={styles.drawer}>
            <div style={styles.modalHeader}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#111827", margin: 0 }}>Cấu trúc JSON Câu hỏi</h3>
                <span style={{ fontSize: "12px", color: "#6b7280", fontStyle: "italic", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "450px" }}>Đề thi: {editingTest.title}</span>
              </div>
              <button onClick={() => setEditingTest(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ flex: 1, padding: "24px", display: "flex", flexDirection: "column", gap: "16px", overflowY: "auto", boxSizing: "border-box" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", fontWeight: 750, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.04em" }}>Nội dung JSON</span>
                <span style={styles.badgeError(!!jsonError)}>
                  {jsonError ? (
                    <>
                      <AlertCircle size={13} />
                      Sai cú pháp
                    </>
                  ) : (
                    <>
                      <Check size={13} />
                      JSON chuẩn
                    </>
                  )}
                </span>
              </div>

              <textarea
                value={jsonText}
                onChange={(e) => handleJsonChange(e.target.value)}
                style={styles.textarea}
              />

              {jsonError && (
                <div style={{ background: "#fee2e2", border: "1px solid #fecaca", padding: "12px", borderRadius: "8px", display: "flex", gap: "10px", alignItems: "start" }}>
                  <AlertCircle size={16} style={{ color: "#b91c1c", flexShrink: 0, marginTop: "2px" }} />
                  <div style={{ fontSize: "12px", color: "#b91c1c", fontWeight: 500, lineHeight: 1.4 }}>
                    <strong>Lỗi cú pháp:</strong> {jsonError}
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding: "16px 24px", background: "#f9fafb", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button
                onClick={() => setEditingTest(null)}
                style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#ffffff", fontSize: "13px", fontWeight: 600, cursor: "pointer", color: "#4b5563" }}
              >
                Hủy
              </button>
              <button
                onClick={handleSaveJson}
                disabled={!!jsonError}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "none",
                  background: jsonError ? "#cbd5e1" : "#2563eb",
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: jsonError ? "not-allowed" : "pointer"
                }}
              >
                Lưu Thay Đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
