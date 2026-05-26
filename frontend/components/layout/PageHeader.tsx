'use client'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

interface PageHeaderProps {
  title: string
  back?: boolean | string
  right?: React.ReactNode
}

export function PageHeader({ title, back = true, right }: PageHeaderProps) {
  const router = useRouter()

  const handleBack = () => {
    if (typeof back === 'string') router.push(back)
    else router.back()
  }

  return (
    <div className="flex items-center h-14 px-4 bg-white border-b border-slate-100 sticky top-0 z-20">
      {back && (
        <button onClick={handleBack} className="p-2 -ml-2 rounded-xl hover:bg-slate-100 transition-colors mr-2">
          <ChevronLeft size={22} className="text-ink" />
        </button>
      )}
      <h1 className="flex-1 text-base font-bold text-ink">{title}</h1>
      {right && <div>{right}</div>}
    </div>
  )
}
