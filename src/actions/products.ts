'use server'

import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { productSchema } from '@/lib/validations'
import { slugify } from '@/lib/utils'
import { z } from 'zod'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }
  return session
}

export async function createProduct(data: z.infer<typeof productSchema>) {
  await requireAdmin()
  const validated = productSchema.parse(data)
  const { images, ...rest } = validated

  const flower = await prisma.flower.create({
    data: {
      ...rest,
      slug: slugify(rest.name) + '-' + Date.now(),
      price: rest.price,
      comparePrice: rest.comparePrice || null,
      images: {
        create: images.map((img, i) => ({ ...img, order: i })),
      },
    },
    include: { images: true, category: true },
  })

  revalidatePath('/shop')
  revalidatePath('/admin/products')
  return flower
}

export async function updateProduct(id: string, data: z.infer<typeof productSchema>) {
  await requireAdmin()
  const validated = productSchema.parse(data)
  const { images, ...rest } = validated

  // Delete old images
  await prisma.productImage.deleteMany({ where: { flowerId: id } })

  const flower = await prisma.flower.update({
    where: { id },
    data: {
      ...rest,
      price: rest.price,
      comparePrice: rest.comparePrice || null,
      images: {
        create: images.map((img, i) => ({ ...img, order: i })),
      },
    },
    include: { images: true, category: true },
  })

  revalidatePath('/shop')
  revalidatePath(`/product/${id}`)
  revalidatePath('/admin/products')
  return flower
}

export async function deleteProduct(id: string) {
  await requireAdmin()

  await prisma.flower.delete({ where: { id } })

  revalidatePath('/shop')
  revalidatePath('/admin/products')
}

export async function getProducts(params?: {
  category?: string
  search?: string
  sort?: string
  page?: number
  limit?: number
  featured?: boolean
}) {
  const {
    category,
    search,
    sort = 'newest',
    page = 1,
    limit = 12,
    featured,
  } = params || {}

  const where: any = { stock: { gte: 0 } }

  if (category) {
    const cat = await prisma.category.findFirst({ where: { slug: category } })
    if (cat) where.categoryId = cat.id
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { tags: { hasSome: [search.toLowerCase()] } },
    ]
  }

  if (featured !== undefined) where.featured = featured

  const orderBy: any = {
    newest: { createdAt: 'desc' },
    'price-asc': { price: 'asc' },
    'price-desc': { price: 'desc' },
    popular: { createdAt: 'desc' },
  }[sort] || { createdAt: 'desc' }

  const [flowers, total] = await Promise.all([
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
  ])

  return { flowers, total, pages: Math.ceil(total / limit) }
}

export async function getProductById(id: string) {
  return prisma.flower.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: 'asc' } },
      category: true,
      reviews: {
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  })
}
