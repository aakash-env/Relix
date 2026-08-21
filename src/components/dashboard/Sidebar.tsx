"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { RelixLogo } from "@/components/marketing/RelixLogo";
import { CommandPalette } from "./CommandPalette";
import {
  LayoutDashboard,
  FolderOpen,
  LayoutTemplate,
  Activity,
  User,
  Shield,
  Key,
  CreditCard,
  BookOpen,
  Sun,
  Moon,
  Search,
  ChevronDown,
  Building2,
  Check,
  Sparkles,
  Command,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const primaryNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Projects", href: "/projects", icon: <FolderOpen className="h-4 w-4" />, badge: "3" },
  { label: "Templates", href: "/schema", icon: <LayoutTemplate className="h-4 w-4" /> },
  { label: "Activity", href: "/dashboard#activity", icon: <Activity className="h-4 w-4" /> },
];

const settingsNav: NavItem[] = [
  { label: "Profile", href: "/settings/profile", icon: <User className="h-4 w-4" /> },
  { label: "Security", href: "/settings/security", icon: <Shield className="h-4 w-4" /> },
  { label: "API Keys", href: "/settings/api-keys", icon: <Key className="h-4 w-4" /> },
  { label: "Billing", href: "/settings/profile", icon: <CreditCard className="h-4 w-4" /> },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState("Acme Corp");
  const [userName, setUserName] = useState("Alice");
  const [userEmail, setUserEmail] = useState("alice@acme.com");

  useEffect(() => {
    try {
      const storedEmail = localStorage.getItem("relix_user_email");
      const storedName = localStorage.getItem("relix_user_name");
      if (storedEmail) setUserEmail(storedEmail);
      if (storedName) setUserName(storedName.split(" ")[0]);
    } catch {}

    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleSignOut = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem("relix_logged_in");
      localStorage.removeItem("relix_user_email");
      localStorage.removeItem("relix_user_name");
      localStorage.removeItem("relix_user_plan");
    } catch {}
    router.push("/login");
  };

  return (
    <>
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />

      <aside
        className="w-64 bg-[#FBF8EF] border-r border-[#EAE3D2] flex flex-col justify-between p-4 select-none shrink-0 font-sohne min-h-screen sticky top-0"
        aria-label="Application Sidebar"
      >
        {/* ── Top Section ──────────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Logo */}
          <div className="px-2 py-1 flex items-center gap-2">
            <RelixLogo className="w-5 h-5 text-[#1B1C15]" color="currentColor" />
            <span className="font-meraki text-xl font-medium tracking-tight text-[#1B1C15]">
              Relix
            </span>
          </div>

          {/* Workspace Selector */}
          <div className="relative">
            <button
              onClick={() => setWorkspaceOpen(!workspaceOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-[#EAE3D2] text-xs font-semibold text-[#1B1C15] hover:border-[#1B1C15]/40 transition-colors shadow-2xs cursor-pointer"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-5 h-5 rounded-md bg-[#4F46E5]/10 text-[#4F46E5] flex items-center justify-center shrink-0">
                  <Building2 className="h-3 w-3" />
                </div>
                <span className="truncate">{currentWorkspace}</span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-[#828579]" />
            </button>

            {workspaceOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#EAE3D2] rounded-xl shadow-lg p-1 z-30 space-y-0.5 text-xs">
                {["Acme Corp", "Vortex Labs", "Personal Sandbox"].map((ws) => (
                  <button
                    key={ws}
                    onClick={() => {
                      setCurrentWorkspace(ws);
                      setWorkspaceOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left hover:bg-[#FAF7EE] text-[#1B1C15] cursor-pointer"
                  >
                    <span>{ws}</span>
                    {currentWorkspace === ws && <Check className="h-3 w-3 text-[#4F46E5]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Command Search Bar */}
          <button
            onClick={() => setCmdOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-[#EAE3D2] text-xs text-[#828579] hover:text-[#1B1C15] hover:border-[#1B1C15]/40 transition-colors shadow-2xs cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5" />
              <span>Quick command</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-[#FAF7EE] border border-[#EAE3D2] font-mono text-[0.65rem] text-[#5E6156]">
              ⌘K
            </kbd>
          </button>

          {/* Primary Navigation */}
          <nav className="space-y-1 pt-1">
            {primaryNav.map((item) => {
              const active = pathname === item.href || (item.href === "/dashboard" && pathname === "/dashboard");
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all",
                    active
                      ? "bg-[#4F46E5]/10 text-[#4F46E5] font-semibold border border-[#4F46E5]/20 shadow-xs"
                      : "text-[#5E6156] hover:text-[#1B1C15] hover:bg-black/5"
                  )}
                >
                  {active && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-[#4F46E5]" />
                  )}
                  <span className={active ? "text-[#4F46E5]" : "text-[#828579]"}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto px-1.5 py-0.2 rounded-full bg-[#FAF7EE] text-[#5E6156] text-[0.65rem] font-mono border border-[#EAE3D2]">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Settings Navigation Group */}
          <div className="pt-2">
            <p className="text-[0.65rem] font-bold text-[#828579] tracking-wider uppercase font-mono px-3 mb-1.5">
              Settings
            </p>
            <div className="space-y-0.5">
              {settingsNav.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium text-[#5E6156] hover:text-[#1B1C15] hover:bg-black/5 transition-colors"
                >
                  <span className="text-[#828579]">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom Section: Docs, Theme, User Profile ───────────────────── */}
        <div className="pt-4 border-t border-[#EAE3D2] space-y-3">
          {/* Docs & Theme Switcher */}
          <div className="flex items-center justify-between px-1">
            <Link
              href="/docs"
              className="flex items-center gap-2 text-xs font-medium text-[#5E6156] hover:text-[#1B1C15] transition-colors"
            >
              <BookOpen className="h-3.5 w-3.5 text-[#828579]" />
              <span>Docs</span>
            </Link>

            {/* Compact Theme Switcher */}
            <div className="flex items-center p-0.5 rounded-full bg-[#EAE3D2]/70 border border-[#EAE3D2]">
              <button
                onClick={() => setDarkMode(false)}
                className={cn(
                  "p-1 rounded-full text-xs transition-colors cursor-pointer",
                  !darkMode ? "bg-white text-[#1B1C15] shadow-2xs" : "text-[#828579]"
                )}
                title="Light mode"
              >
                <Sun className="h-3 w-3" />
              </button>
              <button
                onClick={() => setDarkMode(true)}
                className={cn(
                  "p-1 rounded-full text-xs transition-colors cursor-pointer",
                  darkMode ? "bg-[#1B1C15] text-white shadow-2xs" : "text-[#828579]"
                )}
                title="Dark mode"
              >
                <Moon className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* User Profile Card & Sign out */}
          <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-black/5 transition-colors group">
            <Link
              href="/settings/profile"
              className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-[#00674F] text-white flex items-center justify-center text-xs font-bold shrink-0 uppercase shadow-2xs">
                {userName ? userName.charAt(0) : "A"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#1B1C15] leading-tight truncate group-hover:text-[#00674F] transition-colors">
                  {userName || "Alice"}
                </p>
                <p className="text-[0.65rem] text-[#828579] truncate">
                  {userEmail || currentWorkspace}
                </p>
              </div>
            </Link>

            <button
              onClick={handleSignOut}
              title="Sign out of Relix"
              className="p-1.5 rounded-lg text-[#828579] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer shrink-0 ml-1"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}