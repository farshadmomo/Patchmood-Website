import PocketBase from 'pocketbase'
import { cookies } from 'next/headers'
import { PB_COOKIE_KEY } from './cookie'

/**
 * Server-side PocketBase client. Loads the auth session from the request's
 * `pb_auth` cookie so superuser-gated reads/writes run as the logged-in admin.
 */
export async function createClient() {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL!)
  pb.autoCancellation(false)
  const cookieStore = await cookies()
  pb.authStore.loadFromCookie(cookieStore.toString(), PB_COOKIE_KEY)
  return pb
}

/**
 * Service client authenticated as the master superuser.
 * Used for mutations when the logged-in user is a regular admin (admins collection),
 * since PocketBase write rules are null (superuser-only) for products/categories.
 * Note: PB_SUPERUSER_EMAIL/PASSWORD must stay in sync with the master account.
 */
export async function createServiceClient() {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL!)
  pb.autoCancellation(false)
  await pb.collection('_superusers').authWithPassword(
    process.env.PB_SUPERUSER_EMAIL!,
    process.env.PB_SUPERUSER_PASSWORD!,
  )
  return pb
}
