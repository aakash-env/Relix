import { NextRequest, NextResponse } from "next/server";
import { parseSchema } from "@/lib/engine/parser";
import { generateData, buildDefaultConfig } from "@/lib/engine/generator";
import { validateGeneratedData } from "@/lib/engine/validator";
import type { GeneratorConfig } from "@/types/generator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { schema, seed = 42, locale = "en-US", counts, dateRangeStart, dateRangeEnd } = body;

    if (!schema || typeof schema !== "string") {
      return NextResponse.json(
        { error: "A valid 'schema' string (PostgreSQL DDL) is required in the request body." },
        { status: 400 }
      );
    }

    const parsed = parseSchema(schema);
    if (parsed.tables.length === 0 && parsed.errors.length > 0) {
      return NextResponse.json(
        { error: "Failed to parse schema.", details: parsed.errors },
        { status: 422 }
      );
    }

    const baseConfig = buildDefaultConfig(parsed, Number(seed) || 42);
    if (counts && typeof counts === "object") {
      baseConfig.entities = baseConfig.entities.map((e) => ({
        ...e,
        count: typeof counts[e.tableName] === "number" ? counts[e.tableName] : e.count,
      }));
    }

    if (locale) baseConfig.locale = locale;
    if (dateRangeStart) baseConfig.dateRangeStart = new Date(dateRangeStart);
    if (dateRangeEnd) baseConfig.dateRangeEnd = new Date(dateRangeEnd);

    const generationResult = generateData(parsed, baseConfig);
    const validationErrors = validateGeneratedData(parsed, generationResult);
    generationResult.validationErrors = validationErrors;

    return NextResponse.json({
      success: true,
      meta: {
        tablesCount: generationResult.tables.length,
        totalRecords: generationResult.tables.reduce((acc, t) => acc + t.rows.length, 0),
        durationMs: generationResult.durationMs,
        seed: generationResult.seed,
        validationIssues: validationErrors.length,
      },
      result: generationResult,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal generation error", message: error?.message || String(error) },
      { status: 500 }
    );
  }
}
