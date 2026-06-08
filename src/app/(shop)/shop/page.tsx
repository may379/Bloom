import { Metadata } from 'next'
import { Suspense } from 'react'
import { ShopContent } from '@/components/shop/shop-content'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Shop All Bouquets',
  description: 'Browse our complete collection of premium handcrafted bouquets.',
}

interface ShopPageProps {
  searchParams: {
    category?: string
    search?: string
    sort?: string
    page?: string
    minPrice?: string
    maxPrice?: string
  }
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const page = parseInt(searchParams.page || '1')
  const limit = 12

  const where: any = { stock: { gte: 0 } }

  if (searchParams.category) {
    const cat = await prisma.category.findFirst({ where: { slug: searchParams.category } })
    if (cat) where.categoryId = cat.id
  }

  if (searchParams.search) {
    where.OR = [
      { name: { contains: searchParams.search, mode: 'insensitive' } },
      { description: { contains: searchParams.search, mode: 'insensitive' } },
    ]
  }

  if (searchParams.minPrice || searchParams.maxPrice) {
    where.price = {}
    if (searchParams.minPrice) where.price.gte = parseFloat(searchParams.minPrice)
    if (searchParams.maxPrice) where.price.lte = parseFloat(searchParams.maxPrice)
  }

  const sortMap: Record<string, any> = {
    newest: { createdAt: 'desc' },
    'price-asc': { price: 'asc' },
    'price-desc': { price: 'desc' },
    popular: { createdAt: 'desc' },
  }
  const orderBy = sortMap[searchParams.sort || 'newest']

  const [flowers, total, categories] = await Promise.all([
    prisma.flower.findMany({
      where,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        category: true,
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.flower.count({ where }),
    prisma.category.findMany({ include: { _count: { select: { flowers: true } } } }),
  ])

  return (
    <div className="pt-20 min-h-screen bg-[#fdfaf9]">
      <ShopContent
        flowers={flowers}
        total={total}
        pages={Math.ceil(total / limit)}
        currentPage={page}
        categories={categories}
        searchParams={searchParams}
      />
    </div>
  )
}
