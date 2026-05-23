import ProgressLink from '@/components/transition/ProgressLink'

export default function ProductNotFound() {
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
        <span style={{ color: 'var(--pm-accent)' }}>&#9632;</span>&nbsp;&nbsp;Specimen not found
      </p>

      <h1
        className="pm-display text-white"
        style={{ fontSize: 'clamp(3rem, 12vw, 8rem)', lineHeight: 0.9, marginBottom: '1.5rem' }}
      >
        Off the<br /><span style={{ color: 'var(--pm-accent)' }}>record</span>
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
        This piece isn&rsquo;t in the archive — it may have been retired, or the link slipped a thread.
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
        Back to the archive
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </ProgressLink>
    </main>
  )
}
