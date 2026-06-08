import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { DeleteProductButton } from '@/components/admin/delete-product-button'

export default async function AdminProductsPage() {
  const flowers = await prisma.flower.findMany({
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      category: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-stone-800">Products</h1>
          <p className="text-stone-500 text-sm mt-1">{flowers.length} bouquets in catalogue</p>
        </div>
        <Link href="/admin/products/new" className="btn-bloom text-sm">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50 border-b border-stone-100">
              <tr>
                {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {flowers.map((flower) => {
                const img = flower.images[0]
                const price = parseFloat(flower.price.toString())
                return (
                  <tr key={flower.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-rose-50 flex-shrink-0">
                          {img ? (
                            <Image src={img.url} alt={flower.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl">🌸</div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-stone-800 line-clamp-1">{flower.name}</p>
                          <div className="flex gap-1 mt-0.5">
                            {flower.featured && <span className="text-[10px] text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-full">Featured</span>}
                            {flower.bestseller && <span className="text-[10px] text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded-full">Best Seller</span>}
                            {flower.isNew && <span className="text-[10px] text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-full">New</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-500">{flower.category.name}</td>
                    <td className="px-6 py-4 text-sm font-medium text-rose-600">{formatPrice(price)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        flower.stock > 10 ? 'bg-emerald-50 text-emerald-600'
                        : flower.stock > 0 ? 'bg-amber-50 text-amber-600'
                        : 'bg-red-50 text-red-600'
                      }`}>
                        {flower.stock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        flower.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-stone-100 text-stone-500'
                      }`}>
                        {flower.stock > 0 ? 'Active' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/products/${flower.id}`}
                          className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-rose-50 flex items-center justify-center text-stone-500 hover:text-rose-600 transition-all"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                        <DeleteProductButton id={flower.id} name={flower.name} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
