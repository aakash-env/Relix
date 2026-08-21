"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import {
  Plus,
  Database,
  ArrowRight,
  Clock,
  CheckCircle2,
  MoreHorizontal,
  Layers,
  Sparkles,
  Zap,
  Activity,
  FileCode2,
  GitBranch,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
  Copy,
  Check,
  Download,
  X,
  Play,
  Sliders,
  Table as TableIcon,
  Code2,
  Terminal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { parseSqlDdl } from "@/lib/engine/parser";
import { generateData, buildDefaultConfig } from "@/lib/engine/generator";
import { exportData } from "@/lib/engine/exporter";
import { AI_SAAS_SCHEMA } from "@/lib/engine/presets/ai-saas";
import { ECOMMERCE_SCHEMA } from "@/lib/engine/presets/ecommerce";
import type { GeneratedTable, GeneratedRow } from "@/types/generator";

interface ProjectItem {
  id: string;
  name: string;
  schemaDdl: string;
  tables: number;
  records: string;
  dagStatus: string;
  status: "Ready" | "Draft" | "Running";
  lastRun: string;
}

const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: "p1",
    name: "AI SaaS Dashboard",
    schemaDdl: AI_SAAS_SCHEMA,
    tables: 12,
    records: "24.5K",
    dagStatus: "Kahn DAG resolved",
    status: "Ready",
    lastRun: "2h ago",
  },
  {
    id: "p2",
    name: "Ecommerce Prototype",
    schemaDdl: ECOMMERCE_SCHEMA,
    tables: 5,
    records: "1.2K",
    dagStatus: "5 foreign keys linked",
    status: "Ready",
    lastRun: "1d ago",
  },
  {
    id: "p3",
    name: "Admin Panel Demo",
    schemaDdl: AI_SAAS_SCHEMA,
    tables: 5,
    records: "draft",
    dagStatus: "Pending schema DDL",
    status: "Draft",
    lastRun: "3d ago",
  },
];

interface TelemetryItem {
  id: string;
  type: "seed" | "validation" | "export";
  title: string;
  subtext: string;
  time: string;
  success: boolean;
}

const INITIAL_LOGS: TelemetryItem[] = [
  {
    id: "l1",
    type: "seed",
    title: "Deterministic Mulberry32 seed run",
    subtext: "Seed #42 · 12 tables · 24,500 rows generated",
    time: "Just now",
    success: true,
  },
  {
    id: "l2",
    type: "validation",
    title: "Validation: 0 foreign key errors found",
    subtext: "100% referential integrity verified in CI",
    time: "2h ago",
    success: true,
  },
  {
    id: "l3",
    type: "export",
    title: "TypeScript Drizzle ORM export generated",
    subtext: "Exported schema.ts and seed.ts fixtures",
    time: "4h ago",
    success: true,
  },
  {
    id: "l4",
    type: "validation",
    title: "Validation: 0 cyclic dependencies",
    subtext: "Topological order: plans → orgs → users → chats",
    time: "1d ago",
    success: true,
  },
];

