import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { data, error } = await supabase
    .from('experiences')
    .select('*, experience_places(place_id, places(id, name, city, category)), experience_photos(id, url, place_id)')
    .eq('id', id)
    .single()

  if (error) {
    return NextResponse.json({ error: 'Experience not found' }, { status: 404 })
  }

  return NextResponse.json({ experience: data })
}