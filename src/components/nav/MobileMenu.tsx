'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import ProgressLink from '@/components/transition/ProgressLink'
import CometTrail from '@/components/ui/CometTrail'
import LanguageToggle from './LanguageToggle'
import { useLocale } from '@/i18n/LocaleProvider'

// Static JSON (Vercel) deploy has no PocketBase — hide auth entry points.
const JSON_MODE = process.env.NEXT_PUBLIC_DATA_SOURCE === 'json'

export interface MobileNavLink {
  id: string
  label: string
}

interface MobileMenuProps {
  open: boolean
  onClose: () => void
  links: MobileNavLink[]
  onNavClick: (e: React.MouseEvent, id: string) => void
  hrefFor: (id: string) => string
  userInitial: string | null
  isAdmin: boolean
  signingOut: boolean
  onSignOut: () => void
  onOpenSearch: () => void
}

export default function MobileMenu({
  open,
  onClose,
  links,
  onNavClick,
  hrefFor,
  userInitial,
  isAdmin,
  signingOut,
  onSignOut,
  onOpenSearch,
}: MobileMenuProps) {
  const { t, dir } = useLocale()
  // Lock body scroll + close on Escape while open
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    <div
      id="mobile-menu"
      className="md:hidden fixed inset-0 z-40"
      aria-hidden={!open}
      style={{ pointerEvents: open ? 'auto' : 'none' }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0"
        style={{
          background: 'oklch(0.07 0.005 40 / 0.66)',
          backdropFilter: open ? 'blur(6px)' : 'blur(0px)',
          opacity: open ? 1 : 0,
          transition: 'opacity 320ms ease, backdrop-filter 320ms ease',
        }}
      />

      {/* Drawer panel */}
      <nav
        aria-label={t.mobile.navigation}
        className="absolute top-0 h-full flex flex-col"
        style={{
          insetInlineEnd: 0,
          width: 'min(86vw, 380px)',
          background: 'var(--pm-bg-deep)',
          borderInlineStart: '1px solid var(--pm-border)',
          boxShadow: dir === 'rtl'
            ? '24px 0 60px oklch(0.04 0.005 40 / 0.6)'
            : '-24px 0 60px oklch(0.04 0.005 40 / 0.6)',
          transform: open
            ? 'translateX(0)'
            : dir === 'rtl'
              ? 'translateX(-100%)'
              : 'translateX(100%)',
          transition: 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
          paddingTop: 'calc(4rem + env(safe-area-inset-top, 0px))',
        }}
      >
        {/* Red signature strip on the leading edge */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            insetInlineStart: 0,
            width: '3px',
            height: '100%',
            background: 'linear-gradient(to bottom, var(--pm-accent), transparent 70%)',
          }}
        />

        {/* Header label + crop mark */}
        <div className="px-7 pt-6 pb-5 flex items-center justify-between">
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.5625rem',
              textTransform: 'uppercase',
              letterSpacing: '0.32em',
              color: 'var(--pm-fg-subtle)',
            }}
          >
            <span style={{ color: 'var(--pm-accent)' }}>&#9632;</span>&nbsp;&nbsp;{t.mobile.navigation}
          </span>
          <span
            aria-hidden="true"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.2em', color: 'var(--pm-fg-subtle)' }}
          >
            PM&ndash;{String(links.length).padStart(2, '0')}
          </span>
        </div>

        {/* Big nav links */}
        <div className="px-7 flex flex-col gap-5 mt-2">
          {links.map((link, i) => (
            <Link
              key={link.label}
              href={hrefFor(link.id)}
              onClick={(e) => onNavClick(e, link.id)}
              className="pm-menu-link select-none"
              style={{
                opacity: open ? 1 : 0,
                transform: open
                  ? 'translateX(0)'
                  : dir === 'rtl'
                    ? 'translateX(-28px)'
                    : 'translateX(28px)',
                transitionDelay: open ? `${120 + i * 70}ms` : '0ms',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  letterSpacing: '0.18em',
                  color: 'var(--pm-accent)',
                  paddingTop: '0.45rem',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="pm-display" style={{ fontSize: 'clamp(2rem, 11vw, 2.75rem)', lineHeight: 0.95 }}>
                {link.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="px-7 my-7">
          <span style={{ display: 'block', height: '1px', background: 'var(--pm-border)' }} />
        </div>

        {/* Utility row — search + language */}
        <div className="px-7">
          <button
            onClick={() => {
              onClose()
              onOpenSearch()
            }}
            className="w-full flex items-center gap-3"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.16em',
              color: 'var(--pm-fg-muted)',
              padding: '0.85rem 0',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            {t.mobile.searchArchive}
          </button>
          <LanguageToggle variant="menu" onToggled={onClose} />
        </div>

        {/* Account block — pinned to the bottom */}
        <div className="mt-auto px-7 pb-8" style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom, 0px))' }}>
          <span style={{ display: 'block', height: '1px', background: 'var(--pm-border)', marginBottom: '1.25rem' }} />
          {JSON_MODE ? null : userInitial ? (
            <div className="flex flex-col gap-1.5">
              {isAdmin && (
                <ProgressLink
                  href="/admin"
                  onClick={onClose}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.16em',
                    color: 'var(--pm-accent)',
                    textDecoration: 'none',
                    padding: '0.6rem 0',
                  }}
                >
                  {t.nav.adminPanel}
                </ProgressLink>
              )}
              <button
                onClick={onSignOut}
                disabled={signingOut}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  textAlign: 'start',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.16em',
                  color: 'var(--pm-fg-muted)',
                  background: 'none',
                  border: 'none',
                  cursor: signingOut ? 'wait' : 'pointer',
                  padding: '0.6rem 0',
                }}
              >
                {signingOut && <CometTrail />}
                {signingOut ? t.nav.signingOut : t.nav.signOut}
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={onClose}
              className="flex items-center justify-center"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.16em',
                color: 'var(--pm-fg)',
                border: '1px solid var(--pm-border-strong)',
                textDecoration: 'none',
                padding: '0.85rem',
              }}
            >
              {t.nav.signIn}
            </Link>
          )}
          <p
            className="mt-6"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.24em', color: 'var(--pm-fg-subtle)', textTransform: 'uppercase' }}
          >
            Patch<span style={{ color: 'var(--pm-accent)' }}>mood</span> &middot; {t.mobile.estTag}
          </p>
        </div>
      </nav>
    </div>
  )
}
