'use server'

import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { registerSchema } from '@/lib/validations'
import { z } from 'zod'

export async function registerUser(data: z.infer<typeof registerSchema>) {
  const validated = registerSchema.parse(data)
  const email = validated.email.trim().toLowerCase()
  const name = validated.name.trim()

  const existing = await prisma.user.findUnique({
    where: { email },
  })

  if (existing) {
    throw new Error('An account with this email already exists')
  }

  const hashed = await bcrypt.hash(validated.password, 12)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
    },
  })

  return { id: user.id, email: user.email, name: user.name }
}
