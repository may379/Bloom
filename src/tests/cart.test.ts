import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore } from '@/hooks/use-cart'
import { FlowerWithImages } from '@/types'

// ── Mock data ──────────────────────────────────────────────────
const mockCategory = {
  id: 'cat-1',
  name: "Valentine's Day",
  slug: 'valentines-day',
  description: 'Romantic flowers',
  image: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockFlower1: FlowerWithImages = {
  id: 'flower-1',
  name: 'Eternal Rose Bouquet',
  slug: 'eternal-rose-bouquet',
  description: 'Beautiful roses',
  price: '89.99' as any,
  comparePrice: '119.99' as any,
  stock: 25,
  categoryId: 'cat-1',
  featured: true,
  bestseller: true,
  isNew: false,
  occasion: ["Valentine's Day"],
  colors: ['Red', 'White'],
  tags: ['roses'],
  createdAt: new Date(),
  updatedAt: new Date(),
  category: mockCategory,
  images: [
    {
      id: 'img-1',
      flowerId: 'flower-1',
      url: '/images/eternal-rose-bouquet.jpg',
      alt: 'Roses',
      isPrimary: true,
      order: 0,
      createdAt: new Date(),
    },
  ],
}

const mockFlower2: FlowerWithImages = {
  id: 'flower-2',
  name: 'Blush Peony Dreams',
  slug: 'blush-peony-dreams',
  description: 'Beautiful peonies',
  price: '74.99' as any,
  comparePrice: null,
  stock: 10,
  categoryId: 'cat-1',
  featured: false,
  bestseller: false,
  isNew: true,
  occasion: ['Anniversary'],
  colors: ['Pink'],
  tags: ['peonies'],
  createdAt: new Date(),
  updatedAt: new Date(),
  category: mockCategory,
  images: [],
}

// ── Tests ──────────────────────────────────────────────────────
describe('Cart Store', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] })
  })

  describe('addItem', () => {
    it('adds a flower to the cart', () => {
      useCartStore.getState().addItem(mockFlower1)
      const state = useCartStore.getState()
      expect(state.items).toHaveLength(1)
      expect(state.items[0].flower.id).toBe('flower-1')
      expect(state.items[0].quantity).toBe(1)
    })

    it('adds with default quantity 1', () => {
      useCartStore.getState().addItem(mockFlower1)
      expect(useCartStore.getState().items[0].quantity).toBe(1)
    })

    it('adds with custom quantity', () => {
      useCartStore.getState().addItem(mockFlower1, 3)
      expect(useCartStore.getState().items[0].quantity).toBe(3)
    })

    it('increments quantity when same flower added again', () => {
      useCartStore.getState().addItem(mockFlower1)
      useCartStore.getState().addItem(mockFlower1)
      const state = useCartStore.getState()
      expect(state.items).toHaveLength(1)
      expect(state.items[0].quantity).toBe(2)
    })

    it('adds two different flowers as separate items', () => {
      useCartStore.getState().addItem(mockFlower1)
      useCartStore.getState().addItem(mockFlower2)
      expect(useCartStore.getState().items).toHaveLength(2)
    })

    it('does not exceed stock limit', () => {
      useCartStore.getState().addItem(mockFlower2, 999) // stock is 10
      expect(useCartStore.getState().items[0].quantity).toBe(10)
    })
  })

  describe('removeItem', () => {
    it('removes a flower from the cart', () => {
      useCartStore.getState().addItem(mockFlower1)
      useCartStore.getState().removeItem('flower-1')
      expect(useCartStore.getState().items).toHaveLength(0)
    })

    it('removes only the correct flower', () => {
      useCartStore.getState().addItem(mockFlower1)
      useCartStore.getState().addItem(mockFlower2)
      useCartStore.getState().removeItem('flower-1')
      const state = useCartStore.getState()
      expect(state.items).toHaveLength(1)
      expect(state.items[0].flower.id).toBe('flower-2')
    })

    it('does nothing for a non-existent flower id', () => {
      useCartStore.getState().addItem(mockFlower1)
      useCartStore.getState().removeItem('non-existent')
      expect(useCartStore.getState().items).toHaveLength(1)
    })
  })

  describe('updateQuantity', () => {
    it('updates flower quantity', () => {
      useCartStore.getState().addItem(mockFlower1)
      useCartStore.getState().updateQuantity('flower-1', 5)
      expect(useCartStore.getState().items[0].quantity).toBe(5)
    })

    it('removes item when quantity set to 0', () => {
      useCartStore.getState().addItem(mockFlower1)
      useCartStore.getState().updateQuantity('flower-1', 0)
      expect(useCartStore.getState().items).toHaveLength(0)
    })

    it('removes item when quantity set to negative', () => {
      useCartStore.getState().addItem(mockFlower1)
      useCartStore.getState().updateQuantity('flower-1', -1)
      expect(useCartStore.getState().items).toHaveLength(0)
    })

    it('respects stock limit when updating', () => {
      useCartStore.getState().addItem(mockFlower2)
      useCartStore.getState().updateQuantity('flower-2', 999) // stock is 10
      expect(useCartStore.getState().items[0].quantity).toBe(10)
    })
  })

  describe('clearCart', () => {
    it('removes all items from cart', () => {
      useCartStore.getState().addItem(mockFlower1)
      useCartStore.getState().addItem(mockFlower2)
      useCartStore.getState().clearCart()
      expect(useCartStore.getState().items).toHaveLength(0)
    })

    it('clears an empty cart without error', () => {
      expect(() => useCartStore.getState().clearCart()).not.toThrow()
    })
  })

  describe('getTotal', () => {
    it('returns 0 for an empty cart', () => {
      expect(useCartStore.getState().getTotal()).toBe(0)
    })

    it('calculates total for a single item', () => {
      useCartStore.getState().addItem(mockFlower1)
      expect(useCartStore.getState().getTotal()).toBeCloseTo(89.99, 1)
    })

    it('calculates total for multiple items', () => {
      useCartStore.getState().addItem(mockFlower1) // 89.99
      useCartStore.getState().addItem(mockFlower2) // 74.99
      expect(useCartStore.getState().getTotal()).toBeCloseTo(164.98, 1)
    })

    it('calculates total with quantity greater than 1', () => {
      useCartStore.getState().addItem(mockFlower1, 2) // 89.99 x 2
      expect(useCartStore.getState().getTotal()).toBeCloseTo(179.98, 1)
    })
  })

  describe('getCount', () => {
    it('returns 0 for an empty cart', () => {
      expect(useCartStore.getState().getCount()).toBe(0)
    })

    it('returns 1 after adding one item', () => {
      useCartStore.getState().addItem(mockFlower1)
      expect(useCartStore.getState().getCount()).toBe(1)
    })

    it('returns the sum of all quantities', () => {
      useCartStore.getState().addItem(mockFlower1, 3)
      useCartStore.getState().addItem(mockFlower2, 2)
      expect(useCartStore.getState().getCount()).toBe(5)
    })
  })
})
