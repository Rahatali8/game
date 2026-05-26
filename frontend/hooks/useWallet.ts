'use client'
import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import type { DashboardData } from '@/types'

export function useWallet() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    try {
      const res = await api.get('/wallet/dashboard')
      setData(res.data.data as DashboardData)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { data, loading, refetch: fetch }
}
