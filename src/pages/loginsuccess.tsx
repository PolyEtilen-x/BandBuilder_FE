import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAuthStore } from "@/services/auth/auth.store"
import { getCookie, deleteCookie, setCookie } from "@/utils/cookie"

export default function LoginSuccess() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const initAuth = useAuthStore(s => s.initAuth)
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const isLoading = useAuthStore(s => s.isLoading)

  useEffect(() => {
    const token = searchParams.get("token")
    const refreshToken = searchParams.get("refreshToken")

    if (token && refreshToken) {
      localStorage.setItem("accessToken", token)
      localStorage.setItem("refreshToken", refreshToken)
      setCookie("bandbuilder-logged-in", "true", 7)
    }

    initAuth()
  }, [initAuth, searchParams])

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