import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/types'
import ProductTable from '@/components/admin/ProductTable'

export default async function AdminProductsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  const products = (data ?? []) as Product[]

  return (
    <div style={{ padding: '3rem 2.5rem 4rem' }}>
      {/* Page header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '2.5rem',
        }}
      >
        <div>
          <p
            style={{
              fontSize: '0.625rem',
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              color: 'var(--pm-fg-subtle)',
              marginBottom: '0.375rem',
            }}
          >
            Admin / Products
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
            Collection
          </h1>
        </div>

        <Link
          href="/admin/products/new"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.5625rem 1.125rem',
            background: 'var(--pm-accent)',
            borderRadius: '0.375rem',
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: 'oklch(0.09 0.008 270)',
            textDecoration: 'none',
            transition: 'background 150ms',
            flexShrink: 0,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M6 1.5v9M1.5 6h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          New product
        </Link>
      </header>

      {/* Table */}
      <div
        style={{
          background: 'var(--pm-surface)',
          border: '1px solid var(--pm-border)',
          borderRadius: '0.5rem',
          overflow: 'hidden',
        }}
      >
        <ProductTable initialProducts={products} />
      </div>

      <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--pm-fg-subtle)' }}>
        {products.length} {products.length === 1 ? 'product' : 'products'} total
      </p>
    </div>
  )
}
