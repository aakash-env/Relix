import React from "react";
import Link from "next/link";
import { RelixLogo } from "@/components/marketing/RelixLogo";
import { ArrowRight } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[#FFFAEB] grid lg:grid-cols-2 relative overflow-hidden">
      
      {/* ── Background Ambient Warm Glows ───────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-32 -left-20 w-[650px] h-[400px] rounded-full opacity-35 blur-[110px]"
          style={{ background: "radial-gradient(circle, #F8A5A5 0%, #F59E0B 40%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-32 -right-20 w-[650px] h-[400px] rounded-full opacity-25 blur-[120px]"
          style={{ background: "radial-gradient(circle, #00674F 0%, #3ECF8E 40%, transparent 70%)" }}
        />
      </div>

      {/* ── Left Visual Panel (Exact 50% Width on Large Screens) ────────── */}
      <div className="p-3 sm:p-4 md:p-6 lg:p-7 flex flex-col relative z-10 w-full">
        <div className="w-full h-full min-h-[380px] lg:min-h-[calc(100vh-3.5rem)] rounded-[2.25rem] relative overflow-hidden flex flex-col justify-between p-6 sm:p-10 lg:p-14 text-white bg-[#16221E] shadow-card-lg border border-black/10 select-none">
          
          {/* Background Landscape Artwork with Atmospheric Dark Scrim */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/hero-bg.jpg')",
              backgroundPosition: "center 65%",
            }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#16221E]/95 via-[#16221E]/60 to-[#16221E]/75 pointer-events-none"
            aria-hidden="true"
          />

          {/* Top Header inside Left Card */}
          <div className="relative z-10 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group" aria-label="Relix home">
              <div className="w-8 h-8 flex items-center justify-center text-white shrink-0">
                <RelixLogo className="w-8 h-8" color="currentColor" />
              </div>
              <span className="font-meraki text-2xl text-white font-medium tracking-tight">
                Relix
              </span>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-sohne text-white backdrop-blur-md transition-all shadow-2xs"
            >
              <span>Back to website</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Bottom Narrative & Carousel Indicators inside Left Card */}
          <div className="relative z-10 space-y-4 pt-16">
            <h2 className="font-meraki text-3xl sm:text-4xl lg:text-[44px] font-light text-white leading-[1.08] tracking-tight max-w-[480px]">
              Synthesizing Records,
              <br />
              <span className="font-normal text-[#C5F74F]">
                Simplifying Databases.
              </span>
            </h2>
            <p className="text-sm sm:text-base text-white/80 font-sohne leading-relaxed max-w-[420px]">
              Deterministic relational test fixtures for modern AI SaaS applications with zero broken foreign keys.
            </p>

            {/* Slide Indicator Pills */}
            <div className="flex items-center gap-2 pt-3">
              <div className="w-8 h-1.5 rounded-full bg-[#C5F74F]" />
              <div className="w-2.5 h-1.5 rounded-full bg-white/40" />
              <div className="w-2.5 h-1.5 rounded-full bg-white/40" />
            </div>
          </div>

        </div>
      </div>

      {/* ── Right Authentication Form Panel (Exact 50% Width on Large Screens) ── */}
      <div className="flex flex-col justify-center items-center px-6 sm:px-12 md:px-16 lg:px-20 xl:px-24 py-8 lg:py-12 relative z-10 min-h-screen w-full">
        <div className="w-full max-w-[440px] my-auto">
          {children}
        </div>
      </div>

    </div>
  );
}