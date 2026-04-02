'use client';

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/contexts/AuthContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

// Note: Can't use metadata in client component, define at page level
// export const metadata: Metadata = {
//   title: 'StudyNotes - Fiches d\'étude',
//   description: 'Plateforme privée de fiches d\'étude pour vous et vos amis',
//   viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='fr'>
      <head>
        <meta charSet='utf-8' />
        <meta name='theme-color' content='#3b82f6' />
        <title>StudyNotes - Fiches d&apos;étude</title>
        <meta name='description' content='Plateforme privée de fiches d&apos;étude pour vous et vos amis' />
        <meta name='viewport' content='width=device-width, initial-scale=1, viewport-fit=cover' />
      </head>
      <body className={`${inter.className} bg-slate-950 text-slate-100 antialiased`}>
        <AuthProvider>
          <div className='min-h-screen'>
            {children}
          </div>
          <Toaster position='top-center' theme='dark' />
        </AuthProvider>
      </body>
    </html>
  )
}
