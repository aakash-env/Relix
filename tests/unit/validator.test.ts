import { describe, it, expect } from "vitest";
import { parseSqlDdl } from "@/lib/engine/parser";
import { generateData, buildDefaultConfig } from "@/lib/engine/generator";
import { validateGeneratedData } from "@/lib/engine/validator";

describe("Validator Engine", () => {
  it("passes valid generated data with no errors", () => {
    const sql = `
      CREATE TABLE users (
        id UUID PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE
      );
    `;

    const schema = parseSqlDdl(sql);
    const config = buildDefaultConfig(schema, 42);
    config.entities = [{ tableName: "users", count: 10, enabled: true }];

    const result = generateData(schema, config);
    const errors = validateGeneratedData(schema, result);

    expect(errors).toHaveLength(0);
  });

  it("detects invalid foreign key values if data is corrupted", () => {
    const sql = `
      CREATE TABLE orgs (id UUID PRIMARY KEY);
      CREATE TABLE users (id UUID PRIMARY KEY, org_id UUID NOT NULL REFERENCES orgs(id));
    `;

    const schema = parseSqlDdl(sql);
    const config = buildDefaultConfig(schema, 42);
    config.entities = [
      { tableName: "orgs", count: 2, enabled: true },
      { tableName: "users", count: 3, enabled: true },
    ];

    const result = generateData(schema, config);

    // Corrupt one foreign key to a non-existent ID
    result.tables.find((t) => t.tableName === "users")!.rows[0].org_id = "00000000-0000-0000-0000-000000000000";

    const errors = validateGeneratedData(schema, result);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].columnName).toBe("org_id");
    expect(errors[0].message).toContain("Foreign key violation");
  });
});
