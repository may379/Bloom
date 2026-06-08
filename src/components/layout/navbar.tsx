'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { ShoppingBag, Heart, User, Menu, X, Flower2, ChevronDown, LogOut, Settings, Package } from 'lucide-react'
import { useCartStore } from '@/hooks/use-cart'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/shop', label: 'Shop' },
  { href: '/shop?category=wedding', label: 'Wedding' },
  { href: '/shop?category=anniversary', label: 'Anniversary' },
  { href: '/ai-recommendation', label: 'AI Stylist ✨' },
]

export function Navbar() {
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const count = useCartStore((s) => s.getCount())

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-white/90 backdrop-blur-lg shadow-sm border-b border-rose-100/50'
          : 'bg-transparent'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-full bg-rose-400 flex items-center justify-center shadow-bloom transition-transform group-hover:scale-110">
              <Flower2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-serif text-lg font-medium text-stone-800">Bloom</span>
              <span className="font-script text-xs text-rose-400">&amp; Blossom</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-stone-600 hover:text-rose-500 transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-rose-400 transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 rounded-full text-stone-600 hover:text-rose-500 hover:bg-rose-50 transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              {count > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-400 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                >
                  {count > 9 ? '9+' : count}
                </motion.span>
              )}
            </Link>

            {/* User */}
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-full pl-2 pr-3 py-1.5 bg-rose-50 hover:bg-rose-100 transition-colors text-stone-700 text-sm font-medium"
                >
                  <div className="w-6 h-6 rounded-full bg-rose-400 flex items-center justify-center text-white text-xs font-bold">
                    {session.user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:block">{session.user?.name?.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-bloom-lg border border-rose-100 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-rose-50">
                        <p className="text-xs text-stone-500">Signed in as</p>
                        <p className="text-sm font-medium text-stone-800 truncate">{session.user?.email}</p>
                      </div>
                      <div className="p-2">
                        <Link href="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-stone-700 hover:bg-rose-50 transition-colors">
                          <User className="w-4 h-4 text-rose-400" /> My Profile
                        </Link>
                        <Link href="/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-stone-700 hover:bg-rose-50 transition-colors">
                          <Package className="w-4 h-4 text-rose-400" /> My Orders
                        </Link>
                        {session.user?.role === 'ADMIN' && (
                          <Link href="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-stone-700 hover:bg-rose-50 transition-colors">
                            <Settings className="w-4 h-4 text-rose-400" /> Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={() => { signOut(); setUserMenuOpen(false) }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login" className="btn-bloom text-sm px-5 py-2">
                Sign In
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-full text-stone-600 hover:bg-rose-50"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-lg border-t border-rose-100"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-medium text-stone-700 hover:text-rose-500 transition-colors py-1"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
