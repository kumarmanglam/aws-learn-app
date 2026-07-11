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
// SECTION: SQL for Analytics & Finance — Foundations
// "Why SQL, not just Excel." Aimed at a 3rd-year BA student with zero SQL
// background. Every example uses realistic business tables (customers,
// orders) — never foo/bar — and every query is framed by "what does this
// number mean for the business."
//
// Worked-example code tabs: Setup / Concept / Variation. Each query tab shares
// the topic's schema via the CodeExample `setup` field (see lib/topics/shared.ts)
// so the CREATE/INSERT DDL isn't repeated in every tab's visible code. Hands-on
// practice lives in each topic's `tryIt` array (5 exercises, easy→medium) which
// render as their own editable, individually-run SQL editors with result-based
// correctness tracking. Queries run in-browser via sql.js (SQLite). SQLite is
// ~95% MySQL-compatible; the few divergences get inline "MySQL note" callouts
// and a dedicated cheat-sheet topic.
// ============================================================
import { svgDefs, type Topic } from "./shared";

const box = (
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  sub: string,
  color = "#38bdf8",
) => `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#243349" stroke="${color}"/>
  <text x="${x + w / 2}" y="${y + h / 2 - 2}" text-anchor="middle" fill="#e6edf3" font-size="12" font-weight="600">${title}</text>
  <text x="${x + w / 2}" y="${y + h / 2 + 15}" text-anchor="middle" fill="#8b949e" font-size="10">${sub}</text>
`;

// Shared sample schema reused across this section's query tabs.
const CUSTOMERS_SEED = `CREATE TABLE customers (
  id       INTEGER PRIMARY KEY,
  name     TEXT,
  city     TEXT,
  segment  TEXT,          -- 'SMB' | 'Enterprise' | 'Consumer'
  credit   REAL           -- approved credit limit
);
INSERT INTO customers (id, name, city, segment, credit) VALUES
  (1, 'Acme Corp',      'Mumbai',    'Enterprise', 500000),
  (2, 'Beta Traders',   'Delhi',     'SMB',         80000),
  (3, 'Gamma Retail',   'Mumbai',    'Consumer',    15000),
  (4, 'Delta Logistics','Bengaluru', 'SMB',        120000),
  (5, 'Epsilon Foods',  'Delhi',     'Enterprise', 400000);`;

const ORDERS_SEED = `${CUSTOMERS_SEED}
CREATE TABLE orders (
  id          INTEGER PRIMARY KEY,
  customer_id INTEGER,
  amount      REAL,
  status      TEXT        -- 'paid' | 'pending' | 'refunded'
);
INSERT INTO orders (id, customer_id, amount, status) VALUES
  (101, 1, 12000, 'paid'),
  (102, 1,  8000, 'pending'),
  (103, 2,  3500, 'paid'),
  (104, 3,   900, 'refunded'),
  (105, 4,  6200, 'paid'),
  (106, 5, 22000, 'paid'),
  (107, 5,  5000, 'pending');`;

