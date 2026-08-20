import { NextRequest, NextResponse } from "next/server";
import { parseSchema } from "@/lib/engine/parser";
import { generateData, buildDefaultConfig } from "@/lib/engine/generator";
import { exportData } from "@/lib/engine/exporter";
import type { ExportFormat } from "@/types/generator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      schema,
      seed = 42,
      locale = "en-US",
      counts,
      format = "typescript-drizzle",
    } = body;

    if (!schema || typeof schema !== "string") {
      return NextResponse.json(
        { error: "A valid 'schema' string (PostgreSQL DDL) is required." },
        { status: 400 }
      );
    }

    const validFormats: ExportFormat[] = [
      "typescript-drizzle",
      "typescript-prisma",
      "sql",
      "json",
      "csv",
    ];

    if (!validFormats.includes(format)) {
      return NextResponse.json(
        { error: `Invalid format: '${format}'. Valid options: ${validFormats.join(", ")}` },
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

    const generationResult = generateData(parsed, baseConfig);
    const exportResult = exportData(generationResult, format as ExportFormat);

    if (!exportResult.ok) {
      return NextResponse.json(
        { error: "Failed to format export", details: exportResult.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      filename: exportResult.filename,
      format,
      content: exportResult.content,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal export error", message: error?.message || String(error) },
      { status: 500 }
    );
  }
}
