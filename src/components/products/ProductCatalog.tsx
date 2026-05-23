'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { Product, Category } from '@/types'
import ProductCard from './ProductCard'
import ProgressLink from '@/components/transition/ProgressLink'

interface ProductCatalogProps {
  products: Product[]
  categories: Category[]
}

export default function ProductCatalog({ products, categories }: ProductCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [showSticky, setShowSticky] = useState(false)
  const railRef = useRef<HTMLDivElement>(null)
  const stickyChipsRef = useRef<HTMLDivElement>(null)

  // Reveal the persistent filter bar only after the big category rail has scrolled
  // above the viewport — not while it's still below (i.e. user is in the hero).
  useEffect(() => {
    const el = railRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowSticky(false)
        } else {
          setShowSticky(entry.boundingClientRect.top < 0)
        }
      },
      { rootMargin: '-72px 0px 0px 0px', threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // A vertical mouse wheel over the rail scrolls categories sideways, one card
  // per notch. We advance by a full card stride (not the raw wheel delta) so the
  // mandatory scroll-snap lands on the next category instead of snapping back.
  useEffect(() => {
    const el = railRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth) return // nothing to scroll
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return // leave native horizontal scroll alone
      const dir = e.deltaY > 0 ? 1 : -1
      const atStart = el.scrollLeft <= 0
      const atEnd = Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth
      if ((dir < 0 && atStart) || (dir > 0 && atEnd)) return // at an edge: let the page scroll
      e.preventDefault()
      const kids = el.children
      const stride =
        kids.length >= 2
          ? kids[1].getBoundingClientRect().left - kids[0].getBoundingClientRect().left
          : kids.length === 1
            ? kids[0].getBoundingClientRect().width
            : el.clientWidth * 0.8
      el.scrollBy({ left: dir * stride, behavior: 'smooth' })
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  // Same wheel-to-horizontal-scroll for the sticky filter chips bar
  useEffect(() => {
    const el = stickyChipsRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth) return
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
      const dir = e.deltaY > 0 ? 1 : -1
      const atStart = el.scrollLeft <= 0
      const atEnd = Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth
      if ((dir < 0 && atStart) || (dir > 0 && atEnd)) return
      e.preventDefault()
      el.scrollBy({ left: dir * 120, behavior: 'smooth' })
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  const countFor = (name: string) => products.filter((p) => p.category === name).length

  const filtered = activeCategory ? products.filter((p) => p.category === activeCategory) : products
  const featuredProduct = filtered.find((p) => p.featured) ?? filtered[0] ?? null
  const gridProducts = filtered.filter((p) => p !== featuredProduct)

  return (
    <section
      id="collection"
      aria-label="Product collection"
      className="relative scroll-mt-20"
      style={{ background: 'var(--pm-bg)' }}
    >
      {/* Section header */}
      <div className="px-5 md:px-10 pt-24 pb-12 max-w-[88rem] mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <p
            className="mb-4"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              color: 'var(--pm-fg-subtle)',
            }}
          >
            <span style={{ color: 'var(--pm-accent)' }}>&#9632;</span>&nbsp;&nbsp;The collection
          </p>
          <h2
            className="pm-display text-white"
            style={{ fontSize: 'clamp(2.75rem, 7vw, 6rem)' }}
          >
            Mood <span style={{ color: 'var(--pm-accent)' }}>archive</span>
          </h2>
        </div>
        <p
          className="md:text-right md:max-w-xs leading-relaxed pb-1"
          style={{ fontSize: '0.8125rem', color: 'var(--pm-fg-muted)', lineHeight: 1.7 }}
        >
          Catalogued and lit like gallery pieces. Each engineered
          to amplify what is already there.
        </p>
      </div>

      {/* Persistent filter bar — slides under the navbar once the big rail scrolls away */}
      {categories.length > 0 && (
        <div
          aria-hidden={!showSticky}
          className="fixed left-0 right-0 z-30"
          style={{
            top: '4rem',
            background: 'oklch(0.11 0.005 40 / 0.9)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid var(--pm-border)',
            transform: showSticky ? 'translateY(0)' : 'translateY(-110%)',
            opacity: showSticky ? 1 : 0,
            transition: 'transform 360ms cubic-bezier(0.22,1,0.36,1), opacity 220ms',
            pointerEvents: showSticky ? 'auto' : 'none',
          }}
        >
          <div className="max-w-[88rem] mx-auto px-5 md:px-10 h-12 flex items-center gap-4">
            <span
              className="hidden sm:inline flex-shrink-0"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', textTransform: 'uppercase', letterSpacing: '0.28em', color: 'var(--pm-fg-subtle)' }}
            >
              Filter
            </span>
            <div
              ref={stickyChipsRef}
              className="pm-rail-scroll flex-1 min-w-0 flex items-center gap-2 overflow-x-auto"
            >
              <FilterChip label="All" active={activeCategory === null} onClick={() => setActiveCategory(null)} />
              {categories.map((cat) => (
                <FilterChip key={cat.id} label={cat.name} active={activeCategory === cat.name} onClick={() => setActiveCategory(cat.name)} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Category archive plates — big cards that also drive the filter */}
      {categories.length > 0 && (
        <div id="pieces" className="px-5 md:px-10 max-w-[88rem] mx-auto mb-14 scroll-mt-20">
          <div
            ref={railRef}
            className="pm-rail-scroll flex gap-3 md:gap-4 overflow-x-auto pb-3"
            style={{ scrollSnapType: 'x mandatory' }}
            role="tablist"
            aria-label="Filter by category"
          >
            {/* ALL plate — deliberately distinct from the image plates */}
            <button
              role="tab"
              aria-selected={activeCategory === null}
              onClick={() => setActiveCategory(null)}
              className="group relative flex-shrink-0 flex flex-col justify-between cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                width: 'clamp(150px, 19vw, 200px)',
                height: 'clamp(240px, 30vw, 320px)',
                scrollSnapAlign: 'start',
                padding: '1.1rem',
                background: activeCategory === null ? 'var(--pm-accent)' : 'var(--pm-surface)',
                border: activeCategory === null ? '2px solid var(--pm-accent)' : '1px solid var(--pm-border)',
                transition: 'background 220ms, border-color 220ms',
              }}
              onMouseEnter={(e) => { if (activeCategory !== null) e.currentTarget.style.borderColor = 'var(--pm-border-strong)' }}
              onMouseLeave={(e) => { if (activeCategory !== null) e.currentTarget.style.borderColor = 'var(--pm-border)' }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.2em', color: activeCategory === null ? 'oklch(0.18 0.02 30)' : 'var(--pm-fg-subtle)' }}>
                ✳ &nbsp;{products.length} pieces
              </span>
              <span className="pm-display" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', lineHeight: 0.9, color: activeCategory === null ? 'oklch(0.16 0.02 30)' : 'var(--pm-fg)' }}>
                The<br />whole<br />archive
              </span>
            </button>

            {categories.map((cat, i) => {
              const active = activeCategory === cat.name
              const idx = String(i + 1).padStart(2, '0')
              return (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveCategory(cat.name)}
                  className="group relative flex-shrink-0 overflow-hidden cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{
                    width: 'clamp(180px, 24vw, 280px)',
                    height: 'clamp(240px, 30vw, 320px)',
                    scrollSnapAlign: 'start',
                    background: 'var(--pm-bg-deep)',
                    border: active ? '2px solid var(--pm-accent)' : '1px solid var(--pm-border)',
                    transition: 'border-color 220ms',
                  }}
                >
                  {cat.image_url ? (
                    <Image
                      src={cat.image_url}
                      alt=""
                      fill
                      sizes="280px"
                      unoptimized
                      className="group-hover:scale-[1.06]"
                      style={{ objectFit: 'cover', transition: 'transform 600ms cubic-bezier(0.22,1,0.36,1), opacity 220ms', opacity: active ? 1 : 0.82 }}
                    />
                  ) : (
                    <span
                      className="absolute inset-0 flex items-center justify-center pm-display select-none"
                      style={{ fontSize: 'clamp(4rem, 9vw, 7rem)', color: 'oklch(0.22 0.008 40)' }}
                      aria-hidden="true"
                    >
                      {cat.name[0]?.toUpperCase()}
                    </span>
                  )}

                  {/* Red duotone wash — intensifies on active/hover */}
                  <span
                    className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(150deg, oklch(0.58 0.225 27 / 0.55), transparent 55%)',
                      mixBlendMode: 'multiply',
                      opacity: active ? 1 : 0,
                    }}
                    aria-hidden="true"
                  />
                  {/* Bottom legibility gradient */}
                  <span
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(to top, oklch(0.08 0.005 40 / 0.9) 6%, oklch(0.08 0.005 40 / 0.2) 42%, transparent 70%)' }}
                    aria-hidden="true"
                  />

                  {/* Top meta row */}
                  <span className="absolute top-3 left-3 right-3 flex items-center justify-between" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.18em' }}>
                    <span style={{ color: active ? 'var(--pm-accent-bright)' : 'oklch(0.85 0.004 60 / 0.7)' }}>{idx}</span>
                    <span style={{ color: 'oklch(0.85 0.004 60 / 0.7)' }}>{countFor(cat.name)} pcs</span>
                  </span>

                  {/* Name + reveal arrow */}
                  <span className="absolute left-3.5 right-3.5 bottom-3">
                    <span className="block pm-display truncate" style={{ fontSize: 'clamp(1.5rem, 2.4vw, 2.125rem)', color: active ? 'var(--pm-accent-bright)' : 'var(--pm-fg)' }}>
                      {cat.name}
                    </span>
                    <span
                      className="mt-1 flex items-center gap-1.5 transition-all duration-300"
                      style={{
                        fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', textTransform: 'uppercase', letterSpacing: '0.22em',
                        color: 'var(--pm-accent)',
                        opacity: active ? 1 : 0,
                      }}
                    >
                      Viewing
                      <span style={{ width: 16, height: 1, background: 'var(--pm-accent)', display: 'inline-block' }} />
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="px-5 md:px-10 max-w-[88rem] mx-auto mb-24">
          <div style={{ padding: '4rem', textAlign: 'center', border: '1px dashed oklch(0.22 0.010 265)' }}>
            <p style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: '1.5rem', color: 'var(--pm-fg-subtle)' }}>
              Nothing here yet
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Featured */}
          {featuredProduct && (
            <div className="px-5 md:px-10 max-w-[88rem] mx-auto mb-3">
              <ProgressLink
                href={`/products/${featuredProduct.slug}`}
                aria-label={`View ${featuredProduct.name}, featured`}
                className="group relative block w-full overflow-hidden cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{
                  minHeight: '440px',
                  border: '1px solid var(--pm-border)',
                  transition: 'border-color 300ms',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--pm-accent-dim)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--pm-border)')}
              >
                {/* Left — image swatch */}
                <div
                  className="absolute inset-y-0 left-0 w-1/2 md:w-5/12 overflow-hidden"
                  aria-hidden="true"
                >
                  {featuredProduct.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={featuredProduct.images[0]}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="w-full h-full" style={{ background: 'var(--pm-bg-deep)' }} />
                  )}
                </div>

                {/* Right — content */}
                <div
                  className="relative z-10 ml-auto w-1/2 md:w-7/12 h-full flex flex-col justify-center px-7 md:px-14 py-12"
                  style={{ minHeight: '440px', background: 'var(--pm-surface)' }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="flex items-center gap-2"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.625rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.28em',
                        color: 'var(--pm-accent)',
                      }}
                    >
                      <span className="inline-block w-7 h-px" style={{ background: 'var(--pm-accent)' }} aria-hidden="true" />
                      Featured &middot; {featuredProduct.category}
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--pm-fg-subtle)' }}>
                      00
                    </span>
                  </div>

                  <h3 className="pm-display text-white mb-4" style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.75rem)' }}>
                    {featuredProduct.name}
                  </h3>

                  <p
                    className="mb-8 max-w-sm"
                    style={{ fontSize: '0.875rem', color: 'var(--pm-fg-muted)', lineHeight: 1.75 }}
                  >
                    {featuredProduct.description}
                  </p>

                  <span
                    className="flex items-center gap-2 transition-all duration-300 group-hover:gap-3"
                    style={{
                      fontSize: '0.6875rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.22em',
                      color: 'var(--pm-accent)',
                    }}
                  >
                    Explore piece
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </ProgressLink>
            </div>
          )}

          {/* Grid */}
          {gridProducts.length > 0 && (
            <div className="px-5 md:px-10 max-w-[88rem] mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {gridProducts.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={i + 1}
                    size={i % 3 === 0 ? 'tall' : 'default'}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="h-24" />
    </section>
  )
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className="flex-shrink-0 cursor-pointer whitespace-nowrap"
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6875rem',
        textTransform: 'uppercase',
        letterSpacing: '0.14em',
        padding: '0.3rem 0.8rem',
        border: active ? '1px solid var(--pm-accent)' : '1px solid var(--pm-border)',
        background: active ? 'var(--pm-accent)' : 'transparent',
        color: active ? 'oklch(0.16 0.02 30)' : 'var(--pm-fg-muted)',
        transition: 'color 150ms, background 150ms, border-color 150ms',
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = 'var(--pm-fg)' }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = 'var(--pm-fg-muted)' }}
    >
      {label}
    </button>
  )
}
