// ============================================================
// In-browser code execution (client-only). No backend, no external
// execution API — JavaScript runs in a sandboxed Web Worker; Python runs
// via Pyodide (WASM) loaded lazily from a CDN on first use.
//
// Safe to import from anywhere: nothing touches window/Worker at module load;
// browser APIs are only referenced inside the exported functions.
// ============================================================

export type RunResult = {
  stdout: string;
  stderr: string;
  /** repr of the return / last-expression value, if any */
  result?: string;
  /** fatal error (exception, timeout, or runtime-load failure) */
  error?: string;
  /** tabular result set (SQL queries) — rendered as an HTML table by the UI */
  table?: { columns: string[]; rows: (string | number | null)[][] };
};

// ------------------------------------------------------------
// JavaScript — sandboxed Web Worker
// ------------------------------------------------------------
// The worker executes the user's code with a captured `console`. It runs on its
// own thread, so an infinite loop can be killed from the main thread via
// terminate() without freezing the UI.
const JS_WORKER_SRC = `
self.onmessage = function (e) {
  var out = [];
  var errs = [];
  function fmt(args) {
    return Array.prototype.map.call(args, function (a) {
      if (typeof a === 'string') return a;
      if (a instanceof Error) return a.stack || a.message || String(a);
      try { return JSON.stringify(a, null, 2); } catch (_) { return String(a); }
    }).join(' ');
  }
  var sandbox = {
    log:   function () { out.push(fmt(arguments)); },
    info:  function () { out.push(fmt(arguments)); },
    debug: function () { out.push(fmt(arguments)); },
    warn:  function () { out.push(fmt(arguments)); },
    error: function () { errs.push(fmt(arguments)); }
  };
  try {
    var fn = new Function('console', '"use strict";\\n' + e.data);
    var ret = fn(sandbox);
    self.postMessage({
      ok: true,
      stdout: out.join('\\n'),
      stderr: errs.join('\\n'),
      result: ret === undefined ? undefined : fmt([ret])
    });
  } catch (err) {
    self.postMessage({
      ok: false,
      stdout: out.join('\\n'),
      stderr: errs.join('\\n'),
      error: (err && err.stack) ? err.stack : String(err)
    });
  }
};
`;

export function runJavaScript(code: string, timeoutMs = 5000): Promise<RunResult> {
  return new Promise((resolve) => {
    let worker: Worker | null = null;
    let url = "";
    let timer: ReturnType<typeof setTimeout> | null = null;
    let done = false;

    const finish = (r: RunResult) => {
      if (done) return;
      done = true;
      if (timer) clearTimeout(timer);
      try {
        worker?.terminate();
      } catch {
        /* ignore */
      }
      if (url) URL.revokeObjectURL(url);
      resolve(r);
    };

    try {
      const blob = new Blob([JS_WORKER_SRC], { type: "application/javascript" });
      url = URL.createObjectURL(blob);
      worker = new Worker(url);
      worker.onmessage = (e: MessageEvent) => {
        const d = e.data as {
          ok: boolean;
          stdout?: string;
          stderr?: string;
          result?: string;
          error?: string;
        };
        finish({
          stdout: d.stdout ?? "",
          stderr: d.stderr ?? "",
          result: d.result,
          error: d.ok ? undefined : d.error,
        });
      };
      worker.onerror = (e: ErrorEvent) => {
        finish({ stdout: "", stderr: "", error: e.message || "Worker error" });
      };
      timer = setTimeout(() => {
        finish({
          stdout: "",
          stderr: "",
          error: `Execution timed out after ${timeoutMs}ms (possible infinite loop).`,
        });
      }, timeoutMs);
      worker.postMessage(code);
    } catch (err) {
      finish({
        stdout: "",
        stderr: "",
        error: err instanceof Error ? err.message : String(err),
      });
    }
  });
}

