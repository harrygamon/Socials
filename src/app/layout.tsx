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
          <footer className="w-full max-w-2xl mx-auto mt-12 mb-4 px-4 flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-midnight/70">
            <a href="/privacy" className="hover:underline hover:text-purple transition-colors">Privacy Policy</a>
            <span className="hidden sm:inline mx-2">|</span>
            <a href="/terms" className="hover:underline hover:text-purple transition-colors">Terms of Service</a>
          </footer>
        </Providers>
      </body>
    </html>
  )
} 