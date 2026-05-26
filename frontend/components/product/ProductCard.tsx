'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Product } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  onRent: (product: Product) => void
}

export function ProductCard({ product, onRent }: ProductCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-slate-100">
      {product.offer_tag && (
        <div className="mb-2">
          <span className="text-white px-3 py-1 rounded-tl-xl rounded-br-xl text-[10px] font-extrabold"
            style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)' }}>
            ★ {product.offer_tag}
          </span>
        </div>
      )}

      <div className="flex gap-3">
        <div className="w-[90px] h-[90px] rounded-2xl bg-brand-100 flex items-center justify-center flex-shrink-0">
          <span className="text-4xl">⛏️</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-sm text-ink truncate">{product.name}</h3>
            {product.is_premium_miner && (
              <span className="bg-amber-400 text-amber-900 text-[9px] font-extrabold px-1.5 py-0.5 rounded-lg">PREMIUM</span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-1 mt-2">
            {[
              { label: 'Daily', value: `$${product.daily_income}`, highlight: true },
              { label: 'Total', value: `$${product.total_income}` },
              { label: 'Period', value: `${product.period_days}d` },
              { label: 'Limit', value: `${product.quantity_limit}` },
            ].map(({ label, value, highlight }) => (
              <div key={label} className="flex gap-1 items-baseline">
                <span className="text-ink-muted text-[10px]">{label}:</span>
                <span className={`text-xs font-bold ${highlight ? 'text-brand-600' : 'text-ink'}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-100">
        <div>
          {product.old_price && (
            <p className="text-ink-muted text-xs line-through">{formatCurrency(product.old_price)}</p>
          )}
          <p className="text-2xl font-extrabold text-ink">{formatCurrency(product.price)}</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onRent(product)}
          className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-extrabold transition-colors"
        >
          RENT
        </motion.button>
      </div>
    </div>
  )
}
