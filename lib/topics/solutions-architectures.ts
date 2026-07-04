// ============================================================
// SECTION: Classic Solutions Architectures
// WhatIsTheTime.com, MyClothes.com, MyWordPress.com, instantiating
// apps quickly, and Elastic Beanstalk. Course slides ~p226–252.
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

export const solutionsArchTopics: Topic[] = [
  // -----------------------------------------------------------------
  {
    id: "sa-stateless-web-app",
    title: "Stateless Web App — WhatIsTheTime.com",
    shortLabel: "Stateless Web App",
    section: "Classic Solutions Architectures",
    domain: "Foundations",
    tldr:
      "A stateless app (no DB, no session) evolves: single EC2 + Elastic IP → vertical scale (downtime) → horizontal scale with Route 53 A records → replace fragile public-IP records with an ELB + private instances → an Auto Scaling Group → multi-AZ, then reserve the minimum capacity to save cost.",
    subtopics: [
      {
        heading: "Start simple → scale vertically",
        bullets: [
          { icon: "🟢", text: "One **public EC2** with an **Elastic IP** answers requests." },
          { icon: "⬆️", text: "**Vertical scaling** (t2 → M5) means **downtime** while you resize." },
        ],
      },
      {
        heading: "Scale horizontally + DNS",
        bullets: [
          { icon: "➕", text: "Add more EC2 instances (no Elastic IP) and use **Route 53 A records** (TTL) to spread clients." },
          { icon: "⚠️", text: "Problem: if an instance dies, its **A record still points to a dead IP** until TTL expires." },
        ],
      },
      {
        heading: "Add an ELB + ASG + Multi-AZ",
        bullets: [
          { icon: "⚖️", text: "Put an **ELB** in front with **health checks**; use an **Alias record**; make instances **private** behind restricted security groups." },
          { icon: "🔁", text: "Wrap them in an **Auto Scaling Group** so failures self-heal and load scales." },
          { icon: "🏢", text: "Span **multiple AZs** for HA; **reserve minimum capacity** (Reserved Instances) for savings." },
        ],
      },
    ],
    keyFacts: [
      { label: "State", value: "Stateless (no DB/session)", icon: "🧊" },
      { label: "Front door", value: "Route 53 Alias → ELB", icon: "🌐" },
      { label: "Self-healing + scale", value: "Auto Scaling Group", icon: "🔁" },
      { label: "Cost saving", value: "Reserve minimum capacity", icon: "💵" },
    ],
    quickReference: {
      title: "Progression to remember",
      icon: "🎯",
      bullets: [
        "Public IP per instance is **fragile** → front with an **ELB**.",
        "Use a Route 53 **Alias** to the ELB (root domain, free, health-checked).",
        "Instances go **private**; SG allows traffic **only from the ELB**.",
        "**ASG across ≥2 AZs** = HA + elasticity.",
        "Reserve baseline capacity to cut cost.",
      ],
      analogyBrief:
        "It's like scaling a lemonade stand: one bigger stand (vertical), then several stands with one hotline (ELB), then auto-hiring staff (ASG) across two neighborhoods (AZs).",
    },
    explanation:
      "WhatIsTheTime.com just tells people the time: no database and no session state, so it's fully stateless. The Solutions Architect journey starts simple with a single public EC2 instance and an Elastic IP. Scaling vertically to a larger instance works but causes downtime during the resize. Scaling horizontally means running several instances; without an Elastic IP each has its own public IP, and you can register them as multiple Route 53 A records (with a TTL) so clients are spread across them. The flaw is that if an instance dies, its A record still hands out a dead IP until the TTL expires. The fix is to put an Elastic Load Balancer in front with health checks, expose it via a Route 53 Alias record, and move the EC2 instances into private subnets whose security groups only accept traffic from the load balancer. Wrapping the instances in an Auto Scaling Group makes the fleet self-healing and elastic, and spanning the ASG across multiple Availability Zones provides high availability. Finally, because there's always a baseline of at least two instances, you can reserve that minimum capacity with Reserved Instances to save money.",
    analogy:
      "Think of a lemonade stand that just announces the time. First you run one stand (single EC2). When it's busy you build a bigger stand but must close while rebuilding (vertical scaling downtime). Smarter: open several stands and publish all their addresses (A records) — but if one closes, customers still walk to a locked door. So you set up a single hotline that only forwards callers to open stands (the ELB with health checks), auto-hire and fire staff as demand changes (ASG), and run stands in two neighborhoods so a blackout in one doesn't stop sales (multi-AZ).",
    diagram: `<svg viewBox="0 0 720 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Stateless app with ELB and ASG">${svgDefs}
      ${box(20, 100, 90, 50, "Users", "", "#8b949e")}
      ${box(140, 40, 110, 45, "Route 53", "Alias record", "#8b5cf6")}
      <line x1="110" y1="115" x2="138" y2="70" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
      ${box(300, 100, 110, 50, "ELB", "health checks", "#6b46c1")}
      <line x1="110" y1="125" x2="298" y2="125" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <rect x="450" y="30" width="250" height="190" rx="10" fill="#1a2332" stroke="#ff9900" stroke-dasharray="5 4"/>
      <text x="465" y="52" fill="#ff9900" font-size="11" font-weight="700">ASG (multi-AZ)</text>
      ${box(465, 65, 100, 45, "EC2", "AZ A", "#22c55e")}
      ${box(585, 65, 100, 45, "EC2", "AZ B", "#22c55e")}
      ${box(465, 130, 100, 45, "EC2", "scale", "#3b82f6")}
      ${box(585, 130, 100, 45, "EC2", "scale", "#3b82f6")}
      <line x1="410" y1="125" x2="448" y2="125" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
    </svg>`,
    diagramLegend: [
      { color: "#8b5cf6", label: "Route 53", description: "Alias record to the load balancer." },
      { color: "#6b46c1", label: "ELB", description: "Single entry point with health checks." },
      { color: "#22c55e", label: "Private instances", description: "Behind the ELB, in an ASG across AZs." },
    ],
    codeExample: {
      language: "bash",
      title: "Restrict instances to accept traffic only from the ELB (SG referencing SG)",
      code: `# Allow HTTP into the app instances ONLY from the load balancer's security group
aws ec2 authorize-security-group-ingress \\
  --group-id sg-app-instances \\
  --protocol tcp --port 80 \\
  --source-group sg-load-balancer`,
    },
    problemStatement:
      "WhatIsTheTime.com currently runs on one EC2 instance with an Elastic IP, and it goes down whenever that instance fails or is resized. There's no database. Walk through the target architecture that gives zero-downtime scaling, automatic failure recovery, and survives an AZ outage — and explain why publishing multiple A records alone is insufficient.",
    questions: [
      {
        q: "Why is registering multiple EC2 public IPs as Route 53 A records an INSUFFICIENT way to handle instance failure?",
        options: [
          "A. Route 53 doesn't support A records",
          "B. A dead instance's A record keeps returning a dead IP until the TTL expires",
          "C. A records can't have a TTL",
          "D. You can only have one A record per domain",
        ],
        answer: "B",
        explanation:
          "B is correct: without health-checking, Route 53 keeps handing out the failed instance's IP until the cached TTL expires, causing errors. An ELB with health checks solves this. A/C/D are false.",
      },
      {
        q: "In the target stateless architecture, what should the Route 53 record point to?",
        options: [
          "A. Each EC2 instance's Elastic IP",
          "B. An Alias record to the Elastic Load Balancer",
          "C. A NAT gateway",
          "D. A CloudWatch alarm",
        ],
        answer: "B",
        explanation:
          "B is correct: point a Route 53 Alias at the ELB, which health-checks and spreads traffic to healthy instances. Pointing at individual instance IPs reintroduces the fragility.",
      },
      {
        q: "Which construct makes the fleet self-healing and elastic?",
        options: ["A. Elastic IP", "B. Auto Scaling Group", "C. A larger instance type", "D. A CNAME record"],
        answer: "B",
        explanation:
          "B is correct: an ASG replaces failed instances and scales in/out with load. An Elastic IP or bigger instance doesn't self-heal or scale horizontally; a CNAME is just DNS.",
      },
      {
        q: "How should the app instances' security group be configured in the final design?",
        options: [
          "A. Open port 80 to 0.0.0.0/0",
          "B. Allow port 80 only from the load balancer's security group",
          "C. Allow all traffic from the internet gateway",
          "D. Block all inbound traffic including from the ELB",
        ],
        answer: "B",
        explanation:
          "B is correct: instances go private and accept traffic only from the ELB's security group. Opening to the world defeats the private-tier design; blocking the ELB breaks the app.",
      },
      {
        q: "Given the app always runs at least two instances, how can you reduce cost?",
        options: [
          "A. Use Spot Instances for the baseline",
          "B. Purchase Reserved Instances for the minimum (baseline) capacity",
          "C. Delete the ASG at night",
          "D. Switch to a single AZ",
        ],
        answer: "B",
        explanation:
          "B is correct: reserve the steady baseline capacity with Reserved Instances for savings, letting on-demand handle bursts. Spot risks interruption for a baseline; single-AZ sacrifices HA.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "sa-stateful-web-app",
    title: "Stateful Web App — MyClothes.com",
    shortLabel: "Stateful Web App",
    section: "Classic Solutions Architectures",
    domain: "Foundations",
    tldr:
      "For a shopping-cart app: keep the web tier stateless with an ELB. Options for the cart — ELB stickiness (pins to one instance), web cookies (client holds state, <4KB, must validate), or (best) a session store in ElastiCache/DynamoDB. Store user data in RDS with read replicas, run everything Multi-AZ, and lock down with chained security groups.",
    subtopics: [
      {
        heading: "Keeping the cart across instances",
        bullets: [
          { icon: "🍪", text: "**ELB Stickiness** — pins a client to one instance (simple, but imbalances load / loses cart if that instance dies)." },
          { icon: "📦", text: "**Web cookies** — client carries cart; app stays **stateless** but requests grow, must be **validated**, **< 4KB**." },
          { icon: "🗄️", text: "**Server session** (best) — send only a **session_id** cookie; store session in **ElastiCache** (or **DynamoDB**)." },
        ],
      },
      {
        heading: "User data & scaling reads",
        bullets: [
          { icon: "👤", text: "Store durable user data (address, profile) in **RDS**." },
          { icon: "📚", text: "Scale reads with **RDS Read Replicas**, or cache reads with **ElastiCache** (lazy loading)." },
        ],
      },
      {
        heading: "HA + security",
        bullets: [
          { icon: "🏢", text: "Run web tier (ASG), **ElastiCache Multi-AZ**, and **RDS Multi-AZ** for disaster recovery." },
          { icon: "🔒", text: "Chain **security groups**: ELB open to the web; EC2 only from ELB; RDS/ElastiCache only from the EC2 SG." },
        ],
      },
    ],
    keyFacts: [
      { label: "Best cart storage", value: "Session store (ElastiCache)", icon: "🗄️" },
      { label: "Cookie limit", value: "< 4 KB, must validate", icon: "🍪" },
      { label: "User data", value: "RDS (+ read replicas)", icon: "👤" },
      { label: "Security", value: "SGs referencing SGs", icon: "🔒" },
    ],
    quickReference: {
      title: "Cart-state options ranked",
      icon: "🎯",
      bullets: [
        "**Stickiness** = quick but couples user to one instance (bad on failure).",
        "**Cookies** = stateless app but heavier/insecure requests (<4KB, validate).",
        "**Session store (ElastiCache/DynamoDB)** = best; keeps app truly stateless.",
        "**RDS** for durable user data; **read replicas / ElastiCache** for read scaling.",
        "Everything **Multi-AZ**; tighten with **security groups referencing each other**.",
      ],
      analogyBrief:
        "A session store is a coat check: the customer holds a tiny ticket (session_id) and any attendant (instance) can retrieve their coat (cart) from the shared rack.",
    },
    explanation:
      "MyClothes.com lets hundreds of concurrent users shop with a cart, so it's stateful. The web tier should stay as stateless as possible behind an ELB and an Auto Scaling Group across multiple AZs. There are three ways to preserve the cart. ELB stickiness (session affinity) pins each client to the same instance — simple, but it unbalances load and loses the cart if that instance fails. Web cookies push the cart into the client so the app stays stateless, but requests get heavier, cookies must be validated (they can be tampered with), and are limited to under 4KB. The best approach is a server-side session: the client only carries a small session_id cookie while the actual session data lives in ElastiCache (or DynamoDB as an alternative), so any instance can serve any user. Durable user data such as addresses goes in RDS, and you scale reads with RDS read replicas or by caching reads in ElastiCache (lazy loading). For resilience, run the web tier's ASG, ElastiCache, and RDS all Multi-AZ so an AZ loss doesn't take you down. Finally, tighten security by chaining security groups: the ELB accepts HTTP/HTTPS from the internet, the EC2 instances accept traffic only from the ELB's security group, and RDS/ElastiCache accept traffic only from the EC2 security group.",
    analogy:
      "A server-side session store is a coat check at a big venue. Instead of making you carry your heavy coat all night (cookies) or forcing you to always return to the same attendant (stickiness), they hand you a tiny numbered ticket (session_id). Any attendant at any counter (any instance) can fetch your coat (cart) from the shared rack (ElastiCache) using that ticket — so the staff are interchangeable and nothing is lost if one goes home.",
    diagram: `<svg viewBox="0 0 720 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Stateful app architecture">${svgDefs}
      ${box(20, 100, 80, 50, "Users", "session_id", "#8b949e")}
      ${box(130, 100, 90, 50, "ELB", "", "#6b46c1")}
      <line x1="100" y1="125" x2="128" y2="125" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <rect x="250" y="60" width="150" height="130" rx="10" fill="#1a2332" stroke="#ff9900" stroke-dasharray="4 4"/>
      <text x="325" y="80" text-anchor="middle" fill="#ff9900" font-size="10" font-weight="700">ASG multi-AZ</text>
      ${box(265, 90, 120, 40, "EC2", "stateless", "#22c55e")}
      ${box(265, 140, 120, 40, "EC2", "stateless", "#22c55e")}
      <line x1="220" y1="125" x2="248" y2="125" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(450, 35, 220, 45, "ElastiCache (Multi-AZ)", "sessions + cache", "#2563eb")}
      ${box(450, 100, 220, 45, "RDS Master (Multi-AZ)", "user data", "#f59e0b")}
      ${box(450, 165, 220, 45, "RDS Read Replica", "scale reads", "#f59e0b")}
      <line x1="400" y1="105" x2="448" y2="60" stroke="#8b949e" stroke-width="1.5" marker-end="url(#arrow-mute)"/>
      <line x1="400" y1="120" x2="448" y2="120" stroke="#8b949e" stroke-width="1.5" marker-end="url(#arrow-mute)"/>
      <line x1="400" y1="140" x2="448" y2="185" stroke="#8b949e" stroke-width="1.5" marker-end="url(#arrow-mute)"/>
    </svg>`,
    diagramLegend: [
      { color: "#22c55e", label: "Stateless web tier", description: "ASG behind ELB across AZs." },
      { color: "#2563eb", label: "ElastiCache", description: "Session store + read cache (Multi-AZ)." },
      { color: "#f59e0b", label: "RDS", description: "Durable user data; read replicas scale reads." },
    ],
    codeExample: {
      language: "python",
      title: "Session store: any instance retrieves the cart by session_id",
      code: `import redis, json
sessions = redis.Redis(host="sessions.xxxx.cache.amazonaws.com", ssl=True)

def get_cart(session_id):
    data = sessions.get(f"sess:{session_id}")   # any instance can read it
    return json.loads(data) if data else {"items": []}

def save_cart(session_id, cart):
    sessions.set(f"sess:{session_id}", json.dumps(cart), ex=1800)  # 30-min TTL`,
    },
    problemStatement:
      "MyClothes.com scales its web tier horizontally, but users lose their shopping cart whenever the load balancer routes them to a different instance, and a single RDS instance struggles under read-heavy product browsing. Recommend the best way to preserve the cart across instances (and why it beats stickiness and cookies), plus how to scale reads and keep the data tier resilient.",
    questions: [
      {
        q: "What is the BEST way to keep a user's shopping cart available to any web instance while keeping the app stateless?",
        options: [
          "A. Enable ELB stickiness",
          "B. Store the whole cart in a web cookie",
          "C. Store session data in ElastiCache (or DynamoDB) and pass a session_id",
          "D. Store the cart in the instance's local disk",
        ],
        answer: "C",
        explanation:
          "C is correct: a server-side session store lets any instance serve any user via a small session_id, keeping the app stateless. Stickiness couples the user to one instance; large cookies are heavy/insecure; local disk isn't shared.",
      },
      {
        q: "What is a key limitation of storing cart state in web cookies?",
        options: [
          "A. Cookies cannot be sent over HTTPS",
          "B. Cookies are limited (< 4KB), add request weight, and must be validated (can be tampered)",
          "C. Cookies require a NAT gateway",
          "D. Cookies only work with sticky sessions",
        ],
        answer: "B",
        explanation:
          "B is correct: cookies are under ~4KB, make every request heavier, and are a security risk unless validated. A/C/D are false.",
      },
      {
        q: "Where should durable user data (name, address) be stored, and how do you scale heavy read traffic?",
        options: [
          "A. In ElastiCache only; it's durable",
          "B. In RDS, using read replicas (or ElastiCache caching) to scale reads",
          "C. In web cookies",
          "D. On the EC2 instance store",
        ],
        answer: "B",
        explanation:
          "B is correct: durable relational user data belongs in RDS, and you scale reads with read replicas or by caching in ElastiCache. Caches aren't the durable source of truth; cookies/instance store are inappropriate.",
      },
      {
        q: "How should security groups be configured for the data tier (RDS/ElastiCache)?",
        options: [
          "A. Open to 0.0.0.0/0",
          "B. Allow traffic only from the EC2 instances' security group",
          "C. Allow traffic only from the ELB's security group",
          "D. Disable security groups",
        ],
        answer: "B",
        explanation:
          "B is correct: RDS/ElastiCache should accept traffic only from the EC2 security group (which itself only accepts from the ELB). Opening to the world or referencing the ELB directly is wrong for the data tier.",
      },
      {
        q: "A drawback of ELB stickiness for a stateful app is:",
        options: [
          "A. It encrypts the cart",
          "B. It can imbalance load and the user loses their cart if their pinned instance fails",
          "C. It requires DynamoDB",
          "D. It makes the app fully stateless",
        ],
        answer: "B",
        explanation:
          "B is correct: stickiness pins users to one instance, which can unbalance load and lose the session if that instance dies. It does not encrypt data, require DynamoDB, or make the app stateless.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "sa-wordpress",
    title: "MyWordPress.com — Scalable Stateful Web App",
    shortLabel: "MyWordPress.com",
    section: "Classic Solutions Architectures",
    domain: "Foundations",
    tldr:
      "A scalable WordPress site stores user/blog data in a MySQL database (use Aurora Multi-AZ + read replicas for easy HA and read scaling) and stores uploaded images on shared storage. EBS works only for a single instance; a multi-instance fleet must use EFS so every instance sees the same images.",
    subtopics: [
      {
        heading: "Database layer",
        bullets: [
          { icon: "🗄️", text: "Blog content & users in **MySQL**; use **Aurora MySQL** for easy **Multi-AZ** and **read replicas**." },
        ],
      },
      {
        heading: "Storing images — EBS vs EFS",
        bullets: [
          { icon: "💽", text: "**EBS** attaches to **one instance in one AZ** — fine for a **single-instance** app, but other instances can't see the images." },
          { icon: "📁", text: "**EFS** is a **shared NFS** file system mounted (via ENIs) by **many instances across AZs** — every instance sees the same uploads." },
        ],
      },
      {
        heading: "Why EFS for a distributed app",
        bullets: [
          { icon: "🌐", text: "A horizontally-scaled WordPress fleet needs shared media → **EFS** (distributed)." },
          { icon: "⚠️", text: "With per-instance **EBS**, an image uploaded to instance A is missing on instance B." },
        ],
      },
    ],
    keyFacts: [
      { label: "Database", value: "Aurora MySQL (Multi-AZ + replicas)", icon: "🗄️" },
      { label: "Single-instance storage", value: "EBS", icon: "💽" },
      { label: "Distributed storage", value: "EFS (shared NFS)", icon: "📁" },
      { label: "EFS access", value: "ENI mount per AZ", icon: "🔌" },
    ],
    quickReference: {
      title: "Exam cues",
      icon: "🎯",
      bullets: [
        "'Many instances must share uploaded files' → **EFS** (not EBS).",
        "**EBS = one instance / one AZ**; **EFS = many instances / many AZs**.",
        "Easy Multi-AZ + read scaling for MySQL → **Aurora**.",
        "Image on instance A missing on instance B = classic **EBS-instead-of-EFS** mistake.",
      ],
      analogyBrief:
        "EBS is each employee's personal desk drawer; EFS is a shared filing cabinet everyone in every office can open.",
    },
    explanation:
      "MyWordPress.com must be fully scalable, correctly display uploaded images, and keep user and blog content in a MySQL database. For the database layer, using Amazon Aurora (MySQL-compatible) makes Multi-AZ high availability and read replicas easy, so the data tier scales reads and survives an AZ failure. The subtle part is image storage. Amazon EBS is a block volume attached to a single instance in a single Availability Zone: it's perfectly fine for a single-instance WordPress deployment, but if you scale out to several instances, an image uploaded to instance A lives only on A's EBS volume and is invisible to instance B. The correct choice for a distributed, multi-instance application is Amazon EFS — a managed shared NFS file system that multiple instances across multiple AZs mount through elastic network interfaces, so every instance sees the same uploaded media. In short: EBS for single-instance state, EFS for shared state across a horizontally-scaled fleet.",
    analogy:
      "EBS is like each employee's personal desk drawer — great if only one person works on the project, but useless when the whole team needs the same document, because it's locked in one desk. EFS is the shared filing cabinet in the hallway that everyone, in every office (AZ), can open and read from — so a photo one person files is instantly available to all.",
    diagram: `<svg viewBox="0 0 720 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="WordPress with EFS and Aurora">${svgDefs}
      ${box(20, 100, 80, 50, "Users", "upload", "#8b949e")}
      ${box(130, 100, 90, 50, "ELB", "", "#6b46c1")}
      <line x1="100" y1="125" x2="128" y2="125" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(255, 55, 110, 45, "EC2 (AZ A)", "WordPress", "#22c55e")}
      ${box(255, 150, 110, 45, "EC2 (AZ B)", "WordPress", "#22c55e")}
      <line x1="220" y1="118" x2="253" y2="85" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
      <line x1="220" y1="132" x2="253" y2="168" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
      ${box(430, 100, 120, 50, "EFS", "shared images", "#8b5cf6")}
      <line x1="365" y1="80" x2="428" y2="115" stroke="#8b5cf6" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="365" y1="170" x2="428" y2="135" stroke="#8b5cf6" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(590, 100, 110, 50, "Aurora MySQL", "Multi-AZ", "#f59e0b")}
      <line x1="365" y1="90" x2="588" y2="118" stroke="#8b949e" stroke-width="1" stroke-dasharray="2 4"/>
      <line x1="365" y1="160" x2="588" y2="132" stroke="#8b949e" stroke-width="1" stroke-dasharray="2 4"/>
    </svg>`,
    diagramLegend: [
      { color: "#22c55e", label: "WordPress instances", description: "Fleet across AZs behind the ELB." },
      { color: "#8b5cf6", label: "EFS", description: "Shared NFS so all instances see the same images." },
      { color: "#f59e0b", label: "Aurora MySQL", description: "Multi-AZ database with read replicas." },
    ],
    codeExample: {
      language: "bash",
      title: "Mount the same EFS file system on every WordPress instance",
      code: `# On each EC2 instance (e.g. via user data)
sudo yum install -y amazon-efs-utils
sudo mkdir -p /var/www/html/wp-content/uploads
sudo mount -t efs fs-0123456789abcdef0:/ /var/www/html/wp-content/uploads
# Now an image uploaded on any instance is visible to all of them.`,
    },
    problemStatement:
      "A WordPress site runs on two EC2 instances behind a load balancer. Users report that images sometimes appear and sometimes 404, depending on the request. The images are stored on each instance's EBS volume. Diagnose the root cause and recommend the storage change, plus the database choice that gives easy Multi-AZ and read scaling for the MySQL backend.",
    questions: [
      {
        q: "A multi-instance WordPress fleet stores uploads on per-instance EBS volumes. Why do images intermittently 404?",
        options: [
          "A. EBS is too slow",
          "B. An image uploaded to one instance's EBS isn't visible to the other instances",
          "C. EBS cannot store images",
          "D. The load balancer strips images",
        ],
        answer: "B",
        explanation:
          "B is correct: EBS is attached to a single instance/AZ, so an upload on instance A is missing on instance B — causing intermittent 404s. The fix is shared storage (EFS).",
      },
      {
        q: "Which storage service lets multiple EC2 instances across AZs share the same files?",
        options: ["A. EBS", "B. Instance store", "C. EFS", "D. A larger EBS volume"],
        answer: "C",
        explanation:
          "C is correct: EFS is a shared NFS file system mountable by many instances across AZs. EBS/instance store are single-instance; a bigger EBS is still single-attach.",
      },
      {
        q: "For the MySQL database backing WordPress, which choice gives the EASIEST Multi-AZ HA and read replicas?",
        options: ["A. MySQL on a single EC2 instance", "B. Amazon Aurora (MySQL-compatible)", "C. DynamoDB", "D. Store data in EFS"],
        answer: "B",
        explanation:
          "B is correct: Aurora MySQL provides easy Multi-AZ and up to 15 read replicas. Self-managed MySQL on EC2 is more work; DynamoDB is NoSQL (WordPress needs MySQL); EFS isn't a database.",
      },
      {
        q: "For a SINGLE-instance WordPress deployment, storing images on EBS is:",
        options: [
          "A. Never acceptable",
          "B. Acceptable, since only one instance needs the files",
          "C. Only possible with EFS",
          "D. Requires a read replica",
        ],
        answer: "B",
        explanation:
          "B is correct: with one instance there's no sharing requirement, so EBS is fine. The sharing problem only arises when you scale to multiple instances (then use EFS).",
      },
      {
        q: "How do multiple instances connect to an EFS file system across AZs?",
        options: [
          "A. Via an Elastic IP per instance",
          "B. By mounting EFS through elastic network interfaces (mount targets) per AZ",
          "C. By copying files over SSH",
          "D. Through a CloudFront distribution",
        ],
        answer: "B",
        explanation:
          "B is correct: EFS is mounted via NFS through ENIs (mount targets) in each AZ, so every instance shares the same file system. The others aren't how EFS is accessed.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "instantiating-apps-beanstalk",
    title: "Instantiating Apps Quickly & Elastic Beanstalk",
    shortLabel: "Fast Deploy & Beanstalk",
    section: "Classic Solutions Architectures",
    domain: "Foundations",
    tldr:
      "Speed launches with Golden AMIs (pre-installed apps), user-data bootstrapping (dynamic config), or a hybrid (Beanstalk); restore RDS/EBS from snapshots to skip setup. Elastic Beanstalk is a managed, developer-centric way to deploy the standard ELB+ASG stack — you provide code, AWS provisions and manages it (free; pay for underlying resources).",
    subtopics: [
      {
        heading: "Instantiating applications quickly",
        bullets: [
          { icon: "🖼️", text: "**Golden AMI** — pre-install apps/OS deps and launch from it (fast boot)." },
          { icon: "📜", text: "**User Data bootstrap** — dynamic configuration at launch." },
          { icon: "🔀", text: "**Hybrid** = Golden AMI + user data (**Elastic Beanstalk** uses this)." },
          { icon: "📸", text: "**RDS**: restore from snapshot (schema+data ready). **EBS**: restore from snapshot (formatted, has data)." },
        ],
      },
      {
        heading: "Elastic Beanstalk — overview",
        bullets: [
          { icon: "👩‍💻", text: "Developer-centric way to deploy on AWS; uses EC2, ASG, ELB, RDS under the hood." },
          { icon: "☁️", text: "**Managed**: auto capacity, load balancing, scaling, health monitoring, instance config — you just bring the **code**." },
          { icon: "💸", text: "Beanstalk is **free**; you pay for the underlying resources. You keep **full config control**." },
        ],
      },
      {
        heading: "Components & deployment modes",
        bullets: [
          { icon: "🧩", text: "**Application** → **Application Versions** → **Environments** (dev/test/prod). Supports many platforms + Docker." },
          { icon: "🖥️", text: "**Web Server tier** (ELB + ASG) vs **Worker tier** (pulls from an **SQS** queue, scales on queue depth)." },
          { icon: "🚦", text: "**Single Instance** (great for **dev**) vs **High Availability with Load Balancer** (great for **prod**)." },
        ],
      },
    ],
    keyFacts: [
      { label: "Fast boot", value: "Golden AMI", icon: "🖼️" },
      { label: "Dynamic config", value: "User data", icon: "📜" },
      { label: "Beanstalk cost", value: "Free (pay for resources)", icon: "💸" },
      { label: "Worker tier scales on", value: "SQS queue depth", icon: "🖥️" },
    ],
    quickReference: {
      title: "Exam cues",
      icon: "🎯",
      bullets: [
        "'Boot fast with app pre-installed' → **Golden AMI**.",
        "'Configure dynamically at launch' → **User Data**.",
        "'DB/disk ready instantly' → **restore from snapshot**.",
        "'Developer just wants code to run (ELB+ASG managed)' → **Elastic Beanstalk**.",
        "Beanstalk **Worker tier** scales on **SQS** messages; **Single Instance** = dev, **HA+LB** = prod.",
      ],
      analogyBrief:
        "A Golden AMI is a pre-furnished apartment you move into instantly; Beanstalk is a fully-managed building where you just bring your furniture (code) and staff handle everything else.",
    },
    explanation:
      "Launching a full stack (EC2, EBS, RDS) can be slow if you install apps, load data, and configure everything each time — so you use the cloud to speed it up. For EC2 you can bake a Golden AMI with your applications and OS dependencies pre-installed and launch instances from it, bootstrap dynamic configuration with EC2 User Data scripts, or combine both in a hybrid approach (which is essentially what Elastic Beanstalk does). For databases you restore an RDS instance from a snapshot so it already has the schema and data, and for storage you restore EBS volumes from snapshots so the disk is already formatted and populated. Elastic Beanstalk is a developer-centric, managed way to deploy applications: it uses the same components you'd assemble manually (EC2, Auto Scaling Groups, Elastic Load Balancers, RDS) but automatically handles capacity provisioning, load balancing, scaling, application health monitoring, and instance configuration, so the developer's only responsibility is the application code — while you still retain full control over configuration. Beanstalk itself is free; you pay only for the underlying resources. Its model is an Application that contains Application Versions deployed into Environments (for example dev, test, and prod), and it supports many language platforms plus Docker. Environments come in a Web Server tier (an ELB in front of an ASG) and a Worker tier (which pulls messages from an SQS queue and scales on queue depth). Deployment can be Single Instance (great for development) or High Availability with a Load Balancer across multiple AZs (great for production).",
    analogy:
      "A Golden AMI is a pre-furnished, move-in-ready apartment: you unlock the door and everything's already set up, so you're living there in minutes instead of assembling furniture. User data is the note you leave the building for last-minute customizations. Elastic Beanstalk is renting in a fully-managed building: you just bring your belongings (your code) and the property managers handle the plumbing, security, and scaling the number of units — though you can still adjust your own thermostat (configuration).",
    diagram: `<svg viewBox="0 0 720 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Elastic Beanstalk web and worker tiers">${svgDefs}
      <rect x="20" y="30" width="320" height="190" rx="10" fill="#1a2332" stroke="#22c55e" stroke-dasharray="4 4"/>
      <text x="35" y="52" fill="#22c55e" font-size="12" font-weight="700">Web Server Tier</text>
      ${box(40, 65, 130, 45, "ELB", "", "#6b46c1")}
      ${box(40, 130, 130, 45, "EC2 (ASG)", "web", "#22c55e")}
      ${box(190, 130, 130, 45, "EC2 (ASG)", "web", "#22c55e")}
      <line x1="105" y1="110" x2="105" y2="128" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
      <rect x="390" y="30" width="310" height="190" rx="10" fill="#1a2332" stroke="#f59e0b" stroke-dasharray="4 4"/>
      <text x="405" y="52" fill="#f59e0b" font-size="12" font-weight="700">Worker Tier</text>
      ${box(430, 65, 130, 45, "SQS Queue", "messages", "#ef4444")}
      ${box(410, 130, 120, 45, "EC2 (Worker)", "pulls msgs", "#22c55e")}
      ${box(560, 130, 120, 45, "EC2 (Worker)", "scale on depth", "#3b82f6")}
      <line x1="495" y1="110" x2="470" y2="128" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
      <line x1="495" y1="110" x2="600" y2="128" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
    </svg>`,
    diagramLegend: [
      { color: "#6b46c1", label: "Web tier ELB", description: "Fronts an ASG serving HTTP." },
      { color: "#ef4444", label: "SQS queue", description: "Worker tier pulls messages and scales on depth." },
      { color: "#22c55e", label: "Managed EC2", description: "Beanstalk provisions/manages the instances." },
    ],
    codeExample: {
      language: "bash",
      title: "Deploy an app with the Elastic Beanstalk CLI",
      code: `eb init -p python-3.11 my-app --region us-east-1
eb create my-app-prod --elb-type application     # HA web tier (ELB + ASG)
eb deploy                                        # ship a new application version
eb status`,
    },
    problemStatement:
      "A team wants to deploy a standard web app (ELB + Auto Scaling Group, with an RDS backend) but doesn't want to hand-wire every component or manage scaling and health checks — they just want to push code. Separately, instance boot times are slow because each launch installs packages from scratch. Which AWS service gives the managed 'just run my code' experience, and how do you make instance launches fast?",
    questions: [
      {
        q: "A developer wants to deploy a web app on the standard ELB+ASG stack without manually provisioning or managing it — just push code. Which service fits?",
        options: ["A. AWS Elastic Beanstalk", "B. AWS Lambda only", "C. Raw EC2 with user data", "D. Amazon S3 static hosting"],
        answer: "A",
        explanation:
          "A is correct: Elastic Beanstalk is the managed, developer-centric way to run the ELB+ASG(+RDS) stack — you bring code, AWS provisions and manages it. The others don't match a managed traditional web-app stack.",
      },
      {
        q: "To make EC2 instances boot quickly with the application already installed, you should use:",
        options: [
          "A. A Golden AMI with apps/dependencies pre-installed",
          "B. A larger instance type",
          "C. More Elastic IPs",
          "D. A NAT gateway",
        ],
        answer: "A",
        explanation:
          "A is correct: a Golden AMI bakes in the app and OS dependencies so launches are fast. Bigger instances or networking changes don't shorten install time.",
      },
      {
        q: "In Elastic Beanstalk, which environment tier pulls messages from an SQS queue and scales on queue depth?",
        options: ["A. Web Server tier", "B. Worker tier", "C. Database tier", "D. Cache tier"],
        answer: "B",
        explanation:
          "B is correct: the Worker tier consumes SQS messages and scales based on the number of messages. The Web Server tier is the ELB+ASG front end.",
      },
      {
        q: "How is Elastic Beanstalk priced?",
        options: [
          "A. A flat monthly fee",
          "B. Beanstalk is free; you pay only for the underlying resources it provisions",
          "C. Per deployment",
          "D. Per application version stored",
        ],
        answer: "B",
        explanation:
          "B is correct: Beanstalk itself is free; you pay for the EC2/ELB/RDS resources it creates. The others are invented charges.",
      },
      {
        q: "To instantiate a database that already has your schema and data, you should:",
        options: [
          "A. Restore an RDS instance from a snapshot",
          "B. Launch an empty RDS and import manually every time",
          "C. Use an Elastic IP",
          "D. Store the database in an AMI",
        ],
        answer: "A",
        explanation:
          "A is correct: restoring RDS from a snapshot yields a database with schema and data ready. Manual imports are slow; Elastic IPs are unrelated; databases aren't stored in AMIs.",
      },
    ],
  },
];
