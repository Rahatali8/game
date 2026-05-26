'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { useWallet } from '@/hooks/useWallet'
import { api } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import { WITHDRAW_METHODS } from '@/lib/constants'

const FEE_PERCENT = 2

export default function WithdrawPage() {
  const router = useRouter()
  const { data: walletData } = useWallet()
  const balance = walletData?.wallet.balance ?? 0

  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('USDT')
  const [account, setAccount] = useState('')
  const [accountName, setAccountName] = useState('')
  const [withdrawPin, setWithdrawPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const amountNum = parseFloat(amount) || 0
  const fee = parseFloat((amountNum * FEE_PERCENT / 100).toFixed(2))
  const net = Math.max(0, amountNum - fee)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (amountNum < 10) { setError('Minimum withdrawal is $10'); return }
    if (amountNum > balance) { setError('Insufficient balance'); return }
    if (!account) { setError('Enter account details'); return }
    if (!withdrawPin) { setError('Enter your withdraw PIN'); return }
    setLoading(true)
    setError('')
    try {
      await api.post('/withdrawals', {
        amount: amountNum,
        method,
        account_details: { account_number: account, holder_name: accountName },
        withdraw_pin: withdrawPin,
      })
      setSuccess(true)
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Withdrawal request failed')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <PageHeader title="Withdraw" back="/asset" />
        <div className="flex-1 flex flex-col items-center justify-center px-4 gap-4 text-center">
          <div className="text-6xl">✅</div>
          <h2 className="text-xl font-extrabold text-ink">Request Submitted!</h2>
          <p className="text-ink-soft text-sm">Your withdrawal is pending admin approval (within 24h)</p>
          <Button onClick={() => router.push('/asset')} className="w-full max-w-sm">Back to Wallet</Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Withdraw" back="/asset" />
      <div className="px-4 mt-4 space-y-4">
        {/* Balance */}
        <div className="bg-brand-600 rounded-2xl p-4 text-white">
          <p className="text-white/70 text-xs">Available Balance</p>
          <p className="text-2xl font-extrabold">{formatCurrency(balance)}</p>
          <p className="text-white/60 text-xs mt-1">Minimum withdrawal: $10 · Fee: {FEE_PERCENT}%</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-4">
            <div>
              <label className="text-xs text-ink-muted font-medium block mb-1">Amount (USD)</label>
              <input type="number" placeholder="Min. $10" value={amount} onChange={(e) => setAmount(e.target.value)} min="10"
                className="w-full h-11 bg-white border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
            </div>

            {/* Fee calc */}
            {amountNum > 0 && (
              <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1">
                <div className="flex justify-between"><span className="text-ink-muted">Amount</span><span className="font-semibold">{formatCurrency(amountNum)}</span></div>
                <div className="flex justify-between"><span className="text-ink-muted">Fee ({FEE_PERCENT}%)</span><span className="font-semibold text-danger">-{formatCurrency(fee)}</span></div>
                <div className="flex justify-between border-t border-slate-200 pt-1"><span className="text-ink font-bold">You receive</span><span className="font-extrabold text-success">{formatCurrency(net)}</span></div>
              </div>
            )}

            <div>
              <label className="text-xs text-ink-muted font-medium block mb-1">Method</label>
              <select value={method} onChange={(e) => setMethod(e.target.value)}
                className="w-full h-11 bg-white border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:border-brand-500">
                {WITHDRAW_METHODS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs text-ink-muted font-medium block mb-1">Account Number / Wallet Address</label>
              <input type="text" placeholder="Your account" value={account} onChange={(e) => setAccount(e.target.value)}
                className="w-full h-11 bg-white border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
            </div>

            <div>
              <label className="text-xs text-ink-muted font-medium block mb-1">Account Holder Name</label>
              <input type="text" placeholder="Your name" value={accountName} onChange={(e) => setAccountName(e.target.value)}
                className="w-full h-11 bg-white border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
            </div>

            <div>
              <label className="text-xs text-ink-muted font-medium block mb-1">Withdraw PIN</label>
              <input type="password" placeholder="Your withdraw PIN" value={withdrawPin} onChange={(e) => setWithdrawPin(e.target.value)}
                className="w-full h-11 bg-white border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
            </div>
          </div>

          {error && <p className="text-danger text-sm">{error}</p>}
          <Button type="submit" loading={loading} className="w-full" size="lg">Submit Withdrawal Request</Button>
        </form>
      </div>
    </div>
  )
}
