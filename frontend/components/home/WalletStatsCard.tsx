'use client'
import type { DashboardData } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

interface WalletStatsCardProps {
  data: DashboardData | null
  loading: boolean
  minersCount: number
}

export function WalletStatsCard({ data, loading, minersCount }: WalletStatsCardProps) {
  if (loading) {
    return (
      <div className="px-4 py-3 space-y-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-24" />
      </div>
    )
  }
  const total = (data?.wallet.balance ?? 0) + (data?.wallet.commission_income ?? 0)

  return (
    <div className="px-4 py-3">
      <p className="text-white/70 text-xs font-medium">Total Assets</p>
      <p className="text-white text-3xl font-extrabold">{formatCurrency(total)}</p>
      <p className="text-white/60 text-xs mt-1">{minersCount} active miners</p>
    </div>
  )
}
