type Props = {
  topicIndex: number | null
}

export default function TopicList({ topicIndex }: Props) {
  const topics = [
    "Education",
    "Environment",
    "Technology",
    "Health",
    "Travel",
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{topicIndex}</h1>

      <div className="grid grid-cols-2 gap-4">
        {topics.map((topic, index) => (
          <div
            key={index}
            className="p-4 bg-white rounded-xl shadow hover:shadow-lg cursor-pointer"
          >
            {topic}
          </div>
        ))}
      </div>
    </div>
  )
}