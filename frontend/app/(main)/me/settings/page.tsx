'use client'
import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import { api } from '@/lib/api'
import type { User } from '@/types'

export default function SettingsPage() {
  const { user, setUser } = useAuthStore()
  const [displayName, setDisplayName] = useState(user?.name ?? '')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await api.patch('/users/profile', { name: displayName })
      setUser(res.data.data as User)
      setSuccess(true)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader title="Settings" />
      <div className="px-4 mt-6 space-y-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <label className="text-xs text-ink-muted font-medium block mb-1">Display Name</label>
          <input value={displayName} onChange={(e) => setDisplayName(e.target.value)}
            className="w-full h-11 bg-white border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
        </div>
        {success && <p className="text-success text-sm text-center">Settings saved!</p>}
        <Button onClick={handleSave} loading={loading} className="w-full" size="lg">Save Settings</Button>
      </div>
    </div>
  )
}
