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
// SECTION: Integration & Messaging — SQS, SNS & Kinesis
// Course slides ~p368–end.
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

export const messagingTopics: Topic[] = [
  // -----------------------------------------------------------------
  {
    id: "amazon-sqs",
    title: "Amazon SQS — Standard Queues",
    shortLabel: "Amazon SQS",
    section: "Integration & Messaging — SQS, SNS & Kinesis",
    domain: "Integration",
    tldr:
      "SQS decouples producers and consumers with an async queue: unlimited throughput, messages up to 256KB, retention 4–14 days, at-least-once delivery, best-effort ordering. Consumers poll (use long polling), process, then delete. Visibility timeout (default 30s) hides in-flight messages; scale consumers with an ASG on queue depth.",
    subtopics: [
      {
        heading: "What SQS is",
        bullets: [
          { icon: "📨", text: "Fully-managed queue to **decouple** applications; producers **SendMessage**, consumers **poll** & **DeleteMessage**." },
          { icon: "♾️", text: "**Standard**: unlimited throughput, **at-least-once** delivery, **best-effort ordering**; message up to **256 KB** (1024 KB in slides = 1 MB max via extended)." },
          { icon: "🗓️", text: "Retention default **4 days**, max **14 days**; low latency (<10 ms)." },
        ],
      },
      {
        heading: "Visibility timeout & polling",
        bullets: [
          { icon: "👁️", text: "After a poll, a message is **invisible** for the **visibility timeout** (default **30s**). Not deleted in time → it reappears (possible double-processing). Extend with **ChangeMessageVisibility**." },
          { icon: "⏳", text: "**Long Polling** (1–20s) waits for messages → fewer empty responses, lower cost & latency vs short polling." },
        ],
      },
      {
        heading: "Scaling & patterns",
        bullets: [
          { icon: "📈", text: "Scale consumers with an **ASG** driven by the **ApproximateNumberOfMessages** CloudWatch metric." },
          { icon: "🧱", text: "Use SQS as a **buffer** in front of a database, or to **decouple** front-end and processing tiers." },
          { icon: "🔐", text: "Security: HTTPS in-flight, KMS at-rest, IAM + **SQS access policies** (cross-account, let S3/SNS write)." },
        ],
      },
    ],
    keyFacts: [
      { label: "Throughput (standard)", value: "Unlimited", icon: "♾️" },
      { label: "Delivery / ordering", value: "At-least-once / best-effort", icon: "📨" },
      { label: "Visibility timeout", value: "Default 30s (1s–12h)", icon: "👁️" },
      { label: "Retention", value: "4 days (max 14)", icon: "🗓️" },
    ],
    quickReference: {
      title: "Exam cues",
      icon: "🎯",
      bullets: [
        "'Decouple tiers / buffer spikes / absorb load' → **SQS**.",
        "'Messages processed twice' → **visibility timeout** too short (or consumer slow).",
        "'Reduce empty polls / cost' → **long polling** (WaitTimeSeconds up to 20).",
        "'Scale workers to backlog' → **ASG on ApproximateNumberOfMessages**.",
        "Standard = at-least-once + best-effort order (need order/no-dupes → FIFO).",
      ],
      analogyBrief:
        "SQS is a deli ticket line: customers (producers) drop orders, cooks (consumers) grab tickets one at a time — if a cook wanders off without finishing, the ticket pops back for someone else.",
    },
    explanation:
      "Amazon SQS is AWS's oldest, fully-managed message queue, used to decouple applications so a spike on the producer side doesn't overwhelm consumers. Producers send messages via the SendMessage API and the message is persisted until a consumer deletes it. A Standard queue offers unlimited throughput and an unlimited number of in-flight messages, default retention of 4 days (max 14), low latency, at-least-once delivery (occasional duplicates), and best-effort ordering. Consumers (on EC2, servers, or Lambda) poll for up to 10 messages at a time, process them, and then call DeleteMessage. When a message is received it becomes invisible to other consumers for the visibility timeout (default 30 seconds, range 1 second to 12 hours); if it isn't deleted before the timeout expires it becomes visible again and may be processed twice, so a consumer that needs more time calls ChangeMessageVisibility. Long polling (a WaitTimeSeconds of 1–20 seconds) makes a receive request wait for messages to arrive, reducing empty responses, cost, and latency compared with short polling. You scale consumers by putting them in an Auto Scaling Group driven by the ApproximateNumberOfMessages CloudWatch metric, and you commonly use SQS as a buffer in front of a database or to decouple a front-end web tier from a back-end processing tier. Security includes HTTPS in transit, KMS encryption at rest, IAM policies, and SQS access policies (for cross-account access or to let services like S3 and SNS write to the queue).",
    analogy:
      "SQS is the ticket line at a busy deli. Customers (producers) take a number and drop their order in the queue, then leave — they don't wait for the cook. Cooks (consumers) pull the next ticket, and while they're working on it that ticket is hidden from other cooks (the visibility timeout). If a cook wanders off and never marks the order done, the ticket reappears so someone else can pick it up (at-least-once). Add more cooks when the line grows (ASG on queue depth) and they never lose an order even during a lunch rush.",
    diagram: `<svg viewBox="0 0 720 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="SQS decoupling and scaling">${svgDefs}
      ${box(20, 80, 110, 50, "Producers", "SendMessage", "#8b949e")}
      ${box(180, 75, 130, 60, "SQS Queue", "persisted", "#e11d8f")}
      <line x1="130" y1="105" x2="178" y2="105" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <rect x="380" y="30" width="300" height="160" rx="10" fill="#1a2332" stroke="#ff9900" stroke-dasharray="5 4"/>
      <text x="395" y="52" fill="#ff9900" font-size="11" font-weight="700">ASG (scales on queue depth)</text>
      ${box(395, 65, 120, 45, "Consumer", "poll+delete", "#22c55e")}
      ${box(535, 65, 120, 45, "Consumer", "poll+delete", "#22c55e")}
      ${box(395, 125, 120, 45, "Consumer", "+new", "#3b82f6")}
      ${box(535, 125, 120, 45, "Consumer", "+new", "#3b82f6")}
      <line x1="310" y1="105" x2="378" y2="105" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="330" y="98" fill="#8b949e" font-size="9">poll</text>
    </svg>`,
    diagramLegend: [
      { color: "#e11d8f", label: "SQS queue", description: "Buffers messages; decouples producer from consumers." },
      { color: "#22c55e", label: "Consumers", description: "Poll, process, then DeleteMessage." },
      { color: "#3b82f6", label: "Scaled consumers", description: "ASG adds workers on ApproximateNumberOfMessages." },
    ],
    codeExample: {
      language: "bash",
      title: "Send, long-poll receive, then delete",
      code: `aws sqs send-message --queue-url $Q --message-body '{"orderId":123}'

# Long polling: wait up to 20s for messages (fewer empty reads)
aws sqs receive-message --queue-url $Q \\
  --max-number-of-messages 10 --wait-time-seconds 20

aws sqs delete-message --queue-url $Q --receipt-handle "$RECEIPT"`,
    },
    problemStatement:
      "A video site normally transcodes 10 clips at a time, but a viral event suddenly submits 5,000. Directly calling the transcoder overwhelms it and requests are lost. Also, some clips get transcoded twice. Explain how SQS decouples upload from processing and lets workers scale to the backlog, and what setting causes (and prevents) the double-processing.",
    questions: [
      {
        q: "What is the PRIMARY purpose of Amazon SQS?",
        options: [
          "A. Cache database reads",
          "B. Decouple applications with an asynchronous message queue",
          "C. Serve static websites",
          "D. Provide DNS resolution",
        ],
        answer: "B",
        explanation:
          "B is correct: SQS decouples producers from consumers via a durable queue, absorbing spikes. Caching is ElastiCache, static sites are S3, DNS is Route 53.",
      },
      {
        q: "A message is being processed twice by different consumers. What is the MOST likely cause?",
        options: [
          "A. Long polling is enabled",
          "B. The visibility timeout is too short (or the consumer is slower than it)",
          "C. The queue is a FIFO queue",
          "D. Encryption is disabled",
        ],
        answer: "B",
        explanation:
          "B is correct: if a consumer doesn't delete the message before the visibility timeout expires, it reappears and can be processed again. Increase the timeout or call ChangeMessageVisibility. Long polling/FIFO/encryption don't cause this.",
      },
      {
        q: "Which approach reduces the number of empty receive responses and lowers cost/latency?",
        options: ["A. Short polling", "B. Long polling (WaitTimeSeconds up to 20)", "C. Disabling the queue", "D. Increasing retention to 14 days"],
        answer: "B",
        explanation:
          "B is correct: long polling waits (1–20s) for messages, cutting empty responses and cost. Short polling returns immediately (more empty reads); retention/disabling don't affect polling efficiency.",
      },
      {
        q: "To scale SQS consumers to match a growing backlog, you drive an Auto Scaling Group off which metric?",
        options: [
          "A. CPUUtilization only",
          "B. ApproximateNumberOfMessages (queue length)",
          "C. NetworkIn",
          "D. DiskReadOps",
        ],
        answer: "B",
        explanation:
          "B is correct: the ApproximateNumberOfMessages CloudWatch metric reflects backlog, so an ASG can add/remove consumers accordingly. CPU/network/disk don't directly represent queue depth.",
      },
      {
        q: "Which describes a STANDARD SQS queue's delivery and ordering?",
        options: [
          "A. Exactly-once, strict ordering",
          "B. At-least-once delivery, best-effort ordering",
          "C. At-most-once, no duplicates ever",
          "D. Exactly-once, best-effort ordering",
        ],
        answer: "B",
        explanation:
          "B is correct: Standard queues give at-least-once delivery (occasional duplicates) and best-effort ordering. For exactly-once and strict order, use a FIFO queue.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "sqs-fifo",
    title: "Amazon SQS — FIFO Queues",
    shortLabel: "SQS FIFO",
    section: "Integration & Messaging — SQS, SNS & Kinesis",
    domain: "Integration",
    tldr:
      "FIFO queues guarantee ordering and exactly-once processing (dedup), at limited throughput — 300 msg/s (3,000 with batching). Ordering is per Message Group ID (mandatory); duplicates are removed via a Deduplication ID (or content-based). Use when order and no-duplicates matter more than raw throughput.",
    subtopics: [
      {
        heading: "FIFO guarantees",
        bullets: [
          { icon: "🔢", text: "**First-In-First-Out** ordering and **exactly-once** send (no duplicates)." },
          { icon: "🐢", text: "Throughput is **limited**: **300 msg/s** without batching, **3,000 msg/s** with batching." },
        ],
      },
      {
        heading: "Ordering & deduplication",
        bullets: [
          { icon: "🏷️", text: "**Message Group ID** (mandatory) — messages in the **same group** are strictly ordered; different groups can process in parallel." },
          { icon: "🧹", text: "**Deduplication ID** (or **content-based** dedup) removes duplicate sends within a 5-minute window." },
        ],
      },
      {
        heading: "When to use FIFO vs Standard",
        bullets: [
          { icon: "✅", text: "Choose **FIFO** when **order** and **no-duplicates** are essential (e.g. financial transactions, command sequences)." },
          { icon: "⚡", text: "Choose **Standard** when you need **maximum throughput** and can tolerate occasional duplicates / out-of-order." },
        ],
      },
    ],
    keyFacts: [
      { label: "Ordering", value: "Strict per Message Group ID", icon: "🔢" },
      { label: "Duplicates", value: "Removed (dedup ID)", icon: "🧹" },
      { label: "Throughput", value: "300/s (3,000/s batched)", icon: "🐢" },
      { label: "Group ID", value: "Mandatory", icon: "🏷️" },
    ],
    quickReference: {
      title: "Exam cues",
      icon: "🎯",
      bullets: [
        "'Messages MUST be processed in order and once' → **FIFO**.",
        "Order is **per Message Group ID**; different groups run in parallel.",
        "Dedup via **Deduplication ID** or **content-based** dedup.",
        "FIFO throughput is **capped** (300/s, 3,000/s batched) — Standard for max scale.",
      ],
      analogyBrief:
        "A FIFO queue is a single-file bank line where everyone is served strictly in arrival order, and the guard turns away anyone who tries to sneak in twice.",
    },
    explanation:
      "An SQS FIFO (First-In-First-Out) queue preserves the exact order in which messages are sent and provides exactly-once send capability by removing duplicates — the trade-off is limited throughput of 300 messages per second without batching or 3,000 per second with batching. Ordering is scoped by the Message Group ID, which is mandatory: all messages sharing a group ID are delivered and processed in strict order, while messages in different groups can be handled in parallel (so you can still get parallelism across independent ordering streams). Duplicate sends are eliminated using a Deduplication ID you supply, or content-based deduplication (a hash of the body), within a five-minute dedup window. Choose FIFO when order and the absence of duplicates are essential — for example a sequence of financial transactions or ordered commands — and choose a Standard queue when you need maximum throughput and can tolerate occasional duplicates or out-of-order delivery.",
    analogy:
      "A FIFO queue is a strict single-file bank line: customers are served in the exact order they arrived, and a guard at the rope turns away anyone who tries to slip in a second time (deduplication). If the bank opens several tellers for different account types, each type still forms its own orderly line (that's the Message Group ID) — so independent lines move in parallel, but within a line the order is sacred.",
    diagram: `<svg viewBox="0 0 720 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="SQS FIFO ordering">${svgDefs}
      ${box(20, 75, 100, 50, "Producer", "1,2,3,4", "#8b949e")}
      <line x1="120" y1="100" x2="170" y2="100" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(175, 70, 200, 60, "FIFO Queue", "order + dedup (group ID)", "#e11d8f")}
      <line x1="375" y1="100" x2="425" y2="100" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(430, 75, 110, 50, "Consumer", "1→2→3→4", "#22c55e")}
      <text x="360" y="165" text-anchor="middle" fill="#8b949e" font-size="10">300 msg/s (3,000 with batching) · exactly-once</text>
    </svg>`,
    diagramLegend: [
      { color: "#e11d8f", label: "FIFO queue", description: "Preserves order and removes duplicates." },
      { color: "#22c55e", label: "Consumer", description: "Receives messages in strict group order." },
    ],
    codeExample: {
      language: "bash",
      title: "Send to a FIFO queue with group + dedup IDs",
      code: `aws sqs send-message \\
  --queue-url https://sqs.us-east-1.amazonaws.com/123456789012/orders.fifo \\
  --message-body '{"orderId":123,"step":"charge"}' \\
  --message-group-id "customer-42" \\
  --message-deduplication-id "order-123-charge"`,
    },
    problemStatement:
      "A payments system must apply each customer's transactions in the exact order submitted and must never process the same transaction twice, even if the client retries a send. Peak load is a few hundred messages per second. Which SQS queue type and two message attributes guarantee ordering and deduplication, and why is the throughput limit acceptable here?",
    questions: [
      {
        q: "A workflow requires messages processed in EXACT order with NO duplicates. Which SQS queue type?",
        options: ["A. Standard queue", "B. FIFO queue", "C. Dead-letter queue only", "D. Any queue with long polling"],
        answer: "B",
        explanation:
          "B is correct: FIFO queues guarantee ordering and exactly-once (dedup). Standard is best-effort order and at-least-once (duplicates possible).",
      },
      {
        q: "In a FIFO queue, what controls the ordering scope (and is mandatory)?",
        options: ["A. Deduplication ID", "B. Message Group ID", "C. Visibility timeout", "D. Receipt handle"],
        answer: "B",
        explanation:
          "B is correct: the Message Group ID (mandatory) defines the ordering group — same group is strictly ordered, different groups run in parallel. The Deduplication ID handles duplicates, not ordering.",
      },
      {
        q: "How does a FIFO queue prevent duplicate messages from a retrying producer?",
        options: [
          "A. Increasing the visibility timeout",
          "B. Using a Deduplication ID (or content-based deduplication)",
          "C. Enabling long polling",
          "D. Adding more consumers",
        ],
        answer: "B",
        explanation:
          "B is correct: within a 5-minute window, messages with the same Deduplication ID (or identical content, with content-based dedup) are treated as duplicates and dropped. The others don't dedupe.",
      },
      {
        q: "What is the approximate throughput ceiling of an SQS FIFO queue?",
        options: [
          "A. Unlimited",
          "B. 300 msg/s (up to 3,000 with batching)",
          "C. 10 msg/s",
          "D. 1,000,000 msg/s",
        ],
        answer: "B",
        explanation:
          "B is correct: FIFO handles ~300 msg/s without batching and up to ~3,000 with batching. Standard queues are the ones with effectively unlimited throughput.",
      },
      {
        q: "When would you prefer a STANDARD queue over FIFO?",
        options: [
          "A. When strict ordering is required",
          "B. When you need maximum throughput and can tolerate occasional duplicates/out-of-order",
          "C. When you must never have duplicates",
          "D. When messages must be exactly-once",
        ],
        answer: "B",
        explanation:
          "B is correct: Standard offers unlimited throughput at the cost of best-effort ordering and at-least-once delivery. If you need strict order / exactly-once, choose FIFO.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "amazon-sns",
    title: "Amazon SNS — Pub/Sub, Fan-Out & Filtering",
    shortLabel: "Amazon SNS",
    section: "Integration & Messaging — SQS, SNS & Kinesis",
    domain: "Integration",
    tldr:
      "SNS is pub/sub: a publisher sends to a topic and every subscriber gets the message (SQS, Lambda, HTTP(S), email, SMS, Kinesis Firehose). The classic fan-out pattern is SNS → many SQS queues (durable, decoupled). FIFO topics add ordering/dedup; message filtering routes by JSON policy.",
    subtopics: [
      {
        heading: "Pub/Sub model",
        bullets: [
          { icon: "📢", text: "Publisher sends to **one topic**; **each subscriber** receives every message (up to 12.5M subs/topic, 100k topics)." },
          { icon: "🎯", text: "Subscriber types: **SQS, Lambda, Kinesis Data Firehose, HTTP(S), email, SMS/mobile push**." },
          { icon: "🔗", text: "Many AWS services publish to SNS (CloudWatch Alarms, S3 events, ASG, Budgets, RDS events…)." },
        ],
      },
      {
        heading: "Fan-Out pattern (SNS + SQS)",
        bullets: [
          { icon: "🌟", text: "Publish once to SNS → deliver to **multiple SQS queues**: fully decoupled, **no data loss**, add subscribers over time." },
          { icon: "🪣", text: "Solves 'one S3 event → many queues' (S3 → SNS → many SQS). SQS **access policy** must allow SNS to write." },
        ],
      },
      {
        heading: "FIFO & filtering & security",
        bullets: [
          { icon: "🔢", text: "**SNS FIFO** (with SQS FIFO subscribers) gives ordering + dedup — combine for **fan-out + order + dedup**." },
          { icon: "🧪", text: "**Message filtering** — JSON filter policy per subscription; no policy = receive everything." },
          { icon: "🔐", text: "HTTPS in-flight, KMS at-rest, IAM + **SNS access policies** (cross-account, allow S3 to publish)." },
        ],
      },
    ],
    keyFacts: [
      { label: "Model", value: "Pub/Sub (topic → subscribers)", icon: "📢" },
      { label: "Fan-out", value: "SNS → many SQS queues", icon: "🌟" },
      { label: "Ordering + dedup", value: "SNS FIFO", icon: "🔢" },
      { label: "Route by content", value: "Message filtering (JSON)", icon: "🧪" },
    ],
    quickReference: {
      title: "Exam cues",
      icon: "🎯",
      bullets: [
        "'Send one message to many receivers' → **SNS** (pub/sub).",
        "'Deliver an event to several independent, durable consumers' → **SNS + SQS fan-out**.",
        "'One S3 event to multiple queues' → **S3 → SNS → many SQS**.",
        "'Fan-out AND ordering/dedup' → **SNS FIFO + SQS FIFO**.",
        "'Route only some messages to a subscriber' → **message filtering**.",
      ],
      analogyBrief:
        "SNS is a radio broadcast: publish once and every tuned-in station (subscriber) hears it. Fan-out with SQS gives each station its own recorder so nothing is missed.",
    },
    explanation:
      "Amazon SNS is a publish/subscribe messaging service: instead of a producer talking to each receiver directly, it sends one message to an SNS topic and every subscriber to that topic receives it (a topic can have up to 12.5 million subscriptions, and an account up to 100,000 topics). Subscribers include SQS queues, Lambda functions, Kinesis Data Firehose, HTTP(S) endpoints, email, and SMS/mobile push, and many AWS services publish to SNS directly (CloudWatch Alarms, S3 events, Auto Scaling notifications, Budgets, RDS events, and more). The most important architecture is the fan-out pattern: publish once to SNS and have it deliver to multiple SQS queues, which is fully decoupled and loses no data, lets each consumer process independently with SQS's persistence and retries, and lets you add subscribers over time — this also solves the limitation that an S3 event for a given event-type/prefix can go to only one destination, by sending S3 → SNS → many SQS queues (the SQS access policy must allow SNS to write). SNS FIFO topics provide ordering and deduplication and, when paired with SQS FIFO queues, give fan-out plus ordering plus deduplication. SNS message filtering uses a JSON filter policy per subscription so each subscriber only receives the messages it cares about (with no policy, a subscription receives every message). Security includes HTTPS in transit, KMS at rest, IAM policies, and SNS access policies for cross-account access or to let services like S3 publish to a topic.",
    analogy:
      "SNS is a radio broadcast tower. Instead of phoning every listener individually, the DJ (publisher) transmits once on a station (topic), and everyone tuned in (subscribers) hears it simultaneously. The fan-out pattern is giving each listener their own recorder (an SQS queue) so even if they step away, the show is saved for them to process later — and message filtering is a subscriber who only records the traffic reports and ignores the music.",
    diagram: `<svg viewBox="0 0 720 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="SNS fan-out">${svgDefs}
      ${box(20, 80, 110, 50, "Publisher", "publish once", "#8b949e")}
      ${box(180, 75, 120, 60, "SNS Topic", "pub/sub", "#e11d8f")}
      <line x1="130" y1="105" x2="178" y2="105" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(370, 25, 130, 40, "SQS Queue A", "consumer A", "#3b82f6")}
      ${box(370, 90, 130, 40, "SQS Queue B", "consumer B", "#3b82f6")}
      ${box(370, 155, 130, 40, "Lambda", "consumer C", "#f59e0b")}
      <line x1="300" y1="95" x2="368" y2="45" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
      <line x1="300" y1="105" x2="368" y2="110" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
      <line x1="300" y1="115" x2="368" y2="175" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
      <text x="540" y="100" fill="#8b949e" font-size="10">each subscriber</text>
      <text x="540" y="118" fill="#8b949e" font-size="10">gets every message</text>
    </svg>`,
    diagramLegend: [
      { color: "#e11d8f", label: "SNS topic", description: "Publish once; all subscribers receive it." },
      { color: "#3b82f6", label: "SQS subscribers", description: "Fan-out to durable, independent queues." },
      { color: "#f59e0b", label: "Lambda subscriber", description: "Event-driven processing on publish." },
    ],
    codeExample: {
      language: "bash",
      title: "Publish to a topic; subscribe an SQS queue (fan-out)",
      code: `aws sns subscribe \\
  --topic-arn arn:aws:sns:us-east-1:123456789012:orders \\
  --protocol sqs \\
  --notification-endpoint arn:aws:sqs:us-east-1:123456789012:orders-fraud

aws sns publish \\
  --topic-arn arn:aws:sns:us-east-1:123456789012:orders \\
  --message '{"orderId":123}'`,
    },
    problemStatement:
      "When an order is placed, three independent teams — fraud, shipping, and analytics — each need to process the event, and new teams may onboard later. You also want each consumer to retry independently without losing events if it's down. Which messaging pattern delivers one event to all of them durably and extensibly, and what must you configure so SNS can write to the SQS queues?",
    questions: [
      {
        q: "You must deliver a single event to MANY independent, durable consumers that can each retry on failure. Which pattern?",
        options: [
          "A. A single SQS queue with many consumers",
          "B. SNS fan-out to multiple SQS queues",
          "C. Kinesis Data Streams only",
          "D. Direct HTTP calls to each service",
        ],
        answer: "B",
        explanation:
          "B is correct: SNS publishes once and fans out to multiple SQS queues, giving each consumer durable, independent processing with retries and easy extensibility. A single queue splits (not copies) messages; direct calls couple the services.",
      },
      {
        q: "For SNS to deliver messages into an SQS queue, what must be configured on the queue?",
        options: [
          "A. A visibility timeout of 0",
          "B. An SQS access policy allowing the SNS topic to send messages",
          "C. FIFO mode",
          "D. Long polling",
        ],
        answer: "B",
        explanation:
          "B is correct: the SQS access policy must permit the SNS topic (service principal) to SendMessage. Visibility timeout, FIFO, and long polling don't grant SNS write permission.",
      },
      {
        q: "An S3 event for a given prefix/type can go to only ONE destination. How do you deliver it to several queues?",
        options: [
          "A. S3 → SNS → multiple SQS queues (fan-out)",
          "B. Enable S3 versioning",
          "C. Use multiple buckets",
          "D. It's impossible",
        ],
        answer: "A",
        explanation:
          "A is correct: send the S3 event to an SNS topic and fan out to multiple SQS queues. Versioning/multiple buckets don't solve the single-destination limit.",
      },
      {
        q: "How do you ensure a subscriber only receives a SUBSET of messages on a topic?",
        options: [
          "A. SNS message filtering with a JSON filter policy",
          "B. Increase the topic's retention",
          "C. Use a Standard queue",
          "D. Lower the TTL",
        ],
        answer: "A",
        explanation:
          "A is correct: an SNS subscription filter policy (JSON) delivers only matching messages; without a policy the subscription gets everything. The others don't filter by content.",
      },
      {
        q: "To get fan-out AND strict ordering with no duplicates, you combine:",
        options: [
          "A. SNS Standard + SQS Standard",
          "B. SNS FIFO + SQS FIFO",
          "C. Kinesis + Lambda",
          "D. SNS + email only",
        ],
        answer: "B",
        explanation:
          "B is correct: an SNS FIFO topic with SQS FIFO subscribers provides fan-out plus ordering and deduplication. Standard versions don't guarantee order/exactly-once.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "sns-sqs-fanout",
    title: "Fan-Out Patterns & S3 → SNS Integrations",
    shortLabel: "Fan-Out Patterns",
    section: "Integration & Messaging — SQS, SNS & Kinesis",
    domain: "Integration",
    tldr:
      "Reinforces the fan-out toolkit: SNS + SQS fan-out (one publish, many durable queues, add subscribers anytime); SNS FIFO + SQS FIFO for fan-out with ordering + dedup; S3 events → SNS → many queues to bypass S3's single-destination limit; and SNS → Kinesis Data Firehose → S3 (or other Firehose targets).",
    subtopics: [
      {
        heading: "SNS + SQS fan-out",
        bullets: [
          { icon: "🌟", text: "**Publish once** to SNS → **many SQS queues**; fully decoupled, **no data loss**, add subscribers over time." },
          { icon: "🔑", text: "Each SQS queue's **access policy** must allow the SNS topic to write; works **cross-Region** too." },
        ],
      },
      {
        heading: "Ordered fan-out & S3 events",
        bullets: [
          { icon: "🔢", text: "**SNS FIFO + SQS FIFO** = fan-out **plus** ordering **plus** deduplication." },
          { icon: "🪣", text: "**S3 → SNS → many SQS/Lambda**: overcomes 'one event rule per type+prefix' by fanning the S3 event out." },
        ],
      },
      {
        heading: "SNS → Firehose",
        bullets: [
          { icon: "🚒", text: "SNS can deliver to **Kinesis Data Firehose**, which lands data in **S3** (or any supported Firehose destination)." },
          { icon: "🧩", text: "Great for archiving/analytics pipelines fed by pub/sub events." },
        ],
      },
    ],
    keyFacts: [
      { label: "One publish", value: "Many SQS queues", icon: "🌟" },
      { label: "Ordered fan-out", value: "SNS FIFO + SQS FIFO", icon: "🔢" },
      { label: "S3 → many queues", value: "S3 → SNS → SQS", icon: "🪣" },
      { label: "SNS → S3 archive", value: "via Kinesis Firehose", icon: "🚒" },
    ],
    quickReference: {
      title: "Exam cues",
      icon: "🎯",
      bullets: [
        "Default answer for 'deliver an event to N independent consumers' → **SNS + SQS fan-out**.",
        "Need order/dedup in the fan-out → **FIFO on both**.",
        "'S3 event to multiple targets' → **S3 → SNS → many SQS/Lambda**.",
        "'Pub/sub events into S3 for analytics' → **SNS → Firehose → S3**.",
        "Remember the **SQS access policy** allowing SNS.",
      ],
      analogyBrief:
        "Fan-out is a press release sent to one wire service (SNS) that copies it to every newsroom's inbox (SQS) — each edits and publishes on its own schedule.",
    },
    explanation:
      "This topic consolidates the fan-out toolkit. The core SNS + SQS fan-out pattern publishes a message once to an SNS topic and delivers it to multiple SQS queues; it is fully decoupled and loses no data, each queue gives its consumer durable storage plus independent retries, you can add more subscribers over time, and it even works across Regions — just make sure each SQS queue's access policy allows the SNS topic to write. When you need ordering and no duplicates as well as fan-out, use an SNS FIFO topic with SQS FIFO queue subscribers. A very common application is overcoming the S3 limitation that, for a given event type and prefix, an S3 event notification can target only one destination: by sending the S3 event to an SNS topic you can fan it out to many SQS queues (and Lambda functions) at once. Finally, SNS can deliver to Amazon Kinesis Data Firehose, which can then load the data into Amazon S3 or any other Firehose-supported destination — enabling archival and analytics pipelines driven by pub/sub events.",
    analogy:
      "Fan-out is like issuing a single press release to a wire service (SNS). The wire service instantly copies it into every subscribing newsroom's inbox (an SQS queue each), so a newsroom that's offline at the moment still finds the story waiting when it returns. Each newsroom edits and publishes on its own schedule, new outlets can subscribe anytime, and if you also need every outlet to run the stories in the same order, you use the ordered (FIFO) wire.",
    diagram: `<svg viewBox="0 0 720 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="S3 to SNS fan-out and Firehose">${svgDefs}
      ${box(20, 85, 90, 45, "S3 event", "object created", "#16a34a")}
      ${box(150, 82, 110, 50, "SNS Topic", "fan-out", "#e11d8f")}
      <line x1="110" y1="107" x2="148" y2="107" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(320, 20, 120, 38, "SQS Queue", "", "#3b82f6")}
      ${box(320, 70, 120, 38, "SQS Queue", "", "#3b82f6")}
      ${box(320, 120, 120, 38, "Lambda", "", "#f59e0b")}
      ${box(320, 170, 120, 38, "Firehose → S3", "archive", "#8b5cf6")}
      <line x1="260" y1="100" x2="318" y2="40" stroke="#ff9900" stroke-width="1.3" marker-end="url(#arrow)"/>
      <line x1="260" y1="105" x2="318" y2="90" stroke="#ff9900" stroke-width="1.3" marker-end="url(#arrow)"/>
      <line x1="260" y1="112" x2="318" y2="138" stroke="#ff9900" stroke-width="1.3" marker-end="url(#arrow)"/>
      <line x1="260" y1="118" x2="318" y2="188" stroke="#ff9900" stroke-width="1.3" marker-end="url(#arrow)"/>
    </svg>`,
    diagramLegend: [
      { color: "#e11d8f", label: "SNS topic", description: "Central fan-out point for one event." },
      { color: "#3b82f6", label: "SQS / Lambda", description: "Independent, durable consumers." },
      { color: "#8b5cf6", label: "Firehose → S3", description: "Archive/analytics pipeline from pub/sub." },
    ],
    codeExample: {
      language: "json",
      title: "SQS access policy letting an SNS topic deliver (fan-out prerequisite)",
      code: `{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Service": "sns.amazonaws.com" },
    "Action": "SQS:SendMessage",
    "Resource": "arn:aws:sqs:us-east-1:123456789012:orders-shipping",
    "Condition": { "ArnLike": { "aws:SourceArn": "arn:aws:sns:us-east-1:123456789012:orders" } }
  }]
}`,
    },
    problemStatement:
      "Uploading an image to S3 must simultaneously trigger a thumbnail Lambda, enqueue a virus-scan job, enqueue a metadata-indexing job, and archive a copy of the event to S3 for analytics — but S3 allows only one notification target per event-type/prefix. Design the messaging topology that satisfies all four consumers, and note the permission each SQS queue needs.",
    questions: [
      {
        q: "S3 permits only one notification destination per event type/prefix, but you need four consumers. What's the standard solution?",
        options: [
          "A. Send the S3 event to SNS and fan out to the SQS queues/Lambda",
          "B. Create four buckets",
          "C. Poll S3 with a cron job",
          "D. Use S3 versioning",
        ],
        answer: "A",
        explanation:
          "A is correct: S3 → SNS → multiple SQS/Lambda fans one event out to many consumers. Multiple buckets or polling are workarounds; versioning is unrelated.",
      },
      {
        q: "Which combination gives fan-out WITH ordering and deduplication?",
        options: [
          "A. SNS Standard + SQS Standard",
          "B. SNS FIFO topic + SQS FIFO queues",
          "C. Kinesis + S3",
          "D. Direct Lambda invocations",
        ],
        answer: "B",
        explanation:
          "B is correct: SNS FIFO with SQS FIFO subscribers delivers fan-out plus strict ordering and dedup. Standard versions are best-effort/at-least-once.",
      },
      {
        q: "To archive SNS-published events into S3 for later analytics, SNS can deliver to:",
        options: [
          "A. Kinesis Data Firehose (which writes to S3)",
          "B. EBS",
          "C. Route 53",
          "D. A security group",
        ],
        answer: "A",
        explanation:
          "A is correct: SNS can deliver to Kinesis Data Firehose, which lands data in S3 (or other Firehose destinations). EBS/Route 53/SGs aren't SNS delivery targets.",
      },
      {
        q: "A benefit of SNS + SQS fan-out over direct service-to-service calls is:",
        options: [
          "A. Tighter coupling between services",
          "B. Durable, independent processing per consumer with easy addition of new subscribers",
          "C. Guaranteed lower cost always",
          "D. It removes the need for IAM",
        ],
        answer: "B",
        explanation:
          "B is correct: each SQS subscriber gets durable, independent processing/retries and you can add subscribers over time — decoupling the producer from consumers. It loosens (not tightens) coupling and still needs IAM/policies.",
      },
      {
        q: "For fan-out to work, each subscribing SQS queue must have:",
        options: [
          "A. FIFO enabled",
          "B. An access policy allowing the SNS topic to SendMessage",
          "C. A visibility timeout of 0",
          "D. A public endpoint",
        ],
        answer: "B",
        explanation:
          "B is correct: the SQS access policy must permit the SNS topic to send messages. FIFO is only needed for ordering; timeout/public endpoints aren't required for fan-out.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "amazon-kinesis",
    title: "Amazon Kinesis Data Streams & Data Firehose",
    shortLabel: "Kinesis",
    section: "Integration & Messaging — SQS, SNS & Kinesis",
    domain: "Integration",
    tldr:
      "Kinesis Data Streams ingests real-time streaming data with ordering per partition key, 1–365 day retention, and replay; capacity is Provisioned (per-shard: 1MB/s in, 2MB/s out) or On-demand. Amazon Data Firehose is a fully-managed, near-real-time delivery service that loads streams into S3, Redshift, OpenSearch, and 3rd parties (with optional Lambda transform).",
    subtopics: [
      {
        heading: "Kinesis Data Streams",
        bullets: [
          { icon: "🌊", text: "Collect & store **real-time** data (click streams, IoT, logs); **ordering per Partition ID**." },
          { icon: "⏪", text: "Retention up to **365 days**; **replay** data; data **can't be deleted** until it expires; records up to **1 MB**." },
          { icon: "🧑‍💻", text: "Producers: SDK, **KPL**, Kinesis Agent. Consumers: apps (**KCL**), Lambda, Firehose, Managed Service for Apache Flink." },
        ],
      },
      {
        heading: "Capacity modes",
        bullets: [
          { icon: "🎚️", text: "**Provisioned** — you pick shards; each shard = **1 MB/s (or 1,000 records/s) in**, **2 MB/s out**; scale manually; pay per shard." },
          { icon: "🤖", text: "**On-demand** — no capacity management; scales automatically to observed peak; pay per stream + data." },
        ],
      },
      {
        heading: "Amazon Data Firehose",
        bullets: [
          { icon: "🚒", text: "Fully-managed, **near-real-time** delivery (buffers by size/time); **serverless, auto-scaling**." },
          { icon: "🎯", text: "Destinations: **S3, Redshift, OpenSearch**, 3rd parties (Splunk/Datadog…), custom HTTP." },
          { icon: "🔧", text: "Optional **Lambda transform** (e.g. CSV→JSON), format conversion (Parquet/ORC), compression." },
        ],
      },
    ],
    keyFacts: [
      { label: "Streams retention", value: "1–365 days (+replay)", icon: "⏪" },
      { label: "Provisioned shard", value: "1MB/s in · 2MB/s out", icon: "🎚️" },
      { label: "Firehose", value: "Near-real-time, managed", icon: "🚒" },
      { label: "Firehose targets", value: "S3, Redshift, OpenSearch…", icon: "🎯" },
    ],
    quickReference: {
      title: "Streams vs Firehose",
      icon: "🎯",
      bullets: [
        "'Real-time streaming with **replay / ordering / custom consumers**' → **Kinesis Data Streams**.",
        "'Just **load** a stream into S3/Redshift/OpenSearch, near-real-time, no servers' → **Data Firehose**.",
        "Streams = you manage shards/consumers & retention; Firehose = fully managed, no retention/replay.",
        "Order is per **Partition Key** in Streams.",
        "Firehose can **transform** with Lambda and convert to Parquet/ORC.",
      ],
      analogyBrief:
        "Kinesis Data Streams is a DVR of a live feed you can rewind and let many apps watch; Firehose is an auto-piping hose that just pumps the feed into a storage tank near-real-time.",
    },
    explanation:
      "Amazon Kinesis Data Streams collects and stores streaming data in real time — click streams, IoT telemetry, metrics, and logs. It guarantees ordering for records that share the same partition key, retains data from 1 up to 365 days with the ability to reprocess (replay) it, and does not let you delete data before it expires; each record can be up to 1 MB (typically many small real-time records). Producers use the SDK, the Kinesis Producer Library (KPL), or the Kinesis Agent; consumers include custom applications built with the Kinesis Client Library (KCL), Lambda, Amazon Data Firehose, and Managed Service for Apache Flink. There are two capacity modes: Provisioned mode, where you choose the number of shards and each shard provides 1 MB/s (or 1,000 records/s) of ingest and 2 MB/s of egress, scaling manually and paying per shard; and On-demand mode, which requires no capacity management, scales automatically based on the observed peak of the last 30 days, and bills per stream plus data. Amazon Data Firehose (formerly Kinesis Data Firehose) is a fully-managed, near-real-time delivery service that buffers by size or time and automatically scales; it loads data into destinations such as Amazon S3, Amazon Redshift, and Amazon OpenSearch, third-party services like Splunk and Datadog, and custom HTTP endpoints, and it can transform records with a Lambda function (for example CSV to JSON), convert formats to Parquet or ORC, and compress the output. In short, use Data Streams when you need real-time ingestion with replay, ordering, and custom/multiple consumers, and use Firehose when you simply want to reliably load a stream into a store with minimal operations.",
    analogy:
      "Kinesis Data Streams is a DVR recording a live broadcast: many viewers (consumer apps) can watch the same feed, rewind and replay it, and it keeps the recording for a set time. Amazon Data Firehose is a fire hose plumbed straight into a storage tank — it doesn't let you rewind or fan out to arbitrary viewers; it just reliably pumps the incoming stream into S3 (or Redshift/OpenSearch) near-real-time, optionally filtering the water on the way in.",
    diagram: `<svg viewBox="0 0 720 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Kinesis Data Streams and Firehose">${svgDefs}
      ${box(20, 90, 110, 50, "Producers", "SDK/KPL/Agent", "#8b949e")}
      ${box(170, 85, 130, 60, "Data Streams", "shards · replay", "#8b5cf6")}
      <line x1="130" y1="115" x2="168" y2="115" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(350, 25, 130, 40, "App (KCL)", "real-time", "#22c55e")}
      ${box(350, 78, 130, 40, "Lambda / Flink", "process", "#f59e0b")}
      ${box(350, 131, 130, 40, "Data Firehose", "near-real-time", "#e11d8f")}
      <line x1="300" y1="105" x2="348" y2="45" stroke="#ff9900" stroke-width="1.3" marker-end="url(#arrow)"/>
      <line x1="300" y1="115" x2="348" y2="98" stroke="#ff9900" stroke-width="1.3" marker-end="url(#arrow)"/>
      <line x1="300" y1="125" x2="348" y2="151" stroke="#ff9900" stroke-width="1.3" marker-end="url(#arrow)"/>
      ${box(540, 131, 150, 40, "S3 / Redshift", "OpenSearch…", "#16a34a")}
      <line x1="480" y1="151" x2="538" y2="151" stroke="#22c55e" stroke-width="2" marker-end="url(#arrow)"/>
    </svg>`,
    diagramLegend: [
      { color: "#8b5cf6", label: "Data Streams", description: "Real-time, sharded, replayable ingestion." },
      { color: "#e11d8f", label: "Data Firehose", description: "Managed near-real-time delivery to stores." },
      { color: "#16a34a", label: "Destinations", description: "S3, Redshift, OpenSearch, 3rd parties." },
    ],
    codeExample: {
      language: "bash",
      title: "Create an on-demand stream & put a record",
      code: `aws kinesis create-stream --stream-name clicks \\
  --stream-mode-details StreamMode=ON_DEMAND

aws kinesis put-record --stream-name clicks \\
  --partition-key user-42 \\
  --data '{"page":"/home","ts":1720000000}'
# Order is preserved per partition key; consumers can replay within retention.`,
    },
    problemStatement:
      "A clickstream platform must ingest millions of events per second in real time, guarantee per-user ordering, and let both a real-time fraud app and a replayable analytics job consume the same data for up to a week. A separate requirement is to simply dump raw events into S3 and Redshift near-real-time with zero servers to manage. Which Kinesis service fits each requirement, and how do you handle capacity for the streaming ingest?",
    questions: [
      {
        q: "You need real-time ingestion with the ability to REPLAY data and support MULTIPLE custom consumers. Which service?",
        options: ["A. Amazon Data Firehose", "B. Kinesis Data Streams", "C. Amazon SQS", "D. Amazon SNS"],
        answer: "B",
        explanation:
          "B is correct: Kinesis Data Streams retains data (up to 365 days), supports replay, ordering per partition key, and many custom consumers (KCL, Lambda, Flink). Firehose can't replay; SQS/SNS aren't stream stores with replay.",
      },
      {
        q: "You just want to LOAD a stream into S3 and Redshift near-real-time with no servers to manage and optional format conversion. Which service?",
        options: ["A. Kinesis Data Streams", "B. Amazon Data Firehose", "C. EC2 consumers", "D. Amazon EFS"],
        answer: "B",
        explanation:
          "B is correct: Amazon Data Firehose is fully managed, near-real-time delivery to S3/Redshift/OpenSearch/etc., with optional Lambda transform and Parquet/ORC conversion. Streams needs you to build consumers; EC2/EFS don't fit.",
      },
      {
        q: "In Kinesis Data Streams PROVISIONED mode, what is the write capacity of a single shard?",
        options: [
          "A. 1 MB/s (or 1,000 records/s) in, 2 MB/s out",
          "B. Unlimited",
          "C. 10 GB/s",
          "D. 256 KB total",
        ],
        answer: "A",
        explanation:
          "A is correct: each shard ingests 1 MB/s (or 1,000 records/s) and egresses 2 MB/s. To go higher you add shards (or use On-demand mode).",
      },
      {
        q: "How is ordering guaranteed in Kinesis Data Streams?",
        options: [
          "A. Globally across the whole stream",
          "B. Per Partition Key (records with the same key are ordered)",
          "C. There is no ordering",
          "D. Only in Firehose",
        ],
        answer: "B",
        explanation:
          "B is correct: records sharing a partition key are kept in order (within their shard). Ordering isn't global across all shards, and it's a Streams (not Firehose) property.",
      },
      {
        q: "Which capacity mode requires NO shard management and scales automatically?",
        options: ["A. Provisioned mode", "B. On-demand mode", "C. Reserved mode", "D. Spot mode"],
        answer: "B",
        explanation:
          "B is correct: On-demand mode auto-scales to observed peak with no shard management (pay per stream + data). Provisioned requires you to choose/scale shards. 'Reserved'/'Spot' aren't Kinesis modes.",
      },
    ],
  },
];
