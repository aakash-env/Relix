"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { parseSchema } from "@/lib/engine/parser";
import { generateData, buildDefaultConfig } from "@/lib/engine/generator";
import { AI_SAAS_PRESET } from "@/lib/engine/presets/ai-saas";
import type { GeneratedTable } from "@/types/generator";

// Generate demo data for the preview
function getDemoData(): GeneratedTable[] {
  const parsed = parseSchema(AI_SAAS_PRESET.schema);
  const config = buildDefaultConfig(parsed, 42);
  // Limit to small counts for preview
  config.entities = config.entities.map((e) => ({
    ...e,
    count: Math.min(e.count, 10),
  }));
  const result = generateData(parsed, config);
  return result.tables;
}

function truncate(v: unknown, maxLen = 32): string {
  if (v === null || v === undefined) return "null";
  const s = String(v);
  return s.length > maxLen ? s.slice(0, maxLen) + "…" : s;
}

export default function PreviewPage() {
  const demoTables = useMemo(() => getDemoData(), []);
  const [activeTable, setActiveTable] = useState("users");
  const [search, setSearch] = useState("");

  const currentTable = demoTables.find((t) => t.tableName === activeTable) || demoTables[0];

  const filteredRows = useMemo(() => {
    if (!currentTable) return [];
    if (!search.trim()) return currentTable.rows;
    const q = search.toLowerCase();
    return currentTable.rows.filter((row) =>
      Object.values(row).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [currentTable, search]);

  const columns = currentTable?.rows[0] ? Object.keys(currentTable.rows[0]) : [];

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[#6b6460] mb-6" aria-label="Breadcrumb">
        <Link href="/projects" className="hover:text-[#1c1a18]">Projects</Link>
        <span>/</span>
        <Link href="generate" className="hover:text-[#1c1a18]">Generate</Link>
        <span>/</span>
        <span className="text-[#1c1a18] font-medium">Preview</span>
      </nav>

      {/* Step tabs */}
      <div className="flex items-center gap-0 mb-8 rounded-lg border border-[#e8e4dc] overflow-hidden bg-white w-fit">
        {[
          { label: "Schema", href: "schema", active: false },
          { label: "Generate", href: "generate", active: false },
          { label: "Preview", href: "preview", active: true },
          { label: "Export", href: "export", active: false },
        ].map((step) => (
          <Link key={step.href} href={step.href}
            className={cn("px-4 py-2 text-sm font-medium border-r border-[#e8e4dc] last:border-r-0 transition-colors",
              step.active ? "bg-[#1c1a18] text-white" : "text-[#6b6460] hover:text-[#1c1a18] hover:bg-[#f4f0e8]"
            )}>{step.label}</Link>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-[#1c1a18]">Data preview</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b6460]" aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search rows…"
              className="h-9 pl-9 pr-3 rounded-lg border border-[#c8c0b4] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48"
              aria-label="Search table rows"
            />
          </div>
          <Button asChild size="sm" id="preview-next-export">
            <Link href="export">
              Export data
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Table list sidebar */}
        <nav
          className="w-48 shrink-0 rounded-xl border border-[#e8e4dc] bg-white overflow-hidden h-fit"
          aria-label="Table selector"
        >
          <div className="px-4 py-3 border-b border-[#e8e4dc] text-xs font-semibold uppercase tracking-wider text-[#6b6460]">
            Tables
          </div>
          <ul>
            {demoTables.map((table) => (
              <li key={table.tableName}>
                <button
                  onClick={() => { setActiveTable(table.tableName); setSearch(""); }}
                  aria-current={activeTable === table.tableName ? "true" : undefined}
                  className={cn(
                    "w-full text-left px-4 py-2.5 text-sm transition-colors",
                    activeTable === table.tableName
                      ? "bg-[#1c1a18] text-white font-medium"
                      : "text-[#3d3a36] hover:bg-[#f4f0e8]"
                  )}
                >
                  <span className="font-mono truncate block">{table.tableName}</span>
                  <span className={cn("text-xs", activeTable === table.tableName ? "text-white/50" : "text-[#c8c0b4]")}>
                    {table.rows.length} rows
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Data table */}
        <div className="flex-1 rounded-xl border border-[#e8e4dc] bg-white overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#e8e4dc] bg-[#faf8f4]">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium font-mono text-[#1c1a18]">{activeTable}</span>
              <Badge variant="secondary">{filteredRows.length} rows</Badge>
            </div>
            {filteredRows.length < (currentTable?.rows.length ?? 0) && (
              <span className="text-xs text-[#6b6460]">
                Showing {filteredRows.length} of {currentTable?.rows.length} rows
              </span>
            )}
          </div>
          <div className="overflow-auto max-h-[520px]">
            {columns.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#6b6460]">No data</div>
            ) : (
              <table className="data-table" aria-label={`${activeTable} data`}>
                <thead>
                  <tr>
                    {columns.map((col) => (
                      <th key={col} scope="col">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row, i) => (
                    <tr key={i}>
                      {columns.map((col) => (
                        <td key={col} className="max-w-[200px]">
                          {row[col] === null ? (
                            <span className="text-[#c8c0b4] italic">null</span>
                          ) : typeof row[col] === "boolean" ? (
                            <Badge variant={row[col] ? "success" : "secondary"}>
                              {String(row[col])}
                            </Badge>
                          ) : (
                            <span title={String(row[col])}>{truncate(row[col])}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
