'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Pickaxe, Wallet, MessageCircle, User } from 'lucide-react'

const items = [
  { href: '/home', icon: Home, label: 'Home' },
  { href: '/product', icon: Pickaxe, label: 'Mine' },
  { href: '/asset', icon: Wallet, label: 'Wallet' },
  { href: '/message', icon: MessageCircle, label: 'Chat' },
  { href: '/me', icon: User, label: 'Profile' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around"
      style={{ height: '68px', background: 'linear-gradient(135deg, #0f1e4d 0%, #030b1c 100%)' }}>
      {items.map(({ href, icon: Icon, label }) => {
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center justify-center flex-1 h-full gap-1"
          >
            <Icon
              className="text-white transition-all duration-200"
              style={{
                width: active ? 28 : 22,
                height: active ? 28 : 22,
                opacity: active ? 1 : 0.65,
                filter: active ? 'drop-shadow(0 0 8px rgba(96,165,250,0.8))' : 'none',
              }}
            />
            <span className="text-white text-[10px]" style={{ opacity: active ? 1 : 0.5 }}>
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
