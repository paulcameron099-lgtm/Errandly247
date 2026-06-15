"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

type Profile = {
  id: string;
  full_name: string | null;
  role: string | null;
  job_title: string | null;
  status: string | null;
};

type Attendance = {
  id: string;
  user_id: string;
  check_in: string | null;
  check_out: string | null;
  status: string;
  note: string | null;
  attendance_date: string;
  work_status: string | null;
    is_late: boolean | null;
    late_minutes: number | null;
  profiles?: {
    full_name: string | null;
    email: string | null;
    job_title: string | null;
  } | null;
};

export default function AttendancePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [records, setRecords] = useState<Attendance[]>([]);
  const [todayRecord, setTodayRecord] = useState<Attendance | null>(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchPageData();
  }, []);

  async function fetchPageData() {
    setLoading(true);
    setError("");

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data: userProfile, error: profileError } = await supabase
      .from("profiles")
      .select("id,full_name,role,job_title,status")
      .eq("id", user.id)
      .single();

    if (profileError || !userProfile) {
      setError("Unable to load profile.");
      setLoading(false);
      return;
    }

    setProfile(userProfile);

    const role = String(userProfile.role || "").toLowerCase();

    if (role === "admin" || role === "manager" || role === "supervisor") {
      await fetchAdminAttendance();
    } else {
      await fetchEmployeeAttendance(user.id);
    }

    setLoading(false);
  }

  async function fetchEmployeeAttendance(userId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("user_id", userId)
      .order("attendance_date", { ascending: false });

    if (error) {
      setError(error.message);
      return;
    }

    setRecords(data || []);

    const todayAttendance =
      data?.find((item) => item.attendance_date === today) || null;

    setTodayRecord(todayAttendance);
  }

  async function fetchAdminAttendance() {
    const res = await fetch("/api/admin/attendance");
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to load attendance.");
      return;
    }

    setRecords(data.attendance || []);
  }

