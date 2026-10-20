import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { services } from "@/data/portfolio-data";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://lesjohnpauloliver.dev";
const siteName = "Les John Paul Oliver";
const siteTitle = "Les John Paul Oliver | AI Engineer in the Philippines: AI Agents & Automation";
// ponytail: kept under ~160 chars so Google shows it whole instead of cutting it mid-sentence
const siteDescription =
  "Freelance AI engineer in the Philippines. I build AI agents, chatbots, and automations that turn weeks of manual work into minutes. Remote, worldwide.";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  // Android Chrome shrinks the layout for the keyboard, so the chat input stays visible.
  interactiveWidget: "resizes-content",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "Les John Paul Oliver",
    "AI Engineer",
    "AI Engineer Philippines",
    "AI Engineer in the Philippines",
    "Filipino AI Engineer",
    "Hire AI Engineer Philippines",
    "Freelance AI Engineer Philippines",
    "AI Automation Philippines",
    "AI Chatbot Developer Philippines",
    "Hire AI Engineer",
    "Freelance AI Engineer",
    "AI Automation Expert",
    "Business Process Automation",
    "AI Chatbot Developer",
    "AI Agent Developer",
    "LLM Integration",
    "Claude API Developer",
    "AI Consultant for Small Business",
    "Workflow Automation",
    "Full Stack Developer",
    "Next.js Developer",
    "Python Developer",
    "Remote AI Engineer",
    "Solutions Architect",
  ],
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: siteUrl,
    title: siteTitle,
    description: siteDescription,
    siteName: siteName,
    // og:image comes from src/app/opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    creator: "@lesjohnpaul",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
};

// One connected graph: Google reads Person, WebSite, and service as the same entity via @id.
const personId = `${siteUrl}/#person`;
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": personId,
      name: siteName,
      alternateName: ["Les Oliver", "LJP Oliver", "lesjohnpaul"],
      url: siteUrl,
      image: `${siteUrl}/images/lesjohnpaul.jpg`,
      email: "mailto:lesjohnpauloliver@gmail.com",
      jobTitle: "AI Engineer",
      description: siteDescription,
      hasOccupation: {
        "@type": "Occupation",
        name: "AI Engineer",
        occupationLocation: { "@type": "Country", name: "Philippines" },
        skills: "AI agents, LLM integration, chatbots, business process automation, full-stack development",
      },
      worksFor: { "@type": "Organization", name: "PANELCO III (Pangasinan III Electric Cooperative)" },
      alumniOf: { "@type": "CollegeOrUniversity", name: "Pangasinan State University" },
      nationality: { "@type": "Country", name: "Philippines" },
      homeLocation: { "@type": "Place", name: "Pangasinan, Philippines" },
      address: { "@type": "PostalAddress", addressRegion: "Pangasinan", addressCountry: "PH" },
      knowsLanguage: ["English", "Filipino"],
      sameAs: ["https://github.com/lesjohnpaul", "https://www.linkedin.com/in/lesjohnpaul/"],
      knowsAbout: [
        "Artificial Intelligence",
        "AI Agents",
        "Large Language Models",
        "Chatbots",
        "Business Process Automation",
        "Claude API",
        "Prompt Engineering",
        "Software Engineering",
        "Solutions Architecture",
        "Microsoft Azure",
        "Hybrid Cloud Migration",
        "Database Administration",
        "MS SQL Server",
        "PostgreSQL",
        "Supabase",
        "TypeScript",
        "React",
        "Next.js",
        "Node.js",
        "Python",
        "FastAPI",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: siteName,
      url: siteUrl,
      description: siteDescription,
      inLanguage: "en",
      publisher: { "@id": personId },
    },
    // Lets Google match "hire an AI engineer for X" searches to the services offered.
    {
      "@type": "ProfessionalService",
      "@id": `${siteUrl}/#service`,
      name: `${siteName}, AI Engineer`,
      url: siteUrl,
      image: `${siteUrl}/images/lesjohnpaul.jpg`,
      description: siteDescription,
      email: "lesjohnpauloliver@gmail.com",
      areaServed: [{ "@type": "Country", name: "Philippines" }, "Worldwide"],
      address: { "@type": "PostalAddress", addressRegion: "Pangasinan", addressCountry: "PH" },
      founder: { "@id": personId },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "AI engineering services",
        itemListElement: services.map((s) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: s.title, description: s.offer, provider: { "@id": personId } },
        })),
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }} suppressHydrationWarning>
      <head>
        {/* Runs before first paint: applies a saved light/system preference so there is never a
            theme flash. Dark is already the server default above. Keep in sync with ThemeProvider. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add("js");try{var t=localStorage.getItem("portfolio-theme");if(t==="system")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";if(t==="light"){var r=document.documentElement;r.classList.remove("dark");r.classList.add("light");r.style.colorScheme="light"}}catch(e){}`,
          }}
        />
        <meta name="color-scheme" content="dark light" />
        {/* Preload critical self-hosted fonts */}
        <link rel="preload" href="/fonts/clash-display-700.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/satoshi-400.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/satoshi-500.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={`${jetbrainsMono.variable} antialiased`}>
        <ThemeProvider defaultTheme="dark" storageKey="portfolio-theme">
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />

      </body>
    </html>
  );
}
