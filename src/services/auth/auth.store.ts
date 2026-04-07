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

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  fetchUser: async () => {
    set({ isLoading: true })

    const user = await getCurrentUser()

    set({
      user,
      isAuthenticated: !!user,
      isLoading: false
    })
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false
    })

    window.location.href = "/login"
  }
}))