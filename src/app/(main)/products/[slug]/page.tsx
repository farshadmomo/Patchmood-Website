import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/types'
import ProgressLink from '@/components/transition/ProgressLink'
import ProductGallery from '@/components/products/ProductGallery'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getProduct(slug: string): Promise<Product | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('products').select('*').eq('slug', slug).maybeSingle()
  return (data as Product) ?? null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: 'Piece not found — PatchMood' }
  return {
    title: `${product.name} — PatchMood`,
    description: product.short_description || product.description?.slice(0, 160),
    openGraph: {
      title: `${product.name} — PatchMood`,
      description: product.short_description || product.description?.slice(0, 160),
      images: product.images?.[0] ? [product.images[0]] : undefined,
    },
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  const supabase = await createClient()
  const [{ data: orderRows }, { data: relatedRows }] = await Promise.all([
    supabase.from('products').select('id').order('created_at', { ascending: true }),
    supabase
      .from('products')
      .select('*')
      .eq('category', product.category)
      .neq('id', product.id)
      .limit(3),
  ])

  const orderIndex = (orderRows ?? []).findIndex((r) => r.id === product.id)
  const specimen = String(orderIndex >= 0 ? orderIndex + 1 : 1).padStart(2, '0')
  const related = (relatedRows ?? []) as Product[]

  return (
    <main style={{ background: 'var(--pm-bg)', minHeight: '100dvh' }}>
      <div className="max-w-[82rem] mx-auto px-5 md:px-10 pt-24 md:pt-28 pb-20">
        {/* Top breadcrumb row */}
        <div className="flex items-center justify-between mb-10 md:mb-14">
          <ProgressLink
            href="/#collection"
            className="pm-backlink inline-flex items-center gap-2.5"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.22em',
              textDecoration: 'none',
            }}
          >
            <svg
              className="pm-backlink-arrow"
              width="16"
              height="12"
              viewBox="0 0 16 12"
              fill="none"
              aria-hidden="true"
            >
              <path d="M14 6H2M6 2L2 6l4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Return to archive
          </ProgressLink>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.625rem',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: 'var(--pm-fg-subtle)',
            }}
          >
            {product.category}&nbsp;&nbsp;/&nbsp;&nbsp;<span style={{ color: 'var(--pm-accent)' }}>PM&ndash;{specimen}</span>
          </span>
        </div>

        {/* Specimen sheet */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16">
          {/* Gallery — sticky on desktop */}
          <div className="lg:sticky lg:top-24 self-start">
            <ProductGallery images={product.images ?? []} name={product.name} specimen={specimen} />
          </div>

          {/* Spec content */}
          <div className="relative">
            {/* Ghost numeral */}
            <span
              aria-hidden="true"
              className="pm-display absolute select-none pointer-events-none"
              style={{
                top: '-2.5rem',
                right: '-0.5rem',
                fontSize: 'clamp(8rem, 16vw, 14rem)',
                lineHeight: 0.7,
                color: 'transparent',
                WebkitTextStroke: '1px oklch(0.24 0.008 40)',
                zIndex: 0,
              }}
            >
              {specimen}
            </span>

            <div className="relative" style={{ zIndex: 1 }}>
              {/* Eyebrow */}
              <p
                className="mb-5 flex items-center gap-2.5"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.28em',
                  color: 'var(--pm-accent)',
                }}
              >
                <span className="inline-block w-7 h-px" style={{ background: 'var(--pm-accent)' }} aria-hidden="true" />
                {product.featured ? 'Featured piece' : 'Archive piece'}
              </p>

              {/* Name */}
              <h1
                className="pm-display text-white"
                style={{ fontSize: 'clamp(2.75rem, 6vw, 5rem)', marginBottom: '1.25rem' }}
              >
                {product.name}
              </h1>

              {/* Lead line */}
              {product.short_description && (
                <p
                  style={{
                    fontSize: '1.0625rem',
                    color: 'var(--pm-fg)',
                    lineHeight: 1.5,
                    marginBottom: '1.75rem',
                    maxWidth: '32ch',
                  }}
                >
                  {product.short_description}
                </p>
              )}

              <div style={{ height: '1px', background: 'var(--pm-border)', marginBottom: '1.75rem' }} />

              {/* Body */}
              <p
                style={{
                  fontSize: '0.9375rem',
                  color: 'var(--pm-fg-muted)',
                  lineHeight: 1.85,
                  marginBottom: '2.25rem',
                  maxWidth: '46ch',
                }}
              >
                {product.description}
              </p>

              {/* Spec table */}
              <dl style={{ marginBottom: '2.25rem' }}>
                <SpecRow label="Category" value={product.category} />
                {product.tags?.length > 0 && (
                  <SpecRow label="Signals" value={product.tags.join(' · ')} />
                )}
                <SpecRow label="Catalogue" value={`PM–${specimen}`} />
                <SpecRow
                  label="Status"
                  value={
                    <span className="inline-flex items-center gap-2">
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: 'var(--pm-neon)',
                          boxShadow: '0 0 6px var(--pm-neon)',
                        }}
                        aria-hidden="true"
                      />
                      In archive
                    </span>
                  }
                />
              </dl>

              {/* Tags */}
              {product.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2" style={{ marginBottom: '2.25rem' }}>
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.625rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.18em',
                        padding: '0.3rem 0.7rem',
                        border: '1px solid var(--pm-border)',
                        color: 'var(--pm-fg-subtle)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* CTA */}
              <button
                type="button"
                className="pm-cta w-full cursor-pointer"
                style={{
                  padding: '1.1rem',
                  color: 'oklch(0.97 0.004 60)',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.25em',
                  fontWeight: 600,
                  border: 'none',
                }}
                aria-label={`Add ${product.name} to collection`}
              >
                Add to Collection
              </button>
              <p
                className="text-center"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  color: 'var(--pm-fg-subtle)',
                  marginTop: '0.875rem',
                }}
              >
                Purchasing available soon
              </p>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section aria-label={`More from ${product.category}`} className="mt-24 md:mt-32">
            <div className="flex items-end justify-between mb-6">
              <h2 className="pm-display text-white" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}>
                More from <span style={{ color: 'var(--pm-accent)' }}>{product.category}</span>
              </h2>
              <ProgressLink
                href="/#collection"
                className="pm-backlink hidden sm:inline-flex items-center gap-2"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  textDecoration: 'none',
                }}
              >
                All pieces
              </ProgressLink>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {related.map((r) => (
                <ProgressLink
                  key={r.id}
                  href={`/products/${r.slug}`}
                  className="pm-related group relative overflow-hidden flex flex-col"
                  style={{ background: 'var(--pm-surface)', textDecoration: 'none' }}
                >
                  <div
                    className="relative overflow-hidden"
                    style={{ aspectRatio: '4 / 3', background: 'var(--pm-bg-deep)' }}
                  >
                    {r.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={r.images[0]}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="pm-related-img w-full h-full object-cover"
                      />
                    ) : (
                      <span
                        className="absolute inset-0 flex items-center justify-center pm-display select-none"
                        style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', color: 'oklch(0.20 0.008 40)' }}
                        aria-hidden="true"
                      >
                        {r.name[0]?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between px-3.5 py-3" style={{ borderTop: '1px solid var(--pm-border)' }}>
                    <span className="pm-display text-white truncate" style={{ fontSize: '1rem' }}>
                      {r.name}
                    </span>
                    <svg
                      className="pm-related-arrow flex-shrink-0"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      aria-hidden="true"
                      style={{ color: 'var(--pm-accent)' }}
                    >
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </ProgressLink>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}

function SpecRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div
      className="flex items-baseline gap-4 py-2.5"
      style={{ borderTop: '1px solid var(--pm-border)' }}
    >
      <dt
        className="flex-shrink-0"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.625rem',
          textTransform: 'uppercase',
          letterSpacing: '0.22em',
          color: 'var(--pm-fg-subtle)',
          width: '6.5rem',
        }}
      >
        {label}
      </dt>
      <dd
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          letterSpacing: '0.06em',
          color: 'var(--pm-fg)',
        }}
      >
        {value}
      </dd>
    </div>
  )
}
