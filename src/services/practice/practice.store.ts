import { create } from "zustand"
import { SidebarState } from "@/components/practice/PracticeSidebar"

interface PracticeStore {
    sidebar: SidebarState
    answers: Record<string, string>
    
    setSidebar: (state: Partial<SidebarState>) => void
    resetSidebar: () => void
    
    setAnswer: (id: string, value: string) => void
    clearAnswers: () => void
}

export const usePracticeStore = create<PracticeStore>((set) => ({
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

    clearAnswers: () => set({ answers: {} })
}))
