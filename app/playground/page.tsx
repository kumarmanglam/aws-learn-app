"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Play,
  Loader2,
  RotateCcw,
  Eraser,
  ArrowLeft,
  Terminal,
  AlertCircle,
} from "lucide-react";
import {
  runJavaScript,
  runPython,
  isPyodideReady,
  type RunResult,
} from "@/lib/code-runner";
import { CenterLoader } from "@/components/center-loader";

// ============================================================
// Playground — a dedicated in-browser coding sandbox.
// JavaScript runs in a sandboxed Web Worker; Python via Pyodide (WASM),
// loaded lazily on first Python run. No backend, no external execution API.
// ============================================================

type LangKey = "javascript" | "python";

const LANGUAGES: { key: LangKey; label: string; file: string; template: string }[] =
  [
    {
      key: "javascript",
      label: "JavaScript",
      file: "main.js",
      template: `// JavaScript (sandboxed Web Worker)
function fib(n) {
  return n < 2 ? n : fib(n - 1) + fib(n - 2);
}

for (let i = 0; i < 10; i++) {
  console.log(\`fib(\${i}) = \${fib(i)}\`);
}
`,
    },
    {
      key: "python",
      label: "Python",
      file: "main.py",
      template: `# Python 3 (Pyodide / WASM)
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)


for i in range(10):
    print(f"fib({i}) = {fib(i)}")
`,
    },
  ];

const TEMPLATES: Record<LangKey, string> = LANGUAGES.reduce(
  (acc, l) => ({ ...acc, [l.key]: l.template }),
  {} as Record<LangKey, string>
);

const STORAGE_SOURCES = "playground:sources";
const STORAGE_LANG = "playground:lang";

