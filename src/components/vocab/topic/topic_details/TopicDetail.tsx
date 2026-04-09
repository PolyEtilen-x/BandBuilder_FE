import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { vocabApi } from "@/api/vocab.api"
import { VocabTopic } from "@/data/vocab/vocab.model"
import "./style.css"

type Props = {
  topicName: string
  onBack: () => void
}

export default function TopicDetail({ topicName, onBack }: Props) {
    const decodedName = decodeURIComponent(topicName || "")

    const [topic, setTopic] = useState<VocabTopic | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
        try {
            setLoading(true)
            const res = await vocabApi.getTopic(decodedName)
            setTopic(res || null)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
        }

        load()
    }, [decodedName])

    const handleSave = async (id: number) => {
        const updated = await vocabApi.toggleSave(decodedName, id)
        if (updated) setTopic(updated)
    }

    const playAudio = (word: string) => {
        speechSynthesis.cancel()

        const voices = speechSynthesis.getVoices()
        const voice = voices.find(v => v.lang === "en-US")

        const utterance = new SpeechSynthesisUtterance(word)
        utterance.voice = voice || null
        utterance.rate = 0.9

        speechSynthesis.speak(utterance)
    }

    if (loading) return <p>Loading...</p>
    if (!topic) return <p>No data</p>

    return (
        <div className="vocab-content">
            <div className="detail-header">
                <h2 className="detail-title">{topic.topic}</h2>
                <button onClick={onBack}>← Back</button>
            </div>
            <div className="detail-container">
                {topic.vocab_list.map((w) => (
                    <div key={w.id} className="word-card">

                    {/* LEFT */}
                    <div className="word-content">
                        <div className="word-top">
                        <h3>{w.word}</h3>

                        <button
                            className="audio-btn"
                            onClick={() => playAudio(w.word)}
                        >
                            🔊
                        </button>
                        </div>

                        <span className="pronunciation">{w.pronunciation}</span>

                        <p className="meaning">
                            Vietnamese meaning: {w.meaning}
                        </p>

                        <p className="example">
                            Example: "{w.example}"
                        </p>

                        {w.synonyms && (
                        <p className="synonyms">
                            Synonyms: "{w.synonyms.join(", ")}""
                        </p>
                        )}
                    </div>

                    {/* RIGHT */}
                    <div className="word-action">
                        <button
                        className={`save-btn ${w.isSaved ? "saved" : ""}`}
                        onClick={() => handleSave(w.id)}
                        >
                        {w.isSaved ? "Saved" : "Save"}
                        </button>
                    </div>

                    </div>
                ))}
            </div>
        </div>
    )
}