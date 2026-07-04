// ============================================================
// SECTION: CloudFront & Global Accelerator
// Course slides ~p320–342.
// ============================================================
import { svgDefs, type Topic } from "./shared";

const box = (
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  sub: string,
  color = "#8b5cf6",
) => `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#243349" stroke="${color}"/>
  <text x="${x + w / 2}" y="${y + h / 2 - 2}" text-anchor="middle" fill="#e6edf3" font-size="12" font-weight="600">${title}</text>
  <text x="${x + w / 2}" y="${y + h / 2 + 15}" text-anchor="middle" fill="#8b949e" font-size="10">${sub}</text>
`;

export const cloudfrontGaTopics: Topic[] = [
  // -----------------------------------------------------------------
  {
    id: "cloudfront-overview",
    title: "Amazon CloudFront — CDN & Origins",
    shortLabel: "CloudFront Overview",
    section: "CloudFront & Global Accelerator",
    domain: "Networking",
    tldr:
      "CloudFront is a global CDN that caches content at hundreds of edge locations for low-latency reads and DDoS protection (Shield/WAF). Origins: S3 buckets (secured with Origin Access Control), VPC origins (private ALB/NLB/EC2), or custom HTTP origins (S3 website, public ALB).",
    subtopics: [
      {
        heading: "What CloudFront is",
        bullets: [
          { icon: "🌍", text: "**Content Delivery Network** — caches content at **hundreds of edge locations** (Points of Presence)." },
          { icon: "⚡", text: "**Improves read performance** and user experience by serving from the nearest edge." },
          { icon: "🛡️", text: "**DDoS protection** (global footprint), integrates with **AWS Shield** and **AWS WAF**." },
        ],
      },
      {
        heading: "Origins",
        bullets: [
          { icon: "🪣", text: "**S3 bucket** — distribute & cache files; secure it with **Origin Access Control (OAC)** + a bucket policy so only CloudFront can read it." },
          { icon: "🔒", text: "**VPC origin** — private **ALB / NLB / EC2** in private subnets (no need to expose them publicly)." },
          { icon: "🌐", text: "**Custom origin (HTTP)** — an **S3 static website** or any public HTTP backend (e.g. public ALB)." },
        ],
      },
      {
        heading: "How it flows",
        bullets: [
          { icon: "1️⃣", text: "Client hits the **edge**; on a **cache miss** the edge fetches from the **origin** and caches locally." },
          { icon: "2️⃣", text: "Subsequent requests are served straight from the edge cache." },
        ],
      },
    ],
    keyFacts: [
      { label: "Type", value: "Global CDN (edge cache)", icon: "🌍" },
      { label: "Secure S3 origin", value: "Origin Access Control (OAC)", icon: "🔒" },
      { label: "Private backends", value: "VPC origins (ALB/NLB/EC2)", icon: "🔐" },
      { label: "Protection", value: "Shield + WAF", icon: "🛡️" },
    ],
    quickReference: {
      title: "Exam cues",
      icon: "🎯",
      bullets: [
        "'Cache static/dynamic content globally at the edge' → **CloudFront**.",
        "'Serve S3 privately (no public bucket)' → CloudFront + **OAC** + bucket policy.",
        "'Front a private ALB/EC2' → **VPC origin**.",
        "'Add HTTPS/CDN to an S3 website' → CloudFront custom origin.",
        "DDoS/edge security → **Shield + WAF** with CloudFront.",
      ],
      analogyBrief:
        "CloudFront is a chain of local warehouses worldwide: shoppers get goods from the nearest one instead of waiting for a shipment from the single central factory (origin).",
    },
    explanation:
      "Amazon CloudFront is a Content Delivery Network (CDN): it caches your content at hundreds of edge locations (Points of Presence) around the world, so reads are served from the location nearest each user for lower latency and a better experience. Because it fronts your infrastructure globally, it also provides DDoS protection and integrates with AWS Shield and AWS WAF. CloudFront pulls content from an origin, of which there are three kinds. An S3 bucket origin is used to distribute and cache files (and even to upload through CloudFront); you secure it with Origin Access Control (OAC) plus a bucket policy so that only CloudFront — not the public — can read the bucket. A VPC origin lets you serve applications hosted in private subnets (a private Application Load Balancer, Network Load Balancer, or EC2 instances) without exposing them to the Internet. A custom origin is any HTTP backend, including an S3 static website (which you must first enable as a website) or any public HTTP server such as a public ALB. Operationally, a client request hits the nearest edge location; on a cache miss the edge forwards the request to the origin, caches the response locally, and serves subsequent requests directly from the edge.",
    analogy:
      "CloudFront is like a global chain of neighborhood warehouses stocking a factory's products. When you order, you get the item from the warehouse nearest you (the edge) rather than waiting for it to ship from the single distant factory (the origin). The first time a warehouse doesn't have an item it fetches one from the factory and keeps spares on the shelf; after that, local customers are served instantly.",
    diagram: `<svg viewBox="0 0 720 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="CloudFront CDN">${svgDefs}
      ${box(20, 40, 90, 40, "User (US)", "", "#8b949e")}
      ${box(20, 150, 90, 40, "User (EU)", "", "#8b949e")}
      ${box(160, 40, 110, 40, "Edge (US)", "cache", "#8b5cf6")}
      ${box(160, 150, 110, 40, "Edge (EU)", "cache", "#8b5cf6")}
      <line x1="110" y1="60" x2="158" y2="60" stroke="#22c55e" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="110" y1="170" x2="158" y2="170" stroke="#22c55e" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(430, 95, 150, 55, "Origin", "S3 / VPC / HTTP", "#16a34a")}
      <line x1="270" y1="65" x2="428" y2="110" stroke="#ff9900" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#arrow)"/>
      <line x1="270" y1="165" x2="428" y2="135" stroke="#ff9900" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#arrow)"/>
      <text x="330" y="90" fill="#8b949e" font-size="9">cache miss → origin</text>
      ${box(600, 95, 100, 55, "Shield/WAF", "protection", "#ef4444")}
    </svg>`,
    diagramLegend: [
      { color: "#8b5cf6", label: "Edge locations", description: "Cache content near users worldwide." },
      { color: "#16a34a", label: "Origin", description: "S3 (with OAC), VPC (private ALB/EC2), or HTTP." },
      { color: "#ef4444", label: "Shield / WAF", description: "DDoS and application-layer protection." },
    ],
    codeExample: {
      language: "bash",
      title: "S3 bucket policy allowing only CloudFront (via OAC) to read",
      code: `# Grant CloudFront's service principal read access, scoped to your distribution
# (attached to the S3 origin bucket)
# { "Effect": "Allow",
#   "Principal": { "Service": "cloudfront.amazonaws.com" },
#   "Action": "s3:GetObject",
#   "Resource": "arn:aws:s3:::my-bucket/*",
#   "Condition": { "StringEquals": {
#     "AWS:SourceArn": "arn:aws:cloudfront::123456789012:distribution/EDFDVBD6EXAMPLE" }}}
aws cloudfront create-distribution --distribution-config file://dist.json`,
    },
    problemStatement:
      "A global site serves static assets from an S3 bucket and dynamic APIs from an ALB, and suffers slow load times for far-away users plus occasional DDoS. Security also insists the S3 bucket must NOT be publicly accessible. Which service caches content near users, and how do you keep the S3 origin private while still letting the CDN read it?",
    questions: [
      {
        q: "What is Amazon CloudFront primarily used for?",
        options: [
          "A. Running containers",
          "B. Caching content at global edge locations to improve read performance (CDN)",
          "C. Relational databases",
          "D. Message queuing",
        ],
        answer: "B",
        explanation:
          "B is correct: CloudFront is a CDN that caches content at hundreds of edge locations for low-latency delivery (with Shield/WAF protection). The others are unrelated services.",
      },
      {
        q: "How do you keep an S3 origin bucket PRIVATE while allowing CloudFront to serve its content?",
        options: [
          "A. Make the bucket public",
          "B. Use Origin Access Control (OAC) with a bucket policy allowing only CloudFront",
          "C. Use a NAT gateway",
          "D. Enable Requester Pays",
        ],
        answer: "B",
        explanation:
          "B is correct: OAC plus a bucket policy restricts reads to CloudFront, keeping the bucket private. Making it public defeats the requirement; NAT/Requester Pays don't apply.",
      },
      {
        q: "Which origin type lets CloudFront serve a private ALB or EC2 in a private subnet without exposing it to the internet?",
        options: ["A. S3 origin", "B. VPC origin", "C. Custom HTTP origin", "D. Glacier origin"],
        answer: "B",
        explanation:
          "B is correct: a VPC origin delivers from private ALB/NLB/EC2 in private subnets. S3 and custom HTTP origins are different; there's no 'Glacier origin'.",
      },
      {
        q: "On a cache MISS at an edge location, what does CloudFront do?",
        options: [
          "A. Returns a 404 immediately",
          "B. Fetches from the origin, caches it at the edge, then serves it",
          "C. Redirects the user to the origin's IP",
          "D. Deletes the object",
        ],
        answer: "B",
        explanation:
          "B is correct: on a miss the edge forwards to the origin, caches the response, and serves it — subsequent requests are cache hits. It doesn't 404 or redirect to the origin.",
      },
      {
        q: "Which AWS services integrate with CloudFront for security/DDoS protection?",
        options: ["A. Shield and WAF", "B. RDS and Aurora", "C. SQS and SNS", "D. EFS and FSx"],
        answer: "A",
        explanation:
          "A is correct: CloudFront integrates with AWS Shield (DDoS) and AWS WAF (web application firewall). The others aren't edge-security services.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "cloudfront-caching-geo",
    title: "CloudFront Caching, Geo Restriction & Invalidations",
    shortLabel: "CloudFront Caching & Geo",
    section: "CloudFront & Global Accelerator",
    domain: "Networking",
    tldr:
      "CloudFront caches for a TTL and is great for static content everywhere; S3 Cross-Region Replication suits low-latency dynamic reads in a few Regions. Geo Restriction allow/blocklists by country (3rd-party Geo-IP). Cache Invalidations force a refresh (/* or /path/*) before the TTL expires.",
    subtopics: [
      {
        heading: "CloudFront vs S3 Cross-Region Replication",
        bullets: [
          { icon: "🌍", text: "**CloudFront** — global edge cache, TTL-based; best for **static** content that must be everywhere." },
          { icon: "🔁", text: "**S3 CRR** — set up per Region, near-real-time, **read-only**; best for **dynamic** content low-latency in a **few** Regions." },
        ],
      },
      {
        heading: "Geo Restriction",
        bullets: [
          { icon: "✅", text: "**Allowlist** — only listed countries can access." },
          { icon: "⛔", text: "**Blocklist** — listed countries are denied. Country determined by a **3rd-party Geo-IP** database." },
          { icon: "⚖️", text: "Use case: **copyright / licensing** rules by country." },
        ],
      },
      {
        heading: "Cache Invalidations",
        bullets: [
          { icon: "♻️", text: "After you update the origin, the edge keeps the old copy until the **TTL** expires." },
          { icon: "🧹", text: "Force a refresh with an **invalidation**: all files (**/***) or a path (**/images/***)." },
        ],
      },
    ],
    keyFacts: [
      { label: "CloudFront best for", value: "Static content, everywhere", icon: "🌍" },
      { label: "S3 CRR best for", value: "Dynamic, few Regions", icon: "🔁" },
      { label: "Geo Restriction", value: "Allow/blocklist by country", icon: "⛔" },
      { label: "Force refresh", value: "Invalidation (/* or /path/*)", icon: "♻️" },
    ],
    quickReference: {
      title: "Exam cues",
      icon: "🎯",
      bullets: [
        "'Cache static assets globally' → **CloudFront** (TTL).",
        "'Low-latency dynamic reads in a couple of Regions' → **S3 CRR**.",
        "'Restrict content by country (licensing)' → **Geo Restriction** allow/blocklist.",
        "'Pushed new content but users see old' → **cache invalidation** (or wait for TTL).",
      ],
      analogyBrief:
        "An invalidation is telling every branch warehouse to throw out the old flyer immediately instead of waiting for the next print cycle (TTL).",
    },
    explanation:
      "CloudFront and S3 Cross-Region Replication both improve access but differ. CloudFront uses a global edge network and caches files for a TTL (perhaps a day), making it ideal for static content that must be available everywhere. S3 Cross-Region Replication must be set up for each Region you want, updates in near real-time, is read-only, and is best for dynamic content that needs low-latency access in a few specific Regions. CloudFront Geo Restriction lets you control who can reach a distribution by country: an allowlist permits only listed countries, a blocklist denies listed countries, and the country is determined using a third-party Geo-IP database — a common use case is enforcing copyright or licensing rules by geography. Finally, because edge locations cache content for its TTL, updating the origin doesn't immediately change what users see; a CloudFront Cache Invalidation forces a refresh before the TTL expires, and you can invalidate all files with /* or a specific path such as /images/*.",
    analogy:
      "CloudFront caching is like every neighborhood store keeping this week's flyer on the counter — fast for everyone, but if head office reprints the flyer, the stores keep handing out the old one until the week is up (the TTL). A cache invalidation is head office phoning every store: 'throw out the old flyer right now and grab the new one.' Geo Restriction is a store policy that only serves — or refuses — customers from certain countries, based on where their ID says they're from.",
    diagram: `<svg viewBox="0 0 720 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="CloudFront invalidation and geo restriction">${svgDefs}
      ${box(20, 40, 100, 45, "Origin", "updated file", "#16a34a")}
      ${box(170, 20, 110, 40, "Edge (US)", "old cache", "#8b5cf6")}
      ${box(170, 80, 110, 40, "Edge (EU)", "old cache", "#8b5cf6")}
      <line x1="120" y1="55" x2="168" y2="40" stroke="#8b949e" stroke-width="1.5" stroke-dasharray="3 3"/>
      <line x1="120" y1="70" x2="168" y2="100" stroke="#8b949e" stroke-width="1.5" stroke-dasharray="3 3"/>
      ${box(330, 45, 130, 45, "Invalidation", "/* or /path/*", "#ef4444")}
      <line x1="280" y1="40" x2="328" y2="60" stroke="#ef4444" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="280" y1="100" x2="328" y2="75" stroke="#ef4444" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="395" y="110" text-anchor="middle" fill="#8b949e" font-size="9">forces refresh before TTL</text>
      ${box(510, 45, 180, 45, "Geo Restriction", "allow/blocklist by country", "#f59e0b")}
    </svg>`,
    diagramLegend: [
      { color: "#8b5cf6", label: "Edge cache", description: "Holds content for the TTL." },
      { color: "#ef4444", label: "Invalidation", description: "Forces edges to drop cached objects early." },
      { color: "#f59e0b", label: "Geo Restriction", description: "Allow/blocklist access by country." },
    ],
    codeExample: {
      language: "bash",
      title: "Invalidate cached files after deploying new content",
      code: `# Refresh everything
aws cloudfront create-invalidation \\
  --distribution-id E123456ABCDEF \\
  --paths "/*"

# Or just a folder
aws cloudfront create-invalidation \\
  --distribution-id E123456ABCDEF \\
  --paths "/images/*"`,
    },
    problemStatement:
      "After deploying a new /index.html to your origin, users worldwide still see the old page for hours. You also must block viewers in two countries from accessing licensed video, and a colleague asks whether CloudFront or S3 CRR is better for globally-cached static assets. Explain how to force the new content live, how to enforce the country block, and the CloudFront-vs-CRR guidance.",
    questions: [
      {
        q: "You deployed new content to the origin, but CloudFront still serves the old version. Without waiting for the TTL, what do you do?",
        options: [
          "A. Create a cache invalidation (e.g. /* or /path/*)",
          "B. Delete the distribution",
          "C. Enable S3 CRR",
          "D. Lower the S3 storage class",
        ],
        answer: "A",
        explanation:
          "A is correct: an invalidation forces edges to refresh specified paths before the TTL expires. Deleting the distribution is drastic; CRR and storage class don't refresh the cache.",
      },
      {
        q: "To prevent users in specific countries from accessing a CloudFront distribution (e.g. for licensing), use:",
        options: ["A. Geo Restriction (allow/blocklist)", "B. A bucket policy", "C. Multi-Value routing", "D. Transfer Acceleration"],
        answer: "A",
        explanation:
          "A is correct: CloudFront Geo Restriction allow/blocklists by country using a Geo-IP database. Bucket policies don't do country logic; the others are unrelated.",
      },
      {
        q: "Which is the better fit for STATIC content that must be cached and served globally with low latency?",
        options: ["A. S3 Cross-Region Replication", "B. Amazon CloudFront", "C. RDS read replicas", "D. EFS"],
        answer: "B",
        explanation:
          "B is correct: CloudFront caches static content at global edges. S3 CRR is better for dynamic, read-only content needed in a few specific Regions; RDS/EFS aren't CDNs.",
      },
      {
        q: "S3 Cross-Region Replication (vs CloudFront) is best described as:",
        options: [
          "A. A global edge cache with TTLs",
          "B. Per-Region, near-real-time, read-only replication for low-latency dynamic reads in a few Regions",
          "C. A DDoS protection service",
          "D. A message queue",
        ],
        answer: "B",
        explanation:
          "B is correct: CRR is set up per Region, updates near-real-time, and is read-only — good for dynamic content in a few Regions. The global edge cache with TTLs is CloudFront.",
      },
      {
        q: "How does CloudFront determine a viewer's country for Geo Restriction?",
        options: [
          "A. From the S3 bucket region",
          "B. Using a 3rd-party Geo-IP database",
          "C. From the object tags",
          "D. From the TTL value",
        ],
        answer: "B",
        explanation:
          "B is correct: CloudFront maps the viewer's IP to a country via a third-party Geo-IP database. Bucket region, tags, and TTL are irrelevant to geolocation.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "global-accelerator",
    title: "AWS Global Accelerator (& vs CloudFront)",
    shortLabel: "Global Accelerator",
    section: "CloudFront & Global Accelerator",
    domain: "Networking",
    tldr:
      "Global Accelerator gives you 2 static Anycast IPs that send users onto AWS's private network at the nearest edge, then to your app (ALB/NLB/EC2/EIP) — improving latency, giving fast failover, and stable IPs. Unlike CloudFront (which caches content at the edge), GA proxies TCP/UDP packets to your Regions.",
    subtopics: [
      {
        heading: "The problem & Anycast",
        bullets: [
          { icon: "🐌", text: "Global users over the public Internet hit many hops → latency. GA sends them onto **AWS's private network** ASAP." },
          { icon: "📡", text: "**Unicast** = one IP per server; **Anycast** = all servers share one IP and the client hits the nearest. GA gives **2 static Anycast IPs**." },
        ],
      },
      {
        heading: "How Global Accelerator works",
        bullets: [
          { icon: "🚪", text: "Traffic enters at the nearest **edge location** via the Anycast IPs, then rides the AWS backbone to your app." },
          { icon: "🎯", text: "Works with **ALB, NLB, EC2, Elastic IP** (public or private); **health checks** enable fast regional **failover (<1 min)**." },
          { icon: "🔐", text: "Only **2 external IPs** to allowlist; **AWS Shield** DDoS protection; no client-cache issues (IP never changes)." },
        ],
      },
      {
        heading: "Global Accelerator vs CloudFront",
        bullets: [
          { icon: "🗂️", text: "**CloudFront** — caches content (static & dynamic) **at the edge**; content served from the edge." },
          { icon: "🔀", text: "**GA** — no caching; **proxies packets** (TCP/UDP) at the edge to your Regions. Good for **non-HTTP** (gaming/UDP, IoT/MQTT, VoIP), **static IPs**, and fast regional failover." },
        ],
      },
    ],
    keyFacts: [
      { label: "Provides", value: "2 static Anycast IPs", icon: "📡" },
      { label: "Failover", value: "< 1 minute (health checks)", icon: "🎯" },
      { label: "Protocols", value: "TCP / UDP (any app)", icon: "🔀" },
      { label: "vs CloudFront", value: "GA proxies; CF caches", icon: "🗂️" },
    ],
    quickReference: {
      title: "GA vs CloudFront cues",
      icon: "🎯",
      bullets: [
        "'Need static IPs + fast regional failover for TCP/UDP' → **Global Accelerator**.",
        "'Gaming (UDP), IoT (MQTT), VoIP' → **Global Accelerator**.",
        "'Cache images/videos/dynamic at the edge' → **CloudFront**.",
        "Both use the AWS edge network + **Shield** for DDoS.",
        "GA IPs never change → no client cache problems / easy allowlisting.",
      ],
      analogyBrief:
        "CloudFront stocks copies of goods in local warehouses; Global Accelerator is an express private toll-road that gets your car to the right factory fastest — it doesn't stock anything.",
    },
    explanation:
      "When you have global users hitting an application deployed in one or a few Regions, traffic over the public Internet crosses many hops and adds latency. AWS Global Accelerator fixes this by getting users onto AWS's private network as quickly as possible. It relies on Anycast: with unicast one server holds one IP, but with Anycast all servers share the same IP and the client is routed to the nearest one — Global Accelerator provisions two static Anycast IPs for your application. Traffic enters at the nearest edge location through those IPs and then travels over AWS's fast internal backbone to your application, which can be an Application Load Balancer, Network Load Balancer, EC2 instance, or Elastic IP (public or private). Global Accelerator performs health checks for fast, deterministic regional failover (typically under a minute), exposes only two external IPs to allowlist, and provides DDoS protection through AWS Shield; because the IP never changes there are no client-cache issues. Compared with CloudFront: both use the AWS global edge network and integrate with Shield, but CloudFront is a CDN that caches content (static and dynamic) at the edge and serves it from there, whereas Global Accelerator does not cache — it proxies TCP/UDP packets at the edge to applications in your Regions. That makes Global Accelerator a good fit for non-HTTP use cases such as gaming (UDP), IoT (MQTT), and Voice over IP, as well as HTTP use cases that need static IP addresses or fast, deterministic regional failover.",
    analogy:
      "CloudFront is a chain of local warehouses that stock copies of your products so customers grab them nearby. Global Accelerator doesn't stock anything — it's a private express toll-road with two fixed on-ramps (the Anycast IPs) that gets each driver onto AWS's fast internal highway at the nearest entrance and speeds them to the correct factory (Region), automatically rerouting to a backup factory if one closes.",
    diagram: `<svg viewBox="0 0 720 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Global Accelerator">${svgDefs}
      ${box(20, 40, 90, 40, "User (US)", "", "#8b949e")}
      ${box(20, 150, 90, 40, "User (AU)", "", "#8b949e")}
      ${box(160, 40, 110, 40, "Edge (US)", "Anycast IP", "#8b5cf6")}
      ${box(160, 150, 110, 40, "Edge (AU)", "Anycast IP", "#8b5cf6")}
      <line x1="110" y1="60" x2="158" y2="60" stroke="#22c55e" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="110" y1="170" x2="158" y2="170" stroke="#22c55e" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(470, 95, 150, 55, "App (Region)", "ALB/NLB/EC2/EIP", "#16a34a")}
      <line x1="270" y1="60" x2="468" y2="110" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="270" y1="170" x2="468" y2="135" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="360" y="95" fill="#8b949e" font-size="9">AWS private backbone</text>
    </svg>`,
    diagramLegend: [
      { color: "#8b5cf6", label: "Edge (Anycast IPs)", description: "Two static IPs; users enter at the nearest edge." },
      { color: "#16a34a", label: "Application", description: "ALB/NLB/EC2/EIP reached over AWS's backbone." },
      { color: "#22c55e", label: "User traffic", description: "Onto the private network ASAP for low latency." },
    ],
    codeExample: {
      language: "bash",
      title: "Create a Global Accelerator (yields 2 static Anycast IPs)",
      code: `aws globalaccelerator create-accelerator \\
  --name my-global-app \\
  --ip-address-type IPV4 \\
  --enabled
# Then add a listener (TCP/UDP) and endpoint groups pointing at your ALB/NLB/EC2.`,
    },
    problemStatement:
      "A multiplayer game uses UDP and needs the lowest possible latency for players worldwide, two fixed IP addresses that partners can allowlist, and automatic failover to a backup Region within a minute if the primary fails. A teammate suggests CloudFront. Explain why Global Accelerator is the better fit here and how it differs from CloudFront.",
    questions: [
      {
        q: "How many static IP addresses does AWS Global Accelerator provide for an application, and what kind are they?",
        options: [
          "A. One unicast IP",
          "B. Two static Anycast IPs",
          "C. One per edge location",
          "D. A rotating pool of dynamic IPs",
        ],
        answer: "B",
        explanation:
          "B is correct: GA gives two static Anycast IPs, so clients reach the nearest edge and the IPs never change (easy allowlisting, no cache issues).",
      },
      {
        q: "Which is the KEY difference between Global Accelerator and CloudFront?",
        options: [
          "A. GA caches content at the edge; CloudFront proxies packets",
          "B. CloudFront caches content at the edge; GA proxies TCP/UDP packets to your Regions (no caching)",
          "C. They are identical",
          "D. GA only works for HTTP",
        ],
        answer: "B",
        explanation:
          "B is correct: CloudFront is a caching CDN; Global Accelerator does not cache — it proxies TCP/UDP packets from the edge to your app Regions. GA supports non-HTTP too.",
      },
      {
        q: "A UDP-based multiplayer game needs lowest latency worldwide and fast regional failover. Which service?",
        options: ["A. CloudFront", "B. Global Accelerator", "C. S3 Transfer Acceleration", "D. Route 53 only"],
        answer: "B",
        explanation:
          "B is correct: Global Accelerator suits non-HTTP (UDP) workloads, provides static IPs, and offers deterministic sub-minute regional failover. CloudFront is HTTP-cache oriented; the others don't fit.",
      },
      {
        q: "Which endpoints can Global Accelerator route traffic to?",
        options: [
          "A. Only S3 buckets",
          "B. ALB, NLB, EC2 instances, and Elastic IPs (public or private)",
          "C. Only CloudFront distributions",
          "D. Only DynamoDB",
        ],
        answer: "B",
        explanation:
          "B is correct: GA works with ALB, NLB, EC2, and Elastic IP endpoints. It doesn't target S3/DynamoDB/CloudFront as endpoints.",
      },
      {
        q: "Anycast (used by Global Accelerator) means:",
        options: [
          "A. Each server has a unique IP",
          "B. All servers share one IP and the client is routed to the nearest",
          "C. IPs change on every request",
          "D. Traffic is broadcast to all servers at once",
        ],
        answer: "B",
        explanation:
          "B is correct: with Anycast, many servers advertise the same IP and clients reach the closest one. Unicast is one-IP-per-server (A); the others are inaccurate.",
      },
    ],
  },
];
