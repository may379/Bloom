import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { Flower2 } from 'lucide-react'

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { flowers: true } } },
    orderBy: { name: 'asc' },
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-stone-800">Categories</h1>
        <p className="text-stone-500 text-sm mt-1">{categories.length} occasion categories</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-card">
            <div className="relative h-40 bg-rose-50">
              {cat.image ? (
                <Image src={cat.image} alt={cat.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Flower2 className="w-12 h-12 text-rose-200" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-3 left-4">
                <h3 className="font-serif text-white text-xl">{cat.name}</h3>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-stone-500 line-clamp-2">
                {cat.description || 'No description'}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-rose-500 font-medium">
                  {cat._count.flowers} bouquet{cat._count.flowers !== 1 ? 's' : ''}
                </span>
                <span className="text-xs text-stone-400 font-mono">{cat.slug}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
