import { useEffect, useRef, useState } from "react"
import QuestionPanel from "@/components/test/TestComponent/QuestionPanel"
import QuestionNavigator from "@/components/test/TestComponent/QuestionNavigator"
import ListeningPanel from "@/components/test/LayoutSkill/ListeningPanel"
import PracticeToolbar from "@/components/test/PracticeModal/PracticeToolbar"
import ReadingPanel from "@/components/test/LayoutSkill/ReadingPanel"
import WritingPanel from "@/components/test/LayoutSkill/WritingPanel"
import WritingEditor from "@/components/test/LayoutSkill/WritingEditor"
import { PracticeTestDTO, Passage, Section, WritingTask } from "@/data/practices/practice.types"

import "./style.css"

type Props = {
  test: PracticeTestDTO
  unit: Passage | Section | null
  isReview?: boolean
  isWriting?: boolean
  taskNumber?: 1 | 2
  writingContent?: WritingTask | null
}

export default function PracticeExam({
  test,
  unit,
  isReview = false,
  isWriting = false,
  taskNumber,
  writingContent,
}: Props) {

  const isReading = !!test?.content?.passages
  const isListening = !!test?.content?.sections

  // Divider logic
  const [leftWidth, setLeftWidth] = useState(isWriting ? 50 : 60)
  const isDragging = useRef(false)

  const handleMouseDown = () => {
    isDragging.current = true
    document.body.style.userSelect = "none"
    document.body.style.cursor = "col-resize"
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return
    const newWidth = (e.clientX / window.innerWidth) * 100
    if (newWidth > 20 && newWidth < 80) {
      setLeftWidth(newWidth)
    }
  }

  const handleMouseUp = () => {
    isDragging.current = false
    document.body.style.userSelect = "auto"
    document.body.style.cursor = "default"
  }

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  // Mobile state
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState<"passage" | "question">("passage")

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  // Toolbar state (not shown for writing)
  type ToolType = "highlight" | "note" | "dict"
  const [activeTool, setActiveTool] = useState<ToolType>("highlight")

  return (
    <div className="practice-container">
      {/* HEADER */}
      <div className="practice-header">
        <div>{test?.source || "Practice Mode"} {isReview && "(Reviewing)"}</div>
        <div className="practice-badge">{isReview ? "Review" : "Practice"}</div>
      </div>

      {/* MAIN */}
      <div className="practice-main">
        {!isWriting && (
          <PracticeToolbar
            activeTool={activeTool}
            setActiveTool={setActiveTool}
          />
        )}

        {isMobile ? (
          <>
            <div className="practice-tabs">
              <button className={activeTab === "passage" ? "active" : ""} onClick={() => setActiveTab("passage")}>
                {isWriting ? "Prompt" : "Passage"}
              </button>
              <button className={activeTab === "question" ? "active" : ""} onClick={() => setActiveTab("question")}>
                {isWriting ? "Write" : "Questions"}
              </button>
            </div>

            <div className="practice-mobile-content">
              {activeTab === "passage" ? (
                isWriting && writingContent ? (
                  <WritingPanel content={writingContent} taskNumber={taskNumber} />
                ) : isReading ? (
                  <ReadingPanel passage={unit as Passage} activeTool={activeTool} />
                ) : (
                  <ListeningPanel section={unit as Section} activeTool={activeTool} />
                )
              ) : (
                isWriting && writingContent ? (
                  <WritingEditor content={writingContent} taskNumber={taskNumber} />
                ) : (
                  <QuestionPanel questionBlocks={(unit as any)?.question_blocks || []} isReview={isReview} />
                )
              )}
            </div>
          </>
        ) : (
          <>
            <div className="practice-left" style={{ width: `${leftWidth}%` }}>
              {isWriting && writingContent && <WritingPanel content={writingContent} taskNumber={taskNumber} />}
              {!isWriting && isReading && unit && <ReadingPanel passage={unit as Passage} activeTool={activeTool} />}
              {!isWriting && isListening && unit && <ListeningPanel section={unit as Section} activeTool={activeTool} />}
            </div>

            <div className="practice-divider" onMouseDown={handleMouseDown} />

            <div className="practice-right" style={{ width: `${100 - leftWidth}%` }}>
              {isWriting && writingContent ? (
                <WritingEditor content={writingContent} taskNumber={taskNumber} />
              ) : (
                <QuestionPanel questionBlocks={(unit as any)?.question_blocks || []} isReview={isReview} />
              )}
            </div>
          </>
        )}
      </div>

      {/* FOOTER */}
      <div className="practice-footer">
        <QuestionNavigator
          questionBlocks={isWriting ? [] : ((unit as any)?.question_blocks || [])}
          examId={test?.id}
          currentUnit={unit}
          isWriting={isWriting}
          taskNumber={taskNumber}
        />
      </div>
    </div>
  )
}