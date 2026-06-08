'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Plus, Trash2, CheckCircle } from 'lucide-react'
import { productSchema, ProductInput } from '@/lib/validations'
import { createProduct, updateProduct } from '@/actions/products'
import { cn } from '@/lib/utils'

interface ProductFormProps {
  product?: any
  categories: any[]
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter()
  const [error, setError] = useState('')

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      name: product.name,
      description: product.description,
      price: parseFloat(product.price.toString()),
      comparePrice: product.comparePrice ? parseFloat(product.comparePrice.toString()) : undefined,
      stock: product.stock,
      categoryId: product.categoryId,
      featured: product.featured,
      bestseller: product.bestseller,
      isNew: product.isNew,
      occasion: product.occasion,
      colors: product.colors,
      tags: product.tags,
      images: product.images.map((i: any) => ({ url: i.url, alt: i.alt || '', isPrimary: i.isPrimary })),
    } : {
      featured: false,
      bestseller: false,
      isNew: true,
      occasion: [],
      colors: [],
      tags: [],
      images: [{ url: '', alt: '', isPrimary: true }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'images' })

  async function onSubmit(data: ProductInput) {
    setError('')
    try {
      if (product) {
        await updateProduct(product.id, data)
      } else {
        await createProduct(data)
      }
      router.push('/admin/products')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to save product')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-stone-100 p-6">
            <h3 className="font-medium text-stone-800 mb-5">Product Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-2">Product Name *</label>
                <input {...register('name')} className="input-bloom w-full" placeholder="Eternal Rose Bouquet" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-2">Description *</label>
                <textarea {...register('description')} rows={4} className="input-bloom w-full resize-none" placeholder="Describe this beautiful arrangement..." />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl border border-stone-100 p-6">
            <h3 className="font-medium text-stone-800 mb-5">Pricing & Inventory</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-2">Price (€) *</label>
                <input {...register('price')} type="number" step="0.01" className="input-bloom w-full" placeholder="89.99" />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-2">Compare Price (€)</label>
                <input {...register('comparePrice')} type="number" step="0.01" className="input-bloom w-full" placeholder="119.99" />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-2">Stock *</label>
                <input {...register('stock')} type="number" className="input-bloom w-full" placeholder="25" />
                {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl border border-stone-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-medium text-stone-800">Images</h3>
              <button
                type="button"
                onClick={() => append({ url: '', alt: '', isPrimary: false })}
                className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600"
              >
                <Plus className="w-3.5 h-3.5" /> Add Image
              </button>
            </div>
            <div className="space-y-3">
              {fields.map((field, i) => (
                <div key={field.id} className="flex gap-3 items-start">
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <input
                      {...register(`images.${i}.url`)}
                      placeholder="https://..."
                      className="input-bloom text-xs"
                    />
                    <input
                      {...register(`images.${i}.alt`)}
                      placeholder="Alt text"
                      className="input-bloom text-xs"
                    />
                  </div>
                  <label className="flex items-center gap-1.5 text-xs text-stone-600 mt-3 cursor-pointer">
                    <input {...register(`images.${i}.isPrimary`)} type="checkbox" className="rounded" />
                    Primary
                  </label>
                  {fields.length > 1 && (
                    <button type="button" onClick={() => remove(i)} className="mt-3 text-stone-300 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Category */}
          <div className="bg-white rounded-2xl border border-stone-100 p-6">
            <h3 className="font-medium text-stone-800 mb-4">Category</h3>
            <select {...register('categoryId')} className="input-bloom w-full">
              <option value="">Select category...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
          </div>

          {/* Status flags */}
          <div className="bg-white rounded-2xl border border-stone-100 p-6">
            <h3 className="font-medium text-stone-800 mb-4">Badges</h3>
            <div className="space-y-3">
              {[
                { name: 'featured' as const, label: 'Featured on Homepage' },
                { name: 'bestseller' as const, label: 'Best Seller' },
                { name: 'isNew' as const, label: 'New Arrival' },
              ].map(({ name, label }) => (
                <label key={name} className="flex items-center gap-3 cursor-pointer">
                  <input {...register(name)} type="checkbox" className="rounded border-rose-200 text-rose-400" />
                  <span className="text-sm text-stone-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tags / Occasions / Colors (simple text inputs) */}
          <div className="bg-white rounded-2xl border border-stone-100 p-6">
            <h3 className="font-medium text-stone-800 mb-4">Metadata</h3>
            <p className="text-xs text-stone-400 mb-4">Enter comma-separated values</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1.5">Occasions</label>
                <input
                  className="input-bloom w-full text-xs"
                  placeholder="Wedding, Anniversary..."
                  onChange={(e) => {
                    const val = e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  }}
                  defaultValue={product?.occasion?.join(', ')}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1.5">Colors</label>
                <input
                  className="input-bloom w-full text-xs"
                  placeholder="Pink, White, Gold..."
                  defaultValue={product?.colors?.join(', ')}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1.5">Tags</label>
                <input
                  className="input-bloom w-full text-xs"
                  placeholder="roses, luxury, romantic..."
                  defaultValue={product?.tags?.join(', ')}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileTap={{ scale: 0.97 }}
            className={cn('w-full btn-bloom justify-center', isSubmitting && 'opacity-70 cursor-not-allowed')}
          >
            {isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
          </motion.button>
        </div>
      </div>
    </form>
  )
}
