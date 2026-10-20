// Portfolio Data: AI Engineer positioning, hybrid attribution
// Last updated: 2026-10-19
// Hero stats are calibrated to actual scope. No inflated numbers.
// This file is also the knowledge base for the on-site assistant, so keep it true.

export const personalInfo = {
  name: "Les John Paul Oliver",
  title: "AI Engineer",
  pitch: "I build AI systems and automations that solve real business problems, and I ship them fast.",
  tagline:
    "AI engineer who ships fast. Production systems for a 250K-member utility cooperative by day, AI products by night.",
  email: "lesjohnpauloliver@gmail.com",
  location: "Pangasinan, Philippines",
  availability: "Open to freelance projects & remote AI engineering roles",
  resumeUrl: "/les-john-paul-oliver-resume.pdf",
  social: {
    github: "https://github.com/lesjohnpaul",
    linkedin: "https://www.linkedin.com/in/lesjohnpaul/",
  },
};

// Hero stats: only numbers I can defend in an interview.
// No inflation, no rounding up, no "100+ optimized systems."
// First-10-seconds framing for business owners: the numbers Les moves. Every "after" value is a
// shipped result already stated in `projects`; "before" values are the client's own baseline.
export const heroOutcome =
  "I help business owners grow revenue, cut costs, and win back hours with AI that does the busywork.";

export const heroOutcomes = [
  { lever: "More revenue", icon: "TrendingUp", what: "Leads answered", before: "Office hours", after: "24/7", proof: "AI assistant, live on this page" },
  { lever: "Lower costs", icon: "TrendingDown", what: "Compliance reporting", before: "2 weeks", after: "< 5 min", proof: "Tax compliance automation" },
  { lever: "Hours back", icon: "Clock", what: "Invoice batch", before: "1 workday", after: "< 30 sec", proof: "Wholesale power invoicing" },
];

export const heroStats = [
  { label: "Years in Enterprise IT", value: "10+" },
  { label: "Systems Shipped", value: "16+" },
  { label: "End Users Served", value: "250K+" },
];

// Services: what a client can hire me for. Each one points at real proof.
export const services = [
  {
    title: "AI Agents & Chatbots",
    icon: "Bot",
    problem: "Customers wait hours for answers, and leads go cold after office hours.",
    offer:
      "24/7 assistants grounded in your own knowledge base that answer, qualify, book meetings, and hand off to a human when it matters.",
    proof: "ACIRS customer-support AI (launching Q1 2027) and the assistant on this site",
  },
  {
    title: "Business Process Automation",
    icon: "Workflow",
    problem: "Your team loses days to reports, invoicing, and copy-paste between systems.",
    offer:
      "One-click workflows that pull from your databases, generate documents, and send them out, with audit trails and no transcription errors.",
    proof: "Tax compliance: 2 weeks → under 5 minutes. WESM invoicing: a full workday → under 30 seconds",
  },
  {
    title: "LLM Features in Your Product",
    icon: "Brain",
    problem: "You know AI could help your app, but not where it pays off or how to ship it safely.",
    offer:
      "Extraction, classification, content generation, and tool-use added to the app you already have, scoped to features users will actually use.",
    proof: "SonicSense metadata engine and the Sneaker Symphony content pipeline (Claude API)",
  },
  {
    title: "Internal Tools & Dashboards",
    icon: "Code",
    problem: "Operations run on spreadsheets, paper forms, and phone calls.",
    offer:
      "Full-stack web apps on top of your existing databases: registration, ticketing, monitoring, and live executive dashboards.",
    proof: "AGAM registration: 13K attendees across 5 live venues",
  },
  {
    title: "AI Motion Graphics",
    icon: "Clapperboard",
    problem: "You need product videos and social content, but a studio is slow and expensive.",
    offer:
      "AI-assisted motion graphics, explainers, and branded visuals produced quickly for launches and campaigns.",
    proof: "The animated assistant and motion pieces on this site",
  },
];

