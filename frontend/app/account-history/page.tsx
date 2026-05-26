'use client'
import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Deposit } from '@/types'

export default function AccountHistoryPage() {
  const [deposits, setDeposits] = useState<Deposit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/deposits/history').then((res) => {
      setDeposits(res.data.data as Deposit[])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const statusColor: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-600',
  }

  return (
    <div>
      <PageHeader title="Account History" />
      <div className="px-4 mt-4 space-y-3">
        {loading ? (
          [1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-2xl" />)
        ) : deposits.length === 0 ? (
          <p className="text-center text-ink-muted text-sm py-8">No deposit history yet</p>
        ) : (
          deposits.map((d) => (
            <div key={d.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <p className="font-extrabold text-ink">{formatCurrency(d.amount)}</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-lg capitalize ${statusColor[d.status]}`}>{d.status}</span>
              </div>
              <p className="text-xs text-ink-muted">{d.method} · {formatDate(d.created_at)}</p>
              {d.txn_id && <p className="text-xs text-ink-muted mt-0.5">TXN: {d.txn_id}</p>}
              {d.admin_note && <p className="text-xs text-ink-soft mt-1">{d.admin_note}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
