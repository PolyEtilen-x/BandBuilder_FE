import { useParams } from "react-router-dom"
import "./style.css"

const MOCK_DATA: any = {
  Education: [
    { word: "curriculum", meaning: "chương trình học" },
    { word: "tuition", meaning: "học phí" },
    { word: "scholarship", meaning: "học bổng" },
  ],
  Environment: [
    { word: "pollution", meaning: "ô nhiễm" },
    { word: "deforestation", meaning: "phá rừng" },
    { word: "sustainability", meaning: "bền vững" },
  ],
}

export default function TopicDetail() {
  const { topicName } = useParams()

  const words = MOCK_DATA[topicName as string] || []

  return (
    <div className="topic-detail">
      <h1 className="detail-title">{topicName}</h1>

      <div className="word-list">
        {words.map((w: any, i: number) => (
          <div key={i} className="word-card">
            <div className="word-main">
              <span className="word">{w.word}</span>
              <span className="meaning">{w.meaning}</span>
            </div>

            <button className="save-btn">Save</button>
          </div>
        ))}
      </div>
    </div>
  )
}