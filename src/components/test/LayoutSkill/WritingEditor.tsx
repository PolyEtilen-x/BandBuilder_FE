import "./WritingPanel.css"
import { usePracticeStore } from "@/services/practice/practice.store"
import { WritingTask } from "@/data/practices/practice.types"

interface WritingEditorProps {
  content: WritingTask
  taskNumber?: 1 | 2
}

export default function WritingEditor({ content, taskNumber }: WritingEditorProps) {
  const { answers, setAnswer } = usePracticeStore()
  const task = taskNumber ?? content.task ?? 1
  const minWords = content.min_words ?? (task === 1 ? 150 : 250)

  // Essay is stored by key "task1" or "task2"
  const storageKey = `task${task}` as "task1" | "task2"
  const essay: string = (answers[storageKey] as string) ?? ""

  const wordCount = essay.trim() === "" ? 0 : essay.trim().split(/\s+/).length
  const isUnderMin = wordCount < minWords
  const isWarn = wordCount > 0 && isUnderMin

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswer(storageKey, e.target.value)
  }

  return (
    <div className="writing-editor-wrapper">
      <div className="writing-editor-header">
        <h3>Your Essay — Task {task}</h3>
        <div className={`writing-word-counter${isWarn ? " warn" : ""}`}>
          <span className="count-current">{wordCount}</span>
          <span className="count-separator">/</span>
          <span className="count-min">{minWords} min</span>
          <span style={{ color: "#94a3b8", fontWeight: 400 }}>words</span>
        </div>
      </div>

      <textarea
        className="writing-textarea"
        value={essay}
        onChange={handleChange}
        placeholder="Begin writing your response here…"
        spellCheck={true}
        aria-label={`Writing Task ${task} essay`}
      />

      {/* Status row */}
      {wordCount === 0 && (
        <div className="writing-min-warning">
          ⚠️ You need at least <strong>{minWords} words</strong> to submit this task.
        </div>
      )}
      {wordCount > 0 && isUnderMin && (
        <div className="writing-min-warning">
          ⚠️ {wordCount} words written — need at least <strong>{minWords}</strong> ({minWords - wordCount} more to go).
        </div>
      )}
      {wordCount >= minWords && (
        <div className="writing-min-ok">
          ✅ Word count met ({wordCount} / {minWords}+). You may submit when ready.
        </div>
      )}
    </div>
  )
}
