import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { data, error } = await supabase
    .from('places')
    .select('*, experience_places(experience_id, experiences(id, title, description, mode, created_at))')
    .eq('id', id)
    .single()

  if (error) {
    return NextResponse.json({ error: 'Place not found' }, { status: 404 })
  }

  return NextResponse.json({ place: data })
}