// ------------------------------------------------------------
// Python — Pyodide (WASM), lazily loaded from CDN on first use
// ------------------------------------------------------------
const PYODIDE_VERSION = "0.26.4";
const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

type PyodideLike = {
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdout: (opts: { batched: (s: string) => void }) => void;
  setStderr: (opts: { batched: (s: string) => void }) => void;
};

// Module-level cache: the Pyodide instance initializes once per session and is
// reused by every subsequent Python run.
let pyodidePromise: Promise<PyodideLike> | null = null;

/** True once Pyodide has begun (or finished) loading — used to decide whether
 *  to show the one-time "Setting up Python runtime…" modal. */
export function isPyodideReady(): boolean {
  return pyodidePromise !== null;
}

function injectPyodideScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    const w = window as unknown as { loadPyodide?: unknown };
    if (w.loadPyodide) return resolve();

    const existing = document.querySelector<HTMLScriptElement>(
      "script[data-pyodide]"
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load Pyodide from CDN"))
      );
      return;
    }

    const s = document.createElement("script");
    s.src = `${PYODIDE_INDEX_URL}pyodide.js`;
    s.async = true;
    s.setAttribute("data-pyodide", "true");
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Pyodide from CDN"));
    document.head.appendChild(s);
  });
}

function ensurePyodide(): Promise<PyodideLike> {
  if (pyodidePromise) return pyodidePromise;
  pyodidePromise = (async () => {
    await injectPyodideScript();
    const loadPyodide = (
      window as unknown as {
        loadPyodide: (cfg: { indexURL: string }) => Promise<PyodideLike>;
      }
    ).loadPyodide;
    return loadPyodide({ indexURL: PYODIDE_INDEX_URL });
  })();
  // On failure, clear the cache so the next Run can retry the load.
  pyodidePromise.catch(() => {
    pyodidePromise = null;
  });
  return pyodidePromise;
}

export async function runPython(code: string): Promise<RunResult> {
  let pyodide: PyodideLike;
  try {
    pyodide = await ensurePyodide();
  } catch (err) {
    return {
      stdout: "",
      stderr: "",
      error:
        err instanceof Error
          ? err.message
          : "Failed to load the Python runtime.",
    };
  }

  let stdout = "";
  let stderr = "";
  try {
    pyodide.setStdout({ batched: (s) => (stdout += s) });
    pyodide.setStderr({ batched: (s) => (stderr += s) });
    const result = await pyodide.runPythonAsync(code);
    const resStr =
      result === undefined || result === null ? undefined : String(result);
    return { stdout, stderr, result: resStr };
  } catch (err) {
    return {
      stdout,
      stderr,
      error: err instanceof Error ? err.message || String(err) : String(err),
    };
  } finally {
    // Detach our capturers so we don't accumulate output across runs.
    try {
      pyodide.setStdout({ batched: () => {} });
      pyodide.setStderr({ batched: () => {} });
    } catch {
      /* ignore */
    }
  }
}

// ------------------------------------------------------------
// Java — compiled + run on a small backend service (Render free tier), reached
// through our own auth-gated proxy at /api/run-java. Unlike JS/Python/SQL there
// is no in-browser runtime: the JVM cannot run client-side. The first call
// after the service has been idle pays a cold-start (~30–60s); `javaWarm` lets
// the UI show a one-time "Waking Java runtime…" modal, mirroring Pyodide/sql.js.
// ------------------------------------------------------------
let javaWarm = false;

/** True once at least one Java run has completed this session (the backend is
 *  presumed warm) — used to decide whether to show the cold-start modal. */
export function isJavaReady(): boolean {
  return javaWarm;
}

/** Mark the Java backend as warm — called after a successful health-check so a
 *  subsequent run skips the "Waking Java runtime…" modal. */
export function markJavaWarm(): void {
  javaWarm = true;
}

