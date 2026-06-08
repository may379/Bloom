'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Sparkles, Flower2, Heart, ShoppingBag, ArrowRight } from 'lucide-react'
import { getAIRecommendation } from '@/actions/recommendations'
import { useCartStore } from '@/hooks/use-cart'
import { formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

const occasions = [
  { value: 'Wedding', label: 'Wedding', emoji: '💍' },
  { value: 'Anniversary', label: 'Anniversary', emoji: '💕' },
  { value: 'Birthday', label: 'Birthday', emoji: '🎂' },
  { value: "Mother's Day", label: "Mother's Day", emoji: '👑' },
  { value: "Valentine's Day", label: "Valentine's Day", emoji: '❤️' },
  { value: 'any', label: 'Just Because', emoji: '🌸' },
]

const budgets = [
  { value: 'under-50', label: 'Under €50', desc: 'Sweet & thoughtful' },
  { value: '50-100', label: '€50 – €100', desc: 'Perfect balance' },
  { value: '100-150', label: '€100 – €150', desc: 'Premium choice' },
  { value: 'over-150', label: 'Over €150', desc: 'Ultimate luxury' },
]

const colorOptions = [
  { value: 'Red', emoji: '🔴' },
  { value: 'Pink', emoji: '🩷' },
  { value: 'White', emoji: '⚪' },
  { value: 'Purple', emoji: '💜' },
  { value: 'Yellow', emoji: '💛' },
  { value: 'Orange', emoji: '🟠' },
  { value: 'Blush', emoji: '🌸' },
  { value: 'Mixed', emoji: '🎨' },
]

export default function AIRecommendationPage() {
  const [step, setStep] = useState(1)
  const [occasion, setOccasion] = useState('')
  const [budget, setBudget] = useState('')
  const [colors, setColors] = useState<string[]>([])
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  function toggleColor(c: string) {
    setColors((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c])
  }

  async function handleGetRecommendations() {
    setLoading(true)
    try {
      const recs = await getAIRecommendation({ occasion, budget, colors })
      setResults(recs)
      setStep(4)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setStep(1)
    setOccasion('')
    setBudget('')
    setColors([])
    setResults([])
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20 bg-gradient-to-b from-rose-50/50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-flex w-16 h-16 rounded-3xl bg-rose-400 items-center justify-center mx-auto mb-6 shadow-bloom">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <p className="section-tag mb-2">Powered by AI</p>
            <h1 className="font-serif text-5xl text-stone-800 mb-4">Your Personal Floral Stylist</h1>
            <p className="section-subtitle max-w-lg mx-auto">
              Tell us about the occasion and we'll curate the perfect bouquet, just for you.
            </p>
          </div>

          {/* Step indicator */}
          {step < 4 && (
            <div className="flex items-center justify-center gap-3 mb-12">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-3">
                  <div className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all',
                    step >= s
                      ? 'bg-rose-400 text-white shadow-bloom'
                      : 'bg-white text-stone-400 border border-rose-100'
                  )}>
                    {step > s ? '✓' : s}
                  </div>
                  {s < 3 && <div className={cn('w-16 h-px', step > s ? 'bg-rose-400' : 'bg-rose-100')} />}
                </div>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* Step 1: Occasion */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
              >
                <h2 className="font-serif text-3xl text-stone-800 text-center mb-2">What's the occasion?</h2>
                <p className="text-center text-stone-500 mb-10">Choose the moment you're celebrating</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {occasions.map((o) => (
                    <button
                      key={o.value}
                      onClick={() => { setOccasion(o.value); setStep(2) }}
                      className={cn(
                        'card-bloom p-6 text-center cursor-pointer transition-all hover:-translate-y-1',
                        'hover:border-rose-300 hover:shadow-bloom'
                      )}
                    >
                      <span className="text-4xl mb-3 block">{o.emoji}</span>
                      <p className="font-serif text-lg text-stone-800">{o.label}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Budget */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
              >
                <h2 className="font-serif text-3xl text-stone-800 text-center mb-2">What's your budget?</h2>
                <p className="text-center text-stone-500 mb-10">We'll find the finest blooms within your range</p>
                <div className="grid grid-cols-2 gap-4">
                  {budgets.map((b) => (
                    <button
                      key={b.value}
                      onClick={() => { setBudget(b.value); setStep(3) }}
                      className={cn(
                        'card-bloom p-8 text-left cursor-pointer transition-all hover:-translate-y-1 hover:border-rose-300 hover:shadow-bloom'
                      )}
                    >
                      <p className="font-serif text-2xl text-rose-600 mb-1">{b.label}</p>
                      <p className="text-sm text-stone-500">{b.desc}</p>
                    </button>
                  ))}
                </div>
                <button onClick={() => setStep(1)} className="mt-6 text-sm text-stone-400 hover:text-rose-500 transition-colors block mx-auto">
                  ← Back
                </button>
              </motion.div>
            )}

            {/* Step 3: Colors */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
              >
                <h2 className="font-serif text-3xl text-stone-800 text-center mb-2">Favourite colours?</h2>
                <p className="text-center text-stone-500 mb-10">Select any that speak to you (optional)</p>
                <div className="grid grid-cols-4 gap-3 mb-10">
                  {colorOptions.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => toggleColor(c.value)}
                      className={cn(
                        'card-bloom py-5 px-3 text-center cursor-pointer transition-all',
                        colors.includes(c.value)
                          ? 'border-rose-400 bg-rose-50 shadow-bloom'
                          : 'hover:border-rose-200'
                      )}
                    >
                      <span className="text-3xl block mb-2">{c.emoji}</span>
                      <p className="text-xs text-stone-600">{c.value}</p>
                    </button>
                  ))}
                </div>

                <div className="flex justify-center gap-4">
                  <button onClick={() => setStep(2)} className="btn-outline-bloom">← Back</button>
                  <button
                    onClick={handleGetRecommendations}
                    disabled={loading}
                    className="btn-bloom"
                  >
                    <Sparkles className="w-4 h-4" />
                    {loading ? 'Finding your perfect bouquet...' : 'Get My Recommendations'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Results */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-center mb-10">
                  <h2 className="font-serif text-3xl text-stone-800 mb-2">
                    🌸 Your Perfect Bouquets
                  </h2>
                  <p className="text-stone-500">Curated especially for you</p>
                </div>

                {results.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-stone-500">No perfect match found. Try different preferences.</p>
                    <button onClick={reset} className="btn-bloom mt-6">Try Again</button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {results.map((rec, i) => {
                      const flower = rec.flower
                      const img = flower.images[0]
                      const price = parseFloat(flower.price.toString())
                      return (
                        <motion.div
                          key={flower.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.15 }}
                          className="card-bloom p-6 flex flex-col sm:flex-row gap-6"
                        >
                          {i === 0 && (
                            <div className="absolute -top-3 -right-3">
                              <span className="bg-rose-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-bloom">
                                ⭐ Best Match
                              </span>
                            </div>
                          )}

                          {/* Image */}
                          <div className="relative w-full sm:w-40 h-40 rounded-2xl overflow-hidden flex-shrink-0 bg-rose-50">
                            {img ? (
                              <Image src={img.url} alt={flower.name} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-4xl">🌸</div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div>
                                <p className="text-xs text-rose-400 font-medium mb-1">{flower.category.name}</p>
                                <h3 className="font-serif text-2xl text-stone-800">{flower.name}</h3>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="price-tag text-xl">{formatPrice(price)}</p>
                                <div className="flex items-center gap-1 justify-end mt-1">
                                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                  <p className="text-xs text-stone-500">{rec.confidence}% match</p>
                                </div>
                              </div>
                            </div>

                            <p className="text-sm text-stone-600 leading-relaxed mb-4 font-light">
                              {rec.explanation}
                            </p>

                            {rec.suggestedFlowers.length > 0 && (
                              <div className="mb-4">
                                <p className="text-xs font-medium text-stone-500 mb-2">Suggested flowers in this arrangement:</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {rec.suggestedFlowers.map((f: string) => (
                                    <span key={f} className="badge-bloom bg-rose-50 text-rose-600 border border-rose-100 text-[10px] px-2 py-1">
                                      🌸 {f}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="flex gap-3">
                              <button
                                onClick={() => addItem(flower)}
                                className="btn-bloom text-sm px-5 py-2.5"
                              >
                                <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                              </button>
                              <Link
                                href={`/product/${flower.id}`}
                                className="btn-outline-bloom text-sm px-5 py-2.5"
                              >
                                View Details <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}

                <div className="text-center mt-10">
                  <button onClick={reset} className="btn-outline-bloom">
                    Start Over
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </>
  )
}
