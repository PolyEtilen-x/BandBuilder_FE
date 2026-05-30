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

  // Hover states for interactive buttons
  const [hoveredBtnId, setHoveredBtnId] = useState<string | null>(null)

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

  // Inline CSS styles mapping
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "32px",
      boxSizing: "border-box" as const,
    },
    headerSec: {
      paddingBottom: "16px",
      borderBottom: "1px solid #e2e8f0",
    },
    title: {
      fontSize: "22px",
      fontWeight: 700,
      color: "#111827",
      margin: 0,
    },
    subtitle: {
      fontSize: "13px",
      color: "#6b7280",
      marginTop: "8px",
      marginBottom: 0,
      fontWeight: 500,
      lineHeight: 1.5,
    },
    filterBar: {
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "20px 24px",
      display: "flex",
      flexDirection: "row" as const,
      justifyContent: "space-between",
      alignItems: "center",
      gap: "16px",
      flexWrap: "wrap" as const,
      boxSizing: "border-box" as const,
    },
    searchWrapper: {
      position: "relative" as const,
      flex: 1,
      minWidth: "260px",
      maxWidth: "400px",
    },
    searchInput: {
      width: "100%",
      height: "38px",
      backgroundColor: "#f9fafb",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      paddingLeft: "36px",
      paddingRight: "12px",
      fontSize: "13px",
      color: "#1f2937",
      fontWeight: 600,
      outline: "none",
      boxSizing: "border-box" as const,
      transition: "border-color 0.15s ease",
    },
    searchIcon: {
      position: "absolute" as const,
      left: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      width: "16px",
      height: "16px",
      color: "#9ca3af",
      pointerEvents: "none" as const,
    },
    totalCount: {
      fontSize: "13px",
      color: "#6b7280",
      fontWeight: 600,
    },
    totalCountNumber: {
      color: "#111827",
      fontWeight: 800,
      fontSize: "14px",
    },
    tableContainer: {
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05)",
    },
    tableWrapper: {
      overflowX: "auto" as const,
    },
    table: {
      width: "100%",
      borderCollapse: "collapse" as const,
      fontSize: "13px",
    },
    th: {
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
    tr: {
      borderBottom: "1px solid #f3f4f6",
      transition: "background-color 0.15s",
    },
    td: {
      padding: "14px 24px",
      verticalAlign: "middle",
      color: "#4b5563",
      fontWeight: 500,
    },
    tdStudent: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    avatar: {
      height: "36px",
      width: "36px",
      borderRadius: "8px",
      background: "#eff6ff",
      border: "1px solid #dbeafe",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 700,
      color: "#174593",
      fontSize: "13px",
      flexShrink: 0,
    },
    studentName: {
      fontWeight: 700,
      color: "#111827",
      fontSize: "14px",
    },
    roleBadge: (role: string) => ({
      display: "inline-flex",
      alignItems: "center",
      gap: "4px",
      padding: "3px 10px",
      borderRadius: "100px",
      fontSize: "11px",
      fontWeight: 600,
      textTransform: "uppercase" as const,
      background: role === "ADMIN" ? "#f3e8ff" : "#f3f4f6",
      color: role === "ADMIN" ? "#7e22ce" : "#4b5563",
      border: role === "ADMIN" ? "1px solid #e9d5ff" : "1px solid #e5e7eb",
    }),
    balanceBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      background: "#eff6ff",
      border: "1px solid #dbeafe",
      padding: "4px 12px",
      borderRadius: "8px",
      color: "#174593",
      fontWeight: 700,
      fontSize: "13px",
    },
    actionButton: (isHovered: boolean) => ({
      padding: "6px 12px",
      borderRadius: "6px",
      background: isHovered ? "#123775" : "#174593",
      color: "white",
      fontSize: "12px",
      fontWeight: 500,
      border: "none",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: "4px",
      transition: "background-color 0.15s",
    }),
    emptyState: {
      padding: "48px 0",
      textAlign: "center" as const,
      color: "#9ca3af",
      fontWeight: 600,
    },
    
    // Drawer
    drawerOverlay: {
      position: "fixed" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(17, 24, 39, 0.4)",
      backdropFilter: "blur(4px)",
      zIndex: 1000,
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
    },
    drawerContainer: {
      background: "#ffffff",
      borderLeft: "1px solid #e5e7eb",
      width: "100%",
      maxWidth: "400px",
      height: "100%",
      display: "flex",
      flexDirection: "column" as const,
      justifyContent: "space-between",
      boxShadow: "-10px 0 25px -5px rgba(0, 0, 0, 0.1), -10px 0 10px -5px rgba(0, 0, 0, 0.04)",
      boxSizing: "border-box" as const,
    },
    drawerHeader: {
      padding: "20px 24px",
      background: "#f9fafb",
      borderBottom: "1px solid #e5e7eb",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    drawerTitle: {
      fontSize: "16px",
      fontWeight: 700,
      color: "#111827",
      margin: 0,
    },
    drawerSubtitle: {
      fontSize: "12px",
      color: "#6b7280",
      marginTop: "4px",
      margin: 0,
      fontWeight: 500,
    },
    closeBtn: {
      border: "none",
      background: "none",
      cursor: "pointer",
      color: "#9ca3af",
      padding: "4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "color 0.15s",
    },
    drawerContent: {
      flex: 1,
      padding: "24px",
      overflowY: "auto" as const,
      display: "flex",
      flexDirection: "column" as const,
      gap: "24px",
      boxSizing: "border-box" as const,
    },
    profileCard: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      padding: "16px",
      background: "#f9fafb",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
    },
    drawerAvatar: {
      height: "48px",
      width: "48px",
      borderRadius: "10px",
      background: "#eff6ff",
      border: "1px solid #dbeafe",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 700,
      color: "#174593",
      fontSize: "18px",
      flexShrink: 0,
    },
    drawerName: {
      fontSize: "15px",
      fontWeight: 700,
      color: "#111827",
      margin: 0,
    },
    drawerEmail: {
      fontSize: "12px",
      color: "#6b7280",
      margin: "2px 0 0 0",
      fontWeight: 500,
    },
    drawerUserId: {
      fontSize: "10px",
      color: "#9ca3af",
      textTransform: "uppercase" as const,
      letterSpacing: "0.04em",
      margin: "4px 0 0 0",
      fontWeight: 600,
    },
    balanceBanner: {
      background: "linear-gradient(135deg, #eff6ff 0%, #f0f7ff 100%)",
      border: "1px solid #bfdbfe",
      borderRadius: "12px",
      padding: "20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 1px 2px 0 rgba(0,0,0,0.02)",
    },
    balanceBannerTitle: {
      fontSize: "11px",
      fontWeight: 700,
      color: "#1e40af",
      textTransform: "uppercase" as const,
      letterSpacing: "0.05em",
      display: "block",
    },
    balanceBannerValue: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginTop: "8px",
    },
    balanceBannerAmount: {
      fontSize: "28px",
      fontWeight: 800,
      color: "#174593",
      lineHeight: 1,
    },
    balanceBannerCurrency: {
      fontSize: "12px",
      fontWeight: 700,
      color: "#1e40af",
      alignSelf: "flex-end",
      marginBottom: "2px",
    },
    balanceBannerBtn: (isHovered: boolean) => ({
      padding: "8px 16px",
      borderRadius: "8px",
      background: isHovered ? "#123775" : "#174593",
      color: "#ffffff",
      fontSize: "12px",
      fontWeight: 600,
      border: "none",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      boxShadow: "0 2px 4px rgba(23, 69, 147, 0.15)",
      transition: "background-color 0.15s",
    }),
    statsSecHeader: {
      fontSize: "11px",
      fontWeight: 700,
      color: "#9ca3af",
      textTransform: "uppercase" as const,
      letterSpacing: "0.04em",
      margin: "0 0 12px 0",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "16px",
    },
    statsCard: {
      background: "#f9fafb",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "16px",
      display: "flex",
      flexDirection: "column" as const,
      gap: "4px",
    },
    statsCardLabel: {
      fontSize: "11px",
      color: "#6b7280",
      textTransform: "uppercase" as const,
      fontWeight: 600,
      letterSpacing: "0.04em",
    },
    statsCardVal: {
      fontSize: "16px",
      fontWeight: 700,
      color: "#1f2937",
    },
    logsHeader: {
      fontSize: "11px",
      fontWeight: 700,
      color: "#9ca3af",
      textTransform: "uppercase" as const,
      letterSpacing: "0.04em",
      margin: "0 0 12px 0",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    logsList: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "12px",
      maxHeight: "220px",
      overflowY: "auto" as const,
      paddingRight: "4px",
    },
    logCard: {
      background: "#f9fafb",
      border: "1px solid #e5e7eb",
      borderRadius: "10px",
      padding: "12px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "12px",
    },
    logInfo: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "4px",
      flex: 1,
    },
    logHeaderRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    logType: {
      fontSize: "12px",
      fontWeight: 700,
      color: "#1f2937",
    },
    logDate: {
      fontSize: "10px",
      color: "#9ca3af",
      fontWeight: 500,
    },
    logDesc: {
      fontSize: "11px",
      color: "#6b7280",
      margin: 0,
      lineHeight: 1.4,
    },
    logAmount: (isPositive: boolean) => ({
      fontSize: "13px",
      fontWeight: 800,
      color: isPositive ? "#16a34a" : "#dc2626",
      whiteSpace: "nowrap" as const,
    }),
    drawerFooter: {
      padding: "16px 24px",
      background: "#f9fafb",
      borderTop: "1px solid #e5e7eb",
      display: "flex",
    },
    drawerCloseBtn: (isHovered: boolean) => ({
      width: "100%",
      padding: "12px",
      borderRadius: "8px",
      background: isHovered ? "#f9fafb" : "#ffffff",
      border: "1px solid #d1d5db",
      color: "#4b5563",
      fontWeight: 600,
      fontSize: "12px",
      cursor: "pointer",
      textAlign: "center" as const,
      transition: "background-color 0.15s",
    }),

    // Modal Adjust Balance
    modalOverlay: {
      position: "fixed" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(17, 24, 39, 0.4)",
      backdropFilter: "blur(4px)",
      zIndex: 2000,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "16px",
    },
    modalContainer: {
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "16px",
      width: "100%",
      maxWidth: "400px",
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      overflow: "hidden",
      boxSizing: "border-box" as const,
    },
    modalHeader: {
      padding: "16px 24px",
      background: "#f9fafb",
      borderBottom: "1px solid #e5e7eb",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    modalTitle: {
      fontSize: "14px",
      fontWeight: 700,
      color: "#111827",
      margin: 0,
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    modalForm: {
      padding: "24px",
      display: "flex",
      flexDirection: "column" as const,
      gap: "20px",
      boxSizing: "border-box" as const,
    },
    fieldLabel: {
      display: "block",
      fontSize: "11px",
      fontWeight: 700,
      color: "#6b7280",
      textTransform: "uppercase" as const,
      letterSpacing: "0.05em",
      marginBottom: "8px",
    },
    typeGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px",
    },
    typeBtn: (active: boolean, type: "BONUS" | "REFUND") => ({
      padding: "12px",
      borderRadius: "8px",
      fontSize: "12px",
      fontWeight: 700,
      border: active 
        ? (type === "BONUS" ? "1px solid #bfdbfe" : "1px solid #fecaca") 
        : "1px solid #d1d5db",
      background: active 
        ? (type === "BONUS" ? "#eff6ff" : "#fee2e2") 
        : "#ffffff",
      color: active 
        ? (type === "BONUS" ? "#174593" : "#b91c1c") 
        : "#4b5563",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
      cursor: "pointer",
      transition: "all 0.15s",
    }),
    inputVal: {
      width: "100%",
      backgroundColor: "#f9fafb",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      padding: "10px 12px",
      fontSize: "14px",
      fontWeight: 700,
      color: "#1f2937",
      fontFamily: "monospace",
      outline: "none",
      boxSizing: "border-box" as const,
    },
    textareaVal: {
      width: "100%",
      backgroundColor: "#f9fafb",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      padding: "10px 12px",
      fontSize: "13px",
      color: "#1f2937",
      fontWeight: 500,
      resize: "none" as const,
      outline: "none",
      lineHeight: 1.5,
      boxSizing: "border-box" as const,
    },
    modalActions: {
      paddingTop: "16px",
      borderTop: "1px solid #e5e7eb",
      display: "flex",
      justifyContent: "flex-end",
      gap: "12px",
    },
    modalCancelBtn: (isHovered: boolean) => ({
      padding: "8px 16px",
      borderRadius: "8px",
      background: isHovered ? "#f9fafb" : "#ffffff",
      border: "1px solid #d1d5db",
      color: "#4b5563",
      fontWeight: 600,
      fontSize: "12px",
      cursor: "pointer",
      transition: "background-color 0.15s",
    }),
    modalConfirmBtn: (isHovered: boolean) => ({
      padding: "8px 16px",
      borderRadius: "8px",
      background: isHovered ? "#123775" : "#174593",
      color: "#ffffff",
      fontWeight: 600,
      fontSize: "12px",
      border: "none",
      cursor: "pointer",
      transition: "background-color 0.15s",
    })
  }

  return (
    <div style={styles.container}>
      {/* HEADER SECTION */}
      <div style={styles.headerSec}>
        <h2 style={styles.title}>Quản lý Học viên & Ví Credits</h2>
        <p style={styles.subtitle}>
          Kiểm tra tài khoản người học, tra cứu lịch sử luyện thi, và can thiệp cộng thưởng (bonus) hoặc hoàn ví thủ công.
        </p>
      </div>

      {/* SEARCH AND FILTER USER BAR */}
      <div style={styles.filterBar}>
        <div style={styles.searchWrapper}>
          <input 
            type="text"
            placeholder="Tìm theo tên học viên, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <Search style={styles.searchIcon} />
        </div>
        <div style={styles.totalCount}>
          Tổng số học viên: <strong style={styles.totalCountNumber}>{users.length}</strong>
        </div>
      </div>

      {/* USER LIST GRID */}
      <div style={styles.tableContainer}>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Học viên</th>
                <th style={styles.th}>Địa chỉ Email</th>
                <th style={styles.th}>Quyền hạn</th>
                <th style={{ ...styles.th, textAlign: "center" }}>Số dư ví</th>
                <th style={styles.th}>Ngày gia nhập</th>
                <th style={{ ...styles.th, textAlign: "center" }}>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={styles.emptyState}>
                    Không tìm thấy học viên nào khớp với tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const btnHoverKey = `btn-${u.id}`
                  return (
                    <tr key={u.id} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={styles.tdStudent}>
                          <div style={styles.avatar}>
                            {u.name.slice(0, 2).toUpperCase()}
                          </div>
                          <span style={styles.studentName}>{u.name}</span>
                        </div>
                      </td>
                      <td style={styles.td}>{u.email}</td>
                      <td style={styles.td}>
                        <span style={styles.roleBadge(u.role)}>
                          {u.role === "ADMIN" && <Shield style={{ width: "12px", height: "12px" }} />}
                          {u.role}
                        </span>
                      </td>
                      <td style={{ ...styles.td, textAlign: "center" }}>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                          <span style={styles.balanceBadge}>
                            <Coins style={{ width: "14px", height: "14px", color: "#6366f1" }} />
                            {u.balance} Credits
                          </span>
                        </div>
                      </td>
                      <td style={styles.td}>{u.joinDate}</td>
                      <td style={{ ...styles.td, textAlign: "center" }}>
                        <button
                          onClick={() => setSelectedUser(u)}
                          onMouseEnter={() => setHoveredBtnId(btnHoverKey)}
                          onMouseLeave={() => setHoveredBtnId(null)}
                          style={styles.actionButton(hoveredBtnId === btnHoverKey)}
                        >
                          Ví & Chi tiết
                          <ArrowRight style={{ width: "12px", height: "12px" }} />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* USER DETAILS SLIDE OVER DRAWER */}
      {selectedUser && (
        <div style={styles.drawerOverlay} onClick={() => setSelectedUser(null)}>
          <div 
            style={styles.drawerContainer} 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={styles.drawerHeader}>
              <div>
                <h3 style={styles.drawerTitle}>Chi Tiết Hồ Sơ Học Viên</h3>
                <p style={styles.drawerSubtitle}>Báo cáo ví nạp và theo dõi tổng thể kết quả.</p>
              </div>
              <button 
                onClick={() => setSelectedUser(null)}
                style={styles.closeBtn}
              >
                <X style={{ width: "20px", height: "20px" }} />
              </button>
            </div>

            {/* Content Drawer Area */}
            <div style={styles.drawerContent}>
              {/* Profile Card */}
              <div style={styles.profileCard}>
                <div style={styles.drawerAvatar}>
                  {selectedUser.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 style={styles.drawerName}>{selectedUser.name}</h4>
                  <p style={styles.drawerEmail}>{selectedUser.email}</p>
                  <p style={styles.drawerUserId}>ID: {selectedUser.id}</p>
                </div>
              </div>

              {/* Credits Box */}
              <div style={styles.balanceBanner}>
                <div>
                  <span style={styles.balanceBannerTitle}>Số dư ví nạp</span>
                  <div style={styles.balanceBannerValue}>
                    <Coins style={{ width: "24px", height: "24px", color: "#174593" }} />
                    <span style={styles.balanceBannerAmount}>{selectedUser.balance}</span>
                    <span style={styles.balanceBannerCurrency}>Credits</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowAdjustModal(true)}
                  onMouseEnter={() => setHoveredBtnId("adjust-btn")}
                  onMouseLeave={() => setHoveredBtnId(null)}
                  style={styles.balanceBannerBtn(hoveredBtnId === "adjust-btn")}
                >
                  <PlusCircle style={{ width: "16px", height: "16px" }} />
                  Cân đối ví
                </button>
              </div>

              {/* Progress Summary */}
              <div>
                <h4 style={styles.statsSecHeader}>Thống kê học tập</h4>
                <div style={styles.statsGrid}>
                  <div style={styles.statsCard}>
                    <span style={styles.statsCardLabel}>Lượt thi</span>
                    <span style={styles.statsCardVal}>12 đề thi</span>
                  </div>
                  <div style={styles.statsCard}>
                    <span style={styles.statsCardLabel}>Tiến độ lộ trình</span>
                    <span style={{ ...styles.statsCardVal, color: "#10b981", display: "flex", alignItems: "center", gap: "6px" }}>
                      <TrendingUp style={{ width: "16px", height: "16px" }} />
                      45%
                    </span>
                  </div>
                </div>
              </div>

              {/* Wallet Transaction History logs list */}
              <div>
                <h4 style={styles.logsHeader}>
                  <Clock style={{ width: "16px", height: "16px" }} />
                  Dòng tiền giao dịch ví
                </h4>
                
                <div style={styles.logsList}>
                  {mockLogs.map((log) => {
                    const isPositive = log.amount > 0
                    return (
                      <div key={log.id} style={styles.logCard}>
                        <div style={styles.logInfo}>
                          <div style={styles.logHeaderRow}>
                            <span style={styles.logType}>{log.type}</span>
                            <span style={styles.logDate}>{log.date}</span>
                          </div>
                          <p style={styles.logDesc}>{log.desc}</p>
                        </div>
                        <span style={styles.logAmount(isPositive)}>
                          {isPositive ? `+${log.amount}` : log.amount}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={styles.drawerFooter}>
              <button
                onClick={() => setSelectedUser(null)}
                onMouseEnter={() => setHoveredBtnId("close-drawer-btn")}
                onMouseLeave={() => setHoveredBtnId(null)}
                style={styles.drawerCloseBtn(hoveredBtnId === "close-drawer-btn")}
              >
                Đóng thông tin chi tiết
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADJUST BALANCE MODAL */}
      {showAdjustModal && selectedUser && (
        <div style={styles.modalOverlay} onClick={() => setShowAdjustModal(false)}>
          <div 
            style={styles.modalContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                <Coins style={{ width: "18px", height: "18px", color: "#174593" }} />
                Cân đối Credits ví học viên
              </h3>
              <button 
                onClick={() => setShowAdjustModal(false)}
                style={styles.closeBtn}
              >
                <X style={{ width: "16px", height: "16px" }} />
              </button>
            </div>
            
            <form onSubmit={handleAdjustSubmit} style={styles.modalForm}>
              <div>
                <label style={styles.fieldLabel}>Hình thức can thiệp ví</label>
                <div style={styles.typeGrid}>
                  <button
                    type="button"
                    onClick={() => setAdjustType("BONUS")}
                    style={styles.typeBtn(adjustType === "BONUS", "BONUS")}
                  >
                    <PlusCircle style={{ width: "16px", height: "16px" }} />
                    CỘNG BONUS
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType("REFUND")}
                    style={styles.typeBtn(adjustType === "REFUND", "REFUND")}
                  >
                    <MinusCircle style={{ width: "16px", height: "16px" }} />
                    TRỪ / HOÀN TRẢ
                  </button>
                </div>
              </div>

              <div>
                <label style={styles.fieldLabel}>Số lượng Credits</label>
                <input 
                  type="number"
                  required
                  min={1}
                  value={adjustAmount === 0 ? "" : adjustAmount}
                  onChange={(e) => setAdjustAmount(parseInt(e.target.value) || 0)}
                  placeholder="Nhập số Credits..."
                  style={styles.inputVal}
                />
              </div>

              <div>
                <label style={styles.fieldLabel}>Lý do điều chỉnh giao dịch</label>
                <textarea
                  required
                  rows={3}
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="Nhập lý do nạp log (Ví dụ: Thưởng quà sinh nhật học viên, hoàn tiền cuộc gọi âm thanh...)"
                  style={styles.textareaVal}
                />
              </div>

              <div style={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  onMouseEnter={() => setHoveredBtnId("cancel-modal")}
                  onMouseLeave={() => setHoveredBtnId(null)}
                  style={styles.modalCancelBtn(hoveredBtnId === "cancel-modal")}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  onMouseEnter={() => setHoveredBtnId("confirm-modal")}
                  onMouseLeave={() => setHoveredBtnId(null)}
                  style={styles.modalConfirmBtn(hoveredBtnId === "confirm-modal")}
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