// AI operations buyers most often need (2026 SMB surveys: customer service, marketing/lead gen,
// bookkeeping/back office, data analysis), each tied to work Les has shipped.
// `log` lines are an illustrative simulated run, labeled as such in the UI.
export const aiOperations = [
  {
    id: "support",
    title: "24/7 Support & Lead Capture",
    pain: "Customers message at 3 a.m. Nobody answers, and the lead goes to a competitor.",
    steps: [
      { kind: "Trigger", icon: "MessageSquare", title: "A customer messages", detail: "Web chat, Messenger, or Viber, any hour" },
      { kind: "AI", icon: "Bot", title: "Agent answers from your knowledge base", detail: "Scoped to your business; refuses off-topic and abuse" },
      { kind: "Decide", icon: "GitBranch", title: "Books a call or escalates", detail: "Checks your calendar, or hands off to the right person" },
      { kind: "Done", icon: "BellRing", title: "Lead logged, owner notified", detail: "CRM record plus an instant email and Telegram ping" },
    ],
    log: [
      "02:47:03  chat.received        channel=messenger",
      "02:47:05  agent.answered       topic=pricing-inquiry",
      "02:47:41  intent.detected      wants=discovery-call",
      "02:48:02  calendar.booked      Tue 10:00 · invite sent",
      "02:48:03  owner.notified       telegram ✓  email ✓",
    ],
    proof: "Running on this page right now: Pao answers, books calls, and pings Les. ACIRS brings it to a 250K-member utility in Q1 2027.",
  },
  {
    id: "leadgen",
    title: "Lead Generation & Web Scraping",
    pain: "Your sales team spends hours hunting prospects and copying contact details into spreadsheets.",
    steps: [
      { kind: "Trigger", icon: "Target", title: "Define your ideal customer", detail: "Industry, location, size, buying signals" },
      { kind: "Automate", icon: "Globe", title: "Scrape public sources on a schedule", detail: "Directories, maps, and marketplaces, within each site's terms" },
      { kind: "AI", icon: "Sparkles", title: "Enrich, score, and personalize", detail: "AI ranks fit and drafts a first message for each lead" },
      { kind: "Done", icon: "UserPlus", title: "Qualified leads land in your CRM", detail: "Deduplicated, with source links, ready to contact" },
    ],
    log: [
      "06:00:00  crawl.started        sources=3",
      "06:04:12  records.extracted    public listings",
      "06:04:15  dedupe.completed     duplicates removed",
      "06:05:02  ai.scored            hot · warm · skip",
      "06:05:03  crm.synced           drafts ready for review",
    ],
    proof: "Sneaker Symphony runs a scrape-to-catalog pipeline that imports product listings automatically, and Pao captures and qualifies leads on this page.",
  },
  {
    id: "backoffice",
    title: "Invoicing, Refunds & Compliance",
    pain: "Staff spend days copying data between systems and building documents by hand.",
    steps: [
      { kind: "Trigger", icon: "Database", title: "Data lands in your system", detail: "Billing database, CSV export, or email attachment" },
      { kind: "Automate", icon: "ScanSearch", title: "Validate, match, and classify", detail: "Every record checked against your rules and registries" },
      { kind: "AI", icon: "Sparkles", title: "AI explains the exceptions", detail: "Flags odd items with a plain-language note; never approves on its own" },
      { kind: "Done", icon: "FileCheck2", title: "Documents generated and filed", detail: "PDFs, emails, and an audit trail after one human sign-off" },
    ],
    log: [
      "08:00:00  batch.started        records=50",
      "08:00:04  registry.matched     tin+address 50/50",
      "08:00:06  ai.flagged           2 items · note: possible duplicate",
      "08:00:41  human.approved       48 · held 2",
      "08:00:44  documents.sent       pdf ✓  email ✓  audit ✓",
    ],
    proof: "Tax compliance went from 2 weeks of manual work to under 5 minutes. WESM invoicing went from a full workday to under 30 seconds.",
  },
  {
    id: "dashboards",
    title: "Live Owner & Executive Dashboards",
    pain: "Owners wait for end-of-day reports and find problems after the money is gone.",
    steps: [
      { kind: "Trigger", icon: "Store", title: "Transactions happen across branches", detail: "Sales, collections, stock movements" },
      { kind: "Sync", icon: "RefreshCw", title: "Mirrored read-only, every few seconds", detail: "Reporting never touches your system of record" },
      { kind: "Analyze", icon: "TriangleAlert", title: "Flags what needs attention", detail: "Voided receipts, low stock, a branch falling behind" },
      { kind: "Done", icon: "MonitorSmartphone", title: "The owner sees it live", detail: "On the office TV and on their phone" },
    ],
    log: [
      "09:15:00  sync.completed       branches=5 · read-only",
      "09:15:01  ranking.updated      tellers by speed + accuracy",
      "09:15:02  alert.raised         voided receipts above normal · branch 2",
      "09:15:02  view.refreshed       tv ✓  phone ✓",
      "09:15:30  sync.completed       branches=5 · read-only",
    ],
    proof: "Shipped as the GM Live Collections Dashboard and WeCare's multi-branch CEO view, both built read-only by design.",
  },
  {
    id: "analytics",
    title: "AI Analytics That Prescribes",
    pain: "Charts show what already went wrong. Nobody tells you what to do before it happens.",
    steps: [
      { kind: "Trigger", icon: "Database", title: "Your data streams in", detail: "Sales, stock, collections, support tickets" },
      { kind: "Analyze", icon: "Activity", title: "Spots anomalies and trends", detail: "Compared against your normal pattern, per branch and per day" },
      { kind: "AI", icon: "Lightbulb", title: "Recommends the next move", detail: "A plain-language suggestion with the reason behind it" },
      { kind: "Done", icon: "ShieldCheck", title: "You act before it costs you", detail: "Approve the suggestion; the system tracks the outcome" },
    ],
    log: [
      "07:30:00  baseline.refreshed   last 30 days",
      "07:30:02  anomaly.detected     item A selling fast · branch 2",
      "07:30:03  forecast.stockout    thursday",
      "07:30:04  ai.recommended       transfer stock from branch 4",
      "07:31:10  owner.approved       transfer created",
    ],
    proof: "Built on patterns already shipped: the GM dashboard surfaces revenue lost to voided receipts, and the refund automation's AI explains every anomaly in plain language.",
  },
];

export const processSteps = [
  { step: "01", title: "Map the problem", text: "A 30-minute call to find the workflow that costs you the most time or money." },
  { step: "02", title: "Prototype fast", text: "A working version early, so you see results before committing to the full build." },
  { step: "03", title: "Ship & hand over", text: "Production deployment, documentation, and support options once it's live." },
];

