// src/pages/admin/AdminPage.tsx

import { useState, useEffect } from "react"
import { 
  Transaction, 
  PracticeTest, 
  CreditPackage, 
  ShadowingTopic, 
  UserAdmin 
} from "./types"
import DashboardTab from "./components/DashboardTab"
import TestsTab from "./components/TestsTab"
import PackagesTab from "./components/PackagesTab"
import ShadowingTab from "./components/ShadowingTab"
import UsersTab from "./components/UsersTab"
import {
  getPronunciationTopics,
  createPronunciationTopicAdmin,
  deletePronunciationTopicAdmin
} from "@/api/practiceGeneral.api"

import logoImg from "@/assets/logo.png"

import { 
  LayoutDashboard, 
  BookOpen, 
  CreditCard, 
  Youtube, 
  Users, 
  ArrowLeft,
  BellRing
} from "lucide-react"

type TabType = "dashboard" | "tests" | "packages" | "shadowing" | "users"

// Custom hook for responsive layout resizing
export function useWindowSize() {
  const [size, setSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800
  })

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight })
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return size
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard")
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const { width } = useWindowSize()
  const isMobileView = width < 768

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  useEffect(() => {
    if (activeTab === "shadowing") {
      const loadTopics = async () => {
        try {
          const data = await getPronunciationTopics()
          setTopics(data as any)
        } catch (e: any) {
          showToast("Lỗi khi tải danh sách bài phát âm: " + e.message)
        }
      }
      loadTopics()
    }
  }, [activeTab])

  // ==================================================================
  // MOCK DATA INITIALIZATION
  // ==================================================================

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "tx1",
      sePayTxId: "SP92837482",
      email: "viet.nguyen@gmail.com",
      amount: 135000,
      credits: 300,
      status: "COMPLETED",
      date: "2026-05-30T10:15:00Z",
      memo: "IELTS928374"
    },
    {
      id: "tx2",
      sePayTxId: "SP92837483",
      email: "lan.huynh@yahoo.com",
      amount: 50000,
      credits: 100,
      status: "COMPLETED",
      date: "2026-05-30T11:20:00Z",
      memo: "IELTS928375"
    },
    {
      id: "tx3",
      sePayTxId: "SP92837484",
      email: "duc.tran@outlook.com",
      amount: 400000,
      credits: 1000,
      status: "PENDING",
      date: "2026-05-30T12:05:00Z",
      memo: "IELTS928376"
    },
    {
      id: "tx4",
      sePayTxId: "SP92837485",
      email: "mai.le@gmail.com",
      amount: 135000,
      credits: 300,
      status: "FAILED",
      date: "2026-05-30T09:40:00Z",
      memo: "IELTS928373"
    }
  ])

  const [tests, setTests] = useState<PracticeTest[]>([
    {
      id: "test-cam19-t1",
      title: "IELTS Cambridge 19 - Test 1 (Full Practice)",
      visits: 890,
      skills: ["listening", "reading", "writing", "speaking"],
      contentJson: JSON.stringify({
        title: "IELTS Cambridge 19 - Test 1",
        questionsCount: 40,
        sections: [
          {
            name: "Section 1: Multiple Choice",
            questions: [
              { id: "q1", text: "What is the main topic of the conversation?", options: ["Travel agent bookings", "Hotel check-in details", "Flight cancellation guidelines"], correctAnswer: "A" }
            ]
          }
        ]
      }, null, 2)
    },
    {
      id: "test-cam19-t2",
      title: "IELTS Cambridge 19 - Test 2 (Listening & Reading)",
      visits: 420,
      skills: ["listening", "reading"],
      contentJson: JSON.stringify({
        title: "IELTS Cambridge 19 - Test 2",
        questionsCount: 40,
        sections: [
          {
            name: "Section 1",
            questions: [
              { id: "q1", text: "Fill in the blank: The speaker arrived at ____ o'clock.", correctAnswer: "10" }
            ]
          }
        ]
      }, null, 2)
    },
    {
      id: "test-speaking-p1",
      title: "Speaking Part 1: Hobbies & Leisures (Shadowing)",
      visits: 1250,
      skills: ["speaking"],
      contentJson: JSON.stringify({
        topicName: "Hobbies",
        prompt: "Tell me about your favorite hobbies in your spare time.",
        difficulty: "Medium"
      }, null, 2)
    }
  ])

  const [packages, setPackages] = useState<CreditPackage[]>([
    { id: "p1", name: "Gói Starter", price: 50000, credits: 100, bonus: 10, isActive: true, sortOrder: 1 },
    { id: "p2", name: "Gói Popular", price: 135000, credits: 300, bonus: 45, isActive: true, sortOrder: 2 },
    { id: "p3", name: "Gói Pro Premium", price: 400000, credits: 1000, bonus: 200, isActive: true, sortOrder: 3 },
    { id: "p4", name: "Gói VIP Custom", price: 900000, credits: 2500, bonus: 600, isActive: false, sortOrder: 4 },
  ])

  const [topics, setTopics] = useState<ShadowingTopic[]>([])

  const [users, setUsers] = useState<UserAdmin[]>([
    { id: "u1", name: "Nguyễn Hoàng Việt", email: "viet.nguyen@gmail.com", role: "STUDENT", balance: 350, joinDate: "2026-05-01" },
    { id: "u2", name: "Huỳnh Thị Mỹ Lan", email: "lan.huynh@yahoo.com", role: "STUDENT", balance: 145, joinDate: "2026-05-12" },
    { id: "u3", name: "Trần Đăng Đức", email: "duc.tran@outlook.com", role: "STUDENT", balance: 12, joinDate: "2026-05-20" },
    { id: "u4", name: "Lê Tuyết Mai", email: "mai.le@gmail.com", role: "STUDENT", balance: 300, joinDate: "2026-05-24" },
    { id: "u5", name: "Admin BandBuilder", email: "admin@bandbuilder.com", role: "ADMIN", balance: 99999, joinDate: "2026-04-01" }
  ])

  // ==================================================================
  // HANDLERS AND STATED MUTATORS
  // ==================================================================

  const handleApproveTransaction = (txId: string) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === txId) {
        setUsers(prevUsers => prevUsers.map(u => {
          if (u.email === t.email) {
            return { ...u, balance: u.balance + t.credits }
          }
          return u
        }))
        showToast(`Duyệt thành công giao dịch ${t.sePayTxId}! Đã cộng +${t.credits} credits vào tài khoản.`)
        return { ...t, status: "COMPLETED" as const }
      }
      return t
    }))
  }

  const handleAddTest = (newTest: Omit<PracticeTest, "id" | "visits">) => {
    const created: PracticeTest = {
      ...newTest,
      id: `test-${Date.now().toString().slice(-6)}`,
      visits: 0
    }
    setTests(prev => [created, ...prev])
    showToast(`Đã thêm thành công đề thi mới: ${newTest.title}`)
  }

  const handleUpdateTest = (id: string, updated: Partial<PracticeTest>) => {
    setTests(prev => prev.map(t => (t.id === id ? { ...t, ...updated } : t)))
    showToast(`Đã cập nhật cấu trúc đề thi thành công!`)
  }

  const handleDeleteTest = (id: string) => {
    setTests(prev => prev.filter(t => t.id !== id))
    showToast(`Đã xoá đề thi khỏi hệ thống thành công.`)
  }

  const handleUpdatePackage = (id: string, updated: Partial<CreditPackage>) => {
    setPackages(prev => prev.map(p => (p.id === id ? { ...p, ...updated } : p)))
    if (updated.isActive !== undefined) {
      showToast(`Đã cập nhật trạng thái hiển thị gói nạp.`)
    } else {
      showToast(`Đã chỉnh sửa thông số gói nạp thành công!`)
    }
  }

  const handleAddTopic = async (newTopic: Omit<ShadowingTopic, "id" | "vocabCount" | "sentencesCount">) => {
    try {
      // Chuẩn hóa mảng sentences để gửi lên API backend
      const normalizedSentences = newTopic.sentences.map(s => ({
        text: s.text,
        startTime: s.startTime,
        endTime: s.endTime,
        orderIndex: s.orderIndex
      }))

      await createPronunciationTopicAdmin({
        title: newTopic.title,
        paragraph: newTopic.paragraph,
        videoUrl: newTopic.videoUrl,
        sentences: normalizedSentences,
        vocabs: [] // từ vựng khởi tạo rỗng, thêm bằng CRUD từ vựng sau
      })

      const data = await getPronunciationTopics()
      setTopics(data as any)
      showToast(`Đã tạo học liệu shadowing từ YouTube thành công!`)
    } catch (e: any) {
      showToast(`Lỗi khi tạo học liệu phát âm: ${e.message || e}`)
    }
  }

  const handleDeleteTopic = async (id: string) => {
    try {
      await deletePronunciationTopicAdmin(id)
      const data = await getPronunciationTopics()
      setTopics(data as any)
      showToast(`Đã xoá học liệu phát âm thành công.`)
    } catch (e: any) {
      showToast(`Lỗi khi xóa học liệu phát âm: ${e.message || e}`)
    }
  }

  const handleAdjustCredits = (userId: string, amount: number, type: "BONUS" | "REFUND", reason: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        showToast(`Đã điều chỉnh thành công! ${type === "BONUS" ? "Tặng" : "Trừ"} ${Math.abs(amount)} Credits ví của ${u.name}.`)
        return { ...u, balance: u.balance + amount }
      }
      return u
    }))
  }

  // Pure CSS inline styles declarations
  const styles = {
    layoutContainer: {
      display: "flex",
      minHeight: "100vh",
      background: "#f8fafc",
      fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, Be Vietnam Pro, sans-serif",
      color: "#1e293b",
    },
    sidebar: {
      width: "220px",
      minHeight: "100vh",
      background: "#111827",
      padding: "16px 0",
      display: isMobileView ? "none" : "flex",
      flexDirection: "column" as const,
      justifyContent: "space-between",
      boxSizing: "border-box" as const,
      flexShrink: 0
    },
    logoArea: {
      padding: "16px 20px",
      borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    logoImg: {
      width: "36px",
      height: "36px",
      objectFit: "contain" as const,
    },
    logoText: {
      fontSize: "15px",
      fontWeight: 800,
      color: "#ffffff",
      letterSpacing: "-0.01em",
    },
    logoSub: {
      fontSize: "9px",
      color: "#6366f1",
      fontWeight: 700,
      textTransform: "uppercase" as const,
      letterSpacing: "0.05em",
    },
    navGroup: {
      marginTop: "24px",
      display: "flex",
      flexDirection: "column" as const,
      gap: "4px"
    },
    navItem: (active: boolean) => ({
      padding: "9px 20px",
      fontSize: "13px",
      fontWeight: active ? 600 : 500,
      color: active ? "#ffffff" : "rgba(255, 255, 255, 0.65)",
      background: active ? "rgba(255, 255, 255, 0.08)" : "transparent",
      borderRadius: 0,
      border: "none",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      width: "100%",
      textAlign: "left" as const,
      cursor: "pointer",
      boxSizing: "border-box" as const,
      transition: "all 0.15s"
    }),
    sidebarFooter: {
      padding: "24px 20px 8px 20px",
      borderTop: "1px solid rgba(255, 255, 255, 0.08)"
    },
    backButton: {
      fontSize: "12px",
      fontWeight: 600,
      color: "rgba(255, 255, 255, 0.5)",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      textDecoration: "none",
      cursor: "pointer",
      border: "none",
      background: "none",
      padding: "8px 0",
      textAlign: "left" as const
    },
    mainCanvas: {
      flex: 1,
      minWidth: 0,
      height: "100vh",
      overflowY: "auto" as const,
      boxSizing: "border-box" as const,
    },
    topHeaderBar: {
      background: "#ffffff",
      borderBottom: "1px solid #e5e7eb",
      padding: "16px 40px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box" as const,
    },
    topHeaderLeft: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    serverStatusBadge: {
      fontSize: "11px",
      padding: "3px 10px",
      borderRadius: "100px",
      background: "#dcfce7",
      color: "#15803d",
      fontWeight: 600,
      display: "inline-flex",
      alignItems: "center",
    },
    topHeaderRight: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      fontSize: "13px",
      fontWeight: 500,
      color: "#4b5563",
    },
    sePayDot: {
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      background: "#22c55e",
      display: "inline-block",
      marginRight: "6px"
    },
    mainContentArea: {
      padding: "32px 40px",
      boxSizing: "border-box" as const,
      display: "flex",
      flexDirection: "column" as const,
      gap: "32px"
    },
    toastContainer: {
      position: "fixed" as const,
      top: "24px",
      right: "24px",
      zIndex: 9999,
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      color: "#1f2937",
      borderRadius: "12px",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      padding: "16px 20px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      width: "320px",
      animation: "slideIn 0.3s ease-out"
    }
  }

  return (
    <div style={styles.layoutContainer}>
      
      {/* GLOBAL TOAST */}
      {toastMessage && (
        <div style={styles.toastContainer}>
          <span style={{ padding: "8px", background: "#f3f4f6", color: "#174593", borderRadius: "8px", display: "flex", flexShrink: 0 }}>
            <BellRing size={16} />
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ fontSize: "10px", color: "#6b7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Thông báo</span>
            <p style={{ fontSize: "12px", color: "#374151", margin: 0, fontWeight: 500, lineHeight: 1.4 }}>{toastMessage}</p>
          </div>
        </div>
      )}

      {/* LEFT SIDEBAR NAVIGATION */}
      <aside style={styles.sidebar}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Logo Area */}
          <div style={styles.logoArea}>
            <img src={logoImg} alt="Logo" style={styles.logoImg} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={styles.logoText}>BandBuilder</span>
              <span style={styles.logoSub}>Admin Portal</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav style={styles.navGroup}>
            <button
              onClick={() => setActiveTab("dashboard")}
              style={styles.navItem(activeTab === "dashboard")}
            >
              <LayoutDashboard size={16} style={{ flexShrink: 0 }} />
              Đối soát & Doanh thu
            </button>

            <button
              onClick={() => setActiveTab("tests")}
              style={styles.navItem(activeTab === "tests")}
            >
              <BookOpen size={16} style={{ flexShrink: 0 }} />
              Quản trị Đề thi
            </button>

            <button
              onClick={() => setActiveTab("packages")}
              style={styles.navItem(activeTab === "packages")}
            >
              <CreditCard size={16} style={{ flexShrink: 0 }} />
              Gói nạp Credit
            </button>

            <button
              onClick={() => setActiveTab("shadowing")}
              style={styles.navItem(activeTab === "shadowing")}
            >
              <Youtube size={16} style={{ flexShrink: 0 }} />
              YouTube Shadowing
            </button>

            <button
              onClick={() => setActiveTab("users")}
              style={styles.navItem(activeTab === "users")}
            >
              <Users size={16} style={{ flexShrink: 0 }} />
              Ví & Người dùng
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div style={styles.sidebarFooter}>
          <a href="/" style={styles.backButton}>
            <ArrowLeft size={14} />
            Về trang Học viên
          </a>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT */}
      <main style={styles.mainCanvas}>
        {/* TOP MOBILE BAR / HEADER */}
        <header style={styles.topHeaderBar}>
          <div style={styles.topHeaderLeft}>
            {isMobileView && (
              <img src={logoImg} alt="Logo" style={{ height: "28px", width: "28px", objectFit: "contain", marginRight: "8px" }} />
            )}
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "0.02em" }}>
              {isMobileView ? "BandBuilder Admin" : "Hệ thống Quản trị"}
            </span>
          </div>

          <div style={styles.topHeaderRight}>
            <span>Trạng thái Server: </span>
            <span style={styles.serverStatusBadge}>
              <span style={styles.sePayDot}></span>
              ONLINE
            </span>
          </div>
        </header>

        {/* CONTAINER FOR ACTIVE TABS */}
        <div style={styles.mainContentArea}>
          {activeTab === "dashboard" && (
            <DashboardTab 
              transactions={transactions} 
              onApproveTransaction={handleApproveTransaction} 
            />
          )}

          {activeTab === "tests" && (
            <TestsTab 
              tests={tests}
              onAddTest={handleAddTest}
              onUpdateTest={handleUpdateTest}
              onDeleteTest={handleDeleteTest}
            />
          )}

          {activeTab === "packages" && (
            <PackagesTab 
              packages={packages} 
              onUpdatePackage={handleUpdatePackage} 
            />
          )}

          {activeTab === "shadowing" && (
            <ShadowingTab 
              topics={topics}
              onAddTopic={handleAddTopic}
              onDeleteTopic={handleDeleteTopic}
            />
          )}

          {activeTab === "users" && (
            <UsersTab 
              users={users} 
              onAdjustCredits={handleAdjustCredits} 
            />
          )}
        </div>
      </main>
    </div>
  )
}
