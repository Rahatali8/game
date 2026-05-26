'use client'
import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

export default function WithdrawPinPage() {
  const [loginPwd, setLoginPwd] = useState('')
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pin !== confirmPin) { setError('PINs do not match'); return }
    if (pin.length < 4) { setError('PIN must be at least 4 digits'); return }
    setLoading(true)
    setError('')
    try {
      await api.post('/users/set-withdraw-pin', { login_password: loginPwd, withdraw_pin: pin })
      setSuccess(true)
      setLoginPwd(''); setPin(''); setConfirmPin('')
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to set PIN')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader title="Withdraw Password" />
      <div className="px-4 mt-6">
        <div className="bg-brand-50 border border-brand-200 rounded-2xl p-3 mb-4">
          <p className="text-brand-700 text-xs">Your withdraw PIN is separate from your login password and is required for all withdrawals.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-4">
            {[
              { label: 'Login Password (to verify)', value: loginPwd, onChange: setLoginPwd, type: 'password', ph: 'Enter your login password' },
              { label: 'New Withdraw PIN', value: pin, onChange: setPin, type: 'password', ph: '4-6 digit PIN' },
              { label: 'Confirm Withdraw PIN', value: confirmPin, onChange: setConfirmPin, type: 'password', ph: 'Confirm PIN' },
            ].map(({ label, value, onChange, type, ph }) => (
              <div key={label}>
                <label className="text-xs text-ink-muted font-medium block mb-1">{label}</label>
                <input type={type} placeholder={ph} value={value} onChange={(e) => onChange(e.target.value)}
                  className="w-full h-11 bg-white border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
              </div>
            ))}
          </div>
          {error && <p className="text-danger text-sm">{error}</p>}
          {success && <p className="text-success text-sm">Withdraw PIN set successfully!</p>}
          <Button type="submit" loading={loading} className="w-full" size="lg">Set Withdraw PIN</Button>
        </form>
      </div>
    </div>
  )
}
