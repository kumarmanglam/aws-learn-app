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
// SECTION: Amazon S3 — Advanced & Security
// Lifecycle & analytics, event notifications, performance,
// encryption, and advanced security. Course slides ~p280–319.
// ============================================================
import { svgDefs, type Topic } from "./shared";

const box = (
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  sub: string,
  color = "#16a34a",
) => `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#243349" stroke="${color}"/>
  <text x="${x + w / 2}" y="${y + h / 2 - 2}" text-anchor="middle" fill="#e6edf3" font-size="12" font-weight="600">${title}</text>
  <text x="${x + w / 2}" y="${y + h / 2 + 15}" text-anchor="middle" fill="#8b949e" font-size="10">${sub}</text>
`;

export const s3AdvancedTopics: Topic[] = [
  // -----------------------------------------------------------------
  {
    id: "s3-lifecycle-analytics",
    title: "S3 Lifecycle Rules, Storage Class Analysis & Requester Pays",
    shortLabel: "S3 Lifecycle & Analytics",
    section: "Amazon S3 — Advanced & Security",
    domain: "Storage",
    tldr:
      "Lifecycle rules automate Transition actions (move to cheaper classes) and Expiration actions (delete objects/old versions/incomplete multipart uploads), scoped by prefix or tag. Storage Class Analysis recommends when to transition Standard→Standard-IA. Requester Pays shifts request+download cost to the (authenticated) requester.",
    subtopics: [
      {
        heading: "Lifecycle rules",
        bullets: [
          { icon: "➡️", text: "**Transition actions** move objects to another class (e.g. →Standard-IA after 60d, →Glacier after 6 months)." },
          { icon: "🗑️", text: "**Expiration actions** delete objects (e.g. logs after 365d), **old versions**, or **incomplete multipart uploads**." },
          { icon: "🎯", text: "Scope rules by **prefix** (mp3/*) or **object tags** (Department: Finance)." },
        ],
      },
      {
        heading: "Storage Class Analysis",
        bullets: [
          { icon: "📊", text: "Recommends **when to transition** Standard → Standard-IA (does **not** cover One-Zone-IA or Glacier)." },
          { icon: "🗓️", text: "Report updated **daily**; ~24–48h to start — a good first step before writing lifecycle rules." },
        ],
      },
      {
        heading: "Requester Pays",
        bullets: [
          { icon: "💳", text: "Normally the **owner** pays storage + transfer. With **Requester Pays**, the **requester** pays request + download cost." },
          { icon: "🔐", text: "Great for sharing **large datasets** across accounts; requester **must be authenticated** (not anonymous)." },
        ],
      },
    ],
    keyFacts: [
      { label: "Transition", value: "Move to cheaper class", icon: "➡️" },
      { label: "Expiration", value: "Delete objects/old versions", icon: "🗑️" },
      { label: "Analysis covers", value: "Standard → Standard-IA", icon: "📊" },
      { label: "Requester Pays", value: "Requester funds download", icon: "💳" },
    ],
    quickReference: {
      title: "Exam cues",
      icon: "🎯",
      bullets: [
        "'Auto-archive old data / delete logs' → **Lifecycle rules** (transition/expiration).",
        "'Clean up failed multipart uploads' → lifecycle **expiration** action.",
        "'When should I move to IA?' → **Storage Class Analysis**.",
        "'Share a big dataset but not pay for others' downloads' → **Requester Pays**.",
        "Lifecycle rules can target a **prefix** or **tag**.",
      ],
      analogyBrief:
        "Lifecycle rules are a self-cleaning archive: papers auto-move to the basement after months and shred themselves after years. Requester Pays is a library that charges the borrower for shipping.",
    },
    explanation:
      "S3 Lifecycle rules automate moving and deleting objects. Transition actions move objects to a cheaper storage class after a set time — for example, to Standard-IA 60 days after creation and to Glacier after six months. Expiration actions delete objects after a period — for example, access logs after 365 days — and can also delete old (noncurrent) versions when versioning is enabled, and clean up incomplete multipart uploads. Rules can be scoped to a specific prefix (like mp3/*) or to objects carrying certain tags (like Department: Finance). S3 Storage Class Analysis helps you decide when to transition objects, giving recommendations for Standard and Standard-IA (it does not work for One-Zone-IA or Glacier); its report is updated daily and takes about 24–48 hours to start producing data, making it a good first step before writing lifecycle rules. Finally, S3 Requester Pays changes who pays: normally the bucket owner pays all storage and data-transfer costs, but with a Requester Pays bucket the requester (rather than the owner) pays for the request and the data download — useful when you want to share large datasets with other accounts without absorbing their download costs. The requester must be authenticated in AWS (it cannot be anonymous).",
    analogy:
      "Lifecycle rules turn your storage into a self-managing archive room: documents automatically get boxed and sent to the cheaper basement after a few months (transition), and are shredded once they hit their retention limit (expiration) — you set the schedule once. Requester Pays is like a library that lends rare volumes but bills the borrower for the shipping, so the library isn't out of pocket every time someone far away requests a copy.",
    diagram: `<svg viewBox="0 0 720 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="S3 lifecycle transitions">${svgDefs}
      ${box(20, 85, 130, 50, "Standard", "day 0", "#22c55e")}
      <line x1="150" y1="110" x2="200" y2="110" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="150" y="100" fill="#8b949e" font-size="9">60 days</text>
      ${box(205, 85, 130, 50, "Standard-IA", "infrequent", "#3b82f6")}
      <line x1="335" y1="110" x2="385" y2="110" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="330" y="100" fill="#8b949e" font-size="9">6 months</text>
      ${box(390, 85, 130, 50, "Glacier", "archive", "#0891b2")}
      <line x1="520" y1="110" x2="570" y2="110" stroke="#ef4444" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="520" y="100" fill="#8b949e" font-size="9">365 days</text>
      ${box(575, 85, 120, 50, "Expire (delete)", "", "#ef4444")}
      <text x="360" y="180" text-anchor="middle" fill="#8b949e" font-size="10">Transition actions move classes; Expiration deletes</text>
    </svg>`,
    diagramLegend: [
      { color: "#22c55e", label: "Hot (Standard)", description: "New, frequently-accessed objects." },
      { color: "#0891b2", label: "Archive (Glacier)", description: "Transitioned for long-term low-cost storage." },
      { color: "#ef4444", label: "Expiration", description: "Automatic deletion after the retention period." },
    ],
    codeExample: {
      language: "json",
      title: "Lifecycle rule: IA at 60d, Glacier at 180d, expire at 365d",
      code: `{
  "Rules": [{
    "ID": "archive-and-expire",
    "Filter": { "Prefix": "logs/" },
    "Status": "Enabled",
    "Transitions": [
      { "Days": 60,  "StorageClass": "STANDARD_IA" },
      { "Days": 180, "StorageClass": "GLACIER" }
    ],
    "Expiration": { "Days": 365 },
    "AbortIncompleteMultipartUpload": { "DaysAfterInitiation": 7 }
  }]
}`,
    },
    problemStatement:
      "Your logs/ prefix grows forever and costs are rising: logs are read heavily for 60 days, occasionally for six months, almost never after that, and must be deleted at one year. There are also many stale incomplete multipart uploads wasting space. Design the lifecycle rule, and name the feature that would tell you the ideal moment to transition to Standard-IA.",
    questions: [
      {
        q: "Which lifecycle ACTION moves objects from S3 Standard to Glacier after a period?",
        options: ["A. Expiration action", "B. Transition action", "C. Replication rule", "D. Versioning"],
        answer: "B",
        explanation:
          "B is correct: Transition actions move objects to another storage class over time. Expiration deletes; replication copies; versioning tracks versions.",
      },
      {
        q: "You want to automatically delete incomplete multipart uploads that were never finished. What do you use?",
        options: [
          "A. A lifecycle expiration/abort rule for incomplete multipart uploads",
          "B. Storage Class Analysis",
          "C. Requester Pays",
          "D. A bucket policy",
        ],
        answer: "A",
        explanation:
          "A is correct: lifecycle rules can abort/expire incomplete multipart uploads after N days, reclaiming space. The others don't clean up partial uploads.",
      },
      {
        q: "S3 Storage Class Analysis provides transition recommendations for which classes?",
        options: [
          "A. Standard and Standard-IA",
          "B. One-Zone-IA and Glacier",
          "C. All classes including Deep Archive",
          "D. Intelligent-Tiering only",
        ],
        answer: "A",
        explanation:
          "A is correct: Storage Class Analysis recommends for Standard and Standard-IA; it does NOT cover One-Zone-IA or Glacier.",
      },
      {
        q: "You host a large public dataset and don't want to pay for others' download bandwidth. Which feature fits?",
        options: ["A. Requester Pays", "B. Transfer Acceleration", "C. CRR", "D. Intelligent-Tiering"],
        answer: "A",
        explanation:
          "A is correct: Requester Pays makes the (authenticated) requester pay request+download costs, ideal for sharing big datasets cross-account. The others don't shift cost to the requester.",
      },
      {
        q: "Lifecycle rules can be scoped to apply to only some objects using:",
        options: [
          "A. A prefix or object tags",
          "B. The object's version ID only",
          "C. The requester's IAM role",
          "D. The bucket's region",
        ],
        answer: "A",
        explanation:
          "A is correct: rules can target a prefix (e.g. mp3/*) or objects with specific tags (e.g. Department: Finance). Version IDs, IAM roles, and region aren't lifecycle scoping criteria.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "s3-event-notifications",
    title: "S3 Event Notifications & EventBridge",
    shortLabel: "S3 Event Notifications",
    section: "Amazon S3 — Advanced & Security",
    domain: "Storage",
    tldr:
      "S3 can emit events (ObjectCreated, ObjectRemoved, Replication…) on object changes, filtered by name (*.jpg), to SNS, SQS, or Lambda — each destination needs a resource policy allowing S3. Routing all events to Amazon EventBridge adds advanced JSON filtering, 18+ destinations, and archive/replay.",
    subtopics: [
      {
        heading: "Event notifications",
        bullets: [
          { icon: "🔔", text: "Events: **s3:ObjectCreated / ObjectRemoved / ObjectRestore / Replication…**, with name filtering (e.g. *.jpg)." },
          { icon: "🖼️", text: "Use case: generate **thumbnails** when images are uploaded. Create as many rules as you want." },
          { icon: "⏱️", text: "Typically deliver in **seconds** (can occasionally take a minute+)." },
        ],
      },
      {
        heading: "Direct targets & permissions",
        bullets: [
          { icon: "🎯", text: "Targets: **SNS**, **SQS**, **Lambda**." },
          { icon: "🔑", text: "Each target needs a **resource (access) policy** allowing S3 to publish/send/invoke (SNS/SQS access policy, Lambda resource policy)." },
        ],
      },
      {
        heading: "With Amazon EventBridge",
        bullets: [
          { icon: "🧩", text: "Send **all events** to **EventBridge** for **advanced JSON filtering** (metadata, size, name)." },
          { icon: "🔀", text: "Fan to **18+ AWS destinations** (Step Functions, Kinesis, Firehose…) with **archive, replay, reliable delivery**." },
        ],
      },
    ],
    keyFacts: [
      { label: "Direct targets", value: "SNS, SQS, Lambda", icon: "🎯" },
      { label: "Permissions", value: "Resource (access) policy on target", icon: "🔑" },
      { label: "EventBridge", value: "18+ destinations, replay", icon: "🧩" },
      { label: "Latency", value: "Usually seconds", icon: "⏱️" },
    ],
    quickReference: {
      title: "Exam cues",
      icon: "🎯",
      bullets: [
        "'Do X when an object is uploaded' → **S3 Event Notification** → SNS/SQS/Lambda.",
        "Events don't fire? Check the **target's resource policy** allows S3.",
        "Need **advanced filtering / many destinations / replay** → route to **EventBridge**.",
        "Filter events by object name (e.g. *.jpg).",
      ],
      analogyBrief:
        "Event notifications are a doorbell that rings a chosen chime (SNS/SQS/Lambda) when a package arrives; EventBridge is a smart hub that can ring dozens of different systems based on detailed rules.",
    },
    explanation:
      "S3 Event Notifications let you react to changes in a bucket. Events include s3:ObjectCreated, s3:ObjectRemoved, s3:ObjectRestore, and s3:Replication, and you can filter by object name (for example *.jpg). A classic use case is generating image thumbnails when photos are uploaded; you can create as many event rules as you want, and notifications typically arrive within seconds (though occasionally a minute or more). The direct destinations are Amazon SNS, Amazon SQS, and AWS Lambda — and importantly each destination must have a resource (access) policy that permits S3 to publish to the topic, send to the queue, or invoke the function (an SNS access policy, SQS access policy, or Lambda resource policy respectively). Alternatively, you can send all S3 events to Amazon EventBridge, which unlocks advanced filtering with JSON rules (on metadata, object size, name, and more), delivery to 18+ AWS service destinations such as Step Functions, Kinesis Data Streams, and Firehose, and EventBridge capabilities like archiving events, replaying them, and reliable delivery.",
    analogy:
      "S3 Event Notifications are a doorbell: when a package (object) is dropped off, it rings a chime you chose — maybe it pages an assistant (SQS), announces to a group (SNS), or triggers a robot to unpack it (Lambda). But the assistant has to have agreed to answer S3's ring (the target's resource policy). EventBridge is upgrading to a smart home hub that can trigger dozens of different systems based on detailed rules ('only ring for packages over 5kg from this sender'), and can even replay the day's doorbell events.",
    diagram: `<svg viewBox="0 0 720 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="S3 event notifications">${svgDefs}
      ${box(30, 85, 130, 55, "S3 bucket", "object created", "#16a34a")}
      <line x1="160" y1="112" x2="230" y2="60" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="160" y1="112" x2="230" y2="112" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="160" y1="112" x2="230" y2="164" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(235, 40, 110, 40, "SNS", "resource policy", "#e11d8f")}
      ${box(235, 92, 110, 40, "SQS", "access policy", "#e11d8f")}
      ${box(235, 144, 110, 40, "Lambda", "resource policy", "#f59e0b")}
      ${box(430, 85, 130, 55, "EventBridge", "all events", "#8b5cf6")}
      <line x1="160" y1="100" x2="428" y2="100" stroke="#8b949e" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#arrow-mute)"/>
      ${box(590, 85, 110, 55, "18+ targets", "replay/archive", "#3b82f6")}
      <line x1="560" y1="112" x2="588" y2="112" stroke="#8b5cf6" stroke-width="2" marker-end="url(#arrow)"/>
    </svg>`,
    diagramLegend: [
      { color: "#16a34a", label: "S3 bucket", description: "Emits events on object changes." },
      { color: "#e11d8f", label: "SNS / SQS / Lambda", description: "Direct targets; each needs a policy allowing S3." },
      { color: "#8b5cf6", label: "EventBridge", description: "Advanced filtering + 18+ destinations + replay." },
    ],
    codeExample: {
      language: "json",
      title: "SQS access policy allowing S3 to send messages",
      code: `{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Service": "s3.amazonaws.com" },
    "Action": "SQS:SendMessage",
    "Resource": "arn:aws:sqs:us-east-1:123456789012:MyQueue",
    "Condition": { "ArnLike": { "aws:SourceArn": "arn:aws:s3:::MyBucket" } }
  }]
}`,
    },
    problemStatement:
      "When users upload a *.jpg, a Lambda must generate a thumbnail; a separate audit team wants every object-created event fanned to Step Functions and Kinesis with the ability to replay a day's events. You configure the S3 → Lambda notification but the function never fires. Explain the likely permissions issue, and which approach gives the audit team advanced filtering and replay.",
    questions: [
      {
        q: "Which are valid DIRECT destinations for S3 Event Notifications?",
        options: ["A. SNS, SQS, and Lambda", "B. EC2 and RDS", "C. CloudFront and Route 53", "D. DynamoDB and Redshift"],
        answer: "A",
        explanation:
          "A is correct: S3 events can go directly to SNS, SQS, or Lambda (or to EventBridge). The others aren't direct S3 notification targets.",
      },
      {
        q: "You set up an S3 → Lambda notification but the function never runs. What is the MOST likely cause?",
        options: [
          "A. The bucket is versioned",
          "B. The Lambda's resource policy doesn't allow S3 to invoke it",
          "C. The object is too small",
          "D. EventBridge is disabled",
        ],
        answer: "B",
        explanation:
          "B is correct: each target needs a resource (access) policy allowing S3 to invoke/publish/send. Without the Lambda resource policy granting s3.amazonaws.com invoke permission, events silently fail.",
      },
      {
        q: "Which option provides ADVANCED event filtering (by size/metadata), 18+ destinations, and event replay?",
        options: [
          "A. Direct SQS notifications",
          "B. Routing S3 events to Amazon EventBridge",
          "C. Enabling versioning",
          "D. Requester Pays",
        ],
        answer: "B",
        explanation:
          "B is correct: sending events to EventBridge adds JSON-based advanced filtering, many destinations (Step Functions, Kinesis, Firehose…), and archive/replay. Direct SQS lacks that breadth; versioning/Requester Pays are unrelated.",
      },
      {
        q: "A common use case for S3 event notifications is:",
        options: [
          "A. Encrypting the bucket",
          "B. Generating image thumbnails when photos are uploaded",
          "C. Scaling an ASG",
          "D. Registering a domain",
        ],
        answer: "B",
        explanation:
          "B is correct: reacting to ObjectCreated to generate thumbnails is a canonical use. Encryption, ASG scaling, and domain registration aren't event-notification use cases.",
      },
      {
        q: "You want to trigger processing only for uploaded objects ending in .jpg. How?",
        options: [
          "A. Filter the event notification by object name suffix (*.jpg)",
          "B. Use a bucket policy",
          "C. Enable Transfer Acceleration",
          "D. Use Storage Class Analysis",
        ],
        answer: "A",
        explanation:
          "A is correct: S3 event notifications support object-name (prefix/suffix) filtering such as *.jpg. The others don't filter events by object name.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "s3-performance",
    title: "S3 Performance, Multi-Part, Batch Ops & Storage Lens",
    shortLabel: "S3 Performance & Ops",
    section: "Amazon S3 — Advanced & Security",
    domain: "Storage",
    tldr:
      "S3 scales to 3,500 writes & 5,500 reads per second per prefix (spread across prefixes for more). Speed uploads with Multi-Part (>100MB advised, >5GB required) and Transfer Acceleration (edge → private AWS network); speed/parallelize downloads with Byte-Range fetches. S3 Batch Operations act on many objects at once; Storage Lens analyzes usage org-wide.",
    subtopics: [
      {
        heading: "Baseline performance",
        bullets: [
          { icon: "🚀", text: "**3,500** PUT/COPY/POST/DELETE and **5,500** GET/HEAD **per second per prefix**; latency 100–200 ms." },
          { icon: "🗂️", text: "**No limit on prefixes** — spread across 4 prefixes → ~22,000 GET/HEAD per second." },
        ],
      },
      {
        heading: "Faster uploads & downloads",
        bullets: [
          { icon: "📦", text: "**Multi-Part Upload** — advised **> 100 MB**, required **> 5 GB**; parallelizes the upload." },
          { icon: "🌐", text: "**Transfer Acceleration** — upload to a nearby **edge location** that forwards over AWS's private network; combines with multi-part." },
          { icon: "🎯", text: "**Byte-Range Fetches** — request specific ranges to parallelize/resume downloads or fetch just a file's header." },
        ],
      },
      {
        heading: "Batch Operations & Storage Lens",
        bullets: [
          { icon: "🛠️", text: "**S3 Batch Operations** — bulk actions on existing objects (copy, encrypt, modify tags/ACLs, restore, invoke Lambda); manages retries/reports. Feed it with **S3 Inventory** + **Athena**." },
          { icon: "🔭", text: "**S3 Storage Lens** — analyze/optimize storage across the whole **Organization**; default dashboard; export metrics to S3." },
        ],
      },
    ],
    keyFacts: [
      { label: "Per-prefix writes", value: "3,500 /s", icon: "🚀" },
      { label: "Per-prefix reads", value: "5,500 /s", icon: "📖" },
      { label: "Multi-part", value: "advised >100MB, required >5GB", icon: "📦" },
      { label: "Org-wide analytics", value: "S3 Storage Lens", icon: "🔭" },
    ],
    quickReference: {
      title: "Exam cues",
      icon: "🎯",
      bullets: [
        "'Speed up large uploads' → **Multi-Part** (+ **Transfer Acceleration** across distance).",
        "'Speed/parallelize downloads or grab a file header' → **Byte-Range Fetches**.",
        "'More throughput' → **spread across prefixes** (3,500 write / 5,500 read each).",
        "'Bulk-encrypt/copy millions of existing objects' → **S3 Batch Operations** (+ Inventory/Athena).",
        "'Org-wide storage usage & cost insights' → **S3 Storage Lens**.",
      ],
      analogyBrief:
        "Multi-part is moving a house by sending furniture in many trucks at once; Transfer Acceleration is taking the express highway; byte-range fetch is grabbing just the chapters you need.",
    },
    explanation:
      "Amazon S3 scales automatically to very high request rates with 100–200ms latency. Per prefix, an application can achieve at least 3,500 PUT/COPY/POST/DELETE and 5,500 GET/HEAD requests per second, and because there is no limit on the number of prefixes, spreading reads evenly across four prefixes yields about 22,000 GET/HEAD per second. To speed uploads, Multi-Part Upload (recommended above 100MB and required above 5GB) splits a file into parts uploaded in parallel; Transfer Acceleration uploads to a nearby AWS edge location that then forwards the data over AWS's fast private network to the destination bucket, and it's compatible with multi-part upload. For downloads, S3 Byte-Range Fetches request specific byte ranges of an object to parallelize and add resilience to downloads, or to retrieve only part of a file (such as its header). S3 Batch Operations perform bulk actions on existing objects in a single request — modifying metadata/properties, copying objects between buckets, encrypting unencrypted objects, changing ACLs/tags, restoring from Glacier, or invoking a Lambda function per object — while managing retries, tracking progress, and generating reports; you typically build the object list with S3 Inventory and filter it using Athena. Finally, S3 Storage Lens helps you understand, analyze, and optimize storage across an entire AWS Organization, providing a default dashboard (and custom ones), 30 days of usage and activity metrics, and the ability to export metrics daily to an S3 bucket.",
    analogy:
      "Uploading a huge file with Multi-Part is like moving house by loading your furniture into many trucks that all drive at once, instead of one truck making repeated trips. Transfer Acceleration is putting those trucks on the express AWS highway from a nearby on-ramp (edge location) instead of crawling through public streets. A byte-range fetch is telling the movers 'just bring me the boxes from the kitchen' rather than the whole house. Batch Operations is hiring a crew to relabel or repackage every box in the warehouse in one job, and Storage Lens is the facilities manager's dashboard showing how full every warehouse in the company is.",
    diagram: `<svg viewBox="0 0 720 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="S3 performance">${svgDefs}
      <text x="20" y="24" fill="#ff9900" font-size="12" font-weight="700">Multi-Part Upload</text>
      ${box(20, 40, 90, 40, "Big file", "", "#8b949e")}
      ${box(140, 32, 60, 24, "part 1", "", "#3b82f6")}
      ${box(140, 62, 60, 24, "part 2", "", "#3b82f6")}
      ${box(140, 92, 60, 24, "part N", "", "#3b82f6")}
      <line x1="110" y1="60" x2="138" y2="44" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
      <line x1="110" y1="60" x2="138" y2="74" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
      <line x1="110" y1="60" x2="138" y2="104" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
      ${box(230, 45, 90, 50, "S3", "parallel", "#16a34a")}
      <line x1="200" y1="70" x2="228" y2="70" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="380" y="24" fill="#ff9900" font-size="12" font-weight="700">Transfer Acceleration</text>
      ${box(380, 45, 90, 45, "Client", "far away", "#8b949e")}
      ${box(490, 45, 90, 45, "Edge", "public www", "#8b5cf6")}
      ${box(600, 45, 90, 45, "S3 bucket", "private AWS", "#16a34a")}
      <line x1="470" y1="67" x2="488" y2="67" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="580" y1="67" x2="598" y2="67" stroke="#22c55e" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="20" y="150" fill="#ff9900" font-size="12" font-weight="700">Byte-Range Fetch</text>
      ${box(20, 165, 660, 40, "GET Range: bytes=0-999  |  bytes=1000-1999  |  ...  (parallel / resume / header-only)", "", "#3b82f6")}
    </svg>`,
    diagramLegend: [
      { color: "#3b82f6", label: "Parts / ranges", description: "Parallel upload parts or download byte-ranges." },
      { color: "#8b5cf6", label: "Edge location", description: "Transfer Acceleration entry point." },
      { color: "#16a34a", label: "S3 bucket", description: "Destination on AWS's private backbone." },
    ],
    codeExample: {
      language: "bash",
      title: "Enable Transfer Acceleration & do a byte-range fetch",
      code: `# Turn on Transfer Acceleration for a bucket
aws s3api put-bucket-accelerate-configuration \\
  --bucket my-bucket --accelerate-configuration Status=Enabled

# Fetch only the first 1000 bytes of an object (byte-range)
aws s3api get-object --bucket my-bucket --key big.bin \\
  --range bytes=0-999 head.bin`,
    },
    problemStatement:
      "A media company uploads 20GB video masters from a studio far from the bucket's Region (slow, sometimes failing), needs analysts to grab just the metadata header of each file quickly, and must encrypt 50 million already-stored unencrypted objects. Recommend the upload approach, the download technique for headers, and the service to bulk-encrypt existing objects.",
    questions: [
      {
        q: "Uploads of a 20GB file from a distant location are slow and sometimes fail. Which TWO S3 features best address this?",
        options: [
          "A. Multi-Part Upload + Transfer Acceleration",
          "B. Versioning + CRR",
          "C. Requester Pays + Storage Lens",
          "D. Byte-Range Fetch + Intelligent-Tiering",
        ],
        answer: "A",
        explanation:
          "A is correct: multi-part parallelizes and resumes the large upload (required >5GB), and Transfer Acceleration routes it over AWS's fast private network from a nearby edge. The others don't speed distant large uploads.",
      },
      {
        q: "You want to download only the header (first bytes) of large objects, or parallelize/resume big downloads. Which feature?",
        options: ["A. Byte-Range Fetches", "B. Multi-Part Upload", "C. Transfer Acceleration", "D. Batch Operations"],
        answer: "A",
        explanation:
          "A is correct: byte-range fetches request specific ranges — great for grabbing a header or parallelizing/resuming downloads. Multi-part/acceleration are upload-side; batch ops act on many objects.",
      },
      {
        q: "To encrypt 50 million EXISTING unencrypted objects in one managed job, use:",
        options: [
          "A. S3 Batch Operations (optionally driven by S3 Inventory + Athena)",
          "B. A lifecycle rule",
          "C. Transfer Acceleration",
          "D. Storage Lens",
        ],
        answer: "A",
        explanation:
          "A is correct: S3 Batch Operations performs bulk actions (including encrypting objects) at scale with retries/reports, often fed by S3 Inventory filtered via Athena. Lifecycle/acceleration/Lens don't bulk-encrypt.",
      },
      {
        q: "Roughly how many GET/HEAD requests per second can you achieve PER PREFIX in a bucket?",
        options: ["A. 100", "B. 5,500", "C. 500,000", "D. Unlimited with no prefixes"],
        answer: "B",
        explanation:
          "B is correct: about 5,500 GET/HEAD (and 3,500 write) per second per prefix; spread across prefixes to scale higher (e.g. ~22,000 across four).",
      },
      {
        q: "Which service gives organization-wide S3 usage and cost-optimization insights via dashboards?",
        options: ["A. S3 Storage Lens", "B. S3 Batch Operations", "C. Storage Class Analysis", "D. CloudFront"],
        answer: "A",
        explanation:
          "A is correct: S3 Storage Lens analyzes/optimizes storage across an entire AWS Organization with dashboards and exportable metrics. Batch Ops acts on objects; Storage Class Analysis is per-bucket transition advice; CloudFront is a CDN.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "s3-encryption",
    title: "S3 Encryption — SSE-S3, SSE-KMS, SSE-C & Client-Side",
    shortLabel: "S3 Encryption",
    section: "Amazon S3 — Advanced & Security",
    domain: "Security",
    tldr:
      "Four ways to encrypt S3 objects: SSE-S3 (AWS-managed keys, default on new objects), SSE-KMS (KMS keys — audit via CloudTrail, but counts against KMS quotas), SSE-C (you supply keys, HTTPS required), and client-side (you encrypt before upload). Enforce HTTPS with aws:SecureTransport; force encryption via bucket policy.",
    subtopics: [
      {
        heading: "Server-side encryption (SSE)",
        bullets: [
          { icon: "🔑", text: "**SSE-S3** — keys managed & owned by AWS, **AES-256**; **default on new buckets/objects** (header x-amz-server-side-encryption: AES256)." },
          { icon: "🗝️", text: "**SSE-KMS** — AWS KMS keys: **user control + CloudTrail audit**; header aws:kms. Uploads call GenerateDataKey, downloads call Decrypt → counts toward **KMS quota** (can throttle at high volume)." },
          { icon: "🔐", text: "**SSE-C** — **you provide the key** on every request (in headers); S3 does NOT store it; **HTTPS mandatory**." },
        ],
      },
      {
        heading: "Client-side encryption",
        bullets: [
          { icon: "🧑‍💻", text: "Encrypt/decrypt **yourself** (e.g. S3 Client-Side Encryption Library) before upload / after download; **you fully manage keys**." },
        ],
      },
      {
        heading: "Encryption in transit & forcing it",
        bullets: [
          { icon: "🌐", text: "In-flight = **SSL/TLS**; S3 exposes HTTP and HTTPS endpoints; **HTTPS recommended, required for SSE-C**." },
          { icon: "🚨", text: "**Force HTTPS**: bucket policy Deny when **aws:SecureTransport = false**. **Force encryption at upload**: Deny PutObject lacking the encryption header. (Bucket policies evaluate **before** Default Encryption.)" },
        ],
      },
    ],
    keyFacts: [
      { label: "Default encryption", value: "SSE-S3 (AES-256)", icon: "🔑" },
      { label: "Audit + control keys", value: "SSE-KMS (CloudTrail)", icon: "🗝️" },
      { label: "You hold the keys", value: "SSE-C (HTTPS required)", icon: "🔐" },
      { label: "Force HTTPS", value: "aws:SecureTransport = false → Deny", icon: "🚨" },
    ],
    quickReference: {
      title: "Pick the encryption",
      icon: "🎯",
      bullets: [
        "Default / simplest → **SSE-S3**.",
        "Need key control + **CloudTrail audit** / key rotation → **SSE-KMS** (watch KMS quotas).",
        "You must **own the keys** but let AWS encrypt → **SSE-C** (HTTPS only).",
        "Encrypt **before it ever reaches AWS** → **client-side**.",
        "Force TLS with **aws:SecureTransport**; force encryption via **bucket policy**.",
      ],
      analogyBrief:
        "SSE-S3 = the hotel locks your safe with their key; SSE-KMS = a key from the front desk with a signed log of every use; SSE-C = you bring your own padlock each visit; client-side = you lock the box before you even arrive.",
    },
    explanation:
      "You can encrypt S3 objects four ways. Server-side encryption with S3-managed keys (SSE-S3) uses keys handled, managed, and owned by AWS with AES-256, is requested with the header x-amz-server-side-encryption: AES256, and is enabled by default for new buckets and objects. Server-side encryption with AWS KMS keys (SSE-KMS) uses keys in AWS KMS so you get user control and an audit trail via CloudTrail (header aws:kms); note that uploading calls the KMS GenerateDataKey API and downloading calls Decrypt, both of which count toward your per-second KMS quota, so extremely high request volumes can be throttled (you can request a quota increase). Server-side encryption with customer-provided keys (SSE-C) lets you fully manage keys outside AWS: you provide the key in the HTTP headers on every request, S3 does not store the key, and HTTPS is mandatory. Client-side encryption means you encrypt data yourself (for example with the Amazon S3 Client-Side Encryption Library) before uploading and decrypt after downloading, managing the full key lifecycle. Separately, encryption in transit (SSL/TLS) is offered via S3's HTTPS endpoint (HTTP also exists); HTTPS is recommended and mandatory for SSE-C. You can force HTTPS with a bucket policy that denies requests when aws:SecureTransport is false, and force encryption at upload with a bucket policy that denies PutObject requests lacking the appropriate encryption header — and note bucket policies are evaluated before Default Encryption.",
    analogy:
      "Imagine storing a valuable box at a hotel. SSE-S3: the hotel locks it in their safe with their own master key — easy, but you don't hold the key. SSE-KMS: you use a key issued at the front desk, and every time it's used the desk writes it in a signed logbook (CloudTrail audit) — more control, but the desk can only issue so many keys per minute (KMS quota). SSE-C: you bring your own padlock and hand it over each time you access the box, but the hotel never keeps a copy. Client-side: you lock the box at home before you even walk into the hotel.",
    diagram: `<svg viewBox="0 0 720 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="S3 encryption options">${svgDefs}
      ${box(20, 60, 150, 60, "SSE-S3", "AWS keys · default", "#22c55e")}
      ${box(190, 60, 150, 60, "SSE-KMS", "KMS · CloudTrail audit", "#3b82f6")}
      ${box(360, 60, 150, 60, "SSE-C", "your key · HTTPS", "#8b5cf6")}
      ${box(530, 60, 160, 60, "Client-Side", "encrypt before upload", "#f59e0b")}
      <text x="360" y="30" text-anchor="middle" fill="#ff9900" font-size="12" font-weight="700">4 ways to encrypt S3 objects</text>
      <text x="360" y="165" text-anchor="middle" fill="#8b949e" font-size="10">In transit: HTTPS (required for SSE-C) · force via aws:SecureTransport</text>
      <text x="360" y="188" text-anchor="middle" fill="#8b949e" font-size="10">Force encryption-at-upload with a bucket policy (evaluated before Default Encryption)</text>
    </svg>`,
    diagramLegend: [
      { color: "#22c55e", label: "SSE-S3", description: "AWS-managed AES-256 keys; default." },
      { color: "#3b82f6", label: "SSE-KMS", description: "KMS keys; control + CloudTrail audit; quota-bound." },
      { color: "#8b5cf6", label: "SSE-C", description: "Customer-provided keys; HTTPS mandatory." },
    ],
    codeExample: {
      language: "bash",
      title: "Upload with SSE-KMS; enforce HTTPS via bucket policy",
      code: `# Upload an object encrypted with a specific KMS key
aws s3api put-object --bucket my-bucket --key data.csv --body data.csv \\
  --server-side-encryption aws:kms \\
  --ssekms-key-id alias/my-key

# Bucket policy snippet: deny any non-HTTPS request
# "Effect":"Deny","Action":"s3:GetObject",
# "Condition": { "Bool": { "aws:SecureTransport": "false" } }`,
    },
    problemStatement:
      "Compliance requires that every S3 object be encrypted at rest with keys your security team can audit and rotate, that no object can be uploaded unencrypted, and that all access use HTTPS. Which encryption option meets the 'audit + control keys' requirement (and what's its scaling caveat), and how do you enforce both encryption-at-upload and HTTPS-only?",
    questions: [
      {
        q: "Which S3 encryption option provides key control AND an audit trail of key usage via CloudTrail?",
        options: ["A. SSE-S3", "B. SSE-KMS", "C. SSE-C", "D. No encryption"],
        answer: "B",
        explanation:
          "B is correct: SSE-KMS uses AWS KMS keys, giving user control and CloudTrail auditing. SSE-S3 keys are fully AWS-managed (no per-use audit); SSE-C keys are customer-supplied but not KMS-audited.",
      },
      {
        q: "A very high-throughput app using SSE-KMS starts getting throttled. Why?",
        options: [
          "A. S3 has a hard object limit",
          "B. SSE-KMS calls GenerateDataKey/Decrypt, which count against KMS per-second quotas",
          "C. KMS disables encryption above 5GB",
          "D. HTTPS is rate-limited",
        ],
        answer: "B",
        explanation:
          "B is correct: each SSE-KMS upload/download calls KMS (GenerateDataKey/Decrypt) and counts toward the KMS request quota, which can throttle at scale (request a quota increase). The others are false.",
      },
      {
        q: "With SSE-C, where is the encryption key stored?",
        options: [
          "A. In AWS KMS",
          "B. In the bucket policy",
          "C. Nowhere in AWS — you provide it on every request over HTTPS",
          "D. In the object metadata",
        ],
        answer: "C",
        explanation:
          "C is correct: SSE-C keys are customer-provided in the request headers and never stored by S3; HTTPS is mandatory. KMS storage would be SSE-KMS; it's not in the policy or metadata.",
      },
      {
        q: "How do you FORCE that objects can only be uploaded if encrypted?",
        options: [
          "A. A bucket policy that denies PutObject requests missing the encryption header",
          "B. Enable versioning",
          "C. Turn on Transfer Acceleration",
          "D. Use One-Zone-IA",
        ],
        answer: "A",
        explanation:
          "A is correct: a bucket policy can deny PutObject when the encryption header is absent, forcing encryption at upload (evaluated before Default Encryption). The others don't enforce encryption.",
      },
      {
        q: "Which bucket-policy condition forces all requests to use HTTPS?",
        options: [
          "A. aws:SecureTransport = false → Deny",
          "B. s3:x-amz-acl = public",
          "C. aws:SourceIp = 0.0.0.0/0",
          "D. s3:prefix = secure/",
        ],
        answer: "A",
        explanation:
          "A is correct: deny requests when aws:SecureTransport is false to require HTTPS (encryption in transit). The others don't enforce TLS.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "s3-advanced-security",
    title: "S3 Advanced — CORS, MFA Delete, Access Points, Object Lock & More",
    shortLabel: "S3 Advanced Security",
    section: "Amazon S3 — Advanced & Security",
    domain: "Security",
    tldr:
      "CORS lets a browser on one origin call your bucket (needs Access-Control-Allow-Origin). MFA Delete protects versioned deletes/versioning changes. Pre-signed URLs grant temporary access. Glacier Vault Lock & S3 Object Lock give WORM compliance. Access Points and Object Lambda simplify and transform access at scale.",
    subtopics: [
      {
        heading: "CORS, MFA Delete & Access Logs",
        bullets: [
          { icon: "🌐", text: "**CORS** — a browser at one **origin** (scheme+host+port) calling another must get **Access-Control-Allow-Origin** from the bucket; common exam topic." },
          { icon: "🔐", text: "**MFA Delete** (versioning required, root only) — MFA to **permanently delete a version** or **suspend versioning** (not to enable versioning / list)." },
          { icon: "📝", text: "**Access Logs** — log all requests to another bucket (same Region); never set the log bucket = monitored bucket (infinite loop)." },
        ],
      },
      {
        heading: "Pre-signed URLs & WORM (Vault Lock / Object Lock)",
        bullets: [
          { icon: "🔗", text: "**Pre-signed URLs** — temporary access (console 1–720 min; CLI up to ~168h); inherit the creator's permissions. E.g. let logged-in users download a premium file." },
          { icon: "🔒", text: "**Glacier Vault Lock** & **S3 Object Lock** (versioning required) enforce **WORM** (Write Once Read Many). Object Lock modes: **Compliance** (nobody, even root, can delete) vs **Governance** (special perms can); **Retention Period** + **Legal Hold**." },
        ],
      },
      {
        heading: "Access Points & Object Lambda",
        bullets: [
          { icon: "🚪", text: "**Access Points** — each has its own DNS + policy for a bucket prefix, simplifying access at scale; can be VPC-only (via a VPC endpoint)." },
          { icon: "🧬", text: "**S3 Object Lambda** — run a Lambda to **transform the object on retrieval** (redact PII, convert formats, resize) using an Object Lambda Access Point." },
        ],
      },
    ],
    keyFacts: [
      { label: "Cross-origin browser calls", value: "CORS header", icon: "🌐" },
      { label: "MFA Delete needs", value: "Versioning + root", icon: "🔐" },
      { label: "WORM compliance", value: "Object Lock / Vault Lock", icon: "🔒" },
      { label: "Transform on read", value: "S3 Object Lambda", icon: "🧬" },
    ],
    quickReference: {
      title: "Exam cues",
      icon: "🎯",
      bullets: [
        "Browser 'CORS' error hitting S3 → set **Access-Control-Allow-Origin** on the bucket.",
        "'Extra protection against version deletes' → **MFA Delete** (root, versioning on).",
        "'Give a user temporary file access' → **Pre-signed URL**.",
        "'WORM / can't-be-deleted retention' → **Object Lock** (Compliance/Governance) or **Glacier Vault Lock**.",
        "'Redact/transform data per requester without copies' → **S3 Object Lambda**.",
      ],
      analogyBrief:
        "A pre-signed URL is a time-limited guest pass; Object Lock Compliance mode is a document safe even the CEO can't open early; Object Lambda is a redaction clerk who blacks out sensitive lines as a file leaves.",
    },
    explanation:
      "This topic gathers S3's advanced security and access features. CORS (Cross-Origin Resource Sharing) governs browser requests to a different origin (scheme + host + port); if a web page on one origin fetches assets from your S3 bucket, the bucket must return the correct CORS headers such as Access-Control-Allow-Origin (a very common exam question), and you can allow a specific origin or all. MFA Delete (which requires versioning and can only be enabled by the bucket owner/root) forces MFA to permanently delete an object version or suspend versioning, but not to enable versioning or list versions. S3 Access Logs record every request to the bucket into another bucket in the same Region — never point the log bucket at the monitored bucket itself, or you create an ever-growing loop. Pre-signed URLs grant temporary access to an object: they can be generated in the console (1 minute to 720 minutes), CLI, or SDK (up to about 168 hours), and the recipient inherits the URL creator's permissions for GET or PUT — for instance letting only logged-in users download a premium video. For compliance, both S3 Glacier Vault Lock and S3 Object Lock enforce a WORM (Write Once Read Many) model: Object Lock (which needs versioning) has two retention modes — Compliance, where no one including the root user can overwrite or delete a version for the retention period, and Governance, where most users can't but some with special permissions can — plus a Retention Period and an independent Legal Hold. S3 Access Points simplify security at scale by giving each access point its own DNS name and policy for a slice of a bucket (and can be restricted to a VPC via a VPC endpoint). Finally, S3 Object Lambda uses a Lambda function to transform an object as it's retrieved — redacting personally identifiable information, converting formats (XML→JSON), or resizing images — using an S3 Object Lambda Access Point in front of a supporting access point, so only one copy of the data is stored.",
    analogy:
      "A pre-signed URL is a time-limited guest pass to grab one specific item and nothing else. MFA Delete is requiring a second key from a keycard before anyone can permanently shred a file. Object Lock in Compliance mode is a legal document safe that even the CEO cannot open until the retention timer expires. S3 Object Lambda is a redaction clerk stationed at the exit who blacks out sensitive lines on each document as it leaves — different visitors can be handed differently-redacted copies, all from the same original in the vault.",
    diagram: `<svg viewBox="0 0 720 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="S3 object lambda and access points">${svgDefs}
      ${box(20, 40, 120, 45, "App / user", "request", "#8b949e")}
      ${box(180, 40, 150, 45, "Object Lambda AP", "transform on read", "#8b5cf6")}
      <line x1="140" y1="62" x2="178" y2="62" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(370, 40, 130, 45, "Lambda", "redact/convert", "#f59e0b")}
      <line x1="330" y1="62" x2="368" y2="62" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(540, 40, 150, 45, "S3 bucket", "one original", "#16a34a")}
      <line x1="500" y1="62" x2="538" y2="62" stroke="#22c55e" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(20, 120, 210, 45, "Pre-signed URL", "temporary, inherits perms", "#3b82f6")}
      ${box(255, 120, 210, 45, "Object Lock (WORM)", "Compliance / Governance", "#ef4444")}
      ${box(490, 120, 200, 45, "MFA Delete", "version delete / suspend", "#e11d8f")}
    </svg>`,
    diagramLegend: [
      { color: "#8b5cf6", label: "Object Lambda AP", description: "Runs a Lambda to transform objects on retrieval." },
      { color: "#ef4444", label: "Object Lock (WORM)", description: "Compliance/Governance retention + legal hold." },
      { color: "#3b82f6", label: "Pre-signed URL", description: "Time-limited access inheriting creator permissions." },
    ],
    codeExample: {
      language: "bash",
      title: "Generate a pre-signed URL & set a CORS rule",
      code: `# Temporary download link (valid 1 hour) - recipient needs no AWS creds
aws s3 presign s3://my-bucket/premium/video.mp4 --expires-in 3600

# CORS config (allow a specific origin to GET objects)
# { "CORSRules": [{ "AllowedOrigins": ["https://www.example.com"],
#                   "AllowedMethods": ["GET"], "AllowedHeaders": ["*"] }] }`,
    },
    problemStatement:
      "A single-page app hosted at https://app.example.com loads images from your S3 bucket and the browser console shows a CORS error. Separately, regulators require that audit logs be stored so that no one — not even the root user — can delete them for 7 years, and analysts must receive a version of customer files with PII redacted without you duplicating the data. Which S3 features solve each requirement?",
    questions: [
      {
        q: "A browser at https://app.example.com fails to load images from your S3 bucket with a CORS error. The fix is to:",
        options: [
          "A. Make the bucket public",
          "B. Configure CORS on the bucket to allow the origin (Access-Control-Allow-Origin)",
          "C. Enable versioning",
          "D. Add a pre-signed URL",
        ],
        answer: "B",
        explanation:
          "B is correct: cross-origin browser requests require the bucket to return CORS headers allowing that origin. Making the bucket public, versioning, or pre-signed URLs don't resolve a CORS policy issue.",
      },
      {
        q: "Which S3 Object Lock mode prevents ANYONE, including the root user, from deleting a version during the retention period?",
        options: ["A. Governance mode", "B. Compliance mode", "C. Legal Hold only", "D. Standard mode"],
        answer: "B",
        explanation:
          "B is correct: Compliance mode blocks deletion/overwrite by everyone including root for the retention period. Governance mode allows privileged users to override; Legal Hold is a separate indefinite flag.",
      },
      {
        q: "You need to give a logged-in user temporary permission to download one private object without AWS credentials. Use:",
        options: ["A. A pre-signed URL", "B. A public bucket policy", "C. MFA Delete", "D. An Access Point"],
        answer: "A",
        explanation:
          "A is correct: a pre-signed URL grants time-limited access to a specific object, inheriting the creator's permissions. A public policy over-exposes; MFA Delete and Access Points don't provide per-user temporary object links.",
      },
      {
        q: "To have S3 return a PII-redacted version of objects on retrieval WITHOUT storing a second copy, use:",
        options: ["A. S3 Object Lambda", "B. CRR", "C. Storage Lens", "D. Requester Pays"],
        answer: "A",
        explanation:
          "A is correct: S3 Object Lambda runs a Lambda to transform (e.g. redact) the object as it's retrieved, keeping a single stored original. The others don't transform objects on read.",
      },
      {
        q: "Which is a requirement/behavior of MFA Delete?",
        options: [
          "A. It works without versioning",
          "B. Versioning must be enabled and only the root/bucket owner can enable MFA Delete",
          "C. It requires MFA to enable versioning",
          "D. Any IAM user can turn it on",
        ],
        answer: "B",
        explanation:
          "B is correct: MFA Delete requires versioning and can only be enabled by the root/bucket owner; MFA is needed to permanently delete a version or suspend versioning (not to enable versioning or list). A, C, and D are false.",
      },
    ],
  },
];
