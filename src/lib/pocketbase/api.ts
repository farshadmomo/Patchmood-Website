import { NextResponse } from 'next/server'
import { ClientResponseError } from 'pocketbase'
import type PocketBase from 'pocketbase'

/** True when the request carries a valid superuser (admin master) session. */
export function isAdmin(pb: PocketBase) {
  return pb.authStore.isValid && pb.authStore.isSuperuser
}

/** True when the request carries a valid session from either _superusers or the admins collection. */
export function isAnyAdmin(pb: PocketBase) {
  if (!pb.authStore.isValid) return false
  if (pb.authStore.isSuperuser) return true
  return pb.authStore.record?.collectionName === 'admins'
}

/**
 * Map a thrown error from a PocketBase mutation to an ApiResponse JSON response.
 * `conflictMessage` is returned (409) when the failure is a uniqueness violation.
 */
export function pbErrorResponse(err: unknown, fallback: string, conflictMessage?: string) {
  if (err instanceof ClientResponseError) {
    const fieldErrors = (err.response?.data ?? {}) as Record<string, { code?: string }>
    const hasConflict = Object.values(fieldErrors).some((f) => f?.code === 'validation_not_unique')
    if (hasConflict && conflictMessage) {
      return NextResponse.json({ success: false, error: conflictMessage }, { status: 409 })
    }
    return NextResponse.json(
      { success: false, error: err.message || fallback },
      { status: err.status || 400 },
    )
  }
  return NextResponse.json({ success: false, error: fallback }, { status: 500 })
}

export function toSlug(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '')
}
