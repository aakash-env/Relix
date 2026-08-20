"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(null);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="text-center py-6 font-sohne">
        <div className="w-14 h-14 rounded-full bg-[#E6F4EF] flex items-center justify-center mx-auto mb-4 border border-[#00674F]/20">
          <CheckCircle2 className="h-7 w-7 text-[#00674F]" />
        </div>
        <h2 className="font-meraki text-2xl font-light text-[#1B1C15] mb-2">Password updated</h2>
        <p className="text-xs sm:text-sm text-[#5E6156] mb-6 max-w-[320px] mx-auto leading-relaxed">
          Your credentials have been securely updated. You can now log in.
        </p>
        <Link
          href="/login"
          className="w-full h-11 rounded-xl bg-[#1B1C15] hover:bg-[#00674F] text-[#FFFAEB] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
        >
          <span>Continue to log in</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[460px] mx-auto font-sohne">
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-xs text-[#5E6156] hover:text-[#1B1C15] mb-6 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to log in</span>
      </Link>

      <div className="mb-6">
        <h1 className="font-meraki text-3xl sm:text-4xl font-light text-[#1B1C15] tracking-tight mb-2">
          Set new password
        </h1>
        <p className="text-xs sm:text-sm text-[#5E6156]">
          Must be at least 8 characters with a mix of letters and numbers.
        </p>
      </div>

      {error && (
        <div role="alert" className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 mb-4 text-xs text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#1B1C15] mb-1.5" htmlFor="new-password">
            New password
          </label>
          <div className="relative">
            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-11 px-3.5 pr-10 rounded-xl border border-[#EAE3D2] bg-[#FFFDF5] text-sm text-[#1B1C15] placeholder-[#828579] focus:outline-none focus:border-[#00674F] focus:ring-1 focus:ring-[#00674F] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#828579] hover:text-[#1B1C15] transition-colors p-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1B1C15] mb-1.5" htmlFor="confirm-password">
            Confirm new password
          </label>
          <input
            id="confirm-password"
            type={showPassword ? "text" : "password"}
            placeholder="Repeat new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full h-11 px-3.5 rounded-xl border border-[#EAE3D2] bg-[#FFFDF5] text-sm text-[#1B1C15] placeholder-[#828579] focus:outline-none focus:border-[#00674F] focus:ring-1 focus:ring-[#00674F] transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl bg-[#1B1C15] hover:bg-[#00674F] text-[#FFFAEB] font-semibold text-sm transition-all duration-200 shadow-2xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
        >
          <span>{loading ? "Updating password..." : "Update password"}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}