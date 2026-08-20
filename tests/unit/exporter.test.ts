import { describe, it, expect } from "vitest";
import { parseSqlDdl } from "@/lib/engine/parser";
import { generateData, buildDefaultConfig } from "@/lib/engine/generator";
import { exportData } from "@/lib/engine/exporter";

describe("Exporter Engine", () => {
  const sql = `
    CREATE TABLE users (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      email VARCHAR(255) NOT NULL
    );
  `;
  const schema = parseSqlDdl(sql);
  const config = buildDefaultConfig(schema, 42);
  config.entities = [{ tableName: "users", count: 2, enabled: true }];
  const result = generateData(schema, config);

  it("exports valid TypeScript (Drizzle ORM)", () => {
    const exported = exportData(result, "typescript-drizzle");
    expect(exported.ok).toBe(true);
    if (exported.ok) {
      expect(exported.filename).toBe("seed.ts");
      expect(exported.content).toContain('import { db } from "@/lib/db";');
      expect(exported.content).toContain("db.insert(schema.users)");
    }
  });

  it("exports valid TypeScript (Prisma)", () => {
    const exported = exportData(result, "typescript-prisma");
    expect(exported.ok).toBe(true);
    if (exported.ok) {
      expect(exported.filename).toBe("seed.ts");
      expect(exported.content).toContain('import { PrismaClient } from "@prisma/client";');
      expect(exported.content).toContain("prisma.users.createMany");
    }
  });

  it("exports valid SQL INSERT statements", () => {
    const exported = exportData(result, "sql");
    expect(exported.ok).toBe(true);
    if (exported.ok) {
      expect(exported.filename).toBe("seed.sql");
      expect(exported.content).toContain("BEGIN;");
      expect(exported.content).toContain("INSERT INTO users");
      expect(exported.content).toContain("COMMIT;");
    }
  });

  it("exports valid JSON", () => {
    const exported = exportData(result, "json");
    expect(exported.ok).toBe(true);
    if (exported.ok) {
      expect(exported.filename).toBe("seed-data.json");
      const parsed = JSON.parse(exported.content);
      expect(parsed.meta.seed).toBe(42);
      expect(parsed.tables[0].tableName).toBe("users");
    }
  });

  it("exports valid CSV", () => {
    const exported = exportData(result, "csv");
    expect(exported.ok).toBe(true);
    if (exported.ok) {
      expect(exported.filename).toBe("seed-data.csv");
      expect(exported.content).toContain("# Table: users");
      expect(exported.content).toContain("id,name,email");
    }
  });
});
