"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase";

type Profile = {
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  job_title:string | null;
  country: string | null;
  city_state: string | null;
  avatar_url: string | null;
};

export default function UserMetaCard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  

async function fetchProfile() {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    setLoading(false);
    return;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("full_name,first_name,last_name,role,job_title,country,city_state,avatar_url")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Profile fetch error:", error.message);
    setLoading(false);
    return;
  }

  setProfile(data);
  setLoading(false);
}

useEffect(() => {
  fetchProfile();

  const handleProfileUpdate = () => {
    fetchProfile();
  };

  window.addEventListener("profile-updated", handleProfileUpdate);

  return () => {
    window.removeEventListener("profile-updated", handleProfileUpdate);
  };
}, []);

  const fullName =
    profile?.full_name ||
    `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim() ||
    "User";

  const jobTitle = profile?.job_title || "Employee";

  const location = [profile?.city_state, profile?.country]
    .filter(Boolean)
    .join(", ");

  if (loading) {
    return (
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
          <div className="relative w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800 bg-gray-100">
           {profile?.avatar_url ? (
              <Image
                fill
                src={profile.avatar_url}
                alt={fullName}
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xl font-semibold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                {fullName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="order-3 xl:order-2">
            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
              {fullName}
            </h4>

            <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
             <p className="text-sm text-gray-500 dark:text-gray-400">
                {jobTitle}
              </p>

              {location && (
                <>
                  <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {location}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}