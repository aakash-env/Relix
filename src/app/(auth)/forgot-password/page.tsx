"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-6 font-sohne">
        <div className="w-14 h-14 rounded-full bg-[#E6F4EF] flex items-center justify-center mx-auto mb-4 border border-[#00674F]/20">
          <CheckCircle2 className="h-7 w-7 text-[#00674F]" />
        </div>
        <h2 className="font-meraki text-2xl font-light text-[#1B1C15] mb-2">Check your email</h2>
        <p className="text-xs sm:text-sm text-[#5E6156] mb-6 max-w-[340px] mx-auto leading-relaxed">
          If an account exists for <strong>{email || "that address"}</strong>, we&apos;ve sent password reset instructions.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-[#00674F] hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to log in</span>
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
          Reset password
        </h1>
        <p className="text-xs sm:text-sm text-[#5E6156]">
          Enter your registered email address and we&apos;ll send you a recovery link.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#1B1C15] mb-1.5" htmlFor="forgot-email">
            Email address
          </label>
          <input
            id="forgot-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full h-11 px-3.5 rounded-xl border border-[#EAE3D2] bg-[#FFFDF5] text-sm text-[#1B1C15] placeholder-[#828579] focus:outline-none focus:border-[#00674F] focus:ring-1 focus:ring-[#00674F] transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl bg-[#1B1C15] hover:bg-[#00674F] text-[#FFFAEB] font-semibold text-sm transition-all duration-200 shadow-2xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
        >
          <span>{loading ? "Sending link..." : "Send reset link"}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}