import { describe, it, expect } from "vitest";
import { parseSqlDdl, parseSchema } from "@/lib/engine/parser";

describe("SQL DDL Parser", () => {
  it("parses single table with various column types and constraints", () => {
    const sql = `
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) NOT NULL UNIQUE,
        name TEXT NOT NULL,
        age INTEGER,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;

    const schema = parseSqlDdl(sql);
    expect(schema.tables).toHaveLength(1);
    expect(schema.tables[0].name).toBe("users");

    const cols = schema.tables[0].columns;
    expect(cols).toHaveLength(6);

    const idCol = cols.find((c) => c.name === "id")!;
    expect(idCol.type).toBe("uuid");
    expect(idCol.isPrimaryKey).toBe(true);
    expect(idCol.nullable).toBe(false);

    const emailCol = cols.find((c) => c.name === "email")!;
    expect(emailCol.type).toBe("varchar");
    expect(emailCol.isUnique).toBe(true);
    expect(emailCol.nullable).toBe(false);

    const ageCol = cols.find((c) => c.name === "age")!;
    expect(ageCol.type).toBe("integer");
    expect(ageCol.nullable).toBe(true);
  });

  it("parses enum types and references", () => {
    const sql = `
      CREATE TYPE user_role AS ENUM ('admin', 'editor', 'viewer');

      CREATE TABLE members (
        id UUID PRIMARY KEY,
        role user_role NOT NULL DEFAULT 'viewer'
      );
    `;

    const schema = parseSqlDdl(sql);
    expect(schema.enums).toHaveLength(1);
    expect(schema.enums[0].name).toBe("user_role");
    expect(schema.enums[0].values).toEqual(["admin", "editor", "viewer"]);

    const roleCol = schema.tables[0].columns.find((c) => c.name === "role")!;
    expect(roleCol.type).toBe("enum");
    expect(roleCol.enumValues).toEqual(["admin", "editor", "viewer"]);
  });

  it("extracts inline and standalone foreign key references", () => {
    const sql = `
      CREATE TABLE orgs (
        id UUID PRIMARY KEY,
        title VARCHAR(100) NOT NULL
      );

      CREATE TABLE users (
        id UUID PRIMARY KEY,
        org_id UUID NOT NULL REFERENCES orgs(id)
      );
    `;

    const schema = parseSqlDdl(sql);
    expect(schema.tables).toHaveLength(2);

    const usersTable = schema.tables.find((t) => t.name === "users")!;
    const orgIdCol = usersTable.columns.find((c) => c.name === "org_id")!;
    expect(orgIdCol.foreignKey).toEqual({
      table: "orgs",
      column: "id",
    });
  });

  it("handles comments gracefully", () => {
    const sql = `
      -- Single line comment
      /* Multi
         line
         comment */
      CREATE TABLE projects (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) -- inline comment
      );
    `;

    const schema = parseSchema(sql);
    expect(schema.tables).toHaveLength(1);
    expect(schema.tables[0].name).toBe("projects");
    expect(schema.tables[0].columns).toHaveLength(2);
  });
});
