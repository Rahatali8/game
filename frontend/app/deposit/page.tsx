'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { DEPOSIT_METHODS } from '@/lib/constants'

const METHOD_DETAILS: Record<string, { account: string; name: string; instructions: string }> = {
  USDT: { account: 'TXxxxxxxxxxxxxxxxxxxxxxxxx', name: 'CloudFire TRC20', instructions: 'Send USDT (TRC20) to the address above and enter your TXN hash.' },
  JazzCash: { account: '03001234567', name: 'Muhammad Ali', instructions: 'Send via JazzCash to the number above, then enter TXN ID.' },
  EasyPaisa: { account: '03001234567', name: 'Muhammad Ali', instructions: 'Send via EasyPaisa to the number above, then enter TXN ID.' },
  'Bank Transfer': { account: 'PK36MEZN0001010123456789', name: 'CloudFire Ltd', instructions: 'Wire transfer to the IBAN above (HBL Bank). Attach proof screenshot.' },
}

export default function DepositPage() {
  const router = useRouter()
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('USDT')
  const [txnId, setTxnId] = useState('')
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || parseFloat(amount) <= 0) { setError('Enter a valid amount'); return }
    setLoading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('amount', amount)
      fd.append('method', method)
      if (txnId) fd.append('txn_id', txnId)
      if (screenshot) fd.append('screenshot', screenshot)
      await api.post('/deposits', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setSuccess(true)
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Deposit request failed')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <PageHeader title="Deposit" back="/asset" />
        <div className="flex-1 flex flex-col items-center justify-center px-4 gap-4 text-center">
          <div className="text-6xl">✅</div>
          <h2 className="text-xl font-extrabold text-ink">Deposit Submitted!</h2>
          <p className="text-ink-soft text-sm">Your deposit request is pending admin approval (within 24h)</p>
          <Button onClick={() => router.push('/asset')} className="w-full max-w-sm">Back to Wallet</Button>
        </div>
      </div>
    )
  }

  const details = METHOD_DETAILS[method]

  return (
    <div>
      <PageHeader title="Deposit" back="/asset" />
      <div className="px-4 mt-4 space-y-4">
        {/* Method tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {DEPOSIT_METHODS.map((m) => (
            <button key={m} onClick={() => setMethod(m)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                method === m ? 'bg-brand-600 text-white' : 'bg-white text-ink-soft border border-slate-200'
              }`}>
              {m}
            </button>
          ))}
        </div>

        {/* Payment instructions */}
        <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4">
          <p className="text-xs text-ink-muted mb-1">Account</p>
          <p className="font-extrabold text-ink text-sm break-all">{details.account}</p>
          <p className="text-xs text-ink-muted mt-2 mb-0.5">Account Name</p>
          <p className="font-semibold text-ink text-sm">{details.name}</p>
          <p className="text-xs text-brand-600 mt-2">{details.instructions}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-4">
            <div>
              <label className="text-xs text-ink-muted font-medium block mb-1">Amount (USD)</label>
              <input type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} min="1"
                className="w-full h-11 bg-white border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
            </div>
            <div>
              <label className="text-xs text-ink-muted font-medium block mb-1">Transaction ID</label>
              <input type="text" placeholder="Enter TXN ID" value={txnId} onChange={(e) => setTxnId(e.target.value)}
                className="w-full h-11 bg-white border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
            </div>
            <div>
              <label className="text-xs text-ink-muted font-medium block mb-1">Proof Screenshot</label>
              <input type="file" accept="image/*" onChange={(e) => setScreenshot(e.target.files?.[0] ?? null)}
                className="w-full text-sm text-ink-soft file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100" />
            </div>
          </div>
          {error && <p className="text-danger text-sm">{error}</p>}
          <Button type="submit" loading={loading} className="w-full" size="lg">Submit Deposit Request</Button>
        </form>
      </div>
    </div>
  )
}
