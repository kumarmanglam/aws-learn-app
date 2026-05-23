import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { hashPassword } from "@/lib/passwords";
import { FieldValue } from "firebase-admin/firestore";

export const runtime = "nodejs";

type Body = {
  username?: unknown;
  password?: unknown;
  displayName?: unknown;
};

const USERNAME_RE = /^[a-z0-9][a-z0-9._-]{1,40}$/;

export async function POST(req: NextRequest) {
  // ---- token check ----
  const expected = process.env.SEED_TOKEN;
  if (!expected) {
    return NextResponse.json(
      { error: "Seed endpoint disabled (SEED_TOKEN not set)" },
      { status: 503 }
    );
  }
  const supplied = req.nextUrl.searchParams.get("token");
  if (supplied !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ---- body parsing & validation ----
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const username =
    typeof body.username === "string" ? body.username.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const displayName =
    typeof body.displayName === "string" && body.displayName.trim()
      ? body.displayName.trim()
      : username;

  if (!USERNAME_RE.test(username)) {
    return NextResponse.json(
      {
        error:
          "username must be 2–41 chars: lowercase letters, digits, dot, underscore, hyphen, starting with a letter or digit",
      },
      { status: 400 }
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "password must be at least 8 characters" },
      { status: 400 }
    );
  }

  // ---- idempotent insert ----
  const ref = db.collection("users").doc(username);
  const snap = await ref.get();
  if (snap.exists) {
    return NextResponse.json({ status: "skipped", username });
  }

  const passwordHash = await hashPassword(password);
  await ref.set({
    username,
    displayName,
    passwordHash,
    createdAt: FieldValue.serverTimestamp(),
  });

  return NextResponse.json({ status: "created", username, displayName });
}
