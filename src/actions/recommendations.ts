'use server'

import { prisma } from '@/lib/prisma'
import { RecommendationInput, RecommendationResult } from '@/types'

export class AIRecommendationError extends Error {}

export async function getAIRecommendation(
  input: RecommendationInput
): Promise<RecommendationResult[]> {
  if (!process.env.OPENAI_API_KEY) {
    throw new AIRecommendationError(
      'AI Stylist is currently unavailable: missing OpenAI API key.'
    )
  }

  const { occasion, budget, colors } = input

  const [minBudget, maxBudget] = budget === 'under-50'
    ? [0, 50]
    : budget === '50-100'
    ? [50, 100]
    : budget === '100-150'
    ? [100, 150]
    : [150, 999]

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

  let response: Response
  try {
    response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert floral designer. Always respond with valid JSON only, no markdown.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })
  } catch (err) {
    throw new AIRecommendationError(
      'Could not reach OpenAI. Please check your connection and try again.'
    )
  }

  if (!response.ok) {
    const errBody = await response.text().catch(() => '')
    console.error('OpenAI API error:', response.status, errBody)
    throw new AIRecommendationError(
      `OpenAI request failed (status ${response.status}). Please try again in a moment.`
    )
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content

  if (!content) {
    throw new AIRecommendationError('OpenAI returned an empty response. Please try again.')
  }

  let parsed: { recommendations?: any[] }
  try {
    const cleaned = content.replace(/```json|```/g, '').trim()
    parsed = JSON.parse(cleaned)
  } catch (err) {
    console.error('Failed to parse OpenAI response:', content)
    throw new AIRecommendationError('AI Stylist returned an unexpected response. Please try again.')
  }

  const recs = parsed.recommendations || []
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

  if (!results.length) {
    throw new AIRecommendationError(
      'AI Stylist could not match any bouquets to your preferences. Please try different options.'
    )
  }

  return results
}
