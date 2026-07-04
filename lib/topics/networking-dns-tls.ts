// ============================================================
// SECTION: Networking — DNS & TLS
// How names become addresses (DNS) and how connections become
// private + authenticated (TLS). Authored to the messaging.ts /
// frontend-core.ts depth bar.
// ============================================================
import { svgDefs, type Topic } from "./shared";

const box = (
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  sub: string,
  color = "#38bdf8",
) => `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#243349" stroke="${color}"/>
  <text x="${x + w / 2}" y="${y + h / 2 - 2}" text-anchor="middle" fill="#e6edf3" font-size="12" font-weight="600">${title}</text>
  <text x="${x + w / 2}" y="${y + h / 2 + 15}" text-anchor="middle" fill="#8b949e" font-size="10">${sub}</text>
`;

export const networkingDnsTlsTopics: Topic[] = [
  // -----------------------------------------------------------------
  {
    id: "net-dns",
    title: "DNS — Resolution, Record Types & Caching",
    shortLabel: "DNS",
    section: "DNS & TLS",
    domain: "Networking",
    tldr:
      "DNS is the phone book of the internet: it translates human names like example.com into IP addresses machines route to. A recursive resolver does the legwork, walking the hierarchy root → TLD → authoritative name server, then hands back the answer and caches it for its TTL. Record types define what a name maps to: A/AAAA (IPv4/IPv6), CNAME (alias), MX (mail), TXT (metadata like SPF/DKIM), and NS (delegation).",
    subtopics: [
      {
        heading: "How a name is resolved",
        bullets: [
          { icon: "📖", text: "DNS maps a **domain name** to an **IP address** so browsers, mail servers, and APIs can actually connect." },
          { icon: "🔁", text: "A **recursive resolver** (your ISP's, or 8.8.8.8 / 1.1.1.1) does the work: it queries others on your behalf and returns one final answer." },
          { icon: "🪜", text: "The **hierarchy** is walked top-down: **root** name servers → **TLD** servers (.com, .org) → the domain's **authoritative** name server, which holds the real record." },
        ],
      },
      {
        heading: "Record types you must know",
        bullets: [
          { icon: "🅰️", text: "**A** → IPv4 address; **AAAA** → IPv6 address. These are the terminal answers most lookups want." },
          { icon: "🔗", text: "**CNAME** → an **alias** pointing one name at another name (never at a raw IP); the resolver then re-resolves the target." },
          { icon: "📮", text: "**MX** → mail exchanger (with a priority number); **TXT** → free-form text used for **SPF, DKIM, DMARC** and domain verification; **NS** → delegates a zone to its authoritative servers." },
        ],
      },
      {
        heading: "Recursive vs authoritative & caching",
        bullets: [
          { icon: "🧭", text: "**Recursive resolver** chases the answer down the tree; the **authoritative** server is the source of truth for a specific zone." },
          { icon: "⏱️", text: "Every record has a **TTL** (time to live, in seconds); resolvers **cache** the answer until it expires to cut latency and load." },
          { icon: "⚖️", text: "Low TTL = faster propagation of changes but more queries; high TTL = fewer queries but slower failover. Lower TTL **before** a planned migration." },
        ],
      },
    ],
    keyFacts: [
      { label: "Default port", value: "53 (UDP, TCP for large/zone xfer)", icon: "🔌" },
      { label: "Hierarchy", value: "Root → TLD → Authoritative", icon: "🪜" },
      { label: "Alias record", value: "CNAME (name → name)", icon: "🔗" },
      { label: "Cache control", value: "TTL in seconds", icon: "⏱️" },
    ],
    quickReference: {
      title: "Cheat sheet",
      icon: "🎯",
      bullets: [
        "'Name → IPv4' = **A**; 'Name → IPv6' = **AAAA**.",
        "'Alias one hostname to another' = **CNAME** (cannot sit at the zone apex/root).",
        "'Where does mail go?' = **MX** (lower priority number wins).",
        "'SPF / DKIM / domain verification' = **TXT**.",
        "**Recursive** resolver does the walking; **authoritative** server owns the answer; **TTL** governs caching.",
      ],
      analogyBrief:
        "DNS is a librarian (recursive resolver): you ask for a book by title (domain), and she checks the catalog hierarchy until she finds its exact shelf location (IP), then remembers it for a while (TTL).",
    },
    explanation:
      "The Domain Name System (DNS) is the distributed, hierarchical directory that translates human-friendly names such as www.example.com into the IP addresses that machines actually route packets to. When you type a name, your device first checks local caches (browser, OS, hosts file) and then asks a recursive resolver — typically your ISP's, or a public one like Google's 8.8.8.8 or Cloudflare's 1.1.1.1. If the resolver does not already have the answer cached, it performs the full recursive resolution by walking the DNS hierarchy from the top down: it asks one of the 13 logical root name servers, which does not know the address but replies with a referral to the authoritative name servers for the correct top-level domain (TLD) such as .com; it then asks a TLD server, which refers it to the authoritative name servers for example.com; finally it queries that authoritative server, which holds the zone's actual records and returns the answer. The resolver caches that answer for the duration of the record's TTL (time to live, in seconds) and returns it to your device, so subsequent lookups within the TTL are answered instantly from cache. The value a name maps to is defined by its record type: an A record maps a name to an IPv4 address and an AAAA record maps it to an IPv6 address; a CNAME record is an alias that points one name at another name (which must then be resolved again) and cannot legally coexist with other records or sit at the zone apex; an MX record specifies the mail servers that accept email for the domain, each with a preference number where the lowest value is tried first; a TXT record holds arbitrary text and is the workhorse for email authentication (SPF, DKIM, DMARC) and domain-ownership verification; and NS records delegate a zone to the authoritative name servers responsible for it. The key operational lever is TTL: a low TTL propagates changes quickly (useful just before a migration or failover) at the cost of more queries, while a high TTL reduces query volume and load but makes changes slower to take effect. Understanding the split between the recursive resolver (which does the legwork and caches) and the authoritative server (the single source of truth for a zone) is central to reasoning about propagation, caching, and outages.",
    analogy:
      "Think of DNS as looking up a company by name in a giant, layered directory. You (the browser) do not know the phone number, so you call a helpful operator — the recursive resolver — and say 'connect me to example.com.' The operator does not memorize the whole world; instead she asks the top-level directory (root) 'who handles .com names?', is pointed to the .com desk (TLD), asks that desk 'who is authoritative for example.com?', is pointed to the company's own switchboard (the authoritative name server), and finally that switchboard gives the exact extension (the IP address). She writes the number on a sticky note and reuses it for a while (the TTL) so she does not repeat the whole chain for every caller. The record type is like specifying what you want: a street address (A/AAAA), a redirect to another company's name (CNAME), the mail room (MX), or a posted notice on the door (TXT).",
    diagram: `<svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Recursive DNS resolution walking root, TLD and authoritative servers">${svgDefs}
      <text x="380" y="26" text-anchor="middle" fill="#e6edf3" font-size="15" font-weight="700">Recursive DNS resolution for www.example.com</text>
      ${box(30, 60, 130, 55, "Client", "browser / OS", "#a78bfa")}
      ${box(210, 60, 150, 55, "Recursive Resolver", "8.8.8.8 / ISP", "#38bdf8")}
      ${box(560, 40, 170, 45, "Root (.)", "13 logical servers", "#f59e0b")}
      ${box(560, 128, 170, 45, "TLD (.com)", "referral", "#f59e0b")}
      ${box(560, 216, 170, 45, "Authoritative", "example.com zone", "#22c55e")}
      <line x1="160" y1="87" x2="208" y2="87" stroke="#a78bfa" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="120" y="52" fill="#8b949e" font-size="10">1. query</text>
      <line x1="360" y1="75" x2="558" y2="62" stroke="#8b949e" stroke-width="1.5" marker-end="url(#arrow-mute)"/>
      <text x="400" y="60" fill="#8b949e" font-size="10">2. ask root →</text>
      <line x1="360" y1="90" x2="558" y2="150" stroke="#8b949e" stroke-width="1.5" marker-end="url(#arrow-mute)"/>
      <text x="400" y="120" fill="#8b949e" font-size="10">3. ask TLD →</text>
      <line x1="360" y1="105" x2="558" y2="238" stroke="#22c55e" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="400" y="185" fill="#22c55e" font-size="10">4. ask authoritative →</text>
      <line x1="208" y1="100" x2="162" y2="100" stroke="#22c55e" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="95" y="128" fill="#22c55e" font-size="10">5. answer + cache (TTL)</text>
      <text x="30" y="288" fill="#8b949e" font-size="10">Records: A→IPv4  AAAA→IPv6  CNAME→alias  MX→mail  TXT→SPF/DKIM  NS→delegation</text>
    </svg>`,
    diagramLegend: [
      { color: "#38bdf8", label: "Recursive resolver", description: "Does the legwork, walks the tree, and caches the answer for the TTL." },
      { color: "#f59e0b", label: "Root & TLD servers", description: "Return referrals, not final answers — they point to the next level down." },
      { color: "#22c55e", label: "Authoritative server", description: "Source of truth for the zone; returns the actual A/AAAA/MX/etc. record." },
    ],
    codeExample: {
      language: "bash",
      title: "Inspecting DNS records with dig",
      code: `# Look up the A (IPv4) record — the final answer plus TTL
dig example.com A +noall +answer
# example.com.  86399  IN  A  93.184.216.34   (86399 = remaining TTL in seconds)

# Trace the full recursive walk: root -> TLD -> authoritative
dig example.com +trace

# Query a specific record type
dig example.com MX +short      # mail servers, with priorities
dig example.com TXT +short     # SPF / DKIM / verification strings
dig www.example.com CNAME +short

# Ask a specific resolver instead of the system default
dig @1.1.1.1 example.com AAAA +short   # IPv6`,
    },
    codeExamples: [
      {
        language: "bash",
        tab: "dig",
        title: "Querying record types with dig",
        code: `# A record (IPv4) with just the answer section
dig example.com A +noall +answer

# AAAA record (IPv6)
dig example.com AAAA +short

# MX records (mail) — number is the priority; lowest is tried first
dig example.com MX +short
# 10 mail1.example.com.
# 20 mail2.example.com.

# TXT records (SPF, DKIM, DMARC, domain verification)
dig example.com TXT +short

# NS records (which servers are authoritative for the zone)
dig example.com NS +short

# Reverse lookup: IP -> name (PTR record)
dig -x 93.184.216.34 +short`,
      },
      {
        language: "bash",
        tab: "nslookup",
        title: "The classic cross-platform tool",
        code: `# Simple lookup (uses your default resolver)
nslookup example.com

# Ask a specific record type
nslookup -type=MX example.com
nslookup -type=TXT example.com
nslookup -type=NS example.com

# Point at a specific resolver (Cloudflare)
nslookup example.com 1.1.1.1

# Trace with +trace-style behavior is dig-only; nslookup shows
# 'Non-authoritative answer:' when the reply came from a cache.`,
      },
      {
        language: "text",
        tab: "Zone file",
        title: "What the authoritative records look like",
        code: `; A simplified BIND-style zone file for example.com
$TTL 3600                      ; default TTL = 1 hour

@       IN  SOA   ns1.example.com. admin.example.com. (
                  2024060101   ; serial
                  7200         ; refresh
                  3600         ; retry
                  1209600      ; expire
                  3600 )       ; minimum TTL

@       IN  NS    ns1.example.com.
@       IN  NS    ns2.example.com.

@       IN  A     93.184.216.34        ; apex -> IPv4 (A, not CNAME!)
@       IN  AAAA  2606:2800:220:1:248:1893:25c8:1946
www     IN  CNAME example.com.         ; alias www -> apex
@       IN  MX    10 mail1.example.com.
@       IN  MX    20 mail2.example.com.
@       IN  TXT   "v=spf1 include:_spf.example.com ~all"`,
      },
    ],
    problemStatement:
      "Your team moves example.com to a new hosting provider and updates the A record, but half your users still hit the old server for two days while the other half see the new one. Separately, marketing asks you to point www.example.com at a load balancer that only publishes a hostname (not an IP), and mail keeps bouncing with 'SPF fail.' Explain how recursive resolution and TTL caching cause the split traffic, when to lower the TTL, why you need a CNAME (not an A record) for the load-balancer alias, and which record type carries SPF.",
    questions: [
      {
        q: "What is the primary purpose of DNS?",
        options: [
          "A. To encrypt traffic between a browser and a server",
          "B. To translate human-readable domain names into IP addresses",
          "C. To store website content",
          "D. To assign MAC addresses to devices",
        ],
        answer: "B",
        explanation:
          "B is correct: DNS is the internet's naming system, resolving names like example.com to routable IP addresses. Encryption is TLS's job, content lives on web servers, and MAC assignment is unrelated to DNS.",
      },
      {
        q: "Which record type maps a domain name to an IPv4 address?",
        options: ["A. AAAA", "B. CNAME", "C. A", "D. MX"],
        answer: "C",
        explanation:
          "C is correct: an A record maps a name to an IPv4 address. AAAA maps to IPv6, CNAME is an alias to another name, and MX identifies mail servers.",
      },
      {
        q: "What does a recursive resolver do that an authoritative name server does not?",
        options: [
          "A. It holds the definitive records for a zone",
          "B. It walks the DNS hierarchy on the client's behalf and caches the result",
          "C. It only serves the root zone",
          "D. It signs records with DNSSEC",
        ],
        answer: "B",
        explanation:
          "B is correct: the recursive resolver does the legwork — querying root, TLD, and authoritative servers — then caches the answer for its TTL. The authoritative server is the source of truth for its zone but does not chase answers for clients.",
      },
      {
        q: "A record's TTL is set to 86400 seconds. What does this mean?",
        options: [
          "A. The record expires permanently after 86400 seconds",
          "B. Resolvers may cache the answer for up to 24 hours before re-querying",
          "C. The domain must be renewed every 86400 seconds",
          "D. Only 86400 queries are allowed per day",
        ],
        answer: "B",
        explanation:
          "B is correct: TTL (86400s = 24h) tells resolvers how long they may cache the answer before asking the authoritative server again. It is not an expiry of the record itself, a renewal period, or a query quota.",
      },
      {
        q: "Why can't you use a CNAME record at the zone apex (example.com with no subdomain)?",
        options: [
          "A. CNAMEs are deprecated",
          "B. The apex must also carry SOA and NS records, and a CNAME cannot coexist with other records",
          "C. Apex records are always IPv6-only",
          "D. CNAMEs only work for mail",
        ],
        answer: "B",
        explanation:
          "B is correct: a CNAME cannot coexist with any other record for the same name, but the zone apex is required to have SOA and NS records — so a CNAME at the apex is illegal. This is why providers offer 'ALIAS/ANAME' or Route 53 'Alias' records for the apex.",
      },
      {
        q: "You are migrating to a new server tomorrow and want changes to take effect quickly. What should you do to the DNS record's TTL, and when?",
        options: [
          "A. Raise the TTL right after the migration",
          "B. Lower the TTL well before the migration, so caches expire quickly when you switch",
          "C. TTL has no effect on propagation speed",
          "D. Delete the record and recreate it during the migration",
        ],
        answer: "B",
        explanation:
          "B is correct: lower the TTL ahead of time (e.g. to 60–300s) so that by the time you flip the record, resolvers are re-querying frequently and pick up the change fast. Raising it after, ignoring it, or deleting the live record would slow or break propagation.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "net-tls",
    title: "TLS & Certificates — Handshake, Chains & HTTPS",
    shortLabel: "TLS & Certs",
    section: "DNS & TLS",
    domain: "Networking",
    tldr:
      "TLS gives a connection confidentiality, integrity, and server authentication — it is the 'S' in HTTPS. The handshake uses slow asymmetric crypto (public/private keys) only to authenticate the server (via its certificate) and agree on a shared secret, then switches to fast symmetric encryption for the actual data. Trust flows through a certificate chain up to a Certificate Authority (CA) your device already trusts; SNI lets one IP host many certificates.",
    subtopics: [
      {
        heading: "What TLS provides",
        bullets: [
          { icon: "🔒", text: "**Confidentiality** — data is encrypted so eavesdroppers on the wire see only ciphertext." },
          { icon: "🧾", text: "**Integrity** — tampering is detected via message authentication (MAC/AEAD tags)." },
          { icon: "🪪", text: "**Authentication** — the server proves its identity with a **certificate**, so you know you're really talking to example.com." },
        ],
      },
      {
        heading: "Symmetric vs asymmetric",
        bullets: [
          { icon: "🗝️", text: "**Asymmetric** (RSA/ECDSA): a **public/private key pair** — slow, used only during the handshake to authenticate and agree on a secret." },
          { icon: "⚡", text: "**Symmetric** (AES): **one shared key** for both sides — fast, used for the bulk of the data after the handshake." },
          { icon: "🤝", text: "Modern TLS uses **(EC)DHE key exchange** for the shared secret, giving **forward secrecy**: recording traffic + later stealing the key still can't decrypt past sessions." },
        ],
      },
      {
        heading: "Certificates, chains & HTTPS",
        bullets: [
          { icon: "🔗", text: "A cert is signed by an intermediate CA, signed by a **root CA** — this **chain of trust** ends at a root your OS/browser already trusts." },
          { icon: "🌐", text: "**HTTPS = HTTP over TLS** (port 443). The lock icon means the chain validated and the name matched." },
          { icon: "🏷️", text: "**SNI** (Server Name Indication) sends the requested hostname in the ClientHello so one IP/port can serve **many certificates** (virtual hosting, CDNs)." },
        ],
      },
    ],
    keyFacts: [
      { label: "HTTPS port", value: "443", icon: "🔌" },
      { label: "Handshake crypto", value: "Asymmetric (public/private)", icon: "🗝️" },
      { label: "Bulk data crypto", value: "Symmetric (AES)", icon: "⚡" },
      { label: "Trust anchor", value: "Root CA in the trust store", icon: "🔗" },
    ],
    quickReference: {
      title: "Cheat sheet",
      icon: "🎯",
      bullets: [
        "TLS = **confidentiality + integrity + authentication**; it's the 'S' in HTTPS (port **443**).",
        "**Asymmetric** keys authenticate + exchange a secret (slow); **symmetric** AES encrypts the data (fast).",
        "The **certificate chain** goes leaf → intermediate → **root CA** already trusted by your device.",
        "**(EC)DHE** exchange gives **forward secrecy**; TLS 1.3 makes it mandatory and cuts the handshake to 1 round trip.",
        "**SNI** lets one IP serve many hostnames/certs by naming the host in the ClientHello.",
      ],
      analogyBrief:
        "TLS is like meeting a courier who shows government-issued ID (the certificate, vouched for by an authority you trust), then you both agree on a secret code word (symmetric key) to whisper the rest of the conversation.",
    },
    explanation:
      "Transport Layer Security (TLS), the successor to SSL, secures a network connection by providing three guarantees: confidentiality (the data is encrypted), integrity (any tampering in transit is detected), and authentication (the server proves who it is). It is what turns HTTP into HTTPS, which runs over TCP port 443. TLS combines two kinds of cryptography because each has a different strength. Asymmetric cryptography uses a mathematically linked public/private key pair — anything encrypted or signed with one can be verified with the other — but it is computationally expensive, so TLS uses it only during the handshake to authenticate the server and to safely agree on a shared secret. Symmetric cryptography uses a single shared key that both sides hold; it is far faster, so once the handshake establishes that shared key it is used to encrypt the actual application data. The handshake proceeds roughly as follows: the client sends a ClientHello listing supported cipher suites and, crucially, the target hostname via the SNI extension; the server responds with a ServerHello choosing a cipher and presents its certificate. That certificate contains the server's public key and identity (its domain name) and is digitally signed by a Certificate Authority. The client validates it by following the certificate chain — the server's leaf certificate is signed by an intermediate CA, which is in turn signed by a root CA whose certificate is preinstalled in the operating system or browser trust store — and by checking the name matches, the dates are valid, and it is not revoked. Client and server then perform a key exchange (modern TLS uses ephemeral Diffie-Hellman, (EC)DHE) to derive the symmetric session key; because the exchange uses ephemeral keys, TLS achieves forward secrecy, meaning an attacker who records the encrypted traffic and later steals the server's private key still cannot decrypt those past sessions. Once both sides confirm the handshake, all further data is encrypted symmetrically. TLS 1.3 streamlined this to a single round trip, removed legacy weak algorithms, and made forward secrecy mandatory. SNI matters operationally because it allows a single IP address and port to host many different sites with different certificates — the server picks the right certificate based on the hostname the client announces — which is why shared hosting and CDNs work.",
    analogy:
      "Imagine a courier arrives to exchange sensitive documents with you. First you demand identification: the courier shows a photo ID (the certificate) issued by a government agency (the Certificate Authority). You do not personally know the courier, but you do trust that agency, and the ID is countersigned up a chain to an office you already trust (the root CA in your trust store) — that is authentication. Once you believe who they are, you do not want to keep using slow, formal notarized letters (asymmetric crypto) for every sentence, so together you agree on a private code word (the symmetric session key) and then whisper the rest of the conversation quickly using that code (symmetric encryption). If you pick a fresh code word for every meeting (ephemeral keys / forward secrecy), then even if someone later steals the agency's master seal, they still can't decode conversations they secretly recorded. SNI is you telling the front desk which specific person you're here to see, so the right ID gets presented when many people work behind one door.",
    diagram: `<svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="TLS handshake sequence and certificate chain of trust">${svgDefs}
      <text x="380" y="24" text-anchor="middle" fill="#e6edf3" font-size="15" font-weight="700">TLS handshake &amp; chain of trust</text>
      ${box(40, 55, 130, 50, "Client", "browser", "#a78bfa")}
      ${box(430, 55, 130, 50, "Server", "example.com", "#38bdf8")}
      <line x1="170" y1="130" x2="430" y2="130" stroke="#a78bfa" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="180" y="124" fill="#a78bfa" font-size="10">1. ClientHello (ciphers + SNI hostname)</text>
      <line x1="430" y1="160" x2="170" y2="160" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="185" y="154" fill="#38bdf8" font-size="10">2. ServerHello + Certificate</text>
      <line x1="170" y1="190" x2="430" y2="190" stroke="#22c55e" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="180" y="184" fill="#22c55e" font-size="10">3. Key exchange ((EC)DHE) → shared secret</text>
      <line x1="170" y1="220" x2="430" y2="220" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="150" y="214" fill="#f59e0b" font-size="10">4. Finished → symmetric (AES) encrypted data ↔</text>
      <rect x="590" y="55" width="150" height="215" rx="10" fill="#161b22" stroke="#22c55e"/>
      <text x="605" y="76" fill="#22c55e" font-size="11" font-weight="700">Chain of trust</text>
      ${box(600, 90, 130, 42, "Root CA", "in trust store", "#22c55e")}
      <line x1="665" y1="132" x2="665" y2="150" stroke="#8b949e" stroke-width="1.5" marker-end="url(#arrow-mute)"/>
      ${box(600, 150, 130, 42, "Intermediate", "signs leaf", "#f59e0b")}
      <line x1="665" y1="192" x2="665" y2="210" stroke="#8b949e" stroke-width="1.5" marker-end="url(#arrow-mute)"/>
      ${box(600, 210, 130, 42, "Leaf cert", "example.com", "#38bdf8")}
      <text x="40" y="300" fill="#8b949e" font-size="10">Asymmetric keys authenticate + agree the secret; symmetric AES encrypts the bulk data. HTTPS = HTTP over TLS (443).</text>
    </svg>`,
    diagramLegend: [
      { color: "#a78bfa", label: "Client", description: "Sends ClientHello with SNI, validates the certificate, derives the session key." },
      { color: "#38bdf8", label: "Server / leaf cert", description: "Presents its certificate (public key + domain) signed by a CA." },
      { color: "#22c55e", label: "Root CA / chain", description: "Trust anchors: leaf → intermediate → root already trusted by the device." },
    ],
    codeExample: {
      language: "bash",
      title: "Inspecting a TLS certificate with openssl",
      code: `# Connect and show the certificate chain the server presents
openssl s_client -connect example.com:443 -servername example.com -showcerts

# -servername sends SNI so the right cert is returned on shared IPs.

# Print just the certificate's subject, issuer, dates, and SANs
echo | openssl s_client -connect example.com:443 -servername example.com 2>/dev/null \\
  | openssl x509 -noout -subject -issuer -dates -ext subjectAltName

# Verify the chain validates against the system trust store
openssl s_client -connect example.com:443 -servername example.com -verify_return_error < /dev/null`,
    },
    codeExamples: [
      {
        language: "bash",
        tab: "openssl",
        title: "Inspecting the live certificate & chain",
        code: `# Show the full chain the server presents (leaf + intermediates)
openssl s_client -connect example.com:443 -servername example.com -showcerts

# Extract subject, issuer, validity window and SAN names
echo | openssl s_client -connect example.com:443 -servername example.com 2>/dev/null \\
  | openssl x509 -noout -subject -issuer -dates -ext subjectAltName

# Which TLS version and cipher was negotiated?
echo | openssl s_client -connect example.com:443 -servername example.com 2>/dev/null \\
  | grep -E "Protocol|Cipher"

# Test SNI: same IP, different hostname -> different cert
openssl s_client -connect 93.184.216.34:443 -servername other.example.com -brief </dev/null`,
      },
      {
        language: "bash",
        tab: "curl",
        title: "Verifying HTTPS from the client side",
        code: `# Verbose handshake details (TLS version, cipher, cert subject/issuer)
curl -v https://example.com 2>&1 | grep -E "SSL|subject:|issuer:|TLS"

# Fail loudly if the certificate does not validate (this is the default;
# -k / --insecure would DISABLE verification — never use in production)
curl https://example.com          # succeeds only if the chain + name are valid

# Force a minimum TLS version
curl --tlsv1.2 https://example.com

# Pin to a specific CA bundle
curl --cacert /etc/ssl/certs/ca-bundle.crt https://example.com`,
      },
      {
        language: "bash",
        tab: "gen + verify",
        title: "Create a CSR and verify a chain",
        code: `# Generate a private key and a Certificate Signing Request (CSR)
openssl req -new -newkey rsa:2048 -nodes \\
  -keyout example.key -out example.csr \\
  -subj "/CN=example.com" \\
  -addext "subjectAltName=DNS:example.com,DNS:www.example.com"

# You send example.csr to a CA; it returns a signed leaf certificate.

# Verify a leaf certificate against its intermediate chain
openssl verify -CAfile chain.pem example.crt
# example.crt: OK   <- chain validates up to a trusted root

# Inspect a certificate file you already have
openssl x509 -in example.crt -noout -text | grep -A1 "Issuer\\|Subject\\|Not "`,
      },
    ],
    problemStatement:
      "Users report a browser warning 'Your connection is not private / NET::ERR_CERT_AUTHORITY_INVALID' on your site, even though the certificate is valid and unexpired. Meanwhile a colleague asks why TLS bothers with two different kinds of encryption instead of just one, and whether recording today's HTTPS traffic could be decrypted later if the server key leaks. Explain the roles of asymmetric vs symmetric crypto in the handshake, how the certificate chain and CA trust store produce (or fail to produce) the lock icon — hint: a missing intermediate certificate — why SNI matters on shared IPs, and how forward secrecy protects past sessions.",
    questions: [
      {
        q: "What does the 'S' in HTTPS provide?",
        options: [
          "A. Faster page loads via compression",
          "B. A layer of TLS giving encryption, integrity, and server authentication",
          "C. A different DNS record type",
          "D. Server-side rendering",
        ],
        answer: "B",
        explanation:
          "B is correct: HTTPS is HTTP carried over TLS (port 443), which provides confidentiality, integrity, and authentication of the server. It is not about compression, DNS, or rendering.",
      },
      {
        q: "In a TLS handshake, what is asymmetric (public/private key) cryptography primarily used for?",
        options: [
          "A. Encrypting all the bulk application data",
          "B. Authenticating the server and securely agreeing on a shared secret",
          "C. Compressing the certificate",
          "D. Resolving the domain name",
        ],
        answer: "B",
        explanation:
          "B is correct: asymmetric crypto is slow, so TLS uses it only during the handshake to authenticate the server (via its certificate) and to agree on a shared secret. The bulk data is then encrypted with fast symmetric crypto.",
      },
      {
        q: "Why does TLS switch to symmetric encryption after the handshake?",
        options: [
          "A. Symmetric encryption is much faster for large amounts of data",
          "B. Asymmetric encryption cannot encrypt data at all",
          "C. Symmetric keys never need to be kept secret",
          "D. It is required by DNS",
        ],
        answer: "A",
        explanation:
          "A is correct: symmetric encryption (e.g. AES) is far more efficient than asymmetric, so once a shared session key is agreed it is used for the bulk data. Asymmetric can encrypt but is too slow for a whole session, and symmetric keys absolutely must stay secret.",
      },
      {
        q: "How does a browser decide to trust a server's certificate?",
        options: [
          "A. It trusts any certificate that is unexpired",
          "B. It follows the chain from the leaf certificate up to a root CA already in its trust store, and checks name and validity",
          "C. It asks DNS whether the certificate is valid",
          "D. It trusts certificates signed by the server itself",
        ],
        answer: "B",
        explanation:
          "B is correct: the browser validates the certificate chain (leaf → intermediate → root) up to a trusted root CA, and verifies the hostname matches, the dates are valid, and it is not revoked. Self-signed certs and unverified-but-unexpired certs are not automatically trusted.",
      },
      {
        q: "A server's certificate is valid, but the browser still shows 'authority invalid.' What is a common cause?",
        options: [
          "A. The domain's TTL is too high",
          "B. The server is not sending the intermediate certificate(s), so the chain to a trusted root cannot be built",
          "C. HTTP/2 is disabled",
          "D. The AAAA record is missing",
        ],
        answer: "B",
        explanation:
          "B is correct: if the server presents only the leaf and omits the intermediate CA certificate(s), clients that don't already cache the intermediate can't build a path to a trusted root and report an authority error. TTL, HTTP/2, and AAAA records are unrelated to chain validation.",
      },
      {
        q: "What problem does SNI (Server Name Indication) solve?",
        options: [
          "A. It encrypts the DNS query",
          "B. It lets a single IP address and port serve multiple sites with different certificates by naming the host in the ClientHello",
          "C. It replaces the need for a certificate",
          "D. It speeds up symmetric encryption",
        ],
        answer: "B",
        explanation:
          "B is correct: SNI puts the requested hostname in the ClientHello so the server can select the correct certificate when many virtual hosts share one IP/port — essential for shared hosting and CDNs. It does not encrypt DNS, remove the need for certs, or affect symmetric performance.",
      },
      {
        q: "What is forward secrecy in TLS?",
        options: [
          "A. Certificates that never expire",
          "B. Using ephemeral key-exchange keys so that stealing the server's long-term private key later cannot decrypt previously recorded sessions",
          "C. Forwarding traffic to a backup server",
          "D. Caching the session key forever for reuse",
        ],
        answer: "B",
        explanation:
          "B is correct: with ephemeral (EC)DHE key exchange, each session derives a unique secret that isn't recoverable from the server's long-term private key. So an attacker who records ciphertext and later obtains that key still cannot decrypt past sessions. TLS 1.3 makes this mandatory.",
      },
    ],
  },
];
