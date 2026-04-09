import { useAuthStore } from "@/services/auth/auth.store"

export const requireAuth = (): boolean => {
  const { isAuthenticated, isLoading } = useAuthStore.getState()

  // still loading, treat as not authenticated to avoid potential security issue, can be improved by showing a loading indicator in the future
  if (isLoading) {
    console.warn("Auth still loading...")
    return false
  }

  // don't have user
  if (!isAuthenticated) {
    window.dispatchEvent(new Event("open-login"))
    return false
  }

  // logged in
  return true
}