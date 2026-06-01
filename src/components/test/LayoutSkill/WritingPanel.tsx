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
        ✍️ Writing Task {task}
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
        <span className="writing-instruction-icon">💡</span>
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
            <ul className="writing-visual-list">
              {content.visuals.map((v, i) => (
                <li key={i}>
                  <span className="writing-visual-type-badge">
                    {v.type.replace(/_/g, " ")}
                  </span>
                  {v.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Task 2: Note */}
      {task === 2 && content.note && (
        <div className="writing-instruction-card">
          <span className="writing-instruction-icon">📝</span>
          <p>{content.note}</p>
        </div>
      )}
    </div>
  )
}
