import "./style.css"
import { BookOpen, Leaf, Cpu, HeartPulse, Briefcase } from "lucide-react"
import { useNavigate } from "react-router-dom"

type Props = {
  topicIndex: number | null
}

const topics = [
  {
    name: "Education",
    icon: <BookOpen size={20} />,
    desc: "Learning and academic systems",
  },
  {
    name: "Environment",
    icon: <Leaf size={20} />,
    desc: "Climate change and sustainability",
  },
  {
    name: "Technology",
    icon: <Cpu size={20} />,
    desc: "AI and digital world",
  },
  {
    name: "Health",
    icon: <HeartPulse size={20} />,
    desc: "Fitness and wellbeing",
  },
  {
    name: "Work & Career",
    icon: <Briefcase size={20} />,
    desc: "Jobs and professional life",
  },
]

export default function TopicList({}: Props) {
  const navigate = useNavigate()
  return (
    <div className="topic-container">
      <h1 className="topic-title">Vocab by Topic</h1>

      <div className="topic-grid">
        {topics.map((topic, index) => (
          <div 
            key={index} 
            className="topic-card"
              onClick={() => navigate(`/vocab/topic/${topic.name}`)}
          >
            <div className="topic-header">
              <div className="topic-icon">{topic.icon}</div>
              <h2>{topic.name}</h2>
            </div>

            <p className="topic-desc">{topic.desc}</p>

            <div className="topic-footer">120+ words</div>
          </div>
        ))}
      </div>
    </div>
  )
}