import { useEffect, useState } from "react"

type Props = {
  duration: number // seconds
  onTimeUp?: () => void
}

export default function Timer({ duration, onTimeUp }: Props) {
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          onTimeUp?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className="exam-timer">
      {minutes}:{seconds.toString().padStart(2, "0")}
    </div>
  )
}