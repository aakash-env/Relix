"use client";

import React, { useState } from "react";
import {
  GitBranch,
  Bot,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Zap,
  ArrowRight,
  Database,
  Layers,
  Code2,
} from "lucide-react";
import Link from "next/link";

const WORKFLOW_STEPS = [
  {
    id: "dag",
    number: "01",
    icon: GitBranch,
    title: "Zero Foreign Key Violations",
    tagline: "Topological Dependency Sorting",
    description:
      "Relix converts your PostgreSQL DDL into a Directed Acyclic Graph (DAG) using Kahn's algorithm. Parent tables are always inserted before child records, completely eliminating foreign key reference crashes.",
    badge: "Kahn's DAG Engine",
    visual: {
      type: "comparison",
      bad: "INSERT users BEFORE organizations → FK ERROR: org_id does not exist",
      good: "✓ 1. organizations (PK) → 2. users (FK) → 3. conversations (FK) [0 Violations]",
    },
  },
  {
    id: "domain",
    number: "02",
    icon: Bot,
    title: "Domain-Smart AI SaaS Data",
    tagline: "No More 'Lorem Ipsum' Placeholders",
    description:
      "Instead of meaningless gibberish, Relix synthesizes realistic LLM conversations, authentic prompt queries, model names (GPT-4o, Claude 3.5), token telemetry, and Stripe subscription tiers.",
    badge: "Semantic Data Engine",
    visual: {
      type: "sample",
      model: "gpt-4o",
      query: "Draft a GraphQL microservice for tenant auth",
      tokens: "1,840 tokens ($0.0092)",
      tier: "Enterprise SaaS Tier",
    },
  },
  {
    id: "prng",
    number: "03",
    icon: RefreshCw,
    title: "100% Deterministic CI Seeds",
    tagline: "Mulberry32 PRNG Algorithm",
    description:
      "A single 32-bit integer seed guarantees bit-for-bit identical test data across every engineer's local environment and GitHub Actions CI pipelines. Reproduce bugs with zero flakiness.",
    badge: "Mulberry32 PRNG",
    visual: {
      type: "seed",
      seedNumber: 42,
      guarantee: "Same Seed = Same UUIDs, timestamps & relational links every time",
    },
  },
];

