// src/pages/admin/components/DashboardTab.tsx

import { useState, useEffect } from "react"
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

// Inline window size observer for responsiveness
function useWindowSize() {
  const [size, setSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200
  })

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth })
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return size
}

export default function DashboardTab({ transactions, onApproveTransaction }: Props) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const { width } = useWindowSize()

  const isMobile = width < 768
  const isTablet = width < 1024

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

  // Styles block matching user requirements exactly
  const styles = {
    pageHeader: {
      display: "flex",
      flexDirection: "column" as const,
    },
    pageTitle: {
      fontSize: "22px",
      fontWeight: 700,
      color: "#111827",
      margin: 0,
    },
    pageSubtitle: {
      fontSize: "13px",
      color: "#6b7280",
      marginTop: "4px",
      marginBottom: "24px",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : width < 900 ? "1fr 1fr" : "repeat(4, 1fr)",
      gap: "16px",
    },
    card: {
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "20px 24px",
      display: "flex",
      flexDirection: "column" as const,
      gap: "8px",
      boxSizing: "border-box" as const,
    },
    cardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    cardLabel: {
      fontSize: "13px",
      color: "#6b7280",
      fontWeight: 500,
    },
    cardValue: {
      fontSize: "28px",
      fontWeight: 700,
      color: "#111827",
      margin: 0,
    },
    badge: (status: "COMPLETED" | "PENDING" | "FAILED") => {
      const base = {
        fontSize: "12px",
        padding: "2px 8px",
        borderRadius: "100px",
        width: "fit-content",
        fontWeight: 600,
      }
      if (status === "COMPLETED") {
        return { ...base, background: "#dcfce7", color: "#15803d" }
      }
      if (status === "PENDING") {
        return { ...base, background: "#fef9c3", color: "#92400e" }
      }
      return { ...base, background: "#fee2e2", color: "#b91c1c" }
    },
    middleGrid: {
      display: "grid",
      gridTemplateColumns: isTablet ? "1fr" : "1fr 360px",
      gap: "24px",
      alignItems: "start",
    },
    chartContainer: {
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "24px",
      overflow: "hidden" as const,
      boxSizing: "border-box" as const,
    },
    chartTitle: {
      fontSize: "16px",
      fontWeight: 600,
      marginBottom: "4px",
      color: "#111827",
      margin: 0
    },
    chartSubtitle: {
      fontSize: "13px",
      color: "#6b7280",
      marginBottom: "20px",
      marginTop: 0
    },
    svgContainer: {
      width: "100%",
      height: "220px",
      display: "block",
      position: "relative" as const,
      overflow: "hidden" as const,
      boxSizing: "border-box" as const,
    },
    customChartBarTrack: {
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "end",
      justifyContent: "space-between",
      padding: "8px 0"
    },
    sePayPanel: {
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "20px 24px",
      display: "flex",
      flexDirection: "column" as const,
      gap: "12px",
      boxSizing: "border-box" as const,
    },
    panelTitle: {
      fontSize: "15px",
      fontWeight: 600,
      color: "#111827",
      margin: 0
    },
    infoRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: "8px",
      borderBottom: "1px solid #f3f4f6",
      fontSize: "13px",
      boxSizing: "border-box" as const,
    },
    infoLabel: {
      color: "#6b7280",
    },
    infoValue: (mono: boolean) => ({
      color: "#111827",
      fontWeight: 500,
      fontFamily: mono ? "monospace" : "inherit",
    }),
    ruleBox: {
      fontSize: "12px",
      background: "#fffbeb",
      borderRadius: "8px",
      padding: "10px 12px",
      color: "#78350f",
      border: "1px solid #fde68a",
      lineHeight: 1.5,
    },
    tableContainer: {
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      overflow: "hidden" as const,
      boxSizing: "border-box" as const,
    },
    tableHeader: {
      padding: "16px 24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid #e5e7eb",
      boxSizing: "border-box" as const,
      flexWrap: "wrap" as const,
      gap: "12px"
    },
    tableTitle: {
      fontSize: "15px",
      fontWeight: 600,
      color: "#111827",
      margin: 0,
      display: "flex",
      alignItems: "center",
      gap: "8px"
    },
    searchInput: {
      height: "36px",
      padding: "0 12px",
      borderRadius: "8px",
      border: "1px solid #d1d5db",
      fontSize: "13px",
      minWidth: "220px",
      boxSizing: "border-box" as const,
      outline: "none"
    },
    filterSelect: {
      height: "36px",
      padding: "0 12px",
      borderRadius: "8px",
      border: "1px solid #d1d5db",
      fontSize: "13px",
      boxSizing: "border-box" as const,
      outline: "none",
      background: "#ffffff",
      cursor: "pointer"
    },
    tableElement: {
      width: "100%",
      borderCollapse: "collapse" as const,
      fontSize: "13px",
    },
    thElement: {
      background: "#f9fafb",
      padding: "10px 24px",
      textAlign: "left" as const,
      fontSize: "12px",
      fontWeight: 600,
      color: "#6b7280",
      textTransform: "uppercase" as const,
      letterSpacing: "0.04em",
      borderBottom: "1px solid #e5e7eb",
    },
    tdElement: {
      padding: "14px 24px",
      borderBottom: "1px solid #f3f4f6",
      verticalAlign: "middle",
      color: "#374151"
    },
    statusBadge: (status: "COMPLETED" | "PENDING" | "FAILED") => {
      const base = {
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "3px 10px",
        borderRadius: "100px",
        fontSize: "12px",
        fontWeight: 500,
      }
      if (status === "COMPLETED") {
        return { ...base, background: "#dcfce7", color: "#15803d" }
      }
      if (status === "PENDING") {
        return { ...base, background: "#fef9c3", color: "#854d0e" }
      }
      return { ...base, background: "#fee2e2", color: "#b91c1c" }
    },
    approveButton: {
      padding: "5px 12px",
      borderRadius: "6px",
      background: "#2563eb",
      color: "white",
      fontSize: "12px",
      fontWeight: 500,
      border: "none",
      cursor: "pointer",
      outline: "none"
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* HEADER TABS TITLE */}
      <div style={styles.pageHeader}>
        <h2 style={styles.pageTitle}>Đối soát & Báo cáo tài chính</h2>
        <p style={styles.pageSubtitle}>
          Giám sát doanh thu, giao dịch nạp tiền VietQR tự động qua SePay Webhook và kiểm tra thanh toán.
        </p>
      </div>

      {/* STATS CARDS */}
      <div style={styles.statsGrid}>
        {/* Doanh thu */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardLabel}>Tổng doanh thu</span>
            <span style={{ color: "#174593" }}><DollarSign size={16} /></span>
          </div>
          <h3 style={styles.cardValue}>{formatVnd(totalRevenue)}</h3>
          <span style={styles.badge("COMPLETED")}>+15.4% tháng này</span>
        </div>

        {/* Thành công */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardLabel}>Giao dịch Thành công</span>
            <span style={{ color: "#15803d" }}><CheckCircle size={16} /></span>
          </div>
          <h3 style={styles.cardValue}>{completedCount} giao dịch</h3>
          <span style={styles.badge("COMPLETED")}>Đạt 94.2% hoàn tất</span>
        </div>

        {/* Chờ duyệt */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardLabel}>Đang Chờ duyệt</span>
            <span style={{ color: "#92400e" }}><Clock size={16} /></span>
          </div>
          <h3 style={styles.cardValue}>{pendingCount} giao dịch</h3>
          <span style={styles.badge("PENDING")}>Cần duyệt VietQR</span>
        </div>

        {/* Lỗi */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardLabel}>Giao dịch Bị lỗi</span>
            <span style={{ color: "#b91c1c" }}><XCircle size={16} /></span>
          </div>
          <h3 style={styles.cardValue}>{failedCount} giao dịch</h3>
          <span style={styles.badge("FAILED")}>Sai cú pháp hoặc hủy</span>
        </div>
      </div>

      {/* CHART & SEPAY PANEL */}
      <div style={styles.middleGrid}>
        {/* Left Column Chart */}
        <div style={styles.chartContainer}>
          <h3 style={styles.chartTitle}>Xu hướng Doanh thu 7 ngày qua</h3>
          <p style={styles.chartSubtitle}>Biểu diễn dòng tiền chuyển khoản nhận về qua hệ thống API SePay thụ động.</p>
          
          <div style={styles.svgContainer}>
            <div style={styles.customChartBarTrack}>
              {chartData.map((d, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", flex: 1, height: "100%", justifyContent: "flex-end", alignItems: "center" }}>
                  <div style={{
                    width: "36px",
                    height: d.height,
                    background: "#2563eb",
                    borderRadius: "4px 4px 0 0",
                    transition: "all 0.3s"
                  }}></div>
                  <span style={{ fontSize: "11px", color: "#6b7280", marginTop: "8px", fontWeight: 650 }}>{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column SePay */}
        <div style={styles.sePayPanel}>
          <h3 style={styles.panelTitle}>Thông số Cổng SePay</h3>
          
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Endpoint Webhook</span>
            <span style={styles.infoValue(true)}>/api/sepay/webhook</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Phương thức</span>
            <span style={{ ...styles.infoValue(false), background: "#eff6ff", color: "#2563eb", padding: "2px 6px", borderRadius: "4px", fontSize: "11px", fontWeight: 700 }}>POST</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Mã bảo mật (Secret)</span>
            <span style={styles.infoValue(true)}>••••••••••••••••</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Độ trễ phản hồi</span>
            <span style={{ ...styles.infoValue(false), color: "#16a34a", fontWeight: 600 }}>&lt; 150ms</span>
          </div>

          <div style={styles.ruleBox}>
            <strong>LƯU Ý QUY ĐỊNH:</strong> Trường hợp học viên chuyển khoản thành công nhưng webhook ngân hàng bị chậm, admin có thể dùng tính năng duyệt thủ công để cộng credit ngay lập tức.
          </div>
        </div>
      </div>

      {/* TRANSACTION HISTORY TABLE */}
      <div style={styles.tableContainer}>
        {/* Table Header Controls */}
        <div style={styles.tableHeader}>
          <h3 style={styles.tableTitle}>
            <FileCheck size={18} style={{ color: "#2563eb" }} />
            Lịch sử giao dịch & đối soát nạp Credit
          </h3>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <input 
              type="text"
              placeholder="Tìm email, mã giao dịch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="COMPLETED">Thành công</option>
              <option value="PENDING">Chờ xử lý</option>
              <option value="FAILED">Thất bại</option>
            </select>
          </div>
        </div>

        {/* Table Body Area */}
        <div style={{ overflowX: "auto" }}>
          <table style={styles.tableElement}>
            <thead>
              <tr>
                <th style={styles.thElement}>Mã GD SePay</th>
                <th style={styles.thElement}>Học viên</th>
                <th style={styles.thElement}>Memo</th>
                <th style={{ ...styles.thElement, textAlign: "right" }}>Số tiền</th>
                <th style={{ ...styles.thElement, textAlign: "center" }}>Credit</th>
                <th style={styles.thElement}>Thời gian nhận</th>
                <th style={styles.thElement}>Trạng thái</th>
                <th style={{ ...styles.thElement, textAlign: "center" }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ ...styles.tdElement, textAlign: "center", padding: "32px 0", color: "#6b7280" }}>
                    Không tìm thấy giao dịch nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ ...styles.tdElement, fontFamily: "monospace", fontWeight: 600 }}>{tx.sePayTxId}</td>
                    <td style={{ ...styles.tdElement, fontWeight: 700, color: "#111827" }}>{tx.email}</td>
                    <td style={styles.tdElement}>
                      <span style={{ fontFamily: "monospace", padding: "2px 6px", background: "#f3f4f6", borderRadius: "4px" }}>{tx.memo}</span>
                    </td>
                    <td style={{ ...styles.tdElement, fontWeight: 600, textAlign: "right", color: "#111827" }}>{formatVnd(tx.amount)}</td>
                    <td style={{ ...styles.tdElement, color: "#16a34a", fontWeight: 600, textAlign: "center" }}>+{tx.credits}</td>
                    <td style={{ ...styles.tdElement, color: "#6b7280" }}>
                      {new Date(tx.date).toLocaleString("vi-VN")}
                    </td>
                    <td style={styles.tdElement}>
                      <span style={styles.statusBadge(tx.status)}>
                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: tx.status === "COMPLETED" ? "#22c55e" : tx.status === "PENDING" ? "#eab308" : "#ef4444", display: "inline-block" }}></span>
                        {tx.status === "COMPLETED" && "THÀNH CÔNG"}
                        {tx.status === "PENDING" && "CHỜ DUYỆT"}
                        {tx.status === "FAILED" && "THẤT BẠI"}
                      </span>
                    </td>
                    <td style={{ ...styles.tdElement, textAlign: "center" }}>
                      {tx.status === "PENDING" ? (
                        <button
                          onClick={() => onApproveTransaction(tx.id)}
                          style={styles.approveButton}
                        >
                          DUYỆT NHANH
                        </button>
                      ) : (
                        <span style={{ color: "#d1d5db" }}>—</span>
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
