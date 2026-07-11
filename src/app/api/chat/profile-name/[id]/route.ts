import { NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createClient } from "@/lib/server";

function adminClient() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: profileId } = await params;

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const admin = adminClient();

    const { data: sharedMembership, error: membershipError } = await admin
      .from("chat_members")
      .select("chat_id")
      .eq("user_id", user.id);

    if (membershipError) {
      return NextResponse.json(
        { error: membershipError.message },
        { status: 400 }
      );
    }

    const myChatIds = (sharedMembership || []).map((item) => item.chat_id);

    if (myChatIds.length === 0) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const { data: targetMembership } = await admin
      .from("chat_members")
      .select("id")
      .eq("user_id", profileId)
      .in("chat_id", myChatIds)
      .limit(1)
      .maybeSingle();

    if (!targetMembership) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("id, full_name")
      .eq("id", profileId)
      .maybeSingle();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: profileError?.message || "Profile not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      profile: {
        id: profile.id,
        full_name: profile.full_name,
      },
    });
  } catch (error) {
    console.error("Get chat profile name error:", error);

    return NextResponse.json(
      { error: "Failed to load profile name." },
      { status: 500 }
    );
  }
}