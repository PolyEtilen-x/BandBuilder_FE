import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

export default function LoginSuccess() {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const token = params.get("token")
    const name = params.get("name")
    const avatar = params.get("avatar")

    if (token) {
      // 🔥 lưu vào localStorage (tạm thời)
      localStorage.setItem("token", token)

      if (name) localStorage.setItem("name", name)
      if (avatar) localStorage.setItem("avatar", avatar)

      // 👉 báo cho trang chính biết login thành công
      if (window.opener) {
        window.opener.postMessage("LOGIN_SUCCESS", "*")
      }
    } else {
      // fail → về home
      navigate("/")
    }
  }, [])

  return <p>Logging in...</p>
}