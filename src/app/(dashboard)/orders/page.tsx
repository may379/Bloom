import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserOrders } from '@/actions/orders'
import Link from 'next/link'
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils'
import { Package, ArrowRight } from 'lucide-react'

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const orders = await getUserOrders()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <p className="section-tag mb-2">My Account</p>
        <h1 className="font-serif text-4xl text-stone-800">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="card-bloom p-16 text-center">
          <Package className="w-16 h-16 text-rose-200 mx-auto mb-4" />
          <h3 className="font-serif text-2xl text-stone-700 mb-2">No orders yet</h3>
          <p className="text-stone-500 mb-6">When you place an order, it will appear here.</p>
          <Link href="/shop" className="btn-bloom">Browse Bouquets</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card-bloom p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-medium text-stone-800 text-sm">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <span className={`badge-bloom text-xs px-3 py-1 ${ORDER_STATUS_COLORS[order.status]}`}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400">{formatDate(order.createdAt)}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {order.items.slice(0, 3).map((item) => (
                      <span key={item.id} className="text-xs bg-rose-50 text-rose-600 px-2 py-1 rounded-full">
                        {item.name} ×{item.quantity}
                      </span>
                    ))}
                    {order.items.length > 3 && (
                      <span className="text-xs text-stone-400">+{order.items.length - 3} more</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-serif text-xl text-rose-600">{formatPrice(parseFloat(order.total.toString()))}</p>
                    <p className="text-xs text-stone-400">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                  </div>
                  <Link
                    href={`/orders/${order.id}`}
                    className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 hover:bg-rose-100 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
