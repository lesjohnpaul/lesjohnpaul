// Portfolio Data — Senior IC voice, hybrid attribution
// Last updated: 2026-04-30
// Hero stats are calibrated to actual scope. No inflated numbers.

export const personalInfo = {
  name: "Les John Paul Oliver",
  title: "Solutions Architect & Senior Software Engineer",
  tagline:
    "I architect enterprise systems for a 200K-member utility cooperative by day, and ship products solo by night.",
  email: "lesjohnpauloliver@gmail.com",
  location: "Pangasinan, Philippines",
  availability: "Open to senior remote roles & AU sponsorship",
  resumeUrl: "/lesjohnpaulolver.pdf",
  social: {
    github: "https://github.com/lesjohnpaul",
    linkedin: "https://www.linkedin.com/in/lesjohnpaul/",
  },
};

// Hero stats: only numbers I can defend in an interview.
// No inflation, no rounding up, no "100+ optimized systems."
export const heroStats = [
  { label: "Years in Enterprise IT", value: "10+" },
  { label: "Systems Architected", value: "16+" },
  { label: "Production DB Managed", value: "1.17TB" },
  { label: "End Users Served", value: "200K+" },
];

export const coreSkills = [
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
      "End-to-end design and implementation of distributed registration, real-time analytics, and integration platforms — solo or with very small teams.",
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
      "Built an internal NDR-class lateral-movement detection system in-house — territory typically owned by enterprise vendors at premium licensing.",
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
  {
    category: "AI & Agentic Systems",
    icon: "Brain",
    description:
      "Designing AI-powered customer interaction platforms and shipping production code with agentic developer tools (Claude Code, Cursor).",
    skills: [
      "Claude API",
      "OpenAI",
      "AI Routing & Triage",
      "Agentic Workflows",
      "Claude Code",
      "n8n",
      "Process Automation",
    ],
    highlight: true,
  },
];

