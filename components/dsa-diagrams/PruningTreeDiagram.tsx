"use client";

import { useMemo, useState } from "react";
import { DiagramViewport } from "./DiagramViewport";

// ============================================================
// PruningTreeDiagram — the Combination Sum search tree. From each node you
// pick a candidate ≥ the current index (reuse allowed) and subtract it from
// the remaining target. A branch is PRUNED the moment remaining < 0, and a
// node is a SOLUTION when remaining hits exactly 0. Defaults to
// candidates [2,3,6,7], target 7 → solutions {2,2,3} and {7}.
// ============================================================

type CSNode = {
  id: number;
  depth: number;
  path: number[];
  remaining: number;
  state: "continue" | "solution" | "pruned";
  x: number;
  y: number;
  parent: number | null;
};

// Layout constants — slot width ≥ node width + gap guarantees no overlap.
const NODE_W = 88;
const NODE_H = 32;
const SLOT_W = 116; // NODE_W + horizontal gap
const TOP = 40;
const LEVEL_H = 92;

function buildTree(candidates: number[], target: number) {
  const nodes: CSNode[] = [];
  let idc = 0;

  function rec(
    start: number,
    path: number[],
    remaining: number,
    depth: number,
    parent: number | null
  ): CSNode {
    const id = idc++;
    let state: CSNode["state"] = "continue";
    if (remaining === 0) state = "solution";
    else if (remaining < 0) state = "pruned";
    const node: CSNode = {
      id,
      depth,
      path,
      remaining,
      state,
      x: 0,
      y: 0,
      parent,
    };
    nodes.push(node);
    if (state === "continue") {
      for (let i = start; i < candidates.length; i++) {
        rec(i, [...path, candidates[i]], remaining - candidates[i], depth + 1, id);
      }
    }
    return node;
  }
  rec(0, [], target, 0, null);

  // Tidy layout: leaf-slot x assignment, depth-based y.
  const childrenOf: Record<number, CSNode[]> = {};
  nodes.forEach((n) => {
    if (n.parent !== null) (childrenOf[n.parent] ||= []).push(n);
  });
  let leaf = 0;
  function place(n: CSNode) {
    const kids = childrenOf[n.id] ?? [];
    if (kids.length === 0) {
      n.x = leaf++;
    } else {
      kids.forEach(place);
      n.x = (kids[0].x + kids[kids.length - 1].x) / 2;
    }
    n.y = TOP + n.depth * LEVEL_H;
  }
  place(nodes[0]);
  const totalLeaves = Math.max(1, leaf);
  // Width sized from the leaf count so bottom-row boxes never overlap.
  const width = totalLeaves * SLOT_W;
  nodes.forEach((n) => {
    n.x = (n.x + 0.5) * SLOT_W;
  });
  const height = TOP + (Math.max(...nodes.map((n) => n.depth)) + 1) * LEVEL_H;
  return { nodes, width, height };
}

const STATE_STROKE: Record<CSNode["state"], string> = {
  continue: "#2FD9C4",
  solution: "#B79CFB",
  pruned: "#F0596B",
};

