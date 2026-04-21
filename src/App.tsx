import { useEffect } from "react"
import Router from "./routes/index"
import { useAuthStore } from "./services/auth/auth.store"
import { apiClient } from "./api/apiClient.api"

export default function App() {
  const initAuth = useAuthStore(state => state.initAuth)

  useEffect(() => {
    const init = async () => {
      try {
        await initAuth()
      } catch {}
    }

    init()
  }, [])

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await apiClient.post("/auth/refresh")
        console.log("silent refresh")
      } catch (err) {
        console.log(" refresh fail")
      }
    }, 10 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])
  
  return <Router />
}
