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
// SECTION: High Availability & Scalability
// Covers ELB (CLB/ALB/NLB/GWLB), stickiness/SSL, and Auto Scaling Groups.
// Course slides ~p118–160.
// ============================================================
import { svgDefs, type Topic } from "./shared";

const box = (
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  sub: string,
  color = "#ff9900",
) => `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#243349" stroke="${color}"/>
  <text x="${x + w / 2}" y="${y + h / 2 - 2}" text-anchor="middle" fill="#e6edf3" font-size="12" font-weight="600">${title}</text>
  <text x="${x + w / 2}" y="${y + h / 2 + 15}" text-anchor="middle" fill="#8b949e" font-size="10">${sub}</text>
`;

export const haScalingTopics: Topic[] = [
  // -----------------------------------------------------------------
  {
    id: "scalability-high-availability",
    title: "Scalability & High Availability",
    shortLabel: "Scalability & HA",
    section: "High Availability & Scalability",
    domain: "Compute",
    tldr:
      "Scalability lets a system handle more load — vertically (a bigger instance) or horizontally (more instances). High Availability means running across at least 2 Availability Zones to survive a data-center loss. They're linked but distinct.",
    subtopics: [
      {
        heading: "Vertical Scalability (scale up / down)",
        bullets: [
          { icon: "⬆️", text: "Increase the **size** of a single instance (t2.micro → t2.large, up to u-12tb1.metal with 12.3 TB RAM / 448 vCPUs)." },
          { icon: "🗄️", text: "Common for **non-distributed** systems like databases — **RDS** and **ElastiCache** scale vertically." },
          { icon: "🧱", text: "There is always a **hardware limit** to how big one machine can get." },
        ],
      },
      {
        heading: "Horizontal Scalability (scale out / in) = elasticity",
        bullets: [
          { icon: "➕", text: "Increase the **number** of instances — implies a **distributed** system." },
          { icon: "🌐", text: "The default for modern web apps; easy on the cloud via **EC2 + ASG + Load Balancer**." },
        ],
      },
      {
        heading: "High Availability (HA)",
        bullets: [
          { icon: "🏢", text: "Run the app across **≥ 2 Availability Zones** to survive an AZ/data-center failure." },
          { icon: "😴", text: "**Passive** HA — e.g. RDS Multi-AZ standby." },
          { icon: "🏃", text: "**Active** HA — horizontal scaling behind a load balancer across AZs." },
        ],
      },
    ],
    keyFacts: [
      { label: "Vertical scaling", value: "Bigger instance (up/down)", icon: "⬆️" },
      { label: "Horizontal scaling", value: "More instances (out/in)", icon: "➕" },
      { label: "HA minimum", value: "≥ 2 Availability Zones", icon: "🏢" },
      { label: "Scales vertically", value: "RDS, ElastiCache", icon: "🗄️" },
    ],
    quickReference: {
      title: "Exam cues",
      icon: "🎯",
      bullets: [
        "**Scale up/down** = vertical; **scale out/in** = horizontal.",
        "**Elasticity** = automatic horizontal scaling to match demand.",
        "HA is about **surviving failure**, not (directly) handling more load.",
        "Databases usually scale **vertically**; stateless web tiers **horizontally**.",
      ],
      analogyBrief:
        "Vertical = hire a stronger worker; horizontal = hire more workers; HA = staff a second office so one closing never stops business.",
    },
    explanation:
      "Scalability means an application can handle greater load by adapting. Vertical scalability increases the size of a single instance (scale up) and is typical for databases and caches like RDS and ElastiCache, but it hits a hardware ceiling. Horizontal scalability (elasticity) adds more instances and requires a distributed design — the norm for web tiers, made easy by EC2, Auto Scaling Groups, and load balancers. High Availability is related but separate: it means running across at least two Availability Zones so the loss of a data center doesn't take you down. HA can be passive (a standby, like RDS Multi-AZ) or active (many instances across AZs behind a load balancer).",
    analogy:
      "Think of a call center. Vertical scaling is replacing a junior operator with a senior one who handles more calls. Horizontal scaling is hiring more operators. High availability is opening a second call center in another city so that if one building loses power, customers are still answered.",
    diagram: `<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Scalability and HA">${svgDefs}
      <text x="30" y="30" fill="#ff9900" font-size="13" font-weight="700">Vertical</text>
      ${box(30, 45, 70, 45, "t2.micro", "small", "#8b949e")}
      <line x1="110" y1="67" x2="150" y2="67" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(160, 35, 90, 65, "t2.large", "bigger", "#ff9900")}
      <text x="300" y="30" fill="#ff9900" font-size="13" font-weight="700">Horizontal</text>
      ${box(300, 45, 55, 45, "EC2", "", "#ff9900")}
      <line x1="360" y1="67" x2="390" y2="67" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(400, 45, 45, 45, "EC2", "", "#ff9900")}
      ${box(452, 45, 45, 45, "EC2", "", "#ff9900")}
      ${box(504, 45, 45, 45, "EC2", "", "#ff9900")}
      <text x="30" y="150" fill="#ff9900" font-size="13" font-weight="700">High Availability (multi-AZ)</text>
      <rect x="30" y="165" width="300" height="110" rx="10" fill="#1a2332" stroke="#3b82f6" stroke-dasharray="4 4"/>
      <text x="45" y="185" fill="#3b82f6" font-size="11">Availability Zone A</text>
      ${box(45, 195, 120, 55, "EC2 x N", "active", "#ff9900")}
      <rect x="360" y="165" width="300" height="110" rx="10" fill="#1a2332" stroke="#3b82f6" stroke-dasharray="4 4"/>
      <text x="375" y="185" fill="#3b82f6" font-size="11">Availability Zone B</text>
      ${box(375, 195, 120, 55, "EC2 x N", "active", "#ff9900")}
    </svg>`,
    diagramLegend: [
      { color: "#ff9900", label: "Instance / capacity", description: "Compute you add either by size (vertical) or count (horizontal)." },
      { color: "#3b82f6", label: "Availability Zone", description: "Distinct data center; HA needs at least two." },
    ],
    codeExample: {
      language: "bash",
      title: "Vertical scale: resize an EC2 instance (must be stopped)",
      code: `# 1) Stop the instance
aws ec2 stop-instances --instance-ids i-0123456789abcdef0

# 2) Change the instance type (vertical scaling)
aws ec2 modify-instance-attribute \\
  --instance-id i-0123456789abcdef0 \\
  --instance-type "{\\"Value\\": \\"t3.large\\"}"

# 3) Start it again
aws ec2 start-instances --instance-ids i-0123456789abcdef0`,
    },
    problemStatement:
      "Your monolithic reporting database on RDS is CPU-bound during month-end close, while your stateless web API sees unpredictable traffic spikes. Management wants zero-downtime resilience if an AWS data center fails. For each tier, decide whether to scale vertically or horizontally, and describe the minimum architecture that also delivers high availability.",
    questions: [
      {
        q: "A single-node RDS database is CPU-bound. Which action is an example of VERTICAL scaling?",
        options: [
          "A. Add two RDS read replicas",
          "B. Change the DB instance class from db.t3.medium to db.r6g.2xlarge",
          "C. Put the database behind a load balancer",
          "D. Deploy the database in a second AZ",
        ],
        answer: "B",
        explanation:
          "B is correct: increasing the instance size (up/down) is vertical scaling — the standard approach for non-distributed databases. A is horizontal read scaling. C isn't how databases are fronted. D adds availability, not capacity.",
      },
      {
        q: "What is the MINIMUM requirement for a system to be considered highly available?",
        options: [
          "A. Running in two AWS Regions",
          "B. Running on the largest available instance type",
          "C. Running across at least two Availability Zones",
          "D. Enabling Auto Scaling",
        ],
        answer: "C",
        explanation:
          "C is correct: HA means surviving a data-center (AZ) loss, so you need at least two AZs. A is disaster recovery / multi-region, beyond the minimum. B is vertical scaling. D helps elasticity but a single-AZ ASG is not highly available.",
      },
      {
        q: "'Elasticity' most directly refers to which capability?",
        options: [
          "A. Encrypting data at rest automatically",
          "B. Automatically adding/removing instances to match demand",
          "C. Replicating a database synchronously",
          "D. Increasing EBS volume size online",
        ],
        answer: "B",
        explanation:
          "B is correct: elasticity is automatic horizontal scaling (scale out/in) to track load. A is security. C is HA/durability. D is vertical storage scaling.",
      },
      {
        q: "Which pair of AWS services is typically scaled VERTICALLY rather than horizontally?",
        options: [
          "A. EC2 web servers and ALB",
          "B. RDS and ElastiCache",
          "C. S3 and DynamoDB",
          "D. Lambda and SQS",
        ],
        answer: "B",
        explanation:
          "B is correct: RDS and ElastiCache are commonly scaled vertically (bigger node), with read replicas as a secondary lever. A scales horizontally. C and D scale horizontally/automatically and aren't 'sized' like an instance.",
      },
      {
        q: "An RDS Multi-AZ deployment keeps a standby that only takes over on failure. This is an example of:",
        options: [
          "A. Active high availability",
          "B. Passive high availability",
          "C. Vertical scaling",
          "D. Horizontal read scaling",
        ],
        answer: "B",
        explanation:
          "B is correct: the standby is idle until failover — passive HA. Active HA (A) serves traffic from all nodes simultaneously. C and D are about capacity, not availability.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "elastic-load-balancing",
    title: "Elastic Load Balancing — Concepts & Types",
    shortLabel: "Elastic Load Balancing",
    section: "High Availability & Scalability",
    domain: "Networking",
    tldr:
      "A load balancer spreads traffic across many downstream targets, exposes a single DNS entry point, and uses health checks to route only to healthy instances. AWS offers 4 managed types: CLB, ALB, NLB, and GWLB.",
    subtopics: [
      {
        heading: "Why use a (managed) load balancer",
        bullets: [
          { icon: "⚖️", text: "Spread load across instances and expose a **single DNS** point of access." },
          { icon: "🩺", text: "**Health checks** stop traffic to unhealthy instances; seamlessly handle failures." },
          { icon: "🔒", text: "Provide **SSL/TLS termination**, stickiness, and separate public from private traffic." },
          { icon: "☁️", text: "**Managed** by AWS (upgrades, maintenance, HA); integrates with EC2, ASG, ECS, ACM, WAF, Route 53, Global Accelerator." },
        ],
      },
      {
        heading: "Health checks",
        bullets: [
          { icon: "📍", text: "Done on a **port + route** (e.g. /health); non-**200** response = unhealthy." },
          { icon: "🔁", text: "Let the LB know which targets can currently reply to requests." },
        ],
      },
      {
        heading: "The 4 managed load balancer types",
        bullets: [
          { icon: "🕰️", text: "**CLB** (2009, old gen) — HTTP/HTTPS/TCP/SSL." },
          { icon: "🌐", text: "**ALB** (2016, L7) — HTTP/HTTPS/WebSocket, routing rules." },
          { icon: "⚡", text: "**NLB** (2017, L4) — TCP/UDP/TLS, ultra-high performance, static IP." },
          { icon: "🛡️", text: "**GWLB** (2020, L3) — routes IP packets to 3rd-party appliances (GENEVE 6081)." },
        ],
      },
    ],
    keyFacts: [
      { label: "Layer 7 LB", value: "Application (ALB)", icon: "🌐" },
      { label: "Layer 4 LB", value: "Network (NLB) — TCP/UDP", icon: "⚡" },
      { label: "Layer 3 LB", value: "Gateway (GWLB) — IP", icon: "🛡️" },
      { label: "Health check", value: "Port + route, expect 200", icon: "🩺" },
    ],
    quickReference: {
      title: "Choosing a load balancer",
      icon: "🧭",
      bullets: [
        "HTTP routing / microservices / containers → **ALB**.",
        "Extreme performance, TCP/UDP, or **static/Elastic IP** → **NLB**.",
        "Inline 3rd-party firewall / IDS / IPS appliances → **GWLB**.",
        "Prefer **new-gen** (ALB/NLB) over CLB for new work.",
        "Internal (private) or internet-facing (public) LBs both exist.",
      ],
      analogyBrief:
        "A load balancer is the restaurant host who greets every guest at one door and seats them at whichever table is free and staffed.",
    },
    explanation:
      "Load balancers are servers that forward traffic to multiple downstream servers (e.g. EC2 instances). They spread load, expose a single DNS entry point, seamlessly handle instance failures via health checks, provide SSL termination and stickiness, and give high availability across AZs. AWS's Elastic Load Balancing is a managed service: AWS guarantees uptime and handles maintenance, in exchange for a few configuration knobs. Health checks run on a port and route (like /health) and treat any non-200 response as unhealthy. There are four kinds: Classic (CLB, legacy), Application (ALB, Layer 7 HTTP), Network (NLB, Layer 4 TCP/UDP with a static IP per AZ), and Gateway (GWLB, Layer 3 for chaining 3rd-party network appliances).",
    analogy:
      "A load balancer is like the maître d' at a busy restaurant: guests arrive at one entrance (single DNS), and the host seats each at any open, staffed table (healthy instance). If a section closes (instance fails), the host simply stops seating there — guests never notice.",
    diagram: `<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="ELB fan-out with health checks">${svgDefs}
      ${box(30, 120, 90, 55, "Users", "single DNS", "#8b949e")}
      <line x1="120" y1="147" x2="250" y2="147" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <rect x="255" y="110" width="120" height="75" rx="10" fill="#6b46c1" stroke="#ff9900"/>
      <text x="315" y="145" text-anchor="middle" fill="#fff" font-size="12" font-weight="700">Elastic Load</text>
      <text x="315" y="162" text-anchor="middle" fill="#fff" font-size="12" font-weight="700">Balancer</text>
      <line x1="375" y1="130" x2="520" y2="70" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="375" y1="147" x2="520" y2="147" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="375" y1="164" x2="520" y2="225" stroke="#8b949e" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#arrow-mute)"/>
      ${box(525, 45, 150, 50, "EC2 (healthy)", "200 OK", "#22c55e")}
      ${box(525, 122, 150, 50, "EC2 (healthy)", "200 OK", "#22c55e")}
      ${box(525, 200, 150, 50, "EC2 (unhealthy)", "no traffic", "#ef4444")}
    </svg>`,
    diagramLegend: [
      { color: "#6b46c1", label: "Load balancer", description: "Managed ELB — single DNS, health checks, SSL." },
      { color: "#22c55e", label: "Healthy target", description: "Passed the health check → receives traffic." },
      { color: "#ef4444", label: "Unhealthy target", description: "Failed the check → traffic withheld." },
    ],
    codeExample: {
      language: "bash",
      title: "Create a target group with an HTTP health check",
      code: `aws elbv2 create-target-group \\
  --name web-tg \\
  --protocol HTTP --port 80 \\
  --vpc-id vpc-0abc123 \\
  --health-check-protocol HTTP \\
  --health-check-path /health \\
  --healthy-threshold 3 \\
  --unhealthy-threshold 3 \\
  --matcher HttpCode=200`,
    },
    problemStatement:
      "A team runs three EC2 instances serving the same HTTP API but hands clients a single instance's public IP, causing outages when that instance fails. They want one stable entry point, automatic removal of failed instances, and HTTPS. Which AWS service solves this, and what specifically must you configure for failures to be handled automatically?",
    questions: [
      {
        q: "Which is NOT a benefit of using an Elastic Load Balancer?",
        options: [
          "A. Single point of access (DNS) to the application",
          "B. Automatic removal of unhealthy instances via health checks",
          "C. Guaranteeing each instance processes an equal number of bytes forever",
          "D. SSL/TLS termination",
        ],
        answer: "C",
        explanation:
          "C is correct as the odd one out: ELB distributes load but makes no guarantee of exactly-equal lifetime byte counts (stickiness/keep-alive can skew it). A, B, and D are all core ELB benefits.",
      },
      {
        q: "An ELB health check returns HTTP 302 from /health. How does the load balancer treat the target by default?",
        options: [
          "A. Healthy — 3xx is a success",
          "B. Unhealthy — only the configured success matcher (e.g. 200) passes",
          "C. Healthy — any response means the port is open",
          "D. It ignores HTTP checks and uses TCP only",
        ],
        answer: "B",
        explanation:
          "B is correct: a health check passes only when the response matches the configured code (200 by default). A 302 fails unless you widen the matcher. A and C are wrong; D isn't the default for HTTP checks.",
      },
      {
        q: "Which load balancer operates at Layer 3 and is used to insert 3rd-party firewall/IDS appliances inline?",
        options: ["A. CLB", "B. ALB", "C. NLB", "D. GWLB"],
        answer: "D",
        explanation:
          "D is correct: the Gateway Load Balancer works at Layer 3 (IP packets), using GENEVE on port 6081 to route through virtual appliances. CLB/ALB are L7, NLB is L4.",
      },
      {
        q: "For a brand-new HTTP microservices platform, which load balancer does AWS recommend over the Classic Load Balancer?",
        options: [
          "A. Application Load Balancer",
          "B. Classic Load Balancer with TCP listeners",
          "C. Gateway Load Balancer",
          "D. No load balancer; use Elastic IPs",
        ],
        answer: "A",
        explanation:
          "A is correct: the ALB (L7) is the modern choice for HTTP/microservices/containers with rich routing. CLB is legacy. GWLB is for appliances. Elastic IPs don't provide balancing/health checks.",
      },
      {
        q: "You need to restrict backend EC2 instances so they accept traffic ONLY from the load balancer. What is the cleanest way?",
        options: [
          "A. Open the instance security group to 0.0.0.0/0 on port 80",
          "B. Reference the load balancer's security group as the source in the instances' security group",
          "C. Give every instance an Elastic IP",
          "D. Disable health checks",
        ],
        answer: "B",
        explanation:
          "B is correct: set the instance SG inbound rule's source to the LB's security group ID, so only the LB can reach them. A is wide open. C and D don't restrict access.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "clb-alb",
    title: "Classic & Application Load Balancers (CLB, ALB)",
    shortLabel: "CLB & ALB",
    section: "High Availability & Scalability",
    domain: "Networking",
    tldr:
      "The ALB (v2, Layer 7) is AWS's modern HTTP load balancer: it routes to target groups by path, hostname, headers, or query string, supports HTTP/2 & WebSocket, and is ideal for microservices and containers. The CLB (v1) is the legacy generation.",
    subtopics: [
      {
        heading: "Classic Load Balancer (v1, legacy)",
        bullets: [
          { icon: "🕰️", text: "Supports **TCP (L4)** and **HTTP/HTTPS (L7)**; health checks are TCP or HTTP." },
          { icon: "🔗", text: "Fixed hostname XXX.region.elb.amazonaws.com. Supports only **one SSL certificate**." },
        ],
      },
      {
        heading: "Application Load Balancer (v2, Layer 7)",
        bullets: [
          { icon: "🌐", text: "Balances **HTTP applications** across machines and across containers on the same machine." },
          { icon: "🧭", text: "Routing to **target groups** by **path** (/users, /posts), **hostname**, **headers**, or **query string**." },
          { icon: "🔀", text: "Supports **HTTP/2, WebSocket**, and HTTP→HTTPS **redirects**." },
          { icon: "📦", text: "Great for **microservices & containers** (dynamic port mapping with ECS)." },
        ],
      },
      {
        heading: "ALB target groups & 'good to know'",
        bullets: [
          { icon: "🎯", text: "Targets: **EC2** (via ASG), **ECS tasks**, **Lambda** (HTTP→JSON event), **private IPs**. Health checks are at the **target-group** level." },
          { icon: "🕵️", text: "Backends **don't see the client IP** directly — it's in **X-Forwarded-For** (plus X-Forwarded-Port/Proto)." },
        ],
      },
    ],
    keyFacts: [
      { label: "ALB layer", value: "Layer 7 (HTTP)", icon: "🌐" },
      { label: "Routes by", value: "Path / host / header / query", icon: "🧭" },
      { label: "Client IP", value: "X-Forwarded-For header", icon: "🕵️" },
      { label: "Targets", value: "EC2, ECS, Lambda, private IPs", icon: "🎯" },
    ],
    quickReference: {
      title: "ALB exam cues",
      icon: "🎯",
      bullets: [
        "Need **URL-path or host-based routing**? → ALB.",
        "**WebSocket / HTTP/2 / redirects**? → ALB.",
        "Backend needs the real client IP → read **X-Forwarded-For**.",
        "One ALB can front **many microservices** via target groups (CLB would need one LB each).",
        "Lambda can be an ALB target (request becomes a JSON event).",
      ],
      analogyBrief:
        "An ALB is a smart receptionist who reads the visitor's request slip (URL/host) and sends them to exactly the right department.",
    },
    explanation:
      "The Application Load Balancer is a Layer 7 (HTTP) load balancer and the modern default. It routes to different target groups based on the URL path, the hostname, HTTP headers, or query-string parameters, supports HTTP/2 and WebSocket, and can redirect HTTP to HTTPS. That makes it perfect for microservices and container platforms — a single ALB can front many services, whereas the old Classic Load Balancer needed one CLB per application. Target groups can point at EC2 instances (usually behind an ASG), ECS tasks, Lambda functions (the request is translated into a JSON event), or private IP addresses, and health checks are defined per target group. Because the ALB terminates the connection, backends don't see the client's IP directly; it's passed in the X-Forwarded-For header (with X-Forwarded-Port and X-Forwarded-Proto). The Classic Load Balancer (v1) is the legacy generation: it does TCP and HTTP/HTTPS, has a fixed hostname, and supports only a single SSL certificate.",
    analogy:
      "The CLB is an old switchboard that just patches every call to a free line. The ALB is a smart receptionist: it reads each visitor's request slip — 'I need /billing' or 'I'm visiting shop.example.com' — and routes them to exactly the right department, all through one front desk.",
    diagram: `<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="ALB path-based routing">${svgDefs}
      ${box(20, 120, 80, 55, "WWW", "clients", "#8b949e")}
      <line x1="100" y1="147" x2="200" y2="147" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <rect x="205" y="95" width="130" height="105" rx="10" fill="#6b46c1" stroke="#ff9900"/>
      <text x="270" y="140" text-anchor="middle" fill="#fff" font-size="12" font-weight="700">ALB (L7)</text>
      <text x="270" y="160" text-anchor="middle" fill="#e6edf3" font-size="10">routing rules</text>
      <line x1="335" y1="120" x2="470" y2="70" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="380" y="95" fill="#8b949e" font-size="10">/users</text>
      <line x1="335" y1="175" x2="470" y2="220" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="380" y="215" fill="#8b949e" font-size="10">/search</text>
      ${box(475, 45, 220, 55, "Target Group: Users", "EC2 x N", "#22c55e")}
      ${box(475, 195, 220, 55, "Target Group: Search", "EC2 x N", "#3b82f6")}
    </svg>`,
    diagramLegend: [
      { color: "#6b46c1", label: "ALB", description: "Layer-7 balancer with listener rules." },
      { color: "#22c55e", label: "Target group A", description: "e.g. /users → Users service." },
      { color: "#3b82f6", label: "Target group B", description: "e.g. /search → Search service." },
    ],
    codeExample: {
      language: "bash",
      title: "Add a path-based routing rule to an ALB listener",
      code: `aws elbv2 create-rule \\
  --listener-arn arn:aws:elasticloadbalancing:...:listener/app/my-alb/xxx \\
  --priority 10 \\
  --conditions Field=path-pattern,Values="/users*" \\
  --actions Type=forward,TargetGroupArn=arn:aws:...:targetgroup/users-tg/yyy`,
    },
    problemStatement:
      "A company is breaking a monolith into 'users', 'orders', and 'search' microservices, all under app.example.com. They want one public entry point that routes /users*, /orders*, and /search* to separate target groups, terminates HTTPS, and still lets each backend log the real client IP. Which load balancer and features do you use, and how do the backends recover the client IP?",
    questions: [
      {
        q: "You must route example.com/users and example.com/search to different fleets through ONE load balancer. Which type and feature?",
        options: [
          "A. NLB with TCP listeners",
          "B. ALB with path-based routing to two target groups",
          "C. Two Classic Load Balancers",
          "D. GWLB with GENEVE",
        ],
        answer: "B",
        explanation:
          "B is correct: ALB does Layer-7 path-based routing to separate target groups from a single LB. NLB is L4 (no URL awareness). CLB would need one LB per app. GWLB is for appliances.",
      },
      {
        q: "Behind an ALB, application logs show the client IP as the ALB's private IP. How do you log the real client IP?",
        options: [
          "A. Switch to a Network Load Balancer only",
          "B. Read the X-Forwarded-For header",
          "C. Enable stickiness",
          "D. Disable connection termination",
        ],
        answer: "B",
        explanation:
          "B is correct: the ALB terminates the connection, so the true client IP is carried in X-Forwarded-For (with X-Forwarded-Port/Proto). A is a different design (NLB preserves source IP but you asked to keep the ALB). C and D don't reveal the client IP.",
      },
      {
        q: "Which target type is valid for an ALB target group?",
        options: [
          "A. Lambda functions",
          "B. On-prem servers via public DNS name",
          "C. S3 buckets",
          "D. RDS instances",
        ],
        answer: "A",
        explanation:
          "A is correct: ALB target groups support EC2 instances, ECS tasks, private IP addresses, and Lambda functions (the HTTP request becomes a JSON event). S3 and RDS are not ALB targets; on-prem is reached via private IP, not public DNS.",
      },
      {
        q: "A Classic Load Balancer must serve two hostnames each needing its own SSL certificate. What's the limitation?",
        options: [
          "A. CLB supports only one SSL certificate, so you need multiple CLBs (or an ALB/NLB with SNI)",
          "B. CLB supports unlimited certificates via SNI",
          "C. CLB cannot do HTTPS at all",
          "D. CLB requires GENEVE for TLS",
        ],
        answer: "A",
        explanation:
          "A is correct: the CLB supports only a single certificate, so multiple hostnames/certs mean multiple CLBs — or move to ALB/NLB which support multiple certs via SNI. B/C/D are false.",
      },
      {
        q: "Which ALB capability is MOST useful for containerized services that use dynamic host ports (e.g. Amazon ECS)?",
        options: [
          "A. Fixed hostname",
          "B. Dynamic port mapping to target groups",
          "C. TCP passthrough",
          "D. Elastic IP assignment",
        ],
        answer: "B",
        explanation:
          "B is correct: the ALB's dynamic port mapping lets it route to containers on ephemeral ports, ideal for ECS. A is common to all LBs. C describes NLB behavior. D is an NLB feature, not ALB.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "nlb-gwlb",
    title: "Network & Gateway Load Balancers (NLB, GWLB)",
    shortLabel: "NLB & GWLB",
    section: "High Availability & Scalability",
    domain: "Networking",
    tldr:
      "The NLB (v2, Layer 4) forwards TCP/UDP at ultra-low latency and millions of req/s, with one static IP per AZ (and optional Elastic IP). The GWLB (Layer 3) transparently routes IP packets through fleets of 3rd-party network appliances using GENEVE on port 6081.",
    subtopics: [
      {
        heading: "Network Load Balancer (v2, Layer 4)",
        bullets: [
          { icon: "⚡", text: "Forwards **TCP & UDP**; handles **millions of requests/sec** at **ultra-low latency**." },
          { icon: "📌", text: "**One static IP per AZ**, and supports assigning an **Elastic IP** — great for **IP whitelisting**." },
          { icon: "🎯", text: "Targets: **EC2**, **private IPs**, or an **ALB**. Health checks support TCP, HTTP, HTTPS." },
        ],
      },
      {
        heading: "Gateway Load Balancer (Layer 3)",
        bullets: [
          { icon: "🛡️", text: "Deploy/scale fleets of **3rd-party network appliances** — firewalls, IDS/IPS, deep packet inspection." },
          { icon: "🔀", text: "Combines a **transparent network gateway** (single entry/exit) + a **load balancer**." },
          { icon: "🧬", text: "Uses the **GENEVE** protocol on **port 6081**; operates on **IP packets** (Layer 3)." },
          { icon: "🎯", text: "Targets: **EC2 instances** or **private IPs**." },
        ],
      },
    ],
    keyFacts: [
      { label: "NLB layer", value: "Layer 4 — TCP/UDP", icon: "⚡" },
      { label: "NLB IP", value: "1 static IP / AZ (+ EIP)", icon: "📌" },
      { label: "GWLB layer", value: "Layer 3 — IP packets", icon: "🛡️" },
      { label: "GWLB protocol", value: "GENEVE, port 6081", icon: "🧬" },
    ],
    quickReference: {
      title: "When to pick NLB vs GWLB",
      icon: "🧭",
      bullets: [
        "Extreme perf, **TCP/UDP**, or need a **static/Elastic IP** → **NLB**.",
        "Whitelist a fixed IP with a partner → NLB Elastic IP.",
        "Insert **firewall/IDS/IPS/DPI** inline → **GWLB**.",
        "NLB can even have an **ALB as its target** (static IP + L7 routing).",
        "GWLB endpoints + route tables send traffic through appliances transparently.",
      ],
      analogyBrief:
        "NLB is a high-speed toll gate with a fixed address; GWLB is airport security every bag must pass through before continuing.",
    },
    explanation:
      "The Network Load Balancer works at Layer 4: it forwards TCP and UDP traffic, handles millions of requests per second with ultra-low latency, and is used when you need extreme performance. Crucially, an NLB has one static IP per Availability Zone and can be assigned an Elastic IP, which is invaluable when a partner needs to whitelist a fixed IP. Its target groups can be EC2 instances, private IP addresses, or even an Application Load Balancer, and health checks support TCP, HTTP, and HTTPS. The Gateway Load Balancer operates at Layer 3 on raw IP packets and exists to deploy, scale, and manage fleets of third-party network virtual appliances such as firewalls, intrusion detection/prevention systems, and deep-packet-inspection tools. It combines a transparent network gateway (a single entry and exit point for traffic) with a load balancer that distributes to your appliances, using the GENEVE protocol on port 6081. Its targets are EC2 instances or private IPs.",
    analogy:
      "The NLB is a high-speed motorway toll gate with a permanent street address (static/Elastic IP) — cars fly through at huge volume. The GWLB is airport security: every bag (IP packet) is transparently routed through the scanners (3rd-party appliances) before it's allowed to continue, without passengers choosing to go there.",
    diagram: `<svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="NLB and GWLB">${svgDefs}
      <text x="20" y="24" fill="#ff9900" font-size="12" font-weight="700">NLB — Layer 4 (static IP)</text>
      ${box(20, 35, 80, 50, "Clients", "TCP/UDP", "#8b949e")}
      <line x1="100" y1="60" x2="160" y2="60" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(165, 32, 110, 56, "NLB", "1 IP / AZ", "#6b46c1")}
      <line x1="275" y1="60" x2="330" y2="60" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(335, 35, 150, 50, "EC2 / IPs / ALB", "targets", "#22c55e")}
      <text x="20" y="170" fill="#ff9900" font-size="12" font-weight="700">GWLB — Layer 3 (GENEVE 6081)</text>
      ${box(20, 185, 80, 50, "Users", "source", "#8b949e")}
      <line x1="100" y1="210" x2="160" y2="210" stroke="#8b949e" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#arrow-mute)"/>
      ${box(165, 182, 110, 56, "GWLB", "gateway+LB", "#6b46c1")}
      <line x1="220" y1="238" x2="220" y2="280" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(145, 285, 150, 30, "3rd-party appliances", "firewall / IDS", "#ef4444")}
      <line x1="275" y1="210" x2="470" y2="210" stroke="#8b949e" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#arrow-mute)"/>
      ${box(475, 185, 150, 50, "Application", "destination", "#3b82f6")}
    </svg>`,
    diagramLegend: [
      { color: "#6b46c1", label: "Load balancer", description: "NLB (L4) or GWLB (L3)." },
      { color: "#ef4444", label: "Security appliances", description: "GWLB target group of 3rd-party firewalls/IDS." },
      { color: "#22c55e", label: "NLB targets", description: "EC2, private IPs, or an ALB." },
    ],
    codeExample: {
      language: "bash",
      title: "Create an internet-facing NLB (Layer 4)",
      code: `aws elbv2 create-load-balancer \\
  --name my-nlb \\
  --type network \\
  --scheme internet-facing \\
  --subnets subnet-0aaa subnet-0bbb
# NLB gives one static IP per subnet/AZ; attach an Elastic IP for a fixed,
# whitelistable address.`,
    },
    problemStatement:
      "A financial partner will only connect to your API if you give them a small set of fixed IP addresses to allowlist, and the protocol is raw TCP at very high throughput. Separately, security mandates that all inbound VPC traffic pass through a third-party firewall appliance before reaching applications. Which load balancer solves each requirement, and why?",
    questions: [
      {
        q: "A partner must allowlist a FIXED IP for your high-throughput TCP endpoint. Which load balancer fits best?",
        options: [
          "A. ALB (it has a fixed hostname)",
          "B. NLB with an Elastic IP",
          "C. CLB with stickiness",
          "D. GWLB",
        ],
        answer: "B",
        explanation:
          "B is correct: the NLB provides one static IP per AZ and supports Elastic IPs — ideal for IP allowlisting and high-throughput TCP. ALB gives a DNS name, not a stable IP. CLB stickiness is unrelated. GWLB is for appliances.",
      },
      {
        q: "Which protocol and port does the Gateway Load Balancer use to exchange traffic with its appliances?",
        options: ["A. TLS on 443", "B. HTTP/2 on 80", "C. GENEVE on 6081", "D. TCP on 22"],
        answer: "C",
        explanation:
          "C is correct: GWLB uses the GENEVE encapsulation protocol on port 6081 to send packets to and from the virtual appliances. The others are unrelated to GWLB.",
      },
      {
        q: "At which OSI layer does the Network Load Balancer operate?",
        options: ["A. Layer 3 (IP)", "B. Layer 4 (TCP/UDP)", "C. Layer 7 (HTTP)", "D. Layer 2 (MAC)"],
        answer: "B",
        explanation:
          "B is correct: the NLB is a Layer-4 load balancer for TCP/UDP. GWLB is L3, ALB/CLB operate at L7 (CLB also L4).",
      },
      {
        q: "You must transparently route ALL VPC traffic through a fleet of 3rd-party firewalls before it reaches your apps. Which service is purpose-built for this?",
        options: ["A. ALB", "B. NLB", "C. GWLB", "D. Route 53"],
        answer: "C",
        explanation:
          "C is correct: the Gateway Load Balancer is a transparent network gateway plus load balancer designed to insert 3rd-party appliances (firewalls, IDS/IPS, DPI) inline. The others don't provide transparent appliance insertion.",
      },
      {
        q: "Which is a VALID target for a Network Load Balancer target group?",
        options: [
          "A. An Application Load Balancer",
          "B. An S3 bucket",
          "C. A CloudFront distribution",
          "D. A DynamoDB table",
        ],
        answer: "A",
        explanation:
          "A is correct: NLB target groups can be EC2 instances, private IP addresses, or an ALB (giving a static IP in front of L7 routing). S3, CloudFront, and DynamoDB are not NLB targets.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "elb-sticky-ssl",
    title: "Stickiness, Cross-Zone, SSL/TLS & Connection Draining",
    shortLabel: "Stickiness & SSL",
    section: "High Availability & Scalability",
    domain: "Networking",
    tldr:
      "Sticky sessions pin a client to one instance via a cookie. Cross-zone load balancing spreads requests evenly across all instances in all AZs. SSL/TLS + SNI let one LB serve multiple encrypted domains. Connection draining finishes in-flight requests before removing an instance.",
    subtopics: [
      {
        heading: "Sticky Sessions (session affinity)",
        bullets: [
          { icon: "🍪", text: "Always send the same client to the same instance — works for **CLB, ALB, NLB**." },
          { icon: "⏱️", text: "For CLB & ALB the stickiness cookie has an **expiration** you control." },
          { icon: "🏷️", text: "Cookie types: **Application-based** (custom or AWSALBAPP) and **Duration-based** (AWSALB for ALB, AWSELB for CLB). Don't use reserved names AWSALB/AWSALBAPP/AWSALBTG." },
          { icon: "⚠️", text: "Can cause **load imbalance** across instances." },
        ],
      },
      {
        heading: "Cross-Zone Load Balancing",
        bullets: [
          { icon: "⚖️", text: "**On** = each LB node spreads evenly across **all instances in all AZs**." },
          { icon: "✅", text: "**ALB**: enabled by default (no inter-AZ charge). **NLB/GWLB**: disabled by default, pay for inter-AZ data if enabled. **CLB**: disabled by default, no charge if enabled." },
        ],
      },
      {
        heading: "SSL/TLS & SNI",
        bullets: [
          { icon: "🔐", text: "LB uses an **X.509** cert (manage via **ACM** or upload your own); HTTPS listener needs a default cert." },
          { icon: "🌐", text: "**SNI** lets a client indicate the hostname in the handshake so one LB serves **multiple certs/domains** — works on **ALB & NLB & CloudFront**, **not** CLB." },
        ],
      },
      {
        heading: "Connection Draining / Deregistration Delay",
        bullets: [
          { icon: "🚰", text: "**Connection Draining** (CLB) / **Deregistration Delay** (ALB & NLB): finish in-flight requests while an instance de-registers." },
          { icon: "⏳", text: "**1–3600 s** (default **300**); set to **0** to disable. Use a low value for short requests." },
        ],
      },
    ],
    keyFacts: [
      { label: "Stickiness cookie (ALB)", value: "AWSALB", icon: "🍪" },
      { label: "Cross-zone default", value: "ALB on · NLB/GWLB off", icon: "⚖️" },
      { label: "SNI works on", value: "ALB, NLB, CloudFront", icon: "🌐" },
      { label: "Drain delay", value: "1–3600s (default 300)", icon: "🚰" },
    ],
    quickReference: {
      title: "Exam cues",
      icon: "🎯",
      bullets: [
        "'User loses session/cart when moved between servers' → enable **stickiness**.",
        "'Multiple HTTPS domains on one LB' → **SNI** (ALB/NLB, not CLB).",
        "'Requests dropped during scale-in/deploys' → **connection draining / dereg delay**.",
        "**Cross-zone off on NLB/GWLB by default** and inter-AZ data is charged when on.",
        "Manage/renew certs centrally with **ACM**.",
      ],
      analogyBrief:
        "Stickiness = same bank teller every visit; SNI = one receptionist holding many companies' name badges; draining = let the current customer finish before the teller's shift ends.",
    },
    explanation:
      "Sticky sessions (session affinity) make a load balancer always send a given client to the same instance, which prevents users from losing session data such as a shopping cart. It works for CLB, ALB, and NLB; for CLB and ALB the cookie has a controllable expiration, and cookies are either application-based (a custom cookie or the AWSALBAPP cookie) or duration-based (AWSALB for ALB, AWSELB for CLB). Stickiness can unbalance the backend. Cross-zone load balancing, when enabled, has each LB node distribute traffic evenly across every registered instance in every AZ; it's on by default for ALB (free), off by default for NLB and GWLB (with inter-AZ charges when enabled), and off by default for CLB (free when enabled). For encryption, the LB presents an X.509 SSL/TLS certificate that you manage in ACM or upload yourself; an HTTPS listener needs a default certificate, and Server Name Indication (SNI) lets clients specify the target hostname during the TLS handshake so one LB can serve multiple certificates and domains — supported on ALB, NLB, and CloudFront but not the CLB. Finally, connection draining (called deregistration delay on ALB/NLB) gives in-flight requests time to complete while an instance is de-registering or unhealthy: it ranges from 1 to 3600 seconds (default 300) and can be disabled by setting 0.",
    analogy:
      "Stickiness is being assigned the same bank teller every visit so they remember your paperwork. SNI is one receptionist who keeps name badges for many companies and hands you the right one when you say who you're visiting. Connection draining is letting a teller finish serving the customer at their window before their shift ends, instead of abruptly walking away.",
    diagram: `<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Stickiness and SNI">${svgDefs}
      <text x="20" y="24" fill="#ff9900" font-size="12" font-weight="700">Sticky sessions</text>
      ${box(20, 35, 70, 45, "Client 1", "cookie", "#8b949e")}
      <line x1="90" y1="57" x2="150" y2="57" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(155, 33, 90, 50, "ALB", "AWSALB", "#6b46c1")}
      <line x1="245" y1="57" x2="305" y2="57" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(310, 35, 120, 45, "Same EC2", "always", "#22c55e")}
      <text x="20" y="140" fill="#ff9900" font-size="12" font-weight="700">SNI (one LB, many certs)</text>
      ${box(20, 155, 90, 50, "Client", "wants site A", "#8b949e")}
      <line x1="110" y1="180" x2="170" y2="180" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(175, 152, 100, 56, "ALB/NLB", "SNI", "#6b46c1")}
      <line x1="275" y1="165" x2="360" y2="130" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(365, 110, 150, 40, "Cert: a.example.com", "TG A", "#22c55e")}
      <line x1="275" y1="195" x2="360" y2="230" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(365, 215, 150, 40, "Cert: b.example.com", "TG B", "#3b82f6")}
    </svg>`,
    diagramLegend: [
      { color: "#6b46c1", label: "Load balancer", description: "Issues stickiness cookie / selects cert via SNI." },
      { color: "#22c55e", label: "Pinned / cert-A target", description: "Sticky instance or SNI cert A backend." },
      { color: "#3b82f6", label: "Cert-B target", description: "Second domain/cert served by the same LB." },
    ],
    codeExample: {
      language: "bash",
      title: "Enable stickiness & set deregistration delay on a target group",
      code: `aws elbv2 modify-target-group-attributes \\
  --target-group-arn arn:aws:...:targetgroup/web-tg/xxx \\
  --attributes \\
    Key=stickiness.enabled,Value=true \\
    Key=stickiness.type,Value=lb_cookie \\
    Key=stickiness.lb_cookie.duration_seconds,Value=3600 \\
    Key=deregistration_delay.timeout_seconds,Value=30`,
    },
    problemStatement:
      "During deployments your ALB briefly returns 5xx errors, and users occasionally get logged out mid-checkout when moved to a new instance. You also need to serve shop.example.com and admin.example.com over HTTPS from the same load balancer with separate certificates. Name the three ELB features that fix these issues and the correct setting for each.",
    questions: [
      {
        q: "Users lose their shopping-cart session when a load balancer routes them to a different instance. Which feature fixes this?",
        options: [
          "A. Cross-zone load balancing",
          "B. Sticky sessions (session affinity)",
          "C. Connection draining",
          "D. SNI",
        ],
        answer: "B",
        explanation:
          "B is correct: stickiness pins a client to the same instance via a cookie so session data isn't lost. Cross-zone changes distribution, draining handles de-registration, SNI is about certificates.",
      },
      {
        q: "You need one ALB to serve two HTTPS hostnames with different certificates. Which capability enables this?",
        options: [
          "A. Server Name Indication (SNI)",
          "B. A single wildcard is the only option; multiple certs are impossible",
          "C. Connection draining",
          "D. Cross-zone load balancing",
        ],
        answer: "A",
        explanation:
          "A is correct: SNI lets the client indicate the hostname during the TLS handshake so the ALB (or NLB/CloudFront) picks the right cert — one LB, many domains. B is false (CLB can't, but ALB/NLB can via SNI). C/D are unrelated to certificates.",
      },
      {
        q: "By default, cross-zone load balancing is enabled on which load balancer?",
        options: ["A. NLB", "B. GWLB", "C. ALB", "D. None of them"],
        answer: "C",
        explanation:
          "C is correct: the ALB has cross-zone enabled by default (with no inter-AZ data charge). NLB and GWLB have it disabled by default and charge for inter-AZ data when enabled.",
      },
      {
        q: "During scale-in and deployments the ALB returns errors because instances are removed while still serving requests. What should you configure?",
        options: [
          "A. Increase the health-check interval",
          "B. Set a deregistration delay (connection draining) long enough to finish in-flight requests",
          "C. Disable stickiness",
          "D. Turn on SNI",
        ],
        answer: "B",
        explanation:
          "B is correct: the deregistration delay (connection draining) lets in-flight requests complete before the target is removed (1–3600s, default 300; 0 disables). The others don't address in-flight request loss.",
      },
      {
        q: "Which statement about ELB SSL certificates is TRUE?",
        options: [
          "A. The CLB supports multiple certificates via SNI",
          "B. ACM can manage and auto-renew the LB's certificate",
          "C. HTTPS listeners do not require a default certificate",
          "D. Certificates must always be uploaded manually",
        ],
        answer: "B",
        explanation:
          "B is correct: AWS Certificate Manager (ACM) manages and renews the LB's certificate. A is false (CLB supports only one cert). C is false (an HTTPS listener needs a default cert). D is false (ACM or upload).",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "auto-scaling-groups",
    title: "Auto Scaling Groups (ASG)",
    shortLabel: "Auto Scaling Groups",
    section: "High Availability & Scalability",
    domain: "Compute",
    tldr:
      "An Auto Scaling Group automatically adds instances to match rising load (scale out) and removes them when load drops (scale in), keeps a min/desired/max count, replaces unhealthy instances, and registers new ones with a load balancer. ASGs are free — you pay only for the EC2 instances.",
    subtopics: [
      {
        heading: "What an ASG does",
        bullets: [
          { icon: "➕", text: "**Scale out** to add EC2 and **scale in** to remove EC2 to match load." },
          { icon: "🎚️", text: "Enforce **Minimum / Desired / Maximum** capacity." },
          { icon: "🔁", text: "**Re-create** a terminated/unhealthy instance automatically; **register** new instances with the ELB." },
          { icon: "💸", text: "The ASG itself is **free** — you pay only for the underlying instances." },
        ],
      },
      {
        heading: "ASG attributes (Launch Template)",
        bullets: [
          { icon: "📋", text: "A **Launch Template** (Launch Configurations are deprecated) defines **AMI + instance type**, user data, EBS, security groups, key pair, and IAM role." },
          { icon: "🌐", text: "Plus VPC/subnets, **load balancer** info, min/max/initial capacity, and scaling policies." },
        ],
      },
      {
        heading: "ASG + Load Balancer + Multi-AZ",
        bullets: [
          { icon: "🩺", text: "The ELB **health check** can drive ASG instance health — unhealthy → replaced." },
          { icon: "🏢", text: "Span the ASG across **multiple AZs** for high availability; reserve **minimum capacity** with Reserved Instances for cost savings." },
        ],
      },
    ],
    keyFacts: [
      { label: "Defines instances via", value: "Launch Template", icon: "📋" },
      { label: "Capacity knobs", value: "Min / Desired / Max", icon: "🎚️" },
      { label: "ASG price", value: "Free (pay for EC2)", icon: "💸" },
      { label: "Health source", value: "EC2 status or ELB check", icon: "🩺" },
    ],
    quickReference: {
      title: "Exam cues",
      icon: "🎯",
      bullets: [
        "'Automatically replace failed instances' → **ASG** (with ELB health check).",
        "Launch Configurations are **deprecated** → use **Launch Templates**.",
        "Span **≥2 AZs** for HA; **desired** stays within min/max.",
        "ASG is free; only the EC2 instances cost money.",
        "Use a **ready-to-use AMI** to speed boot and shorten cooldowns.",
      ],
      analogyBrief:
        "An ASG is a shift manager who calls in extra staff when the queue grows and sends them home when it shrinks — and immediately replaces anyone who calls in sick.",
    },
    explanation:
      "An Auto Scaling Group manages a fleet of identical EC2 instances so it grows and shrinks with demand. Its goals are to scale out (add instances) when load rises, scale in (remove instances) when load falls, keep the fleet between a minimum and maximum size around a desired count, automatically re-create instances that are terminated or become unhealthy, and register new instances with a load balancer. The ASG itself is free; you pay only for the instances it runs. Each ASG is backed by a Launch Template (the older Launch Configurations are deprecated) that specifies the AMI and instance type, EC2 user data, EBS volumes, security groups, SSH key pair, and IAM role, plus network/subnet and load-balancer information, the capacity settings, and scaling policies. When paired with an ELB, the load balancer's health check can determine instance health, so a failing instance is replaced automatically. Spanning the ASG across multiple Availability Zones provides high availability, and reserving the minimum (baseline) capacity with Reserved Instances saves cost.",
    analogy:
      "An ASG is the shift manager of a call center. When the queue of callers grows, they phone in extra operators (scale out); when it's quiet, they send some home (scale in). They always keep a minimum crew on and never exceed the room's max seats — and if an operator calls in sick, they immediately bring in a replacement.",
    diagram: `<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Auto Scaling Group with ELB">${svgDefs}
      ${box(30, 125, 80, 50, "Users", "", "#8b949e")}
      <line x1="110" y1="150" x2="170" y2="150" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(175, 122, 100, 56, "ELB", "health checks", "#6b46c1")}
      <rect x="310" y="40" width="380" height="230" rx="12" fill="#1a2332" stroke="#ff9900" stroke-dasharray="5 4"/>
      <text x="325" y="62" fill="#ff9900" font-size="12" font-weight="700">Auto Scaling Group (min / desired / max)</text>
      ${box(330, 80, 100, 50, "EC2", "AZ A", "#22c55e")}
      ${box(440, 80, 100, 50, "EC2", "AZ B", "#22c55e")}
      ${box(330, 150, 100, 50, "EC2", "AZ A", "#22c55e")}
      ${box(440, 150, 100, 50, "EC2", "scale out", "#3b82f6")}
      ${box(555, 80, 110, 50, "EC2", "scale out", "#3b82f6")}
      ${box(555, 150, 110, 50, "EC2", "scale out", "#3b82f6")}
      <line x1="275" y1="150" x2="308" y2="150" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
    </svg>`,
    diagramLegend: [
      { color: "#6b46c1", label: "Load balancer", description: "Fronts the ASG; its health check can drive instance health." },
      { color: "#22c55e", label: "Baseline instances", description: "Minimum/desired capacity, spread across AZs." },
      { color: "#3b82f6", label: "Scaled-out instances", description: "Added on demand up to the max." },
    ],
    codeExample: {
      language: "bash",
      title: "Create an ASG from a launch template across two AZs, attached to a target group",
      code: `aws autoscaling create-auto-scaling-group \\
  --auto-scaling-group-name web-asg \\
  --launch-template LaunchTemplateName=web-lt,Version='$Latest' \\
  --min-size 2 --desired-capacity 2 --max-size 6 \\
  --vpc-zone-identifier "subnet-0aaa,subnet-0bbb" \\
  --target-group-arns arn:aws:...:targetgroup/web-tg/xxx \\
  --health-check-type ELB --health-check-grace-period 60`,
    },
    problemStatement:
      "A stateless web tier currently runs on two hand-managed EC2 instances; when one crashes at 2 a.m., someone must manually launch a replacement, and traffic spikes cause slowdowns. Design an ASG-based setup that self-heals, scales with load, and survives an AZ outage. Which construct defines the instances, and how does the ELB health check help?",
    questions: [
      {
        q: "What replaces the now-deprecated Launch Configuration as the way to define an ASG's instances?",
        options: ["A. AMI policy", "B. Launch Template", "C. CloudFormation only", "D. Spot Fleet request"],
        answer: "B",
        explanation:
          "B is correct: Launch Templates are the current mechanism (AMI, instance type, user data, SGs, IAM role, etc.); Launch Configurations are deprecated. A isn't a thing; C is a provisioning tool, not required; D is a different feature.",
      },
      {
        q: "Which statement about Auto Scaling Group pricing is TRUE?",
        options: [
          "A. You pay per scaling action",
          "B. The ASG is free; you pay only for the EC2 instances",
          "C. ASGs require a paid support plan",
          "D. You pay per registered target",
        ],
        answer: "B",
        explanation:
          "B is correct: the ASG service itself is free — cost is only the underlying EC2 (and any attached resources). The others are invented charges.",
      },
      {
        q: "How does an ASG achieve high availability against a single-AZ outage?",
        options: [
          "A. By running all instances in one AZ but a bigger type",
          "B. By spanning the ASG across multiple Availability Zones",
          "C. By enabling stickiness",
          "D. By using a Launch Configuration",
        ],
        answer: "B",
        explanation:
          "B is correct: configuring the ASG across multiple AZs means an AZ loss doesn't take down the whole fleet. A is vertical scaling in one AZ (not HA). C is unrelated. D is deprecated tooling.",
      },
      {
        q: "With health-check-type set to ELB, what happens when the load balancer marks an instance unhealthy?",
        options: [
          "A. Nothing; only EC2 status checks matter",
          "B. The ASG terminates and replaces the instance",
          "C. The ELB is deleted",
          "D. The ASG scales in the whole group",
        ],
        answer: "B",
        explanation:
          "B is correct: with ELB health checks, an unhealthy target is terminated and replaced by the ASG, keeping the fleet healthy. A ignores the ELB signal, C/D are incorrect reactions.",
      },
      {
        q: "An ASG has min=2, desired=4, max=10. A scale-in policy triggers repeatedly. What is the FEWEST instances the ASG will run?",
        options: ["A. 0", "B. 2", "C. 4", "D. 10"],
        answer: "B",
        explanation:
          "B is correct: the ASG never goes below its minimum size, so it will not scale below 2. Desired can move between min and max; max caps scale-out at 10.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "asg-scaling-policies",
    title: "ASG Scaling Policies & Cooldowns",
    shortLabel: "ASG Scaling Policies",
    section: "High Availability & Scalability",
    domain: "Compute",
    tldr:
      "ASGs scale via dynamic policies (target tracking, simple/step on CloudWatch alarms), scheduled scaling (known patterns), and predictive scaling (forecast load). Good metrics include CPUUtilization and ALB RequestCountPerTarget. After each action a cooldown (default 300s) lets metrics stabilize.",
    subtopics: [
      {
        heading: "Dynamic scaling",
        bullets: [
          { icon: "🎯", text: "**Target Tracking** — simplest: keep a metric near a target (e.g. average CPU ≈ 40%)." },
          { icon: "🪜", text: "**Simple / Step Scaling** — react to a CloudWatch alarm (e.g. CPU>70% → +2; CPU<30% → −1)." },
        ],
      },
      {
        heading: "Scheduled & Predictive scaling",
        bullets: [
          { icon: "📅", text: "**Scheduled** — anticipate known patterns (e.g. set min capacity to 10 at 5pm Fridays)." },
          { icon: "🔮", text: "**Predictive** — continuously **forecast** load and schedule scaling ahead of time." },
        ],
      },
      {
        heading: "Good metrics to scale on",
        bullets: [
          { icon: "🖥️", text: "**CPUUtilization** (average across instances)." },
          { icon: "📈", text: "**RequestCountPerTarget** — keep requests per instance stable (ALB)." },
          { icon: "🌐", text: "**Average Network In/Out** for network-bound apps, or any **custom CloudWatch metric**." },
        ],
      },
      {
        heading: "Scaling cooldowns",
        bullets: [
          { icon: "⏳", text: "After a scaling activity you enter a **cooldown** (default **300s**) — no new launch/terminate so metrics can stabilize." },
          { icon: "🖼️", text: "Use a **ready-to-use AMI** to boot faster and reduce the needed cooldown." },
        ],
      },
    ],
    keyFacts: [
      { label: "Simplest policy", value: "Target Tracking", icon: "🎯" },
      { label: "Known schedule", value: "Scheduled scaling", icon: "📅" },
      { label: "Forecast ahead", value: "Predictive scaling", icon: "🔮" },
      { label: "Default cooldown", value: "300 seconds", icon: "⏳" },
    ],
    quickReference: {
      title: "Pick the policy",
      icon: "🧭",
      bullets: [
        "'Keep CPU around X%' with minimal setup → **Target Tracking**.",
        "'If alarm, add/remove N' → **Simple/Step Scaling**.",
        "'Every Friday 5pm we spike' → **Scheduled Scaling**.",
        "'Forecast recurring daily/weekly load' → **Predictive Scaling**.",
        "Stabilize metric between actions with the **cooldown**; speed boot with a golden AMI.",
      ],
      analogyBrief:
        "Target tracking = a thermostat holding a set temperature; scheduled = pre-heating before guests arrive; predictive = a smart thermostat that learns your week.",
    },
    explanation:
      "Auto Scaling Groups adjust capacity using several policy types. Dynamic scaling includes Target Tracking, the simplest option, where you name a metric and a target value (for example, keep average ASG CPU near 40%) and AWS manages the alarms; and Simple/Step Scaling, where a CloudWatch alarm triggers a defined change (CPU>70% adds 2 units, CPU<30% removes 1). Scheduled scaling anticipates known usage patterns, such as raising minimum capacity to 10 every Friday at 5pm. Predictive scaling continuously forecasts load from history and schedules scaling ahead of demand. Good scaling metrics include CPUUtilization (average across the group), RequestCountPerTarget (to keep requests per instance stable behind an ALB), average network in/out for network-bound workloads, and any custom CloudWatch metric you publish. After each scaling activity the ASG enters a cooldown period (default 300 seconds) during which it won't launch or terminate more instances so metrics can stabilize; using a ready-to-use AMI shortens boot time and lets you use a shorter cooldown.",
    analogy:
      "Target tracking is a thermostat: you set 21°C and it quietly adds or removes heat to hold it. Step scaling is a manual override — 'if it gets above 25, blast the AC.' Scheduled scaling is pre-heating the house before guests arrive at a known time. Predictive scaling is a smart thermostat that learns your weekly routine and warms up before you even ask. The cooldown is waiting a few minutes after adjusting before touching the dial again, so you don't overshoot.",
    diagram: `<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="ASG scaling policies">${svgDefs}
      ${box(30, 40, 150, 50, "CloudWatch Alarm", "CPU > 70%", "#ef4444")}
      <line x1="180" y1="65" x2="250" y2="65" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(255, 30, 160, 70, "Scaling Policy", "target / step / sched", "#6b46c1")}
      <line x1="415" y1="65" x2="485" y2="65" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <rect x="490" y="30" width="200" height="150" rx="10" fill="#1a2332" stroke="#ff9900" stroke-dasharray="5 4"/>
      <text x="505" y="50" fill="#ff9900" font-size="11" font-weight="700">Auto Scaling Group</text>
      ${box(505, 60, 80, 45, "EC2", "", "#22c55e")}
      ${box(595, 60, 80, 45, "EC2", "", "#22c55e")}
      ${box(505, 115, 80, 45, "EC2", "+new", "#3b82f6")}
      ${box(595, 115, 80, 45, "EC2", "+new", "#3b82f6")}
      ${box(255, 150, 160, 45, "Cooldown 300s", "stabilize", "#8b949e")}
      <line x1="335" y1="100" x2="335" y2="148" stroke="#8b949e" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#arrow-mute)"/>
    </svg>`,
    diagramLegend: [
      { color: "#ef4444", label: "CloudWatch alarm", description: "Fires on a metric threshold (step/simple)." },
      { color: "#6b46c1", label: "Scaling policy", description: "Target-tracking, step, scheduled, or predictive." },
      { color: "#3b82f6", label: "Added capacity", description: "Instances launched by the scale-out action." },
    ],
    codeExample: {
      language: "bash",
      title: "Target-tracking policy: keep average CPU near 40%",
      code: `aws autoscaling put-scaling-policy \\
  --auto-scaling-group-name web-asg \\
  --policy-name cpu-target-40 \\
  --policy-type TargetTrackingScaling \\
  --target-tracking-configuration '{
    "PredefinedMetricSpecification": {"PredefinedMetricType": "ASGAverageCPUUtilization"},
    "TargetValue": 40.0
  }'`,
    },
    problemStatement:
      "An ecommerce ASG has smooth weekday traffic, a reliable Friday-5pm marketing spike, and occasional flash sales. You want CPU to stay near 50% normally, guaranteed extra capacity ready before the Friday spike, and no thrashing where instances launch and terminate every minute. Which scaling policy (or combination) addresses each need, and what setting prevents thrashing?",
    questions: [
      {
        q: "Which scaling policy is the SIMPLEST to set up when you just want to hold a metric near a value (e.g. CPU ≈ 50%)?",
        options: ["A. Step scaling", "B. Target tracking scaling", "C. Scheduled scaling", "D. Manual scaling"],
        answer: "B",
        explanation:
          "B is correct: target tracking needs only a metric and target value; AWS creates and manages the alarms. Step scaling requires defining alarm thresholds and steps. Scheduled is time-based. Manual isn't a policy.",
      },
      {
        q: "Every Friday at 5pm traffic reliably spikes. What's the BEST way to have capacity ready in advance?",
        options: [
          "A. Target tracking on CPU only",
          "B. Scheduled scaling to raise capacity before 5pm Friday",
          "C. Lower the cooldown to 0",
          "D. Switch to Spot Instances",
        ],
        answer: "B",
        explanation:
          "B is correct: scheduled scaling anticipates known patterns, provisioning capacity ahead of the spike. Target tracking reacts only after CPU rises. Cooldown changes don't pre-provision. Spot is a pricing choice, not scaling timing.",
      },
      {
        q: "What is the purpose of the ASG cooldown period (default 300s)?",
        options: [
          "A. To cap the maximum number of instances",
          "B. To pause further launch/terminate actions so metrics can stabilize",
          "C. To rotate the AMI",
          "D. To force a Multi-AZ rebalance",
        ],
        answer: "B",
        explanation:
          "B is correct: after a scaling activity the ASG waits (default 300s) before another action, preventing thrashing while metrics settle. The others are unrelated to cooldown.",
      },
      {
        q: "Which metric best keeps the number of requests handled per instance stable behind an ALB?",
        options: [
          "A. CPUUtilization",
          "B. RequestCountPerTarget",
          "C. DiskReadOps",
          "D. StatusCheckFailed",
        ],
        answer: "B",
        explanation:
          "B is correct: RequestCountPerTarget scales the ASG to hold a steady request load per instance. CPU is fine for compute-bound apps but not a direct request measure; DiskReadOps and StatusCheckFailed aren't load-distribution metrics.",
      },
      {
        q: "Which scaling type continuously FORECASTS future load from historical data and schedules capacity ahead of time?",
        options: ["A. Simple scaling", "B. Step scaling", "C. Predictive scaling", "D. Target tracking"],
        answer: "C",
        explanation:
          "C is correct: predictive scaling analyzes history, forecasts load, and schedules scaling in advance. Simple/step react to alarms; target tracking holds a metric but doesn't forecast.",
      },
    ],
  },
];
