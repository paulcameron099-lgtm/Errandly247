"use client";

import React, { useEffect, useState } from "react";

type Tracking = {
  id: string;
  tracking_number: string;
  status: string;
  service_type: string | null;
  receiver_name: string | null;
  destination: string | null;
  current_location: string | null;
  estimated_delivery: string | null;
  created_at: string;
};

export default function AdminTrackingPage() {
  const [trackings, setTrackings] = useState<Tracking[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [eventLoading, setEventLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedTrackingId, setSelectedTrackingId] = useState("");

  const [form, setForm] = useState({
    trackingNumber: "",
    status: "Label Created",
    serviceType: "",
    senderName: "",
    receiverName: "",
    receiverAddress: "",
    origin: "",
    destination: "",
    estimatedDelivery: "",
    currentLocation: "",
    packageDescription: "",
    weight: "",
  });

  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    location: "",
    eventTime: "",
  });

  useEffect(() => {
    fetchTrackings();
  }, []);

  async function fetchTrackings() {
    setLoading(true);

    const res = await fetch("/api/admin/trackings");
    const data = await res.json();

    if (res.ok) {
      setTrackings(data.trackings || []);
    } else {
      setError(data.error || "Failed to load tracking records.");
    }

    setLoading(false);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function handleEventChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setEventForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function createTracking(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setCreating(true);

    const res = await fetch("/api/admin/trackings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to create tracking.");
      setCreating(false);
      return;
    }

    setSuccess("Tracking created successfully.");
    setForm({
      trackingNumber: "",
      status: "Label Created",
      serviceType: "",
      senderName: "",
      receiverName: "",
      receiverAddress: "",
      origin: "",
      destination: "",
      estimatedDelivery: "",
      currentLocation: "",
      packageDescription: "",
      weight: "",
    });

    await fetchTrackings();
    setCreating(false);
  }

  async function addEvent(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedTrackingId) {
      setError("Please select a tracking record.");
      return;
    }

    setError("");
    setSuccess("");
    setEventLoading(true);

    const res = await fetch(
      `/api/admin/trackings/${selectedTrackingId}/events`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...eventForm,
          status: eventForm.title,
          currentLocation: eventForm.location,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to add tracking event.");
      setEventLoading(false);
      return;
    }

    setSuccess("Tracking event added successfully.");
    setEventForm({
      title: "",
      description: "",
      location: "",
      eventTime: "",
    });

    await fetchTrackings();
    setEventLoading(false);
  }

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tracking Management
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Create shipment tracking records and update delivery timeline events.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 rounded-xl bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <form
          onSubmit={createTracking}
          className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
        >
          <h2 className="mb-5 text-lg font-semibold text-gray-900 dark:text-white">
            Create Tracking
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Tracking Number"
              name="trackingNumber"
              value={form.trackingNumber}
              onChange={handleChange}
              placeholder="ERR247123456"
            />

            <Select
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
              options={[
                "Label Created",
                "Picked Up",
                "In Transit",
                "Out for Delivery",
                "Delivered",
                "Delayed",
                "Returned",
              ]}
            />

            <Input
              label="Service Type"
              name="serviceType"
              value={form.serviceType}
              onChange={handleChange}
              placeholder="Home Delivery"
            />

            <Input
              label="Weight"
              name="weight"
              value={form.weight}
              onChange={handleChange}
              placeholder="2.5kg"
            />

            <Input
              label="Sender Name"
              name="senderName"
              value={form.senderName}
              onChange={handleChange}
            />

            <Input
              label="Receiver Name"
              name="receiverName"
              value={form.receiverName}
              onChange={handleChange}
            />

            <Input
              label="Origin"
              name="origin"
              value={form.origin}
              onChange={handleChange}
              placeholder="New York, NY"
            />

            <Input
              label="Destination"
              name="destination"
              value={form.destination}
              onChange={handleChange}
              placeholder="Brooklyn, NY"
            />

            <Input
              label="Current Location"
              name="currentLocation"
              value={form.currentLocation}
              onChange={handleChange}
            />

            <Input
              label="Estimated Delivery"
              name="estimatedDelivery"
              value={form.estimatedDelivery}
              onChange={handleChange}
              type="datetime-local"
            />

            <Textarea
              label="Receiver Address"
              name="receiverAddress"
              value={form.receiverAddress}
              onChange={handleChange}
            />

            <Textarea
              label="Package Description"
              name="packageDescription"
              value={form.packageDescription}
              onChange={handleChange}
            />
          </div>

          <button
            disabled={creating}
            className="mt-6 rounded-xl dark:bg-white bg-black px-5 py-3 text-sm font-semibold text-white dark:text-black disabled:opacity-60"
          >
            {creating ? "Creating..." : "Create Tracking"}
          </button>
        </form>

        <form
          onSubmit={addEvent}
          className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
        >
          <h2 className="mb-5 text-lg font-semibold text-gray-900 dark:text-white">
            Add Timeline Event
          </h2>

          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Select Tracking
              </label>
              <select
                value={selectedTrackingId}
                onChange={(e) => setSelectedTrackingId(e.target.value)}
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="">Select tracking</option>
                {trackings.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.tracking_number} — {item.receiver_name}
                  </option>
                ))}
              </select>
            </div>

            <Select
              label="Event Title"
              name="title"
              value={eventForm.title}
              onChange={handleEventChange}
              options={[
                "Label Created",
                "Picked Up",
                "In Transit",
                "Arrived at Facility",
                "Out for Delivery",
                "Delivered",
                "Delayed",
                "Returned",
              ]}
            />

            <Textarea
              label="Description"
              name="description"
              value={eventForm.description}
              onChange={handleEventChange}
              placeholder="Package arrived at sorting facility."
            />

            <Input
              label="Location"
              name="location"
              value={eventForm.location}
              onChange={handleEventChange}
              placeholder="Queens, NY"
            />

            <Input
              label="Event Time"
              name="eventTime"
              value={eventForm.eventTime}
              onChange={handleEventChange}
              type="datetime-local"
            />
          </div>

          <button
            disabled={eventLoading}
            className="mt-6 w-full rounded-xl bg-yellow-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {eventLoading ? "Adding..." : "Add Event"}
          </button>
        </form>
      </div>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-100 p-5 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Tracking Records
          </h2>
        </div>

        {loading ? (
          <p className="p-6 text-sm text-gray-500">Loading trackings...</p>
        ) : trackings.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">No tracking records yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                <tr>
                  <th className="px-5 py-3">Tracking No.</th>
                  <th className="px-5 py-3">Receiver</th>
                  <th className="px-5 py-3">Destination</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Current Location</th>
                  <th className="px-5 py-3">Created</th>
                </tr>
              </thead>
              <tbody>
                {trackings.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-gray-100 dark:border-gray-800"
                  >
                    <td className="px-5 py-4 font-semibold text-gray-900 dark:text-white">
                      {item.tracking_number}
                    </td>
                    <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                      {item.receiver_name || "—"}
                    </td>
                    <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                      {item.destination || "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                      {item.current_location || "—"}
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      {new Date(item.created_at).toLocaleDateString("en-GB")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm outline-none focus:border-black dark:border-gray-700 dark:bg-gray-800 dark:text-white"
      />
    </div>
  );
}

function Textarea({
  label,
  name,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-black dark:border-gray-700 dark:bg-gray-800 dark:text-white"
      />
    </div>
  );
}

function Select({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm outline-none focus:border-black dark:border-gray-700 dark:bg-gray-800 dark:text-white"
      >
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}