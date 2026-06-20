'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { ProductCard } from './product-card'
import { FlowerWithImages, CategoryWithCount } from '@/types'
import { cn } from '@/lib/utils'

interface ShopContentProps {
  flowers: FlowerWithImages[]
  total: number
  pages: number
  currentPage: number
  categories: CategoryWithCount[]
  searchParams: Record<string, string | undefined>
}

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
]

export function ShopContent({
  flowers,
  total,
  pages,
  currentPage,
  categories,
  searchParams,
}: ShopContentProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showFilters, setShowFilters] = useState(false)
  const [search, setSearch] = useState(searchParams.search || '')

  // FIX: updateParams now only resets page to 1 when a FILTER changes
  // (not when the page number itself is the thing being updated).
  // Previously every call hardcoded page: '1', which silently overwrote
  // the page number passed in by the pagination buttons.
  function updateParams(
    updates: Record<string, string | undefined>,
    options: { resetPage?: boolean } = { resetPage: true }
  ) {
    const params = new URLSearchParams()
    const merged: Record<string, string | undefined> = {
      ...searchParams,
      ...updates,
    }

    // Only force page back to 1 when changing a filter/sort/search,
    // never when the page itself is being changed via pagination.
    if (options.resetPage && !('page' in updates)) {
      merged.page = '1'
    }

    Object.entries(merged).forEach(([k, v]) => {
      if (v) params.set(k, v)
    })

    startTransition(() => {
      router.push(`/shop?${params.toString()}`)
    })
  }

  function goToPage(page: number) {
    updateParams({ page: String(page) }, { resetPage: false })
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    updateParams({ search: search || undefined })
  }

  function clearFilters() {
    setSearch('')
    startTransition(() => router.push('/shop'))
  }

  const hasFilters = searchParams.category || searchParams.search || searchParams.minPrice

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="section-tag mb-2">Our Collection</p>
        <h1 className="font-serif text-5xl font-light text-stone-800 mb-3">
          {searchParams.category
            ? categories.find((c) => c.slug === searchParams.category)?.name || 'Shop'
            : 'All Bouquets'}
        </h1>
        <p className="text-stone-500 text-sm">{total} arrangements found</p>
      </div>

      {/* Search + Sort bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search bouquets..."
              className="input-bloom pl-10 w-full"
            />
          </div>
          <button type="submit" className="btn-bloom px-5 py-3">Search</button>
        </form>

        <div className="flex gap-3">
          {/* Sort */}
          <div className="relative">
            <select
              value={searchParams.sort || 'newest'}
              onChange={(e) => updateParams({ sort: e.target.value })}
              className="input-bloom appearance-none pr-10 cursor-pointer"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'flex items-center gap-2 px-4 py-3 rounded-2xl border text-sm font-medium transition-all',
              showFilters
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white border-rose-100 text-stone-600 hover:border-rose-200'
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {hasFilters && (
              <span className="w-2 h-2 rounded-full bg-rose-400" />
            )}
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className="card-bloom p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Categories */}
                <div>
                  <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
                    Occasion
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => updateParams({ category: undefined })}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-xs font-medium transition-all border',
                        !searchParams.category
                          ? 'bg-rose-400 text-white border-rose-400'
                          : 'bg-white text-stone-600 border-rose-100 hover:border-rose-300'
                      )}
                    >
                      All
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => updateParams({ category: cat.slug })}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-xs font-medium transition-all border',
                          searchParams.category === cat.slug
                            ? 'bg-rose-400 text-white border-rose-400'
                            : 'bg-white text-stone-600 border-rose-100 hover:border-rose-300'
                        )}
                      >
                        {cat.name} ({cat._count.flowers})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
                    Price Range
                  </p>
                  <div className="flex flex-col gap-2">
                    {[
                      { label: 'Under €50', min: undefined, max: '50' },
                      { label: '€50 – €100', min: '50', max: '100' },
                      { label: '€100 – €150', min: '100', max: '150' },
                      { label: 'Over €150', min: '150', max: undefined },
                    ].map((range) => (
                      <button
                        key={range.label}
                        onClick={() => updateParams({ minPrice: range.min, maxPrice: range.max })}
                        className={cn(
                          'text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-all',
                          searchParams.minPrice === range.min && searchParams.maxPrice === range.max
                            ? 'bg-rose-50 text-rose-600'
                            : 'text-stone-600 hover:bg-rose-50'
                        )}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear */}
                <div className="flex items-start">
                  {hasFilters && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-2 text-sm text-stone-500 hover:text-rose-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Clear all filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active filter chips */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2 mb-6">
          {searchParams.category && (
            <span className="flex items-center gap-1.5 bg-rose-50 text-rose-600 text-xs px-3 py-1.5 rounded-full border border-rose-100">
              {categories.find((c) => c.slug === searchParams.category)?.name}
              <button onClick={() => updateParams({ category: undefined })}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {searchParams.search && (
            <span className="flex items-center gap-1.5 bg-rose-50 text-rose-600 text-xs px-3 py-1.5 rounded-full border border-rose-100">
              "{searchParams.search}"
              <button onClick={() => { setSearch(''); updateParams({ search: undefined }) }}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Grid */}
      {isPending ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton aspect-[4/5] rounded-3xl" />
          ))}
        </div>
      ) : flowers.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">🌸</div>
          <h3 className="font-serif text-2xl text-stone-700 mb-2">No bouquets found</h3>
          <p className="text-stone-500 mb-6">Try adjusting your filters or search terms</p>
          <button onClick={clearFilters} className="btn-bloom">Browse All Bouquets</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {flowers.map((flower, i) => (
            <motion.div
              key={flower.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <ProductCard flower={flower} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-14">
          {Array.from({ length: pages }).map((_, i) => {
            const p = i + 1
            return (
              <button
                key={p}
                onClick={() => goToPage(p)}
                disabled={isPending}
                className={cn(
                  'w-10 h-10 rounded-xl text-sm font-medium transition-all',
                  currentPage === p
                    ? 'bg-rose-400 text-white shadow-bloom'
                    : 'bg-white text-stone-600 border border-rose-100 hover:border-rose-300',
                  isPending && 'opacity-60 cursor-wait'
                )}
              >
                {p}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
