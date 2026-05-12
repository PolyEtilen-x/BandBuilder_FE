import { useCallback, useState } from "react"
import RealExam from "@/components/test/RealExamModal/RealExam"
import PracticeExam from "@/components/test/PracticeModal/PracticeExam"
import PracticeSkeleton from "@/components/test/PracticeSkeleton/PracticeSkeleton"
import { usePracticeTest } from "@/hooks/usePracticeTest"

export default function PracticeTestPage() {
    const {
        test,
        currentUnit,
        isLoading,
        error,
        mode
    } = usePracticeTest()

    const [answers, setAnswers] = useState<Record<string, string>>({})

    const updateAnswer = useCallback((id: string, value: string) => {
        setAnswers(prev => ({
            ...prev,
            [id]: value
        }))
    }, [])

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

    return mode === "exam" ? (
        <RealExam
            test={test}
            unit={currentUnit}
            answers={answers}
            updateAnswer={updateAnswer}
        />
    ) : (
        <PracticeExam
            test={test}
            unit={currentUnit}
            answers={answers}
            updateAnswer={updateAnswer}
        />
    )
}
