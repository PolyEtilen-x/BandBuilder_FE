import { useState, useEffect } from "react"
import { grammarApi } from "@/api/materials/grammar.api"
import { Info } from "lucide-react"
import "./style.css"

type Props = {
  subItem: string | null
}

export default function GrammarSentence({ subItem }: Props) {
  const [sentences, setSentences] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await grammarApi.getSentences()
        setSentences(res)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  const categoryMap: Record<string, string> = {
    compound: "Compound",
    complex: "Complex",
    relative: "Relative",
    conditional: "Conditional",
    advanced: "Specialized",
  }

  const filtered = subItem
    ? sentences.filter((s: any) =>
      s.category.toLowerCase().includes(categoryMap[subItem].toLowerCase())
    )
    : sentences

  if (loading) return <p>Loading...</p>

  return (
    <div className="grammar-container">
      <div className="grammar-grid">

        {filtered.map((s: any) => {
          const isOpen = openId === s.id

          return (
            <div key={s.id} className="grammar-card">

              {/* MAIN */}
              <div
                className="card-main"
                onClick={() => toggle(s.id)}
              >
                <h2 className="tense-name">{s.category}</h2>

                <div className="structure-box">
                  {s.structure}
                </div>

                <div className="expand-hint">
                  {isOpen ? "▲ Hide" : "▼ View examples"}
                </div>
              </div>

              {/* EXPAND */}
              {isOpen && (
                <div className="card-expand">

                  {/* IELTS */}
                  <div className="ielts-box" style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <Info size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{s.ielts_application}</span>
                  </div>

                  {/* EXAMPLES */}
                  <div className="example-list">
                    {s.examples.map((ex: any, i: number) => (
                      <div key={i} className="example-card">

                        <p className="example-sentence">
                          {ex.sentence}
                        </p>

                        <div className="example-footer">
                          <span className="example-context">
                            {ex.logic || ex.type}
                          </span>

                          <span className="example-note">
                            • {ex.logic || ex.type}
                          </span>
                        </div>

                      </div>
                    ))}
                  </div>

                </div>
              )}

            </div>
          )
        })}

      </div>
    </div>
  )
}