export default function PlaygroundPage() {
  const [language, setLanguage] = useState<LangKey>("javascript");
  const [sources, setSources] = useState<Record<LangKey, string>>(TEMPLATES);
  const [running, setRunning] = useState(false);
  const [pyLoading, setPyLoading] = useState(false);
  const [output, setOutput] = useState<RunResult | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const gutterRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Restore saved code / language (purely FE).
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_LANG);
      if (savedLang === "javascript" || savedLang === "python") {
        setLanguage(savedLang);
      }
      const raw = localStorage.getItem(STORAGE_SOURCES);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Record<LangKey, string>>;
        setSources((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_SOURCES, JSON.stringify(sources));
      localStorage.setItem(STORAGE_LANG, language);
    } catch {
      /* ignore quota */
    }
  }, [sources, language, hydrated]);

  const source = sources[language];
  const setSource = (value: string) =>
    setSources((prev) => ({ ...prev, [language]: value }));

  const lineCount = useMemo(() => source.split("\n").length, [source]);
  const activeLang = LANGUAGES.find((l) => l.key === language)!;

  const run = useCallback(async () => {
    setRunning(true);
    setOutput(null);
    try {
      if (language === "javascript") {
        setOutput(await runJavaScript(sources.javascript));
      } else {
        const cold = !isPyodideReady();
        if (cold) setPyLoading(true);
        try {
          setOutput(await runPython(sources.python));
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
  }, [language, sources]);

  const onEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      if (!running) run();
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const el = e.currentTarget;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const next = source.slice(0, start) + "  " + source.slice(end);
      setSource(next);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 2;
      });
    }
  };

  const outputEmpty =
    output &&
    !output.stdout &&
    !output.stderr &&
    !output.error &&
    output.result == null;

  return (
    <div className="h-screen flex flex-col bg-bg-base text-text-primary overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 flex flex-wrap items-center gap-2 px-3 sm:px-4 py-3 border-b border-border bg-bg-panel/90 backdrop-blur">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text-primary px-2 py-1 rounded-md hover:bg-bg-hover shrink-0"
        >
          <ArrowLeft size={15} /> Back
        </a>
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-md bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shrink-0">
            <Terminal size={16} />
          </div>
          <div className="leading-tight hidden sm:block">
            <div className="text-sm font-semibold">Playground</div>
            <div className="text-[11px] text-text-muted">
              Run JavaScript &amp; Python in your browser
            </div>
          </div>
        </div>

        {/* Language selector */}
        <div className="ml-auto shrink-0 flex items-center gap-1 rounded-md border border-border bg-bg-base p-0.5">
          {LANGUAGES.map((l) => (
            <button
              key={l.key}
              type="button"
              onClick={() => {
                setLanguage(l.key);
                setOutput(null);
              }}
              className={`px-3 py-1.5 rounded text-[12.5px] font-medium transition-colors ${
                language === l.key
                  ? "bg-accent text-bg-base"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-3 p-3">
        {/* Editor */}
        <section className="flex flex-col min-h-0 rounded-lg border border-border bg-[#0d1117] overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-bg-panel/40">
            <div className="flex items-center gap-2 text-[11px] text-text-muted">
              <span className="font-mono px-1.5 py-0.5 rounded bg-bg-base border border-border text-accent">
                {activeLang.file}
              </span>
              <span className="hidden sm:inline">
                {lineCount} line{lineCount === 1 ? "" : "s"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSource("")}
                className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded border border-border bg-bg-base hover:bg-bg-hover text-text-secondary hover:text-text-primary"
              >
                <Eraser size={12} /> Clear
              </button>
              <button
                type="button"
                onClick={() => setSource(TEMPLATES[language])}
                className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded border border-border bg-bg-base hover:bg-bg-hover text-text-secondary hover:text-text-primary"
              >
                <RotateCcw size={12} /> Reset
              </button>
              <button
                type="button"
                onClick={run}
                disabled={running || !source.trim()}
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1 rounded bg-accent text-bg-base hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {running ? (
                  <>
                    <Loader2 size={13} className="animate-spin" /> Running…
                  </>
                ) : (
                  <>
                    <Play size={13} /> Run
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0 flex font-mono text-[13px] leading-[1.6]">
            <div
              ref={gutterRef}
              aria-hidden
              className="select-none overflow-hidden py-3 pl-3 pr-2 text-right text-text-muted/50 border-r border-border/40 bg-bg-base/30"
            >
              {Array.from({ length: lineCount }, (_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <textarea
              ref={editorRef}
              value={source}
              onChange={(e) => setSource(e.target.value)}
              onKeyDown={onEditorKeyDown}
              onScroll={(e) => {
                if (gutterRef.current)
                  gutterRef.current.scrollTop = e.currentTarget.scrollTop;
              }}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              wrap="off"
              className="flex-1 min-w-0 resize-none bg-transparent text-text-primary outline-none py-3 px-3 leading-[1.6] whitespace-pre overflow-auto"
              placeholder="Write your code here…"
            />
          </div>

          <div className="px-3 py-1.5 border-t border-border bg-bg-panel/40 text-[10.5px] text-text-muted">
            Press{" "}
            <kbd className="font-mono px-1 py-0.5 rounded bg-bg-base border border-border">
              Ctrl/⌘ + Enter
            </kbd>{" "}
            to run · {language === "python" ? "Pyodide (WASM)" : "sandboxed Web Worker"}
          </div>
        </section>

        {/* Output */}
        <section className="flex flex-col min-h-0 rounded-lg border border-border bg-[#0d1117] overflow-hidden">
          <div className="px-3 py-2 border-b border-border bg-bg-panel/40 flex items-center justify-between">
            <div className="text-[11px] uppercase tracking-wide text-text-muted">
              Output
            </div>
            {output && !running && (
              <button
                type="button"
                onClick={() => setOutput(null)}
                className="text-[11px] px-2 py-0.5 rounded border border-border bg-bg-base hover:bg-bg-hover text-text-secondary hover:text-text-primary"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex-1 min-h-0 overflow-auto p-3 font-mono text-[12.5px] leading-relaxed whitespace-pre-wrap">
            {running && (
              <div className="flex items-center gap-2 text-text-muted">
                <Loader2 size={14} className="animate-spin" /> Executing…
              </div>
            )}
            {!running && !output && (
              <div className="text-text-muted italic">
                Run your code to see the output here.
              </div>
            )}
            {!running && outputEmpty && (
              <div className="text-text-muted italic">(no output)</div>
            )}
            {!running && output && (
              <>
                {output.stdout && (
                  <div className="text-text-primary">{output.stdout}</div>
                )}
                {output.stderr && (
                  <div className="text-yellow-400">{output.stderr}</div>
                )}
                {output.result != null && (
                  <div className="text-accent">⇒ {output.result}</div>
                )}
                {output.error && (
                  <div className="mt-1 flex items-start gap-1.5 text-danger">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                    <span>{output.error}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>

      {pyLoading && <CenterLoader label="Setting up Python runtime…" />}
    </div>
  );
}
