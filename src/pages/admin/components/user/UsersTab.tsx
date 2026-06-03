import { useState } from "react"
import {
  Search,
  Coins,
  Clock,
  PlusCircle,
  MinusCircle,
  ArrowRight,
  Shield,
  X,
  BellRing
} from "lucide-react"
import {
  useAdminUsers,
  useAdminUserTransactions,
  useAdjustCredits,
  useUpdateUserRole
} from "@/hooks/useAdminUsers"
import { AdminUser } from "@/api/adminUser.api"
import "./UsersTab.css"

export default function UsersTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)

  // Wallet adjust modal state
  const [adjustAmount, setAdjustAmount] = useState<number>(0)
  const [adjustType, setAdjustType] = useState<"BONUS" | "REFUND">("BONUS")
  const [adjustReason, setAdjustReason] = useState("")
  const [showAdjustModal, setShowAdjustModal] = useState(false)

  // Local Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // React Query Hooks
  const { data: users = [], isLoading, isError, error } = useAdminUsers()

  const { data: transactions = [], isLoading: isLoadingTx } = useAdminUserTransactions(
    selectedUser?.id || "",
    !!selectedUser
  )

  const adjustCreditsMutation = useAdjustCredits()
  const updateRoleMutation = useUpdateUserRole()

  // Filter users list
  const filteredUsers = users.filter(u =>
    (u.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handle adjust submit
  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser || adjustAmount <= 0) return

    try {
      await adjustCreditsMutation.mutateAsync({
        userId: selectedUser.id,
        data: {
          amount: adjustAmount,
          type: adjustType,
          reason: adjustReason
        }
      })

      // Update local balance state for selectedUser drawer visually
      const signedAmount = adjustType === "BONUS" ? adjustAmount : -adjustAmount
      setSelectedUser({
        ...selectedUser,
        balance: selectedUser.balance + signedAmount
      })

      showToast(`Đã điều chỉnh ví học viên thành công!`)
      // Reset
      setAdjustAmount(0)
      setAdjustReason("")
      setShowAdjustModal(false)
    } catch (err: any) {
      showToast(`Lỗi điều chỉnh ví: ${err.response?.data?.message || err.message}`)
    }
  }

  // Handle role change
  const handleRoleChange = async (userId: string, newRole: "STUDENT" | "ADMIN") => {
    try {
      await updateRoleMutation.mutateAsync({
        userId,
        data: { role: newRole }
      })

      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({
          ...selectedUser,
          role: newRole
        })
      }

      showToast(`Đã cập nhật vai trò học viên thành công!`)
    } catch (err: any) {
      showToast(`Lỗi cập nhật vai trò: ${err.response?.data?.message || err.message}`)
    }
  }

  if (isLoading) {
    return (
      <div className="users-tab-container">
        <div className="users-tab-header-sec">
          <h2 className="users-tab-title">Quản lý Học viên & Ví Credits</h2>
          <p className="users-tab-subtitle">Đang tải dữ liệu học viên...</p>
        </div>
        <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
          <div className="users-tab-spinner" />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="users-tab-container">
        <div className="users-tab-header-sec">
          <h2 className="users-tab-title">Quản lý Học viên & Ví Credits</h2>
          <p className="users-tab-subtitle">Đã xảy ra lỗi khi tải dữ liệu.</p>
        </div>
        <div style={{ color: "#dc2626", fontWeight: 600, padding: "20px", background: "#fee2e2", borderRadius: "8px" }}>
          {error instanceof Error ? error.message : "Không thể kết nối đến máy chủ."}
        </div>
      </div>
    )
  }

  return (
    <div className="users-tab-container">
      {/* GLOBAL TOAST */}
      {toastMessage && (
        <div className="users-tab-toast-container">
          <span style={{ padding: "8px", background: "#f3f4f6", color: "#174593", borderRadius: "8px", display: "flex", flexShrink: 0 }}>
            <BellRing size={16} />
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ fontSize: "10px", color: "#6b7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Thông báo</span>
            <p style={{ fontSize: "12px", color: "#374151", margin: 0, fontWeight: 500, lineHeight: 1.4 }}>{toastMessage}</p>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="users-tab-header-sec">
        <h2 className="users-tab-title">Quản lý Học viên & Ví Credits</h2>
        <p className="users-tab-subtitle">
          Kiểm tra tài khoản người học, tra cứu lịch sử luyện thi, và can thiệp cộng thưởng (bonus) hoặc hoàn ví thủ công.
        </p>
      </div>

      {/* SEARCH AND FILTER USER BAR */}
      <div className="users-tab-filter-bar">
        <div className="users-tab-search-wrapper">
          <input
            type="text"
            placeholder="Tìm theo tên học viên, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="users-tab-search-input"
          />
          <Search className="users-tab-search-icon" />
        </div>
        <div className="users-tab-total-count">
          Tổng số học viên: <strong className="users-tab-total-count-number">{users.length}</strong>
        </div>
      </div>

      {/* USER LIST GRID */}
      <div className="users-tab-table-container">
        <div className="users-tab-table-wrapper">
          <table className="users-tab-table">
            <thead>
              <tr>
                <th className="users-tab-th">Học viên</th>
                <th className="users-tab-th">Địa chỉ Email</th>
                <th className="users-tab-th">Quyền hạn</th>
                <th className="users-tab-th" style={{ textAlign: "center" }}>Số dư ví</th>
                <th className="users-tab-th">Ngày gia nhập</th>
                <th className="users-tab-th" style={{ textAlign: "center" }}>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="users-tab-empty-state">
                    Không tìm thấy học viên nào khớp với tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const displayName = u.name || "Guest"
                  return (
                    <tr key={u.id} className="users-tab-tr">
                      <td className="users-tab-td">
                        <div className="users-tab-td-student">
                          <div className="users-tab-avatar">
                            {displayName.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="users-tab-student-name">{displayName}</span>
                        </div>
                      </td>
                      <td className="users-tab-td">{u.email}</td>
                      <td className="users-tab-td">
                        <span className={`users-tab-role-badge ${u.role === "ADMIN" ? "role-admin" : ""}`}>
                          {u.role === "ADMIN" && <Shield style={{ width: "12px", height: "12px" }} />}
                          {u.role}
                        </span>
                      </td>
                      <td className="users-tab-td" style={{ textAlign: "center" }}>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                          <span className="users-tab-balance-badge">
                            <Coins style={{ width: "14px", height: "14px", color: "#6366f1" }} />
                            {u.balance} Credits
                          </span>
                        </div>
                      </td>
                      <td className="users-tab-td">{u.joinDate}</td>
                      <td className="users-tab-td" style={{ textAlign: "center" }}>
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="users-tab-action-btn"
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
        <div className="users-tab-drawer-overlay" onClick={() => setSelectedUser(null)}>
          <div
            className="users-tab-drawer-container"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="users-tab-drawer-header">
              <div>
                <h3 className="users-tab-drawer-title">Chi Tiết Hồ Sơ Học Viên</h3>
                <p className="users-tab-drawer-subtitle">Báo cáo ví nạp và theo dõi tổng thể kết quả.</p>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="users-tab-close-btn"
              >
                <X style={{ width: "20px", height: "20px" }} />
              </button>
            </div>

            {/* Content Drawer Area */}
            <div className="users-tab-drawer-content">
              {/* Profile Card */}
              <div className="users-tab-profile-card">
                <div className="users-tab-drawer-avatar">
                  {(selectedUser.name || "Guest").slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 className="users-tab-drawer-name">{selectedUser.name || "Guest"}</h4>
                  <p className="users-tab-drawer-email">{selectedUser.email}</p>
                  <p className="users-tab-drawer-user-id">ID: {selectedUser.id}</p>

                  {/* Role Selector dropdown */}
                  <div style={{ marginTop: "12px" }}>
                    <label className="users-tab-field-label" style={{ marginBottom: "4px" }}>Quyền hạn (Role)</label>
                    <select
                      value={selectedUser.role}
                      onChange={(e) => handleRoleChange(selectedUser.id, e.target.value as 'STUDENT' | 'ADMIN')}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "8px",
                        border: "1px solid #d1d5db",
                        backgroundColor: "#ffffff",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#4b5563",
                        outline: "none",
                        cursor: "pointer",
                        width: "120px"
                      }}
                    >
                      <option value="STUDENT">STUDENT</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Credits Box */}
              <div className="users-tab-balance-banner">
                <div>
                  <span className="users-tab-balance-banner-title">Số dư ví nạp</span>
                  <div className="users-tab-balance-banner-value">
                    <Coins style={{ width: "24px", height: "24px", color: "#174593" }} />
                    <span className="users-tab-balance-banner-amount">{selectedUser.balance}</span>
                    <span className="users-tab-balance-banner-currency">Credits</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowAdjustModal(true)}
                  className="users-tab-balance-banner-btn"
                >
                  <PlusCircle style={{ width: "16px", height: "16px" }} />
                  Cân đối ví
                </button>
              </div>

              {/* Wallet Transaction History logs list */}
              <div>
                <h4 className="users-tab-logs-header">
                  <Clock style={{ width: "16px", height: "16px" }} />
                  Dòng tiền giao dịch ví
                </h4>

                <div className="users-tab-logs-list">
                  {isLoadingTx ? (
                    <div style={{ textAlign: "center", color: "#9ca3af", fontSize: "12px", padding: "10px" }}>Đang tải lịch sử...</div>
                  ) : transactions.length === 0 ? (
                    <div style={{ textAlign: "center", color: "#9ca3af", fontSize: "12px", padding: "10px" }}>Chưa có giao dịch nào.</div>
                  ) : (
                    transactions.map((log) => {
                      const isPositive = log.amount > 0
                      const dateFormatted = new Date(log.createdAt).toLocaleString("vi-VN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit"
                      })
                      return (
                        <div key={log.id} className="users-tab-log-card">
                          <div className="users-tab-log-info">
                            <div className="users-tab-log-header-row">
                              <span className="users-tab-log-type">{log.type}</span>
                              <span className="users-tab-log-date">{dateFormatted}</span>
                            </div>
                            <p className="users-tab-log-desc">{log.description || "Giao dịch hệ thống"}</p>
                          </div>
                          <span className={`users-tab-log-amount ${isPositive ? "positive" : "negative"}`}>
                            {isPositive ? `+${log.amount}` : log.amount}
                          </span>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="users-tab-drawer-footer">
              <button
                onClick={() => setSelectedUser(null)}
                className="users-tab-drawer-close-btn"
              >
                Đóng thông tin chi tiết
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADJUST BALANCE MODAL */}
      {showAdjustModal && selectedUser && (
        <div className="users-tab-modal-overlay" onClick={() => setShowAdjustModal(false)}>
          <div
            className="users-tab-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="users-tab-modal-header">
              <h3 className="users-tab-modal-title">
                <Coins style={{ width: "18px", height: "18px", color: "#174593" }} />
                Cân đối Credits ví học viên
              </h3>
              <button
                onClick={() => setShowAdjustModal(false)}
                className="users-tab-close-btn"
              >
                <X style={{ width: "16px", height: "16px" }} />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="users-tab-modal-form">
              <div>
                <label className="users-tab-field-label">Hình thức can thiệp ví</label>
                <div className="users-tab-type-grid">
                  <button
                    type="button"
                    onClick={() => setAdjustType("BONUS")}
                    className={`users-tab-type-btn ${adjustType === "BONUS" ? "active-bonus" : ""}`}
                  >
                    <PlusCircle style={{ width: "16px", height: "16px" }} />
                    CỘNG BONUS
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType("REFUND")}
                    className={`users-tab-type-btn ${adjustType === "REFUND" ? "active-refund" : ""}`}
                  >
                    <MinusCircle style={{ width: "16px", height: "16px" }} />
                    TRỪ / HOÀN TRẢ
                  </button>
                </div>
              </div>

              <div>
                <label className="users-tab-field-label">Số lượng Credits</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={adjustAmount === 0 ? "" : adjustAmount}
                  onChange={(e) => setAdjustAmount(parseInt(e.target.value) || 0)}
                  placeholder="Nhập số Credits..."
                  className="users-tab-input-val"
                />
              </div>

              <div>
                <label className="users-tab-field-label">Lý do điều chỉnh giao dịch</label>
                <textarea
                  required
                  rows={3}
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="Nhập lý do nạp log (Ví dụ: Thưởng quà sinh nhật học viên, hoàn tiền cuộc gọi âm thanh...)"
                  className="users-tab-textarea-val"
                />
              </div>

              <div className="users-tab-modal-actions">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="users-tab-modal-cancel-btn"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="users-tab-modal-confirm-btn"
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
