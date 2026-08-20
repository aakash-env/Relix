"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function PasswordStrengthBar({ password }: { password: string }) {
  const strength = (() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return Math.min(score, 4);
  })();

  const label = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const colors = ["", "bg-red-500", "bg-amber-400", "bg-[#4a7c59]", "bg-[#6366f1]"];

  if (!password) return null;
  return (
    <div className="mt-1.5">
      <div className="flex gap-1 mb-1" aria-hidden="true">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= strength ? colors[strength] : "bg-[#e8e4dc]"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-[#6b6460]" aria-live="polite">
        Password strength: <strong>{label}</strong>
      </p>
    </div>
  );
}

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const pw = String(data.get("password") ?? "");
    const confirm = String(data.get("confirm") ?? "");
    const terms = data.get("terms") === "on";

    const newErrors: Record<string, string> = {};
    if (!name) newErrors.name = "Name is required.";
    if (!email.includes("@")) newErrors.email = "Enter a valid email address.";
    if (pw.length < 8) newErrors.password = "Password must be at least 8 characters.";
    if (pw !== confirm) newErrors.confirm = "Passwords do not match.";
    if (!terms) newErrors.terms = "You must accept the terms to continue.";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-4">
        <div className="w-14 h-14 rounded-full bg-[#d4e5d0] flex items-center justify-center mx-auto mb-4">
          <svg className="h-7 w-7 text-[#4a7c59]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-[#1c1a18] mb-2">Check your email</h2>
        <p className="text-sm text-[#6b6460] mb-5">
          We&apos;ve sent a verification link to your email address. Click the link to activate your
          account.
        </p>
        <div className="flex flex-col gap-2 mt-4">
          <Button asChild className="w-full" id="signup-continue-dashboard">
            <Link href="/dashboard">
              Continue to Dashboard →
            </Link>
          </Button>
          <Link href="/login" className="text-sm text-[#6366f1] hover:underline mt-2">
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-[#1c1a18] mb-1">Create your account</h1>
      <p className="text-sm text-[#6b6460] mb-7">
        Free forever. No credit card required.
      </p>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          id="signup-name"
          name="name"
          type="text"
          label="Full name"
          autoComplete="name"
          placeholder="Alice Chen"
          error={errors.name}
          leftIcon={<User className="h-4 w-4" />}
          required
        />

        <Input
          id="signup-email"
          name="email"
          type="email"
          label="Email address"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email}
          leftIcon={<Mail className="h-4 w-4" />}
          required
        />

        <div>
          <Input
            id="signup-password"
            name="password"
            type={showPassword ? "text" : "password"}
            label="Password"
            autoComplete="new-password"
            placeholder="8+ characters"
            error={errors.password}
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
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <PasswordStrengthBar password={password} />
        </div>

        <Input
          id="signup-confirm"
          name="confirm"
          type={showPassword ? "text" : "password"}
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          error={errors.confirm}
          leftIcon={<Lock className="h-4 w-4" />}
          required
        />

        {/* Terms */}
        <div>
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              name="terms"
              id="signup-terms"
              className="w-4 h-4 mt-0.5 rounded border-[#c8c0b4] accent-indigo-500 shrink-0"
            />
            <span className="text-sm text-[#6b6460]">
              I agree to the{" "}
              <Link href="/terms" className="text-[#6366f1] hover:underline">Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy" className="text-[#6366f1] hover:underline">Privacy Policy</Link>.
            </span>
          </label>
          {errors.terms && (
            <p className="text-xs text-red-600 mt-1 ml-6" role="alert">{errors.terms}</p>
          )}
        </div>

        <Button type="submit" className="w-full mt-1" loading={loading} id="signup-submit">
          {loading ? "Creating account…" : "Create free account"}
        </Button>
      </form>

      <p className="text-center text-sm text-[#6b6460] mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-[#6366f1] hover:underline font-medium">Sign in</Link>
      </p>
    </>
  );
}
