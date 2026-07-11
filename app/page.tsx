"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Circle,
  Trophy,
  Flame,
  BookOpen,
  Lightbulb,
  Network,
  Code2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  LogOut,
  Copy,
  Check,
  RotateCcw,
  Clock,
  X,
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  TrendingUp,
  Star,
  Layers,
  Cloud,
  Layout,
  Server,
  Boxes,
  Database,
  Brain,
  Menu,
  Loader2,
  Ban,
  Undo2,
  XSquare,
  Play,
  Terminal,
  LayoutDashboard,
  KanbanSquare,
  Timer,
  type LucideIcon,
} from "lucide-react";
import {
  topics,
  sections,
  courses,
  type Topic,
  type Question,
  type CodeExample,
  type TryItQuestion,
  type Subtopic,
} from "@/lib/topics";
import {
  runJavaScript,
  runPython,
  runSql,
  isPyodideReady,
  isSqlReady,
  runSqlChecked,
  type RunResult,
} from "@/lib/code-runner";
import {
  type TabKey,
  type QuizState,
  type TryItState,
  todayISO,
  computeStreak,
  formatElapsed,
  sectionProgressPct,
  topicScore,
  globalScore,
  xpFromQuiz,
  levelFromXp,
  nextLevelXp,
  domainStrengths,
  recommendedRevisions,
} from "@/lib/progress-metrics";
import { CenterLoader } from "@/components/center-loader";
import { DsaDiagram, hasDsaDiagram } from "@/components/dsa-diagrams";

// Resolve a CourseInfo.icon name to a lucide-react component (fallback: BookOpen).
const COURSE_ICONS: Record<string, LucideIcon> = {
  Cloud,
  Layout,
  Server,
  Sparkles,
  Network,
  Boxes,
  Database,
  Brain,
};

// ============================================================
// Sharded server sync (Firebase via /api/progress)
// TabKey / QuizState + the pure metric helpers now live in
// lib/progress-metrics (shared with the dashboard).
// ============================================================
type AppState = {
  visited: Record<string, boolean>;
  quiz: QuizState;
  loginDates: string[];
  expanded: Record<string, boolean>;
  selectedCourseId: string;
  selectedTopicId: string;
  leftCollapsed: boolean;
  rightCollapsed: boolean;
  tabOrder: TabKey[];
  openTabs: TabKey[];
  collapsedPanels: TabKey[];
  topicTime: Record<string, number>; // accumulated ms per topic
  topicDone: Record<string, boolean>;
  lastReviewed: Record<string, string>; // topicId -> last-opened ISO date (spaced repetition)
  tabsDone: Record<string, Partial<Record<TabKey, boolean>>>;
  tryIt: TryItState; // topicId -> questionId -> { attempted, solved }
};

type SectionKey = "profile" | "progress" | "quiz" | "tryit" | "ui";

type SessionUser = { username: string; displayName: string };

const DEFAULT_TAB_ORDER: TabKey[] = [
  "overview",
  "explanation",
  "diagram",
  "analogy",
  "code",
  "quiz",
];

/** The section ids owned by a course (falls back to the first course). */
function courseSectionIds(courseId: string): string[] {
  const c = courses.find((x) => x.id === courseId) ?? courses[0];
  return c?.sectionIds ?? [];
}

/** First topic id of a course (its first section's first topic), if any. */
function firstTopicOfCourse(courseId: string): string | undefined {
  for (const sid of courseSectionIds(courseId)) {
    const sec = sections.find((s) => s.id === sid);
    if (sec?.topicIds.length) return sec.topicIds[0];
  }
  return undefined;
}

/** The course id that owns a topic (via its section), if any. */
function courseOfTopic(topicId: string): string | undefined {
  const sec = sections.find((s) => s.topicIds.includes(topicId));
  if (!sec) return undefined;
  return courses.find((c) => c.sectionIds.includes(sec.id))?.id;
}

function defaultState(): AppState {
  const firstCourseId = courses[0]?.id ?? "";
  return {
    visited: {},
    quiz: {},
    loginDates: [],
    expanded: { [courseSectionIds(firstCourseId)[0] ?? ""]: true },
    selectedCourseId: firstCourseId,
    selectedTopicId: firstTopicOfCourse(firstCourseId) ?? topics[0]?.id ?? "",
    leftCollapsed: false,
    rightCollapsed: false,
    tabOrder: DEFAULT_TAB_ORDER,
    openTabs: DEFAULT_TAB_ORDER,
    collapsedPanels: [],
    topicTime: {},
    topicDone: {},
    lastReviewed: {},
    tabsDone: {},
    tryIt: {},
  };
}

/**
 * Merge the 4 server section docs into a complete AppState.
 * Missing/empty sections fall back to defaults so the UI never crashes.
 */
function mergeFromSections(
  raw: Record<string, unknown> | undefined
): AppState {
  const base = defaultState();
  if (!raw) return base;
  const profile = (raw.profile ?? {}) as Partial<AppState>;
  const progress = (raw.progress ?? {}) as Partial<AppState> & {
    visited?: Record<string, boolean>;
    topicTime?: Record<string, number>;
    selectedTopicId?: string;
    topicDone?: Record<string, boolean>;
    lastReviewed?: Record<string, string>;
    tabsDone?: Record<string, Partial<Record<TabKey, boolean>>>;
  };
  const quizDoc = (raw.quiz ?? {}) as { answers?: QuizState };
  const tryItDoc = (raw.tryit ?? {}) as { attempts?: TryItState };
  const ui = (raw.ui ?? {}) as Partial<AppState>;

  return {
    ...base,
    loginDates: Array.isArray(profile.loginDates)
      ? (profile.loginDates as string[])
      : base.loginDates,
    visited: progress.visited ?? base.visited,
    topicTime: progress.topicTime ?? base.topicTime,
    selectedTopicId: progress.selectedTopicId || base.selectedTopicId,
    topicDone: progress.topicDone ?? base.topicDone,
    lastReviewed: progress.lastReviewed ?? base.lastReviewed,
    tabsDone: progress.tabsDone ?? base.tabsDone,
    quiz: quizDoc.answers ?? base.quiz,
    tryIt: tryItDoc.attempts ?? base.tryIt,
    selectedCourseId:
      typeof (ui as { selectedCourseId?: string }).selectedCourseId === "string" &&
      courses.some(
        (c) => c.id === (ui as { selectedCourseId?: string }).selectedCourseId
      )
        ? ((ui as { selectedCourseId?: string }).selectedCourseId as string)
        : base.selectedCourseId,
    expanded:
      ui.expanded && Object.keys(ui.expanded).length
        ? ui.expanded
        : base.expanded,
    leftCollapsed: ui.leftCollapsed ?? base.leftCollapsed,
    rightCollapsed: ui.rightCollapsed ?? base.rightCollapsed,
    tabOrder:
      Array.isArray(ui.tabOrder) &&
      ui.tabOrder.length === DEFAULT_TAB_ORDER.length &&
      ui.tabOrder.every((k): k is TabKey => k in TABS) &&
      new Set(ui.tabOrder).size === DEFAULT_TAB_ORDER.length
        ? (ui.tabOrder as TabKey[])
        : base.tabOrder,
    openTabs: Array.isArray(ui.openTabs)
      ? (ui.openTabs.filter((k): k is TabKey => k in TABS) as TabKey[])
      : base.openTabs,
    collapsedPanels: Array.isArray(ui.collapsedPanels)
      ? (ui.collapsedPanels.filter((k): k is TabKey => k in TABS) as TabKey[])
      : base.collapsedPanels,
  };
}

/**
 * Hook that returns a debounced section-flush function.
 * Repeated calls within the debounce window are merged and only the final
 * coalesced patch is PUT to /api/progress.
 */
function useSectionSync(section: SectionKey) {
  const pendingRef = useRef<Record<string, unknown>>({});
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (patch: Record<string, unknown>, delay: number) => {
      // Merge into the pending bucket (later writes override earlier ones).
      Object.assign(pendingRef.current, patch);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(async () => {
        const body = { section, patch: pendingRef.current };
        pendingRef.current = {};
        try {
          await fetch("/api/progress", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            credentials: "same-origin",
          });
        } catch {
          // Silent failure — UI is optimistic; next change will re-attempt.
        }
      }, delay);
    },
    [section]
  );
}

// todayISO, computeStreak, formatElapsed and the derived score/domain/revision
// helpers are imported from lib/progress-metrics (shared with the dashboard).

// ============================================================
// Tab metadata
// ============================================================
type TabMeta = {
  key: TabKey;
  label: string;
  icon: LucideIcon;
  accent: string; // tailwind text color
  border: string; // gradient-border class
  ring: string;   // bg tint
};

const TABS: Record<TabKey, TabMeta> = {
  overview: {
    key: "overview",
    label: "Overview",
    icon: BookOpen,
    accent: "text-blue-400",
    border: "gradient-border-blue",
    ring: "bg-blue-500/10 border-blue-500/30",
  },
  explanation: {
    key: "explanation",
    label: "Explanation",
    icon: AlertCircle,
    accent: "text-yellow-400",
    border: "gradient-border-yellow",
    ring: "bg-yellow-500/10 border-yellow-500/30",
  },
  diagram: {
    key: "diagram",
    label: "Diagram",
    icon: Network,
    accent: "text-accent",
    border: "gradient-border-orange",
    ring: "bg-accent/10 border-accent/30",
  },
  analogy: {
    key: "analogy",
    label: "Real World Analogy",
    icon: Lightbulb,
    accent: "text-purple-400",
    border: "gradient-border-purple",
    ring: "bg-purple-500/10 border-purple-500/30",
  },
  code: {
    key: "code",
    label: "Code Example",
    icon: Code2,
    accent: "text-green-400",
    border: "gradient-border-green",
    ring: "bg-green-500/10 border-green-500/30",
  },
  quiz: {
    key: "quiz",
    label: "Quiz Time",
    icon: HelpCircle,
    accent: "text-red-400",
    border: "gradient-border-red",
    ring: "bg-red-500/10 border-red-500/30",
  },
};

// ============================================================
// Helpers — bold-text inline parser ("**foo**")
// ============================================================
function renderBold(text: string, key = ""): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(
      <strong key={`${key}-${i++}`} className="text-text-primary font-semibold">
        {m[1]}
      </strong>
    );
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

// ============================================================
// Beginner fallback: derive subtopics from plain explanation
// ============================================================
function deriveBeginnerStructure(topic: Topic): {
  tldr: string;
  subtopics: Subtopic[];
} {
  if (topic.tldr && topic.subtopics) {
    return { tldr: topic.tldr, subtopics: topic.subtopics };
  }
  // Split explanation into sentences
  const sentences = topic.explanation
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  // TL;DR = first 1–2 sentences (capped at 280 chars)
  let tldr = "";
  for (const s of sentences) {
    if (tldr.length + s.length + 1 > 280) break;
    tldr = tldr ? `${tldr} ${s}` : s;
    if (tldr.length > 140) break;
  }
  if (!tldr) tldr = sentences[0] ?? "";

  const remaining = sentences.slice(
    sentences.findIndex((s) => tldr.endsWith(s)) + 1
  );

  // Group remaining sentences into 2-3 subtopics (roughly even)
  const chunks: string[][] = [[], [], []];
  remaining.forEach((s, i) => chunks[i % 3].push(s));
  const subtopics: Subtopic[] = chunks
    .filter((c) => c.length > 0)
    .slice(0, 3)
    .map((c, i) => ({
      heading: ["Key Concepts", "How It Works", "When to Use"][i] ?? "More",
      bullets: c.slice(0, 6).map((text) => ({ icon: "▸", text })),
    }));

  return { tldr, subtopics };
}

// ============================================================
// Syntax highlighter (regex-based, no external lib)
// ============================================================
const AWS_SERVICES = new Set([
  "EC2","S3","IAM","Lambda","RDS","DynamoDB","VPC","ELB","ALB","NLB",
  "CloudFront","Route 53","CloudWatch","CloudTrail","SNS","SQS","SES",
  "ECS","EKS","ECR","Fargate","KMS","STS","ACM","WAF","Shield","Cognito",
  "EFS","EBS","Glacier","Athena","Kinesis","Redshift","SageMaker",
  "Bedrock","ASG","STS","Aurora","ElastiCache","Beanstalk","Step Functions",
  "API Gateway","Direct Connect","Snowball","Storage Gateway","DataSync",
  "AppSync","AMI","SaaS","PaaS","IaaS","FaaS","SDK","CLI","MFA","SCP",
  "RegionTable","GovCloud","NFS","TLS","SSL","HTTP","HTTPS","SSH","RDP",
  "FTP","SFTP","JSON","CSV","ARN","CIDR","DNS","TCP","UDP","IPv4","IPv6",
  "STS","ENI","NACL","NAT","SGs","IAM",
]);

const SHELL_KEYWORDS = new Set([
  "aws","curl","echo","cat","yum","apt","systemctl","sudo","mkdir","cp","mv",
  "rm","ls","cd","exit","return","if","then","else","fi","for","do","done",
  "while","function","export","source","grep","sed","awk","jq","tail","head",
  "find","xargs","npm","npx","node","python","python3","pip","pip3","docker",
  "kubectl","terraform","git","wget",
]);

const PY_KEYWORDS = new Set([
  "import","from","as","def","return","class","if","elif","else","try","except",
  "finally","for","while","in","not","is","and","or","with","raise","pass",
  "lambda","yield","True","False","None","await","async","global","nonlocal","print",
]);

const JS_KEYWORDS = new Set([
  "const","let","var","function","return","if","else","for","while","do","switch",
  "case","break","continue","new","this","class","extends","super","import","export",
  "from","async","await","try","catch","finally","throw","typeof","instanceof","in","of",
  "null","undefined","true","false",
]);

type Token = { t: string; cls: string };

