import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function LoginSuccess() {
  const navigate = useNavigate()

  useEffect(() => {
    const redirectPath =
      localStorage.getItem("redirectAfterLogin") || "/"

    localStorage.removeItem("redirectAfterLogin")

    navigate(redirectPath)
  }, [])

  return <p>Logging in...</p>
}