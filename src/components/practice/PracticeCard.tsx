import theme from "@/styles/theme"
import { useNavigate, useParams } from "react-router-dom"

type Props = {
  id: string
  title: string
  questions: number
  numberOfVisits: number
  progress: number,
  unitId: string,
  onClick?: () => void
}

export default function PracticeCard({
  id,
  title,
  questions,
  numberOfVisits,
  progress,
  unitId,
  onClick
}: Props){

  return (

    <article
      onClick={onClick} className="cursor-pointer"
      style={{
        background: theme.colors.third,
        borderRadius: "1.25rem",
        padding: "1.25rem",
        color: "#fff",
        cursor: "pointer",
        transition: "all 0.2s ease",
        marginTop: "1.25rem",
      }}
    >

      <h3
        style={{
          fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
          marginBottom: "0.5rem"
        }}
      >
        {title}
      </h3>

      <div
        style={{
          background: "#fff",
          color: theme.colors.third,
          borderRadius: "1.25rem",
          padding: "0.25rem 0.75rem",
          display: "inline-block",
          marginBottom: "0.5rem",
          fontSize: "0.85rem"
        }}
      >
        {progress}% completed
      </div>

      <p style={{ fontSize: "0.9rem", margin: "0.2rem 0" }}>
        {questions} questions
      </p>

      <p style={{ fontSize: "0.9rem", margin: "0.2rem 0" }}>
        {numberOfVisits} participants
      </p>

    </article>

  )
}