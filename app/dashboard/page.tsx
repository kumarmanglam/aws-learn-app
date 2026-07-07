"use client";

import { useEffect, useMemo, useState } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowLeft,
  Flame,
  Trophy,
  Star,
  CheckCircle2,
  TrendingUp,
  Clock,
  Calendar,
  BookOpen,
} from "lucide-react";
import { topics } from "@/lib/topics";
import {
  type QuizState,
  computeStreak,
  longestStreak,
  globalScore,
  xpFromQuiz,
  levelFromXp,
  nextLevelXp,
  domainStrengths,
  spacedRepetition,
  buildHeatmap,
  formatElapsed,
  type ReviewItem,
} from "@/lib/progress-metrics";
import { CenterLoader } from "@/components/center-loader";

type SessionUser = { username: string; displayName: string };

// Progress fields the dashboard reads out of the sharded /api/progress payload.
type Loaded = {
  user: SessionUser | null;
  loginDates: string[];
  quiz: QuizState;
  visited: Record<string, boolean>;
  topicDone: Record<string, boolean>;
  lastReviewed: Record<string, string>;
  topicTime: Record<string, number>;
};

const EMPTY: Loaded = {
  user: null,
  loginDates: [],
  quiz: {},
  visited: {},
  topicDone: {},
  lastReviewed: {},
  topicTime: {},
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Loaded>(EMPTY);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/progress", { credentials: "same-origin" });
        if (res.status === 401) {
          window.location.href = "/login?from=/dashboard";
          return;
        }
        const json = (await res.json()) as {
          user: SessionUser;
          sections: Record<string, unknown>;
        };
        if (cancelled) return;
        const sections = json.sections ?? {};
        const profile = (sections.profile ?? {}) as { loginDates?: string[] };
        const progress = (sections.progress ?? {}) as {
          visited?: Record<string, boolean>;
          topicDone?: Record<string, boolean>;
          lastReviewed?: Record<string, string>;
          topicTime?: Record<string, number>;
        };
        const quizDoc = (sections.quiz ?? {}) as { answers?: QuizState };
        setData({
          user: json.user ?? null,
          loginDates: Array.isArray(profile.loginDates) ? profile.loginDates : [],
          quiz: quizDoc.answers ?? {},
          visited: progress.visited ?? {},
          topicDone: progress.topicDone ?? {},
          lastReviewed: progress.lastReviewed ?? {},
          topicTime: progress.topicTime ?? {},
        });
      } catch {
        if (!cancelled) setData(EMPTY);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const m = useMemo(() => {
    const { quiz, visited, topicDone, lastReviewed, loginDates, topicTime } = data;
    const g = globalScore(quiz);
    const xp = xpFromQuiz(quiz);
    const level = levelFromXp(xp);
    return {
      streak: computeStreak(loginDates),
      longest: longestStreak(loginDates),
      gScore: g,
      accuracy: g.total ? Math.round((g.correct / g.total) * 100) : 0,
      xp,
      level,
      visitedCount: Object.values(visited).filter(Boolean).length,
      completedCount: Object.values(topicDone).filter(Boolean).length,
      totalTopics: topics.length,
      totalStudyMs: Object.values(topicTime).reduce((a, b) => a + (b || 0), 0),
      heatmap: buildHeatmap(loginDates),
      review: spacedRepetition(quiz, visited, topicDone, lastReviewed),
      radar: domainStrengths(quiz),
    };
  }, [data]);

  if (loading) return <CenterLoader label="Loading your dashboard…" />;

  return (
    <div className="h-screen flex flex-col bg-bg-base text-text-primary overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b border-border bg-bg-panel/90 backdrop-blur">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text-primary px-2 py-1 rounded-md hover:bg-bg-hover"
        >
          <ArrowLeft size={15} /> Back
        </a>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <TrendingUp size={16} />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">Your Dashboard</div>
            <div className="text-[11px] text-text-muted">
              {data.user ? `Signed in as ${data.user.displayName}` : "Personal progress"}
            </div>
          </div>
        </div>
      </header>

      {/* Scroll body */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-6 space-y-6 max-w-6xl w-full mx-auto">
        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          <StatCard icon={<Flame size={18} />} label="Current Streak" value={`${m.streak}d`} sub={`Longest ${m.longest}d`} />
          <StatCard icon={<Trophy size={18} />} label="Quiz Accuracy" value={`${m.accuracy}%`} sub={`${m.gScore.correct}/${m.gScore.total}`} />
          <StatCard icon={<Star size={18} />} label="XP" value={m.xp.toLocaleString()} sub={`Level ${m.level} · next ${nextLevelXp(m.level)}`} />
          <StatCard icon={<BookOpen size={18} />} label="Visited" value={`${m.visitedCount}`} sub={`of ${m.totalTopics}`} />
          <StatCard icon={<CheckCircle2 size={18} />} label="Completed" value={`${m.completedCount}`} sub={`of ${m.totalTopics}`} />
          <StatCard icon={<Clock size={18} />} label="Study Time" value={formatElapsed(m.totalStudyMs)} sub="all topics" />
        </div>

        {/* Streak heatmap */}
        <section className="rounded-lg border border-border bg-bg-card/40 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Calendar size={15} className="text-accent" /> Study Activity
            </div>
            <div className="text-[11px] text-text-muted">
              {m.heatmap.total} active day{m.heatmap.total === 1 ? "" : "s"} · last year
            </div>
          </div>
          <Heatmap heatmap={m.heatmap} />
          <div className="flex items-center justify-end gap-1.5 mt-2 text-[10px] text-text-muted">
            <span>Less</span>
            <span className="w-3 h-3 rounded-sm bg-bg-base border border-border/60" />
            <span className="w-3 h-3 rounded-sm bg-accent/40" />
            <span className="w-3 h-3 rounded-sm bg-accent" />
            <span>More</span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Spaced-repetition */}
          <section className="rounded-lg border border-border bg-bg-card/40 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold mb-1">
              <TrendingUp size={15} className="text-accent" /> Due for Review
            </div>
            <p className="text-[11.5px] text-text-muted mb-3">
              Adaptive spaced repetition — surfaced from your quiz scores and how long
              since you last opened each topic.
            </p>
            {m.review.length === 0 ? (
              <div className="text-[12.5px] text-text-muted italic py-6 text-center">
                Nothing due right now. Study a few topics and take some quizzes — weak or
                stale topics will resurface here.
              </div>
            ) : (
              <ul className="space-y-1.5">
                {m.review.map((item) => (
                  <ReviewRow key={item.topic.id} item={item} />
                ))}
              </ul>
            )}
          </section>

          {/* Domain radar */}
          <section className="rounded-lg border border-border bg-bg-card/40 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold mb-3">
              <Trophy size={15} className="text-accent" /> Domain Strength
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={m.radar} outerRadius="72%">
                  <PolarGrid stroke="#2d3a4f" />
                  <PolarAngleAxis dataKey="domain" tick={{ fill: "#b0bac6", fontSize: 10 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#8b949e", fontSize: 9 }} axisLine={false} />
                  <Radar name="Score" dataKey="score" stroke="#ff9900" fill="#ff9900" fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-bg-card/50 p-3">
      <div className="flex items-center gap-1.5 text-accent mb-1">{icon}</div>
      <div className="text-xl font-bold text-text-primary leading-tight">{value}</div>
      <div className="text-[11px] text-text-secondary">{label}</div>
      {sub && <div className="text-[10px] text-text-muted mt-0.5">{sub}</div>}
    </div>
  );
}

function ReviewRow({ item }: { item: ReviewItem }) {
  const strong = item.strengthPct >= 75;
  const weak = item.strengthPct < 50;
  return (
    <li>
      <a
        href={`/?topic=${item.topic.id}`}
        className="flex items-center gap-3 p-2 rounded-md hover:bg-bg-hover group"
      >
        <div
          className={`w-8 h-8 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0 ${
            weak
              ? "bg-danger/15 text-danger"
              : strong
              ? "bg-success/15 text-success"
              : "bg-accent/15 text-accent"
          }`}
        >
          {item.strengthPct}%
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] text-text-primary truncate group-hover:text-accent">
            {item.topic.shortLabel}
          </div>
          <div className="text-[11px] text-text-muted truncate">
            {item.topic.domain} · {item.reason}
          </div>
        </div>
        <div className="text-[10.5px] text-text-muted shrink-0 text-right">
          {item.overdueDays > 0 ? `${item.overdueDays}d overdue` : "due"}
        </div>
      </a>
    </li>
  );
}

function Heatmap({ heatmap }: { heatmap: ReturnType<typeof buildHeatmap> }) {
  const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];
  return (
    <div className="overflow-x-auto">
      <div className="inline-block">
        {/* Month labels */}
        <div className="flex gap-1 mb-1">
          <div className="w-6 mr-1 shrink-0" />
          {heatmap.weeks.map((_, col) => (
            <div
              key={col}
              className="w-3 shrink-0 text-[9px] text-text-muted whitespace-nowrap"
            >
              {heatmap.monthLabels.find((l) => l.col === col)?.label ?? ""}
            </div>
          ))}
        </div>
        {/* Grid */}
        <div className="flex gap-1">
          <div className="flex flex-col gap-1 mr-1 w-6 shrink-0 text-[9px] text-text-muted">
            {dayLabels.map((d, i) => (
              <div key={i} className="h-3 leading-3">
                {d}
              </div>
            ))}
          </div>
          {heatmap.weeks.map((week, col) => (
            <div key={col} className="flex flex-col gap-1 shrink-0">
              {week.map((cell, row) => (
                <div
                  key={row}
                  title={
                    cell.date
                      ? `${cell.date} — ${cell.active ? "Studied" : "No activity"}`
                      : ""
                  }
                  className={`w-3 h-3 rounded-sm ${
                    cell.date
                      ? cell.active
                        ? "bg-accent"
                        : "bg-bg-base border border-border/60"
                      : "bg-transparent"
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
