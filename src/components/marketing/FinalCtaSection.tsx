import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { marketingAssets } from "@/config/marketing-assets";

export function FinalCtaSection() {
  return (
    <section className="py-14 md:py-20 bg-[#FFFAEB] border-t border-[#EAE3D2]" aria-label="Call to action">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Full-width rounded card with Littlebird sunlit window & sky background */}
        <div className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-[#183B6B] text-white p-8 sm:p-12 md:p-16 lg:p-20 shadow-card-lg border border-black/10">
          
          {/* Full Sunlit Background Image */}
          <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
            <Image
              src={marketingAssets.ctaBackground}
              alt=""
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
              className="object-cover object-right md:object-center"
            />
          </div>

          {/* Left-side subtle shadow scrim to ensure 100% text legibility */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 md:via-black/25 to-transparent pointer-events-none"
            aria-hidden="true"
          />

          {/* Left-Aligned High-Impact Content */}
          <div className="relative z-10 max-w-[560px]">
            <h2
              className="font-meraki text-4xl sm:text-5xl md:text-[54px] lg:text-[62px] font-normal text-white leading-[1.08] tracking-[-0.02em] mb-4 drop-shadow-xs"
            >
              Save hours of
              <br />
              work for free
            </h2>

            <p className="text-white/90 text-sm sm:text-base md:text-lg leading-relaxed font-sohne mb-8 max-w-[460px] drop-shadow-xs">
              You&apos;re 60 seconds away from synthesizing realistic, relational datasets.
              Connect your schema and generate production-grade seed data with zero broken links.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
              <Button
                asChild
                size="lg"
                className="rounded-full px-7 h-12 bg-[#FFFAEB] hover:bg-white text-[#1B1C15] font-semibold shadow-card-md hover:shadow-card-lg transition-all text-sm font-sohne active:scale-95 cursor-pointer"
                id="final-cta-btn"
              >
                <Link href="/signup" className="flex items-center gap-2.5">
                  <Sparkles className="h-4 w-4 text-[#00674F]" />
                  <span>Start Generating Free</span>
                </Link>
              </Button>
            </div>

            <p className="text-xs text-white/75 font-sohne">
              Free to start &bull; PostgreSQL, Drizzle ORM, Prisma &amp; SQL INSERTs
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}