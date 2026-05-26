import { create } from 'zustand'
import type { User } from '@/types'
import { getStoredUser, setStoredUser, setToken, removeToken } from '@/lib/auth'

interface AuthState {
  user: User | null
  isLoading: boolean
  setUser: (user: User) => void
  setToken: (token: string) => void
  login: (token: string, user: User) => void
  logout: () => void
  hydrate: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  setUser: (user) => {
    setStoredUser(user)
    set({ user })
  },

  setToken: (token) => {
    setToken(token)
  },

  login: (token, user) => {
    setToken(token)
    setStoredUser(user)
    set({ user })
  },

  logout: () => {
    removeToken()
    set({ user: null })
    if (typeof window !== 'undefined') window.location.href = '/login'
  },

  hydrate: () => {
    const user = getStoredUser()
    set({ user, isLoading: false })
  },
}))
