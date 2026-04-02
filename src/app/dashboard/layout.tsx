'use client'

import React from 'react'
import Navigation from '@/components/sections/Navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex flex-col md:flex-row min-h-screen bg-background'>
      <Navigation />
      
      <main className='flex-1 md:ml-64 pb-20 md:pb-0'>
        {children}
      </main>
    </div>
  )
}
