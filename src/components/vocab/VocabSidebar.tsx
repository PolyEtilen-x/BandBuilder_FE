import { Book, Layers, Brain, Notebook } from "lucide-react"

type VocabKey = "topics" | "band" | "flashcard" | "notebook"

type Mode = "list" | "learn"

export type VocabSidebarState = {
    category: VocabKey
    mode: Mode
    subItem: number | null
}

const ICONS = {
    topics: <Book size={16} />,
    band: <Layers size={16} />,
    flashcard: <Brain size={16} />,
    notebook: <Notebook size={16} />,
}

const CATEGORIES: VocabKey[] = ["topics", "band", "flashcard", "notebook"]

const VOCAB_CONFIG: Record<
    VocabKey,
    {
        label: string
        subItems: string[]
        hasMode: boolean
    }
> = {
    topics: {
        label: "Topics",
        subItems: ["Education", "Environment", "Technology", "Health"],
        hasMode: false,
    },
    band: {
        label: "Vocab for Band",
        subItems: ["5.0+", "6.0+", "7.0+", "8.0+"],
        hasMode: false,
    },
    flashcard: {
        label: "Flashcards",
        subItems: ["Recent", "Difficult", "Saved"],
        hasMode: true,
    },
    notebook: {
        label: "My Notebook",
        subItems: [],
        hasMode: false,
    },
}

type Props = {
    state: VocabSidebarState
    onChange: (next: VocabSidebarState) => void
}

export default function VocabSidebar({ state, onChange }: Props) {
    const { category, mode, subItem } = state

    const radio: React.CSSProperties = {
        accentColor: "#174593",
        width: 16,
        height: 16,
        cursor: "pointer",
        flexShrink: 0,
    }

const subRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "4px 0",
  cursor: "pointer",
  fontSize: 13,
  color: "#555",
  marginLeft: 24,
}
  function handleSelectCategory(c: VocabKey) {
    if (c !== category) {
      onChange({
        category: c,
        mode: "list",
        subItem: VOCAB_CONFIG[c].subItems.length ? 1 : null,
      })
    }
  }

  function handleSubItem(idx: number) {
    onChange({ category, mode: "list", subItem: idx })
  }

  return (
    <div style={{ width: 260 }}>
      {CATEGORIES.map((c) => {
        const cfg = VOCAB_CONFIG[c]
        const isActive = c === category

        return (
          <div
            key={c}
            style={{
              border: isActive ? "2px solid #174593" : "1px solid #e0e0e0",
              borderRadius: 16,
              padding: "12px 16px",
              marginBottom: 12,
              background: isActive ? "#f0f7ff" : "#fff",
            }}
          >
            {/* Header */}
            <div
              onClick={() => handleSelectCategory(c)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 10,
                cursor: "pointer",
              }}
            >
              <span>{ICONS[c]}</span>
              <span
                style={{
                  fontWeight: 600,
                  color: isActive ? "#174593" : "#444",
                }}
              >
                {cfg.label}
              </span>
            </div>

            {/* SubItems giống Part */}
            {isActive && cfg.subItems.length > 0 && (
              <div>
                {cfg.subItems.map((label, i) => {
                  const idx = i + 1
                  return (
                    <label key={idx} style={{ ...subRowStyle }}>
                      <input
                        type="radio"
                        style={radio}
                        checked={subItem === idx}
                        onChange={() => handleSubItem(idx)}
                      />
                      {label}
                    </label>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}