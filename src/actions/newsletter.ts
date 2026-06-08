'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { profileSchema } from '@/lib/validations'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

// Newsletter
export async function subscribeNewsletter(email: string) {
  await prisma.newsletterSubscriber.upsert({
    where: { email },
    update: { active: true },
    create: { email },
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
export async function createReview(flowerId: string, data: { rating: number; title?: string; body: string }) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error('Please sign in to leave a review')

  const review = await prisma.review.upsert({
    where: { flowerId_userId: { flowerId, userId: session.user.id } },
    update: data,
    create: {
      flowerId,
      userId: session.user.id,
      ...data,
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
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count(),
  ])

  return { users, total, pages: Math.ceil(total / limit) }
}
