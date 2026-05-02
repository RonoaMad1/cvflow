import { create } from "zustand"
import type { User } from "../types"
import { authAPI } from "../services/api"

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, username: string) => Promise<void>
  logout: () => void
  loadUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("token"),
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true })
    const res = await authAPI.login({ email, password })
    localStorage.setItem("token", res.data.token)
    set({ user: res.data.user, token: res.data.token, isLoading: false })
  },

  register: async (email, password, username) => {
    set({ isLoading: true })
    const res = await authAPI.register({ email, password, username })
    localStorage.setItem("token", res.data.token)
    set({ user: res.data.user, token: res.data.token, isLoading: false })
  },

  logout: () => {
    localStorage.removeItem("token")
    set({ user: null, token: null })
  },

  loadUser: async () => {
    const token = localStorage.getItem("token")
    if (!token) return
    try {
      const res = await authAPI.me()
      set({ user: res.data })
    } catch {
      localStorage.removeItem("token")
      set({ user: null, token: null })
    }
  },
}))
