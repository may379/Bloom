'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Sparkles } from 'lucide-react'
import { subscribeNewsletter } from '@/actions/newsletter'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      await subscribeNewsletter(email)
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-pink-50 to-purple-50" />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-rose-200/40 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-pink-200/40 blur-3xl" />

      <div className="relative max-w-2xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="w-16 h-16 rounded-3xl bg-rose-400 flex items-center justify-center mx-auto mb-6 shadow-bloom">
            <Mail className="w-8 h-8 text-white" />
          </div>

          <p className="section-tag mb-3">Stay in bloom</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-stone-800 mb-4">
            Love Letters from{' '}
            <span className="font-script text-rose-500">Our Garden</span>
          </h2>
          <p className="section-subtitle mb-8">
            Subscribe for seasonal bouquet drops, exclusive discounts, and floral inspiration delivered to your inbox.
          </p>

          {status === 'success' ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center justify-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-5 border border-rose-100 shadow-bloom"
            >
              <Sparkles className="w-5 h-5 text-rose-400" />
              <p className="font-serif text-lg text-stone-800">
                Welcome to the garden! 🌸
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="input-bloom flex-1"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-bloom whitespace-nowrap"
              >
                {status === 'loading' ? 'Joining...' : 'Subscribe'}
              </button>
            </form>
          )}

          {status === 'error' && (
            <p className="text-rose-500 text-sm mt-2">Something went wrong. Please try again.</p>
          )}

          <p className="text-xs text-stone-400 mt-4">
            🌿 No spam, ever. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
