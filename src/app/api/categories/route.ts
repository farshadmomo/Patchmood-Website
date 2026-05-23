import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function toSlug(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('categories').select('*').order('name')
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data })
}

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.app_metadata?.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const name = (body.name ?? '').trim()
  if (!name) return NextResponse.json({ success: false, error: 'Name required' }, { status: 400 })

  const image_url = typeof body.image_url === 'string' && body.image_url ? body.image_url : null

  const { data, error } = await supabase
    .from('categories')
    .insert({ name, slug: toSlug(name), image_url })
    .select()
    .single()

  if (error) {
    const status = error.code === '23505' ? 409 : 500
    return NextResponse.json({ success: false, error: error.message }, { status })
  }

  return NextResponse.json({ success: true, data }, { status: 201 })
}
