import { useState } from "react"
import data from "@/data/grammar/tense.data.json"
import "./style.css"

type Props = {
  subItem: string | null
}

export default function GrammarTenses({ subItem }: Props) {
  const [openId, setOpenId] = useState<number | null>(null)

  const toggle = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  const groupMap: Record<string, string> = {
    present: "present",
    past: "past",
    future: "future",
    perfect: "perfect",
  }

  const filtered = subItem
    ? data.data.filter((t: any) =>
        t.tense_name.toLowerCase().includes(groupMap[subItem])
      )
    : data.data

  return (
    <div className="grammar-container">

      <div className="grammar-grid">

        {filtered.map((t) => {
          const isOpen = openId === t.id

          return (
            <div
              key={t.id}
              className={`grammar-card ${isOpen ? "open" : ""}`}
            >
              {/* MAIN */}
              <div className="card-main" onClick={() => toggle(t.id)}>

                <h2 className="tense-name">{t.tense_name}</h2>

                <div className="structure-box">
                  {t.structure}
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
                    💡 {t.ielts_application}
                  </div>

                  {/* EXAMPLES */}
                  <div className="example-list">
                    {t.examples.map((ex: any, i: number) => (
                      <div key={i} className="example-card">

                        <p className="example-sentence">
                          {ex.sentence}
                        </p>

                        <div className="example-footer">
                          <span className="example-context">
                            {ex.context}
                          </span>

                          <span className="example-note">
                            {ex.note}
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