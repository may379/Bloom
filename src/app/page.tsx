import { Metadata } from 'next'
import { HeroSection } from '@/components/home/hero-section'
import { FeaturedBouquets } from '@/components/home/featured-bouquets'
import { CategoriesSection } from '@/components/home/categories-section'
import { TestimonialsSection } from '@/components/home/testimonials-section'
import { NewsletterSection } from '@/components/home/newsletter-section'
import { StatsSection } from '@/components/home/stats-section'
import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export const metadata: Metadata = {
  title: 'Bloom & Blossom — Premium Floral Boutique',
  description: 'Exquisite handcrafted bouquets for life\'s most beautiful moments.',
}

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    prisma.flower.findMany({
      where: { featured: true, stock: { gt: 0 } },
      include: { images: { where: { isPrimary: true }, take: 1 }, category: true },
      take: 6,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({
      include: { _count: { select: { flowers: true } } },
      take: 5,
    }),
  ])

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedBouquets flowers={featured} />
        <CategoriesSection categories={categories} />
        <StatsSection />
        <TestimonialsSection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  )
}
