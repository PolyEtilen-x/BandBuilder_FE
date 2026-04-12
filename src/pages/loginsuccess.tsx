import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/services/auth/auth.store"

export default function LoginSuccess() {
  const navigate = useNavigate()

  const initAuth = useAuthStore(s => s.initAuth)
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const isLoading = useAuthStore(s => s.isLoading)

  useEffect(() => {
    initAuth()
  }, [])

  useEffect(() => {
    if (isLoading) return

    if (isAuthenticated) {
      const redirectPath =
        localStorage.getItem("redirectAfterLogin") || "/"

      localStorage.removeItem("redirectAfterLogin")

      navigate(redirectPath, { replace: true })
    }
  }, [isAuthenticated, isLoading])

  return <p>Logging in...</p>
}