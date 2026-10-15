import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");

  const mode =
    searchParams.get("mode") === "local"
      ? "local"
      : "visitor";

  if (!code) {
    return NextResponse.redirect(
      `${origin}/login?mode=${mode}`
    );
  }

  const supabase = await createSupabaseServerClient();

  const { error } =
    await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("OAuth callback error:", error.message);

    return NextResponse.redirect(
      `${origin}/login?mode=${mode}`
    );
  }

  return NextResponse.redirect(
    `${origin}/explore?mode=${mode}`
  );
}