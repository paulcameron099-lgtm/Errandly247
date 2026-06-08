import { NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createClient } from "@/lib/server";

function adminClient() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: Request) {
  const formData = await req.formData();

  const chatId = formData.get("chatId") as string;
  const file = formData.get("file") as File | null;
  const messageType = formData.get("messageType") as string;

  if (!chatId || !file) {
    return NextResponse.json(
      { error: "Chat ID and file are required." },
      { status: 400 }
    );
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

  const fileExt = file.name.split(".").pop();
  const safeName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `${chatId}/${safeName}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await admin.storage
    .from("chat-files")
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 400 });
  }

  const { data: publicUrl } = admin.storage
    .from("chat-files")
    .getPublicUrl(filePath);

  const fileUrl = publicUrl.publicUrl;

  const finalMessageType =
    messageType === "voice"
      ? "voice"
      : file.type.startsWith("image/")
      ? "image"
      : "file";

  const { data: chatMessage, error: messageError } = await admin
    .from("chat_messages")
    .insert({
      chat_id: chatId,
      sender_id: user.id,
      message: finalMessageType === "voice" ? "Voice note" : file.name,
      message_type: finalMessageType,
      file_url: finalMessageType === "voice" ? null : fileUrl,
      file_name: file.name,
      file_type: file.type || "audio/webm",
      voice_url: finalMessageType === "voice" ? fileUrl : null,
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

  if (messageError) {
    return NextResponse.json({ error: messageError.message }, { status: 400 });
  }

  await admin
    .from("chats")
    .update({
      updated_at: new Date().toISOString(),
      last_message:
        finalMessageType === "image"
          ? "📷 Image"
          : finalMessageType === "voice"
          ? "🎤 Voice note"
          : `📎 ${file.name}`,
      last_message_at: new Date().toISOString(),
    })
    .eq("id", chatId);

  return NextResponse.json({
    message: "File uploaded successfully.",
    chatMessage,
  });
}