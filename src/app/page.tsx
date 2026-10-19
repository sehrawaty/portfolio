import Architecture from "@/components/Architecture";
import { Nav } from "@/components/Chrome";
import Dashboard from "@/components/Dashboard";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import { Background, Contact, Credentials, Experience, Skills } from "@/components/Sections";
import { getAllStats } from "@/lib/stats";

// Rebuild the page (and re-pull live stats) at most once an hour.
export const revalidate = 3600;

export default async function Home() {
  const stats = await getAllStats();
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Dashboard stats={stats} />
        <Projects />
        <Architecture />
        <Experience />
        <Skills />
        <Credentials />
        <Background />
        <Contact />
      </main>
    </>
  );
}
