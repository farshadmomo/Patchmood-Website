'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/pocketbase/client'
import SearchOverlay from './SearchOverlay'
import MobileMenu from './MobileMenu'
import LanguageToggle from './LanguageToggle'
import ProgressLink from '@/components/transition/ProgressLink'
import CometTrail from '@/components/ui/CometTrail'
import { useLocale } from '@/i18n/LocaleProvider'

const hrefFor = (id: string) => (id ? `/#${id}` : '/')

// In the static JSON (Vercel) deploy there's no PocketBase, so login/admin
// can't function — hide the auth entry points entirely.
const JSON_MODE = process.env.NEXT_PUBLIC_DATA_SOURCE === 'json'

// Reliable in-page scroll — bypasses the flaky native hash jump on the
// 500vh GSAP sticky hero. Offsets for the 64px fixed navbar.
function smoothScrollTo(id: string) {
  if (!id) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - 64
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
}

export interface NavbarInitialUser {
  initial: string
  isAdmin: boolean
}

export default function Navbar({ initialUser = null }: { initialUser?: NavbarInitialUser | null }) {
  const router = useRouter()
  const { t } = useLocale()
  const LINKS: { id: string; label: string }[] = [
    { id: '', label: t.nav.index },
    { id: 'collection', label: t.nav.collection },
  ]
  const [scrolled, setScrolled] = useState(false)
  const [userInitial, setUserInitial] = useState<string | null>(initialUser?.initial ?? null)
  const [isAdmin, setIsAdmin] = useState(initialUser?.isAdmin ?? false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  function handleNav(e: React.MouseEvent, id: string) {
    if (window.location.pathname === '/') {
      e.preventDefault()
      smoothScrollTo(id)
    }
    setMenuOpen(false)
    setMobileOpen(false)
  }

  async function handleSignOut() {
    setSigningOut(true)
    const pb = createClient()
    pb.authStore.clear()
    router.push('/')
    router.refresh()
  }

  function scrollToTop(e: React.MouseEvent) {
    if (window.location.pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const pb = createClient()

    function syncUser() {
      const record = pb.authStore.record
      if (pb.authStore.isValid && record) {
        setUserInitial((record.email?.[0] ?? '?').toUpperCase())
        setIsAdmin(pb.authStore.isValid)
      } else {
        setUserInitial(null)
        setIsAdmin(false)
      }
    }

    // Subscribe to auth changes — initialUser from the server is already fresh
    const unsubscribe = pb.authStore.onChange(() => {
      syncUser()
    })

    return () => unsubscribe()
  }, [])

  return (
  <>
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: scrolled ? 'oklch(0.10 0.005 40 / 0.72)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--pm-border)' : '1px solid transparent',
        transition: 'background 300ms, border-color 300ms, backdrop-filter 300ms',
      }}
    >
      <div className="flex items-center justify-between px-5 md:px-8 h-16">
        {/* Left — nav links */}
        <nav className="hidden md:flex items-center gap-7 flex-1" aria-label="Primary">
          {LINKS.map((link, i) => (
            <Link
              key={link.label}
              href={hrefFor(link.id)}
              onClick={(e) => handleNav(e, link.id)}
              className="text-[11px] uppercase tracking-[0.18em] transition-colors duration-200"
              style={{ color: i === 0 ? 'var(--pm-fg)' : 'var(--pm-fg-muted)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--pm-accent-bright)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = i === 0 ? 'var(--pm-fg)' : 'var(--pm-fg-muted)')}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile — morphing "archive index" burger */}
        <button
          type="button"
          className="pm-burger md:hidden"
          data-open={mobileOpen}
          aria-label={mobileOpen ? t.mobile.closeMenu : t.mobile.openMenu}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span className="pm-burger-box" aria-hidden="true">
            <span className="pm-burger-bar pm-burger-bar-1" />
            <span className="pm-burger-bar pm-burger-bar-2" />
            <span className="pm-burger-bar pm-burger-bar-3" />
          </span>
        </button>

        {/* Center — wordmark */}
        <Link
          href="/"
          onClick={scrollToTop}
          className="absolute left-1/2 -translate-x-1/2 select-none transition-opacity duration-200"
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            fontSize: '1.0625rem',
            letterSpacing: '0.04em',
            color: 'var(--pm-fg)',
            textDecoration: 'none',
            opacity: mobileOpen ? 0 : 1,
            pointerEvents: mobileOpen ? 'none' : 'auto',
          }}
        >
          Patch<span style={{ color: 'var(--pm-accent)' }}>mood</span>
        </Link>

        {/* Right — actions */}
        <div
          className="flex items-center justify-end gap-3 md:gap-4 flex-1 transition-opacity duration-200"
          style={{
            opacity: mobileOpen ? 0 : 1,
            pointerEvents: mobileOpen ? 'none' : 'auto',
          }}
        >
          <LanguageToggle />
          <button
            onClick={() => setSearchOpen(true)}
            aria-label={t.nav.search}
            className="flex items-center justify-center w-8 h-8 transition-colors duration-200"
            style={{ color: 'var(--pm-fg-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--pm-fg)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--pm-fg-muted)')}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
          {JSON_MODE ? null : userInitial ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={t.nav.accountMenu}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'oklch(0.18 0.012 265)',
                  border: isAdmin ? '2px solid var(--pm-accent)' : '1px solid var(--pm-border-strong)',
                  fontSize: '0.6875rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--pm-fg)',
                  fontWeight: isAdmin ? 600 : 400,
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                {userInitial}
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMenuOpen(false)}
                    aria-hidden="true"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      insetInlineEnd: 0,
                      minWidth: '140px',
                      background: 'oklch(0.12 0.008 265)',
                      border: '1px solid var(--pm-border)',
                      borderRadius: '0.375rem',
                      overflow: 'hidden',
                      zIndex: 50,
                      boxShadow: '0 8px 32px oklch(0.04 0.005 40 / 0.6)',
                    }}
                  >
                    {isAdmin && (
                      <ProgressLink
                        href="/admin"
                        onClick={() => setMenuOpen(false)}
                        style={{
                          display: 'block',
                          padding: '0.625rem 1rem',
                          fontSize: '0.75rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.12em',
                          color: 'var(--pm-accent)',
                          textDecoration: 'none',
                          borderBottom: '1px solid var(--pm-border)',
                        }}
                      >
                        {t.nav.adminPanel}
                      </ProgressLink>
                    )}
                    <button
                      onClick={handleSignOut}
                      disabled={signingOut}
                      style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.625rem 1rem',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        color: signingOut ? 'var(--pm-fg)' : 'var(--pm-fg-muted)',
                        background: 'none',
                        border: 'none',
                        cursor: signingOut ? 'wait' : 'pointer',
                      }}
                      onMouseEnter={(e) => { if (!signingOut) e.currentTarget.style.color = 'var(--pm-fg)' }}
                      onMouseLeave={(e) => { if (!signingOut) e.currentTarget.style.color = 'var(--pm-fg-muted)' }}
                    >
                      {signingOut && <CometTrail />}
                      {signingOut ? t.nav.signingOut : t.nav.signOut}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="text-[11px] uppercase tracking-[0.16em] px-3.5 py-1.5 transition-all duration-200"
              style={{
                color: 'var(--pm-fg)',
                border: '1px solid var(--pm-border-strong)',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--pm-accent)'
                e.currentTarget.style.color = 'var(--pm-accent-bright)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--pm-border-strong)'
                e.currentTarget.style.color = 'var(--pm-fg)'
              }}
            >
              {t.nav.signIn}
            </Link>
          )}
        </div>
      </div>

    </header>
    <MobileMenu
      open={mobileOpen}
      onClose={() => setMobileOpen(false)}
      links={LINKS}
      onNavClick={handleNav}
      hrefFor={hrefFor}
      userInitial={userInitial}
      isAdmin={isAdmin}
      signingOut={signingOut}
      onSignOut={handleSignOut}
      onOpenSearch={() => setSearchOpen(true)}
    />
    <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
  </>
  )
}
