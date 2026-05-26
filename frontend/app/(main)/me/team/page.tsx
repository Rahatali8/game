'use client'
import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Skeleton } from '@/components/ui/skeleton'
import { useTeam } from '@/hooks/useTeam'
import { api } from '@/lib/api'
import type { User } from '@/types'

export default function TeamPage() {
  const { stats, loading: statsLoading } = useTeam()
  const [activeLevel, setActiveLevel] = useState(1)
  const [members, setMembers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    api.get(`/team/level/${activeLevel}`).then((res) => {
      setMembers(res.data.data as User[])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [activeLevel])

  return (
    <div>
      <PageHeader title="My Team" />
      <div className="px-4 mt-4 space-y-4">
        {/* Stats */}
        <div className="rounded-2xl p-4 text-white"
          style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e3a8a 100%)' }}>
          <h3 className="text-white/70 text-xs mb-3">Team Overview</h3>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Level 1', value: stats?.level1_count ?? 0 },
              { label: 'Level 2', value: stats?.level2_count ?? 0 },
              { label: 'Level 3', value: stats?.level3_count ?? 0 },
              { label: 'Total', value: stats?.total ?? 0 },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-white font-extrabold text-xl">{value}</p>
                <p className="text-white/60 text-[10px]">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-white/60 text-xs">Weekly Bonus Tier</p>
            <p className="text-white font-bold text-sm">{stats?.weekly_bonus_tier ?? 'New Partner'}</p>
          </div>
        </div>

        {/* Level tabs */}
        <div className="flex gap-2">
          {[1, 2, 3].map((level) => (
            <button key={level} onClick={() => setActiveLevel(level)}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                activeLevel === level ? 'bg-brand-600 text-white' : 'bg-white text-ink-soft border border-slate-200'
              }`}>
              Level {level}
            </button>
          ))}
        </div>

        {/* Members list */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
            </div>
          ) : members.length === 0 ? (
            <p className="text-center text-ink-muted text-sm py-8">No members at this level</p>
          ) : (
            members.map((m, i) => (
              <div key={m.id} className={`flex items-center gap-3 px-4 py-3 ${i < members.length - 1 ? 'border-b border-slate-50' : ''}`}>
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                  <span className="font-extrabold text-brand-600">{m.name?.[0]?.toUpperCase() ?? 'U'}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-ink">{m.name ?? 'User'}</p>
                  <p className="text-xs text-ink-muted">{m.mobile} · Joined {new Date(m.created_at).toLocaleDateString()}</p>
                </div>
                {m.is_premium && (
                  <span className="text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-lg">PREMIUM</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
