'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Sophie Laurent',
    location: 'Amsterdam, NL',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60',
    rating: 5,
    text: 'Bloom & Blossom made our anniversary unforgettable. The bouquet was breathtaking — every petal was perfect and the fragrance filled our entire home. Will never buy flowers anywhere else.',
    occasion: 'Anniversary',
  },
  {
    name: 'Emma Hoffmann',
    location: 'Berlin, DE',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60',
    rating: 5,
    text: 'I ordered the bridal bouquet for my wedding and received SO many compliments. The attention to detail is extraordinary. You can feel the craftsmanship in every stem.',
    occasion: 'Wedding',
  },
  {
    name: 'Lucas Van den Berg',
    location: 'Brussels, BE',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60',
    rating: 5,
    text: 'Sent flowers to my mother for her birthday and she called me in tears of joy. The quality is premium, delivery was on time, and the packaging made it feel like a luxury gift.',
    occasion: "Mother's Birthday",
  },
  {
    name: 'Marta Kowalski',
    location: 'Warsaw, PL',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60',
    rating: 5,
    text: 'The AI recommendation feature helped me choose the perfect bouquet for our 10th anniversary. The flowers lasted over two weeks! Incredibly impressed with Bloom & Blossom.',
    occasion: 'Anniversary',
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-rose-50/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-tag mb-3"
          >
            Love stories
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-title mb-4"
          >
            What Our Customers Say
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-bloom p-6 relative"
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-rose-200 fill-rose-100 mb-4" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star key={s} className="w-3.5 h-3.5 star-filled" />
                ))}
              </div>

              {/* Text */}
              <p className="text-sm text-stone-600 leading-relaxed mb-6 font-light italic">
                "{t.text}"
              </p>

              {/* Footer */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-rose-100">
                  <Image src={t.avatar} alt={t.name} width={40} height={40} className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-800">{t.name}</p>
                  <p className="text-xs text-stone-400">{t.location}</p>
                </div>
              </div>

              {/* Occasion badge */}
              <div className="absolute top-4 right-4">
                <span className="text-[10px] font-medium bg-rose-50 text-rose-500 px-2 py-1 rounded-full">
                  {t.occasion}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
