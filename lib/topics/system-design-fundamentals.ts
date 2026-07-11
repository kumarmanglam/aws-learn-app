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
// SECTION: System Design Fundamentals — Scalability, Load
// Balancing & Caching Strategies.
// System-design interview fundamentals authored to the
// messaging.ts / frontend-core.ts bar.
// ============================================================
import { svgDefs, type Topic } from "./shared";

const box = (
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  sub: string,
  color = "#0ea5e9",
) => `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#243349" stroke="${color}"/>
  <text x="${x + w / 2}" y="${y + h / 2 - 2}" text-anchor="middle" fill="#e6edf3" font-size="12" font-weight="600">${title}</text>
  <text x="${x + w / 2}" y="${y + h / 2 + 15}" text-anchor="middle" fill="#8b949e" font-size="10">${sub}</text>
`;

export const systemDesignFundamentalsTopics: Topic[] = [
  // -----------------------------------------------------------------
  {
    id: "sd-scalability",
    title: "Scalability — Vertical vs Horizontal, Stateless Design & Estimation",
    shortLabel: "Scalability",
    section: "Fundamentals",
    domain: "SystemDesign",
    tldr:
      "Scalability is a system's ability to handle growing load by adding resources. Vertical scaling (scale-up) makes one machine bigger — simple but capped and a single point of failure; horizontal scaling (scale-out) adds more machines behind a load balancer — near-limitless but requires stateless services and coordination. Design servers stateless (push session/state to a shared store) so any node can serve any request. Distinguish latency (time per request) from throughput (requests per second), and use back-of-the-envelope estimation to size capacity early.",
    subtopics: [
      {
        heading: "Vertical vs horizontal scaling",
        bullets: [
          { icon: "⬆️", text: "**Vertical (scale-up)** — add CPU/RAM/disk to one machine. Simple, no code changes, but has a **hardware ceiling**, gets expensive fast, and is a **single point of failure**." },
          { icon: "➡️", text: "**Horizontal (scale-out)** — add more machines behind a **load balancer**. Near-limitless, fault-tolerant, and cheaper per unit, but needs **stateless services**, data partitioning, and coordination." },
          { icon: "⚖️", text: "Most large systems scale **vertically first** (fewer moving parts) then **horizontally** once a single box can no longer keep up or high availability is required." },
        ],
      },
      {
        heading: "Stateless design",
        bullets: [
          { icon: "🧊", text: "A **stateless** service keeps **no client session data in its own memory** — any request can hit any node, so nodes are interchangeable and easy to add/remove." },
          { icon: "🗄️", text: "Push state to a **shared store**: sessions in Redis/DynamoDB, files in object storage (S3), so servers stay disposable." },
          { icon: "🩹", text: "Stateless nodes enable **auto-scaling, rolling deploys, and self-healing** — a dead node is simply replaced, no session is lost." },
        ],
      },
      {
        heading: "Latency, throughput & estimation",
        bullets: [
          { icon: "⏱️", text: "**Latency** = time for a single request (e.g. p50/p99 in ms). **Throughput** = requests handled per second. Optimizing one can hurt the other (batching raises throughput but adds latency)." },
          { icon: "📐", text: "**Back-of-the-envelope**: estimate QPS = DAU × actions/user ÷ 86,400s; peak ≈ 2–3× average; storage = records × size × retention; then size servers/DB/cache from those numbers." },
          { icon: "🧮", text: "Memorize rough figures: memory read ~100 ns, SSD read ~100 µs, network round trip within a region ~0.5–1 ms, cross-continent ~100+ ms." },
        ],
      },
    ],
    keyFacts: [
      { label: "Scale-up", value: "Bigger machine (capped, SPOF)", icon: "⬆️" },
      { label: "Scale-out", value: "More machines + LB (needs stateless)", icon: "➡️" },
      { label: "Latency", value: "Time per request (p50/p99)", icon: "⏱️" },
      { label: "Throughput", value: "Requests per second (QPS)", icon: "🚀" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'Add more machines' → **horizontal scaling** (requires **stateless** services).",
        "'Bigger box, simplest change' → **vertical scaling** (but capped + SPOF).",
        "'Any server can serve any request' → **statelessness** (state in shared store).",
        "'How fast is one request' → **latency**; 'how many per second' → **throughput**.",
        "Always start a design with a **back-of-the-envelope QPS/storage estimate**.",
      ],
      analogyBrief:
        "Vertical scaling is giving one cashier a faster register; horizontal scaling is opening more checkout lanes. Statelessness means any lane can ring up any customer because the receipts live in a central drawer, not in the cashier's head.",
    },
    explanation:
      "Scalability is the ability of a system to handle increasing load — more users, requests, or data — by adding resources, ideally with a proportional (linear) increase in cost and no drop in responsiveness. There are two fundamental strategies. Vertical scaling (scale-up) means making a single machine more powerful by adding CPU cores, memory, faster disks, or better networking; it requires little or no code change and keeps the architecture simple, but it hits a hard hardware ceiling, becomes very expensive at the top end, and leaves you with a single point of failure. Horizontal scaling (scale-out) means adding more machines and spreading load across them behind a load balancer; it is effectively limitless, is more fault-tolerant because losing one node doesn't take down the system, and is usually cheaper per unit of capacity, but it forces you to design for statelessness, partition your data, and coordinate work across nodes. The enabling principle for horizontal scaling is stateless design: a service should keep no per-client session state in its own local memory, so that any request can be routed to any instance and instances become interchangeable and disposable. State that must persist — user sessions, uploaded files, cached data — is pushed into a shared external store such as Redis, DynamoDB, or object storage, which lets you auto-scale, perform rolling deployments, and self-heal by simply replacing dead nodes without losing anyone's session. When reasoning about performance, keep latency and throughput distinct: latency is the time to complete a single request (commonly reported as p50 or p99 percentiles in milliseconds), while throughput is how many requests the system completes per second (QPS). The two trade off against each other — batching work or adding queues raises throughput but increases per-request latency, and Little's Law (concurrency = throughput × latency) ties them together. Finally, good designers begin with back-of-the-envelope estimation: derive expected queries per second from daily active users times actions per user divided by the seconds in a day, apply a peak factor of roughly two to three times the average, estimate storage from record count times record size times retention, and use rough hardware numbers (a memory read is on the order of 100 nanoseconds, an SSD read about 100 microseconds, an in-region network round trip under a millisecond, and a cross-continent round trip over a hundred milliseconds) to size servers, databases, and caches before writing any code.",
    analogy:
      "Think of a supermarket at rush hour. Vertical scaling is giving your one cashier a faster scanner and a bigger conveyor belt — helpful, but there's only so fast one human can go, and if that cashier calls in sick the whole store stops. Horizontal scaling is opening ten more checkout lanes and putting a greeter at the entrance (the load balancer) who directs each shopper to the shortest line. That only works if any lane can serve any shopper — which it can, because the prices and receipts live in the store's central computer, not in each cashier's memory (statelessness). Latency is how long one shopper waits at the register; throughput is how many shoppers the whole store checks out per minute. And before opening the store you'd estimate on a napkin how many shoppers arrive per hour so you know how many lanes to build.",
    diagram: `<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Vertical vs horizontal scaling with stateless nodes">${svgDefs}
      <text x="20" y="30" fill="#f59e0b" font-size="12" font-weight="700">Vertical (scale-up)</text>
      ${box(20, 45, 120, 45, "Server", "2 CPU / 8 GB", "#8b949e")}
      <line x1="80" y1="95" x2="80" y2="120" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(20, 125, 120, 70, "Server", "16 CPU / 128 GB", "#f59e0b")}
      <text x="20" y="230" fill="#8b949e" font-size="10">One bigger box · capped · SPOF</text>
      <line x1="200" y1="40" x2="200" y2="260" stroke="#30363d" stroke-width="1" stroke-dasharray="4"/>
      <text x="240" y="30" fill="#22c55e" font-size="12" font-weight="700">Horizontal (scale-out)</text>
      ${box(430, 45, 130, 45, "Load Balancer", "spreads load", "#0ea5e9")}
      ${box(300, 130, 110, 45, "Node A", "stateless", "#22c55e")}
      ${box(430, 130, 110, 45, "Node B", "stateless", "#22c55e")}
      ${box(560, 130, 110, 45, "Node C", "stateless", "#22c55e")}
      <line x1="470" y1="90" x2="355" y2="128" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
      <line x1="495" y1="90" x2="485" y2="128" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
      <line x1="520" y1="90" x2="615" y2="128" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
      ${box(430, 210, 130, 45, "Shared Store", "sessions / state", "#8b5cf6")}
      <line x1="355" y1="175" x2="480" y2="208" stroke="#8b949e" stroke-width="1.3" stroke-dasharray="4" marker-end="url(#arrow-mute)"/>
      <line x1="485" y1="175" x2="490" y2="208" stroke="#8b949e" stroke-width="1.3" stroke-dasharray="4" marker-end="url(#arrow-mute)"/>
      <line x1="615" y1="175" x2="500" y2="208" stroke="#8b949e" stroke-width="1.3" stroke-dasharray="4" marker-end="url(#arrow-mute)"/>
    </svg>`,
    diagramLegend: [
      { color: "#f59e0b", label: "Scaled-up server", description: "Vertical scaling: one machine made more powerful — simple but capped." },
      { color: "#22c55e", label: "Stateless nodes", description: "Horizontal scaling: interchangeable instances added behind the LB." },
      { color: "#8b5cf6", label: "Shared store", description: "Holds session/state so nodes stay disposable and replaceable." },
    ],
    codeExample: {
      language: "python",
      title: "Back-of-the-envelope capacity estimate",
      code: `# Estimate QPS and server count for a social feed
DAU = 10_000_000          # daily active users
reads_per_user = 20       # feed loads per user per day
seconds_per_day = 86_400

avg_qps = DAU * reads_per_user / seconds_per_day   # ~2,315 QPS
peak_qps = avg_qps * 3                              # peak factor ~3x -> ~6,944 QPS

qps_per_server = 500      # a single stateless node handles ~500 QPS
servers = -(-peak_qps // qps_per_server)            # ceil division -> 14 servers

print(f"avg={avg_qps:.0f} QPS, peak={peak_qps:.0f} QPS, need {servers} servers")
# Add headroom + redundancy: provision ~1.5x -> ~21 nodes across 2+ AZs`,
    },
    codeExamples: [
      {
        language: "python",
        tab: "Estimation",
        title: "Back-of-the-envelope capacity estimate",
        code: `DAU = 10_000_000
reads_per_user = 20
avg_qps = DAU * reads_per_user / 86_400   # ~2,315 QPS
peak_qps = avg_qps * 3                     # ~6,944 QPS
servers = -(-peak_qps // 500)              # ceil -> 14 nodes
print(avg_qps, peak_qps, servers)`,
      },
      {
        language: "python",
        tab: "Stateless",
        title: "Stateless handler — session in a shared store",
        code: `import redis
r = redis.Redis(host="session-store")  # shared, not local memory

def handle(request):
    # No session kept in this process -> any node can serve any request
    sid = request.cookies["sid"]
    user = r.hgetall(f"session:{sid}")   # fetch state from shared store
    if not user:
        return {"status": 401}
    return {"status": 200, "user": user[b"name"].decode()}`,
      },
      {
        language: "javascript",
        tab: "Little's Law",
        title: "Concurrency from throughput and latency",
        code: `// Little's Law: concurrency = throughput (req/s) x latency (s)
const throughput = 2000;      // requests per second
const latencySec = 0.05;      // 50 ms average latency
const concurrency = throughput * latencySec;  // 100 in-flight requests

// To keep latency flat while throughput rises, add nodes so each stays
// below its saturation point (queueing theory: latency spikes near 100% util).
console.log(\`~\${concurrency} concurrent requests in flight\`);`,
      },
    ],
    problemStatement:
      "You are designing the backend for a news app expecting 10 million daily active users, each loading their feed about 20 times a day, with sharp traffic peaks each morning. A single server can handle roughly 500 requests per second. Estimate the average and peak QPS, decide whether to scale vertically or horizontally, explain what must be true about your servers for that scaling approach to work, and describe how you would keep p99 latency stable as load grows.",
    questions: [
      {
        q: "What is the PRIMARY difference between vertical and horizontal scaling?",
        options: [
          "A. Vertical adds more machines; horizontal makes one machine bigger",
          "B. Vertical makes one machine more powerful; horizontal adds more machines",
          "C. They are two names for the same technique",
          "D. Vertical only applies to databases; horizontal only to web servers",
        ],
        answer: "B",
        explanation:
          "B is correct: vertical scaling (scale-up) adds CPU/RAM to a single machine, while horizontal scaling (scale-out) adds more machines behind a load balancer. A reverses the two; they are not the same; both apply to any tier.",
      },
      {
        q: "Why is stateless design important for horizontal scaling?",
        options: [
          "A. It makes each request slower but more accurate",
          "B. It lets any node serve any request, so nodes are interchangeable and easy to add or replace",
          "C. It removes the need for a database",
          "D. It guarantees exactly-once processing",
        ],
        answer: "B",
        explanation:
          "B is correct: with no per-client state in a node's local memory, any instance can handle any request, enabling auto-scaling, rolling deploys, and self-healing. It doesn't slow requests, remove the DB, or guarantee exactly-once.",
      },
      {
        q: "A single server has 32 CPUs and 256 GB RAM but the app still can't keep up at peak. What is the KEY limitation of continuing to scale vertically?",
        options: [
          "A. Vertical scaling is always free",
          "B. There is a hardware ceiling and the single machine remains a single point of failure",
          "C. Vertical scaling requires stateless services",
          "D. Vertical scaling cannot use more RAM",
        ],
        answer: "B",
        explanation:
          "B is correct: you eventually hit the largest available machine (a hard ceiling), cost rises steeply, and the one box is still a single point of failure. Vertical scaling isn't free, doesn't require statelessness, and can use more RAM.",
      },
      {
        q: "Latency and throughput are best described as:",
        options: [
          "A. Latency is requests per second; throughput is time per request",
          "B. Latency is time to complete one request; throughput is how many requests complete per second",
          "C. They always improve together when you add a batch queue",
          "D. Both measure only network speed",
        ],
        answer: "B",
        explanation:
          "B is correct: latency is per-request time (e.g. p99 ms) and throughput is requests per second (QPS). A swaps them; batching often raises throughput while increasing latency; both are broader than network speed.",
      },
      {
        q: "An app has 5,000,000 DAU making 10 requests each per day. Roughly what is the average QPS (86,400 s/day)?",
        options: [
          "A. About 58 QPS",
          "B. About 5,000 QPS",
          "C. About 579 QPS",
          "D. About 50,000 QPS",
        ],
        answer: "C",
        explanation:
          "C is correct: 5,000,000 x 10 = 50,000,000 requests/day ÷ 86,400 s ≈ 579 QPS average (peak would be a few times higher). The other values misplace the division.",
      },
      {
        q: "By Little's Law, if a service sustains 2,000 requests/second at an average latency of 100 ms, roughly how many requests are in flight concurrently?",
        options: [
          "A. About 20",
          "B. About 200",
          "C. About 2,000",
          "D. About 20,000",
        ],
        answer: "B",
        explanation:
          "B is correct: concurrency = throughput × latency = 2,000/s × 0.1 s = 200 concurrent requests. This is why latency times throughput drives how much concurrency (threads/connections) you must provision.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "sd-load-balancing",
    title: "Load Balancing — Distribution, LB Tiers & Failover",
    shortLabel: "Load Balancing",
    section: "Fundamentals",
    domain: "SystemDesign",
    tldr:
      "A load balancer spreads incoming traffic across many backends so no single server is overwhelmed, and routes around failures using health checks. Algorithms include round robin, least connections, weighted, and hash-based (for sticky sessions). Layer 4 balancers route on IP/port (fast, protocol-agnostic); Layer 7 balancers route on HTTP content (path, host, headers). Large systems use tiers — DNS/global first, then regional L7 — and keep the LB itself highly available with an active-passive or active-active pair so it isn't a single point of failure.",
    subtopics: [
      {
        heading: "What a load balancer does",
        bullets: [
          { icon: "🔀", text: "Distributes client requests across a **pool of backends** so load is even and no node is a bottleneck." },
          { icon: "❤️", text: "Runs **health checks** and stops routing to unhealthy nodes — this is how it provides **failover** and high availability." },
          { icon: "🎛️", text: "Common algorithms: **round robin**, **least connections**, **weighted** (by capacity), **IP/consistent hash** (for **sticky sessions**)." },
        ],
      },
      {
        heading: "Layer 4 vs Layer 7",
        bullets: [
          { icon: "🏎️", text: "**L4 (transport)** routes on **IP + port**; protocol-agnostic, very fast, no payload inspection (e.g. AWS NLB, TCP/UDP)." },
          { icon: "🧠", text: "**L7 (application)** routes on **HTTP content** — path, host, headers, cookies — enabling path-based routing, TLS termination, and sticky sessions (e.g. AWS ALB, NGINX)." },
          { icon: "🔐", text: "L7 can **terminate TLS**, add auth, rewrite headers, and do content-based routing; L4 just forwards packets with minimal overhead." },
        ],
      },
      {
        heading: "Tiers & keeping the LB available",
        bullets: [
          { icon: "🌍", text: "**Global tier first**: DNS-based / GeoDNS or Anycast steers users to the nearest **region**; then a **regional L7** LB routes to services." },
          { icon: "♻️", text: "The LB must not be a **single point of failure** — run an **active-passive** pair (VIP failover via a floating IP) or **active-active** behind DNS." },
          { icon: "🧊", text: "**Sticky sessions** pin a client to one backend (needed for local state) but hurt even distribution — prefer **stateless** backends and skip stickiness where possible." },
        ],
      },
    ],
    keyFacts: [
      { label: "Job", value: "Spread load + failover", icon: "🔀" },
      { label: "L4", value: "Routes on IP/port (fast)", icon: "🏎️" },
      { label: "L7", value: "Routes on HTTP content", icon: "🧠" },
      { label: "HA", value: "Active-passive / active-active", icon: "♻️" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'Spread traffic + route around dead nodes' → **load balancer with health checks**.",
        "'Route by URL path / host / header' → **Layer 7 (ALB / NGINX)**.",
        "'Fast, protocol-agnostic, TCP/UDP' → **Layer 4 (NLB)**.",
        "'Keep sending a user to the same server' → **sticky sessions (hash / cookie)** — but prefer stateless.",
        "'Nearest region globally' → **DNS/GeoDNS or Anycast** tier above the regional LB.",
        "The LB itself needs **redundancy** so it isn't a single point of failure.",
      ],
      analogyBrief:
        "A load balancer is the host at a busy restaurant who seats each arriving party at the emptiest section, skips tables that are closed (health checks), and — if the front door jams — hands off to a backup host so guests keep flowing.",
    },
    explanation:
      "A load balancer sits between clients and a pool of backend servers and distributes incoming requests across them so that no single server becomes a bottleneck; this is the workhorse of horizontal scaling. Beyond distribution, the load balancer continuously runs health checks against each backend and automatically stops routing traffic to any node that fails them, which is precisely how it delivers failover and high availability — a crashed or overloaded server is quietly taken out of rotation and put back once it recovers. Distribution follows an algorithm: round robin cycles through servers in order; least connections sends the next request to the server with the fewest active connections (better when request durations vary); weighted round robin or weighted least connections biases traffic toward more powerful nodes; and hash-based schemes (hashing the client IP or a session key, often with consistent hashing) send a given client to the same backend, which is how sticky sessions are implemented. Load balancers operate at different network layers. A Layer 4 balancer works at the transport layer, routing based only on IP address and port; it is protocol-agnostic, extremely fast, and cheap because it never inspects the payload (AWS's Network Load Balancer and classic TCP/UDP balancers are examples). A Layer 7 balancer works at the application layer and can read the HTTP request — the path, host, headers, and cookies — so it can do content-based routing (send /api to one pool and /images to another), terminate TLS, add authentication, rewrite headers, and maintain sticky sessions (AWS's Application Load Balancer and NGINX are examples); the trade-off is more processing per request. Large systems compose load balancers into tiers: a global tier first, typically DNS-based routing such as GeoDNS or an Anycast address, steers each user toward the nearest healthy region; within that region a Layer 7 load balancer then routes to the appropriate microservice or server pool. Crucially, the load balancer must not itself be a single point of failure — you run it redundantly, either active-passive (a standby instance takes over a shared virtual IP via a floating-IP failover when the primary dies) or active-active (multiple LB instances all serve traffic, usually fronted by DNS). Finally, sticky sessions, while sometimes necessary when a backend holds local session state, undermine even distribution and complicate failover; the preferred approach is to make backends stateless (storing session state in a shared store) so the load balancer is free to send any request to any healthy node.",
    analogy:
      "A load balancer is the host standing at the door of a packed restaurant. As each party arrives, the host glances across the floor and seats them in the section with the most open tables (least connections) or simply rotates through sections in turn (round robin). If a section's kitchen station goes down, the host stops seating there until it's fixed (health checks and failover). A regular who insists on 'their' waiter always gets seated in that waiter's section (a sticky session) — convenient, but it means that section fills up unevenly. For a restaurant chain, a phone concierge first directs you to the nearest branch (the global DNS tier) before the branch's own host seats you. And because the whole system jams if the host faints, there's always a second host ready to step in (an active-passive backup) so guests never pile up at the door.",
    diagram: `<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Load balancer tiers with health checks and failover">${svgDefs}
      ${box(20, 120, 90, 45, "Clients", "requests", "#8b949e")}
      ${box(150, 120, 120, 45, "DNS / GeoDNS", "global tier", "#f59e0b")}
      <line x1="110" y1="142" x2="148" y2="142" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(310, 95, 130, 45, "L7 LB (primary)", "active", "#0ea5e9")}
      ${box(310, 160, 130, 40, "L7 LB (standby)", "passive", "#64748b")}
      <line x1="270" y1="142" x2="308" y2="120" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="375" y1="140" x2="375" y2="158" stroke="#f85149" stroke-width="1.5" stroke-dasharray="4" marker-end="url(#arrow-mute)"/>
      <text x="382" y="153" fill="#f85149" font-size="9">failover</text>
      ${box(500, 40, 120, 42, "Server 1", "healthy", "#22c55e")}
      ${box(500, 100, 120, 42, "Server 2", "healthy", "#22c55e")}
      ${box(500, 160, 120, 42, "Server 3", "DOWN", "#f85149")}
      ${box(500, 220, 120, 42, "Server 4", "healthy", "#22c55e")}
      <line x1="440" y1="112" x2="498" y2="61" stroke="#ff9900" stroke-width="1.3" marker-end="url(#arrow)"/>
      <line x1="440" y1="117" x2="498" y2="121" stroke="#ff9900" stroke-width="1.3" marker-end="url(#arrow)"/>
      <line x1="440" y1="122" x2="498" y2="181" stroke="#8b949e" stroke-width="1.3" stroke-dasharray="4" marker-end="url(#arrow-mute)"/>
      <line x1="440" y1="127" x2="498" y2="241" stroke="#ff9900" stroke-width="1.3" marker-end="url(#arrow)"/>
      <text x="500" y="285" fill="#8b949e" font-size="10">Health checks skip the DOWN node</text>
    </svg>`,
    diagramLegend: [
      { color: "#f59e0b", label: "Global tier", description: "DNS/GeoDNS or Anycast steers users to the nearest healthy region." },
      { color: "#0ea5e9", label: "L7 load balancer", description: "Regional balancer routing on HTTP content; a standby takes over on failure." },
      { color: "#f85149", label: "Unhealthy node", description: "Failed a health check — removed from rotation automatically." },
    ],
    codeExample: {
      language: "python",
      title: "Round robin vs least connections (simplified)",
      code: `class LoadBalancer:
    def __init__(self, servers):
        self.servers = servers          # each: {"name", "healthy", "active"}
        self._rr = 0

    def _healthy(self):
        return [s for s in self.servers if s["healthy"]]

    def round_robin(self):
        pool = self._healthy()
        s = pool[self._rr % len(pool)]  # cycle in order
        self._rr += 1
        return s["name"]

    def least_connections(self):
        pool = self._healthy()
        return min(pool, key=lambda s: s["active"])["name"]  # fewest in-flight`,
    },
    codeExamples: [
      {
        language: "python",
        tab: "Algorithms",
        title: "Round robin vs least connections",
        code: `def round_robin(pool, state):
    s = pool[state["i"] % len(pool)]
    state["i"] += 1
    return s

def least_connections(pool):
    return min(pool, key=lambda s: s["active"])  # fewest active conns

def weighted(pool):
    # pick proportional to capacity weight
    import random
    total = sum(s["weight"] for s in pool)
    r, acc = random.uniform(0, total), 0
    for s in pool:
        acc += s["weight"]
        if r <= acc:
            return s`,
      },
      {
        language: "nginx",
        tab: "L7 config",
        title: "NGINX Layer-7 upstream with health-aware routing",
        code: `upstream api_pool {
    least_conn;                    # least-connections algorithm
    server 10.0.1.11:8080 weight=2 max_fails=3 fail_timeout=15s;
    server 10.0.1.12:8080 weight=1 max_fails=3 fail_timeout=15s;
}

server {
    listen 443 ssl;               # L7 terminates TLS here
    location /api/ {               # path-based (content) routing
        proxy_pass http://api_pool;
    }
    location /images/ {
        proxy_pass http://static_pool;
    }
}`,
      },
      {
        language: "python",
        tab: "Health check",
        title: "Passive health check loop",
        code: `import time, requests

def health_loop(servers, interval=5):
    while True:
        for s in servers:
            try:
                ok = requests.get(f"http://{s['host']}/healthz", timeout=1).ok
            except requests.RequestException:
                ok = False
            s["healthy"] = ok       # LB reads this to include/exclude the node
        time.sleep(interval)`,
      },
    ],
    problemStatement:
      "Your web tier runs on eight servers, but users report intermittent errors whenever one server crashes, and traffic is uneven — some servers sit idle while others are pegged. You also serve users on two continents. Design a load-balancing scheme: which layer of balancer to use and why, which distribution algorithm handles uneven request durations, how the system detects and routes around a dead server, how you serve both regions with low latency, and how you ensure the load balancer itself is not a single point of failure.",
    questions: [
      {
        q: "What is the primary job of a load balancer?",
        options: [
          "A. To store user sessions permanently",
          "B. To distribute incoming requests across multiple backend servers and route around failures",
          "C. To encrypt data at rest",
          "D. To replace the need for a database",
        ],
        answer: "B",
        explanation:
          "B is correct: a load balancer spreads traffic across backends so none is overwhelmed and, via health checks, stops sending traffic to failed nodes. It doesn't store sessions, encrypt at rest, or replace a database.",
      },
      {
        q: "A Layer 4 load balancer routes traffic based on:",
        options: [
          "A. HTTP path, host, and headers",
          "B. IP address and port (transport layer), without inspecting the payload",
          "C. The contents of the request body",
          "D. Cookies and session tokens",
        ],
        answer: "B",
        explanation:
          "B is correct: an L4 balancer operates at the transport layer on IP/port and is protocol-agnostic and fast because it doesn't read the payload. Routing on path/headers/cookies/body is Layer 7 behavior.",
      },
      {
        q: "You need to route /api requests to one server pool and /images to another based on the URL path. Which balancer do you need?",
        options: [
          "A. A Layer 4 (transport) balancer",
          "B. A Layer 7 (application) balancer",
          "C. A DNS server only",
          "D. Neither — path routing is impossible",
        ],
        answer: "B",
        explanation:
          "B is correct: content/path-based routing requires a Layer 7 balancer (e.g. ALB, NGINX) that can read the HTTP request. L4 only sees IP/port; DNS alone can't route by path.",
      },
      {
        q: "Requests to your servers vary widely in duration, causing some servers to pile up while others are idle with simple round robin. Which algorithm helps most?",
        options: [
          "A. Round robin",
          "B. Least connections",
          "C. Random with no health checks",
          "D. Always route to server 1",
        ],
        answer: "B",
        explanation:
          "B is correct: least connections sends each new request to the server with the fewest active connections, which balances better when request durations vary. Round robin ignores current load; the others are worse.",
      },
      {
        q: "How does a load balancer typically detect that a backend server has failed so it can stop routing to it?",
        options: [
          "A. It waits for a user to complain",
          "B. It performs periodic health checks and removes nodes that fail them",
          "C. It reboots the entire cluster",
          "D. It uses sticky sessions",
        ],
        answer: "B",
        explanation:
          "B is correct: the balancer periodically probes each backend (e.g. a /healthz endpoint) and takes failing nodes out of rotation, restoring them when they recover. It doesn't rely on complaints, reboots, or stickiness for this.",
      },
      {
        q: "Why should the load balancer itself be deployed redundantly (e.g. active-passive or active-active)?",
        options: [
          "A. To reduce the number of backend servers needed",
          "B. Because otherwise the load balancer becomes a single point of failure that can take down the whole system",
          "C. To enable Layer 4 routing",
          "D. Redundancy is only needed for databases, not load balancers",
        ],
        answer: "B",
        explanation:
          "B is correct: if the single LB fails, all traffic stops, so you run it in a redundant pair (active-passive VIP failover or active-active behind DNS). It doesn't reduce backend count, isn't required for L4, and applies beyond databases.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "sd-caching",
    title: "Caching Strategies — Patterns, Eviction, Layers & Invalidation",
    shortLabel: "Caching",
    section: "Fundamentals",
    domain: "SystemDesign",
    tldr:
      "A cache stores hot data in fast storage to cut latency and offload the backing store. Write patterns: cache-aside (lazy — app loads on miss, most common), write-through (write cache + DB together, always fresh, slower writes), and write-back (write cache first, flush to DB later — fastest writes, risk of loss). Eviction policies decide what to drop when full: LRU (drop least-recently-used, the default) and LFU (drop least-frequently-used). Caches live at several layers — CDN (edge/static), application (Redis/Memcached), and database (query/buffer cache). The hardest part is invalidation: use TTLs, write-through, or explicit purges to avoid serving stale data.",
    subtopics: [
      {
        heading: "Read/write patterns",
        bullets: [
          { icon: "🎯", text: "**Cache-aside (lazy loading)** — app checks cache; on a **miss** it reads the DB, stores the result, then returns it. Most common; only requested data is cached, but the first read is slow and data can go stale." },
          { icon: "✍️", text: "**Write-through** — every write goes to the **cache and the DB together**, so the cache is always fresh; writes are slower and you cache data that may never be read." },
          { icon: "⏳", text: "**Write-back (write-behind)** — write to the **cache first** and flush to the DB **asynchronously** later; fastest writes and great for write-heavy loads, but data can be **lost** if the cache dies before flushing." },
        ],
      },
      {
        heading: "Eviction policies",
        bullets: [
          { icon: "🧹", text: "**LRU (Least Recently Used)** — evict the item untouched for the longest; the sensible default that assumes recently-used data is likely to be used again." },
          { icon: "📊", text: "**LFU (Least Frequently Used)** — evict the item with the fewest accesses; better when some items are persistently popular regardless of recency." },
          { icon: "⏰", text: "**TTL / FIFO / random** are also used — a TTL bounds staleness by expiring entries after a fixed time regardless of use." },
        ],
      },
      {
        heading: "Cache layers & invalidation",
        bullets: [
          { icon: "🌐", text: "**CDN cache** at the edge serves **static assets** (images, JS/CSS, video) close to users; **application cache** (Redis/Memcached) holds hot objects/sessions; **DB cache** (query/buffer pool) speeds repeated queries." },
          { icon: "🧨", text: "**Invalidation** is the hard problem: choose **TTL expiry** (simple, bounded staleness), **write-through/explicit purge** on update (fresh, more work), or **versioned keys** to sidestep stale reads." },
          { icon: "🌩️", text: "Watch for **thundering herd / cache stampede** on a popular miss (many requests hit the DB at once) — mitigate with **request coalescing**, **staggered TTLs**, or pre-warming." },
        ],
      },
    ],
    keyFacts: [
      { label: "Cache-aside", value: "Lazy load on miss (most common)", icon: "🎯" },
      { label: "Write-through", value: "Cache+DB together, always fresh", icon: "✍️" },
      { label: "Write-back", value: "Cache first, flush later (loss risk)", icon: "⏳" },
      { label: "Eviction", value: "LRU (recency) / LFU (frequency)", icon: "🧹" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'Load on miss, cache only what's read' → **cache-aside (lazy loading)**.",
        "'Cache must always match the DB' → **write-through**.",
        "'Write-heavy, fastest writes, can tolerate some loss' → **write-back**.",
        "'What to drop when full' → **LRU** (recency) or **LFU** (frequency).",
        "'Serve static assets near the user' → **CDN**; 'hot objects/sessions' → **Redis/Memcached**.",
        "'Avoid stale data' → **TTL + invalidation on write**; beware **cache stampede**.",
      ],
      analogyBrief:
        "A cache is the small stack of best-selling books a librarian keeps on the front desk. Cache-aside is fetching from the stacks only when someone asks; LRU is clearing the book nobody has touched in ages; and the hard part is remembering to swap in the new edition when the old one is out of date (invalidation).",
    },
    explanation:
      "A cache is a layer of fast storage that keeps frequently accessed (hot) data close to where it's needed, reducing latency for reads and offloading pressure from the slower, more expensive backing store such as a database. The core design decisions are how you read and write through the cache, how you evict data when the cache is full, which layer(s) you cache at, and how you keep cached data from going stale. For read/write patterns, cache-aside (also called lazy loading) is the most common: the application first checks the cache, and on a cache miss it reads from the database, stores the value in the cache, and returns it — this means only data that is actually requested gets cached and the cache stays small, but the first request for any item is slow and, because writes bypass the cache, cached data can become stale unless it is invalidated. Write-through instead writes to the cache and the database together on every write, so the cache is always consistent with the database and reads are always fresh; the cost is slower writes and caching data that might never be read again. Write-back (write-behind) writes only to the cache and asynchronously flushes to the database later, batching writes for the fastest possible write path and excellent write-heavy performance, at the risk of losing not-yet-flushed data if the cache node fails. Eviction policies decide what to remove when the cache reaches capacity: LRU (Least Recently Used) discards the entry that has gone untouched the longest and is the sensible default, based on the assumption that recently used data is likely to be used again soon; LFU (Least Frequently Used) discards the entry accessed the fewest times and works better when some items stay popular regardless of recency; and simpler schemes like FIFO, random, and time-based TTL expiry are also used, with TTLs bounding how stale any entry can get. Caching happens at multiple layers of a system: a CDN caches static assets (images, JavaScript, CSS, video) at edge locations physically close to users; an application cache such as Redis or Memcached holds hot objects, computed results, and session data in memory near the application tier; and the database itself caches with its buffer pool and query cache to accelerate repeated queries. The famously hard problem is cache invalidation — ensuring the cache doesn't keep serving data the source has since changed. The main strategies are TTL expiry (simple and self-healing but allows bounded staleness), write-through or explicit purge on update (keeps data fresh at the cost of extra work on every write), and versioned or hashed keys that make a new version a new cache entry so stale reads are impossible. A related hazard is the thundering herd or cache stampede: when a popular key expires or misses, a flood of concurrent requests all hit the database at once; you mitigate it by coalescing duplicate requests, staggering (jittering) TTLs so keys don't all expire together, and pre-warming or asynchronously refreshing hot entries before they expire.",
    analogy:
      "A cache is the small shelf of popular books a librarian keeps right on the front desk instead of making everyone walk into the vast stacks. With cache-aside, the librarian only grabs a book from the stacks when a patron actually asks for it, then leaves it on the desk in case someone else wants it — quick for the second reader, but the first reader waits. Write-through is the librarian who, whenever a book is updated, immediately reshelves both the desk copy and the vault copy so they never disagree. Write-back is jotting the change on the desk copy now and reshelving the vault copy at closing time — fast, but if the building burns down before closing, those notes are lost. When the desk gets too crowded, the librarian clears the book nobody has opened in weeks (LRU) or the one that's been borrowed the fewest times overall (LFU). And the perpetual headache is remembering to swap the desk copy when a new edition arrives — otherwise patrons keep reading outdated information (cache invalidation).",
    diagram: `<svg viewBox="0 0 720 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cache-aside read path and multi-layer caching">${svgDefs}
      ${box(20, 110, 90, 45, "Client", "request", "#8b949e")}
      ${box(150, 110, 110, 45, "App", "cache-aside", "#0ea5e9")}
      <line x1="110" y1="132" x2="148" y2="132" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(310, 60, 120, 45, "Cache", "Redis (hot)", "#22c55e")}
      ${box(310, 165, 120, 45, "Database", "source of truth", "#8b5cf6")}
      <line x1="260" y1="120" x2="308" y2="85" stroke="#ff9900" stroke-width="1.6" marker-end="url(#arrow)"/>
      <text x="245" y="100" fill="#22c55e" font-size="9">1. check</text>
      <line x1="260" y1="145" x2="308" y2="182" stroke="#8b949e" stroke-width="1.4" stroke-dasharray="4" marker-end="url(#arrow-mute)"/>
      <text x="235" y="172" fill="#f85149" font-size="9">2. miss -> DB</text>
      <line x1="370" y1="165" x2="370" y2="107" stroke="#22c55e" stroke-width="1.6" marker-end="url(#arrow)"/>
      <text x="378" y="140" fill="#22c55e" font-size="9">3. populate</text>
      ${box(500, 30, 150, 42, "CDN (edge)", "static assets", "#f59e0b")}
      ${box(500, 95, 150, 42, "App cache", "Redis/Memcached", "#22c55e")}
      ${box(500, 160, 150, 42, "DB cache", "buffer / query", "#8b5cf6")}
      <text x="500" y="230" fill="#8b949e" font-size="10">Layers: CDN -> app cache -> DB cache</text>
      <text x="500" y="248" fill="#8b949e" font-size="10">Evict with LRU/LFU; expire with TTL</text>
    </svg>`,
    diagramLegend: [
      { color: "#22c55e", label: "Cache (hot data)", description: "Fast in-memory store checked first; populated on a miss (cache-aside)." },
      { color: "#8b5cf6", label: "Database", description: "Source of truth read only on a miss; also caches via its buffer pool." },
      { color: "#f59e0b", label: "CDN edge", description: "Caches static assets close to users, the outermost caching layer." },
    ],
    codeExample: {
      language: "python",
      title: "Cache-aside read with TTL (lazy loading)",
      code: `import json

def get_user(user_id, cache, db, ttl=300):
    key = f"user:{user_id}"
    cached = cache.get(key)
    if cached is not None:          # cache HIT
        return json.loads(cached)

    user = db.query_user(user_id)   # cache MISS -> read source of truth
    cache.set(key, json.dumps(user), ex=ttl)  # populate with a TTL to bound staleness
    return user

def update_user(user_id, data, cache, db):
    db.update_user(user_id, data)
    cache.delete(f"user:{user_id}")  # invalidate on write so next read repopulates`,
    },
    codeExamples: [
      {
        language: "python",
        tab: "Cache-aside",
        title: "Lazy loading with TTL + invalidate-on-write",
        code: `def get_user(uid, cache, db, ttl=300):
    hit = cache.get(f"user:{uid}")
    if hit:
        return hit                    # HIT
    user = db.get(uid)                # MISS -> source of truth
    cache.set(f"user:{uid}", user, ex=ttl)
    return user

def update_user(uid, data, cache, db):
    db.update(uid, data)
    cache.delete(f"user:{uid}")       # invalidate; next read repopulates`,
      },
      {
        language: "python",
        tab: "Write patterns",
        title: "Write-through vs write-back",
        code: `def write_through(key, value, cache, db):
    db.set(key, value)                # write DB and cache together
    cache.set(key, value)             # cache is always fresh

def write_back(key, value, cache, dirty):
    cache.set(key, value)             # write cache only (fast)
    dirty.add(key)                    # mark for async flush later

def flush(cache, db, dirty):
    for key in list(dirty):           # background job flushes to DB
        db.set(key, cache.get(key))   # risk: data lost if cache dies first
        dirty.discard(key)`,
      },
      {
        language: "python",
        tab: "LRU eviction",
        title: "Minimal LRU cache with OrderedDict",
        code: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.cap = capacity
        self.store = OrderedDict()

    def get(self, key):
        if key not in self.store:
            return None
        self.store.move_to_end(key)   # mark most-recently used
        return self.store[key]

    def put(self, key, value):
        self.store[key] = value
        self.store.move_to_end(key)
        if len(self.store) > self.cap:
            self.store.popitem(last=False)  # evict least-recently used`,
      },
    ],
    problemStatement:
      "A product-detail page is read millions of times a day but updated rarely; each read currently hits the database and page latency is high under load. Occasionally a product's price changes and users briefly see the old price. Design a caching solution: which read/write pattern to use and why, where the cache should live (and what a CDN would additionally cache), which eviction policy fits a working set of a few hot products, how you keep the price from being served stale after an update, and how you avoid a database overload when a very popular product's cache entry expires.",
    questions: [
      {
        q: "In the cache-aside (lazy loading) pattern, what happens on a cache MISS?",
        options: [
          "A. The request fails and returns an error",
          "B. The application reads from the database, stores the result in the cache, and returns it",
          "C. The cache automatically writes to the database",
          "D. The request is queued until the cache is manually refreshed",
        ],
        answer: "B",
        explanation:
          "B is correct: on a miss the app loads from the source of truth (DB), populates the cache for next time, and returns the value. That lazy population is the defining behavior of cache-aside; it doesn't error or queue.",
      },
      {
        q: "Which write strategy keeps the cache and database consistent by writing to BOTH on every write, at the cost of slower writes?",
        options: [
          "A. Cache-aside",
          "B. Write-through",
          "C. Write-back (write-behind)",
          "D. Read-through only",
        ],
        answer: "B",
        explanation:
          "B is correct: write-through updates cache and DB together so the cache is always fresh, trading some write latency for consistency. Write-back writes cache first and flushes later; cache-aside writes bypass the cache.",
      },
      {
        q: "Write-back (write-behind) caching offers the fastest writes but carries which key risk?",
        options: [
          "A. It always serves stale reads",
          "B. Data not yet flushed to the database can be lost if the cache fails",
          "C. It cannot be used with Redis",
          "D. It doubles read latency",
        ],
        answer: "B",
        explanation:
          "B is correct: because writes hit only the cache and are flushed to the DB asynchronously, a cache failure before the flush loses that data. It doesn't inherently serve stale reads, is usable with Redis, and doesn't double read latency.",
      },
      {
        q: "A cache is full and must remove an item. Under an LRU policy, which item is evicted?",
        options: [
          "A. The item accessed the fewest total times",
          "B. The item that has not been accessed for the longest time",
          "C. A randomly chosen item",
          "D. The largest item by size",
        ],
        answer: "B",
        explanation:
          "B is correct: LRU (Least Recently Used) evicts the item untouched the longest. Evicting by fewest total accesses is LFU; random and largest-item are different policies.",
      },
      {
        q: "You want to serve images, CSS, and JavaScript to users worldwide with the lowest latency. Which caching layer is most appropriate?",
        options: [
          "A. A CDN caching static assets at edge locations near users",
          "B. The database buffer pool",
          "C. Write-back caching in the application server only",
          "D. An LFU eviction policy",
        ],
        answer: "A",
        explanation:
          "A is correct: a CDN caches static assets at edge locations physically close to users, cutting latency. The DB buffer pool serves query results, write-back is a write pattern, and LFU is an eviction policy — none address global static delivery.",
      },
      {
        q: "A very popular cached key expires and thousands of requests simultaneously miss and hit the database, overloading it. What is this problem called, and a valid mitigation?",
        options: [
          "A. Cache-aside; fix by disabling the cache",
          "B. Thundering herd / cache stampede; mitigate with request coalescing, staggered (jittered) TTLs, or pre-warming",
          "C. LRU thrashing; fix by switching to FIFO",
          "D. Write amplification; fix by increasing TTL to infinity",
        ],
        answer: "B",
        explanation:
          "B is correct: a stampede (thundering herd) occurs when many requests miss the same hot key at once; coalescing duplicate loads, jittering TTLs so keys don't expire together, and refreshing hot entries early all mitigate it. The other options misname or mishandle the issue.",
      },
    ],
  },
];
