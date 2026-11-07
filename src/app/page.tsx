import Architecture from "@/components/Architecture";
import { Nav } from "@/components/Chrome";
import Dashboard from "@/components/Dashboard";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import { About, Contact, Credentials, Experience, Skills } from "@/components/Sections";
import { getAllStats } from "@/lib/stats";

// Rebuild the page (and re-pull live stats) at most once an hour.
export const revalidate = 3600;

export default async function Home() {
  const stats = await getAllStats();
  return (
    <>
      <a
        href="#dashboard"
        className="t-callout sr-only z-50 rounded-full bg-ink px-4 py-2 text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Nav />
      <main>
        <Hero leetcode={stats.leetcode} />
        <Dashboard stats={stats} />
        <Projects repos={stats.github.repos} />
        <Architecture />
        <Experience />
        <Skills />
        <Credentials />
        <About />
        <Contact />
      </main>
    </>
  );
}
