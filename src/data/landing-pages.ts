// Search landing pages: 5 services + 4 locations. Each page must carry its own proof and
// answers (no "doorway" pages that only swap a place name). Facts here come from the case
// studies; never add a number that is not already proven on /work.

export type LandingFaq = { q: string; a: string };

export type LandingPage = {
  slug: string;
  kind: "service" | "location";
  /** <title> (the layout appends "| Les John Paul Oliver") */
  title: string;
  /** Meta description, ~155 chars */
  description: string;
  h1: string;
  eyebrow: string;
  intro: string[];
  sections: { heading: string; body: string[] }[];
  /** /work slugs shown as proof, most relevant first */
  proof: string[];
  faqs: LandingFaq[];
  /** Filipino versions for Tagalog searches ("AI developer sa Pangasinan") */
  faqsFil: LandingFaq[];
  areaServed: string[];
  keywords: string[];
};

const BOOK = "Pricing depends on scope. Book a free 30-minute call and you get a straight answer on cost and timeline.";
const BOOK_FIL = "Depende sa scope ang presyo. Mag-book ng libreng 30-minutong tawag at diretso kong sasabihin ang gastos at timeline.";

export const landingPages: LandingPage[] = [
  // ───────────────────────── Services ─────────────────────────
  {
    slug: "ai-engineer-philippines",
    kind: "service",
    title: "Hire an AI Engineer, Philippines",
    description:
      "Hire Les John Paul Oliver, an AI engineer in the Philippines: AI agents, chatbots, and automations in production. Remote worldwide, based in Pangasinan.",
    h1: "AI Engineer in the Philippines",
    eyebrow: "Hire · Freelance · Remote",
    intro: [
      "I'm Les John Paul Oliver, an AI engineer based in Urdaneta City, Pangasinan. I don't train models. I take Claude and other LLMs and wire them into the work a business already does: answering customers, processing documents, closing the books, and producing the reports nobody wants to write.",
      "Every project on this site was scoped, designed, built, and shipped by me alone, mostly for an electric cooperative that serves 250,000+ member-consumers. That is the environment I build for: real data, real money, and people who need the system to work on Monday morning.",
    ],
    sections: [
      {
        heading: "What you can hire me for",
        body: [
          "AI agents and chatbots that answer from your own knowledge base and hand off to a human when it matters.",
          "Business process automation that turns days of manual reporting and invoicing into a click.",
          "LLM features inside the app you already run: extraction, classification, drafting, tool use.",
          "Internal tools and live dashboards on top of the databases you already have.",
          "AI-assisted motion graphics and explainers for launches and campaigns.",
        ],
      },
      {
        heading: "How I work with AI where it matters",
        body: [
          "Where records or money change, AI explains and a human approves. The refund automation below is built that way: deterministic rules decide, Claude explains the flagged cases, and a person confirms every action, which can be reversed.",
          "I work in English and Filipino, on Philippine time (GMT+8), with overlap for Australian, Asian, and US-morning clients.",
        ],
      },
    ],
    proof: [
      "ai-assisted-refund-automation",
      "tax-compliance-automation",
      "wholesale-power-invoice-automation",
      "wecare-pharmacy-pos-dispensing-platform",
      "acirs-24-7-ai-customer-support",
    ],
    faqs: [
      { q: "How do I hire an AI engineer in the Philippines?", a: `Book a free 30-minute call from this page. We go over the problem, the data you have, and what a first version looks like. ${BOOK}` },
      { q: "Do you work freelance or full-time?", a: "Both. I take freelance projects for clients worldwide and I'm open to remote AI engineering roles, including Australian and other overseas teams." },
      { q: "What does an AI engineer actually build for a business?", a: "Systems that save hours or win revenue: assistants that answer leads around the clock, automations that turn a two-week compliance report into a run that finishes in under five minutes, and dashboards that show live numbers instead of last month's spreadsheet." },
      { q: "Which AI models do you use?", a: "Mostly Claude through the Anthropic API, chosen per task for cost and quality. The model is a part, not the product; most of the work is the data, the guardrails, and the integration." },
    ],
    faqsFil: [
      { q: "Paano mag-hire ng AI engineer sa Pilipinas?", a: `Mag-book ng libreng 30-minutong tawag dito. Pag-uusapan natin ang problema, ang data mo, at ang unang bersyon. ${BOOK_FIL}` },
      { q: "Freelance ka ba o full-time?", a: "Pareho. Tumatanggap ako ng freelance na proyekto mula sa kahit saang bansa, at bukas ako sa remote na AI engineering role." },
    ],
    areaServed: ["Philippines", "Worldwide"],
    keywords: ["AI engineer Philippines", "hire AI engineer Philippines", "freelance AI engineer Philippines", "Filipino AI engineer", "remote AI engineer"],
  },
  {
    slug: "ai-chatbot-developer-philippines",
    kind: "service",
    title: "AI Chatbot Developer, Philippines",
    description:
      "AI chatbot and agent developer in the Philippines. Assistants that answer from your knowledge base 24/7, book calls, and hand off to people.",
    h1: "AI Chatbot & AI Agent Developer in the Philippines",
    eyebrow: "Chatbots · AI agents · Lead capture",
    intro: [
      "Customers message at 11 p.m. and leads go cold before the office opens. I build AI assistants that answer from your own documents, qualify the person, book a meeting on your calendar, and pass the conversation to the right human when the question needs one.",
      "You can try one now: Pao, the assistant on this site, answers questions about my work, refuses off-topic requests, and books calls through Cal.com. It runs on Claude with rate limits and a daily spending cap, the same guardrails I put on client builds.",
    ],
    sections: [
      {
        heading: "What a production chatbot needs (and most demos skip)",
        body: [
          "Scope: the assistant answers about your business and declines everything else, including pasted code and prompt tricks.",
          "Grounding: answers come from your knowledge base, so it says \"I don't know\" instead of inventing a policy.",
          "Hand-off: it knows when to stop and route to a person or department, with the conversation attached.",
          "Cost control: per-visitor rate limits and a daily budget, so a busy day never becomes a surprise bill.",
        ],
      },
      {
        heading: "Channels",
        body: ["Website chat first. Messenger and Viber hand-offs for Philippine customers who live there. Email and Telegram alerts so the owner sees every new lead within seconds."],
      },
    ],
    proof: ["acirs-24-7-ai-customer-support", "ai-assisted-refund-automation", "sneaker-symphony-ai-run-marketplace"],
    faqs: [
      { q: "How much does an AI chatbot cost in the Philippines?", a: BOOK },
      { q: "Will the chatbot make things up?", a: "It's built not to. It answers only from the knowledge you give it, says when it doesn't know, and hands off instead of guessing. Every build is tested against off-topic and adversarial questions before launch." },
      { q: "Can it book appointments?", a: "Yes. The assistant on this site checks open slots and books calls through Cal.com, then notifies by email and Telegram. The same pattern works with your calendar." },
      { q: "What's the difference between a chatbot and an AI agent?", a: "A chatbot answers. An agent also acts through tools you allow, like checking availability, creating a record, or drafting a reply for approval. I add actions only where they're safe and logged." },
    ],
    faqsFil: [
      { q: "Magkano magpagawa ng AI chatbot?", a: BOOK_FIL },
      { q: "Pwede bang sumagot ang chatbot sa Tagalog o Taglish?", a: "Oo. English muna ang default, pero sumasagot ito sa Filipino o Taglish kapag ganoon ang gamit ng customer." },
    ],
    areaServed: ["Philippines", "Worldwide"],
    keywords: ["AI chatbot developer Philippines", "AI agent developer Philippines", "chatbot developer Pangasinan", "customer support AI Philippines"],
  },
  {
    slug: "ai-automation-philippines",
    kind: "service",
    title: "AI Automation Engineer, Philippines",
    description:
      "AI automation engineer in the Philippines: a 2-week compliance report now runs in under 5 minutes, a workday of invoicing in under 30 seconds.",
    h1: "AI Automation Engineer in the Philippines",
    eyebrow: "Business process automation · Workflow · Reporting",
    intro: [
      "If your team copies numbers between systems, rebuilds the same report every month, or types invoices by hand, that work can run itself. I build automations that read straight from your databases, generate the documents, and send them out, with an audit trail and no transcription errors.",
      "Two that are in production today: a regulated tax compliance report that took two weeks now finishes in under 5 minutes, and a ~50-invoice wholesale power settlement batch that took a full workday now runs in under 30 seconds.",
    ],
    sections: [
      {
        heading: "Where automation pays off first",
        body: [
          "Recurring reports and compliance filings built from a database.",
          "Invoicing, statements, and document generation in batches.",
          "Partner files that arrive by FTP, SFTP, or email and have to be loaded every day.",
          "Approval queues where AI can pre-check and explain, and a person signs off.",
        ],
      },
      {
        heading: "AI only where it earns its place",
        body: ["Most automation is deterministic code, and it should be. I add an LLM where judgment or language is the bottleneck, such as reading a free-text description, flagging an odd case, or explaining why a record failed, and keep a human in the loop where money changes."],
      },
    ],
    proof: ["tax-compliance-automation", "wholesale-power-invoice-automation", "partner-file-automation-platform", "ai-assisted-refund-automation"],
    faqs: [
      { q: "What business processes can be automated with AI?", a: "Reporting, invoicing, document generation, data loading from partners, and review queues are the usual first wins. If a person follows the same steps every week, it's a candidate." },
      { q: "How much does automation cost?", a: BOOK },
      { q: "Do I need to replace my current systems?", a: "No. The automations above run on top of existing SQL Server databases and legacy systems that stayed in place." },
    ],
    faqsFil: [
      { q: "Anong proseso ng negosyo ang pwedeng i-automate?", a: "Mga report, invoicing, paggawa ng dokumento, at pag-load ng data mula sa partners. Kung paulit-ulit ang hakbang linggo-linggo, pwede itong i-automate." },
      { q: "Kailangan bang palitan ang kasalukuyang system namin?", a: "Hindi. Tumatakbo ang mga automation sa ibabaw ng database at system na gamit na ninyo." },
    ],
    areaServed: ["Philippines", "Worldwide"],
    keywords: ["AI automation engineer Philippines", "business process automation Philippines", "workflow automation Philippines", "AI automation Pangasinan"],
  },
  {
    slug: "llm-integration-philippines",
    kind: "service",
    title: "Claude & LLM Developer, Philippines",
    description:
      "Add LLM features to the app you already run: extraction, classification, drafting, and tool use with Claude. Developer in the Philippines.",
    h1: "LLM Integration Developer in the Philippines",
    eyebrow: "Claude API · Extraction · Classification",
    intro: [
      "You know AI could help your product, but not where it pays off or how to ship it without surprises. I add LLM features to the app you already run, scoped to what users will actually use, with cost and failure handling designed in from the start.",
      "Examples from my own work: a Claude Haiku parser that turns messy supplier product titles into clean catalog fields for a sneaker marketplace, and a Chrome extension that turns a free-text track description into structured music metadata in one pass.",
    ],
    sections: [
      {
        heading: "Typical LLM features",
        body: [
          "Extraction: pull structured fields out of titles, emails, PDFs, and forms.",
          "Classification and routing: tag, prioritize, and send items to the right queue.",
          "Drafting: first drafts of replies, summaries, and reports for a person to approve.",
          "Tool use: let the model call your APIs for lookups, never unchecked writes.",
        ],
      },
      {
        heading: "Shipping it safely",
        body: ["Model choice per task (a small model where it's enough), prompt caching to cut cost, rate limits, logging, and a fallback when the API is slow or down."],
      },
    ],
    proof: ["sneaker-symphony-ai-run-marketplace", "sonicsense-ai-music-annotation-assistant", "ai-assisted-refund-automation"],
    faqs: [
      { q: "Can you add AI to my existing app?", a: "Yes. That's the usual job: a new endpoint or worker next to what you have, not a rewrite." },
      { q: "Which LLM should I use?", a: "It depends on the task, volume, and budget. I usually start with Claude, testing a smaller model first, and only move up where quality needs it." },
      { q: "How much does LLM integration cost?", a: BOOK },
    ],
    faqsFil: [
      { q: "Pwede bang lagyan ng AI ang app namin ngayon?", a: "Oo. Kadalasan, nagdadagdag lang ng bagong feature sa tabi ng kasalukuyang app, hindi kailangang gawin ulit mula sa simula." },
    ],
    areaServed: ["Philippines", "Worldwide"],
    keywords: ["LLM integration Philippines", "Claude API developer", "OpenAI integration developer Philippines", "AI feature development"],
  },
  {
    slug: "internal-tools-dashboards-philippines",
    kind: "service",
    title: "Dashboard Developer, Philippines",
    description:
      "Internal tools and live dashboards on your existing database: registration, ticketing, monitoring. Developer in Pangasinan, Philippines.",
    h1: "Internal Tools & Dashboard Developer in the Philippines",
    eyebrow: "Dashboards · Registration · Ticketing",
    intro: [
      "When operations run on spreadsheets, paper forms, and phone calls, the numbers arrive late and nobody trusts them. I build full-stack web apps on top of the databases you already have, so managers see live figures and staff stop re-typing.",
      "In production: a registration system that checked in 13,000 attendees across 5 simultaneous venues, a help desk and asset register that replaced walk-ins and paper, and a live collections dashboard a General Manager reads on his phone and on the TV in his office.",
    ],
    sections: [
      {
        heading: "What I build",
        body: [
          "Executive dashboards that read safely from production data.",
          "Registration, check-in, voting, and raffle systems for large events.",
          "Help desk, ticketing, and asset tracking.",
          "Monitoring for servers and network devices.",
        ],
      },
    ],
    proof: ["executive-live-collections-dashboard", "distributed-event-registration-platform", "enterprise-it-service-management-platform", "meter-reading-platform-legacy-modernization"],
    faqs: [
      { q: "Can a dashboard read from our live database without slowing it down?", a: "Yes. The collections dashboard reads safely from a production billing database; read paths are designed so operations aren't affected." },
      { q: "Can you modernize an old internal system?", a: "Yes. I rebuilt a production PHP and jQuery meter reading system as a React and Fastify app on the same live database." },
      { q: "How much does a custom internal tool cost?", a: BOOK },
    ],
    faqsFil: [
      { q: "Pwede bang i-modernize ang luma naming system?", a: "Oo. Nagawa ko na ito sa isang meter reading system na tumatakbo sa parehong live na database habang pinapalitan." },
    ],
    areaServed: ["Philippines", "Worldwide"],
    keywords: ["dashboard developer Philippines", "internal tools developer Philippines", "event registration system Philippines", "custom software Pangasinan"],
  },

  // ───────────────────────── Locations ─────────────────────────
  {
    slug: "ai-engineer-urdaneta",
    kind: "location",
    title: "AI Engineer in Urdaneta, Pangasinan",
    description:
      "AI engineer in Urdaneta City, Pangasinan: chatbots, automation, and dashboards for local businesses, with in-person meetings available.",
    h1: "AI Engineer in Urdaneta City, Pangasinan",
    eyebrow: "Urdaneta · Eastern Pangasinan",
    intro: [
      "I live and work in Urdaneta City. If you run a business, clinic, school, cooperative, or LGU office nearby, we can meet in person to map the problem, then I build and support it remotely.",
      "Most of my production work was built right here in eastern Pangasinan, for an electric cooperative serving 250,000+ member-consumers: billing portals, compliance automation, a registration system for 13,000 attendees, and AI-assisted approval queues.",
    ],
    sections: [
      {
        heading: "Meeting in person",
        body: ["Urdaneta and nearby towns such as Villasis, Binalonan, Asingan, Pozorrubio, and Rosales are easy to reach for a kickoff or a workshop with your team. Everything after that runs remote, with the same follow-up you'd get from a local office."],
      },
      {
        heading: "What local businesses usually ask for",
        body: [
          "A chatbot on Facebook or the website that answers customers after hours.",
          "Automated reports and invoices from the system they already use.",
          "A simple dashboard the owner can check on a phone.",
        ],
      },
    ],
    proof: ["distributed-event-registration-platform", "consumer-billing-self-service-portal", "tax-compliance-automation"],
    faqs: [
      { q: "Is there an AI engineer in Urdaneta City?", a: "Yes. I'm Les John Paul Oliver, an AI engineer and software engineer based in Urdaneta City, Pangasinan, building AI assistants, automation, and dashboards." },
      { q: "Can we meet in person?", a: "Yes, for kickoffs and workshops in Urdaneta and nearby Pangasinan towns. Development and support run remote." },
      { q: "How much does it cost?", a: BOOK },
    ],
    faqsFil: [
      { q: "May AI engineer ba sa Urdaneta?", a: "Oo. Ako si Les John Paul Oliver, AI engineer na nakabase sa Urdaneta City, Pangasinan." },
      { q: "Pwede ba tayong magkita nang personal?", a: "Oo, para sa kickoff o workshop sa Urdaneta at mga kalapit na bayan. Remote ang development at support pagkatapos." },
    ],
    areaServed: ["Urdaneta City", "Villasis", "Binalonan", "Asingan", "Pozorrubio", "Rosales", "Pangasinan"],
    keywords: ["AI engineer Urdaneta", "software engineer Urdaneta", "AI developer Urdaneta City", "web developer Urdaneta Pangasinan"],
  },
  {
    slug: "ai-engineer-pangasinan",
    kind: "location",
    title: "AI Engineer in Pangasinan",
    description:
      "AI engineer in Pangasinan: chatbots, automation, and internal tools for Pangasinan businesses, cooperatives, and clinics.",
    h1: "AI Engineer in Pangasinan",
    eyebrow: "Dagupan · Urdaneta · San Carlos · Alaminos",
    intro: [
      "Pangasinan businesses don't need to look to Manila for AI work. I'm a Pangasinan-based AI engineer, and much of the work on this site already runs here: billing and self-service for an electric cooperative's 250,000+ member-consumers, automated compliance reporting, and an AI-assisted refund approval queue. I've also built a multi-branch pharmacy and clinic platform with PhilHealth claims.",
      "I can meet in Urdaneta, Dagupan, or elsewhere in the province for the first session, then build and support remotely.",
    ],
    sections: [
      {
        heading: "Built for how Pangasinan runs",
        body: [
          "Cooperatives and utilities: billing portals, outage reporting, collections dashboards, compliance automation.",
          "Pharmacies and clinics: point of sale, dispensing, PhilHealth benefit claims, branch inventory.",
          "Schools, LGUs, cooperatives, and events: QR registration, member elections, and raffles that work on people's own phones.",
          "Retail and online sellers: chatbots for Messenger and the web, GCash and COD payment flows.",
        ],
      },
    ],
    proof: ["consumer-billing-self-service-portal", "wecare-pharmacy-pos-dispensing-platform", "real-time-cooperative-election-platform", "executive-live-collections-dashboard"],
    faqs: [
      { q: "Who builds AI systems in Pangasinan?", a: "I'm Les John Paul Oliver, an AI engineer based in Urdaneta City who has shipped production systems for a Pangasinan electric cooperative, plus pharmacy, event, and retail platforms." },
      { q: "Do you work with cooperatives and LGUs?", a: "Yes. Most of my production work is for an electric cooperative: billing, registration for 13,000 attendees across 5 venues, and compliance reporting. I've also built the election platform an employee cooperative votes on." },
      { q: "How much does an AI project cost in Pangasinan?", a: BOOK },
    ],
    faqsFil: [
      { q: "Sino ang gumagawa ng AI system sa Pangasinan?", a: "Ako si Les John Paul Oliver, AI engineer na taga-Urdaneta. Nakagawa na ako ng mga system para sa isang electric cooperative sa Pangasinan, pati para sa pharmacy, events, at online selling." },
      { q: "May AI developer ba sa Pangasinan na pwedeng i-hire?", a: `Oo. ${BOOK_FIL}` },
    ],
    areaServed: ["Pangasinan", "Dagupan City", "Urdaneta City", "San Carlos City", "Alaminos City", "Ilocos Region"],
    keywords: ["AI engineer Pangasinan", "AI developer Pangasinan", "software developer Pangasinan", "automation Pangasinan", "chatbot Pangasinan"],
  },
  {
    slug: "ai-engineer-ilocos-region",
    kind: "location",
    title: "AI Engineer, Ilocos Region (Region 1)",
    description:
      "AI engineer for the Ilocos Region (Region 1): Pangasinan, La Union, Ilocos Sur, and Ilocos Norte. Chatbots, automation, and dashboards.",
    h1: "AI Engineer in the Ilocos Region (Region 1)",
    eyebrow: "Pangasinan · La Union · Ilocos Sur · Ilocos Norte",
    intro: [
      "Region 1 has growing businesses, cooperatives, hospitals, and schools that need modern systems, and few engineers nearby who have shipped AI into production. I'm based in Urdaneta City, Pangasinan, and I build for the whole region: Pangasinan, La Union, Ilocos Sur, and Ilocos Norte.",
      "The proof is local: an electric cooperative in the region runs my billing portal, compliance automation, and AI-assisted refund queue, and an employee cooperative holds its elections on a platform I built.",
    ],
    sections: [
      {
        heading: "How projects across Region 1 run",
        body: ["A first meeting in Pangasinan or La Union when it helps, then remote build with weekly demos. You see working software early, not a slide deck at the end."],
      },
      {
        heading: "Common Region 1 projects",
        body: [
          "Electric and water cooperatives: member portals, billing, elections, reporting.",
          "Tourism and hospitality in La Union and the Ilocos provinces: booking assistants that answer guests around the clock.",
          "Hospitals, clinics, and pharmacies: dispensing, claims, and inventory.",
        ],
      },
    ],
    proof: ["real-time-cooperative-election-platform", "ai-assisted-refund-automation", "consumer-billing-self-service-portal"],
    faqs: [
      { q: "Is there an AI engineer in Region 1?", a: "Yes. I'm Les John Paul Oliver, based in Urdaneta City, Pangasinan, serving the whole Ilocos Region: Pangasinan, La Union, Ilocos Sur, and Ilocos Norte." },
      { q: "Do you work with businesses in La Union and Ilocos?", a: "Yes. The work is remote with weekly demos, and a first meeting in person can be arranged when the project needs it." },
      { q: "How much does it cost?", a: BOOK },
    ],
    faqsFil: [
      { q: "May AI engineer ba sa Region 1?", a: "Oo. Nakabase ako sa Urdaneta, Pangasinan, at sineserbisyuhan ko ang buong Ilocos Region: Pangasinan, La Union, Ilocos Sur, at Ilocos Norte." },
    ],
    areaServed: ["Ilocos Region", "Region 1", "Pangasinan", "La Union", "Ilocos Sur", "Ilocos Norte", "San Fernando City", "Vigan", "Laoag"],
    keywords: ["AI engineer Region 1", "AI engineer Ilocos Region", "software developer La Union", "AI developer Ilocos", "Region I IT services"],
  },
  {
    slug: "ai-engineer-north-luzon",
    kind: "location",
    title: "AI Engineer in North Luzon",
    description:
      "AI engineer in North Luzon: Pangasinan, La Union, Baguio, Tarlac, and Cagayan Valley. Chatbots, automation, and dashboards.",
    h1: "AI Engineer in North Luzon",
    eyebrow: "Pangasinan · Baguio · La Union · Tarlac · Cagayan Valley",
    intro: [
      "North Luzon businesses can hire an AI engineer without hiring from Manila. I'm based in Urdaneta City, Pangasinan, on the TPLEX corridor, within reach of Baguio, La Union, Tarlac, and Nueva Ecija, and I work remotely with clients across the north.",
      "What I bring: 10+ years shipping enterprise systems for 250,000+ end users, and AI that is already in production, not in a pitch deck.",
    ],
    sections: [
      {
        heading: "Who I build for in the north",
        body: [
          "Cooperatives and utilities across Regions 1, 2, and the Cordillera.",
          "Hotels, resorts, and tour operators in Baguio and La Union who need guest assistants.",
          "Clinics, pharmacies, and schools that want to replace paper and spreadsheets.",
          "Agri and trading businesses that need inventory and sales dashboards.",
        ],
      },
    ],
    proof: ["tax-compliance-automation", "wecare-pharmacy-pos-dispensing-platform", "distributed-event-registration-platform"],
    faqs: [
      { q: "Is there an AI engineer in North Luzon?", a: "Yes. I'm Les John Paul Oliver, an AI engineer in Urdaneta City, Pangasinan, working with clients across North Luzon and remotely worldwide." },
      { q: "Do you serve Baguio and Cagayan Valley?", a: "Yes, remotely, with an in-person kickoff when the project needs one." },
      { q: "How much does it cost?", a: BOOK },
    ],
    faqsFil: [
      { q: "May AI engineer ba sa North Luzon?", a: "Oo. Taga-Urdaneta, Pangasinan ako at tumatanggap ng proyekto mula sa buong Hilagang Luzon, pati Baguio, La Union, at Cagayan Valley." },
    ],
    areaServed: ["North Luzon", "Pangasinan", "La Union", "Baguio City", "Tarlac", "Nueva Ecija", "Ilocos Region", "Cagayan Valley", "Cordillera Administrative Region"],
    keywords: ["AI engineer North Luzon", "AI developer Northern Luzon", "software developer Baguio", "AI engineer Luzon"],
  },
];

export const getLandingPage = (slug: string) => landingPages.find((p) => p.slug === slug);
