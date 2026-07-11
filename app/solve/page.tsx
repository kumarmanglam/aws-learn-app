"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Play,
  Loader2,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Code2,
  ListChecks,
} from "lucide-react";
import Editor from "react-simple-code-editor";
import {
  runJavaScript,
  runPython,
  runJava,
  isPyodideReady,
  isJavaReady,
  type RunResult,
} from "@/lib/code-runner";
import { highlightCode } from "@/lib/prism";
import { CenterLoader } from "@/components/center-loader";
import { JavaWakeButton } from "@/components/java-wake-button";
import {
  PRACTICE_QUESTIONS,
  type PracticeQuestion,
  type SolutionTier,
} from "@/lib/practice-questions";

// ============================================================
// /solve — LeetCode-style split workspace.
// Left half: the question. Right half: an Attempt tab (runnable editor for
// coding questions, a notes scratchpad for design questions) and a Solution
// tab (brute → intermediate → optimal + variants). MVP: two questions.
// ============================================================

function runnableLang(language: string): "javascript" | "python" | "java" | null {
  const l = language.toLowerCase();
  if (l === "javascript" || l === "js") return "javascript";
  if (l === "python" || l === "py") return "python";
  if (l === "java") return "java";
  return null;
}

// Minimal **bold** / *italic* inline renderer.
function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**"))
      return (
        <strong key={i} className="text-text-primary font-semibold">
          {p.slice(2, -2)}
        </strong>
      );
    if (p.startsWith("*") && p.endsWith("*"))
      return (
        <em key={i} className="text-text-primary/90">
          {p.slice(1, -1)}
        </em>
      );
    return <span key={i}>{p}</span>;
  });
}

const DIFF_COLOR: Record<string, string> = {
  Easy: "text-green-400 border-green-500/40 bg-green-500/10",
  Medium: "text-yellow-400 border-yellow-500/40 bg-yellow-500/10",
  Hard: "text-danger border-danger/40 bg-danger/10",
};

const TIER_COLOR: Record<string, string> = {
  "brute-force": "text-danger border-danger/40 bg-danger/10",
  intermediate: "text-warning border-warning/40 bg-warning/10",
  optimal: "text-success border-success/40 bg-success/10",
  variant: "text-accent border-accent/40 bg-accent/10",
};