export const sqlFoundationsTopics: Topic[] = [
  // -----------------------------------------------------------------
  {
    id: "sql-what-is-db",
    title: "What Is a Database? Tables, Rows & Columns",
    shortLabel: "Databases 101",
    section: "Foundations",
    domain: "Database",
    tldr:
      "A relational database is a set of tables. A table is like a single sheet in a spreadsheet: columns define the fields (name, city, amount) and each row is one record (one customer, one order). The big difference from Excel is that the structure is enforced — every row in the customers table has exactly the same columns with the same types — and you ask questions with a language (SQL) instead of clicking and dragging. That discipline is exactly why finance and analytics teams trust databases with millions of transactions where a spreadsheet would break.",
    subtopics: [
      {
        heading: "The spreadsheet → database mental model",
        bullets: [
          { icon: "📗", text: "A **database** = a workbook (the whole file). A **table** = one sheet inside it. Your business will have several tables: `customers`, `orders`, `invoices`." },
          { icon: "🧱", text: "A **column** is a field with a fixed name and type — `amount` is always a number, `city` is always text. A **row** is one complete record: one customer, one order." },
          { icon: "🔑", text: "Each table has a **primary key** (usually `id`) — a unique label for every row, so 'customer 5' always means exactly one customer." },
        ],
      },
      {
        heading: "Why not just use Excel?",
        bullets: [
          { icon: "📏", text: "**Enforced structure**: you can't accidentally type text into a number column or leave a row half-filled. Data stays clean at scale." },
          { icon: "📈", text: "**Scale**: databases handle millions of rows and many people reading/writing at once — where a spreadsheet freezes or corrupts." },
          { icon: "🧾", text: "**Repeatable answers**: a saved SQL query re-runs the exact same report every month with one click — no re-dragging formulas." },
        ],
      },
    ],
    keyFacts: [
      { label: "Database", value: "A set of tables", icon: "🗄️" },
      { label: "Table", value: "Like one spreadsheet sheet", icon: "📗" },
      { label: "Row", value: "One record (a customer)", icon: "➡️" },
      { label: "Column", value: "One typed field", icon: "⬇️" },
    ],
    quickReference: {
      title: "Remember this",
      icon: "🎯",
      bullets: [
        "Database → Table → Row → Column (workbook → sheet → line → field).",
        "Every row in a table has the **same** columns — structure is enforced.",
        "The **primary key** (`id`) uniquely identifies each row.",
        "You *query* a database with SQL; you *click* around a spreadsheet.",
      ],
      analogyBrief:
        "A database is a strict workbook where every sheet's columns are locked in, so no one can quietly break the format.",
    },
    explanation:
      "A relational database organizes information into tables, and a table is the single most important idea to internalize when you come from a spreadsheet background: it is essentially one clean sheet. The columns across the top define the fields — for a customers table that might be id, name, city, segment, and credit — and every column has a fixed type, so amount is always a number and city is always text. Each row beneath is one complete record: one customer, with a value in every column. Where a spreadsheet lets you scribble a note in a random cell, merge cells, or mix text and numbers in one column, a database refuses — the structure is enforced, which is precisely what keeps data trustworthy when it grows to millions of rows and many people are reading and writing at once. Every well-designed table has a primary key, almost always a column called id, that uniquely identifies each row; this is what lets you say 'customer 5' and mean exactly one customer, and it is what other tables point at when they need to reference a customer. A real business is modeled as several related tables — customers, orders, invoices, transactions — rather than one giant sheet, because splitting data by 'thing it describes' avoids repeating the same customer's details on every one of their orders. You don't navigate a database by scrolling and clicking; you ask it questions in SQL (Structured Query Language), and the very first question is always the same shape: SELECT some columns FROM some table. Understanding that a query returns a new little table of results — rows and columns, just filtered and reshaped — is the foundation everything else in this course builds on.",
    analogy:
      "Think of a well-run finance department's filing system. The whole filing cabinet is the database. Each drawer is a table: one drawer for customers, one for orders. Inside a drawer, every folder has the exact same printed form with the same labeled boxes (columns) — name, city, credit limit — and each filled-in form is one record (a row). Nobody is allowed to cross out a label, add a box, or file a form with blanks, so any clerk can pull any folder and instantly know where each piece of information lives. A spreadsheet, by contrast, is a single big whiteboard anyone can doodle on — fast for a quick note, chaos once fifty people and a hundred thousand entries are involved.",
    diagram: `<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A database is a set of tables; a table has columns and rows">${svgDefs}
      <text x="20" y="24" fill="#38bdf8" font-size="13" font-weight="700">Database  =  a set of tables</text>
      ${box(20, 40, 150, 55, "customers", "who buys from us", "#38bdf8")}
      ${box(200, 40, 150, 55, "orders", "what they bought", "#22c55e")}
      ${box(380, 40, 150, 55, "invoices", "what we billed", "#f59e0b")}
      <text x="20" y="135" fill="#e6edf3" font-size="13" font-weight="700">Inside one table: columns (fields) × rows (records)</text>
      <rect x="20" y="150" width="520" height="110" rx="8" fill="#1a2332" stroke="#38bdf8"/>
      <line x1="20" y1="178" x2="540" y2="178" stroke="#38bdf8" stroke-width="1.5"/>
      <text x="60"  y="170" fill="#38bdf8" font-size="11" font-weight="700">id</text>
      <text x="150" y="170" fill="#38bdf8" font-size="11" font-weight="700">name</text>
      <text x="300" y="170" fill="#38bdf8" font-size="11" font-weight="700">city</text>
      <text x="430" y="170" fill="#38bdf8" font-size="11" font-weight="700">credit</text>
      <text x="60"  y="202" fill="#e6edf3" font-size="11">1</text>
      <text x="150" y="202" fill="#e6edf3" font-size="11">Acme Corp</text>
      <text x="300" y="202" fill="#e6edf3" font-size="11">Mumbai</text>
      <text x="430" y="202" fill="#e6edf3" font-size="11">500000</text>
      <text x="60"  y="228" fill="#e6edf3" font-size="11">2</text>
      <text x="150" y="228" fill="#e6edf3" font-size="11">Beta Traders</text>
      <text x="300" y="228" fill="#e6edf3" font-size="11">Delhi</text>
      <text x="430" y="228" fill="#e6edf3" font-size="11">80000</text>
      <text x="560" y="200" fill="#8b949e" font-size="10">← one row</text>
      <text x="560" y="216" fill="#8b949e" font-size="10">= one customer</text>
      <text x="60" y="252" fill="#8b949e" font-size="10">↑ the "id" column is the primary key (unique per row)</text>
    </svg>`,
    diagramLegend: [
      { color: "#38bdf8", label: "Table", description: "One subject's data — like a single spreadsheet sheet." },
      { color: "#22c55e", label: "Row", description: "One record: a single customer or order, with every column filled." },
      { color: "#f59e0b", label: "Related tables", description: "A business splits data across several linked tables, not one giant sheet." },
    ],
    codeExample: {
      language: "sql",
      title: "Read every column from the customers table",
      setup: CUSTOMERS_SEED,
      code: `-- Read the whole customers table (all columns, all rows)
SELECT * FROM customers;`,
    },
    codeExamples: [
      {
        language: "sql",
        tab: "1 · Setup",
        title: "Create the customers table and add rows",
        // The Setup tab shows the DDL itself, then displays the seeded rows so
        // you can confirm the table exists. Other tabs reuse this via `setup`.
        code: `${CUSTOMERS_SEED}

-- Confirm it worked: show what we just inserted
SELECT * FROM customers;`,
      },
      {
        language: "sql",
        tab: "2 · Concept",
        title: "SELECT * — read the whole table",
        setup: CUSTOMERS_SEED,
        code: `-- "*" means "every column". Returns all 5 customer rows.
SELECT * FROM customers;`,
      },
      {
        language: "sql",
        tab: "3 · Variation",
        title: "Pick only the columns you need",
        setup: CUSTOMERS_SEED,
        code: `-- Run this and compare with tab 2: same rows, fewer columns.
-- Analysts rarely need SELECT *; ask for exactly what the report needs.
SELECT name, city, credit
FROM customers;`,
      },
    ],
    problemStatement:
      "Your manager keeps the customer list in a shared spreadsheet that five people edit at once. It has started showing blank rows, a phone number typed into the 'credit limit' column, and duplicate entries. Explain, in database terms, what a table would enforce that the spreadsheet does not — and identify which column should be the primary key.",
    questions: [
      {
        difficulty: "easy",
        q: "In database terms, what is a single row of the customers table?",
        options: [
          "One complete record — e.g. everything about one customer",
          "One column of data across all customers",
          "The name of the table",
          "A saved SQL query",
        ],
        answer: "A",
        explanation:
          "A row is one record: one customer, with a value in every column. A column (like 'city') runs down the table across all rows.",
      },
      {
        difficulty: "easy",
        q: "A 'column' in the customers table is best described as:",
        options: [
          "One customer's full details",
          "A single field (like city) with a fixed name and type, shared by every row",
          "The primary key only",
          "A chart of the data",
        ],
        answer: "B",
        explanation:
          "A column is one typed field that every row fills in — e.g. every customer has a city. A row, by contrast, is one whole record.",
      },
      {
        difficulty: "easy",
        q: "Reading the result of `SELECT name, city FROM customers;`, what will a report reader see?",
        options: [
          "Every column of every customer",
          "Only the name and city of each customer",
          "A single number",
          "An error, because you must always use SELECT *",
        ],
        answer: "B",
        explanation:
          "SELECT lists exactly the columns you want. Choosing specific columns keeps reports focused on what the audience needs.",
      },
      {
        difficulty: "medium",
        q: "What is the main advantage of a database table over a spreadsheet sheet for company data?",
        options: [
          "It uses brighter colors",
          "It enforces structure and types, so data stays clean at scale",
          "It never needs a primary key",
          "It can only hold ten rows",
        ],
        answer: "B",
        explanation:
          "The enforced, typed structure (plus multi-user scale and repeatable queries) is why databases are trusted with large, shared business data.",
      },
      {
        difficulty: "medium",
        q: "What does the primary key (the id column) guarantee, and why does it matter for related tables?",
        options: [
          "That the table is sorted alphabetically",
          "That every value is a number",
          "That each row is uniquely identifiable — so an orders table can reliably point to exactly one customer",
          "That the column is hidden from reports",
        ],
        answer: "C",
        explanation:
          "A primary key uniquely identifies each row. Other tables (like orders) reference it, so 'customer 5' always resolves to one customer.",
      },
    ],
    tryIt: [
      {
        id: "sql-what-is-db-t1",
        difficulty: "easy",
        prompt: "Return **every column** for all customers.",
        hint: "`*` is shorthand for 'all columns'.",
        setup: CUSTOMERS_SEED,
        starter: `-- Fill in the blank and Run\nSELECT ___ FROM customers;`,
        solution: `SELECT * FROM customers;`,
      },
      {
        id: "sql-what-is-db-t2",
        difficulty: "easy",
        prompt: "Show only each customer's **name and city**.",
        setup: CUSTOMERS_SEED,
        starter: `SELECT /* columns */ \nFROM customers;`,
        solution: `SELECT name, city FROM customers;`,
      },
      {
        id: "sql-what-is-db-t3",
        difficulty: "easy",
        prompt: "Show each customer's **name, segment and credit**.",
        setup: CUSTOMERS_SEED,
        starter: `SELECT \nFROM customers;`,
        solution: `SELECT name, segment, credit FROM customers;`,
      },
      {
        id: "sql-what-is-db-t4",
        difficulty: "medium",
        prompt:
          "Show each customer's **name and credit**, but label the credit column **credit_limit**.",
        hint: "Use `AS` to rename a column in the output.",
        setup: CUSTOMERS_SEED,
        starter: `SELECT name, credit /* AS ... */ \nFROM customers;`,
        solution: `SELECT name, credit AS credit_limit FROM customers;`,
      },
      {
        id: "sql-what-is-db-t5",
        difficulty: "medium",
        prompt:
          "List each customer's **name and credit**, ordered from the **highest credit to the lowest**.",
        hint: "Sorting uses `ORDER BY column DESC` (you'll meet it properly next topic).",
        setup: CUSTOMERS_SEED,
        starter: `SELECT name, credit\nFROM customers\n/* ORDER BY ... */;`,
        solution: `SELECT name, credit FROM customers ORDER BY credit DESC;`,
        orderMatters: true,
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "sql-first-select",
    title: "Your First Query — SELECT, Aliases & ORDER BY",
    shortLabel: "First SELECT",
    section: "Foundations",
    domain: "Database",
    tldr:
      "Every SQL question starts with SELECT columns FROM table. You can rename a column in the output with AS (an alias) to make reports readable — SUM stays SUM in your head but shows as 'Total Revenue' to your manager. ORDER BY sorts the result so the number that matters (biggest customer, latest order) sits at the top. Read a query like a sentence: 'SELECT name and credit FROM customers ORDER BY credit descending' = 'show me each customer's name and credit limit, largest limit first.'",
    subtopics: [
      {
        heading: "The shape of every query",
        bullets: [
          { icon: "🧭", text: "`SELECT <columns> FROM <table>` is the backbone. Everything else (WHERE, ORDER BY, GROUP BY) is an optional clause added after." },
          { icon: "🏷️", text: "**Alias with `AS`**: `SELECT credit AS credit_limit` renames the column *in the output only* — great for turning cryptic field names into report-ready labels." },
          { icon: "🔢", text: "**`ORDER BY col`** sorts ascending by default; add **`DESC`** for largest-first — the natural order for 'top customers' or 'biggest orders'." },
        ],
      },
      {
        heading: "Read it like a business sentence",
        bullets: [
          { icon: "🗣️", text: "`SELECT name, credit FROM customers ORDER BY credit DESC` → 'list each customer's name and credit limit, highest limit first.'" },
          { icon: "🎯", text: "SQL is **declarative**: you describe *what* you want, not *how* to fetch it. The engine figures out the how." },
          { icon: "🔤", text: "Keywords (SELECT, FROM, ORDER BY) are conventionally UPPERCASE; it's a readability habit, not a rule — SQL is case-insensitive for keywords." },
        ],
      },
    ],
    keyFacts: [
      { label: "Backbone", value: "SELECT … FROM …", icon: "🧭" },
      { label: "Rename output", value: "col AS label", icon: "🏷️" },
      { label: "Sort", value: "ORDER BY col [DESC]", icon: "🔽" },
      { label: "Style", value: "Keywords UPPERCASE", icon: "🔤" },
    ],
    quickReference: {
      title: "Query skeleton",
      icon: "🧩",
      bullets: [
        "`SELECT` the columns you want.",
        "`FROM` the table they live in.",
        "`AS` renames a column in the result for a cleaner report.",
        "`ORDER BY x DESC` puts the biggest x on top.",
        "Read the clauses top-to-bottom as one English sentence.",
      ],
      analogyBrief:
        "SELECT/FROM/ORDER BY is a fill-in-the-blanks request form: which fields, from which drawer, sorted how.",
    },
    explanation:
      "The single most useful sentence in SQL is SELECT columns FROM table, and almost every report you will ever write is a variation on it. SELECT names the columns you want to see; FROM names the table they come from; and the result that comes back is itself a small table of rows and columns. Because raw column names are often terse or technical, SQL lets you attach an alias with the AS keyword — SELECT credit AS credit_limit renames the column in the output only, which is how analysts turn a database's internal field names into the polished labels a manager expects on a report; the underlying data is untouched. The other clause you'll reach for immediately is ORDER BY, which sorts the result set by one or more columns; the default is ascending (smallest or A-to-Z first), and adding DESC flips it to descending, which is exactly what you want for 'largest credit limit first' or 'most recent order first.' A helpful discipline is to read a query aloud as a business sentence: SELECT name, credit FROM customers ORDER BY credit DESC becomes 'show each customer's name and credit limit, biggest limit first.' SQL is a declarative language, meaning you state the result you want and let the database engine decide how to retrieve it — you never write loops to walk through rows. Finally, a note on style: SQL keywords are case-insensitive, so select and SELECT are identical to the engine, but the near-universal convention is to write keywords in uppercase and your own table and column names in lowercase, purely so a human can skim the structure of a query at a glance.",
    analogy:
      "Writing a SELECT is like handing a request slip to a meticulous archivist. You don't tell them which shelf to walk to or how to carry the folders — you just fill in the slip: 'I need the name and credit-limit fields (SELECT), from the customers drawer (FROM), and please stack them with the highest limit on top (ORDER BY credit DESC).' The archivist handles the how and returns a neat stack — a fresh mini-table — matching your request exactly. The AS alias is like adding 'and label that last column “Credit Limit” on the cover sheet' so whoever reads the stack understands it instantly.",
    diagram: `<svg viewBox="0 0 720 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Anatomy of a SELECT query with alias and ORDER BY">${svgDefs}
      <rect x="20" y="30" width="680" height="60" rx="8" fill="#1a2332" stroke="#38bdf8"/>
      <text x="40"  y="66" fill="#f59e0b" font-size="14" font-family="monospace" font-weight="700">SELECT</text>
      <text x="120" y="66" fill="#e6edf3" font-size="14" font-family="monospace">name, credit AS credit_limit</text>
      <text x="470" y="66" fill="#f59e0b" font-size="14" font-family="monospace" font-weight="700">FROM</text>
      <text x="530" y="66" fill="#e6edf3" font-size="14" font-family="monospace">customers</text>
      <text x="40"  y="120" fill="#8b949e" font-size="11">which columns (rename with AS)</text>
      <text x="470" y="120" fill="#8b949e" font-size="11">which table</text>
      <rect x="20" y="150" width="330" height="50" rx="8" fill="#243349" stroke="#22c55e"/>
      <text x="40" y="180" fill="#22c55e" font-size="13" font-family="monospace" font-weight="700">ORDER BY credit DESC</text>
      <text x="40" y="222" fill="#8b949e" font-size="11">sort: biggest credit limit on top</text>
      <text x="400" y="172" fill="#e6edf3" font-size="12">Read aloud:</text>
      <text x="400" y="192" fill="#38bdf8" font-size="12">"names + credit limits,</text>
      <text x="400" y="210" fill="#38bdf8" font-size="12"> largest limit first."</text>
    </svg>`,
    diagramLegend: [
      { color: "#f59e0b", label: "SELECT / FROM", description: "The backbone: which columns, from which table." },
      { color: "#38bdf8", label: "AS alias", description: "Renames a column in the output for a report-ready label." },
      { color: "#22c55e", label: "ORDER BY", description: "Sorts the result; DESC puts the largest value on top." },
    ],
    codeExample: {
      language: "sql",
      title: "Top customers by credit limit, with a clean label",
      setup: CUSTOMERS_SEED,
      code: `SELECT name, credit AS credit_limit
FROM customers
ORDER BY credit DESC;`,
    },
    codeExamples: [
      {
        language: "sql",
        tab: "1 · Setup",
        title: "Load the customers table",
        code: `${CUSTOMERS_SEED}

SELECT * FROM customers;`,
      },
      {
        language: "sql",
        tab: "2 · Concept",
        title: "SELECT specific columns with an alias",
        setup: CUSTOMERS_SEED,
        code: `-- Rename 'credit' to a report-friendly label using AS
SELECT name, credit AS credit_limit
FROM customers;`,
      },
      {
        language: "sql",
        tab: "3 · Variation",
        title: "Add ORDER BY to rank them",
        setup: CUSTOMERS_SEED,
        code: `-- Same columns as tab 2, now sorted biggest-first.
-- Run both and watch the row order change.
SELECT name, credit AS credit_limit
FROM customers
ORDER BY credit DESC;`,
      },
    ],
    problemStatement:
      "The credit committee wants a one-page list of customers ranked from the highest approved credit limit to the lowest, with the limit column clearly labelled 'Credit Limit'. Write the single query that produces exactly that, and explain why ORDER BY … DESC (not ASC) is the right choice for this report.",
    questions: [
      {
        difficulty: "easy",
        q: "Every SQL query starts with which two keywords?",
        options: ["GROUP BY … HAVING", "SELECT … FROM", "ORDER BY … LIMIT", "WHERE … JOIN"],
        answer: "B",
        explanation:
          "SELECT names the columns you want; FROM names the table. Every other clause is optional and added after.",
      },
      {
        difficulty: "easy",
        q: "What does `AS` do in `SELECT credit AS credit_limit`?",
        options: [
          "Permanently renames the column in the database",
          "Renames the column only in this query's output",
          "Deletes the credit column",
          "Sorts the rows by credit",
        ],
        answer: "B",
        explanation:
          "AS creates an alias for the result set only — the stored column name is unchanged. It's for readable reports.",
      },
      {
        difficulty: "easy",
        q: "Which clause puts the largest value at the top of the result?",
        options: ["ORDER BY col ASC", "ORDER BY col DESC", "GROUP BY col", "SELECT TOP col"],
        answer: "B",
        explanation:
          "ORDER BY sorts ascending by default; DESC reverses it so the biggest value comes first.",
      },
      {
        difficulty: "medium",
        q: "SQL is described as 'declarative'. What does that mean for you as an analyst?",
        options: [
          "You must write step-by-step loops over each row",
          "You describe the result you want; the engine decides how to fetch it",
          "You can only read one column at a time",
          "You must sort data manually before querying",
        ],
        answer: "B",
        explanation:
          "Declarative means you state the 'what', not the 'how'. You never loop over rows yourself.",
      },
      {
        difficulty: "medium",
        q: "Reading `SELECT name, credit FROM customers ORDER BY credit DESC` as a sentence, what is it asking for?",
        options: [
          "Each customer's name and credit limit, highest limit first",
          "The single customer with the lowest credit",
          "The total credit across all customers",
          "Only customers in one city",
        ],
        answer: "A",
        explanation:
          "Read the clauses in order: which columns (name, credit), from where (customers), sorted how (credit, descending).",
      },
    ],
    tryIt: [
      {
        id: "sql-first-select-t1",
        difficulty: "easy",
        prompt: "Show **all customer names**, sorted **alphabetically (A→Z)**.",
        hint: "Ascending is the default, so `ORDER BY name` is enough.",
        setup: CUSTOMERS_SEED,
        starter: `SELECT name\nFROM customers\n/* ORDER BY ... */;`,
        solution: `SELECT name FROM customers ORDER BY name;`,
        orderMatters: true,
      },
      {
        id: "sql-first-select-t2",
        difficulty: "easy",
        prompt:
          "Show each customer's **name and credit**, labelling the credit column **credit_limit**.",
        setup: CUSTOMERS_SEED,
        starter: `SELECT name, credit /* AS ... */\nFROM customers;`,
        solution: `SELECT name, credit AS credit_limit FROM customers;`,
      },
      {
        id: "sql-first-select-t3",
        difficulty: "easy",
        prompt:
          "Show each customer's **name and credit**, sorted from the **smallest credit to the largest**.",
        setup: CUSTOMERS_SEED,
        starter: `SELECT name, credit\nFROM customers\nORDER BY /* ... */;`,
        solution: `SELECT name, credit FROM customers ORDER BY credit;`,
        orderMatters: true,
      },
      {
        id: "sql-first-select-t4",
        difficulty: "medium",
        prompt:
          "Show **name and credit** (label credit as **credit_limit**), with the **largest credit first**.",
        hint: "Combine an alias with `ORDER BY credit DESC`.",
        setup: CUSTOMERS_SEED,
        starter: `SELECT name, credit AS credit_limit\nFROM customers\n/* ORDER BY ... */;`,
        solution: `SELECT name, credit AS credit_limit FROM customers ORDER BY credit DESC;`,
        orderMatters: true,
      },
      {
        id: "sql-first-select-t5",
        difficulty: "medium",
        prompt:
          "Show **only the customer names**, but ordered by their **credit from highest to lowest**.",
        hint: "You can ORDER BY a column you didn't SELECT.",
        setup: CUSTOMERS_SEED,
        starter: `SELECT name\nFROM customers\nORDER BY /* ... */;`,
        solution: `SELECT name FROM customers ORDER BY credit DESC;`,
        orderMatters: true,
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "sql-engine-and-mysql-note",
    title: "The In-Browser Engine — SQLite vs MySQL",
    shortLabel: "SQLite vs MySQL",
    section: "Foundations",
    domain: "Database",
    tldr:
      "The Run button in this course executes your SQL against SQLite running entirely in your browser (via WebAssembly) — no server, no signup, no setup. At work you'll most often meet MySQL, a client-server database. For everything an analyst does — SELECT, JOIN, GROUP BY, HAVING, window functions, CTEs — the two behave identically, so what you learn here transfers directly. A handful of syntax details differ (string joining, the 'now' function, auto-numbering, and how strict GROUP BY is). This topic is your cheat sheet for those, so nothing surprises you when you open real MySQL Workbench.",
    subtopics: [
      {
        heading: "Why SQLite in the browser",
        bullets: [
          { icon: "🌐", text: "SQLite is compiled to **WebAssembly** and runs 100% client-side. Your queries never leave your machine — instant, free, and private." },
          { icon: "🧠", text: "Standard SQL (the parts analysts use) is **shared** across SQLite, MySQL, PostgreSQL. Concepts and reasoning transfer 1:1." },
          { icon: "🏢", text: "MySQL is a **client-server** database (a running server your app connects to over the network). Great for production; overkill for learning syntax." },
        ],
      },
      {
        heading: "The differences that actually bite",
        bullets: [
          { icon: "🔗", text: "**Concatenate strings**: SQLite uses `first || ' ' || last`; MySQL uses `CONCAT(first, ' ', last)`." },
          { icon: "🕒", text: "**Current time**: SQLite `datetime('now')`; MySQL `NOW()`. Date functions differ most — covered in the Dates section later." },
          { icon: "🔢", text: "**Auto-numbering a key**: SQLite `INTEGER PRIMARY KEY` (or `AUTOINCREMENT`); MySQL `INT AUTO_INCREMENT`." },
          { icon: "📐", text: "**GROUP BY strictness**: MySQL (default) rejects selecting a non-aggregated column that isn't grouped; SQLite is lenient. Always list grouped columns explicitly and you're safe on both." },
        ],
      },
    ],
    keyFacts: [
      { label: "This course runs", value: "SQLite (WASM, in-browser)", icon: "🌐" },
      { label: "At work you'll see", value: "MySQL (client-server)", icon: "🏢" },
      { label: "Transfer rate", value: "~95% identical syntax", icon: "🔁" },
      { label: "Concat", value: "|| (SQLite) vs CONCAT (MySQL)", icon: "🔗" },
    ],
    quickReference: {
      title: "SQLite ⇄ MySQL cheat sheet",
      icon: "📝",
      bullets: [
        "Concat: `a || b`  ↔  `CONCAT(a, b)`",
        "Now: `datetime('now')`  ↔  `NOW()`",
        "Auto key: `INTEGER PRIMARY KEY`  ↔  `INT AUTO_INCREMENT`",
        "GROUP BY: SQLite lenient, MySQL strict — list grouped cols to be safe on both.",
        "SELECT / WHERE / JOIN / GROUP BY / HAVING / window fns / CTEs: identical.",
      ],
      analogyBrief:
        "SQLite and MySQL are two dialects of the same language — the grammar is shared, only a few idioms differ.",
    },
    explanation:
      "When you press Run in this course, your SQL executes against SQLite that has been compiled to WebAssembly and loaded into your browser tab, which means there is no server to install, no account to create, and no data leaving your computer — it is the fastest possible way to practice. In a job, the relational database you are most likely to encounter for analytics is MySQL (or its close cousins PostgreSQL and SQL Server), which are client-server systems: a database server runs somewhere, and tools like MySQL Workbench or a BI dashboard connect to it over the network. The reassuring news is that the SQL an analyst writes — SELECT, WHERE, JOIN in all its forms, GROUP BY, HAVING, ORDER BY, window functions like SUM() OVER and ROW_NUMBER(), and CTEs (WITH clauses) — is part of the shared standard and behaves the same across all of them, so the reasoning and roughly 95% of the exact syntax you learn here transfers directly. The differences that do exist are small and mostly cosmetic. String concatenation is the classic one: SQLite (and PostgreSQL) join strings with the || operator, while MySQL uses the CONCAT() function. Getting the current timestamp is datetime('now') in SQLite versus NOW() in MySQL, and date handling in general is the area that diverges the most, which is why this course devotes a dedicated Dates section to it later. Declaring an auto-incrementing primary key reads as INTEGER PRIMARY KEY in SQLite and INT AUTO_INCREMENT in MySQL. The one behavioral gotcha worth remembering is GROUP BY strictness: MySQL in its default configuration will reject a query that selects a column which is neither aggregated nor named in GROUP BY, whereas SQLite quietly allows it and returns an arbitrary value; the safe habit that works everywhere is to always list every non-aggregated column in your GROUP BY. Keep this cheat sheet handy, and the first time you open real MySQL at work, nothing will surprise you.",
    analogy:
      "Learning SQL on SQLite and then using MySQL at work is like learning to drive in one car and then driving another brand. The controls that matter — steering, brakes, accelerator, reading the road — are identical, so your skill transfers the moment you sit down. A few switches are in slightly different places: the wiper stalk is on the other side, the button to concatenate strings is labelled differently. You glance at the cheat sheet once, adjust, and drive off. Nobody re-learns to drive; they just find the wipers.",
    diagram: `<svg viewBox="0 0 720 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="SQLite in the browser versus MySQL client-server, with shared standard SQL">${svgDefs}
      ${box(30, 40, 200, 70, "SQLite (this course)", "runs in your browser (WASM)", "#38bdf8")}
      ${box(490, 40, 200, 70, "MySQL (at work)", "client → server over network", "#f59e0b")}
      <rect x="250" y="45" width="220" height="60" rx="8" fill="#132a1a" stroke="#22c55e"/>
      <text x="360" y="72" text-anchor="middle" fill="#22c55e" font-size="12" font-weight="700">Shared standard SQL</text>
      <text x="360" y="92" text-anchor="middle" fill="#8b949e" font-size="10">SELECT · JOIN · GROUP BY · windows · CTEs</text>
      <line x1="230" y1="75" x2="248" y2="75" stroke="#22c55e" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="490" y1="75" x2="472" y2="75" stroke="#22c55e" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="30" y="150" fill="#e6edf3" font-size="13" font-weight="700">The few idioms that differ</text>
      <rect x="30" y="165" width="660" height="90" rx="8" fill="#1a2332" stroke="#8b949e" stroke-dasharray="5 4"/>
      <text x="50" y="190" fill="#38bdf8" font-size="11" font-family="monospace">SQLite:  a || b   ·  datetime('now')  ·  INTEGER PRIMARY KEY</text>
      <text x="50" y="216" fill="#f59e0b" font-size="11" font-family="monospace">MySQL:   CONCAT(a,b) ·  NOW()          ·  INT AUTO_INCREMENT</text>
      <text x="50" y="242" fill="#8b949e" font-size="10">GROUP BY: MySQL strict, SQLite lenient — list grouped columns to be safe on both.</text>
    </svg>`,
    diagramLegend: [
      { color: "#38bdf8", label: "SQLite", description: "In-browser WASM engine used by this course — zero setup." },
      { color: "#22c55e", label: "Shared SQL", description: "The analyst's toolkit works identically across engines." },
      { color: "#f59e0b", label: "MySQL", description: "Client-server database common at work; a few idioms differ." },
    ],
    codeExample: {
      language: "sql",
      title: "SQLite string concat (|| ) — the MySQL note shows CONCAT",
      setup: CUSTOMERS_SEED,
      code: `-- SQLite way to build a label. MySQL: CONCAT(name, ' (', city, ')')
SELECT name || ' (' || city || ')' AS customer_label
FROM customers;`,
    },
    codeExamples: [
      {
        language: "sql",
        tab: "1 · Setup",
        title: "Load the customers table",
        code: `${CUSTOMERS_SEED}

SELECT * FROM customers;`,
      },
      {
        language: "sql",
        tab: "2 · Concept",
        title: "String concatenation — the SQLite way",
        setup: CUSTOMERS_SEED,
        code: `-- SQLite joins strings with ||
-- MySQL NOTE: the same result in MySQL is
--   SELECT CONCAT(name, ' (', city, ')') AS customer_label ...
SELECT name || ' (' || city || ')' AS customer_label
FROM customers;`,
      },
      {
        language: "sql",
        tab: "3 · Variation",
        title: "A calculated column both engines share",
        setup: CUSTOMERS_SEED,
        code: `-- Arithmetic and aliases are identical in SQLite and MySQL.
-- Show 10% of each credit limit as a suggested starter limit.
SELECT name, credit, credit * 0.10 AS starter_limit
FROM customers
ORDER BY credit DESC;`,
      },
    ],
    problemStatement:
      "A teammate wrote a report in this course using `name || ' ' || city` and it worked, but when they pasted it into MySQL Workbench at the office it errored. Explain what happened and rewrite the expression so it runs in MySQL, then name one other syntax difference they should watch for.",
    questions: [
      {
        difficulty: "easy",
        q: "What database engine actually runs your queries when you click Run in this course?",
        options: [
          "MySQL on a remote server",
          "SQLite compiled to WebAssembly, in your browser",
          "PostgreSQL in the cloud",
          "Excel's formula engine",
        ],
        answer: "B",
        explanation:
          "It's SQLite via WASM, fully client-side — no server, no signup, and your data never leaves the browser.",
      },
      {
        difficulty: "easy",
        q: "How do you concatenate two text columns in MySQL (as opposed to SQLite)?",
        options: [
          "col1 || col2",
          "CONCAT(col1, col2)",
          "col1 + col2",
          "MERGE(col1, col2)",
        ],
        answer: "B",
        explanation:
          "MySQL uses CONCAT(). SQLite (and PostgreSQL) use the || operator. This is the most common gotcha when moving queries.",
      },
      {
        difficulty: "easy",
        q: "Which of these does an analyst use identically across SQLite and MySQL?",
        options: [
          "String concatenation syntax",
          "The current-time function",
          "SELECT, JOIN, GROUP BY, HAVING, window functions and CTEs",
          "Auto-increment keyword",
        ],
        answer: "C",
        explanation:
          "The core analytical toolkit is shared standard SQL. Only a few idioms (concat, now, auto-increment) differ.",
      },
      {
        difficulty: "medium",
        q: "You select a non-aggregated column that isn't in GROUP BY. What's the safe habit for both engines?",
        options: [
          "Rely on SQLite's leniency and hope MySQL matches",
          "Always list every non-aggregated selected column in GROUP BY",
          "Never use GROUP BY",
          "Use SELECT * instead",
        ],
        answer: "B",
        explanation:
          "MySQL's default is strict and will reject it; SQLite is lenient. Listing grouped columns explicitly works everywhere.",
      },
      {
        difficulty: "medium",
        q: "You need the current timestamp in a query you'll run on MySQL at work. Which is correct there?",
        options: [
          "datetime('now')",
          "NOW()",
          "TODAY",
          "CURRENT",
        ],
        answer: "B",
        explanation:
          "MySQL uses NOW(); SQLite uses datetime('now'). Dates diverge the most between engines — there's a whole section on them later.",
      },
    ],
    tryIt: [
      {
        id: "sql-mysql-note-t1",
        difficulty: "easy",
        prompt:
          "Build one column that joins each customer's **name and city** as exactly `Acme Corp - Mumbai` (space-dash-space). Use the SQLite `||` operator.",
        hint: "`name || ' - ' || city`",
        setup: CUSTOMERS_SEED,
        starter: `SELECT name /* || ... */ AS label\nFROM customers;`,
        solution: `SELECT name || ' - ' || city AS label FROM customers;`,
      },
      {
        id: "sql-mysql-note-t2",
        difficulty: "easy",
        prompt:
          "Show each customer's **name** and a column that is **10% of their credit** (`credit * 0.10`).",
        setup: CUSTOMERS_SEED,
        starter: `SELECT name, /* credit * ... */ AS ten_pct\nFROM customers;`,
        solution: `SELECT name, credit * 0.10 AS ten_pct FROM customers;`,
      },
      {
        id: "sql-mysql-note-t3",
        difficulty: "easy",
        prompt:
          "Combine each customer's **name and segment** as exactly `Acme Corp (Enterprise)` using `||`.",
        hint: "You'll need three `||` joins and the literal '(' and ')'.",
        setup: CUSTOMERS_SEED,
        starter: `SELECT /* name || ... */ AS label\nFROM customers;`,
        solution: `SELECT name || ' (' || segment || ')' AS label FROM customers;`,
      },
      {
        id: "sql-mysql-note-t4",
        difficulty: "medium",
        prompt:
          "Show **name** and each customer's credit **increased by 5%** (`credit * 1.05`), with the **largest** increased value first.",
        hint: "You can ORDER BY the same expression you selected.",
        setup: CUSTOMERS_SEED,
        starter: `SELECT name, credit * 1.05 AS new_credit\nFROM customers\n/* ORDER BY ... */;`,
        solution: `SELECT name, credit * 1.05 AS new_credit FROM customers ORDER BY credit * 1.05 DESC;`,
        orderMatters: true,
      },
      {
        id: "sql-mysql-note-t5",
        difficulty: "medium",
        prompt:
          "Build a single label joining **name, segment and city** as exactly `Acme Corp — Enterprise — Mumbai` (using ` — ` as the separator).",
        hint: "Four values joined by ' — ' between each.",
        setup: CUSTOMERS_SEED,
        starter: `SELECT /* name || ' — ' || ... */ AS label\nFROM customers;`,
        solution: `SELECT name || ' — ' || segment || ' — ' || city AS label FROM customers;`,
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "sql-vs-excel",
    title: "SQL ⇄ Excel — Translating Skills You Already Have",
    shortLabel: "SQL vs Excel",
    section: "Foundations",
    domain: "Database",
    tldr:
      "You already think in spreadsheet operations, and each one has a direct SQL twin. Filtering rows is WHERE. A VLOOKUP that pulls data from another sheet is a JOIN. SUMIF / a PivotTable's totals are GROUP BY with SUM. Sorting is ORDER BY. This topic maps the four moves you use most in Excel onto the SQL that does the same job — so you're not learning from scratch, you're renaming skills you have. From here the course builds each of these into full sections.",
    subtopics: [
      {
        heading: "The four translations you'll use daily",
        bullets: [
          { icon: "🔎", text: "**Filter / AutoFilter → `WHERE`**: 'only paid orders' = `WHERE status = 'paid'`." },
          { icon: "🔗", text: "**VLOOKUP / XLOOKUP → `JOIN`**: pulling a customer's name onto the orders sheet = joining orders to customers on the id." },
          { icon: "➕", text: "**SUMIF / COUNTIF / PivotTable → `GROUP BY` + `SUM`/`COUNT`**: 'revenue per city' = group by city, sum the amount." },
          { icon: "↕️", text: "**Sort → `ORDER BY`**: 'largest first' = `ORDER BY amount DESC`." },
        ],
      },
      {
        heading: "Why the SQL version is better at work",
        bullets: [
          { icon: "🔁", text: "A saved query re-runs the identical report every period — no dragging formulas down a new file each month." },
          { icon: "🧮", text: "It works on millions of rows without the file freezing, and multiple people can run it at once." },
          { icon: "🧾", text: "The query *is* the documentation: anyone can read exactly how the number was produced." },
        ],
      },
    ],
    keyFacts: [
      { label: "Filter", value: "AutoFilter → WHERE", icon: "🔎" },
      { label: "Lookup", value: "VLOOKUP → JOIN", icon: "🔗" },
      { label: "Totals", value: "SUMIF / Pivot → GROUP BY", icon: "➕" },
      { label: "Sort", value: "Sort → ORDER BY", icon: "↕️" },
    ],
    quickReference: {
      title: "Excel → SQL dictionary",
      icon: "📖",
      bullets: [
        "AutoFilter → `WHERE condition`",
        "VLOOKUP / XLOOKUP → `JOIN … ON key = key`",
        "SUMIF / COUNTIF → `GROUP BY x` + `SUM()` / `COUNT()`",
        "PivotTable → `GROUP BY` (rows) + aggregates (values)",
        "Sort A→Z / Z→A → `ORDER BY col` / `ORDER BY col DESC`",
      ],
      analogyBrief:
        "SQL isn't a new skill — it's your Excel muscle memory written as sentences instead of clicks.",
    },
    explanation:
      "If you have ever built a PivotTable or written a VLOOKUP, you already understand what SQL does — you just express it differently, and seeing the one-to-one mapping removes most of the fear of a new language. Start with filtering: the AutoFilter you click in Excel to show 'only paid orders' is exactly a WHERE clause, WHERE status = 'paid', which keeps only the rows that match a condition. Next, the VLOOKUP or XLOOKUP you use to reach into another sheet and pull back a matching value — say, putting each order's customer name next to the order — is a JOIN, which links two tables on a shared key (orders.customer_id matching customers.id) and lets you select columns from both as if they were one sheet. The workhorse of analysis, SUMIF and COUNTIF and ultimately the PivotTable, maps onto GROUP BY together with an aggregate function: 'total revenue per city' is GROUP BY city with SUM(amount), where the thing you drag into a PivotTable's Rows area becomes the GROUP BY column and the thing you drop into Values becomes the SUM or COUNT. Sorting a column ascending or descending is simply ORDER BY, with DESC for largest-first. The reason analysts and finance teams increasingly reach for SQL over Excel is not that Excel is wrong but that the SQL versions are repeatable, scalable, and self-documenting: a saved query regenerates the same monthly report with a single click, runs over millions of rows without the file choking, can be run by many people at once, and reads as an explicit record of exactly how a number was calculated — no hidden cell references to hunt down. Every translation introduced here becomes a full section later in the course, so treat this topic as the map: WHERE, JOIN, and GROUP BY are the three destinations you're heading toward.",
    analogy:
      "Moving from Excel to SQL is like a cook who has always followed recipes by eye now writing them down. The dishes are the same — a filter is still a filter, a lookup is still a lookup, a total is still a total — but instead of clicking through menus and dragging formulas each time, the cook writes one clear recipe card (the query) that any colleague can follow to get the identical dish, for one diner or for a thousand, this week and next quarter. The skill was never the clicking; it was knowing which ingredient goes where. SQL just captures that knowledge in a form that scales and doesn't smudge.",
    diagram: `<svg viewBox="0 0 720 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Excel operations mapped to their SQL equivalents">${svgDefs}
      <text x="140" y="28" text-anchor="middle" fill="#22c55e" font-size="13" font-weight="700">Excel move</text>
      <text x="560" y="28" text-anchor="middle" fill="#38bdf8" font-size="13" font-weight="700">SQL equivalent</text>
      ${box(30, 45, 220, 40, "AutoFilter", "show matching rows", "#22c55e")}
      ${box(470, 45, 220, 40, "WHERE", "condition", "#38bdf8")}
      ${box(30, 100, 220, 40, "VLOOKUP / XLOOKUP", "pull from another sheet", "#22c55e")}
      ${box(470, 100, 220, 40, "JOIN … ON", "link tables by key", "#38bdf8")}
      ${box(30, 155, 220, 40, "SUMIF / PivotTable", "totals by category", "#22c55e")}
      ${box(470, 155, 220, 40, "GROUP BY + SUM()", "aggregate per group", "#38bdf8")}
      ${box(30, 210, 220, 40, "Sort A→Z / Z→A", "reorder rows", "#22c55e")}
      ${box(470, 210, 220, 40, "ORDER BY [DESC]", "sort result", "#38bdf8")}
      <line x1="250" y1="65"  x2="468" y2="65"  stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="250" y1="120" x2="468" y2="120" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="250" y1="175" x2="468" y2="175" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="250" y1="230" x2="468" y2="230" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
    </svg>`,
    diagramLegend: [
      { color: "#22c55e", label: "Excel operation", description: "The spreadsheet move you already know." },
      { color: "#38bdf8", label: "SQL equivalent", description: "The clause that does the same job — repeatable and scalable." },
      { color: "#ff9900", label: "Same intent", description: "Each pair produces the same business answer." },
    ],
    codeExample: {
      language: "sql",
      title: "SUMIF/PivotTable → GROUP BY: revenue per city",
      setup: ORDERS_SEED,
      code: `-- Excel: a PivotTable with City in Rows and SUM(amount) in Values.
SELECT c.city, SUM(o.amount) AS revenue
FROM orders o
JOIN customers c ON c.id = o.customer_id
WHERE o.status = 'paid'
GROUP BY c.city
ORDER BY revenue DESC;`,
    },
    codeExamples: [
      {
        language: "sql",
        tab: "1 · Setup",
        title: "Load customers + orders",
        code: `${ORDERS_SEED}

SELECT * FROM orders;`,
      },
      {
        language: "sql",
        tab: "2 · Concept (WHERE)",
        title: "AutoFilter → WHERE",
        setup: ORDERS_SEED,
        code: `-- Excel AutoFilter: "status = paid". In SQL that's WHERE.
SELECT id, customer_id, amount
FROM orders
WHERE status = 'paid';`,
      },
      {
        language: "sql",
        tab: "3 · Variation (JOIN + GROUP BY)",
        title: "VLOOKUP → JOIN, PivotTable → GROUP BY",
        setup: ORDERS_SEED,
        code: `-- VLOOKUP the customer's city onto each order (JOIN),
-- then total revenue per city (PivotTable → GROUP BY + SUM).
SELECT c.city, SUM(o.amount) AS revenue
FROM orders o
JOIN customers c ON c.id = o.customer_id
WHERE o.status = 'paid'
GROUP BY c.city
ORDER BY revenue DESC;`,
      },
    ],
    problemStatement:
      "Your team currently rebuilds a 'revenue by city' PivotTable in a fresh Excel file every month, and last month someone dragged a formula one row short and understated a region. Show the single SQL query that replaces this PivotTable, and explain two concrete reasons the query is safer than the monthly spreadsheet.",
    questions: [
      {
        difficulty: "easy",
        q: "The Excel AutoFilter 'show only paid orders' translates to:",
        options: [
          "GROUP BY status",
          "ORDER BY status",
          "WHERE status = 'paid'",
          "SELECT status",
        ],
        answer: "C",
        explanation:
          "WHERE keeps only the rows meeting a condition — the same job as an AutoFilter.",
      },
      {
        difficulty: "easy",
        q: "An Excel VLOOKUP that pulls a value from another sheet is most like which SQL operation?",
        options: ["WHERE", "JOIN", "ORDER BY", "DISTINCT"],
        answer: "B",
        explanation:
          "A JOIN links two tables on a shared key and lets you use columns from both — exactly what VLOOKUP/XLOOKUP does across sheets.",
      },
      {
        difficulty: "easy",
        q: "You want 'total revenue per city'. Which SQL pairing matches a PivotTable's rows + values?",
        options: [
          "WHERE + ORDER BY",
          "GROUP BY city + SUM(amount)",
          "DISTINCT city",
          "JOIN only",
        ],
        answer: "B",
        explanation:
          "The Pivot Rows field becomes GROUP BY; the Values field becomes an aggregate like SUM(). Together they total per group.",
      },
      {
        difficulty: "medium",
        q: "A COUNTIF that counts orders per status maps most directly to:",
        options: [
          "SELECT COUNT(*) FROM orders",
          "GROUP BY status with COUNT(*)",
          "WHERE status = 'paid'",
          "ORDER BY status",
        ],
        answer: "B",
        explanation:
          "COUNTIF-by-category is GROUP BY the category + COUNT(*). One output row per distinct status, with its count.",
      },
      {
        difficulty: "medium",
        q: "Which is a genuine business advantage of the SQL report over the monthly PivotTable?",
        options: [
          "It uses more colors",
          "A saved query re-runs identically, scales to millions of rows, and documents the calculation",
          "It hides how the number was computed",
          "It only works for fewer than 100 rows",
        ],
        answer: "B",
        explanation:
          "Repeatability, scale, multi-user access, and self-documentation are why analytics teams move recurring reports to SQL.",
      },
    ],
    tryIt: [
      {
        id: "sql-vs-excel-t1",
        difficulty: "easy",
        prompt:
          "AutoFilter → WHERE: show **all columns** of only the orders whose **status is 'paid'**.",
        hint: "Text values go in single quotes: `status = 'paid'`.",
        setup: ORDERS_SEED,
        starter: `SELECT *\nFROM orders\n/* WHERE ... */;`,
        solution: `SELECT * FROM orders WHERE status = 'paid';`,
      },
      {
        id: "sql-vs-excel-t2",
        difficulty: "easy",
        prompt:
          "Show **all columns** of orders with an **amount greater than 5000**.",
        setup: ORDERS_SEED,
        starter: `SELECT *\nFROM orders\nWHERE /* ... */;`,
        solution: `SELECT * FROM orders WHERE amount > 5000;`,
      },
      {
        id: "sql-vs-excel-t3",
        difficulty: "easy",
        prompt:
          "COUNTIF → GROUP BY: count **how many orders** exist for **each status**. Show the status and a `num_orders` count.",
        hint: "GROUP BY status, then COUNT(*).",
        setup: ORDERS_SEED,
        starter: `SELECT status, /* COUNT(*) AS num_orders */\nFROM orders\n/* GROUP BY ... */;`,
        solution: `SELECT status, COUNT(*) AS num_orders FROM orders GROUP BY status;`,
      },
      {
        id: "sql-vs-excel-t4",
        difficulty: "medium",
        prompt:
          "PivotTable → JOIN + GROUP BY: total **revenue per city** for **paid** orders only, **largest first**. (Join orders to customers, sum the amount per city.)",
        hint: "JOIN customers ON c.id = o.customer_id, filter WHERE o.status='paid', GROUP BY c.city.",
        setup: ORDERS_SEED,
        starter: `SELECT c.city, SUM(o.amount) AS revenue\nFROM orders o\nJOIN customers c ON c.id = o.customer_id\n/* WHERE ... GROUP BY ... ORDER BY ... */;`,
        solution: `SELECT c.city, SUM(o.amount) AS revenue FROM orders o JOIN customers c ON c.id = o.customer_id WHERE o.status = 'paid' GROUP BY c.city ORDER BY revenue DESC;`,
        orderMatters: true,
      },
      {
        id: "sql-vs-excel-t5",
        difficulty: "medium",
        prompt:
          "For **each customer name**, show their **total order amount** across all statuses, **highest total first**.",
        hint: "JOIN, GROUP BY c.name, SUM(o.amount), ORDER BY the total DESC.",
        setup: ORDERS_SEED,
        starter: `SELECT c.name, SUM(o.amount) AS total\nFROM orders o\nJOIN customers c ON c.id = o.customer_id\n/* GROUP BY ... ORDER BY ... */;`,
        solution: `SELECT c.name, SUM(o.amount) AS total FROM orders o JOIN customers c ON c.id = o.customer_id GROUP BY c.name ORDER BY total DESC;`,
        orderMatters: true,
      },
    ],
  },
];
