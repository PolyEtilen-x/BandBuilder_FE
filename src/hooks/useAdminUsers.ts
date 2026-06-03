import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { adminUserApi, AdjustCreditsDto, UpdateUserRoleDto } from "@/api/adminUser.api"

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await adminUserApi.listUsers()
      return res.data
    }
  })
}

export const useAdminUserTransactions = (userId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["admin-user-transactions", userId],
    queryFn: async () => {
      const res = await adminUserApi.getUserTransactions(userId)
      return res.data
    },
    enabled: enabled && !!userId
  })
}

export const useAdjustCredits = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: AdjustCreditsDto }) => {
      const res = await adminUserApi.adjustCredits(userId, data)
      return res.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] })
      queryClient.invalidateQueries({ queryKey: ["admin-user-transactions", variables.userId] })
    }
  })
}

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: UpdateUserRoleDto }) => {
      const res = await adminUserApi.updateUserRole(userId, data)
      return res.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] })
    }
  })
}
