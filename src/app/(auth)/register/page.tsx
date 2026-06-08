'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { registerSchema, RegisterInput } from '@/lib/validations'
import { registerUser } from '@/actions/auth'
import { cn } from '@/lib/utils'

export default function RegisterPage() {
  const router = useRouter()
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data: RegisterInput) {
    setError('')
    try {
      await registerUser(data)
      const res = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })
      if (res?.error) {
        setError('Account created! Please sign in.')
        router.push('/login')
        return
      }
      router.push('/')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="card-bloom p-8 md:p-10">
        <div className="text-center mb-8">
          <p className="font-script text-3xl text-rose-400 mb-2">Join us</p>
          <h1 className="font-serif text-3xl text-stone-800">Create Account</h1>
          <p className="text-stone-500 text-sm mt-2">Start your floral journey today</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-2xl mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-2">Full Name</label>
            <input
              {...register('name')}
              placeholder="Sophie Laurent"
              className="input-bloom w-full"
              autoComplete="name"
            />
            {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-2">Email address</label>
            <input
              {...register('email')}
              type="email"
              placeholder="your@email.com"
              className="input-bloom w-full"
              autoComplete="email"
            />
            {errors.email && <p className="text-rose-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-2">Password</label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPass ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                className="input-bloom w-full pr-12"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-rose-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-2">Confirm Password</label>
            <input
              {...register('confirmPassword')}
              type="password"
              placeholder="Repeat your password"
              className="input-bloom w-full"
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <p className="text-rose-500 text-xs mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'w-full btn-bloom justify-center py-3.5 text-base',
              isSubmitting && 'opacity-70 cursor-not-allowed'
            )}
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </motion.button>
        </form>

        <div className="floral-divider">
          <span className="text-xs text-stone-400 px-3">🌸</span>
        </div>

        <p className="text-center text-sm text-stone-500">
          Already have an account?{' '}
          <Link href="/login" className="text-rose-500 hover:text-rose-600 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  )
}
