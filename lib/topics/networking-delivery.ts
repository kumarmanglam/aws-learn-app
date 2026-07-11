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
// SECTION: Networking — Delivery & Scale
// Load balancing, CDN & HTTP caching, and WebSockets / real-time.
// Authored fresh to the messaging.ts / frontend-core.ts bar.
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

export const networkingDeliveryTopics: Topic[] = [
  // -----------------------------------------------------------------
  {
    id: "net-load-balancing",
    title: "Load Balancing — L4 vs L7, Algorithms & Health Checks",
    shortLabel: "Load Balancing",
    section: "Delivery & Scale",
    domain: "Networking",
    tldr:
      "A load balancer spreads incoming requests across a pool of backend servers so no single one is overwhelmed, giving you scalability and high availability. Layer 4 balancers route on TCP/UDP (fast, protocol-agnostic); Layer 7 balancers understand HTTP and can route by path, host, or headers. Distribution algorithms include round-robin, least-connections, and hashing; health checks remove unhealthy backends automatically, and sticky sessions pin a client to one server when state lives there.",
    subtopics: [
      {
        heading: "Layer 4 vs Layer 7",
        bullets: [
          { icon: "🔀", text: "**Layer 4 (transport)** balances on **TCP/UDP** — IP + port only. It doesn't read the payload, so it's **fast, low-latency, and protocol-agnostic** (great for raw TCP, gRPC, databases)." },
          { icon: "🧠", text: "**Layer 7 (application)** understands **HTTP/HTTPS**. It can route by **URL path, Host header, cookies, or method**, terminate TLS, rewrite headers, and do content-based routing to microservices." },
          { icon: "⚖️", text: "L4 = maximum throughput + minimal inspection; L7 = smarter routing at the cost of parsing every request. Pick L7 when you need path/host routing or TLS termination." },
        ],
      },
      {
        heading: "Distribution algorithms",
        bullets: [
          { icon: "🔁", text: "**Round-robin** — hand each new request to the next server in turn. Simple and fair when servers and requests are uniform." },
          { icon: "📉", text: "**Least-connections** — send to the backend with the **fewest active connections**. Better when request durations vary widely (long-lived connections, uneven load)." },
          { icon: "🧮", text: "**Hashing** (IP hash / consistent hashing) — a **client attribute (source IP, URL)** deterministically maps to a server, so the same client keeps hitting the same node without a cookie." },
        ],
      },
      {
        heading: "Health checks & sticky sessions",
        bullets: [
          { icon: "🩺", text: "**Health checks** probe each backend (e.g. `GET /health`). After N consecutive failures the server is marked **unhealthy** and pulled from rotation; when it passes again it's restored — this is how the LB delivers **high availability**." },
          { icon: "📌", text: "**Sticky sessions (session affinity)** pin a client to one backend (usually via a cookie or IP hash) so **in-memory session state** stays reachable. It hurts even balancing, so prefer **stateless servers + a shared session store** where possible." },
          { icon: "🕓", text: "**Connection draining / deregistration delay** lets in-flight requests finish before a server is removed, avoiding dropped responses during deploys or scale-in." },
        ],
      },
    ],
    keyFacts: [
      { label: "L4 routes on", value: "TCP/UDP (IP + port)", icon: "🔀" },
      { label: "L7 routes on", value: "HTTP path / host / headers", icon: "🧠" },
      { label: "Common algorithms", value: "Round-robin, least-conn, hash", icon: "🔁" },
      { label: "Removes bad nodes via", value: "Health checks", icon: "🩺" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'Route by URL path or hostname / terminate TLS' → **Layer 7**.",
        "'Balance raw TCP/UDP with lowest latency' → **Layer 4**.",
        "'Requests have very different durations' → **least-connections** over round-robin.",
        "'Same client must reach the same server' → **sticky sessions** or **IP/consistent hashing**.",
        "'How does the LB give HA?' → **health checks** eject unhealthy nodes automatically.",
      ],
      analogyBrief:
        "A load balancer is the host at a busy restaurant seating guests across many servers so no one waiter is swamped — and quietly stops seating anyone at a table whose waiter just walked off (a failed health check).",
    },
    explanation:
      "A load balancer sits in front of a pool of backend servers and distributes incoming client requests across them, so that traffic is spread evenly, no single instance is overwhelmed, and the system scales horizontally while staying highly available. Load balancers are commonly categorized by the OSI layer they operate at. A Layer 4 (transport-layer) balancer makes decisions using only TCP/UDP information — source and destination IP and port — without inspecting the payload; because it does almost no parsing it is extremely fast, low-latency, and protocol-agnostic, making it ideal for raw TCP, UDP, gRPC, or database traffic. A Layer 7 (application-layer) balancer actually understands the HTTP/HTTPS request, so it can route based on the URL path, the Host header, cookies, HTTP method, or query string; it can terminate TLS, rewrite or inject headers, and perform content-based routing to different microservices — at the cost of parsing every request. To decide which backend receives a request, the balancer applies a distribution algorithm: round-robin cycles through servers in order and is fair when servers and requests are uniform; least-connections sends the request to whichever backend currently has the fewest active connections, which handles uneven or long-lived request durations far better; and hashing algorithms (such as source-IP hash or consistent hashing) deterministically map a client attribute to a specific server so the same client repeatedly reaches the same node without needing a cookie. Health checks are what make the pool self-healing: the balancer periodically probes each backend (for example an HTTP GET to a /health endpoint or a TCP connect) and, after a configured number of consecutive failures, marks the server unhealthy and stops sending it traffic; once it starts passing again it is returned to rotation. Sticky sessions (session affinity) pin a given client to one backend — typically by issuing a cookie or by hashing the source IP — which is necessary when the server stores per-user session state in memory; the downside is that it undermines even load distribution and complicates scaling, so the preferred modern pattern is to keep servers stateless and store sessions in a shared external store (like Redis) so any server can serve any request. Finally, features like connection draining (deregistration delay) allow in-flight requests to complete before a server is removed during a deployment or scale-in, preventing dropped connections.",
    analogy:
      "A load balancer is the host standing at the door of a packed restaurant. As diners arrive, the host seats them across many waiters (backend servers) so no single waiter is buried while others stand idle — that's the distribution algorithm. Round-robin is seating people at table 1, 2, 3, 1, 2, 3 in strict rotation; least-connections is glancing around and seating the next guest with the waiter who has the fewest tables right now. Every so often the host checks on each waiter (health checks) and, if one has walked off the floor, stops seating guests in that section until they're back. Sticky sessions are like insisting a returning couple always gets their 'usual' waiter who already knows their order — convenient, but it means that waiter can get overloaded while others are free.",
    diagram: `<svg viewBox="0 0 720 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Load balancer distributing requests to a health-checked backend pool">${svgDefs}
      ${box(20, 95, 100, 50, "Clients", "requests", "#8b949e")}
      ${box(170, 90, 130, 60, "Load Balancer", "L4 / L7", "#0ea5e9")}
      <line x1="120" y1="120" x2="168" y2="120" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <rect x="380" y="20" width="320" height="210" rx="10" fill="#1a2332" stroke="#22c55e" stroke-dasharray="5 4"/>
      <text x="395" y="42" fill="#22c55e" font-size="11" font-weight="700">Backend pool (health-checked)</text>
      ${box(400, 55, 130, 45, "Server 1", "healthy ✓", "#22c55e")}
      ${box(550, 55, 130, 45, "Server 2", "healthy ✓", "#22c55e")}
      ${box(400, 115, 130, 45, "Server 3", "unhealthy ✗", "#f85149")}
      ${box(550, 115, 130, 45, "Server 4", "healthy ✓", "#22c55e")}
      <line x1="300" y1="110" x2="398" y2="77" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
      <line x1="300" y1="118" x2="548" y2="77" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
      <line x1="300" y1="130" x2="548" y2="137" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
      <line x1="300" y1="124" x2="398" y2="137" stroke="#8b949e" stroke-width="1.5" stroke-dasharray="4" marker-end="url(#arrow-mute)"/>
      <text x="395" y="185" fill="#8b949e" font-size="10">Server 3 failed its health check → no new traffic routed to it.</text>
      <text x="395" y="205" fill="#8b949e" font-size="10">Algorithm (round-robin / least-conn / hash) picks among healthy nodes.</text>
    </svg>`,
    diagramLegend: [
      { color: "#0ea5e9", label: "Load balancer", description: "Single entry point that spreads traffic across the pool." },
      { color: "#22c55e", label: "Healthy backends", description: "Pass health checks; eligible to receive requests." },
      { color: "#f85149", label: "Unhealthy backend", description: "Failed the health check; pulled from rotation until it recovers." },
    ],
    codeExample: {
      language: "nginx",
      title: "NGINX upstream with least-connections, health-based failover & sticky IP hash",
      code: `upstream app_pool {
    least_conn;                       # send to server with fewest active connections
    server 10.0.1.10:8080 max_fails=3 fail_timeout=30s;
    server 10.0.1.11:8080 max_fails=3 fail_timeout=30s;
    server 10.0.1.12:8080 max_fails=3 fail_timeout=30s;
    # ip_hash;                        # (alternative) pin each client IP to one backend
}

server {
    listen 80;
    location /api/ {                  # Layer 7 path-based routing
        proxy_pass http://app_pool;
        proxy_next_upstream error timeout http_502;  # retry another backend
    }
}`,
    },
    codeExamples: [
      {
        language: "nginx",
        tab: "L7 routing",
        title: "Path- and host-based routing (Layer 7)",
        code: `upstream web_pool  { server 10.0.1.10:8080; server 10.0.1.11:8080; }
upstream api_pool  { server 10.0.2.10:9090; server 10.0.2.11:9090; }

server {
    listen 80;
    server_name shop.example.com;

    location / {                 # web traffic
        proxy_pass http://web_pool;
    }
    location /api/ {             # route /api/* to a different pool
        proxy_pass http://api_pool;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}`,
      },
      {
        language: "nginx",
        tab: "Health checks",
        title: "Passive failover with max_fails / fail_timeout",
        code: `upstream app_pool {
    server 10.0.1.10:8080 max_fails=3 fail_timeout=15s;  # 3 fails => out for 15s
    server 10.0.1.11:8080 max_fails=3 fail_timeout=15s;
    server 10.0.1.12:8080 backup;                        # only used if others are down
}

server {
    location / {
        proxy_pass http://app_pool;
        # after a 5xx/timeout, transparently try the next healthy backend:
        proxy_next_upstream error timeout http_500 http_502 http_503;
    }
}`,
      },
      {
        language: "javascript",
        tab: "Round-robin",
        title: "A minimal round-robin picker (concept)",
        code: `class RoundRobinBalancer {
  constructor(servers) {
    this.servers = servers;   // e.g. ["s1", "s2", "s3"]
    this.i = -1;
  }
  next() {
    // skip unhealthy nodes; wrap around the ring
    for (let n = 0; n < this.servers.length; n++) {
      this.i = (this.i + 1) % this.servers.length;
      if (this.servers[this.i].healthy) return this.servers[this.i];
    }
    throw new Error("No healthy backends");
  }
}

const lb = new RoundRobinBalancer([
  { id: "s1", healthy: true },
  { id: "s2", healthy: false }, // will be skipped
  { id: "s3", healthy: true },
]);
console.log(lb.next().id, lb.next().id, lb.next().id); // s1 s3 s1`,
      },
    ],
    problemStatement:
      "Your web app runs on four identical stateless servers, but one crashes at 3am and users start seeing errors even though three healthy servers remain. Separately, a user complains they get logged out on every other request. Explain how a load balancer with health checks keeps the site up when a server dies, and what property of the servers (or which LB feature) is causing the random logouts and how you'd fix it.",
    questions: [
      {
        q: "What is the PRIMARY purpose of a load balancer?",
        options: [
          "A. Encrypt data at rest on backend disks",
          "B. Distribute incoming requests across multiple servers for scalability and availability",
          "C. Store user session data permanently",
          "D. Compile application source code",
        ],
        answer: "B",
        explanation:
          "B is correct: a load balancer spreads client requests across a pool of backends so no single server is overwhelmed, enabling horizontal scaling and high availability. It is not a storage, encryption-at-rest, or build tool.",
      },
      {
        q: "A Layer 4 load balancer makes routing decisions based on:",
        options: [
          "A. The HTTP URL path and Host header",
          "B. Cookies and request headers",
          "C. TCP/UDP information such as IP address and port",
          "D. The response body content",
        ],
        answer: "C",
        explanation:
          "C is correct: Layer 4 operates at the transport layer, routing on IP and port without inspecting the payload — fast and protocol-agnostic. Reading URL paths, headers, or cookies is Layer 7 behavior.",
      },
      {
        q: "Which capability requires a Layer 7 (application) load balancer rather than Layer 4?",
        options: [
          "A. Balancing raw TCP connections",
          "B. Routing requests to different backends based on the URL path (e.g. /api vs /web)",
          "C. Forwarding UDP packets",
          "D. Distributing by source IP hash only",
        ],
        answer: "B",
        explanation:
          "B is correct: path-based (content-based) routing requires understanding HTTP, which is a Layer 7 feature. Balancing raw TCP/UDP and pure IP-hash distribution can be done at Layer 4.",
      },
      {
        q: "Requests to your service vary greatly in duration — some finish in 5ms, others hold a connection for minutes. Which algorithm balances load MOST effectively?",
        options: [
          "A. Round-robin",
          "B. Least-connections",
          "C. Random with no state",
          "D. First-server-always",
        ],
        answer: "B",
        explanation:
          "B is correct: least-connections routes to the backend with the fewest active connections, so long-lived requests don't pile up on one server. Round-robin ignores how busy each server actually is, causing imbalance with uneven durations.",
      },
      {
        q: "How does a load balancer keep the application available when one backend server fails?",
        options: [
          "A. It restarts the failed server's operating system",
          "B. Health checks detect the failure and the LB stops routing traffic to that server",
          "C. It buffers all requests until the server recovers",
          "D. It replicates the failed server's memory to clients",
        ],
        answer: "B",
        explanation:
          "B is correct: periodic health checks mark a repeatedly failing backend as unhealthy and remove it from rotation, so requests only go to healthy servers. The LB doesn't reboot hosts or mirror memory to clients.",
      },
      {
        q: "Users report being randomly logged out. Sessions are stored in each server's local memory and the LB uses round-robin. What is the BEST fix?",
        options: [
          "A. Increase the health-check interval",
          "B. Switch to a slower distribution algorithm",
          "C. Make servers stateless and store sessions in a shared store (or enable sticky sessions)",
          "D. Add more Layer 4 balancers in front",
        ],
        answer: "C",
        explanation:
          "C is correct: with local in-memory sessions and round-robin, a follow-up request hitting a different server has no session. Store sessions in a shared store (e.g. Redis) so any server can serve any request, or enable sticky sessions to pin the client to one server. Tuning health checks, algorithms, or adding L4 balancers doesn't address the missing shared state.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "net-cdn-caching",
    title: "CDN & HTTP Caching — Edge, Cache-Control, ETag & Invalidation",
    shortLabel: "CDN & Caching",
    section: "Delivery & Scale",
    domain: "Networking",
    tldr:
      "A CDN is a globally distributed network of edge servers that cache your content close to users, cutting latency and offloading the origin. HTTP caching is governed by the Cache-Control header (which sets the TTL / freshness and public-vs-private scope) and by validators like ETag and Last-Modified that let a client revalidate a stale copy with a cheap 304 Not Modified. Because cached copies can go out of date, you control freshness with TTLs and force updates with cache invalidation or content versioning.",
    subtopics: [
      {
        heading: "What a CDN does",
        bullets: [
          { icon: "🌍", text: "A CDN caches copies of your assets on **edge servers (PoPs)** around the world; a user is served from the **nearest edge**, slashing round-trip latency." },
          { icon: "🛡️", text: "On a **cache hit** the edge answers directly, **offloading the origin** (fewer requests, less bandwidth, more resilience to traffic spikes and DDoS)." },
          { icon: "❄️", text: "On a **cache miss** the edge fetches from origin, stores it, then serves it — subsequent requests in that region are hits until the entry expires." },
        ],
      },
      {
        heading: "Controlling freshness: Cache-Control & TTL",
        bullets: [
          { icon: "🕓", text: "**`Cache-Control: max-age=N`** sets the **TTL** in seconds — how long a copy is considered fresh before it must be re-checked or re-fetched." },
          { icon: "🔓", text: "**`public`** = any cache (including the CDN) may store it; **`private`** = only the browser; **`no-store`** = never cache; **`no-cache`** = cache but **revalidate every time** before use." },
          { icon: "🧊", text: "**`immutable`** + a long `max-age` tells browsers a versioned asset (e.g. `app.9f3c.js`) never changes — the ideal pattern for fingerprinted static files." },
        ],
      },
      {
        heading: "Validation & invalidation",
        bullets: [
          { icon: "🏷️", text: "**ETag** is a fingerprint of the content; the client re-asks with **`If-None-Match`** and gets a tiny **`304 Not Modified`** (no body) if unchanged — saving bandwidth. `Last-Modified` + `If-Modified-Since` works similarly by date." },
          { icon: "🧹", text: "**Invalidation** removes/expires cached entries early (e.g. a CloudFront invalidation on `/index.html`) so a deploy is seen immediately — but it's slower and can cost money at scale." },
          { icon: "🔖", text: "**Cache busting via versioned URLs** (fingerprinted filenames or `?v=hash`) is usually better than invalidation: a new filename is simply a new cache key, so old and new can coexist and long TTLs stay safe." },
        ],
      },
    ],
    keyFacts: [
      { label: "Serves from", value: "Nearest edge / PoP", icon: "🌍" },
      { label: "Freshness set by", value: "Cache-Control: max-age (TTL)", icon: "🕓" },
      { label: "Cheap revalidation", value: "ETag + 304 Not Modified", icon: "🏷️" },
      { label: "Force an update", value: "Invalidation or versioned URL", icon: "🧹" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'Reduce latency for global users / offload origin' → **CDN edge caching**.",
        "'Set how long a response is cached' → **`Cache-Control: max-age`** (the TTL).",
        "'Don't waste bandwidth re-downloading unchanged files' → **ETag / If-None-Match → 304**.",
        "'Deployed but users see the old file' → **invalidate the cache** or **version the filename**.",
        "'Per-user, sensitive data' → **`Cache-Control: private`** (or `no-store`), never `public`.",
      ],
      analogyBrief:
        "A CDN is a chain of neighborhood libraries stocking copies of a popular book so you don't ship to the central archive every time — and the due-date stamp (TTL) plus a 'has this edition changed?' phone call (ETag) decide when to refresh a copy.",
    },
    explanation:
      "A Content Delivery Network (CDN) is a geographically distributed set of edge servers (points of presence, or PoPs) that cache copies of your content close to end users. When a user requests an asset, they are served from the nearest edge rather than your origin server, which dramatically reduces network round-trip latency. On a cache hit the edge returns the stored copy immediately; this offloads the origin, reducing its request volume and bandwidth and making the system far more resilient to traffic spikes and denial-of-service attacks. On a cache miss the edge fetches the object from the origin, stores it locally, and then serves it, so that later requests from the same region become hits until the entry expires. How long an object stays fresh — and who is allowed to cache it — is governed primarily by the HTTP Cache-Control response header. Cache-Control: max-age=N sets the time-to-live (TTL) in seconds: the period during which a cached copy is considered fresh and can be served without contacting the origin. The public directive allows shared caches such as the CDN to store the response, while private restricts caching to the end user's browser (used for per-user or sensitive data); no-store forbids caching entirely, and no-cache permits storing but requires the cache to revalidate with the origin before every use. For versioned static assets whose contents never change under a given URL, combining a long max-age with immutable is ideal. Because a cached copy can drift out of date, HTTP provides cheap validation using validators: an ETag is an opaque fingerprint of the resource's content, and the client can send it back in an If-None-Match header; if the resource is unchanged the origin replies 304 Not Modified with no body, so the client keeps its cached copy and only a tiny response crosses the wire. Last-Modified with If-Modified-Since achieves the same thing using a timestamp. When you actually change content and need caches to stop serving the old version, you have two main tools. Invalidation explicitly evicts or expires cached entries early — for example issuing a CloudFront invalidation on /index.html so a deployment becomes visible immediately — but invalidations propagate more slowly and can incur cost at high volume. The generally preferred approach is cache busting through versioned URLs: fingerprinting filenames (app.9f3c.js) or appending a version query string means each new build has a brand-new cache key, so old and new files coexist harmlessly and you can safely keep very long TTLs on the immutable assets while only the small, un-cached HTML document points at the latest filenames.",
    analogy:
      "Think of a CDN as a chain of neighborhood libraries. Instead of everyone traveling to the single central archive (your origin) for a popular book, each local branch (an edge server) keeps its own copy, so you just walk down the street. The first time a branch is asked for a book it doesn't have (a cache miss), it orders one from the archive and shelves it; after that, everyone nearby borrows the local copy (cache hits). Each copy has a due-date stamp (the TTL from Cache-Control) after which the branch should check whether a newer edition exists. Rather than re-shipping the whole book to check, the branch makes a quick phone call quoting the edition's fingerprint — 'is edition ETag abc123 still current?' — and the archive answers 'yep, unchanged' (a 304), saving the whole shipment. When a truly new edition comes out, you either recall every old copy (invalidation) or, more cleverly, give the new edition a new title on the spine (a versioned filename) so branches simply stock it as a new book and the old one quietly ages out.",
    diagram: `<svg viewBox="0 0 720 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Client to edge cache to origin, with cache hit and miss paths">${svgDefs}
      ${box(20, 100, 100, 55, "Client", "browser", "#8b949e")}
      ${box(200, 95, 150, 65, "CDN Edge (PoP)", "cache · TTL", "#0ea5e9")}
      ${box(560, 100, 130, 55, "Origin", "your server", "#f59e0b")}
      <line x1="120" y1="115" x2="198" y2="115" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="128" y="108" fill="#8b949e" font-size="9">request</text>
      <line x1="198" y1="140" x2="122" y2="140" stroke="#22c55e" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="128" y="158" fill="#22c55e" font-size="9">HIT: served from edge (fast)</text>
      <line x1="350" y1="120" x2="558" y2="120" stroke="#8b949e" stroke-width="1.5" stroke-dasharray="4" marker-end="url(#arrow-mute)"/>
      <text x="380" y="112" fill="#8b949e" font-size="9">MISS: fetch + store</text>
      <line x1="558" y1="140" x2="352" y2="140" stroke="#8b949e" stroke-width="1.5" stroke-dasharray="4" marker-end="url(#arrow-mute)"/>
      <text x="380" y="158" fill="#8b949e" font-size="9">origin response (cached at edge)</text>
      <text x="200" y="200" fill="#8b949e" font-size="10">Cache-Control: public, max-age=31536000, immutable  →  long TTL for /static/app.9f3c.js</text>
      <text x="200" y="220" fill="#8b949e" font-size="10">Revalidate stale HTML with ETag → 304 Not Modified (no body re-sent)</text>
    </svg>`,
    diagramLegend: [
      { color: "#0ea5e9", label: "CDN edge (PoP)", description: "Caches content near the user; answers hits locally within the TTL." },
      { color: "#f59e0b", label: "Origin", description: "Source of truth; contacted only on a miss or a revalidation." },
      { color: "#22c55e", label: "Cache hit path", description: "Fast response straight from the edge without touching the origin." },
    ],
    codeExample: {
      language: "bash",
      title: "Inspect caching headers and observe a 304 revalidation",
      code: `# 1) See the caching directives and validators the server sends:
curl -sI https://example.com/static/app.9f3c.js
# HTTP/2 200
# cache-control: public, max-age=31536000, immutable
# etag: "9f3c-a12b"

# 2) Revalidate using the ETag — unchanged content returns 304 (no body):
curl -sI https://example.com/index.html \\
  -H 'If-None-Match: "abc123"'
# HTTP/2 304 Not Modified   <-- client keeps its cached copy, saves bandwidth`,
    },
    codeExamples: [
      {
        language: "nginx",
        tab: "Cache-Control",
        title: "Long TTL for fingerprinted assets, no-cache for HTML",
        code: `# Versioned static assets never change under their URL -> cache forever
location ~* \\.(js|css|woff2|png|jpg|svg)$ {
    add_header Cache-Control "public, max-age=31536000, immutable";
}

# HTML is the entry point that references the versioned files -> always revalidate
location = /index.html {
    add_header Cache-Control "no-cache";   # store, but check ETag before using
}

# Per-user / sensitive responses must not hit a shared cache
location /account/ {
    add_header Cache-Control "private, no-store";
}`,
      },
      {
        language: "javascript",
        tab: "ETag / 304",
        title: "Express: emit an ETag and answer conditional requests",
        code: `import express from "express";
import crypto from "crypto";
const app = express();

const body = JSON.stringify({ msg: "hello" });
const etag = '"' + crypto.createHash("sha1").update(body).digest("hex") + '"';

app.get("/data", (req, res) => {
  res.set("Cache-Control", "no-cache");  // must revalidate each time
  res.set("ETag", etag);

  // Client already has this version? Send a cheap 304 with no body.
  if (req.headers["if-none-match"] === etag) {
    return res.status(304).end();
  }
  res.type("application/json").send(body);
});`,
      },
      {
        language: "bash",
        tab: "Invalidation",
        title: "Force a CDN refresh after a deploy (CloudFront)",
        code: `# Preferred: version filenames so new builds are new cache keys (no invalidation needed).
# When you must purge cached HTML immediately after a deploy:
aws cloudfront create-invalidation \\
  --distribution-id E123ABC456DEF \\
  --paths "/index.html" "/"

# Invalidations propagate to all edges; the next request repopulates from origin.
# Avoid broad "/*" invalidations at scale -- they are slower and can cost money.`,
      },
    ],
    problemStatement:
      "You ship a critical bug fix to your single-page app, but hours later users still load the broken version, while your API bills spike from clients re-downloading a large unchanged JSON file on every page. Explain what caching header controls how long the old files are served, how ETags could have avoided the wasteful re-downloads, and the two ways to make sure users get the new deploy immediately.",
    questions: [
      {
        q: "What is the main benefit of serving content from a CDN edge server instead of the origin?",
        options: [
          "A. It permanently stores the only copy of your data",
          "B. It reduces latency by serving cached content from a location near the user and offloads the origin",
          "C. It encrypts the database",
          "D. It compiles server-side code faster",
        ],
        answer: "B",
        explanation:
          "B is correct: a CDN caches content on edge servers close to users, cutting round-trip latency and reducing load on the origin. It is not the sole data store, a database encryptor, or a build tool.",
      },
      {
        q: "Which HTTP header primarily controls how long a response may be cached (its TTL)?",
        options: [
          "A. Content-Type",
          "B. Authorization",
          "C. Cache-Control: max-age",
          "D. Accept-Encoding",
        ],
        answer: "C",
        explanation:
          "C is correct: Cache-Control: max-age=N specifies the freshness lifetime (TTL) in seconds. Content-Type describes the payload, Authorization carries credentials, and Accept-Encoding negotiates compression.",
      },
      {
        q: "A client has a cached file with an ETag. On its next request it sends If-None-Match and the content is unchanged. What does the server return?",
        options: [
          "A. 200 OK with the full body again",
          "B. 304 Not Modified with no body, so the client reuses its cached copy",
          "C. 404 Not Found",
          "D. 500 Internal Server Error",
        ],
        answer: "B",
        explanation:
          "B is correct: when the ETag matches, the server responds 304 Not Modified with no body, letting the client keep its cached copy and saving bandwidth. A 200 would needlessly re-send the whole file.",
      },
      {
        q: "A response contains per-user account data. Which Cache-Control directive is appropriate?",
        options: [
          "A. public, max-age=86400",
          "B. private (or no-store) so shared caches like the CDN don't store it",
          "C. immutable",
          "D. max-age=31536000",
        ],
        answer: "B",
        explanation:
          "B is correct: private restricts caching to the user's own browser (and no-store forbids caching), preventing a shared CDN cache from serving one user's data to another. Marking sensitive per-user data public with a long TTL would leak it.",
      },
      {
        q: "You deployed new code but users still see the old cached files. Which are valid ways to make the update take effect immediately?",
        options: [
          "A. Lower the TCP window size",
          "B. Issue a cache invalidation for the changed paths, or use versioned/fingerprinted filenames",
          "C. Disable the load balancer health checks",
          "D. Switch the server from HTTP/2 to HTTP/1.1",
        ],
        answer: "B",
        explanation:
          "B is correct: invalidating the cached paths evicts the stale copies, and versioning filenames makes new builds new cache keys that bypass the old cached entries. TCP tuning, health checks, and HTTP versions don't control cache freshness.",
      },
      {
        q: "Why is cache busting via versioned filenames (e.g. app.9f3c.js) often preferred over frequent CDN invalidations?",
        options: [
          "A. Versioned URLs are new cache keys, so old and new coexist and you can safely keep very long TTLs without purging",
          "B. Invalidations make files download faster",
          "C. Versioned filenames disable caching entirely",
          "D. Invalidation is required by the HTTP spec on every deploy",
        ],
        answer: "A",
        explanation:
          "A is correct: a fingerprinted filename is a distinct cache key, so a new build is simply a new object — old and new copies coexist, long immutable TTLs stay safe, and no purge is needed. Invalidations can be slower and costlier at scale, and versioning does not disable caching.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "net-websockets",
    title: "WebSockets & Real-Time — Handshake, Polling & SSE",
    shortLabel: "WebSockets",
    section: "Delivery & Scale",
    domain: "Networking",
    tldr:
      "WebSockets provide a single, persistent, full-duplex TCP connection between client and server, established by an HTTP Upgrade handshake and then switching to the ws:// (or wss://) protocol. Unlike HTTP request/response, either side can push messages at any time with low overhead, making it ideal for chat, live dashboards, multiplayer games, and collaborative editing. Compared with polling (repeated requests) and Server-Sent Events (one-way server→client), WebSockets are the choice when you need low-latency, bidirectional communication.",
    subtopics: [
      {
        heading: "The upgrade handshake",
        bullets: [
          { icon: "🤝", text: "A WebSocket starts as an ordinary **HTTP GET** with `Connection: Upgrade` and `Upgrade: websocket` plus a `Sec-WebSocket-Key`; the server replies **`101 Switching Protocols`** and the connection is now a WebSocket." },
          { icon: "🔌", text: "After the handshake the **same TCP connection stays open** and both sides exchange lightweight **message frames** — no repeated headers, no new connections per message." },
          { icon: "🔒", text: "Use **`wss://`** (WebSocket over TLS) in production, just as you'd use HTTPS; it runs on port 443 and passes through most proxies/firewalls cleanly." },
        ],
      },
      {
        heading: "vs polling & SSE",
        bullets: [
          { icon: "🔁", text: "**Short polling** repeatedly asks 'anything new?' on a timer — simple but wasteful (constant requests, added latency, header overhead). **Long polling** holds each request open until data arrives, better but still one message per round-trip." },
          { icon: "📡", text: "**Server-Sent Events (SSE)** is a **one-way** server→client stream over a single long-lived HTTP response; great for feeds/notifications, auto-reconnects, but the **client can't push** back over the same channel." },
          { icon: "↔️", text: "**WebSockets are full-duplex** — either side can send anytime with minimal per-message overhead — so they win for **truly bidirectional, low-latency** interaction." },
        ],
      },
      {
        heading: "Use cases & trade-offs",
        bullets: [
          { icon: "💬", text: "Ideal for **chat, live dashboards/tickers, multiplayer games, collaborative editing (e.g. shared docs), and live notifications** where instant two-way updates matter." },
          { icon: "⚖️", text: "Costs: persistent connections **consume server memory/sockets**, need **stateful** handling (harder to load-balance — often sticky sessions or a pub/sub backplane like Redis), and don't fit request/response caching." },
          { icon: "🧯", text: "Add **heartbeats/ping-pong** to detect dead connections and **reconnect-with-backoff** on the client; for one-way needs or simplicity, SSE or polling may be the better fit." },
        ],
      },
    ],
    keyFacts: [
      { label: "Connection", value: "Persistent, full-duplex TCP", icon: "🔌" },
      { label: "Established by", value: "HTTP Upgrade → 101", icon: "🤝" },
      { label: "Secure scheme", value: "wss:// (over TLS, port 443)", icon: "🔒" },
      { label: "vs SSE", value: "SSE is one-way; WS is two-way", icon: "↔️" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'Real-time, two-way, low latency (chat/game/collab)' → **WebSockets**.",
        "'One-way server→client stream, auto-reconnect, simple' → **Server-Sent Events**.",
        "'How does a WebSocket start?' → **HTTP Upgrade handshake → 101 Switching Protocols**.",
        "'Why not just poll?' → polling is **wasteful & higher-latency**; WS keeps one open connection.",
        "'Scaling WebSockets is hard' → **stateful connections** need sticky sessions or a pub/sub backplane.",
      ],
      analogyBrief:
        "Polling is repeatedly calling the pizzeria to ask 'is it ready yet?'; a WebSocket is keeping the phone line open so either of you can speak the moment there's news.",
    },
    explanation:
      "A WebSocket is a persistent, full-duplex communication channel between a client and a server over a single TCP connection. It begins life as a normal HTTP request: the client sends an HTTP GET carrying the headers Connection: Upgrade, Upgrade: websocket, and a randomly generated Sec-WebSocket-Key. If the server supports WebSockets it responds with status 101 Switching Protocols and a Sec-WebSocket-Accept header derived from the client's key; at that point the protocol switches away from HTTP and the same TCP connection is reused as a WebSocket. From then on, both sides exchange small, framed messages with very little overhead — there are no repeated HTTP headers and no new connection per message — and, crucially, either the client or the server can send a message at any time (full duplex). In production you use the wss:// scheme (WebSocket over TLS), which runs over port 443 and therefore traverses most proxies and firewalls cleanly, just as HTTPS does. The value of WebSockets is clearest when compared to the alternatives. With short polling the client repeatedly issues requests on a timer to ask whether new data exists; this is simple but wasteful because most requests return nothing, it adds latency (updates wait for the next poll), and every request re-sends headers. Long polling improves on this by holding each request open until the server has data to return, but you still incur a full round-trip per message. Server-Sent Events (SSE) open a single long-lived HTTP response over which the server streams events to the client; SSE is lightweight, automatically reconnects, and is perfect for one-directional feeds such as notifications or a live activity stream — but it is one-way, so the client cannot push data back over the same channel and must fall back to normal HTTP requests to send. WebSockets are the right tool when you need genuinely bidirectional, low-latency messaging: chat applications, live dashboards and financial tickers, multiplayer games, collaborative document editing, and real-time notifications. The trade-offs are that each open connection consumes server memory and a socket, connections are stateful and therefore harder to load-balance (you typically need sticky sessions or a shared pub/sub backplane such as Redis so any server can broadcast to any connected client), and the request/response caching that HTTP enjoys does not apply. To keep connections healthy you add heartbeats (ping/pong frames) to detect dead peers and implement reconnect-with-exponential-backoff on the client. For purely one-way or simpler needs, SSE or long polling can be the better, cheaper choice.",
    analogy:
      "Imagine you're waiting on a pizza order. Short polling is calling the pizzeria every two minutes to ask 'is it ready yet?' — most calls are wasted, and you only find out it's done at your next scheduled call, not the instant it comes out of the oven. Long polling is calling and staying on hold until they finally say 'ready!' — better, but you have to hang up and call again for the next update. Server-Sent Events is like signing up for their text-alert list: they text you updates automatically, but it's a one-way broadcast — you can't reply on that channel. A WebSocket is keeping a phone line open with the shop the whole time: the moment your pizza is ready they tell you, and the moment you want to add garlic bread you just say so — either side can speak instantly, with no need to redial.",
    diagram: `<svg viewBox="0 0 720 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="WebSocket upgrade handshake then persistent bidirectional frames">${svgDefs}
      ${box(60, 30, 150, 45, "Client", "browser", "#8b949e")}
      ${box(510, 30, 150, 45, "Server", "ws endpoint", "#0ea5e9")}
      <line x1="135" y1="75" x2="135" y2="235" stroke="#30363d" stroke-width="1.5"/>
      <line x1="585" y1="75" x2="585" y2="235" stroke="#30363d" stroke-width="1.5"/>
      <line x1="135" y1="105" x2="583" y2="105" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="150" y="98" fill="#e6edf3" font-size="10">GET /chat — Upgrade: websocket + Sec-WebSocket-Key</text>
      <line x1="585" y1="135" x2="137" y2="135" stroke="#22c55e" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="200" y="128" fill="#22c55e" font-size="10">101 Switching Protocols (handshake done)</text>
      <text x="255" y="162" fill="#f59e0b" font-size="10" font-weight="700">— connection now full-duplex (wss://) —</text>
      <line x1="135" y1="185" x2="583" y2="185" stroke="#0ea5e9" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="180" y="178" fill="#8b949e" font-size="10">client → server message frame</text>
      <line x1="585" y1="210" x2="137" y2="210" stroke="#0ea5e9" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="180" y="230" fill="#8b949e" font-size="10">server → client push (anytime, same open connection)</text>
    </svg>`,
    diagramLegend: [
      { color: "#ff9900", label: "Upgrade request", description: "HTTP GET asking to switch protocols to WebSocket." },
      { color: "#22c55e", label: "101 response", description: "Server accepts; the connection becomes a WebSocket." },
      { color: "#0ea5e9", label: "Message frames", description: "Lightweight, bidirectional frames over the one persistent connection." },
    ],
    codeExample: {
      language: "javascript",
      title: "Browser WebSocket client with reconnect-friendly handlers",
      code: `const ws = new WebSocket("wss://example.com/chat");

ws.addEventListener("open", () => {
  ws.send(JSON.stringify({ type: "join", room: "general" }));
});

ws.addEventListener("message", (event) => {
  const msg = JSON.parse(event.data); // server can push at any time
  console.log("received:", msg);
});

ws.addEventListener("close", () => {
  // reconnect with backoff (real code would grow the delay)
  setTimeout(() => location.reload(), 1000);
});

// Either side can send whenever it wants (full-duplex):
document.querySelector("#send").onclick = () =>
  ws.send(JSON.stringify({ type: "chat", text: "hello!" }));`,
    },
    codeExamples: [
      {
        language: "javascript",
        tab: "WS server",
        title: "Node.js broadcast server (ws library)",
        code: `import { WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (socket) => {
  socket.send(JSON.stringify({ type: "welcome" }));

  socket.on("message", (data) => {
    // fan the message out to every connected client (chat broadcast)
    for (const client of wss.clients) {
      if (client.readyState === client.OPEN) client.send(data);
    }
  });

  // heartbeat: detect and clean up dead connections
  socket.isAlive = true;
  socket.on("pong", () => (socket.isAlive = true));
});

setInterval(() => {
  for (const c of wss.clients) {
    if (!c.isAlive) return c.terminate();
    c.isAlive = false;
    c.ping();
  }
}, 30000);`,
      },
      {
        language: "javascript",
        tab: "SSE (one-way)",
        title: "Server-Sent Events — server → client only",
        code: `// SERVER (Express): stream events over one long-lived HTTP response
app.get("/events", (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
  });
  const timer = setInterval(() => {
    res.write(\`data: \${JSON.stringify({ time: Date.now() })}\\n\\n\`);
  }, 1000);
  req.on("close", () => clearInterval(timer));
});

// CLIENT: EventSource auto-reconnects; note it's RECEIVE-only
const es = new EventSource("/events");
es.onmessage = (e) => console.log("tick:", JSON.parse(e.data));`,
      },
      {
        language: "bash",
        tab: "Polling",
        title: "Short vs long polling (the fallback WebSockets replace)",
        code: `# SHORT POLLING: ask on a timer -- most responses are empty (wasteful)
while true; do
  curl -s https://example.com/api/messages?since=$LAST
  sleep 2   # latency = up to 2s; constant requests even with no new data
done

# LONG POLLING: server holds the request open until data is ready,
# then the client immediately re-requests. Fewer empty responses,
# but still one full round-trip per message (no true server push).
curl -s "https://example.com/api/messages?wait=30&since=$LAST"`,
      },
    ],
    problemStatement:
      "You're building a live chat feature. Your first version has the browser call GET /messages every 2 seconds, which feels laggy and hammers the server with mostly-empty responses as users grow. Explain how a WebSocket connection is established and why it fixes both the latency and the wasted-request problems, when Server-Sent Events would be sufficient instead, and one reason WebSockets are harder to scale across multiple servers.",
    questions: [
      {
        q: "What best describes a WebSocket connection?",
        options: [
          "A. A stateless request/response like normal HTTP",
          "B. A persistent, full-duplex connection where both client and server can send messages anytime",
          "C. A one-way stream from client to server only",
          "D. A connection that closes after each message",
        ],
        answer: "B",
        explanation:
          "B is correct: a WebSocket keeps a single TCP connection open and is full-duplex, so either side can push messages at any time. That is precisely what distinguishes it from stateless HTTP request/response.",
      },
      {
        q: "How is a WebSocket connection established?",
        options: [
          "A. By opening a raw UDP socket on port 53",
          "B. Via an HTTP Upgrade handshake that the server answers with 101 Switching Protocols",
          "C. By sending an SMTP HELO command",
          "D. Automatically, with no initial HTTP request",
        ],
        answer: "B",
        explanation:
          "B is correct: the client sends an HTTP GET with Connection: Upgrade / Upgrade: websocket, and the server replies 101 Switching Protocols, after which the connection becomes a WebSocket. It is not UDP/DNS, SMTP, or headerless.",
      },
      {
        q: "Why are WebSockets generally more efficient than short polling for frequent real-time updates?",
        options: [
          "A. They open a new connection for every message",
          "B. They keep one connection open, avoiding repeated requests and per-request header overhead, and deliver updates instantly",
          "C. They cache responses at the CDN edge",
          "D. They compress the database",
        ],
        answer: "B",
        explanation:
          "B is correct: polling repeatedly issues requests (mostly empty) and updates only arrive at the next poll, whereas a WebSocket reuses one open connection and the server pushes instantly with minimal overhead. WebSockets don't open a connection per message or rely on CDN caching.",
      },
      {
        q: "You need a live stock ticker that only streams updates FROM the server TO the browser, with automatic reconnection and minimal complexity. Which is the most fitting choice?",
        options: [
          "A. Server-Sent Events (SSE)",
          "B. Full WebSockets with a custom protocol",
          "C. Short polling every 100ms",
          "D. FTP",
        ],
        answer: "A",
        explanation:
          "A is correct: SSE is a lightweight one-way (server→client) stream with built-in auto-reconnect — ideal when the client doesn't need to push data back. WebSockets add unneeded bidirectional complexity here, aggressive polling is wasteful, and FTP is unrelated.",
      },
      {
        q: "Which URL scheme should you use for a secure WebSocket connection in production?",
        options: [
          "A. ws://",
          "B. https://",
          "C. wss://",
          "D. ftps://",
        ],
        answer: "C",
        explanation:
          "C is correct: wss:// is WebSocket over TLS (running on port 443), the secure equivalent of ws://. https:// is for regular web requests, ws:// is unencrypted, and ftps:// is secure FTP.",
      },
      {
        q: "What makes WebSockets harder to scale horizontally across many servers than stateless HTTP?",
        options: [
          "A. They cannot be encrypted",
          "B. Connections are long-lived and stateful, so you often need sticky sessions or a pub/sub backplane to broadcast to clients on other servers",
          "C. They only work on a single physical machine by design",
          "D. They require the CDN to store every message permanently",
        ],
        answer: "B",
        explanation:
          "B is correct: because each WebSocket is a persistent, stateful connection pinned to one server, delivering a message to clients connected elsewhere requires sticky sessions plus a shared pub/sub backplane (e.g. Redis). They can be encrypted (wss://), aren't limited to one machine, and don't depend on CDN storage.",
      },
    ],
  },
];
