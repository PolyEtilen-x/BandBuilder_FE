import PassagePanel from "@/components/test/LayoutSkill/ReadingPanel"
import QuestionPanel from "@/components/test/TestComponent/QuestionPanel"
import QuestionNavigator from "@/components/test/TestComponent/QuestionNavigator"
import ListeningPanel from "@/components/test/LayoutSkill/ListeningPanel"
import Timer from "@/components/components/Timer"

import { useState, useRef, useEffect } from "react"

import "./style.css"
type Props = {
    test: any
    unit: any
    answers: Record<string, string>
    updateAnswer: (id: string, value: string) => void
}

export default function RealExam({
    test,
    unit,
    answers,
    updateAnswer,
}: Props) {
    const isReading = !!test?.content?.passages
    const isListening = !!test?.content?.sections
    
    const [activeTab, setActiveTab] = useState<"passage" | "question">("passage")
    const [leftWidth, setLeftWidth] = useState(60) 
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
    }

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("mouseup", handleMouseUp)

        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("mouseup", handleMouseUp)
        }
    }, [])

    const duration = (unit?.time_suggested_minutes || 60) * 60

    return (
        <div className="exam-container">

        {/* HEADER */}
        <div className="exam-header">
            <div className="exam-title">
            {test?.source || "IELTS Test"}
            </div>

            <Timer 
                duration={duration} 
                onTimeUp={() => {
                alert("Time is up!")
                }}            
            />
        </div>

        {/* MAIN */}
        <div className="exam-main">
            {isMobile ? (
                <>
                {/* TAB BAR */}
                <div className="exam-tabs">
                    <button
                        className={activeTab === "passage" ? "active" : ""}
                        onClick={() => setActiveTab("passage")}
                    >
                     Passage
                    </button>

                    <button
                        className={activeTab === "question" ? "active" : ""}
                        onClick={() => setActiveTab("question")}
                    >
                        Questions
                    </button>
                </div>

                {/* CONTENT */}
                <div className="exam-mobile-content">
                    {activeTab === "passage" ? (
                    isReading
                        ? <PassagePanel passage={unit} />
                        : <ListeningPanel section={unit} />
                    ) : (
                    <QuestionPanel
                        questionBlocks={unit?.question_blocks || []}
                        answers={answers}
                        updateAnswer={updateAnswer}
                    />
                    )}
                </div>
                </>
            ) : (
                <>
                {/* DESKTOP SPLIT */}
                <div
                    className="exam-left"
                    style={{ width: `${leftWidth}%` }}
                >
                    {isReading && <PassagePanel passage={unit} />}
                    {isListening && <ListeningPanel section={unit} />}
                </div>

                <div
                    className="exam-divider"
                    onMouseDown={handleMouseDown}
                />

                <div
                    className="exam-right"
                    style={{ width: `${100 - leftWidth}%` }}
                >
                    <QuestionPanel
                    questionBlocks={unit?.question_blocks || []}
                    answers={answers}
                    updateAnswer={updateAnswer}
                    />
                </div>
                </>
            )}
        </div>

        {/* FOOTER */}
        <div className="exam-footer">
            <QuestionNavigator
            questionBlocks={unit?.question_blocks || []}
            answers={answers}
            />
        </div>

        </div>
    )
  
}