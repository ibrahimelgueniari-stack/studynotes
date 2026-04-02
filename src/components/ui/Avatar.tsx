'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  initials: string
  color: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  isClickable?: boolean
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ initials, color, size = 'md', isClickable = false, className, ...props }, ref) => {
    const sizeClasses = {
      sm: 'w-8 h-8 text-xs',
      md: 'w-12 h-12 text-sm',
      lg: 'w-16 h-16 text-lg',
      xl: 'w-24 h-24 text-3xl',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-full flex items-center justify-center font-bold text-white transition-transform duration-250',
          sizeClasses[size],
          isClickable && 'cursor-pointer hover:scale-110 shadow-lg',
          className
        )}
        style={{ backgroundColor: color }}
        {...props}
      >
        {initials}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'

export default Avatar
