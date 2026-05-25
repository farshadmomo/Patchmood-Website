'use client'

import { createContext, useContext, useMemo } from 'react'
import { dirFor, type Locale } from './config'
import { dictionaries, type Dictionary } from './dictionaries'

interface LocaleContextValue {
  locale: Locale
  dir: 'ltr' | 'rtl'
  t: Dictionary
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale
  children: React.ReactNode
}) {
  // Dictionaries hold functions, so they can't cross the server→client boundary
  // as props. We pass the (serializable) locale and resolve the dictionary here.
  const value = useMemo<LocaleContextValue>(
    () => ({ locale, dir: dirFor(locale), t: dictionaries[locale] }),
    [locale],
  )
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within a LocaleProvider')
  return ctx
}
