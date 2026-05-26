'use client'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

interface DialogProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

export function Dialog({ open, onClose, title, children, className }: DialogProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={cn(
        'relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl',
        className
      )}>
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-ink">{title}</h3>
            <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
              <X size={20} className="text-ink-soft" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
