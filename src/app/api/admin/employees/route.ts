import { NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createClient } from "@/lib/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { data: currentProfile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !currentProfile) {
    return NextResponse.json(
      { error: "Current user profile not found." },
      { status: 403 }
    );
  }

  if (currentProfile.role !== "admin" && currentProfile.role !== "manager" && currentProfile.role !== "supervisor") {
    return NextResponse.json(
      { error: "Only admin or manager can view employees." },
      { status: 403 }
    );
  }

  const adminClient = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await adminClient
    .from("profiles")
    .select("id,full_name,email,role,job_title,avatar_url,status,is_online,last_seen")
    .order("full_name", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ employees: data || [] });
}