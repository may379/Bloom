'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useCartStore } from '@/hooks/use-cart'
import { FlowerWithImages } from '@/types'
import { formatPrice, calculateDiscount } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  flower: FlowerWithImages
  className?: string
}

export function ProductCard({ flower, className }: ProductCardProps) {
  const [wished, setWished] = useState(false)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)
  
  const primaryImage = flower.images.find((i) => i.isPrimary) || flower.images[0]
  const price = parseFloat(flower.price.toString())
  const comparePrice = flower.comparePrice ? parseFloat(flower.comparePrice.toString()) : null
  const discount = comparePrice ? calculateDiscount(price, comparePrice) : null

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(flower)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <Link href={`/product/${flower.id}`}>
      <div className={cn('product-card cursor-pointer', className)}>
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-rose-50">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || flower.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">🌸</div>
          )}

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount && (
              <span className="badge-bloom bg-rose-500 text-white text-[10px] font-bold px-2.5 py-1">
                -{discount}%
              </span>
            )}
            {flower.isNew && (
              <span className="badge-bloom bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1">
                New
              </span>
            )}
            {flower.bestseller && !flower.isNew && (
              <span className="badge-bloom bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1">
                Best Seller
              </span>
            )}
          </div>

          {/* Wish button */}
          <button
            onClick={(e) => { e.preventDefault(); setWished(!wished) }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-all"
          >
            <Heart className={cn('w-4 h-4 transition-colors', wished ? 'fill-rose-500 text-rose-500' : 'text-stone-400')} />
          </button>

          {/* Quick actions on hover */}
          <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              disabled={flower.stock === 0}
              className={cn(
                'w-full rounded-xl py-2.5 text-xs font-semibold flex items-center justify-center gap-2 transition-all',
                added
                  ? 'bg-emerald-500 text-white'
                  : flower.stock === 0
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-white text-stone-800 hover:bg-rose-500 hover:text-white'
              )}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              {flower.stock === 0 ? 'Out of Stock' : added ? 'Added! ✓' : 'Add to Cart'}
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-[10px] font-medium text-rose-400 uppercase tracking-wider mb-1">
            {flower.category.name}
          </p>
          <h3 className="font-serif text-lg text-stone-800 leading-snug mb-2 group-hover:text-rose-600 transition-colors">
            {flower.name}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="price-tag text-lg">{formatPrice(price)}</span>
              {comparePrice && (
                <span className="price-compare text-xs">{formatPrice(comparePrice)}</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs text-stone-500">4.9</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
