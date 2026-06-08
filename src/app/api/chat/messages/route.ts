import { NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createClient } from "@/lib/server";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function adminClient() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get("chatId");

  if (!chatId) {
    return NextResponse.json({ error: "Chat ID is required." }, { status: 400 });
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const admin = adminClient();

  const { data: membership } = await admin
    .from("chat_members")
    .select("id")
    .eq("chat_id", chatId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) {
    return NextResponse.json(
      { error: "You are not a member of this chat." },
      { status: 403 }
    );
  }

  const { data: hiddenMessages } = await admin
    .from("chat_message_hidden")
    .select("message_id")
    .eq("user_id", user.id);

  const hiddenIds = hiddenMessages?.map((item) => item.message_id) || [];

  const { data, error } = await admin
    .from("chat_messages")
    .select(
      `
      id,
      chat_id,
      sender_id,
      message,
      message_type,
      file_url,
      file_name,
      file_type,
      voice_url,
      reply_to,
      is_starred,
      is_pinned,
      is_deleted,
      created_at,
      updated_at,
      edited_at,
      reactions:chat_reactions (
        user_id,
        emoji
      ),
      reads:chat_message_reads (
        user_id,
        read_at
      ),
      sender:profiles!chat_messages_sender_id_fkey (
        id,
        full_name,
        email,
        avatar_url,
        job_title
      )
    `
    )
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const visibleMessages =
    data?.filter((message) => !hiddenIds.includes(message.id)) || [];

  const unreadMessages = visibleMessages.filter(
    (msg) => msg.sender_id !== user.id && !msg.is_deleted
  );

  if (unreadMessages.length > 0) {
    await admin.from("chat_message_reads").upsert(
      unreadMessages.map((msg) => ({
        message_id: msg.id,
        user_id: user.id,
        read_at: new Date().toISOString(),
      })),
      {
        onConflict: "message_id,user_id",
      }
    );
  }

  return NextResponse.json({ messages: visibleMessages });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { chatId, message, replyTo } = body;

  if (!chatId) {
    return NextResponse.json({ error: "Chat ID is required." }, { status: 400 });
  }

  if (!message || !String(message).trim()) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const admin = adminClient();

  const { data: membership } = await admin
    .from("chat_members")
    .select("id")
    .eq("chat_id", chatId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) {
    return NextResponse.json(
      { error: "You are not a member of this chat." },
      { status: 403 }
    );
  }

  const cleanMessage = String(message).trim();

  const { data, error } = await admin
    .from("chat_messages")
    .insert({
      chat_id: chatId,
      sender_id: user.id,
      message: cleanMessage,
      message_type: "text",
      reply_to: replyTo || null,
    })
    .select(
      `
      id,
      chat_id,
      sender_id,
      message,
      message_type,
      file_url,
      file_name,
      file_type,
      voice_url,
      reply_to,
      is_starred,
      is_pinned,
      is_deleted,
      created_at,
      updated_at,
      edited_at,
      reactions:chat_reactions (
        user_id,
        emoji
      ),
      reads:chat_message_reads (
        user_id,
        read_at
      ),
      sender:profiles!chat_messages_sender_id_fkey (
        id,
        full_name,
        email,
        avatar_url,
        job_title
      )
    `
    )
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await admin
    .from("chats")
    .update({
      updated_at: new Date().toISOString(),
      last_message: cleanMessage,
      last_message_at: new Date().toISOString(),
    })
    .eq("id", chatId);

    const { data: senderProfile } = await admin
  .from("profiles")
  .select("role")
  .eq("id", user.id)
  .single();

const isStaffSender =
  senderProfile?.role === "admin" ||
  senderProfile?.role === "manager" ||
  senderProfile?.role === "supervisor";

if (isStaffSender) {
  const { data: members } = await admin
    .from("chat_members")
    .select("user_id, profiles(id, role)")
    .eq("chat_id", chatId)
    .neq("user_id", user.id);

  const dueAt = new Date(Date.now() + 20 * 60 * 1000).toISOString();

  const notifications =
    members
      ?.filter((member) => {
        const profile = Array.isArray(member.profiles)
          ? member.profiles[0]
          : member.profiles;

        return (
          profile?.role !== "admin" &&
          profile?.role !== "manager" &&
          profile?.role !== "supervisor"
        );
      })
      .map((member) => ({
        message_id: data.id,
        chat_id: chatId,
        sender_id: user.id,
        receiver_id: member.user_id,
        due_at: dueAt,
        status: "pending",
      })) || [];

  if (notifications.length > 0) {
    await admin.from("chat_message_notifications").insert(notifications);
  }
}

  return NextResponse.json({
    message: "Message sent successfully.",
    chatMessage: data,
  });
}