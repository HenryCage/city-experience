import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { voyage } from '@/lib/voyage'

export async function POST(request: Request) {
  const body = await request.json()
  const { query } = body

  if (!query) {
    return NextResponse.json({ error: 'query is required' }, { status: 400 })
  }

  const result = await voyage.embed({
    input: [query],
    model: 'voyage-4',
    outputDimension: 1024,
  })

  const queryEmbedding = result.data?.[0]?.embedding

  if (!queryEmbedding) {
    return NextResponse.json({ error: 'Failed to generate query embedding' }, { status: 500 })
  }

  const { data, error } = await supabaseAdmin.rpc('search_experiences', {
    query_embedding: queryEmbedding,
    match_count: 10,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ results: data })
}