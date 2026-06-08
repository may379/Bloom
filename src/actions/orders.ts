'use server'

import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkoutSchema } from '@/lib/validations'
import { z } from 'zod'
import { CartItemLocal } from '@/types'

export async function createOrder(
  shippingData: z.infer<typeof checkoutSchema>,
  cartItems: CartItemLocal[]
) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error('Please sign in to place an order')
  if (!cartItems.length) throw new Error('Cart is empty')

  const validated = checkoutSchema.parse(shippingData)

  const subtotal = cartItems.reduce(
    (acc, item) => acc + parseFloat(item.flower.price.toString()) * item.quantity,
    0
  )
  const shipping = subtotal >= 75 ? 0 : 9.99
  const tax = subtotal * 0.21
  const total = subtotal + shipping + tax

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      ...validated,
      subtotal,
      shipping,
      tax,
      total,
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      items: {
        create: cartItems.map((item) => ({
          flowerId: item.flower.id,
          quantity: item.quantity,
          price: item.flower.price,
          name: item.flower.name,
          image: item.flower.images[0]?.url,
        })),
      },
    },
    include: { items: true },
  })

  // Update stock
  for (const item of cartItems) {
    await prisma.flower.update({
      where: { id: item.flower.id },
      data: { stock: { decrement: item.quantity } },
    })
  }

  revalidatePath('/orders')
  revalidatePath('/admin/orders')

  return order
}

export async function getUserOrders() {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error('Unauthorized')

  return prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { flower: { select: { id: true, name: true, slug: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getOrderById(id: string) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error('Unauthorized')

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { flower: { select: { id: true, name: true, slug: true } } },
      },
    },
  })

  if (!order) throw new Error('Order not found')
  if (order.userId !== session.user.id && session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  return order
}

export async function getAllOrders(page = 1, limit = 20) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') throw new Error('Unauthorized')

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { flower: { select: { id: true, name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count(),
  ])

  return { orders, total, pages: Math.ceil(total / limit) }
}

export async function updateOrderStatus(id: string, status: string) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') throw new Error('Unauthorized')

  const order = await prisma.order.update({
    where: { id },
    data: { status: status as any },
  })

  revalidatePath('/admin/orders')
  revalidatePath('/orders')
  return order
}
