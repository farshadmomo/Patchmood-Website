import Link from 'next/link'
import { getServerDictionary } from '@/i18n/server'

export default async function NotFound() {
  const { t } = await getServerDictionary()
  const code = t.error404.code

  return (
    <main
      className="pm-404 flex flex-col items-center justify-center text-center"
      style={{ background: 'var(--pm-bg)', padding: '4.5rem 1.5rem 3rem' }}
    >
      {/* ── atmosphere (decorative) ── */}
      <span className="pm-404-glow pm-404-glow-a" aria-hidden="true" />
      <span className="pm-404-glow pm-404-glow-b" aria-hidden="true" />
      <span className="pm-404-grid" aria-hidden="true" />
      <span className="pm-404-scan" aria-hidden="true" />
      <span className="pm-404-scanlines" aria-hidden="true" />
      <span className="pm-404-reg pm-404-reg-tl" aria-hidden="true" />
      <span className="pm-404-reg pm-404-reg-tr" aria-hidden="true" />
      <span className="pm-404-reg pm-404-reg-bl" aria-hidden="true" />
      <span className="pm-404-reg pm-404-reg-br" aria-hidden="true" />

      {/* ── top wordmark (so the visitor is never stranded) ── */}
      <Link
        href="/"
        aria-label={t.error404.home}
        className="pm-404-wordmark pm-display"
        dir="ltr"
        style={{
          position: 'absolute',
          insetBlockStart: '1.75rem',
          insetInlineStart: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
          fontSize: '1rem',
          letterSpacing: '0.18em',
          textDecoration: 'none',
          fontFamily: 'var(--font-latin-display, var(--font-display))',
        }}
      >
        PATCHMOOD
      </Link>

      {/* ── content ── */}
      <div className="relative flex flex-col items-center" style={{ zIndex: 3 }}>
        <p
          className="pm-404-rise"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.32em',
            color: 'var(--pm-accent)',
            marginBottom: '0.75rem',
            animation: 'pm-404-rise 0.7s cubic-bezier(0.22,1,0.36,1) both',
            animationDelay: '0.05s',
          }}
        >
          <span aria-hidden="true">&#9632;</span>&nbsp;&nbsp;{t.error404.eyebrow}
        </p>

        <div
          className="pm-404-code pm-display"
          style={{ animation: 'pm-404-rise 0.8s cubic-bezier(0.22,1,0.36,1) both', animationDelay: '0.12s' }}
        >
          <span className="pm-404-ghost pm-404-ghost-a" aria-hidden="true">{code}</span>
          <span className="pm-404-ghost pm-404-ghost-b" aria-hidden="true">{code}</span>
          <span className="pm-404-code-main">{code}</span>
        </div>

        <p
          dir="auto"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.625rem',
            textTransform: 'uppercase',
            letterSpacing: '0.22em',
            color: 'var(--pm-fg-subtle)',
            marginTop: '0.5rem',
            marginBottom: '2rem',
            animation: 'pm-404-rise 0.7s cubic-bezier(0.22,1,0.36,1) both',
            animationDelay: '0.24s',
          }}
        >
          {t.error404.ref}
        </p>

        <h1
          className="pm-display text-white"
          dir="auto"
          style={{
            fontSize: 'clamp(1.85rem, 6.5vw, 3.75rem)',
            lineHeight: 1,
            marginBottom: '1.4rem',
            animation: 'pm-404-rise 0.7s cubic-bezier(0.22,1,0.36,1) both',
            animationDelay: '0.34s',
          }}
        >
          {t.error404.titleLine1}{' '}
          <span style={{ color: 'var(--pm-accent)' }}>{t.error404.titleAccent}</span>
        </h1>

        <p
          dir="auto"
          style={{
            fontSize: '0.9375rem',
            color: 'var(--pm-fg-muted)',
            lineHeight: 1.7,
            maxWidth: '42ch',
            marginBottom: '2.5rem',
            animation: 'pm-404-rise 0.7s cubic-bezier(0.22,1,0.36,1) both',
            animationDelay: '0.46s',
          }}
        >
          {t.error404.body}
        </p>

        <Link
          href="/#collection"
          className="pm-cta inline-flex items-center gap-2.5"
          style={{
            padding: '1rem 1.75rem',
            color: 'oklch(0.97 0.004 60)',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.25em',
            fontWeight: 600,
            textDecoration: 'none',
            animation: 'pm-404-rise 0.7s cubic-bezier(0.22,1,0.36,1) both',
            animationDelay: '0.58s',
          }}
        >
          {t.error404.cta}
          <svg className="pm-flip-rtl" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </main>
  )
}
