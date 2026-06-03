import { useEffect } from "react"
import RealExam from "@/components/test/RealExamModal/RealExam"
import PracticeExam from "@/components/test/PracticeModal/PracticeExam"
import PracticeSkeleton from "@/components/test/PracticeSkeleton/PracticeSkeleton"
import { usePracticeTest } from "@/hooks/usePracticeTest"
import { usePracticeStore } from "@/services/practice/practice.store"

export default function PracticeTestPage({ mode: pageMode = "practice" }: { mode?: "practice" | "review" }) {
    const {
        test,
        currentUnit,
        isLoading,
        error,
        mode,
        isWriting,
        unitNumber,
    } = usePracticeTest()

    if (isLoading) return <PracticeSkeleton />

    if (error) return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", flexDirection: "column", gap: "16px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#dc2626" }}>Failed to load test</h2>
            <p style={{ color: "#6b7280" }}>{(error as Error).message}</p>
            <button onClick={() => window.location.reload()} style={{ padding: "8px 16px", backgroundColor: "#2563eb", color: "#ffffff", borderRadius: "8px", border: "none", cursor: "pointer" }}>
                Try Again
            </button>
        </div>
    )

    // For Writing, currentUnit is the content object itself (always present if test loaded)
    // For Reading/Listening, we need a specific unit
    if (!test) return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
            <p style={{ color: "#6b7280" }}>No data found for this test.</p>
        </div>
    )

    if (!isWriting && !currentUnit) return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
            <p style={{ color: "#6b7280" }}>No data found for this test.</p>
        </div>
    )

    const isReview = pageMode === "review"
    const taskNumber = (test as any).taskNumber as 1 | 2 | undefined
    const writingUnit = isWriting ? currentUnit : null

    return mode === "exam" ? (
        <RealExam
            test={test}
            unit={currentUnit}
            isReview={isReview}
            isWriting={isWriting}
            taskNumber={taskNumber}
            writingContent={writingUnit}
        />
    ) : (
        <PracticeExam
            test={test}
            unit={currentUnit}
            isReview={isReview}
            isWriting={isWriting}
            taskNumber={taskNumber}
            writingContent={writingUnit}
        />
    )
}

