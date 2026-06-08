import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, MapPin, Package, User } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils'
import { OrderStatusSelect } from '@/components/admin/order-status-select'

interface AdminOrderDetailPageProps {
  params: { id: string }
}

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      items: {
        include: {
          flower: { select: { id: true, name: true, slug: true } },
        },
      },
    },
  })

  if (!order) notFound()

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/orders" className="text-stone-400 hover:text-stone-600 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="font-serif text-3xl text-stone-800">
            Order #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-stone-500 text-sm mt-1">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`badge-bloom text-sm px-4 py-2 ${ORDER_STATUS_COLORS[order.status]}`}>
            {ORDER_STATUS_LABELS[order.status]}
          </span>
          <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-stone-100 p-6">
            <h3 className="font-medium text-stone-800 mb-5 flex items-center gap-2">
              <Package className="w-4 h-4 text-rose-400" /> Items Ordered
            </h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3 border-b border-stone-50 last:border-0">
                  <div>
                    <Link
                      href={`/product/${item.flower.id}`}
                      className="text-sm font-medium text-stone-800 hover:text-rose-600 transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-stone-400 mt-0.5">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-rose-600">
                      {formatPrice(parseFloat(item.price.toString()) * item.quantity)}
                    </p>
                    <p className="text-xs text-stone-400">
                      {formatPrice(parseFloat(item.price.toString()))} each
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-6 pt-4 border-t border-stone-100 space-y-2">
              <div className="flex justify-between text-sm text-stone-600">
                <span>Subtotal</span>
                <span>{formatPrice(parseFloat(order.subtotal.toString()))}</span>
              </div>
              <div className="flex justify-between text-sm text-stone-600">
                <span>Shipping</span>
                <span className={parseFloat(order.shipping.toString()) === 0 ? 'text-emerald-600' : ''}>
                  {parseFloat(order.shipping.toString()) === 0
                    ? 'Free'
                    : formatPrice(parseFloat(order.shipping.toString()))}
                </span>
              </div>
              <div className="flex justify-between text-sm text-stone-600">
                <span>VAT (21%)</span>
                <span>{formatPrice(parseFloat(order.tax.toString()))}</span>
              </div>
              <div className="flex justify-between font-medium text-stone-800 pt-2 border-t border-stone-100">
                <span className="font-serif text-lg">Total</span>
                <span className="font-serif text-2xl text-rose-600">
                  {formatPrice(parseFloat(order.total.toString()))}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-2xl border border-stone-100 p-6">
            <h3 className="font-medium text-stone-800 mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-400" /> Shipping Address
            </h3>
            <div className="text-sm text-stone-600 space-y-1">
              <p className="font-medium text-stone-800">{order.firstName} {order.lastName}</p>
              <p>{order.address}</p>
              <p>{order.city}, {order.postalCode}</p>
              <p>{order.country}</p>
              {order.phone && <p className="text-rose-500 mt-2">{order.phone}</p>}
              <p className="text-rose-500">{order.email}</p>
            </div>
            {order.notes && (
              <div className="mt-4 p-3 bg-amber-50 rounded-xl">
                <p className="text-xs font-medium text-amber-700 mb-1">Customer Notes:</p>
                <p className="text-sm text-amber-600">{order.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Customer Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-stone-100 p-6">
            <h3 className="font-medium text-stone-800 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-rose-400" /> Customer
            </h3>
            {order.user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-serif font-medium">
                    {order.user.name?.[0] || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-stone-800">{order.user.name}</p>
                    <p className="text-xs text-stone-400">{order.user.email}</p>
                  </div>
                </div>
                <Link
                  href={`/admin/users`}
                  className="block text-xs text-rose-500 hover:text-rose-700 transition-colors mt-3"
                >
                  View customer profile →
                </Link>
              </div>
            ) : (
              <p className="text-sm text-stone-500">Guest order</p>
            )}
          </div>

          {/* Tracking */}
          <div className="bg-white rounded-2xl border border-stone-100 p-6">
            <h3 className="font-medium text-stone-800 mb-4">Tracking</h3>
            {order.trackingNumber ? (
              <div>
                <p className="text-xs text-stone-500 mb-1">Tracking Number</p>
                <p className="font-mono text-sm font-medium text-stone-800">{order.trackingNumber}</p>
              </div>
            ) : (
              <p className="text-sm text-stone-400">No tracking number yet</p>
            )}
            {order.estimatedDelivery && (
              <div className="mt-4">
                <p className="text-xs text-stone-500 mb-1">Estimated Delivery</p>
                <p className="text-sm text-stone-700">{formatDate(order.estimatedDelivery)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
