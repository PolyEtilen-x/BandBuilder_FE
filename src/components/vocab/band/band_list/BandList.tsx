import { useEffect, useState } from "react"
import { vocabApi } from "@/api/vocab.api"
import { VocabTopic } from "@/data/vocab/vocab.model"
import "./style.css"

type Props = {
  bandIndex: number | null
  onSelectTopic: (name: string) => void  
}

export default function BandList({ bandIndex, onSelectTopic }: Props) {
  const [topics, setTopics] = useState<VocabTopic[]>([])
  const [loading, setLoading] = useState(true)

  const BAND_MAP = [5, 6, 7, 8]
  const currentBand = BAND_MAP[(bandIndex ?? 1) - 1]

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await vocabApi.getTopics()

        const filtered = res.filter((t: VocabTopic) => {
        const match = t.topic.match(/_(\d+)/)
        if (!match) return false

        return Number(match[1]) === currentBand
      })

        setTopics(filtered)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [bandIndex])

  if (loading) return <p>Loading...</p>

  return (
    <div className="topic-container">
    <h1 className="topic-title">Band {currentBand}.0+</h1>
      <div className="topic-grid">
        {topics.map((topic, index) => {
          const total = topic.vocab_list.length
          const saved = topic.numberSaved
          const progress = total
            ? Math.round((saved / total) * 100)
            : 0

          return (
            <div
              key={index}
              className="topic-card"
              onClick={() => onSelectTopic(topic.topic)}
            >
              <h2>{formatName(topic.topic)}</h2>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="topic-info">
                {saved}/{total} words
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function formatName(name: string) {
  if (name.startsWith("LR"))
    return "Listening & Reading"

  if (name.startsWith("SW"))
    return "Speaking & Writing"

  return name
}