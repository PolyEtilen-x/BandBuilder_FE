import { create } from "zustand"
import { getCurrentUser } from "./auth.service"
import { apiClient } from "@/api/apiClient.api"

type User = {
    userId: string
    email: string
    avatarUrl?: string
    fullName?: string
    name?: string
}

type AuthState = {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean

    initAuth: () => Promise<void>
    setUser: (user: User | null) => void
    logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: true,
    isAuthenticated: false,

    initAuth: async () => {
        set({ isLoading: true })

        try {
            const user = await getCurrentUser()

            if (user) {
                localStorage.setItem("bandbuilder-logged-in", "true")
            } else {
                localStorage.removeItem("bandbuilder-logged-in")
            }

            set({
                user,
                isAuthenticated: !!user,
                isLoading: false
            })
        } catch {
            localStorage.removeItem("bandbuilder-logged-in")
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false
            })
        }
    },

    setUser: (user) => {
        if (user) {
            localStorage.setItem("bandbuilder-logged-in", "true")
        } else {
            localStorage.removeItem("bandbuilder-logged-in")
        }
        set({
            user,
            isAuthenticated: !!user
        })
    },

    logout: async () => {
        try {
            await apiClient.post("/auth/logout")
        } catch (e) {
            console.log("logout error:", e)
        } finally {
            localStorage.removeItem("bandbuilder-logged-in")
            set({ user: null, isAuthenticated: false })
            window.location.href = "/"
        }
    }
}))