import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

const mimeTypes: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
};

export async function POST(request: Request) {
  const client = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await client.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const formData = await request.formData();

  const files = formData.getAll("file") as File[];

  const experienceId =
    formData.get("experience_id") as string;

  const placeId =
    formData.get("place_id") as string;

  if (!files || files.length === 0) {
    return NextResponse.json(
      { error: "At least one file is required" },
      { status: 400 }
    );
  }

  if (!experienceId || !placeId) {
    return NextResponse.json(
      {
        error:
          "experience_id and place_id are required",
      },
      { status: 400 }
    );
  }

  // Confirm this place belongs to the experience
  const { data: link, error: linkError } =
    await client
      .from("experience_places")
      .select("place_id")
      .eq("experience_id", experienceId)
      .eq("place_id", placeId)
      .maybeSingle();

  if (linkError) {
    return NextResponse.json(
      { error: linkError.message },
      { status: 500 }
    );
  }

  if (!link) {
    return NextResponse.json(
      {
        error:
          "That place is not linked to this experience",
      },
      { status: 400 }
    );
  }

  const uploadedPhotos = [];
  const failures = [];

  for (const file of files) {
    const fileExt =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() ?? "";

    if (!mimeTypes[fileExt]) {
      failures.push({
        file: file.name,
        error: "Unsupported image type",
      });

      continue;
    }

    const fileName =
      `${user.id}/${experienceId}/${crypto.randomUUID()}.${fileExt}`;

    const contentType =
      mimeTypes[fileExt];

    const fileBuffer =
      await file.arrayBuffer();

    const { error: uploadError } =
      await client.storage
        .from("experience-photos")
        .upload(fileName, fileBuffer, {
          contentType,
          upsert: false,
        });

    if (uploadError) {
      failures.push({
        file: file.name,
        error: uploadError.message,
      });

      continue;
    }

    const { data: urlData } =
      client.storage
        .from("experience-photos")
        .getPublicUrl(fileName);

    const {
      data: photoData,
      error: photoError,
    } = await client
      .from("experience_photos")
      .insert({
        experience_id: experienceId,
        place_id: placeId,
        url: urlData.publicUrl,
      })
      .select()
      .single();

    if (photoError) {
      // Clean up uploaded file if DB insert fails
      await client.storage
        .from("experience-photos")
        .remove([fileName]);

      failures.push({
        file: file.name,
        error: photoError.message,
      });

      continue;
    }

    uploadedPhotos.push(photoData);
  }

  if (
    uploadedPhotos.length === 0 &&
    failures.length > 0
  ) {
    return NextResponse.json(
      {
        error: "Photo upload failed",
        photos: [],
        failures,
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      photos: uploadedPhotos,
      failures,
    },
    { status: 201 }
  );
}