async function handleCheckIn() {
  if (!profile) return;

  setActionLoading(true);
  setError("");
  setSuccess("");

  const supabase = createClient();

  const now = new Date();

// USA Eastern Time (New York)
// Employee can check in between 9:00 AM and 10:00 AM

const easternTime = new Date(
  now.toLocaleString("en-US", {
    timeZone: "America/New_York",
  })
);

const currentHour = easternTime.getHours();
const currentMinute = easternTime.getMinutes();

const currentMinutes = currentHour * 60 + currentMinute;

const startMinutes = 9 * 60; // 9:00 AM
const lateMinutesStart = 10 * 60; // 10:00 AM

  // Before 9AM
  if (currentMinutes < startMinutes) {
    setError("Check-in opens at 9:00 AM (US Eastern Time).");
    setActionLoading(false);
    return;
  }

  const isLate = currentMinutes > lateMinutesStart;

  const lateMinutes = isLate
    ? currentMinutes - lateMinutesStart
    : 0;

  const attendanceStatus = isLate ? "late" : "present";

  const { error } = await supabase.from("attendance").insert({
    user_id: profile.id,
    check_in: now.toISOString(),
    attendance_date: today,
    status: attendanceStatus,
    work_status: "in_progress",
    is_late: isLate,
    late_minutes: lateMinutes,
  });

  if (error) {
    setError(error.message);
    setActionLoading(false);
    return;
  }

  setSuccess(
    isLate
      ? `Checked in successfully. You are ${lateMinutes} minutes late.`
      : "Checked in successfully."
  );

  await fetchEmployeeAttendance(profile.id);
  setActionLoading(false);
}

  async function handleCheckOut() {
    if (!todayRecord) return;

    setActionLoading(true);
    setError("");
    setSuccess("");

    const supabase = createClient();

    const { error } = await supabase
      .from("attendance")
      .update({
        check_out: new Date().toISOString(),
        work_status: "completed",
        })
      .eq("id", todayRecord.id);

    if (error) {
      setError(error.message);
      setActionLoading(false);
      return;
    }

    setSuccess("Checked out successfully.");
    if (profile) await fetchEmployeeAttendance(profile.id);
    setActionLoading(false);
  }

  const role = String(profile?.role || "").toLowerCase();
  const isAdmin = role === "admin" || role === "manager";
  const isRestricted = profile?.status === "restricted";

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-500">Loading attendance...</p>
      </div>
    );
  }

  if (isRestricted && !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-900">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-white p-8 shadow-sm dark:border-red-900 dark:bg-gray-800">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Attendance Access Restricted
          </h1>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Your account is currently restricted. Please contact the Support Team
            for assistance.
          </p>
        </div>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 rounded-2xl bg-black p-6 text-white shadow-sm sm:p-8">
            <p className="text-sm text-gray-300">Attendance Management</p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              Employee Attendance
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-300">
              Monitor employee check-ins, check-outs, and daily attendance
              activity.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3">
            <SummaryCard
              title="Total Records"
              value={records.length.toString()}
            />
            <SummaryCard
              title="Checked In Today"
              value={
                records.filter((item) => item.attendance_date === today)
                  .length.toString()
              }
            />
            <SummaryCard
              title="Checked Out Today"
              value={
                records.filter(
                  (item) => item.attendance_date === today && item.check_out
                ).length.toString()
              }
            />
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800">
            <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Attendance Records
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <Th>Employee</Th>
                    <Th>Job Title</Th>
                    <Th>Date</Th>
                    <Th>Check In</Th>
                    <Th>Check Out</Th>
                    <Th>Status</Th>
                    <Th>Late</Th>
                  </tr>
                </thead>

                <tbody>
                  {records.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-8 text-center text-sm text-gray-500"
                      >
                        No attendance records yet.
                      </td>
                    </tr>
                  ) : (
                    records.map((record) => (
                      <tr
                        key={record.id}
                        className="border-t border-gray-100 dark:border-gray-700"
                      >
                        <Td>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {record.profiles?.full_name || "Unknown"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {record.profiles?.email}
                            </p>
                          </div>
                        </Td>
                        <Td>{record.profiles?.job_title || "Not provided"}</Td>
                        <Td>{record.attendance_date}</Td>
                        <Td>{formatTime(record.check_in)}</Td>
                        <Td>{formatTime(record.check_out)}</Td>
                        <Td>
                          <StatusBadge
                            checkedOut={Boolean(record.check_out)}
                          />
                        </Td>
                        <Td>
                        {record.is_late ? (
                            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                            {record.late_minutes} mins late
                            </span>
                        ) : (
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                            On time
                            </span>
                        )}
                        </Td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasCheckedIn = Boolean(todayRecord?.check_in);
  const hasCheckedOut = Boolean(todayRecord?.check_out);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 rounded-2xl bg-black p-6 text-white shadow-sm sm:p-8">
          <p className="text-sm text-gray-300">My Attendance</p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
            Welcome, {profile?.full_name || "Employee"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-300">
            Check in when your workday starts and check out when your workday
            ends.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800 lg:col-span-1">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Today&apos;s Attendance
            </h2>

            <div className="mt-5 space-y-4">
              <Info label="Date" value={today} />
              <Info label="Check In" value={formatTime(todayRecord?.check_in)} />
              <Info
                label="Check Out"
                value={formatTime(todayRecord?.check_out)}
              />
              <Info
                label="Status"
                value={
                    hasCheckedOut
                    ? "Completed"
                    : hasCheckedIn
                    ? todayRecord?.status === "late"
                        ? `Checked In Late (${todayRecord?.late_minutes} mins)`
                        : "Checked In On Time"
                    : "Not Checked In"
                }
                />
            </div>

            <div className="mt-6 flex flex-col gap-3">
              {!hasCheckedIn && (
                <button
                  onClick={handleCheckIn}
                  disabled={actionLoading}
                  className="rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-900 disabled:opacity-60"
                >
                  {actionLoading ? "Checking in..." : "Check In"}
                </button>
              )}

              {hasCheckedIn && !hasCheckedOut && (
                <button
                  onClick={handleCheckOut}
                  disabled={actionLoading}
                  className="rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-900 disabled:opacity-60"
                >
                  {actionLoading ? "Checking out..." : "Check Out"}
                </button>
              )}

              {hasCheckedOut && (
                <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                  Attendance completed for today.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Attendance History
            </h2>

            <div className="mt-5 space-y-3">
              {records.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No attendance history yet.
                </p>
              ) : (
                records.map((record) => (
                  <div
                    key={record.id}
                    className="rounded-xl border border-gray-200 p-4 dark:border-gray-700"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {record.attendance_date}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Check in: {formatTime(record.check_in)} • Check out:{" "}
                          {formatTime(record.check_out)}
                        </p>
                      </div>

                      <StatusBadge checkedOut={Boolean(record.check_out)} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800">
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <h3 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </h3>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
        {value || "Not available"}
      </p>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
      {children}
    </td>
  );
}

function StatusBadge({ checkedOut }: { checkedOut: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        checkedOut
          ? "bg-green-100 text-green-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {checkedOut ? "Completed" : "In Progress"}
    </span>
  );
}

function formatTime(value?: string | null) {
  if (!value) return "Not available";

  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}