"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Employee = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
  job_title: string | null;
  avatar_url: string | null;
  status: string | null;
  is_online: boolean | null;
  last_seen: string | null;
};

export default function ManageEmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  async function fetchEmployees() {
  setLoading(true);
  setError("");

  const res = await fetch("/api/admin/employees");
  const data = await res.json();

  if (!res.ok) {
    setError(data.error || "Failed to fetch employees.");
    setLoading(false);
    return;
  }

  setEmployees(data.employees || []);
  setLoading(false);
}

 async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  setSuccess("");
  setError("");

  if (!selectedUserId) {
    setError("Please select an employee.");
    return;
  }

  if (!selectedFile) {
    setError("Please choose an image.");
    return;
  }

  if (!selectedFile.type.startsWith("image/")) {
    setError("Only image files are allowed.");
    return;
  }

  setUploading(true);

  const formData = new FormData();
  formData.append("employeeId", selectedUserId);
  formData.append("file", selectedFile);

  const res = await fetch("/api/admin/upload-avatar", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    setError(data.error || "Failed to upload profile picture.");
    setUploading(false);
    return;
  }

  setSuccess(data.message || "Profile picture uploaded successfully.");
  setSelectedFile(null);
  setSelectedUserId("");

  await fetchEmployees();

  window.dispatchEvent(new Event("profile-updated"));

  setUploading(false);
}

  const selectedEmployee = employees.find((emp) => emp.id === selectedUserId);

  async function handleStatusChange(employeeId: string, status: "active" | "restricted") {
  setSuccess("");
  setError("");

  const res = await fetch("/api/admin/update-employee-status", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ employeeId, status }),
  });

  const data = await res.json();

  if (!res.ok) {
    setError(data.error || "Failed to update employee status.");
    return;
  }

  setSuccess(data.message);
  await fetchEmployees();
}

async function handleDeleteEmployee(employeeId: string) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this employee account? This cannot be undone."
  );

  if (!confirmed) return;

  setSuccess("");
  setError("");

  const res = await fetch("/api/admin/delete-employee", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ employeeId }),
  });

  const data = await res.json();

  if (!res.ok) {
    setError(data.error || "Failed to delete employee.");
    return;
  }

  setSuccess(data.message);
  await fetchEmployees();
}

async function handleNotifyEmployee(employeeId: string) {
  setSuccess("");
  setError("");

  const res = await fetch("/api/admin/notify-employee", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ employeeId }),
  });

  const data = await res.json();

  if (!res.ok) {
    setError(data.error || "Failed to notify employee.");
    return;
  }

  setSuccess(data.message);
}

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Manage Employees
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Select an employee and upload their profile picture.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800 lg:col-span-1">
            <h2 className="mb-5 text-lg font-semibold text-gray-900 dark:text-white">
              Upload Profile Picture
            </h2>

            {error && (
              <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}

            {success && (
              <p className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                {success}
              </p>
            )}

            <form onSubmit={handleUpload} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Employee
                </label>

                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-black dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                >
                  <option value="">Select employee</option>

                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.full_name || employee.email} —{" "}
                      {employee.job_title || employee.role}
                    </option>
                  ))}
                </select>
              </div>

              {selectedEmployee && (
                <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
                  <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    {selectedEmployee.avatar_url ? (
                      <Image
                        fill
                        src={selectedEmployee.avatar_url}
                        alt={selectedEmployee.full_name || "Employee"}
                        className="object-cover"
                      />
                    ) : (
                      <span className="font-semibold text-gray-600 dark:text-gray-300">
                        {(selectedEmployee.full_name || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {selectedEmployee.full_name || "No name"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedEmployee.email}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Upload Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploading ? "Uploading..." : "Upload Picture"}
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800 lg:col-span-2">
            <h2 className="mb-5 text-lg font-semibold text-gray-900 dark:text-white">
              Employees
            </h2>

            {loading ? (
              <p className="text-sm text-gray-500">Loading employees...</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {employees.map((employee) => (
                  <div
                    key={employee.id}
                    className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 dark:border-gray-700"
                  >
                   <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-gray-900">
                    {employee.avatar_url ? (
                      <Image
                        fill
                        src={employee.avatar_url}
                        alt={employee.full_name || "Employee"}
                        className="object-cover"
                      />
                    ) : (
                      <span className="font-semibold text-gray-600 dark:text-gray-300">
                        {(employee.full_name || "U").charAt(0).toUpperCase()}
                      </span>
                    )}

                    <span
                      className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-gray-800 ${
                        employee.is_online ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                  </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                        {employee.full_name || "No name"}
                      </p>
                      <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                        {employee.email}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {employee.job_title || "No job title"} •{" "}
                        {employee.role || "employee"}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {employee.is_online
                          ? "Online now"
                          : `Last seen: ${formatLastSeen(employee.last_seen)}`}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                    <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                        employee.status === "restricted"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                    >
                        {employee.status === "restricted" ? "Restricted" : "Active"}
                    </span>
                    <button
                    onClick={() => handleNotifyEmployee(employee.id)}
                    className="rounded-full bg-black px-3 py-1 text-xs font-medium text-white hover:bg-gray-900"
                    >
                    Notify Employee
                    </button>

                    {employee.status === "restricted" ? (
                        <button
                        onClick={() => handleStatusChange(employee.id, "active")}
                        className="rounded-full bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
                        >
                        Activate
                        </button>
                    ) : (
                        <button
                        onClick={() => handleStatusChange(employee.id, "restricted")}
                        className="rounded-full bg-yellow-500 px-3 py-1 text-xs font-medium text-white hover:bg-yellow-600"
                        >
                        Restrict
                        </button>
                    )}

                    <button
                        onClick={() => handleDeleteEmployee(employee.id)}
                        className="rounded-full bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
                    >
                        Delete
                    </button>
                    </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  function formatLastSeen(value?: string | null) {
  if (!value) return "Never";

  const date = new Date(value);

  return date.toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
}