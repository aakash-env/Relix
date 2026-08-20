"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Database,
  Bot,
  Layers,
  CreditCard,
  CheckCircle2,
  User,
  Compass,
  FileCode2,
  GitBranch,
  RefreshCw,
  Copy,
  Check,
  Building2,
  MessageSquare,
  BarChart3,
  ShieldCheck,
  Zap,
  Sparkles,
  ChevronRight,
  Code2,
  CheckCheck,
  Clock,
  Send,
  Sliders,
  FolderTree,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RelixLogo } from "@/components/marketing/RelixLogo";

// Static ray burst hairlines
const RAY_PATH = "M 500 380 L 1250 380 M 500 380 L 1244 478 M 500 380 L 1224 574 M 500 380 L 1193 667 M 500 380 L 1150 755 M 500 380 L 1095 836 M 500 380 L 1030 910 M 500 380 L 956 974 M 500 380 L 875 1029 M 500 380 L 787 1073 M 500 380 L 694 1104 M 500 380 L 598 1124 M 500 380 L 500 1130 M 500 380 L 402 1124 M 500 380 L 306 1104 M 500 380 L 213 1073 M 500 380 L 125 1029 M 500 380 L 44 974 M 500 380 L -30 910 M 500 380 L -95 836 M 500 380 L -150 755 M 500 380 L -193 667 M 500 380 L -224 574 M 500 380 L -244 478 M 500 380 L -250 380 M 500 380 L -244 282 M 500 380 L -224 186 M 500 380 L -193 93 M 500 380 L -150 5 M 500 380 L -95 -76 M 500 380 L -30 -150 M 500 380 L 44 -214 M 500 380 L 125 -269 M 500 380 L 213 -313 M 500 380 L 306 -344 M 500 380 L 402 -364 M 500 380 L 500 -370 M 500 380 L 598 -364 M 500 380 L 694 -344 M 500 380 L 787 -313 M 500 380 L 875 -269 M 500 380 L 956 -214 M 500 380 L 1030 -150 M 500 380 L 1095 -76 M 500 380 L 1150 5 M 500 380 L 1193 93 M 500 380 L 1224 186 M 500 380 L 1244 282";

type ActiveTabKey = "engine" | "dag" | "export";

const TABS: { key: ActiveTabKey; label: string; caption: string }[] = [
  {
    key: "engine",
    label: "Seed Engine",
    caption: "Synthesize 1,000+ realistic relational records in under 300ms.",
  },
  {
    key: "dag",
    label: "DAG Ordering",
    caption: "Topological graph resolver eliminates broken foreign key errors.",
  },
  {
    key: "export",
    label: "TypeScript Code",
    caption: "Ready-to-run Drizzle ORM, Prisma, and SQL INSERT scripts.",
  },
];