// ---- Output panel (mirrors the course RunOutput) ----
function OutputBox({ output }: { output: RunResult }) {
  const empty =
    !output.stdout && !output.stderr && !output.error && output.result == null;
  return (
    <div className="rounded-md border border-border bg-[#080B10] overflow-hidden">
      <div className="px-3 py-1.5 border-b border-border bg-bg-base/40 text-[11px] uppercase tracking-wide text-text-muted">
        Output
      </div>
      <div className="p-3 font-mono text-[12.5px] leading-relaxed whitespace-pre-wrap max-h-60 overflow-auto">
        {empty && <span className="text-text-muted italic">(no output)</span>}
        {output.stdout && <div className="text-text-primary">{output.stdout}</div>}
        {output.stderr && <div className="text-yellow-400">{output.stderr}</div>}
        {output.result != null && (
          <div className="text-accent">⇒ {output.result}</div>
        )}
        {output.error && (
          <div className="mt-1 flex items-start gap-1.5 text-danger">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <span>{output.error}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- A code block used inside the Solution tab (read-only, highlighted) ----
function SolutionCode({ code, language }: { code: string; language: string }) {
  return (
    <div className="code-hl rounded-md border border-border bg-[#0d1117] overflow-auto max-h-80">
      <pre
        className="m-0 p-3 text-[12px] leading-[1.7] text-text-primary"
        style={{
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace",
        }}
        dangerouslySetInnerHTML={{ __html: highlightCode(code, language) }}
      />
    </div>
  );
}

// ---- Attempt: coding editor + run ----
function AttemptCoding({ question }: { question: PracticeQuestion }) {
  const starters = question.starters ?? [];
  const jsIdx = starters.findIndex((s) => runnableLang(s.language) === "javascript");
  const [langIdx, setLangIdx] = useState(jsIdx >= 0 ? jsIdx : 0);
  const active = starters[Math.min(langIdx, starters.length - 1)];
  const [code, setCode] = useState(active?.code ?? "");
  const [running, setRunning] = useState(false);
  const [pyLoading, setPyLoading] = useState(false);
  const [javaLoading, setJavaLoading] = useState(false);
  const [output, setOutput] = useState<RunResult | null>(null);

  // Reset editor when the active language changes.
  useEffect(() => {
    setCode(active?.code ?? "");
    setOutput(null);
  }, [active?.code]);

  const runLang = runnableLang(active?.language ?? "");

  const onRun = useCallback(async () => {
    if (!runLang) return;
    setRunning(true);
    setOutput(null);
    try {
      if (runLang === "javascript") {
        setOutput(await runJavaScript(code));
      } else if (runLang === "java") {
        const cold = !isJavaReady();
        if (cold) setJavaLoading(true);
        try {
          setOutput(await runJava(code));
        } finally {
          if (cold) setJavaLoading(false);
        }
      } else {
        const cold = !isPyodideReady();
        if (cold) setPyLoading(true);
        try {
          setOutput(await runPython(code));
        } finally {
          if (cold) setPyLoading(false);
        }
      }
    } catch (err) {
      setOutput({
        stdout: "",
        stderr: "",
        error: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setRunning(false);
    }
  }, [runLang, code]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      if (!running) onRun();
    }
  };

  return (
    <div className="flex flex-col min-h-0 h-full">
      {/* Language tabs */}
      <div className="flex items-center gap-1 px-3 pt-2 border-b border-border shrink-0">
        {starters.map((s, i) => (
          <button
            key={s.language}
            type="button"
            onClick={() => setLangIdx(i)}
            className={`px-3 py-1.5 text-[12px] rounded-t-md border-t border-l border-r transition-colors ${
              i === Math.min(langIdx, starters.length - 1)
                ? "border-border bg-[#0d1117] text-accent"
                : "border-transparent text-text-muted hover:text-text-primary"
            }`}
          >
            {s.language.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div className="code-hl flex-1 min-h-0 overflow-auto text-text-primary bg-[#0d1117]">
        <Editor
          value={code}
          onValueChange={setCode}
          highlight={(c) => highlightCode(c, active?.language ?? "")}
          onKeyDown={onKeyDown}
          padding={12}
          tabSize={2}
          insertSpaces
          spellCheck={false}
          className="min-h-full text-[12.5px]"
          style={{
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace",
            lineHeight: 1.7,
          }}
        />
      </div>

      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-t border-border shrink-0">
        <button
          type="button"
          onClick={onRun}
          disabled={running || !runLang}
          className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold px-3.5 py-1.5 rounded-md bg-accent text-bg-base hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {running ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Running…
            </>
          ) : (
            <>
              <Play size={14} /> Run
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => setCode(active?.code ?? "")}
          className="inline-flex items-center gap-1 text-[11.5px] px-2.5 py-1 rounded-md border border-border bg-bg-base hover:bg-bg-hover text-text-secondary hover:text-text-primary"
        >
          <RotateCcw size={12} /> Reset
        </button>
        {runLang === "java" && <JavaWakeButton />}
        <span className="text-[11px] text-text-muted ml-auto">
          {runLang === "java" ? "Runs on the server" : "Runs in your browser"} ·
          Ctrl/⌘+Enter
        </span>
      </div>

      {output && (
        <div className="px-3 pb-3 shrink-0">
          <OutputBox output={output} />
        </div>
      )}
      {pyLoading && <CenterLoader label="Setting up Python runtime…" />}
      {javaLoading && <CenterLoader label="Waking Java runtime…" />}
    </div>
  );
}

// ---- Attempt: design scratchpad ----
function AttemptDesign({ question }: { question: PracticeQuestion }) {
  const key = `solve:notes:${question.id}`;
  const [notes, setNotes] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      setNotes(localStorage.getItem(key) ?? "");
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(key, notes);
    } catch {
      /* ignore */
    }
  }, [notes, key, hydrated]);

  return (
    <div className="flex flex-col min-h-0 h-full p-3">
      <div className="text-[12px] text-text-muted mb-2 shrink-0">
        Sketch your design — requirements, API, data model, scaling. Saved
        automatically in this browser.
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder={"e.g.\n1) Requirements & scale estimates\n2) API: POST /shorten, GET /:key\n3) Data model\n4) Key generation\n5) Caching / sharding / availability"}
        spellCheck={false}
        className="flex-1 min-h-0 resize-none rounded-md border border-border bg-[#0d1117] text-text-primary text-[13px] leading-relaxed p-3 outline-none focus:border-accent/50 font-mono"
      />
    </div>
  );
}

// ---- Solution tab ----
function SolutionTierCard({ tier, index }: { tier: SolutionTier; index: number }) {
  const [langIdx, setLangIdx] = useState(0);
  const accent = TIER_COLOR[tier.kind] ?? TIER_COLOR.variant;
  const code = tier.code ?? [];
  const ex = code[Math.min(langIdx, Math.max(code.length - 1, 0))];

  return (
    <div className="rounded-lg border border-border bg-bg-card/40 p-4 space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={`text-[11.5px] font-medium px-2.5 py-1 rounded-md border ${accent}`}
        >
          {tier.name}
        </span>
        {tier.complexity && (
          <span className="text-[11px] font-mono text-text-muted">
            Time {tier.complexity.time} · Space {tier.complexity.space}
          </span>
        )}
      </div>

      <p className="text-[13px] leading-relaxed text-text-secondary">
        {renderInline(tier.idea)}
      </p>

      {tier.notes && tier.notes.length > 0 && (
        <ul className="space-y-1.5">
          {tier.notes.map((n, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-[12.5px] text-text-secondary"
            >
              <span className="text-accent select-none mt-0.5 shrink-0">→</span>
              <span>{renderInline(n)}</span>
            </li>
          ))}
        </ul>
      )}

      {code.length > 0 && (
        <>
          {code.length > 1 && (
            <div className="flex items-center gap-1">
              {code.map((c, i) => (
                <button
                  key={c.language}
                  type="button"
                  onClick={() => setLangIdx(i)}
                  className={`px-2.5 py-1 text-[11.5px] rounded-md border transition-colors ${
                    i === Math.min(langIdx, code.length - 1)
                      ? "border-border bg-[#0d1117] text-accent"
                      : "border-transparent text-text-muted hover:text-text-primary"
                  }`}
                >
                  {c.language.toUpperCase()}
                </button>
              ))}
            </div>
          )}
          {ex && <SolutionCode code={ex.code} language={ex.language} />}
        </>
      )}
    </div>
  );
}

// ---- Left: question panel ----
function QuestionPanel({ q }: { q: PracticeQuestion }) {
  return (
    <div className="h-full overflow-auto p-5 space-y-5">
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-lg font-bold text-text-primary">{q.title}</h1>
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
              DIFF_COLOR[q.difficulty]
            }`}
          >
            {q.difficulty}
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {q.tags.map((t) => (
            <span
              key={t}
              className="text-[10.5px] px-2 py-0.5 rounded-full border border-border bg-bg-base text-text-muted"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-3 text-[13.5px] leading-relaxed text-text-secondary">
        {q.prompt.split("\n\n").map((para, i) => (
          <p key={i}>{renderInline(para)}</p>
        ))}
      </div>

      {q.examples && q.examples.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-[13px] font-semibold text-text-primary">Examples</h2>
          {q.examples.map((e, i) => (
            <div
              key={i}
              className="rounded-md border border-border bg-bg-base/50 p-3 font-mono text-[12px] space-y-1"
            >
              <div>
                <span className="text-text-muted">Input: </span>
                <span className="text-text-primary">{e.input}</span>
              </div>
              <div>
                <span className="text-text-muted">Output: </span>
                <span className="text-text-primary">{e.output}</span>
              </div>
              {e.explanation && (
                <div className="text-text-muted">{e.explanation}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {q.constraints && q.constraints.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-[13px] font-semibold text-text-primary">
            {q.kind === "design" ? "Requirements" : "Constraints"}
          </h2>
          <ul className="space-y-1">
            {q.constraints.map((c, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-[12.5px] text-text-secondary"
              >
                <span className="text-text-muted select-none mt-0.5 shrink-0">•</span>
                <span className="font-mono">{renderInline(c)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function SolvePage() {
  const [selectedId, setSelectedId] = useState(PRACTICE_QUESTIONS[0].id);
  const [tab, setTab] = useState<"attempt" | "solution">("attempt");

  const question = useMemo(
    () => PRACTICE_QUESTIONS.find((x) => x.id === selectedId) ?? PRACTICE_QUESTIONS[0],
    [selectedId]
  );

  return (
    <div className="h-screen flex flex-col bg-bg-base text-text-primary overflow-hidden">
      {/* Top bar */}
      <header className="flex-shrink-0 flex flex-wrap items-center gap-2 px-3 sm:px-4 py-2.5 border-b border-border bg-bg-panel/90 backdrop-blur">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text-primary px-2 py-1 rounded-md hover:bg-bg-hover shrink-0"
        >
          <ArrowLeft size={15} /> Back
        </a>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shrink-0">
            <Code2 size={15} />
          </div>
          <span className="text-sm font-semibold hidden sm:inline">Practice</span>
        </div>

        {/* Question picker */}
        <div className="flex items-center gap-1 ml-1 flex-wrap">
          {PRACTICE_QUESTIONS.map((q) => (
            <button
              key={q.id}
              type="button"
              onClick={() => {
                setSelectedId(q.id);
                setTab("attempt");
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] border transition-colors ${
                q.id === selectedId
                  ? "border-accent/40 bg-accent/10 text-text-primary"
                  : "border-border bg-bg-base text-text-muted hover:text-text-primary hover:bg-bg-hover"
              }`}
            >
              <span className="text-[9.5px] uppercase tracking-wide text-text-muted">
                {q.category}
              </span>
              {q.title}
            </button>
          ))}
        </div>
      </header>

      {/* Split body */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT — question */}
        <section className="min-h-0 border-b lg:border-b-0 lg:border-r border-border overflow-hidden">
          <QuestionPanel q={question} />
        </section>

        {/* RIGHT — attempt / solution */}
        <section className="min-h-0 flex flex-col overflow-hidden">
          <div className="flex items-center gap-1 px-3 pt-2 border-b border-border shrink-0">
            <button
              type="button"
              onClick={() => setTab("attempt")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[12.5px] rounded-t-md border-t border-l border-r transition-colors ${
                tab === "attempt"
                  ? "border-border bg-bg-card text-accent"
                  : "border-transparent text-text-muted hover:text-text-primary"
              }`}
            >
              <Code2 size={14} /> {question.kind === "design" ? "Scratchpad" : "Attempt"}
            </button>
            <button
              type="button"
              onClick={() => setTab("solution")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[12.5px] rounded-t-md border-t border-l border-r transition-colors ${
                tab === "solution"
                  ? "border-border bg-bg-card text-accent"
                  : "border-transparent text-text-muted hover:text-text-primary"
              }`}
            >
              <ListChecks size={14} /> Solution
            </button>
          </div>

          <div className="flex-1 min-h-0 overflow-hidden">
            {tab === "attempt" ? (
              question.kind === "coding" ? (
                <AttemptCoding key={question.id} question={question} />
              ) : (
                <AttemptDesign key={question.id} question={question} />
              )
            ) : (
              <div className="h-full overflow-auto p-4 space-y-3">
                <div className="flex items-center gap-2 text-text-muted text-[12px]">
                  <BookOpen size={14} />
                  Solutions — brute force → optimal, with variants.
                </div>
                {question.solutions.map((tier, i) => (
                  <SolutionTierCard key={i} tier={tier} index={i} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
