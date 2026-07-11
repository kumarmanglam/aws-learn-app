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
      className="center-loader-overlay"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="center-loader-card">
        <Loader2 size={40} className="center-loader-spinner" />

        <div className="center-loader-label">
          {label}
        </div>
      </div>

      <style jsx>{`
        .center-loader-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(12px);
          animation: fade-in 0.2s ease-out;
          padding: 1rem;
        }

        .center-loader-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          width: min(340px, calc(100vw - 2rem));
          border-radius: 1rem;
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 2rem 2.5rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
        }

        .center-loader-spinner {
          animation: spin 1s linear infinite;
          color: #7c8cf8;
        }

        .center-loader-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #1e293b;
          text-align: center;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );

  // Before mount (SSR / first paint) render inline as a safe fallback; once
  // mounted, portal to <body> so it escapes any transformed ancestor.
  if (!mounted) return overlay;
  return createPortal(overlay, document.body);
}