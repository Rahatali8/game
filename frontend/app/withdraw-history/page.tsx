'use client'
import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Withdrawal } from '@/types'

export default function WithdrawHistoryPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/withdrawals/history').then((res) => {
      setWithdrawals(res.data.data as Withdrawal[])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const statusColor: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-600',
  }

  return (
    <div>
      <PageHeader title="Withdrawal History" />
      <div className="px-4 mt-4 space-y-3">
        {loading ? (
          [1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-2xl" />)
        ) : withdrawals.length === 0 ? (
          <p className="text-center text-ink-muted text-sm py-8">No withdrawal history yet</p>
        ) : (
          withdrawals.map((w) => (
            <div key={w.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <p className="font-extrabold text-ink">{formatCurrency(w.amount)}</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-lg capitalize ${statusColor[w.status]}`}>{w.status}</span>
              </div>
              <p className="text-xs text-ink-muted">{w.method} · {formatDate(w.requested_at)}</p>
              <p className="text-xs text-ink-muted">Net: {formatCurrency(w.net_amount)} (Fee: {formatCurrency(w.fee)})</p>
              {w.admin_note && <p className="text-xs text-ink-soft mt-1">{w.admin_note}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