export function HeroSection() {
  const [activeTab, setActiveTab] = useState<ActiveTabKey>("engine");
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [copied, setCopied] = useState(false);

  // Engine Scene Interactive States
  const [promptText, setPromptText] = useState("Generate 50 AI SaaS users with 250 multi-turn GPT-4o chats and billing records");
  const [isSimulating, setIsSimulating] = useState(false);
  const [rowsGenerated, setRowsGenerated] = useState(1022);
  const [exportFormat, setExportFormat] = useState<"drizzle" | "prisma" | "sql">("drizzle");

  // Auto-cycle timer
  useEffect(() => {
    if (isPaused) return;

    const intervalTime = 50; // Update progress every 50ms
    const totalDuration = 7000; // 7 seconds per tab
    const step = (intervalTime / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Switch to next tab
          setActiveTab((curr) => {
            if (curr === "engine") return "dag";
            if (curr === "dag") return "export";
            return "engine";
          });
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPaused, activeTab]);

  const handleSelectTab = (key: ActiveTabKey) => {
    setActiveTab(key);
    setProgress(0);
  };

  const handleSimulateRun = () => {
    setIsSimulating(true);
    let count = 0;
    const target = 1022;
    const timer = setInterval(() => {
      count += 128;
      if (count >= target) {
        setRowsGenerated(target);
        setIsSimulating(false);
        clearInterval(timer);
      } else {
        setRowsGenerated(count);
      }
    }, 35);
  };

  const handleCopyCode = () => {
    const code =
      exportFormat === "drizzle"
        ? `import { db } from "./db";\nimport { organizations, users, conversations } from "./schema";\n\nawait db.insert(organizations).values(seedOrganizations);\nawait db.insert(users).values(seedUsers);\nawait db.insert(conversations).values(seedConversations);\nconsole.log("✓ 1,022 rows seeded in 184ms");`
        : exportFormat === "prisma"
          ? `import { PrismaClient } from "@prisma/client";\nconst prisma = new PrismaClient();\n\nawait prisma.organization.createMany({ data: seedOrganizations });\nawait prisma.user.createMany({ data: seedUsers });\nconsole.log("✓ Prisma seed complete");`
          : `BEGIN;\nINSERT INTO organizations (id, name) VALUES ('org_01', 'Acme AI');\nINSERT INTO users (id, org_id, email) VALUES ('usr_01', 'org_01', 'alice@acme.ai');\nCOMMIT;`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      className="relative bg-[#FFFAEB] pt-16 md:pt-20 pb-12 md:pb-16 overflow-hidden"
      aria-label="Hero"
    >
      {/* ── Background Foliage Image & Atmospheric Fades ──────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
        aria-hidden="true"
      >
        {/* Littlebird Watercolor Foliage Background Image */}
        <div
          className="absolute inset-0 bg-no-repeat bg-cover"
          style={{
            backgroundImage: "url('/images/hero-bg.jpg')",
            backgroundPosition: "center 75%",
          }}
        />

        {/* Top Fade Overlay: Ensures headline and navbar readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, #FFFAEB 0%, rgba(255, 250, 235, 0.85) 18%, rgba(255, 250, 235, 0.25) 45%, transparent 65%)",
          }}
        />

        {/* Bottom Fade Overlay: Seamlessly blends into the next section */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, #FFFAEB 0%, rgba(255, 250, 235, 0.85) 15%, rgba(255, 250, 235, 0.2) 40%, transparent 65%)",
          }}
        />

        {/* Subtle Ray-Burst Hairlines */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.06]">
          <svg
            className="w-[1440px] h-[1100px] text-[#1B1C15] animate-rays"
            viewBox="0 0 1000 1000"
            fill="none"
          >
            <path d={RAY_PATH} stroke="currentColor" strokeWidth="0.75" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 max-w-[1360px] mx-auto px-6">
        {/* ── Centered Headline & Copy ───────────────────────────────────── */}
        <div className="text-center max-w-[860px] mx-auto mb-10">
          <h1
            className="font-meraki text-[38px] sm:text-[52px] md:text-[68px] font-light leading-[1.08] tracking-[-0.03em] text-[#1B1C15] mb-6 max-w-[820px] mx-auto"
          >
            Seed everything.
            <br />
            <span className="font-normal text-[#00674F]">
              Break nothing.
            </span>
          </h1>
          <p className="text-[20px] text-[#5E6156] max-w-[660px] mx-auto leading-[1.6] font-sohne font-normal">
            Connect your PostgreSQL schema. Relix builds the relational dependency graph and
            synthesizes coherent users, organizations, AI conversations, token telemetry,
            and billing records in under 300ms.
          </p>
        </div>

        {/* ── Focused Pill CTA Button ────────────────────────────────────── */}
        <div className="flex flex-col items-center justify-center gap-3 mb-16 md:mb-20">
          <Button
            asChild
            size="lg"
            className="rounded-full px-8 h-12 bg-[#1B1C15] hover:bg-[#2C2D24] text-[#FFFAEB] shadow-card-md hover:shadow-card-lg transition-all text-sm font-medium font-sohne"
            id="hero-primary-cta"
          >
            <Link href="/signup" className="flex items-center gap-2">
              <span>Start Generating Free</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* ── Littlebird-Style Interactive App Window Simulation ───────────── */}
        <div
          className="relative max-w-[1080px] mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* ── Tab Bar + Active Caption (Littlebird Header) ─────────────── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 px-2">
            {/* Pill Tabs Container with Animated Progress Bar Fill */}
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/5 border border-black/10 backdrop-blur-md">
              {TABS.map((tab) => {
                const isCurrent = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => handleSelectTab(tab.key)}
                    className={`relative overflow-hidden px-4 sm:px-5 py-2 rounded-full text-xs sm:text-[13.5px] font-medium transition-all cursor-pointer ${isCurrent
                      ? "bg-[#00674F] text-white shadow-xs font-semibold"
                      : "text-[#5E6156] hover:text-[#1B1C15]"
                      }`}
                  >
                    {/* Progress Bar Fill Inside Active Tab */}
                    {isCurrent && (
                      <span
                        className="absolute inset-0 bg-white/15 origin-left pointer-events-none transition-transform"
                        style={{
                          transform: `scaleX(${progress / 100})`,
                          transformOrigin: "left",
                        }}
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Animated Caption on the Right */}
            <div className="text-center sm:text-right">
              <p className="text-xs sm:text-sm text-[#5E6156] font-sohne transition-opacity duration-300">
                {TABS.find((t) => t.key === activeTab)?.caption}
              </p>
            </div>
          </div>

          {/* ── Desktop Window Frame (Exact Littlebird Composition) ──────── */}
          <div className="rounded-[26px] border border-black/15 bg-black/5 p-1.5 backdrop-blur-xs shadow-2xl">
            <div className="rounded-[20px] bg-[#FAF8F3] border border-black/10 flex flex-col md:flex-row min-h-[560px] md:min-h-[620px] overflow-hidden">

              {/* ── Left Sidebar (Mac Desktop App Look) ────────────────────── */}
              <aside className="w-full md:w-[240px] bg-[#F4EFE6] border-b md:border-b-0 md:border-r border-[#EAE3D2] p-4 flex flex-col justify-between shrink-0">
                <div>
                  {/* Top Mac Traffic Dots + Relix Wordmark */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8E1D3]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                      <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                      <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                    </div>
                    <div className="flex items-center gap-2">
                      <RelixLogo className="w-4 h-4" color="#1B1C15" />
                      <span className="font-meraki text-sm font-normal text-[#1B1C15]">Relix</span>
                    </div>
                  </div>

                  {/* Navigation Items */}
                  <nav className="space-y-1 text-xs font-sohne mb-6">
                    <button
                      onClick={() => handleSelectTab("engine")}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors ${activeTab === "engine"
                        ? "bg-white text-[#1B1C15] font-semibold shadow-xs"
                        : "text-[#5E6156] hover:bg-white/50 hover:text-[#1B1C15]"
                        }`}
                    >
                      <Sparkles className="h-3.5 w-3.5 text-[#00674F]" />
                      <span>Seed Engine</span>
                    </button>
                    <button
                      onClick={() => handleSelectTab("dag")}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors ${activeTab === "dag"
                        ? "bg-white text-[#1B1C15] font-semibold shadow-xs"
                        : "text-[#5E6156] hover:bg-white/50 hover:text-[#1B1C15]"
                        }`}
                    >
                      <GitBranch className="h-3.5 w-3.5 text-[#00674F]" />
                      <span>Dependency Graph</span>
                    </button>
                    <button
                      onClick={() => handleSelectTab("export")}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors ${activeTab === "export"
                        ? "bg-white text-[#1B1C15] font-semibold shadow-xs"
                        : "text-[#5E6156] hover:bg-white/50 hover:text-[#1B1C15]"
                        }`}
                    >
                      <FileCode2 className="h-3.5 w-3.5 text-[#00674F]" />
                      <span>TypeScript Exporter</span>
                    </button>
                  </nav>

                  {/* Schema Files List */}
                  <div>
                    <p className="text-[0.68rem] font-bold uppercase tracking-wider text-[#828579] px-3 mb-2 font-sohne">
                      Active Schemas
                    </p>
                    <div className="space-y-1 text-xs font-mono">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/70 text-[#1B1C15] border border-[#EAE3D2]">
                        <Database className="h-3 w-3 text-[#00674F]" />
                        <span className="truncate">ai_saas_v2.sql</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[#5E6156] hover:bg-white/40">
                        <Database className="h-3 w-3 text-[#828579]" />
                        <span className="truncate">b2b_workspaces.sql</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[#5E6156] hover:bg-white/40">
                        <Database className="h-3 w-3 text-[#828579]" />
                        <span className="truncate">ecommerce_billing.sql</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar Footer User Info */}
                <div className="pt-4 border-t border-[#E8E1D3] flex items-center gap-2.5 mt-6">
                  <div className="w-7 h-7 rounded-full bg-[#00674F] text-white flex items-center justify-center font-bold text-xs font-mono">
                    A
                  </div>
                  <div className="min-w-0 font-sohne">
                    <p className="text-xs font-bold text-[#1B1C15] truncate">Alice Jenkins</p>
                    <p className="text-[0.65rem] text-[#828579] truncate">Lead AI Architect</p>
                  </div>
                </div>
              </aside>

              {/* ── Main Interactive Stage (Right Canvas) ──────────────────── */}
              <main className="flex-1 p-6 md:p-8 flex flex-col justify-between bg-[#FAF8F3] overflow-y-auto">

                {/* ── SCENE 1: Seed Engine (Composer + Generated Entity Cards) ── */}
                {activeTab === "engine" && (
                  <div className="space-y-6">
                    {/* Scene Greeting Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-meraki text-2xl md:text-3xl font-light text-[#1B1C15]">
                          Synthesizing AI SaaS records
                        </h3>
                        <p className="text-xs text-[#828579] font-mono mt-1">
                          Deterministic Seed: 42 • Mulberry32 PRNG Algorithm
                        </p>
                      </div>
                      <button
                        onClick={handleSimulateRun}
                        disabled={isSimulating}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#00674F] hover:bg-[#004D3B] text-white text-xs font-medium font-sohne shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-75"
                      >
                        <RefreshCw className={`h-3 w-3 ${isSimulating ? "animate-spin" : ""}`} />
                        <span>{isSimulating ? "Generating..." : "▶ Run Generator"}</span>
                      </button>
                    </div>

                    {/* Interactive Prompt Composer Box (Littlebird Style) */}
                    <div className="rounded-2xl border border-[#EAE3D2] bg-white p-4 shadow-card-sm">
                      <div className="flex items-start gap-2.5">
                        <Sparkles className="h-4 w-4 text-[#00674F] mt-1 shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-[#1B1C15] font-sohne mb-1">
                            Seed Instruction
                          </p>
                          <p className="text-xs sm:text-sm text-[#5E6156] font-sohne leading-relaxed">
                            {promptText}
                          </p>
                        </div>
                        <div className="w-7 h-7 rounded-full bg-[#1B1C15] text-[#FFFAEB] flex items-center justify-center shrink-0">
                          <Send className="h-3 w-3" />
                        </div>
                      </div>

                      {/* Filter Suggestion Chips */}
                      <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-[#F3EDE0]">
                        <button
                          onClick={() => setPromptText("Generate 10 Enterprises with 500 conversations and token billing")}
                          className="px-2.5 py-1 rounded-full text-[0.7rem] bg-[#F4EFE6] hover:bg-[#EAE3D2] text-[#1B1C15] font-mono transition-colors cursor-pointer"
                        >
                          + 10 Organizations
                        </button>
                        <button
                          onClick={() => setPromptText("Synthesize 250 multi-turn GPT-4o chat threads with latency logs")}
                          className="px-2.5 py-1 rounded-full text-[0.7rem] bg-[#F4EFE6] hover:bg-[#EAE3D2] text-[#1B1C15] font-mono transition-colors cursor-pointer"
                        >
                          + Multi-Turn Chats
                        </button>
                        <button
                          onClick={() => setPromptText("Simulate monthly token usage & Stripe invoice charges")}
                          className="px-2.5 py-1 rounded-full text-[0.7rem] bg-[#F4EFE6] hover:bg-[#EAE3D2] text-[#1B1C15] font-mono transition-colors cursor-pointer"
                        >
                          + Token Telemetry
                        </button>
                      </div>
                    </div>

                    {/* 4 Generated Relational Entity Cards */}
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="rounded-xl border border-[#EAE3D2] bg-white p-3.5 shadow-xs hover:border-[#00674F] transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-[#00674F]" />
                            <span className="font-mono text-xs font-bold text-[#1B1C15]">organizations</span>
                          </div>
                          <span className="text-[0.65rem] bg-[#E6F4EF] text-[#00674F] px-2 py-0.5 rounded-full font-bold">
                            10 Orgs
                          </span>
                        </div>
                        <p className="text-[0.72rem] text-[#5E6156] font-mono truncate">Acme AI Labs • Enterprise Scale</p>
                        <p className="text-[0.65rem] text-[#828579] font-mono mt-1">PK: org_01ha • $499/mo</p>
                      </div>

                      <div className="rounded-xl border border-[#EAE3D2] bg-white p-3.5 shadow-xs hover:border-[#00674F] transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-[#00674F]" />
                            <span className="font-mono text-xs font-bold text-[#1B1C15]">users</span>
                          </div>
                          <span className="text-[0.65rem] bg-[#E6F4EF] text-[#00674F] px-2 py-0.5 rounded-full font-bold">
                            50 Users
                          </span>
                        </div>
                        <p className="text-[0.72rem] text-[#5E6156] font-mono truncate">alice@acme.ai • Admin</p>
                        <p className="text-[0.65rem] text-[#828579] font-mono mt-1">FK → org_01ha • bcrypt valid</p>
                      </div>

                      <div className="rounded-xl border border-[#EAE3D2] bg-white p-3.5 shadow-xs hover:border-[#00674F] transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Bot className="h-4 w-4 text-[#00674F]" />
                            <span className="font-mono text-xs font-bold text-[#1B1C15]">conversations</span>
                          </div>
                          <span className="text-[0.65rem] bg-[#E6F4EF] text-[#00674F] px-2 py-0.5 rounded-full font-bold">
                            250 Chats
                          </span>
                        </div>
                        <p className="text-[0.72rem] text-[#5E6156] font-mono truncate">GPT-4o Deep Research (14 turns)</p>
                        <p className="text-[0.65rem] text-[#828579] font-mono mt-1">FK → usr_01ha • 284ms latency</p>
                      </div>

                      <div className="rounded-xl border border-[#EAE3D2] bg-white p-3.5 shadow-xs hover:border-[#00674F] transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-[#00674F]" />
                            <span className="font-mono text-xs font-bold text-[#1B1C15]">invoices & telemetry</span>
                          </div>
                          <span className="text-[0.65rem] bg-[#E6F4EF] text-[#00674F] px-2 py-0.5 rounded-full font-bold">
                            712 Records
                          </span>
                        </div>
                        <p className="text-[0.72rem] text-[#5E6156] font-mono truncate">4,820 tokens • $0.072</p>
                        <p className="text-[0.65rem] text-[#828579] font-mono mt-1">inv_2026_08 • Paid Status</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── SCENE 2: DAG Topological Resolver (Littlebird Meetings Look) ─ */}
                {activeTab === "dag" && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="font-meraki text-2xl md:text-3xl font-light text-[#1B1C15]">
                        Kahn&apos;s DAG Topological Resolver
                      </h3>
                      <p className="text-xs text-[#828579] font-mono mt-1">
                        Ensures parent tables populate first • Zero broken foreign keys
                      </p>
                    </div>

                    <div className="rounded-2xl border border-[#EAE3D2] bg-white p-4 shadow-card-sm space-y-3">
                      {[
                        { step: "Step 1", table: "plans", relation: "Root Entity", count: "3 tiers", status: "Resolved (0 Dependencies)" },
                        { step: "Step 2", table: "organizations", relation: "FK → plans.id", count: "10 orgs", status: "Resolved (Depends on plans)" },
                        { step: "Step 3", table: "users", relation: "FK → organizations.id", count: "50 users", status: "Resolved (Depends on orgs)" },
                        { step: "Step 4", table: "conversations", relation: "FK → users.id, orgs.id", count: "250 chats", status: "Resolved (Depends on users)" },
                      ].map((row, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-xl border border-[#EAE3D2] bg-[#FFFDF5] font-mono text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-5 h-5 rounded-full bg-[#1B1C15] text-white flex items-center justify-center font-bold text-[0.65rem]">
                              {idx + 1}
                            </span>
                            <div>
                              <span className="font-bold text-[#1B1C15]">{row.table}</span>
                              <span className="text-[0.68rem] text-[#828579] ml-2">({row.relation})</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[0.7rem] text-[#00674F] font-bold bg-[#E6F4EF] px-2 py-0.5 rounded-full">
                              {row.count}
                            </span>
                            <CheckCheck className="h-4 w-4 text-[#00674F]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── SCENE 3: TypeScript Exporter (Littlebird Routines Look) ── */}
                {activeTab === "export" && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-meraki text-2xl md:text-3xl font-light text-[#1B1C15]">
                          Type-Safe Production Exporters
                        </h3>
                        <p className="text-xs text-[#828579] font-mono mt-1">
                          Export to Drizzle ORM, Prisma, or PostgreSQL SQL
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-[#F4EFE6] p-1 rounded-full text-xs font-mono">
                        {(["drizzle", "prisma", "sql"] as const).map((fmt) => (
                          <button
                            key={fmt}
                            onClick={() => setExportFormat(fmt)}
                            className={`px-2.5 py-1 rounded-full text-[0.7rem] transition-colors cursor-pointer ${exportFormat === fmt
                              ? "bg-[#00674F] text-white font-bold"
                              : "text-[#5E6156] hover:text-[#1B1C15]"
                              }`}
                          >
                            {fmt.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Code Display Box */}
                    <div className="rounded-2xl border border-[#EAE3D2] bg-[#1B1C15] p-4 text-[#E2DDD6] font-mono text-xs">
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <FileCode2 className="h-3.5 w-3.5 text-[#A8CCA0]" />
                          <span className="text-white font-semibold">seed_pipeline.ts</span>
                        </div>
                        <button
                          onClick={handleCopyCode}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-[0.7rem] transition-colors cursor-pointer"
                        >
                          {copied ? (
                            <>
                              <Check className="h-3 w-3 text-[#A8CCA0]" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Copy Script</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="text-[#C3E88D] leading-relaxed overflow-x-auto p-1 text-[0.75rem]">
                        <code>
                          {exportFormat === "drizzle" &&
                            `import { db } from "./db";\nimport { organizations, users, conversations } from "./schema";\n\nawait db.insert(organizations).values(seedOrganizations);\nawait db.insert(users).values(seedUsers); // FK: organizationId\nawait db.insert(conversations).values(seedConversations); // FK: userId\nconsole.log("✓ 1,022 rows seeded with 100% referential integrity in 184ms");`}
                          {exportFormat === "prisma" &&
                            `import { PrismaClient } from "@prisma/client";\nconst prisma = new PrismaClient();\n\nawait prisma.organization.createMany({ data: seedOrganizations });\nawait prisma.user.createMany({ data: seedUsers });\nconsole.log("✓ 1,022 Prisma records seeded");`}
                          {exportFormat === "sql" &&
                            `-- PostgreSQL Production SQL Transaction\nBEGIN;\nINSERT INTO organizations (id, name) VALUES ('org_01', 'Acme AI');\nINSERT INTO users (id, org_id, email) VALUES ('usr_01', 'org_01', 'alice@acme.ai');\nCOMMIT;`}
                        </code>
                      </pre>
                    </div>
                  </div>
                )}

                {/* Bottom Real-time Telemetry Bar */}
                <div className="pt-4 flex items-center justify-between text-xs text-[#5E6156] border-t border-[#EAE3D2] mt-6 font-sohne">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00674F] animate-pulse" />
                    <span className="font-semibold text-[#1B1C15]">100% Referential Integrity</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-[0.72rem]">
                    <span className="text-[#828579]">Seed: 42</span>
                    <span className="font-bold text-[#00674F] bg-[#E6F4EF] px-2.5 py-0.5 rounded-full">
                      {rowsGenerated.toLocaleString()} rows in 184ms
                    </span>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}