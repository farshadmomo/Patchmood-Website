'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

interface SkeletonProps {
  blocks: React.ReactNode
}

export function SkeletonShell({ blocks }: SkeletonProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const shimmers = ref.current.querySelectorAll<HTMLElement>('.sk-shimmer')
    if (!shimmers.length) return

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.1 })
    tl.fromTo(
      shimmers,
      { xPercent: -110 },
      { xPercent: 220, duration: 1.1, ease: 'power1.inOut', stagger: 0.06 },
    )

    return () => { tl.kill() }
  }, [])

  return <div ref={ref}>{blocks}</div>
}

export function Sk({
  w,
  h,
  r = 2,
  style,
}: {
  w?: string
  h?: string
  r?: number
  style?: React.CSSProperties
}) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: r,
        background: 'oklch(0.14 0.010 265)',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
        ...style,
      }}
    >
      <div
        className="sk-shimmer"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(105deg, transparent 0%, oklch(0.22 0.012 265 / 0.65) 50%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
