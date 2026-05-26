'use client'
import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import type { User } from '@/types'

export function useUser() {
  const { user, setUser } = useAuthStore()
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/users/profile')
      const u = res.data.data as User
      setUser(u)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [setUser])

  return { user, loading, refresh }
}
