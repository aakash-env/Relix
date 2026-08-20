import type { Metadata } from "next";
import { Nav } from "@/components/marketing/Nav";
import { HeroSection } from "@/components/marketing/HeroSection";
import { FeatureStorySection } from "@/components/marketing/FeatureStorySection";
import { SocialProofSection } from "@/components/marketing/SocialProofSection";
import { SecuritySection } from "@/components/marketing/SecuritySection";
import { FaqSection } from "@/components/marketing/FaqSection";
import { FinalCtaSection } from "@/components/marketing/FinalCtaSection";
import { Footer } from "@/components/marketing/Footer";

export const metadata: Metadata = {
  title: "Relix — The Quiet Relational Seed Engine for AI SaaS",
  description:
    "Generate realistic, relational seed data for your AI SaaS database — connected users, organizations, conversations, token telemetry, and billing records in under 300ms.",
};

export default function HomePage() {
  return (
    <>
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-[#00674F] focus:text-white focus:px-5 focus:py-2.5 focus:rounded-full focus:text-xs focus:font-medium shadow-card-md"
      >
        Skip to main content
      </a>

      {/* Sticky Top Navigation */}
      <Nav />

      {/* Main Narrative Page Flow */}
      <main id="main-content">
        <HeroSection />
        <FeatureStorySection />
        <SocialProofSection />
        <SecuritySection />
        <FaqSection />
        <FinalCtaSection />
      </main>

      {/* Footer with Giant Watermark */}
      <Footer />
    </>
  );
}