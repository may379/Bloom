'use server'

import { prisma } from '@/lib/prisma'
import { RecommendationInput, RecommendationResult } from '@/types'

export async function getAIRecommendation(input: RecommendationInput): Promise<RecommendationResult[]> {
  const { occasion, budget, colors } = input

  // Parse budget range
  const [minBudget, maxBudget] = budget === 'under-50'
    ? [0, 50]
    : budget === '50-100'
    ? [50, 100]
    : budget === '100-150'
    ? [100, 150]
    : [150, 999]

  // Fetch available flowers from DB
  const flowers = await prisma.flower.findMany({
    where: {
      stock: { gt: 0 },
      price: { gte: minBudget, lte: maxBudget },
    },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      category: true,
    },
    take: 20,
  })

  if (!flowers.length) {
    return []
  }

  // Build catalogue summary for the AI
  const catalogue = flowers.map((f) => ({
    id: f.id,
    name: f.name,
    price: parseFloat(f.price.toString()),
    category: f.category.name,
    occasion: f.occasion,
    colors: f.colors,
    description: f.description.slice(0, 120),
    featured: f.featured,
    bestseller: f.bestseller,
  }))

  const prompt = `
You are an expert floral designer and boutique stylist at "Bloom & Blossom", a premium flower boutique.

A customer is looking for a bouquet with these preferences:
- Occasion: ${occasion}
- Budget: ${budget.replace('under-', 'under €').replace('-', ' – €').replace('over-', 'over €')}
- Preferred colors: ${colors.length > 0 ? colors.join(', ') : 'no preference'}

Here is our available catalogue (JSON):
${JSON.stringify(catalogue, null, 2)}

Your task:
1. Select the TOP 3 most suitable bouquets from the catalogue above (use only bouquets from this list)
2. For each bouquet, write a warm, romantic, and persuasive explanation (2-3 sentences) of why it's perfect for this customer
3. Suggest 4 flower names that would be in each arrangement (can be creative, not limited to catalogue)
4. Give a confidence score 0-100 for how well it matches

Respond ONLY with valid JSON in this exact format, no markdown, no extra text:
{
  "recommendations": [
    {
      "id": "flower_id_from_catalogue",
      "explanation": "warm romantic explanation here",
      "suggestedFlowers": ["Rose", "Peony", "Ranunculus", "Eucalyptus"],
      "confidence": 95
    }
  ]
}
`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert floral designer. Always respond with valid JSON only, no markdown.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      console.error('OpenAI API error:', response.status)
      return fallbackRecommendations(flowers, input)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return fallbackRecommendations(flowers, input)
    }

    // Parse JSON safely
    const cleaned = content.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned)
    const recs = parsed.recommendations || []

    // Map AI response back to flower objects
    const results: RecommendationResult[] = []

    for (const rec of recs) {
      const flower = flowers.find((f) => f.id === rec.id)
      if (!flower) continue
      results.push({
        flower,
        explanation: rec.explanation || '',
        suggestedFlowers: rec.suggestedFlowers || [],
        confidence: Math.min(rec.confidence || 80, 99),
      })
    }

    return results.length > 0 ? results : fallbackRecommendations(flowers, input)

  } catch (err) {
    console.error('OpenAI recommendation error:', err)
    // Graceful fallback to rule-based if OpenAI fails
    return fallbackRecommendations(flowers, input)
  }
}

// ── Fallback rule-based (used if OpenAI fails) ───────────────────────────────
function fallbackRecommendations(flowers: any[], input: RecommendationInput): RecommendationResult[] {
  const { occasion, colors } = input

  const scored = flowers.map((flower) => {
    let score = 50
    if (flower.occasion?.includes(occasion)) score += 30
    if (flower.featured) score += 10
    if (flower.bestseller) score += 8
    const matchedColors = colors.filter((c) =>
      flower.colors?.some((fc: string) => fc.toLowerCase() === c.toLowerCase())
    )
    score += matchedColors.length * 10
    if (flower.stock > 10) score += 5
    if (flower.isNew) score += 5
    return { flower, score }
  })

  scored.sort((a, b) => b.score - a.score)

  return scored.slice(0, 3).map(({ flower, score }) => ({
    flower,
    explanation: `The ${flower.name} is a wonderful choice for ${occasion}. This ${flower.category.name.toLowerCase()} arrangement is one of our most cherished bouquets, crafted with the finest seasonal blooms.`,
    suggestedFlowers: ['Roses', 'Peonies', 'Ranunculus', 'Eucalyptus'],
    confidence: Math.min(Math.round((score / 100) * 100), 92),
  }))
}

