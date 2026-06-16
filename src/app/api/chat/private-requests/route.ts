import { NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createClient } from "@/lib/server";
import { sendMail } from "@/lib/mailer";
import { createNotification } from "@/lib/createNotification";

function adminClient() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function isStaffRole(role?: string | null) {
  return role === "admin" || role === "manager" || role === "supervisor";
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
    .select("id,role")
    .eq("id", user.id)
    .single();

  if (!currentProfile || !isStaffRole(currentProfile.role)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const { data, error } = await admin
    .from("private_chat_requests")
    .select(
      `
      id,
      requester_id,
      receiver_id,
      status,
      chat_id,
      created_at,
      requester:profiles!private_chat_requests_requester_id_fkey (
        id,
        full_name,
        email,
        job_title,
        avatar_url
      ),
      receiver:profiles!private_chat_requests_receiver_id_fkey (
        id,
        full_name,
        email,
        job_title,
        avatar_url
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ requests: data || [] });
}

export async function POST(req: Request) {
  try {
    const { receiverId } = await req.json();

    if (!receiverId) {
      return NextResponse.json(
        { error: "Receiver ID is required." },
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

    if (user.id === receiverId) {
        const key = [user.id, receiverId].sort().join("_");

        const { data: existingChat } = await adminClient()
        .from("chats")
        .select("id")
        .eq("private_pair_key", key)
        .maybeSingle();

        if (existingChat) {
        return NextResponse.json(
            { error: "Private chat already exists with this employee." },
            { status: 400 }
        );
        }
      return NextResponse.json(
        { error: "You cannot send a chat request to yourself." },
        { status: 400 }
      );
    }

    const admin = adminClient();

    const { data: requester } = await admin
      .from("profiles")
      .select("id,full_name,email,role,job_title,status")
      .eq("id", user.id)
      .single();

    const { data: receiver } = await admin
      .from("profiles")
      .select("id,full_name,email,role,job_title,status")
      .eq("id", receiverId)
      .single();

    if (!requester || !receiver) {
      return NextResponse.json(
        { error: "Employee profile not found." },
        { status: 404 }
      );
    }

    if (requester.status === "restricted") {
      return NextResponse.json(
        { error: "Your account is currently restricted." },
        { status: 403 }
      );
    }

    if (receiver.status === "restricted") {
      return NextResponse.json(
        { error: "This employee is currently unavailable." },
        { status: 400 }
      );
    }

    if (isStaffRole(requester.role)) {
      return NextResponse.json(
        { error: "Staff users can start private chats directly." },
        { status: 400 }
      );
    }

    const { data: existingRequest } = await admin
      .from("private_chat_requests")
      .select("id,status,chat_id")
      .or(
        `and(requester_id.eq.${user.id},receiver_id.eq.${receiverId}),and(requester_id.eq.${receiverId},receiver_id.eq.${user.id})`
      )
      .maybeSingle();

    if (existingRequest?.status === "pending") {
      return NextResponse.json(
        { error: "A private chat request is already pending." },
        { status: 400 }
      );
    }

    if (existingRequest?.status === "approved" && existingRequest.chat_id) {
      return NextResponse.json(
        { error: "A private chat already exists with this employee." },
        { status: 400 }
      );
    }

    const { data: requestRow, error: requestError } = await admin
      .from("private_chat_requests")
      .upsert(
        {
          requester_id: user.id,
          receiver_id: receiverId,
          status: "pending",
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "requester_id,receiver_id",
        }
      )
      .select("id")
      .single();

    if (requestError || !requestRow) {
      return NextResponse.json(
        { error: requestError?.message || "Failed to send request." },
        { status: 400 }
      );
    }

      const { data: staffUsers } = await admin
    .from("profiles")
    .select("id")
    .in("role", ["admin", "manager", "supervisor"])
    .eq("status", "active");

  for (const staff of staffUsers || []) {
    await createNotification({
      admin,
      userId: staff.id,
      actorId: user.id,
      title: "Private Chat Request",
      message: `${requester.full_name || "An employee"} sent a private chat request for review.`,
      type: "Chat",
      link: "/dashboard/chat",
    });
  }

    if (receiver.email) {
      try {
        await sendMail({
          to: receiver.email,
          subject: "Private Chat Request",
          html: `
            <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:30px;">
              <div style="max-width:620px; margin:auto; background:#ffffff; border-radius:14px; overflow:hidden;">
                <div style="background:#000000; color:#ffffff; padding:28px; text-align:center;">
                  <h1 style="margin:0; font-size:24px;">Private Chat Request</h1>
                  <p style="margin-top:8px; font-size:14px; color:#e5e5e5;">
                    Dashboard Notification
                  </p>
                </div>

                <div style="padding:28px; color:#222;">
                  <p style="font-size:16px;">
                    Hello <strong>${receiver.full_name || "Team Member"}</strong>,
                  </p>

                  <p style="font-size:15px; line-height:1.7;">
                    <strong>${requester.full_name || "A team member"}</strong> has requested permission to start a private chat with you through the company dashboard.
                  </p>

                  <div style="background:#f8f8f8; border:1px solid #eeeeee; padding:18px; border-radius:10px; margin:24px 0;">
                    <p style="margin:0 0 10px; font-size:15px;">
                      <strong>Requester:</strong> ${requester.full_name || "Not provided"}
                    </p>
                    <p style="margin:0 0 10px; font-size:15px;">
                      <strong>Job Title:</strong> ${requester.job_title || "Not provided"}
                    </p>
                    <p style="margin:0; font-size:15px;">
                      <strong>Status:</strong> Awaiting approval
                    </p>
                  </div>

                  <p style="font-size:15px; line-height:1.7;">
                    Once approved, the private chat will become available in your dashboard, allowing direct communication between both parties.
                  </p>

                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/chat"
                    style="display:inline-block; background:#000000; color:#ffffff; padding:14px 22px; border-radius:8px; text-decoration:none; font-weight:bold; font-size:14px;">
                    Open Chat
                  </a>

                  <p style="margin-top:28px; font-size:15px;">
                    Regards,<br/>
                    <strong>Support Team</strong><br/>
                    Errandly247
                  </p>
                </div>
                <div style="background:#fafafa; padding:16px; text-align:center; font-size:12px; color:#777;">
                This is an automated notification from the Errandly247 Employee Dashboard.
              </div>
              </div>
            </div>
          `,
        });
      } catch (mailError) {
        console.error("Private chat request email failed:", mailError);
      }
    }

    return NextResponse.json({
      message: "Private chat request sent successfully.",
      requestId: requestRow.id,
    });
  } catch (error) {
    console.error("Private chat request error:", error);

    return NextResponse.json(
      { error: "Something went wrong while sending chat request." },
      { status: 500 }
    );
  }
}