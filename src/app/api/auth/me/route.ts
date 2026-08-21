import { NextRequest, NextResponse } from "next/server";
import { findUserById } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get("relix_session")?.value;

  if (!sessionCookie) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  const user = await findUserById(sessionCookie);

  if (!user) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    },
  });
}