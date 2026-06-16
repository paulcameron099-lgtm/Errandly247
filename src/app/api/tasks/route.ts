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

async function getCurrentProfile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, job_title, status")
    .eq("id", user.id)
    .single();

  return profile;
}

export async function GET() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const isAdmin = profile.role === "admin" || profile.role === "manager" || profile.role === "supervisor";

  const query = adminClient()
    .from("tasks")
    .select(
      `
      id,
      title,
      task_html,
      status,
      priority,
      assigned_to,
      created_by,
      created_at,
      updated_at,
      accepted_at,
      completed_at,
      assigned_employee:profiles!tasks_assigned_to_fkey (
        full_name,
        email,
        job_title
      )
    `
    )
    .order("created_at", { ascending: false });

  if (!isAdmin) {
    query.eq("assigned_to", profile.id);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ tasks: data || [], currentProfile: profile });
}

export async function POST(req: Request) {
  const profile = await getCurrentProfile();

  if (!profile) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (profile.role !== "admin" && profile.role !== "manager") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const body = await req.json();

  const { title, taskHtml, assignedTo, priority } = body;

  if (!title || !taskHtml || !assignedTo) {
    return NextResponse.json(
      { error: "Title, task content, and employee are required." },
      { status: 400 }
    );
  }

  const supabase = adminClient();

const { data: employee } = await supabase
  .from("profiles")
  .select("id, email, full_name, first_name, job_title")
  .eq("id", assignedTo)
  .single();

  const { data: task, error } = await supabase
    .from("tasks")
    .insert({
      title,
      task_html: taskHtml,
      assigned_to: assignedTo,
      created_by: profile.id,
      status: "pending",
      priority: priority || "normal",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

    await createNotification({
    admin: supabase,
    userId: assignedTo,
    actorId: profile.id,
    title: "New Project Assigned",
    message: `A new project "${title}" has been assigned to you.`,
    type: "Project",
    link: "/dashboard/project",
  });

  if (employee?.email) {
    try {
      await sendMail({
        to: employee.email,
        subject: "New Task Assigned - Action Required",
        html: `
          <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:30px;">
            <div style="max-width:620px; margin:auto; background:#fff; border-radius:14px; overflow:hidden;">
              <div style="background:#000; color:#fff; padding:28px; text-align:center;">
                <h1 style="margin:0; font-size:24px;">New Task Assigned</h1>
                <p style="margin-top:8px; color:#e5e5e5; font-size:14px;">Dashboard notification</p>
              </div>

              <div style="padding:28px; color:#222;">
                <p style="font-size:16px;">Hello <strong>${employee.full_name || employee.first_name || "Team Member"}</strong>,</p>

                <p style="font-size:15px; line-height:1.7;">
                  A new task has been assigned to you and is awaiting your review.
                </p>

                <div style="background:#f8f8f8; border:1px solid #eee; padding:18px; border-radius:10px; margin:24px 0;">
                  <h2 font-size:15px; line-height:1.7;>Task Information</h2>
                  <p style="margin:0 0 10px;"><strong>Task ID:</strong> ${title}</p>
                  <p style="margin:0 0 10px;"><strong>Priority:</strong> ${priority || "normal"}</p>
                  <p style="margin:0;"><strong>Status:</strong> Pending</p>
                </div>

                <p style="font-size:15px; line-height:1.7;">
                  Kindly review and accept the assigned task at your earliest convenience, then coordinate with your supervisor to obtain the necessary instructions for completion.
                </p>

                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/project"
                  style="display:inline-block; background:#000; color:#fff; padding:14px 22px; border-radius:8px; text-decoration:none; font-weight:bold;">
                  View Task
                </a>

                <p style="margin-top:28px;">
                  Regards,<br/>
                  <strong>Support Team</strong><br/>
                  Errandly247
                </p>
              </div>
            </div>
          </div>
        `,
      });
    } catch (mailError) {
      console.error("Task creation email failed:", mailError);
    }
  }

  return NextResponse.json({ message: "Task created successfully.", task });
}