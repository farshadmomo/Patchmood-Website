import PocketBase from 'pocketbase'
import { NextResponse, type NextRequest } from 'next/server'
import { PB_COOKIE_KEY } from '@/lib/pocketbase/cookie'

export default async function middleware(request: NextRequest) {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL!)
  pb.authStore.loadFromCookie(request.headers.get('cookie') ?? '', PB_COOKIE_KEY)

  if (!pb.authStore.isValid) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Valid session must be either a superuser (master) or an admins-collection user
  const isAnyAdmin =
    pb.authStore.isSuperuser || pb.authStore.record?.collectionName === 'admins'

  if (!isAnyAdmin) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
