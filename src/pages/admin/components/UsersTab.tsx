// src/pages/admin/components/UsersTab.tsx

import { useState } from "react"
import { UserAdmin } from "../types"
import { 
  Search, 
  User, 
  Coins, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  PlusCircle,
  MinusCircle,
  ArrowRight,
  Shield,
  X
} from "lucide-react"

interface Props {
  users: UserAdmin[]
  onAdjustCredits: (userId: string, amount: number, type: "BONUS" | "REFUND", reason: string) => void
}

export default function UsersTab({ users, onAdjustCredits }: Props) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<UserAdmin | null>(null)
  
  // Wallet adjust modal state
  const [adjustAmount, setAdjustAmount] = useState<number>(0)
  const [adjustType, setAdjustType] = useState<"BONUS" | "REFUND">("BONUS")
  const [adjustReason, setAdjustReason] = useState("")
  const [showAdjustModal, setShowAdjustModal] = useState(false)

  // Filter users list
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handle adjust submit
  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser || adjustAmount <= 0) return

    const actualAmount = adjustType === "BONUS" ? adjustAmount : -adjustAmount
    onAdjustCredits(selectedUser.id, actualAmount, adjustType, adjustReason)
    
    // Update local selected user balance visually in drawer
    setSelectedUser({
      ...selectedUser,
      balance: selectedUser.balance + actualAmount
    })

    // Reset
    setAdjustAmount(0)
    setAdjustReason("")
    setShowAdjustModal(false)
  }

  // Simulated transaction logs per user
  const mockLogs = [
    { id: "l1", type: "VietQR Deposit", amount: 100, date: "2026-05-28 14:22", desc: "Nạp gói Starter tự động qua VietQR" },
    { id: "l2", type: "AI Grader Spend", amount: -1, date: "2026-05-29 09:15", desc: "Mở khóa giải thích đáp án AI Reading" },
    { id: "l3", type: "AI Grader Spend", amount: -1, date: "2026-05-29 10:30", desc: "Xem bài viết luận mẫu IELTS Task 2" },
    { id: "l4", type: "ADMIN BONUS", amount: 20, date: "2026-05-30 11:00", desc: "Tặng credit bonus khuyến học" },
  ]

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Quản trị Người dùng & Ví Credit</h2>
        <p className="text-slate-400 text-sm mt-1">
          Xem thông tin tài khoản học viên, tra cứu lịch sử làm bài thi, đối soát biến động số dư và can thiệp điều chỉnh ví thủ công.
        </p>
      </div>

      {/* SEARCH AND FILTER USER BAR */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input 
            type="text"
            placeholder="Tìm theo tên học viên, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
        </div>
        <div className="text-xs text-slate-400 font-medium">
          Tổng số tài khoản: <strong className="text-white">{users.length}</strong> học viên
        </div>
      </div>

      {/* USER LIST GRID */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/10 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-5">Học viên</th>
                <th className="py-3.5 px-5">Email</th>
                <th className="py-3.5 px-5">Vai trò</th>
                <th className="py-3.5 px-5 text-center">Số dư ví</th>
                <th className="py-3.5 px-5">Ngày tham gia</th>
                <th className="py-3.5 px-5 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-sm text-slate-300">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Không tìm thấy học viên nào khớp với tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-900/20 transition-all duration-150">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-sm border border-indigo-500/20 shrink-0">
                          {u.name.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-bold text-white block">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5">{u.email}</td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        u.role === "ADMIN" 
                          ? "bg-purple-500/10 text-purple-400 border border-purple-500/10" 
                          : "bg-slate-900 text-slate-400 border border-slate-850"
                      }`}>
                        {u.role === "ADMIN" && <Shield className="w-3.5 h-3.5" />}
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span className="text-indigo-400 font-extrabold flex items-center justify-center gap-1">
                        <Coins className="w-3.5 h-3.5" />
                        {u.balance} Credits
                      </span>
                    </td>
                    <td className="py-4 px-5 text-slate-400 text-xs">{u.joinDate}</td>
                    <td className="py-4 px-5 text-center">
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="text-indigo-400 hover:text-indigo-300 font-bold text-xs bg-indigo-500/5 hover:bg-indigo-500/10 py-1.5 px-3 rounded-lg border border-indigo-500/10 transition-all cursor-pointer inline-flex items-center gap-1"
                      >
                        Ví & Chi tiết
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* USER DETAILS SLIDE OVER DRAWER */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-end">
          <div className="bg-slate-950 border-l border-slate-800 w-full max-w-md h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-250">
            
            {/* Header */}
            <div className="px-6 py-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Hồ Sơ Chi Tiết Học Viên</h3>
                <p className="text-xs text-slate-400 mt-0.5">Quản lý ví nạp và theo dõi kết quả luyện thi.</p>
              </div>
              <button 
                onClick={() => setSelectedUser(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Drawer Area */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              {/* Profile Card */}
              <div className="flex items-center gap-4 bg-slate-900/40 border border-slate-850 p-4 rounded-2xl">
                <div className="h-14 w-14 rounded-2xl bg-indigo-600 flex items-center justify-center font-bold text-white text-xl border border-indigo-500/20 shrink-0">
                  {selectedUser.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-base text-white">{selectedUser.name}</h4>
                  <p className="text-xs text-slate-400 font-mono">{selectedUser.email}</p>
                  <span className="text-[10px] text-slate-500">ID: {selectedUser.id}</span>
                </div>
              </div>

              {/* Credits Box */}
              <div className="bg-gradient-to-br from-indigo-950/40 to-slate-950 border border-indigo-500/20 rounded-2xl p-5 shadow-lg flex justify-between items-center">
                <div>
                  <span className="text-slate-400 text-xs font-semibold block uppercase">Số dư Credits Ví hiện tại</span>
                  <div className="flex items-center gap-2 mt-2">
                    <Coins className="w-6 h-6 text-indigo-400" />
                    <span className="text-3xl font-extrabold text-white tracking-tight">{selectedUser.balance}</span>
                    <span className="text-xs text-slate-500 font-bold uppercase mt-2">Credits</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowAdjustModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow hover:shadow-indigo-500/20 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  Điều chỉnh ví
                </button>
              </div>

              {/* Progress Summary */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tiến độ học tập IELTS</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900/30 border border-slate-900 rounded-xl p-3.5 space-y-1">
                    <span className="text-slate-500 text-[10px] font-semibold uppercase">Đề thi đã làm</span>
                    <span className="text-lg font-bold text-white block">12 bài thi</span>
                  </div>
                  <div className="bg-slate-900/30 border border-slate-900 rounded-xl p-3.5 space-y-1">
                    <span className="text-slate-500 text-[10px] font-semibold uppercase">Tiến trình Lộ Trình</span>
                    <span className="text-lg font-bold text-emerald-400 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4" />
                      45%
                    </span>
                  </div>
                </div>
              </div>

              {/* Wallet Transaction History logs list */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-500" />
                  Lịch sử biến động ví
                </h4>
                
                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {mockLogs.map((log) => (
                    <div key={log.id} className="bg-slate-900/20 border border-slate-900 rounded-xl p-3 flex justify-between items-center gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-white block">{log.type}</span>
                          <span className="text-[10px] text-slate-500">{log.date}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-normal">{log.desc}</p>
                      </div>
                      <span className={`text-xs font-bold shrink-0 ${
                        log.amount > 0 ? "text-emerald-400" : "text-rose-400"
                      }`}>
                        {log.amount > 0 ? `+${log.amount}` : log.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer"
              >
                Đóng chi tiết
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADJUST BALANCE MODAL */}
      {showAdjustModal && selectedUser && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Coins className="w-4.5 h-4.5 text-indigo-400" />
                Điều chỉnh số dư ví của {selectedUser.name.split(" ")[0]}
              </h3>
              <button 
                onClick={() => setShowAdjustModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleAdjustSubmit} className="p-6 space-y-4">
              {/* Type Select buttons */}
              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-1.5">Loại điều chỉnh ví</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType("BONUS")}
                    className={`py-2 rounded-lg text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                      adjustType === "BONUS"
                        ? "bg-indigo-500/10 border-indigo-500 text-indigo-400"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <PlusCircle className="w-4 h-4" />
                    CỘNG THƯỞNG (BONUS)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType("REFUND")}
                    className={`py-2 rounded-lg text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                      adjustType === "REFUND"
                        ? "bg-rose-500/10 border-rose-500 text-rose-400"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <MinusCircle className="w-4 h-4" />
                    HOÀN TRẢ (REFUND)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-1.5">Lượng Credits</label>
                <input 
                  type="number"
                  required
                  min={1}
                  value={adjustAmount === 0 ? "" : adjustAmount}
                  onChange={(e) => setAdjustAmount(parseInt(e.target.value) || 0)}
                  placeholder="Nhập số Credits cần điều chỉnh..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-1.5">Lý do điều chỉnh</label>
                <textarea
                  required
                  rows={3}
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="Nhập lý do lưu log giao dịch (Ví dụ: Thưởng khuyến học, Hoàn tiền cuộc gọi AI lỗi...)"
                  className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 text-slate-200 p-2.5 rounded-lg text-xs focus:outline-none resize-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-900 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="px-4 py-2 border border-slate-800 hover:bg-slate-900 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg text-xs transition-all shadow-lg hover:shadow-indigo-500/20 cursor-pointer"
                >
                  Xác nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
