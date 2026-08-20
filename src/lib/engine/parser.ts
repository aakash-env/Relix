/**
 * SQL DDL Parser
 *
 * Parses PostgreSQL-dialect DDL into a typed ParsedSchema.
 * Handles: CREATE TABLE, CREATE TYPE (enum), column constraints,
 * NOT NULL, DEFAULT, UNIQUE, PRIMARY KEY, FOREIGN KEY references.
 *
 * Reports errors with approximate line context.
 */

import type {
  ParsedSchema,
  ParsedTable,
  ParsedColumn,
  ParsedEnum,
  ParseError,
  ColumnType,
} from "@/types/schema";

// ─── helpers ────────────────────────────────────────────────────────────────

function normalizeType(raw: string): ColumnType {
  const t = raw.toLowerCase().trim();
  if (t.startsWith("character varying") || t.startsWith("varchar")) return "varchar";
  if (t.startsWith("character") || t.startsWith("char(") || t === "char") return "char";
  if (t === "text" || t.startsWith("text ")) return "text";
  if (t === "uuid") return "uuid";
  if (t === "bigserial") return "bigserial";
  if (t === "serial") return "serial";
  if (t === "bigint" || t === "int8") return "bigint";
  if (t === "smallint" || t === "int2") return "smallint";
  if (t === "integer" || t === "int" || t === "int4") return "integer";
  if (t.startsWith("numeric") || t.startsWith("decimal")) return "numeric";
  if (t === "real" || t === "float4") return "float";
  if (t === "double precision" || t === "float8") return "double";
  if (t === "boolean" || t === "bool") return "boolean";
  if (t === "date") return "date";
  if (t.startsWith("timestamp with time zone") || t === "timestamptz") return "timestamptz";
  if (t.startsWith("timestamp")) return "timestamp";
  if (t.startsWith("time")) return "time";
  if (t === "jsonb") return "jsonb";
  if (t === "json") return "json";
  if (t.endsWith("[]")) return "array";
  return "unknown";
}