// Hidden talents — kept honest. These are real practices, not bullet padding.
export const hiddenTalents = [
  {
    category: "Music Production",
    icon: "Music",
    description:
      "Working keys player on Nord Stage 4 88 in an indie band with three originals in pre-release and major-label discussions in progress. Producer and arranger across two locally-released indie albums plus singles, performing professionally on stages. Recording/mixing engineer in Logic Pro X on MacBook Pro. AI-literate music annotator with stem-level analysis across R&B, OPM, jazz, rock, worship, indie, and electronic music.",
    skills: [
      "Nord Stage 4 88",
      "Logic Pro X",
      "Music Arrangement",
      "Recording & Mixing",
      "Stem-Level Analysis",
      "Music Annotation (AI Training Data)",
      "Multi-Genre Fluency",
      "Original Composition",
    ],
    color: "from-purple-500 to-pink-500",
  },
  {
    category: "Choir Direction",
    icon: "Music",
    description:
      "15+ years directing and teaching a Catholic liturgical SATB choir — arranging and adapting hymns weekly, deep multi-part harmonic analysis, voice leading, and ensemble leadership. Recently composed an original Communion hymn in 8.8.8.8 Long Meter compatible with traditional tune families.",
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
      "Abstract painting as a hobby practice — composition, color theory, and the same intuition I bring to UI work.",
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
      "Shipping personal products without a team — Sneaker Symphony marketplace, FocusCanvas desktop SaaS, and this portfolio. Full ownership end-to-end.",
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
      "Compressing manual workflows into clicks. The kind of automation that turns 4-week regulatory cycles into 2-click operations.",
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

// Experience — real timeline, hybrid attribution.
// PANELCO III is named (it's public-facing employment).
// Specific systems with security implications stay anonymized in description.
export const experience = [
  {
    role: "System Administration Officer & Solutions Architect",
    company: "PANELCO III · Electric Cooperative",
    period: "2016 — Present",
    description:
      "Sole-architect role spanning cloud infrastructure, AI systems, network security, distributed apps, and production DBA work for a 200,000+ member utility. Reports through CSD/SAD chain.",
    achievements: [
      "Sole architect of a ₱14.95M Azure hybrid cloud migration covering identity, collaboration, and DR",
      "Designed an AI-powered omnichannel CRM with auto-escalation across phone, social, Viber, and Telegram",
      "Built a distributed QR-based registration platform handling 13K attendees across 5 simultaneous venues",
      "Authored an internal NDR-class lateral-movement detection system — east-west monitoring, in-house build",
      "Manage a 1.17TB production MS SQL Server billing instance plus MySQL/MIMS/CAS databases as DBA",
      "Reduced a 4-week tax compliance reporting cycle to a 2-click operation (~160 hours saved per cycle)",
      "Architected bulk PDF email invoicing for 183K+ consumers with sectorial filtering and AWS SES",
      "Authored PFAS — a partner file ETL platform replacing manual SFTP/email ingestion workflows",
      "Automated WESM settlement invoicing — a full-workday, ~50-invoice manual batch now runs in under 30 seconds with zero transcription errors",
      "Modernized the meter reading system from procedural PHP/jQuery to Fastify + React 18 with zero-migration coexistence against the live MySQL database",
      "Delivered a real-time QR-ballot election platform for the employee cooperative with live tallies and admin-approved ballot access",
    ],
  },
  {
    role: "Founder & Solo Full-Stack Developer",
    company: "Sneaker Symphony · sneakersymphony.com",
    period: "2024 — Present",
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
    period: "2025 — Present",
    description:
      "Cross-platform desktop productivity tool that auto-changes wallpapers based on scheduled 'Day Types'. Built with Tauri 2.0 + Rust + React for native performance.",
    achievements: [
      "Authored PRD and shipped wireframes for the v1 product surface",
      "Stack: Tauri 2.0, Rust, React, TypeScript",
      "Native cross-platform delivery (Windows, macOS, Linux) without Electron bloat",
    ],
  },
];

// Projects — real ones, with the kind of detail a hiring manager actually wants.
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
};

export const projects: Project[] = [
  {
    title: "AGAM Distributed Registration",
    description:
      "Distributed QR-based digital registration platform for an Annual General Assembly Meeting handling 13,000 attendees across 5 simultaneous venues. Hybrid architecture pairing Supabase Realtime with the cooperative's MS SQL system of record — 115+ source files, 25+ API endpoints. Solved chronic abuse in token and meal distribution with cryptographically verifiable check-ins, real-time membership validation, and an audit trail accepted as official NEA documentary requirement.",
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
  },
  {
    title: "Azure Hybrid Cloud Migration",
    description:
      "Sole architect of a ₱14.95M multi-milestone migration of core operational workloads to Microsoft Azure for a 200K-member utility cooperative. Hybrid topology preserving on-prem HCI for compliance-bound workloads while moving identity, collaboration, and disaster recovery to Azure.",
    tech: ["Azure", "Hybrid Cloud", "Identity & DR", "ArcherOS HCI", "Vendor Mgmt"],
    link: "#",
    image: "/images/projects/azure-migration.jpg",
    featured: true,
    private: true,
  },
  {
    title: "ACIRS — AI Omnichannel CRM",
    description:
      "AI-powered customer interaction and resolution platform integrating phone, social media, Viber, and Telegram. Auto-classifies inbound concerns and routes to the correct department. Drafted full PRD and 36-month service agreement covering performance security, liquidated damages, and milestone payments.",
    tech: ["AI Routing", "CRM", "Multi-channel", "WhatsApp Business", "Service Design"],
    link: "#",
    image: "/images/projects/acirs.jpg",
    featured: true,
    private: true,
  },
  {
    title: "Internal NDR-Class Network Detection",
    description:
      "Architected an internal network behavioral monitoring system focused on east-west traffic, lateral movement, and anomaly detection — territory typically owned by Darktrace, Vectra, or ExtraHop at enterprise license costs. Built in-house using open tooling.",
    tech: ["NDR", "Network Security", "Behavioral Detection", "Linux", "East-West Traffic"],
    link: "#",
    image: "/images/projects/ndr.jpg",
    featured: true,
    private: true,
  },
  {
    title: "Bulk Email Invoicing System",
    description:
      "End-to-end PRD and architecture for bulk PDF invoice delivery across 183,000+ utility consumers. Sectorial filtering by area office, municipality, and barangay. Password-protected PDFs (last digit of account number + birthday MMDD), account-verified opt-in webpage, and Amazon SES integration for deliverability at scale.",
    tech: ["AWS SES", "PDF Pipeline", "Account Verification", "Compliance", "Scale"],
    link: "#",
    image: "/images/projects/bulk-email.jpg",
    featured: true,
    private: true,
  },
  {
    title: "Tax Compliance PDF Automation",
    description:
      "Automated regulatory tax compliance reporting for a 200K-consumer utility. Reduced a recurring 4-week manual reporting cycle to a 2-click operation, eliminating ~160 hours of manual work per cycle and removing human error from regulated filings.",
    tech: ["Process Automation", "PDF Generation", "Compliance", "MS SQL Server"],
    link: "#",
    image: "/images/projects/tax-automation.jpg",
    featured: false,
    private: true,
  },
  {
    title: "PFAS — Partner File Automation System",
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
      "Designed and deployed the hyperconverged infrastructure cluster running production billing, MIMS, and operational VMs for a 200K-member utility. Authored incident response procedures including disk-failure recovery for the production billing + MRMS stack on RF=2 clusters.",
    tech: ["HCI", "ArcherOS", "VM Orchestration", "Linux", "Incident Response"],
    link: "#",
    image: "/images/projects/hci.jpg",
    featured: false,
    private: true,
  },
  {
    title: "Sneaker Symphony Marketplace",
    description:
      "Solo full-stack Philippine sneaker marketplace at sneakersymphony.com. Mobile-first checkout, GCash/Maya/PayMongo dual-gateway payments, AI-driven content automation pipeline across FB/IG/TikTok, and Cloudflare R2 invoice storage. Stack: Next.js 15 + Supabase + Vercel + Inngest + Claude API.",
    tech: ["Next.js 15", "Supabase", "PayMongo", "Cloudflare R2", "Claude API"],
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
  },
  {
    title: "FocusCanvas — Desktop SaaS",
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
      "Automated PDF invoice generation for the Philippine wholesale electricity spot market. Replaced a manual workflow where a ~50-invoice settlement batch took a full workday: ingests IEMOP CSVs, resolves participant TIN/address from a registry, atomically allocates invoice numbers from a shared live ledger, and renders pixel-accurate PDFs — now under 30 seconds with zero transcription errors, a fail-closed write gate, and 59 passing tests.",
    tech: ["React 19", "FastAPI", "MS SQL Server", "TypeScript", "PDF Pipeline"],
    link: "#",
    image: "/images/projects/iemop.jpg",
    featured: true,
    private: true,
  },
  {
    title: "MRMS — Meter Reading Management",
    description:
      "Full-stack modernization of the cooperative's meter reading operations: rebuilt a production procedural-PHP/jQuery system into a Fastify + React 18 SPA with zero-migration backward compatibility against the live MySQL database — legacy and modern stacks run side by side. 11 route-level pages, 12 report modules, role-based routing, JWT access/refresh auth.",
    tech: ["React 18", "Fastify", "Prisma", "MySQL", "Legacy Modernization"],
    link: "#",
    image: "/images/projects/mrms.jpg",
    featured: true,
    private: true,
  },
  {
    title: "PEMCC Real-Time Election Platform",
    description:
      "Digitized the full election lifecycle for the employee cooperative — voter registration, admin-approved QR ballot access from members' own phones, live vote tallies on a presentation dashboard, and exportable reports. Deliberate single-port monolith (Express serves SPA + REST + WebSocket) so election-day LAN deployment is trivial. Hundreds of members voting simultaneously.",
    tech: ["React 19", "Express 5", "Socket.IO", "MS SQL Server", "Real-time"],
    link: "#",
    image: "/images/projects/pemcc.jpg",
    featured: false,
    private: true,
  },
  {
    title: "Event Registration & Raffle Platform",
    description:
      "All-in-one corporate event system: QR self-registration validated against an employee database, unique ticket codes with automated email confirmations and duplicate prevention, real-time check-in, and a multi-mode raffle engine with OBS broadcast overlays for live projection. Fully serverless on Supabase — no backend to operate on event day.",
    tech: ["React 18", "Supabase", "PostgreSQL", "Vercel", "OBS Overlays"],
    link: "https://panelco3-yearend.vercel.app/",
    image: "/images/projects/event-registration.jpg",
    featured: false,
  },
  {
    title: "NetPulse — Network Monitoring",
    description:
      "Real-time IP and node monitoring for servers, routers, and network devices. Hybrid architecture: an on-prem Python agent performs ICMP monitoring with configurable intervals and timeout detection, pushing to a cloud Next.js dashboard with live WebSocket updates, charts, bulk CRUD, and CSV/JSON export. Supabase Auth with row-level security.",
    tech: ["Next.js 15", "Python", "Supabase Realtime", "WebSockets", "RLS"],
    link: "#",
    image: "/images/projects/netpulse.jpg",
    featured: false,
    private: true,
  },
  {
    title: "GM Executive Collections Dashboard",
    description:
      "Read-only daily collections dashboard for the General Manager — teller performance, monthly targets, and collection figures surfaced live from the production SQL Server. Runs 24/7 as a Windows service on-prem with a least-privilege read-only database login, so an executive reporting tool can never touch the financial system of record.",
    tech: ["Node.js", "MS SQL Server", "Windows Service", "Least-Privilege Design"],
    link: "#",
    image: "/images/projects/gm-dashboard.jpg",
    featured: false,
    private: true,
  },
  {
    title: "Refund Classification Automation",
    description:
      "Python automation for the consumer refund pipeline across two billing systems (EBS + MIMS): fetches and enriches account data, classifies refund natures through a decision engine, executes actions with undo support, sends email notifications, and exports reports behind an internal dashboard. Reversible operations by design, with a pytest suite.",
    tech: ["Python", "MS SQL Server", "Decision Engine", "pytest"],
    link: "#",
    image: "/images/projects/refund-automation.jpg",
    featured: false,
    private: true,
  },
  {
    title: "WeCare — Pharmacy Claims Platform",
    description:
      "Healthcare operations prototype for PhilHealth-accredited pharmacies and clinics covering the full dispense-to-reimbursement loop: real-time eligibility checks at the counter, FEFO batch dispensing with BIR receipts, and automatic assembly of clean claims to cut denials and beat the 60-day filing deadline. Ships as a partner briefing deck, owner dashboard, and POS terminal prototype.",
    tech: ["TypeScript", "Supabase", "PLpgSQL", "Healthcare", "Product Design"],
    link: "#",
    image: "/images/projects/wecare.jpg",
    featured: false,
    private: true,
  },
  {
    title: "SonicSense — AI Annotation Copilot",
    description:
      "Chrome side-panel extension that accelerates professional music-annotation workflows: Anthropic tool-use extracts 13 structured global fields plus per-section narratives from a raw description — instruments, vibe tags, and arrangement notes inferred automatically. Where the engineering day job meets the musician side.",
    tech: ["TypeScript", "Chrome MV3", "Anthropic API", "Tool Use", "Vite"],
    link: "#",
    image: "/images/projects/sonicsense.jpg",
    featured: false,
    private: true,
  },
  {
    title: "SOURCE — Interactive Book Prototype",
    description:
      "Answer a 24-question guided questionnaire — typed or by voice via the Web Speech API, with autosave/resume — and receive a personalized 4-chapter illustrated storybook with a print-to-PDF reader. Includes a separate dark-mode executive dashboard with KPI cards, funnels, and live reader data. Backend-free V1 with a custom 'Crayon Storybook' design system.",
    tech: ["Next.js 15", "Tailwind v4", "Web Speech API", "shadcn/ui", "Recharts"],
    link: "https://lesjohnpaul.github.io/Interactive_Book_Prototype/",
    image: "/images/projects/interactive-book.jpg",
    featured: false,
  },
];

// Photo gallery — only real photos that exist on disk. Add more real shots
// (speaking, datacenter, band) to /public/images/gallery/ as you collect them.
export const photoGallery = [
  {
    src: "/images/music/keyboard-performance.jpg",
    alt: "Performing on Nord Stage 4 88 in a chapel setting",
    category: "creative",
    caption: "Live performance — Nord Stage 4 88",
  },
  {
    src: "/images/lesjohnpaul.jpg",
    alt: "Les John Paul Oliver",
    category: "work",
    caption: "Portrait",
  },
];

// Testimonials — kept structure, anonymized defaults until you have real ones.
// Don't ship invented quotes. Replace these with actual references when ready.
export const testimonials = [
  {
    quote:
      "[Pending — replace with a real reference quote before shipping. Don't fabricate.]",
    author: "[Reference Name]",
    role: "[Title, Organization]",
    avatar: "/images/testimonials/person1.jpg",
  },
];

export const navigationItems = [
  { label: "Home", href: "/" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "#contact" },
];
