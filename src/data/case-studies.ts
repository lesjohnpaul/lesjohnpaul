// Case studies for every project in portfolio-data.ts, keyed by slug(title).
// Grounded in portfolio-data and the project repos (READMEs and docs). No invented metrics:
// test and plan numbers are labeled as such. Client names, internal system names, and
// infrastructure details stay anonymized.

export type CaseStudy = {
  slug: string; // slugify(project.title): lowercase, non-alphanumerics → "-", trimmed
  client: string; // anonymized, e.g. "250K-member electric cooperative" or "Own product"
  role: string; // e.g. "Solo architect & full-stack engineer"
  summary: string; // 1–2 sentences, the elevator pitch
  headline?: string; // one punchy line for hiring managers and buyers
  scale?: string[]; // sourced scale and complexity facts
  challenge: string[]; // the business problem in the client's terms
  approach: string[]; // key decisions and why
  built: string[]; // 3–6 bullet summary of what was delivered
  capabilities?: { group: string; items: string[] }[]; // full feature inventory, grouped
  architecture?: string[]; // components and data flow
  engineering?: string[]; // testing, performance, security, reliability, migrations
  outcome: string[]; // results ONLY if sourced; else qualitative, verifiable statements
  aiAngle?: string; // where AI or automation does the work, only if true
  status: "Live" | "In production" | "In build" | "Prototype" | "Design";
};

