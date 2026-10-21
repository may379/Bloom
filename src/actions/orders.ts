'use server'

import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkoutSchema } from '@/lib/validations'
import { z } from 'zod'
import { CartItemLocal } from '@/types'
import { OrderStatus } from '@prisma/client'

export async function createOrder(
  shippingData: z.infer<typeof checkoutSchema>,
  cartItems: CartItemLocal[]
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('Please sign in to place an order')
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    throw new Error('Cart is empty')
  }

  const validated = checkoutSchema.parse(shippingData)

  // Treat all cart data as untrusted: only accept product IDs and quantities.
  // Prices, names, images, and stock are always read from the database.
  const quantities = new Map<string, number>()
  for (const item of cartItems) {
    const flowerId = item?.flower?.id
    const quantity = item?.quantity

    if (
      typeof flowerId !== 'string' ||
      flowerId.length === 0 ||
      !Number.isSafeInteger(quantity) ||
      quantity < 1 ||
      quantity > 99
    ) {
      throw new Error('Your cart contains an invalid item')
    }

    quantities.set(flowerId, (quantities.get(flowerId) ?? 0) + quantity)
  }

  for (const quantity of quantities.values()) {
    if (quantity > 99) throw new Error('Maximum quantity per product is 99')
  }

  const order = await prisma.$transaction(async (tx) => {
    const flowers = await tx.flower.findMany({
      where: { id: { in: [...quantities.keys()] } },
      include: { images: { where: { isPrimary: true }, take: 1 } },
    })

    if (flowers.length !== quantities.size) {
      throw new Error('One or more products are no longer available')
    }

    const flowerById = new Map(flowers.map((flower) => [flower.id, flower]))
    const orderLines = [...quantities.entries()].map(([flowerId, quantity]) => {
      const flower = flowerById.get(flowerId)
      if (!flower) throw new Error('One or more products are no longer available')
      if (flower.stock < quantity) {
        throw new Error(`Not enough stock for ${flower.name}`)
      }
      return { flower, quantity }
    })

    // Calculate money in cents to avoid floating-point total discrepancies.
    const subtotalCents = orderLines.reduce(
      (sum, line) => sum + Math.round(Number(line.flower.price) * 100) * line.quantity,
      0
    )
    const shippingCents = subtotalCents >= 7500 ? 0 : 999
    const taxCents = Math.round(subtotalCents * 0.21)
    const totalCents = subtotalCents + shippingCents + taxCents

    // Conditional stock updates prevent two concurrent checkouts overselling stock.
    for (const line of orderLines) {
      const updated = await tx.flower.updateMany({
        where: { id: line.flower.id, stock: { gte: line.quantity } },
        data: { stock: { decrement: line.quantity } },
      })
      if (updated.count !== 1) {
        throw new Error(`Not enough stock for ${line.flower.name}`)
      }
    }

    return tx.order.create({
      data: {
        userId: session.user.id,
        ...validated,
        subtotal: subtotalCents / 100,
        shipping: shippingCents / 100,
        tax: taxCents / 100,
        total: totalCents / 100,
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        items: {
          create: orderLines.map(({ flower, quantity }) => ({
            flowerId: flower.id,
            quantity,
            price: flower.price,
            name: flower.name,
            image: flower.images[0]?.url,
          })),
        },
      },
      include: { items: true },
    })
  })

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

  const safePage = Number.isSafeInteger(page) && page > 0 ? page : 1
  const safeLimit = Number.isSafeInteger(limit) && limit > 0 ? Math.min(limit, 100) : 20

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { flower: { select: { id: true, name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (safePage - 1) * safeLimit,
      take: safeLimit,
    }),
    prisma.order.count(),
  ])

  return { orders, total, pages: Math.ceil(total / safeLimit) }
}

export async function updateOrderStatus(id: string, status: string) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') throw new Error('Unauthorized')
  if (typeof id !== 'string' || id.length === 0) throw new Error('Invalid order')
  if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
    throw new Error('Invalid order status')
  }

  const order = await prisma.order.update({
    where: { id },
    data: { status: status as OrderStatus },
  })

  revalidatePath('/admin/orders')
  revalidatePath('/orders')
  return order
}
