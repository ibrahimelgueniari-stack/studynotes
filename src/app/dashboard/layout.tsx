'use client'

import React from 'react'
import Navigation from '@/components/sections/Navigation'
import { useAppStore } from '@/store/app'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { currentProfile } = useAppStore()

  if (!currentProfile) {
    return <div className='p-6'>Veuillez sélectionner un profil</div>
  }

  return (
    <div className='flex flex-col md:flex-row min-h-screen bg-background'>
      <Navigation profile={currentProfile} />
      
      <main className='flex-1 md:ml-64 pb-20 md:pb-0'>
        {children}
      </main>
    </div>
  )
}
