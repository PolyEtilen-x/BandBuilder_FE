import { useEffect } from "react"
import Router from "./routes/index"
import { useAuthStore } from "./services/auth/auth.store"

export default function App() {
  const initAuth = useAuthStore(state => state.initAuth)

  useEffect(() => {
    initAuth()
  }, [])

  return <Router />
}
