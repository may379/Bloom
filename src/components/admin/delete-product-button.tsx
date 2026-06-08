'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { deleteProduct } from '@/actions/products'

interface DeleteProductButtonProps {
  id: string
  name: string
}

export function DeleteProductButton({ id, name }: DeleteProductButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Delete "${name}"? This action cannot be undone.`)) return
    setLoading(true)
    try {
      await deleteProduct(id)
      router.refresh()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-red-50 flex items-center justify-center text-stone-500 hover:text-red-500 transition-all disabled:opacity-50"
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  )
}
