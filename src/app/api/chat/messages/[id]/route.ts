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

function canEmployeeEditMessage(createdAt: string) {
  const created = new Date(createdAt).getTime();
  const now = Date.now();
  const diffMinutes = (now - created) / 60000;

  return diffMinutes <= 10;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: messageId } = await params;
  const body = await req.json();

  const { action, message, targetChatId, emoji } = body;

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

  const { data: currentMessage } = await admin
    .from("chat_messages")
    .select("id, chat_id, sender_id, message, created_at, is_starred, is_pinned")
    .eq("id", messageId)
    .single();

  if (!currentMessage) {
    return NextResponse.json({ error: "Message not found." }, { status: 404 });
  }

  const { data: membership } = await admin
    .from("chat_members")
    .select("id")
    .eq("chat_id", currentMessage.chat_id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) {
    return NextResponse.json(
      { error: "You are not a member of this chat." },
      { status: 403 }
    );
  }

  const isStaff = isStaffRole(currentProfile.role);
  const isOwner = currentMessage.sender_id === user.id;

  if (action === "star") {
    const { error } = await admin
      .from("chat_messages")
      .update({
        is_starred: !currentMessage.is_starred,
        updated_at: new Date().toISOString(),
      })
      .eq("id", messageId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Message star updated." });
  }

  if (action === "pin") {
    const newPinStatus = !currentMessage.is_pinned;

    const { error } = await admin
      .from("chat_messages")
      .update({
        is_pinned: newPinStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", messageId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    await admin
      .from("chats")
      .update({
        pinned_message_id: newPinStatus ? messageId : null,
      })
      .eq("id", currentMessage.chat_id);

    return NextResponse.json({
      message: newPinStatus ? "Message pinned." : "Message unpinned.",
    });
  }

  if (action === "delete") {
  if (isStaff) {
    await admin
      .from("chat_messages")
      .delete()
      .eq("id", messageId);

    return NextResponse.json({
      message: "Message deleted.",
    });
  }

  if (isOwner) {
    await admin
      .from("chat_messages")
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
        message: null,
      })
      .eq("id", messageId);

    return NextResponse.json({
      message: "Message deleted.",
    });
  }

  await admin
    .from("chat_message_hidden")
    .insert({
      message_id: messageId,
      user_id: user.id,
    });

  return NextResponse.json({
    message: "Message hidden.",
  });
}

  if (action === "edit") {
    if (!isOwner && !isStaff) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    if (!isStaff && !canEmployeeEditMessage(currentMessage.created_at)) {
      return NextResponse.json(
        { error: "Employees can only edit messages within 10 minutes." },
        { status: 403 }
      );
    }

    if (!message || !String(message).trim()) {
      return NextResponse.json(
        { error: "Edited message cannot be empty." },
        { status: 400 }
      );
    }

    const { error } = await admin
      .from("chat_messages")
      .update({
        message: String(message).trim(),
        edited_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", messageId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Message edited successfully." });
  }

  if (action === "forward") {
    if (!targetChatId) {
      return NextResponse.json(
        { error: "Target chat is required." },
        { status: 400 }
      );
    }

    const { data: targetMembership } = await admin
      .from("chat_members")
      .select("id")
      .eq("chat_id", targetChatId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!targetMembership) {
      return NextResponse.json(
        { error: "You are not a member of the target chat." },
        { status: 403 }
      );
    }

    const forwardedText = currentMessage.message
      ? `Forwarded message:\n${currentMessage.message}`
      : "Forwarded message";

    const { data: forwardedMessage, error } = await admin
      .from("chat_messages")
      .insert({
        chat_id: targetChatId,
        sender_id: user.id,
        message: forwardedText,
        message_type: "text",
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    await admin
      .from("chats")
      .update({
        last_message: forwardedText,
        last_message_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", targetChatId);

    return NextResponse.json({
      message: "Message forwarded successfully.",
      forwardedMessage,
    });
  }

  if (action === "react") {
    if (!emoji) {
      return NextResponse.json({ error: "Emoji is required." }, { status: 400 });
    }

    const { error } = await admin.from("chat_reactions").upsert(
      {
        message_id: messageId,
        user_id: user.id,
        emoji,
      },
      {
        onConflict: "message_id,user_id",
      }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Reaction added." });
  }

  return NextResponse.json({ error: "Invalid action." }, { status: 400 });
}