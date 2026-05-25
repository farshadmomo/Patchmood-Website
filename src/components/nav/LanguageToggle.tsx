'use client'

import { useRouter } from 'next/navigation'
import { LOCALE_COOKIE } from '@/i18n/config'
import { useLocale } from '@/i18n/LocaleProvider'

interface LanguageToggleProps {
  /** 'bar' = compact navbar control; 'menu' = full-width row in the mobile drawer */
  variant?: 'bar' | 'menu'
  onToggled?: () => void
}

export default function LanguageToggle({ variant = 'bar', onToggled }: LanguageToggleProps) {
  const router = useRouter()
  const { locale, t } = useLocale()

  const next = locale === 'en' ? 'fa' : 'en'
  const label = next === 'fa' ? t.toggle.toFa : t.toggle.toEn
  const aria = next === 'fa' ? t.toggle.ariaToFa : t.toggle.ariaToEn

  function switchLocale() {
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`
    // Optimistic: flip document direction, language and font class immediately,
    // then refresh so server components re-render with the new dictionary.
    const root = document.documentElement
    root.lang = next
    root.dir = next === 'fa' ? 'rtl' : 'ltr'
    document.body.classList.toggle('lang-fa', next === 'fa')
    onToggled?.()
    router.refresh()
  }

  const Globe = (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M8 1.75c1.8 1.6 2.8 3.85 2.8 6.25S9.8 12.65 8 14.25C6.2 12.65 5.2 10.4 5.2 8S6.2 3.35 8 1.75Z"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <path d="M1.9 8h12.2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  )

  if (variant === 'menu') {
    return (
      <button
        onClick={switchLocale}
        aria-label={aria}
        className="w-full flex items-center gap-3"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.16em',
          color: 'var(--pm-fg-muted)',
          background: 'none',
          border: 'none',
          padding: '0.85rem 0',
          cursor: 'pointer',
          minHeight: '2.75rem',
          touchAction: 'manipulation',
        }}
      >
        {Globe}
        {label}
      </button>
    )
  }

  return (
    <button
      onClick={switchLocale}
      aria-label={aria}
      className="flex items-center justify-center gap-1.5 transition-colors duration-200"
      style={{
        minWidth: '44px',
        height: '32px',
        padding: '0 0.35rem',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--pm-fg-muted)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.625rem',
        textTransform: 'uppercase',
        letterSpacing: '0.14em',
        touchAction: 'manipulation',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--pm-fg)')}
      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--pm-fg-muted)')}
    >
      {Globe}
      {label}
    </button>
  )
}
