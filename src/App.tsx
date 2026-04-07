import { useEffect } from "react"
import Router from "./routes/index"
import { useAuthStore } from "./services/auth/auth.store"

function App() {
  const fetchUser = useAuthStore((s) => s.fetchUser)

  useEffect(() => {
    fetchUser()
  }, [])

  return <Router />
}

export default App