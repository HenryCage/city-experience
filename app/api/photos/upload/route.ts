import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const mimeTypes: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
}

export async function POST(request: Request) {
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

  const formData = await request.formData()
  const files = formData.getAll('file') as File[]
  const experienceId = formData.get('experience_id') as string
  const placeId = formData.get('place_id') as string

  if (!files || files.length === 0) {
    return NextResponse.json({ error: 'At least one file is required' }, { status: 400 })
  }

  if (!experienceId || !placeId) {
    return NextResponse.json(
      { error: 'experience_id and place_id are required' },
      { status: 400 }
    )
  }

  // Confirm this place is actually one of the experience's linked places
  const { data: link, error: linkError } = await client
    .from('experience_places')
    .select('place_id')
    .eq('experience_id', experienceId)
    .eq('place_id', placeId)
    .maybeSingle()

  if (linkError) {
    return NextResponse.json({ error: linkError.message }, { status: 500 })
  }

  if (!link) {
    return NextResponse.json(
      { error: 'That place is not linked to this experience' },
      { status: 400 }
    )
  }

  const uploadedPhotos = []
  const failures = []

  for (const file of files) {
    const fileExt = file.name.split('.').pop()?.toLowerCase()
    const fileName = `${userData.user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
    const contentType = mimeTypes[fileExt ?? ''] || 'application/octet-stream'
    const fileBuffer = await file.arrayBuffer()

    const { error: uploadError } = await client.storage
      .from('experience-photos')
      .upload(fileName, fileBuffer, { contentType })

    if (uploadError) {
      failures.push({ file: file.name, error: uploadError.message })
      continue
    }

    const { data: urlData } = client.storage
      .from('experience-photos')
      .getPublicUrl(fileName)

    const { data: photoData, error: photoError } = await client
      .from('experience_photos')
      .insert({
        experience_id: experienceId,
        place_id: placeId,
        url: urlData.publicUrl,
      })
      .select()

    if (photoError) {
      failures.push({ file: file.name, error: photoError.message, url: urlData.publicUrl })
      continue
    }

    uploadedPhotos.push(photoData[0])
  }

  return NextResponse.json(
    { photos: uploadedPhotos, failures },
    { status: uploadedPhotos.length > 0 ? 201 : 500 }
  )
}