import { useEffect } from "react"
import Router from "./routes/index"
import { useAuthStore } from "./services/auth/auth.store"
import { apiClient } from "./api/apiClient.api"

export default function App() {
  const { initAuth, isAuthenticated } = useAuthStore()

  useEffect(() => {
    initAuth()
  }, [initAuth])

  useEffect(() => {
    if (!isAuthenticated) return

    const interval = setInterval(async () => {
      try {
        await apiClient.post("/auth/refresh")
        console.log("silent refresh success")
      } catch (err) {
        console.log("silent refresh failed")
      }
    }, 10 * 60 * 1000)

    return () => clearInterval(interval)
  }, [isAuthenticated])

  return <Router />
}
