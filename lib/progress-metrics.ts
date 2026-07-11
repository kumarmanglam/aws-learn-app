// ============================================================
// Shared, pure progress metrics — used by the main learning page and the
// per-user dashboard. Everything here is deterministic given its inputs
// (no DOM, no fetch), so it can run on server or client.
// ============================================================

import { topics, sections, type Topic } from "./topics";

// ---- shared domain types (progress shape) ----
export type TabKey =
  | "overview"
  | "explanation"
  | "diagram"
  | "analogy"
  | "code"
  | "quiz";

export type QuizState = {
  [topicId: string]: {
    [qIndex: number]: { selected: "A" | "B" | "C" | "D"; correct: boolean };
  };
};

/**
 * "Try it" exercise progress, keyed by topicId → questionId. `attempted` flips
 * true the first time the learner runs the exercise; `solved` is true once
 * their query's result matches the reference solution. Tracking is intentionally
 * low-stakes — it never gates course progress.
 */
export type TryItState = {
  [topicId: string]: {
    [questionId: string]: { attempted: boolean; solved: boolean };
  };
};

// ---- date helpers (UTC to avoid TZ drift) ----
export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function parseISO(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
}
function toISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}
function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setUTCDate(x.getUTCDate() + n);
  return x;
}
function diffDays(aIso: string, bIso: string): number {
  return Math.floor(
    (parseISO(aIso).getTime() - parseISO(bIso).getTime()) / 86_400_000
  );
}

// ---- streaks ----
export function computeStreak(dates: string[]): number {
  if (!dates.length) return 0;
  const set = new Set(dates);
  let streak = 0;
  const cursor = new Date();
  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (set.has(key)) {
      streak += 1;
      cursor.setUTCDate(cursor.getUTCDate() - 1);
    } else break;
  }
  return streak;
}

export function longestStreak(dates: string[]): number {
  if (!dates.length) return 0;
  const uniq = Array.from(new Set(dates)).sort();
  let best = 1;
  let cur = 1;
  for (let i = 1; i < uniq.length; i++) {
    const gap = diffDays(uniq[i], uniq[i - 1]);
    if (gap === 1) {
      cur += 1;
      best = Math.max(best, cur);
    } else if (gap === 0) {
      /* duplicate day — ignore */
    } else {
      cur = 1;
    }
  }
  return best;
}

