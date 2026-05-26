import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-surface-soft">
      <p className="text-6xl mb-4">🔍</p>
      <h1 className="text-2xl font-extrabold text-ink mb-2">Page Not Found</h1>
      <p className="text-ink-soft text-sm mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/home"
        className="px-6 py-3 bg-brand-600 text-white rounded-xl font-bold text-sm hover:bg-brand-700 transition-colors">
        Back to Home
      </Link>
    </div>
  )
}
