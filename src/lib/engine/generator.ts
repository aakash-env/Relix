/**
 * Data Generator
 *
 * Produces realistic, deterministic seed data from a ParsedSchema.
 * Uses a seeded PRNG (mulberry32) for reproducible output.
 * Generates data in dependency order, respecting FK relationships.
 */

import type { ParsedSchema, ParsedColumn, ParsedTable } from "@/types/schema";
import type {
  GeneratorConfig,
  GenerationResult,
  GeneratedTable,
  GeneratedRow,
} from "@/types/generator";
import { buildDependencyGraph } from "./dependency-graph";

// ─── Seeded PRNG ─────────────────────────────────────────────────────────────

/** mulberry32 — fast, high-quality 32-bit seeded PRNG */
function createPrng(seed: number) {
  let s = seed >>> 0;
  return function next(): number {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Rng = ReturnType<typeof createPrng>;

function randInt(rng: Rng, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function pick<T>(rng: Rng, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

// ─── Data pools ──────────────────────────────────────────────────────────────

const FIRST_NAMES = [
  "Alice", "Bob", "Carol", "David", "Emma", "Frank", "Grace", "Henry",
  "Isabella", "James", "Katherine", "Liam", "Mia", "Noah", "Olivia", "Peter",
  "Quinn", "Rachel", "Samuel", "Tara", "Uma", "Victor", "Wendy", "Xavier",
  "Yuki", "Zoe", "Aiden", "Bella", "Connor", "Diana", "Ethan", "Fiona",
  "George", "Hannah", "Ivan", "Julia", "Kevin", "Laura", "Marcus", "Nina",
];

const LAST_NAMES = [
  "Anderson", "Brown", "Clark", "Davis", "Evans", "Foster", "Garcia",
  "Harris", "Ingram", "Johnson", "King", "Lewis", "Martinez", "Nelson",
  "O'Brien", "Parker", "Quinn", "Roberts", "Smith", "Taylor", "Underwood",
  "Vance", "Walker", "Xavier", "Young", "Zhang", "Adams", "Baker",
  "Cooper", "Dixon", "Edwards", "Flynn", "Green", "Hill", "Irving",
];

const ORG_NAMES = [
  "Acme Corp", "Bright Labs", "CloudShift", "DataForge", "Elevate AI",
  "Foundry Works", "GridSync", "HorizonTech", "Infera", "JetStream",
  "KernelOps", "Luminary", "Meridian", "NovaTech", "Orbit Systems",
  "Prism AI", "Quantum Base", "Relay Networks", "Sidecar Systems", "Torus Labs",
  "Uplink AI", "Verdant Cloud", "Waveline", "Xenith", "Yledge", "Zeropoint",
];

const EMAIL_DOMAINS = [
  "gmail.com", "outlook.com", "proton.me", "hey.com",
  "fastmail.com", "icloud.com", "yahoo.com",
];

const AI_MODELS = [
  "gpt-4o", "gpt-4o-mini", "claude-3-5-sonnet", "claude-3-5-haiku",
  "gemini-1.5-pro", "gemini-1.5-flash", "llama-3.1-70b", "mistral-large",
];

const CONVERSATION_TOPICS = [
  "Help me write a product requirements document",
  "Explain the difference between REST and GraphQL",
  "Review my TypeScript code for performance issues",
  "Create a marketing email for our new feature",
  "Summarize this research paper",
  "Debug this database query",
  "Plan a sprint for our mobile app",
  "Write unit tests for this function",
  "Optimize our CI/CD pipeline",
  "Draft a technical blog post",
  "Analyze customer feedback data",
  "Design a microservices architecture",
];

const USER_MESSAGES = [
  "Can you help me with this?",
  "I need to refactor this code.",
  "What's the best approach here?",
  "Explain this concept simply.",
  "Give me three options.",
  "Make it more concise.",
  "Add error handling.",
  "Write tests for this.",
];

const ASSISTANT_MESSAGES = [
  "I'd be happy to help! Here's what I suggest:",
  "Great question. Let me break this down:",
  "There are several approaches you could take:",
  "Looking at your code, I can see a few improvements:",
  "Here's a refined version with better error handling:",
  "Let me explain this step by step:",
];

const PLAN_NAMES = ["free", "pro", "team", "enterprise"];
const ORG_ROLES = ["owner", "admin", "member", "viewer"];
const SUB_STATUSES = ["active", "trialing", "past_due", "cancelled", "paused"];
const INVOICE_STATUSES = ["paid", "open", "void", "uncollectible"];

// ─── ID generation ───────────────────────────────────────────────────────────

function generateUuid(rng: Rng): string {
  const hex = () => Math.floor(rng() * 256).toString(16).padStart(2, "0");
  return [
    hex() + hex() + hex() + hex(),
    hex() + hex(),
    "4" + hex().slice(1) + hex(),
    ((Math.floor(rng() * 4) + 8).toString(16)) + hex(),
    hex() + hex() + hex() + hex() + hex() + hex(),
  ].join("-");
}

function generateTimestamp(rng: Rng, config: GeneratorConfig): string {
  const start = Math.floor(config.dateRangeStart.getTime());
  const end = Math.floor(config.dateRangeEnd.getTime());
  const ts = Math.floor(start + rng() * (end - start));
  return new Date(ts).toISOString();
}

// ─── Column value generator ──────────────────────────────────────────────────

function generateColumnValue(
  col: ParsedColumn,
  tableName: string,
  rowIndex: number,
  rng: Rng,
  config: GeneratorConfig,
  fkPool: Map<string, GeneratedRow[]>,
  currentRow: Partial<GeneratedRow>
): string | number | boolean | null {
  const name = col.name.toLowerCase();

  // Auto-increment primary key serials
  if (col.type === "serial" || col.type === "bigserial") {
    return rowIndex + 1;
  }

  // UUID primary key
  if ((col.type === "uuid" && col.isPrimaryKey) || name === "id") {
    if (col.type === "uuid") return generateUuid(rng);
    return rowIndex + 1;
  }

  // Foreign key resolution
  if (col.foreignKey) {
    const refRows = fkPool.get(col.foreignKey.table);
    if (refRows && refRows.length > 0) {
      const refRow = pick(rng, refRows);
      return refRow[col.foreignKey.column] ?? null;
    }
    return null;
  }

  // Enum values
  if (col.type === "enum" && col.enumValues && col.enumValues.length > 0) {
    return pick(rng, col.enumValues);
  }

  // Contextual name-based generation
  if (name.includes("email")) {
    const first = pick(rng, FIRST_NAMES).toLowerCase();
    const last = pick(rng, LAST_NAMES).toLowerCase();
    const domain = pick(rng, EMAIL_DOMAINS);
    return `${first}.${last}${rowIndex}@${domain}`;
  }

  if (name === "name" && tableName.toLowerCase().includes("user")) {
    const first = pick(rng, FIRST_NAMES);
    const last = pick(rng, LAST_NAMES);
    return `${first} ${last}`;
  }

  if (name === "name" || name.endsWith("_name")) {
    if (tableName.toLowerCase().includes("org")) return pick(rng, ORG_NAMES);
    if (tableName.toLowerCase().includes("plan")) return pick(rng, PLAN_NAMES);
    if (tableName.toLowerCase().includes("model")) return pick(rng, AI_MODELS);
    const first = pick(rng, FIRST_NAMES);
    return `${first} ${pick(rng, LAST_NAMES)}`;
  }

  if (name === "first_name") return pick(rng, FIRST_NAMES);
  if (name === "last_name") return pick(rng, LAST_NAMES);
  if (name === "display_name" || name === "full_name") {
    return `${pick(rng, FIRST_NAMES)} ${pick(rng, LAST_NAMES)}`;
  }

  if (name === "slug") {
    const base = pick(rng, ORG_NAMES).toLowerCase().replace(/[^a-z0-9]/g, "-");
    return `${base}-${rowIndex}`;
  }

  if (name === "role") return pick(rng, ORG_ROLES);
  if (name === "status") {
    if (tableName.includes("subscription")) return pick(rng, SUB_STATUSES);
    if (tableName.includes("invoice")) return pick(rng, INVOICE_STATUSES);
    return pick(rng, ["active", "inactive", "pending"]);
  }

  if (name === "plan" || name === "plan_name") return pick(rng, PLAN_NAMES);
  if (name === "provider") return pick(rng, ["openai", "anthropic", "google", "meta", "mistral"]);

  if (name.includes("title") || name === "subject") {
    return pick(rng, CONVERSATION_TOPICS);
  }

  if (name === "content" || name.endsWith("_content")) {
    if (tableName.includes("message")) {
      return rng() > 0.5 ? pick(rng, USER_MESSAGES) : pick(rng, ASSISTANT_MESSAGES);
    }
    return `Sample content for record ${rowIndex + 1}`;
  }

  if (name === "role" && tableName.includes("message")) {
    return rng() > 0.3 ? "user" : "assistant";
  }

  if (name.includes("token") && (name.includes("input") || name.startsWith("input"))) {
    return randInt(rng, 50, 4000);
  }
  if (name.includes("token") && (name.includes("output") || name.startsWith("output"))) {
    return randInt(rng, 20, 2000);
  }
  if (name.includes("token")) return randInt(rng, 100, 4000);

  if (name.includes("amount") || name.includes("price") || name.includes("cost")) {
    return parseFloat((rng() * 200 + 5).toFixed(2));
  }

  if (name.includes("credit") || name === "credits") return randInt(rng, 0, 50000);
  if (name.includes("count") || name.endsWith("_count")) return randInt(rng, 1, 100);
  if (name.includes("seats")) return randInt(rng, 1, 50);
  if (name.includes("score") || name.includes("rating")) return parseFloat((rng() * 5).toFixed(2));

  if (name.includes("url") || name.includes("avatar")) {
    return `https://api.dicebear.com/7.x/initials/svg?seed=${rowIndex}`;
  }

  if (name === "key_hash" || name.includes("hash")) {
    return `sha256:${Array.from({ length: 32 }, () => randInt(rng, 0, 15).toString(16)).join("")}`;
  }

  if (name === "context_window") return pick(rng, [4096, 8192, 32768, 128000, 200000]);

  if (name.includes("verified") || name.startsWith("is_") || name.startsWith("has_")) {
    return rng() > 0.3;
  }

  // Type-based fallbacks
  switch (col.type) {
    case "uuid": return generateUuid(rng);
    case "integer":
    case "smallint": return randInt(rng, 1, 10000);
    case "bigint": return randInt(rng, 1, 1_000_000);
    case "numeric":
    case "decimal":
    case "float":
    case "double": return parseFloat((rng() * 1000).toFixed(2));
    case "boolean": return rng() > 0.5;
    case "date": return new Date(generateTimestamp(rng, config)).toISOString().split("T")[0];
    case "timestamp":
    case "timestamptz": return generateTimestamp(rng, config);
    case "json":
    case "jsonb": return JSON.stringify({ key: `value_${rowIndex}` });
    case "text":
    case "varchar":
    case "char": {
      const maxLen = col.maxLength ?? 100;
      return `Sample text ${rowIndex + 1}`.slice(0, maxLen);
    }
    default: return null;
  }
}

// ─── Main generator ──────────────────────────────────────────────────────────

export function generateData(
  schema: ParsedSchema,
  config: GeneratorConfig
): GenerationResult {
  const startTime = Date.now();
  const rng = createPrng(config.seed);
  const { order } = buildDependencyGraph(schema);

  const tableMap = new Map(schema.tables.map((t) => [t.name, t]));
  const generatedTables: GeneratedTable[] = [];
  // Pool of already-generated rows per table (for FK resolution)
  const fkPool = new Map<string, GeneratedRow[]>();

  for (const tableName of order) {
    const table = tableMap.get(tableName);
    if (!table) continue;

    const entityConfig = config.entities.find((e) => e.tableName === tableName);
    if (entityConfig && !entityConfig.enabled) {
      fkPool.set(tableName, []);
      continue;
    }

    const count = entityConfig?.count ?? 10;
    const rows: GeneratedRow[] = [];

    // Track unique values per column
    const uniqueSets = new Map<string, Set<string | number>>();
    for (const col of table.columns) {
      if (col.isUnique) uniqueSets.set(col.name, new Set());
    }

    for (let i = 0; i < count; i++) {
      const row: GeneratedRow = {};

      for (const col of table.columns) {
        let value = generateColumnValue(col, tableName, i, rng, config, fkPool, row);

        // Enforce uniqueness — retry up to 10 times
        if (col.isUnique && !col.isPrimaryKey && value !== null) {
          const seen = uniqueSets.get(col.name)!;
          let attempts = 0;
          while (seen.has(String(value)) && attempts < 10) {
            value = generateColumnValue(col, tableName, i + attempts * 1000, rng, config, fkPool, row);
            attempts++;
          }
          if (!seen.has(String(value))) seen.add(String(value));
        }

        row[col.name] = value;
      }

      rows.push(row);
    }

    generatedTables.push({ tableName, rows });
    fkPool.set(tableName, rows);
  }

  return {
    tables: generatedTables,
    validationErrors: [],
    durationMs: Date.now() - startTime,
    seed: config.seed,
  };
}

/** Build a default GeneratorConfig from a parsed schema */
export function buildDefaultConfig(
  schema: ParsedSchema,
  seed = 42
): GeneratorConfig {
  const now = Math.floor(Date.now() / 1000) * 1000;
  const end = new Date(now);
  const start = new Date(now - 30 * 24 * 60 * 60 * 1000); // 30 days ago

  const DEFAULT_COUNTS: Record<string, number> = {
    users: 50,
    organizations: 10,
    org_memberships: 80,
    plans: 4,
    subscriptions: 10,
    invoices: 30,
    ai_models: 8,
    conversations: 100,
    messages: 500,
    token_usage: 200,
    credit_balances: 10,
    api_keys: 20,
  };

  return {
    seed,
    locale: "en-US",
    entities: schema.tables.map((t) => ({
      tableName: t.name,
      count: DEFAULT_COUNTS[t.name] ?? 20,
      enabled: true,
    })),
    dateRangeStart: start,
    dateRangeEnd: end,
    relationshipDepth: 3,
    preset: null,
  };
}
