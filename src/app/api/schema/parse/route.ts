import { NextRequest, NextResponse } from "next/server";
import { parseSchema } from "@/lib/engine/parser";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { schema } = body;

    if (!schema || typeof schema !== "string") {
      return NextResponse.json(
        { error: "A valid 'schema' string is required." },
        { status: 400 }
      );
    }

    const parsed = parseSchema(schema);
    return NextResponse.json({
      success: true,
      schema: parsed,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to parse schema", message: error?.message || String(error) },
      { status: 500 }
    );
  }
}
