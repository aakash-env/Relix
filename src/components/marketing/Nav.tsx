"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X, Database, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Security", href: "#security" },
  { label: "FAQ", href: "#faq" },
  { label: "Docs", href: "/docs" },
];

import { RelixLogo } from "@/components/marketing/RelixLogo";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 lg:px-12",
          scrolled
            ? "bg-[#FFFAEB]/85 backdrop-blur-md py-3.5 border-b border-[#EAE3D2]"
            : "bg-transparent py-5"
        )}
      >
        <div className="max-w-[1360px] mx-auto flex items-center justify-between">
          {/* Left: Relix Logo & Wordmark */}
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="Relix home">
            <div className="w-9 h-9 flex items-center justify-center text-[#1B1C15] group-hover:text-[#00674F] transition-colors duration-200 shrink-0">
              <RelixLogo className="w-9 h-9" color="currentColor" />
            </div>
            <span
              className="font-meraki text-2xl font-normal tracking-[-0.02em] text-[#1B1C15] group-hover:text-[#00674F] transition-colors duration-200"
            >
              Relix
            </span>
          </Link>

          {/* Center: Nav links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main menu">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-3.5 py-1.5 rounded-full text-[0.875rem] font-sohne font-normal text-[#5E6156] hover:text-[#1B1C15] hover:bg-[#F2ECE0]/60 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Highlighted Sign in Button */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              asChild
              size="sm"
              className="rounded-full px-5 h-9 bg-[#1B1C15] hover:bg-[#2C2D24] text-[#FFFAEB] shadow-card-sm hover:shadow-card-md text-xs font-sohne font-medium transition-all"
            >
              <Link href="/login">
                Sign in
              </Link>
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-full text-[#1B1C15] hover:bg-[#F2ECE0] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#1B1C15]/30 backdrop-blur-xs md:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="bg-[#FFFAEB] border-b border-[#EAE3D2] px-6 pt-24 pb-8 flex flex-col gap-3 shadow-card-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-[0.95rem] font-sohne text-[#1B1C15] py-2 border-b border-[#F3EDE0]"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-2">
              <Button
                asChild
                className="w-full rounded-full bg-[#1B1C15] text-[#FFFAEB] h-11"
              >
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}