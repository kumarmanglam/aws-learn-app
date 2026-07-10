// ============================================================
// Sharded user-progress endpoint.
//
// Storage layout (one document per section, all under one user):
//   userProgress/{username}/sections/profile
//   userProgress/{username}/sections/progress
//   userProgress/{username}/sections/quiz
//   userProgress/{username}/sections/tryit
//   userProgress/{username}/sections/ui
//   userProgress/{username}/sections/kanban
//
// GET  → assemble all sections into a single response
// PUT  → write ONE section only (per-section debouncing on the client).
//        For `quiz` and `tryit` we accept a flat patch of dotted paths so
//        concurrent answers/attempts merge without overwrite races.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/auth";
import { FieldValue } from "firebase-admin/firestore";

export const runtime = "nodejs";

const SECTIONS = ["profile", "progress", "quiz", "tryit", "ui", "kanban"] as const;
type SectionKey = (typeof SECTIONS)[number];

// Sections whose PUT body is a dotted-path merge (keyed by a root map field)
// so individual entries don't clobber siblings under concurrent writes.
const DOTTED_SECTIONS: Partial<Record<SectionKey, string>> = {
  quiz: "answers",
  tryit: "attempts",
};

function sectionRef(username: string, section: SectionKey) {
  return db
    .collection("userProgress")
    .doc(username)
    .collection("sections")
    .doc(section);
}

// -------- GET /api/progress --------
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const snaps = await Promise.all(
    SECTIONS.map((s) => sectionRef(user.username, s).get())
  );

  const out: Record<string, unknown> = {};
  SECTIONS.forEach((s, i) => {
    const snap = snaps[i];
    out[s] = snap.exists ? snap.data() : {};
  });

  return NextResponse.json({
    user: { username: user.username, displayName: user.displayName },
    sections: out,
  });
}

// -------- PUT /api/progress --------
type PutBody = {
  section?: unknown;
  patch?: unknown;
};

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

/**
 * For dotted sections (`quiz`, `tryit`) we accept either:
 *   - a flat map of dotted paths: { "answers.iam-roles.5": {selected:"B", correct:true} }
 *   - OR a nested object under the root key which we flatten to dotted paths
 *
 * `root` is the top-level map field ("answers" for quiz, "attempts" for tryit).
 * Both forms end up as a single Firestore `update` so individual entries merge
 * cleanly without clobbering siblings.
 */
function buildDottedPatch(
  root: string,
  patch: Record<string, unknown>
): Record<string, unknown> {
  const prefix = `${root}.`;
  const looksDotted =
    Object.keys(patch).length > 0 &&
    Object.keys(patch).every((k) => k.startsWith(prefix));
  if (looksDotted) return patch;

  const nested = patch[root];
  if (!isPlainObject(nested)) {
    // empty / malformed — just bump updatedAt
    return {};
  }
  const out: Record<string, unknown> = {};
  for (const [outerId, inner] of Object.entries(nested)) {
    if (!isPlainObject(inner)) continue;
    for (const [innerId, val] of Object.entries(inner)) {
      out[`${root}.${outerId}.${innerId}`] = val;
    }
  }
  return out;
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: PutBody;
  try {
    body = (await req.json()) as PutBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const section = body.section as string | undefined;
  if (!section || !(SECTIONS as readonly string[]).includes(section)) {
    return NextResponse.json(
      { error: `section must be one of: ${SECTIONS.join(", ")}` },
      { status: 400 }
    );
  }
  if (!isPlainObject(body.patch)) {
    return NextResponse.json(
      { error: "patch must be an object" },
      { status: 400 }
    );
  }
  const patch = body.patch as Record<string, unknown>;

  const ref = sectionRef(user.username, section as SectionKey);

  const dottedRoot = DOTTED_SECTIONS[section as SectionKey];
  if (dottedRoot) {
    // Dotted-path update so individual entries don't clobber siblings.
    const dotted = buildDottedPatch(dottedRoot, patch);
    // Always bump updatedAt; create the doc if it doesn't exist yet.
    const snap = await ref.get();
    if (!snap.exists) {
      await ref.set({
        [dottedRoot]: {},
        updatedAt: FieldValue.serverTimestamp(),
      });
    }
    await ref.update({
      ...dotted,
      updatedAt: FieldValue.serverTimestamp(),
    });
  } else {
    // profile / progress / ui — merged top-level patch
    await ref.set(
      {
        ...patch,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  }

  return NextResponse.json({ ok: true, section });
}
