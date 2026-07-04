// ============================================================
// SECTION: Web Protocols — HTTP/HTTPS, REST API Design, TCP/IP & UDP.
// Networking fundamentals authored to the messaging.ts / frontend-core.ts bar.
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

export const networkingProtocolsTopics: Topic[] = [
  // -----------------------------------------------------------------
  {
    id: "net-http",
    title: "HTTP & HTTPS — Methods, Status Codes & Versions",
    shortLabel: "HTTP & HTTPS",
    section: "Web Protocols",
    domain: "Networking",
    tldr:
      "HTTP is a stateless request/response protocol: a client sends a method (GET, POST, PUT, PATCH, DELETE…) with headers and an optional body, and the server replies with a status code (1xx–5xx), headers, and a body. HTTPS is HTTP wrapped in TLS for encryption, integrity, and server authentication. The protocol evolved from text-based HTTP/1.1 (one request per connection, head-of-line blocking) to binary multiplexed HTTP/2, to HTTP/3 over QUIC (UDP) which removes TCP-level head-of-line blocking.",
    subtopics: [
      {
        heading: "Requests, methods & headers",
        bullets: [
          { icon: "📨", text: "A request has a **method + path + version**, **headers** (key: value metadata), and an optional **body**; the response has a **status line**, headers, and body." },
          { icon: "🔤", text: "Common methods: **GET** (read, safe), **POST** (create/submit), **PUT** (replace), **PATCH** (partial update), **DELETE** (remove), **HEAD** (headers only), **OPTIONS** (capabilities/CORS preflight)." },
          { icon: "🏷️", text: "Key headers: `Content-Type`, `Accept`, `Authorization`, `Cache-Control`, `Cookie`/`Set-Cookie`, `User-Agent`, `Host` (mandatory in 1.1)." },
        ],
      },
      {
        heading: "Status codes & statelessness",
        bullets: [
          { icon: "🔢", text: "**1xx** informational, **2xx** success (200 OK, 201 Created, 204 No Content), **3xx** redirect (301, 304 Not Modified), **4xx** client error (400, 401, 403, 404, 429), **5xx** server error (500, 502, 503)." },
          { icon: "🧠", text: "HTTP is **stateless** — each request is independent; state is carried explicitly via **cookies, tokens, or sessions**." },
          { icon: "🍪", text: "**Cookies** (`Set-Cookie` → sent back in `Cookie`) and **bearer tokens** (`Authorization: Bearer …`) reintroduce identity across requests." },
        ],
      },
      {
        heading: "HTTPS & the version ladder",
        bullets: [
          { icon: "🔒", text: "**HTTPS = HTTP over TLS**: encrypts data (confidentiality), detects tampering (integrity), and authenticates the server via an X.509 **certificate** (default port **443**)." },
          { icon: "⚡", text: "**HTTP/1.1**: text-based, keep-alive connections, but **head-of-line blocking** (one response at a time per connection). **HTTP/2**: binary framing, **multiplexing** many streams over one TCP connection, header compression (HPACK), server push." },
          { icon: "🚀", text: "**HTTP/3** runs over **QUIC (UDP)**: eliminates **TCP** head-of-line blocking, faster connection setup (0-RTT), and seamless connection migration." },
        ],
      },
    ],
    keyFacts: [
      { label: "Model", value: "Stateless request/response", icon: "📨" },
      { label: "HTTPS port / layer", value: "443 · HTTP over TLS", icon: "🔒" },
      { label: "Status classes", value: "1xx–5xx (2xx OK, 4xx client, 5xx server)", icon: "🔢" },
      { label: "HTTP/2 vs /3", value: "Multiplex over TCP vs QUIC/UDP", icon: "🚀" },
    ],
    quickReference: {
      title: "Quick cues",
      icon: "🎯",
      bullets: [
        "'Encrypt traffic + verify the server' → **HTTPS (TLS)** on port **443**.",
        "'Read data, no side effects' → **GET** (safe & idempotent).",
        "'404 vs 401 vs 403' → not found / not authenticated / authenticated-but-forbidden.",
        "'One connection, many parallel requests, no HoL blocking at HTTP layer' → **HTTP/2**.",
        "'Runs over UDP, removes TCP head-of-line blocking' → **HTTP/3 (QUIC)**.",
      ],
      analogyBrief:
        "HTTP is mailing a form: you send a filled-out request envelope, the office mails back a reply stamped with a result code. HTTPS is sealing that envelope in a tamper-evident, encrypted courier bag.",
    },
    explanation:
      "HTTP (HyperText Transfer Protocol) is the request/response protocol of the web. A client (browser, mobile app, or curl) opens a connection and sends a request consisting of a request line (method, path, and protocol version), a set of headers that are colon-separated key/value metadata, and an optional message body; the server answers with a status line containing the numeric status code, its own headers, and an optional body. The method expresses intent: GET reads a resource and is 'safe' (no side effects) and idempotent; POST submits data and typically creates a resource or triggers processing; PUT replaces a resource wholesale and is idempotent; PATCH applies a partial update; DELETE removes a resource; HEAD is like GET but returns only headers; and OPTIONS reports allowed operations and drives CORS preflight. Status codes are grouped by leading digit: 1xx informational, 2xx success (200 OK, 201 Created, 204 No Content), 3xx redirection (301 Moved Permanently, 302 Found, 304 Not Modified for cache validation), 4xx client errors (400 Bad Request, 401 Unauthorized meaning not authenticated, 403 Forbidden meaning authenticated but not allowed, 404 Not Found, 429 Too Many Requests), and 5xx server errors (500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable). A defining trait is that HTTP is stateless: the server does not inherently remember prior requests, so identity and session state are carried explicitly through cookies (Set-Cookie in the response, echoed in the Cookie request header), bearer tokens in the Authorization header, or server-side sessions. HTTPS is simply HTTP carried inside a TLS (Transport Layer Security) tunnel on port 443: TLS provides confidentiality (encryption), integrity (tamper detection), and authentication of the server through an X.509 certificate signed by a trusted Certificate Authority. The protocol has evolved to overcome performance limits. HTTP/1.1 is human-readable text and reuses connections via keep-alive, but each connection processes one response at a time, so a slow response blocks those queued behind it (head-of-line blocking), forcing browsers to open many parallel connections. HTTP/2 switches to a compact binary framing layer, multiplexes many independent streams over a single TCP connection, compresses headers with HPACK, and can proactively push resources — but because it still rides on TCP, a single lost packet stalls all multiplexed streams (TCP-level head-of-line blocking). HTTP/3 addresses this by running over QUIC, a transport built on UDP, which handles streams independently so a lost packet only stalls its own stream, sets up connections faster (often 0-RTT resumption), and lets a connection survive an IP change (connection migration), which is ideal for mobile networks.",
    analogy:
      "Think of HTTP as corresponding with a busy government office by mail. You fill out a specific form — the method says whether you want to read a record (GET), file a new one (POST), or replace an existing one (PUT) — attach cover-sheet metadata (headers), and mail the envelope. The office mails back a reply stamped with a three-digit result code that tells you at a glance whether it worked (2xx), where to go instead (3xx), that you made a mistake (4xx), or that the office itself broke down (5xx). The office has no memory of you between letters (stateless), so you must clip your membership card number to every envelope (cookies or tokens) for them to recognize you. HTTPS is paying for a sealed, tamper-evident courier bag with a verified return address: nobody can read or alter the contents in transit, and you can trust the office is genuine. HTTP/1.1 is a single mail slot that handles one letter at a time; HTTP/2 is a sorting machine that interleaves many letters down one pipe at once; and HTTP/3 replaces the fragile single pipe with independent tubes so one jammed tube no longer freezes all the others.",
    diagram: `<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="HTTP request and response with headers over TLS">${svgDefs}
      ${box(30, 120, 130, 60, "Client", "browser / app", "#8b949e")}
      ${box(560, 120, 130, 60, "Server", "port 443 (TLS)", "#0ea5e9")}
      <rect x="180" y="30" width="360" height="240" rx="10" fill="#0d1117" stroke="#22c55e" stroke-dasharray="5 4"/>
      <text x="360" y="52" text-anchor="middle" fill="#22c55e" font-size="11" font-weight="700">Encrypted TLS tunnel (HTTPS)</text>
      <rect x="200" y="66" width="320" height="80" rx="8" fill="#161b22" stroke="#0ea5e9"/>
      <text x="214" y="86" fill="#0ea5e9" font-size="11" font-weight="700">Request</text>
      <text x="214" y="104" fill="#e6edf3" font-size="10">GET /api/users/42  HTTP/2</text>
      <text x="214" y="120" fill="#8b949e" font-size="10">Host: api.example.com</text>
      <text x="214" y="135" fill="#8b949e" font-size="10">Authorization: Bearer … · Accept: application/json</text>
      <rect x="200" y="158" width="320" height="90" rx="8" fill="#161b22" stroke="#22c55e"/>
      <text x="214" y="178" fill="#22c55e" font-size="11" font-weight="700">Response</text>
      <text x="214" y="196" fill="#e6edf3" font-size="10">HTTP/2 200 OK</text>
      <text x="214" y="212" fill="#8b949e" font-size="10">Content-Type: application/json</text>
      <text x="214" y="227" fill="#8b949e" font-size="10">Cache-Control: max-age=60</text>
      <text x="214" y="242" fill="#8b949e" font-size="10">{ "id": 42, "name": "Ada" }</text>
      <line x1="160" y1="140" x2="198" y2="106" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="518" y1="203" x2="562" y2="150" stroke="#22c55e" stroke-width="2" marker-end="url(#arrow)"/>
    </svg>`,
    diagramLegend: [
      { color: "#0ea5e9", label: "Request", description: "Method + path + headers + optional body sent by the client." },
      { color: "#22c55e", label: "Response / TLS tunnel", description: "Status code + headers + body, all inside the encrypted HTTPS channel." },
      { color: "#8b949e", label: "Client", description: "Stateless caller; identity carried via tokens/cookies each request." },
    ],
    codeExample: {
      language: "bash",
      title: "Inspect an HTTPS request/response with curl",
      code: `# -v shows the TLS handshake, request headers (>) and response headers (<)
curl -v https://api.example.com/users/42 \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Accept: application/json"

# Send JSON with POST and print only the status code
curl -s -o /dev/null -w "%{http_code}\\n" \\
  -X POST https://api.example.com/users \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Ada"}'

# Force HTTP/2 (or --http3 for QUIC, if the build supports it)
curl -sI --http2 https://api.example.com/`,
    },
    codeExamples: [
      {
        language: "http",
        tab: "Raw exchange",
        title: "A raw HTTP request and response",
        code: `POST /api/users HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer eyJhbGciOi...
Accept: application/json
Content-Length: 27

{"name":"Ada","role":"dev"}

--- server responds ---

HTTP/1.1 201 Created
Location: /api/users/42
Content-Type: application/json
Cache-Control: no-store

{"id":42,"name":"Ada","role":"dev"}`,
      },
      {
        language: "bash",
        tab: "curl",
        title: "Common curl calls per method",
        code: `# GET (safe, idempotent)
curl https://api.example.com/users/42

# POST — create
curl -X POST https://api.example.com/users \\
  -H "Content-Type: application/json" -d '{"name":"Ada"}'

# PUT — full replace (idempotent)
curl -X PUT https://api.example.com/users/42 \\
  -H "Content-Type: application/json" -d '{"name":"Ada","role":"lead"}'

# PATCH — partial update
curl -X PATCH https://api.example.com/users/42 \\
  -H "Content-Type: application/json" -d '{"role":"lead"}'

# DELETE
curl -X DELETE https://api.example.com/users/42`,
      },
      {
        language: "javascript",
        tab: "fetch",
        title: "Reading status and headers with fetch()",
        code: `const res = await fetch("https://api.example.com/users/42", {
  method: "GET",
  headers: {
    Authorization: \`Bearer \${token}\`,
    Accept: "application/json",
  },
});

console.log(res.status);                 // 200
console.log(res.headers.get("content-type")); // "application/json"

if (res.status === 404) throw new Error("Not found");
if (!res.ok) throw new Error(\`HTTP \${res.status}\`); // res.ok is true for 2xx

const user = await res.json();
console.log(user);`,
      },
    ],
    problemStatement:
      "Your public API is served over plain HTTP/1.1 and users report three issues: (1) an eavesdropper on shared Wi‑Fi captured a login token, (2) pages with 30+ small assets load slowly because the browser opens and queues many connections, and (3) mobile users on flaky networks see all in-flight requests freeze whenever one packet drops. Explain what HTTPS fixes, why HTTP/2 helps the many-small-assets case, and why HTTP/3 specifically helps the mobile packet-loss case. Also state which status code the login endpoint should return when credentials are missing versus valid-but-unauthorized.",
    questions: [
      {
        q: "What does HTTPS add on top of HTTP?",
        options: [
          "A. Faster DNS resolution",
          "B. Encryption, integrity, and server authentication via TLS",
          "C. Automatic caching of all responses",
          "D. A guarantee of lower latency",
        ],
        answer: "B",
        explanation:
          "B is correct: HTTPS is HTTP inside a TLS tunnel, providing confidentiality (encryption), integrity (tamper detection), and authentication of the server via its certificate. It does not change DNS, force caching, or guarantee lower latency.",
      },
      {
        q: "Which HTTP method is considered SAFE (no side effects) and idempotent?",
        options: ["A. POST", "B. DELETE", "C. GET", "D. PATCH"],
        answer: "C",
        explanation:
          "C is correct: GET only reads a resource, so it is safe and idempotent. POST is neither safe nor idempotent; DELETE is idempotent but not safe; PATCH is generally neither.",
      },
      {
        q: "A user is logged in but tries to access an admin-only resource they are not permitted to use. What status code fits best?",
        options: [
          "A. 401 Unauthorized",
          "B. 403 Forbidden",
          "C. 404 Not Found",
          "D. 200 OK",
        ],
        answer: "B",
        explanation:
          "B is correct: 403 Forbidden means the request is authenticated but not allowed. 401 means not authenticated (missing/invalid credentials); 404 hides existence; 200 would incorrectly indicate success.",
      },
      {
        q: "What is the KEY improvement of HTTP/2 over HTTP/1.1?",
        options: [
          "A. It runs over UDP instead of TCP",
          "B. It multiplexes many streams over a single connection with binary framing, avoiding HTTP-layer head-of-line blocking",
          "C. It removes the need for TLS",
          "D. It makes all requests idempotent",
        ],
        answer: "B",
        explanation:
          "B is correct: HTTP/2 uses binary framing and multiplexes many concurrent streams over one TCP connection (plus header compression), removing the one-response-at-a-time limit of HTTP/1.1. It still runs over TCP; it does not remove TLS or change method semantics.",
      },
      {
        q: "Why does HTTP/3 help most on lossy mobile networks compared to HTTP/2?",
        options: [
          "A. It sends everything in plain text for speed",
          "B. It runs over QUIC (UDP), so a lost packet only stalls its own stream instead of all multiplexed streams",
          "C. It disables retransmission entirely",
          "D. It caps the number of requests per connection",
        ],
        answer: "B",
        explanation:
          "B is correct: HTTP/3 uses QUIC over UDP, which handles streams independently and eliminates the TCP-level head-of-line blocking that stalls all HTTP/2 streams on a single lost packet. It is still encrypted and reliable; it does not disable retransmission or cap requests.",
      },
      {
        q: "HTTP is described as 'stateless.' What does that mean in practice?",
        options: [
          "A. It cannot transfer any data",
          "B. Each request is independent; the server keeps no built-in memory of prior requests, so state is carried via cookies/tokens/sessions",
          "C. It never uses headers",
          "D. It only works for static files",
        ],
        answer: "B",
        explanation:
          "B is correct: statelessness means each request stands alone and the server does not inherently remember previous ones, so identity/session must be carried explicitly (cookies, bearer tokens, sessions). It still transfers data, uses headers, and serves dynamic content.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "net-rest-api",
    title: "REST & API Design — Resources, Verbs & Idempotency",
    shortLabel: "REST API Design",
    section: "Web Protocols",
    domain: "Networking",
    tldr:
      "REST models a system as resources identified by URLs, manipulated with HTTP verbs (GET/POST/PUT/PATCH/DELETE) that map to CRUD. Good APIs use nouns not verbs in paths, return meaningful status codes, are stateless, and design GET/PUT/DELETE to be idempotent. Robust APIs add versioning, pagination for large collections, filtering/sorting, and consistent error bodies.",
    subtopics: [
      {
        heading: "Resources & verbs (CRUD)",
        bullets: [
          { icon: "🧱", text: "Model **resources as nouns** in the URL: `/users`, `/users/42`, `/users/42/orders`. Avoid verbs in paths (`/getUser` is a smell)." },
          { icon: "🔁", text: "Map verbs to CRUD: **GET** = read, **POST** = create (in a collection), **PUT** = replace, **PATCH** = partial update, **DELETE** = remove." },
          { icon: "🧠", text: "**Stateless**: each request carries all it needs (auth token, params); no server-side session between calls — this is what lets APIs scale horizontally." },
        ],
      },
      {
        heading: "Idempotency & status codes",
        bullets: [
          { icon: "♻️", text: "**Idempotent** = same result no matter how many times you repeat it. **GET, PUT, DELETE** are idempotent; **POST is not** (repeating creates duplicates)." },
          { icon: "🔑", text: "Make POST safely retryable with an **Idempotency-Key** header so retries don't double-charge/double-create." },
          { icon: "🔢", text: "Return the right code: **201 Created** (+`Location`) on create, **200/204** on success, **400** bad input, **401/403** auth, **404** missing, **409** conflict, **422** validation, **429** rate limit." },
        ],
      },
      {
        heading: "Versioning, pagination & errors",
        bullets: [
          { icon: "🏷️", text: "**Versioning**: URL path (`/v1/users`), a header, or media type — pick one and keep breaking changes behind a new version." },
          { icon: "📄", text: "**Pagination** for large collections: **offset/limit** (`?page=2&limit=20`) or **cursor-based** (`?after=<token>`, stabler for changing data)." },
          { icon: "🧾", text: "Support **filtering/sorting** (`?status=active&sort=-createdAt`) and return a **consistent error shape** (`{ error, message, details }`)." },
        ],
      },
    ],
    keyFacts: [
      { label: "Resources", value: "Nouns in URLs, verbs via HTTP methods", icon: "🧱" },
      { label: "Idempotent verbs", value: "GET, PUT, DELETE (not POST)", icon: "♻️" },
      { label: "Create response", value: "201 Created + Location header", icon: "🔢" },
      { label: "Big lists", value: "Paginate (offset or cursor)", icon: "📄" },
    ],
    quickReference: {
      title: "Design cues",
      icon: "🎯",
      bullets: [
        "'Create a new item' → **POST /collection** → **201** + `Location`.",
        "'Replace vs partially update' → **PUT** (whole) vs **PATCH** (fields).",
        "'Safe to retry?' → GET/PUT/DELETE are **idempotent**; guard POST with an **Idempotency-Key**.",
        "'Huge list' → **paginate** (cursor beats offset for live data) + filter/sort params.",
        "'Breaking change' → new **version** (`/v2`), never mutate `/v1`.",
      ],
      analogyBrief:
        "A REST API is a well-run library: each book (resource) has a fixed shelf address (URL), and standard actions — borrow, return, replace, discard (the HTTP verbs) — mean the same thing everywhere.",
    },
    explanation:
      "REST (Representational State Transfer) is an architectural style for APIs that models a system as a set of resources, each identified by a URL, and manipulated with the standard HTTP verbs. The central design rule is to name resources as nouns in the path — /users, /users/42, /users/42/orders — and to express the action through the HTTP method rather than the URL, so /getUser or /deleteUser?id=42 are anti-patterns. The verbs map naturally onto CRUD: GET reads, POST creates a new member of a collection, PUT replaces a resource in full, PATCH applies a partial update, and DELETE removes it. REST APIs are stateless, meaning every request must carry everything the server needs to process it (authentication token, identifiers, parameters) and the server keeps no session memory between calls; this constraint is precisely what lets you scale by adding identical stateless servers behind a load balancer. A closely related property is idempotency: an operation is idempotent if performing it once or many times yields the same server state. GET (which changes nothing), PUT (which sets a resource to a specific representation), and DELETE (deleting an already-deleted thing is still 'gone') are idempotent, whereas POST is not — repeating a POST typically creates duplicate records, which is why resilient APIs accept an Idempotency-Key header so a client that retries after a network timeout does not double-create or double-charge. Status codes should be used precisely: 201 Created (with a Location header pointing at the new resource) for creation, 200 OK or 204 No Content for successful reads/updates/deletes, 400 for malformed input, 401 for missing/invalid authentication, 403 for authenticated-but-forbidden, 404 for a missing resource, 409 for a conflict (e.g., a duplicate), 422 for semantic validation failures, and 429 when the client is rate-limited. Production APIs also plan for change and scale. Versioning isolates breaking changes: you can put the version in the URL path (/v1/users), in a header, or in the media type, but whichever you choose you should never make a breaking change to an existing version. Large collections must be paginated so responses stay bounded, either with offset/limit (simple, but items can shift between pages when data changes) or cursor-based pagination (a stable opaque token, better for frequently changing data). Finally, well-designed APIs expose filtering and sorting through query parameters (?status=active&sort=-createdAt) and return a consistent, machine-readable error body so clients can handle failures uniformly.",
    analogy:
      "A REST API is a well-run public library. Every book is a resource with a fixed shelf address (its URL), and you never invent a new verb for each shelf — you use the library's standard actions: look at a book (GET), donate a new one to a section (POST), swap a worn copy for a fresh edition (PUT), fix a typo sticker on the spine (PATCH), or withdraw it from circulation (DELETE). The librarian has no memory of your last visit, so you show your library card every single time (stateless, token per request). Some actions are naturally repeat-safe: reading a book, or setting a shelf to hold exactly this edition, or removing an already-removed book, all leave the same end state (idempotent) — but dropping a brand-new donation in the return slot twice leaves two copies, which is why big donations get a tracking slip (an Idempotency-Key) so a re-submission is recognized as the same one. When the whole catalog system changes format, the library opens a new wing (/v2) rather than rearranging the old one and confusing everyone. And because you can't hand someone the entire building at once, you browse one shelf-page at a time (pagination) and can ask for just the mysteries sorted by newest (filtering and sorting).",
    diagram: `<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="REST resources mapped to HTTP verbs and CRUD">${svgDefs}
      ${box(30, 40, 150, 55, "GET /users", "read / list", "#22c55e")}
      ${box(30, 110, 150, 55, "POST /users", "create → 201", "#f59e0b")}
      ${box(30, 180, 150, 55, "PUT /users/42", "replace (idempotent)", "#3b82f6")}
      ${box(30, 250, 150, 40, "DELETE /users/42", "remove (idempotent)", "#f85149")}
      <rect x="300" y="60" width="180" height="190" rx="10" fill="#161b22" stroke="#0ea5e9"/>
      <text x="390" y="86" text-anchor="middle" fill="#0ea5e9" font-size="12" font-weight="700">Resource: /users</text>
      <text x="316" y="112" fill="#8b949e" font-size="10">Collection: /users</text>
      <text x="316" y="132" fill="#8b949e" font-size="10">Member: /users/42</text>
      <text x="316" y="152" fill="#8b949e" font-size="10">Sub-resource: /users/42/orders</text>
      <text x="316" y="178" fill="#8b949e" font-size="10">?page=2&amp;limit=20 (paginate)</text>
      <text x="316" y="198" fill="#8b949e" font-size="10">?status=active&amp;sort=-createdAt</text>
      <text x="316" y="224" fill="#e6edf3" font-size="10">Version: /v1/users</text>
      <line x1="180" y1="67" x2="298" y2="110" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
      <line x1="180" y1="137" x2="298" y2="130" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
      <line x1="180" y1="207" x2="298" y2="160" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
      <line x1="180" y1="270" x2="298" y2="200" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
      ${box(540, 110, 150, 90, "Idempotency-Key", "safe POST retries", "#8b5cf6")}
    </svg>`,
    diagramLegend: [
      { color: "#22c55e", label: "Safe / read", description: "GET reads without side effects; safe and idempotent." },
      { color: "#f59e0b", label: "Create (POST)", description: "Not idempotent; returns 201 + Location. Guard retries with an Idempotency-Key." },
      { color: "#3b82f6", label: "Idempotent writes", description: "PUT/DELETE reach the same end state no matter how often repeated." },
    ],
    codeExample: {
      language: "bash",
      title: "A RESTful CRUD lifecycle with curl",
      code: `# CREATE — POST to the collection, expect 201 + Location
curl -i -X POST https://api.example.com/v1/users \\
  -H "Content-Type: application/json" \\
  -H "Idempotency-Key: 7c3f-42ab" \\
  -d '{"name":"Ada"}'
# HTTP/1.1 201 Created
# Location: /v1/users/42

# READ a page of the collection (pagination + filter + sort)
curl "https://api.example.com/v1/users?status=active&sort=-createdAt&limit=20&after=eyJpZCI6NDJ9"

# REPLACE (PUT, idempotent) vs partial update (PATCH)
curl -X PUT   https://api.example.com/v1/users/42 -d '{"name":"Ada","role":"lead"}'
curl -X PATCH https://api.example.com/v1/users/42 -d '{"role":"lead"}'

# DELETE (idempotent) — 204 No Content
curl -i -X DELETE https://api.example.com/v1/users/42`,
    },
    codeExamples: [
      {
        language: "json",
        tab: "Paginated list",
        title: "Cursor-paginated collection response",
        code: `GET /v1/users?limit=2&after=eyJpZCI6NDB9

{
  "data": [
    { "id": 41, "name": "Grace", "status": "active" },
    { "id": 42, "name": "Ada",   "status": "active" }
  ],
  "pagination": {
    "limit": 2,
    "nextCursor": "eyJpZCI6NDJ9",
    "hasMore": true
  }
}`,
      },
      {
        language: "json",
        tab: "Error shape",
        title: "Consistent, machine-readable error body",
        code: `HTTP/1.1 422 Unprocessable Entity
Content-Type: application/json

{
  "error": "validation_failed",
  "message": "The request body failed validation.",
  "details": [
    { "field": "email", "issue": "must be a valid email address" },
    { "field": "age",   "issue": "must be >= 0" }
  ],
  "requestId": "req_01HZX…"
}`,
      },
      {
        language: "javascript",
        tab: "Express route",
        title: "Idempotent create with an Idempotency-Key",
        code: `const seen = new Map(); // key -> stored response (use Redis in production)

app.post("/v1/users", (req, res) => {
  const key = req.header("Idempotency-Key");

  // Replay a prior result instead of creating a duplicate
  if (key && seen.has(key)) {
    const prior = seen.get(key);
    return res.status(prior.status).json(prior.body);
  }

  const user = createUser(req.body); // { id, name, ... }
  const body = user;
  const status = 201;

  if (key) seen.set(key, { status, body });

  res
    .status(status)
    .location(\`/v1/users/\${user.id}\`) // 201 Created + Location
    .json(body);
});`,
      },
    ],
    problemStatement:
      "You are designing a payments API. A mobile client sometimes retries a 'create charge' request after a network timeout, occasionally charging customers twice. The endpoint is currently POST /createCharge?amount=... and returns 200 with no body. Separately, the /transactions endpoint returns all of a user's history in one response, which is now megabytes for heavy users. Redesign the resource naming, choose the correct verbs and status codes, make the create operation safely retryable, and fix the oversized list — and explain why each choice follows REST principles (statelessness, idempotency, pagination, versioning).",
    questions: [
      {
        q: "In REST, how should you name the endpoint to fetch a specific user?",
        options: [
          "A. GET /getUser?id=42",
          "B. GET /users/42",
          "C. POST /fetchUser with id in the body",
          "D. GET /user/get/42",
        ],
        answer: "B",
        explanation:
          "B is correct: resources are nouns and the verb is expressed by the HTTP method, so GET /users/42 reads user 42. Embedding a verb like getUser/fetchUser in the path is an anti-pattern.",
      },
      {
        q: "Which set of HTTP methods is idempotent?",
        options: [
          "A. GET, POST, PATCH",
          "B. POST, PUT, DELETE",
          "C. GET, PUT, DELETE",
          "D. POST only",
        ],
        answer: "C",
        explanation:
          "C is correct: GET, PUT, and DELETE reach the same server state no matter how many times they are repeated. POST is not idempotent — repeating it typically creates duplicates.",
      },
      {
        q: "What status code (and header) best represents a successful resource creation?",
        options: [
          "A. 200 OK with no extra header",
          "B. 201 Created with a Location header pointing to the new resource",
          "C. 204 No Content",
          "D. 302 Found",
        ],
        answer: "B",
        explanation:
          "B is correct: 201 Created signals a new resource was made and the Location header tells the client its URL. 200 is generic success, 204 means success with no body (often for DELETE/PUT), and 302 is a redirect.",
      },
      {
        q: "A client retries a POST after a timeout and risks creating duplicates. What is the standard fix?",
        options: [
          "A. Switch POST to GET",
          "B. Have the client send an Idempotency-Key so the server can de-duplicate retries",
          "C. Remove the response body",
          "D. Return 500 on every retry",
        ],
        answer: "B",
        explanation:
          "B is correct: an Idempotency-Key lets the server recognize a retried request and return the original result instead of creating a duplicate. Changing POST to GET breaks semantics; the others don't prevent duplicates.",
      },
      {
        q: "Why is cursor-based pagination often preferred over offset/limit for frequently changing data?",
        options: [
          "A. It returns the entire dataset faster",
          "B. It avoids skipped or duplicated items when rows are inserted/deleted between page requests",
          "C. It removes the need for a limit",
          "D. It only works with GET",
        ],
        answer: "B",
        explanation:
          "B is correct: a stable cursor anchors 'where you were,' so inserts/deletes between requests don't shift items across page boundaries the way an offset does. It still returns a bounded page and still uses a limit.",
      },
      {
        q: "You must introduce a breaking change to your API's response shape. What is the RESTful approach?",
        options: [
          "A. Mutate the existing /v1 responses in place",
          "B. Introduce a new version (e.g., /v2) and keep /v1 unchanged for existing clients",
          "C. Return the change only on Tuesdays",
          "D. Use a 500 error to signal the change",
        ],
        answer: "B",
        explanation:
          "B is correct: versioning isolates breaking changes so existing clients on /v1 keep working while new clients adopt /v2. Silently mutating /v1 breaks consumers; the other options are not real strategies.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "net-tcp-udp",
    title: "TCP/IP & UDP — The Stack, Handshake & Ports",
    shortLabel: "TCP/IP & UDP",
    section: "Web Protocols",
    domain: "Networking",
    tldr:
      "The TCP/IP model layers networking: Application (HTTP, DNS) → Transport (TCP/UDP) → Internet (IP) → Link. TCP is connection-oriented and reliable — it uses a 3-way handshake (SYN, SYN-ACK, ACK), sequence numbers, acknowledgements, retransmission, and ordering, at the cost of overhead and latency. UDP is connectionless and fast — no handshake, no ordering, no guaranteed delivery — ideal for real-time media, DNS, and gaming. Ports (0–65535) let one host multiplex many services.",
    subtopics: [
      {
        heading: "The TCP/IP stack",
        bullets: [
          { icon: "🍰", text: "Four layers: **Application** (HTTP, DNS, TLS), **Transport** (TCP/UDP), **Internet** (IP routing & addressing), **Link** (Ethernet/Wi‑Fi frames)." },
          { icon: "📦", text: "Each layer **wraps** the one above (encapsulation): IP carries a TCP/UDP **segment**, which carries the application data." },
          { icon: "📍", text: "**IP addresses** identify hosts; **ports** identify the service/process on that host; together an **IP:port** socket identifies an endpoint." },
        ],
      },
      {
        heading: "TCP: reliable & ordered",
        bullets: [
          { icon: "🤝", text: "**3-way handshake** to open a connection: client **SYN** → server **SYN-ACK** → client **ACK**, then data flows." },
          { icon: "✅", text: "Reliability via **sequence numbers, acknowledgements (ACKs), retransmission** of lost segments, and **in-order** delivery." },
          { icon: "🚦", text: "Adds **flow control** (receiver window) and **congestion control** — great for web, APIs, file transfer, email; costs setup latency + overhead." },
        ],
      },
      {
        heading: "UDP: fast & connectionless",
        bullets: [
          { icon: "⚡", text: "**No handshake, no ACKs, no ordering, no retransmission** — just fire datagrams; lower latency and overhead." },
          { icon: "🎮", text: "Ideal for **real-time**: live video/voice (VoIP), online games, DNS lookups, and **QUIC/HTTP‑3** (which rebuilds reliability in userspace)." },
          { icon: "⚖️", text: "Choose **TCP** when every byte must arrive in order; choose **UDP** when timeliness beats completeness (a dropped video frame is better than a stalled stream)." },
        ],
      },
    ],
    keyFacts: [
      { label: "Model layers", value: "App · Transport · Internet · Link", icon: "🍰" },
      { label: "TCP", value: "Connection-oriented, reliable, ordered", icon: "🤝" },
      { label: "UDP", value: "Connectionless, fast, best-effort", icon: "⚡" },
      { label: "Ports", value: "0–65535 (80 HTTP, 443 HTTPS, 53 DNS)", icon: "📍" },
    ],
    quickReference: {
      title: "TCP vs UDP cues",
      icon: "🎯",
      bullets: [
        "'Every byte must arrive, in order' → **TCP** (reliable, ordered).",
        "'Low latency, drop the occasional packet' → **UDP** (real-time media, gaming, DNS).",
        "'How a TCP connection opens' → **SYN → SYN-ACK → ACK** (3-way handshake).",
        "Well-known ports: **80** HTTP, **443** HTTPS, **53** DNS, **22** SSH, **25** SMTP.",
        "**HTTP/3 / QUIC** run over **UDP**, adding reliability themselves.",
      ],
      analogyBrief:
        "TCP is a registered phone call — you say hello, confirm you can hear each other, then talk with confirmations. UDP is shouting across a room — fast and no setup, but you might not be heard.",
    },
    explanation:
      "Networking is organized into layers, and the TCP/IP model (a practical four-layer view) is the one the internet runs on: the Application layer holds protocols like HTTP, DNS, and TLS; the Transport layer provides host-to-host delivery via TCP or UDP; the Internet layer uses IP to address and route packets across networks; and the Link layer moves frames over the physical medium (Ethernet, Wi‑Fi). Data is encapsulated as it descends the stack — application data is placed inside a TCP or UDP segment, that segment is placed inside an IP packet, and the packet is placed inside a link-layer frame — and de-encapsulated on the way up at the receiver. Addressing works at two levels: an IP address identifies a host on the network, while a port number identifies a specific service or process on that host, so the combination of IP address and port (a socket) uniquely identifies a communication endpoint and lets a single machine run many services at once; ports range from 0 to 65535, with well-known ports such as 80 (HTTP), 443 (HTTPS), 53 (DNS), 22 (SSH), and 25 (SMTP). TCP (Transmission Control Protocol) is connection-oriented and reliable. Before any data flows it performs a three-way handshake: the client sends a SYN (synchronize) segment, the server replies with SYN-ACK (acknowledging and synchronizing back), and the client sends a final ACK — after which the connection is established. TCP then guarantees delivery and order using sequence numbers to label bytes, acknowledgements so the sender knows what arrived, retransmission of segments that are lost or unacknowledged, and reassembly into the original order at the receiver; it also implements flow control (the receiver advertises a window so a fast sender doesn't overwhelm a slow receiver) and congestion control (backing off when the network is congested). These guarantees make TCP the right choice for web pages, APIs, file transfers, and email, but they cost extra round trips to set up and per-segment overhead. UDP (User Datagram Protocol) is connectionless and minimal: there is no handshake, no acknowledgements, no ordering, and no automatic retransmission — an application simply sends independent datagrams and accepts that some may be lost, duplicated, or arrive out of order. That leanness gives UDP very low latency and overhead, which is why it is used for real-time media like live video and VoIP, online gaming, DNS queries, and as the foundation of QUIC (and therefore HTTP/3), where the application rebuilds just the reliability features it needs in userspace. The practical decision rule: choose TCP when completeness and ordering matter more than latency, and choose UDP when timeliness matters more than perfect delivery — for a live call, a dropped frame that's simply skipped is far better than a stall while the network re-sends stale audio.",
    analogy:
      "Picture the two transport protocols as two ways of talking. TCP is a formal phone call: you dial, the other person picks up, you both say 'hello — can you hear me?' and confirm before the real conversation starts (that's the SYN, SYN-ACK, ACK handshake). Throughout the call you keep confirming — 'got that,' 'say again?' — so nothing is missed and everything is heard in order, but all that ceremony takes time. UDP is shouting a message across a crowded room: there's no dialing and no confirmation, so it's instant and effortless, but if someone doesn't catch a word, it's simply gone — you don't stop the whole room to repeat it. For a recorded lecture you'd want the phone call (every word, in order); for cheering during a live game, shouting is perfect, because a missed cheer isn't worth freezing the moment to replay. And just as one office building has one street address (the IP) but many numbered rooms (ports), one computer uses port numbers so many services can share a single address without their mail getting mixed up.",
    diagram: `<svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="TCP three-way handshake and the TCP/IP layer stack">${svgDefs}
      <text x="200" y="28" text-anchor="middle" fill="#e6edf3" font-size="13" font-weight="700">TCP 3-way handshake</text>
      ${box(40, 45, 120, 45, "Client", "", "#8b949e")}
      ${box(280, 45, 120, 45, "Server", "", "#0ea5e9")}
      <line x1="100" y1="90" x2="100" y2="250" stroke="#30363d" stroke-width="1.5"/>
      <line x1="340" y1="90" x2="340" y2="250" stroke="#30363d" stroke-width="1.5"/>
      <line x1="100" y1="115" x2="338" y2="140" stroke="#22c55e" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="150" y="112" fill="#22c55e" font-size="11" font-weight="700">1. SYN</text>
      <line x1="340" y1="165" x2="102" y2="190" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="150" y="168" fill="#f59e0b" font-size="11" font-weight="700">2. SYN-ACK</text>
      <line x1="100" y1="215" x2="338" y2="240" stroke="#3b82f6" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="150" y="212" fill="#3b82f6" font-size="11" font-weight="700">3. ACK</text>
      <text x="200" y="270" text-anchor="middle" fill="#8b949e" font-size="10">connection established → data flows</text>
      <rect x="450" y="45" width="240" height="245" rx="10" fill="#0d1117" stroke="#8b5cf6"/>
      <text x="570" y="70" text-anchor="middle" fill="#8b5cf6" font-size="12" font-weight="700">TCP/IP stack</text>
      ${box(470, 82, 200, 42, "Application", "HTTP · DNS · TLS", "#22c55e")}
      ${box(470, 132, 200, 42, "Transport", "TCP / UDP · ports", "#0ea5e9")}
      ${box(470, 182, 200, 42, "Internet", "IP addressing/routing", "#f59e0b")}
      ${box(470, 232, 200, 42, "Link", "Ethernet / Wi-Fi", "#8b949e")}
    </svg>`,
    diagramLegend: [
      { color: "#22c55e", label: "SYN / Application", description: "Client opens the connection; app-layer protocols ride on top." },
      { color: "#0ea5e9", label: "SYN-ACK / Transport", description: "Server acknowledges; TCP/UDP provide host-to-host delivery via ports." },
      { color: "#3b82f6", label: "ACK", description: "Final acknowledgement completes the handshake before data flows." },
    ],
    codeExample: {
      language: "bash",
      title: "Observe TCP/UDP, ports, and the handshake",
      code: `# See listening TCP/UDP sockets and their ports
ss -tulpn        # -t TCP  -u UDP  -l listening  -p process  -n numeric

# TCP connectivity test to a port (opens/closes a real connection)
nc -vz api.example.com 443

# A UDP service (DNS on port 53) — connectionless query
dig @8.8.8.8 example.com

# Watch the SYN / SYN-ACK / ACK handshake on the wire
sudo tcpdump -ni any 'tcp port 443 and (tcp[tcpflags] & (tcp-syn|tcp-ack) != 0)'`,
    },
    codeExamples: [
      {
        language: "bash",
        tab: "Ports & sockets",
        title: "Inspecting ports and connections",
        code: `# Well-known ports: 80 HTTP, 443 HTTPS, 53 DNS, 22 SSH, 25 SMTP
ss -tulpn                 # listening TCP + UDP sockets with ports

# Test a TCP port is reachable (three-way handshake succeeds)
nc -vz example.com 443
# Connection to example.com 443 port [tcp/https] succeeded!

# Test a UDP port (no handshake; may need app-level reply to confirm)
nc -vzu 8.8.8.8 53`,
      },
      {
        language: "python",
        tab: "TCP socket",
        title: "TCP: connection-oriented, reliable, ordered",
        code: `import socket

# SOCK_STREAM = TCP. connect() performs the 3-way handshake.
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.connect(("example.com", 80))        # SYN -> SYN-ACK -> ACK
    s.sendall(b"GET / HTTP/1.1\\r\\nHost: example.com\\r\\nConnection: close\\r\\n\\r\\n")
    data = b""
    while True:
        chunk = s.recv(4096)              # bytes arrive in order, reliably
        if not chunk:
            break
        data += chunk
    print(data.decode(errors="replace")[:120])`,
      },
      {
        language: "python",
        tab: "UDP socket",
        title: "UDP: connectionless, fast, best-effort",
        code: `import socket

# SOCK_DGRAM = UDP. No connect handshake; just send datagrams.
with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
    s.settimeout(2.0)                     # you must handle loss yourself
    s.sendto(b"ping", ("192.0.2.10", 9999))
    try:
        data, addr = s.recvfrom(1024)     # may never arrive (no retransmit)
        print("got", data, "from", addr)
    except socket.timeout:
        print("no reply — UDP does not guarantee delivery")`,
      },
    ],
    problemStatement:
      "You are architecting two features. Feature A is a banking file-transfer that must deliver every byte of a statement intact and in order. Feature B is a live multiplayer game that sends 60 position updates per second where a slightly stale update is worthless and re-sending it would only add lag. For each feature choose TCP or UDP and justify it in terms of the handshake, ordering, retransmission, and latency. Then explain how a single game server can accept both the game's UDP traffic and an HTTPS control API on the same IP address at once.",
    questions: [
      {
        q: "Which protocol is connection-oriented and guarantees reliable, in-order delivery?",
        options: ["A. UDP", "B. TCP", "C. IP", "D. DNS"],
        answer: "B",
        explanation:
          "B is correct: TCP is connection-oriented and provides reliable, ordered delivery via sequence numbers, ACKs, and retransmission. UDP is connectionless/best-effort, IP handles routing/addressing, and DNS is an application-layer service.",
      },
      {
        q: "What is the correct sequence of the TCP three-way handshake?",
        options: [
          "A. ACK → SYN → SYN-ACK",
          "B. SYN → SYN-ACK → ACK",
          "C. SYN → ACK → FIN",
          "D. PING → PONG → DATA",
        ],
        answer: "B",
        explanation:
          "B is correct: the client sends SYN, the server replies SYN-ACK, and the client sends ACK, establishing the connection before data flows. The other orders are not how TCP opens a connection.",
      },
      {
        q: "For a live voice call where low latency matters more than delivering every packet, which transport protocol fits best?",
        options: [
          "A. TCP, because it retransmits lost packets",
          "B. UDP, because it avoids handshake/retransmission overhead and tolerates occasional loss",
          "C. IP directly, with no transport protocol",
          "D. SMTP",
        ],
        answer: "B",
        explanation:
          "B is correct: UDP's lack of handshake, ordering, and retransmission gives the low latency real-time media needs; a dropped audio packet is simply skipped rather than causing a stall. TCP's retransmission would add delay; SMTP is for email.",
      },
      {
        q: "What is the purpose of a port number?",
        options: [
          "A. To identify the physical network cable",
          "B. To identify a specific service/process on a host so one IP can run many services",
          "C. To encrypt the connection",
          "D. To replace the IP address",
        ],
        answer: "B",
        explanation:
          "B is correct: a port (0–65535) identifies a particular service or process on a host, so the IP:port socket uniquely names an endpoint and one machine can serve many applications. It doesn't identify cables, encrypt traffic, or replace the IP.",
      },
      {
        q: "In the four-layer TCP/IP model, which layer does IP addressing and routing belong to?",
        options: [
          "A. Application layer",
          "B. Transport layer",
          "C. Internet layer",
          "D. Link layer",
        ],
        answer: "C",
        explanation:
          "C is correct: the Internet layer (IP) handles addressing and routing of packets across networks. The Application layer holds HTTP/DNS, the Transport layer holds TCP/UDP, and the Link layer moves frames over the medium.",
      },
      {
        q: "HTTP/3 (QUIC) is notable because it runs over which transport protocol, contrary to earlier HTTP versions?",
        options: [
          "A. TCP",
          "B. UDP (rebuilding reliability itself)",
          "C. ICMP",
          "D. SMTP",
        ],
        answer: "B",
        explanation:
          "B is correct: HTTP/3 runs over QUIC, which is built on UDP and re-implements reliability, ordering, and congestion control in userspace to avoid TCP-level head-of-line blocking. HTTP/1.1 and HTTP/2 use TCP; ICMP and SMTP are unrelated to this transport role.",
      },
    ],
  },
];
