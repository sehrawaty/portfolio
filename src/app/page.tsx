import { ContinueRow, Billboard } from "@/components/Billboard";
import { Cursor, Nav } from "@/components/Chrome";
import { BoxOffice, Finale, Journey, Moments, Originals, Pilot, SkillUniverse, TopPicks } from "@/components/Sections";
import { SeriesProvider, SeriesSections } from "@/components/Series";
import { getAllStats } from "@/lib/stats";

// Rebuild the page (and re-pull live stats) at most once an hour.
export const revalidate = 3600;

export default async function Home() {
  const stats = await getAllStats();
  return (
    <SeriesProvider>
      <Cursor />
      <Nav />
      <main className="relative">
        <Billboard />
        <ContinueRow />
        <SeriesSections
          sections={{
            stats: <BoxOffice stats={stats} />,
            moments: <Moments stats={stats} />,
            skills: <SkillUniverse />,
            originals: <Originals repos={stats.github.repos} />,
            about: <Pilot />,
            journey: <Journey />,
            picks: <TopPicks />,
          }}
        />
        <Finale />
      </main>
    </SeriesProvider>
  );
}
