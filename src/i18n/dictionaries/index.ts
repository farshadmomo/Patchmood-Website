import type { Locale } from '../config'
import { en } from './en'
import { fa } from './fa'

export type Dictionary = typeof en

export const dictionaries: Record<Locale, Dictionary> = { en, fa }

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}
