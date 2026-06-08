import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import { Flower2, LayoutDashboard, Package, ShoppingBag, Users, Tag, ArrowLeft } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-stone-900 min-h-screen flex flex-col fixed left-0 top-0 z-40">
        {/* Logo */}
        <div className="p-6 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-rose-400 flex items-center justify-center">
              <Flower2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-serif text-white text-sm">Bloom & Blossom</p>
              <p className="text-stone-400 text-[10px]">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-400 hover:text-white hover:bg-white/5 transition-all group"
            >
              <Icon className="w-4 h-4 group-hover:text-rose-400 transition-colors" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-stone-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-64 min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-stone-100 px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-serif font-medium text-sm">
              A
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-medium text-stone-800">Admin</p>
              <p className="text-[10px] text-stone-400">admin@bloomblossom.com</p>
            </div>
          </div>
        </header>

        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
