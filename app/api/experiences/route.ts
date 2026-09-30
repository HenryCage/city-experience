import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { voyage } from '@/lib/voyage'

export async function GET() {
  const { data, error } = await supabase
    .from('experiences')
    .select('*, experience_places(place_id)')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ experiences: data })
}

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization')

  if (!authHeader) {
    return NextResponse.json({ error: 'Missing authorization header' }, { status: 401 })
  }

  const token = authHeader.replace('Bearer ', '')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

  const supabaseAsUser = createClient(supabaseUrl, supabasePublishableKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  const { data: userData, error: userError } = await supabaseAsUser.auth.getUser()

  if (userError || !userData.user) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
  }

    const body = await request.json()
    const { title, description, mode, place_ids, retention_acknowledged } = body

    if (!title || !description || !place_ids || place_ids.length === 0) {
      return NextResponse.json(
        { error: 'title, description, and at least one place_id are required' },
        { status: 400 }
      )
    }

    if (mode !== 'local' && mode !== 'visitor') {
      return NextResponse.json(
        { error: 'mode must be "local" or "visitor"' },
        { status: 400 }
      )
    }

    if (retention_acknowledged !== true) {
      return NextResponse.json(
        { error: 'retention_acknowledged must be true' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAsUser.rpc('create_experience_with_places', {
      p_title: title,
      p_description: description,
      p_mode: mode,
      p_place_ids: place_ids,
    })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const textToEmbed = `${title}. ${description}`

  const embedResult = await voyage.embed({
    input: [textToEmbed],
    model: 'voyage-4',
    outputDimension: 1024,
  })

  const embedding = embedResult.data?.[0]?.embedding

  if (embedding) {
    await supabaseAdmin
      .from('experiences')
      .update({ embedding })
      .eq('id', data)
  }

  return NextResponse.json({ experience_id: data }, { status: 201 })
}