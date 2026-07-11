"use client";

// ============================================================
// Timed DSA Practice — a lightweight OA simulator over the DSA question bank.
// Countdown timer, forward-only navigation, auto-submit at zero, then a
// scored review. Attempts persist to userProgress/{user}/sections/dsa-attempts.
// ============================================================

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Timer,
  ArrowLeft,
  Play,
  RotateCcw,
  Trophy,
  Check,
  X,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { topics } from "@/lib/topics";
import { formatElapsed } from "@/lib/progress-metrics";

type Letter = "A" | "B" | "C" | "D";
type PracticeQuestion = {
  topicId: string;
  topicTitle: string;
  q: string;
  options: [string, string, string, string];
  answer: Letter;
  explanation: string;
};

const LETTERS: Letter[] = ["A", "B", "C", "D"];
const DEFAULT_COUNT = 6;
const DEFAULT_MINUTES = 5;

// Flatten every DSA topic's questions into one bank (module-level, static).
const QUESTION_BANK: PracticeQuestion[] = topics
  .filter((t) => t.domain === "DSA")
  .flatMap((t) =>
    t.questions.map((question) => ({
      topicId: t.id,
      topicTitle: t.title,
      q: question.q,
      options: question.options,
      answer: question.answer,
      explanation: question.explanation,
    }))
  );

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Phase = "setup" | "running" | "done";

export default function DsaPracticePage() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [count, setCount] = useState(Math.min(DEFAULT_COUNT, QUESTION_BANK.length));
  const [minutes, setMinutes] = useState(DEFAULT_MINUTES);

  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(Letter | null)[]>([]);
  const [remaining, setRemaining] = useState(0); // seconds
  const [elapsedMs, setElapsedMs] = useState(0);
  const startedAtRef = useRef(0);
  const priorBestRef = useRef<number | null>(null);

  // Pull the prior best time once so we can keep the minimum on submit.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/progress", { credentials: "same-origin" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        const shard = data.sections?.["dsa-attempts"] as
          | { bestMs?: number }
          | undefined;
        if (typeof shard?.bestMs === "number") priorBestRef.current = shard.bestMs;
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const persistAttempt = useCallback(
    (finalAnswers: (Letter | null)[], qs: PracticeQuestion[], ms: number) => {
      const correct = qs.reduce(
        (n, q, i) => n + (finalAnswers[i] === q.answer ? 1 : 0),
        0
      );
      const total = qs.length;
      const perfect = correct === total && total > 0;
      const nextBest = perfect
        ? Math.min(priorBestRef.current ?? Infinity, ms)
        : priorBestRef.current;
      const attemptId = `a-${Date.now()}`;
      const patch: Record<string, unknown> = {
        attempts: {
          [attemptId]: {
            dateISO: new Date().toISOString(),
            score: correct,
            total,
            elapsedMs: ms,
          },
        },
        lastScore: correct,
        lastTotal: total,
      };
      if (typeof nextBest === "number" && Number.isFinite(nextBest)) {
        patch.bestMs = nextBest;
        priorBestRef.current = nextBest;
      }
      fetch("/api/progress", {
        method: "PUT",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "dsa-attempts", patch }),
      }).catch(() => {});
    },
    []
  );

  const finish = useCallback(
    (finalAnswers: (Letter | null)[]) => {
      const ms = Date.now() - startedAtRef.current;
      setElapsedMs(ms);
      setPhase("done");
      persistAttempt(finalAnswers, questions, ms);
    },
    [persistAttempt, questions]
  );

  // Countdown while running; auto-submit at zero.
  useEffect(() => {
    if (phase !== "running") return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(id);
          // Defer to avoid setState-during-render; use latest answers.
          setAnswers((cur) => {
            finish(cur);
            return cur;
          });
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase, finish]);

  const start = useCallback(() => {
    const n = Math.max(1, Math.min(count, QUESTION_BANK.length));
    const qs = shuffle(QUESTION_BANK).slice(0, n);
    setQuestions(qs);
    setAnswers(new Array(qs.length).fill(null));
    setCurrent(0);
    setRemaining(minutes * 60);
    startedAtRef.current = Date.now();
    setPhase("running");
  }, [count, minutes]);

  const choose = (letter: Letter) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = letter;
      return next;
    });
  };

  const advance = () => {
    if (current + 1 >= questions.length) {
      setAnswers((cur) => {
        finish(cur);
        return cur;
      });
    } else {
      setCurrent((c) => c + 1);
    }
  };

  const timerLow = remaining <= 30;
  const score = useMemo(
    () =>
      questions.reduce(
        (n, q, i) => n + (answers[i] === q.answer ? 1 : 0),
        0
      ),
    [questions, answers]
  );

  // ---------------------------------------------------------------- shell
  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <header className="sticky top-0 z-20 glass">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-1.5 text-[13px] text-text-muted hover:text-text-primary"
          >
            <ArrowLeft size={15} /> Back to course
          </a>
          <div className="flex items-center gap-2 font-mono text-[13px]">
            <Timer size={15} className="text-accent" />
            Timed DSA Practice
          </div>
          {phase === "running" ? (
            <div
              className={`font-mono text-[15px] font-semibold px-3 py-1 rounded-md border ${
                timerLow
                  ? "border-danger/50 bg-danger/10 text-danger animate-pulse"
                  : "border-border bg-bg-card text-text-primary"
              }`}
            >
              {Math.floor(remaining / 60)}:
              {String(remaining % 60).padStart(2, "0")}
            </div>
          ) : (
            <div className="w-16" />
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {phase === "setup" && (
          <SetupScreen
            count={count}
            setCount={setCount}
            minutes={minutes}
            setMinutes={setMinutes}
            bankSize={QUESTION_BANK.length}
            onStart={start}
          />
        )}

        {phase === "running" && questions[current] && (
          <RunningScreen
            index={current}
            total={questions.length}
            question={questions[current]}
            selected={answers[current]}
            onChoose={choose}
            onNext={advance}
          />
        )}

        {phase === "done" && (
          <ResultsScreen
            questions={questions}
            answers={answers}
            score={score}
            elapsedMs={elapsedMs}
            onRetry={() => setPhase("setup")}
          />
        )}
      </main>
    </div>
  );
}

