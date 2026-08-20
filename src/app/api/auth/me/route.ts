import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get("relix_session")?.value;

  if (!sessionCookie) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: sessionCookie,
      email: "developer@relix.dev",
      name: "Developer",
      plan: "free",
    },
  });
}