import "./WritingPanel.css"
import { WritingTask } from "@/data/practices/practice.types"

interface WritingPanelProps {
  content: WritingTask
  taskNumber?: 1 | 2
}

export default function WritingPanel({ content, taskNumber }: WritingPanelProps) {
  const task = taskNumber ?? content.task ?? 1
  const minWords = content.min_words ?? (task === 1 ? 150 : 250)
  const timeMinutes = content.time_minutes ?? (task === 1 ? 20 : 40)

  return (
    <div className="writing-panel-wrapper">
      {/* Task badge */}
      <div className="writing-task-badge">
        Writing Task {task}
      </div>

      {/* Time & word count info chips */}
      <div className="writing-info-row">
        <div className="writing-info-chip">
          <div className="chip-label">Time</div>
          <div className="chip-value">{timeMinutes}</div>
          <div className="chip-unit">minutes</div>
        </div>
        <div className="writing-info-chip">
          <div className="chip-label">Min Words</div>
          <div className="chip-value">{minWords}</div>
          <div className="chip-unit">words</div>
        </div>
      </div>

      {/* Instruction */}
      <div className="writing-instruction-card">
        <p>{content.instruction}</p>
      </div>

      {/* Prompt / Question */}
      <div className="writing-prompt-card">
        <h3>{task === 1 ? "Task Description" : "Essay Question"}</h3>
        <p className="writing-prompt-text">{content.prompt}</p>
      </div>

      {/* Task 1: Chart / Visual description */}
      {task === 1 && (content.visual_description || content.visuals?.length) && (
        <div className="writing-visual-card">
          <h4>Charts &amp; Visuals</h4>
          {content.visual_description && (
            <p className="writing-visual-description">{content.visual_description}</p>
          )}
          {content.visuals && content.visuals.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 12 }}>
              {content.visuals.map((v: any, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="writing-visual-type-badge">
                      {v.type.replace(/_/g, " ")}
                    </span>
                    <span style={{ fontWeight: 550, color: "#334155" }}>{v.label}</span>
                  </div>
                  {v.imageUrl && (
                    <div style={{ marginTop: 4, display: "flex", justifyContent: "center" }}>
                      <img 
                        src={v.imageUrl} 
                        alt={v.label} 
                        style={{ 
                          maxWidth: "100%", 
                          maxHeight: 400, 
                          borderRadius: 8, 
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                          border: "1px solid #e2e8f0",
                          backgroundColor: "#fff",
                          padding: 4
                        }} 
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Task 2: Note */}
      {task === 2 && content.note && (
        <div className="writing-instruction-card">
          <p>{content.note}</p>
        </div>
      )}
    </div>
  )
}
