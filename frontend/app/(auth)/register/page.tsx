'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Cloud } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { COUNTRIES } from '@/lib/countries'
import type { User } from '@/types'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuthStore()

  const [form, setForm] = useState({
    countryCode: '+92',
    mobile: '',
    name: '',
    password: '',
    confirm: '',
    referral: '',
  })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) setForm((f) => ({ ...f, referral: ref }))
  }, [searchParams])

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.mobile || !form.name || !form.password) { setError('Please fill all required fields'); return }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/register', {
        mobile: form.countryCode + form.mobile,
        password: form.password,
        name: form.name,
        referral_code: form.referral || undefined,
      })
      const { access_token, user } = res.data.data as { access_token: string; user: User }
      login(access_token, user)
      router.push('/home')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    height: 52,
    background: '#eff6ff',
    border: '1.5px solid #bfdbfe',
    borderRadius: 16,
    paddingLeft: 20,
    paddingRight: 20,
    width: '100%',
    fontSize: 14,
    color: '#1e293b',
    outline: 'none',
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-4"
      style={{ background: '#f8fafc' }}
    >
      <div
        className="w-full max-w-[480px] bg-white rounded-[25px]"
        style={{ boxShadow: '0 16px 48px rgba(37,99,235,0.15)' }}
      >
        {/* HEADER */}
        <div
          className="flex flex-col items-center rounded-t-[25px]"
          style={{ padding: '32px 40px 20px', background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)' }}
        >
          <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mb-2"
            style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
            <Cloud size={28} className="text-white" />
          </div>
          <h1 className="text-[20px] font-black tracking-widest text-white">CLOUD SKY</h1>
          <p className="text-blue-200 text-[11px] font-medium mt-0.5">CRYSTAL MINING</p>
        </div>

        {/* FORM */}
        <div className="px-4 sm:px-8" style={{ paddingBottom: 40, paddingTop: 24 }}>
          <h2 className="text-[26px] font-extrabold text-center text-blue-900">
            Create Account
          </h2>
          <p className="text-center text-[13px] text-slate-400" style={{ marginTop: 6, marginBottom: 20 }}>
            Start mining and earning today
          </p>

          <hr style={{ borderColor: '#e2e8f0', marginBottom: 22 }} />

          {error && (
            <div
              className="text-[13px] font-medium text-center rounded-2xl"
              style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', color: '#dc2626', padding: '12px 16px', marginBottom: 18 }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleRegister}>

            {/* Full Name */}
            <div style={{ marginBottom: 14 }}>
              <input
                type="text"
                placeholder="Your full name"
                value={form.name}
                onChange={set('name')}
                style={inputStyle}
              />
            </div>

            {/* Mobile */}
            <div style={{ marginBottom: 14 }}>
              <div className="flex gap-2">
                <select
                  value={form.countryCode}
                  onChange={set('countryCode')}
                  style={{
                    width: 148,
                    height: 52,
                    background: '#eff6ff',
                    border: '1.5px solid #bfdbfe',
                    borderRadius: 16,
                    paddingLeft: 16,
                    paddingRight: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#334155',
                    cursor: 'pointer',
                    outline: 'none',
                    flexShrink: 0,
                  }}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.code} ({c.country})</option>
                  ))}
                </select>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="3001234567"
                  value={form.mobile}
                  onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value.replace(/[^0-9]/g, '') }))}
                  style={{ ...inputStyle, paddingLeft: 20 }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 14 }}>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={set('password')}
                  style={{ ...inputStyle, paddingRight: 52 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: 14 }}>
              <input
                type="password"
                placeholder="Repeat password"
                value={form.confirm}
                onChange={set('confirm')}
                style={inputStyle}
              />
            </div>

            {/* Referral */}
            <div style={{ marginBottom: 24 }}>
              <input
                type="text"
                placeholder="Referral code (optional)"
                value={form.referral}
                onChange={(e) => setForm((f) => ({ ...f, referral: e.target.value.toUpperCase() }))}
                style={{ ...inputStyle, textTransform: 'uppercase', letterSpacing: '0.08em' }}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-bold text-[16px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
              style={{
                height: 56,
                background: loading
                  ? '#93c5fd'
                  : 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)',
                borderRadius: 16,
                boxShadow: '0 8px 24px rgba(37,99,235,0.4)',
              }}
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : 'Create Account →'}
            </button>
          </form>

          <p className="text-center text-[13px] text-slate-400" style={{ marginTop: 20 }}>
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f8fafc' }}>
        <span className="w-10 h-10 rounded-full border-[3px] border-blue-500 border-t-transparent animate-spin block" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  )
}
