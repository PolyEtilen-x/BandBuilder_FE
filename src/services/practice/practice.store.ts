import { create } from "zustand"
import { SidebarState } from "@/components/practice/PracticeSidebar"

interface PracticeStore {
    sidebar: SidebarState
    setSidebar: (state: Partial<SidebarState>) => void
    resetSidebar: () => void
}

export const usePracticeStore = create<PracticeStore>((set) => ({
    sidebar: {
        skill: "listening",
        mode: "single",
        subSection: 1,
    },
    setSidebar: (newState) =>
        set((state) => ({
            sidebar: { ...state.sidebar, ...newState }
        })),
    resetSidebar: () =>
        set({ sidebar: { skill: "listening", mode: "single", subSection: 1 } })
}))
