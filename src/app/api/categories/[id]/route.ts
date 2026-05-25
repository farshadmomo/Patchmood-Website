import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/pocketbase/server'
import { toCategory } from '@/lib/pocketbase/transform'
import { isAnyAdmin, pbErrorResponse, toSlug } from '@/lib/pocketbase/api'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const pb = await createClient()

  if (!isAnyAdmin(pb)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const formData = await request.formData()

  const data: Record<string, unknown> = {}
  const name = formData.get('name')
  if (typeof name === 'string' && name.trim()) {
    data.name = name.trim()
    data.slug = toSlug(name)
  }
  const image = formData.get('image')
  if (image instanceof File && image.size > 0) data.image = image
  if (formData.get('removeImage') === 'true') data.image = null

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ success: false, error: 'Nothing to update' }, { status: 400 })
  }

  try {
    const svc = pb.authStore.isSuperuser ? pb : await createServiceClient()
    const record = await svc.collection('categories').update(id, data)
    return NextResponse.json({ success: true, data: toCategory(record) })
  } catch (err) {
    return pbErrorResponse(err, 'Failed to update category', 'Category already exists')
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const pb = await createClient()

  if (!isAnyAdmin(pb)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  try {
    const svc = pb.authStore.isSuperuser ? pb : await createServiceClient()
    await svc.collection('categories').delete(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
  }
}
