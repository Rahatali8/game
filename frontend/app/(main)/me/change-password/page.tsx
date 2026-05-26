'use client'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

export default function ChangePasswordPage() {
  const [current, setCurrent] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPwd !== confirm) { setError('New passwords do not match'); return }
    if (newPwd.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    setError('')
    try {
      await api.post('/users/change-password', { current_password: current, new_password: newPwd })
      setSuccess(true)
      setCurrent(''); setNewPwd(''); setConfirm('')
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader title="Change Password" />
      <div className="px-4 mt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-4">
            {[
              { label: 'Current Password', value: current, onChange: setCurrent },
              { label: 'New Password', value: newPwd, onChange: setNewPwd },
              { label: 'Confirm New Password', value: confirm, onChange: setConfirm },
            ].map(({ label, value, onChange }) => (
              <div key={label}>
                <label className="text-xs text-ink-muted font-medium block mb-1">{label}</label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full h-11 bg-white border border-slate-200 rounded-xl px-4 pr-11 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted">
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
          {error && <p className="text-danger text-sm">{error}</p>}
          {success && <p className="text-success text-sm">Password changed successfully!</p>}
          <Button type="submit" loading={loading} className="w-full" size="lg">Change Password</Button>
        </form>
      </div>
    </div>
  )
}
