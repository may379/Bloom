import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getProfile } from '@/actions/newsletter'
import { ProfileForm } from '@/components/auth/profile-form'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const user = await getProfile()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <p className="section-tag mb-2">My Account</p>
        <h1 className="font-serif text-4xl text-stone-800">My Profile</h1>
      </div>

      {/* Avatar */}
      <div className="card-bloom p-6 mb-6 flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-serif text-3xl font-medium shadow-bloom">
          {user?.name?.[0] || session.user?.email?.[0]?.toUpperCase()}
        </div>
        <div>
          <h2 className="font-serif text-2xl text-stone-800">{user?.name || 'Your Name'}</h2>
          <p className="text-stone-500 text-sm">{user?.email}</p>
          <span className="inline-flex items-center mt-2 px-3 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-600 border border-rose-100">
            {user?.role === 'ADMIN' ? '👑 Admin' : '🌸 Member'}
          </span>
        </div>
      </div>

      <ProfileForm user={user} />
    </div>
  )
}
