import { useEffect, useState } from "react"
import { grammarApi } from "@/api/grammar.api"
import { MistakeCategory } from "@/data/grammar/mistake.model"
import "./style.css"

type Props = {
  onSelect: (category: MistakeCategory) => void
}

export default function MistakeList({ onSelect }: Props) {
  const [data, setData] = useState<MistakeCategory[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const res = await grammarApi.getMistakes()
      setData(res)
    }

    fetchData()
  }, [])

  return (
    <div className="grammar-container">

      <h1 className="page-title">Common Mistakes</h1>

      <div className="grammar-grid">
        {data.map((item) => (
          <div
            key={item.category}
            className="grammar-card"
            onClick={() => onSelect(item)}
          >
            <h2>{item.category}</h2>

          </div>
        ))}
      </div>

    </div>
  )
}