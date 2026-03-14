import theme from "@/theme"

type Props = {
  title: string
  questions: number
  participants: number
  progress: number
}

export default function PracticeCard({
  title,
  questions,
  participants,
  progress
}: Props){

  return (

    <article
      style={{
        background: theme.colors.third,
        borderRadius: 20,
        padding: 20,
        color: "#fff"
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