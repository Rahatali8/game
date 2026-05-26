'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useWallet } from '@/hooks/useWallet'
import { api } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import type { Product } from '@/types'

export default async function RentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <RentClient id={id} />
}

function RentClient({ id }: { id: string }) {
  const router = useRouter()
  const { data: walletData, refetch: refetchWallet } = useWallet()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const balance = (walletData?.wallet.balance ?? 0) + (walletData?.wallet.commission_income ?? 0)

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => {
      setProduct(res.data.data as Product)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [id])

  const handlePurchase = async () => {
    if (!product) return
    setPurchasing(true)
    setError('')
    try {
      await api.post('/miners/purchase', { product_id: product.id })
      await refetchWallet()
      setSuccess(true)
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Purchase failed')
    } finally {
      setPurchasing(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <PageHeader title="Purchase" />
        <div className="flex-1 flex flex-col items-center justify-center px-4 gap-4 text-center">
          <div className="text-6xl">🎉</div>
          <h2 className="text-xl font-extrabold text-ink">Purchase Successful!</h2>
          <p className="text-ink-soft text-sm">Your miner is now active</p>
          <Button onClick={() => router.push('/home')} className="w-full max-w-sm">Go to Home</Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Rent Miner" />
      <div className="px-4 mt-4 space-y-4">
        {loading ? (
          <Skeleton className="h-48 rounded-2xl" />
        ) : !product ? (
          <p className="text-center text-ink-muted py-8">Product not found</p>
        ) : (
          <>
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 rounded-2xl bg-brand-100 flex items-center justify-center text-4xl">⛏️</div>
                <div>
                  <h2 className="font-extrabold text-base text-ink">{product.name}</h2>
                  <p className="text-xs text-ink-muted">{product.country} · {product.period_days} days</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Daily Income', value: `$${product.daily_income}`, highlight: true },
                  { label: 'Total Income', value: `$${product.total_income}` },
                  { label: 'Period', value: `${product.period_days} days` },
                  { label: 'Quantity Limit', value: `${product.quantity_limit}` },
                ].map(({ label, value, highlight }) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-3">
                    <p className="text-[10px] text-ink-muted">{label}</p>
                    <p className={`font-extrabold text-sm ${highlight ? 'text-brand-600' : 'text-ink'}`}>{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 text-sm space-y-2">
              <div className="flex justify-between"><span className="text-ink-muted">Price</span><span className="font-bold text-brand-600">{formatCurrency(product.price)}</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">Your Balance</span><span className="font-bold">{formatCurrency(balance)}</span></div>
              <div className="border-t border-slate-200 pt-2 flex justify-between">
                <span className="font-bold text-ink">After Purchase</span>
                <span className={`font-extrabold ${balance < product.price ? 'text-danger' : 'text-ink'}`}>
                  {formatCurrency(Math.max(0, balance - product.price))}
                </span>
              </div>
            </div>

            {error && <p className="text-danger text-sm">{error}</p>}
            <Button
              onClick={handlePurchase}
              loading={purchasing}
              disabled={balance < product.price}
              className="w-full" size="lg"
            >
              Confirm Purchase — {formatCurrency(product.price)}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
