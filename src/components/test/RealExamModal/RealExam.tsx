import PassagePanel from "@/components/test/LayoutSkill/ReadingPanel"
import QuestionPanel from "@/components/test/TestComponent/QuestionPanel"
import QuestionNavigator from "@/components/test/TestComponent/QuestionNavigator"
import ListeningPanel from "@/components/test/LayoutSkill/ListeningPanel"
import WritingPanel from "@/components/test/LayoutSkill/WritingPanel"
import WritingEditor from "@/components/test/LayoutSkill/WritingEditor"
import Timer from "@/components/components/Timer"
import { PracticeTestDTO, Passage, Section, WritingTask } from "@/data/practices/practice.types"

import { useState, useRef, useEffect } from "react"

import "./style.css"
type Props = {
    test: PracticeTestDTO
    unit: Passage | Section | null
    isReview?: boolean
    isWriting?: boolean
    taskNumber?: 1 | 2
    writingContent?: WritingTask | null
}

export default function RealExam({
    test,
    unit,
    isReview = false,
    isWriting = false,
    taskNumber,
    writingContent,
}: Props) {
    const isReading = !!test?.content?.passages
    const isListening = !!test?.content?.sections

    const [activeTab, setActiveTab] = useState<"passage" | "question">("passage")
    const [leftWidth, setLeftWidth] = useState(isWriting ? 50 : 60)
    const isDragging = useRef(false)

    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768)
        check()
        window.addEventListener("resize", check)
        return () => window.removeEventListener("resize", check)
    }, [])

    const handleMouseDown = () => {
        isDragging.current = true
        document.body.style.userSelect = "none"
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
    }

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("mouseup", handleMouseUp)
        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("mouseup", handleMouseUp)
        }
    }, [])

    // Duration: for writing use task-specific time, for others use unit time
    const writingMinutes = taskNumber === 2 ? 40 : 20
    const duration = isWriting
        ? (writingContent?.time_minutes ?? writingMinutes) * 60
        : ((unit as any)?.time_suggested_minutes || 60) * 60

    return (
        <div className="exam-container">

            {/* HEADER */}
            <div className="exam-header">
                <div className="exam-title">
                    {test?.source || "IELTS Test"} {isReview && "(Reviewing)"}
                </div>

                {!isReview && (
                    <Timer
                        duration={duration}
                        onTimeUp={() => {
                            alert("Time is up!")
                        }}
                    />
                )}
                {isReview && <div className="practice-badge" style={{ background: "#174593", color: "#fff", padding: "4px 12px", borderRadius: "6px", fontWeight: 700 }}>Review Mode</div>}
            </div>

            {/* MAIN */}
            <div className="exam-main">
                {isMobile ? (
                    <>
                        {/* TAB BAR */}
                        <div className="exam-tabs">
                            <button className={activeTab === "passage" ? "active" : ""} onClick={() => setActiveTab("passage")}>
                                {isWriting ? "Prompt" : "Passage"}
                            </button>
                            <button className={activeTab === "question" ? "active" : ""} onClick={() => setActiveTab("question")}>
                                {isWriting ? "Write" : "Questions"}
                            </button>
                        </div>

                        <div className="exam-mobile-content">
                            {activeTab === "passage" ? (
                                isWriting && writingContent ? (
                                    <WritingPanel content={writingContent} taskNumber={taskNumber} />
                                ) : isReading ? (
                                    <PassagePanel passage={unit as Passage} />
                                ) : (
                                    <ListeningPanel section={unit as Section} />
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
                        {/* DESKTOP SPLIT */}
                        <div className="exam-left" style={{ width: `${leftWidth}%` }}>
                            {isWriting && writingContent && <WritingPanel content={writingContent} taskNumber={taskNumber} />}
                            {!isWriting && isReading && unit && <PassagePanel passage={unit as Passage} />}
                            {!isWriting && isListening && unit && <ListeningPanel section={unit as Section} />}
                        </div>

                        <div className="exam-divider" onMouseDown={handleMouseDown} />

                        <div className="exam-right" style={{ width: `${100 - leftWidth}%` }}>
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
            <div className="exam-footer">
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

