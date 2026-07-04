// ============================================================
// SECTION: Python Foundations — Environment Setup, Syntax & Types,
// Collections, Control Flow, Functions, and Comprehensions & Generators.
// Backend interview fundamentals authored to the messaging.ts /
// frontend-core.ts bar.
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

export const backendPyFoundationsTopics: Topic[] = [
  // -----------------------------------------------------------------
  {
    id: "be-env-setup",
    title: "Environment Setup — venv, pip & pyproject",
    shortLabel: "Env Setup",
    section: "Python Foundations",
    domain: "Backend",
    tldr:
      "Every production Python project starts with an isolated environment. `venv` gives each project its own interpreter and packages so torch 2.0 in one project never collides with torch 2.1 in another. `pip` installs from PyPI; `pip freeze > requirements.txt` snapshots exact versions for reproducibility. `pyproject.toml` (PEP 517/518) is the modern metadata/dependency file; PEP 8 + Black + Ruff handle style; `.env` + python-dotenv keep secrets out of git.",
    subtopics: [
      {
        heading: "Isolation with venv",
        bullets: [
          { icon: "📦", text: "**`python -m venv .venv`** creates an isolated env with its **own interpreter copy and pip**, separate from system Python." },
          { icon: "🔌", text: "**Activate** before installing: `source .venv/bin/activate` (Mac/Linux) or `.venv\\Scripts\\activate` (Windows); the prompt shows a **`(.venv)`** prefix." },
          { icon: "🚪", text: "**`deactivate`** exits the env. Add `.venv/` and `.env` to **`.gitignore`** — never commit them." },
        ],
      },
      {
        heading: "pip & reproducibility",
        bullets: [
          { icon: "⬇️", text: "**`pip install fastapi uvicorn`** pulls from PyPI; **`pip install -e .`** installs your own project in editable mode." },
          { icon: "🧊", text: "**`pip freeze > requirements.txt`** snapshots exact versions; **`pip install -r requirements.txt`** reproduces them." },
          { icon: "📌", text: "In production **pin exact versions** (`fastapi==0.111.0`), not ranges (`>=0.100`) — unpinned deps break silently on upgrades." },
        ],
      },
      {
        heading: "pyproject, PEP 8 & tooling",
        bullets: [
          { icon: "🧰", text: "**`pyproject.toml`** (PEP 517/518) declares metadata + deps; read by `pip`, `uv`, `poetry`, `hatch`." },
          { icon: "🎨", text: "**PEP 8**: 4-space indent, `snake_case` funcs/vars, `PascalCase` classes, `UPPER_CASE` constants. Let **Black** format and **Ruff** lint." },
          { icon: "🔐", text: "**`.env` + python-dotenv** keep API keys out of source: `from dotenv import load_dotenv; load_dotenv()`." },
        ],
      },
    ],
    keyFacts: [
      { label: "Create env", value: "python -m venv .venv", icon: "📦" },
      { label: "Snapshot deps", value: "pip freeze > requirements.txt", icon: "🧊" },
      { label: "Modern metadata", value: "pyproject.toml (PEP 517/518)", icon: "🧰" },
      { label: "Format / lint", value: "Black + Ruff", icon: "🎨" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'Two projects need different package versions' → **one venv per project**.",
        "'Reproduce the exact environment' → **pip freeze / requirements.txt with pinned versions**.",
        "'Modern replacement for setup.py' → **pyproject.toml**.",
        "'Keep API keys out of git' → **.env + python-dotenv** (git-ignored).",
        "'Auto-enforce style' → **Black** (format) + **Ruff** (lint), not manual PEP 8.",
      ],
      analogyBrief:
        "A virtual environment is a separate apartment per project: each has its own furniture (packages) and rules (versions), so one tenant on torch 2.0 never fights the neighbor on torch 2.1.",
    },
    explanation:
      "The goal of Python environment setup is a reproducible, isolated development environment for every project, because Python packages have deep dependency trees that conflict — transformers 4.40 may require tokenizers>=0.19 while another project pins tokenizers==0.15. Python's built-in venv module creates an isolated environment: `python -m venv .venv` produces a directory with its own copy of the interpreter and its own pip, completely separate from the system Python. You must activate the environment before installing anything (source .venv/bin/activate on Mac/Linux, .venv\\Scripts\\activate on Windows), after which the shell prompt shows a (.venv) prefix and any `python` or `pip` command resolves to the venv's isolated copy; `deactivate` exits. pip installs packages from PyPI, and the key reproducibility workflow is `pip freeze > requirements.txt` to snapshot every installed package with its exact version, so a teammate running `pip install -r requirements.txt` gets an identical environment — critical in ML work where a minor numpy or transformers change alters numerical output. Always pin exact versions in production (fastapi==0.111.0) rather than ranges, because maintainers ship breaking changes and an unpinned dep silently upgrades. pyproject.toml is the modern, PEP 517/518 standard for declaring project metadata, dependencies, and tool config, and it is read by pip, uv, poetry, and hatch, replacing the older setup.py/setup.cfg; `pip install -e '.[dev]'` installs the project plus an optional dependency group in editable mode. For style, PEP 8 mandates 4-space indentation (never tabs), snake_case for functions and variables, PascalCase for classes, and UPPER_CASE for constants, but you should not enforce it by hand: Black is an opinionated auto-formatter and Ruff is a Rust-based linter 10–100x faster than flake8 that also replaces isort and pyupgrade. Finally, never hardcode secrets — store them in a git-ignored .env file and load them with python-dotenv's load_dotenv(), reading values via os.getenv.",
    analogy:
      "A virtual environment is like giving every project its own apartment inside one building. The building is your system Python; each apartment (venv) has its own furniture (installed packages) and house rules (specific versions). The tenant running torch 2.0 never has to fight the neighbor running torch 2.1, because they never share a room. requirements.txt is the moving-in checklist: freeze it once and anyone can furnish an identical apartment in minutes. pyproject.toml is the lease that declares what the apartment officially needs, and .env is the locked drawer where you keep the keys (secrets) so they never end up taped to the front door (committed to git).",
    diagram: `<svg viewBox="0 0 720 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Python project layout with venv isolation">${svgDefs}
      ${box(20, 90, 130, 55, "System Python", "the building", "#8b949e")}
      ${box(220, 30, 180, 50, "project-a/.venv", "torch 2.0", "#3b82f6")}
      ${box(220, 150, 180, 50, "project-b/.venv", "torch 2.1", "#22c55e")}
      <line x1="150" y1="105" x2="218" y2="60" stroke="#8b949e" stroke-width="1.5" marker-end="url(#arrow-mute)"/>
      <line x1="150" y1="120" x2="218" y2="170" stroke="#8b949e" stroke-width="1.5" marker-end="url(#arrow-mute)"/>
      ${box(470, 30, 230, 50, "requirements.txt", "pip freeze → pinned deps", "#f59e0b")}
      ${box(470, 95, 230, 45, "pyproject.toml", "PEP 517/518 metadata", "#8b5cf6")}
      ${box(470, 155, 230, 45, ".env (git-ignored)", "secrets via python-dotenv", "#f85149")}
      <line x1="400" y1="55" x2="468" y2="55" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
      <text x="435" y="235" fill="#8b949e" font-size="10">Isolated envs + pinned deps = "works on every machine"</text>
    </svg>`,
    diagramLegend: [
      { color: "#3b82f6", label: "project-a venv", description: "Isolated interpreter + packages (torch 2.0)." },
      { color: "#f59e0b", label: "requirements.txt", description: "Frozen, pinned versions for reproducibility." },
      { color: "#f85149", label: ".env", description: "Git-ignored secrets loaded with python-dotenv." },
    ],
    codeExample: {
      language: "python",
      title: "Load secrets from .env with python-dotenv",
      code: `# .env (create this file, add to .gitignore, never commit):
#   OPENAI_API_KEY=sk-proj-abc123
#   DB_URL=postgresql://localhost/mydb
#   DEBUG=true

import os
from dotenv import load_dotenv

load_dotenv()  # reads .env into os.environ

api_key = os.getenv("OPENAI_API_KEY")
db_url = os.getenv("DB_URL")
debug = os.getenv("DEBUG", "false").lower() == "true"

print(f"API key loaded: {'yes' if api_key else 'NO - check .env'}")
print(f"Debug mode: {debug}")
# In production, real env vars are injected by the platform — no .env file.`,
    },
    codeExamples: [
      {
        language: "bash",
        tab: "venv workflow",
        title: "Create, activate, install, freeze",
        code: `# Create the virtual environment
python -m venv .venv

# Activate (Mac/Linux)
source .venv/bin/activate
# Activate (Windows)
# .venv\\Scripts\\activate

which pip                          # -> .venv/bin/pip (confirms isolation)
pip install fastapi uvicorn python-dotenv
pip freeze > requirements.txt      # snapshot exact versions
pip install -r requirements.txt    # reproduce elsewhere
deactivate                         # exit the env`,
      },
      {
        language: "toml",
        tab: "pyproject.toml",
        title: "Modern project metadata (PEP 517/518)",
        code: `[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[project]
name = "my-ai-app"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
    "fastapi>=0.111.0",
    "pydantic>=2.7.0",
    "python-dotenv>=1.0.1",
]

[project.optional-dependencies]
dev = ["pytest", "black", "ruff"]

[tool.black]
line-length = 88

[tool.ruff]
line-length = 88
select = ["E", "F", "I"]
# then:  pip install -e ".[dev]"`,
      },
      {
        language: "python",
        tab: "PEP 8",
        title: "Good vs bad style (what Ruff flags)",
        code: `# BAD (PEP 8 violations)
import sys, os                  # multiple imports on one line
class myClass:                  # should be PascalCase
    MAX_RETRY=3                 # missing spaces around =
    def DoSomething(self,x,y):  # should be snake_case
        if x==None: return      # use 'is None'
        Result=x+y              # should be snake_case
        return Result

# GOOD (PEP 8 compliant)
import os
import sys

class MyClass:                  # PascalCase
    MAX_RETRY = 3               # UPPER_CASE constant

    def do_something(self, x: int, y: int) -> int | None:  # snake_case
        if x is None:           # identity check for None
            return None
        result = x + y
        return result`,
      },
    ],
    problemStatement:
      "You clone a teammate's Python service and it crashes at import time with a version mismatch, while their laptop runs it fine. Later, a reviewer notices an OpenAI API key was committed in a config file. Design the setup that guarantees the project runs identically on every machine and keeps secrets out of git — naming the exact commands and files you would use for isolation, dependency reproducibility, and secret handling.",
    questions: [
      {
        q: "What does `source .venv/bin/activate` do?",
        options: [
          "A. Creates a new virtual environment",
          "B. Activates the venv so its Python and pip are used for the current shell session",
          "C. Installs all packages listed in requirements.txt",
          "D. Deletes the current virtual environment",
        ],
        answer: "B",
        explanation:
          "B is correct: activation prepends the venv to PATH so `python`/`pip` resolve to the venv's isolated interpreter (prompt shows the (.venv) prefix). Creation is `python -m venv`; installing is `pip install`; there is no packages installed merely by activating.",
      },
      {
        q: "Which naming convention does PEP 8 require for Python class names?",
        options: ["A. snake_case", "B. camelCase", "C. PascalCase", "D. UPPER_CASE"],
        answer: "C",
        explanation:
          "C is correct: PEP 8 mandates PascalCase (CapWords) for classes, e.g. TokenizerConfig. Functions/variables use snake_case; module-level constants use UPPER_CASE.",
      },
      {
        q: "What is the purpose of `pip freeze > requirements.txt`?",
        options: [
          "A. Upgrades all installed packages to their latest versions",
          "B. Records the exact installed package versions for reproducibility",
          "C. Creates a new virtual environment",
          "D. Removes packages that are no longer imported",
        ],
        answer: "B",
        explanation:
          "B is correct: `pip freeze` prints every installed package with its exact version (e.g. torch==2.1.0); redirecting to requirements.txt snapshots the environment so `pip install -r` reproduces it exactly.",
      },
      {
        q: "Two projects need torch==2.0 and torch==2.1 respectively. What is the correct approach?",
        options: [
          "A. Install both versions globally and switch by editing sys.path",
          "B. Use a separate virtual environment per project",
          "C. Uninstall and reinstall torch each time you switch projects",
          "D. Pin only one version and hope the APIs are compatible",
        ],
        answer: "B",
        explanation:
          "B is correct: each project gets its own .venv with its own torch. A global install can hold only one version of a package, and sys.path hacks/reinstalling are fragile and error-prone.",
      },
      {
        q: "In pyproject.toml, how do `dependencies` differ from `optional-dependencies`?",
        options: [
          "A. There is no functional difference",
          "B. `dependencies` install with `pip install .`; an optional group installs only with `pip install '.[group]'`",
          "C. `optional-dependencies` are installed automatically in production",
          "D. `dependencies` require Python 3.10 or newer",
        ],
        answer: "B",
        explanation:
          "B is correct: core `dependencies` are always installed, while `[project.optional-dependencies]` groups (e.g. dev) require explicit activation like `pip install -e '.[dev]'`, keeping test/lint tools out of production installs.",
      },
      {
        q: "Why commit pinned versions (`fastapi==0.111.0`) rather than ranges (`fastapi>=0.100`)?",
        options: [
          "A. pip refuses to install version ranges",
          "B. To prevent silent breakage when a package later releases a newer, incompatible version",
          "C. Exact pins make installation measurably faster",
          "D. Ranges are only valid inside pyproject.toml",
        ],
        answer: "B",
        explanation:
          "B is correct: a range like >=0.100 may install a future 0.115 with a changed API that silently breaks your code. Exact pins guarantee identical environments across dev, CI, and prod; you then update deliberately (e.g. via dependabot).",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "be-python-syntax",
    title: "Python Syntax & Data Types",
    shortLabel: "Syntax & Types",
    section: "Python Foundations",
    domain: "Backend",
    tldr:
      "Python is dynamically typed but strongly typed — values carry a type enforced at runtime. Ints are arbitrary precision (no overflow); floats are IEEE 754 so `0.1 + 0.2 != 0.3`; strings are immutable Unicode sequences whose methods return new strings; `bool` is a subclass of `int` (True == 1). Use `is None`, never `== None`. Type hints aid static tools and power Pydantic/FastAPI but aren't enforced at runtime.",
    subtopics: [
      {
        heading: "Numbers & strings",
        bullets: [
          { icon: "🔢", text: "**`int`** has arbitrary precision (`2 ** 100` just works); **`float`** is IEEE 754 double, so `0.1 + 0.2 == 0.30000000000000004` — compare with `math.isclose`." },
          { icon: "➗", text: "**`/`** is true division (3.5), **`//`** is floor division (3), **`%`** is modulo; `divmod(7,2)` returns `(3,1)`." },
          { icon: "🧵", text: "**Strings are immutable** Unicode sequences; methods like `.strip()` return **new** strings — you must reassign. Prefer **f-strings**: `f\"score={s:.2%}\"`." },
        ],
      },
      {
        heading: "Booleans, None & truthiness",
        bullets: [
          { icon: "💡", text: "**`bool` is a subclass of `int`**: `True == 1`, `False == 0`, so `True + True == 2`." },
          { icon: "🕳️", text: "**Falsy**: `None`, `False`, `0`, `0.0`, `\"\"`, `[]`, `{}`, `set()`, `()`; everything else is truthy — enables `if not items:` and `name or \"Anonymous\"`." },
          { icon: "🎯", text: "Always use **`is None`** / `is not None`, never `== None` (PEP 8 E711; a custom `__eq__` can lie)." },
        ],
      },
      {
        heading: "Type hints & identity",
        bullets: [
          { icon: "🏷️", text: "**Type hints** aren't enforced at runtime — they drive Pylance/mypy and are required by **Pydantic/FastAPI**; modern union syntax is `str | None` (3.10+)." },
          { icon: "🪞", text: "**`==`** compares value; **`is`** compares identity (same object). Use `is` for `None`/`True`/`False`." },
          { icon: "🎲", text: "CPython **interns** small ints (−5..256) and short strings, so `is` can surprise you — never rely on it for value comparison." },
        ],
      },
    ],
    keyFacts: [
      { label: "int precision", value: "Arbitrary (no overflow)", icon: "🔢" },
      { label: "float", value: "IEEE 754 — 0.1+0.2 != 0.3", icon: "➗" },
      { label: "str", value: "Immutable Unicode sequence", icon: "🧵" },
      { label: "bool", value: "Subclass of int (True==1)", icon: "💡" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'0.1 + 0.2 == 0.3?' → **False** (IEEE 754); use `math.isclose`.",
        "'Check for None' → **`is None`**, never `== None` (E711).",
        "'Modify a string in place?' → **can't** — strings are immutable, reassign the result.",
        "'True + True' → **2** (`bool` subclasses `int`).",
        "'Are type hints enforced?' → **No** at runtime; they aid tools and Pydantic/FastAPI.",
      ],
      analogyBrief:
        "Types are containers with rules: int is an unlimited lockbox, float a jar of approximate decimals, str an immutable bead necklace, and bool a light switch that's secretly an int.",
    },
    explanation:
      "Python is dynamically typed but not weakly typed: variables have no declared type, but every value carries a type that Python enforces at runtime (None + 1 raises TypeError rather than silently coercing). The numeric types matter: int has arbitrary precision so 2 ** 100 works with no overflow (unlike C or Java), while float is an IEEE 754 double and therefore subject to binary-representation imprecision, which is why 0.1 + 0.2 evaluates to 0.30000000000000004 and 0.1 + 0.2 == 0.3 is False — you should compare floats with math.isclose or abs(a - b) < 1e-9, or use the decimal module for exact financial arithmetic. Division has three forms: / is true division (7 / 2 == 3.5), // is floor division (7 // 2 == 3), and % is modulo. Strings are immutable sequences of Unicode characters: single, double, and triple quotes are equivalent, f-strings (3.6+) are the modern interpolation method and support format specs like {score:.2%}, and because strings are immutable every method such as .strip() or .upper() returns a new string rather than mutating in place, so you must reassign the result. Booleans are a subclass of int, meaning True == 1 and False == 0 and True + True == 2; Python's truthiness rules make empty containers, None, 0, and 0.0 falsy and everything else truthy, enabling idioms like `if not items:` and the fallback pattern `display = name or 'Anonymous'`. None is Python's null value and should always be tested with `is None` / `is not None`, never `== None`, both because it is a PEP 8 style rule (E711) and because a custom __eq__ could make == None misbehave. Type hints, available with modern union syntax like `str | None` (3.10+) and `list[str]` (3.9+), are not enforced at runtime — Python stays dynamic — but they power static analysis with Pylance/mypy and are required by Pydantic and FastAPI for validation. Finally, == checks value equality while `is` checks identity (the same object in memory); CPython interns small integers (−5 to 256) and short strings so `is` may unexpectedly return True for them, but this is an implementation detail you must never rely on — only None, True, and False are guaranteed singletons.",
    analogy:
      "Python's types are containers with rules. An int is a lockbox for whole numbers with unlimited capacity — you can never overflow it. A float is a jar that holds approximate decimals, so pouring 0.1 and 0.2 in doesn't give you exactly 0.3, just very close. A string is an immutable bead necklace: you can read any bead by position, but you can't swap one out in place — to 'change' it you thread a whole new necklace (which is why .strip() returns a new string). A bool is a light switch, but it's secretly a special kind of int, so flipping two switches on and adding them gives you 2. And `is` asks 'is this the very same object?' while `==` asks 'do these hold equal values?' — for None you always ask `is`.",
    diagram: `<svg viewBox="0 0 720 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Python built-in type hierarchy">${svgDefs}
      ${box(300, 20, 120, 40, "object", "root type", "#8b949e")}
      ${box(60, 100, 120, 40, "int", "arbitrary precision", "#22c55e")}
      ${box(300, 100, 120, 40, "float", "IEEE 754", "#f59e0b")}
      ${box(540, 100, 120, 40, "str", "immutable Unicode", "#8b5cf6")}
      ${box(60, 185, 120, 40, "bool", "True==1 / False==0", "#3b82f6")}
      ${box(300, 185, 130, 40, "NoneType", "None (use is)", "#f85149")}
      <line x1="360" y1="60" x2="120" y2="98" stroke="#8b949e" stroke-width="1.3" marker-end="url(#arrow-mute)"/>
      <line x1="360" y1="60" x2="360" y2="98" stroke="#8b949e" stroke-width="1.3" marker-end="url(#arrow-mute)"/>
      <line x1="360" y1="60" x2="600" y2="98" stroke="#8b949e" stroke-width="1.3" marker-end="url(#arrow-mute)"/>
      <line x1="120" y1="140" x2="120" y2="183" stroke="#3b82f6" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="180" y="163" fill="#8b949e" font-size="10">bool inherits int</text>
      <text x="30" y="245" fill="#8b949e" font-size="10">0.1 + 0.2 = 0.30000000000000004 · use math.isclose · 'is None' not '== None'</text>
    </svg>`,
    diagramLegend: [
      { color: "#22c55e", label: "int", description: "Arbitrary precision — no overflow." },
      { color: "#f59e0b", label: "float", description: "IEEE 754 double; compare with math.isclose." },
      { color: "#3b82f6", label: "bool", description: "Subclass of int: True==1, False==0." },
    ],
    codeExample: {
      language: "python",
      title: "Numbers, strings, truthiness & identity",
      code: `# int is arbitrary precision; float is IEEE 754
print(2 ** 100)               # huge int, no overflow
print(0.1 + 0.2 == 0.3)       # False!
import math
print(math.isclose(0.1 + 0.2, 0.3))   # True — correct way

# strings are immutable: methods return NEW strings
s = "  Hello World  "
print(s.strip().lower())      # 'hello world'
print(s)                      # unchanged: '  Hello World  '

# bool is an int; truthiness powers idioms
print(True + True)            # 2
items = []
print("empty!" if not items else items)   # 'empty!'
name = ""
print(name or "Anonymous")    # 'Anonymous'

# identity vs equality; always 'is None'
a, b = [1, 2], [1, 2]
print(a == b, a is b)         # True False
x = None
print(x is None)              # correct`,
    },
    codeExamples: [
      {
        language: "python",
        tab: "Numbers",
        title: "int precision, float gotchas, division",
        code: `print(2 ** 100)                       # arbitrary precision int
print(type(2 ** 100))                 # <class 'int'>

print(0.1 + 0.2)                      # 0.30000000000000004
print(0.1 + 0.2 == 0.3)               # False
print(abs(0.1 + 0.2 - 0.3) < 1e-9)    # True

print(7 / 2)                          # 3.5  true division
print(7 // 2)                         # 3    floor division
print(7 % 2)                          # 1    modulo
print(divmod(7, 2))                   # (3, 1)

print(f"{15000000000:,.0f}")          # 15,000,000,000`,
      },
      {
        language: "python",
        tab: "Strings",
        title: "f-strings, methods, immutability",
        code: `name, score = "Kumar", 0.9742

print(f"Hello, {name}!")
print(f"Score: {score:.2%}")          # 97.42%
print(f"{1000000:,}")                 # 1,000,000

# immutable: methods return new strings
s = "  hello world  "
print(s.strip().title())              # 'Hello World'
print(s)                              # unchanged

# join beats repeated concatenation
print(" ".join(["the", "quick", "fox"]))
print("-" * 20)                       # separator line`,
      },
      {
        language: "python",
        tab: "Type hints",
        title: "Modern hints (3.10+) — not enforced at runtime",
        code: `def greet(name: str, title: str | None = None) -> str:
    if title:
        return f"Hello, {title} {name}"
    return f"Hello, {name}"

def summarize(tokens: list[str]) -> dict[str, int]:
    return {t: len(t) for t in tokens}

print(greet("Kumar", "Dr."))
print(summarize(["hi", "world"]))

# Hints are NOT enforced at runtime — Python stays dynamic:
print(greet("A") if True else None)
result = (lambda a, b: a + b)("oops", "wrong")  # runs fine
print(result)                          # 'oopswrong'`,
      },
    ],
    problemStatement:
      "A billing service intermittently reports that a customer's balance 'doesn't add up' — a unit test asserting `0.1 + 0.2 == 0.3` fails, and a `if user.discount == None:` check behaves oddly for a custom User object. A junior engineer also expects `s.strip()` to clean a field in place but the original value keeps reappearing. Explain the three root causes (float representation, None comparison, string immutability) and the correct Python idiom for each.",
    questions: [
      {
        q: "What does `0.1 + 0.2 == 0.3` evaluate to in Python?",
        options: ["A. True", "B. False", "C. TypeError", "D. 0.3"],
        answer: "B",
        explanation:
          "B is correct: floats are IEEE 754 doubles, so 0.1 and 0.2 aren't exact in binary and their sum is 0.30000000000000004. Compare with math.isclose(a, b) or abs(a - b) < epsilon.",
      },
      {
        q: "Which of these values is TRUTHY in Python?",
        options: ["A. 0", 'B. ""', "C. []", 'D. "0"'],
        answer: "D",
        explanation:
          'D is correct: "0" is a non-empty string and therefore truthy. Falsy values include 0, 0.0, "", [], {}, set(), (), None, and False — a non-empty string is always truthy regardless of its contents.',
      },
      {
        q: "What is the correct, idiomatic way to check whether `x` is None?",
        options: ["A. if x == None:", "B. if x === None:", "C. if x is None:", "D. if not x:"],
        answer: "C",
        explanation:
          "C is correct: `is None` checks identity and is unambiguous. `== None` works but violates PEP 8 (E711) and can be fooled by a custom __eq__; `not x` is wrong because it also catches 0, [], {}, and \"\" — not just None. (=== is not valid Python.)",
      },
      {
        q: "Why must you reassign the result of `s.strip()`?",
        options: [
          "A. strip() is deprecated and prints a warning",
          "B. Strings are immutable, so methods return a new string and never modify the original",
          "C. strip() only works on the first call",
          "D. strip() mutates the string but returns None",
        ],
        answer: "B",
        explanation:
          "B is correct: Python strings are immutable, so .strip()/.upper()/etc. return a new string and leave the original unchanged. Always write `s = s.strip()`, not just `s.strip()`.",
      },
      {
        q: "What is the relationship between `bool` and `int` in Python?",
        options: [
          "A. They are unrelated types",
          "B. int is a subclass of bool",
          "C. bool is a subclass of int, so True == 1 and False == 0",
          "D. bool is an alias for str",
        ],
        answer: "C",
        explanation:
          "C is correct: bool subclasses int (MRO is bool → int → object), so True has value 1 and False has value 0, and True + True == 2.",
      },
      {
        q: "What best describes Python type hints at runtime?",
        options: [
          "A. Python raises TypeError when an argument violates a hint",
          "B. Hints are ignored at runtime; they drive static tools (mypy/Pylance) and are used by Pydantic/FastAPI for validation",
          "C. Hints make the code run faster",
          "D. Hints convert values to the annotated type automatically",
        ],
        answer: "B",
        explanation:
          "B is correct: hints aren't enforced by the interpreter (`add('a','b')` still runs), but they enable static analysis and are consumed by Pydantic/FastAPI to validate at their boundaries. They don't coerce or speed up execution.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "be-collections",
    title: "Collections — list, dict, set & tuple",
    shortLabel: "Collections",
    section: "Python Foundations",
    domain: "Backend",
    tldr:
      "Four core containers: `list` (ordered, mutable, O(n) search), `tuple` (ordered, immutable, hashable → usable as dict keys), `set` (unordered, unique, O(1) membership), and `dict` (key→value, insertion-ordered since 3.7, O(1) average get/set). The `collections` module adds `Counter` (auto-counting dict), `defaultdict` (no KeyError), and `deque` (O(1) append/pop at both ends).",
    subtopics: [
      {
        heading: "list & tuple",
        bullets: [
          { icon: "📜", text: "**`list`** — ordered, mutable, dynamic array: `append`/`pop()` at the **end are O(1)**; `insert(0)`/`pop(0)` at the **front are O(n)** (use `deque` instead)." },
          { icon: "📦", text: "**`tuple`** — ordered, **immutable**, hashable → valid **dict keys** and set members; used for multiple return values and named records (`namedtuple`)." },
          { icon: "🔎", text: "Membership in a list is **O(n)**; in a set/dict it's **O(1)** — pick the container for the access pattern." },
        ],
      },
      {
        heading: "set & dict",
        bullets: [
          { icon: "🎒", text: "**`set`** — unordered, **unique** elements backed by a hash table; O(1) membership; elements must be **hashable** (no lists/dicts inside)." },
          { icon: "🗂️", text: "**`dict`** — key→value hash map, **insertion-ordered since 3.7**, O(1) average get/set; safe access with `d.get(k, default)` and `d.setdefault(k, v)`." },
          { icon: "⚠️", text: "Don't mutate a dict/set **while iterating** it — iterate over `list(d)` or collect keys first, then delete." },
        ],
      },
      {
        heading: "collections module",
        bullets: [
          { icon: "🧮", text: "**`Counter`** — counts hashable items, defaults missing keys to 0, `.most_common(n)`; great for token/word frequencies." },
          { icon: "🏗️", text: "**`defaultdict`** — auto-creates missing values (`defaultdict(list)`, `defaultdict(int)`), removing KeyError guard code." },
          { icon: "↔️", text: "**`deque`** — double-ended queue with **O(1)** `appendleft`/`popleft`; use for queues and `maxlen` sliding windows." },
        ],
      },
    ],
    keyFacts: [
      { label: "list", value: "Ordered, mutable, O(n) search", icon: "📜" },
      { label: "tuple", value: "Immutable, hashable (dict key)", icon: "📦" },
      { label: "set", value: "Unique, O(1) membership", icon: "🎒" },
      { label: "dict", value: "Insertion-ordered (3.7+), O(1)", icon: "🗂️" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'Fast membership test' → **set/dict (O(1))**, not list (O(n)).",
        "'Use it as a dict key' → must be **hashable** → **tuple**, not list.",
        "'Count frequencies' → **`collections.Counter`** + `.most_common()`.",
        "'Dict of lists without KeyError' → **`defaultdict(list)`**.",
        "'O(1) at both ends / sliding window' → **`deque`**, never `list.insert(0)`/`pop(0)`.",
      ],
      analogyBrief:
        "A list is a numbered shelf, a tuple a sealed box, a set a bag with a bouncer rejecting duplicates, and a dict a filing cabinet with labeled folders you reach by label, not position.",
    },
    explanation:
      "Python's four core collection types plus the collections module form the backbone of nearly all Python programs. A list is an ordered, mutable sequence backed by a dynamic array: appending to or popping from the end is O(1) amortized, but inserting or removing at the front is O(n) because everything shifts, so for efficient queue operations you use collections.deque. A tuple is an ordered, immutable sequence — essentially an immutable list — and because it is immutable it is hashable, which makes tuples valid dictionary keys and set members (lists cannot be, since they are unhashable); tuples are also used for multiple return values and, via namedtuple/NamedTuple, for lightweight named records. A set is an unordered collection of unique elements backed by a hash table, giving O(1) membership testing (much faster than a list's O(n) scan), with the constraint that all elements must be hashable, so you cannot put lists, dicts, or sets inside a set. A dict is a key-value mapping backed by a hash table with O(1) average get and set, and since Python 3.7 dictionaries maintain insertion order as a language guarantee; you access values safely with d.get(key, default) (no KeyError) and d.setdefault(key, value) to insert only if absent. A common bug is mutating a dict or set while iterating over it — instead iterate over a copy such as list(d.keys()) or collect the keys to remove first and delete afterward. The collections module provides specialized variants used daily in data work: Counter is a dict subclass that counts hashable objects and returns 0 (not KeyError) for missing keys, supports Counter arithmetic, and offers .most_common(n) for the top items; defaultdict takes a factory (list, int, set) and auto-creates missing keys, eliminating existence-check boilerplate when building a dict of lists or a counter; and deque is a double-ended queue offering O(1) appendleft and popleft (and an optional maxlen that auto-evicts the oldest element, ideal for sliding windows), which is why you should never use list.insert(0, x) or list.pop(0) in hot loops.",
    analogy:
      "Think of the containers by how you store and fetch things. A list is a numbered shelf: items sit in order and you grab them by position, and you can add or remove them. A tuple is a sealed box with the same order but permanently closed — which is exactly why it's trustworthy enough to be a label (dict key). A set is a bag with a bouncer at the mouth who refuses any duplicate and can instantly tell you whether something's inside (O(1)). A dict is a filing cabinet of labeled folders: you find a folder by its label (key), not by counting drawers. The collections module hands you upgraded versions: Counter is a folder that tallies itself, defaultdict is a cabinet that silently creates an empty folder the moment you reach for a missing label, and deque is a shelf you can load and unload from both ends without shuffling everything.",
    diagram: `<svg viewBox="0 0 720 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Collection types compared">${svgDefs}
      <text x="120" y="30" text-anchor="middle" fill="#8b949e" font-size="11">ordered? mutable? dup? lookup</text>
      ${box(40, 45, 150, 45, "list", "ordered · mutable · O(n)", "#3b82f6")}
      ${box(210, 45, 150, 45, "tuple", "ordered · immutable · O(n)", "#8b5cf6")}
      ${box(40, 105, 150, 45, "set", "unordered · unique · O(1)", "#f59e0b")}
      ${box(210, 105, 150, 45, "dict", "3.7+ order · O(1) keys", "#22c55e")}
      <rect x="400" y="45" width="300" height="150" rx="10" fill="#1a2332" stroke="#e11d8f" stroke-dasharray="5 4"/>
      <text x="415" y="66" fill="#e11d8f" font-size="11" font-weight="700">collections module</text>
      ${box(415, 78, 270, 34, "Counter", "auto-count · most_common(n)", "#e11d8f")}
      ${box(415, 118, 270, 34, "defaultdict", "auto-create missing keys", "#e11d8f")}
      ${box(415, 158, 270, 34, "deque", "O(1) both ends · maxlen", "#e11d8f")}
      <text x="30" y="230" fill="#8b949e" font-size="10">Pick set/dict for O(1) membership; tuple for hashable keys; deque for queues.</text>
    </svg>`,
    diagramLegend: [
      { color: "#3b82f6", label: "list", description: "Ordered, mutable; O(1) at end, O(n) at front." },
      { color: "#8b5cf6", label: "tuple", description: "Immutable, hashable — valid dict keys." },
      { color: "#e11d8f", label: "collections", description: "Counter, defaultdict, deque specializations." },
    ],
    codeExample: {
      language: "python",
      title: "Choosing the right collection",
      code: `# list: ordered, mutable — end ops are O(1)
tokens = ["hello", "world"]
tokens.append("!")            # O(1)

# tuple: immutable & hashable -> valid dict key
point_scores = {(0, 0): 1.0, (1, 2): 0.5}
print(point_scores[(1, 2)])   # 0.5

# set: O(1) membership + dedup
seen = set(["a", "b", "a"])   # {'a', 'b'}
print("a" in seen)            # O(1) True

# dict: insertion-ordered, safe access
vocab = {"hello": 0, "world": 1}
print(vocab.get("missing", -1))          # -1, no KeyError
vocab.setdefault("new", len(vocab))      # inserts only if absent
print(vocab)`,
    },
    codeExamples: [
      {
        language: "python",
        tab: "Counter",
        title: "Frequency analysis",
        code: `from collections import Counter

tokens = ["the", "cat", "sat", "the", "cat", "the"]
freq = Counter(tokens)

print(freq.most_common(2))    # [('the', 3), ('cat', 2)]
print(freq["the"])            # 3
print(freq["missing"])        # 0 — no KeyError

# Counter arithmetic
more = Counter(["cat", "roof"])
combined = freq + more
print(combined["cat"])        # 3`,
      },
      {
        language: "python",
        tab: "defaultdict",
        title: "Grouping without KeyError",
        code: `from collections import defaultdict

words = ["apple", "ant", "banana", "avocado", "cherry"]

# group by first letter — no existence checks needed
by_letter = defaultdict(list)
for w in words:
    by_letter[w[0]].append(w)   # auto-creates []
print(dict(by_letter))

# count with defaultdict(int)
lengths = defaultdict(int)
for w in words:
    lengths[len(w)] += 1        # no guard needed
print(dict(lengths))`,
      },
      {
        language: "python",
        tab: "deque",
        title: "Queue & sliding window (O(1) ends)",
        code: `from collections import deque

# sliding window of size 3 — auto-evicts oldest
words = ["The", "cat", "sat", "on", "the", "mat"]
window = deque(maxlen=3)
for w in words:
    window.append(w)
    if len(window) == 3:
        print(list(window))

# FIFO queue — O(1) at both ends
q = deque(["task1", "task2"])
q.appendleft("urgent")        # O(1) at front
print(q.popleft())            # 'urgent'  O(1)`,
      },
    ],
    problemStatement:
      "A text-processing job is slow: it checks whether each incoming token is in a 50,000-word stop-list stored as a Python list, builds a 'documents grouped by author' mapping with repeated `if key not in d` guards, and maintains a rolling window of the last 100 tokens using `list.insert(0, ...)` and `list.pop()`. It also tries to use `[x, y]` coordinate pairs as dictionary keys and crashes. Identify the right container for each of these four needs and the Big-O improvement each brings.",
    questions: [
      {
        q: "You need O(1) membership testing against a large collection of unique items. Which type?",
        options: ["A. list", "B. tuple", "C. set", "D. A sorted list with a linear scan"],
        answer: "C",
        explanation:
          "C is correct: a set is backed by a hash table, so `x in s` is O(1) on average. Membership in a list or tuple is O(n). (A sorted list still scans O(n) unless you use bisect for O(log n).)",
      },
      {
        q: "Why can a tuple be used as a dictionary key but a list cannot?",
        options: [
          "A. Tuples are faster to compare",
          "B. Tuples are immutable and therefore hashable; lists are mutable and unhashable",
          "C. Lists take too much memory",
          "D. Dict keys must be numbers",
        ],
        answer: "B",
        explanation:
          "B is correct: dict keys and set members must be hashable, and hashability requires immutability. Tuples are immutable (hashable); lists are mutable, so they raise TypeError when used as a key.",
      },
      {
        q: "Since which Python version do regular dicts guarantee insertion order?",
        options: ["A. Python 2.7", "B. Python 3.5", "C. Python 3.7", "D. They never guarantee order"],
        answer: "C",
        explanation:
          "C is correct: insertion order became a language guarantee in Python 3.7 (it was a CPython implementation detail in 3.6). This is why OrderedDict is now rarely needed.",
      },
      {
        q: "Which `collections` type is best for a dict-of-lists you build incrementally without KeyError guards?",
        options: ["A. Counter", "B. defaultdict(list)", "C. deque", "D. namedtuple"],
        answer: "B",
        explanation:
          "B is correct: `defaultdict(list)` auto-creates an empty list the first time a key is accessed, so `d[k].append(v)` never raises KeyError. Counter counts, deque is a queue, namedtuple is an immutable record.",
      },
      {
        q: "You need O(1) insertion and removal at BOTH ends (e.g. a sliding window). What should you use?",
        options: [
          "A. list with insert(0) and pop(0)",
          "B. collections.deque",
          "C. set",
          "D. tuple",
        ],
        answer: "B",
        explanation:
          "B is correct: deque provides O(1) appendleft/popleft (and append/pop), plus an optional maxlen that auto-evicts. list.insert(0)/pop(0) are O(n) because elements shift.",
      },
      {
        q: "What does `Counter(['a','b','a'])['missing']` return?",
        options: ["A. Raises KeyError", "B. None", "C. 0", "D. -1"],
        answer: "C",
        explanation:
          "C is correct: Counter is a dict subclass that returns 0 for a missing key instead of raising KeyError, which is what makes it convenient for frequency counting.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "be-control-flow",
    title: "Control Flow — Loops & Pythonic Patterns",
    shortLabel: "Control Flow",
    section: "Python Foundations",
    domain: "Backend",
    tldr:
      "Python control flow is conventional (if/elif/else, for, while) but shines through Pythonic patterns: `enumerate(items, start=1)` instead of `range(len())`, `zip(a, b)` for parallel iteration (stops at the shortest), `for...else` where `else` runs only if no `break` fired, the walrus operator `:=` to assign-and-test in one expression, and `match`/`case` structural pattern matching (3.10+).",
    subtopics: [
      {
        heading: "Branching",
        bullets: [
          { icon: "🍴", text: "**`if / elif / else`** — no parentheses, indentation defines blocks; Python has no `switch`, use `elif` chains." },
          { icon: "🧩", text: "**`match` / `case`** (3.10+) — structural pattern matching over shapes: literals, guards (`case s if s >= 90:`), dict/sequence patterns, `_` wildcard." },
        ],
      },
      {
        heading: "Iteration patterns",
        bullets: [
          { icon: "🔢", text: "**`enumerate(items, start=0)`** gives index + value — replaces `for i in range(len(items))`." },
          { icon: "🤝", text: "**`zip(a, b)`** iterates in parallel and **stops at the shortest**; `itertools.zip_longest(fillvalue=...)` pads instead." },
          { icon: "🔁", text: "**`reversed(items)`** and **`sorted(items, key=fn)`** give backward and key-sorted iteration over any iterable." },
        ],
      },
      {
        heading: "break, continue, else & walrus",
        bullets: [
          { icon: "🛑", text: "**`break`** exits immediately; **`continue`** skips to the next iteration." },
          { icon: "✅", text: "**`for...else`** — the `else` runs **only if the loop completed without a `break`**; replaces the manual 'found' flag." },
          { icon: "🦭", text: "**Walrus `:=`** (3.8+) assigns and tests in one expression: `while chunk := f.read(8192):` — ideal for streams/polling." },
        ],
      },
    ],
    keyFacts: [
      { label: "Index + value", value: "enumerate(items, start=0)", icon: "🔢" },
      { label: "Parallel iterate", value: "zip (stops at shortest)", icon: "🤝" },
      { label: "for...else", value: "else runs if no break", icon: "✅" },
      { label: "Walrus :=", value: "Assign + test (3.8+)", icon: "🦭" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'Need index AND value' → **enumerate**, not `range(len())`.",
        "'Iterate two lists together' → **zip** (stops at the shortest).",
        "'Run code only if loop found nothing' → **for...else**.",
        "'Assign inside a while/comprehension condition' → **walrus `:=`**.",
        "'Match on the shape of data' → **`match`/`case`** (3.10+), Python's switch replacement.",
      ],
      analogyBrief:
        "Loops are conveyor belts; enumerate stamps a ticket number on each item; zip runs two belts in sync; break is the emergency stop; for-else asks 'did the belt finish without me stopping it?'",
    },
    explanation:
      "Python's control flow is conventional in shape — if/elif/else for branching, for and while for looping — but it distinguishes fluent Python from transliterated C or Java through its idioms. Branches need no parentheses and rely on indentation; because Python has no switch statement you chain elif clauses, or, from Python 3.10, use match/case structural pattern matching, which can match literal values, apply guards (case s if s >= 90:), and destructure dict and sequence shapes with a `_` wildcard as the catch-all. For iteration, a Python for loop consumes any iterable, and the key patterns are enumerate(items, start=0), which yields (index, value) pairs and replaces the un-Pythonic for i in range(len(items)); zip(a, b, ...), which iterates several sequences in parallel and stops at the shortest, silently discarding the extra tail of longer sequences (use itertools.zip_longest with a fillvalue to pad instead); reversed(items) for backward iteration; and sorted(items, key=fn) for sorted iteration. while loops are for when you don't know the iteration count in advance, such as polling, retry logic, or reading a stream. Inside loops, break exits immediately and continue skips to the next iteration, while the distinctive for...else construct runs its else block only if the loop completed without hitting a break — this is Python's built-in 'search succeeded or failed' pattern and cleanly replaces the manual found = False sentinel. The walrus operator := (Python 3.8+) assigns a value and yields it as part of an expression, which is most valuable in while conditions like `while chunk := f.read(8192):` (assign the chunk and test its truthiness in one line, stopping at EOF when read returns empty bytes) and in comprehensions where you want to compute a value once and both test and reuse it. A frequent pitfall to avoid is modifying a dict while iterating over it; iterate over a copy such as list(d.keys()) or collect the keys to delete first.",
    analogy:
      "Picture your data on a conveyor belt. An if statement is a fork in the belt — this chute or that one. A for loop is the belt itself, carrying each item past you in turn. enumerate is a machine that stamps a ticket number onto every item as it passes, so you always know both the position and the contents. zip runs two belts alongside each other in lockstep, and when the shorter belt runs out, both stop. break is the big red emergency stop, and for...else is you asking at the end, 'did the belt run all the way to the end without me hitting stop?' — the else fires only if nothing made you break early. The walrus operator is grabbing an item off the belt and inspecting it in the same motion, which is exactly what `while chunk := stream.read():` does until the belt is empty.",
    diagram: `<svg viewBox="0 0 720 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="for-else search pattern">${svgDefs}
      <rect x="20" y="20" width="330" height="90" rx="10" fill="#1a2332" stroke="#f59e0b" stroke-dasharray="5 4"/>
      <text x="35" y="42" fill="#f59e0b" font-size="11" font-weight="700">for item in collection:</text>
      <text x="50" y="62" fill="#e6edf3" font-size="11">if condition(item):</text>
      <text x="65" y="80" fill="#f85149" font-size="11">break   -> found</text>
      <text x="35" y="100" fill="#22c55e" font-size="11">else:  # runs ONLY if no break</text>
      ${box(390, 30, 140, 45, "break hit", "else skipped", "#f85149")}
      ${box(390, 95, 140, 45, "no break", "else runs", "#22c55e")}
      <line x1="350" y1="60" x2="388" y2="52" stroke="#f85149" stroke-width="1.5" marker-end="url(#arrow)"/>
      <line x1="350" y1="90" x2="388" y2="117" stroke="#22c55e" stroke-width="1.5" marker-end="url(#arrow)"/>
      ${box(560, 30, 140, 45, "while x := read()", "assign + test", "#3b82f6")}
      ${box(560, 95, 140, 45, "enumerate / zip", "index · parallel", "#8b5cf6")}
      <text x="30" y="160" fill="#8b949e" font-size="10">for-else replaces the 'found = False' flag; walrus := reads streams until EOF.</text>
    </svg>`,
    diagramLegend: [
      { color: "#f85149", label: "break path", description: "Item found; the else block is skipped." },
      { color: "#22c55e", label: "no-break path", description: "Loop finished normally; else executes." },
      { color: "#3b82f6", label: "walrus :=", description: "Assign and test in one expression (streams)." },
    ],
    codeExample: {
      language: "python",
      title: "enumerate, zip, for-else & walrus",
      code: `tokens = ["the", "quick", "brown", "fox"]

# enumerate: index + value (start optional)
for i, tok in enumerate(tokens, start=1):
    print(f"{i}: {tok}")

# zip: parallel iteration (stops at shortest)
ids = [10, 20, 30]
for tok, id_ in zip(tokens, ids):
    print(tok, id_)

# for-else: 'not found' logic
target = "cat"
for tok in tokens:
    if tok == target:
        print("found", tok)
        break
else:
    print(f"{target!r} not found")

# walrus := reads a stream until EOF
import io
stream = io.BytesIO(b"abcdefghij")
while chunk := stream.read(4):
    print(len(chunk))   # 4, 4, 2`,
    },
    codeExamples: [
      {
        language: "python",
        tab: "enumerate/zip",
        title: "Replace range(len()) and iterate in parallel",
        code: `tokens = ["the", "quick", "brown"]

# un-Pythonic:
for i in range(len(tokens)):
    print(i, tokens[i])

# Pythonic:
for i, tok in enumerate(tokens):
    print(i, tok)

# zip stops at the shortest
words = ["hello", "world"]
scores = [0.9, 0.8, 0.7]          # extra 0.7 dropped
for w, s in zip(words, scores):
    print(f"{w}={s}")

# pad instead of truncating
from itertools import zip_longest
for w, s in zip_longest(words, scores, fillvalue=None):
    print(w, s)`,
      },
      {
        language: "python",
        tab: "for-else",
        title: "Search with a clean sentinel",
        code: `tokens = ["the", "cat", "sat", "on", "the", "mat"]
stop_words = {"the", "a", "an", "on", "in"}

# for-else: else runs only if no break
for tok in tokens:
    if tok in stop_words:
        print(f"stop word: {tok!r}")
        break
else:
    print("no stop words found")

# equivalent verbose version (avoid):
found = False
for tok in tokens:
    if tok in stop_words:
        found = True
        break
if not found:
    print("no stop words found")`,
      },
      {
        language: "python",
        tab: "walrus/match",
        title: "Walrus := and match/case (3.10+)",
        code: `# walrus in a comprehension: compute once, test + reuse
nums = [1, 4, 9, 16, 25]
roots = [r for n in nums if (r := n ** 0.5) == int(r)]
print(roots)                       # [1.0, 2.0, 3.0, 4.0, 5.0]

# match/case: Python's structural pattern matching
def handle(cmd: dict) -> str:
    match cmd:
        case {"action": "search", "query": str(q)}:
            return f"searching: {q}"
        case {"action": "embed", "text": str(t)}:
            return f"embedding: {t}"
        case _:
            return f"unknown: {cmd}"

print(handle({"action": "search", "query": "python"}))
print(handle({"action": "delete"}))`,
      },
    ],
    problemStatement:
      "A log-processing loop prints line numbers using `for i in range(len(lines))` and indexes `lines[i]`, tracks a `found` boolean to detect whether a target line exists, and reads a large file with a `read()` call duplicated before and inside a while loop. It also needs to iterate over parallel lists of timestamps and messages. Rewrite each part with the idiomatic Python construct (enumerate, for-else, walrus, zip) and explain what `zip` does when the two lists differ in length.",
    questions: [
      {
        q: "What does the `else` clause of a `for` loop execute?",
        options: [
          "A. When the loop body raises an exception",
          "B. When the loop finishes without hitting a `break`",
          "C. When the loop runs at least once",
          "D. Always, immediately after the loop",
        ],
        answer: "B",
        explanation:
          "B is correct: the for-else `else` runs only if the loop completed normally (no break). If `break` fires, `else` is skipped — Python's built-in 'search succeeded/failed' pattern.",
      },
      {
        q: "What does `enumerate(['a','b','c'], start=1)` yield?",
        options: [
          "A. (0,'a'), (1,'b'), (2,'c')",
          "B. (1,'a'), (2,'b'), (3,'c')",
          "C. 'a', 'b', 'c'",
          "D. (1,0,'a'), (2,1,'b'), (3,2,'c')",
        ],
        answer: "B",
        explanation:
          "B is correct: `start=1` makes the first index 1, giving (1,'a'), (2,'b'), (3,'c'). The default start is 0.",
      },
      {
        q: "What does `while chunk := f.read(8192):` do?",
        options: [
          "A. It's a syntax error — walrus can't be used in a while condition",
          "B. Reads up to 8192 bytes into `chunk` and loops while `chunk` is truthy (stops at EOF)",
          "C. Reads the whole file at once",
          "D. Reads exactly 8192 bytes and stops",
        ],
        answer: "B",
        explanation:
          "B is correct: the walrus operator assigns `f.read(8192)` to `chunk` and uses it as the loop condition; at EOF read() returns empty bytes (falsy) and the loop ends. It replaces the read-before-and-inside pattern.",
      },
      {
        q: "What happens when you `zip` two lists of different lengths, e.g. `zip([1,2], [3,4,5])`?",
        options: [
          "A. It raises a ValueError",
          "B. It stops at the shortest, yielding (1,3), (2,4) — the 5 is dropped",
          "C. It pads the shorter list with None",
          "D. It repeats the shorter list",
        ],
        answer: "B",
        explanation:
          "B is correct: `zip` stops at the shortest input, silently discarding the extra items. Use `itertools.zip_longest(fillvalue=...)` if you want padding instead.",
      },
      {
        q: "Given `for i, x in enumerate(zip([1,2],[3,4,5]))`, what are i and x on the FIRST iteration?",
        options: ["A. i=0, x=(1,3)", "B. i=1, x=(1,3)", "C. i=0, x=1", "D. TypeError"],
        answer: "A",
        explanation:
          "A is correct: `zip` yields (1,3), (2,4) (stops at shortest), and `enumerate` wraps it so the first item is (0, (1,3)) → i=0, x=(1,3). The 5 is never reached.",
      },
      {
        q: "Since Python 3.10, which construct provides structural pattern matching (a switch-like feature)?",
        options: ["A. switch/case", "B. match/case", "C. select/when", "D. cond/else"],
        answer: "B",
        explanation:
          "B is correct: `match`/`case` (PEP 634, Python 3.10+) matches literals, guards, and destructures dict/sequence shapes, with `case _:` as the wildcard. Python has no `switch` keyword.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "be-functions",
    title: "Functions — args, kwargs & Closures",
    shortLabel: "Functions",
    section: "Python Foundations",
    domain: "Backend",
    tldr:
      "Functions are Python's unit of reuse. `*args` collects extra positional args into a tuple; `**kwargs` collects extra keyword args into a dict; the same `*`/`**` unpack a list/dict into a call. Default arguments are evaluated once at definition, so a mutable default (`def f(x=[])`) is the classic shared-state bug — use `None` as a sentinel. Closures capture outer variables by reference; `functools.partial` pre-fills args and `lru_cache` memoizes.",
    subtopics: [
      {
        heading: "Arguments",
        bullets: [
          { icon: "📥", text: "Signature order: **positional → `*args` → keyword-only → `**kwargs`**; call with positional or keyword arguments." },
          { icon: "⭐", text: "**`*args`** collects extra positional args into a **tuple**; **`**kwargs`** collects extra keyword args into a **dict**." },
          { icon: "📤", text: "The same `*`/`**` **unpack** in a call: `f(*my_list, **my_dict)` spreads a list/dict into arguments." },
        ],
      },
      {
        heading: "The mutable default bug",
        bullets: [
          { icon: "🐛", text: "**Default args are evaluated once** at definition — a mutable default (`def f(x=[])`) is **shared across all calls** and accumulates state." },
          { icon: "🩹", text: "**Fix with a `None` sentinel**: `def f(x=None): x = [] if x is None else x` creates a fresh object each call." },
        ],
      },
      {
        heading: "Closures, lambda & functools",
        bullets: [
          { icon: "🎒", text: "A **closure** is an inner function that captures enclosing variables **by reference**; each outer call makes an independent closure." },
          { icon: "λ", text: "**`lambda`** is a single-expression anonymous function — good for `key=`/`filter` predicates; use `def` for anything with a body." },
          { icon: "🧰", text: "**`functools.partial`** pre-fills arguments; **`lru_cache`** memoizes pure functions; **`wraps`** preserves metadata in decorators." },
        ],
      },
    ],
    keyFacts: [
      { label: "*args", value: "Extra positional → tuple", icon: "⭐" },
      { label: "**kwargs", value: "Extra keyword → dict", icon: "🗂️" },
      { label: "Default gotcha", value: "Never mutable; use None", icon: "🐛" },
      { label: "Closure capture", value: "By reference, not value", icon: "🎒" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'Accept any number of positional args' → **`*args`** (tuple); keyword args → **`**kwargs`** (dict).",
        "'Spread a list/dict into a call' → **`f(*list, **dict)`** unpacking.",
        "'Function accumulates state across calls' → **mutable default bug**; use a **None sentinel**.",
        "'Pre-fill some arguments' → **`functools.partial`**; 'cache results' → **`lru_cache`**.",
        "Closures capture by **reference** — the loop-lambda trap: bind with `i=i`.",
      ],
      analogyBrief:
        "A function is a recipe: *args is 'add as many extra ingredients as you like (a list)', **kwargs is 'set any named options (a dict)', and a closure is a recipe that remembers what was in the kitchen where it was written.",
    },
    explanation:
      "Functions are Python's fundamental unit of reuse and abstraction. Parameters can be positional, keyword, or have defaults, and the signature order is positional parameters, then *args, then keyword-only parameters, then **kwargs. *args collects any extra positional arguments into a tuple (immutable, so you cannot .append to it directly), while **kwargs collects extra keyword arguments into a dict; the very same * and ** operators work in reverse at the call site to unpack a sequence or mapping into arguments, so f(*my_list, **my_dict) spreads them out. The single most famous Python gotcha is the mutable default argument: default values are evaluated exactly once, when the def statement executes, not on each call, so writing def append_to(item, lst=[]) creates one list that is shared across every call that relies on the default, causing state to silently accumulate; the fix is to use None as a sentinel and create the object inside the body — def append_to(item, lst=None): if lst is None: lst = []. A closure is an inner function that captures variables from its enclosing scope, and crucially it captures them by reference rather than by value, so the captured variables persist for as long as the inner function lives and later mutations are visible; each call to the enclosing function produces a fresh, independent closure, which is why a make_multiplier(2) and make_multiplier(3) keep separate factors. This by-reference capture is also behind the classic loop trap where lambdas created in a loop all see the loop variable's final value — you force per-iteration capture with a default argument like lambda i=i: i*i. Lambdas are single-expression anonymous functions suited to sort keys, filter predicates, and short callbacks; for anything with a real body you should use def. Finally, the functools module provides everyday utilities: partial pre-fills some of a function's arguments and returns a new callable (partial(print, end='') behaves like print(..., end='')), lru_cache(maxsize=128) memoizes a pure function so repeated calls with the same arguments return instantly and exposes cache_info(), and wraps is used inside decorators to preserve the wrapped function's name and docstring.",
    analogy:
      "A function is a recipe. Its required parameters are the ingredients you must supply; *args is the instruction 'toss in as many extra items as you like — I'll gather them into one bag (a tuple)'; and **kwargs is 'set any named options you want from the pantry — I'll note them on a labeled list (a dict).' Unpacking with * and ** is the reverse: emptying a pre-packed bag or option list straight into the recipe. The mutable-default bug is like a recipe that says 'start with the mixing bowl' but reuses the *same dirty bowl* every time because the bowl was set out once when the recipe card was written — so yesterday's batter contaminates today's. A closure is a recipe you jotted down while cooking in a friend's kitchen: it secretly remembers what was in their fridge (captured by reference), and if they restock the fridge, your recipe sees the new contents.",
    diagram: `<svg viewBox="0 0 720 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Argument types and closures">${svgDefs}
      <text x="30" y="30" fill="#e6edf3" font-size="12" font-weight="700">def f(pos, *args, kw=default, **kwargs):</text>
      ${box(30, 45, 140, 45, "positional", "required", "#3b82f6")}
      ${box(185, 45, 120, 45, "*args", "extra → tuple", "#22c55e")}
      ${box(320, 45, 150, 45, "kw=default", "keyword-only", "#f59e0b")}
      ${box(485, 45, 130, 45, "**kwargs", "extra → dict", "#8b5cf6")}
      <rect x="30" y="110" width="360" height="100" rx="10" fill="#1a2332" stroke="#f85149" stroke-dasharray="5 4"/>
      <text x="45" y="132" fill="#f85149" font-size="11" font-weight="700">Mutable default bug</text>
      <text x="45" y="152" fill="#e6edf3" font-size="10">def f(x=[]):  # ONE list, created once</text>
      <text x="45" y="170" fill="#e6edf3" font-size="10">  x.append(1)  # accumulates across calls</text>
      <text x="45" y="192" fill="#22c55e" font-size="10">Fix: def f(x=None): x = [] if x is None else x</text>
      <rect x="415" y="110" width="275" height="100" rx="10" fill="#1a2332" stroke="#8b5cf6" stroke-dasharray="5 4"/>
      <text x="430" y="132" fill="#8b5cf6" font-size="11" font-weight="700">Closure captures by reference</text>
      <text x="430" y="152" fill="#e6edf3" font-size="10">def outer(f): def inner(x): return x*f</text>
      <text x="430" y="172" fill="#e6edf3" font-size="10">each outer() call -> independent closure</text>
      <text x="430" y="194" fill="#8b949e" font-size="10">partial pre-fills · lru_cache memoizes</text>
    </svg>`,
    diagramLegend: [
      { color: "#22c55e", label: "*args", description: "Extra positional arguments gathered into a tuple." },
      { color: "#8b5cf6", label: "**kwargs", description: "Extra keyword arguments gathered into a dict." },
      { color: "#f85149", label: "Mutable default", description: "Shared object created once — use None sentinel." },
    ],
    codeExample: {
      language: "python",
      title: "args/kwargs, unpacking, closures & the default bug",
      code: `# *args -> tuple, **kwargs -> dict
def build_request(prompt, *tags, **opts):
    return {"prompt": prompt, "tags": tags, "opts": opts}

print(build_request("hi", "a", "b", model="gpt-4", stream=True))

# unpacking a list/dict into a call
args = ["hi", "urgent"]
kw = {"model": "gpt-4"}
print(build_request(*args, **kw))

# THE mutable default bug
def bad(item, acc=[]):        # one shared list!
    acc.append(item)
    return acc
print(bad(1))                 # [1]
print(bad(2))                 # [1, 2]  <- bug

# fix + closure
def good(item, acc=None):
    acc = [] if acc is None else acc
    acc.append(item)
    return acc
def make_multiplier(factor):  # closure captures 'factor'
    return lambda x: x * factor
print(good(1), good(2), make_multiplier(3)(5))   # [1] [2] 15`,
    },
    codeExamples: [
      {
        language: "python",
        tab: "args/kwargs",
        title: "Collect and unpack arguments",
        code: `# *args collects extra positional args into a TUPLE
def log(*tokens):
    for i, t in enumerate(tokens):
        print(i, t)
log("a", "b", "c")

# **kwargs collects extra keyword args into a DICT
def request(prompt, **kwargs):
    defaults = {"model": "gpt-4", "temperature": 0.7}
    return {**defaults, "prompt": prompt, **kwargs}
print(request("hi", temperature=0.9, stream=True))

# unpacking at the call site (inverse of collection)
cfg = {"model": "gpt-3.5", "temperature": 0.5}
print(request("explain", **cfg)["model"])`,
      },
      {
        language: "python",
        tab: "default bug",
        title: "The mutable default argument gotcha",
        code: `# BUG: the default [] is created ONCE at definition
def add_bad(msg, history=[]):
    history.append(msg)
    return history
print(add_bad("Hello"))       # ['Hello']
print(add_bad("World"))       # ['Hello', 'World']  <- accumulated!

# FIX: None sentinel -> fresh list each call
def add_good(msg, history=None):
    if history is None:
        history = []
    history.append(msg)
    return history
print(add_good("Hello"))      # ['Hello']
print(add_good("World"))      # ['World']  <- correct`,
      },
      {
        language: "python",
        tab: "closures/functools",
        title: "Closures, partial & lru_cache",
        code: `from functools import partial, lru_cache

# closure: 'factor' is captured by reference
def make_multiplier(factor):
    def multiply(x):
        return x * factor
    return multiply
double, triple = make_multiplier(2), make_multiplier(3)
print(double(5), triple(5))            # 10 15

# partial pre-fills arguments
def call(prompt, model, temperature):
    return f"[{model}@{temperature}] {prompt}"
gpt4 = partial(call, model="gpt-4", temperature=0.7)
print(gpt4("hello"))

# lru_cache memoizes pure functions
@lru_cache(maxsize=128)
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)
print(fib(30))
print(fib.cache_info())`,
      },
    ],
    problemStatement:
      "A helper `def add_message(msg, history=[])` is meant to start each conversation fresh but users report messages from earlier conversations leaking into new ones. Separately, a set of specialized API callers all repeat the same `model=` and `temperature=` arguments, and a recursive scoring function recomputes the same values thousands of times. Explain the root cause of the leaking history, the correct fix, and which functools tools eliminate the repeated arguments and redundant recomputation.",
    questions: [
      {
        q: "What type does `*args` collect extra positional arguments into?",
        options: ["A. list", "B. tuple", "C. dict", "D. set"],
        answer: "B",
        explanation:
          "B is correct: inside the function `*args` is a tuple (immutable), so you can't `args.append(...)` directly — convert with `list(args)` if needed. `**kwargs` collects keyword args into a dict.",
      },
      {
        q: "Why does a mutable default argument like `def f(x=[]):` cause bugs?",
        options: [
          "A. Python copies the list on every call",
          "B. Default arguments are evaluated once at definition, so all default-using calls share the same object",
          "C. Lists are not allowed as defaults",
          "D. Python resets the default automatically after each call",
        ],
        answer: "B",
        explanation:
          "B is correct: the default object is created once when the `def` executes, so every call that relies on the default mutates the same list, accumulating state. Fix with a None sentinel and create the object inside the body.",
      },
      {
        q: "In `f(*my_list, **my_dict)`, what do `*` and `**` do at the call site?",
        options: [
          "A. Collect arguments into a tuple and dict",
          "B. Unpack the list into positional args and the dict into keyword args",
          "C. Create a closure",
          "D. Multiply and exponentiate the arguments",
        ],
        answer: "B",
        explanation:
          "B is correct: at a call site `*`/`**` unpack (spread) a sequence into positional arguments and a mapping into keyword arguments — the inverse of collecting them in a signature.",
      },
      {
        q: "How does a closure capture variables from its enclosing scope?",
        options: [
          "A. By value (a snapshot at creation time)",
          "B. By reference, so later mutations are visible and the variable stays alive",
          "C. It copies them into globals",
          "D. It doesn't — inner functions can't see outer variables",
        ],
        answer: "B",
        explanation:
          "B is correct: closures capture by reference, keeping the variable alive as long as the inner function exists; this is why the loop-lambda trap occurs (all see the final value) and is fixed with `lambda i=i:`.",
      },
      {
        q: "What does `functools.lru_cache(maxsize=128)` do?",
        options: [
          "A. Limits a function to 128 total calls",
          "B. Memoizes results keyed by arguments, returning cached results for repeat calls (up to 128 unique)",
          "C. Runs the function in 128 threads",
          "D. Logs the last 128 calls",
        ],
        answer: "B",
        explanation:
          "B is correct: lru_cache caches return values keyed by the arguments, so repeat calls with the same args are instant; maxsize bounds the number of cached entries and `cache_info()` reports hits/misses. It requires hashable args and a pure function.",
      },
      {
        q: "What does `partial(print, end='')` create?",
        options: [
          "A. A class",
          "B. A new callable that behaves like print with end='' pre-filled, awaiting positional args",
          "C. A generator",
          "D. A coroutine",
        ],
        answer: "B",
        explanation:
          "B is correct: `functools.partial` returns a new callable with some arguments pre-filled, so `f = partial(print, end=''); f('x')` behaves like `print('x', end='')`. Common for pre-configuring API clients or sort keys.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "be-comprehensions",
    title: "Comprehensions & Generators",
    shortLabel: "Comprehensions",
    section: "Python Foundations",
    domain: "Backend",
    tldr:
      "Comprehensions transform and filter iterables in one readable expression: list `[expr for x in it if cond]`, dict `{k: v for ...}`, set `{expr for ...}`. Swap the brackets for parentheses and you get a lazy generator expression `(expr for x in it)` that yields one item at a time in O(1) memory — perfect for `sum`/`any`/`all`/`max` and huge datasets. Generators (and `yield` functions) are single-pass iterators.",
    subtopics: [
      {
        heading: "The three comprehensions",
        bullets: [
          { icon: "📋", text: "**List**: `[expr for x in it if cond]` — transform + optional filter, ~20–30% faster than a `for`+`append` loop." },
          { icon: "🗂️", text: "**Dict**: `{k: v for x in it if cond}` — build or invert mappings (e.g. `{idx: word for word, idx in vocab.items()}`)." },
          { icon: "🎒", text: "**Set**: `{expr for x in it if cond}` — dedup while transforming; note curly braces with **no colon**." },
        ],
      },
      {
        heading: "Generators",
        bullets: [
          { icon: "💧", text: "**Generator expression**: same syntax with **parentheses** `(expr for x in it)` — **lazy**, produces one item at a time, **O(1) memory**." },
          { icon: "🌀", text: "**`yield`** turns a function into a generator: it pauses and resumes, preserving local state between values." },
          { icon: "1️⃣", text: "Generators are **single-pass** iterators — once exhausted they yield nothing; convert to `list()` if you need multiple passes." },
        ],
      },
      {
        heading: "When to use which",
        bullets: [
          { icon: "📦", text: "**List** when you need indexing, `len()`, or multiple passes over the data." },
          { icon: "🚿", text: "**Generator** for large data or when piping into `sum`/`any`/`all`/`max`/`min` — no intermediate list is materialized (and `any`/`all` short-circuit)." },
          { icon: "🧵", text: "**Chain generators** into a pipeline where each stage processes lazily, one item at a time." },
        ],
      },
    ],
    keyFacts: [
      { label: "List comp", value: "[expr for x in it if cond]", icon: "📋" },
      { label: "Generator", value: "(expr ...) — lazy, O(1) mem", icon: "💧" },
      { label: "Generator passes", value: "Single-pass (exhaustible)", icon: "1️⃣" },
      { label: "yield", value: "Pause/resume, keep state", icon: "🌀" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'Transform + filter in one line' → **list/dict/set comprehension**.",
        "'Huge dataset, don't blow up memory' → **generator expression** (O(1)).",
        "'Feed into sum/any/all/max' → pass a **generator**, skip the intermediate list.",
        "'Iterate the same generator twice' → **can't**; it's single-pass, use `list()`.",
        "'yield' → makes a **generator function** that pauses/resumes with saved state.",
      ],
      analogyBrief:
        "A list comprehension is an assembly line that fills a warehouse up front; a generator is the same line with no warehouse — parts come out one at a time, on demand.",
    },
    explanation:
      "Comprehensions are the most Pythonic way to build a new collection by transforming and optionally filtering an iterable in a single readable expression. A list comprehension has the form [expression for item in iterable if condition] where the if clause is optional and both parts can be arbitrary expressions; it is roughly 20–30% faster than the equivalent for-loop with .append() because the interpreter recognizes and optimizes the pattern. A dict comprehension, {key_expr: value_expr for item in iterable if condition}, is ideal for building or inverting mappings (for example {idx: word for word, idx in vocab.items()}), and a set comprehension, {expression for item in iterable if condition} (curly braces, no colon), transforms while deduplicating. Comprehensions can nest, [expr for outer in a for inner in b], read left to right as nested loops, though deeply nested comprehensions hurt readability and are better written as explicit loops. The critical companion is the generator expression, which has exactly the same syntax as a list comprehension but uses parentheses, (expr for item in iterable): rather than materializing every value, a generator is lazy and produces one item at a time, so its memory footprint is O(1) (about a hundred bytes) regardless of how many items it will yield, compared with a list comprehension's O(n). Generators are iterators and therefore single-pass — once you have consumed them they are exhausted and yield nothing, so if you need multiple passes you must convert to a list or recreate the generator. Generators integrate perfectly with reducing built-ins like sum, max, min, any, and all, avoiding an intermediate list (sum(x*x for x in range(n)) creates no list), and any/all additionally short-circuit, stopping as soon as the answer is known. Beyond expressions, a function that contains a yield statement becomes a generator function: yield emits a value to the caller and pauses the function, preserving all local state, then resumes right after the yield on the next iteration — this lets you write batching helpers and lazy pipelines where several generators are chained so each stage processes one item at a time. The guidance on choosing is: use a list when you need random access by index, len(), or multiple iterations; use a generator when the data is large or you are piping the result into another function; use a dict for key-value transformations; and use a set for deduplication.",
    analogy:
      "A list comprehension is a factory assembly line that runs to completion and stacks every finished part in a warehouse before you touch anything: fast to read, but the warehouse (memory) has to hold all of it at once. A generator expression is the very same assembly line with the warehouse removed — parts roll off the end one at a time, exactly when a downstream worker reaches out for the next one. That's why a generator's memory cost is a rounding error even for a billion items, and why it pairs so naturally with sum() or any(), which just want to consume parts one by one. The catch: once a part rolls past, it's gone — the line doesn't rewind, so a generator can only be walked once.",
    diagram: `<svg viewBox="0 0 720 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="List comprehension vs generator expression">${svgDefs}
      <rect x="20" y="30" width="320" height="150" rx="10" fill="#1a2332" stroke="#3b82f6" stroke-dasharray="5 4"/>
      <text x="35" y="52" fill="#3b82f6" font-size="11" font-weight="700">List comp  [x*2 for x in range(n)]</text>
      <text x="35" y="74" fill="#e6edf3" font-size="10">evaluates ALL items immediately</text>
      <text x="35" y="94" fill="#22c55e" font-size="10">-> [0, 2, 4, ...] stored in RAM</text>
      <text x="35" y="114" fill="#f59e0b" font-size="10">Memory: O(n)</text>
      <text x="35" y="134" fill="#8b949e" font-size="10">Allows indexing, len(), many passes</text>
      ${box(60, 145, 240, 26, "warehouse", "holds every item", "#3b82f6")}
      <rect x="380" y="30" width="320" height="150" rx="10" fill="#1a2332" stroke="#22c55e" stroke-dasharray="5 4"/>
      <text x="395" y="52" fill="#22c55e" font-size="11" font-weight="700">Generator  (x*2 for x in range(n))</text>
      <text x="395" y="74" fill="#e6edf3" font-size="10">yields one item at a time (lazy)</text>
      <text x="395" y="94" fill="#22c55e" font-size="10">-> generator object, not a list</text>
      <text x="395" y="114" fill="#f59e0b" font-size="10">Memory: O(1)</text>
      <text x="395" y="134" fill="#8b949e" font-size="10">Single pass — exhausted after use</text>
      ${box(420, 145, 240, 26, "no warehouse", "one item on demand", "#22c55e")}
      <text x="30" y="215" fill="#8b949e" font-size="10">Use generators for sum()/any()/all()/max() and large data; lists for random access.</text>
    </svg>`,
    diagramLegend: [
      { color: "#3b82f6", label: "List comprehension", description: "Materializes all items; O(n) memory, multi-pass." },
      { color: "#22c55e", label: "Generator", description: "Lazy, one item at a time; O(1) memory, single-pass." },
      { color: "#f59e0b", label: "Memory cost", description: "O(n) list vs ~constant generator footprint." },
    ],
    codeExample: {
      language: "python",
      title: "Comprehensions and lazy generators",
      code: `tokens = ["Hello", "World", "!", "Python"]

# list comprehension: transform + filter
words = [t.lower() for t in tokens if t.isalpha()]
print(words)                       # ['hello', 'world', 'python']

# dict comprehension: build then invert a vocab
vocab = {w: i for i, w in enumerate(words)}
inv = {i: w for w, i in vocab.items()}
print(vocab, inv)

# set comprehension: unique first letters
print({w[0] for w in words})       # {'h', 'w', 'p'}

# generator expression: O(1) memory, feeds sum() with no list
import sys
gen = (x * x for x in range(1_000_000))
print(sys.getsizeof(gen), "bytes")   # ~constant, tiny
print(sum(x * x for x in range(1000)))

# generator function with yield (single-pass)
def batches(items, size):
    for i in range(0, len(items), size):
        yield items[i:i + size]
print(list(batches(list("abcdefg"), 3)))`,
    },
    codeExamples: [
      {
        language: "python",
        tab: "list/dict/set",
        title: "The three comprehensions",
        code: `tokens = ["Hello", "World", "!", "Python"]

# list: transform + filter
lowered = [t.lower() for t in tokens if t.isalpha()]
print(lowered)

# dict: build a vocab, then invert it
vocab = {w: i for i, w in enumerate(lowered)}
inv = {i: w for w, i in vocab.items()}
print(vocab)
print(inv)

# set: unique characters
chars = {c for w in tokens for c in w.lower() if c.isalpha()}
print(sorted(chars))

# nested: flatten a 2D list
matrix = [[1, 2], [3, 4], [5, 6]]
print([x for row in matrix for x in row])`,
      },
      {
        language: "python",
        tab: "generators",
        title: "Lazy, memory-efficient pipelines",
        code: `import sys

# list vs generator memory
n = 100_000
lst = [x * x for x in range(n)]
gen = (x * x for x in range(n))
print(sys.getsizeof(lst), "vs", sys.getsizeof(gen), "bytes")

# feed reducers directly — no intermediate list
print(sum(x * x for x in range(1000)))
# any/all short-circuit
print(any(len(w) > 10 for w in ["hi", "extraordinary"]))
print(all(w.isalpha() for w in ["hello", "world"]))`,
      },
      {
        language: "python",
        tab: "yield pipeline",
        title: "Generator functions chained lazily",
        code: `# yield turns a function into a generator (single-pass)
def tokenize(text):
    for word in text.split():
        yield word.lower()

def drop_stopwords(tokens, stop={"the", "a", "is"}):
    for t in tokens:
        if t not in stop:
            yield t

text = "The cat is a friendly animal"
pipeline = drop_stopwords(tokenize(text))   # nothing runs yet
print(list(pipeline))                        # ['cat', 'friendly', 'animal']

# exhausted after one pass
print(list(pipeline))                        # []  <- already consumed`,
      },
    ],
    problemStatement:
      "A data job loads a 5 GB log file into a list comprehension to compute the total bytes, and the process is killed by the OOM (out-of-memory) killer. A colleague also complains that after passing a generator to `sum()`, a later `max()` over 'the same' generator returns nothing. Explain how to compute the total without materializing the list, why the second aggregation is empty, and when a list comprehension is still the right choice.",
    questions: [
      {
        q: "What does `[x for x in range(5) if x % 2 == 0]` produce?",
        options: ["A. [1, 3]", "B. [0, 2, 4]", "C. [0, 1, 2, 3, 4]", "D. [2, 4]"],
        answer: "B",
        explanation:
          "B is correct: range(5) is 0,1,2,3,4 and the condition keeps the even values, giving [0, 2, 4].",
      },
      {
        q: "What is the key difference between `[x for x in range(1_000_000)]` and `(x for x in range(1_000_000))`?",
        options: [
          "A. No difference",
          "B. The list allocates memory for all 1M values; the generator uses ~constant memory, yielding one at a time",
          "C. The generator is faster but uses the same memory",
          "D. Both use O(n) memory",
        ],
        answer: "B",
        explanation:
          "B is correct: the list comprehension materializes 1M objects (megabytes), while the generator expression creates a small generator object that produces values lazily on demand — O(1) memory.",
      },
      {
        q: "Which syntax creates a set comprehension?",
        options: [
          "A. [expr for x in it]",
          "B. {k: v for x in it}",
          "C. {expr for x in it}",
          "D. (expr for x in it)",
        ],
        answer: "C",
        explanation:
          "C is correct: `{expr for x in it}` (curly braces, no colon) is a set comprehension. Square brackets make a list, curly braces with a colon make a dict, and parentheses make a generator expression.",
      },
      {
        q: "Can you iterate over the same generator object twice?",
        options: [
          "A. Yes, generators reset automatically",
          "B. No — generators are single-pass; once exhausted they yield nothing",
          "C. Only if you call .reset()",
          "D. Yes, but only within the same function",
        ],
        answer: "B",
        explanation:
          "B is correct: generators are single-pass iterators. After the first full consumption they are exhausted and yield nothing, which is why a second aggregation is empty. Convert to `list()` (or recreate the generator) for multiple passes.",
      },
      {
        q: "What does `yield` do inside a function?",
        options: [
          "A. Returns and permanently terminates the function like `return`",
          "B. Turns the function into a generator; it emits a value and pauses, resuming with local state preserved on the next iteration",
          "C. Raises StopIteration immediately",
          "D. Converts the function into a coroutine that must be awaited",
        ],
        answer: "B",
        explanation:
          "B is correct: a function containing `yield` is a generator function; each `yield` emits a value and suspends the function, preserving locals, and execution resumes after that `yield` on the next iteration.",
      },
      {
        q: "Why is `sum(x*x for x in range(10**6))` preferable to `sum([x*x for x in range(10**6)])`?",
        options: [
          "A. They give different results",
          "B. The generator version feeds values to sum() one at a time without building an intermediate list, saving memory",
          "C. The list version is always faster",
          "D. sum() only accepts generators",
        ],
        answer: "B",
        explanation:
          "B is correct: both sum to the same value, but the generator version never materializes the full list, so it uses far less memory for large ranges. (Passing a bare generator to a function needs no extra parentheses.)",
      },
    ],
  },
];
