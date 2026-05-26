'use client'
import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import type { UserMiner } from '@/types'

export function useMiners() {
  const [miners, setMiners] = useState<UserMiner[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    try {
      const res = await api.get('/miners')
      setMiners(res.data.data as UserMiner[])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const claim = async (minerId: number) => {
    await api.post(`/miners/${minerId}/claim`)
    await fetch()
  }

  const claimAll = async () => {
    await api.post('/miners/claim-all')
    await fetch()
  }

  return { miners, loading, refetch: fetch, claim, claimAll }
}
