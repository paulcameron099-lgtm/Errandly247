"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import Link from "next/link";

type Profile = {
  full_name: string | null;
  first_name: string | null;
  role: string | null;
  job_title: string | null;
  status: string | null;
  country: string | null;
  city_state: string | null;
};

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name,first_name,role,job_title,status,country,city_state")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error(error.message);
        setLoading(false);
        return;
      }

      setProfile(data);
      setLoading(false);
    }

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  const role = String(profile?.role || "").toLowerCase();
  const isAdmin = role === "admin" || role === "manager";
  const isRestricted = profile?.status === "restricted";

  const name =
    profile?.first_name ||
    profile?.full_name?.split(" ")[0] ||
    "User";

  if (isRestricted && !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-900">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-white p-8 shadow-sm dark:border-red-900 dark:bg-gray-800">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
            !
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Account Restricted
          </h1>

         <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
            Hello {name}, your employee dashboard access is currently restricted.
            During this period, access to certain company resources and dashboard
            features may be temporarily unavailable.
          </p>

          <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
            If you believe this restriction was applied in error, please contact the
            Support Team for assistance.
          </div>

          <Link
            href="/logout"
            className="mt-6 inline-flex rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-900"
          >
            Sign out
          </Link>
        </div>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 rounded-2xl bg-black p-6 text-white shadow-sm sm:p-8">
            <p className="text-sm text-gray-300">Admin Dashboard</p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              Welcome back, {name}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-300">
              Manage employees, monitor activities, control access, and review company performance.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <DashboardCard title="Employees" value="Manage" href="/dashboard/manage-employees" />
            <DashboardCard title="Create User" value="Add New" href="/dashboard/create-employee" />
            <DashboardCard title="Attendance" value="Monitor" href="/dashboard/attendance" />
            {/* <DashboardCard title="Analytics" value="View Reports" href="/dashboard/analytics" /> */}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Quick Actions
              </h2>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <QuickLink href="/dashboard/create-employee" label="Create Employee" />
                <QuickLink href="/dashboard/manage-employees" label="Manage Employees" />
                <QuickLink href="/dashboard/project" label="View Projects" />
                <QuickLink href="/dashboard/chat" label="Open Chat" />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Account Summary
              </h2>

              <div className="mt-5 space-y-3 text-sm">
                <Summary label="Access Level" value={profile?.role} />
                <Summary label="Job Title" value={profile?.job_title} />
                <Summary label="Location" value={`${profile?.city_state || ""}, ${profile?.country || ""}`} />
                <Summary label="Status" value={profile?.status || "active"} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-2xl bg-black p-6 text-white shadow-sm sm:p-8">
          <p className="text-sm text-gray-300">Employee Dashboard</p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
            Welcome, {name}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-300">
            View your attendance, assigned projects, company chat, and profile details.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <DashboardCard title="Attendance" value="Check In" href="/dashboard/attendance" />
          <DashboardCard title="Projects" value="View Tasks" href="/dashboard/project" />
          <DashboardCard title="Chat" value="Messages" href="/dashboard/chat" />
        </div>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            My Work Profile
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Summary label="Job Title" value={profile?.job_title} />
            <Summary label="Access Level" value={profile?.role} />
            <Summary label="Location" value={`${profile?.city_state || ""}, ${profile?.country || ""}`} />
            <Summary label="Account Status" value={profile?.status || "active"} />
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  href,
}: {
  title: string;
  value: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-800"
    >
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <h3 className="mt-3 text-xl font-bold text-gray-900 dark:text-white">
        {value}
      </h3>
    </Link>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900"
    >
      {label}
    </Link>
  );
}

function Summary({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-sm font-semibold capitalize text-gray-900 dark:text-white">
        {value || "Not provided"}
      </p>
    </div>
  );
}