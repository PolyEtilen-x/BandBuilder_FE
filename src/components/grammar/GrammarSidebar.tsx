import { BookOpen, Clock, Layers, AlertTriangle } from "lucide-react"

type GrammarKey =
    | "basics"
    | "tenses"
    | "sentence"
    | "mistakes"

export type GrammarSidebarState = {
    category: GrammarKey
    subItem: string | null
}

const ICONS = {
    basics: <BookOpen size={16} />,
    tenses: <Clock size={16} />,
    sentence: <Layers size={16} />,
    ielts: <Layers size={16} />,
    mistakes: <AlertTriangle size={16} />,
}

const CATEGORIES: GrammarKey[] = [
    "basics",
    "tenses",
    "sentence",
    "mistakes",
]

const CONFIG: Record<
    GrammarKey,
    {
        label: string
        subItems?: { label: string; id: string }[]
    }
> = {
    basics: {
        label: "Basics",
        subItems: [
            { label: "Parts of Speech", id: "morphology" },
            { label: "S-V Agreement", id: "syntax" },
            { label: "Articles", id: "mechanics" },
        ],
    },
    tenses: {
        label: "Tenses",
        subItems: [
            { label: "Present", id: "present" },
            { label: "Past", id: "past" },
            { label: "Future", id: "future" },
            { label: "Perfect", id: "perfect" },
        ],
    },
    sentence: {
        label: "Sentence Structures",
        subItems: [
            { label: "Compound", id: "compound" },
            { label: "Complex", id: "complex" },
            { label: "Conditional", id: "conditional" },
            { label: "Relative", id: "relative" },
            { label: "Advanced", id: "advanced" },
        ],
    },
    mistakes: {
        label: "Common Mistakes",
    },
}

type Props = {
    state: GrammarSidebarState
    onChange: (next: GrammarSidebarState) => void
    contentRef: React.RefObject<HTMLDivElement>
}

export default function GrammarSidebar({ state, onChange, contentRef }: Props) {
    const { category, subItem } = state

    return (
        <div style={{ width: 260 }}>
        {CATEGORIES.map((c) => {
            const cfg = CONFIG[c]
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
                {/* HEADER */}
                <div
                    onClick={() => {
                        if (category === c) {
                            onChange({
                            category: c,
                            subItem: null,
                            })
                        } else {
                            onChange({
                            category: c,
                            subItem: cfg.subItems?.[0]?.id || null,
                            })
                        }
                    }}
                    style={{
                        display: "flex",
                        gap: 8,
                        cursor: "pointer",
                        fontWeight: 600,
                    }}
                >
                    {ICONS[c]}
                    {cfg.label}
                </div>

                {/* SUB */}
                {isActive && subItem && cfg.subItems?.map((item) => (                    
                    <div
                        key={item.id}
                        onClick={() => {
                        onChange({
                            category: c,
                            subItem: item.id,
                        })

                        if (c === "basics") {
                            scrollToSection(item.id, contentRef.current)
                        }
                        }}
                        style={{
                            padding: "4px 0",
                            marginLeft: 20,
                            cursor: "pointer",
                            fontSize: 13,
                            color: subItem === item.id ? "#174593" : "#555",
                        }}
                    >
                      • {item.label}
                    </div>
                ))}
                </div>
            )
        })}
    </div>
  )
}

function scrollToSection(id: string, container: HTMLDivElement | null) {
  const el = document.getElementById(id)

  if (container && el) {
    const y =
      el.getBoundingClientRect().top -
      container.getBoundingClientRect().top +
      container.scrollTop -
      20

    container.scrollTo({
      top: y,
      behavior: "smooth",
    })
  }
}