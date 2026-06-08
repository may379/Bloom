'use server'

import { prisma } from '@/lib/prisma'
import { RecommendationInput, RecommendationResult } from '@/types'

// Smart recommendation logic — ready to swap for OpenAI API
export async function getAIRecommendation(input: RecommendationInput): Promise<RecommendationResult[]> {
  const { occasion, budget, colors } = input

  // Parse budget
  const [minBudget, maxBudget] = budget === 'under-50'
    ? [0, 50]
    : budget === '50-100'
    ? [50, 100]
    : budget === '100-150'
    ? [100, 150]
    : [150, 999]

  // Find matching flowers
  const flowers = await prisma.flower.findMany({
    where: {
      stock: { gt: 0 },
      price: { gte: minBudget, lte: maxBudget },
      ...(occasion !== 'any' && {
        occasion: { hasSome: [occasion] },
      }),
      ...(colors.length > 0 && {
        colors: { hasSome: colors },
      }),
    },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      category: true,
    },
    take: 20,
  })

  if (!flowers.length) {
    // Fallback: just get flowers in budget
    const fallback = await prisma.flower.findMany({
      where: {
        stock: { gt: 0 },
        price: { gte: minBudget, lte: maxBudget },
      },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        category: true,
      },
      take: 10,
    })
    return scoreAndReturn(fallback, input)
  }

  return scoreAndReturn(flowers, input)
}

function scoreAndReturn(flowers: any[], input: RecommendationInput): RecommendationResult[] {
  const { occasion, colors } = input

  const scored = flowers.map((flower) => {
    let score = 50

    // Occasion match
    if (flower.occasion?.includes(occasion)) score += 30
    if (flower.featured) score += 10
    if (flower.bestseller) score += 8

    // Color match
    const matchedColors = colors.filter((c) =>
      flower.colors?.some((fc: string) => fc.toLowerCase() === c.toLowerCase())
    )
    score += matchedColors.length * 10

    // Stock availability bonus
    if (flower.stock > 10) score += 5

    // New products slight boost
    if (flower.isNew) score += 5

    return { flower, score }
  })

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score)

  // Return top 3 with explanations
  return scored.slice(0, 3).map(({ flower, score }) => ({
    flower,
    explanation: generateExplanation(flower, input),
    suggestedFlowers: generateSuggestedFlowers(flower),
    confidence: Math.min(Math.round((score / 100) * 100), 98),
  }))
}

function generateExplanation(flower: any, input: RecommendationInput): string {
  const { occasion, budget, colors } = input

  const occasionPhrases: Record<string, string> = {
    'Wedding': 'perfect for creating an unforgettable wedding atmosphere',
    'Anniversary': 'ideal for celebrating your beautiful love story',
    'Birthday': 'guaranteed to make their birthday truly special',
    "Mother's Day": "a heartfelt way to show your mother how much she means to you",
    "Valentine's Day": 'the perfect expression of passionate, romantic love',
    'any': 'a versatile and stunning choice for any special moment',
  }

  const colorMatch = colors.length > 0 && flower.colors?.some((c: string) => 
    colors.includes(c.toLowerCase())
  )

  let explanation = `The **${flower.name}** is ${occasionPhrases[occasion] || occasionPhrases['any']}. `

  if (colorMatch) {
    explanation += `It beautifully incorporates ${flower.colors.slice(0, 2).join(' and ').toLowerCase()} tones that match your preference. `
  }

  if (flower.bestseller) {
    explanation += `This is one of our most-loved arrangements, cherished by thousands of customers. `
  }

  if (flower.isNew) {
    explanation += `It's a fresh addition to our collection, featuring the finest seasonal blooms. `
  }

  explanation += `At ${parseFloat(flower.price.toString()).toLocaleString('en-EU', { style: 'currency', currency: 'EUR' })}, it fits perfectly within your budget.`

  return explanation
}

function generateSuggestedFlowers(flower: any): string[] {
  const suggestions: Record<string, string[]> = {
    'Wedding': ['White Orchids', 'Garden Roses', 'Stephanotis', 'Lily of the Valley'],
    'Anniversary': ['Long-stem Roses', 'Peonies', 'Red Tulips', 'Calla Lilies'],
    'Birthday': ['Gerbera Daisies', 'Sunflowers', 'Ranunculus', 'Sweet William'],
    "Mother's Day": ['Peonies', 'Pink Carnations', 'Lavender', 'Freesias'],
    "Valentine's Day": ['Red Roses', 'Red Tulips', 'Anemones', 'Chocolate Cosmos'],
  }

  return suggestions[flower.occasion?.[0]] || ['Roses', 'Peonies', 'Ranunculus', 'Eucalyptus']
}
