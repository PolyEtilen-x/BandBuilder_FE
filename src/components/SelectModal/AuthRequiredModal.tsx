import { loginWithGoogle } from "@/services/auth/SignUpWithGoogle"
import { LogIn, X } from "lucide-react"

type Props = {
  open: boolean
  onClose: () => void
}

export default function AuthRequiredModal({ open, onClose }: Props) {
  if (!open) return null

  const handleLogin = () => {
    loginWithGoogle()
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: 20
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          width: "100%",
          maxWidth: 400,
          borderRadius: 24,
          padding: 32,
          position: "relative",
          textAlign: "center",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#888"
          }}
        >
          <X size={20} />
        </button>

        <div
          style={{
            width: 64,
            height: 64,
            background: "#f0f7ff",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 auto 20px",
            color: "#174593"
          }}
        >
          <LogIn size={32} />
        </div>

        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: "#333" }}>
          Authentication Required
        </h3>

        <p style={{ color: "#666", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
          To track your progress, save your scores, and access all features, please sign in before starting this test.
        </p>

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            background: "#174593",
            color: "#fff",
            padding: "14px",
            borderRadius: 12,
            border: "none",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#0d2b5c")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#174593")}
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/navigation/google.svg"
            alt="Google"
            style={{ width: 18, height: 18 }}
          />
          Sign in with Google
        </button>

        <button
          onClick={onClose}
          style={{
            marginTop: 12,
            background: "none",
            border: "none",
            color: "#888",
            fontSize: 13,
            cursor: "pointer",
            textDecoration: "underline"
          }}
        >
          Maybe later
        </button>
      </div>
    </div>
  )
}
