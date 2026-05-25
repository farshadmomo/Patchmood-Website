import type { SerializeOptions } from 'pocketbase'

export const PB_COOKIE_KEY = 'pb_auth'

// Non-httpOnly so the browser PocketBase client can read/refresh the session,
// matching the JS-readable auth cookie model the app used previously.
// secure is gated on https so the cookie still flows over http://127.0.0.1 in dev.
export function pbCookieOptions(secure: boolean): SerializeOptions {
  return { httpOnly: false, secure, sameSite: 'Lax', path: '/' }
}
