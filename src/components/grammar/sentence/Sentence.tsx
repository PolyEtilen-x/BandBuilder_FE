import { useState } from "react"
import data from "@/data/grammar/sentence.data.json"
import "./style.css"

type Props = {
  subItem: string | null
}

export default function GrammarSentence({ subItem }: Props) {
  const [openId, setOpenId] = useState<number | null>(null)

  const toggle = (id: number) => {
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
    ? data.data.filter((s: any) =>
        s.category.toLowerCase().includes(categoryMap[subItem].toLowerCase())
      )
    : data.data

  return (
    <div className="grammar-container">
      <div className="grammar-grid">

        {filtered.map((s: any, index: number) => {
          const id = index + 1
          const isOpen = openId === id

          return (
            <div key={id} className="grammar-card">

              {/* MAIN */}
              <div
                className="card-main"
                onClick={() => toggle(id)}
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
                  <div className="ielts-box">
                    💡 {s.ielts_application}
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