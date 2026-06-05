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
    .select("id, full_name, email, role")
    .eq("id", user.id)
    .single();

  return profile;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const profile = await getCurrentProfile();

  if (!profile) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await req.json();
  const { action, title, taskHtml, priority } = body;

  const supabase = adminClient();

  const { data: task } = await supabase
    .from("tasks")
    .select(
      `
      id,
      assigned_to,
      title,
      status,
      assigned_employee:profiles!tasks_assigned_to_fkey (
        email,
        full_name,
        first_name
      )
    `
    )
    .eq("id", id)
    .single();

  if (!task) {
    return NextResponse.json({ error: "Task not found." }, { status: 404 });
  }

  const isAdmin = profile.role === "admin" || profile.role === "manager" || profile.role === "supervisor";
  const isAssignedEmployee = task.assigned_to === profile.id;

  if (action === "accept") {
    if (!isAssignedEmployee) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const { error } = await supabase
      .from("tasks")
      .update({
        status: "in_progress",
        accepted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
  return NextResponse.json({ error: error.message }, { status: 400 });
}

const { data: staffUsers } = await supabase
  .from("profiles")
  .select("id")
  .in("role", ["admin", "manager", "supervisor"])
  .eq("status", "active");

for (const staff of staffUsers || []) {
  await createNotification({
    admin: supabase,
    userId: staff.id,
    actorId: profile.id,
    title: "Project Accepted",
    message: `${profile.full_name} accepted the task "${task.title}".`,
    type: "Project",
    link: "/dashboard/project",
  });
}

return NextResponse.json({ message: "Task accepted successfully." });
  }

  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  if (action === "complete") {
    const { error } = await supabase
      .from("tasks")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

      await createNotification({
    admin: supabase,
    userId: task.assigned_to,
    actorId: profile.id,
    title: "Project Completed",
    message: `Your task "${task.title}" has been marked as completed.`,
    type: "Project",
    link: "/dashboard/project",
  });

    const employee = Array.isArray(task.assigned_employee)
      ? task.assigned_employee[0]
      : task.assigned_employee;

    if (employee?.email) {
      try {
        await sendMail({
          to: employee.email,
          subject: "Task Completed - Errandly247 Dashboard",
          html: `
            <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:30px;">
              <div style="max-width:620px; margin:auto; background:#fff; border-radius:14px; overflow:hidden;">
                <div style="background:#000; color:#fff; padding:28px; text-align:center;">
                  <h1 style="margin:0; font-size:24px;">Task Completed</h1>
                  <p style="margin-top:8px; color:#e5e5e5; font-size:14px;">Errandly247 Employee Dashboard</p>
                </div>

                <div style="padding:28px; color:#222;">
                  <p style="font-size:16px;">Hello <strong>${employee.full_name || employee.first_name || "Team Member"}</strong>,</p>

                  <p style="font-size:15px; line-height:1.7;">
                    Your assigned task has been reviewed and marked as completed.
                  </p>

                  <div style="background:#f0fff4; border:1px solid #bbf7d0; padding:18px; border-radius:10px; margin:24px 0;">
                    <p style="margin:0 0 10px;"><strong>Task Title:</strong> ${task.title}</p>
                    <p style="margin:0;"><strong>Status:</strong> Completed</p>
                  </div>

                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/project"
                    style="display:inline-block; background:#000; color:#fff; padding:14px 22px; border-radius:8px; text-decoration:none; font-weight:bold;">
                    View Dashboard
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
        console.error("Task completed email failed:", mailError);
      }
    }

    return NextResponse.json({ message: "Task marked as completed." });
  }

  if (action === "edit") {
    const { error } = await supabase
      .from("tasks")
      .update({
        title,
        task_html: taskHtml,
        priority,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Task updated successfully." });
  }

  return NextResponse.json({ error: "Invalid action." }, { status: 400 });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const profile = await getCurrentProfile();

  if (!profile) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (profile.role !== "admin" && profile.role !== "manager") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const { error } = await adminClient().from("tasks").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Task deleted successfully." });
}