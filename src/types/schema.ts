/** Schema domain types — the parsed result of any schema input format */

export type ColumnType =
  | "text"
  | "varchar"
  | "char"
  | "uuid"
  | "integer"
  | "bigint"
  | "smallint"
  | "serial"
  | "bigserial"
  | "numeric"
  | "decimal"
  | "float"
  | "double"
  | "boolean"
  | "date"
  | "timestamp"
  | "timestamptz"
  | "time"
  | "json"
  | "jsonb"
  | "array"
  | "enum"
  | "unknown";

export interface ParsedColumn {
  name: string;
  type: ColumnType;
  /** Original raw type string, e.g. "character varying(255)" */
  rawType: string;
  nullable: boolean;
  isPrimaryKey: boolean;
  isUnique: boolean;
  defaultValue: string | null;
  /** References another table.column */
  foreignKey: { table: string; column: string } | null;
  /** For enum type — list of valid values */
  enumValues: string[] | null;
  /** Max length for varchar/char */
  maxLength: number | null;
}

export interface ParsedTable {
  name: string;
  columns: ParsedColumn[];
}

export interface ParsedEnum {
  name: string;
  values: string[];
}

export interface ParseError {
  message: string;
  line: number | null;
  column: number | null;
}

export interface ParsedSchema {
  tables: ParsedTable[];
  enums: ParsedEnum[];
  errors: ParseError[];
  /** The schema format that was detected */
  detectedFormat: "sql-ddl" | "prisma" | "unknown";
}
