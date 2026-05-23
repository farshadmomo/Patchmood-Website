'use client'

import { useState } from 'react'

interface ProductGalleryProps {
  images: string[]
  name: string
  /** Two-character catalogue tag, e.g. "03" */
  specimen: string
}

/** L-shaped registration mark, like a print crop mark. */
function CropMark({ corner }: { corner: 'tl' | 'tr' | 'bl' | 'br' }) {
  const pos: React.CSSProperties = {
    position: 'absolute',
    width: 14,
    height: 14,
    pointerEvents: 'none',
    color: 'var(--pm-accent)',
    opacity: 0.7,
  }
  if (corner === 'tl') Object.assign(pos, { top: 8, left: 8 })
  if (corner === 'tr') Object.assign(pos, { top: 8, right: 8, transform: 'scaleX(-1)' })
  if (corner === 'bl') Object.assign(pos, { bottom: 8, left: 8, transform: 'scaleY(-1)' })
  if (corner === 'br') Object.assign(pos, { bottom: 8, right: 8, transform: 'scale(-1)' })
  return (
    <svg style={pos} viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M0 0.5H10M0.5 0V10" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

export default function ProductGallery({ images, name, specimen }: ProductGalleryProps) {
  const [active, setActive] = useState(0)
  const hasImages = images.length > 0
  const current = hasImages ? images[active] : null

  return (
    <div>
      {/* Main frame */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: '4 / 5',
          background: 'var(--pm-bg-deep)',
          border: '1px solid var(--pm-border)',
        }}
      >
        {current ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={current}
            src={current}
            alt={`${name} — view ${active + 1}`}
            decoding="async"
            className="w-full h-full object-cover"
            style={{ animation: 'pm-fade-in 420ms ease-out' }}
          />
        ) : (
          /* Branded placeholder — no specimen image */
          <div className="absolute inset-0 flex items-center justify-center select-none" aria-hidden="true">
            <span
              className="pm-display"
              style={{
                fontSize: 'clamp(7rem, 22vw, 16rem)',
                lineHeight: 0.8,
                color: 'oklch(0.20 0.008 40)',
              }}
            >
              {name[0]?.toUpperCase()}
            </span>
          </div>
        )}

        {/* Grain */}
        <div
          className="absolute inset-0 opacity-[0.12] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Registration marks */}
        <CropMark corner="tl" />
        <CropMark corner="tr" />
        <CropMark corner="bl" />
        <CropMark corner="br" />

        {/* Catalogue stamp */}
        <span
          className="absolute top-3.5 left-1/2 -translate-x-1/2"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5625rem',
            textTransform: 'uppercase',
            letterSpacing: '0.32em',
            color: 'oklch(0.85 0.004 60 / 0.6)',
          }}
        >
          PM&ndash;{specimen}
        </span>

        {!hasImages && (
          <span
            className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.5625rem',
              textTransform: 'uppercase',
              letterSpacing: '0.28em',
              color: 'var(--pm-fg-subtle)',
            }}
          >
            No specimen image on file
          </span>
        )}
      </div>

      {/* Thumbnail rail — only when multiple images */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-2" role="tablist" aria-label={`${name} images`}>
          {images.map((src, i) => {
            const on = i === active
            return (
              <button
                key={src}
                role="tab"
                aria-selected={on}
                aria-label={`View image ${i + 1} of ${images.length}`}
                onClick={() => setActive(i)}
                className="relative flex-shrink-0 overflow-hidden cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{
                  width: 60,
                  height: 75,
                  background: 'var(--pm-bg-deep)',
                  border: on ? '1px solid var(--pm-accent)' : '1px solid var(--pm-border)',
                  opacity: on ? 1 : 0.6,
                  transition: 'opacity 180ms, border-color 180ms',
                }}
                onMouseEnter={(e) => { if (!on) e.currentTarget.style.opacity = '0.85' }}
                onMouseLeave={(e) => { if (!on) e.currentTarget.style.opacity = '0.6' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
