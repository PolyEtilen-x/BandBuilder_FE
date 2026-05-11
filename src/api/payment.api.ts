import { apiClient } from "./apiClient.api"

export interface CreditPackage {
  id: string
  name: string
  credits: number
  priceVnd: number
  bonusCredit: number
  isActive: boolean
}

export interface PaymentInitiateResponse {
  transactionId: string
  qrCodeUrl: string // Link QR VietQR
  accountNumber: string
  bankName: string
  amount: number
  content: string // Nội dung chuyển khoản quan trọng
}

export interface PaymentStatusResponse {
  status: 'PENDING' | 'SUCCESS' | 'FAILED'
  transactionId: string
  credits: number
  amountVnd: number
}

export const paymentApi = {
  getPackages: () => 
    apiClient.get<CreditPackage[]>("/payment/packages"),

  initiatePayment: (packageId: string) => 
    apiClient.post<PaymentInitiateResponse>("/payment/initiate", { packageId }),

  checkStatus: (transactionId: string) => 
    apiClient.get<PaymentStatusResponse>(`/payment/status/${transactionId}`)
}
