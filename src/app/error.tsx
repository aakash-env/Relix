"use client";

import React, { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Relix Runtime Error]:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FFFAEB] flex items-center justify-center p-6 font-sohne">
      <div className="max-w-md w-full text-center space-y-4">
        <span className="font-mono text-xs font-bold bg-red-50 text-red-700 px-3 py-1 rounded-full border border-red-200">
          500 Error
        </span>
        <h1 className="font-meraki text-4xl text-[#1B1C15] font-light tracking-tight">
          Something went wrong
        </h1>
        <p className="text-xs text-[#5E6156]">
          An unexpected error occurred. You can reload the view or return to safety.
        </p>
        <div className="pt-3 flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="px-4 py-2.5 rounded-xl bg-[#1B1C15] hover:bg-[#00674F] text-[#FFFAEB] text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            Try again
          </button>
          <a
            href="/"
            className="px-4 py-2.5 rounded-xl border border-[#EAE3D2] bg-white hover:bg-[#FAF7EE] text-[#1B1C15] text-xs font-semibold shadow-2xs transition-colors"
          >
            Return Home
          </a>
        </div>
      </div>
    </div>
  );
}
