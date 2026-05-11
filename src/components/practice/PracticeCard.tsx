import theme from "@/styles/theme"
import { Users, HelpCircle, CheckCircle2 } from "lucide-react"

type Props = {
  id: string
  title: string
  questions: number
  numberOfVisits: number
  progress: number
  unitId: string
  onClick?: () => void
}

export default function PracticeCard({
  title,
  questions,
  numberOfVisits,
  progress,
  onClick
}: Props) {
  return (
    <article
      onClick={onClick}
      style={{
        background: "linear-gradient(135deg, #174593 0%, #0d2b5c 100%)",
        borderRadius: "1.25rem",
        padding: "1.5rem",
        color: "#fff",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        border: "1px solid rgba(255, 255, 255, 0.1)"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)"
        e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.2)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)"
        e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
      }}
    >
      {/* Badge Progress */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div
          style={{
            background: progress === 100 ? "#4ade80" : "rgba(255, 255, 255, 0.2)",
            color: "#fff",
            borderRadius: "2rem",
            padding: "0.25rem 0.75rem",
            fontSize: "0.75rem",
            fontWeight: 600,
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}
        >
          {progress === 100 ? <CheckCircle2 size={12} /> : null}
          {progress}% completed
        </div>
      </div>

      <h3
        style={{
          fontSize: "1.1rem",
          fontWeight: 700,
          lineHeight: 1.4,
          margin: 0,
          minHeight: "3em",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden"
        }}
      >
        {title}
      </h3>

      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", opacity: 0.8 }}>
          <HelpCircle size={14} />
          <span>{questions} questions</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", opacity: 0.8 }}>
          <Users size={14} />
          <span>{numberOfVisits} participants</span>
        </div>
      </div>

      {/* Decorative circle */}
      <div style={{
        position: "absolute",
        bottom: "-20px",
        right: "-20px",
        width: "80px",
        height: "80px",
        background: "rgba(255, 255, 255, 0.05)",
        borderRadius: "50%"
      }} />
    </article>
  )
}