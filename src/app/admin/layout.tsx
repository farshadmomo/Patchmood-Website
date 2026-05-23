import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/admin/Sidebar'

export const metadata = {
  title: 'Admin — PatchMood',
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.app_metadata?.role !== 'admin') {
    redirect('/login')
  }

  const displayName = (user.user_metadata?.full_name as string | undefined) ?? user.email?.split('@')[0]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--pm-bg)' }}>
      <Sidebar userName={displayName} userEmail={user.email} />
      <main
        style={{
          flex: 1,
          marginLeft: '14rem',
          minHeight: '100vh',
          overflowY: 'auto',
        }}
      >
        {children}
      </main>
    </div>
  )
}
