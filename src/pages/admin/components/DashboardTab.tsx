// src/pages/admin/components/DashboardTab.tsx

import { useState } from "react"
import { Transaction } from "../types"
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
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
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Đối soát & Báo cáo tài chính</h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">Giám sát doanh thu, giao dịch nạp tiền VietQR tự động qua SePay Webhook và kiểm tra thanh toán.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-100 shadow-sm rounded-xl px-4 py-2.5 text-xs text-slate-600 font-semibold self-start md:self-auto">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Cổng Webhook SePay: Hoạt động</span>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Tổng Doanh Thu</span>
            <span className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-5">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{formatVnd(totalRevenue)}</h3>
            <div className="flex items-center gap-1.5 mt-2.5 text-xs text-emerald-600 font-semibold">
              <TrendingUp className="w-4 h-4" />
              <span>+15.4% so với tháng trước</span>
            </div>
          </div>
        </div>

        {/* Lượt thi */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Thành công</span>
            <span className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-5">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{completedCount} giao dịch</h3>
            <div className="flex items-center gap-1.5 mt-2.5 text-xs text-slate-500 font-medium">
              <span>Tỷ lệ hoàn tất giao dịch đạt 94.2%</span>
            </div>
          </div>
        </div>

        {/* Chờ duyệt */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Đang Chờ Duyệt</span>
            <span className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-5">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{pendingCount} giao dịch</h3>
            <div className="flex items-center gap-1.5 mt-2.5 text-xs text-amber-600 font-semibold">
              <span>Cần đối soát VietQR thủ công</span>
            </div>
          </div>
        </div>

        {/* Lỗi thanh toán */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Giao dịch Lỗi</span>
            <span className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
              <XCircle className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-5">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{failedCount} giao dịch</h3>
            <div className="flex items-center gap-1.5 mt-2.5 text-xs text-rose-600 font-semibold">
              <span>Sai cú pháp nạp hoặc huỷ nạp</span>
            </div>
          </div>
        </div>
      </div>

      {/* REVENUE CHART & WEBHOOK MONITOR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart Card */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Xu hướng Doanh thu 7 ngày qua</h3>
            <p className="text-slate-500 text-xs mt-1.5 font-medium">Biểu diễn dòng tiền chuyển khoản nhận về qua hệ thống API SePay thụ động.</p>
          </div>

          <div className="mt-8 flex items-end justify-between h-48 px-2 gap-4">
            {chartData.map((d, i) => (
              <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group">
                {/* Tooltip value */}
                <div className="bg-slate-900 text-white text-[10px] py-1 px-2 rounded mb-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-sm">
                  {formatVnd(d.val)}
                </div>
                {/* Bar */}
                <div 
                  style={{ height: d.height }}
                  className="w-full bg-slate-100 rounded-t-lg group-hover:bg-indigo-600 transition-all duration-300"
                ></div>
                {/* Label */}
                <span className="text-xs text-slate-400 mt-3 font-semibold">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Webhook Status Info */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Thông số Cổng SePay</h3>
            <p className="text-slate-500 text-xs mt-1.5 font-medium">Đặc tả liên kết webhook thanh toán ngân hàng chuyển khoản tự động.</p>
          </div>

          <div className="space-y-4 text-sm flex-1 flex flex-col justify-center">
            <div className="flex justify-between border-b border-slate-50 pb-2">
              <span className="text-slate-500 font-medium">Endpoint Webhook</span>
              <span className="text-slate-700 font-mono text-xs font-semibold">/api/sepay/webhook</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-2">
              <span className="text-slate-500 font-medium">Phương thức</span>
              <span className="text-indigo-600 font-bold text-xs bg-indigo-50 px-2 py-0.5 rounded">POST</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-2">
              <span className="text-slate-500 font-medium">Mã bảo mật (Secret)</span>
              <span className="text-slate-700 font-mono text-xs">••••••••••••••••</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-2">
              <span className="text-slate-500 font-medium">Độ trễ phản hồi</span>
              <span className="text-emerald-600 text-xs font-bold">&lt; 150ms</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs text-slate-500 leading-relaxed font-medium">
            <span className="text-slate-800 font-bold block mb-1">Quy định đối soát tài chính:</span>
            Trường hợp khách hàng chuyển tiền nhưng webhook bị chậm, admin có thể dùng nút <strong>Duyệt thủ công</strong> để cập nhật trạng thái ngay.
          </div>
        </div>
      </div>

      {/* TRANSACTIONS TABLE */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        {/* Table Filter Header */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-indigo-600" />
            Lịch sử giao dịch & đối soát nạp Credit
          </h3>
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <input 
                type="text"
                placeholder="Tìm email, mã giao dịch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-60 transition-all font-medium"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>

            {/* Select Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 focus:outline-none focus:border-indigo-500 font-semibold"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="COMPLETED">Thành công</option>
              <option value="PENDING">Chờ xử lý</option>
              <option value="FAILED">Thất bại</option>
            </select>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/30 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Mã giao dịch SePay</th>
                <th className="py-4 px-6">Học viên</th>
                <th className="py-4 px-6">Nội dung / Memo</th>
                <th className="py-4 px-6 text-right">Số tiền</th>
                <th className="py-4 px-6 text-center">Credit nạp</th>
                <th className="py-4 px-6">Thời gian nhận</th>
                <th className="py-4 px-6">Trạng thái</th>
                <th className="py-4 px-6 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-600 font-medium">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-semibold">
                    Không tìm thấy giao dịch nào khớp với điều kiện.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/30 transition-all duration-150">
                    <td className="py-4 px-6 font-mono text-slate-800 font-semibold">{tx.sePayTxId}</td>
                    <td className="py-4 px-6 text-slate-900 font-bold">{tx.email}</td>
                    <td className="py-4 px-6">
                      <span className="font-mono text-slate-500 font-semibold bg-slate-50 px-2 py-1 rounded">{tx.memo}</span>
                    </td>
                    <td className="py-4 px-6 text-right font-extrabold text-slate-900">{formatVnd(tx.amount)}</td>
                    <td className="py-4 px-6 text-center font-extrabold text-indigo-600">+{tx.credits}</td>
                    <td className="py-4 px-6 text-slate-400">
                      {new Date(tx.date).toLocaleString("vi-VN")}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        tx.status === "COMPLETED" 
                          ? "bg-emerald-50 text-emerald-600" 
                          : tx.status === "PENDING"
                          ? "bg-amber-50 text-amber-600 animate-pulse"
                          : "bg-rose-50 text-rose-600"
                      }`}>
                        {tx.status === "COMPLETED" && "Thành công"}
                        {tx.status === "PENDING" && "Chờ duyệt"}
                        {tx.status === "FAILED" && "Thất bại"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {tx.status === "PENDING" ? (
                        <button
                          onClick={() => onApproveTransaction(tx.id)}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-1.5 px-3 rounded-lg text-[10px] uppercase tracking-wider transition-all shadow hover:shadow-indigo-500/10 cursor-pointer"
                        >
                          Duyệt nhanh
                        </button>
                      ) : (
                        <span className="text-slate-300 font-bold">—</span>
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
