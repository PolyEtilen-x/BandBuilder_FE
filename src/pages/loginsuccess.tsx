import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/services/auth/auth.store"
import { getCookie, deleteCookie, setCookie } from "@/utils/cookie"

export default function LoginSuccess() {
  const navigate = useNavigate()

  const initAuth = useAuthStore(s => s.initAuth)
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const isLoading = useAuthStore(s => s.isLoading)

  // Đọc 1 lần, dùng chung cho cả 2 effects
  const params = new URLSearchParams(window.location.search)
  const token = params.get("token")
  const refreshToken = params.get("refreshToken")
  const isMobileTokenFlow = !!(token && refreshToken)

  useEffect(() => {
    if (isMobileTokenFlow) {
      // Mobile web flow: lưu token vào localStorage
      localStorage.setItem("accessToken", token!)
      localStorage.setItem("refreshToken", refreshToken!)
      setCookie("bandbuilder-logged-in", "true", 7)

      const redirectPath = getCookie("redirectAfterLogin") || "/"
      deleteCookie("redirectAfterLogin")

      // Full page reload — App.tsx sẽ initAuth() với token đã có trong localStorage
      window.location.replace(redirectPath)
      return
    }

    // Desktop flow
    initAuth()

    // Safety net: 5 giây vẫn kẹt → redirect về /
    const timeout = setTimeout(() => {
      console.warn("[LoginSuccess] Timeout — redirecting to /")
      navigate("/", { replace: true })
    }, 5000)

    return () => clearTimeout(timeout)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Nếu mobile token flow → window.location.replace() đang xử lý, KHÔNG can thiệp
    if (isMobileTokenFlow) return

    if (isLoading) return

    if (isAuthenticated) {
      const redirectPath = getCookie("redirectAfterLogin") || "/"
      deleteCookie("redirectAfterLogin")
      navigate(redirectPath, { replace: true })
    } else {
      // initAuth xong, vẫn chưa đăng nhập → redirect về / thay vì kẹt
      navigate("/", { replace: true })
    }
  }, [isAuthenticated, isLoading]) // eslint-disable-line react-hooks/exhaustive-deps

  return <p>Logging in...</p>
}