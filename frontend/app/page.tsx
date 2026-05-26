'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Root() {
  const router = useRouter()
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    router.replace(token ? '/home' : '/login')
  }, [router])
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-soft">
      <div className="w-10 h-10 rounded-full border-4 border-brand-600 border-t-transparent animate-spin" />
    </div>
  )
}
