import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/types'
import ProductForm from '@/components/admin/ProductForm'

export const metadata = {
  title: 'Edit Product — PatchMood Admin',
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()
  const { data } = await supabase.from('products').select('*').eq('id', id).single()

  if (!data) notFound()

  const product = data as Product

  return (
    <div style={{ padding: '3rem 2.5rem 4rem', maxWidth: '64rem' }}>
      {/* Page header */}
      <header style={{ marginBottom: '2.5rem' }}>
        <nav style={{ marginBottom: '0.75rem' }}>
          <Link
            href="/admin/products"
            style={{
              fontSize: '0.75rem',
              color: 'var(--pm-fg-subtle)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Products
          </Link>
        </nav>
        <p
          style={{
            fontSize: '0.625rem',
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
            color: 'var(--pm-fg-subtle)',
            marginBottom: '0.375rem',
          }}
        >
          Admin / Products / Edit
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            textTransform: 'uppercase',
            fontWeight: 400,
            fontSize: '2.5rem',
            color: 'var(--pm-fg)',
            lineHeight: 1.1,
          }}
        >
          {product.name}
        </h1>
      </header>

      <ProductForm mode="edit" product={product} />
    </div>
  )
}
