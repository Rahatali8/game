'use client'
import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { Announcement } from '@/types'

export default function AnnouncementPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/announcements').then((res) => {
      setAnnouncements(res.data.data as Announcement[])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <PageHeader title="Announcements" />
      <div className="px-4 mt-4 space-y-3">
        {loading ? (
          [1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)
        ) : announcements.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-3xl mb-2">📢</p>
            <p className="text-ink-muted text-sm">No announcements yet</p>
          </div>
        ) : (
          announcements.map((a) => (
            <div key={a.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
              <p className="font-extrabold text-sm text-ink mb-1">{a.title}</p>
              <p className="text-xs text-ink-soft leading-relaxed">{a.body}</p>
              <p className="text-[10px] text-ink-muted mt-2">{formatDate(a.created_at)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
