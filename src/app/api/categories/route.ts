import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/pocketbase/server'
import { toCategory } from '@/lib/pocketbase/transform'
import { isAnyAdmin, pbErrorResponse, toSlug } from '@/lib/pocketbase/api'

export async function GET() {
  try {
    const pb = await createClient()
    const records = await pb.collection('categories').getFullList({ sort: 'name' })
    return NextResponse.json({ success: true, data: records.map(toCategory) })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const pb = await createClient()

  if (!isAnyAdmin(pb)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  }

  const formData = await request.formData()
  const name = String(formData.get('name') ?? '').trim()
  if (!name) {
    return NextResponse.json({ success: false, error: 'Name required' }, { status: 400 })
  }

  const data: Record<string, unknown> = { name, slug: toSlug(name) }
  const image = formData.get('image')
  if (image instanceof File && image.size > 0) data.image = image

  try {
    const svc = pb.authStore.isSuperuser ? pb : await createServiceClient()
    const record = await svc.collection('categories').create(data)
    return NextResponse.json({ success: true, data: toCategory(record) }, { status: 201 })
  } catch (err) {
    return pbErrorResponse(err, 'Failed to create category', 'Category already exists')
  }
}
