import { create } from "zustand"
import { getCurrentUser } from "./auth.service"

type User = {
  id: string
  email: string
  name?: string
}

type AuthState = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  fetchUser: () => Promise<void>
  logout: () => void
}
let hasFetched = false

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: false,
    isAuthenticated: false,

    fetchUser: async () => {
        // Only fetch once on app load, then rely on isAuthenticated + user state for the rest of the app
        if (hasFetched) return

        hasFetched = true
        set({ isLoading: true })

        try {
        const user = await getCurrentUser()

        set({
            user,
            isAuthenticated: !!user,
            isLoading: false
        })
        } catch {
        set({ isLoading: false })
        }
    },

    logout: () => {
        hasFetched = false
        set({
        user: null,
        isAuthenticated: false
        })
    }
}))