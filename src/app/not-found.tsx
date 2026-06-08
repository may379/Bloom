import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#fdfaf9] flex items-center justify-center pt-20">
        <div className="text-center px-4">
          <div className="text-8xl mb-6">🌸</div>
          <h1 className="font-serif text-6xl text-stone-800 mb-4">404</h1>
          <p className="font-script text-2xl text-rose-400 mb-4">Oops, petal lost!</p>
          <p className="text-stone-500 mb-8 max-w-md">
            This page has wandered off like a petal in the breeze. Let's get you back to our garden.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="btn-bloom">Back to Home</Link>
            <Link href="/shop" className="btn-outline-bloom">Browse Bouquets</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
