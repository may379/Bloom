import { Flower, ProductImage, Category, Review, User, Order, OrderItem, CartItem, Cart } from '@prisma/client'

export type FlowerWithImages = Flower & {
  images: ProductImage[]
  category: Category
}

export type FlowerWithDetails = Flower & {
  images: ProductImage[]
  category: Category
  reviews: (Review & { user: Pick<User, 'id' | 'name' | 'image'> })[]
  _count?: { reviews: number }
}

export type CartWithItems = Cart & {
  items: (CartItem & {
    flower: FlowerWithImages
  })[]
}

export type OrderWithItems = Order & {
  items: (OrderItem & {
    flower: Pick<Flower, 'id' | 'name' | 'slug'>
  })[]
  user?: Pick<User, 'id' | 'name' | 'email'>
}

export type CategoryWithCount = Category & {
  _count: { flowers: number }
}

export interface CartState {
  items: CartItemLocal[]
  addItem: (flower: FlowerWithImages, quantity?: number) => void
  removeItem: (flowerId: string) => void
  updateQuantity: (flowerId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getCount: () => number
}

export interface CartItemLocal {
  flower: FlowerWithImages
  quantity: number
}

export interface RecommendationInput {
  occasion: string
  budget: string
  colors: string[]
  personality?: string
}

export interface RecommendationResult {
  flower: FlowerWithImages
  explanation: string
  suggestedFlowers: string[]
  confidence: number
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: string
    }
  }

  interface User {
    role: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
  }
}
