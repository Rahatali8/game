import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftSlot?: React.ReactNode
  rightSlot?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftSlot, rightSlot, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && <label className="text-sm font-medium text-ink">{label}</label>}
        <div className="relative flex items-center">
          {leftSlot && <span className="absolute left-3 text-ink-muted">{leftSlot}</span>}
          <input
            ref={ref}
            className={cn(
              'w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-sm text-ink placeholder:text-ink-muted',
              'focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100',
              'transition-all duration-200',
              leftSlot && 'pl-10',
              rightSlot && 'pr-10',
              error && 'border-danger focus:border-danger focus:ring-red-100',
              className
            )}
            {...props}
          />
          {rightSlot && <span className="absolute right-3 text-ink-muted">{rightSlot}</span>}
        </div>
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
