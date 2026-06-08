import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import MainLayout from "@/components/layout/MainLayout/MainLayout"
import { paymentApi, CreditPackage, PaymentInitiateResponse } from "@/api/payment.api"
import { Check, Copy, X, CheckCircle2 } from "lucide-react"
import { useUIStore } from "@/services/ui/ui.store"
import "./style.css"

export default function UpgradePage() {
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null)
  const [paymentData, setPaymentData] = useState<PaymentInitiateResponse | null>(null)
  const [isPaid, setIsPaid] = useState(false)

  // UI state hooks
  const { t, language } = useUIStore()

  // 1. Lấy danh sách gói
  const { data: packages = [], isLoading } = useQuery({
    queryKey: ["payment-packages"],
    queryFn: async () => {
      const res = await paymentApi.getPackages()
      return res.data
    }
  })

  // 2. Khởi tạo thanh toán
  const handleChoosePackage = async (pkg: CreditPackage) => {
    try {
      setSelectedPackage(pkg)
      const res = await paymentApi.initiatePayment(pkg.id)
      setPaymentData(res.data)
    } catch (error) {
      alert(t("upgrade_err_init"))
    }
  }

  // 3. Polling kiểm tra trạng thái thanh toán (mỗi 3 giây)
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (paymentData && !isPaid) {
      interval = setInterval(async () => {
        try {
          const res = await paymentApi.checkStatus(paymentData.transactionId)
          if (res.data.status === "COMPLETED") {
            setIsPaid(true)
            clearInterval(interval)
          }
        } catch (error) {
          console.error("Polling error:", error)
        }
      }, 3000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [paymentData, isPaid])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert(t("upgrade_copied"))
  }

  return (
    <MainLayout>
      <div className="upgrade-page">
        <div className="upgrade-container">
          <div className="upgrade-header">
            <h1>{t("upgrade_title")}</h1>
            <p>{t("upgrade_sub")}</p>
          </div>

          {isLoading ? (
            <div style={{ textAlign: "center", padding: 50 }}>{t("upgrade_loading")}</div>
          ) : (
            <div className="packages-grid">
              {packages.map((pkg) => (
                <div key={pkg.id} className={`package-card ${pkg.name.includes("Pro") ? "popular" : ""}`}>
                  {pkg.name.includes("Pro") && <div className="popular-badge">{t("upgrade_popular")}</div>}
                  <h3 className="package-name">{pkg.name}</h3>
                  <div className="package-price">
                    <span className="price-amount">{pkg.priceVnd?.toLocaleString() ?? "0"}</span>
                    <span className="price-unit">VND</span>
                  </div>
                  <ul className="package-features">
                    <li><Check size={16} className="check-icon" /> {pkg.credits} {t("upgrade_features_eval")}</li>
                    <li><Check size={16} className="check-icon" /> {t("upgrade_features_analysis")}</li>
                    <li><Check size={16} className="check-icon" /> {t("upgrade_features_sim")}</li>
                    {pkg.bonusCredit > 0 && (
                      <li>
                        <Check size={16} className="check-icon" />{" "}
                        {language === "vi" 
                          ? `${t("upgrade_features_bonus")} ${pkg.bonusCredit} lượt` 
                          : `Bonus ${pkg.bonusCredit} credits`
                        }
                      </li>
                    )}
                  </ul>
                  <button className="btn-choose cursor-pointer" onClick={() => handleChoosePackage(pkg)}>
                    {t("upgrade_btn_choose")}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Payment Modal */}
          {paymentData && (
            <div className="payment-overlay">
              <div className="payment-modal">
                {!isPaid ? (
                  <>
                    <button className="close-btn" onClick={() => setPaymentData(null)}
                      style={{ position: 'absolute', right: 20, top: 20, background: 'none', border: 'none', cursor: 'pointer' }}>
                      <X size={24} color="#64748b" />
                    </button>

                    <h2 style={{ marginBottom: 8 }}>{t("upgrade_modal_title")}</h2>
                    <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>
                      {t("upgrade_modal_sub")}
                    </p>

                    <div className="qr-container">
                      <img src={paymentData.qrImageUrl} alt="Payment QR" className="qr-image" />
                    </div>

                    <div className="payment-info">
                      <div className="info-row">
                        <span className="info-label">{t("upgrade_modal_amount")}</span>
                        <span className="info-value" style={{ color: '#174593' }}>
                          {paymentData.amountVnd?.toLocaleString() ?? "0"} VND
                          <button onClick={() => copyToClipboard(paymentData.amountVnd.toString())} className="copy-btn cursor-pointer"><Copy size={14} /></button>
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">{t("upgrade_modal_content")}</span>
                        <span className="info-value">
                          {paymentData.transferMemo}
                          <button onClick={() => copyToClipboard(paymentData.transferMemo)} className="copy-btn cursor-pointer"><Copy size={14} /></button>
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">{t("upgrade_modal_bank")}</span>
                        <span className="info-value">{paymentData.bankName || "See QR"}</span>
                      </div>
                    </div>

                    <div className="payment-status-box">
                      <div className="loader"></div>
                      <span>{t("upgrade_modal_waiting")}</span>
                    </div>
                  </>
                ) : (
                  <div style={{ padding: '20px 0' }}>
                    <div style={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: 20
                    }}>
                      <CheckCircle2 size={64} color="#174593" />
                    </div>
                    <h2 style={{ marginBottom: 12 }}>{t("upgrade_modal_success_title")}</h2>
                    <p style={{ color: '#64748b', marginBottom: 24 }}>
                      {t("upgrade_modal_success_desc")}
                    </p>
                    <button className="btn-choose cursor-pointer" style={{ background: '#174593', color: '#fff' }} onClick={() => window.location.href = "/profile"}>
                      {t("upgrade_modal_profile_btn")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
