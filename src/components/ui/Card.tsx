'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  isHoverable?: boolean
  isPremium?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, isHoverable = true, isPremium = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg bg-surface-alt border border-border transition-all duration-250',
        isPremium && 'bg-glass border-glass shadow-premium',
        isHoverable && 'hover:border-primary hover:bg-surface-hover hover:shadow-lg',
        className
      )}
      {...props}
    />
  )
)

Card.displayName = 'Card'

export default Card