export async function runJava(code: string): Promise<RunResult> {
  try {
    const res = await fetch("/api/run-java", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      stdout?: string;
      stderr?: string;
      error?: string;
    };
    if (!res.ok) {
      return { stdout: "", stderr: "", error: data.error || `Run failed (HTTP ${res.status}).` };
    }
    javaWarm = true;
    return {
      stdout: data.stdout ?? "",
      stderr: data.stderr ?? "",
      error: data.error,
    };
  } catch (err) {
    return {
      stdout: "",
      stderr: "",
      error: err instanceof Error ? err.message : "Could not reach the Java runtime.",
    };
  }
}

// ------------------------------------------------------------
// SQL — sql.js (SQLite compiled to WASM), lazily loaded from CDN on first use.
//
// Real MySQL cannot run client-side (it's a client-server C++ engine with no
// browser WASM build), so the in-browser engine is SQLite via sql.js — ~95%
// syntax-compatible with MySQL for analyst-level SQL (SELECT/JOIN/GROUP BY/
// HAVING/window functions/CTEs). Each run uses a FRESH in-memory database so
// results are reproducible: the optional `setup` DDL is re-applied every time,
// meaning a query block always sees a known schema regardless of run order.
// ------------------------------------------------------------
const SQLJS_VERSION = "1.12.0";
const SQLJS_CDN = `https://cdn.jsdelivr.net/npm/sql.js@${SQLJS_VERSION}/dist`;

type SqlValue = string | number | Uint8Array | null;
type SqlExecResult = { columns: string[]; values: SqlValue[][] };
type SqlDatabase = {
  run: (sql: string) => void;
  exec: (sql: string) => SqlExecResult[];
  close: () => void;
};
type SqlJsStatic = { Database: new () => SqlDatabase };

// Module-level cache: sql.js initializes once per session and is reused by
// every subsequent SQL run.
let sqlJsPromise: Promise<SqlJsStatic> | null = null;

/** True once sql.js has begun (or finished) loading — used to decide whether
 *  to show the one-time "Setting up SQL runtime…" modal. */
export function isSqlReady(): boolean {
  return sqlJsPromise !== null;
}

function injectSqlJsScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    const w = window as unknown as { initSqlJs?: unknown };
    if (w.initSqlJs) return resolve();

    const existing = document.querySelector<HTMLScriptElement>(
      "script[data-sqljs]"
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load sql.js from CDN"))
      );
      return;
    }

    const s = document.createElement("script");
    s.src = `${SQLJS_CDN}/sql-wasm.js`;
    s.async = true;
    s.setAttribute("data-sqljs", "true");
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load sql.js from CDN"));
    document.head.appendChild(s);
  });
}

function ensureSqlJs(): Promise<SqlJsStatic> {
  if (sqlJsPromise) return sqlJsPromise;
  sqlJsPromise = (async () => {
    await injectSqlJsScript();
    const initSqlJs = (
      window as unknown as {
        initSqlJs: (cfg: {
          locateFile: (file: string) => string;
        }) => Promise<SqlJsStatic>;
      }
    ).initSqlJs;
    return initSqlJs({ locateFile: (file) => `${SQLJS_CDN}/${file}` });
  })();
  // On failure, clear the cache so the next Run can retry the load.
  sqlJsPromise.catch(() => {
    sqlJsPromise = null;
  });
  return sqlJsPromise;
}

/** Render a sql.js value for display: Uint8Array (BLOB) → placeholder, else pass through. */
function normalizeSqlValue(v: SqlValue): string | number | null {
  if (v === null) return null;
  if (typeof v === "number" || typeof v === "string") return v;
  return "[blob]";
}

type SqlTable = { columns: string[]; rows: (string | number | null)[][] };

/** Execute `code` (after optional `setup`) in a fresh DB; return the last
 *  rows-returning result set, or null for DDL/DML that returns nothing. */
