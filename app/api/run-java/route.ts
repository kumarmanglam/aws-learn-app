// ============================================================
// Java execution proxy.
//
// The browser never talks to the Render Java executor directly. This route:
//   1. enforces auth (only signed-in learners can trigger a compile+run),
//   2. applies a light per-user rate limit (the executor is a 0.1-CPU box),
//   3. forwards the code to the Render service with a shared secret header,
//   4. maps the service's response into the front-end `RunResult` shape.
//
// Env vars (set in .env / Vercel / host):
//   RUN_JAVA_URL     e.g. https://be-service.onrender.com/run
//   RUN_JAVA_SECRET  must match the same var on the Render service
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_CODE_LEN = 20000;
// Render free tier can take ~30–60s to wake from idle; allow generous slack.
const FETCH_TIMEOUT_MS = 70000;

// Deployed Java executor (Render free tier). Hard-coded default so no env vars
// are required; RUN_JAVA_URL / RUN_JAVA_SECRET can still override if set.
const DEFAULT_RUN_JAVA_URL = "https://learn-be-service-x0xc.onrender.com/run";
const RUN_JAVA_URL = process.env.RUN_JAVA_URL || DEFAULT_RUN_JAVA_URL;
const RUN_JAVA_SECRET = process.env.RUN_JAVA_SECRET || "";

// ---- Per-user rate limit (in-memory sliding window) ----
// Best-effort backstop; resets on cold start. Protects the shared executor.
const RATE_WINDOW_MS = 2000;
const lastCall = new Map<string, number>();

// ---- GET /api/run-java — wake / health-check the executor ----
// Pings the backend /health so the free-tier service can spin up BEFORE the
// learner runs any Java (cold start ~30–60s). Returns { warm: true } on success.
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Derive the health URL from the /run URL.
  const healthUrl = RUN_JAVA_URL.replace(/\/run\/?$/, "/health");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const upstream = await fetch(healthUrl, {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
    });
    if (!upstream.ok) {
      return NextResponse.json(
        { warm: false, error: `Health check failed (HTTP ${upstream.status}).` },
        { status: 502 }
      );
    }
    return NextResponse.json({ warm: true });
  } catch (e) {
    const aborted = e instanceof Error && e.name === "AbortError";
    return NextResponse.json(
      {
        warm: false,
        error: aborted
          ? "The Java runtime is still waking up — give it a few more seconds."
          : "Could not reach the Java runtime.",
      },
      { status: 504 }
    );
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const now = Date.now();
  const prev = lastCall.get(user.username) ?? 0;
  if (now - prev < RATE_WINDOW_MS) {
    return NextResponse.json(
      { error: "You're running code too fast — wait a moment and try again." },
      { status: 429 }
    );
  }
  lastCall.set(user.username, now);

  let body: { code?: unknown };
  try {
    body = (await req.json()) as { code?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const code = body.code;
  if (typeof code !== "string" || code.trim().length === 0) {
    return NextResponse.json({ error: "code is required" }, { status: 400 });
  }
  if (code.length > MAX_CODE_LEN) {
    return NextResponse.json(
      { error: `code too long (max ${MAX_CODE_LEN} chars)` },
      { status: 400 }
    );
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const upstream = await fetch(RUN_JAVA_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(RUN_JAVA_SECRET ? { "x-run-secret": RUN_JAVA_SECRET } : {}),
      },
      body: JSON.stringify({ code }),
      signal: controller.signal,
    });

    if (!upstream.ok) {
      const msg =
        upstream.status === 429
          ? "The Java runtime is busy — try again in a moment."
          : `Java runtime error (HTTP ${upstream.status}).`;
      return NextResponse.json({ error: msg }, { status: 502 });
    }

    const data = await upstream.json();
    return NextResponse.json(data);
  } catch (e) {
    const aborted = e instanceof Error && e.name === "AbortError";
    return NextResponse.json(
      {
        error: aborted
          ? "The Java runtime is waking up (free tier cold start). Try again in a few seconds."
          : "Could not reach the Java runtime.",
      },
      { status: 504 }
    );
  } finally {
    clearTimeout(timer);
  }
}