function extractLength(rawType: string): number | null {
  const m = rawType.match(/\((\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

/** Remove single-line and block comments from SQL */
function stripComments(sql: string): string {
  // Block comments
  sql = sql.replace(/\/\*[\s\S]*?\*\//g, "");
  // Single-line comments
  sql = sql.replace(/--[^\n]*/g, "");
  return sql;
}

/** Split raw SQL into top-level statement strings */
function splitStatements(sql: string): string[] {
  const statements: string[] = [];
  let depth = 0;
  let current = "";
  for (let i = 0; i < sql.length; i++) {
    const ch = sql[i];
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    current += ch;
    if (ch === ";" && depth === 0) {
      const trimmed = current.trim();
      if (trimmed.length > 1) statements.push(trimmed);
      current = "";
    }
  }
  const trimmed = current.trim();
  if (trimmed) statements.push(trimmed);
  return statements;
}

/** Parse a CREATE TYPE ... AS ENUM statement */
function parseCreateEnum(stmt: string): ParsedEnum | null {
  const m = stmt.match(
    /CREATE\s+TYPE\s+(?:"?(\w+)"?\.)?(?:"?(\w+)"?)\s+AS\s+ENUM\s*\(([\s\S]*)\)/i
  );
  if (!m) return null;
  const name = m[2] ?? m[1];
  const rawValues = m[3];
  const values = rawValues
    .split(",")
    .map((v) => v.trim().replace(/^'|'$/g, ""))
    .filter(Boolean);
  return { name, values };
}

/** Parse inline column definitions from inside CREATE TABLE (...) */
function parseColumns(
  columnBlock: string,
  tableName: string,
  enums: ParsedEnum[]
): { columns: ParsedColumn[]; errors: ParseError[] } {
  const columns: ParsedColumn[] = [];
  const errors: ParseError[] = [];

  // Split on commas that are not inside parentheses
  const lines: string[] = [];
  let depth = 0;
  let current = "";
  for (const ch of columnBlock) {
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      lines.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim()) lines.push(current.trim());

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Skip table-level constraints
    if (/^(CONSTRAINT|PRIMARY\s+KEY|UNIQUE|CHECK|FOREIGN\s+KEY|EXCLUDE)/i.test(trimmed)) {
      // Handle inline FK constraints — extract and store
      const fkMatch = trimmed.match(
        /FOREIGN\s+KEY\s*\(([^)]+)\)\s+REFERENCES\s+(?:"?(\w+)"?)\s*\(([^)]+)\)/i
      );
      if (fkMatch) {
        const localCol = fkMatch[1].trim().replace(/"/g, "");
        const refTable = fkMatch[2].trim();
        const refCol = fkMatch[3].trim().replace(/"/g, "");
        // Apply to previously parsed column
        const col = columns.find((c) => c.name === localCol);
        if (col) col.foreignKey = { table: refTable, column: refCol };
      }
      continue;
    }

    // Match: "column_name" TYPE [constraints...]
    const colMatch = trimmed.match(/^(?:"?(\w+)"?)\s+(.+)$/i);
    if (!colMatch) continue;

    const colName = colMatch[1];
    const rest = colMatch[2].trim();

    // Extract type — up to first keyword or constraint
    const typeMatch = rest.match(/^([\w\s(),".']+?)(?:\s+(?:NOT\s+NULL|NULL|DEFAULT|REFERENCES|UNIQUE|PRIMARY\s+KEY|CHECK|GENERATED|CONSTRAINT)|$)/i);
    const rawType = typeMatch ? typeMatch[1].trim() : rest.split(/\s+/)[0];
    const normalizedType = normalizeType(rawType);

    // Detect if it's an enum reference
    const isEnum = enums.some((e) => e.name.toLowerCase() === rawType.toLowerCase());
    const finalType: ColumnType = isEnum ? "enum" : normalizedType;
    const enumValues = isEnum
      ? (enums.find((e) => e.name.toLowerCase() === rawType.toLowerCase())?.values ?? null)
      : null;

    const nullable = !/NOT\s+NULL/i.test(rest);
    const isPrimaryKey = /PRIMARY\s+KEY/i.test(rest);
    const isUnique = /\bUNIQUE\b/i.test(rest) || isPrimaryKey;

    // Extract DEFAULT value
    const defaultMatch = rest.match(/DEFAULT\s+([^,\s]+(?:\s+[^,\s]+)*?)(?:\s+(?:NOT\s+NULL|UNIQUE|PRIMARY|CHECK|REFERENCES)|\s*$)/i);
    const defaultValue = defaultMatch ? defaultMatch[1].trim() : null;

    // Extract inline REFERENCES
    const refMatch = rest.match(/REFERENCES\s+(?:"?(\w+)"?)\s*\(([^)]+)\)/i);
    const foreignKey = refMatch
      ? { table: refMatch[1], column: refMatch[2].trim().replace(/"/g, "") }
      : null;

    columns.push({
      name: colName,
      type: finalType,
      rawType,
      nullable: isPrimaryKey ? false : nullable,
      isPrimaryKey,
      isUnique,
      defaultValue,
      foreignKey,
      enumValues,
      maxLength: extractLength(rawType),
    });
  }

  return { columns, errors };
}

/** Parse a CREATE TABLE statement */
function parseCreateTable(
  stmt: string,
  enums: ParsedEnum[]
): { table: ParsedTable | null; errors: ParseError[] } {
  const m = stmt.match(
    /CREATE\s+(?:UNLOGGED\s+)?TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:"?(\w+)"?\.)?(?:"?(\w+)"?)\s*\(([\s\S]+)\)(?:\s+INHERITS\s*\([^)]+\))?\s*;?$/i
  );
  if (!m) {
    return {
      table: null,
      errors: [{ message: `Could not parse CREATE TABLE statement`, line: null, column: null }],
    };
  }
  const tableName = m[2] ?? m[1];
  const columnBlock = m[3];
  const { columns, errors } = parseColumns(columnBlock, tableName, enums);
  return { table: { name: tableName, columns }, errors };
}

// ─── public API ─────────────────────────────────────────────────────────────

export function parseSqlDdl(sql: string): ParsedSchema {
  const tables: ParsedTable[] = [];
  const enums: ParsedEnum[] = [];
  const errors: ParseError[] = [];

  const cleaned = stripComments(sql);
  const statements = splitStatements(cleaned);

  // First pass: collect enums so column parser can reference them
  for (const stmt of statements) {
    if (/CREATE\s+TYPE/i.test(stmt) && /AS\s+ENUM/i.test(stmt)) {
      const parsed = parseCreateEnum(stmt);
      if (parsed) enums.push(parsed);
    }
  }

  // Second pass: parse tables
  for (const stmt of statements) {
    if (/CREATE\s+(?:UNLOGGED\s+)?TABLE/i.test(stmt)) {
      const { table, errors: errs } = parseCreateTable(stmt, enums);
      if (table) tables.push(table);
      errors.push(...errs);
    }
  }

  return { tables, enums, errors, detectedFormat: "sql-ddl" };
}

/**
 * Auto-detect schema format and parse accordingly.
 * Currently supports SQL DDL. Returns the parsed schema.
 */
export function parseSchema(input: string): ParsedSchema {
  const trimmed = input.trim();

  // SQL DDL detection
  if (/CREATE\s+TABLE/i.test(trimmed) || /CREATE\s+TYPE/i.test(trimmed)) {
    return parseSqlDdl(trimmed);
  }

  // Prisma schema detection (basic — full parser is a future enhancement)
  if (/model\s+\w+\s*\{/.test(trimmed)) {
    return {
      tables: [],
      enums: [],
      errors: [
        {
          message:
            "Prisma schema format detected. Full Prisma support is coming soon. Please use SQL DDL format for now.",
          line: 1,
          column: null,
        },
      ],
      detectedFormat: "prisma",
    };
  }

  return {
    tables: [],
    enums: [],
    errors: [
      {
        message:
          "Could not detect schema format. Please paste a valid PostgreSQL DDL (CREATE TABLE statements).",
        line: 1,
        column: null,
      },
    ],
    detectedFormat: "unknown",
  };
}
