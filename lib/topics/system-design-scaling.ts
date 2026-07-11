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
// SECTION: System Design — Scaling Patterns.
// Message queues & async processing, rate limiting, and consistent
// hashing. Authored to the messaging.ts / frontend-core.ts bar.
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

export const systemDesignScalingTopics: Topic[] = [
  // -----------------------------------------------------------------
  {
    id: "sd-message-queues",
    title: "Message Queues & Async Processing",
    shortLabel: "Message Queues",
    section: "Scaling Patterns",
    domain: "SystemDesign",
    tldr:
      "A message queue decouples producers from consumers so work is buffered and processed asynchronously, smoothing spikes and isolating failures. Point-to-point queues deliver each message to exactly one consumer; pub/sub topics fan a message out to every subscriber. Real systems must reason about delivery guarantees (at-most-once, at-least-once, exactly-once), ordering, backpressure when consumers fall behind, and dead-letter queues for messages that repeatedly fail.",
    subtopics: [
      {
        heading: "Decoupling & async processing",
        bullets: [
          { icon: "🔗", text: "A queue **decouples** producers and consumers: the producer writes and moves on; the consumer reads at its own pace — neither needs the other to be online simultaneously (**temporal decoupling**)." },
          { icon: "🌊", text: "It acts as a **buffer** that absorbs traffic spikes: a burst of writes is flattened into a steady drain rate the consumers can sustain, protecting downstream databases and services." },
          { icon: "🧱", text: "**Failure isolation** — if a consumer crashes, messages wait in the queue instead of being lost; work resumes when it recovers." },
        ],
      },
      {
        heading: "Queue vs pub/sub",
        bullets: [
          { icon: "📬", text: "**Point-to-point queue**: each message is consumed by **exactly one** of the competing consumers — used to distribute work (a task/job queue)." },
          { icon: "📢", text: "**Pub/sub (topic)**: each message is delivered to **every** subscriber — used to broadcast events to many independent systems (fan-out)." },
          { icon: "🧩", text: "Many brokers combine both: a topic fans out to multiple **consumer groups**, and within a group the messages are load-balanced (queue semantics)." },
        ],
      },
      {
        heading: "Guarantees, backpressure & DLQ",
        bullets: [
          { icon: "✅", text: "**Delivery guarantees**: *at-most-once* (may lose), *at-least-once* (may duplicate — the common default; make consumers **idempotent**), *exactly-once* (expensive, usually effectively-once via dedup)." },
          { icon: "🚦", text: "**Backpressure**: when consumers can't keep up, the queue depth grows — signal producers to slow down, buffer with bounded limits, or scale consumers on queue depth; an unbounded queue just delays the failure." },
          { icon: "☠️", text: "**Dead-letter queue (DLQ)**: after N failed processing attempts a message is moved aside so it stops blocking the queue and can be inspected/replayed — prevents a single 'poison' message from stalling everything." },
        ],
      },
    ],
    keyFacts: [
      { label: "Core benefit", value: "Decouple + buffer + isolate", icon: "🔗" },
      { label: "Queue vs topic", value: "One consumer vs all subscribers", icon: "📬" },
      { label: "Common guarantee", value: "At-least-once (be idempotent)", icon: "✅" },
      { label: "Poison messages", value: "Routed to a dead-letter queue", icon: "☠️" },
    ],
    quickReference: {
      title: "Design cues",
      icon: "🎯",
      bullets: [
        "'Smooth spikes / protect a slow downstream' → **queue as a buffer**.",
        "'Deliver one event to many systems' → **pub/sub fan-out**; 'distribute work' → **point-to-point queue**.",
        "At-least-once is the default → make consumers **idempotent** (dedup by message ID).",
        "'A bad message keeps failing and blocks the queue' → **dead-letter queue** after max retries.",
        "'Consumers can't keep up' → **backpressure**: bounded queue, slow producers, or scale consumers on depth.",
      ],
      analogyBrief:
        "A message queue is a restaurant's order rail: waiters (producers) clip up tickets and leave; cooks (consumers) pull the next ticket when free. The rail absorbs a dinner rush, and a ticket no one can make gets set aside (DLQ) so the line keeps moving.",
    },
    explanation:
      "A message queue is an intermediary that lets one component (a producer) hand off work to another (a consumer) without the two being directly coupled in time or availability. The producer writes a message and immediately continues; the message is durably held until a consumer is ready to read it. This temporal decoupling is the foundation of asynchronous processing: instead of a web request synchronously waiting for a slow task (send an email, transcode a video, charge a card), the request enqueues the task and returns quickly while a background worker processes it later. Because the queue buffers work, it flattens traffic spikes — a sudden burst of thousands of messages is drained at whatever steady rate the consumers can sustain, which protects fragile downstream systems like databases from being overwhelmed. It also isolates failure: if a consumer crashes, its messages remain in the queue and are picked up when it recovers, so no work is lost. There are two fundamental delivery models. A point-to-point queue delivers each message to exactly one of several competing consumers, which is how you distribute a stream of tasks across a worker pool. A publish/subscribe topic delivers each message to every subscriber, which is how you broadcast an event to many independent systems (fan-out); many brokers unify these by fanning a topic out to multiple consumer groups while load-balancing within each group. The hard part of real systems is the guarantees. At-most-once delivery never duplicates but may lose messages on failure. At-least-once — the most common default — never loses a message but may deliver it more than once (for example when an acknowledgement is lost after processing), so consumers must be idempotent, typically by deduplicating on a message ID or using conditional writes. Exactly-once is the ideal but is expensive and often impossible end-to-end; it is usually approximated as effectively-once through deduplication and transactional outbox patterns. Ordering is another axis: global ordering limits parallelism, so systems usually guarantee order only within a partition or message group. When consumers fall behind, the queue depth grows and you face backpressure: an unbounded queue merely postpones the collapse, so well-designed systems bound the queue, signal producers to slow down (or shed load), and autoscale consumers on queue depth. Finally, a poison message that always fails would otherwise be retried forever and block progress; after a configured number of attempts it is moved to a dead-letter queue where it can be inspected, fixed, and replayed, keeping the main queue flowing.",
    analogy:
      "Think of a busy restaurant kitchen. Waiters (producers) take orders and clip the tickets onto a spinning rail (the queue), then immediately go serve other tables — they don't stand at the pass waiting for the food. Cooks (consumers) pull the next ticket whenever they finish a dish, so a sudden dinner rush just makes the rail longer for a while rather than paralyzing the waiters (buffering and decoupling). If a cook drops a pan and steps away, the tickets stay on the rail for another cook (failure isolation, at-least-once). A broadcast to the whole kitchen ('86 the salmon!') that every station must hear is pub/sub. And a ticket for a dish the kitchen simply can't make — no ingredients, keeps coming back — gets pulled off and pinned to a side board (the dead-letter queue) so the head chef can deal with it later while the line keeps moving.",
    diagram: `<svg viewBox="0 0 720 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Producers enqueue to a message queue drained by scaling consumers with a dead-letter queue">${svgDefs}
      ${box(20, 55, 110, 45, "Producer", "enqueue", "#8b949e")}
      ${box(20, 115, 110, 45, "Producer", "enqueue", "#8b949e")}
      ${box(180, 80, 140, 60, "Message Queue", "buffer · durable", "#0ea5e9")}
      <line x1="130" y1="78" x2="178" y2="100" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="130" y1="137" x2="178" y2="120" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <rect x="380" y="30" width="300" height="140" rx="10" fill="#1a2332" stroke="#ff9900" stroke-dasharray="5 4"/>
      <text x="395" y="50" fill="#ff9900" font-size="11" font-weight="700">Consumers (scale on queue depth)</text>
      ${box(395, 60, 120, 45, "Consumer", "poll + ack", "#22c55e")}
      ${box(540, 60, 120, 45, "Consumer", "poll + ack", "#22c55e")}
      ${box(467, 115, 120, 45, "Consumer", "+ new", "#3b82f6")}
      <line x1="320" y1="110" x2="393" y2="90" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="330" y="100" fill="#8b949e" font-size="9">poll</text>
      ${box(230, 190, 180, 45, "Dead-Letter Queue", "after N failed retries", "#f85149")}
      <line x1="290" y1="140" x2="300" y2="188" stroke="#f85149" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="418" y="215" fill="#8b949e" font-size="10">poison messages set aside for inspection/replay</text>
    </svg>`,
    diagramLegend: [
      { color: "#0ea5e9", label: "Message queue", description: "Durably buffers messages; decouples producers from consumers." },
      { color: "#22c55e", label: "Consumers", description: "Poll, process, then acknowledge; scale out on queue depth." },
      { color: "#f85149", label: "Dead-letter queue", description: "Holds messages that fail N times so they stop blocking the queue." },
    ],
    codeExample: {
      language: "python",
      title: "Idempotent at-least-once consumer with DLQ routing",
      code: `MAX_RETRIES = 5
processed_ids = set()  # in real systems: Redis/DB dedup store

def handle(msg):
    # At-least-once means the same message may arrive twice.
    # Idempotency: skip work we've already committed.
    if msg.id in processed_ids:
        msg.ack()                       # duplicate — safely drop
        return
    try:
        do_work(msg.body)               # the actual side effect
        processed_ids.add(msg.id)
        msg.ack()                       # tell the broker we're done
    except Exception:
        if msg.delivery_count >= MAX_RETRIES:
            dead_letter_queue.send(msg)  # poison message → DLQ
            msg.ack()                    # remove from main queue
        else:
            msg.nack()                   # requeue for another attempt`,
    },
    codeExamples: [
      {
        language: "python",
        tab: "Idempotent consumer",
        title: "At-least-once consumer that dedups and dead-letters",
        code: `MAX_RETRIES = 5
processed_ids = set()  # in real systems: Redis/DB dedup store

def handle(msg):
    if msg.id in processed_ids:
        msg.ack()                        # duplicate — safely drop
        return
    try:
        do_work(msg.body)
        processed_ids.add(msg.id)
        msg.ack()
    except Exception:
        if msg.delivery_count >= MAX_RETRIES:
            dead_letter_queue.send(msg)  # poison message
            msg.ack()
        else:
            msg.nack()                   # requeue`,
      },
      {
        language: "python",
        tab: "Pub/sub fan-out",
        title: "One topic, many independent subscribers",
        code: `class Topic:
    def __init__(self):
        self.subscribers = []            # each is an independent queue

    def subscribe(self, queue):
        self.subscribers.append(queue)

    def publish(self, event):
        # Fan-out: EVERY subscriber gets its own copy.
        for q in self.subscribers:
            q.put(event)

orders = Topic()
orders.subscribe(fraud_queue)            # analytics, shipping, fraud...
orders.subscribe(shipping_queue)         # each processes at its own pace
orders.subscribe(analytics_queue)
orders.publish({"order_id": 123})`,
      },
      {
        language: "javascript",
        tab: "Async offload",
        title: "Web request enqueues, worker processes later",
        code: `// Producer: an API request returns fast, work happens async
app.post("/videos", async (req, res) => {
  const job = { id: crypto.randomUUID(), src: req.body.url };
  await queue.send(job);                 // enqueue and return
  res.status(202).json({ status: "queued", jobId: job.id });
});

// Consumer: a background worker drains the queue at its own rate
worker.on("message", async (job) => {
  await transcode(job.src);              // slow work off the hot path
  await queue.ack(job);                  // acknowledge completion
});`,
      },
    ],
    problemStatement:
      "An e-commerce checkout currently calls the email service, the warehouse API, and the analytics pipeline synchronously inside the HTTP request. During a flash sale, latency spikes and requests fail when any downstream is slow. Also, when the email service is briefly down, orders are lost. Redesign the flow with messaging so checkout stays fast, downstream slowness doesn't fail the request, one order event reaches all three systems, and a message that repeatedly fails doesn't block everything. Explain which delivery guarantee you rely on and what it demands of your consumers.",
    questions: [
      {
        q: "What is the PRIMARY benefit of putting a message queue between a producer and a consumer?",
        options: [
          "A. It encrypts all messages automatically",
          "B. It decouples them so they can work at different rates and times, buffering spikes",
          "C. It guarantees messages are never duplicated",
          "D. It makes the consumer faster than the producer",
        ],
        answer: "B",
        explanation:
          "B is correct: a queue decouples producers from consumers (temporal decoupling) and buffers bursts so a fast producer doesn't overwhelm a slower consumer. Encryption is a separate concern, queues don't inherently prevent duplicates (at-least-once can duplicate), and a queue doesn't change a consumer's speed.",
      },
      {
        q: "You need a single order event to be received independently by the fraud, shipping, AND analytics services. Which model fits?",
        options: [
          "A. A point-to-point queue with three competing consumers",
          "B. A publish/subscribe topic with three subscribers (fan-out)",
          "C. A single consumer that forwards the message",
          "D. A dead-letter queue",
        ],
        answer: "B",
        explanation:
          "B is correct: pub/sub delivers every message to every subscriber, so all three services get their own copy. A point-to-point queue would give each message to only one consumer, splitting the events rather than copying them.",
      },
      {
        q: "A queue guarantees AT-LEAST-ONCE delivery. What must your consumers be to handle this safely?",
        options: [
          "A. Stateless",
          "B. Idempotent (processing the same message twice has the same effect as once)",
          "C. Single-threaded",
          "D. Written in the same language as the producer",
        ],
        answer: "B",
        explanation:
          "B is correct: at-least-once may deliver a message more than once (e.g., a lost ack after processing), so consumers must be idempotent — typically by deduplicating on a message ID or using conditional writes. Statelessness and threading don't address duplicates.",
      },
      {
        q: "What is the purpose of a dead-letter queue (DLQ)?",
        options: [
          "A. To store messages that have expired due to TTL only",
          "B. To hold messages that repeatedly fail processing so they stop blocking the main queue and can be inspected",
          "C. To increase overall throughput",
          "D. To encrypt messages at rest",
        ],
        answer: "B",
        explanation:
          "B is correct: after a configured number of failed attempts, a 'poison' message is moved to a DLQ so it no longer blocks the main queue; you can then inspect, fix, and replay it. A DLQ is about isolating failures, not TTL expiry, throughput, or encryption.",
      },
      {
        q: "Consumers can't keep up and the queue depth is growing without bound. Which is the WORST long-term response?",
        options: [
          "A. Autoscale consumers based on queue depth",
          "B. Apply backpressure by slowing or shedding producer load",
          "C. Simply let the queue grow unbounded and assume it will catch up",
          "D. Bound the queue and reject or buffer excess with limits",
        ],
        answer: "C",
        explanation:
          "C is correct as the worst option: an unbounded queue only postpones failure (memory/storage exhaustion, ever-growing latency). Proper responses are to scale consumers on depth, apply backpressure to producers, or bound the queue.",
      },
      {
        q: "Why is true end-to-end EXACTLY-ONCE delivery usually avoided in favor of 'effectively-once'?",
        options: [
          "A. Exactly-once is illegal in distributed systems",
          "B. It is expensive and hard to guarantee across failures, so systems use at-least-once plus deduplication/idempotency to achieve the same observable result",
          "C. Exactly-once always loses messages",
          "D. Consumers cannot acknowledge messages under exactly-once",
        ],
        answer: "B",
        explanation:
          "B is correct: exactly-once across process/network failures is very costly and often impractical end-to-end, so real systems combine at-least-once delivery with idempotent consumers and deduplication (transactional outbox, dedup IDs) to make the observable effect exactly-once ('effectively-once'). It is not illegal, doesn't inherently lose messages, and acks still occur.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "sd-rate-limiting",
    title: "Rate Limiting",
    shortLabel: "Rate Limiting",
    section: "Scaling Patterns",
    domain: "SystemDesign",
    tldr:
      "Rate limiting caps how many requests a client may make in a time window to protect services from abuse, overload, and runaway costs. The token bucket allows short bursts up to the bucket size while enforcing an average refill rate; the leaky bucket enforces a smooth constant output rate; fixed-window counting is simple but allows double-rate bursts at window edges; the sliding window fixes that at higher cost. In distributed systems the counter must live in a shared store (e.g. Redis) so limits hold across all servers.",
    subtopics: [
      {
        heading: "Why rate limit",
        bullets: [
          { icon: "🛡️", text: "**Protect** services from overload, abusive clients, scrapers, and denial-of-service; keep one noisy tenant from starving others (**fairness**)." },
          { icon: "💸", text: "**Control cost** for metered downstreams (third-party APIs, LLM tokens) and enforce **plan tiers/quotas** (free vs paid)." },
          { icon: "🚦", text: "When a client exceeds the limit, return **HTTP 429 Too Many Requests** with a **Retry-After** header so clients back off politely." },
        ],
      },
      {
        heading: "Token bucket vs leaky bucket",
        bullets: [
          { icon: "🪣", text: "**Token bucket**: tokens refill at a fixed rate up to a capacity; each request spends a token. Allows **bursts** up to the bucket size, then throttles to the refill rate — the most common choice." },
          { icon: "💧", text: "**Leaky bucket**: requests enter a fixed-size queue and drain (leak) at a **constant** rate; smooths traffic to a steady output but adds queueing delay and drops on overflow." },
          { icon: "⚖️", text: "Token bucket favors **burst tolerance + average rate**; leaky bucket favors a **smooth, predictable** output rate. Both bound the long-run rate." },
        ],
      },
      {
        heading: "Windowed counters & distribution",
        bullets: [
          { icon: "🔲", text: "**Fixed window**: count requests per fixed interval (e.g. per minute). Simple, but a client can send a full limit at the end of one window and again at the start of the next → up to **2× the rate** at the boundary." },
          { icon: "🪟", text: "**Sliding window** (log or weighted counter): counts over the last N seconds relative to *now*, eliminating the boundary burst — more accurate but stores more state." },
          { icon: "🌐", text: "**Distributed** rate limiting: many servers must share one limit, so keep the counter in a central store like **Redis** (atomic INCR/Lua) — beware clock skew, races, and the extra network hop." },
        ],
      },
    ],
    keyFacts: [
      { label: "Over-limit response", value: "HTTP 429 + Retry-After", icon: "🚦" },
      { label: "Allows bursts", value: "Token bucket", icon: "🪣" },
      { label: "Smooth output", value: "Leaky bucket", icon: "💧" },
      { label: "Boundary flaw", value: "Fixed window (2× burst)", icon: "🔲" },
    ],
    quickReference: {
      title: "Design cues",
      icon: "🎯",
      bullets: [
        "'Allow occasional bursts but cap the average' → **token bucket** (default choice).",
        "'Force a perfectly smooth, constant output rate' → **leaky bucket**.",
        "'Simple per-minute cap' → **fixed window**; beware the **2× edge burst**.",
        "'Accurate limit with no edge burst' → **sliding window** (more memory).",
        "'Limit must hold across many servers' → central counter in **Redis** with atomic ops.",
        "Reject with **429 Too Many Requests** and a **Retry-After** hint.",
      ],
      analogyBrief:
        "A token bucket is a bag of arcade tokens that refills at a steady drip: you can spend a handful in a burst if you've saved them up, but over time you can only ride as fast as the tokens trickle back.",
    },
    explanation:
      "Rate limiting restricts how many requests a client (identified by API key, user ID, or IP) may make within a time window, and it exists to protect a service and its users. Without it, a buggy client, a scraper, or a deliberate attacker can exhaust CPU, connections, or a downstream database; a single noisy tenant can starve everyone else; and metered dependencies (a paid third-party API, LLM token spend) can rack up runaway cost. Rate limits also enforce commercial quotas — a free tier gets fewer requests than a paid tier. When a caller exceeds its limit the standard response is HTTP 429 Too Many Requests, ideally with a Retry-After header telling the client how long to wait so it can back off gracefully. Several algorithms implement the limit. The token bucket holds up to a fixed number of tokens and refills at a steady rate; each request removes one token, and a request with no available token is rejected. Because unused tokens accumulate up to the bucket's capacity, the token bucket permits short bursts (spend the whole bucket at once) while still enforcing the refill rate as the long-run average — this burst tolerance is why it is the most widely used algorithm. The leaky bucket is the mirror image: incoming requests enter a fixed-size FIFO queue and are processed (leak out) at a constant rate, which smooths bursty input into a perfectly steady output stream, at the price of added queueing latency and dropped requests when the queue overflows. The fixed-window counter is the simplest approach: keep a counter per client per interval (say, per minute) and reject once it exceeds the limit; its well-known flaw is the boundary burst — a client can send a full quota in the last second of one window and another full quota in the first second of the next, briefly achieving up to twice the intended rate. The sliding-window approach fixes this by counting requests over the trailing N seconds relative to the current instant, either by keeping a log of recent timestamps (accurate but memory-heavy) or by weighting the current and previous fixed windows (a cheap, near-accurate approximation); it removes the edge burst at the cost of more state. Finally, in any horizontally scaled system the limit must be shared across all application servers, because a per-server counter would let a client multiply its effective limit by the number of servers. The usual solution is a centralized, fast store such as Redis, using atomic operations (INCR with expiry, or a small Lua script implementing token-bucket math) so that concurrent requests don't race; the trade-offs are the added network hop per request, sensitivity to clock skew across nodes, and the store itself becoming a hotspot that must be made highly available.",
    analogy:
      "Imagine an arcade that gives each kid a small bucket of tokens. The machine drips new tokens into every bucket at a steady rate — say one per second — up to a maximum the bucket can hold. Each ride costs one token. A kid who waited patiently has saved a full bucket and can go on a burst of rides back-to-back (that's the burst allowance of a token bucket), but once the bucket is empty they can only ride as fast as tokens trickle back in (the average rate). A leaky bucket is the opposite arcade: no matter how many kids crowd the ride, they're let through the turnstile one every few seconds at a fixed cadence, and if the line overflows the far ones are turned away — smooth, steady, but you can't rush. And the fixed-window flaw is like a 'ten rides per hour' rule enforced only by a clock on the wall: a clever kid rides ten times at 1:59 and ten more at 2:01, cramming twenty rides into two minutes.",
    diagram: `<svg viewBox="0 0 720 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Token bucket refills at a fixed rate; requests spend tokens or are rejected with 429">${svgDefs}
      <text x="20" y="30" fill="#e6edf3" font-size="13" font-weight="700">Token Bucket</text>
      ${box(20, 45, 110, 45, "Refill", "r tokens/sec", "#22c55e")}
      <line x1="130" y1="67" x2="188" y2="90" stroke="#22c55e" stroke-width="2" marker-end="url(#arrow)"/>
      <rect x="190" y="55" width="120" height="150" rx="8" fill="#243349" stroke="#0ea5e9"/>
      <text x="250" y="48" text-anchor="middle" fill="#8b949e" font-size="10">capacity = burst size</text>
      <circle cx="220" cy="180" r="10" fill="#0ea5e9"/>
      <circle cx="250" cy="180" r="10" fill="#0ea5e9"/>
      <circle cx="280" cy="180" r="10" fill="#0ea5e9"/>
      <circle cx="235" cy="155" r="10" fill="#0ea5e9"/>
      <circle cx="265" cy="155" r="10" fill="#0ea5e9"/>
      <text x="250" y="200" text-anchor="middle" fill="#8b949e" font-size="9">tokens</text>
      ${box(20, 150, 110, 45, "Request", "spend 1 token", "#8b949e")}
      <line x1="130" y1="172" x2="188" y2="165" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(390, 70, 150, 45, "Allowed (200)", "token available", "#22c55e")}
      ${box(390, 150, 150, 45, "Rejected (429)", "bucket empty", "#f85149")}
      <line x1="310" y1="110" x2="388" y2="92" stroke="#22c55e" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="310" y1="150" x2="388" y2="168" stroke="#f85149" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="560" y="176" fill="#8b949e" font-size="10">+ Retry-After</text>
    </svg>`,
    diagramLegend: [
      { color: "#22c55e", label: "Refill / allowed", description: "Tokens drip in at rate r; a request with a token is allowed." },
      { color: "#0ea5e9", label: "Bucket (capacity)", description: "Holds up to N tokens — the maximum burst size." },
      { color: "#f85149", label: "Rejected (429)", description: "No token available → HTTP 429 with a Retry-After hint." },
    ],
    codeExample: {
      language: "python",
      title: "Token bucket rate limiter (single process)",
      code: `import time

class TokenBucket:
    def __init__(self, capacity, refill_rate):
        self.capacity = capacity          # max burst
        self.refill_rate = refill_rate    # tokens per second
        self.tokens = capacity
        self.last = time.monotonic()

    def allow(self, cost=1):
        now = time.monotonic()
        # Lazily refill based on elapsed time, capped at capacity.
        self.tokens = min(
            self.capacity,
            self.tokens + (now - self.last) * self.refill_rate,
        )
        self.last = now
        if self.tokens >= cost:
            self.tokens -= cost
            return True                   # allowed
        return False                      # -> respond 429 Too Many Requests

# 10-request burst, refilling 5 tokens/sec (avg 5 req/s)
bucket = TokenBucket(capacity=10, refill_rate=5)`,
    },
    codeExamples: [
      {
        language: "python",
        tab: "Token bucket",
        title: "Burst up to capacity, average = refill rate",
        code: `import time

class TokenBucket:
    def __init__(self, capacity, refill_rate):
        self.capacity = capacity
        self.refill_rate = refill_rate    # tokens/sec
        self.tokens = capacity
        self.last = time.monotonic()

    def allow(self, cost=1):
        now = time.monotonic()
        self.tokens = min(
            self.capacity,
            self.tokens + (now - self.last) * self.refill_rate,
        )
        self.last = now
        if self.tokens >= cost:
            self.tokens -= cost
            return True
        return False                      # -> HTTP 429`,
      },
      {
        language: "python",
        tab: "Sliding window",
        title: "Trailing-window log — no boundary burst",
        code: `import time
from collections import deque

class SlidingWindow:
    def __init__(self, limit, window_secs):
        self.limit = limit
        self.window = window_secs
        self.hits = deque()               # timestamps

    def allow(self):
        now = time.monotonic()
        # Drop timestamps older than the trailing window.
        while self.hits and self.hits[0] <= now - self.window:
            self.hits.popleft()
        if len(self.hits) < self.limit:
            self.hits.append(now)
            return True
        return False                      # over the limit right now`,
      },
      {
        language: "lua",
        tab: "Distributed (Redis)",
        title: "Atomic fixed-window counter shared across servers",
        code: `-- Called via EVAL so INCR + EXPIRE are atomic across all app servers.
-- KEYS[1] = "rl:{client}:{minute}"   ARGV[1] = limit   ARGV[2] = ttl
local current = redis.call("INCR", KEYS[1])
if current == 1 then
  redis.call("EXPIRE", KEYS[1], ARGV[2]) -- start the window clock
end
if current > tonumber(ARGV[1]) then
  return 0                                -- over limit -> app returns 429
end
return 1                                  -- allowed`,
      },
    ],
    problemStatement:
      "A public API running on 8 stateless servers behind a load balancer must limit each API key to 100 requests per minute, tolerate small legitimate bursts, and behave correctly no matter which server a request lands on. A naive in-memory counter on each server lets a client do 800 req/min. Choose an algorithm and a storage strategy, explain how the fixed-window boundary burst could still let a client briefly exceed 100/min, and say what you would return to an over-limit client.",
    questions: [
      {
        q: "What is the standard HTTP status code to return when a client exceeds its rate limit?",
        options: [
          "A. 403 Forbidden",
          "B. 429 Too Many Requests",
          "C. 503 Service Unavailable",
          "D. 400 Bad Request",
        ],
        answer: "B",
        explanation:
          "B is correct: HTTP 429 Too Many Requests specifically signals rate-limit exhaustion, usually with a Retry-After header. 403 is authorization failure, 503 is general unavailability, and 400 is a malformed request.",
      },
      {
        q: "Which algorithm ALLOWS short bursts up to a maximum while still enforcing a long-run average rate?",
        options: [
          "A. Leaky bucket",
          "B. Token bucket",
          "C. Fixed window with a size of 1",
          "D. Round-robin",
        ],
        answer: "B",
        explanation:
          "B is correct: the token bucket lets unused tokens accumulate up to the bucket capacity, so a client can burst up to that size, then is throttled to the refill rate on average. A leaky bucket smooths to a constant rate and does not permit accumulated bursts; round-robin is a load-balancing/scheduling concept.",
      },
      {
        q: "What behavior most distinguishes a LEAKY bucket from a token bucket?",
        options: [
          "A. It permits larger bursts",
          "B. It produces a smooth, constant output rate regardless of bursty input, queueing or dropping the excess",
          "C. It never rejects requests",
          "D. It requires no configuration",
        ],
        answer: "B",
        explanation:
          "B is correct: a leaky bucket drains at a fixed rate, converting bursty input into a steady output (adding queueing delay and dropping on overflow). The token bucket is the one that permits bursts; leaky buckets do reject/drop when the queue overflows.",
      },
      {
        q: "What is the well-known flaw of the FIXED-window counter algorithm?",
        options: [
          "A. It cannot enforce any limit",
          "B. A client can send a full quota at the end of one window and another at the start of the next, briefly reaching up to 2x the intended rate",
          "C. It requires a distributed lock for every request",
          "D. It always over-counts by exactly one",
        ],
        answer: "B",
        explanation:
          "B is correct: because the counter resets on a hard window boundary, bursts straddling the boundary can hit nearly double the rate over a short span. The sliding-window approach fixes this by counting over a trailing window relative to now.",
      },
      {
        q: "In a horizontally scaled service with 8 servers, why must the rate-limit counter live in a shared store like Redis?",
        options: [
          "A. Redis is faster than any application language",
          "B. A per-server in-memory counter would let a client effectively multiply its limit by the number of servers",
          "C. Redis encrypts the counter",
          "D. It removes the need for a load balancer",
        ],
        answer: "B",
        explanation:
          "B is correct: if each of the 8 servers counts independently, a client spread across all of them gets up to 8x its intended limit. A shared, atomic counter (e.g., Redis INCR/Lua) enforces one global limit. Speed, encryption, and load balancing are not the reason.",
      },
      {
        q: "When implementing a distributed limiter in Redis, why are atomic operations (INCR with EXPIRE, or a Lua script) important?",
        options: [
          "A. They compress the stored counters",
          "B. They prevent race conditions where concurrent requests read-modify-write the counter and overshoot the limit",
          "C. They make the network hop unnecessary",
          "D. They eliminate clock skew between nodes",
        ],
        answer: "B",
        explanation:
          "B is correct: without atomicity, two concurrent requests can both read the same count, both increment, and both be allowed past the limit. Atomic INCR or a Lua script serializes the check-and-increment. They don't compress data, remove the network hop, or fix clock skew (a separate concern for windowing).",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "sd-consistent-hashing",
    title: "Consistent Hashing",
    shortLabel: "Consistent Hashing",
    section: "Scaling Patterns",
    domain: "SystemDesign",
    tldr:
      "Consistent hashing maps both keys and nodes onto the same circular hash space (the ring); a key belongs to the first node found clockwise. Adding or removing a node only remaps the keys in one arc — about K/N keys — instead of nearly all of them as with modulo-N hashing, which is what makes it ideal for elastic caches and sharded stores. Virtual nodes (many ring positions per physical node) spread load evenly and avoid hotspots.",
    subtopics: [
      {
        heading: "The problem with modulo hashing",
        bullets: [
          { icon: "➗", text: "Naive sharding uses `hash(key) % N`. When **N changes** (add/remove a node), **almost every key** maps to a different node — a catastrophic remap that cold-cache stampedes the database." },
          { icon: "🎯", text: "Consistent hashing's goal: when the node count changes, **remap as few keys as possible** — ideally only those the joining/leaving node is responsible for." },
        ],
      },
      {
        heading: "The ring",
        bullets: [
          { icon: "⭕", text: "Hash the output space into a **circle** (e.g. 0 … 2^32−1 wrapping around). Place each **node** on the ring by hashing its ID, and each **key** by hashing the key." },
          { icon: "➡️", text: "A key is owned by the **first node encountered going clockwise** from the key's position (its successor)." },
          { icon: "🔁", text: "**Add a node**: it takes over only the keys in the arc between it and its predecessor — its successor sheds that slice, everyone else is untouched. **Remove a node**: its keys move to the next node clockwise. Only **≈ K/N keys** move." },
        ],
      },
      {
        heading: "Virtual nodes & where it's used",
        bullets: [
          { icon: "👥", text: "**Virtual nodes**: give each physical node **many** positions on the ring (hash `nodeId#1`, `nodeId#2`, …). This evens out load, prevents one node owning a huge arc, and lets **heterogeneous** nodes get more vnodes for more capacity." },
          { icon: "🗄️", text: "Used in **distributed caches** (memcached client rings), **sharded databases / DHTs** (Amazon Dynamo, Cassandra, Riak), and **load balancers** to pin keys to backends stably." },
          { icon: "🔒", text: "Combine with **replication**: store each key on the next R distinct physical nodes clockwise for fault tolerance." },
        ],
      },
    ],
    keyFacts: [
      { label: "Keys remapped on scale", value: "≈ K/N (one arc)", icon: "🔁" },
      { label: "Key ownership", value: "First node clockwise", icon: "➡️" },
      { label: "Even load", value: "Virtual nodes per server", icon: "👥" },
      { label: "Used in", value: "Caches, DHTs, Dynamo/Cassandra", icon: "🗄️" },
    ],
    quickReference: {
      title: "Design cues",
      icon: "🎯",
      bullets: [
        "'Adding a cache node reshuffles almost all keys' → you're using **modulo hashing**; switch to **consistent hashing**.",
        "Ring rule: a key belongs to the **first node clockwise**.",
        "Scaling remaps only **≈ K/N keys** (one arc), not nearly all of them.",
        "'Load is lumpy / one node is a hotspot' → add **virtual nodes**.",
        "Bigger node → give it **more virtual nodes** to take proportionally more load.",
        "Foundational in **Dynamo, Cassandra, Riak**, and memcached client rings.",
      ],
      analogyBrief:
        "Consistent hashing is a clock face where servers stand at some hours and each data item is handed to the next server clockwise. Add a server and only the items between it and the previous server move — everyone else keeps their stuff.",
    },
    explanation:
      "Consistent hashing solves a specific scaling pain: how to distribute keys (cache entries, database rows, sessions) across a changing set of nodes without reshuffling almost everything each time the set changes. The naive approach, sharding by hash(key) % N, works fine while N is fixed, but the moment you add or remove a node — which elastic systems do constantly — N changes and the modulo result changes for nearly every key, so almost all data must move. For a cache that means a mass invalidation and a thundering-herd of misses that stampede the backing database; for a store it means an enormous, disruptive rebalance. Consistent hashing instead maps the hash function's entire output range onto a conceptual circle, or ring (for a 32-bit hash, the values 0 up to 2^32−1 with the top wrapping back to the bottom). Each node is placed on the ring at the position given by hashing its identifier, and each key is placed at the position given by hashing the key. A key is owned by the first node you encounter travelling clockwise from the key's position — that node is the key's successor. The elegance is in what happens on change: when a new node joins, it lands somewhere on the ring and becomes responsible only for the keys in the arc between itself and its predecessor (the node immediately counter-clockwise); its clockwise successor simply hands over that slice, and every other node is completely unaffected. When a node leaves, only the keys it owned move to the next node clockwise. In both cases only about K/N keys move (K keys across N nodes), rather than nearly all K. A practical problem remains: with only one position per node, a small number of nodes can divide the ring into very unequal arcs, so one node ends up owning far more keys than another (a hotspot), and removing a node dumps its entire load onto a single neighbor. The fix is virtual nodes: each physical node is hashed to many positions on the ring (by hashing nodeId#1, nodeId#2, and so on), so each physical node owns many small arcs scattered around the circle. This averages out the load, so ownership is much more uniform; it spreads a departing node's keys across many neighbors rather than one; and it lets you weight capacity — a bigger server is simply given more virtual nodes so it receives proportionally more keys. Consistent hashing is foundational in real systems: distributed cache client libraries (memcached ketama rings) use it so scaling the cache fleet doesn't evict everything, and sharded, peer-to-peer stores such as Amazon Dynamo, Apache Cassandra, and Riak use it to assign key ranges to nodes. It is commonly combined with replication by storing each key not just on its successor but on the next R distinct physical nodes clockwise, giving fault tolerance while preserving the minimal-movement property, and some load balancers use it (consistent hashing with bounded loads) to pin a client or key to the same backend stably even as backends come and go.",
    analogy:
      "Picture a giant round clock face, but instead of 12 hours it has billions of tiny tick marks. You station your servers at various points around the rim — one at 2 o'clock, one at 5, one at 9. Every piece of data is also a point on the rim, and the rule is dead simple: each item is looked after by the next server you reach going clockwise. Now add a fourth server at 7 o'clock. The only items that change hands are those sitting between 5 and 7 — they used to walk clockwise all the way to the 9 o'clock server, and now they stop at 7. Everything else stays exactly where it was; no mass migration. The catch is that if you only have three servers they might carve the clock into wildly uneven slices, so one is swamped. The trick is to clone each server into dozens of tiny stand-ins sprinkled all around the rim, so every real server ends up owning a fair, even scattering of the clock — and a powerful server just gets more stand-ins.",
    diagram: `<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Consistent hashing ring with nodes, keys, and clockwise ownership">${svgDefs}
      <circle cx="220" cy="150" r="110" fill="none" stroke="#30363d" stroke-width="2"/>
      <text x="220" y="150" text-anchor="middle" fill="#8b949e" font-size="10">hash ring</text>
      <text x="220" y="164" text-anchor="middle" fill="#8b949e" font-size="9">0 … 2^32-1 (wraps)</text>
      <!-- nodes -->
      <circle cx="220" cy="40" r="12" fill="#0ea5e9"/><text x="220" y="28" text-anchor="middle" fill="#0ea5e9" font-size="11" font-weight="700">N1</text>
      <circle cx="325" cy="200" r="12" fill="#0ea5e9"/><text x="352" y="205" fill="#0ea5e9" font-size="11" font-weight="700">N2</text>
      <circle cx="115" cy="200" r="12" fill="#0ea5e9"/><text x="80" y="205" fill="#0ea5e9" font-size="11" font-weight="700">N3</text>
      <!-- new node -->
      <circle cx="300" cy="75" r="12" fill="#22c55e"/><text x="322" y="70" fill="#22c55e" font-size="11" font-weight="700">N4</text>
      <!-- keys -->
      <circle cx="270" cy="52" r="6" fill="#ff9900"/>
      <circle cx="315" cy="130" r="6" fill="#ff9900"/>
      <circle cx="150" cy="250" r="6" fill="#ff9900"/>
      <text x="270" y="45" text-anchor="middle" fill="#ff9900" font-size="9">key</text>
      <!-- clockwise arrow -->
      <path d="M 260 46 A 60 60 0 0 1 296 62" fill="none" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="270" y="90" fill="#8b949e" font-size="9">→ owned by next node clockwise (N4)</text>
      <!-- explanation panel -->
      <rect x="400" y="55" width="300" height="190" rx="10" fill="#1a2332" stroke="#22c55e" stroke-dasharray="5 4"/>
      <text x="415" y="80" fill="#22c55e" font-size="11" font-weight="700">Add N4 → minimal remap</text>
      <text x="415" y="108" fill="#e6edf3" font-size="11">• A key = first node clockwise</text>
      <text x="415" y="132" fill="#e6edf3" font-size="11">• N4 takes ONLY the arc between</text>
      <text x="428" y="150" fill="#8b949e" font-size="11">its predecessor and itself</text>
      <text x="415" y="176" fill="#e6edf3" font-size="11">• N1, N2, N3 keep their keys</text>
      <text x="415" y="200" fill="#e6edf3" font-size="11">• Only ~K/N keys move</text>
      <text x="415" y="228" fill="#8b949e" font-size="11">• Virtual nodes even out load</text>
    </svg>`,
    diagramLegend: [
      { color: "#0ea5e9", label: "Nodes on the ring", description: "Each server is placed by hashing its ID (many positions via virtual nodes)." },
      { color: "#ff9900", label: "Keys", description: "Each key is owned by the first node clockwise from its hash position." },
      { color: "#22c55e", label: "Added node (N4)", description: "Takes over only its arc; only ≈ K/N keys move on scale-out." },
    ],
    codeExample: {
      language: "python",
      title: "Consistent hash ring with virtual nodes",
      code: `import hashlib
from bisect import bisect, insort

class HashRing:
    def __init__(self, vnodes=150):
        self.vnodes = vnodes              # replicas per physical node
        self.ring = {}                    # position -> node
        self.positions = []               # sorted ring positions

    def _hash(self, key):
        return int(hashlib.md5(key.encode()).hexdigest(), 16)

    def add_node(self, node):
        for i in range(self.vnodes):
            pos = self._hash(f"{node}#{i}")
            self.ring[pos] = node
            insort(self.positions, pos)   # keep positions sorted

    def get_node(self, key):
        if not self.ring:
            return None
        h = self._hash(key)
        # First node clockwise (wrap around at the end of the ring).
        idx = bisect(self.positions, h) % len(self.positions)
        return self.ring[self.positions[idx]]

ring = HashRing()
for n in ["cache-a", "cache-b", "cache-c"]:
    ring.add_node(n)
print(ring.get_node("user:42:session"))  # stable across scaling`,
    },
    codeExamples: [
      {
        language: "python",
        tab: "Hash ring",
        title: "Ring with virtual nodes and clockwise lookup",
        code: `import hashlib
from bisect import bisect, insort

class HashRing:
    def __init__(self, vnodes=150):
        self.vnodes = vnodes
        self.ring = {}                    # position -> node
        self.positions = []               # sorted positions

    def _hash(self, key):
        return int(hashlib.md5(key.encode()).hexdigest(), 16)

    def add_node(self, node):
        for i in range(self.vnodes):
            pos = self._hash(f"{node}#{i}")
            self.ring[pos] = node
            insort(self.positions, pos)

    def get_node(self, key):
        h = self._hash(key)
        idx = bisect(self.positions, h) % len(self.positions)
        return self.ring[self.positions[idx]]  # first node clockwise`,
      },
      {
        language: "python",
        tab: "Why modulo fails",
        title: "hash % N reshuffles almost everything when N changes",
        code: `keys = [f"user:{i}" for i in range(1000)]

def shard_modulo(key, n):
    return int.from_bytes(key.encode(), "big") % n

before = {k: shard_modulo(k, 4) for k in keys}   # 4 nodes
after  = {k: shard_modulo(k, 5) for k in keys}   # add 1 node -> 5

moved = sum(1 for k in keys if before[k] != after[k])
print(f"{moved}/1000 keys remapped")  # ~800 — a catastrophic reshuffle
# Consistent hashing would move only ~1000/5 = ~200 keys (one arc).`,
      },
      {
        language: "python",
        tab: "Remap on scale",
        title: "Adding a node moves only ~K/N keys",
        code: `ring = HashRing(vnodes=100)
for n in ["a", "b", "c", "d"]:
    ring.add_node(n)

keys = [f"key:{i}" for i in range(10000)]
before = {k: ring.get_node(k) for k in keys}

ring.add_node("e")                       # scale out 4 -> 5 nodes
after = {k: ring.get_node(k) for k in keys}

moved = sum(1 for k in keys if before[k] != after[k])
print(f"{moved}/10000 moved")            # ~2000 (≈ K/N), not ~8000`,
      },
    ],
    problemStatement:
      "A caching tier of 4 memcached nodes uses hash(key) % 4 to pick a node. Every time the ops team adds a node during peak traffic, the cache hit rate collapses to near zero for several minutes and the database is hammered by the resulting misses. Explain precisely why modulo hashing causes this, describe how a consistent-hashing ring would limit the disruption when the 5th node is added, and explain what virtual nodes add and why they matter if one node is far larger than the others.",
    questions: [
      {
        q: "Why does sharding with hash(key) % N cause a massive reshuffle when you add or remove a node?",
        options: [
          "A. The hash function becomes slower with more nodes",
          "B. Changing N changes the modulo result for nearly every key, so almost all keys map to a different node",
          "C. Modulo hashing corrupts the keys",
          "D. It only reshuffles keys that are prime numbers",
        ],
        answer: "B",
        explanation:
          "B is correct: the node index is hash(key) % N, and changing N alters that remainder for the vast majority of keys, forcing almost everything to move. It has nothing to do with hash speed, corruption, or prime keys.",
      },
      {
        q: "On a consistent-hashing ring, which node owns a given key?",
        options: [
          "A. The node with the numerically smallest hash",
          "B. The first node encountered moving clockwise from the key's position (its successor)",
          "C. A node chosen at random for load balancing",
          "D. Always the most recently added node",
        ],
        answer: "B",
        explanation:
          "B is correct: a key is owned by its successor — the first node clockwise from the key's hashed position on the ring. It's not the smallest hash, random, or the newest node.",
      },
      {
        q: "Approximately how many keys move when you add one node to a consistent-hashing ring of N nodes holding K keys?",
        options: [
          "A. About K (nearly all of them)",
          "B. About K/N (only the keys in the new node's arc)",
          "C. Exactly N keys",
          "D. Zero keys",
        ],
        answer: "B",
        explanation:
          "B is correct: only the keys in the arc the new node takes over — roughly K/N — move; every other node is untouched. Moving ~K keys is the modulo behavior consistent hashing specifically avoids.",
      },
      {
        q: "What is the main purpose of VIRTUAL nodes in consistent hashing?",
        options: [
          "A. To encrypt the keys in transit",
          "B. To give each physical node many ring positions so load is spread evenly and hotspots/uneven arcs are avoided",
          "C. To reduce the number of physical servers needed to one",
          "D. To guarantee strict global ordering of keys",
        ],
        answer: "B",
        explanation:
          "B is correct: assigning each physical node many positions on the ring breaks the space into many small arcs per node, evening out load and avoiding the situation where one node owns a huge arc. Virtual nodes are unrelated to encryption or ordering and don't reduce the server count.",
      },
      {
        q: "One server in the cluster has twice the capacity of the others. How do you make it take proportionally more load with consistent hashing?",
        options: [
          "A. Assign it more virtual nodes than the smaller servers",
          "B. Give it a shorter cache TTL",
          "C. Place it first in the configuration file",
          "D. Nothing — consistent hashing cannot weight nodes",
        ],
        answer: "A",
        explanation:
          "A is correct: because load is proportional to the number (and span) of ring positions a node owns, giving the larger server more virtual nodes makes it responsible for proportionally more keys. TTLs and config order don't affect ownership, and consistent hashing can absolutely weight nodes via vnode counts.",
      },
      {
        q: "In systems like Amazon Dynamo and Cassandra, how is consistent hashing typically combined with fault tolerance?",
        options: [
          "A. By storing each key only on its single successor node",
          "B. By replicating each key onto the next R distinct physical nodes clockwise on the ring",
          "C. By disabling virtual nodes",
          "D. By using modulo hashing as a backup",
        ],
        answer: "B",
        explanation:
          "B is correct: replication stores each key on its successor plus the next R−1 distinct physical nodes clockwise, so a node failure doesn't lose the data while preserving the minimal-movement property. Storing on a single node gives no redundancy, and neither disabling vnodes nor modulo hashing provides fault tolerance.",
      },
    ],
  },
];
