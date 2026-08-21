import React from "react";
import Link from "next/link";
import { BookOpen, Zap, Database, FileCode2, Key, ArrowRight, Code2, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const sections = [
  {
    id: "quickstart",
    icon: <Zap className="h-5 w-5" />,
    title: "Quick start",
    content: [
      {
        heading: "1. Load a schema",
        body: "Navigate to any project and click the Schema tab. Paste your PostgreSQL DDL or click \"AI SaaS preset\" to load a ready-made 12-table schema covering users, orgs, conversations, messages, tokens, and billing.",
        code: `CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       VARCHAR(255) NOT NULL UNIQUE,
  name        VARCHAR(255) NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);`,
      },
      {
        heading: "2. Configure & generate",
        body: "On the Generate tab, set your seed value (same seed = identical data every run), pick a locale, and adjust per-table record counts. Click Generate data.",
        code: null,
      },
      {
        heading: "3. Preview & export",
        body: "Browse your generated rows in the Preview tab, then switch to Export to download as TypeScript (Drizzle or Prisma), SQL INSERTs, JSON, or CSV.",
        code: null,
      },
    ],
  },
  {
    id: "schema-format",
    icon: <Database className="h-5 w-5" />,
    title: "Schema format",
    content: [
      {
        heading: "Supported DDL syntax",
        body: "Relix parses standard PostgreSQL DDL. The following constructs are supported:",
        code: `-- Enums
CREATE TYPE user_role AS ENUM ('admin', 'member', 'viewer');

-- Tables with constraints
CREATE TABLE organizations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(255) NOT NULL,
  slug       VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Foreign key references
CREATE TABLE memberships (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  org_id  UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE
);`,
      },
    ],
  },
  {
    id: "export-formats",
    icon: <FileCode2 className="h-5 w-5" />,
    title: "Export formats",
    content: [
      {
        heading: "TypeScript — Drizzle ORM",
        body: "Generates ready-to-run seed scripts using Drizzle ORM's db.insert().values() API. Respects table insertion order.",
        code: `import { db } from "./db";
import { users } from "./schema";

await db.insert(users).values([
  { id: "uuid-1", email: "alice@acme.com", name: "Alice Chen" },
  { id: "uuid-2", email: "bob@acme.com",   name: "Bob Smith" },
]);`,
      },
      {
        heading: "TypeScript — Prisma",
        body: "Uses Prisma's prisma.model.createMany() pattern wrapped in a transaction.",
        code: null,
      },
      {
        heading: "SQL INSERT",
        body: "Plain PostgreSQL INSERT statements wrapped in BEGIN/COMMIT. Safe to run against any PostgreSQL-compatible database.",
        code: null,
      },
      {
        heading: "JSON & CSV",
        body: "Structured JSON with a metadata envelope, or multi-table CSV files for spreadsheet import or custom tooling.",
        code: null,
      },
    ],
  },
  {
    id: "api",
    icon: <Key className="h-5 w-5" />,
    title: "REST API",
    content: [
      {
        heading: "POST /api/generate",
        body: "Generate seed data programmatically. Pass your schema SQL and configuration, receive structured table data.",
        code: `curl -X POST https://relix.dev/api/generate \\
  -H "Authorization: Bearer <api_key>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "schema": "CREATE TABLE users (...);",
    "config": { "seed": 42, "entities": [{ "tableName": "users", "count": 50 }] }
  }'`,
      },
      {
        heading: "POST /api/export",
        body: "Convert generated data into a specific export format.",
        code: `curl -X POST https://relix.dev/api/export \\
  -H "Authorization: Bearer <api_key>" \\
  -H "Content-Type: application/json" \\
  -d '{ "format": "typescript-drizzle", "data": { ... } }'`,
      },
      {
        heading: "POST /api/schema/parse",
        body: "Parse a DDL string and return a structured JSON representation of tables, columns, enums, and relationships.",
        code: null,
      },
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="p-6 md:p-8 max-w-[900px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-[#1c1a18]">Documentation</h1>
          <p className="text-sm text-[#6b6460]">Everything you need to generate great seed data.</p>
        </div>
      </div>

      {/* Quick links */}
      <nav className="flex flex-wrap gap-2 my-6" aria-label="Documentation sections">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e8e4dc] bg-white text-sm text-[#3d3a36] hover:bg-[#f4f0e8] hover:border-[#c8c0b4] transition-colors"
          >
            {s.title}
          </a>
        ))}
      </nav>

      {/* Getting started CTA */}
      <div className="rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 p-5 mb-10 flex items-center gap-4">
        <Terminal className="h-8 w-8 text-indigo-500 shrink-0" />
        <div className="flex-1">
          <p className="font-semibold text-indigo-900 mb-0.5">Try the AI SaaS preset</p>
          <p className="text-sm text-indigo-700">
            Generate 1,000+ realistic relational records in under a second — no schema required.
          </p>
        </div>
        <Button asChild size="sm" id="docs-try-preset">
          <Link href="/projects/p1/generate">
            Try now <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-12">
        {sections.map((section) => (
          <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`}>
            {/* Section header */}
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-[#e8e4dc]">
              <span className="text-[#4a7c59]">{section.icon}</span>
              <h2
                id={`${section.id}-heading`}
                className="text-lg font-semibold text-[#1c1a18]"
              >
                {section.title}
              </h2>
            </div>

            {/* Sub-sections */}
            <div className="flex flex-col gap-6">
              {section.content.map((item) => (
                <div key={item.heading}>
                  <h3 className="text-sm font-semibold text-[#1c1a18] mb-1.5 flex items-center gap-2">
                    <Code2 className="h-3.5 w-3.5 text-[#6b6460]" />
                    {item.heading}
                  </h3>
                  <p className="text-sm text-[#6b6460] leading-relaxed mb-3">{item.body}</p>
                  {item.code && (
                    <div className="rounded-xl border border-[#e8e4dc] overflow-hidden">
                      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#e8e4dc] bg-[#faf8f4]">
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#e8e4dc]" />
                          <div className="w-2.5 h-2.5 rounded-full bg-[#e8e4dc]" />
                          <div className="w-2.5 h-2.5 rounded-full bg-[#e8e4dc]" />
                        </div>
                        <Badge variant="secondary" className="text-[0.6rem] ml-1">SQL / TypeScript</Badge>
                      </div>
                      <pre className="p-4 text-[0.8rem] leading-relaxed overflow-x-auto bg-[#1c1a18] text-[#d4cfc8] font-mono">
                        <code>{item.code}</code>
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Footer links */}
      <div className="mt-12 pt-6 border-t border-[#e8e4dc] flex flex-wrap gap-4 text-sm text-[#6366f1]">
        <Link href="/settings/api-keys" className="hover:underline flex items-center gap-1">
          <Key className="h-3.5 w-3.5" /> Get an API key
        </Link>
        <Link href="/projects/p1/schema" className="hover:underline flex items-center gap-1">
          <Database className="h-3.5 w-3.5" /> Open schema editor
        </Link>
      </div>
    </div>
  );
}
