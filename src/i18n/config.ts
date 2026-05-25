export const LOCALE_COOKIE = 'pm_locale'

export const LOCALES = ['en', 'fa'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'

export function isLocale(value: string | undefined | null): value is Locale {
  return value === 'en' || value === 'fa'
}

export function dirFor(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'fa' ? 'rtl' : 'ltr'
}
