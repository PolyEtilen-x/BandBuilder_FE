import { useDictionary } from "@/services/dictionary/useDictionary"
import DictionaryPanel from "@/components/dictionary/DictionaryPanel"

type ToolType = "highlight" | "note" | "dict"

type Props = {
    section: any
    activeTool?: ToolType
}

export default function ListeningPanel({ section, activeTool }: Props) {
    const { dict, loading, lookup, close, save } = useDictionary()

    if (!section) return <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Loading section...</div>

    const handleMouseUp = () => {
        const selection = window.getSelection()
        const text = selection?.toString().trim()
        if (!text || activeTool !== "dict") return
        lookup(text)
    }

    return (
        <div
            style={{ padding: "40px", height: "100%", overflowY: "auto", backgroundColor: "#fff" }}
            onMouseUp={handleMouseUp}
        >
            <div style={{ marginBottom: 40 }}>
                <h2 style={{ color: "#0f172a", fontSize: "28px", fontWeight: 800, marginBottom: "12px" }}>
                    Section {section.section}
                </h2>
                <p style={{ color: "#475569", fontSize: "17px", lineHeight: 1.6, fontWeight: 500 }}>
                    {section.description}
                </p>
            </div>

            {section.audioUrl && (
                <div style={{
                    marginBottom: 48, padding: "24px", background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                    borderRadius: "20px", border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
                }}>
                    <div style={{ fontSize: "11px", fontWeight: 800, color: "#64748b", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        Audio Control Panel
                    </div>
                    <audio controls style={{ width: "100%", height: "40px" }}>
                        <source src={section.audioUrl} type="audio/mpeg" />
                    </audio>
                </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                {section.question_blocks?.map((block: any, index: number) => (
                    <div key={index} style={{ padding: "28px", borderRadius: "20px", border: "1px solid #f1f5f9", background: "#fff", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
                        <div style={{ marginBottom: 16 }}>
                            <span style={{ background: "#2563eb", color: "#fff", padding: "5px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: 800 }}>
                                QUESTIONS {block.questions_range}
                            </span>
                        </div>
                        {block.instruction && (
                            <p style={{ fontSize: "15px", color: "#1e293b", fontWeight: 700, marginBottom: 24, fontStyle: "italic", borderLeft: "4px solid #3b82f6", paddingLeft: "16px" }}>
                                {block.instruction}
                            </p>
                        )}
                        {block.imgUrl && (
                            <div style={{ textAlign: "center", marginTop: 20 }}>
                                <img src={block.imgUrl} alt="Visual" style={{ maxWidth: "100%", borderRadius: "16px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }} />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <DictionaryPanel dict={dict} loading={loading} onClose={close} onSave={save} />
        </div>
    )
}
