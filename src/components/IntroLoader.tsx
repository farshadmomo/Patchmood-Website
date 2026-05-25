'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { useLocale } from '@/i18n/LocaleProvider'

const SEEN_KEY = 'pm_intro_seen'

export default function IntroLoader() {
  const { t } = useLocale()
  // 'pending' renders the overlay on first paint (covers hero) until the
  // effect decides; 'done' unmounts it.
  const [phase, setPhase] = useState<'pending' | 'playing' | 'done'>('pending')

  const overlayRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const markRef = useRef<HTMLHeadingElement>(null)
  const tagRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem(SEEN_KEY)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (alreadySeen) {
      setPhase('done')
      return
    }

    if (reduce) {
      sessionStorage.setItem(SEEN_KEY, '1')
      const t = setTimeout(() => setPhase('done'), 200)
      return () => clearTimeout(t)
    }

    setPhase('playing')
    document.body.style.overflow = 'hidden'

    const counter = { v: 0 }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem(SEEN_KEY, '1')
          document.body.style.overflow = ''
          setPhase('done')
        },
      })

      tl.fromTo(
        markRef.current,
        { opacity: 0, y: 18, filter: 'blur(6px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' },
      )
        .fromTo(tagRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.35')
        .to(
          counter,
          {
            v: 100,
            duration: 1.5,
            ease: 'power1.inOut',
            onUpdate: () => {
              if (counterRef.current) {
                counterRef.current.textContent = String(Math.round(counter.v)).padStart(3, '0')
              }
            },
          },
          '-=0.5',
        )
        .fromTo(barRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1.5, ease: 'power1.inOut' }, '<')
        .to({}, { duration: 0.15 })
        .to(overlayRef.current, { yPercent: -100, duration: 0.75, ease: 'power4.inOut' })
    })

    return () => {
      document.body.style.overflow = ''
      ctx.revert()
    }
  }, [])

  if (phase === 'done') return null

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{ background: 'var(--pm-bg)' }}
    >
      {/* Top + bottom hairlines for the brutalist frame */}
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'var(--pm-border)' }} />
      <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: 'var(--pm-border)' }} />

      <div ref={tagRef} className="mb-6" style={{ opacity: 0 }}>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.625rem',
            textTransform: 'uppercase',
            letterSpacing: '0.35em',
            color: 'var(--pm-accent)',
          }}
        >
          <span style={{ color: 'var(--pm-accent)' }}>&#9632;</span>&nbsp;&nbsp;{t.intro.tag} &middot; {t.intro.estTag}
        </p>
      </div>

      <h1
        ref={markRef}
        className="pm-display select-none text-center"
        style={{ fontSize: 'clamp(3rem, 13vw, 9rem)', color: 'var(--pm-fg)', opacity: 0, lineHeight: 0.9 }}
      >
        Patch<span style={{ color: 'var(--pm-accent)' }}>mood</span>
      </h1>

      {/* Progress line */}
      <div
        className="relative mt-10 overflow-hidden"
        style={{ width: 'min(420px, 70vw)', height: '2px', background: 'var(--pm-border)' }}
      >
        <div
          ref={barRef}
          className="absolute inset-0"
          style={{ background: 'var(--pm-accent)', transformOrigin: 'left center', transform: 'scaleX(0)' }}
        />
      </div>

      <span
        ref={counterRef}
        className="mt-4"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          letterSpacing: '0.25em',
          color: 'var(--pm-fg-subtle)',
        }}
      >
        000
      </span>
    </div>
  )
}
