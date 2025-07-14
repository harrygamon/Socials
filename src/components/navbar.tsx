'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { signOut } from 'next-auth/react';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Discover', href: '/discover' },
  { name: 'Matches', href: '/matches' },
  { name: 'Messages', href: '/messages' },
  { name: 'Feed', href: '/feed' },
  { name: 'Profile', href: '/profile' },
  { name: 'Create Post', href: '/create-post' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, setTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-jelly-gradient bg-[length:200%_200%] animate-gradient-move shadow-lg rounded-b-2xl backdrop-blur border-b border-jelly-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 font-extrabold text-2xl text-jelly-600 drop-shadow">
            <span>Social</span>
          </Link>
          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-4 py-2 rounded-full font-semibold transition-all duration-150 text-base shadow-jelly hover:scale-105 hover:bg-jelly-100/60 hover:text-jelly-700 ${pathname === link.href ? 'bg-jelly-200 text-jelly-900' : 'text-jelly-50'}`}
              >
                {link.name}
              </Link>
            ))}
            {/* Logout button */}
            <button
              onClick={() => signOut()}
              className="px-4 py-2 rounded-full font-semibold transition-all duration-150 text-base shadow-jelly bg-red-500 hover:bg-red-600 text-white ml-2"
            >
              Logout
            </button>
            {/* Dark mode toggle */}
            <button
              className="ml-2 p-2 rounded-full bg-white/30 hover:bg-white/60 text-jelly-700 shadow"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
          {/* Mobile Nav Toggle */}
          <button className="md:hidden p-2 rounded-full bg-white/30 hover:bg-white/60 text-jelly-700 shadow" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {/* Mobile Nav Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white/90 dark:bg-jelly-900/90 border-t border-jelly-100 shadow-lg rounded-b-2xl">
          <div className="flex flex-col p-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-4 py-2 rounded-full font-semibold transition-all duration-150 text-base shadow-jelly hover:scale-105 hover:bg-jelly-100/60 hover:text-jelly-700 ${pathname === link.href ? 'bg-jelly-200 text-jelly-900' : 'text-jelly-700'}`}
                onClick={() => setMobileOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {/* Logout button */}
            <button
              onClick={() => { setMobileOpen(false); signOut(); }}
              className="mt-2 px-4 py-2 rounded-full font-semibold transition-all duration-150 text-base shadow-jelly bg-red-500 hover:bg-red-600 text-white"
            >
              Logout
            </button>
            <button
              className="mt-2 p-2 rounded-full bg-white/30 hover:bg-white/60 text-jelly-700 shadow"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      )}
    </nav>
  )
} 