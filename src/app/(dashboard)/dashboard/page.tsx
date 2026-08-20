import React from "react";
import Link from "next/link";
import { Plus, ArrowRight, Clock, Zap, Database, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const recentProjects = [
  { id: "p1", name: "AI SaaS Dashboard", tables: 12, lastGenerated: "2h ago", status: "ready" },
  { id: "p2", name: "Ecommerce Prototype", tables: 8, lastGenerated: "1d ago", status: "ready" },
  { id: "p3", name: "Admin Panel Demo", tables: 5, lastGenerated: "3d ago", status: "draft" },
];

const quickActions = [
  { label: "New project", href: "/projects", icon: <Plus className="h-4 w-4" />, primary: true },
  { label: "Use AI SaaS preset", href: "/projects?preset=ai-saas", icon: <Zap className="h-4 w-4" />, primary: false },
  { label: "Paste schema", href: "/projects", icon: <Database className="h-4 w-4" />, primary: false },
];

export default function DashboardPage() {
  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#1c1a18] mb-0.5">Dashboard</h1>
          <p className="text-sm text-[#6b6460]">Welcome back, Alice.</p>
        </div>
        <Button asChild size="md" id="dashboard-new-project">
          <Link href="/projects">
            <Plus className="h-4 w-4" />
            New project
          </Link>
        </Button>
      </div>

      {/* Usage summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Projects", value: "3", sub: "of 3 on Free" },
          { label: "Generations", value: "12", sub: "this month" },
          { label: "Records generated", value: "24.5K", sub: "lifetime" },
          { label: "Exports", value: "8", sub: "this month" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-[#e8e4dc] bg-white p-4">
            <p className="text-xs text-[#6b6460] mb-1">{stat.label}</p>
            <p className="text-2xl font-semibold text-[#1c1a18]" style={{ fontFamily: "Fraunces, Georgia, serif" }}>
              {stat.value}
            </p>
            <p className="text-xs text-[#c8c0b4] mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent projects */}
        <div className="lg:col-span-2 rounded-xl border border-[#e8e4dc] bg-white overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8e4dc]">
            <h2 className="font-semibold text-[#1c1a18]">Recent projects</h2>
            <Link href="/projects" className="text-sm text-[#6366f1] hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-[#f4f0e8]">
            {recentProjects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}/schema`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-[#faf8f4] transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-[#eef3ec] flex items-center justify-center text-[#4a7c59] shrink-0">
                  <Database className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1c1a18] truncate">{project.name}</p>
                  <p className="text-xs text-[#6b6460]">{project.tables} tables</p>
                </div>
                <div className="flex items-center gap-2 text-right shrink-0">
                  <Badge variant={project.status === "ready" ? "success" : "secondary"}>
                    {project.status}
                  </Badge>
                  <span className="text-xs text-[#c8c0b4] flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {project.lastGenerated}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="rounded-xl border border-[#e8e4dc] bg-white overflow-hidden">
          <div className="px-5 py-4 border-b border-[#e8e4dc]">
            <h2 className="font-semibold text-[#1c1a18]">Quick actions</h2>
          </div>
          <div className="p-4 flex flex-col gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                asChild
                variant={action.primary ? "default" : "outline"}
                className="w-full justify-start"
                id={`quick-action-${action.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <Link href={action.href}>
                  {action.icon}
                  {action.label}
                </Link>
              </Button>
            ))}
          </div>

          {/* Upgrade banner for free users */}
          <div className="mx-4 mb-4 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Zap className="h-4 w-4 text-indigo-500" />
              <span className="text-xs font-semibold text-indigo-700">Free plan</span>
            </div>
            <p className="text-xs text-indigo-600 mb-3">
              You&apos;ve used 3 of 3 free projects. Upgrade to Pro for unlimited projects and 50K records.
            </p>
            <Button asChild size="sm" className="w-full" id="dashboard-upgrade-cta">
              <Link href="/settings/billing">Upgrade to Pro</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Recent generations */}
      <div className="mt-6 rounded-xl border border-[#e8e4dc] bg-white overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8e4dc]">
          <h2 className="font-semibold text-[#1c1a18]">Generation history</h2>
          <Badge variant="secondary">3 recent</Badge>
        </div>
        <div className="divide-y divide-[#f4f0e8]">
          {[
            { project: "AI SaaS Dashboard", records: "4,820", format: "TypeScript", seed: 42, time: "2h ago" },
            { project: "AI SaaS Dashboard", records: "4,820", format: "SQL", seed: 42, time: "2h ago" },
            { project: "Ecommerce Prototype", records: "1,200", format: "JSON", seed: 7, time: "1d ago" },
          ].map((gen, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3.5">
              <Download className="h-4 w-4 text-[#c8c0b4] shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#1c1a18] truncate">{gen.project}</p>
                <p className="text-xs text-[#6b6460]">{gen.records} records · seed {gen.seed}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="outline">{gen.format}</Badge>
                <span className="text-xs text-[#c8c0b4]">{gen.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
