import { personalInfo } from "@/data/portfolio-data";

// Long-form reference about Les, written by him (source: knowledge-base.md at the repo root).
// Reference data only: the rules live in SYSTEM_PROMPT. Keep it byte-stable (no dates, no
// randomness) so the prompt cache keeps hitting. Figures here must match the site's proof rules.
export const KNOWLEDGE_BASE = `## 1. Quick Profile

* **Name:** Les John Paul Oliver (he goes by Les John Paul)
* **Positioning:** AI Engineer: an AI-first software engineer and solutions architect. He is also a systems administrator, automation builder, music producer and arranger, keyboardist, choir director, and entrepreneur.
* **Location:** Pangasinan, Philippines (GMT+8). Works with clients locally and remotely.
* **Experience:** 10 years in enterprise IT, since 2016
* **Current role:** System Administration Officer and Solutions Architect in the System Administration Division of PANELCO III (Pangasinan III Electric Cooperative). He is the sole architect of the cooperative's IT systems and also serves as its database administrator for MS SQL Server and MySQL.
* **Music:** 15 years as a choir director and music teacher; music producer, arranger, recording and audio engineer, and keyboardist
* **Business:** Founder of Sneaker Symphony, a Philippine online sneaker marketplace
* **Art:** Abstract painter with a personal practice in visual composition
* **Portfolio:** https://lesjohnpauloliver.dev
* **Email:** lesjohnpauloliver@gmail.com
* **Languages:** English and Filipino


## 2. Elevator Pitch

**One line:**
Les John Paul Oliver is an AI-first software engineer and solutions architect who also produces music, directs choirs, and runs his own e-commerce business.

**Short version:**
Les John Paul Oliver is an AI-first software engineer and solutions architect from the Philippines who builds production systems fast. He has shipped more than 10 enterprise systems as a solo architect, runs his own e-commerce venture, and brings 15 years of music direction, production, and audio engineering to creative projects.

* **Role on every project:** Les is the only builder on every project in this portfolio. Each one is a team of one: he gathers requirements, designs the architecture, builds the UI, backend, database, and AI parts, deploys it, and supports it. No team, agency, or subcontracted developers.

**Longer version:**
Les John Paul combines hands-on enterprise IT operations with a modern, AI-assisted way of building. At an electric cooperative serving more than 250,000 member consumers, he architected and shipped systems end to end, replacing outside vendor solutions and saving an estimated PHP 8M+ over three years. He covers the full lifecycle: architecture, software, databases, automation, cloud and infrastructure, and security-aware operations. He uses Claude Code, Cursor, and GitHub Copilot daily, which lets him compress typical project timelines significantly without cutting corners on structure or documentation. Outside of tech, he is a working musician, arranger, choir director, recording engineer, and the founder of Sneaker Symphony, so clients get someone who understands business operations, creative work, and the systems behind both.


## 3. Services Overview

Les John Paul offers services in four groups. Technology is his primary focus.

**Technology**
1. Full-stack web application and software development
2. Enterprise business systems and legacy modernization
3. Business process automation and document processing
4. APIs and system integration
5. AI integrations and chatbots
6. Database administration and MS SQL Server consulting
7. Dashboards and reporting
8. Cloud, hybrid infrastructure, and systems administration
9. Security-aware systems and reliability
10. IT procurement specifications and technical documentation
11. Product planning and MVP development
12. Websites, e-commerce systems, and SEO
13. UI/UX design to code and creative web experiences
14. Event technology and QR registration systems

**Creative and business**
15. AI content production and social media automation
16. Digital content, branding, and creative direction

**Music and audio**
17. Music production, recording, mixing, and editing
18. Music arrangement and scoring (big band, SATB, hymns, liturgical)
19. Keyboard performance and session work
20. Choir direction, training, accompaniment, and teaching
21. Venue sound, lighting, and AV system consulting
22. Music data annotation and quality assurance for AI

**Visual art**
23. Abstract painting and visual composition, which also informs his creative direction work


## 4. Service Details: Technology

### 4.1 Full-Stack Web Application and Software Development
* **What it is:** Web applications built from interface to backend and database: customer portals, internal systems, admin dashboards, SaaS products, and CRUD applications
* **Who it's for:** Startups, small and medium businesses, cooperatives, and teams that need a working product quickly
* **What's included:** Product requirements document (PRD), architecture, UI, backend and APIs, authentication and role-based access, database design, form and document workflows, deployment, and handover documentation
* **Typical stack:** Next.js, React, TypeScript, Tailwind CSS, Node.js (Express, Fastify), Python (FastAPI), PHP, Supabase, PostgreSQL, MS SQL Server, MySQL
* **Proof:** 10+ production systems shipped as a solo architect; an AI proposal generator for electrical contractors; a cross-platform desktop app (FocusCanvas)

### 4.2 Enterprise Business Systems and Legacy Modernization
* **What it is:** Systems that run day to day operations, and modernizing older systems without disrupting the business
* **Areas:** Billing and collections workflows, membership and customer information systems, inventory and warehouse tracking, ticketing and request management, online billing inquiry, internal administration tools, data validation and reconciliation, and connecting legacy systems with newer applications
* **Proof:** Built an online billing inquiry system for 250,000+ consumers. Modernized a legacy meter reading system (Android, Java, C#) used daily by field crews across 5 area offices. Built share capital certificate issuance, membership management, IT inventory and warehouse tracking, and ticketing workflows.
* **Note:** These are examples of his professional experience at PANELCO III, not products for sale.

### 4.3 Business Process Automation and Document Processing
* **What it is:** Turning slow, repetitive manual work into reliable automated workflows
* **Examples:** PDF and report generation, bulk spreadsheet and CSV processing, invoice workflows, email delivery and notifications, scheduled data ingestion, file processing from email, FTP, or SFTP, data validation and reconciliation, exception handling, and audit logs
* **Tools:** Python, n8n, REST APIs, FastAPI, Docker, scheduled jobs, Telegram bots
* **Proof:** Automated tax compliance reporting (thousands of BIR 2307 forms): work that took 2 weeks of manual effort now runs in under 5 minutes. Built Python based PDF generation, bulk document processing, and email based document delivery workflows.
* **Best starting point:** Describe the current manual process and the result you want

### 4.4 APIs and System Integration
* **What it is:** Connecting systems so they exchange information reliably
* **What's included:** REST API development, third party API integration, legacy and modern system integration, partner file ingestion, authentication and access control, data validation, duplicate request protection, error handling, audit trails, and integration documentation
* **Proof:** Built a partner integration API (FastAPI, Python, Docker, MS SQL Server) that replaced manual FTP and SFTP file transfers with real time connectivity, saving 30+ hours of manual work per month

### 4.5 AI Integrations and Chatbots
* **What it is:** Using AI where it supports a clear business process
* **What's included:** Portfolio and business chatbots, customer inquiry classification, AI assisted routing and response suggestions, document and text processing, AI generated proposals and documents, workflow automation with AI steps, and human review and escalation flows
* **Tools:** Claude API, OpenAI API, Model Context Protocol (MCP), Python, TypeScript, Node.js, FastAPI, n8n
* **Approach:** Every AI feature is scoped with a defined information source, privacy safeguards, testing, human escalation, and monitoring. AI output is never guaranteed to be correct, so he designs for review.
* **Proof:** Built VoltDraft, an AI proposal generator for electrical contractors. Built AI assisted content production pipelines and annotation tooling.

### 4.6 Database Administration and MS SQL Server Consulting
* **What it is:** Hands-on administration, improvement, and rescue work for business critical databases
* **What's included:** Performance tuning, query troubleshooting and optimization, indexing and data integrity, schema design and changes, backup and recovery strategy, corruption recovery, login, user, and permission management, data migration and import or export, reporting queries, health checks, and database integration with web APIs
* **Platforms:** MS SQL Server, MySQL, MariaDB, PostgreSQL, Supabase, MongoDB
* **How work starts:** An assessment of the engine and version, schema, workload, data volume, permissions, backup state, and acceptable downtime. No recovery or performance result is promised before that assessment.
* **Proof:** Administers mission critical SQL Server databases (over 1 TB) at 99.9% uptime. Recovered a page corrupted production database with zero data loss. Built SafeShrink, a SQL Server transaction log recovery tool. Certified in Microsoft SQL Server Administration (2024).

### 4.7 Dashboards and Reporting
* **What it is:** Making operational data easy to read and act on
* **What's included:** SQL backed dashboards, KPI and operational reports, collections and transaction reporting, filters and exports, scheduled reports, Power BI reporting support, and read-only reporting datasets kept separate from transactional systems
* **Proof:** Designed a real time executive dashboard (React, Node.js, Chart.js) with collection analytics and KPI rollups, shortening monthly executive review cycles by 60%

### 4.8 Cloud, Hybrid Infrastructure, and Systems Administration
* **What it is:** Planning, migrating, and running the environment that applications and databases depend on
* **What's included:** Cloud migration planning, hybrid cloud architecture, infrastructure sizing, virtualization and hyperconverged infrastructure (HCI), high availability, backup and disaster recovery, business continuity planning, monitoring and alerting, identity and access planning, cost and dependency review, server troubleshooting, vendor coordination, and operational documentation
* **Platforms:** Microsoft Azure, AWS, Google Cloud Platform, Linux (Ubuntu), Windows Server, Linux KVM, Docker, Vercel, VPS hosting
* **Proof:** Sole architect of an Azure hybrid cloud migration, including seeding production SQL Server databases to Azure for a distributed availability group setup. Led the migration of production workloads to a 3 node hyperconverged cluster. Trained 50+ staff on security hygiene.

### 4.9 Security-Aware Systems and Reliability
* **What it is:** Building and running systems with security and recovery in mind from the start
* **What's included:** Least privilege and role-based access, monitoring and logging, audit trails, backup and recovery planning, incident response documentation, network and server monitoring, and security-aware API and application design
* **Training:** Data Privacy, Vulnerability Assessment and Ethical Hacking (Mapua University, 2021)
* **Scope note:** This work does not replace a formal penetration test, security audit, or dedicated incident response specialist where one is required. All security work needs clear authorization and scope.

### 4.10 IT Procurement Specifications and Technical Documentation
* **What it is:** Writing the documents organizations need to buy and run technology properly
* **What's included:** Terms of Reference (TOR), vendor-neutral technical specifications, compliance sheets, proof of concept (POC) clauses, implementation schedules, contracts, policies, and quality management documents
* **Who it's for:** Cooperatives, government offices, schools, and companies going through formal procurement
* **Proof:** Has authored TORs for hyperconverged infrastructure, cybersecurity solutions, network monitoring systems, mobile development tooling, and a professional audio, lighting, and LED wall system for a 5,000 seat hall

### 4.11 Product Planning and MVP Development
* **What it is:** Helping founders define a product before committing to a full build
* **What's included:** Product requirements documents, user stories and workflows, MVP scoping, system architecture, technology selection, API and database planning, prototype planning, risk identification, and phased delivery plans
* **Proof:** Built VoltDraft with a full PRD, landing page, admin UI, and handover documentation. Took FocusCanvas from UX to packaging and distribution. Built and runs Sneaker Symphony.

### 4.12 Websites, E-commerce Systems, and SEO
* **What it is:** Fast, modern websites and online stores that are built to be found and easy to run
* **What's included:** Business websites and landing pages, online catalogs and storefronts, checkout and payment gateway integration, order and fulfillment workflows, order tracking, inventory tracking, customer notifications, product quality control workflows, CMS setup, technical SEO, structured data (JSON-LD), and Google Search Console setup
* **Stack:** Next.js, Supabase, PayMongo, Cloudflare R2, Vercel
* **Proof:** Built and runs Sneaker Symphony, so he knows e-commerce as both the owner and the builder

### 4.13 UI/UX Design to Code and Creative Web Experiences
* **What it is:** Turning designs into polished, production ready interfaces, including immersive and animated sites
* **Workflow:** Uses the Figma MCP to pull design tokens, frames, and components straight from Figma into code, then refines in Cursor or Claude Code
* **Creative web tools:** React Three Fiber (3D), GSAP, Framer Motion, Lenis smooth scroll, Tailwind CSS
* **Good fit for:** Portfolios, brand sites, landing pages, and editorial style websites

### 4.14 Event Technology and QR Registration Systems
* **What it is:** Real time registration and attendance systems for large events
* **Proof:** Built the AGAM 2026 digital registration platform for PANELCO III's 36th Annual General Assembly. It checked in 13,000+ attendees across 5 simultaneous venues and cut registration time per member from about 3 minutes to under 15 seconds.
* **Stack:** React, Node.js, MS SQL Server, WebSocket, QR codes


## 5. Service Details: Creative and Business

### 5.1 AI Content Production and Social Media Automation
* **What it is:** Content systems that produce, schedule, and publish social media posts with minimal manual work
* **What's included:** AI image and video generation, animated post rendering, content calendars, caption writing (English, Filipino, and Taglish), approval workflows, and automatic scheduling
* **Tools:** Higgsfield (AI image and video), Remotion (programmatic video), n8n, Notion, Metricool, GitHub Actions, Supabase Storage
* **Proof:** Runs a weekly automated content pipeline for Sneaker Symphony's Facebook page. Produced AI generated public information videos and a Facebook content strategy for a cooperative with roughly 250,000 member consumers.

### 5.2 Digital Content, Branding, and Creative Direction
* **What it is:** Practical creative support for brands and digital projects
* **What's included:** Social media captions and campaign concepts, product promotion and content planning, brand and promotional concepts, music related visual concepts, layout and color feedback, and creative direction for digital projects
* **Background:** Handles brand identity and content for Sneaker Symphony. His abstract painting practice gives him a trained eye for color, balance, and composition.
* **Note:** These are practical creative skills, not a formal graphic design qualification


## 6. Service Details: Music and Audio

### 6.1 Music Production, Recording, Mixing, and Editing
* **What it is:** Production, recording, mixing, and editing for musicians, bands, choirs, podcasts, and content creators
* **What's included:** Music production and editing, instrumental and vocal preparation, mixing, stem preparation and export, production collaboration, and preparing music for live performance
* **Tools:** Logic Pro X
* **Background:** Working music producer and recording and audio engineer

### 6.2 Music Arrangement and Scoring
* **What it is:** Custom arrangements and printed scores for a specific ensemble or event
* **What's included:** Song arrangement and adaptation, big band charts, SATB choral arrangements, hymn and liturgical arrangements, and harmony and voice-leading support
* **Proof:** Has written big band arrangement scores for cha-cha, swing, funk, and samba, engraved in LilyPond
* **Good fit for:** Bands, orchestras, choirs, parishes, schools, and events needing custom charts

### 6.3 Keyboard Performance and Session Work
* **What it is:** Keys for live performances and recording sessions
* **Settings:** Church and liturgical services, choir performances, concerts, band performances, recording sessions, and private or corporate events
* **Gear:** Nord Stage 4 88
* **Background:** Professional musician; plays keys in an original project band with an easy listening sound
* **Note:** Bookings, event rates, travel costs, and availability are confirmed directly with Les John Paul

### 6.4 Choir Direction, Training, Accompaniment, and Teaching
* **What it is:** Musical leadership and training for choirs and vocal ensembles
* **What's included:** Choir direction, rehearsal preparation, vocal ensemble training, accompaniment, choral performance preparation, and music lessons
* **Background:** 15 years as a Catholic choir director and music teacher, with deep experience in SATB and liturgical music
* **Good fit for:** Parish and community choirs, school ensembles, and event choirs

### 6.5 Venue Sound, Lighting, and AV System Consulting
* **What it is:** Planning sound, lighting, and LED wall systems for halls, churches, and event venues
* **What's included:** System design, equipment specifications, procurement documents, and band ready stage setups
* **Proof:** Specified a full professional audio, lighting, and LED wall upgrade for a 5,000 seat multipurpose hall, including a line array PA, digital mixer, moving head lighting, and backline
* **Why he's different:** He is both a musician and an IT architect, so he understands how the room should sound and how the systems should be bought and maintained

### 6.6 Music Data Annotation and Quality Assurance for AI
* **What it is:** Detailed music annotation and QA for AI training datasets
* **Proof:** Freelance music annotator for AI music datasets. Built his own Chrome extension and QA workflow to keep annotations consistent and fast.

### 6.7 Musical Range
* **Styles he works across:** Pop, R&B, OPM, rock, jazz, worship and choral, electronic, indie folk, and big band styles such as swing, funk, samba, and cha-cha


## 7. Sneaker Symphony

* **What it is:** A Philippine online sneaker marketplace founded and run by Les John Paul
* **Built with:** Next.js, Supabase, and PayMongo
* **What he handles:** Product sourcing and pre-order operations, catalog and product presentation, Facebook page content and promotional campaigns, product arrival announcements, customer inquiries, deposit and payment coordination, courier and fulfillment coordination, brand identity, marketplace and order tracking planning, and an automated weekly content pipeline
* **Brand colors:** Gold, navy blue, black, and white
* **Official channels:** sneakersymphony.com and facebook.com/SneakerSymphony
* **Why it matters to clients:** It gives him firsthand experience running an online business as both the owner and the system builder
* **For shoppers:** Product, stock, price, and delivery questions go to the official Sneaker Symphony channels


## 8. Selected Projects and Case Studies

* **AGAM 2026 QR Registration Platform:** Real time registration for 13,000+ attendees across 5 venues; per-member check-in cut from about 3 minutes to under 15 seconds
* **Tax Compliance Automation:** Python automation for thousands of BIR 2307 forms; 2 weeks of manual work down to under 5 minutes
* **Executive Dashboard:** Real time collection analytics and KPI rollups (React, Node.js, Chart.js); monthly executive review cycles shortened by 60%
* **Online Billing Inquiry System:** Self-service billing for 250,000+ consumers (PHP, MySQL, JavaScript); in-person service traffic down 35%, about PHP 2M saved versus outsourced quotations
* **Partner Integration API:** FastAPI middleware replacing manual FTP and SFTP workflows; 30+ hours of manual ingestion eliminated per month
* **Azure Hybrid Cloud Migration:** Sole architect; production SQL Server databases seeded to Azure for a distributed availability group setup
* **Hyperconverged Infrastructure Migration:** Production workloads moved to a 3 node HCI cluster for better availability and disaster recovery
* **Meter Reading Management System Modernization:** Upgraded and refactored a legacy Android (Java) and C# system used daily by field crews across 5 area offices
* **IT Inventory, Warehouse Tracking, and Ticketing Workflows:** Internal systems for tracking assets, stock movement, and support requests
* **Document Automation:** Python based PDF generation, bulk document processing, and email based delivery
* **SafeShrink:** SQL Server transaction log recovery tool
* **Sneaker Symphony:** Philippine sneaker marketplace built with Next.js, Supabase, and PayMongo, with an automated weekly content pipeline
* **FocusCanvas:** Cross-platform desktop productivity app built with Tauri 2.0, Rust, and React; full ownership from UX to packaging and distribution
* **VoltDraft:** AI proposal generator for Australian electrical contractors, built with a PRD, landing page, admin UI, and handover documentation
* **Earlier production systems (2020 to 2023):** Share capital certificate issuance, real time event attendance, membership management with camera and signature capture, and a corporate website
* **Big Band Arrangements:** Cha-cha, swing, funk, and samba scores engraved in LilyPond


## 9. Skills and Tools Index

Depth varies by tool. This list helps match a visitor's request to his experience; it does not mean every tool is used at the same level.

* **Web and software:** HTML, CSS, JavaScript, TypeScript, React, Next.js, Node.js, Express, Fastify, PHP, Python, FastAPI, .NET, C#, Java, Rust (with Tauri), Bash, Tailwind CSS, REST APIs
* **Data and databases:** MS SQL Server (administration, performance tuning, backup and recovery), MySQL, MariaDB, PostgreSQL, Supabase, MongoDB, SQL and T-SQL, schema design, data migration, ETL, reporting, Power BI support
* **Systems and cloud:** Microsoft Azure, AWS, Google Cloud Platform, Linux (Ubuntu), Windows Server, virtualization (Linux KVM, HCI), high availability, monitoring, disaster recovery, Docker, CI/CD, GitHub Actions, Git, Vercel
* **Automation and AI:** Python automation, PDF and document generation, scheduled workflows, email automation, n8n, Claude Code, Cursor, GitHub Copilot, Anthropic API, OpenAI API, Model Context Protocol (MCP), chatbots and inquiry classification
* **Security and reliability:** Role-based access, least privilege, audit logging, server and network monitoring, vulnerability assessment, incident response documentation, backup and recovery, business continuity planning, data privacy compliance
* **Design and creative:** Figma (with MCP), React Three Fiber, GSAP, Framer Motion, Higgsfield, Remotion, visual composition, abstract painting
* **Business:** E-commerce operations, product and workflow planning, social media content and marketing, PayMongo, Metricool, Notion
* **Music and audio:** Logic Pro X, LilyPond, Nord Stage 4, arrangement, SATB and choral music, keyboard performance, choir direction


## 10. Education and Certifications

* **Bachelor of Science in Information and Communications Technology:** Pangasinan State University, 2015
* **Microsoft SQL Server Administration:** Everywhere Consulting, Inc., 2024
* **Magic XPA Enterprise Development:** Everywhere Consulting, Inc., 2024
* **Full-Stack Web Development (10 month program):** GoIT Philippines, 2023 to 2024
* **AWS Innovate: Modern Applications:** Amazon Web Services, 2022
* **Data Privacy, Vulnerability Assessment and Ethical Hacking:** Mapua University, 2021
* **TESDA Computer Hardware Servicing NC II**
* **Australian Computer Society (ACS) Skills Assessment:** Software Engineer, Developer Programmer, and Systems Administrator, valid until March 2027


## 11. Career Timeline

* **2016:** Joined PANELCO III (Pangasinan III Electric Cooperative)
* **December 2019 to September 2022:** System Administration Specialist I. Shipped the Online Billing Inquiry System and several internal production systems.
* **September 2022 to present:** System Administration Officer and Solutions Architect. Sole architect of the cooperative's IT portfolio and its database administrator.
* Has held three roles at PANELCO III since 2016, moving from consumer welfare work to sole engineer-architect


## 12. How Les John Paul Works

* **Practical approach:** Understand the workflow, find the real operational problem, plan the solution, build or integrate the right tools, and think through how the system will be maintained
* **AI-first, not AI-only:** He plans in detail, then uses Claude Code, Cursor, and GitHub Copilot to build. He reviews and owns every line that ships.
* **Typical flow:** Discovery call, written spec or PRD, design or prototype, build in short iterations, testing, deployment, and handover documentation
* **Speed:** His AI-assisted workflow often lets him deliver in a fraction of the usual timeline. Exact timelines depend on scope and are confirmed after discovery.
* **Communication:** Clear written updates, plain language for non-technical stakeholders, and documentation at handover
* **Time zone:** GMT+8 (Philippine Time). Can arrange overlap hours with clients in other time zones.
* **Solo builder advantage:** One person owns the whole system, from architecture to deployment, so nothing gets lost between teams


## 13. Engagement and Pricing

* **Pricing:** Every project is quoted after a short discovery conversation. Price depends on scope, complexity, integrations, deliverables, and timing. There are no published rates.
* **Availability:** ${personalInfo.availability}. Specific dates and capacity are confirmed directly by Les John Paul.
* **Next step:** A free 30-minute discovery call, which this assistant can book, or a brief through the contact form or email.


## 14. Frequently Asked Questions

**What does Les John Paul do?**
He builds software, automations, databases, and infrastructure as an AI-first software engineer and solutions architect. He also runs Sneaker Symphony and works as a music producer, arranger, keyboardist, and choir director.

**What services can I hire him for?**
Web and software development, business systems, automation, API and AI integrations, database work, dashboards, cloud and infrastructure planning, procurement documents, e-commerce systems, creative content, music production and arrangement, keyboard performance, choir training, and venue AV consulting.

**Can he build my website or app?**
Yes. He builds websites, web apps, online stores, portals, dashboards, and internal tools, usually with Next.js, React, and Supabase or SQL Server. Share the problem, the intended users, and the main features to start.

**Can he automate a manual process in my office?**
Yes. Automation is one of his strongest areas, covering spreadsheets, PDFs, data imports, reporting, email delivery, and system integrations. Describe the current process and the result you want.

**Can he fix or speed up my SQL Server database?**
Yes. Database administration, performance tuning, backup and recovery, and corruption recovery are core strengths. Production work starts with an assessment of the environment, backups, permissions, and downtime limits.

**Can he help with cloud or infrastructure?**
Yes. He plans cloud and hybrid setups, virtualization, high availability, and backup and disaster recovery. Recommendations depend on your current systems, requirements, budget, and support capacity.

**Can he build an AI chatbot for my business?**
Yes. He builds API based assistants, inquiry classification, and AI workflow automation. Scope covers the information source, privacy needs, escalation rules, and expected behavior.

**Is he a real developer or does AI do everything?**
He is a developer with 10 years of enterprise experience and a BS in ICT. AI tools speed up his work, but he designs the architecture, reviews the code, and is responsible for what ships.

**Can he help with online selling or e-commerce?**
Yes. He runs Sneaker Symphony and builds e-commerce systems: catalogs, checkout, payments, order tracking, inventory, and customer notifications.

**Does he write procurement documents or TORs?**
Yes. He writes vendor-neutral Terms of Reference and technical specifications for IT and AV procurement.

**Does he offer music services?**
Yes. Music production, recording and mixing, arrangement (including SATB and big band), keyboard performance, choir direction and training, and music lessons.

**Can I book him to play keys at my event or church?**
Possibly. Send the date, location, type of event, and what you need. Availability and rates are confirmed directly by Les John Paul.

**Can he help set up a sound system for our church, hall, or venue?**
Yes. He plans audio, lighting, and LED wall systems and can write the equipment specifications.

**How much does it cost?**
Pricing depends on scope. The best next step is a short project brief sent to lesjohnpauloliver@gmail.com.

**How fast can he deliver?**
Small projects such as landing pages can move very quickly, and he is known for compressing typical timelines. Larger systems are scheduled after discovery. No deadline is promised before scoping.

**Is he available for freelance work?**
Send a project brief and he will confirm fit and availability directly.

**I'm a recruiter or employer. How do I reach him?**
Send the role, company, location, and work arrangement to lesjohnpauloliver@gmail.com.

**Where is he based?**
Pangasinan, Philippines (GMT+8). He works with clients remotely.

**Where can I buy from Sneaker Symphony?**
Through the official channels: sneakersymphony.com and facebook.com/SneakerSymphony.


## 15. Contact

* **Portfolio:** https://lesjohnpauloliver.dev
* **Email:** lesjohnpauloliver@gmail.com
* **Discovery call:** this assistant can book a 30-minute call directly in the chat
* **LinkedIn:** ${personalInfo.social.linkedin}
* **GitHub:** ${personalInfo.social.github}
* **Sneaker Symphony:** sneakersymphony.com and facebook.com/SneakerSymphony
* **Call to action:** Have a workflow to automate, a system to build, a database to fix, an online business to organize, or a music project in mind? Send a short brief to lesjohnpauloliver@gmail.com.`;
