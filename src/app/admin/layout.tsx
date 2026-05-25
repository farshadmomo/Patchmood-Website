import { redirect } from 'next/navigation'
import { createClient } from '@/lib/pocketbase/server'
import AdminShell from './AdminShell'

export const metadata = {
  title: 'Admin — PatchMood',
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const pb = await createClient()

  const isAnyAdmin =
    pb.authStore.isValid &&
    (pb.authStore.isSuperuser || pb.authStore.record?.collectionName === 'admins')

  if (!isAnyAdmin) {
    redirect(pb.authStore.isValid ? '/' : '/login')
  }

  const isMaster = pb.authStore.isSuperuser
  const email = pb.authStore.record?.email as string | undefined
  const displayName = email?.split('@')[0]

  return (
    <AdminShell userName={displayName} userEmail={email} isMaster={isMaster}>
      {children}
    </AdminShell>
  )
}
