'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { newsletterSchema, profileSchema, reviewSchema } from '@/lib/validations'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

// Newsletter
export async function subscribeNewsletter(email: string) {
  const validated = newsletterSchema.parse({ email: email.trim().toLowerCase() })
  await prisma.newsletterSubscriber.upsert({
    where: { email: validated.email },
    update: { active: true },
    create: { email: validated.email },
  })
}

// Profile
export async function updateProfile(data: z.infer<typeof profileSchema>) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error('Unauthorized')

  const validated = profileSchema.parse(data)

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: validated,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      city: true,
      country: true,
      postalCode: true,
      image: true,
      role: true,
      createdAt: true,
    },
  })

  revalidatePath('/profile')
  return user
}

export async function getProfile() {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error('Unauthorized')

  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      city: true,
      country: true,
      postalCode: true,
      image: true,
      role: true,
      createdAt: true,
    },
  })
}

// Reviews
export async function createReview(flowerId: string, data: z.infer<typeof reviewSchema>) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('Please sign in to leave a review')
  if (typeof flowerId !== 'string' || flowerId.length === 0) {
    throw new Error('Invalid product')
  }

  const validated = reviewSchema.parse(data)
  const reviewData = {
    rating: validated.rating,
    title: validated.title?.trim() || null,
    body: validated.body.trim(),
  }

  const flowerExists = await prisma.flower.findUnique({
    where: { id: flowerId },
    select: { id: true },
  })
  if (!flowerExists) throw new Error('Product not found')

  const review = await prisma.review.upsert({
    where: { flowerId_userId: { flowerId, userId: session.user.id } },
    update: reviewData,
    create: {
      flowerId,
      userId: session.user.id,
      ...reviewData,
    },
  })

  revalidatePath(`/product/${flowerId}`)
  return review
}

// Admin stats
export async function getAdminStats() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') throw new Error('Unauthorized')

  const [totalOrders, totalRevenue, totalCustomers, totalProducts, recentOrders] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.flower.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    }),
  ])

  return {
    totalOrders,
    totalRevenue: totalRevenue._sum.total || 0,
    totalCustomers,
    totalProducts,
    recentOrders,
  }
}

export async function getAdminUsers(page = 1, limit = 20) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') throw new Error('Unauthorized')

  const safePage = Number.isSafeInteger(page) && page > 0 ? page : 1
  const safeLimit = Number.isSafeInteger(limit) && limit > 0 ? Math.min(limit, 100) : 20

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (safePage - 1) * safeLimit,
      take: safeLimit,
    }),
    prisma.user.count(),
  ])

  return { users, total, pages: Math.ceil(total / safeLimit) }
}
