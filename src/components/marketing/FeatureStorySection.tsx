"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Bot,
  Shuffle,
  ShieldCheck,
  CheckCircle2,
  Database,
  GitBranch,
  Table,
  CheckCheck,
  Zap,
  Layers,
  Copy,
  Check,
} from "lucide-react";
import { RelixLogo } from "@/components/marketing/RelixLogo";

// Table data definitions for the interactive relational visualizer
const TABLE_DATA = {
  users: {
    name: "users",
    parent: "organizations.id",
    rows: [
      { id: "usr_4201", fk: "org_01 (Acme AI)", entity: "Alice Chen", detail: "alice@acme.ai", badge: "Enterprise", tagColor: "bg-[#E6F4EF] text-[#00674F]" },
      { id: "usr_4202", fk: "org_01 (Acme AI)", entity: "Bob Martinez", detail: "bob@acme.ai", badge: "Admin", tagColor: "bg-[#F3EDE0] text-[#1B1C15]" },
      { id: "usr_4203", fk: "org_02 (NovaTech)", entity: "Elena Rostova", detail: "elena@novatech.io", badge: "Enterprise", tagColor: "bg-[#E6F4EF] text-[#00674F]" },
      { id: "usr_4204", fk: "org_03 (Scale Systems)", entity: "Kenji Sato", detail: "kenji@scale.dev", badge: "Pro Plan", tagColor: "bg-[#E8F1FA] text-[#1D5E9E]" },
    ],
  },
  organizations: {
    name: "organizations",
    parent: "plans.id",
    rows: [
      { id: "org_01", fk: "plan_enterprise", entity: "Acme AI Labs", detail: "acme-ai.relix.dev", badge: "50 Seats", tagColor: "bg-[#E6F4EF] text-[#00674F]" },
      { id: "org_02", fk: "plan_enterprise", entity: "NovaTech AI", detail: "novatech.io", badge: "25 Seats", tagColor: "bg-[#E6F4EF] text-[#00674F]" },
      { id: "org_03", fk: "plan_pro", entity: "Scale Systems", detail: "scalesystems.dev", badge: "10 Seats", tagColor: "bg-[#E8F1FA] text-[#1D5E9E]" },
    ],
  },
  conversations: {
    name: "conversations",
    parent: "users.id",
    rows: [
      { id: "conv_891", fk: "usr_4201 (Alice)", entity: "GraphQL Auth Architecture", detail: "gpt-4o · 1,840 tokens", badge: "Resolved", tagColor: "bg-[#E6F4EF] text-[#00674F]" },
      { id: "conv_892", fk: "usr_4201 (Alice)", entity: "PostgreSQL Index Optimization", detail: "claude-3-5 · 3,420 tokens", badge: "Resolved", tagColor: "bg-[#E6F4EF] text-[#00674F]" },
      { id: "conv_893", fk: "usr_4203 (Elena)", entity: "Kahn DAG Resolver Script", detail: "gpt-4o · 2,190 tokens", badge: "Streaming", tagColor: "bg-[#FFF4D6] text-[#8C6B00]" },
    ],
  },
};

