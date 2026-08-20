"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  User,
  Key,
  CreditCard,
  Shield,
  BookOpen,
  Zap,
  Database,
  LogOut,
  ArrowRight,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  group: string;
  action: () => void;
  keywords?: string[];
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const navigate = useCallback(
    (href: string) => {
      router.push(href);
      onClose();
    },
    [router, onClose]
  );

  const allCommands: CommandItem[] = [
    {
      id: "nav-dashboard",
      label: "Dashboard",
      description: "Overview and stats",
      icon: <LayoutDashboard className="h-4 w-4" />,
      group: "Navigate",
      action: () => navigate("/dashboard"),
      keywords: ["home", "overview"],
    },
    {
      id: "nav-projects",
      label: "Projects",
      description: "Manage your projects",
      icon: <FolderOpen className="h-4 w-4" />,
      group: "Navigate",
      action: () => navigate("/projects"),
      keywords: ["schemas", "seeds"],
    },
    {
      id: "nav-profile",
      label: "Profile settings",
      icon: <User className="h-4 w-4" />,
      group: "Navigate",
      action: () => navigate("/settings/profile"),
    },
    {
      id: "nav-security",
      label: "Security settings",
      icon: <Shield className="h-4 w-4" />,
      group: "Navigate",
      action: () => navigate("/settings/security"),
      keywords: ["password", "2fa"],
    },
    {
      id: "nav-api-keys",
      label: "API Keys",
      description: "Manage API access keys",
      icon: <Key className="h-4 w-4" />,
      group: "Navigate",
      action: () => navigate("/settings/api-keys"),
      keywords: ["token", "secret"],
    },
    {
      id: "nav-billing",
      label: "Billing",
      description: "Manage your plan",
      icon: <CreditCard className="h-4 w-4" />,
      group: "Navigate",
      action: () => navigate("/settings/billing"),
      keywords: ["plan", "subscription", "upgrade"],
    },
    {
      id: "nav-docs",
      label: "Documentation",
      icon: <BookOpen className="h-4 w-4" />,
      group: "Navigate",
      action: () => navigate("/docs"),
      keywords: ["help", "guide", "reference"],
    },
    {
      id: "action-new-project-ai",
      label: "New project with AI SaaS preset",
      description: "Start with a ready-made 12-table schema",
      icon: <Zap className="h-4 w-4" />,
      group: "Actions",
      action: () => navigate("/projects?preset=ai-saas"),
      keywords: ["create", "start", "template"],
    },
    {
      id: "action-schema-p1",
      label: "Edit schema — AI SaaS Dashboard",
      icon: <Database className="h-4 w-4" />,
      group: "Actions",
      action: () => navigate("/projects/p1/schema"),
    },
    {
      id: "action-generate-p1",
      label: "Generate seed data — AI SaaS Dashboard",
      icon: <Zap className="h-4 w-4" />,
      group: "Actions",
      action: () => navigate("/projects/p1/generate"),
      keywords: ["run", "create data"],
    },
    {
      id: "action-export-p1",
      label: "Export — AI SaaS Dashboard",
      icon: <ArrowRight className="h-4 w-4" />,
      group: "Actions",
      action: () => navigate("/projects/p1/export"),
      keywords: ["download", "drizzle", "prisma", "sql"],
    },
    {
      id: "account-logout",
      label: "Sign out",
      icon: <LogOut className="h-4 w-4" />,
      group: "Account",
      action: () => navigate("/login"),
      keywords: ["logout", "exit"],
    },
  ];

  const filtered = query.trim()
    ? allCommands.filter((cmd) => {
        const q = query.toLowerCase();
        return (
          cmd.label.toLowerCase().includes(q) ||
          cmd.description?.toLowerCase().includes(q) ||
          cmd.keywords?.some((k) => k.includes(q)) ||
          cmd.group.toLowerCase().includes(q)
        );
      })
    : allCommands;

  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[activeIndex]?.action();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-active="true"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  if (!open) return null;

  let flatIndex = 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-xl mx-4 rounded-2xl border border-white/10 bg-[#1c1a18] shadow-2xl overflow-hidden">
        {/* Search */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
          <Search className="h-4 w-4 text-white/30 shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search commands and pages…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-white placeholder:text-white/30 text-sm focus:outline-none"
            aria-autocomplete="list"
            aria-controls="command-list"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="text-white/30 hover:text-white/60 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <kbd className="text-[0.65rem] text-white/20 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 shrink-0">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div
          ref={listRef}
          id="command-list"
          role="listbox"
          className="max-h-80 overflow-y-auto py-2"
        >
          {filtered.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-white/30">
              No results for &ldquo;{query}&rdquo;
            </p>
          ) : (
            Object.entries(grouped).map(([group, items]) => (
              <div key={group}>
                <p className="px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-widest text-white/25">
                  {group}
                </p>
                {items.map((item) => {
                  const idx = flatIndex++;
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={item.id}
                      role="option"
                      aria-selected={isActive}
                      data-active={isActive}
                      onClick={item.action}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                        isActive ? "bg-white/[0.08] text-white" : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                      )}
                    >
                      <span
                        className={cn(
                          "shrink-0 transition-colors",
                          isActive ? "text-[#6366f1]" : "text-white/30"
                        )}
                        aria-hidden="true"
                      >
                        {item.icon}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="text-sm block truncate">{item.label}</span>
                        {item.description && (
                          <span className="text-xs text-white/30 truncate block">
                            {item.description}
                          </span>
                        )}
                      </span>
                      {isActive && (
                        <kbd className="text-[0.6rem] text-white/20 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 shrink-0">
                          ↵
                        </kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-4 py-2.5 border-t border-white/10 text-[0.65rem] text-white/20">
          <span><kbd className="px-1 rounded border border-white/10">↑↓</kbd> navigate</span>
          <span><kbd className="px-1 rounded border border-white/10">↵</kbd> select</span>
          <span><kbd className="px-1 rounded border border-white/10">Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
