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

export async function POST(req: Request) {
  try {
    const { name, memberIds } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Group name is required." },
        { status: 400 }
      );
    }

    if (!Array.isArray(memberIds) || memberIds.length === 0) {
      return NextResponse.json(
        { error: "Please select at least one employee." },
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

    const { data: currentProfile } = await admin
      .from("profiles")
      .select("id, role, full_name")
      .eq("id", user.id)
      .single();

    if (!currentProfile || !isStaffRole(currentProfile.role)) {
      return NextResponse.json(
        { error: "Only authorized staff can create group chats." },
        { status: 403 }
      );
    }

    const { data: group, error: groupError } = await admin
      .from("chats")
      .insert({
        type: "group",
        name,
        created_by: user.id,
        is_approved: true,
      })
      .select("id, name")
      .single();

    if (groupError || !group) {
      return NextResponse.json(
        { error: groupError?.message || "Failed to create group." },
        { status: 400 }
      );
    }

    const uniqueMemberIds = Array.from(new Set([user.id, ...memberIds]));

    const membersToInsert = uniqueMemberIds.map((memberId) => ({
      chat_id: group.id,
      user_id: memberId,
      role: memberId === user.id ? "owner" : "member",
    }));

    const { error: memberError } = await admin
      .from("chat_members")
      .insert(membersToInsert);

    if (memberError) {
      return NextResponse.json({ error: memberError.message }, { status: 400 });
    }

    const { data: addedEmployees } = await admin
    .from("profiles")
    .select("id, email, full_name, first_name, job_title")
    .in("id", memberIds);

    for (const employee of addedEmployees || []) {
      await createNotification({
        admin,
        userId: employee.id,
        actorId: user.id,
        title: "Added to Group Chat",
        message: `You have been added to ${name}.`,
        type: "Chat",
        link: "/dashboard/chat",
      });

      if (!employee.email) continue;

    try {
      await sendMail({
          to: employee.email,
          subject: `You Have Been Added to ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:30px;">
              <div style="max-width:620px; margin:auto; background:#ffffff; border-radius:14px; overflow:hidden;">
                <div style="background:#000000; color:#ffffff; padding:28px; text-align:center;">
                  <h1 style="margin:0; font-size:24px;">You Have Been Added to a Group Chat</h1>
                  <p style="margin-top:8px; font-size:14px; color:#e5e5e5;">
                    Dashboard notification
                  </p>
                </div>

                <div style="padding:28px; color:#222;">
                  <p style="font-size:16px;">
                    Hello <strong>${employee.full_name || employee.first_name || "Team Member"}</strong>,
                  </p>

                  <p style="font-size:15px; line-height:1.7;">
                    You have been added to ${name}, a discussion group created to review and discuss the progress of ongoing tasks with team members.
                  </p>

                  <div style="background:#f8f8f8; border:1px solid #eeeeee; padding:18px; border-radius:10px; margin:24px 0;">
                    <p style="margin:0 0 10px; font-size:15px;">
                      <strong>Group Name:</strong> ${name}
                    </p>
                    <p style="margin:0 0 10px; font-size:15px;">
                      <strong>Section:</strong> Chat
                    </p>
                    <p style="margin:0; font-size:15px;">
                      <strong>Purpose:</strong> Task Progress Review & Discussion
                    </p>
                  </div>

                  <p style="font-size:15px; line-height:1.7;">
                    You are advised to log in a few minutes before the scheduled discussion and be prepared to provide an update on your assigned tasks. Your active participation is important to help keep the team aligned and ensure ongoing objectives remain on track.
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
        console.error("Group added email failed:", mailError);
      }
    }

    return NextResponse.json({
      message: "Group chat created successfully.",
      group,
    });
  } catch (error) {
    console.error("Create group chat error:", error);

    return NextResponse.json(
      { error: "Something went wrong while creating group chat." },
      { status: 500 }
    );
  }
}



 <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:30px;">
          <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:14px; overflow:hidden;">
            <div style="background:#000000; color:#ffffff; padding:28px; text-align:center;">
              <h1 style="margin:0; font-size:26px;">Welcome to Errandly247</h1>
              <p style="margin-top:8px; font-size:14px; color:#e5e5e5;">
                Get Started with Your Dashboard
              </p>
            </div>

            <div style="padding:28px; color:#222;">
              <p style="font-size:16px;">Dear <strong>${fullName}</strong>,</p>

              <p style="font-size:15px; line-height:1.6;">
               A warm welcome to the Errandly247 team! We are excited to have you join us and look forward to working with you as you begin your role as a Personal Shopper.
              </p>

               <p style="font-size:15px; line-height:1.6;">
               Your employee account has been successfully created, and your Employee Dashboard is now ready for use. This dashboard will serve as your primary workspace for attendance tracking, task management, team communication, and company updates.
              </p>

              <p style="font-size:15px; line-height:1.6;">
               Employee Dashboard Access
              </p>

              <div style="background:#f8f8f8; padding:18px; border-radius:10px; margin:24px 0; border:1px solid #eeeeee;">
                <p style="margin:0 0 10px; font-size:15px;">
                  <strong>Login Email:</strong> ${email}
                </p>
                <p style="margin:0 0 10px; font-size:15px;">
                  <strong>Temporary Password:</strong> ${password}
                </p>
                <p style="margin:0 0 10px; font-size:15px;">
                <strong>Access Level:</strong> ${role}
              </p>
              <p style="margin:0; font-size:15px;">
                <strong>Job Title:</strong> ${jobTitle}
              </p>
              </div>

              <a href="${process.env.NEXT_PUBLIC_APP_URL}/login"
                style="display:inline-block; background:#000000; color:#ffffff; padding:14px 22px; border-radius:8px; text-decoration:none; font-weight:bold; font-size:14px;">
                Dashboard Login
              </a>

              <p style="margin-top:24px; font-size:14px; color:#666; line-height:1.6;">
                For security, please change your password after your first login.
                Do not share your login details with anyone.
              </p>

              <p style="margin-top:24px; font-size:14px; color:#666; line-height:1.6;">
                For security, please change your password after your first login.
                Do not share your login details with anyone.
              </p>

              <p style="margin-top:28px; font-size:15px;">
                Regards,<br/>
                <strong>Errandly247 Team</strong>
              </p>
            </div>

            <div style="background:#fafafa; padding:16px; text-align:center; font-size:12px; color:#777;">
              This email was sent automatically by Errandly247.
            </div>
          </div>
        </div>