function tokenizeLine(line: string, lang: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const len = line.length;

  const isComment = lang === "json" ? false : true;
  const commentChars: string[] = lang === "json" ? [] : ["//", "#"];

  while (i < len) {
    const ch = line[i];

    // Whitespace
    if (/\s/.test(ch)) {
      let j = i;
      while (j < len && /\s/.test(line[j])) j++;
      tokens.push({ t: line.slice(i, j), cls: "" });
      i = j;
      continue;
    }

    // Single-line comments
    if (isComment) {
      let matched = false;
      for (const cc of commentChars) {
        if (line.startsWith(cc, i)) {
          tokens.push({ t: line.slice(i), cls: "tok-com" });
          return tokens;
        }
      }
      if (matched) continue;
    }

    // Multi-line comment start /* */ (single line case)
    if (line.startsWith("/*", i) && (lang === "js" || lang === "ts" || lang === "java" || lang === "go" || lang === "c")) {
      const end = line.indexOf("*/", i + 2);
      if (end !== -1) {
        tokens.push({ t: line.slice(i, end + 2), cls: "tok-com" });
        i = end + 2;
        continue;
      } else {
        tokens.push({ t: line.slice(i), cls: "tok-com" });
        return tokens;
      }
    }

    // Strings
    if (ch === '"' || ch === "'" || ch === "`") {
      const quote = ch;
      let j = i + 1;
      while (j < len) {
        if (line[j] === "\\" && j + 1 < len) { j += 2; continue; }
        if (line[j] === quote) { j += 1; break; }
        j += 1;
      }
      const str = line.slice(i, j);
      // JSON keys (the next non-space char is ':') are highlighted as keywords
      const trailing = line.slice(j).match(/^\s*:/);
      if (lang === "json" && trailing) {
        tokens.push({ t: str, cls: "tok-kw" });
      } else {
        tokens.push({ t: str, cls: "tok-str" });
      }
      i = j;
      continue;
    }

    // Numbers
    if (/\d/.test(ch) && (i === 0 || !/[A-Za-z_]/.test(line[i - 1] ?? " "))) {
      let j = i;
      while (j < len && /[0-9._]/.test(line[j])) j++;
      tokens.push({ t: line.slice(i, j), cls: "tok-num" });
      i = j;
      continue;
    }

    // CLI flags --foo / -f
    if (lang === "bash" && ch === "-" && (line[i + 1] === "-" || /[A-Za-z]/.test(line[i + 1] ?? ""))) {
      let j = i + 1;
      while (j < len && /[A-Za-z0-9_-]/.test(line[j])) j++;
      tokens.push({ t: line.slice(i, j), cls: "tok-flag" });
      i = j;
      continue;
    }

    // Identifiers / keywords
    if (/[A-Za-z_$]/.test(ch)) {
      let j = i;
      while (j < len && /[A-Za-z0-9_$]/.test(line[j])) j++;
      const word = line.slice(i, j);
      // First word of a bash line → command
      const isFirstWord = lang === "bash" && /^\s*$/.test(line.slice(0, i));
      let cls = "tok-punct";
      if (
        (lang === "python" && PY_KEYWORDS.has(word)) ||
        (lang === "js" || lang === "ts" ? JS_KEYWORDS.has(word) : false) ||
        (lang === "bash" && SHELL_KEYWORDS.has(word) && isFirstWord)
      ) {
        cls = "tok-kw";
      } else if (word === "true" || word === "false" || word === "null" || word === "None" || word === "True" || word === "False") {
        cls = "tok-bool";
      } else if (AWS_SERVICES.has(word)) {
        cls = "tok-aws";
      } else if (lang === "bash" && isFirstWord && SHELL_KEYWORDS.has(word)) {
        cls = "tok-cmd";
      } else {
        cls = "tok-punct";
      }
      tokens.push({ t: word, cls });
      i = j;
      continue;
    }

    // Punctuation
    tokens.push({ t: ch, cls: "tok-punct" });
    i += 1;
  }
  return tokens;
}

function CodeBlock({ example }: { example: CodeExample }) {
  const [copied, setCopied] = useState(false);
  const lines = example.code.split("\n");
  const langLabel = example.language.toUpperCase();

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(example.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }, [example.code]);

  return (
    <div className="relative rounded-md border border-border bg-[#080B10] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-bg-base/40 border-b border-border">
        <div className="flex items-center gap-2 text-[11px] text-text-muted">
          <span className="font-mono px-1.5 py-0.5 rounded bg-bg-base border border-border text-accent">
            {langLabel}
          </span>
          <span>{example.title}</span>
        </div>
        <button
          type="button"
          onClick={onCopy}
          className="flex items-center gap-1 text-[11px] text-text-muted hover:text-text-primary px-2 py-1 rounded hover:bg-bg-hover"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check size={12} className="text-success" /> Copied
            </>
          ) : (
            <>
              <Copy size={12} /> Copy
            </>
          )}
        </button>
      </div>

      {/* Code body with line numbers */}
      <pre className="overflow-x-auto text-[12.5px] leading-[1.7] font-mono">
        <code>
          {lines.map((line, lnIdx) => {
            const tokens = tokenizeLine(line, example.language);
            return (
              <div key={lnIdx} className="flex hover:bg-white/[0.02]">
                <span
                  className="select-none w-10 text-right pr-3 text-text-muted/60 border-r border-border/40 mr-3 flex-shrink-0"
                  aria-hidden
                >
                  {lnIdx + 1}
                </span>
                <span className="whitespace-pre">
                  {tokens.length === 0 ? (
                    " "
                  ) : (
                    tokens.map((tok, ti) => (
                      <span key={ti} className={tok.cls}>
                        {tok.t}
                      </span>
                    ))
                  )}
                </span>
              </div>
            );
          })}
        </code>
      </pre>
    </div>
  );
}

// ============================================================
// Panel — colored-border container with collapse
// ============================================================
function Panel({
  tab,
  title,
  collapsed,
  onToggleCollapse,
  onClose,
  checked,
  onToggleChecked,
  children,
}: {
  tab: TabMeta;
  title: string;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onClose: () => void;
  checked: boolean;
  onToggleChecked: () => void;
  children: React.ReactNode;
}) {
  const Icon = tab.icon;
  return (
    <section
      className={`relative rounded-lg bg-bg-card/40 border border-border overflow-hidden ${tab.border} panel-enter`}
    >
      {/* Clicking anywhere on the header toggles collapse/expand. */}
      <header
        onClick={onToggleCollapse}
        className={`flex items-center justify-between px-4 py-2.5 ${tab.ring} border-b border-border cursor-pointer select-none`}
        title={collapsed ? "Click to expand" : "Click to collapse"}
      >
        <div className="flex items-center gap-2">
          <Icon size={14} className={tab.accent} />
          <h3 className="text-[13.5px] font-semibold text-text-primary">{title}</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="flex items-center gap-1.5 mr-1 text-[11px] text-text-muted"
            onClick={(e) => e.stopPropagation()}
          >
            <ManualCheckbox
              checked={checked}
              onChange={onToggleChecked}
              ariaLabel={`Mark ${title} done`}
            />
            <span className="hidden sm:inline select-none">Done</span>
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleCollapse();
            }}
            className="tip p-1 rounded hover:bg-bg-hover text-text-muted hover:text-text-primary"
            data-tip={collapsed ? "Expand" : "Collapse"}
            aria-label={collapsed ? "Expand panel" : "Collapse panel"}
          >
            {collapsed ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="tip p-1 rounded hover:bg-bg-hover text-text-muted hover:text-danger"
            data-tip="Close tab"
            aria-label="Close panel"
          >
            <X size={13} />
          </button>
        </div>
      </header>
      {!collapsed && <div className="px-4 py-4 animate-fade-in">{children}</div>}
    </section>
  );
}

// ============================================================
// Main Page
// ============================================================
function ManualCheckbox({
  checked,
  onChange,
  ariaLabel,
}: {
  checked: boolean;
  onChange: () => void;
  ariaLabel?: string;
}) {
  return (
    <span
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          onChange();
        }
      }}
      className={
        "inline-flex items-center justify-center w-[14px] h-[14px] rounded-[3px] cursor-pointer transition-colors flex-shrink-0 " +
        (checked
          ? "bg-success border border-success"
          : "border-[1.5px] border-border hover:border-text-secondary bg-transparent")
      }
    >
      {checked && <Check size={10} strokeWidth={3} className="text-white" />}
    </span>
  );
}

