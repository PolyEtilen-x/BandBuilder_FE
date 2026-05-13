import theme from "@/styles/theme"
import { useDictionary } from "@/services/dictionary/useDictionary"
import "./style.css"

type ToolType = "highlight" | "note" | "dict"

type Props = {
  section: any
  activeTool?: ToolType   
}

export default function ListeningPanel({ section, activeTool }: Props) {
    const { lookup } = useDictionary()
    if (!section) return <div style={{ padding: 24 }}>No section data available</div>

    const handleMouseUp = () => {
        const selection = window.getSelection()
        const text = selection?.toString().trim()
        if (!text) return

        if (activeTool === "highlight") {
            const range = selection!.getRangeAt(0)
            const span = document.createElement("span")
            span.style.background = "#8cb5fd"
            span.style.padding = "2px 4px"
            span.style.borderRadius = "4px"

            range.surroundContents(span)
            selection?.removeAllRanges()
        }

        if (activeTool === "dict") {
            lookup(text)
        }
    }

    return (
        <div
            style={{
                padding: 30,
                height: "100%",
                overflowY: "auto",
                backgroundColor: "#fff",
                borderRight: "1px solid #eee"
            }}
            onMouseUp={handleMouseUp}
        >
            {/* TITLE */}
            <h2 style={{ 
                color: theme.colors.third, 
                fontSize: "22px", 
                fontWeight: 700,
                marginBottom: "8px" 
            }}>
                Section {section.section}
            </h2>

            <p style={{ margin: "0 0 20px 0", color: "#64748b", fontSize: "15px" }}>
                {section.description}
            </p>

            {section.speakers && (
                <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 20 }}>
                    <span style={{ fontWeight: 600 }}>Speakers:</span> {section.speakers.join(", ")}
                </p>
            )}

            {section.audioUrl && (
                <div style={{ 
                    marginTop: 24, 
                    marginBottom: 32, 
                    padding: "16px", 
                    background: "#f8fafc", 
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0"
                }}>
                    <audio controls style={{ width: "100%" }}>
                        <source src={section.audioUrl} type="audio/mpeg" />
                        Your browser does not support audio.
                    </audio>
                </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
                {section.question_blocks?.map((block: any, index: number) => (
                    <div key={index} style={{ 
                        padding: "20px", 
                        borderRadius: "12px", 
                        border: "1px solid #f1f5f9",
                        background: "#fcfcfc"
                    }}>
                        <div style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ 
                                background: "#2563eb", 
                                color: "#fff", 
                                padding: "2px 10px", 
                                borderRadius: "4px", 
                                fontSize: "12px", 
                                fontWeight: 600 
                            }}>
                                Questions {block.questions_range}
                            </span>
                        </div>

                        {block.instruction && (
                            <p style={{ fontSize: "14px", color: "#334155", fontWeight: 500, marginBottom: 16, lineHeight: 1.5 }}>
                                {block.instruction}
                            </p>
                        )}

                        {block.imgUrl && (
                            <div style={{ marginTop: 10 }}>
                                <img
                                    src={block.imgUrl}
                                    alt="Listening visual"
                                    style={{
                                        width: "100%",
                                        borderRadius: 8,
                                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                                    }}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

