import type { Metadata } from "next";
import { StudioExperience } from "@/components/studio/studio-experience";
import { proofItems } from "@/lib/studio/proof";

const title = "Studio: watch your system get built | Les John Paul Oliver";
const alt = "Glowing 3D app blocks and Pao, Les's AI assistant, on a dark background";
const description =
  "Describe your business in one line and watch a clickable prototype of your system get built in seconds. Free, no sign-up. Then book a call to make it real.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/studio" },
  openGraph: {
    title,
    description,
    url: "/studio",
    type: "website",
    locale: "en_PH",
    images: [{ url: "/studio/og.jpg", width: 1200, height: 630, alt }],
    videos: [{ url: "/studio/loop.mp4", type: "video/mp4", width: 1920, height: 1080 }],
  },
  twitter: { card: "summary_large_image", title, description, creator: "@lesjohnpaul", images: [{ url: "/studio/og.jpg", alt }] },
};

export default function StudioPage() {
  return <StudioExperience proof={proofItems()} />;
}
