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
const siteTitle = "Les John Paul Oliver | AI Engineer: AI Agents, Chatbots & Business Automation";
const siteDescription =
  "AI Engineer in the Philippines who builds AI agents, chatbots, and business automation that solve real problems, fast. Cut a 2-week compliance process to under 5 minutes. 10+ years shipping production systems for a 250K-member utility. Available for freelance and remote work.";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
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
    locale: "en_US",
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Les John Paul Oliver",
  url: siteUrl,
  image: `${siteUrl}/images/lesjohnpaul.jpg`,
  jobTitle: "AI Engineer",
  worksFor: {
    "@type": "Organization",
    name: "PANELCO III (Pangasinan III Electric Cooperative)",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Pangasinan State University",
  },
  description: siteDescription,
  address: {
    "@type": "PostalAddress",
    addressCountry: "PH",
    addressLocality: "Pangasinan",
  },
  sameAs: [
    "https://github.com/lesjohnpaul",
    "https://www.linkedin.com/in/lesjohnpaul/",
  ],
  knowsAbout: [
    "Artificial Intelligence",
    "AI Agents",
    "Large Language Models",
    "Chatbots",
    "Business Process Automation",
    "Claude API",
    "Software Engineering",
    "Solutions Architecture",
    "Microsoft Azure",
    "AWS",
    "Hybrid Cloud Migration",
    "Database Administration",
    "MS SQL Server",
    "MySQL",
    "PostgreSQL",
    "Supabase",
    "Docker",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Python",
    "FastAPI",
    "Network Security",
  ],
};

// Lets Google match "hire an AI engineer for X" searches to the services offered.
const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: `${siteName}, AI Engineer`,
  url: siteUrl,
  description: siteDescription,
  areaServed: "Worldwide",
  address: { "@type": "PostalAddress", addressCountry: "PH", addressLocality: "Pangasinan" },
  founder: { "@type": "Person", name: siteName },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "AI engineering services",
    itemListElement: services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.title, description: s.offer },
    })),
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteName,
  url: siteUrl,
  description: siteDescription,
  author: {
    "@type": "Person",
    name: siteName,
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
        />
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