export const coreSkills = [
  {
    category: "AI & Agentic Systems",
    icon: "Brain",
    description:
      "LLM-powered assistants, tool-calling agents, and AI features in production apps. Built on the Claude API with guardrails, human escalation, and cost controls.",
    skills: [
      "Claude API / Tool Use",
      "AI Agents & Chatbots",
      "Knowledge-Base Grounding",
      "Human Escalation Flows",
      "OpenAI",
      "Claude Code",
      "AI Motion Graphics",
    ],
    highlight: true,
  },
  {
    category: "Business Automation",
    icon: "Workflow",
    description:
      "Turning multi-day manual workflows into one-click runs: document generation, invoicing, ETL, scraping, and scheduled jobs.",
    skills: [
      "Process Automation",
      "n8n",
      "Inngest",
      "PDF Pipelines",
      "Web Scraping & Import",
      "ETL Design",
      "API Integration",
    ],
    highlight: true,
  },
  {
    category: "Cloud Architecture",
    icon: "Cloud",
    description:
      "Designing hybrid cloud topologies, leading multi-million peso migrations, and integrating on-prem infrastructure with public cloud.",
    skills: [
      "Microsoft Azure",
      "AWS",
      "GCP",
      "Hybrid Cloud Topology",
      "Cloud Migration",
      "Disaster Recovery",
      "Identity & Access",
      "Vendor Management",
    ],
    highlight: true,
  },
  {
    category: "Database Administration",
    icon: "Database",
    description:
      "Production DBA for a 1.17TB MS SQL Server billing instance plus MySQL/PostgreSQL stacks. Backup orchestration, query optimization, and incident recovery.",
    skills: [
      "MS SQL Server",
      "MySQL",
      "PostgreSQL",
      "Supabase",
      "Backup & DR",
      "Query Optimization",
      "DBCC Recovery",
      "MagicXPA Enterprise",
    ],
    highlight: true,
  },
  {
    category: "Distributed & Web Systems",
    icon: "Code",
    description:
      "End-to-end design and implementation of distributed registration, real-time analytics, and integration platforms, solo or with very small teams.",
    skills: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "FastAPI",
      "Node.js",
      "Python",
      "PHP",
      "REST / API Design",
    ],
    highlight: true,
  },
  {
    category: "Network & Security Engineering",
    icon: "Layers",
    description:
      "Built an internal NDR-class lateral-movement detection system in-house, territory typically owned by enterprise vendors at premium licensing.",
    skills: [
      "NDR / Behavioral Detection",
      "Network Monitoring",
      "Linux / Ubuntu",
      "Incident Response",
      "Cybersecurity Programs",
      "Lateral Movement",
      "East-West Traffic",
    ],
    highlight: false,
  },
];

// Hidden talents: kept honest. These are real practices, not bullet padding.
export const hiddenTalents = [
  {
    category: "Music Production",
    icon: "Music",
    description:
      "Working keys player on Nord Stage 4 88 in an indie band with three originals in pre-release and major-label discussions in progress. Producer and arranger across two locally-released indie albums plus singles, performing professionally on stages. Recording/mixing engineer in Logic Pro X on MacBook Pro. Deep stem-level listening across R&B, OPM, jazz, rock, worship, indie, and electronic music.",
    skills: [
      "Nord Stage 4 88",
      "Logic Pro X",
      "Music Arrangement",
      "Recording & Mixing",
      "Stem-Level Analysis",
      "Multi-Genre Fluency",
      "Original Composition",
    ],
    color: "from-purple-500 to-pink-500",
  },
  {
    category: "Choir Direction",
    icon: "Music",
    description:
      "15+ years directing and teaching a Catholic liturgical SATB choir: arranging and adapting hymns weekly, deep multi-part harmonic analysis, voice leading, and ensemble leadership. Recently composed an original Communion hymn in 8.8.8.8 Long Meter compatible with traditional tune families.",
    skills: [
      "SATB Direction (15+ yrs)",
      "Hymn Arrangement",
      "Harmonic Analysis",
      "Voice Leading",
      "Liturgical Composition",
      "Ensemble Leadership",
    ],
    color: "from-blue-500 to-cyan-500",
  },
  {
    category: "Visual Art",
    icon: "Palette",
    description:
      "Abstract painting as a hobby practice: composition, color theory, and the same intuition I bring to UI work.",
    skills: [
      "Abstract Painting",
      "Color Composition",
      "Visual Design",
      "Aesthetic Judgment",
    ],
    color: "from-orange-500 to-amber-500",
  },
  {
    category: "Solo Building",
    icon: "Rocket",
    description:
      "Shipping personal products without a team: Sneaker Symphony marketplace, FocusCanvas desktop SaaS, and this portfolio. Full ownership end-to-end.",
    skills: [
      "Solo Full-Stack",
      "Product Strategy",
      "PRD Authoring",
      "Self-Directed Delivery",
      "Modern Stacks",
    ],
    color: "from-green-500 to-emerald-500",
  },
  {
    category: "Workflow Automation",
    icon: "Workflow",
    description:
      "Compressing manual workflows into clicks. The kind of automation that turns a 2-week regulatory cycle into a 5-minute run.",
    skills: [
      "Process Automation",
      "n8n",
      "Claude Code Pipelines",
      "ETL Design",
      "API Integration",
    ],
    color: "from-red-500 to-rose-500",
  },
];

// Experience: real timeline, hybrid attribution.
// PANELCO III is named (it's public-facing employment).
// Specific systems with security implications stay anonymized in description.
export const experience = [
  {
    role: "System Administration Officer & Solutions Architect",
    company: "PANELCO III · Electric Cooperative",
    period: "2016 - Present",
    description:
      "Sole-architect role spanning cloud infrastructure, AI systems, network security, distributed apps, and production DBA work for a 250,000+ member utility. Reports through CSD/SAD chain.",
    achievements: [
      "Sole architect of a ₱14.95M Azure hybrid cloud migration covering identity, collaboration, and DR",
      "Building ACIRS, a 24/7 AI customer-support system with knowledge-base answers, auto-escalation, and an automatic Customer-360 CRM (launching Q1 2027)",
      "Built a distributed QR-based registration platform handling 13K attendees across 5 simultaneous venues",
      "Authored an internal NDR-class lateral-movement detection system: east-west monitoring, in-house build",
      "Manage a 1.17TB production MS SQL Server billing instance plus MySQL/MIMS/CAS databases as DBA",
      "Cut a 2-week tax compliance reporting process to a two-click run that finishes in under 5 minutes",
      "Architected bulk PDF email invoicing for 183K+ consumers with sectorial filtering and AWS SES",
      "Authored PFAS, a partner file ETL platform replacing manual SFTP/email ingestion workflows",
      "Automated WESM settlement invoicing: a full-workday, ~50-invoice manual batch now runs in under 30 seconds with zero transcription errors",
      "Modernized the meter reading system from procedural PHP/jQuery to Fastify + React 18 with zero-migration coexistence against the live MySQL database",
      "Delivered a real-time QR-ballot election platform for the employee cooperative with live tallies and admin-approved ballot access",
    ],
  },
  {
    role: "Founder & Solo Full-Stack Developer",
    company: "Sneaker Symphony · sneakersymphony.com",
    period: "2024 - Present",
    description:
      "Building a Philippine sneaker marketplace as a solo technical founder. Mobile-first checkout, dual-gateway payments (PayMongo + HitPay), and an AI-driven content automation pipeline across FB, IG, and TikTok.",
    achievements: [
      "Authored full PRD (Sneaker Symphony Growth Engine) with 14-section architecture",
      "Stack: Next.js 15, Supabase, Vercel, Inngest, Claude API, Cloudflare R2, PayMongo",
      "Designed dual payment-gateway strategy (GCash, Maya, card) with idempotency safeguards",
      "Architected Cloudflare R2 storage for invoices and Amazon SES delivery for buyer comms",
    ],
  },
  {
    role: "Builder · FocusCanvas Desktop SaaS",
    company: "Personal Venture",
    period: "2025 - Present",
    description:
      "Cross-platform desktop productivity tool that auto-changes wallpapers based on scheduled 'Day Types'. Built with Tauri 2.0 + Rust + React for native performance.",
    achievements: [
      "Authored PRD and shipped wireframes for the v1 product surface",
      "Stack: Tauri 2.0, Rust, React, TypeScript",
      "Native cross-platform delivery (Windows, macOS, Linux) without Electron bloat",
    ],
  },
];

