import React from "react";
import Link from "next/link";
import { RelixLogo } from "@/components/marketing/RelixLogo";
import { ArrowRight } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FFFAEB] flex items-center justify-center p-3 sm:p-6 md:p-10 relative overflow-hidden">
      
      {/* ── Background Ambient Warm Glows ───────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-24 -left-20 w-[500px] h-[300px] rounded-full opacity-30 blur-[90px]"
          style={{ background: "radial-gradient(circle, #F8A5A5 0%, #F59E0B 40%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-20 -right-20 w-[500px] h-[300px] rounded-full opacity-20 blur-[100px]"
          style={{ background: "radial-gradient(circle, #00674F 0%, #3ECF8E 40%, transparent 70%)" }}
        />
      </div>

      {/* ── Main Split-Card Auth Frame ─────────────────────────────────── */}
      <div className="w-full max-w-[1040px] rounded-[2rem] bg-white border border-[#EAE3D2] shadow-card-lg p-3 sm:p-4 md:p-5 grid lg:grid-cols-12 gap-6 lg:gap-8 items-stretch relative z-10 overflow-hidden">
        
        {/* ── Left Visual Panel (5 cols) ─────────────────────────────────── */}
        <div className="lg:col-span-5 rounded-[1.6rem] relative overflow-hidden flex flex-col justify-between p-6 sm:p-8 text-white min-h-[380px] lg:min-h-[580px] bg-[#16221E] select-none">
          
          {/* Background Landscape Artwork with Atmospheric Dark Scrim */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/hero-bg.jpg')",
            }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#16221E]/95 via-[#16221E]/60 to-[#16221E]/80 pointer-events-none"
            aria-hidden="true"
          />

          {/* Top Header inside Left Card */}
          <div className="relative z-10 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group" aria-label="Relix home">
              <div className="w-7 h-7 flex items-center justify-center text-white shrink-0">
                <RelixLogo className="w-7 h-7" color="currentColor" />
              </div>
              <span className="font-meraki text-xl text-white font-medium tracking-tight">
                Relix
              </span>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-sohne text-white backdrop-blur-md transition-all"
            >
              <span>Back to website</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Bottom Narrative & Carousel Indicators inside Left Card */}
          <div className="relative z-10 space-y-4 pt-12">
            <h2 className="font-meraki text-2xl sm:text-3xl lg:text-[32px] font-light text-white leading-tight tracking-tight">
              Synthesizing Records,
              <br />
              <span className="font-normal text-[#C5F74F]">
                Simplifying Databases.
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-white/80 font-sohne leading-relaxed max-w-[340px]">
              Realistic, relational test datasets with zero foreign key crashes in under 300ms.
            </p>

            {/* Slide Indicator Pills */}
            <div className="flex items-center gap-1.5 pt-2">
              <div className="w-6 h-1 rounded-full bg-[#C5F74F]" />
              <div className="w-2 h-1 rounded-full bg-white/40" />
              <div className="w-2 h-1 rounded-full bg-white/40" />
            </div>
          </div>

        </div>

        {/* ── Right Authentication Form Panel (7 cols) ───────────────────── */}
        <div className="lg:col-span-7 flex flex-col justify-center px-3 sm:px-6 md:px-8 py-4 sm:py-6">
          {children}
        </div>

      </div>

    </div>
  );
}