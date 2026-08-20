"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    setResending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setResending(false);
    setResent(true);
    setTimeout(() => setResent(false), 5000);
  };

  return (
    <div className="text-center py-2">
      <div className="w-14 h-14 rounded-full bg-[#e0e7ff] flex items-center justify-center mx-auto mb-4">
        <Mail className="h-7 w-7 text-[#4338ca]" />
      </div>
      <h1 className="text-2xl font-semibold text-[#1c1a18] mb-2">Verify your email</h1>
      <p className="text-sm text-[#6b6460] mb-6 leading-relaxed">
        We&apos;ve sent a verification email to your registered address. Please click the link in the message to activate your Relix account.
      </p>

      {resent && (
        <div role="status" className="bg-[#eef3ec] border border-[#d4e5d0] rounded-lg px-4 py-3 mb-5 text-sm text-[#2c4f38] flex items-center justify-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-[#4a7c59]" />
          A fresh verification link has been sent to your inbox.
        </div>
      )}

      <div className="flex flex-col gap-3">
        <Button
          onClick={handleResend}
          variant="outline"
          className="w-full"
          loading={resending}
          id="verify-resend"
        >
          <RefreshCw className="h-4 w-4" />
          {resending ? "Sending link…" : "Resend verification email"}
        </Button>

        <Button asChild variant="ghost" className="w-full" id="verify-back-login">
          <Link href="/login">Back to sign in</Link>
        </Button>
      </div>

      <p className="text-xs text-[#c8c0b4] mt-8">
        Didn&apos;t receive anything? Check your spam folder or contact{" "}
        <a href="mailto:support@relix.dev" className="text-[#6366f1] underline">
          support@relix.dev
        </a>
      </p>
    </div>
  );
}
