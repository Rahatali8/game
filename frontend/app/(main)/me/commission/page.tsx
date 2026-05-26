'use client'
import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Commission, CommissionTotals } from '@/types'

export default function CommissionPage() {
  const [totals, setTotals] = useState<CommissionTotals | null>(null)
  const [history, setHistory] = useState<Commission[]>([])
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)

  useEffect(() => {
    Promise.all([
      api.get('/commissions/totals'),
      api.get('/commissions/history?limit=30'),
    ]).then(([t, h]) => {
      setTotals(t.data.data as CommissionTotals)
      setHistory(h.data.data as Commission[])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleClaim = async () => {
    setClaiming(true)
    try {
      await api.post('/commissions/claim')
      const res = await api.get('/commissions/totals')
      setTotals(res.data.data as CommissionTotals)
    } catch {
      // ignore
    } finally {
      setClaiming(false)
    }
  }

  return (
    <div>
      <PageHeader title="Commission History" />
      <div className="px-4 mt-4 space-y-4">
        {/* Totals */}
        {loading ? (
          <Skeleton className="h-32 w-full rounded-2xl" />
        ) : (
          <div className="rounded-2xl p-4 text-white"
            style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)' }}>
            <p className="text-white/70 text-xs mb-1">Total Commission Earned</p>
            <p className="text-2xl font-extrabold mb-4">{formatCurrency(totals?.total ?? 0)}</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { label: 'Level 1 (10%)', value: totals?.level1 ?? 0 },
                { label: 'Level 2 (4%)', value: totals?.level2 ?? 0 },
                { label: 'Level 3 (2%)', value: totals?.level3 ?? 0 },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white/10 rounded-xl p-2 text-center">
                  <p className="text-white font-extrabold text-sm">{formatCurrency(value)}</p>
                  <p className="text-white/60 text-[10px]">{label}</p>
                </div>
              ))}
            </div>
            <Button onClick={handleClaim} loading={claiming}
              className="w-full" style={{ background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.3)', color: '#fff' }}>
              Claim All Commission
            </Button>
          </div>
        )}

        {/* History */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <h3 className="font-extrabold text-sm text-ink">Recent Transactions</h3>
          </div>
          {loading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 rounded-xl" />)}
            </div>
          ) : history.length === 0 ? (
            <p className="text-center text-ink-muted text-sm py-8">No commission history yet</p>
          ) : (
            history.map((c) => (
              <div key={c.id} className="flex items-center justify-between px-4 py-3 border-b border-slate-50 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-ink">From {c.from_user_name}</p>
                  <p className="text-xs text-ink-muted">Level {c.level} · {c.miner_name} · {formatDate(c.created_at)}</p>
                </div>
                <p className="font-extrabold text-success text-sm">+{formatCurrency(c.commission_amount)}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
