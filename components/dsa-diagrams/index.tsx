"use client";

import type { ComponentType } from "react";
import { BacktrackingLoopDiagram } from "./BacktrackingLoopDiagram";
import { RecursionTreeDiagram } from "./RecursionTreeDiagram";
import { PruningTreeDiagram } from "./PruningTreeDiagram";

// Registry: Topic.diagramComponent string → interactive React diagram.
// Keep keys in sync with the values set in lib/topics/dsa-*.ts.
export const DSA_DIAGRAMS: Record<string, ComponentType> = {
  "backtracking-loop": BacktrackingLoopDiagram,
  "subsets-tree": RecursionTreeDiagram,
  "combination-sum-tree": PruningTreeDiagram,
};

export function hasDsaDiagram(name: string | undefined): name is string {
  return !!name && name in DSA_DIAGRAMS;
}

/** Renders the interactive diagram for a registry key. */
export function DsaDiagram({ name }: { name: string }) {
  const Cmp = DSA_DIAGRAMS[name];
  if (!Cmp) return null;
  return <Cmp />;
}
