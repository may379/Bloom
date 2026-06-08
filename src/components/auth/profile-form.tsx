'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { profileSchema, ProfileInput } from '@/lib/validations'
import { updateProfile } from '@/actions/newsletter'
import { cn } from '@/lib/utils'

interface ProfileFormProps {
  user: any
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [saved, setSaved] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: user?.city || '',
      country: user?.country || '',
      postalCode: user?.postalCode || '',
    },
  })

  async function onSubmit(data: ProfileInput) {
    await updateProfile(data)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="card-bloom p-6 space-y-5">
        <h3 className="font-serif text-xl text-stone-800 mb-6">Personal Information</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-stone-600 mb-2">Full Name</label>
            <input {...register('name')} className="input-bloom w-full" placeholder="Your name" />
            {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-stone-600 mb-2">Phone Number</label>
            <input {...register('phone')} className="input-bloom w-full" placeholder="+31 6 12345678" />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-stone-600 mb-2">Street Address</label>
            <input {...register('address')} className="input-bloom w-full" placeholder="Bloemenstraat 45" />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-2">City</label>
            <input {...register('city')} className="input-bloom w-full" placeholder="Amsterdam" />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-2">Postal Code</label>
            <input {...register('postalCode')} className="input-bloom w-full" placeholder="1012 AB" />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-stone-600 mb-2">Country</label>
            <input {...register('country')} className="input-bloom w-full" placeholder="Netherlands" />
          </div>
        </div>

        <div className="pt-2">
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileTap={{ scale: 0.97 }}
            className={cn(
              'btn-bloom',
              isSubmitting && 'opacity-70 cursor-not-allowed',
              saved && 'bg-emerald-500 hover:bg-emerald-500'
            )}
          >
            {saved ? (
              <><CheckCircle className="w-4 h-4" /> Saved!</>
            ) : isSubmitting ? 'Saving...' : 'Save Changes'}
          </motion.button>
        </div>
      </div>
    </form>
  )
}
