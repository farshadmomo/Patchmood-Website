import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/pocketbase/server'
import { toProduct } from '@/lib/pocketbase/transform'
import { isAnyAdmin, pbErrorResponse, toSlug } from '@/lib/pocketbase/api'
import { getProducts } from '@/lib/data'

export async function GET() {
  try {
    return NextResponse.json({ success: true, data: await getProducts() })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const pb = await createClient()

  if (!isAnyAdmin(pb)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()

    const name = String(formData.get('name') ?? '')
    if (!formData.get('slug') && name) {
      formData.set('slug', toSlug(name))
    }

    const svc = pb.authStore.isSuperuser ? pb : await createServiceClient()
    const record = await svc.collection('products').create(formData)
    return NextResponse.json({ success: true, data: toProduct(record) }, { status: 201 })
  } catch (err) {
    return pbErrorResponse(err, 'Failed to create product', 'A product with this slug already exists')
  }
}
