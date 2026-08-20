"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="text-center py-4">
        <div className="w-14 h-14 rounded-full bg-[#d4e5d0] flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-7 w-7 text-[#4a7c59]" />
        </div>
        <h2 className="text-xl font-semibold text-[#1c1a18] mb-2">Password reset successful</h2>
        <p className="text-sm text-[#6b6460] mb-6">
          Your password has been updated. You can now log in with your new credentials.
        </p>
        <Button asChild className="w-full" id="reset-success-login">
          <Link href="/login">
            Continue to sign in
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-[#1c1a18] mb-1">Set new password</h1>
      <p className="text-sm text-[#6b6460] mb-7">
        Please choose a strong password with at least 8 characters.
      </p>

      {error && (
        <div role="alert" className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-5 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          id="new-password"
          name="password"
          type={showPassword ? "text" : "password"}
          label="New password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="h-4 w-4" />}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="text-[#6b6460] hover:text-[#1c1a18] transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          required
        />

        <Input
          id="confirm-password"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          label="Confirm new password"
          placeholder="Repeat new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          leftIcon={<Lock className="h-4 w-4" />}
          required
        />

        <Button type="submit" className="w-full mt-2" loading={loading} id="reset-password-submit">
          {loading ? "Updating password…" : "Reset password"}
        </Button>
      </form>

      <p className="text-center text-sm text-[#6b6460] mt-6">
        Remembered your credentials?{" "}
        <Link href="/login" className="text-[#6366f1] hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </>
  );
}
