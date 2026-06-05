"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const filteredNotifications = useMemo(() => {
    if (filter === "unread") return notifications.filter((n) => !n.is_read);
    if (filter === "read") return notifications.filter((n) => n.is_read);
    return notifications;
  }, [notifications, filter]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    setLoading(true);

    const res = await fetch("/api/notifications");
    const data = await res.json();

    if (res.ok) {
      setNotifications(data.notifications || []);
    }

    setLoading(false);
  }

  async function markAllAsRead() {
    setNotifications((prev) =>
      prev.map((item) => ({ ...item, is_read: true }))
    );

    await fetch("/api/notifications", {
      method: "PATCH",
    });
  }

  async function markSingleAsRead(id: string) {
  setNotifications((prev) =>
    prev.map((item) =>
      item.id === id ? { ...item, is_read: true } : item
    )
  );

  await fetch(`/api/notifications/${id}`, {
    method: "PATCH",
  });
}

async function deleteNotification(id: string) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this notification?"
  );

  if (!confirmed) return;

  setNotifications((prev) => prev.filter((item) => item.id !== id));

  await fetch(`/api/notifications/${id}`, {
    method: "DELETE",
  });
}

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View your account, project, and chat updates.
          </p>
        </div>

        <button
          onClick={markAllAsRead}
          className="rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white"
        >
          Mark all as read
        </button>
      </div>

      <div className="mb-5 flex gap-2">
        {["all", "unread", "read"].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item as "all" | "unread" | "read")}
            className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${
              filter === item
                ? "bg-black text-white"
                : "border border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        {loading ? (
          <p className="p-6 text-sm text-gray-500">Loading notifications...</p>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              No notifications found
            </p>
            <p className="mt-1 text-xs text-gray-500">
              New updates will appear here.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredNotifications.map((item) => {
              const content = (
                <div
                  className={`flex gap-4 p-5 transition hover:bg-gray-50 dark:hover:bg-white/3 ${
                    !item.is_read ? "bg-orange-50 dark:bg-orange-950/20" : ""
                  }`}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    {item.type.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {item.title}
                      </h3>

                      <span className="text-xs text-gray-500">
                        {formatNotificationTime(item.created_at)}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {item.message}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        {item.type}
                    </span>

                    {!item.is_read && (
                        <>
                        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                            Unread
                 </span>

                    <button
                        type="button"
                        onClick={(e) => {
                        e.preventDefault();
                        markSingleAsRead(item.id);
                        }}
                        className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-white"
                    >
                        Mark read
                    </button>
                    </>
                )}

                <button
                    type="button"
                    onClick={(e) => {
                    e.preventDefault();
                    deleteNotification(item.id);
                    }}
                    className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100"
                >
                    Delete
                </button>
                </div>
                  </div>
                </div>
              );

              return (
                <li key={item.id}>
                  {item.link ? <Link href={item.link}>{content}</Link> : content}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function formatNotificationTime(value: string) {
  const date = new Date(value);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin} min ago`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}