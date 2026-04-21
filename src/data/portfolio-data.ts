// Portfolio Data — sourced directly from four resumes in /docs/Resume.
// Numbers and projects here are verified from the resumes and can be defended.

export const personalInfo = {
  name: "Les John Paul Oliver",
  title: "AI-Native Full Stack Engineer · Legacy Modernization",
  tagline:
    "10+ years shipping production systems for 200,000+ Filipino consumers. AI-native workflow. Legacy modernization specialist.",
  email: "lesjohnpauloliver@gmail.com",
  phone: "+63 915 421 3651",
  location: "Urdaneta City, Pangasinan 🇵🇭",
  availability: "Open to remote & AI-native roles",
  resumeUrl: "/resume.pdf",
  social: {
    github: "https://github.com/lesjohnpaul",
    linkedin: "https://www.linkedin.com/in/lesjohnpaul/",
  },
};

// Every stat below appears verbatim or computed from the 2025 master resume.
export const heroStats = [
  { label: "Years in IT", value: "10+" },
  { label: "Consumers Served", value: "200K+" },
  { label: "Infra Uptime", value: "98%" },
  { label: "Cost Reduction", value: "45%" },
];

// Core skills reorganized around 2026 market demand: AI-augmented engineering
// first, then the full stack, then the operational depth that differentiates.
export const coreSkills = [
  {
    category: "AI-Augmented Engineering",
    icon: "Brain",
    description:
      "AI is in my daily toolchain — not an experiment. Claude Code, Cursor, MCP, and RAG pipelines shipped into real production systems.",
    skills: [
      "Claude Code (CLI)",
      "Cursor IDE",
      "GitHub Copilot",
      "MCP Integrations",
      "RAG Pipelines",
      "Prompt Engineering",
      "LLM Applications",
      "Agent Workflows",
      "BMAD Method",
    ],
    highlight: true,
  },
  {
    category: "Frontend Engineering",
    icon: "Code",
    description:
      "Production web UIs with React, Next.js, and TypeScript. Figma-to-prod with a focus on performance, accessibility, and polish.",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript ES6+",
      "Tailwind CSS",
      "HTML5 & CSS3",
      "Figma",
      "UI/UX Design",
      "Responsive Design",
    ],
    highlight: true,
  },
  {
    category: "Backend & APIs",
    icon: "Layers",
    description:
      "Polyglot backends across Node, Python, PHP, and C#. REST, GraphQL, and realtime WebSocket APIs.",
    skills: [
      "Node.js",
      "Python (FastAPI)",
      "PHP",
      "C#",
      "Java (Android)",
      "REST APIs",
      "GraphQL",
      "WebSocket",
      "Bash / Shell",
    ],
    highlight: false,
  },
  {
    category: "Database Engineering",
    icon: "Database",
    description:
      "MS SQL Server admin, schema migrations, query tuning, and emergency recovery for systems holding 200K+ consumer records.",
    skills: [
      "MS SQL Server",
      "PostgreSQL (Supabase)",
      "MySQL",
      "MongoDB",
      "Query Optimization",
      "Schema Migration",
      "Emergency Recovery",
      "Data Integrity",
    ],
    highlight: true,
  },
  {
    category: "Cloud & Infrastructure",
    icon: "Cloud",
    description:
      "Led a ₱14.95M Azure migration. AWS serverless, Cloudflare R2, HCI clusters, Sophos-secured networks — production, not demos.",
    skills: [
      "Azure (VNet, VPN, VMs)",
      "AWS (SES, App Runner)",
      "Docker",
      "Vercel",
      "Cloudflare R2",
      "HCI / ArcherOS",
      "Linux Server Admin",
      "Sophos Firewall",
      "CI/CD",
    ],
    highlight: true,
  },
  {
    category: "Legacy Modernization",
    icon: "Workflow",
    description:
      "Inherit, refactor, ship. Took over a departed dev's Android/C# codebase, modernized PHP billing for 200K accounts, and wrote the docs to make it stick.",
    skills: [
      "Framework Upgrades",
      "Inherited Codebase Takeover",
      "Technical Debt Reduction",
      "Android App Modernisation",
      "PHP Refactoring",
      "Change Management",
      "Technical Writing",
      "Incident Reports",
    ],
    highlight: false,
  },
];

