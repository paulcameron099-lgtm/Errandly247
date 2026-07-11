"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    async function logout() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await supabase
          .from("profiles")
          .update({
            is_online: false,
            last_seen: new Date().toISOString(),
          })
          .eq("id", user.id);
      }

      await supabase.auth.signOut();
      router.push("/login");
    }

    logout();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Signing out...
      </p>
    </div>
  );
}