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
  qrImageUrl: string
  accountNumber: string
  bankName: string
  amountVnd: number
  transferMemo: string
  credits: number
  expiredAt: string
}

export interface PaymentStatusResponse {
  status: 'PENDING' | 'COMPLETED' | 'FAILED'
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
    apiClient.get<PaymentStatusResponse>(`/payment/status/${transactionId}`),

  // Admin APIs
  adminGetPackages: () =>
    apiClient.get<any[]>("/admin/packages"),

  adminCreatePackage: (dto: {
    name: string
    credits: number
    priceVnd: number
    bonusCredit?: number
    isActive?: boolean
    sortOrder?: number
  }) =>
    apiClient.post<any>("/admin/packages", dto),

  adminUpdatePackage: (id: string, dto: {
    name?: string
    credits?: number
    priceVnd?: number
    bonusCredit?: number
    isActive?: boolean
    sortOrder?: number
  }) =>
    apiClient.patch<any>(`/admin/packages/${id}`, dto),

  adminDeletePackage: (id: string) =>
    apiClient.delete(`/admin/packages/${id}`)
}
