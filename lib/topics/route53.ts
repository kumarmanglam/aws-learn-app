// ============================================================
// SECTION: Amazon Route 53 — DNS
// Course slides ~p194–225.
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

export const route53Topics: Topic[] = [
  // -----------------------------------------------------------------
  {
    id: "dns-fundamentals",
    title: "DNS Fundamentals — How Name Resolution Works",
    shortLabel: "DNS Fundamentals",
    section: "Amazon Route 53 — DNS",
    domain: "Networking",
    tldr:
      "DNS translates human-friendly hostnames (www.google.com) into machine IPs (172.217.18.36) using a hierarchical system. A client asks a resolver, which walks Root → TLD → SLD name servers, then caches the answer for its TTL.",
    subtopics: [
      {
        heading: "What DNS is",
        bullets: [
          { icon: "🌐", text: "The **Domain Name System** maps hostnames → IP addresses; it's the **backbone of the Internet**." },
          { icon: "🌲", text: "Uses a **hierarchical** naming structure: .com → example.com → www.example.com." },
        ],
      },
      {
        heading: "Key terminology",
        bullets: [
          { icon: "🏷️", text: "**Domain Registrar** (Route 53, GoDaddy) registers your domain name." },
          { icon: "📄", text: "**DNS records** (A, AAAA, CNAME, NS…) live in a **Zone File**." },
          { icon: "🖥️", text: "**Name Server** resolves queries; **TLD** = .com/.org; **SLD** = amazon.com." },
        ],
      },
      {
        heading: "How resolution works",
        bullets: [
          { icon: "1️⃣", text: "Browser asks the **Local DNS Resolver** (ISP/company)." },
          { icon: "2️⃣", text: "Resolver queries **Root** → **TLD (.com)** → **SLD** name servers to find the IP." },
          { icon: "💾", text: "The answer is **cached for its TTL**, so repeat lookups are fast." },
        ],
      },
    ],
    keyFacts: [
      { label: "DNS maps", value: "Hostname → IP", icon: "🌐" },
      { label: "TLD", value: ".com, .org, .gov", icon: "🏷️" },
      { label: "SLD", value: "amazon.com", icon: "📛" },
      { label: "Cache duration", value: "TTL", icon: "💾" },
    ],
    quickReference: {
      title: "DNS building blocks",
      icon: "🧭",
      bullets: [
        "**Registrar** = where you buy the domain (can differ from DNS service).",
        "**Name server** = answers queries (authoritative or not).",
        "Resolution order: **Root → TLD → SLD**.",
        "**TTL** controls how long resolvers cache an answer.",
        "**FQDN** = full name incl. trailing root dot (api.www.example.com.).",
      ],
      analogyBrief:
        "DNS is the Internet's phone book: you know a name (a website), DNS looks up the number (the IP) so your call connects.",
    },
    explanation:
      "The Domain Name System translates human-friendly hostnames such as www.google.com into the machine IP addresses (like 172.217.18.36) that computers actually route to; it is the backbone of the Internet and uses a hierarchical naming structure (.com, then example.com, then www.example.com). Key terms: a Domain Registrar (such as Amazon Route 53 or GoDaddy) is where you register a domain; DNS records (A, AAAA, CNAME, NS, and more) are stored in a zone file; a name server resolves DNS queries and may be authoritative or non-authoritative; the top-level domain (TLD) is the suffix like .com or .org; and the second-level domain (SLD) is the registrable name like amazon.com. Resolution works like this: your browser asks a local DNS resolver (assigned by your company or ISP); if it doesn't have a cached answer, it queries the Root name servers, which point to the TLD name servers (e.g. .com), which point to the SLD name servers that finally return the IP. The resolver caches that answer for its TTL, so repeated lookups are fast.",
    analogy:
      "DNS is the Internet's phone book. You remember a person's name (a website like example.com) but not their number (the IP address). DNS is the operator who looks up the name and gives you the number so your call connects — and once you've been given a number, you jot it down for a while (the TTL cache) instead of asking again.",
    diagram: `<svg viewBox="0 0 720 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="How DNS works">${svgDefs}
      ${box(20, 100, 110, 50, "Web Browser", "wants example.com", "#8b949e")}
      ${box(180, 100, 130, 50, "Local Resolver", "cache + TTL", "#8b5cf6")}
      <line x1="130" y1="125" x2="178" y2="125" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(400, 20, 130, 40, "Root DNS", ".com NS", "#6b46c1")}
      ${box(400, 105, 130, 40, "TLD DNS (.com)", "example.com NS", "#6b46c1")}
      ${box(400, 190, 130, 40, "SLD DNS", "example.com IP", "#6b46c1")}
      <line x1="310" y1="115" x2="398" y2="45" stroke="#8b949e" stroke-width="1.5" stroke-dasharray="3 3" marker-end="url(#arrow-mute)"/>
      <line x1="310" y1="125" x2="398" y2="125" stroke="#8b949e" stroke-width="1.5" stroke-dasharray="3 3" marker-end="url(#arrow-mute)"/>
      <line x1="310" y1="135" x2="398" y2="205" stroke="#8b949e" stroke-width="1.5" stroke-dasharray="3 3" marker-end="url(#arrow-mute)"/>
      ${box(590, 105, 110, 50, "Web Server", "9.10.11.12", "#22c55e")}
      <line x1="130" y1="115" x2="588" y2="118" stroke="#22c55e" stroke-width="1" stroke-dasharray="2 4"/>
    </svg>`,
    diagramLegend: [
      { color: "#8b5cf6", label: "Local resolver", description: "First stop; caches answers for the TTL." },
      { color: "#6b46c1", label: "Authoritative servers", description: "Root → TLD → SLD chain that holds the record." },
      { color: "#22c55e", label: "Web server", description: "The IP finally returned to the browser." },
    ],
    codeExample: {
      language: "bash",
      title: "Trace DNS resolution from the command line",
      code: `# See the full delegation chain (Root -> TLD -> SLD)
dig +trace www.example.com

# Ask a specific resolver and show TTL
dig @8.8.8.8 www.example.com A

# Quick lookup
nslookup www.example.com`,
    },
    problemStatement:
      "A colleague changed a website's IP in DNS an hour ago, but some users still reach the old server while others see the new one. Explain, using DNS resolution and TTL, why this split-brain behavior happens and what setting would have made the cutover propagate faster next time.",
    questions: [
      {
        q: "What is the fundamental job of DNS?",
        options: [
          "A. Encrypt traffic between client and server",
          "B. Translate human-friendly hostnames into IP addresses",
          "C. Load balance requests across servers",
          "D. Store website content",
        ],
        answer: "B",
        explanation:
          "B is correct: DNS maps hostnames (www.example.com) to IPs. Encryption is TLS, load balancing is ELB, and content storage is S3/servers — not DNS.",
      },
      {
        q: "In example.com, which part is the Top-Level Domain (TLD)?",
        options: ["A. example", "B. www", "C. .com", "D. example.com"],
        answer: "C",
        explanation:
          "C is correct: .com is the TLD. 'example.com' is the SLD, 'www' is a subdomain, and 'example' alone is just a label.",
      },
      {
        q: "What determines how long a DNS resolver caches an answer before asking again?",
        options: ["A. The record's TTL", "B. The SLD length", "C. The registrar", "D. The client's OS version"],
        answer: "A",
        explanation:
          "A is correct: the TTL (time to live) sets the cache duration. Registrar and SLD don't control caching; the OS honors the TTL rather than overriding it.",
      },
      {
        q: "Which order does a resolver follow to resolve a new hostname?",
        options: [
          "A. SLD → TLD → Root",
          "B. Root → TLD → SLD",
          "C. TLD → Root → SLD",
          "D. Registrar → ISP → Root",
        ],
        answer: "B",
        explanation:
          "B is correct: the resolver walks Root name servers → TLD name servers (.com) → SLD name servers to find the authoritative IP.",
      },
      {
        q: "A 'Domain Registrar' is best described as:",
        options: [
          "A. The server that stores your website files",
          "B. Where you register/purchase a domain name",
          "C. The protocol that encrypts DNS",
          "D. A type of DNS record",
        ],
        answer: "B",
        explanation:
          "B is correct: a registrar (Route 53, GoDaddy) is where you register/buy a domain. It often provides DNS service too, but that is a separate function.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "route53-records",
    title: "Route 53 — Records, Hosted Zones & TTL",
    shortLabel: "Route 53 Records",
    section: "Amazon Route 53 — DNS",
    domain: "Networking",
    tldr:
      "Route 53 is a highly available, authoritative managed DNS and domain registrar with a 100% availability SLA. You create records (A, AAAA, CNAME, NS) in hosted zones — public (Internet) or private (VPC) — at $0.50/zone/month, and control caching via TTL (mandatory except for Alias records).",
    subtopics: [
      {
        heading: "What Route 53 is",
        bullets: [
          { icon: "🛡️", text: "Highly available, scalable, **authoritative** DNS — you control the records. The only AWS service with a **100% availability SLA**." },
          { icon: "🏷️", text: "Also a **domain registrar**; can **health-check** your resources. ('53' = the DNS port.)" },
        ],
      },
      {
        heading: "Records & record types",
        bullets: [
          { icon: "📄", text: "A record = domain name, **record type**, **value**, **routing policy**, **TTL**." },
          { icon: "🔤", text: "Must-know types: **A** (→ IPv4), **AAAA** (→ IPv6), **CNAME** (→ another hostname), **NS** (name servers for the zone)." },
          { icon: "🧩", text: "Advanced: CAA, DS, MX, NAPTR, PTR, SOA, TXT, SPF, SRV." },
        ],
      },
      {
        heading: "Hosted zones & TTL",
        bullets: [
          { icon: "🌍", text: "**Public Hosted Zone** — records for Internet-routable names. **Private Hosted Zone** — names resolvable only inside your **VPC(s)**." },
          { icon: "💵", text: "Costs **$0.50 per hosted zone per month**." },
          { icon: "⏱️", text: "**High TTL** = less Route 53 traffic but possibly stale; **Low TTL** = fresher, easy to change, more queries ($). TTL is **mandatory except for Alias records**." },
        ],
      },
    ],
    keyFacts: [
      { label: "SLA", value: "100% availability", icon: "🛡️" },
      { label: "Must-know types", value: "A, AAAA, CNAME, NS", icon: "🔤" },
      { label: "Zone types", value: "Public / Private (VPC)", icon: "🌍" },
      { label: "Hosted zone cost", value: "$0.50 / month", icon: "💵" },
    ],
    quickReference: {
      title: "Exam cues",
      icon: "🎯",
      bullets: [
        "**A** = IPv4, **AAAA** = IPv6, **CNAME** = hostname→hostname, **NS** = zone's name servers.",
        "'Resolve names only inside a VPC' → **Private Hosted Zone**.",
        "Planning a cutover soon → **lower the TTL** ahead of time.",
        "Route 53 is **authoritative** and the only **100% SLA** service.",
      ],
      analogyBrief:
        "A hosted zone is a phone book you own and edit; TTL is how long callers keep the number written down before re-checking your listing.",
    },
    explanation:
      "Amazon Route 53 is a highly available, scalable, fully managed, and authoritative DNS service — authoritative meaning you (the customer) control the records. It is also a domain registrar, can health-check your resources, and is the only AWS service with a 100% availability SLA (the name references port 53, the traditional DNS port). Each record specifies how to route traffic for a domain and contains a domain/subdomain name, a record type, a value, a routing policy, and a TTL. The must-know record types are A (maps a hostname to an IPv4 address), AAAA (to IPv6), CNAME (maps a hostname to another hostname, which must itself resolve; it cannot be used at the zone apex), and NS (the name servers for the hosted zone). Records live in hosted zones: a Public Hosted Zone holds records for public, Internet-routable domain names, while a Private Hosted Zone holds records resolvable only inside one or more VPCs. Hosted zones cost $0.50 per month each. TTL controls caching at resolvers: a high TTL (e.g. 24h) means less traffic to Route 53 but records can be stale, whereas a low TTL (e.g. 60s) means fresher records and easy changes at the cost of more queries. TTL is mandatory for every record except Alias records.",
    analogy:
      "A hosted zone is a phone book that you own and can edit at will. The A/AAAA/CNAME entries are the individual listings. TTL is how long a caller keeps a number written on a sticky note before they bother to look you up in the book again — set it long and they rarely re-check (but might dial an old number); set it short and they always have the latest number.",
    diagram: `<svg viewBox="0 0 720 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Route 53 records">${svgDefs}
      ${box(40, 40, 180, 45, "Public Hosted Zone", "app.mydomain.com", "#8b5cf6")}
      ${box(40, 105, 180, 40, "A → 12.34.56.78", "IPv4", "#22c55e")}
      ${box(40, 155, 180, 40, "CNAME → lb.aws.com", "hostname", "#3b82f6")}
      <line x1="130" y1="85" x2="130" y2="103" stroke="#8b949e" stroke-width="1.5" marker-end="url(#arrow-mute)"/>
      <line x1="130" y1="145" x2="130" y2="153" stroke="#8b949e" stroke-width="1.5" marker-end="url(#arrow-mute)"/>
      ${box(430, 40, 240, 45, "Private Hosted Zone", "resolves inside VPC only", "#f59e0b")}
      ${box(430, 105, 240, 40, "db.example.internal → 10.0.0.35", "private IP", "#22c55e")}
      <rect x="410" y="20" width="290" height="150" rx="10" fill="none" stroke="#f59e0b" stroke-dasharray="4 4"/>
      <text x="555" y="163" text-anchor="middle" fill="#8b949e" font-size="10">VPC</text>
    </svg>`,
    diagramLegend: [
      { color: "#8b5cf6", label: "Public hosted zone", description: "Internet-resolvable records." },
      { color: "#f59e0b", label: "Private hosted zone", description: "Names resolvable only within associated VPCs." },
      { color: "#22c55e", label: "Records", description: "A/AAAA/CNAME entries with a value and TTL." },
    ],
    codeExample: {
      language: "bash",
      title: "Create an A record in a hosted zone",
      code: `aws route53 change-resource-record-sets \\
  --hosted-zone-id Z123456ABCDEFG \\
  --change-batch '{
    "Changes": [{
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "app.mydomain.com",
        "Type": "A",
        "TTL": 300,
        "ResourceRecords": [{"Value": "12.34.56.78"}]
      }
    }]
  }'`,
    },
    problemStatement:
      "Internal microservices must resolve db.example.internal to a private IP that is only reachable inside the VPC, while the public site app.example.com must resolve on the Internet. You also plan to migrate the public site to a new IP next week and want minimal disruption. Which hosted-zone types do you use, and what TTL strategy prepares you for the migration?",
    questions: [
      {
        q: "Which record type maps a hostname to an IPv6 address?",
        options: ["A. A", "B. AAAA", "C. CNAME", "D. NS"],
        answer: "B",
        explanation:
          "B is correct: AAAA maps to IPv6. A maps to IPv4, CNAME maps to another hostname, and NS lists the zone's name servers.",
      },
      {
        q: "You need internal service names to resolve ONLY within your VPC. Which hosted zone type?",
        options: ["A. Public Hosted Zone", "B. Private Hosted Zone", "C. Reverse zone", "D. TLD zone"],
        answer: "B",
        explanation:
          "B is correct: a Private Hosted Zone resolves names only inside associated VPC(s). A Public Hosted Zone is Internet-facing.",
      },
      {
        q: "You will change a record's target next week and want the cutover to propagate quickly. What should you do in advance?",
        options: [
          "A. Raise the TTL to 24 hours",
          "B. Lower the TTL (e.g. to 60s) ahead of time",
          "C. Delete and recreate the hosted zone",
          "D. Switch to an NS record",
        ],
        answer: "B",
        explanation:
          "B is correct: lowering the TTL beforehand means resolvers cache the old value for a shorter time, so the change propagates fast. A high TTL slows propagation; the others don't help.",
      },
      {
        q: "Which statement about Amazon Route 53 is TRUE?",
        options: [
          "A. It offers a 100% availability SLA",
          "B. It cannot register domains",
          "C. It only supports public hosted zones",
          "D. It is a non-authoritative DNS only",
        ],
        answer: "A",
        explanation:
          "A is correct: Route 53 is the only AWS service with a 100% availability SLA. It is a registrar, supports public and private zones, and is authoritative.",
      },
      {
        q: "About how much does one Route 53 hosted zone cost per month?",
        options: ["A. Free", "B. $0.50", "C. $5.00", "D. $50.00"],
        answer: "B",
        explanation:
          "B is correct: hosted zones cost about $0.50 per month each (plus query charges). The others are incorrect.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "route53-cname-alias",
    title: "Route 53 — CNAME vs Alias Records",
    shortLabel: "CNAME vs Alias",
    section: "Amazon Route 53 — DNS",
    domain: "Networking",
    tldr:
      "CNAME points a hostname to another hostname but only for non-root (sub)domains. Alias is a free, Route 53-only record that points a name — including the zone apex (example.com) — at an AWS resource, auto-tracks its IP changes, has native health checks, and has no settable TTL.",
    subtopics: [
      {
        heading: "CNAME",
        bullets: [
          { icon: "🔗", text: "Points a hostname to **any other hostname** (app.mydomain.com → blabla.anything.com)." },
          { icon: "🚫", text: "**Only for non-root domains** — you cannot use CNAME at the **zone apex** (example.com)." },
        ],
      },
      {
        heading: "Alias record",
        bullets: [
          { icon: "🎯", text: "Points a hostname to an **AWS resource**; an extension to DNS, **Route 53-specific**." },
          { icon: "🌳", text: "**Works at the zone apex** (example.com) AND subdomains." },
          { icon: "🆓", text: "**Free**, **native health check**, **auto-tracks** the resource's changing IPs. Always type **A/AAAA**; **TTL is set automatically** (you can't set it)." },
        ],
      },
      {
        heading: "Valid Alias targets (and one that isn't)",
        bullets: [
          { icon: "✅", text: "ELB, CloudFront, API Gateway, Elastic Beanstalk, **S3 websites**, VPC Interface Endpoints, Global Accelerator, another Route 53 record in the same zone." },
          { icon: "⛔", text: "You **cannot** set an Alias record to an **EC2 DNS name**." },
        ],
      },
    ],
    keyFacts: [
      { label: "CNAME apex", value: "Not allowed", icon: "🚫" },
      { label: "Alias apex", value: "Allowed", icon: "🌳" },
      { label: "Alias type", value: "A / AAAA", icon: "🔤" },
      { label: "Alias TTL", value: "Set automatically", icon: "⏱️" },
    ],
    quickReference: {
      title: "CNAME vs Alias",
      icon: "🎯",
      bullets: [
        "Root domain → AWS resource? **Must use Alias** (CNAME can't do apex).",
        "Alias is **free**, has **native health checks**, and **auto-follows** IP changes.",
        "Alias cannot target an **EC2 instance DNS name**.",
        "CNAME can point to **any** hostname (incl. non-AWS); Alias only to AWS resources.",
        "Alias records don't let you set a TTL.",
      ],
      analogyBrief:
        "CNAME is a mail-forwarding label ('deliver to that other address'); Alias is a smart forwarder that always knows the recipient's current address, even if they move.",
    },
    explanation:
      "AWS resources like load balancers and CloudFront distributions expose their own AWS hostname, but you usually want a friendly name like myapp.mydomain.com to point at them. A CNAME record maps one hostname to another hostname (for example app.mydomain.com to blabla.anything.com), but it can only be used for non-root domains — you cannot create a CNAME at the zone apex (the root, like example.com). An Alias record solves this: it maps a hostname to an AWS resource, is a Route 53-specific extension to DNS, works for both the zone apex and subdomains, is free of charge, supports native health checks, and automatically recognizes changes in the resource's IP addresses. Alias records are always type A or AAAA (IPv4/IPv6), and you cannot set their TTL — Route 53 manages it. Valid Alias targets include Elastic Load Balancers, CloudFront distributions, API Gateway, Elastic Beanstalk environments, S3 static websites, VPC interface endpoints, Global Accelerator accelerators, and another Route 53 record in the same hosted zone. Importantly, you cannot set an Alias record to point at an EC2 instance's DNS name.",
    analogy:
      "A CNAME is a paper mail-forwarding label that says 'deliver to this other street address' — but the post office won't let you put one on your building's main mailbox (the apex). An Alias is a smart forwarding service that always knows the recipient's current address even if AWS quietly moves them, works even on the main mailbox, and costs nothing to keep.",
    diagram: `<svg viewBox="0 0 720 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="CNAME vs Alias">${svgDefs}
      <text x="20" y="24" fill="#ff9900" font-size="12" font-weight="700">CNAME (subdomains only)</text>
      ${box(20, 35, 180, 45, "www.example.com", "CNAME", "#3b82f6")}
      <line x1="200" y1="57" x2="250" y2="57" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(255, 35, 200, 45, "blabla.anything.com", "any hostname", "#8b949e")}
      ${box(20, 95, 180, 40, "example.com (apex)", "CNAME ✗ not allowed", "#ef4444")}
      <text x="20" y="170" fill="#ff9900" font-size="12" font-weight="700">Alias (apex + AWS resources)</text>
      ${box(20, 180, 180, 45, "example.com (apex)", "Alias A", "#22c55e")}
      <line x1="200" y1="202" x2="250" y2="202" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(255, 180, 220, 45, "ALB / CloudFront / S3", "AWS resource", "#8b5cf6")}
    </svg>`,
    diagramLegend: [
      { color: "#3b82f6", label: "CNAME", description: "Subdomain → any hostname; not valid at apex." },
      { color: "#22c55e", label: "Alias", description: "Apex or subdomain → AWS resource; free, health-checked." },
      { color: "#ef4444", label: "Invalid", description: "CNAME at the zone apex is not permitted." },
    ],
    codeExample: {
      language: "json",
      title: "Alias record pointing the zone apex at an ALB",
      code: `{
  "Action": "UPSERT",
  "ResourceRecordSet": {
    "Name": "example.com",
    "Type": "A",
    "AliasTarget": {
      "HostedZoneId": "Z35SXDOTRQ7X7K",
      "DNSName": "my-alb-123456789.us-east-1.elb.amazonaws.com",
      "EvaluateTargetHealth": true
    }
  }
}`,
    },
    problemStatement:
      "You must point the root domain example.com (not www) directly at an Application Load Balancer, get automatic health-based failover, and avoid extra DNS charges. A teammate suggests a CNAME at the root. Explain why that won't work and which record type you must use instead, and note one target type that is NOT allowed for it.",
    questions: [
      {
        q: "You need the ROOT domain example.com to point at an Application Load Balancer. Which record type must you use?",
        options: ["A. CNAME", "B. Alias (A/AAAA)", "C. TXT", "D. NS"],
        answer: "B",
        explanation:
          "B is correct: CNAME can't be used at the zone apex, so you must use an Alias record (type A/AAAA) to point the root at an AWS resource like an ALB.",
      },
      {
        q: "Which is a UNIQUE advantage of an Alias record over a CNAME?",
        options: [
          "A. It can point to any external hostname",
          "B. It works at the zone apex and is free with native health checks",
          "C. It lets you set a custom TTL",
          "D. It supports MX-style mail routing",
        ],
        answer: "B",
        explanation:
          "B is correct: Alias works at the apex, is free, and has native health checks (and auto-follows IP changes). A is a CNAME trait. C is false (Alias TTL is automatic). D is unrelated.",
      },
      {
        q: "Which target is NOT valid for a Route 53 Alias record?",
        options: [
          "A. CloudFront distribution",
          "B. S3 static website",
          "C. An EC2 instance's public DNS name",
          "D. Application Load Balancer",
        ],
        answer: "C",
        explanation:
          "C is correct: you cannot set an Alias to an EC2 instance DNS name. CloudFront, S3 websites, and ELBs are all valid Alias targets.",
      },
      {
        q: "A CNAME record can be created for which of the following?",
        options: [
          "A. example.com (zone apex)",
          "B. www.example.com (subdomain)",
          "C. Any AWS resource for free with health checks",
          "D. IPv4 addresses directly",
        ],
        answer: "B",
        explanation:
          "B is correct: CNAME works for non-root (sub)domains like www.example.com. It's not allowed at the apex (A), doesn't offer Alias's free health checks (C), and points to hostnames, not raw IPs (D — that's an A record).",
      },
      {
        q: "What is the record type of a Route 53 Alias that points to an AWS resource, and can you set its TTL?",
        options: [
          "A. CNAME; yes you set the TTL",
          "B. A or AAAA; no, TTL is set automatically",
          "C. NS; yes",
          "D. TXT; no",
        ],
        answer: "B",
        explanation:
          "B is correct: Alias records are always type A/AAAA and Route 53 manages the TTL automatically (you can't set it).",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "route53-routing-policies",
    title: "Route 53 — Routing Policies",
    shortLabel: "Routing Policies",
    section: "Amazon Route 53 — DNS",
    domain: "Networking",
    tldr:
      "Routing policies define how Route 53 answers queries (it doesn't route traffic). Simple, Weighted (% split), Latency-based (lowest latency Region), Failover (active-passive), Geolocation (by user location), Geoproximity (bias by distance), IP-based (by client CIDR), and Multi-Value (up to 8 healthy records).",
    subtopics: [
      {
        heading: "Simple, Weighted & Multi-Value",
        bullets: [
          { icon: "1️⃣", text: "**Simple** — one resource (or multiple values; client picks one at random). No health checks." },
          { icon: "⚖️", text: "**Weighted** — split traffic by relative **weight** (%); weight 0 stops traffic. Health-checkable." },
          { icon: "🔢", text: "**Multi-Value** — return up to **8 healthy** records; client-side balancing. **Not** a substitute for an ELB." },
        ],
      },
      {
        heading: "Latency & Failover",
        bullets: [
          { icon: "⚡", text: "**Latency-based** — route to the AWS Region with **lowest latency** to the user." },
          { icon: "🔀", text: "**Failover (active-passive)** — primary with a **mandatory health check**; on failure, serve the secondary (DR)." },
        ],
      },
      {
        heading: "Location-aware: Geolocation, Geoproximity & IP-based",
        bullets: [
          { icon: "🌍", text: "**Geolocation** — by user **location** (continent/country/US state); define a **Default** record for no-match." },
          { icon: "🧲", text: "**Geoproximity** — route by geographic distance and shift traffic with a **bias** (expand +1..99 / shrink −1..−99). Needs **Route 53 Traffic Flow**." },
          { icon: "📍", text: "**IP-based** — route by the client's **IP/CIDR** (map CIDR → endpoint)." },
        ],
      },
    ],
    keyFacts: [
      { label: "Split by %", value: "Weighted", icon: "⚖️" },
      { label: "Lowest latency", value: "Latency-based", icon: "⚡" },
      { label: "DR failover", value: "Failover (active-passive)", icon: "🔀" },
      { label: "Multi-Value returns", value: "Up to 8 healthy records", icon: "🔢" },
    ],
    quickReference: {
      title: "Pick the policy",
      icon: "🧭",
      bullets: [
        "'Send X% to a new version' → **Weighted** (blue/green, canary).",
        "'Fastest experience by Region' → **Latency-based**.",
        "'Primary + DR standby' → **Failover**.",
        "'Comply with content by country' → **Geolocation** (define a Default).",
        "'Shift more traffic to one Region by distance' → **Geoproximity** (bias, needs Traffic Flow).",
      ],
      analogyBrief:
        "Routing policies are the rules a receptionist follows when deciding which office to send a caller to — nearest, least busy, by country, or the backup line.",
    },
    explanation:
      "Route 53 routing policies define how it responds to DNS queries — note that DNS doesn't route traffic, it only answers queries. Simple routing points to a single resource (or lists multiple values, from which the client randomly picks) and can't use health checks. Weighted routing splits traffic across records by relative weight (a percentage of the sum of all weights; a weight of 0 stops traffic to that record, and if all are 0 they're returned equally) and supports health checks — great for load balancing between Regions or canarying a new version. Latency-based routing sends users to the AWS Region that gives them the lowest latency. Failover (active-passive) uses a primary record with a mandatory health check and fails over to a secondary (disaster-recovery) resource when the primary is unhealthy. Geolocation routing decides by the user's location (continent, country, or US state, most-precise wins) and should include a Default record for unmatched locations. Geoproximity routing routes by the geographic distance between users and resources and lets you shift traffic with a bias value (expand a resource's region with 1 to 99, shrink it with −1 to −99); it requires the Route 53 Traffic Flow feature. IP-based routing decides by the client's IP address using CIDR-to-endpoint mappings. Finally, Multi-Value routing returns up to eight healthy records for client-side balancing and is not a replacement for a load balancer. Most policies can be associated with health checks.",
    analogy:
      "Think of a call center receptionist deciding where to transfer each caller. Simple = always the same desk. Weighted = send 70% to Team A, 30% to Team B (handy when trialing a new team). Latency = whichever office answers fastest. Failover = the main line, or the backup line if the main is down. Geolocation = route French callers to the French desk. Geoproximity = prefer the nearest office but nudge more calls to a bigger one. Multi-Value = hand the caller a short list of open desks to try.",
    diagram: `<svg viewBox="0 0 720 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Route 53 weighted routing">${svgDefs}
      ${box(280, 25, 160, 50, "Route 53", "routing policy", "#8b5cf6")}
      <line x1="300" y1="75" x2="150" y2="120" stroke="#ff9900" stroke-width="3" marker-end="url(#arrow)"/>
      <text x="200" y="100" fill="#8b949e" font-size="11">70%</text>
      ${box(60, 125, 150, 45, "Fleet A", "weight 70", "#22c55e")}
      <line x1="360" y1="75" x2="360" y2="120" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="370" y="105" fill="#8b949e" font-size="11">20%</text>
      ${box(285, 125, 150, 45, "Fleet B", "weight 20", "#3b82f6")}
      <line x1="420" y1="75" x2="560" y2="120" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
      <text x="500" y="100" fill="#8b949e" font-size="11">10%</text>
      ${box(510, 125, 150, 45, "Fleet C", "weight 10", "#f59e0b")}
      <text x="360" y="205" text-anchor="middle" fill="#8b949e" font-size="10">traffic % = weight / sum(weights)</text>
    </svg>`,
    diagramLegend: [
      { color: "#8b5cf6", label: "Route 53", description: "Answers queries per the chosen policy." },
      { color: "#22c55e", label: "Primary/higher weight", description: "Receives the largest share of queries." },
      { color: "#f59e0b", label: "Lower weight", description: "Receives fewer queries (canary/test)." },
    ],
    codeExample: {
      language: "json",
      title: "Weighted record: 90/10 canary split",
      code: `{
  "Changes": [
    { "Action": "UPSERT", "ResourceRecordSet": {
      "Name": "app.example.com", "Type": "A", "SetIdentifier": "stable",
      "Weight": 90, "TTL": 60, "ResourceRecords": [{"Value": "1.1.1.1"}]
    }},
    { "Action": "UPSERT", "ResourceRecordSet": {
      "Name": "app.example.com", "Type": "A", "SetIdentifier": "canary",
      "Weight": 10, "TTL": 60, "ResourceRecords": [{"Value": "2.2.2.2"}]
    }}
  ]
}`,
    },
    problemStatement:
      "For a global app you must: (1) gradually shift 10% of users to a new release; (2) always give each user the Region with the lowest latency; (3) serve a compliant site variant to users in Germany; and (4) fail over to a DR site if the primary is unhealthy. Match each requirement to the correct Route 53 routing policy.",
    questions: [
      {
        q: "You want to send 10% of traffic to a new app version and 90% to the current one. Which routing policy?",
        options: ["A. Latency-based", "B. Weighted", "C. Failover", "D. Geolocation"],
        answer: "B",
        explanation:
          "B is correct: Weighted routing splits traffic by relative weight — ideal for canary/blue-green rollouts. Latency is about speed, Failover is DR, Geolocation is by user location.",
      },
      {
        q: "Which policy sends each user to the AWS Region that gives them the lowest network latency?",
        options: ["A. Geolocation", "B. Latency-based", "C. Simple", "D. Multi-Value"],
        answer: "B",
        explanation:
          "B is correct: Latency-based routing picks the lowest-latency Region for the user. Geolocation routes by where the user is (not measured latency); Simple/Multi-Value don't optimize latency.",
      },
      {
        q: "A company must serve different content based on the user's COUNTRY for legal compliance. Which policy, and what extra record is recommended?",
        options: [
          "A. Latency-based; no extra record",
          "B. Geolocation; also create a Default record for unmatched locations",
          "C. Weighted; a canary record",
          "D. Failover; a health check",
        ],
        answer: "B",
        explanation:
          "B is correct: Geolocation routing decides by user location, and you should add a Default record for locations that don't match any rule. The others don't select by country.",
      },
      {
        q: "In an active-passive Failover routing setup, what is REQUIRED on the primary record?",
        options: [
          "A. A weight of 100",
          "B. A health check",
          "C. Geoproximity bias",
          "D. Multi-value answers",
        ],
        answer: "B",
        explanation:
          "B is correct: Failover routing requires a health check on the primary so Route 53 knows when to fail over to the secondary. The others aren't part of failover configuration.",
      },
      {
        q: "Which statement about Multi-Value routing is TRUE?",
        options: [
          "A. It returns up to 8 healthy records and is a full replacement for an ELB",
          "B. It returns up to 8 healthy records but is NOT a substitute for a load balancer",
          "C. It always returns exactly one record",
          "D. It cannot be associated with health checks",
        ],
        answer: "B",
        explanation:
          "B is correct: Multi-Value can return up to 8 healthy records (with health checks) for client-side balancing, but it is not a substitute for an ELB. A overstates it; C and D are false.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "route53-health-checks",
    title: "Route 53 — Health Checks & Automated DNS Failover",
    shortLabel: "Route 53 Health Checks",
    section: "Amazon Route 53 — DNS",
    domain: "Networking",
    tldr:
      "Route 53 health checks enable automated DNS failover. They monitor public endpoints (~15 global checkers, HTTP/HTTPS/TCP, 2xx/3xx = healthy), combine into calculated checks (OR/AND/NOT), or watch a CloudWatch Alarm — which is the way to health-check private resources, since the checkers live outside your VPC.",
    subtopics: [
      {
        heading: "Monitor an endpoint (public)",
        bullets: [
          { icon: "🌐", text: "~**15 global** health checkers probe the endpoint; **HTTP/HTTPS/TCP**." },
          { icon: "✅", text: "Healthy when **>18%** of checkers see success; pass on **2xx/3xx**; can match text in the first **5120 bytes**." },
          { icon: "🔓", text: "Default interval **30s** (10s = higher cost), threshold **3**. **Allow the checkers' IP range** through your firewall." },
        ],
      },
      {
        heading: "Calculated health checks",
        bullets: [
          { icon: "🧮", text: "Combine up to **256 child** checks with **OR / AND / NOT**." },
          { icon: "🛠️", text: "Set how many children must pass; lets you do maintenance without failing everything." },
        ],
      },
      {
        heading: "Private resources → CloudWatch Alarm",
        bullets: [
          { icon: "🔒", text: "Checkers are **outside the VPC** → they can't reach **private** endpoints." },
          { icon: "📈", text: "Create a **CloudWatch Metric + Alarm** and make a health check that **monitors the alarm** (full control — e.g. DynamoDB throttles, RDS alarms)." },
        ],
      },
    ],
    keyFacts: [
      { label: "Global checkers", value: "~15", icon: "🌐" },
      { label: "Healthy codes", value: "2xx / 3xx", icon: "✅" },
      { label: "Calculated children", value: "Up to 256", icon: "🧮" },
      { label: "Private endpoints", value: "Via CloudWatch Alarm", icon: "🔒" },
    ],
    quickReference: {
      title: "Exam cues",
      icon: "🎯",
      bullets: [
        "Health checks power **automated DNS failover** (Failover/Latency/Geo policies).",
        "HTTP checks are **public only** → for **private** endpoints use a **CloudWatch Alarm** check.",
        "Combine many checks with **Calculated** (OR/AND/NOT, up to 256).",
        "**Allowlist** Route 53 checker IP ranges on your firewall.",
        "Interval 30s (or 10s at higher cost); pass on 2xx/3xx.",
      ],
      analogyBrief:
        "Health checks are inspectors from 15 cities all pinging your shop's door; if too many find it locked, the directory stops listing you until you reopen.",
    },
    explanation:
      "Route 53 health checks let DNS fail over automatically. There are three kinds. First, checks that monitor an endpoint: about 15 global health checkers probe the endpoint over HTTP, HTTPS, or TCP; the endpoint is considered healthy when more than 18% of checkers report success, health checks pass only on 2xx and 3xx status codes, and they can be configured to pass or fail based on text in the first 5120 bytes of the response. The default interval is 30 seconds (10 seconds at higher cost) with a threshold of 3, and because the checkers are external you must allow their IP ranges through your router/firewall (published in ip-ranges). Second, calculated health checks combine the results of up to 256 child health checks with OR, AND, or NOT logic, letting you require a certain number to pass — useful for performing maintenance without tripping everything. Third, for private resources: Route 53 health checkers live outside your VPC and cannot reach private endpoints, so you create a CloudWatch metric and alarm and then a health check that monitors that alarm — this gives full control and is how you health-check private or on-premises resources, or metrics like DynamoDB throttles. Health checks integrate with CloudWatch metrics and drive automated DNS failover across regions.",
    analogy:
      "Route 53 health checks are like mystery-shopper inspectors dispatched from 15 different cities, each pinging your store's front door. If enough of them find it open (a 200 response), the directory keeps listing your store; if too many find it locked, the directory quietly points customers to your backup location. For a members-only back room they can't enter (a private endpoint), you instead install a smoke detector inside (a CloudWatch alarm) and have the directory watch that.",
    diagram: `<svg viewBox="0 0 720 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Route 53 health checks">${svgDefs}
      ${box(30, 30, 120, 40, "Checker (us)", "", "#8b5cf6")}
      ${box(30, 85, 120, 40, "Checker (eu)", "", "#8b5cf6")}
      ${box(30, 140, 120, 40, "Checker (ap)", "~15 global", "#8b5cf6")}
      ${box(250, 80, 150, 50, "Public endpoint", "HTTP /health", "#22c55e")}
      <line x1="150" y1="50" x2="248" y2="95" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
      <line x1="150" y1="105" x2="248" y2="105" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
      <line x1="150" y1="160" x2="248" y2="115" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
      <text x="185" y="145" fill="#8b949e" font-size="9">2xx/3xx</text>
      ${box(470, 30, 220, 45, "Route 53 (Failover)", "automated DNS failover", "#6b46c1")}
      <line x1="400" y1="90" x2="468" y2="60" stroke="#22c55e" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(470, 150, 220, 45, "CloudWatch Alarm", "for PRIVATE endpoints", "#f59e0b")}
      <line x1="400" y1="120" x2="468" y2="165" stroke="#8b949e" stroke-width="1.5" stroke-dasharray="3 3" marker-end="url(#arrow-mute)"/>
    </svg>`,
    diagramLegend: [
      { color: "#8b5cf6", label: "Global checkers", description: "~15 worldwide probes over HTTP/HTTPS/TCP." },
      { color: "#22c55e", label: "Public endpoint", description: "Healthy on 2xx/3xx from >18% of checkers." },
      { color: "#f59e0b", label: "CloudWatch alarm", description: "Health-check path for PRIVATE resources." },
    ],
    codeExample: {
      language: "bash",
      title: "Create an HTTP endpoint health check",
      code: `aws route53 create-health-check \\
  --caller-reference web-hc-$(date +%s) \\
  --health-check-config '{
    "Type": "HTTP",
    "FullyQualifiedDomainName": "app.example.com",
    "Port": 80,
    "ResourcePath": "/health",
    "RequestInterval": 30,
    "FailureThreshold": 3
  }'`,
    },
    problemStatement:
      "You run a primary site in us-east-1 and a DR site in eu-west-1 and want Route 53 to fail over automatically when the primary is down. A separate internal service runs on private instances inside a VPC that Route 53's checkers cannot reach, but you still need failover based on its health. Which health-check approach do you use for the public site, and how do you health-check the private service?",
    questions: [
      {
        q: "Route 53's global health checkers cannot reach a PRIVATE endpoint inside your VPC. How do you health-check it?",
        options: [
          "A. Open the VPC to the internet",
          "B. Create a CloudWatch alarm on a metric and have the health check monitor that alarm",
          "C. Use a TCP check on the private IP",
          "D. It's impossible to health-check private resources",
        ],
        answer: "B",
        explanation:
          "B is correct: because the checkers are outside the VPC, you create a CloudWatch metric + alarm and a health check that watches the alarm. Opening the VPC is insecure; a direct check can't reach private IPs.",
      },
      {
        q: "Which HTTP status codes cause a Route 53 endpoint health check to PASS?",
        options: ["A. Only 200", "B. 2xx and 3xx", "C. Any code including 5xx", "D. Only 301"],
        answer: "B",
        explanation:
          "B is correct: health checks pass on 2xx and 3xx responses. 4xx/5xx fail. It's broader than just 200 and narrower than 'any code'.",
      },
      {
        q: "You want a single health check that passes only if at least 2 of 3 child checks are healthy. What do you use?",
        options: [
          "A. A calculated health check combining the children",
          "B. A latency-based policy",
          "C. Three separate hosted zones",
          "D. A CloudWatch dashboard",
        ],
        answer: "A",
        explanation:
          "A is correct: a calculated health check combines up to 256 child checks with OR/AND/NOT and lets you require a number of them to pass. The others don't aggregate child checks.",
      },
      {
        q: "To let Route 53 health checkers reach your endpoint behind a firewall, you must:",
        options: [
          "A. Disable the firewall entirely",
          "B. Allow the published Route 53 health-checker IP ranges",
          "C. Whitelist 0.0.0.0/0",
          "D. Use only TCP checks",
        ],
        answer: "B",
        explanation:
          "B is correct: allow the documented Route 53 health-checker IP ranges (from ip-ranges.json) inbound. Disabling the firewall or opening to the world is insecure; check type doesn't bypass the firewall.",
      },
      {
        q: "What is the primary purpose of Route 53 health checks?",
        options: [
          "A. To cache DNS answers longer",
          "B. To enable automated DNS failover to healthy resources",
          "C. To register domains",
          "D. To encrypt DNS queries",
        ],
        answer: "B",
        explanation:
          "B is correct: health checks let Route 53 stop returning unhealthy endpoints and fail over automatically. They don't affect caching/TTL, registration, or DNS encryption.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "route53-registrar-hybrid",
    title: "Registrar vs DNS Service & Route 53 Resolver (Hybrid DNS)",
    shortLabel: "Registrar & Hybrid DNS",
    section: "Amazon Route 53 — DNS",
    domain: "Networking",
    tldr:
      "A domain registrar (where you buy a domain) is separate from a DNS service (where you manage records) — you can buy on GoDaddy and manage in Route 53 by updating NS records. Route 53 Resolver enables Hybrid DNS: Inbound Endpoints let on-prem resolve AWS names; Outbound Endpoints forward AWS queries to on-prem resolvers.",
    subtopics: [
      {
        heading: "Registrar vs DNS service",
        bullets: [
          { icon: "🛒", text: "A **Registrar** (GoDaddy, Amazon Registrar) is where you **buy/register** the domain (annual fee)." },
          { icon: "🗂️", text: "A **DNS service** is where you **manage records** — often bundled, but separable." },
          { icon: "🔁", text: "3rd-party domain + Route 53 DNS: create a **Hosted Zone**, then update the registrar's **NS records** to Route 53's name servers." },
        ],
      },
      {
        heading: "Route 53 Resolver defaults",
        bullets: [
          { icon: "🏠", text: "Automatically answers: EC2 **local domain names**, **Private Hosted Zone** records, and public name servers." },
        ],
      },
      {
        heading: "Hybrid DNS — Resolver Endpoints",
        bullets: [
          { icon: "📥", text: "**Inbound Endpoint** — your on-prem/DNS resolvers can **resolve AWS names** (EC2, Private Hosted Zones)." },
          { icon: "📤", text: "**Outbound Endpoint** — Route 53 Resolver **forwards** queries to your on-prem DNS resolvers." },
          { icon: "🔗", text: "Works across the VPC, peered VPCs, and on-prem via **VPN or Direct Connect**." },
        ],
      },
    ],
    keyFacts: [
      { label: "Registrar ≠ DNS", value: "Buy vs manage records", icon: "🔀" },
      { label: "3rd-party domain", value: "Point NS → Route 53", icon: "🔁" },
      { label: "Inbound endpoint", value: "On-prem → resolve AWS", icon: "📥" },
      { label: "Outbound endpoint", value: "AWS → forward to on-prem", icon: "📤" },
    ],
    quickReference: {
      title: "Exam cues",
      icon: "🎯",
      bullets: [
        "'Bought domain elsewhere, want Route 53 DNS' → create Hosted Zone, **update NS records**.",
        "'On-prem must resolve AWS private names' → Resolver **Inbound Endpoint**.",
        "'AWS must resolve on-prem names' → Resolver **Outbound Endpoint**.",
        "Registrar and DNS service are **separate roles** (can differ).",
        "Hybrid DNS spans VPC / peered VPC / on-prem (VPN or Direct Connect).",
      ],
      analogyBrief:
        "Registrar = the shop that sold you the phone number; DNS service = the directory that lists it. Resolver endpoints are the switchboard letting your office and AWS look up each other's internal extensions.",
    },
    explanation:
      "Registering a domain and running its DNS are two separate jobs. A domain registrar (like GoDaddy or Amazon Registrar) is where you buy a domain, usually for an annual fee; the registrar typically also offers a DNS service to manage records, but you're free to use a different DNS service. For example, you can purchase a domain on GoDaddy but manage the records in Route 53: you create a hosted zone in Route 53 and then update the NS (name server) records at the registrar to point to Route 53's name servers. On the resolution side, the Route 53 Resolver by default automatically answers DNS queries for EC2 instances' local domain names, records in Private Hosted Zones, and records in public name servers. Hybrid DNS resolves queries between your VPC (via Route 53 Resolver) and your own networks — the VPC itself, peered VPCs, or an on-premises network connected via VPN or Direct Connect. Two resolver endpoint types make this work: an Inbound Endpoint lets your on-premises DNS resolvers resolve AWS domain names such as EC2 instances and Private Hosted Zone records, while an Outbound Endpoint has the Route 53 Resolver forward DNS queries to your on-premises DNS resolvers.",
    analogy:
      "The registrar is the phone company that sold you a phone number; the DNS service is the directory that publishes it — and you can keep the number while listing it in a different directory (update the NS records). Resolver endpoints are the office switchboard: the Inbound line lets people outside dial your internal extensions (on-prem resolving AWS names), and the Outbound line lets your staff dial extensions in the partner building (AWS resolving on-prem names).",
    diagram: `<svg viewBox="0 0 720 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Route 53 hybrid DNS">${svgDefs}
      <rect x="20" y="30" width="320" height="190" rx="10" fill="#1a2332" stroke="#8b5cf6" stroke-dasharray="4 4"/>
      <text x="35" y="52" fill="#8b5cf6" font-size="12" font-weight="700">VPC (AWS)</text>
      ${box(40, 65, 130, 45, "Route 53 Resolver", "", "#6b46c1")}
      ${box(40, 130, 130, 45, "Private Hosted Zone", "aws.private", "#22c55e")}
      ${box(190, 130, 130, 45, "EC2", "app.aws.private", "#3b82f6")}
      <rect x="400" y="30" width="300" height="190" rx="10" fill="#1a2332" stroke="#f59e0b" stroke-dasharray="4 4"/>
      <text x="415" y="52" fill="#f59e0b" font-size="12" font-weight="700">On-premises</text>
      ${box(420, 90, 130, 45, "DNS Resolvers", "onprem.private", "#f59e0b")}
      ${box(420, 150, 130, 45, "Server", "web.onprem", "#8b949e")}
      <line x1="170" y1="80" x2="418" y2="105" stroke="#22c55e" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="230" y="80" fill="#22c55e" font-size="9">Inbound: on-prem → AWS</text>
      <line x1="418" y1="120" x2="172" y2="95" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="230" y="140" fill="#f59e0b" font-size="9">Outbound: AWS → on-prem</text>
    </svg>`,
    diagramLegend: [
      { color: "#6b46c1", label: "Route 53 Resolver", description: "Answers VPC DNS by default." },
      { color: "#22c55e", label: "Inbound endpoint", description: "Lets on-prem resolve AWS/private names." },
      { color: "#f59e0b", label: "Outbound endpoint", description: "Forwards AWS queries to on-prem resolvers." },
    ],
    codeExample: {
      language: "bash",
      title: "Create a Route 53 Resolver INBOUND endpoint (on-prem → AWS)",
      code: `aws route53resolver create-resolver-endpoint \\
  --name onprem-to-aws \\
  --direction INBOUND \\
  --security-group-ids sg-0abc123 \\
  --ip-addresses SubnetId=subnet-0aaa SubnetId=subnet-0bbb
# On-prem DNS servers forward AWS/private-zone lookups to this endpoint's IPs.`,
    },
    problemStatement:
      "Your company bought example.com through GoDaddy years ago but wants to manage all DNS in Route 53 going forward. Separately, servers in your on-premises data center (connected by Direct Connect) must resolve app.aws.private hosted in a Route 53 Private Hosted Zone, and EC2 instances must resolve web.onprem.private. Describe how to move DNS management to Route 53 and which resolver endpoints solve each resolution direction.",
    questions: [
      {
        q: "You bought a domain on a 3rd-party registrar but want to use Route 53 as the DNS service. What must you do?",
        options: [
          "A. Transfer the domain; there's no other option",
          "B. Create a Route 53 hosted zone and update the registrar's NS records to Route 53's name servers",
          "C. Create a Private Hosted Zone only",
          "D. Nothing; it works automatically",
        ],
        answer: "B",
        explanation:
          "B is correct: create a hosted zone in Route 53 and point the registrar's NS records at Route 53's name servers — registrar and DNS service are separate. A full transfer isn't required; a private zone won't serve public DNS.",
      },
      {
        q: "On-premises servers need to resolve names in a Route 53 Private Hosted Zone. Which resolver endpoint enables this?",
        options: ["A. Outbound Endpoint", "B. Inbound Endpoint", "C. NAT Gateway", "D. Internet Gateway"],
        answer: "B",
        explanation:
          "B is correct: an Inbound Endpoint lets on-prem/DNS resolvers resolve AWS names (EC2, private zones). Outbound is the reverse direction; NAT/IGW are not DNS resolvers.",
      },
      {
        q: "EC2 instances in a VPC must resolve names hosted by your on-premises DNS. Which endpoint do you use?",
        options: ["A. Inbound Endpoint", "B. Outbound Endpoint", "C. Public Hosted Zone", "D. Alias record"],
        answer: "B",
        explanation:
          "B is correct: an Outbound Endpoint forwards Route 53 Resolver queries to your on-prem DNS resolvers. Inbound is the opposite direction; the others don't forward to on-prem.",
      },
      {
        q: "Which statement best captures the registrar vs DNS-service distinction?",
        options: [
          "A. They are always the same company and cannot differ",
          "B. A registrar sells/registers the domain; a DNS service manages the records — they can be different providers",
          "C. Only a registrar can create records",
          "D. DNS service is required to purchase a domain",
        ],
        answer: "B",
        explanation:
          "B is correct: registration and DNS management are separate roles; you can register with one provider and run DNS with another (e.g. GoDaddy + Route 53).",
      },
      {
        q: "By default, the Route 53 Resolver automatically answers queries for all of the following EXCEPT:",
        options: [
          "A. EC2 local domain names",
          "B. Private Hosted Zone records",
          "C. Public name server records",
          "D. Your on-premises DNS zones without any endpoint",
        ],
        answer: "D",
        explanation:
          "D is correct: on-prem zones require an Outbound Endpoint to forward queries; the Resolver does NOT answer them automatically. A, B, and C are answered by default.",
      },
    ],
  },
];
