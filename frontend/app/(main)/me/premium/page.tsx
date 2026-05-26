'use client'
import Link from 'next/link'
import { Crown, Check } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'

const BENEFITS = [
  '5% discount on all miners',
  '+1% airdrop bonus on commission',
  'Extended lease periods',
  'Reduced withdrawal fees',
  'Priority support',
  'Exclusive golden avatar frame',
  'Early access to new miners',
  'Weekly bonus multiplier',
]

export default function PremiumPage() {
  return (
    <div>
      <PageHeader title="Premium Membership" />
      <div className="px-4 mt-4 space-y-4">
        {/* Hero */}
        <div className="rounded-3xl p-6 text-white text-center"
          style={{ background: 'linear-gradient(135deg, #d4af37 0%, #f9ca24 100%)' }}>
          <Crown size={48} className="text-white mx-auto mb-3" />
          <h2 className="text-2xl font-extrabold text-white mb-1">PREMIUM MEMBER</h2>
          <p className="text-white/80 text-sm mb-4">Unlock all exclusive benefits</p>
          <p className="text-white text-4xl font-extrabold">$80</p>
          <p className="text-white/70 text-xs">One-time purchase via Premium Miner</p>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <h3 className="font-extrabold text-sm text-ink mb-4">8 Exclusive Benefits</h3>
          <div className="space-y-3">
            {BENEFITS.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Check size={14} className="text-amber-600" />
                </div>
                <p className="text-sm text-ink">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        <Link href="/product">
          <Button className="w-full h-13" size="lg"
            style={{ background: 'linear-gradient(135deg, #d4af37 0%, #f9ca24 100%)', color: '#000', fontWeight: 900 }}>
            Buy Premium Miner ($80) →
          </Button>
        </Link>
      </div>
    </div>
  )
}
