import React from "react";
import Link from "next/link";
import { RelixLogo } from "@/components/marketing/RelixLogo";

function AuthLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 mb-8 group" aria-label="Relix home">
      <div className="w-9 h-9 flex items-center justify-center text-[#1B1C15] group-hover:text-[#00674F] transition-colors shrink-0">
        <RelixLogo className="w-9 h-9" color="currentColor" />
      </div>
      <span className="font-meraki text-2xl font-normal tracking-tight text-[#1B1C15] group-hover:text-[#00674F] transition-colors">
        Relix
      </span>
    </Link>
  );
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FFFAEB] flex flex-col items-center justify-center px-4 py-12">
      {/* Card */}
      <div className="w-full max-w-[420px]">
        <div className="flex justify-center">
          <AuthLogo />
        </div>
        <div className="bg-white rounded-3xl shadow-card-lg border border-[#EAE3D2] p-8">
          {children}
        </div>
        {/* Footer */}
        <p className="text-center text-xs text-[#828579] mt-6 font-sohne">
          By using Relix you agree to our{" "}
          <Link href="/terms" className="underline hover:text-[#1B1C15]">Terms</Link>
          {" "}and{" "}
          <Link href="/privacy" className="underline hover:text-[#1B1C15]">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
