import { useEffect, useRef, useState } from "react"
import QuestionPanel from "@/components/test/TestComponent/QuestionPanel"
import QuestionNavigator from "@/components/test/TestComponent/QuestionNavigator"
import ListeningPanel from "@/components/test/LayoutSkill/ListeningPanel"
import PracticeToolbar from "@/components/test/PracticeModal/PracticeToolbar"
import ReadingPanel from "@/components/test/LayoutSkill/ReadingPanel"
import { PracticeTestDTO, Passage, Section } from "@/types/practice.types"

import "./style.css"

type Props = {
  test: PracticeTestDTO
  unit: Passage | Section
}

export default function PracticeExam({
  test,
  unit
}: Props) {

    const isReading = !!test?.content?.passages
    const isListening = !!test?.content?.sections

    //divider
    const [leftWidth, setLeftWidth] = useState(60)
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

    // mobile
    const [isMobile, setIsMobile] = useState(false)
    const [activeTab, setActiveTab] = useState<"passage" | "question">("passage")

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768)
        check()
        window.addEventListener("resize", check)
        return () => window.removeEventListener("resize", check)
    }, [])


    // Toolbar state
    type ToolType = "highlight" | "note" | "dict"

    const [activeTool, setActiveTool] = useState<ToolType>("highlight")
    
    return (
        <div className="practice-container">

        {/* HEADER */}
        <div className="practice-header">
            <div>{test?.source || "Practice Mode"}</div>
            <div className="practice-badge">Practice</div>
        </div>

        {/* MAIN */}
        <div className="practice-main">
            <PracticeToolbar
                activeTool={activeTool}
                setActiveTool={setActiveTool}
            />

            {isMobile ? (
            <>
                {/* TAB */}
                <div className="practice-tabs">
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
                <div className="practice-mobile-content">
                {activeTab === "passage" ? (
                    isReading
                    ? <ReadingPanel passage={unit} activeTool={activeTool} />
                    : <ListeningPanel section={unit} activeTool={activeTool} />
                ) : (
                    <QuestionPanel
                    questionBlocks={unit?.question_blocks || []}
                    mode="practice"
                    />
                )}
                </div>
            </>
            ) : (
            <>
                {/* LEFT */}
                <div
                    className="practice-left"
                    style={{ width: `${leftWidth}%` }}
                >
                    {isReading && <ReadingPanel passage={unit}  activeTool={activeTool}/>}
                    {isListening && <ListeningPanel section={unit}  activeTool={activeTool} />}
                </div>

                {/* DIVIDER */}
                <div
                    className="practice-divider"
                    onMouseDown={handleMouseDown}
                />

                {/* RIGHT */}
                <div
                    className="practice-right"
                    style={{ width: `${100 - leftWidth}%` }}
                >
                <QuestionPanel
                    questionBlocks={unit?.question_blocks || []}
                    mode="practice"
                />
                </div>
            </>
            )}

        </div>

        {/* FOOTER */}
        <div className="practice-footer">
            <QuestionNavigator
            questionBlocks={unit?.question_blocks || []}
            />
        </div>

        </div>
    )
}