'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Flame, Bell, ChevronRight, Gift, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import { MinerBubble } from '@/components/home/MinerBubble'
import { CryptoChart } from '@/components/home/CryptoChart'
import { WalletStatsCard } from '@/components/home/WalletStatsCard'
import { HotProductCard } from '@/components/home/HotProductCard'
import { Skeleton } from '@/components/ui/skeleton'
import { useWallet } from '@/hooks/useWallet'
import { useMiners } from '@/hooks/useMiners'
import { api } from '@/lib/api'
import type { Product } from '@/types'

export default function HomePage() {
  const { data: dashData, loading: walletLoading, refetch: refetchWallet } = useWallet()
  const { miners, loading: minersLoading, claim, claimAll } = useMiners()
  const [hotProducts, setHotProducts] = useState<Product[]>([])
  const [claimingAll, setClaimingAll] = useState(false)

  const activeMiners = miners.filter((m) => m.status === 'active')

  useEffect(() => {
    api.get('/products?limit=3').then((res) => {
      setHotProducts(res.data.data as Product[])
    }).catch(() => {})
  }, [])

  const handleClaimAll = async () => {
    setClaimingAll(true)
    try {
      await claimAll()
      await refetchWallet()
    } catch {
      // ignore
    } finally {
      setClaimingAll(false)
    }
  }

  const handleClaim = async (id: number) => {
    await claim(id)
    await refetchWallet()
  }

  return (
    <div className="flex flex-col">
      {/* Hero section */}
      <div className="rounded-b-3xl px-4 pt-6 pb-8"
        style={{ background: 'linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%)' }}>

        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/20">
              <Flame size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white/60 text-[10px] font-medium">CRYSTAL MINING</p>
              <p className="text-white text-sm font-extrabold leading-none">CLOUD FIRE</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 bg-success/20 text-success text-[10px] font-bold px-2 py-1 rounded-full border border-success/30">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              LIVE
            </span>
            <Link href="/announcement">
              <Bell size={20} className="text-white/80" />
            </Link>
          </div>
        </div>

        {/* Wallet stats */}
        <WalletStatsCard data={dashData} loading={walletLoading} minersCount={activeMiners.length} />

        {/* Miner bubbles */}
        <div className="mt-4">
          {minersLoading ? (
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 min-w-[72px]">
                  <Skeleton className="w-14 h-14 rounded-full" />
                  <Skeleton className="h-3 w-14" />
                </div>
              ))}
            </div>
          ) : activeMiners.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-white/60 text-sm">No active miners</p>
              <Link href="/product" className="text-brand-300 text-sm font-semibold underline">
                Buy your first miner →
              </Link>
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {activeMiners.map((miner) => (
                <MinerBubble key={miner.id} miner={miner} onClaim={handleClaim} />
              ))}
            </div>
          )}
        </div>

        {/* Claim all */}
        {activeMiners.length > 0 && (
          <motion.button
            onClick={handleClaimAll}
            disabled={claimingAll}
            whileTap={{ scale: 0.97 }}
            className="w-full mt-4 h-12 rounded-2xl font-extrabold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
          >
            {claimingAll ? (
              <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : '⚡ GET ALL INCOME'}
          </motion.button>
        )}
      </div>

      {/* News ticker */}
      <div className="bg-amber-50 border-y border-amber-200 px-4 py-2 overflow-hidden">
        <div className="flex items-center gap-2">
          <span className="text-amber-600 text-xs font-bold whitespace-nowrap">🎉 HOT:</span>
          <motion.div
            animate={{ x: [0, -600] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="flex gap-8 whitespace-nowrap"
          >
            {['Ali from Pakistan bought Cloud-Fire Pro', 'Wang from China earned $50 commission',
              'Ahmed from UAE bought Premium Miner', 'John from USA claimed $12.40'].map((text) => (
              <span key={text} className="text-amber-700 text-xs font-medium">{text}</span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Feature cards */}
      <div className="px-4 mt-4 grid grid-cols-2 gap-3">
        <Link href="/task-reward" className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-2 hover:shadow-md transition-shadow">
          <Calendar size={28} className="text-brand-600" />
          <p className="font-bold text-sm text-ink">Task Reward</p>
          <p className="text-xs text-ink-soft">Daily sign-in bonus</p>
        </Link>
        <Link href="/random-bonus" className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-2 hover:shadow-md transition-shadow">
          <Gift size={28} className="text-brand-600" />
          <p className="font-bold text-sm text-ink">Random Bonus</p>
          <p className="text-xs text-ink-soft">Redeem bonus codes</p>
        </Link>
      </div>

      {/* Quick nav */}
      <div className="px-4 mt-4 grid grid-cols-4 gap-2">
        {[
          { label: 'About Us', href: '/about-us', emoji: 'ℹ️' },
          { label: 'Consultant', href: '/consult', emoji: '👨‍💼' },
          { label: 'Message', href: '/message', emoji: '💬' },
          { label: 'News', href: '/announcement', emoji: '📢' },
        ].map(({ label, href, emoji }) => (
          <Link key={href} href={href} className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex flex-col items-center gap-1 hover:shadow-md transition-shadow">
            <span className="text-xl">{emoji}</span>
            <p className="text-[10px] font-semibold text-ink-soft text-center">{label}</p>
          </Link>
        ))}
      </div>

      {/* Crypto Chart */}
      <div className="px-4 mt-4">
        <CryptoChart />
      </div>

      {/* Hot Mining Machines */}
      <div className="px-4 mt-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-extrabold text-ink text-sm">Hot Mining Machines</h2>
          <Link href="/product" className="flex items-center gap-0.5 text-brand-600 text-xs font-semibold">
            View all <ChevronRight size={14} />
          </Link>
        </div>
        {hotProducts.length === 0 ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {hotProducts.map((p) => <HotProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
