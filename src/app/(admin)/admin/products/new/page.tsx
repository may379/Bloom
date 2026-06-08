import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { ProductForm } from '@/components/admin/product-form'

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="text-stone-400 hover:text-stone-600 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-serif text-3xl text-stone-800">New Product</h1>
          <p className="text-stone-500 text-sm mt-1">Add a new bouquet to your catalogue</p>
        </div>
      </div>
      <ProductForm categories={categories} />
    </div>
  )
}
