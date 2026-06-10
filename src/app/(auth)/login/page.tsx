'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Sparkles } from 'lucide-react'
import { loginSchema, LoginInput } from '@/lib/validations'
import { cn } from '@/lib/utils'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginInput) {
    setError('')
    const res = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })
    if (res?.error) {
      setError('Invalid email or password. Please try again.')
      return
    }
    router.push(callbackUrl)
    router.refresh()
  }

  return (
    <div className="card-bloom p-8 md:p-10">
      {/* Header */}
      <div className="text-center mb-8">
        <p className="font-script text-3xl text-rose-400 mb-2">Welcome back</p>
        <h1 className="font-serif text-3xl text-stone-800">Sign In</h1>
        <p className="text-stone-500 text-sm mt-2">Sign in to your account to continue</p>
      </div>

      {/* Demo credentials box */}
      <div className="bg-rose-50 rounded-2xl p-4 mb-6 border border-rose-100">
        <p className="text-xs font-semibold text-rose-600 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Demo Credentials
        </p>
        <div className="text-xs text-stone-600 space-y-1">
          <p>Admin: <span className="font-mono text-rose-600">admin@bloomblossom.com</span> / <span className="font-mono text-rose-600">Admin123!</span></p>
          <p>User: <span className="font-mono text-rose-600">demo@bloomblossom.com</span> / <span className="font-mono text-rose-600">User123!</span></p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-2xl mb-6 border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
              placeholder="••••••••"
              className="input-bloom w-full pr-12"
              autoComplete="current-password"
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

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileTap={{ scale: 0.98 }}
          className={cn(
            'w-full btn-bloom justify-center py-3.5 text-base',
            isSubmitting && 'opacity-70 cursor-not-allowed'
          )}
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </motion.button>
      </form>

      <div className="floral-divider">
        <span className="text-xs text-stone-400 px-3">🌸</span>
      </div>

      <p className="text-center text-sm text-stone-500">
        Don't have an account?{' '}
        <Link href="/register" className="text-rose-500 hover:text-rose-600 font-medium transition-colors">
          Create one
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <Suspense fallback={
        <div className="card-bloom p-8 md:p-10 text-center">
          <div className="text-4xl mb-4">🌸</div>
          <p className="text-stone-500 text-sm">Loading...</p>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </motion.div>
  )
}
