"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <p className="text-sm text-gray-600">Preparing reset page...</p>
    </div>
  );
}

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function exchangeCode() {
      const code = searchParams.get("code");

      if (!code) {
        setError("Invalid or expired reset link. Please request a new one.");
        return;
      }

      const supabase = createClient();

      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        setError(error.message);
        return;
      }

      setSessionReady(true);
    }

    exchangeCode();
  }, [searchParams]);

  async function handleResetPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!sessionReady) {
      setError("Reset session is not ready. Please open the reset link again.");
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

    setSuccess("Password updated successfully.");

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

        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

        {success && (
          <div className="mb-4 text-sm text-green-600">{success}</div>
        )}

        <form onSubmit={handleResetPassword}>
          <input
            type="password"
            placeholder="New Password"
            className="mb-4 w-full rounded-lg border p-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="mb-4 w-full rounded-lg border p-3"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading || !sessionReady}
            className="w-full rounded-lg bg-black py-3 text-white disabled:opacity-60"
          >
            {loading
              ? "Updating..."
              : !sessionReady
              ? "Preparing reset..."
              : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}