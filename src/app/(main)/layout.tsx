import Navbar, { type NavbarInitialUser } from '@/components/nav/Navbar'
import IntroLoader from '@/components/IntroLoader'
import Footer from '@/components/footer/Footer'
import { createClient } from '@/lib/pocketbase/server'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pb = await createClient()
  const record = pb.authStore.record

  const initialUser: NavbarInitialUser | null = pb.authStore.isValid && record
    ? {
        initial: (record.email?.[0] ?? '?').toUpperCase(),
        isAdmin: pb.authStore.isValid, // any valid session = admin panel access
      }
    : null

  return (
    <>
      <IntroLoader />
      <Navbar initialUser={initialUser} />
      {children}
      <Footer />
    </>
  )
}