export function SocialProofSection() {
  const [activeTab, setActiveTab] = useState<string>("dag");

  const activeStep = WORKFLOW_STEPS.find((s) => s.id === activeTab) || WORKFLOW_STEPS[0];
  const IconComponent = activeStep.icon;

  return (
    <section
      className="py-14 md:py-20 bg-[#FFFAEB] border-t border-[#EAE3D2]"
      id="how-it-works"
      aria-labelledby="explanation-heading"
    >
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* ── Section Header ─────────────────────────────────────────────── */}
        <div className="text-center max-w-[680px] mx-auto mb-14 md:mb-18">
          <h2
            id="explanation-heading"
            className="font-meraki text-3xl sm:text-4xl md:text-5xl font-light text-[#1B1C15] leading-[1.1] tracking-tight mb-5"
          >
            Engineered for the real complexities
            <br />
            <span className="font-normal text-[#00674F]">
              of relational databases.
            </span>
          </h2>
          <p className="text-base md:text-lg text-[#5E6156] font-sohne font-normal leading-relaxed">
            Traditional dummy data tools generate disconnected strings and break foreign key constraints.
            Here is how Relix solves database testing from first principles.
          </p>
        </div>

        {/* ── Interactive 3-Pillar Tab Switcher ──────────────────────────── */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {WORKFLOW_STEPS.map((step) => {
            const isActive = activeTab === step.id;
            const StepIcon = step.icon;
            return (
              <button
                key={step.id}
                onClick={() => setActiveTab(step.id)}
                className={`text-left p-5 sm:p-6 rounded-3xl border transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-white border-[#00674F] shadow-card-md scale-[1.02]"
                    : "bg-[#FFFDF5] border-[#EAE3D2] hover:bg-white hover:border-[#D4CDBC] shadow-2xs"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-full ${isActive ? "bg-[#00674F] text-white" : "bg-[#EAE3D2] text-[#5E6156]"}`}>
                    Step {step.number}
                  </span>
                  <StepIcon className={`h-4 w-4 ${isActive ? "text-[#00674F]" : "text-[#828579]"}`} />
                </div>
                <h3 className="font-sohne font-bold text-sm sm:text-base text-[#1B1C15] mb-1">
                  {step.title}
                </h3>
                <p className="font-sohne text-xs text-[#5E6156]">
                  {step.tagline}
                </p>
              </button>
            );
          })}
        </div>

        {/* ── Deep Dive Explanation & Live Visual Deck ───────────────────── */}
        <div className="rounded-3xl border border-[#EAE3D2] bg-white p-6 sm:p-10 shadow-card-lg">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Narrative (6 cols) */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F4EF] text-[#00674F] text-xs font-mono font-bold">
                <IconComponent className="h-3.5 w-3.5" />
                <span>{activeStep.badge}</span>
              </div>
              <h3 className="font-meraki text-2xl sm:text-3xl font-light text-[#1B1C15] leading-tight">
                {activeStep.title}
              </h3>
              <p className="font-sohne text-sm sm:text-base text-[#5E6156] leading-relaxed">
                {activeStep.description}
              </p>
              <div className="pt-2">
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00674F] hover:text-[#1B1C15] transition-colors"
                >
                  <span>Read technical documentation</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Visual Simulation (6 cols) */}
            <div className="lg:col-span-6">
              {activeStep.id === "dag" && (
                <div className="space-y-3 font-sohne text-xs">
                  {/* The Old Way: FK Error */}
                  <div className="p-4 rounded-2xl border border-red-200 bg-red-50/50 text-red-800 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-[0.7rem] uppercase tracking-wider text-red-700">
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Traditional Tools (Random Order)</span>
                    </div>
                    <p className="font-mono text-[0.72rem] bg-white/80 p-2 rounded-lg border border-red-200 text-red-900">
                      ERROR: insert into &quot;users&quot; violates foreign key constraint &quot;users_org_id_fkey&quot;
                    </p>
                  </div>

                  {/* The Relix Way: Topological DAG */}
                  <div className="p-4 rounded-2xl border border-[#00674F]/30 bg-[#E6F4EF]/60 text-[#00674F] space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-[0.7rem] uppercase tracking-wider">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Relix Kahn Topological Sort</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-[#00674F]/20 font-mono text-[0.72rem] text-[#1B1C15] space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00674F]" />
                        <span>1. <strong>organizations</strong> (Parent table resolved)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00674F]" />
                        <span>2. <strong>users</strong> (Linked to org_01 valid PK)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00674F]" />
                        <span>3. <strong>conversations</strong> (Referencing usr_01 valid PK)</span>
                      </div>
                    </div>
                    <p className="text-[0.68rem] font-bold text-[#00674F] pt-0.5">
                      ✓ 100% DAG Validated · 0 Runtime Foreign Key Violations
                    </p>
                  </div>
                </div>
              )}

              {activeStep.id === "domain" && (
                <div className="space-y-3 font-sohne text-xs">
                  <div className="p-4 rounded-2xl border border-[#EAE3D2] bg-[#FFFDF5] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-[#00674F]" />
                        <span className="font-bold text-[#1B1C15]">Synthesized AI Message Thread</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#1B1C15] text-[#FFFAEB] font-mono text-[0.65rem]">
                        gpt-4o
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-[#EAE3D2] text-[#3D3A36] italic">
                      &ldquo;Draft a high-throughput GraphQL microservice with JWT auth and RBAC permissions.&rdquo;
                    </div>
                    <div className="flex items-center justify-between text-[0.72rem] font-mono text-[#828579] pt-1">
                      <span>Tokens: 1,840 in / 490 out</span>
                      <span className="font-bold text-[#00674F]">Stripe Invoice: $49.00 / mo</span>
                    </div>
                  </div>
                </div>
              )}

              {activeStep.id === "prng" && (
                <div className="space-y-3 font-sohne text-xs">
                  <div className="p-4 rounded-2xl border border-[#EAE3D2] bg-[#FFFDF5] space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#F3EDE0]">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-[#00674F]" />
                        <span className="font-bold text-[#1B1C15]">Deterministic Seed Lock</span>
                      </div>
                      <span className="font-mono text-xs text-[#00674F] font-bold">Seed #42</span>
                    </div>
                    <div className="space-y-1.5 font-mono text-[0.72rem] text-[#5E6156]">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#EAE3D2]">
                        <span>Local Dev (Alice):</span>
                        <strong className="text-[#1B1C15]">usr_4201 (Alice Chen)</strong>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#EAE3D2]">
                        <span>CI Runner (GitHub Actions):</span>
                        <strong className="text-[#1B1C15]">usr_4201 (Alice Chen)</strong>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#EAE3D2]">
                        <span>Staging Server:</span>
                        <strong className="text-[#1B1C15]">usr_4201 (Alice Chen)</strong>
                      </div>
                    </div>
                    <p className="text-[0.68rem] text-[#00674F] font-bold text-center pt-1">
                      ✓ Bit-for-bit identical seed state across team members
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}