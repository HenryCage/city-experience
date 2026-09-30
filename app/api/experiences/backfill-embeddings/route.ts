import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { voyage } from '@/lib/voyage'

export async function POST() {
  const { data: experiences, error } = await supabaseAdmin
    .from('experiences')
    .select('id, title, description')
    .is('embedding', null)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const results = []

  for (const exp of experiences) {
    const textToEmbed = `${exp.title}. ${exp.description ?? ''}`

    const result = await voyage.embed({
      input: [textToEmbed],
      model: 'voyage-4',
      outputDimension: 1024,
    })

    const embedding = result.data?.[0]?.embedding

    if (embedding) {
      await supabaseAdmin
        .from('experiences')
        .update({ embedding })
        .eq('id', exp.id)

      results.push({ id: exp.id, status: 'embedded' })
    } else {
      results.push({ id: exp.id, status: 'failed' })
    }
  }

  return NextResponse.json({ processed: results.length, results })
}