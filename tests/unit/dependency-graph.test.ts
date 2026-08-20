import { describe, it, expect } from "vitest";
import { parseSqlDdl } from "@/lib/engine/parser";
import { buildDependencyGraph } from "@/lib/engine/dependency-graph";

describe("Dependency Graph & Topological Sort", () => {
  it("sorts parent tables before child tables", () => {
    const sql = `
      CREATE TABLE messages (
        id UUID PRIMARY KEY,
        conversation_id UUID REFERENCES conversations(id)
      );

      CREATE TABLE users (
        id UUID PRIMARY KEY,
        name TEXT NOT NULL
      );

      CREATE TABLE conversations (
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id)
      );
    `;

    const schema = parseSqlDdl(sql);
    const { order, cycles } = buildDependencyGraph(schema);

    expect(cycles).toHaveLength(0);

    const userIndex = order.indexOf("users");
    const convIndex = order.indexOf("conversations");
    const msgIndex = order.indexOf("messages");

    expect(userIndex).toBeLessThan(convIndex);
    expect(convIndex).toBeLessThan(msgIndex);
  });

  it("handles standalone independent tables gracefully", () => {
    const sql = `
      CREATE TABLE plans (id UUID PRIMARY KEY, name TEXT);
      CREATE TABLE settings (id UUID PRIMARY KEY, val TEXT);
    `;

    const schema = parseSqlDdl(sql);
    const { order, cycles } = buildDependencyGraph(schema);

    expect(cycles).toHaveLength(0);
    expect(order).toContain("plans");
    expect(order).toContain("settings");
    expect(order).toHaveLength(2);
  });
});
