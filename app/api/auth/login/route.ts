import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { verifyPassword } from "@/lib/passwords";
import {
  COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  signSession,
} from "@/lib/session";

export const runtime = "nodejs"; // bcryptjs + firebase-admin need Node, not Edge

type Body = { username?: unknown; password?: unknown };

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
  const snap = await db.collection("users").doc(username).get();
  if (!snap.exists) {
    // Same response shape for "no such user" and "wrong password" to avoid leak.
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  const data = snap.data() as
    | { passwordHash?: string; displayName?: string }
    | undefined;

  const hash = data?.passwordHash;
  const displayName = data?.displayName ?? username;

  if (!hash || !(await verifyPassword(password, hash))) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

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
}
