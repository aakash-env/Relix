"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, Zap, Upload, FileCode2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { parseSchema } from "@/lib/engine/parser";
import { AI_SAAS_PRESET } from "@/lib/engine/presets/ai-saas";
import type { ParsedSchema } from "@/types/schema";
import { cn } from "@/lib/utils";

const PLACEHOLDER_SQL = `-- Paste your PostgreSQL DDL here
-- Or click "Use AI SaaS preset" to start with a ready-made schema

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`;

export default function SchemaPage({ params }: { params: Promise<{ id: string }> }) {
  const [schemaText, setSchemaText] = useState(PLACEHOLDER_SQL);
  const [parsed, setParsed] = useState<ParsedSchema | null>(null);
  const [parsing, setParsing] = useState(false);

  const handleParse = useCallback(() => {
    setParsing(true);
    // Small delay for UX feedback
    setTimeout(() => {
      const result = parseSchema(schemaText);
      setParsed(result);
      setParsing(false);
    }, 300);
  }, [schemaText]);

  const handlePreset = () => {
    setSchemaText(AI_SAAS_PRESET.schema);
    setParsed(null);
  };

  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto">
      {/* Breadcrumb nav */}
      <nav className="flex items-center gap-2 text-sm text-[#6b6460] mb-6" aria-label="Breadcrumb">
        <Link href="/projects" className="hover:text-[#1c1a18]">Projects</Link>
        <span aria-hidden="true">/</span>
        <span className="text-[#1c1a18] font-medium">Schema</span>
      </nav>

      {/* Step tabs */}
      <div className="flex items-center gap-0 mb-8 rounded-lg border border-[#e8e4dc] overflow-hidden bg-white w-fit">
        {[
          { label: "Schema", href: "schema", active: true },
          { label: "Generate", href: "generate", active: false },
          { label: "Preview", href: "preview", active: false },
          { label: "Export", href: "export", active: false },
        ].map((step) => (
          <Link
            key={step.href}
            href={step.href}
            className={cn(
              "px-4 py-2 text-sm font-medium border-r border-[#e8e4dc] last:border-r-0 transition-colors",
              step.active
                ? "bg-[#1c1a18] text-white"
                : "text-[#6b6460] hover:text-[#1c1a18] hover:bg-[#f4f0e8]"
            )}
          >
            {step.label}
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Editor panel */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Toolbar */}
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-[#1c1a18]">Schema input</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreset}
                id="schema-use-preset"
              >
                <Zap className="h-3.5 w-3.5" />
                AI SaaS preset
              </Button>
              <Button
                variant="outline"
                size="sm"
                id="schema-upload"
                disabled
                title="File upload coming soon"
              >
                <Upload className="h-3.5 w-3.5" />
                Upload file
                <Badge variant="secondary" className="text-[0.6rem] ml-1">soon</Badge>
              </Button>
            </div>
          </div>

          {/* Code editor */}
          <div className="rounded-xl border border-[#e8e4dc] overflow-hidden shadow-sm">
            {/* Editor header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[#e8e4dc] bg-[#faf8f4]">
              <FileCode2 className="h-4 w-4 text-[#6b6460]" aria-hidden="true" />
              <span className="text-xs font-medium text-[#6b6460]">PostgreSQL DDL</span>
              <span className="ml-auto text-xs text-[#c8c0b4]">{schemaText.split("\n").length} lines</span>
            </div>
            {/* Textarea editor */}
            <div className="code-panel">
              <textarea
                id="schema-editor"
                value={schemaText}
                onChange={(e) => { setSchemaText(e.target.value); setParsed(null); }}
                className="w-full min-h-[400px] p-5 bg-transparent resize-none focus:outline-none text-[0.8125rem] leading-relaxed font-mono text-[#e2ddd6]"
                placeholder="Paste your SQL DDL here…"
                spellCheck={false}
                aria-label="SQL DDL schema editor"
                aria-describedby="schema-editor-hint"
              />
            </div>
            <p id="schema-editor-hint" className="sr-only">
              Paste PostgreSQL CREATE TABLE statements. Relix will parse tables, columns, and foreign key relationships.
            </p>
          </div>

          {/* Parse button */}
          <Button
            onClick={handleParse}
            loading={parsing}
            className="self-start"
            id="schema-parse"
          >
            {parsing ? "Parsing schema…" : "Parse schema"}
            {!parsing && <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>

        {/* Parse results panel */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-[#1c1a18]">Parse results</h2>

          {!parsed && (
            <div className="rounded-xl border border-[#e8e4dc] bg-white p-6 text-center flex flex-col items-center gap-3">
              <FileCode2 className="h-8 w-8 text-[#c8c0b4]" aria-hidden="true" />
              <p className="text-sm text-[#6b6460]">
                Paste your schema and click &ldquo;Parse schema&rdquo; to see detected tables, columns, and relationships.
              </p>
            </div>
          )}

          {parsed && (
            <div className="flex flex-col gap-3">
              {/* Summary */}
              <div className="rounded-xl border border-[#e8e4dc] bg-white p-4">
                <div className="flex items-center gap-2 mb-3">
                  {parsed.errors.length === 0 ? (
                    <CheckCircle2 className="h-4 w-4 text-[#4a7c59]" aria-hidden="true" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-amber-500" aria-hidden="true" />
                  )}
                  <span className="text-sm font-medium text-[#1c1a18]">
                    {parsed.errors.length === 0 ? "Schema valid" : `${parsed.errors.length} issue(s)`}
                  </span>
                  <Badge variant="secondary" className="ml-auto">{parsed.detectedFormat}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#f4f0e8] rounded-lg p-3">
                    <p className="text-[#6b6460]">Tables</p>
                    <p className="text-lg font-semibold text-[#1c1a18]">{parsed.tables.length}</p>
                  </div>
                  <div className="bg-[#f4f0e8] rounded-lg p-3">
                    <p className="text-[#6b6460]">Enums</p>
                    <p className="text-lg font-semibold text-[#1c1a18]">{parsed.enums.length}</p>
                  </div>
                </div>
              </div>

              {/* Errors */}
              {parsed.errors.length > 0 && (
                <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                  <h3 className="text-sm font-semibold text-amber-800 mb-2">Parse warnings</h3>
                  <ul className="flex flex-col gap-1.5">
                    {parsed.errors.map((err, i) => (
                      <li key={i} className="text-xs text-amber-700">
                        {err.line && <span className="font-mono">Line {err.line}: </span>}
                        {err.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tables list */}
              <div className="rounded-xl border border-[#e8e4dc] bg-white overflow-hidden">
                <div className="px-4 py-3 border-b border-[#e8e4dc] text-xs font-semibold uppercase tracking-wider text-[#6b6460]">
                  Detected tables
                </div>
                {parsed.tables.length === 0 ? (
                  <p className="px-4 py-4 text-sm text-[#6b6460]">No tables detected.</p>
                ) : (
                  <ul className="divide-y divide-[#f4f0e8]">
                    {parsed.tables.map((table) => {
                      const fkCols = table.columns.filter((c) => c.foreignKey).length;
                      return (
                        <li key={table.name} className="px-4 py-3">
                          <p className="text-sm font-medium text-[#1c1a18] font-mono">{table.name}</p>
                          <p className="text-xs text-[#6b6460] mt-0.5">
                            {table.columns.length} columns
                            {fkCols > 0 && ` · ${fkCols} FK${fkCols > 1 ? "s" : ""}`}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* Next step */}
              {parsed.tables.length > 0 && (
                <Button asChild className="w-full" id="schema-next-generate">
                  <Link href="generate">
                    Continue to generate
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