// ---- time formatting ----
export function formatElapsed(ms: number): string {
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${s % 60}s`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

// ---- scores ----
export function sectionProgressPct(
  sectionId: string,
  visited: Record<string, boolean>
): number {
  const sec = sections.find((s) => s.id === sectionId);
  if (!sec || !sec.topicIds.length) return 0;
  const done = sec.topicIds.filter((id) => visited[id]).length;
  return Math.round((done / sec.topicIds.length) * 100);
}

export function topicScore(topicId: string, quiz: QuizState) {
  const t = topics.find((x) => x.id === topicId);
  if (!t) return { correct: 0, total: 0, answered: 0 };
  const entries = quiz[topicId] ?? {};
  const answered = Object.values(entries);
  return {
    correct: answered.filter((a) => a.correct).length,
    answered: answered.length,
    total: t.questions.length,
  };
}

export function globalScore(quiz: QuizState) {
  let correct = 0;
  let total = 0;
  for (const t of topics) {
    const s = topicScore(t.id, quiz);
    correct += s.correct;
    total += t.questions.length;
  }
  return { correct, total };
}

export function xpFromQuiz(quiz: QuizState): number {
  let xp = 0;
  for (const entries of Object.values(quiz))
    for (const a of Object.values(entries)) if (a.correct) xp += 50;
  return xp;
}

export function levelFromXp(xp: number): number {
  return Math.max(1, Math.floor(xp / 250) + 1);
}
export function nextLevelXp(level: number): number {
  return level * 250;
}

export function domainStrengths(quiz: QuizState, topicIds?: Set<string>) {
  const buckets: Record<string, { c: number; t: number }> = {};
  for (const t of topics) {
    if (topicIds && !topicIds.has(t.id)) continue;
    if (!buckets[t.domain]) buckets[t.domain] = { c: 0, t: 0 };
    const s = topicScore(t.id, quiz);
    buckets[t.domain].c += s.correct;
    buckets[t.domain].t += t.questions.length;
  }
  return Object.entries(buckets).map(([domain, v]) => ({
    domain,
    score: v.t === 0 ? 0 : Math.round((v.c / v.t) * 100),
  }));
}

export function recommendedRevisions(quiz: QuizState) {
  return topics
    .map((t) => {
      const s = topicScore(t.id, quiz);
      const pct = s.answered === 0 ? null : Math.round((s.correct / s.answered) * 100);
      return { topic: t, pct, answered: s.answered };
    })
    .filter((x) => x.answered >= 2 && (x.pct ?? 100) < 80)
    .sort((a, b) => (a.pct ?? 100) - (b.pct ?? 100))
    .slice(0, 3);
}

// ============================================================
// Adaptive spaced-repetition — decides which studied topics are "due" for a
// revisit. Strength (from quiz accuracy / done-state) sets the review interval;
// a topic is due once `daysSince(lastReviewed) >= interval`.
// ============================================================
export type ReviewItem = {
  topic: Topic;
  strengthPct: number;
  intervalDays: number;
  daysSince: number;
  overdueDays: number;
  lastReviewed: string | null;
  reason: string;
};

// Better recall → longer interval before the next review.
function intervalForStrength(strength: number): number {
  if (strength >= 0.9) return 21;
  if (strength >= 0.75) return 14;
  if (strength >= 0.6) return 7;
  if (strength >= 0.4) return 3;
  return 1;
}

export function spacedRepetition(
  quiz: QuizState,
  visited: Record<string, boolean>,
  topicDone: Record<string, boolean>,
  lastReviewed: Record<string, string>,
  today: string = todayISO(),
  limit = 8
): ReviewItem[] {
  const items: ReviewItem[] = [];
  for (const t of topics) {
    const sc = topicScore(t.id, quiz);
    const seen = !!visited[t.id] || sc.answered > 0 || !!topicDone[t.id];
    if (!seen) continue;

    const strength =
      sc.answered > 0
        ? sc.correct / sc.answered
        : topicDone[t.id]
        ? 0.5
        : 0.25;
    const interval = intervalForStrength(strength);
    const last = lastReviewed[t.id] ?? null;
    // No timestamp (legacy/never-recorded) → treat as long overdue.
    const daysSince = last ? Math.max(0, diffDays(today, last)) : 999;
    const overdue = daysSince - interval;
    if (overdue < 0) continue; // reviewed recently enough — not due

    const strengthPct = Math.round(strength * 100);
    let reason: string;
    if (sc.answered > 0 && strength < 0.6)
      reason = `Weak quiz score (${strengthPct}%)`;
    else if (!last) reason = "Not reviewed since studying";
    else reason = `Last opened ${daysSince}d ago`;

    items.push({
      topic: t,
      strengthPct,
      intervalDays: interval,
      daysSince,
      overdueDays: overdue,
      lastReviewed: last,
      reason,
    });
  }
  items.sort(
    (a, b) => b.overdueDays - a.overdueDays || a.strengthPct - b.strengthPct
  );
  return items.slice(0, limit);
}

// ============================================================
// GitHub-style contribution heatmap from login dates.
// Columns = weeks (oldest → newest), rows = weekday (Sun..Sat).
// ============================================================
export type HeatCell = { date: string | null; active: boolean };
export type Heatmap = {
  weeks: HeatCell[][];
  monthLabels: { col: number; label: string }[];
  total: number;
};

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function buildHeatmap(
  dates: string[],
  weeks = 53,
  today: string = todayISO()
): Heatmap {
  const active = new Set(dates);
  const end = parseISO(today);
  const rawStart = addDays(end, -(weeks * 7 - 1));
  // Align the first column to a Sunday.
  const alignedStart = addDays(rawStart, -rawStart.getUTCDay());

  const cells: HeatCell[] = [];
  let cur = alignedStart;
  while (cur <= end || cells.length % 7 !== 0) {
    if (cur > end) {
      cells.push({ date: null, active: false });
    } else {
      const iso = toISO(cur);
      cells.push({ date: iso, active: active.has(iso) });
    }
    cur = addDays(cur, 1);
  }

  const weeksArr: HeatCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeksArr.push(cells.slice(i, i + 7));

  const monthLabels: { col: number; label: string }[] = [];
  let lastMonth = -1;
  weeksArr.forEach((week, col) => {
    const firstReal = week.find((c) => c.date);
    if (!firstReal?.date) return;
    const month = parseISO(firstReal.date).getUTCMonth();
    if (month !== lastMonth) {
      monthLabels.push({ col, label: MONTHS[month] });
      lastMonth = month;
    }
  });

  return { weeks: weeksArr, monthLabels, total: active.size };
}
