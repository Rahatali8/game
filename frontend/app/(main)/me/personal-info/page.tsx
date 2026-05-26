'use client'
import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import { api } from '@/lib/api'
import type { User } from '@/types'

export default function PersonalInfoPage() {
  const { user, setUser } = useAuthStore()
  const [name, setName] = useState(user?.name ?? '')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    setLoading(true)
    setError('')
    setSuccess(false)
    try {
      const res = await api.patch('/users/profile', { name })
      setUser(res.data.data as User)
      setSuccess(true)
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader title="Personal Information" />
      <div className="px-4 mt-6 space-y-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-4">
          <div>
            <label className="text-xs text-ink-muted font-medium">Mobile Number</label>
            <p className="text-ink font-semibold mt-1 h-11 flex items-center px-4 bg-slate-50 rounded-xl text-sm">{user?.mobile}</p>
          </div>
          <div>
            <label className="text-xs text-ink-muted font-medium block mb-1">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 bg-white border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <div>
            <label className="text-xs text-ink-muted font-medium">Referral Code</label>
            <p className="text-ink font-bold mt-1 h-11 flex items-center px-4 bg-slate-50 rounded-xl text-sm tracking-widest">{user?.referral_code}</p>
          </div>
        </div>
        {error && <p className="text-danger text-sm text-center">{error}</p>}
        {success && <p className="text-success text-sm text-center">Profile updated!</p>}
        <Button onClick={handleSave} loading={loading} className="w-full" size="lg">Save Changes</Button>
      </div>
    </div>
  )
}
