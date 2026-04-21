import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { ReadingChrome } from "@/components/layout/reading-chrome";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://lesjohnpauloliver.com";
const siteName = "Les John Paul Oliver";
const siteTitle =
  "Les John Paul Oliver | AI-Native Full Stack Engineer · Legacy Modernization";
const siteDescription =
  "AI-native Full Stack Engineer with 10+ years shipping production systems for 200,000+ Filipino consumers at PANELCO III. Specializing in legacy modernization, React/Next.js, MS SQL Server, Azure/AWS cloud, and AI-augmented development workflows (Claude Code, Cursor, MCP, RAG). Based in Urdaneta City, Pangasinan — open to remote & AI-native roles.";

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
    "AI-Native Developer",
    "AI-Augmented Engineering",
    "Claude Code",
    "Cursor IDE",
    "MCP Integrations",
    "RAG Pipelines",
    "Full Stack Engineer",
    "Legacy Modernization",
    "Next.js Developer",
    "React Developer",
    "TypeScript Developer",
    "Node.js Developer",
    "Python FastAPI Developer",
    "MS SQL Server Administrator",
    "Azure Cloud Engineer",
    "AWS Developer",
    "Business Systems Developer",
    "PANELCO III",
    "Pangasinan III Electric Cooperative",
    "Urdaneta Pangasinan",
    "Philippines Full Stack Developer",
    "GoIT Graduate",
    "Remote Developer Philippines",
    "Freelance Engineer",
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
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: `${siteName} - AI-Native Full Stack Engineer & Legacy Modernization Specialist`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    creator: "@lesjohnpaul",
    images: [`${siteUrl}/og-image.jpg`],
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
  // TODO: add your Google Search Console verification code when you claim the domain.
  // verification: { google: "..." },
  category: "technology",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Les John Paul Oliver",
  url: siteUrl,
  image: `${siteUrl}/images/LesPaul.jpeg`,
  jobTitle: "AI-Native Full Stack Engineer & Legacy Modernization Specialist",
  worksFor: {
    "@type": "Organization",
    name: "Pangasinan III Electric Cooperative (PANELCO III)",
    url: "https://www.panelco3.com.ph/",
  },
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: "Pangasinan State University",
    },
    {
      "@type": "EducationalOrganization",
      name: "GoIT — Full Stack Web Development",
    },
  ],
  description: siteDescription,
  address: {
    "@type": "PostalAddress",
    addressCountry: "PH",
    addressRegion: "Pangasinan",
    addressLocality: "Urdaneta",
  },
  sameAs: [
    "https://github.com/lesjohnpaul",
    "https://www.linkedin.com/in/lesjohnpaul/",
  ],
  knowsAbout: [
    "AI-Augmented Software Engineering",
    "Claude Code",
    "Cursor IDE",
    "MCP Integrations",
    "RAG Pipelines",
    "Legacy Modernization",
    "Full Stack Web Development",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Python",
    "FastAPI",
    "PHP",
    "C#",
    "Android Development",
    "MS SQL Server",
    "PostgreSQL",
    "MongoDB",
    "Azure",
    "AWS",
    "Docker",
    "Hyper-Converged Infrastructure",
    "Linux Server Administration",
    "Database Optimization",
    "Cybersecurity",
    "Technical Writing",
  ],
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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload Custom Fonts */}
        <link
          rel="preconnect"
          href="https://api.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@200,300,400,500,600,700&f[]=satoshi@300,400,500,600,700,900&display=swap"
          rel="stylesheet"
        />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className={`${jetbrainsMono.variable} antialiased`}>
        <ThemeProvider defaultTheme="dark" storageKey="portfolio-theme">
          <ReadingChrome />
          <CustomCursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
