import { useState } from "react"

type Props = {
    open: boolean
    onClose: () => void
    onStart: (mode: "practice" | "exam") => void
}

export default function ModeSelectModal({ open, onClose, onStart }: Props) {
    const [selectedMode, setSelectedMode] = useState<"practice" | "exam">("practice")

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl p-6 w-[700px] relative">
                {/* Close */}
                <button
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-500"
                >
                ✕
                </button>

                <h2 className="text-xl font-semibold mb-4">
                Choose Practice Mode
                </h2>

                <div className="flex gap-4">
                {/* Real Exam */}
                <div
                    onClick={() => setSelectedMode("exam")}
                    className={`flex-1 border-2 rounded-xl p-4 cursor-pointer ${
                    selectedMode === "exam"
                        ? "border-green-500"
                        : "border-gray-200"
                    }`}
                >
                    <div className="h-32 bg-gray-100 mb-3 rounded"></div>
                    <h3 className="font-semibold">Real Exam Mode</h3>
                    <p className="text-sm text-gray-500">
                    100% simulation of the actual exam interface
                    </p>
                </div>

                {/* Practice */}
                <div
                    onClick={() => setSelectedMode("practice")}
                    className={`flex-1 border-2 rounded-xl p-4 cursor-pointer ${
                    selectedMode === "practice"
                        ? "border-green-500"
                        : "border-gray-200"
                    }`}
                >
                    <div className="h-32 bg-gray-100 mb-3 rounded"></div>
                    <h3 className="font-semibold">Practice Mode</h3>
                    <p className="text-sm text-gray-500">
                    Support, Explanation & Dictionary
                    </p>
                </div>
                </div>

                <button
                onClick={() => onStart(selectedMode)}
                className="mt-6 w-full bg-orange-500 text-white py-2 rounded-xl"
                >
                Get started
                </button>
            </div>
        </div>
    )
}