import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { voyage } from '@/lib/voyage'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: placeId } = await params

  const { data: place, error: fetchError } = await supabaseAdmin
    .from('places')
    .select('name, description')
    .eq('id', placeId)
    .single()

  if (fetchError || !place) {
    return NextResponse.json({ error: 'Place not found' }, { status: 404 })
  }

  const textToEmbed = `${place.name}. ${place.description ?? ''}`

  const result = await voyage.embed({
    input: [textToEmbed],
    model: 'voyage-4',
    outputDimension: 1024,
  })

  const embedding = result.data?.[0]?.embedding

  if (!embedding) {
    return NextResponse.json({ error: 'Failed to generate embedding' }, { status: 500 })
  }

  const { error: updateError } = await supabaseAdmin
    .from('places')
    .update({ embedding })
    .eq('id', placeId)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, dimensions: embedding.length })
}