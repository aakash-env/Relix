"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Zap, Settings2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { parseSchema } from "@/lib/engine/parser";
import { generateData, buildDefaultConfig } from "@/lib/engine/generator";
import { AI_SAAS_PRESET } from "@/lib/engine/presets/ai-saas";
import type { GenerationResult, EntityConfig } from "@/types/generator";

const DEFAULT_SCHEMA = AI_SAAS_PRESET.schema;

const LOCALES = [
  { value: "en-US", label: "English (US)" },
  { value: "en-GB", label: "English (UK)" },
  { value: "de-DE", label: "German" },
  { value: "fr-FR", label: "French" },
  { value: "es-ES", label: "Spanish" },
];

export default function GeneratePage() {
  const [seed, setSeed] = useState(42);
  const [locale, setLocale] = useState("en-US");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);

  // Parse the AI SaaS preset to get entities
  const parsed = parseSchema(DEFAULT_SCHEMA);
  const [entities, setEntities] = useState<EntityConfig[]>(
    buildDefaultConfig(parsed, seed).entities
  );

  const updateCount = (tableName: string, count: number) => {
    setEntities((prev) =>
      prev.map((e) => (e.tableName === tableName ? { ...e, count } : e))
    );
  };

  const toggleEntity = (tableName: string) => {
    setEntities((prev) =>
      prev.map((e) => (e.tableName === tableName ? { ...e, enabled: !e.enabled } : e))
    );
  };

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 100)); // tick for UI update
    try {
      const end = new Date();
      const start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
      const config = {
        seed,
        locale: locale as any,
        entities,
        dateRangeStart: start,
        dateRangeEnd: end,
        relationshipDepth: 3,
        preset: "ai-saas",
      };
      const generated = generateData(parsed, config);
      setResult(generated);
    } finally {
      setGenerating(false);
    }
  };

  const totalRecords = entities.filter((e) => e.enabled).reduce((s, e) => s + e.count, 0);

  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[#6b6460] mb-6" aria-label="Breadcrumb">
        <Link href="/projects" className="hover:text-[#1c1a18]">Projects</Link>
        <span>/</span>
        <Link href="schema" className="hover:text-[#1c1a18]">Schema</Link>
        <span>/</span>
        <span className="text-[#1c1a18] font-medium">Generate</span>
      </nav>

      {/* Step tabs */}
      <div className="flex items-center gap-0 mb-8 rounded-lg border border-[#e8e4dc] overflow-hidden bg-white w-fit">
        {[
          { label: "Schema", href: "schema", active: false },
          { label: "Generate", href: "generate", active: true },
          { label: "Preview", href: "preview", active: false },
          { label: "Export", href: "export", active: false },
        ].map((step) => (
          <Link key={step.href} href={step.href}
            className={cn("px-4 py-2 text-sm font-medium border-r border-[#e8e4dc] last:border-r-0 transition-colors",
              step.active ? "bg-[#1c1a18] text-white" : "text-[#6b6460] hover:text-[#1c1a18] hover:bg-[#f4f0e8]"
            )}>{step.label}</Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Configuration panel */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <h1 className="text-lg font-semibold text-[#1c1a18]">Generator configuration</h1>

          {/* Global settings */}
          <div className="rounded-xl border border-[#e8e4dc] bg-white p-5">
            <div className="flex items-center gap-2 mb-4">
              <Settings2 className="h-4 w-4 text-[#6b6460]" />
              <h2 className="font-semibold text-[#1c1a18]">Global settings</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="seed-input" className="block text-sm font-medium text-[#3d3a36] mb-1.5">
                  Seed value
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="seed-input"
                    type="number"
                    value={seed}
                    onChange={(e) => setSeed(Number(e.target.value))}
                    className="flex-1 h-10 rounded-lg border border-[#c8c0b4] px-3 text-sm font-mono text-[#1c1a18] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    min={0}
                    max={999999}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSeed(Math.floor(Math.random() * 100000))}
                    aria-label="Randomize seed"
                    className="shrink-0"
                  >
                    <Zap className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-[#6b6460] mt-1">Same seed = identical output every time.</p>
              </div>
              <div>
                <label htmlFor="locale-select" className="block text-sm font-medium text-[#3d3a36] mb-1.5">
                  Locale
                </label>
                <select
                  id="locale-select"
                  value={locale}
                  onChange={(e) => setLocale(e.target.value)}
                  className="w-full h-10 rounded-lg border border-[#c8c0b4] px-3 text-sm text-[#1c1a18] bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {LOCALES.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Entity controls */}
          <div className="rounded-xl border border-[#e8e4dc] bg-white overflow-hidden">
            <div className="px-5 py-4 border-b border-[#e8e4dc] flex items-center justify-between">
              <h2 className="font-semibold text-[#1c1a18]">Entities & record counts</h2>
              <Badge variant="secondary">{totalRecords.toLocaleString()} total records</Badge>
            </div>
            <div className="divide-y divide-[#f4f0e8]">
              {entities.map((entity) => (
                <div key={entity.tableName} className={cn("flex items-center gap-4 px-5 py-3.5",
                  !entity.enabled && "opacity-50"
                )}>
                  {/* Toggle */}
                  <label className="flex items-center cursor-pointer" aria-label={`Toggle ${entity.tableName}`}>
                    <input
                      type="checkbox"
                      checked={entity.enabled}
                      onChange={() => toggleEntity(entity.tableName)}
                      className="w-4 h-4 rounded accent-indigo-500"
                    />
                  </label>
                  {/* Table name */}
                  <span className="flex-1 text-sm font-mono text-[#1c1a18] truncate">{entity.tableName}</span>
                  {/* Count slider + input */}
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={1}
                      max={1000}
                      value={entity.count}
                      onChange={(e) => updateCount(entity.tableName, Number(e.target.value))}
                      disabled={!entity.enabled}
                      className="w-24 accent-indigo-500"
                      aria-label={`Record count for ${entity.tableName}`}
                    />
                    <input
                      type="number"
                      value={entity.count}
                      min={1}
                      max={10000}
                      onChange={(e) => updateCount(entity.tableName, Math.max(1, Number(e.target.value)))}
                      disabled={!entity.enabled}
                      className="w-16 h-7 rounded border border-[#c8c0b4] px-2 text-xs font-mono text-[#1c1a18] focus:outline-none focus:ring-1 focus:ring-indigo-500 text-center"
                      aria-label={`Exact count for ${entity.tableName}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions sidebar */}
        <div className="flex flex-col gap-4">
          {/* Generate card */}
          <div className="rounded-xl border border-[#e8e4dc] bg-white p-5">
            <h2 className="font-semibold text-[#1c1a18] mb-1">Ready to generate</h2>
            <p className="text-sm text-[#6b6460] mb-4">
              {entities.filter((e) => e.enabled).length} of {entities.length} entities enabled ·{" "}
              {totalRecords.toLocaleString()} total records
            </p>
            <Button
              onClick={handleGenerate}
              loading={generating}
              className="w-full mb-3"
              id="generate-run"
            >
              <Play className="h-4 w-4" />
              {generating ? "Generating…" : "Generate data"}
            </Button>
            {result && (
              <div className="bg-[#eef3ec] rounded-lg p-3 text-sm">
                <p className="text-[#2c4f38] font-medium flex items-center gap-1.5 mb-1">
                  ✓ Generated successfully
                </p>
                <p className="text-xs text-[#4a7c59]">
                  {result.tables.reduce((s, t) => s + t.rows.length, 0).toLocaleString()} records
                  in {result.durationMs}ms
                </p>
                <Button asChild size="sm" variant="forest" className="w-full mt-3" id="generate-next-preview">
                  <Link href="preview">
                    View preview
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="rounded-xl border border-[#e8e4dc] bg-[#faf8f4] p-4 text-xs text-[#6b6460] leading-relaxed">
            <p className="font-medium text-[#3d3a36] mb-1.5">How generation works</p>
            <ul className="list-disc list-inside flex flex-col gap-1">
              <li>Tables are generated in dependency order</li>
              <li>FK references always resolve to valid parent records</li>
              <li>Unique constraints are enforced</li>
              <li>Same seed = identical output</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
