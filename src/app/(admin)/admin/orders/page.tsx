import { prisma } from '@/lib/prisma'
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils'
import Link from 'next/link'
import { OrderStatusSelect } from '@/components/admin/order-status-select'

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-stone-800">Orders</h1>
        <p className="text-stone-500 text-sm mt-1">{orders.length} total orders</p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50 border-b border-stone-100">
              <tr>
                {['Order', 'Customer', 'Date', 'Items', 'Total', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-stone-700">
                      #{order.id.slice(-8).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-stone-800">{order.user?.name || order.firstName}</p>
                    <p className="text-xs text-stone-400">{order.user?.email || order.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-600">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-rose-600">
                      {formatPrice(parseFloat(order.total.toString()))}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-xs text-rose-500 hover:text-rose-700 font-medium transition-colors"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="text-center py-12 text-stone-400 text-sm">No orders yet</div>
          )}
        </div>
      </div>
    </div>
  )
}
