import Navbar, { type NavbarInitialUser } from '@/components/nav/Navbar'
import IntroLoader from '@/components/IntroLoader'
import { createClient } from '@/lib/supabase/server'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const initialUser: NavbarInitialUser | null = user
    ? {
        initial: (user.email?.[0] ?? '?').toUpperCase(),
        isAdmin: user.app_metadata?.role === 'admin',
      }
    : null

  return (
    <>
      <IntroLoader />
      <Navbar initialUser={initialUser} />
      {children}
    </>
  )
}
