import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/pocketbase/server'
import { toProduct } from '@/lib/pocketbase/transform'
import { isAnyAdmin, pbErrorResponse } from '@/lib/pocketbase/api'

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  try {
    const pb = await createClient()
    const record = await pb.collection('products').getOne(id)
    return NextResponse.json({ success: true, data: toProduct(record) })
  } catch {
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const pb = await createClient()

  if (!isAnyAdmin(pb)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  try {
    const formData = await request.formData()
    const svc = pb.authStore.isSuperuser ? pb : await createServiceClient()
    const record = await svc.collection('products').update(id, formData)
    return NextResponse.json({ success: true, data: toProduct(record) })
  } catch (err) {
    return pbErrorResponse(err, 'Failed to update product', 'A product with this slug already exists')
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const pb = await createClient()

  if (!isAnyAdmin(pb)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  try {
    const svc = pb.authStore.isSuperuser ? pb : await createServiceClient()
    await svc.collection('products').delete(id)
    return NextResponse.json({ success: true, data: null })
  } catch {
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
  }
}
