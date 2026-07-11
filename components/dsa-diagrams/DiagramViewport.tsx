"use client";

import { type ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  TransformWrapper,
  TransformComponent,
  type ReactZoomPanPinchContentRef,
} from "react-zoom-pan-pinch";
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, X } from "lucide-react";

// ============================================================
// DiagramViewport — pan / zoom / maximize shell for DSA diagrams.
//
// Wraps an SVG canvas (rendered at natural pixel size) with react-zoom-pan-
// pinch: drag to pan, wheel/pinch or the +/- buttons to zoom, Reset to
// recenter, and Maximize to open the same canvas full-screen via a portal.
// The canvas is rendered in exactly one place at a time (inline OR modal) so
// its interactive state (click-to-trace) is preserved when toggling.
// ============================================================

const BTN =
  "p-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors";

function Toolbar({
  utils,
  maximized,
  onToggleMax,
}: {
  utils: ReactZoomPanPinchContentRef;
  maximized: boolean;
  onToggleMax: () => void;
}) {
  return (
    <div className="absolute top-2 right-2 z-10 flex items-center gap-0.5 rounded-lg border border-border bg-bg-panel/90 backdrop-blur px-1 py-1 shadow-lg">
      <button
        type="button"
        className={BTN}
        title="Zoom out"
        onClick={() => utils.zoomOut()}
      >
        <ZoomOut size={16} />
      </button>
      <button
        type="button"
        className={BTN}
        title="Zoom in"
        onClick={() => utils.zoomIn()}
      >
        <ZoomIn size={16} />
      </button>
      <button
        type="button"
        className={BTN}
        title="Reset view"
        onClick={() => utils.resetTransform()}
      >
        <RotateCcw size={15} />
      </button>
      <div className="w-px h-5 bg-border mx-0.5" />
      <button
        type="button"
        className={BTN}
        title={maximized ? "Close full screen (Esc)" : "Maximize"}
        onClick={onToggleMax}
      >
        {maximized ? <X size={16} /> : <Maximize2 size={15} />}
      </button>
    </div>
  );
}

function Canvas({
  children,
  maximized,
  onToggleMax,
}: {
  children: ReactNode;
  maximized: boolean;
  onToggleMax: () => void;
}) {
  return (
    <TransformWrapper
      minScale={0.3}
      maxScale={5}
      initialScale={1}
      centerOnInit
      limitToBounds={false}
      wheel={{ step: 0.12 }}
      doubleClick={{ step: 0.7 }}
      panning={{ velocityDisabled: true }}
    >
      {(utils) => (
        <>
          <Toolbar utils={utils} maximized={maximized} onToggleMax={onToggleMax} />
          <TransformComponent
            wrapperStyle={{ width: "100%", height: "100%", cursor: "grab" }}
            contentStyle={{ width: "100%", height: "100%" }}
          >
            {children}
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  );
}

export function DiagramViewport({
  children,
  title = "Diagram",
  legend,
  caption,
  height = 440,
}: {
  /** the <svg> canvas at natural pixel size */
  children: ReactNode;
  title?: string;
  legend?: ReactNode;
  caption?: ReactNode;
  /** inline (non-maximized) viewport height in px */
  height?: number;
}) {
  const [maximized, setMaximized] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Esc closes the full-screen modal; lock body scroll while open.
  useEffect(() => {
    if (!maximized) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMaximized(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [maximized]);

  const inline = (
    <div className="space-y-3">
      {legend}
      <div
        className="relative rounded-md bg-bg-base/50 border border-border overflow-hidden"
        style={{ height }}
      >
        {!mounted ? (
          // SSR / pre-hydration fallback: plain scrollable canvas.
          <div className="w-full h-full overflow-auto p-2">{children}</div>
        ) : maximized ? (
          <div className="w-full h-full flex items-center justify-center text-[13px] text-text-muted">
            Opened in full screen — press Esc or ✕ to return.
          </div>
        ) : (
          <Canvas maximized={false} onToggleMax={() => setMaximized(true)}>
            {children}
          </Canvas>
        )}
      </div>
      {caption}
    </div>
  );

  const modal =
    mounted && maximized
      ? createPortal(
          <div className="fixed inset-0 z-[3000] bg-bg-base flex flex-col animate-fade-in">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
              <span className="text-[13px] font-mono text-text-secondary">
                {title}
              </span>
              <button
                type="button"
                onClick={() => setMaximized(false)}
                className="inline-flex items-center gap-1.5 text-[12.5px] px-2.5 py-1 rounded-md border border-border text-text-secondary hover:text-text-primary hover:bg-bg-hover"
              >
                <X size={14} /> Close
              </button>
            </div>
            {legend && (
              <div className="px-4 py-2 border-b border-border shrink-0">
                {legend}
              </div>
            )}
            <div className="relative flex-1 min-h-0">
              <Canvas maximized onToggleMax={() => setMaximized(false)}>
                {children}
              </Canvas>
            </div>
            {caption && (
              <div className="px-4 py-3 border-t border-border shrink-0">
                {caption}
              </div>
            )}
          </div>,
          document.body
        )
      : null;

  return (
    <>
      {inline}
      {modal}
    </>
  );
}
