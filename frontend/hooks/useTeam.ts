'use client'
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import type { TeamStats } from '@/types'

export function useTeam() {
  const [stats, setStats] = useState<TeamStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/team/stats').then((res) => {
      setStats(res.data.data as TeamStats)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return { stats, loading }
}
