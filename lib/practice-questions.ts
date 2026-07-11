// ============================================================
// Practice questions for the /solve screen (LeetCode-style split view).
//
// Two categories are supported: coding (DSA) questions with a runnable code
// editor, and design (System Design) questions with a notes scratchpad. Each
// question ships a full solution broken into tiers (brute → intermediate →
// optimal + variants). Self-contained on purpose so the /solve screen doesn't
// depend on the course content model. MVP: two questions.
// ============================================================

export type SolutionTier = {
  name: string;
  kind: "brute-force" | "intermediate" | "optimal" | "variant";
  idea: string; // supports **bold**
  complexity?: { time: string; space: string };
  /** Coding questions: one code block per language. */
  code?: { language: string; code: string }[];
  /** Design questions: bullet points describing the approach. */
  notes?: string[];
};

export type PracticeQuestion = {
  id: string;
  title: string;
  category: "DSA" | "System Design";
  kind: "coding" | "design";
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  prompt: string; // supports **bold**; blank lines separate paragraphs
  examples?: { input: string; output: string; explanation?: string }[];
  constraints?: string[];
  /** Coding: editable starter per language (must be a complete runnable file). */
  starters?: { language: string; code: string }[];
  solutions: SolutionTier[];
};

// ---------------------------------------------------------------------------
// 1. DSA — Subsets (coding)
// ---------------------------------------------------------------------------
const subsets: PracticeQuestion = {
  id: "subsets",
  title: "Subsets (Power Set)",
  category: "DSA",
  kind: "coding",
  difficulty: "Medium",
  tags: ["Backtracking", "Recursion", "Bitmask"],
  prompt:
    "Given an integer array **nums** of **unique** elements, return *all possible subsets* (the power set).\n\nThe solution set must not contain duplicate subsets. Return the answer in any order.",
  examples: [
    {
      input: "nums = [1,2,3]",
      output: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]",
    },
    { input: "nums = [0]", output: "[[],[0]]" },
  ],
  constraints: [
    "1 <= nums.length <= 10",
    "-10 <= nums[i] <= 10",
    "All the numbers of nums are unique.",
  ],
  starters: [
    {
      language: "java",
      code: `import java.util.*;

public class Main {
    static List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        // TODO: build the power set of nums
        return res;
    }

    public static void main(String[] args) {
        System.out.println(subsets(new int[]{1, 2, 3}));
    }
}
`,
    },
    {
      language: "javascript",
      code: `function subsets(nums) {
  // TODO: build the power set of nums
  return [];
}

console.log(JSON.stringify(subsets([1, 2, 3])));
`,
    },
    {
      language: "python",
      code: `def subsets(nums):
    # TODO: build the power set of nums
    return []


print(subsets([1, 2, 3]))
`,
    },
  ],
  solutions: [
    {
      name: "Brute force — Cascading / iterative",
      kind: "brute-force",
      idea:
        "Start with a result containing just the empty subset `[[]]`. For each number, take every subset already in the result and append a **copy** of it with the new number added. After processing all numbers the result holds all 2ⁿ subsets.",
      complexity: { time: "O(n · 2ⁿ)", space: "O(n · 2ⁿ)" },
      code: [
        {
          language: "javascript",
          code: `function subsets(nums) {
  let res = [[]];
  for (const x of nums) {
    res = res.concat(res.map((s) => [...s, x]));
  }
  return res;
}`,
        },
        {
          language: "python",
          code: `def subsets(nums):
    res = [[]]
    for x in nums:
        res += [cur + [x] for cur in res]
    return res`,
        },
      ],
    },
    {
      name: "Optimal — Backtracking (choose / skip)",
      kind: "optimal",
      idea:
        "Walk the decision tree: at index `i` you either **include** nums[i] or **skip** it, then recurse on `i + 1`. Record the current path at every node. This is the reusable backtracking skeleton — choose, explore, un-choose.",
      complexity: { time: "O(n · 2ⁿ)", space: "O(n) recursion depth" },
      code: [
        {
          language: "java",
          code: `static List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> res = new ArrayList<>();
    backtrack(nums, 0, new ArrayList<>(), res);
    return res;
}

static void backtrack(int[] nums, int i, List<Integer> path,
                      List<List<Integer>> res) {
    if (i == nums.length) { res.add(new ArrayList<>(path)); return; }
    path.add(nums[i]);            // choose
    backtrack(nums, i + 1, path, res);
    path.remove(path.size() - 1); // un-choose
    backtrack(nums, i + 1, path, res); // skip
}`,
        },
        {
          language: "python",
          code: `def subsets(nums):
    res = []
    def backtrack(i, path):
        if i == len(nums):
            res.append(path[:])
            return
        path.append(nums[i])      # choose
        backtrack(i + 1, path)
        path.pop()                # un-choose
        backtrack(i + 1, path)    # skip
    backtrack(0, [])
    return res`,
        },
      ],
    },
    {
      name: "Variant — Subsets II (with duplicates)",
      kind: "variant",
      idea:
        "If the input can contain duplicates, **sort first**, then at each tree level skip a value equal to its predecessor (`nums[i] == nums[i-1]`) so identical subsets aren't emitted twice.",
      complexity: { time: "O(n · 2ⁿ)", space: "O(n)" },
      notes: [
        "Sort the array so equal values are adjacent.",
        "In the loop, `if (i > start && nums[i] == nums[i-1]) continue;`",
        "Recurse with `i + 1` (each element used once).",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// 2. System Design — URL Shortener (design)
// ---------------------------------------------------------------------------
const urlShortener: PracticeQuestion = {
  id: "url-shortener",
  title: "Design a URL Shortener (TinyURL)",
  category: "System Design",
  kind: "design",
  difficulty: "Medium",
  tags: ["System Design", "Hashing", "Caching", "Scaling"],
  prompt:
    "Design a URL shortening service like **TinyURL** / **bit.ly**.\n\nGiven a long URL, produce a short unique alias; when a user visits the short URL, redirect them to the original long URL.\n\nDiscuss functional requirements (create, redirect, optional expiry & analytics), the data model, how you generate the short key, and how the design scales for a **read-heavy** workload (e.g. ~100M new URLs/day, 100:1 read:write).",
  constraints: [
    "Short links should be as short as possible (~7 chars).",
    "Redirects must be fast (low latency) and highly available.",
    "Reads dominate writes (~100:1).",
    "Keys must be unique and hard to guess (optional).",
  ],
  solutions: [
    {
      name: "Naive — Single server + in-memory map",
      kind: "brute-force",
      idea:
        "One server holds a hash map `{ shortKey → longUrl }`. Generate a random 7-char key on create; look it up on redirect.",
      notes: [
        "Simple and fast to build.",
        "❌ Not durable — a restart loses every mapping.",
        "❌ Doesn't scale past one machine's memory.",
        "❌ Random keys can collide; you must check-and-retry.",
      ],
    },
    {
      name: "Intermediate — Database + Base62 of an auto-increment ID",
      kind: "intermediate",
      idea:
        "Store mappings in a database with an auto-increment `id`. Encode that `id` in **Base62** (`[a-zA-Z0-9]`) to produce the short key — guaranteed unique, no collision checks. Redirect is a single indexed lookup by key.",
      complexity: { time: "O(1) create & redirect", space: "O(n) rows" },
      notes: [
        "Table: `id (PK), short_key (unique index), long_url, created_at, expires_at`.",
        "Base62 of a 64-bit id gives ~11 chars max; 62⁷ ≈ 3.5T keys fits 7 chars.",
        "Create = INSERT then encode id; Redirect = SELECT by short_key → 301/302.",
        "✅ Durable and collision-free. ❌ Single DB becomes the bottleneck at scale.",
      ],
    },
    {
      name: "Optimal — Distributed, cached, and pre-generated keys",
      kind: "optimal",
      idea:
        "Separate **key generation** from storage and put a cache in front of reads. A **Key Generation Service (KGS)** pre-computes unique keys in bulk; app servers grab a batch. Hot redirects are served from a **Redis** cache; the datastore is sharded/replicated. Analytics are written asynchronously.",
      complexity: { time: "O(1) reads (cache hit)", space: "O(n) sharded" },
      notes: [
        "**KGS** pre-generates random unique keys into a DB; hands out batches to app servers (removes create-time collision checks & DB write contention).",
        "**Cache (Redis)** in front of redirects — read-heavy traffic mostly hits cache; use LRU eviction.",
        "**Datastore**: shard by key (consistent hashing) or use a NoSQL store (Cassandra/DynamoDB) for horizontal scale + replication.",
        "**Redirect**: 302 (temporary) if you want to count every hit; 301 (permanent) for best performance but loses per-hit analytics.",
        "**Availability**: stateless app tier behind a load balancer; multi-AZ replicas.",
        "**Extras**: rate limiting, custom aliases, TTL/expiry cleanup job, async analytics pipeline (Kafka → warehouse).",
      ],
    },
  ],
};

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [subsets, urlShortener];
