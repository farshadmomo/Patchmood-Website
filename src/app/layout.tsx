import type { Metadata } from 'next'
import { Anton, Archivo, Vazirmatn, Lalezar } from 'next/font/google'
import './globals.css'
import TransitionProvider from '@/components/transition/TransitionProvider'
import { LocaleProvider } from '@/i18n/LocaleProvider'
import { dirFor } from '@/i18n/config'
import { getLocale } from '@/i18n/server'

const anton = Anton({
  variable: '--font-display',
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

const archivo = Archivo({
  variable: '--font-body',
  subsets: ['latin'],
  display: 'swap',
})

// Persian pairing: Lalezar (heavy poster display) + Vazirmatn (clean body).
const vazirmatn = Vazirmatn({
  variable: '--font-fa-body',
  subsets: ['arabic'],
  display: 'swap',
})

const lalezar = Lalezar({
  variable: '--font-fa-display',
  weight: '400',
  subsets: ['arabic'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PatchMood',
  description: 'Wear your mood — browse our collection',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const dir = dirFor(locale)

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${anton.variable} ${archivo.variable} ${vazirmatn.variable} ${lalezar.variable} h-full`}
      style={{ '--font-latin-display': anton.style.fontFamily } as React.CSSProperties}
    >
      <body className={`min-h-full flex flex-col${locale === 'fa' ? ' lang-fa' : ''}`}>
        <LocaleProvider locale={locale}>
          <TransitionProvider>{children}</TransitionProvider>
        </LocaleProvider>
      </body>
    </html>
  )
}
