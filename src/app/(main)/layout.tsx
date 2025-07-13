import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  // Temporarily bypass session check for development
  // if (!session) {
  //   redirect('/auth/signin')
  // }
  return <>{children}</>
} 