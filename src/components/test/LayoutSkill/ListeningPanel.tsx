import theme from "@/styles/theme"

type ToolType = "highlight" | "note" | "dict"

type Props = {
  section: any
  activeTool?: ToolType   
}

export default function ListeningPanel({ section, activeTool }: Props) {

    if (!section) return <div>No section</div>

    const handleMouseUp = () => {
        const selection = window.getSelection()?.toString().trim()
        if (!selection) return

        if (activeTool === "highlight") {
            console.log("🟡 highlight:", selection)
        }

        if (activeTool === "note") {
            const note = prompt("Add note:")
            console.log("📝", selection, note)
        }

        if (activeTool === "dict") {
            window.open(
                `https://dictionary.cambridge.org/dictionary/english/${selection}`
            )
        }
    }
    return (
        <div
        style={{
            padding: 24,
            height: "100%",
            overflowY: "auto",
            borderRight: "1px solid #eee"
        }}
        >

        {/* TITLE */}
        <h2 style={{ color: theme.colors.third }}>
            Section {section.section}
        </h2>

        <p style={{ margin: "10px 0", color: "#555" }}>
            {section.description}
        </p>

        {section.speakers && (
            <p style={{ fontSize: 14, color: "#888" }}>
            Speakers: {section.speakers.join(", ")}
            </p>
        )}

        {section.audioUrl && (
            <div style={{ marginTop: 20 }}>
            <audio controls style={{ width: "100%" }}>
                <source src={section.audioUrl} type="audio/mpeg" />
                Your browser does not support audio.
            </audio>
            </div>
        )}

        {section.question_blocks?.map((block:any, index:number)=>(
            block.imgUrl && (
            <div key={index} style={{ marginTop: 20 }}>
                
                <p style={{ fontSize: 14, color: "#888" }}>
                Questions {block.questions_range}
                </p>

                <img
                src={block.imgUrl}
                alt="Listening visual"
                style={{
                    width: "100%",
                    borderRadius: 10
                }}
                />
            </div>
            )
        ))}
        </div>
    )
}
