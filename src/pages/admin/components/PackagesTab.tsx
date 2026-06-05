import { useState, useEffect } from "react"
import { CreditPackage } from "../types"
import {
  Zap,
  Sparkles,
  Coins,
  Edit3,
  EyeOff,
  Eye,
  X
} from "lucide-react"

interface Props {
  packages: CreditPackage[]
  onUpdatePackage: (id: string, updated: Partial<CreditPackage>) => void
  onCreatePackage: (pack: Omit<CreditPackage, "id">) => void
  onDeletePackage: (id: string) => void
}

// Inline window size observer for responsiveness
function useWindowSize() {
  const [size, setSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200
  })

  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth })
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return size
}

export default function PackagesTab({
  packages,
  onUpdatePackage,
  onCreatePackage,
  onDeletePackage
}: Props) {
  const [editingPack, setEditingPack] = useState<CreditPackage | null>(null)
  const { width } = useWindowSize()

  const isMobile = width < 640
  const isTablet = width < 1024

  // Edit Form state
  const [editName, setEditName] = useState("")
  const [editPrice, setEditPrice] = useState(0)
  const [editCredits, setEditCredits] = useState(0)
  const [editBonus, setEditBonus] = useState(0)
  const [editActive, setEditActive] = useState(true)
  const [editSort, setEditSort] = useState(0)

  // Format currency
  const formatVnd = (val: number): string => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val)
  }

  // Handle Edit/Create Submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPack) return

    if (editingPack.id === "new") {
      onCreatePackage({
        name: editName,
        price: editPrice,
        credits: editCredits,
        bonus: editBonus,
        isActive: editActive,
        sortOrder: editSort
      })
    } else {
      onUpdatePackage(editingPack.id, {
        name: editName,
        price: editPrice,
        credits: editCredits,
        bonus: editBonus,
        isActive: editActive,
        sortOrder: editSort
      })
    }

    setEditingPack(null)
  }

  // Trigger Create mode
  const startCreate = () => {
    setEditingPack({ id: "new", name: "", price: 0, credits: 0, bonus: 0, isActive: true, sortOrder: 0 })
    setEditName("")
    setEditPrice(0)
    setEditCredits(0)
    setEditBonus(0)
    setEditActive(true)
    setEditSort(0)
  }

  // Trigger Edit mode
  const startEdit = (pack: CreditPackage) => {
    setEditingPack(pack)
    setEditName(pack.name)
    setEditPrice(pack.price)
    setEditCredits(pack.credits)
    setEditBonus(pack.bonus)
    setEditActive(pack.isActive)
    setEditSort(pack.sortOrder)
  }

  // Toggle quick status
  const toggleQuickActive = (pack: CreditPackage) => {
    onUpdatePackage(pack.id, { isActive: !pack.isActive })
  }

  // Pure inline styles object
  const styles = {
    headerRow: {
      borderBottom: "1px solid #e5e7eb",
      paddingBottom: "16px",
      marginBottom: "24px"
    },
    title: {
      fontSize: "22px",
      fontWeight: 700,
      color: "#111827",
      margin: 0
    },
    subtitle: {
      fontSize: "13px",
      color: "#6b7280",
      marginTop: "4px",
      marginBottom: 0
    },
    gridList: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(4, 1fr)",
      gap: "24px"
    },
    card: (active: boolean) => ({
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      display: "flex",
      flexDirection: "column" as const,
      justifyContent: "space-between",
      overflow: "hidden" as const,
      opacity: active ? 1 : 0.65,
      boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05)",
      transition: "all 0.3s",
      boxSizing: "border-box" as const
    }),
    cardAccent: (active: boolean, price: number) => {
      let bg = "#2563eb"
      if (!active) {
        bg = "#94a3b8"
      } else if (price > 300000) {
        bg = "linear-gradient(to right, #8b5cf6, #3b82f6)"
      } else if (price > 100000) {
        bg = "linear-gradient(to right, #10b981, #14b8a6)"
      }
      return {
        height: "6px",
        width: "100%",
        background: bg
      }
    },
    cardBody: {
      padding: "24px",
      display: "flex",
      flexDirection: "column" as const,
      justifyContent: "space-between",
      gap: "24px",
      flex: 1,
      boxSizing: "border-box" as const
    },
    cardName: {
      fontSize: "18px",
      fontWeight: 700,
      color: "#111827",
      margin: 0
    },
    priceWrapper: {
      display: "flex",
      alignItems: "baseline",
      gap: "4px",
      margin: "12px 0"
    },
    priceVal: {
      fontSize: "28px",
      fontWeight: 800,
      color: "#174593"
    },
    priceUnit: {
      fontSize: "12px",
      color: "#6b7280",
      fontWeight: 700
    },
    creditsBox: {
      background: "#f9fafb",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      padding: "12px 16px",
      display: "flex",
      flexDirection: "column" as const,
      gap: "8px",
      fontSize: "13px"
    },
    creditsRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    },
    bonusLabel: {
      fontSize: "11px",
      fontWeight: 700,
      background: "#dcfce7",
      color: "#15803d",
      padding: "2px 8px",
      borderRadius: "100px",
      border: "1px solid #bbf7d0"
    },
    cardActions: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderTop: "1px solid #f3f4f6",
      paddingTop: "16px",
      boxSizing: "border-box" as const
    },
    statusToggleBtn: (active: boolean) => ({
      padding: "6px 12px",
      borderRadius: "8px",
      fontSize: "12px",
      fontWeight: 700,
      border: active ? "1px solid #bbf7d0" : "1px solid #cbd5e1",
      background: active ? "#emerald-50" : "#f3f4f6",
      color: active ? "#15803d" : "#4b5563",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      cursor: "pointer"
    }),
    editBtn: {
      padding: "6px 12px",
      borderRadius: "8px",
      background: "#2563eb",
      color: "#ffffff",
      fontSize: "12px",
      fontWeight: 700,
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "6px"
    },
    modalOverlay: {
      position: "fixed" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(15, 23, 42, 0.4)",
      backdropFilter: "blur(4px)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px"
    },
    modalCard: {
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "16px",
      width: "100%",
      maxWidth: "440px",
      boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
      overflow: "hidden" as const
    },
    modalHeader: {
      padding: "16px 24px",
      background: "#f9fafb",
      borderBottom: "1px solid #e5e7eb",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    },
    modalBody: {
      padding: "24px",
      display: "flex",
      flexDirection: "column" as const,
      gap: "16px"
    },
    formGroup: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "6px"
    },
    label: {
      fontSize: "11px",
      fontWeight: 700,
      color: "#4b5563",
      textTransform: "uppercase" as const,
      letterSpacing: "0.04em"
    },
    textInput: {
      height: "38px",
      padding: "0 12px",
      borderRadius: "8px",
      border: "1px solid #cbd5e1",
      fontSize: "13px",
      outline: "none",
      boxSizing: "border-box" as const
    },
    switchRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: "#f8fafc",
      padding: "14px 18px",
      borderRadius: "12px",
      border: "1px solid #e5e7eb",
      marginTop: "8px"
    },
    toggleOuter: (active: boolean) => ({
      width: "44px",
      height: "24px",
      borderRadius: "100px",
      border: active ? "1px solid #2563eb" : "1px solid #cbd5e1",
      background: active ? "#2563eb" : "#e2e8f0",
      display: "flex",
      alignItems: "center",
      padding: "2px",
      cursor: "pointer",
      position: "relative" as const,
      boxSizing: "border-box" as const
    }),
    toggleInner: (active: boolean) => ({
      width: "18px",
      height: "18px",
      borderRadius: "50%",
      background: "#ffffff",
      boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1)",
      position: "absolute" as const,
      left: active ? "22px" : "2px",
      transition: "left 0.2s"
    })
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* HEADER SECTION */}
      <div style={{ ...styles.headerRow, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={styles.title}>Cấu hình Gói Nạp Credit</h2>
          <p style={styles.subtitle}>Điều chỉnh giá tiền (VND), lượng Credits cơ bản và Credits khuyến mãi của các gói nạp trực tuyến.</p>
        </div>
        <button
          onClick={startCreate}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            background: "#2563eb",
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          + Thêm gói mới
        </button>
      </div>

      {/* PRICING GRID LIST */}
      <div style={styles.gridList}>
        {packages
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((pack) => {
            const active = pack.isActive
            return (
              <div key={pack.id} style={styles.card(active)}>
                {/* Accent bar */}
                <div style={styles.cardAccent(active, pack.price)}></div>

                {/* Card content */}
                <div style={styles.cardBody}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                      <div>
                        <h3 style={styles.cardName}>{pack.name}</h3>
                        <span style={{ fontSize: "9px", fontFamily: "monospace", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>Sort: {pack.sortOrder}</span>
                      </div>
                      <span style={{ color: active ? "#2563eb" : "#cbd5e1" }}>
                        {pack.price > 300000 ? <Sparkles size={18} /> : <Zap size={18} />}
                      </span>
                    </div>

                    <div style={styles.priceWrapper}>
                      <span style={styles.priceVal}>{formatVnd(pack.price).replace("₫", "").trim()}</span>
                      <span style={styles.priceUnit}>VND</span>
                    </div>

                    <div style={styles.creditsBox}>
                      <div style={styles.creditsRow}>
                        <span style={{ color: "#6b7280", fontWeight: 500 }}>Credits:</span>
                        <span style={{ fontWeight: 750, color: "#111827", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Coins size={14} style={{ color: "#eab308" }} />
                          {pack.credits}
                        </span>
                      </div>
                      {pack.bonus > 0 && (
                        <div style={{ ...styles.creditsRow, borderTop: "1px dashed #e5e7eb", paddingTop: "8px" }}>
                          <span style={{ color: "#6b7280", fontWeight: 500 }}>Tặng thêm:</span>
                          <span style={styles.bonusLabel}>+{pack.bonus} Bonus</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={styles.cardActions}>
                    <button
                      onClick={() => toggleQuickActive(pack)}
                      style={styles.statusToggleBtn(active)}
                    >
                      {active ? (
                        <>
                          <Eye size={13} />
                          Đang bán
                        </>
                      ) : (
                        <>
                          <EyeOff size={13} />
                          Tạm đóng
                        </>
                      )}
                    </button>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => startEdit(pack)}
                        style={styles.editBtn}
                      >
                        <Edit3 size={13} />
                        Sửa
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Bạn có chắc muốn xóa gói "${pack.name}"?`)) {
                            onDeletePackage(pack.id)
                          }
                        }}
                        style={{
                          padding: "6px 10px",
                          borderRadius: "8px",
                          background: "#fee2e2",
                          color: "#ef4444",
                          fontSize: "12px",
                          fontWeight: 750,
                          border: "1px solid #fca5a5",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
      </div>

      {/* EDIT MODAL */}
      {editingPack && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#111827", margin: 0 }}>
                {editingPack.id === "new" ? "Thêm Gói Nạp Mới" : "Chỉnh Sửa Gói Nạp"}
              </h3>
              <button onClick={() => setEditingPack(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div style={styles.modalBody}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Tên gói nạp</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    style={styles.textInput}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Giá tiền (VND)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={editPrice}
                      onChange={(e) => setEditPrice(parseInt(e.target.value) || 0)}
                      style={{ ...styles.textInput, fontWeight: 700 }}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Sort Order</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={editSort}
                      onChange={(e) => setEditSort(parseInt(e.target.value) || 0)}
                      style={styles.textInput}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Credits Gốc</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={editCredits}
                      onChange={(e) => setEditCredits(parseInt(e.target.value) || 0)}
                      style={{ ...styles.textInput, color: "#2563eb", fontWeight: 750 }}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Credits Bonus</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={editBonus}
                      onChange={(e) => setEditBonus(parseInt(e.target.value) || 0)}
                      style={{ ...styles.textInput, color: "#16a34a", fontWeight: 750 }}
                    />
                  </div>
                </div>

                {/* Status Toggle Switch */}
                <div style={styles.switchRow}>
                  <div>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#1f2937", display: "block" }}>Trạng thái kinh doanh</span>
                    <span style={{ fontSize: "10px", color: "#6b7280", display: "block", marginTop: "2px" }}>Hiển thị gói này trực tuyến để học viên mua.</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setEditActive(!editActive)}
                    style={styles.toggleOuter(editActive)}
                  >
                    <span style={styles.toggleInner(editActive)}></span>
                  </button>
                </div>
              </div>

              <div style={{ padding: "16px 24px", background: "#f9fafb", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button
                  type="button"
                  onClick={() => setEditingPack(null)}
                  style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#ffffff", fontSize: "13px", fontWeight: 600, cursor: "pointer", color: "#4b5563" }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 16px", borderRadius: "8px", border: "none", background: "#2563eb", fontSize: "13px", fontWeight: 600, cursor: "pointer", color: "#ffffff" }}
                >
                  {editingPack.id === "new" ? "Tạo gói nạp" : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
