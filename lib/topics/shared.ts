// ============================================================================
// MCQ AUTHORING STANDARD — READ BEFORE WRITING OR EDITING ANY QUESTION
// Applies to every `questions: [...]` MCQ in this course-content file. It exists
// because our first question bank became guessable by PATTERN instead of
// understanding; the goal is to fix that WITHOUT creating a new pattern.
// (See also the top of context.txt.)
// ============================================================================
//
// WHAT WENT WRONG (measured across the whole bank):
//   • ORDER TELL  — the correct answer was "B" in ~76% of questions (A/C rare,
//     D almost never). Always-pick-B scored high without reading the question.
//   • LENGTH TELL — the correct answer was the LONGEST option in ~77%: the
//     answer was over-explained while distractors were short. Always-pick-the-
//     longest was a second free pass.
//   CRITICAL: the fix must NOT simply mirror these — making the answer always
//   the SHORTEST, or always "C", is the SAME bug in disguise. The correct
//   answer must be genuinely RANDOM in both position and length.
//
// -- 1. KILL THE POSITION & LENGTH TELLS -------------------------------------
//   1a. Randomise the correct LETTER — spread A/B/C/D ~evenly per topic; no
//       default letter. Adding several at once? rotate deliberately (e.g.
//       C, A, D, B, A, …) and check the spread.
//   1b. Decorrelate LENGTH — the correct answer must be neither reliably the
//       longest NOR the shortest. Keep all four options in a similar length
//       band so length reveals nothing; let the answer's length-rank vary
//       randomly across questions.
//   1c. NEVER TRIM the correct answer just to shrink it (that drops meaning or
//       misleads). If it reads short, add ACCURATE detail; if a distractor is
//       bloated, tighten the distractor. Adjust the wrong options, never the
//       right one's substance.
//   1d. Pin "All/None of the above" to the LAST slot — and don't let it be the
//       correct answer more than ~1-in-N times, or that slot becomes the tell.
//   1e. Vary the order of REUSED option sets — if several questions reuse the
//       same services/concepts, shuffle their order between questions.
//
// -- 2. WRITE SMART, HONEST DISTRACTORS --------------------------------------
//   2a. Same TYPE as the answer — all real services / all valid-looking configs
//       / all the same kind of thing. No joke, impossible, or unrelated options.
//   2b. Represent real MISCONCEPTIONS — the mistakes actual learners make, not
//       trivial filler.
//   2c. Exactly ONE defensible answer — an expert can eliminate the other three
//       on facts alone. No near-ties where two options are both arguably right.
//   2d. Two options MAY be deliberately close so the reader must know the
//       precise distinction — that is discrimination, NOT trickery (see 4b).
//
// -- 3. REMOVE HIDDEN CLUES --------------------------------------------------
//   3a. No KEYWORD ECHO — the answer must not reuse a distinctive word/phrase
//       from the stem that the distractors lack. Stem⇄answer vocab overlap is
//       as strong a tell as length.
//   3b. GRAMMAR must fit the stem for EVERY option (a/an, singular/plural,
//       tense). A grammatically-off distractor gives itself away.
//   3c. ABSOLUTE qualifiers (always/never/only/all/must) must not cluster in the
//       wrong options while the answer stays hedged (can/may/typically). Use
//       absolutes only when factually required, and balance them across options.
//
// -- 4. QUESTION DESIGN ------------------------------------------------------
//   4a. Test UNDERSTANDING, not keyword recall — prefer scenarios, configs, and
//       trade-offs that ask WHY over "define X".
//   4b. Difficulty comes from CONCEPTS / reasoning, not confusing wording or
//       extra reading. No trick questions, obscure exceptions, or technicalities.
//   4c. Prefer POSITIVE wording. If a "NOT / EXCEPT" stem is genuinely needed,
//       CAPITALISE the negation so it isn't skimmed as a positive stem.
//   4d. Consistent option STYLE within a question (all service names, or all
//       one-line configs, …) — don't mix a service, a feature, and a sentence.
//   4e. Don't make the SAME service/concept the correct answer repeatedly within
//       a topic; spread coverage across the syllabus.
//   4f. Match the stated difficulty:
//         easy   = basic recall / direct understanding
//         medium = apply knowledge or compare services
//         hard   = reasoning, architecture choices, subtle distinctions
//
// -- 5. EXPLANATIONS ---------------------------------------------------------
//   5a. TEACH: say why the answer is right, why the others are wrong (briefly),
//       and the underlying concept — useful even to someone who answered wrong.
//   5b. Reference option CONTENT, never letters ("B is correct…"), so option
//       order can change later without breaking the text.
//   5c. VARY the wording — don't begin every explanation the same way.
//   5d. Verify against SOURCE (AWS docs / official exam guide). A pattern-proof
//       question with a subtly wrong answer just teaches misinformation.
//
// -- 6. CHECK BEFORE COMMIT (script it — this is a data file) ----------------
//   Compute and review, per topic AND whole file:
//     [ ] correct-letter distribution ~even across A/B/C/D (no "B" pile-up)
//     [ ] correct-answer length-rank spread (not always longest OR shortest)
//     [ ] flag any option sharing 3+ words verbatim with its stem (keyword echo)
//   Manual pass:
//     [ ] exactly one unambiguously correct answer
//     [ ] distractors are plausible, same-type, and real misconceptions
//     [ ] no grammar / absolute-word / keyword clues; negations are capitalised
//     [ ] explanations teach the concept and name no option letters
//     [ ] the question stays fair even if the option order is shuffled
// ============================================================================

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

/**
 * A small, code-based practice drill shown under a DSA problem (5 per topic).
 * The learner types + runs a short solution and it's auto-checked by comparing
 * normalized stdout to `expectedOutput`. Language-agnostic (Java runs on the
 * backend service; JS/Python in-browser) — distinct from the SQL-only
 * `TryItQuestion`, which grades by comparing result sets. These sit ALONGSIDE
 * the topic's MCQ `questions`, not replacing them.
 */
export type CodeDrill = {
  /** Stable, globally-unique id (e.g. "rb-subsets-d1") — the tracking key. */
  id: string;
  /** The small problem to solve (supports **bold**). */
  prompt: string;
  difficulty: "easy" | "medium" | "hard";
  /** Runtime language: "java" | "javascript" | "python". */
  language: string;
  /** Pre-filled, editable starter code. */
  starter: string;
  /** Reference stdout; the learner's normalized output is compared to this. */
  expectedOutput: string;
  /** Optional nudge shown behind a "Hint" toggle. */
  hint?: string;
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
  /** Small code-based drills (5 per DSA problem) — type, run, auto-checked
   *  against expected stdout. Shown alongside the MCQ quiz. */
  codeDrills?: CodeDrill[];

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
