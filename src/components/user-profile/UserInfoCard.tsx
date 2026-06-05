"use client";

import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { createClient } from "@/lib/supabase";

type Profile = {
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  job_title: string | null;
};

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    job_title: "",
    phone: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setPageLoading(false);
      return;
    }

    setUserId(user.id);

    const { data, error } = await supabase
      .from("profiles")
      .select(
        "first_name,last_name,full_name,email,phone,job_title"
      )
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Profile fetch error:", error.message);
      setPageLoading(false);
      return;
    }

    setProfile(data);

    setFormData({
      first_name: data.first_name || "",
      last_name: data.last_name || "",
      phone: data.phone || "",
      job_title: data.job_title || "",
    });

    setPageLoading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    const supabase = createClient();

    const fullName = `${formData.first_name} ${formData.last_name}`.trim();

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: formData.first_name,
        last_name: formData.last_name,
        full_name: fullName,
        phone: formData.phone,
        job_title: formData.job_title,
      })
      .eq("id", userId);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess("Profile updated successfully.");
    await fetchProfile();
    window.dispatchEvent(new Event("profile-updated"));
    setLoading(false);
    closeModal();
  }

  // const role = profile?.role
  //   ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
  //   : "Employee";

  if (pageLoading) {
    return (
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading personal information...
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          {success && (
            <p className="mb-4 text-sm text-green-600">{success}</p>
          )}

          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <Info label="First Name" value={profile?.first_name} />
            <Info label="Last Name" value={profile?.last_name} />
            <Info label="Email address" value={profile?.email} />
            <Info label="Phone" value={profile?.phone} />
            <Info
            label="Job Title"
            value={profile?.job_title || "Not Assigned"}
          />
          </div>
        </div>

        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          Edit
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[560px] m-4">
        <div className="relative w-full rounded-3xl bg-white p-5 dark:bg-gray-900 lg:p-7">
          <div className="mb-5 pr-10">
            <h4 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Update your personal details.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <Label>First Name</Label>
                <Input
                  name="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>Last Name</Label>
                <Input
                  name="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>Phone</Label>
                <Input
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>

              <Button size="sm" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div>
      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
        {value || "Not provided"}
      </p>
    </div>
  );
}