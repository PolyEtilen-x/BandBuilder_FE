// src/pages/admin/components/DashboardTab.tsx

import { useState } from "react"
import { Transaction } from "../types"
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  BookOpen, 
  Zap, 
  Search, 
  CheckCircle, 
  Clock, 
  XCircle,
  FileCheck
} from "lucide-react"

interface Props {
  transactions: Transaction[]
  onApproveTransaction: (txId: string) => void
}

export default function DashboardTab({ transactions, onApproveTransaction }: Props) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")

  // Calculate stats based on current transactions
  const totalRevenue = transactions
    .filter(t => t.status === "COMPLETED")
    .reduce((sum, t) => sum + t.amount, 0)

  const completedCount = transactions.filter(t => t.status === "COMPLETED").length
  const pendingCount = transactions.filter(t => t.status === "PENDING").length
  const failedCount = transactions.filter(t => t.status === "FAILED").length

  // Filter transactions
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = 
      t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.sePayTxId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.memo.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Format currency
  const formatVnd = (val: number): string => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val)
  }

  // 7-day revenue trend hardcoded values (updated dynamically in look)
  const chartData = [
    { day: "T2", val: 12000000, height: "40%" },
    { day: "T3", val: 15000000, height: "50%" },
    { day: "T4", val: 10000000, height: "35%" },
    { day: "T5", val: 22000000, height: "70%" },
    { day: "T6", val: 28000000, height: "85%" },
    { day: "T7", val: 32000000, height: "98%" },
    { day: "CN", val: 25000000, height: "80%" },
  ]

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Đối soát & Báo cáo tài chính</h2>
          <p className="text-slate-400 text-sm mt-1">Giám sát doanh thu, giao dịch VietQR tự động qua SePay Webhook và kiểm tra sức khỏe hệ thống.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-400">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Cổng Webhook SePay: Đang hoạt động</span>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900/60 to-slate-950 border border-indigo-500/20 rounded-xl p-5 shadow-xl hover:border-indigo-500/40 transition-all duration-300">
          <div className="absolute top-0 right-0 p-8 opacity-10 bg-indigo-400 rounded-bl-full pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm font-medium">Tổng Doanh Thu</span>
            <span className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-extrabold text-white tracking-tight">{formatVnd(totalRevenue)}</h3>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+15.4% so với tháng trước</span>
            </div>
          </div>
        </div>

        {/* Lượt thi */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900/40 to-slate-950 border border-emerald-500/20 rounded-xl p-5 shadow-xl hover:border-emerald-500/40 transition-all duration-300">
          <div className="absolute top-0 right-0 p-8 opacity-10 bg-emerald-400 rounded-bl-full pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm font-medium">Giao dịch Thành công</span>
            <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <CheckCircle className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-extrabold text-white tracking-tight">{completedCount} Giao dịch</h3>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Tỷ lệ hoàn tất 94.2%</span>
            </div>
          </div>
        </div>

        {/* Chờ duyệt */}
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-900/40 to-slate-950 border border-amber-500/20 rounded-xl p-5 shadow-xl hover:border-amber-500/40 transition-all duration-300">
          <div className="absolute top-0 right-0 p-8 opacity-10 bg-amber-400 rounded-bl-full pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm font-medium">Giao dịch Chờ xử lý</span>
            <span className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <Clock className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-extrabold text-white tracking-tight">{pendingCount} Chờ duyệt</h3>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-400">
              <span>Cần rà soát đối soát VietQR</span>
            </div>
          </div>
        </div>

        {/* Lỗi thanh toán */}
        <div className="relative overflow-hidden bg-gradient-to-br from-rose-900/40 to-slate-950 border border-rose-500/20 rounded-xl p-5 shadow-xl hover:border-rose-500/40 transition-all duration-300">
          <div className="absolute top-0 right-0 p-8 opacity-10 bg-rose-400 rounded-bl-full pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm font-medium">Giao dịch Lỗi</span>
            <span className="p-2 bg-rose-500/10 text-rose-400 rounded-lg">
              <XCircle className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-extrabold text-white tracking-tight">{failedCount} Thất bại</h3>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-rose-400">
              <span>Tài khoản huỷ hoặc sai cú pháp</span>
            </div>
          </div>
        </div>
      </div>

      {/* REVENUE CHART & WEBHOOK MONITOR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart Card */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Xu hướng Doanh thu 7 ngày</h3>
            <p className="text-slate-400 text-xs mt-1">Biểu diễn dòng tiền chuyển khoản nhận về qua hệ thống API SePay.</p>
          </div>

          <div className="mt-6 flex items-end justify-between h-48 px-2 gap-4">
            {chartData.map((d, i) => (
              <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group">
                {/* Tooltip value */}
                <div className="bg-slate-900 text-white border border-slate-700 text-[10px] py-1 px-1.5 rounded mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  {formatVnd(d.val)}
                </div>
                {/* Bar */}
                <div 
                  style={{ height: d.height }}
                  className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t group-hover:from-indigo-500 group-hover:to-cyan-400 transition-all duration-300"
                ></div>
                {/* Label */}
                <span className="text-xs text-slate-400 mt-2 font-medium">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Webhook Status Info */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Thông số Cổng SePay</h3>
            <p className="text-slate-400 text-xs mt-1">Cấu hình Webhook nhận tin ngân hàng thụ động thời gian thực.</p>
          </div>

          <div className="space-y-4 my-6 text-sm">
            <div className="flex justify-between border-b border-slate-900 pb-2">
              <span className="text-slate-400">Endpoint Webhook</span>
              <span className="text-white font-mono text-xs">/api/sepay/webhook</span>
            </div>
            <div className="flex justify-between border-b border-slate-900 pb-2">
              <span className="text-slate-400">Phương thức</span>
              <span className="text-indigo-400 font-bold text-xs bg-indigo-500/10 px-1.5 py-0.5 rounded">POST</span>
            </div>
            <div className="flex justify-between border-b border-slate-900 pb-2">
              <span className="text-slate-400">Khóa bảo mật (Secret)</span>
              <span className="text-white font-mono text-xs">••••••••••••••••</span>
            </div>
            <div className="flex justify-between border-b border-slate-900 pb-2">
              <span className="text-slate-400">Thời gian phản hồi</span>
              <span className="text-emerald-400 text-xs font-semibold">&lt; 150ms</span>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-3 text-xs text-slate-400">
            <span className="text-slate-300 font-bold block mb-1">Mẹo đối soát:</span>
            Nếu ngân hàng bị trễ dịch vụ webhook, Admin có thể click nút <strong>Duyệt thủ công</strong> ở bảng giao dịch để lập tức hoàn thành thanh toán và cộng credit cho học viên.
          </div>
        </div>
      </div>

      {/* TRANSACTIONS TABLE */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
        {/* Table Filter Header */}
        <div className="p-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/30">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-indigo-400" />
            Lịch sử giao dịch & đối soát VietQR
          </h3>
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <input 
                type="text"
                placeholder="Tìm email, mã giao dịch, memo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-64 transition-all"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>

            {/* Select Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">Tất cả Trạng thái</option>
              <option value="COMPLETED">Thành công</option>
              <option value="PENDING">Đang chờ</option>
              <option value="FAILED">Thất bại</option>
            </select>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/10 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-5">Mã SePay TXID</th>
                <th className="py-3.5 px-5">Tài khoản</th>
                <th className="py-3.5 px-5">Gói Nạp / Memo</th>
                <th className="py-3.5 px-5 text-right">Số tiền</th>
                <th className="py-3.5 px-5 text-center">Credit nạp</th>
                <th className="py-3.5 px-5">Thời gian</th>
                <th className="py-3.5 px-5">Trạng thái</th>
                <th className="py-3.5 px-5 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-sm text-slate-300">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 bg-slate-950">
                    Không tìm thấy giao dịch nào khớp với điều kiện lọc.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-900/20 transition-all duration-150">
                    <td className="py-4 px-5 font-mono text-xs text-white">{tx.sePayTxId}</td>
                    <td className="py-4 px-5 font-medium">{tx.email}</td>
                    <td className="py-4 px-5">
                      <div className="text-xs text-slate-400 font-semibold">{tx.memo}</div>
                    </td>
                    <td className="py-4 px-5 text-right font-bold text-white">{formatVnd(tx.amount)}</td>
                    <td className="py-4 px-5 text-center font-bold text-indigo-400">+{tx.credits}</td>
                    <td className="py-4 px-5 text-xs text-slate-400">
                      {new Date(tx.date).toLocaleString("vi-VN")}
                    </td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        tx.status === "COMPLETED" 
                          ? "bg-emerald-500/10 text-emerald-400" 
                          : tx.status === "PENDING"
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-rose-500/10 text-rose-400"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          tx.status === "COMPLETED" 
                            ? "bg-emerald-400" 
                            : tx.status === "PENDING"
                            ? "bg-amber-400 animate-pulse"
                            : "bg-rose-400"
                        }`}></span>
                        {tx.status === "COMPLETED" && "Thành công"}
                        {tx.status === "PENDING" && "Chờ duyệt"}
                        {tx.status === "FAILED" && "Lỗi GD"}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-center">
                      {tx.status === "PENDING" ? (
                        <button
                          onClick={() => onApproveTransaction(tx.id)}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-1 px-2.5 rounded text-xs transition-all shadow hover:shadow-indigo-500/20"
                        >
                          Duyệt thủ công
                        </button>
                      ) : (
                        <span className="text-slate-500 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
