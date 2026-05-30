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
  LayoutDashboard, 
  BookOpen, 
  CreditCard, 
  Youtube, 
  Users, 
  ArrowLeft,
  Settings,
  LogOut,
  BellRing
} from "lucide-react"

type TabType = "dashboard" | "tests" | "packages" | "shadowing" | "users"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard")
  
  // Custom Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  
  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  // ==================================================================
  // MOCK DATA INITIALIZATION
  // ==================================================================

  // 1. Transactions SePay Webhook Mock
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

  // 2. Practice & Skill Tests Mock
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

  // 3. Credit Packages Mock
  const [packages, setPackages] = useState<CreditPackage[]>([
    { id: "p1", name: "Gói Starter", price: 50000, credits: 100, bonus: 10, isActive: true, sortOrder: 1 },
    { id: "p2", name: "Gói Popular", price: 135000, credits: 300, bonus: 45, isActive: true, sortOrder: 2 },
    { id: "p3", name: "Gói Pro Premium", price: 400000, credits: 1000, bonus: 200, isActive: true, sortOrder: 3 },
    { id: "p4", name: "Gói VIP Custom", price: 900000, credits: 2500, bonus: 600, isActive: false, sortOrder: 4 },
  ])

  // 4. Shadowing Youtube Topics Mock
  const [topics, setTopics] = useState<ShadowingTopic[]>([
    {
      id: "sh1",
      title: "IELTS Speaking Part 1 - Job & Career Shadowing",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      vocabCount: 5,
      sentencesCount: 12,
      paragraph: "Working in the digital era poses multiple challenges. A successful professional needs robust adaptability and continuous learning tools. Shadowing high-quality resources bridges the conversational fluency gap.",
      sentences: []
    },
    {
      id: "sh2",
      title: "Environment, Pollution and Climate Change Vocabulary",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      vocabCount: 8,
      sentencesCount: 16,
      paragraph: "Protecting our fragile biosphere requires rapid legislative interventions. Greenhouse emissions have surged in industrial areas, triggering severe ecological imbalances worldwide.",
      sentences: []
    }
  ])

  // 5. Users Accounts Wallet Balance Mock
  const [users, setUsers] = useState<UserAdmin[]>([
    { id: "u1", name: "Nguyễn Hoàng Việt", email: "viet.nguyen@gmail.com", role: "STUDENT", balance: 350, joinDate: "2026-05-01" },
    { id: "u2", name: "Huỳnh Thị Mỹ Lan", email: "lan.huynh@yahoo.com", role: "STUDENT", balance: 145, joinDate: "2026-05-12" },
    { id: "u3", name: "Trần Đăng Đức", email: "duc.tran@outlook.com", role: "STUDENT", balance: 12, joinDate: "2026-05-20" },
    { id: "u4", name: "Lê Tuyết Mai", email: "mai.le@gmail.com", role: "STUDENT", balance: 300, joinDate: "2026-05-24" },
    { id: "u5", name: "Admin BandBuilder", email: "admin@bandbuilder.com", role: "ADMIN", balance: 99999, joinDate: "2026-04-01" }
  ])

  // ==================================================================
  // HANDLERS AND STATED MUTATORS (REACTIVE CONTROL)
  // ==================================================================

  // Dashboard manual transaction approvals
  const handleApproveTransaction = (txId: string) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === txId) {
        // Find corresponding user email to add balance
        setUsers(prevUsers => prevUsers.map(u => {
          if (u.email === t.email) {
            return { ...u, balance: u.balance + t.credits }
          }
          return u
        }))
        showToast(`Đã duyệt thành công giao dịch ${t.sePayTxId}! Cộng +${t.credits} credits vào ví tài khoản.`)
        return { ...t, status: "COMPLETED" as const }
      }
      return t
    }))
  }

  // Tests management handlers
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

  // Credit packages handlers
  const handleUpdatePackage = (id: string, updated: Partial<CreditPackage>) => {
    setPackages(prev => prev.map(p => (p.id === id ? { ...p, ...updated } : p)))
    if (updated.isActive !== undefined) {
      showToast(`Đã cập nhật trạng thái hiển thị gói nạp.`)
    } else {
      showToast(`Đã chỉnh sửa thông số gói nạp thành công!`)
    }
  }

  // Shadowing youtube handlers
  const handleAddTopic = (newTopic: Omit<ShadowingTopic, "id" | "vocabCount" | "sentencesCount">) => {
    const created: ShadowingTopic = {
      ...newTopic,
      id: `sh-${Date.now().toString().slice(-6)}`,
      vocabCount: 5,
      sentencesCount: newTopic.sentences.length
    }
    setTopics(prev => [created, ...prev])
    showToast(`Đã tạo học liệu shadowing từ YouTube thành công!`)
  }

  const handleDeleteTopic = (id: string) => {
    setTopics(prev => prev.filter(t => t.id !== id))
    showToast(`Đã xoá học liệu phát âm.`)
  }

  // Users adjustments
  const handleAdjustCredits = (userId: string, amount: number, type: "BONUS" | "REFUND", reason: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        showToast(`Đã điều chỉnh thành công! ${type === "BONUS" ? "Tặng" : "Trừ"} ${Math.abs(amount)} Credits ví của ${u.name}. Lý do: ${reason}`)
        return { ...u, balance: u.balance + amount }
      }
      return u
    }))
  }

  return (
    <div className="min-h-screen bg-[#070b13] flex font-sans antialiased text-slate-200">
      
      {/* GLOBAL NOTIFICATION TOAST */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-[9999] bg-slate-900 border border-indigo-500/30 text-white rounded-xl shadow-2xl px-4 py-3 flex.items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-250 w-80">
          <div className="flex items-start gap-3">
            <span className="p-1 bg-indigo-500/10 text-indigo-400 rounded-lg shrink-0">
              <BellRing className="w-5 h-5" />
            </span>
            <div>
              <span className="text-xs text-indigo-400 font-bold block">Thông báo Quản trị</span>
              <p className="text-xs text-slate-300 mt-0.5 leading-normal">{toastMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className="w-64 border-r border-slate-900 bg-[#090e1a] shrink-0 hidden md:flex flex-col justify-between p-5 h-screen sticky top-0">
        <div className="space-y-8">
          {/* Logo Brand */}
          <div className="flex items-center gap-3 px-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <span className="font-extrabold text-white text-base">B</span>
            </div>
            <div>
              <span className="font-extrabold text-white tracking-tight text-base block">BandBuilder</span>
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">ADMIN PORTAL</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "dashboard"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/50"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Đối soát & Doanh thu
            </button>

            <button
              onClick={() => setActiveTab("tests")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "tests"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/50"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Quản trị Đề thi
            </button>

            <button
              onClick={() => setActiveTab("packages")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "packages"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/50"
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Gói nạp Credit
            </button>

            <button
              onClick={() => setActiveTab("shadowing")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "shadowing"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/50"
              }`}
            >
              <Youtube className="w-4 h-4" />
              YouTube Shadowing
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "users"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/50"
              }`}
            >
              <Users className="w-4 h-4" />
              Ví & Người dùng
            </button>
          </nav>
        </div>

        {/* Sidebar Footer options */}
        <div className="space-y-4 pt-4 border-t border-slate-900">
          <div className="flex items-center gap-3 px-2">
            <div className="h-8 w-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-xs text-white">
              AD
            </div>
            <div>
              <span className="text-xs font-bold text-white block">System Admin</span>
              <span className="text-[10px] text-slate-500">Root Access</span>
            </div>
          </div>

          <a
            href="/"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900/30 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Về trang chủ Học viên
          </a>
        </div>
      </aside>

      {/* RIGHT MAIN PAGE CONTENT CANVAS */}
      <main className="flex-1 overflow-y-auto h-screen max-w-full">
        {/* TOP MOBILE BAR / GENERAL HEADER */}
        <header className="px-6 py-4 border-b border-slate-900 bg-[#090e1a]/80 backdrop-blur sticky top-0 z-40 flex items-center justify-between md:justify-end gap-4">
          <div className="flex items-center gap-3 md:hidden">
            <div className="h-7 w-7 rounded bg-indigo-600 flex items-center justify-center">
              <span className="font-extrabold text-white text-sm">B</span>
            </div>
            <span className="font-bold text-white text-sm">BandBuilder Admin</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Server Status: <strong className="text-emerald-500">ONLINE</strong></span>
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          </div>
        </header>

        {/* CONTAINER FOR ACTIVE TABS */}
        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
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