const list: CaseStudy[] = [
  {
    slug: "sneaker-symphony-ai-run-marketplace",
    client: "Own product",
    role: "Founder & solo full-stack engineer",
    summary:
      "A Philippine sneaker marketplace at sneakersymphony.com, built and run by one person. Catalog import and social content run on automation, so the store does not need a team.",
    headline: "A full online store that one person runs, because scrapers fill the catalog and Claude writes the posts.",
    challenge: [
      "A full online store normally needs staff for product entry, pricing, and social posting.",
      "Supplier catalogs list hundreds of items with photos and Chinese-yuan prices that have to be cleaned up before they can be sold.",
      "Filipino buyers expect GCash, Maya, and card payments on a phone.",
    ],
    approach: [
      "Import pipelines scrape supplier catalogs into a review queue, so nothing reaches the store without an admin check.",
      "Each supplier source gets its own importer and table, sharing only the storage and catalog plumbing, so a new source cannot break a working one.",
      "Dual payment gateways (PayMongo and HitPay) with idempotency safeguards, so a retried payment never charges twice.",
    ],
    built: [
      "Scrape-to-catalog import from supplier stores, with images copied to Cloudflare R2",
      "Review queue with one-by-one and bulk import into the catalog",
      "Claude API content pipeline that writes and schedules posts for FB, IG, and TikTok",
      "Mobile-first checkout with GCash, Maya, and card payments",
      "Invoice storage on Cloudflare R2 and buyer emails through Amazon SES",
    ],
    capabilities: [
      {
        group: "Catalog automation",
        items: [
          "Supplier catalog scrapers with a per-source importer",
          "Admin review queue with single and bulk import",
          "Tiered price suggestions and bulk pricing for unpriced items",
        ],
      },
      {
        group: "Content and growth",
        items: [
          "Claude API pipeline that drafts social posts",
          "Scheduled posting to FB, IG, and TikTok",
          "Growth engine PRD with a 14-section architecture",
        ],
      },
      {
        group: "Commerce",
        items: [
          "Mobile-first checkout with GCash, Maya, and cards",
          "PayMongo and HitPay with idempotency safeguards",
          "Invoices on Cloudflare R2, buyer email through Amazon SES",
        ],
      },
    ],
    architecture: [
      "Next.js 16 on Vercel, with Supabase for data and auth.",
      "Inngest for background jobs.",
      "Cloudflare R2 holds product images and invoices; Amazon SES sends buyer email.",
    ],
    engineering: [
      "Schema changes ship as versioned SQL migrations through Drizzle ORM, so every database change is reviewable and repeatable.",
      "Checkout and admin forms are validated with Zod schemas before anything is written.",
      "PayMongo and HitPay payments carry idempotency safeguards, so a retried payment never charges twice.",
      "Each supplier importer is isolated in its own table, and scraped items wait in an admin review queue before they reach the store.",
      "Vercel Analytics and Speed Insights track real-user traffic and page performance in production.",
    ],
    outcome: [
      "Catalog import and social content run on automation, so one person can operate a full store.",
      "Live at sneakersymphony.com.",
    ],
    aiAngle:
      "Claude writes and schedules the social posts, and scrapers fill the catalog, leaving the owner to review and approve.",
    status: "Live",
  },
  {
    slug: "wecare-pharmacy-pos-dispensing-platform",
    client: "Multi-branch pharmacy and clinic operator",
    role: "Solo architect & full-stack engineer",
    summary:
      "A multi-tenant operations platform for a multi-branch pharmacy and clinic operator: point-of-sale dispensing, PhilHealth benefit dispensing and claims, inventory, and live executive dashboards across every branch.",
    headline: "Every branch on one live system, with each tenant's data walled off in the database and the owner watching it all from a phone.",
    scale: [
      "Live in production since August 2026 for a multi-branch pharmacy network",
      "85 database migrations, all applied through version control",
      "66 SQL functions and RPCs hold the business rules",
      "5 user roles, branch-scoped by row-level security",
      "14 unit-test suites; 260+ commits since June 2026",
      "Stock-value ledger load-tested at 10× production volume: 143 ms worst case",
    ],
    challenge: [
      "The owner could not see stock value, near-expiry batches, or items about to run out per branch until it was too late.",
      "PhilHealth claims that are late or incomplete get denied, and the filing window closes after 60 days.",
      "Receipts had to meet BIR rules for the POS to be accredited.",
      "One platform had to serve many branches, and many pharmacy groups, without anyone seeing another's data.",
    ],
    approach: [
      "The database is the security boundary: row-level security on every table, with tenant and branch scope taken from the signed-in user, so a hand-crafted API call still sees nothing it should not.",
      "Money-moving operations (sales, dispenses, stock receipts, voids) are single Postgres functions that check role, module, and stock in one transaction.",
      "Business rules live once in SQL: FEFO batch selection, the annual benefit cap, receipt numbering, and stock valuation. Every screen, export, and alert reads the same numbers.",
      "Executive views call purpose-built server-side aggregates instead of downloading raw rows.",
    ],
    built: [
      "Touch-first dispensing POS with FEFO batches, Rx and SC/PWD pricing, and BIR receipts",
      "PhilHealth benefit dispensing with ID and remaining-benefit checks, signatures, and claim slips",
      "Inventory, expiry, replenishment, branch transfers, and purchase orders",
      "Executive Command Center and Stock Value ledger across all branches",
      "Vendor console that provisions tenants, branches, users, modules, and monthly billing",
    ],
    capabilities: [
      {
        group: "Point of sale",
        items: [
          "Touch-first cart with live stock per item",
          "Regular, Senior, and PWD pricing with Rx flags",
          "Receipts, X readings, Z close, SC/PWD discount books, voids, and reprints following BIR RMO 24-2023",
          "Thermal receipt printing",
        ],
      },
      {
        group: "PhilHealth benefit dispensing",
        items: [
          "12-digit PhilHealth ID check and remaining annual benefit at the counter",
          "Prescriber auto-suggest, signatures, and a claim slip per dispense",
          "Dispense records with status, encoder, cost, and margin",
          "Claims assembled against the 60-day filing deadline",
        ],
      },
      {
        group: "Inventory",
        items: [
          "Live stock value at cost and retail, with batches and reorder points",
          "Expiry view of batches within 90 days, soonest first (FEFO)",
          "Replenishment with per-branch picking lists and Excel export",
          "Branch transfers and purchase orders",
          "Low-stock and near-expiry push alerts every morning at 8 AM",
        ],
      },
      {
        group: "Executive dashboards",
        items: [
          "Command Center: today's sales, transactions, VAT, low stock, and near-expiry across every branch",
          "Stock valued three ways: PhilHealth price, store price, and supplier cost",
          "Stock Value ledger reconciling opening, receipts, sales, dispenses, adjustments, and closing, day by day",
          "30-day sales trends and product mix per branch",
          "Branded PDF, Excel, and CSV exports for the board",
        ],
      },
      {
        group: "Multi-tenant SaaS",
        items: [
          "Vendor console to provision tenants, branches, and users",
          "Module flags per tenant and per branch",
          "Monthly billing statements by email",
        ],
      },
      {
        group: "Security and roles",
        items: [
          "5 roles: Pharmacist, Manager, Owner, CEO, Vendor",
          "Row-level security on every table",
          "Installable PWA with an offline shell",
        ],
      },
    ],
    architecture: [
      "React 19 and TypeScript PWA hosted on Cloudflare Pages.",
      "Supabase Postgres with row-level security, RPC functions, Auth, Realtime for live stock, and Storage for signatures and claim proof.",
      "Edge Functions handle user provisioning, billing statements, and push digests; pg_cron schedules the 8 AM digest and monthly billing.",
      "Web Push for alerts, transactional email for statements, and a local print bridge for thermal receipts.",
    ],
    engineering: [
      "Tenant isolation is tested, not assumed: a two-tenant matrix checks that one tenant sees zero rows of another on every table and role.",
      "Valuation, reconciliation, replenishment, billing, and Excel export are pure TypeScript modules with unit tests, shared by the UI and the exports.",
      "Stock-value ledger load-tested at 10× production volume, 143 ms worst case.",
      "CI runs lint, type-check, and tests; a pre-deploy guard blocks any build missing its production environment.",
    ],
    outcome: [
      "Live in production since August 2026.",
      "The operator runs every branch from one platform, with data isolated per tenant and a live CEO view.",
    ],
    aiAngle:
      "Scheduled automation does the watching: low-stock and near-expiry alerts arrive every morning, and claims are assembled from the dispense record instead of paper.",
    status: "Live",
  },
  {
    slug: "ai-assisted-refund-automation",
    client: "250K-member electric cooperative",
    role: "Solo architect & engineer",
    summary:
      "Automates a utility's daily refund and payment-correction approval queue across two legacy systems. Deterministic recipes decide, Claude explains the flagged cases, and a human confirms every action.",
    headline: "An LLM reads the messy cases and explains them in plain Taglish, while deterministic rules and a human keep sole authority over money.",
    scale: [
      "The queue had a 76-item backlog when the project started",
      "538 pytest tests across the pipeline, recipes, API, auth, and reports",
      "7 request types, each its own recipe module",
      "Spans two legacy systems with no API: a workflow app and the billing and collections system",
    ],
    challenge: [
      "Every refund or correction meant reading a request, cross-checking the receipt against the ledger in one system, changing the ledger by hand, then approving in another.",
      "Each manual step was a chance to post money to the wrong account.",
      "Unusual cases sat in the queue with no explanation of what was wrong.",
    ],
    approach: [
      "Staged autonomy: analyze, decide, human confirm, then execute. Nothing touches the ledger without the confirm gate.",
      "Approvals need positive evidence: receipt number, date, and amount must all match the ledger rows.",
      "The AI is advisory only. It runs with read-only tools, answers in a fixed JSON schema, and never writes or approves.",
      "AI notes are cached per case and capped per run, and an AI failure never fails the batch.",
    ],
    built: [
      "Daily analyze run that classifies each request and returns approve, skip, or revert with a reason",
      "Per-type recipes that execute in one transaction with a saved reverse script",
      "AI analyst notes on every flagged item, plus \"Plan with AI\" and \"Execute with AI\"",
      "Operator dashboard with the why, the planned writes, and the confirm button",
      "Accomplishment and audit reports emailed as PDF, Word, Excel, or CSV",
    ],
    capabilities: [
      {
        group: "Pipeline",
        items: [
          "Analyze: pulls the live approver queue and enriches each request with the ledger rows it refers to",
          "Decide: a recipe per request type returns approve (with an exact ledger plan), skip, or revert",
          "Confirm: a person reviews the evidence before anything runs",
          "Execute: re-checks live state, skips anything stale, writes in one transaction, and forwards the item to the next approver",
        ],
      },
      {
        group: "AI analyst",
        items: [
          "Headless Claude session per flagged item, read-only tools, fixed JSON schema",
          "Category, a 2 to 4 sentence Taglish explanation, a suggested field fix, the closest recipe, next action, and confidence",
          "Reads the requester's remarks and the full approval trail, and lists conflicts between remarks and records",
          "Recommends an execute path, or one yes/no question whose answer would automate the whole class of case",
        ],
      },
      {
        group: "Plan and Execute with AI",
        items: [
          "A suggested field fix becomes an in-memory override; the source record is never edited",
          "The same deterministic handler re-decides with the corrected input and shows the exact planned writes",
          "Executes only if the rules now approve, through the standard executor with a reverse script",
        ],
      },
      {
        group: "Request types",
        items: [
          "Standard refund and deposit refund",
          "Wrong-account correction and intended-month posting",
          "Receipt cancellation and collection-detail re-tag",
          "Details-list actions",
        ],
      },
      {
        group: "Safety and audit",
        items: [
          "Per-run item and peso caps",
          "Stale-state re-check before every write",
          "Full SQL audit trail and auto-generated reverse scripts",
          "Kill switch (an ARMED toggle)",
        ],
      },
      {
        group: "Dashboard and reports",
        items: [
          "Overview, pending review, live activity console, and run history",
          "Reports in PDF, Word, Excel, or CSV, emailed to saved recipients",
          "Responsive down to phone width",
        ],
      },
    ],
    architecture: [
      "Python pipeline: fetch, enrich, classify, decide, execute, with one module per request type.",
      "FastAPI serves the API and a React 19 dashboard built into one self-contained HTML file, so deployment is copying a folder.",
      "SQL Server for both legacy systems, plus a separate decision and audit database.",
      "Claude Code runs headless in the repository, so each session starts with the project memory and recipe docs in context.",
    ],
    engineering: [
      "Reverse-engineered a legacy platform with no API or docs: decoded program exports, binary date encodings, and code tables, then traced real operator sessions to learn which rows each screen writes.",
      "Every write recipe is backed by one of those traces.",
      "538 pytest tests across the pipeline, recipes, API, auth, and reports.",
      "scrypt password hashing, login throttling and lockout, CSRF tokens, role-gated admin pages, and a settings change log.",
      "AI notes are cached by a hash of the reason, remarks, and approval trail, so a case is only re-asked when something new is said about it.",
    ],
    outcome: [
      "A manual daily approval queue becomes dry-run, AI-explained, human-confirmed actions.",
      "Every executed change has an audit record and a reverse script.",
    ],
    aiAngle:
      "Claude reads each flagged case read-only, explains what went wrong in plain Taglish, and suggests the fix, while deterministic rules and a human make every decision.",
    status: "In production",
  },
  {
    slug: "acirs-24-7-ai-customer-support",
    client: "250K-member electric cooperative",
    role: "Solo architect & engineer",
    summary:
      "An AI customer-support system that answers members around the clock from the company knowledge base, hands off to the right department, and builds a customer record from every conversation.",
    headline: "Every member inquiry gets an answer at 3 a.m., and every conversation fills the CRM by itself.",
    challenge: [
      "Members ask questions at all hours, and after-hours inquiries wait until the next business day.",
      "Inquiries arrive on several channels, and each one starts from zero with no customer history.",
      "Some questions need a person, and they have to reach the right department.",
    ],
    approach: [
      "Answers are grounded in the company's own knowledge base, not general web knowledge.",
      "Auto-escalation to the right department when a human is needed, instead of the bot guessing.",
      "Every interaction feeds a Customer-360 record, so the CRM fills itself.",
    ],
    built: [
      "Knowledge-base chatbot for web chat, social, Viber, and Telegram",
      "Escalation routing to the right department",
      "Automatic Customer-360 record built from each interaction",
    ],
    capabilities: [
      {
        group: "AI agent",
        items: [
          "LLM agent that answers from the knowledge base",
          "Decides when to hand off to a human",
        ],
      },
      {
        group: "Channels",
        items: ["Web chat", "Social", "Viber", "Telegram"],
      },
      {
        group: "Customer 360",
        items: [
          "A customer record built from every interaction",
          "History carried across channels",
        ],
      },
    ],
    architecture: [
      "An LLM agent sits behind one conversation service that web chat, social, Viber, and Telegram all feed into.",
      "Answers are retrieved from the company knowledge base, so the agent replies from the cooperative's own content.",
      "An escalation step routes conversations that need a person to the right department's queue.",
      "Each interaction is written to a Customer-360 record, so history carries across channels.",
    ],
    engineering: [
      "Planned guardrail: the agent answers only from the knowledge base and hands off instead of guessing.",
      "Escalation rules are designed to be explicit and testable, not left to the model's judgment alone.",
      "Every conversation is planned to be logged against the customer record for audit and review.",
      "Channel adapters are designed to be separate, so adding or changing a channel does not touch the agent.",
    ],
    outcome: [
      "Designed so every inquiry gets an answer, even at 3 a.m.",
      "In build, launching Q1 2027.",
    ],
    aiAngle:
      "An LLM agent answers from the knowledge base and decides when to hand off to a human department.",
    status: "In build",
  },
  {
    slug: "tax-compliance-automation",
    client: "250K-member electric cooperative",
    role: "Solo engineer",
    summary:
      "Regulatory tax compliance reporting that took the compliance team two weeks is now a two-click run that finishes in under 5 minutes.",
    headline: "Two weeks of manual compliance work became two clicks and under 5 minutes.",
    challenge: [
      "Building the regulated reports took two weeks of manual work each cycle.",
      "Copying figures by hand into the reports risked transcription errors in filings.",
    ],
    approach: [
      "Pull the figures straight from the billing database so no one retypes a number.",
      "Generate the regulated PDFs directly, so the output is the filing.",
    ],
    built: [
      "Two-click run that pulls the data from MS SQL Server",
      "Automatic generation of the regulated PDF reports",
      "No manual transcription step anywhere in the process",
    ],
    architecture: [
      "The run reads the source figures directly from MS SQL Server.",
      "A generation step turns those figures into the regulated PDF reports.",
      "Staff start the whole process with two clicks; no figure is copied by hand in between.",
    ],
    engineering: [
      "Removing manual transcription removes the main source of filing errors.",
      "The data pull is read-only, so producing a report cannot change the billing records.",
      "The same run produces the same report from the same data, so a filing can be regenerated on demand.",
    ],
    outcome: ["2 weeks of manual work → under 5 minutes, two clicks."],
    aiAngle: "Automation replaces the manual data pull and report building end to end.",
    status: "In production",
  },
  {
    slug: "enterprise-it-service-management-platform",
    client: "Electric cooperative with about 300 employees across 12 offices",
    role: "Solo architect & full-stack engineer",
    summary:
      "The help desk, asset register, maintenance shop, and IT room wallboard for an electric cooperative, built from scratch to replace phone calls, walk-ins, paper forms, and spreadsheets.",
    headline: "One platform replaced phone calls, paper forms, and spreadsheets for about 300 staff across 12 offices.",
    scale: [
      "About 300 employees across 12 offices",
      "20 modules across service desk, assets and maintenance, and platform",
      "Load-tested at 300 simultaneous requests with no duplicate ticket or form numbers",
      "Scale-tested with 100,000 closed tickets in the table",
      "1,200+ commits, 38 hand-written SQL migrations, 430+ test files",
      "450+ visual baselines in light and dark",
    ],
    challenge: [
      "IT requests came by phone, walk-in, and paper, and they got lost.",
      "Nobody could say for sure who held which computer.",
      "The paper approval chain (supervisor, department manager, general manager) left no trail.",
    ],
    approach: [
      "Crash-safe by design: each write is one short SQL transaction, and emails and notifications go into an outbox in the same transaction, so a crash never loses or duplicates one.",
      "Every create carries an idempotency key, so a retry after a timeout replays the stored answer instead of filing a second ticket.",
      "One server with no Redis or message broker; reports run in their own worker so they never slow the help desk.",
      "Build what gets used: enterprise features that would sit empty for a 300-person cooperative were deliberately left out.",
    ],
    built: [
      "Help desk with a business-hours SLA engine: warning at 75%, breach at 100%, then automatic escalation",
      "QR asset register with signed custody receipts that print like the official paper forms",
      "Maintenance shop with repair requests, work orders, and preventive maintenance cycles",
      "Report Center with 12 reports in 4 formats, on schedules",
      "Installable mobile PWA and a 9-page TV wallboard for the IT room",
    ],
    capabilities: [
      {
        group: "Help desk",
        items: [
          "Crash-safe ticket filing with 8 statuses and year-based ticket numbers from a SQL sequence",
          "Category tree and claim rules by priority",
          "Queue with saved filters and bulk actions, plus a kanban board ordered by SLA risk",
          "Per-ticket chat with replies, reactions, attachments, unsend, and drafts",
          "Employees confirm or reject the fix; reminder after 2 days, auto-close after 5",
          "File a ticket by scanning the QR sticker on a broken device",
        ],
      },
      {
        group: "SLA engine",
        items: [
          "Business clock from 8am to 5pm on working days, holiday aware",
          "Pauses while a ticket waits for approval",
          "Targets by priority, from 1 hour response and 4 hour resolution for critical to 24 hours and 5 days for low",
          "Warning at 75%, breach at 100%, escalation 60 business minutes after a critical or high breach",
          "The SLA worker reads only due rows under a 5-minute lease, never the whole ticket table",
        ],
      },
      {
        group: "Approvals",
        items: [
          "One-click email endorsement",
          "3-level change approval chain",
          "System modification and system access request forms",
        ],
      },
      {
        group: "Assets and custody",
        items: [
          "Asset register with QR tags, custodian, status, location, and condition",
          "Memorandum of Receipt, return and transfer slips, and an annual custody register",
          "Compliance rule: every desk worker holds a computer, monitor, and UPS, with a daily exceptions digest",
          "Import Center with three Excel templates that round-trip as exports",
          "My Assets view for employees, with warranty status",
        ],
      },
      {
        group: "Maintenance",
        items: [
          "Request for Repair from any held device, work orders, and technician slots",
          "Semi-annual preventive maintenance trips with a checklist and compliance report",
          "KPIs: MTTR, MTBF, first-time fix, preventive vs reactive, downtime",
        ],
      },
      {
        group: "Knowledge and engagement",
        items: [
          "\"Ask Aytie\" help search that suggests articles while an employee is still typing the ticket",
          "Known issues board with \"I'm affected too\" and deflection counts",
          "Quarterly pulse survey with NPS and a CSAT report",
          "Monthly IT hero badges for top rated, on time, and most thanked technicians",
        ],
      },
      {
        group: "Reports and insights",
        items: [
          "12 reports in PDF, Excel, CSV, and Word",
          "Cron schedules on Manila time, templates, and history",
          "Signed sign-off page on every major report",
          "IT operations dashboard with 10+ widgets and an arrival heatmap",
          "9 printed forms where every field maps to a database column",
        ],
      },
      {
        group: "TV command center",
        items: [
          "9 rotating 1080p pages built to be read from 3 to 5 metres",
          "Urgent now, Unclaimed, Queue pulse, Today vs trend, Team load, Hot categories, Maintenance, All open tickets",
          "Command Center: a live 3D SLA radar where breached tickets rise as red beams",
          "New critical tickets and breaches interrupt with a full-screen bulletin and a chime",
          "Off-hours mode after 5pm shows critical tickets only; wall TVs pair once with a revocable link",
        ],
      },
      {
        group: "Mobile",
        items: [
          "Installable PWA with a bottom tab bar and bottom sheets",
          "One-tap quick actions and a QR asset scanner",
          "Technicians work the queue from the phone",
          "Every screen tested at 375 px in light and dark",
        ],
      },
      {
        group: "Security and admin",
        items: [
          "8 roles on one resource.action.scope permission map, checked for drift at startup",
          "Self-registration with an emailed code, lockout, and rate limits",
          "In-app notifications over Socket.IO with quiet hours and digest mode",
          "Full audit log and HMAC-verified digital signatures with tamper alerts",
        ],
      },
    ],
    architecture: [
      "Desktop browsers, the phone PWA, and the IT room TV call one Node, TypeScript, and Express API over HTTPS with JWT.",
      "Each write commits the row, the outbox entry, and the notice in one SQL Server transaction.",
      "Background workers handle SLA ticks, the email outbox, reports, and preventive maintenance, each reading leased due rows.",
      "Socket.IO events carry ids only; clients refetch over REST, so a dropped connection never leaves stale data on screen.",
      "React 19, Vite, TanStack Query and Table, and Tailwind v4 on the front end; one server under PM2 with nightly retention jobs.",
    ],
    engineering: [
      "A kill -9 crash test fires a burst, kills the process, restarts it, and verifies nothing was lost or duplicated.",
      "Load-tested at 300 simultaneous requests across tickets, queue, custody, maintenance, reports, and surveys.",
      "A 15,000-ticket report runs in a background worker; in load tests the help desk stays under 500 ms (p95) while three reports generate.",
      "Query plans are pinned by tests: the report scan must be an index seek or the build fails.",
      "15-minute access tokens with 7-day rotated refresh tokens in an HttpOnly cookie, tokens hashed at rest, a CSV formula-injection guard, and a separate read-only login for custom queries.",
      "Test-driven with Jest against a real SQL Server test database, Vitest and Playwright on the front end, and a quality gate (types, tests, every load test) that must pass before anything merges.",
    ],
    outcome: [
      "Load-tested at 300 simultaneous requests with no duplicate ticket numbers.",
      "A 15,000-ticket report returns in under 500 ms (p95) in testing, while the help desk keeps running.",
    ],
    aiAngle:
      "Automation runs the clock: the SLA engine warns, flags breaches, and escalates on its own, and the help center suggests a fix before a ticket is filed.",
    status: "In production",
  },
  {
    slug: "consumer-billing-self-service-portal",
    client: "250K-member electric cooperative",
    role: "Solo architect & full-stack engineer",
    summary:
      "A self-service portal where consumers see their bills, payments, and usage, report outages and follow the repair, while the billing system itself never touches the internet.",
    headline: "Members check bills and track outage repairs from their phones, and the billing database is never exposed to the internet.",
    scale: [
      "Live in production, serving member-consumers across 17 towns and cities",
      "370+ test cases across 29 suites",
      "13-month usage history per account",
    ],
    challenge: [
      "Members had to wait for the paper bill or line up at an office to learn what they owed.",
      "The billing database is live, shared with tellers, and must never be exposed to the internet.",
      "Outage complaints came by phone and walk-in, with no way for the member or management to follow them.",
    ],
    approach: [
      "An on-prem sync agent is the only part that reads the billing database. It mirrors only what the portal needs, pushes outbound, and opens no inbound ports.",
      "Read-through, not a bulk copy: a member's data is mirrored only after they claim the account, and refreshed on demand.",
      "Data isolation enforced in SQL: every account-scoped query is guarded against the caller's linked accounts, with row-level security set to default-deny.",
      "Self-hosted behind a tunnel, with automatic deploys, health checks, and rollback, and a cloud host as a warm fallback.",
    ],
    built: [
      "Bills, line-by-line bill breakdown, payments, and 13-month usage",
      "Outage and hazard reports with a map pin, tracked as job orders to restoration",
      "Staff side: ticket board across area offices, dispatch to linemen, account lookup",
      "Where to pay, rates, appliance calculator, and severe-weather warnings",
      "On-prem sync agent mirroring billing data to the cloud",
    ],
    capabilities: [
      {
        group: "Member self-service",
        items: [
          "Bill and balance for every account a member owns, with due date and unpaid-month warning",
          "Line-by-line bill breakdown with a plain-language reason it changed from last month",
          "13-month usage, comparisons to last month and last year, and a next-bill estimate",
          "Payment verification across channels",
          "Where to pay, with a map of offices and mall counters",
          "Appliance cost estimator at the member's own effective rate",
          "Severe-weather warnings for the franchise area",
        ],
      },
      {
        group: "Outage and job orders",
        items: [
          "Report an outage, hazard, meter, or billing problem with a map pin",
          "Every report becomes a numbered job order routed to the office that serves that town",
          "Dispatch timeline: acknowledged, assigned, en route, on site, restored",
          "Unacknowledged tickets escalate to the supervisor, then the manager, on a schedule",
          "Members see live status in the app",
        ],
      },
      {
        group: "Staff tools",
        items: [
          "Ticket board across all area offices, with transfers",
          "Office tenders file for phone and walk-in callers",
          "Web Push alerts for new tickets in the staffer's area",
          "All-offices management view: open tickets, oldest unacknowledged, escalations, lineman workload",
          "Account lookup and user management",
        ],
      },
      {
        group: "Security and privacy",
        items: [
          "Account claim with an email code plus a detail from a real bill, with rate limits",
          "Unauthorized and missing records return the same 404, so accounts cannot be probed",
          "Role and office scoping re-checked on every admin page and server action",
          "A lineman sees a caller's number only on a job assigned to them",
          "Strict CSP, HSTS, database TLS pinned to its CA, bot checks on auth, WAF and rate limits",
        ],
      },
    ],
    architecture: [
      "Billing system (SQL Server, office LAN) → on-prem Node sync agent → Supabase Postgres mirror with default-deny row-level security → Next.js 16 portal.",
      "The portal runs on the cooperative's own server behind a Cloudflare Tunnel; a poller deploys the main branch within minutes, health-checks it, and rolls back on failure.",
      "If a sync fails, the portal keeps serving the last data with an \"as of\" time instead of going down.",
      "Charts are hand-built SVG and maps are hand-rolled map tiles, with no chart or map library.",
    ],
    engineering: [
      "A test asserts the account guard on every exported data function.",
      "Moved to a transaction pooler after per-instance session pools ran out of connections under load.",
      "Replaced a 170 ms auth round-trip per request with local JWT verification.",
      "A stale-while-revalidate device cache paints the last known data before the first network byte on slow mobile data.",
      "370+ test cases across 29 suites in Vitest.",
    ],
    outcome: [
      "Live in production for members across 17 towns and cities.",
      "The portal reads from a mirror, so member traffic never reaches the billing database.",
    ],
    aiAngle:
      "Automation keeps the portal current and the queue moving: the sync agent refreshes billing data on demand, reports route themselves to the right office, and unacknowledged tickets escalate on their own.",
    status: "Live",
  },
  {
    slug: "distributed-event-registration-platform",
    client: "250K-member electric cooperative",
    role: "Solo architect & full-stack engineer",
    summary:
      "QR-based registration for a cooperative's Annual General Assembly Meeting that checked in 13,000 attendees across 5 simultaneous venues.",
    headline: "13,000 attendees checked in across 5 simultaneous venues, with a live LED wall and an audit trail accepted as official documentation.",
    scale: [
      "13,000 attendees across 5 simultaneous venues",
      "115+ source files, 14,000+ lines of code",
      "25+ API endpoints and 30+ components",
      "5 staff roles: registrar, claim officer, food officer, admin, super admin",
    ],
    challenge: [
      "The old registration system created long queues and manual errors.",
      "Token and meal distribution suffered from chronic abuse.",
      "Organizers had no live view of turnout across venues.",
    ],
    approach: [
      "Hybrid design: membership is validated read-only against the cooperative's on-prem system of record through a small bridge, while registrations live in the cloud.",
      "Realtime pushes counts to a live dashboard the moment someone checks in.",
      "Separate stations for registration, claims, and food, each with its own role, so a stub can only be claimed once.",
    ],
    built: [
      "QR and barcode check-in from staff phones, plus manual search",
      "Public pre-registration portal with a downloadable QR card",
      "Claims stations with numbered stub tracking",
      "Live LED-wall dashboard by venue, town, and barangay",
      "Cryptographic raffle, reports, and attendance certificates",
    ],
    capabilities: [
      {
        group: "Registration and check-in",
        items: [
          "QR and barcode scanning from a phone camera",
          "Manual search by account number or name",
          "Real-time membership validation at the door",
          "Mobile-first employee app with role-based onboarding and personal stats",
        ],
      },
      {
        group: "Pre-registration",
        items: [
          "Public pre-registration portal",
          "Self-service status lookup by account number and last name",
          "Downloadable registration card with a QR code for offline use",
          "QR verification page",
        ],
      },
      {
        group: "Claims and distribution",
        items: [
          "Claims station that verifies the account and rejects repeat claims",
          "Pre-printed numbered stubs with fuzzy stub search",
          "Separate food officer role for meal distribution",
        ],
      },
      {
        group: "Live dashboard",
        items: [
          "Full-screen LED wall dashboard",
          "Animated live attendee counter",
          "Per-venue, per-town, and per-barangay breakdowns",
          "Progress ring against the turnout target",
        ],
      },
      {
        group: "Raffle",
        items: [
          "Draws use the browser's cryptographic random generator with a visible hex seed",
          "Prize management with eligibility rules",
          "Accounts with unpaid bills excluded automatically",
          "Winner history with void and redraw",
        ],
      },
      {
        group: "Reports and audit",
        items: [
          "PDF, Excel, and Word exports filtered by venue, town, area, barangay, or employee",
          "Per-attendee attendance certificates with QR verification",
          "Audit and activity log viewer",
        ],
      },
    ],
    architecture: [
      "Next.js 16 and React 19 app serving the employee app, admin panel, LED wall, and public portal.",
      "Supabase holds registrations, users, venues, raffle, and audit logs, with Auth, row-level security, and Realtime.",
      "An on-prem Express bridge answers read-only consumer lookups from the MS SQL system of record, so the cloud app never connects to it directly.",
      "Deployed with a process manager and a reverse proxy, with scripts for hot update and restart.",
    ],
    engineering: [
      "The consumer master is only ever queried read-only.",
      "Every registration, claim, and admin action is written to an audit log.",
      "Raffle draws are verifiable through the published seed.",
    ],
    outcome: [
      "13,000 attendees checked in across 5 simultaneous venues.",
      "The audit trail was accepted as an official NEA documentary requirement.",
    ],
    aiAngle:
      "Automation replaces the paper process: membership checks, claim tracking, and the live turnout count all happen the moment a QR code is scanned.",
    status: "Live",
  },
  {
    slug: "azure-hybrid-cloud-migration",
    client: "250K-member electric cooperative",
    role: "Solo architect",
    summary:
      "A ₱14.95M multi-milestone migration of core operational workloads to Microsoft Azure, keeping compliance-bound systems on-prem.",
    headline: "A ₱14.95M hybrid cloud program designed and led by a single architect.",
    challenge: [
      "Identity, collaboration, and disaster recovery needed to move to the cloud.",
      "Some workloads are compliance-bound and have to stay on-prem.",
    ],
    approach: [
      "A hybrid topology: on-prem HCI keeps the compliance-bound workloads, Azure takes identity, collaboration, and DR.",
      "Delivered in milestones, with vendor management under one architect.",
    ],
    built: [
      "Hybrid cloud topology linking on-prem HCI with Azure",
      "Identity and collaboration moved to Azure",
      "Disaster recovery on Azure",
    ],
    architecture: [
      "On-prem HCI keeps the compliance-bound workloads inside the cooperative.",
      "Identity and collaboration move to Microsoft Azure.",
      "Disaster recovery runs on Azure, so a site failure has an off-site recovery target.",
      "A hybrid link ties the on-prem cluster and Azure into one topology.",
    ],
    engineering: [
      "Delivered as a multi-milestone program, so each phase lands before the next one starts.",
      "Workloads are placed by compliance requirement first, so regulated systems never leave the premises.",
      "Vendor work is managed under one architect, so design decisions stay consistent across milestones.",
    ],
    outcome: ["A ₱14.95M program led by a single architect."],
    status: "In build",
  },
  {
    slug: "internal-ndr-class-network-detection",
    client: "250K-member electric cooperative",
    role: "Solo architect & engineer",
    summary:
      "An in-house network behavioral monitoring system for east-west traffic and lateral movement, a class of tool usually bought from enterprise vendors.",
    headline: "Lateral-movement detection built in-house, without an enterprise NDR license.",
    challenge: [
      "An attacker inside the network moves sideways between machines, where perimeter tools do not look.",
      "Commercial NDR products from vendors like Darktrace, Vectra, or ExtraHop carry enterprise license costs.",
    ],
    approach: [
      "Build in-house on open tooling instead of buying a license.",
      "Focus on east-west traffic and anomalies, not just the perimeter.",
    ],
    built: [
      "East-west traffic monitoring",
      "Lateral-movement and anomaly detection",
      "Runs on Linux with open tooling",
    ],
    architecture: [
      "Sensors on Linux watch east-west traffic between internal machines, not just the perimeter.",
      "Traffic is analyzed for behavior that looks like lateral movement or other anomalies.",
      "Detections surface to the IT team for investigation.",
    ],
    engineering: [
      "Built on open tooling, so there is no enterprise NDR license to renew.",
      "Runs on the cooperative's own Linux hosts, so traffic data stays in-house.",
      "Detection focuses on behavior inside the network, the blind spot that perimeter tools leave.",
    ],
    outcome: ["NDR-class detection built in-house, with no enterprise license."],
    status: "In production",
  },
  {
    slug: "consumer-e-invoicing-notification-platform",
    client: "250K-member electric cooperative",
    role: "Solo architect & engineer",
    summary:
      "A live notification service that replaces paper statements with password-protected PDF bills by email and SMS notices, and proves who received what.",
    headline: "When a member says \"I never got my bill,\" staff can now show which bill, which channel, when it was delivered, and whether it was opened.",
    scale: [
      "Architected for bulk invoicing to the cooperative's 183K+ consumers",
      "SMS fallback chain across four gateways",
      "Three access levels: view, operate, configure",
    ],
    challenge: [
      "Statements of account went out on paper, hand-delivered every month.",
      "Disputed disconnections came down to \"nobody told me,\" with no proof either way.",
      "One SMS gateway is a single point of failure for notices that must arrive.",
      "A crash halfway through a huge send must never message anyone twice.",
    ],
    approach: [
      "A self-contained service with its own database, auth, and queue, and only a read-only bridge to billing that snapshots each bill when a batch is created.",
      "Idempotent job claims plus a dedupe ledger keyed on account, channel, notice type, urgency, and billing month, so a restarted batch picks up where it stopped.",
      "Every provider runs in mock mode on the same code paths until its keys are saved, so demos and staging can never message real people.",
      "Telecom rules are enforced in the queue: no SMS between 9 PM and 7 AM.",
    ],
    built: [
      "Password-protected PDF bills by email and SMS notices with provider fallback",
      "Draft-first invoice batches with targeting and a live cost estimate",
      "Staged disconnection notices: standard, warning, final",
      "Per-consumer delivery and open tracking with a timestamped audit log",
      "360° delivery dashboard and an executive wall display",
    ],
    capabilities: [
      {
        group: "Invoicing",
        items: [
          "Target all consumers, an area, a route, overdue accounts, or a pasted account list",
          "Batch targeting by area office, municipality, and barangay",
          "Draft first, then start, pause, resume, cancel, or retry only the failures",
          "Per-account invoice overrides, custom PDF upload, and PDF preview",
          "PDF encrypted with the last 4 digits of the account number",
        ],
      },
      {
        group: "Disconnection notices",
        items: [
          "Overdue candidates (2 or more months) with a cost preview before sending",
          "Escalating sequence: standard reminder, warning, final notice",
          "Audit record of who put each account on the list",
        ],
      },
      {
        group: "Delivery tracking",
        items: [
          "Email delivery, bounce, and complaint events from Amazon SES",
          "A bounce marks the address unverified so the next batch skips it",
          "Per-email open pixel credited to the exact bill and consumer",
          "SMS delivery reports per gateway, with reconciliation for gateways without webhooks",
          "Consumer send history: every notice, channel, status, gateway, and cost",
        ],
      },
      {
        group: "Dashboards",
        items: [
          "Email and SMS funnels from queued to sent, delivered, and opened",
          "6-period trends, live activity feed, and channel comparison",
          "Per-provider SMS cost tracking and failure breakdowns",
          "Executive wall display of pesos saved against printed bills",
        ],
      },
      {
        group: "Contacts and templates",
        items: [
          "Contact registry with CSV import (per-row errors), export, and coverage stats",
          "Email templates with variables",
          "SMS templates with a live character and segment counter",
        ],
      },
      {
        group: "Providers and security",
        items: [
          "Fallback chain order, rates, test sends, and balances per gateway",
          "Per-provider rate limits and retries capped by the gateway's retry hint",
          "Provider credentials encrypted with AES-256-GCM",
          "Signed-cookie sessions with view, operate, and configure levels",
          "Bypassing the dedupe ledger requires a superadmin and a written reason",
        ],
      },
    ],
    architecture: [
      "Node.js and Express service with its own embedded database, auth, and a one-second dual-channel send loop.",
      "Read-only bridge to the MS SQL billing database snapshots bills at batch creation, so sending never queries production.",
      "Email through Amazon SES; SMS through adapters for four gateways behind one fallback chain.",
      "Delivery webhooks feed per-batch counters, dashboard funnels, and the live feed.",
      "React and TypeScript front end; runs 24/7 under a process manager with automatic restart.",
    ],
    engineering: [
      "The schema mirrors the production design, so porting to another database is a dialect swap, not a remodel.",
      "End-to-end acceptance checks run against a scratch database.",
      "Crash recovery verified by killing the process and confirming it comes back healthy within seconds.",
      "Auto-pause sends an alert email, and batches flag problem SMS for review and resend.",
    ],
    outcome: [
      "Live: batches, provider fallback, and delivery tracking run in production.",
      "Staff can answer \"did they get their bill?\" from the consumer's record in seconds.",
    ],
    aiAngle:
      "Automation handles targeting, sending, fallback, and delivery tracking, so staff start a batch instead of mailing notices.",
    status: "Live",
  },
  {
    slug: "partner-file-automation-platform",
    client: "250K-member electric cooperative",
    role: "Solo architect & engineer",
    summary:
      "A web-based ETL platform that ingests partner files from FTP/SFTP and email attachments into MS SQL Server on a schedule.",
    headline: "A daily download-parse-import chore became scheduled jobs with an audit trail.",
    challenge: [
      "Staff downloaded, parsed, and imported partner files by hand every day.",
      "Manual imports left no audit trail of what came in and when.",
    ],
    approach: [
      "Scheduled jobs replace the manual download-parse-import loop.",
      "A field mapping editor lets staff handle a new file layout without code changes.",
      "Audit logging and role-based access on every action.",
    ],
    built: [
      "Scheduled ingestion from FTP/SFTP and email attachments",
      "Dashboard of jobs and results",
      "Field mapping editor",
      "Audit logging and RBAC",
      "FastAPI, SQLAlchemy, and Docker",
    ],
    architecture: [
      "Scheduled jobs collect partner files from FTP/SFTP servers and email attachments.",
      "A FastAPI service parses each file and maps its fields into MS SQL Server through SQLAlchemy.",
      "A web dashboard shows each job and its result, with a field mapping editor for new file layouts.",
      "The platform runs in Docker containers.",
    ],
    engineering: [
      "Every action is audit-logged, so there is a record of what came in and when.",
      "Role-based access control limits who can change mappings and jobs.",
      "New file layouts are handled through mapping configuration, not code changes.",
      "Containerized with Docker, so the same build runs the same way in every environment.",
    ],
    outcome: ["Replaces a manual daily download-parse-import workflow with scheduled jobs."],
    aiAngle: "Scheduled jobs do the daily file ingestion that staff used to do by hand.",
    status: "In production",
  },
  {
    slug: "hci-server-infrastructure",
    client: "250K-member electric cooperative",
    role: "Solo infrastructure architect",
    summary:
      "The hyperconverged cluster that runs production billing and operational VMs, with written recovery procedures.",
    headline: "The cluster under the cooperative's production billing, with a recovery plan written before it was needed.",
    challenge: [
      "Production billing and operations need infrastructure that survives hardware failure.",
      "A disk failure on the billing stack needs a known, tested recovery path.",
    ],
    approach: [
      "Hyperconverged infrastructure with RF=2 clusters for redundancy.",
      "Incident response procedures written before they were needed.",
    ],
    built: [
      "HCI cluster for production billing and operational VMs",
      "VM orchestration on Linux-based infrastructure",
      "Disk-failure recovery procedures for the production billing and meter reading stack",
    ],
    architecture: [
      "A hyperconverged cluster runs production billing and operational VMs on Linux-based infrastructure.",
      "Clusters use RF=2, so data is kept in two copies across nodes.",
      "VM orchestration places and manages the production workloads on the cluster.",
    ],
    engineering: [
      "RF=2 redundancy means a single disk or node failure does not take data offline.",
      "Incident response procedures were written before they were needed.",
      "A documented disk-failure recovery path covers the production billing and meter reading stack.",
    ],
    outcome: ["Runs the cooperative's production billing and operational workloads."],
    status: "In production",
  },
  {
    slug: "focuscanvas-desktop-saas",
    client: "Own product",
    role: "Solo designer & engineer",
    summary:
      "A cross-platform desktop tool that changes your wallpaper on a schedule of \"Day Types\" to support focus and context switching.",
    challenge: [
      "Switching between kinds of work is easier with a visual cue, and doing it by hand is friction.",
      "Electron apps are heavy for a tool that should run quietly all day.",
    ],
    approach: [
      "Tauri 2.0 and Rust for native performance on Windows, macOS, and Linux, without Electron.",
      "A PRD and wireframes first, to define the v1 product surface.",
    ],
    built: [
      "Scheduled \"Day Types\" that drive wallpaper changes",
      "React and TypeScript interface on a Rust core",
      "PRD and wireframes for v1",
    ],
    architecture: [
      "A Rust core built on Tauri 2.0 runs the scheduler and changes the wallpaper.",
      "A React and TypeScript interface lets the user define Day Types and their schedules.",
      "One codebase targets Windows, macOS, and Linux.",
    ],
    engineering: [
      "Tauri instead of Electron keeps the app light enough to run quietly all day.",
      "A PRD and wireframes defined the v1 surface before code was written.",
      "Scheduling logic sits in the Rust core, separate from the interface.",
    ],
    outcome: ["Native cross-platform build without Electron."],
    status: "In build",
  },
  {
    slug: "api-middleware-in-design",
    client: "250K-member electric cooperative",
    role: "Solo architect",
    summary:
      "A real-time integration layer that will let partners post directly to the database over a secure API, replacing batch file transfers.",
    challenge: [
      "Partner data arrives in batch files, so it is never real time.",
      "Two-way integration is not possible with one-way file drops.",
    ],
    approach: [
      "mTLS so only known partners can connect.",
      "Idempotency keys and rate limiting so retries and bursts are safe.",
      "Reconciliation endpoints so both sides can confirm what was posted.",
    ],
    built: [
      "Design for direct partner-to-database posting",
      "Security model: mTLS, idempotency keys, rate limiting",
      "Reconciliation endpoints",
    ],
    architecture: [
      "Planned FastAPI service that partners post to directly, replacing batch file drops.",
      "Kong Gateway is planned as the front door for partner traffic, with mTLS between partners and the service.",
            "Accepted posts are written to MS SQL Server, with reconciliation endpoints so both sides can confirm what landed.",
    ],
    engineering: [
      "mTLS is designed so only partners with issued certificates can connect.",
      "Idempotency keys are designed to make retries safe, so a repeated post is never recorded twice.",
      "Rate limiting is planned to protect the database from partner bursts.",
      "Designed as the next step after the partner file platform, reusing its mapping and audit approach.",
    ],
    outcome: ["The planned next step after the partner file platform, from one-way ingest to two-way integration."],
    status: "Design",
  },
  {
    slug: "wholesale-power-invoice-automation",
    client: "250K-member electric cooperative",
    role: "Solo architect & full-stack engineer",
    summary:
      "Automated PDF invoicing for the Philippine wholesale electricity spot market. A ~50-invoice settlement batch that took a full workday now runs in under 30 seconds.",
    headline: "A full workday of manual invoicing now takes under 30 seconds, with zero transcription errors.",
    scale: [
      "~50 invoices per settlement batch",
      "25 API endpoints across 5 routers",
      "59 passing tests across 10 files",
      "Shares its invoice-number ledger with a live, third-party-owned billing system",
    ],
    challenge: [
      "Each batch meant copying data into Word templates, looking up TINs in spreadsheets, and tracking the next invoice number by hand: a full workday.",
      "Invoice numbers come from a ledger shared with a live billing system, so a mistake could collide with a real invoice.",
      "The database schema belongs to a third-party billing system, so migrations were off the table.",
    ],
    approach: [
      "A fail-closed write gate: a per-server setting and a runtime toggle must both say production, or the app writes to a sandbox table. Any missing, unknown, or failing setting resolves to the sandbox.",
      "The same function decides the target table and the mode badge the operator sees, so the UI cannot misreport what will happen.",
      "Invoice numbers are allocated without blocking the collection office, with a unique-index retry (up to 5 times) and a bounded lock wait.",
      "One source of data from upload to PDF, so nothing is retyped.",
    ],
    built: [
      "Four-step wizard: upload, preview, generate, done, with live per-invoice progress",
      "Participant registry that resolves name, address, and TIN automatically",
      "Pixel-accurate PDFs matching the official pre-printed invoice format",
      "Per-invoice, consolidated, and ZIP downloads, or save straight to a local folder",
      "Dashboard and an automatic audit record of every invoice",
    ],
    capabilities: [
      {
        group: "Invoice generation",
        items: [
          "CSV upload with 19-column validation and typed parsing",
          "Billing IDs checked against the registry before generating, with a one-click \"Add to Registry\" for missing ones",
          "Live progress bar and log streamed per invoice",
          "PDF layout reverse-engineered from invoice scans",
        ],
      },
      {
        group: "Numbering and safety",
        items: [
          "Two-layer fail-closed test and production gate",
          "Sandbox numbers kept above the live sequence so they never collide",
          "Non-blocking allocation with duplicate-key retry",
          "Bounded lock wait, so a slow third-party app makes this one fail fast and retry",
        ],
      },
      {
        group: "Output",
        items: [
          "Per-invoice PDFs, one consolidated PDF, or a ZIP of the batch",
          "Save to a folder the operator picks, mirroring the server layout",
        ],
      },
      {
        group: "Registry and dashboard",
        items: [
          "Participant registry with search, filters, side-drawer editing, and bulk CSV upsert",
          "4 KPI cards, monthly trends, and region and facility-type breakdowns",
          "Recent batches with batch-level delete",
        ],
      },
      {
        group: "Security",
        items: [
          "JWT in httpOnly cookies, bcrypt passwords, and admin and user roles",
          "Parameterized SQL throughout and allowlisted sort columns",
          "App refuses to start if required settings are missing",
        ],
      },
    ],
    architecture: [
      "A single FastAPI process serves the React 19 app and the API on one port, for simple LAN deployment.",
      "Raw parameterized SQL through pyodbc, because the schema is owned by a third-party system.",
      "ReportLab draws each invoice at exact coordinates to match pre-printed carbonless forms.",
      "Each row: look up the participant, allocate a number, insert the audit row, render the PDF, stream progress.",
    ],
    engineering: [
      "59 passing tests across auth, CSV parsing, numbering, invoice mode, and generation.",
      "Fail-closed by design: any unexpected exception in the mode check resolves to the sandbox table.",
      "Runs alongside the staff who use the same live ledger, without blocking them.",
    ],
    outcome: [
      "A full workday of manual invoicing → under 30 seconds, zero transcription errors.",
      "Every generated invoice is recorded for audit automatically.",
    ],
    aiAngle:
      "Automation handles registry lookups, numbering, and PDF rendering, so staff upload a file and review the result.",
    status: "In production",
  },
  {
    slug: "meter-reading-platform-legacy-modernization",
    client: "Electric distribution cooperative with ~200,000 consumer accounts",
    role: "Solo full-stack engineer",
    summary:
      "Rebuilt a production PHP and jQuery meter reading system as a React and Fastify app on the same live database, then grew it into the cooperative's operations hub: live cycle tracking, revenue-leak detection, reader scoring, and verified backups.",
    headline: "Modernized a live billing-critical system with no data migration and no downtime, then turned it into a tool that finds lost revenue.",
    scale: [
      "~200,000 consumer accounts across 17 municipalities",
      "~25 route-level modules in the new React app",
      "10+ report types with PDF and CSV export",
      "Legacy and modern stacks run side by side on the same production database",
      "Before: 9 of 14 modules logged nothing",
    ],
    challenge: [
      "Knowing the billing cycle's status meant calling around and adding up per-book reports by hand, so lagging towns were found after the deadline.",
      "Revenue leaks were invisible: sudden drops in readings, \"disconnected\" meters still turning, and gaps or duplicates in invoice numbers.",
      "Reader performance and the outside contractor's readings were judged on opinion.",
      "There was no audit trail, backups were manual, and certain report queries crashed the production database server.",
    ],
    approach: [
      "Zero-migration compatibility: the new stack reads and writes the existing schema exactly as the PHP system does, so modules moved over one at a time.",
      "Correctness over convenience: the current billing period is derived from the data instead of a config row frozen for years, and every account falls into exactly one of five buckets so numbers agree everywhere.",
      "Field verification writes to a separate database; the contractor's readings stay strictly read-only.",
      "Answer management's questions directly: are we on track, where are we losing money, who is performing.",
    ],
    built: [
      "Live dashboard and a wall TV mode with a coverage map across all 17 towns",
      "Rule-based anomaly detection, disconnected-meter monitoring, and invoice series checks",
      "Account 360, reader scorecards, and contractor progress tracking",
      "Mobile field verification app with photos and GPS",
      "Audit log, user activity monitoring, and automated encrypted backups",
    ],
    capabilities: [
      {
        group: "Live cycle tracking",
        items: [
          "Dashboard with KPI cards, per-day reading progress, and a completion ring, refreshed every 30 s",
          "Area and town drill-down with four area gauges and 17 color-coded town cards",
          "TV mode: animated coverage map whose camera flies into each municipality, plus a town ranking",
          "TV display unlocks with a kiosk key, no login",
          "Dark mode",
        ],
      },
      {
        group: "Revenue protection",
        items: [
          "Anomaly detection: each account compared to its own 3-month average, flagged as drop, spike, zero, or recurring, with an estimated loss",
          "Disconnected consumer monitoring: \"disconnected\" meters still consuming, ranked by kWh, critical at 100 kWh or more",
          "Invoice analysis: duplicates, gaps, and out-of-order numbers per area",
          "Account 360: profile, billing, 12-month consumption, reading history, and field findings",
          "Exports to CSV, Word, and PDF",
        ],
      },
      {
        group: "People and contractors",
        items: [
          "Reader scorecard: completion 40%, accuracy 30%, productivity 15%, books 10%, attendance 5%",
          "Per-book and per-day evidence behind every score, with automatic Needs Improvement flags",
          "Contractor progress tracked book by book across five exclusive buckets, so completion cannot be padded",
        ],
      },
      {
        group: "Field app",
        items: [
          "Capacitor app with camera, GPS, local storage, and offline sync",
          "Staff re-read meters on site and log the difference from the contractor's reading",
          "Each check graded none, minor, or major",
          "Coverage-aware sampler builds the worklist so every consumer is visited over time",
        ],
      },
      {
        group: "Operations",
        items: [
          "Reports: status, summary, field findings, unread, time and motion, senior citizen, net metering, and more",
          "Assignment management: reassign or unassign books in bulk instead of rebuilding the month",
          "Reader schedules: a monthly route plan per reader, editable in place",
          "Commercial accounts tracked separately so none are left unread at cut-off",
          "Net metering: import and export readings and net excess energy for rooftop-solar consumers",
          "Trends: 12 months of completion, kWh, findings, and miss codes, with period drill-down",
        ],
      },
      {
        group: "Governance and security",
        items: [
          "Audit log on every write with a before/after diff, user, IP, and reason",
          "User activity: who is online, in which module, with session-conflict detection and forced logout",
          "4-level RBAC enforced on routes and the API",
          "JWT access and refresh tokens with server-side session termination, bcrypt passwords, Zod validation",
          "AES-256-GCM encryption for stored backup-share credentials",
        ],
      },
      {
        group: "Backups",
        items: [
          "Scheduled daily backups with a weekly full, copied to several locations",
          "gzip and a SHA-256 checksum per file, and every copy verified by a round trip",
          "Dashboard alert if the last good backup is more than 36 hours old",
          "Live table-by-table progress for manual runs, with history and downloads",
        ],
      },
    ],
    architecture: [
      "React 18 and TypeScript SPA (TanStack Query, Zustand, Recharts, shadcn/ui) talking to a Fastify API with Zod validation.",
      "Existing production MySQL schema accessed through Prisma introspection, with raw SQL for complex reports over per-month history tables.",
      "A separate SQL Server database holds field verification records.",
      "Runs as a Windows service with secure public access through a tunnel; the legacy PHP system keeps running in parallel.",
    ],
    engineering: [
      "Diagnosed a production database crash: isolated the query that triggered an engine bug and restructured it, with no upgrade, migration, or disruption to other systems on the server.",
      "Strict allowlist validation for dynamic table names in raw SQL.",
      "Kiosk key travels in the URL fragment so it never reaches server or proxy logs, and it unlocks only an allowlisted set of read endpoints.",
      "Streaming keyset-paginated backups keep memory flat regardless of table size.",
      "N+1 queries removed, index-friendly date ranges, request de-duplication, short-lived caching for hot dashboard queries, and route-level code splitting.",
      "README screenshots are real renders of the app fed by a seeded synthetic-data pipeline that fails closed, so no real record can leak into an image.",
    ],
    outcome: [
      "Legacy and modern stacks run side by side against the live database, with no data migration and no downtime.",
      "Management sees the billing cycle live, and lagging towns show up while there is still time to act.",
    ],
    aiAngle:
      "Rule-based detectors do the watching: every account is checked against its own baseline, and drops, spikes, still-running disconnected meters, and invoice gaps land in an inspection queue with an estimated loss.",
    status: "In production",
  },
  {
    slug: "real-time-cooperative-election-platform",
    client: "Employee cooperative",
    role: "Solo full-stack engineer",
    summary:
      "The full election lifecycle on members' own phones: registration, admin-approved QR ballot access, live tallies, and exportable reports.",
    headline: "Hundreds of members vote at once from their own phones, and the results tally live on the projector.",
    challenge: [
      "Paper elections are slow to count and hard to audit.",
      "Hundreds of members need to vote at the same time.",
      "Election day runs on a local network, so setup has to be simple.",
    ],
    approach: [
      "A single-port monolith: Express serves the app, the API, and WebSockets together, so LAN deployment is trivial.",
      "An admin approves each voter's access before the ballot unlocks.",
      "Votes are saved in one transaction, and database constraints allow one vote per voter per position.",
    ],
    built: [
      "Voter registration and roster import",
      "QR ballot access from members' own phones",
      "Live vote tallies on a presentation dashboard",
      "Reports exportable as PDF, CSV, DOCX, or JSON",
    ],
    capabilities: [
      {
        group: "Voter experience",
        items: [
          "Scan a projected QR code to open the ballot",
          "Admin-gated access, approved in real time",
          "Position-by-position voting with configurable multi-select",
          "All selections committed in one transaction",
        ],
      },
      {
        group: "Admin",
        items: [
          "Election lifecycle: draft, open, close, with an audit trail",
          "Voter approval queue and live turnout counters",
          "Full-screen presentation mode for results",
          "Employee roster bulk import from CSV",
          "Exports in PDF, CSV, DOCX, or JSON",
        ],
      },
      {
        group: "Realtime",
        items: [
          "Socket.IO rooms for admins, each election, and each voter",
          "Tallies, approvals, and attendance pushed, with no polling",
          "Runs on the LAN, with an optional secure tunnel for voters on other subnets",
        ],
      },
    ],
    architecture: [
      "React 19 SPA for voters and admins.",
      "Express 5 and Socket.IO on one port serve the app, REST API, and realtime gateway.",
      "Microsoft SQL Server through a pooled connection; JWT auth with bcrypt.",
    ],
    engineering: [
      "Database unique constraints guarantee one vote per voter per position.",
      "The real employee roster is git-ignored and never leaves the host machine.",
      "One script installs, builds, sets up the database, and starts the server.",
    ],
    outcome: ["Hundreds of members can vote simultaneously from their own phones."],
    status: "In production",
  },
  {
    slug: "event-registration-raffle-platform",
    client: "Electric cooperative (year-end employee event)",
    role: "Solo full-stack engineer",
    summary:
      "An all-in-one corporate event system: QR self-registration, real-time check-in, and a raffle engine with broadcast overlays for live projection.",
    headline: "Registration, check-in, and an on-stage raffle with broadcast overlays, with no backend to run on event day.",
    scale: ["11 database tables, each with row-level security policies"],
    challenge: [
      "Manual registration and ticketing at the door creates lines and duplicates.",
      "Raffle draws on stage need to look good and be fair.",
      "There is no time to run servers on event day.",
    ],
    approach: [
      "Fully serverless on Supabase, so there is no backend to operate on event day.",
      "Registrations are validated against the employee database, with duplicate prevention.",
      "Raffle eligibility is rule-based and every draw is logged.",
    ],
    built: [
      "QR self-registration with unique ticket codes and email confirmations",
      "Real-time check-in by camera scan, image upload, or manual entry",
      "Multi-mode raffle engine with eligibility rules and an audit trail",
      "OBS broadcast overlays for live projection",
      "Admin dashboard with exports",
    ],
    capabilities: [
      {
        group: "Registration and check-in",
        items: [
          "QR self-registration validated against the employee database",
          "Unique ticket codes, email confirmations with a fallback sender, and duplicate prevention",
          "Mass registration for a separate event",
          "Check-in by camera, image upload, or manual entry, with sound feedback",
        ],
      },
      {
        group: "Raffle and broadcast",
        items: [
          "Spinning wheel, slot machine, mass draw, and on-the-spot draws",
          "Dynamic eligibility rules and a complete draw history",
          "OBS-ready transparent overlays and animated winner announcements",
          "Dashboard display mode with customizable themes",
        ],
      },
      {
        group: "Admin and reports",
        items: [
          "Real-time registration monitoring",
          "Employee management with CSV import, backup, and restore",
          "Multi-admin roles with an audit log",
          "Excel and Word exports, attendance charts, and winner statistics",
        ],
      },
    ],
    architecture: [
      "React 18 and Vite front end on Vercel.",
      "Supabase Postgres with realtime subscriptions and row-level security.",
      "A small serverless function sends confirmation email.",
    ],
    engineering: [
      "All 11 tables carry row-level security policies in Supabase, so the browser only sees what each role is allowed to.",
      "Admin passwords are stored as bcrypt hashes, and every admin action is written to an audit log.",
      "Confirmation email goes through Nodemailer with an EmailJS fallback, so a failed sender does not block a ticket.",
      "A health-check endpoint and a first-run setup wizard catch a missing database or broken email config before event day.",
      "Employee data can be backed up and restored, and CSV imports are logged with their history.",
    ],
    outcome: ["No backend to operate on event day."],
    status: "Live",
  },
  {
    slug: "netpulse-network-monitoring",
    client: "Internal IT operations",
    role: "Solo full-stack engineer",
    summary:
      "Real-time monitoring for servers, routers, and network devices: an on-prem agent pings them and a cloud dashboard shows status live.",
    challenge: [
      "IT learned about a downed device when users called.",
      "The devices are on a private network, but the team wants to see status from anywhere.",
    ],
    approach: [
      "Hybrid design: an on-prem Python agent does ICMP checks and pushes results to a cloud dashboard.",
      "Supabase Auth with row-level security protects the data.",
    ],
    built: [
      "Python agent with configurable intervals and timeout detection",
      "Next.js dashboard with live WebSocket updates and charts",
      "Bulk add, edit, and delete of monitored devices, with labels and categories",
      "CSV and JSON export",
    ],
    architecture: [
      "An on-prem Python agent uses asyncio and icmplib to ping servers, routers, and devices on a set interval.",
      "The agent pushes results to Supabase, and Supabase Realtime streams them to the dashboard.",
      "A Next.js 15 and TypeScript dashboard shows live status, response times, and charts.",
      "Supabase Auth handles sign-in, with row-level security on the data.",
    ],
    engineering: [
      "Row-level security in Supabase protects device data at the database level.",
      "The agent installs as a systemd service on Linux, so monitoring survives reboots.",
      "Performance test scripts exercise the agent and its WebSocket updates.",
      "The dashboard reconnects automatically and uses optimistic updates with error handling.",
    ],
    outcome: ["Device status updates live on the dashboard without a page refresh."],
    status: "Prototype",
  },
  {
    slug: "executive-live-collections-dashboard",
    client: "250K-member electric cooperative",
    role: "Solo full-stack engineer",
    summary:
      "A real-time collections dashboard for the General Manager that runs on the office TV and on a phone, and can never write to or slow down the financial system of record.",
    headline: "The General Manager reads the day's collections in seconds, from the wall or a phone, through a login that cannot write.",
    scale: [
      "Reads a collections history of over 25 million lines and a ledger of over 35 million rows",
      "Live data polled every 10 to 15 seconds",
      "Database pool hard-capped at 3 connections, however many people are watching",
    ],
    challenge: [
      "The General Manager waited for end-of-day reports to know the day's collections.",
      "Revenue lost to voided receipts was not visible.",
      "Comparing a partial morning to a full yesterday made every morning look like a collapse.",
      "An executive tool must not slow down or write to the production billing database.",
    ],
    approach: [
      "A least-privilege, read-only database login, so writes are denied at the database itself.",
      "Poll-and-cache: the server queries on its own timer and serves cached results, so any number of viewers costs one database reader.",
      "Heavy KPIs such as collection efficiency run hourly, never on the live poll.",
      "Error details that name people stay on the phone view, never on the shared TV.",
    ],
    built: [
      "Today's totals with honest same-time-of-day comparisons",
      "Per-office breakdown and a live province map",
      "Teller ranking by speed, clean rate, and volume tier, plus revenue lost to voided receipts",
      "Collection efficiency, new connections, and a billing-month collections report",
      "TV kiosk mode and an installable phone app",
    ],
    capabilities: [
      {
        group: "Live collections",
        items: [
          "Today's total and receipt count, compared at the same time of day with yesterday and last month",
          "Per-office leaderboard and a live payment feed",
          "Province map with offices as live pulsing dots",
          "Daily trend, this month against last month",
          "Optional monthly target progress bar",
        ],
      },
      {
        group: "Teller performance",
        items: [
          "Ranking by bill stubs processed rather than peso totals, so big-bill luck does not count as work",
          "Top tellers per area",
          "Speed (stubs per active hour or day), clean rate, and HIGH, MEDIUM, LIGHT volume tiers",
          "Wasted pesos and estimated wasted time from voided receipts, with estimates labeled \"est.\"",
        ],
      },
      {
        group: "KPIs and reports",
        items: [
          "Collection efficiency over the last 6 bill months, refreshed hourly",
          "New connection applications today and month-to-date by type, class, area, and status",
          "Billing-month collections report: efficiency, current-billing efficiency, uncollected receivables, and staggered-scheme share",
          "\"Current-to-current\" count of consumers who paid inside the bill's own month",
          "Raw download of every consumer with a bill for a chosen month, paid and unpaid",
        ],
      },
      {
        group: "Displays and access",
        items: [
          "TV mode: dark, large type, auto-rotating panels, no interaction needed",
          "Phone mode: installable PWA with today's total first",
          "Login with role scoping",
          "Remote access through a tunnel that exposes only the dashboard port",
        ],
      },
    ],
    architecture: [
      "One Node.js and Express service, running as a Windows service, serves the API and the built React app.",
      "The server polls SQL Server on its own timers and caches results in memory; browsers poll the server.",
      "A dedicated SELECT-only login; no INSERT, UPDATE, or DELETE exists anywhere in the app.",
      "Column names come from configuration, never hardcoded, because the schema belongs to the billing system.",
    ],
    engineering: [
      "If the database is unreachable, the screen keeps the last data with a \"data as of\" badge instead of going blank.",
      "Teller metrics come from one extended query through the existing pipeline: no new endpoints or schema changes.",
      "Design decisions for the billing-month report rest on measured row counts and timings against production, not assumptions.",
      "Unit tests for query-shaping helpers on fixture rows, plus a smoke script that times every dashboard query against the real database.",
    ],
    outcome: [
      "Any number of viewers costs one database reader.",
      "The dashboard has no write path to the financial system.",
    ],
    aiAngle:
      "Automation turns raw collection lines into the numbers an executive acts on: pace, efficiency, and money lost to voided receipts, refreshed without anyone running a report.",
    status: "In production",
  },
  {
    slug: "sonicsense-ai-music-metadata-engine",
    client: "Own product",
    role: "Solo engineer",
    summary:
      "A Chrome side-panel extension that turns a free-text track description into structured music metadata in one pass, using Anthropic tool use.",
    headline: "A free-text track description becomes 13 structured fields in one pass.",
    challenge: [
      "Filling music metadata by hand for every track is slow and inconsistent.",
      "Instruments, mood, and arrangement notes live in the producer's head, not in a form.",
    ],
    approach: [
      "Anthropic tool use returns structured fields, not free text, so output drops straight into a form.",
      "The rubric rules are kept as source-of-truth documents and embedded in the system prompt.",
      "A side panel keeps the tool next to the page being filled in.",
    ],
    built: [
      "Extraction of 13 global fields from a raw description",
      "Per-section narratives with instruments and vibe tags inferred automatically",
      "Chrome MV3 side panel with a keyboard shortcut",
    ],
    capabilities: [
      {
        group: "AI extraction",
        items: [
          "13 global fields from one description",
          "Per-section narratives that auto-fill instruments and vibe tags",
          "Structured output through tool use",
        ],
      },
      {
        group: "Extension",
        items: [
          "Chrome MV3 side panel built with Vite",
          "Toggle with Cmd+Shift+B or Ctrl+Shift+B",
        ],
      },
    ],
    architecture: [
      "A Chrome MV3 extension with a React side panel, a service worker for the hotkey, and a content script for the page.",
      "The Anthropic API is called with tool use, so Claude returns structured fields instead of free text.",
      "A model router sends nuanced fields to Claude Sonnet and formulaic fields to Claude Haiku.",
      "Per-track drafts are saved in chrome.storage, so work survives closing the panel.",
    ],
    engineering: [
      "Prompt caching keeps the long rubric system prompt cheap to resend.",
      "Each call records its model, latency, and cost, so spend is visible per field.",
      "A client-side QA validator checks drafts against the rubric rules before they are used.",
      "The build type-checks with TypeScript before Vite bundles the extension.",
    ],
    outcome: ["A free-text track description becomes 13 structured fields in one pass."],
    aiAngle:
      "Claude, through Anthropic tool use, reads the description and fills the structured metadata fields.",
    status: "Prototype",
  },
  {
    slug: "source-interactive-book-prototype",
    client: "Client prototype brief",
    role: "Solo designer & engineer",
    summary:
      "Readers answer a guided questionnaire, typed or spoken, and receive a personalized 4-chapter illustrated storybook, with a separate executive dashboard.",
    challenge: [
      "The client needed to test the product idea with real readers before building a backend.",
      "Answering many questions in one sitting is a lot to ask, so progress had to save.",
    ],
    approach: [
      "Backend-free V1 using browser storage, so the full experience can be tested with zero setup.",
      "Book generation sits behind one function, so it can be swapped for an LLM call without UI changes.",
      "24 questions, a representative subset of the planned 50 to 80, so a test session fits in about 20 minutes.",
      "Print-to-PDF doubles as \"download your book\".",
    ],
    built: [
      "24-question questionnaire with voice input via the Web Speech API",
      "Autosave on every keystroke and resume at the first unanswered question",
      "4-chapter storybook reader with print-to-PDF; the reader titles the final chapter",
      "Dark-mode executive dashboard with KPI cards, funnels, and live reader data",
      "Custom \"Crayon Storybook\" design system",
    ],
    architecture: [
      "Next.js 15 app with Tailwind v4, exported as a static site and deployed to GitHub Pages by GitHub Actions.",
      "All reader data lives in browser storage behind one store module, so a real database only touches that file.",
      "One generator function turns the answers into a typed book object that the reader renders.",
      "A separate admin dashboard built with shadcn/ui and Recharts reads live reader data from the browser.",
    ],
    engineering: [
      "Book generation is deterministic now and designed so an LLM call can replace one function with no UI changes.",
      "Every keystroke autosaves, and login resumes at the first unanswered question.",
      "Layouts were checked at phone width.",
      "Known V1 limits are documented: data lives in one browser and local passwords are not production-grade.",
    ],
    outcome: ["A working end-to-end prototype at a public URL, testable with no backend."],
    status: "Prototype",
  },
];

export const caseStudies: Record<string, CaseStudy> = Object.fromEntries(
  list.map((c) => [c.slug, c])
);
