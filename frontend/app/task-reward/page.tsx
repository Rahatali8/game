'use client'
import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

export default function TaskRewardPage() {
  const [status, setStatus] = useState<{ can_claim: boolean; claimed_today: boolean } | null>(null)
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/tasks/claim-daily').then((res) => {
      setStatus(res.data.data as { can_claim: boolean; claimed_today: boolean })
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleClaim = async () => {
    setClaiming(true)
    setError('')
    try {
      await api.post('/tasks/claim-daily')
      setSuccess(true)
      setStatus({ can_claim: false, claimed_today: true })
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Already claimed today')
    } finally {
      setClaiming(false)
    }
  }

  return (
    <div>
      <PageHeader title="Task Reward" />
      <div className="px-4 mt-6 flex flex-col items-center gap-6">
        <div className="text-6xl">📅</div>
        <div className="text-center">
          <h2 className="text-xl font-extrabold text-ink">Daily Sign-In Bonus</h2>
          <p className="text-ink-soft text-sm mt-1">Claim $0.10 every 24 hours just for signing in!</p>
        </div>

        <div className="w-full max-w-sm bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center">
          <p className="text-ink-muted text-xs mb-2">Daily Reward</p>
          <p className="text-4xl font-extrabold text-brand-600 mb-4">$0.10</p>
          {loading ? (
            <div className="h-11 bg-slate-100 rounded-xl animate-pulse" />
          ) : success || status?.claimed_today ? (
            <div className="bg-green-50 border border-green-200 rounded-xl py-3 text-success text-sm font-bold">
              ✅ Claimed Today!
            </div>
          ) : (
            <>
              {error && <p className="text-danger text-xs mb-2">{error}</p>}
              <Button onClick={handleClaim} loading={claiming} className="w-full" size="lg">
                Claim Daily Reward
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
