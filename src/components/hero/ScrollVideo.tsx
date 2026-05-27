'use client'

import { useRef, useEffect, useState } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useScrollVideo } from '@/hooks/useScrollVideo'
import { useLocale } from '@/i18n/LocaleProvider'

export default function HeroSection() {
  const { t } = useLocale()
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)

  // Scroll-scrubbing a video is a desktop effect — on mobile the per-seek decode
  // cost stutters badly and the landscape clip crops to an ugly zoom. So phones
  // get a square clip that just autoplay-loops (smooth, no seeking). Default to
  // desktop during SSR; correct on mount to avoid a hydration mismatch.
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
    const mq = window.matchMedia('(max-width: 767px)')
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  // Warm the decoder so the first scroll-scrub doesn't stall: once metadata is
  // in, nudge currentTime to force the first frame to decode and paint. The
  // poster covers the gap until then, so there's no black flash either.
  // No-op on mobile (videoRef isn't attached to the autoplay clip there).
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const warm = () => {
      try {
        v.currentTime = 0.04
      } catch {
        /* seek can throw if metadata vanished mid-tick — harmless */
      }
    }
    if (v.readyState >= 1) warm()
    else v.addEventListener('loadedmetadata', warm, { once: true })
    return () => v.removeEventListener('loadedmetadata', warm)
  }, [])

  // Scrub video currentTime with scroll progress
  useScrollVideo(containerRef, videoRef)

  // Text animations
  useEffect(() => {
    const els = [headingRef.current, taglineRef.current]

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(els, { opacity: 1, y: 0 })
      return
    }

    let st: ReturnType<typeof ScrollTrigger.create> | null = null

    const ctx = gsap.context(() => {
      const createScrollFade = () => {
        st = ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top',
          end: '25% top',
          scrub: 0.8,
          onUpdate: (self) => {
            gsap.set(els, { opacity: 1 - self.progress, y: self.progress * -40 })
          },
        })
      }

      if (window.scrollY < 50) {
        // At the top: entrance animation first, ScrollTrigger created after so they can't conflict
        gsap.set(els, { opacity: 0, y: 50 })
        gsap.to(els, {
          opacity: 1,
          y: 0,
          duration: 1.4,
          ease: 'power3.out',
          stagger: 0.25,
          delay: 0.5,
          onComplete: createScrollFade,
        })
      } else {
        // Not at top (e.g. navigated back while scrolled): snap to correct state immediately
        const container = containerRef.current
        const progress = container
          ? Math.min(Math.max(window.scrollY / (container.offsetHeight * 0.25), 0), 1)
          : 0
        gsap.set(els, { opacity: 1 - progress, y: progress * -40 })
        createScrollFade()
      }
    }, containerRef)

    return () => {
      ctx.revert()
      st?.kill()
    }
  }, [])

  return (
    // Scroll length that drives the video scrub. Kept short so the hero doesn't
    // hijack the page — even shorter on mobile where long scrolls are tedious.
    <div ref={containerRef} className="relative h-[180vh] md:h-[260vh]">
      {/* Sticky container — holds both video and text overlay */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {mounted && isMobile ? (
          /* Mobile: square clip that autoplay-loops — no scroll-scrub, so no
             per-seek decode stutter. Centered framing survives the portrait crop. */
          <video
            key="mobile"
            src="/video/hero-mobile.mp4"
            poster="/video/hero-mobile-poster.jpg"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          /* Desktop: scroll-scrubbed clip. Poster = first frame, shown instantly
             (no black flash). preload stays 'none' until mount so phones never
             fetch this file before we've switched them to the mobile clip; once
             we know it's desktop it flips to 'auto' and buffers the whole <1 MB. */
          <video
            key="desktop"
            ref={videoRef}
            src="/video/hero.mp4"
            poster="/video/hero-poster.jpg"
            muted
            playsInline
            preload={mounted ? 'auto' : 'none'}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* Gradient overlay for text legibility — heavier bottom-left for the title block */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, oklch(0.08 0.005 40 / 0.78) 0%, oklch(0.08 0.005 40 / 0.15) 38%, transparent 60%), radial-gradient(120% 90% at 0% 100%, oklch(0.08 0.005 40 / 0.6) 0%, transparent 55%)',
          }}
        />

        {/* Hero text — anchored to the dark lower-left, fades out on scroll */}
        <div className="absolute inset-0 flex flex-col justify-end items-start pointer-events-none px-5 md:px-10 pb-16 md:pb-24">
          <div className="w-full max-w-[44rem]">
            {/* Title group */}
            <div ref={headingRef} style={{ opacity: 0, willChange: 'opacity, transform' }} className="select-none">
              <p
                className="mb-3.5 md:mb-4"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(0.5625rem, 1vw, 0.75rem)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3em',
                  color: 'var(--pm-accent-bright)',
                }}
              >
                <span style={{ color: 'var(--pm-accent)' }}>&#9632;</span>&nbsp;&nbsp;{t.hero.eyebrow}&nbsp;&middot;&nbsp;{t.hero.estTag}
              </p>
              <h1
                className="pm-display text-white"
                style={{
                  fontSize: 'clamp(2.5rem, 8vw, 7rem)',
                  textShadow: '0 6px 80px oklch(0.08 0.005 40 / 0.7)',
                }}
              >
                {t.hero.titleLine1}
                <br />
                <span style={{ color: 'var(--pm-accent)' }}>{t.hero.titleAccent}</span>
              </h1>
            </div>

            {/* Descriptor + scroll hint */}
            <div
              ref={taglineRef}
              style={{ opacity: 0, willChange: 'opacity, transform' }}
              className="mt-6 md:mt-7 flex flex-col sm:flex-row sm:items-end gap-5 sm:gap-10 select-none"
            >
              <p
                className="max-w-sm leading-relaxed"
                style={{
                  fontSize: 'clamp(0.8125rem, 1.4vw, 0.9375rem)',
                  color: 'oklch(0.82 0.005 60)',
                  lineHeight: 1.7,
                }}
              >
                {t.hero.body}
              </p>
              <div className="flex items-center gap-3 shrink-0" aria-hidden="true">
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.625rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.28em',
                    color: 'var(--pm-fg-muted)',
                  }}
                >
                  {t.hero.scrollHint}
                </span>
                <span
                  className="inline-block"
                  style={{
                    width: '2.5rem',
                    height: '1px',
                    background:
                      'linear-gradient(to right, var(--pm-accent), transparent)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
