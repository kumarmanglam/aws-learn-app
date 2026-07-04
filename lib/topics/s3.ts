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
        options: ["A. My_Backups", "B. mycompany-backups-2026", "C. 10.0.0.1", "D. Backups"],
        answer: "B",
        explanation:
          "B is correct: lowercase, hyphen allowed, not an IP. A has uppercase and an underscore; C is IP-formatted; D has uppercase. Names must also be globally unique.",
      },
      {
        q: "What is an S3 object's 'key'?",
        options: [
          "A. The KMS encryption key",
          "B. The object's full path (prefix + object name)",
          "C. The bucket's region",
          "D. The access key ID",
        ],
        answer: "B",
        explanation:
          "B is correct: the key is the full path, composed of a prefix and the object name. It is not an encryption or access key, nor the region.",
      },
      {
        q: "A single PUT of a 6GB file fails. What is the correct approach?",
        options: [
          "A. Split into two buckets",
          "B. Use multi-part upload (required above 5GB)",
          "C. Compress below 5MB first",
          "D. Enable versioning",
        ],
        answer: "B",
        explanation:
          "B is correct: files larger than 5GB must use multi-part upload (max object size is 5TB). The others don't address the single-PUT size limit.",
      },
      {
        q: "How are 'folders' represented in Amazon S3?",
        options: [
          "A. As real directory objects",
          "B. They don't exist; slashes in object keys create the appearance of folders",
          "C. As separate buckets",
          "D. As tags",
        ],
        answer: "B",
        explanation:
          "B is correct: S3 has no true directories — keys just contain slashes, which the console renders as folders. Buckets and tags are different concepts.",
      },
      {
        q: "Which is TRUE about S3 buckets and regions?",
        options: [
          "A. Bucket names are unique only within a region",
          "B. Buckets are created in a region but names must be globally unique",
          "C. Buckets are global with no region",
          "D. Two accounts can share the same bucket name in different regions",
        ],
        answer: "B",
        explanation:
          "B is correct: a bucket lives in a chosen region, but its name must be globally unique across all accounts/regions. A, C, and D contradict that.",
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
          "A. Hard-code IAM access keys in the app",
          "B. Attach an IAM role to the EC2 instance",
          "C. Make the bucket public",
          "D. Use the root account credentials",
        ],
        answer: "B",
        explanation:
          "B is correct: attach an IAM role so the instance gets temporary credentials automatically. Hard-coding keys or using root is insecure; making the bucket public is unnecessary and risky.",
      },
      {
        q: "An IAM policy allows s3:GetObject, but a bucket policy has an explicit Deny for that user. What happens?",
        options: [
          "A. Access is allowed (IAM wins)",
          "B. Access is denied (explicit deny always wins)",
          "C. It depends on which was created first",
          "D. Access is allowed only over HTTPS",
        ],
        answer: "B",
        explanation:
          "B is correct: an explicit Deny overrides any Allow. Access is granted only if (IAM or resource policy) allows AND there is no explicit deny.",
      },
      {
        q: "To let another AWS account access your bucket, you use:",
        options: [
          "A. A bucket policy with that account as the Principal",
          "B. A security group",
          "C. A NAT gateway",
          "D. A VPC peering connection only",
        ],
        answer: "A",
        explanation:
          "A is correct: cross-account S3 access is granted via a bucket (resource) policy naming the other account as Principal. Security groups/NAT/peering are network constructs, not S3 authorization.",
      },
      {
        q: "What is the purpose of S3 'Block Public Access'?",
        options: [
          "A. To encrypt objects",
          "B. To prevent accidental public exposure of bucket data (anti-leak safety net)",
          "C. To speed up uploads",
          "D. To enable versioning",
        ],
        answer: "B",
        explanation:
          "B is correct: Block Public Access guards against data leaks and can be enforced account-wide; keep it on unless a bucket must be public. It's unrelated to encryption, speed, or versioning.",
      },
      {
        q: "Which fields are part of an S3 bucket policy statement?",
        options: [
          "A. Effect, Principal, Action, Resource",
          "B. CIDR, Port, Protocol",
          "C. TTL, Weight, SetIdentifier",
          "D. Engine, InstanceClass, Storage",
        ],
        answer: "A",
        explanation:
          "A is correct: bucket policies are JSON with Effect, Principal, Action, and Resource. The others belong to security groups, Route 53 records, and RDS respectively.",
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
        options: ["A. Static website hosting", "B. Versioning", "C. Transfer Acceleration", "D. Requester Pays"],
        answer: "B",
        explanation:
          "B is correct: replication requires versioning enabled on both buckets (plus an IAM role). The others are unrelated prerequisites.",
      },
      {
        q: "After enabling replication, a team notices EXISTING objects weren't copied. Why, and what's the fix?",
        options: [
          "A. Replication is broken; recreate the bucket",
          "B. Only new objects replicate; use S3 Batch Replication for existing ones",
          "C. Existing objects can never be replicated",
          "D. They must disable versioning first",
        ],
        answer: "B",
        explanation:
          "B is correct: replication applies to new objects going forward; S3 Batch Replication copies existing (and previously failed) objects. It's not broken and old objects can be replicated.",
      },
      {
        q: "Which replication type copies objects to a bucket in a DIFFERENT AWS Region?",
        options: ["A. SRR", "B. CRR", "C. TTL", "D. ACL"],
        answer: "B",
        explanation:
          "B is correct: Cross-Region Replication (CRR) targets another Region (compliance, latency, cross-account). SRR is same-Region; TTL and ACL are unrelated.",
      },
      {
        q: "Which statement about S3 replication is TRUE?",
        options: [
          "A. Replication is chained: bucket1→bucket2→bucket3 forwards bucket1's objects to bucket3",
          "B. There is no chaining of replication",
          "C. Deletions by version ID are always replicated",
          "D. Replication is synchronous",
        ],
        answer: "B",
        explanation:
          "B is correct: replication does not chain. Versioned (by version ID) deletes are NOT replicated, and replication is asynchronous — so A, C, and D are false.",
      },
      {
        q: "A user overwrites an important object by mistake. Which S3 feature lets them recover the previous content?",
        options: ["A. Versioning", "B. Transfer Acceleration", "C. Storage Lens", "D. Requester Pays"],
        answer: "A",
        explanation:
          "A is correct: with versioning enabled, the previous version is retained and can be restored. The others don't provide recovery of overwritten objects.",
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
          "A. Enable versioning",
          "B. Add a bucket policy allowing public s3:GetObject (and disable Block Public Access)",
          "C. Switch the bucket to another region",
          "D. Enable Transfer Acceleration",
        ],
        answer: "B",
        explanation:
          "B is correct: a 403 on a static site means public reads aren't allowed — add a public-read bucket policy and turn off Block Public Access. Versioning, region, and acceleration don't govern public read access.",
      },
      {
        q: "What does the S3 static website endpoint URL depend on?",
        options: [
          "A. The object's version ID",
          "B. The bucket's Region (e.g. bucket.s3-website-us-east-1.amazonaws.com)",
          "C. The IAM user",
          "D. The object tags",
        ],
        answer: "B",
        explanation:
          "B is correct: the website endpoint is region-specific: bucket-name.s3-website-region.amazonaws.com. Version IDs, IAM users, and tags don't form the URL.",
      },
      {
        q: "For a bucket's public-read policy to actually take effect for a website, you must also:",
        options: [
          "A. Enable MFA Delete",
          "B. Disable Block Public Access",
          "C. Enable Requester Pays",
          "D. Turn on CRR",
        ],
        answer: "B",
        explanation:
          "B is correct: Block Public Access will override a public policy, so it must be disabled for a genuinely public website. The others are unrelated to public access.",
      },
      {
        q: "S3 static website hosting is best suited for:",
        options: [
          "A. Server-side rendered apps needing a database",
          "B. Static content (HTML/CSS/JS/images)",
          "C. Running containers",
          "D. Hosting a MySQL database",
        ],
        answer: "B",
        explanation:
          "B is correct: it serves static assets. Dynamic/DB-backed apps and containers need compute (EC2/Lambda/ECS); S3 can't run a database.",
      },
      {
        q: "To add HTTPS and a custom domain in front of an S3 static website, you typically use:",
        options: ["A. CloudFront", "B. A NAT gateway", "C. An Internet Gateway only", "D. Storage Lens"],
        answer: "A",
        explanation:
          "A is correct: place CloudFront in front for HTTPS, custom domains, and caching. NAT/IGW are network routing; Storage Lens is analytics.",
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
          "A. Standard is more durable than Glacier",
          "B. All classes offer the same 11 nines (99.999999999%) durability",
          "C. One-Zone-IA has lower durability because it's in one AZ",
          "D. Durability depends on object size",
        ],
        answer: "B",
        explanation:
          "B is correct: all classes share 11 nines durability. What differs is availability and cost. (One-Zone-IA is still 11 nines within its AZ, but losing that AZ loses the data — an availability/loss risk, not a stated lower durability figure.)",
      },
      {
        q: "Data is rarely accessed but must be retrievable in MILLISECONDS when needed. Which class is the best fit?",
        options: [
          "A. Glacier Deep Archive",
          "B. Glacier Instant Retrieval",
          "C. Standard",
          "D. Glacier Flexible Retrieval",
        ],
        answer: "B",
        explanation:
          "B is correct: Glacier Instant Retrieval gives millisecond access at archival pricing (90-day min). Deep Archive/Flexible have hours-long retrieval; Standard is pricier for rarely-accessed data.",
      },
      {
        q: "You don't know how often objects will be accessed and want to avoid retrieval fees while optimizing cost automatically. Which class?",
        options: ["A. One-Zone-IA", "B. S3 Intelligent-Tiering", "C. Glacier Deep Archive", "D. Standard-IA"],
        answer: "B",
        explanation:
          "B is correct: Intelligent-Tiering auto-moves objects between tiers based on usage with no retrieval charges — ideal for unknown/changing patterns. The others require you to know the access pattern.",
      },
      {
        q: "Which class stores data in a SINGLE Availability Zone (so data is lost if that AZ is destroyed)?",
        options: ["A. S3 Standard", "B. Standard-IA", "C. One-Zone-IA", "D. Glacier Flexible Retrieval"],
        answer: "C",
        explanation:
          "C is correct: One-Zone-IA keeps data in a single AZ (also true of Express One Zone). Standard, Standard-IA, and the Glacier tiers span multiple AZs.",
      },
      {
        q: "For 7-year compliance archives that are almost never read and can tolerate 12+ hour retrieval, the cheapest choice is:",
        options: ["A. Standard", "B. Glacier Deep Archive", "C. Standard-IA", "D. Intelligent-Tiering"],
        answer: "B",
        explanation:
          "B is correct: Glacier Deep Archive is the lowest-cost class for long-term retention with 12–48h retrieval and a 180-day minimum. The others cost more for cold, rarely-accessed data.",
      },
    ],
  },
];
