'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Heart, Star, Truck, Shield, RotateCcw, Minus, Plus, ChevronLeft } from 'lucide-react'
import { useCartStore } from '@/hooks/use-cart'
import { formatPrice, calculateDiscount, formatDate, ORDER_STATUS_LABELS } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface ProductDetailProps {
  flower: any
}

export function ProductDetail({ flower }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [wished, setWished] = useState(false)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  const price = parseFloat(flower.price.toString())
  const comparePrice = flower.comparePrice ? parseFloat(flower.comparePrice.toString()) : null
  const discount = comparePrice ? calculateDiscount(price, comparePrice) : null
  const avgRating = flower.reviews.length
    ? flower.reviews.reduce((a: number, r: any) => a + r.rating, 0) / flower.reviews.length
    : null

  function handleAddToCart() {
    addItem(flower, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-stone-400 mb-8">
        <Link href="/shop" className="hover:text-rose-500 transition-colors flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Shop
        </Link>
        <span>/</span>
        <Link href={`/shop?category=${flower.category.slug}`} className="hover:text-rose-500 transition-colors">
          {flower.category.name}
        </Link>
        <span>/</span>
        <span className="text-stone-700 truncate">{flower.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-16">
        {/* Gallery */}
        <div className="space-y-4">
          {/* Main image */}
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-rose-50">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                {flower.images[selectedImage] ? (
                  <Image
                    src={flower.images[selectedImage].url}
                    alt={flower.images[selectedImage].alt || flower.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-8xl">🌸</div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {discount && (
                <span className="badge-bloom bg-rose-500 text-white px-3 py-1">-{discount}%</span>
              )}
              {flower.isNew && (
                <span className="badge-bloom bg-emerald-500 text-white px-3 py-1">New</span>
              )}
              {flower.bestseller && (
                <span className="badge-bloom bg-amber-500 text-white px-3 py-1">Best Seller</span>
              )}
            </div>

            {/* Wish button */}
            <button
              onClick={() => setWished(!wished)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:scale-110 transition-all"
            >
              <Heart className={cn('w-5 h-5', wished ? 'fill-rose-500 text-rose-500' : 'text-stone-400')} />
            </button>
          </div>

          {/* Thumbnails */}
          {flower.images.length > 1 && (
            <div className="flex gap-3">
              {flower.images.map((img: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    'relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all',
                    selectedImage === i ? 'border-rose-400 shadow-bloom' : 'border-transparent opacity-60 hover:opacity-100'
                  )}
                >
                  <Image src={img.url} alt={img.alt || ''} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <p className="section-tag mb-2">{flower.category.name}</p>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-stone-800 mb-4 leading-tight">
            {flower.name}
          </h1>

          {/* Rating */}
          {avgRating && (
            <div className="flex items-center gap-3 mb-6">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn('w-4 h-4', i < Math.round(avgRating) ? 'star-filled' : 'star-empty')}
                  />
                ))}
              </div>
              <span className="text-sm text-stone-500">
                {avgRating.toFixed(1)} ({flower.reviews.length} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="price-tag text-3xl">{formatPrice(price)}</span>
            {comparePrice && (
              <span className="price-compare">{formatPrice(comparePrice)}</span>
            )}
            {discount && (
              <span className="badge-bloom bg-rose-50 text-rose-500 border border-rose-200">
                Save {discount}%
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-stone-600 leading-relaxed mb-8 font-light">{flower.description}</p>

          {/* Details */}
          <div className="flex flex-wrap gap-2 mb-8">
            {flower.colors.map((c: string) => (
              <span key={c} className="badge-bloom bg-rose-50 text-rose-600 border border-rose-100">
                🎨 {c}
              </span>
            ))}
            {flower.occasion.map((o: string) => (
              <span key={o} className="badge-bloom bg-purple-50 text-purple-600 border border-purple-100">
                ✨ {o}
              </span>
            ))}
          </div>

          {/* Stock */}
          <div className="mb-6">
            {flower.stock > 10 ? (
              <p className="text-emerald-600 text-sm font-medium">✓ In Stock ({flower.stock} available)</p>
            ) : flower.stock > 0 ? (
              <p className="text-amber-600 text-sm font-medium">⚡ Only {flower.stock} left!</p>
            ) : (
              <p className="text-red-500 text-sm font-medium">✗ Out of Stock</p>
            )}
          </div>

          {/* Quantity + Add to Cart */}
          {flower.stock > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {/* Quantity */}
              <div className="flex items-center gap-0 bg-rose-50 rounded-2xl p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-stone-600 hover:bg-white hover:shadow-sm transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-serif text-lg text-stone-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(flower.stock, quantity + 1))}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-stone-600 hover:bg-white hover:shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to cart */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                className={cn(
                  'flex-1 flex items-center justify-center gap-3 rounded-2xl py-3.5 font-medium transition-all',
                  added
                    ? 'bg-emerald-500 text-white'
                    : 'btn-bloom'
                )}
              >
                <ShoppingBag className="w-5 h-5" />
                {added ? 'Added to Cart! ✓' : `Add to Cart · ${formatPrice(price * quantity)}`}
              </motion.button>
            </div>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-rose-100">
            {[
              { icon: Truck, label: 'Free Delivery', sub: 'Orders over €75' },
              { icon: Shield, label: 'Freshness Guaranteed', sub: '7 day guarantee' },
              { icon: RotateCcw, label: 'Easy Returns', sub: 'Within 24 hours' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="text-center">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-2">
                  <Icon className="w-5 h-5 text-rose-400" />
                </div>
                <p className="text-xs font-medium text-stone-700">{label}</p>
                <p className="text-[11px] text-stone-400">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      {flower.reviews.length > 0 && (
        <div className="mt-20">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-serif text-3xl text-stone-800">Customer Reviews</h2>
            {avgRating && (
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn('w-5 h-5', i < Math.round(avgRating) ? 'star-filled' : 'star-empty')} />
                  ))}
                </div>
                <span className="font-serif text-2xl text-stone-800">{avgRating.toFixed(1)}</span>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {flower.reviews.map((review: any) => (
              <div key={review.id} className="card-bloom p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-serif font-medium">
                      {review.user.name?.[0] || 'A'}
                    </div>
                    <div>
                      <p className="font-medium text-stone-800 text-sm">{review.user.name}</p>
                      <p className="text-xs text-stone-400">{formatDate(review.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 star-filled" />
                    ))}
                  </div>
                </div>
                {review.title && (
                  <p className="font-medium text-stone-800 mb-2 text-sm">{review.title}</p>
                )}
                <p className="text-stone-600 text-sm leading-relaxed font-light">{review.body}</p>
                {review.verified && (
                  <p className="text-[11px] text-emerald-600 mt-3">✓ Verified Purchase</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