function execToTable(SQL: SqlJsStatic, code: string, setup?: string): SqlTable | null {
  const db = new SQL.Database();
  try {
    if (setup && setup.trim()) db.run(setup);
    const results = db.exec(code);
    const last = [...results].reverse().find((r) => r.columns.length > 0);
    if (!last) return null;
    return {
      columns: last.columns,
      rows: last.values.map((row) => row.map(normalizeSqlValue)),
    };
  } finally {
    try {
      db.close();
    } catch {
      /* ignore */
    }
  }
}

/**
 * Run SQL in a fresh in-browser SQLite database. `setup` (if given) is executed
 * first — typically CREATE TABLE + INSERT — then `code` runs against it. The
 * LAST statement that returns rows becomes the result `table`; statements that
 * return no rows (DDL/INSERT/UPDATE) report a friendly stdout line instead.
 */
export async function runSql(code: string, setup?: string): Promise<RunResult> {
  let SQL: SqlJsStatic;
  try {
    SQL = await ensureSqlJs();
  } catch (err) {
    return {
      stdout: "",
      stderr: "",
      error:
        err instanceof Error ? err.message : "Failed to load the SQL runtime.",
    };
  }

  try {
    const table = execToTable(SQL, code, setup);
    if (!table) {
      return {
        stdout: "OK — statement executed (no rows returned).",
        stderr: "",
      };
    }
    return { stdout: "", stderr: "", table };
  } catch (err) {
    return {
      stdout: "",
      stderr: "",
      error: err instanceof Error ? err.message || String(err) : String(err),
    };
  }
}

/** Normalize a result set to a comparable string form. Rows are compared as an
 *  unordered multiset unless `orderMatters`. Cell values compared as strings. */
function tableSignature(t: SqlTable, orderMatters: boolean): string {
  const rowStrings = t.rows.map((r) =>
    r.map((c) => (c === null ? " NULL" : String(c))).join("")
  );
  if (!orderMatters) rowStrings.sort();
  // Column count matters (so "too many/few columns" is wrong) but not names,
  // since learners may alias differently than the reference solution.
  return `cols=${t.columns.length}${rowStrings.join("")}`;
}

export type CheckedRunResult = RunResult & {
  /** true/false once judged; undefined when it couldn't be judged (user error,
   *  or the exercise defines no solution). */
  correct?: boolean;
};

/**
 * Run a learner's SQL and judge correctness by comparing its result set to the
 * reference `solution` query's result — both run against the same `setup` in
 * separate fresh databases. Correctness is result-based, never text-based.
 */
export async function runSqlChecked(
  code: string,
  opts: { setup?: string; solution?: string; orderMatters?: boolean }
): Promise<CheckedRunResult> {
  let SQL: SqlJsStatic;
  try {
    SQL = await ensureSqlJs();
  } catch (err) {
    return {
      stdout: "",
      stderr: "",
      error:
        err instanceof Error ? err.message : "Failed to load the SQL runtime.",
    };
  }

  // Run the learner's query.
  let userTable: SqlTable | null;
  try {
    userTable = execToTable(SQL, code, opts.setup);
  } catch (err) {
    return {
      stdout: "",
      stderr: "",
      error: err instanceof Error ? err.message || String(err) : String(err),
    };
  }

  const base: RunResult = userTable
    ? { stdout: "", stderr: "", table: userTable }
    : { stdout: "OK — statement executed (no rows returned).", stderr: "" };

  // Judge against the reference solution when one is provided and the learner's
  // query actually produced a result set.
  if (!opts.solution || !userTable) return base;
  try {
    const expected = execToTable(SQL, opts.solution, opts.setup);
    if (!expected) return base; // solution returns no rows → nothing to compare
    const orderMatters = !!opts.orderMatters;
    const correct =
      tableSignature(userTable, orderMatters) ===
      tableSignature(expected, orderMatters);
    return { ...base, correct };
  } catch {
    // A broken reference solution shouldn't block the learner.
    return base;
  }
}
