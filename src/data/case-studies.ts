// Case studies for every project in portfolio-data.ts, keyed by slug(title).
// Grounded in portfolio-data and the project repos; no invented metrics.

export type CaseStudy = {
  slug: string; // slugify(project.title): lowercase, non-alphanumerics → "-", trimmed
  client: string; // anonymized, e.g. "250K-member electric cooperative" or "Own product"
  role: string; // e.g. "Solo architect & full-stack engineer"
  summary: string; // 1–2 sentences, the elevator pitch
  challenge: string[]; // 2–4 bullets: the business problem in the client's terms
  approach: string[]; // 2–4 bullets: key decisions and why (architecture, guardrails, trade-offs)
  built: string[]; // 3–6 bullets: what was delivered (features/capabilities)
  outcome: string[]; // 1–4 bullets: results ONLY if sourced; else qualitative, verifiable statements
  aiAngle?: string; // one sentence on where AI/automation does the work, only if true
  status: "Live" | "In production" | "In build" | "Prototype" | "Design";
};

const list: CaseStudy[] = [
  {
    slug: "sneaker-symphony-ai-run-marketplace",
    client: "Own product",
    role: "Founder & solo full-stack engineer",
    summary:
      "A Philippine sneaker marketplace at sneakersymphony.com, built and run by one person. Catalog import and social content run on automation, so the store does not need a team.",
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
      "Tiered price suggestions and bulk pricing tools for unpriced items",
      "Claude API content pipeline that writes and schedules posts for FB, IG, and TikTok",
      "Mobile-first checkout with GCash, Maya, and card payments",
      "Invoice storage on Cloudflare R2 and buyer emails through Amazon SES",
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
      "An operations platform for a multi-branch pharmacy and clinic operator: point-of-sale dispensing, PhilHealth checks and claims, inventory, and a live CEO view across every branch.",
    challenge: [
      "PhilHealth claims that are late or incomplete get denied, and the filing window closes after 60 days.",
      "Staff found out about eligibility problems and expired stock after the sale, not before.",
      "The owner needed one platform for many branches without one branch seeing another's data.",
    ],
    approach: [
      "Multi-tenant from day one: every tenant and branch is isolated at the database with row-level security, not just hidden in the UI.",
      "Features are built once and switched on per tenant and per branch with module flags, checked in the UI and again in the database.",
      "Isolation is tested, not assumed: a two-tenant matrix proves tenant A sees zero tenant B rows on every table and role.",
    ],
    built: [
      "Dispensing POS with FEFO batch tracking and BIR receipts",
      "PhilHealth eligibility checks at the counter",
      "Automatic claims assembly with an aging clock against the 60-day deadline",
      "Inventory, branch transfers, purchase orders, and low-stock alerts",
      "CEO dashboards across all branches, plus a vendor admin to manage tenants and modules",
    ],
    outcome: [
      "The operator runs every branch from one platform, with data isolated per tenant and a live CEO view.",
    ],
    status: "Live",
  },
  {
    slug: "ai-assisted-refund-automation",
    client: "250K-member electric cooperative",
    role: "Solo architect & engineer",
    summary:
      "Automates a daily refund and correction approval queue that staff worked by hand across two billing systems. Claude explains the flagged cases; a human confirms every action.",
    challenge: [
      "Every refund or correction meant checking records in one system and making matching changes in another, by hand.",
      "Mistakes touch customer ledgers and payments, so speed could not come at the cost of control.",
      "Unusual cases sat in the queue with no explanation of what was wrong.",
    ],
    approach: [
      "One handler per request type, each running a dry run first, then executing in one transaction with a reverse script ready.",
      "Staged autonomy: analyze, then human confirm, then execute. Unknown request types are skipped and left for a person.",
      "The AI is advisory only. It runs with read-only tools, answers in a fixed schema, and never writes or approves.",
      "AI calls are cached per case and capped per run, and an AI failure never fails the batch.",
    ],
    built: [
      "Daily analyze run that checks each pending request against the billing records",
      "Per-type handlers with dry run, single-transaction execution, and reverse scripts",
      "Audit table recording every decision and the reason behind it",
      "AI notes on flagged items: category, a plain Taglish explanation, a suggested fix, the next step, and confidence",
      "\"Plan with AI\": a suggested field fix is re-checked by the same deterministic rules, and only executes if those rules approve",
      "Operator dashboard showing the why, the planned writes, and the confirm button",
    ],
    outcome: [
      "A manual daily approval queue becomes dry-run, AI-explained, human-confirmed actions.",
    ],
    aiAngle:
      "Claude reads each flagged case read-only and returns a structured note explaining what went wrong and what to do next, while deterministic rules and a human make every decision.",
    status: "In production",
  },
  {
    slug: "acirs-24-7-ai-customer-support",
    client: "250K-member electric cooperative",
    role: "Solo architect & engineer",
    summary:
      "An AI customer-support system that answers members around the clock from the company knowledge base, hands off to the right department, and builds a customer record from every conversation.",
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
    outcome: ["2 weeks of manual work → under 5 minutes, two clicks."],
    aiAngle:
      "Automation replaces the manual data pull and report building end to end.",
    status: "In production",
  },
  {
    slug: "itasm-v2-it-help-desk-asset-management",
    client: "Electric cooperative with about 300 employees across 12 offices",
    role: "Solo architect & full-stack engineer",
    summary:
      "A help desk, asset register, maintenance shop, and IT room wallboard that replaced phone calls, walk-ins, paper forms, and spreadsheets.",
    challenge: [
      "IT requests came by phone, walk-in, and paper, and they got lost.",
      "Nobody could say for sure who held which computer.",
      "The paper approval chain left no trail.",
    ],
    approach: [
      "Crash-safe by design: each write is one short transaction, and emails go into an outbox in the same transaction, so a crash never loses or duplicates one.",
      "Every create carries an idempotency key, so a retry after a timeout never files a second ticket.",
      "Runs on a single server with no message broker, and reports run in their own worker so they never slow the help desk.",
      "Test-driven, with a quality gate (types, tests, and load tests) that must pass before anything merges.",
    ],
    built: [
      "Help desk with a business-hours SLA engine: warning at 75%, breach at 100%, then automatic escalation",
      "QR asset tags with signed custody receipts",
      "Maintenance shop with repair requests, work orders, and preventive maintenance",
      "Report center with 12 reports in 4 formats",
      "Mobile PWA for employees and technicians",
      "Live TV wallboard for the IT room with rotating pages and breach alerts",
    ],
    outcome: [
      "Load-tested at 300 simultaneous requests with no duplicate ticket numbers.",
      "A 15,000-ticket report returns in under 500 ms (p95) in testing, while the help desk keeps running.",
    ],
    status: "In production",
  },
  {
    slug: "p3-online-billing-portal",
    client: "250K-member electric cooperative",
    role: "Solo architect & full-stack engineer",
    summary:
      "A self-service portal where consumers see their bills, payments, and usage, report outages, and read news, without ever putting load on the billing system.",
    challenge: [
      "Consumers had to visit or call an office to check a bill or a payment.",
      "The billing database is live, shared with tellers, and must never be exposed to the internet.",
      "Account access has to be secure without making sign-up hard.",
    ],
    approach: [
      "An on-prem sync agent is the only part that touches the billing database. It reads only, pushes outbound, and opens no inbound ports.",
      "The agent uses rate limiting and a circuit breaker, so the portal never slows the system of record.",
      "If a sync fails, the portal keeps serving the last data with an \"as of\" time instead of going down.",
      "Accounts are claimed with an email code plus a detail from a real bill or receipt, with rate limits on failed attempts.",
    ],
    built: [
      "Bills, payments, and usage history",
      "Bill calculator, rates, and news",
      "Outage reports",
      "Staff areas for claims, tickets, and dispatch",
      "Sync agent mirroring billing data to the cloud on a schedule",
    ],
    outcome: [
      "Live at app.panelco3.online.",
      "The portal reads from a mirror, so consumer traffic never reaches the billing database.",
    ],
    status: "Live",
  },
  {
    slug: "agam-distributed-registration",
    client: "250K-member electric cooperative",
    role: "Solo architect & full-stack engineer",
    summary:
      "QR-based registration for an Annual General Assembly Meeting that checked in 13,000 attendees across 5 simultaneous venues.",
    challenge: [
      "Paper registration meant long queues and manual errors.",
      "Token and meal distribution suffered from chronic abuse.",
      "Organizers had no live view of turnout across venues.",
    ],
    approach: [
      "Hybrid design: membership is validated read-only against the cooperative's system of record, while registrations live in Supabase.",
      "Supabase Realtime pushes counts to a live dashboard the moment someone checks in.",
      "Check-ins are cryptographically verifiable, with a full audit trail.",
    ],
    built: [
      "QR and barcode check-in from staff phones, plus manual search",
      "Real-time membership validation at the door",
      "Pre-registration portal with a downloadable QR card",
      "Live LED-wall dashboard by venue, town, and barangay",
      "Reports in PDF, Excel, and Word",
      "115+ source files and 25+ API endpoints",
    ],
    outcome: [
      "13,000 attendees checked in across 5 simultaneous venues.",
      "The audit trail was accepted as an official NEA documentary requirement.",
    ],
    status: "Live",
  },
  {
    slug: "azure-hybrid-cloud-migration",
    client: "250K-member electric cooperative",
    role: "Sole architect",
    summary:
      "A ₱14.95M multi-milestone migration of core operational workloads to Microsoft Azure, keeping compliance-bound systems on-prem.",
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
    outcome: ["A ₱14.95M program led by a single architect."],
    status: "In build",
  },
  {
    slug: "internal-ndr-class-network-detection",
    client: "250K-member electric cooperative",
    role: "Architect & engineer",
    summary:
      "An in-house network behavioral monitoring system for east-west traffic and lateral movement, a class of tool usually bought from enterprise vendors.",
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
    outcome: ["NDR-class detection built in-house, with no enterprise license."],
    status: "In production",
  },
  {
    slug: "p3-consumer-e-invoicing",
    client: "250K-member electric cooperative",
    role: "Solo architect & engineer",
    summary:
      "A notification service built to deliver statements of account and disconnection notices to opted-in consumers by email and SMS, with automatic provider fallback.",
    challenge: [
      "Statements and disconnection notices went out on paper and by hand.",
      "One SMS provider is a single point of failure for notices that must arrive.",
      "Bulk sends need cost control and a clear record of who received what.",
    ],
    approach: [
      "A self-contained service with its own database, auth, and queue, so it does not depend on other systems.",
      "An SMS fallback chain across providers, so one provider's outage does not stop delivery.",
      "Every provider runs in mock mode until real credentials are saved, so demos exercise the same code paths as live sends.",
      "Provider credentials are encrypted at rest with AES-256-GCM.",
    ],
    built: [
      "Password-protected PDF invoices by email",
      "SMS with an automatic provider fallback chain",
      "Batch targeting by area office, municipality, and barangay, with a cost estimate before sending",
      "Contact registry with CSV import, plus email and SMS templates",
      "Staged disconnection notices: standard, warning, final",
      "360° delivery dashboard with funnels, trends, and failure breakdowns",
    ],
    outcome: [
      "Architected for bulk invoicing to the cooperative's 183K+ consumers.",
      "Batch, queue, fallback, and delivery tracking are built and run end to end in mock mode.",
    ],
    aiAngle:
      "Automation handles targeting, sending, fallback, and delivery tracking, so staff start a batch instead of mailing notices.",
    status: "In build",
  },
  {
    slug: "pfas-partner-file-automation-system",
    client: "250K-member electric cooperative",
    role: "Author & engineer",
    summary:
      "A web-based ETL platform that ingests partner files from FTP/SFTP and email attachments into MS SQL Server on a schedule.",
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
    outcome: ["Replaces a manual daily download-parse-import workflow with scheduled jobs."],
    aiAngle: "Scheduled jobs do the daily file ingestion that staff used to do by hand.",
    status: "In production",
  },
  {
    slug: "hci-server-infrastructure",
    client: "250K-member electric cooperative",
    role: "Infrastructure architect",
    summary:
      "The hyperconverged cluster that runs production billing, MIMS, and operational VMs, with written recovery procedures.",
    challenge: [
      "Production billing and operations need infrastructure that survives hardware failure.",
      "A disk failure on the billing stack needs a known, tested recovery path.",
    ],
    approach: [
      "Hyperconverged infrastructure with RF=2 clusters for redundancy.",
      "Incident response procedures written before they were needed.",
    ],
    built: [
      "HCI cluster for production billing, MIMS, and operational VMs",
      "VM orchestration on Linux-based infrastructure",
      "Disk-failure recovery procedures for the production billing and MRMS stack",
    ],
    outcome: ["Runs the cooperative's production billing and operational workloads."],
    status: "In production",
  },
  {
    slug: "focuscanvas-desktop-saas",
    client: "Own product",
    role: "Builder",
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
    outcome: ["Native cross-platform build without Electron."],
    status: "In build",
  },
  {
    slug: "api-middleware-in-design",
    client: "250K-member electric cooperative",
    role: "Architect",
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
    outcome: ["The planned next step after PFAS, from one-way ingest to two-way integration."],
    status: "Design",
  },
  {
    slug: "iemop-wesm-invoice-automation",
    client: "250K-member electric cooperative",
    role: "Solo architect & full-stack engineer",
    summary:
      "Automated PDF invoicing for the Philippine wholesale electricity spot market. A batch that took a full workday now runs in under 30 seconds.",
    challenge: [
      "A ~50-invoice settlement batch took a full workday of copying data into templates.",
      "Participant TINs and addresses were looked up by hand, and errors were common.",
      "Invoice numbers come from a ledger shared with a live billing system, so a mistake could collide with a real invoice.",
    ],
    approach: [
      "A fail-closed write gate: two independent settings must both say production, or the app writes to a sandbox.",
      "Invoice numbers are allocated atomically from the shared ledger without blocking other users, with automatic retry on a collision.",
      "One source of data from upload to PDF, so nothing is retyped.",
    ],
    built: [
      "CSV upload, preview, and one-click batch generation with live progress",
      "Participant registry that resolves TIN and address automatically",
      "Pixel-accurate PDFs matching the official invoice format",
      "Per-invoice, consolidated, and ZIP downloads",
      "Dashboard and an automatic audit record of every invoice",
    ],
    outcome: [
      "A full workday of manual invoicing → under 30 seconds, zero transcription errors.",
      "59 passing tests.",
    ],
    aiAngle:
      "Automation handles registry lookups, numbering, and PDF rendering, so staff upload a file and review the result.",
    status: "In production",
  },
  {
    slug: "mrms-meter-reading-management",
    client: "250K-member electric cooperative",
    role: "Solo full-stack engineer",
    summary:
      "A modernization of the meter reading system from procedural PHP and jQuery to a Fastify and React SPA, running side by side with the old system on the same live database.",
    challenge: [
      "Meter reading operations ran on an aging procedural PHP system.",
      "The live database could not be changed or taken down for a migration.",
    ],
    approach: [
      "Zero-migration compatibility: the new stack uses the existing MySQL schema unchanged, so both stacks run at once.",
      "Incremental cutover instead of a big-bang rewrite.",
      "Slow legacy queries replaced with joins and cached lookups.",
    ],
    built: [
      "Fastify API and React 18 SPA with 11 route-level pages",
      "12 report modules with PDF and CSV export",
      "Reader scheduling, assignment, and route resequencing",
      "Role-based routing with JWT access and refresh tokens",
    ],
    outcome: ["Legacy and modern stacks run side by side against the live database, with no downtime for migration."],
    status: "In production",
  },
  {
    slug: "pemcc-real-time-election-platform",
    client: "Employee cooperative",
    role: "Solo full-stack engineer",
    summary:
      "The full election lifecycle on members' own phones: registration, admin-approved QR ballot access, live tallies, and exportable reports.",
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
    outcome: ["Hundreds of members can vote simultaneously from their own phones."],
    status: "In production",
  },
  {
    slug: "event-registration-raffle-platform",
    client: "Electric cooperative (year-end employee event)",
    role: "Solo full-stack engineer",
    summary:
      "An all-in-one corporate event system: QR self-registration, real-time check-in, and a raffle engine with broadcast overlays for live projection.",
    challenge: [
      "Manual registration and ticketing at the door creates lines and duplicates.",
      "Raffle draws on stage need to look good and be fair.",
      "There is no time to run servers on event day.",
    ],
    approach: [
      "Fully serverless on Supabase, so there is no backend to operate on event day.",
      "Registrations are validated against the employee database, with duplicate prevention.",
    ],
    built: [
      "QR self-registration with unique ticket codes and email confirmations",
      "Real-time check-in by camera scan, image upload, or manual entry",
      "Multi-mode raffle engine with eligibility rules and an audit trail",
      "OBS broadcast overlays for live projection",
      "Admin dashboard with exports",
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
      "Bulk add, edit, and delete of monitored devices",
      "CSV and JSON export",
    ],
    outcome: ["Device status updates live on the dashboard without a page refresh."],
    status: "Prototype",
  },
  {
    slug: "gm-live-collections-dashboard",
    client: "250K-member electric cooperative",
    role: "Solo full-stack engineer",
    summary:
      "A real-time collections dashboard for the General Manager that runs on the office TV and on a phone, and can never touch the financial system of record.",
    challenge: [
      "The General Manager waited for end-of-day reports to know the day's collections.",
      "Revenue lost to voided receipts was not visible.",
      "An executive tool must not slow down or write to the production billing database.",
    ],
    approach: [
      "A least-privilege, read-only database login, so writes are denied at the database itself.",
      "Poll-and-cache: the server queries on its own timer and serves cached results, so any number of viewers costs one database reader.",
      "If the database is unreachable, the screen keeps the last data with an \"as of\" badge instead of going blank.",
      "Error details that name people stay on the phone view, not the shared TV.",
    ],
    built: [
      "Today's totals with comparisons to yesterday and last month",
      "Per-office breakdown and map",
      "Teller ranking",
      "Revenue lost to voided receipts",
      "TV kiosk mode and an installable phone app",
    ],
    outcome: [
      "Any number of viewers costs one database reader.",
      "The dashboard has no write path to the financial system.",
    ],
    status: "In production",
  },
  {
    slug: "sonicsense-ai-music-metadata-engine",
    client: "Own product",
    role: "Solo engineer",
    summary:
      "A Chrome side-panel extension that turns a free-text track description into structured release metadata in one pass.",
    challenge: [
      "Filling release metadata by hand for every track is slow and inconsistent.",
      "Instruments, mood, and arrangement notes live in the producer's head, not in a form.",
    ],
    approach: [
      "Anthropic tool use returns structured fields, not free text, so output drops straight into a form.",
      "A side panel keeps the tool next to the page being filled in.",
    ],
    built: [
      "Extraction of 13 global fields from a raw description",
      "Per-section narratives with instruments, vibe tags, and arrangement notes inferred automatically",
      "Chrome MV3 side panel with a keyboard shortcut",
    ],
    outcome: ["A free-text track description becomes 13 structured release fields in one pass."],
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
      "Print-to-PDF doubles as \"download your book\".",
    ],
    built: [
      "24-question questionnaire with voice input via the Web Speech API",
      "Autosave on every keystroke and resume at the first unanswered question",
      "4-chapter storybook reader with print-to-PDF",
      "Dark-mode executive dashboard with KPI cards, funnels, and live reader data",
      "Custom \"Crayon Storybook\" design system",
    ],
    outcome: ["A working end-to-end prototype at a public URL, testable with no backend."],
    status: "Prototype",
  },
];

export const caseStudies: Record<string, CaseStudy> = Object.fromEntries(
  list.map((c) => [c.slug, c])
);
