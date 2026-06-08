import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login?callbackUrl=/profile')

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 bg-[#fdfaf9]">{children}</main>
      <Footer />
    </>
  )
}