// Hidden talents — tuned for 2026: AI content in marketing, technical writing
// surfaced as a real talent (answers the "resume builder / documentation" ask).
export const hiddenTalents = [
  {
    category: "Music Production",
    icon: "Music",
    description: "Composing, arranging, and producing original music",
    skills: [
      "Music Composition",
      "Audio Engineering",
      "DAW (Ableton / FL Studio)",
      "Sound Design",
      "Mixing & Mastering",
    ],
    color: "from-purple-500 to-pink-500",
  },
  {
    category: "Visual Art & Design",
    icon: "Palette",
    description: "Digital art, UI/UX, and visual storytelling",
    skills: [
      "Digital Art",
      "Graphic Design",
      "UI/UX Design",
      "Figma",
      "Photography",
      "Video Editing",
    ],
    color: "from-blue-500 to-cyan-500",
  },
  {
    category: "Digital Marketing & Growth",
    icon: "TrendingUp",
    description:
      "AI-accelerated growth — content, SEO, and analytics built for the 2026 landscape",
    skills: [
      "SEO",
      "AI Content Generation",
      "Content Strategy",
      "Social Media",
      "Analytics",
      "Conversion Optimization",
      "Growth Engineering",
      "Email Marketing",
    ],
    color: "from-green-500 to-emerald-500",
  },
  {
    category: "Entrepreneurship",
    icon: "Rocket",
    description: "Building and scaling ventures from zero to one",
    skills: [
      "Business Development",
      "Product Strategy",
      "Team Leadership",
      "Venture Building",
      "Market Analysis",
    ],
    color: "from-orange-500 to-amber-500",
  },
  {
    category: "Technical Writing & Docs",
    icon: "FileText",
    description:
      "Turning complex systems into clean docs, runbooks, PRDs, and resumes that actually land",
    skills: [
      "Technical Writing",
      "Runbooks",
      "PRDs & Specs",
      "Incident Reports",
      "Resume & CV Crafting",
      "Stakeholder Communication",
      "API Documentation",
    ],
    color: "from-cyan-500 to-blue-500",
  },
];

// Three roles, one employer — PANELCO III (electric cooperative, 200K+ consumers).
// PSU role intentionally omitted per request.
export const experience = [
  {
    role: "System Administration Officer / Full Stack Developer",
    company: "PANELCO III — Pangasinan III Electric Cooperative",
    period: "Sept 2022 – Present",
    description:
      "Leading full-stack development, database engineering, and cloud infrastructure for an electric cooperative serving 200,000+ consumers across 5 area offices.",
    achievements: [
      "Led a ₱14.95M Azure cloud migration — VNet, VMs, site-to-site VPN with Sophos Firewall, Azure Recovery Services",
      "Took over and modernizing the Meter Reading Management System (MRMS) — inherited Android/C# codebase from a departed developer",
      "Refactored legacy MAGIC billing platform (PHP + MS SQL Server), debugging penalty logic across 200,000+ accounts",
      "Expanded HCI cluster from 3-node to 6–7 node (ArcherOS), improving system availability by 40%",
      "Achieved 98% system uptime with proactive monitoring and a disciplined incident-response workflow",
      "Reduced development costs by up to 45% via in-house builds, eliminating third-party vendor dependencies",
      "Champion of AI-first engineering: adopted Claude Code, Cursor, and MCP workflows across daily development",
    ],
  },
  {
    role: "System Administration Specialist I",
    company: "PANELCO III — Pangasinan III Electric Cooperative",
    period: "Dec 2019 – Sept 2022",
    description:
      "Built and deployed internal web applications, hardened server infrastructure, and brought staff onto modern tooling.",
    achievements: [
      "Shipped billing inquiry, electrical rates, and attendance-monitoring apps improving operational efficiency by 40%",
      "Maintained Linux web servers at 99% uptime with strict data access controls and security compliance",
      "Trained 50+ employees on IT systems and new application workflows — tech adoption up 25%",
      "Wrote user guides and runbooks so changes could be handed over to operations cleanly",
    ],
  },
  {
    role: "Consumer Welfare Assistant / IT Support",
    company: "PANELCO III — Pangasinan III Electric Cooperative",
    period: "Mar 2016 – Dec 2019",
    description:
      "First-line technical support for consumers and internal staff — the foundation that led into systems and development work.",
    achievements: [
      "Built a record management system automating 80% of manual tasks — an early legacy-modernization win replacing paper workflows",
      "Resolved consumer technical complaints, lifting customer satisfaction by 15%",
      "Provided hardware and software troubleshooting support across departments",
    ],
  },
];

