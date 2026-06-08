import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ProductDetail } from '@/components/shop/product-detail'
import { ProductCard } from '@/components/shop/product-card'

interface ProductPageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const flower = await prisma.flower.findUnique({
    where: { id: params.id },
    select: { name: true, description: true },
  })
  if (!flower) return { title: 'Not Found' }
  return {
    title: flower.name,
    description: flower.description.slice(0, 160),
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const flower = await prisma.flower.findUnique({
    where: { id: params.id },
    include: {
      images: { orderBy: { order: 'asc' } },
      category: true,
      reviews: {
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!flower) notFound()

  const related = await prisma.flower.findMany({
    where: {
      categoryId: flower.categoryId,
      id: { not: flower.id },
      stock: { gt: 0 },
    },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      category: true,
    },
    take: 4,
  })

  return (
    <div className="pt-20 min-h-screen bg-[#fdfaf9]">
      <ProductDetail flower={flower} />

      {related.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-3xl text-stone-800 mb-10 text-center">
              You Might Also Love
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((r) => (
                <ProductCard key={r.id} flower={r} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
