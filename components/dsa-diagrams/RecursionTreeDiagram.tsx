"use client";

import { useMemo, useState } from "react";

// ============================================================
// RecursionTreeDiagram — the Subsets decision tree. Every node is a recorded
// subset; click a node to trace the choices that built it. Defaults to
// {1,2,3} (2³ = 8 nodes).
// ============================================================

type TreeNode = {
  id: number;
  level: number;
  label: string;
  picked: number | null;
};
type TreeEdge = { from: number; to: number; label: number };

function buildSubsetsTree(elements: number[]) {
  const nodes: TreeNode[] = [];
  const edges: TreeEdge[] = [];
  let idc = 0;
  function rec(startIdx: number, path: number[], parentId: number | null) {
    const id = idc++;
    const picked = path.length ? path[path.length - 1] : null;
    nodes.push({
      id,
      level: path.length,
      label: path.length ? `{${path.join(",")}}` : "{ }",
      picked,
    });
    if (parentId !== null && picked !== null)
      edges.push({ from: parentId, to: id, label: picked });
    for (let i = startIdx; i < elements.length; i++) {
      rec(i + 1, [...path, elements[i]], id);
    }
  }
  rec(0, [], null);
  return { nodes, edges };
}

export function RecursionTreeDiagram({
  elements = [1, 2, 3],
}: {
  elements?: number[];
}) {
  const { nodes, edges, pos, parentOf } = useMemo(() => {
    const { nodes, edges } = buildSubsetsTree(elements);
    const width = 900;
    const top = 44;
    const levelHeight = 108;
    const byLevel: Record<number, TreeNode[]> = {};
    nodes.forEach((n) => {
      (byLevel[n.level] = byLevel[n.level] || []).push(n);
    });
    const pos: Record<number, { x: number; y: number }> = {};
    Object.keys(byLevel).forEach((lvl) => {
      const arr = byLevel[+lvl];
      arr.forEach((n, i) => {
        pos[n.id] = {
          x: (i + 0.5) * (width / arr.length),
          y: top + +lvl * levelHeight,
        };
      });
    });
    const parentOf: Record<number, number> = {};
    edges.forEach((e) => (parentOf[e.to] = e.from));
    return { nodes, edges, pos, parentOf };
  }, [elements]);

  const [active, setActive] = useState<number | null>(null);

  const { pathIds, edgeIds } = useMemo(() => {
    const pathIds = new Set<number>();
    const edgeIds = new Set<string>();
    if (active !== null) {
      let cur = active;
      pathIds.add(cur);
      while (parentOf[cur] !== undefined) {
        edgeIds.add(`${parentOf[cur]}->${cur}`);
        cur = parentOf[cur];
        pathIds.add(cur);
      }
    }
    return { pathIds, edgeIds };
  }, [active, parentOf]);

  const activeNode = active !== null ? nodes.find((n) => n.id === active) : null;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-4 text-[12px] text-text-secondary">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-success inline-block" /> edge
          = choose this element
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-sm inline-block"
            style={{ background: "#B79CFB" }}
          />{" "}
          every node = a recorded subset
        </span>
      </div>

      <div className="overflow-x-auto rounded-md bg-bg-base/50 border border-border p-2">
        <svg
          viewBox="0 0 900 390"
          className="block w-full min-w-[640px]"
          xmlns="http://www.w3.org/2000/svg"
        >
          {edges.map((e) => {
            const p1 = pos[e.from];
            const p2 = pos[e.to];
            const midY = (p1.y + p2.y) / 2;
            const on = edgeIds.has(`${e.from}->${e.to}`);
            return (
              <g key={`${e.from}-${e.to}`}>
                <path
                  d={`M ${p1.x} ${p1.y + 15} C ${p1.x} ${midY} ${p2.x} ${midY} ${p2.x} ${p2.y - 15}`}
                  fill="none"
                  stroke="#2FD9C4"
                  strokeWidth={on ? 2.4 : 1.6}
                  opacity={on ? 1 : 0.5}
                />
                <text
                  x={(p1.x + p2.x) / 2 + 10}
                  y={midY}
                  textAnchor="middle"
                  fontFamily="ui-monospace, monospace"
                  fontSize="10"
                  fill="#2FD9C4"
                >
                  {e.label}
                </text>
              </g>
            );
          })}

          {nodes.map((n) => {
            const p = pos[n.id];
            const on = pathIds.has(n.id);
            return (
              <g
                key={n.id}
                transform={`translate(${p.x},${p.y})`}
                className="cursor-pointer"
                onClick={() => setActive(n.id)}
              >
                <rect
                  x={-38}
                  y={-15}
                  width={76}
                  height={30}
                  rx={15}
                  fill={on ? "rgba(183,156,251,0.16)" : "#151D29"}
                  stroke="#B79CFB"
                  strokeWidth={on ? 2.6 : 1.4}
                />
                <text
                  textAnchor="middle"
                  dy="0.32em"
                  fontFamily="ui-monospace, monospace"
                  fontSize="11"
                  fill="#E9EEF4"
                >
                  {n.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <p className="text-[13px] text-text-secondary min-h-[1.4em]">
        {activeNode ? (
          <>
            Path so far: <b className="text-text-primary">{activeNode.label}</b>
            {activeNode.level === 0
              ? " — the empty subset, recorded before any choice is made."
              : "."}
          </>
        ) : (
          <>
            Click any node to trace the choices that built it.{" "}
            <b className="text-text-primary">{nodes.length}</b> nodes total —
            that&apos;s 2<sup>{elements.length}</sup>, one for every subset of{" "}
            {`{${elements.join(",")}}`}.
          </>
        )}
      </p>
    </div>
  );
}
