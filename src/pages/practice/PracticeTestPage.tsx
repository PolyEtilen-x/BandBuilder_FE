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
        mode
    } = usePracticeTest()

    if (isLoading) return <PracticeSkeleton />

    if (error) return (
        <div className="flex items-center justify-center h-screen flex-col gap-4">
            <h2 className="text-xl font-semibold text-red-600">Failed to load test</h2>
            <p className="text-gray-500">{(error as Error).message}</p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                Try Again
            </button>
        </div>
    )

    if (!test || !currentUnit) return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-gray-500">No data found for this test.</p>
        </div>
    )

    const isReview = pageMode === "review"

    return mode === "exam" ? (
        <RealExam
            test={test}
            unit={currentUnit}
            isReview={isReview}
        />
    ) : (
        <PracticeExam
            test={test}
            unit={currentUnit}
            isReview={isReview}
        />
    )
}

