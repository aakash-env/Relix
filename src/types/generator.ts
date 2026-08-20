/** Generator configuration and output types */

export type ExportFormat = "typescript-drizzle" | "typescript-prisma" | "sql" | "json" | "csv";
export type Locale = "en-US" | "en-GB" | "de-DE" | "fr-FR" | "es-ES" | "ja-JP";

export interface EntityConfig {
  /** Table name */
  tableName: string;
  /** Number of records to generate */
  count: number;
  /** Whether this entity is enabled for generation */
  enabled: boolean;
}

export interface GeneratorConfig {
  /** User-supplied seed value for deterministic generation */
  seed: number;
  /** Locale for names, addresses, etc. */
  locale: Locale;
  /** Per-entity record counts */
  entities: EntityConfig[];
  /** Start of the date range for generated timestamps */
  dateRangeStart: Date;
  /** End of the date range for generated timestamps */
  dateRangeEnd: Date;
  /** How many levels of FK relationships to follow */
  relationshipDepth: number;
  /** Preset identifier, or null for custom */
  preset: string | null;
}

export interface GeneratedRow {
  [columnName: string]: string | number | boolean | null;
}

export interface GeneratedTable {
  tableName: string;
  rows: GeneratedRow[];
}

export interface ValidationError {
  tableName: string;
  rowIndex: number;
  columnName: string;
  message: string;
}

export interface GenerationResult {
  tables: GeneratedTable[];
  validationErrors: ValidationError[];
  durationMs: number;
  seed: number;
}

export type ExportResult =
  | { ok: true; content: string; filename: string }
  | { ok: false; error: string };
