import { describe, it, expect } from "vitest";
import { parseSqlDdl } from "@/lib/engine/parser";
import { generateData, buildDefaultConfig } from "@/lib/engine/generator";
import { AI_SAAS_SCHEMA } from "@/lib/engine/presets/ai-saas";

describe("Data Generator Engine", () => {
  it("produces deterministic output when given the same seed", () => {
    const schema = parseSqlDdl(AI_SAAS_SCHEMA);
    const configA = buildDefaultConfig(schema, 12345);
    const configB = buildDefaultConfig(schema, 12345);

    const resultA = generateData(schema, configA);
    const resultB = generateData(schema, configB);

    expect(resultA.tables).toEqual(resultB.tables);
  });

  it("produces different output when given different seeds", () => {
    const schema = parseSqlDdl(AI_SAAS_SCHEMA);
    const configA = buildDefaultConfig(schema, 111);
    const configB = buildDefaultConfig(schema, 999);

    const resultA = generateData(schema, configA);
    const resultB = generateData(schema, configB);

    expect(resultA.tables[0].rows[0]).not.toEqual(resultB.tables[0].rows[0]);
  });

  it("resolves foreign keys from parent tables", () => {
    const sql = `
      CREATE TABLE users (
        id UUID PRIMARY KEY,
        name TEXT NOT NULL
      );

      CREATE TABLE posts (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id),
        title TEXT NOT NULL
      );
    `;

    const schema = parseSqlDdl(sql);
    const config = buildDefaultConfig(schema, 42);
    config.entities = [
      { tableName: "users", count: 5, enabled: true },
      { tableName: "posts", count: 10, enabled: true },
    ];

    const result = generateData(schema, config);
    const usersTable = result.tables.find((t) => t.tableName === "users")!;
    const postsTable = result.tables.find((t) => t.tableName === "posts")!;

    expect(usersTable.rows).toHaveLength(5);
    expect(postsTable.rows).toHaveLength(10);

    const userIds = new Set(usersTable.rows.map((r) => r.id));
    for (const post of postsTable.rows) {
      expect(userIds.has(post.user_id as string)).toBe(true);
    }
  });
});
