'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Sparkles } from 'lucide-react'

const floatingElements = [
  { emoji: '🌸', x: '10%', y: '20%', delay: 0, size: 'text-3xl' },
  { emoji: '🌹', x: '85%', y: '15%', delay: 0.5, size: 'text-4xl' },
  { emoji: '🌷', x: '5%', y: '65%', delay: 1, size: 'text-2xl' },
  { emoji: '💐', x: '90%', y: '70%', delay: 0.3, size: 'text-3xl' },
  { emoji: '🌺', x: '75%', y: '40%', delay: 0.8, size: 'text-2xl' },
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-rose-200/40 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-pink-200/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-purple-100/40 blur-3xl" />
      </div>

      {/* Floating petals */}
      {floatingElements.map((el, i) => (
        <motion.div
          key={i}
          className={`absolute ${el.size} select-none pointer-events-none`}
          style={{ left: el.x, top: el.y }}
          animate={{ y: [0, -15, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4 + i, repeat: Infinity, delay: el.delay, ease: 'easeInOut' }}
        >
          {el.emoji}
        </motion.div>
      ))}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 text-xs font-medium text-rose-600 border border-rose-100 shadow-sm mb-8"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Free delivery on orders over €75
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="font-script text-2xl text-rose-400 mb-3">Where love blooms</p>
              <h1 className="font-serif text-6xl md:text-7xl font-light text-stone-800 leading-[1.05] mb-6">
                Flowers that{' '}
                <span className="italic text-rose-500">speak</span>
                <br />
                from the{' '}
                <span className="relative inline-block">
                  heart
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                    <path d="M2 10 Q100 2 198 10" stroke="#fda4af" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
              <p className="text-lg text-stone-500 font-light leading-relaxed mb-10 max-w-lg">
                Exquisite handcrafted bouquets for life's most beautiful moments. Each arrangement is a love story, waiting to be gifted.
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link href="/shop" className="btn-bloom group text-base px-10 py-4">
                Explore Bouquets
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/ai-recommendation" className="btn-outline-bloom text-base px-10 py-4">
                <Sparkles className="w-4 h-4" />
                AI Stylist
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-4 mt-10 justify-center lg:justify-start"
            >
              <div className="flex -space-x-2">
                {['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40'].map((src, i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 border-white overflow-hidden">
                    <Image src={src} alt="Customer" width={36} height={36} className="object-cover" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  <span className="font-semibold text-stone-700">4.9/5</span> from 2,400+ happy customers
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right — Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative hidden lg:block"
          >
            {/* Main image container */}
            <div className="relative">
              {/* Decorative ring */}
              <div className="absolute inset-0 rounded-full border-2 border-rose-200/60 scale-110 animate-pulse" />

              {/* Main blob image */}
              <div className="relative w-[500px] h-[560px] mx-auto">
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
                    animation: 'morph 8s ease-in-out infinite',
                  }}
                >
                  <Image
                    src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800"
                    alt="Beautiful flower bouquet"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-rose-900/20 to-transparent" />
                </div>

                {/* Floating cards */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -left-12 top-24 glass rounded-2xl px-4 py-3 shadow-bloom"
                >
                  <p className="text-xs text-stone-500 font-sans">Best Seller</p>
                  <p className="font-serif text-sm font-medium text-stone-800">Eternal Rose Bouquet</p>
                  <p className="text-rose-500 text-sm font-medium mt-0.5">€89.99</p>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute -right-10 bottom-32 glass rounded-2xl px-4 py-3 shadow-bloom"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-base">✓</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-stone-800">Same Day Delivery</p>
                      <p className="text-[10px] text-stone-500">Order before 2PM</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-5 h-8 rounded-full border-2 border-rose-300 flex items-start justify-center pt-1">
          <div className="w-1 h-2 bg-rose-400 rounded-full" />
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes morph {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
        }
      `}</style>
    </section>
  )
}
