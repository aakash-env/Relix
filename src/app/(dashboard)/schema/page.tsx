"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Database,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Download,
  CheckCircle2,
  Code2,
  FileCode2,
  Layers,
  ArrowLeft,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { parseSqlDdl } from "@/lib/engine/parser";
import { generateData, buildDefaultConfig } from "@/lib/engine/generator";
import { exportData } from "@/lib/engine/exporter";
import { AI_SAAS_SCHEMA } from "@/lib/engine/presets/ai-saas";
import { ECOMMERCE_SCHEMA } from "@/lib/engine/presets/ecommerce";
import type { GeneratedTable, GeneratedRow } from "@/types/generator";

const B2B_SCHEMA = `-- Relix B2B Workspaces Preset Schema
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  plan VARCHAR(50) DEFAULT 'pro',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'developer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE workspace_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  title VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'in_progress',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE project_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES workspace_projects(id),
  assignee_id UUID REFERENCES team_members(id),
  title VARCHAR(255) NOT NULL,
  priority VARCHAR(50) DEFAULT 'high',
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE activity_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  actor_id UUID REFERENCES team_members(id),
  action_type VARCHAR(100) NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

export default function SchemaEditorPage() {
  const router = useRouter();
  const [ddlText, setDdlText] = useState(AI_SAAS_SCHEMA);
  const [projectName, setProjectName] = useState("New Schema Project");
  const [seed, setSeed] = useState(42);
  const [rowCount, setRowCount] = useState(25);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"editor" | "preview" | "dag" | "export">("editor");
  const [exportFormat, setExportFormat] = useState<"sql" | "typescript-drizzle" | "typescript-prisma" | "json">("sql");

  // Live schema parsing & seed generation
  const parseResult = useMemo(() => {
    try {
      const parsed = parseSqlDdl(ddlText);
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
      const msg = e instanceof Error ? e.message : "Invalid SQL DDL syntax";
      return { parsed: null, generated: null, latency: 0, error: msg };
    }
  }, [ddlText, seed, rowCount]);

  const [activeTableName, setActiveTableName] = useState<string>("");

  const currentTableData = useMemo(() => {
    if (!parseResult.generated || parseResult.generated.tables.length === 0) return null;
    return (
      parseResult.generated.tables.find((t: GeneratedTable) => t.tableName === activeTableName) ||
      parseResult.generated.tables[0]
    );
  }, [parseResult, activeTableName]);

  // Export Code output
  const exportedCode = useMemo(() => {
    if (!parseResult.generated) return "";
    const res = exportData(parseResult.generated, exportFormat);
    return res.ok ? res.content : res.error || "-- Export failed";
  }, [parseResult, exportFormat]);

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
    a.download = `relix-${projectName.toLowerCase().replace(/\s+/g, "-")}-seed-${seed}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-[1400px] w-full mx-auto space-y-6 font-sohne select-none">
      
      {/* ── Top Header Row ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE3D2] pb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl border border-[#EAE3D2] bg-white hover:bg-[#FAF7EE] text-[#5E6156] hover:text-[#1B1C15] transition-colors"
            title="Back to dashboard"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="font-meraki text-2xl sm:text-3xl font-light text-[#1B1C15] tracking-tight bg-transparent border-b border-transparent hover:border-[#EAE3D2] focus:border-[#00674F] focus:outline-none px-1 rounded transition-colors"
              />
            </div>
            <p className="text-xs text-[#828579] mt-0.5 px-1">
              PostgreSQL DDL Schema Studio · Deterministic Topological Generator
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Preset Buttons */}
          <div className="flex items-center gap-1 bg-white border border-[#EAE3D2] p-1 rounded-xl shadow-2xs">
            <span className="text-[0.68rem] font-bold text-[#828579] font-mono px-2 uppercase">
              Presets:
            </span>
            <button
              onClick={() => {
                setDdlText(AI_SAAS_SCHEMA);
                setProjectName("AI SaaS Dashboard");
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold hover:bg-[#FAF7EE] text-[#1B1C15] cursor-pointer"
            >
              AI SaaS
            </button>
            <button
              onClick={() => {
                setDdlText(ECOMMERCE_SCHEMA);
                setProjectName("Ecommerce Prototype");
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold hover:bg-[#FAF7EE] text-[#1B1C15] cursor-pointer"
            >
              Ecommerce
            </button>
            <button
              onClick={() => {
                setDdlText(B2B_SCHEMA);
                setProjectName("B2B Workspaces");
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold hover:bg-[#FAF7EE] text-[#1B1C15] cursor-pointer"
            >
              B2B Workspaces
            </button>
          </div>

          <Button
            onClick={() => setActiveTab("preview")}
            size="sm"
            className="rounded-xl bg-[#00674F] hover:bg-[#1B1C15] text-white text-xs font-semibold shadow-xs"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            <span>Generate Seeds</span>
          </Button>
        </div>
      </div>

      {/* ── Main Tab Navigation Bar ────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-[#EAE3D2] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("editor")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "editor"
                ? "bg-[#1B1C15] text-[#FFFAEB] shadow-xs"
                : "bg-white border border-[#EAE3D2] text-[#5E6156] hover:text-[#1B1C15]"
            }`}
          >
            1. SQL DDL Editor
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "preview"
                ? "bg-[#1B1C15] text-[#FFFAEB] shadow-xs"
                : "bg-white border border-[#EAE3D2] text-[#5E6156] hover:text-[#1B1C15]"
            }`}
          >
            2. Generated Data Grid
          </button>
          <button
            onClick={() => setActiveTab("dag")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "dag"
                ? "bg-[#1B1C15] text-[#FFFAEB] shadow-xs"
                : "bg-white border border-[#EAE3D2] text-[#5E6156] hover:text-[#1B1C15]"
            }`}
          >
            3. Kahn DAG Graph
          </button>
          <button
            onClick={() => setActiveTab("export")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "export"
                ? "bg-[#1B1C15] text-[#FFFAEB] shadow-xs"
                : "bg-white border border-[#EAE3D2] text-[#5E6156] hover:text-[#1B1C15]"
            }`}
          >
            4. Export Seed Code
          </button>
        </div>

        {/* PRNG Seed & Row controls */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[#1B1C15]">Seed:</span>
            <div className="flex items-center border border-[#EAE3D2] rounded-lg bg-white overflow-hidden shadow-2xs">
              <input
                type="number"
                value={seed}
                onChange={(e) => setSeed(Number(e.target.value) || 1)}
                className="w-16 px-2 py-1 text-xs font-mono text-center bg-transparent focus:outline-none"
              />
              <button
                onClick={() => setSeed(Math.floor(Math.random() * 99999) + 1)}
                title="Roll random seed"
                className="px-2 py-1 border-l border-[#EAE3D2] hover:bg-[#FAF7EE] text-[#828579] hover:text-[#1B1C15] transition-colors cursor-pointer"
              >
                <RefreshCw className="h-3 w-3" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[#1B1C15]">Rows:</span>
            <select
              value={rowCount}
              onChange={(e) => setRowCount(Number(e.target.value))}
              className="px-2.5 py-1 rounded-lg border border-[#EAE3D2] bg-white font-mono text-xs cursor-pointer shadow-2xs focus:outline-none"
            >
              <option value={10}>10 rows</option>
              <option value={25}>25 rows</option>
              <option value={50}>50 rows</option>
              <option value={100}>100 rows</option>
            </select>
          </div>

          {parseResult.latency > 0 && (
            <span className="font-mono text-[0.68rem] text-[#00674F] bg-[#E6F4EF] px-2.5 py-1 rounded-full font-semibold border border-[#00674F]/20">
              ⚡ {parseResult.latency}ms
            </span>
          )}
        </div>
      </div>

      {/* ── Error Banner if any ────────────────────────────────────────── */}
      {parseResult.error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-xs text-red-700 font-medium flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{parseResult.error}</span>
        </div>
      )}

      {/* ── Tab 1: SQL DDL Editor ──────────────────────────────────────── */}
      {activeTab === "editor" && (
        <div className="rounded-3xl border border-[#EAE3D2] bg-white p-6 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#EAE3D2] pb-3 text-xs text-[#828579] font-mono">
            <span>PostgreSQL Schema DDL (CREATE TABLE, ENUM, REFERENCES)</span>
            <span>{parseResult.parsed?.tables.length || 0} Tables detected</span>
          </div>
          <textarea
            value={ddlText}
            onChange={(e) => setDdlText(e.target.value)}
            rows={16}
            spellCheck={false}
            className="w-full font-mono text-xs bg-[#16221E] text-[#C5F74F] p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00674F] leading-relaxed shadow-inner"
            placeholder="Paste your CREATE TABLE DDL statements here..."
          />
        </div>
      )}

      {/* ── Tab 2: Generated Data Grid ─────────────────────────────────── */}
      {activeTab === "preview" && parseResult.generated && (
        <div className="rounded-3xl border border-[#EAE3D2] bg-white p-6 shadow-2xs space-y-4">
          {/* Table Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#EAE3D2] pb-3">
            {parseResult.generated.tables.map((tbl: GeneratedTable) => (
              <button
                key={tbl.tableName}
                onClick={() => setActiveTableName(tbl.tableName)}
                className={`px-3.5 py-1.5 rounded-xl font-mono text-xs whitespace-nowrap transition-all cursor-pointer ${
                  currentTableData?.tableName === tbl.tableName
                    ? "bg-[#00674F] text-white font-bold shadow-xs"
                    : "bg-[#FAF7EE] border border-[#EAE3D2] text-[#5E6156] hover:text-[#1B1C15]"
                }`}
              >
                <span>{tbl.tableName}</span>
                <span className="ml-1.5 opacity-70 text-[0.68rem]">({tbl.rows.length})</span>
              </button>
            ))}
          </div>

          {/* Table Data */}
          {currentTableData && currentTableData.rows.length > 0 && (
            <div className="rounded-2xl border border-[#EAE3D2] bg-white overflow-hidden shadow-xs">
              <div className="overflow-x-auto max-h-[420px]">
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

      {/* ── Tab 3: Kahn DAG Graph ──────────────────────────────────────── */}
      {activeTab === "dag" && parseResult.generated && (
        <div className="rounded-3xl border border-[#EAE3D2] bg-white p-6 shadow-2xs space-y-4 max-w-[900px] mx-auto">
          <div className="bg-[#E6F4EF] border border-[#00674F]/20 rounded-2xl p-4 text-xs text-[#00674F] font-medium flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Kahn DAG topological resolution: Parents populate before children. Zero foreign key violations.</span>
          </div>

          <div className="space-y-3">
            {parseResult.generated.tables.map((tbl: GeneratedTable, i: number) => (
              <div
                key={tbl.tableName}
                className="rounded-2xl border border-[#EAE3D2] bg-[#FAF7EE]/60 px-5 py-4 flex items-center justify-between shadow-2xs hover:border-[#1B1C15] transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#1B1C15] text-white font-mono text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div>
                    <span className="font-mono text-sm font-bold text-[#1B1C15]">{tbl.tableName}</span>
                    <span className="ml-2 text-xs font-mono text-[#828579]">
                      (Resolved Entity)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-[#E6F4EF] text-[#00674F] font-mono text-xs px-3 py-1 font-semibold border border-[#00674F]/20">
                    {tbl.rows.length} records
                  </span>
                  <CheckCircle2 className="h-4 w-4 text-[#00674F]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tab 4: Export Seed Code ────────────────────────────────────── */}
      {activeTab === "export" && (
        <div className="rounded-3xl border border-[#EAE3D2] bg-white p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            {/* Format Toggle */}
            <div className="flex items-center gap-1.5">
              {(["sql", "typescript-drizzle", "typescript-prisma", "json"] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setExportFormat(fmt)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase font-semibold transition-all cursor-pointer ${
                    exportFormat === fmt
                      ? "bg-[#00674F] text-white shadow-xs"
                      : "bg-[#FAF7EE] border border-[#EAE3D2] text-[#5E6156] hover:text-[#1B1C15]"
                  }`}
                >
                  {fmt.replace("typescript-", "")}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#EAE3D2] bg-[#FAF7EE] hover:bg-white text-xs font-semibold text-[#1B1C15] transition-all cursor-pointer shadow-2xs"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-[#00674F]" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied!" : "Copy Code"}</span>
              </button>

              <button
                onClick={handleDownloadFile}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#1B1C15] hover:bg-[#00674F] text-[#FFFAEB] text-xs font-semibold transition-all cursor-pointer shadow-2xs"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download File</span>
              </button>
            </div>
          </div>

          <pre className="font-mono text-xs bg-[#16221E] text-[#C5F74F] p-5 rounded-2xl overflow-x-auto max-h-[420px] leading-relaxed border border-[#00674F]/20 shadow-inner">
            {exportedCode}
          </pre>
        </div>
      )}

    </div>
  );
}
