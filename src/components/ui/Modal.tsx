'use client'

import React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
      <div className={cn('bg-surface-alt border border-border rounded-lg shadow-premium w-full mx-4', sizeClasses[size])}>
        <div className='flex items-center justify-between p-6 border-b border-border'>
          {title && <h2 className='text-lg font-semibold text-foreground'>{title}</h2>}
          <button
            onClick={onClose}
            className='p-1 hover:bg-surface-hover rounded transition-colors'
          >
            <X size={20} />
          </button>
        </div>
        <div className='p-6'>{children}</div>
      </div>
    </div>
  )
}

export default Modal
