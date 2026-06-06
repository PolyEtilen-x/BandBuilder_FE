import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/services/auth/auth.store"
import { getCookie, deleteCookie, setCookie } from "@/utils/cookie"

export default function LoginSuccess() {
  const navigate = useNavigate()

  const initAuth = useAuthStore(s => s.initAuth)
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const isLoading = useAuthStore(s => s.isLoading)

  useEffect(() => {
    // Dùng window.location.search thay vì useSearchParams hook
    // để tránh vòng lặp render vô hạn
    const params = new URLSearchParams(window.location.search)
    const token = params.get("token")
    const refreshToken = params.get("refreshToken")

    if (token && refreshToken) {
      localStorage.setItem("accessToken", token)
      localStorage.setItem("refreshToken", refreshToken)
      setCookie("bandbuilder-logged-in", "true", 7)
    }

    initAuth()
  }, [initAuth]) // Không thêm gì vào dependency array — chạy 1 lần khi mount

  useEffect(() => {
    if (isLoading) return

    if (isAuthenticated) {
      const redirectPath = getCookie("redirectAfterLogin") || "/"
      console.log("Login success, redirecting to:", redirectPath)

      deleteCookie("redirectAfterLogin")
      navigate(redirectPath, { replace: true })
    }
    // Không có else navigate — tránh redirect sớm khi Desktop đang loading
  }, [isAuthenticated, isLoading, navigate])

  return <p>Logging in...</p>
}