// Projects pulled directly from resumes. First entry is the big-card hero project.
// Links are `#` where the work is internal/proprietary — don't fabricate public URLs.
export const projects = [
  {
    title: "Azure Cloud Migration (₱14.95M)",
    description:
      "Led end-to-end enterprise infrastructure modernization for PANELCO III: Azure VNet architecture, VM deployments, site-to-site VPN integration with Sophos Firewall, and Azure Recovery Services Vault for DR. Delivered across 5 area offices.",
    tech: ["Azure", "VNet", "Site-to-Site VPN", "Sophos Firewall", "Azure Recovery Services"],
    link: "#",
    image: "/images/projects/azure-migration.jpg",
    featured: true,
  },
  {
    title: "ACIRS — AI-Powered Customer Service Platform",
    description:
      "Led requirements and service-agreement for an LLM-powered customer interaction platform with RAG pipelines, multi-channel chatbot, and Filipino/English NLP for an electric cooperative's member services.",
    tech: ["LLM", "RAG", "NLP", "Python", "Multi-channel Chatbot"],
    link: "#",
    image: "/images/projects/acirs.jpg",
    featured: true,
  },
  {
    title: "MRMS — Meter Reading Management System",
    description:
      "Inherited a legacy Android/C# mobile app from a departed developer. Upgraded Android Studio v4.1.1 dependencies, resolved Gradle/SDK compatibility, refactored for maintainability — keeping a business-critical tool running for field crews across 5 area offices.",
    tech: ["Android (Java)", "C#", "MS SQL Server", "Gradle"],
    link: "#",
    image: "/images/projects/mrms.jpg",
    featured: true,
  },
  {
    title: "Bulk Email Invoicing System — 200K+ Consumers",
    description:
      "Designed cloud architecture for mass-delivery monthly invoicing using Cloudflare R2 for PDF storage and Amazon SES for delivery — scaled to every PANELCO III consumer account.",
    tech: ["Cloudflare R2", "Amazon SES", "Node.js", "PDF Generation"],
    link: "#",
    image: "/images/projects/bulk-invoice.jpg",
    featured: true,
  },
  {
    title: "SneakerSymphony.com",
    description:
      "Personal full-stack sneaker marketplace for Philippine customers — a portfolio build demonstrating modern full-stack e-commerce architecture end-to-end.",
    tech: ["Next.js", "TypeScript", "Tailwind", "Supabase"],
    link: "https://sneakersymphony.com",
    image: "/images/projects/sneaker-symphony.jpg",
    featured: true,
  },
  {
    title: "PFAS — Partner File Automation System",
    description:
      "Architected an automated FTP/SFTP and email-based file ingestion system from third-party partners into MS SQL Server, replacing manual data-entry workflows.",
    tech: ["Python", "FastAPI", "MS SQL Server", "SFTP"],
    link: "#",
    image: "/images/projects/pfas.jpg",
    featured: false,
  },
  {
    title: "BIR 2307 PDF Generation Tool",
    description:
      "Automated bulk generation of Philippine BIR 2307 tax forms — reduced processing time by 85% and eliminated manual data handling.",
    tech: ["Python", "PDF", "Automation"],
    link: "#",
    image: "/images/projects/bir-2307.jpg",
    featured: false,
  },
  {
    title: "IP Conflict Detection Dashboard",
    description:
      "Real-time monitoring dashboard for subnet conflict detection across PANELCO III's multi-office network infrastructure.",
    tech: ["React", "WebSocket", "Network Monitoring"],
    link: "#",
    image: "/images/projects/ip-dashboard.jpg",
    featured: false,
  },
  {
    title: "FocusCanvas (Concept)",
    description:
      "Designed a productivity desktop application with wallpaper scheduling by work mode. Authored a full PRD — Tauri/Rust/React stack.",
    tech: ["Tauri", "Rust", "React", "Desktop SaaS"],
    link: "#",
    image: "/images/projects/focus-canvas.jpg",
    featured: false,
  },
  {
    title: "PANELCO III Online Billing Inquiry System",
    description:
      "Self-service consumer billing lookup — cut office foot-traffic by 35% and reduced costs by 55% vs. third-party alternatives.",
    tech: ["PHP", "MySQL"],
    link: "#",
    image: "/images/projects/billing-inquiry.jpg",
    featured: false,
  },
  {
    title: "Share Capital Certificate Issuance System",
    description:
      "Automated web app with a user-friendly dashboard for share-capital certificate issuance — processing time down 60%, project costs down 30%.",
    tech: ["PHP", "MySQL", "JavaScript"],
    link: "#",
    image: "/images/projects/share-capital.jpg",
    featured: false,
  },
  {
    title: "This Portfolio",
    description:
      "The site you're on — handcrafted with Next.js 16, TypeScript, Tailwind CSS v4, and GSAP. Source on GitHub.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "GSAP"],
    link: "https://github.com/lesjohnpaul/lesjohnpaul",
    image: "/images/projects/portfolio.jpg",
    featured: false,
  },
];