// Projects: real ones, with the kind of detail a hiring manager actually wants.
// `private: true` = closed-source client/employer system shown for demo purposes
// only; no repository or live link is exposed.
export type Project = {
  title: string;
  description: string;
  tech: string[];
  link: string;
  image: string;
  images?: string[];
  featured: boolean;
  private?: boolean;
  // One-line business outcome shown on the card. Only defensible numbers.
  result?: string;
  // Case-study screenshots with what each screen does. Reviewed before publishing: no real
  // names, internal emails, or infrastructure identifiers. Mobile shots render in a narrow frame.
  gallery?: { src: string; caption: string; mobile?: boolean }[];
  galleryNote?: string;
};

// Order matters: the first featured project is the large hero card.
export const projects: Project[] = [
  {
    title: "Sneaker Symphony: AI-Run Marketplace",
    description:
      "Solo-built Philippine sneaker marketplace at sneakersymphony.com, run with very little manual work. A scraping pipeline pulls product listings and imports them into the catalog, and a Claude API content pipeline writes and schedules posts across FB, IG, and TikTok. Mobile-first checkout with GCash/Maya/PayMongo payments and Cloudflare R2 invoice storage.",
    tech: ["Claude API", "Next.js 15", "Supabase", "Inngest", "PayMongo"],
    link: "https://sneakersymphony.com",
    image: "/images/projects/sneaker-symphony/01-hero.jpg",
    images: [
      "/images/projects/sneaker-symphony/01-hero.jpg",
      "/images/projects/sneaker-symphony/02-catalog.jpg",
      "/images/projects/sneaker-symphony/03-reviews.png",
      "/images/projects/sneaker-symphony/04-admin-portal.jpg",
      "/images/projects/sneaker-symphony/05-admin-dashboard.png",
    ],
    featured: true,
    result: "Catalog import and social content run on automation, so one person can operate a full store",
  },
  {
    title: "WeCare: Pharmacy POS & Dispensing Platform",
    description:
      "Live operations platform for a multi-branch pharmacy and clinic operator. Point-of-sale dispensing with FEFO batch tracking and BIR receipts, PhilHealth eligibility checks at the counter, automatic claims assembly to beat the 60-day filing deadline, plus inventory, branch transfers, purchase orders, and low-stock alerts. Solved their multi-tenant problem: every tenant and branch is isolated at the database level with row-level security, and the owners get CEO dashboards across all branches.",
    tech: ["React 19", "Supabase", "Row-Level Security", "Multi-Tenant", "PostgreSQL"],
    link: "#",
    image: "/images/projects/wecare.jpg",
    featured: true,
    private: true,
    result: "Multi-branch operator runs every branch from one platform, with data isolated per tenant and a live CEO view",
  },
  {
    title: "AI-Assisted Refund Automation",
    description:
      "Automates a daily refund and correction approval workflow that staff did by hand across two billing systems. Per-type handlers run a dry run first, then execute with a reverse script ready. For flagged items, Claude reviews the case read-only and returns a structured note: category, a plain Taglish explanation, a suggested fix, and confidence. Guardrails by design: the AI never writes and never approves; a human confirms every action.",
    tech: ["Claude (headless)", "Python", "FastAPI", "MS SQL Server", "Human-in-the-Loop"],
    link: "#",
    image: "/images/projects/ai-assisted-refund-automation/01-pending-review.webp",
    featured: true,
    private: true,
    result: "A manual daily approval queue becomes dry-run, AI-explained, human-confirmed actions",
    images: ["/images/projects/ai-assisted-refund-automation/01-pending-review.webp", "/images/projects/ai-assisted-refund-automation/02-overview.webp", "/images/projects/ai-assisted-refund-automation/03-live-activity.webp", "/images/projects/ai-assisted-refund-automation/04-run-history.webp", "/images/projects/ai-assisted-refund-automation/05-email-reports.webp"],
    gallery: [
      { src: "/images/projects/ai-assisted-refund-automation/01-pending-review.webp", caption: "Pending review: every refund request with its verdict and planned handling, confirmed by a person before anything runs." },
      { src: "/images/projects/ai-assisted-refund-automation/02-overview.webp", caption: "Overview: what is awaiting action, the live queue, and the latest analyze/execute run." },
      { src: "/images/projects/ai-assisted-refund-automation/03-live-activity.webp", caption: "Live activity console: each executed item re-checked, committed with an audit log, and a reverse script saved." },
      { src: "/images/projects/ai-assisted-refund-automation/04-run-history.webp", caption: "Run history: every analyze and execute run with its verdict mix, for a complete audit trail." },
      { src: "/images/projects/ai-assisted-refund-automation/05-email-reports.webp", caption: "Email reports: accomplishment reports sent to saved recipients in PDF, Word, Excel, or CSV." },
      { src: "/images/projects/ai-assisted-refund-automation/06-mobile-pending.webp", caption: "The review queue on a phone, with confirm and execute actions.", mobile: true },
    ],
    galleryNote: "Screens show demo data; client data stays private.",
  },
  {
    title: "ACIRS: 24/7 AI Customer Support",
    description:
      "AI customer-support and resolution system for a 250K-member utility. A chatbot answers from the company knowledge base around the clock, auto-escalates to the right department when a human is needed, and builds a Customer-360 record from every interaction, a CRM that fills itself. Channels: web chat, social, Viber, and Telegram. Launching Q1 2027.",
    tech: ["LLM Agent", "Knowledge Base", "Auto-Escalation", "Customer 360", "Omnichannel"],
    link: "#",
    image: "/images/projects/acirs.jpg",
    featured: true,
    private: true,
    result: "Designed so every inquiry gets an answer, even at 3 a.m. (in build, launching Q1 2027)",
  },
  {
    title: "Tax Compliance Automation",
    description:
      "Automated regulatory tax compliance reporting for a 250K-consumer utility. A process that took the compliance team two weeks of manual work is now two clicks: data is pulled from MS SQL Server and the regulated PDFs are generated with no manual transcription.",
    tech: ["Process Automation", "PDF Generation", "Compliance", "MS SQL Server"],
    link: "#",
    image: "/images/projects/tax-automation.jpg",
    featured: true,
    private: true,
    result: "2 weeks of manual work → under 5 minutes, two clicks",
  },
  {
    title: "ITASM v2: IT Help Desk & Asset Management",
    description:
      "Replaced IT support run on phone calls, walk-ins, paper forms, and spreadsheets for a cooperative of about 300 employees across 12 offices. Help desk with a business-hours SLA engine (warnings, breach, auto-escalation), QR asset custody with signed receipts, a maintenance shop, 12 reports in 4 formats, a mobile PWA, and a live TV wallboard for the IT room.",
    tech: ["React 19", "Node.js", "MS SQL Server", "Socket.IO", "Playwright"],
    link: "#",
    image: "/images/projects/itasm-v2/01-hero.webp",
    featured: true,
    private: true,
    result: "Load-tested at 300 simultaneous requests; a 15,000-ticket report returns in under 500 ms (p95)",
    images: ["/images/projects/itasm-v2/01-hero.webp", "/images/projects/itasm-v2/02-command-center.webp", "/images/projects/itasm-v2/03-queue-pulse.webp", "/images/projects/itasm-v2/04-today-vs-trend.webp", "/images/projects/itasm-v2/05-hot-categories.webp"],
    gallery: [
      { src: "/images/projects/itasm-v2/01-hero.webp", caption: "ITASM: the IT help desk, asset register, and TV command center for the IT room." },
      { src: "/images/projects/itasm-v2/02-command-center.webp", caption: "Command center: a live 3D SLA radar plotting every open ticket by time left, with breach and risk counts." },
      { src: "/images/projects/itasm-v2/03-queue-pulse.webp", caption: "Queue pulse: queue health score, open tickets by priority, and status mix." },
      { src: "/images/projects/itasm-v2/04-today-vs-trend.webp", caption: "Today vs trend: tickets filed and resolved over 7 days, SLA met, and response and resolution times." },
      { src: "/images/projects/itasm-v2/05-hot-categories.webp", caption: "Hot categories: which problem types are spiking this week, flagged before they become an outage." },
      { src: "/images/projects/itasm-v2/06-mobile-quick-actions.webp", caption: "Employee mobile app: one-tap tickets for the most common problems, plus asset tag scanning.", mobile: true },
    ],
    galleryNote: "Screens show demo data; client data stays private.",
  },
  {
    title: "P3 Online Billing Portal",
    description:
      "Self-service portal for an electric cooperative's consumers: bills, payments, usage history, a bill calculator, outage reports, rates, and news, with staff areas for claims, tickets, and dispatch. An on-prem sync agent mirrors the billing database to the cloud with rate limiting and a circuit breaker, so the portal never puts load on the system of record.",
    tech: ["Next.js", "Supabase", "Cloudflare Tunnel", "Sync Agent", "MS SQL Server"],
    link: "https://app.panelco3.online",
    image: "/images/projects/p3-online-billing-portal/01-welcome.webp",
    featured: true,
    images: ["/images/projects/p3-online-billing-portal/01-welcome.webp", "/images/projects/p3-online-billing-portal/02-overview.webp", "/images/projects/p3-online-billing-portal/03-bills.webp", "/images/projects/p3-online-billing-portal/04-usage.webp", "/images/projects/p3-online-billing-portal/05-outage.webp"],
    gallery: [
      { src: "/images/projects/p3-online-billing-portal/01-welcome.webp", caption: "Public landing page: consumers register and sign in to check their bill without waiting for the paper copy." },
      { src: "/images/projects/p3-online-billing-portal/02-overview.webp", caption: "Account overview: current balance and due date, outage advisories, latest usage, and quick links to pay or report." },
      { src: "/images/projects/p3-online-billing-portal/03-bills.webp", caption: "Full billing history with paid and unpaid status for every bill." },
      { src: "/images/projects/p3-online-billing-portal/04-usage.webp", caption: "Usage analytics: 13-month kWh trend, month-over-month comparison, and a next-bill estimate." },
      { src: "/images/projects/p3-online-billing-portal/05-outage.webp", caption: "Outage reporting with a map pin, plus a live view of reports around the area and crew status." },
      { src: "/images/projects/p3-online-billing-portal/06-where-to-pay.webp", caption: "Where to pay: the account number to copy, payment channels, and a map of coop offices and mall counters." },
      { src: "/images/projects/p3-online-billing-portal/07-mobile-home.webp", caption: "The same portal on a phone: balance, advisories, and one-tap actions.", mobile: true },
      { src: "/images/projects/p3-online-billing-portal/08-mobile-usage.webp", caption: "Mobile usage view with the 13-month chart and plain-language insight.", mobile: true },
    ],
    galleryNote: "Screens show demo data; client data stays private.",
  },
  {
    title: "AGAM Distributed Registration",
    description:
      "Distributed QR-based digital registration platform for an Annual General Assembly Meeting handling 13,000 attendees across 5 simultaneous venues. Hybrid architecture pairing Supabase Realtime with the cooperative's MS SQL system of record: 115+ source files, 25+ API endpoints. Solved chronic abuse in token and meal distribution with cryptographically verifiable check-ins, real-time membership validation, and an audit trail accepted as official NEA documentary requirement.",
    tech: ["Next.js 16", "React 19", "Supabase Realtime", "MS SQL Server", "Distributed Systems"],
    link: "https://agam.panelco3.online/agam-registration",
    image: "/images/projects/agam/01-command-center.jpg",
    images: [
      "/images/projects/agam/01-command-center.jpg",
      "/images/projects/agam/02-live-by-venue.jpg",
      "/images/projects/agam/03-login.jpg",
      "/images/projects/agam/04-pre-register.jpg",
    ],
    featured: true,
    result: "13,000 attendees checked in across 5 simultaneous venues",
  },
  {
    title: "Azure Hybrid Cloud Migration",
    description:
      "Sole architect of a ₱14.95M multi-milestone migration of core operational workloads to Microsoft Azure for a 250K-member utility cooperative. Hybrid topology preserving on-prem HCI for compliance-bound workloads while moving identity, collaboration, and disaster recovery to Azure.",
    tech: ["Azure", "Hybrid Cloud", "Identity & DR", "ArcherOS HCI", "Vendor Mgmt"],
    link: "#",
    image: "/images/projects/azure-migration.jpg",
    featured: true,
    private: true,
  },
  {
    title: "Internal NDR-Class Network Detection",
    description:
      "Architected an internal network behavioral monitoring system focused on east-west traffic, lateral movement, and anomaly detection, territory typically owned by Darktrace, Vectra, or ExtraHop at enterprise license costs. Built in-house using open tooling.",
    tech: ["NDR", "Network Security", "Behavioral Detection", "Linux", "East-West Traffic"],
    link: "#",
    image: "/images/projects/ndr.jpg",
    featured: true,
    private: true,
  },
  {
    title: "P3 Consumer E-Invoicing",
    description:
      "Live notification service that delivers statements of account and disconnection notices to the cooperative's opted-in consumers: password-protected PDF invoices by email and SMS with an automatic provider fallback chain. Batch targeting by area office, municipality, and barangay with cost estimates, a contact registry with CSV import, templates, a 360° delivery dashboard, and provider credentials encrypted with AES-256-GCM.",
    tech: ["Node.js", "Amazon SES", "SMS Fallback Chain", "PDF Pipeline", "MS SQL Server"],
    link: "#",
    image: "/images/projects/p3-consumer-e-invoicing/01-executive.webp",
    featured: true,
    private: true,
    images: ["/images/projects/p3-consumer-e-invoicing/01-executive.webp", "/images/projects/p3-consumer-e-invoicing/02-delivery.webp", "/images/projects/p3-consumer-e-invoicing/03-batches.webp", "/images/projects/p3-consumer-e-invoicing/04-batch-detail.webp", "/images/projects/p3-consumer-e-invoicing/05-registry.webp"],
    gallery: [
      { src: "/images/projects/p3-consumer-e-invoicing/01-executive.webp", caption: "Executive view: bills delivered digitally, delivery and open rates, and SMS spend at a glance." },
      { src: "/images/projects/p3-consumer-e-invoicing/02-delivery.webp", caption: "Delivery dashboard: email and SMS funnels from queued to delivered and opened, with six-period trends." },
      { src: "/images/projects/p3-consumer-e-invoicing/03-batches.webp", caption: "Invoice batches: draft first, nothing sends until started, with live progress and failures per batch." },
      { src: "/images/projects/p3-consumer-e-invoicing/04-batch-detail.webp", caption: "Batch detail: per-recipient email and SMS status, cost, and errors." },
      { src: "/images/projects/p3-consumer-e-invoicing/05-registry.webp", caption: "Contact registry: verified emails and mobiles per consumer account, with CSV import and sync." },
      { src: "/images/projects/p3-consumer-e-invoicing/06-disconnection.webp", caption: "Disconnection notices: overdue candidates and staged reminders, with a cost preview before sending." },
      { src: "/images/projects/p3-consumer-e-invoicing/07-login.webp", caption: "Sign-in with leveled access: supervisor, admin, and superadmin." },
    ],
    galleryNote: "Screens show demo data; client data stays private.",
  },
  {
    title: "PFAS: Partner File Automation System",
    description:
      "Web-based ETL platform automating daily ingestion of partner files (FTP/SFTP and email attachments) into MS SQL Server. Replaces manual download-parse-import workflow with scheduled jobs, dashboard, audit logging, RBAC, and field mapping editor. FastAPI + SQLAlchemy + Docker.",
    tech: ["FastAPI", "ETL", "SQLAlchemy", "Docker", "MS SQL Server"],
    link: "#",
    image: "/images/projects/pfas.jpg",
    featured: false,
    private: true,
  },
  {
    title: "HCI Server Infrastructure",
    description:
      "Designed and deployed the hyperconverged infrastructure cluster running production billing, MIMS, and operational VMs for a 250K-member utility. Authored incident response procedures including disk-failure recovery for the production billing + MRMS stack on RF=2 clusters.",
    tech: ["HCI", "ArcherOS", "VM Orchestration", "Linux", "Incident Response"],
    link: "#",
    image: "/images/projects/hci.jpg",
    featured: false,
    private: true,
  },
  {
    title: "FocusCanvas: Desktop SaaS",
    description:
      "Cross-platform desktop productivity tool built with Tauri 2.0 + Rust + React. Auto-changes wallpapers based on scheduled 'Day Types' for focus and context switching. Native performance, no Electron bloat.",
    tech: ["Tauri 2.0", "Rust", "React", "TypeScript", "Desktop SaaS"],
    link: "#",
    image: "/images/projects/focuscanvas.jpg",
    featured: false,
  },
  {
    title: "API Middleware (In Design)",
    description:
      "Real-time API integration layer replacing batch FTP/SFTP file workflow with secure direct partner-to-database posting. mTLS + idempotency keys + rate limiting + reconciliation endpoints. The evolution of PFAS from one-way ingest to bidirectional integration.",
    tech: ["FastAPI", "mTLS", "Kong Gateway", "Redis", "MS SQL Server"],
    link: "#",
    image: "/images/projects/api-middleware.jpg",
    featured: false,
    private: true,
  },
  {
    title: "IEMOP WESM Invoice Automation",
    description:
      "Automated PDF invoice generation for the Philippine wholesale electricity spot market. Replaced a manual workflow where a ~50-invoice settlement batch took a full workday: ingests IEMOP CSVs, resolves participant TIN/address from a registry, atomically allocates invoice numbers from a shared live ledger, and renders pixel-accurate PDFs. Now under 30 seconds with zero transcription errors, a fail-closed write gate, and 59 passing tests.",
    tech: ["React 19", "FastAPI", "MS SQL Server", "TypeScript", "PDF Pipeline"],
    link: "#",
    image: "/images/projects/iemop.jpg",
    featured: true,
    private: true,
    result: "A full workday of manual invoicing → under 30 seconds, zero transcription errors",
  },
  {
    title: "MRMS: Meter Reading Management",
    description:
      "Full-stack modernization of the cooperative's meter reading operations: rebuilt a production procedural-PHP/jQuery system into a Fastify + React 18 SPA with zero-migration backward compatibility against the live MySQL database. Legacy and modern stacks run side by side. 11 route-level pages, 12 report modules, role-based routing, JWT access/refresh auth.",
    tech: ["React 18", "Fastify", "Prisma", "MySQL", "Legacy Modernization"],
    link: "#",
    image: "/images/projects/mrms.jpg",
    featured: true,
    private: true,
  },
  {
    title: "PEMCC Real-Time Election Platform",
    description:
      "Digitized the full election lifecycle for the employee cooperative: voter registration, admin-approved QR ballot access from members' own phones, live vote tallies on a presentation dashboard, and exportable reports. Deliberate single-port monolith (Express serves SPA + REST + WebSocket) so election-day LAN deployment is trivial. Hundreds of members voting simultaneously.",
    tech: ["React 19", "Express 5", "Socket.IO", "MS SQL Server", "Real-time"],
    link: "#",
    image: "/images/projects/pemcc.jpg",
    featured: false,
    private: true,
  },
  {
    title: "Event Registration & Raffle Platform",
    description:
      "All-in-one corporate event system: QR self-registration validated against an employee database, unique ticket codes with automated email confirmations and duplicate prevention, real-time check-in, and a multi-mode raffle engine with OBS broadcast overlays for live projection. Fully serverless on Supabase: no backend to operate on event day.",
    tech: ["React 18", "Supabase", "PostgreSQL", "Vercel", "OBS Overlays"],
    link: "https://panelco3-yearend.vercel.app/",
    image: "/images/projects/event-registration.jpg",
    featured: false,
  },
  {
    title: "NetPulse: Network Monitoring",
    description:
      "Real-time IP and node monitoring for servers, routers, and network devices. Hybrid architecture: an on-prem Python agent performs ICMP monitoring with configurable intervals and timeout detection, pushing to a cloud Next.js dashboard with live WebSocket updates, charts, bulk CRUD, and CSV/JSON export. Supabase Auth with row-level security.",
    tech: ["Next.js 15", "Python", "Supabase Realtime", "WebSockets", "RLS"],
    link: "#",
    image: "/images/projects/netpulse.jpg",
    featured: false,
    private: true,
  },
  {
    title: "GM Live Collections Dashboard",
    description:
      "Real-time collections dashboard for the General Manager: today's totals, a per-office breakdown and map, teller ranking, and revenue lost to voided receipts. Runs as a TV kiosk and a phone app. A least-privilege, read-only database login with poll-and-cache means any number of viewers costs one database reader, so an executive tool can never touch the financial system of record.",
    tech: ["React", "Node.js", "MS SQL Server", "MapLibre", "PWA"],
    link: "#",
    image: "/images/projects/gm-dashboard.jpg",
    featured: true,
    private: true,
  },
  {
    title: "SonicSense: AI Music Metadata Engine",
    description:
      "Chrome side-panel extension that turns a raw track description into structured release metadata: Anthropic tool-use extracts 13 global fields plus per-section narratives: instruments, vibe tags, and arrangement notes inferred automatically. Built to catalog my own productions and prep metadata for releases and sync-licensing pitches. Where the engineering day job meets the musician side.",
    tech: ["TypeScript", "Chrome MV3", "Anthropic API", "Tool Use", "Vite"],
    link: "#",
    image: "/images/projects/sonicsense.jpg",
    featured: true,
    private: true,
    result: "A free-text track description becomes 13 structured release fields in one pass",
  },
  {
    title: "SOURCE: Interactive Book Prototype",
    description:
      "Answer a 24-question guided questionnaire, typed or by voice via the Web Speech API with autosave/resume, and receive a personalized 4-chapter illustrated storybook with a print-to-PDF reader. Includes a separate dark-mode executive dashboard with KPI cards, funnels, and live reader data. Backend-free V1 with a custom 'Crayon Storybook' design system.",
    tech: ["Next.js 15", "Tailwind v4", "Web Speech API", "shadcn/ui", "Recharts"],
    link: "https://lesjohnpaul.github.io/Interactive_Book_Prototype/",
    image: "/images/projects/interactive-book.jpg",
    featured: false,
  },
];