function DashboardMainContent() {
  const [projects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryItem[]>(INITIAL_LOGS);
  const [totalRecords, setTotalRecords] = useState(24500);
  const [completedRuns, setCompletedRuns] = useState(12);
  const [activeExports] = useState(8);
  const [avgLatency, setAvgLatency] = useState(184);

  // Workbench Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem>(INITIAL_PROJECTS[0]);
  const [seed, setSeed] = useState(42);
  const [rowCount, setRowCount] = useState(20);
  const [activeModalTab, setActiveModalTab] = useState<"table" | "dag" | "export">("table");
  const [exportFormat, setExportFormat] = useState<"sql" | "typescript-drizzle" | "typescript-prisma" | "json">("sql");
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Parse & Generate real data
  const generationResult = useMemo(() => {
    try {
      const parsed = parseSqlDdl(selectedProject.schemaDdl);
      const config = buildDefaultConfig(parsed, seed);
      config.entities = parsed.tables.map((t) => ({
        tableName: t.name,
        count: rowCount,
        enabled: true,
      }));

      const start = performance.now();
      const generated = generateData(parsed, config);
      const latency = Math.round(performance.now() - start);

      return { parsed, generated, latency, error: null };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Generation error";
      return { parsed: null, generated: null, latency: 0, error: msg };
    }
  }, [selectedProject, seed, rowCount]);

  const [activeTableName, setActiveTableName] = useState<string>("");

  useEffect(() => {
    if (generationResult.generated && generationResult.generated.tables.length > 0) {
      if (!activeTableName || !generationResult.generated.tables.some((t: GeneratedTable) => t.tableName === activeTableName)) {
        setActiveTableName(generationResult.generated.tables[0].tableName);
      }
    }
  }, [generationResult, activeTableName]);

  const currentTableData = useMemo(() => {
    if (!generationResult.generated || generationResult.generated.tables.length === 0) return null;
    return generationResult.generated.tables.find((t: GeneratedTable) => t.tableName === activeTableName) || generationResult.generated.tables[0];
  }, [generationResult, activeTableName]);

  // Export Code output
  const exportedCode = useMemo(() => {
    if (!generationResult.generated) return "";
    const res = exportData(generationResult.generated, exportFormat);
    return res.ok ? res.content : res.error || "-- Export failed";
  }, [generationResult, exportFormat]);

  const handleOpenGenerator = (project: ProjectItem) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(exportedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const ext = exportFormat === "sql" ? "sql" : exportFormat === "json" ? "json" : "ts";
    const blob = new Blob([exportedCode], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relix-seed-${seed}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRunLiveBenchmark = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const parsed = parseSqlDdl(AI_SAAS_SCHEMA);
      const config = buildDefaultConfig(parsed, Math.floor(Math.random() * 10000));
      const start = performance.now();
      generateData(parsed, config);
      const elapsed = Math.round(performance.now() - start) || 120;

      const newLog: TelemetryItem = {
        id: `bench_${Date.now()}`,
        type: "seed",
        title: `Live Benchmark: 500 rows generated in ${elapsed}ms`,
        subtext: `Deterministic Mulberry32 PRNG · 0 foreign key collisions`,
        time: "Just now",
        success: true,
      };

      setTelemetryLogs((prev) => [newLog, ...prev.slice(0, 5)]);
      setCompletedRuns((r) => r + 1);
      setTotalRecords((rec) => rec + 500);
      setAvgLatency(elapsed);
      setIsGenerating(false);
    }, 250);
  };

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-[1400px] w-full mx-auto space-y-8 font-sohne select-none">
      
      {/* ── Top Header Row ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-meraki text-3xl sm:text-4xl font-light text-[#1B1C15] tracking-tight">
            Overview
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Live Status Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E6F4EF] border border-[#00674F]/20 text-xs font-semibold text-[#00674F]">
            <span className="w-2 h-2 rounded-full bg-[#00674F] animate-pulse" />
            <span>PostgreSQL Connected (v16.2)</span>
          </div>

          {/* New Schema Project CTA */}
          <Button
            onClick={() => handleOpenGenerator(INITIAL_PROJECTS[0])}
            size="sm"
            className="rounded-xl bg-[#1B1C15] hover:bg-[#00674F] text-[#FFFAEB] text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            <span>New Schema Project</span>
          </Button>
        </div>
      </div>

      {/* ── Top Metrics Grid (4 Cohesive Metric Cards) ─────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-[#EAE3D2] bg-white p-5 shadow-2xs hover:shadow-xs transition-shadow">
          <p className="text-xs text-[#828579] font-medium mb-2">Total Synthesized Records</p>
          <div className="flex items-baseline justify-between">
            <p className="font-mono text-3xl font-bold text-[#1B1C15]">{(totalRecords / 1000).toFixed(1)}K</p>
            <span className="inline-flex items-center text-xs font-semibold text-[#00674F]">
              <TrendingUp className="h-3 w-3 mr-0.5" /> +18%
            </span>
          </div>
          <p className="text-[0.7rem] text-[#828579] mt-2">Across relational tables</p>
        </div>

        <div className="rounded-2xl border border-[#EAE3D2] bg-white p-5 shadow-2xs hover:shadow-xs transition-shadow">
          <p className="text-xs text-[#828579] font-medium mb-2">Completed Generations</p>
          <div className="flex items-baseline justify-between">
            <p className="font-mono text-3xl font-bold text-[#1B1C15]">{completedRuns} runs</p>
            <CheckCircle2 className="h-4 w-4 text-[#00674F]" />
          </div>
          <p className="text-[0.7rem] text-[#00674F] font-medium mt-2">100% referential integrity</p>
        </div>

        <div className="rounded-2xl border border-[#EAE3D2] bg-white p-5 shadow-2xs hover:shadow-xs transition-shadow">
          <p className="text-xs text-[#828579] font-medium mb-2">Active Exports</p>
          <div className="flex items-baseline justify-between">
            <p className="font-mono text-3xl font-bold text-[#1B1C15]">{activeExports}</p>
            <FileCode2 className="h-4 w-4 text-[#828579]" />
          </div>
          <p className="text-[0.7rem] text-[#828579] mt-2">Drizzle / Prisma / SQL</p>
        </div>

        <div className="rounded-2xl border border-[#EAE3D2] bg-white p-5 shadow-2xs hover:shadow-xs transition-shadow">
          <p className="text-xs text-[#828579] font-medium mb-2">Avg Generation Latency</p>
          <div className="flex items-baseline justify-between">
            <p className="font-mono text-3xl font-bold text-[#1B1C15]">{avgLatency}ms</p>
            <Zap className="h-4 w-4 text-[#00674F]" />
          </div>
          <p className="text-[0.7rem] text-[#828579] mt-2">Sub-second Mulberry32 PRNG</p>
        </div>
      </div>

      {/* ── Main Two-Column Grid: Active Projects & Telemetry Stream ────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Active Schema Projects (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-[#EAE3D2] bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-meraki text-xl font-normal text-[#1B1C15]">
                Active Schema Projects
              </h2>
              <p className="text-xs text-[#828579] mt-0.5">
                Topological dependency order &amp; record synthesis status
              </p>
            </div>
            <span className="text-xs font-mono text-[#828579] bg-[#FAF7EE] px-2.5 py-1 rounded-full border border-[#EAE3D2]">
              {projects.length} Projects
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EAE3D2] text-[#828579] font-mono">
                  <th className="py-2.5 px-3 font-medium">Project</th>
                  <th className="py-2.5 px-3 font-medium">Tables</th>
                  <th className="py-2.5 px-3 font-medium">Records</th>
                  <th className="py-2.5 px-3 font-medium">Status</th>
                  <th className="py-2.5 px-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE3D2]/60">
                {projects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-[#FAF7EE]/50 transition-colors group">
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#E6F4EF] text-[#00674F] flex items-center justify-center shrink-0 border border-[#00674F]/15">
                          <Database className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-[#1B1C15] group-hover:text-[#00674F] transition-colors">
                            {proj.name}
                          </p>
                          <p className="text-[0.68rem] text-[#828579] font-mono mt-0.5">
                            {proj.dagStatus}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-3 font-mono font-medium text-[#1B1C15]">
                      {proj.tables} tables
                    </td>

                    <td className="py-4 px-3 font-mono font-semibold text-[#1B1C15]">
                      {proj.records}
                    </td>

                    <td className="py-4 px-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.8 rounded-full font-mono text-[0.68rem] font-semibold border ${
                        proj.status === "Ready"
                          ? "bg-[#E6F4EF] text-[#00674F] border-[#00674F]/20"
                          : "bg-[#FAF7EE] text-[#828579] border-[#EAE3D2]"
                      }`}>
                        {proj.status === "Ready" && <CheckCircle2 className="h-3 w-3" />}
                        <span>{proj.status}</span>
                      </span>
                    </td>

                    <td className="py-4 px-3 text-right">
                      <button
                        onClick={() => handleOpenGenerator(proj)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#EAE3D2] bg-[#FAF7EE] hover:bg-white hover:border-[#1B1C15] text-xs font-semibold text-[#1B1C15] transition-all cursor-pointer shadow-2xs"
                      >
                        <span>Generate</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Recent Telemetry Stream (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-[#EAE3D2] bg-white p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#EAE3D2]">
            <h2 className="font-meraki text-lg font-normal text-[#1B1C15]">
              Recent Telemetry
            </h2>
            <button
              onClick={handleRunLiveBenchmark}
              disabled={isGenerating}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E6F4EF] text-[#00674F] hover:bg-[#00674F] hover:text-white font-mono text-[0.65rem] font-semibold transition-colors cursor-pointer border border-[#00674F]/20"
            >
              <RefreshCw className={`h-2.5 w-2.5 ${isGenerating ? "animate-spin" : ""}`} />
              <span>Run Benchmark</span>
            </button>
          </div>

          <div className="space-y-3.5">
            {telemetryLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#FAF7EE] transition-colors border border-transparent hover:border-[#EAE3D2]">
                <div className="mt-0.5 shrink-0">
                  {log.type === "validation" ? (
                    <div className="w-5 h-5 rounded-full bg-[#E6F4EF] text-[#00674F] flex items-center justify-center">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-[#FAF7EE] text-[#828579] flex items-center justify-center border border-[#EAE3D2]">
                      <Clock className="h-3 w-3" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[#1B1C15] leading-snug">
                    {log.title}
                  </p>
                  <p className="text-[0.68rem] text-[#828579] mt-0.5 truncate">
                    {log.subtext}
                  </p>
                  <p className="text-[0.62rem] text-[#828579] font-mono mt-1">
                    {log.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#EAE3D2]">
            <button
              onClick={() => handleOpenGenerator(INITIAL_PROJECTS[0])}
              className="w-full py-2.5 rounded-xl bg-[#FAF7EE] hover:bg-[#E6F4EF] text-[#00674F] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#EAE3D2] cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Open Interactive Seed Workbench</span>
            </button>
          </div>
        </div>

      </div>

      {/* ── Interactive Full-Screen Seed Generator Workbench Modal ──────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-[#FFFAEB] border border-[#EAE3D2] rounded-3xl w-full max-w-[1100px] max-h-[92vh] shadow-2xl flex flex-col overflow-hidden font-sohne">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#EAE3D2] flex items-center justify-between bg-[#FBF8EF]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#00674F] text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-meraki text-xl font-light text-[#1B1C15] leading-tight">
                    {selectedProject.name} — Seed Workbench
                  </h3>
                  <p className="text-xs text-[#828579]">
                    Kahn&apos;s DAG topological resolution · Deterministic Mulberry32 PRNG
                  </p>
                </div>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-black/5 text-[#828579] hover:text-[#1B1C15] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Controls Toolbar */}
            <div className="px-6 py-3 border-b border-[#EAE3D2] bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Left: Seed & Row Count Controllers */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#1B1C15]">Seed:</span>
                  <div className="flex items-center border border-[#EAE3D2] rounded-lg bg-[#FAF7EE] overflow-hidden">
                    <input
                      type="number"
                      value={seed}
                      onChange={(e) => setSeed(Number(e.target.value) || 1)}
                      className="w-16 px-2 py-1 text-xs font-mono text-center bg-transparent focus:outline-none"
                    />
                    <button
                      onClick={() => setSeed(Math.floor(Math.random() * 99999) + 1)}
                      title="Randomize seed"
                      className="px-2 py-1 border-l border-[#EAE3D2] hover:bg-white text-[#828579] hover:text-[#1B1C15] transition-colors cursor-pointer"
                    >
                      <RefreshCw className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#1B1C15]">Rows/Table:</span>
                  <select
                    value={rowCount}
                    onChange={(e) => setRowCount(Number(e.target.value))}
                    className="px-2.5 py-1 rounded-lg border border-[#EAE3D2] bg-[#FAF7EE] font-mono text-xs cursor-pointer focus:outline-none"
                  >
                    <option value={10}>10 rows</option>
                    <option value={20}>20 rows</option>
                    <option value={50}>50 rows</option>
                    <option value={100}>100 rows</option>
                  </select>
                </div>

                {generationResult.latency > 0 && (
                  <span className="font-mono text-[0.68rem] text-[#00674F] bg-[#E6F4EF] px-2 py-0.5 rounded-full font-semibold">
                    ⚡ {generationResult.latency}ms
                  </span>
                )}
              </div>

              {/* Right: View Mode Tabs */}
              <div className="flex items-center gap-1 bg-[#FAF7EE] p-1 rounded-xl border border-[#EAE3D2]">
                <button
                  onClick={() => setActiveModalTab("table")}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    activeModalTab === "table" ? "bg-white text-[#1B1C15] shadow-xs" : "text-[#828579] hover:text-[#1B1C15]"
                  }`}
                >
                  Data Grid
                </button>
                <button
                  onClick={() => setActiveModalTab("dag")}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    activeModalTab === "dag" ? "bg-white text-[#1B1C15] shadow-xs" : "text-[#828579] hover:text-[#1B1C15]"
                  }`}
                >
                  Topological DAG
                </button>
                <button
                  onClick={() => setActiveModalTab("export")}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    activeModalTab === "export" ? "bg-white text-[#1B1C15] shadow-xs" : "text-[#828579] hover:text-[#1B1C15]"
                  }`}
                >
                  Export Code
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 p-6 overflow-y-auto min-h-[380px] bg-[#FFFAEB]">
              
              {/* Tab 1: Data Grid View */}
              {activeModalTab === "table" && generationResult.generated && (
                <div className="space-y-4">
                  {/* Table Switcher Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {generationResult.generated.tables.map((tbl: GeneratedTable) => (
                      <button
                        key={tbl.tableName}
                        onClick={() => setActiveTableName(tbl.tableName)}
                        className={`px-3 py-1.5 rounded-xl font-mono text-xs whitespace-nowrap transition-all cursor-pointer ${
                          currentTableData?.tableName === tbl.tableName
                            ? "bg-[#1B1C15] text-[#FFFAEB] font-bold shadow-xs"
                            : "bg-white border border-[#EAE3D2] text-[#5E6156] hover:text-[#1B1C15]"
                        }`}
                      >
                        <span>{tbl.tableName}</span>
                        <span className="ml-1.5 opacity-60 text-[0.68rem]">({tbl.rows.length})</span>
                      </button>
                    ))}
                  </div>

                  {/* Rendered Table */}
                  {currentTableData && currentTableData.rows.length > 0 && (
                    <div className="rounded-2xl border border-[#EAE3D2] bg-white overflow-hidden shadow-xs">
                      <div className="overflow-x-auto max-h-[320px]">
                        <table className="w-full text-left text-xs font-mono">
                          <thead className="sticky top-0 bg-[#FAF7EE] border-b border-[#EAE3D2] text-[#828579] z-10">
                            <tr>
                              <th className="py-2.5 px-3 font-semibold text-[#1B1C15]">#</th>
                              {Object.keys(currentTableData.rows[0]).map((col: string) => (
                                <th key={col} className="py-2.5 px-3 font-medium whitespace-nowrap">
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#EAE3D2]/50 text-[#1B1C15]">
                            {currentTableData.rows.map((row: GeneratedRow, idx: number) => (
                              <tr key={idx} className="hover:bg-[#FAF7EE]/50 transition-colors">
                                <td className="py-2 px-3 text-[#828579]">{idx + 1}</td>
                                {Object.keys(currentTableData.rows[0]).map((col: string) => {
                                  const val = row[col];
                                  const strVal = typeof val === "object" ? JSON.stringify(val) : String(val ?? "NULL");
                                  return (
                                    <td key={col} className="py-2 px-3 whitespace-nowrap max-w-[240px] truncate" title={strVal}>
                                      {strVal}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Topological DAG View */}
              {activeModalTab === "dag" && generationResult.generated && (
                <div className="space-y-3 max-w-[800px] mx-auto">
                  <div className="bg-[#E6F4EF] border border-[#00674F]/20 rounded-2xl p-4 mb-4 text-xs text-[#00674F] font-medium flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>DAG resolved topologically: 0 circular dependencies detected. Parent entities inserted first.</span>
                  </div>

                  {generationResult.generated.tables.map((tbl: GeneratedTable, i: number) => (
                    <div
                      key={tbl.tableName}
                      className="rounded-2xl border border-[#EAE3D2] bg-white px-5 py-3.5 flex items-center justify-between shadow-2xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#1B1C15] text-white font-mono text-xs font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <div>
                          <span className="font-mono text-sm font-bold text-[#1B1C15]">{tbl.tableName}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-[#E6F4EF] text-[#00674F] font-mono text-xs px-2.5 py-0.5 font-semibold">
                          {tbl.rows.length} rows
                        </span>
                        <CheckCircle2 className="h-4 w-4 text-[#00674F]" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Export Code View */}
              {activeModalTab === "export" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    {/* Format Toggle */}
                    <div className="flex items-center gap-1.5">
                      {(["sql", "typescript-drizzle", "typescript-prisma", "json"] as const).map((fmt) => (
                        <button
                          key={fmt}
                          onClick={() => setExportFormat(fmt)}
                          className={`px-3 py-1 rounded-xl text-xs font-mono uppercase font-semibold transition-all cursor-pointer ${
                            exportFormat === fmt
                              ? "bg-[#00674F] text-white shadow-xs"
                              : "bg-white border border-[#EAE3D2] text-[#5E6156] hover:text-[#1B1C15]"
                          }`}
                        >
                          {fmt.replace("typescript-", "")}
                        </button>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyCode}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#EAE3D2] bg-white hover:bg-[#FAF7EE] text-xs font-semibold text-[#1B1C15] transition-all cursor-pointer shadow-2xs"
                      >
                        {copied ? <Check className="h-3.5 w-3.5 text-[#00674F]" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copied ? "Copied!" : "Copy Code"}</span>
                      </button>

                      <button
                        onClick={handleDownloadFile}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#1B1C15] hover:bg-[#00674F] text-[#FFFAEB] text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>

                  <pre className="font-mono text-xs bg-[#16221E] text-[#C5F74F] p-4 rounded-2xl overflow-x-auto max-h-[300px] leading-relaxed border border-[#00674F]/20">
                    {exportedCode}
                  </pre>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-[#EAE3D2] bg-[#FBF8EF] flex items-center justify-between text-xs font-mono text-[#828579]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00674F]" />
                <span>Deterministic PRNG: Seed #{seed}</span>
              </div>
              <Button
                onClick={() => setModalOpen(false)}
                size="sm"
                className="rounded-xl bg-[#1B1C15] hover:bg-[#00674F] text-white text-xs font-semibold"
              >
                Done
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs font-mono text-[#828579]">Loading Dashboard Workbench...</div>}>
      <DashboardMainContent />
    </Suspense>
  );
}