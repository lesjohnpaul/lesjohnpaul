import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { CustomCursor } from "@/components/ui/custom-cursor";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://lesjohnpauloliver.dev";
const siteName = "Les John Paul Oliver";
const siteTitle = "Les John Paul Oliver | Solutions Architect & Senior Software Engineer";
const siteDescription =
  "Solutions Architect and Senior Software Engineer in Pangasinan, Philippines. Sole architect of enterprise systems for a 200K-member utility cooperative — Azure hybrid cloud, production MS SQL DBA, distributed real-time apps, and AI integrations. 10+ years in enterprise IT.";

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
    "Software Engineer",
    "Cloud Architect",
    "Solutions Architect",
    "Azure Hybrid Cloud",
    "Full Stack Developer",
    "Database Administrator",
    "MS SQL Server DBA",
    "AI Solutions Developer",
    "System Architecture",
    "Docker",
    "TypeScript Developer",
    "React Developer",
    "Next.js Developer",
    "Node.js Developer",
    "Python Developer",
    "Philippines Software Engineer",
    "Remote Software Engineer",
    "Cloud Migration Specialist",
    "FastAPI Developer",
    "Supabase",
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
        alt: `${siteName} - Software Engineer & Cloud Architect`,
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
  category: "technology",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Les John Paul Oliver",
  url: siteUrl,
  image: `${siteUrl}/images/lesjohnpaul.jpg`,
  jobTitle: "Solutions Architect & Senior Software Engineer",
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
    "AI Integrations",
    "Network Security",
    "Process Automation",
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
      </head>
      <body className={`${jetbrainsMono.variable} antialiased`}>
        <ThemeProvider defaultTheme="dark" storageKey="portfolio-theme">
          <CustomCursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
