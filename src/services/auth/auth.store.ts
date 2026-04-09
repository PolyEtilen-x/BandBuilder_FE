import { create } from "zustand"
import { getCurrentUser } from "./auth.service"

type User = {
    userId: string
    email: string
}

type AuthState = {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean

    initAuth: () => Promise<void>
    setUser: (user: User | null) => void
}

let initialized = false

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: false,
    isAuthenticated: false,

    initAuth: async () => {
        // block spam API
        if (initialized) return
        initialized = true

        set({ isLoading: true })

        try {
        const user = await getCurrentUser()

        set({
            user,
            isAuthenticated: !!user,
            isLoading: false
        })
        } catch {
        set({
            user: null,
            isAuthenticated: false,
            isLoading: false
        })
        }
    },

    setUser: (user) => {
        set({
        user,
        isAuthenticated: !!user
        })
    }
}))