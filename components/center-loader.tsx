"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Loader2 } from "lucide-react";

// Full-screen modal loader overlay. Shared by the main page, the dashboard,
// the kanban board and the playground (Pyodide / SQL cold start).
//
// Rendered through a portal to <body> so it's always a true viewport overlay:
// when mounted deep inside the layout tree, a `fixed` element can otherwise be
// trapped by an ancestor's containing block (transform / filter / overflow),
// which shrinks and mis-centers the card. The portal sidesteps that entirely.
export function CenterLoader({
  label = "Loading your progress…",
}: {
  label?: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const overlay = (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 backdrop-blur-sm animate-fade-in p-4"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-black/5 bg-white px-10 py-8 shadow-2xl ring-1 ring-black/10 w-[min(320px,calc(100vw-2rem))]">
        <Loader2 size={38} className="animate-spin text-[#7C8CF8]" />
        <div className="text-[14px] font-medium text-[#1f2937] text-center">
          {label}
        </div>
      </div>
    </div>
  );

  // Before mount (SSR / first paint) render inline as a safe fallback; once
  // mounted, portal to <body> so it escapes any transformed ancestor.
  if (!mounted) return overlay;
  return createPortal(overlay, document.body);
}
