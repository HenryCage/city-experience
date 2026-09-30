import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { voyage } from '@/lib/voyage'

export async function GET() {
  const { data, error } = await supabase
    .from('places')
    .select('*')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ places: data })
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

  const { data, error } = await supabaseAsUser
    .from('places')
    .insert({
      name: body.name,
      city: body.city,
      category: body.category,
      description: body.description,
      created_by: userData.user.id,
    })
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const place = data[0]

  // Generate and store the embedding right after creating the place
  const textToEmbed = `${place.name}. ${place.description ?? ''}`

  const result = await voyage.embed({
    input: [textToEmbed],
    model: 'voyage-4',
    outputDimension: 1024,
  })

  const embedding = result.data?.[0]?.embedding

  if (embedding) {
    await supabaseAdmin
      .from('places')
      .update({ embedding })
      .eq('id', place.id)
  }

  return NextResponse.json({ place }, { status: 201 })
}