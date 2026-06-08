import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { ProductForm } from '@/components/admin/product-form'

interface EditProductPageProps {
  params: { id: string }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const [flower, categories] = await Promise.all([
    prisma.flower.findUnique({
      where: { id: params.id },
      include: { images: { orderBy: { order: 'asc' } } },
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  if (!flower) notFound()

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="text-stone-400 hover:text-stone-600 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-serif text-3xl text-stone-800">Edit Product</h1>
          <p className="text-stone-500 text-sm mt-1">{flower.name}</p>
        </div>
      </div>
      <ProductForm product={flower} categories={categories} />
    </div>
  )
}
