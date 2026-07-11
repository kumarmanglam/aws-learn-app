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
// SECTION: System Design — Data & Storage
// Databases (SQL vs NoSQL), Replication & Sharding, and the
// CAP / PACELC theorems. Authored to the messaging.ts /
// frontend-core.ts bar for the System Design course.
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

export const systemDesignDataTopics: Topic[] = [
  // -----------------------------------------------------------------
  {
    id: "sd-sql-vs-nosql",
    title: "SQL vs NoSQL — Relational, Document, Key-Value, Column & Graph",
    shortLabel: "SQL vs NoSQL",
    section: "Data & Storage",
    domain: "SystemDesign",
    tldr:
      "SQL (relational) databases use a fixed schema of tables with rows and columns, enforce relationships with foreign keys, speak SQL, and give strong ACID transactions — great for complex queries, joins, and correctness. NoSQL is an umbrella for document, key-value, wide-column, and graph stores that trade rigid schemas and multi-row transactions for flexible data models, horizontal scale, and high write throughput, typically offering BASE / eventual consistency. Choose SQL when relationships and transactional integrity dominate; choose a NoSQL family that matches your dominant access pattern when scale, flexibility, or a specialized shape (graph, time-series, huge fan-out) matters.",
    subtopics: [
      {
        heading: "Relational (SQL) databases",
        bullets: [
          { icon: "🗄️", text: "Data lives in **tables** (rows + typed columns) with a **predefined schema**; relationships are modeled with **primary/foreign keys** and enforced by the engine." },
          { icon: "🧮", text: "**Normalization** removes duplication; **JOINs** recombine data at query time. Rich, declarative **SQL** handles complex ad-hoc queries and aggregations." },
          { icon: "🔒", text: "Strong **ACID** transactions (Atomicity, Consistency, Isolation, Durability) make multi-row updates safe — the default choice when correctness matters (money, inventory, orders)." },
        ],
      },
      {
        heading: "The NoSQL families",
        bullets: [
          { icon: "📄", text: "**Document** (MongoDB, DynamoDB, Couchbase): JSON-like documents, flexible schema, data pre-joined into one document to match a read." },
          { icon: "🔑", text: "**Key-Value** (Redis, DynamoDB, Riak): a giant hash map — O(1) get/put by key, ideal for caches, sessions, and feature flags." },
          { icon: "🧱", text: "**Wide-Column** (Cassandra, HBase, Bigtable): rows keyed by a partition key with sparse, dynamic columns — massive write throughput and time-series." },
          { icon: "🕸️", text: "**Graph** (Neo4j, Neptune): nodes + edges; traversals (friends-of-friends, fraud rings, recommendations) that would be expensive multi-JOINs in SQL." },
        ],
      },
      {
        heading: "How to choose",
        bullets: [
          { icon: "⚖️", text: "**ACID vs BASE**: SQL favors immediate consistency; most NoSQL favors **Basically Available, Soft-state, Eventual consistency** for availability and scale." },
          { icon: "📐", text: "**Schema-on-write (SQL)** validates data up front; **schema-on-read (NoSQL)** is flexible but pushes validation into the app." },
          { icon: "📈", text: "SQL scales primarily **vertically** (bigger box) plus read replicas; NoSQL is built to scale **horizontally** by sharding across commodity nodes." },
          { icon: "🎯", text: "Rule of thumb: **model NoSQL around your queries** (denormalize for the read you do most); **model SQL around your data** (normalize, then query flexibly)." },
        ],
      },
    ],
    keyFacts: [
      { label: "SQL model", value: "Tables + fixed schema", icon: "🗄️" },
      { label: "NoSQL families", value: "Doc / KV / Column / Graph", icon: "🧩" },
      { label: "Consistency", value: "ACID (SQL) vs BASE (NoSQL)", icon: "⚖️" },
      { label: "Scaling", value: "Vertical vs Horizontal", icon: "📈" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'Complex relationships, JOINs, transactions, correctness' → **relational SQL**.",
        "'Flexible/evolving schema, huge scale, one dominant access pattern' → **NoSQL**.",
        "'Cache / session / O(1) lookup by key' → **key-value**.",
        "'Massive writes / time-series / append-heavy' → **wide-column** (Cassandra).",
        "'Relationships ARE the query (social graph, fraud)' → **graph DB**.",
        "Design SQL around the data; design NoSQL around the query.",
      ],
      analogyBrief:
        "SQL is a spreadsheet with strict columns and validated cross-references; NoSQL is a filing system where each folder (document) already holds everything you need for one task, so you never have to cross-reference at read time.",
    },
    explanation:
      "SQL (relational) and NoSQL are two broad approaches to persisting data, and the choice is one of the most common system-design questions. Relational databases (PostgreSQL, MySQL, Oracle, SQL Server) store data in tables of rows and typed columns under a predefined schema, model relationships with primary and foreign keys, and expose the declarative SQL language for powerful ad-hoc queries, joins, and aggregations. Their defining strength is ACID transactions — Atomicity (all or nothing), Consistency (constraints always hold), Isolation (concurrent transactions don't corrupt each other), and Durability (committed data survives crashes) — which makes them the safe default whenever correctness of related updates matters, such as money transfers, inventory, or order processing. They typically enforce schema-on-write, normalize data to avoid duplication, and scale primarily by moving to a bigger machine (vertical scaling) supplemented by read replicas; scaling writes horizontally requires manual sharding. NoSQL is not one thing but an umbrella of four main families. Document stores (MongoDB, DynamoDB, Couchbase) keep JSON-like documents with flexible schemas and let you pre-join related data into a single document so a read needs no joins. Key-value stores (Redis, DynamoDB, Riak) behave like a distributed hash map with O(1) get/put by key, ideal for caches, sessions, and configuration. Wide-column stores (Cassandra, HBase, Bigtable) organize rows by a partition key with sparse, dynamic columns and excel at very high write throughput and time-series data. Graph databases (Neo4j, Amazon Neptune) store nodes and edges and make relationship traversals — friends-of-friends, recommendation paths, fraud rings — cheap where the equivalent SQL would need many expensive joins. Most NoSQL systems favor BASE semantics (Basically Available, Soft state, Eventual consistency) and are designed to scale horizontally across commodity nodes, trading rigid schemas and general multi-row transactions for flexibility, availability, and scale. The practical guidance is to model a NoSQL schema around your dominant access pattern (denormalize so the most frequent read hits one place), and to model a relational schema around the data itself (normalize, then rely on SQL's flexibility to query it any way later). In real systems the answer is often polyglot persistence — a relational database of record alongside a Redis cache and a search or graph engine — each store used where it fits best.",
    analogy:
      "Think of two ways to run a busy office. A relational database is a strict accounting ledger: every entry goes in a labeled column, cross-references between ledgers are checked before ink dries, and you can never leave a transaction half-recorded — perfect for money, painful if you suddenly need a new kind of column. NoSQL is a room of task folders: for a document store, each customer's folder already contains their profile, orders, and notes stapled together, so answering 'show me this customer' means grabbing one folder with no cross-referencing. A key-value store is the coat-check: hand over a ticket (key), instantly get the coat (value). A wide-column store is a warehouse of append-only logbooks optimized for scribbling millions of new lines fast. A graph store is a detective's corkboard of pinned photos and strings, built to trace 'who knows whom' in a few hops. You pick the room that matches the job.",
    diagram: `<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="SQL relational tables versus the four NoSQL families">${svgDefs}
      <text x="20" y="24" fill="#0ea5e9" font-size="13" font-weight="700">SQL — normalized, related tables</text>
      ${box(20, 40, 130, 55, "users", "id · name · email", "#0ea5e9")}
      ${box(200, 40, 130, 55, "orders", "id · user_id · total", "#0ea5e9")}
      <line x1="150" y1="67" x2="198" y2="67" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="150" y="60" fill="#8b949e" font-size="9">FK JOIN</text>
      <text x="20" y="135" fill="#22c55e" font-size="13" font-weight="700">NoSQL — pick the model for the query</text>
      ${box(20, 150, 150, 60, "Document", "one JSON per read", "#22c55e")}
      ${box(200, 150, 150, 60, "Key-Value", "O(1) get/put by key", "#f59e0b")}
      ${box(380, 150, 150, 60, "Wide-Column", "sparse cols · big writes", "#8b5cf6")}
      ${box(560, 150, 140, 60, "Graph", "nodes + edges", "#e11d8f")}
      <rect x="380" y="40" width="320" height="60" rx="8" fill="#1a2332" stroke="#8b949e" stroke-dasharray="5 4"/>
      <text x="540" y="65" text-anchor="middle" fill="#e6edf3" font-size="11" font-weight="600">ACID (SQL) vs BASE (NoSQL)</text>
      <text x="540" y="84" text-anchor="middle" fill="#8b949e" font-size="10">strong consistency  vs  eventual + horizontal scale</text>
      <text x="20" y="245" fill="#8b949e" font-size="10">SQL: schema-on-write, normalize, scale up + replicas.</text>
      <text x="20" y="263" fill="#8b949e" font-size="10">NoSQL: schema-on-read, denormalize, scale out by sharding.</text>
    </svg>`,
    diagramLegend: [
      { color: "#0ea5e9", label: "Relational tables", description: "Fixed schema joined by foreign keys; ACID transactions." },
      { color: "#22c55e", label: "Document / NoSQL", description: "Flexible, denormalized model built around the dominant query." },
      { color: "#8b5cf6", label: "Wide-column / Graph", description: "Specialized stores for huge writes or relationship traversals." },
    ],
    codeExample: {
      language: "sql",
      title: "Relational: normalized tables + a JOIN with a transaction",
      code: `-- Normalized schema: relationship via a foreign key
CREATE TABLE users (
  id    BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL
);
CREATE TABLE orders (
  id      BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  total   NUMERIC(10,2) NOT NULL
);

-- Query flexibly with a JOIN
SELECT u.email, SUM(o.total) AS lifetime_value
FROM users u
JOIN orders o ON o.user_id = u.id
GROUP BY u.email;

-- ACID: both writes commit together, or neither does
BEGIN;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;`,
    },
    codeExamples: [
      {
        language: "sql",
        title: "SQL — normalized + JOIN + ACID transaction",
        tab: "SQL (relational)",
        code: `SELECT u.email, SUM(o.total) AS lifetime_value
FROM users u
JOIN orders o ON o.user_id = u.id
GROUP BY u.email;

BEGIN;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;  -- atomic: both or neither`,
      },
      {
        language: "javascript",
        title: "Document — denormalized, no JOIN needed",
        tab: "Document (Mongo)",
        code: `// One document already holds everything a read needs
db.users.insertOne({
  _id: "u_42",
  email: "sam@example.com",
  orders: [                       // pre-joined for the read pattern
    { id: "o_1", total: 19.99, items: ["book"] },
    { id: "o_2", total:  4.50, items: ["pen"]  }
  ]
});

// Fetch the whole customer view in a single lookup
db.users.findOne({ _id: "u_42" });`,
      },
      {
        language: "python",
        title: "Key-Value — O(1) cache / session store",
        tab: "Key-Value (Redis)",
        code: `import redis
r = redis.Redis()

# Store a session, expire it in 30 minutes
r.set("session:abc123", '{"user":42,"role":"admin"}', ex=1800)

# O(1) lookup by key — no query planner, no joins
raw = r.get("session:abc123")
print(raw)  # b'{"user":42,"role":"admin"}'`,
      },
    ],
    problemStatement:
      "You are designing the data layer for an e-commerce platform. It needs (1) a system of record for orders and payments where a charge and an inventory decrement must never be applied half-way, (2) a fast store for user session tokens, and (3) a 'customers who bought this also bought' recommendation feature over a large social/purchase graph. Explain which database model fits each requirement, why a single relational database or a single NoSQL store is a poor fit for all three, and what 'design around the query' means for the recommendation store.",
    questions: [
      {
        q: "Which database property guarantees that a multi-step money transfer either fully completes or fully rolls back?",
        options: [
          "A. Horizontal scalability",
          "B. ACID transactions (atomicity in particular)",
          "C. Eventual consistency",
          "D. Schema-on-read",
        ],
        answer: "B",
        explanation:
          "B is correct: ACID's Atomicity means the transaction is all-or-nothing, so a debit and credit commit together or not at all. Horizontal scaling, eventual consistency, and schema-on-read do not provide that guarantee.",
      },
      {
        q: "Which NoSQL family is the best fit for storing and retrieving session tokens by a session ID?",
        options: [
          "A. Graph database",
          "B. Wide-column database",
          "C. Key-value store",
          "D. Relational database",
        ],
        answer: "C",
        explanation:
          "C is correct: a key-value store gives O(1) get/put by key and easy TTL/expiry, ideal for sessions and caches. A graph is for relationships, wide-column for huge writes, and relational is heavier than needed for a simple keyed lookup.",
      },
      {
        q: "A social feature must efficiently answer 'friends of friends who bought item X'. Which store is designed for this?",
        options: [
          "A. Key-value store",
          "B. Graph database",
          "C. Document store",
          "D. A single denormalized SQL table",
        ],
        answer: "B",
        explanation:
          "B is correct: graph databases store nodes and edges and traverse relationships cheaply in a few hops. The equivalent in SQL is many expensive self-joins; key-value and single-table designs can't traverse arbitrary relationships well.",
      },
      {
        q: "In NoSQL data modeling, what does 'design around the query' typically mean?",
        options: [
          "A. Normalize aggressively and rely on joins",
          "B. Denormalize so the most frequent read is satisfied from one place",
          "C. Always enforce foreign-key constraints",
          "D. Store every entity in its own separate table",
        ],
        answer: "B",
        explanation:
          "B is correct: NoSQL modeling shapes the data to the dominant access pattern, often duplicating/denormalizing so a common read hits a single document or partition. Normalization and foreign keys are relational concepts.",
      },
      {
        q: "Which statement about BASE (typical of many NoSQL systems) is accurate?",
        options: [
          "A. It guarantees immediate strong consistency after every write",
          "B. It stands for Basically Available, Soft state, Eventual consistency",
          "C. It forbids horizontal scaling",
          "D. It is a stricter version of ACID",
        ],
        answer: "B",
        explanation:
          "B is correct: BASE = Basically Available, Soft state, Eventual consistency — it prioritizes availability and scale, accepting that replicas converge over time rather than instantly. It is a relaxation of, not stricter than, ACID.",
      },
      {
        q: "An analytics workload ingests millions of time-stamped sensor readings per second with append-heavy writes. Which model is the strongest fit?",
        options: [
          "A. Graph database",
          "B. Single-node relational database with foreign keys",
          "C. Wide-column store (e.g., Cassandra)",
          "D. Small key-value cache",
        ],
        answer: "C",
        explanation:
          "C is correct: wide-column stores like Cassandra are built for very high write throughput and time-series/partitioned data. A graph fits relationships, a single-node relational DB won't sustain that write rate, and a cache isn't durable primary storage.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "sd-replication-sharding",
    title: "Replication & Sharding — Scaling Reads, Writes & Data Size",
    shortLabel: "Replication & Sharding",
    section: "Data & Storage",
    domain: "SystemDesign",
    tldr:
      "Replication copies the same data to multiple nodes for availability, read scaling, and fault tolerance — most commonly leader-follower (one node takes writes, followers serve reads). Replication can be synchronous (safe, slower, no data loss) or asynchronous (fast, but a leader crash can lose recent writes and readers may see stale data). Sharding (partitioning) splits one large dataset across nodes so each holds a subset, scaling writes and storage; the partition strategy (hash, range, or directory) determines balance, and poor keys create hotspots. Growing or rebalancing a cluster requires moving partitions, which consistent hashing minimizes.",
    subtopics: [
      {
        heading: "Replication basics",
        bullets: [
          { icon: "📚", text: "**Replication** keeps copies of the same data on several nodes → higher **availability**, **read scaling**, and survival of node/disk failure." },
          { icon: "👑", text: "**Leader-follower** (primary-replica): the **leader** accepts writes and streams a change log to **followers**, which serve reads. Only one writer avoids write conflicts." },
          { icon: "🗳️", text: "If the leader dies, a **failover / leader election** promotes a follower. Multi-leader and leaderless (quorum) setups exist but must resolve write conflicts." },
        ],
      },
      {
        heading: "Synchronous vs asynchronous",
        bullets: [
          { icon: "🐢", text: "**Synchronous**: the write isn't acknowledged until a replica confirms → **no data loss** on leader failure, but higher latency and blocked writes if a replica is slow." },
          { icon: "🐇", text: "**Asynchronous**: leader acks immediately and ships changes later → **fast**, but a crash can lose the not-yet-replicated writes and readers hit **replication lag** (stale reads)." },
          { icon: "🔁", text: "Common middle ground: **semi-synchronous** — at least one replica confirms synchronously, the rest catch up async." },
        ],
      },
      {
        heading: "Sharding & partition strategy",
        bullets: [
          { icon: "✂️", text: "**Sharding / partitioning** splits the dataset by a **partition key** so each node owns a subset → scales **writes** and **storage** beyond one machine." },
          { icon: "🎲", text: "**Hash partitioning** spreads keys evenly (good balance, no range scans); **range partitioning** keeps order (good scans, but sequential keys create **hotspots**)." },
          { icon: "🔥", text: "A **hotspot** is one shard getting a disproportionate share of traffic (e.g., a celebrity user, monotonically increasing IDs, or timestamps). Fix with better keys / salting." },
          { icon: "⚖️", text: "**Rebalancing** moves partitions when adding/removing nodes; **consistent hashing** minimizes how much data moves versus naive `hash % N`." },
        ],
      },
    ],
    keyFacts: [
      { label: "Replication", value: "Copies for HA + read scale", icon: "📚" },
      { label: "Topology", value: "Leader-follower (single writer)", icon: "👑" },
      { label: "Sync vs async", value: "No loss vs low latency", icon: "🐢" },
      { label: "Sharding", value: "Split data → scale writes", icon: "✂️" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'Scale reads / add availability' → **replication** (leader-follower read replicas).",
        "'Scale writes / dataset too big for one node' → **sharding**.",
        "'Can't lose any committed write on failover' → **synchronous** replication.",
        "'Reads sometimes show old data' → **async replication lag** (read-your-writes needs the leader).",
        "'One shard is overloaded' → **hotspot**; rethink the **partition key** or add salting.",
        "'Minimize data movement when scaling the cluster' → **consistent hashing**.",
      ],
      analogyBrief:
        "Replication is photocopying the same textbook so more students can read at once and none is lost if one copy burns; sharding is splitting one giant encyclopedia into A-F, G-M, N-Z volumes so each shelf holds part of it.",
    },
    explanation:
      "Replication and sharding are the two fundamental techniques for scaling a database beyond a single machine, and they solve different problems. Replication keeps multiple copies of the same data on different nodes. Its benefits are higher availability (if one node fails another still has the data), read scaling (many followers can serve read queries in parallel), and fault tolerance (a disk or datacenter loss doesn't lose data). The most common topology is leader-follower (also called primary-replica or master-slave): a single leader accepts all writes and streams its change log to one or more followers, which apply those changes and serve read traffic. Having a single writer sidesteps write-write conflicts; if the leader fails, a failover process (often via leader election) promotes a follower to become the new leader. Multi-leader and leaderless (quorum-based, as in Dynamo-style systems) topologies allow writes on more than one node but must detect and resolve conflicting concurrent writes. A key decision is synchronous versus asynchronous replication. With synchronous replication the leader does not acknowledge a write to the client until at least one follower has confirmed it, which guarantees no committed write is lost if the leader then crashes — but it adds latency and can block writes entirely if a replica is slow or down. With asynchronous replication the leader acknowledges immediately and ships changes to followers afterward, which is fast and keeps writes available, but a leader crash can lose the writes that hadn't replicated yet, and followers exhibit replication lag so readers may see stale data. A frequent compromise is semi-synchronous replication, where one replica confirms synchronously and the rest catch up asynchronously. Sharding (partitioning) is different: instead of copying the whole dataset, it splits the dataset into partitions and distributes them across nodes so each node stores only a subset. This is how you scale write throughput and total storage past what one machine can hold. The partitioning strategy matters: hash partitioning applies a hash to the partition key to spread rows evenly across shards (great load balance, but no efficient range scans), while range partitioning assigns contiguous key ranges to shards (efficient range scans and ordering, but monotonically increasing keys — like sequential IDs or timestamps — funnel all recent writes to one shard, creating a hotspot). A hotspot is any shard receiving a disproportionate share of load, such as a celebrity account in a social app; mitigations include choosing a higher-cardinality key, adding a random or hashed prefix (salting), or splitting the hot key. Finally, clusters grow and shrink, so partitions must be rebalanced across nodes; naive modulo assignment (hash % N) reshuffles almost all keys whenever N changes, whereas consistent hashing places nodes and keys on a ring so that adding or removing a node moves only a small fraction of the data. Real systems combine both techniques — each shard is itself replicated — to get horizontal write scale and high availability at the same time.",
    analogy:
      "Imagine a university library. Replication is making several photocopies of the same popular textbook and putting them on different shelves and even in different buildings: many students can read at once (read scaling), and if one building floods you haven't lost the book (availability). One librarian is in charge of updating the 'master' copy and pushing edits to the others so they stay in sync — if that librarian is out sick, another is promoted (failover). If they mail edits overnight instead of instantly, some copies are briefly out of date (async replication lag). Sharding is different: instead of copying one book, you take a giant 26-volume encyclopedia and put A-F on one shelf, G-M on the next, and N-Z on a third, so each shelf holds only part of the collection and three students can look things up simultaneously without crowding one shelf. But if everyone happens to want 'Z' topics this week, that shelf gets swamped (a hotspot). And when you add a new shelf, you want to shuffle as few volumes as possible (consistent hashing) rather than re-sorting the entire library.",
    diagram: `<svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Leader-follower replication and hash-based sharding">${svgDefs}
      <text x="20" y="24" fill="#0ea5e9" font-size="13" font-weight="700">Replication — leader → followers</text>
      ${box(40, 45, 140, 55, "Leader", "accepts writes", "#e11d8f")}
      ${box(20, 140, 130, 50, "Follower", "serves reads", "#22c55e")}
      ${box(180, 140, 130, 50, "Follower", "serves reads", "#22c55e")}
      <line x1="90" y1="100" x2="80" y2="138" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="130" y1="100" x2="230" y2="138" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="120" y="122" fill="#8b949e" font-size="9">replicate log</text>
      ${box(40, 210, 140, 40, "Writes →", "leader only", "#8b949e")}
      <line x1="110" y1="210" x2="110" y2="102" stroke="#8b5cf6" stroke-width="2" marker-end="url(#arrow-mute)"/>
      <text x="400" y="24" fill="#8b5cf6" font-size="13" font-weight="700">Sharding — data split by key</text>
      ${box(400, 45, 130, 45, "Router", "hash(key) % N", "#f59e0b")}
      ${box(380, 140, 100, 50, "Shard A", "keys h→0", "#8b5cf6")}
      ${box(500, 140, 100, 50, "Shard B", "keys h→1", "#8b5cf6")}
      ${box(620, 140, 90, 50, "Shard C", "keys h→2", "#8b5cf6")}
      <line x1="450" y1="90" x2="430" y2="138" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
      <line x1="465" y1="90" x2="550" y2="138" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
      <line x1="480" y1="90" x2="660" y2="138" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
      <rect x="500" y="210" width="210" height="55" rx="8" fill="#1a2332" stroke="#f85149" stroke-dasharray="5 4"/>
      <text x="605" y="233" text-anchor="middle" fill="#f85149" font-size="11" font-weight="600">Hotspot risk</text>
      <text x="605" y="251" text-anchor="middle" fill="#8b949e" font-size="9">sequential keys crowd one shard</text>
      <text x="20" y="300" fill="#8b949e" font-size="10">In production each shard is ALSO replicated → write scale + high availability together.</text>
    </svg>`,
    diagramLegend: [
      { color: "#e11d8f", label: "Leader", description: "Single writer; streams a change log to followers." },
      { color: "#22c55e", label: "Followers", description: "Read replicas; may lag under async replication." },
      { color: "#8b5cf6", label: "Shards", description: "Disjoint partitions of the data, scaling writes and storage." },
    ],
    codeExample: {
      language: "python",
      title: "Consistent hashing — route keys to shards, add a node with minimal movement",
      code: `import hashlib, bisect

class HashRing:
    def __init__(self, nodes, replicas=100):
        self.replicas = replicas          # virtual nodes for even spread
        self.ring = {}                     # hash -> node
        self.sorted = []
        for n in nodes:
            self.add(n)

    def _h(self, key):
        return int(hashlib.md5(key.encode()).hexdigest(), 16)

    def add(self, node):
        for i in range(self.replicas):
            h = self._h(f"{node}:{i}")
            self.ring[h] = node
            bisect.insort(self.sorted, h)

    def get(self, key):
        if not self.ring:
            return None
        h = self._h(key)
        i = bisect.bisect(self.sorted, h) % len(self.sorted)
        return self.ring[self.sorted[i]]

ring = HashRing(["shard-a", "shard-b", "shard-c"])
print(ring.get("user:42"))   # deterministic shard for this key
ring.add("shard-d")          # only ~1/N of keys remap, not all of them`,
    },
    codeExamples: [
      {
        language: "python",
        title: "Consistent hashing ring (minimal rebalancing)",
        tab: "Consistent hashing",
        code: `import hashlib, bisect

class HashRing:
    def __init__(self, nodes, replicas=100):
        self.replicas, self.ring, self.sorted = replicas, {}, []
        for n in nodes: self.add(n)
    def _h(self, k): return int(hashlib.md5(k.encode()).hexdigest(), 16)
    def add(self, node):
        for i in range(self.replicas):
            h = self._h(f"{node}:{i}"); self.ring[h] = node
            bisect.insort(self.sorted, h)
    def get(self, key):
        h = self._h(key)
        i = bisect.bisect(self.sorted, h) % len(self.sorted)
        return self.ring[self.sorted[i]]

ring = HashRing(["a", "b", "c"])
ring.add("d")   # only ~1/N keys move, unlike hash % N`,
      },
      {
        language: "sql",
        title: "Read scaling — write to leader, read from replica",
        tab: "Read replicas",
        code: `-- Writes MUST go to the leader (single writer)
--   host = db-primary.internal
INSERT INTO orders (user_id, total) VALUES (42, 19.99);

-- Reads can be routed to a follower to offload the leader
--   host = db-replica-1.internal   (may lag a few ms behind)
SELECT * FROM orders WHERE user_id = 42;

-- Read-your-writes: after a write you just made, read from the
-- LEADER (or wait for the replica to catch up) to avoid stale data.`,
      },
      {
        language: "yaml",
        title: "Range vs hash partitioning (and the hotspot trap)",
        tab: "Partition strategy",
        code: `# RANGE partitioning: efficient range scans, but...
partitions:
  - shard-a: { key_range: "2024-01-01 .. 2024-06-30" }
  - shard-b: { key_range: "2024-07-01 .. 2024-12-31" }  # <- ALL new
                                                          #    writes land here
                                                          #    => hotspot

# HASH partitioning: even spread, no ordered scans
strategy: hash
partition_key: user_id      # high-cardinality key avoids hotspots
# Tip: salt a hot key, e.g. "celebrity#{0..9}", to fan writes out.`,
      },
    ],
    problemStatement:
      "A photo-sharing app started on a single PostgreSQL instance. Reads have overwhelmed the box, and the total dataset no longer fits on one disk. The team also worries that a crash must never lose a committed 'like' or comment, yet the timeline occasionally shows a user their own new post as missing for a second. Explain which technique (replication vs sharding) solves the read-overload problem versus the too-big-for-one-node problem, what causes the momentarily-missing post, how sync vs async replication trades data-loss risk against latency, and why choosing a poor partition key (e.g., an auto-incrementing post ID) could overload a single shard.",
    questions: [
      {
        q: "Your database is overwhelmed by READ traffic but the dataset fits on one machine. What is the most direct fix?",
        options: [
          "A. Shard the data across multiple nodes",
          "B. Add read replicas (replication) and route reads to them",
          "C. Switch from ACID to BASE",
          "D. Increase the visibility timeout",
        ],
        answer: "B",
        explanation:
          "B is correct: replication with read replicas lets followers serve reads in parallel, offloading the leader. Sharding is for scaling writes/storage, not primarily reads; changing consistency model or a queue setting doesn't address read load.",
      },
      {
        q: "In a leader-follower setup, where must all WRITES be sent?",
        options: [
          "A. Any node, chosen randomly",
          "B. Only the leader (primary)",
          "C. Only the followers",
          "D. A dedicated cache",
        ],
        answer: "B",
        explanation:
          "B is correct: a single leader accepts all writes and streams changes to followers, which avoids write-write conflicts. Followers are read-only replicas; sending writes to them or to a cache is not how leader-follower replication works.",
      },
      {
        q: "A user creates a post but for a moment sees it missing from their own feed. What is the most likely cause?",
        options: [
          "A. The database ran out of storage",
          "B. Asynchronous replication lag — the read hit a follower that hadn't received the write yet",
          "C. A hash collision in the primary key",
          "D. The transaction was not committed",
        ],
        answer: "B",
        explanation:
          "B is correct: with async replication, a follower can be briefly behind the leader (replication lag), so a read routed to it misses the just-written post. Read-your-writes consistency (read from the leader) avoids it. It is not a storage or key-collision issue if the write did commit.",
      },
      {
        q: "Which is the key trade-off between synchronous and asynchronous replication?",
        options: [
          "A. Sync is always cheaper; async is always more durable",
          "B. Sync avoids data loss on leader failure but adds write latency; async is fast but can lose recent writes",
          "C. Async guarantees zero replication lag",
          "D. Sync eliminates the need for a leader",
        ],
        answer: "B",
        explanation:
          "B is correct: synchronous replication waits for a replica to confirm (no committed write lost, higher latency), while asynchronous acks immediately (low latency, but a crash can lose not-yet-replicated writes and readers see lag). Async does not eliminate lag, and sync still needs a leader.",
      },
      {
        q: "You shard by an auto-incrementing post ID using range partitioning. Why might one shard become a hotspot?",
        options: [
          "A. Hashing distributes IDs unevenly by design",
          "B. All newly created posts have the largest IDs, so every recent write lands on the last shard",
          "C. Range partitioning cannot store sequential data",
          "D. Followers stop replicating sequential keys",
        ],
        answer: "B",
        explanation:
          "B is correct: with a monotonically increasing key and range partitioning, the newest IDs all fall into the highest range, funneling all current write traffic to a single shard. A higher-cardinality/hashed key (or salting) spreads writes; the other options are not accurate.",
      },
      {
        q: "When adding a node to a sharded cluster, why is consistent hashing preferred over `hash(key) % N`?",
        options: [
          "A. It guarantees ACID transactions across shards",
          "B. It moves only a small fraction of keys, whereas `% N` remaps almost all keys when N changes",
          "C. It removes the need for replication",
          "D. It makes all reads strongly consistent",
        ],
        answer: "B",
        explanation:
          "B is correct: consistent hashing places nodes/keys on a ring so adding or removing a node relocates only about 1/N of keys, while modulo-N reassigns nearly everything when N changes. It doesn't provide cross-shard ACID, replace replication, or change consistency guarantees.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "sd-cap-theorem",
    title: "CAP & PACELC — Consistency, Availability & Partition Tradeoffs",
    shortLabel: "CAP & PACELC",
    section: "Data & Storage",
    domain: "SystemDesign",
    tldr:
      "The CAP theorem says that when a network partition (P) splits a distributed system, you can keep either Consistency (C — every read sees the latest write) or Availability (A — every request gets a non-error response), but not both. Because partitions are unavoidable in real networks, the real choice is CP vs AP during a partition. PACELC extends this: Else (when there's no partition) you still trade Latency vs Consistency. Between the extremes lie a spectrum of consistency models — strong, linearizable, sequential, causal, and eventual — that let you tune correctness against latency and availability.",
    subtopics: [
      {
        heading: "The CAP theorem",
        bullets: [
          { icon: "🔺", text: "Three properties: **Consistency** (every read returns the most recent write), **Availability** (every request gets a non-error response), **Partition tolerance** (the system keeps working despite dropped/delayed messages)." },
          { icon: "⚡", text: "The theorem: during a **network partition** you can guarantee **C or A, but not both**. You cannot 'pick 2 of 3' at leisure — **P is mandatory** in any real distributed system." },
          { icon: "🧭", text: "So the practical decision is **CP vs AP**: when nodes can't talk, do you **reject requests to stay correct** (CP) or **answer with possibly-stale data to stay up** (AP)?" },
        ],
      },
      {
        heading: "CP vs AP in practice",
        bullets: [
          { icon: "🏦", text: "**CP** (consistency-first): refuse or block during a partition rather than serve wrong data — banking ledgers, config stores, leader-based systems (e.g., etcd/ZooKeeper, HBase, single-leader RDBMS)." },
          { icon: "🛒", text: "**AP** (availability-first): keep accepting reads/writes and reconcile later — shopping carts, DNS, Cassandra/DynamoDB (tunable), Riak; users prefer 'up but slightly stale' over 'down'." },
          { icon: "🕒", text: "The choice is often **per-operation**: the same store can serve a critical write with strong consistency and a feed read with eventual consistency." },
        ],
      },
      {
        heading: "PACELC & consistency models",
        bullets: [
          { icon: "➕", text: "**PACELC**: if **P**artition → choose **A** or **C**; **E**lse (normal operation) → choose **L**atency or **C**onsistency. Even with no partition, stronger consistency costs latency." },
          { icon: "📶", text: "**Consistency spectrum**: **strong / linearizable** (reads see the latest write, as if one copy) → **sequential** → **causal** (cause-before-effect preserved) → **eventual** (replicas converge given no new writes)." },
          { icon: "🎚️", text: "Quorum systems tune it: if **R + W > N** you get strong consistency; smaller R/W favors latency and availability. This is how DynamoDB/Cassandra expose the knob." },
        ],
      },
    ],
    keyFacts: [
      { label: "CAP", value: "During partition: C or A", icon: "🔺" },
      { label: "P is", value: "Mandatory (real networks)", icon: "⚡" },
      { label: "PACELC else", value: "Latency vs Consistency", icon: "➕" },
      { label: "Models", value: "Strong → causal → eventual", icon: "📶" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'Pick 2 of C, A, P' → subtly wrong: **P is unavoidable**, so it's really **CP vs AP** under partition.",
        "'Must never serve stale/incorrect data, ok to reject' → **CP** (banking, config, coordination).",
        "'Must always respond, stale is acceptable' → **AP** (carts, DNS, feeds).",
        "'Even without partitions there's a tradeoff' → **PACELC** (Latency vs Consistency).",
        "'Tune consistency with a knob' → **quorum R + W > N** = strong reads.",
        "Consistency models: **linearizable > sequential > causal > eventual**.",
      ],
      analogyBrief:
        "CAP is two clerks in offices whose phone line drops: they either stop serving until the line is back (consistent but unavailable) or keep serving from memory and reconcile later (available but possibly stale).",
    },
    explanation:
      "The CAP theorem, formulated by Eric Brewer, is about the guarantees a distributed data store can make. It names three properties. Consistency (in the CAP sense) means every read returns the most recent successful write or an error — all nodes appear to agree on the latest value. Availability means every request received by a non-failing node returns a non-error response, though not necessarily the most recent data. Partition tolerance means the system continues to operate despite the network dropping or delaying arbitrary messages between nodes. The theorem states that when a network partition occurs, a system must sacrifice either consistency or availability — it cannot guarantee both. A crucial and often-misunderstood point is that this is not a leisurely 'pick 2 of 3': in any real distributed system spanning a network, partitions will happen, so partition tolerance is mandatory. That reduces the genuine design decision to CP versus AP during a partition. A CP (consistency-favoring) system, when it can't reach enough nodes to be sure it has the latest data, chooses to reject or block requests rather than return possibly-stale or conflicting results — appropriate for banking ledgers, configuration and coordination services (etcd, ZooKeeper, Consul), and single-leader relational databases. An AP (availability-favoring) system keeps accepting reads and writes on both sides of the partition and reconciles the divergence afterward — appropriate for shopping carts, DNS, and Dynamo-style stores like Cassandra and DynamoDB, where users strongly prefer a system that stays up with slightly stale data over one that returns errors. In practice the choice is frequently made per operation: the same platform can require strong consistency for a payment and accept eventual consistency for a social feed. PACELC, proposed by Daniel Abadi, extends CAP to describe behavior when there is no partition: if there is a Partition, you trade Availability against Consistency (the CAP case); Else, in normal operation, you still trade Latency against Consistency — because keeping replicas strongly consistent requires coordination that adds latency, so even a healthy system pays for stronger guarantees. Between the extremes lies a spectrum of consistency models. Strong/linearizable consistency makes the system behave as if there were a single copy and reads always see the latest write in real-time order. Sequential consistency preserves a single global order of operations but not necessarily real-time ordering. Causal consistency guarantees that operations that are causally related (a reply after a message) are seen in the right order, while unrelated operations may be seen in different orders on different nodes. Eventual consistency, the weakest common model, only promises that if no new writes occur, all replicas will eventually converge to the same value. Quorum-based systems make this tunable: with N replicas, if the read quorum R plus the write quorum W exceeds N (R + W > N), a read is guaranteed to overlap the latest write and you get strong consistency; choosing smaller R and W favors lower latency and higher availability at the cost of possibly-stale reads. Understanding CAP and PACELC lets you reason precisely about why a design is 'up but stale' or 'correct but sometimes unavailable', instead of treating consistency as free.",
    analogy:
      "Picture a company with two branch offices that must agree on the same customer balance, connected by a single phone line. Normally, before either clerk changes a balance they call the other to confirm, so both books always match (consistency) — but that call adds delay to every change (this is the PACELC 'Else: latency vs consistency' cost even on a good day). Now the phone line goes dead (a network partition). The clerks face an unavoidable choice. Option one: refuse to touch the books until the line is restored, so they never disagree — the office is correct but temporarily closed for changes (CP: consistency over availability). Option two: keep serving customers from each branch's own copy and promise to reconcile the two ledgers once the line is back — the office stays open but the two copies may briefly disagree (AP: availability over consistency). There is no third option that keeps the line dead, stays open, AND stays perfectly in sync — that's CAP. A bank picks option one for balances; an online store picks option two for shopping carts, because a customer who can't add an item is worse than one whose cart merges oddly for a moment.",
    diagram: `<svg viewBox="0 0 720 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="CAP triangle and PACELC decision">${svgDefs}
      <text x="20" y="24" fill="#0ea5e9" font-size="13" font-weight="700">CAP — during a partition, pick C or A</text>
      <polygon points="200,50 60,250 340,250" fill="#1a2332" stroke="#8b949e" stroke-width="1.5"/>
      ${box(150, 40, 100, 34, "C", "Consistency", "#e11d8f")}
      ${box(10, 235, 110, 34, "A", "Availability", "#22c55e")}
      ${box(280, 235, 110, 34, "P", "Partition tol.", "#f59e0b")}
      <text x="200" y="165" text-anchor="middle" fill="#f85149" font-size="11" font-weight="700">P is mandatory</text>
      <text x="200" y="184" text-anchor="middle" fill="#8b949e" font-size="9">so real choice = CP vs AP</text>
      <text x="420" y="24" fill="#8b5cf6" font-size="13" font-weight="700">PACELC decision</text>
      ${box(430, 45, 260, 40, "Is there a Partition?", "", "#8b5cf6")}
      ${box(430, 120, 120, 44, "Yes → A or C", "CAP tradeoff", "#f59e0b")}
      ${box(570, 120, 120, 44, "Else → L or C", "latency vs cons.", "#0ea5e9")}
      <line x1="500" y1="85" x2="480" y2="118" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
      <line x1="620" y1="85" x2="630" y2="118" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
      <text x="430" y="210" fill="#22c55e" font-size="12" font-weight="700">Consistency spectrum</text>
      ${box(430, 225, 260, 40, "Strong → Sequential → Causal → Eventual", "quorum R+W>N = strong", "#22c55e")}
      <text x="20" y="305" fill="#8b949e" font-size="10">CP: refuse/block to stay correct (banking, etcd).  AP: answer stale to stay up (carts, DNS, Cassandra).</text>
      <text x="20" y="323" fill="#8b949e" font-size="10">Choice is often per-operation: strong for payments, eventual for feeds.</text>
    </svg>`,
    diagramLegend: [
      { color: "#e11d8f", label: "Consistency (CP)", description: "Reject/block during a partition to avoid stale or conflicting data." },
      { color: "#22c55e", label: "Availability (AP)", description: "Keep responding with possibly-stale data; reconcile later." },
      { color: "#0ea5e9", label: "PACELC Else", description: "With no partition, still trade latency against consistency." },
    ],
    codeExample: {
      language: "python",
      title: "Quorum reads/writes: R + W > N gives strong consistency",
      code: `N = 3          # replicas per key
W = 2          # write acks required
R = 2          # read responses required

# R + W > N  ->  2 + 2 = 4 > 3  ->  a read quorum overlaps the
# latest write quorum, so reads are strongly consistent (CP-leaning).
strong = (R + W > N)
print("strong consistency:", strong)   # True

# Favor availability/latency instead (AP-leaning): W=1, R=1
#   fast, always writable, but reads may be stale until convergence.
W2, R2 = 1, 1
print("strong consistency:", (R2 + W2 > N))  # False -> eventual`,
    },
    codeExamples: [
      {
        language: "python",
        title: "Quorum knob — tune C vs A/latency",
        tab: "Quorum (R+W>N)",
        code: `N = 3
# Strong / CP-leaning: R + W > N
W, R = 2, 2
assert R + W > N            # reads overlap latest write

# Available / AP-leaning: minimize quorum
W, R = 1, 1
assert not (R + W > N)      # low latency, possibly stale (eventual)`,
      },
      {
        language: "javascript",
        title: "DynamoDB — per-operation consistency choice",
        tab: "AP store (DynamoDB)",
        code: `// Default: eventually consistent read (cheaper, faster, AP-leaning)
await ddb.getItem({ TableName: "carts", Key: k }).promise();

// Opt into a strongly consistent read for a critical path
await ddb.getItem({
  TableName: "carts",
  Key: k,
  ConsistentRead: true      // reads the latest committed write
}).promise();
// Same store, chosen PER OPERATION: eventual for browsing,
// strong for checkout.`,
      },
      {
        language: "yaml",
        title: "Classifying systems by CAP/PACELC",
        tab: "System cheat-sheet",
        code: `# CP-leaning (consistency first; refuse/block on partition)
cp_systems:
  - etcd / ZooKeeper / Consul   # coordination, leader election
  - HBase / MongoDB (default)   # single-writer / primary
  - single-leader RDBMS

# AP-leaning (availability first; reconcile later)
ap_systems:
  - Cassandra                   # PACELC: PA/EL (tunable)
  - DynamoDB                    # eventual by default, strong opt-in
  - Riak / DNS / shopping carts

# PACELC labels: e.g. Cassandra = PA/EL, single-leader RDBMS = PC/EC`,
      },
    ],
    problemStatement:
      "You are the architect for a global service with two subsystems: a payments ledger that must never show or accept an incorrect balance, and a product-catalog/shopping-cart experience that must stay responsive worldwide even when a transatlantic link degrades. During a network partition between regions, explain what CAP forces you to give up for each subsystem, why 'partition tolerance is optional' is a misconception, how PACELC still applies when the network is healthy, and how a quorum setting (R and W relative to N) or a per-operation consistency flag lets one datastore serve both needs.",
    questions: [
      {
        q: "According to the CAP theorem, during a network partition a distributed system must sacrifice which of the following?",
        options: [
          "A. Either consistency or availability",
          "B. Either durability or atomicity",
          "C. Either latency or throughput",
          "D. Nothing — it can keep all three",
        ],
        answer: "A",
        explanation:
          "A is correct: CAP says that under a partition you can guarantee consistency or availability but not both. Durability/atomicity are ACID terms, latency/throughput are performance metrics, and you cannot keep all three during a partition.",
      },
      {
        q: "Why is the common phrasing 'pick 2 of C, A, and P' considered misleading?",
        options: [
          "A. Because availability is always impossible",
          "B. Because partition tolerance is mandatory in any real network, so the real choice is CP vs AP",
          "C. Because consistency and availability are the same thing",
          "D. Because CAP only applies to single-node databases",
        ],
        answer: "B",
        explanation:
          "B is correct: real networks partition, so P cannot be given up; the genuine decision is what to do during a partition — favor consistency (CP) or availability (AP). The other statements misstate the theorem.",
      },
      {
        q: "A banking ledger refuses writes when it cannot reach a quorum, rather than risk an incorrect balance. This system is:",
        options: [
          "A. AP (availability over consistency)",
          "B. CP (consistency over availability)",
          "C. Neither C nor P",
          "D. Eventually consistent by design",
        ],
        answer: "B",
        explanation:
          "B is correct: choosing to reject/block to avoid stale or conflicting data during a partition is the CP choice. An AP system would keep serving (possibly stale) instead of refusing.",
      },
      {
        q: "What does the 'ELC' part of PACELC describe?",
        options: [
          "A. During a partition, choose availability or consistency",
          "B. When there is no partition (Else), choose between Latency and Consistency",
          "C. The number of replicas needed for a quorum",
          "D. A logging format for consistency errors",
        ],
        answer: "B",
        explanation:
          "B is correct: PACELC adds that Else (no partition), you still trade Latency vs Consistency, because stronger consistency needs coordination that adds latency. The 'PA/PC' part covers the partition case.",
      },
      {
        q: "With N=3 replicas, which quorum setting guarantees a strongly consistent read?",
        options: [
          "A. R=1, W=1",
          "B. R=2, W=2 (so that R + W > N)",
          "C. R=1, W=2 where R + W = N",
          "D. Any setting, since quorum size does not matter",
        ],
        answer: "B",
        explanation:
          "B is correct: strong consistency requires R + W > N so the read quorum overlaps the latest write quorum; with N=3, R=2 and W=2 gives 4 > 3. R=1,W=1 (or R+W=N) can miss the latest write, yielding eventual consistency.",
      },
      {
        q: "Which ordering lists consistency models from STRONGEST to WEAKEST?",
        options: [
          "A. Eventual → Causal → Sequential → Linearizable",
          "B. Linearizable → Sequential → Causal → Eventual",
          "C. Causal → Eventual → Linearizable → Sequential",
          "D. Sequential → Eventual → Linearizable → Causal",
        ],
        answer: "B",
        explanation:
          "B is correct: linearizable (strong) is the strongest, then sequential, then causal (preserves cause-before-effect), and eventual is the weakest (replicas merely converge over time). The other orderings are incorrect.",
      },
    ],
  },
];
