import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function DELETE(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) {
    return NextResponse.json({ error: 'Missing authorization header' }, { status: 401 })
  }

  const token = authHeader.replace('Bearer ', '')
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

  const client = createClient(supabaseUrl, supabasePublishableKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  const { data: userData, error: userError } = await client.auth.getUser()
  if (userError || !userData.user) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  if (body.confirm !== true) {
    return NextResponse.json(
      { error: 'confirm must be true to delete your account' },
      { status: 400 }
    )
  }

  const userId = userData.user.id
  const folderPath = userId

  // Step 1: delete every file in this user's storage folder, page by page
  while (true) {
    const { data: files, error: listError } = await supabaseAdmin.storage
      .from('experience-photos')
      .list(folderPath, { limit: 100 })

    if (listError) {
      return NextResponse.json(
        { error: `Failed to list photos, account not deleted: ${listError.message}` },
        { status: 500 }
      )
    }

    if (!files || files.length === 0) break

    const pathsToDelete = files.map((f) => `${folderPath}/${f.name}`)

    const { error: removeError } = await supabaseAdmin.storage
      .from('experience-photos')
      .remove(pathsToDelete)

    if (removeError) {
      return NextResponse.json(
        { error: `Failed to delete photos, account not deleted: ${removeError.message}` },
        { status: 500 }
      )
    }
  }

  // Step 2: delete the auth user; cascades handle profiles, experiences,
  // experience_places, experience_photos, saved_places. places.created_by is set to null.
  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)

  if (deleteError) {
    return NextResponse.json(
      { error: `Photos were deleted, but account deletion failed: ${deleteError.message}` },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}