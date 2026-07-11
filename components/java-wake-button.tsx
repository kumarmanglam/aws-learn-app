"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Coffee, CheckCircle2, AlertCircle } from "lucide-react";
import { markJavaWarm } from "@/lib/code-runner";

// ============================================================
// JavaWakeButton — manually spin up the free-tier Java backend before running
// any Java code. Pings GET /api/run-java (which proxies the executor's /health)
// so the ~30–60s cold start happens up-front, not mid-run. On success it marks
// the runtime warm so the next Run skips the "Waking Java runtime…" modal.
//
// Once the server has been hit successfully the button DISABLES itself for a
// while (the free tier stays warm ~15 min of activity), then re-enables so the
// user can re-warm it before it spins down again.
// ============================================================

type Status = "idle" | "waking" | "ready" | "error";

// Render free tier spins down after ~15 min idle; keep the button disabled just
// under that so a re-warm becomes available shortly before it goes cold.
const WARM_DISABLE_MS = 14 * 60 * 1000;

export function JavaWakeButton({ className = "" }: { className?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    []
  );

  const wake = useCallback(async () => {
    if (status === "waking" || status === "ready") return;
    setStatus("waking");
    setMessage("");
    try {
      const res = await fetch("/api/run-java", {
        method: "GET",
        cache: "no-store",
      });
      const data = (await res.json().catch(() => ({}))) as {
        warm?: boolean;
        error?: string;
      };
      if (res.ok && data.warm) {
        markJavaWarm();
        setStatus("ready");
        // Disable for a while; re-enable so a re-warm is possible before the
        // instance spins down.
        if (resetTimer.current) clearTimeout(resetTimer.current);
        resetTimer.current = setTimeout(
          () => setStatus("idle"),
          WARM_DISABLE_MS
        );
      } else {
        setStatus("error");
        setMessage(data.error || `Failed (HTTP ${res.status})`);
      }
    } catch {
      setStatus("error");
      setMessage("Could not reach the Java runtime.");
    }
  }, [status]);

  const base =
    "inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-md border transition-colors";

  // Warm & recently hit — disabled until the re-warm timer elapses.
  if (status === "ready") {
    return (
      <button
        type="button"
        disabled
        title="Java backend is awake. This will re-enable so you can re-warm it before it goes idle."
        className={`${base} border-green-500/40 bg-green-500/10 text-green-400 cursor-default opacity-90 ${className}`}
      >
        <CheckCircle2 size={14} /> Java ready
      </button>
    );
  }

  if (status === "waking") {
    return (
      <button
        type="button"
        disabled
        className={`${base} border-border bg-bg-base text-text-secondary cursor-wait ${className}`}
      >
        <Loader2 size={14} className="animate-spin" /> Waking Java…
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={wake}
      title={
        status === "error"
          ? message || "Retry waking the Java backend"
          : "Spin up the Java backend (free-tier cold start ~30–60s) before running Java code"
      }
      className={`${base} ${
        status === "error"
          ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/15"
          : "border-border bg-bg-base text-text-secondary hover:text-text-primary hover:bg-bg-hover"
      } ${className}`}
    >
      {status === "error" ? (
        <>
          <AlertCircle size={14} /> Retry wake
        </>
      ) : (
        <>
          <Coffee size={14} /> Wake Java backend
        </>
      )}
    </button>
  );
}
