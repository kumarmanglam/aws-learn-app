// ============================================================
// SECTION: LLM Integration — Calling the Claude API, Streaming
// & Async, Tool Use / Function Calling, Prompt Caching & Token
// Cost. Authored against the current Anthropic Messages API
// (Claude Opus 4.8 / Sonnet 5 / Haiku 4.5) to the
// ai-fundamentals.ts / messaging.ts bar.
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

export const aiLlmIntegrationTopics: Topic[] = [
  // -----------------------------------------------------------------
  {
    id: "ai-llm-api",
    title: "Calling the LLM API — Anthropic Messages API",
    shortLabel: "Calling the LLM API",
    section: "LLM Integration",
    domain: "AI",
    tldr:
      "Every Claude app is a POST to the Messages API: client.messages.create(model, max_tokens, system, messages). The API is stateless — you resend the whole conversation every turn. The response carries content (a list of blocks), usage.input_tokens / output_tokens for cost, and stop_reason ('end_turn', 'max_tokens', 'tool_use', 'refusal'). max_tokens is required and caps output. On current models (Opus 4.8, Sonnet 5) sampling params like temperature are removed — you steer with prompting. Always catch typed errors (RateLimitError, APIStatusError) and back off on 429.",
    subtopics: [
      {
        heading: "The one endpoint everything goes through",
        bullets: [
          { icon: "📮", text: "**`client.messages.create(...)`** (Python `anthropic`) / **`anthropic.messages.create(...)`** (TS `@anthropic-ai/sdk`) hits `POST /v1/messages`. Required: **`model`**, **`max_tokens`**, **`messages`**. The `system` prompt is a **separate top-level parameter**, not a message." },
          { icon: "🧱", text: "The response's **`content` is a list of blocks**, not a string — read `response.content[0].text` for a plain text answer, and narrow by `block.type` (`text` vs `tool_use`) before touching fields." },
          { icon: "🛑", text: "**`stop_reason`** tells you why generation ended: `end_turn` (done), `max_tokens` (hit the cap — raise it), `tool_use` (wants a tool), `refusal` (declined). Branch on it before reading content." },
        ],
      },
      {
        heading: "Stateless — you carry the history",
        bullets: [
          { icon: "🔁", text: "The API has **no memory**. To continue a conversation you resend **every prior user/assistant turn** in `messages`; the model only sees what's in this request." },
          { icon: "🧑‍🤝‍🧑", text: "Roles alternate **user → assistant → user …**; the first message must be `user`. Append each `assistant` reply back into `messages` before the next turn." },
          { icon: "💰", text: "Because you resend history, **input tokens grow every turn** — `usage.input_tokens` (billed at the input rate) and `usage.output_tokens` (billed higher) are your per-call cost signal." },
        ],
      },
      {
        heading: "Models, limits & robustness",
        bullets: [
          { icon: "🏷️", text: "Use exact model IDs: **`claude-opus-4-8`** (most capable), **`claude-sonnet-5`** (balanced), **`claude-haiku-4-5`** (fast/cheap). Never invent date suffixes on the aliases." },
          { icon: "🌡️", text: "On **Opus 4.8 / Sonnet 5**, `temperature`/`top_p`/`top_k` are **removed and return a 400** — steer behavior through the prompt, not sampling knobs. `max_tokens` is still an enforced output ceiling." },
          { icon: "🧯", text: "Catch **typed exceptions** most-specific first: `RateLimitError` (429 — back off), `APIStatusError` (other 4xx/5xx), `APIConnectionError` (network). The SDK already auto-retries 429/5xx with backoff." },
        ],
      },
    ],
    keyFacts: [
      { label: "Core call", value: "client.messages.create(...)", icon: "📮" },
      { label: "Statefulness", value: "Stateless — resend full history", icon: "🔁" },
      { label: "Cost signal", value: "usage.input_tokens / output_tokens", icon: "💰" },
      { label: "Sampling on Opus 4.8", value: "temperature removed (400)", icon: "🌡️" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'How do I call Claude?' → **`client.messages.create(model, max_tokens, messages)`**.",
        "'Where's the system prompt?' → a **separate top-level `system` param**, not a message.",
        "'Why resend everything?' → the API is **stateless**; no server-side memory.",
        "'How do I read the answer?' → **`response.content[0].text`** (content is a block list).",
        "'429 in prod?' → catch **`RateLimitError`**, exponential backoff (SDK retries too).",
      ],
      analogyBrief:
        "An API call is ordering at a counter with no memory: the `system` prompt is the house rules, `messages` is your whole order restated each time, and the response ticket shows the dish plus the token bill.",
    },
    explanation:
      "Building on Claude means making requests to a single endpoint, the Messages API (POST /v1/messages), through the official SDK: in Python you call client.messages.create(...) on an anthropic.Anthropic() client, and in TypeScript anthropic.messages.create(...) on a new Anthropic() client, both of which read the API key from the ANTHROPIC_API_KEY environment variable by default. Three fields are required — model (an exact ID such as claude-opus-4-8, claude-sonnet-5, or claude-haiku-4-5), max_tokens (a hard ceiling on how many tokens the model may generate, not a target), and messages (the conversation so far) — while the system prompt is passed as a separate top-level system parameter rather than as a message, which cleanly separates the persistent instructions from the turn-by-turn dialogue and lets you attach caching to it independently. The response is a structured object, not a bare string: response.content is a list of content blocks (each with a type such as text or tool_use), so you read response.content[0].text for a simple answer but should narrow on block.type in real code; response.usage carries input_tokens and output_tokens, which are the raw material for cost tracking (multiply by the per-model per-million-token price); and response.stop_reason explains why generation stopped — end_turn for a natural finish, max_tokens when the cap was hit (increase it or stream), tool_use when the model wants to call a tool, and refusal when a safety classifier or the model declined, which you must check before blindly indexing content[0]. A defining property of the API is that it is stateless: it has no session or server-side memory, so to hold a multi-turn conversation you must resend the entire prior sequence of user and assistant messages on every call, alternating roles and starting with a user message; this is also why input tokens (and therefore cost and latency) grow as a conversation lengthens. On the current top models — Opus 4.8 and Sonnet 5 — the sampling parameters temperature, top_p, and top_k have been removed and return a 400 error, so you shape outputs through prompting and the effort/thinking controls rather than by turning a temperature knob (older models like Sonnet 4.6 still accept them). Finally, production code must handle failure with the SDK's typed exception classes, ordered most-specific first: RateLimitError (HTTP 429, where you back off — though the SDK already retries 429 and 5xx with exponential backoff by default), then the broader APIStatusError for other non-2xx responses, and APIConnectionError for network faults; string-matching error messages is fragile and should be avoided.",
    analogy:
      "Calling the LLM API is like ordering at a fast-food counter staffed by someone with no memory whatsoever. The system prompt is the standing house rules taped to the register ('we only serve breakfast until 11'). Your messages array is your entire order, which you must repeat in full every single time you step up — the cashier remembers nothing from your last visit, so 'and add fries to that' only works if you also restate the burger. max_tokens is telling the kitchen 'stop after this much food no matter what'. The receipt you get back isn't just the meal (content) — it also itemizes exactly what you were charged (usage tokens) and notes whether the order completed normally or got cut off (stop_reason). And when the line is too long, the counter says 'come back in a minute' (a 429 rate limit) rather than serving you badly.",
    diagram: `<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Messages API request and response flow">${svgDefs}
      <text x="360" y="22" fill="#e6edf3" font-size="13" font-weight="700" text-anchor="middle">Messages API: request → model → response (stateless)</text>
      <rect x="24" y="48" width="180" height="150" rx="10" fill="#1a2332" stroke="#3b82f6"/>
      <text x="114" y="68" fill="#3b82f6" font-size="11" font-weight="700" text-anchor="middle">Your request</text>
      ${box(38, 78, 152, 26, "system", "instructions", "#8b949e")}
      ${box(38, 108, 152, 26, "messages[]", "full history", "#8b949e")}
      ${box(38, 138, 152, 26, "model, max_tokens", "which + cap", "#8b949e")}
      ${box(38, 168, 152, 24, "tools[] (optional)", "capabilities", "#22c55e")}
      ${box(268, 95, 170, 70, "Claude", "tokenize → generate", "#22c55e")}
      <line x1="204" y1="123" x2="266" y2="123" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="235" y="116" fill="#8b949e" font-size="9" text-anchor="middle">POST</text>
      <line x1="438" y1="123" x2="500" y2="123" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="469" y="116" fill="#8b949e" font-size="9" text-anchor="middle">JSON</text>
      <rect x="502" y="48" width="194" height="150" rx="10" fill="#1a2332" stroke="#f59e0b"/>
      <text x="599" y="68" fill="#f59e0b" font-size="11" font-weight="700" text-anchor="middle">Response</text>
      ${box(516, 78, 166, 26, "content[ ].text", "the answer", "#f59e0b")}
      ${box(516, 108, 166, 26, "stop_reason", "why it ended", "#f59e0b")}
      ${box(516, 138, 166, 26, "usage.*_tokens", "cost signal", "#f59e0b")}
      ${box(516, 168, 166, 24, "model, id", "metadata", "#8b949e")}
      <path d="M590 198 Q590 250 300 250 Q114 250 114 200" stroke="#f85149" stroke-width="1.6" stroke-dasharray="5 4" fill="none" marker-end="url(#arrow-mute)"/>
      <text x="360" y="244" fill="#f85149" font-size="10" text-anchor="middle">append assistant reply, resend everything next turn (no server memory)</text>
    </svg>`,
    diagramLegend: [
      { color: "#3b82f6", label: "Request", description: "model + max_tokens + messages required; system is a separate top-level param." },
      { color: "#22c55e", label: "Model", description: "Runs one forward generation; optional tools[] give it capabilities." },
      { color: "#f59e0b", label: "Response", description: "content blocks, stop_reason, and usage token counts for cost." },
    ],
    codeExample: {
      language: "python",
      title: "A complete Messages API call with cost + error handling",
      code: `import anthropic

client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY from env

# $ per 1M tokens (input, output) — Opus 4.8
PRICE = {"claude-opus-4-8": (5.0, 25.0)}

def ask(user_message: str, system: str = "You are a concise assistant.") -> dict:
    try:
        resp = client.messages.create(
            model="claude-opus-4-8",
            max_tokens=1024,                 # required: hard cap on output
            system=system,                   # separate top-level param
            messages=[{"role": "user", "content": user_message}],
        )
    except anthropic.RateLimitError:
        return {"error": "rate limited — back off and retry"}
    except anthropic.APIStatusError as e:    # any other non-2xx
        return {"error": f"{e.status_code}: {e.message}"}

    if resp.stop_reason == "refusal":        # check BEFORE reading content
        return {"error": "request declined"}

    cin, cout = PRICE["claude-opus-4-8"]
    cost = resp.usage.input_tokens * cin / 1e6 + resp.usage.output_tokens * cout / 1e6
    return {
        "text": resp.content[0].text,        # content is a list of blocks
        "in": resp.usage.input_tokens,
        "out": resp.usage.output_tokens,
        "cost_usd": round(cost, 6),
        "stop_reason": resp.stop_reason,
    }

print(ask("Name three uses for embeddings."))`,
    },
    codeExamples: [
      {
        language: "python",
        tab: "Python",
        title: "Stateless multi-turn — you resend the whole history",
        code: `import anthropic

client = anthropic.Anthropic()

# The API has NO memory: keep the running transcript yourself.
history = []

def say(user_message: str) -> str:
    history.append({"role": "user", "content": user_message})
    resp = client.messages.create(
        model="claude-opus-4-8",
        max_tokens=512,
        system="You are a terse Python tutor.",
        messages=history,                    # every prior turn, resent
    )
    reply = resp.content[0].text
    history.append({"role": "assistant", "content": reply})  # persist it
    print(f"[{resp.usage.input_tokens} in / {resp.usage.output_tokens} out]")
    return reply

say("What is a decorator?")
say("Give me a one-line example.")          # only works because history is resent
# Note: input_tokens climbs each turn — the whole transcript is re-billed.`,
      },
      {
        language: "typescript",
        tab: "TypeScript",
        title: "The same call in the TypeScript SDK",
        code: `import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic(); // reads ANTHROPIC_API_KEY

const response = await client.messages.create({
  model: "claude-opus-4-8",
  max_tokens: 1024,
  system: "You are a concise assistant.",   // separate top-level field
  messages: [{ role: "user", content: "Name three uses for embeddings." }],
});

// content is ContentBlock[] — narrow by .type before reading .text
for (const block of response.content) {
  if (block.type === "text") console.log(block.text);
}

console.log(response.stop_reason);           // "end_turn" | "max_tokens" | ...
console.log(response.usage.input_tokens, response.usage.output_tokens);`,
      },
      {
        language: "python",
        tab: "Robust retry",
        title: "Typed error handling, most-specific first",
        code: `import time
import anthropic

client = anthropic.Anthropic()

def ask_with_backoff(msg: str, tries: int = 3) -> str:
    for attempt in range(tries):
        try:
            resp = client.messages.create(
                model="claude-opus-4-8",
                max_tokens=1024,
                messages=[{"role": "user", "content": msg}],
            )
            return resp.content[0].text
        except anthropic.RateLimitError:          # 429 — retryable
            time.sleep(2 ** attempt)              # 1s, 2s, 4s
        except anthropic.APIStatusError as e:     # 400/401/404/5xx
            raise SystemExit(f"non-retryable {e.status_code}: {e.message}")
        except anthropic.APIConnectionError:      # network fault
            time.sleep(2 ** attempt)
    raise RuntimeError("exhausted retries")

# The SDK already retries 429/5xx with backoff (max_retries=2 by default);
# this shows the shape explicitly. Do NOT string-match error messages.`,
      },
    ],
    problemStatement:
      "A teammate's chatbot 'forgets' everything the user said one message ago, so they added a database to store replies but the model still ignores them. Separately, their code does `text = resp.content.text` and crashes with an attribute error, and in production they get intermittent failures they 'fixed' by wrapping everything in a bare `except`. Explain why the API forgetting is expected and how to actually maintain a conversation, why `content` isn't a string, and how to handle 429s correctly with typed exceptions and backoff.",
    questions: [
      {
        q: "Which parameters are required on a basic client.messages.create(...) call?",
        options: [
          "A. Only messages",
          "B. model, max_tokens, and messages",
          "C. model, temperature, and system",
          "D. api_key, model, and stop_sequences",
        ],
        answer: "B",
        explanation:
          "B is correct: model, max_tokens, and messages are required. The system prompt is optional and passed as a separate top-level parameter; the API key is read from the environment by the client, not passed per call.",
      },
      {
        q: "How do you read the plain text answer from a response?",
        options: [
          "A. response.text",
          "B. response.message",
          "C. response.content[0].text (content is a list of blocks; narrow by type)",
          "D. response.choices[0].message.content",
        ],
        answer: "C",
        explanation:
          "C is correct: the Anthropic response's content is a list of content blocks, so you read content[0].text and should check block.type in real code. response.choices[...] is the OpenAI shape, not Anthropic.",
      },
      {
        q: "Why must you resend the entire conversation history on every call?",
        options: [
          "A. To inflate the token count on purpose",
          "B. The Messages API is stateless — it has no server-side memory, so context comes only from the messages you send",
          "C. Because the SDK deletes messages after each call",
          "D. Only the system prompt needs to be resent",
        ],
        answer: "B",
        explanation:
          "B is correct: the API is stateless. Each request is independent, so the model only sees what is in that request's messages array. This is also why input tokens (and cost) grow as the conversation lengthens.",
      },
      {
        q: "What does stop_reason == 'max_tokens' indicate?",
        options: [
          "A. The model refused the request",
          "B. The model finished its thought naturally",
          "C. Output was truncated at the max_tokens cap — raise max_tokens or stream",
          "D. The input exceeded the context window",
        ],
        answer: "C",
        explanation:
          "C is correct: 'max_tokens' means generation hit the output cap and was cut off. Increase max_tokens (streaming for large values) to let it finish. A natural finish is 'end_turn'; a decline is 'refusal'.",
      },
      {
        q: "On Claude Opus 4.8, what happens if you pass temperature=0.7?",
        options: [
          "A. It makes the output more deterministic",
          "B. It is silently ignored",
          "C. The request returns a 400 error — sampling params are removed on Opus 4.8; steer via prompting",
          "D. It doubles the token cost",
        ],
        answer: "C",
        explanation:
          "C is correct: temperature, top_p, and top_k are removed on Opus 4.8 and Sonnet 5 and return a 400. Shape behavior through the prompt (and effort/thinking controls) instead. Older models like Sonnet 4.6 still accept them.",
      },
      {
        q: "What is the correct way to handle a 429 rate-limit error in production?",
        options: [
          "A. Catch a generic Exception and ignore it",
          "B. String-match the error message for 'rate limit'",
          "C. Catch the typed anthropic.RateLimitError and retry with exponential backoff (the SDK also auto-retries by default)",
          "D. Immediately retry in a tight loop with no delay",
        ],
        answer: "C",
        explanation:
          "C is correct: use the typed RateLimitError and back off exponentially; the SDK already retries 429/5xx with backoff (max_retries=2). A tight retry loop worsens the overload, and string-matching messages is brittle.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "ai-streaming-async",
    title: "Streaming & Async — Responsive, Concurrent LLM Calls",
    shortLabel: "Streaming & Async",
    section: "LLM Integration",
    domain: "AI",
    tldr:
      "Streaming delivers tokens as they are generated instead of after the whole response, cutting time-to-first-token (TTFT) from seconds to ~100–500ms — total generation time is unchanged, but the UI feels instant. In Python use `with client.messages.stream(...) as stream: for text in stream.text_stream:` then `stream.get_final_message()`; in TS iterate the stream events or use `stream.on('text', …)` and `await stream.finalMessage()`. For large `max_tokens` (>~16K) streaming is required to avoid SDK HTTP timeouts. Use AsyncAnthropic for concurrency — never the sync client inside an async function — and cap parallel calls with an asyncio.Semaphore to avoid 429s.",
    subtopics: [
      {
        heading: "Why streaming — perceived latency",
        bullets: [
          { icon: "⚡", text: "**Time-to-first-token (TTFT)** drops from a 5–30s blank screen to **~100–500ms**; tokens then flow continuously. Total generation time is the *same* — but the experience is transformed." },
          { icon: "🌊", text: "Python: **`with client.messages.stream(...) as stream:`** then `for text in stream.text_stream:` for the easy path, or iterate `for event in stream:` for `content_block_delta` / `message_stop` events." },
          { icon: "🧾", text: "After the loop, **`stream.get_final_message()`** (Python) / **`await stream.finalMessage()`** (TS) returns the assembled message with `usage` — don't rebuild it by hand from deltas." },
        ],
      },
      {
        heading: "Streaming is required for big outputs",
        bullets: [
          { icon: "⏱️", text: "Non-streaming requests with large **`max_tokens` (>~16K)** risk **SDK HTTP timeouts**; stream anything that may produce a long response (models allow up to 128K output when streaming)." },
          { icon: "🔤", text: "TS deltas: iterate events and handle `content_block_delta` with a `text_delta`, or subscribe with **`stream.on('text', d => …)`** for just the incremental string." },
          { icon: "📡", text: "For chat UIs, pipe the token stream to the browser over **Server-Sent Events** (e.g. FastAPI `StreamingResponse`) so the frontend renders as it arrives." },
        ],
      },
      {
        heading: "Async & concurrency control",
        bullets: [
          { icon: "🚦", text: "Use **`AsyncAnthropic`** and `await client.messages.create(...)` in async code. The **sync client blocks the event loop** — never call it inside an `async def`." },
          { icon: "🧵", text: "Fan out with **`asyncio.gather(*tasks)`** to run many calls concurrently; total wall-clock approaches the *slowest single* call, not the sum." },
          { icon: "🛑", text: "Bound concurrency with an **`asyncio.Semaphore(N)`** (e.g. 10) — unbounded `gather` over thousands of tasks fires them all at once and guarantees **429 rate-limit errors**." },
        ],
      },
    ],
    keyFacts: [
      { label: "TTFT with streaming", value: "~100–500ms vs 5–30s", icon: "⚡" },
      { label: "Python stream", value: "client.messages.stream(...).text_stream", icon: "🌊" },
      { label: "Async client", value: "AsyncAnthropic (never sync in async)", icon: "🚦" },
      { label: "Concurrency cap", value: "asyncio.Semaphore(N)", icon: "🛑" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'What is TTFT?' → delay to the **first token**; streaming cuts it to ~100–500ms.",
        "'Stream in Python?' → **`with client.messages.stream(...) as s: s.text_stream`**.",
        "'Get usage after streaming?' → **`get_final_message()`** / `finalMessage()`.",
        "'Sync client in async?' → **no** — it blocks the loop; use **AsyncAnthropic**.",
        "'Batch 1000 calls safely?' → **Semaphore(N)** to cap in-flight requests.",
      ],
      analogyBrief:
        "Non-streaming is waiting for the whole plate; streaming is a sushi conveyor belt serving each piece as it's ready. Async is placing orders at several counters at once — total time is the slowest counter, not the sum.",
    },
    explanation:
      "Streaming and async are the two techniques that turn a working Claude call into a responsive, scalable one. Without streaming, a client sends a prompt and then waits — often 5 to 30 seconds on a long response — staring at a blank screen until the entire message arrives at once; with streaming, the server emits tokens as they are generated, so the time-to-first-token (TTFT) drops to roughly 100–500 milliseconds and text flows in continuously, and although the total generation time is unchanged the perceived latency collapses. In Python the ergonomic path is a context manager, with client.messages.stream(model=..., max_tokens=..., messages=...) as stream, iterating for text in stream.text_stream to print each chunk, and then calling stream.get_final_message() to retrieve the fully assembled message object (including usage token counts) rather than reconstructing it from deltas; a lower-level loop over for event in stream gives you typed events such as content_block_delta (whose delta.text is the increment) and message_stop. In TypeScript you call client.messages.stream({...}) and either iterate the events, switching on event.type and reading a text_delta, or subscribe with stream.on('text', delta => ...) for just the incremental string, then await stream.finalMessage() for the complete result. Streaming is not merely a nicety: for large max_tokens (above roughly 16K) a non-streaming request can exceed the SDK's HTTP timeout, so you must stream any request that may produce a long output — current models support up to 128K output tokens when streaming. To display tokens in a browser, the token stream is typically relayed over Server-Sent Events, for example a FastAPI StreamingResponse whose generator yields each chunk. Concurrency is the second pillar: the synchronous Anthropic client performs blocking I/O and must never be called inside an async function, because it stalls the entire event loop; instead you use AsyncAnthropic and await client.messages.create(...), which yields to the loop during network I/O so other coroutines run. To process many prompts at once you build a list of coroutines and await asyncio.gather(*tasks), which runs them concurrently so that total wall-clock time approaches the slowest single call rather than the sum — but firing thousands of requests simultaneously will immediately trip rate limits, so you cap the number of in-flight requests with an asyncio.Semaphore(N) (commonly around 10), acquiring it with async with semaphore before each call so at most N requests run at a time while the rest wait their turn.",
    analogy:
      "Non-streaming is ordering a multi-course meal and having the waiter hold everything in the kitchen until the last dish is plated, then bringing it all at once — you sit staring at an empty table for a long time. Streaming is a sushi conveyor belt: each piece slides past the moment it's ready, so you start eating in seconds even though the full meal takes just as long to prepare. Async is the difference between one waiter taking your table's order, walking to the kitchen, waiting, and returning before serving the next table — versus placing orders at five counters simultaneously so all five kitchens cook in parallel and everything is ready in about the time of the single slowest dish. The Semaphore is the host at the door limiting how many parties can order at once so the kitchen doesn't get slammed and start turning people away.",
    diagram: `<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Streaming vs non-streaming timeline and async concurrency">${svgDefs}
      <text x="360" y="20" fill="#e6edf3" font-size="13" font-weight="700" text-anchor="middle">Streaming lowers TTFT; async runs calls in parallel</text>
      <text x="30" y="48" fill="#8b949e" font-size="10">Without streaming:</text>
      ${box(30, 56, 70, 30, "prompt", "", "#3b82f6")}
      <rect x="108" y="56" width="430" height="30" rx="6" fill="#2d1515" stroke="#f85149" stroke-dasharray="5 3"/>
      <text x="323" y="75" fill="#f85149" font-size="10" text-anchor="middle">blank screen — user waits 5–30s</text>
      ${box(546, 56, 150, 30, "full response", "all at once", "#22c55e")}
      <text x="30" y="116" fill="#8b949e" font-size="10">With streaming:</text>
      ${box(30, 124, 70, 30, "prompt", "", "#3b82f6")}
      ${box(108, 124, 46, 30, "~150ms", "TTFT", "#22c55e")}
      <rect x="162" y="127" width="534" height="24" rx="6" fill="#12261e" stroke="#22c55e"/>
      <text x="172" y="143" fill="#22c55e" font-size="10">The ▸ GIL ▸ is ▸ a ▸ mutex ▸ that ▸ … tokens flow continuously</text>
      <text x="30" y="188" fill="#8b949e" font-size="10">Async concurrent (Semaphore caps in-flight):</text>
      <rect x="30" y="196" width="200" height="18" rx="4" fill="#1a2332" stroke="#8b5cf6"/>
      <text x="130" y="209" fill="#c4b5fd" font-size="9" text-anchor="middle">await call 1 ──────────</text>
      <rect x="30" y="218" width="168" height="18" rx="4" fill="#1a2332" stroke="#8b5cf6"/>
      <text x="114" y="231" fill="#c4b5fd" font-size="9" text-anchor="middle">await call 2 ────────</text>
      <rect x="30" y="240" width="188" height="18" rx="4" fill="#1a2332" stroke="#8b5cf6"/>
      <text x="124" y="253" fill="#c4b5fd" font-size="9" text-anchor="middle">await call 3 ─────────</text>
      <rect x="30" y="262" width="150" height="14" rx="4" fill="#1a2332" stroke="#8b5cf6" opacity="0.6"/>
      <rect x="30" y="280" width="120" height="12" rx="4" fill="#1a2332" stroke="#8b5cf6" opacity="0.4"/>
      <text x="380" y="230" fill="#8b949e" font-size="10">asyncio.gather runs them together;</text>
      <text x="380" y="248" fill="#c4b5fd" font-size="10">total ≈ slowest single call, not the sum</text>
      <text x="380" y="266" fill="#8b949e" font-size="10">Semaphore(N) keeps ≤ N in flight → no 429</text>
    </svg>`,
    diagramLegend: [
      { color: "#f85149", label: "Blocking wait", description: "Non-streaming: nothing shows until the whole response is done." },
      { color: "#22c55e", label: "Streamed tokens", description: "First token in ~150ms; the rest arrive incrementally." },
      { color: "#8b5cf6", label: "Async calls", description: "Concurrent coroutines capped by a Semaphore to avoid rate limits." },
    ],
    codeExample: {
      language: "python",
      title: "Stream tokens live, then read final usage",
      code: `import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
    model="claude-opus-4-8",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Explain Python generators briefly."}],
) as stream:
    for text in stream.text_stream:          # each chunk as it's generated
        print(text, end="", flush=True)

# get_final_message() assembles the full message + usage — don't rebuild by hand
final = stream.get_final_message()
print(f"\\n[{final.usage.input_tokens} in / {final.usage.output_tokens} out]")
print("stop:", final.stop_reason)`,
    },
    codeExamples: [
      {
        language: "python",
        tab: "Async + Semaphore",
        title: "Process many prompts concurrently without hitting 429",
        code: `import asyncio
from anthropic import AsyncAnthropic

client = AsyncAnthropic()   # async client — never the sync one inside async

async def summarize(doc: str, sem: asyncio.Semaphore) -> str:
    async with sem:                          # at most N calls in flight
        resp = await client.messages.create(
            model="claude-haiku-4-5",        # fast + cheap for bulk work
            max_tokens=200,
            messages=[{"role": "user", "content": f"Summarize: {doc}"}],
        )
        return resp.content[0].text

async def main(docs: list[str], max_concurrent: int = 10) -> list[str]:
    sem = asyncio.Semaphore(max_concurrent)
    tasks = [summarize(d, sem) for d in docs]
    return await asyncio.gather(*tasks)       # runs concurrently, bounded by sem

docs = [f"Document {i} body..." for i in range(100)]
results = asyncio.run(main(docs))
print(f"summarized {len(results)} docs")`,
      },
      {
        language: "typescript",
        tab: "TS streaming",
        title: "Stream events and get the final message",
        code: `import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const stream = client.messages.stream({
  model: "claude-opus-4-8",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Write a haiku about caching." }],
});

// Simplest: subscribe to just the incremental text
stream.on("text", (delta) => process.stdout.write(delta));

// Or iterate raw events:
//   for await (const event of stream) {
//     if (event.type === "content_block_delta" && event.delta.type === "text_delta")
//       process.stdout.write(event.delta.text);
//   }

const final = await stream.finalMessage();  // full Message + usage
console.log("\\n", final.usage.output_tokens, "output tokens");`,
      },
      {
        language: "python",
        tab: "FastAPI SSE",
        title: "Relay the stream to a browser over Server-Sent Events",
        code: `from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from anthropic import Anthropic

app = FastAPI()
client = Anthropic()

@app.post("/chat")
def chat(user_message: str):
    def token_generator():
        with client.messages.stream(
            model="claude-opus-4-8",
            max_tokens=1024,
            messages=[{"role": "user", "content": user_message}],
        ) as stream:
            for text in stream.text_stream:
                yield "data: " + text + "\\n\\n"   # SSE frame per chunk
        yield "data: [DONE]\\n\\n"

    return StreamingResponse(token_generator(), media_type="text/event-stream")
# The browser's EventSource renders each token as it arrives.`,
      },
    ],
    problemStatement:
      "A support UI shows a 12-second spinner before any text appears, and a nightly job that summarizes 5,000 tickets keeps dying with 429 errors after someone 'sped it up' by awaiting the sync Anthropic client inside asyncio.gather over all 5,000 tickets at once. Explain how streaming fixes the perceived latency (and why total time is unchanged), why the sync client is wrong in an async context, and how a Semaphore plus AsyncAnthropic makes the batch job both fast and rate-limit-safe.",
    questions: [
      {
        q: "What does streaming primarily improve?",
        options: [
          "A. Total generation time (the response finishes sooner)",
          "B. Time-to-first-token / perceived latency — the first token appears in ~100–500ms while total time is unchanged",
          "C. The accuracy of the model's answer",
          "D. The token price per request",
        ],
        answer: "B",
        explanation:
          "B is correct: streaming lowers TTFT so tokens appear almost immediately, dramatically improving perceived responsiveness. The total time to generate the full response is essentially the same.",
      },
      {
        q: "In the Python SDK, how do you consume a streamed response?",
        options: [
          "A. response = client.messages.create(stream=True); response.text",
          "B. with client.messages.stream(...) as stream: for text in stream.text_stream: ...",
          "C. client.messages.stream_tokens(...)",
          "D. Poll client.messages.get(id) in a loop",
        ],
        answer: "B",
        explanation:
          "B is correct: the streaming API is a context manager exposing stream.text_stream for text chunks (or raw events via iteration), and stream.get_final_message() for the assembled result and usage.",
      },
      {
        q: "Why should you never call the synchronous Anthropic client inside an async function?",
        options: [
          "A. It is not thread-safe",
          "B. It blocks the event loop during network I/O, preventing other coroutines from running — use AsyncAnthropic instead",
          "C. It uses more memory",
          "D. It cannot read the API key",
        ],
        answer: "B",
        explanation:
          "B is correct: the sync client performs blocking I/O and stalls the whole event loop, defeating concurrency. AsyncAnthropic yields to the loop during I/O so other awaited calls proceed in parallel.",
      },
      {
        q: "What is the purpose of an asyncio.Semaphore(N) when batching LLM calls?",
        options: [
          "A. It makes each individual call faster",
          "B. It caps the number of concurrent in-flight requests at N so a large batch doesn't trigger 429 rate-limit errors",
          "C. It enables streaming for each call",
          "D. It retries failed calls automatically",
        ],
        answer: "B",
        explanation:
          "B is correct: unbounded asyncio.gather over thousands of tasks fires them all at once and trips rate limits. A Semaphore(N) allows at most N concurrent requests; the rest wait for a slot.",
      },
      {
        q: "You set max_tokens to 100000 on a non-streaming request. What is the risk?",
        options: [
          "A. The model will refuse the request",
          "B. It costs nothing extra",
          "C. The request may exceed the SDK's HTTP timeout — large outputs should be streamed",
          "D. max_tokens above 4096 is always rejected",
        ],
        answer: "C",
        explanation:
          "C is correct: large max_tokens on a non-streaming request risks an HTTP timeout because the whole response is awaited in one shot. Stream large outputs (models allow up to 128K output when streaming).",
      },
      {
        q: "After a streaming loop finishes, how do you get token usage for the response?",
        options: [
          "A. Sum the length of every text chunk you printed",
          "B. Call stream.get_final_message() (Python) / await stream.finalMessage() (TS) and read .usage",
          "C. Usage is not available for streamed responses",
          "D. Make a second non-streaming call with the same prompt",
        ],
        answer: "B",
        explanation:
          "B is correct: the SDK assembles the complete message — including usage.input_tokens/output_tokens — via get_final_message()/finalMessage(). Manually counting chunks is inaccurate and unnecessary.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "ai-function-calling",
    title: "Tool Use / Function Calling — Letting Claude Act",
    shortLabel: "Tool Use / Function Calling",
    section: "LLM Integration",
    domain: "AI",
    tldr:
      "Tool use is how Claude reaches the real world. You pass `tools` (each a name + description + JSON-Schema `input_schema`); when the model wants one, it stops with `stop_reason == 'tool_use'` and emits a `tool_use` block (id, name, input). YOUR code executes the function — the model never runs it — and you send the result back as a `tool_result` block (matching `tool_use_id`) inside a single user message, then loop until `end_turn`. Claude can call several tools in parallel (return ALL results in one user message). `tool_choice` controls forcing (auto/any/tool/none); `is_error: true` reports failures; `strict: true` on a tool guarantees the input validates.",
    subtopics: [
      {
        heading: "Define tools, model decides",
        bullets: [
          { icon: "🧰", text: "Each tool is **`{name, description, input_schema}`** where `input_schema` is JSON Schema. The **description is load-bearing** — Claude reads it to decide *when* to call, so say what it does *and when to use it*." },
          { icon: "🤔", text: "When Claude wants a tool it returns **`stop_reason == 'tool_use'`** and a `tool_use` block carrying **`id`, `name`, `input`** (already-parsed args) — it does **not** execute anything itself." },
          { icon: "🎛️", text: "**`tool_choice`** steers it: `{type:'auto'}` (default, model decides), `{type:'any'}` (must use some tool), `{type:'tool', name}` (force one), `{type:'none'}` (disable)." },
        ],
      },
      {
        heading: "The loop: execute → return → continue",
        bullets: [
          { icon: "⚙️", text: "**Your code runs the function** using `block.input`, then you append the assistant turn and send a **`tool_result`** block whose **`tool_use_id`** matches the `tool_use` block's `id`." },
          { icon: "📦", text: "Return **all** tool_result blocks in a **single user message**, then call the API again — repeat until `stop_reason == 'end_turn'`. Cap the rounds (e.g. 5) to avoid runaway loops." },
          { icon: "❌", text: "On a tool failure, still return a `tool_result` with **`is_error: true`** and a message — don't drop it; Claude reads the error and adapts." },
        ],
      },
      {
        heading: "Parallel calls, strictness & the SDK runner",
        bullets: [
          { icon: "🔀", text: "One assistant turn may contain **multiple `tool_use` blocks** (parallel tool use). Execute them all and return **every** `tool_result` together in one user message — splitting them across messages trains Claude to stop calling in parallel." },
          { icon: "🔒", text: "Set **`strict: true`** on a tool definition (with `additionalProperties: false` + `required`) to guarantee `tool_use.input` validates exactly against the schema." },
          { icon: "🏃", text: "The SDK **tool runner** (beta) drives the whole loop for you — Python `@beta_tool` + `client.beta.messages.tool_runner(...)`, TS `betaZodTool` + `client.beta.messages.toolRunner(...)` — while a manual loop gives you approval gates and logging." },
        ],
      },
    ],
    keyFacts: [
      { label: "Who executes tools", value: "Your code — never the model", icon: "⚙️" },
      { label: "Trigger", value: "stop_reason == 'tool_use'", icon: "🤔" },
      { label: "Result linkage", value: "tool_result.tool_use_id ↔ tool_use.id", icon: "📦" },
      { label: "Parallel results", value: "All in ONE user message", icon: "🔀" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'Who runs the tool?' → **your code**; the model only emits name + input.",
        "'How do I know it wants a tool?' → **`stop_reason == 'tool_use'`**.",
        "'How to return a result?' → **`tool_result`** with matching **`tool_use_id`**.",
        "'Parallel calls?' → return **all** results in **one** user message.",
        "'Force / disable tools?' → **`tool_choice`** auto | any | tool | none.",
      ],
      analogyBrief:
        "The model is a chef who writes an order ticket ('dice onions') but never touches the knife — the sous-chef (your code) does the cutting and hands the bowl back, and only then does the chef plate the dish.",
    },
    explanation:
      "Tool use (function calling) is the bridge from a chatbot to an agent: it lets Claude decide to run code, query a database, or hit an API, and it is the primitive that every agent framework is built on. You declare tools by passing a tools array to messages.create, where each tool has a name, a description, and an input_schema written in JSON Schema; the description is not a comment but a decision aid — Claude reads it to choose when and how to call the tool, so a good description states both what the tool does and when (and when not) to use it. Crucially, Claude never executes anything: when it decides a tool is needed, the response comes back with stop_reason == 'tool_use' and one or more tool_use content blocks, each carrying an id, the tool name, and an input object (the arguments, already parsed — you should read block.input as structured data, not string-match the raw JSON). Your code is what actually runs the function, using block.input as arguments, and then feeds the outcome back: you append the assistant's response (the full content, preserving the tool_use blocks) to the conversation, and add a new user message containing a tool_result block whose tool_use_id exactly matches the id of the tool_use block, with the function's output in content; you then call the API again so the model can incorporate the result, and you repeat this cycle until stop_reason becomes end_turn, capping the number of rounds (say 5) to prevent an infinite loop. Claude often issues several tool calls at once — parallel tool use means a single assistant turn can contain multiple tool_use blocks — and the rule is to execute them all and return every corresponding tool_result in one single user message; splitting the results across multiple messages degrades the behavior and teaches the model to stop calling tools in parallel. Failures are handled in-band: if a tool raises, you still return a tool_result for it but set is_error: true with an explanatory message, and Claude will acknowledge the error and try a different approach rather than being left hanging. You control invocation with tool_choice — {type:'auto'} lets the model decide (the default), {type:'any'} forces it to use some tool, {type:'tool', name:...} forces a specific one (useful for guaranteed structured extraction), and {type:'none'} disables tools — and you can add strict: true to a tool definition (with additionalProperties: false and a required list) to guarantee the model's tool input validates exactly against your schema. Finally, the SDKs ship a beta tool runner that automates the entire loop (Python's @beta_tool decorator with client.beta.messages.tool_runner, TypeScript's betaZodTool with client.beta.messages.toolRunner), which is ideal when you don't need custom control, whereas a hand-written loop is the right choice when you want human-in-the-loop approval, conditional execution, or custom logging.",
    analogy:
      "Tool use is a head chef working with kitchen staff. The chef (Claude) decides the dish and writes an order ticket — 'dice one onion', 'check if we have saffron' — but never picks up a knife or opens the pantry. Your code is the sous-chef who reads the ticket, does the actual work, and hands back a bowl of diced onion or the note 'no saffron' (a tool_result, possibly is_error). Only with those results in hand does the chef finish plating (the final text). If the chef writes two tickets at once — dice onions AND check the fridge — the sous-chef does both and returns both bowls together on one tray, not one trip per ticket. And tool_choice is the chef's manager: 'use whatever you need' (auto), 'you must use at least one station' (any), 'use the grill, specifically' (tool), or 'no stations today, just tell me' (none).",
    diagram: `<svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The tool use loop between the model and your code">${svgDefs}
      <text x="360" y="20" fill="#e6edf3" font-size="13" font-weight="700" text-anchor="middle">Tool use loop: model decides, your code executes</text>
      ${box(40, 44, 120, 40, "User message", "the request", "#3b82f6")}
      <line x1="160" y1="64" x2="258" y2="64" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(260, 44, 200, 60, "Claude", "auto | any | tool | none", "#22c55e")}
      <text x="360" y="128" fill="#f59e0b" font-size="10" text-anchor="middle">stop_reason == 'tool_use'</text>
      <line x1="360" y1="104" x2="360" y2="140" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(230, 142, 260, 52, "tool_use block", "id · name · input (parsed)", "#f59e0b")}
      <line x1="360" y1="194" x2="360" y2="226" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="474" y="216" fill="#8b949e" font-size="9">execute (your code)</text>
      ${box(230, 228, 260, 52, "Your function", "get_weather(**input) → result", "#8b5cf6")}
      <path d="M490 254 Q640 254 640 74 Q640 44 462 64" stroke="#22c55e" stroke-width="2" stroke-dasharray="5 3" fill="none" marker-end="url(#arrow)"/>
      <text x="648" y="160" fill="#22c55e" font-size="9" transform="rotate(90 648 160)">tool_result (tool_use_id, is_error?)</text>
      <path d="M258 74 Q150 74 150 300 L340 300" stroke="#3b82f6" stroke-width="2" stroke-dasharray="5 3" fill="none" marker-end="url(#arrow)"/>
      <text x="250" y="296" fill="#3b82f6" font-size="10">loop until stop_reason == 'end_turn' → final text</text>
    </svg>`,
    diagramLegend: [
      { color: "#22c55e", label: "Claude", description: "Decides whether to call a tool (guided by tool_choice); emits tool_use, never executes." },
      { color: "#f59e0b", label: "tool_use", description: "Block with id + name + parsed input; triggers stop_reason 'tool_use'." },
      { color: "#8b5cf6", label: "Your function", description: "Runs the code and returns a tool_result (with matching tool_use_id) back to the loop." },
    ],
    codeExample: {
      language: "python",
      title: "A manual tool-use loop with parallel calls and error handling",
      code: `import json
import anthropic

client = anthropic.Anthropic()

tools = [{
    "name": "get_weather",
    "description": "Get current weather for a city. Use when the user asks about weather.",
    "input_schema": {
        "type": "object",
        "properties": {"city": {"type": "string", "description": "City name"}},
        "required": ["city"],
        "additionalProperties": False,
    },
    "strict": True,   # guarantee input validates exactly
}]

def get_weather(city: str) -> dict:
    return {"city": city, "temp_c": 22, "condition": "sunny"}

def run(user_message: str) -> str:
    messages = [{"role": "user", "content": user_message}]
    for _ in range(5):                       # cap rounds
        resp = client.messages.create(
            model="claude-opus-4-8", max_tokens=1024,
            tools=tools, messages=messages,
        )
        if resp.stop_reason != "tool_use":
            return resp.content[0].text      # done

        results = []                          # collect ALL tool_use blocks
        for block in resp.content:
            if block.type == "tool_use":
                try:
                    out = get_weather(**block.input)   # your code runs it
                    results.append({"type": "tool_result",
                                    "tool_use_id": block.id,
                                    "content": json.dumps(out)})
                except Exception as e:
                    results.append({"type": "tool_result",
                                    "tool_use_id": block.id,
                                    "content": str(e), "is_error": True})

        messages.append({"role": "assistant", "content": resp.content})
        messages.append({"role": "user", "content": results})  # ALL in one msg
    return "max tool rounds exceeded"

print(run("Compare the weather in Paris and Tokyo."))`,
    },
    codeExamples: [
      {
        language: "python",
        tab: "Tool runner",
        title: "Let the SDK drive the loop (Python beta tool runner)",
        code: `from anthropic import Anthropic
from anthropic.lib.tools import beta_tool

client = Anthropic()

@beta_tool          # schema is inferred from the type hints + docstring
def get_weather(city: str) -> str:
    """Get current weather for a city. Use when asked about weather."""
    return f"{city}: 22C, sunny"

# tool_runner handles: call API -> run tools -> feed results -> repeat
runner = client.beta.messages.tool_runner(
    model="claude-opus-4-8",
    max_tokens=1024,
    tools=[get_weather],
    messages=[{"role": "user", "content": "What's the weather in Paris?"}],
)
final = runner.until_done()
print(final.content[0].text)
# Use the manual loop instead when you need approval gates or custom logging.`,
      },
      {
        language: "typescript",
        tab: "TS tool runner",
        title: "betaZodTool + toolRunner in TypeScript",
        code: `import Anthropic from "@anthropic-ai/sdk";
import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";

const client = new Anthropic();

const getWeather = betaZodTool({
  name: "get_weather",
  description: "Get current weather for a city. Use when asked about weather.",
  inputSchema: z.object({ city: z.string().describe("City name") }),
  run: async ({ city }) => city + ": 22C, sunny",   // your code executes here
});

const finalMessage = await client.beta.messages.toolRunner({
  model: "claude-opus-4-8",
  max_tokens: 1024,
  tools: [getWeather],
  messages: [{ role: "user", content: "What's the weather in Paris?" }],
});

for (const block of finalMessage.content) {
  if (block.type === "text") console.log(block.text);
}`,
      },
      {
        language: "python",
        tab: "tool_choice",
        title: "Forcing a tool for guaranteed structured extraction",
        code: `import anthropic

client = anthropic.Anthropic()

extract = {
    "name": "record_contact",
    "description": "Record a person's contact details extracted from text.",
    "input_schema": {
        "type": "object",
        "properties": {
            "name":  {"type": "string"},
            "email": {"type": "string"},
            "wants_demo": {"type": "boolean"},
        },
        "required": ["name", "email", "wants_demo"],
        "additionalProperties": False,
    },
    "strict": True,
}

resp = client.messages.create(
    model="claude-opus-4-8", max_tokens=512,
    tools=[extract],
    tool_choice={"type": "tool", "name": "record_contact"},  # FORCE this tool
    messages=[{"role": "user",
               "content": "Reach Jane Doe at jane@co.com; she asked for a demo."}],
)

for block in resp.content:
    if block.type == "tool_use":
        print(block.input)   # {'name': 'Jane Doe', 'email': 'jane@co.com', 'wants_demo': True}`,
      },
    ],
    problemStatement:
      "A developer's agent 'hangs': it gets a response with stop_reason 'tool_use' but the conversation never advances, because they print the tool call and then immediately call the API again without ever executing the function or sending a tool_result. When a user asks about two cities at once, they also return the two tool results in two separate user messages and notice Claude stops making parallel calls. Explain who is responsible for executing tools, exactly how to close the loop with a matching tool_result, why parallel results must go in one user message, and how tool_choice and is_error fit in.",
    questions: [
      {
        q: "In Anthropic tool use, who actually executes the tool/function?",
        options: [
          "A. Claude runs it on Anthropic's servers",
          "B. Your application code executes it; the model only emits the tool name and input",
          "C. The SDK executes it automatically with no code from you",
          "D. Anthropic executes it and bills per execution",
        ],
        answer: "B",
        explanation:
          "B is correct: the model never runs code. It returns a tool_use block with the name and input; your code executes the function and returns the outcome as a tool_result. (The SDK tool runner calls your functions for you, but the code is still yours.)",
      },
      {
        q: "How do you know the model wants to call a tool?",
        options: [
          "A. response.tool_called is True",
          "B. response.stop_reason == 'tool_use' and the content contains tool_use block(s)",
          "C. The response is empty",
          "D. response.stop_reason == 'end_turn'",
        ],
        answer: "B",
        explanation:
          "B is correct: the response comes back with stop_reason == 'tool_use' and one or more tool_use content blocks (each with id, name, input). 'end_turn' means it finished with a normal answer.",
      },
      {
        q: "When returning a tool's output, what links it to the request?",
        options: [
          "A. The order of the results",
          "B. A tool_result block whose tool_use_id matches the id of the originating tool_use block",
          "C. The tool's name only",
          "D. A separate 'reply_to' field on the message",
        ],
        answer: "B",
        explanation:
          "B is correct: each tool_result must carry the tool_use_id matching the tool_use block's id so the model pairs the result with the right call. Ordering alone is not sufficient.",
      },
      {
        q: "Claude returns two tool_use blocks in one response (parallel tool use). How should you reply?",
        options: [
          "A. Send each tool_result in its own separate user message",
          "B. Execute both and return both tool_result blocks together in a single user message",
          "C. Only answer the first tool; ignore the second",
          "D. Start a brand-new conversation for the second tool",
        ],
        answer: "B",
        explanation:
          "B is correct: return all tool_result blocks in one user message. Splitting them across multiple messages degrades behavior and trains the model to stop issuing parallel calls.",
      },
      {
        q: "A tool raises an exception during execution. What is the correct response?",
        options: [
          "A. Omit the tool_result so the model retries",
          "B. Return a tool_result with is_error: true and an error message so Claude can adapt",
          "C. Throw the exception back to the user and abandon the conversation",
          "D. Silently return an empty string",
        ],
        answer: "B",
        explanation:
          "B is correct: always return a tool_result for a failed call with is_error: true and an informative message. Dropping it leaves a dangling tool_use; the error lets Claude recover or ask for clarification.",
      },
      {
        q: "What does tool_choice = {\"type\": \"tool\", \"name\": \"extract\"} do?",
        options: [
          "A. Lets the model decide whether to use any tool",
          "B. Disables tools entirely",
          "C. Forces the model to call the named tool — useful for guaranteed structured extraction",
          "D. Runs the tool without calling the model",
        ],
        answer: "C",
        explanation:
          "C is correct: {type:'tool', name:...} forces that specific tool, which is handy for reliable structured output. {type:'auto'} lets the model decide, {type:'any'} forces some tool, {type:'none'} disables tools.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "ai-caching-tokens",
    title: "Prompt Caching & Token Cost — Paying Less Per Call",
    shortLabel: "Prompt Caching & Token Cost",
    section: "LLM Integration",
    domain: "AI",
    tldr:
      "You are billed per token: input tokens (cheaper) and output tokens (higher). Prompt caching reuses the computation for a stable prompt prefix — mark a breakpoint with `cache_control: {type:'ephemeral'}` and repeated requests read that prefix at ~0.1× the input price (a cache write costs ~1.25× for the 5-min TTL, ~2× for 1h). It is a strict PREFIX match in render order tools → system → messages: any byte change anywhere in the prefix (a timestamp, a reordered tool, an unsorted JSON key) invalidates everything after it. Keep the system prompt and tool list frozen and deterministic; put volatile content last. Verify with `usage.cache_read_input_tokens` — zero across identical requests means a silent invalidator.",
    subtopics: [
      {
        heading: "How you're billed",
        bullets: [
          { icon: "💵", text: "Cost = **input_tokens × input rate + output_tokens × output rate**. Output is priced several times higher than input (e.g. Opus 4.8 is $5/M in, $25/M out), so long completions dominate the bill." },
          { icon: "📈", text: "Because the API is stateless, **every resent turn re-bills the whole history as input** — long conversations get expensive on input tokens even before the model replies." },
          { icon: "🔢", text: "Estimate before you send with the **`count_tokens`** endpoint (model-specific) — never use `tiktoken`, which is OpenAI's tokenizer and miscounts Claude." },
        ],
      },
      {
        heading: "Prompt caching — reuse the prefix",
        bullets: [
          { icon: "🗄️", text: "Add **`cache_control: {type:'ephemeral'}`** to a content block to mark a cache breakpoint (max 4). Repeated requests with the same prefix read it at **~0.1× the input price** (~90% off)." },
          { icon: "⚖️", text: "A cache **write** costs **~1.25×** input (5-minute TTL, the default) or **~2×** (`ttl:'1h'`) — so with the 5-min TTL you break even after ~2 requests; the prefix must also exceed a model-specific minimum (**4096 tokens on Opus 4.8**) or it silently won't cache." },
          { icon: "🧊", text: "Cache the **stable prefix** (frozen system prompt, few-shot examples, big shared document), not the per-request question — a breakpoint at the end of the whole prompt writes a new entry every time and never reads." },
        ],
      },
      {
        heading: "The prefix-match invariant & silent invalidators",
        bullets: [
          { icon: "🧬", text: "Caching is a **prefix match** in render order **tools → system → messages**. **Any byte change** before a breakpoint invalidates everything after it — so keep the system prompt and tool list frozen, and put volatile content last." },
          { icon: "🕳️", text: "Silent cache killers: **`datetime.now()`/UUIDs in the system prompt**, **unsorted JSON** (`json.dumps` without `sort_keys`), a **per-user tool set**, or **switching model** mid-conversation (caches are model-scoped)." },
          { icon: "🔎", text: "**Verify** with `usage.cache_read_input_tokens` (served from cache) and `cache_creation_input_tokens` (written). If reads stay **zero** across identical-prefix requests, a silent invalidator is at work — diff the rendered bytes." },
        ],
      },
    ],
    keyFacts: [
      { label: "Cache read cost", value: "~0.1× input (≈90% off)", icon: "🗄️" },
      { label: "Cache write cost", value: "~1.25× (5m) / ~2× (1h)", icon: "⚖️" },
      { label: "Match type", value: "Prefix (tools → system → messages)", icon: "🧬" },
      { label: "Verify hit", value: "usage.cache_read_input_tokens", icon: "🔎" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'How to cut cost on a big system prompt?' → **`cache_control: {type:'ephemeral'}`** on it.",
        "'Cache economics?' → read **~0.1×**, write **~1.25×** (5m) / ~2× (1h).",
        "'Why is my cache never hitting?' → a **byte changed in the prefix** (timestamp, unsorted JSON).",
        "'Where do dynamic bits go?' → **after the last breakpoint**; keep the prefix frozen.",
        "'How to count tokens?' → the **`count_tokens`** endpoint, not tiktoken.",
      ],
      analogyBrief:
        "The cached prefix is a book the model has already read and bookmarked: ask about the same book and it jumps to the bookmark cheaply — but change a single word early on and every bookmark after it is void, so it must re-read.",
    },
    explanation:
      "Cost on the Claude API is entirely a function of tokens: you pay for input_tokens (the prompt, including all resent history and the system prompt and tool definitions) and output_tokens (the generated response), with output priced several times higher than input — Opus 4.8, for instance, is $5 per million input tokens and $25 per million output — so total cost is input_tokens × input_rate + output_tokens × output_rate, and because the API is stateless and you resend the whole conversation each turn, input tokens (and thus cost) climb steadily in long chats. To size a request before sending it, use the model-specific count_tokens endpoint rather than tiktoken, which is OpenAI's tokenizer and undercounts Claude by roughly 15–20%. Prompt caching is the main lever for cutting cost when a large chunk of the prompt repeats across requests: you attach cache_control: {type: 'ephemeral'} to a content block to mark a breakpoint (at most four per request), and thereafter any request whose prefix up to that breakpoint is byte-for-byte identical reads those tokens from cache at about one-tenth of the normal input price — roughly a 90% saving on the cached portion. The economics have a write premium: creating or refreshing a cache entry costs about 1.25× the input price with the default five-minute TTL (or about 2× with ttl: '1h'), so with the five-minute TTL you break even after about two requests, and the cacheable prefix must also exceed a model-specific minimum — 4096 tokens on Opus 4.8 — or it silently won't cache at all. The single invariant that governs everything is that caching is a prefix match: the prompt is rendered in the fixed order tools → system → messages, and a cache_control marker caches everything up to and including its block, so any byte that changes anywhere before a breakpoint invalidates the cache for that breakpoint and all later ones. The practical consequence is architectural: keep the stable content first and frozen — a system prompt with no interpolated timestamps or per-user IDs, a deterministically serialized and unchanging tool list — and push all volatile content (the current question, per-request IDs, retrieved snippets that vary) after the last breakpoint; cache the shared prefix, not the whole prompt, because putting the breakpoint at the very end writes a fresh distinct entry every request and never reads one. The classic silent invalidators to hunt for are datetime.now() or uuid4() interpolated into the system prompt, json.dumps without sort_keys (non-deterministic key order), a tool set that varies per user, and switching the model mid-conversation (caches are model-scoped). You confirm caching is actually working by inspecting the response's usage object: cache_creation_input_tokens counts tokens written to the cache this request (you paid the ~1.25× premium), cache_read_input_tokens counts tokens served from cache (you paid ~0.1×), and input_tokens is only the uncached remainder — so if cache_read_input_tokens stays zero across repeated identical-prefix requests, a silent invalidator is changing the prefix bytes and you should diff two rendered prompts to find it.",
    analogy:
      "Prompt caching is like a study partner who has already read and bookmarked a long textbook. The first time you hand them the book they read it cover to cover and stick in a bookmark at the chapter you keep asking about — that first read is a bit of extra effort (the ~1.25× write cost). But every later question about that same book, they flip straight to the bookmark and answer for almost nothing (the ~0.1× read). The catch is the bookmark only works if the book is byte-identical: if you sneak a new sentence into the first page — a fresh date stamp, a reshuffled paragraph — every bookmark after that page is invalidated and they have to re-read from the change onward. So you keep the shared textbook fixed and only vary the question you ask at the end, and you check the receipt (usage) to see whether they actually used the bookmark or re-read the whole thing.",
    diagram: `<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Prompt caching prefix match and token cost">${svgDefs}
      <text x="360" y="20" fill="#e6edf3" font-size="13" font-weight="700" text-anchor="middle">Prompt caching: freeze the prefix, vary only the tail</text>
      <text x="30" y="48" fill="#8b949e" font-size="10">render order → tools → system → messages</text>
      ${box(30, 58, 150, 40, "tools[]", "deterministic", "#8b949e")}
      ${box(186, 58, 200, 40, "system prompt", "frozen, no timestamps", "#8b949e")}
      <line x1="386" y1="98" x2="386" y2="112" stroke="#22c55e" stroke-width="2"/>
      <text x="470" y="86" fill="#22c55e" font-size="10">cache_control breakpoint</text>
      <rect x="386" y="60" width="8" height="36" fill="#22c55e"/>
      ${box(400, 58, 150, 40, "few-shot / doc", "shared context", "#8b949e")}
      ${box(560, 58, 136, 40, "user question", "VOLATILE (last)", "#f59e0b")}
      <rect x="24" y="52" width="534" height="52" rx="10" fill="none" stroke="#22c55e" stroke-dasharray="5 4"/>
      <text x="290" y="126" fill="#22c55e" font-size="10" text-anchor="middle">cached prefix (byte-identical across requests)</text>
      <text x="628" y="126" fill="#f59e0b" font-size="10" text-anchor="middle">not cached</text>
      <text x="30" y="162" fill="#8b949e" font-size="11" font-weight="700">Economics per token</text>
      ${box(30, 172, 200, 44, "Cache WRITE", "~1.25× in (5m) / ~2× (1h)", "#f59e0b")}
      ${box(250, 172, 200, 44, "Cache READ", "~0.1× in (≈90% off)", "#22c55e")}
      ${box(470, 172, 226, 44, "Uncached input", "full input rate", "#8b949e")}
      <text x="30" y="248" fill="#8b949e" font-size="11" font-weight="700">Verify in usage</text>
      <text x="30" y="268" fill="#22c55e" font-size="10">cache_read_input_tokens &gt; 0 → hit ✓</text>
      <text x="330" y="268" fill="#f85149" font-size="10">stays 0 → silent invalidator (timestamp / unsorted JSON / model switch)</text>
      <text x="30" y="286" fill="#8b949e" font-size="10">total prompt = input_tokens + cache_creation + cache_read</text>
    </svg>`,
    diagramLegend: [
      { color: "#22c55e", label: "Cached prefix", description: "Stable tools + system + shared context, read at ~0.1× when byte-identical." },
      { color: "#f59e0b", label: "Volatile tail", description: "Per-request content placed after the last breakpoint; never cache it." },
      { color: "#8b949e", label: "Uncached input", description: "Everything not served from cache, billed at the full input rate." },
    ],
    codeExample: {
      language: "python",
      title: "Cache a large system prompt and verify the hit",
      code: `import anthropic

client = anthropic.Anthropic()

SYSTEM = "<a large, frozen system prompt / policy doc, 4096+ tokens>"

def ask(question: str):
    return client.messages.create(
        model="claude-opus-4-8",
        max_tokens=512,
        system=[{                              # system as a block list
            "type": "text",
            "text": SYSTEM,
            "cache_control": {"type": "ephemeral"},   # breakpoint here
        }],
        messages=[{"role": "user", "content": question}],  # volatile — after prefix
    )

r1 = ask("Summarize the refund policy.")
print("write:", r1.usage.cache_creation_input_tokens,   # >0 on first call
      "read:", r1.usage.cache_read_input_tokens)         # 0 on first call

r2 = ask("Now the shipping policy.")                     # same prefix
print("write:", r2.usage.cache_creation_input_tokens,    # 0
      "read:", r2.usage.cache_read_input_tokens)          # >0  -> ~0.1x cost
# total prompt tokens = input_tokens + cache_creation + cache_read`,
    },
    codeExamples: [
      {
        language: "python",
        tab: "Count tokens",
        title: "Estimate cost with count_tokens (never tiktoken)",
        code: `import anthropic

client = anthropic.Anthropic()

# Model-specific token count — tiktoken is OpenAI's tokenizer and miscounts Claude.
resp = client.messages.count_tokens(
    model="claude-opus-4-8",
    system="You are a helpful assistant.",
    messages=[{"role": "user", "content": open("policy.md").read()}],
)
tokens = resp.input_tokens
print(f"{tokens} input tokens")

# Opus 4.8: $5 / 1M input tokens
est_input_cost = tokens / 1_000_000 * 5.0
print(f"est. input cost: \${est_input_cost:.4f}")
# Output is billed separately at $25 / 1M and depends on the response length.`,
      },
      {
        language: "typescript",
        tab: "TS caching",
        title: "Same cached-prefix pattern in TypeScript",
        code: `import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();
const SYSTEM = "<a large, frozen system prompt, 4096+ tokens>";

async function ask(question: string) {
  return client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 512,
    system: [
      { type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } },
    ],
    messages: [{ role: "user", content: question }], // volatile, after the prefix
  });
}

const r1 = await ask("Summarize the refund policy.");
const r2 = await ask("Now the shipping policy.");     // same prefix -> cache read

// >0 read on the second call confirms the hit (~0.1x cost on the cached prefix)
console.log(r2.usage.cache_read_input_tokens, r2.usage.cache_creation_input_tokens);`,
      },
      {
        language: "python",
        tab: "Silent invalidator",
        title: "The #1 caching bug: a moving prefix",
        code: `import datetime, json
import anthropic

client = anthropic.Anthropic()

# BROKEN: a timestamp in the system prefix changes the bytes every request,
# so the cache is rewritten (never read) — cache_read_input_tokens stays 0.
def broken(question: str):
    system = f"Current time: {datetime.datetime.now()}\\nYou are helpful."
    return client.messages.create(
        model="claude-opus-4-8", max_tokens=256,
        system=[{"type": "text", "text": system,
                 "cache_control": {"type": "ephemeral"}}],
        messages=[{"role": "user", "content": question}],
    )

# FIXED: freeze the prefix; move the volatile time into the (uncached) user turn.
def fixed(question: str):
    return client.messages.create(
        model="claude-opus-4-8", max_tokens=256,
        system=[{"type": "text", "text": "You are helpful.",
                 "cache_control": {"type": "ephemeral"}}],
        messages=[{"role": "user",
                   "content": f"[now: {datetime.datetime.now()}] {question}"}],
    )
# Also: json.dumps(..., sort_keys=True) so serialized data is byte-stable.`,
      },
    ],
    problemStatement:
      "A team added `cache_control` to a 6,000-token system prompt but their bill didn't move, and `usage.cache_read_input_tokens` is 0 on every request. Their system prompt begins with `f\"Current time: {datetime.now()}\"`, they build the tools list per-user, and they serialize retrieved context with `json.dumps(data)`. Separately, they estimate cost with `tiktoken` and it's always wrong. Explain why the cache never hits (the prefix-match invariant), how cache read/write economics work, exactly what to change so the prefix is byte-stable, and how to size tokens correctly.",
    questions: [
      {
        q: "Roughly how much do cache-read tokens cost relative to normal input tokens?",
        options: [
          "A. The same as normal input tokens",
          "B. About 0.1× (roughly 90% cheaper)",
          "C. About 2× (more expensive)",
          "D. They are completely free",
        ],
        answer: "B",
        explanation:
          "B is correct: reading a cached prefix costs about one-tenth of the normal input price. Writing/refreshing the cache costs about 1.25× (5-minute TTL) or 2× (1-hour TTL), so a few reads quickly pay back the write premium.",
      },
      {
        q: "Prompt caching is fundamentally a…",
        options: [
          "A. Fuzzy semantic match on meaning",
          "B. Exact prefix match — any byte change before a breakpoint invalidates the cache from that point on",
          "C. Match on the user's most recent message only",
          "D. Whole-prompt hash that ignores ordering",
        ],
        answer: "B",
        explanation:
          "B is correct: caching is a strict prefix match over the rendered prompt (tools → system → messages). A single differing byte anywhere in the prefix invalidates that breakpoint and all later ones.",
      },
      {
        q: "Why does putting datetime.now() at the top of the system prompt break caching?",
        options: [
          "A. Timestamps are not valid tokens",
          "B. It changes the prefix bytes on every request, so the cache is rewritten and never read",
          "C. The system prompt cannot be cached at all",
          "D. It exceeds the token limit",
        ],
        answer: "B",
        explanation:
          "B is correct: a changing timestamp early in the prefix makes every request unique, so each one writes a fresh cache entry and reads none. Move volatile values after the last breakpoint (e.g. into the user turn).",
      },
      {
        q: "Where should the per-request user question go to maximize cache reuse?",
        options: [
          "A. At the very beginning, before the system prompt",
          "B. Inside the system prompt",
          "C. After the last cache_control breakpoint (in the messages tail), leaving the shared prefix stable",
          "D. It doesn't matter where it goes",
        ],
        answer: "C",
        explanation:
          "C is correct: cache the stable shared prefix and place volatile per-request content after the last breakpoint. A breakpoint at the very end writes a new entry every time and never reads one.",
      },
      {
        q: "How do you confirm a request actually read from the cache?",
        options: [
          "A. Check that the response was faster",
          "B. Inspect usage.cache_read_input_tokens (> 0 means a hit); cache_creation_input_tokens counts writes",
          "C. Look at response.stop_reason",
          "D. Compare the bill at the end of the month",
        ],
        answer: "B",
        explanation:
          "B is correct: the usage object reports cache_read_input_tokens (served from cache) and cache_creation_input_tokens (written). If reads stay zero across identical-prefix requests, a silent invalidator is changing the prefix.",
      },
      {
        q: "Which is the correct way to estimate a prompt's token count for Claude?",
        options: [
          "A. Use the tiktoken library",
          "B. Assume 1 word ≈ 1 token",
          "C. Use the model-specific count_tokens endpoint (client.messages.count_tokens)",
          "D. Divide the character count by exactly 3",
        ],
        answer: "C",
        explanation:
          "C is correct: use the count_tokens endpoint with the same model ID you'll call. tiktoken is OpenAI's tokenizer and miscounts Claude (often by 15–20% or more on code/non-English), and word counts are unreliable.",
      },
    ],
  },
];
