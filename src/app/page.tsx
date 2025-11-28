import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { PandoraSection } from "@/components/sections/pandora-section";
import { ContactSection } from "@/components/sections/contact-section";

export default function Home() {
  return (
    <main className="relative">
      <Navigation />
      <HeroSection />
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <PandoraSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
