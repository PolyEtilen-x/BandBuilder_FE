// src/pages/admin/components/DashboardTab.tsx

import { useState } from "react"
import { Transaction } from "../types"
import { 
  TrendingUp, 
  DollarSign, 
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
    <div className="space-y-10">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Đối soát & Báo cáo tài chính</h2>
          <p className="text-slate-500 text-sm font-medium">Giám sát doanh thu, giao dịch nạp tiền VietQR tự động qua SePay Webhook và kiểm tra thanh toán.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200/60 shadow-sm rounded-2xl px-5 py-3 text-xs text-slate-650 font-bold self-start md:self-auto shrink-0">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Cổng Webhook SePay: Hoạt động</span>
        </div>
      </div>

      {/* STATS GRID - Increased gap and massive card size */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Total Revenue */}
        <div className="bg-white border border-slate-100 rounded-[24px] p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative flex flex-col justify-between min-h-[160px]">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Tổng Doanh Thu</span>
            <span className="p-3 bg-blue-50 text-[#174593] rounded-2xl border border-blue-100">
              <DollarSign className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-6">
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{formatVnd(totalRevenue)}</h3>
            <div className="flex items-center gap-1.5 mt-2.5 text-xs text-emerald-600 font-bold">
              <TrendingUp className="w-4 h-4" />
              <span>+15.4% so với tháng trước</span>
            </div>
          </div>
        </div>

        {/* Lượt thi */}
        <div className="bg-white border border-slate-100 rounded-[24px] p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative flex flex-col justify-between min-h-[160px]">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Thành công</span>
            <span className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
              <CheckCircle className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-6">
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{completedCount} giao dịch</h3>
            <div className="flex items-center gap-1.5 mt-2.5 text-xs text-slate-500 font-semibold">
              <span>Tỷ lệ hoàn tất giao dịch đạt 94.2%</span>
            </div>
          </div>
        </div>

        {/* Chờ duyệt */}
        <div className="bg-white border border-slate-100 rounded-[24px] p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative flex flex-col justify-between min-h-[160px]">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Đang Chờ Duyệt</span>
            <span className="p-3 bg-amber-50 text-amber-650 rounded-2xl border border-amber-100">
              <Clock className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-6">
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{pendingCount} giao dịch</h3>
            <div className="flex items-center gap-1.5 mt-2.5 text-xs text-amber-600 font-bold">
              <span>Cần đối soát VietQR thủ công</span>
            </div>
          </div>
        </div>

        {/* Lỗi thanh toán */}
        <div className="bg-white border border-slate-100 rounded-[24px] p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative flex flex-col justify-between min-h-[160px]">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Giao dịch Lỗi</span>
            <span className="p-3 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100">
              <XCircle className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-6">
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{failedCount} giao dịch</h3>
            <div className="flex items-center gap-1.5 mt-2.5 text-xs text-rose-600 font-bold">
              <span>Sai cú pháp nạp hoặc huỷ nạp</span>
            </div>
          </div>
        </div>
      </div>

      {/* REVENUE CHART & WEBHOOK MONITOR - Expanded heights and margins */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bar Chart Card */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[24px] p-8 shadow-sm flex flex-col justify-between gap-8">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Xu hướng Doanh thu 7 ngày qua</h3>
            <p className="text-slate-500 text-xs mt-2 font-semibold">Biểu diễn dòng tiền chuyển khoản nhận về qua hệ thống API SePay thụ động.</p>
          </div>

          <div className="flex items-end justify-between h-56 px-2 gap-4 border-b border-slate-100 pb-4">
            {chartData.map((d, i) => (
              <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group relative">
                {/* Tooltip value */}
                <div className="bg-slate-900 text-white text-[10px] py-1.5 px-2.5 rounded-lg mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none absolute -top-8 whitespace-nowrap shadow-md z-10">
                  {formatVnd(d.val)}
                </div>
                {/* Bar Background Box Track */}
                <div className="w-full bg-slate-50 rounded-t-xl h-full flex items-end justify-center hover:bg-slate-100/50 transition-all duration-300">
                  <div 
                    style={{ height: d.height }}
                    className="w-full bg-[#174593]/80 rounded-t-xl group-hover:bg-[#174593] transition-all duration-300"
                  ></div>
                </div>
                {/* Label */}
                <span className="text-xs text-slate-500 mt-3.5 font-bold">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Webhook Status Info */}
        <div className="bg-white border border-slate-100 rounded-[24px] p-8 shadow-sm flex flex-col justify-between gap-8">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Thông số Cổng SePay</h3>
            <p className="text-slate-500 text-xs mt-2 font-semibold">Đặc tả liên kết webhook thanh toán ngân hàng chuyển khoản tự động.</p>
          </div>

          <div className="space-y-5 text-sm flex-1 flex flex-col justify-center">
            <div className="flex justify-between border-b border-slate-100 pb-3">
              <span className="text-slate-500 font-bold">Endpoint Webhook</span>
              <span className="text-slate-800 font-mono text-xs font-bold">/api/sepay/webhook</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-3">
              <span className="text-slate-500 font-bold">Phương thức</span>
              <span className="text-[#174593] font-extrabold text-xs bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">POST</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-3">
              <span className="text-slate-500 font-bold">Mã bảo mật (Secret)</span>
              <span className="text-slate-800 font-mono text-xs font-semibold">••••••••••••••••</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-3">
              <span className="text-slate-500 font-bold">Độ trễ phản hồi</span>
              <span className="text-emerald-600 text-xs font-extrabold">&lt; 150ms</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-xs text-slate-500 leading-relaxed font-semibold">
            <span className="text-slate-850 font-bold block mb-1.5 uppercase tracking-wider text-[10px]">Quy định đối soát tài chính:</span>
            Trường hợp khách hàng chuyển tiền nhưng webhook bị chậm, admin có thể dùng nút <strong>Duyệt thủ công</strong> để cập nhật trạng thái ngay.
          </div>
        </div>
      </div>

      {/* TRANSACTIONS TABLE - Spacious container, padded cells */}
      <div className="bg-white border border-slate-100 rounded-[28px] shadow-sm overflow-hidden p-2">
        {/* Table Filter Header */}
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-slate-50/20 rounded-t-[26px]">
          <h3 className="text-xl font-bold text-slate-850 flex items-center gap-2.5">
            <FileCheck className="w-5.5 h-5.5 text-[#174593]" />
            Lịch sử giao dịch & đối soát nạp Credit
          </h3>
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative">
              <input 
                type="text"
                placeholder="Tìm email, mã giao dịch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white border border-slate-200 rounded-[14px] pl-10 pr-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#174593] focus:ring-1 focus:ring-[#174593] w-64 transition-all font-semibold shadow-sm"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>

            {/* Select Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-[14px] px-4.5 py-3 text-xs text-slate-650 font-bold focus:outline-none focus:border-[#174593] shadow-sm"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="COMPLETED">Thành công</option>
              <option value="PENDING">Chờ xử lý</option>
              <option value="FAILED">Thất bại</option>
            </select>
          </div>
        </div>

        {/* Table Body - Large paddings */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/10 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                <th className="py-5 px-8">Mã giao dịch SePay</th>
                <th className="py-5 px-8">Học viên</th>
                <th className="py-5 px-8">Nội dung / Memo</th>
                <th className="py-5 px-8 text-right">Số tiền</th>
                <th className="py-5 px-8 text-center">Credit nạp</th>
                <th className="py-5 px-8">Thời gian nhận</th>
                <th className="py-5 px-8">Trạng thái</th>
                <th className="py-5 px-8 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-600 font-semibold">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400 font-bold bg-slate-50/10">
                    Không tìm thấy giao dịch nào khớp với điều kiện.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/40 transition-all duration-200">
                    <td className="py-6 px-8 font-mono text-slate-800 font-bold">{tx.sePayTxId}</td>
                    <td className="py-6 px-8 text-slate-900 font-extrabold">{tx.email}</td>
                    <td className="py-6 px-8">
                      <span className="font-mono text-slate-500 font-bold bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg">{tx.memo}</span>
                    </td>
                    <td className="py-6 px-8 text-right font-black text-slate-900 text-sm">{formatVnd(tx.amount)}</td>
                    <td className="py-6 px-8 text-center font-black text-[#174593] text-sm">+{tx.credits}</td>
                    <td className="py-6 px-8 text-slate-400 font-medium">
                      {new Date(tx.date).toLocaleString("vi-VN")}
                    </td>
                    <td className="py-6 px-8">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider ${
                        tx.status === "COMPLETED" 
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                          : tx.status === "PENDING"
                          ? "bg-amber-50 text-amber-600 animate-pulse border border-amber-100"
                          : "bg-rose-50 text-rose-600 border border-rose-100"
                      }`}>
                        {tx.status === "COMPLETED" && "Thành công"}
                        {tx.status === "PENDING" && "Chờ duyệt"}
                        {tx.status === "FAILED" && "Thất bại"}
                      </span>
                    </td>
                    <td className="py-6 px-8 text-center">
                      {tx.status === "PENDING" ? (
                        <button
                          onClick={() => onApproveTransaction(tx.id)}
                          className="bg-[#174593] hover:bg-[#1a51ad] text-white font-bold py-2 px-4 rounded-xl text-[10px] uppercase tracking-wider transition-all shadow hover:shadow-indigo-500/10 cursor-pointer"
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