export function PruningTreeDiagram({
  candidates = [2, 3, 6, 7],
  target = 7,
}: {
  candidates?: number[];
  target?: number;
}) {
  const { nodes, width, height } = useMemo(
    () => buildTree(candidates, target),
    [candidates, target]
  );
  const byId = useMemo(() => {
    const m: Record<number, CSNode> = {};
    nodes.forEach((n) => (m[n.id] = n));
    return m;
  }, [nodes]);
  const [active, setActive] = useState<number | null>(null);
  const activeNode = active !== null ? byId[active] : null;

  const legend = (
    <div className="flex flex-wrap gap-4 text-[12px] text-text-secondary">
      <span className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-sm bg-success inline-block" /> safe —
        recursion continues
      </span>
      <span className="flex items-center gap-1.5">
        <span
          className="w-2.5 h-2.5 rounded-sm inline-block"
          style={{ background: "#B79CFB" }}
        />{" "}
        solution (remaining = 0)
      </span>
      <span className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-sm bg-danger inline-block" /> pruned
        (remaining &lt; 0)
      </span>
    </div>
  );

  const caption = (
    <p className="text-[13px] text-text-secondary min-h-[1.4em]">
      {activeNode ? (
        activeNode.state === "pruned" ? (
          <>
            <b className="text-text-primary">Pruned.</b> Picking the last
            candidate drove the remaining target to{" "}
            <b className="text-text-primary">{activeNode.remaining}</b> (&lt; 0) —
            the branch is abandoned before recursing further.
          </>
        ) : activeNode.state === "solution" ? (
          <>
            <b className="text-text-primary">Solution.</b>{" "}
            {`[${activeNode.path.join(",")}]`} sums to exactly the target —
            recorded.
          </>
        ) : (
          <>
            <b className="text-text-primary">Exploring.</b> Running combo{" "}
            {activeNode.path.length ? `[${activeNode.path.join(",")}]` : "[ ]"},{" "}
            <b className="text-text-primary">{activeNode.remaining}</b> left to
            reach.
          </>
        )
      ) : (
        <>
          Drag to pan, scroll to zoom, or maximize. Candidates{" "}
          {`{${candidates.join(",")}}`}, target{" "}
          <b className="text-text-primary">{target}</b>. Click any node — red
          branches are pruned the instant the remaining target goes negative.
        </>
      )}
    </p>
  );

  return (
    <DiagramViewport
      title="Combination Sum — pruning tree"
      legend={legend}
      caption={caption}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {nodes.map((n) => {
          if (n.parent === null) return null;
          const p = byId[n.parent];
          const midY = (p.y + n.y) / 2;
          const pruned = n.state === "pruned";
          return (
            <path
              key={`e-${n.id}`}
              d={`M ${p.x} ${p.y + NODE_H / 2} C ${p.x} ${midY} ${n.x} ${midY} ${n.x} ${n.y - NODE_H / 2}`}
              fill="none"
              stroke={pruned ? "#F0596B" : "#2FD9C4"}
              strokeWidth={1.6}
              strokeDasharray={pruned ? "3 3" : undefined}
              opacity={pruned ? 0.45 : 0.6}
            />
          );
        })}

        {nodes.map((n) => {
          const on = active === n.id;
          const stroke = STATE_STROKE[n.state];
          const label = n.path.length === 0 ? "[ ]" : `[${n.path.join(",")}]`;
          return (
            <g
              key={n.id}
              transform={`translate(${n.x},${n.y})`}
              style={{ cursor: "pointer" }}
              onClick={() => setActive(n.id)}
            >
              <rect
                x={-NODE_W / 2}
                y={-NODE_H / 2}
                width={NODE_W}
                height={NODE_H}
                rx={8}
                fill={on ? "rgba(124,140,248,0.16)" : "#151D29"}
                stroke={stroke}
                strokeWidth={on ? 2.6 : 1.5}
              />
              <text
                textAnchor="middle"
                dy="-1"
                fontFamily="ui-monospace, monospace"
                fontSize="10.5"
                fill="#E9EEF4"
              >
                {label}
              </text>
              <text
                textAnchor="middle"
                dy="11"
                fontFamily="ui-monospace, monospace"
                fontSize="9"
                fill="#94A2B5"
              >
                rem {n.remaining}
              </text>
              {n.state === "pruned" && (
                <text
                  textAnchor="middle"
                  dy="26"
                  fontFamily="ui-monospace, monospace"
                  fontSize="8.5"
                  fill="#F0596B"
                >
                  ✕ prune
                </text>
              )}
              {n.state === "solution" && (
                <text
                  textAnchor="middle"
                  dy="26"
                  fontFamily="ui-monospace, monospace"
                  fontSize="8.5"
                  fill="#B79CFB"
                >
                  ✓ found
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </DiagramViewport>
  );
}
