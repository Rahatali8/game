'use client'
import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'

export default function RandomBonusPage() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<{ amount: number } | null>(null)
  const [error, setError] = useState('')

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) { setError('Enter a bonus code'); return }
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/bonus/redeem-code', { code: code.trim().toUpperCase() })
      setSuccess(res.data.data as { amount: number })
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Invalid or expired code')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader title="Random Bonus" />
      <div className="px-4 mt-6 flex flex-col items-center gap-6">
        <div className="text-6xl">🎁</div>
        <div className="text-center">
          <h2 className="text-xl font-extrabold text-ink">Redeem Bonus Code</h2>
          <p className="text-ink-soft text-sm mt-1">Enter your bonus code to claim free rewards!</p>
        </div>

        {success ? (
          <div className="w-full max-w-sm bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center">
            <p className="text-4xl mb-2">🎉</p>
            <p className="font-extrabold text-green-700 text-xl">Congratulations!</p>
            <p className="text-green-600 text-sm mt-1">You received</p>
            <p className="text-3xl font-extrabold text-success mt-2">{formatCurrency(success.amount)}</p>
            <Button onClick={() => { setSuccess(null); setCode('') }} className="w-full mt-4" variant="outline">
              Redeem Another
            </Button>
          </div>
        ) : (
          <form onSubmit={handleRedeem} className="w-full max-w-sm space-y-4">
            <input
              type="text"
              placeholder="Enter bonus code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full h-14 bg-white border-2 border-slate-200 rounded-2xl px-4 text-lg font-extrabold tracking-widest text-center uppercase focus:outline-none focus:border-brand-500"
            />
            {error && <p className="text-danger text-sm text-center">{error}</p>}
            <Button type="submit" loading={loading} className="w-full" size="lg">Redeem Code</Button>
          </form>
        )}
      </div>
    </div>
  )
}
