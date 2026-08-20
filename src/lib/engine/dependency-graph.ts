/**
 * Dependency Graph
 *
 * Builds a directed graph from foreign-key relationships between tables
 * and produces a topological ordering (parents before children).
 * Detects circular references and reports them clearly.
 */

import type { ParsedSchema } from "@/types/schema";

export interface DependencyGraph {
  /** Tables in safe insertion order (parents before children) */
  order: string[];
  /** Set of tables involved in circular references */
  cycles: string[][];
  /** Map of tableName → set of tables it depends on */
  dependencies: Map<string, Set<string>>;
}

/**
 * Build a dependency graph and topological order from a parsed schema.
 * Uses Kahn's algorithm for topological sort.
 */
export function buildDependencyGraph(schema: ParsedSchema): DependencyGraph {
  const allTables = new Set(schema.tables.map((t) => t.name));
  const dependencies = new Map<string, Set<string>>();
  const reverseDeps = new Map<string, Set<string>>();

  // Initialize maps
  for (const table of schema.tables) {
    dependencies.set(table.name, new Set());
    reverseDeps.set(table.name, new Set());
  }

  // Build dependency edges from foreign keys
  for (const table of schema.tables) {
    for (const col of table.columns) {
      if (col.foreignKey) {
        const { table: refTable } = col.foreignKey;
        // Only track dependencies on tables that exist in schema
        if (allTables.has(refTable) && refTable !== table.name) {
          dependencies.get(table.name)?.add(refTable);
          reverseDeps.get(refTable)?.add(table.name);
        }
      }
    }
  }

  // Kahn's algorithm
  const inDegree = new Map<string, number>();
  for (const table of schema.tables) {
    inDegree.set(table.name, dependencies.get(table.name)?.size ?? 0);
  }

  const queue: string[] = [];
  for (const [name, degree] of inDegree) {
    if (degree === 0) queue.push(name);
  }

  const order: string[] = [];
  while (queue.length > 0) {
    const node = queue.shift()!;
    order.push(node);
    for (const dependent of reverseDeps.get(node) ?? []) {
      const newDegree = (inDegree.get(dependent) ?? 1) - 1;
      inDegree.set(dependent, newDegree);
      if (newDegree === 0) queue.push(dependent);
    }
  }

  // Tables not in order → involved in cycles
  const cycleNodes = schema.tables
    .map((t) => t.name)
    .filter((name) => !order.includes(name));

  const cycles: string[][] = [];
  if (cycleNodes.length > 0) {
    // Report a single cycle group for now
    cycles.push(cycleNodes);
    // Append cycle nodes at end so generation can still proceed
    order.push(...cycleNodes);
  }

  return { order, cycles, dependencies };
}
