"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-white xl:flex">
      <AppSidebar />
      <Backdrop />

      <div
        className={`flex-1 bg-gray-50 transition-all duration-300 ease-in-out dark:bg-gray-950 ${mainContentMargin}`}
      >
        <AppHeader />

        <div className="mx-auto min-h-[calc(100vh-80px)] max-w-(--breakpoint-2xl) bg-gray-50 p-4 dark:bg-gray-950 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}