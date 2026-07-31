import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Section from "@/components/Section";
import ProjectCard from "@/components/ProjectCard";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Certifications from "@/components/Certifications";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { projects } from "@/content/projects";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />

        <Section id="work" label="Selected work" heading="Things I've built">
          <div className="grid gap-6 lg:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </Section>

        <Section id="experience" label="Experience" heading="Where I've worked">
          <Experience />
        </Section>

        <Section id="skills" label="Technical skills" heading="What I work with">
          <Skills />
        </Section>

        <Section
          id="certifications"
          label="Certifications"
          heading="Verified credentials"
        >
          <Certifications />
        </Section>

        <Section id="education" label="Education" heading="Background">
          <Education />
        </Section>

        <Section id="contact" label="Contact" heading="Get in touch">
          <Contact />
        </Section>
      </main>
      <Footer />
    </>
  );
}
