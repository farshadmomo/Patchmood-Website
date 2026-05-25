import { NextResponse } from 'next/server'
import { createClient } from '@/lib/pocketbase/server'
import { pbErrorResponse } from '@/lib/pocketbase/api'

export async function GET() {
  const pb = await createClient()
  if (!pb.authStore.isValid || !pb.authStore.isSuperuser) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  }
  try {
    const records = await pb.collection('admins').getFullList({ sort: 'email' })
    return NextResponse.json({
      success: true,
      data: records.map((r) => ({
        id: r.id,
        email: (r['email'] as string) || '',
        name: (r['name'] as string) || '',
        created: r.created,
      })),
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch admins' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const pb = await createClient()
  if (!pb.authStore.isValid || !pb.authStore.isSuperuser) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  }
  try {
    const { email, name, password, passwordConfirm } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password required' }, { status: 400 })
    }
    const record = await pb.collection('admins').create({
      email,
      emailVisibility: true,
      name: name || '',
      password,
      passwordConfirm: passwordConfirm || password,
    })
    return NextResponse.json(
      {
        success: true,
        data: {
          id: record.id,
          email: (record['email'] as string) || '',
          name: (record['name'] as string) || '',
          created: record.created,
        },
      },
      { status: 201 },
    )
  } catch (err) {
    return pbErrorResponse(err, 'Failed to create admin', 'An admin with this email already exists')
  }
}
