import { create } from "zustand"
import { persist } from "zustand/middleware"
import { SidebarState } from "@/components/practice/PracticeSidebar"

interface PracticeStore {
    sidebar: SidebarState
    answers: Record<string, any>
    
    setSidebar: (state: Partial<SidebarState>) => void
    resetSidebar: () => void
    
    setAnswer: (id: string, value: any) => void
    clearAnswers: () => void

    startTime: number | null
    setStartTime: (time: number | null) => void
}

export const usePracticeStore = create<PracticeStore>()(
    persist(
        (set) => ({
            sidebar: {
                skill: "listening",
                mode: "single",
                subSection: 1,
            },
            answers: {},

            setSidebar: (newState) =>
                set((state) => ({
                    sidebar: { ...state.sidebar, ...newState }
                })),

            resetSidebar: () =>
                set({ sidebar: { skill: "listening", mode: "single", subSection: 1 } }),

            setAnswer: (id, value) => 
                set((state) => ({
                    answers: { ...state.answers, [id]: value }
                })),

            clearAnswers: () => set({ answers: {} }),

            startTime: null,
            setStartTime: (time) => set({ startTime: time })
        }),
        {
            name: "practice-storage", 
        }
    )
)
