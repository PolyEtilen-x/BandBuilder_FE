import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/services/auth/auth.store"
import { getCookie, deleteCookie } from "@/utils/cookie"

export default function LoginSuccess() {
  const navigate = useNavigate()

  const initAuth = useAuthStore(s => s.initAuth)
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const isLoading = useAuthStore(s => s.isLoading)

  useEffect(() => {
    initAuth()
  }, [initAuth])

  useEffect(() => {
    if (isLoading) return

    if (isAuthenticated) {
      const redirectPath = getCookie("redirectAfterLogin") || "/"
      console.log("Login success, redirecting to:", redirectPath)

      deleteCookie("redirectAfterLogin")
      navigate(redirectPath, { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate])

  return <p>Logging in...</p>
}