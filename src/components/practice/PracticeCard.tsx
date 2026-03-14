import theme from "@/theme"
import { useNavigate, useParams } from "react-router-dom"

type Props = {
  id: string
  title: string
  questions: number
  participants: number
  progress: number
}

export default function PracticeCard({
  id,
  title,
  questions,
  participants,
  progress,
}: Props){

  const navigate = useNavigate()
  const { skill } = useParams()

  function openTest(e: React.MouseEvent){
    e.stopPropagation

    navigate(`/practice/${skill}/test/${id}`)
  }

  return (

    <article
      onClick={openTest}
      style={{
        background: theme.colors.third,
        borderRadius: 20,
        padding: 20,
        color: "#fff",
        cursor: "pointer",
        transition: "0.2s"
      }}
    >

      <h3>{title}</h3>

      <div
        style={{
          background: "#fff",
          color: theme.colors.third,
          borderRadius: 20,
          padding: "4px 12px",
          display: "inline-block",
          marginTop: 6,
          marginBottom: 8
        }}
      >
        {progress}% completed
      </div>

      <p>{questions} questions</p>
      <p>{participants} participants</p>

    </article>

  )
}