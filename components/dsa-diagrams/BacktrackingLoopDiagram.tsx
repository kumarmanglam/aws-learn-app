"use client";

// ============================================================
// BacktrackingLoopDiagram — the choose → explore → un-choose cycle that
// every backtracking solution is built from. Static, theme-aware SVG.
// ============================================================
export function BacktrackingLoopDiagram() {
  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-md bg-bg-base/50 border border-border p-2">
        <svg
          viewBox="0 0 480 300"
          className="block w-full min-w-[420px]"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="The choose, explore, un-choose loop"
        >
          <defs>
            <marker
              id="btl-arrow-choose"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="4"
              orient="auto"
            >
              <path d="M0,0 L8,4 L0,8 Z" fill="#2FD9C4" />
            </marker>
            <marker
              id="btl-arrow-prune"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="4"
              orient="auto"
            >
              <path d="M0,0 L8,4 L0,8 Z" fill="#F0596B" />
            </marker>
            <marker
              id="btl-arrow-back"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="4"
              orient="auto"
            >
              <path d="M0,0 L8,4 L0,8 Z" fill="#F5A93F" />
            </marker>
          </defs>

          {/* CHOOSE -> EXPLORE */}
          <path
            className="dsa-dashflow"
            d="M186,68 L296,68"
            stroke="#2FD9C4"
            strokeWidth="2"
            markerEnd="url(#btl-arrow-choose)"
          />
          <text
            x="240"
            y="58"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize="10.5"
            fill="#2FD9C4"
          >
            choose
          </text>

          {/* EXPLORE -> BACKTRACK */}
          <path
            className="dsa-dashflow"
            d="M360,96 C388,140 372,178 336,206"
            stroke="#F0596B"
            strokeWidth="2"
            fill="none"
            markerEnd="url(#btl-arrow-prune)"
          />
          <text
            x="404"
            y="150"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize="10.5"
            fill="#F0596B"
          >
            base case /
          </text>
          <text
            x="404"
            y="163"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize="10.5"
            fill="#F0596B"
          >
            dead end
          </text>

          {/* BACKTRACK -> CHOOSE */}
          <path
            className="dsa-dashflow"
            d="M180,206 C142,178 128,140 152,96"
            stroke="#F5A93F"
            strokeWidth="2"
            fill="none"
            markerEnd="url(#btl-arrow-back)"
          />
          <text
            x="86"
            y="150"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize="10.5"
            fill="#F5A93F"
          >
            undo &amp;
          </text>
          <text
            x="86"
            y="163"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize="10.5"
            fill="#F5A93F"
          >
            try next
          </text>

          {/* CHOOSE node */}
          <rect
            x="26"
            y="40"
            width="160"
            height="56"
            rx="14"
            fill="#151D29"
            stroke="#2FD9C4"
            strokeWidth="1.6"
          />
          <text
            x="106"
            y="64"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontWeight="700"
            fontSize="13"
            fill="#E9EEF4"
          >
            CHOOSE
          </text>
          <text
            x="106"
            y="80"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize="9.5"
            fill="#94A2B5"
          >
            pick next candidate
          </text>

          {/* EXPLORE node */}
          <rect
            x="294"
            y="40"
            width="160"
            height="56"
            rx="14"
            fill="#151D29"
            stroke="#2FD9C4"
            strokeWidth="1.6"
          />
          <text
            x="374"
            y="64"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontWeight="700"
            fontSize="13"
            fill="#E9EEF4"
          >
            EXPLORE
          </text>
          <text
            x="374"
            y="80"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize="9.5"
            fill="#94A2B5"
          >
            recurse one level deeper
          </text>

          {/* BACKTRACK node */}
          <rect
            x="160"
            y="206"
            width="160"
            height="56"
            rx="14"
            fill="#151D29"
            stroke="#F5A93F"
            strokeWidth="1.6"
          />
          <text
            x="240"
            y="230"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontWeight="700"
            fontSize="13"
            fill="#E9EEF4"
          >
            BACKTRACK
          </text>
          <text
            x="240"
            y="246"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize="9.5"
            fill="#94A2B5"
          >
            undo the last choice
          </text>
        </svg>
      </div>
      <p className="text-[13px] text-text-secondary">
        The one loop every backtracking solution is built from —{" "}
        <b className="text-text-primary">choose → explore → un-choose</b>. The
        base case records a solution; a dead end (constraint violated) prunes the
        branch early.
      </p>
    </div>
  );
}
