import { NextResponse } from 'next/server'
import { createClient } from '@/lib/pocketbase/server'

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const pb = await createClient()
  if (!pb.authStore.isValid || !pb.authStore.isSuperuser) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  }
  const { id } = await params
  try {
    await pb.collection('admins').delete(id)
    return NextResponse.json({ success: true, data: null })
  } catch {
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
  }
}
