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
// SECTION: Amazon S3
// Buckets/objects, security & policies, versioning & replication,
// static websites, and storage classes. Course slides ~p253–279.
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

export const s3Topics: Topic[] = [
  // -----------------------------------------------------------------
  {
    id: "s3-buckets-objects",
    title: "Amazon S3 — Buckets & Objects",
    shortLabel: "S3 Buckets & Objects",
    section: "Amazon S3",
    domain: "Storage",
    tldr:
      "S3 is 'infinitely scaling' object storage. Objects live in buckets, which are region-scoped but need globally-unique names. An object's key is its full path; there are no real folders (just slashes in keys). Max object size is 5TB; use multi-part upload above 5GB.",
    subtopics: [
      {
        heading: "Buckets",
        bullets: [
          { icon: "🪣", text: "Buckets hold objects (files) and are created **in a region**, but names are **globally unique**." },
          { icon: "🔤", text: "Naming rules: **no uppercase / no underscore**, 3–63 chars, not an IP, start with lowercase/number, no xn-- prefix, no -s3alias suffix." },
        ],
      },
      {
        heading: "Objects & keys",
        bullets: [
          { icon: "🗝️", text: "The **key** is the **full path**: s3://bucket/folder1/file.txt = **prefix** (folder1/) + **object name** (file.txt)." },
          { icon: "📂", text: "There are **no real directories** — just keys with slashes (the console fakes folders)." },
        ],
      },
      {
        heading: "Object contents & limits",
        bullets: [
          { icon: "📏", text: "Max object size **5 TB**; files **> 5 GB** must use **multi-part upload**." },
          { icon: "🏷️", text: "Objects have **metadata** (key/value), **tags** (up to 10, useful for security/lifecycle), and a **version ID** if versioning is on." },
        ],
      },
    ],
    keyFacts: [
      { label: "Bucket name scope", value: "Globally unique", icon: "🌍" },
      { label: "Max object size", value: "5 TB", icon: "📏" },
      { label: "Multi-part upload", value: "Required > 5 GB", icon: "📦" },
      { label: "Folders", value: "Don't exist (keys w/ slashes)", icon: "📂" },
    ],
    quickReference: {
      title: "Exam cues",
      icon: "🎯",
      bullets: [
        "Bucket names are **globally unique**; buckets are **regional**.",
        "**Key = prefix + object name** (full path); no real folders.",
        "**> 5 GB** upload → **multi-part** (max object 5 TB).",
        "Tags (≤10) drive **security & lifecycle** rules.",
        "S3 is object storage — great for backups, data lakes, static sites.",
      ],
      analogyBrief:
        "A bucket is a giant warehouse with a globally unique address; each object's key is the full aisle-and-shelf label — there are no actual rooms, just long labels.",
    },
    explanation:
      "Amazon S3 is one of AWS's foundational services — 'infinitely scaling' object storage used for backups, disaster recovery, archives, data lakes, media hosting, software delivery, and static websites. You store objects (files) in buckets (which behave like top-level directories). Buckets are created in a specific region but must have a globally unique name across all AWS accounts and regions, and their names follow strict rules: no uppercase letters or underscores, 3–63 characters, not formatted as an IP, must start with a lowercase letter or number, must not start with xn-- or end with -s3alias. Every object has a key, which is its full path (for example s3://my-bucket/folder1/another/file.txt); the key is really a prefix plus the object name, and there is no true concept of directories — just keys that contain slashes, which the console displays as folders. Object values are the file content, with a maximum object size of 5TB; any upload larger than 5GB must use multi-part upload. Objects also carry metadata (system or user key/value pairs), up to 10 tags (useful for security and lifecycle rules), and a version ID when versioning is enabled.",
    analogy:
      "A bucket is a colossal warehouse whose street address must be unique in the entire world (globally unique bucket name), even though the warehouse physically sits in one city (region). Each object's key is the complete label — 'aisle-7/shelf-3/box-A/photo.jpg'. There aren't really separate rooms; the long slash-separated label just makes it look organized. And to move a truck-sized object in, you break it into pieces and reassemble them inside (multi-part upload).",
    diagram: `<svg viewBox="0 0 720 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="S3 bucket and object key">${svgDefs}
      <rect x="30" y="30" width="360" height="180" rx="10" fill="#1a2332" stroke="#16a34a" stroke-dasharray="4 4"/>
      <text x="45" y="52" fill="#16a34a" font-size="12" font-weight="700">Bucket: my-bucket (globally unique)</text>
      ${box(50, 70, 320, 40, "s3://my-bucket/folder1/another/file.txt", "", "#16a34a")}
      <text x="60" y="140" fill="#8b949e" font-size="11">prefix: folder1/another/</text>
      <text x="60" y="165" fill="#e6edf3" font-size="11">object name: file.txt</text>
      <text x="60" y="190" fill="#8b949e" font-size="10">key = prefix + object name (no real folders)</text>
      ${box(430, 60, 250, 40, "Metadata (key/value)", "", "#3b82f6")}
      ${box(430, 115, 250, 40, "Tags (up to 10)", "security / lifecycle", "#8b5cf6")}
      ${box(430, 170, 250, 30, "Version ID (if versioning on)", "", "#f59e0b")}
    </svg>`,
    diagramLegend: [
      { color: "#16a34a", label: "Bucket / object", description: "Object identified by its full key." },
      { color: "#8b5cf6", label: "Tags", description: "Up to 10; used by security and lifecycle rules." },
      { color: "#f59e0b", label: "Version ID", description: "Present when bucket versioning is enabled." },
    ],
    codeExample: {
      language: "bash",
      title: "Create a bucket and upload an object (multi-part is automatic for large files)",
      code: `aws s3 mb s3://my-unique-bucket-name --region us-east-1

# Upload a file (the CLI auto-uses multi-part for large objects)
aws s3 cp ./big-video.mp4 s3://my-unique-bucket-name/media/big-video.mp4

# List with the "folder" prefix
aws s3 ls s3://my-unique-bucket-name/media/`,
    },
    problemStatement:
      "A new developer tries to create a bucket named 'MyCompany_Backups' in us-east-1 and it fails, then their 8GB single PUT upload errors out. Explain both failures in terms of S3 bucket-naming rules and object-size limits, and describe how object keys represent the 'folder' structure they expect.",
    questions: [
      {
        q: "Which bucket name is VALID for Amazon S3?",
        options: [
          "A. My-Company-Backups-Archive-Store-2026",
          "B. mycompany_backups_2026_archive_store",
          "C. mycompany-backups-2026",
          "D. 192.168.0.1",
        ],
        answer: "C",
        explanation:
          "Valid S3 bucket names are lowercase, may contain hyphens, are 3–63 characters long, and must be globally unique — 'mycompany-backups-2026' meets all of these. Names with uppercase letters, names with underscores, and names formatted like an IP address are all rejected.",
      },
      {
        q: "What is an S3 object's 'key'?",
        options: [
          "A. The object's full path within the bucket: its prefix plus the object name",
          "B. The AWS KMS customer managed key that is used to encrypt the object's contents while at rest",
          "C. The AWS Region and Availability Zone where the bucket was created",
          "D. The IAM access key ID used to authenticate the upload request",
        ],
        answer: "A",
        explanation:
          "The key is the object's full path within the bucket — the prefix combined with the object name — and it uniquely identifies the object. It is not a KMS encryption key, the bucket's Region/AZ, or an IAM access key ID.",
      },
      {
        q: "A single PUT of a 6GB file fails. What is the correct approach?",
        options: [
          "A. Split the file across two separate buckets and upload one half to each",
          "B. Compress the file below 5MB locally before uploading it in a single request",
          "C. Enable bucket versioning so the oversized upload is automatically retried in chunks",
          "D. Use multi-part upload, which is required for objects larger than 5GB",
        ],
        answer: "D",
        explanation:
          "A single PUT request is capped at 5GB, so a 6GB object must use multi-part upload (which supports objects up to 5TB). Splitting across buckets, compressing below 5MB, or enabling versioning do not address the single-request size limit.",
      },
      {
        q: "How are 'folders' represented in Amazon S3?",
        options: [
          "A. As real on-disk directory objects stored separately from the files they contain",
          "B. They don't exist — slashes in object keys just create the appearance of folders",
          "C. As separate S3 buckets, with one physical bucket created per folder in the path",
          "D. As object tags that the console silently groups together into a folder tree view",
        ],
        answer: "B",
        explanation:
          "S3 has no true directories. Keys are flat strings, and the '/' characters in a key are simply part of the name that the console renders as a folder hierarchy. They are not real directories, separate buckets, or tags.",
      },
      {
        q: "Which is TRUE about S3 buckets and regions?",
        options: [
          "A. A bucket is created in one Region, but its name must be globally unique",
          "B. Bucket names only need to be unique within the Region that hosts the bucket",
          "C. Buckets are global objects that do not belong to any particular AWS Region",
          "D. Two different AWS accounts may reuse the same bucket name in separate Regions",
        ],
        answer: "A",
        explanation:
          "A bucket physically lives in the Region chosen at creation, but bucket names occupy a single global namespace, so a name must be unique across every account and Region. Names are not merely Region-scoped, buckets are not Region-less, and two accounts cannot share the same name.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "s3-security-policies",
    title: "S3 Security — IAM, Bucket Policies & Block Public Access",
    shortLabel: "S3 Security & Policies",
    section: "Amazon S3",
    domain: "Security",
    tldr:
      "S3 access is user-based (IAM policies) or resource-based (bucket policies, ACLs). Access is allowed if an IAM policy OR the resource policy allows it AND there's no explicit deny. Bucket policies (JSON: Effect/Principal/Action/Resource) grant public access, cross-account, or force encryption. 'Block Public Access' is a safety net against leaks.",
    subtopics: [
      {
        heading: "How S3 authorization works",
        bullets: [
          { icon: "👤", text: "**User-based**: IAM policies say which API calls a user can make." },
          { icon: "🪣", text: "**Resource-based**: **Bucket Policies** (bucket-wide, allow cross-account), plus object/bucket **ACLs** (can be disabled)." },
          { icon: "🧮", text: "Access granted if **IAM allows OR resource policy allows** — **AND** no explicit **DENY**." },
        ],
      },
      {
        heading: "Bucket policies (JSON)",
        bullets: [
          { icon: "📜", text: "Fields: **Effect** (Allow/Deny), **Principal** (who), **Action** (which APIs), **Resource** (buckets/objects)." },
          { icon: "🎯", text: "Use to **grant public access**, **force encryption at upload**, or **grant cross-account access**." },
        ],
      },
      {
        heading: "Block Public Access & access patterns",
        bullets: [
          { icon: "🚫", text: "**Block Public Access** settings prevent accidental data leaks; keep **on** unless a bucket must be public. Can be set at the **account level**." },
          { icon: "🖥️", text: "EC2 reaches S3 via an **IAM role**; another account via a **bucket policy**; anonymous web visitors via a **public bucket policy**." },
        ],
      },
    ],
    keyFacts: [
      { label: "User-based", value: "IAM policies", icon: "👤" },
      { label: "Resource-based", value: "Bucket policy / ACL", icon: "🪣" },
      { label: "Access rule", value: "(IAM OR resource) AND no DENY", icon: "🧮" },
      { label: "Leak protection", value: "Block Public Access", icon: "🚫" },
    ],
    quickReference: {
      title: "Exam cues",
      icon: "🎯",
      bullets: [
        "'Make a bucket public for a website' → **bucket policy** + turn off Block Public Access.",
        "'Cross-account access to a bucket' → **bucket policy** with the other account as Principal.",
        "'EC2 needs S3 access' → attach an **IAM role** (not keys).",
        "An **explicit DENY always wins** over any Allow.",
        "Keep **Block Public Access ON** unless the bucket truly must be public.",
      ],
      analogyBrief:
        "IAM policies are your employee badge's permissions; a bucket policy is the sign on the warehouse door listing who may enter — and a DENY sign overrides any badge.",
    },
    explanation:
      "S3 security combines user-based and resource-based controls. User-based access uses IAM policies to define which S3 API calls a specific IAM user or role may make. Resource-based access includes bucket policies (bucket-wide JSON rules set from the S3 console that also enable cross-account access) and access control lists at the object or bucket level (finer-grained and less common — and now often disabled). The evaluation logic is: an IAM principal can access an S3 object if the user's IAM permissions allow it OR the resource (bucket) policy allows it, AND there is no explicit deny. Bucket policies are JSON documents with an Effect (Allow or Deny), a Principal (the account or user the policy applies to), Actions (the set of APIs to allow or deny), and a Resource (the buckets and objects). You use them to grant public read access (for a static website), to force objects to be encrypted at upload, or to grant another AWS account cross-account access. The Block Public Access settings were created to prevent company data leaks: if you know a bucket should never be public, leave them on, and they can be enforced at the account level. Common access patterns: an anonymous web visitor reaches a public bucket via a bucket policy, an IAM user via IAM permissions, an EC2 instance via an IAM role, and another AWS account via a cross-account bucket policy.",
    analogy:
      "Think of S3 security as building access. Your IAM policy is what your personal employee badge is allowed to open. The bucket policy is the sign posted on the warehouse door itself, listing which people or partner companies may enter. You can get in if either your badge permits it or the door sign lists you — but a big red 'DO NOT ENTER' sign (an explicit deny) overrides everything. 'Block Public Access' is the master lock the security office keeps engaged so nobody accidentally props the front door open to the street.",
    diagram: `<svg viewBox="0 0 720 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="S3 access control">${svgDefs}
      ${box(30, 40, 120, 45, "IAM User", "IAM policy", "#3b82f6")}
      ${box(30, 100, 120, 45, "EC2 (IAM role)", "role", "#f59e0b")}
      ${box(30, 160, 120, 45, "Other account", "bucket policy", "#8b5cf6")}
      ${box(500, 90, 170, 55, "S3 Bucket", "policy + ACL", "#16a34a")}
      <line x1="150" y1="62" x2="498" y2="105" stroke="#22c55e" stroke-width="1.5" marker-end="url(#arrow)"/>
      <line x1="150" y1="122" x2="498" y2="118" stroke="#22c55e" stroke-width="1.5" marker-end="url(#arrow)"/>
      <line x1="150" y1="182" x2="498" y2="132" stroke="#22c55e" stroke-width="1.5" marker-end="url(#arrow)"/>
      ${box(300, 30, 150, 40, "Block Public Access", "leak guard", "#ef4444")}
      <text x="360" y="200" text-anchor="middle" fill="#8b949e" font-size="10">Allowed if (IAM OR bucket policy) AND no explicit DENY</text>
    </svg>`,
    diagramLegend: [
      { color: "#16a34a", label: "S3 bucket", description: "Protected by bucket policy and (optional) ACLs." },
      { color: "#f59e0b", label: "IAM role", description: "How EC2/services access S3 (no long-lived keys)." },
      { color: "#ef4444", label: "Block Public Access", description: "Account/bucket-level guard against public exposure." },
    ],
    codeExample: {
      language: "json",
      title: "Bucket policy: allow public read of objects (static site)",
      code: `{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicRead",
    "Effect": "Allow",
    "Principal": "*",
    "Action": ["s3:GetObject"],
    "Resource": ["arn:aws:s3:::examplebucket/*"]
  }]
}`,
    },
    problemStatement:
      "An EC2 app must read/write a private bucket, a partner AWS account needs read access to the same bucket, and a separate bucket must serve a public website — but security is worried about accidental data leaks. For each requirement, pick the correct mechanism (IAM role, bucket policy, public policy), and explain the role of Block Public Access.",
    questions: [
      {
        q: "An EC2 instance needs to read from an S3 bucket. What is the recommended way to grant access?",
        options: [
          "A. Hard-code a long-lived IAM access key and secret directly in the application config",
          "B. Make the bucket fully public so any instance on the internet can read its objects",
          "C. Store the AWS account root user credentials on the instance and use those",
          "D. Attach an IAM role to the EC2 instance so it receives temporary credentials",
        ],
        answer: "D",
        explanation:
          "Attach an IAM role to the instance so it receives temporary, automatically rotated credentials. Hard-coding access keys or using root credentials is insecure, and making the bucket public is unnecessary and risky.",
      },
      {
        q: "An IAM policy allows s3:GetObject, but a bucket policy has an explicit Deny for that user. What happens?",
        options: [
          "A. Access is allowed, because an IAM Allow takes precedence over a bucket policy",
          "B. The outcome depends on whether the IAM policy or the bucket policy was created first",
          "C. Access is denied, because an explicit Deny always overrides any Allow that applies",
          "D. Access is allowed, but only when the request is made over an encrypted HTTPS connection",
        ],
        answer: "C",
        explanation:
          "An explicit Deny always wins: access is granted only when (an IAM policy OR the resource policy) allows the action AND no explicit Deny applies. Creation order and the transport protocol do not change this evaluation.",
      },
      {
        q: "To let another AWS account access your bucket, you use:",
        options: [
          "A. A security group rule that permits the other AWS account's entire IP address range",
          "B. A bucket (resource) policy that names the other AWS account as the Principal",
          "C. A NAT gateway placed between the two accounts to bridge their private networks",
          "D. A VPC peering connection, which is the only supported cross-account access path",
        ],
        answer: "B",
        explanation:
          "Cross-account S3 access is granted with a bucket (resource) policy that names the other AWS account as the Principal. Security groups, NAT gateways, and VPC peering are network constructs and do not authorize S3 API access.",
      },
      {
        q: "What is the purpose of S3 'Block Public Access'?",
        options: [
          "A. To transparently encrypt every object at rest using SSE-S3 or SSE-KMS managed keys",
          "B. To speed up large uploads by enabling parallel multi-part transfers automatically",
          "C. To automatically turn on versioning across every bucket in the entire account",
          "D. To prevent accidental public exposure of bucket data — an anti-leak safety net",
        ],
        answer: "D",
        explanation:
          "Block Public Access is a safety net against data leaks and can be enforced account-wide; keep it on unless a bucket genuinely must be public. It does not handle encryption, upload speed, or versioning.",
      },
      {
        q: "Which fields are part of an S3 bucket policy statement?",
        options: [
          "A. CIDR block, port range, and protocol, exactly like an EC2 security group rule",
          "B. TTL, weight, and set identifier, matching a Route 53 DNS record configuration",
          "C. Effect, Principal, Action, and Resource (the four JSON statement fields)",
          "D. Engine, instance class, and allocated storage, as used by an RDS database instance",
        ],
        answer: "C",
        explanation:
          "An S3 bucket policy statement is JSON with Effect, Principal, Action, and Resource. The other field sets belong to security groups, Route 53 records, and RDS instances respectively.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "s3-versioning-replication",
    title: "S3 Versioning & Replication (CRR / SRR)",
    shortLabel: "S3 Versioning & Replication",
    section: "Amazon S3",
    domain: "Storage",
    tldr:
      "Versioning (bucket-level) keeps every version of a key so you can restore/roll back and survive deletes. Replication (CRR across Regions, SRR same Region) needs versioning on both buckets, is asynchronous, and requires an IAM role. Only new objects replicate (use Batch Replication for existing); no replication chaining.",
    subtopics: [
      {
        heading: "S3 Versioning",
        bullets: [
          { icon: "🔢", text: "Enabled at the **bucket level**; a same-key overwrite creates versions 1, 2, 3…" },
          { icon: "♻️", text: "Protects against **unintended deletes** (restore a version) and enables easy **rollback**." },
          { icon: "🈳", text: "Pre-versioning objects have version **null**; **suspending** versioning doesn't delete existing versions." },
        ],
      },
      {
        heading: "Replication — CRR & SRR",
        bullets: [
          { icon: "🌍", text: "**CRR** (Cross-Region) and **SRR** (Same-Region); buckets can be in **different accounts**." },
          { icon: "🔑", text: "**Must enable versioning** on source AND destination; copying is **async**; give S3 an **IAM role**." },
          { icon: "🧰", text: "Use cases: CRR = compliance, lower latency, cross-account; SRR = log aggregation, prod↔test." },
        ],
      },
      {
        heading: "Replication notes",
        bullets: [
          { icon: "🆕", text: "Only **new** objects replicate after enabling; use **S3 Batch Replication** for existing/failed objects." },
          { icon: "🗑️", text: "Can optionally replicate **delete markers**; deletions **with a version ID are NOT replicated** (anti-malicious)." },
          { icon: "⛓️", text: "**No chaining**: bucket1→bucket2→bucket3 does NOT replicate bucket1's objects to bucket3." },
        ],
      },
    ],
    keyFacts: [
      { label: "Versioning scope", value: "Bucket level", icon: "🔢" },
      { label: "Replication needs", value: "Versioning on both + IAM role", icon: "🔑" },
      { label: "Existing objects", value: "S3 Batch Replication", icon: "🧰" },
      { label: "Chaining", value: "Not supported", icon: "⛓️" },
    ],
    quickReference: {
      title: "Exam cues",
      icon: "🎯",
      bullets: [
        "'Recover deleted/overwritten objects' → **Versioning**.",
        "Replication **requires versioning on both** buckets + an IAM role, and is **async**.",
        "**CRR** = cross-Region (compliance/latency); **SRR** = same-Region (log/test).",
        "Only **new** objects replicate → **Batch Replication** for old ones.",
        "**No replication chaining**; versioned deletes aren't replicated.",
      ],
      analogyBrief:
        "Versioning is 'track changes' for files — every edit is kept so you can undo. Replication is auto-mailing a copy of each new file to another warehouse.",
    },
    explanation:
      "S3 Versioning is enabled at the bucket level and keeps every version of an object: overwriting the same key increments the version (1, 2, 3…). It's a best practice because it protects against unintended deletes (you can restore a prior version) and makes rollbacks easy. Objects that existed before versioning was enabled have a version of null, and suspending versioning does not delete previously created versions. S3 Replication copies objects automatically between buckets; Cross-Region Replication (CRR) copies to a bucket in another Region, and Same-Region Replication (SRR) copies within the same Region, and the buckets can even be in different AWS accounts. Replication requires versioning enabled on both source and destination buckets, copies asynchronously, and needs an IAM role that grants S3 permission to replicate. Typical use cases: CRR for compliance, lower-latency access, and cross-account replication; SRR for log aggregation and live replication between production and test accounts. Important notes: after enabling replication only new objects are replicated (use S3 Batch Replication to copy existing objects or retry failed ones); you can optionally replicate delete markers, but deletions made with a specific version ID are not replicated (to protect against malicious deletes); and there is no chaining of replication — if bucket 1 replicates to bucket 2 and bucket 2 to bucket 3, objects created in bucket 1 are not replicated onward to bucket 3.",
    analogy:
      "Versioning is like 'Track Changes' in a document: every time someone edits and saves, the old draft is preserved, so you can always roll back or recover something a colleague deleted. Replication is an assistant who photocopies each new document as it arrives and mails the copy to a second office — either across the country (CRR) or across the hall (SRR) — but they only copy new arrivals going forward, and they won't blindly forward a copy that was itself received from somewhere else (no chaining).",
    diagram: `<svg viewBox="0 0 720 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="S3 versioning and replication">${svgDefs}
      <text x="30" y="26" fill="#ff9900" font-size="12" font-weight="700">Versioning</text>
      ${box(30, 40, 130, 40, "file.txt v1", "", "#8b949e")}
      ${box(30, 90, 130, 40, "file.txt v2", "", "#3b82f6")}
      ${box(30, 140, 130, 40, "file.txt v3", "current", "#22c55e")}
      <text x="300" y="26" fill="#ff9900" font-size="12" font-weight="700">Replication (async)</text>
      ${box(300, 70, 150, 55, "Source bucket", "versioning ON", "#16a34a")}
      <line x1="450" y1="97" x2="540" y2="97" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="460" y="88" fill="#8b949e" font-size="10">IAM role</text>
      ${box(545, 70, 150, 55, "Dest bucket", "versioning ON", "#16a34a")}
      <text x="470" y="150" text-anchor="middle" fill="#8b949e" font-size="10">CRR = cross-Region · SRR = same-Region</text>
    </svg>`,
    diagramLegend: [
      { color: "#22c55e", label: "Current version", description: "Latest object; older versions retained." },
      { color: "#16a34a", label: "Source/dest buckets", description: "Both must have versioning enabled." },
      { color: "#ff9900", label: "Async replication", description: "S3 copies new objects via an IAM role." },
    ],
    codeExample: {
      language: "bash",
      title: "Enable versioning (prerequisite for replication)",
      code: `# Enable on the source bucket
aws s3api put-bucket-versioning \\
  --bucket my-source-bucket \\
  --versioning-configuration Status=Enabled

# ...and the destination bucket (replication requires both)
aws s3api put-bucket-versioning \\
  --bucket my-dest-bucket \\
  --versioning-configuration Status=Enabled`,
    },
    problemStatement:
      "A compliance team needs a copy of all NEW objects in a us-east-1 bucket automatically stored in eu-west-1, plus the ability to recover objects that are accidentally overwritten or deleted. They also ask why the objects already in the bucket didn't get copied after they turned replication on. Explain the two features required, their prerequisites, and how to replicate the pre-existing objects.",
    questions: [
      {
        q: "What must be enabled on BOTH source and destination buckets before S3 replication will work?",
        options: [
          "A. Versioning, turned on for both the source and the destination bucket",
          "B. Static website hosting configured on both the source and destination buckets",
          "C. S3 Transfer Acceleration turned on for both the source and destination buckets",
          "D. Requester Pays, so the destination account is billed for the replicated data",
        ],
        answer: "A",
        explanation:
          "S3 replication requires versioning enabled on both the source and destination buckets (plus an IAM role granting S3 permission to replicate). Static website hosting, Transfer Acceleration, and Requester Pays are unrelated prerequisites.",
      },
      {
        q: "After enabling replication, a team notices EXISTING objects weren't copied. Why, and what's the fix?",
        options: [
          "A. Replication is broken; the only supported fix is to delete and recreate the destination bucket",
          "B. Existing objects can never be replicated once they are already sitting in the bucket",
          "C. They must disable versioning on the source bucket first and then turn it back on",
          "D. Only new objects replicate going forward; use S3 Batch Replication for the existing ones",
        ],
        answer: "D",
        explanation:
          "Replication only applies to new objects created after it is enabled; S3 Batch Replication copies existing (and previously failed) objects. Replication is not broken, existing objects can be replicated, and versioning must stay enabled.",
      },
      {
        q: "Which replication type copies objects to a bucket in a DIFFERENT AWS Region?",
        options: [
          "A. SRR (Same-Region Replication), which copies within a single Region only",
          "B. CRR — Cross-Region Replication, which targets a bucket in another Region",
          "C. TTL, the time-to-live value that controls how long DNS records are cached",
          "D. ACL, an access control list attached to individual buckets or objects",
        ],
        answer: "B",
        explanation:
          "Cross-Region Replication (CRR) copies objects to a bucket in a different AWS Region (for compliance, lower latency, or cross-account needs). Same-Region Replication stays within one Region, while TTL and ACL are unrelated concepts.",
      },
      {
        q: "Which statement about S3 replication is TRUE?",
        options: [
          "A. Replication is chained, so bucket1 → bucket2 → bucket3 forwards bucket1's objects onward to bucket3",
          "B. Deletions made with a specific version ID are always replicated to the destination bucket",
          "C. There is no chaining of replication from one bucket through another to a third",
          "D. Replication happens synchronously, blocking each upload until the copy completes",
        ],
        answer: "C",
        explanation:
          "Replication does not chain — objects in bucket1 are not forwarded to bucket3 through an intermediate bucket2. Replication is asynchronous, and deletes made with a specific version ID are deliberately not replicated.",
      },
      {
        q: "A user overwrites an important object by mistake. Which S3 feature lets them recover the previous content?",
        options: [
          "A. Versioning, which retains the previous version of each overwritten object",
          "B. S3 Transfer Acceleration, which speeds up uploads over long network distances",
          "C. S3 Storage Lens, which reports storage usage and activity metrics across buckets",
          "D. Requester Pays, which shifts data-transfer and request costs onto the requester",
        ],
        answer: "A",
        explanation:
          "With versioning enabled, the previous version of an overwritten object is retained and can be restored. Transfer Acceleration, Storage Lens, and Requester Pays do not provide recovery of overwritten content.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "s3-static-website",
    title: "S3 Static Website Hosting",
    shortLabel: "S3 Static Website",
    section: "Amazon S3",
    domain: "Storage",
    tldr:
      "S3 can host static websites reachable at a region-specific URL (bucket-name.s3-website-region.amazonaws.com). If you get a 403 Forbidden, the fix is almost always a bucket policy granting public read (and turning off Block Public Access).",
    subtopics: [
      {
        heading: "How it works",
        bullets: [
          { icon: "🌐", text: "Enable **Static Website Hosting** on a bucket to serve HTML/CSS/JS/images over the Internet." },
          { icon: "🔗", text: "URL is region-specific: **bucket-name.s3-website-region.amazonaws.com** (or .s3-website.region...)." },
        ],
      },
      {
        heading: "Fixing access",
        bullets: [
          { icon: "🚫", text: "A **403 Forbidden** almost always means the bucket policy doesn't allow **public reads**." },
          { icon: "✅", text: "Fix: add a **bucket policy** granting s3:GetObject to everyone AND turn off **Block Public Access**." },
        ],
      },
    ],
    keyFacts: [
      { label: "Serves", value: "Static HTML/CSS/JS/media", icon: "🌐" },
      { label: "URL", value: "bucket.s3-website-region.amazonaws.com", icon: "🔗" },
      { label: "403 fix", value: "Public-read bucket policy", icon: "🚫" },
      { label: "Prereq", value: "Disable Block Public Access", icon: "✅" },
    ],
    quickReference: {
      title: "Exam cues",
      icon: "🎯",
      bullets: [
        "'Host a static site cheaply' → **S3 Static Website Hosting**.",
        "**403 Forbidden** on the site → add a **public-read bucket policy**.",
        "Public site also needs **Block Public Access OFF**.",
        "For HTTPS/custom domain/CDN, front it with **CloudFront**.",
      ],
      analogyBrief:
        "It's like turning a storage unit into a shop window: the goods were always there, but you have to unlock the door and post an 'open to public' sign before anyone can browse.",
    },
    explanation:
      "Amazon S3 can host static websites and make them accessible on the Internet — you enable Static Website Hosting on the bucket and upload your HTML, CSS, JavaScript, and media. The website URL is region-specific, taking the form bucket-name.s3-website-aws-region.amazonaws.com (or bucket-name.s3-website.aws-region.amazonaws.com depending on the region). The single most common problem when setting this up is a 403 Forbidden error, which almost always means the bucket doesn't allow public reads: the fix is to add a bucket policy that grants s3:GetObject to everyone and to disable Block Public Access so the policy can take effect. (For HTTPS, a custom domain, and caching, you would place a CloudFront distribution in front of the S3 website.)",
    analogy:
      "Hosting a static site on S3 is like converting a storage unit into a street-facing shop. Your products (files) were sitting there all along, but until you unlock the roller door and hang an 'Open — everyone welcome' sign (a public-read bucket policy, with Block Public Access turned off), passers-by just see a locked shutter — the dreaded 403 Forbidden.",
    diagram: `<svg viewBox="0 0 720 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="S3 static website">${svgDefs}
      ${box(40, 85, 100, 50, "User", "browser", "#8b949e")}
      <line x1="140" y1="110" x2="260" y2="110" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="150" y="100" fill="#8b949e" font-size="9">http://bucket.s3-website-us-east-1...</text>
      ${box(265, 80, 200, 60, "S3 bucket", "static website on", "#16a34a")}
      ${box(520, 30, 170, 40, "Bucket policy", "public s3:GetObject", "#22c55e")}
      ${box(520, 90, 170, 40, "Block Public Access", "must be OFF", "#ef4444")}
      <line x1="465" y1="100" x2="518" y2="55" stroke="#8b949e" stroke-width="1.5" marker-end="url(#arrow-mute)"/>
      <line x1="465" y1="115" x2="518" y2="110" stroke="#8b949e" stroke-width="1.5" marker-end="url(#arrow-mute)"/>
    </svg>`,
    diagramLegend: [
      { color: "#16a34a", label: "S3 website bucket", description: "Serves files at the region website endpoint." },
      { color: "#22c55e", label: "Public-read policy", description: "Grants s3:GetObject to everyone." },
      { color: "#ef4444", label: "Block Public Access", description: "Must be disabled for the site to be public." },
    ],
    codeExample: {
      language: "bash",
      title: "Enable static website hosting and make it public",
      code: `# 1) Enable website hosting
aws s3 website s3://my-site-bucket/ --index-document index.html --error-document error.html

# 2) Turn off Block Public Access for this bucket
aws s3api put-public-access-block --bucket my-site-bucket \\
  --public-access-block-configuration BlockPublicPolicy=false,RestrictPublicBuckets=false

# 3) Attach a public-read bucket policy (grants s3:GetObject to everyone)
aws s3api put-bucket-policy --bucket my-site-bucket --policy file://public-read.json`,
    },
    problemStatement:
      "You enabled S3 static website hosting and uploaded index.html, but visiting the website endpoint returns '403 Forbidden'. The bucket has default settings. Diagnose the two settings that are blocking public access and describe exactly what to change so the site loads for anonymous users.",
    questions: [
      {
        q: "Your S3 static website returns '403 Forbidden' to visitors. What is the MOST likely fix?",
        options: [
          "A. Enable bucket versioning so that previous versions of the web page are served to visitors automatically",
          "B. Switch the bucket to a different AWS Region that is geographically closer to your visitors",
          "C. Enable S3 Transfer Acceleration to route visitor requests over the AWS edge network",
          "D. Add a bucket policy allowing public s3:GetObject, and disable Block Public Access",
        ],
        answer: "D",
        explanation:
          "A 403 on a static site means anonymous reads aren't allowed — add a public-read bucket policy granting s3:GetObject and turn off Block Public Access. Versioning, Region, and Transfer Acceleration do not govern public read access.",
      },
      {
        q: "What does the S3 static website endpoint URL depend on?",
        options: [
          "A. The version ID of the specific object that the visitor is currently requesting",
          "B. The bucket's Region (e.g. bucket.s3-website-us-east-1.amazonaws.com)",
          "C. The IAM user who originally created the bucket and enabled website hosting",
          "D. The object tags applied to the individual files that are stored in the bucket",
        ],
        answer: "B",
        explanation:
          "The static website endpoint is Region-specific: bucket-name.s3-website-Region.amazonaws.com. Object version IDs, the IAM user, and object tags play no part in forming the URL.",
      },
      {
        q: "For a bucket's public-read policy to actually take effect for a website, you must also:",
        options: [
          "A. Enable MFA Delete so that removing any public object requires a second authentication factor",
          "B. Turn on Requester Pays so that visitors are billed for the bandwidth they consume",
          "C. Disable Block Public Access so the public-read bucket policy can take effect",
          "D. Turn on Cross-Region Replication to copy the site content to a second AWS Region",
        ],
        answer: "C",
        explanation:
          "Block Public Access overrides a public bucket policy, so it must be disabled for a genuinely public website. MFA Delete, Requester Pays, and Cross-Region Replication are unrelated to serving public reads.",
      },
      {
        q: "S3 static website hosting is best suited for:",
        options: [
          "A. Static content such as HTML, CSS, JavaScript, and image or media files",
          "B. Server-side rendered applications that need to query a relational database on each request",
          "C. Running long-lived containers that process background jobs continuously",
          "D. Hosting a MySQL database engine that other application servers connect to",
        ],
        answer: "A",
        explanation:
          "S3 static website hosting serves static assets like HTML, CSS, JavaScript, and images. Dynamic, database-backed apps and containers need compute (EC2/Lambda/ECS), and S3 cannot run a database engine.",
      },
      {
        q: "To add HTTPS and a custom domain in front of an S3 static website, you typically use:",
        options: [
          "A. A NAT gateway placed in front of the bucket to terminate the visitors' TLS connections",
          "B. An Internet Gateway on its own, attached directly to the bucket's website endpoint",
          "C. S3 Storage Lens, configured to publish the website over an encrypted HTTPS channel",
          "D. CloudFront, a CDN placed in front to add HTTPS, a custom domain, and caching",
        ],
        answer: "D",
        explanation:
          "Place a CloudFront distribution in front of the S3 website to add HTTPS, a custom domain, and caching. NAT gateways and Internet Gateways are network routing components, and Storage Lens is an analytics feature.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "s3-storage-classes",
    title: "S3 Storage Classes & Durability",
    shortLabel: "S3 Storage Classes",
    section: "Amazon S3",
    domain: "Storage",
    tldr:
      "All S3 classes share 11 nines of durability; availability and cost differ. Standard (frequent), Standard-IA & One-Zone-IA (infrequent; One-Zone in a single AZ), Glacier Instant/Flexible/Deep Archive (archival, cheapest, retrieval delay), Intelligent-Tiering (auto-moves between tiers). Express One Zone is ultra-low-latency single-AZ.",
    subtopics: [
      {
        heading: "Durability vs availability",
        bullets: [
          { icon: "🛡️", text: "**Durability = 11 nines (99.999999999%)** across multiple AZs — **same for all** classes." },
          { icon: "📶", text: "**Availability** varies by class (e.g. Standard 99.99% ≈ 53 min/year down)." },
        ],
      },
      {
        heading: "Standard & Infrequent Access",
        bullets: [
          { icon: "⭐", text: "**Standard** — frequent access, low latency, high throughput; big data, apps, content." },
          { icon: "📉", text: "**Standard-IA** — infrequent but rapid access (backups/DR); cheaper storage, retrieval fee." },
          { icon: "🏠", text: "**One-Zone-IA** — one AZ only (data lost if AZ destroyed); secondary backups / re-creatable data." },
        ],
      },
      {
        heading: "Glacier archival tiers",
        bullets: [
          { icon: "❄️", text: "**Glacier Instant Retrieval** — ms retrieval, min 90-day storage." },
          { icon: "🧊", text: "**Glacier Flexible Retrieval** — mins–12h retrieval, min 90 days." },
          { icon: "🗄️", text: "**Glacier Deep Archive** — 12–48h retrieval, min 180 days (cheapest, long-term)." },
        ],
      },
      {
        heading: "Intelligent-Tiering & Express One Zone",
        bullets: [
          { icon: "🤖", text: "**Intelligent-Tiering** auto-moves objects between tiers by usage (small monitoring fee, **no retrieval charges**)." },
          { icon: "⚡", text: "**Express One Zone** — single-AZ, single-digit-ms latency, up to 10× faster than Standard for co-located compute." },
        ],
      },
    ],
    keyFacts: [
      { label: "Durability (all)", value: "11 nines across AZs", icon: "🛡️" },
      { label: "Single-AZ classes", value: "One-Zone-IA, Express One Zone", icon: "🏠" },
      { label: "Cheapest archive", value: "Glacier Deep Archive", icon: "🗄️" },
      { label: "Auto-tiering", value: "Intelligent-Tiering", icon: "🤖" },
    ],
    quickReference: {
      title: "Pick a class",
      icon: "🧭",
      bullets: [
        "Frequent access → **Standard**.",
        "Infrequent, rapid when needed → **Standard-IA**; non-critical/recreatable → **One-Zone-IA**.",
        "Archive: **Instant** (ms) / **Flexible** (mins–12h) / **Deep Archive** (12–48h, cheapest).",
        "Unknown/changing access patterns → **Intelligent-Tiering** (no retrieval fees).",
        "All classes = **11 nines durability**; availability & cost differ.",
      ],
      analogyBrief:
        "Storage classes are shelves by how often you reach for things: front counter (Standard), back room (IA), off-site vault (Glacier) — the deeper the vault, the cheaper but the longer to fetch.",
    },
    explanation:
      "Amazon S3 offers several storage classes that all share the same very high durability of 99.999999999% (11 nines) achieved by storing data across multiple Availability Zones — statistically about one object lost per 10,000 years for every 10 million stored. What differs is availability (how readily reachable the data is) and cost. S3 Standard is general purpose with 99.99% availability, low latency and high throughput, for frequently accessed data. The Infrequent Access tiers are cheaper for data accessed less often but needed rapidly when required: Standard-IA (99.9% availability, good for backups and DR) and One-Zone-IA (99.5% availability, stored in a single AZ so data is lost if that AZ is destroyed — suitable for secondary backups or re-creatable data). The Glacier archival classes are low-cost, priced as storage plus a retrieval fee: Glacier Instant Retrieval (millisecond retrieval, 90-day minimum), Glacier Flexible Retrieval (minutes to 12 hours, 90-day minimum), and Glacier Deep Archive (12 to 48 hours, 180-day minimum — the cheapest, for long-term retention). S3 Intelligent-Tiering charges a small monthly monitoring fee and automatically moves objects between access tiers based on usage with no retrieval charges — ideal when access patterns are unknown or changing. Finally, S3 Express One Zone is a high-performance, single-AZ class delivering single-digit-millisecond latency (up to 10× faster than Standard) for compute co-located in the same AZ. You can move objects between classes manually or automatically with S3 Lifecycle rules.",
    analogy:
      "S3 storage classes are like where a shop keeps its stock based on how often it's needed. Best-sellers sit on the front counter for instant grabbing (Standard). Slower items go to the back room — still quick, but a short walk (Infrequent Access). Rarely-needed records go to an off-site vault (Glacier), and the deeper and cheaper the vault, the longer the courier takes to bring a box back (Instant → Flexible → Deep Archive). Intelligent-Tiering is a smart stockroom manager who quietly moves items between these shelves based on how often you actually reach for them.",
    diagram: `<svg viewBox="0 0 720 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="S3 storage classes by cost and access">${svgDefs}
      <text x="30" y="24" fill="#ff9900" font-size="12" font-weight="700">Cheaper &amp; slower to retrieve →</text>
      ${box(20, 45, 120, 55, "Standard", "frequent", "#22c55e")}
      ${box(150, 45, 120, 55, "Standard-IA", "infrequent", "#3b82f6")}
      ${box(280, 45, 120, 55, "One-Zone-IA", "1 AZ", "#8b5cf6")}
      ${box(410, 45, 130, 55, "Glacier Instant", "ms, 90d", "#0891b2")}
      ${box(550, 45, 140, 55, "Glacier Flexible", "mins-12h, 90d", "#0e7490")}
      ${box(280, 120, 260, 45, "Glacier Deep Archive", "12-48h, 180d, cheapest", "#155e75")}
      ${box(20, 120, 240, 45, "Intelligent-Tiering", "auto-moves, no retrieval fee", "#f59e0b")}
      ${box(550, 120, 140, 45, "Express One Zone", "single-digit ms", "#ef4444")}
      <text x="360" y="200" text-anchor="middle" fill="#8b949e" font-size="11">All classes: 11 nines (99.999999999%) durability</text>
    </svg>`,
    diagramLegend: [
      { color: "#22c55e", label: "Standard / IA", description: "Frequent vs infrequent access, multi-AZ." },
      { color: "#0891b2", label: "Glacier tiers", description: "Archival; retrieval time grows as cost drops." },
      { color: "#f59e0b", label: "Intelligent-Tiering", description: "Auto-moves objects; no retrieval charges." },
    ],
    codeExample: {
      language: "bash",
      title: "Upload directly to a storage class & transition existing objects",
      code: `# Upload straight into Standard-IA
aws s3 cp report.csv s3://my-bucket/reports/report.csv \\
  --storage-class STANDARD_IA

# Change an existing object's class to Glacier Instant Retrieval
aws s3 cp s3://my-bucket/old.csv s3://my-bucket/old.csv \\
  --storage-class GLACIER_IR --metadata-directive COPY`,
    },
    problemStatement:
      "A company keeps: (a) hot user-uploaded thumbnails accessed constantly; (b) monthly financial reports rarely read but must return in milliseconds when audited; (c) 7-year compliance archives almost never touched where a 12-hour retrieval is fine; and (d) a dataset whose access pattern nobody can predict. Recommend the cheapest suitable storage class for each, and state what durability they all share.",
    questions: [
      {
        q: "Which statement about S3 durability across storage classes is TRUE?",
        options: [
          "A. S3 Standard is more durable than the Glacier archival storage classes",
          "B. One-Zone-IA has a lower rated durability because it is stored in only one AZ",
          "C. All classes offer the same 11 nines (99.999999999%) durability",
          "D. The durability of an object depends on how large the object is in bytes",
        ],
        answer: "C",
        explanation:
          "All S3 classes share the same 11 nines (99.999999999%) durability; what differs is availability and cost. One-Zone-IA still has 11 nines within its AZ (losing that AZ is an availability/loss risk, not a lower durability figure), and durability is independent of object size.",
      },
      {
        q: "Data is rarely accessed but must be retrievable in MILLISECONDS when needed. Which class is the best fit?",
        options: [
          "A. Glacier Deep Archive, restored within its standard 12-to-48-hour retrieval window",
          "B. Glacier Instant Retrieval, for archives that must return in milliseconds",
          "C. S3 Standard, kept permanently on the most expensive frequently-accessed tier",
          "D. Glacier Flexible Retrieval, using its expedited minutes-to-hours retrieval mode",
        ],
        answer: "B",
        explanation:
          "Glacier Instant Retrieval provides millisecond access at archival pricing (90-day minimum) — the fit for rarely-accessed data that must return instantly. Deep Archive and Flexible Retrieval take hours, and Standard is expensive for rarely-accessed data.",
      },
      {
        q: "You don't know how often objects will be accessed and want to avoid retrieval fees while optimizing cost automatically. Which class?",
        options: [
          "A. S3 Intelligent-Tiering, which auto-moves objects between access tiers",
          "B. One-Zone-IA, which stores the data cheaply inside a single Availability Zone",
          "C. Glacier Deep Archive, the lowest-cost class intended for long-term cold storage",
          "D. Standard-IA, which is priced for data accessed infrequently but needed quickly",
        ],
        answer: "A",
        explanation:
          "S3 Intelligent-Tiering automatically moves objects between access tiers based on usage and charges no retrieval fees — ideal when access patterns are unknown or changing. The other classes require you to already know the access pattern.",
      },
      {
        q: "Which class stores data in a SINGLE Availability Zone (so data is lost if that AZ is destroyed)?",
        options: [
          "A. S3 Standard, which replicates every object across multiple Availability Zones",
          "B. Standard-IA, which also spreads its data across several Availability Zones per Region",
          "C. Glacier Flexible Retrieval, which archives copies across multiple Availability Zones",
          "D. One-Zone-IA, which keeps the only copy inside a single Availability Zone",
        ],
        answer: "D",
        explanation:
          "One-Zone-IA stores data in a single Availability Zone (as does S3 Express One Zone), so the data is lost if that AZ is destroyed. S3 Standard, Standard-IA, and the Glacier tiers all span multiple AZs.",
      },
      {
        q: "For 7-year compliance archives that are almost never read and can tolerate 12+ hour retrieval, the cheapest choice is:",
        options: [
          "A. S3 Standard, keeping the archives on the frequently-accessed low-latency tier",
          "B. Glacier Deep Archive, the lowest-cost class intended for long-term retention",
          "C. Standard-IA, the infrequent-access tier meant for rapidly-retrievable backups",
          "D. S3 Intelligent-Tiering, which automatically shuffles the archives between tiers",
        ],
        answer: "B",
        explanation:
          "Glacier Deep Archive is the lowest-cost class for long-term retention, with 12–48 hour retrieval and a 180-day minimum — perfect for 7-year compliance archives. The other classes cost more for data that is almost never read.",
      },
    ],
  },
];
