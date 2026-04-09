import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { vocabApi } from "@/api/vocab.api"
import { VocabTopic } from "@/data/vocab/vocab.model"
import "./style.css"

type Props = {
  topicIndex: number | null
  onSelectTopic: (name: string) => void
}
export default function TopicList({ topicIndex, onSelectTopic }: Props) {
  const [topics, setTopics] = useState<VocabTopic[]>([])
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await vocabApi.getTopics()
        setTopics(res)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <div className="topic-container">
      <h1 className="topic-title">Vocab by Topic</h1>

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
              {/* TITLE */}
              <h2>{topic.topic}</h2>

              {/* PROGRESS BAR */}
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* INFO */}
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