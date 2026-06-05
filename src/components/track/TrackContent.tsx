"use client";

import React, { useState } from "react";
import { FaSearch, FaTruck, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

type TrackingInfo = {
  tracking_number: string;
  status: string;
  service_type: string | null;
  sender_name: string | null;
  receiver_name: string | null;
  receiver_address: string | null;
  origin: string | null;
  destination: string | null;
  estimated_delivery: string | null;
  current_location: string | null;
  package_description: string | null;
  weight: string | null;
  created_at: string;
  tracking_events?: {
    id: string;
    title: string;
    description: string | null;
    location: string | null;
    event_time: string;
  }[];
};

export default function TrackContent() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setTrackingInfo(null);

    const trimmed = trackingNumber.trim();

    if (!trimmed) {
      setError("Please enter a tracking number.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/tracking/${trimmed}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Tracking number not found.");
        return;
      }

      setTrackingInfo(data.tracking);
    } catch (err) {
      console.error("Tracking error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-gray-50 px-5 py-16 md:px-10 mt-20">
      <motion.div
        className="mx-auto flex w-full max-w-6xl flex-col gap-8"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="rounded-3xl bg-white p-6 shadow-xl md:p-10">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-Euclid text-3xl font-bold text-[#1e1e1e] md:text-5xl">
              Track Your Errands & Deliveries
            </h2>

            <p className="mt-4 font-Poppins text-sm font-medium text-gray-500 md:text-lg">
              Enter your tracking number below to view shipment status, current
              location, delivery progress, and estimated delivery date.
            </p>
          </div>

          <form onSubmit={handleTrack} className="mx-auto mt-8 max-w-3xl">
            <div className="flex flex-col gap-3 rounded-2xl bg-gray-100 p-2 sm:flex-row">
              <input
                type="text"
                className="min-h-12 flex-1 rounded-xl bg-white px-5 text-sm font-medium outline-none"
                placeholder="Enter tracking number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />

              <button
                type="submit"
                disabled={loading}
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-yellow-500 px-6 font-Poppins text-sm font-semibold text-white disabled:opacity-60"
              >
                {loading ? "Tracking..." : "Track"}
                <FaSearch />
              </button>
            </div>
          </form>

          {error && (
            <div className="mx-auto mt-6 max-w-3xl rounded-xl bg-red-50 p-4 text-center text-sm font-medium text-red-600">
              {error}
            </div>
          )}
        </div>

        {trackingInfo && (
          <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
            <div className="bg-[#4d148c] p-6 text-white md:p-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-white/80">Tracking number</p>
                  <h3 className="mt-1 text-2xl font-bold">
                    {trackingInfo.tracking_number}
                  </h3>
                </div>

                <div className="rounded-2xl bg-white px-5 py-3 text-[#4d148c]">
                  <p className="text-xs font-semibold uppercase">Status</p>
                  <p className="text-lg font-bold">{trackingInfo.status}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 p-6 md:grid-cols-3 md:p-8">
              <InfoCard
                icon={<FaTruck />}
                title="Current Location"
                value={trackingInfo.current_location || "Not available"}
              />

              <InfoCard
                icon={<FaMapMarkerAlt />}
                title="Destination"
                value={trackingInfo.destination || trackingInfo.receiver_address || "Not available"}
              />

              <InfoCard
                icon={<FaCheckCircle />}
                title="Estimated Delivery"
                value={
                  trackingInfo.estimated_delivery
                    ? new Date(trackingInfo.estimated_delivery).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : "Not available"
                }
              />
            </div>

            <div className="grid gap-6 border-t border-gray-100 p-6 md:grid-cols-2 md:p-8">
              <Detail label="Service Type" value={trackingInfo.service_type} />
              <Detail label="Package" value={trackingInfo.package_description} />
              <Detail label="Weight" value={trackingInfo.weight} />
              <Detail label="Receiver" value={trackingInfo.receiver_name} />
              <Detail label="Origin" value={trackingInfo.origin} />
              <Detail label="Ship To" value={trackingInfo.receiver_address} />
            </div>

            <div className="border-t border-gray-100 p-6 md:p-8">
              <h4 className="mb-6 text-xl font-bold text-gray-900">
                Tracking History
              </h4>

              {trackingInfo.tracking_events?.length ? (
                <div className="space-y-6">
                  {trackingInfo.tracking_events.map((event, index) => (
                    <div key={event.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`h-4 w-4 rounded-full ${
                            index === 0 ? "bg-green-500" : "bg-gray-300"
                          }`}
                        />
                        {index !== trackingInfo.tracking_events!.length - 1 && (
                          <div className="mt-2 h-full w-px bg-gray-200" />
                        )}
                      </div>

                      <div className="pb-2">
                        <p className="font-semibold text-gray-900">
                          {event.title}
                        </p>
                        {event.description && (
                          <p className="mt-1 text-sm text-gray-500">
                            {event.description}
                          </p>
                        )}
                        <p className="mt-2 text-xs font-medium text-gray-400">
                          {event.location || "Location unavailable"} •{" "}
                          {new Date(event.event_time).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No tracking history available yet.
                </p>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
        {icon}
      </div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="mt-1 font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p className="mt-1 font-medium text-gray-900">{value || "—"}</p>
    </div>
  );
}