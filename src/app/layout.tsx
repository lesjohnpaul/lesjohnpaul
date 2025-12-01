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

const siteUrl = "https://lesjohnpauloliver.com";
const siteName = "Les John Paul Oliver";
const siteTitle = "Les John Paul Oliver | Software Engineer & Cloud Architect";
const siteDescription =
  "Senior Software Engineer and Cloud Architect based in the Philippines. Specializing in AWS, GCP, Azure cloud infrastructure, database optimization, and AI-driven solutions. 8+ years of experience building scalable systems.";

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
    "AWS Expert",
    "GCP Engineer",
    "Azure Developer",
    "Full Stack Developer",
    "Database Administrator",
    "PostgreSQL Expert",
    "AI Solutions Developer",
    "System Architecture",
    "DevOps Engineer",
    "Kubernetes",
    "Docker",
    "TypeScript Developer",
    "React Developer",
    "Next.js Developer",
    "Node.js Developer",
    "Python Developer",
    "Philippines Software Engineer",
    "Remote Software Engineer",
    "Cloud Migration Specialist",
    "Infrastructure as Code",
    "Terraform",
    "CI/CD Pipeline",
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
  verification: {
    google: "your-google-verification-code",
  },
  category: "technology",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Les John Paul Oliver",
  url: siteUrl,
  image: `${siteUrl}/images/LesPaul.jpeg`,
  jobTitle: "Senior Software Engineer & Cloud Architect",
  worksFor: {
    "@type": "Organization",
    name: "Freelance / Available for Projects",
  },
  description: siteDescription,
  address: {
    "@type": "PostalAddress",
    addressCountry: "PH",
    addressLocality: "Philippines",
  },
  sameAs: [
    "https://github.com/lesjohnpaul",
    "https://linkedin.com/in/lesjohnpauloliver",
  ],
  knowsAbout: [
    "Software Engineering",
    "Cloud Architecture",
    "AWS",
    "Google Cloud Platform",
    "Microsoft Azure",
    "Database Administration",
    "PostgreSQL",
    "MongoDB",
    "Kubernetes",
    "Docker",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Python",
    "AI Solutions",
    "Machine Learning",
    "DevOps",
    "CI/CD",
    "Terraform",
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
          <CustomCursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
