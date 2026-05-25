'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { usePathname } from 'next/navigation'
import { gsap } from '@/lib/gsap'

type WipeAction = () => void | Promise<void>

interface RouteTransitionCtx {
  /** Cover the screen with the red wipe, run `action` (navigation/auth), then reveal. */
  wipeTo: (label: string, action: WipeAction) => void
  /** Drive the top progress bar from a link's pending state. */
  reportPending: (pending: boolean) => void
}

const Ctx = createContext<RouteTransitionCtx | null>(null)

export function useRouteTransition() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useRouteTransition must be used within TransitionProvider')
  return ctx
}

type Phase = 'idle' | 'cover' | 'reveal'

export default function TransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // ─── Full-screen red wipe ───
  const [phase, setPhase] = useState<Phase>('idle')
  const [label, setLabel] = useState('')
  const panelRef = useRef<HTMLDivElement>(null)
  const actionRef = useRef<WipeAction | null>(null)
  const awaitingReveal = useRef(false)
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevPath = useRef(pathname)

  const startReveal = useCallback(() => {
    if (!awaitingReveal.current) return
    awaitingReveal.current = false
    if (revealTimer.current) clearTimeout(revealTimer.current)
    setPhase('reveal')
  }, [])

  const wipeTo = useCallback((nextLabel: string, action: WipeAction) => {
    if (phase !== 'idle') return
    actionRef.current = action
    setLabel(nextLabel)
    setPhase('cover')
  }, [phase])

  // Reveal once the destination route has mounted.
  useEffect(() => {
    if (pathname !== prevPath.current) {
      prevPath.current = pathname
      startReveal()
    }
  }, [pathname, startReveal])

  // Drive the wipe animation per phase.
  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (phase === 'cover') {
      document.body.style.overflow = 'hidden'
      const runAction = async () => {
        try {
          await actionRef.current?.()
        } catch {
          /* navigation/auth errors surface in their own handlers */
        }
        actionRef.current = null
        awaitingReveal.current = true
        // Fallback: reveal even if pathname doesn't change (e.g. sign-out refresh).
        revealTimer.current = setTimeout(startReveal, 650)
      }

      if (reduce) {
        gsap.set(panel, { xPercent: 0, opacity: 1 })
        runAction()
      } else {
        gsap.fromTo(
          panel,
          { xPercent: -100 },
          { xPercent: 0, duration: 0.42, ease: 'power3.in', onComplete: runAction },
        )
      }
    }

    if (phase === 'reveal') {
      const finish = () => {
        document.body.style.overflow = ''
        setPhase('idle')
      }
      if (reduce) {
        gsap.to(panel, { opacity: 0, duration: 0.2, onComplete: finish })
      } else {
        gsap.to(panel, { xPercent: 100, duration: 0.5, ease: 'power4.out', onComplete: finish })
      }
    }
  }, [phase, startReveal])

  // ─── Top progress bar ───
  const [barWidth, setBarWidth] = useState('0%')
  const [barOpacity, setBarOpacity] = useState(0)
  const [barTransition, setBarTransition] = useState('none')
  const navActive = useRef(false)

  const startNav = useCallback(() => {
    if (navActive.current) return
    navActive.current = true
    setBarTransition('none')
    setBarWidth('0%')
    setBarOpacity(1)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setBarTransition('width 9s cubic-bezier(0.1, 0.72, 0.12, 1)')
        setBarWidth('90%')
      })
    })
  }, [])

  const doneNav = useCallback(() => {
    if (!navActive.current) return
    navActive.current = false
    setBarTransition('width 0.2s ease-out')
    setBarWidth('100%')
    setTimeout(() => {
      setBarTransition('opacity 0.3s ease-out')
      setBarOpacity(0)
      setTimeout(() => {
        setBarTransition('none')
        setBarWidth('0%')
      }, 320)
    }, 200)
  }, [])

  const reportPending = useCallback(
    (pending: boolean) => {
      if (pending) startNav()
      else doneNav()
    },
    [startNav, doneNav],
  )

  return (
    <Ctx.Provider value={{ wipeTo, reportPending }}>
      {children}

      {/* Top navigation progress bar */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          insetInlineStart: 0,
          height: '2px',
          width: barWidth,
          opacity: barOpacity,
          background: 'var(--pm-accent)',
          boxShadow: '0 0 8px var(--pm-accent-bright), 0 0 2px var(--pm-accent-bright)',
          transition: barTransition,
          zIndex: 250,
          pointerEvents: 'none',
        }}
      />

      {/* Full-screen red wipe */}
      {phase !== 'idle' && (
        <div
          ref={panelRef}
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 300,
            transform: 'translateX(-100%)',
            background: 'linear-gradient(100deg, var(--pm-accent-dim) 0%, var(--pm-accent) 70%)',
            willChange: 'transform',
            overflow: 'hidden',
          }}
        >
          {/* trailing edge accent so the wipe direction reads clearly */}
          <div
            style={{
              position: 'absolute',
              insetInlineEnd: 0,
              top: 0,
              bottom: 0,
              width: '5px',
              background: 'var(--pm-bg-deep)',
              opacity: 0.35,
            }}
          />
          <div style={{ position: 'absolute', insetInlineStart: 'clamp(1.5rem, 8vw, 6rem)', bottom: 'clamp(3rem, 14vh, 8rem)' }}>
            <h2
              className="pm-display select-none"
              style={{ fontSize: 'clamp(2.75rem, 9vw, 6rem)', color: 'var(--pm-fg)', lineHeight: 0.9 }}
            >
              Patch<span style={{ color: 'var(--pm-bg-deep)' }}>mood</span>
            </h2>
            <p
              style={{
                marginTop: '0.85rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.32em',
                color: 'var(--pm-fg)',
                opacity: 0.85,
              }}
            >
              <span style={{ color: 'var(--pm-bg-deep)' }}>&#9632;</span>&nbsp;&nbsp;{label}
            </p>
          </div>
        </div>
      )}
    </Ctx.Provider>
  )
}
