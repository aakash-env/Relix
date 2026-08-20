import React from "react";
import Link from "next/link";
import { RelixLogo } from "@/components/marketing/RelixLogo";
import { ArrowRight, CheckCircle2 } from "lucide-react";

// Social Icons
function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer
      className="relative bg-[#FFFAEB] border-t border-[#EAE3D2] pt-20 pb-64 overflow-hidden"
      aria-label="Site footer"
    >
      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        
        {/* ── Main Footer Columns (Leedlime Layout) ───────────────────────── */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 pb-16">
          
          {/* Left Brand Column (5 cols) */}
          <div className="lg:col-span-5 max-w-[420px]">
            {/* Brand Logo & Name */}
            <Link href="/" className="inline-flex items-center gap-2.5 group mb-6" aria-label="Relix home">
              <div className="w-8 h-8 flex items-center justify-center text-[#1B1C15] group-hover:text-[#00674F] transition-colors shrink-0">
                <RelixLogo className="w-8 h-8" color="currentColor" />
              </div>
              <span className="font-meraki text-2xl font-medium tracking-tight text-[#1B1C15] group-hover:text-[#00674F] transition-colors">
                Relix
              </span>
            </Link>

            {/* Tagline Description */}
            <p className="text-[14px] text-[#5E6156] font-sohne leading-relaxed mb-6 font-normal">
              Synthesize realistic, relational test data for your AI SaaS database in under 300ms.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 text-[#5E6156] mb-8">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="hover:text-[#1B1C15] transition-colors p-1"
              >
                <XIcon />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-[#1B1C15] transition-colors p-1"
              >
                <LinkedInIcon />
              </a>
            </div>

            {/* Live System Status Pill */}
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#5E6156]">
              <span className="w-2 h-2 rounded-full bg-[#00674F] animate-pulse" />
              <span>All services are online</span>
            </div>
          </div>

          {/* Right 3 Link Columns (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            
            {/* Column 1: PRODUCT */}
            <div>
              <p className="text-[0.7rem] font-bold uppercase tracking-widest text-[#828579] mb-4 font-mono">
                Product
              </p>
              <ul className="space-y-3 font-sohne text-xs">
                <li>
                  <Link href="#features" className="text-[#5E6156] hover:text-[#1B1C15] transition-colors">
                    Seed Engine
                  </Link>
                </li>
                <li>
                  <Link href="#features" className="text-[#5E6156] hover:text-[#1B1C15] transition-colors">
                    Dependency DAG
                  </Link>
                </li>
                <li>
                  <Link href="#features" className="text-[#5E6156] hover:text-[#1B1C15] transition-colors">
                    Foreign Key Pool
                  </Link>
                </li>
                <li>
                  <Link href="#features" className="text-[#5E6156] hover:text-[#1B1C15] transition-colors">
                    Mulberry32 PRNG
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="text-[#5E6156] hover:text-[#1B1C15] transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: COMPANY */}
            <div>
              <p className="text-[0.7rem] font-bold uppercase tracking-widest text-[#828579] mb-4 font-mono">
                Company
              </p>
              <ul className="space-y-3 font-sohne text-xs">
                <li>
                  <Link href="#features" className="text-[#5E6156] hover:text-[#1B1C15] transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="text-[#5E6156] hover:text-[#1B1C15] transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#security" className="text-[#5E6156] hover:text-[#1B1C15] transition-colors">
                    Security Center
                  </Link>
                </li>
                <li>
                  <a href="mailto:support@relix.dev" className="text-[#5E6156] hover:text-[#1B1C15] transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: LEGAL */}
            <div>
              <p className="text-[0.7rem] font-bold uppercase tracking-widest text-[#828579] mb-4 font-mono">
                Legal
              </p>
              <ul className="space-y-3 font-sohne text-xs">
                <li>
                  <Link href="/privacy" className="text-[#5E6156] hover:text-[#1B1C15] transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-[#5E6156] hover:text-[#1B1C15] transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* ── Bottom Meta Bar (Copyright Left) ──────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[#EAE3D2]/70 text-xs text-[#828579] font-sohne">
          <p suppressHydrationWarning>
            &copy; 2026 Relix, Inc. All rights reserved.
          </p>
        </div>

      </div>

      {/* ── Bottom Pastoral Watercolor Landscape Artwork ──────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none select-none z-0"
        aria-hidden="true"
      >
        {/* Landscape Image */}
        <div
          className="absolute inset-0 bg-no-repeat bg-cover"
          style={{
            backgroundImage: "url('/images/hero-bg.jpg')",
            backgroundPosition: "center 95%",
          }}
        />

        {/* Soft Gradient Overlay at Top of Image to blend into #FFFAEB */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, #FFFAEB 0%, rgba(255, 250, 235, 0.75) 25%, transparent 70%)",
          }}
        />
      </div>
    </footer>
  );
}