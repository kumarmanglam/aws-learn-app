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
// SECTION: RAG — Retrieval-Augmented Generation.
// Pipeline, chunking, vector databases & ANN, retrieval
// evaluation & reranking, context injection & citations,
// hybrid search (BM25 + semantic), and failure modes /
// grounding. Authored to the ai-fundamentals.ts / messaging.ts bar.
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

export const aiRagTopics: Topic[] = [
  // -----------------------------------------------------------------
  {
    id: "ai-rag-fundamentals",
    title: "RAG Pipeline — Retrieval-Augmented Generation",
    shortLabel: "RAG Pipeline",
    section: "RAG — Retrieval-Augmented Generation",
    domain: "AI",
    tldr:
      "RAG grounds an LLM in your own documents by adding a retrieval step before generation. It runs in two phases: an offline indexing phase (chunk → embed → store in a vector DB) and an online query phase (embed the query → search for the top-K nearest chunks → inject them into the prompt → the LLM answers, citing sources). RAG beats fine-tuning for knowledge tasks because data stays fresh (just update docs), it is cheap (no GPU training), it can cite sources, and it reduces hallucination by anchoring answers to retrieved text. Fine-tuning is for changing behavior/style, not for injecting knowledge.",
    subtopics: [
      {
        heading: "What RAG is and why it exists",
        bullets: [
          { icon: "📚", text: "**Retrieval-Augmented Generation** inserts a retrieval step before the LLM: `query → retrieve relevant chunks → inject into prompt → generate a grounded answer`. It is the dominant pattern for production AI over private or fresh data." },
          { icon: "🧊", text: "An LLM's weights are **frozen at training time** — it cannot know your internal wiki, today's news, or last night's tickets. RAG feeds that knowledge in **at inference time** instead of retraining." },
          { icon: "🎯", text: "The payoff: it **reduces hallucination** by grounding responses in actual source text, and it lets the model **cite where each claim came from**." },
        ],
      },
      {
        heading: "The two phases of a pipeline",
        bullets: [
          { icon: "🏗️", text: "**Indexing (offline, one-time per doc):** split documents into chunks, embed each chunk into a vector, and store vectors + text + metadata in a vector database." },
          { icon: "🔎", text: "**Retrieval (online):** embed the user's query with the **same** embedding model, run nearest-neighbor search, and return the **top-K** most similar chunks (typically K = 3–5)." },
          { icon: "✍️", text: "**Generation (online):** build a prompt of `system instructions + retrieved chunks + question`, send to the LLM, and return an answer that cites the chunks it used." },
        ],
      },
      {
        heading: "RAG vs fine-tuning",
        bullets: [
          { icon: "🔄", text: "**RAG = knowledge injection.** Fresh (update docs, no retrain), cheap (embeddings + storage), transparent (cites sources), fast to stand up (hours)." },
          { icon: "🎨", text: "**Fine-tuning = behavior change.** Teaches new style, tone, output format, or reasoning patterns — but knowledge goes stale and it is a black box that cannot cite." },
          { icon: "🤝", text: "They are complementary: fine-tune for *how* the model should respond, use RAG for *what facts* it should respond with. Most enterprise Q&A needs RAG, not fine-tuning." },
        ],
      },
    ],
    keyFacts: [
      { label: "Pipeline", value: "Index → Retrieve → Generate", icon: "🔁" },
      { label: "Typical K", value: "3–5 chunks per query", icon: "🔢" },
      { label: "vs Fine-tuning", value: "Fresh + cheap + cites sources", icon: "🆚" },
      { label: "Main win", value: "Grounding → less hallucination", icon: "🎯" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'What problem does RAG solve?' → **stale/private knowledge + hallucination**.",
        "'RAG stages?' → **index (chunk→embed→store)**, then **retrieve → generate**.",
        "'RAG vs fine-tuning?' → RAG for **knowledge**, fine-tuning for **behavior**.",
        "'Why cite?' → **verifiability**; RAG can point to the source chunk.",
        "Query and documents **must use the same embedding model**.",
      ],
      analogyBrief:
        "RAG turns a closed-book exam into an open-book one: the model searches a reference library first, then writes an answer grounded in the pages it found.",
    },
    explanation:
      "Retrieval-Augmented Generation (RAG) is the most important production pattern in applied LLM engineering because it solves two problems that a bare model cannot: a model's weights are frozen at training time, so it has no knowledge of your private documents or of events after its cutoff, and when asked about things it does not know it tends to hallucinate confidently. RAG fixes both by inserting a retrieval step before generation — query → retrieve the most relevant chunks of your corpus → inject them into the prompt → let the LLM generate an answer grounded in that retrieved text — so the model answers from evidence you supply rather than from parametric memory alone. A RAG system has two phases. The indexing phase runs offline and once per document: each document is split into chunks (a few hundred tokens each), every chunk is passed through an embedding model to produce a dense vector that captures its meaning, and those vectors are stored — alongside the original text and metadata like source, section, and date — in a vector database. The query phase runs online for every user request: the query is embedded with the same embedding model (critical — mismatched embedding spaces make similarity meaningless), a nearest-neighbor search returns the top-K most similar chunks (K is usually 3–5, because too few misses context and too many dilutes relevance and triggers 'lost in the middle'), and finally a prompt is assembled from a system instruction, the retrieved chunks, and the question, and sent to the LLM which produces an answer that should cite the specific chunks it relied on. The recurring interview question is RAG versus fine-tuning: RAG is the right tool for knowledge because data stays fresh (you just update documents rather than retraining), it is cheap (only embeddings and storage, no GPU-weeks), it is transparent (it can cite its sources), it reduces hallucination by grounding, and it can be stood up in hours; fine-tuning is the right tool for behavior — a new writing style, a strict output format, or domain-specific reasoning patterns — but its knowledge goes stale, it is a black box that cannot cite, and it is expensive to iterate. The two are complementary rather than competing: fine-tune to control how the model responds, and use RAG to control what facts it responds with. Quality is measured on two axes — retrieval quality (did we fetch the right chunks?) and generation quality (given the right chunks, did we produce a faithful, relevant answer?) — and mixing them up is the single most common debugging mistake in RAG.",
    analogy:
      "RAG is the difference between a closed-book exam and an open-book one. Without RAG the model sits a closed-book exam: it can only use what it memorized during training, so for anything it did not study it either guesses (hallucinates) or shrugs. With RAG the model gets an open-book exam with a research assistant: you hand it the question, the assistant sprints to the reference library (the vector database), pulls the handful of most relevant pages (top-K chunks), and the model writes its answer from those pages — quoting them so you can check its work. Fine-tuning, by contrast, is like sending the student back to school for a semester to change how they write and reason; it is powerful for changing habits but a slow, expensive, opaque way to teach them a single new fact that a quick trip to the library would have covered.",
    diagram: `<svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="RAG pipeline: index offline, then retrieve and generate online">${svgDefs}
      <text x="380" y="22" fill="#e6edf3" font-size="13" font-weight="700" text-anchor="middle">RAG Pipeline — Index (offline), then Retrieve + Generate (online)</text>
      <text x="30" y="52" fill="#8b949e" font-size="11" font-weight="600">INDEXING (offline, once per document)</text>
      ${box(30, 62, 150, 50, "Documents", "PDFs, wiki, docs", "#8b949e")}
      ${box(210, 62, 130, 50, "Chunk", "~300 tokens", "#3b82f6")}
      ${box(370, 62, 130, 50, "Embed", "→ vectors", "#22c55e")}
      ${box(530, 62, 200, 50, "Vector DB", "vectors + text + metadata", "#8b5cf6")}
      <line x1="180" y1="87" x2="208" y2="87" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="340" y1="87" x2="368" y2="87" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="500" y1="87" x2="528" y2="87" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="30" y="152" fill="#22c55e" font-size="11" font-weight="600">QUERY (online, every request)</text>
      ${box(30, 162, 130, 50, "Query", "user question", "#22c55e")}
      ${box(190, 162, 120, 50, "Embed", "same model", "#22c55e")}
      ${box(340, 162, 140, 50, "Search top-K", "nearest vectors", "#8b5cf6")}
      ${box(510, 162, 100, 50, "LLM", "generate", "#3b82f6")}
      ${box(640, 162, 90, 50, "Answer", "+ citations", "#f59e0b")}
      <line x1="160" y1="187" x2="188" y2="187" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="310" y1="187" x2="338" y2="187" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="480" y1="187" x2="508" y2="187" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="610" y1="187" x2="638" y2="187" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <path d="M630 112 Q660 137 480 162" stroke="#8b949e" stroke-width="1.4" stroke-dasharray="5 4" fill="none" marker-end="url(#arrow-mute)"/>
      <text x="380" y="250" fill="#8b949e" font-size="10" text-anchor="middle">Retrieved chunks are injected into the prompt so the answer is grounded in real sources</text>
      <text x="380" y="272" fill="#8b949e" font-size="10" text-anchor="middle">Query and documents must be embedded by the SAME model</text>
    </svg>`,
    diagramLegend: [
      { color: "#3b82f6", label: "Chunk / LLM", description: "Splitting docs (index) and the generator that writes the grounded answer." },
      { color: "#22c55e", label: "Embed / Query", description: "Same embedding model turns both docs and the query into comparable vectors." },
      { color: "#8b5cf6", label: "Vector DB / Search", description: "Stores vectors and returns the top-K nearest chunks for a query." },
    ],
    codeExample: {
      language: "python",
      title: "Minimal end-to-end RAG (embed → retrieve → generate)",
      code: `import numpy as np
from anthropic import Anthropic

claude = Anthropic()

# --- Index (offline): chunks already embedded to vectors ---
documents = [
    "Python's GIL prevents true parallel thread execution in CPython; use multiprocessing for CPU-bound work.",
    "FastAPI is built on Starlette and Pydantic and generates OpenAPI docs automatically.",
    "Docker containers share the host kernel, making them lighter than virtual machines.",
]
doc_vectors = embed(documents)   # your embedding model -> np.ndarray [n, d]

# --- Retrieve (online) ---
def retrieve(query, k=2):
    q = embed([query])[0]
    sims = doc_vectors @ q / (
        np.linalg.norm(doc_vectors, axis=1) * np.linalg.norm(q)
    )
    top = np.argsort(sims)[-k:][::-1]
    return [documents[i] for i in top]

# --- Generate (online) ---
def answer(query):
    chunks = retrieve(query)
    context = "\\n\\n".join(f"[Doc {i+1}] {c}" for i, c in enumerate(chunks))
    resp = claude.messages.create(
        model="claude-sonnet-5",
        max_tokens=512,
        temperature=0,
        system=("Answer using ONLY the documents. Cite as [Doc N]. "
                "If the answer is not in them, say you don't know."),
        messages=[{"role": "user",
                   "content": f"Documents:\\n{context}\\n\\nQuestion: {query}"}],
    )
    return resp.content[0].text

print(answer("How does Python's GIL affect threading?"))`,
    },
    codeExamples: [
      {
        language: "python",
        tab: "End-to-end",
        title: "The three RAG stages in one function",
        code: `import numpy as np
from anthropic import Anthropic

claude = Anthropic()

documents = [
    "The GIL is a mutex in CPython that prevents parallel thread execution.",
    "Pydantic v2 uses a Rust core, making validation 5-50x faster than v1.",
    "asyncio runs a single-threaded event loop; use gather() for concurrent I/O.",
]
doc_vectors = embed(documents)                 # embedding model -> [n, d]

def rag(query, k=2):
    # 1) retrieve
    q = embed([query])[0]
    sims = doc_vectors @ q / (
        np.linalg.norm(doc_vectors, axis=1) * np.linalg.norm(q))
    idx = np.argsort(sims)[-k:][::-1]
    context = "\\n".join(f"[{i+1}] {documents[j]}" for i, j in enumerate(idx))
    # 2) generate
    resp = claude.messages.create(
        model="claude-sonnet-5", max_tokens=300, temperature=0,
        system="Answer from the docs only. Cite as [N]. Say so if not found.",
        messages=[{"role": "user",
                   "content": f"Docs:\\n{context}\\n\\nQ: {query}"}])
    return resp.content[0].text

print(rag("What makes Pydantic v2 fast?"))
# -> "Pydantic v2 uses a Rust core, ~5-50x faster than v1 [1]."`,
      },
      {
        language: "python",
        tab: "RAG vs fine-tune",
        title: "A decision helper: which tool fits the task?",
        code: `def choose_approach(need_fresh_data, need_citations,
                    changing_style, budget_gpu_hours):
    """Rough heuristic used in system-design interviews."""
    if changing_style and not need_fresh_data:
        return "FINE-TUNE: behavior/format change, knowledge is stable"
    if need_fresh_data or need_citations:
        return "RAG: knowledge is dynamic and must be verifiable"
    if budget_gpu_hours == 0:
        return "RAG: no training budget"
    return "RAG first; fine-tune later only if behavior still off"

print(choose_approach(need_fresh_data=True,  need_citations=True,
                      changing_style=False, budget_gpu_hours=0))
# -> RAG: knowledge is dynamic and must be verifiable

print(choose_approach(need_fresh_data=False, need_citations=False,
                      changing_style=True,  budget_gpu_hours=200))
# -> FINE-TUNE: behavior/format change, knowledge is stable`,
      },
      {
        language: "python",
        tab: "Same-model rule",
        title: "Why query and docs need the same embedding model",
        code: `import numpy as np

def cos(a, b):
    return a @ b / (np.linalg.norm(a) * np.linalg.norm(b))

# Two DIFFERENT models produce vectors in incomparable spaces.
doc_vec_modelA   = np.array([0.9, 0.1, 0.2])   # doc embedded by model A
query_vec_modelB = np.array([0.1, 0.9, 0.8])   # query embedded by model B
print("cross-model 'similarity':", round(cos(doc_vec_modelA,
                                              query_vec_modelB), 3))
# Meaningless: the axes don't mean the same thing.

# Same model -> comparable geometry -> similarity is meaningful.
doc_vec   = np.array([0.90, 0.10, 0.20])
query_vec = np.array([0.88, 0.12, 0.19])
print("same-model similarity:", round(cos(doc_vec, query_vec), 3))  # ~high`,
      },
    ],
    problemStatement:
      "Your company's support bot, built on a base LLM, gives confidently wrong answers about your product and knows nothing about features shipped after the model's training cutoff. A colleague proposes fine-tuning the model every week on the latest docs. Explain why RAG is the better fit here, describe the exact indexing and query stages you would build, justify your choice of K, and state when fine-tuning would still be worth doing.",
    questions: [
      {
        q: "What core problem does RAG address?",
        options: [
          "A. It makes the model train faster",
          "B. It grounds responses in retrieved documents, reducing hallucination and letting the model use private or post-cutoff knowledge",
          "C. It compresses documents to save storage",
          "D. It removes the need for an LLM entirely",
        ],
        answer: "B",
        explanation:
          "B is correct: an LLM's weights are frozen at training time, so RAG retrieves relevant source text at query time and injects it into the prompt — grounding the answer, cutting hallucination, and enabling answers about private or fresh data.",
      },
      {
        q: "What is the correct order of the RAG pipeline?",
        options: [
          "A. Generate → Retrieve → Embed → Chunk",
          "B. Index (chunk → embed → store), then Retrieve (embed query → search top-K), then Generate",
          "C. Embed the answer → search → chunk the query → generate",
          "D. Fine-tune → embed → generate → store",
        ],
        answer: "B",
        explanation:
          "B is correct: offline you chunk, embed, and store; online you embed the query, search for the top-K nearest chunks, then inject them into the prompt for generation.",
      },
      {
        q: "For most enterprise Q&A over private documents, why is RAG usually preferred over fine-tuning?",
        options: [
          "A. Fine-tuning cannot answer questions at all",
          "B. RAG keeps data fresh (just update docs), is cheaper (no GPU training), can cite sources, and reduces hallucination — fine-tuning is better for changing behavior/style",
          "C. RAG always produces more fluent text",
          "D. Fine-tuning only works for images",
        ],
        answer: "B",
        explanation:
          "B is correct: RAG injects knowledge cheaply and transparently and stays current, while fine-tuning changes behavior/style but goes stale, cannot cite, and is expensive to iterate.",
      },
      {
        q: "Why must the query and the documents be embedded with the same model?",
        options: [
          "A. To save on API costs",
          "B. Because different models produce vectors in incomparable spaces, so cross-model cosine similarity is meaningless",
          "C. Because vector databases only accept one model's format",
          "D. It is not required; any two embedding models work together",
        ],
        answer: "B",
        explanation:
          "B is correct: similarity search only makes sense when query and document vectors live in the same geometric space; mixing embedding models makes the distances uninterpretable and retrieval fails.",
      },
      {
        q: "You retrieve K = 30 chunks for every query and answers get worse. What is the most likely cause?",
        options: [
          "A. The embedding model is broken",
          "B. Too many chunks dilute relevance and trigger 'lost in the middle', so the LLM is swamped with mostly-irrelevant context",
          "C. The vector DB cannot store 30 vectors",
          "D. K has no effect on answer quality",
        ],
        answer: "B",
        explanation:
          "B is correct: large K floods the context with low-relevance text and models attend poorly to the middle of long contexts. Start at K = 3–5 and optionally add a relevance threshold to filter weak matches.",
      },
      {
        q: "When is fine-tuning still worth doing alongside RAG?",
        options: [
          "A. Whenever documents change",
          "B. When you need to change the model's behavior — a specific tone, a strict output format, or domain reasoning patterns — that RAG context alone does not reliably enforce",
          "C. Only when you have no documents",
          "D. Never; RAG replaces fine-tuning in all cases",
        ],
        answer: "B",
        explanation:
          "B is correct: RAG injects knowledge, but fine-tuning is the right lever for durable behavior changes (style, format adherence, reasoning habits). They are complementary — fine-tune for how, RAG for what.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "ai-chunking",
    title: "Chunking Strategies — Splitting Documents for Retrieval",
    shortLabel: "Chunking Strategies",
    section: "RAG — Retrieval-Augmented Generation",
    domain: "AI",
    tldr:
      "Chunking splits documents into the units you embed and retrieve, and it is the highest-ROI knob in RAG: a great embedding model cannot rescue bad chunks. Too large and the single vector averages over many topics (diluted, matches nothing well); too small and it loses the context needed to stand alone. The sweet spot is roughly 200–800 tokens with 10–20% overlap so boundary sentences aren't orphaned. Strategies escalate from fixed-size (simple, splits mid-sentence) → recursive character (respects paragraph/sentence boundaries — the sane default) → structure-aware (splits on headers/functions) → semantic (splits where topic shifts, detected by embedding similarity). Always attach metadata (source, section, date) for filtering.",
    subtopics: [
      {
        heading: "Why chunk size decides retrieval quality",
        bullets: [
          { icon: "🧮", text: "An embedding compresses a whole chunk into **one vector**. A huge chunk covering many topics produces an **averaged, muddy** vector that matches specific queries poorly." },
          { icon: "🔍", text: "A tiny chunk (one sentence) loses context — '**Use @wraps**' is meaningless alone, so its embedding is ambiguous and retrieves for the wrong queries." },
          { icon: "🎯", text: "**Sweet spot: ~200–800 tokens** — focused enough for a crisp embedding, large enough to be self-contained. Dense/legal text → smaller; conversational → larger." },
        ],
      },
      {
        heading: "The strategy ladder",
        bullets: [
          { icon: "📏", text: "**Fixed-size:** split every N tokens with overlap. Simple and predictable but splits mid-sentence — avoid for production prose." },
          { icon: "🪜", text: "**Recursive character splitting** (LangChain default): try separators in order — paragraph → newline → sentence → word — so splits respect natural boundaries. The sane default." },
          { icon: "🧠", text: "**Semantic chunking:** embed each sentence, split where consecutive-sentence similarity drops below a threshold. Topically coherent but expensive. **Structure-aware:** split on markdown headers, or code by function/class." },
        ],
      },
      {
        heading: "Overlap & metadata",
        bullets: [
          { icon: "🔗", text: "**Overlap (10–20%)** repeats boundary text in adjacent chunks so a sentence split across a boundary is complete in at least one chunk — cheap insurance against orphaned info." },
          { icon: "🏷️", text: "**Metadata** on every chunk (source file, section heading, page, date, doc type) enables **filtered search** ('only Q4-2025 docs') and better citations." },
          { icon: "🧩", text: "**Parent-child:** embed small precise children for matching, but return the larger parent chunk to the LLM for context — precision in, context out." },
        ],
      },
    ],
    keyFacts: [
      { label: "Sweet spot", value: "~200–800 tokens per chunk", icon: "🎯" },
      { label: "Overlap", value: "10–20% of chunk size", icon: "🔗" },
      { label: "Sane default", value: "Recursive character splitting", icon: "🪜" },
      { label: "Always add", value: "Metadata (source, section, date)", icon: "🏷️" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'Why not embed whole docs?' → **one vector averages many topics** → poor match.",
        "'Best default splitter?' → **recursive character** (respects boundaries).",
        "'Why overlap?' → boundary sentences aren't **orphaned** between chunks.",
        "'When semantic chunking?' → **unstructured text** with topic shifts.",
        "Attach **metadata** to every chunk for filtered search + citations.",
      ],
      analogyBrief:
        "Chunking is writing a library's index cards: one card per book is useless, one per sentence is meaningless — one per coherent section is just right.",
    },
    explanation:
      "Chunking is the most underestimated component of a RAG system and often the single highest-ROI thing to tune, because the embedding model turns each chunk into exactly one vector and that vector must represent the chunk's meaning well enough for similarity search to work. If a chunk is too large — say an entire ten-page document about many topics — its embedding is effectively an average over all those topics and matches no specific query well; if a chunk is too small — a single sentence like 'Use @wraps' — it lacks the context to be interpretable, so its embedding is ambiguous and it gets retrieved for the wrong questions. The practical sweet spot is roughly 200 to 800 tokens per chunk, tuned by document type: dense technical or legal text favors smaller chunks (200–400 tokens) where precise clauses matter, conversational content favors larger ones (500–800) to preserve context, and code is best chunked by logical unit (function or class) rather than by character count. Chunking strategies form a ladder of increasing sophistication. Fixed-size chunking splits every N tokens or characters with some overlap; it is trivial and predictable but blindly cuts through sentences and paragraphs, orphaning information. Recursive character splitting — the sensible default used by LangChain — tries a prioritized list of separators (paragraph break, then newline, then sentence boundary, then space) so that splits respect natural structure, at the cost of variable chunk sizes. Structure-aware chunking uses the document's own structure, splitting a markdown file on its headers so each section is a chunk, or parsing code by function and class. Semantic chunking embeds each sentence and starts a new chunk wherever the cosine similarity between consecutive sentences drops below a threshold, producing topically coherent chunks even in unstructured text like chat logs or transcripts, but it is expensive because it embeds every sentence and yields variable sizes. Two techniques cut across all of these. Overlap (typically 10–20% of the chunk size) repeats a little boundary text between adjacent chunks so a sentence or idea split across a boundary appears complete in at least one chunk; without it, boundary information can be lost in both neighbors and retrieve poorly. Metadata enrichment attaches fields like source file, section heading, page number, indexing date, and document type to every chunk, which enables filtered search (restricting a query to, say, only 2025 documents or only a particular manual) and produces better citations. A powerful refinement is parent-child retrieval: embed and search over small, precise child chunks for accurate matching, but return the larger parent chunk to the LLM so it has enough surrounding context to answer well — getting precision on the way in and context on the way out.",
    analogy:
      "Chunking is like writing the index cards for a library's card catalog. If each card summarizes an entire book, a search for 'Python decorators' hands you a 500-page volume that is mostly irrelevant — the card's description is a blurry average of everything inside. If each card holds a single sentence, you get 'Use @wraps' with no hint of what it means or when it applies — useless on its own. The right card covers one coherent section: a few paragraphs on a single idea, self-contained enough to make sense when pulled alone. Overlap is letting adjacent cards share a sentence at the seam so nothing falls through the cracks, and metadata is the little tags in the card's corner — author, shelf, year — that let you narrow the search before you even read the description.",
    diagram: `<svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Chunking: too large vs too small vs just right, plus overlap">${svgDefs}
      <text x="380" y="22" fill="#e6edf3" font-size="13" font-weight="700" text-anchor="middle">Chunk size: too large vs too small vs just right</text>
      ${box(30, 45, 210, 90, "Too large", "many topics → muddy vector", "#f85149")}
      ${box(275, 45, 210, 90, "Too small", "no context → ambiguous", "#f59e0b")}
      ${box(520, 45, 210, 90, "Just right", "one topic, self-contained", "#22c55e")}
      <text x="135" y="128" fill="#f85149" font-size="10" text-anchor="middle">poor retrieval</text>
      <text x="380" y="128" fill="#f59e0b" font-size="10" text-anchor="middle">matches wrong queries</text>
      <text x="625" y="128" fill="#22c55e" font-size="10" text-anchor="middle">accurate retrieval</text>
      <text x="380" y="168" fill="#e6edf3" font-size="12" font-weight="700" text-anchor="middle">Overlap keeps boundary sentences whole</text>
      <rect x="90" y="185" width="230" height="34" rx="6" fill="#243349" stroke="#3b82f6"/>
      <text x="205" y="206" fill="#e6edf3" font-size="10" text-anchor="middle">Chunk 1 ........ [overlap]</text>
      <rect x="270" y="225" width="230" height="34" rx="6" fill="#243349" stroke="#8b5cf6"/>
      <text x="385" y="246" fill="#e6edf3" font-size="10" text-anchor="middle">[overlap] Chunk 2 [overlap]</text>
      <rect x="450" y="185" width="230" height="34" rx="6" fill="#243349" stroke="#22c55e"/>
      <text x="565" y="206" fill="#e6edf3" font-size="10" text-anchor="middle">[overlap] ........ Chunk 3</text>
      <text x="380" y="284" fill="#8b949e" font-size="10" text-anchor="middle">Target ~200–800 tokens, 10–20% overlap; recursive splitting respects boundaries</text>
    </svg>`,
    diagramLegend: [
      { color: "#f85149", label: "Too large", description: "Vector averages many topics; matches specific queries poorly." },
      { color: "#f59e0b", label: "Too small", description: "No standalone context; embedding is ambiguous." },
      { color: "#22c55e", label: "Just right", description: "One coherent topic per chunk, self-contained — accurate retrieval." },
    ],
    codeExample: {
      language: "python",
      title: "Fixed-size vs recursive character splitting",
      code: `# Naive fixed-size: predictable, but cuts mid-sentence.
def fixed_size_chunks(text, chunk_size=500, overlap=50):
    words = text.split()
    chunks, step = [], chunk_size - overlap
    for i in range(0, len(words), step):
        chunk = " ".join(words[i:i + chunk_size])
        if chunk:
            chunks.append(chunk)
    return chunks

# Recommended default: respects paragraph/sentence boundaries.
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,        # target size (characters)
    chunk_overlap=60,      # ~12% overlap
    separators=["\\n## ", "\\n\\n", "\\n", ". ", " ", ""],  # tried in order
)
chunks = splitter.split_text(document_text)
print(f"{len(chunks)} chunks; first: {chunks[0][:80]!r}")`,
    },
    codeExamples: [
      {
        language: "python",
        tab: "Fixed vs recursive",
        title: "Why recursive splitting beats naive fixed-size",
        code: `document = """## Python Decorators

Decorators modify other functions using the @ syntax and power
frameworks like FastAPI.

## Context Managers

Context managers handle cleanup via the 'with' statement, implementing
__enter__ and __exit__."""

# Fixed-size (every 20 words) cuts through headings and sentences.
words = document.split()
fixed = [" ".join(words[i:i+20]) for i in range(0, len(words), 20)]
print("fixed-size chunks:", len(fixed))
print("  ", fixed[0][:70], "...")   # heading merged into body text

# Recursive splitting on structure keeps each section intact.
from langchain.text_splitter import RecursiveCharacterTextSplitter
splitter = RecursiveCharacterTextSplitter(
    chunk_size=200, chunk_overlap=20,
    separators=["\\n## ", "\\n\\n", "\\n", " "])
recursive = splitter.split_text(document)
print("recursive chunks:", len(recursive))
for c in recursive:
    print("  ", c.splitlines()[0])   # each chunk starts at a heading`,
      },
      {
        language: "python",
        tab: "Semantic chunking",
        title: "Split where the topic shifts",
        code: `import numpy as np

def cos(a, b):
    return a @ b / (np.linalg.norm(a) * np.linalg.norm(b))

def semantic_chunks(sentences, sent_vectors, threshold=0.75):
    """Start a new chunk when consecutive sentences diverge in meaning."""
    chunks, current = [], [sentences[0]]
    for i in range(1, len(sentences)):
        sim = cos(sent_vectors[i - 1], sent_vectors[i])
        if sim < threshold:            # topic shift detected
            chunks.append(" ".join(current))
            current = [sentences[i]]
        else:
            current.append(sentences[i])
    chunks.append(" ".join(current))
    return chunks

sentences = [
    "Decorators wrap functions using the @ syntax.",
    "Use functools.wraps to preserve metadata.",
    "Docker containers share the host kernel.",   # topic shift here
    "Multi-stage builds shrink image size.",
]
sv = embed(sentences)                       # embedding model -> [n, d]
for c in semantic_chunks(sentences, sv):
    print("-", c)`,
      },
      {
        language: "python",
        tab: "Metadata + parent-child",
        title: "Enrich chunks and return parents for context",
        code: `# Each chunk carries metadata for filtering and citations.
def make_chunk(text, parent_id, source, section, idx):
    return {
        "id": f"{parent_id}_c{idx}",
        "text": text,               # small CHILD -> embedded & searched
        "parent_id": parent_id,     # points to the larger parent chunk
        "metadata": {
            "source": source,
            "section": section,
            "doc_type": "documentation",
            "indexed_at": "2026-01-15",
        },
    }

chunk = make_chunk("Use @wraps to preserve function metadata.",
                   parent_id="decorators", source="py-guide.md",
                   section="Decorators", idx=3)

# Filtered search example (pseudo-API): only this source, recent docs.
# results = store.query(query_vec, k=5,
#     where={"source": "py-guide.md", "indexed_at": {"$gte": "2026-01-01"}})
# Then swap each matched CHILD for its PARENT chunk before prompting:
# context = [store.get_parent(r["parent_id"]) for r in results]
print(chunk["id"], "->", chunk["metadata"]["section"])`,
      },
    ],
    problemStatement:
      "Your RAG system retrieves whole 8-page documents as single chunks and users complain answers are vague and often miss the specific paragraph they asked about. Separately, when you switch to one-sentence chunks, retrieval returns snippets like 'Use @wraps' with no context. Explain what is going wrong in each case, recommend a chunking strategy and size with overlap, and describe how metadata and parent-child retrieval would improve both precision and the resulting citations.",
    questions: [
      {
        q: "Why is embedding an entire long document as one chunk usually a bad idea?",
        options: [
          "A. Embedding models reject long inputs entirely",
          "B. A single vector averages over all the document's topics, so it matches specific queries poorly",
          "C. It uses too much disk space",
          "D. Long documents cannot be tokenized",
        ],
        answer: "B",
        explanation:
          "B is correct: one embedding must summarize the whole chunk. Spanning many topics yields a muddy, averaged vector that is not close to any specific query, so retrieval quality collapses. Focused chunks produce sharper vectors.",
      },
      {
        q: "What is chunk overlap and why is it used?",
        options: [
          "A. Storing each chunk twice for backup",
          "B. Repeating a small portion of text between adjacent chunks so information split at a boundary is complete in at least one chunk",
          "C. Merging all chunks back into one document",
          "D. Compressing chunks to save tokens",
        ],
        answer: "B",
        explanation:
          "B is correct: 10–20% overlap ensures a sentence or idea straddling a chunk boundary appears whole in a neighbor, preventing orphaned information that would retrieve poorly.",
      },
      {
        q: "Which is the recommended default chunking strategy for general prose?",
        options: [
          "A. Fixed-size splitting every N characters",
          "B. Recursive character splitting that tries paragraph → newline → sentence → word separators in order",
          "C. One chunk per document",
          "D. One chunk per character",
        ],
        answer: "B",
        explanation:
          "B is correct: recursive character splitting respects natural boundaries by trying a prioritized separator list, avoiding the mid-sentence cuts of fixed-size splitting while keeping chunks reasonably sized.",
      },
      {
        q: "When is semantic chunking most worth its extra cost?",
        options: [
          "A. For well-structured markdown with clear headers",
          "B. For unstructured text (chat logs, transcripts) where topic shifts don't align with any structural markers",
          "C. For very short documents",
          "D. Whenever you want the smallest possible chunks",
        ],
        answer: "B",
        explanation:
          "B is correct: semantic chunking detects topic shifts from embedding similarity, so it shines on unstructured text lacking headers. For structured docs, cheaper structure-aware or recursive splitting already captures the boundaries.",
      },
      {
        q: "What does attaching metadata (source, section, date) to each chunk enable?",
        options: [
          "A. Faster embedding computation",
          "B. Filtered search (e.g., restrict to one manual or recent docs) and better citations",
          "C. Smaller vectors",
          "D. Automatic fine-tuning of the LLM",
        ],
        answer: "B",
        explanation:
          "B is correct: metadata lets you narrow the search space before or during vector search (improving relevance and speed) and lets the LLM cite the exact source/section it used.",
      },
      {
        q: "In parent-child retrieval, what is embedded and searched versus returned to the LLM?",
        options: [
          "A. Parents are searched; children are returned",
          "B. Small child chunks are embedded and searched for precision, but the larger parent chunk is returned to the LLM for context",
          "C. Both parent and child are always returned together",
          "D. Only the document title is embedded",
        ],
        answer: "B",
        explanation:
          "B is correct: matching on small children gives precise retrieval, while returning the parent supplies enough surrounding context for a good answer — precision in, context out.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "ai-vector-databases",
    title: "Vector Databases — FAISS, pgvector, Pinecone & ANN",
    shortLabel: "Vector Databases",
    section: "RAG — Retrieval-Augmented Generation",
    domain: "AI",
    tldr:
      "A vector database stores embedding vectors and finds the nearest ones to a query fast. Brute-force exact search is O(N·d) per query — fine for thousands of vectors, hopeless for millions — so vector DBs use Approximate Nearest Neighbor (ANN) indexes. HNSW (a multi-layer proximity graph) gives ~O(log N) queries with >95% recall at the cost of 2–4× memory; IVF partitions vectors into clusters and searches only the nearest few (cheaper memory, lower recall). Pick by fit: FAISS (in-memory library, research/batch), pgvector (you already run Postgres, <~1M vectors), Pinecone (managed cloud scale), Chroma (local prototyping). Cosine similarity is the standard metric, and metadata filtering narrows the search before ANN.",
    subtopics: [
      {
        heading: "What a vector DB does",
        bullets: [
          { icon: "🗄️", text: "Stores high-dimensional **embedding vectors** plus text and metadata, and answers **k-nearest-neighbor** queries: given a query vector, return the K most similar stored vectors." },
          { icon: "📐", text: "**Cosine similarity** is the default text metric (angle, not magnitude). Also seen: dot product and Euclidean/L2. Normalize vectors and cosine ≈ dot product." },
          { icon: "🏷️", text: "**Metadata filtering** (e.g., `where tenant_id = 'acme'`) narrows the candidate set before or during the vector search — better relevance, speed, and multi-tenant isolation." },
        ],
      },
      {
        heading: "Why ANN instead of exact search",
        bullets: [
          { icon: "🐌", text: "**Exact / brute-force** compares the query to every vector: **O(N·d)** per query. At millions of vectors this is far too slow for online serving." },
          { icon: "⚡", text: "**Approximate Nearest Neighbor (ANN)** trades a tiny bit of recall for a huge speedup — returning *almost* the true top-K in a fraction of the time." },
          { icon: "🎚️", text: "The knob is **recall vs latency/memory**: push recall to ~99% and you pay more; accept ~95% and queries get cheaper and faster." },
        ],
      },
      {
        heading: "HNSW, IVF & choosing a DB",
        bullets: [
          { icon: "🕸️", text: "**HNSW** (Hierarchical Navigable Small World): a multi-layer graph — sparse top layers make long jumps, dense bottom layers refine locally. ~**O(log N)** queries, **>95% recall**, but **2–4× memory** for the graph." },
          { icon: "🗂️", text: "**IVF** (Inverted File): cluster vectors, at query time probe only the `nprobe` nearest clusters. Cheaper memory, faster to build, lower recall; great for 100M+ vectors (often + PQ compression)." },
          { icon: "🧰", text: "**FAISS** = in-memory library (research/batch, no persistence). **pgvector** = Postgres extension (already-on-Postgres, <~1M). **Pinecone** = managed cloud scale. **Chroma** = local prototyping." },
        ],
      },
    ],
    keyFacts: [
      { label: "Default metric", value: "Cosine similarity", icon: "📐" },
      { label: "HNSW", value: "~O(log N), >95% recall, 2–4× mem", icon: "🕸️" },
      { label: "IVF", value: "Cluster + probe; cheaper, lower recall", icon: "🗂️" },
      { label: "Core tradeoff", value: "Recall vs latency/memory", icon: "🎚️" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'Why not brute force?' → **O(N·d)** per query is too slow at millions.",
        "'What is HNSW?' → **layered proximity graph**, ~O(log N), >95% recall.",
        "'HNSW cost?' → **2–4× memory** for the graph edges.",
        "'IVF idea?' → cluster vectors, **probe only nearest clusters**.",
        "FAISS (lib) · pgvector (Postgres) · Pinecone (managed) · Chroma (local).",
      ],
      analogyBrief:
        "ANN is finding a nearby coffee shop with a map's zoom levels instead of driving past every shop in the city — a couple of near-perfect hops, not an exhaustive scan.",
    },
    explanation:
      "A vector database is a specialized store for high-dimensional embedding vectors whose core operation is k-nearest-neighbor search: given a query vector, return the K stored vectors most similar to it, where similarity for text embeddings is almost always cosine similarity (the angle between vectors, which ignores magnitude), though dot product and Euclidean distance are also offered and cosine equals dot product on normalized vectors. Alongside each vector the database keeps the source text and metadata, and metadata filtering — restricting the search to, say, one tenant, one document type, or a date range — is essential in production both for relevance and speed and for multi-tenant data isolation. The central engineering problem is that exact nearest-neighbor search is brute force: comparing the query against every one of N vectors of dimension d costs O(N·d) per query, which is perfectly fine for a few thousand vectors but hopelessly slow for the millions or hundreds of millions a real system holds. Vector databases therefore use Approximate Nearest Neighbor (ANN) indexes, which trade a small amount of recall (occasionally missing a true neighbor) for enormous speedups, and the fundamental knob everywhere is recall versus latency and memory. The most common ANN index is HNSW, Hierarchical Navigable Small World, which builds a multi-layer proximity graph: the sparse top layers have long-range edges that let a search make big jumps across the space, and each lower layer is denser with shorter edges, so a query starts at the top, greedily walks toward the query vector, and descends layer by layer to refine — giving roughly O(log N) query time and typically over 95% recall, at the cost of 2–4× the memory of the raw vectors to hold the graph edges and a slower build. IVF, the Inverted File index, instead partitions the vectors into clusters (via k-means), and at query time probes only the nprobe clusters whose centroids are nearest the query; it builds faster and uses less memory than HNSW and scales to very large corpora (often combined with Product Quantization, PQ, to compress vectors), but its recall is lower and depends on how many clusters you probe. Choosing a concrete database is a fit question rather than a 'best' question: FAISS is an in-memory library from Meta that is superb for research and batch processing but has no built-in persistence or serving layer (vectors vanish on restart unless you serialize them); pgvector is a Postgres extension ideal when you already run Postgres, want vectors to live alongside relational data for JOINs, and have on the order of a million vectors or fewer; Pinecone is a managed cloud service for zero-ops scale into the tens of millions of vectors; and Chroma is the easiest local, embedded option for prototyping. A frequent production mistake is reaching for FAISS in a serving system that needs durability and updates, where a persistent store like pgvector, Chroma, or Pinecone is the right call.",
    analogy:
      "Finding the nearest vectors by brute force is like finding the closest coffee shop by driving to every single shop in the city and measuring the distance to each — correct, but absurd at scale. HNSW is like a good map with zoom levels: you start zoomed out and make a couple of long jumps toward the right neighborhood (the sparse top layers), then zoom in to compare only the few shops on the block (the dense bottom layer). You might occasionally miss the theoretically closest shop by a few meters (that is the 'approximate' part), but you get an essentially perfect answer in a handful of hops instead of thousands. IVF is like first deciding which district to search (the nearest clusters) and only walking that district — faster and lighter, but if the best shop sits just over the district line and you didn't check enough districts, you can miss it.",
    diagram: `<svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Vector database: ANN indexes HNSW and IVF versus brute-force search">${svgDefs}
      <text x="380" y="22" fill="#e6edf3" font-size="13" font-weight="700" text-anchor="middle">Nearest-neighbor search: brute force vs ANN indexes</text>
      ${box(30, 45, 170, 46, "Query vector", "embed(query)", "#22c55e")}
      <line x1="200" y1="68" x2="250" y2="68" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(250, 45, 200, 46, "Brute force", "O(N·d) — exact, slow", "#f85149")}
      ${box(500, 45, 230, 46, "ANN index", "approximate, fast", "#8b5cf6")}
      <text x="150" y="120" fill="#8b5cf6" font-size="12" font-weight="700" text-anchor="middle">HNSW (layered graph)</text>
      <circle cx="60" cy="150" r="6" fill="#8b5cf6"/><circle cx="240" cy="150" r="6" fill="#8b5cf6"/>
      <line x1="66" y1="150" x2="234" y2="150" stroke="#8b5cf6" stroke-width="1.4"/>
      <text x="270" y="154" fill="#8b949e" font-size="9">layer 2: long jumps</text>
      <circle cx="60" cy="178" r="5" fill="#3b82f6"/><circle cx="140" cy="178" r="5" fill="#3b82f6"/><circle cx="240" cy="178" r="5" fill="#3b82f6"/>
      <line x1="65" y1="178" x2="135" y2="178" stroke="#3b82f6" stroke-width="1.2"/><line x1="145" y1="178" x2="235" y2="178" stroke="#3b82f6" stroke-width="1.2"/>
      <text x="270" y="182" fill="#8b949e" font-size="9">layer 1: medium hops</text>
      <circle cx="60" cy="204" r="4" fill="#22c55e"/><circle cx="105" cy="204" r="4" fill="#22c55e"/><circle cx="150" cy="204" r="4" fill="#22c55e"/><circle cx="195" cy="204" r="4" fill="#22c55e"/><circle cx="240" cy="204" r="4" fill="#22c55e"/>
      <line x1="63" y1="204" x2="237" y2="204" stroke="#22c55e" stroke-width="1"/>
      <text x="270" y="208" fill="#8b949e" font-size="9">layer 0: all vectors (refine)</text>
      <text x="150" y="234" fill="#8b949e" font-size="10" text-anchor="middle">~O(log N) · &gt;95% recall · 2–4× memory</text>
      <text x="560" y="120" fill="#f59e0b" font-size="12" font-weight="700" text-anchor="middle">IVF (cluster + probe)</text>
      <circle cx="500" cy="165" r="26" fill="none" stroke="#f59e0b" stroke-dasharray="4"/><text x="500" y="168" fill="#f59e0b" font-size="9" text-anchor="middle">C1</text>
      <circle cx="580" cy="150" r="26" fill="none" stroke="#22c55e" stroke-width="2"/><text x="580" y="153" fill="#22c55e" font-size="9" text-anchor="middle">C2 ✓</text>
      <circle cx="640" cy="200" r="26" fill="none" stroke="#f59e0b" stroke-dasharray="4"/><text x="640" y="203" fill="#f59e0b" font-size="9" text-anchor="middle">C3</text>
      <text x="580" y="240" fill="#8b949e" font-size="10" text-anchor="middle">probe only nearest clusters</text>
      <text x="380" y="284" fill="#8b949e" font-size="10" text-anchor="middle">FAISS (lib) · pgvector (Postgres) · Pinecone (managed) · Chroma (local)</text>
    </svg>`,
    diagramLegend: [
      { color: "#f85149", label: "Brute force", description: "Exact O(N·d) scan of every vector — accurate but too slow at scale." },
      { color: "#8b5cf6", label: "HNSW", description: "Layered proximity graph: ~O(log N) queries, >95% recall, 2–4× memory." },
      { color: "#f59e0b", label: "IVF", description: "Cluster vectors, probe only the nearest few — cheaper, lower recall." },
    ],
    codeExample: {
      language: "python",
      title: "pgvector: HNSW index and cosine top-K search",
      code: `-- Enable the extension
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE documents (
    id        SERIAL PRIMARY KEY,
    content   TEXT,
    embedding vector(1536),   -- match your embedding model's dimension
    metadata  JSONB
);

-- HNSW index for fast approximate cosine search
CREATE INDEX ON documents
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

-- Top-5 most similar, filtered by metadata (multi-tenant isolation)
SELECT content, 1 - (embedding <=> $1) AS cosine_similarity
FROM documents
WHERE metadata ->> 'tenant_id' = 'acme'
ORDER BY embedding <=> $1     -- <=> is cosine DISTANCE (smaller = closer)
LIMIT 5;`,
    },
    codeExamples: [
      {
        language: "python",
        tab: "Brute vs ANN",
        title: "Why exact search doesn't scale (and ANN does)",
        code: `import numpy as np, time

np.random.seed(0)
N, d = 200_000, 768
db = np.random.randn(N, d).astype("float32")
q = np.random.randn(d).astype("float32")

# Exact brute force: compare against ALL N vectors -> O(N*d)
t = time.time()
sims = db @ q / (np.linalg.norm(db, axis=1) * np.linalg.norm(q))
top5_exact = np.argsort(sims)[-5:][::-1]
print(f"brute force: {time.time()-t:.3f}s for {N:,} vectors")

# ANN (FAISS HNSW): builds a graph once, queries in ~O(log N)
import faiss
faiss.normalize_L2(db)
index = faiss.IndexHNSWFlat(d, 32)      # 32 = graph connectivity (M)
index.hnsw.efSearch = 64                # recall/latency knob
index.add(db)
t = time.time()
_, top5_ann = index.search(q.reshape(1, -1) / np.linalg.norm(q), 5)
print(f"HNSW ANN:    {time.time()-t:.4f}s (approximate top-5)")`,
      },
      {
        language: "python",
        tab: "FAISS: HNSW vs IVF",
        title: "Two ANN indexes, different tradeoffs",
        code: `import faiss, numpy as np

d, N = 768, 500_000
data = np.random.randn(N, d).astype("float32")
faiss.normalize_L2(data)

# HNSW: high recall, high memory, no training needed.
hnsw = faiss.IndexHNSWFlat(d, 32)
hnsw.hnsw.efConstruction = 64
hnsw.add(data)
print("HNSW ready: ~O(log N) queries, >95% recall, 2-4x memory")

# IVF: cluster into nlist buckets; probe nprobe of them at query time.
quantizer = faiss.IndexFlatIP(d)
ivf = faiss.IndexIVFFlat(quantizer, d, 1024)   # 1024 clusters
ivf.train(data)          # k-means over the corpus (required)
ivf.add(data)
ivf.nprobe = 16          # probe 16/1024 clusters: recall vs speed knob
print("IVF ready: cheaper memory, faster build, recall tuned by nprobe")`,
      },
      {
        language: "python",
        tab: "Chroma (local)",
        title: "Prototype quickly with an embedded DB + metadata filter",
        code: `import chromadb

client = chromadb.PersistentClient(path="./chroma_db")
col = client.get_or_create_collection(
    "docs", metadata={"hnsw:space": "cosine"})   # cosine distance

col.upsert(
    ids=["py1", "web1", "ops1"],
    documents=[
        "Python's GIL blocks true thread parallelism in CPython.",
        "FastAPI generates OpenAPI docs from type hints.",
        "Docker multi-stage builds shrink image size.",
    ],
    metadatas=[{"topic": "python"}, {"topic": "web"}, {"topic": "devops"}],
)

# Metadata filter narrows the search space before ANN ranking.
res = col.query(query_texts=["how does Python handle threads?"],
                n_results=2, where={"topic": "python"})
for doc, dist in zip(res["documents"][0], res["distances"][0]):
    print(f"[{1 - dist:.2f}] {doc}")`,
      },
    ],
    problemStatement:
      "You prototyped a RAG demo on 5,000 vectors with a NumPy brute-force cosine scan and it felt instant. In production you now have 40 million chunks across thousands of customers, and the same scan takes seconds per query while a teammate wants to keep everything in a FAISS index loaded in memory. Explain why brute force no longer works, choose and justify an ANN index (HNSW vs IVF) and its recall/memory tradeoff, describe how you would enforce per-customer isolation, and say why raw in-memory FAISS is risky for serving.",
    questions: [
      {
        q: "What is the core operation of a vector database?",
        options: [
          "A. Running SQL JOINs across relational tables",
          "B. Storing embedding vectors and returning the K nearest ones to a query vector (k-NN search)",
          "C. Compiling machine learning models",
          "D. Compressing raw document text",
        ],
        answer: "B",
        explanation:
          "B is correct: a vector DB stores embeddings (plus text/metadata) and answers nearest-neighbor queries — given a query vector, return the K most similar stored vectors, typically by cosine similarity.",
      },
      {
        q: "Why do vector databases use Approximate Nearest Neighbor (ANN) indexes instead of exact search?",
        options: [
          "A. ANN is always 100% accurate",
          "B. Exact brute-force search is O(N·d) per query and too slow at millions of vectors; ANN trades a little recall for large speedups",
          "C. ANN uses no memory",
          "D. Exact search cannot handle cosine similarity",
        ],
        answer: "B",
        explanation:
          "B is correct: comparing a query to every vector scales as O(N·d), which is infeasible online at scale. ANN gives near-perfect results far faster by accepting a small recall loss.",
      },
      {
        q: "How does HNSW achieve fast approximate search?",
        options: [
          "A. By compressing every vector to a single byte",
          "B. With a multi-layer proximity graph — sparse top layers make long jumps, dense lower layers refine — giving ~O(log N) queries and >95% recall",
          "C. By sorting all vectors alphabetically",
          "D. By fine-tuning the embedding model per query",
        ],
        answer: "B",
        explanation:
          "B is correct: HNSW navigates a hierarchical small-world graph, descending from coarse to fine layers. It offers ~O(log N) queries and high recall, at the cost of 2–4× memory for the graph edges.",
      },
      {
        q: "What is the main tradeoff of HNSW compared to IVF?",
        options: [
          "A. HNSW is slower to query than IVF",
          "B. HNSW gives higher recall but uses more memory (the graph); IVF uses less memory and builds faster but generally has lower recall",
          "C. HNSW cannot use cosine similarity",
          "D. IVF always has higher recall than HNSW",
        ],
        answer: "B",
        explanation:
          "B is correct: HNSW trades 2–4× memory for high recall and fast queries; IVF clusters vectors and probes only a few clusters, saving memory and build time but typically at lower recall (tuned by nprobe).",
      },
      {
        q: "Which vector store is the best fit for a team that already runs Postgres and has under a million vectors?",
        options: [
          "A. FAISS in-memory only",
          "B. pgvector — a Postgres extension that keeps vectors alongside relational data and adds ANN indexing",
          "C. A plain text file",
          "D. Redis without any vector support",
        ],
        answer: "B",
        explanation:
          "B is correct: pgvector adds vector search to existing Postgres, avoiding new infrastructure and enabling JOINs with relational data — ideal at that scale. FAISS lacks persistence/serving out of the box.",
      },
      {
        q: "Why is using raw FAISS risky as the store in a production serving system?",
        options: [
          "A. FAISS cannot compute similarity",
          "B. FAISS is an in-memory library with no built-in persistence — vectors are lost on restart unless you serialize and manage them yourself",
          "C. FAISS only supports 2-dimensional vectors",
          "D. FAISS cannot scale beyond 100 vectors",
        ],
        answer: "B",
        explanation:
          "B is correct: FAISS excels at fast in-memory ANN for research/batch, but it has no durable storage or serving layer. Production serving wants a persistent store (pgvector, Chroma, Pinecone) or a managed FAISS wrapper.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "ai-retrieval-evaluation",
    title: "Retrieval Evaluation & Reranking",
    shortLabel: "Retrieval Evaluation",
    section: "RAG — Retrieval-Augmented Generation",
    domain: "AI",
    tldr:
      "RAG fails in two separable places — retrieval (wrong chunks) and generation (right chunks, wrong answer) — so you must measure them independently. Retrieval metrics: Recall@K (did the relevant chunk make the top-K?), Precision@K (how much of top-K is relevant?), and rank-aware MRR / nDCG (is the right chunk near the top?). Generation metrics: faithfulness (every claim grounded in the context?) and answer relevance (does it address the question?). The highest-leverage fix for retrieval is a two-stage retrieve-then-rerank: fetch a cheap top-20 with the bi-encoder/ANN, then reorder with a cross-encoder reranker that reads (query, chunk) together and returns a precise top-3. Build a 50–100+ case eval set on your own data and score at scale with an LLM-as-judge.",
    subtopics: [
      {
        heading: "Two failure points, measured apart",
        bullets: [
          { icon: "🔀", text: "`query → [retrieval] → chunks → [generation] → answer`. A wrong answer is either **bad chunks** (retrieval) or **good chunks used badly** (generation) — never debug them together." },
          { icon: "🩺", text: "Diagnosis: **low Recall@K + faithful answer** → fix retrieval (embeddings, chunking, reranking). **High Recall@K + low faithfulness** → fix generation (prompt, model, citations)." },
          { icon: "🧪", text: "Build your **own eval set** (50–100+ representative cases with known relevant chunks) — it predicts production quality far better than any public leaderboard." },
        ],
      },
      {
        heading: "Retrieval metrics",
        bullets: [
          { icon: "🎯", text: "**Recall@K** = fraction of relevant chunks that appear in the top-K (did we *find* it?). **Precision@K** = fraction of top-K that is relevant (how much *noise*?)." },
          { icon: "🥇", text: "**MRR** (Mean Reciprocal Rank) rewards putting the first relevant chunk high — 1/rank of the first hit. **nDCG** rewards ranking *all* relevant chunks near the top, discounted by position." },
          { icon: "📊", text: "Rank matters because the LLM attends most to the top of the context; a relevant chunk buried at position 18 is nearly as useless as one not retrieved." },
        ],
      },
      {
        heading: "Reranking: the retrieve-then-rerank pattern",
        bullets: [
          { icon: "⚡", text: "**Stage 1 (recall):** bi-encoder + ANN embeds query and chunks *separately* and fetches a cheap, broad **top-20/50** — fast but coarse." },
          { icon: "🔬", text: "**Stage 2 (precision):** a **cross-encoder reranker** reads the (query, chunk) pair *together* through a transformer, scoring true relevance far more accurately, then keeps the **top-3**." },
          { icon: "💡", text: "Why two stages: cross-encoders are too slow to score millions of chunks, so you use fast ANN for recall then expensive reranking on just the shortlist. Big precision win for modest cost." },
        ],
      },
    ],
    keyFacts: [
      { label: "Recall@K", value: "Did the relevant chunk make top-K?", icon: "🎯" },
      { label: "MRR / nDCG", value: "Is it ranked near the top?", icon: "🥇" },
      { label: "Faithfulness", value: "Every claim grounded in context?", icon: "🩺" },
      { label: "Reranking", value: "Cheap top-20 → cross-encoder top-3", icon: "🔬" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'Two RAG failure points?' → **retrieval** vs **generation** — measure apart.",
        "'Recall@K vs Precision@K?' → **found it** vs **how much noise**.",
        "'Why MRR/nDCG?' → **rank matters**; top of context is read best.",
        "'Bi- vs cross-encoder?' → separate vs **joint** (query,chunk) scoring.",
        "Pattern: **retrieve broad (ANN) → rerank narrow (cross-encoder)**.",
      ],
      analogyBrief:
        "Retrieve-then-rerank is a hiring funnel: a cheap keyword screen surfaces 20 résumés, then a careful interviewer reads each against the role to pick the top 3.",
    },
    explanation:
      "Because a RAG system can fail in two distinct places — retrieval (the wrong chunks are fetched) and generation (the right chunks are fetched but the answer is still wrong) — the cardinal rule of RAG evaluation is to measure the two independently, since the fixes are completely different: a retrieval failure calls for better embeddings, chunking, or reranking, while a generation failure calls for a better system prompt, a stronger model, or stricter citation requirements. The way you diagnose which is broken is to look at retrieval and generation metrics side by side: if retrieval recall is low the model never even saw the relevant text (fix retrieval), whereas if recall is high but the answer's faithfulness is low the model is ignoring or misusing good context (fix generation). On the retrieval side the key metrics are Recall@K, the fraction of the truly relevant chunks that appear anywhere in the top-K results (did we find it at all?), and Precision@K, the fraction of the top-K that is actually relevant (how much noise did we pull in?); because K is small and the two trade off, you also want rank-aware metrics. Mean Reciprocal Rank (MRR) is the average of 1/rank of the first relevant result, rewarding systems that put a relevant chunk at or near position one, and normalized Discounted Cumulative Gain (nDCG) rewards ranking all relevant chunks near the top with a logarithmic positional discount; rank matters in RAG specifically because LLMs attend most strongly to the beginning of their context, so a relevant chunk buried at position eighteen is nearly as useless as one that was never retrieved. On the generation side the two core metrics are faithfulness (is every claim in the answer supported by the retrieved context, i.e. no hallucination?) and answer relevance (does the answer actually address the question?), both commonly scored with an LLM-as-judge against a rubric. The single highest-leverage technique for improving retrieval precision is the two-stage retrieve-then-rerank pattern. The first stage optimizes recall cheaply: a bi-encoder embeds the query and every chunk separately (offline for chunks), and ANN search returns a broad shortlist of, say, the top twenty or fifty candidates quickly. The second stage optimizes precision: a cross-encoder reranker takes each (query, chunk) pair and runs them through a transformer together, so attention can directly compare the query against the chunk's tokens and produce a far more accurate relevance score than comparing two independent vectors; you then keep only the top three. The reason for splitting into two stages is efficiency — a cross-encoder is far too slow to score millions of chunks, so you use fast approximate search to get from millions to twenty, then spend the expensive, accurate reranker only on that shortlist, buying a large precision gain for a modest, bounded cost. Underpinning all of this, you should build your own evaluation set of fifty to a hundred or more representative queries with their known-relevant chunks drawn from your actual corpus, because it predicts your production quality far better than any public leaderboard, and you can score it at scale with an LLM-as-judge that correlates well with human ratings.",
    analogy:
      "Retrieve-then-rerank is exactly how good hiring works. You post a job and get thousands of applicants (your whole corpus). You cannot interview them all, so a cheap automated screen — keyword and résumé matching — surfaces a longlist of twenty plausible candidates fast; that stage is about recall, making sure the great candidate isn't screened out, even if some mediocre ones slip through. Then an experienced interviewer sits down with each of the twenty and evaluates them against the specific role, reading the candidate and the job description together and forming a nuanced judgment; that stage is about precision, and it is far too expensive to run on thousands of people, which is why you only do it on the shortlist. Recall@K asks 'was the best candidate anywhere in our longlist?', MRR and nDCG ask 'did we rank them near the top so the hiring manager actually reads them?', and faithfulness is the manager only making claims about the candidate that the interview actually supports.",
    diagram: `<svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Two RAG failure points and the retrieve-then-rerank pipeline">${svgDefs}
      <text x="380" y="22" fill="#e6edf3" font-size="13" font-weight="700" text-anchor="middle">Measure retrieval and generation separately</text>
      ${box(30, 42, 120, 46, "Query", "user question", "#22c55e")}
      ${box(190, 42, 160, 46, "Retrieval", "recall / precision", "#8b5cf6")}
      ${box(390, 42, 160, 46, "Generation", "faithful / relevant", "#3b82f6")}
      ${box(590, 42, 140, 46, "Answer", "graded", "#f59e0b")}
      <line x1="150" y1="65" x2="188" y2="65" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="350" y1="65" x2="388" y2="65" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="550" y1="65" x2="588" y2="65" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="270" y="104" fill="#f85149" font-size="10" text-anchor="middle">failure 1: wrong chunks</text>
      <text x="470" y="104" fill="#f85149" font-size="10" text-anchor="middle">failure 2: right chunks, wrong answer</text>
      <text x="380" y="146" fill="#e6edf3" font-size="12" font-weight="700" text-anchor="middle">Retrieve-then-rerank</text>
      ${box(30, 162, 130, 54, "Bi-encoder + ANN", "fast, broad", "#22c55e")}
      ${box(210, 162, 140, 54, "Top-20 candidates", "recall stage", "#8b5cf6")}
      ${box(400, 162, 160, 54, "Cross-encoder", "reads (q,chunk) jointly", "#f85149")}
      ${box(610, 162, 120, 54, "Top-3", "precision", "#22c55e")}
      <line x1="160" y1="189" x2="208" y2="189" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="350" y1="189" x2="398" y2="189" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="560" y1="189" x2="608" y2="189" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="380" y="252" fill="#8b949e" font-size="11" font-weight="600" text-anchor="middle">Metrics</text>
      <text x="200" y="276" fill="#8b949e" font-size="10" text-anchor="middle">Recall@K · Precision@K</text>
      <text x="430" y="276" fill="#8b949e" font-size="10" text-anchor="middle">MRR · nDCG (rank-aware)</text>
      <text x="620" y="276" fill="#8b949e" font-size="10" text-anchor="middle">Faithfulness · Relevance</text>
      <text x="380" y="302" fill="#8b949e" font-size="10" text-anchor="middle">Cross-encoders are too slow for millions of chunks — rerank only the shortlist</text>
    </svg>`,
    diagramLegend: [
      { color: "#8b5cf6", label: "Retrieval stage", description: "Bi-encoder + ANN fetch a broad top-20; scored by Recall@K / Precision@K." },
      { color: "#f85149", label: "Cross-encoder rerank", description: "Reads (query, chunk) jointly for precise relevance; keeps the top-3." },
      { color: "#3b82f6", label: "Generation stage", description: "Given good chunks, scored by faithfulness and answer relevance." },
    ],
    codeExample: {
      language: "python",
      title: "Retrieval metrics: Recall@K, Precision@K, MRR",
      code: `def recall_at_k(retrieved_ids, relevant_ids, k):
    top = retrieved_ids[:k]
    hits = sum(1 for r in relevant_ids if r in top)
    return hits / len(relevant_ids) if relevant_ids else 0.0

def precision_at_k(retrieved_ids, relevant_ids, k):
    top = retrieved_ids[:k]
    hits = sum(1 for r in top if r in relevant_ids)
    return hits / k

def reciprocal_rank(retrieved_ids, relevant_ids):
    for rank, doc_id in enumerate(retrieved_ids, start=1):
        if doc_id in relevant_ids:
            return 1.0 / rank        # first relevant hit
    return 0.0

retrieved = ["d7", "d3", "d1", "d9", "d2"]   # ranked results
relevant  = {"d1", "d2"}                      # ground truth

print("Recall@5   :", recall_at_k(retrieved, relevant, 5))     # 1.0 (both found)
print("Precision@5:", precision_at_k(retrieved, relevant, 5))  # 0.4 (2 of 5)
print("MRR (this q):", reciprocal_rank(retrieved, relevant))   # 1/3 (first hit @3)`,
    },
    codeExamples: [
      {
        language: "python",
        tab: "Retrieval metrics",
        title: "Recall@K, Precision@K, MRR, nDCG",
        code: `import numpy as np

def recall_at_k(retrieved, relevant, k):
    top = set(retrieved[:k])
    return len(top & relevant) / len(relevant) if relevant else 0.0

def precision_at_k(retrieved, relevant, k):
    return len(set(retrieved[:k]) & relevant) / k

def mrr(retrieved, relevant):
    for rank, d in enumerate(retrieved, 1):
        if d in relevant:
            return 1.0 / rank
    return 0.0

def ndcg_at_k(retrieved, relevant, k):
    dcg = sum((1.0 if d in relevant else 0.0) / np.log2(i + 1)
              for i, d in enumerate(retrieved[:k], start=1))
    ideal = sum(1.0 / np.log2(i + 1)
                for i in range(1, min(len(relevant), k) + 1))
    return dcg / ideal if ideal else 0.0

retrieved = ["d7", "d1", "d3", "d2", "d9"]
relevant  = {"d1", "d2"}
print("Recall@5   :", round(recall_at_k(retrieved, relevant, 5), 3))
print("Precision@5:", round(precision_at_k(retrieved, relevant, 5), 3))
print("MRR        :", round(mrr(retrieved, relevant), 3))     # 0.5 (first @2)
print("nDCG@5     :", round(ndcg_at_k(retrieved, relevant, 5), 3))`,
      },
      {
        language: "python",
        tab: "Cross-encoder rerank",
        title: "Two-stage: ANN recall then cross-encoder precision",
        code: `from sentence_transformers import CrossEncoder

# Stage 1 (recall): fast bi-encoder + ANN already gave a broad shortlist.
candidates = [
    "FastAPI supports async/await for non-blocking requests.",
    "Use connection pooling and async DB drivers to cut API latency.",
    "FastAPI auto-generates OpenAPI docs from type hints.",
    "Profile endpoints with py-spy to find bottlenecks.",
    "Pydantic validation adds ~1ms per request.",
]   # e.g. top-20 from the vector DB

# Stage 2 (precision): cross-encoder reads (query, chunk) TOGETHER.
reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")
query = "Why is my FastAPI app slow?"
scores = reranker.predict([(query, c) for c in candidates])

ranked = sorted(zip(scores, candidates), reverse=True)
for score, chunk in ranked[:3]:          # keep only the top-3
    print(f"{score:6.2f}  {chunk}")
# The latency/pooling/profiling chunks rise to the top; docs/validation sink.`,
      },
      {
        language: "python",
        tab: "LLM-as-judge",
        title: "Score faithfulness & relevance at scale",
        code: `from anthropic import Anthropic
claude = Anthropic()

def judge(prompt):
    r = claude.messages.create(
        model="claude-haiku-4-5", max_tokens=8, temperature=0,
        messages=[{"role": "user", "content": prompt}])
    return float(r.content[0].text.strip())

def faithfulness(answer, context):
    return judge(
        "Rate 0.0-1.0: is EVERY claim in the answer supported by the "
        f"context?\\nContext: {context}\\nAnswer: {answer}\\nNumber only.")

def answer_relevance(question, answer):
    return judge(
        "Rate 0.0-1.0: does the answer address the question?\\n"
        f"Q: {question}\\nA: {answer}\\nNumber only.")

ctx = "The GIL is a CPython mutex preventing parallel thread execution."
ans = "The GIL is a CPython mutex that blocks true parallel threads."
print("faithfulness:", faithfulness(ans, ctx))          # ~1.0
print("relevance   :", answer_relevance("What is the GIL?", ans))  # ~1.0`,
      },
    ],
    problemStatement:
      "Your RAG bot returns wrong answers about 30% of the time and the team is split: half want a bigger LLM, half want a better embedding model. You measure and find Recall@10 is 0.92 but the relevant chunk is usually ranked 7th–9th, and faithfulness is only 0.6. Diagnose whether this is a retrieval or generation problem (or both), explain why a high Recall@10 with poor rank is still hurting you, and propose concrete fixes including where a cross-encoder reranker fits.",
    questions: [
      {
        q: "Why should retrieval and generation be evaluated separately in RAG?",
        options: [
          "A. It is faster to run one metric",
          "B. They fail for different reasons and need different fixes — bad chunks (retrieval) vs right chunks used badly (generation)",
          "C. They cannot both be measured on the same query",
          "D. Generation quality does not matter",
        ],
        answer: "B",
        explanation:
          "B is correct: separating them lets you diagnose the true cause. Low recall means fix retrieval (embeddings/chunking/reranking); high recall but low faithfulness means fix generation (prompt/model/citations).",
      },
      {
        q: "What does Recall@K measure?",
        options: [
          "A. The fraction of the top-K results that are relevant",
          "B. The fraction of all relevant chunks that appear within the top-K retrieved results",
          "C. The average rank of the first relevant chunk",
          "D. Whether the final answer is grounded",
        ],
        answer: "B",
        explanation:
          "B is correct: Recall@K asks whether we found the relevant chunks (how many of them landed in the top-K). Precision@K is the complementary 'how much of the top-K is relevant' measure.",
      },
      {
        q: "Why are rank-aware metrics like MRR and nDCG important in RAG, beyond plain Recall@K?",
        options: [
          "A. They are easier to compute",
          "B. LLMs attend most to the top of the context, so a relevant chunk ranked low is nearly as useless as one not retrieved — rank matters",
          "C. They ignore relevance entirely",
          "D. They only apply to keyword search",
        ],
        answer: "B",
        explanation:
          "B is correct: MRR and nDCG reward putting relevant chunks near the top. Because models read the start of the context best, a relevant chunk buried deep contributes little even if Recall@K counts it.",
      },
      {
        q: "How does a cross-encoder reranker differ from the bi-encoder used for initial retrieval?",
        options: [
          "A. A cross-encoder embeds the query and chunk separately, like a bi-encoder",
          "B. A cross-encoder reads the (query, chunk) pair together through the transformer, so attention compares them directly for a more accurate relevance score",
          "C. A cross-encoder does not use a transformer",
          "D. There is no difference",
        ],
        answer: "B",
        explanation:
          "B is correct: a bi-encoder encodes query and chunk into separate vectors (fast, enables ANN), while a cross-encoder processes them jointly, letting attention directly compare tokens — more accurate but too slow to run over the whole corpus.",
      },
      {
        q: "Why use a two-stage retrieve-then-rerank pipeline instead of reranking everything?",
        options: [
          "A. Cross-encoders are too slow to score millions of chunks, so fast ANN narrows to a shortlist that the reranker can afford to score precisely",
          "B. Bi-encoders are more accurate than cross-encoders",
          "C. Reranking reduces recall",
          "D. It avoids using embeddings at all",
        ],
        answer: "A",
        explanation:
          "A is correct: you use cheap ANN for recall (millions → ~20), then spend the expensive, accurate cross-encoder only on that shortlist to get precise top-3 — a large precision gain at bounded cost.",
      },
      {
        q: "Recall@10 is 0.9 but faithfulness is 0.55. What is the most likely fix?",
        options: [
          "A. Improve the embedding model — retrieval is failing",
          "B. Improve generation — the right chunks are being retrieved but the model is not grounding its answer in them; tighten the prompt, require citations, or use a stronger model",
          "C. Increase K to 100",
          "D. Nothing — these numbers are fine",
        ],
        answer: "B",
        explanation:
          "B is correct: high recall means retrieval is working, but low faithfulness means the model is hallucinating or ignoring the good context. That is a generation problem — fix the prompt, enforce citations, or upgrade the model.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "ai-context-injection",
    title: "Context Injection & Citations",
    shortLabel: "Context Injection",
    section: "RAG — Retrieval-Augmented Generation",
    domain: "AI",
    tldr:
      "Retrieving good chunks is only half the job — how you assemble them into the prompt determines the answer. Build a clear structure: system instructions (answer only from the context, cite sources, say 'I don't know' if absent) + labeled context blocks ([Doc 1], [Doc 2]…) + the question. Beware 'lost in the middle': LLMs recall the start and end of long contexts far better than the middle, so order matters — put the strongest chunks first (and optionally last), and keep K small. Require inline citations like [Doc 2] so every claim is traceable and verifiable, and always give the model an explicit escape hatch to abstain rather than fabricate.",
    subtopics: [
      {
        heading: "Assembling the prompt",
        bullets: [
          { icon: "🧱", text: "**Three parts:** a system instruction (rules), the retrieved **context blocks** (clearly delimited and labeled `[Doc N]`), and the user's **question** — in that order, visually separated." },
          { icon: "📜", text: "The system prompt must state the contract: **answer only from the provided context**, **cite the source of each claim**, and **say 'I don't know' if the answer isn't present**." },
          { icon: "🌡️", text: "Use **temperature 0** for grounded Q&A (deterministic, less drift) and set a sane `max_tokens`. Delimit each chunk (e.g. `[Doc 1] …`) so the model can reference it precisely." },
        ],
      },
      {
        heading: "Lost in the middle",
        bullets: [
          { icon: "🎢", text: "**Lost in the middle:** models recall information at the **start and end** of a long context much better than the **middle** — a U-shaped accuracy curve." },
          { icon: "🥇", text: "Practical response: keep **K small**, **rank strongest chunks first** (and optionally duplicate the top one at the end), and don't dump 30 chunks hoping the model finds the needle." },
          { icon: "📉", text: "More context is not always better: irrelevant chunks add noise and distraction, often *lowering* accuracy even when the answer is technically present." },
        ],
      },
      {
        heading: "Citations & abstention",
        bullets: [
          { icon: "🔗", text: "**Inline citations** (`[Doc 2]`) make every claim **traceable** — users can verify, and you can programmatically check the answer only cites retrieved docs." },
          { icon: "🚪", text: "**Give an escape hatch:** without an explicit 'if it's not in the context, say you don't have that information' instruction, the model fills gaps with confident hallucination." },
          { icon: "🛡️", text: "Prefer structured citation formats (doc id + span) so you can render source links and **detect uncited or fabricated claims** downstream." },
        ],
      },
    ],
    keyFacts: [
      { label: "Prompt shape", value: "System + labeled context + question", icon: "🧱" },
      { label: "Lost in middle", value: "Best recall at start/end", icon: "🎢" },
      { label: "Escape hatch", value: "Explicit 'say I don't know'", icon: "🚪" },
      { label: "Citations", value: "Inline [Doc N] → verifiable", icon: "🔗" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'Prompt structure?' → **system rules + labeled context + question**.",
        "'Lost in the middle?' → recall dips in the **middle** of long context.",
        "'Fix it?' → small K, **strongest chunks first**, rerank, dedupe.",
        "'Stop hallucination?' → require citations + an explicit **'I don't know'**.",
        "Grounded Q&A uses **temperature 0** and delimited `[Doc N]` blocks.",
      ],
      analogyBrief:
        "It is an open-book exam: hand the student a tidy, tabbed packet with the best pages on top, tell them to cite page numbers, and to write 'not in the packet' rather than guess.",
    },
    explanation:
      "Once retrieval has returned good chunks, the way you inject them into the prompt largely determines the quality of the answer, and this context-assembly step is where many otherwise-good RAG systems quietly fail. A well-formed RAG prompt has three clearly separated parts: a system instruction that states the rules, the retrieved context presented as clearly delimited and labeled blocks (for example each chunk prefixed with [Doc 1], [Doc 2], and so on, ideally with its source metadata), and finally the user's question. The system instruction should encode an explicit contract — answer using only the information in the provided context, cite the source of each claim, and if the answer is not present in the context, say you do not have that information rather than guessing — and for grounded question answering you typically run at temperature 0 for determinism and set a sensible max_tokens. A crucial phenomenon to design around is 'lost in the middle': empirical studies show that LLMs retrieve information placed at the very beginning or very end of a long context far more reliably than information buried in the middle, producing a U-shaped accuracy curve as a function of position. This has direct practical consequences: keep K small so the context stays short, rank the strongest chunks first (some systems also duplicate the single best chunk at the end to exploit both high-recall positions), and resist the temptation to stuff thirty chunks into the prompt in the hope that the model will locate the needle — more context is not automatically better, because irrelevant chunks add noise and can actively distract the model and lower accuracy even when the true answer is technically present somewhere in the pile. The other half of good context injection is citations and abstention. Requiring inline citations such as [Doc 2] after each claim makes the answer traceable: a human can click through to verify, and you can programmatically check that the answer only cites documents that were actually retrieved, flagging any claim that cites nothing or cites a document not in the context as a likely hallucination. Equally important is giving the model an explicit escape hatch — the instruction to say 'I don't have that information' when the context does not contain the answer — because without it the model's default behavior is to fill the gap with fluent, confident, and wrong text; the single most common and most damaging omission in production RAG prompts is leaving out this abstention instruction. Preferring a structured citation format (a document id plus the specific span or section) rather than free-form prose citations makes it possible to render real source links in the UI and to build automated faithfulness checks that catch uncited or fabricated claims before they reach the user.",
    analogy:
      "Context injection is running an open-book exam well. You have already fetched the relevant pages (retrieval); now you decide how to hand them over. A careless proctor dumps a disordered heap of thirty photocopies on the desk and says 'the answer's in there somewhere' — the student, overwhelmed, skims, misses the key page in the middle of the stack, and pads the answer with plausible-sounding filler. A good proctor hands over a slim, tabbed packet with the three most relevant pages clipped on top, instructs the student to write the page number next to every fact they use (citations), and — crucially — tells them to write 'this isn't in the packet' instead of inventing an answer when the material isn't there (the escape hatch). 'Lost in the middle' is just the well-known fact that a tired reader remembers the first and last pages of a long packet far better than page seventeen, so you put the best material where it will actually be read.",
    diagram: `<svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Prompt assembly and the lost-in-the-middle recall curve">${svgDefs}
      <text x="380" y="22" fill="#e6edf3" font-size="13" font-weight="700" text-anchor="middle">Assemble the prompt; place strong chunks where recall is high</text>
      ${box(30, 42, 200, 44, "System instructions", "rules + escape hatch", "#f59e0b")}
      ${box(30, 100, 200, 44, "Context [Doc 1..K]", "labeled, ranked", "#8b5cf6")}
      ${box(30, 158, 200, 44, "Question", "user query", "#22c55e")}
      <line x1="130" y1="86" x2="130" y2="98" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="130" y1="144" x2="130" y2="156" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(30, 216, 200, 44, "LLM (temp 0)", "cited, grounded answer", "#3b82f6")}
      <line x1="130" y1="202" x2="130" y2="214" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="530" y="60" fill="#e6edf3" font-size="12" font-weight="700" text-anchor="middle">Lost in the middle</text>
      <rect x="330" y="80" width="400" height="180" rx="8" fill="#1a2332" stroke="#8b5cf6"/>
      <path d="M360 120 Q400 240 530 240 Q660 240 700 120" fill="none" stroke="#22c55e" stroke-width="2.5"/>
      <text x="360" y="112" fill="#22c55e" font-size="10" text-anchor="middle">high</text>
      <text x="700" y="112" fill="#22c55e" font-size="10" text-anchor="middle">high</text>
      <text x="530" y="258" fill="#f85149" font-size="10" text-anchor="middle">low (middle)</text>
      <text x="360" y="278" fill="#8b949e" font-size="10">start</text>
      <text x="510" y="278" fill="#8b949e" font-size="10">context position</text>
      <text x="690" y="278" fill="#8b949e" font-size="10">end</text>
      <text x="530" y="300" fill="#8b949e" font-size="9" text-anchor="middle">recall accuracy vs where the chunk sits in the context</text>
    </svg>`,
    diagramLegend: [
      { color: "#f59e0b", label: "System instructions", description: "Rules: answer only from context, cite, and abstain if absent." },
      { color: "#8b5cf6", label: "Context blocks", description: "Labeled, ranked [Doc N] chunks — strongest first to beat lost-in-the-middle." },
      { color: "#22c55e", label: "High-recall zone", description: "Start and end of the context are read best; place key chunks there." },
    ],
    codeExample: {
      language: "python",
      title: "Assemble a grounded, citation-requiring prompt",
      code: `from anthropic import Anthropic
claude = Anthropic()

SYSTEM = (
    "Answer the question using ONLY the numbered documents below.\\n"
    "- Cite the source of every claim inline as [Doc N].\\n"
    "- If the answer is NOT in the documents, reply exactly: "
    "'I don't have that information.'\\n"
    "- Do not use outside knowledge."
)

def build_prompt(question, chunks):
    # Strongest chunk first (beats 'lost in the middle'); label each block.
    context = "\\n\\n".join(f"[Doc {i+1}] {c}" for i, c in enumerate(chunks))
    return f"Documents:\\n{context}\\n\\nQuestion: {question}"

def answer(question, chunks):
    resp = claude.messages.create(
        model="claude-sonnet-5",
        max_tokens=400,
        temperature=0,                 # deterministic for grounded Q&A
        system=SYSTEM,
        messages=[{"role": "user", "content": build_prompt(question, chunks)}],
    )
    return resp.content[0].text

chunks = ["The GIL is a CPython mutex preventing parallel thread execution.",
          "For CPU-bound work, use multiprocessing instead of threads."]
print(answer("How should I parallelize CPU-bound Python work?", chunks))
# -> "Use multiprocessing rather than threads [Doc 2], because the GIL
#     prevents true parallel thread execution [Doc 1]."`,
    },
    codeExamples: [
      {
        language: "python",
        tab: "Order for recall",
        title: "Rank strongest chunks to high-recall positions",
        code: `def order_for_recall(chunks_with_scores):
    """chunks_with_scores: list of (text, relevance_score), any order."""
    ranked = sorted(chunks_with_scores, key=lambda x: x[1], reverse=True)
    ordered = [c for c, _ in ranked]

    # Optional trick: also place the single best chunk at the END,
    # since recall is high at both start and end of the context.
    if len(ordered) >= 3:
        ordered = ordered[:] + [ordered[0]]
    return ordered

chunks = [("mid-relevance chunk", 0.55),
          ("BEST chunk", 0.93),
          ("weak chunk", 0.20),
          ("good chunk", 0.78)]

for i, c in enumerate(order_for_recall(chunks), 1):
    print(f"[Doc {i}] {c}")
# Best chunk lands at position 1 (and repeated at the end),
# weak chunk sinks toward the low-recall middle.`,
      },
      {
        language: "python",
        tab: "Verify citations",
        title: "Reject answers that cite non-retrieved docs",
        code: `import re

def check_citations(answer, num_docs):
    """Every [Doc N] must reference a doc that was actually provided,
       and the answer must cite at least one source."""
    cited = [int(n) for n in re.findall(r"\\[Doc (\\d+)\\]", answer)]
    if not cited:
        return False, "no citations - possible ungrounded answer"
    invalid = [n for n in cited if n < 1 or n > num_docs]
    if invalid:
        return False, f"cites non-existent docs: {invalid} (had {num_docs})"
    return True, "ok"

print(check_citations("The GIL blocks threads [Doc 1].", num_docs=2))
# (True, 'ok')
print(check_citations("Python was made in 1991 [Doc 5].", num_docs=2))
# (False, 'cites non-existent docs: [5] (had 2)')  -> likely hallucination
print(check_citations("It runs faster somehow.", num_docs=2))
# (False, 'no citations - possible ungrounded answer')`,
      },
      {
        language: "python",
        tab: "Escape hatch",
        title: "Force abstention when context is missing",
        code: `from anthropic import Anthropic
claude = Anthropic()

# WITHOUT an escape hatch the model tends to invent an answer.
BAD_SYSTEM = "Answer the question using the documents."

# WITH an explicit abstention rule it declines instead of fabricating.
GOOD_SYSTEM = (
    "Answer ONLY from the documents and cite as [Doc N]. "
    "If the answer is not present, reply exactly: "
    "'I don't have that information.'")

def ask(system, question, chunks):
    ctx = "\\n".join(f"[Doc {i+1}] {c}" for i, c in enumerate(chunks))
    r = claude.messages.create(
        model="claude-sonnet-5", max_tokens=200, temperature=0,
        system=system,
        messages=[{"role": "user",
                   "content": f"Docs:\\n{ctx}\\n\\nQ: {question}"}])
    return r.content[0].text

chunks = ["The GIL prevents parallel threads in CPython."]
q = "What year was Python released?"        # NOT in the context
print("bad :", ask(BAD_SYSTEM,  q, chunks))  # risks a confident wrong year
print("good:", ask(GOOD_SYSTEM, q, chunks))  # -> "I don't have that information."`,
      },
    ],
    problemStatement:
      "Your RAG system retrieves the correct chunk (verified: it's in the context at position 12 of 20) yet the LLM still answers wrong, and when the answer isn't in the corpus it confidently invents one. Explain the two distinct problems here, describe how 'lost in the middle' and prompt structure cause the first, and specify the exact system-prompt instructions and citation checks you would add to fix both — including how you'd programmatically detect a hallucinated citation.",
    questions: [
      {
        q: "What three parts should a well-structured RAG prompt contain?",
        options: [
          "A. Only the retrieved chunks",
          "B. System instructions (rules), the labeled retrieved context blocks, and the user's question",
          "C. The question repeated three times",
          "D. The model's previous answers only",
        ],
        answer: "B",
        explanation:
          "B is correct: a clear contract in the system prompt, delimited/labeled context ([Doc N]), and the question — visually separated — gives the model the structure it needs to ground and cite its answer.",
      },
      {
        q: "What is the 'lost in the middle' effect?",
        options: [
          "A. Chunks in the middle of a document are never retrieved",
          "B. LLMs recall information at the start and end of a long context far better than information placed in the middle",
          "C. The vector database drops middle results",
          "D. Tokenizers ignore the middle of the text",
        ],
        answer: "B",
        explanation:
          "B is correct: accuracy follows a U-shape versus position — strong at the beginning and end, weak in the middle. So order chunks with the strongest first (and optionally last) and keep the context short.",
      },
      {
        q: "Why is 'more retrieved context' not always better?",
        options: [
          "A. It always improves accuracy, so it is always better",
          "B. Irrelevant chunks add noise and distraction, and long contexts worsen the lost-in-the-middle effect, often lowering accuracy",
          "C. It reduces the token bill",
          "D. It makes citations impossible",
        ],
        answer: "B",
        explanation:
          "B is correct: padding the prompt with marginal chunks dilutes relevance, distracts the model, and buries the needle in the low-recall middle — small, well-ranked K usually beats a large dump.",
      },
      {
        q: "What is the single most common and damaging omission in production RAG system prompts?",
        options: [
          "A. Forgetting to set max_tokens",
          "B. Leaving out an explicit instruction to say 'I don't know' when the answer isn't in the context, so the model hallucinates to fill the gap",
          "C. Using temperature 0",
          "D. Labeling documents as [Doc N]",
        ],
        answer: "B",
        explanation:
          "B is correct: without an explicit abstention/escape-hatch instruction, the model's default is to produce a fluent, confident, wrong answer. Telling it to decline when the context lacks the answer is essential.",
      },
      {
        q: "Why require inline citations like [Doc 2] in RAG answers?",
        options: [
          "A. They make the answer longer",
          "B. They make each claim traceable and verifiable, and let you programmatically check the answer only cites documents that were actually retrieved",
          "C. They improve the embedding model",
          "D. They are required by the vector database",
        ],
        answer: "B",
        explanation:
          "B is correct: citations let humans verify claims and let you auto-detect ungrounded answers — for example flagging any answer that cites a document not present in the context as a likely hallucination.",
      },
      {
        q: "Which prompt setting is most appropriate for grounded, factual RAG question answering?",
        options: [
          "A. High temperature (e.g., 1.0) for creativity",
          "B. Temperature 0 for deterministic, less-drifting answers anchored to the provided context",
          "C. Temperature does not affect RAG at all",
          "D. Randomizing temperature per request",
        ],
        answer: "B",
        explanation:
          "B is correct: for grounded Q&A you want deterministic, faithful output, so temperature 0 (or near-0) reduces drift and creative fabrication. High temperature is for open-ended generation, not factual grounding.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "ai-hybrid-search",
    title: "Hybrid Search — BM25 + Semantic",
    shortLabel: "Hybrid Search",
    section: "RAG — Retrieval-Augmented Generation",
    domain: "AI",
    tldr:
      "Dense (semantic) search matches meaning — great for paraphrases ('automobile' ≈ 'car') but weak on exact tokens like error codes, SKUs, or rare names. Sparse lexical search (BM25) matches exact terms with smart term weighting but is blind to synonyms. Hybrid search runs both and fuses the results, giving you semantic recall plus exact-term precision. Two fusion styles: weighted score combination (normalize each score, then `α·dense + (1−α)·sparse`) or Reciprocal Rank Fusion (RRF), which merges by rank position and needs no score normalization. Hybrid is the default for technical corpora full of identifiers, jargon, and codes.",
    subtopics: [
      {
        heading: "Two kinds of retrieval",
        bullets: [
          { icon: "🧠", text: "**Dense / semantic:** embed query and chunks, rank by vector similarity. Catches **meaning and paraphrase** ('how to speed up my API' ≈ 'reduce latency') but can miss exact tokens." },
          { icon: "🔤", text: "**Sparse / lexical (BM25):** ranks by exact term overlap with TF-IDF-style weighting plus length normalization. Nails **error codes, IDs, names, jargon** — but is blind to synonyms." },
          { icon: "🧩", text: "They fail in **opposite** ways, so combining them covers each other's blind spots — the essence of hybrid search." },
        ],
      },
      {
        heading: "What BM25 actually does",
        bullets: [
          { icon: "⚖️", text: "**BM25** = term frequency (more matches → higher, but with **saturation** so repeats give diminishing returns) × **IDF** (rare terms weigh more) × **document-length normalization** (long docs don't win just by being long)." },
          { icon: "🎯", text: "It is exact-match: searching **'CUDA error 11'** finds the doc containing that literal string, which a purely semantic search might rank below generic GPU articles." },
          { icon: "🚫", text: "Its weakness is the mirror image: it cannot connect **'car'** to **'automobile'** because there is zero lexical overlap." },
        ],
      },
      {
        heading: "Fusing the two",
        bullets: [
          { icon: "🎚️", text: "**Weighted combination:** min-max normalize dense and sparse scores to [0,1], then `score = α·dense + (1−α)·sparse` (α≈0.5–0.7). Simple, tunable, but sensitive to normalization." },
          { icon: "🔗", text: "**Reciprocal Rank Fusion (RRF):** `score = Σ 1/(k + rank)` across lists (k≈60). Uses only **rank position**, so no score normalization needed — robust and widely used." },
          { icon: "🏭", text: "Hybrid is the **default for technical domains** (docs with error codes, SKUs, API names). Engines like Weaviate, Qdrant, and OpenSearch support it natively; often pair with a reranker." },
        ],
      },
    ],
    keyFacts: [
      { label: "Dense", value: "Semantic; catches paraphrase", icon: "🧠" },
      { label: "Sparse (BM25)", value: "Exact terms, IDF + length norm", icon: "🔤" },
      { label: "Weighted fuse", value: "α·dense + (1−α)·sparse", icon: "🎚️" },
      { label: "RRF", value: "Σ 1/(k+rank); no normalization", icon: "🔗" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'When does BM25 beat vectors?' → **exact terms**: codes, IDs, names.",
        "'When do vectors beat BM25?' → **synonyms/paraphrase** (car ≈ automobile).",
        "'What is BM25?' → TF (saturating) × **IDF** × length normalization.",
        "'Fuse how?' → **weighted α** or **RRF** (rank-based, no norm).",
        "Hybrid is the **default for technical corpora**; add a reranker on top.",
      ],
      analogyBrief:
        "Hybrid search is asking both a subject-matter expert (meaning) and a meticulous index clerk (exact words), then merging their picks so neither's blind spot sinks you.",
    },
    explanation:
      "The two families of retrieval fail in opposite ways, which is exactly why combining them works. Dense or semantic retrieval embeds the query and the chunks into vectors and ranks by similarity, so it understands meaning and handles paraphrase beautifully — a query like 'how do I make my API faster?' will match a document about 'reducing response latency' even with no shared words — but because it operates on compressed meaning it can under-rank documents that hinge on an exact token, such as a specific error code, product SKU, function name, or a rare proper noun, since those precise strings get blurred into the surrounding semantics. Sparse or lexical retrieval, epitomized by BM25, is the mirror image: it scores documents by exact term overlap with the query, so it excels at finding the one document that literally contains 'CUDA error 11' or 'invoice #48213', but it is completely blind to synonyms and paraphrase, because 'car' and 'automobile' share no tokens and therefore score zero against each other. BM25 itself is a refined bag-of-words ranking function with three ingredients: term frequency, but with saturation so that the tenth occurrence of a word adds far less than the second (a document isn't ten times more relevant for repeating a word ten times); inverse document frequency (IDF), so that rare, discriminative terms count for much more than common ones like 'the'; and document-length normalization, so that long documents don't rank highly merely because they contain more words. Hybrid search runs both a dense and a sparse retriever and fuses their results so that semantic recall and exact-term precision reinforce each other, covering the blind spots of each. There are two common fusion methods. Weighted score combination normalizes the dense and sparse scores to a common range (typically min-max scaling to [0,1], because raw cosine similarities and BM25 scores live on entirely different scales) and then computes a convex combination, score = α·dense + (1−α)·sparse, where α around 0.5 to 0.7 is a tunable dial between meaning and exactness; it is simple and interpretable but sensitive to how you normalize. Reciprocal Rank Fusion (RRF) sidesteps normalization entirely by combining only the rank positions: each document's fused score is the sum over the retrievers of 1/(k + rank), with a small constant k (commonly 60) that dampens the influence of very top ranks, so a document that appears near the top of either list rises, and RRF's insensitivity to raw score magnitudes makes it robust and a very popular default. Hybrid search is essentially the standard choice for technical corpora — documentation, code, support tickets, catalogs — precisely because those are dense with identifiers, error codes, jargon, and exact names that pure semantic search fumbles, and search engines like Weaviate, Qdrant, and OpenSearch support hybrid retrieval natively; in a strong pipeline you retrieve with hybrid search for the best of both worlds and then apply a cross-encoder reranker to the fused shortlist for final precision.",
    analogy:
      "Hybrid search is like getting help from two very different librarians and then combining their recommendations. The first is a brilliant subject-matter expert who understands what you actually mean: ask her for books on 'making cars go faster' and she'll hand you titles about engines, aerodynamics, and 'automobile performance' even though none say 'go faster' — but ask for the exact document numbered 'ISO-14229' and she waves vaguely, because she thinks in concepts, not codes. The second is a meticulous index clerk who has memorized every exact word in the building: give him 'ISO-14229' or 'CUDA error 11' and he walks straight to it, but ask for 'making cars go faster' and he only finds books using those precise words, missing 'automobile performance' entirely. Neither alone is reliable; asking both and merging their shortlists (by weighted score or by rank) gives you the expert's grasp of meaning and the clerk's exactness at once.",
    diagram: `<svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Hybrid search fuses dense semantic and sparse BM25 retrieval">${svgDefs}
      <text x="380" y="22" fill="#e6edf3" font-size="13" font-weight="700" text-anchor="middle">Hybrid search: dense semantic + sparse BM25, then fuse</text>
      ${box(300, 45, 160, 46, "Query", "user question", "#22c55e")}
      <line x1="360" y1="91" x2="230" y2="120" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="400" y1="91" x2="520" y2="120" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(90, 122, 220, 52, "Dense / semantic", "meaning · paraphrase", "#3b82f6")}
      ${box(450, 122, 220, 52, "Sparse / BM25", "exact terms · codes/IDs", "#f59e0b")}
      <text x="200" y="192" fill="#8b949e" font-size="9" text-anchor="middle">catches: automobile ≈ car</text>
      <text x="560" y="192" fill="#8b949e" font-size="9" text-anchor="middle">catches: 'CUDA error 11'</text>
      <line x1="200" y1="196" x2="330" y2="220" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="560" y1="196" x2="430" y2="220" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(280, 222, 200, 50, "Fuse", "α·dense+(1−α)·sparse or RRF", "#8b5cf6")}
      <text x="380" y="292" fill="#8b949e" font-size="10" text-anchor="middle">RRF merges by rank (no score normalization); often followed by a reranker</text>
    </svg>`,
    diagramLegend: [
      { color: "#3b82f6", label: "Dense / semantic", description: "Vector similarity — matches meaning and paraphrase, weak on exact tokens." },
      { color: "#f59e0b", label: "Sparse / BM25", description: "Exact term overlap with IDF + length normalization — strong on codes/IDs, blind to synonyms." },
      { color: "#8b5cf6", label: "Fusion", description: "Weighted α combination or rank-based RRF merges both result lists." },
    ],
    codeExample: {
      language: "python",
      title: "Hybrid search: weighted fusion of BM25 + dense scores",
      code: `import numpy as np
from rank_bm25 import BM25Okapi

def hybrid_search(query, documents, doc_vectors, embed_fn, alpha=0.6, k=5):
    # --- Dense (semantic) scores ---
    q_vec = embed_fn([query])[0]
    dense = doc_vectors @ q_vec / (
        np.linalg.norm(doc_vectors, axis=1) * np.linalg.norm(q_vec))

    # --- Sparse (BM25) scores ---
    bm25 = BM25Okapi([d.lower().split() for d in documents])
    sparse = np.array(bm25.get_scores(query.lower().split()))

    # --- Normalize each to [0,1] (they live on different scales) ---
    def norm(x):
        return (x - x.min()) / (x.max() - x.min() + 1e-9)

    combined = alpha * norm(dense) + (1 - alpha) * norm(sparse)
    top = np.argsort(combined)[-k:][::-1]
    return [(documents[i], float(combined[i])) for i in top]

docs = ["Reduce API latency with async DB drivers and connection pooling.",
        "Resolve CUDA error 11 by matching driver and toolkit versions.",
        "Cars and automobiles both benefit from aerodynamic design."]
for doc, score in hybrid_search("fix CUDA error 11", docs, embed(docs), embed):
    print(f"{score:.3f}  {doc}")`,
    },
    codeExamples: [
      {
        language: "python",
        tab: "Weighted fusion",
        title: "α dials between meaning and exactness",
        code: `import numpy as np

def norm(x):
    x = np.asarray(x, dtype=float)
    return (x - x.min()) / (x.max() - x.min() + 1e-9)

# Precomputed per-doc scores from each retriever (already aligned by doc).
dense  = [0.91, 0.40, 0.55]   # semantic similarity
sparse = [0.10, 0.95, 0.05]   # BM25 (doc 2 has the exact term)

for alpha in (0.2, 0.5, 0.8):
    fused = alpha * norm(dense) + (1 - alpha) * norm(sparse)
    winner = int(np.argmax(fused))
    print(f"alpha={alpha}: fused={np.round(fused,2)} -> doc {winner+1} wins")
# Low alpha favors exact-term doc 2; high alpha favors semantic doc 1.
# Tune alpha (~0.5-0.7) on your own eval set.`,
      },
      {
        language: "python",
        tab: "RRF (rank fusion)",
        title: "Merge by rank — no score normalization needed",
        code: `def reciprocal_rank_fusion(result_lists, k=60):
    """result_lists: list of ranked doc-id lists from each retriever."""
    scores = {}
    for ranked in result_lists:
        for rank, doc_id in enumerate(ranked, start=1):
            scores[doc_id] = scores.get(doc_id, 0.0) + 1.0 / (k + rank)
    return sorted(scores, key=scores.get, reverse=True)

dense_ranked  = ["d1", "d3", "d2", "d5"]   # semantic ranking
sparse_ranked = ["d2", "d1", "d4", "d3"]   # BM25 ranking

fused = reciprocal_rank_fusion([dense_ranked, sparse_ranked])
print("RRF order:", fused)
# d1 and d2 rank high in BOTH lists -> they rise to the top,
# using only positions, so cosine vs BM25 scale mismatch never matters.`,
      },
      {
        language: "python",
        tab: "Why hybrid wins",
        title: "Exact codes vs synonyms — each retriever's blind spot",
        code: `# Illustrative: which retriever finds the right doc for each query type.
cases = [
    # (query, best_doc, dense_finds_it, bm25_finds_it)
    ("how to make my API faster", "latency-tuning", True,  False),  # synonym
    ("CUDA error 11",             "cuda-err-11",    False, True),   # exact code
    ("SKU-90210 return policy",   "returns-90210",  False, True),   # exact ID
    ("reduce automobile drag",    "aero-cars",      True,  False),  # paraphrase
]
for q, doc, dense_ok, bm25_ok in cases:
    hybrid_ok = dense_ok or bm25_ok   # union of both retrievers' hits
    print(f"{q:32s} dense={dense_ok!s:5} bm25={bm25_ok!s:5} "
          f"hybrid={hybrid_ok}")
# Neither alone gets all four; hybrid (union then fuse) covers every case.`,
      },
    ],
    problemStatement:
      "Your semantic-only RAG search works well for how-to questions but repeatedly fails when users paste exact error codes, part numbers, or API function names — those queries return generic, topically-similar docs instead of the one document containing the literal string. Explain why pure dense retrieval struggles with exact tokens, how BM25 complements it, and design a hybrid retrieval step: choose a fusion method (weighted vs RRF), justify it, and say where a reranker fits.",
    questions: [
      {
        q: "When does pure semantic (dense) retrieval tend to underperform?",
        options: [
          "A. On paraphrased questions with synonyms",
          "B. On queries hinging on exact tokens — error codes, SKUs, function names, rare proper nouns — which get blurred into surrounding semantics",
          "C. It never underperforms",
          "D. On questions about meaning",
        ],
        answer: "B",
        explanation:
          "B is correct: dense retrieval matches meaning, so it excels at synonyms/paraphrase but can under-rank the one document containing a literal, discriminative string like 'CUDA error 11'.",
      },
      {
        q: "What are the three main components of the BM25 scoring function?",
        options: [
          "A. Embedding similarity, softmax, and dropout",
          "B. Term frequency (with saturation), inverse document frequency (IDF), and document-length normalization",
          "C. Cosine distance, Euclidean distance, and dot product",
          "D. Learning rate, batch size, and epochs",
        ],
        answer: "B",
        explanation:
          "B is correct: BM25 weights matches by saturating term frequency, boosts rare/discriminative terms via IDF, and normalizes for document length so long docs don't win just by being long.",
      },
      {
        q: "Why does combining dense and sparse retrieval (hybrid search) work well?",
        options: [
          "A. Because they are identical methods run twice",
          "B. Because they fail in opposite ways — dense catches meaning/synonyms, sparse catches exact terms — so together they cover each other's blind spots",
          "C. Because it halves the number of documents",
          "D. Because it removes the need for embeddings",
        ],
        answer: "B",
        explanation:
          "B is correct: semantic search misses exact tokens and lexical search misses synonyms; fusing them yields both semantic recall and exact-term precision.",
      },
      {
        q: "In weighted hybrid fusion, why must dense and BM25 scores be normalized before combining?",
        options: [
          "A. To make the query shorter",
          "B. Because cosine similarities and BM25 scores live on completely different scales, so combining raw values would let one dominate arbitrarily",
          "C. Normalization is not needed",
          "D. To convert them into token IDs",
        ],
        answer: "B",
        explanation:
          "B is correct: raw cosine (~0–1) and BM25 (unbounded) are incomparable, so you min-max normalize each to [0,1] before computing α·dense + (1−α)·sparse; otherwise the larger-scaled score swamps the other.",
      },
      {
        q: "What is the key advantage of Reciprocal Rank Fusion (RRF) over weighted score combination?",
        options: [
          "A. It requires training a neural network",
          "B. It fuses using only rank positions (Σ 1/(k+rank)), so it needs no score normalization and is robust to differing score scales",
          "C. It ignores one of the two retrievers",
          "D. It only works for dense retrieval",
        ],
        answer: "B",
        explanation:
          "B is correct: RRF combines rank positions rather than raw scores, sidestepping the normalization problem entirely and making it a robust, popular default for fusing heterogeneous retrievers.",
      },
      {
        q: "For which kind of corpus is hybrid search most clearly the right default?",
        options: [
          "A. Short casual chit-chat with no technical terms",
          "B. Technical corpora full of identifiers, error codes, SKUs, jargon, and exact API names alongside conceptual content",
          "C. Corpora with only images",
          "D. Any corpus where synonyms never appear",
        ],
        answer: "B",
        explanation:
          "B is correct: technical documentation, code, tickets, and catalogs mix conceptual questions with exact identifiers, so you need both semantic recall and exact-term matching — hybrid search, often plus a reranker.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "ai-rag-failures",
    title: "Failure Modes & Grounding",
    shortLabel: "RAG Failure Modes",
    section: "RAG — Retrieval-Augmented Generation",
    domain: "AI",
    tldr:
      "RAG systems fail in four characteristic ways, each with a different fix. (1) Retrieval failure — the right chunk never makes the top-K (fix: chunking, embeddings, hybrid search, reranking). (2) Generation failure — good chunks are retrieved but the model misreads or ignores them (fix: prompt, citations, stronger model). (3) Coverage failure — the answer isn't in the corpus and the model fabricates instead of abstaining (fix: an explicit 'I don't know' escape hatch and a relevance threshold). (4) Context dilution — too many low-quality chunks swamp the signal (fix: smaller K, reranking, similarity threshold). Grounding — keeping every claim traceable to retrieved evidence — is the throughline; enforce it with citations, faithfulness checks, and confidence thresholds.",
    subtopics: [
      {
        heading: "The four failure modes",
        bullets: [
          { icon: "🎯", text: "**1. Retrieval failure:** the relevant chunk isn't in the top-K. Root causes: bad chunking, weak embeddings, vocabulary mismatch, no metadata filter." },
          { icon: "✍️", text: "**2. Generation failure:** the right chunk *is* retrieved, but the model misinterprets or ignores it and answers wrongly anyway." },
          { icon: "🕳️", text: "**3. Coverage failure:** the answer simply isn't in the corpus, and instead of saying so the model **hallucinates** a confident answer." },
        ],
      },
      {
        heading: "Dilution & diagnosis",
        bullets: [
          { icon: "🌊", text: "**4. Context dilution:** too many chunks (or too many weak ones) bury the useful signal and worsen 'lost in the middle', dragging quality down." },
          { icon: "🩺", text: "**Diagnose with metrics:** low Recall@K → mode 1; high recall + low faithfulness → mode 2; query has no supporting chunk yet an answer appears → mode 3; quality drops as K grows → mode 4." },
          { icon: "🔧", text: "**Each mode has its own fix** — don't apply a generation fix to a retrieval problem. Measure first, then target the actual failing stage." },
        ],
      },
      {
        heading: "Grounding — the throughline",
        bullets: [
          { icon: "⚓", text: "**Grounding** = every claim in the answer is traceable to a retrieved chunk. It is what makes RAG trustworthy and is the common thread across all four fixes." },
          { icon: "🚦", text: "**Confidence gating:** if the top similarity is below a threshold (e.g. 0.5), abstain or warn ('I found nothing relevant') instead of generating from weak context." },
          { icon: "✅", text: "**Enforce it:** require inline citations, run a **faithfulness check** (LLM-as-judge: is every claim supported?), and reject answers citing non-retrieved docs. Graceful degradation beats confident nonsense." },
        ],
      },
    ],
    keyFacts: [
      { label: "Mode 1", value: "Retrieval: chunk not in top-K", icon: "🎯" },
      { label: "Mode 2", value: "Generation: good chunk, bad answer", icon: "✍️" },
      { label: "Mode 3", value: "Coverage: not in corpus → hallucinate", icon: "🕳️" },
      { label: "Mode 4", value: "Dilution: too many chunks", icon: "🌊" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'Four RAG failure modes?' → **retrieval, generation, coverage, dilution**.",
        "'Not in corpus?' → **coverage failure**; fix with an escape hatch + threshold.",
        "'Right chunk, wrong answer?' → **generation**; fix prompt/citations/model.",
        "'What is grounding?' → every claim **traceable to retrieved evidence**.",
        "Gate on **top similarity**; abstain below threshold, don't fabricate.",
      ],
      analogyBrief:
        "Grounding is a journalist's rule: no claim without a source you can point to — and 'we couldn't confirm it' is a valid, honest answer.",
    },
    explanation:
      "Production RAG systems fail in four characteristic ways, and because each has a different root cause and a different fix, the most valuable diagnostic skill is telling them apart rather than blindly turning knobs. The first is retrieval failure: the chunk that actually contains the answer never makes it into the top-K, so the model is doomed from the start — the causes are poor chunking (the answer was split awkwardly or buried in a huge chunk), weak or mismatched embeddings, a vocabulary gap between how the user phrased the query and how the document is written, or the absence of a metadata filter that would have surfaced the right subset; the fixes live entirely in the retrieval stage — better chunking, a stronger embedding model, hybrid search to catch exact terms, query expansion or HyDE to bridge vocabulary, and reranking to reorder the shortlist. The second is generation failure: retrieval succeeds and the correct chunk is present in the context, but the model misinterprets it, overlooks it (often because of lost-in-the-middle positioning), or contradicts it, producing a wrong answer despite having the right evidence in front of it; the fixes live in the generation stage — a sharper system prompt, an explicit instruction to answer only from the context, required citations that force the model to point at its evidence, better chunk ordering, or a more capable model. The third is coverage failure: the answer simply is not present anywhere in the corpus, and instead of admitting that, the model fabricates a fluent, confident, and wrong answer — this is arguably the most dangerous mode because the output looks authoritative; the fix is to give the model an explicit escape hatch (instructing it to say it does not have the information when the context lacks the answer) and to add a relevance/confidence threshold so that when even the best retrieved chunk is weak, the system abstains or warns rather than generating from thin air. The fourth is context dilution: too many chunks, or too many marginal ones, are stuffed into the prompt, burying the genuinely useful signal in noise, worsening the lost-in-the-middle effect, and lowering answer quality even though the correct information is technically present; the fix is a smaller K, a similarity threshold that filters out weak matches, and reranking so that only the few best chunks reach the model. You diagnose which mode you are in by reading retrieval and generation metrics together: low Recall@K points to mode one, high recall with low faithfulness points to mode two, a query with no genuinely supporting chunk that nonetheless produces a confident answer points to mode three, and quality that degrades as you increase K points to mode four. Running through all four is the concept of grounding — the property that every claim in the answer is traceable back to a specific retrieved chunk — which is precisely what makes a RAG system trustworthy rather than a fluent guesser. You enforce grounding operationally with three habits: require inline citations so each claim names its source and can be verified; run a faithfulness check (commonly an LLM-as-judge asking whether every claim in the answer is supported by the context) and reject or flag answers that cite documents which were not actually retrieved; and apply confidence gating on the top similarity score so the system degrades gracefully — a candid 'I couldn't find anything relevant to that' is a far better outcome than a confident hallucination.",
    analogy:
      "Grounding is the discipline of a good investigative journalist, and the four failure modes are the four ways a story goes wrong. Retrieval failure is the researcher never pulling the right file from the archive, so the reporter writes without the key evidence. Generation failure is the reporter having the right document on the desk but misreading it and printing the wrong conclusion anyway. Coverage failure is the most dangerous: the facts simply aren't confirmable, and instead of writing 'we could not verify this', the reporter invents a confident, quotable claim. Context dilution is burying the one crucial memo under a hundred irrelevant printouts until nobody notices it. The professional's rule that prevents all four is grounding: no claim goes to print without a source you can point to, every sentence is checkable against its evidence, and 'we don't have that information' is an honest, acceptable answer — vastly better than fabricating one that sounds authoritative and turns out to be false.",
    diagram: `<svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The four RAG failure modes across the pipeline and grounding checks">${svgDefs}
      <text x="380" y="22" fill="#e6edf3" font-size="13" font-weight="700" text-anchor="middle">Four failure modes — each fails at a different stage</text>
      ${box(30, 48, 130, 46, "Query", "user question", "#22c55e")}
      ${box(210, 48, 150, 46, "Retrieve top-K", "vector / hybrid", "#8b5cf6")}
      ${box(410, 48, 150, 46, "Generate", "LLM answers", "#3b82f6")}
      ${box(610, 48, 120, 46, "Answer", "grounded?", "#f59e0b")}
      <line x1="160" y1="71" x2="208" y2="71" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="360" y1="71" x2="408" y2="71" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="560" y1="71" x2="608" y2="71" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(180, 118, 210, 44, "1. Retrieval failure", "right chunk not in top-K", "#f85149")}
      ${box(410, 118, 210, 44, "2. Generation failure", "good chunk, wrong answer", "#f85149")}
      ${box(180, 176, 210, 44, "3. Coverage failure", "not in corpus → fabricate", "#f85149")}
      ${box(410, 176, 210, 44, "4. Context dilution", "too many chunks → noise", "#f85149")}
      <text x="380" y="248" fill="#22c55e" font-size="12" font-weight="700" text-anchor="middle">Grounding guardrails</text>
      <text x="380" y="270" fill="#8b949e" font-size="10" text-anchor="middle">require citations · faithfulness check · abstain below similarity threshold</text>
      <text x="380" y="288" fill="#8b949e" font-size="10" text-anchor="middle">every claim must trace to a retrieved chunk — else say 'I don't know'</text>
    </svg>`,
    diagramLegend: [
      { color: "#8b5cf6", label: "Retrieval stage", description: "Modes 1 & 4 originate here: missing chunks or too many diluting ones." },
      { color: "#3b82f6", label: "Generation stage", description: "Modes 2 & 3 originate here: misusing good chunks or fabricating when none exist." },
      { color: "#22c55e", label: "Grounding guardrails", description: "Citations, faithfulness checks, and confidence gating keep answers traceable." },
    ],
    codeExample: {
      language: "python",
      title: "Confidence gating + faithfulness = graceful grounding",
      code: `from anthropic import Anthropic
claude = Anthropic()

SIM_THRESHOLD = 0.5   # below this, the corpus likely lacks the answer

def grounded_answer(question, retrieved):
    """retrieved: list of (chunk_text, similarity), best first."""
    # Mode 3 guard (coverage): nothing relevant -> abstain, don't fabricate.
    if not retrieved or retrieved[0][1] < SIM_THRESHOLD:
        return {"answer": "I don't have information on that.",
                "confidence": "none", "top_sim": retrieved[0][1] if retrieved else 0}

    # Mode 4 guard (dilution): keep only strong chunks, cap K small.
    chunks = [c for c, s in retrieved if s >= SIM_THRESHOLD][:4]
    context = "\\n".join(f"[Doc {i+1}] {c}" for i, c in enumerate(chunks))

    resp = claude.messages.create(
        model="claude-sonnet-5", max_tokens=400, temperature=0,
        system=("Answer ONLY from the docs and cite as [Doc N]. "
                "If not present, say: 'I don't have that information.'"),
        messages=[{"role": "user",
                   "content": f"Docs:\\n{context}\\n\\nQ: {question}"}])
    return {"answer": resp.content[0].text,
            "confidence": "high" if retrieved[0][1] > 0.8 else "medium",
            "top_sim": round(retrieved[0][1], 3)}

print(grounded_answer("What is the GIL?",
    [("The GIL is a CPython mutex blocking parallel threads.", 0.88)]))
print(grounded_answer("What is our 2027 revenue forecast?",
    [("Unrelated doc about office locations.", 0.31)]))  # abstains`,
    },
    codeExamples: [
      {
        language: "python",
        tab: "Diagnose the mode",
        title: "Use metrics to identify which failure you have",
        code: `def diagnose(recall_at_k, faithfulness, has_supporting_chunk,
             quality_drops_with_more_k):
    """Map metric signatures to the four RAG failure modes."""
    if recall_at_k < 0.6:
        return ("MODE 1 retrieval failure: relevant chunk not in top-K. "
                "Fix: chunking, embeddings, hybrid search, reranking.")
    if recall_at_k >= 0.8 and faithfulness < 0.7:
        return ("MODE 2 generation failure: right chunks, wrong answer. "
                "Fix: prompt, require citations, stronger model, ordering.")
    if not has_supporting_chunk:
        return ("MODE 3 coverage failure: answer not in corpus. "
                "Fix: escape hatch + similarity threshold to abstain.")
    if quality_drops_with_more_k:
        return ("MODE 4 context dilution: too many/weak chunks. "
                "Fix: smaller K, similarity threshold, reranking.")
    return "Healthy: retrieval and generation both look fine."

print(diagnose(recall_at_k=0.95, faithfulness=0.55,
               has_supporting_chunk=True, quality_drops_with_more_k=False))
# -> MODE 2 generation failure ...`,
      },
      {
        language: "python",
        tab: "Faithfulness check",
        title: "Reject ungrounded or wrongly-cited answers",
        code: `import re
from anthropic import Anthropic
claude = Anthropic()

def is_grounded(answer, context, num_docs):
    # 1) Structural check: citations must reference real docs.
    cited = [int(n) for n in re.findall(r"\\[Doc (\\d+)\\]", answer)]
    if not cited or any(n < 1 or n > num_docs for n in cited):
        return False, "bad or missing citations"

    # 2) Semantic check: LLM-as-judge verifies every claim is supported.
    r = claude.messages.create(
        model="claude-haiku-4-5", max_tokens=8, temperature=0,
        messages=[{"role": "user", "content":
            "Is EVERY claim in the answer supported by the context? "
            f"Reply 1.0 or 0.0 only.\\nContext:\\n{context}\\nAnswer:\\n{answer}"}])
    score = float(r.content[0].text.strip())
    return score >= 0.8, f"faithfulness={score}"

ctx = "[Doc 1] The GIL blocks parallel threads in CPython."
ok, why = is_grounded("The GIL blocks parallel threads [Doc 1].", ctx, 1)
print(ok, why)   # True faithfulness=1.0
ok, why = is_grounded("Python was released in 1991 [Doc 1].", ctx, 1)
print(ok, why)   # False faithfulness=0.0  -> hallucination, reject`,
      },
      {
        language: "python",
        tab: "Layered fixes",
        title: "A defense-in-depth checklist per failure mode",
        code: `RAG_DEFENSES = {
    "retrieval": [                       # mode 1
        "tune chunk size + overlap",
        "stronger embedding model",
        "hybrid search (BM25 + dense)",
        "cross-encoder reranking",
        "query expansion / HyDE",
    ],
    "generation": [                      # mode 2
        "answer-only-from-context prompt",
        "require inline [Doc N] citations",
        "rank strongest chunks first",
        "use a more capable model",
    ],
    "coverage": [                        # mode 3
        "explicit 'I don't know' escape hatch",
        "similarity threshold to abstain",
    ],
    "dilution": [                        # mode 4
        "smaller K (3-5)",
        "similarity threshold filter",
        "rerank then keep top-3",
    ],
}
for mode, fixes in RAG_DEFENSES.items():
    print(f"{mode.upper()}:")
    for f in fixes:
        print(f"  - {f}")`,
      },
    ],
    problemStatement:
      "Your RAG assistant occasionally gives confidently wrong answers, and leadership wants a single 'make it accurate' fix. You know RAG fails in distinct ways. Lay out the four failure modes, describe the metric signature that identifies each, and for a specific incident — a user asked about a policy that doesn't exist in the corpus and got a detailed fabricated answer — identify the failure mode and specify the exact guardrails (escape hatch, similarity threshold, citations, faithfulness check) you would add so the system abstains instead.",
    questions: [
      {
        q: "A RAG system's relevant chunk is never in the top-K results. Which failure mode is this, and where is the fix?",
        options: [
          "A. Generation failure — fix the prompt",
          "B. Retrieval failure — fix chunking, embeddings, hybrid search, or reranking",
          "C. Coverage failure — the answer isn't in the corpus",
          "D. Context dilution — reduce K",
        ],
        answer: "B",
        explanation:
          "B is correct: if the relevant chunk never reaches the top-K, the problem is in retrieval. Fixes are all in that stage: better chunking, stronger embeddings, hybrid search, query expansion, or reranking.",
      },
      {
        q: "The correct chunk is retrieved and present in the context, but the model still answers wrongly. What is this?",
        options: [
          "A. Retrieval failure",
          "B. Generation failure — the model misreads or ignores good context; fix the prompt, require citations, reorder chunks, or use a stronger model",
          "C. Coverage failure",
          "D. A vector database bug",
        ],
        answer: "B",
        explanation:
          "B is correct: good chunks plus a wrong answer is a generation-stage problem. Sharpen the system prompt, force citations, fix chunk ordering (lost-in-the-middle), or upgrade the model.",
      },
      {
        q: "Which failure mode is the most dangerous, and why?",
        options: [
          "A. Context dilution, because it is expensive",
          "B. Coverage failure — the answer isn't in the corpus and the model fabricates a fluent, confident, authoritative-looking wrong answer",
          "C. Retrieval failure, because it is rare",
          "D. Generation failure, because it is always obvious",
        ],
        answer: "B",
        explanation:
          "B is correct: coverage failure produces confident fabrication that looks trustworthy, so it slips past users. The fix is an explicit escape hatch plus a confidence/similarity threshold so the system abstains.",
      },
      {
        q: "Answer quality gets worse as you increase K from 5 to 30. Which failure mode is this?",
        options: [
          "A. Retrieval failure",
          "B. Context dilution — too many low-quality chunks bury the signal and worsen lost-in-the-middle; fix with smaller K, a similarity threshold, and reranking",
          "C. Coverage failure",
          "D. It is impossible for more context to hurt",
        ],
        answer: "B",
        explanation:
          "B is correct: piling on marginal chunks adds noise and distraction and worsens the middle-context recall dip. Keep K small, filter by similarity, and rerank to keep only the best few.",
      },
      {
        q: "What does 'grounding' mean in a RAG system?",
        options: [
          "A. Running the system on physical hardware",
          "B. Every claim in the answer is traceable to a specific retrieved chunk of evidence",
          "C. Using the largest possible model",
          "D. Storing vectors on disk instead of memory",
        ],
        answer: "B",
        explanation:
          "B is correct: grounding is the property that answers are backed by and traceable to retrieved evidence, which is what makes RAG trustworthy rather than a fluent guesser. Citations and faithfulness checks enforce it.",
      },
      {
        q: "Which combination of guardrails best prevents confident hallucination when the corpus lacks the answer?",
        options: [
          "A. A larger K and a higher temperature",
          "B. An explicit 'say I don't know' instruction, a top-similarity threshold to abstain below, required citations, and a faithfulness check that rejects wrongly-cited answers",
          "C. Removing the system prompt entirely",
          "D. Embedding the query twice",
        ],
        answer: "B",
        explanation:
          "B is correct: coverage failure is countered by giving the model an escape hatch, gating on confidence so weak retrievals trigger abstention, and enforcing grounding with citations plus a faithfulness check that catches fabricated or misattributed claims.",
      },
    ],
  },
];
