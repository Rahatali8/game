'use client'
import Link from 'next/link'
import { ArrowDownCircle, ArrowUpCircle, History, Clock } from 'lucide-react'
import { useWallet } from '@/hooks/useWallet'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/utils'

export default function AssetPage() {
  const { data, loading } = useWallet()
  const w = data?.wallet

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-slate-100 sticky top-0 z-10">
        <h1 className="text-lg font-extrabold text-brand-700" style={{ borderLeft: '4px solid #2563eb', paddingLeft: 12 }}>
          Assets
        </h1>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* Main wallet card */}
        <div className="rounded-3xl p-5 text-white"
          style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' }}>
          <p className="text-white/70 text-xs font-medium mb-1">TOTAL ASSETS</p>
          {loading ? (
            <Skeleton className="h-10 w-40 bg-white/20" />
          ) : (
            <p className="text-4xl font-extrabold" style={{ fontSize: '2.2rem' }}>
              {formatCurrency((w?.balance ?? 0) + (w?.commission_income ?? 0))}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/20">
            <div>
              <p className="text-white/60 text-xs">Available Balance</p>
              <p className="text-white font-extrabold text-lg">{formatCurrency(w?.balance ?? 0)}</p>
            </div>
            <div>
              <p className="text-white/60 text-xs">Commission Balance</p>
              <p className="text-white font-extrabold text-lg">{formatCurrency(w?.commission_income ?? 0)}</p>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <Link href="/deposit"
              className="flex-1 h-10 flex items-center justify-center gap-2 bg-white text-brand-700 rounded-xl text-sm font-bold border-2 border-white hover:bg-brand-50 transition-colors">
              <ArrowDownCircle size={16} />
              Deposit
            </Link>
            <Link href="/withdraw"
              className="flex-1 h-10 flex items-center justify-center gap-2 bg-white/10 text-white rounded-xl text-sm font-bold border-2 border-white/30 hover:bg-white/20 transition-colors">
              <ArrowUpCircle size={16} />
              Withdraw
            </Link>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/account-history"
            className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-3 hover:shadow-md transition-shadow">
            <History size={22} className="text-brand-600" />
            <div>
              <p className="font-bold text-sm text-ink">Account History</p>
              <p className="text-xs text-ink-soft">All transactions</p>
            </div>
          </Link>
          <Link href="/withdraw-history"
            className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-3 hover:shadow-md transition-shadow">
            <Clock size={22} className="text-brand-600" />
            <div>
              <p className="font-bold text-sm text-ink">Withdraw History</p>
              <p className="text-xs text-ink-soft">Withdrawal records</p>
            </div>
          </Link>
        </div>

        {/* Mining income stats */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <h3 className="font-extrabold text-sm text-ink mb-3">Mining Income</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Total Mining Income', value: formatCurrency(w?.total_earned ?? 0) },
              { label: 'Total Withdrawn', value: formatCurrency(w?.total_withdrawn ?? 0) },
              { label: "Yesterday's Mining", value: formatCurrency(data?.yesterday_mining ?? 0) },
              { label: "Today's Mining", value: formatCurrency(data?.today_mining ?? 0) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-surface-soft rounded-xl p-3">
                <p className="text-ink-muted text-[10px] font-medium">{label}</p>
                <p className="text-ink font-extrabold text-sm mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
