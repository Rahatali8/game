'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BottomNav } from '@/components/layout/BottomNav'
import { useAuthStore } from '@/store/authStore'
import { isAuthenticated } from '@/lib/auth'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { hydrate } = useAuthStore()

  useEffect(() => {
    hydrate()
    if (!isAuthenticated()) {
      router.replace('/login')
    }
  }, [router, hydrate])

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-soft">
        <div className="w-10 h-10 rounded-full border-4 border-brand-600 border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-soft">
      <main className="max-w-md mx-auto pb-20">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
