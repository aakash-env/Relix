"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("alice@example.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});

  const handleDemoSignIn = async () => {
    setEmail("alice@example.com");
    setPassword("password123");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    router.push("/dashboard");
  };

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
    await new Promise((r) => setTimeout(r, 800));
    router.push("/dashboard");
  };

  return (
    <>
      <h1 className="text-2xl font-semibold text-[#1c1a18] mb-1">Welcome back</h1>
      <p className="text-sm text-[#6b6460] mb-7">Sign in to your Relix account.</p>

      {/* OAuth buttons — UI only for now */}
      <div className="flex flex-col gap-3 mb-6">
        <button
          type="button"
          aria-label="Continue with GitHub"
          disabled
          className="flex items-center justify-center gap-3 w-full h-10 rounded-lg border border-[#c8c0b4] text-sm font-medium text-[#3d3a36] hover:bg-[#f4f0e8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="GitHub OAuth — coming soon"
        >
          <GithubIcon className="h-4 w-4" />
          Continue with GitHub
          <span className="ml-auto text-[0.65rem] text-[#c8c0b4]">coming soon</span>
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-6" aria-hidden="true">
        <div className="flex-1 h-px bg-[#c8c0b4]" />
        <span className="text-xs text-[#c8c0b4]">or</span>
        <div className="flex-1 h-px bg-[#c8c0b4]" />
      </div>

      {/* Demo Credentials Box */}
      <div className="bg-[#eef3ec] border border-[#d4e5d0] rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2c4f38]">
            <Sparkles className="h-3.5 w-3.5 text-[#4a7c59]" />
            Demo Credentials
          </div>
          <button
            type="button"
            onClick={handleDemoSignIn}
            className="text-xs font-medium text-[#4a7c59] hover:text-[#2c4f38] underline"
          >
            1-Click Sign In →
          </button>
        </div>
        <p className="text-xs text-[#3d3a36] font-mono">Email: <strong>alice@example.com</strong></p>
        <p className="text-xs text-[#3d3a36] font-mono">Password: <strong>password123</strong></p>
      </div>

      {/* Form error */}
      {errors.form && (
        <div role="alert" className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-5 text-sm text-red-700">
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          id="login-email"
          name="email"
          type="email"
          label="Email address"
          autoComplete="email"
          placeholder="alice@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          leftIcon={<Mail className="h-4 w-4" />}
          required
        />

        <Input
          id="login-password"
          name="password"
          type={showPassword ? "text" : "password"}
          label="Password"
          autoComplete="current-password"
          placeholder="password123"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          required
        />

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-[#6b6460] cursor-pointer">
            <input
              type="checkbox"
              name="remember"
              id="login-remember"
              defaultChecked
              className="w-4 h-4 rounded border-[#c8c0b4] accent-indigo-500"
            />
            Remember me
          </label>
          <Link
            href="/forgot-password"
            className="text-sm text-[#6366f1] hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full mt-1"
          loading={loading}
          id="login-submit"
        >
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="text-center text-sm text-[#6b6460] mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-[#6366f1] hover:underline font-medium">
          Create one free
        </Link>
      </p>
    </>
  );
}
