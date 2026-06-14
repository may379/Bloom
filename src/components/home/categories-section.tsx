'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { CategoryWithCount } from '@/types'

interface CategoriesSectionProps {
  categories: CategoryWithCount[]
}

const categoryEmojis: Record<string, string> = {
  wedding: '💍',
  birthday: '🎂',
  anniversary: '💕',
  'mothers-day': '👑',
  'valentines-day': '❤️',
  sympathy: '🕊️',
  'luxury-collection': '💎',
  'seasonal-collection': '🍂',
  'corporate-gifts': '💼',
  plants: '🪴',
  'dried-flowers': '🌾',
}




export function CategoriesSection({ categories }: CategoriesSectionProps) {
  return (
    <section className="py-24 bg-gradient-to-b from-rose-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-tag mb-3"
          >
            Every occasion
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-title mb-4"
          >
            Shop by Occasion
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="section-subtitle max-w-md mx-auto"
          >
            Whether it's a whisper of love or a grand gesture, we have the perfect arrangement.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link href={`/shop?category=${cat.slug}`}>
                <div className="group relative rounded-3xl overflow-hidden aspect-[3/4] cursor-pointer shadow-card hover:shadow-bloom-lg transition-all duration-500 hover:-translate-y-2">
                  {/* Background image */}
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-rose-100 to-pink-200" />
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-stone-900/20 to-transparent" />

                  {/* Emoji */}
                  <div className="absolute top-4 left-0 right-0 flex justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-xl shadow-sm">
                      {categoryEmojis[cat.slug] || '🌸'}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                    <h3 className="font-serif text-white text-lg leading-tight">{cat.name}</h3>
                    <p className="text-white/70 text-xs mt-1">{cat._count.flowers} arrangements</p>
                    <div className="mt-3 h-0 overflow-hidden group-hover:h-8 transition-all duration-300">
                      <span className="text-xs font-medium text-rose-300 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                        Shop Now →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
