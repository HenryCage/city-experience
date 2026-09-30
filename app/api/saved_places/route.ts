import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getAuthedClient(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) return null

  const token = authHeader.replace('Bearer ', '')
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

  return createClient(supabaseUrl, supabasePublishableKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  })
}

export async function GET(request: Request) {
  const client = getAuthedClient(request)
  if (!client) {
    return NextResponse.json({ error: 'Missing authorization header' }, { status: 401 })
  }

  const { data: userData, error: userError } = await client.auth.getUser()
  if (userError || !userData.user) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
  }

  const { data, error } = await client
    .from('saved_places')
    .select('*, places(*)')
    .eq('user_id', userData.user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ saved_places: data })
}

export async function POST(request: Request) {
  const client = getAuthedClient(request)
  if (!client) {
    return NextResponse.json({ error: 'Missing authorization header' }, { status: 401 })
  }

  const { data: userData, error: userError } = await client.auth.getUser()
  if (userError || !userData.user) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
  }

  const body = await request.json()
  const { place_id } = body

  if (!place_id) {
    return NextResponse.json({ error: 'place_id is required' }, { status: 400 })
  }

  const { data, error } = await client
    .from('saved_places')
    .insert({ user_id: userData.user.id, place_id })
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ saved_place: data[0] }, { status: 201 })
}