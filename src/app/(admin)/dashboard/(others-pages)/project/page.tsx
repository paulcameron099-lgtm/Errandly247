"use client";

import { useEffect, useMemo, useState } from "react";

type Employee = {
  id: string;
  full_name: string | null;
  email: string | null;
  job_title: string | null;
};

type CurrentProfile = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
  job_title: string | null;
  status: string | null;
};

type Task = {
  id: string;
  title: string;
  task_html: string;
  status: "pending" | "in_progress" | "completed";
  priority: "low" | "normal" | "high" | "urgent";
  assigned_to: string;
  created_by: string | null;
  created_at: string;
  updated_at: string | null;
  accepted_at: string | null;
  completed_at: string | null;
  assigned_employee?: {
    full_name: string | null;
    email: string | null;
    job_title: string | null;
  } | null;
};

export default function ProjectPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [currentProfile, setCurrentProfile] = useState<CurrentProfile | null>(
    null
  );

  const [title, setTitle] = useState("");
  const [taskHtml, setTaskHtml] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("normal");

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const isAdmin =
    currentProfile?.role === "admin" || currentProfile?.role === "manager";

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  async function fetchTasks() {
    setLoading(true);
    setError("");

    const res = await fetch("/api/tasks");
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to load tasks.");
      setLoading(false);
      return;
    }

    setTasks(data.tasks || []);
    setCurrentProfile(data.currentProfile || null);
    setLoading(false);
  }

  async function fetchEmployees() {
    const res = await fetch("/api/admin/employees");
    const data = await res.json();

    if (res.ok) {
      setEmployees(data.employees || []);
    }
  }

  function applyFormat(command: string, value?: string) {
    document.execCommand(command, false, value);
    const editor = document.getElementById("task-editor");
    if (editor) {
      setTaskHtml(editor.innerHTML);
    }
  }

  function handleEditorInput(e: React.FormEvent<HTMLDivElement>) {
    setTaskHtml(e.currentTarget.innerHTML);
  }

  function resetForm() {
    setTitle("");
    setTaskHtml("");
    setAssignedTo("");
    setPriority("normal");
    setEditingTaskId(null);

    const editor = document.getElementById("task-editor");
    if (editor) editor.innerHTML = "";
  }

  async function handleCreateOrUpdateTask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSuccess("");
    setError("");
    setSaving(true);

    if (!title || !taskHtml || !assignedTo) {
      setError("Task title, task details, and employee are required.");
      setSaving(false);
      return;
    }

    if (editingTaskId) {
      const res = await fetch(`/api/tasks/${editingTaskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "edit",
          title,
          taskHtml,
          priority,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update task.");
        setSaving(false);
        return;
      }

      setSuccess(data.message || "Task updated successfully.");
      resetForm();
      await fetchTasks();
      setSaving(false);
      return;
    }

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        taskHtml,
        assignedTo,
        priority,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to create task.");
      setSaving(false);
      return;
    }

    setSuccess(data.message || "Task created successfully.");
    resetForm();
    await fetchTasks();
    setSaving(false);
  }

  async function handleAcceptTask(taskId: string) {
    setSuccess("");
    setError("");

    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "accept" }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to accept task.");
      return;
    }

    setSuccess(data.message || "Task accepted successfully.");
    await fetchTasks();
  }

  async function handleCompleteTask(taskId: string) {
    setSuccess("");
    setError("");

    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "complete" }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to complete task.");
      return;
    }

    setSuccess(data.message || "Task marked as completed.");
    await fetchTasks();
  }

  async function handleDeleteTask(taskId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    setSuccess("");
    setError("");

    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to delete task.");
      return;
    }

    setSuccess(data.message || "Task deleted successfully.");
    await fetchTasks();
  }

  function startEditing(task: Task) {
    setEditingTaskId(task.id);
    setTitle(task.title);
    setTaskHtml(task.task_html);
    setAssignedTo(task.assigned_to);
    setPriority(task.priority || "normal");

    setTimeout(() => {
      const editor = document.getElementById("task-editor");
      if (editor) editor.innerHTML = task.task_html;
    }, 0);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus =
        filterStatus === "all" || task.status === filterStatus;

      const searchText = `${task.title} ${
        task.assigned_employee?.full_name || ""
      } ${task.assigned_employee?.email || ""}`.toLowerCase();

      const matchesSearch = searchText.includes(search.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [tasks, filterStatus, search]);

  const pendingCount = tasks.filter((task) => task.status === "pending").length;
  const progressCount = tasks.filter(
    (task) => task.status === "in_progress"
  ).length;
  const completedCount = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-500">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-2xl bg-black p-6 text-white shadow-sm sm:p-8">
          <p className="text-sm text-gray-300">
            {isAdmin ? "Project Management" : "My Assigned Projects"}
          </p>

          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
            {isAdmin ? "Manage Employee Tasks" : "My Tasks"}
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-gray-300">
            {isAdmin
              ? "Create, assign, edit, track, and complete employee tasks from one professional workspace."
              : "View assigned tasks, accept new work, and monitor your task progress."}
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

        <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          <SummaryCard title="Pending" value={pendingCount.toString()} />
          <SummaryCard title="In Progress" value={progressCount.toString()} />
          <SummaryCard title="Completed" value={completedCount.toString()} />
        </div>

        {isAdmin && (
          <div className="mb-8 rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800">
            <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingTaskId ? "Edit Task" : "Create New Task"}
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Assign detailed work instructions to an employee.
              </p>
            </div>

            <form onSubmit={handleCreateOrUpdateTask} className="p-6">
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Task Title
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter task title"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-black dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-black dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div className="lg:col-span-3">
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Assign To
                  </label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    disabled={Boolean(editingTaskId)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-black disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  >
                    <option value="">Select employee</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.full_name || employee.email} —{" "}
                        {employee.job_title || "No job title"}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="lg:col-span-3">
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Task Details
                  </label>

                  <div className="overflow-hidden rounded-xl border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900">
                    <div className="flex flex-wrap gap-2 border-b border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-950">
                      <ToolbarButton onClick={() => applyFormat("bold")}>
                        Bold
                      </ToolbarButton>

                      <ToolbarButton onClick={() => applyFormat("underline")}>
                        Underline
                      </ToolbarButton>

                      <ToolbarButton
                        onClick={() => applyFormat("uppercase")}
                        custom
                      >
                        Capitalize
                      </ToolbarButton>

                      <select
                        onChange={(e) => applyFormat("foreColor", e.target.value)}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Text Color
                        </option>
                        <option value="#111827">Black</option>
                        <option value="#dc2626">Red</option>
                        <option value="#2563eb">Blue</option>
                        <option value="#16a34a">Green</option>
                        <option value="#ca8a04">Yellow</option>
                      </select>
                    </div>

                    <div
                      id="task-editor"
                      contentEditable
                      onInput={handleEditorInput}
                      className="min-h-[180px] w-full px-4 py-4 text-sm text-gray-800 outline-none dark:text-white"
                      suppressContentEditableWarning
                    />
                  </div>

                  <p className="mt-2 text-xs text-gray-500">
                    You can format the task details before assigning it.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                {editingTaskId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
                  >
                    Cancel Edit
                  </button>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-900 disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingTaskId
                    ? "Update Task"
                    : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="flex flex-col gap-4 border-b border-gray-200 px-6 py-5 dark:border-gray-700 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {isAdmin ? "All Tasks" : "Assigned Tasks"}
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Track task status, priority, and assigned employee activity.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks..."
                className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-black dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-black dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 p-6">
            {filteredTasks.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
                <p className="text-sm text-gray-500">No tasks found.</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isAdmin={isAdmin}
                  onAccept={handleAcceptTask}
                  onComplete={handleCompleteTask}
                  onEdit={startEditing}
                  onDelete={handleDeleteTask}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskCard({
  task,
  isAdmin,
  onAccept,
  onComplete,
  onEdit,
  onDelete,
}: {
  task: Task;
  isAdmin: boolean;
  onAccept: (taskId: string) => void;
  onComplete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {task.title}
            </h3>

            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
          </div>

          {isAdmin && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Assigned to{" "}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {task.assigned_employee?.full_name || "Unknown"}
              </span>{" "}
              • {task.assigned_employee?.job_title || "No job title"}
            </p>
          )}

          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Created: {formatDateTime(task.created_at)}
            {task.accepted_at ? ` • Accepted: ${formatDateTime(task.accepted_at)}` : ""}
            {task.completed_at
              ? ` • Completed: ${formatDateTime(task.completed_at)}`
              : ""}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {!isAdmin && task.status === "pending" && (
            <button
              onClick={() => onAccept(task.id)}
              className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-gray-900"
            >
              Accept Task
            </button>
          )}

          {isAdmin && task.status !== "completed" && (
            <button
              onClick={() => onComplete(task.id)}
              className="rounded-full bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700"
            >
              Mark Completed
            </button>
          )}

          {isAdmin && (
            <>
              <button
                onClick={() => onEdit(task)}
                className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Edit
              </button>

              <button
                onClick={() => onDelete(task.id)}
                className="rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div
        className="prose prose-sm mt-5 max-w-none rounded-xl bg-gray-50 p-4 text-gray-700 dark:bg-gray-950 dark:text-gray-300"
        dangerouslySetInnerHTML={{ __html: task.task_html }}
      />
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  custom,
}: {
  children: React.ReactNode;
  onClick: () => void;
  custom?: boolean;
}) {
  function handleClick() {
    if (custom) {
      const editor = document.getElementById("task-editor");
      if (!editor) return;

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const selectedText = selection.toString();
      if (!selectedText) return;

      document.execCommand("insertText", false, selectedText.toUpperCase());
      return;
    }

    onClick();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
    >
      {children}
    </button>
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

function StatusBadge({ status }: { status: string }) {
  const styles =
    status === "completed"
      ? "bg-green-100 text-green-700"
      : status === "in_progress"
      ? "bg-blue-100 text-blue-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles}`}>
      {status.replace("_", " ")}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles =
    priority === "urgent"
      ? "bg-red-100 text-red-700"
      : priority === "high"
      ? "bg-orange-100 text-orange-700"
      : priority === "low"
      ? "bg-gray-100 text-gray-700"
      : "bg-purple-100 text-purple-700";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles}`}>
      {priority}
    </span>
  );
}

function formatDateTime(value?: string | null) {
  if (!value) return "Not available";

  return new Date(value).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}