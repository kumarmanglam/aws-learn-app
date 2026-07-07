"use client";

import { Loader2 } from "lucide-react";

// Full-screen modal loader overlay. Shared by the main page, the dashboard
// and the playground (Pyodide cold start).
export function CenterLoader({
  label = "Loading your progress…",
}: {
  label?: string;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-bg-base/70 backdrop-blur-sm animate-fade-in"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-bg-panel/95 px-8 py-6 shadow-2xl">
        <Loader2 size={34} className="animate-spin text-accent" />
        <div className="text-[13px] text-text-secondary">{label}</div>
      </div>
    </div>
  );
}
