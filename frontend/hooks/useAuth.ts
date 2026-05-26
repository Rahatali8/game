'use client'
import { useAuthStore } from '@/store/authStore'
import { useEffect } from 'react'

export function useAuth() {
  const { user, isLoading, hydrate, logout } = useAuthStore()

  useEffect(() => {
    hydrate()
  }, [hydrate])

  return { user, isLoading, logout }
}
