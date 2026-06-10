import Link from 'next/link'
import { Flower2 } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="w-9 h-9 rounded-full bg-rose-400 flex items-center justify-center shadow-bloom">
            <Flower2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-serif text-lg font-medium text-stone-800">Bloom</span>
            <span className="font-script text-xs text-rose-400">& Blossom</span>
          </div>
        </Link>
      </header>

      {/* Decorative blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-rose-200/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-pink-200/30 blur-3xl" />
      </div>

      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>

      <footer className="p-6 text-center text-xs text-stone-400">
        © 2026 Bloom & Blossom. Made with 🌸 .
      </footer>
    </div>
  )
}
