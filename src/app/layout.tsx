import type { Metadata } from 'next'
import { Cormorant_Garamond, Jost, Dancing_Script } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import { Providers } from '@/components/layout/providers'
import '@/styles/globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jost',
  display: 'swap',
})

const dancing = Dancing_Script({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dancing',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Bloom & Blossom — Premium Floral Boutique',
    template: '%s | Bloom & Blossom',
  },
  description: 'Exquisite handcrafted bouquets for life\'s most beautiful moments. Premium flowers delivered with love.',
  keywords: ['flowers', 'bouquets', 'floral', 'wedding', 'anniversary', 'luxury', 'boutique'],
  authors: [{ name: 'Bloom & Blossom' }],
  creator: 'Bloom & Blossom',
  openGraph: {
    type: 'website',
    locale: 'en_EU',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Bloom & Blossom',
    title: 'Bloom & Blossom — Premium Floral Boutique',
    description: 'Exquisite handcrafted bouquets for life\'s most beautiful moments.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bloom & Blossom — Premium Floral Boutique',
    description: 'Exquisite handcrafted bouquets for life\'s most beautiful moments.',
  },
  robots: { index: true, follow: true },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable} ${dancing.variable}`}>
      <body className="min-h-screen font-sans antialiased bg-[#fdfaf9]">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
