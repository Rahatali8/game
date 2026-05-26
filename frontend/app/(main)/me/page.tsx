'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Copy, ChevronRight, LogOut, Crown, QrCode } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useAuthStore } from '@/store/authStore'
import { useWallet } from '@/hooks/useWallet'
import { useTeam } from '@/hooks/useTeam'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog } from '@/components/ui/dialog'
import { api } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import { WEEKLY_BONUS_TIERS } from '@/lib/constants'

export default function MePage() {
  const { user, logout } = useAuthStore()
  const { data: walletData, loading: walletLoading, refetch: refetchWallet } = useWallet()
  const { stats: teamStats } = useTeam()
  const [claimingCommission, setClaimingCommission] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [copied, setCopied] = useState(false)

  const referralLink = typeof window !== 'undefined'
    ? `${window.location.origin}/register?ref=${user?.referral_code}`
    : `https://cloudsky.app/register?ref=${user?.referral_code}`

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClaimCommission = async () => {
    setClaimingCommission(true)
    try {
      await api.post('/commissions/claim')
      await refetchWallet()
    } catch {
      // ignore
    } finally {
      setClaimingCommission(false)
    }
  }

  const w = walletData?.wallet
  const currentTierIndex = WEEKLY_BONUS_TIERS.findIndex(
    (t) => (teamStats?.level1_count ?? 0) >= t.min && (teamStats?.level1_count ?? 0) <= t.max
  )

  const menuItems = [
    { label: 'Personal Information', href: '/me/personal-info', emoji: '👤' },
    { label: 'Login Password', href: '/me/change-password', emoji: '🔒' },
    { label: 'Withdraw Password', href: '/me/withdraw-pin', emoji: '🛡️' },
    { label: 'Settings', href: '/me/settings', emoji: '⚙️' },
    { label: 'Login History', href: '/me/login-history', emoji: '📱' },
  ]

  return (
    <div className="flex flex-col pb-6">
      {/* Profile hero */}
      <div className="px-4 pt-6 pb-6 rounded-b-3xl"
        style={{ background: 'linear-gradient(180deg, #dbeafe 0%, #f8fafc 100%)' }}>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`w-16 h-16 rounded-full overflow-hidden border-4 ${user?.is_premium ? 'border-amber-400' : 'border-white'} shadow-lg`}>
              {user?.avatar_url ? (
                <Image src={user.avatar_url} alt="avatar" width={64} height={64} className="object-cover" />
              ) : (
                <div className="w-full h-full bg-brand-100 flex items-center justify-center">
                  <span className="text-2xl font-extrabold text-brand-600">
                    {user?.name?.[0]?.toUpperCase() ?? 'U'}
                  </span>
                </div>
              )}
            </div>
            {user?.is_premium && (
              <Crown size={14} className="absolute -top-1 -right-1 text-amber-500" />
            )}
          </div>
          <div>
            <h2 className="font-extrabold text-ink text-lg">{user?.name ?? 'User'}</h2>
            <p className="text-ink-soft text-xs">ID: {user?.id}</p>
            <p className="text-ink-soft text-xs">{user?.mobile}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-ink-soft text-xs">Code:</span>
          <span className="font-extrabold text-brand-700 text-sm tracking-widest">{user?.referral_code}</span>
          <button onClick={() => copyToClipboard(user?.referral_code ?? '')}
            className="text-brand-600 hover:text-brand-800">
            <Copy size={14} />
          </button>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* Wallet card */}
        <div className="rounded-2xl p-4 text-white"
          style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' }}>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: 'Balance', value: formatCurrency(w?.balance ?? 0) },
              { label: 'Commission', value: formatCurrency(w?.commission_income ?? 0) },
              { label: 'Withdrawn', value: formatCurrency(w?.total_withdrawn ?? 0) },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-white/60 text-[10px]">{label}</p>
                <p className="text-white font-extrabold text-sm">{value}</p>
              </div>
            ))}
          </div>
          <Button
            onClick={handleClaimCommission}
            loading={claimingCommission}
            disabled={!w?.commission_income || w.commission_income <= 0}
            className="w-full"
            style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none' }}
          >
            Claim Commission
          </Button>
        </div>

        {/* Premium upgrade (if not premium) */}
        {!user?.is_premium && (
          <Link href="/me/premium"
            className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="font-extrabold text-amber-700 text-sm">Upgrade to Premium</p>
              <p className="text-amber-600 text-xs">Get 8 exclusive benefits & higher income</p>
            </div>
            <ChevronRight size={18} className="text-amber-500" />
          </Link>
        )}

        {/* Invite & Earn */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"
          style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #6d28d9 100%)' }}>
          <h3 className="text-white font-extrabold text-sm mb-3">Invite & Earn</h3>
          <div className="flex gap-3 items-center">
            <button onClick={() => setShowQR(true)}
              className="w-16 h-16 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
              <QrCode size={32} className="text-brand-700" />
            </button>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between bg-white/10 rounded-xl px-3 py-2">
                <p className="text-white text-xs font-bold tracking-widest">{user?.referral_code}</p>
                <button onClick={() => copyToClipboard(user?.referral_code ?? '')}>
                  <Copy size={14} className="text-white/80" />
                </button>
              </div>
              <div className="flex items-center justify-between bg-white/10 rounded-xl px-3 py-2">
                <p className="text-white/70 text-xs truncate max-w-[140px]">{referralLink}</p>
                <button onClick={() => copyToClipboard(referralLink)}>
                  <Copy size={14} className="text-white/80" />
                </button>
              </div>
            </div>
          </div>
          {copied && <p className="text-white/80 text-xs mt-2 text-center">Copied!</p>}
        </div>

        {/* Team stats */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-extrabold text-sm text-ink">My Team</h3>
            <Link href="/me/team" className="text-brand-600 text-xs font-semibold flex items-center gap-1">
              View <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Level 1', value: teamStats?.level1_count ?? 0 },
              { label: 'Level 2', value: teamStats?.level2_count ?? 0 },
              { label: 'Level 3', value: teamStats?.level3_count ?? 0 },
              { label: 'Total', value: teamStats?.total ?? 0 },
            ].map(({ label, value }) => (
              <div key={label} className="text-center bg-brand-50 rounded-xl py-2">
                <p className="text-brand-700 font-extrabold text-lg">{value}</p>
                <p className="text-brand-500 text-[10px]">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly bonus table */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <h3 className="font-extrabold text-sm text-ink mb-3">Weekly Bonus Tiers</h3>
          <div className="space-y-1.5">
            {WEEKLY_BONUS_TIERS.map((tier, i) => (
              <div key={tier.name}
                className={`flex items-center justify-between px-3 py-2 rounded-xl ${
                  i === currentTierIndex ? 'bg-green-50 border border-green-200' : 'bg-slate-50'
                }`}>
                <div className="flex items-center gap-2">
                  {i === currentTierIndex && (
                    <div className="w-2 h-2 rounded-full bg-success" />
                  )}
                  <p className="text-xs font-semibold text-ink">{tier.name}</p>
                  <p className="text-[10px] text-ink-muted">({tier.min}{tier.max < Infinity ? `–${tier.max}` : '+'})</p>
                </div>
                <p className="text-xs font-bold text-brand-600">
                  {tier.bonus === 0 ? '-' : tier.bonus >= 1000 ? `$${tier.bonus / 1000}K/mo` : `$${tier.bonus}/wk`}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Commission info */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-extrabold text-sm text-ink">Team Commission</h3>
            <Link href="/me/commission" className="text-brand-600 text-xs font-semibold flex items-center gap-1">
              History <ChevronRight size={14} />
            </Link>
          </div>
          {[
            { level: 'Level 1', percent: '10%', desc: 'Direct referrals' },
            { level: 'Level 2', percent: '4%', desc: 'Indirect referrals' },
            { level: 'Level 3', percent: '2%', desc: 'Deep referrals' },
          ].map(({ level, percent, desc }) => (
            <div key={level} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
              <div>
                <p className="text-sm font-bold text-ink">{level}</p>
                <p className="text-xs text-ink-muted">{desc}</p>
              </div>
              <span className="font-extrabold text-brand-600 text-sm">{percent}</span>
            </div>
          ))}
        </div>

        {/* Menu items */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {menuItems.map(({ label, href, emoji }, i) => (
            <Link key={href} href={href}
              className={`flex items-center justify-between px-4 py-4 hover:bg-slate-50 transition-colors ${
                i < menuItems.length - 1 ? 'border-b border-slate-100' : ''
              }`}>
              <div className="flex items-center gap-3">
                <span className="text-lg">{emoji}</span>
                <p className="text-sm font-semibold text-ink">{label}</p>
              </div>
              <ChevronRight size={16} className="text-ink-muted" />
            </Link>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full bg-white border border-slate-200 rounded-2xl py-4 text-danger font-bold text-sm hover:bg-red-50 transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* QR Dialog */}
      <Dialog open={showQR} onClose={() => setShowQR(false)} title="My Referral QR Code">
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="p-4 bg-white rounded-2xl border border-slate-100">
            <QRCodeSVG value={referralLink} size={200} />
          </div>
          <p className="text-sm text-ink-soft text-center">
            Share this QR code to invite friends and earn commissions
          </p>
          <p className="font-extrabold text-brand-700 text-xl tracking-widest">{user?.referral_code}</p>
        </div>
      </Dialog>
    </div>
  )
}
