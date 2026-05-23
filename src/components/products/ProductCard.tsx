'use client'

import type { Product } from '@/types'
import ProgressLink from '@/components/transition/ProgressLink'

interface ProductCardProps {
  product: Product
  index: number
  size?: 'default' | 'tall'
}

export default function ProductCard({ product, index, size = 'default' }: ProductCardProps) {
  const idx = String(index).padStart(2, '0')

  return (
    <ProgressLink
      href={`/products/${product.slug}`}
      aria-label={`View ${product.name}`}
      className="group relative w-full overflow-hidden cursor-pointer text-left flex flex-col focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{
        border: '1px solid var(--pm-border)',
        background: 'var(--pm-surface)',
        transition: 'border-color 250ms, box-shadow 250ms',
        textDecoration: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--pm-accent)'
        e.currentTarget.style.boxShadow = '0 0 0 1px oklch(0.58 0.225 27 / 0.25), 0 24px 60px oklch(0.08 0.005 40 / 0.5)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--pm-border)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Swatch */}
      <div
        className="relative overflow-hidden"
        style={{ height: size === 'tall' ? '380px' : '300px', background: 'var(--pm-bg-deep)' }}
        aria-hidden="true"
      >
        {product.images[0] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[0]}
            alt=""
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}

        {/* Index number */}
        <span
          className="absolute top-3 right-3"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            color: 'oklch(0.97 0.004 60 / 0.65)',
            letterSpacing: '0.05em',
          }}
        >
          {idx}
        </span>

        {/* Category pill */}
        <span
          className="absolute top-3 left-3"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5625rem',
            textTransform: 'uppercase',
            letterSpacing: '0.22em',
            color: 'var(--pm-accent)',
            border: '1px solid oklch(0.58 0.225 27 / 0.45)',
            background: 'oklch(0.58 0.225 27 / 0.12)',
            padding: '0.2rem 0.55rem',
          }}
        >
          {product.category}
        </span>

        <div
          className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
          style={{ background: 'linear-gradient(to top, oklch(0.08 0.005 40 / 0.55), transparent)' }}
        />
      </div>

      {/* Footer strip */}
      <div
        className="flex items-center justify-between px-4 py-3.5"
        style={{ borderTop: '1px solid var(--pm-border)', background: 'var(--pm-surface)' }}
      >
        <div className="min-w-0">
          <p
            className="pm-display text-white truncate"
            style={{ fontSize: '1.0625rem', letterSpacing: '0.01em' }}
          >
            {product.name}
          </p>
          <p
            className="truncate"
            style={{
              fontSize: '0.625rem',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              color: 'var(--pm-fg-subtle)',
              marginTop: '0.1rem',
            }}
          >
            {product.category}
          </p>
        </div>
        <span className="flex items-center justify-center w-7 h-7 flex-shrink-0">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-0.5"
            style={{ color: 'var(--pm-accent)' }}
          >
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </ProgressLink>
  )
}
