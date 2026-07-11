// ============================================================
// SECTION: DSA Prep — Recursion & Backtracking
// Coding-interview patterns for timed OAs. One concept topic + two problems
// (Subsets, Combination Sum), each with Brute → Intermediate → Optimal
// solutions in Java / JavaScript / Python. Interactive diagrams live in
// components/dsa-diagrams and are selected via `diagramComponent`.
// ============================================================
import type { Topic } from "./shared";

// `diagram` is a required Topic field but is never shown when
// `diagramComponent` is set (ArchitecturePanel prefers the interactive one).
// This keeps the field valid without duplicating the visual.
const fallbackDiagram = (label: string) =>
  `<svg viewBox="0 0 400 60" xmlns="http://www.w3.org/2000/svg"><text x="200" y="34" text-anchor="middle" fill="#94A2B5" font-family="monospace" font-size="12">${label}</text></svg>`;

export const dsaRecursionBacktrackingTopics: Topic[] = [
  // =========================================================================
  // 1. CONCEPT — Recursion & Backtracking (the pattern)
  // =========================================================================
  {
    id: "rb-concept",
    title: "Recursion & Backtracking",
    shortLabel: "The Pattern",
    section: "Recursion & Backtracking",
    domain: "DSA",
    pattern: "Backtracking",
    diagramComponent: "backtracking-loop",
    tldr:
      "Every backtracking problem hides the same three-beat rhythm: choose, explore, un-choose. Recursion walks a decision tree; backtracking is recursion that undoes each choice on the way back up so it can try the next one — and prunes branches that can never lead to a valid answer. Learn the one skeleton and N-Queens, Subsets, and Permutations stop looking like different problems.",
    subtopics: [
      {
        heading: "How to spot it in an OA",
        bullets: [
          { icon: "🔎", text: "**\"Find all / generate every / return all valid…\"** — the answer is a *set* of results, not one number." },
          { icon: "🧩", text: "**Combinations, permutations, subsets, arrangements, partitions** in the title or body." },
          { icon: "📏", text: "**A small input bound** (n ≤ 12–20) in the constraints — the setter is telling you exponential search is intended." },
          { icon: "🚧", text: "**A rule you must not break at each step** — no repeats, no attacking queens, no unbalanced brackets." },
          { icon: "🔢", text: "**\"Count the number of ways…\"** — same search; just increment a counter at the base case instead of collecting." },
        ],
      },
      {
        heading: "The reusable skeleton",
        bullets: [
          { icon: "✅", text: "**Base case** — if the state is a complete solution, record it (or count it) and return." },
          { icon: "🌿", text: "**Loop over candidates** — for each next choice available from this state." },
          { icon: "✂️", text: "**Prune** — if a candidate violates a constraint, `continue`; never recurse into a dead branch." },
          { icon: "🔁", text: "**choose → explore → un-choose** — apply the choice, recurse one level deeper, then undo it before the next iteration." },
        ],
      },
      {
        heading: "Why un-choosing matters",
        bullets: [
          { icon: "🧵", text: "One shared `path`/board is mutated in place; **undoing** restores it so sibling branches start clean." },
          { icon: "🧠", text: "Recursion depth = solution length, so **space is O(depth)** even when there are exponentially many results." },
          { icon: "⚡", text: "Pruning early is the whole game: a check *before* the recursive call can cut an entire subtree." },
        ],
      },
    ],
    keyFacts: [
      { label: "Pattern", value: "Choose · Explore · Un-choose", icon: "🔁" },
      { label: "Input signal", value: "n ≤ ~20, \"all/every\"", icon: "📏" },
      { label: "Time", value: "Exponential (2ⁿ, n!)", icon: "⏱️" },
      { label: "Space", value: "O(recursion depth)", icon: "🧠" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'Generate all subsets/permutations' → **backtracking**, not a formula.",
        "'No two may…' / 'valid arrangement' → **constraint pruning**.",
        "Memorize the **skeleton**, not individual solutions.",
        "Base case **records**; the loop **chooses**; the un-choose **restores**.",
        "Small n in constraints = **exponential search is expected**.",
      ],
      analogyBrief:
        "Exploring a maze while dropping and picking up breadcrumbs: walk forward, and if you hit a wall, step back and take the next turn.",
    },
    explanation:
      "Recursion solves a problem by expressing it in terms of smaller instances of itself, bottoming out at a base case. Backtracking is recursion applied to a search over a tree of decisions: at each node you make one choice, recurse to explore the consequences, and then undo that choice so you can try the next one. The single skeleton is: if the current state is a complete solution, record it and return; otherwise loop over the candidate choices, skip (prune) any that violate a constraint, and for each remaining candidate choose it, recurse, then un-choose it. Because the same mutable state (a path list, a board, a used[] array) is shared across the whole search, the un-choose step is what keeps sibling branches independent — without it, a choice made deep in one branch would leak into the next. Pruning is the difference between a brute-force enumeration and an efficient search: checking a constraint *before* the recursive call means an invalid subtree is never entered at all. The shape recurs everywhere — Subsets (no constraint, every node is an answer), Permutations (each element used once), Combination Sum (reuse allowed, prune when the remaining target goes negative), N-Queens (prune shared columns and diagonals), Sudoku, word search, parenthesis generation. Time is typically exponential (2ⁿ subsets, n! permutations) because the answer set itself is exponential, but space stays O(recursion depth) since only one root-to-leaf path is live at a time.",
    analogy:
      "Backtracking is exploring a hedge maze while dropping breadcrumbs. At each junction you pick a path (choose) and walk deeper (explore). If you hit a dead end or an exit, you note it, then walk back to the last junction picking up your breadcrumbs (un-choose) and take the next unexplored path. You never carry the whole maze in your head — only the single trail from the entrance to where you're standing.",
    diagram: fallbackDiagram("choose → explore → un-choose"),
    diagramLegend: [
      { color: "#2FD9C4", label: "choose / explore", description: "Pick the next candidate and recurse one level deeper." },
      { color: "#F5A93F", label: "backtrack", description: "Undo the last choice and try the next candidate." },
      { color: "#F0596B", label: "base case / dead end", description: "Record the solution, or prune an invalid branch early." },
    ],
    problemStatement:
      "Understand the choose → explore → un-choose skeleton well enough to apply it to any 'generate all / count all valid' problem without memorizing individual solutions.",
    codeExample: {
      language: "javascript",
      title: "The universal skeleton, applied to Subsets",
      code: `function solve(nums) {
  const result = [];
  const path = [];
  function backtrack(start) {
    // base case: this state is a complete solution — record it
    result.push([...path]);
    for (let i = start; i < nums.length; i++) {
      // (prune here if a constraint would be violated)
      path.push(nums[i]);   // CHOOSE
      backtrack(i + 1);     // EXPLORE
      path.pop();           // UN-CHOOSE
    }
  }
  backtrack(0);
  return result;
}
console.log(solve([1, 2, 3]));`,
    },
    codeExamples: [
      {
        language: "javascript",
        tab: "JavaScript",
        title: "The universal skeleton, applied to Subsets",
        code: `function solve(nums) {
  const result = [];
  const path = [];
  function backtrack(start) {
    result.push([...path]);       // base case: record
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);         // CHOOSE
      backtrack(i + 1);           // EXPLORE
      path.pop();                 // UN-CHOOSE
    }
  }
  backtrack(0);
  return result;
}
console.log(solve([1, 2, 3]));`,
      },
      {
        language: "python",
        tab: "Python",
        title: "The universal skeleton, applied to Subsets",
        code: `def solve(nums):
    result = []
    path = []
    def backtrack(start):
        result.append(path[:])          # base case: record
        for i in range(start, len(nums)):
            path.append(nums[i])        # CHOOSE
            backtrack(i + 1)            # EXPLORE
            path.pop()                  # UN-CHOOSE
    backtrack(0)
    return result

print(solve([1, 2, 3]))`,
      },
      {
        language: "java",
        tab: "Java",
        title: "The universal skeleton (pseudocode shape)",
        code: `// backtrack(state):
//   if state is a complete solution:
//       record(state); return;
//   for candidate in choicesFrom(state):
//       if candidate violates a constraint: continue;   // PRUNE
//       choose(candidate);        // CHOOSE
//       backtrack(nextState);     // EXPLORE
//       unchoose(candidate);      // UN-CHOOSE`,
        expectedOutput:
          "Reuse this skeleton for Subsets, Permutations, Combination Sum, N-Queens…",
      },
    ],
    questions: [
      {
        q: "Which phrase in a problem statement most strongly signals backtracking?",
        options: [
          "\"Return the maximum sum subarray\"",
          "\"Find all valid arrangements / generate every combination\"",
          "\"Sort the array in-place\"",
          "\"Detect a cycle in the linked list\"",
        ],
        answer: "B",
        explanation:
          "Backtracking enumerates a set of results. 'Find all / generate every valid…' means the answer is many results explored over a decision tree — the backtracking signal.",
      },
      {
        q: "What is the role of the 'un-choose' (undo) step?",
        options: [
          "It frees memory the garbage collector missed",
          "It restores the shared state so the next sibling branch starts clean",
          "It sorts the candidates for the next call",
          "It converts the result to a string",
        ],
        answer: "B",
        explanation:
          "The path/board is mutated in place and shared across branches. Undoing the last choice restores it so exploring the next candidate isn't polluted by the previous one.",
      },
      {
        q: "Why do backtracking constraints (OA inputs) usually cap n around 12–20?",
        options: [
          "Because arrays can't be larger",
          "Because the search is exponential, so only small n finishes in time — a hint the approach is intended",
          "To keep the output readable",
          "Because recursion can't exceed depth 20",
        ],
        answer: "B",
        explanation:
          "Exponential search (2ⁿ, n!) is only feasible for small n. A tiny bound in the constraints is the setter telling you exponential exploration is the intended solution.",
      },
      {
        q: "Pruning improves backtracking by…",
        options: [
          "Checking a constraint before recursing so an invalid subtree is never entered",
          "Caching every result in a hash map",
          "Running the recursion on multiple threads",
          "Reducing the number of distinct outputs required",
        ],
        answer: "A",
        explanation:
          "Pruning cuts a whole subtree before the recursive call is made. That early cut — not the recursion itself — is the efficiency gain over brute-force enumeration.",
      },
    ],
  },

  // =========================================================================
  // 2. PROBLEM — Subsets (power set)
  // =========================================================================
  {
    id: "rb-subsets",
    title: "Subsets (Power Set)",
    shortLabel: "Subsets",
    section: "Recursion & Backtracking",
    domain: "DSA",
    pattern: "Backtracking",
    difficulty: "Medium",
    diagramComponent: "subsets-tree",
    tldr:
      "Given a set of unique numbers, return every possible subset (the power set). It's the cleanest first backtracking problem: there's no constraint to violate, so every path through the recursion is a valid answer — you see the shape of the search with nothing else in the way. There are exactly 2ⁿ subsets.",
    subtopics: [
      {
        heading: "The core idea",
        bullets: [
          { icon: "🎯", text: "Each element is independently **in or out** → 2 choices × n elements = **2ⁿ** subsets." },
          { icon: "➡️", text: "Walk the array with a **start index** so the loop only moves forward — you never generate the same subset twice." },
          { icon: "📝", text: "Whatever is in `path` at any call is **already a valid subset** — record it on every call, no base-case guard needed." },
        ],
      },
      {
        heading: "Three ways to build it",
        bullets: [
          { icon: "🧱", text: "**Cascading (brute):** start with `[[]]`; for each number, append it to a copy of every subset so far." },
          { icon: "🔟", text: "**Bitmask:** every integer 0…2ⁿ−1 is a subset — bit i set ⇒ include nums[i]." },
          { icon: "🌳", text: "**Backtracking (optimal shape):** choose → explore(i+1) → un-choose; the canonical template." },
        ],
      },
    ],
    keyFacts: [
      { label: "Total subsets", value: "2ⁿ", icon: "🔢" },
      { label: "Time", value: "O(n · 2ⁿ)", icon: "⏱️" },
      { label: "Space", value: "O(n) recursion depth", icon: "🧠" },
      { label: "Pruning", value: "None — every node is valid", icon: "✅" },
    ],
    quickReference: {
      title: "Cues & pitfalls",
      icon: "🎯",
      bullets: [
        "'All subsets / power set' → **include-by-index backtracking**.",
        "Record on **every** call (the empty subset counts).",
        "Pass `i + 1` (not `start + 1`) so elements never repeat.",
        "**Subsets II** (with duplicates): sort, then skip `nums[i] === nums[i-1]` at the same tree level.",
        "Push a **copy** of `path` into the result, not the reference.",
      ],
      analogyBrief:
        "Packing a carry-on: go down the list once, for each item decide pack-it or leave-it; every combination of decisions is one subset.",
    },
    explanation:
      "Subsets asks for the power set: every possible subset of a set of unique numbers, including the empty set and the full set. Because there is no constraint — every subset is valid — it isolates the pure shape of a backtracking search. The canonical solution walks the array with a start index. At every recursive call, whatever is currently in the path is already a complete, valid subset, so it is recorded immediately (this is why no base-case guard is needed and why the empty subset is captured on the very first call). The call then loops from start to the end of the array; for each index i it adds nums[i] to the path (choose), recurses with start = i + 1 so the same element can never be reused and earlier elements are never revisited (explore), and removes nums[i] before trying the next index (un-choose). Because the loop only ever moves forward, each subset is generated exactly once, giving 2ⁿ results. Two other framings are worth knowing for interviews: the cascading/iterative build (start from [[]] and, for each number, append it to a copy of every subset accumulated so far) and the bitmask enumeration (each integer from 0 to 2ⁿ−1 encodes a subset, with bit i deciding whether nums[i] is included). All three are O(n·2ⁿ) time because there are 2ⁿ subsets and copying each costs up to O(n). The common follow-up, Subsets II, allows duplicate input values; the fix is to sort first and skip a candidate that equals its predecessor at the same tree level, so duplicate subsets aren't emitted.",
    analogy:
      "Packing a carry-on. You go down your packing list one item at a time, and for each item you make exactly one decision: pack it, or leave it behind. You never reconsider an item you've already passed. Walk the whole list once, and every combination of decisions you could have made is a different way to pack — that's every subset, generated without ever writing them all out by hand.",
    diagram: fallbackDiagram("Subsets decision tree — 2^n nodes"),
    diagramLegend: [
      { color: "#2FD9C4", label: "edge = choose element", description: "Each downward edge adds one element to the current subset." },
      { color: "#B79CFB", label: "node = recorded subset", description: "Every node is a valid subset; 8 nodes = 2³ for {1,2,3}." },
    ],
    problemStatement:
      "Given an integer array `nums` of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets, in any order. Example: nums = [1,2,3] → [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]].",
    codeExample: {
      language: "javascript",
      title: "Subsets — backtracking (optimal shape)",
      code: `function subsets(nums) {
  const result = [], path = [];
  function backtrack(start) {
    result.push([...path]);
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1);
      path.pop();
    }
  }
  backtrack(0);
  return result;
}
console.log(subsets([1, 2, 3]));`,
    },
    approaches: [
      {
        name: "Brute Force — Cascading",
        kind: "brute-force",
        idea:
          "Start with the empty subset `[[]]`. For each number, take every subset built so far and produce a **new copy with that number appended**. After processing all n numbers you have all 2ⁿ subsets. Simple and iterative — no recursion — but you allocate a lot of intermediate arrays.",
        complexity: { time: "O(n · 2ⁿ)", space: "O(n · 2ⁿ)" },
        variants: [
          "Same idea powers **Subsets II**: before appending duplicates, skip subsets that would repeat.",
        ],
        code: [
          {
            language: "java",
            tab: "Java",
            title: "Cascading build",
            code: `import java.util.*;

class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        res.add(new ArrayList<>());                 // start with [[]]
        for (int num : nums) {
            int size = res.size();
            for (int i = 0; i < size; i++) {
                List<Integer> next = new ArrayList<>(res.get(i));
                next.add(num);                      // copy + append
                res.add(next);
            }
        }
        return res;
    }
    public static void main(String[] args) {
        System.out.println(new Solution().subsets(new int[]{1, 2, 3}));
    }
}`,
            expectedOutput: "[[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]",
          },
          {
            language: "javascript",
            tab: "JavaScript",
            title: "Cascading build",
            code: `function subsets(nums) {
  let res = [[]];
  for (const num of nums) {
    res = res.concat(res.map((sub) => [...sub, num]));
  }
  return res;
}
console.log(subsets([1, 2, 3]));`,
          },
          {
            language: "python",
            tab: "Python",
            title: "Cascading build",
            code: `def subsets(nums):
    res = [[]]
    for num in nums:
        res += [sub + [num] for sub in res]
    return res

print(subsets([1, 2, 3]))`,
          },
        ],
      },
      {
        name: "Intermediate — Bitmask",
        kind: "intermediate",
        idea:
          "There are exactly 2ⁿ subsets, and every integer from `0` to `2ⁿ − 1` is one: **bit i set ⇒ include nums[i]**. Loop every mask, read its bits, build the subset. No recursion and no growing intermediate lists — a tidy way to show you understand the 2ⁿ structure. (Works cleanly only for n ≤ ~31.)",
        complexity: { time: "O(n · 2ⁿ)", space: "O(1) auxiliary" },
        variants: [
          "The mask trick also enumerates **all combinations** and underpins bitmask DP.",
        ],
        code: [
          {
            language: "java",
            tab: "Java",
            title: "Bitmask enumeration",
            code: `import java.util.*;

class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        int n = nums.length;
        List<List<Integer>> res = new ArrayList<>();
        for (int mask = 0; mask < (1 << n); mask++) {
            List<Integer> sub = new ArrayList<>();
            for (int i = 0; i < n; i++) {
                if ((mask & (1 << i)) != 0) sub.add(nums[i]);
            }
            res.add(sub);
        }
        return res;
    }
    public static void main(String[] args) {
        System.out.println(new Solution().subsets(new int[]{1, 2, 3}));
    }
}`,
            expectedOutput: "[[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]",
          },
          {
            language: "javascript",
            tab: "JavaScript",
            title: "Bitmask enumeration",
            code: `function subsets(nums) {
  const n = nums.length, res = [];
  for (let mask = 0; mask < (1 << n); mask++) {
    const sub = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) sub.push(nums[i]);
    }
    res.push(sub);
  }
  return res;
}
console.log(subsets([1, 2, 3]));`,
          },
          {
            language: "python",
            tab: "Python",
            title: "Bitmask enumeration",
            code: `def subsets(nums):
    n = len(nums)
    res = []
    for mask in range(1 << n):
        sub = [nums[i] for i in range(n) if mask & (1 << i)]
        res.append(sub)
    return res

print(subsets([1, 2, 3]))`,
          },
        ],
      },
      {
        name: "Optimal — Backtracking",
        kind: "optimal",
        idea:
          "The canonical template: at each call record the current `path`, then loop from `start`, **choose** nums[i], **explore** with `i + 1`, and **un-choose**. Passing `i + 1` guarantees forward-only movement, so no subset repeats. Same O(n·2ⁿ) time as the others but only **O(n) extra space** (one live path) and it generalizes directly to Permutations, Combination Sum, and every other backtracking problem.",
        complexity: { time: "O(n · 2ⁿ)", space: "O(n) recursion depth" },
        variants: [
          "**Subsets II** (duplicates allowed): sort `nums`, then `if (i > start && nums[i] === nums[i-1]) continue;` to skip duplicate subsets at the same level.",
          "Swap the record step for a counter to **count** subsets instead of listing them.",
        ],
        code: [
          {
            language: "java",
            tab: "Java",
            title: "Backtracking",
            code: `import java.util.*;

class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        backtrack(nums, 0, new ArrayList<>(), res);
        return res;
    }
    private void backtrack(int[] nums, int start, List<Integer> path,
                           List<List<Integer>> res) {
        res.add(new ArrayList<>(path));             // record every node
        for (int i = start; i < nums.length; i++) {
            path.add(nums[i]);                      // choose
            backtrack(nums, i + 1, path, res);      // explore
            path.remove(path.size() - 1);           // un-choose
        }
    }
    public static void main(String[] args) {
        System.out.println(new Solution().subsets(new int[]{1, 2, 3}));
    }
}`,
            expectedOutput: "[[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]",
          },
          {
            language: "javascript",
            tab: "JavaScript",
            title: "Backtracking",
            code: `function subsets(nums) {
  const result = [], path = [];
  function backtrack(start) {
    result.push([...path]);            // record every node
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);              // choose
      backtrack(i + 1);               // explore
      path.pop();                      // un-choose
    }
  }
  backtrack(0);
  return result;
}
console.log(subsets([1, 2, 3]));`,
          },
          {
            language: "python",
            tab: "Python",
            title: "Backtracking",
            code: `def subsets(nums):
    result, path = [], []
    def backtrack(start):
        result.append(path[:])          # record every node
        for i in range(start, len(nums)):
            path.append(nums[i])        # choose
            backtrack(i + 1)            # explore
            path.pop()                  # un-choose
    backtrack(0)
    return result

print(subsets([1, 2, 3]))`,
          },
        ],
      },
    ],
    questions: [
      {
        q: "How many subsets does an n-element set have, and how many nodes does the backtracking tree visit?",
        options: ["O(n)", "O(n²)", "O(2ⁿ)", "O(n!)"],
        answer: "C",
        explanation:
          "Each element is independently in or out — 2 choices × n elements = 2ⁿ subsets, and the tree has exactly one node per subset.",
      },
      {
        q: "In the backtracking solution, why recurse with start = i + 1 instead of start?",
        options: [
          "To sort the output",
          "So the loop only moves forward — preventing reused elements and duplicate subsets",
          "To reduce the time complexity to O(n)",
          "Because recursion requires an incremented argument",
        ],
        answer: "B",
        explanation:
          "Passing i + 1 means each recursive branch only considers elements after i, so the search moves forward and never regenerates a subset.",
      },
      {
        q: "Why must you push a copy of `path` (e.g. [...path]) into the result rather than path itself?",
        options: [
          "Copies are faster",
          "path is mutated by later choose/un-choose steps, so storing the reference would corrupt earlier results",
          "It's required by the language",
          "To convert numbers to strings",
        ],
        answer: "B",
        explanation:
          "path is a single shared array mutated throughout the search. Storing the reference means every result would end up reflecting the final state; a snapshot copy freezes the subset.",
      },
      {
        q: "For Subsets II (input may contain duplicates), what change avoids duplicate subsets?",
        options: [
          "Use a bitmask instead of recursion",
          "Sort nums, then skip nums[i] when i > start and nums[i] === nums[i-1]",
          "Reverse the array first",
          "Remove all duplicates before starting",
        ],
        answer: "B",
        explanation:
          "Sorting groups equal values; skipping a value equal to its predecessor at the same tree level prevents emitting the same subset twice. Removing duplicates outright would lose subsets like [2,2].",
      },
    ],
  },

  // =========================================================================
  // 3. PROBLEM — Combination Sum
  // =========================================================================
  {
    id: "rb-combination-sum",
    title: "Combination Sum",
    shortLabel: "Combination Sum",
    section: "Recursion & Backtracking",
    domain: "DSA",
    pattern: "Backtracking",
    difficulty: "Medium",
    diagramComponent: "combination-sum-tree",
    tldr:
      "Given distinct candidates and a target, return every unique combination that sums to the target — each candidate may be reused unlimited times. This is the first backtracking problem where pruning really matters: you cut a branch the instant the remaining target goes negative, and (once sorted) you can break the whole loop the moment a candidate exceeds what's left.",
    subtopics: [
      {
        heading: "Keeping combinations unique",
        bullets: [
          { icon: "➡️", text: "Pass a **start index** and recurse with `i` (not `i+1`) so the same candidate can be reused, but earlier ones are never revisited — this prevents [2,3] and [3,2] both appearing." },
          { icon: "🎯", text: "Track a **remaining** target; when it hits **0**, record the combination; when it goes **negative**, abandon the branch." },
        ],
      },
      {
        heading: "The pruning ladder",
        bullets: [
          { icon: "🐌", text: "**Brute:** try every candidate from index 0 each step (allows reuse), collect sums == target, then dedupe — explores permutations, very slow." },
          { icon: "🚶", text: "**Intermediate:** start-index backtracking (unique combos), prune only when remaining < 0." },
          { icon: "🏃", text: "**Optimal:** sort candidates, then `if candidates[i] > remaining: break` — one check kills the entire rest of the loop." },
        ],
      },
    ],
    keyFacts: [
      { label: "Reuse allowed", value: "Yes (recurse with i)", icon: "♻️" },
      { label: "Record when", value: "remaining == 0", icon: "🎯" },
      { label: "Prune when", value: "remaining < 0 / cand > rem", icon: "✂️" },
      { label: "Space", value: "O(target / min) depth", icon: "🧠" },
    ],
    quickReference: {
      title: "Cues & pitfalls",
      icon: "🎯",
      bullets: [
        "'All combinations summing to target, reuse allowed' → **start-index backtracking**.",
        "Recurse with **i** (reuse) — with **i + 1** you get Combination Sum II (each used once).",
        "**Sort + break** when candidate > remaining is the key optimization.",
        "Record a **copy** of the path; subtract from `remaining` instead of re-summing.",
        "Distinct candidates → no dedup needed; duplicates → sort + skip at level.",
      ],
      analogyBrief:
        "Making exact change from unlimited coins of each type: try the coin, subtract it, and stop the moment you'd overshoot.",
    },
    explanation:
      "Combination Sum gives you an array of distinct positive candidates and a target, and asks for every unique combination of candidates (with unlimited reuse) that sums to exactly the target. The backtracking framing tracks a running combination and a remaining amount. At each call, if remaining is 0 the current path is a valid combination and is recorded; if remaining is negative the branch is a dead end and is abandoned. Otherwise you loop over candidates starting at a start index and, for each, choose it, recurse with the same index i (so the candidate can be reused) but never an earlier index (so combinations are built in non-decreasing index order and [2,3] is never also produced as [3,2]), then un-choose. This start-index discipline is what makes the combinations unique without any post-hoc deduplication. Pruning drives the performance: the minimal version only stops when remaining < 0, but if you sort the candidates first you can break out of the entire loop as soon as candidates[i] exceeds remaining, because every later candidate is at least as large and could only overshoot too — a single comparison that prunes an entire tail of subtrees. The naive brute force instead tries every candidate from index 0 at each step; that explores permutations of the same combination and requires a sort-and-dedupe pass, exploring vastly more nodes. Space is O(target / smallest candidate) for the recursion depth. The close variants are Combination Sum II (each number used at most once — recurse with i + 1 and skip duplicates at the same level after sorting) and Combination Sum III (use exactly k numbers from 1–9).",
    analogy:
      "Making exact change with unlimited coins of each denomination. You try adding a coin, subtract its value from what's still owed, and keep going. The instant your running total would exceed the amount owed, you stop and back out — there's no point continuing down that pile. Sorting the coins lets you stop even earlier: once a coin is bigger than what's left, every bigger coin is hopeless too.",
    diagram: fallbackDiagram("Combination Sum tree with pruning"),
    diagramLegend: [
      { color: "#2FD9C4", label: "safe — continue", description: "Remaining target still positive; keep exploring." },
      { color: "#B79CFB", label: "solution", description: "Remaining hit exactly 0 — record the combination." },
      { color: "#F0596B", label: "pruned", description: "Remaining went negative — branch abandoned before recursing." },
    ],
    problemStatement:
      "Given an array of distinct integers `candidates` and a target integer `target`, return all unique combinations of candidates where the chosen numbers sum to target. The same number may be chosen unlimited times. Example: candidates = [2,3,6,7], target = 7 → [[2,2,3],[7]].",
    codeExample: {
      language: "javascript",
      title: "Combination Sum — sorted + pruned (optimal)",
      code: `function combinationSum(candidates, target) {
  candidates.sort((a, b) => a - b);
  const res = [], path = [];
  function backtrack(start, remaining) {
    if (remaining === 0) { res.push([...path]); return; }
    for (let i = start; i < candidates.length; i++) {
      if (candidates[i] > remaining) break;   // prune the whole tail
      path.push(candidates[i]);
      backtrack(i, remaining - candidates[i]); // reuse allowed
      path.pop();
    }
  }
  backtrack(0, target);
  return res;
}
console.log(combinationSum([2, 3, 6, 7], 7));`,
    },
    approaches: [
      {
        name: "Brute Force — All picks + dedupe",
        kind: "brute-force",
        idea:
          "At every step try **every** candidate (from index 0, reuse allowed), subtract, and recurse; when remaining hits 0, sort the path and add it to a set to drop duplicates. Correct but it explores every **ordering** of each combination — e.g. [2,2,3], [2,3,2], [3,2,2] are all walked — so the work explodes and you need the dedupe set to recover unique combinations.",
        complexity: { time: "O(n^(target/min)) explored", space: "O(target/min) depth + set" },
        variants: [
          "Removing the dedupe set but keeping index-0 recursion would return duplicate combinations — the bug this approach exists to illustrate.",
        ],
        code: [
          {
            language: "java",
            tab: "Java",
            title: "Try-all + dedupe",
            code: `import java.util.*;

class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        Set<List<Integer>> seen = new HashSet<>();
        List<List<Integer>> res = new ArrayList<>();
        backtrack(candidates, target, new ArrayList<>(), seen, res);
        return res;
    }
    private void backtrack(int[] c, int remaining, List<Integer> path,
                           Set<List<Integer>> seen, List<List<Integer>> res) {
        if (remaining == 0) {
            List<Integer> key = new ArrayList<>(path);
            Collections.sort(key);
            if (seen.add(key)) res.add(key);
            return;
        }
        if (remaining < 0) return;
        for (int i = 0; i < c.length; i++) {      // from 0 every time
            path.add(c[i]);
            backtrack(c, remaining - c[i], path, seen, res);
            path.remove(path.size() - 1);
        }
    }
    public static void main(String[] args) {
        System.out.println(new Solution().combinationSum(new int[]{2, 3, 6, 7}, 7));
    }
}`,
            expectedOutput: "[[2, 2, 3], [7]]",
          },
          {
            language: "javascript",
            tab: "JavaScript",
            title: "Try-all + dedupe",
            code: `function combinationSum(candidates, target) {
  const seen = new Set(), res = [];
  function backtrack(remaining, path) {
    if (remaining === 0) {
      const sorted = [...path].sort((a, b) => a - b);
      const key = sorted.join(",");
      if (!seen.has(key)) { seen.add(key); res.push(sorted); }
      return;
    }
    if (remaining < 0) return;
    for (let i = 0; i < candidates.length; i++) {   // from 0 every time
      path.push(candidates[i]);
      backtrack(remaining - candidates[i], path);
      path.pop();
    }
  }
  backtrack(target, []);
  return res;
}
console.log(combinationSum([2, 3, 6, 7], 7));`,
          },
          {
            language: "python",
            tab: "Python",
            title: "Try-all + dedupe",
            code: `def combinationSum(candidates, target):
    seen, res = set(), []
    def backtrack(remaining, path):
        if remaining == 0:
            key = tuple(sorted(path))
            if key not in seen:
                seen.add(key)
                res.append(list(key))
            return
        if remaining < 0:
            return
        for c in candidates:                 # from 0 every time
            path.append(c)
            backtrack(remaining - c, path)
            path.pop()
    backtrack(target, [])
    return res

print(combinationSum([2, 3, 6, 7], 7))`,
          },
        ],
      },
      {
        name: "Intermediate — Start-index backtracking",
        kind: "intermediate",
        idea:
          "Pass a **start index** and recurse with `i` (reuse) but never an earlier index. This builds each combination in non-decreasing order, so every combination is produced **exactly once** — no set, no dedupe. Prune only when `remaining` goes negative. This is the clean, correct solution; the only thing missing is the sorted early-break.",
        complexity: { time: "O(n^(target/min))", space: "O(target/min) depth" },
        variants: [
          "**Combination Sum II:** recurse with `i + 1` (each number used once) and, after sorting, skip `c[i] == c[i-1]` at the same level.",
        ],
        code: [
          {
            language: "java",
            tab: "Java",
            title: "Start-index backtracking",
            code: `import java.util.*;

class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        List<List<Integer>> res = new ArrayList<>();
        backtrack(candidates, 0, target, new ArrayList<>(), res);
        return res;
    }
    private void backtrack(int[] c, int start, int remaining,
                           List<Integer> path, List<List<Integer>> res) {
        if (remaining == 0) { res.add(new ArrayList<>(path)); return; }
        if (remaining < 0) return;
        for (int i = start; i < c.length; i++) {
            path.add(c[i]);
            backtrack(c, i, remaining - c[i], path, res);  // i = reuse
            path.remove(path.size() - 1);
        }
    }
    public static void main(String[] args) {
        System.out.println(new Solution().combinationSum(new int[]{2, 3, 6, 7}, 7));
    }
}`,
            expectedOutput: "[[2, 2, 3], [7]]",
          },
          {
            language: "javascript",
            tab: "JavaScript",
            title: "Start-index backtracking",
            code: `function combinationSum(candidates, target) {
  const res = [], path = [];
  function backtrack(start, remaining) {
    if (remaining === 0) { res.push([...path]); return; }
    if (remaining < 0) return;
    for (let i = start; i < candidates.length; i++) {
      path.push(candidates[i]);
      backtrack(i, remaining - candidates[i]);   // i = reuse
      path.pop();
    }
  }
  backtrack(0, target);
  return res;
}
console.log(combinationSum([2, 3, 6, 7], 7));`,
          },
          {
            language: "python",
            tab: "Python",
            title: "Start-index backtracking",
            code: `def combinationSum(candidates, target):
    res, path = [], []
    def backtrack(start, remaining):
        if remaining == 0:
            res.append(path[:])
            return
        if remaining < 0:
            return
        for i in range(start, len(candidates)):
            path.append(candidates[i])
            backtrack(i, remaining - candidates[i])   # i = reuse
            path.pop()
    backtrack(0, target)
    return res

print(combinationSum([2, 3, 6, 7], 7))`,
          },
        ],
      },
      {
        name: "Optimal — Sort + early break",
        kind: "optimal",
        idea:
          "Sort the candidates once, then inside the loop `if candidates[i] > remaining: break`. Because the array is sorted, if this candidate already overshoots, so does every later one — a single comparison prunes the **entire rest of the loop and all their subtrees**. Same correctness as the start-index version, dramatically fewer nodes visited on large inputs.",
        complexity: { time: "O(n^(target/min)) worst, far less in practice", space: "O(target/min) depth" },
        variants: [
          "Add `if (remaining == 0) record` at the top and the break-prune below — the standard interview-ready template.",
          "**Combination Sum III** (exactly k numbers from 1–9): add a size check to the base case.",
        ],
        code: [
          {
            language: "java",
            tab: "Java",
            title: "Sort + break",
            code: `import java.util.*;

class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        Arrays.sort(candidates);
        List<List<Integer>> res = new ArrayList<>();
        backtrack(candidates, 0, target, new ArrayList<>(), res);
        return res;
    }
    private void backtrack(int[] c, int start, int remaining,
                           List<Integer> path, List<List<Integer>> res) {
        if (remaining == 0) { res.add(new ArrayList<>(path)); return; }
        for (int i = start; i < c.length; i++) {
            if (c[i] > remaining) break;                    // prune the tail
            path.add(c[i]);
            backtrack(c, i, remaining - c[i], path, res);
            path.remove(path.size() - 1);
        }
    }
    public static void main(String[] args) {
        System.out.println(new Solution().combinationSum(new int[]{2, 3, 6, 7}, 7));
    }
}`,
            expectedOutput: "[[2, 2, 3], [7]]",
          },
          {
            language: "javascript",
            tab: "JavaScript",
            title: "Sort + break",
            code: `function combinationSum(candidates, target) {
  candidates.sort((a, b) => a - b);
  const res = [], path = [];
  function backtrack(start, remaining) {
    if (remaining === 0) { res.push([...path]); return; }
    for (let i = start; i < candidates.length; i++) {
      if (candidates[i] > remaining) break;      // prune the tail
      path.push(candidates[i]);
      backtrack(i, remaining - candidates[i]);
      path.pop();
    }
  }
  backtrack(0, target);
  return res;
}
console.log(combinationSum([2, 3, 6, 7], 7));`,
          },
          {
            language: "python",
            tab: "Python",
            title: "Sort + break",
            code: `def combinationSum(candidates, target):
    candidates.sort()
    res, path = [], []
    def backtrack(start, remaining):
        if remaining == 0:
            res.append(path[:])
            return
        for i in range(start, len(candidates)):
            if candidates[i] > remaining:          # prune the tail
                break
            path.append(candidates[i])
            backtrack(i, remaining - candidates[i])
            path.pop()
    backtrack(0, target)
    return res

print(combinationSum([2, 3, 6, 7], 7))`,
          },
        ],
      },
    ],
    questions: [
      {
        q: "To allow reusing the same candidate, the recursive call passes which start index?",
        options: [
          "i + 1 (move past the current candidate)",
          "i (stay on the current index so it can be picked again)",
          "0 (restart from the beginning)",
          "start (never advance)",
        ],
        answer: "B",
        explanation:
          "Recursing with i lets the current candidate be chosen again while still never revisiting earlier ones, keeping combinations unique yet reusable. Passing i + 1 would forbid reuse (that's Combination Sum II).",
      },
      {
        q: "Why does passing a start index (instead of always looping from 0) avoid duplicate combinations?",
        options: [
          "It sorts the results",
          "It builds every combination in non-decreasing index order, so [2,3] is never also generated as [3,2]",
          "It reduces recursion depth",
          "It removes negative numbers",
        ],
        answer: "B",
        explanation:
          "Starting each recursion at the current index forbids going backward, so a given multiset of candidates is produced exactly once rather than in every possible order.",
      },
      {
        q: "After sorting candidates, what does `if (candidates[i] > remaining) break;` accomplish?",
        options: [
          "It skips just this one candidate",
          "It exits the whole loop, pruning this candidate and all larger ones at once",
          "It records a solution",
          "It resets remaining to the target",
        ],
        answer: "B",
        explanation:
          "Because the array is sorted, once a candidate exceeds the remaining target every later candidate does too — breaking prunes the entire remaining loop and all of its subtrees.",
      },
      {
        q: "How does Combination Sum II differ from Combination Sum in the recursion?",
        options: [
          "It sums to a different target",
          "It recurses with i + 1 (each number used once) and skips duplicates at the same level after sorting",
          "It disallows sorting",
          "It uses a bitmask instead of recursion",
        ],
        answer: "B",
        explanation:
          "Combination Sum II forbids reuse, so it recurses with i + 1; since the input may contain duplicates, it sorts and skips c[i] == c[i-1] at the same tree level to avoid duplicate combinations.",
      },
    ],
  },
];
