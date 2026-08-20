/**
 * TypeScript Exporter
 *
 * Converts GenerationResult into runnable TypeScript seed scripts
 * targeting Drizzle ORM (primary) or plain SQL INSERT statements.
 */

import type { GenerationResult, ExportFormat, ExportResult, GeneratedRow } from "@/types/generator";

function formatValue(v: string | number | boolean | null): string {
  if (v === null) return "null";
  if (typeof v === "boolean") return String(v);
  if (typeof v === "number") return String(v);
  // Escape single quotes in strings
  return `"${String(v).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, ch: string) => ch.toUpperCase());
}

function toPascalCase(str: string): string {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

// ─── TypeScript / Drizzle ────────────────────────────────────────────────────

function exportTypescriptDrizzle(result: GenerationResult): string {
  const lines: string[] = [
    `/**`,
    ` * Relix — Generated Seed Script (Drizzle ORM)`,
    ` * Seed value: ${result.seed}`,
    ` * Generated: ${new Date().toISOString()}`,
    ` *`,
    ` * Usage: Run with \`npx tsx seed.ts\` or add to your db/seed.ts`,
    ` */`,
    ``,
    `import { db } from "@/lib/db";`,
    `import * as schema from "@/lib/db/schema";`,
    ``,
    `async function seed() {`,
    `  console.log("🌱 Seeding database...");`,
    `  const start = Date.now();`,
    ``,
  ];

  for (const table of result.tables) {
    if (table.rows.length === 0) continue;
    const varName = toCamelCase(table.tableName) + "Data";
    const schemaName = toCamelCase(table.tableName);

    lines.push(`  // ─── ${toPascalCase(table.tableName)} (${table.rows.length} records) ─────────────────────────`);
    lines.push(`  const ${varName} = [`);

    for (const row of table.rows) {
      const entries = Object.entries(row)
        .map(([k, v]) => `      ${toCamelCase(k)}: ${formatValue(v)}`)
        .join(",\n");
      lines.push(`    {`);
      lines.push(entries);
      lines.push(`    },`);
    }

    lines.push(`  ];`);
    lines.push(`  await db.insert(schema.${schemaName}).values(${varName}).onConflictDoNothing();`);
    lines.push(`  console.log(\`  ✓ ${table.tableName}: \${${varName}.length} records\`);`);
    lines.push(``);
  }

  lines.push(`  console.log(\`✅ Seed complete in \${Date.now() - start}ms\`);`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`seed().catch((err) => {`);
  lines.push(`  console.error("❌ Seed failed:", err);`);
  lines.push(`  process.exit(1);`);
  lines.push(`});`);

  return lines.join("\n");
}

// ─── TypeScript / Prisma ─────────────────────────────────────────────────────

function exportTypescriptPrisma(result: GenerationResult): string {
  const lines: string[] = [
    `/**`,
    ` * Relix — Generated Seed Script (Prisma)`,
    ` * Seed value: ${result.seed}`,
    ` * Generated: ${new Date().toISOString()}`,
    ` */`,
    ``,
    `import { PrismaClient } from "@prisma/client";`,
    ``,
    `const prisma = new PrismaClient();`,
    ``,
    `async function seed() {`,
    `  console.log("🌱 Seeding database...");`,
    ``,
  ];

  for (const table of result.tables) {
    if (table.rows.length === 0) continue;
    const modelName = toCamelCase(table.tableName);

    lines.push(`  // ${toPascalCase(table.tableName)} — ${table.rows.length} records`);
    lines.push(`  await prisma.${modelName}.createMany({`);
    lines.push(`    data: [`);

    for (const row of table.rows) {
      const entries = Object.entries(row)
        .map(([k, v]) => `        ${toCamelCase(k)}: ${formatValue(v)}`)
        .join(",\n");
      lines.push(`      {`);
      lines.push(entries);
      lines.push(`      },`);
    }

    lines.push(`    ],`);
    lines.push(`    skipDuplicates: true,`);
    lines.push(`  });`);
    lines.push(`  console.log("  ✓ ${table.tableName}");`);
    lines.push(``);
  }

  lines.push(`  console.log("✅ Seed complete");`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`seed()`);
  lines.push(`  .catch(console.error)`);
  lines.push(`  .finally(() => prisma.$disconnect());`);

  return lines.join("\n");
}

// ─── SQL INSERT ───────────────────────────────────────────────────────────────

function sqlValue(v: string | number | boolean | null): string {
  if (v === null) return "NULL";
  if (typeof v === "boolean") return v ? "TRUE" : "FALSE";
  if (typeof v === "number") return String(v);
  return `'${String(v).replace(/'/g, "''")}'`;
}

function exportSql(result: GenerationResult): string {
  const lines: string[] = [
    `-- Relix Generated Seed Script (SQL)`,
    `-- Seed value: ${result.seed}`,
    `-- Generated: ${new Date().toISOString()}`,
    ``,
    `BEGIN;`,
    ``,
  ];

  for (const table of result.tables) {
    if (table.rows.length === 0) continue;
    const cols = Object.keys(table.rows[0]).join(", ");
    lines.push(`-- ${table.tableName} (${table.rows.length} records)`);

    for (const row of table.rows) {
      const vals = Object.values(row).map(sqlValue).join(", ");
      lines.push(`INSERT INTO ${table.tableName} (${cols}) VALUES (${vals}) ON CONFLICT DO NOTHING;`);
    }
    lines.push(``);
  }

  lines.push(`COMMIT;`);
  return lines.join("\n");
}

// ─── JSON ────────────────────────────────────────────────────────────────────

function exportJson(result: GenerationResult): string {
  return JSON.stringify(
    {
      meta: { seed: result.seed, generatedAt: new Date().toISOString() },
      tables: result.tables,
    },
    null,
    2
  );
}

// ─── CSV ─────────────────────────────────────────────────────────────────────

function csvEscape(v: string | number | boolean | null): string {
  if (v === null) return "";
  const s = String(v);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function exportCsv(result: GenerationResult): string {
  const sections: string[] = [];
  for (const table of result.tables) {
    if (table.rows.length === 0) continue;
    const headers = Object.keys(table.rows[0]).join(",");
    const rows = table.rows.map((r) => Object.values(r).map(csvEscape).join(",")).join("\n");
    sections.push(`# Table: ${table.tableName}\n${headers}\n${rows}`);
  }
  return sections.join("\n\n");
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function exportData(result: GenerationResult, format: ExportFormat): ExportResult {
  try {
    let content: string;
    let filename: string;

    switch (format) {
      case "typescript-drizzle":
        content = exportTypescriptDrizzle(result);
        filename = "seed.ts";
        break;
      case "typescript-prisma":
        content = exportTypescriptPrisma(result);
        filename = "seed.ts";
        break;
      case "sql":
        content = exportSql(result);
        filename = "seed.sql";
        break;
      case "json":
        content = exportJson(result);
        filename = "seed-data.json";
        break;
      case "csv":
        content = exportCsv(result);
        filename = "seed-data.csv";
        break;
      default:
        return { ok: false, error: `Unsupported export format: ${format}` };
    }

    return { ok: true, content, filename };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Export failed",
    };
  }
}
