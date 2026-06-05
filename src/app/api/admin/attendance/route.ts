import { NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createClient } from "@/lib/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (
    !currentProfile ||
    (currentProfile.role !== "admin" && currentProfile.role !== "manager")
  ) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const adminClient = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await adminClient
    .from("attendance")
    .select(
      `
      id,
      user_id,
      check_in,
      check_out,
      status,
      work_status,
      is_late,
      late_minutes,
      note,
      attendance_date,
      profiles (
        full_name,
        email,
        job_title
      )
    `
    )
    .order("attendance_date", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ attendance: data || [] });
}