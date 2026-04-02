'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => (
    <div className='w-full'>
      {label && <label className='block text-sm font-medium text-foreground mb-2'>{label}</label>}
      <input
        ref={ref}
        className={cn(
          'w-full px-4 py-2.5 rounded-lg bg-surface border border-border text-foreground placeholder-muted-foreground',
          'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all',
          error && 'border-error focus:ring-error',
          className
        )}
        {...props}
      />
      {error && <p className='text-error text-sm mt-1'>{error}</p>}
    </div>
  )
)

Input.displayName = 'Input'

export default Input
