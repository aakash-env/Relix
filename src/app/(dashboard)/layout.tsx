"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, FolderOpen, User, Shield, Key, CreditCard, BookOpen } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { cn } from "@/lib/utils";

const mobileNav = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Projects", href: "/projects", icon: <FolderOpen className="h-4 w-4" /> },
  { label: "Profile", href: "/settings/profile", icon: <User className="h-4 w-4" /> },
  { label: "Security", href: "/settings/security", icon: <Shield className="h-4 w-4" /> },
  { label: "API Keys", href: "/settings/api-keys", icon: <Key className="h-4 w-4" /> },
  { label: "Billing", href: "/settings/billing", icon: <CreditCard className="h-4 w-4" /> },
  { label: "Docs", href: "/docs", icon: <BookOpen className="h-4 w-4" /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden bg-[#faf8f4]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between px-4 h-14 border-b border-[#c8c0b4] bg-[#faf8f4] shrink-0 z-30">
          <Link href="/dashboard" className="flex items-center gap-2" aria-label="Relix dashboard">
            <div className="w-7 h-7 rounded-md bg-[#6366f1] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M4 3h6a4 4 0 0 1 4 4 4 4 0 0 1-2.5 3.7L14.5 15H11l-2.5-4H7v4H4V3zm3 2v4h3a2 2 0 0 0 0-4H7z" fill="white" />
              </svg>
            </div>
            <span className="font-semibold text-[#1c1a18]">Relix</span>
          </Link>
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#6b6460] hover:bg-[#e8e4dc] transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>

        {/* Mobile drawer backdrop */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Mobile drawer */}
        <nav
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 bg-[#1c1a18] flex flex-col transition-transform duration-300 md:hidden",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
          aria-label="Mobile navigation"
        >
          <div className="flex items-center justify-between px-4 h-14 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-[#6366f1] flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M4 3h6a4 4 0 0 1 4 4 4 4 0 0 1-2.5 3.7L14.5 15H11l-2.5-4H7v4H4V3zm3 2v4h3a2 2 0 0 0 0-4H7z" fill="white" />
                </svg>
              </div>
              <span className="font-semibold text-white">Relix</span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-0.5">
            {mobileNav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    active
                      ? "bg-[#6366f1]/15 text-white"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="shrink-0" aria-hidden="true">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="px-4 pb-4 border-t border-white/10 pt-3">
            <div className="flex items-center gap-2.5 px-2 py-2">
              <div className="w-7 h-7 rounded-full bg-[#6366f1] flex items-center justify-center text-xs font-bold text-white shrink-0">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">Alice Chen</p>
                <p className="text-[0.65rem] text-white/30 truncate">alice@example.com</p>
              </div>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main
          id="dashboard-main"
          className="flex-1 overflow-y-auto"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
