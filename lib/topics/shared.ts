// ============================================================
// Shared types & SVG helpers for AWS SAA-C03 learning content.
//
// This is the single source of truth for the Topic data model and the
// shared inline-SVG fragments. `lib/topics.ts` re-exports these types so
// `@/lib/topics` keeps the exact same public surface (backward compatible),
// and every per-section module under `lib/topics/*.ts` imports from here.
// Keeping the definitions here (and importing them into topics.ts, never the
// other way around) guarantees there is no import cycle.
// ============================================================

export type Question = {
  q: string;
  options: [string, string, string, string];
  answer: "A" | "B" | "C" | "D";
  explanation: string;
};

export type CodeExample = {
  language: string;
  title: string;
  code: string;
  /** optional tab label when multiple examples appear together */
  tab?: string;
  /**
   * SQL-only: schema/seed DDL (CREATE TABLE + INSERT) run in a fresh in-memory
   * database immediately before `code`. Lets several query tabs in one topic
   * share the same tables without repeating the DDL inside every tab's visible
   * `code`. Ignored by non-SQL runtimes.
   */
  setup?: string;
};

/** A structured Beginner-tab subtopic — heading + bullet list */
export type Subtopic = {
  heading: string;
  bullets: { icon: string; text: string }[]; // icon = emoji or short word, text supports **bold**
};

/** A small fact card shown in the Beginner tab grid */
export type KeyFact = {
  label: string;
  value: string;
  /** optional emoji or lucide-react icon name */
  icon?: string;
};

/** A legend item that explains one component shown in the architecture SVG */
export type DiagramLegendItem = {
  color: string;
  label: string;
  description: string;
};

/** Side panel content on the Beginner tab — the "Quick Reference" card */
export type QuickReference = {
  title: string;
  icon?: string; // emoji or lucide name
  bullets: string[]; // supports **bold**
  analogyBrief?: string;
};

export type Domain =
  | "Identity"
  | "Compute"
  | "Storage"
  | "Networking"
  | "Security"
  | "Monitoring"
  | "Foundations"
  // ---- Added for course pages 118–414 (new content areas) ----
  | "Database"
  | "Integration"
  // ---- Added for multi-course support (Frontend / Backend / AI / System Design) ----
  | "Frontend"
  | "Backend"
  | "AI"
  | "SystemDesign";

export type Topic = {
  id: string;
  title: string;
  shortLabel: string;
  section: string;
  domain: Domain;
  /** Long-form explanation. Used as a fallback when `tldr` / `subtopics` aren't provided. */
  explanation: string;
  analogy: string;
  diagram: string; // inline SVG
  codeExample: CodeExample;
  problemStatement: string;
  questions: Question[];

  // ---- Optional structured fields (Beginner tab can use these
  //      instead of the long prose `explanation` for a cleaner render). ----
  /** 1–3 sentence summary shown in the orange callout at the top of Beginner. */
  tldr?: string;
  /** Structured subtopic blocks, each with a heading and 3–6 bullets. */
  subtopics?: Subtopic[];
  /** Small fact cards rendered in a 2-column grid at the bottom of Beginner. */
  keyFacts?: KeyFact[];
  /** Side card content rendered in the 35% column of Beginner. */
  quickReference?: QuickReference;
  /** Multiple code examples (CLI / JSON / Python …) — rendered as inner tabs. */
  codeExamples?: CodeExample[];
  /** Legend rows shown below the architecture SVG. */
  diagramLegend?: DiagramLegendItem[];
};

export type SectionInfo = {
  id: string;
  title: string;
  topicIds: string[];
};

/**
 * A top-level course that groups a set of sections. Courses are the highest
 * level of the content hierarchy: Course → Section → Topic. Progress stays
 * keyed by globally-unique `topicId`, so adding courses requires no backend
 * schema change.
 */
export type CourseInfo = {
  id: string; // "aws" | "frontend" | ...  (selection + persistence key)
  title: string;
  icon: string; // lucide-react icon NAME (string) or emoji; resolved in the UI
  description?: string;
  sectionIds: string[]; // ordered list of SectionInfo.id values owned by this course
};

// ============================================================
// SVG DIAGRAM HELPERS — shared style fragments
// (identical to the fragment historically defined in lib/topics.ts so
//  existing diagrams that interpolate `${svgDefs}` render unchanged).
// ============================================================
export const svgDefs = `
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="#ff9900"/>
    </marker>
    <marker id="arrow-mute" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="#8b949e"/>
    </marker>
  </defs>
`;