// ------------------------------------------------------------------ setup
function SetupScreen({
  count,
  setCount,
  minutes,
  setMinutes,
  bankSize,
  onStart,
}: {
  count: number;
  setCount: (n: number) => void;
  minutes: number;
  setMinutes: (n: number) => void;
  bankSize: number;
  onStart: () => void;
}) {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 text-[12px] font-mono uppercase tracking-widest text-accent mb-3">
        <Timer size={14} /> OA Simulator
      </div>
      <h1 className="text-2xl font-bold mb-2">Timed DSA Practice</h1>
      <p className="text-text-secondary text-[14.5px] mb-6 max-w-xl">
        The real shape of a Karat / HackerRank-style round: a fixed set of
        questions, one visible countdown, no jumping back to a finished one, and
        auto-submit when the clock hits zero. {bankSize} questions in the bank.
      </p>

      <div className="rounded-lg border border-border bg-bg-card/50 p-5 space-y-5 max-w-md">
        <label className="block">
          <span className="text-[12px] uppercase tracking-wide text-text-muted">
            Questions
          </span>
          <div className="flex items-center gap-2 mt-2">
            {[3, 6, 9, 12].map((n) => (
              <button
                key={n}
                type="button"
                disabled={n > bankSize}
                onClick={() => setCount(Math.min(n, bankSize))}
                className={`px-3 py-1.5 rounded-md border text-[13px] font-mono transition-colors disabled:opacity-30 ${
                  count === Math.min(n, bankSize)
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-border text-text-secondary hover:bg-bg-hover"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </label>

        <label className="block">
          <span className="text-[12px] uppercase tracking-wide text-text-muted">
            Time limit
          </span>
          <div className="flex items-center gap-2 mt-2">
            {[3, 5, 10, 15].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMinutes(m)}
                className={`px-3 py-1.5 rounded-md border text-[13px] font-mono transition-colors ${
                  minutes === m
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-border text-text-secondary hover:bg-bg-hover"
                }`}
              >
                {m}m
              </button>
            ))}
          </div>
        </label>

        <button
          type="button"
          onClick={onStart}
          disabled={bankSize === 0}
          className="w-full inline-flex items-center justify-center gap-2 text-[14px] font-semibold px-4 py-2.5 rounded-md bg-accent text-bg-base hover:bg-accent-hover disabled:opacity-50"
        >
          <Play size={16} /> Start {Math.min(count, bankSize)}-question round
        </button>
        <p className="text-[11.5px] text-text-muted flex items-start gap-1.5">
          <AlertCircle size={13} className="mt-0.5 shrink-0" />
          Once you move to the next question you can&apos;t go back — just like a
          real assessment.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- running
function RunningScreen({
  index,
  total,
  question,
  selected,
  onChoose,
  onNext,
}: {
  index: number;
  total: number;
  question: PracticeQuestion;
  selected: Letter | null;
  onChoose: (l: Letter) => void;
  onNext: () => void;
}) {
  return (
    <div className="animate-fade-in">
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[12px] font-mono text-text-muted">
          Question {index + 1} / {total}
        </span>
        <span className="text-[11.5px] font-mono px-2 py-0.5 rounded-full border border-border text-text-secondary">
          {question.topicTitle}
        </span>
      </div>
      <div className="h-1 rounded-full bg-bg-card mb-6 overflow-hidden">
        <div
          className="h-full bg-accent transition-all"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      <p className="text-[16px] font-medium mb-5 leading-relaxed">{question.q}</p>

      <div className="flex flex-col gap-2.5">
        {question.options.map((opt, i) => {
          const letter = LETTERS[i];
          const active = selected === letter;
          return (
            <button
              key={letter}
              type="button"
              onClick={() => onChoose(letter)}
              className={`text-left flex gap-3 items-start px-4 py-3 rounded-lg border transition-colors ${
                active
                  ? "border-accent bg-accent/10 text-text-primary"
                  : "border-border bg-bg-card/40 text-text-secondary hover:border-accent/50"
              }`}
            >
              <span className="font-mono text-text-muted shrink-0">{letter}</span>
              <span className="text-[14px]">{opt}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          disabled={selected === null}
          className="inline-flex items-center gap-1.5 text-[14px] font-semibold px-4 py-2 rounded-md bg-accent text-bg-base hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {index + 1 >= total ? "Finish" : "Next"}
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- results
function ResultsScreen({
  questions,
  answers,
  score,
  elapsedMs,
  onRetry,
}: {
  questions: PracticeQuestion[];
  answers: (Letter | null)[];
  score: number;
  elapsedMs: number;
  onRetry: () => void;
}) {
  const total = questions.length;
  const pct = total ? Math.round((score / total) * 100) : 0;
  return (
    <div className="animate-fade-in">
      <div className="rounded-lg border border-border bg-bg-card/50 p-6 mb-6 flex flex-wrap items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-accent/15 border border-accent/40 flex items-center justify-center text-accent">
          <Trophy size={28} />
        </div>
        <div>
          <div className="text-[13px] uppercase tracking-wide text-text-muted">
            Your score
          </div>
          <div className="text-3xl font-bold">
            {score} / {total}{" "}
            <span className="text-lg text-text-secondary font-mono">({pct}%)</span>
          </div>
          <div className="text-[13px] text-text-muted mt-1 font-mono">
            Finished in {formatElapsed(elapsedMs)}
          </div>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="ml-auto inline-flex items-center gap-1.5 text-[13.5px] font-semibold px-4 py-2 rounded-md border border-border hover:bg-bg-hover"
        >
          <RotateCcw size={15} /> New round
        </button>
      </div>

      <h2 className="text-[13px] uppercase tracking-wide text-text-muted mb-3">
        Review
      </h2>
      <div className="space-y-3">
        {questions.map((q, i) => {
          const picked = answers[i];
          const correct = picked === q.answer;
          return (
            <div
              key={i}
              className="rounded-lg border border-border bg-bg-card/40 p-4"
            >
              <div className="flex items-start gap-2 mb-2">
                <span
                  className={`mt-0.5 shrink-0 ${
                    correct ? "text-success" : "text-danger"
                  }`}
                >
                  {correct ? <Check size={16} /> : <X size={16} />}
                </span>
                <p className="text-[14px] font-medium">{q.q}</p>
              </div>
              <div className="pl-6 space-y-1 text-[13px]">
                {q.options.map((opt, oi) => {
                  const letter = LETTERS[oi];
                  const isAnswer = letter === q.answer;
                  const isPicked = letter === picked;
                  return (
                    <div
                      key={letter}
                      className={`flex gap-2 ${
                        isAnswer
                          ? "text-success"
                          : isPicked
                          ? "text-danger"
                          : "text-text-muted"
                      }`}
                    >
                      <span className="font-mono">{letter}</span>
                      <span>{opt}</span>
                      {isAnswer && <span className="font-mono">✓</span>}
                      {isPicked && !isAnswer && (
                        <span className="font-mono">← your answer</span>
                      )}
                    </div>
                  );
                })}
                <p className="text-text-secondary pt-1.5">
                  {picked === null && (
                    <span className="text-warning font-mono">[unanswered] </span>
                  )}
                  {q.explanation}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
