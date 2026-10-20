import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export const checkoutSchema = z.object({
  firstName: z.string().trim().min(2, 'First name is required'),
  lastName: z.string().trim().min(2, 'Last name is required'),
  email: z.string().trim().toLowerCase().email('Valid email is required'),
  phone: z.string().trim().optional(),
  address: z.string().trim().min(5, 'Address is required'),
  city: z.string().trim().min(2, 'City is required'),
  country: z.string().trim().min(2, 'Country is required'),
  postalCode: z.string().trim().min(4, 'Postal code is required'),
  notes: z.string().optional(),
})

export const profileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  address: z.string().trim().optional(),
  city: z.string().trim().optional(),
  country: z.string().trim().optional(),
  postalCode: z.string().trim().optional(),
})

export const productSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().min(10, 'Description is required'),
  price: z.coerce.number().positive('Price must be positive'),
  comparePrice: z.coerce.number().positive().optional().nullable(),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  categoryId: z.string().min(1, 'Category is required'),
  featured: z.boolean().default(false),
  bestseller: z.boolean().default(false),
  isNew: z.boolean().default(false),
  occasion: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  images: z.array(z.object({
    url: z.string().url('Valid URL is required'),
    alt: z.string().optional(),
    isPrimary: z.boolean().default(false),
  })).default([]),
})

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().optional(),
  body: z.string().trim().min(10, 'Review must be at least 10 characters'),
})

export const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email'),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type ProductInput = z.infer<typeof productSchema>
export type ReviewInput = z.infer<typeof reviewSchema>
export type NewsletterInput = z.infer<typeof newsletterSchema>
