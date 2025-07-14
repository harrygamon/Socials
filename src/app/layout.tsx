import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from 'react-hot-toast'

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
    <html lang="en">
      <body>
        <Providers>
          {children}
          <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        </Providers>
      </body>
    </html>
  )
} 