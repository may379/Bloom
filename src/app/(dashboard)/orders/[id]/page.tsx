import { redirect, notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getOrderById } from '@/actions/orders'
import Link from 'next/link'
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils'
import { ChevronLeft, Package, Truck, MapPin } from 'lucide-react'

interface OrderDetailPageProps {
  params: { id: string }
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  let order
  try {
    order = await getOrderById(params.id)
  } catch {
    notFound()
  }

  const steps = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']
  const currentStep = steps.indexOf(order.status)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/orders" className="flex items-center gap-2 text-sm text-stone-400 hover:text-rose-500 transition-colors mb-8">
        <ChevronLeft className="w-4 h-4" /> Back to Orders
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-stone-800">
            Order #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-stone-400 text-sm mt-1">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <span className={`badge-bloom text-sm px-4 py-2 ${ORDER_STATUS_COLORS[order.status]}`}>
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>

      {/* Progress Tracker */}
      {!['CANCELLED', 'REFUNDED'].includes(order.status) && (
        <div className="card-bloom p-6 mb-6">
          <h3 className="font-serif text-lg text-stone-800 mb-6">Order Progress</h3>
          <div className="relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-rose-100">
              <div
                className="h-full bg-rose-400 transition-all"
                style={{ width: `${Math.max(0, (currentStep / (steps.length - 1)) * 100)}%` }}
              />
            </div>
            <div className="relative flex justify-between">
              {steps.map((step, i) => (
                <div key={step} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-all ${
                    i <= currentStep
                      ? 'bg-rose-400 text-white shadow-bloom'
                      : 'bg-white border-2 border-rose-100 text-stone-300'
                  }`}>
                    {i < currentStep ? '✓' : i + 1}
                  </div>
                  <p className={`text-[10px] mt-2 text-center hidden sm:block ${
                    i <= currentStep ? 'text-rose-600 font-medium' : 'text-stone-400'
                  }`}>
                    {ORDER_STATUS_LABELS[step]}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {order.trackingNumber && (
            <p className="text-xs text-stone-500 mt-6 text-center">
              Tracking: <span className="font-mono font-medium text-stone-700">{order.trackingNumber}</span>
            </p>
          )}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Items */}
        <div className="card-bloom p-6">
          <h3 className="font-serif text-lg text-stone-800 mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-rose-400" /> Items Ordered
          </h3>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div>
                  <p className="text-stone-800 font-medium">{item.name}</p>
                  <p className="text-stone-400 text-xs">Qty: {item.quantity}</p>
                </div>
                <p className="text-rose-600 font-medium">
                  {formatPrice(parseFloat(item.price.toString()) * item.quantity)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping */}
        <div className="card-bloom p-6">
          <h3 className="font-serif text-lg text-stone-800 mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-400" /> Delivery Address
          </h3>
          <div className="text-sm text-stone-600 space-y-1">
            <p className="font-medium text-stone-800">{order.firstName} {order.lastName}</p>
            <p>{order.address}</p>
            <p>{order.city}, {order.postalCode}</p>
            <p>{order.country}</p>
            <p className="text-rose-500 mt-2">{order.email}</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="card-bloom p-6">
        <h3 className="font-serif text-lg text-stone-800 mb-4">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-stone-600">
            <span>Subtotal</span><span>{formatPrice(parseFloat(order.subtotal.toString()))}</span>
          </div>
          <div className="flex justify-between text-stone-600">
            <span>Shipping</span>
            <span className={parseFloat(order.shipping.toString()) === 0 ? 'text-emerald-600' : ''}>
              {parseFloat(order.shipping.toString()) === 0 ? 'Free' : formatPrice(parseFloat(order.shipping.toString()))}
            </span>
          </div>
          <div className="flex justify-between text-stone-600">
            <span>VAT</span><span>{formatPrice(parseFloat(order.tax.toString()))}</span>
          </div>
          <div className="flex justify-between font-medium text-stone-800 pt-3 border-t border-rose-100">
            <span className="font-serif text-lg">Total</span>
            <span className="font-serif text-2xl text-rose-600">
              {formatPrice(parseFloat(order.total.toString()))}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
