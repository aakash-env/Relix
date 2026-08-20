import React from "react";
import Link from "next/link";
import { Plus, Database, Clock, ArrowRight, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const projects = [
  { id: "p1", name: "AI SaaS Dashboard", tables: 12, records: "24.5K", lastGenerated: "2h ago", status: "ready", preset: "ai-saas" },
  { id: "p2", name: "Ecommerce Prototype", tables: 8, records: "1.2K", lastGenerated: "1d ago", status: "ready", preset: null },
  { id: "p3", name: "Admin Panel Demo", tables: 5, records: "—", lastGenerated: "3d ago", status: "draft", preset: null },
];

export default function ProjectsPage() {
  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#1c1a18] mb-0.5">Projects</h1>
          <p className="text-sm text-[#6b6460]">Manage your schema projects and seed data.</p>
        </div>
        <Button size="md" id="projects-new" disabled title="Create project — connect a database to enable">
          <Plus className="h-4 w-4" />
          New project
        </Button>
      </div>

      {/* Usage limit notice */}
      <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3.5 mb-6 flex items-center justify-between">
        <p className="text-sm text-amber-800">
          You&apos;re on the <strong>Free plan</strong> — 3 of 3 projects used.
        </p>
        <Button asChild size="sm" variant="forest" id="projects-upgrade-cta">
          <Link href="/settings/billing">Upgrade to Pro</Link>
        </Button>
      </div>

      {/* Project list */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <article key={project.id} className="rounded-xl border border-[#e8e4dc] bg-white p-5 flex flex-col gap-4 hover:shadow-md hover:border-[#c8c0b4] transition-all">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#eef3ec] flex items-center justify-center text-[#4a7c59] shrink-0">
                  <Database className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[#1c1a18] leading-tight">{project.name}</h2>
                  <p className="text-xs text-[#6b6460] mt-0.5">{project.tables} tables</p>
                </div>
              </div>
              <Badge variant={project.status === "ready" ? "success" : "secondary"} className="shrink-0">
                {project.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-[#faf8f4] px-3 py-2">
                <p className="text-[#6b6460]">Records</p>
                <p className="font-semibold text-[#1c1a18] mt-0.5">{project.records}</p>
              </div>
              <div className="rounded-lg bg-[#faf8f4] px-3 py-2">
                <p className="text-[#6b6460] flex items-center gap-1"><Clock className="h-3 w-3" /> Last run</p>
                <p className="font-semibold text-[#1c1a18] mt-0.5">{project.lastGenerated}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm" className="flex-1" id={`project-open-${project.id}`}>
                <Link href={`/projects/${project.id}/schema`}>
                  Open
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
              {project.status === "ready" && (
                <Button asChild size="sm" variant="ghost" id={`project-export-${project.id}`}>
                  <Link href={`/projects/${project.id}/export`}>Export</Link>
                </Button>
              )}
            </div>
          </article>
        ))}

        {/* Empty project slot — disabled on free plan */}
        <div className="rounded-xl border-2 border-dashed border-[#e8e4dc] p-5 flex flex-col items-center justify-center gap-3 text-center min-h-[180px] opacity-60">
          <Folder className="h-8 w-8 text-[#c8c0b4]" />
          <div>
            <p className="text-sm font-medium text-[#6b6460]">Upgrade to add more</p>
            <p className="text-xs text-[#c8c0b4] mt-0.5">Free plan is limited to 3 projects</p>
          </div>
        </div>
      </div>
    </div>
  );
}
