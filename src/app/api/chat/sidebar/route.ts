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

function pairKey(a: string, b: string) {
  return [a, b].sort().join("_");
}

export async function GET() {
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
    .select(
      "id,full_name,email,role,job_title,country,city_state,avatar_url,is_online,last_seen,status"
    )
    .eq("id", user.id)
    .single();

  if (!currentProfile) {
    return NextResponse.json({ error: "Profile not found." }, { status: 404 });
  }

  const currentRole = String(currentProfile.role || "").toLowerCase();
  const isStaff = isStaffRole(currentRole);

  const { data: activeProfiles } = await admin
    .from("profiles")
    .select(
      "id,full_name,email,role,job_title,country,city_state,avatar_url,is_online,last_seen,status"
    )
    .neq("id", user.id)
    .eq("status", "active")
    .order("full_name", { ascending: true });

  const staffUsers = (activeProfiles || []).filter((p) => isStaffRole(p.role));
  const employeeUsers = (activeProfiles || []).filter(
    (p) => !isStaffRole(p.role)
  );

  const usersToAutoConnect = isStaff ? employeeUsers : staffUsers;

  for (const otherUser of usersToAutoConnect) {
    const key = pairKey(user.id, otherUser.id);

    const { data: existingChat } = await admin
      .from("chats")
      .select("id")
      .eq("private_pair_key", key)
      .maybeSingle();

    if (!existingChat) {
      const { data: newChat } = await admin
        .from("chats")
        .insert({
          type: "private",
          name: null,
          private_pair_key: key,
          created_by: user.id,
          is_approved: true,
        })
        .select("id")
        .single();

      if (newChat) {
        await admin.from("chat_members").insert([
          {
            chat_id: newChat.id,
            user_id: user.id,
            role: "member",
          },
          {
            chat_id: newChat.id,
            user_id: otherUser.id,
            role: "member",
          },
        ]);
      }
    }
  }

  const { data: memberships, error: membershipError } = await admin
    .from("chat_members")
    .select(
      `
      chat_id,
      chats (
        id,
        type,
        name,
        private_pair_key,
        is_approved,
        created_at,
        updated_at,
        last_message,
        last_message_at,
        pinned_message_id
      )
    `
    )
    .eq("user_id", user.id);

  if (membershipError) {
    return NextResponse.json(
      { error: membershipError.message },
      { status: 400 }
    );
  }

  const rawChats =
    memberships?.map((item) => item.chats).filter(Boolean).flat() || [];

  const chatIds = rawChats.map((chat) => chat.id);

  const privateChatIds = rawChats
    .filter((chat) => chat.type === "private")
    .map((chat) => chat.id);

  const fallbackId = "00000000-0000-0000-0000-000000000000";

  const { data: privateMembers } = await admin
    .from("chat_members")
    .select(
      `
      chat_id,
      user_id,
      profiles (
        id,
        full_name,
        email,
        role,
        job_title,
        country,
        city_state,
        avatar_url,
        is_online,
        last_seen
      )
    `
    )
    .in("chat_id", privateChatIds.length ? privateChatIds : [fallbackId]);

  const { data: unreadMessages } = await admin
    .from("chat_messages")
    .select(
      `
      id,
      chat_id,
      sender_id,
      is_deleted,
      reads:chat_message_reads (
        user_id
      )
    `
    )
    .in("chat_id", chatIds.length ? chatIds : [fallbackId])
    .neq("sender_id", user.id)
    .eq("is_deleted", false);

  const chats = rawChats.map((chat) => {
    const unreadCount =
      unreadMessages?.filter((msg) => {
        if (msg.chat_id !== chat.id) return false;

        const reads = msg.reads || [];
        return !reads.some((read) => read.user_id === user.id);
      }).length || 0;

    if (chat.type === "group") {
      return {
        ...chat,
        display_name: chat.name || "Group Chat",
        display_avatar_url: null,
        display_subtitle: "Group conversation",
        other_user: null,
        unread_count: unreadCount,
      };
    }

    const membersForChat =
      privateMembers?.filter((member) => member.chat_id === chat.id) || [];

    const otherMember = membersForChat.find(
      (member) => member.user_id !== user.id
    );

    const otherProfile = Array.isArray(otherMember?.profiles)
      ? otherMember?.profiles[0]
      : otherMember?.profiles;

    return {
      ...chat,
      display_name: otherProfile?.full_name || "Private Chat",
      display_avatar_url: otherProfile?.avatar_url || null,
      display_subtitle: otherProfile?.job_title || otherProfile?.email || "",
      other_user: otherProfile || null,
      unread_count: unreadCount,
    };
  });

  return NextResponse.json({
    currentProfile,
    isStaff,
    chats,
    employees: isStaff ? employeeUsers : [],
  });
}