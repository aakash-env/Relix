"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Database,
  Clock,
  ArrowRight,
  Sparkles,
  FileCode2,
  CheckCircle2,
  FolderPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";

const INITIAL_PROJECTS = [
  {
    id: "p1",
    name: "AI SaaS Dashboard",
    tables: 12,
    records: "24.5K",
    lastGenerated: "2h ago",
    status: "ready",
    description: "Multi-tenant AI application with users, orgs, models, chats & token telemetry.",
  },
  {
    id: "p2",
    name: "Ecommerce Prototype",
    tables: 8,
    records: "1.2K",
    lastGenerated: "1d ago",
    status: "ready",
    description: "Online store catalog, inventory stock, order items, and customer transactions.",
  },
  {
    id: "p3",
    name: "Admin Panel Demo",
    tables: 5,
    records: "Draft",
    lastGenerated: "3d ago",
    status: "draft",
    description: "RBAC roles, permissions, user audit logs, and security policy tables.",
  },
];

export default function ProjectsPage() {
  const [projects] = useState(INITIAL_PROJECTS);

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-[1400px] w-full mx-auto space-y-8 font-sohne select-none">
      
      {/* ── Top Header Row ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE3D2] pb-6">
        <div>
          <h1 className="font-meraki text-3xl sm:text-4xl font-light text-[#1B1C15] tracking-tight mb-1">
            Projects
          </h1>
          <p className="text-xs sm:text-sm text-[#5E6156]">
            Manage your relational schema projects, seed datasets, and ORM exports.
          </p>
        </div>

        <Button asChild size="sm" className="rounded-xl bg-[#1B1C15] hover:bg-[#00674F] text-[#FFFAEB] text-xs font-semibold shadow-xs">
          <Link href="/schema">
            <Plus className="h-3.5 w-3.5 mr-1" />
            <span>New project</span>
          </Link>
        </Button>
      </div>

      {/* ── Full-Width Responsive Project Grid ─────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((project) => (
          <article
            key={project.id}
            className="rounded-2xl border border-[#EAE3D2] bg-white p-6 flex flex-col justify-between gap-5 shadow-2xs hover:shadow-xs hover:border-[#1B1C15]/30 transition-all group"
          >
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E6F4EF] text-[#00674F] flex items-center justify-center shrink-0 border border-[#00674F]/15">
                    <Database className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-[#1B1C15] group-hover:text-[#00674F] transition-colors leading-snug">
                      {project.name}
                    </h2>
                    <p className="text-xs text-[#828579] font-mono mt-0.5">
                      {project.tables} tables
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.8 rounded-full font-mono text-[0.68rem] font-semibold border ${
                    project.status === "ready"
                      ? "bg-[#E6F4EF] text-[#00674F] border-[#00674F]/20"
                      : "bg-[#FAF7EE] text-[#828579] border-[#EAE3D2]"
                  }`}
                >
                  {project.status === "ready" && <CheckCircle2 className="h-3 w-3" />}
                  <span className="capitalize">{project.status}</span>
                </span>
              </div>

              <p className="text-xs text-[#5E6156] leading-relaxed line-clamp-2 mt-2">
                {project.description}
              </p>
            </div>

            {/* Metrics pills */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="rounded-xl bg-[#FAF7EE] px-3.5 py-2.5 border border-[#EAE3D2]/70">
                <p className="text-[#828579] text-[0.68rem]">Records</p>
                <p className="font-bold text-sm text-[#1B1C15] mt-0.5">{project.records}</p>
              </div>
              <div className="rounded-xl bg-[#FAF7EE] px-3.5 py-2.5 border border-[#EAE3D2]/70">
                <p className="text-[#828579] text-[0.68rem] flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Last run
                </p>
                <p className="font-bold text-sm text-[#1B1C15] mt-0.5">{project.lastGenerated}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-[#EAE3D2]/60">
              <Button asChild size="sm" variant="outline" className="flex-1 rounded-xl text-xs font-semibold hover:border-[#1B1C15]">
                <Link href="/schema">
                  <span>Open Schema</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              </Button>

              <Button asChild size="sm" className="rounded-xl bg-[#1B1C15] hover:bg-[#00674F] text-white text-xs font-semibold">
                <Link href="/schema">
                  <Sparkles className="h-3.5 w-3.5 mr-1" />
                  <span>Generate</span>
                </Link>
              </Button>
            </div>
          </article>
        ))}

        {/* Create New Project Card */}
        <Link
          href="/schema"
          className="rounded-2xl border-2 border-dashed border-[#EAE3D2] bg-[#FAF7EE]/50 hover:bg-[#FAF7EE] hover:border-[#00674F] p-6 flex flex-col items-center justify-center gap-3 text-center min-h-[260px] transition-all group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-white border border-[#EAE3D2] group-hover:border-[#00674F] group-hover:scale-105 flex items-center justify-center text-[#828579] group-hover:text-[#00674F] transition-all shadow-2xs">
            <FolderPlus className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1B1C15] group-hover:text-[#00674F] transition-colors">
              Create new project
            </p>
            <p className="text-xs text-[#828579] mt-1 max-w-[200px]">
              Paste SQL DDL or start from pre-built schema presets
            </p>
          </div>
        </Link>
      </div>

    </div>
  );
}
