"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CommandPalette } from "./CommandPalette";
import {
  LayoutDashboard,
  FolderOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Zap,
  LogOut,
  User,
  Key,
  CreditCard,
  Shield,
  Sun,
  Moon,
  Command,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const mainNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Projects", href: "/projects", icon: <FolderOpen className="h-4 w-4" /> },
];

const settingsNav: NavItem[] = [
  { label: "Profile", href: "/settings/profile", icon: <User className="h-4 w-4" /> },
  { label: "Security", href: "/settings/security", icon: <Shield className="h-4 w-4" /> },
  { label: "API Keys", href: "/settings/api-keys", icon: <Key className="h-4 w-4" /> },
  { label: "Billing", href: "/settings/billing", icon: <CreditCard className="h-4 w-4" /> },
];

function SidebarLogo({ collapsed }: { collapsed: boolean }) {
  return (
    <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#2c2a28] transition-colors" aria-label="Relix dashboard">
      <div className="w-7 h-7 rounded-md bg-[#6366f1] flex items-center justify-center shrink-0">
        <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M4 3h6a4 4 0 0 1 4 4 4 4 0 0 1-2.5 3.7L14.5 15H11l-2.5-4H7v4H4V3zm3 2v4h3a2 2 0 0 0 0-4H7z" fill="white" />
        </svg>
      </div>
      {!collapsed && (
        <span className="font-semibold text-white tracking-tight">Relix</span>
      )}
    </Link>
  );
}

function NavLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const pathname = usePathname();
  const active = pathname === item.href || pathname.startsWith(item.href + "/");
  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400",
        active
          ? "bg-[#6366f1]/15 text-white"
          : "text-white/50 hover:text-white hover:bg-white/5"
      )}
      aria-current={active ? "page" : undefined}
    >
      <span className="shrink-0" aria-hidden="true">{item.icon}</span>
      {!collapsed && <span>{item.label}</span>}
      {!collapsed && item.badge && (
        <span className="ml-auto text-xs bg-[#6366f1]/20 text-indigo-300 px-1.5 py-0.5 rounded-full">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export function Sidebar() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
    <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    <aside
      className={cn(
        "hidden md:flex flex-col h-full bg-[#1c1a18] border-r border-white/5 transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
      aria-label="Sidebar navigation"
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-3 h-14 border-b border-white/5 shrink-0">
        <SidebarLogo collapsed={collapsed} />
        <button
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="w-7 h-7 rounded-md flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Workspace switcher */}
      {!collapsed && (
        <div className="px-3 pt-3">
          <button className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg border border-white/10 text-white/60 hover:border-white/20 hover:text-white transition-colors text-sm">
            <div className="w-5 h-5 rounded bg-[#4a7c59] flex items-center justify-center text-[10px] font-bold text-white">A</div>
            {!collapsed && <span className="flex-1 text-left truncate text-xs">Acme Corp</span>}
            <ChevronRight className="h-3 w-3 ml-auto opacity-50" />
          </button>
        </div>
      )}

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-0.5">
        {/* Command shortcut */}
        {!collapsed && (
          <button
            onClick={() => setCmdOpen(true)}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors mb-2 border border-white/5"
            aria-label="Open command palette"
            title="⌘K"
          >
            <Command className="h-4 w-4" aria-hidden="true" />
            <span className="flex-1 text-left">Search…</span>
            <kbd className="text-[0.65rem] px-1.5 py-0.5 rounded border border-white/10 bg-white/5">⌘K</kbd>
          </button>
        )}

        {mainNav.map((item) => (
          <NavLink key={item.href} item={item} collapsed={collapsed} />
        ))}

        {/* Separator */}
        {!collapsed && (
          <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-white/20 px-3 mt-4 mb-2">
            Settings
          </p>
        )}
        {collapsed && <div className="h-px bg-white/5 my-2" />}

        {settingsNav.map((item) => (
          <NavLink key={item.href} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-3 border-t border-white/5 pt-3 flex flex-col gap-1">
        {/* Usage indicator */}
        {!collapsed && (
          <div className="px-3 py-3 rounded-lg bg-white/5 mb-2">
            <div className="flex items-center justify-between text-xs text-white/40 mb-1.5">
              <span>Generations this month</span>
              <span>3 / 10</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full w-[30%] rounded-full bg-[#6366f1]" />
            </div>
            <Link href="/settings/billing" className="text-[0.7rem] text-indigo-400 hover:text-indigo-300 mt-1.5 block">
              Upgrade to Pro →
            </Link>
          </div>
        )}

        {/* Docs */}
        <NavLink item={{ label: "Docs", href: "/docs", icon: <BookOpen className="h-4 w-4" /> }} collapsed={collapsed} />

        {/* Theme toggle */}
        <button
          onClick={() => setDarkMode((d) => !d)}
          title={collapsed ? "Toggle theme" : undefined}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors"
        >
          {darkMode ? <Sun className="h-4 w-4 shrink-0" /> : <Moon className="h-4 w-4 shrink-0" />}
          {!collapsed && <span>{darkMode ? "Light mode" : "Dark mode"}</span>}
        </button>

        {/* User menu */}
        <button
          onClick={() => router.push("/login")}
          title="Sign out"
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer text-left"
        >
          <div className="w-7 h-7 rounded-full bg-[#6366f1] flex items-center justify-center text-xs font-bold text-white shrink-0">
            A
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">Alice Chen</p>
              <p className="text-[0.65rem] text-white/30 truncate">alice@example.com</p>
            </div>
          )}
          {!collapsed && <LogOut className="h-4 w-4 text-white/30 hover:text-white/60 shrink-0" />}
        </button>
      </div>
    </aside>
    </>
  );
}
