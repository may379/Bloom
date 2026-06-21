import { describe, it, expect } from 'vitest'
import { formatPrice, slugify, calculateDiscount } from '@/lib/utils'

describe('formatPrice', () => {
  it('formats a number as EUR currency', () => {
    const result = formatPrice(89.99)
    expect(result).toContain('89')
    expect(result).toContain('99')
  })
})

describe('slugify', () => {
  it('converts spaces to hyphens and lowercases', () => {
    expect(slugify('Eternal Rose Bouquet')).toBe('eternal-rose-bouquet')
  })

  it('removes apostrophes', () => {
    expect(slugify("Mother's Day")).toBe('mothers-day')
  })
})

describe('calculateDiscount', () => {
  it('calculates percentage discount correctly', () => {
    expect(calculateDiscount(75, 100)).toBe(25)
  })
})