// Flagship case study — the ₱14.95M Azure migration, told as a hiring-
// manager-ready story. Numbers are pulled from the 2025 master resume.
export const caseStudy = {
  eyebrow: "Case Study · Infrastructure",
  title:
    "Lifted 200,000 member-consumers onto Azure — without a missed billing cycle.",
  subtitle: "₱14.95M enterprise cloud migration across 5 area offices.",
  role: "Technical lead · Migration architect",
  period: "2024",
  ctaLinks: [
    { label: "Employer", href: "https://www.panelco3.com.ph/" },
    { label: "GitHub", href: "https://github.com/lesjohnpaul" },
  ],
  problem:
    "PANELCO III's on-prem infrastructure was hitting capacity, and the single datacenter hosted the billing, membership, and meter-reading systems 200,000 member-consumers rely on. A rack failure during a billing cycle would have paused operations for every home across five area offices. There was no documented disaster recovery story.",
  approach: [
    "Designed an Azure VNet topology with regional failover and private subnets for web, app, and data tiers.",
    "Stood up a site-to-site VPN through the Sophos Firewall cluster linking HQ + 4 satellite offices to Azure.",
    "Migrated VMs in waves during off-peak windows, each wave gated by a signed-off runbook.",
    "Configured Azure Recovery Services Vault with cross-region replication and point-in-time restore.",
    "Ran two full end-to-end runbook rehearsals on a copy environment before production cutover.",
  ],
  outcomes: [
    { label: "System uptime", value: "98%" },
    { label: "Area offices migrated", value: "5" },
    { label: "Consumer accounts protected", value: "200K+" },
    { label: "Data loss at cutover", value: "Zero" },
  ],
  stack: [
    "Azure VNet",
    "Azure VMs",
    "Site-to-Site VPN",
    "Sophos Firewall",
    "Azure Recovery Services Vault",
    "ArcherOS HCI",
    "Change-management discipline",
  ],
  reflection:
    "The biggest surprise was the VPN throughput ceiling — the initial wave plan assumed bulk transfers we could push through in a single off-peak window. Once we measured real payloads on the copy environment, we reshaped the waves, smaller and more frequent, with checkpoints. That rehearsal saved us a week of overnight work and let us keep the cutover under an hour of write-pause instead of the four we'd originally budgeted.",
};

export const certifications = [
  {
    name: "MS SQL Server Administration & Security",
    issuer: "Everywhere Consulting, Inc.",
    year: "2024",
    highlight: true,
  },
  {
    name: "Full Stack Web Development",
    issuer: "GoIT Philippines",
    year: "2023–2024",
    highlight: true,
    detail: "10-month intensive — React, Node.js, MongoDB, Docker",
  },
  {
    name: "Magic XPA Enterprise Development",
    issuer: "Everywhere Consulting, Inc.",
    year: "2024",
    highlight: false,
  },
  {
    name: "AWS Innovate: Modern Applications Edition",
    issuer: "Amazon Web Services",
    year: "2022",
    highlight: true,
    detail: "Serverless architectures, App Runner, modern cloud-native apps",
  },
  {
    name: "Data Privacy, Vulnerability Assessment & Ethical Hacking",
    issuer: "Mapua University",
    year: "2021",
    highlight: true,
  },
  {
    name: "SCADA Systems & Fiber Optic Network",
    issuer: "National Electric Administration",
    year: "2024",
    highlight: false,
  },
  {
    name: "Computer Hardware Servicing NC II",
    issuer: "TESDA",
    year: "2015",
    highlight: false,
  },
];

export const awards = [
  {
    title: "Best Employee Award — Corporate Services Department",
    issuer: "PANELCO III",
    year: "2024",
    detail:
      "Recognized for reducing project costs by up to 45% through in-house system modernization across multiple enterprise initiatives.",
  },
];

export const education = [
  {
    degree: "Bachelor of Science in Information and Communications Technology",
    school: "Pangasinan State University",
    year: "2015",
  },
];

export const photoGallery = [
  {
    src: "/images/gallery/speaking-1.jpg",
    alt: "Speaking at tech conference",
    category: "speaking",
    caption: "Tech Conference 2024",
  },
  {
    src: "/images/gallery/office-1.jpg",
    alt: "Working at the office",
    category: "work",
    caption: "Building the future",
  },
  {
    src: "/images/gallery/deployment-1.jpg",
    alt: "Server deployment",
    category: "deployment",
    caption: "Infrastructure deployment",
  },
  {
    src: "/images/gallery/music-1.jpg",
    alt: "Music production session",
    category: "creative",
    caption: "Late night production",
  },
  {
    src: "/images/gallery/team-1.jpg",
    alt: "Team collaboration",
    category: "work",
    caption: "Team planning session",
  },
  {
    src: "/images/gallery/performance-1.jpg",
    alt: "Live performance",
    category: "creative",
    caption: "Live performance",
  },
];

// Testimonials intentionally empty until real quotes land.
export const testimonials: Array<{
  quote: string;
  author: string;
  role: string;
  avatar: string;
}> = [];

export const navigationItems = [
  { label: "Home", href: "/" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Case Study", href: "#case-study" },
  { label: "Projects", href: "#projects" },
  { label: "Credentials", href: "#credentials" },
  { label: "Contact", href: "#contact" },
];
