import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { CustomCursor } from "@/components/ui/custom-cursor";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Les John Paul Oliver | IT Expert & Software Engineer",
  description:
    "IT Expert, Software Engineer, and Developer specializing in cloud engineering, database administration, and AI-driven solutions. Building systems that scale and solutions that matter.",
  keywords: [
    "Software Engineer",
    "Cloud Engineer",
    "Database Administrator",
    "Full Stack Developer",
    "AI Solutions",
    "System Architecture",
    "AWS",
    "DevOps",
  ],
  authors: [{ name: "Les John Paul Oliver" }],
  creator: "Les John Paul Oliver",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yoursite.com",
    title: "Les John Paul Oliver | IT Expert & Software Engineer",
    description:
      "Building systems that scale. Crafting solutions that matter.",
    siteName: "Les John Paul Oliver Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Les John Paul Oliver | IT Expert & Software Engineer",
    description:
      "Building systems that scale. Crafting solutions that matter.",
    creator: "@yourusername",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
