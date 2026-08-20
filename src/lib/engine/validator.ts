/**
 * Schema & Data Validator
 *
 * Validates generated data against the schema before export:
 * - Foreign key references (ensures target row exists)
 * - Unique constraints & Primary Keys
 * - NOT NULL constraints
 * - Enum value compliance
 * - String length restrictions
 */

import type { ParsedSchema } from "@/types/schema";
import type { GenerationResult, ValidationError } from "@/types/generator";

export function validateGeneratedData(
  schema: ParsedSchema,
  result: GenerationResult
): ValidationError[] {
  const errors: ValidationError[] = [];
  const tableMap = new Map(schema.tables.map((t) => [t.name, t]));
  const dataTableMap = new Map(result.tables.map((t) => [t.tableName, t.rows]));

  // Build a lookup set for primary/foreign keys per table: columnName -> Set of values
  const tableValueIndex = new Map<string, Map<string, Set<string | number | boolean>>>();

  for (const table of result.tables) {
    const colIndex = new Map<string, Set<string | number | boolean>>();
    for (const row of table.rows) {
      for (const [colName, val] of Object.entries(row)) {
        if (val !== null && val !== undefined) {
          if (!colIndex.has(colName)) {
            colIndex.set(colName, new Set());
          }
          colIndex.get(colName)!.add(val);
        }
      }
    }
    tableValueIndex.set(table.tableName, colIndex);
  }

  for (const table of result.tables) {
    const tableSchema = tableMap.get(table.tableName);
    if (!tableSchema) continue;

    const columnSchemaMap = new Map(tableSchema.columns.map((c) => [c.name, c]));
    const seenUniqueValues = new Map<string, Set<string | number | boolean>>();

    for (let rowIndex = 0; rowIndex < table.rows.length; rowIndex++) {
      const row = table.rows[rowIndex];

      for (const col of tableSchema.columns) {
        const val = row[col.name];

        // 1. NOT NULL constraint check
        if (!col.nullable && (val === null || val === undefined)) {
          errors.push({
            tableName: table.tableName,
            rowIndex,
            columnName: col.name,
            message: `Column "${col.name}" is NOT NULL but received null/undefined`,
          });
          continue;
        }

        if (val === null || val === undefined) continue;

        // 2. Uniqueness & Primary Key check
        if (col.isUnique || col.isPrimaryKey) {
          if (!seenUniqueValues.has(col.name)) {
            seenUniqueValues.set(col.name, new Set());
          }
          const seenSet = seenUniqueValues.get(col.name)!;
          if (seenSet.has(val)) {
            errors.push({
              tableName: table.tableName,
              rowIndex,
              columnName: col.name,
              message: `Duplicate value "${val}" violates unique constraint on column "${col.name}"`,
            });
          } else {
            seenSet.add(val);
          }
        }

        // 3. Foreign Key referential integrity check
        if (col.foreignKey) {
          const { table: targetTable, column: targetCol } = col.foreignKey;
          const targetTableIndex = tableValueIndex.get(targetTable);
          const targetColValues = targetTableIndex?.get(targetCol);

          if (!targetColValues || !targetColValues.has(val)) {
            errors.push({
              tableName: table.tableName,
              rowIndex,
              columnName: col.name,
              message: `Foreign key violation: Value "${val}" does not exist in target table "${targetTable}.${targetCol}"`,
            });
          }
        }

        // 4. Enum constraint check
        if (col.type === "enum" && col.enumValues && col.enumValues.length > 0) {
          if (!col.enumValues.includes(String(val))) {
            errors.push({
              tableName: table.tableName,
              rowIndex,
              columnName: col.name,
              message: `Value "${val}" is not a valid enum member for column "${col.name}". Allowed: [${col.enumValues.join(", ")}]`,
            });
          }
        }

        // 5. Max length check
        if (col.maxLength && typeof val === "string" && val.length > col.maxLength) {
          errors.push({
            tableName: table.tableName,
            rowIndex,
            columnName: col.name,
            message: `String length (${val.length}) exceeds maximum allowable length of ${col.maxLength} on column "${col.name}"`,
          });
        }
      }
    }
  }

  return errors;
}
