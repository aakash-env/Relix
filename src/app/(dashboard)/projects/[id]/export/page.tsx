"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Copy, Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { parseSchema } from "@/lib/engine/parser";
import { generateData, buildDefaultConfig } from "@/lib/engine/generator";
import { exportData } from "@/lib/engine/exporter";
import { AI_SAAS_PRESET } from "@/lib/engine/presets/ai-saas";
import type { ExportFormat } from "@/types/generator";

const FORMATS: { id: ExportFormat; label: string; badge: string; ext: string }[] = [
  { id: "typescript-drizzle", label: "TypeScript (Drizzle)", badge: "Primary", ext: ".ts" },
  { id: "typescript-prisma", label: "TypeScript (Prisma)", badge: "", ext: ".ts" },
  { id: "sql", label: "SQL INSERT", badge: "", ext: ".sql" },
  { id: "json", label: "JSON", badge: "", ext: ".json" },
  { id: "csv", label: "CSV", badge: "", ext: ".csv" },
];

function generateExportContent(format: ExportFormat): string {
  const parsed = parseSchema(AI_SAAS_PRESET.schema);
  const config = buildDefaultConfig(parsed, 42);
  config.entities = config.entities.map((e) => ({ ...e, count: Math.min(e.count, 5) }));
  const result = generateData(parsed, config);
  const exported = exportData(result, format);
  return exported.ok ? exported.content : `// Export error: ${exported.error}`;
}

export default function ExportPage() {
  const [format, setFormat] = useState<ExportFormat>("typescript-drizzle");
  const [copied, setCopied] = useState(false);

  const content = useMemo(() => generateExportContent(format), [format]);
  const currentFormat = FORMATS.find((f) => f.id === format) || FORMATS[0];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `seed${currentFormat.ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[#6b6460] mb-6" aria-label="Breadcrumb">
        <Link href="/projects" className="hover:text-[#1c1a18]">Projects</Link>
        <span>/</span>
        <Link href="preview" className="hover:text-[#1c1a18]">Preview</Link>
        <span>/</span>
        <span className="text-[#1c1a18] font-medium">Export</span>
      </nav>

      {/* Step tabs */}
      <div className="flex items-center gap-0 mb-8 rounded-lg border border-[#e8e4dc] overflow-hidden bg-white w-fit">
        {[
          { label: "Schema", href: "schema", active: false },
          { label: "Generate", href: "generate", active: false },
          { label: "Preview", href: "preview", active: false },
          { label: "Export", href: "export", active: true },
        ].map((step) => (
          <Link key={step.href} href={step.href}
            className={cn("px-4 py-2 text-sm font-medium border-r border-[#e8e4dc] last:border-r-0 transition-colors",
              step.active ? "bg-[#1c1a18] text-white" : "text-[#6b6460] hover:text-[#1c1a18] hover:bg-[#f4f0e8]"
            )}>{step.label}</Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Format selector */}
        <div className="flex flex-col gap-3">
          <h1 className="text-lg font-semibold text-[#1c1a18]">Export format</h1>
          {FORMATS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFormat(f.id)}
              aria-pressed={format === f.id}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all",
                format === f.id
                  ? "border-[#6366f1] bg-[#eef2ff] text-[#4338ca]"
                  : "border-[#e8e4dc] bg-white text-[#3d3a36] hover:border-[#c8c0b4]"
              )}
            >
              <span className="flex-1">{f.label}</span>
              {f.badge && (
                <Badge variant="default" className="text-[0.6rem] shrink-0">{f.badge}</Badge>
              )}
            </button>
          ))}

          <div className="flex flex-col gap-2 mt-2">
            <Button onClick={handleCopy} variant="outline" className="w-full justify-start" id="export-copy">
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy to clipboard"}
            </Button>
            <Button onClick={handleDownload} className="w-full justify-start" id="export-download">
              <Download className="h-4 w-4" />
              Download{" "}<span className="font-mono text-xs opacity-80">{`seed${currentFormat.ext}`}</span>
            </Button>
          </div>
        </div>

        {/* Code output */}
        <div className="lg:col-span-3 rounded-xl overflow-hidden shadow-lg">
          <div className="code-panel h-full flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 shrink-0">
              <div className="flex gap-1.5" aria-hidden="true">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <span className="text-xs text-white/30 font-mono">
                seed{currentFormat.ext} — Relix generated
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/80 transition-colors"
                aria-label="Copy to clipboard"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="flex-1 overflow-auto max-h-[600px]">
              <pre className="p-5 text-[0.76rem] leading-relaxed text-[#e2ddd6] font-mono whitespace-pre">
                {content}
              </pre>
            </div>
            {/* Footer */}
            <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between shrink-0">
              <span className="text-xs text-white/30">{content.split("\n").length} lines · {(content.length / 1024).toFixed(1)} KB</span>
              <div className="flex items-center gap-1.5 text-xs text-green-400/70">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Ready to run
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
