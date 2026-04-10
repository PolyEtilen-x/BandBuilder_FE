import { useEffect, useState } from "react"
import { grammarApi } from "@/api/grammar.api"
import "./style.css"

export default function GrammarBasics() {
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
        const res = await grammarApi.getBasics()
        setData(res)
        setLoading(false)
        }

        load()
    }, [])

    if (loading) return <p>Loading...</p>

    return (
        <div className="grammar-container">

            <h2 className="section-main-title"> Grammar Basics</h2>
        {/* GROUP BY CATEGORY */}
        {["Morphology", "Syntax", "Mechanics", "Phonetics"].map((cat) => {
            const items = data.filter((i) => i.category === cat)

            if (!items.length) return null

            return (
            <div key={cat} className="grammar-section">
                <h2 id={cat.toLowerCase()} className="section-title">
                    {cat}
                </h2>
                <div className="grammar-grid">
                {items.map((item) => (
                    <div key={item.id} className="grammar-card">
                        {/* LEFT */}
                        <div className="grammar-left">
                            <h3 className="grammar-topic">
                            {item.topic}
                            </h3>

                            <p className="grammar-rule">
                            {item.ruleSummary}
                            </p>

                            <div className="grammar-strategy">
                            💡 {item.ieltsStrategy}
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="grammar-right">
                            {item.practiceCases?.slice(0, 2).map((ex: any, i: number) => (
                            <div key={i} className="example">
                                <span className="input">{ex.input}</span>
                                <span className="arrow">→</span>
                                <span className="output">{ex.transformed}</span>
                            </div>
                            ))}
                        </div>

                    </div>
                ))}
                </div>
            </div>
            )
        })}

        </div>
    )
}