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
    const params = new URLSearchParams(window.location.search)
    const token = params.get("token")
    const refreshToken = params.get("refreshToken")

    if (token && refreshToken) {
      // Mobile web flow: lưu token vào localStorage
      localStorage.setItem("accessToken", token)
      localStorage.setItem("refreshToken", refreshToken)
      setCookie("bandbuilder-logged-in", "true", 7)

      const redirectPath = getCookie("redirectAfterLogin") || "/"
      deleteCookie("redirectAfterLogin")

      // Full page reload — App.tsx sẽ initAuth() với token đã có trong localStorage
      window.location.replace(redirectPath)
      return
    }

    // Desktop/fallback flow
    initAuth()

    // Safety net: nếu sau 5 giây vẫn còn ở trang này → redirect về /
    const timeout = setTimeout(() => {
      console.warn("[LoginSuccess] Timeout — redirecting to /")
      navigate("/", { replace: true })
    }, 5000)

    return () => clearTimeout(timeout)
  }, [initAuth, navigate])

  useEffect(() => {
    if (isLoading) return

    if (isAuthenticated) {
      const redirectPath = getCookie("redirectAfterLogin") || "/"
      deleteCookie("redirectAfterLogin")
      navigate(redirectPath, { replace: true })
    } else {
      // initAuth xong mà vẫn chưa đăng nhập → không để kẹt, redirect về /
      navigate("/", { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate])

  return <p>Logging in...</p>
}