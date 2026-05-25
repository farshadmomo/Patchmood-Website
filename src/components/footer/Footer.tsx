'use client'

import { useLocale } from '@/i18n/LocaleProvider'

/* Physical showrooms — addresses are real Tehran locations, always Persian
   regardless of UI language (they're signage, not translatable chrome). */
const STORES = [
  { district: 'فرمانیه', detail: 'پاساژ آرتمیس، طبقهٔ همکف، پلاک ۲۸' },
  { district: 'شهرک غرب', detail: 'پاساژ پلاتین، طبقهٔ ۳، پلاک ۳۵۳' },
  { district: 'میدان فاطمی', detail: 'پاساژ پرنیان، طبقهٔ ۲، پلاک ۴' },
] as const

const PHONE_DISPLAY = '۸۶۰۹۰۲۴۹'
const PHONE_DIAL = '+982186090249'
const YEAR = '2026'
const AUTHOR = 'Farshad Momtaz'

function PinIcon() {
  return (
    <svg
      className="pm-store-pin flex-shrink-0"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 3h3.2l1.4 4-2 1.4a12 12 0 0 0 5 5l1.4-2 4 1.4V19a2 2 0 0 1-2.2 2A16 16 0 0 1 3 5.2 2 2 0 0 1 5 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* Tiny Iran tricolor — crisp vector instead of an emoji flag. */
function IranFlag() {
  return (
    <svg
      width="22"
      height="15"
      viewBox="0 0 22 15"
      aria-hidden="true"
      style={{ borderRadius: '1.5px', flexShrink: 0 }}
    >
      <rect width="22" height="15" fill="#fff" />
      <rect width="22" height="5" fill="#239f40" />
      <rect width="22" height="5" y="10" fill="#da0000" />
    </svg>
  )
}

export default function Footer() {
  const { t } = useLocale()

  return (
    <footer
      className="pm-foot relative w-full overflow-hidden"
      style={{
        background: 'var(--pm-bg-deep)',
        borderTop: '1px solid var(--pm-border)',
      }}
    >
      {/* ── atmosphere (decorative) ── */}
      <span className="pm-foot-glow pm-foot-glow-a" aria-hidden="true" />
      <span className="pm-foot-glow pm-foot-glow-b" aria-hidden="true" />
      <span className="pm-foot-grid" aria-hidden="true" />
      <span className="pm-foot-sweep" aria-hidden="true" />
      <span className="pm-foot-ghost" dir="ltr" aria-hidden="true">PATCHMOOD</span>

      {/* ── content ── */}
      <div
        className="relative mx-auto w-full"
        style={{ maxWidth: '80rem', padding: '4.5rem 1.5rem 2rem', zIndex: 1 }}
      >
        {/* brand + shipping */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                color: 'var(--pm-accent)',
                marginBottom: '0.6rem',
              }}
            >
              {t.footer.eyebrow}
            </p>
            <p className="pm-display text-white" style={{ fontSize: 'clamp(2rem, 6vw, 3.25rem)' }}>
              PATCHMOOD
            </p>
          </div>

          {/* shipping pill */}
          <div
            className="inline-flex items-center gap-2.5 self-start md:self-auto"
            style={{
              border: '1px solid var(--pm-border-strong)',
              background: 'oklch(0.58 0.225 27 / 0.08)',
              padding: '0.55rem 0.95rem',
            }}
          >
            <IranFlag />
            <span
              dir="auto"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: 'var(--pm-fg)',
              }}
            >
              {t.footer.shipping}
            </span>
          </div>
        </div>

        {/* divider */}
        <div style={{ height: '1px', background: 'var(--pm-border)', margin: '2.75rem 0 2.25rem' }} />

        {/* locations */}
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.625rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'var(--pm-fg-subtle)',
            marginBottom: '1.1rem',
          }}
        >
          {t.footer.locations}
        </p>

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {STORES.map((store, i) => (
            <li
              key={store.district}
              className="pm-store flex items-start gap-3"
              aria-label={t.footer.storeAria(store.district)}
              style={{
                border: '1px solid var(--pm-border)',
                background: 'var(--pm-surface)',
                padding: '1.1rem 1.15rem',
              }}
            >
              <PinIcon />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span
                    dir="auto"
                    className="pm-display text-white"
                    style={{ fontSize: '1.15rem', lineHeight: 1.2 }}
                  >
                    {store.district}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.625rem',
                      color: 'var(--pm-fg-subtle)',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <p
                  dir="auto"
                  style={{
                    fontSize: '0.8125rem',
                    lineHeight: 1.6,
                    color: 'var(--pm-fg-muted)',
                    marginTop: '0.35rem',
                  }}
                >
                  {store.detail}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* contact */}
        <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.625rem',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: 'var(--pm-fg-subtle)',
            }}
          >
            {t.footer.contact}
          </span>
          <a
            href={`tel:${PHONE_DIAL}`}
            aria-label={t.footer.callAria}
            className="pm-foot-phone inline-flex items-center gap-2"
            style={{ textDecoration: 'none' }}
          >
            <span style={{ color: 'var(--pm-accent)' }}>
              <PhoneIcon />
            </span>
            <span
              dir="ltr"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.05rem',
                letterSpacing: '0.06em',
              }}
            >
              {PHONE_DISPLAY}
            </span>
          </a>
        </div>

        {/* bottom bar */}
        <div
          className="mt-12 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderTop: '1px solid var(--pm-border)', paddingTop: '1.4rem' }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.625rem',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--pm-fg-subtle)',
            }}
          >
            {t.footer.rights(YEAR)}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.625rem',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--pm-fg-subtle)',
            }}
          >
            {t.footer.madeBy}{' '}
            <a
              href="https://github.com/farshadmomo"
              target="_blank"
              rel="noopener noreferrer"
              dir="ltr"
              className="pm-foot-author"
              style={{ textDecoration: 'none', fontWeight: 500 }}
            >
              {AUTHOR}
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
