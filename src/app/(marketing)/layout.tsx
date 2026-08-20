import type { Metadata } from "next";
import { Nav } from "@/components/marketing/Nav";

export const metadata: Metadata = {
  title: {
    template: "%s | Relix",
    default: "Relix — Generate Realistic Seed Data for Your Database",
  },
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
    </>
  );
}