// Photo gallery: only real photos that exist on disk. Add more real shots
// (speaking, datacenter, band) to /public/images/gallery/ as you collect them.
export const photoGallery = [
  {
    src: "/images/music/keyboard-performance.jpg",
    alt: "Performing on Nord Stage 4 88 in a chapel setting",
    category: "creative",
    caption: "Live performance, Nord Stage 4 88",
  },
  {
    src: "/images/lesjohnpaul.jpg",
    alt: "Les John Paul Oliver",
    category: "work",
    caption: "Portrait",
  },
];

// Testimonials: kept structure, anonymized defaults until you have real ones.
// Don't ship invented quotes. Replace these with actual references when ready.
export const testimonials = [
  {
    quote:
      "[Pending: replace with a real reference quote before shipping. Don't fabricate.]",
    author: "[Reference Name]",
    role: "[Title, Organization]",
    avatar: "/images/testimonials/person1.jpg",
  },
];

export const navigationItems = [
  { label: "Home", href: "/" },
  { label: "The Grid", href: "#grid" },
  { label: "Services", href: "#services" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "#contact" },
];

// Curated per-exhibit content. Keys must match hiddenTalents categories exactly.
export const exhibitDetails: Record<
  string,
  {
    headline: string;
    description: string;
    showcase: { label: string; value: string }[];
    tools: string[];
    quote?: string;
    image?: string;
    imageAlt?: string;
    imageCaption?: string;
    genres?: string[];
  }
