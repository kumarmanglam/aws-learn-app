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
// SECTION: JavaScript Core — Closures, Scope, this, Currying,
// Modern JS (ES6+) & Array Methods.
// Frontend interview fundamentals authored to the messaging.ts bar.
// ============================================================
import { svgDefs, type Topic } from "./shared";

const box = (
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  sub: string,
  color = "#8b5cf6",
) => `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#243349" stroke="${color}"/>
  <text x="${x + w / 2}" y="${y + h / 2 - 2}" text-anchor="middle" fill="#e6edf3" font-size="12" font-weight="600">${title}</text>
  <text x="${x + w / 2}" y="${y + h / 2 + 15}" text-anchor="middle" fill="#8b949e" font-size="10">${sub}</text>
`;

export const frontendCoreTopics: Topic[] = [
  // -----------------------------------------------------------------
  {
    id: "fe-closures",
    title: "Closures & Lexical Scope",
    shortLabel: "Closures",
    section: "JavaScript Core",
    domain: "Frontend",
    tldr:
      "A closure is a function bundled with a reference to its outer (lexical) scope, so it keeps accessing those variables even after the outer function has returned. Because JavaScript uses lexical scoping, that scope is decided by where the function is written, not where it is called. Closures power data privacy, function factories, memoization, and stateful callbacks.",
    subtopics: [
      {
        heading: "What a closure is",
        bullets: [
          { icon: "🔒", text: "A function that **remembers** the variables of its enclosing scope, even after the outer function has finished running." },
          { icon: "🧭", text: "Enabled by **lexical scoping** — scope is fixed by **where code is written**, not where it is called (static, not dynamic)." },
          { icon: "🔗", text: "Each function carries a **reference** (not a copy) to its outer variables via the **scope chain**: inner → outer → global." },
        ],
      },
      {
        heading: "Why the variables survive",
        bullets: [
          { icon: "🗑️", text: "Normally locals are **garbage collected** when a function returns; a closed-over variable is **kept alive** because the inner function still references it." },
          { icon: "🏭", text: "Every call to the outer function creates a **fresh, independent** closure — two counters from the same factory don't share state." },
          { icon: "⚠️", text: "Long-lived closures can cause **memory leaks** if they pin large objects — release references you no longer need." },
        ],
      },
      {
        heading: "Where you use them",
        bullets: [
          { icon: "🛡️", text: "**Data privacy / module pattern** — expose methods that read a variable no outside code can touch." },
          { icon: "🧮", text: "**Memoization / caching**, **function factories**, **partial application**, and **iterators** that keep internal state." },
          { icon: "🐛", text: "The classic **loop pitfall**: `var` in a loop shares one binding, so all callbacks see the final value — fix with `let` or an IIFE." },
        ],
      },
    ],
    keyFacts: [
      { label: "Scoping model", value: "Lexical (static)", icon: "🧭" },
      { label: "Captured by", value: "Reference, not copy", icon: "🔗" },
      { label: "Lifetime", value: "As long as the inner fn lives", icon: "♾️" },
      { label: "Loop fix", value: "let (block scope) or IIFE", icon: "🐛" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'Function + its lexical environment' → **closure** (define it in one line).",
        "'Private variable / encapsulation' → **closure via the module pattern**.",
        "'All loop callbacks print the last value' → `var` is **function-scoped**; use `let`.",
        "'Remember previous results' → **memoization** with a closed-over cache.",
        "Closures capture a **reference**, so later mutations are visible.",
      ],
      analogyBrief:
        "A closure is a backpack the function carries: even after it leaves the room where it was created, it still holds the items (variables) it packed.",
    },
    explanation:
      "A closure is a function bundled together with a reference to its lexical environment — the set of variables that were in scope where the function was defined. JavaScript uses lexical (static) scoping, meaning a function's accessible variables are determined by where it is physically written in the source, not by where or how it is later called. When an inner function is created inside an outer function, it captures a live reference (not a snapshot copy) to the outer function's variables through the scope chain, which resolves names from the innermost scope outward to the global scope. Normally, once a function returns, its local variables become eligible for garbage collection; but if the outer function returns an inner function (or otherwise keeps it reachable), the variables the inner function references are kept alive in memory for as long as that inner function exists. Crucially, each invocation of the outer function produces a brand-new, independent closure, so two counters built from the same factory maintain separate counts. Closures underpin a huge range of patterns: data privacy and the module pattern (a returned object exposes methods that read and write a variable no external code can reach directly), function factories that generate customized functions, memoization that caches results in a closed-over object, partial application and currying, and stateful event handlers and iterators. The most notorious pitfall is using var inside a loop that schedules callbacks: because var is function-scoped there is a single shared binding, so every callback reads the loop variable's final value — the fix is to use the block-scoped let (a fresh binding per iteration) or wrap the body in an IIFE. Finally, because closures keep variables alive, careless long-lived closures that capture large structures can cause memory leaks.",
    analogy:
      "A closure is like a scuba diver's backpack. When the diver (the inner function) is prepared inside the equipment room (the outer function), they pack exactly the gear that's on the shelves at that moment — a reference to those shelves, not photocopies. Even after they leave the room and the room is locked up and 'cleared away' (the outer function returns and would normally be garbage collected), the diver still carries the backpack and can reach into it underwater. Prepare two divers in the same room and each gets their own backpack, so what one uses doesn't affect the other.",
    diagram: `<svg viewBox="0 0 720 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Closure captures outer scope after it returns">${svgDefs}
      <rect x="20" y="20" width="330" height="150" rx="10" fill="#1a2332" stroke="#f59e0b" stroke-dasharray="5 4"/>
      <text x="35" y="42" fill="#f59e0b" font-size="11" font-weight="700">outer() execution context</text>
      ${box(40, 55, 120, 45, "let count", "= 0", "#f59e0b")}
      ${box(190, 55, 140, 60, "inner()", "returned fn", "#8b5cf6")}
      <line x1="160" y1="80" x2="188" y2="85" stroke="#22c55e" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="150" y="135" fill="#f85149" font-size="10">context popped off call stack →</text>
      ${box(430, 55, 130, 60, "inner()", "still alive", "#8b5cf6")}
      <line x1="330" y1="90" x2="428" y2="88" stroke="#8b949e" stroke-width="1.5" stroke-dasharray="4" marker-end="url(#arrow-mute)"/>
      ${box(430, 150, 130, 55, "count = 0", "persists in heap", "#22c55e")}
      <line x1="495" y1="115" x2="495" y2="148" stroke="#22c55e" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="35" y="245" fill="#8b949e" font-size="10">Lexical scope chain: inner() → outer() → global. The captured variable outlives outer().</text>
    </svg>`,
    diagramLegend: [
      { color: "#f59e0b", label: "outer() context", description: "Runs, creates locals, then is popped off the call stack." },
      { color: "#8b5cf6", label: "inner() closure", description: "Returned function that captured a reference to count." },
      { color: "#22c55e", label: "Captured variable", description: "count stays alive in the heap because inner() references it." },
    ],
    codeExample: {
      language: "javascript",
      title: "makeCounter — each call is an independent closure",
      code: `function makeCounter() {
  let count = 0;           // closed-over variable
  return function () {
    count++;
    return count;
  };
}

const counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2

const counter2 = makeCounter();
console.log(counter2()); // 1  (independent closure)
console.log(counter());  // 3  (original keeps counting)`,
    },
    codeExamples: [
      {
        language: "javascript",
        tab: "Counter",
        title: "Basic closure — a counter factory",
        code: `function makeCounter() {
  let count = 0; // closed-over variable
  return function () {
    count++;
    return count;
  };
}

const counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3

// Each call to makeCounter creates a NEW closure
const counter2 = makeCounter();
console.log(counter2()); // 1 (independent!)
console.log(counter());  // 4 (still counting)`,
      },
      {
        language: "javascript",
        tab: "Data privacy",
        title: "Module pattern — a truly private balance",
        code: `function createBankAccount(initialBalance) {
  let balance = initialBalance; // private!

  return {
    deposit(amount) {
      balance += amount;
      return balance;
    },
    withdraw(amount) {
      if (amount > balance) return "Insufficient funds";
      balance -= amount;
      return balance;
    },
    getBalance() {
      return balance;
    },
  };
}

const account = createBankAccount(1000);
account.deposit(500);          // 1500
account.withdraw(200);         // 1300
console.log(account.getBalance()); // 1300
console.log(account.balance);      // undefined — cannot touch it directly`,
      },
      {
        language: "javascript",
        tab: "Loop pitfall",
        title: "The var-in-a-loop bug and its fixes",
        code: `// PROBLEM: var is function-scoped — one shared binding
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("var i:", i), 100); // 3, 3, 3
}

// FIX 1: let creates a fresh binding per iteration
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log("let j:", j), 200); // 0, 1, 2
}

// FIX 2: IIFE captures the current value in a new scope
for (var k = 0; k < 3; k++) {
  (function (k) {
    setTimeout(() => console.log("iife k:", k), 300); // 0, 1, 2
  })(k);
}`,
      },
    ],
    problemStatement:
      "You are asked to build a rate-limited API client that must expose a `call()` method but keep its request count and token bucket completely hidden from consumers — no external code should be able to read or reset them. In the same interview you're shown a for-loop that schedules three setTimeout callbacks with `var i` and asked why they all log 3. Explain how closures give you private state, why each factory call is independent, and the exact scoping reason the loop misbehaves plus two fixes.",
    questions: [
      {
        q: "What is a closure?",
        options: [
          "A. A function declared inside a class",
          "B. A function bundled with a reference to its outer (lexical) scope",
          "C. A syntax for closing over a file handle",
          "D. A special kind of loop",
        ],
        answer: "B",
        explanation:
          "B is correct: a closure is a function together with its lexical environment, so it can access variables from its outer scope even after that outer function has returned. It has nothing to do with classes, files, or loops.",
      },
      {
        q: "What determines a function's scope in JavaScript?",
        options: [
          "A. Where the function is called (dynamic scoping)",
          "B. Where the function is defined in the source (lexical scoping)",
          "C. The global object only",
          "D. The nearest enclosing class",
        ],
        answer: "B",
        explanation:
          "B is correct: JavaScript uses lexical (static) scoping — the accessible variables are fixed by where the function is written, not by the call site. Dynamic scoping (call-site based) is what JS does NOT use.",
      },
      {
        q: "What happens to closed-over variables when the outer function finishes?",
        options: [
          "A. They are immediately garbage collected",
          "B. They persist because the inner function still holds a reference to them",
          "C. They are copied into the global scope",
          "D. They become undefined",
        ],
        answer: "B",
        explanation:
          "B is correct: the variables stay alive in memory because the returned inner function references them via the closure. They are not collected, moved to global, or reset.",
      },
      {
        q: "In `for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 0);`, what prints?",
        options: [
          "A. 0, 1, 2",
          "B. 3, 3, 3",
          "C. 0, 0, 0",
          "D. A ReferenceError",
        ],
        answer: "B",
        explanation:
          "B is correct: `var` is function-scoped, so all three callbacks close over the SAME binding of i. By the time the timeouts fire, the synchronous loop has finished and i is 3. Using `let` (a fresh binding per iteration) would print 0, 1, 2.",
      },
      {
        q: "Two counters created from the same `makeCounter()` factory — how do they relate?",
        options: [
          "A. They share the same count variable",
          "B. Each has its own independent closure and count",
          "C. The second overwrites the first",
          "D. Both always return 0",
        ],
        answer: "B",
        explanation:
          "B is correct: every invocation of the outer function creates a new lexical environment, so each returned counter closes over its own count. They increment independently.",
      },
      {
        q: "Which is NOT a valid use case for closures?",
        options: [
          "A. Memoization / caching results",
          "B. Data privacy via the module pattern",
          "C. Forcing garbage collection of captured variables",
          "D. Building function factories",
        ],
        answer: "C",
        explanation:
          "C is correct as the odd one out: closures actually PREVENT garbage collection of captured variables (that is how they persist). Memoization, data privacy, and factories are all classic closure use cases.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "fe-scope",
    title: "Scope, Hoisting & the TDZ",
    shortLabel: "Scope & Hoisting",
    section: "JavaScript Core",
    domain: "Frontend",
    tldr:
      "Scope decides where a name is accessible: global, function (var), or block (let/const). Hoisting moves declarations to the top of their scope before execution — var initializes to undefined, while let/const are hoisted but left uninitialized in the Temporal Dead Zone until their declaration line. Name lookup walks the scope chain outward, first match wins.",
    subtopics: [
      {
        heading: "Three kinds of scope",
        bullets: [
          { icon: "🌍", text: "**Global** — declared outside any function/block; reachable everywhere." },
          { icon: "📦", text: "**Function** — `var` is scoped to the whole enclosing function, even if written inside a block (it 'leaks' out of `{}`)." },
          { icon: "🧱", text: "**Block** — `let` and `const` live only inside the nearest `{ }` (if, for, plain block)." },
        ],
      },
      {
        heading: "Hoisting behavior",
        bullets: [
          { icon: "⬆️", text: "`var` is hoisted **and initialized to `undefined`**, so reading it before assignment is allowed (returns `undefined`)." },
          { icon: "⛔", text: "`let`/`const` are hoisted but **not initialized** — reading before the declaration throws a **ReferenceError** (the TDZ)." },
          { icon: "🧩", text: "**Function declarations** are fully hoisted (callable before their line); **function expressions** hoist only the variable." },
        ],
      },
      {
        heading: "TDZ & scope chain",
        bullets: [
          { icon: "🕳️", text: "The **Temporal Dead Zone** is the gap between entering a scope and the `let`/`const` declaration — it catches use-before-declare bugs early." },
          { icon: "🔗", text: "**Scope chain** lookup: current scope → parent → … → global; the **first** matching name wins." },
          { icon: "🔁", text: "`const` blocks **reassignment**, not mutation — you can still push to a `const` array." },
        ],
      },
    ],
    keyFacts: [
      { label: "var scope", value: "Function", icon: "📦" },
      { label: "let / const scope", value: "Block", icon: "🧱" },
      { label: "var hoist value", value: "undefined", icon: "⬆️" },
      { label: "let / const before decl", value: "ReferenceError (TDZ)", icon: "⛔" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "`console.log(x); var x = 5;` → prints **undefined** (hoisted, not assigned yet).",
        "`console.log(y); let y = 5;` → **ReferenceError** (TDZ).",
        "'var leaks out of a block' → yes; use `let`/`const` for block scope.",
        "Function declarations are **callable before** their line; expressions are not.",
        "`const` prevents **reassignment**, not object **mutation**.",
      ],
      analogyBrief:
        "Hoisting is the interpreter reading the guest list (declarations) before the party starts; var guests get a placeholder seat (undefined), let/const guests are on the list but barred from entering until their name is officially called (TDZ).",
    },
    explanation:
      "Scope determines where in your program a given identifier can be accessed. There are three kinds: global scope (declared outside every function and block, reachable anywhere), function scope (variables declared with var, which are visible throughout the entire enclosing function even if the var statement sits inside an if or for block — so var effectively 'leaks' out of blocks), and block scope (let and const, which are confined to the nearest pair of curly braces). Before any code runs, JavaScript performs hoisting: it moves declarations to the top of their scope. A var declaration is hoisted and immediately initialized to undefined, which is why reading a var before its assignment yields undefined rather than an error. A let or const declaration is also hoisted, but it is left uninitialized and lives in the Temporal Dead Zone (TDZ) from the moment the scope is entered until execution reaches the declaration line; touching the variable during the TDZ throws a ReferenceError, a deliberate design that surfaces use-before-declaration bugs. Function declarations are hoisted in full, so you can call them above where they are written, whereas function expressions (and arrow functions assigned to variables) only hoist the variable binding, so calling them early throws a TypeError (the variable is undefined, not yet a function). When a name is used, the engine resolves it by walking the scope chain from the current scope outward to the global scope and using the first match it finds. Finally, remember that const prevents reassignment of the binding, not mutation of the value it points to — you can still push into a const array or set properties on a const object.",
    analogy:
      "Think of the JavaScript engine as a stage manager who reads the entire script before the show. During this read-through (hoisting) she writes every named role on a board. For `var` roles she pencils in an empty costume immediately (undefined), so if that actor is cued early they walk on wearing nothing meaningful. For `let`/`const` roles she writes the name but ropes off the stage entrance — the actor exists on the list yet is physically barred from stepping on until the script formally introduces them (the Temporal Dead Zone); cue them early and security throws them out (ReferenceError). Function-declaration actors, by contrast, are already fully in costume and can perform even before their scripted entrance.",
    diagram: `<svg viewBox="0 0 720 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Scope nesting and hoisting behavior">${svgDefs}
      <rect x="20" y="15" width="680" height="180" rx="12" fill="#0d1117" stroke="#f59e0b" stroke-dasharray="5 4"/>
      <text x="38" y="38" fill="#f59e0b" font-size="12" font-weight="700">Global scope — var globalVar</text>
      <rect x="55" y="52" width="610" height="120" rx="10" fill="#161b22" stroke="#3b82f6" stroke-dasharray="5 4"/>
      <text x="72" y="74" fill="#3b82f6" font-size="12" font-weight="700">Function scope — var lives here (leaks out of blocks)</text>
      ${box(80, 90, 250, 40, "{ let blockVar }", "block-scoped", "#22c55e")}
      ${box(360, 90, 250, 40, "{ const x }", "block-scoped", "#22c55e")}
      <text x="80" y="158" fill="#8b949e" font-size="10">var declared inside a block is still visible to the whole function.</text>
      <rect x="20" y="205" width="680" height="65" rx="10" fill="#1a2332" stroke="#8b5cf6"/>
      <text x="38" y="228" fill="#8b5cf6" font-size="12" font-weight="700">Hoisting</text>
      <text x="38" y="248" fill="#8b949e" font-size="10">var → hoisted, initialized to undefined     function decl → fully hoisted (callable early)</text>
      <text x="38" y="263" fill="#f85149" font-size="10">let / const → hoisted but uninitialized → TDZ → ReferenceError if read early</text>
    </svg>`,
    diagramLegend: [
      { color: "#f59e0b", label: "Global scope", description: "Outermost scope; reachable from anywhere." },
      { color: "#3b82f6", label: "Function scope", description: "var lives here and leaks out of inner blocks." },
      { color: "#22c55e", label: "Block scope", description: "let / const confined to the nearest { }." },
    ],
    codeExample: {
      language: "javascript",
      title: "Hoisting: var vs let vs function declaration",
      code: `console.log(a); // undefined  (var is hoisted + initialized to undefined)
var a = 5;
console.log(a); // 5

try {
  console.log(b); // ReferenceError — b is in the TDZ
} catch (e) {
  console.log("let error:", e.name);
}
let b = 10;

console.log(greet()); // "Hello!"  — function declaration is fully hoisted
function greet() {
  return "Hello!";
}`,
    },
    codeExamples: [
      {
        language: "javascript",
        tab: "Scope types",
        title: "Global vs function vs block scope",
        code: `var globalVar = "global";

function demo() {
  var funcVar = "function-scoped";

  if (true) {
    var varInBlock = "still function-scoped!"; // leaks
    let letInBlock = "block-scoped";
    console.log(letInBlock); // "block-scoped"
  }

  console.log(funcVar);    // "function-scoped"
  console.log(varInBlock); // "still function-scoped!" (var leaks out of the block)

  try {
    console.log(letInBlock); // ReferenceError — out of block scope
  } catch (e) {
    console.log("letInBlock error:", e.name);
  }
}

demo();
console.log(globalVar); // "global"`,
      },
      {
        language: "javascript",
        tab: "Hoisting",
        title: "Hoisting of var, let, and functions",
        code: `// var is hoisted and initialized to undefined
console.log(a); // undefined (not an error)
var a = 5;
console.log(a); // 5

// let is hoisted but sits in the TDZ
try {
  console.log(b); // ReferenceError
} catch (e) {
  console.log("let error:", e.name);
}
let b = 10;

// Function declaration — fully hoisted
console.log(greet()); // "Hello!"
function greet() {
  return "Hello!";
}

// Function expression — only the variable is hoisted
try {
  console.log(sayBye()); // TypeError: sayBye is not a function
} catch (e) {
  console.log("expression error:", e.name);
}
var sayBye = function () {
  return "Bye!";
};`,
      },
      {
        language: "javascript",
        tab: "const nuance",
        title: "const blocks reassignment, not mutation",
        code: `const nums = [1, 2, 3];
nums.push(4);           // OK — mutating the array is allowed
console.log(nums);      // [1, 2, 3, 4]

try {
  // Reassigning the binding is NOT allowed
  // eslint-disable-next-line no-const-assign
  nums = [];            // TypeError: Assignment to constant variable
} catch (e) {
  console.log("const error:", e.name);
}

const user = { name: "Kumar" };
user.name = "Dev";      // OK — mutating a property
console.log(user.name); // "Dev"`,
      },
    ],
    problemStatement:
      "During a code review a teammate reports two confusing behaviors: (1) `console.log(config); var config = loadConfig();` logs `undefined` instead of throwing, and (2) switching that line to `let config` suddenly throws a ReferenceError. They also can't understand why a `var` declared inside an `if` block is readable after the block. Explain hoisting, the difference between var initialization and the let/const Temporal Dead Zone, and why var is function-scoped.",
    questions: [
      {
        q: "What is the scope of a variable declared with `var`?",
        options: [
          "A. Block scope",
          "B. Function scope",
          "C. Global scope only",
          "D. Module scope",
        ],
        answer: "B",
        explanation:
          "B is correct: `var` is function-scoped — it is visible throughout the entire enclosing function even when declared inside a block like if or for. `let`/`const` are the block-scoped ones.",
      },
      {
        q: "What does `console.log(x); var x = 5;` output?",
        options: ["A. 5", "B. ReferenceError", "C. undefined", "D. null"],
        answer: "C",
        explanation:
          "C is correct: the declaration `var x` is hoisted and initialized to undefined, while the assignment stays in place. So the read logs undefined rather than throwing.",
      },
      {
        q: "What is the Temporal Dead Zone?",
        options: [
          "A. The time before the script downloads",
          "B. The period between entering a scope and reaching the let/const declaration, where access throws",
          "C. A region of the global scope",
          "D. A type of memory leak",
        ],
        answer: "B",
        explanation:
          "B is correct: the TDZ is the span from scope entry until the let/const declaration line; reading the variable in that window throws a ReferenceError, catching use-before-declaration bugs.",
      },
      {
        q: "Which is fully hoisted so it can be called ABOVE where it is written?",
        options: [
          "A. A function expression assigned to a var",
          "B. An arrow function assigned to a const",
          "C. A function declaration",
          "D. A let-bound function",
        ],
        answer: "C",
        explanation:
          "C is correct: function declarations are hoisted in full and are callable before their line. Function expressions and arrow functions only hoist the variable binding, so calling them early fails (undefined / TDZ).",
      },
      {
        q: "Given `const arr = [1, 2]; arr.push(3);` — what happens?",
        options: [
          "A. TypeError, because const forbids all changes",
          "B. arr becomes [1, 2, 3]; const only forbids reassignment",
          "C. ReferenceError",
          "D. arr stays [1, 2]",
        ],
        answer: "B",
        explanation:
          "B is correct: const prevents reassigning the binding, not mutating the value it references. Pushing into the array is allowed, so arr becomes [1, 2, 3]. Assigning `arr = []` would throw.",
      },
      {
        q: "What does `console.log(fn()); var fn = function () { return 1; };` produce?",
        options: [
          "A. 1",
          "B. undefined",
          "C. TypeError: fn is not a function",
          "D. ReferenceError",
        ],
        answer: "C",
        explanation:
          "C is correct: only the variable `fn` is hoisted (as undefined). At the call site fn is undefined, and calling undefined throws a TypeError. A function declaration would have worked; this is a function expression.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "fe-this",
    title: "The `this` Keyword & Binding",
    shortLabel: "`this` Binding",
    section: "JavaScript Core",
    domain: "Frontend",
    tldr:
      "`this` refers to the object executing the current function, and its value depends on HOW the function is called, not where it is defined. Five rules set it, in precedence order: new binding, explicit (call/apply/bind), implicit (object before the dot), default (global or undefined in strict mode), and arrow functions, which have no own `this` and inherit it lexically.",
    subtopics: [
      {
        heading: "How `this` is decided",
        bullets: [
          { icon: "📞", text: "`this` is set by the **call site** — how a function is invoked — not by where it was written." },
          { icon: "🆕", text: "**new binding** (highest precedence): `this` is the freshly created object." },
          { icon: "🎯", text: "**Explicit binding**: `call`/`apply`/`bind` force `this` to a value you pass." },
        ],
      },
      {
        heading: "Implicit, default & arrows",
        bullets: [
          { icon: "👉", text: "**Implicit binding**: the object **left of the dot** (`obj.method()` → `this === obj`)." },
          { icon: "🌐", text: "**Default binding**: a plain call gives the global object (or **undefined** in strict mode / modules)." },
          { icon: "🏹", text: "**Arrow functions** have **no own `this`** — they inherit it from the enclosing lexical scope and can't be rebound." },
        ],
      },
      {
        heading: "call vs apply vs bind",
        bullets: [
          { icon: "📋", text: "`call(thisArg, a, b)` invokes **now** with individual args; `apply(thisArg, [a, b])` invokes **now** with an args array." },
          { icon: "🔗", text: "`bind(thisArg, …)` returns a **new function** with `this` (and any preset args) locked in — it does not call." },
          { icon: "🧨", text: "Common bug: passing a method as a callback **loses `this`** — fix with `bind`, an arrow wrapper, or a class field." },
        ],
      },
    ],
    keyFacts: [
      { label: "Determined by", value: "Call site, not definition", icon: "📞" },
      { label: "Precedence", value: "new > explicit > implicit > default", icon: "🥇" },
      { label: "Arrow function this", value: "Lexical (inherited)", icon: "🏹" },
      { label: "bind returns", value: "A new bound function", icon: "🔗" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'`this` depends on…' → the **call site**, not where the function is defined.",
        "`obj.method()` → `this` is **obj** (implicit binding).",
        "Detached method `const f = obj.method; f()` → **loses `this`** (default binding).",
        "Callback needs the surrounding `this` → use an **arrow function**.",
        "`bind` **returns** a function; `call`/`apply` **invoke** immediately.",
      ],
      analogyBrief:
        "`this` is the word 'here' — its meaning depends on where you're standing when you say it (the call site), not where the sentence was written down.",
    },
    explanation:
      "The `this` keyword refers to the object that is executing the current function, and — this is the crux — its value is determined by how the function is called (the call site), not by where the function is defined. Five rules set it, in descending order of precedence. First, new binding: when a function is invoked with new, `this` is the brand-new object being constructed. Second, explicit binding: call, apply, and bind let you state exactly what `this` should be — call takes the arguments individually, apply takes them as an array, and bind returns a new function with `this` (and optionally some leading arguments) permanently fixed rather than calling it. Third, implicit binding: when a function is called as a method, `this` is the object immediately to the left of the dot, so obj.method() makes `this` equal to obj. Fourth, default binding: a plain function call with no object gives `this` the global object in non-strict mode, or undefined in strict mode and ES modules — which is why detaching a method into a bare variable and calling it 'loses' its `this`. Fifth and special, arrow functions do not have their own `this` at all; they capture `this` lexically from the enclosing scope at definition time and cannot be rebound by call, apply, or bind, nor used as constructors. This lexical behavior is exactly why arrow functions are the clean fix for callbacks (for example inside forEach or setTimeout) where a regular function would otherwise get default binding and see the wrong `this`. The most common real-world bug is passing an object method directly as an event handler or callback: the method is invoked plain, so `this` is no longer the object — the fixes are to bind the method, wrap it in an arrow function, or define it as a class field arrow.",
    analogy:
      "The word `this` behaves like the word 'here' in a set of instructions. If a note says 'leave the package here,' its meaning depends entirely on where the reader is standing when they read it (the call site), not on where the note was written. Say obj.method() and you are standing at obj, so 'here' means obj. Hand the same note to a courier with no location (a bare function call) and 'here' collapses to the default spot — the lobby (global) or, in strict mode, nowhere at all (undefined). An arrow function is a note that hard-codes the address of the room where it was drafted, so no matter who carries it, 'here' always points back to that original room.",
    diagram: `<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="this binding precedence rules">${svgDefs}
      <text x="360" y="28" text-anchor="middle" fill="#e6edf3" font-size="15" font-weight="700">Precedence of the this binding rules</text>
      ${box(30, 50, 150, 55, "1. new", "this = new {}", "#f85149")}
      ${box(200, 50, 150, 55, "2. Explicit", "call/apply/bind", "#3b82f6")}
      ${box(370, 50, 150, 55, "3. Implicit", "obj.method()", "#22c55e")}
      ${box(540, 50, 150, 55, "4. Default", "global / undefined", "#f59e0b")}
      <text x="360" y="140" text-anchor="middle" fill="#8b5cf6" font-size="12" font-weight="700">Highest precedence on the left</text>
      <rect x="30" y="160" width="660" height="55" rx="10" fill="#1a2332" stroke="#8b5cf6"/>
      <text x="48" y="183" fill="#8b5cf6" font-size="12" font-weight="700">Arrow function (special)</text>
      <text x="48" y="203" fill="#8b949e" font-size="10">No own this — inherits from the enclosing lexical scope; cannot be rebound by call/apply/bind.</text>
      ${box(30, 230, 200, 55, "call(this, a, b)", "invoke now, listed args", "#3b82f6")}
      ${box(255, 230, 200, 55, "apply(this, [a,b])", "invoke now, array args", "#3b82f6")}
      ${box(480, 230, 210, 55, "bind(this, a)", "returns a new fn", "#e11d8f")}
    </svg>`,
    diagramLegend: [
      { color: "#f85149", label: "new binding", description: "Highest precedence: this is the new object." },
      { color: "#3b82f6", label: "Explicit / call-apply-bind", description: "You pass the exact this value." },
      { color: "#22c55e", label: "Implicit binding", description: "this is the object left of the dot." },
    ],
    codeExample: {
      language: "javascript",
      title: "The four binding rules on one method",
      code: `const person = {
  name: "Kumar",
  greet() {
    return "Hi, I'm " + this.name;
  },
};

console.log(person.greet());            // implicit  -> "Hi, I'm Kumar"

const detached = person.greet;
console.log(detached());                // default   -> "Hi, I'm undefined"

console.log(detached.call({ name: "Alice" })); // explicit -> "Hi, I'm Alice"

function User(name) { this.name = name; }
console.log(new User("Dev").name);      // new       -> "Dev"`,
    },
    codeExamples: [
      {
        language: "javascript",
        tab: "All rules",
        title: "new, explicit, implicit, and default binding",
        code: `const person = {
  name: "Kumar",
  greet() {
    console.log("Hello, I'm " + this.name);
  },
};

// Implicit binding (object left of the dot)
person.greet(); // "Hello, I'm Kumar"

// Default binding (context lost)
const greet = person.greet;
greet(); // "Hello, I'm undefined" (or throws in strict mode)

// Explicit binding
greet.call({ name: "Alice" }); // "Hello, I'm Alice"
greet.apply({ name: "Bob" });  // "Hello, I'm Bob"
const bound = greet.bind({ name: "Charlie" });
bound(); // "Hello, I'm Charlie"

// new binding
function User(name) {
  this.name = name;
}
console.log(new User("Dev").name); // "Dev"`,
      },
      {
        language: "javascript",
        tab: "Arrow this",
        title: "Arrow functions inherit this lexically",
        code: `const team = {
  name: "Engineering",
  members: ["Alice", "Bob", "Charlie"],

  // Arrow callback inherits this from showMembers
  showMembers() {
    this.members.forEach((m) => {
      console.log(m + " is in " + this.name); // this.name = "Engineering"
    });
  },

  // Regular-function callback gets default binding -> wrong this
  showBroken() {
    this.members.forEach(function (m) {
      console.log(m + " is in " + this.name); // this.name is undefined
    });
  },
};

team.showMembers(); // works
team.showBroken();  // broken`,
      },
      {
        language: "javascript",
        tab: "call/apply/bind",
        title: "call vs apply vs bind",
        code: `function introduce(greeting, punctuation) {
  return greeting + ", I'm " + this.name + punctuation;
}

const person = { name: "Kumar" };

// call — args listed individually, invokes now
console.log(introduce.call(person, "Hi", "!"));   // "Hi, I'm Kumar!"

// apply — args as an array, invokes now
console.log(introduce.apply(person, ["Hey", "!!"])); // "Hey, I'm Kumar!!"

// bind — returns a NEW function with this (and greeting) preset
const intro = introduce.bind(person, "Hello");
console.log(intro("."));   // "Hello, I'm Kumar."
console.log(intro("!!!")); // "Hello, I'm Kumar!!!"

// Classic apply use: spread an array as arguments
console.log(Math.max.apply(null, [3, 7, 1, 9])); // 9`,
      },
    ],
    problemStatement:
      "A React-less widget registers `button.addEventListener('click', this.handleClick)` inside a class, and at runtime `this` inside handleClick is the button element, not the instance — so `this.state` is undefined. In the same component a `setInterval(function () { this.tick(); }, 1000)` also fails. Explain why each callback loses the intended `this`, rank the binding rules that apply, and give the idiomatic fixes (bind in the constructor, a class-field arrow, or an arrow wrapper).",
    questions: [
      {
        q: "In `obj.method()`, what is `this` inside method?",
        options: ["A. the global object", "B. undefined", "C. obj", "D. method itself"],
        answer: "C",
        explanation:
          "C is correct: this is implicit binding — `this` is the object immediately to the left of the dot, namely obj. Detaching the method and calling it plainly would instead give default binding.",
      },
      {
        q: "Can you change the `this` of an arrow function with call or apply?",
        options: [
          "A. Yes, call and apply always work",
          "B. No — arrow functions have no own this and inherit it lexically",
          "C. Only with bind",
          "D. Only in strict mode",
        ],
        answer: "B",
        explanation:
          "B is correct: arrow functions do not have their own `this`; they capture it from the enclosing scope at definition time, and call/apply/bind cannot override it.",
      },
      {
        q: "What does `bind` return?",
        options: [
          "A. undefined",
          "B. The result of calling the function immediately",
          "C. A new function with this permanently bound",
          "D. The original function unchanged",
        ],
        answer: "C",
        explanation:
          "C is correct: bind returns a NEW function whose `this` (and any preset leading arguments) is fixed. Unlike call/apply, it does not invoke the function right away.",
      },
      {
        q: "What primarily determines the value of `this` in a normal function?",
        options: [
          "A. Where the function is defined",
          "B. How and where the function is called (the call site)",
          "C. The file it lives in",
          "D. The number of parameters",
        ],
        answer: "B",
        explanation:
          "B is correct: for normal functions `this` is set at the call site by how the function is invoked. (Arrow functions are the exception — they bind `this` lexically at definition.)",
      },
      {
        q: "In strict mode, what is `this` in a plain function call `f()`?",
        options: [
          "A. The global object",
          "B. undefined",
          "C. An empty object {}",
          "D. The function f",
        ],
        answer: "B",
        explanation:
          "B is correct: default binding in strict mode (and in ES modules) sets `this` to undefined. In sloppy (non-strict) mode it would be the global object.",
      },
      {
        q: "Which has the HIGHEST precedence among the binding rules?",
        options: [
          "A. Implicit binding (obj.method())",
          "B. Default binding",
          "C. new binding",
          "D. Explicit binding (call/apply/bind)",
        ],
        answer: "C",
        explanation:
          "C is correct: the order is new > explicit (call/apply/bind) > implicit > default. So calling a bound function with new still constructs a new object and uses that as `this`.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "fe-currying",
    title: "Currying & Partial Application",
    shortLabel: "Currying",
    section: "JavaScript Core",
    domain: "Frontend",
    tldr:
      "Currying transforms a multi-argument function f(a, b, c) into a chain of single-argument functions f(a)(b)(c). It relies on closures to remember earlier arguments and defers running the original until all are supplied. Partial application is the looser cousin — it fixes some arguments and returns a function taking the rest.",
    subtopics: [
      {
        heading: "What currying is",
        bullets: [
          { icon: "🍛", text: "Turns `f(a, b, c)` into `f(a)(b)(c)` — a **sequence of unary (single-argument) functions**." },
          { icon: "🧠", text: "Each returned function is a **closure** that remembers the arguments collected so far." },
          { icon: "⏳", text: "The original runs **only when enough arguments** have arrived (`args.length >= fn.length`)." },
        ],
      },
      {
        heading: "vs partial application",
        bullets: [
          { icon: "🔀", text: "**Currying** always yields **unary** steps; **partial application** fixes some args and returns a function taking the **rest** (possibly several at once)." },
          { icon: "📌", text: "`fn.bind(null, a)` is the built-in way to **partially apply** the first argument(s)." },
          { icon: "🧩", text: "A good `curry` utility supports both: `mul(2)(3)(4)`, `mul(2, 3)(4)`, and `mul(2, 3, 4)` all work." },
        ],
      },
      {
        heading: "Why it's useful",
        bullets: [
          { icon: "♻️", text: "**Reusability** — build specialized functions from general ones (`errorLog = log('ERROR')`)." },
          { icon: "🔧", text: "**Composition & configuration** — unary functions compose cleanly; pre-fill settings once." },
          { icon: "📚", text: "Pervasive in **functional libraries** (Lodash/fp, Ramda) and Redux-style action creators." },
        ],
      },
    ],
    keyFacts: [
      { label: "Transformation", value: "f(a,b,c) → f(a)(b)(c)", icon: "🍛" },
      { label: "Powered by", value: "Closures", icon: "🧠" },
      { label: "Runs when", value: "args.length >= fn.length", icon: "⏳" },
      { label: "Partial app tool", value: "fn.bind(null, …)", icon: "📌" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'Chain of single-arg calls `f(a)(b)(c)`' → **currying**.",
        "'Fix some args, return a function for the rest' → **partial application**.",
        "A generic `curry` executes when **collected args ≥ fn.length**.",
        "`bind(null, x)` **partially applies** the leading argument.",
        "Specialized functions (loggers, validators) → **curry the general one**.",
      ],
      analogyBrief:
        "Currying is a vending machine that only dispenses after every coin is inserted one at a time; partial application is pre-loading a few coins and handing the machine to someone else to finish.",
    },
    explanation:
      "Currying is the technique of transforming a function that takes multiple arguments into a sequence of functions that each take a single argument — turning f(a, b, c) into f(a)(b)(c). It works because each function in the chain is a closure that remembers the arguments gathered so far, and the original function is only executed once all the required arguments have been supplied. This makes currying distinct from, though related to, partial application: currying always produces a chain of unary (one-argument) functions, whereas partial application simply fixes one or more arguments up front and returns a new function that accepts the remaining arguments (possibly several at once). In JavaScript the built-in fn.bind(null, arg) is a convenient way to partially apply the leading arguments. A well-written generic curry utility checks on each call whether it has collected enough arguments (by comparing args.length to the original function's declared arity, fn.length): if so it invokes the original, and if not it returns a new function that continues collecting — a flexible implementation lets you call it fully (mul(2, 3, 4)), one at a time (mul(2)(3)(4)), or in any grouping (mul(2, 3)(4)). The practical payoff is reusability and configuration: you can derive specialized functions from a general one — an error logger from a generic log, a specific validator from a generic validate rule — and because unary functions compose cleanly, currying is a cornerstone of functional programming and appears throughout libraries like Lodash/fp and Ramda as well as Redux-style action creators.",
    analogy:
      "Currying is like a vending machine that costs three coins but has only a one-coin slot. You feed it one coin (the first argument) and it politely waits, remembering your balance; you feed the second, it still waits; only when the third coin drops does it finally release the snack (run the original function). Partial application is the friendlier cousin: you drop in two of the coins, then hand the half-loaded machine to a colleague — they only need to add the last coin to get the snack. Either way the machine 'remembers' the coins already inserted, which is exactly the closure doing its job.",
    diagram: `<svg viewBox="0 0 720 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Currying transforms a function into a chain of unary calls">${svgDefs}
      ${box(30, 30, 170, 50, "add(a, b, c)", "arity 3", "#3b82f6")}
      <text x="215" y="60" fill="#f59e0b" font-size="12">curry →</text>
      ${box(290, 30, 110, 50, "add(a)", "returns fn", "#8b5cf6")}
      <text x="405" y="60" fill="#8b949e" font-size="14">→</text>
      ${box(425, 30, 90, 50, "(b)", "returns fn", "#8b5cf6")}
      <text x="520" y="60" fill="#8b949e" font-size="14">→</text>
      ${box(540, 30, 90, 50, "(c)", "runs it!", "#22c55e")}
      <text x="60" y="120" fill="#e6edf3" font-size="12">add(1, 2, 3)</text>
      <text x="220" y="120" fill="#8b949e" font-size="12">is equivalent to</text>
      <text x="380" y="120" fill="#22c55e" font-size="12">add(1)(2)(3)</text>
      <rect x="30" y="150" width="310" height="90" rx="10" fill="#161b22" stroke="#f59e0b"/>
      <text x="48" y="174" fill="#f59e0b" font-size="12" font-weight="700">Partial application</text>
      <text x="48" y="198" fill="#8b949e" font-size="11">const add5 = add.bind(null, 5)</text>
      <text x="48" y="220" fill="#8b949e" font-size="11">Fixes some args, returns fn for the rest.</text>
      <rect x="360" y="150" width="330" height="90" rx="10" fill="#161b22" stroke="#8b5cf6"/>
      <text x="378" y="174" fill="#8b5cf6" font-size="12" font-weight="700">Currying</text>
      <text x="378" y="198" fill="#8b949e" font-size="11">const add5 = curriedAdd(5)</text>
      <text x="378" y="220" fill="#8b949e" font-size="11">Each step is unary; runs at full arity.</text>
    </svg>`,
    diagramLegend: [
      { color: "#3b82f6", label: "Original function", description: "Multi-argument function with a fixed arity." },
      { color: "#8b5cf6", label: "Curried steps", description: "Unary closures that collect one argument each." },
      { color: "#22c55e", label: "Execution", description: "Runs once enough arguments are collected." },
    ],
    codeExample: {
      language: "javascript",
      title: "A generic curry utility (supports partial calls)",
      code: `function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return (...more) => curried.apply(this, args.concat(more));
  };
}

const multiply = (a, b, c) => a * b * c;
const curried = curry(multiply);

console.log(curried(2)(3)(4)); // 24  (one at a time)
console.log(curried(2, 3)(4)); // 24  (partial)
console.log(curried(2, 3, 4)); // 24  (all at once)`,
    },
    codeExamples: [
      {
        language: "javascript",
        tab: "Manual",
        title: "Manual currying and specialized functions",
        code: `// Non-curried
function add(a, b, c) {
  return a + b + c;
}
console.log(add(1, 2, 3)); // 6

// Manually curried
function curriedAdd(a) {
  return (b) => (c) => a + b + c;
}

console.log(curriedAdd(1)(2)(3)); // 6

// Build specialized functions
const add10 = curriedAdd(10);
const add10and20 = add10(20);
console.log(add10and20(5));   // 35
console.log(add10and20(100)); // 130`,
      },
      {
        language: "javascript",
        tab: "Generic curry",
        title: "One utility that handles any grouping of args",
        code: `function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return (...more) => curried.apply(this, args.concat(more));
  };
}

function multiply(a, b, c) {
  return a * b * c;
}
const curriedMul = curry(multiply);

console.log(curriedMul(2)(3)(4)); // 24
console.log(curriedMul(2, 3)(4)); // 24 (partial works too)
console.log(curriedMul(2)(3, 4)); // 24
console.log(curriedMul(2, 3, 4)); // 24 (all at once)`,
      },
      {
        language: "javascript",
        tab: "Logger factory",
        title: "Practical: derive specialized loggers",
        code: `function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args);
    return (...more) => curried(...args.concat(more));
  };
}

const log = curry(function (level, module, message) {
  console.log("[" + level + "] [" + module + "] " + message);
});

// Create specialized loggers from the general one
const errorLog = log("ERROR");
const apiError = errorLog("API");
const dbError = errorLog("DATABASE");

apiError("Failed to fetch /users");
apiError("Timeout on /products");
dbError("Connection refused");

const infoLog = log("INFO");
infoLog("AUTH", "User logged in");`,
      },
    ],
    problemStatement:
      "Your team's logging calls all repeat the same level and module strings, e.g. `log('ERROR', 'API', msg)` everywhere in the payments module. You want to write `apiError(msg)` instead, deriving it once from a general logger, and you also want a generic utility that lets other teams curry their own functions and call them with any grouping of arguments. Implement a curry helper, show how it produces the specialized logger, and explain how it differs from just using `bind`.",
    questions: [
      {
        q: "What does currying do to a function?",
        options: [
          "A. Makes it run faster",
          "B. Transforms a multi-argument function into a chain of single-argument functions",
          "C. Removes all its arguments",
          "D. Makes it asynchronous",
        ],
        answer: "B",
        explanation:
          "B is correct: currying transforms f(a, b, c) into f(a)(b)(c) — a sequence of unary functions. It does not change performance, remove arguments, or affect async behavior.",
      },
      {
        q: "What is the difference between currying and partial application?",
        options: [
          "A. They are identical",
          "B. Currying always returns unary functions; partial application fixes some args and may return a multi-arg function",
          "C. Partial application only works with two arguments",
          "D. Currying only works on async functions",
        ],
        answer: "B",
        explanation:
          "B is correct: currying produces a chain of one-argument functions, while partial application simply pre-fills some arguments and returns a function accepting the remaining ones (possibly several at once).",
      },
      {
        q: "In a generic `curry(fn)`, when does the ORIGINAL function actually execute?",
        options: [
          "A. Immediately on the first call",
          "B. When the number of collected arguments is at least fn.length",
          "C. Only after exactly one call",
          "D. Never",
        ],
        answer: "B",
        explanation:
          "B is correct: the curried wrapper compares collected args to the original's arity (fn.length) and invokes the original once it has enough; otherwise it returns a function that keeps collecting.",
      },
      {
        q: "Which built-in method is the simplest way to partially apply the leading argument of a function?",
        options: [
          "A. Function.prototype.call",
          "B. Function.prototype.apply",
          "C. Function.prototype.bind",
          "D. Array.prototype.reduce",
        ],
        answer: "C",
        explanation:
          "C is correct: `fn.bind(null, arg)` returns a new function with the first argument pre-filled — that is partial application. call and apply invoke immediately; reduce is unrelated.",
      },
      {
        q: "What mechanism lets a curried function 'remember' arguments from earlier calls?",
        options: [
          "A. Global variables",
          "B. Closures over the previously collected arguments",
          "C. The prototype chain",
          "D. The event loop",
        ],
        answer: "B",
        explanation:
          "B is correct: each function returned in the chain is a closure that retains the arguments gathered so far, accumulating them until the original can run. It does not rely on globals, prototypes, or the event loop.",
      },
      {
        q: "Given `const curriedAdd = a => b => c => a + b + c;`, what is `curriedAdd(1)(2)`?",
        options: [
          "A. 3",
          "B. A function expecting c",
          "C. undefined",
          "D. A TypeError",
        ],
        answer: "B",
        explanation:
          "B is correct: after supplying a and b, you still have one unary step left, so curriedAdd(1)(2) returns a function that expects c. Calling it as curriedAdd(1)(2)(3) would then return 6.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "fe-es6-features",
    title: "Modern JavaScript (ES6+)",
    shortLabel: "ES6+ Features",
    section: "JavaScript Core",
    domain: "Frontend",
    tldr:
      "ES6 and later added destructuring (pull values out of arrays/objects), the spread/rest operators (`...` expands or collects), template literals, arrow functions with lexical `this`, default parameters, and the safety pair optional chaining (`?.`) and nullish coalescing (`??`). Spread and rest share syntax but do opposite things; `??` only falls back on null/undefined, unlike `||`.",
    subtopics: [
      {
        heading: "Destructuring",
        bullets: [
          { icon: "📥", text: "Pull values out by shape: `const { name, age } = user` and `const [first, ...rest] = arr`." },
          { icon: "🏷️", text: "Supports **renaming** (`{ name: fullName }`), **defaults** (`{ role = 'user' }`), and **nested** patterns." },
          { icon: "🔁", text: "Enables clean idioms like **swapping** (`[a, b] = [b, a]`) and destructuring **function parameters**." },
        ],
      },
      {
        heading: "Spread vs Rest",
        bullets: [
          { icon: "💨", text: "**Spread** *expands*: `[...a, ...b]`, `{ ...o1, ...o2 }`, `fn(...args)` — copies and merges (shallow!)." },
          { icon: "🧺", text: "**Rest** *collects*: `function fn(...args)` and `const [head, ...tail] = arr` gather the remainder." },
          { icon: "⚠️", text: "Same `...` syntax, **opposite** operations; object spread is a **shallow** copy (nested refs are shared)." },
        ],
      },
      {
        heading: "Safety & syntax sugar",
        bullets: [
          { icon: "🛟", text: "**Optional chaining** `a?.b?.c` short-circuits to `undefined` instead of throwing on a null/undefined link." },
          { icon: "🔀", text: "**Nullish coalescing** `x ?? fallback` uses the fallback only for `null`/`undefined` (not `0`, `''`, `false`)." },
          { icon: "✨", text: "Plus **template literals**, **arrow functions** (lexical `this`), **default parameters**, `for…of`, `Map`/`Set`, and **modules**." },
        ],
      },
    ],
    keyFacts: [
      { label: "Spread (...)", value: "Expands / copies", icon: "💨" },
      { label: "Rest (...)", value: "Collects remainder", icon: "🧺" },
      { label: "?. on null/undefined", value: "Returns undefined", icon: "🛟" },
      { label: "?? falls back on", value: "null / undefined only", icon: "🔀" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "`{ a: b } = obj` → extract `a`, bind it to a variable named **b** (rename).",
        "Spread **expands**, rest **collects** — same `...`, opposite jobs.",
        "`0 ?? 'x'` → **0**; `0 || 'x'` → **'x'** (`??` ignores falsy-but-defined values).",
        "`user?.address?.city` → **undefined** instead of a crash.",
        "Object spread is a **shallow** copy — nested objects stay shared.",
      ],
      analogyBrief:
        "Destructuring is unpacking a labeled grocery bag straight into the right cupboards; spread empties a bag onto the counter, rest sweeps the leftovers into one new bag.",
    },
    explanation:
      "ES6 (ES2015) and the yearly releases since then modernized JavaScript with several features that dominate everyday code. Destructuring lets you extract values from arrays and objects by describing their shape: const { name, age } = user for objects and const [first, ...rest] = arr for arrays, with support for renaming (const { name: fullName } = obj), default values (const { role = 'user' } = obj), nested patterns, and parameter destructuring in function signatures — it also enables the clean variable swap [a, b] = [b, a]. The spread and rest operators share the same ... syntax but do opposite things: spread expands an iterable or object's contents outward, so you can merge arrays ([...a, ...b]), shallow-clone or override objects ({ ...original, a: 99 }), and pass array elements as individual arguments (fn(...args)); rest collects multiple elements into one, gathering leftover function arguments (function fn(...args)) or the tail of a destructuring pattern (const [head, ...tail] = arr). A crucial caveat is that object/array spread performs only a shallow copy, so nested objects are still shared by reference. Two features add safety: optional chaining (?.) short-circuits and returns undefined the moment it hits a null or undefined link instead of throwing a TypeError (user?.phone?.number, and it works for calls a?.b?.() and indexes a?.[0]), while nullish coalescing (??) provides a fallback only when the left side is null or undefined — unlike the logical OR (||), it does not treat 0, empty string, or false as missing, which prevents a whole class of bugs. Rounding out the toolkit are template literals with interpolation and multi-line strings, arrow functions with their lexical this, default parameters, the for…of loop over iterables, the Map and Set data structures, Symbols, and native ES modules (import/export).",
    analogy:
      "Think of a delivery of labeled grocery bags. Destructuring is unpacking a bag by its labels and putting each item straight into the correct cupboard in one motion (const { milk, eggs } = groceries). Spread is tipping a whole bag out onto the counter so its items mingle with another bag's items (merging arrays/objects). Rest is the opposite move: after you grab the first few items you want, you sweep everything left over into a single new bag (const [first, ...restOfItems] = list). Optional chaining is checking 'is there even a bag here?' before reaching in — if not, you calmly get 'nothing' back instead of knocking the shelf over (a crash). And nullish coalescing is a rule that says 'only grab the backup bag if the main one is truly absent' — an empty-but-present bag (0 or '') still counts.",
    diagram: `<svg viewBox="0 0 720 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Spread vs rest and destructuring">${svgDefs}
      <rect x="20" y="20" width="330" height="110" rx="10" fill="#161b22" stroke="#3b82f6"/>
      <text x="40" y="44" fill="#3b82f6" font-size="13" font-weight="700">Spread (...) → expands</text>
      <text x="40" y="70" fill="#8b949e" font-size="11">[...arr1, ...arr2]</text>
      <text x="40" y="90" fill="#8b949e" font-size="11">{ ...obj1, key: val }</text>
      <text x="40" y="114" fill="#22c55e" font-size="11">copies + merges (shallow)</text>
      <rect x="370" y="20" width="330" height="110" rx="10" fill="#161b22" stroke="#f59e0b"/>
      <text x="390" y="44" fill="#f59e0b" font-size="13" font-weight="700">Rest (...) → collects</text>
      <text x="390" y="70" fill="#8b949e" font-size="11">const [a, ...rest] = arr</text>
      <text x="390" y="90" fill="#8b949e" font-size="11">function fn(...args)</text>
      <text x="390" y="114" fill="#22c55e" font-size="11">gathers the remainder</text>
      <rect x="20" y="150" width="680" height="55" rx="10" fill="#1a2332" stroke="#22c55e"/>
      <text x="40" y="174" fill="#22c55e" font-size="13" font-weight="700">Destructuring</text>
      <text x="40" y="196" fill="#8b949e" font-size="11">const { name, age = 0 } = obj      const [a, , c] = arr      const { x: renamed } = obj</text>
      <rect x="20" y="220" width="680" height="50" rx="10" fill="#161b22" stroke="#8b5cf6"/>
      <text x="40" y="243" fill="#8b5cf6" font-size="12" font-weight="700">Safety</text>
      <text x="40" y="261" fill="#8b949e" font-size="11">a?.b?.c → undefined (no crash)      x ?? fallback → only when x is null/undefined</text>
    </svg>`,
    diagramLegend: [
      { color: "#3b82f6", label: "Spread", description: "Expands an iterable/object; copies and merges (shallow)." },
      { color: "#f59e0b", label: "Rest", description: "Collects the remaining elements into one." },
      { color: "#22c55e", label: "Destructuring", description: "Extracts values by shape, with rename and defaults." },
    ],
    codeExample: {
      language: "javascript",
      title: "Optional chaining and nullish coalescing in practice",
      code: `const user = { name: "Kumar", address: { city: "Bangalore" } };

console.log(user?.phone?.number);   // undefined (no crash)
console.log(user?.address?.city);   // "Bangalore"

// ?? only falls back on null / undefined
const count = 0;
console.log(count || "none");       // "none"  (0 is falsy — wrong here)
console.log(count ?? "none");       // 0       (correct)`,
    },
    codeExamples: [
      {
        language: "javascript",
        tab: "Destructuring",
        title: "Object, array, nested, and parameter destructuring",
        code: `// Object destructuring with rename + default
const user = { name: "Kumar", age: 25, role: "Developer" };
const { name, age, role: jobTitle, country = "India" } = user;
console.log(name, age, jobTitle, country);

// Nested destructuring
const response = {
  data: { users: [{ id: 1, name: "Alice" }], total: 100 },
  status: 200,
};
const { data: { users: [firstUser], total }, status } = response;
console.log(firstUser, total, status);

// Array destructuring (skip 2nd) + rest
const [a, , c, ...rest] = [1, 2, 3, 4, 5];
console.log(a, c, rest); // 1 3 [4, 5]

// Swap without a temp variable
let x = 10, y = 20;
[x, y] = [y, x];
console.log(x, y); // 20 10

// Parameter destructuring with defaults
function createUser({ name, age = 18, role = "user" }) {
  console.log(name + " (" + age + ") - " + role);
}
createUser({ name: "Dev", age: 30 });`,
      },
      {
        language: "javascript",
        tab: "Spread & Rest",
        title: "Same syntax, opposite operations (and shallow copy)",
        code: `// Spread: expand arrays
const merged = [...[1, 2, 3], ...[4, 5, 6]];
console.log(merged); // [1, 2, 3, 4, 5, 6]

// Spread: shallow-clone / override objects
const original = { a: 1, b: { c: 2 } };
const clone = { ...original, a: 99 };
clone.b.c = 999;                       // shallow! nested ref is shared
console.log(original.b.c);             // 999 (mutated the original)

// Rest: collect function arguments
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}
console.log(sum(1, 2, 3, 4, 5)); // 15

// Rest in destructuring
const { a: first, ...remaining } = { a: 1, b: 2, c: 3 };
console.log(first, remaining); // 1 { b: 2, c: 3 }`,
      },
      {
        language: "javascript",
        tab: "?. and ??",
        title: "Optional chaining and nullish coalescing",
        code: `const user = { name: "Kumar", address: { city: "Bangalore" } };

// Optional chaining — safe access
console.log(user?.phone?.number); // undefined (no crash)
console.log(user?.address?.city); // "Bangalore"
console.log(user?.getAge?.());    // undefined (optional call)
console.log(user?.hobbies?.[0]);  // undefined (optional index)

// Nullish coalescing vs logical OR
console.log(0 || "fallback");        // "fallback" (0 is falsy)
console.log(0 ?? "fallback");        // 0          (?? ignores falsy-but-defined)
console.log("" ?? "fallback");       // ""
console.log(null ?? "fallback");     // "fallback"
console.log(undefined ?? "default"); // "default"`,
      },
    ],
    problemStatement:
      "An API returns user objects where optional fields (phone, address.city, preferences.theme) may be missing, and reading them with dot access currently throws 'cannot read property of undefined'. A separate bug: a settings form treats a saved value of `0` (e.g. volume) as 'not set' because it uses `value || defaultValue`. Rewrite the access to be crash-safe and fix the default-value logic, and explain why `??` behaves differently from `||` and why object spread doesn't deep-clone the nested settings.",
    questions: [
      {
        q: "What is the difference between the spread and rest operators?",
        options: [
          "A. They are the same thing",
          "B. Spread expands elements outward; rest collects multiple elements into one",
          "C. Spread only works on objects, rest only on arrays",
          "D. Rest is faster than spread",
        ],
        answer: "B",
        explanation:
          "B is correct: they share the `...` syntax but are opposites — spread expands (merge/copy), rest gathers the remaining elements into a single array or object.",
      },
      {
        q: "What does `const { a: b } = obj` do?",
        options: [
          "A. Creates two properties a and b",
          "B. Extracts property a from obj and binds it to a new variable named b",
          "C. Sets obj.a equal to b",
          "D. Deletes property a",
        ],
        answer: "B",
        explanation:
          "B is correct: this destructures the property `a` from obj and assigns its value to a variable called `b` (a rename). There is no variable `a` created.",
      },
      {
        q: "What does `0 ?? 'fallback'` return?",
        options: ["A. 'fallback'", "B. 0", "C. null", "D. undefined"],
        answer: "B",
        explanation:
          "B is correct: nullish coalescing falls back only for null or undefined. Since 0 is neither, it returns 0. (`0 || 'fallback'` would return 'fallback' because 0 is falsy.)",
      },
      {
        q: "What does `user?.address?.city` return when `user.address` is undefined?",
        options: [
          "A. It throws a TypeError",
          "B. undefined",
          "C. null",
          "D. An empty string",
        ],
        answer: "B",
        explanation:
          "B is correct: optional chaining short-circuits at the first null/undefined link and returns undefined instead of throwing. Without `?.`, reading `.city` of undefined would throw a TypeError.",
      },
      {
        q: "After `const clone = { ...original }` where `original = { b: { c: 2 } }`, then `clone.b.c = 99`, what is `original.b.c`?",
        options: ["A. 2", "B. 99", "C. undefined", "D. TypeError"],
        answer: "B",
        explanation:
          "B is correct: object spread is a SHALLOW copy, so clone.b and original.b point to the same nested object. Mutating clone.b.c also changes original.b.c to 99.",
      },
      {
        q: "Which statement about `??` versus `||` is accurate?",
        options: [
          "A. They are interchangeable in all cases",
          "B. `||` falls back on any falsy value; `??` falls back only on null or undefined",
          "C. `??` falls back on any falsy value; `||` only on null/undefined",
          "D. Neither handles undefined",
        ],
        answer: "B",
        explanation:
          "B is correct: `||` treats 0, '', false, NaN, null, and undefined as reasons to use the fallback, whereas `??` only uses the fallback for null or undefined — preserving valid falsy values like 0 and ''.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "fe-array-methods",
    title: "Array Methods & Higher-Order Functions",
    shortLabel: "Array Methods",
    section: "JavaScript Core",
    domain: "Frontend",
    tldr:
      "A higher-order function takes a function as an argument or returns one. The workhorses are map (transform each element into a new array), filter (keep elements passing a test), and reduce (fold everything into a single value). map/filter/reduce return new values and don't mutate the source — but sort and reverse mutate in place.",
    subtopics: [
      {
        heading: "The big three",
        bullets: [
          { icon: "🔁", text: "**map(fn)** transforms each element and returns a **new array of the same length**." },
          { icon: "🔍", text: "**filter(fn)** keeps only elements for which the callback returns **truthy**, returning a new (shorter/equal) array." },
          { icon: "🧮", text: "**reduce(fn, init)** accumulates all elements into a **single value** (a number, string, object, or array)." },
        ],
      },
      {
        heading: "Search & test helpers",
        bullets: [
          { icon: "🎯", text: "**find** returns the first matching element; **findIndex** returns its index (or -1)." },
          { icon: "✅", text: "**some** is true if **any** element passes; **every** is true if **all** pass (both short-circuit)." },
          { icon: "🫓", text: "**flat / flatMap** flatten nested arrays; **forEach** runs side effects and returns nothing." },
        ],
      },
      {
        heading: "Purity & chaining",
        bullets: [
          { icon: "🧼", text: "map/filter/reduce are **non-mutating** — great for readable **chains** like `.filter().map().reduce()`." },
          { icon: "⚠️", text: "**sort** and **reverse** mutate the original array **in place** — copy first (`[...arr].sort()`) if you need it intact." },
          { icon: "🔤", text: "Default `sort` compares as **strings** — pass a comparator for numbers (`(a, b) => a - b`)." },
        ],
      },
    ],
    keyFacts: [
      { label: "map returns", value: "New array, same length", icon: "🔁" },
      { label: "filter returns", value: "New array, matching only", icon: "🔍" },
      { label: "reduce returns", value: "One accumulated value", icon: "🧮" },
      { label: "Mutating methods", value: "sort, reverse (in place)", icon: "⚠️" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'Transform every element' → **map**; 'select some' → **filter**; 'fold to one value' → **reduce**.",
        "map/filter/reduce **don't mutate**; **sort** and **reverse** **do**.",
        "Default `sort` is **lexicographic** — use `(a, b) => a - b` for numbers.",
        "**some**/**every** short-circuit; **find** returns the element, **findIndex** the index.",
        "**forEach** returns undefined — use it only for side effects.",
      ],
      analogyBrief:
        "map is repainting every car on a lot the same new color; filter is towing away only the cars that fail inspection; reduce is crushing the whole lot into a single cube.",
    },
    explanation:
      "A higher-order function is one that either takes a function as an argument or returns a function; the array iteration methods are the everyday example. map takes a callback, applies it to every element, and returns a new array of the same length with the transformed values. filter takes a predicate and returns a new array containing only the elements for which the predicate is truthy. reduce is the most general: it walks the array carrying an accumulator (seeded by the optional initial value) and combines each element into it via the callback, folding the whole array down to a single result — which can be a number, a string, or even a new object or array (so map and filter can both be expressed in terms of reduce). Beyond the big three, find returns the first element matching a condition (and findIndex its index, or -1), some returns true if at least one element passes while every returns true only if all pass (both short-circuit as soon as the answer is known), flat and flatMap flatten nested arrays (flatMap being map followed by a single level of flattening), and forEach runs the callback purely for its side effects and returns undefined. A key mental model is purity: map, filter, and reduce do not mutate the source array, which is what makes chaining them (for example filter then map then reduce) so clean and predictable; by contrast sort and reverse mutate the array in place, so if you need the original preserved you should copy it first with the spread operator. One classic gotcha is that the default sort converts elements to strings and compares lexicographically, so sorting numbers requires an explicit comparator such as (a, b) => a - b.",
    analogy:
      "Picture a used-car lot. map is sending every car through the same paint booth: you get back the same number of cars, each transformed (all now red). filter is running every car through inspection and driving off the lot only the ones that pass, so you may end up with fewer cars. reduce is the car crusher: you feed the entire lot through and it compacts everything down into a single cube (one value). find is walking the rows until you spot the first blue car and stopping there. And sort is the one operation that rearranges the actual cars on the actual lot rather than handing you a fresh copy — do it carelessly and you've disturbed the original arrangement for everyone.",
    diagram: `<svg viewBox="0 0 720 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="map, filter, and reduce">${svgDefs}
      <text x="30" y="30" fill="#8b949e" font-size="12">[1, 2, 3, 4, 5]</text>
      ${box(20, 45, 200, 55, "map(x => x*2)", "[2, 4, 6, 8, 10]", "#3b82f6")}
      ${box(260, 45, 200, 55, "filter(x => x > 2)", "[3, 4, 5]", "#22c55e")}
      ${box(500, 45, 200, 55, "reduce((a,x)=>a+x, 0)", "15", "#f59e0b")}
      <rect x="20" y="125" width="680" height="55" rx="10" fill="#161b22" stroke="#8b5cf6"/>
      <text x="40" y="148" fill="#8b5cf6" font-size="12" font-weight="700">Chaining (non-mutating)</text>
      <text x="40" y="168" fill="#8b949e" font-size="11">[1,2,3,4,5].filter(x =&gt; x &gt; 2).map(x =&gt; x * 10).reduce((a,x) =&gt; a + x, 0)  →  120</text>
      <rect x="20" y="195" width="680" height="50" rx="10" fill="#1a2332" stroke="#f85149"/>
      <text x="40" y="218" fill="#f85149" font-size="12" font-weight="700">Mutates in place</text>
      <text x="40" y="236" fill="#8b949e" font-size="11">sort() and reverse() change the original array — copy first with [...arr] to keep it intact.</text>
    </svg>`,
    diagramLegend: [
      { color: "#3b82f6", label: "map", description: "Transforms each element; new array of same length." },
      { color: "#22c55e", label: "filter", description: "Keeps elements passing the predicate." },
      { color: "#f59e0b", label: "reduce", description: "Folds all elements into a single value." },
    ],
    codeExample: {
      language: "javascript",
      title: "Chaining filter → map → reduce (no mutation)",
      code: `const products = [
  { name: "Laptop", price: 999, inStock: true },
  { name: "Phone", price: 699, inStock: false },
  { name: "Tablet", price: 499, inStock: true },
];

const inStockTotal = products
  .filter((p) => p.inStock)        // keep available
  .map((p) => p.price)             // just the prices
  .reduce((sum, price) => sum + price, 0); // add them up

console.log(inStockTotal); // 1498
console.log(products.length); // 3 — original untouched`,
    },
    codeExamples: [
      {
        language: "javascript",
        tab: "map/filter/reduce",
        title: "The big three on real data",
        code: `const products = [
  { name: "Laptop", price: 999, inStock: true },
  { name: "Phone", price: 699, inStock: false },
  { name: "Tablet", price: 499, inStock: true },
  { name: "Watch", price: 299, inStock: true },
];

// filter: only in-stock items
const available = products.filter((p) => p.inStock);
console.log(available.map((p) => p.name)); // ["Laptop", "Tablet", "Watch"]

// map: add a 20%-off sale price (non-mutating via spread)
const discounted = products.map((p) => ({
  ...p,
  salePrice: Math.round(p.price * 0.8),
}));
console.log(discounted[0].salePrice); // 799

// reduce: total value of in-stock items
const total = products
  .filter((p) => p.inStock)
  .reduce((sum, p) => sum + p.price, 0);
console.log(total); // 1797`,
      },
      {
        language: "javascript",
        tab: "reduce power",
        title: "reduce builds objects, not just numbers",
        code: `// Tally votes into an object with reduce
const votes = ["yes", "no", "yes", "yes", "no", "yes"];
const tally = votes.reduce((acc, vote) => {
  acc[vote] = (acc[vote] || 0) + 1;
  return acc;
}, {});
console.log(tally); // { yes: 4, no: 2 }

// Group people by first letter
const names = ["Alice", "Bob", "Anna", "Charlie", "Ben"];
const grouped = names.reduce((acc, n) => {
  const key = n[0];
  (acc[key] ||= []).push(n);
  return acc;
}, {});
console.log(grouped); // { A: ["Alice", "Anna"], B: ["Bob", "Ben"], C: ["Charlie"] }`,
      },
      {
        language: "javascript",
        tab: "find/some/flat/sort",
        title: "Search helpers and the sort gotcha",
        code: `const users = [
  { name: "Alice", age: 25, active: true },
  { name: "Bob", age: 17, active: true },
  { name: "Charlie", age: 30, active: false },
];

console.log(users.find((u) => u.age > 20).name); // "Alice"
console.log(users.findIndex((u) => !u.active));   // 2
console.log(users.some((u) => u.age < 18));       // true
console.log(users.every((u) => u.active));        // false

// flat / flatMap
console.log([1, [2, 3], [4, [5]]].flat(Infinity)); // [1, 2, 3, 4, 5]
console.log(["a b", "c d"].flatMap((s) => s.split(" "))); // ["a","b","c","d"]

// sort gotcha: default is lexicographic!
console.log([10, 1, 2].sort());            // [1, 10, 2]  (wrong for numbers)
console.log([10, 1, 2].sort((a, b) => a - b)); // [1, 2, 10] (correct)`,
      },
    ],
    problemStatement:
      "Given an array of order objects `{ id, total, status }`, you must produce (a) the list of ids for orders with status 'paid', (b) the sum of their totals, and (c) a breakdown object counting orders per status — all without mutating the original array. A colleague also reports that `orders.sort((a, b) => b.total - a.total)` seems to change the original array elsewhere. Explain which methods to chain, why map/filter/reduce are safe but sort is not, and how to sort without side effects.",
    questions: [
      {
        q: "What does `map` return?",
        options: [
          "A. The original array, mutated",
          "B. A new array of the same length with each element transformed",
          "C. A single accumulated value",
          "D. undefined",
        ],
        answer: "B",
        explanation:
          "B is correct: map always returns a NEW array of the same length, applying the callback to each element. It does not mutate the source or accumulate to one value (that's reduce).",
      },
      {
        q: "What does `reduce` do?",
        options: [
          "A. Removes elements from the array",
          "B. Shrinks the array length by one",
          "C. Accumulates all elements into a single value using the callback",
          "D. Sorts the array",
        ],
        answer: "C",
        explanation:
          "C is correct: reduce folds the array into a single value (number, string, object, or array) by carrying an accumulator across elements. It doesn't delete elements or sort.",
      },
      {
        q: "Which of these array methods MUTATES the original array?",
        options: ["A. map", "B. filter", "C. sort", "D. reduce"],
        answer: "C",
        explanation:
          "C is correct: sort() (like reverse) sorts in place, mutating the original array. map, filter, and reduce return new values and leave the source unchanged.",
      },
      {
        q: "What is a higher-order function?",
        options: [
          "A. A function with more than three parameters",
          "B. A function that takes a function as an argument and/or returns a function",
          "C. A function defined at the top of a file",
          "D. An async function",
        ],
        answer: "B",
        explanation:
          "B is correct: a higher-order function accepts a function argument or returns a function. map, filter, and reduce are higher-order because they take callbacks.",
      },
      {
        q: "What does `[10, 1, 2].sort()` (no comparator) return?",
        options: [
          "A. [1, 2, 10]",
          "B. [10, 2, 1]",
          "C. [1, 10, 2]",
          "D. [10, 1, 2]",
        ],
        answer: "C",
        explanation:
          "C is correct: the default sort converts elements to strings and compares lexicographically, so '1' < '10' < '2', giving [1, 10, 2]. For numeric order pass a comparator like (a, b) => a - b.",
      },
      {
        q: "You need to know whether AT LEAST ONE element passes a test. Which method fits best?",
        options: ["A. every", "B. some", "C. forEach", "D. map"],
        answer: "B",
        explanation:
          "B is correct: some returns true if any element passes (and short-circuits). every requires ALL to pass; forEach returns nothing; map transforms every element.",
      },
    ],
  },
];
