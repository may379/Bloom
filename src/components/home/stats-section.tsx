'use client'

import { motion } from 'framer-motion'
import { Leaf, Truck, Award, Heart } from 'lucide-react'

const stats = [
  { icon: Heart, value: '2,400+', label: 'Happy Customers', color: 'text-rose-500' },
  { icon: Truck, value: '24h', label: 'Same Day Delivery', color: 'text-emerald-500' },
  { icon: Leaf, value: '100%', label: 'Fresh Flowers', color: 'text-green-500' },
  { icon: Award, value: '8+', label: 'Years of Excellence', color: 'text-amber-500' },
]

export function StatsSection() {
  return (
    <section className="py-16 bg-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className={`inline-flex w-14 h-14 rounded-2xl bg-white/5 items-center justify-center mb-4 ${stat.color}`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <p className="font-serif text-4xl text-white mb-1">{stat.value}</p>
              <p className="text-sm text-stone-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
