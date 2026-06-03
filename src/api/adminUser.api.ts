import { apiClient } from "./apiClient.api"

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  balance: number;
  joinDate: string;
}

export interface AdjustCreditsDto {
  amount: number;
  type: "BONUS" | "REFUND";
  reason: string;
}

export interface UpdateUserRoleDto {
  role: "STUDENT" | "ADMIN";
}

export interface CreditTransaction {
  id: string;
  userId: string;
  type: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string | null;
  status: string;
  createdAt: string;
}

export const adminUserApi = {
  listUsers: () =>
    apiClient.get<AdminUser[]>("/admin/users"),

  getUserTransactions: (userId: string) =>
    apiClient.get<CreditTransaction[]>(`/admin/users/${userId}/transactions`),

  adjustCredits: (userId: string, data: AdjustCreditsDto) =>
    apiClient.post<CreditTransaction>(`/admin/users/${userId}/adjust-credits`, data),

  updateUserRole: (userId: string, data: UpdateUserRoleDto) =>
    apiClient.patch<any>(`/admin/users/${userId}/role`, data),
}
