import { NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createClient } from "@/lib/server";

function adminClient() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function isStaffRole(role?: string | null) {
  return role === "admin" || role === "manager" || role === "supervisor";
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: chatId } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const admin = adminClient();

  const { data: currentProfile } = await admin
    .from("profiles")
    .select("id, role")
    .eq("id", user.id)
    .single();

  if (!currentProfile) {
    return NextResponse.json({ error: "Profile not found." }, { status: 404 });
  }

  const staff = isStaffRole(currentProfile.role);

  const { data: membership } = await admin
    .from("chat_members")
    .select("id")
    .eq("chat_id", chatId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!staff && !membership) {
    return NextResponse.json(
      { error: "You are not a member of this group." },
      { status: 403 }
    );
  }

  const { data: group } = await admin
    .from("chats")
    .select("id, type")
    .eq("id", chatId)
    .single();

  if (!group || group.type !== "group") {
    return NextResponse.json({ error: "Group not found." }, { status: 404 });
  }

  const { data, error } = await admin
    .from("chat_members")
    .select(
      `
      user_id,
      role,
      profiles (
        id,
        full_name,
        email,
        job_title,
        country,
        city_state,
        avatar_url,
        is_online,
        last_seen
      )
    `
    )
    .eq("chat_id", chatId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const members =
    data?.map((item) => ({
      user_id: item.user_id,
      member_role: item.role,
      profile: Array.isArray(item.profiles) ? item.profiles[0] : item.profiles,
    })) || [];

  return NextResponse.json({ members });
}