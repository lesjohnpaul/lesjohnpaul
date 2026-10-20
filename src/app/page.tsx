import dynamic from "next/dynamic";
import { Navigation } from "@/components/layout/navigation";
import { HeroSection } from "@/components/sections/hero-section";
import { FaqSection } from "@/components/sections/faq-section";
import { faqs } from "@/data/portfolio-data";

const siteUrl = "https://lesjohnpauloliver.dev";
// Home is the profile page; FAQPage mirrors the visible FAQ section word for word.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "ProfilePage", "@id": `${siteUrl}/#profile`, url: siteUrl, mainEntity: { "@id": `${siteUrl}/#person` }, isPartOf: { "@id": `${siteUrl}/#website` } },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ],
};

// Below-the-fold sections are code-split so the hero paints and hydrates first.
const ServicesSection = dynamic(() =>
  import("@/components/sections/services-section").then((m) => m.ServicesSection)
);
const LivingGridSection = dynamic(() =>
  import("@/components/sections/living-grid-section").then((m) => m.LivingGridSection)
);
const SkillsSection = dynamic(() =>
  import("@/components/sections/skills-section").then((m) => m.SkillsSection)
);
const ExperienceSection = dynamic(() =>
  import("@/components/sections/experience-section").then((m) => m.ExperienceSection)
);
const ProjectsSection = dynamic(() =>
  import("@/components/sections/projects-section").then((m) => m.ProjectsSection)
);
const SneakerPortalShowcase = dynamic(() =>
  import("@/components/sections/sneaker-portal-showcase").then((m) => m.SneakerPortalShowcase)
);
const ContactSection = dynamic(() =>
  import("@/components/sections/contact-section").then((m) => m.ContactSection)
);
const ChatWidget = dynamic(() =>
  import("@/components/chat/chat-widget").then((m) => m.ChatWidget)
);
const Footer = dynamic(() =>
  import("@/components/layout/footer").then((m) => m.Footer)
);

export default function Home() {
  return (
    <main className="relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navigation />
      <HeroSection />
      <LivingGridSection />
      <ServicesSection />
      <ProjectsSection />
      <SneakerPortalShowcase />
      <SkillsSection />
      <ExperienceSection />
      <FaqSection />
      <ContactSection />
      <Footer />
      <ChatWidget />
    </main>
  );
}