export function FeatureStorySection() {
  // Section 1: Active Table in Relational Visualizer
  const [activeTableKey, setActiveTableKey] = useState<"users" | "organizations" | "conversations">("users");
  const [copiedSection1, setCopiedSection1] = useState(false);

  // Section 2: PRNG Seed Simulator
  const [seed, setSeed] = useState<number>(42);
  const [isRolling, setIsRolling] = useState<boolean>(false);

  const userNames = ["Alice Chen", "Elena Rostova", "Marcus Vance", "Kenji Sato", "Sarah Jenkins"];
  const userEmails = ["alice@acme.ai", "elena@novatech.io", "marcus@scale.dev", "kenji@tokyo-ai.jp", "sarah@cloudops.net"];
  const orgNames = ["Acme AI Labs", "NovaTech AI", "Scale Systems", "Tokyo AI Research", "CloudOps Corp"];
  const chatQueries = [
    "Draft a GraphQL microservice for user auth",
    "Explain Kahn's topological sort algorithm in TypeScript",
    "Optimize PostgreSQL indexing for 10M record search",
    "Generate multi-turn conversation test fixtures",
  ];
  const modelNames = ["gpt-4o", "claude-3-5-sonnet", "gemini-1.5-pro", "mistral-large"];

  const seedIndex = Math.abs(seed) % userNames.length;
  const currentUserName = userNames[seedIndex];
  const currentUserEmail = userEmails[seedIndex];
  const currentOrgName = orgNames[seedIndex];
  const currentQuery = chatQueries[seedIndex % chatQueries.length];
  const currentModel = modelNames[seedIndex % modelNames.length];
  const inputTokens = 1200 + (seed * 37) % 2400;
  const outputTokens = 450 + (seed * 19) % 1100;
  const totalCost = (((inputTokens * 0.005 + outputTokens * 0.015) / 1000)).toFixed(4);

  const activeTable = TABLE_DATA[activeTableKey];

  const handleCopy = () => {
    setCopiedSection1(true);
    navigator.clipboard.writeText(JSON.stringify(activeTable.rows, null, 2));
    setTimeout(() => setCopiedSection1(false), 1800);
  };

  const handleRollSeed = () => {
    setIsRolling(true);
    const newSeed = Math.floor(Math.random() * 900) + 100;
    setTimeout(() => {
      setSeed(newSeed);
      setIsRolling(false);
    }, 250);
  };

  return (
    <div
      className="pt-14 md:pt-18 pb-16 md:pb-22 space-y-16 md:space-y-24 bg-[#FFFAEB] border-t border-[#EAE3D2]"
      id="features"
    >
      {/* ── SECTION 1: Interactive Relational Table & DAG Visualizer ─────── */}
      <section className="max-w-[1280px] mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Heading + Subtitle + Testimonial Quote Box + CTA */}
          <div className="lg:col-span-5 max-w-[500px]">
            <h2 className="font-meraki text-4xl sm:text-5xl md:text-[54px] font-light text-[#1B1C15] leading-[1.08] tracking-tight mb-5">
              An engine across all
              <br />
              <span className="font-normal text-[#00674F]">
                your database tables
              </span>
            </h2>
            <p className="text-base md:text-lg text-[#5E6156] leading-relaxed mb-8 font-sohne font-normal">
              Connect your PostgreSQL schema once. Relix synthesizes relational test records across all your tables, ORMs, and databases in milliseconds.
            </p>

            <div className="flex flex-col gap-2.5 mb-8 font-sohne text-xs text-[#5E6156]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#00674F] shrink-0" />
                <span>Zero circular loops &amp; 100% DAG topological resolution</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#00674F] shrink-0" />
                <span>Automatic foreign key pool &amp; parent-first insertion</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#00674F] shrink-0" />
                <span>Instant export to TypeScript, Drizzle, Prisma &amp; SQL</span>
              </div>
            </div>

            {/* Pill Button: Learn More */}
            <Link
              href="/docs"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full border border-[#EAE3D2] bg-[#FAF7EE] hover:bg-white text-xs font-semibold text-[#1B1C15] shadow-2xs hover:shadow-xs transition-all"
            >
              <span>Explore schema engine</span>
              <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
            </Link>
          </div>

          {/* Right Column: Interactive Relational Multi-Table Simulation Card */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-[#EAE3D2] bg-white p-6 sm:p-7 shadow-card-lg">
              
              {/* Top Bar: DAG Breadcrumb Sequence & Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-5 border-b border-[#F3EDE0]">
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-[#00674F]" />
                  <span className="text-xs font-bold text-[#1B1C15] font-sohne">Topological Resolution Chain</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E6F4EF] text-[#00674F] text-[0.68rem] font-mono font-bold">
                  <CheckCheck className="h-3 w-3" />
                  <span>0 FK Violations · DAG Validated</span>
                </div>
              </div>

              {/* Table Selector Pills */}
              <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
                {(["users", "organizations", "conversations"] as const).map((key) => {
                  const isActive = activeTableKey === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveTableKey(key)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? "bg-[#1B1C15] text-[#FFFAEB] font-bold shadow-2xs"
                          : "bg-[#FFFDF5] border border-[#EAE3D2] text-[#5E6156] hover:text-[#1B1C15] hover:border-[#D4CDBC]"
                      }`}
                    >
                      <Table className="h-3 w-3" />
                      <span>{key}</span>
                      <span className={`text-[0.65rem] px-1.5 py-0.2 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-[#EAE3D2] text-[#5E6156]"}`}>
                        {key === "users" ? "500" : key === "organizations" ? "50" : "2,500"}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Live Streaming Relational Table Card */}
              <div className="rounded-2xl border border-[#EAE3D2] bg-[#FFFDF5] overflow-hidden mb-4">
                <div className="grid grid-cols-12 px-4 py-2.5 bg-[#F7F2E6]/60 border-b border-[#EAE3D2] text-[0.68rem] font-mono text-[#828579] font-bold">
                  <div className="col-span-3">RECORD ID (PK)</div>
                  <div className="col-span-4">RELATION (FK)</div>
                  <div className="col-span-3">SYNTHESIZED DATA</div>
                  <div className="col-span-2 text-right">STATUS</div>
                </div>

                <div className="divide-y divide-[#EAE3D2]/60 font-sohne">
                  {activeTable.rows.map((row) => (
                    <div key={row.id} className="grid grid-cols-12 px-4 py-3 items-center hover:bg-white transition-colors text-xs">
                      <div className="col-span-3 font-mono font-bold text-[#1B1C15] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00674F]" />
                        {row.id}
                      </div>
                      <div className="col-span-4 font-mono text-[0.72rem] text-[#5E6156] truncate pr-2">
                        {row.fk}
                      </div>
                      <div className="col-span-3 truncate pr-2">
                        <p className="font-bold text-[#1B1C15] text-[0.78rem] truncate">{row.entity}</p>
                        <p className="text-[0.68rem] text-[#828579] font-mono truncate">{row.detail}</p>
                      </div>
                      <div className="col-span-2 text-right">
                        <span className={`text-[0.65rem] font-mono font-bold px-2 py-0.5 rounded-full ${row.tagColor}`}>
                          {row.badge}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Quick Action Bar */}
              <div className="flex items-center justify-between pt-2 text-xs font-sohne text-[#828579]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00674F] animate-pulse" />
                  <span>Parent table resolved before child references</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[#1B1C15] hover:text-[#00674F] font-medium transition-colors cursor-pointer"
                >
                  {copiedSection1 ? <Check className="h-3.5 w-3.5 text-[#00674F]" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedSection1 ? "Copied JSON" : "Copy Rows"}</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: AI Domain Telemetry & Deterministic PRNG ─────────── */}
      <section className="max-w-[1280px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          
          {/* Left: Interactive Seed Simulator Card */}
          <div className="order-2 lg:order-1 rounded-3xl border border-[#EAE3D2] bg-white p-6 sm:p-7 shadow-card-lg">
            {/* Top Seed Scrambler Bar */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#F3EDE0]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00674F] animate-pulse" />
                <span className="text-xs font-bold text-[#1B1C15] font-sohne">PRNG Seed Engine</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#5E6156]">Seed: #{seed}</span>
                <button
                  onClick={handleRollSeed}
                  disabled={isRolling}
                  className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#1B1C15] hover:bg-[#2C2D24] text-[#FFFAEB] text-xs font-sohne transition-all active:scale-95 cursor-pointer disabled:opacity-75"
                >
                  <Shuffle className={`h-3 w-3 ${isRolling ? "animate-spin" : ""}`} />
                  <span>Roll Seed</span>
                </button>
              </div>
            </div>

            {/* Synthesized Live Record Visualizer */}
            <div className="space-y-3 font-sohne">
              {/* User Record Card */}
              <div className="p-3.5 rounded-2xl border border-[#EAE3D2] bg-[#FFFDF5] transition-all">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#00674F] text-white flex items-center justify-center font-bold text-xs font-mono">
                      {currentUserName[0]}
                    </div>
                    <span className="text-xs font-bold text-[#1B1C15]">{currentUserName}</span>
                  </div>
                  <span className="text-[0.68rem] font-mono text-[#828579]">{currentUserEmail}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#5E6156] pt-1">
                  <span>Org: <strong className="text-[#1B1C15]">{currentOrgName}</strong></span>
                  <span className="text-[0.65rem] bg-[#E6F4EF] text-[#00674F] px-2 py-0.5 rounded-full font-mono font-bold">
                    Enterprise Plan
                  </span>
                </div>
              </div>

              {/* Multi-Turn AI Conversation & Telemetry Card */}
              <div className="p-3.5 rounded-2xl border border-[#EAE3D2] bg-[#FFFDF5] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Bot className="h-4 w-4 text-[#00674F]" />
                    <span className="text-xs font-bold text-[#1B1C15]">AI Conversation Thread</span>
                  </div>
                  <span className="text-[0.65rem] bg-[#1B1C15] text-[#FFFAEB] px-2 py-0.5 rounded-full font-mono">
                    {currentModel}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[#EAE3D2] text-xs text-[#5E6156] font-sohne italic">
                  &ldquo;{currentQuery}&rdquo;
                </div>
                <div className="flex items-center justify-between pt-1 text-[0.72rem] font-mono text-[#828579]">
                  <span>Tokens: {inputTokens.toLocaleString()} in / {outputTokens.toLocaleString()} out</span>
                  <span className="font-bold text-[#00674F]">${totalCost} est.</span>
                </div>
              </div>

              {/* Deterministic Verification Bar */}
              <div className="p-3 rounded-xl bg-[#E6F4EF] border border-[#00674F]/20 flex items-center justify-between text-xs text-[#00674F] font-sohne">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="font-bold">Mulberry32 PRNG Verified</span>
                </div>
                <span className="font-mono text-[0.68rem]">100% Deterministic</span>
              </div>
            </div>
          </div>

          {/* Right: Headline & Copy */}
          <div className="order-1 lg:order-2">
            <h2 className="font-meraki text-3xl sm:text-4xl md:text-5xl font-light text-[#1B1C15] leading-[1.08] tracking-tight mb-5">
              Authentic AI telemetry.
              <br />
              <span className="font-normal text-[#00674F]">
                Exact same records every time.
              </span>
            </h2>
            <p className="text-base md:text-lg text-[#5E6156] leading-relaxed mb-6 font-sohne">
              Relix skips placeholder gibberish to synthesize authentic LLM model conversations,
              realistic prompt token horizons, and Stripe billing invoices. Powered by Mulberry32 PRNG,
              a single integer seed guarantees identical datasets across your entire team and CI/CD pipelines.
            </p>
            <div className="flex items-center gap-6 mb-8 font-sohne text-xs text-[#5E6156]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#00674F]" />
                <span>Authentic LLM chats</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#00674F]" />
                <span>Token telemetry</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#00674F]" />
                <span>Zero flaky tests</span>
              </div>
            </div>
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-[#EAE3D2] bg-white text-xs font-semibold text-[#1B1C15] hover:bg-[#FFFDF5] hover:border-[#1B1C15] shadow-2xs transition-all"
            >
              <span>Start generating realistic data</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}