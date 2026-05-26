import type { Product } from '@/types'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'

interface HotProductCardProps {
  product: Product
}

export function HotProductCard({ product }: HotProductCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
      <div className="w-14 h-14 rounded-xl bg-brand-100 flex items-center justify-center flex-shrink-0">
        <span className="text-2xl">⛏️</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-ink truncate">{product.name}</p>
        <p className="text-xs text-ink-soft">${product.daily_income}/day · {product.period_days} days</p>
        <p className="text-brand-600 font-extrabold text-sm mt-0.5">{formatCurrency(product.price)}</p>
      </div>
      <Link
        href="/product"
        className="px-3 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition-colors whitespace-nowrap"
      >
        RENT
      </Link>
    </div>
  )
}
