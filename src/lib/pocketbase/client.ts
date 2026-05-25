import PocketBase from 'pocketbase'
import { PB_COOKIE_KEY, pbCookieOptions } from './cookie'

let pb: PocketBase | null = null

/**
 * Browser PocketBase client (singleton). Keeps its auth session in sync with a
 * JS-readable `pb_auth` cookie so the middleware and server components can read it.
 */
export function createClient() {
  if (pb) return pb

  pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL!)

  if (typeof document !== 'undefined') {
    pb.authStore.loadFromCookie(document.cookie, PB_COOKIE_KEY)
    pb.authStore.onChange(() => {
      document.cookie = pb!.authStore.exportToCookie(
        pbCookieOptions(location.protocol === 'https:'),
        PB_COOKIE_KEY,
      )
    })
  }

  return pb
}
