// ============================================================
// SECTION: Async & Event Loop — the JavaScript concurrency model.
// Covers the event loop (microtasks vs macrotasks) and Promises / async-await.
// ============================================================
import { svgDefs, type Topic } from "./shared";

const box = (
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  sub: string,
  color = "#e11d8f",
) => `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#243349" stroke="${color}"/>
  <text x="${x + w / 2}" y="${y + h / 2 - 2}" text-anchor="middle" fill="#e6edf3" font-size="12" font-weight="600">${title}</text>
  <text x="${x + w / 2}" y="${y + h / 2 + 15}" text-anchor="middle" fill="#8b949e" font-size="10">${sub}</text>
`;

export const frontendAsyncTopics: Topic[] = [
  // -----------------------------------------------------------------
  {
    id: "fe-event-loop",
    title: "The Event Loop, Microtasks & Macrotasks",
    shortLabel: "Event Loop",
    section: "Async & Event Loop",
    domain: "Frontend",
    tldr:
      "JavaScript is single-threaded: one call stack, one thing at a time. The event loop lets it stay responsive by offloading async work (setTimeout, fetch, DOM events) to the host (Web APIs), then feeding completed callbacks back in. Priority is strict: run all synchronous code, then drain the ENTIRE microtask queue (Promise .then, async/await continuations, queueMicrotask), then run ONE macrotask (setTimeout/setInterval/I/O), re-draining microtasks between each. That is why `Promise.resolve().then(...)` always beats `setTimeout(fn, 0)`.",
    subtopics: [
      {
        heading: "The moving parts",
        bullets: [
          { icon: "🧵", text: "**Single-threaded**: one **call stack** (LIFO) executes functions one at a time — long sync work **blocks** everything, including rendering." },
          { icon: "🌐", text: "**Web APIs / host**: the browser (or Node) runs `setTimeout`, `fetch`, and DOM events **off-thread**; when they finish, their callback is queued." },
          { icon: "📥", text: "**Two queues**: the **macrotask (callback/task) queue** holds `setTimeout`/`setInterval`/I/O callbacks; the **microtask queue** holds Promise reactions, `await` continuations, `queueMicrotask`, and `MutationObserver`." },
        ],
      },
      {
        heading: "The loop's algorithm",
        bullets: [
          { icon: "1️⃣", text: "Run all **synchronous** code until the call stack is empty." },
          { icon: "2️⃣", text: "Drain the **ENTIRE microtask queue** — including microtasks that other microtasks schedule — before doing anything else." },
          { icon: "3️⃣", text: "Take **ONE macrotask**, run it, then **re-drain all microtasks**; the browser may render between macrotasks; repeat forever." },
        ],
      },
      {
        heading: "Practical consequences",
        bullets: [
          { icon: "⏱️", text: "`setTimeout(fn, 0)` does **not** mean 'now' — it means 'after current sync code and all pending microtasks'." },
          { icon: "⚡", text: "`Promise.resolve().then(fn)` runs **before** any `setTimeout`, even a 0 ms one, because microtasks outrank macrotasks." },
          { icon: "🚫", text: "An infinite chain of microtasks can **starve** macrotasks and freeze the UI — never busy-loop by re-scheduling microtasks." },
        ],
      },
    ],
    keyFacts: [
      { label: "Threading model", value: "Single-threaded + event loop", icon: "🧵" },
      { label: "Priority order", value: "Sync > Microtask > Macrotask", icon: "🥇" },
      { label: "Microtask drain", value: "ALL of them, each cycle", icon: "⚡" },
      { label: "Macrotask per cycle", value: "Exactly ONE", icon: "1️⃣" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'What runs first, `setTimeout(fn,0)` or `Promise.then`?' → **Promise (microtask)**.",
        "Microtasks = Promise `.then`/`.catch`/`.finally`, `await` continuation, `queueMicrotask`.",
        "Macrotasks = `setTimeout`, `setInterval`, I/O, UI events.",
        "Event loop only pulls from a queue **when the call stack is empty**.",
        "All microtasks drain **before** the next macrotask (and between every macrotask).",
      ],
      analogyBrief:
        "A single cashier (the stack) serves VIP express customers (microtasks) completely before calling the next regular ticket (a macrotask) from the waiting room.",
    },
    explanation:
      "JavaScript executes on a single thread with a single call stack, meaning it can only do one thing at a time; if you run a long synchronous loop, nothing else — not another callback, not even a screen repaint — can happen until it returns. The event loop is the concurrency mechanism that keeps this single-threaded model responsive. When you call an asynchronous API such as setTimeout, fetch, or attach a DOM event listener, the actual timing/network/event work is handled by the host environment (the browser's Web APIs, or libuv in Node) off the main thread; when that work completes, its callback is placed into a queue rather than running immediately. There are two queues with different priorities. The macrotask queue (also called the task or callback queue) holds callbacks from setTimeout, setInterval, and I/O, while the microtask queue holds Promise reactions (.then/.catch/.finally handlers), the continuation of an async function after an await, explicit queueMicrotask calls, and MutationObserver callbacks. The event loop follows a strict algorithm: first it runs all synchronous code until the call stack is empty; then it drains the entire microtask queue — importantly, if a microtask schedules another microtask, that new one is also run in the same drain, so the queue is emptied completely; only then does it take exactly one macrotask, run it, and immediately re-drain all microtasks again before taking the next macrotask (the browser may also paint between macrotasks). This ordering — synchronous, then microtasks, then a single macrotask — explains the two facts every interviewer probes: setTimeout(fn, 0) does not run 'immediately' but only after the current synchronous code and all pending microtasks, and Promise.resolve().then(fn) always runs before a zero-delay setTimeout because microtasks outrank macrotasks. It also explains a subtle danger: because the loop insists on emptying the microtask queue before moving on, an ever-growing chain of microtasks can starve macrotasks and freeze the page.",
    analogy:
      "Picture a shop with a single cashier (the call stack) who can serve only one customer at a time. Regular customers take a numbered ticket and sit in the waiting room — that's the macrotask queue (your setTimeout callbacks). But there is also a VIP express lane for microtasks (Promise callbacks). The rule is absolute: whenever the cashier is free, they must serve every single VIP in the express lane — and if a VIP invites more VIPs while being served, those get served too — before ever calling the next numbered ticket. So a Promise (VIP) always jumps ahead of a setTimeout (ticket), no matter that the ticket has 'zero wait' printed on it. And if VIPs keep arriving forever, the ticketed customers never get served — the shop appears frozen.",
    diagram: `<svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="JavaScript event loop: call stack, Web APIs, microtask and macrotask queues">${svgDefs}
      ${box(20, 40, 150, 150, "Call Stack", "LIFO · sync", "#3b82f6")}
      <text x="95" y="215" text-anchor="middle" fill="#8b949e" font-size="10">runs one frame at a time</text>
      ${box(230, 40, 170, 70, "Web APIs / Host", "setTimeout · fetch · DOM", "#f59e0b")}
      <line x1="170" y1="90" x2="228" y2="75" stroke="#8b949e" stroke-width="2" marker-end="url(#arrow-mute)"/>
      <text x="180" y="70" fill="#8b949e" font-size="9">offload</text>
      ${box(230, 140, 170, 55, "Microtask Queue", "Promise · await · queueMicrotask", "#22c55e")}
      ${box(230, 210, 170, 55, "Macrotask Queue", "timers · I/O · events", "#e11d8f")}
      <line x1="315" y1="110" x2="315" y2="138" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(450, 90, 180, 150, "Event Loop", "", "#8b5cf6")}
      <text x="465" y="130" fill="#e6edf3" font-size="10">1. stack empty?</text>
      <text x="465" y="150" fill="#7ee787" font-size="10">2. drain ALL microtasks</text>
      <text x="465" y="170" fill="#f472b6" font-size="10">3. run ONE macrotask</text>
      <text x="465" y="190" fill="#8b949e" font-size="10">4. repeat 🔁</text>
      <line x1="400" y1="167" x2="448" y2="150" stroke="#22c55e" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="400" y1="237" x2="448" y2="200" stroke="#e11d8f" stroke-width="2" marker-end="url(#arrow)"/>
      <path d="M540 90 C560 60 200 40 95 38" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#arrow)"/>
      <text x="300" y="30" fill="#8b5cf6" font-size="10">push next callback onto stack</text>
      <text x="380" y="300" text-anchor="middle" fill="#8b949e" font-size="11">Priority: Sync code  &gt;  Microtasks (Promises)  &gt;  Macrotasks (setTimeout)</text>
    </svg>`,
    diagramLegend: [
      { color: "#3b82f6", label: "Call stack", description: "Where synchronous frames execute, one at a time (LIFO)." },
      { color: "#22c55e", label: "Microtask queue", description: "Promise/await callbacks — fully drained before any macrotask." },
      { color: "#e11d8f", label: "Macrotask queue", description: "Timer, I/O and event callbacks — one per loop cycle." },
    ],
    codeExample: {
      language: "javascript",
      title: "Classic ordering question: sync → microtask → macrotask",
      code: `console.log("1 - Start");

setTimeout(() => {
  console.log("2 - setTimeout");
}, 0);

Promise.resolve().then(() => {
  console.log("3 - Promise");
});

console.log("4 - End");

// Output order: 1, 4, 3, 2
// Why? Sync first (1,4), then the microtask (3),
// then finally the macrotask (2) — even at 0 ms.`,
    },
    codeExamples: [
      {
        language: "javascript",
        tab: "Classic question",
        title: "Classic ordering: sync → microtask → macrotask",
        code: `console.log("1 - Start");

setTimeout(() => {
  console.log("2 - setTimeout");
}, 0);

Promise.resolve().then(() => {
  console.log("3 - Promise");
});

console.log("4 - End");

// Output order: 1, 4, 3, 2
// Sync first (1,4), then microtask (3), then macrotask (2).`,
      },
      {
        language: "javascript",
        tab: "Microtask drain",
        title: "All microtasks drain before ANY setTimeout",
        code: `console.log("Start");

setTimeout(() => console.log("Timeout 1"), 0);
setTimeout(() => console.log("Timeout 2"), 0);

Promise.resolve()
  .then(() => {
    console.log("Promise 1");
    // A microtask scheduled inside a microtask still runs
    // BEFORE any setTimeout — the queue is drained fully.
    Promise.resolve().then(() => console.log("Promise 1-inner"));
  })
  .then(() => console.log("Promise 2"));

Promise.resolve().then(() => console.log("Promise 3"));

console.log("End");

// Order: Start, End, Promise 1, Promise 3,
//        Promise 1-inner, Promise 2, Timeout 1, Timeout 2`,
      },
      {
        language: "javascript",
        tab: "await = microtask",
        title: "Code after await is a microtask continuation",
        code: `async function demo() {
  console.log("1 - async start"); // runs synchronously

  const result = await Promise.resolve("resolved");
  // Everything after await behaves like a .then() -> microtask
  console.log("2 - after await:", result);
  return "done";
}

console.log("3 - before calling demo");
demo().then((val) => console.log("4 - demo returned:", val));
console.log("5 - after calling demo");

// Order: 3, 1, 5, 2, 4
// "1" and "5" are sync; "2" and "4" are microtasks.`,
      },
    ],
    problemStatement:
      "Predict the exact console output of the following and justify each line by which queue it lands in:\n\n  console.log('A');\n  setTimeout(() => console.log('B'), 0);\n  Promise.resolve().then(() => console.log('C')).then(() => console.log('D'));\n  (async () => { console.log('E'); await null; console.log('F'); })();\n  console.log('G');\n\nWalk the interviewer through the call stack emptying, the microtask drain (C, E's continuation F, then D), and why B — the only macrotask — prints last. State the final order and the rule that produces it.",
    questions: [
      {
        q: "JavaScript's core execution model is best described as:",
        options: [
          "A. Multi-threaded with shared memory",
          "B. Single-threaded with an event loop for async work",
          "C. Dual-threaded (one for sync, one for async)",
          "D. Thread-free / fully parallel",
        ],
        answer: "B",
        explanation:
          "B is correct: JS runs on a single thread with one call stack, and uses the event loop to schedule asynchronous callbacks without blocking. Web Workers add separate threads but don't change the main model.",
      },
      {
        q: "What runs first: `setTimeout(fn, 0)` or `Promise.resolve().then(fn)`?",
        options: [
          "A. setTimeout, because 0 ms means immediately",
          "B. Promise.then, because microtasks outrank macrotasks",
          "C. They run at exactly the same time",
          "D. Neither runs until the page reloads",
        ],
        answer: "B",
        explanation:
          "B is correct: Promise reactions are microtasks, which the event loop drains completely before running any macrotask (setTimeout). So the Promise callback always wins, even at 0 ms.",
      },
      {
        q: "When does the event loop move a queued callback onto the call stack?",
        options: [
          "A. Immediately, as soon as it is queued",
          "B. Only when the call stack is empty",
          "C. Every 16 ms on a fixed timer",
          "D. Only after 5 or more callbacks accumulate",
        ],
        answer: "B",
        explanation:
          "B is correct: the loop pulls the next callback only when the call stack has fully unwound. That is why long synchronous code delays all pending async callbacks.",
      },
      {
        q: "Which of these is a MACROTASK (not a microtask)?",
        options: [
          "A. A `.then()` handler on a resolved Promise",
          "B. The code after an `await`",
          "C. A `setInterval` callback firing",
          "D. A `queueMicrotask` callback",
        ],
        answer: "C",
        explanation:
          "C is correct: setInterval (like setTimeout and I/O) schedules a macrotask. Promise `.then`, the post-`await` continuation, and `queueMicrotask` all schedule microtasks.",
      },
      {
        q: "In one event-loop cycle, how many microtasks and macrotasks are processed?",
        options: [
          "A. One microtask and one macrotask",
          "B. All queued microtasks (including newly added ones), then exactly one macrotask",
          "C. All macrotasks, then all microtasks",
          "D. One of each, alternating strictly",
        ],
        answer: "B",
        explanation:
          "B is correct: the loop drains the entire microtask queue — even microtasks that other microtasks enqueue — and only then runs a single macrotask, re-draining microtasks afterward.",
      },
      {
        q: "Why can an endlessly self-scheduling microtask freeze the page?",
        options: [
          "A. Microtasks run on a separate thread that deadlocks",
          "B. The loop must empty the microtask queue before rendering or running macrotasks, so it never gets there",
          "C. setTimeout callbacks are given up permanently after 100 ms",
          "D. The garbage collector pauses all Promises",
        ],
        answer: "B",
        explanation:
          "B is correct: because microtasks are fully drained before macrotasks or a repaint, a microtask that keeps enqueuing more microtasks starves rendering and timers, appearing to hang the UI.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "fe-promises-async",
    title: "Promises & async/await",
    shortLabel: "Promises & async/await",
    section: "Async & Event Loop",
    domain: "Frontend",
    tldr:
      "A Promise is an object representing a future value in one of three states: pending, fulfilled, or rejected — settled once, then immutable. Consume it with `.then`/`.catch`/`.finally`, or the cleaner `async`/`await` (an async function always returns a Promise; `await` pauses until settlement and is sugar over `.then`). Combinators coordinate many: `Promise.all` (all succeed, fail-fast), `allSettled` (never rejects, reports each), `race` (first to settle), `any` (first to fulfill). Use `Promise.all` for independent work to run in parallel instead of awaiting sequentially.",
    subtopics: [
      {
        heading: "States & consumption",
        bullets: [
          { icon: "⏳", text: "Three states: **pending** (initial), **fulfilled** (success + value), **rejected** (failure + reason); it **settles once** and can't change." },
          { icon: "🔗", text: "**`.then(onFulfilled)`** handles success and **returns a new Promise** (chainable); **`.catch`** handles rejection; **`.finally`** always runs." },
          { icon: "🧵", text: "Chaining flattens nested Promises: returning a Promise from `.then` waits for it before the next `.then`." },
        ],
      },
      {
        heading: "async / await",
        bullets: [
          { icon: "🏷️", text: "An **`async` function always returns a Promise** — a plain `return x` is wrapped in `Promise.resolve(x)`, a `throw` becomes a rejection." },
          { icon: "⏸️", text: "**`await`** pauses the function until the Promise settles; under the hood it is **`.then` sugar**, so code after `await` runs as a **microtask**." },
          { icon: "🛡️", text: "Handle errors with **`try/catch`** around `await` (mirrors `.catch` on a chain); an unhandled rejection surfaces via `unhandledrejection`." },
        ],
      },
      {
        heading: "Combinators & parallelism",
        bullets: [
          { icon: "🤝", text: "**`Promise.all`** resolves when **all** fulfill (array of results) but **rejects fast** on the first rejection." },
          { icon: "📋", text: "**`allSettled`** waits for all and **never rejects**, returning `{status, value|reason}` for each; **`race`** = first to settle (win or lose); **`any`** = first to **fulfill**." },
          { icon: "⚡", text: "Independent async calls: start them together and **`await Promise.all([...])`** (parallel ≈ slowest task) instead of awaiting one after another (sequential = sum)." },
        ],
      },
    ],
    keyFacts: [
      { label: "States", value: "Pending · Fulfilled · Rejected", icon: "⏳" },
      { label: "async returns", value: "Always a Promise", icon: "🏷️" },
      { label: "Promise.all", value: "All succeed, fail-fast", icon: "🤝" },
      { label: "allSettled", value: "Never rejects, reports each", icon: "📋" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "3 states: **pending → fulfilled | rejected**; settles once, immutable after.",
        "`async` fn **always returns a Promise**; `await` = sugar over `.then` (a microtask).",
        "`Promise.all` **fails fast**; `allSettled` never rejects; `race` = first settled; `any` = first fulfilled.",
        "Parallel independent work → **`await Promise.all([...])`**, not sequential awaits.",
        "Error handling: `.catch()` on a chain, or `try/catch` around `await`.",
      ],
      analogyBrief:
        "A Promise is a restaurant buzzer: pending while you wait, then it either lights up (fulfilled, food ready) or flashes red (rejected, order failed) — and it only fires once.",
    },
    explanation:
      "A Promise is an object that represents the eventual result of an asynchronous operation. It is always in exactly one of three states: pending (the initial state, still in progress), fulfilled (completed successfully, carrying a value), or rejected (failed, carrying a reason); once it settles into fulfilled or rejected it is immutable and its handlers fire only once. You consume a Promise with .then(onFulfilled) to handle success, .catch(onRejected) to handle failure, and .finally(onSettled) which runs regardless of outcome; crucially each .then returns a new Promise, so you can chain steps, and returning a Promise from inside a .then makes the chain wait for it before continuing. async/await is syntactic sugar over this: an async function always returns a Promise (a plain returned value is wrapped in Promise.resolve, and a thrown error becomes a rejection), and await pauses the function until the awaited Promise settles, unwrapping its value or throwing its reason. Because await is implemented via .then, the code that follows an await runs as a microtask, not synchronously. Error handling therefore has two equivalent styles — a .catch() at the end of a chain, or a try/catch block around your awaits — and any rejection with no handler surfaces globally through the unhandledrejection event. To coordinate multiple Promises, JavaScript provides combinators: Promise.all takes an array and fulfills with an array of all results, but it fails fast, rejecting the moment any input rejects; Promise.allSettled waits for every Promise and never rejects, instead returning an array of {status, value} or {status, reason} objects so you can inspect each outcome; Promise.race settles as soon as the first input settles, whether it fulfills or rejects; and Promise.any fulfills as soon as the first input fulfills, ignoring rejections (only rejecting if they all fail). A key performance idea follows from all this: if several async operations are independent, kick them all off and await Promise.all([...]) so they run in parallel — total time is roughly the slowest one — rather than awaiting them one at a time, which serializes the work and sums the durations.",
    analogy:
      "A Promise is the buzzer a restaurant hands you when you order. Right now it's pending — you don't have your food yet, so you go find a table. Eventually it does one of two things, exactly once: it lights up and buzzes to say your order is fulfilled (here's your value, the food), or it flashes red to say the order was rejected (out of stock — here's the reason). You register in advance what you'll do in each case: '.then' go collect the food, '.catch' get a refund, '.finally' return the buzzer either way. async/await is just a calmer way to hold that buzzer: 'await' means you sit and wait for it to go off before your next line of thought, and the whole meal plan ('async function') itself hands back a buzzer to whoever sent you. If you have several buzzers for several dishes, you don't wait for dish one before ordering dish two — you order everything at once (Promise.all) and wait for them together.",
    diagram: `<svg viewBox="0 0 760 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Promise states and combinators">${svgDefs}
      ${box(300, 25, 160, 50, "Pending", "in progress", "#f59e0b")}
      ${box(90, 130, 180, 50, "Fulfilled ✅", ".then(value)", "#22c55e")}
      ${box(490, 130, 180, 50, "Rejected ❌", ".catch(reason)", "#e11d8f")}
      <line x1="330" y1="75" x2="200" y2="128" stroke="#22c55e" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="430" y1="75" x2="560" y2="128" stroke="#e11d8f" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="235" y="112" fill="#8b949e" font-size="10">resolve</text>
      <text x="470" y="112" fill="#8b949e" font-size="10">reject</text>
      <text x="380" y="205" text-anchor="middle" fill="#d2a8ff" font-size="11">.finally() — always runs · settles once, then immutable</text>
      <rect x="60" y="220" width="640" height="30" rx="6" fill="#1a2332" stroke="#3b82f6"/>
      <text x="80" y="240" fill="#8b949e" font-size="10">all = every fulfills (fail-fast) · allSettled = each reported · race = first settled · any = first fulfilled</text>
    </svg>`,
    diagramLegend: [
      { color: "#f59e0b", label: "Pending", description: "Initial state before the Promise settles." },
      { color: "#22c55e", label: "Fulfilled", description: "Resolved with a value; handled by .then." },
      { color: "#e11d8f", label: "Rejected", description: "Failed with a reason; handled by .catch / try-catch." },
    ],
    codeExample: {
      language: "javascript",
      title: "Chaining vs async/await (equivalent behavior)",
      code: `function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) resolve({ id, name: \`User_\${id}\` });
      else reject(new Error("Invalid ID"));
    }, 100);
  });
}

// Promise chaining
fetchUser(1)
  .then((user) => {
    console.log("Chain - Got:", user.name);
    return fetchUser(2); // returning a Promise waits for it
  })
  .then((user) => console.log("Chain - Got:", user.name))
  .catch((err) => console.log("Chain error:", err.message))
  .finally(() => console.log("Chain - Done!"));

// Same logic with async/await (cleaner error handling)
async function getUsers() {
  try {
    const user1 = await fetchUser(1);
    console.log("Await - Got:", user1.name);
    const user2 = await fetchUser(2);
    console.log("Await - Got:", user2.name);
  } catch (err) {
    console.log("Await error:", err.message);
  } finally {
    console.log("Await - Done!");
  }
}
getUsers();`,
    },
    codeExamples: [
      {
        language: "javascript",
        tab: "Chaining vs await",
        title: "Promise chaining vs async/await",
        code: `function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) resolve({ id, name: \`User_\${id}\` });
      else reject(new Error("Invalid ID"));
    }, 100);
  });
}

fetchUser(1)
  .then((user) => {
    console.log("Chain - Got:", user.name);
    return fetchUser(2);
  })
  .then((user) => console.log("Chain - Got:", user.name))
  .catch((err) => console.log("Chain error:", err.message))
  .finally(() => console.log("Chain - Done!"));

async function getUsers() {
  try {
    const user1 = await fetchUser(1);
    console.log("Await - Got:", user1.name);
    const user2 = await fetchUser(2);
    console.log("Await - Got:", user2.name);
  } catch (err) {
    console.log("Await error:", err.message);
  } finally {
    console.log("Await - Done!");
  }
}
getUsers();`,
      },
      {
        language: "javascript",
        tab: "all/allSettled/race/any",
        title: "The four Promise combinators compared",
        code: `const fast = new Promise((r) => setTimeout(() => r("fast"), 50));
const slow = new Promise((r) => setTimeout(() => r("slow"), 200));
const fail = new Promise((_, rej) => setTimeout(() => rej("error!"), 100));

// all — waits for ALL, fails fast on any rejection
Promise.all([fast, slow]).then((results) => console.log("all:", results));
Promise.all([fast, fail, slow]).catch((err) => console.log("all failed:", err));

// allSettled — waits for ALL, never rejects
Promise.allSettled([fast, fail, slow]).then((results) => {
  results.forEach((r, i) =>
    console.log(\`allSettled[\${i}]:\`, r.status, r.value ?? r.reason)
  );
});

// race — first to SETTLE (fulfill OR reject)
Promise.race([fast, slow]).then((result) => console.log("race:", result));

// any — first to FULFILL (ignores rejections)
Promise.any([fail, fast, slow]).then((result) => console.log("any:", result));`,
      },
      {
        language: "javascript",
        tab: "Sequential vs parallel",
        title: "Why Promise.all beats serial awaits",
        code: `function delay(ms, val) {
  return new Promise((r) => setTimeout(() => r(val), ms));
}

async function sequential() {
  console.time("sequential");
  const a = await delay(100, "A"); // wait 100ms
  const b = await delay(100, "B"); // then another 100ms
  console.log("Sequential:", a, b);
  console.timeEnd("sequential"); // ~200ms
}

async function parallel() {
  console.time("parallel");
  const [a, b] = await Promise.all([
    delay(100, "A"), // both start immediately
    delay(100, "B"),
  ]);
  console.log("Parallel:", a, b);
  console.timeEnd("parallel"); // ~100ms
}

sequential();
parallel();`,
      },
    ],
    problemStatement:
      "A dashboard must load a user's profile, their recent orders, and site-wide config from three independent endpoints before it can render. The first implementation does `const p = await getProfile(); const o = await getOrders(); const c = await getConfig();` and users complain it's slow. (1) Explain why the sequential awaits sum the latencies and how to make the three requests run in parallel. (2) The product team then says the page should still render if config fails but profile and orders succeed — which combinator do you switch to, and how do you read each result? Discuss `Promise.all` vs `Promise.allSettled` and where a `try/catch` belongs.",
    questions: [
      {
        q: "What are the three states of a Promise?",
        options: [
          "A. Start, Middle, End",
          "B. Pending, Fulfilled, Rejected",
          "C. Loading, Success, Error",
          "D. Init, Running, Done",
        ],
        answer: "B",
        explanation:
          "B is correct: a Promise is pending until it settles, then either fulfilled (with a value) or rejected (with a reason). Once settled it is immutable.",
      },
      {
        q: "An `async` function always returns:",
        options: [
          "A. undefined",
          "B. A Promise",
          "C. The awaited value directly",
          "D. A generator object",
        ],
        answer: "B",
        explanation:
          "B is correct: an async function always returns a Promise. A plain returned value is wrapped in Promise.resolve, and a thrown error becomes a rejected Promise.",
      },
      {
        q: "What does `Promise.all([...])` do if ONE of its promises rejects?",
        options: [
          "A. Ignores that rejection and resolves with the rest",
          "B. Waits for the others, then resolves",
          "C. Rejects immediately with that first rejection reason (fail-fast)",
          "D. Retries the rejected promise",
        ],
        answer: "C",
        explanation:
          "C is correct: Promise.all is fail-fast — the first rejection rejects the whole thing immediately. Use Promise.allSettled if you need every result regardless of failures.",
      },
      {
        q: "You need results from all promises even if some fail, inspecting each outcome. Which combinator?",
        options: [
          "A. Promise.all",
          "B. Promise.race",
          "C. Promise.any",
          "D. Promise.allSettled",
        ],
        answer: "D",
        explanation:
          "D is correct: Promise.allSettled never rejects and returns an array of {status, value} or {status, reason} so you can inspect each. all fails fast; race/any return only one result.",
      },
      {
        q: "Relative to the surrounding code, when does the statement AFTER an `await` run?",
        options: [
          "A. Synchronously, on the same call-stack frame",
          "B. As a microtask, once the awaited Promise settles",
          "C. As a macrotask via setTimeout",
          "D. On a separate worker thread",
        ],
        answer: "B",
        explanation:
          "B is correct: await is sugar over .then, so the continuation after it is scheduled as a microtask that runs after the awaited Promise settles and the current sync code finishes.",
      },
      {
        q: "Three independent API calls each take ~100 ms. Which approach minimizes total wall-clock time?",
        options: [
          "A. `await` them one after another",
          "B. Start all three, then `await Promise.all([...])`",
          "C. Wrap each in its own setTimeout",
          "D. Use Promise.race so only the fastest is used",
        ],
        answer: "B",
        explanation:
          "B is correct: launching them together and awaiting Promise.all runs them in parallel (~100 ms total). Sequential awaits sum to ~300 ms; race would discard two of the three results.",
      },
    ],
  },
];
