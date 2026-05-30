// src/pages/admin/components/UsersTab.tsx

import { useState } from "react"
import { UserAdmin } from "../types"
import { 
  Search, 
  Coins, 
  TrendingUp, 
  Clock, 
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
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Quản lý Học viên & Ví Credits</h2>
        <p className="text-slate-500 text-sm mt-2 font-medium">
          Kiểm tra tài khoản người học, tra cứu lịch sử luyện thi, và can thiệp cộng thưởng (bonus) hoặc hoàn ví thủ công.
        </p>
      </div>

      {/* SEARCH AND FILTER USER BAR */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md w-full">
          <input 
            type="text"
            placeholder="Tìm theo tên học viên, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all font-medium"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        </div>
        <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
          Tổng số học viên: <strong className="text-slate-900 font-extrabold">{users.length}</strong>
        </div>
      </div>

      {/* USER LIST GRID */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/30 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Học viên</th>
                <th className="py-4 px-6">Địa chỉ Email</th>
                <th className="py-4 px-6">Quyền hạn</th>
                <th className="py-4 px-6 text-center">Số dư ví</th>
                <th className="py-4 px-6">Ngày gia nhập</th>
                <th className="py-4 px-6 text-center">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-650 font-medium">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold">
                    Không tìm thấy học viên nào khớp với tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/30 transition-all duration-150">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <div className="h-9 w-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-sm shrink-0">
                          {u.name.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-extrabold text-slate-900 text-sm block">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-750 font-semibold">{u.email}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wider ${
                        u.role === "ADMIN" 
                          ? "bg-purple-50 text-purple-600 border border-purple-100" 
                          : "bg-slate-100 text-slate-500"
                      }`}>
                        {u.role === "ADMIN" && <Shield className="w-3.5 h-3.5" />}
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-indigo-600 font-extrabold flex items-center justify-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 w-fit mx-auto">
                        <Coins className="w-4 h-4 text-indigo-500" />
                        {u.balance} Credits
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-400 font-semibold">{u.joinDate}</td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="text-indigo-650 hover:text-indigo-700 font-bold text-xs bg-indigo-50 hover:bg-indigo-100 py-2 px-3.5 rounded-xl border border-transparent transition-all cursor-pointer inline-flex items-center gap-1"
                      >
                        Ví & Chi tiết
                        <ArrowRight className="w-3.5 h-3.5" />
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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-end">
          <div className="bg-white border-l border-slate-100 w-full max-w-md h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-250">
            
            {/* Header */}
            <div className="px-6 py-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Chi Tiết Hồ Sơ Học Viên</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">Báo cáo ví nạp và theo dõi tổng thể kết quả.</p>
              </div>
              <button 
                onClick={() => setSelectedUser(null)}
                className="text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Drawer Area */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              {/* Profile Card */}
              <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-4.5 rounded-2xl">
                <div className="h-14 w-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-xl shrink-0">
                  {selectedUser.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-base text-slate-850">{selectedUser.name}</h4>
                  <p className="text-xs text-slate-500 font-mono font-medium">{selectedUser.email}</p>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">ID: {selectedUser.id}</span>
                </div>
              </div>

              {/* Credits Box */}
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/30 border border-indigo-200/50 rounded-2xl p-5 shadow-sm flex justify-between items-center">
                <div>
                  <span className="text-indigo-650 text-[10px] font-bold block uppercase tracking-wider">Số dư ví nạp</span>
                  <div className="flex items-center gap-2 mt-2">
                    <Coins className="w-6 h-6 text-indigo-500" />
                    <span className="text-3xl font-extrabold text-indigo-650 tracking-tight">{selectedUser.balance}</span>
                    <span className="text-xs text-indigo-400 font-extrabold uppercase mt-2">Credits</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowAdjustModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow hover:shadow-indigo-500/10 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  Cân đối ví
                </button>
              </div>

              {/* Progress Summary */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Thống kê học tập</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-1">
                    <span className="text-slate-400 text-[9px] font-bold uppercase tracking-wider block">Lượt thi</span>
                    <span className="text-lg font-bold text-slate-800 block">12 đề thi</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-1">
                    <span className="text-slate-400 text-[9px] font-bold uppercase tracking-wider block">Tiến độ lộ trình</span>
                    <span className="text-lg font-bold text-emerald-600 flex items-center gap-1.5 font-extrabold">
                      <TrendingUp className="w-4 h-4" />
                      45%
                    </span>
                  </div>
                </div>
              </div>

              {/* Wallet Transaction History logs list */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  Dòng tiền giao dịch ví
                </h4>
                
                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {mockLogs.map((log) => (
                    <div key={log.id} className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex justify-between items-center gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-800 block">{log.type}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">{log.date}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium leading-normal">{log.desc}</p>
                      </div>
                      <span className={`text-xs font-extrabold shrink-0 ${
                        log.amount > 0 ? "text-emerald-650" : "text-rose-600"
                      }`}>
                        {log.amount > 0 ? `+${log.amount}` : log.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-sm"
              >
                Đóng thông tin chi tiết
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADJUST BALANCE MODAL */}
      {showAdjustModal && selectedUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Coins className="w-4.5 h-4.5 text-indigo-500" />
                Cân đối Credits ví học viên
              </h3>
              <button 
                onClick={() => setShowAdjustModal(false)}
                className="text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleAdjustSubmit} className="p-6 space-y-4">
              {/* Type Select buttons */}
              <div>
                <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Hình thức can thiệp ví</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType("BONUS")}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                      adjustType === "BONUS"
                        ? "bg-indigo-50 border-indigo-200 text-indigo-650"
                        : "bg-white border-slate-200 text-slate-450 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <PlusCircle className="w-4 h-4" />
                    CỘNG BONUS
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType("REFUND")}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                      adjustType === "REFUND"
                        ? "bg-rose-50 border-rose-250 text-rose-650"
                        : "bg-white border-slate-200 text-slate-450 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <MinusCircle className="w-4 h-4" />
                    TRỪ / HOÀN TRẢ
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Số lượng Credits nạp</label>
                <input 
                  type="number"
                  required
                  min={1}
                  value={adjustAmount === 0 ? "" : adjustAmount}
                  onChange={(e) => setAdjustAmount(parseInt(e.target.value) || 0)}
                  placeholder="Nhập số Credits..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-850 font-bold focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Lý do điều chỉnh giao dịch</label>
                <textarea
                  required
                  rows={3}
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="Nhập lý do nạp log (Ví dụ: Thưởng quà sinh nhật học viên, hoàn tiền cuộc gọi âm thanh...)"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 text-slate-800 p-3 rounded-xl text-xs focus:outline-none resize-none font-medium"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="px-4.5 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-500 transition-all cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-all shadow-md hover:shadow-indigo-500/10 cursor-pointer"
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
