'use client'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', loading, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none'

    const variants = {
      default: 'bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white',
      outline: 'border-2 border-brand-600 text-brand-600 hover:bg-brand-50 bg-transparent',
      ghost: 'text-brand-600 hover:bg-brand-50 bg-transparent',
      danger: 'bg-danger hover:bg-red-600 text-white',
      success: 'bg-success hover:bg-emerald-600 text-white',
    }

    const sizes = {
      sm: 'h-9 px-4 text-sm rounded-xl',
      md: 'h-11 px-5 text-sm rounded-xl',
      lg: 'h-13 px-6 text-base rounded-2xl',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading ? (
          <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2" />
        ) : null}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button }
