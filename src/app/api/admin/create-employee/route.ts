import { NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createClient } from "@/lib/server";
import { sendMail } from "@/lib/mailer";
import { createNotification } from "@/lib/createNotification";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      firstName,
      lastName,
      email,
      phone,
      role,
      jobTitle,
      country,
      cityState,
      postalCode,
      password,
    } = body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !role ||
      !jobTitle ||
      !country ||
      !cityState ||
      !postalCode ||
      !password
    ) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const allowedRoles = ["employee", "manager", "admin", "supervisor"];

    if (!allowedRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { data: adminProfile, error: adminProfileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (adminProfileError || !adminProfile) {
      return NextResponse.json(
        { error: "Admin profile not found." },
        { status: 403 }
      );
    }

    if (adminProfile.role !== "admin" && adminProfile.role !== "manager" && adminProfile.role !== "supervisor") {
      return NextResponse.json(
        { error: "Only admin or manager or supervisor can create users." },
        { status: 403 }
      );
    }

    const adminClient = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const fullName = `${firstName} ${lastName}`;

    const { data: createdUser, error: createUserError } =
      await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          first_name: firstName,
          last_name: lastName,
        },
      });

    if (createUserError || !createdUser.user) {
      return NextResponse.json(
        { error: createUserError?.message || "Failed to create user." },
        { status: 400 }
      );
    }

    const { error: profileError } = await adminClient.from("profiles").upsert({
      id: createdUser.user.id,
      first_name: firstName,
      last_name: lastName,
      full_name: fullName,
      email,
      phone,
      role,
      status: "active",
      is_online: false,
      job_title: jobTitle,
      country,
      city_state: cityState,
      postal_code: postalCode,
    });

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 }
      );
    }

    await createNotification({
      admin: adminClient,
      userId: createdUser.user.id,
      actorId: user.id,
      title: "Welcome to Errandly247",
      message: "Your employee account has been created successfully.",
      type: "Account",
      link: "/dashboard",
    });

    let emailSent = true;

    try {
      await sendMail({
        to: email,
        subject: "Welcome to Errandly247!",
        html: `
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

              <div style="background:#f8f8f8; padding:18px; border-radius:10px; margin:24px 0; border:1px solid #eeeeee;">
               <h3 style="margin-top:35px; font-size:20px; line-height:1.6;">
                Employee Dashboard Access
               </h3>
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

              <h2 style="margin-top:35px; font-size:20px; line-height:1.6;">Work Schedule</h2>

              <div style="background:#f9fafb; padding:16px; border-left:4px solid #000;"> <p><strong>Regular Schedule:</strong> Monday to Saturday</p> <p><strong>Working Hours:</strong> 10:00 AM - 3:00 PM</p> </div>

              <p style="margin-top:15px;"> Please ensure that you record your attendance daily during your scheduled work hours. </p>

              <h2 style="margin-top:35px; font-size:20px; line-height:1.6; text-transform:uppercase;">Dashboard Menu & Functions</h2>

              <p style="font-size:15px; line-height:1.6;"> Your Employee Dashboard is organized into several sections designed to help you manage your work, track attendance, communicate with your team, and monitor assigned tasks. It contains several menu options that provide access to the tools and features you will use throughout your employment. Below is a brief overview of each section and its purpose. </p>

              <h3 style="font-size:20px; line-height:1.6;">1. Dashboard</h3>

              <p style="font-size:15px; line-height:1.6;">The Dashboard provides a summary of your account activity, including attendance records, assigned projects, chat activity, and profile information. From this page, you can quickly navigate to any section of the system.</p>
 
              <h3 style="font-size:20px; line-height:1.6;">2. Attendance</h3>

              <p style="font-size:15px; line-height:1.6;">The Attendance menu is used to record your daily work hours.
                At the start of your shift, you are required to access the Attendance section and click Check In. This step is essential because the system only begins tracking your work hours after you have checked in. Work hours that are not recorded by the system may not be included in payroll calculations.
                At the end of your shift, return to the Attendance section and click Sign Out to complete your daily attendance record.
                You may also use this section to review your attendance history and previously recorded work hours.</p>

                <h3 style="font-size:20px; line-height:1.6;">3. Projects</h3>

                <p style="font-size:15px; line-height:1.6;">The Projects menu allows you to view assigned tasks, accept new assignments, monitor progress, and manage your workload.
                When a new task is assigned, you will receive a notification. You should proceed to the Projects section, review the 
                task details, and accept the assignment. After accepting the task, please visit the Chat section to communicate with 
                your supervisor regarding instructions, updates, and next steps.</p>

                <h3 style="font-size:20px; line-height:1.6;">4. Chats</h3>

                <p style="font-size:15px; line-height:1.6;">The Chat menu is used for work-related communication. Here you can participate 
                in group discussions, receive important updates, and communicate directly with your supervisor and other team members regarding 
                assigned tasks and ongoing projects.</p>

              <h2 style="margin-top:35px; font-size:20px; text-transform:uppercase;">Additional Menu Options</h2>

              <h3 style="margin-top:25px; font-size:20px; line-height:1.6;">User Profile</h3>

              <p style="font-size:15px; line-height:1.6;">The User Profile section allows you to review and update your personal information.
               Please ensure your address and contact details are accurate and up to date, as assignments may be based on your location. 
               </p>

              <h3 style="margin-top:35px; font-size:20px;">Logout</h3>

              <p style="font-size:15px; line-height:1.6;">The Logout option should be used when you have completed your workday and 
              are ready to securely sign out of the dashboard.</p>

              <h2 style="margin-top:35px; font-size:20px; text-transform:uppercase;">Navigation Tips</h2>

              <p style="font-size:15px; line-height:1.6;"The Employee Dashboard is accessible on both mobile devices and desktop computers. 
              While the layout may vary slightly depending on the device you are using, all features remain available.</p>

              <h3 style="margin-top:25px; font-size:20px; line-height:1.6; text-decoration:underline;">Mobile Devices</h3>

              <p style="font-size:15px; line-height:1.6;">When using the dashboard on a mobile device, tap the menu icon (☰) 
              located in the upper-left corner of the screen to open the navigation menu. This menu contains all dashboard sections and 
              functions.</p>

              <p style="font-size:15px; line-height:1.6;">In the upper-right corner of the screen, you will find the options menu (…). 
              Selecting this button will open a dropdown menu containing:</p>

              <div style="background:#f8f8f8; padding:18px; border-radius:10px; margin:24px 0; border:1px solid #eeeeee;"> 
              <h3 style="margin-top:25px; font-size:20px; line-height:1.6;">☀️ Theme Toggle</h3> 
              <p style="font-size:15px; line-height:1.6;">Switch between light mode and dark mode based on your preference.</p>

              <h3 style="margin-top:25px; font-size:20px; line-height:1.6;">🔔 Notifications</h3> 
              <p style="font-size:15px; line-height:1.6;">View important alerts, task assignments, messages, and company updates.</p> 
              </div>

              <h3 style="margin-top:25px; font-size:20px; line-height:1.6;">Profile Menu</h3>

              <p style="font-size:15px; line-height:1.6;">Select your profile to open a dropdown menu containing:</p>

              <ul style="background:#f8f8f8; padding:18px; border-radius:10px; margin:24px 0; border:1px solid #eeeeee;"> 
              <li style="margin:0 0 10px; font-size:15px;">Edit Profile</li> 
              <li style="margin:0 0 10px; font-size:15px;">Sign Out</li> 
              </ul>

              <h3 style="margin-top:28px; font-size:20px;">Desktop & PC</h3>

              <p style="font-size:15px; line-height:1.6;">When using the dashboard on a desktop or laptop computer, 
              the navigation menu is displayed on the left side of the screen and remains visible without the need to open it manually.</p>

              <p style="font-size:15px; line-height:1.6;">At the top of the page, you will find:</p>

              <div style="background:#f8f8f8; padding:18px; border-radius:10px; margin:24px 0; border:1px solid #eeeeee;"> 
              <h3 style="margin-top:25px; font-size:20px; line-height:1.6;">☀️ Theme Toggle</h3> 
              <p style="font-size:15px; line-height:1.6;">Switch between light mode and dark mode.</p>

              <h3 style="margin-top:25px; font-size:20px; line-height:1.6;">🔔 Notifications</h3> 
              <p style="font-size:15px; line-height:1.6;">Access task notifications, messages, reminders, and company announcements.</p> 
              </div>

              <h3 style="margin-top:28px; font-size:20px;">Profile Menu</h3>

              <p style="font-size:15px; line-height:1.6;">Select your profile to open a dropdown menu where you can:</p>

              <ul style="background:#f8f8f8; padding:18px; border-radius:10px; margin:24px 0; border:1px solid #eeeeee; padding-left:4px"> 
              <li style="margin:0 0 10px; font-size:15px;">Edit Profile</li> 
              <li style="margin:0 0 10px; font-size:15px;">Sign Out</li> 
              </ul>

              <h2 style="margin-top:35px; font-size:15px; text-transform:uppercase;">Security Reminder</h2>

              <p style="font-size:15px; line-height:1.6;">Please keep your login credentials secure and confidential. Do not share your account information with anyone.</p>

              <p style="font-size:15px; line-height:1.6;">If you experience any issues accessing or navigating the dashboard, please contact the support team for assistance.</p>

              <p style="font-size:15px; line-height:1.6;">We are committed to making your onboarding experience smooth and successful. Should you have any questions, our team is here to support you. </p>

              <p style="font-size:15px; line-height:1.6;">Welcome aboard, and we wish you great success with Errandly247.</p>

              <p style="margin-top:28px; font-size:15px;">
                Warm regards,<br/>
                <strong>Errandly247 Onboarding Team</strong>
              </p>
            </div>

            <div style="background:#fafafa; padding:16px; text-align:center; font-size:12px; color:#777;">
              This is an automated onboarding notification from the Errandly247 Employee Dashboard.
            </div>
          </div>
        </div>
      `,
      });
    } catch (mailError) {
      console.error("Welcome email failed:", mailError);
      emailSent = false;
    }

    return NextResponse.json({
      message: emailSent
        ? "User created successfully and welcome email sent."
        : "User created successfully, but welcome email failed to send.",
    });

  } catch (error) {
    console.error("Create employee error:", error);

    return NextResponse.json(
      { error: "Something went wrong while creating user." },
      { status: 500 }
    );

    
  }
}