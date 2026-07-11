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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm animate-fade-in p-4"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-3 rounded-xl border border-[#e5e7eb] bg-white px-8 py-6 shadow-2xl ring-1 ring-black/10 max-w-[calc(100vw-2rem)]">
        <Loader2 size={34} className="animate-spin text-[#7C8CF8]" />
        <div className="text-[13px] font-medium text-[#1f2937] text-center">
          {label}
        </div>
      </div>
    </div>
  );
}
