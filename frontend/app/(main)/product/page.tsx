'use client'
import { useState, useEffect } from 'react'
import { Pickaxe, AlertCircle, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProductCard } from '@/components/product/ProductCard'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { useWallet } from '@/hooks/useWallet'
import { useMiners } from '@/hooks/useMiners'
import { useAuthStore } from '@/store/authStore'
import { formatCurrency } from '@/lib/utils'
import { MINING_COUNTRIES } from '@/lib/constants'
import type { Product } from '@/types'

export default function ProductPage() {
  const { user } = useAuthStore()
  const { data: wallet, loading: walletLoading, refetch: refetchWallet } = useWallet()
  const { miners, loading: minersLoading, refetch: refetchMiners } = useMiners()
  const [products, setProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [activeCountry, setActiveCountry] = useState('All')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [purchasing, setPurchasing] = useState(false)
  const [purchaseSuccess, setPurchaseSuccess] = useState(false)
  const [error, setError] = useState('')
  const [showMiners, setShowMiners] = useState(false)

  useEffect(() => {
    api.get('/products').then((res) => {
      setProducts(res.data.data as Product[])
    }).catch(() => {}).finally(() => setProductsLoading(false))
  }, [])

  const filteredProducts = products.filter((p) =>
    activeCountry === 'All' || p.country.toLowerCase() === activeCountry.toLowerCase()
  )

  const totalBalance = (wallet?.wallet.balance ?? 0) + (wallet?.wallet.commission_income ?? 0)
  const activeMiners = miners.filter((m) => m.status === 'active')

  const handlePurchase = async () => {
    if (!selectedProduct) return
    setPurchasing(true)
    setError('')
    try {
      await api.post('/miners/purchase', { product_id: selectedProduct.id })
      setPurchaseSuccess(true)
      await Promise.all([refetchWallet(), refetchMiners()])
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || 'Purchase failed. Please try again.')
    } finally {
      setPurchasing(false)
    }
  }

  const closeDialog = () => {
    setSelectedProduct(null)
    setPurchaseSuccess(false)
    setError('')
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-slate-100 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Pickaxe size={22} className="text-brand-600" />
          <h1 className="text-lg font-extrabold text-ink">MINING POOL</h1>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-3">
        {/* Premium status */}
        {!user?.is_premium && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center gap-3">
            <AlertCircle size={18} className="text-amber-600 flex-shrink-0" />
            <p className="text-amber-700 text-xs font-medium">
              ⚠️ Purchase the <strong>$80 PREMIUM MINER</strong> to unlock exclusive benefits
            </p>
          </div>
        )}

        {/* Wallet quick card */}
        <div className="bg-brand-600 rounded-2xl p-4 text-white">
          <p className="text-white/70 text-xs">Available Balance</p>
          <p className="text-xl font-extrabold">{formatCurrency(totalBalance)}</p>
        </div>

        {/* My Miners */}
        <button
          onClick={() => setShowMiners(true)}
          className="w-full bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">⛏️</span>
            <div className="text-left">
              <p className="font-bold text-sm text-ink">My Miners</p>
              <p className="text-xs text-ink-soft">{activeMiners.length} active</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-ink-muted" />
        </button>

        {/* Country tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {MINING_COUNTRIES.map((country) => (
            <button
              key={country}
              onClick={() => setActiveCountry(country)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeCountry === country
                  ? 'bg-brand-600 text-white'
                  : 'bg-white text-ink-soft border border-slate-200 hover:border-brand-300'
              }`}
            >
              {country}
            </button>
          ))}
        </div>

        {/* Products */}
        {productsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-36 w-full rounded-2xl" />)}
          </div>
        ) : (
          filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} onRent={(prod) => setSelectedProduct(prod)} />
          ))
        )}
      </div>

      {/* My Miners modal */}
      <Dialog open={showMiners} onClose={() => setShowMiners(false)} title="My Miners">
        {minersLoading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
          </div>
        ) : miners.length === 0 ? (
          <p className="text-center text-ink-soft text-sm py-8">No miners yet</p>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {miners.map((m) => (
              <div key={m.id} className="flex items-center justify-between bg-slate-50 rounded-xl p-3">
                <div>
                  <p className="font-bold text-sm text-ink">{m.product_name}</p>
                  <p className="text-xs text-ink-soft">${m.daily_income}/day · {m.remaining_days} days left</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                  m.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'
                }`}>
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </Dialog>

      {/* Purchase confirm dialog */}
      <Dialog open={!!selectedProduct} onClose={closeDialog} title={purchaseSuccess ? '' : 'Confirm Purchase'}>
        {purchaseSuccess ? (
          <div className="text-center py-4">
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="text-xl font-extrabold text-ink mb-1">Purchase Successful!</h3>
            <p className="text-ink-soft text-sm mb-4">Your miner is now active</p>
            <Button onClick={closeDialog} className="w-full">Done</Button>
          </div>
        ) : selectedProduct ? (
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-ink-soft">Miner</span>
                <span className="font-bold text-ink">{selectedProduct.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-soft">Cost</span>
                <span className="font-bold text-brand-600">{formatCurrency(selectedProduct.price)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-soft">Your Balance</span>
                <span className="font-bold text-ink">{formatCurrency(totalBalance)}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between text-sm">
                <span className="text-ink-soft">After Purchase</span>
                <span className={`font-bold ${totalBalance - selectedProduct.price < 0 ? 'text-danger' : 'text-ink'}`}>
                  {formatCurrency(Math.max(0, totalBalance - selectedProduct.price))}
                </span>
              </div>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-danger text-xs rounded-xl p-3">{error}</div>
            )}
            <div className="flex gap-3">
              <Button variant="outline" onClick={closeDialog} className="flex-1">Cancel</Button>
              <Button
                onClick={handlePurchase}
                loading={purchasing}
                disabled={totalBalance < selectedProduct.price}
                className="flex-1"
              >
                Confirm
              </Button>
            </div>
          </div>
        ) : null}
      </Dialog>
    </div>
  )
}
