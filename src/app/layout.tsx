import type { Metadata, Viewport } from "next";
import { Fraunces, Newsreader, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-meraki",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sohne",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Relix — The Quiet Relational Seed Engine for AI SaaS",
    template: "%s | Relix",
  },
  description:
    "Generate realistic, relational database seed data from your schema — connected users, organizations, AI conversations, token usage, and billing records in under 300ms.",
  keywords: [
    "database seed data",
    "seed generator",
    "TypeScript seed script",
    "Drizzle ORM",
    "Prisma",
    "PostgreSQL",
    "test data",
    "mock data",
    "developer tools",
    "AI SaaS database",
  ],
  authors: [{ name: "Relix" }],
  creator: "Relix",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://relix.dev",
    siteName: "Relix",
    title: "Relix — The Quiet Relational Seed Engine for AI SaaS",
    description:
      "Generate realistic, relational database seed data from your schema — connected users, organizations, AI conversations, and billing records in under 300ms.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Relix — Database Seed Generator",
    description:
      "Generate realistic, relational seed data for your AI SaaS database.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFFAEB",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${fraunces.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col antialiased bg-[#FFFAEB] text-[#1B1C15]"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}