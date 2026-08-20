"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Sparkles, ArrowRight } from "lucide-react";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.87c.61-.74 1.03-1.77.91-2.87-.91.04-2.02.61-2.66 1.35-.56.64-.99 1.68-.86 2.72 1.02.08 2.01-.52 2.61-1.2" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: typeof errors = {};
    if (!email.includes("@")) newErrors.email = "Enter a valid email address.";
    if (password.length < 6) newErrors.password = "Password must be at least 6 characters.";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    router.push("/dashboard");
  };

  return (
    <div className="w-full max-w-[460px] mx-auto font-sohne">
      {/* ── Title & Switch Mode ─────────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="font-meraki text-3xl sm:text-4xl font-light text-[#1B1C15] tracking-tight mb-2">
          Log in to Relix
        </h1>
        <p className="text-xs sm:text-sm text-[#5E6156]">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[#00674F] hover:underline font-semibold">
            Sign up
          </Link>
        </p>
      </div>

      {/* Form error alert */}
      {errors.form && (
        <div role="alert" className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 mb-4 text-xs text-red-700">
          {errors.form}
        </div>
      )}

      {/* ── Login Form ─────────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Email Input */}
        <div>
          <label className="block text-xs font-semibold text-[#1B1C15] mb-1.5" htmlFor="login-email">
            Email address
          </label>
          <div className="relative">
            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full h-11 px-3.5 rounded-xl border bg-[#FFFDF5] text-sm text-[#1B1C15] placeholder-[#828579] focus:outline-none transition-all ${
                errors.email
                  ? "border-red-400 focus:border-red-500 ring-1 ring-red-400"
                  : "border-[#EAE3D2] focus:border-[#00674F] focus:ring-1 focus:ring-[#00674F]"
              }`}
            />
          </div>
          {errors.email && <p className="text-[0.7rem] text-red-600 mt-1">{errors.email}</p>}
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-xs font-semibold text-[#1B1C15] mb-1.5" htmlFor="login-password">
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full h-11 px-3.5 pr-10 rounded-xl border bg-[#FFFDF5] text-sm text-[#1B1C15] placeholder-[#828579] focus:outline-none transition-all ${
                errors.password
                  ? "border-red-400 focus:border-red-500 ring-1 ring-red-400"
                  : "border-[#EAE3D2] focus:border-[#00674F] focus:ring-1 focus:ring-[#00674F]"
              }`}
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
          {errors.password && <p className="text-[0.7rem] text-red-600 mt-1">{errors.password}</p>}
        </div>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <label className="flex items-center gap-2 text-[#5E6156] cursor-pointer select-none">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 rounded border-[#D4CDBC] accent-[#00674F]"
            />
            <span>Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-[#00674F] hover:underline font-medium"
          >
            Forgot password?
          </Link>
        </div>

        {/* Primary CTA Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl bg-[#1B1C15] hover:bg-[#00674F] text-[#FFFAEB] font-semibold text-sm transition-all duration-200 shadow-2xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
        >
          <span>{loading ? "Signing in..." : "Log in"}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      {/* ── Divider ────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 my-6" aria-hidden="true">
        <div className="flex-1 h-px bg-[#EAE3D2]" />
        <span className="text-[0.7rem] text-[#828579] font-mono uppercase tracking-wider">Or continue with</span>
        <div className="flex-1 h-px bg-[#EAE3D2]" />
      </div>

      {/* ── Social OAuth Buttons ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleDemoSignIn}
          className="h-11 rounded-xl border border-[#EAE3D2] bg-[#FAF7EE] hover:bg-white hover:border-[#1B1C15] text-xs font-semibold text-[#1B1C15] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
        >
          <GoogleIcon className="h-4 w-4" />
          <span>Google</span>
        </button>
        <button
          type="button"
          onClick={handleDemoSignIn}
          className="h-11 rounded-xl border border-[#EAE3D2] bg-[#FAF7EE] hover:bg-white hover:border-[#1B1C15] text-xs font-semibold text-[#1B1C15] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
        >
          <AppleIcon className="h-4 w-4" />
          <span>Apple</span>
        </button>
      </div>

      {/* Legal Footer Note */}
      <p className="text-center text-[0.7rem] text-[#828579] mt-6">
        By signing in you agree to our{" "}
        <Link href="/terms" className="underline hover:text-[#1B1C15]">Terms</Link>
        {" "}and{" "}
        <Link href="/privacy" className="underline hover:text-[#1B1C15]">Privacy Policy</Link>.
      </p>
    </div>
  );
}