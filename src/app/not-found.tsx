import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FFFAEB] flex items-center justify-center p-6 font-sohne">
      <div className="max-w-md w-full text-center space-y-4">
        <span className="font-mono text-xs font-bold bg-[#E6F4EF] text-[#00674F] px-3 py-1 rounded-full border border-[#00674F]/20">
          404 Not Found
        </span>
        <h1 className="font-meraki text-4xl text-[#1B1C15] font-light tracking-tight">
          Page not found
        </h1>
        <p className="text-xs text-[#5E6156]">
          The page you requested does not exist or has been moved.
        </p>
        <div className="pt-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B1C15] hover:bg-[#00674F] text-[#FFFAEB] text-xs font-semibold shadow-2xs transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Relix</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
