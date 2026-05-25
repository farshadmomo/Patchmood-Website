import Link from 'next/link'
import { createClient } from '@/lib/pocketbase/server'
import { toProduct } from '@/lib/pocketbase/transform'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function AdminDashboard() {
  const pb = await createClient()

  const [totalRes, featuredRes, categoryRes, recentRes] = await Promise.all([
    pb.collection('products').getList(1, 1, { fields: 'id' }),
    pb.collection('products').getList(1, 1, { fields: 'id', filter: 'featured = true' }),
    pb.collection('categories').getList(1, 1, { fields: 'id' }),
    pb.collection('products').getList(1, 5, { sort: '-created' }),
  ])

  const total = totalRes.totalItems
  const featuredCount = featuredRes.totalItems
  const categoryCount = categoryRes.totalItems
  const recentProducts = recentRes.items.map(toProduct)

  return (
    <div className="px-4 pt-6 pb-12 md:px-10 md:pt-12 md:pb-16" style={{ maxWidth: '56rem' }}>
      {/* Page header */}
      <header style={{ marginBottom: '3rem' }}>
        <p
          style={{
            fontSize: '0.625rem',
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
            color: 'var(--pm-fg-subtle)',
            marginBottom: '0.375rem',
          }}
        >
          Admin
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
          Overview
        </h1>
      </header>

      {/* Stats row */}
      <div
        style={{
          display: 'flex',
          gap: '0',
          marginBottom: '3rem',
          borderTop: '1px solid var(--pm-border)',
          borderBottom: '1px solid var(--pm-border)',
        }}
      >
        {[
          { label: 'Products', value: total ?? 0 },
          { label: 'Featured', value: featuredCount ?? 0 },
          { label: 'Categories', value: categoryCount ?? 0 },
        ].map((stat, i) => (
          <div
            key={stat.label}
            style={{
              flex: 1,
              padding: '1.25rem 1.5rem',
              borderRight: i < 2 ? '1px solid var(--pm-border)' : 'none',
            }}
          >
            <p
              style={{
                fontSize: '0.625rem',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'var(--pm-fg-subtle)',
                marginBottom: '0.375rem',
              }}
            >
              {stat.label}
            </p>
            <p
              style={{
                fontSize: '1.75rem',
                fontWeight: 300,
                color: 'var(--pm-fg)',
                fontFamily: 'var(--font-mono)',
                lineHeight: 1,
              }}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent products */}
      <section>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
          }}
        >
          <h2
            style={{
              fontSize: '0.75rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'var(--pm-fg-muted)',
            }}
          >
            Recent additions
          </h2>
          <Link href="/admin/products" style={{ fontSize: '0.75rem', color: 'var(--pm-accent)', textDecoration: 'none' }}>
            View all →
          </Link>
        </div>

        {recentProducts.length === 0 ? (
          <div
            style={{
              padding: '3rem',
              textAlign: 'center',
              border: '1px dashed oklch(0.22 0.010 265)',
              borderRadius: '0.5rem',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-display)',
                textTransform: 'uppercase',
                fontSize: '1.5rem',
                color: 'var(--pm-fg-subtle)',
                marginBottom: '0.75rem',
              }}
            >
              Nothing here yet
            </p>
            <Link href="/admin/products/new" style={{ fontSize: '0.8125rem', color: 'var(--pm-accent)', textDecoration: 'none' }}>
              Add your first product
            </Link>
          </div>
        ) : (
          <div>
            {recentProducts.map((product, i) => (
              <div
                key={product.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.875rem 0',
                  borderBottom: i < recentProducts.length - 1 ? '1px solid oklch(0.14 0.010 265)' : 'none',
                }}
              >
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--pm-fg)' }}>
                    {product.name}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--pm-fg-subtle)', marginTop: '0.1rem' }}>
                    {product.category}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--pm-fg-subtle)' }}>
                    {formatDate(product.created_at)}
                  </p>
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    style={{ fontSize: '0.6875rem', color: 'var(--pm-accent)', textDecoration: 'none' }}
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quick action */}
      <div style={{ marginTop: '3rem' }}>
        <Link
          href="/admin/products/new"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1.25rem',
            background: 'var(--pm-accent)',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'oklch(0.09 0.008 270)',
            textDecoration: 'none',
            transition: 'background 150ms',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Add product
        </Link>
      </div>
    </div>
  )
}