// ============================================================
// Top navigation bar (logo, active topic, progress, user)
// Rendered inside the center scroll column so it scrolls away on desktop.
// ============================================================
function TopNav({
  onOpenMobileNav,
  onOpenCourseDrawer,
  activeCourse,
  selectedTopic,
  visitedCount,
  completedCount,
  totalTopics,
  gScore,
  user,
}: {
  onOpenMobileNav: () => void;
  onOpenCourseDrawer: () => void;
  activeCourse: (typeof courses)[number] | undefined;
  selectedTopic: Topic;
  visitedCount: number;
  completedCount: number;
  totalTopics: number;
  gScore: { correct: number; total: number };
  user: SessionUser | null;
}) {
  const CourseIcon = activeCourse
    ? COURSE_ICONS[activeCourse.icon] ?? BookOpen
    : BookOpen;
  return (
    <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3">
      {/* Mobile menu button — opens the course drawer */}
      <button
        type="button"
        onClick={onOpenMobileNav}
        className="lg:hidden p-2 -ml-1 rounded-md hover:bg-bg-hover text-text-secondary hover:text-text-primary shrink-0"
        aria-label="Open course menu"
      >
        <Menu size={20} />
      </button>

      {/* Logo + app name */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-9 h-9 rounded-md bg-gradient-to-br from-accent to-orange-600 flex items-center justify-center text-white shadow-sm shadow-accent/30">
          <Brain size={20} />
        </div>
        <div className="hidden sm:block leading-tight">
          <div className="text-sm font-semibold text-text-primary">Galaxy Brain</div>
          <div className="text-[11px] text-text-muted">Cram today, flex tomorrow.</div>
        </div>
      </div>

      {/* Mobile course switcher — opens the bottom drawer (desktop uses the sidebar) */}
      <button
        type="button"
        onClick={onOpenCourseDrawer}
        aria-label="Switch course"
        className="lg:hidden flex-1 min-w-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border bg-bg-base text-text-secondary hover:text-text-primary"
      >
        <CourseIcon size={15} className="shrink-0 text-accent" />
        <span className="text-[12.5px] font-medium truncate">
          {activeCourse?.title ?? "Course"}
        </span>
        <ChevronDown size={13} className="shrink-0 ml-auto" />
      </button>

      {/* Active topic heading (desktop only) */}
      <div className="hidden lg:block flex-1 min-w-0 px-2 lg:px-4 text-center">
        <div className="text-[10.5px] uppercase tracking-wide text-text-muted truncate">
          {selectedTopic.section}
        </div>
        <h1 className="text-[13px] md:text-[15px] font-semibold text-text-primary truncate">
          {selectedTopic.title}
        </h1>
      </div>

      {/* Overall progress — Visited + Completed stacked bars */}
      <div className="hidden lg:flex flex-col gap-2 min-w-[220px]">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-text-secondary w-16">Visited</span>
          <div className="flex-1 h-[5px] rounded-full bg-bg-base overflow-hidden">
            <div
              className="h-full bg-accent transition-all"
              style={{ width: `${(visitedCount / totalTopics) * 100}%` }}
            />
          </div>
          <span className="text-[11px] text-text-secondary w-12 text-right tabular-nums">
            {visitedCount} / {totalTopics}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-text-secondary w-16">Completed</span>
          <div className="flex-1 h-[5px] rounded-full bg-bg-base overflow-hidden">
            <div
              className="h-full bg-success transition-all"
              style={{ width: `${(completedCount / totalTopics) * 100}%` }}
            />
          </div>
          <span className="text-[11px] text-text-secondary w-12 text-right tabular-nums">
            {completedCount} / {totalTopics}
          </span>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-md bg-bg-base border border-border">
        <Trophy size={16} className="text-accent" />
        <div className="text-xs">
          <div className="text-text-muted leading-3">Global Quiz Score</div>
          <div className="font-semibold text-text-primary">
            {gScore.correct} / {gScore.total}{" "}
            <span className="text-text-muted">
              ({gScore.total ? Math.round((gScore.correct / gScore.total) * 100) : 0}%)
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
        <a
          href="/dashboard"
          className="tip tip-bottom p-2 rounded-md hover:bg-bg-hover text-text-muted hover:text-accent"
          data-tip="Dashboard"
          aria-label="Open dashboard"
        >
          <LayoutDashboard size={16} />
        </a>
        <a
          href="/playground"
          className="tip tip-bottom p-2 rounded-md hover:bg-bg-hover text-text-muted hover:text-accent"
          data-tip="Playground"
          aria-label="Open code playground"
        >
          <Terminal size={16} />
        </a>
        <a
          href="/kanban"
          className="tip tip-bottom p-2 rounded-md hover:bg-bg-hover text-text-muted hover:text-accent"
          data-tip="Kanban board"
          aria-label="Open Kanban board"
        >
          <KanbanSquare size={16} />
        </a>
        <a
          href="/dsa-practice"
          className="tip tip-bottom p-2 rounded-md hover:bg-bg-hover text-text-muted hover:text-accent"
          data-tip="Timed DSA practice"
          aria-label="Open timed DSA practice"
        >
          <Timer size={16} />
        </a>
        {user && (
          <div className="flex items-center gap-2">
            <div className="hidden sm:block text-right leading-tight">
              <div className="text-[12px] text-text-primary font-medium">
                {user.displayName}
              </div>
              <div className="text-[10px] text-text-muted font-mono">
                {user.username}
              </div>
            </div>
            <div
              className="w-9 h-9 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent font-semibold text-sm"
              aria-label={user.displayName}
              title={user.username}
            >
              {user.displayName.charAt(0).toUpperCase()}
            </div>
            <button
              type="button"
              onClick={async () => {
                try {
                  await fetch("/api/auth/logout", {
                    method: "POST",
                    credentials: "same-origin",
                  });
                } finally {
                  window.location.href = "/login";
                }
              }}
              className="tip p-2 rounded-md hover:bg-bg-hover text-text-muted hover:text-danger"
              data-tip="Sign out"
              aria-label="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Mobile course switcher — bottom sheet drawer
// ============================================================
function CourseBottomDrawer({
  open,
  onClose,
  selectedCourseId,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  selectedCourseId: string;
  onSelect: (id: string) => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[55] lg:hidden">
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={onClose}
        aria-hidden
      />
      <div className="sheet-enter absolute bottom-0 left-0 right-0 max-h-[75vh] flex flex-col rounded-t-2xl border-t border-border bg-bg-panel shadow-2xl">
        <div className="pt-2 flex justify-center">
          <span className="w-10 h-1 rounded-full bg-border" aria-hidden />
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <BookOpen size={15} className="text-accent" /> Switch course
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-bg-hover text-text-muted hover:text-text-primary"
            aria-label="Close course switcher"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-3 space-y-1.5 overflow-y-auto pb-[max(1rem,env(safe-area-inset-bottom))]">
          {courses.map((c) => {
            const Icon = COURSE_ICONS[c.icon] ?? BookOpen;
            const active = c.id === selectedCourseId;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  onSelect(c.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                  active
                    ? "bg-accent/15 border-accent/40"
                    : "border-border bg-bg-base hover:bg-bg-hover"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${
                    active ? "bg-accent/20 text-accent" : "bg-bg-panel text-text-muted"
                  }`}
                >
                  <Icon size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    className={`text-[13.5px] font-medium truncate ${
                      active ? "text-accent" : "text-text-primary"
                    }`}
                  >
                    {c.title}
                  </div>
                  {c.description && (
                    <div className="text-[11.5px] text-text-muted truncate">
                      {c.description}
                    </div>
                  )}
                </div>
                {active && <Check size={16} className="text-accent shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState<AppState>(defaultState);
  const [search, setSearch] = useState("");

  // Mobile-only: the left sidebar is hidden on small screens and opened as a
  // full-screen drawer from the navbar menu button.
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  // Mobile-only: bottom-sheet drawer dedicated to switching the active course.
  const [mobileCourseOpen, setMobileCourseOpen] = useState(false);

  // quiz UI state (per active topic, ephemeral)
  const [quizMode, setQuizMode] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] =
    useState<"A" | "B" | "C" | "D" | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState(0);

  // for time-spent tracker
  const [topicOpenedAt, setTopicOpenedAt] = useState<number>(Date.now());
  const [now, setNow] = useState<number>(Date.now());
  const contentRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  // drag state
  const [draggedTab, setDraggedTab] = useState<TabKey | null>(null);
  const [dropTargetTab, setDropTargetTab] = useState<TabKey | null>(null);

  // Panel stacking order (front-most first). Separate from `tabOrder` so that
  // clicking a tab reshuffles only its content panel to the top — the tab bar
  // itself stays put (it only reorders via drag-and-drop).
  const [panelOrder, setPanelOrder] = useState<TabKey[]>(DEFAULT_TAB_ORDER);

  // signed-in user (from /api/auth/me); null until /api/progress resolves
  const [user, setUser] = useState<SessionUser | null>(null);

  // ----------------------------------------------------------------
  // Checkbox toggles — write through to the progress section.
  // setState is optimistic; syncProgress debounces the PUT.
  // ----------------------------------------------------------------
  const onTopicCheckboxToggle = (topicId: string) => {
    setState((s) => {
      const nextTopicDone = { ...s.topicDone, [topicId]: !s.topicDone[topicId] };
      syncProgress({ topicDone: nextTopicDone }, 500);
      return { ...s, topicDone: nextTopicDone };
    });
  };
  const onTabCheckboxToggle = (topicId: string, tabKey: TabKey) => {
    setState((s) => {
      const current = s.tabsDone[topicId] ?? {};
      const nextForTopic = { ...current, [tabKey]: !current[tabKey] };
      const nextTabsDone = { ...s.tabsDone, [topicId]: nextForTopic };
      syncProgress({ tabsDone: nextTabsDone }, 500);
      return { ...s, tabsDone: nextTabsDone };
    });
  };

  // per-section debounced PUT helpers
  const syncProfile = useSectionSync("profile");
  const syncProgress = useSectionSync("progress");
  const syncQuiz = useSectionSync("quiz");
  const syncTryIt = useSectionSync("tryit");
  const syncUi = useSectionSync("ui");

  // -------- hydrate from /api/progress (sharded) --------
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/progress", {
          credentials: "same-origin",
        });
        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }
        const data = (await res.json()) as {
          user: SessionUser;
          sections: Record<string, unknown>;
        };
        if (cancelled) return;

        const merged = mergeFromSections(data.sections);

        // Deep-link: /?topic=<id> (e.g. from the dashboard "Due for review")
        // selects that topic and switches to its owning course/section.
        const topicParam = new URLSearchParams(window.location.search).get(
          "topic"
        );
        if (topicParam && topics.some((t) => t.id === topicParam)) {
          merged.selectedTopicId = topicParam;
          const cid = courseOfTopic(topicParam);
          if (cid) merged.selectedCourseId = cid;
          const sec = sections.find((s) => s.topicIds.includes(topicParam));
          if (sec) merged.expanded = { ...merged.expanded, [sec.id]: true };
        }

        // streak: record today's login if not already recorded
        const today = todayISO();
        const dates = merged.loginDates.includes(today)
          ? merged.loginDates
          : [...merged.loginDates, today].slice(-365);
        merged.loginDates = dates;

        // narrow viewport default-collapse
        if (typeof window !== "undefined" && window.innerWidth < 1280) {
          if (merged.rightCollapsed === false) merged.rightCollapsed = true;
          if (merged.leftCollapsed === false && window.innerWidth < 900)
            merged.leftCollapsed = true;
        }

        setUser(data.user);
        setState(merged);
        setHydrated(true);

        // If today's login was newly added, push it to the profile section
        // immediately so streak math is preserved on the server.
        if (!data.sections?.profile ||
            !Array.isArray((data.sections.profile as { loginDates?: string[] }).loginDates) ||
            !(data.sections.profile as { loginDates: string[] }).loginDates.includes(today)) {
          syncProfile({ loginDates: dates }, 0);
        }
      } catch {
        // Network error / server down — fall back to a fresh in-memory state.
        if (!cancelled) {
          setState(defaultState());
          setHydrated(true);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------- per-section debounced syncs (progress / ui) --------
  // (quiz is pushed in the QuizPanel onSubmit handler with a dotted patch.)
  useEffect(() => {
    if (!hydrated) return;
    syncProgress(
      {
        visited: state.visited,
        topicTime: state.topicTime,
        selectedTopicId: state.selectedTopicId,
        lastReviewed: state.lastReviewed,
      },
      1500
    );
  }, [
    state.visited,
    state.topicTime,
    state.selectedTopicId,
    state.lastReviewed,
    hydrated,
    syncProgress,
  ]);

  useEffect(() => {
    if (!hydrated) return;
    syncUi(
      {
        expanded: state.expanded,
        leftCollapsed: state.leftCollapsed,
        rightCollapsed: state.rightCollapsed,
        tabOrder: state.tabOrder,
        openTabs: state.openTabs,
        collapsedPanels: state.collapsedPanels,
        selectedCourseId: state.selectedCourseId,
      },
      1500
    );
  }, [
    state.expanded,
    state.leftCollapsed,
    state.rightCollapsed,
    state.tabOrder,
    state.openTabs,
    state.collapsedPanels,
    state.selectedCourseId,
    hydrated,
    syncUi,
  ]);

  // -------- topic switch side-effects --------
  useEffect(() => {
    if (!hydrated || !state.selectedTopicId) return;
    // Mark visited and stamp the last-reviewed date (spaced-repetition signal).
    setState((s) => {
      const today = todayISO();
      const alreadyToday = s.lastReviewed[s.selectedTopicId] === today;
      if (s.visited[s.selectedTopicId] && alreadyToday) return s;
      return {
        ...s,
        visited: { ...s.visited, [s.selectedTopicId]: true },
        lastReviewed: { ...s.lastReviewed, [s.selectedTopicId]: today },
      };
    });
    setQuizMode(false);
    setCurrentQ(0);
    setShowAnswer(false);
    setSelectedAnswer(null);
    setActiveCodeTab(0);
    setTopicOpenedAt(Date.now());
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [state.selectedTopicId, hydrated]);

  // -------- timer tick for elapsed display --------
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // -------- accumulate topic time on unload / topic change --------
  useEffect(() => {
    return () => {
      const elapsed = Date.now() - topicOpenedAt;
      if (elapsed > 1000) {
        setState((s) => ({
          ...s,
          topicTime: {
            ...s.topicTime,
            [s.selectedTopicId]: (s.topicTime[s.selectedTopicId] ?? 0) + elapsed,
          },
        }));
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedTopicId]);

  const selectedTopic: Topic | undefined = useMemo(
    () => topics.find((t) => t.id === state.selectedTopicId),
    [state.selectedTopicId]
  );

  // -------- derived metrics --------
  const totalTopics = topics.length;
  const visitedCount = Object.values(state.visited).filter(Boolean).length;
  const completedCount = Object.values(state.topicDone).filter(Boolean).length;
  const gScore = useMemo(() => globalScore(state.quiz), [state.quiz]);
  const xp = useMemo(() => xpFromQuiz(state.quiz), [state.quiz]);
  const level = levelFromXp(xp);
  const streak = useMemo(() => computeStreak(state.loginDates), [state.loginDates]);

  // -------- course scoping (Course → Section → Topic) --------
  const activeCourse = useMemo(
    () => courses.find((c) => c.id === state.selectedCourseId) ?? courses[0],
    [state.selectedCourseId]
  );
  const courseSections = useMemo(() => {
    const ids = new Set(activeCourse?.sectionIds ?? []);
    return sections.filter((s) => ids.has(s.id));
  }, [activeCourse]);
  const courseTopicIds = useMemo(
    () => new Set(courseSections.flatMap((s) => s.topicIds)),
    [courseSections]
  );

  // Flat, ordered list of lesson (topic) ids across the active course, used to
  // drive the Previous / Next lesson buttons at the bottom of the panels.
  const courseTopicOrder = useMemo(
    () => courseSections.flatMap((s) => s.topicIds),
    [courseSections]
  );
  const currentTopicIdx = courseTopicOrder.indexOf(state.selectedTopicId);
  const prevTopicId =
    currentTopicIdx > 0 ? courseTopicOrder[currentTopicIdx - 1] : undefined;
  const nextTopicId =
    currentTopicIdx >= 0 && currentTopicIdx < courseTopicOrder.length - 1
      ? courseTopicOrder[currentTopicIdx + 1]
      : undefined;
  // Jump to a lesson and make sure its section is expanded in the left rail.
  const goToTopic = (id: string) =>
    setState((s) => {
      const sec = sections.find((x) => x.topicIds.includes(id));
      return {
        ...s,
        selectedTopicId: id,
        expanded: sec ? { ...s.expanded, [sec.id]: true } : s.expanded,
      };
    });

  const radarData = useMemo(
    () => domainStrengths(state.quiz, courseTopicIds),
    [state.quiz, courseTopicIds]
  );
  const revisions = useMemo(() => recommendedRevisions(state.quiz), [state.quiz]);

  // -------- search filter (scoped to the active course) --------
  const filteredSections = useMemo(() => {
    if (!search.trim()) return courseSections;
    const q = search.toLowerCase();
    return courseSections
      .map((sec) => {
        const matchingIds = sec.topicIds.filter((id) => {
          const t = topics.find((x) => x.id === id);
          if (!t) return false;
          return (
            t.title.toLowerCase().includes(q) ||
            t.shortLabel.toLowerCase().includes(q) ||
            t.explanation.toLowerCase().includes(q)
          );
        });
        return matchingIds.length ? { ...sec, topicIds: matchingIds } : null;
      })
      .filter(Boolean) as typeof sections;
  }, [search, courseSections]);

  // -------- helpers --------
  const isPanelOpen = (k: TabKey) => state.openTabs.includes(k);
  const isPanelCollapsed = (k: TabKey) => state.collapsedPanels.includes(k);

  const togglePanelCollapse = (k: TabKey) =>
    setState((s) => ({
      ...s,
      collapsedPanels: s.collapsedPanels.includes(k)
        ? s.collapsedPanels.filter((x) => x !== k)
        : [...s.collapsedPanels, k],
    }));

  const closePanel = (k: TabKey) =>
    setState((s) => ({ ...s, openTabs: s.openTabs.filter((x) => x !== k) }));

  const togglePanel = (k: TabKey) =>
    setState((s) =>
      s.openTabs.includes(k)
        ? { ...s, openTabs: s.openTabs.filter((x) => x !== k) }
        : { ...s, openTabs: [...s.openTabs, k] }
    );

  const openAll = () =>
    setState((s) => ({ ...s, openTabs: [...s.tabOrder], collapsedPanels: [] }));
  const collapseAll = () =>
    setState((s) => ({ ...s, collapsedPanels: [...s.tabOrder] }));
  const expandAll = () =>
    setState((s) => ({ ...s, collapsedPanels: [] }));

  // The "current" tab = front-most open panel (first in the panel order).
  const currentTab: TabKey | undefined = panelOrder.find((k) =>
    state.openTabs.includes(k)
  );
  const closeAll = () => setState((s) => ({ ...s, openTabs: [] }));
  const closeOthers = () =>
    setState((s) => {
      const keep = panelOrder.find((k) => s.openTabs.includes(k));
      return { ...s, openTabs: keep ? [keep] : [] };
    });

  // Clicking a tab brings its content panel to the FRONT of the panels area
  // (top), opens it if closed, expands it if collapsed, then scrolls the panels
  // into view under the sticky bar. Only the panel order changes — the tab bar
  // stays put (it reorders only via drag-and-drop).
  const focusTab = (k: TabKey) => {
    setPanelOrder((p) => [k, ...p.filter((t) => t !== k)]);
    setState((s) => {
      const openTabs = s.openTabs.includes(k) ? s.openTabs : [...s.openTabs, k];
      const collapsedPanels = s.collapsedPanels.filter((t) => t !== k);
      // Scroll the panels area to the top (just below the sticky tab bar).
      requestAnimationFrame(() => {
        const top = navRef.current?.offsetHeight ?? 0;
        contentRef.current?.scrollTo({ top, behavior: "smooth" });
      });
      return { ...s, openTabs, collapsedPanels };
    });
  };

  // -------- drag-to-reorder tab bar --------
  const handleDragStart = (k: TabKey) => () => setDraggedTab(k);
  const handleDragOver = (k: TabKey) => (e: React.DragEvent) => {
    e.preventDefault();
    setDropTargetTab(k);
  };
  const handleDrop = (target: TabKey) => () => {
    if (!draggedTab || draggedTab === target) {
      setDraggedTab(null);
      setDropTargetTab(null);
      return;
    }
    setState((s) => {
      const next = s.tabOrder.filter((t) => t !== draggedTab);
      const idx = next.indexOf(target);
      next.splice(idx, 0, draggedTab);
      return { ...s, tabOrder: next };
    });
    setDraggedTab(null);
    setDropTargetTab(null);
  };
  const handleDragEnd = () => {
    setDraggedTab(null);
    setDropTargetTab(null);
  };

  // Switch the active course: move the topic selection into the new course and
  // pre-expand its first section (one atomic update).
  const selectCourse = (cid: string) => {
    if (cid === state.selectedCourseId) return;
    setState((s) => {
      const firstSec = courseSectionIds(cid)[0] ?? "";
      const firstTopic = firstTopicOfCourse(cid);
      return {
        ...s,
        selectedCourseId: cid,
        selectedTopicId: firstTopic ?? s.selectedTopicId,
        expanded: firstSec ? { ...s.expanded, [firstSec]: true } : s.expanded,
      };
    });
  };

  // -------- render --------
  // Empty-course guard: a course whose content hasn't been authored yet shows a
  // placeholder (with a switcher) instead of leaking a topic from another course.
  if (courseSections.length === 0) {
    return (
      <EmptyCourseScreen
        activeCourse={activeCourse}
        selectedCourseId={state.selectedCourseId}
        onSelectCourse={selectCourse}
      />
    );
  }

  if (!selectedTopic) {
    return <CenterLoader label="Loading…" />;
  }

  const accumulatedMs = (state.topicTime[selectedTopic.id] ?? 0) + (now - topicOpenedAt);

  return (
    <div className="h-screen flex flex-col bg-bg-base text-text-primary overflow-hidden">
      {!hydrated && <CenterLoader />}
      <CourseBottomDrawer
        open={mobileCourseOpen}
        onClose={() => setMobileCourseOpen(false)}
        selectedCourseId={state.selectedCourseId}
        onSelect={selectCourse}
      />

      {/* ============ MAIN ============ */}
      <div className="flex-1 flex min-h-0">
        {/* ====== LEFT SIDEBAR ====== */}
        <LeftSidebar
          collapsed={state.leftCollapsed}
          setCollapsed={(v) => setState((s) => ({ ...s, leftCollapsed: v }))}
          filteredSections={filteredSections}
          selectedCourseId={state.selectedCourseId}
          onSelectCourse={selectCourse}
          expanded={state.expanded}
          setExpanded={(eid) =>
            setState((s) => ({
              ...s,
              expanded: { ...s.expanded, [eid]: !s.expanded[eid] },
            }))
          }
          selectedTopicId={state.selectedTopicId}
          setSelectedTopicId={(id) =>
            setState((s) => ({ ...s, selectedTopicId: id }))
          }
          visited={state.visited}
          quiz={state.quiz}
          streak={streak}
          topicDone={state.topicDone}
          onTopicCheckboxToggle={onTopicCheckboxToggle}
        />

        {/* Mobile: full-screen course drawer, opened from the navbar menu button */}
        {mobileNavOpen && (
          <LeftSidebar
            mobile
            onCloseMobile={() => setMobileNavOpen(false)}
            collapsed={false}
            setCollapsed={() => {}}
            filteredSections={filteredSections}
            selectedCourseId={state.selectedCourseId}
            onSelectCourse={selectCourse}
            expanded={state.expanded}
            setExpanded={(eid) =>
              setState((s) => ({
                ...s,
                expanded: { ...s.expanded, [eid]: !s.expanded[eid] },
              }))
            }
            selectedTopicId={state.selectedTopicId}
            setSelectedTopicId={(id) =>
              setState((s) => ({ ...s, selectedTopicId: id }))
            }
            visited={state.visited}
            quiz={state.quiz}
            streak={streak}
            topicDone={state.topicDone}
            onTopicCheckboxToggle={onTopicCheckboxToggle}
          />
        )}

        {/* ====== CENTER ====== */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Center scroll column: navbar (scrolls away on desktop) + sticky
              tab/action bar + panels all share this one scroll context. */}
          <div ref={contentRef} className="flex-1 overflow-y-auto overflow-x-hidden">
            {/* Navbar — scrolls away on desktop, stays pinned on mobile */}
            <header
              ref={navRef}
              className="border-b border-border bg-bg-panel/90 backdrop-blur sticky top-0 z-30 lg:static lg:z-auto"
            >
              <TopNav
                onOpenMobileNav={() => setMobileNavOpen(true)}
                onOpenCourseDrawer={() => setMobileCourseOpen(true)}
                activeCourse={activeCourse}
                selectedTopic={selectedTopic}
                visitedCount={visitedCount}
                completedCount={completedCount}
                totalTopics={totalTopics}
                gScore={gScore}
                user={user}
              />
            </header>

            {/* Sticky tab + action bar — frozen at the top of the scroll column */}
            <div className="glass lg:sticky lg:top-0 z-20">
            {/* Tabs: icon-only (label in tooltip) so the row never needs a
                horizontal scrollbar. */}
            <div className="flex items-center gap-1 px-3 py-1.5 flex-wrap">
              {state.tabOrder.map((k) => {
                const meta = TABS[k];
                const Icon = meta.icon;
                const open = isPanelOpen(k);
                const collapsed = isPanelCollapsed(k);
                const isDragging = draggedTab === k;
                const isDropTarget = dropTargetTab === k && draggedTab && draggedTab !== k;
                return (
                  <div
                    key={k}
                    draggable
                    onDragStart={handleDragStart(k)}
                    onDragOver={handleDragOver(k)}
                    onDrop={handleDrop(k)}
                    onDragEnd={handleDragEnd}
                    data-tip={`${meta.label}${open && collapsed ? " (minimized)" : ""}`}
                    className={`tip tip-bottom flex items-center group rounded-t-md border-t border-l border-r ${open
                      ? "border-border bg-bg-card text-text-primary"
                      : "border-transparent bg-bg-base/40 text-text-muted hover:text-text-primary"} ${isDragging ? "tab-dragging" : ""} ${isDropTarget ? "tab-drop-target" : ""}`}
                  >
                    <button
                      type="button"
                      onClick={() => focusTab(k)}
                      aria-label={meta.label}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 cursor-grab"
                    >
                      <Icon
                        size={16}
                        className={`${open ? meta.accent : ""} ${
                          open && collapsed ? "opacity-50" : ""
                        }`}
                      />
                      <ManualCheckbox
                        checked={state.tabsDone[state.selectedTopicId]?.[k] ?? false}
                        onChange={() => onTabCheckboxToggle(state.selectedTopicId, k)}
                        ariaLabel={`Mark ${meta.label} done`}
                      />
                    </button>
                    {open && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          closePanel(k);
                        }}
                        className="p-1 mr-1 rounded text-text-muted hover:text-danger hover:bg-bg-hover"
                        aria-label={`Close ${meta.label}`}
                      >
                        <X size={11} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Action bar — icon + label on wide screens, icon-only (label in
                the native tooltip) on narrow, so it never needs to scroll. */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 border-t border-border flex-wrap">
              <button
                type="button"
                onClick={openAll}
                title="Open all"
                className="shrink-0 inline-flex items-center gap-1.5 text-[11px] px-2 py-1 rounded border border-border bg-bg-base hover:bg-bg-hover text-text-secondary hover:text-text-primary"
              >
                <Layers size={13} />
                <span className="hidden lg:inline">Open all</span>
              </button>
              <button
                type="button"
                onClick={expandAll}
                title="Expand all"
                className="shrink-0 inline-flex items-center gap-1.5 text-[11px] px-2 py-1 rounded border border-border bg-bg-base hover:bg-bg-hover text-text-secondary hover:text-text-primary"
              >
                <Maximize2 size={13} />
                <span className="hidden lg:inline">Expand all</span>
              </button>
              <button
                type="button"
                onClick={collapseAll}
                title="Collapse all"
                className="shrink-0 inline-flex items-center gap-1.5 text-[11px] px-2 py-1 rounded border border-border bg-bg-base hover:bg-bg-hover text-text-secondary hover:text-text-primary"
              >
                <Minimize2 size={13} />
                <span className="hidden lg:inline">Collapse all</span>
              </button>
              <span className="shrink-0 w-px h-4 bg-border mx-0.5" aria-hidden />
              <button
                type="button"
                onClick={closeOthers}
                disabled={state.openTabs.length <= 1}
                title={
                  currentTab
                    ? `Keep only "${TABS[currentTab].label}" open`
                    : "Close others"
                }
                className="shrink-0 inline-flex items-center gap-1.5 text-[11px] px-2 py-1 rounded border border-border bg-bg-base hover:bg-bg-hover text-text-secondary hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <XSquare size={13} />
                <span className="hidden lg:inline">Close others</span>
              </button>
              <button
                type="button"
                onClick={closeAll}
                disabled={state.openTabs.length === 0}
                title="Close all"
                className="shrink-0 inline-flex items-center gap-1.5 text-[11px] px-2 py-1 rounded border border-border bg-bg-base hover:bg-bg-hover text-text-secondary hover:text-danger disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <X size={13} />
                <span className="hidden lg:inline">Close all</span>
              </button>
              <span className="ml-auto shrink-0 hidden sm:flex items-center gap-1 text-[11px] text-text-muted">
                <Clock size={11} />
                {formatElapsed(accumulatedMs)}
              </span>
            </div>
          </div>

            {/* Panels */}
            <div className="px-4 lg:px-6 py-5 space-y-4">
            {/* Topic header card */}
            <div className="rounded-lg border border-accent/30 bg-gradient-to-r from-bg-panel to-bg-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-lg font-bold text-text-primary leading-tight">
                        {selectedTopic.title}
                      </h1>
                      {selectedTopic.pattern && (
                        <span className="text-[10.5px] font-mono px-2 py-0.5 rounded-full border border-success/40 bg-success/10 text-success">
                          {selectedTopic.pattern}
                        </span>
                      )}
                      {selectedTopic.difficulty && (
                        <span
                          className={`text-[10.5px] font-mono px-2 py-0.5 rounded-full border ${
                            selectedTopic.difficulty === "Hard"
                              ? "border-danger/40 bg-danger/10 text-danger"
                              : selectedTopic.difficulty === "Medium"
                              ? "border-warning/40 bg-warning/10 text-warning"
                              : "border-success/40 bg-success/10 text-success"
                          }`}
                        >
                          {selectedTopic.difficulty}
                        </span>
                      )}
                    </div>
                    <div className="text-[11.5px] text-text-muted">
                      {selectedTopic.domain} · {topicScore(selectedTopic.id, state.quiz).answered} / {selectedTopic.questions.length} questions answered
                    </div>
                    <div className="text-[12px] text-text-secondary mt-0.5">
                      {Object.values(state.tabsDone[state.selectedTopicId] ?? {}).filter(Boolean).length} / 6 tabs done
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-2 text-[11px] text-text-muted">
                  <Clock size={12} /> {formatElapsed(accumulatedMs)} on topic
                </div>
              </div>
            </div>

            {/* Open panels in panel-stacking order (front-most first) */}
            {state.openTabs.length === 0 && (
              <div className="rounded-lg border border-border bg-bg-card/40 p-8 text-center text-text-muted">
                All tabs closed. Click <strong className="text-accent">Open all</strong> in the tab bar above to bring panels back.
              </div>
            )}

            {panelOrder
              .filter((k) => state.openTabs.includes(k))
              .map((k) => {
                const meta = TABS[k];
                const collapsed = isPanelCollapsed(k);
                return (
                  <div key={k} id={`panel-${k}`}>
                    <Panel
                      tab={meta}
                      title={`${
                        k === "overview"
                          ? "1. Overview"
                          : k === "explanation"
                          ? "2. Explanation"
                          : k === "diagram"
                          ? "3. Diagram"
                          : k === "analogy"
                          ? "4. Real-world Analogy"
                          : k === "code"
                          ? "5. Code Example"
                          : "6. Quiz Time"
                      }`}
                      collapsed={collapsed}
                      onToggleCollapse={() => togglePanelCollapse(k)}
                      onClose={() => closePanel(k)}
                      checked={state.tabsDone[state.selectedTopicId]?.[k] ?? false}
                      onToggleChecked={() =>
                        onTabCheckboxToggle(state.selectedTopicId, k)
                      }
                    >
                      {k === "overview" && <BeginnerPanel topic={selectedTopic} />}
                      {k === "explanation" && <ProblemPanel topic={selectedTopic} />}
                      {k === "diagram" && <ArchitecturePanel topic={selectedTopic} />}
                      {k === "analogy" && <AnalogyPanel topic={selectedTopic} />}
                      {k === "code" && (
                        <>
                          <CodePanel
                            topic={selectedTopic}
                            activeTab={activeCodeTab}
                            setActiveTab={setActiveCodeTab}
                          />
                          <TryItPanel
                            topic={selectedTopic}
                            tryIt={state.tryIt}
                            onAttempt={(questionId, next) => {
                              setState((s) => ({
                                ...s,
                                tryIt: {
                                  ...s.tryIt,
                                  [selectedTopic.id]: {
                                    ...(s.tryIt[selectedTopic.id] ?? {}),
                                    [questionId]: next,
                                  },
                                },
                              }));
                              // Per-question dotted-path patch — merges into
                              // userProgress/{user}/sections/tryit without
                              // clobbering other questions.
                              syncTryIt(
                                {
                                  [`attempts.${selectedTopic.id}.${questionId}`]: next,
                                },
                                500
                              );
                            }}
                          />
                        </>
                      )}
                      {k === "quiz" && (
                        <QuizPanel
                          topic={selectedTopic}
                          quiz={state.quiz}
                          quizMode={quizMode}
                          setQuizMode={setQuizMode}
                          currentQ={currentQ}
                          setCurrentQ={setCurrentQ}
                          showAnswer={showAnswer}
                          setShowAnswer={setShowAnswer}
                          selectedAnswer={selectedAnswer}
                          setSelectedAnswer={setSelectedAnswer}
                          onSubmit={(qIdx, choice, isCorrect) => {
                            setState((s) => ({
                              ...s,
                              quiz: {
                                ...s.quiz,
                                [selectedTopic.id]: {
                                  ...(s.quiz[selectedTopic.id] ?? {}),
                                  [qIdx]: { selected: choice, correct: isCorrect },
                                },
                              },
                            }));
                            // Per-answer dotted-path patch — touches a single field
                            // in userProgress/{user}/sections/quiz, no overwrite.
                            syncQuiz(
                              {
                                [`answers.${selectedTopic.id}.${qIdx}`]: {
                                  selected: choice,
                                  correct: isCorrect,
                                },
                              },
                              500
                            );
                          }}
                          onReset={() => {
                            setState((s) => {
                              const next = { ...s.quiz };
                              delete next[selectedTopic.id];
                              return { ...s, quiz: next };
                            });
                            setCurrentQ(0);
                            setShowAnswer(false);
                            setSelectedAnswer(null);
                            // Clear the topic's bucket on the server too —
                            // overwrite that topic's map with {} so all previous
                            // answers for this topic are gone but other topics stay.
                            syncQuiz(
                              { [`answers.${selectedTopic.id}`]: {} },
                              0
                            );
                          }}
                        />
                      )}
                    </Panel>
                  </div>
                );
              })}

            {/* Previous / Next lesson navigation */}
            <div className="flex items-stretch justify-between gap-3 pt-2">
              <button
                type="button"
                disabled={!prevTopicId}
                onClick={() => prevTopicId && goToTopic(prevTopicId)}
                className="group flex-1 flex items-center gap-2.5 rounded-lg border border-border bg-bg-card/50 px-4 py-3 text-left hover:bg-bg-hover hover:border-accent/40 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-bg-card/50 disabled:hover:border-border transition-colors"
              >
                <ChevronLeft
                  size={18}
                  className="shrink-0 text-text-muted group-hover:text-accent group-disabled:text-text-muted"
                />
                <span className="min-w-0">
                  <span className="block text-[10.5px] uppercase tracking-wide text-text-muted">
                    Previous
                  </span>
                  <span className="block text-[13px] font-medium text-text-primary truncate">
                    {prevTopicId
                      ? topics.find((t) => t.id === prevTopicId)?.title ?? "—"
                      : "Start of course"}
                  </span>
                </span>
              </button>
              <button
                type="button"
                disabled={!nextTopicId}
                onClick={() => nextTopicId && goToTopic(nextTopicId)}
                className="group flex-1 flex items-center justify-end gap-2.5 rounded-lg border border-border bg-bg-card/50 px-4 py-3 text-right hover:bg-bg-hover hover:border-accent/40 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-bg-card/50 disabled:hover:border-border transition-colors"
              >
                <span className="min-w-0">
                  <span className="block text-[10.5px] uppercase tracking-wide text-text-muted">
                    Next
                  </span>
                  <span className="block text-[13px] font-medium text-text-primary truncate">
                    {nextTopicId
                      ? topics.find((t) => t.id === nextTopicId)?.title ?? "—"
                      : "End of course"}
                  </span>
                </span>
                <ChevronRight
                  size={18}
                  className="shrink-0 text-text-muted group-hover:text-accent group-disabled:text-text-muted"
                />
              </button>
            </div>

            <div className="text-[11.5px] text-text-muted px-1 pb-4">
              Tip: click a tab to bring its panel to the top · drag to reorder ·
              click × to close · re-open from the bar. Progress saves automatically.
            </div>
            </div>
          </div>
        </main>

        {/* ====== RIGHT DASHBOARD ====== */}
        <RightSidebar
          collapsed={state.rightCollapsed}
          setCollapsed={(v) => setState((s) => ({ ...s, rightCollapsed: v }))}
          courseSections={courseSections}
          radarData={radarData}
          gScore={gScore}
          xp={xp}
          level={level}
          streak={streak}
          state={state}
          revisions={revisions}
          jumpToTopic={(id) => setState((s) => ({ ...s, selectedTopicId: id }))}
        />
      </div>
    </div>
  );
}

// ============================================================
// Course Switcher — pill row of courses (Course → Section → Topic)
// ============================================================
function CourseSwitcher({
  selectedCourseId,
  onSelect,
}: {
  selectedCourseId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="px-3 pb-3 flex flex-wrap gap-1.5 border-b border-border">
      {courses.map((c) => {
        const Icon = COURSE_ICONS[c.icon] ?? BookOpen;
        const active = c.id === selectedCourseId;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect(c.id)}
            title={c.description ?? c.title}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${
              active
                ? "bg-accent/15 border-accent/40 text-accent"
                : "bg-bg-base border-border text-text-muted hover:text-text-primary hover:bg-bg-hover"
            }`}
          >
            <Icon size={13} className="shrink-0" />
            <span className="truncate">{c.title}</span>
          </button>
        );
      })}
    </div>
  );
}

// ============================================================
// Empty Course Screen — shown for a course whose content isn't authored yet
// ============================================================
function EmptyCourseScreen({
  activeCourse,
  selectedCourseId,
  onSelectCourse,
}: {
  activeCourse: (typeof courses)[number] | undefined;
  selectedCourseId: string;
  onSelectCourse: (id: string) => void;
}) {
  const Icon = activeCourse ? COURSE_ICONS[activeCourse.icon] ?? BookOpen : BookOpen;
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-bg-base text-text-primary px-4">
      <div className="flex flex-col items-center gap-3 text-center max-w-md">
        <div className="w-14 h-14 rounded-xl bg-accent/15 flex items-center justify-center text-accent">
          <Icon size={28} />
        </div>
        <h1 className="text-xl font-semibold">
          {activeCourse?.title ?? "Course"} — content coming soon
        </h1>
        <p className="text-sm text-text-muted">
          {activeCourse?.description ??
            "This course doesn't have any topics yet."}{" "}
          Pick another course to keep learning.
        </p>
      </div>
      <div className="w-full max-w-md rounded-lg border border-border bg-bg-panel/60">
        <CourseSwitcher selectedCourseId={selectedCourseId} onSelect={onSelectCourse} />
      </div>
    </div>
  );
}

// ============================================================
// Left Sidebar
// ============================================================
function LeftSidebar({
  collapsed,
  setCollapsed,
  filteredSections,
  selectedCourseId,
  onSelectCourse,
  expanded,
  setExpanded,
  selectedTopicId,
  setSelectedTopicId,
  visited,
  quiz,
  streak,
  topicDone,
  onTopicCheckboxToggle,
  mobile = false,
  onCloseMobile,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  filteredSections: typeof sections;
  selectedCourseId: string;
  onSelectCourse: (id: string) => void;
  expanded: Record<string, boolean>;
  setExpanded: (id: string) => void;
  selectedTopicId: string;
  setSelectedTopicId: (id: string) => void;
  visited: Record<string, boolean>;
  quiz: QuizState;
  streak: number;
  topicDone: Record<string, boolean>;
  onTopicCheckboxToggle: (topicId: string) => void;
  mobile?: boolean;
  onCloseMobile?: () => void;
}) {
  // Collapsed rail — desktop only (hidden on mobile; the drawer covers mobile).
  if (!mobile && collapsed) {
    return (
      <aside className="hidden lg:flex w-12 flex-shrink-0 border-r border-border bg-bg-panel/60 flex-col">
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          className="tip p-2 m-1 rounded hover:bg-bg-hover text-text-muted hover:text-text-primary"
          data-tip="Expand sidebar"
          aria-label="Expand sidebar"
        >
          <PanelLeftOpen size={16} />
        </button>
        <div className="flex-1 overflow-y-auto py-2">
          {filteredSections.map((sec, i) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => setCollapsed(false)}
              className="tip w-10 h-10 mx-1 my-1 rounded flex items-center justify-center hover:bg-bg-hover text-text-muted hover:text-text-primary"
              data-tip={sec.title}
              aria-label={sec.title}
            >
              <span className="text-[12px] font-mono">{i + 1}</span>
            </button>
          ))}
        </div>
        <div className="p-2 border-t border-border">
          <div className="tip w-8 h-8 mx-auto rounded-full bg-accent/15 flex items-center justify-center text-accent" data-tip={`${streak}-day streak`}>
            <Flame size={14} />
          </div>
        </div>
      </aside>
    );
  }
  // Shared content used by both the desktop panel and the mobile drawer.
  const body = (
    <>
      <CourseSwitcher selectedCourseId={selectedCourseId} onSelect={onSelectCourse} />

      <nav className="flex-1">
        {filteredSections.map((sec) => {
          const pct = sectionProgressPct(sec.id, visited);
          const isExpanded = expanded[sec.id] ?? false;
          return (
            <div key={sec.id} className="px-2">
              <button
                type="button"
                onClick={() => setExpanded(sec.id)}
                className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-md hover:bg-bg-hover text-left group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {isExpanded ? (
                    <ChevronDown size={14} className="text-text-muted shrink-0" />
                  ) : (
                    <ChevronRight size={14} className="text-text-muted shrink-0" />
                  )}
                  <span className="text-sm font-medium truncate">{sec.title}</span>
                </div>
                <span
                  className={`text-[11px] font-mono px-1.5 py-0.5 rounded ${
                    pct === 100
                      ? "bg-success/20 text-success"
                      : pct > 0
                      ? "bg-accent/15 text-accent"
                      : "bg-bg-base text-text-muted"
                  }`}
                >
                  {pct}%
                </span>
              </button>
              {isExpanded && (
                <ul className="ml-2 my-1 border-l border-border pl-2">
                  {sec.topicIds.map((tid) => {
                    const t = topics.find((x) => x.id === tid);
                    if (!t) return null;
                    const isActive = selectedTopicId === tid;
                    const v = visited[tid];
                    const score = topicScore(tid, quiz);
                    return (
                      <li key={tid}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTopicId(tid);
                            onCloseMobile?.();
                          }}
                          className={`w-full text-left flex items-center gap-1.5 px-3 py-1.5 my-0.5 rounded text-[13px] transition-colors ${
                            isActive
                              ? "bg-accent/15 text-accent font-medium"
                              : "text-text-secondary hover:bg-bg-hover hover:text-text-primary"
                          }`}
                        >
                          <ManualCheckbox
                            checked={topicDone[tid] ?? false}
                            onChange={() => onTopicCheckboxToggle(tid)}
                            ariaLabel={`Mark ${t.shortLabel} done`}
                          />
                          {v ? (
                            <CheckCircle2 size={13} className={isActive ? "text-accent" : "text-success"} />
                          ) : (
                            <Circle size={13} className="text-text-muted" />
                          )}
                          <span className="truncate flex-1">{t.shortLabel}</span>
                          {score.answered > 0 && (
                            <span className="text-[10px] font-mono text-text-muted">
                              {score.correct}/{score.answered}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      <div className="m-4 mt-3 p-4 rounded-lg bg-gradient-to-br from-orange-500/15 to-red-500/10 border border-accent/30">
        <div className="flex items-center gap-2 mb-1">
          <Flame size={18} className="text-accent" />
          <div className="text-sm font-semibold">{streak} Day Streak!</div>
        </div>
        <div className="text-[11px] text-text-secondary">
          {streak > 0 ? "Keep it up — come back tomorrow." : "Visit a topic today to start a streak."}
        </div>
      </div>
    </>
  );

  // Mobile: full-screen drawer with a close button in the top-right corner.
  if (mobile) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-bg-base lg:hidden">
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Brain size={18} className="text-accent" />
            <span className="text-sm font-semibold text-text-primary">Course Content</span>
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            className="p-2 rounded-md hover:bg-bg-hover text-text-muted hover:text-text-primary"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto flex flex-col">{body}</div>
      </div>
    );
  }

  // Desktop expanded panel (hidden on mobile).
  return (
    <aside className="hidden lg:flex w-72 flex-shrink-0 border-r border-border bg-bg-panel/60 overflow-y-auto flex-col">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="text-[11px] uppercase tracking-wide text-text-muted">Course Content</div>
        <button
          type="button"
          onClick={() => setCollapsed(true)}
          className="tip p-1 rounded hover:bg-bg-hover text-text-muted hover:text-text-primary"
          data-tip="Collapse sidebar"
          aria-label="Collapse sidebar"
        >
          <PanelLeftClose size={14} />
        </button>
      </div>
      {body}
    </aside>
  );
}

// ============================================================
// Right Sidebar
// ============================================================
function RightSidebar({
  collapsed,
  setCollapsed,
  courseSections,
  radarData,
  gScore,
  xp,
  level,
  streak,
  state,
  revisions,
  jumpToTopic,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  courseSections: typeof sections;
  radarData: { domain: string; score: number }[];
  gScore: { correct: number; total: number };
  xp: number;
  level: number;
  streak: number;
  state: AppState;
  revisions: { topic: Topic; pct: number | null; answered: number }[];
  jumpToTopic: (id: string) => void;
}) {
  if (collapsed) {
    return (
      <aside className="hidden lg:flex w-12 flex-shrink-0 border-l border-border bg-bg-panel/60 flex-col">
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          className="tip p-2 m-1 rounded hover:bg-bg-hover text-text-muted hover:text-text-primary"
          data-tip="Expand dashboard"
          aria-label="Expand dashboard"
        >
          <PanelRightOpen size={16} />
        </button>
        <div className="flex-1 flex flex-col items-center gap-2 py-2">
          <div className="tip p-2 rounded bg-bg-card/60 text-accent" data-tip="Domain strength"><TrendingUp size={14} /></div>
          <div className="tip p-2 rounded bg-bg-card/60 text-accent" data-tip={`Global score ${gScore.correct}/${gScore.total}`}><Trophy size={14} /></div>
          <div className="tip p-2 rounded bg-bg-card/60 text-accent" data-tip={`${xp} XP · Level ${level}`}><Star size={14} /></div>
          <div className="tip p-2 rounded bg-bg-card/60 text-accent" data-tip={`${streak}-day streak`}><Flame size={14} /></div>
        </div>
      </aside>
    );
  }
  return (
    <aside className="hidden lg:block w-80 flex-shrink-0 border-l border-border bg-bg-panel/60 overflow-y-auto">
      <div className="p-4 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">Your Performance</div>
            <div className="text-[11px] text-text-muted">Today</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-[11px] text-accent px-2 py-1 rounded bg-accent/10 border border-accent/30">Today</div>
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              className="tip p-1 rounded hover:bg-bg-hover text-text-muted hover:text-text-primary"
              data-tip="Collapse dashboard"
              aria-label="Collapse dashboard"
            >
              <PanelRightClose size={14} />
            </button>
          </div>
        </div>

        {/* Radar chart */}
        <div className="rounded-md border border-border bg-bg-card/50 p-3">
          <div className="text-xs text-text-muted mb-1">Domain Strength</div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="75%">
                <PolarGrid stroke="#232D3C" />
                <PolarAngleAxis dataKey="domain" tick={{ fill: "#94A2B5", fontSize: 10 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#5D6C80", fontSize: 9 }} axisLine={false} />
                <Radar name="Score" dataKey="score" stroke="#7C8CF8" fill="#7C8CF8" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Topic completion */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-text-secondary">Topic Completion</div>
          {courseSections.map((sec) => {
            const pct = sectionProgressPct(sec.id, state.visited);
            return (
              <div key={sec.id}>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-text-secondary truncate">{sec.title}</span>
                  <span className="font-mono text-text-muted">{pct}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-bg-base/60 overflow-hidden">
                  <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Recommended Revisions */}
        <div className="rounded-md border border-border bg-bg-card/50 p-3 space-y-2">
          <div className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
            <TrendingUp size={12} className="text-accent" />
            Recommended Revision Topics
          </div>
          {revisions.length === 0 ? (
            <div className="text-[11px] text-text-muted italic">
              Take a few quizzes — we'll highlight your weakest topics here.
            </div>
          ) : (
            revisions.map(({ topic, pct }, i) => (
              <button
                type="button"
                key={topic.id}
                onClick={() => jumpToTopic(topic.id)}
                className="w-full text-left flex items-start gap-2 p-2 rounded hover:bg-bg-hover"
              >
                <div className="w-5 h-5 rounded-full bg-accent/20 text-accent text-[10px] font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <div className="min-w-0">
                  <div className="text-[12px] text-text-primary truncate">{topic.shortLabel}</div>
                  <div className="text-[10.5px] text-text-muted">
                    Scored {pct ?? 0}% — review {topic.domain.toLowerCase()} concepts
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* XP card */}
        <div className="rounded-md border border-border bg-bg-card/50 p-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-[11px] text-text-muted">XP Points</div>
              <div className="text-xl font-bold text-text-primary">{xp.toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-text-muted">Level {level}</div>
              <div className="text-[10px] text-text-muted">
                Next: {nextLevelXp(level).toLocaleString()} XP
              </div>
            </div>
          </div>
          <div className="h-2 w-full rounded-full bg-bg-base/60 overflow-hidden">
            <div
              className="h-full rounded-full bg-accent"
              style={{
                width: `${Math.min(
                  100,
                  ((xp - nextLevelXp(level - 1)) /
                    (nextLevelXp(level) - nextLevelXp(level - 1))) *
                    100
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Streak + Rank */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-md border border-border bg-bg-card/50 p-3 text-center">
            <Flame size={18} className="text-accent mx-auto mb-1" />
            <div className="text-sm font-bold">{streak}</div>
            <div className="text-[10px] text-text-muted">Day Streak</div>
          </div>
          <div className="rounded-md border border-border bg-bg-card/50 p-3 text-center">
            <Trophy size={18} className="text-accent mx-auto mb-1" />
            <div className="text-sm font-bold">
              {gScore.total
                ? Math.round((gScore.correct / gScore.total) * 100) >= 80
                  ? "Top 18%"
                  : Math.round((gScore.correct / gScore.total) * 100) >= 50
                  ? "Top 40%"
                  : "Newcomer"
                : "Newcomer"}
            </div>
            <div className="text-[10px] text-text-muted">Rank</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ============================================================
// Beginner Panel — structured layout with TL;DR + subtopics + side card
// ============================================================
function BeginnerPanel({ topic }: { topic: Topic }) {
  const { tldr, subtopics } = deriveBeginnerStructure(topic);

  const quickRef =
    topic.quickReference ?? {
      title: `What is ${topic.shortLabel}?`,
      icon: "💡",
      bullets: subtopics.flatMap((s) => s.bullets.slice(0, 2).map((b) => b.text)).slice(0, 5),
      analogyBrief: topic.analogy.split(".").slice(0, 1).join(".") + ".",
    };

  const keyFacts =
    topic.keyFacts ?? [
      { label: "Domain", value: topic.domain, icon: "🎯" },
      { label: "Section", value: topic.section, icon: "📚" },
      { label: "Questions", value: `${topic.questions.length} hard exam-style`, icon: "❓" },
      { label: "Service Type", value: topic.domain === "Identity" || topic.domain === "Security" ? "Global" : "Regional (most)", icon: "🌍" },
    ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
      <div className="space-y-4">
        {/* TL;DR */}
        <div className="tldr-callout">
          <div className="text-[11px] uppercase tracking-wide text-accent font-semibold mb-1">TL;DR</div>
          <p className="text-[14px] leading-relaxed text-text-primary">{tldr}</p>
        </div>

        {/* Subtopics */}
        <div className="space-y-4">
          {subtopics.map((sub, i) => (
            <div key={i}>
              <h4 className="text-[14px] font-semibold text-text-primary mb-2">{sub.heading}</h4>
              <ul className="space-y-1.5">
                {sub.bullets.map((b, j) => (
                  <li key={j} className="flex items-start gap-2 text-[13.5px] leading-relaxed text-text-secondary">
                    <span className="text-accent select-none mt-0.5 shrink-0">
                      {b.icon}
                    </span>
                    <span>{renderBold(b.text, `${i}-${j}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Key facts grid */}
        <div>
          <h4 className="text-[12px] uppercase tracking-wide text-text-muted font-semibold mb-2">Key Facts</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {keyFacts.map((f, i) => (
              <div key={i} className="rounded-md border border-border bg-bg-card/40 px-3 py-2 flex items-center gap-3">
                <span className="text-lg">{f.icon ?? "📌"}</span>
                <div className="min-w-0">
                  <div className="text-[10.5px] uppercase tracking-wide text-text-muted">{f.label}</div>
                  <div className="text-[12.5px] text-text-primary font-medium truncate">{f.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Side: Quick Reference */}
      <aside className="rounded-md border border-accent/30 bg-accent/[0.06] p-4 h-fit lg:sticky lg:top-[96px]">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{quickRef.icon ?? "💡"}</span>
          <h4 className="text-[13px] font-semibold text-accent">{quickRef.title}</h4>
        </div>
        <ul className="space-y-1.5 mb-3">
          {quickRef.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-[12.5px] text-text-secondary leading-relaxed">
              <span className="text-accent select-none mt-1 shrink-0">▸</span>
              <span>{renderBold(b, `qr-${i}`)}</span>
            </li>
          ))}
        </ul>
        {quickRef.analogyBrief && (
          <div className="text-[11.5px] text-text-muted italic border-t border-border pt-2">
            {quickRef.analogyBrief}
          </div>
        )}
      </aside>
    </div>
  );
}

// ============================================================
// Other panels
// ============================================================
function AnalogyPanel({ topic }: { topic: Topic }) {
  return (
    <div className="rounded-md bg-purple-500/[0.06] border border-purple-500/20 p-4">
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb size={16} className="text-purple-400" />
        <span className="text-[12px] uppercase tracking-wide text-purple-400 font-semibold">
          Think of it like…
        </span>
      </div>
      <p className="text-[14px] leading-relaxed text-text-primary whitespace-pre-line">{topic.analogy}</p>
    </div>
  );
}

function ArchitecturePanel({ topic }: { topic: Topic }) {
  return (
    <div className="space-y-3">
      {hasDsaDiagram(topic.diagramComponent) ? (
        <DsaDiagram name={topic.diagramComponent} />
      ) : (
        <div
          className="diagram-container rounded-md bg-bg-base/50 p-3 border border-border overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: topic.diagram }}
        />
      )}
      {topic.diagramLegend && topic.diagramLegend.length > 0 && (
        <div className="rounded-md border border-border bg-bg-card/40 p-3">
          <div className="text-[11px] uppercase tracking-wide text-text-muted mb-2 font-semibold">Legend</div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5">
            {topic.diagramLegend.map((l, i) => (
              <li key={i} className="flex items-start gap-2 text-[12.5px]">
                <span className="w-3 h-3 rounded-sm mt-1 shrink-0" style={{ background: l.color }} />
                <div>
                  <span className="text-text-primary font-medium">{l.label}</span>
                  <span className="text-text-muted"> — {l.description}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// JavaScript (Web Worker), Python (Pyodide) and SQL (sql.js / SQLite) run
// in-browser. Everything else is display-only (no Run button).
function runnableLang(
  language: string
): "javascript" | "python" | "sql" | null {
  const l = language.toLowerCase();
  if (l === "javascript" || l === "js" || l === "node" || l === "nodejs")
    return "javascript";
  if (l === "python" || l === "py" || l === "python3") return "python";
  if (l === "sql" || l === "sqlite" || l === "mysql") return "sql";
  return null;
}

function ResultTable({
  table,
}: {
  table: NonNullable<RunResult["table"]>;
}) {
  return (
    <div className="overflow-auto rounded border border-border">
      <table className="w-full border-collapse text-[12px]">
        <thead>
          <tr className="bg-bg-base/60">
            {table.columns.map((c, i) => (
              <th
                key={i}
                className="text-left font-semibold text-accent px-2.5 py-1.5 border-b border-border whitespace-nowrap"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.length === 0 && (
            <tr>
              <td
                colSpan={table.columns.length}
                className="px-2.5 py-2 text-text-muted italic"
              >
                (0 rows)
              </td>
            </tr>
          )}
          {table.rows.map((row, r) => (
            <tr key={r} className="odd:bg-white/[0.02]">
              {row.map((cell, c) => (
                <td
                  key={c}
                  className="px-2.5 py-1.5 border-b border-border/50 text-text-primary whitespace-nowrap"
                >
                  {cell === null ? (
                    <span className="text-text-muted italic">NULL</span>
                  ) : (
                    String(cell)
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RunOutput({
  output,
  label = "Output",
}: {
  output: RunResult;
  label?: string;
}) {
  const empty =
    !output.stdout &&
    !output.stderr &&
    !output.error &&
    output.result == null &&
    !output.table;
  return (
    <div className="rounded-md border border-border bg-[#080B10] overflow-hidden animate-fade-in">
      <div className="px-3 py-1.5 border-b border-border bg-bg-base/40 text-[11px] uppercase tracking-wide text-text-muted">
        {output.table
          ? `Result · ${output.table.rows.length} row${
              output.table.rows.length === 1 ? "" : "s"
            }`
          : label}
      </div>
      <div className="p-3 font-mono text-[12.5px] leading-relaxed whitespace-pre-wrap max-h-72 overflow-auto">
        {empty && <span className="text-text-muted italic">(no output)</span>}
        {output.table && <ResultTable table={output.table} />}
        {output.stdout && <div className="text-text-primary">{output.stdout}</div>}
        {output.stderr && <div className="text-yellow-400">{output.stderr}</div>}
        {output.result != null && (
          <div className="text-accent">⇒ {output.result}</div>
        )}
        {output.error && (
          <div className="mt-1 flex items-start gap-1.5 text-danger">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <span>{output.error}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Editable code editor (textarea + line gutter). Used for runnable code
// examples and Try-it exercises so learners can tweak and re-run. Tab inserts
// two spaces; Ctrl/⌘+Enter runs. No live syntax highlight while editing (same
// tradeoff as the /playground editor).
function EditableCodeEditor({
  language,
  title,
  value,
  original,
  onChange,
  onReset,
  onRun,
  running,
}: {
  language: string;
  title?: string;
  value: string;
  original?: string;
  onChange: (v: string) => void;
  onReset?: () => void;
  onRun?: () => void;
  running?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const gutterRef = useRef<HTMLDivElement>(null);
  const lineCount = value.split("\n").length;
  const dirty = original != null && value !== original;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      if (onRun && !running) onRun();
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const el = e.currentTarget;
      const s = el.selectionStart;
      const en = el.selectionEnd;
      const next = value.slice(0, s) + "  " + value.slice(en);
      onChange(next);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = s + 2;
      });
    }
  };

  return (
    <div className="rounded-md border border-border bg-[#0d1117] overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-bg-base/40 border-b border-border">
        <div className="flex items-center gap-2 text-[11px] text-text-muted min-w-0">
          <span className="font-mono px-1.5 py-0.5 rounded bg-bg-base border border-border text-accent shrink-0">
            {language.toUpperCase()}
          </span>
          {title && <span className="truncate">{title}</span>}
          <span className="text-text-muted/50 shrink-0 hidden sm:inline">· editable</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {dirty && onReset && (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1 text-[11px] text-text-muted hover:text-text-primary px-2 py-1 rounded hover:bg-bg-hover"
              aria-label="Reset code"
            >
              <RotateCcw size={12} /> Reset
            </button>
          )}
          <button
            type="button"
            onClick={onCopy}
            className="flex items-center gap-1 text-[11px] text-text-muted hover:text-text-primary px-2 py-1 rounded hover:bg-bg-hover"
            aria-label="Copy code"
          >
            {copied ? (
              <>
                <Check size={12} className="text-success" /> Copied
              </>
            ) : (
              <>
                <Copy size={12} /> Copy
              </>
            )}
          </button>
        </div>
      </div>
      <div className="flex max-h-72 overflow-auto font-mono text-[12.5px] leading-[1.7]">
        <div
          ref={gutterRef}
          aria-hidden
          className="select-none py-2 pl-3 pr-2 text-right text-text-muted/50 border-r border-border/40 bg-bg-base/30"
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onScroll={(e) => {
            if (gutterRef.current)
              gutterRef.current.scrollTop = e.currentTarget.scrollTop;
          }}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          wrap="off"
          rows={Math.min(Math.max(lineCount, 3), 16)}
          className="flex-1 min-w-0 resize-none bg-transparent text-text-primary outline-none py-2 px-3 leading-[1.7] whitespace-pre overflow-auto"
        />
      </div>
    </div>
  );
}

// ============================================================
// RunControls — Run button + output for ONE code example.
// JS/Python execute in-browser; non-runnable langs (Java) show their
// `expectedOutput` as a reference result instead. Reused by ApproachPanel.
// ============================================================
function RunControls({ example }: { example: CodeExample }) {
  const runLang = runnableLang(example.language);
  const [running, setRunning] = useState(false);
  const [pyLoading, setPyLoading] = useState(false);
  const [output, setOutput] = useState<RunResult | null>(null);
  const [showExpected, setShowExpected] = useState(false);

  // Clear stale output whenever the shown example changes.
  useEffect(() => {
    setOutput(null);
    setShowExpected(false);
  }, [example.code, example.language]);

  const onRun = useCallback(async () => {
    if (!runLang) return;
    setRunning(true);
    setOutput(null);
    try {
      if (runLang === "javascript") {
        setOutput(await runJavaScript(example.code));
      } else {
        const cold = !isPyodideReady();
        if (cold) setPyLoading(true);
        try {
          setOutput(await runPython(example.code));
        } finally {
          if (cold) setPyLoading(false);
        }
      }
    } catch (err) {
      setOutput({
        stdout: "",
        stderr: "",
        error: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setRunning(false);
    }
  }, [runLang, example.code]);

  // Non-runnable language (Java): offer its expected output as a reference.
  if (!runLang) {
    if (!example.expectedOutput) return null;
    return (
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowExpected((v) => !v)}
            className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold px-3.5 py-1.5 rounded-md border border-border bg-bg-base hover:bg-bg-hover text-text-secondary hover:text-text-primary"
          >
            <Terminal size={14} />{" "}
            {showExpected ? "Hide expected output" : "Show expected output"}
          </button>
          <span className="text-[11px] text-text-muted">
            {example.language.toUpperCase()} runs via a backend judge in the full
            app — reference output shown here
          </span>
        </div>
        {showExpected && (
          <RunOutput
            output={{ stdout: example.expectedOutput, stderr: "" }}
            label="Expected output"
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onRun}
          disabled={running}
          className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold px-3.5 py-1.5 rounded-md bg-accent text-bg-base hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {running ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Running…
            </>
          ) : (
            <>
              <Play size={14} /> Run{" "}
              {runLang === "python" ? "Python" : "JavaScript"}
            </>
          )}
        </button>
        {output && !running && (
          <button
            type="button"
            onClick={() => setOutput(null)}
            className="text-[11.5px] px-2.5 py-1 rounded-md border border-border bg-bg-base hover:bg-bg-hover text-text-secondary hover:text-text-primary"
          >
            Clear output
          </button>
        )}
        <span className="text-[11px] text-text-muted">
          Runs in your browser ·{" "}
          {runLang === "python" ? "Pyodide (WASM)" : "sandboxed Web Worker"}
        </span>
      </div>
      {output && <RunOutput output={output} />}
      {pyLoading && <CenterLoader label="Setting up Python runtime…" />}
    </div>
  );
}

// A single Time/Space complexity pill.
function ComplexityBadge({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11.5px] font-mono px-2.5 py-1 rounded-md border border-border bg-bg-base">
      <span className="uppercase tracking-wide text-text-muted">{label}</span>
      <span className="text-text-primary font-semibold">{value}</span>
    </span>
  );
}

const APPROACH_ACCENT: Record<string, string> = {
  "brute-force": "text-danger border-danger/40 bg-danger/10",
  intermediate: "text-warning border-warning/40 bg-warning/10",
  optimal: "text-success border-success/40 bg-success/10",
  variant: "text-accent border-accent/40 bg-accent/10",
};

// ============================================================
// ApproachPanel — Brute → Intermediate → Optimal explorer for DSA problems.
// Outer tabs = approaches; inner tabs = languages (Java/JS/Python).
// ============================================================
function ApproachPanel({ topic }: { topic: Topic }) {
  const approaches = topic.approaches ?? [];
  const [approachIdx, setApproachIdx] = useState(0);
  const [langIdx, setLangIdx] = useState(0);

  // Reset selection whenever the topic changes so indices never dangle.
  useEffect(() => {
    setApproachIdx(0);
    setLangIdx(0);
  }, [topic.id]);

  const approach = approaches[Math.min(approachIdx, approaches.length - 1)];
  if (!approach) return null;
  const langs = approach.code;
  const ex = langs[Math.min(langIdx, langs.length - 1)];

  return (
    <div className="space-y-4">
      {/* Outer: approach selector */}
      <div className="flex flex-wrap items-center gap-1.5">
        {approaches.map((a, i) => {
          const active = i === approachIdx;
          const accent = APPROACH_ACCENT[a.kind ?? "variant"];
          return (
            <button
              key={i}
              type="button"
              onClick={() => {
                setApproachIdx(i);
                setLangIdx(0);
              }}
              className={`text-[12.5px] font-medium px-3 py-1.5 rounded-md border transition-colors ${
                active
                  ? accent
                  : "border-border text-text-muted hover:text-text-primary hover:bg-bg-hover"
              }`}
            >
              {a.name}
            </button>
          );
        })}
      </div>

      {/* Complexity badges */}
      <div className="flex flex-wrap items-center gap-2">
        <ComplexityBadge label="Time" value={approach.complexity.time} />
        <ComplexityBadge label="Space" value={approach.complexity.space} />
      </div>

      {/* Idea */}
      <p className="text-[13.5px] leading-relaxed text-text-secondary">
        {renderBold(approach.idea, `idea-${approachIdx}`)}
      </p>

      {/* Variants */}
      {approach.variants && approach.variants.length > 0 && (
        <div className="rounded-md border border-border bg-bg-card/40 p-3">
          <div className="text-[11px] uppercase tracking-wide text-text-muted mb-1.5 font-semibold">
            Variants
          </div>
          <ul className="space-y-1">
            {approach.variants.map((v, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-[12.5px] text-text-secondary"
              >
                <span className="text-accent select-none mt-0.5 shrink-0">→</span>
                <span>{renderBold(v, `var-${approachIdx}-${i}`)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Inner: language selector */}
      {langs.length > 1 && (
        <div className="flex items-center gap-1 border-b border-border">
          {langs.map((e, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setLangIdx(i)}
              className={`px-3 py-1.5 text-[12px] rounded-t-md border-t border-l border-r transition-colors ${
                i === Math.min(langIdx, langs.length - 1)
                  ? "border-border bg-[#080B10] text-accent"
                  : "border-transparent text-text-muted hover:text-text-primary"
              }`}
            >
              {e.tab ?? e.language.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      <CodeBlock example={ex} />
      <RunControls example={ex} />
    </div>
  );
}

function CodePanel({
  topic,
  activeTab,
  setActiveTab,
}: {
  topic: Topic;
  activeTab: number;
  setActiveTab: (n: number) => void;
}) {
  // DSA problems expose Brute → Intermediate → Optimal solutions; render the
  // multi-approach explorer instead of the single-example flow.
  if (topic.approaches && topic.approaches.length > 0) {
    return <ApproachPanel topic={topic} />;
  }

  const examples: CodeExample[] = topic.codeExamples ?? [topic.codeExample];
  const idx = Math.min(activeTab, examples.length - 1);
  const ex = examples[idx];
  const runLang = runnableLang(ex.language);

  const [running, setRunning] = useState(false);
  const [pyLoading, setPyLoading] = useState(false);
  const [sqlLoading, setSqlLoading] = useState(false);
  const [output, setOutput] = useState<RunResult | null>(null);
  // Per-tab edited code (learners can tweak runnable examples and re-run).
  const [editedCode, setEditedCode] = useState<Record<number, string>>({});

  const currentCode = editedCode[idx] ?? ex.code;

  // Clear stale output when the shown example changes; drop edits on topic switch.
  useEffect(() => {
    setOutput(null);
  }, [topic.id, idx]);
  useEffect(() => {
    setEditedCode({});
  }, [topic.id]);

  const onRun = useCallback(async () => {
    if (!runLang) return;
    const code = editedCode[idx] ?? ex.code;
    setRunning(true);
    setOutput(null);
    try {
      if (runLang === "javascript") {
        setOutput(await runJavaScript(code));
      } else if (runLang === "sql") {
        // Show the modal loader only for sql.js's one-time cold start.
        const cold = !isSqlReady();
        if (cold) setSqlLoading(true);
        try {
          setOutput(await runSql(code, ex.setup));
        } finally {
          if (cold) setSqlLoading(false);
        }
      } else {
        // Show the modal loader only for Pyodide's one-time cold start.
        const cold = !isPyodideReady();
        if (cold) setPyLoading(true);
        try {
          setOutput(await runPython(code));
        } finally {
          if (cold) setPyLoading(false);
        }
      }
    } catch (err) {
      setOutput({
        stdout: "",
        stderr: "",
        error: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setRunning(false);
    }
  }, [runLang, editedCode, idx, ex.code, ex.setup]);

  return (
    <div className="space-y-2">
      {examples.length > 1 && (
        <div className="flex items-center gap-1 border-b border-border">
          {examples.map((e, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveTab(i)}
              className={`px-3 py-1.5 text-[12px] rounded-t-md border-t border-l border-r transition-colors ${
                i === idx
                  ? "border-border bg-[#080B10] text-accent"
                  : "border-transparent text-text-muted hover:text-text-primary"
              }`}
            >
              {e.tab ?? e.language.toUpperCase()}
            </button>
          ))}
        </div>
      )}
      {runLang ? (
        <EditableCodeEditor
          language={ex.language}
          title={ex.title}
          value={currentCode}
          original={ex.code}
          onChange={(v) => setEditedCode((m) => ({ ...m, [idx]: v }))}
          onReset={() =>
            setEditedCode((m) => {
              const n = { ...m };
              delete n[idx];
              return n;
            })
          }
          onRun={onRun}
          running={running}
        />
      ) : (
        <CodeBlock example={ex} />
      )}

      {runLang && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onRun}
            disabled={running}
            className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold px-3.5 py-1.5 rounded-md bg-accent text-bg-base hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {running ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Running…
              </>
            ) : (
              <>
                <Play size={14} /> Run{" "}
                {runLang === "python"
                  ? "Python"
                  : runLang === "sql"
                    ? "SQL"
                    : "JavaScript"}
              </>
            )}
          </button>
          {output && !running && (
            <button
              type="button"
              onClick={() => setOutput(null)}
              className="text-[11.5px] px-2.5 py-1 rounded-md border border-border bg-bg-base hover:bg-bg-hover text-text-secondary hover:text-text-primary"
            >
              Clear output
            </button>
          )}
          <span className="text-[11px] text-text-muted">
            Runs in your browser ·{" "}
            {runLang === "python"
              ? "Pyodide (WASM)"
              : runLang === "sql"
                ? "SQLite (sql.js / WASM)"
                : "sandboxed Web Worker"}
          </span>
        </div>
      )}

      {output && <RunOutput output={output} />}

      {pyLoading && <CenterLoader label="Setting up Python runtime…" />}
      {sqlLoading && <CenterLoader label="Setting up SQL runtime…" />}
    </div>
  );
}

// ============================================================
// Difficulty pill — shared by the quiz header and Try-it exercises.
// ============================================================
function DifficultyPill({ level }: { level: "easy" | "medium" | "hard" }) {
  const styles: Record<string, string> = {
    easy: "bg-green-500/15 text-green-400 border-green-500/30",
    medium: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    hard: "bg-red-500/15 text-red-400 border-red-500/30",
  };
  return (
    <span
      className={`text-[10px] uppercase tracking-wide font-semibold px-1.5 py-0.5 rounded border ${styles[level]}`}
    >
      {level}
    </span>
  );
}

// ============================================================
// Try-it — one hands-on SQL exercise: editable query, its own Run button,
// result table, and result-based correctness feedback. Attempt state is
// tracked per question (attempted / solved) via onAttempt.
// ============================================================
function TryItCard({
  question,
  index,
  status,
  onAttempt,
}: {
  question: TryItQuestion;
  index: number;
  status: { attempted: boolean; solved: boolean } | undefined;
  onAttempt: (questionId: string, next: { attempted: boolean; solved: boolean }) => void;
}) {
  const [code, setCode] = useState(question.starter);
  const [output, setOutput] = useState<RunResult | null>(null);
  const [correct, setCorrect] = useState<boolean | undefined>(undefined);
  const [running, setRunning] = useState(false);
  const [sqlLoading, setSqlLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Reset the editor when navigating to a different question in the same slot.
  useEffect(() => {
    setCode(question.starter);
    setOutput(null);
    setCorrect(undefined);
    setShowHint(false);
  }, [question.id, question.starter]);

  const solved = status?.solved ?? false;
  const attempted = status?.attempted ?? false;

  const onRun = useCallback(async () => {
    setRunning(true);
    setOutput(null);
    setCorrect(undefined);
    const cold = !isSqlReady();
    if (cold) setSqlLoading(true);
    try {
      const res = await runSqlChecked(code, {
        setup: question.setup,
        solution: question.solution,
        orderMatters: question.orderMatters,
      });
      setOutput(res);
      setCorrect(res.correct);
      // Attempted flips true on any run; solved stays sticky once achieved.
      onAttempt(question.id, {
        attempted: true,
        solved: solved || res.correct === true,
      });
    } catch (err) {
      setOutput({
        stdout: "",
        stderr: "",
        error: err instanceof Error ? err.message : String(err),
      });
    } finally {
      if (cold) setSqlLoading(false);
      setRunning(false);
    }
  }, [code, question, solved, onAttempt]);

  return (
    <div
      className={`rounded-lg border p-4 space-y-3 ${
        solved
          ? "border-green-500/30 bg-green-500/[0.04]"
          : "border-border bg-bg-card/40"
      }`}
    >
      {/* Prompt row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 min-w-0">
          <span className="shrink-0 w-6 h-6 rounded-full bg-accent/15 border border-accent/30 text-accent text-[12px] font-semibold flex items-center justify-center">
            {index + 1}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <DifficultyPill level={question.difficulty} />
              {solved ? (
                <span className="inline-flex items-center gap-1 text-[11px] text-green-400 font-medium">
                  <CheckCircle2 size={13} /> Solved
                </span>
              ) : attempted ? (
                <span className="inline-flex items-center gap-1 text-[11px] text-yellow-400 font-medium">
                  <Circle size={13} /> Attempted
                </span>
              ) : (
                <span className="text-[11px] text-text-muted">Not attempted</span>
              )}
            </div>
            <p className="text-[13.5px] text-text-primary mt-1.5 leading-relaxed">
              {renderBold(question.prompt)}
            </p>
          </div>
        </div>
      </div>

      {question.hint && (
        <div className="pl-8">
          <button
            type="button"
            onClick={() => setShowHint((s) => !s)}
            className="text-[11.5px] text-accent hover:underline"
          >
            {showHint ? "Hide hint" : "Show hint"}
          </button>
          {showHint && (
            <div className="mt-1 text-[12px] text-text-secondary bg-bg-base/50 border border-border rounded px-2.5 py-1.5">
              {renderBold(question.hint)}
            </div>
          )}
        </div>
      )}

      <div className="pl-8 space-y-2">
        <EditableCodeEditor
          language="sql"
          value={code}
          original={question.starter}
          onChange={setCode}
          onReset={() => setCode(question.starter)}
          onRun={onRun}
          running={running}
        />

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onRun}
            disabled={running}
            className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold px-3.5 py-1.5 rounded-md bg-accent text-bg-base hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {running ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Running…
              </>
            ) : (
              <>
                <Play size={14} /> Run &amp; Check
              </>
            )}
          </button>
          {correct === true && (
            <span className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-green-400">
              <CheckCircle2 size={15} /> Correct — your result matches the expected report.
            </span>
          )}
          {correct === false && (
            <span className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-yellow-400">
              <AlertCircle size={15} /> Not quite — the rows don&apos;t match yet. Keep tweaking.
            </span>
          )}
        </div>

        {output && <RunOutput output={output} />}
      </div>

      {sqlLoading && <CenterLoader label="Setting up SQL runtime…" />}
    </div>
  );
}

function TryItPanel({
  topic,
  tryIt,
  onAttempt,
}: {
  topic: Topic;
  tryIt: TryItState;
  onAttempt: (questionId: string, next: { attempted: boolean; solved: boolean }) => void;
}) {
  const questions = topic.tryIt ?? [];
  if (!questions.length) return null;

  const byTopic = tryIt[topic.id] ?? {};
  const solvedCount = questions.filter((q) => byTopic[q.id]?.solved).length;
  const attemptedCount = questions.filter((q) => byTopic[q.id]?.attempted).length;

  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-accent" />
          <h3 className="text-[15px] font-semibold text-text-primary">
            Try it yourself
          </h3>
        </div>
        <div className="text-[11.5px] text-text-muted">
          {solvedCount} solved · {attemptedCount}/{questions.length} attempted
        </div>
      </div>
      <p className="text-[12.5px] text-text-muted -mt-1">
        Write and run each query in its own editor. Progress is saved as you go.
      </p>
      {questions.map((q, i) => (
        <TryItCard
          key={q.id}
          question={q}
          index={i}
          status={byTopic[q.id]}
          onAttempt={onAttempt}
        />
      ))}
    </div>
  );
}

function ProblemPanel({ topic }: { topic: Topic }) {
  return (
    <div className="rounded-md border border-yellow-500/30 bg-yellow-500/[0.06] p-4">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle size={16} className="text-yellow-400" />
        <span className="text-[12px] uppercase tracking-wide text-yellow-400 font-semibold">
          Solutions Architect Scenario
        </span>
      </div>
      <p className="text-[14px] leading-relaxed text-text-primary whitespace-pre-line">
        {topic.problemStatement}
      </p>
    </div>
  );
}

// ============================================================
// Quiz Panel
// ============================================================
function QuizPanel({
  topic,
  quiz,
  quizMode,
  setQuizMode,
  currentQ,
  setCurrentQ,
  showAnswer,
  setShowAnswer,
  selectedAnswer,
  setSelectedAnswer,
  onSubmit,
  onReset,
}: {
  topic: Topic;
  quiz: QuizState;
  quizMode: boolean;
  setQuizMode: (b: boolean) => void;
  currentQ: number;
  setCurrentQ: (n: number) => void;
  showAnswer: boolean;
  setShowAnswer: (b: boolean) => void;
  selectedAnswer: "A" | "B" | "C" | "D" | null;
  setSelectedAnswer: (c: "A" | "B" | "C" | "D" | null) => void;
  onSubmit: (qIdx: number, choice: "A" | "B" | "C" | "D", isCorrect: boolean) => void;
  onReset: () => void;
}) {
  const totalQ = topic.questions.length;
  const score = topicScore(topic.id, quiz);
  const answered = score.answered;

  // Results view shown after "Finish" on the last question. Kept local since
  // it's ephemeral display state; reset whenever we leave quiz mode (e.g. on a
  // topic switch, where the parent flips quizMode back to false).
  const [showSummary, setShowSummary] = useState(false);
  useEffect(() => {
    if (!quizMode) setShowSummary(false);
  }, [quizMode]);

  // Elimination is a pure FE aid (solve-by-elimination). Keyed by question
  // index, ephemeral, not persisted. Cleared when the topic changes.
  const [eliminated, setEliminated] = useState<
    Record<number, Array<"A" | "B" | "C" | "D">>
  >({});
  useEffect(() => {
    setEliminated({});
  }, [topic.id]);
  const toggleEliminate = (qIdx: number, letter: "A" | "B" | "C" | "D") => {
    setEliminated((prev) => {
      const cur = prev[qIdx] ?? [];
      const next = cur.includes(letter)
        ? cur.filter((l) => l !== letter)
        : [...cur, letter];
      return { ...prev, [qIdx]: next };
    });
    // If the option being eliminated was the current pick, clear the pick.
    if (selectedAnswer === letter) setSelectedAnswer(null);
  };

  if (!quizMode) {
    return (
      <div className="rounded-md border border-border bg-bg-card/50 p-5 flex flex-col items-center text-center">
        <Trophy size={40} className="text-accent mb-2" />
        <div className="text-lg font-semibold">Ready to test yourself?</div>
        <div className="text-[13px] text-text-muted mt-1">
          {totalQ} hard exam-style questions on <span className="text-text-primary">{topic.shortLabel}</span>.
        </div>
        {answered > 0 && (
          <div className="mt-3 text-[12px] text-text-secondary">
            Last attempt: {score.correct} correct of {answered} answered
          </div>
        )}
        <div className="flex items-center gap-3 mt-4">
          <button
            type="button"
            onClick={() => {
              setQuizMode(true);
              setCurrentQ(0);
              setShowAnswer(false);
              setSelectedAnswer(null);
              setShowSummary(false);
            }}
            className="px-5 py-2 rounded-md bg-accent text-bg-base font-semibold hover:bg-accent-hover transition-colors flex items-center gap-2"
          >
            <Sparkles size={16} /> Test Yourself
          </button>
          {answered > 0 && (
            <button
              type="button"
              onClick={onReset}
              className="px-4 py-2 rounded-md border border-border bg-bg-base text-text-secondary hover:bg-bg-hover text-[13px]"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    );
  }

  // When switching topics, the parent's reset effect runs *after* the next
  // render — so `currentQ` can briefly point past the new topic's questions
  // (e.g. you were on Q15 of a 20-Q topic, switched to a 3-Q topic).
  // Clamp to a safe index so we never dereference `undefined.answer`.
  const safeQ =
    currentQ >= 0 && currentQ < topic.questions.length
      ? currentQ
      : 0;
  const q: Question | undefined = topic.questions[safeQ];
  if (!q) {
    // Topic genuinely has no questions yet — render nothing instead of crashing.
    return (
      <div className="rounded-md border border-border bg-bg-card/40 p-5 text-center text-text-muted text-[13px]">
        No questions available for this topic yet.
      </div>
    );
  }
  const correctLetter = q.answer;
  const optionLetters: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"];

  // mini chart of correct/incorrect per question
  const trail = topic.questions.map((_, i) => {
    const e = quiz[topic.id]?.[i];
    if (!e) return "pending";
    return e.correct ? "correct" : "wrong";
  });

  // ---- Results summary (after "Finish" on the last question) ----
  if (showSummary) {
    const pct = answered === 0 ? 0 : Math.round((score.correct / answered) * 100);
    return (
      <div className="space-y-4">
        {/* Header — score + accuracy */}
        <div className="rounded-md border border-accent/30 bg-gradient-to-r from-bg-panel to-bg-card p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Trophy size={36} className="text-accent" />
            <div>
              <div className="text-lg font-bold text-text-primary">Quiz Complete!</div>
              <div className="text-[13px] text-text-muted">
                {topic.shortLabel} · {answered} of {totalQ} answered
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-[11px] uppercase tracking-wide text-text-muted">Score</div>
              <div className="text-2xl font-bold text-accent">
                {score.correct} <span className="text-text-muted text-base">/ {totalQ}</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-[11px] uppercase tracking-wide text-text-muted">Accuracy</div>
              <div className="text-2xl font-bold text-text-primary">{pct}%</div>
            </div>
          </div>
        </div>

        {/* Per-question review: your answer + correct answer + explanation */}
        <div className="space-y-3">
          {topic.questions.map((question, i) => {
            const entry = quiz[topic.id]?.[i];
            const userLetter = entry?.selected ?? null;
            const correct = question.answer;
            const isCorrect = entry?.correct ?? false;
            const unanswered = userLetter == null;
            return (
              <div
                key={i}
                className={`rounded-md border p-4 ${
                  unanswered
                    ? "border-border bg-bg-card/40"
                    : isCorrect
                    ? "border-success/40 bg-success/[0.05]"
                    : "border-danger/40 bg-danger/[0.05]"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="text-[14px] font-medium text-text-primary leading-snug">
                    <span className="text-text-muted font-mono text-[12px] mr-2">Q{i + 1}</span>
                    {question.q}
                  </div>
                  <span
                    className={`shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded ${
                      unanswered
                        ? "bg-bg-base text-text-muted border border-border"
                        : isCorrect
                        ? "bg-success/15 text-success"
                        : "bg-danger/15 text-danger"
                    }`}
                  >
                    {unanswered ? (
                      "Skipped"
                    ) : isCorrect ? (
                      <>
                        <CheckCircle2 size={12} /> Correct
                      </>
                    ) : (
                      <>
                        <X size={12} /> Wrong
                      </>
                    )}
                  </span>
                </div>

                <div className="grid gap-1.5 mb-3">
                  {optionLetters.map((letter, idx) => {
                    const text = question.options[idx];
                    const isAnswer = letter === correct;
                    const isUser = letter === userLetter;
                    let cls =
                      "flex items-start gap-2 p-2 rounded border text-[13px] ";
                    if (isAnswer)
                      cls += "border-success bg-success/15 text-text-primary";
                    else if (isUser && !isAnswer)
                      cls += "border-danger bg-danger/10 text-text-primary";
                    else cls += "border-border bg-bg-base/50 text-text-muted";
                    return (
                      <div key={letter} className={cls}>
                        <span
                          className={`shrink-0 w-5 h-5 rounded flex items-center justify-center font-mono text-[11px] font-semibold ${
                            isAnswer
                              ? "bg-success text-bg-base"
                              : isUser
                              ? "bg-danger text-white"
                              : "bg-bg-panel text-text-secondary border border-border"
                          }`}
                        >
                          {letter}
                        </span>
                        <span className="flex-1">
                          {text.replace(/^[A-D]\.\s*/, "")}
                        </span>
                        {isAnswer && (
                          <span className="text-[10px] text-success font-semibold shrink-0 mt-0.5">
                            Correct answer
                          </span>
                        )}
                        {isUser && !isAnswer && (
                          <span className="text-[10px] text-danger font-semibold shrink-0 mt-0.5">
                            Your answer
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="rounded border border-border bg-bg-base p-3">
                  <div className="text-[11px] font-semibold text-text-secondary mb-1 flex items-center gap-1.5">
                    <Lightbulb size={12} className="text-accent" /> Explanation
                  </div>
                  <p className="text-[12.5px] leading-relaxed text-text-secondary whitespace-pre-line">
                    {question.explanation}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => {
              onReset();
              setShowSummary(false);
            }}
            className="px-5 py-2 rounded-md bg-accent text-bg-base font-semibold hover:bg-accent-hover transition-colors flex items-center gap-2"
          >
            <Sparkles size={16} /> Retake Quiz
          </button>
          <button
            type="button"
            onClick={() => {
              setShowSummary(false);
              setQuizMode(false);
            }}
            className="px-4 py-2 rounded-md border border-border bg-bg-base text-text-secondary hover:bg-bg-hover text-[13px]"
          >
            Back to Topic
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-4">
      {/* Question side */}
      <div className="rounded-md border border-red-500/30 bg-red-500/[0.04] p-5">
        <div className="text-[12px] text-text-muted mb-2 flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-bg-base border border-border font-mono">
            Question {safeQ + 1} / {totalQ}
          </span>
          {q.difficulty && <DifficultyPill level={q.difficulty} />}
        </div>
        <div className="text-[15px] leading-relaxed mb-2">{q.q}</div>
        {!showAnswer && (
          <div className="text-[11.5px] text-text-muted mb-3 flex items-center gap-1.5">
            <Ban size={12} /> Cross out options you can rule out to solve by
            elimination.
          </div>
        )}

        <div className="grid gap-2">
          {optionLetters.map((letter, idx) => {
            const text = q.options[idx];
            const isSelected = selectedAnswer === letter;
            const isCorrect = letter === correctLetter;
            const isEliminated =
              !showAnswer && (eliminated[safeQ] ?? []).includes(letter);
            let cls =
              "quiz-option rounded-md border transition-colors flex items-stretch overflow-hidden";
            if (!showAnswer) {
              cls += isEliminated
                ? " border-border bg-bg-base/40 opacity-55"
                : isSelected
                ? " border-accent bg-accent/10"
                : " border-border bg-bg-base hover:bg-bg-hover";
            } else {
              if (isCorrect) cls += " border-success bg-success/15 text-text-primary";
              else if (isSelected && !isCorrect) cls += " border-danger bg-danger/10 text-text-primary";
              else cls += " border-border bg-bg-base/60 text-text-muted";
            }
            return (
              <div key={letter} className={cls}>
                <button
                  type="button"
                  onClick={() =>
                    !showAnswer && !isEliminated && setSelectedAnswer(letter)
                  }
                  className="text-left p-3 flex items-start gap-3 flex-1 min-w-0"
                  disabled={showAnswer || isEliminated}
                  aria-pressed={isSelected}
                >
                  <span
                    className={`shrink-0 w-7 h-7 rounded-md flex items-center justify-center font-mono text-sm font-semibold ${
                      showAnswer && isCorrect
                        ? "bg-success text-bg-base"
                        : showAnswer && isSelected && !isCorrect
                        ? "bg-danger text-white"
                        : isSelected
                        ? "bg-accent text-bg-base"
                        : "bg-bg-panel text-text-secondary border border-border"
                    }`}
                  >
                    {letter}
                  </span>
                  <span
                    className={`text-[13.5px] leading-snug text-left flex-1 ${
                      isEliminated
                        ? "line-through text-text-muted"
                        : "text-text-primary"
                    }`}
                  >
                    {text.replace(/^[A-D]\.\s*/, "")}
                  </span>
                  {showAnswer && isCorrect && (
                    <CheckCircle2 size={18} className="text-success shrink-0" />
                  )}
                </button>
                {!showAnswer && (
                  <button
                    type="button"
                    onClick={() => toggleEliminate(safeQ, letter)}
                    className={`shrink-0 px-2.5 flex items-center justify-center border-l border-border/60 transition-colors ${
                      isEliminated
                        ? "text-accent hover:text-accent-hover"
                        : "text-text-muted hover:text-danger hover:bg-bg-hover"
                    }`}
                    title={isEliminated ? "Restore option" : "Eliminate option"}
                    aria-label={
                      isEliminated
                        ? `Restore option ${letter}`
                        : `Eliminate option ${letter}`
                    }
                    aria-pressed={isEliminated}
                  >
                    {isEliminated ? <Undo2 size={15} /> : <Ban size={15} />}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {showAnswer ? (
          <div className="mt-4 rounded-md border border-border bg-bg-base p-4">
            <div className="text-[12px] font-semibold mb-2 flex items-center gap-2">
              <CheckCircle2 size={14} className="text-success" />
              Explanation
            </div>
            <p className="text-[13px] leading-relaxed text-text-secondary whitespace-pre-line">{q.explanation}</p>
          </div>
        ) : (
          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                if (!selectedAnswer) return;
                setShowAnswer(true);
                onSubmit(currentQ, selectedAnswer, selectedAnswer === correctLetter);
              }}
              disabled={!selectedAnswer}
              className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors ${
                selectedAnswer
                  ? "bg-accent text-bg-base hover:bg-accent-hover"
                  : "bg-bg-base text-text-muted border border-border cursor-not-allowed"
              }`}
            >
              Reveal Answer
            </button>
            <button
              type="button"
              onClick={() => setQuizMode(false)}
              className="text-[12px] text-text-muted hover:text-text-primary underline-offset-2 hover:underline"
            >
              Exit quiz
            </button>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (currentQ > 0) {
                setCurrentQ(currentQ - 1);
                const prev = quiz[topic.id]?.[currentQ - 1];
                setShowAnswer(!!prev);
                setSelectedAnswer(prev?.selected ?? null);
              }
            }}
            disabled={currentQ === 0}
            className="px-3 py-1.5 rounded-md border border-border bg-bg-base text-[13px] text-text-secondary disabled:opacity-40 hover:bg-bg-hover"
          >
            ← Previous
          </button>
          <button
            type="button"
            onClick={() => {
              if (currentQ < totalQ - 1) {
                setCurrentQ(currentQ + 1);
                const next = quiz[topic.id]?.[currentQ + 1];
                setShowAnswer(!!next);
                setSelectedAnswer(next?.selected ?? null);
              } else {
                setShowSummary(true);
              }
            }}
            className="px-3 py-1.5 rounded-md bg-accent text-bg-base text-[13px] font-semibold hover:bg-accent-hover"
          >
            {currentQ < totalQ - 1 ? "Next →" : "Finish"}
          </button>
        </div>
      </div>

      {/* Score tracker side */}
      <aside className="rounded-md border border-border bg-bg-card/40 p-4 space-y-3 h-fit lg:sticky lg:top-[96px]">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-text-muted">Score</div>
          <div className="text-2xl font-bold text-accent">
            {score.correct} <span className="text-text-muted text-base">/ {totalQ}</span>
          </div>
          <div className="text-[11px] text-text-muted">{answered} answered</div>
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-wide text-text-muted mb-1">Progress</div>
          <div className="grid grid-cols-10 gap-1">
            {topic.questions.map((_, i) => {
              const e = quiz[topic.id]?.[i];
              const cls =
                i === currentQ
                  ? "bg-accent ring-2 ring-accent/40"
                  : e
                  ? e.correct
                    ? "bg-success"
                    : "bg-danger"
                  : "bg-bg-base border border-border";
              return (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to question ${i + 1}`}
                  onClick={() => {
                    setCurrentQ(i);
                    const e2 = quiz[topic.id]?.[i];
                    setShowAnswer(!!e2);
                    setSelectedAnswer(e2?.selected ?? null);
                  }}
                  className={`w-full aspect-square rounded ${cls}`}
                />
              );
            })}
          </div>
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-wide text-text-muted mb-1">Result Trail</div>
          <div className="flex flex-wrap gap-0.5">
            {trail.map((r, i) => (
              <span
                key={i}
                className={`inline-block w-2 h-3 rounded-sm ${
                  r === "correct" ? "bg-success" : r === "wrong" ? "bg-danger" : "bg-bg-base border border-border"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <div className="text-[11px] uppercase tracking-wide text-text-muted">Accuracy</div>
          <div className="text-lg font-semibold">
            {answered === 0 ? "—" : `${Math.round((score.correct / answered) * 100)}%`}
          </div>
        </div>
      </aside>
    </div>
  );
}
