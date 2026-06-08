import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Shield, User } from 'lucide-react'

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-stone-800">Users</h1>
        <p className="text-stone-500 text-sm mt-1">{users.length} registered users</p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50 border-b border-stone-100">
              <tr>
                {['User', 'Email', 'Role', 'Orders', 'Joined', 'Status'].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-serif font-medium text-sm flex-shrink-0">
                        {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-stone-800">
                        {user.name || '—'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-500">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                      user.role === 'ADMIN'
                        ? 'bg-rose-50 text-rose-600'
                        : 'bg-stone-100 text-stone-600'
                    }`}>
                      {user.role === 'ADMIN'
                        ? <><Shield className="w-3 h-3" /> Admin</>
                        : <><User className="w-3 h-3" /> User</>
                      }
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-600">
                    {user._count.orders}
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
