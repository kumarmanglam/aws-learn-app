"use client";

import { useCallback, useState } from "react";
import { Loader2, Coffee, CheckCircle2, AlertCircle } from "lucide-react";
import { markJavaWarm } from "@/lib/code-runner";

// ============================================================
// JavaWakeButton — manually spin up the free-tier Java backend before running
// any Java code. Pings GET /api/run-java (which proxies the executor's /health)
// so the ~30–60s cold start happens up-front, not mid-run. On success it marks
// the runtime warm so the next Run skips the "Waking Java runtime…" modal.
// ============================================================

type Status = "idle" | "waking" | "ready" | "error";

export function JavaWakeButton({ className = "" }: { className?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");

  const wake = useCallback(async () => {
    if (status === "waking") return;
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

  if (status === "ready") {
    return (
      <button
        type="button"
        onClick={wake}
        title="Java backend is awake. Click to ping again."
        className={`${base} border-green-500/40 bg-green-500/10 text-green-400 hover:bg-green-500/15 ${className}`}
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
