import { getAdminStats } from '@/actions/newsletter'
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils'
import { TrendingUp, Package, Users, ShoppingBag } from 'lucide-react'

export default async function AdminPage() {
  const stats = await getAdminStats()

  const statCards = [
    {
      label: 'Total Revenue',
      value: formatPrice(parseFloat(stats.totalRevenue.toString())),
      icon: TrendingUp,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders.toString(),
      icon: ShoppingBag,
      color: 'text-rose-500',
      bg: 'bg-rose-50',
    },
    {
      label: 'Customers',
      value: stats.totalCustomers.toString(),
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    {
      label: 'Products',
      value: stats.totalProducts.toString(),
      icon: Package,
      color: 'text-purple-500',
      bg: 'bg-purple-50',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-stone-800">Dashboard</h1>
        <p className="text-stone-500 text-sm mt-1">Welcome back to Bloom & Blossom admin</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-stone-500">{label}</p>
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
            </div>
            <p className="font-serif text-3xl text-stone-800">{value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-card overflow-hidden">
        <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between">
          <h2 className="font-serif text-xl text-stone-800">Recent Orders</h2>
          <a href="/admin/orders" className="text-sm text-rose-500 hover:text-rose-600 transition-colors">
            View all →
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50 border-b border-stone-100">
              <tr>
                {['Order', 'Customer', 'Date', 'Total', 'Status'].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {stats.recentOrders.map((order: any) => (
                <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-stone-700">
                    #{order.id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-stone-800">{order.user?.name || 'Guest'}</p>
                    <p className="text-xs text-stone-400">{order.user?.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-rose-600">
                    {formatPrice(parseFloat(order.total.toString()))}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge-bloom text-xs px-3 py-1 ${ORDER_STATUS_COLORS[order.status]}`}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {stats.recentOrders.length === 0 && (
            <div className="text-center py-12 text-stone-400 text-sm">No orders yet</div>
          )}
        </div>
      </div>
    </div>
  )
}
