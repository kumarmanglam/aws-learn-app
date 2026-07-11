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
  /** Difficulty tier — used for a small badge; author questions easy→medium. */
  difficulty?: "easy" | "medium" | "hard";
};

/**
 * A hands-on "Try it" exercise (SQL courses). Each renders as its own editable
 * code area with its own Run button and per-question progress tracking. The
 * learner's query runs in-browser (sql.js); correctness is judged by comparing
 * its result set to the reference `solution` query's result — never by text.
 */
export type TryItQuestion = {
  /** Stable, globally-unique id (e.g. "sql-vs-excel-t1") — the tracking key. */
  id: string;
  /** The business question to solve. */
  prompt: string;
  difficulty: "easy" | "medium" | "hard";
  /** Optional nudge shown behind a "Hint" toggle. */
  hint?: string;
  /** Schema + seed DDL run in a fresh DB before the learner's query. */
  setup: string;
  /** Pre-filled, editable starter SQL. */
  starter: string;
  /** Reference query whose result set defines the correct answer. */
  solution: string;
  /** Compare rows in order (default false → compared as an unordered multiset). */
  orderMatters?: boolean;
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
  /** Reference stdout shown instead of a Run button for non-runnable
   *  languages (e.g. Java). JS/Python execute in-browser and ignore this. */
  expectedOutput?: string;
};

/** Big-O labels for a DSA solution approach. */
export type Complexity = { time: string; space: string };

/**
 * One solution to a DSA problem at a given optimization level. A problem
 * Topic exposes several of these (Brute Force → Intermediate → Optimal) via
 * `Topic.approaches`; each carries the same idea in multiple languages.
 */
export type SolutionApproach = {
  name: string; // "Brute Force" | "Better" | "Optimal" | variant name
  /** drives the badge color in the approach explorer */
  kind?: "brute-force" | "intermediate" | "optimal" | "variant";
  idea: string; // supports **bold** (rendered via renderBold)
  complexity: Complexity;
  /** short notes on related variants (e.g. "Subsets II — sort + skip dupes") */
  variants?: string[];
  /** one entry per language (Java / JavaScript / Python) */
  code: CodeExample[];
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
  | "SystemDesign"
  // ---- Added for the DSA Prep course (coding-interview patterns) ----
  | "DSA";

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
  /** Hands-on practice exercises rendered under the Code tab (SQL courses). */
  tryIt?: TryItQuestion[];

  // ---- Optional DSA fields (only set by the DSA Prep course) ----
  /** Pattern pill in the topic header, e.g. "Backtracking". */
  pattern?: string;
  /** Difficulty pill in the topic header. */
  difficulty?: "Easy" | "Medium" | "Hard";
  /** Brute → Intermediate → Optimal solutions. When present, the Code tab
   *  renders the multi-approach explorer instead of a single example. */
  approaches?: SolutionApproach[];
  /** Key into the interactive diagram registry (components/dsa-diagrams).
   *  When set and known, overrides the inline `diagram` SVG string. */
  diagramComponent?: string;
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