> = {
  "Music Production": {
    headline: "Working Musician, Arranger & Audio Engineer",
    description:
      "Active keyboardist on a Nord Stage 4 88 in an indie band. Three originals are in pre-release with major-label discussions underway. Arranged two locally-released indie albums plus singles for independent artists. Tracking, comping, mixing, and stem export in Logic Pro X: comfortable at the stem level (drums, bass, vocals, synths, FX) and fluent in production techniques like sidechain, automation, and vocal processing.",
    showcase: [
      { value: "3", label: "Originals in pre-release" },
      { value: "2", label: "Albums arranged" },
      { value: "9", label: "Genres fluent" },
    ],
    tools: ["Nord Stage 4 88", "Logic Pro X", "Stem Separation", "Vocal Processing", "Live Performance"],
    image: "/images/music/keyboard-performance.jpg",
    imageAlt: "Performing on Nord Stage 4 88 in a chapel setting",
    imageCaption: "Nord Stage 4 88, live keys session",
    genres: ["R&B", "Pop", "OPM", "Rock", "Jazz", "Worship / Choral", "Electronic", "Indie", "Folk"],
  },
  "Choir Direction": {
    headline: "Fifteen Years of SATB Ear Training",
    description:
      "Directed a Catholic liturgical SATB choir for weekly services: arranging and adapting hymns, training voice leading, and developing the multi-part listening that powers every harmonic decision I make. Recently composed an original Communion hymn in 8.8.8.8 Long Meter compatible with traditional tune families.",
    showcase: [
      { value: "15+", label: "Years directing" },
      { value: "780+", label: "Weekly services led" },
      { value: "1", label: "Original hymn composed" },
    ],
    tools: ["SATB Direction", "Hymn Arrangement", "Voice Leading", "Harmonic Analysis", "Liturgical Composition"],
    quote: "Choral direction is the practiced ensemble leadership behind every architecture decision.",
  },
  "Visual Art": {
    headline: "Composition Practice, Off-Screen",
    description:
      "Abstract painting as a standing hobby practice: color relationships, balance, and negative space worked out on canvas instead of a screen. The same eye that resolves a composition resolves an interface: hierarchy, rhythm, and restraint transfer directly into UI work.",
    showcase: [
      { value: "Acrylic", label: "Primary medium" },
      { value: "Abstract", label: "Working style" },
      { value: "Every UI", label: "Where it shows up" },
    ],
    tools: ["Abstract Painting", "Color Composition", "Visual Design", "Aesthetic Judgment"],
    quote: "The same eye that balances a canvas balances an interface.",
  },
  "Solo Building": {
    headline: "Founder-Grade Ownership, Team of One",
    description:
      "Shipping personal products without a team: Sneaker Symphony, a live Philippine sneaker marketplace with dual-gateway payments; FocusCanvas, a desktop SaaS; and this portfolio. Strategy, PRD, design, code, deployment, and operations. Every layer owned end to end.",
    showcase: [
      { value: "3", label: "Products shipped solo" },
      { value: "2", label: "Payment gateways integrated" },
      { value: "0", label: "Handoffs, end to end" },
    ],
    tools: ["Product Strategy", "PRD Authoring", "Next.js / React", "PayMongo · HitPay", "Deployment & Ops"],
    quote: "When you are the whole team, every decision is yours to defend.",
  },
  "Workflow Automation": {
    headline: "Weeks Into Clicks",
    description:
      "Compressing manual workflows into clicks: a 4-week regulatory tax reporting cycle now runs as a 2-click operation, saving roughly 160 hours per cycle. WESM settlement invoicing, a full workday of ~50 manual invoices, now completes in under 30 seconds with zero transcription errors.",
    showcase: [
      { value: "2 clicks", label: "Was a 4-week cycle" },
      { value: "<30s", label: "Was a full workday" },
      { value: "160 hrs", label: "Saved per cycle" },
    ],
    tools: ["n8n", "Claude Code Pipelines", "ETL Design", "AWS SES", "Custom APIs"],
    quote: "The best code is the code you never have to write because a workflow handles it.",
  },
};
