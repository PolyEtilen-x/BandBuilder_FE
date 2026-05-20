import { useEffect } from "react"
import Router from "./routes/index"
import { useAuthStore } from "./services/auth/auth.store"

export default function App() {
  const { initAuth } = useAuthStore()

  useEffect(() => {
    initAuth()
  }, [initAuth])

  return <Router />
}
