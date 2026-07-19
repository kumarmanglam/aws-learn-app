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
// SECTION: LangChain — Core & LCEL, Chains & Composition,
// Conversation Memory & History.
// AI-engineering fundamentals authored to the messaging.ts /
// frontend-core.ts bar. Cutoff Jan 2026; current LangChain LCEL
// idioms (| pipe, ChatPromptTemplate, Runnable). Latest Claude
// models: Opus 4.8 / Sonnet 5 / Haiku 4.5.
// ============================================================
import { svgDefs, type Topic } from "./shared";

const box = (
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  sub: string,
  color = "#10b981",
) => `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#243349" stroke="${color}"/>
  <text x="${x + w / 2}" y="${y + h / 2 - 2}" text-anchor="middle" fill="#e6edf3" font-size="12" font-weight="600">${title}</text>
  <text x="${x + w / 2}" y="${y + h / 2 + 15}" text-anchor="middle" fill="#8b949e" font-size="10">${sub}</text>
`;

export const aiLangchainTopics: Topic[] = [
  // -----------------------------------------------------------------
  {
    id: "ai-langchain-basics",
    title: "LangChain Core & LCEL",
    shortLabel: "LangChain Core",
    section: "LangChain",
    domain: "AI",
    tldr:
      "LangChain is a framework for building LLM apps from small, reusable pieces. Its core primitives are chat models (ChatAnthropic, ChatOpenAI), prompt templates (ChatPromptTemplate), and output parsers (StrOutputParser), all of which implement the Runnable interface. LCEL — the LangChain Expression Language — composes them with the pipe operator: `prompt | model | parser`, and every resulting chain gets .invoke, .stream, .batch, and async for free.",
    subtopics: [
      {
        heading: "The three core primitives",
        bullets: [
          { icon: "🤖", text: "**Chat model** — a provider-agnostic LLM wrapper (`ChatAnthropic(model=\"claude-sonnet-5\")`). Takes a list of messages, returns an **AIMessage**." },
          { icon: "📝", text: "**Prompt template** — `ChatPromptTemplate.from_messages([(\"system\", ...), (\"human\", \"{question}\")])` fills `{variables}` from a dict and outputs messages." },
          { icon: "🔧", text: "**Output parser** — `StrOutputParser` pulls the `.content` string out of the AIMessage; structured parsers coerce to JSON / Pydantic." },
        ],
      },
      {
        heading: "Runnables & LCEL",
        bullets: [
          { icon: "🧩", text: "Everything is a **Runnable** — a common interface with `.invoke()`, `.stream()`, `.batch()`, `.ainvoke()`, `.astream()`." },
          { icon: "➡️", text: "The **pipe `|`** composes runnables left-to-right: each step's **output feeds the next step's input** (`prompt | model | parser`)." },
          { icon: "😴", text: "Chains are **lazy** — building `prompt | model | parser` runs nothing; you must call `.invoke(input)` to execute." },
        ],
      },
      {
        heading: "Packages & structured output",
        bullets: [
          { icon: "📦", text: "**langchain-core** holds the base abstractions (LCEL, prompts, parsers, messages); providers live in their own packages (`langchain-anthropic`, `langchain-openai`)." },
          { icon: "🎯", text: "`model.with_structured_output(MyPydanticModel)` returns a **typed object** instead of raw text — uses tool calling under the hood." },
          { icon: "🌊", text: "Because every LCEL chain is a Runnable, **streaming and batching are automatic** — no extra code to token-stream a chain." },
        ],
      },
    ],
    keyFacts: [
      { label: "Compose with", value: "Pipe operator ( | )", icon: "➡️" },
      { label: "Common interface", value: "Runnable (.invoke/.stream)", icon: "🧩" },
      { label: "Base package", value: "langchain-core", icon: "📦" },
      { label: "Typed output", value: "with_structured_output()", icon: "🎯" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'Chain prompt → model → parser' → **LCEL pipe** `prompt | model | parser`.",
        "'Get a plain string, not an AIMessage' → **StrOutputParser**.",
        "'Guaranteed schema / typed fields' → **with_structured_output(PydanticModel)**.",
        "'Which package has LCEL & prompts?' → **langchain-core**.",
        "Chains are **lazy**: nothing runs until you call **.invoke()**.",
      ],
      analogyBrief:
        "LCEL is a Unix pipeline for AI: `prompt | model | parser` works like `cat | grep | wc`, each stage transforming and handing off to the next.",
    },
    explanation:
      "LangChain is a framework for developing applications powered by language models, built around the idea of composing small, reusable components rather than writing raw API calls and context-management code by hand. Its three foundational primitives are the chat model, the prompt template, and the output parser. A chat model is a provider-agnostic wrapper — for example ChatAnthropic(model=\"claude-sonnet-5\", temperature=0) or ChatOpenAI — that accepts a list of messages (SystemMessage, HumanMessage, AIMessage) and returns an AIMessage. A prompt template, most commonly ChatPromptTemplate.from_messages, declares roles and {variable} placeholders and, when invoked with a dict, produces the concrete list of messages to send. An output parser converts the model's reply into something more usable: StrOutputParser extracts the plain .content string from the returned AIMessage, while structured parsers coerce the output into JSON or a validated Pydantic object. The unifying abstraction is the Runnable interface: every one of these components — and every chain built from them — exposes the same methods (.invoke, .stream, .batch, and the async .ainvoke / .astream), so they can all be treated uniformly. LCEL, the LangChain Expression Language, uses the pipe operator to wire runnables together left to right, where each stage's output becomes the next stage's input, so the canonical chain reads simply as prompt | model | parser. A crucial property is laziness: constructing that pipeline does not call the model — it merely describes the computation — and nothing happens until you call .invoke(input) (passing a dict whose keys match the template variables), .batch([...]) for many inputs, or .stream(...) to receive tokens as they are generated. Because a chain is itself a Runnable, streaming, batching, and async execution come for free without any extra plumbing. The library is deliberately split into packages: langchain-core contains the base abstractions (LCEL, prompt templates, output parsers, message types, and the Runnable protocol), the higher-level langchain package adds chains, agents, and retrieval, and each model provider ships in its own package such as langchain-anthropic or langchain-openai. Finally, when you need machine-readable results, model.with_structured_output(MyPydanticModel) instructs the model (via tool calling or constrained generation) to return an instance of your schema, giving you typed, validated fields instead of a raw string you would otherwise have to parse and check yourself.",
    analogy:
      "LangChain's LCEL is a Unix pipeline for AI. In the shell you write `cat log.txt | grep ERROR | wc -l`, and each command consumes the previous command's output and passes its own along. LCEL does exactly this with AI stages: `prompt | model | parser` means the prompt renders your variables into messages, the model turns those messages into a reply, and the parser strips that reply down to a clean string. And just as typing a shell pipeline into a script file doesn't run it until you execute the script, building an LCEL chain doesn't call the model until you invoke it. The Runnable interface is the common 'stdin/stdout contract' that lets any stage plug into any other.",
    diagram: `<svg viewBox="0 0 720 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="LCEL pipeline: prompt piped to model piped to parser">${svgDefs}
      <text x="360" y="26" text-anchor="middle" fill="#e6edf3" font-size="14" font-weight="700">LCEL chain = prompt | model | parser</text>
      ${box(30, 60, 130, 55, "input dict", "{question: ...}", "#8b949e")}
      <line x1="160" y1="87" x2="198" y2="87" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(200, 55, 130, 65, "ChatPrompt", "renders messages", "#3b82f6")}
      <text x="345" y="82" fill="#f0883e" font-size="18" font-weight="700">|</text>
      <line x1="330" y1="87" x2="358" y2="87" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(360, 55, 130, 65, "Chat Model", "→ AIMessage", "#10b981")}
      <text x="505" y="82" fill="#f0883e" font-size="18" font-weight="700">|</text>
      <line x1="490" y1="87" x2="518" y2="87" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(520, 55, 170, 65, "StrOutputParser", "→ plain string", "#8b5cf6")}
      <rect x="30" y="150" width="660" height="60" rx="10" fill="#161b22" stroke="#f59e0b"/>
      <text x="48" y="173" fill="#f59e0b" font-size="12" font-weight="700">Every LCEL chain is a Runnable →</text>
      <text x="300" y="173" fill="#8b949e" font-size="11">.invoke()   .stream()   .batch()   .ainvoke()   .astream()</text>
      <text x="48" y="196" fill="#8b949e" font-size="10">Chains are lazy: building the pipe runs nothing; call .invoke(dict) to execute.</text>
    </svg>`,
    diagramLegend: [
      { color: "#3b82f6", label: "Prompt template", description: "Fills {variables} from a dict → list of messages." },
      { color: "#10b981", label: "Chat model", description: "Provider wrapper; returns an AIMessage." },
      { color: "#8b5cf6", label: "Output parser", description: "StrOutputParser extracts the .content string." },
    ],
    codeExample: {
      language: "python",
      title: "The canonical LCEL chain: prompt | model | parser",
      code: `from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

model = ChatAnthropic(model="claude-sonnet-5", temperature=0)

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an expert in {domain}. Answer concisely."),
    ("human", "{question}"),
])

# Compose with the pipe operator (LCEL). Nothing runs yet — chains are lazy.
chain = prompt | model | StrOutputParser()

# Execute by calling .invoke() with a dict matching the template variables
result = chain.invoke({"domain": "Python", "question": "What is a decorator?"})
print(result)  # a plain string, not an AIMessage`,
    },
    codeExamples: [
      {
        language: "python",
        tab: "Basic chain",
        title: "prompt | model | parser and how to run it",
        code: `from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

model = ChatAnthropic(model="claude-sonnet-5", temperature=0)

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an expert in {domain}. Give concise, practical answers."),
    ("human", "{question}"),
])

chain = prompt | model | StrOutputParser()

# Single invocation — pass a dict (keys must match the {variables})
print(chain.invoke({"domain": "Docker", "question": "What is layer caching?"}))

# Batch many inputs at once
answers = chain.batch([
    {"domain": "Git", "question": "rebase vs merge?"},
    {"domain": "HTTP", "question": "what is idempotency?"},
])
for a in answers:
    print("---", a[:80])`,
      },
      {
        language: "python",
        tab: "Streaming",
        title: "Token-by-token streaming comes for free",
        code: `from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

model = ChatAnthropic(model="claude-haiku-4-5", temperature=0)
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a concise tutor."),
    ("human", "{question}"),
])
chain = prompt | model | StrOutputParser()

# Because the chain is a Runnable, .stream() yields string chunks as
# they are generated — no extra wiring needed.
for chunk in chain.stream({"question": "Explain the GIL in one paragraph."}):
    print(chunk, end="", flush=True)

# Async variants also exist: await chain.ainvoke(...) / async for ... chain.astream(...)`,
      },
      {
        language: "python",
        tab: "Structured output",
        title: "Typed results with with_structured_output",
        code: `from langchain_anthropic import ChatAnthropic
from pydantic import BaseModel, Field

class CodeReview(BaseModel):
    issues: list[str] = Field(description="Problems found in the code")
    score: int = Field(description="Quality score from 1 to 10")
    suggestion: str = Field(description="Top improvement to make")

model = ChatAnthropic(model="claude-sonnet-5", temperature=0)

# The model is coerced (via tool calling) to return a CodeReview instance
structured = model.with_structured_output(CodeReview)

review = structured.invoke(
    "Review this code: data = [x for x in range(1000000)]; print(sum(data))"
)
print(review.score)        # typed int, e.g. 7
print(review.issues)       # typed list[str]
print(review.suggestion)   # typed str`,
      },
    ],
    problemStatement:
      "Your team keeps rewriting the same boilerplate: build a message list by hand, call the Anthropic SDK, then string-index into the response object, and repeat all of it whenever you switch to another provider or need streaming. You are asked to (1) express a reusable 'domain expert Q&A' step as a single composable object, (2) make it stream tokens to a web client and also run 50 questions in one batch call, and (3) return a validated schema (issues, score, suggestion) for a code-review feature instead of parsing free text. Explain which LangChain primitives and which LCEL idioms solve each part, and why building the chain doesn't itself call the model.",
    questions: [
      {
        q: "In LCEL, what does the pipe `|` operator do?",
        options: [
          "A. Runs the wrapped components concurrently on the same input and merges their outputs",
          "B. Chains components sequentially — the output of the left becomes the input of the right",
          "C. Creates a conditional branch that routes the input to one of several sub-chains",
          "D. Spawns a separate OS subprocess to run each component in isolation from the others",
        ],
        answer: "B",
        explanation:
          "Composing runnables left to right feeds each stage's output into the next, so `prompt | model | parser` sends the prompt's messages to the model and the model's reply on to the parser. Sequential piping is neither concurrent execution, conditional routing, nor process spawning.",
      },
      {
        q: "What does `StrOutputParser()` produce from a chat model's response?",
        options: [
          "A. A JSON object parsed from the model's reply",
          "B. The plain `.content` string extracted from the AIMessage",
          "C. A validated Pydantic model built from the reply",
          "D. The raw HTTP response bytes from the provider API",
        ],
        answer: "B",
        explanation:
          "Pulling the text content out of the AIMessage yields a plain string rather than the full message object. A JSON object or a validated Pydantic instance comes from structured parsers or with_structured_output, and the transport-level bytes are never surfaced here.",
      },
      {
        q: "You build `chain = prompt | model | parser` but no API call happens. Why?",
        options: [
          "A. The model object was misconfigured, so construction fails silently until fixed",
          "B. LCEL chains are lazy — composing describes the computation; you must call .invoke() (or .stream()/.batch()) to run it",
          "C. StrOutputParser blocks execution until an explicit flush call releases the pipeline",
          "D. The langchain-core import is missing, so the pipe operator has no implementation",
        ],
        answer: "B",
        explanation:
          "Constructing the pipe only builds a Runnable that describes the computation; nothing executes until you call .invoke(input), .stream(input), or .batch([...]). That laziness is by design — not a broken model, a blocking parser, or a missing import.",
      },
      {
        q: "Which package contains the base abstractions like LCEL, prompt templates, and the Runnable interface?",
        options: ["A. langchain", "B. langchain-community", "C. langchain-core", "D. langgraph"],
        answer: "C",
        explanation:
          "The foundational primitives — Runnable, LCEL, prompts, parsers, and message types — live in langchain-core. The higher-level langchain package adds chains and agents, community integrations sit in langchain-community, and langgraph is a separate library for stateful multi-actor graphs.",
      },
      {
        q: "What is the advantage of `model.with_structured_output(MyModel)` over parsing free-form text?",
        options: [
          "A. It always costs fewer tokens than parsing the equivalent free-form reply",
          "B. It returns a typed, schema-validated object (via tool calling) instead of a raw string you must parse yourself",
          "C. It resolves the answer from the schema locally and skips calling the model",
          "D. It disables token streaming, forcing the full object to arrive in one response",
        ],
        answer: "B",
        explanation:
          "Constraining the model — typically through tool calling — makes it return an instance of your Pydantic schema, giving typed, validated fields instead of a string you parse by hand. It still calls the model, makes no promise about token cost, and does not turn streaming off.",
      },
      {
        q: "How do you invoke a chain whose prompt has `{domain}` and `{question}` placeholders?",
        options: [
          "A. chain.invoke(\"my question\")",
          "B. chain.invoke({\"domain\": \"Python\", \"question\": \"What is X?\"})",
          "C. chain.run(domain, question)",
          "D. chain(domain=\"Python\")",
        ],
        answer: "B",
        explanation:
          "B is correct: pass a dict whose keys match the template variables. A bare string won't fill named placeholders, and .run(...) / calling the chain like a function are not the LCEL invocation API.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "ai-langchain-chains",
    title: "Chains & Composition",
    shortLabel: "Chains & Composition",
    section: "LangChain",
    domain: "AI",
    tldr:
      "Beyond a linear `a | b | c`, LCEL composes richer graphs. RunnableSequence is what the pipe builds; RunnableParallel (a dict of runnables) runs branches concurrently; RunnableLambda wraps a plain function; RunnablePassthrough.assign adds keys while forwarding the rest. For reliability, `.with_fallbacks([backup])` retries on failure and `.with_retry()` re-attempts transient errors — the backbone of production multi-step pipelines.",
    subtopics: [
      {
        heading: "Sequence, parallel, lambda, passthrough",
        bullets: [
          { icon: "🔗", text: "**RunnableSequence** is what `a | b | c` builds — steps run in order, output → input. You can also write it explicitly as `RunnableSequence(a, b, c)`." },
          { icon: "🍴", text: "**RunnableParallel** (or a plain `{...}` dict of runnables) runs branches **concurrently** on the same input and returns a **dict** of their results." },
          { icon: "🧮", text: "**RunnableLambda** wraps a normal Python function so it becomes a Runnable you can drop into the pipe (`RunnableLambda(format_docs)`)." },
        ],
      },
      {
        heading: "Passthrough & assign",
        bullets: [
          { icon: "🎫", text: "**RunnablePassthrough** forwards its input unchanged — used to keep the original question while another branch computes context." },
          { icon: "➕", text: "**RunnablePassthrough.assign(key=runnable)** adds a new key computed from the current input while **passing everything else through** — ideal for enriching a dict mid-chain." },
          { icon: "🧭", text: "**RunnableBranch** routes to different sub-chains by condition (first match wins), with a default — a chain-level 'if/elif/else'." },
        ],
      },
      {
        heading: "Error handling & reliability",
        bullets: [
          { icon: "🪂", text: "**`.with_fallbacks([backup])`** tries the primary and, only if it **raises**, calls the fallback(s) — e.g. Claude Sonnet 5 → Claude Haiku 4.5 → cached answer." },
          { icon: "🔁", text: "**`.with_retry(stop_after_attempt=3)`** re-runs a runnable on transient errors (rate limits, timeouts) with backoff." },
          { icon: "⚠️", text: "Fallbacks and parallel branches must be **independent** — a RunnableParallel branch can't depend on another branch's output; use `|` for dependencies." },
        ],
      },
    ],
    keyFacts: [
      { label: "Pipe builds", value: "RunnableSequence", icon: "🔗" },
      { label: "Concurrent branches", value: "RunnableParallel (dict)", icon: "🍴" },
      { label: "On failure", value: ".with_fallbacks([...])", icon: "🪂" },
      { label: "Transient errors", value: ".with_retry()", icon: "🔁" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'Run several analyses on the same input at once' → **RunnableParallel** (returns a dict).",
        "'Drop a plain Python function into a chain' → **RunnableLambda**.",
        "'Keep the original input while adding a computed field' → **RunnablePassthrough.assign(...)**.",
        "'Use a backup model if the primary errors' → **.with_fallbacks([backup])**.",
        "'Retry on rate limits/timeouts' → **.with_retry()**. Parallel branches must be independent.",
      ],
      analogyBrief:
        "Composition is an assembly line with branches: a splitter sends the part to three stations at once (parallel), a jig holds the original alongside a new measurement (assign), and a backup machine takes over if the primary jams (fallbacks).",
    },
    explanation:
      "Most real LLM applications are not a single call but a pipeline of several steps, and LCEL provides composition primitives that go well beyond the linear a | b | c. Under the hood the pipe operator builds a RunnableSequence — an ordered list of runnables where each step's output is the next step's input — and you can construct one explicitly as RunnableSequence(a, b, c) if you prefer. To do work concurrently, RunnableParallel (which a plain Python dict of runnables is automatically coerced into) runs each branch on the same input at the same time and returns a dict keyed by the branch names; this is how you fan a document out to a summary chain, a sentiment chain, and a topics chain simultaneously. RunnableLambda wraps an ordinary Python function so it satisfies the Runnable interface and can be inserted anywhere in the pipe — for example a format_docs function that turns retrieved documents into a context string. RunnablePassthrough simply forwards its input unchanged, which matters in patterns where you must carry the user's original question forward while a sibling branch computes something derived from it; and RunnablePassthrough.assign(key=some_runnable) is the refinement that adds a new key computed from the current input while passing all existing keys through untouched, letting you progressively enrich a dictionary as it flows down the chain. For control flow, RunnableBranch behaves like a chain-level if/elif/else: you give it (condition, runnable) pairs plus a default, and the first matching condition wins. Reliability comes from two composable wrappers. .with_fallbacks([backup, ...]) creates a runnable that attempts the primary and, only if the primary raises an exception (a rate limit, an API error, a timeout), transparently falls back to the next option in order — a common production pattern is a primary model such as Claude Sonnet 5 falling back to a cheaper Claude Haiku 4.5 and finally to a cached response. .with_retry(stop_after_attempt=3) instead re-attempts the same runnable on transient failures, typically with exponential backoff, which is the right tool for flaky-but-recoverable errors like throttling. A key constraint to remember is independence: the branches of a RunnableParallel run concurrently and therefore cannot depend on one another's output — if step B needs step A's result, they must be chained sequentially with the pipe rather than placed side by side in a parallel block. Together these primitives let you assemble branching, enriching, fault-tolerant graphs while keeping the uniform Runnable interface, so the whole composite still supports invoke, stream, batch, and async.",
    analogy:
      "Think of a factory assembly line. The plain pipe `|` is a straight conveyor: each station finishes and hands the part to the next (RunnableSequence). A RunnableParallel is a splitter that photocopies the part and sends it to three stations at once — quality check, paint, and weighing — then collects their three reports into one tray (the result dict). RunnableLambda is a custom hand-built jig you bolt onto the line to do one bespoke transformation. RunnablePassthrough.assign is a fixture that keeps the original part on the belt while stamping a new measurement label onto its tray, so nothing already there is lost. And .with_fallbacks is the backup machine wired in behind the primary: if the primary jams (throws), the backup silently takes over so the line never stops — .with_retry is simply telling a single flaky machine to try the same part again a couple of times before giving up.",
    diagram: `<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="LCEL composition: sequence, parallel, and fallbacks">${svgDefs}
      <text x="360" y="24" text-anchor="middle" fill="#e6edf3" font-size="14" font-weight="700">Composition primitives</text>
      <text x="30" y="52" fill="#3b82f6" font-size="12" font-weight="700">RunnableParallel — concurrent branches on one input</text>
      ${box(30, 62, 110, 45, "input", "shared", "#8b949e")}
      <line x1="140" y1="84" x2="188" y2="66" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
      <line x1="140" y1="84" x2="188" y2="84" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
      <line x1="140" y1="84" x2="188" y2="102" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
      ${box(190, 48, 150, 32, "summary_chain", "", "#10b981")}
      ${box(190, 86, 150, 32, "sentiment_chain", "", "#f59e0b")}
      ${box(190, 124, 150, 32, "topics_chain", "", "#8b5cf6")}
      <line x1="340" y1="66" x2="388" y2="100" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
      <line x1="340" y1="102" x2="388" y2="102" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
      <line x1="340" y1="140" x2="388" y2="104" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
      ${box(390, 84, 150, 40, "result dict", "{summary,sentiment,topics}", "#3b82f6")}
      <line x1="30" y1="180" x2="690" y2="180" stroke="#30363d" stroke-width="1"/>
      <text x="30" y="205" fill="#e11d8f" font-size="12" font-weight="700">.with_fallbacks — try primary, on error use backup</text>
      ${box(30, 215, 150, 45, "Claude Sonnet 5", "primary", "#10b981")}
      <text x="195" y="240" fill="#f85149" font-size="11" font-weight="700">raises?</text>
      <line x1="180" y1="237" x2="255" y2="237" stroke="#f85149" stroke-width="1.5" marker-end="url(#arrow-mute)"/>
      ${box(260, 215, 150, 45, "Claude Haiku 4.5", "fallback", "#3b82f6")}
      <text x="425" y="240" fill="#f85149" font-size="11" font-weight="700">raises?</text>
      <line x1="410" y1="237" x2="485" y2="237" stroke="#f85149" stroke-width="1.5" marker-end="url(#arrow-mute)"/>
      ${box(490, 215, 150, 45, "cached answer", "last resort", "#f59e0b")}
    </svg>`,
    diagramLegend: [
      { color: "#3b82f6", label: "RunnableParallel", description: "Branches run concurrently; results collected into a dict." },
      { color: "#10b981", label: "Primary runnable", description: "Attempted first inside .with_fallbacks." },
      { color: "#f59e0b", label: "Fallback path", description: "Used only when the previous option raises an exception." },
    ],
    codeExample: {
      language: "python",
      title: "RunnableSequence with fallbacks, parallel branches, and a lambda",
      code: `from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableParallel, RunnableLambda

# Primary model, with a cheaper fallback if it raises (rate limit / error)
primary = ChatAnthropic(model="claude-sonnet-5", temperature=0)
model = primary.with_fallbacks(
    [ChatAnthropic(model="claude-haiku-4-5", temperature=0)]
)
parser = StrOutputParser()

def p(system):
    return ChatPromptTemplate.from_messages([("system", system), ("human", "{text}")])

# Three independent analyses run concurrently on the same input
analysis = RunnableParallel(
    summary=p("Summarize in two sentences.") | model | parser,
    sentiment=p("Reply with one word: positive, negative, or neutral.") | model | parser,
    topics=p("List the 3 main topics as bullets.") | model | parser,
)

# A plain function, wrapped as a Runnable, assembles the final report
def format_report(r: dict) -> str:
    return f"Summary: {r['summary']}\\nSentiment: {r['sentiment']}\\nTopics:\\n{r['topics']}"

chain = analysis | RunnableLambda(format_report)

print(chain.invoke({"text": "Python 3.13 improves the interpreter and error messages."}))`,
    },
    codeExamples: [
      {
        language: "python",
        tab: "Fallbacks & retry",
        title: "Reliability: fallbacks for errors, retry for transient failures",
        code: `from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

primary = ChatAnthropic(model="claude-sonnet-5", temperature=0)
backup = ChatAnthropic(model="claude-haiku-4-5", temperature=0)

# 1) Fallbacks: if the primary RAISES (rate limit, API error), try the backup.
model = primary.with_fallbacks([backup])

# 2) Retry: re-attempt transient failures (throttling, timeouts) with backoff.
robust_model = model.with_retry(stop_after_attempt=3)

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are concise."),
    ("human", "{question}"),
])
chain = prompt | robust_model | StrOutputParser()

print(chain.invoke({"question": "Explain composition over inheritance."}))`,
      },
      {
        language: "python",
        tab: "assign / passthrough",
        title: "RunnablePassthrough.assign enriches a dict mid-chain",
        code: `from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

model = ChatAnthropic(model="claude-sonnet-5", temperature=0)

def retrieve_context(inputs: dict) -> str:
    # Pretend this hits a vector store using inputs["question"]
    return "FastAPI runs sync handlers in a thread pool automatically."

answer_prompt = ChatPromptTemplate.from_messages([
    ("system", "Answer ONLY from the context.\\n\\nContext:\\n{context}"),
    ("human", "{question}"),
])

# .assign adds "context" computed from the input, but KEEPS "question" too.
chain = (
    RunnablePassthrough.assign(context=lambda x: retrieve_context(x))
    | answer_prompt
    | model
    | StrOutputParser()
)

print(chain.invoke({"question": "How does FastAPI handle sync endpoints?"}))`,
      },
      {
        language: "python",
        tab: "Branching",
        title: "RunnableBranch routes like if/elif/else",
        code: `from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableBranch

model = ChatAnthropic(model="claude-sonnet-5", temperature=0)
parser = StrOutputParser()

def chain_for(system):
    return ChatPromptTemplate.from_messages(
        [("system", system), ("human", "{content}")]
    ) | model | parser

code_chain = chain_for("You are a senior code reviewer.")
bug_chain = chain_for("You are a debugging expert; propose a fix.")
general_chain = chain_for("You are a helpful assistant.")

# First matching condition wins; last argument is the default.
router = RunnableBranch(
    (lambda x: "review" in x["topic"].lower(), code_chain),
    (lambda x: "bug" in x["topic"].lower(), bug_chain),
    general_chain,
)

print(router.invoke({"topic": "bug", "content": "IndexError on empty list access."}))`,
      },
    ],
    problemStatement:
      "A support-triage service must, for each incoming ticket, produce three things at once — a one-line summary, a sentiment label, and a category — then assemble them into a single record. It must stay up when the primary model is throttled, so a cheaper model should take over automatically, and truly transient errors should be retried a few times before failing. Finally, a separate endpoint should route 'bug' tickets to a debugging prompt and everything else to a general prompt. Describe which LCEL composition primitives implement the concurrent analyses, the automatic model failover versus the retry-on-throttle behavior, the assembly step, and the routing — and note the one dependency rule that forbids putting mutually-dependent steps in a parallel block.",
    questions: [
      {
        q: "What does the pipe operator build under the hood when you write `a | b | c`?",
        options: [
          "A. A RunnableParallel",
          "B. A RunnableSequence (steps run in order, output → input)",
          "C. A RunnableBranch",
          "D. A RunnableLambda",
        ],
        answer: "B",
        explanation:
          "B is correct: the pipe composes a RunnableSequence, an ordered list where each step's output feeds the next. RunnableParallel is for concurrent branches, RunnableBranch for conditional routing, RunnableLambda for wrapping functions.",
      },
      {
        q: "What does `RunnableParallel` (or a plain dict of runnables) do?",
        options: [
          "A. Runs the runnables in sequence",
          "B. Executes multiple runnables concurrently on the same input and returns a dict of their results",
          "C. Picks the fastest runnable and discards the rest",
          "D. Retries a single runnable in parallel threads",
        ],
        answer: "B",
        explanation:
          "B is correct: RunnableParallel runs each branch concurrently on the same input and returns a dictionary keyed by branch name. A bare dict of runnables is auto-coerced into a RunnableParallel.",
      },
      {
        q: "What is the effect of `model.with_fallbacks([backup])`?",
        options: [
          "A. It merges the outputs of both models",
          "B. It runs both models and averages the answers",
          "C. It uses the backup only if the primary raises an exception",
          "D. It always uses whichever model is cheaper",
        ],
        answer: "C",
        explanation:
          "C is correct: with_fallbacks tries the primary first and only invokes the backup(s) when the primary raises (rate limit, error, timeout). It does not merge, average, or price-compare outputs.",
      },
      {
        q: "You need to add a computed `context` key to a dict flowing through a chain while keeping the original `question`. Which primitive fits best?",
        options: [
          "A. RunnableBranch",
          "B. RunnablePassthrough.assign(context=...)",
          "C. RunnableParallel with only one branch",
          "D. StrOutputParser",
        ],
        answer: "B",
        explanation:
          "B is correct: RunnablePassthrough.assign adds a new key computed from the current input while passing all existing keys (including question) through unchanged. Branch is for routing; a parser doesn't enrich dicts.",
      },
      {
        q: "Which statement about the branches of a RunnableParallel is TRUE?",
        options: [
          "A. Each branch can read the output of the other branches",
          "B. Branches run concurrently, so a branch cannot depend on another branch's output",
          "C. Branches always run strictly in the order listed",
          "D. Only one branch actually executes",
        ],
        answer: "B",
        explanation:
          "B is correct: parallel branches all receive the same input and run concurrently, so they must be independent. If one step needs another's result, chain them sequentially with the pipe instead.",
      },
      {
        q: "For an operation that fails intermittently due to rate limiting, which wrapper is the right choice?",
        options: [
          "A. .with_retry(stop_after_attempt=3)",
          "B. RunnableLambda",
          "C. RunnableParallel",
          "D. StrOutputParser",
        ],
        answer: "A",
        explanation:
          "A is correct: .with_retry re-attempts the same runnable on transient errors (throttling, timeouts), typically with backoff. Fallbacks switch to a different runnable; the others don't add retry behavior.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "ai-langchain-memory",
    title: "Conversation Memory & History",
    shortLabel: "Memory & History",
    section: "LangChain",
    domain: "AI",
    tldr:
      "LLMs are stateless — each call forgets the last. LangChain adds memory by storing a per-session message history and injecting it into the prompt via a MessagesPlaceholder. The modern pattern wraps any chain in RunnableWithMessageHistory with a get_session_history(session_id) function; swap InMemoryChatMessageHistory for Redis/Postgres to persist. Long chats are kept in-budget with trim_messages (sliding window) or summarization.",
    subtopics: [
      {
        heading: "Why memory is needed",
        bullets: [
          { icon: "🧠", text: "Chat models are **stateless** — a call only sees the messages you send; nothing is remembered between calls by default." },
          { icon: "🪟", text: "Memory means **reading** prior turns into the prompt before the call and **writing** the new turn back afterward." },
          { icon: "📍", text: "History is scoped by a **session_id** so different users/conversations stay isolated." },
        ],
      },
      {
        heading: "The RunnableWithMessageHistory pattern",
        bullets: [
          { icon: "🔌", text: "Add a **MessagesPlaceholder** (`(\"placeholder\", \"{history}\")`) to the prompt where prior turns should be injected." },
          { icon: "🗂️", text: "Provide **get_session_history(session_id)** returning a history object; wrap the chain in **RunnableWithMessageHistory** with `input_messages_key` and `history_messages_key`." },
          { icon: "🆔", text: "Invoke with a **config**: `{\"configurable\": {\"session_id\": \"user-123\"}}` — the wrapper auto-loads and auto-saves that session's turns." },
        ],
      },
      {
        heading: "Persistence & keeping it in budget",
        bullets: [
          { icon: "💾", text: "Swap **InMemoryChatMessageHistory** for **RedisChatMessageHistory** / SQL-backed history so context survives process restarts." },
          { icon: "✂️", text: "**trim_messages** keeps a **sliding window** (e.g. last N tokens, strategy=\"last\", include_system=True) so you never exceed the context window." },
          { icon: "📜", text: "For very long chats, **summarize** older turns into a running summary and keep only recent messages verbatim." },
        ],
      },
    ],
    keyFacts: [
      { label: "Model state", value: "Stateless by default", icon: "🧠" },
      { label: "Modern wrapper", value: "RunnableWithMessageHistory", icon: "🔌" },
      { label: "Scope key", value: "session_id (in config)", icon: "🆔" },
      { label: "Stay in budget", value: "trim_messages / summarize", icon: "✂️" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'Chatbot must remember earlier turns' → **RunnableWithMessageHistory** + a **MessagesPlaceholder**.",
        "'Keep users separate' → history keyed by **session_id** in the invoke **config**.",
        "'Survive restarts' → **RedisChatMessageHistory** / SQL-backed history.",
        "'Conversation too long for the context window' → **trim_messages** (sliding window) or **summarize**.",
        "Models are **stateless**: you must inject history each call.",
      ],
      analogyBrief:
        "Memory is a notebook the assistant reads at the start of each meeting and jots the new notes into at the end; the session_id is which client's notebook, and trimming is tearing out old pages so it stays pocket-sized.",
    },
    explanation:
      "Chat models are fundamentally stateless: each API call only sees the messages you include in that request, and by default nothing carries over from one call to the next, so a naive chatbot would forget the user's name the instant it answered. Conversation memory solves this by doing two things around every turn — reading the accumulated history into the prompt before calling the model, and writing the new human message and the model's reply back into storage afterward — so the next call can see everything that came before. Because many users talk to the same app simultaneously, history is partitioned by a session_id, which keeps each conversation isolated. The modern, recommended way to add this in LangChain is to (1) put a MessagesPlaceholder in your prompt where prior turns should be inserted, written as the tuple (\"placeholder\", \"{history}\") in ChatPromptTemplate.from_messages, (2) define a get_session_history(session_id) function that returns a chat-history object for that id (creating one if needed), and (3) wrap your existing chain in RunnableWithMessageHistory, telling it which input key holds the new user message (input_messages_key) and which prompt variable holds the history (history_messages_key). You then invoke the wrapped chain with a config argument such as {\"configurable\": {\"session_id\": \"user-123\"}}, and the wrapper automatically loads that session's messages into the placeholder before the call and appends the new exchange afterward — you never manage the history list by hand. For a quick start the history object can be an InMemoryChatMessageHistory, but that is lost when the process restarts; swapping in a RedisChatMessageHistory (or a SQL/Postgres-backed history) persists the conversation across restarts and lets multiple server instances share it, all with the same wrapper code. The other essential concern is the context window: conversations grow without bound, so you must keep them within the model's token limit. trim_messages implements a sliding window — for example keeping the most recent messages up to a token budget with strategy=\"last\" and include_system=True so the system prompt is always retained — and you place it before the prompt in the chain. For conversations that must retain long-range information without keeping every token, the summarization approach condenses older turns into a running summary message and keeps only the most recent turns verbatim, trading some fidelity for a bounded, affordable prompt.",
    analogy:
      "A LangChain-powered assistant is like a consultant who genuinely forgets everything the moment a meeting ends — literally stateless. To give them continuity you hand them a notebook: at the start of each meeting they read the notebook (history injected via the MessagesPlaceholder) so they know what was agreed last time, and at the end they jot down what just happened (the new turn written back). The session_id is which client's notebook they pull off the shelf, so Alice's notes never leak into Bob's meeting. Keeping the notebook in a locked filing cabinet instead of the consultant's own pocket is persistence (Redis/Postgres) — it survives even if the consultant quits and a new one takes over. And because a notebook can't be infinitely thick, trimming is tearing out the oldest pages to keep it pocket-sized, while summarization is replacing a stack of old pages with a single 'previously agreed' summary sheet.",
    diagram: `<svg viewBox="0 0 720 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="RunnableWithMessageHistory reads and writes per-session history around a chain">${svgDefs}
      <text x="360" y="24" text-anchor="middle" fill="#e6edf3" font-size="14" font-weight="700">RunnableWithMessageHistory (session_id = user-123)</text>
      ${box(30, 60, 120, 45, "new input", "\"What's my name?\"", "#8b949e")}
      <line x1="150" y1="82" x2="198" y2="82" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(200, 50, 150, 65, "prompt + history", "MessagesPlaceholder", "#3b82f6")}
      <line x1="350" y1="82" x2="398" y2="82" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(400, 50, 130, 65, "Chat Model", "→ AIMessage", "#10b981")}
      <line x1="530" y1="82" x2="578" y2="82" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(580, 60, 120, 45, "reply", "to user", "#8b5cf6")}
      ${box(250, 175, 220, 55, "Session history store", "InMemory / Redis / SQL", "#e11d8f")}
      <line x1="300" y1="175" x2="270" y2="118" stroke="#22c55e" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="150" y="150" fill="#22c55e" font-size="10">read history in →</text>
      <line x1="450" y1="118" x2="430" y2="173" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="470" y="150" fill="#f59e0b" font-size="10">← write new turn</text>
      <text x="360" y="258" text-anchor="middle" fill="#8b949e" font-size="10">trim_messages / summarize keeps the injected history within the context window.</text>
    </svg>`,
    diagramLegend: [
      { color: "#3b82f6", label: "Prompt + placeholder", description: "MessagesPlaceholder is where prior turns are injected." },
      { color: "#e11d8f", label: "History store", description: "Per-session_id; InMemory (volatile) or Redis/SQL (persistent)." },
      { color: "#f59e0b", label: "Write-back", description: "The wrapper appends the new human + AI turn after each call." },
    ],
    codeExample: {
      language: "python",
      title: "RunnableWithMessageHistory — a chain that remembers per session",
      code: `from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory

model = ChatAnthropic(model="claude-sonnet-5", temperature=0)

# The placeholder is where prior turns get injected.
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant."),
    MessagesPlaceholder(variable_name="history"),
    ("human", "{input}"),
])
chain = prompt | model | StrOutputParser()

store = {}  # session_id -> history

def get_session_history(session_id: str):
    if session_id not in store:
        store[session_id] = InMemoryChatMessageHistory()
    return store[session_id]

with_memory = RunnableWithMessageHistory(
    chain,
    get_session_history,
    input_messages_key="input",
    history_messages_key="history",
)

config = {"configurable": {"session_id": "user-123"}}
print(with_memory.invoke({"input": "My name is Alice."}, config=config))
print(with_memory.invoke({"input": "What is my name?"}, config=config))
# -> "Your name is Alice." (history was auto-loaded and auto-saved)`,
    },
    codeExamples: [
      {
        language: "python",
        tab: "Per-session memory",
        title: "Isolated conversations keyed by session_id",
        code: `from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory

model = ChatAnthropic(model="claude-sonnet-5", temperature=0)
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant."),
    MessagesPlaceholder("history"),
    ("human", "{input}"),
])
chain = prompt | model | StrOutputParser()

store = {}
def get_session_history(session_id: str):
    return store.setdefault(session_id, InMemoryChatMessageHistory())

bot = RunnableWithMessageHistory(
    chain, get_session_history,
    input_messages_key="input", history_messages_key="history",
)

alice = {"configurable": {"session_id": "alice"}}
bob = {"configurable": {"session_id": "bob"}}

bot.invoke({"input": "My favorite language is Rust."}, config=alice)
bot.invoke({"input": "My favorite language is Go."}, config=bob)

print(bot.invoke({"input": "What's my favorite language?"}, config=alice))  # Rust
print(bot.invoke({"input": "What's my favorite language?"}, config=bob))    # Go`,
      },
      {
        language: "python",
        tab: "Persistent (Redis)",
        title: "Swap in Redis so history survives restarts",
        code: `from langchain_community.chat_message_histories import RedisChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory

# Same wrapper, but the history object is backed by Redis.
def get_session_history(session_id: str):
    return RedisChatMessageHistory(
        session_id=session_id,
        url="redis://localhost:6379",
    )

with_memory = RunnableWithMessageHistory(
    chain,                       # any LCEL chain with a {history} placeholder
    get_session_history,
    input_messages_key="input",
    history_messages_key="history",
)

# History now persists across process restarts and is shared across
# multiple server instances pointing at the same Redis.
config = {"configurable": {"session_id": "user-123"}}
with_memory.invoke({"input": "Remember: my order id is 4471."}, config=config)
# ... later, even after a restart ...
print(with_memory.invoke({"input": "What was my order id?"}, config=config))`,
      },
      {
        language: "python",
        tab: "Trim / window",
        title: "Keep the conversation inside the context window",
        code: `from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import trim_messages

model = ChatAnthropic(model="claude-sonnet-5", temperature=0)

# Sliding window: keep the most recent messages up to a token budget,
# always retaining the system message.
trimmer = trim_messages(
    max_tokens=2000,
    strategy="last",        # keep the most recent turns
    token_counter=model,    # use the model's tokenizer to count
    include_system=True,    # never drop the system prompt
    start_on="human",       # keep a valid human/AI alternation
)

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are concise."),
    MessagesPlaceholder("history"),
    ("human", "{input}"),
])

# Trim the injected history before it reaches the prompt.
chain = (
    {"history": lambda x: trimmer.invoke(x["history"]), "input": lambda x: x["input"]}
    | prompt
    | model
    | StrOutputParser()
)`,
      },
    ],
    problemStatement:
      "You are building a customer-support chatbot. It must remember earlier turns within a conversation (so 'ship it to the same address' works), keep each customer's conversation isolated, and survive server restarts and horizontal scaling across several instances. Long sessions also start blowing past the model's context window and costing too much. Describe the LangChain pattern that injects and persists per-session history without hand-managing the message list, how conversations are isolated, what you change to make history durable and shared, and the two techniques for keeping a long conversation within the context budget.",
    questions: [
      {
        q: "Why do chat models need an explicit memory mechanism?",
        options: [
          "A. Because they cache responses on disk",
          "B. Because they are stateless — each call only sees the messages you send, remembering nothing between calls",
          "C. Because the API forbids sending prior messages",
          "D. Because temperature must change each turn",
        ],
        answer: "B",
        explanation:
          "B is correct: chat models are stateless, so unless you inject prior turns into the prompt each call, the model has no knowledge of earlier conversation. Memory reads history in and writes the new turn back.",
      },
      {
        q: "In the modern LangChain pattern, what wraps a chain to give it conversation memory?",
        options: [
          "A. RunnableParallel",
          "B. RunnableWithMessageHistory (plus a get_session_history function)",
          "C. StrOutputParser",
          "D. RunnableBranch",
        ],
        answer: "B",
        explanation:
          "B is correct: RunnableWithMessageHistory wraps any chain, using a get_session_history(session_id) function to auto-load and auto-save each session's messages. The others handle parallelism, parsing, and routing.",
      },
      {
        q: "How are different users' conversations kept isolated from each other?",
        options: [
          "A. By using a different model per user",
          "B. By scoping history to a session_id passed in the invoke config ({\"configurable\": {\"session_id\": ...}})",
          "C. By lowering the temperature",
          "D. They are not isolated; all users share one history",
        ],
        answer: "B",
        explanation:
          "B is correct: history is partitioned by session_id supplied in the config, and get_session_history returns the matching per-session store, so Alice's turns never appear in Bob's conversation.",
      },
      {
        q: "Where in the prompt is the prior conversation injected?",
        options: [
          "A. At a MessagesPlaceholder (e.g. (\"placeholder\", \"{history}\"))",
          "B. Inside the system string only",
          "C. It is appended by the output parser",
          "D. In the model's temperature setting",
        ],
        answer: "A",
        explanation:
          "A is correct: a MessagesPlaceholder marks where the history_messages_key list is inserted into the prompt. The wrapper fills it from the session store before each call.",
      },
      {
        q: "What must change to make conversation history survive process restarts and be shared across server instances?",
        options: [
          "A. Increase max_tokens",
          "B. Replace InMemoryChatMessageHistory with a persistent backend like RedisChatMessageHistory (or SQL)",
          "C. Use a faster model",
          "D. Remove the MessagesPlaceholder",
        ],
        answer: "B",
        explanation:
          "B is correct: InMemoryChatMessageHistory is lost on restart and not shared. Returning a RedisChatMessageHistory (or SQL-backed history) from get_session_history persists and shares it, using the same wrapper code.",
      },
      {
        q: "A conversation has grown too long for the model's context window. Which approach keeps it in budget while preserving the system prompt?",
        options: [
          "A. Lower the temperature to 0",
          "B. trim_messages with strategy=\"last\" and include_system=True (a sliding window), or summarize older turns",
          "C. Switch to RunnableParallel",
          "D. Delete the session_id",
        ],
        answer: "B",
        explanation:
          "B is correct: trim_messages keeps the most recent messages up to a token budget while retaining the system message, and summarization condenses older turns — both bound the prompt. Temperature and parallelism don't manage context size.",
      },
    ],
  },
];
