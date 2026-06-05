"use client";

import React, { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { FaSignInAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";
import logoBlack from "../../../public/images/logoo.png";
import Link from "next/link";

type UserRole = "admin" | "manager" | "employee";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    const supabase = createClient();

    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (loginError) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    const user = loginData.user;

    if (!user) {
      setError("User not found.");
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

   if (profileError || !profile) {
    console.error("Profile error:", profileError);
    setError(profileError?.message || "User profile not found. Please contact admin.");
    setLoading(false);
    return;
  }

   const role = String(profile.role || "").trim().toLowerCase();

    if (role === "admin" || role === "manager" || role === "employee") {
      await supabase
        .from("profiles")
        .update({
          is_online: true,
          last_seen: new Date().toISOString(),
        })
        .eq("id", user.id);

      setSuccess("Login successful");
      router.push("/dashboard");
      return;
    }

    setSuccess("");
    setError(`Unauthorized role: ${profile.role || "No role found"}`);
    await supabase.auth.signOut();
    setLoading(false);
  }


  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-28">
      <div className="max-w-7xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12 w-full">
          <div className="flex justify-center items-center">
            <Image src={logoBlack} alt="logo_image" className="w-20" />
          </div>

          <div className="mt-12 flex flex-col items-center">
            {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
            {success && (
              <p className="text-orange-500 text-sm mb-3">{success}</p>
            )}

            <div className="w-full flex-1 mt-8">
              <form className="mx-auto max-w-xs" onSubmit={handleLogin}>
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <div className="relative">
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer absolute inset-y-0 right-0 flex items-center mt-5 justify-center px-8 text-gray-600"
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </div>
                </div>

                <button
                  className={`mt-5 tracking-wide gap-2 cursor-pointer font-semibold text-white w-full py-4 rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none ${
                    loading
                      ? "bg-black cursor-not-allowed"
                      : "bg-black hover:bg-black"
                  }`}
                  disabled={loading}
                >
                  <FaSignInAlt color="white" />
                  {loading ? "Signing In..." : "Sign In"}
                </button>

                <Link
                  href="/forgot-password"
                  className="mt-4 block text-sm text-black hover:underline w-full text-center"
                >
                  Forgot password?
                </Link>

                <p className="mt-6 text-xs text-gray-600 text-center">
                  I agree to abide by Errandly247{" "}
                  <a href="/terms-of-service" className="border-b border-gray-500 border-dotted">
                    Terms of Service
                  </a>{" "}
                  and its{" "}
                  <a href="/privacy-policy" className="border-b border-gray-500 border-dotted">
                    Privacy Policy
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>

        <div className="flex-1 hidden lg:flex rounded-r-xl overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/loginpics.jpeg')",
          }}
        />
      </div>
      </div>
    </div>
  );
}