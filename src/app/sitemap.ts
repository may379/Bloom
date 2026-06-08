import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bloomblossom.com'

  const flowers = await prisma.flower.findMany({
    select: { id: true, updatedAt: true },
  })

  const categories = await prisma.category.findMany({
    select: { slug: true, updatedAt: true },
  })

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/ai-recommendation`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ...categories.map((cat) => ({
      url: `${baseUrl}/shop?category=${cat.slug}`,
      lastModified: cat.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...flowers.map((flower) => ({
      url: `${baseUrl}/product/${flower.id}`,
      lastModified: flower.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  ]
}
