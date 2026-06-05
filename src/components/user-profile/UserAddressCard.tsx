"use client";

import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { createClient } from "@/lib/supabase";

type AddressProfile = {
  country: string | null;
  city_state: string | null;
  postal_code: string | null;
};

export default function UserAddressCard() {
  const { isOpen, openModal, closeModal } = useModal();

  const [profile, setProfile] = useState<AddressProfile | null>(null);
  const [userId, setUserId] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    country: "",
    city_state: "",
    postal_code: "",
  });

  useEffect(() => {
    fetchAddress();
  }, []);

  async function fetchAddress() {
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
    .select("country,city_state,postal_code")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Address fetch error:", error.message);
    setPageLoading(false);
    return;
  }

  if (!data) {
    setPageLoading(false);
    return;
  }

  setProfile(data);

  setFormData({
    country: data.country || "",
    city_state: data.city_state || "",
    postal_code: data.postal_code || "",
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

    const { error } = await supabase
      .from("profiles")
      .update({
        country: formData.country,
        city_state: formData.city_state,
        postal_code: formData.postal_code,
      })
      .eq("id", userId);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess("Address updated successfully.");
    await fetchAddress();

    window.dispatchEvent(new Event("profile-updated"));

    setLoading(false);
    closeModal();
  }

  if (pageLoading) {
    return (
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading address...
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Address
            </h4>

            {success && (
              <p className="mb-4 text-sm text-green-600">{success}</p>
            )}

            {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <Info label="Country" value={profile?.country} />
              <Info label="City / State" value={profile?.city_state} />
              <Info label="Postal Code" value={profile?.postal_code} />
            </div>
          </div>

          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            Edit
          </button>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Address
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your address details.
            </p>
          </div>

          <form onSubmit={handleSave} className="flex flex-col">
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Country</Label>
                  <Input
                    name="country"
                    type="text"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label>City / State</Label>
                  <Input
                    name="city_state"
                    type="text"
                    value={formData.city_state}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label>Postal Code</Label>
                  <Input
                    name="postal_code"
                    type="text"
                    value={formData.postal_code}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
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
    </>
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