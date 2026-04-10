import { useEffect, useState } from "react"
import TopicList from "@/components/vocab/topic/topic_list/TopicList"
import { vocabApi } from "@/api/vocab.api"
import "./style.css"

type Props = {
  mode: "topic" | "band"
}
type View = "select" | "study"

export default function Flashcard({ mode }: Props) {
  const [view, setView] = useState<View>("select")

  const [words, setWords] = useState<any[]>([])
  const [current, setCurrent] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const getRandomWords = (list: any[], count: number) => {
    const shuffled = [...list].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  const handleSelectTopic = async (topicName: string) => {
    try {
      const decodedName = decodeURIComponent(topicName)

      const res = await vocabApi.getTopic(decodedName)

      if (!res || !res.vocab_list) return

      const randomWords = getRandomWords(res.vocab_list, 20)

      setWords(randomWords.length ? randomWords : res.vocab_list)
      setCurrent(0)
      setFlipped(false)
      setView("study")
    } catch (err) {
      console.error("Flashcard error:", err)
    }
  }

  const handleBack = () => {
    setView("select")
    setWords([])
    setCurrent(0)
    setFlipped(false)
  }

  const [topics, setTopics] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await vocabApi.getTopics()

        const filtered = res.filter(
          (t: any) => !/^(LR|SW)_\d+/.test(t.topic)
        )

        setTopics(filtered)
      } catch (err) {
        console.error(err)
      }
    }

    load()
  }, [])

  const handleSelectBand = async (topicName: string) => {
    try {
      const res = await vocabApi.getTopic(topicName)

      if (!res || !res.vocab_list) return

      const randomWords = getRandomWords(res.vocab_list, 20)

      setWords(randomWords.length ? randomWords : res.vocab_list)
      setCurrent(0)
      setFlipped(false)
      setView("study")
    } catch (err) {
      console.error("Band flashcard error:", err)
    }
  }
  
  if (view === "select") {
    return (
      <div className="flashcard-page">

        {/* HEADER */}
        <div className="flashcard-header">
          <h1>Flashcard Learning</h1>
        </div>

        {mode === "topic" ? (
          <div className="band-container">

        <h2 className="band-title">Choose a topic</h2>

        <div className="band-grid">
          {topics.map((t) => (
            <div
              key={t.topic}
              className="band-card"
              onClick={() => handleSelectTopic(t.topic)}
            >
              <h3>{formatTopicName(t.topic)}</h3>
            </div>
          ))}
        </div>

      </div>
        ) : (
          <div className="band-container">

            {/* LR */}
            <div className="band-section">
              <h3>Listening & Reading</h3>

              <div className="band-grid">
                {[5,6,7,8].map((band) => (
                  <div
                    key={`LR_${band}`}
                    className="band-card"
                    onClick={() => handleSelectBand(`LR_${band}`)}
                  >
                    Band {band}.0+
                  </div>
                ))}
              </div>
            </div>

            {/* SW */}
            <div className="band-section">
              <h3>Speaking & Writing</h3>

              <div className="band-grid">
                {[5,6,7,8].map((band) => (
                  <div
                    key={`SW_${band}`}
                    className="band-card"
                    onClick={() => handleSelectBand(`SW_${band}`)}
                  >
                    Band {band}.0+
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    )
  }

  const word = words[current]

  const prev = () => {
    if (current === 0) return
    setCurrent((prev) => prev - 1)
    setFlipped(false)
  }

  const next = () => {
    if (current === words.length - 1) return
    setCurrent((prev) => prev + 1)
    setFlipped(false)
  }
  return (
    <div className="flashcard-page">

    {/* HEADER */}
    <div className="flashcard-header">
      <button onClick={handleBack}>← Back</button>
      <span>{current + 1} / {words.length}</span>
    </div>

    {/* CENTER */}
    <div className="flashcard-center">
      <div
        className="flashcard"
        onClick={() => setFlipped(!flipped)}
      >
        <div className={`card-inner ${flipped ? "flipped" : ""}`}>

          {/* FRONT */}
          <div className="card-front">
            <h2>{word.word}</h2>
          </div>

          {/* BACK */}
          <div className="card-back">
            <p>Pronunciation: {word.pronunciation}</p>
            <p>Meaning: {word.meaning}</p>
            <p>Example: {word.example}</p>
            <p>Synonyms: {word.synonyms?.join(", ")}</p>
          </div>

        </div>
      </div>
    </div>

    {/* ACTION */}
    <div className="flashcard-actions">
      <button onClick={prev} disabled={current === 0}>
        ⏮ Prev
      </button>

      <button onClick={() => setFlipped(!flipped)}>
        Flip
      </button>

      <button onClick={next} disabled={current === words.length - 1}>
        Next ⏭
      </button>
    </div>

  </div>
  )
}

function formatTopicName(name: string) {
  return name.replace(/_/g, " ")
}