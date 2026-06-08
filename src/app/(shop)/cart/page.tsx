'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react'
import { useCartStore } from '@/hooks/use-cart'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore()
  const subtotal = getTotal()
  const shipping = subtotal >= 75 ? 0 : 9.99
  const tax = subtotal * 0.21
  const total = subtotal + shipping + tax

  if (items.length === 0) {
    return (
      <div className="pt-20 min-h-screen bg-[#fdfaf9] flex items-center justify-center">
        <div className="text-center py-20">
          <div className="text-7xl mb-6">🛒</div>
          <h2 className="font-serif text-3xl text-stone-800 mb-3">Your cart is empty</h2>
          <p className="text-stone-500 mb-8">Discover our beautiful bouquets and fill your cart with love.</p>
          <Link href="/shop" className="btn-bloom">
            <ShoppingBag className="w-4 h-4" />
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen bg-[#fdfaf9]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-10">
          <h1 className="font-serif text-4xl text-stone-800">My Cart</h1>
          <button onClick={clearCart} className="text-sm text-stone-400 hover:text-rose-500 transition-colors">
            Clear all
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => {
                const img = item.flower.images[0]
                const price = parseFloat(item.flower.price.toString())
                return (
                  <motion.div
                    key={item.flower.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    className="card-bloom p-4 flex gap-4"
                  >
                    {/* Image */}
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-rose-50">
                      {img ? (
                        <Image src={img.url} alt={item.flower.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">🌸</div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.flower.id}`}
                        className="font-serif text-lg text-stone-800 hover:text-rose-600 transition-colors block truncate"
                      >
                        {item.flower.name}
                      </Link>
                      <p className="text-xs text-rose-400 mt-0.5">{item.flower.category.name}</p>
                      <p className="text-rose-600 font-medium mt-2">{formatPrice(price)}</p>
                    </div>

                    {/* Quantity + Remove */}
                    <div className="flex flex-col items-end gap-3">
                      <button
                        onClick={() => removeItem(item.flower.id)}
                        className="text-stone-300 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-2 bg-rose-50 rounded-xl p-1">
                        <button
                          onClick={() => updateQuantity(item.flower.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white transition-all"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-medium text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.flower.id, item.quantity + 1)}
                          disabled={item.quantity >= item.flower.stock}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white transition-all disabled:opacity-40"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-sm font-medium text-stone-700">
                        {formatPrice(price * item.quantity)}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="card-bloom p-6 sticky top-28">
              <h2 className="font-serif text-xl text-stone-800 mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-stone-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-stone-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-emerald-600 font-medium' : ''}>
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-stone-600">
                  <span>VAT (21%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="border-t border-rose-100 pt-3 flex justify-between">
                  <span className="font-medium text-stone-800">Total</span>
                  <span className="font-serif text-xl text-rose-600">{formatPrice(total)}</span>
                </div>
              </div>

              {shipping > 0 && (
                <div className="bg-amber-50 rounded-2xl p-3 mb-6 text-xs text-amber-700">
                  <Tag className="w-3.5 h-3.5 inline mr-1" />
                  Add {formatPrice(75 - subtotal)} more for free delivery!
                </div>
              )}

              <Link href="/checkout" className="btn-bloom w-full justify-center group">
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/shop"
                className="block text-center text-sm text-stone-400 hover:text-rose-500 mt-4 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
