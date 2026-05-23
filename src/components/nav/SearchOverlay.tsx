'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { gsap } from '@/lib/gsap'
import type { Product } from '@/types'

interface SearchOverlayProps {
  open: boolean
  onClose: () => void
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const router = useRouter()
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [products, setProducts] = useState<Product[] | null>(null)
  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')
  const [loading, setLoading] = useState(false)

  // Lazy-load the catalogue the first time the overlay opens
  useEffect(() => {
    if (!open || products !== null) return
    setLoading(true)
    fetch('/api/products')
      .then((r) => r.json())
      .then((j) => setProducts(j.success ? (j.data as Product[]) : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [open, products])

  // Debounce the query
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim().toLowerCase()), 150)
    return () => clearTimeout(t)
  }, [query])

  // Open/close: scroll lock, focus, GSAP entrance, Esc handler
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(rootRef.current, { opacity: 1 })
        gsap.set(panelRef.current, { opacity: 1, y: 0 })
        return
      }
      gsap.fromTo(rootRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' })
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: -24 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', delay: 0.04 },
      )
    })

    const focusT = setTimeout(() => inputRef.current?.focus(), 60)

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
      clearTimeout(focusT)
      ctx.revert()
    }
  }, [open, onClose])

  // Reset query when fully closed
  useEffect(() => {
    if (!open) {
      setQuery('')
      setDebounced('')
    }
  }, [open])

  if (!open) return null

  const results = debounced
    ? (products ?? []).filter((p) => {
        const haystack = [p.name, p.short_description, p.category, ...(p.tags ?? [])]
          .join(' ')
          .toLowerCase()
        return haystack.includes(debounced)
      })
    : (products ?? [])

  function goTo(slug: string) {
    onClose()
    router.push(`/products/${slug}`)
  }

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="Search the archive"
      className="fixed inset-0 z-[120] flex flex-col"
      style={{
        background: 'oklch(0.10 0.005 40 / 0.92)',
        backdropFilter: 'blur(14px)',
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        className="w-full max-w-3xl mx-auto px-5 md:px-8 pt-20 md:pt-28 flex flex-col flex-1 min-h-0"
      >
        {/* Top row — label + close */}
        <div className="flex items-center justify-between mb-5">
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.625rem',
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              color: 'var(--pm-accent)',
            }}
          >
            <span style={{ color: 'var(--pm-accent)' }}>&#9632;</span>&nbsp;&nbsp;Search the archive
          </p>
          <button
            onClick={onClose}
            aria-label="Close search"
            className="flex items-center gap-2 cursor-pointer"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.625rem',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: 'var(--pm-fg-subtle)',
              background: 'none',
              border: 'none',
              transition: 'color 150ms',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--pm-fg)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--pm-fg-subtle)')}
          >
            Esc
            <span
              className="flex items-center justify-center"
              style={{ width: 22, height: 22, border: '1px solid var(--pm-border-strong)' }}
            >
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                <path d="M1 1l9 9M10 1l-9 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </span>
          </button>
        </div>

        {/* Input */}
        <div style={{ position: 'relative', borderBottom: '2px solid var(--pm-accent)' }}>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a mood, name, tag…"
            aria-label="Search products"
            className="w-full bg-transparent outline-none pm-display text-white"
            style={{
              fontSize: 'clamp(1.75rem, 5vw, 3rem)',
              padding: '0.25rem 0 0.6rem',
              caretColor: 'var(--pm-accent)',
            }}
          />
        </div>

        {/* Results */}
        <div className="mt-6 flex-1 min-h-0 overflow-y-auto pb-10">
          {loading && products === null ? (
            <p style={metaText}>Loading archive…</p>
          ) : results.length === 0 ? (
            <p style={metaText}>
              {debounced ? `No moods match “${query.trim()}”` : 'No products in the archive yet'}
            </p>
          ) : (
            <>
              <p style={{ ...metaText, marginBottom: '0.75rem' }}>
                {results.length} {results.length === 1 ? 'result' : 'results'}
              </p>
              <ul className="flex flex-col">
                {results.map((p) => (
                  <li key={p.id}>
                    <button
                      onClick={() => goTo(p.slug)}
                      className="group w-full flex items-center gap-4 text-left cursor-pointer"
                      style={{
                        padding: '0.75rem 0.5rem',
                        borderBottom: '1px solid var(--pm-border)',
                        transition: 'background 150ms',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--pm-surface)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <span
                        className="relative flex-shrink-0 overflow-hidden"
                        style={{ width: 52, height: 52, background: 'var(--pm-bg-deep)', border: '1px solid var(--pm-border)' }}
                        aria-hidden="true"
                      >
                        {p.images?.[0] && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.images[0]}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block pm-display text-white truncate" style={{ fontSize: '1.125rem' }}>
                          {p.name}
                        </span>
                        <span
                          className="block truncate"
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.625rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            color: 'var(--pm-fg-subtle)',
                            marginTop: '0.15rem',
                          }}
                        >
                          {p.category}
                        </span>
                      </span>
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 14 14"
                        fill="none"
                        aria-hidden="true"
                        className="flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                        style={{ color: 'var(--pm-accent)' }}
                      >
                        <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const metaText: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.6875rem',
  textTransform: 'uppercase',
  letterSpacing: '0.2em',
  color: 'var(--pm-fg-subtle)',
}
