import { describe, it, expect } from 'vitest'
import {
  loginSchema,
  registerSchema,
  checkoutSchema,
  profileSchema,
  newsletterSchema,
  reviewSchema,
} from '@/lib/validations'

// ── loginSchema ──────────────────────────────────────────────
describe('loginSchema', () => {
  it('validates correct credentials', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'password123',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: 'password123',
    })
    expect(result.success).toBe(false)
  })

  it('rejects short password', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: '123',
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty fields', () => {
    const result = loginSchema.safeParse({ email: '', password: '' })
    expect(result.success).toBe(false)
  })
})

// ── registerSchema ───────────────────────────────────────────
describe('registerSchema', () => {
  const validData = {
    name: 'Sophie Laurent',
    email: 'sophie@example.com',
    password: 'SecurePass123!',
    confirmPassword: 'SecurePass123!',
  }

  it('validates correct registration data', () => {
    const result = registerSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('rejects mismatched passwords', () => {
    const result = registerSchema.safeParse({
      ...validData,
      confirmPassword: 'DifferentPass123!',
    })
    expect(result.success).toBe(false)
  })

  it('rejects name shorter than 2 characters', () => {
    const result = registerSchema.safeParse({ ...validData, name: 'A' })
    expect(result.success).toBe(false)
  })

  it('rejects password shorter than 8 characters', () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: 'short',
      confirmPassword: 'short',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email format', () => {
    const result = registerSchema.safeParse({ ...validData, email: 'invalid-email' })
    expect(result.success).toBe(false)
  })
})

// ── checkoutSchema ───────────────────────────────────────────
describe('checkoutSchema', () => {
  const validCheckout = {
    firstName: 'Sophie',
    lastName: 'Laurent',
    email: 'sophie@example.com',
    phone: '+216 20888549',
    address: '45 Bloemenstraat',
    city: 'Amsterdam',
    country: 'Netherlands',
    postalCode: '1012 AB',
  }

  it('validates complete checkout data', () => {
    const result = checkoutSchema.safeParse(validCheckout)
    expect(result.success).toBe(true)
  })

  it('validates without optional phone', () => {
    const { phone, ...withoutPhone } = validCheckout
    const result = checkoutSchema.safeParse(withoutPhone)
    expect(result.success).toBe(true)
  })

  it('rejects missing address', () => {
    const { address, ...withoutAddress } = validCheckout
    const result = checkoutSchema.safeParse(withoutAddress)
    expect(result.success).toBe(false)
  })

  it('rejects missing city', () => {
    const { city, ...withoutCity } = validCheckout
    const result = checkoutSchema.safeParse(withoutCity)
    expect(result.success).toBe(false)
  })

  it('rejects invalid email', () => {
    const result = checkoutSchema.safeParse({ ...validCheckout, email: 'not-valid' })
    expect(result.success).toBe(false)
  })

  it('accepts optional notes field', () => {
    const result = checkoutSchema.safeParse({
      ...validCheckout,
      notes: 'Please deliver between 9-12am',
    })
    expect(result.success).toBe(true)
    expect(result.data?.notes).toBe('Please deliver between 9-12am')
  })
})

// ── profileSchema ────────────────────────────────────────────
describe('profileSchema', () => {
  it('validates complete profile data', () => {
    const result = profileSchema.safeParse({
      name: 'Sophie Laurent',
      phone: '+216 20888549',
      address: '45 Bloemenstraat',
      city: 'Amsterdam',
      country: 'Netherlands',
      postalCode: '1012 AB',
    })
    expect(result.success).toBe(true)
  })

  it('validates with only required name', () => {
    const result = profileSchema.safeParse({ name: 'Sophie' })
    expect(result.success).toBe(true)
  })

  it('rejects name shorter than 2 characters', () => {
    const result = profileSchema.safeParse({ name: 'S' })
    expect(result.success).toBe(false)
  })
})

// ── newsletterSchema ─────────────────────────────────────────
describe('newsletterSchema', () => {
  it('validates a correct email', () => {
    const result = newsletterSchema.safeParse({ email: 'flowers@example.com' })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = newsletterSchema.safeParse({ email: 'not-an-email' })
    expect(result.success).toBe(false)
  })

  it('rejects empty email', () => {
    const result = newsletterSchema.safeParse({ email: '' })
    expect(result.success).toBe(false)
  })
})

// ── reviewSchema ─────────────────────────────────────────────
describe('reviewSchema', () => {
  it('validates a correct review', () => {
    const result = reviewSchema.safeParse({
      rating: 5,
      title: 'Beautiful flowers!',
      body: 'The roses were absolutely stunning and lasted two weeks.',
    })
    expect(result.success).toBe(true)
  })

  it('validates review without optional title', () => {
    const result = reviewSchema.safeParse({
      rating: 4,
      body: 'Very beautiful arrangement, highly recommend.',
    })
    expect(result.success).toBe(true)
  })

  it('rejects rating below 1', () => {
    const result = reviewSchema.safeParse({
      rating: 0,
      body: 'This is a review body that is long enough.',
    })
    expect(result.success).toBe(false)
  })

  it('rejects rating above 5', () => {
    const result = reviewSchema.safeParse({
      rating: 6,
      body: 'This is a review body that is long enough.',
    })
    expect(result.success).toBe(false)
  })

  it('rejects body shorter than 10 characters', () => {
    const result = reviewSchema.safeParse({ rating: 5, body: 'Short' })
    expect(result.success).toBe(false)
  })
})
