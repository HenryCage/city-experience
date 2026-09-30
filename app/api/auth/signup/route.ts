import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(request: Request) {
  const body = await request.json()
  const { email, password, username } = body

  // Step 1: create the auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 })
  }

  const userId = authData.user?.id
  if (!userId) {
    return NextResponse.json({ error: 'Signup failed, no user returned' }, { status: 400 })
  }

  // Step 2: create their profile row, using the admin client (bypasses RLS)
  const { data: profileData, error: profileError } = await supabaseAdmin
    .from('profiles')
    .insert({ id: userId, username })
    .select()

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  return NextResponse.json({ user: authData.user, profile: profileData[0] }, { status: 201 })
}