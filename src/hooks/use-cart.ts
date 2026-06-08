'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { FlowerWithImages, CartItemLocal } from '@/types'

interface CartStore {
  items: CartItemLocal[]
  addItem: (flower: FlowerWithImages, quantity?: number) => void
  removeItem: (flowerId: string) => void
  updateQuantity: (flowerId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (flower, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.flower.id === flower.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.flower.id === flower.id
                  ? { ...i, quantity: Math.min(i.quantity + quantity, flower.stock) }
                  : i
              ),
            }
          }
          return { items: [...state.items, { flower, quantity: Math.min(quantity, flower.stock) }] }
        })
      },

      removeItem: (flowerId) => {
        set((state) => ({ items: state.items.filter((i) => i.flower.id !== flowerId) }))
      },

      updateQuantity: (flowerId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(flowerId)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.flower.id === flowerId
              ? { ...i, quantity: Math.min(quantity, i.flower.stock) }
              : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce(
          (acc, item) => acc + parseFloat(item.flower.price.toString()) * item.quantity,
          0
        )
      },

      getCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0)
      },
    }),
    {
      name: 'bloom-cart',
      version: 1,
    }
  )
)
