"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";

type ResetStatus = "checking" | "ready" | "invalid" | "success";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [status, setStatus] = useState<ResetStatus>("checking");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function prepareResetSession() {
      setError("");
      setSuccess("");
      setStatus("checking");

      const supabase = createClient();

      const tokenHash = searchParams.get("token_hash");
      const code = searchParams.get("code");

      try {
        if (tokenHash) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: "recovery",
          });

          if (error) {
            setError(error.message);
            setStatus("invalid");
            return;
          }

          setStatus("ready");
          return;
        }

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            setError(error.message);
            setStatus("invalid");
            return;
          }

          setStatus("ready");
          return;
        }

        setError("Invalid or expired reset link. Please request a new one.");
        setStatus("invalid");
      } catch (err) {
        console.error("Reset session error:", err);
        setError("Unable to verify reset link. Please request a new one.");
        setStatus("invalid");
      }
    }

    prepareResetSession();
  }, [searchParams]);

  async function handleResetPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (status !== "ready") {
      setError("Reset session is not ready. Please request a new reset link.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setStatus("success");
    setSuccess("Password updated successfully. Redirecting to login...");

    setTimeout(() => {
      router.push("/login");
    }, 2000);

    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold">
          Reset Password
        </h1>

        {status === "checking" && (
          <div className="mb-4 rounded-lg bg-gray-100 p-3 text-sm text-gray-600">
            Verifying reset link...
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-600">
            {success}
          </div>
        )}

        <form onSubmit={handleResetPassword}>
          <input
            type="password"
            placeholder="New Password"
            className="mb-4 w-full rounded-lg border p-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={status !== "ready" || loading}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="mb-4 w-full rounded-lg border p-3"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={status !== "ready" || loading}
          />

          <button
            type="submit"
            disabled={loading || status !== "ready"}
            className="w-full rounded-lg bg-black py-3 text-white disabled:opacity-60"
          >
            {loading
              ? "Updating..."
              : status === "checking"
              ? "Verifying link..."
              : status === "invalid"
              ? "Request a new reset link"
              : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}