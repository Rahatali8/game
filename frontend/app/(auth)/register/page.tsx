'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
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
    background: '#eef2ff',
    border: 'none',
    borderRadius: 50,
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
      style={{ background: '#eef0f5' }}
    >
      <div
        className="w-full max-w-[480px] bg-white rounded-[25px]"
        style={{ boxShadow: '0 16px 56px rgba(0,0,0,0.13)' }}
      >
        {/* HEADER */}
        <div
          className="flex flex-col items-center px-6 sm:px-14"
          style={{ paddingTop: 36, paddingBottom: 20 }}
        >
          <h1 className="text-[21px] font-black tracking-widest" style={{ color: '#8B1A1A' }}>
            CLOUD FIRE
          </h1>
        </div>

        {/* FORM */}
        <div className="px-4 sm:px-8" style={{ paddingBottom: 40 }}>
          <h2 className="text-[28px] font-extrabold text-center" style={{ color: '#e53935' }}>
            Create Account
          </h2>
          <p className="text-center text-[13px] text-slate-400" style={{ marginTop: 6, marginBottom: 20 }}>
            Start mining and earning today
          </p>

          <hr style={{ borderColor: '#e5e7eb', marginBottom: 22 }} />

          {error && (
            <div
              className="text-[13px] font-medium text-center rounded-2xl"
              style={{ background: '#fff5f5', border: '1.5px solid #fca5a5', color: '#dc2626', padding: '12px 16px', marginBottom: 18 }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleRegister}>

            {/* Full Name */}
            <div style={{ marginBottom: 18 , borderRadius: 15}}>
              <input
                type="text"
                placeholder="Your full name"
                value={form.name}
                onChange={set('name')}
                style={inputStyle}
              />
            </div>

            {/* Mobile */}
            <div style={{ marginBottom: 18 }}>
              <div className="flex gap-2">
                <select
                  value={form.countryCode}
                  onChange={set('countryCode')}
                  style={{
                    width: 148,
                    height: 52,
                    background: '#eef2ff',
                    border: 'none',
                    borderRadius: 50,
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
            <div style={{ marginBottom: 18 }}>
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: 18 }}>
              
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
                placeholder="Enter code if you have one"
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
                  ? '#ef9a9a'
                  : 'linear-gradient(135deg, #c62828 0%, #e53935 50%, #ef5350 100%)',
                borderRadius: 50,
                boxShadow: '0 8px 22px rgba(229,57,53,0.4)',
              }}
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : 'Create Account →'}
            </button>
          </form>

          <p className="text-center text-[13px] text-slate-400" style={{ marginTop: 20 }}>
            Already have an account?{' '}
            <Link href="/login" className="font-bold hover:underline" style={{ color: '#e53935' }}>
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#eef0f5' }}>
        <span className="w-10 h-10 rounded-full border-[3px] border-red-500 border-t-transparent animate-spin block" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  )
}
