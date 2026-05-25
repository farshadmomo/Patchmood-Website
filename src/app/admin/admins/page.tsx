import { redirect } from 'next/navigation'
import { createClient } from '@/lib/pocketbase/server'
import AdminsClient from '@/components/admin/AdminsClient'

export const metadata = {
  title: 'Admin Users — PatchMood',
}

export default async function AdminsPage() {
  const pb = await createClient()

  if (!pb.authStore.isValid || !pb.authStore.isSuperuser) {
    redirect('/admin')
  }

  const records = await pb.collection('admins').getFullList({ sort: 'email' })
  const admins = records.map((r) => ({
    id: r.id,
    email: (r['email'] as string) || '',
    name: (r['name'] as string) || '',
    created: (r['created'] as string) || '',
  }))

  return (
    <div style={{ padding: '2rem 2rem 4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.625rem',
            textTransform: 'uppercase',
            letterSpacing: '0.28em',
            color: 'var(--pm-accent)',
            marginBottom: '0.5rem',
          }}
        >
          <span style={{ color: 'var(--pm-accent)' }}>&#9632;</span>&nbsp;&nbsp;Master access
        </p>
        <h1
          className="pm-display"
          style={{
            fontSize: '1.75rem',
            textTransform: 'uppercase',
            color: 'var(--pm-fg)',
            marginBottom: '0.5rem',
          }}
        >
          Admin Users
        </h1>
        <p style={{ fontSize: '0.8125rem', color: 'var(--pm-fg-subtle)', maxWidth: '36rem', lineHeight: 1.6 }}>
          Regular admins can manage products and categories. Only you (the master) can create or remove admin accounts.
        </p>
      </div>
      <AdminsClient initialAdmins={admins} />
    </div>
  )
}
