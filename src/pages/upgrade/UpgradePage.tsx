import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import MainLayout from "@/components/layout/MainLayout/MainLayout"
import { paymentApi, CreditPackage, PaymentInitiateResponse } from "@/api/payment.api"
import { Check, Copy, X, CheckCircle2 } from "lucide-react"
import "./style.css"

export default function UpgradePage() {
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null)
  const [paymentData, setPaymentData] = useState<PaymentInitiateResponse | null>(null)
  const [isPaid, setIsPaid] = useState(false)

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
      alert("Failed to initiate payment. Please try again.")
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
    alert("Copied to clipboard!")
  }

  return (
    <MainLayout>
      <div className="upgrade-page">
        <div className="upgrade-container">
          <div className="upgrade-header">
            <h1>Upgrade your BandBuilder experience</h1>
            <p>Choose a plan that fits your IELTS goals and unlock all premium features.</p>
          </div>

          {isLoading ? (
            <div style={{ textAlign: "center", padding: 50 }}>Loading packages...</div>
          ) : (
            <div className="packages-grid">
              {packages.map((pkg) => (
                <div key={pkg.id} className={`package-card ${pkg.name.includes("Pro") ? "popular" : ""}`}>
                  {pkg.name.includes("Pro") && <div className="popular-badge">POPULAR</div>}
                  <h3 className="package-name">{pkg.name}</h3>
                  <div className="package-price">
                    <span className="price-amount">{pkg.priceVnd?.toLocaleString() ?? "0"}</span>
                    <span className="price-unit">VND</span>
                  </div>
                  <ul className="package-features">
                    <li><Check size={16} className="check-icon" /> {pkg.credits} AI Evaluation Credits</li>
                    <li><Check size={16} className="check-icon" /> Writing Task 1 & 2 Analysis</li>
                    <li><Check size={16} className="check-icon" /> Full Speaking Simulator</li>
                    {pkg.bonusCredit > 0 && (
                      <li><Check size={16} className="check-icon" /> Bonus {pkg.bonusCredit} credits</li>
                    )}
                  </ul>
                  <button className="btn-choose" onClick={() => handleChoosePackage(pkg)}>
                    Get Started
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

                    <h2 style={{ marginBottom: 8 }}>Complete Your Payment</h2>
                    <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>
                      Please transfer the exact amount using the QR code or details below.
                    </p>

                    <div className="qr-container">
                      <img src={paymentData.qrImageUrl} alt="Payment QR" className="qr-image" />
                    </div>

                    <div className="payment-info">
                      <div className="info-row">
                        <span className="info-label">Amount:</span>
                        <span className="info-value" style={{ color: '#174593' }}>
                          {paymentData.amountVnd?.toLocaleString() ?? "0"} VND
                          <button onClick={() => copyToClipboard(paymentData.amountVnd.toString())} className="copy-btn"><Copy size={14} /></button>
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Content:</span>
                        <span className="info-value">
                          {paymentData.transferMemo}
                          <button onClick={() => copyToClipboard(paymentData.transferMemo)} className="copy-btn"><Copy size={14} /></button>
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Bank:</span>
                        <span className="info-value">{paymentData.bankName || "See QR"}</span>
                      </div>
                    </div>

                    <div className="payment-status-box">
                      <div className="loader"></div>
                      <span>Waiting for your payment...</span>
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
                    <h2 style={{ marginBottom: 12 }}>Payment Successful!</h2>
                    <p style={{ color: '#64748b', marginBottom: 24 }}>
                      Your account has been upgraded successfully. You can now enjoy all premium features.
                    </p>
                    <button className="btn-choose" style={{ background: '#174593', color: '#fff' }} onClick={() => window.location.href = "/profile"}>
                      Go to Profile
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
