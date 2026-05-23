import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.app_metadata?.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json()

  const update: { name?: string; image_url?: string | null } = {}
  if (typeof body.name === 'string' && body.name.trim()) update.name = body.name.trim()
  if ('image_url' in body) update.image_url = body.image_url || null

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ success: false, error: 'Nothing to update' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('categories')
    .update(update)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    const status = error.code === '23505' ? 409 : 500
    return NextResponse.json({ success: false, error: error.message }, { status })
  }

  return NextResponse.json({ success: true, data })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.app_metadata?.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
