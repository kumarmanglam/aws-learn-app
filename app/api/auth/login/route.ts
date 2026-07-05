import { NextRequest, NextResponse } from "next/server";
import {
  COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  signSession,
} from "@/lib/session";

export const runtime = "nodejs";

type Body = { username?: unknown; password?: unknown };

const USERS: Record<string, { password: string; displayName: string }> = {
  "kumar-user": { password: "securehigh", displayName: "kumar-user" },
  "varsha": { password: "securehigh", displayName: "varsha" },
  "himanshu": { password: "securehigh", displayName: "himanshu" },
};

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const username =
    typeof body.username === "string" ? body.username.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!username || !password) {
    return NextResponse.json(
      { error: "username and password are required" },
      { status: 400 }
    );
  }

  // Lookup user
  const user = USERS[username];
  if (!user || user.password !== password) {
    // Same response shape for "no such user" and "wrong password" to avoid leak.
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  const displayName = user.displayName;

  try {
    const token = await signSession({ username, displayName });

    const res = NextResponse.json({ username, displayName });
    res.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });
    return res;
  } catch (err) {
    console.error("login: failed to create session", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create session" },
      { status: 500 }
    );
  }
}
