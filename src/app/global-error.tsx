"use client";

import React from "react";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FFFAEB] text-[#1B1C15] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-4">
          <span className="text-xs font-mono font-bold bg-red-100 text-red-700 px-3 py-1 rounded-full border border-red-200">
            System Error
          </span>
          <h1 className="text-3xl font-serif text-[#1B1C15]">Something went wrong</h1>
          <p className="text-xs text-[#5E6156]">
            An unexpected error occurred. Please try again.
          </p>
          <div className="pt-2">
            <button
              onClick={() => reset()}
              className="px-4 py-2 rounded-xl bg-[#1B1C15] text-[#FFFAEB] text-xs font-semibold hover:bg-[#00674F] transition-colors cursor-pointer"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
