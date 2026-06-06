import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/services/auth/auth.store"
import { getCookie, deleteCookie } from "@/utils/cookie"

export default function LoginSuccess() {
  const navigate = useNavigate()

  const initAuth = useAuthStore(s => s.initAuth)
  const loginWithToken = useAuthStore(s => s.loginWithToken)
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const isLoading = useAuthStore(s => s.isLoading)

  const params = new URLSearchParams(window.location.search)
  const token = params.get("token")
  const refreshToken = params.get("refreshToken")
  const isMobileTokenFlow = !!(token && refreshToken)

  useEffect(() => {
    if (isMobileTokenFlow) {
      // Mobile web: gọi /auth/me với Bearer token explicit, không phụ thuộc interceptor
      loginWithToken(token!, refreshToken!).then((success) => {
        const redirectPath = getCookie("redirectAfterLogin") || "/"
        deleteCookie("redirectAfterLogin")

        if (success) {
          navigate(redirectPath, { replace: true })
        } else {
          // Token không hợp lệ → về trang chủ
          navigate("/", { replace: true })
        }
      })
      return
    }

    // Desktop flow: dùng cookie như bình thường
    initAuth()

    // Safety net: 5 giây vẫn kẹt → redirect về /
    const timeout = setTimeout(() => {
      console.warn("[LoginSuccess] Timeout — redirecting to /")
      navigate("/", { replace: true })
    }, 5000)

    return () => clearTimeout(timeout)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Mobile token flow đã xử lý ở trên, không can thiệp
    if (isMobileTokenFlow) return

    if (isLoading) return

    if (isAuthenticated) {
      const redirectPath = getCookie("redirectAfterLogin") || "/"
      deleteCookie("redirectAfterLogin")
      navigate(redirectPath, { replace: true })
    } else {
      navigate("/", { replace: true })
    }
  }, [isAuthenticated, isLoading]) // eslint-disable-line react-hooks/exhaustive-deps

  return <p>Logging in...</p>
}