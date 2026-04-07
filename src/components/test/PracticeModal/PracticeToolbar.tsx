type ToolType = "highlight" | "note" | "dict"

type Props = {
  activeTool: ToolType
  setActiveTool: (tool: ToolType) => void
}

export default function PracticeToolbar({ activeTool, setActiveTool }: Props) {
  const tools = [
    { id: "highlight", label: "Highlight", key: "H" },
    { id: "note", label: "Notes", key: "N" },
    { id: "dict", label: "Dictionary", key: "T" }
  ]

  return (
    <div className="practice-toolbar">
      <div className="toolbar-title">Tools</div>

      {tools.map(tool => (
        <button
          key={tool.id}
          className={`tool-btn ${activeTool === tool.id ? "active" : ""}`}
          onClick={() => setActiveTool(tool.id as ToolType)}
        >
          <div>{tool.label}</div>
          <small>({tool.key})</small>
        </button>
      ))}
    </div>
  )
}