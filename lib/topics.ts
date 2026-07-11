// ============================================================
// AWS SAA-C03 Learning Content
// Covers slides 1–120 of Stephane Maarek's course
// ============================================================

// Types + shared SVG fragments now live in ./topics/shared.ts.
// We import them for local use and re-export so `@/lib/topics` keeps the
// exact same public surface (backward compatible).
import { svgDefs } from "./topics/shared";
import type { Topic, SectionInfo, CourseInfo } from "./topics/shared";

export type {
  Question,
  CodeExample,
  Subtopic,
  KeyFact,
  DiagramLegendItem,
  QuickReference,
  Domain,
  Topic,
  SectionInfo,
  CourseInfo,
} from "./topics/shared";

// ---- New sections (course pages 118–414), authored in per-section modules ----
import { haScalingTopics } from "./topics/ha-scaling";
import { databaseTopics } from "./topics/databases";
import { route53Topics } from "./topics/route53";
import { solutionsArchTopics } from "./topics/solutions-architectures";
import { s3Topics } from "./topics/s3";
import { s3AdvancedTopics } from "./topics/s3-advanced";
import { cloudfrontGaTopics } from "./topics/cloudfront-ga";
import { storageExtrasTopics } from "./topics/storage-extras";
import { messagingTopics } from "./topics/messaging";

// ---- Frontend course ----
import { frontendCoreTopics } from "./topics/frontend-core";
import { frontendAsyncTopics } from "./topics/frontend-async";

// ---- Backend course ----
import { backendPyFoundationsTopics } from "./topics/backend-python-foundations";
import { backendPyAdvancedTopics } from "./topics/backend-python-advanced";
import { backendContainersTopics } from "./topics/backend-containers";

// ---- Networking course ----
import { networkingProtocolsTopics } from "./topics/networking-protocols";
import { networkingDnsTlsTopics } from "./topics/networking-dns-tls";
import { networkingDeliveryTopics } from "./topics/networking-delivery";

// ---- System Design course ----
import { systemDesignFundamentalsTopics } from "./topics/system-design-fundamentals";
import { systemDesignDataTopics } from "./topics/system-design-data";
import { systemDesignScalingTopics } from "./topics/system-design-scaling";

// ---- AI Engineering course ----
import { aiFundamentalsTopics } from "./topics/ai-fundamentals";
import { aiPromptEngineeringTopics } from "./topics/ai-prompt-engineering";
import { aiLlmIntegrationTopics } from "./topics/ai-llm-integration";
import { aiRagTopics } from "./topics/ai-rag";
import { aiLangchainTopics } from "./topics/ai-langchain";
// NOTE: the "AI Agents" module (ai-agents.ts) is still pending — see TODO.txt.

// ---- DSA Prep course ----
import { dsaRecursionBacktrackingTopics } from "./topics/dsa-recursion-backtracking";

// ============================================================
// COURSES
// Top level of the content hierarchy: Course → Section → Topic.
// The "aws" course lists every existing section id (no content edits).
// New courses start empty and are populated as their content lands.
// ============================================================
export const courses: CourseInfo[] = [
  {
    id: "aws",
    title: "AWS / Cloud",
    icon: "Cloud",
    description: "AWS Solutions Architect Associate (SAA-C03) fundamentals.",
    sectionIds: [
      "intro",
      "iam",
      "ec2-basics",
      "ec2-assoc",
      "ec2-storage",
      "ha-scaling",
      "databases",
      "route53",
      "solutions-architectures",
      "amazon-s3",
      "amazon-s3-advanced",
      "cloudfront-ga",
      "storage-extras",
      "messaging",
    ],
  },
  {
    id: "frontend",
    title: "Frontend",
    icon: "Layout",
    description: "JavaScript core, closures, async, and the event loop.",
    sectionIds: ["js-core", "js-async"],
  },
  {
    id: "backend",
    title: "Backend",
    icon: "Server",
    description: "Python foundations, advanced patterns, and containers.",
    sectionIds: ["py-foundations", "py-advanced", "backend-containers"],
  },
  {
    id: "ai",
    title: "AI Engineering",
    icon: "Sparkles",
    description: "LLMs, prompting, RAG, LangChain, and AI agents.",
    // "ai-agents" section is pending authoring (see TODO.txt) — add it here once done.
    sectionIds: [
      "ai-fundamentals",
      "prompt-engineering",
      "llm-integration",
      "rag",
      "langchain",
    ],
  },
  {
    id: "networking",
    title: "Networking",
    icon: "Network",
    description: "Web protocols, DNS, TLS, and content delivery.",
    sectionIds: ["net-protocols", "net-dns-tls", "net-delivery"],
  },
  {
    id: "system-design",
    title: "System Design",
    icon: "Boxes",
    description: "Scalability, storage, caching, and distributed patterns.",
    sectionIds: ["sd-fundamentals", "sd-data", "sd-scaling"],
  },
  {
    id: "dsa",
    title: "DSA Prep",
    icon: "Brain",
    description:
      "Coding-interview patterns for timed OAs — recursion & backtracking to start.",
    sectionIds: ["dsa-recursion-backtracking"],
  },
];

// ============================================================
// SECTIONS
// ============================================================
export const sections: SectionInfo[] = [
  {
    id: "intro",
    title: "Getting Started with AWS",
    topicIds: [
      "aws-overview",
      "global-infrastructure",
      "choosing-region",
      "global-vs-regional-services",
    ],
  },
  {
    id: "iam",
    title: "IAM — Identity & Access Management",
    topicIds: [
      "iam-users-groups",
      "iam-permissions-policies",
      "iam-policy-structure",
      "iam-password-policy",
      "iam-mfa",
      "aws-access-methods",
      "aws-cli",
      "aws-sdk",
      "iam-roles",
      "iam-security-tools",
      "iam-best-practices",
    ],
  },
  {
    id: "ec2-basics",
    title: "Amazon EC2 — Basics",
    topicIds: [
      "ec2-overview",
      "ec2-config-options",
      "ec2-user-data",
      "ec2-instance-types",
      "ec2-instance-families",
      "security-groups",
      "classic-ports",
      "ssh-access",
      "ec2-purchasing-options",
      "ec2-spot-instances",
      "spot-fleets",
    ],
  },
  {
    id: "ec2-assoc",
    title: "Amazon EC2 — Associate",
    topicIds: [
      "private-public-ip",
      "elastic-ip",
      "placement-groups",
      "elastic-network-interfaces",
      "ec2-hibernate",
    ],
  },
  {
    id: "ec2-storage",
    title: "EC2 Instance Storage",
    topicIds: [
      "ebs-volume-overview",
      "ebs-delete-on-termination",
      "ebs-snapshots",
      "ami-overview",
      "ec2-instance-store",
      "ebs-volume-types",
      "ebs-multi-attach",
      "ebs-encryption",
      "amazon-efs",
      "efs-performance-storage-classes",
      "ebs-vs-efs",
    ],
  },
  // ---- New sections (course pages 118–414) ----
  {
    id: "ha-scaling",
    title: "High Availability & Scalability",
    topicIds: [
      "scalability-high-availability",
      "elastic-load-balancing",
      "clb-alb",
      "nlb-gwlb",
      "elb-sticky-ssl",
      "auto-scaling-groups",
      "asg-scaling-policies",
    ],
  },
  {
    id: "databases",
    title: "Databases — RDS, Aurora & ElastiCache",
    topicIds: [
      "rds-overview",
      "rds-read-replicas",
      "rds-multi-az-custom",
      "amazon-aurora",
      "aurora-advanced",
      "rds-aurora-backups-security",
      "amazon-elasticache",
    ],
  },
  {
    id: "route53",
    title: "Amazon Route 53 — DNS",
    topicIds: [
      "dns-fundamentals",
      "route53-records",
      "route53-cname-alias",
      "route53-routing-policies",
      "route53-health-checks",
      "route53-registrar-hybrid",
    ],
  },
  {
    id: "solutions-architectures",
    title: "Classic Solutions Architectures",
    topicIds: [
      "sa-stateless-web-app",
      "sa-stateful-web-app",
      "sa-wordpress",
      "instantiating-apps-beanstalk",
    ],
  },
  {
    id: "amazon-s3",
    title: "Amazon S3",
    topicIds: [
      "s3-buckets-objects",
      "s3-security-policies",
      "s3-versioning-replication",
      "s3-static-website",
      "s3-storage-classes",
    ],
  },
  {
    id: "amazon-s3-advanced",
    title: "Amazon S3 — Advanced & Security",
    topicIds: [
      "s3-lifecycle-analytics",
      "s3-event-notifications",
      "s3-performance",
      "s3-encryption",
      "s3-advanced-security",
    ],
  },
  {
    id: "cloudfront-ga",
    title: "CloudFront & Global Accelerator",
    topicIds: [
      "cloudfront-overview",
      "cloudfront-caching-geo",
      "global-accelerator",
    ],
  },
  {
    id: "storage-extras",
    title: "AWS Storage Extras",
    topicIds: [
      "aws-snowball",
      "amazon-fsx",
      "storage-gateway",
      "transfer-family-datasync",
    ],
  },
  {
    id: "messaging",
    title: "Integration & Messaging — SQS, SNS & Kinesis",
    topicIds: [
      "amazon-sqs",
      "sqs-fifo",
      "amazon-sns",
      "sns-sqs-fanout",
      "amazon-kinesis",
    ],
  },

  // ---- Frontend course ----
  {
    id: "js-core",
    title: "JavaScript Core",
    topicIds: [
      "fe-closures",
      "fe-scope",
      "fe-this",
      "fe-currying",
      "fe-es6-features",
      "fe-array-methods",
    ],
  },
  {
    id: "js-async",
    title: "Async & Event Loop",
    topicIds: ["fe-event-loop", "fe-promises-async"],
  },

  // ---- Backend course ----
  {
    id: "py-foundations",
    title: "Python Foundations",
    topicIds: [
      "be-env-setup",
      "be-python-syntax",
      "be-collections",
      "be-control-flow",
      "be-functions",
      "be-comprehensions",
    ],
  },
  {
    id: "py-advanced",
    title: "Advanced Python",
    topicIds: [
      "be-oop",
      "be-advanced-python",
      "be-error-handling",
      "be-concurrency",
      "be-async-programming",
      "be-pydantic",
    ],
  },
  {
    id: "backend-containers",
    title: "Containers",
    topicIds: ["be-docker", "be-docker-compose", "be-container-images"],
  },

  // ---- Networking course ----
  {
    id: "net-protocols",
    title: "Web Protocols",
    topicIds: ["net-http", "net-rest-api", "net-tcp-udp"],
  },
  {
    id: "net-dns-tls",
    title: "DNS & TLS",
    topicIds: ["net-dns", "net-tls"],
  },
  {
    id: "net-delivery",
    title: "Delivery & Scale",
    topicIds: ["net-load-balancing", "net-cdn-caching", "net-websockets"],
  },

  // ---- System Design course ----
  {
    id: "sd-fundamentals",
    title: "Fundamentals",
    topicIds: ["sd-scalability", "sd-load-balancing", "sd-caching"],
  },
  {
    id: "sd-data",
    title: "Data & Storage",
    topicIds: ["sd-sql-vs-nosql", "sd-replication-sharding", "sd-cap-theorem"],
  },
  {
    id: "sd-scaling",
    title: "Scaling Patterns",
    topicIds: ["sd-message-queues", "sd-rate-limiting", "sd-consistent-hashing"],
  },

  // ---- AI Engineering course (5/6 sections — "AI Agents" pending, see TODO.txt) ----
  {
    id: "ai-fundamentals",
    title: "AI Fundamentals",
    topicIds: [
      "ai-fundamentals",
      "ai-transformers-attention",
      "ai-tokens-embeddings",
      "ai-model-evaluation",
      "ai-context-memory",
      "ai-inference-sampling",
    ],
  },
  {
    id: "prompt-engineering",
    title: "Prompt Engineering",
    topicIds: [
      "ai-prompt-engineering",
      "ai-few-shot",
      "ai-chain-of-thought",
      "ai-structured-prompting",
      "ai-prompt-optimization",
    ],
  },
  {
    id: "llm-integration",
    title: "LLM Integration",
    topicIds: [
      "ai-llm-api",
      "ai-streaming-async",
      "ai-function-calling",
      "ai-caching-tokens",
    ],
  },
  {
    id: "rag",
    title: "RAG — Retrieval-Augmented Generation",
    topicIds: [
      "ai-rag-fundamentals",
      "ai-chunking",
      "ai-vector-databases",
      "ai-retrieval-evaluation",
      "ai-context-injection",
      "ai-hybrid-search",
      "ai-rag-failures",
    ],
  },
  {
    id: "langchain",
    title: "LangChain",
    topicIds: ["ai-langchain-basics", "ai-langchain-chains", "ai-langchain-memory"],
  },
  {
    id: "dsa-recursion-backtracking",
    title: "Recursion & Backtracking",
    topicIds: ["rb-concept", "rb-subsets", "rb-combination-sum"],
  },
];

// SVG diagram helpers (`svgDefs`) are imported from ./topics/shared above.

// ============================================================
// TOPICS
// ============================================================
export const topics: Topic[] = [
  // =================================================================
  // SECTION 1: GETTING STARTED
  // =================================================================
  {
    id: "aws-overview",
    title: "What is AWS? Cloud Overview & Use Cases",
    shortLabel: "AWS Overview",
    section: "Getting Started with AWS",
    domain: "Foundations",
    explanation:
      "Amazon Web Services (AWS) is the world's largest cloud provider, offering on-demand servers, storage, databases, networking, and more than 200 fully managed services. AWS lets you rent compute capacity by the second instead of buying physical hardware, so you can scale up during traffic spikes and scale down when demand drops — paying only for what you use. AWS launched publicly in 2006 with SQS, S3, and EC2 and has grown into a roughly $90 billion/year business that powers Netflix, Airbnb, NASA, McDonald's, and millions of others. The Solutions Architect role is about choosing the right combination of these services to build systems that are highly available, secure, performant, and cost-efficient.",
    analogy:
      "Owning physical servers is like buying a house: you pay upfront, you're responsible for the roof and the plumbing, and you can't easily move. Using AWS is like staying at a global hotel chain: you rent only the room (or floor) you need, the staff handles maintenance, you can check in and out by the hour, and you can move to a different city — or scale to a whole banquet hall — overnight.",
    diagram: `<svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="AWS cloud overview diagram">${svgDefs}
      <rect x="20" y="20" width="680" height="280" rx="10" fill="#1a2332" stroke="#2d3a4f" stroke-dasharray="4 4"/>
      <text x="40" y="48" fill="#ff9900" font-size="16" font-weight="700">AWS Cloud</text>
      <g>
        <rect x="50" y="70" width="140" height="60" rx="8" fill="#243349" stroke="#ff9900"/>
        <text x="120" y="95" text-anchor="middle" fill="#e6edf3" font-size="13" font-weight="600">EC2</text>
        <text x="120" y="113" text-anchor="middle" fill="#8b949e" font-size="11">Compute</text>
      </g>
      <g>
        <rect x="210" y="70" width="140" height="60" rx="8" fill="#243349" stroke="#ff9900"/>
        <text x="280" y="95" text-anchor="middle" fill="#e6edf3" font-size="13" font-weight="600">S3</text>
        <text x="280" y="113" text-anchor="middle" fill="#8b949e" font-size="11">Object Storage</text>
      </g>
      <g>
        <rect x="370" y="70" width="140" height="60" rx="8" fill="#243349" stroke="#ff9900"/>
        <text x="440" y="95" text-anchor="middle" fill="#e6edf3" font-size="13" font-weight="600">RDS</text>
        <text x="440" y="113" text-anchor="middle" fill="#8b949e" font-size="11">Databases</text>
      </g>
      <g>
        <rect x="530" y="70" width="140" height="60" rx="8" fill="#243349" stroke="#ff9900"/>
        <text x="600" y="95" text-anchor="middle" fill="#e6edf3" font-size="13" font-weight="600">Lambda</text>
        <text x="600" y="113" text-anchor="middle" fill="#8b949e" font-size="11">Serverless</text>
      </g>
      <g>
        <rect x="50" y="160" width="140" height="60" rx="8" fill="#243349" stroke="#ff9900"/>
        <text x="120" y="185" text-anchor="middle" fill="#e6edf3" font-size="13" font-weight="600">VPC</text>
        <text x="120" y="203" text-anchor="middle" fill="#8b949e" font-size="11">Networking</text>
      </g>
      <g>
        <rect x="210" y="160" width="140" height="60" rx="8" fill="#243349" stroke="#ff9900"/>
        <text x="280" y="185" text-anchor="middle" fill="#e6edf3" font-size="13" font-weight="600">IAM</text>
        <text x="280" y="203" text-anchor="middle" fill="#8b949e" font-size="11">Identity</text>
      </g>
      <g>
        <rect x="370" y="160" width="140" height="60" rx="8" fill="#243349" stroke="#ff9900"/>
        <text x="440" y="185" text-anchor="middle" fill="#e6edf3" font-size="13" font-weight="600">CloudWatch</text>
        <text x="440" y="203" text-anchor="middle" fill="#8b949e" font-size="11">Monitoring</text>
      </g>
      <g>
        <rect x="530" y="160" width="140" height="60" rx="8" fill="#243349" stroke="#ff9900"/>
        <text x="600" y="185" text-anchor="middle" fill="#e6edf3" font-size="13" font-weight="600">Route 53</text>
        <text x="600" y="203" text-anchor="middle" fill="#8b949e" font-size="11">DNS</text>
      </g>
      <rect x="50" y="245" width="620" height="40" rx="6" fill="#0a0e14" stroke="#2d3a4f"/>
      <text x="360" y="270" text-anchor="middle" fill="#b0bac6" font-size="12">200+ managed services, on-demand, pay-per-use, global scale</text>
    </svg>`,
    codeExample: {
      language: "bash",
      title: "Verify AWS account access via CLI",
      code: `# Configure your credentials (one-time)
aws configure
# AWS Access Key ID: AKIA...
# AWS Secret Access Key: ...
# Default region name: us-east-1
# Default output format: json

# Confirm which AWS account/identity you're using
aws sts get-caller-identity
# {
#   "UserId":  "AIDAEXAMPLE",
#   "Account": "123456789012",
#   "Arn":     "arn:aws:iam::123456789012:user/alice"
# }

# List all available AWS regions
aws ec2 describe-regions --query "Regions[].RegionName" --output table`,
    },
    problemStatement:
      "You are a solutions architect at a fast-growing video-streaming startup. The CTO wants to know whether the company should keep buying physical servers for the next holiday-traffic spike, or move workloads to AWS. Forecasted demand is 5× current capacity for 6 weeks, then back to normal. Capital is tight. Pitch the cloud value proposition in one paragraph, citing pay-per-use, elasticity, and global reach, and identify which two AWS pillars (out of cost, availability, performance, security, scalability) most directly justify the move.",
    questions: [
      {
        q: "A startup expects unpredictable traffic spikes and limited capital. Which AWS characteristic most directly addresses both concerns?",
        options: [
          "A. Long-term Reserved Instance pricing",
          "B. On-demand, pay-per-use elastic capacity",
          "C. Dedicated Hosts with BYOL licensing",
          "D. Free Tier eligibility for the first 12 months",
        ],
        answer: "B",
        explanation:
          "B is correct: pay-per-use elasticity lets the company spin capacity up during a spike and down when traffic drops, with no upfront capital. A targets steady, predictable workloads (1- or 3-year commitments) — the opposite of unpredictable spikes. C is for compliance / licensing edge cases and costs more, not less. D is a marketing perk, not an architectural property; it doesn't scale to production traffic.",
      },
      {
        q: "Which of the following is NOT an AWS service?",
        options: [
          "A. Amazon EC2",
          "B. Amazon S3",
          "C. Amazon BigQuery",
          "D. AWS Lambda",
        ],
        answer: "C",
        explanation:
          "C is correct: BigQuery is Google Cloud's data warehouse — AWS's equivalent is Amazon Redshift (or Athena for serverless SQL on S3). A, B, and D are all core AWS services: EC2 (compute), S3 (object storage), Lambda (serverless functions).",
      },
      {
        q: "AWS publicly relaunched in 2006 with which three services?",
        options: [
          "A. EC2, RDS, and S3",
          "B. SQS, S3, and EC2",
          "C. Lambda, S3, and DynamoDB",
          "D. CloudFront, EC2, and Route 53",
        ],
        answer: "B",
        explanation:
          "B is correct: the 2006 public relaunch bundled SQS (message queues), S3 (object storage), and EC2 (compute). A is wrong because RDS came years later (2009). C is wrong: Lambda and DynamoDB are both post-2012. D mixes services that all launched later (CloudFront 2008, Route 53 2010).",
      },
    ],
  },

  {
    id: "global-infrastructure",
    title: "AWS Global Infrastructure — Regions, AZs, Edge",
    shortLabel: "Global Infrastructure",
    section: "Getting Started with AWS",
    domain: "Foundations",
    explanation:
      "AWS operates a global infrastructure made of Regions, Availability Zones (AZs), and Edge Locations. A Region is a physical geographic area like us-east-1 (N. Virginia) or eu-west-3 (Paris). Each Region contains at least 3 Availability Zones (typically 3, sometimes up to 6), and each AZ is one or more discrete data centers with redundant power, networking, and cooling — physically separated from the other AZs in the same Region (kilometers apart) so a single disaster cannot take them all out. AZs within a Region are connected by high-bandwidth, ultra-low-latency private fiber. Beyond Regions and AZs, AWS has 400+ Edge Locations (Points of Presence) used by services like CloudFront and Route 53 to cache content close to end users.",
    analogy:
      "Think of AWS like a global supermarket chain. A Region is a city where the company operates — say, New York. Inside that city it runs three separate warehouses (AZs) in different neighborhoods, each fully stocked and able to keep customers fed even if one burns down. Edge Locations are the corner pickup lockers scattered across the city so deliveries reach customers in minutes instead of hours.",
    diagram: `<svg viewBox="0 0 720 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="AWS region with three availability zones and edge locations">${svgDefs}
      <rect x="20" y="20" width="680" height="320" rx="10" fill="#1a2332" stroke="#ff9900" stroke-dasharray="6 4"/>
      <text x="40" y="48" fill="#ff9900" font-size="15" font-weight="700">AWS Region — us-east-1 (N. Virginia)</text>
      <g>
        <rect x="60" y="80" width="180" height="160" rx="8" fill="#243349" stroke="#2d3a4f"/>
        <text x="150" y="105" text-anchor="middle" fill="#ff9900" font-size="13" font-weight="600">AZ us-east-1a</text>
        <rect x="80" y="120" width="60" height="40" rx="4" fill="#0f1419" stroke="#3d4d68"/>
        <rect x="160" y="120" width="60" height="40" rx="4" fill="#0f1419" stroke="#3d4d68"/>
        <rect x="80" y="175" width="140" height="50" rx="4" fill="#0a0e14" stroke="#3d4d68"/>
        <text x="150" y="205" text-anchor="middle" fill="#8b949e" font-size="11">2+ data centers</text>
      </g>
      <g>
        <rect x="270" y="80" width="180" height="160" rx="8" fill="#243349" stroke="#2d3a4f"/>
        <text x="360" y="105" text-anchor="middle" fill="#ff9900" font-size="13" font-weight="600">AZ us-east-1b</text>
        <rect x="290" y="120" width="60" height="40" rx="4" fill="#0f1419" stroke="#3d4d68"/>
        <rect x="370" y="120" width="60" height="40" rx="4" fill="#0f1419" stroke="#3d4d68"/>
        <rect x="290" y="175" width="140" height="50" rx="4" fill="#0a0e14" stroke="#3d4d68"/>
        <text x="360" y="205" text-anchor="middle" fill="#8b949e" font-size="11">2+ data centers</text>
      </g>
      <g>
        <rect x="480" y="80" width="180" height="160" rx="8" fill="#243349" stroke="#2d3a4f"/>
        <text x="570" y="105" text-anchor="middle" fill="#ff9900" font-size="13" font-weight="600">AZ us-east-1c</text>
        <rect x="500" y="120" width="60" height="40" rx="4" fill="#0f1419" stroke="#3d4d68"/>
        <rect x="580" y="120" width="60" height="40" rx="4" fill="#0f1419" stroke="#3d4d68"/>
        <rect x="500" y="175" width="140" height="50" rx="4" fill="#0a0e14" stroke="#3d4d68"/>
        <text x="570" y="205" text-anchor="middle" fill="#8b949e" font-size="11">2+ data centers</text>
      </g>
      <line x1="240" y1="160" x2="270" y2="160" stroke="#ff9900" stroke-width="2"/>
      <line x1="450" y1="160" x2="480" y2="160" stroke="#ff9900" stroke-width="2"/>
      <text x="360" y="265" text-anchor="middle" fill="#b0bac6" font-size="12">Private fiber: high bandwidth, ultra-low latency between AZs</text>
      <rect x="40" y="285" width="640" height="40" rx="6" fill="#0a0e14" stroke="#2d3a4f"/>
      <text x="360" y="310" text-anchor="middle" fill="#8b949e" font-size="11">+ 400 Edge Locations globally (CloudFront, Route 53) — bring content closer to users</text>
    </svg>`,
    codeExample: {
      language: "bash",
      title: "List AZs in a region and inspect data residency",
      code: `# List all Availability Zones in the current region
aws ec2 describe-availability-zones \\
  --query "AvailabilityZones[].{Zone:ZoneName,State:State,ZoneId:ZoneId}" \\
  --output table

# Launch an EC2 instance pinned to a specific AZ
aws ec2 run-instances \\
  --image-id ami-0abcd1234efgh5678 \\
  --instance-type t3.micro \\
  --placement AvailabilityZone=us-east-1a \\
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=web-1}]'`,
    },
    problemStatement:
      "You are a solutions architect at a healthcare-tech company subject to HIPAA. The CIO wants the architecture to survive a full data-center outage and a regional natural disaster, while keeping all patient data inside the United States. Design the deployment footprint at the Region/AZ level and explain the minimum number of AZs and Regions required to meet both the durability and the data-residency requirements simultaneously.",
    questions: [
      {
        q: "What is the minimum number of Availability Zones in any AWS Region?",
        options: ["A. 1", "B. 2", "C. 3", "D. 6"],
        answer: "C",
        explanation:
          "C is correct: every AWS Region has a minimum of 3 AZs (max is 6). A and B are wrong; multi-AZ designs depend on having at least 3 independent zones. D is the maximum, not the minimum.",
      },
      {
        q: "A company must guarantee that customer data never leaves the EU for compliance reasons. Which AWS infrastructure concept enforces this?",
        options: [
          "A. Edge Locations",
          "B. AWS Regions",
          "C. Availability Zones",
          "D. Local Zones",
        ],
        answer: "B",
        explanation:
          "B is correct: data does not leave an AWS Region without your explicit permission, so choosing an EU Region (e.g. eu-west-1) keeps data inside the EU. A is wrong because Edge Locations cache content globally and aren't a data-residency boundary. C is a sub-unit of a Region — picking an AZ doesn't change the Region. D (Local Zones) extends a Region geographically but still belongs to the parent Region.",
      },
      {
        q: "Which AWS service relies most heavily on Edge Locations rather than Regional infrastructure?",
        options: [
          "A. Amazon RDS",
          "B. Amazon EC2",
          "C. Amazon CloudFront",
          "D. Amazon EBS",
        ],
        answer: "C",
        explanation:
          "C is correct: CloudFront is the global CDN that caches content at 400+ Edge Locations close to viewers. A (RDS) is regional and tied to AZs. B (EC2) instances run inside a specific AZ within a Region. D (EBS) volumes are AZ-locked block storage.",
      },
    ],
  },

  {
    id: "choosing-region",
    title: "How to Choose an AWS Region",
    shortLabel: "Choosing a Region",
    section: "Getting Started with AWS",
    domain: "Foundations",
    explanation:
      "Choosing the right Region is a foundational architectural decision driven by four factors. (1) Compliance and data governance — many laws (GDPR, HIPAA, China's data laws) require data to stay inside a specific jurisdiction. (2) Latency / proximity to customers — pick the Region geographically closest to your largest user base to reduce round-trip times. (3) Service availability — AWS rolls new services and features out region-by-region; not every Region has every service, so verify the Region table for the services you need. (4) Pricing — costs vary significantly by Region; us-east-1 (N. Virginia) is generally cheapest, while Brazil and some Asia-Pacific Regions cost more. Together these factors usually narrow the choice to one or two candidate Regions.",
    analogy:
      "Choosing a Region is like choosing where to open a restaurant. Local food-safety laws (compliance) determine where you're allowed to operate, foot traffic patterns (latency to customers) decide which neighborhood fills the seats, the local supplier network (service availability) decides what you can put on the menu, and rent + payroll (pricing) determines profitability. You don't just pick the prettiest spot — you balance all four.",
    diagram: `<svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Decision factors for choosing an AWS region">${svgDefs}
      <rect x="20" y="20" width="680" height="280" rx="10" fill="#1a2332" stroke="#2d3a4f"/>
      <text x="360" y="50" text-anchor="middle" fill="#ff9900" font-size="16" font-weight="700">Choosing an AWS Region</text>
      <g>
        <rect x="50" y="80" width="290" height="100" rx="8" fill="#243349" stroke="#ff9900"/>
        <text x="195" y="105" text-anchor="middle" fill="#e6edf3" font-size="13" font-weight="600">1. Compliance</text>
        <text x="195" y="130" text-anchor="middle" fill="#b0bac6" font-size="11">GDPR (EU)  ·  HIPAA (US)  ·  data residency</text>
        <text x="195" y="150" text-anchor="middle" fill="#8b949e" font-size="11">Data stays in-Region unless you replicate</text>
      </g>
      <g>
        <rect x="380" y="80" width="290" height="100" rx="8" fill="#243349" stroke="#ff9900"/>
        <text x="525" y="105" text-anchor="middle" fill="#e6edf3" font-size="13" font-weight="600">2. Latency / Proximity</text>
        <text x="525" y="130" text-anchor="middle" fill="#b0bac6" font-size="11">Closer Region  →  lower RTT for users</text>
        <text x="525" y="150" text-anchor="middle" fill="#8b949e" font-size="11">Tip: measure with cloudping.info / RIPE</text>
      </g>
      <g>
        <rect x="50" y="195" width="290" height="90" rx="8" fill="#243349" stroke="#ff9900"/>
        <text x="195" y="220" text-anchor="middle" fill="#e6edf3" font-size="13" font-weight="600">3. Service Availability</text>
        <text x="195" y="245" text-anchor="middle" fill="#b0bac6" font-size="11">New services launch in some Regions first</text>
        <text x="195" y="263" text-anchor="middle" fill="#8b949e" font-size="11">Check the Regional Services List</text>
      </g>
      <g>
        <rect x="380" y="195" width="290" height="90" rx="8" fill="#243349" stroke="#ff9900"/>
        <text x="525" y="220" text-anchor="middle" fill="#e6edf3" font-size="13" font-weight="600">4. Pricing</text>
        <text x="525" y="245" text-anchor="middle" fill="#b0bac6" font-size="11">us-east-1 cheapest  ·  sa-east-1 pricier</text>
        <text x="525" y="263" text-anchor="middle" fill="#8b949e" font-size="11">Transparent on each service's pricing page</text>
      </g>
    </svg>`,
    codeExample: {
      language: "bash",
      title: "Compare service availability and pricing across Regions",
      code: `# Check whether a service is available in a Region
aws ec2 describe-regions --query "Regions[?RegionName=='ap-east-1']"

# List which Regions offer Amazon Bedrock (region-by-region API check)
for r in us-east-1 us-west-2 eu-west-1 ap-southeast-1; do
  echo "Region: $r"
  aws bedrock list-foundation-models --region $r --query "modelSummaries[0]" 2>/dev/null \\
    && echo "  ✓ available" || echo "  ✗ not available"
done

# Programmatically compare EC2 on-demand pricing
aws pricing get-products --service-code AmazonEC2 \\
  --filters "Type=TERM_MATCH,Field=instanceType,Value=t3.micro" \\
            "Type=TERM_MATCH,Field=location,Value=US East (N. Virginia)" \\
  --region us-east-1 --max-results 1`,
    },
    problemStatement:
      "You are a solutions architect at a German fintech launching a new app. 80% of expected users are based in Germany and France. Customer financial records must remain inside the EU per GDPR, and you need access to AWS Lambda, SQS, and KMS. Pick a primary Region, justify the choice against all four selection factors, and identify one secondary EU Region you would use for cross-Region disaster recovery.",
    questions: [
      {
        q: "Which factor is NOT one of the primary considerations when choosing an AWS Region?",
        options: [
          "A. Compliance with data residency laws",
          "B. Proximity to end users",
          "C. The Region's IPv6 block size",
          "D. Pricing differences between Regions",
        ],
        answer: "C",
        explanation:
          "C is correct: AWS doesn't expose Region selection based on IPv6 block size — that's an implementation detail. A, B, and D are the canonical four factors (compliance, proximity/latency, service availability, pricing).",
      },
      {
        q: "A German healthcare app must keep patient data inside the EU. Which Region pair would BEST satisfy compliance plus disaster recovery?",
        options: [
          "A. eu-west-1 (Ireland) primary, us-east-1 (Virginia) DR",
          "B. eu-central-1 (Frankfurt) primary, eu-west-1 (Ireland) DR",
          "C. eu-central-1 (Frankfurt) primary, ap-southeast-2 (Sydney) DR",
          "D. us-east-1 (Virginia) primary, eu-west-3 (Paris) DR",
        ],
        answer: "B",
        explanation:
          "B is correct: both Regions are inside the EU, satisfying data-residency. A and C fail because the DR site is outside the EU. D fails because the primary is outside the EU — even if you replicate to Paris, you'd be storing data in Virginia first.",
      },
      {
        q: "Which AWS Region is generally the cheapest and the first to receive new service launches?",
        options: [
          "A. eu-west-1 (Ireland)",
          "B. ap-southeast-1 (Singapore)",
          "C. us-east-1 (N. Virginia)",
          "D. sa-east-1 (São Paulo)",
        ],
        answer: "C",
        explanation:
          "C is correct: us-east-1 is AWS's oldest and largest Region — it tends to have the lowest prices and is typically first to receive new services and features. A is mature and cheap-ish but trails us-east-1. B and D are noticeably more expensive due to local infrastructure and supply economics.",
      },
    ],
  },

  {
    id: "global-vs-regional-services",
    title: "Global vs Regional AWS Services",
    shortLabel: "Global vs Regional",
    section: "Getting Started with AWS",
    domain: "Foundations",
    explanation:
      "AWS services come in two scopes. **Global services** have a single, account-wide endpoint — examples include IAM (identity), Route 53 (DNS), CloudFront (CDN), and AWS WAF (web firewall). You don't pick a Region for them; their data and configuration apply everywhere. **Regional services** are scoped to one Region and the resources you create in us-east-1 are completely separate from resources in eu-west-3. The vast majority of services are regional: EC2, S3 (the bucket namespace is global but the data lives in one Region), Lambda, RDS, DynamoDB, VPC, EBS, EFS, and so on. Mixing the two correctly is a recurring exam topic: a CloudFront distribution (global) can serve content from an S3 bucket (regional), and an IAM role (global) is what an EC2 instance (regional) assumes to call AWS APIs.",
    analogy:
      "Think of your AWS account as a multinational company. Global services are like company-wide policies (HR rules, executive directives) that apply across every office. Regional services are like the local office staff and inventory in Tokyo — they only exist in Tokyo, and the Berlin office has its own separate set, even though both follow the same global HR policy.",
    diagram: `<svg viewBox="0 0 720 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Global versus regional services comparison">${svgDefs}
      <rect x="20" y="20" width="680" height="50" rx="8" fill="#243349" stroke="#ff9900"/>
      <text x="360" y="52" text-anchor="middle" fill="#ff9900" font-size="14" font-weight="700">GLOBAL services — one endpoint, account-wide</text>
      <g>
        <rect x="50" y="85" width="140" height="44" rx="6" fill="#1a2332" stroke="#3d4d68"/>
        <text x="120" y="112" text-anchor="middle" fill="#e6edf3" font-size="12">IAM</text>
        <rect x="210" y="85" width="140" height="44" rx="6" fill="#1a2332" stroke="#3d4d68"/>
        <text x="280" y="112" text-anchor="middle" fill="#e6edf3" font-size="12">Route 53</text>
        <rect x="370" y="85" width="140" height="44" rx="6" fill="#1a2332" stroke="#3d4d68"/>
        <text x="440" y="112" text-anchor="middle" fill="#e6edf3" font-size="12">CloudFront</text>
        <rect x="530" y="85" width="140" height="44" rx="6" fill="#1a2332" stroke="#3d4d68"/>
        <text x="600" y="112" text-anchor="middle" fill="#e6edf3" font-size="12">WAF</text>
      </g>
      <rect x="20" y="160" width="680" height="160" rx="8" fill="#1a2332" stroke="#2d3a4f" stroke-dasharray="4 4"/>
      <text x="360" y="184" text-anchor="middle" fill="#b0bac6" font-size="13" font-weight="600">REGIONAL services — scoped to one Region</text>
      <g>
        <rect x="40" y="200" width="200" height="100" rx="6" fill="#243349" stroke="#3d4d68"/>
        <text x="140" y="222" text-anchor="middle" fill="#ff9900" font-size="12" font-weight="600">us-east-1</text>
        <text x="140" y="245" text-anchor="middle" fill="#e6edf3" font-size="11">EC2 · S3 · Lambda</text>
        <text x="140" y="265" text-anchor="middle" fill="#e6edf3" font-size="11">RDS · VPC · EBS</text>
        <text x="140" y="285" text-anchor="middle" fill="#8b949e" font-size="10">resources exist only here</text>
      </g>
      <g>
        <rect x="260" y="200" width="200" height="100" rx="6" fill="#243349" stroke="#3d4d68"/>
        <text x="360" y="222" text-anchor="middle" fill="#ff9900" font-size="12" font-weight="600">eu-west-3 (Paris)</text>
        <text x="360" y="245" text-anchor="middle" fill="#e6edf3" font-size="11">EC2 · S3 · Lambda</text>
        <text x="360" y="265" text-anchor="middle" fill="#e6edf3" font-size="11">RDS · VPC · EBS</text>
        <text x="360" y="285" text-anchor="middle" fill="#8b949e" font-size="10">independent of us-east-1</text>
      </g>
      <g>
        <rect x="480" y="200" width="200" height="100" rx="6" fill="#243349" stroke="#3d4d68"/>
        <text x="580" y="222" text-anchor="middle" fill="#ff9900" font-size="12" font-weight="600">ap-southeast-2</text>
        <text x="580" y="245" text-anchor="middle" fill="#e6edf3" font-size="11">EC2 · S3 · Lambda</text>
        <text x="580" y="265" text-anchor="middle" fill="#e6edf3" font-size="11">RDS · VPC · EBS</text>
        <text x="580" y="285" text-anchor="middle" fill="#8b949e" font-size="10">independent of others</text>
      </g>
    </svg>`,
    codeExample: {
      language: "bash",
      title: "Global vs Regional service endpoints",
      code: `# IAM is GLOBAL — note: the --region flag is ignored
aws iam list-users               # works
aws iam list-users --region eu-west-3   # same result; --region is a no-op for IAM

# EC2 is REGIONAL — you MUST specify which Region you mean
aws ec2 describe-instances --region us-east-1
aws ec2 describe-instances --region eu-west-3
# (these return DIFFERENT instances)

# Route 53 is GLOBAL — hosted zones have no Region
aws route53 list-hosted-zones

# CloudFront is GLOBAL — distributions live at the edge
aws cloudfront list-distributions`,
    },
    problemStatement:
      "You are a solutions architect at an e-commerce company expanding from the US to Europe. The CTO asks: 'Why are my new European IAM users showing up in the US Region too? Did we misconfigure something?' Explain the difference between global and regional services, list which AWS services are global, and describe how a CloudFront distribution can serve content from an S3 bucket in a single regional Bucket while still being available worldwide.",
    questions: [
      {
        q: "Which of the following AWS services is GLOBAL (i.e. not tied to a single Region)?",
        options: [
          "A. Amazon EC2",
          "B. AWS IAM",
          "C. Amazon RDS",
          "D. Amazon EBS",
        ],
        answer: "B",
        explanation:
          "B is correct: IAM users, groups, roles, and policies are global to the AWS account. A (EC2), C (RDS), and D (EBS) are all regional — resources in one Region are invisible to another.",
      },
      {
        q: "A solutions architect creates an S3 bucket in eu-west-1 and an IAM role in the same account. Which statement is TRUE?",
        options: [
          "A. The S3 bucket and the IAM role are both regional, scoped to eu-west-1.",
          "B. The IAM role is global; the S3 bucket exists in eu-west-1 but the bucket name itself is in a global namespace.",
          "C. Both are global services; data lives wherever AWS chooses.",
          "D. The IAM role must be re-created in every Region you wish to use it.",
        ],
        answer: "B",
        explanation:
          "B is correct: IAM is global, so the role works from any Region. S3 buckets store data in one Region (eu-west-1 here) but bucket names must be globally unique — that's why B's wording is precise. A is wrong: IAM is global, not regional. C is wrong: S3 data is pinned to its bucket's Region. D is wrong: an IAM role is created once and used everywhere.",
      },
      {
        q: "A team deploys CloudFront in front of an Application Load Balancer in us-east-1. A user in Sydney browses the site. Which architectural property of CloudFront makes this fast?",
        options: [
          "A. CloudFront automatically creates an ALB in Sydney.",
          "B. CloudFront is regional but replicates the ALB's IP to all Regions.",
          "C. CloudFront is a global service that caches and serves responses from the Edge Location nearest the user.",
          "D. CloudFront re-routes the request to a Local Zone in Sydney that hosts a copy of the application.",
        ],
        answer: "C",
        explanation:
          "C is correct: CloudFront is a global service with 400+ Edge Locations that cache content close to viewers, dramatically reducing latency. A is wrong: CloudFront does not create ALBs. B is wrong: CloudFront isn't regional and doesn't replicate ALBs. D is wrong: Local Zones are an extension of a parent Region, not what CloudFront uses for caching.",
      },
    ],
  },

  // =================================================================
  // SECTION 2: IAM
  // =================================================================
  {
    id: "iam-users-groups",
    title: "IAM Users & Groups",
    shortLabel: "Users & Groups",
    section: "IAM — Identity & Access Management",
    domain: "Identity",
    explanation:
      "IAM (Identity and Access Management) is a global AWS service that controls who can do what in your account. When you first create an AWS account you get a root account — an all-powerful identity that should be used only for initial setup, then locked away with MFA. For day-to-day work you create IAM users, one per physical person. Users can be organized into groups (e.g. Developers, Operations, Audit Team), and groups can only contain users — never other groups. A user does not have to belong to any group and can belong to multiple groups simultaneously. Permissions are assigned to groups (preferred) or directly to users via JSON documents called policies. The pattern of placing users into groups and attaching policies to groups is the foundation of scalable AWS access management.",
    analogy:
      "Think of an IAM user as an employee badge, and an IAM group as a department badge-reader. Putting a user in the Developers group is like giving an employee the Developers door pass — they immediately get every permission attached to that group. If you add a new permission to the Developers group, every developer instantly gets it. The root account is the building owner's master key: you have it, but you keep it locked in a safe and don't carry it around.",
    diagram: `<svg viewBox="0 0 720 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="IAM users and groups membership diagram">${svgDefs}
      <rect x="20" y="20" width="680" height="300" rx="10" fill="#1a2332" stroke="#2d3a4f"/>
      <text x="360" y="48" text-anchor="middle" fill="#ff9900" font-size="16" font-weight="700">IAM Users &amp; Groups</text>
      <rect x="50" y="75" width="200" height="100" rx="8" fill="#243349" stroke="#3b82f6"/>
      <text x="150" y="100" text-anchor="middle" fill="#3b82f6" font-size="12" font-weight="600">Group: Developers</text>
      <circle cx="90" cy="135" r="14" fill="#1a2332" stroke="#e6edf3"/>
      <text x="90" y="158" text-anchor="middle" fill="#e6edf3" font-size="10">Alice</text>
      <circle cx="150" cy="135" r="14" fill="#1a2332" stroke="#e6edf3"/>
      <text x="150" y="158" text-anchor="middle" fill="#e6edf3" font-size="10">Bob</text>
      <circle cx="210" cy="135" r="14" fill="#1a2332" stroke="#e6edf3"/>
      <text x="210" y="158" text-anchor="middle" fill="#e6edf3" font-size="10">Charles</text>
      <rect x="270" y="75" width="180" height="100" rx="8" fill="#243349" stroke="#10b981"/>
      <text x="360" y="100" text-anchor="middle" fill="#10b981" font-size="12" font-weight="600">Group: Audit Team</text>
      <circle cx="320" cy="135" r="14" fill="#1a2332" stroke="#e6edf3"/>
      <text x="320" y="158" text-anchor="middle" fill="#e6edf3" font-size="10">Charles</text>
      <circle cx="380" cy="135" r="14" fill="#1a2332" stroke="#e6edf3"/>
      <text x="380" y="158" text-anchor="middle" fill="#e6edf3" font-size="10">David</text>
      <rect x="470" y="75" width="200" height="100" rx="8" fill="#243349" stroke="#f59e0b"/>
      <text x="570" y="100" text-anchor="middle" fill="#f59e0b" font-size="12" font-weight="600">Group: Operations</text>
      <circle cx="510" cy="135" r="14" fill="#1a2332" stroke="#e6edf3"/>
      <text x="510" y="158" text-anchor="middle" fill="#e6edf3" font-size="10">David</text>
      <circle cx="570" cy="135" r="14" fill="#1a2332" stroke="#e6edf3"/>
      <text x="570" y="158" text-anchor="middle" fill="#e6edf3" font-size="10">Edward</text>
      <circle cx="630" cy="135" r="14" fill="#1a2332" stroke="#e6edf3"/>
      <text x="630" y="158" text-anchor="middle" fill="#e6edf3" font-size="10">Fred</text>
      <g>
        <circle cx="360" cy="240" r="22" fill="#1a2332" stroke="#ff9900" stroke-width="2"/>
        <text x="360" y="245" text-anchor="middle" fill="#e6edf3" font-size="11">Standalone</text>
        <text x="360" y="278" text-anchor="middle" fill="#8b949e" font-size="10">Fred (no group) — direct policy attached</text>
      </g>
      <text x="360" y="305" text-anchor="middle" fill="#b0bac6" font-size="11">Charles ∈ Developers ∩ Audit  ·  David ∈ Audit ∩ Operations  ·  groups cannot contain groups</text>
    </svg>`,
    codeExample: {
      language: "bash",
      title: "Create a group, add users, and attach a managed policy",
      code: `# 1. Create a group
aws iam create-group --group-name Developers

# 2. Create a user
aws iam create-user --user-name alice

# 3. Add the user to the group
aws iam add-user-to-group --user-name alice --group-name Developers

# 4. Attach an AWS-managed policy to the entire group
aws iam attach-group-policy \\
  --group-name Developers \\
  --policy-arn arn:aws:iam::aws:policy/PowerUserAccess

# 5. Verify
aws iam list-groups-for-user --user-name alice`,
    },
    problemStatement:
      "You are a solutions architect at a 50-person SaaS startup. The company currently has one shared root account login that 12 engineers use — a clear security risk. Design a least-privilege IAM structure: how many users, how many groups, and what membership model would you adopt? List two specific groups you'd create and the kinds of policies you'd attach to each. Explain why direct user-level policies should be avoided.",
    questions: [
      {
        q: "Which statement about IAM groups is TRUE?",
        options: [
          "A. A group can contain users and other groups.",
          "B. A user must belong to exactly one group.",
          "C. A group can contain only users, and a user may belong to multiple groups.",
          "D. Groups are region-specific resources.",
        ],
        answer: "C",
        explanation:
          "C is correct: groups hold only users (not nested groups), and a user can belong to many groups simultaneously. A is wrong because nested groups aren't supported. B is wrong: users may belong to zero, one, or many groups. D is wrong because IAM is global, not regional.",
      },
      {
        q: "A solutions architect needs to give the root account credentials to a contractor for one week. What is the BEST course of action?",
        options: [
          "A. Share the root credentials and rotate them when the contract ends.",
          "B. Create an IAM user with the needed permissions and remove it after the engagement; never share root.",
          "C. Add the contractor's email to the root account.",
          "D. Generate root access keys and email them encrypted.",
        ],
        answer: "B",
        explanation:
          "B is correct: the root account should never be shared. Create a scoped IAM user (or federate access) with only the permissions needed, then delete or disable when done. A and C violate AWS security best practice (and A and D risk leaking the credentials). D is also bad because root access keys are themselves discouraged.",
      },
      {
        q: "Which AWS resource is GLOBAL and managed via the IAM service?",
        options: [
          "A. An EC2 key pair",
          "B. An IAM user",
          "C. A VPC",
          "D. An EBS snapshot",
        ],
        answer: "B",
        explanation:
          "B is correct: IAM users (and groups, roles, and policies) are global to the AWS account. A (EC2 key pair) is regional. C (VPC) is regional. D (EBS snapshot) is regional, though it can be copied across Regions.",
      },
      {
        q: "A startup with 40 engineers has been sharing one IAM user named 'devops' with AdministratorAccess. After a near-incident, the CISO wants accountability for every API call. What is the BEST remediation?",
        options: [
          "A. Rotate the shared user's password monthly and enable MFA on it.",
          "B. Create one IAM user per engineer, place them in role-based groups, and remove the shared user.",
          "C. Switch the shared user to a managed read-only policy.",
          "D. Restrict the shared user's IP range to the office network.",
        ],
        answer: "B",
        explanation:
          "B is correct: only individual identities give CloudTrail accountability. Shared users obscure who actually did what. A keeps the anti-pattern intact. C reduces blast radius but still hides identity. D is an access control, not an identity fix.",
      },
      {
        q: "A solutions architect must give a contractor temporary access for a 2-week engagement. Which approach BEST follows AWS security best practice?",
        options: [
          "A. Share the root account credentials and rotate after the engagement.",
          "B. Create an IAM user with scoped permissions, set credential expiration in 14 days, and delete the user when done.",
          "C. Add the contractor's email to the AWS account's root login.",
          "D. Give the contractor an EC2 instance with the root account's access keys.",
        ],
        answer: "B",
        explanation:
          "B is correct: a scoped, time-bound IAM user is the canonical pattern for contractors. A is the worst possible answer — never share root. C is invented. D combines two anti-patterns.",
      },
      {
        q: "A company acquires another AWS-using firm and inherits 800 IAM users with no group structure — every user has policies attached directly. What's the BEST first cleanup step?",
        options: [
          "A. Delete all users and force re-onboarding.",
          "B. Discover common permission patterns (using IAM Access Advisor), define role-based groups, then migrate users into groups and remove direct policies.",
          "C. Migrate every user to a single 'all-staff' group with PowerUserAccess.",
          "D. Move all users into the root account.",
        ],
        answer: "B",
        explanation:
          "B is correct: identify the existing access patterns, design groups around them, and switch to group-level policies — that's the only sustainable path. A destroys productivity. C violates least privilege spectacularly. D is nonsense — root accounts cannot 'contain' users.",
      },
      {
        q: "A regulated bank requires segregation of duties: developers must not have access to production logs, and the audit team must have read-only access everywhere. How would you BEST structure IAM?",
        options: [
          "A. One group 'Everyone' with AdministratorAccess and trust developers to behave.",
          "B. Two groups: 'Developers' with dev-only permissions and 'Auditors' with cross-account ReadOnlyAccess; deny dev access to prod log streams.",
          "C. Give each user inline policies and skip groups.",
          "D. Use only the root account and trust the principle of least surprise.",
        ],
        answer: "B",
        explanation:
          "B is correct: separating users into role-based groups with explicit deny/allow boundaries is the textbook segregation-of-duties pattern. A is the opposite of segregation. C scales badly. D is dangerously wrong.",
      },
      {
        q: "A multi-team organization needs strong isolation between Dev, Staging, and Prod environments — including blast-radius isolation if one account is compromised. Which is the BEST approach?",
        options: [
          "A. Use one AWS account and put each environment in its own IAM group.",
          "B. Use separate AWS accounts (managed by AWS Organizations) for Dev, Staging, and Prod, with IAM groups inside each.",
          "C. Use one IAM user per environment and share it across the team.",
          "D. Use one VPC per environment but keep everything in a single account.",
        ],
        answer: "B",
        explanation:
          "B is correct: AWS Organizations + separate accounts give the strongest isolation — IAM is per-account, billing is per-account, and a compromise in dev cannot reach prod. A puts all eggs in one blast radius. C is the shared-user anti-pattern. D isolates network but not identity or billing.",
      },
      {
        q: "What is the maximum number of IAM groups a single user can belong to by default?",
        options: ["A. 1", "B. 5", "C. 10", "D. unlimited"],
        answer: "C",
        explanation:
          "C is correct: a single IAM user can be a member of up to 10 IAM groups by default (this is a hard quota, but you can request an increase). A and B are incorrect lower numbers. D is wrong — the limit is real.",
      },
      {
        q: "Can an IAM group contain another IAM group as a member?",
        options: [
          "A. Yes — nested groups are supported up to 5 levels deep.",
          "B. Yes — but only in AWS Organizations.",
          "C. No — IAM groups can only contain users.",
          "D. Yes — using a special 'GroupOfGroups' resource.",
        ],
        answer: "C",
        explanation:
          "C is correct: IAM groups can contain only users, never other groups. A, B, and D are all invented behaviors.",
      },
      {
        q: "In which AWS Region is IAM data physically stored?",
        options: [
          "A. us-east-1, with replication to all other Regions",
          "B. The Region where the AWS account was created",
          "C. IAM is a global service — it has no Region-bound storage from the customer's perspective",
          "D. The Region currently selected in the AWS Console",
        ],
        answer: "C",
        explanation:
          "C is correct: IAM is global. Users, groups, roles, and policies are not regional resources. A and B are misleading — IAM endpoints are at us-east-1 historically but the service is presented as global. D confuses the Console UX with IAM scope.",
      },
      {
        q: "A solutions architect wants to allow Alice (a developer) to manage EC2 instances in the dev VPC but not in production. The instances are tagged Environment=dev or Environment=prod. Which IAM pattern is BEST?",
        options: [
          "A. Two separate IAM users for Alice (one for dev, one for prod).",
          "B. A policy with a Condition matching aws:ResourceTag/Environment = dev, attached to a 'Developers' group containing Alice.",
          "C. Give Alice AdministratorAccess and ask her to only touch dev.",
          "D. Put Alice in the root account.",
        ],
        answer: "B",
        explanation:
          "B is correct: tag-based access control with a Condition is the canonical pattern for environment scoping. A is operational overhead with no security gain. C is the opposite of least privilege. D is dangerously wrong (root cannot 'contain' users anyway).",
      },
      {
        q: "Which statement about the root account is TRUE?",
        options: [
          "A. The root account can be safely deleted once IAM users exist.",
          "B. The root account is the only identity that can close the AWS account, change billing contact, and perform a small set of restricted actions.",
          "C. The root account is automatically restricted to read-only mode after 30 days.",
          "D. The root account is shared with AWS Support by default.",
        ],
        answer: "B",
        explanation:
          "B is correct: certain account-level tasks (close account, change support plan, modify root email, register as a seller in Marketplace, restore IAM user permissions to access billing) can ONLY be done by root. A is wrong: root cannot be deleted as long as the AWS account exists. C is invented. D is alarming nonsense.",
      },
      {
        q: "An IAM user has TWO sets of attached permissions: one via a group ('Developers' allowing s3:*) and one inline policy (explicitly denying s3:DeleteBucket). What happens when the user calls s3:DeleteBucket?",
        options: [
          "A. The call succeeds — group permissions take precedence over inline.",
          "B. The call fails — an explicit Deny in any attached policy overrides any Allow.",
          "C. The call returns a 'partial deny' status.",
          "D. The call randomly succeeds or fails depending on Region.",
        ],
        answer: "B",
        explanation:
          "B is correct: in IAM evaluation, an explicit Deny always wins, no matter which policy source granted it. A reverses the precedence. C and D are invented.",
      },
      {
        q: "A user is deleted from IAM. What happens to the EC2 instances, S3 buckets, and other AWS resources that user created?",
        options: [
          "A. All resources owned by the user are deleted.",
          "B. The resources continue to exist — they belong to the AWS account, not the user — but the user's API keys and console access are gone.",
          "C. The resources are transferred to the root account's ownership.",
          "D. AWS suspends the resources for 30 days, then deletes them.",
        ],
        answer: "B",
        explanation:
          "B is correct: AWS resources are owned by the account, not the IAM user. Deleting the user revokes their credentials but leaves resources untouched. A is the kind of mistake that scares operators into hoarding stale users. C and D are invented.",
      },
      {
        q: "An ops team's set of shared bash scripts authenticates using ONE user's access keys hard-coded in the repo. Two engineers have left the company in the past 6 months. Which is the BEST single-step remediation?",
        options: [
          "A. Rotate the shared user's password.",
          "B. Refactor the scripts to assume an IAM role (via STS) so no long-lived keys live in git; delete the access keys.",
          "C. Encrypt the access keys with KMS but keep them in the repo.",
          "D. Move the repo to a private GitHub organization.",
        ],
        answer: "B",
        explanation:
          "B is correct: short-lived role credentials via STS eliminate the long-lived secret entirely. A doesn't address the access keys problem. C is security theater — anyone with repo access still has the encrypted blob and likely the KMS access. D doesn't help if any of the engineers left with their git access intact.",
      },
      {
        q: "Two IAM users in the SAME AWS account need to authenticate to the API. Can they share the same access key ID?",
        options: [
          "A. Yes — multiple users can share an access key.",
          "B. No — each access key ID maps to exactly one IAM identity (user or role).",
          "C. Yes, but only if MFA is enabled.",
          "D. Only within an AWS Organizations OU.",
        ],
        answer: "B",
        explanation:
          "B is correct: each access key ID is unique to one IAM identity. A is the shared-credentials anti-pattern, and AWS doesn't permit it at the API level anyway. C and D invent rules that don't exist.",
      },
      {
        q: "A company-wide policy now requires MFA on every IAM user. An engineer points out that simply asking users to enable MFA hasn't worked. Which is the BEST enforcement mechanism?",
        options: [
          "A. Email reminders.",
          "B. An identity-based policy (attached to all users via a group) that denies most actions when aws:MultiFactorAuthPresent is false.",
          "C. Delete users who haven't enabled MFA.",
          "D. Move all users to the root account temporarily.",
        ],
        answer: "B",
        explanation:
          "B is correct: a deny-without-MFA policy attached to the 'AllUsers' group is the standard enforcement pattern (allow only iam:ChangePassword / iam:EnableMFADevice when MFA is absent, deny everything else). A doesn't enforce anything. C is hostile and unnecessary. D is nonsense.",
      },
      {
        q: "A user belongs to two groups: 'A' (which Allows ec2:StartInstances) and 'B' (which has no opinion on EC2). The user has no inline policies. Can the user start EC2 instances?",
        options: [
          "A. No — both groups must explicitly Allow the action.",
          "B. Yes — IAM evaluates the union of all policies; one Allow with no explicit Deny is sufficient.",
          "C. Only if the user is also in a third 'EC2-Admin' group.",
          "D. Only after MFA is enabled.",
        ],
        answer: "B",
        explanation:
          "B is correct: IAM evaluates the union of attached policies. A is wrong — Allow doesn't require unanimity. C invents an extra rule. D is unrelated unless a policy specifically requires MFA.",
      },
    ],
  },

  {
    id: "iam-permissions-policies",
    title: "IAM Permissions & Policies",
    shortLabel: "Permissions & Policies",
    section: "IAM — Identity & Access Management",
    domain: "Identity",
    explanation:
      "Permissions in IAM are granted via policies — JSON documents that explicitly allow (or deny) specific API actions on specific resources. A user, group, or role can have one or more policies attached. AWS evaluates the union of all attached policies when an API call is made: if any statement matches with an Allow and none with an explicit Deny, the call succeeds. The cardinal rule is least privilege: grant only the permissions a principal genuinely needs, no more. Overly broad policies (e.g. `\"Action\": \"*\"`) are the most common cause of cloud security incidents. AWS provides hundreds of pre-built AWS-managed policies (like ReadOnlyAccess), and you can also write your own customer-managed policies for fine-grained control.",
    analogy:
      "An IAM policy is like a written permit. A driver's permit says 'You may drive cars under 3,500kg on public roads in California' — that's an Allow with specific Actions (drive), Resources (cars under 3,500kg), and Conditions (on public roads, in California). The least-privilege principle is your DMV refusing to issue a Class A commercial license to someone who just wants to commute to work.",
    diagram: `<svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="IAM policy evaluation diagram">${svgDefs}
      <rect x="20" y="20" width="680" height="280" rx="10" fill="#1a2332" stroke="#2d3a4f"/>
      <text x="360" y="48" text-anchor="middle" fill="#ff9900" font-size="16" font-weight="700">IAM Policy Evaluation Flow</text>
      <g>
        <circle cx="80" cy="160" r="30" fill="#243349" stroke="#3b82f6"/>
        <text x="80" y="164" text-anchor="middle" fill="#e6edf3" font-size="11">User</text>
        <text x="80" y="205" text-anchor="middle" fill="#8b949e" font-size="10">Alice</text>
      </g>
      <line x1="115" y1="160" x2="170" y2="160" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <g>
        <rect x="175" y="110" width="170" height="100" rx="8" fill="#243349" stroke="#ff9900"/>
        <text x="260" y="135" text-anchor="middle" fill="#ff9900" font-size="12" font-weight="600">Attached Policies</text>
        <text x="260" y="158" text-anchor="middle" fill="#e6edf3" font-size="10">PowerUserAccess</text>
        <text x="260" y="175" text-anchor="middle" fill="#e6edf3" font-size="10">+ inline: deny s3 delete</text>
        <text x="260" y="195" text-anchor="middle" fill="#8b949e" font-size="10">union evaluated</text>
      </g>
      <line x1="345" y1="160" x2="400" y2="160" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <g>
        <rect x="405" y="110" width="180" height="100" rx="8" fill="#243349" stroke="#3d4d68"/>
        <text x="495" y="135" text-anchor="middle" fill="#e6edf3" font-size="12" font-weight="600">Decision</text>
        <text x="495" y="160" text-anchor="middle" fill="#10b981" font-size="11">explicit Allow + no Deny</text>
        <text x="495" y="178" text-anchor="middle" fill="#e6edf3" font-size="10">→ Allow</text>
        <text x="495" y="196" text-anchor="middle" fill="#ef4444" font-size="10">any Deny → Deny (wins)</text>
      </g>
      <line x1="585" y1="160" x2="640" y2="160" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <g>
        <rect x="620" y="135" width="60" height="50" rx="6" fill="#243349" stroke="#10b981"/>
        <text x="650" y="165" text-anchor="middle" fill="#e6edf3" font-size="11">AWS API</text>
      </g>
      <text x="360" y="265" text-anchor="middle" fill="#b0bac6" font-size="11">Default: implicit Deny  ·  Explicit Deny &gt; Allow  ·  Least Privilege wins</text>
    </svg>`,
    codeExample: {
      language: "json",
      title: "Read-only EC2 + ELB + CloudWatch policy",
      code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "ec2:Describe*",
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": "elasticloadbalancing:Describe*",
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudwatch:ListMetrics",
        "cloudwatch:GetMetricStatistics",
        "cloudwatch:Describe*"
      ],
      "Resource": "*"
    }
  ]
}`,
    },
    problemStatement:
      "You are a solutions architect at a media company. A new data-science team needs read-only access to all S3 buckets and the ability to start/stop their own EC2 instances — but NOT touch production EC2 instances tagged `Environment=prod`. Write a one-paragraph plan describing the policy structure (managed vs inline, group vs user) and the IAM Condition you would use to scope EC2 actions away from production instances.",
    questions: [
      {
        q: "An IAM user has a group policy that Allows `s3:*` and an inline policy that Denies `s3:DeleteObject`. The user attempts to delete an S3 object. What happens?",
        options: [
          "A. The delete succeeds because the group policy allows all S3 actions.",
          "B. The delete fails because an explicit Deny always overrides any Allow.",
          "C. The delete succeeds because inline policies don't apply to group-inherited permissions.",
          "D. The action results in a 403 Forbidden, but only intermittently depending on the Region.",
        ],
        answer: "B",
        explanation:
          "B is correct: in IAM evaluation, an explicit Deny always wins over any Allow, regardless of which policy granted it. A misunderstands the precedence rule. C is wrong: inline policies and managed policies are evaluated together as a union. D invents non-existent regional behavior.",
      },
      {
        q: "Which principle is at the heart of writing AWS IAM policies?",
        options: [
          "A. Open by default, close on demand",
          "B. Least privilege — grant only the permissions a principal needs",
          "C. Region replication — copy policies to every Region",
          "D. Implicit Allow — actions succeed unless an explicit Deny appears",
        ],
        answer: "B",
        explanation:
          "B is correct: least privilege is the foundation of IAM. A is the opposite of best practice. C invents a non-existent concept (IAM is global). D inverts AWS's evaluation logic — actions are implicitly DENIED unless an explicit Allow grants them.",
      },
      {
        q: "A company wants its developers to be able to start/stop ONLY EC2 instances tagged `Environment=dev`. Which IAM policy feature enables this?",
        options: [
          "A. The `Sid` element",
          "B. The `Resource` element with a wildcard ARN",
          "C. The `Condition` element matching `aws:ResourceTag/Environment`",
          "D. Attaching the policy to a Region-specific group",
        ],
        answer: "C",
        explanation:
          "C is correct: the Condition element with `aws:ResourceTag/Environment` lets you scope an Action to resources carrying a specific tag value — the canonical pattern for tag-based access control. A (`Sid`) is just a human-readable statement ID. B alone can't filter by tag (a wildcard ARN matches everything). D is wrong: IAM groups aren't region-specific.",
      },
      {
        q: "A solutions architect notices that ten different IAM users each have the same long inline policy attached. What is the BEST refactor?",
        options: [
          "A. Copy the inline policy to each new user as they're created.",
          "B. Convert the policy to an AWS-managed policy.",
          "C. Convert the policy to a customer-managed policy, then attach it to a single group containing all ten users.",
          "D. Move all ten users into the root account.",
        ],
        answer: "C",
        explanation:
          "C is correct: customer-managed policies are versioned, reusable, and attaching one to a group avoids per-user duplication. A scales poorly. B is wrong — you cannot create AWS-managed policies; those are published by AWS. D is dangerous and impossible (root can't 'contain' users).",
      },
      {
        q: "An S3 bucket policy ALLOWS `s3:GetObject` for everyone. The bucket owner's IAM policy DENIES `s3:GetObject`. The IAM user attempts to GET an object. What happens?",
        options: [
          "A. Access is allowed because the resource-based policy permits it.",
          "B. Access is denied — an explicit Deny in any policy (identity-based or resource-based) always wins.",
          "C. Access is allowed only if MFA is enabled.",
          "D. The two policies cancel each other out and the user gets a 'partial deny' error.",
        ],
        answer: "B",
        explanation:
          "B is correct: explicit Deny always wins regardless of which policy source contains it. A is the common student mistake — it ignores the Deny. C and D invent behavior.",
      },
      {
        q: "An SCP (Service Control Policy) in AWS Organizations DENIES `ec2:RunInstances`. An IAM user in the affected account has an attached policy ALLOWING `ec2:RunInstances`. What happens?",
        options: [
          "A. The user CAN run instances — IAM policy overrides SCP.",
          "B. The user CANNOT run instances — SCP sets a permissions boundary; IAM cannot grant more than SCP allows.",
          "C. The user must enable MFA, then it works.",
          "D. The IAM policy is silently disabled.",
        ],
        answer: "B",
        explanation:
          "B is correct: SCPs define the upper bound of what IAM policies in member accounts can permit. Even an Allow in IAM is blocked if SCP denies. A reverses the precedence. C and D invent behavior.",
      },
      {
        q: "What is the maximum size of a single customer-managed IAM policy document?",
        options: ["A. 1,024 characters", "B. 2,048 characters", "C. 6,144 characters", "D. 65,536 characters"],
        answer: "C",
        explanation:
          "C is correct: a customer-managed policy is capped at 6,144 characters (counted with whitespace trimmed). A, B, and D are incorrect. (Inline user policy: 2,048; inline group: 5,120; inline role: 10,240 — different limits.)",
      },
      {
        q: "Which of these statements does AWS's policy evaluation logic apply by DEFAULT when no statement matches a request?",
        options: ["A. Implicit Allow", "B. Implicit Deny", "C. Random selection", "D. The action is queued for review"],
        answer: "B",
        explanation:
          "B is correct: AWS uses implicit deny — actions are denied unless explicitly allowed by some policy. A reverses the rule. C and D are invented.",
      },
      {
        q: "A solutions architect wants to ENSURE that no IAM principal in an account can ever escalate to grant themselves a powerful policy. Which feature is BEST suited for this?",
        options: [
          "A. Strong password policy",
          "B. IAM Permissions Boundary applied to all principals",
          "C. Region-locking via SCP",
          "D. Disabling root account login",
        ],
        answer: "B",
        explanation:
          "B is correct: a Permissions Boundary on a user or role caps the maximum permissions it can ever have, even if it attaches a more-permissive policy to itself. A doesn't address privilege escalation. C and D address different problems.",
      },
      {
        q: "An IAM policy with `Resource: \"*\"` and `Action: \"s3:*\"` is attached to a junior engineer's user. What's the issue?",
        options: [
          "A. It's perfect — broad permissions reduce ticket queue.",
          "B. It violates least privilege: a junior should have scoped Resource ARNs and a minimal set of Actions.",
          "C. AWS will reject this policy.",
          "D. S3 wildcards require explicit Deny statements to function.",
        ],
        answer: "B",
        explanation:
          "B is correct: granting `s3:*` on `*` is the classic least-privilege violation. A is the wrong mindset. C is wrong — AWS happily accepts overly-broad policies (which is why review tooling matters). D is invented.",
      },
      {
        q: "Which IAM policy element is REQUIRED in a resource-based policy (like an S3 bucket policy) but typically OMITTED in an identity-based policy?",
        options: ["A. Resource", "B. Action", "C. Principal", "D. Effect"],
        answer: "C",
        explanation:
          "C is correct: Principal names WHO the policy applies to — required in resource-based policies, implicit (= the identity it's attached to) in identity-based policies. A, B, and D appear in both.",
      },
      {
        q: "A company wants to grant Account B's IAM role read access to a bucket in Account A. Which is the canonical pattern?",
        options: [
          "A. Add an inline policy in Account A's IAM allowing Account B by name.",
          "B. Use a resource-based S3 bucket policy in Account A that specifies Account B's IAM role ARN as the Principal — AND grant the role in Account B permission to perform the action.",
          "C. Make the bucket public.",
          "D. Move the bucket to Account B.",
        ],
        answer: "B",
        explanation:
          "B is correct: cross-account access requires BOTH a bucket policy in the resource account AND an IAM policy in the principal's account — the union of both must allow the action. A is half the answer (resource side missing). C is a security incident. D defeats the purpose.",
      },
      {
        q: "Which IAM policy permission must a user have to ASSIGN a role to a new EC2 instance at launch time?",
        options: ["A. ec2:RunInstances only", "B. iam:CreateRole", "C. iam:PassRole on the role being assigned", "D. iam:AssumeRole on the role"],
        answer: "C",
        explanation:
          "C is correct: `iam:PassRole` permits the user to hand a role to an AWS service. Without it, RunInstances with --iam-instance-profile fails. A is necessary but insufficient. B creates a new role, not assigns. D is what the EC2 service does at runtime, not what the user needs.",
      },
      {
        q: "Which two values are valid for the `Effect` field of an IAM policy statement?",
        options: ["A. Allow / Deny", "B. Grant / Revoke", "C. Yes / No", "D. Permit / Forbid"],
        answer: "A",
        explanation:
          "A is correct: only `Allow` and `Deny` are valid values. B, C, and D are all common-sense guesses but invalid.",
      },
      {
        q: "Can you EDIT an AWS-managed policy (e.g. `AmazonS3ReadOnlyAccess`)?",
        options: [
          "A. Yes — any IAM admin can.",
          "B. No — AWS manages the document; if you need a tweak, copy it and create a customer-managed policy.",
          "C. Only after enabling MFA.",
          "D. Only in the IAM Console, not via the CLI.",
        ],
        answer: "B",
        explanation:
          "B is correct: AWS-managed policies are read-only from your perspective; AWS updates them as services evolve. The standard pattern when you need a variant is to copy → modify → save as customer-managed. A, C, and D invent permissions that don't exist.",
      },
      {
        q: "How many versions of a customer-managed IAM policy does AWS retain?",
        options: ["A. 1 (the latest only)", "B. Up to 5 versions", "C. Up to 100 versions", "D. Unlimited"],
        answer: "B",
        explanation:
          "B is correct: AWS keeps up to 5 versions of a customer-managed policy; setting a new version requires deleting an older one when at the cap. A undercounts. C and D are invented.",
      },
      {
        q: "A startup wants to grant ALL IAM users read access to a specific S3 bucket but DENY any action whose source IP is outside the office network. Which TWO policy elements implement this?",
        options: [
          "A. `Action` and `Resource` only",
          "B. `Principal` and `Sid`",
          "C. `Allow` statement granting s3:GetObject + a `Condition` with `IpAddress` (or `NotIpAddress`)",
          "D. `Version` and `Id`",
        ],
        answer: "C",
        explanation:
          "C is correct: combine an Allow with a Condition referencing aws:SourceIp. A is incomplete (no IP filter). B is incomplete (Sid is just a label, Principal applies to resource-based policies). D are metadata-only fields.",
      },
      {
        q: "A solutions architect uses `NotAction` in a Deny statement, meaning 'deny everything EXCEPT these actions'. What is the risk?",
        options: [
          "A. None — it's the standard pattern.",
          "B. The implicit set of denied actions includes future AWS services not yet released; granting one of those by accident could allow undesired access.",
          "C. It only works on EC2 actions.",
          "D. NotAction is not a real IAM element.",
        ],
        answer: "B",
        explanation:
          "B is correct: NotAction is a powerful but risky pattern — every new AWS service is implicitly denied except whatever you listed, and if your intent flips (an Allow with NotAction), the inverse can over-grant. A is too sanguine. C is wrong. D is wrong (NotAction is real).",
      },
      {
        q: "Which of the following BEST describes the order in which AWS evaluates policies when a request is made?",
        options: [
          "A. Identity policies first, then resource policies, then deny anything not explicitly allowed.",
          "B. AWS gathers ALL applicable policies (identity, resource, SCP, permissions boundary, session), starts from default-deny, looks for any explicit Deny (which wins), then looks for an Allow.",
          "C. SCP first, then IAM, ignoring resource-based policies.",
          "D. Random order — final result depends on Region.",
        ],
        answer: "B",
        explanation:
          "B is correct: that's the canonical AWS evaluation logic — default-deny, any explicit Deny wins, then an Allow must exist in the union of applicable policies. A is half-right. C ignores resource-based policies. D is wrong.",
      },
    ],
  },

  {
    id: "iam-policy-structure",
    title: "IAM Policy Structure (JSON)",
    shortLabel: "Policy Structure",
    section: "IAM — Identity & Access Management",
    domain: "Identity",
    explanation:
      "Every IAM policy is a JSON document with a fixed structure. At the top level, the **Version** field locks the policy language (always use \"2012-10-17\"), and the optional **Id** uniquely names the document. The required **Statement** array holds one or more statements, each with: **Sid** (optional human-readable label), **Effect** (Allow or Deny), **Principal** (who the statement applies to — used in resource-based policies like S3 bucket policies), **Action** (the API operations covered, e.g. `s3:GetObject`), **Resource** (the ARNs the actions can target), and an optional **Condition** block for runtime filters like source IP, MFA presence, or tag matches. Mastering this structure is essential because the exam tests you on reading and reasoning about policy JSON constantly.",
    analogy:
      "An IAM policy is like a notarized legal contract. The Version is the signing date that fixes which interpretation rules apply. The Statement is the clause list. Each clause says: who (Principal), can or cannot (Effect), do what (Action), to what (Resource), under what circumstances (Condition). The Sid is the clause heading — purely for the lawyers reading it.",
    diagram: `<svg viewBox="0 0 720 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="IAM policy JSON structure breakdown">${svgDefs}
      <rect x="20" y="20" width="680" height="320" rx="10" fill="#0a0e14" stroke="#2d3a4f"/>
      <text x="40" y="50" fill="#ff9900" font-family="monospace" font-size="13">{</text>
      <text x="60" y="72" fill="#ff9900" font-family="monospace" font-size="13">"Version":</text>
      <text x="160" y="72" fill="#a5d6ff" font-family="monospace" font-size="13">"2012-10-17"</text>
      <text x="260" y="72" fill="#8b949e" font-family="monospace" font-size="11">← policy language version</text>
      <text x="60" y="94" fill="#ff9900" font-family="monospace" font-size="13">"Id":</text>
      <text x="110" y="94" fill="#a5d6ff" font-family="monospace" font-size="13">"S3-RW-Policy",</text>
      <text x="260" y="94" fill="#8b949e" font-family="monospace" font-size="11">← optional identifier</text>
      <text x="60" y="116" fill="#ff9900" font-family="monospace" font-size="13">"Statement": [</text>
      <text x="80" y="138" fill="#ff9900" font-family="monospace" font-size="13">{</text>
      <text x="100" y="160" fill="#ff9900" font-family="monospace" font-size="13">"Sid":</text>
      <text x="155" y="160" fill="#a5d6ff" font-family="monospace" font-size="13">"AllowRead",</text>
      <text x="260" y="160" fill="#8b949e" font-family="monospace" font-size="11">← human-readable label</text>
      <text x="100" y="182" fill="#ff9900" font-family="monospace" font-size="13">"Effect":</text>
      <text x="180" y="182" fill="#10b981" font-family="monospace" font-size="13">"Allow",</text>
      <text x="260" y="182" fill="#8b949e" font-family="monospace" font-size="11">← Allow or Deny</text>
      <text x="100" y="204" fill="#ff9900" font-family="monospace" font-size="13">"Principal":</text>
      <text x="200" y="204" fill="#a5d6ff" font-family="monospace" font-size="13">{ "AWS": "..." },</text>
      <text x="335" y="204" fill="#8b949e" font-family="monospace" font-size="11">← who (resource-based policies)</text>
      <text x="100" y="226" fill="#ff9900" font-family="monospace" font-size="13">"Action":</text>
      <text x="180" y="226" fill="#a5d6ff" font-family="monospace" font-size="13">["s3:GetObject"],</text>
      <text x="335" y="226" fill="#8b949e" font-family="monospace" font-size="11">← API operations</text>
      <text x="100" y="248" fill="#ff9900" font-family="monospace" font-size="13">"Resource":</text>
      <text x="195" y="248" fill="#a5d6ff" font-family="monospace" font-size="13">"arn:aws:s3:::bkt/*",</text>
      <text x="370" y="248" fill="#8b949e" font-family="monospace" font-size="11">← what the actions target</text>
      <text x="100" y="270" fill="#ff9900" font-family="monospace" font-size="13">"Condition":</text>
      <text x="200" y="270" fill="#a5d6ff" font-family="monospace" font-size="13">{ "IpAddress": ... }</text>
      <text x="370" y="270" fill="#8b949e" font-family="monospace" font-size="11">← optional runtime filters</text>
      <text x="80" y="292" fill="#ff9900" font-family="monospace" font-size="13">}</text>
      <text x="60" y="314" fill="#ff9900" font-family="monospace" font-size="13">]</text>
      <text x="40" y="336" fill="#ff9900" font-family="monospace" font-size="13">}</text>
    </svg>`,
    codeExample: {
      language: "json",
      title: "S3 bucket policy with Principal and IP Condition",
      code: `{
  "Version": "2012-10-17",
  "Id": "S3-Account-Permissions",
  "Statement": [
    {
      "Sid": "AllowOfficeNetworkOnly",
      "Effect": "Allow",
      "Principal": { "AWS": ["arn:aws:iam::123456789012:root"] },
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": ["arn:aws:s3:::mybucket/*"],
      "Condition": {
        "IpAddress": { "aws:SourceIp": "203.0.113.0/24" },
        "Bool":      { "aws:MultiFactorAuthPresent": "true" }
      }
    }
  ]
}`,
    },
    problemStatement:
      "You are a solutions architect at a financial-services firm. Auditors require that S3 objects in the bucket `acme-audit-logs` are readable only from the corporate office IP range (203.0.113.0/24) and only when the requester has authenticated with MFA. Write a one-paragraph plan describing exactly which fields of the IAM policy you would set, the values, and why both an IpAddress condition and an MFA condition are required.",
    questions: [
      {
        q: "Which field in an IAM policy specifies WHEN the statement is in effect (e.g. only from certain IPs or when MFA is present)?",
        options: ["A. Sid", "B. Effect", "C. Condition", "D. Resource"],
        answer: "C",
        explanation:
          "C is correct: the Condition element holds runtime predicates like IpAddress, Bool (MFA), DateGreaterThan, etc. A (Sid) is just a label. B (Effect) is Allow or Deny. D (Resource) names what the actions target.",
      },
      {
        q: "What is the correct value for the `Version` field in a modern IAM policy?",
        options: [
          "A. \"1.0\"",
          "B. \"2008-10-17\"",
          "C. \"2012-10-17\"",
          "D. \"2023-04-01\"",
        ],
        answer: "C",
        explanation:
          "C is correct: always use \"2012-10-17\" — it's the current policy language version. A is not a valid value. B (\"2008-10-17\") is the legacy version that doesn't support policy variables and shouldn't be used in new policies. D is fabricated.",
      },
      {
        q: "In which policy type is the `Principal` element typically used?",
        options: [
          "A. Identity-based policies attached to an IAM user",
          "B. Resource-based policies like S3 bucket policies or KMS key policies",
          "C. Inline policies attached to a group",
          "D. AWS managed policies",
        ],
        answer: "B",
        explanation:
          "B is correct: resource-based policies declare WHO (Principal) is allowed to act on that specific resource. A and C and D are identity-based — they are attached to an identity, so the principal is implicit (the identity itself) and the Principal element is omitted.",
      },
    ],
  },

  {
    id: "iam-password-policy",
    title: "IAM Password Policy",
    shortLabel: "Password Policy",
    section: "IAM — Identity & Access Management",
    domain: "Identity",
    explanation:
      "AWS lets you enforce account-wide rules for IAM user passwords. You can set a minimum password length, require specific character classes (uppercase, lowercase, digits, symbols), allow users to change their own passwords, require expiration after N days, and prevent reuse of the last N passwords. Strong password policies are a basic but high-leverage hardening step: combined with MFA, they dramatically reduce the impact of credential phishing and reuse from breached third-party sites. Setting a password policy only takes a single API call but applies to every IAM user in the account.",
    analogy:
      "An IAM password policy is like the lock specification a landlord prints on the lease: minimum lock grade, must include a deadbolt, must be re-keyed once a year, can't reuse the same key the last tenant had. Without it, anyone can install a 50-cent padlock and the building becomes everyone's burglary statistic.",
    diagram: `<svg viewBox="0 0 720 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="IAM password policy controls">${svgDefs}
      <rect x="20" y="20" width="680" height="300" rx="10" fill="#1a2332" stroke="#2d3a4f"/>
      <text x="360" y="50" text-anchor="middle" fill="#ff9900" font-size="16" font-weight="700">IAM Password Policy</text>
      <g>
        <rect x="50" y="80" width="290" height="100" rx="8" fill="#243349" stroke="#ff9900"/>
        <text x="65" y="105" fill="#e6edf3" font-size="13" font-weight="600">Complexity</text>
        <text x="65" y="128" fill="#b0bac6" font-size="11">• Minimum length (≥ 14 recommended)</text>
        <text x="65" y="146" fill="#b0bac6" font-size="11">• Require uppercase / lowercase</text>
        <text x="65" y="164" fill="#b0bac6" font-size="11">• Require digit and symbol</text>
      </g>
      <g>
        <rect x="380" y="80" width="290" height="100" rx="8" fill="#243349" stroke="#ff9900"/>
        <text x="395" y="105" fill="#e6edf3" font-size="13" font-weight="600">Rotation</text>
        <text x="395" y="128" fill="#b0bac6" font-size="11">• Max password age (e.g. 90 days)</text>
        <text x="395" y="146" fill="#b0bac6" font-size="11">• Prevent reuse of last N passwords</text>
        <text x="395" y="164" fill="#b0bac6" font-size="11">• Allow self-service change</text>
      </g>
      <g>
        <rect x="50" y="200" width="620" height="90" rx="8" fill="#0a0e14" stroke="#10b981"/>
        <text x="360" y="225" text-anchor="middle" fill="#10b981" font-size="13" font-weight="600">Combine with MFA + Password Policy = layered defense</text>
        <text x="360" y="250" text-anchor="middle" fill="#b0bac6" font-size="11">A stolen password alone is useless if MFA is also required</text>
        <text x="360" y="272" text-anchor="middle" fill="#8b949e" font-size="11">Enforce account-wide; applies to all IAM users automatically</text>
      </g>
    </svg>`,
    codeExample: {
      language: "bash",
      title: "Set a strong account-wide password policy",
      code: `aws iam update-account-password-policy \\
  --minimum-password-length 14 \\
  --require-symbols \\
  --require-numbers \\
  --require-uppercase-characters \\
  --require-lowercase-characters \\
  --allow-users-to-change-password \\
  --max-password-age 90 \\
  --password-reuse-prevention 24

# Confirm settings
aws iam get-account-password-policy`,
    },
    problemStatement:
      "You are a solutions architect at a regional bank. The compliance team requires that all IAM console passwords are at least 14 characters, mix all four character classes, expire every 60 days, and cannot be reused for two years. Outline the single API call (or console flow) that satisfies all of these requirements and explain why a password policy alone is not sufficient — what additional control would you pair it with?",
    questions: [
      {
        q: "Which control does an IAM password policy NOT enforce?",
        options: [
          "A. Minimum password length",
          "B. Password expiration after N days",
          "C. Mandatory MFA on every login",
          "D. Prevention of password reuse",
        ],
        answer: "C",
        explanation:
          "C is correct: password policies don't force MFA — that's configured separately on each user (or via SCP / Conditions). A, B, and D are all standard password-policy knobs.",
      },
      {
        q: "A bank requires that IAM users cannot reuse any of their last 24 passwords. Which setting achieves this?",
        options: [
          "A. `--minimum-password-length 24`",
          "B. `--password-reuse-prevention 24`",
          "C. `--max-password-age 24`",
          "D. `--require-symbols`",
        ],
        answer: "B",
        explanation:
          "B is correct: `password-reuse-prevention` is the dedicated knob that blocks reuse of the last N passwords. A sets minimum length, not reuse history. C sets the expiration interval. D is unrelated.",
      },
      {
        q: "Which of the following is the BEST combined credential-security baseline for IAM users?",
        options: [
          "A. Strong password policy + MFA + no access keys for console users",
          "B. Strong password policy only",
          "C. MFA only",
          "D. Long-lived access keys with weak passwords",
        ],
        answer: "A",
        explanation:
          "A is correct: layered defense — strong passwords, MFA on top, and avoiding long-lived access keys when not needed gives you the strongest baseline. B and C are single-layer defenses, weaker than the combination. D is the worst of every world.",
      },
    ],
  },

  {
    id: "iam-mfa",
    title: "Multi-Factor Authentication (MFA)",
    shortLabel: "MFA",
    section: "IAM — Identity & Access Management",
    domain: "Identity",
    explanation:
      "Multi-Factor Authentication (MFA) means proving your identity with two independent factors: something you KNOW (your password) plus something you HAVE (a device that generates a time-based code or signs a challenge). With MFA enabled, a stolen password by itself is useless. AWS supports several MFA device types: **Virtual MFA apps** (Google Authenticator, Authy, 1Password) — software TOTP on your phone, free, can hold multiple tokens on one device; **U2F security keys** like YubiKey — physical USB devices that sign FIDO challenges, support multiple root and IAM users on one key; **Hardware key fobs** by Gemalto (commercial AWS) and SurePassID (AWS GovCloud) — small displays that show rotating codes. MFA on the root account is the single most important protection in any AWS account.",
    analogy:
      "MFA is like a bank vault that requires both a key and a combination dial. Even if a thief copies your key (your password), they still can't open the vault without the combination (your MFA code, which changes every 30 seconds and lives only on your phone or hardware token).",
    diagram: `<svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Multi-factor authentication flow with multiple device types">${svgDefs}
      <rect x="20" y="20" width="680" height="280" rx="10" fill="#1a2332" stroke="#2d3a4f"/>
      <text x="360" y="48" text-anchor="middle" fill="#ff9900" font-size="16" font-weight="700">MFA = something you know + something you have</text>
      <g>
        <circle cx="80" cy="160" r="30" fill="#243349" stroke="#3b82f6"/>
        <text x="80" y="164" text-anchor="middle" fill="#e6edf3" font-size="11">User</text>
      </g>
      <line x1="115" y1="155" x2="200" y2="125" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="115" y1="165" x2="200" y2="200" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <g>
        <rect x="200" y="100" width="180" height="50" rx="6" fill="#243349" stroke="#3d4d68"/>
        <text x="290" y="125" text-anchor="middle" fill="#e6edf3" font-size="12">password (something you know)</text>
      </g>
      <g>
        <rect x="200" y="180" width="180" height="50" rx="6" fill="#243349" stroke="#3d4d68"/>
        <text x="290" y="205" text-anchor="middle" fill="#e6edf3" font-size="12">MFA token (something you have)</text>
      </g>
      <g>
        <rect x="410" y="80" width="260" height="180" rx="8" fill="#0a0e14" stroke="#3d4d68"/>
        <text x="540" y="106" text-anchor="middle" fill="#ff9900" font-size="12" font-weight="600">Supported MFA devices</text>
        <text x="430" y="132" fill="#e6edf3" font-size="11">▸ Virtual MFA (Google Authenticator, Authy)</text>
        <text x="430" y="154" fill="#e6edf3" font-size="11">▸ U2F security key (YubiKey by Yubico)</text>
        <text x="430" y="176" fill="#e6edf3" font-size="11">▸ Hardware key fob (Gemalto)</text>
        <text x="430" y="198" fill="#e6edf3" font-size="11">▸ Hardware key fob (SurePassID GovCloud)</text>
        <text x="540" y="232" text-anchor="middle" fill="#10b981" font-size="11">All TOTP- or FIDO-based</text>
        <text x="540" y="250" text-anchor="middle" fill="#8b949e" font-size="10">U2F: one key, many users  ·  Virtual: many tokens, one phone</text>
      </g>
      <line x1="385" y1="125" x2="405" y2="170" stroke="#10b981" stroke-width="2" marker-end="url(#arrow-mute)"/>
      <line x1="385" y1="205" x2="405" y2="170" stroke="#10b981" stroke-width="2" marker-end="url(#arrow-mute)"/>
    </svg>`,
    codeExample: {
      language: "bash",
      title: "Enable a virtual MFA device for an IAM user",
      code: `# 1. Create a virtual MFA device
aws iam create-virtual-mfa-device \\
  --virtual-mfa-device-name alice-phone \\
  --outfile alice-qr.png \\
  --bootstrap-method QRCodePNG

# 2. Scan the QR with Google Authenticator / Authy
#    The app now generates a new 6-digit code every 30 seconds.

# 3. Enable the device on the user by providing two consecutive codes
aws iam enable-mfa-device \\
  --user-name alice \\
  --serial-number arn:aws:iam::123456789012:mfa/alice-phone \\
  --authentication-code-1 123456 \\
  --authentication-code-2 654321`,
    },
    problemStatement:
      "You are a solutions architect at a SaaS company that just had a near-miss: an engineer's IAM password was leaked in a third-party breach. No data was lost because the engineer happened to be on vacation, but the CISO now wants MFA enforced for every IAM user and the root account. Outline an MFA rollout plan: which device type you'd recommend for the root account vs. day-to-day IAM users, and how an IAM Condition with `aws:MultiFactorAuthPresent` can block console sessions that didn't use MFA.",
    questions: [
      {
        q: "Which statement about AWS MFA is TRUE?",
        options: [
          "A. A virtual MFA app can only hold one MFA token at a time.",
          "B. A U2F security key can be associated with multiple root and IAM users.",
          "C. MFA is mandatory for all IAM users by default.",
          "D. Hardware key fobs are the only AWS-supported MFA option.",
        ],
        answer: "B",
        explanation:
          "B is correct: a single U2F YubiKey can be registered to many users (root and IAM) — handy for admins managing several accounts. A is wrong: apps like Authy or Google Authenticator hold dozens of tokens. C is wrong: MFA is opt-in unless enforced via Condition or SCP. D is wrong: AWS supports virtual MFA, U2F, and hardware key fobs.",
      },
      {
        q: "A company wants to FORCE every IAM user to use MFA before they can perform any action other than changing their own password. Which approach is BEST?",
        options: [
          "A. Set a password policy with maximum age 1 day.",
          "B. Attach a policy that uses `Condition: { Bool: { \"aws:MultiFactorAuthPresent\": \"true\" } }` for all sensitive actions.",
          "C. Delete IAM users who don't enable MFA.",
          "D. Restrict console login to office IP only.",
        ],
        answer: "B",
        explanation:
          "B is correct: the canonical pattern is a policy that denies (or only allows) actions when `aws:MultiFactorAuthPresent` is true. This nudges users to enable MFA and blocks non-MFA sessions automatically. A doesn't enforce MFA at all. C is operationally hostile and doesn't enforce anything proactively. D is an IP control, not an MFA control.",
      },
      {
        q: "Which MFA option is recommended for AWS GovCloud (US) hardware MFA?",
        options: [
          "A. Gemalto key fob",
          "B. YubiKey",
          "C. SurePassID key fob",
          "D. Google Authenticator",
        ],
        answer: "C",
        explanation:
          "C is correct: SurePassID provides the hardware key fob option for AWS GovCloud (US). A (Gemalto) is for commercial AWS, not GovCloud. B (YubiKey) is U2F and is supported in commercial AWS, with separate registration in GovCloud. D is software-based and not a hardware-MFA option.",
      },
    ],
  },

  {
    id: "aws-access-methods",
    title: "How Users Access AWS (Console, CLI, SDK)",
    shortLabel: "Access Methods",
    section: "IAM — Identity & Access Management",
    domain: "Identity",
    explanation:
      "There are three ways to interact with AWS: (1) **AWS Management Console** — the web UI at console.aws.amazon.com, authenticated by username + password and ideally MFA, used for exploring services and one-off tasks; (2) **AWS Command Line Interface (CLI)** — a shell tool that wraps every AWS API, authenticated by access keys (an Access Key ID acting like a username and a Secret Access Key acting like a password); (3) **AWS Software Development Kits (SDKs)** — language-specific libraries (Python boto3, Java SDK v2, JavaScript SDK v3, Go, .NET, Ruby, PHP, C++, plus mobile and IoT SDKs) used to build applications that call AWS programmatically, also authenticated by access keys. Access keys are sensitive — treat them like passwords, never commit them to git, rotate them regularly, and prefer IAM roles (instance/Lambda/container) over access keys whenever possible.",
    analogy:
      "Think of AWS as a giant warehouse. The Console is walking into the front office and signing in at the desk — easy and visual, but slow if you have to do it 500 times. The CLI is a remote-control terminal in your office: you type instructions and the warehouse robots execute. The SDK is hiring those robots and embedding them inside your own product — they call AWS on your behalf, no human in the loop.",
    diagram: `<svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Three ways to access AWS - console, CLI, SDK">${svgDefs}
      <rect x="20" y="20" width="680" height="280" rx="10" fill="#1a2332" stroke="#2d3a4f"/>
      <text x="360" y="48" text-anchor="middle" fill="#ff9900" font-size="16" font-weight="700">Three ways to access AWS</text>
      <g>
        <rect x="50" y="80" width="180" height="180" rx="8" fill="#243349" stroke="#ff9900"/>
        <text x="140" y="108" text-anchor="middle" fill="#ff9900" font-size="13" font-weight="600">1. Console</text>
        <text x="140" y="135" text-anchor="middle" fill="#e6edf3" font-size="11">Web browser</text>
        <text x="140" y="155" text-anchor="middle" fill="#b0bac6" font-size="11">Auth: password + MFA</text>
        <text x="140" y="180" text-anchor="middle" fill="#8b949e" font-size="11">Best for: humans</text>
        <text x="140" y="200" text-anchor="middle" fill="#8b949e" font-size="11">exploring, one-off tasks</text>
        <text x="140" y="230" text-anchor="middle" fill="#10b981" font-size="11">No long-lived keys</text>
      </g>
      <g>
        <rect x="270" y="80" width="180" height="180" rx="8" fill="#243349" stroke="#ff9900"/>
        <text x="360" y="108" text-anchor="middle" fill="#ff9900" font-size="13" font-weight="600">2. CLI</text>
        <text x="360" y="135" text-anchor="middle" fill="#e6edf3" font-size="11">aws s3 ls</text>
        <text x="360" y="155" text-anchor="middle" fill="#b0bac6" font-size="11">Auth: access keys</text>
        <text x="360" y="180" text-anchor="middle" fill="#8b949e" font-size="11">Best for: scripting,</text>
        <text x="360" y="200" text-anchor="middle" fill="#8b949e" font-size="11">automation, ops</text>
        <text x="360" y="230" text-anchor="middle" fill="#f59e0b" font-size="11">Open-source, on GitHub</text>
      </g>
      <g>
        <rect x="490" y="80" width="180" height="180" rx="8" fill="#243349" stroke="#ff9900"/>
        <text x="580" y="108" text-anchor="middle" fill="#ff9900" font-size="13" font-weight="600">3. SDK</text>
        <text x="580" y="135" text-anchor="middle" fill="#e6edf3" font-size="11">boto3.client("s3")</text>
        <text x="580" y="155" text-anchor="middle" fill="#b0bac6" font-size="11">Auth: access keys / role</text>
        <text x="580" y="180" text-anchor="middle" fill="#8b949e" font-size="11">Best for: building apps</text>
        <text x="580" y="200" text-anchor="middle" fill="#8b949e" font-size="11">embedded in your code</text>
        <text x="580" y="230" text-anchor="middle" fill="#10b981" font-size="11">Many languages</text>
      </g>
    </svg>`,
    codeExample: {
      language: "bash",
      title: "Access keys: storage, use, and rotation",
      code: `# Create an access key for an IAM user (returns plaintext secret ONCE)
aws iam create-access-key --user-name alice
# AccessKeyId:     AKIAIOSFODNN7EXAMPLE
# SecretAccessKey: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

# Store them in ~/.aws/credentials
# [default]
# aws_access_key_id     = AKIAIOSFODNN7EXAMPLE
# aws_secret_access_key = wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

# Verify which identity the keys map to
aws sts get-caller-identity

# Rotate every 90 days: create new key → update all clients → delete old key
aws iam delete-access-key --user-name alice --access-key-id AKIAOLDKEY`,
    },
    problemStatement:
      "You are a solutions architect at a startup. A junior engineer just emailed their AWS access keys to themselves to set up CI. The keys have AdministratorAccess. Write a one-paragraph incident-response plan covering the immediate revocation steps, how to detect any unauthorized usage, and how you'd redesign CI authentication to avoid long-lived keys altogether.",
    questions: [
      {
        q: "An EC2 instance needs to read from S3. Which authentication method is the BEST practice?",
        options: [
          "A. Hard-code an IAM user's access keys in the application config.",
          "B. Attach an IAM role to the EC2 instance and let the SDK fetch temporary credentials.",
          "C. SSH into the instance and run `aws configure` with an admin's keys.",
          "D. Use the EC2 instance's public IP as a principal in the bucket policy.",
        ],
        answer: "B",
        explanation:
          "B is correct: IAM instance roles deliver short-lived, automatically-rotated credentials via the instance metadata service — no long-lived secrets to leak. A is the cardinal sin: hard-coded keys end up in git history. C is even worse (admin-scoped keys on a server). D is invented — bucket policies don't accept IPs as principals (you can scope by IP via Condition, but the principal must still be an identity).",
      },
      {
        q: "What is the relationship between the CLI and the SDK?",
        options: [
          "A. They are independent products with separate authentication systems.",
          "B. The CLI is built on top of the Python SDK (botocore).",
          "C. The SDK is built on top of the CLI.",
          "D. Both are deprecated in favor of the Console.",
        ],
        answer: "B",
        explanation:
          "B is correct: the AWS CLI is a Python program that uses the botocore library — the same low-level core that the boto3 Python SDK uses. A is wrong: they share the credentials system. C inverts the relationship. D is wrong: both are very much active.",
      },
      {
        q: "An engineer pasted their personal IAM access key into a public GitHub repo. Within minutes, the account incurred $4,000 in EC2 charges. What is the FASTEST containment action?",
        options: [
          "A. File a support ticket with AWS Billing.",
          "B. Immediately delete or deactivate the leaked access key in IAM, then rotate all other secrets used by that user.",
          "C. Wait 24 hours to see if the attacker stops.",
          "D. Add an SCP to the OU after-the-fact.",
        ],
        answer: "B",
        explanation:
          "B is correct: the fastest containment is to disable / delete the leaked key in IAM — that revokes the attacker's credentials within seconds. A is necessary later for fee waivers but doesn't stop the attack. C is harmful (the attacker keeps spinning up instances). D doesn't help with already-leaked keys; SCPs operate on identities, but the immediate fix is to kill the credential.",
      },
    ],
  },

  {
    id: "aws-cli",
    title: "AWS CLI Deep Dive",
    shortLabel: "AWS CLI",
    section: "IAM — Identity & Access Management",
    domain: "Identity",
    explanation:
      "The AWS Command Line Interface (CLI) is an open-source Python program (github.com/aws/aws-cli) that gives you direct access to every public AWS API from a terminal. It reads credentials from `~/.aws/credentials` or environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`) or from an instance/role profile automatically. Commands follow the pattern `aws <service> <operation> [--flags]`, e.g. `aws s3 ls`, `aws ec2 describe-instances --region eu-west-3`. The CLI is ideal for scripting, ops automation, and CI pipelines. You can shape output with `--output json|text|table` and filter results with `--query` (JMESPath syntax) or `--filter`. AWS CLI v2 is the current major version, with improvements like SSO support and YAML output.",
    analogy:
      "The AWS CLI is to the AWS Console what the unix shell is to a file-manager GUI. You give up the visual icons in exchange for: 100× faster repeat tasks, scriptability, version control of your operations, and the ability to chain commands into pipelines. Most ops engineers spend 90% of their AWS time in the CLI, not the console.",
    diagram: `<svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="AWS CLI architecture">${svgDefs}
      <rect x="20" y="20" width="680" height="280" rx="10" fill="#1a2332" stroke="#2d3a4f"/>
      <text x="360" y="48" text-anchor="middle" fill="#ff9900" font-size="16" font-weight="700">AWS CLI — anatomy of a command</text>
      <rect x="50" y="80" width="620" height="60" rx="6" fill="#0a0e14" stroke="#ff9900"/>
      <text x="60" y="118" fill="#10b981" font-family="monospace" font-size="14">$ </text>
      <text x="80" y="118" fill="#ff9900" font-family="monospace" font-size="14">aws</text>
      <text x="120" y="118" fill="#e6edf3" font-family="monospace" font-size="14">s3</text>
      <text x="148" y="118" fill="#3b82f6" font-family="monospace" font-size="14">cp</text>
      <text x="180" y="118" fill="#a5d6ff" font-family="monospace" font-size="14">./report.pdf</text>
      <text x="305" y="118" fill="#a5d6ff" font-family="monospace" font-size="14">s3://mybucket/2024/</text>
      <text x="500" y="118" fill="#f59e0b" font-family="monospace" font-size="14">--storage-class</text>
      <text x="640" y="118" fill="#a5d6ff" font-family="monospace" font-size="14">STANDARD_IA</text>
      <g>
        <rect x="50" y="170" width="200" height="120" rx="8" fill="#243349" stroke="#3d4d68"/>
        <text x="150" y="195" text-anchor="middle" fill="#ff9900" font-size="12" font-weight="600">Credentials</text>
        <text x="150" y="218" text-anchor="middle" fill="#e6edf3" font-size="11">~/.aws/credentials</text>
        <text x="150" y="238" text-anchor="middle" fill="#e6edf3" font-size="11">AWS_* env vars</text>
        <text x="150" y="258" text-anchor="middle" fill="#e6edf3" font-size="11">EC2 instance role</text>
        <text x="150" y="278" text-anchor="middle" fill="#10b981" font-size="11">SSO / IAM Identity Center</text>
      </g>
      <g>
        <rect x="270" y="170" width="200" height="120" rx="8" fill="#243349" stroke="#3d4d68"/>
        <text x="370" y="195" text-anchor="middle" fill="#ff9900" font-size="12" font-weight="600">Output controls</text>
        <text x="370" y="218" text-anchor="middle" fill="#e6edf3" font-size="11">--output json | text | table</text>
        <text x="370" y="238" text-anchor="middle" fill="#e6edf3" font-size="11">--query (JMESPath)</text>
        <text x="370" y="258" text-anchor="middle" fill="#e6edf3" font-size="11">--filter</text>
        <text x="370" y="278" text-anchor="middle" fill="#8b949e" font-size="11">--profile alt-account</text>
      </g>
      <g>
        <rect x="490" y="170" width="180" height="120" rx="8" fill="#243349" stroke="#3d4d68"/>
        <text x="580" y="195" text-anchor="middle" fill="#ff9900" font-size="12" font-weight="600">Pagination</text>
        <text x="580" y="218" text-anchor="middle" fill="#e6edf3" font-size="11">automatic by default</text>
        <text x="580" y="238" text-anchor="middle" fill="#e6edf3" font-size="11">--page-size N</text>
        <text x="580" y="258" text-anchor="middle" fill="#e6edf3" font-size="11">--max-items N</text>
        <text x="580" y="278" text-anchor="middle" fill="#8b949e" font-size="11">--no-paginate</text>
      </g>
    </svg>`,
    codeExample: {
      language: "bash",
      title: "Useful CLI patterns: filter, query, named profiles",
      code: `# Use --query (JMESPath) to extract only running instances
aws ec2 describe-instances \\
  --query 'Reservations[].Instances[?State.Name==\`running\`].[InstanceId,InstanceType,PrivateIpAddress]' \\
  --output table

# Use --filter (server-side) to limit results before they're sent back
aws ec2 describe-instances \\
  --filters "Name=tag:Environment,Values=prod" "Name=instance-state-name,Values=running"

# Use a named profile to switch accounts
aws s3 ls --profile prod-account

# Pipe into jq for richer JSON manipulation
aws ec2 describe-volumes --output json | jq '.Volumes[] | {id:.VolumeId, gb:.Size}'`,
    },
    problemStatement:
      "You are a solutions architect at an e-commerce company. Each Monday morning ops needs a report of every EC2 instance in three production Regions, grouped by instance type, with their attached EBS volume sizes. Walk through the CLI-based approach: which commands you'd chain, how you'd use `--query` and `--filter` to avoid client-side processing, and how you'd authenticate to multiple Regions in a single script.",
    questions: [
      {
        q: "Which file does the AWS CLI read by default to find your credentials?",
        options: [
          "A. ~/.aws/credentials",
          "B. /etc/aws.conf",
          "C. ~/aws-keys.txt",
          "D. The macOS Keychain only",
        ],
        answer: "A",
        explanation:
          "A is correct: ~/.aws/credentials (and ~/.aws/config) are the canonical locations. The CLI also reads env vars (`AWS_ACCESS_KEY_ID` etc.) and instance metadata for IAM roles. B, C, and D are invented or platform-specific non-defaults.",
      },
      {
        q: "What is the purpose of the `--query` flag in the AWS CLI?",
        options: [
          "A. To run a SQL-style query against an Amazon Aurora cluster.",
          "B. To filter and reshape the JSON response client-side using JMESPath syntax.",
          "C. To send a server-side filter that reduces the data transferred.",
          "D. To enable IAM query-string authentication.",
        ],
        answer: "B",
        explanation:
          "B is correct: --query is client-side reshaping with JMESPath. The data still comes back in full from AWS, then JMESPath trims it. A is unrelated (Aurora SQL is its own thing). C describes --filters, not --query. D is invented.",
      },
      {
        q: "An engineer has access to two AWS accounts (dev and prod). What's the cleanest way to switch contexts in the CLI?",
        options: [
          "A. Re-run `aws configure` each time, overwriting credentials.",
          "B. Define separate named profiles in ~/.aws/config and use `--profile prod` (or set AWS_PROFILE).",
          "C. Use different IAM users with the same access keys.",
          "D. Maintain two separate Linux user accounts.",
        ],
        answer: "B",
        explanation:
          "B is correct: named profiles are the idiomatic mechanism for managing multiple credential sets. A is destructive (you'd erase the other account's keys every switch). C is nonsense — different users have different keys. D works but is wasteful overhead.",
      },
    ],
  },

  {
    id: "aws-sdk",
    title: "AWS SDK — Programmatic Access",
    shortLabel: "AWS SDK",
    section: "IAM — Identity & Access Management",
    domain: "Identity",
    explanation:
      "An AWS SDK is a language-specific library that lets your application call AWS APIs directly. AWS provides official SDKs for JavaScript/TypeScript, Python (boto3), Java, .NET, Go, Ruby, PHP, C++, plus mobile SDKs (iOS, Android, React Native) and IoT Device SDKs (Embedded C, Arduino). All SDKs follow the same patterns: load credentials from the standard provider chain (env vars → shared credentials file → IAM role on the instance/container), build a service client, and call methods that correspond to AWS API operations. The SDK handles retries, exponential backoff, request signing (SigV4), pagination, and parsing of responses. The AWS CLI itself is built on top of the Python SDK's underlying botocore library.",
    analogy:
      "Where the CLI is a phone you pick up to call AWS, the SDK is a phone wired directly into your product. Your application speaks to AWS in its native language (Python, Go, JavaScript) without ever shelling out to a separate process — faster, more reliable, and easier to wrap in your own error-handling and business logic.",
    diagram: `<svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="AWS SDK provider chain and call flow">${svgDefs}
      <rect x="20" y="20" width="680" height="280" rx="10" fill="#1a2332" stroke="#2d3a4f"/>
      <text x="360" y="48" text-anchor="middle" fill="#ff9900" font-size="16" font-weight="700">AWS SDK — call flow</text>
      <g>
        <rect x="40" y="80" width="180" height="180" rx="8" fill="#243349" stroke="#3b82f6"/>
        <text x="130" y="110" text-anchor="middle" fill="#3b82f6" font-size="13" font-weight="600">Your Application</text>
        <text x="130" y="138" text-anchor="middle" fill="#e6edf3" font-size="11">import boto3</text>
        <text x="130" y="158" text-anchor="middle" fill="#e6edf3" font-size="11">s3 = boto3.client("s3")</text>
        <text x="130" y="178" text-anchor="middle" fill="#e6edf3" font-size="11">s3.list_buckets()</text>
        <text x="130" y="220" text-anchor="middle" fill="#8b949e" font-size="11">Python · Go · JS · Java</text>
        <text x="130" y="238" text-anchor="middle" fill="#8b949e" font-size="11">.NET · Ruby · PHP · C++</text>
      </g>
      <line x1="225" y1="170" x2="280" y2="170" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <g>
        <rect x="285" y="80" width="180" height="180" rx="8" fill="#243349" stroke="#ff9900"/>
        <text x="375" y="110" text-anchor="middle" fill="#ff9900" font-size="13" font-weight="600">SDK runtime</text>
        <text x="375" y="138" text-anchor="middle" fill="#e6edf3" font-size="11">credential provider chain</text>
        <text x="375" y="158" text-anchor="middle" fill="#e6edf3" font-size="11">SigV4 request signing</text>
        <text x="375" y="178" text-anchor="middle" fill="#e6edf3" font-size="11">retry + back-off</text>
        <text x="375" y="198" text-anchor="middle" fill="#e6edf3" font-size="11">automatic pagination</text>
        <text x="375" y="220" text-anchor="middle" fill="#e6edf3" font-size="11">response parsing</text>
        <text x="375" y="245" text-anchor="middle" fill="#8b949e" font-size="11">all transparent to you</text>
      </g>
      <line x1="470" y1="170" x2="525" y2="170" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <g>
        <rect x="530" y="80" width="150" height="180" rx="8" fill="#243349" stroke="#10b981"/>
        <text x="605" y="110" text-anchor="middle" fill="#10b981" font-size="13" font-weight="600">AWS Service API</text>
        <text x="605" y="138" text-anchor="middle" fill="#e6edf3" font-size="11">HTTPS endpoint</text>
        <text x="605" y="158" text-anchor="middle" fill="#e6edf3" font-size="11">s3.amazonaws.com</text>
        <text x="605" y="178" text-anchor="middle" fill="#e6edf3" font-size="11">ec2.us-east-1...</text>
        <text x="605" y="220" text-anchor="middle" fill="#8b949e" font-size="11">JSON / XML over</text>
        <text x="605" y="238" text-anchor="middle" fill="#8b949e" font-size="11">HTTP/2 + TLS</text>
      </g>
    </svg>`,
    codeExample: {
      language: "python",
      title: "Python boto3 — upload to S3 with retry and error handling",
      code: `import boto3
from botocore.exceptions import ClientError
from botocore.config import Config

cfg = Config(
    region_name="us-east-1",
    retries={"max_attempts": 5, "mode": "adaptive"},
)
s3 = boto3.client("s3", config=cfg)

try:
    s3.upload_file(
        Filename="report.pdf",
        Bucket="acme-reports",
        Key=f"2024/q4/report.pdf",
        ExtraArgs={"ServerSideEncryption": "AES256",
                   "StorageClass": "STANDARD_IA"},
    )
    print("Upload OK")
except ClientError as e:
    print(f"AWS error: {e.response['Error']['Code']}")
    raise`,
    },
    problemStatement:
      "You are a solutions architect at a video-processing SaaS. A Python worker running on an EC2 instance needs to pull jobs from SQS, download the source video from S3, transcode it, and upload the result back to S3. Outline the SDK design: which AWS clients you instantiate, how credentials reach the process (the answer is NOT 'hard-code access keys'), how you handle SQS visibility-timeout and retries, and why you'd use an IAM role attached to the EC2 instance instead of an IAM user.",
    questions: [
      {
        q: "Which is the AWS Python SDK?",
        options: ["A. PyAWS", "B. awspython", "C. boto3", "D. amazon-py"],
        answer: "C",
        explanation:
          "C is correct: boto3 is the official AWS SDK for Python (built on botocore). A, B, and D are not real SDK names.",
      },
      {
        q: "An application calls `s3.upload_file()` inside a Lambda function. Where do the SDK credentials come from by default?",
        options: [
          "A. Hard-coded in the function code.",
          "B. From `~/.aws/credentials` on the Lambda filesystem.",
          "C. From the Lambda execution role via the runtime's automatic credential provider.",
          "D. From an IAM user the developer manually attached.",
        ],
        answer: "C",
        explanation:
          "C is correct: the SDK's default credential-provider chain finds environment-variable temporary credentials injected by the Lambda runtime, which correspond to the function's execution role. A is the anti-pattern. B is wrong — Lambda's filesystem doesn't ship with a credentials file. D is wrong: Lambda functions assume an execution role, not an IAM user.",
      },
      {
        q: "Which SDK feature handles automatic retries with exponential back-off when an AWS API throttles you?",
        options: [
          "A. The application must implement back-off manually.",
          "B. The SDK retries transparently using its built-in retry strategy.",
          "C. AWS retries server-side and never returns a 503.",
          "D. Only the CLI retries; SDKs do not.",
        ],
        answer: "B",
        explanation:
          "B is correct: every official SDK implements retry with exponential back-off (and adaptive retry mode in newer versions) for transient errors like throttling and 5xx responses. A is the wrong default. C is wrong — AWS does return 503/ThrottlingException when you exceed rate limits. D is wrong: the CLI is built on the SDK; both retry.",
      },
    ],
  },

  {
    id: "iam-roles",
    title: "IAM Roles for Services",
    shortLabel: "IAM Roles",
    section: "IAM — Identity & Access Management",
    domain: "Identity",
    explanation:
      "An IAM role is an identity in AWS that — unlike a user — has no permanent credentials. Instead, principals (an EC2 instance, a Lambda function, a CloudFormation stack, another AWS account) **assume** the role and receive short-lived temporary credentials from AWS Security Token Service (STS). A role has two policies: a **permissions policy** describing what the role can do, and a **trust policy** describing who is allowed to assume it. The pattern of attaching an IAM role to an EC2 instance (called an instance profile) is the gold-standard way to give an application running on EC2 access to other AWS services — no access keys live on the host, and AWS rotates the temporary credentials automatically. Other common service roles include Lambda execution roles, ECS task roles, and CloudFormation service roles.",
    analogy:
      "An IAM user is a permanent staff badge: it has your name, your photo, and works until you leave the company. An IAM role is a visitor badge that the security desk hands you when you arrive, expires at 5 p.m., and works only for the meeting rooms you're invited to. Anyone (a contractor, a robot, a service from another building) can ask for one, but only if they're on the trust list, and the badge stops working as soon as the meeting ends.",
    diagram: `<svg viewBox="0 0 720 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="IAM role assumption by an EC2 instance">${svgDefs}
      <rect x="20" y="20" width="680" height="300" rx="10" fill="#1a2332" stroke="#2d3a4f"/>
      <text x="360" y="48" text-anchor="middle" fill="#ff9900" font-size="16" font-weight="700">EC2 Instance Role — temporary credentials via STS</text>
      <g>
        <rect x="50" y="90" width="180" height="160" rx="8" fill="#243349" stroke="#3b82f6"/>
        <text x="140" y="115" text-anchor="middle" fill="#3b82f6" font-size="13" font-weight="600">EC2 Instance</text>
        <text x="140" y="142" text-anchor="middle" fill="#e6edf3" font-size="11">app code calling AWS</text>
        <rect x="70" y="160" width="140" height="50" rx="6" fill="#0a0e14" stroke="#ff9900"/>
        <text x="140" y="180" text-anchor="middle" fill="#ff9900" font-size="11">Instance Profile</text>
        <text x="140" y="198" text-anchor="middle" fill="#e6edf3" font-size="10">AppReadS3Role</text>
        <text x="140" y="230" text-anchor="middle" fill="#8b949e" font-size="10">no long-lived keys on box</text>
      </g>
      <line x1="235" y1="170" x2="290" y2="170" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <g>
        <rect x="295" y="90" width="180" height="160" rx="8" fill="#243349" stroke="#ff9900"/>
        <text x="385" y="115" text-anchor="middle" fill="#ff9900" font-size="13" font-weight="600">STS</text>
        <text x="385" y="142" text-anchor="middle" fill="#e6edf3" font-size="11">AssumeRole</text>
        <text x="385" y="168" text-anchor="middle" fill="#e6edf3" font-size="11">→ AccessKeyId</text>
        <text x="385" y="186" text-anchor="middle" fill="#e6edf3" font-size="11">→ SecretAccessKey</text>
        <text x="385" y="204" text-anchor="middle" fill="#e6edf3" font-size="11">→ SessionToken</text>
        <text x="385" y="230" text-anchor="middle" fill="#10b981" font-size="11">15min – 12h TTL</text>
      </g>
      <line x1="480" y1="170" x2="535" y2="170" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <g>
        <rect x="540" y="90" width="140" height="160" rx="8" fill="#243349" stroke="#10b981"/>
        <text x="610" y="115" text-anchor="middle" fill="#10b981" font-size="13" font-weight="600">S3</text>
        <text x="610" y="142" text-anchor="middle" fill="#e6edf3" font-size="11">GetObject</text>
        <text x="610" y="160" text-anchor="middle" fill="#e6edf3" font-size="11">PutObject</text>
        <text x="610" y="200" text-anchor="middle" fill="#8b949e" font-size="11">access granted by</text>
        <text x="610" y="218" text-anchor="middle" fill="#8b949e" font-size="11">role permissions policy</text>
      </g>
      <text x="360" y="295" text-anchor="middle" fill="#b0bac6" font-size="11">Trust policy: who can assume the role  ·  Permissions policy: what the role can do</text>
    </svg>`,
    codeExample: {
      language: "json",
      title: "Trust policy that lets EC2 instances assume this role",
      code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "Service": "ec2.amazonaws.com" },
      "Action": "sts:AssumeRole"
    }
  ]
}

# Then create an instance profile and attach the role:
#
# aws iam create-role --role-name AppReadS3Role \\
#   --assume-role-policy-document file://trust.json
# aws iam attach-role-policy --role-name AppReadS3Role \\
#   --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess
# aws iam create-instance-profile --instance-profile-name AppReadS3Profile
# aws iam add-role-to-instance-profile \\
#   --instance-profile-name AppReadS3Profile --role-name AppReadS3Role
# aws ec2 associate-iam-instance-profile \\
#   --iam-instance-profile Name=AppReadS3Profile --instance-id i-0abc`,
    },
    problemStatement:
      "You are a solutions architect at a logistics company. A fleet of 200 EC2 instances runs a Python service that needs to read from one S3 bucket, write logs to another, and publish to an SNS topic. Currently each instance has a long-lived IAM access key stored in /etc/app.env. Describe how you'd migrate to IAM roles: the trust policy you'd write, the permissions policy you'd attach, and how the application's SDK call sites stay unchanged.",
    questions: [
      {
        q: "An IAM role provides credentials that are…",
        options: [
          "A. Permanent until manually rotated.",
          "B. Stored in plaintext on the instance.",
          "C. Temporary, automatically rotated, retrieved via STS.",
          "D. Identical to the root account credentials.",
        ],
        answer: "C",
        explanation:
          "C is correct: roles deliver short-lived credentials issued by AWS STS and refreshed automatically by the SDK / instance metadata service. A and B describe IAM user access keys, which is exactly what roles replace. D is dangerously wrong.",
      },
      {
        q: "A Lambda function needs to read from DynamoDB. Which is the BEST way to grant access?",
        options: [
          "A. Hard-code an IAM user's access keys as Lambda environment variables.",
          "B. Attach an execution role to the Lambda with `dynamodb:GetItem` and `dynamodb:Query` permissions.",
          "C. Make the DynamoDB table publicly readable.",
          "D. Run the Lambda inside the same VPC as DynamoDB.",
        ],
        answer: "B",
        explanation:
          "B is correct: the execution role is the standard, secure way to grant a Lambda function permissions. A is the credential-leak anti-pattern. C is a security disaster (and DynamoDB tables don't have a true 'public' setting). D mixes concerns — VPC isn't an authorization mechanism, and DynamoDB tables aren't VPC resources.",
      },
      {
        q: "A trust policy on a role specifies…",
        options: [
          "A. What AWS API actions the role can perform.",
          "B. Which principals are allowed to assume the role.",
          "C. The maximum credential lifetime.",
          "D. The Region where the role is valid.",
        ],
        answer: "B",
        explanation:
          "B is correct: a trust policy is a resource-based policy on the role that names who (which service, account, or principal) can call sts:AssumeRole on it. A describes the permissions policy, not the trust policy. C is partially set by MaxSessionDuration on the role, not the trust policy. D is wrong: IAM roles are global.",
      },
      {
        q: "A company runs 200 EC2 instances behind an ALB, each reading config from a single S3 bucket. Currently every instance has hard-coded access keys in /etc/app.env. What is the BEST migration target?",
        options: [
          "A. Move access keys from /etc/app.env to AWS Secrets Manager and fetch at startup.",
          "B. Attach an IAM instance role with s3:GetObject permission to each instance and remove all hard-coded keys.",
          "C. Make the S3 bucket public so no credentials are needed.",
          "D. Open port 443 from 0.0.0.0/0 on the bucket's VPC endpoint.",
        ],
        answer: "B",
        explanation:
          "B is correct: instance roles deliver short-lived, auto-rotated credentials with zero static secrets. A is better than the status quo but still leaves a fetch step that requires SOME bootstrap credential. C is a security incident. D is technically nonsense (VPC endpoints don't have ingress SGs that way) and unrelated to credentials.",
      },
      {
        q: "A Lambda function needs to write to two DynamoDB tables and publish to one SNS topic. Where do the SDK credentials come from at runtime?",
        options: [
          "A. From environment variables set in the function configuration.",
          "B. From the Lambda execution role's temporary credentials, injected automatically into the runtime.",
          "C. From the developer's ~/.aws/credentials file.",
          "D. From the API Gateway integration request.",
        ],
        answer: "B",
        explanation:
          "B is correct: every Lambda assumes an execution role; the SDK's default credential provider chain reads those temp creds transparently. A is the anti-pattern (storing static keys in env vars). C is wrong: the developer's machine has nothing to do with Lambda execution. D is unrelated.",
      },
      {
        q: "A cross-account scenario: Account A has an IAM role 'DataReader'. Account B's IAM user 'alice' needs to assume that role. What's required?",
        options: [
          "A. Only the role's permissions policy.",
          "B. Account A's role TRUST POLICY must list Account B (or alice's ARN), and alice in Account B must have iam:AssumeRole permission on the role's ARN.",
          "C. The two accounts must be in the same AWS Organization.",
          "D. The role must be in the same Region as alice.",
        ],
        answer: "B",
        explanation:
          "B is correct: cross-account role assumption is a two-sided handshake — trust policy on the role and a sts:AssumeRole permission on the assumer. A misses the trust side. C is not required (Organizations helps but isn't mandatory). D is wrong (IAM is global).",
      },
      {
        q: "What is the DEFAULT maximum session duration when an EC2 instance role's credentials are issued via the instance metadata service?",
        options: ["A. 15 minutes", "B. 1 hour (with auto-refresh by the SDK before expiry)", "C. 12 hours", "D. 7 days"],
        answer: "B",
        explanation:
          "B is correct: instance metadata returns credentials with a TTL (typically ~1 hour, automatically refreshed by the SDK before they expire). A is the minimum for sts:AssumeRole, not the default for instance roles. C is the maximum you can configure on a role for some IDP scenarios. D is wrong.",
      },
      {
        q: "Which AWS service ISSUES the temporary credentials that an EC2 instance receives via its instance role?",
        options: ["A. IAM directly", "B. AWS STS (Security Token Service)", "C. AWS Secrets Manager", "D. KMS"],
        answer: "B",
        explanation:
          "B is correct: STS issues the short-lived access key + secret + session token. IAM defines who can assume, but STS mints the credentials. C stores arbitrary secrets, not session creds. D is for encryption keys.",
      },
      {
        q: "A solutions architect wants to grant a third-party SaaS vendor read-only access to specific S3 buckets in the company account. The vendor will use their own AWS account. Which is the SECURE pattern?",
        options: [
          "A. Create an IAM user, generate access keys, and email them to the vendor.",
          "B. Create an IAM role with a trust policy specifying the vendor's account ID and the recommended ExternalId; the vendor assumes the role from their account.",
          "C. Make the buckets public.",
          "D. Add the vendor's IP range to a bucket policy.",
        ],
        answer: "B",
        explanation:
          "B is correct: cross-account role with ExternalId is THE pattern for third-party access — no long-lived secrets, auditable assume events, vendor controls who in their org uses the role. A is the worst answer. C is a security incident. D leaks data to anyone behind that IP.",
      },
      {
        q: "What is the IMDSv2 (Instance Metadata Service v2) requirement when an EC2 instance role is being used by the SDK?",
        options: [
          "A. The SDK first does a PUT to obtain a session token, then includes the token in subsequent GET requests for credentials.",
          "B. The SDK includes IAM credentials in the request automatically.",
          "C. IMDSv2 disables instance roles for security.",
          "D. The SDK requires a CloudFront signed URL.",
        ],
        answer: "A",
        explanation:
          "A is correct: IMDSv2 mitigates SSRF attacks by requiring a session-token PUT call before any GET on the metadata endpoints. B is the wrong direction (the SDK is the consumer). C is wrong — IMDSv2 doesn't disable instance roles. D is invented.",
      },
      {
        q: "What's the difference between an IAM Role and an IAM User?",
        options: [
          "A. None — they are aliases for the same resource.",
          "B. A User has long-lived credentials and a permanent identity; a Role has NO long-lived credentials and is ASSUMED to receive temporary STS credentials.",
          "C. A Role can only be assumed by AWS services, never by users.",
          "D. A User is region-scoped; a Role is global.",
        ],
        answer: "B",
        explanation:
          "B is correct: that's the defining distinction. A is wrong (they're different). C is wrong (users, federated identities, and SAML providers can all assume roles too). D is wrong (both are global).",
      },
      {
        q: "A CloudFormation stack creates an EC2 instance plus the IAM role it should use. To attach the role to the instance, what intermediate IAM object is REQUIRED?",
        options: ["A. A Trust Policy", "B. An Instance Profile", "C. A Permissions Boundary", "D. A Federated Identity"],
        answer: "B",
        explanation:
          "B is correct: EC2 instances accept an INSTANCE PROFILE (a container for one IAM role) at launch time — not the role directly. A is part of the role itself. C limits the role's effective permissions but doesn't bind it to EC2. D is for SAML/OIDC federation.",
      },
      {
        q: "A team wants an IAM role that can be assumed BOTH by EC2 instances AND by Lambda functions. Is that possible?",
        options: [
          "A. No — a role can be trusted by only one service.",
          "B. Yes — the trust policy can list multiple Service principals (e.g., both ec2.amazonaws.com and lambda.amazonaws.com).",
          "C. Yes, but only via a custom resource.",
          "D. Only in AWS GovCloud.",
        ],
        answer: "B",
        explanation:
          "B is correct: trust policies support multiple principals. A and D are wrong. C is unnecessary.",
      },
      {
        q: "An IAM role's PERMISSIONS POLICY says `Allow s3:*`. Its TRUST POLICY says only the Lambda service can assume it. Alice (an IAM user) attempts to call `sts:AssumeRole` on the role. What happens?",
        options: [
          "A. Alice gets s3:* credentials.",
          "B. The AssumeRole call fails because Alice is not a trusted principal.",
          "C. The permissions policy overrides the trust policy.",
          "D. Alice gets read-only credentials.",
        ],
        answer: "B",
        explanation:
          "B is correct: trust policy is checked first — only principals listed there can assume the role. The permissions policy never gets evaluated for non-trusted callers. A, C, D all misunderstand the two-policy split.",
      },
      {
        q: "Which AWS service uses an IAM ROLE rather than IAM user credentials by default in its execution model?",
        options: ["A. AWS Lambda (execution role)", "B. AWS CodeBuild (service role)", "C. Amazon EC2 (instance role via instance profile)", "D. All of the above"],
        answer: "D",
        explanation:
          "D is correct: Lambda, CodeBuild, EC2, ECS Task, CodePipeline, CloudFormation, EventBridge — virtually every modern AWS compute / automation service is built around assuming an IAM role. A, B, and C are individually true.",
      },
      {
        q: "A solutions architect wants ANY EC2 instance with the tag `Role=Web` to automatically receive a particular IAM role. Is this possible directly through tagging?",
        options: [
          "A. Yes — IAM instance profiles auto-attach based on instance tags.",
          "B. No — tag-based auto-attachment isn't a built-in EC2 feature; you either set the instance profile at launch or use automation (CloudFormation, ASG launch template, EventBridge + Lambda).",
          "C. Yes, but only for Spot Instances.",
          "D. Yes, via a Service Control Policy.",
        ],
        answer: "B",
        explanation:
          "B is correct: there is no native tag → instance profile binding. You set it at launch (run-instances or a launch template) or react via automation. A, C, and D invent behavior.",
      },
      {
        q: "Which IAM construct lets one AWS account's identities ASSUME a role in a partner's account WITHOUT requiring long-lived credentials in either direction?",
        options: ["A. IAM user federation", "B. Cross-account IAM Role with a trust policy", "C. AWS Direct Connect", "D. KMS grants"],
        answer: "B",
        explanation:
          "B is correct: cross-account roles plus STS:AssumeRole is the canonical pattern — no static secrets cross the boundary. A is for human SSO. C is dedicated network connectivity (unrelated). D is for encryption-key delegation.",
      },
      {
        q: "An EC2 instance role provides credentials at http://169.254.169.254/latest/meta-data/iam/security-credentials/<role-name>. What is the MAIN risk if an SSRF (server-side request forgery) vulnerability exists in your application?",
        options: [
          "A. The attacker gets the EC2 instance's IP address.",
          "B. The attacker may retrieve the instance role's temporary credentials via the metadata service.",
          "C. The instance gets stuck in a reboot loop.",
          "D. CloudTrail stops logging.",
        ],
        answer: "B",
        explanation:
          "B is correct: SSRF + IMDSv1 = the classic AWS credential-leak scenario (the 2019 Capital One incident is the textbook case). IMDSv2 mitigates this with token-bound metadata access. A is true but not THE risk. C and D are invented.",
      },
      {
        q: "What does `iam:PassRole` permission allow a user to do?",
        options: [
          "A. Assume the role themselves.",
          "B. Hand a role to an AWS service (e.g., specify a role when launching EC2, deploying Lambda, or starting an ECS task).",
          "C. Delete the role.",
          "D. Rename the role.",
        ],
        answer: "B",
        explanation:
          "B is correct: PassRole is the 'right to give this role to a service' permission — separate from assuming the role yourself. A is sts:AssumeRole. C is iam:DeleteRole. D doesn't exist (you'd recreate).",
      },
    ],
  },

  {
    id: "iam-security-tools",
    title: "IAM Security Tools (Credentials Report & Access Advisor)",
    shortLabel: "IAM Security Tools",
    section: "IAM — Identity & Access Management",
    domain: "Identity",
    explanation:
      "IAM ships with two free audit tools every solutions architect should know. The **IAM Credentials Report** is an account-level CSV listing every IAM user and the status of their credentials — password enabled, last used, MFA enabled, access keys present and last rotated, etc. It's invaluable for periodic reviews and compliance evidence. The **IAM Access Advisor** is a per-user (or per-role) view showing which AWS services that principal is allowed to access and, crucially, when each was LAST accessed. Access Advisor is the workhorse tool for least-privilege hardening: if a user has `s3:*` permission but Access Advisor shows S3 was never accessed in 12 months, you can confidently remove that permission. Together these tools turn IAM from 'set and forget' into a continuously audited surface.",
    analogy:
      "The Credentials Report is the security guard's clipboard with every employee's badge status — when each badge was last used, whether MFA is enabled, when their password was last changed. The Access Advisor is a year-end performance review for each role: 'Alice is technically allowed in the HR room, but in the past 12 months she's only been in the Engineering room. Do we still need to give her HR access?'",
    diagram: `<svg viewBox="0 0 720 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="IAM credentials report vs access advisor">${svgDefs}
      <rect x="20" y="20" width="680" height="300" rx="10" fill="#1a2332" stroke="#2d3a4f"/>
      <text x="360" y="48" text-anchor="middle" fill="#ff9900" font-size="16" font-weight="700">IAM Security Tools</text>
      <g>
        <rect x="50" y="80" width="290" height="220" rx="8" fill="#243349" stroke="#3b82f6"/>
        <text x="195" y="108" text-anchor="middle" fill="#3b82f6" font-size="13" font-weight="600">Credentials Report</text>
        <text x="195" y="128" text-anchor="middle" fill="#8b949e" font-size="11">account-wide CSV</text>
        <line x1="70" y1="142" x2="320" y2="142" stroke="#3d4d68"/>
        <text x="70" y="162" fill="#e6edf3" font-size="11">▸ user name</text>
        <text x="70" y="180" fill="#e6edf3" font-size="11">▸ password enabled / last used / last rotated</text>
        <text x="70" y="198" fill="#e6edf3" font-size="11">▸ MFA enabled</text>
        <text x="70" y="216" fill="#e6edf3" font-size="11">▸ access keys active / last used / last rotated</text>
        <text x="70" y="234" fill="#e6edf3" font-size="11">▸ has signing certs?</text>
        <text x="70" y="262" fill="#10b981" font-size="11">Use for: compliance audits, rotation policy</text>
        <text x="70" y="282" fill="#10b981" font-size="11">enforcement, stale-credential cleanup</text>
      </g>
      <g>
        <rect x="380" y="80" width="290" height="220" rx="8" fill="#243349" stroke="#10b981"/>
        <text x="525" y="108" text-anchor="middle" fill="#10b981" font-size="13" font-weight="600">Access Advisor</text>
        <text x="525" y="128" text-anchor="middle" fill="#8b949e" font-size="11">per-user / per-role</text>
        <line x1="400" y1="142" x2="650" y2="142" stroke="#3d4d68"/>
        <text x="400" y="162" fill="#e6edf3" font-size="11">▸ list of services the principal can access</text>
        <text x="400" y="180" fill="#e6edf3" font-size="11">▸ last accessed timestamp per service</text>
        <text x="400" y="198" fill="#e6edf3" font-size="11">▸ "never" if granted but unused</text>
        <text x="400" y="216" fill="#e6edf3" font-size="11">▸ also surfaced in policy-generator</text>
        <text x="400" y="244" fill="#10b981" font-size="11">Use for: least-privilege hardening,</text>
        <text x="400" y="262" fill="#10b981" font-size="11">policy right-sizing, unused-permission</text>
        <text x="400" y="280" fill="#10b981" font-size="11">discovery</text>
      </g>
    </svg>`,
    codeExample: {
      language: "bash",
      title: "Generate and inspect both reports via CLI",
      code: `# 1. Generate the credentials report (asynchronous)
aws iam generate-credential-report
# {"State":"STARTED"...}  → poll until COMPLETE

# 2. Download the CSV
aws iam get-credential-report \\
  --query Content --output text | base64 -d > creds-report.csv

# 3. List services a principal CAN access and last access time
aws iam generate-service-last-accessed-details \\
  --arn arn:aws:iam::123456789012:user/alice
# Returns a JobId

aws iam get-service-last-accessed-details --job-id <JobId>
# → ServiceName, LastAuthenticated timestamps`,
    },
    problemStatement:
      "You are a solutions architect at a SaaS company preparing for a SOC 2 audit. The auditor asks for: (1) a list of every IAM user whose access keys are older than 90 days, (2) every user without MFA, and (3) evidence that no user has a permission they haven't used in the past 6 months. Walk through which IAM Security Tools you'd run, in what order, and how you'd turn the raw output into audit-ready evidence.",
    questions: [
      {
        q: "Which IAM tool is BEST for identifying unused permissions on an IAM role?",
        options: [
          "A. IAM Credentials Report",
          "B. IAM Access Advisor",
          "C. AWS Trusted Advisor only",
          "D. CloudTrail Insights",
        ],
        answer: "B",
        explanation:
          "B is correct: Access Advisor explicitly shows the 'last accessed' timestamp per service for each user or role, which is the exact signal needed to identify unused permissions. A reports on credential status, not on permission usage. C is useful for cost and best-practice checks but not the canonical IAM-permission-usage tool. D detects anomalies but doesn't tell you 'this principal has permission X but never uses it.'",
      },
      {
        q: "What does the IAM Credentials Report tell you about each user?",
        options: [
          "A. Which AWS services they have accessed in the last 30 days.",
          "B. The status of their password, access keys, MFA, and signing certs.",
          "C. Their cumulative AWS spend.",
          "D. Their JSON policies as raw text.",
        ],
        answer: "B",
        explanation:
          "B is correct: the report is centered on credential health: password enabled/used/rotated, access keys active/used/rotated, MFA status, certs. A describes Access Advisor. C is a Cost Explorer / Billing concern. D you'd get from `aws iam list-attached-user-policies`, not the credentials report.",
      },
      {
        q: "A compliance team needs evidence that no IAM user's access key is older than 90 days. Which approach is BEST?",
        options: [
          "A. Manually click through every user in the console.",
          "B. Generate the IAM Credentials Report and filter rows where `access_key_1_last_rotated` is older than 90 days.",
          "C. Search CloudTrail for AccessKey events.",
          "D. Restrict the IAM Console to read-only.",
        ],
        answer: "B",
        explanation:
          "B is correct: the credentials report contains exactly this field for both key slots (`access_key_1_last_rotated`, `access_key_2_last_rotated`). A doesn't scale and isn't repeatable. C tells you who used keys, not when they were rotated. D is unrelated — it's an access control, not an evidence-gathering action.",
      },
    ],
  },

  {
    id: "iam-best-practices",
    title: "IAM Guidelines & Best Practices",
    shortLabel: "IAM Best Practices",
    section: "IAM — Identity & Access Management",
    domain: "Identity",
    explanation:
      "The canonical IAM best practices (and frequent exam answers) are: **(1)** never use the root account except for account setup — lock it with MFA, delete its access keys, and put the recovery codes in a safe; **(2)** one physical person = one IAM user — never share credentials; **(3)** assign permissions to groups, not individual users, so additions and removals are atomic; **(4)** enforce a strong password policy and MFA for every user; **(5)** use IAM roles for AWS services and for cross-account access — avoid long-lived access keys whenever possible; **(6)** use access keys only for CLI/SDK programmatic access, and rotate them every 90 days; **(7)** audit continuously with the Credentials Report and Access Advisor; **(8)** never share IAM users or access keys. Internalize these eight rules — exam questions about IAM almost always rephrase one of them as 'which of the following is a security best practice?'",
    analogy:
      "These IAM rules are essentially the cybersecurity equivalent of office key management: don't share keys, lock up the master key, give each employee their own badge, set the badge to expire if they leave, group employees by department to manage access en masse, and audit who's actually been swiping in.",
    diagram: `<svg viewBox="0 0 720 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="IAM best practices checklist">${svgDefs}
      <rect x="20" y="20" width="680" height="320" rx="10" fill="#1a2332" stroke="#2d3a4f"/>
      <text x="360" y="48" text-anchor="middle" fill="#ff9900" font-size="16" font-weight="700">IAM — 8 Commandments</text>
      <g font-family="ui-sans-serif" font-size="12">
        <text x="60" y="90" fill="#10b981">✓</text><text x="80" y="90" fill="#e6edf3">Don't use the root account except for setup — lock it with MFA</text>
        <text x="60" y="118" fill="#10b981">✓</text><text x="80" y="118" fill="#e6edf3">One physical user = one IAM user (never share)</text>
        <text x="60" y="146" fill="#10b981">✓</text><text x="80" y="146" fill="#e6edf3">Assign permissions to groups, not individual users</text>
        <text x="60" y="174" fill="#10b981">✓</text><text x="80" y="174" fill="#e6edf3">Enforce a strong password policy</text>
        <text x="60" y="202" fill="#10b981">✓</text><text x="80" y="202" fill="#e6edf3">Enable MFA — especially for the root account and privileged users</text>
        <text x="60" y="230" fill="#10b981">✓</text><text x="80" y="230" fill="#e6edf3">Use IAM roles for AWS services (EC2, Lambda) instead of access keys</text>
        <text x="60" y="258" fill="#10b981">✓</text><text x="80" y="258" fill="#e6edf3">Rotate access keys regularly (≤ 90 days)</text>
        <text x="60" y="286" fill="#10b981">✓</text><text x="80" y="286" fill="#e6edf3">Audit with Credentials Report + Access Advisor</text>
      </g>
      <rect x="40" y="305" width="640" height="28" rx="6" fill="#0a0e14" stroke="#ff9900"/>
      <text x="360" y="324" text-anchor="middle" fill="#ff9900" font-size="11">Memorize these — they answer half the IAM exam questions.</text>
    </svg>`,
    codeExample: {
      language: "bash",
      title: "Hardening checklist commands",
      code: `# 1. Confirm root has no access keys
aws iam get-account-summary | grep AccountAccessKeysPresent
# AccountAccessKeysPresent should be 0

# 2. Force MFA on console sign-in for everyone in a group
aws iam put-group-policy --group-name AllUsers \\
  --policy-name ForceMFA --policy-document file://force-mfa.json

# 3. List access keys older than 90 days
aws iam list-users --query 'Users[].UserName' --output text | \\
  xargs -n1 -I{} aws iam list-access-keys --user-name {} \\
    --query "AccessKeyMetadata[?CreateDate<\`$(date -d '90 days ago' -u +%Y-%m-%dT%H:%M:%SZ)\`].[UserName,AccessKeyId,CreateDate]" \\
    --output text

# 4. Detect users without MFA
aws iam generate-credential-report
# Then parse CSV, flag rows where mfa_active=false`,
    },
    problemStatement:
      "You are a solutions architect doing a security audit at a new client. You discover: the root account has active access keys, three engineers share one IAM user named 'developer', nobody has MFA, and one IAM user holds AdministratorAccess directly attached. Write a one-paragraph remediation plan ranked by impact — what you'd fix first, second, and third — and explain which IAM best practice each step addresses.",
    questions: [
      {
        q: "Which is NOT a recommended IAM best practice?",
        options: [
          "A. Never share access keys between users.",
          "B. Use the root account for daily administrative work.",
          "C. Attach permissions to groups, not individual users.",
          "D. Enforce MFA on the root account and all privileged users.",
        ],
        answer: "B",
        explanation:
          "B is correct (the wrong practice): the root account should NEVER be used for daily admin — only for the handful of tasks that genuinely require it. A, C, and D are all canonical best practices.",
      },
      {
        q: "An engineer suggests creating one shared IAM user named 'devteam' so the whole team can use the same credentials. What is the BEST response?",
        options: [
          "A. Approve — it's simpler to manage one user than ten.",
          "B. Reject — shared credentials break accountability and violate the 'one physical user = one IAM user' rule.",
          "C. Approve, but rotate the password monthly.",
          "D. Approve, but enable MFA on the shared user.",
        ],
        answer: "B",
        explanation:
          "B is correct: shared credentials destroy auditability (CloudTrail can't tell who actually made an action) and violate the one-person-one-user principle. A, C, and D all keep the bad pattern in place even with mitigations.",
      },
      {
        q: "A solutions architect needs to grant an EC2 application access to S3. Which method aligns BEST with IAM best practices?",
        options: [
          "A. Create an IAM user, generate access keys, store them in /etc/app.env on the instance.",
          "B. Attach an IAM role to the EC2 instance with only the required S3 permissions.",
          "C. Use the root credentials for simplicity.",
          "D. Make the bucket public so the app doesn't need credentials.",
        ],
        answer: "B",
        explanation:
          "B is correct: this is the textbook least-privilege, no-long-lived-key, IAM-roles-for-services pattern. A keeps long-lived keys on disk — leak-prone. C is the worst possible answer. D is a public-bucket security incident waiting to happen.",
      },
    ],
  },

  // =================================================================
  // SECTION 3: EC2 BASICS
  // =================================================================
  {
    id: "ec2-overview",
    title: "Amazon EC2 Overview",
    shortLabel: "EC2 Overview",
    section: "Amazon EC2 — Basics",
    domain: "Compute",
    explanation:
      "Amazon Elastic Compute Cloud (EC2) is AWS's flagship Infrastructure-as-a-Service (IaaS) offering. It gives you on-demand virtual machines — called instances — that you can boot in seconds, configure with any combination of CPU, memory, storage, and network performance, and shut down (paying nothing further) when you're done. EC2 is the building block underneath a huge fraction of AWS workloads: web servers, databases, batch jobs, containers, ML training, dev environments. Around EC2 sits a family of services you'll meet next: **EBS** (network-attached block storage), **ELB** (load balancers), and **ASG** (Auto Scaling Groups) for elastic horizontal scaling. Mastering EC2 is essential because almost every other AWS service either runs on EC2 (Lambda, ECS, RDS) or interacts with it.",
    analogy:
      "EC2 is like renting a car instead of buying one. You pick the model (instance type), the size of the trunk (storage), the engine class (CPU/RAM), the rental duration, and you can swap it for a different car at any time. You pay only when you're driving — when you return it, no further bills. Owning your own server is buying the car: massive upfront cost, depreciation, and you have to garage it whether you use it or not.",
    diagram: `<svg viewBox="0 0 720 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="EC2 instance with related AWS services">${svgDefs}
      <rect x="20" y="20" width="680" height="300" rx="10" fill="#1a2332" stroke="#2d3a4f"/>
      <text x="360" y="48" text-anchor="middle" fill="#ff9900" font-size="16" font-weight="700">Amazon EC2 — and friends</text>
      <g>
        <rect x="270" y="120" width="180" height="100" rx="8" fill="#243349" stroke="#ff9900" stroke-width="2"/>
        <text x="360" y="148" text-anchor="middle" fill="#ff9900" font-size="14" font-weight="700">EC2 Instance</text>
        <text x="360" y="170" text-anchor="middle" fill="#e6edf3" font-size="11">virtual machine</text>
        <text x="360" y="188" text-anchor="middle" fill="#e6edf3" font-size="11">CPU · RAM · OS</text>
        <text x="360" y="206" text-anchor="middle" fill="#8b949e" font-size="11">priced per second / hour</text>
      </g>
      <g>
        <rect x="50" y="80" width="160" height="60" rx="6" fill="#1a2332" stroke="#3d4d68"/>
        <text x="130" y="105" text-anchor="middle" fill="#e6edf3" font-size="12">EBS volume</text>
        <text x="130" y="123" text-anchor="middle" fill="#8b949e" font-size="10">network block storage</text>
      </g>
      <line x1="210" y1="115" x2="270" y2="155" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <g>
        <rect x="510" y="80" width="160" height="60" rx="6" fill="#1a2332" stroke="#3d4d68"/>
        <text x="590" y="105" text-anchor="middle" fill="#e6edf3" font-size="12">ELB (Load Balancer)</text>
        <text x="590" y="123" text-anchor="middle" fill="#8b949e" font-size="10">distributes traffic</text>
      </g>
      <line x1="510" y1="115" x2="450" y2="155" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow-mute)"/>
      <g>
        <rect x="50" y="240" width="160" height="60" rx="6" fill="#1a2332" stroke="#3d4d68"/>
        <text x="130" y="265" text-anchor="middle" fill="#e6edf3" font-size="12">Auto Scaling Group</text>
        <text x="130" y="283" text-anchor="middle" fill="#8b949e" font-size="10">scales instance count</text>
      </g>
      <line x1="210" y1="265" x2="270" y2="225" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <g>
        <rect x="510" y="240" width="160" height="60" rx="6" fill="#1a2332" stroke="#3d4d68"/>
        <text x="590" y="265" text-anchor="middle" fill="#e6edf3" font-size="12">Security Group</text>
        <text x="590" y="283" text-anchor="middle" fill="#8b949e" font-size="10">virtual firewall</text>
      </g>
      <line x1="510" y1="265" x2="450" y2="225" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow-mute)"/>
    </svg>`,
    codeExample: {
      language: "bash",
      title: "Launch an EC2 instance from the CLI",
      code: `aws ec2 run-instances \\
  --image-id ami-0abcd1234efgh5678 \\
  --instance-type t3.micro \\
  --key-name my-keypair \\
  --security-group-ids sg-0123456789abcdef0 \\
  --subnet-id subnet-0123456789abcdef0 \\
  --tag-specifications \\
    'ResourceType=instance,Tags=[{Key=Name,Value=web-01},{Key=Env,Value=dev}]' \\
  --user-data file://bootstrap.sh

# Inspect, stop, start, terminate
aws ec2 describe-instances --instance-ids i-0abc
aws ec2 stop-instances     --instance-ids i-0abc
aws ec2 start-instances    --instance-ids i-0abc
aws ec2 terminate-instances --instance-ids i-0abc`,
    },
    problemStatement:
      "You are a solutions architect at a content-publishing company. Marketing wants a basic WordPress site for an upcoming product launch. They need it live within two hours, expect 1,000 visitors/day after launch, and have a tight budget. Outline an EC2-based design: which instance type you'd pick for the t-shirt size (light dev/test class vs production class), how you'd protect data with EBS, and what role ELB + ASG would play if traffic ever spiked 10×.",
    questions: [
      {
        q: "Amazon EC2 is classified as which type of cloud service?",
        options: [
          "A. Software as a Service (SaaS)",
          "B. Platform as a Service (PaaS)",
          "C. Infrastructure as a Service (IaaS)",
          "D. Function as a Service (FaaS)",
        ],
        answer: "C",
        explanation:
          "C is correct: EC2 gives you raw virtual machines — you manage the OS and everything above. A (SaaS) is finished apps like Office 365. B (PaaS) is managed platforms like Elastic Beanstalk. D (FaaS) is Lambda.",
      },
      {
        q: "Which AWS service provides on-demand virtual servers that can be rented by the second?",
        options: [
          "A. Amazon S3",
          "B. Amazon EC2",
          "C. Amazon SQS",
          "D. AWS CloudFormation",
        ],
        answer: "B",
        explanation:
          "B is correct. A is object storage, C is message queues, D is infrastructure-as-code templating.",
      },
      {
        q: "Which set of related AWS services typically surrounds EC2 in a production architecture?",
        options: [
          "A. S3, Glacier, and DynamoDB",
          "B. EBS, ELB, and Auto Scaling Groups",
          "C. Lambda, API Gateway, and DynamoDB",
          "D. CloudFront, Route 53, and WAF",
        ],
        answer: "B",
        explanation:
          "B is correct: EBS provides persistent block storage, ELB distributes traffic across instances, and Auto Scaling Groups grow/shrink the instance count — these are the building blocks of a classic EC2-based web tier. A is mostly storage services. C is a serverless stack. D is the global edge layer (still useful but not the EC2 building blocks).",
      },
    ],
  },

  {
    id: "ec2-config-options",
    title: "EC2 Sizing & Configuration Options",
    shortLabel: "EC2 Configuration",
    section: "Amazon EC2 — Basics",
    domain: "Compute",
    explanation:
      "When you launch an EC2 instance you choose seven dimensions: (1) **Operating System** — Linux, Windows, or macOS via an Amazon Machine Image (AMI); (2) **Compute power** — number of vCPU cores and processor family; (3) **Memory** — RAM allocated to the instance; (4) **Storage** — either network-attached EBS / EFS or hardware-attached EC2 Instance Store; (5) **Network card** — the speed of the virtual NIC and an optional public IPv4 address; (6) **Firewall rules** — one or more Security Groups attached to the network interface; (7) **Bootstrap script** — EC2 User Data, run automatically on first boot. Each instance type bundles a fixed set of CPU, memory, and network performance — you only choose the size; you don't dial these independently.",
    analogy:
      "Configuring an EC2 instance is like spec'ing a laptop on a manufacturer's website. You pick the OS, CPU class, RAM, storage type (SSD vs. external drive), the WiFi/Ethernet card grade, the firewall app you'll install, and a setup script the IT team runs on first boot. The difference: with EC2 you can throw the laptop away after 10 minutes and pay literal cents.",
    diagram: `<svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="EC2 configuration dimensions">${svgDefs}
      <rect x="20" y="20" width="680" height="280" rx="10" fill="#1a2332" stroke="#2d3a4f"/>
      <text x="360" y="48" text-anchor="middle" fill="#ff9900" font-size="16" font-weight="700">EC2 — 7 configuration dimensions</text>
      <g font-size="12">
        <rect x="40" y="80" width="200" height="60" rx="6" fill="#243349" stroke="#3d4d68"/>
        <text x="140" y="103" text-anchor="middle" fill="#ff9900" font-weight="600">1. OS / AMI</text>
        <text x="140" y="122" text-anchor="middle" fill="#b0bac6" font-size="11">Linux · Windows · macOS</text>
        <rect x="260" y="80" width="200" height="60" rx="6" fill="#243349" stroke="#3d4d68"/>
        <text x="360" y="103" text-anchor="middle" fill="#ff9900" font-weight="600">2. CPU (vCPU)</text>
        <text x="360" y="122" text-anchor="middle" fill="#b0bac6" font-size="11">cores, processor family</text>
        <rect x="480" y="80" width="200" height="60" rx="6" fill="#243349" stroke="#3d4d68"/>
        <text x="580" y="103" text-anchor="middle" fill="#ff9900" font-weight="600">3. Memory (RAM)</text>
        <text x="580" y="122" text-anchor="middle" fill="#b0bac6" font-size="11">GiB allocated</text>
        <rect x="40" y="155" width="200" height="60" rx="6" fill="#243349" stroke="#3d4d68"/>
        <text x="140" y="178" text-anchor="middle" fill="#ff9900" font-weight="600">4. Storage</text>
        <text x="140" y="197" text-anchor="middle" fill="#b0bac6" font-size="11">EBS · EFS · Instance Store</text>
        <rect x="260" y="155" width="200" height="60" rx="6" fill="#243349" stroke="#3d4d68"/>
        <text x="360" y="178" text-anchor="middle" fill="#ff9900" font-weight="600">5. Network card</text>
        <text x="360" y="197" text-anchor="middle" fill="#b0bac6" font-size="11">speed + public IPv4</text>
        <rect x="480" y="155" width="200" height="60" rx="6" fill="#243349" stroke="#3d4d68"/>
        <text x="580" y="178" text-anchor="middle" fill="#ff9900" font-weight="600">6. Security Group</text>
        <text x="580" y="197" text-anchor="middle" fill="#b0bac6" font-size="11">firewall rules</text>
        <rect x="160" y="230" width="400" height="60" rx="6" fill="#243349" stroke="#ff9900"/>
        <text x="360" y="253" text-anchor="middle" fill="#ff9900" font-weight="600">7. User Data (bootstrap script)</text>
        <text x="360" y="272" text-anchor="middle" fill="#b0bac6" font-size="11">runs once at first boot — install + configure</text>
      </g>
    </svg>`,
    codeExample: {
      language: "bash",
      title: "Launch with custom AMI, type, key, SG, and user data",
      code: `aws ec2 run-instances \\
  --image-id ami-0abcd1234efgh5678 \\
  --instance-type m5.large \\
  --key-name prod-key \\
  --security-group-ids sg-0a1b2c3d4e5f \\
  --subnet-id subnet-0a1b2c3d4e5f \\
  --block-device-mappings '[{
    "DeviceName": "/dev/xvda",
    "Ebs": { "VolumeSize": 30, "VolumeType": "gp3", "DeleteOnTermination": true }
  }]' \\
  --user-data file://bootstrap.sh \\
  --iam-instance-profile Name=AppReadS3Profile`,
    },
    problemStatement:
      "You are a solutions architect at a SaaS analytics startup. The data team wants an EC2 instance for ad-hoc Spark jobs — typically 32 GiB RAM, 8 vCPU, fast local SSD for shuffles, accessible only from the office network on SSH, and pre-configured with the company's Python toolchain on every boot. List the seven configuration choices you'd make and justify each.",
    questions: [
      {
        q: "Which of the following is NOT a configuration dimension you choose when launching an EC2 instance?",
        options: ["A. Operating System", "B. CPU and RAM size (via instance type)", "C. Cloud Region's pricing tier", "D. Security Group"],
        answer: "C",
        explanation:
          "C is correct: pricing is a property of the Region you launch in, not a knob you set per instance. A, B, D are all standard configuration dimensions.",
      },
      {
        q: "Which EC2 dimension is responsible for installing software automatically on first boot?",
        options: ["A. AMI version tag", "B. EC2 User Data", "C. Security Group inbound rule", "D. IAM instance profile"],
        answer: "B",
        explanation:
          "B is correct: User Data is the bootstrap script that runs once on first boot as root. A is just metadata. C controls network access. D supplies AWS credentials but doesn't install OS packages.",
      },
      {
        q: "A team needs Windows-based instances. Which configuration dimension determines this?",
        options: ["A. Instance type", "B. AMI (Amazon Machine Image)", "C. Security Group", "D. Region"],
        answer: "B",
        explanation:
          "B is correct: the AMI determines the OS (Windows Server 2022 AMI vs. Amazon Linux 2 AMI, etc.). A determines compute resources but works with any OS. C and D are unrelated to OS choice.",
      },
    ],
  },

  {
    id: "ec2-user-data",
    title: "EC2 User Data — Bootstrap Scripts",
    shortLabel: "User Data",
    section: "Amazon EC2 — Basics",
    domain: "Compute",
    explanation:
      "EC2 User Data is a script (typically bash on Linux, PowerShell on Windows) that you pass at instance launch time. The cloud-init service runs it **once, on first boot, as the root user**. Use it to install updates, install packages (yum, apt, choco), fetch artifacts from S3, write configuration files, register the instance with a load balancer or monitoring agent, or start your application. Because it runs as root and only once, User Data is the canonical way to 'bake in' first-time configuration without baking a new AMI. It's stored in the instance metadata and retrievable from http://169.254.169.254/latest/user-data — useful for debugging but also a reminder not to store secrets there in plaintext.",
    analogy:
      "User Data is the welcome packet stapled to a hotel guest's keycard. On check-in, the front desk hands it over and the bellhop reads it once — unpack the suitcase, hang the suit, set the thermostat to 21°C. The guest never sees the packet again, and re-reading it on later visits wouldn't make sense.",
    diagram: `<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="EC2 user data first-boot execution">${svgDefs}
      <rect x="20" y="20" width="680" height="260" rx="10" fill="#1a2332" stroke="#2d3a4f"/>
      <text x="360" y="48" text-anchor="middle" fill="#ff9900" font-size="16" font-weight="700">EC2 User Data — runs once at first boot</text>
      <rect x="40" y="80" width="200" height="140" rx="8" fill="#243349" stroke="#3b82f6"/>
      <text x="140" y="108" text-anchor="middle" fill="#3b82f6" font-size="13" font-weight="600">Launch request</text>
      <text x="140" y="135" text-anchor="middle" fill="#e6edf3" font-size="11">run-instances</text>
      <text x="140" y="155" text-anchor="middle" fill="#e6edf3" font-size="11">--user-data file://init.sh</text>
      <text x="140" y="195" text-anchor="middle" fill="#8b949e" font-size="10">base64-encoded</text>
      <line x1="245" y1="150" x2="295" y2="150" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <rect x="300" y="80" width="200" height="140" rx="8" fill="#243349" stroke="#ff9900"/>
      <text x="400" y="108" text-anchor="middle" fill="#ff9900" font-size="13" font-weight="600">cloud-init (first boot)</text>
      <text x="400" y="135" text-anchor="middle" fill="#e6edf3" font-size="11">runs script as root</text>
      <text x="400" y="155" text-anchor="middle" fill="#e6edf3" font-size="11">writes /var/log/cloud-init-output.log</text>
      <text x="400" y="195" text-anchor="middle" fill="#10b981" font-size="11">subsequent reboots → skipped</text>
      <line x1="505" y1="150" x2="555" y2="150" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <rect x="560" y="80" width="120" height="140" rx="8" fill="#243349" stroke="#10b981"/>
      <text x="620" y="120" text-anchor="middle" fill="#10b981" font-size="13" font-weight="600">Ready</text>
      <text x="620" y="148" text-anchor="middle" fill="#e6edf3" font-size="11">app installed</text>
      <text x="620" y="168" text-anchor="middle" fill="#e6edf3" font-size="11">service started</text>
      <text x="620" y="200" text-anchor="middle" fill="#8b949e" font-size="10">ASG-ready</text>
      <text x="360" y="255" text-anchor="middle" fill="#b0bac6" font-size="11">Retrievable at http://169.254.169.254/latest/user-data  ·  Don't store secrets here in plaintext</text>
    </svg>`,
    codeExample: {
      language: "bash",
      title: "User data script — install Apache + custom homepage",
      code: `#!/bin/bash
# This script runs on first boot as root.
yum update -y
yum install -y httpd
systemctl enable --now httpd

# Drop a custom landing page
EC2_ID=$(curl -s http://169.254.169.254/latest/meta-data/instance-id)
cat > /var/www/html/index.html <<HTML
<h1>Hello from $EC2_ID</h1>
<p>Booted $(date -u +%FT%TZ)</p>
HTML

# Tag the boot complete (useful for ASG health checks)
echo "user-data complete" > /var/log/bootstrap.done`,
    },
    problemStatement:
      "You are a solutions architect at a betting-platform company. Every new EC2 instance in the autoscaling group must be running NGINX with a specific config, the Datadog agent, and the application JAR pulled from a versioned S3 bucket — all without human intervention, and on every freshly-launched instance. Outline how you'd structure the User Data script, what should run there vs. be baked into a custom AMI, and how you'd verify the script ran successfully.",
    questions: [
      {
        q: "How often does EC2 User Data execute by default?",
        options: ["A. On every reboot", "B. Once, on first boot only", "C. Every 5 minutes via cron", "D. When you SSH in"],
        answer: "B",
        explanation:
          "B is correct: cloud-init runs User Data exactly once on first boot. A would re-run installations and break idempotency; you can override with `cloud-init-per` but the default is once. C and D are invented.",
      },
      {
        q: "Under which Linux user does User Data execute?",
        options: ["A. The ec2-user account", "B. The root user", "C. The user you specify with --user", "D. A locked-down 'cloud-init' service account"],
        answer: "B",
        explanation:
          "B is correct: User Data runs as root, which is why you can install packages without sudo. A is the default login user, not the script runner. C is invented (there is no --user flag). D is wrong: cloud-init runs as root.",
      },
      {
        q: "Where is User Data retrievable from inside a running instance?",
        options: [
          "A. http://169.254.169.254/latest/user-data",
          "B. /etc/aws/user-data.sh",
          "C. The AWS Console only",
          "D. ~/.aws/user-data",
        ],
        answer: "A",
        explanation:
          "A is correct: it's exposed via the instance metadata service at the link-local 169.254.169.254 address. B, C, and D are not standard locations.",
      },
    ],
  },

  {
    id: "ec2-instance-types",
    title: "EC2 Instance Types — Naming Convention",
    shortLabel: "Instance Types",
    section: "Amazon EC2 — Basics",
    domain: "Compute",
    explanation:
      "AWS publishes hundreds of EC2 instance types organized by **family**, **generation**, and **size**. The naming convention is `<family><generation>.<size>` — for example `m5.2xlarge` means family `m` (general-purpose), generation 5 (newer = faster, cheaper per unit of work), size `2xlarge` (twice the vCPU/RAM of xlarge). Common family letters: `t` (burstable), `m` (balanced/general), `c` (compute-heavy), `r` (memory-heavy), `i`/`d` (storage I/O), `g`/`p` (GPU), `x`/`z` (extreme memory). Sizes go nano → micro → small → medium → large → xlarge → 2xlarge → … 24xlarge → metal (bare-metal). Picking the wrong family wastes money; picking the wrong size wastes money or starves the workload.",
    analogy:
      "Instance-type naming is like reading a car model code. `m5.2xlarge` is like 'Honda Civic 2023 Sedan' — Honda (general-purpose family), 2023 (generation, newer engine), Sedan (size class). A `c7g.4xlarge` is the high-performance trim. Once you know the family letters, every cryptic name becomes legible at a glance.",
    diagram: `<svg viewBox="0 0 720 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="EC2 instance type naming convention breakdown">${svgDefs}
      <rect x="20" y="20" width="680" height="240" rx="10" fill="#1a2332" stroke="#2d3a4f"/>
      <text x="360" y="48" text-anchor="middle" fill="#ff9900" font-size="16" font-weight="700">m5.2xlarge — anatomy</text>
      <rect x="200" y="80" width="320" height="80" rx="8" fill="#0a0e14" stroke="#ff9900"/>
      <text x="240" y="135" fill="#ff9900" font-family="monospace" font-size="36" font-weight="700">m</text>
      <text x="285" y="135" fill="#10b981" font-family="monospace" font-size="36" font-weight="700">5</text>
      <text x="320" y="135" fill="#b0bac6" font-family="monospace" font-size="36">.</text>
      <text x="340" y="135" fill="#3b82f6" font-family="monospace" font-size="36" font-weight="700">2xlarge</text>
      <g font-size="11">
        <line x1="245" y1="170" x2="245" y2="195" stroke="#ff9900"/>
        <text x="245" y="215" text-anchor="middle" fill="#ff9900" font-weight="600">family</text>
        <text x="245" y="232" text-anchor="middle" fill="#b0bac6">m = general-purpose</text>
        <text x="245" y="248" text-anchor="middle" fill="#8b949e">t · c · r · i · g · x …</text>
      </g>
      <g font-size="11">
        <line x1="298" y1="170" x2="298" y2="195" stroke="#10b981"/>
        <text x="298" y="215" text-anchor="middle" fill="#10b981" font-weight="600">generation</text>
        <text x="298" y="232" text-anchor="middle" fill="#b0bac6">5 (higher = newer)</text>
        <text x="298" y="248" text-anchor="middle" fill="#8b949e">faster · cheaper</text>
      </g>
      <g font-size="11">
        <line x1="420" y1="170" x2="420" y2="195" stroke="#3b82f6"/>
        <text x="420" y="215" text-anchor="middle" fill="#3b82f6" font-weight="600">size</text>
        <text x="420" y="232" text-anchor="middle" fill="#b0bac6">2× the vCPU/RAM of xlarge</text>
        <text x="420" y="248" text-anchor="middle" fill="#8b949e">nano → metal</text>
      </g>
    </svg>`,
    codeExample: {
      language: "bash",
      title: "List instance types available in a Region with key specs",
      code: `aws ec2 describe-instance-types \\
  --filters "Name=instance-type,Values=m5.*,c5.*,r5.*" \\
  --query 'InstanceTypes[].[InstanceType,VCpuInfo.DefaultVCpus,MemoryInfo.SizeInMiB,NetworkInfo.NetworkPerformance]' \\
  --output table

# Find the cheapest type that meets minimum specs
aws ec2 describe-instance-types \\
  --filters "Name=vcpu-info.default-vcpus,Values=4" \\
            "Name=memory-info.size-in-mib,Values=16384" \\
  --query 'InstanceTypes[].InstanceType' \\
  --output text`,
    },
    problemStatement:
      "You are a solutions architect at a fintech company. Three workloads need EC2: (1) a low-traffic admin dashboard that idles 95% of the time but bursts at month-end, (2) a Java batch job that crunches numbers for 4 hours every night, and (3) an in-memory Redis cache holding 200 GB of working set. Recommend a family letter for each workload and explain why mixing the wrong family wastes money.",
    questions: [
      {
        q: "What does the `5` mean in the instance type `m5.2xlarge`?",
        options: ["A. 5 vCPUs", "B. The generation — newer is generally faster and cheaper", "C. 5 GiB of memory", "D. The major version of the AMI"],
        answer: "B",
        explanation:
          "B is correct: the number after the family letter is the generation. A is wrong: vCPU count is implied by the size, not the digit. C is wrong: RAM is a function of size + family. D is invented.",
      },
      {
        q: "An application requires the highest memory-to-CPU ratio for an in-memory database. Which instance family is BEST?",
        options: ["A. t3 (burstable)", "B. c5 (compute optimized)", "C. r5 (memory optimized)", "D. i3 (storage optimized)"],
        answer: "C",
        explanation:
          "C is correct: r-family instances are memory-optimized (8+ GiB RAM per vCPU). A is general-purpose burstable. B is compute-heavy with LESS memory per CPU. D optimizes for local SSD IOPS, not RAM.",
      },
      {
        q: "Which instance size is 2× the vCPU/RAM of `m5.xlarge`?",
        options: ["A. m5.large", "B. m5.medium", "C. m5.2xlarge", "D. m5.metal"],
        answer: "C",
        explanation:
          "C is correct: 2xlarge is exactly twice the vCPU and RAM of xlarge in the same family. A and B are smaller. D is bare-metal (the largest, exposes the host hardware).",
      },
    ],
  },

  {
    id: "ec2-instance-families",
    title: "EC2 Families — General, Compute, Memory, Storage",
    shortLabel: "Instance Families",
    section: "Amazon EC2 — Basics",
    domain: "Compute",
    explanation:
      "EC2 families are grouped by what they optimize for. **General Purpose** (t-, m-) balances CPU, memory, and network — great for web servers, code repos, small databases (free-tier t2.micro is here). **Compute Optimized** (c-) maximizes vCPU and clock speed for batch processing, high-performance web servers, scientific modeling, HPC, dedicated game servers. **Memory Optimized** (r-, x-, z-) gives the most RAM per dollar — ideal for in-memory caches, relational/NoSQL DBs sized to RAM, real-time big-data, SAP HANA. **Storage Optimized** (i-, d-, h-) attaches very fast NVMe local SSDs delivering hundreds of thousands of IOPS — ideal for OLTP DBs, distributed file systems, data warehouses, large transactional systems. Beyond these, **Accelerated** (g-, p-, inf-, trn-) bundles GPUs/AI accelerators and **HPC Optimized** (hpc-) tunes for tightly coupled MPI workloads.",
    analogy:
      "Picking a family is like picking the right kitchen appliance. A blender (general) handles 80% of cooking tasks. A pressure cooker (compute) speeds up CPU-heavy tasks. A standing fridge (memory) gives you huge cold storage to grab from instantly. A deep freezer with USB-3 (storage) is for bulk frozen inventory you scan in/out fast. You wouldn't pay for a deep freezer just to make smoothies.",
    diagram: `<svg viewBox="0 0 720 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="EC2 instance families overview">${svgDefs}
      <rect x="20" y="20" width="680" height="300" rx="10" fill="#1a2332" stroke="#2d3a4f"/>
      <text x="360" y="48" text-anchor="middle" fill="#ff9900" font-size="16" font-weight="700">EC2 Instance Families</text>
      <g>
        <rect x="40" y="75" width="320" height="115" rx="8" fill="#243349" stroke="#ff9900"/>
        <text x="55" y="100" fill="#ff9900" font-size="13" font-weight="700">General Purpose (t, m)</text>
        <text x="55" y="122" fill="#e6edf3" font-size="11">Balanced compute, memory, network</text>
        <text x="55" y="142" fill="#b0bac6" font-size="11">Use: web servers, code repos, small DBs</text>
        <text x="55" y="162" fill="#8b949e" font-size="11">Example: t3.micro, m5.large</text>
        <text x="55" y="180" fill="#10b981" font-size="11">t-family is burstable (CPU credits)</text>
      </g>
      <g>
        <rect x="370" y="75" width="320" height="115" rx="8" fill="#243349" stroke="#3b82f6"/>
        <text x="385" y="100" fill="#3b82f6" font-size="13" font-weight="700">Compute Optimized (c)</text>
        <text x="385" y="122" fill="#e6edf3" font-size="11">Highest CPU per dollar</text>
        <text x="385" y="142" fill="#b0bac6" font-size="11">Use: batch, HPC, ML inference, game servers</text>
        <text x="385" y="162" fill="#8b949e" font-size="11">Example: c5.4xlarge, c7g.16xlarge</text>
        <text x="385" y="180" fill="#10b981" font-size="11">Lower memory:vCPU ratio than m</text>
      </g>
      <g>
        <rect x="40" y="200" width="320" height="105" rx="8" fill="#243349" stroke="#10b981"/>
        <text x="55" y="225" fill="#10b981" font-size="13" font-weight="700">Memory Optimized (r, x, z)</text>
        <text x="55" y="247" fill="#e6edf3" font-size="11">Highest RAM per dollar</text>
        <text x="55" y="267" fill="#b0bac6" font-size="11">Use: in-memory DB, real-time BI, SAP HANA</text>
        <text x="55" y="285" fill="#8b949e" font-size="11">Example: r5.16xlarge, x1e.32xlarge</text>
      </g>
      <g>
        <rect x="370" y="200" width="320" height="105" rx="8" fill="#243349" stroke="#f59e0b"/>
        <text x="385" y="225" fill="#f59e0b" font-size="13" font-weight="700">Storage Optimized (i, d, h)</text>
        <text x="385" y="247" fill="#e6edf3" font-size="11">Local NVMe SSD, millions of IOPS</text>
        <text x="385" y="267" fill="#b0bac6" font-size="11">Use: OLTP DBs, data warehouses, HDFS</text>
        <text x="385" y="285" fill="#8b949e" font-size="11">Example: i3.16xlarge, d3.8xlarge</text>
      </g>
    </svg>`,
    codeExample: {
      language: "bash",
      title: "Right-sizing: pick a family then size from a candidate set",
      code: `# Compare families side-by-side
for t in t3.large m5.large c5.large r5.large; do
  aws ec2 describe-instance-types --instance-types $t \\
    --query 'InstanceTypes[0].[InstanceType,VCpuInfo.DefaultVCpus,MemoryInfo.SizeInMiB]' \\
    --output text
done
# t3.large  2  8192
# m5.large  2  8192
# c5.large  2  4096   ← less RAM, but newer/faster cores
# r5.large  2 16384   ← double the RAM for memory-hungry workloads`,
    },
    problemStatement:
      "You are a solutions architect at a video-streaming company. Engineering has three workloads: (1) front-end nginx web tier serving HLS manifests at 10k RPS, (2) FFmpeg transcoding jobs that fully saturate every vCPU for ~3 minutes per video, (3) a Redis cluster caching 800 GB of recommendation embeddings. Pick the right family for each (general/compute/memory/storage) and explain how a single wrong choice can blow your monthly bill.",
    questions: [
      {
        q: "Which instance family is BEST for a CPU-bound video transcoding workload?",
        options: ["A. t3 (burstable)", "B. c5 (compute optimized)", "C. r6g (memory optimized)", "D. i3 (storage optimized)"],
        answer: "B",
        explanation:
          "B is correct: transcoding is CPU-bound, so c-family delivers the highest sustained CPU per dollar. A bursts only briefly and isn't designed for sustained heavy CPU. C wastes money on RAM the workload doesn't need. D pays for fast local storage that's unused.",
      },
      {
        q: "A 500 GB in-memory Redis cluster needs to fit entirely in RAM with low latency. Which family is the BEST fit?",
        options: ["A. m5 (general purpose)", "B. c5n (compute, enhanced networking)", "C. r5 (memory optimized)", "D. d3 (dense storage)"],
        answer: "C",
        explanation:
          "C is correct: r-family delivers the highest memory-per-dollar — ideal for in-memory data stores. A could work but you'd pay more for less RAM. B is compute-tilted with less RAM per dollar. D is bulk HDD storage, not RAM-heavy.",
      },
      {
        q: "A company runs a high-throughput PostgreSQL OLTP database that needs hundreds of thousands of local-disk IOPS for WAL and tables. Which family is BEST?",
        options: ["A. t3.large", "B. m5.4xlarge", "C. i3.4xlarge (storage optimized, local NVMe)", "D. p4d (GPU)"],
        answer: "C",
        explanation:
          "C is correct: i-family attaches local NVMe SSDs delivering massive IOPS — perfect for OLTP and distributed file systems. A is way too small. B uses EBS only, with much lower local-disk IOPS. D is GPU-focused, wasted for a DB workload.",
      },
    ],
  },

  {
    id: "security-groups",
    title: "Security Groups — EC2 Firewall",
    shortLabel: "Security Groups",
    section: "Amazon EC2 — Basics",
    domain: "Networking",
    explanation:
      "Security Groups (SGs) are virtual firewalls attached to the elastic network interface of each EC2 instance (and other VPC resources like RDS, ALBs). They are **stateful** (return traffic is automatically allowed) and contain **allow-only rules** — there is no explicit deny. A rule says: 'allow this protocol + port range from this source (a CIDR block OR another security group OR a prefix list)'. By default an SG has ZERO inbound rules (deny all) and an allow-all outbound rule. SGs live outside the instance, so if traffic is blocked, the instance never sees it. You can attach up to 5 SGs to an interface, and rules can reference other SGs by ID — a powerful pattern for letting a 'web' SG talk to a 'db' SG without hard-coding IPs.",
    analogy:
      "A Security Group is the bouncer at the door of each EC2 instance. Inbound rules are the guest list ('only people from these specific addresses on these specific dates may enter'). Outbound rules are 'anyone can leave by any door' by default. Stateful means once the bouncer lets a guest in, they don't re-check them on the way out. The bouncer stops people in the lobby — they never even reach the instance — which is why a misconfigured SG causes a connection TIMEOUT rather than a 'connection refused'.",
    diagram: `<svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Security group filters inbound and outbound traffic to EC2">${svgDefs}
      <rect x="20" y="20" width="680" height="280" rx="10" fill="#1a2332" stroke="#2d3a4f"/>
      <text x="360" y="48" text-anchor="middle" fill="#ff9900" font-size="16" font-weight="700">Security Group — stateful, allow-only</text>
      <rect x="50" y="80" width="140" height="60" rx="6" fill="#243349" stroke="#3d4d68"/>
      <text x="120" y="105" text-anchor="middle" fill="#e6edf3" font-size="12">Browser</text>
      <text x="120" y="123" text-anchor="middle" fill="#8b949e" font-size="10">203.0.113.4</text>
      <line x1="195" y1="110" x2="245" y2="110" stroke="#10b981" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="220" y="100" text-anchor="middle" fill="#10b981" font-size="10">:443 ✓</text>
      <rect x="50" y="180" width="140" height="60" rx="6" fill="#243349" stroke="#3d4d68"/>
      <text x="120" y="205" text-anchor="middle" fill="#e6edf3" font-size="12">Attacker</text>
      <text x="120" y="223" text-anchor="middle" fill="#8b949e" font-size="10">198.51.100.5</text>
      <line x1="195" y1="210" x2="245" y2="210" stroke="#ef4444" stroke-width="2" marker-end="url(#arrow-mute)"/>
      <text x="220" y="200" text-anchor="middle" fill="#ef4444" font-size="10">:22 ✗ blocked</text>
      <rect x="250" y="60" width="200" height="200" rx="8" fill="#243349" stroke="#ff9900" stroke-width="2"/>
      <text x="350" y="85" text-anchor="middle" fill="#ff9900" font-size="12" font-weight="700">Security Group</text>
      <text x="265" y="110" fill="#e6edf3" font-size="11">Inbound:</text>
      <text x="265" y="128" fill="#10b981" font-size="10">  tcp 443  ←  0.0.0.0/0</text>
      <text x="265" y="146" fill="#10b981" font-size="10">  tcp 22   ←  203.0.113.0/24</text>
      <text x="265" y="170" fill="#e6edf3" font-size="11">Outbound:</text>
      <text x="265" y="188" fill="#10b981" font-size="10">  all  →  0.0.0.0/0</text>
      <text x="350" y="225" text-anchor="middle" fill="#8b949e" font-size="10">stateful · all inbound denied</text>
      <text x="350" y="240" text-anchor="middle" fill="#8b949e" font-size="10">by default</text>
      <line x1="455" y1="160" x2="510" y2="160" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <rect x="515" y="125" width="160" height="80" rx="6" fill="#243349" stroke="#3b82f6"/>
      <text x="595" y="155" text-anchor="middle" fill="#3b82f6" font-size="13" font-weight="600">EC2 Instance</text>
      <text x="595" y="180" text-anchor="middle" fill="#8b949e" font-size="10">filtered before arrival</text>
    </svg>`,
    codeExample: {
      language: "bash",
      title: "Create a web SG and reference it from a DB SG",
      code: `# Create a web tier SG that allows HTTPS from anywhere
aws ec2 create-security-group --group-name web-sg --description "web tier" \\
  --vpc-id vpc-0abc
aws ec2 authorize-security-group-ingress --group-name web-sg \\
  --protocol tcp --port 443 --cidr 0.0.0.0/0

# Create a DB tier SG that only accepts traffic FROM web-sg (not from CIDRs)
aws ec2 create-security-group --group-name db-sg --description "db tier" \\
  --vpc-id vpc-0abc
aws ec2 authorize-security-group-ingress --group-name db-sg \\
  --protocol tcp --port 5432 --source-group web-sg`,
    },
    problemStatement:
      "You are a solutions architect at a SaaS company. The web tier runs on EC2 behind an ALB. The DB is RDS PostgreSQL. SSH should be allowed only from the corp office network 198.51.100.0/24. Design the Security Groups (one for ALB, one for web instances, one for DB) and explain how SG-to-SG references eliminate the need to hard-code IPs that change when instances scale.",
    questions: [
      {
        q: "A user's connection to an EC2 instance results in a TIMEOUT (not a 'connection refused'). Which is the MOST LIKELY cause?",
        options: ["A. The application is crashed.", "B. The Security Group is blocking inbound traffic.", "C. The OS firewall (iptables) is misconfigured.", "D. The instance is stopped."],
        answer: "B",
        explanation:
          "B is correct: SGs drop packets silently before they ever reach the OS, producing a TIMEOUT. A would produce 'connection refused' (TCP reset). C could cause a timeout too, but SG is by far the most common cause and the canonical exam answer. D would produce 'no route to host' or timeout but is less specific than B.",
      },
      {
        q: "Which statement about Security Group rules is TRUE?",
        options: [
          "A. Both allow and deny rules can be defined.",
          "B. Rules are stateless — you must define inbound AND outbound for each flow.",
          "C. Rules are stateful and only allow rules can be defined (default-deny).",
          "D. Rules apply only within a single Availability Zone.",
        ],
        answer: "C",
        explanation:
          "C is correct: SGs are stateful (return traffic auto-allowed) and only support allow rules — there is no explicit deny. A is wrong (no deny rules). B describes Network ACLs, which ARE stateless. D is wrong; SGs are VPC-scoped.",
      },
      {
        q: "A web tier SG references the load balancer SG in an inbound rule. What is the benefit?",
        options: [
          "A. It improves throughput by 30%.",
          "B. It encrypts traffic between the ALB and web instances.",
          "C. The rule dynamically allows the ALB's interfaces without hard-coding their changing private IPs.",
          "D. It enables cross-region routing.",
        ],
        answer: "C",
        explanation:
          "C is correct: SG-to-SG referencing automatically allows whichever IPs the source SG's resources currently hold — even as instances scale. A is invented. B is unrelated (encryption is L7/TLS, not SG). D is unrelated to SG referencing.",
      },
    ],
  },

  {
    id: "classic-ports",
    title: "Classic Network Ports to Know",
    shortLabel: "Classic Ports",
    section: "Amazon EC2 — Basics",
    domain: "Networking",
    explanation:
      "A handful of TCP ports come up constantly in AWS exam questions and real architectures. **22** — SSH for Linux remote shells, and SFTP (file transfer over SSH). **21** — classic unencrypted FTP, almost never used today. **80** — HTTP (unencrypted web). **443** — HTTPS (TLS-encrypted web). **3389** — RDP (Remote Desktop Protocol) for Windows instances. **3306** — MySQL/MariaDB. **5432** — PostgreSQL. **1433** — Microsoft SQL Server. **6379** — Redis. **27017** — MongoDB. When configuring Security Groups, you'll spend most of your time allowing exactly these on exactly the right sources.",
    analogy:
      "Ports are like apartment numbers in a single building (an IP address). Knock on 443 and you reach the secure web concierge; knock on 22 and you reach the SSH front-desk; knock on 3389 and you reach the Windows IT lobby. Most of cloud networking is just deciding which knocks are allowed from which neighborhoods.",
    diagram: `<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Common network ports cheatsheet">${svgDefs}
      <rect x="20" y="20" width="680" height="260" rx="10" fill="#1a2332" stroke="#2d3a4f"/>
      <text x="360" y="48" text-anchor="middle" fill="#ff9900" font-size="16" font-weight="700">Classic Ports Cheat Sheet</text>
      <g font-size="12">
        <rect x="40"  y="80"  width="200" height="60" rx="6" fill="#243349" stroke="#3d4d68"/>
        <text x="55"  y="103" fill="#ff9900" font-weight="700">22</text>
        <text x="90"  y="103" fill="#e6edf3">SSH / SFTP</text>
        <text x="55"  y="125" fill="#8b949e" font-size="11">Linux remote shell, encrypted file xfer</text>
        <rect x="260" y="80"  width="200" height="60" rx="6" fill="#243349" stroke="#3d4d68"/>
        <text x="275" y="103" fill="#ff9900" font-weight="700">21</text>
        <text x="310" y="103" fill="#e6edf3">FTP</text>
        <text x="275" y="125" fill="#8b949e" font-size="11">Legacy, unencrypted — avoid</text>
        <rect x="480" y="80"  width="200" height="60" rx="6" fill="#243349" stroke="#3d4d68"/>
        <text x="495" y="103" fill="#ff9900" font-weight="700">80</text>
        <text x="535" y="103" fill="#e6edf3">HTTP</text>
        <text x="495" y="125" fill="#8b949e" font-size="11">Plain web traffic</text>
        <rect x="40"  y="155" width="200" height="60" rx="6" fill="#243349" stroke="#10b981"/>
        <text x="55"  y="178" fill="#10b981" font-weight="700">443</text>
        <text x="100" y="178" fill="#e6edf3">HTTPS</text>
        <text x="55"  y="200" fill="#8b949e" font-size="11">TLS-encrypted web — modern default</text>
        <rect x="260" y="155" width="200" height="60" rx="6" fill="#243349" stroke="#3d4d68"/>
        <text x="275" y="178" fill="#ff9900" font-weight="700">3389</text>
        <text x="325" y="178" fill="#e6edf3">RDP</text>
        <text x="275" y="200" fill="#8b949e" font-size="11">Windows Remote Desktop</text>
        <rect x="480" y="155" width="200" height="60" rx="6" fill="#243349" stroke="#3d4d68"/>
        <text x="495" y="178" fill="#ff9900" font-weight="700">DBs</text>
        <text x="540" y="178" fill="#e6edf3">3306 · 5432 · 1433</text>
        <text x="495" y="200" fill="#8b949e" font-size="11">MySQL · Postgres · MSSQL</text>
      </g>
      <text x="360" y="252" text-anchor="middle" fill="#b0bac6" font-size="11">Bind these ports to the right Security Group sources — never expose DB ports to 0.0.0.0/0</text>
    </svg>`,
    codeExample: {
      language: "bash",
      title: "Open common ports on a security group from CLI",
      code: `# HTTPS from anywhere (web tier)
aws ec2 authorize-security-group-ingress --group-id sg-web \\
  --protocol tcp --port 443 --cidr 0.0.0.0/0

# SSH only from the corp office
aws ec2 authorize-security-group-ingress --group-id sg-web \\
  --protocol tcp --port 22 --cidr 203.0.113.0/24

# Postgres only from the web tier SG (no CIDRs!)
aws ec2 authorize-security-group-ingress --group-id sg-db \\
  --protocol tcp --port 5432 --source-group sg-web

# Windows RDP from the bastion SG only
aws ec2 authorize-security-group-ingress --group-id sg-win \\
  --protocol tcp --port 3389 --source-group sg-bastion`,
    },
    problemStatement:
      "You are a solutions architect at a healthcare company. Engineering wants public HTTPS (443) for the patient portal, SSH (22) only from the office, RDP (3389) only from a bastion host, and Postgres (5432) only from the web tier — never from the internet. List the exact inbound rules per security group and explain why exposing 5432 to 0.0.0.0/0 even for 'testing' is an immediate audit failure.",
    questions: [
      {
        q: "Which port should be open on an EC2 instance to accept SSH connections from administrators?",
        options: ["A. TCP 21", "B. TCP 22", "C. TCP 80", "D. TCP 3389"],
        answer: "B",
        explanation:
          "B is correct: SSH uses TCP/22. A is FTP. C is HTTP. D is RDP for Windows.",
      },
      {
        q: "A team must let a Windows EC2 instance be administered via Remote Desktop from the office network only. Which port + source combination is correct?",
        options: [
          "A. TCP 22 from 0.0.0.0/0",
          "B. TCP 3389 from 0.0.0.0/0",
          "C. TCP 3389 from the office CIDR (e.g. 203.0.113.0/24)",
          "D. TCP 443 from the corporate IPs",
        ],
        answer: "C",
        explanation:
          "C is correct: RDP is 3389, and it must be scoped to the office CIDR — not the world. A would be SSH and is over-broad. B opens RDP to the entire internet — a critical security finding. D uses HTTPS port, which is not RDP.",
      },
      {
        q: "Which port is the canonical default for Amazon RDS for PostgreSQL?",
        options: ["A. 1433", "B. 3306", "C. 5432", "D. 6379"],
        answer: "C",
        explanation:
          "C is correct: PostgreSQL uses 5432. A is Microsoft SQL Server. B is MySQL/MariaDB. D is Redis.",
      },
    ],
  },

  {
    id: "ssh-access",
    title: "SSH Access to EC2 (Mac/Linux/Windows + Instance Connect)",
    shortLabel: "SSH Access",
    section: "Amazon EC2 — Basics",
    domain: "Compute",
    explanation:
      "SSH (Secure Shell) is the standard way to get a remote command prompt on a Linux EC2 instance. You authenticate using a **key pair**: AWS generates the pair when you launch the instance, you keep the private key (`.pem` file), and the public key sits in `~/.ssh/authorized_keys` on the instance. On Mac/Linux you use `ssh -i key.pem ec2-user@public-ip`; on Windows 10+ you can use the built-in `ssh` command or PuTTY for older Windows. **EC2 Instance Connect** is a newer alternative that lets you SSH from the AWS Console (browser) without needing the private key on your laptop — AWS uploads a one-time public key to the instance for ~60 seconds, then your browser session SSHes in. Instance Connect works out-of-the-box on Amazon Linux 2/2023 and still requires port 22 to be open to AWS's IP range.",
    analogy:
      "An SSH key pair is like a unique mechanical key for a hotel safe. AWS gave you the only copy of the key when you opened the safe; lose it and you can never get back in. EC2 Instance Connect is the hotel reception lending you a single-use master key from the front desk — handy when you forgot your key in your room, but the door still has to be unlocked from the building's perimeter (port 22 still has to be allowed).",
    diagram: `<svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="SSH and EC2 Instance Connect flows">${svgDefs}
      <rect x="20" y="20" width="680" height="280" rx="10" fill="#1a2332" stroke="#2d3a4f"/>
      <text x="360" y="48" text-anchor="middle" fill="#ff9900" font-size="16" font-weight="700">SSH vs EC2 Instance Connect</text>
      <g>
        <rect x="40" y="80" width="200" height="180" rx="8" fill="#243349" stroke="#3b82f6"/>
        <text x="140" y="105" text-anchor="middle" fill="#3b82f6" font-size="13" font-weight="600">Classic SSH</text>
        <text x="55" y="130" fill="#e6edf3" font-size="11">1. Save the .pem private key</text>
        <text x="55" y="148" fill="#e6edf3" font-size="11">2. chmod 400 key.pem</text>
        <text x="55" y="166" fill="#e6edf3" font-size="11">3. ssh -i key.pem</text>
        <text x="55" y="184" fill="#e6edf3" font-size="11">   ec2-user@public-ip</text>
        <text x="55" y="210" fill="#8b949e" font-size="11">Mac/Linux: built-in ssh</text>
        <text x="55" y="228" fill="#8b949e" font-size="11">Windows: ssh (Win10+) or PuTTY</text>
        <text x="55" y="246" fill="#10b981" font-size="11">Pros: works anywhere</text>
      </g>
      <g>
        <rect x="260" y="80" width="200" height="180" rx="8" fill="#243349" stroke="#ff9900"/>
        <text x="360" y="105" text-anchor="middle" fill="#ff9900" font-size="13" font-weight="600">Instance Connect</text>
        <text x="275" y="130" fill="#e6edf3" font-size="11">1. Click "Connect" in console</text>
        <text x="275" y="148" fill="#e6edf3" font-size="11">2. AWS pushes a one-time</text>
        <text x="275" y="166" fill="#e6edf3" font-size="11">   public key (~60s)</text>
        <text x="275" y="184" fill="#e6edf3" font-size="11">3. Browser shell opens</text>
        <text x="275" y="210" fill="#8b949e" font-size="11">No .pem needed locally</text>
        <text x="275" y="228" fill="#10b981" font-size="11">AL2 / AL2023 ready</text>
        <text x="275" y="246" fill="#f59e0b" font-size="11">Still needs port 22 open</text>
      </g>
      <g>
        <rect x="480" y="80" width="200" height="180" rx="8" fill="#243349" stroke="#10b981"/>
        <text x="580" y="105" text-anchor="middle" fill="#10b981" font-size="13" font-weight="600">Session Manager</text>
        <text x="495" y="130" fill="#e6edf3" font-size="11">SSM Agent + IAM role</text>
        <text x="495" y="148" fill="#e6edf3" font-size="11">No SG inbound at all</text>
        <text x="495" y="166" fill="#e6edf3" font-size="11">Audit-friendly, CloudTrail</text>
        <text x="495" y="184" fill="#e6edf3" font-size="11">Works on private subnets</text>
        <text x="495" y="210" fill="#10b981" font-size="11">Best for production</text>
      </g>
    </svg>`,
    codeExample: {
      language: "bash",
      title: "SSH into an EC2 instance — classic, Instance Connect, SSM",
      code: `# 1) Classic SSH with downloaded .pem key
chmod 400 my-key.pem
ssh -i my-key.pem ec2-user@54.123.45.67

# 2) Instance Connect via CLI (pushes one-time key)
aws ec2-instance-connect send-ssh-public-key \\
  --instance-id i-0abc --availability-zone us-east-1a \\
  --instance-os-user ec2-user --ssh-public-key file://~/.ssh/id_rsa.pub
ssh ec2-user@54.123.45.67

# 3) Session Manager (no SSH port, IAM-authenticated)
aws ssm start-session --target i-0abc`,
    },
    problemStatement:
      "You are a solutions architect at a regulated bank. Auditors say SSH port 22 must NOT be open to the internet on production EC2 instances — but engineers still need terminal access when investigating incidents. Compare the three access methods (classic SSH, EC2 Instance Connect, Session Manager), state which one satisfies the auditors, and outline what IAM permissions are needed.",
    questions: [
      {
        q: "Which method to access an EC2 instance does NOT require port 22 to be open in any security group?",
        options: [
          "A. Classic SSH from a laptop",
          "B. EC2 Instance Connect from the console",
          "C. AWS Systems Manager Session Manager",
          "D. PuTTY on Windows",
        ],
        answer: "C",
        explanation:
          "C is correct: Session Manager uses the SSM Agent and an outbound HTTPS call from the instance — no inbound port 22 needed. A, B, and D all require port 22 (Instance Connect injects a one-time key but still uses TCP/22 to reach the host).",
      },
      {
        q: "A team accidentally deleted the .pem key file used to launch a fleet of EC2 instances. They still need to SSH into the instances. Which option is the FASTEST recovery?",
        options: [
          "A. Terminate and rebuild — there is no way to recover access.",
          "B. Use EC2 Instance Connect (or push a new key via Instance Connect) to regain access.",
          "C. Reboot the instances; the key will be regenerated.",
          "D. Contact AWS Support to fetch the lost private key.",
        ],
        answer: "B",
        explanation:
          "B is correct: Instance Connect can push a temporary public key, granting immediate SSH access without the original .pem. A is a heavy hammer that should be the last resort. C is wrong: AWS never regenerates a private key. D is wrong — AWS never has the private key.",
      },
      {
        q: "Which permission mode is correct for a downloaded SSH private key file (`my-key.pem`) on Linux/Mac?",
        options: ["A. 0777", "B. 0400", "C. 0644", "D. 0700"],
        answer: "B",
        explanation:
          "B is correct: 0400 (read-only for owner, nothing for group/others) is what ssh requires — broader permissions cause ssh to refuse the key with 'WARNING: UNPROTECTED PRIVATE KEY FILE'. A is world-writable (dangerous). C and D are still too open for ssh to accept.",
      },
    ],
  },

  {
    id: "ec2-purchasing-options",
    title: "EC2 Purchasing Options",
    shortLabel: "Purchasing Options",
    section: "Amazon EC2 — Basics",
    domain: "Compute",
    explanation:
      "AWS offers seven ways to pay for EC2 capacity, each tuned to a different usage pattern. **On-Demand** — full price, pay per second, no commitment; best for short, unpredictable workloads. **Reserved Instances (RI)** — commit to a specific instance attribute (type, Region, tenancy, OS) for 1 or 3 years; up to 72% off; best for steady-state servers like databases. **Convertible RI** — same commitment but you can change the instance family/OS later; up to 66% off. **Savings Plans** — commit to a $/hour spend for 1 or 3 years; more flexible than RIs; up to 72% off. **Spot Instances** — bid for spare capacity; up to 90% off but AWS can reclaim with 2-minute notice; best for fault-tolerant batch workloads. **Dedicated Hosts** — book an entire physical server; required for BYOL licenses; most expensive. **Dedicated Instances** — your hardware, your account, but no host-level control. **Capacity Reservations** — pay On-Demand price but guarantee capacity in a specific AZ.",
    analogy:
      "Booking EC2 is like booking a hotel room. On-Demand = walk-in nightly rate. Reserved = year-long lease at a discount. Savings Plans = year-long lease but you can switch rooms. Spot = 90%-off last-minute deals that may get cancelled. Dedicated Host = renting the whole building. Capacity Reservation = paying to hold a room even when you're not sleeping in it.",
    diagram: `<svg viewBox="0 0 720 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="EC2 purchasing options comparison">${svgDefs}
      <rect x="20" y="20" width="680" height="300" rx="10" fill="#1a2332" stroke="#2d3a4f"/>
      <text x="360" y="48" text-anchor="middle" fill="#ff9900" font-size="16" font-weight="700">EC2 Purchasing Options — discount vs. commitment</text>
      <g font-size="12">
        <rect x="40" y="80" width="200" height="70" rx="6" fill="#243349" stroke="#3d4d68"/>
        <text x="55" y="103" fill="#e6edf3" font-weight="700">On-Demand</text>
        <text x="55" y="123" fill="#10b981" font-size="11">No commitment</text>
        <text x="55" y="140" fill="#8b949e" font-size="11">$$$  full price · per-second billing</text>
        <rect x="260" y="80" width="200" height="70" rx="6" fill="#243349" stroke="#3d4d68"/>
        <text x="275" y="103" fill="#e6edf3" font-weight="700">Reserved (RI)</text>
        <text x="275" y="123" fill="#10b981" font-size="11">1 or 3-yr lock-in</text>
        <text x="275" y="140" fill="#8b949e" font-size="11">$  up to 72% off · steady workloads</text>
        <rect x="480" y="80" width="200" height="70" rx="6" fill="#243349" stroke="#3d4d68"/>
        <text x="495" y="103" fill="#e6edf3" font-weight="700">Savings Plans</text>
        <text x="495" y="123" fill="#10b981" font-size="11">$/hr commitment</text>
        <text x="495" y="140" fill="#8b949e" font-size="11">$  up to 72% · flexible family/size</text>
        <rect x="40" y="165" width="200" height="70" rx="6" fill="#243349" stroke="#ff9900"/>
        <text x="55" y="188" fill="#ff9900" font-weight="700">Spot</text>
        <text x="55" y="208" fill="#10b981" font-size="11">No commitment, evictable</text>
        <text x="55" y="225" fill="#8b949e" font-size="11">¢  up to 90% off · 2-min notice</text>
        <rect x="260" y="165" width="200" height="70" rx="6" fill="#243349" stroke="#3d4d68"/>
        <text x="275" y="188" fill="#e6edf3" font-weight="700">Dedicated Host</text>
        <text x="275" y="208" fill="#10b981" font-size="11">Whole physical server</text>
        <text x="275" y="225" fill="#8b949e" font-size="11">$$$$ BYOL · compliance</text>
        <rect x="480" y="165" width="200" height="70" rx="6" fill="#243349" stroke="#3d4d68"/>
        <text x="495" y="188" fill="#e6edf3" font-weight="700">Dedicated Instance</text>
        <text x="495" y="208" fill="#10b981" font-size="11">Isolated hardware</text>
        <text x="495" y="225" fill="#8b949e" font-size="11">$$  no host-level control</text>
        <rect x="170" y="250" width="380" height="60" rx="6" fill="#243349" stroke="#10b981"/>
        <text x="360" y="273" text-anchor="middle" fill="#10b981" font-weight="700">Capacity Reservation</text>
        <text x="360" y="293" text-anchor="middle" fill="#8b949e" font-size="11">On-Demand price, guarantees capacity in one AZ</text>
      </g>
    </svg>`,
    codeExample: {
      language: "bash",
      title: "Buy a Reserved Instance and create a Savings Plan",
      code: `# 1) Find offerings for an m5.large in us-east-1, 1-yr, No Upfront
aws ec2 describe-reserved-instances-offerings \\
  --instance-type m5.large --offering-class standard \\
  --product-description "Linux/UNIX" \\
  --filters "Name=duration,Values=31536000" \\
            "Name=offering-type,Values=No Upfront"

# 2) Purchase it (returns ReservedInstancesId)
aws ec2 purchase-reserved-instances-offering \\
  --reserved-instances-offering-id 4b2293b4-... \\
  --instance-count 5

# 3) Create a 1-year Compute Savings Plan ($10/hr)
aws savingsplans create-savings-plan \\
  --savings-plan-offering-id "abc-..." \\
  --commitment "10.00" \\
  --upfront-payment-amount "0"`,
    },
    problemStatement:
      "You are a solutions architect at an e-commerce company. The platform has: (a) 20 always-on web tier instances, (b) a nightly Spark job that crunches data for 3 hours, (c) a quarterly stress-test campaign that needs 200 extra instances for 2 days, and (d) a Windows shop with BYOL licenses. Pick the right purchasing option for each workload and justify how blending them lowers the total monthly bill by ~50%.",
    questions: [
      {
        q: "A company runs the SAME m5.large EC2 instance 24/7 to host a critical web tier for the next 3 years. Which purchasing option is BEST?",
        options: [
          "A. On-Demand",
          "B. Spot Instances",
          "C. 3-year All-Upfront Standard Reserved Instance",
          "D. Dedicated Host",
        ],
        answer: "C",
        explanation:
          "C is correct: a 3-year All-Upfront Standard RI gives the deepest discount (~72%) for a steady, known workload. A is the most expensive option for steady use. B can be reclaimed at 2 minutes' notice — unacceptable for a critical web tier. D is for licensing/compliance edge cases and is the most expensive option.",
      },
      {
        q: "A fault-tolerant batch job processes images from S3 and can resume from where it left off if interrupted. Which purchasing option is the BEST cost choice?",
        options: ["A. On-Demand", "B. Reserved Instances", "C. Spot Instances", "D. Dedicated Hosts"],
        answer: "C",
        explanation:
          "C is correct: Spot delivers up to 90% off, and the 2-minute interruption notice is acceptable because the workload is interruption-tolerant. A overspends massively. B requires long-term commitment that doesn't match a batch workload's variability. D is the most expensive option.",
      },
      {
        q: "A company has a legacy software license tied to a specific physical server, requiring sole tenancy and visibility of CPU sockets/cores. Which is REQUIRED?",
        options: [
          "A. Dedicated Instances",
          "B. Dedicated Hosts",
          "C. Reserved Instances",
          "D. Capacity Reservations",
        ],
        answer: "B",
        explanation:
          "B is correct: Dedicated Hosts give you visibility into the physical socket/core layout and let you BYOL per-socket/per-core licenses. A (Dedicated Instances) isolates the hardware but doesn't expose socket/core IDs. C is a billing model, not isolation. D guarantees capacity but not isolation or socket visibility.",
      },
      {
        q: "A SaaS company runs 100 always-on m5.large instances. They also burst by 60 additional instances for 3 hours every weekday. How should they BLEND purchasing options to minimize cost?",
        options: [
          "A. 160 On-Demand instances.",
          "B. 100 Reserved Instances (3-year, All-Upfront) for the baseline, plus On-Demand for the 60-instance daytime burst.",
          "C. 160 Reserved Instances.",
          "D. 100 Spot + 60 On-Demand.",
        ],
        answer: "B",
        explanation:
          "B is correct: cover the steady baseline with RIs (deep discount, ROI obvious), use On-Demand only for the variable burst. A overspends on baseline. C wastes RI commitment on capacity used only 15h/week. D risks production availability with Spot reclaim.",
      },
      {
        q: "A 1-year Standard Reserved Instance was purchased for an m5.large in us-east-1. The application team wants to switch to m5.xlarge after 4 months. Can they?",
        options: [
          "A. Yes — Standard RIs allow any instance type change.",
          "B. No — Standard RIs lock the exact instance attribute; you'd need a Convertible RI to switch families/sizes.",
          "C. Yes, but only after paying a fee.",
          "D. Yes, but only by canceling the RI.",
        ],
        answer: "B",
        explanation:
          "B is correct: Standard RIs lock to a specific type; Convertible RIs allow family/size/OS changes (in exchange for a smaller discount). A is wrong. C is wrong (no swap fee on Convertible RIs). D is wrong (Standard RIs cannot be cancelled; you can only sell them on the RI Marketplace).",
      },
      {
        q: "Which billing model gives the BEST discount for a steady-state production workload over 3 years with no flexibility needed?",
        options: ["A. On-Demand", "B. 3-year Convertible Reserved Instance, All-Upfront", "C. 3-year Standard Reserved Instance, All-Upfront", "D. Compute Savings Plan, No-Upfront"],
        answer: "C",
        explanation:
          "C is correct: 3-year Standard All-Upfront gives the deepest published RI discount (~72%). A is the most expensive option. B sacrifices ~5-6% discount for convertibility you don't need. D is more flexible but typically has slightly less savings than Standard RIs at the same commitment.",
      },
      {
        q: "A team wants the savings of Reserved Instances but the flexibility to change instance family, OS, and Region usage as the architecture evolves. Which option is BEST?",
        options: ["A. Standard Reserved Instance", "B. Convertible Reserved Instance", "C. Compute Savings Plan", "D. EC2 Instance Savings Plan"],
        answer: "C",
        explanation:
          "C is correct: Compute Savings Plans apply across instance family, size, OS, tenancy, AND Region — the most flexible commitment vehicle. A locks all attributes. B allows family/OS changes but is still Region-tied for most semantics. D is family-bound (just lets size/AZ/OS vary within the family).",
      },
      {
        q: "An On-Demand m5.large costs about $0.096/hr. A 1-year No-Upfront Standard RI for the same SKU is ~$0.060/hr. A team plans to run the instance only weekdays 9–5 (40h/week). Which is the BETTER cost choice?",
        options: ["A. The RI — discount is bigger.", "B. On-Demand — RIs charge for all 168h/week whether you use them or not, and 40h/week × $0.096 = $3.84 < 168h × $0.060 = $10.08.", "C. They're equal.", "D. Use Spot."],
        answer: "B",
        explanation:
          "B is correct: an RI is a commitment to PAY for 168h/week of capacity. If you use only 40h/week, On-Demand is cheaper. A is the typical 'discount is bigger therefore better' fallacy. C is wrong. D could work for fault-tolerant workloads but is not asked here.",
      },
      {
        q: "Which is TRUE about Capacity Reservations?",
        options: [
          "A. They include a cost discount over On-Demand.",
          "B. They reserve capacity in a specific AZ at On-Demand rates — discount must come separately from RIs or Savings Plans.",
          "C. They guarantee Spot availability.",
          "D. They expire after 30 days.",
        ],
        answer: "B",
        explanation:
          "B is correct: a Capacity Reservation is ONLY a capacity guarantee (in a specific AZ), priced at On-Demand. Combine with RIs or Savings Plans for discounts. A is wrong. C is wrong (Spot is opposite — no guarantee). D is wrong (no automatic expiry).",
      },
      {
        q: "A regulated company must guarantee that a particular workload always has 50 m5.large instances available in a single AZ to satisfy a regulator's audit, but they want the OPTION to add or remove the requirement at any time. Which is the BEST fit?",
        options: [
          "A. 50 Reserved Instances (3-year)",
          "B. 50 On-Demand instances running 24/7",
          "C. A Capacity Reservation for 50 m5.large in the target AZ (with optional Savings Plan attached for discount)",
          "D. 50 Spot Instances",
        ],
        answer: "C",
        explanation:
          "C is correct: Capacity Reservations are the only mechanism that BOTH guarantees AZ-level capacity AND can be added/removed anytime with no long commitment. A locks for years. B doesn't guarantee capacity. D guarantees nothing.",
      },
      {
        q: "An EC2 instance can be purchased with which TENANCY options?",
        options: [
          "A. Shared, Dedicated Instance, Dedicated Host",
          "B. Shared, Encrypted, Region-locked",
          "C. Public, Private, Hybrid",
          "D. Reserved, Spot, On-Demand",
        ],
        answer: "A",
        explanation:
          "A is correct: tenancy can be Shared (default — hypervisor shared with other AWS customers), Dedicated Instance (isolated hardware), or Dedicated Host (whole physical server). B mixes unrelated concepts. C is invented. D mixes tenancy with billing models.",
      },
      {
        q: "Which is a TRUE statement about EC2 Spot Instance pricing?",
        options: [
          "A. The price is fixed at 50% of On-Demand.",
          "B. You set a max price; you pay the CURRENT Spot price as long as it stays below your max; AWS reclaims with 2-min notice if it rises above.",
          "C. Spot prices change once per month.",
          "D. Spot is only available in the cheapest Region.",
        ],
        answer: "B",
        explanation:
          "B is correct — the canonical Spot model. A is wrong (Spot varies up to 90% off). C is wrong (prices change continuously). D is wrong (Spot is in every Region with EC2).",
      },
      {
        q: "Which purchasing option BYPASSES the AWS Marketplace's per-physical-host licensing requirements (e.g., Microsoft SQL Server per-core licenses) by giving you visibility into the host's CPU sockets and cores?",
        options: [
          "A. Dedicated Instance",
          "B. Dedicated Host",
          "C. Reserved Instance",
          "D. Capacity Reservation",
        ],
        answer: "B",
        explanation:
          "B is correct: only Dedicated Hosts expose socket/core information needed to satisfy per-socket / per-core BYOL licensing. A isolates hardware but doesn't expose the host details. C and D are billing/capacity constructs.",
      },
      {
        q: "Which purchasing option is BEST for batch jobs that can be interrupted with 2-minute notice and where you want maximum cost savings?",
        options: ["A. On-Demand", "B. Reserved Instances", "C. Spot Instances", "D. Dedicated Hosts"],
        answer: "C",
        explanation:
          "C is correct: Spot Instances deliver up to 90% savings; 2-minute interruption is acceptable for fault-tolerant batch workloads. A overpays. B locks for 1-3 years. D is the most expensive.",
      },
      {
        q: "A startup is using 100% On-Demand and wants to cut compute spend by 50% without sacrificing availability. The workload mix is steady. Which approach is BEST?",
        options: [
          "A. Move 100% to Spot.",
          "B. Sign a 1-year Compute Savings Plan that covers ~80% of historic usage.",
          "C. Move 100% to Reserved Instances for the largest historic instance type.",
          "D. Switch all workloads to AWS Lambda.",
        ],
        answer: "B",
        explanation:
          "B is correct: Compute Savings Plans give RI-level discounts with flexibility, sized to cover predictable baseline usage. A risks availability. C locks the wrong shape. D is a re-architecture, not a billing change.",
      },
      {
        q: "Reserved Instance Marketplace allows you to do what?",
        options: [
          "A. Buy Spot Instances at a fixed price.",
          "B. Sell unused Standard RIs to other AWS customers (after a minimum hold period).",
          "C. Trade in your Reserved Instances for credits.",
          "D. Rent your EC2 instances to other accounts.",
        ],
        answer: "B",
        explanation:
          "B is correct: if a workload changes and you no longer need a Standard RI, you can list it on the RI Marketplace for other AWS customers (after the first 30 days of the RI's life and before the final 30 days). A is wrong. C is invented. D is invented.",
      },
      {
        q: "Which BEST describes the difference between a Dedicated Host and a Dedicated Instance?",
        options: [
          "A. Both are identical.",
          "B. Dedicated Host gives you a whole physical server (visibility + control over placement, BYOL); Dedicated Instance gives isolated hardware but no host-level control.",
          "C. Dedicated Host is cheaper.",
          "D. Dedicated Instance allows BYOL; Dedicated Host doesn't.",
        ],
        answer: "B",
        explanation:
          "B is correct: Dedicated Host = the whole box (BYOL-friendly, socket-aware); Dedicated Instance = just the isolation guarantee. A is wrong. C is the opposite (Host is the more expensive option). D inverts the rule.",
      },
      {
        q: "Compute Savings Plans apply across which TWO dimensions of flexibility that Standard RIs do NOT?",
        options: [
          "A. AZ + size",
          "B. Instance family + Region",
          "C. OS + tenancy",
          "D. Spot + On-Demand",
        ],
        answer: "B",
        explanation:
          "B is correct: Compute Savings Plans transcend instance family and Region — a unique flexibility advantage. A is already covered by Convertible RIs. C is partial. D conflates pricing models.",
      },
      {
        q: "An organization wants to ensure NO new EC2 instance can be launched at the costly On-Demand rate without explicit approval. Which is the BEST guardrail?",
        options: [
          "A. Set the AWS Budget alert to email the CFO daily.",
          "B. Apply an SCP that denies ec2:RunInstances unless launched with a specific tag/role, and create a process for approving variances.",
          "C. Buy more Reserved Instances.",
          "D. Switch to Spot Instances globally.",
        ],
        answer: "B",
        explanation:
          "B is correct: governance-as-code via SCPs prevents the action; budget alerts only detect after the fact. A is reactive, not preventive. C doesn't restrict who can launch. D ignores the workloads that genuinely need on-demand reliability.",
      },
    ],
  },

  {
    id: "ec2-spot-instances",
    title: "EC2 Spot Instances — Bidding for Spare Capacity",
    shortLabel: "Spot Instances",
    section: "Amazon EC2 — Basics",
    domain: "Compute",
    explanation:
      "Spot Instances let you run EC2 on AWS's spare capacity at up to 90% off the On-Demand price. You set a **maximum price** you're willing to pay; AWS gives you the instance as long as the current Spot price stays below your max. If the Spot price rises above your max, OR AWS needs the capacity back, your instance is interrupted: you get a **2-minute warning** (via instance metadata at `/latest/meta-data/spot/instance-action`) before AWS reclaims it. You can configure the interruption behavior as **terminate**, **stop** (keep EBS volume for later restart), or **hibernate** (save RAM). Spot is ideal for fault-tolerant, parallelizable workloads — batch jobs, CI runners, big-data analytics, ML training, image/video processing. It is unsuitable for stateful databases, long-lived web tiers, or anything where a 2-minute notice is too short.",
    analogy:
      "Spot Instances are like flying standby. You quote a max fare you'll pay; the airline gives you a seat as long as the market price stays below it. If a paying customer shows up with cash, you get bumped off — but you knew that was the deal when you saved 90%. Smart standby travelers don't fly to their own wedding this way; they fly when their schedule is flexible.",
    diagram: `<svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Spot price vs max bid timeline">${svgDefs}
      <rect x="20" y="20" width="680" height="280" rx="10" fill="#1a2332" stroke="#2d3a4f"/>
      <text x="360" y="48" text-anchor="middle" fill="#ff9900" font-size="16" font-weight="700">Spot Pricing — You pay current Spot price, capped by your max</text>
      <line x1="80" y1="240" x2="650" y2="240" stroke="#3d4d68"/>
      <line x1="80" y1="240" x2="80" y2="80" stroke="#3d4d68"/>
      <text x="40" y="100" fill="#8b949e" font-size="11">$0.10</text>
      <text x="40" y="180" fill="#8b949e" font-size="11">$0.04</text>
      <text x="40" y="240" fill="#8b949e" font-size="11">$0.00</text>
      <line x1="80" y1="100" x2="650" y2="100" stroke="#ef4444" stroke-dasharray="4 4"/>
      <text x="665" y="104" fill="#ef4444" font-size="10">On-Demand</text>
      <line x1="80" y1="180" x2="650" y2="180" stroke="#10b981" stroke-dasharray="4 4"/>
      <text x="665" y="184" fill="#10b981" font-size="10">your max bid</text>
      <polyline points="80,210 150,200 220,205 290,190 360,170 430,165 500,160 570,150 600,175 650,200" fill="none" stroke="#ff9900" stroke-width="2"/>
      <text x="540" y="135" fill="#ff9900" font-size="11">spot price rose above your bid → 2-min interruption notice</text>
      <circle cx="570" cy="150" r="5" fill="#ef4444"/>
      <text x="360" y="280" text-anchor="middle" fill="#b0bac6" font-size="11">Spot price varies over time — when it crosses your max, AWS issues a termination/stop/hibernate notice</text>
    </svg>`,
    codeExample: {
      language: "bash",
      title: "Launch a Spot Instance request and watch for interruption",
      code: `# Request a Spot Instance with max price = $0.05/hr, stop on interruption
aws ec2 request-spot-instances \\
  --spot-price "0.05" \\
  --instance-count 1 \\
  --type "one-time" \\
  --instance-interruption-behavior stop \\
  --launch-specification file://spot-spec.json

# From INSIDE the instance, poll for interruption notice
while true; do
  if curl -s http://169.254.169.254/latest/meta-data/spot/instance-action; then
    echo "Interruption notice received — graceful shutdown!"
    aws s3 cp /scratch/state.json s3://my-checkpoints/last.json
    exit 0
  fi
  sleep 5
done`,
    },
    problemStatement:
      "You are a solutions architect at a media-analytics startup. The ML team trains models nightly: each job is fully checkpointed every 10 minutes and can resume from the latest checkpoint. The team wants to cut EC2 cost by 80%. Describe how you'd architect this on Spot: what max price you'd set, what the 2-minute notice handler does, and how you'd protect against losing more than 10 minutes of work on a single interruption.",
    questions: [
      {
        q: "What is the canonical Spot Instance interruption warning window?",
        options: ["A. 30 seconds", "B. 2 minutes", "C. 10 minutes", "D. 1 hour"],
        answer: "B",
        explanation:
          "B is correct: AWS gives a 2-minute warning via the instance metadata service before reclaiming a Spot Instance. A, C, and D are all wrong — 2 minutes is a fixed value memorized for the exam.",
      },
      {
        q: "Which workload is the BEST fit for Spot Instances?",
        options: [
          "A. A primary PostgreSQL database serving the customer-facing app",
          "B. A long-running web tier behind an Application Load Balancer",
          "C. A nightly batch image-processing job that checkpoints every 5 minutes to S3",
          "D. A licensing server with a hardware-locked BYOL license",
        ],
        answer: "C",
        explanation:
          "C is correct: stateless, checkpointed, restartable workloads are the textbook Spot use case. A and B are stateful and can't tolerate the 2-minute reclaim notice. D is licensing-locked and would need Dedicated Hosts.",
      },
      {
        q: "Where inside a running Spot Instance does the OS receive the interruption notice?",
        options: [
          "A. As an email to the AWS account owner",
          "B. Via the instance metadata service at http://169.254.169.254/latest/meta-data/spot/instance-action",
          "C. As a CloudWatch alarm",
          "D. As an SSH banner",
        ],
        answer: "B",
        explanation:
          "B is correct: the metadata endpoint returns a JSON document with the planned termination time. A doesn't deliver in time. C also fires (the EventBridge event), but the IN-instance check is the metadata service — and the question asks about inside the instance. D is invented.",
      },
    ],
  },

  {
    id: "spot-fleets",
    title: "Spot Fleets — Mixed Capacity at Lowest Cost",
    shortLabel: "Spot Fleets",
    section: "Amazon EC2 — Basics",
    domain: "Compute",
    explanation:
      "A **Spot Fleet** is a set of Spot Instances (and optionally On-Demand Instances) that AWS launches automatically to meet a target capacity, drawing from multiple **launch pools** — combinations of instance type, OS, and AZ. You declare 'I want 100 vCPUs of capacity, from any of these 5 instance families, in any of these 3 AZs', and AWS optimizes which pool(s) to draw from. The four allocation strategies are: **lowestPrice** (cheapest pool at request time — risk: that pool might be reclaimed soon), **diversified** (spread evenly across all pools — best for availability of long-running workloads), **capacityOptimized** (pools with the most spare capacity — least likely to be interrupted), and **priceCapacityOptimized** (the recommended modern default — picks pools with high spare capacity, then cheapest among those). Spot Fleets stop launching once they hit your target or your max cost.",
    analogy:
      "A Spot Fleet is a smart shopper with a grocery list and a budget. You say 'get me 12 eggs from any organic farm under $5/dozen across these 3 supermarkets'. The shopper compares prices and stock, buys from the best combination — and if one supermarket runs out of the cheapest brand, they swap to the next without you needing to know.",
    diagram: `<svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Spot Fleet allocation across multiple pools">${svgDefs}
      <rect x="20" y="20" width="680" height="280" rx="10" fill="#1a2332" stroke="#2d3a4f"/>
      <text x="360" y="48" text-anchor="middle" fill="#ff9900" font-size="16" font-weight="700">Spot Fleet — target capacity from multiple pools</text>
      <rect x="40" y="80" width="160" height="60" rx="6" fill="#243349" stroke="#3b82f6"/>
      <text x="120" y="100" text-anchor="middle" fill="#3b82f6" font-size="12" font-weight="600">Spot Fleet Request</text>
      <text x="120" y="120" text-anchor="middle" fill="#e6edf3" font-size="11">target = 100 vCPUs</text>
      <text x="120" y="136" text-anchor="middle" fill="#8b949e" font-size="10">strategy = priceCapacity…</text>
      <line x1="200" y1="110" x2="260" y2="110" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <rect x="270" y="80" width="120" height="60" rx="6" fill="#243349" stroke="#3d4d68"/>
      <text x="330" y="100" text-anchor="middle" fill="#e6edf3" font-size="12">m5.large · 1a</text>
      <text x="330" y="120" text-anchor="middle" fill="#10b981" font-size="11">$0.038/hr</text>
      <text x="330" y="135" text-anchor="middle" fill="#8b949e" font-size="10">high capacity</text>
      <rect x="270" y="155" width="120" height="60" rx="6" fill="#243349" stroke="#3d4d68"/>
      <text x="330" y="175" text-anchor="middle" fill="#e6edf3" font-size="12">m5.large · 1b</text>
      <text x="330" y="195" text-anchor="middle" fill="#ef4444" font-size="11">$0.06/hr</text>
      <text x="330" y="210" text-anchor="middle" fill="#8b949e" font-size="10">low capacity</text>
      <rect x="270" y="230" width="120" height="50" rx="6" fill="#243349" stroke="#3d4d68"/>
      <text x="330" y="250" text-anchor="middle" fill="#e6edf3" font-size="12">m5a.large · 1c</text>
      <text x="330" y="268" text-anchor="middle" fill="#10b981" font-size="11">$0.040/hr</text>
      <line x1="395" y1="105" x2="450" y2="115" stroke="#10b981" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="395" y1="250" x2="450" y2="170" stroke="#10b981" stroke-width="2" marker-end="url(#arrow)"/>
      <rect x="460" y="100" width="220" height="100" rx="8" fill="#243349" stroke="#ff9900"/>
      <text x="570" y="125" text-anchor="middle" fill="#ff9900" font-size="13" font-weight="600">Fleet picks best mix</text>
      <text x="570" y="148" text-anchor="middle" fill="#e6edf3" font-size="11">60 vCPUs from pool 1 (cheap+stable)</text>
      <text x="570" y="166" text-anchor="middle" fill="#e6edf3" font-size="11">40 vCPUs from pool 3 (cheap)</text>
      <text x="570" y="184" text-anchor="middle" fill="#10b981" font-size="11">avoids pool 2 (low capacity)</text>
    </svg>`,
    codeExample: {
      language: "json",
      title: "Spot Fleet config — priceCapacityOptimized across pools",
      code: `{
  "IamFleetRole": "arn:aws:iam::123456789012:role/aws-ec2-spot-fleet-tagging-role",
  "AllocationStrategy": "priceCapacityOptimized",
  "TargetCapacity": 100,
  "SpotPrice": "0.05",
  "LaunchSpecifications": [
    { "InstanceType": "m5.large",  "SubnetId": "subnet-1a", "ImageId": "ami-0abc", "WeightedCapacity": 2 },
    { "InstanceType": "m5.large",  "SubnetId": "subnet-1b", "ImageId": "ami-0abc", "WeightedCapacity": 2 },
    { "InstanceType": "m5a.large", "SubnetId": "subnet-1c", "ImageId": "ami-0abc", "WeightedCapacity": 2 },
    { "InstanceType": "m4.large",  "SubnetId": "subnet-1a", "ImageId": "ami-0abc", "WeightedCapacity": 2 }
  ]
}`,
    },
    problemStatement:
      "You are a solutions architect at a SaaS analytics company. A data-pipeline workload needs 500 vCPUs of compute capacity for ~8 hours each night. The job is fault-tolerant. Compare the four Spot Fleet allocation strategies and pick the BEST one for this use case, then explain why diversification across 3 AZs and 4 instance types reduces interruption risk.",
    questions: [
      {
        q: "Which Spot Fleet allocation strategy is AWS's recommended default for most workloads?",
        options: ["A. lowestPrice", "B. diversified", "C. capacityOptimized", "D. priceCapacityOptimized"],
        answer: "D",
        explanation:
          "D is correct: priceCapacityOptimized picks pools with the most spare capacity, then the cheapest among those — minimizing interruption risk and cost simultaneously. A risks rapid reclaim from a thinly-stocked pool. B is safer but wastes money. C is interruption-optimized but ignores price.",
      },
      {
        q: "A Spot Fleet is configured with target capacity 100 and max price $0.10/hr. The Spot price in all candidate pools rises above $0.10. What happens?",
        options: [
          "A. AWS launches instances anyway and bills at On-Demand price.",
          "B. The fleet stops launching new instances and existing ones are eventually reclaimed.",
          "C. The fleet falls back to Reserved Instances.",
          "D. The fleet automatically increases the max price.",
        ],
        answer: "B",
        explanation:
          "B is correct: the fleet respects your cap — it will neither launch new Spots above the cap nor protect existing ones from interruption. A is wrong: you'd get throttled, not silently upcharged. C is invented (no automatic RI fallback). D is wrong — the max price is yours to set, not AWS's.",
      },
      {
        q: "Why does spreading a Spot Fleet across multiple AZs and instance types REDUCE the risk of mass interruption?",
        options: [
          "A. Because AWS uses a global queue that ignores AZ boundaries.",
          "B. Because each (instance type, AZ) is a separate capacity pool with its own price and reclaim risk.",
          "C. Because Spot prices are identical everywhere — diversity is purely cosmetic.",
          "D. Because Reserved Instances cover the gaps automatically.",
        ],
        answer: "B",
        explanation:
          "B is correct: each (type, AZ) tuple is an independent Spot pool. If one pool gets reclaimed, the others can still serve. A is wrong: Spot capacity is per-pool, not global. C is wrong: prices differ across pools. D is wrong: RIs and Spot are independent purchase models.",
      },
    ],
  },

  // =================================================================
  // SECTION 4: EC2 ASSOCIATE
  // =================================================================
  {
    id: "private-public-ip",
    title: "Private vs Public IPs (IPv4)",
    shortLabel: "Private vs Public IP",
    section: "Amazon EC2 — Associate",
    domain: "Networking",
    explanation:
      "Every EC2 instance gets a **private IPv4** address from its subnet — used for in-VPC communication and the only way to reach the instance from other VPC resources. If the instance launches in a public subnet with auto-assign enabled, it also gets a **public IPv4** address — a temporary, AWS-owned address that changes if you stop/start the instance. Private IP ranges are reserved by RFC1918 (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16); public IPs must be globally unique. Outbound internet traffic from a private-only instance flows through a NAT Gateway (in a public subnet) so the destination sees a public IP but the instance never gets one of its own. Public IPv4 addresses are now a paid resource on AWS — design to minimize them.",
    analogy:
      "Private IPs are the extension numbers inside a corporate phone system — 555-1234 internal works only inside the building. Public IPs are direct-dial outside numbers reachable from anywhere. Two different companies can each have an extension 1234, but no two buildings on Earth share the same public phone number — that's why public IPs must be globally unique.",
    diagram: `<svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Private vs public IP addressing">${svgDefs}
      <rect x="20" y="20" width="680" height="280" rx="10" fill="#1a2332" stroke="#2d3a4f"/>
      <text x="360" y="48" text-anchor="middle" fill="#ff9900" font-size="16" font-weight="700">Private vs Public IPv4</text>
      <rect x="40" y="80" width="300" height="190" rx="8" fill="#243349" stroke="#3b82f6" stroke-dasharray="6 4"/>
      <text x="190" y="105" text-anchor="middle" fill="#3b82f6" font-size="13" font-weight="600">VPC 10.0.0.0/16</text>
      <rect x="60" y="125" width="120" height="50" rx="6" fill="#1a2332" stroke="#3d4d68"/>
      <text x="120" y="148" text-anchor="middle" fill="#e6edf3" font-size="11">EC2 web</text>
      <text x="120" y="166" text-anchor="middle" fill="#8b949e" font-size="10">10.0.1.5 (priv)</text>
      <rect x="200" y="125" width="120" height="50" rx="6" fill="#1a2332" stroke="#3d4d68"/>
      <text x="260" y="148" text-anchor="middle" fill="#e6edf3" font-size="11">EC2 db</text>
      <text x="260" y="166" text-anchor="middle" fill="#8b949e" font-size="10">10.0.2.7 (priv)</text>
      <line x1="180" y1="150" x2="200" y2="150" stroke="#10b981" stroke-width="2"/>
      <text x="190" y="195" text-anchor="middle" fill="#10b981" font-size="11">private network</text>
      <text x="190" y="215" text-anchor="middle" fill="#8b949e" font-size="10">RFC1918: 10/8 · 172.16/12 · 192.168/16</text>
      <line x1="340" y1="150" x2="400" y2="150" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <rect x="400" y="125" width="140" height="50" rx="6" fill="#243349" stroke="#ff9900"/>
      <text x="470" y="148" text-anchor="middle" fill="#ff9900" font-size="11">IGW / NAT GW</text>
      <text x="470" y="166" text-anchor="middle" fill="#8b949e" font-size="10">translate to public IP</text>
      <line x1="540" y1="150" x2="600" y2="150" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <rect x="600" y="125" width="80" height="50" rx="6" fill="#243349" stroke="#3d4d68"/>
      <text x="640" y="148" text-anchor="middle" fill="#e6edf3" font-size="11">Internet</text>
      <text x="640" y="166" text-anchor="middle" fill="#8b949e" font-size="10">public IPv4</text>
      <text x="360" y="290" text-anchor="middle" fill="#b0bac6" font-size="11">Public IPv4 is paid on AWS now — minimize by using NAT GW + private subnets</text>
    </svg>`,
    codeExample: {
      language: "bash",
      title: "Inspect an instance's private/public IPs",
      code: `# From outside (CLI)
aws ec2 describe-instances --instance-ids i-0abc \\
  --query 'Reservations[].Instances[].[PrivateIpAddress,PublicIpAddress]' \\
  --output text

# From INSIDE the instance (metadata service)
curl http://169.254.169.254/latest/meta-data/local-ipv4   # 10.0.1.5
curl http://169.254.169.254/latest/meta-data/public-ipv4  # 54.x.y.z (if assigned)

# Disable auto-assigned public IP on a subnet
aws ec2 modify-subnet-attribute --subnet-id subnet-0abc \\
  --no-map-public-ip-on-launch`,
    },
    problemStatement:
      "You are a solutions architect at an e-commerce platform. The auditor flags that 40 backend EC2 instances each carry a public IPv4 address, even though they only talk to internal services. Explain how moving them to a private subnet behind a NAT Gateway preserves outbound internet access (for OS updates) while removing all public IPs — and how that saves money under the new public IPv4 pricing.",
    questions: [
      {
        q: "Which of the following is a valid private IPv4 address range as defined by RFC 1918?",
        options: ["A. 8.8.0.0/16", "B. 172.16.0.0/12", "C. 169.254.0.0/16", "D. 100.64.0.0/10"],
        answer: "B",
        explanation:
          "B is correct: 172.16.0.0/12 is one of the three RFC1918 private ranges (10/8, 172.16/12, 192.168/16). A is Google DNS (public). C is link-local (used by EC2 metadata service, not private). D is Carrier-Grade NAT — not RFC1918 private.",
      },
      {
        q: "What happens to an EC2 instance's auto-assigned public IPv4 address when you stop and then start the instance?",
        options: [
          "A. It is preserved.",
          "B. It changes to a different AWS-owned public IP.",
          "C. The instance becomes private-only.",
          "D. It changes to the instance's MAC-derived IPv6 address.",
        ],
        answer: "B",
        explanation:
          "B is correct: auto-assigned public IPv4 addresses are released on stop and a new one is allocated on start. A is wrong — only Elastic IPs are sticky. C is wrong: the instance is still public if the subnet has auto-assign on. D is wrong — IPv6 is unrelated to IPv4 assignment.",
      },
      {
        q: "An instance in a private subnet needs to download OS updates from the internet but must not be reachable from the internet. Which AWS resource enables this?",
        options: ["A. Internet Gateway", "B. NAT Gateway", "C. Direct Connect", "D. Transit Gateway"],
        answer: "B",
        explanation:
          "B is correct: a NAT Gateway in a public subnet lets private instances initiate outbound traffic (with the NAT's public IP), but no return path exists for unsolicited inbound connections. A would expose the instance directly. C is a dedicated private line back to corporate, not for internet. D connects VPCs to each other, not to the internet.",
      },
    ],
  },

  {
    id: "elastic-ip",
    title: "Elastic IPs — Sticky Public IPv4",
    shortLabel: "Elastic IP",
    section: "Amazon EC2 — Associate",
    domain: "Networking",
    explanation:
      "An **Elastic IP (EIP)** is a public IPv4 address that you reserve in your account and keep until you explicitly release it. Unlike the auto-assigned public IPv4 (which changes on stop/start), an EIP stays with your account and can be **remapped** from one EC2 instance to another in seconds — useful for failover. You're capped at 5 EIPs per Region by default (request an increase via Service Quotas). AWS bills you for any EIP that is NOT associated with a running instance (to discourage hoarding), and since Feb 2024 also charges per hour for EIPs even when associated. The exam frequently asks 'do you actually need an EIP?' — usually the answer is no: use a DNS record (Route 53) pointing at the auto-assigned public IP, OR put a Load Balancer in front of your instances.",
    analogy:
      "An Elastic IP is like keeping a phone number when you switch carriers. The number stays yours (until you cancel) and you can move it to a new handset (EC2 instance) in minutes. The downside: you pay for the privilege even when no one's making calls, which is why most modern apps just use DNS portability instead.",
    diagram: `<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Elastic IP failover">${svgDefs}
      <rect x="20" y="20" width="680" height="260" rx="10" fill="#1a2332" stroke="#2d3a4f"/>
      <text x="360" y="48" text-anchor="middle" fill="#ff9900" font-size="16" font-weight="700">Elastic IP — failover by remapping</text>
      <rect x="60" y="80" width="120" height="180" rx="8" fill="#243349" stroke="#3b82f6"/>
      <text x="120" y="105" text-anchor="middle" fill="#3b82f6" font-size="12" font-weight="600">EIP 54.1.2.3</text>
      <text x="120" y="123" text-anchor="middle" fill="#8b949e" font-size="10">your account</text>
      <text x="120" y="170" text-anchor="middle" fill="#10b981" font-size="11">Sticky</text>
      <text x="120" y="210" text-anchor="middle" fill="#8b949e" font-size="10">5 per Region (default)</text>
      <text x="120" y="228" text-anchor="middle" fill="#f59e0b" font-size="10">paid when unattached</text>
      <line x1="180" y1="170" x2="280" y2="130" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="180" y1="170" x2="280" y2="220" stroke="#ef4444" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#arrow-mute)"/>
      <rect x="290" y="100" width="170" height="60" rx="6" fill="#243349" stroke="#10b981"/>
      <text x="375" y="123" text-anchor="middle" fill="#10b981" font-size="12" font-weight="600">EC2 primary (healthy)</text>
      <text x="375" y="143" text-anchor="middle" fill="#8b949e" font-size="10">currently bound</text>
      <rect x="290" y="195" width="170" height="60" rx="6" fill="#243349" stroke="#ef4444"/>
      <text x="375" y="218" text-anchor="middle" fill="#ef4444" font-size="12" font-weight="600">EC2 failed</text>
      <text x="375" y="238" text-anchor="middle" fill="#8b949e" font-size="10">remap EIP here on recovery</text>
      <rect x="490" y="130" width="170" height="80" rx="6" fill="#243349" stroke="#3d4d68"/>
      <text x="575" y="155" text-anchor="middle" fill="#e6edf3" font-size="12">DNS / clients</text>
      <text x="575" y="175" text-anchor="middle" fill="#8b949e" font-size="10">no DNS update needed</text>
      <text x="575" y="195" text-anchor="middle" fill="#8b949e" font-size="10">re-resolve in &lt; 60s</text>
    </svg>`,
    codeExample: {
      language: "bash",
      title: "Allocate, associate, remap, and release an Elastic IP",
      code: `# Allocate a new EIP (returns AllocationId + PublicIp)
aws ec2 allocate-address --domain vpc

# Associate it with an instance
aws ec2 associate-address \\
  --instance-id i-0abc \\
  --allocation-id eipalloc-abc

# Remap to a different instance on failover (same call, new instance)
aws ec2 associate-address \\
  --instance-id i-0def \\
  --allocation-id eipalloc-abc \\
  --allow-reassociation

# Release when truly done (avoids hourly idle charge)
aws ec2 release-address --allocation-id eipalloc-abc`,
    },
    problemStatement:
      "You are a solutions architect at a payment-processing company. A legacy partner system whitelists by IP and must keep talking to a specific public IPv4 address — even when the EC2 instance behind it fails over. Walk through how an Elastic IP enables this, the IAM permissions needed for the failover script, and why a Load Balancer with DNS would be the BETTER modern solution if the partner can be convinced to whitelist a hostname instead.",
    questions: [
      {
        q: "Which statement about Elastic IPs is TRUE?",
        options: [
          "A. An EIP is free as long as it's allocated to your account.",
          "B. An EIP only persists for the lifetime of a single EC2 instance.",
          "C. An EIP stays with your account until you release it and can be remapped between instances.",
          "D. Each account is limited to 100 EIPs per Region by default.",
        ],
        answer: "C",
        explanation:
          "C is correct: EIPs are account-level and persist across stop/start/terminate operations until you explicitly release them. A is wrong: AWS bills for idle EIPs (and as of 2024, for associated EIPs too). B is wrong — EIPs survive instance termination. D is wrong: default soft limit is 5 per Region.",
      },
      {
        q: "An EIP is currently allocated to your account but not associated with any running EC2 instance. What is AWS's billing behavior?",
        options: [
          "A. No charge — EIPs are free unless used.",
          "B. A small hourly charge applies to discourage hoarding unused public IPs.",
          "C. The EIP is automatically released after 30 days.",
          "D. AWS reassigns the EIP to another customer.",
        ],
        answer: "B",
        explanation:
          "B is correct: an unattached EIP incurs an hourly charge specifically to discourage reservation of unused public IPv4 (a globally scarce resource). A is incorrect. C is invented — EIPs are sticky. D would never happen: AWS does not steal your reserved IP.",
      },
      {
        q: "Which is the BEST modern alternative to using an Elastic IP for a dynamic web application?",
        options: [
          "A. Hard-code multiple public IPs in DNS A records.",
          "B. Put an Application Load Balancer in front of the instances and let DNS resolve the ALB hostname.",
          "C. Use a Dedicated Host and a static MAC address.",
          "D. Run the application directly on the AWS API endpoint.",
        ],
        answer: "B",
        explanation:
          "B is correct: an ALB gives you a stable DNS name (which Route 53 can alias), supports many backends, and avoids EIP scarcity / cost. A is fragile (DNS TTL + record churn). C is unrelated to traffic ingress. D is nonsense.",
      },
    ],
  },

  {
    id: "placement-groups",
    title: "Placement Groups (Cluster, Spread, Partition)",
    shortLabel: "Placement Groups",
    section: "Amazon EC2 — Associate",
    domain: "Compute",
    explanation:
      "**Placement Groups** let you influence how EC2 instances are physically placed in the AWS data center for either maximum performance or maximum fault isolation. Three strategies: (1) **Cluster** — packs instances tight on the same low-latency, high-bandwidth network in a single AZ. Best for HPC, tight Big Data jobs that need ultra-low latency. Risk: a single hardware failure can take all of them out. (2) **Spread** — places each instance on distinct underlying hardware. Limit: 7 instances per group per AZ. Best for critical apps where you want each instance isolated from the others' hardware faults. (3) **Partition** — divides instances into logical 'partitions' that each sit on their own rack; up to 7 partitions per AZ, hundreds of instances per partition. Each partition gets a metadata tag the instance can read. Best for big distributed systems like HDFS, Cassandra, Kafka, where partition-aware sharding limits blast radius of a rack failure.",
    analogy:
      "Cluster is putting all your developers in one open-plan room — fast collaboration but a fire takes them all out. Spread is putting each developer in a separate detached office building — bulletproof against any single incident but capped at how many buildings you can manage. Partition is putting them on different floors of the same campus — clusters of teammates per floor, but a flood on one floor doesn't touch the others.",
    diagram: `<svg viewBox="0 0 720 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placement group strategies cluster spread partition">${svgDefs}
      <rect x="20" y="20" width="680" height="300" rx="10" fill="#1a2332" stroke="#2d3a4f"/>
      <text x="360" y="48" text-anchor="middle" fill="#ff9900" font-size="16" font-weight="700">Placement Group Strategies</text>
      <rect x="40" y="80" width="200" height="220" rx="8" fill="#243349" stroke="#3b82f6"/>
      <text x="140" y="105" text-anchor="middle" fill="#3b82f6" font-size="13" font-weight="600">Cluster</text>
      <text x="140" y="125" text-anchor="middle" fill="#8b949e" font-size="10">tight pack, 1 AZ</text>
      <rect x="65" y="145" width="40" height="25" rx="4" fill="#1a2332" stroke="#3d4d68"/>
      <rect x="110" y="145" width="40" height="25" rx="4" fill="#1a2332" stroke="#3d4d68"/>
      <rect x="155" y="145" width="40" height="25" rx="4" fill="#1a2332" stroke="#3d4d68"/>
      <rect x="65" y="175" width="40" height="25" rx="4" fill="#1a2332" stroke="#3d4d68"/>
      <rect x="110" y="175" width="40" height="25" rx="4" fill="#1a2332" stroke="#3d4d68"/>
      <rect x="155" y="175" width="40" height="25" rx="4" fill="#1a2332" stroke="#3d4d68"/>
      <text x="140" y="225" text-anchor="middle" fill="#10b981" font-size="11">low-latency 10 Gbps</text>
      <text x="140" y="245" text-anchor="middle" fill="#ef4444" font-size="11">single failure domain</text>
      <text x="140" y="270" text-anchor="middle" fill="#8b949e" font-size="10">Use: HPC, ML training,</text>
      <text x="140" y="287" text-anchor="middle" fill="#8b949e" font-size="10">Big Data shuffles</text>
      <rect x="260" y="80" width="200" height="220" rx="8" fill="#243349" stroke="#10b981"/>
      <text x="360" y="105" text-anchor="middle" fill="#10b981" font-size="13" font-weight="600">Spread</text>
      <text x="360" y="125" text-anchor="middle" fill="#8b949e" font-size="10">distinct hardware, max 7 per AZ</text>
      <rect x="285" y="145" width="55" height="30" rx="4" fill="#1a2332" stroke="#3d4d68"/>
      <text x="312" y="164" text-anchor="middle" fill="#8b949e" font-size="9">rack A</text>
      <rect x="350" y="145" width="55" height="30" rx="4" fill="#1a2332" stroke="#3d4d68"/>
      <text x="377" y="164" text-anchor="middle" fill="#8b949e" font-size="9">rack B</text>
      <rect x="415" y="145" width="40" height="30" rx="4" fill="#1a2332" stroke="#3d4d68"/>
      <text x="435" y="164" text-anchor="middle" fill="#8b949e" font-size="9">rack C</text>
      <rect x="285" y="185" width="55" height="30" rx="4" fill="#1a2332" stroke="#3d4d68"/>
      <text x="312" y="204" text-anchor="middle" fill="#8b949e" font-size="9">rack D</text>
      <rect x="350" y="185" width="55" height="30" rx="4" fill="#1a2332" stroke="#3d4d68"/>
      <text x="377" y="204" text-anchor="middle" fill="#8b949e" font-size="9">rack E</text>
      <text x="360" y="240" text-anchor="middle" fill="#10b981" font-size="11">max isolation</text>
      <text x="360" y="260" text-anchor="middle" fill="#ef4444" font-size="11">7-instance cap per AZ</text>
      <text x="360" y="285" text-anchor="middle" fill="#8b949e" font-size="10">Use: critical individual hosts</text>
      <rect x="480" y="80" width="200" height="220" rx="8" fill="#243349" stroke="#ff9900"/>
      <text x="580" y="105" text-anchor="middle" fill="#ff9900" font-size="13" font-weight="600">Partition</text>
      <text x="580" y="125" text-anchor="middle" fill="#8b949e" font-size="10">7 partitions/AZ, 100s of EC2</text>
      <rect x="500" y="145" width="50" height="50" rx="4" fill="#1a2332" stroke="#3d4d68"/>
      <text x="525" y="172" text-anchor="middle" fill="#8b949e" font-size="9">P1</text>
      <rect x="555" y="145" width="50" height="50" rx="4" fill="#1a2332" stroke="#3d4d68"/>
      <text x="580" y="172" text-anchor="middle" fill="#8b949e" font-size="9">P2</text>
      <rect x="610" y="145" width="50" height="50" rx="4" fill="#1a2332" stroke="#3d4d68"/>
      <text x="635" y="172" text-anchor="middle" fill="#8b949e" font-size="9">P3</text>
      <rect x="500" y="200" width="160" height="20" rx="4" fill="#1a2332" stroke="#3d4d68"/>
      <text x="580" y="215" text-anchor="middle" fill="#8b949e" font-size="9">independent racks</text>
      <text x="580" y="240" text-anchor="middle" fill="#10b981" font-size="11">partition tag in metadata</text>
      <text x="580" y="260" text-anchor="middle" fill="#10b981" font-size="11">isolated failure domains</text>
      <text x="580" y="285" text-anchor="middle" fill="#8b949e" font-size="10">Use: HDFS, Kafka, Cassandra</text>
    </svg>`,
    codeExample: {
      language: "bash",
      title: "Create a placement group and launch instances into it",
      code: `# Cluster — for ultra-low-latency HPC
aws ec2 create-placement-group --group-name hpc-cluster --strategy cluster

# Spread — for max isolation across racks (7-instance cap per AZ)
aws ec2 create-placement-group --group-name web-spread --strategy spread

# Partition — for big distributed systems (3 partitions in this example)
aws ec2 create-placement-group --group-name cassandra-ring \\
  --strategy partition --partition-count 3

# Launch into a partition group, sticking a node into partition 2
aws ec2 run-instances --image-id ami-0abc --instance-type r5.large \\
  --placement GroupName=cassandra-ring,PartitionNumber=2`,
    },
    problemStatement:
      "You are a solutions architect at a Big Data startup. A 24-node Hadoop cluster needs to survive an entire rack failure without losing more than 1/N of its data, while a separate 8-node ML training job needs the lowest possible inter-node network latency. Pick the right placement group strategy for each workload and explain why mixing them in the SAME group would be a poor choice.",
    questions: [
      {
        q: "Which placement group strategy delivers the LOWEST inter-instance network latency?",
        options: ["A. Spread", "B. Partition", "C. Cluster", "D. Edge"],
        answer: "C",
        explanation:
          "C is correct: Cluster packs instances tight on the same low-latency network in a single AZ. A maximizes isolation but spreads instances across hardware — higher latency. B is for many-instance distributed systems and is not optimized for the lowest pairwise latency. D is invented.",
      },
      {
        q: "What is the maximum number of EC2 instances per Availability Zone in a Spread placement group?",
        options: ["A. 3", "B. 7", "C. 100", "D. unlimited"],
        answer: "B",
        explanation:
          "B is correct: Spread placement groups cap at 7 instances per AZ — a fixed limit because AWS guarantees each lives on a separate rack/hardware. A is the minimum AZ count, not a Spread limit. C and D are wrong.",
      },
      {
        q: "Which placement group strategy is BEST for an Apache Cassandra cluster of 60 nodes where you want a single rack failure to take down at most 1/N of the dataset?",
        options: ["A. Cluster", "B. Spread", "C. Partition", "D. Dedicated Hosts"],
        answer: "C",
        explanation:
          "C is correct: Partition groups are designed for exactly this — they expose a partition tag the application can use to colocate replicas across partitions, ensuring rack-level fault isolation across hundreds of instances. A is too vulnerable. B caps at 7 instances per AZ. D is a tenancy model, not a placement strategy.",
      },
    ],
  },

  {
    id: "elastic-network-interfaces",
    title: "Elastic Network Interfaces (ENI)",
    shortLabel: "ENI",
    section: "Amazon EC2 — Associate",
    domain: "Networking",
    explanation:
      "An **Elastic Network Interface (ENI)** is a virtual NIC that represents a network endpoint in a VPC. Every EC2 instance has at least one (the **primary ENI**), and many instance types support attaching secondary ENIs. An ENI carries: one primary private IPv4, optional secondary private IPv4s, one Elastic IP per private IPv4, one or more security groups, a MAC address, and an optional public IPv4. ENIs are **AZ-locked** — you can't move them to a different AZ. The key superpower of ENIs is that you can **create them independently of any instance** and then attach them to an instance later. This enables fast failover patterns: pre-allocate an ENI with a stable IP + MAC, attach it to instance A; if A fails, detach and attach to instance B in seconds, and the new instance now answers on the SAME IP.",
    analogy:
      "An ENI is like a sim card. You can pop it into one phone (EC2 instance) today and into a different phone tomorrow — same phone number (IP), same contacts (security groups), same network identity (MAC). The phones are interchangeable; the sim is the identity.",
    diagram: `<svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Elastic network interface attachment and failover">${svgDefs}
      <rect x="20" y="20" width="680" height="280" rx="10" fill="#1a2332" stroke="#2d3a4f"/>
      <text x="360" y="48" text-anchor="middle" fill="#ff9900" font-size="16" font-weight="700">ENI — virtual NIC that moves between instances</text>
      <rect x="60" y="80" width="200" height="200" rx="8" fill="#243349" stroke="#10b981"/>
      <text x="160" y="105" text-anchor="middle" fill="#10b981" font-size="12" font-weight="600">EC2 instance A (healthy)</text>
      <rect x="80" y="130" width="160" height="50" rx="6" fill="#1a2332" stroke="#ff9900"/>
      <text x="160" y="150" text-anchor="middle" fill="#ff9900" font-size="12" font-weight="600">primary ENI</text>
      <text x="160" y="167" text-anchor="middle" fill="#8b949e" font-size="10">10.0.1.20 · SG-web</text>
      <rect x="80" y="195" width="160" height="40" rx="6" fill="#1a2332" stroke="#3d4d68"/>
      <text x="160" y="220" text-anchor="middle" fill="#3b82f6" font-size="11">secondary ENI</text>
      <text x="160" y="252" text-anchor="middle" fill="#8b949e" font-size="10">+stable 10.0.1.55</text>
      <line x1="265" y1="220" x2="445" y2="220" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)" stroke-dasharray="6 4"/>
      <text x="355" y="210" text-anchor="middle" fill="#ff9900" font-size="11">detach + attach</text>
      <rect x="450" y="80" width="200" height="200" rx="8" fill="#243349" stroke="#3b82f6"/>
      <text x="550" y="105" text-anchor="middle" fill="#3b82f6" font-size="12" font-weight="600">EC2 instance B (failover)</text>
      <rect x="470" y="130" width="160" height="50" rx="6" fill="#1a2332" stroke="#3d4d68"/>
      <text x="550" y="150" text-anchor="middle" fill="#e6edf3" font-size="12">primary ENI (different IP)</text>
      <rect x="470" y="195" width="160" height="40" rx="6" fill="#1a2332" stroke="#3d4d68" stroke-dasharray="4 4"/>
      <text x="550" y="220" text-anchor="middle" fill="#8b949e" font-size="11">slot for the moved ENI</text>
      <text x="360" y="295" text-anchor="middle" fill="#b0bac6" font-size="11">ENI is AZ-locked but instance-portable — IP + SG + MAC follow the ENI</text>
    </svg>`,
    codeExample: {
      language: "bash",
      title: "Create, attach, and move an ENI between instances",
      code: `# 1) Create an ENI in a specific subnet
aws ec2 create-network-interface \\
  --subnet-id subnet-0abc \\
  --groups sg-0abc \\
  --description "failover-eni"
# returns: eni-0123

# 2) Attach it to instance A as a secondary interface
aws ec2 attach-network-interface \\
  --network-interface-id eni-0123 \\
  --instance-id i-AAAA \\
  --device-index 1

# 3) On failure, detach from A...
aws ec2 detach-network-interface --attachment-id eni-attach-xxxx

# ...and re-attach to B (same IP/MAC follows)
aws ec2 attach-network-interface \\
  --network-interface-id eni-0123 \\
  --instance-id i-BBBB \\
  --device-index 1`,
    },
    problemStatement:
      "You are a solutions architect at a legacy ISV migrating to AWS. A licensing daemon requires a specific MAC address to remain stable across host reboots (the license is keyed to MAC). Design how an ENI gives you a stable, portable MAC + IP that the daemon can use, and how you'd script a failover that moves the ENI to a hot-standby EC2 instance within ~30 seconds of detecting failure.",
    questions: [
      {
        q: "Which attribute of an ENI follows it when you re-attach it to a different EC2 instance in the same AZ?",
        options: [
          "A. The host's CPU architecture",
          "B. The MAC address, private IP, security groups, and any associated EIP",
          "C. The instance type",
          "D. The AMI ID",
        ],
        answer: "B",
        explanation:
          "B is correct: an ENI carries its MAC, its private IPs, its security group bindings, and any EIPs — all of those move with it. A, C, and D are properties of the instance (host), not of the ENI.",
      },
      {
        q: "An ENI in us-east-1a is currently detached. Which target can you attach it to?",
        options: [
          "A. An EC2 instance in us-east-1b",
          "B. An EC2 instance in us-east-1a",
          "C. Any EC2 instance in any Region of your account",
          "D. A Lambda function execution context",
        ],
        answer: "B",
        explanation:
          "B is correct: ENIs are AZ-locked. They can only attach to instances in the same AZ. A crosses an AZ boundary. C crosses both AZ and Region boundaries. D is wrong: Lambda manages its own ENIs internally; you don't attach yours.",
      },
      {
        q: "Which is a valid use case for a SECONDARY ENI on an EC2 instance?",
        options: [
          "A. Increasing the instance's CPU count",
          "B. Hosting a management/monitoring interface on a separate IP and security group from the public-facing primary ENI",
          "C. Doubling the instance's RAM",
          "D. Speeding up disk IOPS",
        ],
        answer: "B",
        explanation:
          "B is correct: a secondary ENI is commonly used to give the instance a separate IP/SG combination for admin or monitoring traffic. A, C, D are unrelated to ENIs — those are properties of the instance type / EBS volume choice.",
      },
    ],
  },

  {
    id: "ec2-hibernate",
    title: "EC2 Hibernate — Pause RAM to Disk",
    shortLabel: "EC2 Hibernate",
    section: "Amazon EC2 — Associate",
    domain: "Compute",
    explanation:
      "**EC2 Hibernate** is a third instance-lifecycle option alongside Stop and Terminate. When you hibernate, AWS dumps the instance's RAM contents to the encrypted root EBS volume, then shuts the instance down. When you start it again, AWS reads the RAM image back into memory and resumes execution — the OS is not rebooted, processes pick up exactly where they left off, application caches are warm. Hibernate is invaluable for long-running stateful workloads with slow startup (huge JVMs, ML training checkpoints in memory, expensive cache warm-ups). **Requirements**: RAM < 150 GB; supported instance families (C/M/R generations 3+, T2/T3, plus newer ones); root volume must be EBS and encrypted; AMI must support hibernate; instance must not have been hibernated for more than 60 days continuously. Spot Instances can also hibernate on interruption.",
    analogy:
      "Hibernate is like closing the lid on a laptop. The OS doesn't shut down — every browser tab, every editor with unsaved changes, every running program is preserved exactly where you left it. Open the lid and you're back in 5 seconds with everything in place. Stopping an EC2 instance is more like a full shutdown: it cleanly turns off, and starting it again means a fresh boot + cache re-warm.",
    diagram: `<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="EC2 hibernate lifecycle">${svgDefs}
      <rect x="20" y="20" width="680" height="260" rx="10" fill="#1a2332" stroke="#2d3a4f"/>
      <text x="360" y="48" text-anchor="middle" fill="#ff9900" font-size="16" font-weight="700">EC2 Hibernate — RAM is preserved</text>
      <rect x="40" y="90" width="170" height="100" rx="8" fill="#243349" stroke="#10b981"/>
      <text x="125" y="115" text-anchor="middle" fill="#10b981" font-size="13" font-weight="600">Running</text>
      <text x="125" y="140" text-anchor="middle" fill="#e6edf3" font-size="11">RAM: 64 GB live</text>
      <text x="125" y="160" text-anchor="middle" fill="#e6edf3" font-size="11">app: warm caches</text>
      <text x="125" y="180" text-anchor="middle" fill="#8b949e" font-size="10">billed: full price</text>
      <line x1="215" y1="140" x2="265" y2="140" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="240" y="130" text-anchor="middle" fill="#ff9900" font-size="11">hibernate</text>
      <rect x="270" y="90" width="170" height="100" rx="8" fill="#243349" stroke="#3b82f6"/>
      <text x="355" y="115" text-anchor="middle" fill="#3b82f6" font-size="13" font-weight="600">Hibernated</text>
      <text x="355" y="140" text-anchor="middle" fill="#e6edf3" font-size="11">RAM image → encrypted</text>
      <text x="355" y="158" text-anchor="middle" fill="#e6edf3" font-size="11">root EBS</text>
      <text x="355" y="180" text-anchor="middle" fill="#8b949e" font-size="10">billed: EBS only</text>
      <line x1="445" y1="140" x2="495" y2="140" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="470" y="130" text-anchor="middle" fill="#ff9900" font-size="11">start</text>
      <rect x="500" y="90" width="170" height="100" rx="8" fill="#243349" stroke="#10b981"/>
      <text x="585" y="115" text-anchor="middle" fill="#10b981" font-size="13" font-weight="600">Running again</text>
      <text x="585" y="140" text-anchor="middle" fill="#e6edf3" font-size="11">RAM restored verbatim</text>
      <text x="585" y="160" text-anchor="middle" fill="#e6edf3" font-size="11">no reboot</text>
      <text x="585" y="180" text-anchor="middle" fill="#8b949e" font-size="10">app resumes mid-stride</text>
      <text x="360" y="230" text-anchor="middle" fill="#b0bac6" font-size="11">Requires: RAM &lt; 150 GB · encrypted root EBS · supported family · ≤ 60-day hibernation window</text>
      <text x="360" y="252" text-anchor="middle" fill="#8b949e" font-size="11">Use for: slow-boot apps, in-memory state preservation, Spot interruption protection</text>
    </svg>`,
    codeExample: {
      language: "bash",
      title: "Launch a hibernate-enabled instance and hibernate it",
      code: `# 1) Launch with hibernation enabled — root EBS must be encrypted
aws ec2 run-instances \\
  --image-id ami-0abc \\
  --instance-type m5.large \\
  --hibernation-options Configured=true \\
  --block-device-mappings '[{
    "DeviceName": "/dev/xvda",
    "Ebs": { "VolumeSize": 50, "VolumeType": "gp3", "Encrypted": true }
  }]'

# 2) Trigger hibernate (note --hibernate flag on stop)
aws ec2 stop-instances --instance-ids i-0abc --hibernate

# 3) Start it later — RAM is restored, no reboot
aws ec2 start-instances --instance-ids i-0abc`,
    },
    problemStatement:
      "You are a solutions architect at an AI startup. Each training job takes ~30 minutes to warm up the in-memory dataset before iterating, and instances often sit idle between training campaigns. The CFO wants to stop billing for compute during idle windows without losing the warmed-up memory. Outline how EC2 Hibernate solves this, list the four pre-requisites (RAM size, encryption, family, AMI), and explain when terminating/restarting would be worse.",
    questions: [
      {
        q: "When an EC2 instance hibernates, where is the RAM contents persisted?",
        options: [
          "A. In Amazon S3",
          "B. In an Amazon FSx volume",
          "C. On the encrypted root EBS volume",
          "D. In CloudWatch Logs",
        ],
        answer: "C",
        explanation:
          "C is correct: hibernate dumps RAM to the encrypted root EBS volume of the instance. A, B, and D are wrong — none of them is the mechanism (and S3/FSx aren't even mounted as block devices on the instance).",
      },
      {
        q: "Which is a documented LIMIT of EC2 Hibernate?",
        options: [
          "A. Maximum RAM size 150 GB",
          "B. Maximum 7 hibernated instances per Region",
          "C. Only Windows AMIs are supported",
          "D. Instance type must be t2.micro",
        ],
        answer: "A",
        explanation:
          "A is correct: hibernate is supported only when the instance's RAM is under 150 GB (because the entire RAM image must fit on the root EBS plus initialization overhead). B is invented. C is wrong — Linux AMIs work fine. D is wrong: hibernate supports many instance families.",
      },
      {
        q: "What is the BIGGEST functional benefit of hibernating an EC2 instance versus stopping it normally?",
        options: [
          "A. You don't pay for the EBS volume during hibernation.",
          "B. The kernel skips POST and warm-boot is faster.",
          "C. Application processes and in-memory state survive — no cache re-warm, no restart cost.",
          "D. The instance keeps its public IPv4 address while hibernated.",
        ],
        answer: "C",
        explanation:
          "C is correct: hibernate preserves in-memory state across the off-time, so the application resumes with warm caches and in-flight state intact. A is wrong: you still pay for EBS storage. B is partly true but misleading — the OS isn't booted at all; RAM is restored verbatim. D is true only if you use an EIP; auto-assigned IPv4 can still change.",
      },
    ],
  },

  // =================================================================
  // SECTION 5: EC2 INSTANCE STORAGE
  // =================================================================
  {
    id: "ebs-volume-overview",
    title: "EBS Volume Overview",
    shortLabel: "EBS Overview",
    section: "EC2 Instance Storage",
    domain: "Storage",
    explanation:
      "**Amazon EBS** (Elastic Block Store) provides network-attached block storage volumes for EC2 instances. Think of an EBS volume as a virtual hard drive that lives on the AWS network — you mount it to an instance, format it, write a filesystem, and the data persists even if you stop or terminate the instance (depending on the Delete-on-Termination flag). Key properties: (1) **AZ-locked** — a volume in us-east-1a cannot be attached to an instance in us-east-1b without first taking a snapshot and restoring; (2) **single-attach by default** — one volume → one instance (except for io1/io2 Multi-Attach); (3) **provisioned size and IOPS** — you pay for what you reserve, not what you use; (4) **resizable online** — you can grow the volume and extend the filesystem without downtime. EBS is the foundation of stateful EC2 workloads.",
    analogy:
      "An EBS volume is like a portable external USB drive plugged into your EC2 instance — except the cable is a high-speed network instead of USB. You can unplug it from one laptop (instance) and plug it into another, as long as they're in the same room (same AZ). Take a 'photocopy' (snapshot) and you can rebuild the drive in a different room or even a different city (different AZ/Region).",
    diagram: `<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="EBS volume attached to EC2 over network">${svgDefs}
      <rect x="20" y="20" width="680" height="260" rx="10" fill="#1a2332" stroke="#2d3a4f"/>
      <text x="360" y="48" text-anchor="middle" fill="#ff9900" font-size="16" font-weight="700">EBS Volume — network-attached block storage</text>
      <rect x="60" y="100" width="180" height="160" rx="8" fill="#243349" stroke="#3b82f6"/>
      <text x="150" y="125" text-anchor="middle" fill="#3b82f6" font-size="12" font-weight="600">EC2 Instance</text>
      <text x="150" y="160" text-anchor="middle" fill="#e6edf3" font-size="11">us-east-1a</text>
      <text x="150" y="200" text-anchor="middle" fill="#8b949e" font-size="10">mounts EBS as a block device</text>
      <text x="150" y="220" text-anchor="middle" fill="#8b949e" font-size="10">/dev/xvda · /dev/sdb</text>
      <line x1="245" y1="180" x2="380" y2="180" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)" stroke-dasharray="8 4"/>
      <text x="312" y="170" text-anchor="middle" fill="#ff9900" font-size="11">network attach (AZ-local)</text>
      <rect x="385" y="120" width="180" height="120" rx="8" fill="#243349" stroke="#10b981"/>
      <text x="475" y="145" text-anchor="middle" fill="#10b981" font-size="12" font-weight="600">EBS Volume</text>
      <text x="475" y="170" text-anchor="middle" fill="#e6edf3" font-size="11">gp3 · 100 GiB · 3,000 IOPS</text>
      <text x="475" y="195" text-anchor="middle" fill="#8b949e" font-size="10">replicated within AZ</text>
      <text x="475" y="215" text-anchor="middle" fill="#8b949e" font-size="10">survives instance terminate*</text>
      <rect x="585" y="160" width="90" height="60" rx="6" fill="#243349" stroke="#3d4d68"/>
      <text x="630" y="185" text-anchor="middle" fill="#e6edf3" font-size="11">S3</text>
      <text x="630" y="208" text-anchor="middle" fill="#8b949e" font-size="10">snapshots →</text>
      <line x1="565" y1="180" x2="585" y2="180" stroke="#3d4d68"/>
      <text x="360" y="275" text-anchor="middle" fill="#b0bac6" font-size="11">AZ-locked · provisioned capacity · online resize · snapshot to S3 for cross-AZ/Region copy</text>
    </svg>`,
    codeExample: {
      language: "bash",
      title: "Create, attach, mount, and grow an EBS volume",
      code: `# 1) Create a gp3 EBS volume in the same AZ as the instance
aws ec2 create-volume --availability-zone us-east-1a \\
  --size 100 --volume-type gp3 --iops 3000

# 2) Attach to an instance as /dev/sdf
aws ec2 attach-volume --volume-id vol-0abc \\
  --instance-id i-0xyz --device /dev/sdf

# 3) Inside the instance: format & mount
sudo mkfs -t xfs /dev/nvme1n1
sudo mkdir /data && sudo mount /dev/nvme1n1 /data

# 4) Grow it later (online) — modify volume, then resize fs
aws ec2 modify-volume --volume-id vol-0abc --size 200
sudo xfs_growfs /data`,
    },
    problemStatement:
      "You are a solutions architect at a fintech company. The trading platform stores 80 GB of order journals on a single EC2 instance's EBS volume. The CTO is worried about data loss if the EC2 instance fails or the AZ goes down. Outline the EBS-side durability story (replication within an AZ, snapshot to S3 for cross-AZ/Region recovery) and the operational steps to move data to another AZ in under 30 minutes.",
    questions: [
      {
        q: "Which statement about EBS volumes is TRUE?",
        options: [
          "A. EBS volumes can be attached to instances in any AZ within the same Region.",
          "B. EBS volumes are AZ-locked — you must snapshot and restore to move them to a different AZ.",
          "C. EBS volumes are globally accessible.",
          "D. EBS data is lost when the instance reboots.",
        ],
        answer: "B",
        explanation:
          "B is correct: EBS volumes live in a single AZ. To move across AZs you take a snapshot (which lives in S3, Region-scoped) and restore it in the target AZ. A is wrong: same Region ≠ any AZ. C is wrong: not global. D is wrong: reboots preserve data — only the Instance Store is ephemeral.",
      },
      {
        q: "A team needs to RESIZE an EBS volume from 100 GiB to 500 GiB on a running production instance without downtime. Is this possible?",
        options: [
          "A. No — EBS volumes are immutable once created.",
          "B. Yes — `aws ec2 modify-volume` resizes the volume; then the OS extends the filesystem (e.g. `xfs_growfs`).",
          "C. Only if the instance is stopped first.",
          "D. Only on io1 volumes.",
        ],
        answer: "B",
        explanation:
          "B is correct: EBS Elastic Volumes allow online resize and IOPS/throughput tuning without instance restart. A is wrong: EBS is mutable. C is wrong: no stop needed. D is wrong: gp2/gp3/io1/io2 all support online resize.",
      },
      {
        q: "Which of the following is the BIGGEST advantage of EBS over EC2 Instance Store?",
        options: [
          "A. EBS gives higher local IOPS.",
          "B. EBS persists data independently of the EC2 instance lifecycle.",
          "C. EBS is free.",
          "D. EBS is the only option for Windows.",
        ],
        answer: "B",
        explanation:
          "B is correct: EBS persists across stop/start and survives termination if Delete-on-Termination is disabled — Instance Store is ephemeral and disappears on stop or hardware failure. A is wrong (Instance Store has higher local IOPS). C is wrong (EBS is paid). D is wrong (Windows works with both).",
      },
    ],
  },

  {
    id: "ebs-delete-on-termination",
    title: "EBS Delete-on-Termination Behavior",
    shortLabel: "Delete-on-Termination",
    section: "EC2 Instance Storage",
    domain: "Storage",
    explanation:
      "Every EBS volume attached to an EC2 instance has a **DeleteOnTermination** attribute that controls what happens when the instance is terminated. **Defaults**: the **root volume** is set to `DeleteOnTermination=true` (data goes away with the instance — usually what you want), while **additional attached volumes** default to `false` (they survive and become detached, unattached EBS volumes you keep paying for). You can override either default at launch time or change it on a running instance. The exam frequently tests this corner: forgetting to flip the root volume's flag means the data is silently destroyed when someone terminates the instance.",
    analogy:
      "Delete-on-Termination is like the shred-on-checkout policy at a coworking space. The desk supplies you brought with you (root volume) get shredded by default when you check out — saves storage. The hard drive you bolted under the desk (extra volume) stays put unless you tell them to shred it.",
    diagram: `<svg viewBox="0 0 720 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Delete on termination default behavior">${svgDefs}
      <rect x="20" y="20" width="680" height="240" rx="10" fill="#1a2332" stroke="#2d3a4f"/>
      <text x="360" y="48" text-anchor="middle" fill="#ff9900" font-size="16" font-weight="700">DeleteOnTermination — root vs additional volumes</text>
      <rect x="60" y="80" width="280" height="140" rx="8" fill="#243349" stroke="#ef4444"/>
      <text x="200" y="105" text-anchor="middle" fill="#ef4444" font-size="13" font-weight="600">Root volume — default TRUE</text>
      <text x="200" y="130" text-anchor="middle" fill="#e6edf3" font-size="11">attached at /dev/xvda</text>
      <text x="200" y="155" text-anchor="middle" fill="#e6edf3" font-size="11">terminate instance → volume DELETED</text>
      <text x="200" y="185" text-anchor="middle" fill="#8b949e" font-size="11">Override: set DeleteOnTermination=false</text>
      <text x="200" y="203" text-anchor="middle" fill="#8b949e" font-size="11">to preserve OS state for forensics</text>
      <rect x="380" y="80" width="280" height="140" rx="8" fill="#243349" stroke="#10b981"/>
      <text x="520" y="105" text-anchor="middle" fill="#10b981" font-size="13" font-weight="600">Additional volume — default FALSE</text>
      <text x="520" y="130" text-anchor="middle" fill="#e6edf3" font-size="11">attached at /dev/sdf etc.</text>
      <text x="520" y="155" text-anchor="middle" fill="#e6edf3" font-size="11">terminate instance → volume DETACHED</text>
      <text x="520" y="185" text-anchor="middle" fill="#8b949e" font-size="11">Keep paying for unattached EBS</text>
      <text x="520" y="203" text-anchor="middle" fill="#8b949e" font-size="11">unless you flip the flag or delete manually</text>
    </svg>`,
    codeExample: {
      language: "bash",
      title: "Change DeleteOnTermination at launch and on a running instance",
      code: `# 1) At launch — keep root volume even after termination
aws ec2 run-instances --image-id ami-0abc --instance-type t3.micro \\
  --block-device-mappings '[{
    "DeviceName": "/dev/xvda",
    "Ebs": { "VolumeSize": 30, "DeleteOnTermination": false }
  }]'

# 2) On a running instance — set DeleteOnTermination=true for an extra volume
aws ec2 modify-instance-attribute --instance-id i-0abc \\
  --block-device-mappings '[{
    "DeviceName": "/dev/sdf",
    "Ebs": { "DeleteOnTermination": true }
  }]'

# 3) Inspect current setting
aws ec2 describe-instances --instance-ids i-0abc \\
  --query 'Reservations[].Instances[].BlockDeviceMappings[].[DeviceName,Ebs.DeleteOnTermination]' \\
  --output table`,
    },
    problemStatement:
      "You are a solutions architect responding to an incident. A junior engineer terminated an EC2 instance to 'clean up' and discovered that the customer database it hosted is gone — DeleteOnTermination was true on the root volume. Walk through (1) what the default behavior is, (2) the two ways to prevent this in future, and (3) why pairing snapshots + termination protection is the proper defensive stance.",
    questions: [
      {
        q: "By default, what is the DeleteOnTermination value for the ROOT EBS volume of a freshly launched EC2 instance?",
        options: ["A. false", "B. true", "C. undefined", "D. depends on the AMI"],
        answer: "B",
        explanation:
          "B is correct: root volumes default to DeleteOnTermination=true, which is why terminating the instance also deletes the OS disk. A would be the additional-volume default. C/D are not the documented behavior.",
      },
      {
        q: "An EC2 instance has TWO volumes attached: the root volume (default) and a data volume that the engineer added at launch (default settings). The instance is terminated. What happens?",
        options: [
          "A. Both volumes are deleted.",
          "B. The root volume is deleted; the data volume becomes a detached EBS volume in your account (still billed).",
          "C. Both volumes are detached and preserved.",
          "D. Only the data volume is deleted.",
        ],
        answer: "B",
        explanation:
          "B is correct: this captures the default behaviors precisely — root is destroyed (default true), additional volume is detached and preserved (default false). A is wrong because the data volume's default is false. C is wrong because the root's default is true. D inverts the rule.",
      },
      {
        q: "A team needs to PRESERVE the root OS volume for forensic investigation after an instance is terminated. Which is the BEST approach?",
        options: [
          "A. Detach the root volume after termination.",
          "B. Take an EBS snapshot just before termination.",
          "C. Set DeleteOnTermination=false on the root volume (at launch or via modify-instance-attribute).",
          "D. Move the data to S3 manually.",
        ],
        answer: "C",
        explanation:
          "C is correct: changing the attribute is the canonical way to keep the volume after termination — the data is fully intact and immediately attachable to another instance. A is impossible (you can't detach a terminated instance's root volume). B is a valid backup but creates a snapshot, not the live volume. D is unrelated.",
      },
    ],
  },

  {
    id: "ebs-snapshots",
    title: "EBS Snapshots, Archive, Recycle Bin, FSR",
    shortLabel: "EBS Snapshots",
    section: "EC2 Instance Storage",
    domain: "Storage",
    explanation:
      "An **EBS Snapshot** is a point-in-time backup of an EBS volume, stored incrementally in S3 (managed by AWS — you don't see the bucket). Snapshots are **Region-scoped** (unlike volumes, which are AZ-scoped) and can be **copied to other Regions** for disaster recovery. From a snapshot you can create a new volume in any AZ of the destination Region. Three useful features: **(1) EBS Snapshot Archive** — move cold snapshots to an archive tier that costs 75% less; restore takes 24–72 hours. **(2) Recycle Bin** — define retention rules so that a deleted snapshot stays recoverable for 1 day to 1 year before truly being purged — protects against accidental delete. **(3) Fast Snapshot Restore (FSR)** — pre-initialize a snapshot in a specific AZ so the first read from any restored volume has no latency penalty (costs extra). Snapshots can be encrypted via KMS and shared (or copied with encryption) across accounts.",
    analogy:
      "An EBS snapshot is like a photocopy of your hard drive. You can stash the photocopy in a vault (S3), ship a copy to another city (cross-Region copy), pull it out of the vault to make a new working hard drive (restore), put dusty old copies into deep storage (Snapshot Archive), and have a 'trash bin' where shredded copies sit recoverable for 30 days before being burned (Recycle Bin).",
    diagram: `<svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="EBS snapshot lifecycle">${svgDefs}
      <rect x="20" y="20" width="680" height="280" rx="10" fill="#1a2332" stroke="#2d3a4f"/>
      <text x="360" y="48" text-anchor="middle" fill="#ff9900" font-size="16" font-weight="700">EBS Snapshot Lifecycle</text>
      <rect x="40" y="100" width="120" height="80" rx="6" fill="#243349" stroke="#10b981"/>
      <text x="100" y="130" text-anchor="middle" fill="#10b981" font-size="12" font-weight="600">EBS Volume</text>
      <text x="100" y="150" text-anchor="middle" fill="#8b949e" font-size="10">us-east-1a</text>
      <line x1="165" y1="140" x2="215" y2="140" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="190" y="130" text-anchor="middle" fill="#ff9900" font-size="10">snapshot</text>
      <rect x="220" y="100" width="120" height="80" rx="6" fill="#243349" stroke="#3b82f6"/>
      <text x="280" y="130" text-anchor="middle" fill="#3b82f6" font-size="12" font-weight="600">Snapshot</text>
      <text x="280" y="150" text-anchor="middle" fill="#8b949e" font-size="10">in S3 · Region-scoped</text>
      <line x1="345" y1="140" x2="395" y2="140" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="370" y="130" text-anchor="middle" fill="#ff9900" font-size="10">restore</text>
      <rect x="400" y="100" width="140" height="80" rx="6" fill="#243349" stroke="#10b981"/>
      <text x="470" y="130" text-anchor="middle" fill="#10b981" font-size="12" font-weight="600">New Volume</text>
      <text x="470" y="150" text-anchor="middle" fill="#8b949e" font-size="10">in any AZ of dest Region</text>
      <line x1="280" y1="180" x2="280" y2="225" stroke="#3d4d68"/>
      <rect x="40" y="225" width="170" height="55" rx="6" fill="#243349" stroke="#f59e0b"/>
      <text x="125" y="248" text-anchor="middle" fill="#f59e0b" font-size="11" font-weight="600">Archive (75% cheaper)</text>
      <text x="125" y="266" text-anchor="middle" fill="#8b949e" font-size="10">restore 24–72h</text>
      <rect x="225" y="225" width="170" height="55" rx="6" fill="#243349" stroke="#3b82f6"/>
      <text x="310" y="248" text-anchor="middle" fill="#3b82f6" font-size="11" font-weight="600">Recycle Bin</text>
      <text x="310" y="266" text-anchor="middle" fill="#8b949e" font-size="10">retention 1d – 1yr</text>
      <rect x="410" y="225" width="170" height="55" rx="6" fill="#243349" stroke="#10b981"/>
      <text x="495" y="248" text-anchor="middle" fill="#10b981" font-size="11" font-weight="600">Fast Snapshot Restore</text>
      <text x="495" y="266" text-anchor="middle" fill="#8b949e" font-size="10">no first-read latency</text>
      <rect x="595" y="225" width="65" height="55" rx="6" fill="#243349" stroke="#3d4d68"/>
      <text x="627" y="248" text-anchor="middle" fill="#e6edf3" font-size="11">Cross-</text>
      <text x="627" y="266" text-anchor="middle" fill="#e6edf3" font-size="11">Region copy</text>
    </svg>`,
    codeExample: {
      language: "bash",
      title: "Snapshot, archive, recycle-bin, and cross-Region copy",
      code: `# 1) Snapshot a volume
aws ec2 create-snapshot --volume-id vol-0abc \\
  --description "nightly db backup"

# 2) Archive an older snapshot (75% cheaper, slow restore)
aws ec2 modify-snapshot-tier --snapshot-id snap-0abc --storage-tier archive

# 3) Configure a Recycle Bin retention rule (30 days, all snapshots)
aws rbin create-rule --retention-period Period=30,Unit=DAYS \\
  --resource-type EBS_SNAPSHOT \\
  --description "rescue accidental snapshot deletes"

# 4) Copy a snapshot to another Region for DR
aws ec2 copy-snapshot --source-region us-east-1 \\
  --source-snapshot-id snap-0abc --destination-region eu-west-1

# 5) Enable Fast Snapshot Restore in a target AZ
aws ec2 enable-fast-snapshot-restores \\
  --availability-zones us-east-1a --source-snapshot-ids snap-0abc`,
    },
    problemStatement:
      "You are a solutions architect at a healthcare SaaS. Compliance requires that customer database backups are retained for 7 years, recoverable from accidental deletion for 30 days, and that DR can be performed in eu-west-1 within 1 hour of a us-east-1 outage. Outline how EBS snapshots, Snapshot Archive, Recycle Bin, cross-Region copy, and Fast Snapshot Restore combine into a complete backup + DR strategy.",
    questions: [
      {
        q: "An EBS snapshot is taken in us-east-1. From this snapshot, you can directly create a new EBS volume in which Region(s)?",
        options: [
          "A. Any Region",
          "B. Only us-east-1, until you copy the snapshot to a different Region",
          "C. Only the AZ where the original volume lives",
          "D. Only Regions that share a continent with the source",
        ],
        answer: "B",
        explanation:
          "B is correct: snapshots are Region-scoped. To create a volume in another Region you first copy the snapshot there. A is wrong: snapshots don't auto-replicate. C confuses AZ with Region — a single snapshot can restore into any AZ of the same Region. D is invented.",
      },
      {
        q: "Which feature lets you recover a snapshot you DELETED by mistake?",
        options: [
          "A. EBS Snapshot Archive",
          "B. AWS Backup Vault Lock",
          "C. EBS Recycle Bin with retention rules",
          "D. CloudWatch Logs Insights",
        ],
        answer: "C",
        explanation:
          "C is correct: Recycle Bin holds deleted snapshots for a configurable retention period (1 day to 1 year). A makes them cheaper to store, not undeletable. B locks vaults against future deletes but doesn't restore already-deleted snapshots. D is logs analytics.",
      },
      {
        q: "A team restores a 5 TB volume from a snapshot. The first reads from the new volume are slow until blocks are lazily loaded from S3. Which feature solves this?",
        options: [
          "A. EBS Snapshot Archive",
          "B. Fast Snapshot Restore (FSR)",
          "C. EBS Multi-Attach",
          "D. gp3 with extra IOPS",
        ],
        answer: "B",
        explanation:
          "B is correct: FSR pre-initializes the snapshot in a target AZ so the restored volume has full performance on the first read. A is the opposite (makes restore slower in exchange for cheap storage). C is for sharing a volume between instances. D speeds up I/O generally but doesn't fix lazy-load on a new volume.",
      },
    ],
  },

  {
    id: "ami-overview",
    title: "AMI — Amazon Machine Images",
    shortLabel: "AMI",
    section: "EC2 Instance Storage",
    domain: "Compute",
    explanation:
      "An **AMI (Amazon Machine Image)** is the blueprint EC2 uses to launch instances. It contains: an operating system, pre-installed software, optional configuration files, and a reference to one or more EBS snapshots that become the volumes of the launched instance. Three sources of AMIs: **(1) Public AMIs** — published by AWS (Amazon Linux 2023, Ubuntu, Windows Server) and trusted vendors; **(2) Your own AMIs** — create from any running instance via the 'Create Image' action (instance is briefly stopped for consistency); **(3) AWS Marketplace AMIs** — commercial software pre-baked (Bitnami stacks, security appliances, etc.), some sold per-hour with the vendor's license bundled. AMIs are **Region-scoped** — to use one in another Region you copy it (which also copies the underlying snapshots). Creating an AMI per release of your application gives you fast, deterministic launches (golden AMI pattern).",
    analogy:
      "An AMI is a Photoshop template. You design the perfect base — fonts loaded, brand colors set, layers organized — and save it. Every time you start a new project, you open the template and you're 80% done. Custom AMIs are your own templates; the AWS Marketplace is a template store where designers sell their work.",
    diagram: `<svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="AMI sources and instance launch flow">${svgDefs}
      <rect x="20" y="20" width="680" height="280" rx="10" fill="#1a2332" stroke="#2d3a4f"/>
      <text x="360" y="48" text-anchor="middle" fill="#ff9900" font-size="16" font-weight="700">AMI Sources → Launch EC2 → Snapshot for next AMI</text>
      <rect x="40" y="80" width="180" height="60" rx="6" fill="#243349" stroke="#3b82f6"/>
      <text x="130" y="105" text-anchor="middle" fill="#3b82f6" font-size="12" font-weight="600">Public AMI (AWS / vendor)</text>
      <text x="130" y="125" text-anchor="middle" fill="#8b949e" font-size="10">Amazon Linux, Ubuntu, Win</text>
      <rect x="40" y="155" width="180" height="60" rx="6" fill="#243349" stroke="#10b981"/>
      <text x="130" y="180" text-anchor="middle" fill="#10b981" font-size="12" font-weight="600">Your own AMI</text>
      <text x="130" y="200" text-anchor="middle" fill="#8b949e" font-size="10">customize, snapshot, register</text>
      <rect x="40" y="230" width="180" height="60" rx="6" fill="#243349" stroke="#f59e0b"/>
      <text x="130" y="255" text-anchor="middle" fill="#f59e0b" font-size="12" font-weight="600">Marketplace AMI</text>
      <text x="130" y="275" text-anchor="middle" fill="#8b949e" font-size="10">vendor software + license</text>
      <line x1="225" y1="115" x2="305" y2="180" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="225" y1="185" x2="305" y2="185" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="225" y1="260" x2="305" y2="190" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <rect x="310" y="155" width="180" height="60" rx="6" fill="#243349" stroke="#ff9900"/>
      <text x="400" y="180" text-anchor="middle" fill="#ff9900" font-size="12" font-weight="600">Launch EC2 Instance</text>
      <text x="400" y="200" text-anchor="middle" fill="#8b949e" font-size="10">faster boot · pre-installed apps</text>
      <line x1="495" y1="185" x2="555" y2="185" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <rect x="560" y="155" width="120" height="60" rx="6" fill="#243349" stroke="#10b981"/>
      <text x="620" y="180" text-anchor="middle" fill="#10b981" font-size="12" font-weight="600">Create AMI</text>
      <text x="620" y="200" text-anchor="middle" fill="#8b949e" font-size="10">golden image v2</text>
    </svg>`,
    codeExample: {
      language: "bash",
      title: "Create a custom AMI, copy across Regions, share with another account",
      code: `# 1) Stop the instance for consistency (optional but safer)
aws ec2 stop-instances --instance-ids i-0abc

# 2) Create the AMI (returns ImageId)
aws ec2 create-image --instance-id i-0abc \\
  --name "app-v1.4-2025-01-15" \\
  --description "App v1.4 baked image" \\
  --no-reboot   # only if you accept a slightly-less-consistent snapshot

# 3) Copy to another Region for DR
aws ec2 copy-image --source-region us-east-1 \\
  --source-image-id ami-0abc \\
  --region eu-west-1 \\
  --name "app-v1.4-eu"

# 4) Share with another AWS account (read-only launch permission)
aws ec2 modify-image-attribute --image-id ami-0abc \\
  --launch-permission "Add=[{UserId=222233334444}]"`,
    },
    problemStatement:
      "You are a solutions architect at a CI/CD-driven SaaS. Each release should produce a deterministic, fully-baked AMI in 3 Regions (us-east-1, eu-west-1, ap-southeast-2) so that scaling groups can launch new instances in under 60 seconds. Outline a 'golden AMI' build pipeline: how you'd snapshot a freshly-configured instance, copy the AMI across Regions, version-tag it, and clean up old AMIs after N releases.",
    questions: [
      {
        q: "An AMI is created in us-east-1. To launch instances from the SAME AMI in eu-west-1, what must you do FIRST?",
        options: [
          "A. Nothing — AMIs are global.",
          "B. Copy the AMI to eu-west-1 (which also copies its underlying snapshots).",
          "C. Recreate the AMI from scratch in eu-west-1.",
          "D. Convert the AMI to a Marketplace AMI.",
        ],
        answer: "B",
        explanation:
          "B is correct: AMIs are Region-scoped; `copy-image` replicates them along with the EBS snapshots they reference. A is wrong (not global). C wastes effort. D is unrelated.",
      },
      {
        q: "Which is a benefit of a 'golden AMI' pattern over installing software at boot via User Data?",
        options: [
          "A. Cheaper EBS billing.",
          "B. Faster, more deterministic instance launch — software already on disk.",
          "C. Eliminates the need for IAM roles.",
          "D. Works only with Windows AMIs.",
        ],
        answer: "B",
        explanation:
          "B is correct: a baked AMI launches in seconds with no per-instance install step, which also removes a class of network/transient install failures. A is unrelated. C is wrong (IAM roles still needed). D is wrong (golden AMIs work with any OS).",
      },
      {
        q: "Which of the following AMI sources MIGHT include a per-hour software licensing fee added to the EC2 hourly rate?",
        options: [
          "A. AWS-published Amazon Linux 2023 AMI",
          "B. An AMI you created from your own instance",
          "C. An AWS Marketplace AMI (e.g., a commercial firewall appliance)",
          "D. A public Ubuntu AMI from Canonical",
        ],
        answer: "C",
        explanation:
          "C is correct: Marketplace AMIs can bundle vendor licensing into the per-hour cost. A is free (just OS). B carries no extra charge beyond standard EC2/EBS. D is also free (Canonical's public AMIs).",
      },
    ],
  },

  {
    id: "ec2-instance-store",
    title: "EC2 Instance Store — Local Ephemeral Disk",
    shortLabel: "Instance Store",
    section: "EC2 Instance Storage",
    domain: "Storage",
    explanation:
      "**EC2 Instance Store** volumes are physical disks (typically NVMe SSDs) attached directly to the underlying host hardware — not a network drive like EBS. They deliver the highest possible local IOPS and throughput (millions of IOPS on i3en.metal). The catch: data is **ephemeral** — if you stop the instance, the underlying host changes, the host fails, or the instance is terminated, all data on instance store is gone. Reboots are safe (same host). Instance Store is included in the price of certain instance families (i, d, h, some m/c/r generations) — you don't provision it separately. Use it for caches, buffers, scratch space, shuffle data in distributed jobs, or for self-replicating databases (Cassandra, MongoDB) where your application handles durability across multiple nodes.",
    analogy:
      "Instance Store is like the SSD bolted into a laptop chassis — blazing fast and cheap, but the moment you switch laptops (because the old one died), everything on that SSD is gone. EBS is the cloud-backed USB external drive you can unplug from the dead laptop and plug into the new one with all the data intact.",
    diagram: `<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="EC2 instance store vs EBS">${svgDefs}
      <rect x="20" y="20" width="680" height="260" rx="10" fill="#1a2332" stroke="#2d3a4f"/>
      <text x="360" y="48" text-anchor="middle" fill="#ff9900" font-size="16" font-weight="700">EC2 Instance Store vs EBS</text>
      <rect x="40" y="80" width="300" height="180" rx="8" fill="#243349" stroke="#ff9900"/>
      <text x="190" y="105" text-anchor="middle" fill="#ff9900" font-size="13" font-weight="600">EC2 Instance Store</text>
      <text x="190" y="130" text-anchor="middle" fill="#e6edf3" font-size="11">local NVMe on the host</text>
      <text x="190" y="150" text-anchor="middle" fill="#10b981" font-size="11">▲ millions of IOPS</text>
      <text x="190" y="170" text-anchor="middle" fill="#10b981" font-size="11">▲ included in instance price</text>
      <text x="190" y="190" text-anchor="middle" fill="#ef4444" font-size="11">▼ EPHEMERAL — gone on stop / fail</text>
      <text x="190" y="210" text-anchor="middle" fill="#8b949e" font-size="10">Use: scratch, cache, replicated DBs</text>
      <text x="190" y="232" text-anchor="middle" fill="#8b949e" font-size="10">Survives: reboot only</text>
      <rect x="380" y="80" width="300" height="180" rx="8" fill="#243349" stroke="#3b82f6"/>
      <text x="530" y="105" text-anchor="middle" fill="#3b82f6" font-size="13" font-weight="600">Amazon EBS</text>
      <text x="530" y="130" text-anchor="middle" fill="#e6edf3" font-size="11">network-attached block store</text>
      <text x="530" y="150" text-anchor="middle" fill="#10b981" font-size="11">▲ persistent across stop/start</text>
      <text x="530" y="170" text-anchor="middle" fill="#10b981" font-size="11">▲ snapshots to S3</text>
      <text x="530" y="190" text-anchor="middle" fill="#ef4444" font-size="11">▼ lower max local IOPS than store</text>
      <text x="530" y="210" text-anchor="middle" fill="#8b949e" font-size="10">Use: stateful apps, DBs, OS root</text>
      <text x="530" y="232" text-anchor="middle" fill="#8b949e" font-size="10">Survives: stop, terminate (if flagged)</text>
    </svg>`,
    codeExample: {
      language: "bash",
      title: "Launch an i3en instance and inspect its instance store volumes",
      code: `# Launch a storage-optimized instance (auto-includes 2x NVMe local SSDs)
aws ec2 run-instances --image-id ami-0abc --instance-type i3en.large

# After SSH, list NVMe drives (instance-store appears as /dev/nvme1n1, etc.)
lsblk
# nvme0n1   259:0    0    8G  0 disk            ← EBS root
# nvme1n1   259:1    0  1.7T  0 disk            ← INSTANCE STORE (ephemeral)

# Format and mount the instance-store drive as scratch space
sudo mkfs -t xfs /dev/nvme1n1
sudo mkdir /scratch
sudo mount /dev/nvme1n1 /scratch
# (re-do after every stop/start — data is gone)`,
    },
    problemStatement:
      "You are a solutions architect at a search-engine company. The query layer keeps a 600 GB sharded index in memory + on local SSD, and each query node can rebuild its shard from S3 in 10 minutes if needed. Recommend whether to put the on-disk shard on EBS or Instance Store — discuss the IOPS, cost, and durability trade-offs, and explain how the application-level replication makes Instance Store acceptable.",
    questions: [
      {
        q: "Which event will RESULT in data loss on an EC2 Instance Store volume?",
        options: [
          "A. The OS reboots.",
          "B. The instance is stopped and started.",
          "C. A heavy disk-I/O workload.",
          "D. Creating an EBS snapshot.",
        ],
        answer: "B",
        explanation:
          "B is correct: stop-then-start moves the instance to a new host and all instance-store data is gone. A (reboot) preserves data because the host doesn't change. C is unrelated. D doesn't affect Instance Store at all (snapshots are for EBS only).",
      },
      {
        q: "Which workload is the BEST fit for EC2 Instance Store?",
        options: [
          "A. A primary production PostgreSQL database with no replicas.",
          "B. A scratch/shuffle directory for a Spark cluster that re-reads source data from S3 on failure.",
          "C. The root OS volume of a critical web server.",
          "D. Storing customer documents subject to a 7-year retention policy.",
        ],
        answer: "B",
        explanation:
          "B is correct: Spark's scratch/shuffle data is inherently restartable from S3 — fast local NVMe maximizes throughput while ephemerality is OK. A is the WORST fit (no replicas + ephemeral disk = data loss). C is also bad: root volumes need EBS. D demands long-term durability that Instance Store can't provide.",
      },
      {
        q: "Compared to EBS, EC2 Instance Store typically offers…",
        options: [
          "A. Lower IOPS but higher durability.",
          "B. Higher local IOPS and throughput, but no durability across stop/terminate.",
          "C. Identical performance characteristics.",
          "D. Cross-Region replication for free.",
        ],
        answer: "B",
        explanation:
          "B is correct: Instance Store wins on raw IOPS and bandwidth (because it's local NVMe), and loses on durability (no persistence across stop/terminate). A inverts the relationship. C is wrong. D is invented.",
      },
    ],
  },

  {
    id: "ebs-volume-types",
    title: "EBS Volume Types (gp2/gp3, io1/io2, st1, sc1)",
    shortLabel: "EBS Volume Types",
    section: "EC2 Instance Storage",
    domain: "Storage",
    explanation:
      "Six EBS volume types cover the whole performance/cost spectrum. **SSD-backed**: **gp2** (general purpose, IOPS coupled to size: 3 IOPS/GiB, burst to 3,000), **gp3** (general purpose, IOPS and throughput tunable independently of size, default 3,000 IOPS + 125 MiB/s, up to 16,000 IOPS + 1,000 MiB/s; cheaper than gp2 — current default), **io1** (provisioned IOPS up to 64,000, for high-perf DBs), **io2 / io2 Block Express** (the newest; sub-millisecond latency, up to 256,000 IOPS, supports Multi-Attach). **HDD-backed**: **st1** (throughput-optimized, big sequential workloads like data warehouses, 500 MiB/s max), **sc1** (cold HDD, infrequently accessed archives, cheapest). **Only gp2/gp3 and io1/io2 can be boot volumes** — HDD types cannot. Default for new workloads: **gp3**.",
    analogy:
      "Pick an EBS volume type the way you pick a vehicle: gp3 is a hybrid sedan (good for 80% of trips), io2 Block Express is a track-day sportscar (insanely fast and pricey), st1 is a moving truck (slow but hauls huge bulk efficiently), sc1 is a long-term storage container (cheap, almost never opened).",
    diagram: `<svg viewBox="0 0 720 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="EBS volume types comparison">${svgDefs}
      <rect x="20" y="20" width="680" height="300" rx="10" fill="#1a2332" stroke="#2d3a4f"/>
      <text x="360" y="48" text-anchor="middle" fill="#ff9900" font-size="16" font-weight="700">EBS Volume Types</text>
      <g font-size="11">
        <rect x="40" y="80" width="200" height="100" rx="6" fill="#243349" stroke="#10b981"/>
        <text x="55" y="103" fill="#10b981" font-weight="700">gp3 (SSD, default)</text>
        <text x="55" y="123" fill="#e6edf3">3,000–16,000 IOPS</text>
        <text x="55" y="141" fill="#e6edf3">125–1,000 MiB/s</text>
        <text x="55" y="161" fill="#8b949e">tune IOPS + throughput independently</text>
        <text x="55" y="176" fill="#8b949e">boot · general purpose</text>
        <rect x="260" y="80" width="200" height="100" rx="6" fill="#243349" stroke="#3b82f6"/>
        <text x="275" y="103" fill="#3b82f6" font-weight="700">gp2 (SSD, legacy)</text>
        <text x="275" y="123" fill="#e6edf3">3 IOPS/GiB up to 16,000</text>
        <text x="275" y="141" fill="#e6edf3">burst to 3,000</text>
        <text x="275" y="161" fill="#8b949e">IOPS tied to volume size</text>
        <text x="275" y="176" fill="#8b949e">boot · general purpose</text>
        <rect x="480" y="80" width="200" height="100" rx="6" fill="#243349" stroke="#ff9900"/>
        <text x="495" y="103" fill="#ff9900" font-weight="700">io1 / io2 Block Express</text>
        <text x="495" y="123" fill="#e6edf3">up to 256,000 IOPS</text>
        <text x="495" y="141" fill="#e6edf3">sub-ms latency</text>
        <text x="495" y="161" fill="#8b949e">Multi-Attach supported</text>
        <text x="495" y="176" fill="#8b949e">boot · critical DBs</text>
        <rect x="40" y="195" width="320" height="100" rx="6" fill="#243349" stroke="#f59e0b"/>
        <text x="55" y="218" fill="#f59e0b" font-weight="700">st1 (HDD, throughput-optimized)</text>
        <text x="55" y="238" fill="#e6edf3">500 MiB/s · 500 IOPS</text>
        <text x="55" y="258" fill="#8b949e">big sequential reads — Hadoop, data warehouse</text>
        <text x="55" y="278" fill="#ef4444">cannot be a boot volume</text>
        <rect x="380" y="195" width="300" height="100" rx="6" fill="#243349" stroke="#3d4d68"/>
        <text x="395" y="218" fill="#b0bac6" font-weight="700">sc1 (Cold HDD)</text>
        <text x="395" y="238" fill="#e6edf3">250 MiB/s · 250 IOPS</text>
        <text x="395" y="258" fill="#8b949e">cheapest; rarely-accessed archives</text>
        <text x="395" y="278" fill="#ef4444">cannot be a boot volume</text>
      </g>
    </svg>`,
    codeExample: {
      language: "bash",
      title: "Choose the right type for the workload",
      code: `# General-purpose boot + app data (the modern default)
aws ec2 create-volume --availability-zone us-east-1a \\
  --size 100 --volume-type gp3 --iops 3000 --throughput 125

# Mission-critical Postgres (high sustained IOPS, sub-ms latency)
aws ec2 create-volume --availability-zone us-east-1a \\
  --size 500 --volume-type io2 --iops 50000

# Hadoop scratch (big sequential, throughput-optimized HDD)
aws ec2 create-volume --availability-zone us-east-1a \\
  --size 2000 --volume-type st1

# Cold archive (cheap, rarely read)
aws ec2 create-volume --availability-zone us-east-1a \\
  --size 4000 --volume-type sc1`,
    },
    problemStatement:
      "You are a solutions architect at a media-streaming company. Three workloads: (1) a Postgres OLTP database needing 60,000 sustained IOPS, (2) a Hadoop cluster doing 1 TB nightly sequential reads, (3) a 30 TB long-term log archive accessed about once a quarter. Pick the BEST EBS volume type for each and quantify the cost vs performance trade-off.",
    questions: [
      {
        q: "Which EBS volume type CANNOT be used as an instance's boot volume?",
        options: ["A. gp2", "B. gp3", "C. io2 Block Express", "D. st1"],
        answer: "D",
        explanation:
          "D is correct: HDD-backed types (st1 and sc1) cannot serve as boot volumes. A, B, and C are all SSD-backed and can be boot volumes.",
      },
      {
        q: "Which EBS volume type lets you tune IOPS and throughput INDEPENDENTLY of the volume's size?",
        options: ["A. gp2", "B. gp3", "C. st1", "D. sc1"],
        answer: "B",
        explanation:
          "B is correct: gp3 introduced decoupled IOPS, throughput, and size. A (gp2) ties IOPS to size at 3 IOPS/GiB. C and D are HDDs with fixed performance profiles.",
      },
      {
        q: "A Postgres database needs sustained 80,000 IOPS with sub-millisecond latency. Which EBS volume type is the BEST fit?",
        options: ["A. gp3", "B. io2 Block Express", "C. st1", "D. sc1"],
        answer: "B",
        explanation:
          "B is correct: io2 Block Express delivers sub-ms latency and up to 256,000 IOPS — the only type that meets both requirements. A (gp3) caps at 16,000 IOPS. C and D are HDDs and far too slow.",
      },
    ],
  },

  {
    id: "ebs-multi-attach",
    title: "EBS Multi-Attach (io1 / io2)",
    shortLabel: "EBS Multi-Attach",
    section: "EC2 Instance Storage",
    domain: "Storage",
    explanation:
      "Normally an EBS volume can be attached to only one instance at a time. **EBS Multi-Attach** is a special mode (available only on **io1 and io2** Provisioned IOPS volumes) that lets a single volume be attached to up to **16 Nitro-based EC2 instances simultaneously** in the same AZ. Each instance gets full read/write access. Because both instances can write to the same blocks, you need a **cluster-aware filesystem** (e.g. GFS2, OCFS2, Veritas) — NOT XFS or EXT4, which assume single-writer and will corrupt the volume. Use cases: high-availability clustered Linux applications like Teradata, Microsoft SQL Server Failover Clusters running through 3rd-party clustering, or shared-nothing log-shipped databases. Multi-Attach is NOT a shared filesystem like EFS — it's a shared raw block device that your software must coordinate.",
    analogy:
      "EBS Multi-Attach is a shared whiteboard with 16 markers. Anyone can write anywhere — useful, but unless everyone agrees on a protocol (who writes in which corner), it becomes an unreadable mess. The cluster-aware filesystem is that agreed protocol. EFS, by contrast, is like Google Docs — multiple people edit and the service merges changes safely.",
    diagram: `<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="EBS multi-attach with cluster-aware filesystem">${svgDefs}
      <rect x="20" y="20" width="680" height="260" rx="10" fill="#1a2332" stroke="#2d3a4f"/>
      <text x="360" y="48" text-anchor="middle" fill="#ff9900" font-size="16" font-weight="700">EBS Multi-Attach (io1/io2 only)</text>
      <rect x="60" y="90" width="120" height="60" rx="6" fill="#243349" stroke="#3b82f6"/>
      <text x="120" y="115" text-anchor="middle" fill="#3b82f6" font-size="12" font-weight="600">EC2 #1</text>
      <text x="120" y="135" text-anchor="middle" fill="#8b949e" font-size="10">cluster-aware FS</text>
      <rect x="60" y="170" width="120" height="60" rx="6" fill="#243349" stroke="#3b82f6"/>
      <text x="120" y="195" text-anchor="middle" fill="#3b82f6" font-size="12" font-weight="600">EC2 #2</text>
      <text x="120" y="215" text-anchor="middle" fill="#8b949e" font-size="10">cluster-aware FS</text>
      <line x1="185" y1="120" x2="345" y2="155" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="185" y1="200" x2="345" y2="170" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="260" y="105" text-anchor="middle" fill="#ff9900" font-size="10">R/W</text>
      <text x="260" y="220" text-anchor="middle" fill="#ff9900" font-size="10">R/W</text>
      <rect x="350" y="135" width="200" height="60" rx="6" fill="#243349" stroke="#10b981"/>
      <text x="450" y="160" text-anchor="middle" fill="#10b981" font-size="12" font-weight="600">io2 Block Express</text>
      <text x="450" y="180" text-anchor="middle" fill="#8b949e" font-size="10">single volume, single AZ</text>
      <rect x="560" y="100" width="120" height="120" rx="6" fill="#243349" stroke="#ef4444"/>
      <text x="620" y="125" text-anchor="middle" fill="#ef4444" font-size="12" font-weight="600">Constraints</text>
      <text x="620" y="148" text-anchor="middle" fill="#e6edf3" font-size="10">max 16 EC2 (Nitro)</text>
      <text x="620" y="168" text-anchor="middle" fill="#e6edf3" font-size="10">same AZ only</text>
      <text x="620" y="188" text-anchor="middle" fill="#e6edf3" font-size="10">cluster-aware FS</text>
      <text x="620" y="208" text-anchor="middle" fill="#e6edf3" font-size="10">io1/io2 only</text>
      <text x="360" y="265" text-anchor="middle" fill="#b0bac6" font-size="11">NOT EFS — this is shared block, not a shared filesystem. App must coordinate writes.</text>
    </svg>`,
    codeExample: {
      language: "bash",
      title: "Create a Multi-Attach io2 volume and attach to multiple instances",
      code: `# Create the volume with Multi-Attach enabled (io1/io2 only)
aws ec2 create-volume --availability-zone us-east-1a \\
  --size 100 --volume-type io2 --iops 10000 \\
  --multi-attach-enabled

# Attach to two instances in the SAME AZ (max 16 supported)
aws ec2 attach-volume --volume-id vol-0abc --device /dev/sdf \\
  --instance-id i-AAAA
aws ec2 attach-volume --volume-id vol-0abc --device /dev/sdf \\
  --instance-id i-BBBB

# Inside the instances, install a cluster-aware filesystem (GFS2 / OCFS2)
# DO NOT use XFS or EXT4 — they will corrupt the shared volume.`,
    },
    problemStatement:
      "You are a solutions architect for a legacy ISV migrating a Linux clustered database to AWS. The cluster software requires a shared block device with concurrent multi-host writes inside the same AZ. Compare EBS Multi-Attach versus EFS for this requirement; recommend Multi-Attach, and explain why XFS would corrupt the shared volume.",
    questions: [
      {
        q: "Which EBS volume types support Multi-Attach?",
        options: ["A. gp2 and gp3", "B. io1 and io2", "C. st1 and sc1", "D. All EBS types"],
        answer: "B",
        explanation:
          "B is correct: only the Provisioned IOPS families (io1, io2 — including io2 Block Express) support Multi-Attach. A, C, D are wrong.",
      },
      {
        q: "A team enables EBS Multi-Attach on an io2 volume and attaches it to 4 Linux instances formatted with XFS. What is the LIKELY outcome?",
        options: [
          "A. Performance triples because of parallel writes.",
          "B. The volume's filesystem will corrupt because XFS assumes a single writer.",
          "C. AWS automatically promotes the cluster filesystem.",
          "D. Writes are silently serialized by AWS.",
        ],
        answer: "B",
        explanation:
          "B is correct: XFS (and EXT4) are not cluster-aware; concurrent multi-host writes corrupt the on-disk structures. A is fantasy. C is wrong (AWS does NOT promote anything). D is wrong (AWS doesn't serialize block writes).",
      },
      {
        q: "What is the maximum number of EC2 instances that can simultaneously attach to a single io2 Multi-Attach volume?",
        options: ["A. 1", "B. 4", "C. 16", "D. unlimited"],
        answer: "C",
        explanation:
          "C is correct: Multi-Attach supports up to 16 Nitro-based EC2 instances in the same AZ. A is the default (no Multi-Attach). B and D are wrong.",
      },
    ],
  },

  {
    id: "ebs-encryption",
    title: "EBS Encryption (KMS, At-Rest & In-Flight)",
    shortLabel: "EBS Encryption",
    section: "EC2 Instance Storage",
    domain: "Security",
    explanation:
      "EBS encryption uses **AWS Key Management Service (KMS)** with AES-256 to encrypt: (a) **data at rest** on the volume, (b) **all I/O between the volume and the EC2 instance**, (c) all **snapshots** created from an encrypted volume, and (d) any **volumes restored** from those snapshots. Encryption is transparent — your application sees plain files; KMS encrypts/decrypts blocks below the filesystem. Latency impact is minimal because the encryption runs on dedicated hardware. **Patterns to know**: (1) Snapshots of unencrypted volumes can be encrypted during the `copy-snapshot` step — that's how you migrate legacy volumes to encrypted. (2) Account-level 'EBS encryption by default' setting forces every new volume in the Region to be encrypted with your chosen KMS key. (3) Sharing an encrypted snapshot to another account requires sharing the KMS key too.",
    analogy:
      "EBS encryption is like the dishwasher's built-in dryer — you don't think about it, but every dish (block) comes out sanitized. AWS holds the key (KMS), the dishes (your data) get hot-cycled on the way in and on the way out, and the only people who can ever see them dry are those you explicitly hand the key to.",
    diagram: `<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="EBS encryption flow with KMS">${svgDefs}
      <rect x="20" y="20" width="680" height="260" rx="10" fill="#1a2332" stroke="#2d3a4f"/>
      <text x="360" y="48" text-anchor="middle" fill="#ff9900" font-size="16" font-weight="700">EBS Encryption — at rest + in flight, via KMS</text>
      <rect x="50" y="100" width="160" height="80" rx="6" fill="#243349" stroke="#3b82f6"/>
      <text x="130" y="125" text-anchor="middle" fill="#3b82f6" font-size="12" font-weight="600">EC2 Instance</text>
      <text x="130" y="150" text-anchor="middle" fill="#e6edf3" font-size="11">app sees plain files</text>
      <text x="130" y="168" text-anchor="middle" fill="#8b949e" font-size="10">transparent crypto</text>
      <line x1="215" y1="140" x2="295" y2="140" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="255" y="125" text-anchor="middle" fill="#ff9900" font-size="10">AES-256 in flight</text>
      <rect x="300" y="100" width="160" height="80" rx="6" fill="#243349" stroke="#10b981"/>
      <text x="380" y="125" text-anchor="middle" fill="#10b981" font-size="12" font-weight="600">EBS volume</text>
      <text x="380" y="150" text-anchor="middle" fill="#e6edf3" font-size="11">ciphertext on disk</text>
      <text x="380" y="168" text-anchor="middle" fill="#8b949e" font-size="10">snapshots inherit</text>
      <line x1="465" y1="140" x2="535" y2="140" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <rect x="540" y="100" width="140" height="80" rx="6" fill="#243349" stroke="#ff9900"/>
      <text x="610" y="125" text-anchor="middle" fill="#ff9900" font-size="12" font-weight="600">AWS KMS</text>
      <text x="610" y="150" text-anchor="middle" fill="#e6edf3" font-size="11">CMK / managed key</text>
      <text x="610" y="168" text-anchor="middle" fill="#8b949e" font-size="10">CloudTrail-audited</text>
      <text x="360" y="230" text-anchor="middle" fill="#b0bac6" font-size="11">To encrypt an existing volume: snapshot → copy-snapshot with --encrypted → restore.</text>
      <text x="360" y="252" text-anchor="middle" fill="#8b949e" font-size="11">Enable account-wide 'EBS encryption by default' to force every new volume to be encrypted.</text>
    </svg>`,
    codeExample: {
      language: "bash",
      title: "Enable encryption-by-default, then encrypt a legacy volume",
      code: `# Enforce encryption for every NEW EBS volume in this Region
aws ec2 enable-ebs-encryption-by-default
aws ec2 modify-ebs-default-kms-key-id --kms-key-id alias/my-ebs-cmk

# Encrypt an existing unencrypted volume:
# 1) Snapshot the unencrypted volume
aws ec2 create-snapshot --volume-id vol-PLAIN --description "pre-encrypt"
# 2) COPY the snapshot, asking for encryption with your CMK
aws ec2 copy-snapshot --source-region us-east-1 \\
  --source-snapshot-id snap-ABC \\
  --destination-region us-east-1 \\
  --encrypted --kms-key-id alias/my-ebs-cmk
# 3) Create the encrypted volume from the encrypted snapshot
aws ec2 create-volume --snapshot-id snap-ENC \\
  --availability-zone us-east-1a --volume-type gp3`,
    },
    problemStatement:
      "You are a solutions architect at a healthcare company under HIPAA. Auditors require that every EBS volume in every Region is encrypted with a customer-managed KMS key, with quarterly key rotation, and that no unencrypted volume can ever be created — even by a developer using the console. Outline the AWS settings, SCP guardrails, and rotation plan you'd put in place.",
    questions: [
      {
        q: "Which AWS service supplies the encryption keys used by EBS?",
        options: ["A. AWS Secrets Manager", "B. AWS KMS", "C. AWS Certificate Manager", "D. CloudHSM only"],
        answer: "B",
        explanation:
          "B is correct: EBS encryption keys come from KMS (with the option of CloudHSM-backed keys behind KMS). A stores secrets (passwords, API keys), not encryption keys. C is for TLS certs. D is the underlying HSM but is accessed via KMS for EBS.",
      },
      {
        q: "An unencrypted EBS volume needs to be converted to an encrypted one. What is the standard procedure?",
        options: [
          "A. Run `aws ec2 modify-volume --encrypted true` on the running volume.",
          "B. Snapshot the volume, copy the snapshot with --encrypted, then create a new volume from the encrypted snapshot.",
          "C. Reboot the instance and EBS will auto-encrypt.",
          "D. Move the volume to another Region — encryption happens automatically on cross-Region copy.",
        ],
        answer: "B",
        explanation:
          "B is correct: that 3-step snapshot → encrypted copy → restore is the canonical migration path. A is wrong: modify-volume can't toggle encryption in place. C is invented. D is misleading — cross-Region copy doesn't auto-encrypt unless you ask.",
      },
      {
        q: "Which statement about snapshots of an encrypted EBS volume is TRUE?",
        options: [
          "A. The snapshot is unencrypted by default; you must encrypt it during create.",
          "B. The snapshot inherits encryption automatically — and any volume restored from it is also encrypted.",
          "C. Snapshots cannot be created from encrypted volumes.",
          "D. The snapshot uses a different KMS key than the source volume.",
        ],
        answer: "B",
        explanation:
          "B is correct: encryption propagates through the snapshot chain transparently. A inverts the rule. C is wrong: snapshots of encrypted volumes are fully supported. D is wrong: by default they use the same key.",
      },
    ],
  },

  {
    id: "amazon-efs",
    title: "Amazon EFS — Managed NFS",
    shortLabel: "Amazon EFS",
    section: "EC2 Instance Storage",
    domain: "Storage",
    explanation:
      "**Amazon EFS (Elastic File System)** is a fully-managed, POSIX-compliant **shared file system** that you can mount from many EC2 instances **across multiple AZs simultaneously** via the NFSv4.1 protocol. Unlike EBS (single-instance, single-AZ block storage), EFS is multi-AZ, multi-attach, elastic in capacity (no provisioning — you pay for what you use), and Linux-only. Access is controlled by **security groups** on the mount targets (one per AZ) and optionally by IAM and POSIX permissions. EFS encrypts at rest (KMS) and in flight (TLS). Use it for **content management, web serving (WordPress, Drupal), shared home directories, dev/test workloads, container persistent volumes, and lift-and-shift NFS apps**. Roughly 3× the cost of gp2 EBS by default, but lifecycle policies can drop infrequently accessed data into a much cheaper IA / Archive tier.",
    analogy:
      "If EBS is a USB drive plugged into one laptop at a time, EFS is the company-shared Dropbox folder — anyone in the office (any EC2 instance in any AZ) can read and write the same files at the same time, and the storage grows automatically. No drives to provision, no shuffling cables.",
    diagram: `<svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="EFS mounted from multiple AZs">${svgDefs}
      <rect x="20" y="20" width="680" height="280" rx="10" fill="#1a2332" stroke="#2d3a4f"/>
      <text x="360" y="48" text-anchor="middle" fill="#ff9900" font-size="16" font-weight="700">Amazon EFS — shared NFS across AZs</text>
      <rect x="60" y="85" width="160" height="60" rx="6" fill="#243349" stroke="#3b82f6"/>
      <text x="140" y="108" text-anchor="middle" fill="#3b82f6" font-size="12" font-weight="600">EC2 in us-east-1a</text>
      <text x="140" y="128" text-anchor="middle" fill="#8b949e" font-size="10">Linux · NFS v4.1 client</text>
      <rect x="280" y="85" width="160" height="60" rx="6" fill="#243349" stroke="#3b82f6"/>
      <text x="360" y="108" text-anchor="middle" fill="#3b82f6" font-size="12" font-weight="600">EC2 in us-east-1b</text>
      <text x="360" y="128" text-anchor="middle" fill="#8b949e" font-size="10">same mount, same files</text>
      <rect x="500" y="85" width="160" height="60" rx="6" fill="#243349" stroke="#3b82f6"/>
      <text x="580" y="108" text-anchor="middle" fill="#3b82f6" font-size="12" font-weight="600">EC2 in us-east-1c</text>
      <text x="580" y="128" text-anchor="middle" fill="#8b949e" font-size="10">across 3 AZs</text>
      <line x1="140" y1="150" x2="300" y2="200" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="360" y1="150" x2="360" y2="200" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="580" y1="150" x2="420" y2="200" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <rect x="240" y="205" width="240" height="65" rx="8" fill="#243349" stroke="#10b981"/>
      <text x="360" y="230" text-anchor="middle" fill="#10b981" font-size="13" font-weight="700">Elastic File System</text>
      <text x="360" y="252" text-anchor="middle" fill="#8b949e" font-size="11">POSIX · auto-scales · multi-AZ HA</text>
      <text x="360" y="290" text-anchor="middle" fill="#b0bac6" font-size="11">Linux only · SG-controlled · ~3× gp2 price (mitigated by IA/Archive tiers)</text>
    </svg>`,
    codeExample: {
      language: "bash",
      title: "Create an EFS file system and mount on Amazon Linux",
      code: `# 1) Create the filesystem and mount targets in each AZ
aws efs create-file-system --creation-token web-content \\
  --encrypted --kms-key-id alias/aws/elasticfilesystem
# returns: fs-0abc

aws efs create-mount-target --file-system-id fs-0abc \\
  --subnet-id subnet-1a --security-groups sg-efs
aws efs create-mount-target --file-system-id fs-0abc \\
  --subnet-id subnet-1b --security-groups sg-efs

# 2) Install the helper and mount from any EC2 in any AZ
sudo yum install -y amazon-efs-utils
sudo mkdir /shared
sudo mount -t efs -o tls fs-0abc:/ /shared

# 3) Persist mount in /etc/fstab
echo "fs-0abc.efs.us-east-1.amazonaws.com:/ /shared efs _netdev,tls 0 0" \\
  | sudo tee -a /etc/fstab`,
    },
    problemStatement:
      "You are a solutions architect at a publisher running WordPress. The site is currently a single EC2 instance with media uploads on local disk — it can't scale horizontally because each new instance would see different content. Recommend a multi-AZ EFS-backed design: which directory you'd move to EFS, how mount targets and security groups are configured, and what the cost trade-off versus a single EBS volume looks like.",
    questions: [
      {
        q: "Which BEST describes the difference between EBS and EFS?",
        options: [
          "A. EBS is a managed object store, EFS is block storage.",
          "B. EBS is single-AZ block storage attached to one instance; EFS is multi-AZ NFS file storage shared by many instances.",
          "C. EBS works only on Windows; EFS works only on Linux.",
          "D. EBS is more expensive than EFS for all workloads.",
        ],
        answer: "B",
        explanation:
          "B is correct: EBS = AZ-locked single-attach block storage; EFS = multi-AZ NFS file storage shared across many instances. A inverts S3 and EBS. C is wrong (EBS supports both OSes). D is wrong (EFS is typically ~3× the price of gp2 EBS).",
      },
      {
        q: "What protocol does Amazon EFS use to expose its file system to EC2 clients?",
        options: ["A. SMB / CIFS", "B. iSCSI", "C. NFS v4.1", "D. FUSE"],
        answer: "C",
        explanation:
          "C is correct: EFS speaks NFS v4.1. A (SMB/CIFS) is Windows-style file sharing — that's what Amazon FSx for Windows File Server uses. B is for block storage. D is a user-space mount mechanism unrelated to EFS.",
      },
      {
        q: "Which operating system is supported as an EFS client?",
        options: ["A. Windows only", "B. Linux only (POSIX)", "C. macOS only", "D. Any OS with iSCSI"],
        answer: "B",
        explanation:
          "B is correct: EFS is Linux-only — it's a POSIX file system using NFS v4.1. A is wrong; for Windows file shares you use FSx for Windows. C is wrong. D conflates the wrong protocol.",
      },
    ],
  },

  {
    id: "efs-performance-storage-classes",
    title: "EFS Performance Modes & Storage Classes",
    shortLabel: "EFS Performance",
    section: "EC2 Instance Storage",
    domain: "Storage",
    explanation:
      "EFS exposes two **Performance Modes** (set at creation, can't change later): **General Purpose** (default — lowest per-op latency, best for web servers, CMS, dev workloads) and **Max I/O** (higher latency per op, but virtually unlimited aggregate throughput — best for media processing, big-data, highly-parallel HPC). It also has four **Throughput Modes**: **Bursting** (scales with size: ~50 MiB/s per TB stored, with credits for short bursts), **Provisioned** (set throughput independent of size — for small filesystems that need high throughput), **Elastic** (recommended modern default — automatically scales throughput up to ~3 GiB/s read, ~1 GiB/s write, billed per IO), and the older Bursting/Provisioned options. Independently, **Storage Classes** are: **Standard** (multi-AZ, hot), **Standard-IA** (multi-AZ, infrequent — cheaper but small per-read fee), **One Zone** (single-AZ, cheaper, fine for dev/backup), **One Zone-IA**, and **Archive** (rarely accessed, deepest savings). A **lifecycle policy** automatically moves files between tiers after N days of no access.",
    analogy:
      "EFS performance modes are like choosing between a sports car (General Purpose: fast off the line, smaller capacity) and a freight train (Max I/O: slower acceleration but moves enormous bulk in parallel). Storage classes are like floors of a warehouse — Standard is the convenient ground floor, Archive is the basement where you rarely go but rent is cheap.",
    diagram: `<svg viewBox="0 0 720 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="EFS performance and storage classes">${svgDefs}
      <rect x="20" y="20" width="680" height="300" rx="10" fill="#1a2332" stroke="#2d3a4f"/>
      <text x="360" y="48" text-anchor="middle" fill="#ff9900" font-size="16" font-weight="700">EFS — Performance Modes &amp; Storage Tiers</text>
      <rect x="40" y="80" width="300" height="115" rx="8" fill="#243349" stroke="#3b82f6"/>
      <text x="55" y="105" fill="#3b82f6" font-size="12" font-weight="700">Performance Mode (creation-time)</text>
      <text x="55" y="128" fill="#e6edf3" font-size="11">▸ General Purpose — lowest latency</text>
      <text x="55" y="148" fill="#e6edf3" font-size="11">▸ Max I/O — highest parallel throughput</text>
      <text x="55" y="174" fill="#8b949e" font-size="10">Cannot change after creation</text>
      <rect x="380" y="80" width="300" height="115" rx="8" fill="#243349" stroke="#10b981"/>
      <text x="395" y="105" fill="#10b981" font-size="12" font-weight="700">Throughput Mode</text>
      <text x="395" y="128" fill="#e6edf3" font-size="11">▸ Bursting (size-based)</text>
      <text x="395" y="148" fill="#e6edf3" font-size="11">▸ Provisioned (fixed rate)</text>
      <text x="395" y="168" fill="#e6edf3" font-size="11">▸ Elastic (auto, recommended)</text>
      <text x="395" y="186" fill="#8b949e" font-size="10">Switchable</text>
      <rect x="40" y="210" width="640" height="100" rx="8" fill="#243349" stroke="#ff9900"/>
      <text x="60" y="235" fill="#ff9900" font-size="12" font-weight="700">Storage Classes (lifecycle policy moves files automatically)</text>
      <text x="60" y="258" fill="#e6edf3" font-size="11">▸ Standard (multi-AZ, hot)  ·  Standard-IA (multi-AZ, infrequent, cheaper)</text>
      <text x="60" y="278" fill="#e6edf3" font-size="11">▸ One Zone / One Zone-IA (single-AZ, &lt;50% price; dev / backup)</text>
      <text x="60" y="298" fill="#e6edf3" font-size="11">▸ Archive (deepest savings, longest retrieval latency)</text>
    </svg>`,
    codeExample: {
      language: "bash",
      title: "Create EFS with Elastic throughput + lifecycle to IA after 30 days",
      code: `# Create with General Purpose + Elastic throughput
aws efs create-file-system \\
  --creation-token analytics-shared \\
  --performance-mode generalPurpose \\
  --throughput-mode elastic \\
  --encrypted

# Lifecycle: move untouched files to IA after 30 days
aws efs put-lifecycle-configuration \\
  --file-system-id fs-0abc \\
  --lifecycle-policies '[{"TransitionToIA":"AFTER_30_DAYS"},
                         {"TransitionToArchive":"AFTER_180_DAYS"}]'`,
    },
    problemStatement:
      "You are a solutions architect at a video-production house. Editors keep hot working files on a shared NFS, but 90% of files are untouched after 30 days and never opened again after 180. Pick the EFS performance mode, throughput mode, and a lifecycle policy that minimizes spend while preserving editor latency for fresh files; justify each choice.",
    questions: [
      {
        q: "Which EFS performance mode is BEST for highly-parallel media processing workloads with many EC2 clients?",
        options: ["A. General Purpose", "B. Max I/O", "C. Bursting", "D. Provisioned"],
        answer: "B",
        explanation:
          "B is correct: Max I/O trades a small per-op latency increase for virtually unlimited parallel throughput — ideal for media processing with many parallel workers. A is for latency-sensitive small-file workloads. C and D are THROUGHPUT modes, not performance modes.",
      },
      {
        q: "Which storage class option provides the LOWEST cost for files that are rarely accessed in a single AZ (dev/backup scenarios)?",
        options: ["A. EFS Standard", "B. EFS Standard-IA", "C. EFS One Zone-IA", "D. EFS Provisioned"],
        answer: "C",
        explanation:
          "C is correct: One Zone-IA combines single-AZ pricing with infrequent-access pricing — the cheapest EFS class. A is the most expensive. B is cheaper than Standard but still multi-AZ. D is a throughput mode, not a storage class.",
      },
      {
        q: "Which EFS throughput mode automatically scales up and down based on workload, billing only for I/O actually performed?",
        options: ["A. Bursting", "B. Provisioned", "C. Elastic", "D. General Purpose"],
        answer: "C",
        explanation:
          "C is correct: Elastic throughput is the recommended modern default for unpredictable workloads. A is size-based. B requires you to lock in a throughput up-front. D is a performance MODE, not a throughput mode.",
      },
    ],
  },

  {
    id: "ebs-vs-efs",
    title: "EBS vs EFS — Picking the Right Storage",
    shortLabel: "EBS vs EFS",
    section: "EC2 Instance Storage",
    domain: "Storage",
    explanation:
      "This is one of the most common SAA exam decision points. **EBS** is block storage attached to ONE EC2 instance in ONE AZ — pick it when an instance needs a private disk for its OS, database, or application working set (gp3 by default; io2 for high-perf DBs). **EFS** is a multi-instance, multi-AZ shared NFS file system — pick it when multiple Linux instances need to read/write the SAME files at the same time across AZs (web farms, content management, shared home directories, container persistent volumes). **Instance Store** is local NVMe — pick it when you need extreme local IOPS and your application replicates state elsewhere (Cassandra, Kafka, Spark shuffle). The cost ladder for 1 GiB of capacity (rough): sc1 < st1 < gp3 < gp2 ≈ io1 < EFS Standard < io2 < instance store (included in instance hourly). The portability ladder (better at sharing): Instance Store < EBS < EBS Multi-Attach (same AZ) < EFS (multi-AZ).",
    analogy:
      "If your data fits in one room, use EBS (a single drawer). If many rooms need to share the same files, use EFS (the company file cabinet). If you only need ultra-fast scratch and you can rebuild it from scratch, use Instance Store (the desk's whiteboard — gone when you leave). Mixing them per workload is the norm — most production architectures use all three.",
    diagram: `<svg viewBox="0 0 720 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="EBS vs EFS vs Instance Store decision matrix">${svgDefs}
      <rect x="20" y="20" width="680" height="300" rx="10" fill="#1a2332" stroke="#2d3a4f"/>
      <text x="360" y="48" text-anchor="middle" fill="#ff9900" font-size="16" font-weight="700">EBS vs EFS vs Instance Store</text>
      <rect x="40" y="80" width="200" height="220" rx="8" fill="#243349" stroke="#3b82f6"/>
      <text x="140" y="105" text-anchor="middle" fill="#3b82f6" font-size="13" font-weight="700">EBS</text>
      <text x="140" y="125" text-anchor="middle" fill="#8b949e" font-size="11">block · network-attached</text>
      <text x="55" y="155" fill="#e6edf3" font-size="11">scope: single AZ</text>
      <text x="55" y="175" fill="#e6edf3" font-size="11">attach: 1 instance (or 16 MA)</text>
      <text x="55" y="195" fill="#e6edf3" font-size="11">durability: replicated in AZ</text>
      <text x="55" y="215" fill="#e6edf3" font-size="11">resize online</text>
      <text x="55" y="245" fill="#10b981" font-size="11">Use: DBs, app data, OS root</text>
      <text x="55" y="265" fill="#8b949e" font-size="10">gp3 · io2 · st1 · sc1</text>
      <rect x="260" y="80" width="200" height="220" rx="8" fill="#243349" stroke="#10b981"/>
      <text x="360" y="105" text-anchor="middle" fill="#10b981" font-size="13" font-weight="700">EFS</text>
      <text x="360" y="125" text-anchor="middle" fill="#8b949e" font-size="11">NFS · multi-AZ</text>
      <text x="275" y="155" fill="#e6edf3" font-size="11">scope: multi-AZ</text>
      <text x="275" y="175" fill="#e6edf3" font-size="11">attach: thousands of clients</text>
      <text x="275" y="195" fill="#e6edf3" font-size="11">durability: 11×9 multi-AZ</text>
      <text x="275" y="215" fill="#e6edf3" font-size="11">elastic capacity</text>
      <text x="275" y="245" fill="#10b981" font-size="11">Use: shared files, CMS, web</text>
      <text x="275" y="265" fill="#8b949e" font-size="10">Linux only · POSIX</text>
      <rect x="480" y="80" width="200" height="220" rx="8" fill="#243349" stroke="#ff9900"/>
      <text x="580" y="105" text-anchor="middle" fill="#ff9900" font-size="13" font-weight="700">Instance Store</text>
      <text x="580" y="125" text-anchor="middle" fill="#8b949e" font-size="11">local NVMe SSD</text>
      <text x="495" y="155" fill="#e6edf3" font-size="11">scope: same physical host</text>
      <text x="495" y="175" fill="#e6edf3" font-size="11">attach: that one instance</text>
      <text x="495" y="195" fill="#ef4444" font-size="11">EPHEMERAL — lost on stop</text>
      <text x="495" y="215" fill="#e6edf3" font-size="11">millions of IOPS</text>
      <text x="495" y="245" fill="#10b981" font-size="11">Use: scratch, cache, shuffles</text>
      <text x="495" y="265" fill="#8b949e" font-size="10">app must replicate state</text>
    </svg>`,
    codeExample: {
      language: "bash",
      title: "Decision cheat-sheet (just commentary; no commands to run)",
      code: `# Choosing storage in 10 seconds:
#
# 1. Do many instances across AZs need to share the SAME files?
#       -> EFS
# 2. Does ONE instance need persistent disk (OS root, DB, app data)?
#       -> EBS (gp3 default; io2 for high-perf DBs)
# 3. Do you need extreme local IOPS and can rebuild on failure?
#       -> Instance Store
# 4. Windows shared file shares with SMB?
#       -> Amazon FSx for Windows File Server (NOT EFS — Linux only)
# 5. Cheap object storage for big blobs, accessed via API?
#       -> Amazon S3
#
# Most production stacks mix several: EBS for the DB, EFS for shared assets,
# Instance Store for caches, S3 for blobs.`,
    },
    problemStatement:
      "You are a solutions architect at a SaaS analytics startup. The architecture has: (a) a Postgres OLTP DB needing 50k sustained IOPS, (b) a fleet of 12 stateless Linux web servers across 3 AZs sharing 200 GB of user-uploaded assets, (c) a 4-node Spark cluster doing big shuffles. Pick EBS, EFS, or Instance Store for each component, explaining why mixing all three is cheaper AND faster than forcing one type everywhere.",
    questions: [
      {
        q: "A team needs 12 EC2 instances across 3 Availability Zones to read AND write the same set of media files. Which storage service is the BEST fit?",
        options: ["A. Amazon EBS (Multi-Attach io2)", "B. Amazon EFS", "C. EC2 Instance Store", "D. Amazon S3 mounted as a filesystem"],
        answer: "B",
        explanation:
          "B is correct: EFS is built for shared multi-AZ NFS access. A is single-AZ and tops out at 16 instances, with strict cluster-FS requirements. C is single-instance and ephemeral. D is not a real product (S3 is an object store; mounting it as a filesystem via s3fs is slow and missing POSIX semantics).",
      },
      {
        q: "Which is the BEST choice for the OS root volume of a critical production EC2 instance?",
        options: ["A. EBS gp3", "B. EFS", "C. Instance Store", "D. Amazon S3"],
        answer: "A",
        explanation:
          "A is correct: gp3 is the canonical OS boot disk — persistent, encryptable, snapshot-able. B can't be a boot volume (Linux NFS root is rare and not the AWS pattern). C is ephemeral — a hardware failure loses the OS. D is not a block device.",
      },
      {
        q: "An application requires the ABSOLUTE MAXIMUM local-disk IOPS for a Spark shuffle directory; data can be reconstructed from S3 on failure. Which storage is BEST?",
        options: ["A. EBS io2 Block Express", "B. EFS Max I/O", "C. EC2 Instance Store on an i3en instance", "D. EBS sc1"],
        answer: "C",
        explanation:
          "C is correct: instance-store NVMe on i3en delivers millions of IOPS, beating any EBS volume — and the workload's reconstructibility makes ephemerality acceptable. A is fast but caps at 256,000 IOPS. B is high THROUGHPUT but not the IOPS leader. D is the slowest HDD type — completely wrong.",
      },
    ],
  },

  // =================================================================
  // NEW SECTIONS (course pages 118–414) — authored in lib/topics/*
  // =================================================================
  ...haScalingTopics,
  ...databaseTopics,
  ...route53Topics,
  ...solutionsArchTopics,
  ...s3Topics,
  ...s3AdvancedTopics,
  ...cloudfrontGaTopics,
  ...storageExtrasTopics,
  ...messagingTopics,

  // ---- Frontend course ----
  ...frontendCoreTopics,
  ...frontendAsyncTopics,

  // ---- Backend course ----
  ...backendPyFoundationsTopics,
  ...backendPyAdvancedTopics,
  ...backendContainersTopics,

  // ---- Networking course ----
  ...networkingProtocolsTopics,
  ...networkingDnsTlsTopics,
  ...networkingDeliveryTopics,

  // ---- System Design course ----
  ...systemDesignFundamentalsTopics,
  ...systemDesignDataTopics,
  ...systemDesignScalingTopics,

  // ---- AI Engineering course (5/6 sections — "AI Agents" pending) ----
  ...aiFundamentalsTopics,
  ...aiPromptEngineeringTopics,
  ...aiLlmIntegrationTopics,
  ...aiRagTopics,
  ...aiLangchainTopics,

  // ---- DSA Prep course ----
  ...dsaRecursionBacktrackingTopics,
];
