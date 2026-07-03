// ============================================================
// SECTION: Databases — RDS, Aurora & ElastiCache
// Course slides ~p161–193.
// ============================================================
import { svgDefs, type Topic } from "./shared";

const box = (
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  sub: string,
  color = "#3b82f6",
) => `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#243349" stroke="${color}"/>
  <text x="${x + w / 2}" y="${y + h / 2 - 2}" text-anchor="middle" fill="#e6edf3" font-size="12" font-weight="600">${title}</text>
  <text x="${x + w / 2}" y="${y + h / 2 + 15}" text-anchor="middle" fill="#8b949e" font-size="10">${sub}</text>
`;

export const databaseTopics: Topic[] = [
  // -----------------------------------------------------------------
  {
    id: "rds-overview",
    title: "Amazon RDS — Overview & Storage Auto Scaling",
    shortLabel: "Amazon RDS",
    section: "Databases — RDS, Aurora & ElastiCache",
    domain: "Database",
    tldr:
      "RDS is a managed relational (SQL) database service supporting Postgres, MySQL, MariaDB, Oracle, SQL Server, IBM DB2, and Aurora. AWS handles provisioning, patching, backups, monitoring, read replicas, and Multi-AZ — but you cannot SSH into the host. Storage can auto-scale when it runs low.",
    subtopics: [
      {
        heading: "What RDS is",
        bullets: [
          { icon: "🗄️", text: "**Managed** SQL databases: **Postgres, MySQL, MariaDB, Oracle, SQL Server, IBM DB2, Aurora**." },
          { icon: "🤖", text: "AWS automates **provisioning & OS patching**, **continuous backups** with **point-in-time restore**, monitoring dashboards, and maintenance windows." },
          { icon: "📈", text: "**Read replicas** (read scaling) and **Multi-AZ** (DR); scales vertically & horizontally; storage backed by **EBS**." },
          { icon: "🚫", text: "You **cannot SSH** into the underlying instance (except **RDS Custom**)." },
        ],
      },
      {
        heading: "RDS vs DB on EC2",
        bullets: [
          { icon: "✅", text: "RDS removes the operational burden (patching, backups, HA) that self-managing on EC2 requires." },
          { icon: "⚖️", text: "Trade-off: less low-level control, and no shell access to the OS." },
        ],
      },
      {
        heading: "RDS Storage Auto Scaling",
        bullets: [
          { icon: "📦", text: "Automatically grows storage when you run low — you set a **Maximum Storage Threshold**." },
          { icon: "🔧", text: "Triggers when **free < 10%** of allocated, **low-storage lasts ≥ 5 min**, and **≥ 6 h** since last modification." },
          { icon: "🌊", text: "Great for **unpredictable workloads**; supports **all** RDS engines." },
        ],
      },
    ],
    keyFacts: [
      { label: "Engines", value: "PG, MySQL, MariaDB, Oracle, SQL Server, DB2, Aurora", icon: "🗄️" },
      { label: "Backups", value: "Continuous + point-in-time restore", icon: "⏱️" },
      { label: "SSH access", value: "No (except RDS Custom)", icon: "🚫" },
      { label: "Auto-scale trigger", value: "Free < 10% for 5 min", icon: "📦" },
    ],
    quickReference: {
      title: "Exam cues",
      icon: "🎯",
      bullets: [
        "'Managed SQL DB, no ops' → **RDS**.",
        "Need **OS/root access** to the DB host → **RDS Custom** (Oracle/SQL Server only).",
        "Storage runs out unpredictably → enable **Storage Auto Scaling** + set max threshold.",
        "Storage is on **EBS**; you still can't SSH.",
      ],
      analogyBrief:
        "RDS is renting a fully-serviced apartment: furniture, plumbing, and repairs are handled — you just live (query) in it, but you can't rewire the walls.",
    },
    explanation:
      "Amazon RDS is a managed relational database service for engines that use SQL: PostgreSQL, MySQL, MariaDB, Oracle, Microsoft SQL Server, IBM DB2, and AWS's own Aurora. As a managed service it automates provisioning and OS patching, takes continuous backups that enable point-in-time restore, provides monitoring dashboards and maintenance windows, supports read replicas for read scaling and Multi-AZ for disaster recovery, scales vertically and horizontally, and stores data on EBS. The trade-off versus running a database yourself on EC2 is that you cannot SSH into the instance (except with RDS Custom). RDS Storage Auto Scaling grows storage automatically when the database runs low: you set a maximum storage threshold, and RDS increases storage when free space drops below 10% of allocated, the low-storage condition lasts at least five minutes, and at least six hours have elapsed since the last modification — useful for applications with unpredictable growth, across all RDS engines.",
    analogy:
      "Running your own database on EC2 is like owning a car: you handle oil changes, tires, and breakdowns. RDS is like a chauffeured, fully-serviced car service: you decide where to go (your queries and schema), and AWS keeps the engine tuned and fueled — you just can't pop the hood.",
    diagram: `<svg viewBox="0 0 720 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="RDS overview">${svgDefs}
      ${box(40, 100, 130, 55, "Application", "read / write", "#8b949e")}
      <line x1="170" y1="127" x2="240" y2="127" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(245, 95, 150, 65, "Amazon RDS", "managed engine", "#2563eb")}
      <line x1="320" y1="160" x2="320" y2="205" stroke="#8b949e" stroke-width="2" marker-end="url(#arrow-mute)"/>
      ${box(245, 205, 150, 40, "EBS storage", "auto-scaling", "#22c55e")}
      ${box(460, 40, 220, 40, "OS patching / backups", "AWS-managed", "#6b46c1")}
      ${box(460, 95, 220, 40, "Monitoring / maintenance", "AWS-managed", "#6b46c1")}
      ${box(460, 150, 220, 40, "Read replicas / Multi-AZ", "scale + HA", "#6b46c1")}
    </svg>`,
    diagramLegend: [
      { color: "#2563eb", label: "RDS instance", description: "Managed DB engine; no SSH access." },
      { color: "#22c55e", label: "EBS storage", description: "Backing storage that can auto-scale." },
      { color: "#6b46c1", label: "AWS-managed ops", description: "Patching, backups, monitoring, HA." },
    ],
    codeExample: {
      language: "bash",
      title: "Create a MySQL RDS instance with storage auto scaling",
      code: `aws rds create-db-instance \\
  --db-instance-identifier prod-mysql \\
  --engine mysql \\
  --db-instance-class db.t3.medium \\
  --allocated-storage 20 \\
  --max-allocated-storage 200 \\
  --master-username admin \\
  --manage-master-user-password \\
  --backup-retention-period 7`,
    },
    problemStatement:
      "A team self-manages MySQL on an EC2 instance and keeps getting paged for full disks, missed patches, and failed nightly backups. They want to keep MySQL and their app code but offload operations, get point-in-time recovery, and never run out of disk unexpectedly. What service do you recommend, and which two features address the disk and backup pain?",
    questions: [
      {
        q: "Which is a TRUE limitation of Amazon RDS compared with running a database on EC2?",
        options: [
          "A. RDS cannot take backups",
          "B. You cannot SSH into the underlying instance (except RDS Custom)",
          "C. RDS does not support MySQL",
          "D. RDS storage cannot grow",
        ],
        answer: "B",
        explanation:
          "B is correct: RDS is managed, so no OS shell access — except RDS Custom (Oracle/SQL Server). A is false (continuous backups). C is false (MySQL is supported). D is false (Storage Auto Scaling).",
      },
      {
        q: "RDS Storage Auto Scaling increases storage when which conditions are met?",
        options: [
          "A. CPU > 80% for 5 minutes",
          "B. Free storage < 10% of allocated, sustained ≥ 5 minutes, and ≥ 6 hours since last change",
          "C. Any time a write occurs",
          "D. Only during the maintenance window",
        ],
        answer: "B",
        explanation:
          "B is correct: those three conditions (free < 10%, ≥ 5 min, ≥ 6 h since last modification) trigger the automatic increase up to your maximum threshold. The others are unrelated triggers.",
      },
      {
        q: "A workload needs a managed SQL database but ALSO requires OS-level access to install a custom Oracle patch. Which option fits?",
        options: ["A. Standard RDS for Oracle", "B. RDS Custom", "C. DynamoDB", "D. ElastiCache"],
        answer: "B",
        explanation:
          "B is correct: RDS Custom (Oracle/SQL Server) gives access to the underlying OS/DB for customization while remaining largely managed. Standard RDS blocks SSH. DynamoDB is NoSQL; ElastiCache is a cache.",
      },
      {
        q: "Where does standard RDS store its data?",
        options: ["A. Instance store", "B. Amazon EBS", "C. Amazon S3 directly", "D. EFS"],
        answer: "B",
        explanation:
          "B is correct: RDS storage is backed by EBS volumes. Instance store is ephemeral, S3 is object storage (used for backups/imports, not live block storage), and EFS is a file system.",
      },
      {
        q: "Which RDS capability provides recovery to a specific timestamp after accidental data corruption?",
        options: [
          "A. Multi-AZ standby",
          "B. Read replicas",
          "C. Continuous backups with point-in-time restore",
          "D. Storage auto scaling",
        ],
        answer: "C",
        explanation:
          "C is correct: continuous backups (daily snapshot + transaction logs) enable point-in-time restore. Multi-AZ is HA/DR, not point-in-time. Read replicas scale reads. Auto scaling handles disk size.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "rds-read-replicas",
    title: "RDS Read Replicas — Read Scaling",
    shortLabel: "RDS Read Replicas",
    section: "Databases — RDS, Aurora & ElastiCache",
    domain: "Database",
    tldr:
      "Read replicas scale reads: up to 15 async-replicated copies within an AZ, across AZs, or across Regions. Reads are eventually consistent; replicas serve SELECTs only. Same-Region replica traffic is free, but cross-Region replication incurs network cost.",
    subtopics: [
      {
        heading: "How read replicas work",
        bullets: [
          { icon: "📚", text: "Up to **15** read replicas; within-AZ, cross-AZ, or cross-Region." },
          { icon: "🔁", text: "**ASYNC** replication → reads are **eventually consistent**." },
          { icon: "⬆️", text: "A replica can be **promoted** to its own standalone database." },
          { icon: "🔌", text: "Apps must **update the connection string** to use replicas (SELECT-only)." },
        ],
      },
      {
        heading: "Use case",
        bullets: [
          { icon: "📊", text: "Offload heavy **reporting/analytics** reads to a replica so the **production DB is unaffected**." },
          { icon: "🔎", text: "Read replicas serve **SELECT** only — not INSERT/UPDATE/DELETE." },
        ],
      },
      {
        heading: "Network cost",
        bullets: [
          { icon: "🆓", text: "Replication **within the same Region** (even cross-AZ) is **free**." },
          { icon: "💸", text: "**Cross-Region** replication crosses Regions → you **pay** for the data transfer." },
        ],
      },
    ],
    keyFacts: [
      { label: "Max replicas", value: "15", icon: "📚" },
      { label: "Replication", value: "Asynchronous (eventual)", icon: "🔁" },
      { label: "Same-Region cost", value: "Free", icon: "🆓" },
      { label: "Cross-Region cost", value: "Paid data transfer", icon: "💸" },
    ],
    quickReference: {
      title: "Exam cues",
      icon: "🎯",
      bullets: [
        "'Reporting queries slow the production DB' → add a **read replica**.",
        "Read replicas = **reads only**, **eventually consistent** (async).",
        "**Same-Region** replica traffic is **free**; **cross-Region** is charged.",
        "Multi-AZ ≠ read replica — Multi-AZ is for failover, not read scaling.",
      ],
      analogyBrief:
        "Read replicas are photocopies of a master ledger you hand to analysts — they can read freely without slowing the clerk still writing the original.",
    },
    explanation:
      "RDS read replicas scale read-heavy workloads. You can create up to 15 replicas, placed within the same AZ, across AZs, or across Regions. Replication is asynchronous, so replica reads are eventually consistent. Any replica can be promoted to its own independent database. Applications must point read queries at the replica endpoint (via a separate connection string) and can only run read (SELECT) statements there — not INSERT, UPDATE, or DELETE. A classic use case is running analytics or reporting against a replica so the production database keeps serving normal load unaffected. On cost, replication within the same Region (including cross-AZ) is free, but cross-Region replication crosses Regions and incurs network transfer charges.",
    analogy:
      "Imagine a busy clerk writing in the master ledger all day. Instead of interrupting them, you make photocopies (read replicas) and hand them to analysts. The analysts can read the copies as much as they like without slowing the clerk — though a copy might be a few seconds behind the original (eventual consistency).",
    diagram: `<svg viewBox="0 0 720 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="RDS read replicas">${svgDefs}
      ${box(280, 30, 150, 50, "Application", "writes + reads", "#8b949e")}
      ${box(290, 130, 130, 60, "RDS Master", "writes", "#2563eb")}
      <line x1="345" y1="80" x2="345" y2="128" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(60, 130, 130, 60, "Read Replica", "reads", "#22c55e")}
      ${box(520, 130, 130, 60, "Read Replica", "reads", "#22c55e")}
      <line x1="290" y1="160" x2="192" y2="160" stroke="#8b949e" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#arrow-mute)"/>
      <text x="200" y="150" fill="#8b949e" font-size="10">ASYNC</text>
      <line x1="420" y1="160" x2="518" y2="160" stroke="#8b949e" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#arrow-mute)"/>
      <text x="440" y="150" fill="#8b949e" font-size="10">ASYNC</text>
      <line x1="120" y1="80" x2="120" y2="128" stroke="#22c55e" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="130" y="105" fill="#8b949e" font-size="10">reads</text>
      <line x1="585" y1="80" x2="585" y2="128" stroke="#22c55e" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="595" y="105" fill="#8b949e" font-size="10">reads</text>
    </svg>`,
    diagramLegend: [
      { color: "#2563eb", label: "Master (writer)", description: "Handles writes and can serve reads." },
      { color: "#22c55e", label: "Read replica", description: "Async copy; serves SELECT reads only." },
    ],
    codeExample: {
      language: "bash",
      title: "Create a read replica (same Region — free replication)",
      code: `aws rds create-db-instance-read-replica \\
  --db-instance-identifier prod-mysql-replica-1 \\
  --source-db-instance-identifier prod-mysql \\
  --db-instance-class db.t3.medium
# Point your reporting app at the replica endpoint; SELECT-only.`,
    },
    problemStatement:
      "Your production RDS database is fine for the app, but a new analytics team runs heavy reporting queries that spike CPU and slow customer transactions. They only read data and can tolerate results that are a few seconds stale. How do you isolate their workload without buying a bigger primary, and what's the cost implication if their team is in another Region?",
    questions: [
      {
        q: "Reporting queries are slowing the production RDS database. The reports are read-only and can tolerate slightly stale data. Best solution?",
        options: [
          "A. Enable Multi-AZ",
          "B. Create a read replica and point reporting at it",
          "C. Scale the primary to a larger instance only",
          "D. Switch to DynamoDB",
        ],
        answer: "B",
        explanation:
          "B is correct: a read replica offloads read-only reporting so production is unaffected, and eventual consistency is acceptable here. Multi-AZ is for failover, not read scaling. Scaling up helps but doesn't isolate the workload. DynamoDB is a different data model entirely.",
      },
      {
        q: "What consistency do RDS read replicas provide?",
        options: [
          "A. Strong consistency (synchronous)",
          "B. Eventual consistency (asynchronous replication)",
          "C. No consistency guarantees",
          "D. Read-after-write on all replicas",
        ],
        answer: "B",
        explanation:
          "B is correct: replicas use asynchronous replication, so reads are eventually consistent (may lag the master slightly). A describes Multi-AZ's sync standby, not replicas.",
      },
      {
        q: "You create a read replica in a DIFFERENT Region from the primary. What is the cost implication?",
        options: [
          "A. Free, like same-Region replicas",
          "B. You pay for cross-Region data transfer",
          "C. Replicas are always free everywhere",
          "D. You must pay per SELECT query",
        ],
        answer: "B",
        explanation:
          "B is correct: cross-Region replication incurs network transfer charges, whereas same-Region (including cross-AZ) replication is free.",
      },
      {
        q: "Which statement about RDS read replicas is TRUE?",
        options: [
          "A. You can run INSERT/UPDATE on a replica",
          "B. A replica can be promoted to a standalone database",
          "C. You can have unlimited replicas",
          "D. Applications automatically write to replicas with no config",
        ],
        answer: "B",
        explanation:
          "B is correct: a read replica can be promoted to its own independent DB. A is false (reads only). C is false (max 15). D is false (apps must use the replica's connection string).",
      },
      {
        q: "How many read replicas can a single RDS database have?",
        options: ["A. Up to 5", "B. Up to 15", "C. Unlimited", "D. Exactly 1"],
        answer: "B",
        explanation:
          "B is correct: RDS supports up to 15 read replicas per database (Aurora also supports up to 15 Aurora Replicas).",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "rds-multi-az-custom",
    title: "RDS Multi-AZ & RDS Custom",
    shortLabel: "RDS Multi-AZ & Custom",
    section: "Databases — RDS, Aurora & ElastiCache",
    domain: "Database",
    tldr:
      "Multi-AZ keeps a synchronous standby in another AZ behind one DNS name for automatic failover — it increases availability, not read capacity. Converting single-AZ to Multi-AZ is zero-downtime. RDS Custom (Oracle/SQL Server) grants OS/DB access for customization.",
    subtopics: [
      {
        heading: "RDS Multi-AZ (Disaster Recovery)",
        bullets: [
          { icon: "🔗", text: "**SYNC** replication to a standby in another AZ; **one DNS name** with **automatic failover**." },
          { icon: "🛡️", text: "Survives **AZ loss, network, instance, or storage** failure — **no app changes**." },
          { icon: "🚫", text: "**Not** for scaling — the standby serves no reads (read replicas can also be Multi-AZ)." },
        ],
      },
      {
        heading: "Single-AZ → Multi-AZ",
        bullets: [
          { icon: "⚡", text: "**Zero-downtime** — just click 'modify'." },
          { icon: "🧩", text: "Internally: a **snapshot** is taken, a new DB is restored in another AZ, then **synchronized**." },
        ],
      },
      {
        heading: "RDS Custom",
        bullets: [
          { icon: "🔧", text: "Managed **Oracle / Microsoft SQL Server** with **OS & database customization**." },
          { icon: "🖥️", text: "Access the underlying **EC2 instance via SSH / SSM**; configure settings, install patches, enable native features." },
          { icon: "⏸️", text: "**De-activate Automation Mode** for changes (snapshot first); standard RDS keeps everything AWS-managed." },
        ],
      },
    ],
    keyFacts: [
      { label: "Multi-AZ replication", value: "Synchronous", icon: "🔗" },
      { label: "Multi-AZ purpose", value: "Availability / DR (not reads)", icon: "🛡️" },
      { label: "Single→Multi-AZ", value: "Zero downtime", icon: "⚡" },
      { label: "RDS Custom engines", value: "Oracle, SQL Server", icon: "🔧" },
    ],
    quickReference: {
      title: "Read replica vs Multi-AZ",
      icon: "🎯",
      bullets: [
        "**Read replica** = scale reads (async, eventual, separate endpoint).",
        "**Multi-AZ** = availability/failover (sync standby, one DNS, no reads).",
        "'Survive an AZ failure automatically' → **Multi-AZ**.",
        "'Need SSH/root on the DB host' → **RDS Custom** (Oracle/SQL Server).",
        "Enabling Multi-AZ is a **zero-downtime** modify.",
      ],
      analogyBrief:
        "Multi-AZ is a stunt double standing by on set — invisible until the star gets hurt, then instantly steps in. RDS Custom is being handed the keys to the trailer.",
    },
    explanation:
      "RDS Multi-AZ provides high availability and disaster recovery by keeping a synchronous standby replica in a different Availability Zone. Both are reached through one DNS name, and RDS fails over to the standby automatically if the primary loses its AZ, network, instance, or storage — with no changes needed in your application. Multi-AZ is not a scaling feature: the standby serves no read traffic (though read replicas themselves can be configured as Multi-AZ for their own DR). Converting a single-AZ database to Multi-AZ is a zero-downtime operation — you click 'modify' and RDS internally snapshots the database, restores it in a new AZ, and synchronizes the two. RDS Custom is a separate offering for Oracle and Microsoft SQL Server that gives you access to the underlying operating system and database (via SSH or SSM Session Manager) so you can change settings, install patches, and enable native features; you de-activate automation mode to make customizations (taking a snapshot first is recommended). With standard RDS the entire OS and database are AWS-managed; with RDS Custom you get full admin access.",
    analogy:
      "Multi-AZ is a stunt double who shadows the lead actor on set: you never see them until the star twists an ankle, and then they seamlessly take over so filming never stops. RDS Custom is different — it's being handed the keys to the actor's trailer so you can rearrange the furniture yourself.",
    diagram: `<svg viewBox="0 0 720 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="RDS Multi-AZ">${svgDefs}
      ${box(280, 25, 150, 50, "Application", "writes + reads", "#8b949e")}
      ${box(280, 120, 150, 50, "One DNS name", "auto failover", "#6b46c1")}
      <line x1="355" y1="75" x2="355" y2="118" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(90, 190, 150, 50, "Standby (AZ B)", "no reads", "#94a3b8")}
      ${box(470, 190, 150, 50, "Master (AZ A)", "writes", "#2563eb")}
      <line x1="470" y1="215" x2="242" y2="215" stroke="#22c55e" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="320" y="208" fill="#22c55e" font-size="10">SYNC replication</text>
      <line x1="330" y1="170" x2="200" y2="188" stroke="#8b949e" stroke-width="1" stroke-dasharray="3 3"/>
      <line x1="380" y1="170" x2="540" y2="188" stroke="#8b949e" stroke-width="1" stroke-dasharray="3 3"/>
    </svg>`,
    diagramLegend: [
      { color: "#2563eb", label: "Master (AZ A)", description: "Active primary handling all traffic." },
      { color: "#94a3b8", label: "Standby (AZ B)", description: "Synchronous copy; idle until failover." },
      { color: "#6b46c1", label: "Single DNS endpoint", description: "App unaware of which instance is active." },
    ],
    codeExample: {
      language: "bash",
      title: "Convert an existing single-AZ RDS DB to Multi-AZ (zero downtime)",
      code: `aws rds modify-db-instance \\
  --db-instance-identifier prod-mysql \\
  --multi-az \\
  --apply-immediately
# Internally: snapshot -> restore in new AZ -> synchronize. No app changes needed.`,
    },
    problemStatement:
      "A payments database must survive the complete loss of an Availability Zone with automatic failover and no code changes, and the compliance team also asks whether a separate Oracle database can have OS-level agents installed for their monitoring tool. Which RDS feature delivers the failover requirement, and which offering allows the OS access — and is enabling failover disruptive?",
    questions: [
      {
        q: "Which RDS feature provides automatic failover to another AZ with a synchronous standby and no application changes?",
        options: [
          "A. Read replicas",
          "B. Multi-AZ deployment",
          "C. Storage auto scaling",
          "D. RDS Custom",
        ],
        answer: "B",
        explanation:
          "B is correct: Multi-AZ keeps a synchronous standby and fails over automatically behind one DNS name. Read replicas are async and for reads. Auto scaling is about disk. RDS Custom is about OS access.",
      },
      {
        q: "True or false: an RDS Multi-AZ standby can also serve read traffic to scale reads.",
        options: [
          "A. True — it doubles read capacity",
          "B. False — the standby serves no reads; use read replicas for that",
          "C. True — but only for reporting",
          "D. False — because Multi-AZ is asynchronous",
        ],
        answer: "B",
        explanation:
          "B is correct: the Multi-AZ standby is for failover only and serves no reads; read replicas scale reads. D is wrong because Multi-AZ is synchronous, not async.",
      },
      {
        q: "Converting a single-AZ RDS database to Multi-AZ requires:",
        options: [
          "A. Recreating the database from scratch",
          "B. A zero-downtime 'modify' operation",
          "C. A multi-hour maintenance outage",
          "D. Exporting to S3 and reimporting",
        ],
        answer: "B",
        explanation:
          "B is correct: it's a zero-downtime modify — RDS snapshots, restores in a new AZ, and synchronizes behind the scenes. No recreation or outage is required.",
      },
      {
        q: "A team needs SSH/root access to the host of a managed Oracle database to install patches and native features. Which is appropriate?",
        options: ["A. Standard RDS", "B. RDS Custom", "C. Aurora Serverless", "D. DynamoDB"],
        answer: "B",
        explanation:
          "B is correct: RDS Custom (Oracle/SQL Server) grants OS/DB access via SSH/SSM. Standard RDS blocks SSH; Aurora Serverless and DynamoDB don't offer host access.",
      },
      {
        q: "Which replication mode does RDS Multi-AZ use between primary and standby?",
        options: ["A. Asynchronous", "B. Synchronous", "C. No replication", "D. Snapshot-only nightly"],
        answer: "B",
        explanation:
          "B is correct: Multi-AZ uses synchronous replication so the standby is always up to date for failover. Read replicas are the asynchronous ones.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "amazon-aurora",
    title: "Amazon Aurora — Architecture & HA",
    shortLabel: "Amazon Aurora",
    section: "Databases — RDS, Aurora & ElastiCache",
    domain: "Database",
    tldr:
      "Aurora is AWS's cloud-optimized, MySQL/PostgreSQL-compatible database. It stores 6 copies of data across 3 AZs (self-healing, auto-growing 10GB→128TB), does near-instant failover, supports up to 15 read replicas, and exposes a Writer Endpoint (master) and a load-balanced Reader Endpoint.",
    subtopics: [
      {
        heading: "What Aurora is",
        bullets: [
          { icon: "🚀", text: "AWS-proprietary, **MySQL & PostgreSQL compatible** (your drivers just work)." },
          { icon: "⚡", text: "Claims **~5× MySQL** / **~3× PostgreSQL** performance; costs ~20% more than RDS but more efficient." },
          { icon: "📈", text: "Storage **auto-grows** in 10GB increments up to **128 TB**." },
        ],
      },
      {
        heading: "High availability & read scaling",
        bullets: [
          { icon: "🗂️", text: "**6 copies across 3 AZs**: 4/6 needed for writes, 3/6 for reads; **self-healing**, striped across 100s of volumes." },
          { icon: "⏱️", text: "**Automated failover** in **< 30s**; HA is native." },
          { icon: "📚", text: "One writer (master) + up to **15 Aurora Replicas** serve reads; **cross-Region** replication supported." },
        ],
      },
      {
        heading: "Cluster endpoints",
        bullets: [
          { icon: "✍️", text: "**Writer Endpoint** → always points to the current master (survives failover)." },
          { icon: "📖", text: "**Reader Endpoint** → connection-load-balances across read replicas." },
        ],
      },
    ],
    keyFacts: [
      { label: "Copies / AZs", value: "6 copies across 3 AZs", icon: "🗂️" },
      { label: "Failover", value: "< 30 seconds", icon: "⏱️" },
      { label: "Max storage", value: "Auto-grows to 128 TB", icon: "📈" },
      { label: "Endpoints", value: "Writer + Reader", icon: "🔀" },
    ],
    quickReference: {
      title: "Exam cues",
      icon: "🎯",
      bullets: [
        "'MySQL/PostgreSQL-compatible, cloud-optimized, HA-native' → **Aurora**.",
        "Point writes at the **Writer Endpoint**, reads at the **Reader Endpoint**.",
        "Storage is **6 copies / 3 AZs**, self-healing, auto-growing to 128 TB.",
        "Failover is **fast (<30s)** because storage is shared.",
        "Costs ~20% more than RDS but is more efficient/performant.",
      ],
      analogyBrief:
        "Aurora's storage is a shared vault mirrored in 3 bank branches; if a teller (writer) faints, another instantly takes over the same vault — no re-copying needed.",
    },
    explanation:
      "Amazon Aurora is AWS's proprietary, cloud-optimized relational database that is compatible with both MySQL and PostgreSQL, so existing drivers work unchanged. AWS claims roughly 5× the performance of MySQL on RDS and 3× of PostgreSQL, at about 20% higher cost but with greater efficiency. Its storage layer automatically grows in 10GB increments up to 128TB and keeps 6 copies of your data across 3 Availability Zones — 4 of 6 copies are needed for writes and 3 of 6 for reads — with self-healing, peer-to-peer replication and striping across hundreds of volumes. One Aurora instance is the writer (master); failover to a replica is automated and typically completes in under 30 seconds because the storage is shared, so HA is native. A cluster can have up to 15 Aurora Replicas serving reads and supports cross-Region replication. Applications connect through two managed endpoints: the Writer Endpoint always points at the current master (so it survives failover), and the Reader Endpoint connection-load-balances across the read replicas.",
    analogy:
      "Aurora's storage is like a single shared vault whose contents are mirrored across three bank branches. The teller at the front desk (the writer) records transactions, and analysts (readers) can view balances at any branch. If the teller faints, another employee instantly steps up to the same vault — no time is lost re-copying the ledgers, which is why failover is so fast.",
    diagram: `<svg viewBox="0 0 720 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Aurora cluster">${svgDefs}
      ${box(30, 30, 150, 45, "Writer Endpoint", "→ master", "#22c55e")}
      ${box(250, 30, 200, 45, "Reader Endpoint", "load-balanced reads", "#f59e0b")}
      ${box(60, 100, 90, 45, "Aurora W", "master", "#2563eb")}
      ${box(230, 100, 80, 45, "Replica", "", "#22c55e")}
      ${box(320, 100, 80, 45, "Replica", "", "#22c55e")}
      ${box(410, 100, 80, 45, "Replica", "", "#22c55e")}
      <line x1="105" y1="75" x2="105" y2="98" stroke="#22c55e" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="350" y1="75" x2="270" y2="98" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="350" y1="75" x2="360" y2="98" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="350" y1="75" x2="450" y2="98" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrow)"/>
      <rect x="40" y="180" width="640" height="55" rx="10" fill="#1a2332" stroke="#6b46c1"/>
      <text x="360" y="203" text-anchor="middle" fill="#e6edf3" font-size="12" font-weight="700">Shared storage — 6 copies across 3 AZs</text>
      <text x="360" y="222" text-anchor="middle" fill="#8b949e" font-size="10">self-healing · auto-expanding 10GB → 128TB</text>
    </svg>`,
    diagramLegend: [
      { color: "#2563eb", label: "Writer", description: "The single master; targeted by the Writer Endpoint." },
      { color: "#22c55e", label: "Aurora Replicas", description: "Up to 15; reads served via the Reader Endpoint." },
      { color: "#6b46c1", label: "Shared storage", description: "6 copies / 3 AZs, self-healing, auto-growing." },
    ],
    codeExample: {
      language: "bash",
      title: "Create an Aurora (MySQL) cluster + a writer instance",
      code: `aws rds create-db-cluster \\
  --db-cluster-identifier my-aurora \\
  --engine aurora-mysql \\
  --master-username admin --manage-master-user-password

aws rds create-db-instance \\
  --db-instance-identifier my-aurora-writer \\
  --db-cluster-identifier my-aurora \\
  --engine aurora-mysql --db-instance-class db.r6g.large`,
    },
    problemStatement:
      "A high-traffic SaaS on RDS MySQL needs faster failover (currently ~2 minutes), the ability to add read capacity quickly during peaks, and storage that grows without manual intervention — all while keeping the MySQL wire protocol so the app doesn't change. Which service fits, and which two endpoints do you configure the app to use for writes vs reads?",
    questions: [
      {
        q: "How does Aurora store your data for durability and availability?",
        options: [
          "A. 2 copies in 1 AZ",
          "B. 6 copies across 3 Availability Zones",
          "C. 1 copy with nightly S3 backup",
          "D. 3 copies in 3 Regions",
        ],
        answer: "B",
        explanation:
          "B is correct: Aurora keeps 6 copies of data across 3 AZs (4/6 for writes, 3/6 for reads), self-healing and striped. The others misstate the design.",
      },
      {
        q: "An application should send its read queries to which Aurora endpoint for automatic load balancing across replicas?",
        options: ["A. Writer Endpoint", "B. Reader Endpoint", "C. Custom Endpoint always", "D. Instance Endpoint"],
        answer: "B",
        explanation:
          "B is correct: the Reader Endpoint connection-load-balances across the read replicas. The Writer Endpoint targets the master for writes. Custom/instance endpoints target specific subsets/instances.",
      },
      {
        q: "Why is Aurora failover typically faster (< 30s) than classic RDS Multi-AZ?",
        options: [
          "A. It skips replication entirely",
          "B. Storage is shared, so a replica simply becomes the writer without copying data",
          "C. It uses synchronous cross-Region writes",
          "D. It runs on instance store",
        ],
        answer: "B",
        explanation:
          "B is correct: because compute and the shared 6-copy storage volume are decoupled, promoting a replica to writer is near-instant. A/C/D are inaccurate.",
      },
      {
        q: "Which compatibility does Amazon Aurora offer?",
        options: [
          "A. MySQL and PostgreSQL",
          "B. Oracle and SQL Server",
          "C. MongoDB and Cassandra",
          "D. Redis and Memcached",
        ],
        answer: "A",
        explanation:
          "A is correct: Aurora is compatible with MySQL and PostgreSQL, so existing drivers work. Oracle/SQL Server are separate RDS engines; the others are NoSQL/caches.",
      },
      {
        q: "Aurora storage capacity is best described as:",
        options: [
          "A. Fixed at creation and unchangeable",
          "B. Auto-growing in 10GB increments up to 128 TB",
          "C. Limited to 1 TB",
          "D. Managed manually via EBS resizes",
        ],
        answer: "B",
        explanation:
          "B is correct: Aurora storage auto-grows in 10GB increments up to 128TB with no manual intervention. The others are false.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "aurora-advanced",
    title: "Aurora Advanced — Serverless, Global, Endpoints, ML, Babelfish",
    shortLabel: "Aurora Advanced",
    section: "Databases — RDS, Aurora & ElastiCache",
    domain: "Database",
    tldr:
      "Aurora adds replica auto-scaling, custom endpoints (subset of instances), Serverless (auto-instantiate & scale, pay-per-second for intermittent loads), Global Database (1 primary + up to 5 secondary Regions, <1s replication, <1min RTO), Aurora ML (SageMaker/Comprehend via SQL), and Babelfish (run SQL Server apps on Aurora PostgreSQL).",
    subtopics: [
      {
        heading: "Replica Auto Scaling & Custom Endpoints",
        bullets: [
          { icon: "📈", text: "**Replica Auto Scaling** adds/removes Aurora Replicas as read load changes." },
          { icon: "🎯", text: "**Custom Endpoints** target a **subset** of instances (e.g. run analytics on the bigger replicas). The Reader Endpoint is generally unused once custom endpoints exist." },
        ],
      },
      {
        heading: "Aurora Serverless",
        bullets: [
          { icon: "⚙️", text: "**Automated instantiation & auto-scaling** based on actual usage — no capacity planning." },
          { icon: "💰", text: "**Pay-per-second**; ideal for **infrequent, intermittent, or unpredictable** workloads." },
        ],
      },
      {
        heading: "Global Database (recommended for global)",
        bullets: [
          { icon: "🌍", text: "**1 primary Region** (read/write) + up to **5 secondary read-only Regions**; up to **16 replicas** per secondary." },
          { icon: "⏱️", text: "Replication lag typically **< 1 second**; promoting a Region for DR has an **RTO < 1 minute**." },
        ],
      },
      {
        heading: "Aurora ML & Babelfish",
        bullets: [
          { icon: "🤖", text: "**Aurora ML** — call **SageMaker** (any model) and **Comprehend** (sentiment) from **SQL**; use cases: fraud detection, recommendations." },
          { icon: "🐟", text: "**Babelfish** lets **Aurora PostgreSQL** understand **MS SQL Server T-SQL**, so SQL Server apps run with little/no code change (migrate via SCT + DMS)." },
        ],
      },
    ],
    keyFacts: [
      { label: "Serverless billing", value: "Pay-per-second", icon: "💰" },
      { label: "Global secondary Regions", value: "Up to 5", icon: "🌍" },
      { label: "Global RTO", value: "< 1 minute", icon: "⏱️" },
      { label: "Babelfish", value: "T-SQL on Aurora PostgreSQL", icon: "🐟" },
    ],
    quickReference: {
      title: "Exam cues",
      icon: "🎯",
      bullets: [
        "'Intermittent/unpredictable, no capacity planning' → **Aurora Serverless**.",
        "'Global reads + fast cross-Region DR' → **Aurora Global Database**.",
        "'Run analytics on specific replicas' → **Custom Endpoints**.",
        "'ML predictions from SQL' → **Aurora ML** (SageMaker/Comprehend).",
        "'Move SQL Server app to Aurora with minimal code change' → **Babelfish**.",
      ],
      analogyBrief:
        "Serverless = a taxi meter (pay only while riding); Global Database = branch offices worldwide reading from HQ within a second.",
    },
    explanation:
      "Beyond the core engine, Aurora offers several advanced capabilities. Replica Auto Scaling automatically adds or removes Aurora Replicas as read load changes. Custom Endpoints let you target a subset of instances — for example, running analytical queries only on your larger replicas; once you define custom endpoints, the default Reader Endpoint is generally no longer used. Aurora Serverless automatically instantiates and scales the database based on actual usage with no capacity planning, billing per second, which is ideal for infrequent, intermittent, or unpredictable workloads. Aurora Global Database is the recommended approach for global apps: one primary Region handles read/write while up to five secondary read-only Regions replicate with typically sub-second lag, each supporting up to 16 read replicas; promoting a secondary Region for disaster recovery has a recovery time objective under one minute. Aurora Machine Learning lets you add predictions to applications directly from SQL by integrating with Amazon SageMaker (any model) and Amazon Comprehend (sentiment analysis) — useful for fraud detection, ad targeting, and recommendations. Finally, Babelfish enables Aurora PostgreSQL to understand Microsoft SQL Server's T-SQL, so SQL Server-based applications can run on Aurora PostgreSQL with little or no code change (typically migrated using AWS SCT and DMS).",
    analogy:
      "Aurora Serverless is a taxi with a meter: you pay only while you're actually riding, and the car appears when you need it. Aurora Global Database is a multinational company where headquarters (the primary Region) makes decisions and branch offices worldwide (secondary Regions) see those decisions within a second — and if HQ burns down, a branch can be promoted to headquarters in under a minute.",
    diagram: `<svg viewBox="0 0 720 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Aurora Global Database">${svgDefs}
      <rect x="30" y="30" width="300" height="180" rx="10" fill="#1a2332" stroke="#22c55e" stroke-dasharray="4 4"/>
      <text x="45" y="52" fill="#22c55e" font-size="12" font-weight="700">Primary Region (read / write)</text>
      ${box(60, 65, 110, 45, "Aurora W", "master", "#2563eb")}
      ${box(190, 65, 110, 45, "Replica", "", "#22c55e")}
      ${box(60, 130, 240, 45, "Applications", "read / write", "#8b949e")}
      <rect x="390" y="30" width="300" height="180" rx="10" fill="#1a2332" stroke="#f59e0b" stroke-dasharray="4 4"/>
      <text x="405" y="52" fill="#f59e0b" font-size="12" font-weight="700">Secondary Region (read-only)</text>
      ${box(420, 65, 110, 45, "Aurora R", "read-only", "#f59e0b")}
      ${box(550, 65, 110, 45, "Replica", "", "#f59e0b")}
      ${box(420, 130, 240, 45, "Applications", "read only", "#8b949e")}
      <line x1="330" y1="90" x2="388" y2="90" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="332" y="82" fill="#8b949e" font-size="9">&lt;1s repl.</text>
    </svg>`,
    diagramLegend: [
      { color: "#2563eb", label: "Primary writer", description: "Only Region that accepts writes." },
      { color: "#f59e0b", label: "Secondary Region", description: "Read-only; promotable for DR (RTO < 1 min)." },
      { color: "#8b949e", label: "Applications", description: "Local low-latency reads per Region." },
    ],
    codeExample: {
      language: "bash",
      title: "Create an Aurora Global Database and add a secondary Region",
      code: `aws rds create-global-cluster \\
  --global-cluster-identifier my-global \\
  --source-db-cluster-identifier arn:aws:rds:us-east-1:...:cluster:my-aurora

aws rds create-db-cluster \\
  --db-cluster-identifier my-aurora-eu \\
  --engine aurora-mysql \\
  --global-cluster-identifier my-global \\
  --region eu-west-1`,
    },
    problemStatement:
      "A gaming company runs a spiky, mostly-idle internal analytics database (busy a few hours a week) and separately needs a globally distributed player-profile store with local read latency in the US, EU, and Asia plus fast cross-Region failover. Which Aurora option fits the intermittent analytics workload, and which fits the global low-latency reads with quick DR?",
    questions: [
      {
        q: "An internal database is idle most of the week but spikes unpredictably. You want no capacity planning and to pay only when it's used. Best fit?",
        options: [
          "A. Aurora Serverless",
          "B. Aurora Global Database",
          "C. Provisioned Aurora with 15 replicas",
          "D. RDS Multi-AZ",
        ],
        answer: "A",
        explanation:
          "A is correct: Aurora Serverless auto-instantiates and scales on actual usage with per-second billing — ideal for intermittent/unpredictable workloads. The others provision fixed capacity you pay for continuously.",
      },
      {
        q: "You need local low-latency reads on three continents and cross-Region disaster recovery in under a minute. Which feature?",
        options: [
          "A. Read replicas in one Region",
          "B. Aurora Global Database",
          "C. Aurora Serverless",
          "D. Custom endpoints",
        ],
        answer: "B",
        explanation:
          "B is correct: Aurora Global Database gives up to 5 secondary read-only Regions with sub-second replication and RTO < 1 minute. Single-Region replicas don't give global locality; Serverless/custom endpoints don't address multi-Region.",
      },
      {
        q: "Which Aurora feature lets you run analytics against only a specific subset of replicas?",
        options: ["A. Reader Endpoint", "B. Writer Endpoint", "C. Custom Endpoints", "D. Storage auto scaling"],
        answer: "C",
        explanation:
          "C is correct: Custom Endpoints target a chosen subset of instances (e.g. the larger replicas for analytics). The Reader Endpoint spreads across all replicas; the Writer targets the master.",
      },
      {
        q: "A company wants to migrate a Microsoft SQL Server application to Aurora PostgreSQL with minimal code changes. Which Aurora capability helps?",
        options: ["A. Aurora ML", "B. Babelfish", "C. Global Database", "D. Serverless"],
        answer: "B",
        explanation:
          "B is correct: Babelfish lets Aurora PostgreSQL understand T-SQL so SQL Server apps run with little/no change (migrate via SCT + DMS). Aurora ML is for predictions; the others are unrelated.",
      },
      {
        q: "Aurora Machine Learning integrates Aurora with which services to add predictions via SQL?",
        options: [
          "A. SageMaker and Comprehend",
          "B. Rekognition and Polly",
          "C. Redshift and Athena",
          "D. Kinesis and Firehose",
        ],
        answer: "A",
        explanation:
          "A is correct: Aurora ML calls Amazon SageMaker (any model) and Amazon Comprehend (sentiment) from SQL. The other services aren't the Aurora ML integrations.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "rds-aurora-backups-security",
    title: "RDS/Aurora Backups, Cloning, Security & RDS Proxy",
    shortLabel: "Backups, Security & Proxy",
    section: "Databases — RDS, Aurora & ElastiCache",
    domain: "Database",
    tldr:
      "RDS automated backups (1–35 days, PITR) can be disabled; Aurora's (1–35 days) cannot. Manual snapshots persist as long as you want. Aurora cloning is fast copy-on-write. Security = KMS at rest (set at launch), TLS in flight, IAM auth, security groups. RDS Proxy pools connections, cuts failover time, and enforces IAM auth.",
    subtopics: [
      {
        heading: "Backups & restore",
        bullets: [
          { icon: "🗓️", text: "**Automated backups**: daily full + transaction logs every 5 min → **PITR**. RDS: **1–35 days** (0 disables); Aurora: **1–35 days, cannot disable**." },
          { icon: "📸", text: "**Manual snapshots** kept as long as you want. Restoring a backup/snapshot always **creates a new DB**." },
          { icon: "💡", text: "A stopped RDS DB still pays for storage — for long stops, **snapshot & restore** instead." },
        ],
      },
      {
        heading: "Aurora Database Cloning",
        bullets: [
          { icon: "🧬", text: "Create a new Aurora cluster from an existing one via **copy-on-write** — faster & cheaper than snapshot+restore." },
          { icon: "🧪", text: "Great to spin up a **staging** DB from **production** without impacting production." },
        ],
      },
      {
        heading: "RDS & Aurora Security",
        bullets: [
          { icon: "🔐", text: "**At-rest**: KMS encryption set **at launch**; if master isn't encrypted, replicas can't be — encrypt via **snapshot → restore as encrypted**." },
          { icon: "🔒", text: "**In-flight** TLS by default; **IAM authentication** (roles instead of user/pw); **security groups** control network access; audit logs → CloudWatch Logs." },
        ],
      },
      {
        heading: "Amazon RDS Proxy",
        bullets: [
          { icon: "🕳️", text: "Fully-managed proxy: **pools & shares DB connections** → less CPU/RAM stress, fewer timeouts (great for Lambda)." },
          { icon: "⚡", text: "Serverless, autoscaling, multi-AZ; reduces failover time by **up to 66%**; enforces **IAM auth** + Secrets Manager; **never publicly accessible** (VPC only)." },
        ],
      },
    ],
    keyFacts: [
      { label: "RDS backup retention", value: "1–35 days (0 disables)", icon: "🗓️" },
      { label: "Aurora backups", value: "1–35 days, cannot disable", icon: "🔒" },
      { label: "Encrypt existing DB", value: "Snapshot → restore encrypted", icon: "🔐" },
      { label: "RDS Proxy failover", value: "Up to 66% faster", icon: "⚡" },
    ],
    quickReference: {
      title: "Exam cues",
      icon: "🎯",
      bullets: [
        "'Encrypt an unencrypted DB' → snapshot it, **restore the snapshot as encrypted**.",
        "'Lambda opening too many DB connections / timeouts' → **RDS Proxy**.",
        "'Fast staging copy of prod' → **Aurora Cloning** (copy-on-write).",
        "PITR comes from **automated backups** (logs every 5 min).",
        "RDS Proxy enforces **IAM auth** and is **never public** (VPC only).",
      ],
      analogyBrief:
        "RDS Proxy is a shared taxi stand: instead of everyone hailing their own cab (connection), riders share a managed pool — and if one cab breaks down, the queue barely notices.",
    },
    explanation:
      "RDS takes automated backups — a daily full backup plus transaction logs every five minutes — giving point-in-time restore anywhere from the oldest backup to about five minutes ago, with retention of 1 to 35 days (0 disables automated backups on RDS). Aurora's automated backups also retain 1 to 35 days but cannot be disabled. Manual DB snapshots are user-triggered and kept for as long as you like, and restoring any backup or snapshot always creates a brand-new database. Note that a stopped RDS database still incurs storage charges, so for long pauses it's cheaper to snapshot and restore. Aurora Database Cloning creates a new cluster from an existing one using a fast, cost-effective copy-on-write protocol, perfect for spinning up a staging environment from production without impacting it. For security: at-rest encryption uses AWS KMS and must be defined at launch (if the master isn't encrypted the read replicas can't be, and to encrypt an existing unencrypted database you snapshot it and restore the snapshot as encrypted); in-flight encryption is TLS-ready by default; IAM authentication lets you connect with roles instead of a username/password; security groups control network access; and audit logs can be sent to CloudWatch Logs. Amazon RDS Proxy is a fully-managed proxy that pools and shares database connections, reducing stress on database CPU/RAM and minimizing open connections and timeouts (especially valuable for Lambda). It is serverless, autoscaling, and highly available, reduces RDS/Aurora failover time by up to 66%, enforces IAM authentication with credentials in Secrets Manager, and is never publicly accessible — it must be reached from within the VPC.",
    analogy:
      "RDS Proxy is a shared taxi stand at a busy hotel. Without it, every guest (Lambda invocation) hails their own cab (opens a DB connection), clogging the street. The stand keeps a managed pool of cabs that guests share, and if one cab breaks down (failover), the dispatcher reroutes so the queue barely notices.",
    diagram: `<svg viewBox="0 0 720 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="RDS Proxy connection pooling">${svgDefs}
      ${box(30, 40, 60, 40, "λ", "", "#f59e0b")}
      ${box(30, 95, 60, 40, "λ", "", "#f59e0b")}
      ${box(30, 150, 60, 40, "λ", "", "#f59e0b")}
      <text x="60" y="215" text-anchor="middle" fill="#8b949e" font-size="10">many Lambdas</text>
      <line x1="90" y1="60" x2="250" y2="110" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="90" y1="115" x2="250" y2="115" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="90" y1="170" x2="250" y2="120" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(255, 90, 160, 55, "RDS Proxy", "pooled connections", "#6b46c1")}
      <line x1="415" y1="117" x2="500" y2="117" stroke="#22c55e" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(505, 90, 170, 55, "RDS / Aurora", "IAM auth · Secrets Mgr", "#2563eb")}
      <text x="330" y="180" text-anchor="middle" fill="#8b949e" font-size="10">fewer open connections · faster failover</text>
    </svg>`,
    diagramLegend: [
      { color: "#f59e0b", label: "Clients (e.g. Lambda)", description: "Open many short-lived connections." },
      { color: "#6b46c1", label: "RDS Proxy", description: "Pools/shares connections; VPC-only; IAM auth." },
      { color: "#2563eb", label: "RDS / Aurora", description: "Backend DB, protected from connection storms." },
    ],
    codeExample: {
      language: "bash",
      title: "Encrypt an unencrypted RDS DB via snapshot → encrypted copy → restore",
      code: `# 1) Snapshot the unencrypted DB
aws rds create-db-snapshot \\
  --db-instance-identifier prod-mysql \\
  --db-snapshot-identifier prod-mysql-snap

# 2) Copy the snapshot, encrypting with a KMS key
aws rds copy-db-snapshot \\
  --source-db-snapshot-identifier prod-mysql-snap \\
  --target-db-snapshot-identifier prod-mysql-snap-enc \\
  --kms-key-id alias/aws/rds

# 3) Restore a NEW, encrypted DB from the encrypted snapshot
aws rds restore-db-instance-from-db-snapshot \\
  --db-instance-identifier prod-mysql-enc \\
  --db-snapshot-identifier prod-mysql-snap-enc`,
    },
    problemStatement:
      "A serverless app with thousands of concurrent Lambda functions keeps exhausting the RDS connection limit and times out during failovers. Separately, auditors require that an existing unencrypted production database become encrypted at rest without data loss. Which managed service solves the connection storm and speeds failover, and what is the correct sequence to encrypt the existing database?",
    questions: [
      {
        q: "Thousands of Lambda invocations exhaust an RDS database's connection limit and cause timeouts. What's the recommended fix?",
        options: [
          "A. Increase the DB instance size only",
          "B. Put Amazon RDS Proxy in front to pool and share connections",
          "C. Give each Lambda an Elastic IP",
          "D. Enable Multi-AZ",
        ],
        answer: "B",
        explanation:
          "B is correct: RDS Proxy pools/shares connections, reduces open connections and timeouts, and speeds failover — ideal for Lambda. Sizing up delays the problem; Elastic IPs and Multi-AZ don't address connection pooling.",
      },
      {
        q: "How do you encrypt an EXISTING unencrypted RDS database?",
        options: [
          "A. Toggle 'encrypt' on the running instance",
          "B. Take a snapshot, copy it as encrypted, and restore a new encrypted DB",
          "C. It's impossible to ever encrypt it",
          "D. Enable TLS in flight — that encrypts at rest too",
        ],
        answer: "B",
        explanation:
          "B is correct: at-rest encryption is set at launch, so you snapshot, make an encrypted copy of the snapshot, and restore a new encrypted database. You can't toggle it on a live instance, and TLS is in-flight only.",
      },
      {
        q: "Which backup statement is TRUE?",
        options: [
          "A. Aurora automated backups can be disabled",
          "B. RDS automated backups can be disabled (retention 0); Aurora's cannot",
          "C. Manual snapshots expire after 35 days",
          "D. Restoring a snapshot overwrites the source DB in place",
        ],
        answer: "B",
        explanation:
          "B is correct: RDS automated backups allow 1–35 days or 0 to disable, while Aurora's 1–35 day backups cannot be disabled. Manual snapshots persist until deleted, and restores create a new DB (never overwrite in place).",
      },
      {
        q: "You need a quick, low-cost copy of a production Aurora cluster for testing without impacting production. Best approach?",
        options: [
          "A. Aurora Database Cloning (copy-on-write)",
          "B. Cross-Region snapshot copy",
          "C. Export to S3 and reimport",
          "D. Promote a read replica",
        ],
        answer: "A",
        explanation:
          "A is correct: Aurora cloning uses copy-on-write to create a fast, cheap clone without impacting production. Snapshot copies and S3 export/import are slower; promoting a replica removes it from the cluster.",
      },
      {
        q: "Which is TRUE about Amazon RDS Proxy?",
        options: [
          "A. It is publicly accessible over the internet by default",
          "B. It is only reachable from within the VPC and can enforce IAM authentication",
          "C. It replaces the need for a database",
          "D. It increases failover time",
        ],
        answer: "B",
        explanation:
          "B is correct: RDS Proxy is never publicly accessible (VPC only) and enforces IAM auth with Secrets Manager. It sits in front of a database (doesn't replace it) and reduces failover time by up to 66%.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "amazon-elasticache",
    title: "Amazon ElastiCache — Redis vs Memcached",
    shortLabel: "ElastiCache",
    section: "Databases — RDS, Aurora & ElastiCache",
    domain: "Database",
    tldr:
      "ElastiCache is managed Redis or Memcached — in-memory caches that cut database load and make apps stateless. Redis adds Multi-AZ failover, read replicas, persistence, and backups; Memcached is multi-threaded, sharded, non-persistent. Patterns: lazy loading, write-through, and session store.",
    subtopics: [
      {
        heading: "What ElastiCache is",
        bullets: [
          { icon: "⚡", text: "Managed **in-memory** cache (Redis/Memcached): very high performance, low latency." },
          { icon: "📉", text: "**Reduces read load** on databases; helps make apps **stateless** (store sessions)." },
          { icon: "🛠️", text: "AWS handles OS/patching, setup, monitoring, failure recovery, backups — but using it needs **application code changes**." },
        ],
      },
      {
        heading: "Redis vs Memcached",
        bullets: [
          { icon: "🟥", text: "**Redis**: Multi-AZ + auto-failover, **read replicas** for HA, **persistence (AOF)**, backup/restore, Sets/Sorted Sets." },
          { icon: "🟦", text: "**Memcached**: multi-node **sharding**, **multi-threaded**, **no** replication/HA, **non-persistent**." },
        ],
      },
      {
        heading: "Caching patterns",
        bullets: [
          { icon: "🐢", text: "**Lazy Loading** — cache read data on miss; data can go **stale**." },
          { icon: "✍️", text: "**Write Through** — update cache whenever the DB is written (no stale data)." },
          { icon: "🎫", text: "**Session Store** — keep temporary session data with a **TTL** (makes app stateless)." },
        ],
      },
      {
        heading: "Cache security & use case",
        bullets: [
          { icon: "🔑", text: "**Redis AUTH** token + SSL in flight; **IAM auth** for Redis (API-level); Memcached supports **SASL**." },
          { icon: "🏆", text: "Redis **Sorted Sets** power real-time **gaming leaderboards** (uniqueness + ordering)." },
        ],
      },
    ],
    keyFacts: [
      { label: "Engines", value: "Redis · Memcached", icon: "⚡" },
      { label: "HA / replicas", value: "Redis only", icon: "🟥" },
      { label: "Sharding / multi-thread", value: "Memcached", icon: "🟦" },
      { label: "Persistence", value: "Redis (AOF); Memcached none", icon: "💾" },
    ],
    quickReference: {
      title: "Redis vs Memcached cues",
      icon: "🎯",
      bullets: [
        "Need **HA, replicas, persistence, backups, sorted sets** → **Redis**.",
        "Need pure **sharded, multi-threaded** cache, no HA → **Memcached**.",
        "'Store user sessions to make app stateless' → ElastiCache **session store** (TTL).",
        "'Cache reads to relieve RDS' → **lazy loading**; 'no stale data' → **write-through**.",
        "Real-time **leaderboard** → Redis **Sorted Sets**.",
      ],
      analogyBrief:
        "A cache is a barista's pre-made shelf: popular drinks are ready instantly (cache hit); an unusual order goes back to the machine (DB) and is then stocked for next time.",
    },
    explanation:
      "Amazon ElastiCache is to in-memory caches what RDS is to relational databases: a managed Redis or Memcached. These caches are in-memory databases with very high performance and low latency; they reduce read load on databases for read-intensive workloads and help make applications stateless by holding session data. AWS handles OS maintenance and patching, optimization, setup, configuration, monitoring, failure recovery, and backups — but adopting ElastiCache involves meaningful application code changes. Redis offers Multi-AZ with automatic failover, read replicas for scaling and high availability, data durability via AOF persistence, backup and restore, and rich data types like Sets and Sorted Sets; Memcached is a multi-threaded engine that shards data across nodes but has no replication or high availability and is non-persistent. Common patterns are lazy loading (cache data on read, which can become stale), write-through (update the cache whenever the database is written, avoiding stale data), and session store (keep temporary session data with a TTL). Security includes Redis AUTH tokens and in-flight SSL, IAM authentication for Redis at the API level, and SASL for Memcached. A classic Redis use case is a real-time gaming leaderboard, where Sorted Sets guarantee both uniqueness and ordering.",
    analogy:
      "A cache is the barista's shelf of pre-made popular drinks. When you order a regular latte, it's handed over instantly (a cache hit). If you ask for something unusual, the barista makes it from the machine (the database) and often puts a spare on the shelf for the next person (lazy loading). Redis is a shelf with a backup barista and a written recipe log (HA + persistence); Memcached is a bigger shelf split among several baristas working in parallel, but with no backup and no recipe log.",
    diagram: `<svg viewBox="0 0 720 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="ElastiCache lazy loading">${svgDefs}
      ${box(30, 95, 130, 55, "Application", "", "#8b949e")}
      ${box(230, 30, 180, 55, "ElastiCache", "in-memory", "#2563eb")}
      ${box(230, 160, 180, 55, "Amazon RDS", "database", "#22c55e")}
      <line x1="160" y1="110" x2="228" y2="70" stroke="#22c55e" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="150" y="95" fill="#22c55e" font-size="10">cache hit</text>
      <line x1="160" y1="135" x2="228" y2="180" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="150" y="165" fill="#ff9900" font-size="10">cache miss</text>
      <line x1="320" y1="160" x2="320" y2="88" stroke="#8b949e" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#arrow-mute)"/>
      <text x="330" y="128" fill="#8b949e" font-size="10">write to cache</text>
      ${box(470, 30, 100, 55, "Redis", "HA + persist", "#ef4444")}
      ${box(590, 30, 100, 55, "Memcached", "sharded", "#3b82f6")}
    </svg>`,
    diagramLegend: [
      { color: "#2563eb", label: "ElastiCache", description: "In-memory cache queried before the DB." },
      { color: "#22c55e", label: "Database (RDS)", description: "Source of truth; hit only on cache miss." },
      { color: "#ef4444", label: "Redis / Memcached", description: "Redis = HA+persistence; Memcached = sharded/multi-thread." },
    ],
    codeExample: {
      language: "python",
      title: "Lazy-loading cache pattern (Redis) in application code",
      code: `import redis, json
cache = redis.Redis(host="my-redis.xxxx.cache.amazonaws.com", port=6379, ssl=True)

def get_user(user_id, db):
    key = f"user:{user_id}"
    cached = cache.get(key)
    if cached:                      # cache hit
        return json.loads(cached)
    row = db.query_user(user_id)    # cache miss -> read DB
    cache.set(key, json.dumps(row), ex=300)  # write to cache, 5-min TTL
    return row`,
    },
    problemStatement:
      "A read-heavy product catalog hammers RDS with the same popular queries, and a horizontally-scaled web tier loses user sessions when the load balancer moves a client to a different instance. You also need a real-time leaderboard for a new game feature. Which ElastiCache engine and patterns solve the DB load, the session problem, and the leaderboard?",
    questions: [
      {
        q: "Which ElastiCache engine should you choose when you need Multi-AZ failover, read replicas, and data persistence?",
        options: ["A. Memcached", "B. Redis", "C. Either; they're identical", "D. Neither supports HA"],
        answer: "B",
        explanation:
          "B is correct: Redis offers Multi-AZ with auto-failover, read replicas, and AOF persistence. Memcached is multi-threaded and sharded but has no replication/HA and no persistence.",
      },
      {
        q: "A horizontally-scaled web app loses user sessions when the LB routes a user to a new instance. Best ElastiCache use?",
        options: [
          "A. Store sessions in ElastiCache (session store with TTL) to make the app stateless",
          "B. Enable Memcached persistence",
          "C. Use write-through only",
          "D. Disable stickiness and do nothing else",
        ],
        answer: "A",
        explanation:
          "A is correct: keeping session data in a shared cache (with a TTL) makes any instance able to serve any user — the classic session-store pattern. Memcached isn't persistent; write-through alone doesn't store sessions.",
      },
      {
        q: "In the lazy-loading pattern, what is a known drawback?",
        options: [
          "A. It requires Redis persistence",
          "B. Cached data can become stale",
          "C. It writes to the cache on every DB write",
          "D. It cannot be used with RDS",
        ],
        answer: "B",
        explanation:
          "B is correct: lazy loading only refreshes on a miss, so cached data can go stale. Writing to the cache on every DB write describes write-through (which avoids stale data).",
      },
      {
        q: "Which Redis feature is ideal for a real-time gaming leaderboard requiring uniqueness and ordering?",
        options: ["A. Sorted Sets", "B. Sharding", "C. AOF persistence", "D. SASL auth"],
        answer: "A",
        explanation:
          "A is correct: Redis Sorted Sets guarantee both uniqueness and element ordering, ranking new scores in real time. Sharding is a Memcached trait; AOF is persistence; SASL is Memcached auth.",
      },
      {
        q: "Which caching pattern guarantees the cache is never stale by updating it whenever the database is written?",
        options: ["A. Lazy loading", "B. Write-through", "C. Session store", "D. Read replica"],
        answer: "B",
        explanation:
          "B is correct: write-through updates the cache on every DB write, so reads never see stale data (at the cost of write latency). Lazy loading can be stale; session store holds session data; read replica isn't a cache pattern.",
      },
    ],
  },
];
