"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true); // Always show success — anti-enumeration
  };

  if (submitted) {
    return (
      <div className="text-center py-2">
        <div className="w-14 h-14 rounded-full bg-[#eef2ff] flex items-center justify-center mx-auto mb-4">
          <Mail className="h-7 w-7 text-[#6366f1]" />
        </div>
        <h2 className="text-xl font-semibold text-[#1c1a18] mb-2">Check your email</h2>
        <p className="text-sm text-[#6b6460] mb-6 max-w-[300px] mx-auto">
          If an account exists for that address, we&apos;ve sent password reset instructions.
        </p>
        <Link href="/login" className="flex items-center justify-center gap-2 text-sm text-[#6366f1] hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <>
      <Link href="/login" className="flex items-center gap-1.5 text-sm text-[#6b6460] hover:text-[#1c1a18] mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to sign in
      </Link>
      <h1 className="text-2xl font-semibold text-[#1c1a18] mb-1">Reset your password</h1>
      <p className="text-sm text-[#6b6460] mb-7">
        Enter your email and we&apos;ll send reset instructions.
      </p>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <Input
          id="forgot-email"
          name="email"
          type="email"
          label="Email address"
          autoComplete="email"
          placeholder="you@example.com"
          leftIcon={<Mail className="h-4 w-4" />}
          required
        />
        <Button type="submit" className="w-full" loading={loading} id="forgot-submit">
          {loading ? "Sending…" : "Send reset link"}
        </Button>
      </form>
    </>
  );
}
