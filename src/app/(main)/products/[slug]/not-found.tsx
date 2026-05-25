import ProgressLink from '@/components/transition/ProgressLink'
import { getServerDictionary } from '@/i18n/server'

export default async function ProductNotFound() {
  const { t } = await getServerDictionary()
  return (
    <main
      className="flex flex-col items-center justify-center text-center px-6"
      style={{ background: 'var(--pm-bg)', minHeight: '100dvh' }}
    >
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6875rem',
          textTransform: 'uppercase',
          letterSpacing: '0.3em',
          color: 'var(--pm-accent)',
          marginBottom: '1.5rem',
        }}
      >
        <span style={{ color: 'var(--pm-accent)' }}>&#9632;</span>&nbsp;&nbsp;{t.notFound.eyebrow}
      </p>

      <h1
        className="pm-display text-white"
        style={{ fontSize: 'clamp(3rem, 12vw, 8rem)', lineHeight: 0.9, marginBottom: '1.5rem' }}
      >
        {t.notFound.titleLine1}<br /><span style={{ color: 'var(--pm-accent)' }}>{t.notFound.titleAccent}</span>
      </h1>

      <p
        style={{
          fontSize: '0.9375rem',
          color: 'var(--pm-fg-muted)',
          lineHeight: 1.7,
          maxWidth: '34ch',
          marginBottom: '2.5rem',
        }}
      >
        {t.notFound.body}
      </p>

      <ProgressLink
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
        }}
      >
        {t.notFound.cta}
        <svg className="pm-flip-rtl" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </ProgressLink>
    </main>
  )
}
