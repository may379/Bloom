'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { CheckCircle, CreditCard, Lock, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/hooks/use-cart'
import { createOrder } from '@/actions/orders'
import { checkoutSchema, CheckoutInput } from '@/lib/validations'
import { formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'

export default function CheckoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { items, getTotal, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  const subtotal = getTotal()
  const shipping = subtotal >= 75 ? 0 : 9.99
  const tax = subtotal * 0.21
  const total = subtotal + shipping + tax

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: session?.user?.email || '',
      firstName: session?.user?.name?.split(' ')[0] || '',
      lastName: session?.user?.name?.split(' ').slice(1).join(' ') || '',
      country: 'Netherlands',
    },
  })

  if (!session) {
    return (
      <div className="pt-20 min-h-screen bg-[#fdfaf9] flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-2xl text-stone-800 mb-4">Please sign in to checkout</h2>
          <Link href="/login" className="btn-bloom">Sign In</Link>
        </div>
      </div>
    )
  }

  if (items.length === 0 && !success) {
    return (
      <div className="pt-20 min-h-screen bg-[#fdfaf9] flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-2xl text-stone-800 mb-4">Your cart is empty</h2>
          <Link href="/shop" className="btn-bloom">
            <ShoppingBag className="w-4 h-4" /> Shop Now
          </Link>
        </div>
      </div>
    )
  }

  if (success && orderId) {
    return (
      <div className="pt-20 min-h-screen bg-[#fdfaf9] flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card-bloom p-12 text-center max-w-md mx-4"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="font-serif text-3xl text-stone-800 mb-3">Order Placed! 🌸</h2>
          <p className="text-stone-500 mb-6">
            Thank you for your order. We'll prepare your bouquet with love and deliver it within 2 business days.
          </p>
          <p className="text-xs text-stone-400 mb-8">Order #{orderId.slice(-8).toUpperCase()}</p>
          <div className="flex flex-col gap-3">
            <Link href={`/orders/${orderId}`} className="btn-bloom w-full justify-center">
              Track My Order
            </Link>
            <Link href="/shop" className="btn-outline-bloom w-full justify-center">
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  async function onSubmit(data: CheckoutInput) {
    if (!items.length) return
    setLoading(true)
    try {
      const order = await createOrder(data, items)
      setOrderId(order.id)
      clearCart()
      setSuccess(true)
    } catch (err: any) {
      alert(err.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-20 min-h-screen bg-[#fdfaf9]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-serif text-4xl text-stone-800 mb-10">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Contact */}
              <div className="card-bloom p-6">
                <h2 className="font-serif text-xl text-stone-800 mb-6">Contact Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-2">First Name</label>
                    <input {...register('firstName')} className="input-bloom" placeholder="Sophie" />
                    {errors.firstName && <p className="text-rose-500 text-xs mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-2">Last Name</label>
                    <input {...register('lastName')} className="input-bloom" placeholder="Laurent" />
                    {errors.lastName && <p className="text-rose-500 text-xs mt-1">{errors.lastName.message}</p>}
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-stone-600 mb-2">Email</label>
                    <input {...register('email')} type="email" className="input-bloom" placeholder="your@email.com" />
                    {errors.email && <p className="text-rose-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-stone-600 mb-2">Phone (optional)</label>
                    <input {...register('phone')} className="input-bloom" placeholder="+31 6 12345678" />
                  </div>
                </div>
              </div>

              {/* Shipping */}
              <div className="card-bloom p-6">
                <h2 className="font-serif text-xl text-stone-800 mb-6">Shipping Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-stone-600 mb-2">Street Address</label>
                    <input {...register('address')} className="input-bloom" placeholder="Bloemenstraat 45" />
                    {errors.address && <p className="text-rose-500 text-xs mt-1">{errors.address.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-2">City</label>
                    <input {...register('city')} className="input-bloom" placeholder="Amsterdam" />
                    {errors.city && <p className="text-rose-500 text-xs mt-1">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-2">Postal Code</label>
                    <input {...register('postalCode')} className="input-bloom" placeholder="1012 AB" />
                    {errors.postalCode && <p className="text-rose-500 text-xs mt-1">{errors.postalCode.message}</p>}
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-stone-600 mb-2">Country</label>
                    <input {...register('country')} className="input-bloom" placeholder="Netherlands" />
                    {errors.country && <p className="text-rose-500 text-xs mt-1">{errors.country.message}</p>}
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-stone-600 mb-2">Order Notes (optional)</label>
                    <textarea {...register('notes')} rows={3} className="input-bloom resize-none" placeholder="Special delivery instructions..." />
                  </div>
                </div>
              </div>

              {/* Payment placeholder */}
              <div className="card-bloom p-6">
                <h2 className="font-serif text-xl text-stone-800 mb-2">Payment</h2>
                <p className="text-xs text-stone-400 mb-4">Stripe integration ready — demo mode active</p>
                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100 flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-stone-400" />
                  <span className="text-sm text-stone-500">•••• •••• •••• 4242 (Test Card)</span>
                  <Lock className="w-4 h-4 text-stone-300 ml-auto" />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'w-full btn-bloom text-base py-4 justify-center',
                  loading && 'opacity-70 cursor-not-allowed'
                )}
              >
                <Lock className="w-4 h-4" />
                {loading ? 'Placing Order...' : `Place Order · ${formatPrice(total)}`}
              </motion.button>
            </form>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="card-bloom p-6 sticky top-28">
              <h2 className="font-serif text-xl text-stone-800 mb-6">Your Order</h2>
              <div className="space-y-4 mb-6">
                {items.map((item) => {
                  const img = item.flower.images[0]
                  const price = parseFloat(item.flower.price.toString())
                  return (
                    <div key={item.flower.id} className="flex gap-3">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-rose-50 flex-shrink-0">
                        {img ? (
                          <Image src={img.url} alt={item.flower.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">🌸</div>
                        )}
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-400 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-stone-800 truncate">{item.flower.name}</p>
                        <p className="text-xs text-rose-500 mt-0.5">{formatPrice(price * item.quantity)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="border-t border-rose-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-stone-600">
                  <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-stone-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-emerald-600' : ''}>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm text-stone-600">
                  <span>VAT (21%)</span><span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between font-medium text-stone-800 pt-2 border-t border-rose-100">
                  <span>Total</span>
                  <span className="font-serif text-xl text-rose-600">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
