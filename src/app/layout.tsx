import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from 'react-hot-toast'
import { SessionProvider } from 'next-auth/react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Social - Modern Dating Platform',
  description: 'A modern social-dating platform inspired by Instagram, Facebook, Snapchat, and Twitter.',
  keywords: ['dating', 'social', 'platform', 'modern', 'nextjs'],
  authors: [{ name: 'Social Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <SessionProvider>{children}</SessionProvider>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--card)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
} 