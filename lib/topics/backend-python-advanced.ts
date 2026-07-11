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
// SECTION: Advanced Python — Classes & Dataclasses, Decorators &
// Context Managers, Errors & Exceptions, Threading & Multiprocessing,
// asyncio & async/await, and Pydantic Validation.
// Backend interview fundamentals authored to the messaging.ts /
// frontend-core.ts gold-standard bar.
// ============================================================
import { svgDefs, type Topic } from "./shared";

const box = (
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  sub: string,
  color = "#3776ab",
) => `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#243349" stroke="${color}"/>
  <text x="${x + w / 2}" y="${y + h / 2 - 2}" text-anchor="middle" fill="#e6edf3" font-size="12" font-weight="600">${title}</text>
  <text x="${x + w / 2}" y="${y + h / 2 + 15}" text-anchor="middle" fill="#8b949e" font-size="10">${sub}</text>
`;

export const backendPyAdvancedTopics: Topic[] = [
  // -----------------------------------------------------------------
  {
    id: "be-oop",
    title: "Classes, Inheritance & Dataclasses",
    shortLabel: "OOP & Dataclasses",
    section: "Advanced Python",
    domain: "Backend",
    tldr:
      "A class is a blueprint bundling data (attributes) and behavior (methods). Instances get their own attributes via __init__, while class attributes are shared. Inheritance reuses a parent via super(), and Python resolves overlapping methods through the C3-linearized MRO. Dunder methods (__repr__, __eq__, __len__) hook objects into Python syntax, and @dataclass auto-generates __init__/__repr__/__eq__ from annotated fields — with frozen=True giving immutable, hashable records.",
    subtopics: [
      {
        heading: "Classes & the object model",
        bullets: [
          { icon: "🏛️", text: "**Class attributes** live on the class and are **shared** by all instances; **instance attributes** (`self.x = ...`) are **per-object**." },
          { icon: "🔧", text: "`__init__` **initializes** an already-created object — the real constructor is `__new__`." },
          { icon: "🪄", text: "**Dunder methods** wire objects into syntax: `__repr__` (debug), `__str__` (display), `__eq__` (`==`), `__len__` (`len()`), `__call__` (callable)." },
        ],
      },
      {
        heading: "Inheritance, super() & MRO",
        bullets: [
          { icon: "🧬", text: "**Inheritance** reuses a parent; call `super().__init__(...)` so the parent initializes its own state." },
          { icon: "🧭", text: "The **MRO** (Method Resolution Order), built by **C3 linearization**, decides which parent's method wins; inspect it with `Cls.__mro__`." },
          { icon: "🔒", text: "**Encapsulation** is by convention: `_x` means 'internal', `__x` triggers **name mangling** to `_Cls__x` (not truly private)." },
        ],
      },
      {
        heading: "Dataclasses & method types",
        bullets: [
          { icon: "📦", text: "`@dataclass` auto-generates `__init__`, `__repr__`, and `__eq__` from **annotated fields**; `frozen=True` makes instances **immutable and hashable**." },
          { icon: "🏭", text: "`@classmethod` receives `cls` — ideal for **alternative constructors** (`Model.from_config(...)`); `@staticmethod` receives neither `self` nor `cls`." },
          { icon: "⚠️", text: "Use `field(default_factory=list)` for **mutable defaults** — a bare `= []` would be shared across instances." },
        ],
      },
    ],
    keyFacts: [
      { label: "Real constructor", value: "__new__ (not __init__)", icon: "🔧" },
      { label: "Parent init call", value: "super().__init__()", icon: "🧬" },
      { label: "@dataclass generates", value: "__init__/__repr__/__eq__", icon: "📦" },
      { label: "frozen=True", value: "Immutable + hashable", icon: "🔒" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'Shared vs per-instance' → **class attribute** vs **instance attribute**.",
        "'Which parent method runs?' → the **MRO** (`Cls.__mro__`, C3 linearization).",
        "'Alternative constructor' → **@classmethod** returning `cls(...)`.",
        "'No boilerplate data holder' → **@dataclass**; make it hashable with `frozen=True`.",
        "'Mutable default in a class' → use `field(default_factory=list)`, never `= []`.",
      ],
      analogyBrief:
        "A class is a house blueprint: every house (instance) has the same rooms (methods) but its own furniture (instance data). Inheritance is starting from someone else's blueprint; the MRO is the rule for whose room wins when two blueprints define the same room.",
    },
    explanation:
      "A class is a blueprint that bundles data (attributes) with the behavior that operates on it (methods). Two kinds of attribute exist: class attributes, declared in the class body and shared by every instance, and instance attributes, assigned through self inside methods and unique to each object. It is worth knowing that __init__ is not actually the constructor — Python creates the object with __new__ and then calls __init__ to initialize the already-existing instance. Objects integrate with the language through dunder (double-underscore) methods: __repr__ gives an unambiguous developer-facing representation, __str__ a human-readable one, __eq__ powers ==, __len__ powers len(), __getitem__ powers indexing, and __call__ makes an instance callable like a function. Inheritance lets a subclass reuse and extend a parent; inside a subclass you call super().__init__(...) so the parent can initialize its own attributes, which is essential for correct cooperative multiple inheritance. When several classes in a hierarchy define the same method, Python decides which one runs using the Method Resolution Order, computed by the C3 linearization algorithm and viewable via Cls.__mro__ — the search proceeds left to right through the MRO and the first match wins. Encapsulation in Python is by convention rather than enforcement: a single leading underscore signals 'internal use', while a double leading underscore triggers name mangling (turning __attr into _ClassName__attr) to avoid accidental clashes in subclasses, though it is still reachable. Method types differ by their implicit first argument: instance methods take self, @classmethod methods take cls (perfect for alternative constructors such as Model.from_config(cfg) that return cls(...)), and @staticmethod methods take neither and are simply utility functions grouped under the class. Finally, the @dataclass decorator (Python 3.7+) removes boilerplate by auto-generating __init__, __repr__, and __eq__ from annotated fields; declaring it with frozen=True makes instances immutable and therefore hashable (usable as dict keys or set members), and mutable defaults must be supplied with field(default_factory=list) rather than a bare literal, which would be shared across all instances.",
    analogy:
      "Think of a class as an architect's blueprint for a house. Every house built from it (an instance) has the same set of rooms and doors (methods) and the same structural rules (class attributes), yet each is filled with its own furniture (instance attributes set in __init__). Inheritance is taking an existing blueprint and adding a wing: you still want the original foundation poured, which is what calling super() does. If two blueprints you inherit from both describe a 'kitchen', the Method Resolution Order is the building code that decides whose kitchen design takes precedence. A @dataclass is like a prefab kit that comes with the plumbing (__init__), the address plaque (__repr__), and the deed-comparison paperwork (__eq__) already installed — and frozen=True welds the doors shut so nobody can rearrange the furniture after move-in.",
    diagram: `<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Class hierarchy, MRO, and dataclass generation">${svgDefs}
      <text x="360" y="26" text-anchor="middle" fill="#e6edf3" font-size="15" font-weight="700">Inheritance, MRO &amp; @dataclass</text>
      ${box(300, 45, 120, 42, "object", "root of all", "#3b82f6")}
      ${box(120, 115, 140, 46, "Animal", "base class", "#22c55e")}
      ${box(460, 115, 140, 46, "Pet", "mixin", "#f59e0b")}
      ${box(290, 190, 140, 46, "Dog(Animal, Pet)", "subclass", "#8b5cf6")}
      <line x1="360" y1="87" x2="200" y2="113" stroke="#8b949e" stroke-width="1.5" marker-end="url(#arrow-mute)"/>
      <line x1="360" y1="87" x2="520" y2="113" stroke="#8b949e" stroke-width="1.5" marker-end="url(#arrow-mute)"/>
      <line x1="200" y1="161" x2="330" y2="188" stroke="#8b949e" stroke-width="1.5" marker-end="url(#arrow-mute)"/>
      <line x1="520" y1="161" x2="390" y2="188" stroke="#8b949e" stroke-width="1.5" marker-end="url(#arrow-mute)"/>
      <text x="360" y="258" text-anchor="middle" fill="#8b5cf6" font-size="11" font-weight="700">MRO: Dog → Animal → Pet → object</text>
      <text x="360" y="282" text-anchor="middle" fill="#8b949e" font-size="10">@dataclass auto-generates __init__, __repr__, __eq__ from annotated fields (frozen=True ⇒ immutable + hashable)</text>
    </svg>`,
    diagramLegend: [
      { color: "#3b82f6", label: "object", description: "The ultimate base class every Python class inherits from." },
      { color: "#8b5cf6", label: "Subclass", description: "Combines parents; Python orders lookups via the C3 MRO." },
      { color: "#22c55e", label: "Base classes", description: "Contribute attributes/methods; initialized via super()." },
    ],
    codeExample: {
      language: "python",
      title: "Manual dunder class vs @dataclass",
      code: `from dataclasses import dataclass, field

class Token:
    def __init__(self, text: str, token_id: int):
        self.text = text
        self.token_id = token_id

    def __repr__(self) -> str:
        return f"Token({self.text!r}, id={self.token_id})"

    def __eq__(self, other) -> bool:
        if not isinstance(other, Token):
            return NotImplemented
        return self.token_id == other.token_id

    def __len__(self) -> int:
        return len(self.text)

print(repr(Token("hello", 15496)))        # Token('hello', id=15496)
print(Token("hi", 1) == Token("bye", 1))   # True (same id)

@dataclass(frozen=True)                     # immutable + hashable
class VocabEntry:
    word: str
    freq: int
    tags: list[str] = field(default_factory=list)  # safe mutable default

v = VocabEntry("hello", 1000)
print(v)                                    # VocabEntry(word='hello', freq=1000, tags=[])
# v.freq = 5  # -> FrozenInstanceError`,
    },
    codeExamples: [
      {
        language: "python",
        tab: "Dataclasses",
        title: "@dataclass vs a hand-written class",
        code: `from dataclasses import dataclass, field

# Verbose, hand-written version
class TokenManual:
    def __init__(self, text: str, token_id: int, logprob: float = 0.0):
        self.text = text
        self.token_id = token_id
        self.logprob = logprob

    def __repr__(self):
        return f"TokenManual(text={self.text!r}, token_id={self.token_id}, logprob={self.logprob})"

    def __eq__(self, other):
        return (self.text, self.token_id, self.logprob) == (
            other.text, other.token_id, other.logprob
        )

# The same thing with @dataclass
@dataclass
class Token:
    text: str
    token_id: int
    logprob: float = 0.0                    # default value

@dataclass(frozen=True)                     # immutable => hashable
class VocabEntry:
    word: str
    freq: int
    embeddings: list[float] = field(default_factory=list)  # mutable default

t = Token("world", 995, logprob=-1.2)
print(t)                                    # auto __repr__
print(t == Token("world", 995, -1.2))       # auto __eq__ -> True

v = VocabEntry("hello", 1000)
print(hash(v) is not None)                   # frozen -> hashable`,
      },
      {
        language: "python",
        tab: "Inheritance & MRO",
        title: "super(), classmethods, and the MRO",
        code: `class LLMBase:
    DEFAULT_MODEL = "gpt-3.5-turbo"

    def __init__(self, model: str, temperature: float = 0.7):
        self.model = model
        self.temperature = temperature

    @classmethod
    def from_config(cls, config: dict) -> "LLMBase":
        """Alternative constructor from a dict config."""
        return cls(
            model=config.get("model", cls.DEFAULT_MODEL),
            temperature=config.get("temperature", 0.7),
        )

    def __repr__(self):
        return f"{type(self).__name__}(model={self.model!r}, temp={self.temperature})"


class GPT4(LLMBase):
    DEFAULT_MODEL = "gpt-4"

    def __init__(self, temperature: float = 0.7, max_tokens: int = 1024):
        super().__init__(self.DEFAULT_MODEL, temperature)  # init the parent
        self.max_tokens = max_tokens


llm = GPT4.from_config({"model": "gpt-4", "temperature": 0.9})
print(llm)                                          # GPT4(model='gpt-4', temp=0.9)
print([c.__name__ for c in GPT4.__mro__])            # ['GPT4', 'LLMBase', 'object']`,
      },
      {
        language: "python",
        tab: "Method types",
        title: "instance vs @classmethod vs @staticmethod",
        code: `class Circle:
    PI = 3.14159                     # class attribute (shared)

    def __init__(self, radius: float):
        self.radius = radius         # instance attribute (per object)

    # instance method: needs self, uses instance data
    def area(self) -> float:
        return Circle.PI * self.radius ** 2

    # classmethod: gets cls, an alternative constructor
    @classmethod
    def unit(cls) -> "Circle":
        return cls(1.0)

    # staticmethod: no self/cls, pure utility grouped under the class
    @staticmethod
    def is_valid_radius(r: float) -> bool:
        return r > 0

print(Circle(2).area())              # 12.56636
print(Circle.unit().radius)          # 1.0  (built via cls)
print(Circle.is_valid_radius(-5))    # False`,
      },
    ],
    problemStatement:
      "You are designing the data layer for an LLM gateway. Requests need a lightweight, immutable, hashable value object (so it can be a cache key), a base LLMClient with an alternative constructor from_config(dict), and provider subclasses (OpenAIClient, AnthropicClient) that must correctly initialize shared base state. A colleague's code uses a bare `history: list = []` default and finds that all instances mysteriously share one history list. Explain the class-vs-instance attribute distinction, why super() and the MRO matter for the subclasses, which method should be a @classmethod, and how @dataclass(frozen=True) plus field(default_factory=list) fixes the shared-list bug.",
    questions: [
      {
        q: "What is the difference between a class attribute and an instance attribute?",
        options: [
          "A. There is no difference",
          "B. Class attributes are shared by all instances; instance attributes are unique per object",
          "C. Instance attributes must be strings",
          "D. Class attributes can only be defined inside __init__",
        ],
        answer: "B",
        explanation:
          "B is correct: class attributes live on the class and are shared by every instance, while instance attributes (set via self.x = ...) belong to a single object. Assigning through self.attr creates a shadowing instance attribute rather than mutating the class attribute.",
      },
      {
        q: "What does calling `super().__init__(...)` inside a subclass's __init__ do?",
        options: [
          "A. Creates a new object with __new__",
          "B. Invokes the next class in the MRO so the parent initializes its own attributes",
          "C. Deletes the parent class",
          "D. Makes the subclass abstract",
        ],
        answer: "B",
        explanation:
          "B is correct: super() delegates to the next class in the Method Resolution Order, letting the parent set up its state. Skipping it can leave parent attributes uninitialized and break cooperative multiple inheritance.",
      },
      {
        q: "Which three methods does a plain `@dataclass` automatically generate?",
        options: [
          "A. __new__, __del__, __hash__",
          "B. __init__, __repr__, __eq__",
          "C. __enter__, __exit__, __call__",
          "D. __getitem__, __setitem__, __len__",
        ],
        answer: "B",
        explanation:
          "B is correct: @dataclass synthesizes __init__, __repr__, and __eq__ from the annotated fields. (__hash__ is only added automatically when the dataclass is frozen or eq/frozen are configured accordingly.)",
      },
      {
        q: "What does `@dataclass(frozen=True)` provide?",
        options: [
          "A. Faster attribute access only",
          "B. Immutable instances that are also hashable (usable as dict keys / set members)",
          "C. Automatic thread safety for all methods",
          "D. Prevents the class from being subclassed",
        ],
        answer: "B",
        explanation:
          "B is correct: frozen=True raises FrozenInstanceError on attribute assignment after creation and makes instances hashable, since consistent hashing requires immutability. It does not provide thread safety or block subclassing.",
      },
      {
        q: "When should you use `@classmethod` rather than `@staticmethod`?",
        options: [
          "A. @classmethod is for private methods; @staticmethod for public ones",
          "B. When the method needs `cls` — e.g. an alternative constructor that returns cls(...)",
          "C. @classmethod can read instance attributes; @staticmethod cannot",
          "D. They are interchangeable in every case",
        ],
        answer: "B",
        explanation:
          "B is correct: @classmethod receives cls, which is ideal for alternative constructors and factory methods (Model.from_config()). @staticmethod receives neither self nor cls and is just a utility grouped under the class; neither can access instance attributes.",
      },
      {
        q: "A dataclass field declared as `tags: list = []` causes what problem?",
        options: [
          "A. Nothing — it is the recommended way",
          "B. A SyntaxError at import time",
          "C. In a plain class it would share one list across instances; dataclasses reject it, so use field(default_factory=list)",
          "D. It makes the dataclass frozen",
        ],
        answer: "C",
        explanation:
          "C is correct: a mutable default shared as a bare literal is the classic shared-state bug. Python dataclasses detect a mutable default and raise an error, forcing you to use field(default_factory=list) so each instance gets its own list.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "be-advanced-python",
    title: "Decorators & Context Managers",
    shortLabel: "Decorators & Context Mgrs",
    section: "Advanced Python",
    domain: "Backend",
    tldr:
      "A decorator is a callable that takes a function and returns a wrapped one — `@dec` is sugar for `func = dec(func)`. Always use functools.wraps to preserve the wrapped function's metadata; decorators that take arguments need three nesting levels. A context manager guarantees setup/teardown around a with-block via __enter__/__exit__ (or a @contextmanager generator whose code before yield is enter and after yield is exit); returning True from __exit__ suppresses the exception.",
    subtopics: [
      {
        heading: "Decorators",
        bullets: [
          { icon: "🎁", text: "A decorator **wraps** a function with extra behavior (logging, timing, caching, retry) and returns the wrapper — `@dec` ≡ `func = dec(func)`." },
          { icon: "🏷️", text: "Always apply `@functools.wraps(func)` to the inner wrapper to **preserve** `__name__`, `__doc__`, and annotations." },
          { icon: "🪆", text: "A **decorator with arguments** needs **three levels**: outer factory → decorator → wrapper (or a class with `__call__`)." },
        ],
      },
      {
        heading: "Context managers",
        bullets: [
          { icon: "🚪", text: "`with` guarantees **cleanup**: `__enter__` runs on entry (its return is the `as` value), `__exit__` runs on exit — even on exception." },
          { icon: "🔁", text: "`@contextmanager` turns a generator into one: code **before `yield`** = enter, code **after `yield`** (in `finally`) = exit." },
          { icon: "🤫", text: "`__exit__` receives the exception info; **returning `True` suppresses** it. `contextlib.suppress(Err)` is the clean shortcut." },
        ],
      },
      {
        heading: "Where they shine",
        bullets: [
          { icon: "🌐", text: "**Decorators** power `@app.get` (FastAPI), `@pytest.fixture`, `@lru_cache`, and `@retry` resilience wrappers." },
          { icon: "🧹", text: "**Context managers** manage files, DB connections/transactions, locks, and GPU memory — cleanup is guaranteed." },
          { icon: "🧪", text: "`functools.lru_cache` is a built-in decorator that **memoizes** results; `@contextmanager` is the fast way to write ad-hoc managers." },
        ],
      },
    ],
    keyFacts: [
      { label: "@dec is sugar for", value: "func = dec(func)", icon: "🎁" },
      { label: "Preserve metadata", value: "functools.wraps", icon: "🏷️" },
      { label: "Decorator w/ args", value: "3 nesting levels", icon: "🪆" },
      { label: "__exit__ returns True", value: "Suppresses exception", icon: "🤫" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'Add behavior without editing the function' → **decorator** (`func = dec(func)`).",
        "'Decorated function lost its name/docstring' → missing **functools.wraps**.",
        "'Decorator that takes parameters' → **three** nested functions.",
        "'Guaranteed cleanup even on error' → **context manager** / `with`.",
        "'Silence a specific exception cleanly' → `contextlib.suppress(Err)` or `return True` from `__exit__`.",
      ],
      analogyBrief:
        "A decorator is gift-wrapping: hand over the function, get back the same function inside extra paper (logging/timing). A context manager is an automatic door: it opens when you enter (with) and is guaranteed to close when you leave, even if you trip (exception).",
    },
    explanation:
      "A decorator is a callable that takes a function (or class) and returns a replacement, and the @ syntax is pure sugar: writing @dec above def func is exactly equivalent to func = dec(func) after the definition. The typical shape is an outer decorator that defines an inner wrapper closing over the original func; the wrapper accepts *args and **kwargs, does something before and/or after, calls func, and returns its result. A critical detail is to decorate the inner wrapper with @functools.wraps(func): without it the decorated object's __name__ becomes 'wrapper' and its __doc__ and annotations are lost, breaking debugging, logging, and introspection tools. When a decorator itself needs configuration (for example @retry(max_attempts=3)), you need three levels of nesting: an outer factory that captures the arguments and returns the actual decorator, which returns the wrapper — or equivalently a class-based decorator implementing __call__. functools.lru_cache is a widely used built-in decorator that memoizes results by arguments. Context managers solve the orthogonal problem of guaranteed setup and teardown around a block of code. Any object implementing __enter__ and __exit__ can be used with the with statement: __enter__ runs on entry and its return value is bound to the as variable, while __exit__ always runs on exit — whether the block finished normally or raised. __exit__ receives the exception type, value, and traceback (all None on success); returning a truthy value from __exit__ suppresses the exception so execution continues after the with block, whereas returning False (or None) lets it propagate. Writing the two methods by hand is verbose, so contextlib.contextmanager lets you author a manager as a generator: everything before the single yield is the enter phase, the yielded value becomes the as variable, and everything after the yield — placed inside a try/finally so it runs even on error — is the exit phase. The standard library also ships contextlib.suppress(SomeError) as a concise way to swallow specific exceptions. In production these two tools are everywhere: decorators back FastAPI's @app.get routes, pytest fixtures, caching, and retry logic, while context managers manage files, database connections and transactions, threading locks, and GPU memory so resources are always released.",
    analogy:
      "Picture a decorator as a gift-wrapping station at a shop. You hand the clerk a plain function; they keep the function exactly as it is but wrap it in extra paper that adds a bow (logging), a timer sticker (profiling), or a 'try three times' warranty (retry), then hand back a package that behaves like the original but with the extras. functools.wraps is the clerk carefully copying the original label onto the wrapping so you still know what's inside. A context manager, by contrast, is an automatic door with a spring closer: the moment you step through with the with statement it opens (__enter__) and hands you a badge (the as value); no matter how you leave — calmly or by tripping over an exception — the door is guaranteed to swing shut behind you (__exit__), so nothing is ever left propped open (a leaked file handle or database connection). If the door is told to 'ignore stumbles' (return True), it quietly catches you instead of letting the fall propagate.",
    diagram: `<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Decorator wrapping and context manager lifecycle">${svgDefs}
      <text x="180" y="24" text-anchor="middle" fill="#e6edf3" font-size="14" font-weight="700">Decorator</text>
      ${box(30, 40, 300, 44, "@timer def work(): ...", "syntactic sugar", "#3b82f6")}
      <line x1="180" y1="84" x2="180" y2="108" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(30, 110, 300, 44, "work = timer(work)", "wrapper replaces work", "#8b5cf6")}
      <text x="180" y="188" text-anchor="middle" fill="#8b949e" font-size="10">wrapper: before → func() → after (use functools.wraps)</text>
      <text x="540" y="24" text-anchor="middle" fill="#e6edf3" font-size="14" font-weight="700">Context manager</text>
      ${box(400, 40, 280, 40, "with open(p) as f:", "__enter__ → f", "#22c55e")}
      ${box(400, 92, 280, 40, "    ...block...", "yield / body runs", "#f59e0b")}
      ${box(400, 144, 280, 40, "__exit__ (always)", "cleanup, even on error", "#f85149")}
      <line x1="540" y1="80" x2="540" y2="90" stroke="#8b949e" stroke-width="1.5" marker-end="url(#arrow-mute)"/>
      <line x1="540" y1="132" x2="540" y2="142" stroke="#8b949e" stroke-width="1.5" marker-end="url(#arrow-mute)"/>
      <text x="540" y="210" text-anchor="middle" fill="#8b949e" font-size="10">__exit__ returning True suppresses the exception</text>
      <text x="360" y="270" text-anchor="middle" fill="#8b949e" font-size="10">@contextmanager: code before yield = enter, after yield (finally) = exit</text>
    </svg>`,
    diagramLegend: [
      { color: "#8b5cf6", label: "Wrapper", description: "The replacement function a decorator returns; wraps the original call." },
      { color: "#22c55e", label: "__enter__", description: "Runs on with-entry; its return is the `as` variable." },
      { color: "#f85149", label: "__exit__", description: "Always runs on exit; return True to suppress the exception." },
    ],
    codeExample: {
      language: "python",
      title: "A timing decorator (with wraps) and a @contextmanager",
      code: `import time
import functools
from contextlib import contextmanager

def timer(func):
    @functools.wraps(func)              # preserves __name__ / __doc__
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        print(f"[timer] {func.__name__} took {time.perf_counter() - start:.4f}s")
        return result
    return wrapper

@timer
def slow_sum(n: int) -> int:
    time.sleep(0.01)
    return sum(range(n))

print(slow_sum(1000))                    # prints timing, then 499500
print(slow_sum.__name__)                 # 'slow_sum'  (thanks to wraps)

@contextmanager
def timed(label: str):
    start = time.perf_counter()
    try:
        yield                            # the with-block runs here
    finally:
        print(f"[{label}] {time.perf_counter() - start:.4f}s")

with timed("work"):
    total = sum(range(100_000))`,
    },
    codeExamples: [
      {
        language: "python",
        tab: "Decorators",
        title: "wraps, a decorator with arguments, and lru_cache",
        code: `import time
import functools

# Simple decorator — always use functools.wraps
def log_calls(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print(f"-> {func.__name__}{args}")
        return func(*args, **kwargs)
    return wrapper

# Decorator WITH arguments needs three levels of nesting
def retry(max_attempts: int = 3, delay: float = 0.01):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            last = None
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:      # noqa: BLE001
                    last = e
                    time.sleep(delay * (attempt + 1))
            raise last
        return wrapper
    return decorator

@log_calls
@retry(max_attempts=3)
def flaky(state: list) -> str:
    if state[0] > 0:
        state[0] -= 1
        raise ConnectionError("API unavailable")
    return "ok"

print(flaky([2]))                          # retries twice, then "ok"

# Built-in memoization decorator
@functools.lru_cache(maxsize=None)
def fib(n: int) -> int:
    return n if n < 2 else fib(n - 1) + fib(n - 2)

print(fib(30))                             # fast — cached`,
      },
      {
        language: "python",
        tab: "Class ctx manager",
        title: "__enter__ / __exit__ and suppressing exceptions",
        code: `class DatabaseConnection:
    def __init__(self, url: str):
        self.url = url
        self.connected = False

    def __enter__(self):
        print(f"connecting to {self.url}")
        self.connected = True
        return self                         # bound to 'as conn'

    def __exit__(self, exc_type, exc_val, exc_tb):
        # runs even if the block raised
        print(f"closing (error={exc_type.__name__ if exc_type else None})")
        self.connected = False
        return False                        # False -> exception propagates

with DatabaseConnection("postgres://localhost/db") as conn:
    print("connected:", conn.connected)
print("after with:", conn.connected)        # False -> cleaned up


class Silence:
    """A context manager that swallows a given exception type."""
    def __init__(self, *exc):
        self.exc = exc

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        return exc_type is not None and issubclass(exc_type, self.exc)

with Silence(ZeroDivisionError):
    _ = 1 / 0                               # swallowed
print("survived the division by zero")`,
      },
      {
        language: "python",
        tab: "contextlib",
        title: "@contextmanager and contextlib.suppress",
        code: `from contextlib import contextmanager, suppress

# Author a context manager as a generator
@contextmanager
def transaction(conn):
    print("BEGIN")
    try:
        yield conn                          # <- value bound to 'as tx'
        print("COMMIT")                     # runs only if no exception
    except Exception:
        print("ROLLBACK")                   # runs on error
        raise
    finally:
        print("release connection")         # ALWAYS runs

class FakeConn: ...

try:
    with transaction(FakeConn()) as tx:
        print("insert row")
        raise ValueError("constraint violated")
except ValueError:
    print("handled at call site")

# suppress: the clean way to ignore a specific exception
with suppress(FileNotFoundError):
    with open("does-not-exist.txt") as f:
        f.read()
print("FileNotFoundError was suppressed")`,
      },
    ],
    problemStatement:
      "Your FastAPI service repeats the same three concerns across many endpoints: (1) timing and logging each call, (2) retrying flaky upstream calls up to N times with backoff, and (3) opening a database transaction that must commit on success and roll back and always release the connection on failure. A teammate wrote a decorator but the profiler now reports every endpoint as 'wrapper', and their cleanup code silently skips when the handler raises. Explain how to build a reusable timing/logging decorator (and why functools.wraps fixes the naming), a parameterized @retry decorator (why three nesting levels are needed), and a transaction context manager (class-based and via @contextmanager) whose finally guarantees release.",
    questions: [
      {
        q: "What is `@my_decorator` above `def func(): ...` equivalent to?",
        options: [
          "A. func = my_decorator",
          "B. func = my_decorator(func)",
          "C. my_decorator = func()",
          "D. func = func(my_decorator)",
        ],
        answer: "B",
        explanation:
          "B is correct: the @ syntax is sugar for reassigning the name to the decorator's return value — func = my_decorator(func). The decorator receives the original function and returns its replacement.",
      },
      {
        q: "Why should you apply `functools.wraps(func)` to a decorator's inner wrapper?",
        options: [
          "A. It makes the decorated function run faster",
          "B. It preserves the wrapped function's __name__, __doc__, and other metadata",
          "C. It is required or the decorator raises an error",
          "D. It automatically adds retry behavior",
        ],
        answer: "B",
        explanation:
          "B is correct: without wraps, introspection sees 'wrapper' and loses the original __name__, __doc__, and annotations, breaking logging, debugging, and tools. It is not about speed and the decorator still works without it.",
      },
      {
        q: "How many levels of nested functions does a decorator that TAKES ARGUMENTS require?",
        options: [
          "A. One",
          "B. Two",
          "C. Three (factory → decorator → wrapper)",
          "D. Four",
        ],
        answer: "C",
        explanation:
          "C is correct: an outer factory captures the arguments and returns the actual decorator, which returns the wrapper — three levels. A class implementing __call__ is an equivalent alternative.",
      },
      {
        q: "In a context manager's `__exit__(self, exc_type, exc_val, exc_tb)`, what does returning `True` do?",
        options: [
          "A. Re-raises the exception",
          "B. Suppresses (swallows) the exception so code after the with block runs",
          "C. Restarts the with block",
          "D. Signals that setup succeeded",
        ],
        answer: "B",
        explanation:
          "B is correct: a truthy return from __exit__ suppresses the in-flight exception. Returning False or None lets it propagate. contextlib.suppress(ExceptionType) is a cleaner shortcut for the same effect.",
      },
      {
        q: "In a `@contextmanager` generator, what does the code AFTER `yield` correspond to?",
        options: [
          "A. The __enter__ phase",
          "B. The value bound to the `as` variable",
          "C. The __exit__ / cleanup phase (typically in a finally block)",
          "D. It is never executed",
        ],
        answer: "C",
        explanation:
          "C is correct: code before yield is the enter phase, the yielded value is the `as` variable, and code after yield (placed in a finally so it runs even on error) is the exit/cleanup phase.",
      },
      {
        q: "Which built-in decorator memoizes a function's return values by its arguments?",
        options: [
          "A. functools.wraps",
          "B. functools.lru_cache",
          "C. contextlib.contextmanager",
          "D. dataclasses.dataclass",
        ],
        answer: "B",
        explanation:
          "B is correct: functools.lru_cache caches results keyed by the call arguments, avoiding recomputation. wraps preserves metadata, contextmanager builds context managers, and dataclass generates data-class boilerplate.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "be-error-handling",
    title: "Errors & Exceptions",
    shortLabel: "Errors & Exceptions",
    section: "Advanced Python",
    domain: "Backend",
    tldr:
      "Python signals failures with exceptions that inherit from BaseException (user code should subclass Exception). try/except/else/finally handles them: except matches by type (most specific first), else runs only on success, finally always runs for cleanup. Custom exceptions give precise error types, and chaining with `raise New from original` preserves the root cause in the traceback (__cause__). Catch only what you can handle, log the rest, and re-raise.",
    subtopics: [
      {
        heading: "The exception model",
        bullets: [
          { icon: "🌳", text: "All exceptions inherit from **BaseException**; almost all user-relevant ones from **Exception** (subclass that, not BaseException)." },
          { icon: "🏷️", text: "Common types: **ValueError** (bad value), **TypeError** (bad type), **KeyError**, **AttributeError**, **FileNotFoundError**, **TimeoutError**." },
          { icon: "🎯", text: "`except` matches by type and **subclass**; order clauses **most-specific-first**, since the first matching handler wins." },
        ],
      },
      {
        heading: "try / except / else / finally",
        bullets: [
          { icon: "🛟", text: "**`else`** runs only when the `try` block raised **no** exception — keep success-only code out of `try`." },
          { icon: "🧹", text: "**`finally`** **always** runs (exception or not) — the place for guaranteed cleanup." },
          { icon: "♻️", text: "A bare **`raise`** inside `except` **re-raises** the current exception, preserving its original traceback." },
        ],
      },
      {
        heading: "Custom exceptions & chaining",
        bullets: [
          { icon: "🧱", text: "Define domain errors with `class AppError(Exception): ...` — richer than a bare string, catchable by base type." },
          { icon: "🔗", text: "**Chaining**: `raise NewError(...) from original` links via `__cause__`; the traceback shows **both** the high-level and root cause." },
          { icon: "🙈", text: "`raise NewError(...) from None` **hides** the original chain when it is noise; never silently `except:` and swallow." },
        ],
      },
    ],
    keyFacts: [
      { label: "Subclass for user errors", value: "Exception", icon: "🧱" },
      { label: "else runs when", value: "No exception in try", icon: "🛟" },
      { label: "finally runs", value: "Always (cleanup)", icon: "🧹" },
      { label: "Chain root cause", value: "raise New from original", icon: "🔗" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'Runs only if no error' → the **else** clause.",
        "'Runs no matter what' → **finally** (guaranteed cleanup).",
        "'Preserve the root cause' → `raise NewError(...) **from** original`.",
        "'Re-raise the same error' → bare **`raise`** inside except.",
        "Order except clauses **most-specific first**; never bare `except:` and swallow.",
      ],
      analogyBrief:
        "Exception handling is a construction site's safety system: you work (try), nets catch specific falls (except), you record a clean-run report (else) only if nothing went wrong, and you always pack up your tools (finally) whether or not there was an accident.",
    },
    explanation:
      "Python reports errors by raising exceptions, objects that propagate up the call stack until something handles them or the program terminates. All exceptions descend from BaseException, but user code should almost always inherit from Exception; BaseException also parents control-flow signals like KeyboardInterrupt and SystemExit that you normally do not want to catch. Familiar built-ins include ValueError (a value of the right type but wrong content, such as int('abc')), TypeError (an operation on the wrong type), KeyError and IndexError (missing lookups), AttributeError, FileNotFoundError (a subclass of OSError), ImportError/ModuleNotFoundError, and TimeoutError. The core construct is try/except/else/finally. The try block contains the risky code; each except clause matches an exception type and its subclasses, so you list the most specific handlers first because the first matching clause wins — putting except Exception before except ValueError would shadow the latter. You can catch several types together with a tuple, e.g. except (KeyError, AttributeError) as e. The optional else clause runs only when the try block completed without raising, which is the right home for follow-on logic that should not itself be guarded, and the finally clause always runs whether or not an exception occurred (and even if one is propagating), making it the place for guaranteed cleanup like closing handles or releasing locks. Inside an except block a bare raise re-raises the exception currently being handled while preserving its original traceback, which is the correct way to log-and-propagate errors you cannot fully handle. Custom exceptions make failures precise and catchable by category: define a base like class AppError(Exception) and subclass it (RateLimitError(AppError)) so callers can catch broadly or narrowly. Exception chaining is a key debugging tool: writing raise NewError('...') from original sets the new exception's __cause__ to the original, so the traceback shows both the high-level failure and its root cause; conversely raise NewError('...') from None deliberately hides an irrelevant underlying error. The cardinal rules are to catch only exceptions you can meaningfully handle, never use a bare except: that silently swallows everything (masking bugs and even KeyboardInterrupt), and to log-and-re-raise anything unexpected so failures stay visible in production.",
    analogy:
      "Handling exceptions is like running a construction site under a proper safety regime. The work you attempt is the try block. Around it you string safety nets, each rated for a specific kind of fall — one for slips (ValueError), one for dropped tools (KeyError) — and you hang the tightest, most specific nets first so the right one catches each accident (most-specific except clauses first). If the shift ends with no incident, the site supervisor files a clean-run report (the else clause) — something you only do when nothing went wrong. And regardless of whether the day was smooth or someone took a tumble, at the end you always pack up the tools and lock the gate (the finally clause). When you do log an accident but can't fully deal with it on the spot, you escalate the exact same incident upward (a bare raise) rather than inventing a vague new one, and if you must wrap it in a higher-level report you staple the original incident form to the back (raise ... from original) so investigators can trace the root cause.",
    diagram: `<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="try except else finally control flow">${svgDefs}
      <text x="360" y="24" text-anchor="middle" fill="#e6edf3" font-size="15" font-weight="700">try / except / else / finally</text>
      ${box(40, 50, 150, 46, "try:", "risky code", "#3b82f6")}
      ${box(280, 50, 170, 46, "raise!", "exception occurs", "#f85149")}
      ${box(520, 50, 160, 46, "except Err:", "handle by type", "#f59e0b")}
      <line x1="190" y1="73" x2="278" y2="73" stroke="#f85149" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#arrow)"/>
      <line x1="450" y1="73" x2="518" y2="73" stroke="#f85149" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#arrow)"/>
      ${box(40, 140, 200, 46, "else:", "runs ONLY if no error", "#22c55e")}
      <line x1="115" y1="96" x2="130" y2="138" stroke="#22c55e" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="150" y="120" fill="#22c55e" font-size="10">no exception</text>
      <rect x="40" y="210" width="640" height="46" rx="8" fill="#243349" stroke="#8b5cf6"/>
      <text x="360" y="238" text-anchor="middle" fill="#8b5cf6" font-size="12" font-weight="700">finally: — ALWAYS runs (exception or not) → cleanup</text>
      <text x="360" y="284" text-anchor="middle" fill="#8b949e" font-size="10">chaining: raise NewError(...) from original  →  traceback shows both via __cause__</text>
    </svg>`,
    diagramLegend: [
      { color: "#f85149", label: "except", description: "Matches an exception type (and subclasses); most-specific first." },
      { color: "#22c55e", label: "else", description: "Runs only when the try block raised no exception." },
      { color: "#8b5cf6", label: "finally", description: "Always runs — guaranteed cleanup even while an exception propagates." },
    ],
    codeExample: {
      language: "python",
      title: "Custom exceptions, chaining, and the full flow",
      code: `import json

class AppError(Exception):
    """Base for all application errors."""

class LLMError(AppError):
    def __init__(self, message: str, model: str):
        super().__init__(message)
        self.model = model

def call_api() -> str:
    raw = '{"choices": [{"message": {"content"'   # broken JSON
    try:
        return json.loads(raw)["choices"][0]["message"]["content"]
    except json.JSONDecodeError as e:
        raise LLMError("Malformed API response", model="gpt-4") from e  # chain

def safe_call() -> str | None:
    try:
        result = call_api()
    except LLMError as e:
        print(f"handled: {e}  (cause: {e.__cause__})")   # shows root cause
        return None
    else:
        return result          # only if no exception
    finally:
        print("cleanup always runs")

safe_call()`,
    },
    codeExamples: [
      {
        language: "python",
        tab: "Flow",
        title: "try / except / else / finally and re-raising",
        code: `def parse_port(raw: str) -> int:
    try:
        port = int(raw)                       # may raise ValueError
    except ValueError as e:
        print(f"not a number: {e}")
        raise                                 # re-raise, keep original traceback
    except (KeyError, AttributeError) as e:    # catch several at once
        print(f"lookup problem: {e}")
        return 0
    else:
        # runs ONLY if no exception was raised in try
        print("parsed successfully")
        return port
    finally:
        # ALWAYS runs — even on the re-raise above
        print("done parsing attempt")

print(parse_port("8080"))       # success path -> else + finally
try:
    parse_port("oops")          # error path -> except re-raises + finally
except ValueError:
    print("caller saw the ValueError")`,
      },
      {
        language: "python",
        tab: "Custom & chaining",
        title: "Custom hierarchy, `from`, and `from None`",
        code: `class ConfigError(Exception):
    """Base for configuration problems."""

class MissingKeyError(ConfigError):
    def __init__(self, key: str):
        super().__init__(f"missing required key: {key}")
        self.key = key

def load(cfg: dict) -> str:
    try:
        return cfg["model"]
    except KeyError as e:
        # chain: preserve the KeyError as the root cause
        raise MissingKeyError("model") from e

try:
    load({})
except ConfigError as e:                     # catch by BASE type
    print(type(e).__name__, "->", e)
    print("cause:", repr(e.__cause__))       # KeyError('model')

# Hide an irrelevant underlying error with 'from None'
def to_int(x: str) -> int:
    try:
        return int(x)
    except ValueError:
        raise ConfigError(f"expected an integer, got {x!r}") from None

try:
    to_int("abc")
except ConfigError as e:
    print(e, "| cause:", e.__cause__)         # cause is None (hidden)`,
      },
      {
        language: "python",
        tab: "Pathlib I/O",
        title: "Robust file handling with pathlib",
        code: `from pathlib import Path
import json

def read_config(path: Path) -> dict:
    try:
        text = path.read_text(encoding="utf-8")     # no manual open/close
    except FileNotFoundError:
        print(f"{path} not found, using defaults")
        return {"model": "gpt-4", "temperature": 0.7}
    try:
        return json.loads(text)
    except json.JSONDecodeError as e:
        raise ValueError(f"invalid JSON in {path}") from e

base = Path("data")
cfg_path = base / "config.json"                     # '/' joins paths
base.mkdir(parents=True, exist_ok=True)
cfg_path.write_text(json.dumps({"model": "gpt-4"}))

print("exists:", cfg_path.exists())
print("suffix/stem:", cfg_path.suffix, cfg_path.stem)   # .json config
print(read_config(cfg_path))
print(read_config(base / "missing.json"))           # falls back to defaults
cfg_path.unlink(missing_ok=True)                     # safe delete`,
      },
    ],
    problemStatement:
      "A payments microservice wraps a flaky third-party API and a JSON config loader. In production you see two problems: (1) a bare `except:` around the API call is silently swallowing everything — including a genuine bug and even Ctrl-C — so failures never surface, and (2) when the config JSON is malformed the logs only show a generic 'error' with no idea of the underlying cause. Redesign the error handling: define a small custom exception hierarchy, use try/except/else/finally correctly (guaranteed cleanup, success-only code in else), catch only what you can handle and re-raise the rest, and use exception chaining so the traceback preserves the root JSONDecodeError. Explain why catching Exception is fine but BaseException is not.",
    questions: [
      {
        q: "Which base class should custom, user-defined exceptions normally inherit from?",
        options: [
          "A. BaseException",
          "B. Exception",
          "C. object",
          "D. RuntimeError only",
        ],
        answer: "B",
        explanation:
          "B is correct: user exceptions should subclass Exception. BaseException also parents KeyboardInterrupt and SystemExit, which you usually do not want a broad handler to catch — so inheriting from Exception keeps those signals separate.",
      },
      {
        q: "When does the `else` clause of a try/except statement run?",
        options: [
          "A. Whenever an exception is raised",
          "B. Only when the try block completed with no exception",
          "C. Always, after the try block",
          "D. Only when a specific exception matches",
        ],
        answer: "B",
        explanation:
          "B is correct: else runs exactly when the try block did not raise. It is the inverse of except and is the right place for success-only follow-up code that you do not want inside the guarded try.",
      },
      {
        q: "What is guaranteed about the `finally` clause?",
        options: [
          "A. It runs only if an exception occurred",
          "B. It runs only if no exception occurred",
          "C. It always runs — on success, on error, and even while an exception propagates",
          "D. It runs before the except clause",
        ],
        answer: "C",
        explanation:
          "C is correct: finally always executes, making it the correct place for cleanup (closing files, releasing locks). It runs even when an exception is propagating out of the try/except.",
      },
      {
        q: "What does `raise NewError('msg') from original_error` accomplish?",
        options: [
          "A. It silences the original error entirely",
          "B. It chains the new exception to the original, preserving the root cause in the traceback via __cause__",
          "C. It raises both exceptions in parallel threads",
          "D. It converts original_error's type in place",
        ],
        answer: "B",
        explanation:
          "B is correct: exception chaining sets __cause__ to the original, so the traceback shows both the high-level error and its root cause. Use `from None` instead to deliberately hide an irrelevant original.",
      },
      {
        q: "Inside an `except` block, what does a bare `raise` (with no argument) do?",
        options: [
          "A. Raises a new generic Exception",
          "B. Re-raises the exception currently being handled, keeping its original traceback",
          "C. Suppresses the exception",
          "D. Restarts the try block",
        ],
        answer: "B",
        explanation:
          "B is correct: a bare raise re-raises the active exception with its original traceback intact — the idiomatic way to log-and-propagate an error you cannot fully handle without losing debugging context.",
      },
      {
        q: "Why should you avoid a bare `except:` that catches everything and returns silently?",
        options: [
          "A. It is a syntax error",
          "B. It hides bugs and even catches KeyboardInterrupt / SystemExit, masking failures in production",
          "C. It is slower than catching Exception",
          "D. It only works in Python 2",
        ],
        answer: "B",
        explanation:
          "B is correct: a bare except swallows every exception including control-flow signals like KeyboardInterrupt and SystemExit, hiding real defects. Catch only what you can handle, log the rest, and re-raise.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "be-concurrency",
    title: "Threading & Multiprocessing",
    shortLabel: "Threading & Multiproc",
    section: "Advanced Python",
    domain: "Backend",
    tldr:
      "CPython's GIL lets only one thread run Python bytecode at a time, so threads speed up I/O-bound work (they release the GIL while waiting) but not CPU-bound work. Use ThreadPoolExecutor for I/O (API calls, file reads), ProcessPoolExecutor for CPU-bound work (separate processes bypass the GIL, at the cost of IPC/serialization overhead), and asyncio for very large numbers of concurrent I/O tasks. Protect shared mutable state in threads with a Lock.",
    subtopics: [
      {
        heading: "The GIL",
        bullets: [
          { icon: "🔐", text: "The **Global Interpreter Lock** allows only **one thread** to execute Python bytecode at a time." },
          { icon: "🌐", text: "Threads **DO** speed up **I/O-bound** work — I/O (network, disk) **releases the GIL** so another thread runs." },
          { icon: "🧮", text: "Threads do **NOT** speed up **CPU-bound** Python — the GIL is never released during pure computation." },
        ],
      },
      {
        heading: "Threading vs multiprocessing",
        bullets: [
          { icon: "🧵", text: "**threading / ThreadPoolExecutor**: shared memory, low overhead — best for **I/O-bound** (API calls, downloads)." },
          { icon: "🏭", text: "**multiprocessing / ProcessPoolExecutor**: separate processes, no shared GIL — best for **CPU-bound** work (true parallelism)." },
          { icon: "📦", text: "Processes have **IPC + serialization** overhead and no shared memory; startup costs 50–200ms, so only worth it for tasks > ~100ms each." },
        ],
      },
      {
        heading: "concurrent.futures & locks",
        bullets: [
          { icon: "🚀", text: "`submit()` returns a **Future** (non-blocking); `map()` blocks and returns results **in order**; `as_completed()` yields futures as they **finish**." },
          { icon: "🔒", text: "Guard shared mutable state with `threading.Lock` (`with lock:`) to prevent **race conditions**." },
          { icon: "⚠️", text: "`future.result()` **re-raises** the worker's exception — wrap it in try/except or check `future.exception()`." },
        ],
      },
    ],
    keyFacts: [
      { label: "GIL allows", value: "1 thread of bytecode", icon: "🔐" },
      { label: "Threads help", value: "I/O-bound work", icon: "🧵" },
      { label: "Processes help", value: "CPU-bound work", icon: "🏭" },
      { label: "as_completed()", value: "Yields as they finish", icon: "🚀" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'Threads don't speed up my number-crunching' → the **GIL** (CPU-bound needs processes).",
        "'Many parallel API calls' → **ThreadPoolExecutor** (I/O-bound).",
        "'Heavy CPU work in parallel' → **ProcessPoolExecutor** (bypasses the GIL).",
        "'Results as soon as ready' → **as_completed()**; 'in order' → **map()**.",
        "'Multiple threads writing shared state' → guard with a **Lock**.",
      ],
      analogyBrief:
        "Threads are cooks sharing one knife (the GIL): while one waits for the oven (I/O) another grabs the knife. Processes are separate kitchens — truly parallel but hard to share ingredients (data). asyncio is one hyper-efficient cook who never stands idle.",
    },
    explanation:
      "Concurrency in CPython is shaped by the Global Interpreter Lock (GIL): a mutex that permits only one thread to execute Python bytecode at any instant. The practical consequences are precise. For I/O-bound work — network requests, database queries, file reads — a thread releases the GIL while it waits for the operating system, so other threads run during that idle time and you get real concurrency and large wall-clock speedups. For CPU-bound work — tight numeric loops, parsing, data crunching in pure Python — the GIL is essentially never released, so adding threads does not parallelize the computation and may even slow it slightly due to lock contention. This is why the choice of tool matters. The threading module (and the higher-level ThreadPoolExecutor from concurrent.futures) shares one memory space, has low overhead, and is the right choice for I/O-bound fan-out such as calling an API for many documents at once. The multiprocessing module (and ProcessPoolExecutor) instead spawns separate OS processes, each with its own interpreter and GIL, achieving true parallelism for CPU-bound work; the trade-off is that processes do not share memory, so arguments and results must be serialized and shipped across process boundaries (inter-process communication), and process startup costs roughly 50–200ms — meaning multiprocessing only pays off when each task is substantial (rule of thumb: more than about 100ms of CPU work). For extremely large numbers of concurrent I/O operations, asyncio (a single-threaded event loop) is even more efficient than threads. The concurrent.futures API unifies threads and processes: executor.submit(fn, arg) returns a Future immediately (non-blocking) that you can query; executor.map(fn, iterable) blocks and yields results in submission order; and as_completed(futures) yields each future the moment it finishes, letting you process results out of order as soon as they are ready. Because threads share memory, any mutable state written by multiple threads is subject to race conditions, so you protect critical sections with a threading.Lock (used as with lock:). Finally, remember that a Future re-raises the worker's exception when you call future.result(), so you must wrap it in try/except (or inspect future.exception()) or errors will be lost. Note that libraries like NumPy and PyTorch release the GIL inside their C extensions, so threaded code can parallelize their heavy numeric kernels even though pure-Python loops cannot.",
    analogy:
      "Imagine a professional kitchen with one very sharp chef's knife that only one cook may hold at a time — that knife is the GIL. When a cook needs the oven and simply waits for it to finish (an I/O wait), they politely put the knife down so another cook can chop; this is why threads shine for I/O-bound work — everyone stays busy during the waiting. But if the task is pure chopping with no waiting (CPU-bound), the knife never gets put down, so hiring more cooks doesn't help — they just queue for the one knife. To truly cook in parallel you open separate kitchens, each with its own knife (multiprocessing / separate processes); the catch is that ingredients can't be passed through the wall — you must package and courier them between kitchens (serialization and IPC), and opening a kitchen takes time, so it's only worth it for big dishes. asyncio, meanwhile, is one supremely organized cook who starts the pasta boiling and immediately begins the sauce, never standing idle — ideal when there are hundreds of little waiting-heavy tasks.",
    diagram: `<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Threading vs multiprocessing vs asyncio decision">${svgDefs}
      <text x="360" y="24" text-anchor="middle" fill="#e6edf3" font-size="15" font-weight="700">Threading vs Multiprocessing vs asyncio</text>
      ${box(30, 55, 200, 150, "threading", "ThreadPoolExecutor", "#3b82f6")}
      <text x="130" y="120" text-anchor="middle" fill="#22c55e" font-size="10">✓ I/O-bound (API calls)</text>
      <text x="130" y="140" text-anchor="middle" fill="#22c55e" font-size="10">✓ shared memory</text>
      <text x="130" y="160" text-anchor="middle" fill="#f85149" font-size="10">✗ CPU-bound (GIL blocks)</text>
      <text x="130" y="188" text-anchor="middle" fill="#8b949e" font-size="9">workers: threads</text>
      ${box(260, 55, 200, 150, "multiprocessing", "ProcessPoolExecutor", "#22c55e")}
      <text x="360" y="120" text-anchor="middle" fill="#22c55e" font-size="10">✓ CPU-bound (no GIL)</text>
      <text x="360" y="140" text-anchor="middle" fill="#22c55e" font-size="10">✓ true parallelism</text>
      <text x="360" y="160" text-anchor="middle" fill="#f85149" font-size="10">✗ IPC + no shared memory</text>
      <text x="360" y="188" text-anchor="middle" fill="#8b949e" font-size="9">workers: processes</text>
      ${box(490, 55, 200, 150, "asyncio", "event loop", "#8b5cf6")}
      <text x="590" y="120" text-anchor="middle" fill="#22c55e" font-size="10">✓ many concurrent I/O</text>
      <text x="590" y="140" text-anchor="middle" fill="#22c55e" font-size="10">✓ lowest overhead</text>
      <text x="590" y="160" text-anchor="middle" fill="#f85149" font-size="10">✗ CPU-bound blocks loop</text>
      <text x="590" y="188" text-anchor="middle" fill="#8b949e" font-size="9">workers: coroutines</text>
      <text x="360" y="250" text-anchor="middle" fill="#f59e0b" font-size="11" font-weight="700">Rule of thumb: threads for I/O · processes for CPU · asyncio for massive I/O fan-out</text>
      <text x="360" y="280" text-anchor="middle" fill="#8b949e" font-size="10">Guard shared mutable state with threading.Lock to avoid race conditions</text>
    </svg>`,
    diagramLegend: [
      { color: "#3b82f6", label: "threading", description: "Shared memory, low overhead; ideal for I/O-bound fan-out." },
      { color: "#22c55e", label: "multiprocessing", description: "Separate processes bypass the GIL for CPU-bound parallelism." },
      { color: "#8b5cf6", label: "asyncio", description: "Single-thread event loop; best for very high I/O concurrency." },
    ],
    codeExample: {
      language: "python",
      title: "ThreadPoolExecutor for parallel I/O; a Lock for shared state",
      code: `import time
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed

def fetch(doc_id: int) -> dict:
    time.sleep(0.1)                      # simulate network I/O (releases GIL)
    return {"doc_id": doc_id, "ok": True}

lock = threading.Lock()
processed = 0

def worker(doc_id: int) -> dict:
    global processed
    result = fetch(doc_id)
    with lock:                           # guard shared mutable state
        processed += 1
    return result

docs = list(range(20))
start = time.perf_counter()
with ThreadPoolExecutor(max_workers=10) as pool:
    futures = [pool.submit(worker, d) for d in docs]
    results = []
    for fut in as_completed(futures):    # results as they finish
        try:
            results.append(fut.result())  # re-raises worker exceptions
        except Exception as e:
            print("task failed:", e)

print(f"{len(results)} docs in {time.perf_counter() - start:.2f}s (processed={processed})")`,
    },
    codeExamples: [
      {
        language: "python",
        tab: "ThreadPool (I/O)",
        title: "Parallel API calls with ThreadPoolExecutor",
        code: `import time
from concurrent.futures import ThreadPoolExecutor, as_completed

def call_api(doc_id: int, delay: float = 0.1) -> dict:
    time.sleep(delay)                        # network I/O -> GIL released
    return {"doc_id": doc_id, "dim": 1536}

docs = list(range(20))

# Sequential baseline: ~20 * 0.1s = 2.0s
start = time.perf_counter()
_ = [call_api(d) for d in docs[:5]]
print(f"sequential (5): {time.perf_counter() - start:.2f}s")

# Parallel: 10 workers -> ~0.2s for all 20
start = time.perf_counter()
with ThreadPoolExecutor(max_workers=10) as pool:
    futures = {pool.submit(call_api, d): d for d in docs}
    results = []
    for fut in as_completed(futures):
        try:
            results.append(fut.result())
        except Exception as e:               # future re-raises here
            print(f"doc {futures[fut]} failed: {e}")

print(f"parallel (20, 10 workers): {time.perf_counter() - start:.2f}s")
print("processed:", len(results))`,
      },
      {
        language: "python",
        tab: "ProcessPool (CPU)",
        title: "True parallelism for CPU-bound work",
        code: `import time
from concurrent.futures import ProcessPoolExecutor

def heavy(n: int) -> int:
    """CPU-bound: never releases the GIL in pure Python."""
    total = 0
    for i in range(n):
        total += i * i
    return total

def run() -> None:
    tasks = [5_000_000] * 4

    # Sequential
    start = time.perf_counter()
    _ = [heavy(n) for n in tasks]
    print(f"sequential: {time.perf_counter() - start:.2f}s")

    # Parallel across processes (bypasses the GIL)
    start = time.perf_counter()
    with ProcessPoolExecutor(max_workers=4) as pool:
        _ = list(pool.map(heavy, tasks))     # map -> results in order
    print(f"parallel (4 procs): {time.perf_counter() - start:.2f}s")

if __name__ == "__main__":                   # required guard for spawn
    run()`,
      },
      {
        language: "python",
        tab: "Race & Lock",
        title: "Race condition and the Lock that fixes it",
        code: `import threading

counter_unsafe = 0
counter_safe = 0
lock = threading.Lock()

def increment_unsafe(times: int) -> None:
    global counter_unsafe
    for _ in range(times):
        counter_unsafe += 1                  # read-modify-write: NOT atomic

def increment_safe(times: int) -> None:
    global counter_safe
    for _ in range(times):
        with lock:                           # critical section is serialized
            counter_safe += 1

N = 100_000
threads = [threading.Thread(target=increment_unsafe, args=(N,)) for _ in range(4)]
for t in threads: t.start()
for t in threads: t.join()

threads = [threading.Thread(target=increment_safe, args=(N,)) for _ in range(4)]
for t in threads: t.start()
for t in threads: t.join()

print("expected:", 4 * N)
print("unsafe:  ", counter_unsafe, "(often wrong due to race)")
print("safe:    ", counter_safe, "(always correct with Lock)")`,
      },
    ],
    problemStatement:
      "A data pipeline has two stages. Stage 1 fetches 500 documents from a remote API; stage 2 computes an expensive similarity score for each in pure Python. An engineer wrapped both stages in a ThreadPoolExecutor and is confused: stage 1 got ~10x faster but stage 2 barely improved and a shared results counter sometimes ends up lower than expected. Explain, using the GIL, why threading accelerates stage 1 (I/O-bound) but not stage 2 (CPU-bound); recommend the correct executor for each stage; explain the trade-offs of ProcessPoolExecutor (IPC/serialization, startup cost, the __main__ guard); and show how a threading.Lock fixes the miscounting race condition.",
    questions: [
      {
        q: "Because of the GIL, Python threads fail to speed up which kind of work?",
        options: [
          "A. I/O-bound work such as API calls and file reads",
          "B. CPU-bound work such as tight numeric loops in pure Python",
          "C. Network downloads",
          "D. Waiting on database queries",
        ],
        answer: "B",
        explanation:
          "B is correct: the GIL lets only one thread run bytecode at a time and is not released during pure-Python computation, so CPU-bound work does not parallelize with threads. I/O releases the GIL, so I/O-bound work does benefit.",
      },
      {
        q: "Which executor is the right choice for firing off many concurrent API calls?",
        options: [
          "A. ProcessPoolExecutor",
          "B. ThreadPoolExecutor",
          "C. Neither — Python cannot do concurrent I/O",
          "D. A single-threaded loop with time.sleep",
        ],
        answer: "B",
        explanation:
          "B is correct: API calls are I/O-bound and release the GIL while waiting, so ThreadPoolExecutor gives real concurrency with low overhead and shared memory. Processes would add unnecessary IPC/startup cost here.",
      },
      {
        q: "What is a primary disadvantage of ProcessPoolExecutor versus threads for typical workloads?",
        options: [
          "A. Processes cannot run in parallel",
          "B. Inter-process communication and serialization overhead, plus no shared memory and higher startup cost",
          "C. Processes are blocked by the GIL just like threads",
          "D. Processes only work on Windows",
        ],
        answer: "B",
        explanation:
          "B is correct: separate processes each have their own interpreter (bypassing the GIL) but cannot share memory directly, so arguments/results must be serialized and shipped (IPC), and process startup costs 50–200ms — only worthwhile for substantial CPU tasks.",
      },
      {
        q: "What does `as_completed(futures)` yield?",
        options: [
          "A. Futures in the order they were submitted",
          "B. Futures in the order they finish (complete)",
          "C. Only the first future to complete",
          "D. The results directly, never the futures",
        ],
        answer: "B",
        explanation:
          "B is correct: as_completed yields each future the moment it completes, regardless of submission order, so you can process results as soon as they are ready. executor.map, by contrast, returns results in submission order.",
      },
      {
        q: "Multiple threads incrementing a shared integer sometimes lose updates. Why, and what fixes it?",
        options: [
          "A. Python integers are too small; use floats",
          "B. `counter += 1` is a non-atomic read-modify-write, causing a race condition; guard it with a threading.Lock",
          "C. The GIL makes it impossible to fix",
          "D. Use more threads to average it out",
        ],
        answer: "B",
        explanation:
          "B is correct: += is a read-modify-write that can interleave across threads, so updates get lost — a classic race condition. Wrapping the critical section in `with lock:` (threading.Lock) serializes access and makes the count correct.",
      },
      {
        q: "What happens when you call `future.result()` for a task that raised an exception in its worker?",
        options: [
          "A. It returns None and swallows the error",
          "B. It re-raises the worker's exception at the call site",
          "C. It restarts the task",
          "D. It always blocks forever",
        ],
        answer: "B",
        explanation:
          "B is correct: Future.result() re-raises the exception that occurred in the worker, so you must wrap it in try/except (or check future.exception() first) to handle failures instead of losing them.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "be-async-programming",
    title: "asyncio & async/await",
    shortLabel: "asyncio / async-await",
    section: "Advanced Python",
    domain: "Backend",
    tldr:
      "asyncio runs cooperative concurrency on a single-threaded event loop. An `async def` function is a coroutine; `await` pauses it and yields control to the loop until the awaited operation completes, letting other coroutines run. asyncio.run() is the entry point from sync code, asyncio.gather() runs many coroutines concurrently (total time ≈ the longest one), and create_task() schedules background work. Never block the loop — wrap blocking calls in asyncio.to_thread().",
    subtopics: [
      {
        heading: "Core concepts",
        bullets: [
          { icon: "🔄", text: "The **event loop** runs coroutines, switching between them at `await` points — **single thread**, cooperative multitasking." },
          { icon: "⏸️", text: "`async def` defines a **coroutine**; `await expr` **pauses** it and yields control to the loop until `expr` completes." },
          { icon: "📋", text: "A **task** (`asyncio.create_task(coro)`) is a coroutine **scheduled** to run on the loop, possibly in the background." },
        ],
      },
      {
        heading: "Running & combining",
        bullets: [
          { icon: "🚪", text: "`asyncio.run(coro)` is the **entry point** from synchronous code — it creates the loop, runs to completion, and cleans up." },
          { icon: "🎯", text: "`asyncio.gather(*coros)` runs them **concurrently** and returns results **in order**; total time ≈ **max**, not sum." },
          { icon: "⏱️", text: "`asyncio.wait_for(coro, timeout=...)` adds a **timeout**; `return_exceptions=True` in gather returns errors instead of raising." },
        ],
      },
      {
        heading: "Async iteration & pitfalls",
        bullets: [
          { icon: "🌊", text: "`async for` iterates **async generators** (e.g. streaming tokens); `async with` uses **async context managers** (aiohttp, DB pools)." },
          { icon: "🧊", text: "**Never block the loop**: a blocking call (`requests.get`, `time.sleep`) freezes ALL coroutines — use `await asyncio.to_thread(fn, ...)`." },
          { icon: "🐛", text: "Calling a coroutine **without `await`** returns a coroutine object and never runs — a common bug (Python warns about it)." },
        ],
      },
    ],
    keyFacts: [
      { label: "Coroutine keyword", value: "async def", icon: "⏸️" },
      { label: "Entry from sync code", value: "asyncio.run()", icon: "🚪" },
      { label: "gather total time", value: "≈ max, not sum", icon: "🎯" },
      { label: "Blocking call fix", value: "asyncio.to_thread()", icon: "🧊" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'Pause and let other coroutines run' → **await** yields to the event loop.",
        "'Run many I/O coroutines concurrently' → **asyncio.gather** (time ≈ max).",
        "'Start async from sync code' → **asyncio.run()** (RuntimeError if nested).",
        "'Background task without waiting' → **asyncio.create_task()**.",
        "'Blocking call inside async' → wrap in **asyncio.to_thread()**; never freeze the loop.",
      ],
      analogyBrief:
        "asyncio is one hyper-efficient chef: start the pasta boiling (await an API call) and, instead of standing idle, immediately start chopping veg (run another coroutine). Not two things at once — one at a time, but never waiting around.",
    },
    explanation:
      "asyncio provides cooperative concurrency on a single thread by way of an event loop that runs many coroutines and switches between them at their await points. A coroutine is any function defined with async def; calling it does not run it but returns a coroutine object, which must be awaited or scheduled to actually execute. The await keyword is the heart of the model: when a coroutine awaits something (typically an I/O operation like an async HTTP request or asyncio.sleep), it pauses at that point and yields control back to the event loop, which is then free to run other ready coroutines; when the awaited operation completes, the loop resumes the coroutine right where it left off. This is cooperative multitasking — coroutines voluntarily give up control at await points — as opposed to preemptive threads. The entry point from ordinary synchronous code is asyncio.run(coro), which creates a fresh event loop, runs the coroutine to completion, and tears the loop down; calling it while a loop is already running (for example inside another coroutine) raises RuntimeError, so within async code you use await instead. To achieve concurrency you combine coroutines: asyncio.gather(*coros) schedules them all on the loop so they run interleaved, returning their results as a list in the same order the coroutines were passed (not completion order), which means the total wall-clock time is approximately the duration of the longest operation rather than the sum. Passing return_exceptions=True makes gather collect exceptions as results rather than raising on the first failure, and asyncio.wait_for(coro, timeout=...) wraps a coroutine with a timeout. asyncio.create_task(coro) schedules a coroutine to run in the background immediately and returns a Task you can await later or cancel. The async ecosystem also has async iteration: an async generator uses yield inside an async def and is consumed with async for (ideal for streaming, such as tokens from an LLM), and async with drives async context managers like aiohttp sessions or database connection pools. asyncio.Queue enables decoupled producer/consumer pipelines. The two most common mistakes are forgetting to await a coroutine (so it silently never runs — Python emits a warning), and calling blocking code inside a coroutine: a synchronous requests.get or time.sleep does not yield to the loop and therefore freezes every other coroutine, so blocking work must be offloaded with await asyncio.to_thread(blocking_fn, *args). This model is the backbone of modern Python AI backends: FastAPI runs async handlers natively, and the OpenAI and Anthropic SDKs ship async clients.",
    analogy:
      "asyncio is a single, extraordinarily well-organized chef running the whole line alone. When a dish needs to simmer for ten minutes (an API call the chef must wait on), a thread-based kitchen would have that cook stand and stare at the pot. The async chef instead sets a timer, walks away (await yields control), and starts plating a salad or searing another order; the instant the timer dings, they return to the pot exactly where they left off. They are never doing two things in the same instant — it's strictly one action at a time — but they are also never idle, which is why one async chef can juggle hundreds of waiting-heavy orders. The danger is a task with no natural pause: if the chef has to hand-knead dough for five minutes without a break (a blocking, CPU-heavy call), the entire line stalls because they can't step away — the fix is to send that kneading to a back-room helper (asyncio.to_thread) so the front line keeps moving.",
    diagram: `<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Event loop interleaving coroutines at await points">${svgDefs}
      <text x="360" y="24" text-anchor="middle" fill="#e6edf3" font-size="15" font-weight="700">gather(): tasks interleave at await points (single thread)</text>
      <line x1="40" y1="230" x2="680" y2="230" stroke="#8b949e" stroke-width="1"/>
      <text x="40" y="248" fill="#8b949e" font-size="10">t=0</text>
      <text x="330" y="248" fill="#8b949e" font-size="10">t≈0.1s</text>
      <text x="620" y="248" fill="#8b949e" font-size="10">done</text>
      ${box(40, 50, 90, 34, "Task A", "start", "#3b82f6")}
      <rect x="140" y="50" width="380" height="34" rx="8" fill="#161b22" stroke="#8b949e" stroke-dasharray="4"/>
      <text x="330" y="72" text-anchor="middle" fill="#8b949e" font-size="10">awaiting I/O (loop runs others)</text>
      ${box(530, 50, 90, 34, "resume", "done ✓", "#22c55e")}
      ${box(40, 100, 90, 34, "Task B", "start", "#f59e0b")}
      <rect x="140" y="100" width="380" height="34" rx="8" fill="#161b22" stroke="#8b949e" stroke-dasharray="4"/>
      <text x="330" y="122" text-anchor="middle" fill="#8b949e" font-size="10">awaiting I/O...</text>
      ${box(530, 100, 90, 34, "resume", "done ✓", "#22c55e")}
      ${box(40, 150, 90, 34, "Task C", "start", "#8b5cf6")}
      <rect x="140" y="150" width="380" height="34" rx="8" fill="#161b22" stroke="#8b949e" stroke-dasharray="4"/>
      <text x="330" y="172" text-anchor="middle" fill="#8b949e" font-size="10">awaiting I/O...</text>
      ${box(530, 150, 90, 34, "resume", "done ✓", "#22c55e")}
      <text x="360" y="285" text-anchor="middle" fill="#f59e0b" font-size="11" font-weight="700">Total ≈ max(A, B, C), not A + B + C</text>
    </svg>`,
    diagramLegend: [
      { color: "#3b82f6", label: "Coroutine start", description: "async def coroutine begins running on the loop." },
      { color: "#8b949e", label: "await (paused)", description: "Coroutine yields control; the loop runs other ready tasks." },
      { color: "#22c55e", label: "Resume / done", description: "Loop resumes the coroutine when its awaited I/O completes." },
    ],
    codeExample: {
      language: "python",
      title: "gather runs coroutines concurrently (time ≈ max)",
      code: `import asyncio
import time

async def embed(doc_id: int, delay: float = 0.1) -> dict:
    await asyncio.sleep(delay)              # yields to the event loop
    return {"doc_id": doc_id, "dim": 1536}

async def main() -> None:
    # Sequential awaits: 5 * 0.1s = 0.5s
    start = time.perf_counter()
    for i in range(5):
        await embed(i)
    print(f"sequential: {time.perf_counter() - start:.2f}s")

    # Concurrent with gather: ~0.1s for all 10
    start = time.perf_counter()
    results = await asyncio.gather(*(embed(i) for i in range(10)))
    print(f"concurrent: {time.perf_counter() - start:.2f}s ({len(results)} docs)")

asyncio.run(main())                          # entry point from sync code`,
    },
    codeExamples: [
      {
        language: "python",
        tab: "gather & tasks",
        title: "gather, create_task, timeouts, and error handling",
        code: `import asyncio

async def fetch(url: str, delay: float) -> str:
    await asyncio.sleep(delay)
    if url.endswith("bad"):
        raise ConnectionError(f"failed: {url}")
    return f"data from {url}"

async def main() -> None:
    # Concurrent, results IN ORDER; collect errors instead of raising
    results = await asyncio.gather(
        fetch("a", 0.1),
        fetch("b", 0.2),
        fetch("bad", 0.05),
        return_exceptions=True,
    )
    for r in results:
        print("error:" if isinstance(r, Exception) else "ok:", r)

    # Background task via create_task
    task = asyncio.create_task(fetch("bg", 0.1))
    print("did other work while bg task runs...")
    print(await task)                          # await it later

    # Timeout wrapper
    try:
        await asyncio.wait_for(fetch("slow", 1.0), timeout=0.2)
    except asyncio.TimeoutError:
        print("timed out as expected")

asyncio.run(main())`,
      },
      {
        language: "python",
        tab: "async gen / with",
        title: "Async generators and producer/consumer queue",
        code: `import asyncio

# Async generator: 'yield' inside 'async def', consumed with 'async for'
async def stream_tokens(prompt: str):
    for word in f"answer to {prompt}: attention is all you need".split():
        await asyncio.sleep(0.02)              # simulate token latency
        yield word

async def producer(q: asyncio.Queue, items: list) -> None:
    for it in items:
        await q.put(it)
    await q.put(None)                          # sentinel

async def consumer(q: asyncio.Queue, out: list) -> None:
    while True:
        item = await q.get()
        if item is None:
            break
        out.append(f"processed {item}")
        q.task_done()

async def main() -> None:
    async for tok in stream_tokens("what is AI?"):
        print(tok, end=" ", flush=True)
    print()

    q: asyncio.Queue = asyncio.Queue(maxsize=5)
    out: list = []
    await asyncio.gather(
        producer(q, ["d1", "d2", "d3"]),
        consumer(q, out),
    )
    print(out)

asyncio.run(main())`,
      },
      {
        language: "python",
        tab: "Don't block",
        title: "Offload blocking calls with asyncio.to_thread",
        code: `import asyncio
import time

def blocking_hash(data: str) -> int:
    """Synchronous, CPU/IO-blocking work (e.g. a legacy library call)."""
    time.sleep(0.2)                            # blocks the caller
    return sum(map(ord, data))

async def bad(data: str) -> int:
    # WRONG: calling blocking code directly freezes the whole event loop
    return blocking_hash(data)                 # no await -> loop stalls

async def good(data: str) -> int:
    # RIGHT: run the blocking call in a thread so the loop stays responsive
    return await asyncio.to_thread(blocking_hash, data)

async def main() -> None:
    start = time.perf_counter()
    # These run concurrently because to_thread frees the loop
    results = await asyncio.gather(
        good("alpha"), good("beta"), good("gamma"),
    )
    print(results, f"in {time.perf_counter() - start:.2f}s")  # ~0.2s, not 0.6s

asyncio.run(main())`,
      },
    ],
    problemStatement:
      "You are building an async FastAPI endpoint that, for a single request, must call three upstream services concurrently, stream tokens back to the client as they arrive, and enforce a 2-second timeout on a slow dependency. During load testing throughput collapses: a colleague added a synchronous requests.get() and a heavy time.sleep-based retry directly inside an async handler, and another coroutine is 'called' but its result is always a coroutine object, never data. Explain how await and the event loop provide concurrency, how asyncio.gather makes the three calls take ~max instead of the sum, why the blocking calls freeze the loop and how asyncio.to_thread fixes it, and why the missing await is a bug.",
    questions: [
      {
        q: "What does `await` do inside an async function?",
        options: [
          "A. Runs the awaited coroutine synchronously, blocking everything",
          "B. Pauses the current coroutine and yields control to the event loop until the awaited operation completes",
          "C. Spawns a new OS thread",
          "D. Cancels the current coroutine",
        ],
        answer: "B",
        explanation:
          "B is correct: await suspends the current coroutine at that point and hands control back to the event loop, which can run other ready coroutines; when the awaited operation finishes, the coroutine resumes where it paused. This is cooperative multitasking.",
      },
      {
        q: "What is `asyncio.run(coro)` used for?",
        options: [
          "A. To await a coroutine from inside another coroutine",
          "B. As the entry point from synchronous code — it creates the event loop, runs the coroutine to completion, and cleans up",
          "C. To create a background task",
          "D. To convert a function into a coroutine",
        ],
        answer: "B",
        explanation:
          "B is correct: asyncio.run is the sync-to-async entry point. Inside an already-running loop you use await instead — calling asyncio.run there raises RuntimeError.",
      },
      {
        q: "Approximately how long does `await asyncio.gather(a(), b(), c())` take if a/b/c each sleep on I/O?",
        options: [
          "A. The sum of all three durations",
          "B. Approximately the longest single duration (they run concurrently)",
          "C. Three times the average",
          "D. It runs them one at a time",
        ],
        answer: "B",
        explanation:
          "B is correct: gather schedules the coroutines concurrently on the loop, so total wall-clock time is roughly max(individual times), not the sum. Results are returned in the order the coroutines were passed.",
      },
      {
        q: "You need to call a synchronous, blocking function inside a coroutine without freezing the loop. What do you use?",
        options: [
          "A. Just call it directly",
          "B. await asyncio.to_thread(blocking_fn, *args)",
          "C. asyncio.run(blocking_fn)",
          "D. Wrap it in asyncio.gather",
        ],
        answer: "B",
        explanation:
          "B is correct: a direct blocking call stalls the entire event loop. asyncio.to_thread runs the blocking function in a thread pool and returns an awaitable, keeping the loop responsive.",
      },
      {
        q: "What happens if you call a coroutine function but forget to `await` it?",
        options: [
          "A. It runs immediately and returns its result",
          "B. It returns a coroutine object that never runs; the code silently misbehaves (Python warns about it)",
          "C. It raises a SyntaxError",
          "D. It blocks the event loop forever",
        ],
        answer: "B",
        explanation:
          "B is correct: calling a coroutine function just creates a coroutine object; without await (or scheduling it as a task) it never executes. Python emits a 'coroutine was never awaited' warning, but the intended work simply doesn't happen.",
      },
      {
        q: "What is the difference between `asyncio.create_task(coro)` and `await coro`?",
        options: [
          "A. They are identical",
          "B. create_task schedules the coroutine to run in the background and returns a Task; await runs it and waits for the result before continuing",
          "C. create_task blocks; await does not",
          "D. create_task only works outside an event loop",
        ],
        answer: "B",
        explanation:
          "B is correct: create_task schedules the coroutine immediately and returns a Task you can await or cancel later, enabling background/concurrent work; a plain await runs the coroutine and suspends the caller until it finishes.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "be-pydantic",
    title: "Pydantic Validation",
    shortLabel: "Pydantic",
    section: "Advanced Python",
    domain: "Backend",
    tldr:
      "Pydantic (v2) validates and coerces data at runtime from Python type annotations. Subclass BaseModel, annotate fields, and instantiation parses input — compatible types are coerced ('42' → 42), incompatible ones raise a ValidationError with precise messages. Field() adds constraints (ge/le, min_length, pattern), @field_validator and @model_validator run custom checks, models nest and validate recursively, model_dump()/model_json_schema() serialize, and BaseSettings reads config from env vars. It is the backbone of FastAPI.",
    subtopics: [
      {
        heading: "BaseModel & coercion",
        bullets: [
          { icon: "🧱", text: "Subclass **BaseModel** and annotate fields; instantiation **validates and coerces** the input into a type-safe instance." },
          { icon: "🔁", text: "**Coercion**: compatible types are converted (`'42'` → `42`); **incompatible** input raises a **ValidationError** with a clear message." },
          { icon: "🧩", text: "Models **nest** — a field typed as another model (or `list[Model]`) is validated **recursively**." },
        ],
      },
      {
        heading: "Constraints & validators",
        bullets: [
          { icon: "📏", text: "`Field(...)` adds constraints: `ge`/`le`/`gt`/`lt`, `min_length`/`max_length`, `pattern`, `default_factory`, `alias`." },
          { icon: "✅", text: "`@field_validator('name')` validates/transforms a **single** field **after** it is parsed." },
          { icon: "🔗", text: "`@model_validator(mode='before')` sees the **raw input dict** (great for cross-field logic / aliases); `mode='after'` runs once all fields are parsed." },
        ],
      },
      {
        heading: "Serialization & settings",
        bullets: [
          { icon: "📤", text: "`model.model_dump()` → dict, `model.model_dump_json()` → JSON; `Model.model_validate(data)` parses a dict." },
          { icon: "🧾", text: "`Model.model_json_schema()` emits **JSON Schema** — the exact format used for OpenAI/tool function calling." },
          { icon: "⚙️", text: "`BaseSettings` (pydantic-settings) reads config from **environment variables and .env** — the 12-factor pattern for FastAPI." },
        ],
      },
    ],
    keyFacts: [
      { label: "Base class", value: "BaseModel", icon: "🧱" },
      { label: "'42' for int field", value: "Coerced to 42", icon: "🔁" },
      { label: "Range constraint", value: "Field(ge=0, le=1)", icon: "📏" },
      { label: "Config from env", value: "BaseSettings", icon: "⚙️" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'Validate/parse request bodies' → **BaseModel** (backbone of FastAPI).",
        "'\"42\" becomes 42' → Pydantic v2 **coercion** in lax mode.",
        "'Value must be 0..1' → **Field(ge=0, le=1)**.",
        "'Cross-field / raw-input check' → **@model_validator(mode=\"before\")**.",
        "'Config from env vars / .env' → **BaseSettings**; '.model_json_schema()' → tool schemas.",
      ],
      analogyBrief:
        "Pydantic is a strict-but-helpful bouncer at a data nightclub: it enforces the dress code (type annotations), tidies up borderline guests ('42' → 42), and turns away anyone who truly doesn't fit — with a clear reason. Inside, every guest is exactly the shape you expect.",
    },
    explanation:
      "Pydantic is a runtime data-validation library that derives its rules from ordinary Python type annotations, and version 2 (with a Rust core) is the de-facto standard for validating external data in Python backends. You define a schema by subclassing BaseModel and annotating fields; when you instantiate the model (or call Model.model_validate(data)), Pydantic parses and validates the input, producing a fully type-checked instance or raising a ValidationError. A defining behavior is coercion in its default lax mode: values that are compatible with the target type are converted rather than rejected, so passing the string '42' for an int field yields the integer 42, and 'true' can become a bool; only genuinely incompatible input (like 'abc' for an int) raises an error, and the error messages are precise, listing each offending field and the reason. Constraints and metadata are attached with Field(...): numeric bounds (gt, ge, lt, le), string bounds (min_length, max_length, pattern for a regex), default_factory for safe mutable defaults, and alias to map a differently-named incoming key (such as camelCase JSON). For logic that goes beyond simple constraints you add validators: @field_validator('field_name') is a classmethod that runs after a specific field has been parsed and can further validate or transform it, while @model_validator operates on the whole model — mode='before' receives the raw input (as a dict) before field parsing, which is ideal for cross-field rules or preprocessing an entire payload, and mode='after' runs once all fields are parsed and typed, letting you enforce invariants that span multiple fields. Models compose: a field typed as another BaseModel, or as list[SomeModel] or dict[str, SomeModel], is validated recursively, so deeply nested API payloads are checked in one call. Serialization is symmetric: model.model_dump() produces a plain dict, model.model_dump_json() a JSON string (with exclude/include options), and Model.model_json_schema() emits a JSON Schema document — the very format OpenAI and other providers expect for function/tool calling, which is why Pydantic models are commonly passed straight into tool definitions. Two common pitfalls: mutable defaults must use Field(default_factory=list) (Pydantic rejects a bare mutable literal, mirroring the classic Python default-argument bug), and models can be configured as immutable. Finally, pydantic-settings provides BaseSettings, a model that automatically populates its fields from environment variables and .env files (with support for an env_prefix), giving FastAPI applications a clean, validated, 12-factor configuration object. Because FastAPI builds request/response validation and its OpenAPI schema directly on Pydantic, understanding these pieces is essential for production Python web and AI backends.",
    analogy:
      "Pydantic is the bouncer at an exclusive data nightclub, and your type annotations are the dress code posted at the door. Every piece of incoming data must present itself for inspection. The bouncer is strict but pragmatic: if someone shows up in a borderline outfit that can be tidied — a guest wearing the string '42' when the code calls for a number — he quietly adjusts it into a proper integer 42 and waves them through (coercion). But anyone who fundamentally violates the dress code (the string 'abc' where a number is required, or a temperature of 5 when the rule says 0 to 2) is turned away at the door with a specific, itemized explanation of exactly why (a ValidationError). The payoff is that once data is inside the club, you have an ironclad guarantee it is exactly the shape and type you expect — no defensive re-checking, no surprise KeyErrors deep in your business logic. And because the club can print its own dress code as a formal document (model_json_schema), other systems — like an LLM deciding how to call your tools — know precisely what to send.",
    diagram: `<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pydantic validation pipeline">${svgDefs}
      <text x="360" y="24" text-anchor="middle" fill="#e6edf3" font-size="15" font-weight="700">Pydantic validation pipeline</text>
      ${box(30, 70, 130, 60, "Raw input", "dict / JSON / str", "#8b949e")}
      ${box(200, 70, 130, 60, "Coerce", "'42' → 42", "#3b82f6")}
      ${box(370, 70, 130, 60, "Validate", "constraints + validators", "#22c55e")}
      ${box(555, 55, 135, 46, "Model instance", "✓ type-safe", "#8b5cf6")}
      ${box(555, 135, 135, 46, "ValidationError", "clear messages", "#f85149")}
      <line x1="160" y1="100" x2="198" y2="100" stroke="#8b949e" stroke-width="1.5" marker-end="url(#arrow-mute)"/>
      <line x1="330" y1="100" x2="368" y2="100" stroke="#8b949e" stroke-width="1.5" marker-end="url(#arrow-mute)"/>
      <line x1="500" y1="90" x2="553" y2="80" stroke="#22c55e" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="500" y1="112" x2="553" y2="150" stroke="#f85149" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="360" y="235" text-anchor="middle" fill="#8b949e" font-size="10">Field(ge=0, le=1) · @field_validator · @model_validator(mode="before"/"after") · nested models validate recursively</text>
      <text x="360" y="268" text-anchor="middle" fill="#8b949e" font-size="10">model_dump() → dict · model_json_schema() → tool schema · BaseSettings → env vars / .env</text>
    </svg>`,
    diagramLegend: [
      { color: "#3b82f6", label: "Coerce", description: "Compatible types converted in lax mode ('42' → 42)." },
      { color: "#22c55e", label: "Validate", description: "Field constraints and custom validators applied." },
      { color: "#f85149", label: "ValidationError", description: "Raised with per-field messages when input is invalid." },
    ],
    codeExample: {
      language: "python",
      title: "BaseModel with constraints, coercion, and a validator",
      code: `from pydantic import BaseModel, Field, field_validator
from typing import Literal

class Message(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str = Field(min_length=1, max_length=32768)

class LLMRequest(BaseModel):
    model: str = Field(default="gpt-4", pattern=r"^(gpt|claude|gemini).*")
    messages: list[Message]                        # nested, validated recursively
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)

    @field_validator("messages")
    @classmethod
    def not_empty(cls, v: list) -> list:
        if not v:
            raise ValueError("messages cannot be empty")
        return v

# Coercion: temperature="0.5" (str) becomes 0.5 (float)
req = LLMRequest(
    messages=[{"role": "user", "content": "hi"}],
    temperature="0.5",
)
print(req.temperature, type(req.temperature).__name__)   # 0.5 float

# Invalid input -> ValidationError with precise messages
try:
    LLMRequest(messages=[], temperature=5.0)
except Exception as e:
    print(type(e).__name__)                              # ValidationError`,
    },
    codeExamples: [
      {
        language: "python",
        tab: "Model & validators",
        title: "Field constraints, field_validator, model_validator",
        code: `from pydantic import BaseModel, Field, field_validator, model_validator
from typing import Literal

class Message(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str = Field(min_length=1)

class LLMRequest(BaseModel):
    model: str = Field(default="gpt-4", pattern=r"^(gpt|claude|gemini).*")
    messages: list[Message]
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)
    max_tokens: int = Field(default=1024, gt=0, le=128000)

    @field_validator("messages")               # runs on the parsed field
    @classmethod
    def messages_not_empty(cls, v: list) -> list:
        if not v:
            raise ValueError("messages list cannot be empty")
        return v

    @model_validator(mode="after")             # cross-field, after parsing
    def first_not_assistant(self) -> "LLMRequest":
        if self.messages and self.messages[0].role == "assistant":
            raise ValueError("first message cannot be from assistant")
        return self

req = LLMRequest(
    messages=[
        {"role": "system", "content": "You are helpful."},
        {"role": "user", "content": "Explain embeddings."},
    ],
    temperature=0.9,
)
print(req.model_dump())

try:
    LLMRequest(messages=[], temperature=5.0)   # empty + out-of-range
except Exception as e:
    print(f"{type(e).__name__}: {e.error_count()} errors")`,
      },
      {
        language: "python",
        tab: "Serialize & schema",
        title: "model_dump, model_validate, and JSON Schema",
        code: `from pydantic import BaseModel, Field

class Address(BaseModel):
    city: str
    zip: str = Field(pattern=r"^\\d{5}$")

class User(BaseModel):
    id: int
    name: str = Field(min_length=1)
    address: Address                           # nested model
    tags: list[str] = Field(default_factory=list)  # safe mutable default

# Parse from a dict (nested dict is validated recursively)
u = User.model_validate({
    "id": "7",                                  # coerced str -> int
    "name": "Kumar",
    "address": {"city": "Bangalore", "zip": "56001"},
})

print(u.id, type(u.id).__name__)                # 7 int
print(u.model_dump())                            # -> nested dict
print(u.model_dump_json(exclude={"tags"}))       # -> JSON string

# JSON Schema (this is what OpenAI function-calling expects)
schema = User.model_json_schema()
print("top-level fields:", list(schema["properties"].keys()))`,
      },
      {
        language: "python",
        tab: "Settings",
        title: "pydantic-settings: config from env / .env",
        code: `from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="APP_",               # reads APP_DATABASE_URL, etc.
        case_sensitive=False,
        extra="ignore",                  # ignore unknown env vars
    )

    openai_api_key: str = Field(default="", description="OpenAI key")
    database_url: str = Field(default="sqlite:///./app.db")
    debug: bool = False                  # 'APP_DEBUG=true' -> True (coerced)
    max_workers: int = Field(default=4, ge=1, le=32)
    allowed_models: list[str] = Field(default=["gpt-4", "gpt-3.5-turbo"])

# The FastAPI pattern: one validated settings singleton
settings = Settings()

print("debug:", settings.debug)
print("max_workers:", settings.max_workers)
print("models:", settings.allowed_models)
print("api key set:", bool(settings.openai_api_key))`,
      },
    ],
    problemStatement:
      "Your FastAPI service accepts LLM requests as JSON from untrusted clients and currently trusts the raw dict, causing crashes deep in business logic when temperature is out of range, messages is empty, the model name is bogus, or a nested address is malformed. You also load secrets and tuning knobs from scattered os.getenv calls with manual int/bool parsing. Redesign this with Pydantic v2: model the request with nested models and Field constraints, add a @field_validator and a @model_validator for cross-field rules, rely on coercion for query params, expose model_json_schema() so the payload can drive tool calling, and replace the ad-hoc env parsing with a BaseSettings object. Explain coercion vs validation, and why default_factory is needed for the list field.",
    questions: [
      {
        q: "What does Pydantic v2 do when you pass the string `'42'` to an `int` field?",
        options: [
          "A. Raises a ValidationError immediately",
          "B. Stores it as the string '42'",
          "C. Coerces it to the integer 42 (lax-mode coercion)",
          "D. Raises a TypeError",
        ],
        answer: "C",
        explanation:
          "C is correct: in its default lax mode Pydantic coerces compatible types, so '42' becomes the integer 42. Only genuinely incompatible input (e.g. 'abc') for an int field raises a ValidationError.",
      },
      {
        q: "What does `Field(ge=0, le=1)` enforce on a field?",
        options: [
          "A. The value must be exactly 0 or 1",
          "B. The value must be greater than or equal to 0 and less than or equal to 1",
          "C. The field becomes optional",
          "D. The field must be a string of length 0 to 1",
        ],
        answer: "B",
        explanation:
          "B is correct: ge means 'greater than or equal' and le means 'less than or equal', so the value must lie in the inclusive range [0, 1]. Anything outside raises a ValidationError.",
      },
      {
        q: "When should you use `@model_validator(mode='before')` instead of `@field_validator`?",
        options: [
          "A. They are identical",
          "B. Use model_validator(mode='before') to inspect/transform the raw input (whole dict) before field parsing — e.g. cross-field logic or aliases; field_validator runs on a single already-parsed field",
          "C. field_validator is only for required fields",
          "D. model_validator cannot access other fields",
        ],
        answer: "B",
        explanation:
          "B is correct: @field_validator runs after a specific field is parsed/coerced. @model_validator(mode='before') receives the raw input before field parsing (good for preprocessing or cross-field rules); mode='after' runs once all fields are parsed.",
      },
      {
        q: "How do you correctly declare a Pydantic field with a mutable default like an empty list?",
        options: [
          "A. tags: list[str] = []",
          "B. tags: list[str] = Field(default_factory=list)",
          "C. tags: list[str] = None",
          "D. tags: list[str] = list",
        ],
        answer: "B",
        explanation:
          "B is correct: Field(default_factory=list) gives each instance its own fresh list, avoiding the shared-mutable-default bug. Pydantic v2 rejects a bare mutable literal as a direct default.",
      },
      {
        q: "What does `Model.model_json_schema()` produce, and why is it useful?",
        options: [
          "A. A pickled binary blob for storage",
          "B. A JSON Schema describing the model — the format OpenAI/tool function calling expects",
          "C. A serialized instance of the model",
          "D. The model's source code",
        ],
        answer: "B",
        explanation:
          "B is correct: model_json_schema() emits a JSON Schema document describing the model's fields and constraints. This is exactly the structure LLM providers consume for function/tool calling, so a Pydantic model can define a tool's parameters directly.",
      },
      {
        q: "What is the purpose of `BaseSettings` from pydantic-settings?",
        options: [
          "A. To speed up model validation",
          "B. To read and validate configuration automatically from environment variables and .env files",
          "C. To make models immutable",
          "D. To generate database migrations",
        ],
        answer: "B",
        explanation:
          "B is correct: BaseSettings is a model that auto-populates its fields from environment variables and .env files (with support for an env_prefix), giving a validated, typed, 12-factor configuration object — the standard pattern in FastAPI apps.",
      },
    ],
  },
];
