'use client'
import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { LoginHistory } from '@/types'

export default function LoginHistoryPage() {
  const [history, setHistory] = useState<LoginHistory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/users/login-history').then((res) => {
      setHistory(res.data.data as LoginHistory[])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <PageHeader title="Login History" />
      <div className="px-4 mt-4 space-y-3">
        {loading ? (
          [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)
        ) : history.length === 0 ? (
          <p className="text-center text-ink-muted text-sm py-8">No login history</p>
        ) : (
          history.map((h) => (
            <div key={h.id} className={`bg-white rounded-2xl p-4 border shadow-sm ${h.is_current ? 'border-brand-300 bg-brand-50' : 'border-slate-100'}`}>
              {h.is_current && (
                <span className="inline-block bg-brand-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-2">CURRENT SESSION</span>
              )}
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div>
                  <span className="text-ink-muted">Device: </span>
                  <span className="text-ink font-medium">{h.device_type}</span>
                </div>
                <div>
                  <span className="text-ink-muted">OS: </span>
                  <span className="text-ink font-medium">{h.os_name}</span>
                </div>
                <div>
                  <span className="text-ink-muted">Browser: </span>
                  <span className="text-ink font-medium">{h.browser_name}</span>
                </div>
                <div>
                  <span className="text-ink-muted">IP: </span>
                  <span className="text-ink font-medium">{h.ip_address}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-ink-muted">Location: </span>
                  <span className="text-ink font-medium">{h.ip_location || 'Unknown'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-ink-muted">Time: </span>
                  <span className="text-ink font-medium">{formatDate(h.login_time)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
