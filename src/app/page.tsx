import dynamic from "next/dynamic";
import { Navigation } from "@/components/layout/navigation";
import { HeroSection } from "@/components/sections/hero-section";

// Below-the-fold sections are code-split so the hero paints and hydrates first.
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
const PandoraSection = dynamic(() =>
  import("@/components/sections/pandora-section").then((m) => m.PandoraSection)
);
const ContactSection = dynamic(() =>
  import("@/components/sections/contact-section").then((m) => m.ContactSection)
);
const Footer = dynamic(() =>
  import("@/components/layout/footer").then((m) => m.Footer)
);

export default function Home() {
  return (
    <main className="relative">
      <Navigation />
      <HeroSection />
      <LivingGridSection />
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <SneakerPortalShowcase />
      <PandoraSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
