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
// SECTION: AWS Storage Extras
// Snowball, FSx, Storage Gateway, Transfer Family & DataSync.
// Course slides ~p343–367.
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

export const storageExtrasTopics: Topic[] = [
  // -----------------------------------------------------------------
  {
    id: "aws-snowball",
    title: "AWS Snowball & Edge Computing",
    shortLabel: "AWS Snowball",
    section: "AWS Storage Extras",
    domain: "Storage",
    tldr:
      "Snowball devices physically ship petabytes of data into/out of AWS when the network is too slow (rule of thumb: > 1 week to transfer online). Snowball Edge (Storage/Compute Optimized) can also run EC2/Lambda for edge computing in disconnected locations. Snowball can't import to Glacier directly — land in S3, then lifecycle to Glacier.",
    subtopics: [
      {
        heading: "What Snowball is",
        bullets: [
          { icon: "📦", text: "Portable, secure devices to **collect/process data at the edge** and **migrate data** in/out of AWS (up to PB scale)." },
          { icon: "💽", text: "**Snowball Edge Storage Optimized** (~210 TB) vs **Compute Optimized** (~28 TB, more compute)." },
        ],
      },
      {
        heading: "When to use it (network math)",
        bullets: [
          { icon: "🕐", text: "If transferring over the network would take **more than a week**, use Snowball." },
          { icon: "🚧", text: "Beats limited bandwidth, high transfer cost, and unstable connections for huge datasets." },
        ],
      },
      {
        heading: "Edge computing & Glacier path",
        bullets: [
          { icon: "🛰️", text: "**Edge computing**: run **EC2 instances / Lambda** on the device where connectivity is poor (trucks, ships, mines) — preprocess, ML, transcode." },
          { icon: "❄️", text: "Snowball **cannot import to Glacier directly** — import to **Amazon S3** first, then use an **S3 Lifecycle policy** to move to Glacier." },
        ],
      },
    ],
    keyFacts: [
      { label: "Use when", value: "Online transfer > 1 week", icon: "🕐" },
      { label: "Edge compute", value: "EC2 / Lambda on device", icon: "🛰️" },
      { label: "To Glacier", value: "S3 first, then lifecycle", icon: "❄️" },
      { label: "Scale", value: "Up to petabytes", icon: "📦" },
    ],
    quickReference: {
      title: "Exam cues",
      icon: "🎯",
      bullets: [
        "'100TB+ to move, slow/limited/unstable link' → **Snowball** (physical).",
        "Rule of thumb: **> 1 week online = use Snowball**.",
        "'Process data with EC2/Lambda in a disconnected location' → **Snowball Edge**.",
        "Snowball → Glacier? **Land in S3**, then **lifecycle** to Glacier.",
      ],
      analogyBrief:
        "Snowball is FedEx for data: when uploading over the wire would take weeks, you ship a hard drive instead — and it can even run computers inside on the truck.",
    },
    explanation:
      "AWS Snowball devices are highly secure, portable appliances used to collect and process data at the edge and to migrate large amounts of data into and out of AWS — up to petabytes. There are two Snowball Edge variants: Storage Optimized (around 210 TB, for bulk migration) and Compute Optimized (around 28 TB with more compute). The core decision rule is bandwidth-based: transferring huge datasets over the network can take days, weeks, or years depending on the link, so if an online transfer would take more than about a week, ship a Snowball instead. This sidesteps limited connectivity, limited or shared bandwidth, high network cost, and connection instability. Snowball Edge also enables edge computing: you can run EC2 instances or Lambda functions directly on the device in locations with limited or no Internet — a truck on the road, a ship at sea, a mine underground — to preprocess data, run machine learning, or transcode media before shipping. One important limitation: Snowball cannot import directly to S3 Glacier; you import into Amazon S3 first and then use an S3 Lifecycle policy to transition the objects to Glacier.",
    analogy:
      "Snowball is FedEx for data. If mailing your terabytes over the Internet would take weeks (or years), you instead load them onto a rugged, encrypted drive and physically ship it to AWS. The Edge models are like a delivery truck that also has a small office inside — you can run computers (EC2/Lambda) on board to process the cargo while it's still out in the field with no reliable Internet.",
    diagram: `<svg viewBox="0 0 720 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Snowball migration to S3 then Glacier">${svgDefs}
      ${box(20, 70, 110, 50, "On-prem data", "petabytes", "#8b949e")}
      ${box(160, 70, 120, 50, "Snowball", "ship device", "#f59e0b")}
      <line x1="130" y1="95" x2="158" y2="95" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(320, 70, 120, 50, "Amazon S3", "import", "#16a34a")}
      <line x1="280" y1="95" x2="318" y2="95" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="285" y="60" fill="#8b949e" font-size="9">ship + import</text>
      ${box(490, 70, 130, 50, "Glacier", "archive", "#0891b2")}
      <line x1="440" y1="95" x2="488" y2="95" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="450" y="60" fill="#8b949e" font-size="9">S3 lifecycle</text>
      <text x="360" y="160" text-anchor="middle" fill="#8b949e" font-size="10">Snowball cannot import to Glacier directly</text>
    </svg>`,
    diagramLegend: [
      { color: "#f59e0b", label: "Snowball device", description: "Physically ships data (and can run edge compute)." },
      { color: "#16a34a", label: "Amazon S3", description: "Import lands here first." },
      { color: "#0891b2", label: "Glacier", description: "Reached only via an S3 lifecycle policy." },
    ],
    codeExample: {
      language: "bash",
      title: "Create a Snowball import job (data lands in S3)",
      code: `aws snowball create-job \\
  --job-type IMPORT \\
  --resources '{"S3Resources":[{"BucketArn":"arn:aws:s3:::my-import-bucket"}]}' \\
  --address-id ADID-1234 \\
  --snowball-type EDGE_S \\
  --shipping-option SECOND_DAY
# After import to S3, add an S3 Lifecycle rule to transition to Glacier.`,
    },
    problemStatement:
      "A media company must move 400TB of archived footage from an on-prem NAS to AWS, but their Internet link would take months to upload it, and the final destination is S3 Glacier Deep Archive. Separately, a research ship at sea with no reliable connectivity needs to run ML on sensor data locally. Which Snowball options fit each need, and how do you get the 400TB into Glacier?",
    questions: [
      {
        q: "Migrating 400TB over a link that would take months. What's the recommended approach?",
        options: [
          "A. Multipart upload over the Internet",
          "B. Ship the data physically with AWS Snowball",
          "C. Enable Transfer Acceleration",
          "D. Use CloudFront",
        ],
        answer: "B",
        explanation:
          "B is correct: when an online transfer would take more than ~a week, Snowball (physical shipment) is the practical choice. Multipart/Transfer Acceleration still ride the slow link; CloudFront is a CDN.",
      },
      {
        q: "Snowball CANNOT import directly to which service — requiring an intermediate step?",
        options: ["A. Amazon S3", "B. S3 Glacier (must land in S3, then lifecycle)", "C. EBS", "D. EFS"],
        answer: "B",
        explanation:
          "B is correct: Snowball imports to Amazon S3, and you then use an S3 lifecycle policy to move objects to Glacier. It doesn't import to Glacier directly.",
      },
      {
        q: "A disconnected ship needs to run ML/EC2/Lambda on data locally before shipping it. Which capability?",
        options: [
          "A. Snowball Edge (edge computing)",
          "B. S3 Transfer Acceleration",
          "C. Storage Gateway",
          "D. Global Accelerator",
        ],
        answer: "A",
        explanation:
          "A is correct: Snowball Edge supports edge computing (EC2 instances/Lambda) in locations with poor connectivity. The others don't run compute at a disconnected edge.",
      },
      {
        q: "Which Snowball Edge variant offers the MOST storage for bulk data migration?",
        options: ["A. Compute Optimized", "B. Storage Optimized", "C. They are identical", "D. Neither stores data"],
        answer: "B",
        explanation:
          "B is correct: Storage Optimized (~210 TB) maximizes storage for migration; Compute Optimized (~28 TB) trades storage for more compute at the edge.",
      },
      {
        q: "The primary decision factor for choosing Snowball over network transfer is:",
        options: [
          "A. Object size limits in S3",
          "B. How long an online transfer would take (bandwidth/time)",
          "C. The AWS Region",
          "D. Whether versioning is enabled",
        ],
        answer: "B",
        explanation:
          "B is correct: it's a bandwidth/time trade-off — if online transfer would exceed roughly a week, Snowball wins. S3 object limits, Region, and versioning aren't the deciding factors.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "amazon-fsx",
    title: "Amazon FSx — Windows, Lustre, NetApp ONTAP & OpenZFS",
    shortLabel: "Amazon FSx",
    section: "AWS Storage Extras",
    domain: "Storage",
    tldr:
      "FSx runs fully-managed 3rd-party file systems: FSx for Windows File Server (SMB/NTFS, Active Directory), FSx for Lustre (HPC/ML, integrates with S3, huge throughput), FSx for NetApp ONTAP (NFS/SMB/iSCSI, broad OS compatibility), and FSx for OpenZFS (NFS, migrate ZFS workloads).",
    subtopics: [
      {
        heading: "FSx for Windows File Server",
        bullets: [
          { icon: "🪟", text: "Managed **Windows** shared drive; **SMB** protocol + **Windows NTFS**; **Active Directory** integration, ACLs, quotas." },
          { icon: "🐧", text: "Can be mounted on **Linux** too; supports **DFS Namespaces**; SSD/HDD; Multi-AZ; daily backups to S3." },
        ],
      },
      {
        heading: "FSx for Lustre (HPC)",
        bullets: [
          { icon: "🧪", text: "Parallel distributed file system for **HPC, machine learning, video/financial processing**; 100s GB/s, sub-ms latency." },
          { icon: "🪣", text: "**Seamless S3 integration** — read S3 as a file system and write results back; **Scratch** (temporary, high burst) vs **Persistent** (durable) deployments." },
        ],
      },
      {
        heading: "NetApp ONTAP & OpenZFS",
        bullets: [
          { icon: "🔗", text: "**NetApp ONTAP** — **NFS, SMB, iSCSI**; broad OS compatibility; snapshots, replication, compression, dedup, instant clones." },
          { icon: "🌊", text: "**OpenZFS** — **NFS**; migrate ZFS workloads; up to ~1M IOPS <0.5 ms; snapshots, compression, instant clones." },
        ],
      },
    ],
    keyFacts: [
      { label: "Windows shares", value: "FSx for Windows (SMB/AD)", icon: "🪟" },
      { label: "HPC / ML + S3", value: "FSx for Lustre", icon: "🧪" },
      { label: "NFS+SMB+iSCSI", value: "FSx for NetApp ONTAP", icon: "🔗" },
      { label: "ZFS migration", value: "FSx for OpenZFS", icon: "🌊" },
    ],
    quickReference: {
      title: "Pick the FSx",
      icon: "🎯",
      bullets: [
        "'Windows/SMB shared drive with Active Directory' → **FSx for Windows**.",
        "'HPC/ML high-throughput file system + S3 integration' → **FSx for Lustre**.",
        "'Broadest protocol/OS compatibility (NFS+SMB+iSCSI)' → **FSx for NetApp ONTAP**.",
        "'Move existing ZFS workloads to AWS' → **FSx for OpenZFS**.",
        "Lustre **Scratch** = temporary/high-burst; **Persistent** = durable.",
      ],
      analogyBrief:
        "FSx is a rental fleet of specialist filing systems: a Windows office cabinet, a supercomputer's scratchpad (Lustre), a universal adapter cabinet (ONTAP), and a ZFS clone (OpenZFS).",
    },
    explanation:
      "Amazon FSx lets you launch fully-managed third-party high-performance file systems on AWS. FSx for Windows File Server is a managed Windows file share using the SMB protocol and Windows NTFS, with Microsoft Active Directory integration, ACLs, and user quotas; it can also be mounted on Linux, supports Microsoft's Distributed File System (DFS) Namespaces, offers SSD or HDD storage, can be Multi-AZ, and backs up daily to S3. FSx for Lustre is a parallel, distributed file system built for large-scale computing — high-performance computing, machine learning, and video/financial processing — scaling to hundreds of GB/s with sub-millisecond latency; it integrates seamlessly with S3 (you can read an S3 bucket as a file system and write results back) and comes in Scratch deployments (temporary storage, not replicated, very high burst) and Persistent deployments (durable, replicated within an AZ). FSx for NetApp ONTAP is a managed ONTAP file system compatible with NFS, SMB, and iSCSI, offering the broadest operating-system compatibility along with snapshots, replication, low-cost/compression/deduplication, and point-in-time instant cloning. FSx for OpenZFS is a managed OpenZFS file system compatible with NFS for migrating ZFS workloads, delivering up to about 1,000,000 IOPS at sub-0.5ms latency with snapshots, compression, and instant clones.",
    analogy:
      "FSx is a rental service for specialist filing systems, each tuned for a different tenant. FSx for Windows is the corporate office's Windows filing cabinet that plugs straight into the company badge system (Active Directory). FSx for Lustre is a supercomputer's ultra-fast scratchpad that can pull raw material straight from the S3 warehouse. FSx for NetApp ONTAP is a universal cabinet with adapters for every protocol and OS. FSx for OpenZFS is an exact managed clone of a team's existing ZFS setup so they can move in without changing their tools.",
    diagram: `<svg viewBox="0 0 720 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Amazon FSx variants">${svgDefs}
      <text x="360" y="26" text-anchor="middle" fill="#ff9900" font-size="13" font-weight="700">Amazon FSx — managed 3rd-party file systems</text>
      ${box(20, 60, 160, 70, "FSx for Windows", "SMB/NTFS · AD", "#3b82f6")}
      ${box(200, 60, 160, 70, "FSx for Lustre", "HPC/ML · S3", "#8b5cf6")}
      ${box(380, 60, 160, 70, "FSx for NetApp ONTAP", "NFS·SMB·iSCSI", "#16a34a")}
      ${box(560, 60, 140, 70, "FSx for OpenZFS", "NFS · ZFS", "#f59e0b")}
      <text x="360" y="175" text-anchor="middle" fill="#8b949e" font-size="10">Lustre: Scratch (temporary/burst) vs Persistent (durable)</text>
    </svg>`,
    diagramLegend: [
      { color: "#3b82f6", label: "FSx Windows", description: "SMB/NTFS shares with Active Directory." },
      { color: "#8b5cf6", label: "FSx Lustre", description: "HPC/ML file system, S3-integrated." },
      { color: "#16a34a", label: "FSx ONTAP", description: "Broadest protocol/OS compatibility." },
    ],
    codeExample: {
      language: "bash",
      title: "Create an FSx for Lustre file system linked to an S3 bucket",
      code: `aws fsx create-file-system \\
  --file-system-type LUSTRE \\
  --storage-capacity 1200 \\
  --subnet-ids subnet-0aaa \\
  --lustre-configuration '{
    "DeploymentType": "SCRATCH_2",
    "ImportPath": "s3://my-training-data",
    "ExportPath": "s3://my-training-results"
  }'`,
    },
    problemStatement:
      "A team needs (a) a Windows SMB shared drive integrated with their Active Directory for a legacy app; and (b) an ultra-high-throughput file system for a machine-learning training job whose input dataset lives in S3 and whose outputs must be written back to S3. Which FSx offering fits each, and which Lustre deployment type suits a temporary training run?",
    questions: [
      {
        q: "A legacy Windows application needs an SMB shared drive integrated with Active Directory. Which FSx?",
        options: ["A. FSx for Lustre", "B. FSx for Windows File Server", "C. FSx for OpenZFS", "D. EFS"],
        answer: "B",
        explanation:
          "B is correct: FSx for Windows File Server provides SMB/NTFS shares with Active Directory integration. Lustre/OpenZFS target HPC/ZFS; EFS is Linux NFS.",
      },
      {
        q: "A machine-learning job needs a high-throughput file system that integrates with S3 for input/output. Which FSx?",
        options: ["A. FSx for Windows", "B. FSx for Lustre", "C. FSx for NetApp ONTAP", "D. FSx for OpenZFS"],
        answer: "B",
        explanation:
          "B is correct: FSx for Lustre is built for HPC/ML with seamless S3 integration (read S3 as a file system, write results back) and massive throughput.",
      },
      {
        q: "Which FSx offering supports the BROADEST protocol set (NFS, SMB, and iSCSI)?",
        options: ["A. FSx for Windows", "B. FSx for Lustre", "C. FSx for NetApp ONTAP", "D. FSx for OpenZFS"],
        answer: "C",
        explanation:
          "C is correct: FSx for NetApp ONTAP supports NFS, SMB, and iSCSI with broad OS compatibility. Windows is SMB, Lustre and OpenZFS are their own protocols/NFS.",
      },
      {
        q: "For a TEMPORARY, high-burst Lustre training run where data can be reconstructed from S3, which deployment type?",
        options: ["A. Persistent", "B. Scratch", "C. Multi-AZ", "D. Cold HDD"],
        answer: "B",
        explanation:
          "B is correct: Scratch file systems are temporary, not replicated, and give high burst — ideal for short-term processing where data is reconstructable. Persistent is for durable, long-term use.",
      },
      {
        q: "A team wants to migrate existing ZFS workloads to a managed AWS file system over NFS. Which FSx?",
        options: ["A. FSx for OpenZFS", "B. FSx for Windows", "C. FSx for Lustre", "D. FSx for NetApp ONTAP"],
        answer: "A",
        explanation:
          "A is correct: FSx for OpenZFS is purpose-built to move ZFS workloads to AWS over NFS. The others target Windows/HPC/multi-protocol use cases.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "storage-gateway",
    title: "AWS Storage Gateway (Hybrid) & Storage Comparison",
    shortLabel: "Storage Gateway",
    section: "AWS Storage Extras",
    domain: "Storage",
    tldr:
      "Storage Gateway bridges on-premises and AWS storage for hybrid cloud (backup, DR, tiered storage, low-latency cache). Types: S3 File Gateway (NFS/SMB → S3, cached), Volume Gateway (iSCSI block → S3, EBS snapshots), and Tape Gateway (VTL → S3/Glacier for backup software).",
    subtopics: [
      {
        heading: "Why hybrid & Storage Gateway",
        bullets: [
          { icon: "🌉", text: "Bridges on-prem data and cloud data — for **DR, backup & restore, tiered storage, low-latency cache**." },
          { icon: "🏢", text: "Needed because S3 is a **proprietary** object store; Storage Gateway exposes it via familiar on-prem protocols." },
        ],
      },
      {
        heading: "Gateway types",
        bullets: [
          { icon: "📁", text: "**S3 File Gateway** — access S3 via **NFS/SMB**; caches recent data; lifecycle to Glacier; SMB integrates with **Active Directory**." },
          { icon: "💽", text: "**Volume Gateway** — **iSCSI block** storage backed by S3, with **EBS snapshots**; **Cached** (low-latency to recent data) vs **Stored** (full dataset on-prem, scheduled S3 backups)." },
          { icon: "📼", text: "**Tape Gateway** — **Virtual Tape Library (VTL)** backed by S3/Glacier so existing **tape-based backup software** works unchanged (iSCSI)." },
        ],
      },
      {
        heading: "Cloud-native storage families (comparison)",
        bullets: [
          { icon: "🧱", text: "**Block** — EBS, EC2 Instance Store. **File** — EFS, FSx. **Object** — S3, Glacier." },
        ],
      },
    ],
    keyFacts: [
      { label: "File Gateway", value: "NFS/SMB → S3 (cached)", icon: "📁" },
      { label: "Volume Gateway", value: "iSCSI block → S3 (EBS snaps)", icon: "💽" },
      { label: "Tape Gateway", value: "VTL → S3/Glacier", icon: "📼" },
      { label: "Purpose", value: "Hybrid cloud bridge", icon: "🌉" },
    ],
    quickReference: {
      title: "Pick the gateway",
      icon: "🎯",
      bullets: [
        "'On-prem apps need NFS/SMB access to S3' → **S3 File Gateway**.",
        "'On-prem block storage backed by S3 with EBS snapshots' → **Volume Gateway**.",
        "'Keep existing tape backup software but store in cloud' → **Tape Gateway**.",
        "Block=EBS/Instance Store · File=EFS/FSx · Object=S3/Glacier.",
        "Volume Gateway: **Cached** (recent local) vs **Stored** (full local + backups).",
      ],
      analogyBrief:
        "Storage Gateway is a translator at the border between your data center's dialects (NFS/SMB/iSCSI/tape) and AWS's object storage — locals speak normally while data flows to the cloud.",
    },
    explanation:
      "AWS is pushing hybrid cloud, where part of your infrastructure is on the cloud and part stays on-premises — driven by long migrations, security or compliance requirements, or IT strategy. Since S3 is a proprietary object store (unlike NFS/EFS), AWS Storage Gateway is the bridge that exposes cloud storage to on-premises systems through familiar protocols. Its use cases are disaster recovery, backup and restore, tiered storage, and on-premises cache with low-latency file access. There are three gateway types. S3 File Gateway makes configured S3 buckets accessible over NFS and SMB, caches the most recently used data locally, supports transitioning to Glacier via lifecycle policy, uses IAM roles per gateway, and (for SMB) integrates with Active Directory for user authentication. Volume Gateway provides block storage over iSCSI backed by S3, with EBS snapshots to restore on-premises volumes; it comes as Cached volumes (low-latency access to the most recent data, with the full dataset in S3) or Stored volumes (the entire dataset lives on-premises with scheduled backups to S3). Tape Gateway offers a Virtual Tape Library backed by S3 and Glacier so companies can keep their existing tape-based backup processes and software while storing the tapes in the cloud (via an iSCSI interface). For the bigger picture, AWS's cloud-native storage falls into three families: Block (Amazon EBS, EC2 Instance Store), File (Amazon EFS, Amazon FSx), and Object (Amazon S3, Amazon S3 Glacier).",
    analogy:
      "Storage Gateway is a bilingual translator stationed at the border between your on-premises data center and AWS. Your local systems keep speaking their native dialects — NFS and SMB (File Gateway), iSCSI block (Volume Gateway), or even old-fashioned tape (Tape Gateway) — while the translator quietly ferries everything into and out of the S3/Glacier warehouse across the border, keeping a copy of the most-used files nearby so locals don't wait.",
    diagram: `<svg viewBox="0 0 720 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Storage Gateway types">${svgDefs}
      <rect x="20" y="30" width="230" height="170" rx="10" fill="#1a2332" stroke="#8b949e" stroke-dasharray="4 4"/>
      <text x="35" y="50" fill="#8b949e" font-size="11" font-weight="700">On-Premises</text>
      ${box(35, 60, 200, 35, "File GW (NFS/SMB)", "", "#3b82f6")}
      ${box(35, 105, 200, 35, "Volume GW (iSCSI)", "", "#8b5cf6")}
      ${box(35, 150, 200, 35, "Tape GW (VTL)", "", "#f59e0b")}
      ${box(300, 95, 120, 45, "Storage Gateway", "encrypted", "#22c55e")}
      <line x1="250" y1="118" x2="298" y2="118" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(480, 40, 200, 35, "Amazon S3", "objects", "#16a34a")}
      ${box(480, 90, 200, 35, "Amazon EBS snapshots", "block restore", "#16a34a")}
      ${box(480, 140, 200, 35, "S3 Glacier", "tape archive", "#0891b2")}
      <line x1="420" y1="110" x2="478" y2="60" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
      <line x1="420" y1="118" x2="478" y2="107" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
      <line x1="420" y1="128" x2="478" y2="155" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
    </svg>`,
    diagramLegend: [
      { color: "#3b82f6", label: "File Gateway", description: "NFS/SMB access to S3, locally cached." },
      { color: "#8b5cf6", label: "Volume Gateway", description: "iSCSI block backed by S3 + EBS snapshots." },
      { color: "#f59e0b", label: "Tape Gateway", description: "Virtual tape library to S3/Glacier." },
    ],
    codeExample: {
      language: "text",
      title: "Choosing a Storage Gateway type (decision guide)",
      code: `On-prem apps mount a network share (NFS/SMB) and want S3   -> S3 File Gateway
On-prem servers need block volumes (iSCSI) backed by S3    -> Volume Gateway
   - mostly recent data, low latency locally                 -> Cached volumes
   - entire dataset must stay on-prem, back up to S3         -> Stored volumes
Existing tape backup software must keep working (in cloud) -> Tape Gateway (VTL)`,
    },
    problemStatement:
      "An enterprise with a large tape-based backup process wants to eliminate physical tapes but keep their existing backup software, while a different on-prem application team needs to read/write files that ultimately live in S3 over an SMB share with Active Directory logins. Which Storage Gateway type serves each requirement, and where does each store data in AWS?",
    questions: [
      {
        q: "On-prem applications need to access S3 data over NFS/SMB with local caching. Which gateway?",
        options: ["A. S3 File Gateway", "B. Volume Gateway", "C. Tape Gateway", "D. Global Accelerator"],
        answer: "A",
        explanation:
          "A is correct: S3 File Gateway exposes S3 via NFS/SMB and caches recently used data (SMB integrates with AD). Volume=block, Tape=VTL, GA is networking.",
      },
      {
        q: "A company wants to retire physical tapes but keep its existing tape-backup software. Which gateway?",
        options: ["A. Tape Gateway (Virtual Tape Library)", "B. S3 File Gateway", "C. Volume Gateway", "D. DataSync"],
        answer: "A",
        explanation:
          "A is correct: Tape Gateway presents a Virtual Tape Library backed by S3/Glacier so existing backup software works unchanged. The others don't emulate tapes.",
      },
      {
        q: "Volume Gateway provides which kind of storage to on-premises servers?",
        options: [
          "A. Object storage over HTTP",
          "B. Block storage over iSCSI, backed by S3 with EBS snapshots",
          "C. A managed NFS file system",
          "D. A virtual tape library",
        ],
        answer: "B",
        explanation:
          "B is correct: Volume Gateway serves iSCSI block volumes backed by S3, with EBS snapshots for restore (Cached vs Stored modes). Object/NFS/VTL describe other services/gateways.",
      },
      {
        q: "In AWS's storage families, which service is OBJECT storage?",
        options: ["A. Amazon EBS", "B. Amazon EFS", "C. Amazon S3", "D. EC2 Instance Store"],
        answer: "C",
        explanation:
          "C is correct: S3 (and Glacier) is object storage. EBS and Instance Store are block; EFS is file storage.",
      },
      {
        q: "Volume Gateway 'Cached' vs 'Stored' volumes differ how?",
        options: [
          "A. Cached keeps only recent data locally (full set in S3); Stored keeps the entire dataset on-prem with scheduled S3 backups",
          "B. They are identical",
          "C. Cached is for tapes; Stored is for files",
          "D. Stored keeps nothing locally",
        ],
        answer: "A",
        explanation:
          "A is correct: Cached volumes keep low-latency access to recent data with the full dataset in S3, while Stored volumes keep the entire dataset on-premises and back up to S3 on a schedule.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "transfer-family-datasync",
    title: "AWS Transfer Family & DataSync",
    shortLabel: "Transfer Family & DataSync",
    section: "AWS Storage Extras",
    domain: "Storage",
    tldr:
      "AWS Transfer Family is a managed FTP/FTPS/SFTP front end to S3 or EFS (pay per endpoint-hour + data). AWS DataSync moves and syncs large data between on-prem (needs an agent) and AWS, or AWS-to-AWS (no agent), to S3/EFS/FSx on a schedule, preserving file permissions and metadata.",
    subtopics: [
      {
        heading: "AWS Transfer Family",
        bullets: [
          { icon: "📡", text: "Managed **FTP / FTPS / SFTP** for transfers into/out of **Amazon S3 or EFS**." },
          { icon: "💳", text: "**Managed, scalable, HA (multi-AZ)**; pay **per provisioned endpoint-hour + data GB**." },
          { icon: "🔑", text: "Manage users in-service or integrate with **AD / LDAP / Okta / Cognito / custom**." },
        ],
      },
      {
        heading: "AWS DataSync",
        bullets: [
          { icon: "🔁", text: "Move/sync **large amounts of data**: on-prem/other cloud → AWS (**needs an agent**, NFS/SMB/HDFS/S3 API), or **AWS→AWS (no agent)**." },
          { icon: "🎯", text: "Targets: **S3 (any class incl. Glacier), EFS, FSx** (Windows/Lustre/NetApp/OpenZFS)." },
          { icon: "🗓️", text: "Scheduled **hourly/daily/weekly**; **preserves file permissions & metadata** (POSIX/SMB); up to **10 Gbps** per agent task (bandwidth limit configurable)." },
        ],
      },
      {
        heading: "Transfer Family vs DataSync",
        bullets: [
          { icon: "🧭", text: "**Transfer Family** = give external partners a **protocol endpoint (FTP/SFTP)** onto S3/EFS." },
          { icon: "🧭", text: "**DataSync** = **bulk migrate/replicate** file data on a schedule (great for one-time or ongoing sync)." },
        ],
      },
    ],
    keyFacts: [
      { label: "Transfer Family", value: "FTP/FTPS/SFTP → S3/EFS", icon: "📡" },
      { label: "DataSync on-prem", value: "Needs an agent", icon: "🔁" },
      { label: "DataSync targets", value: "S3, EFS, FSx", icon: "🎯" },
      { label: "Preserves", value: "Permissions & metadata", icon: "🗂️" },
    ],
    quickReference: {
      title: "Exam cues",
      icon: "🎯",
      bullets: [
        "'Partners upload via SFTP/FTPS to S3/EFS' → **AWS Transfer Family**.",
        "'Bulk-migrate NFS/SMB data to S3/EFS/FSx on a schedule' → **AWS DataSync**.",
        "DataSync **on-prem needs an agent**; **AWS→AWS needs none**.",
        "DataSync **preserves POSIX/SMB permissions & metadata**.",
        "Transfer Family is billed **per endpoint-hour + data**.",
      ],
      analogyBrief:
        "Transfer Family is a managed reception desk that speaks FTP/SFTP so partners can drop files into S3; DataSync is a moving company that hauls whole file systems to AWS on a set schedule.",
    },
    explanation:
      "AWS Transfer Family is a fully-managed service for transferring files into and out of Amazon S3 or Amazon EFS using standard file-transfer protocols: FTP, FTPS, and SFTP (AWS Transfer for FTP, for FTPS, and for SFTP). The infrastructure is managed, scalable, reliable, and highly available across multiple AZs, and you pay per provisioned endpoint per hour plus data transferred in GB. You can store and manage users' credentials within the service or integrate with existing authentication systems such as Microsoft Active Directory, LDAP, Okta, Amazon Cognito, or a custom identity provider — useful for sharing files, public datasets, or feeding CRM/ERP systems. AWS DataSync moves large amounts of data: from on-premises or another cloud into AWS (which requires a DataSync agent and supports NFS, SMB, HDFS, and the S3 API), or between AWS storage services (AWS-to-AWS, no agent needed). It can synchronize to Amazon S3 (any storage class, including Glacier), Amazon EFS, and Amazon FSx (Windows, Lustre, NetApp, OpenZFS). Replication tasks can be scheduled hourly, daily, or weekly; file permissions and metadata are preserved (NFS POSIX and SMB); and a single agent task can use up to 10 Gbps, with a configurable bandwidth limit. In short, use Transfer Family to give people a familiar FTP/SFTP endpoint onto AWS storage, and use DataSync to bulk-migrate or continuously replicate file data on a schedule.",
    analogy:
      "AWS Transfer Family is a managed reception desk that speaks the old languages of file transfer (FTP/SFTP): partners walk up, hand over their files, and the desk quietly files them into S3 or EFS. AWS DataSync is a professional moving company: you book it to haul entire file systems from your building to AWS — on a one-time job or a recurring weekly schedule — and it carefully preserves every label and permission on the boxes as it goes.",
    diagram: `<svg viewBox="0 0 720 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Transfer Family and DataSync">${svgDefs}
      <text x="20" y="24" fill="#ff9900" font-size="12" font-weight="700">Transfer Family (FTP/FTPS/SFTP)</text>
      ${box(20, 40, 90, 40, "Partner", "SFTP", "#8b949e")}
      ${box(150, 40, 130, 40, "Transfer Family", "endpoint", "#8b5cf6")}
      <line x1="110" y1="60" x2="148" y2="60" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(320, 40, 120, 40, "S3 / EFS", "", "#16a34a")}
      <line x1="280" y1="60" x2="318" y2="60" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="20" y="130" fill="#ff9900" font-size="12" font-weight="700">DataSync (bulk sync, scheduled)</text>
      ${box(20, 145, 130, 45, "On-prem NFS/SMB", "+ agent", "#8b949e")}
      ${box(190, 145, 120, 45, "DataSync", "preserves perms", "#3b82f6")}
      <line x1="150" y1="167" x2="188" y2="167" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(350, 145, 200, 45, "S3 / EFS / FSx", "any target", "#16a34a")}
      <line x1="310" y1="167" x2="348" y2="167" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
    </svg>`,
    diagramLegend: [
      { color: "#8b5cf6", label: "Transfer Family", description: "Managed FTP/FTPS/SFTP endpoint onto S3/EFS." },
      { color: "#3b82f6", label: "DataSync", description: "Scheduled bulk transfer preserving metadata." },
      { color: "#16a34a", label: "AWS storage", description: "S3, EFS, or FSx destinations." },
    ],
    codeExample: {
      language: "bash",
      title: "Start a DataSync task (on-prem NFS → S3)",
      code: `# (Agent + source/destination locations created beforehand)
aws datasync start-task-execution \\
  --task-arn arn:aws:datasync:us-east-1:123456789012:task/task-0abc123
# Preserves POSIX/SMB permissions & metadata; can be scheduled hourly/daily/weekly.`,
    },
    problemStatement:
      "External partners must upload nightly data files to your S3 bucket using SFTP with their existing corporate logins, while your ops team needs to migrate 30TB of on-prem NFS home directories to Amazon FSx and then keep them synced weekly, preserving all POSIX permissions. Which AWS service handles each need, and does the migration require anything installed on-prem?",
    questions: [
      {
        q: "Partners need to upload files to S3 using SFTP with their existing directory logins. Which service?",
        options: ["A. AWS DataSync", "B. AWS Transfer Family", "C. Storage Gateway", "D. Snowball"],
        answer: "B",
        explanation:
          "B is correct: AWS Transfer Family provides managed SFTP/FTPS/FTP endpoints onto S3/EFS and can integrate with AD/LDAP/Okta/Cognito for logins. DataSync is bulk sync; the others don't offer an SFTP endpoint.",
      },
      {
        q: "To migrate 30TB of on-prem NFS data to FSx and keep it synced weekly while preserving permissions, use:",
        options: ["A. AWS Transfer Family", "B. AWS DataSync", "C. CloudFront", "D. Global Accelerator"],
        answer: "B",
        explanation:
          "B is correct: DataSync bulk-migrates and schedules recurring syncs to S3/EFS/FSx, preserving POSIX/SMB permissions and metadata. Transfer Family is a protocol endpoint, not a bulk-sync/scheduler.",
      },
      {
        q: "For DataSync moving data FROM on-premises to AWS, what is required?",
        options: [
          "A. A DataSync agent on-premises",
          "B. Nothing extra",
          "C. A Snowball device",
          "D. A public S3 bucket",
        ],
        answer: "A",
        explanation:
          "A is correct: on-prem-to-AWS DataSync needs an agent (AWS-to-AWS needs none). Snowball is a separate physical-transfer service; the bucket needn't be public.",
      },
      {
        q: "Which are valid DataSync destinations?",
        options: [
          "A. S3, EFS, and FSx",
          "B. Only S3",
          "C. Only DynamoDB",
          "D. Only on-premises NAS",
        ],
        answer: "A",
        explanation:
          "A is correct: DataSync can sync to Amazon S3 (any class), EFS, and FSx (Windows/Lustre/NetApp/OpenZFS). It's not limited to S3 and doesn't target DynamoDB.",
      },
      {
        q: "How is AWS Transfer Family billed?",
        options: [
          "A. Free",
          "B. Per provisioned endpoint per hour, plus data transferred",
          "C. Per SFTP user only",
          "D. Per S3 bucket",
        ],
        answer: "B",
        explanation:
          "B is correct: you pay per provisioned endpoint-hour plus data transferred in GB. It's not free, nor billed purely per user or per bucket.",
      },
    ],
  },
];
