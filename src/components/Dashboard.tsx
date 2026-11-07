"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Award, Flame, GitBranch, GraduationCap, Star, Trophy, Users } from "lucide-react";
import type { AllStats } from "@/lib/stats";
import { certifications, education, handles, links } from "@/lib/data";
import { fade, spring } from "@/lib/motion";
import { Counter, Icons, Reveal, SectionHeader } from "./ui";

const langColors: Record<string, string> = {
  Python: "var(--accent-2)",
  TypeScript: "var(--accent)",
  JavaScript: "var(--accent-3)",
  Kotlin: "var(--success)",
  Java: "var(--danger)",
};
const otherLang = "var(--faint)";

function Status({ live }: { live: boolean }) {
  return (
    <span className={`t-caption inline-flex items-center gap-1.5 ${live ? "text-success" : "text-faint"}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${live ? "bg-success" : "bg-faint"}`} />
      {live ? "Live" : "Cached"}
    </span>
  );
}

function Tile({
  icon,
  title,
  href,
  live,
  className = "",
  children,
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  href?: string;
  live?: boolean;
  className?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <Reveal delay={delay} className={`card flex flex-col p-6 md:p-7 ${className}`}>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="t-headline flex items-center gap-2.5 text-ink">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-surface2">{icon}</span>
          {title}
        </div>
        <div className="flex items-center gap-3">
          {live !== undefined && <Status live={live} />}
          {href && (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${title}`}
              className="pressable grid h-8 w-8 place-items-center rounded-full text-faint hover:bg-surface2 hover:text-ink"
            >
              <ArrowUpRight className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
      {children}
    </Reveal>
  );
}

function Stat({ label, value, className = "", icon }: { label: string; value: number; className?: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-surface2 p-4">
      <div className={`t-caption flex items-center gap-1.5 ${className || "text-muted"}`}>
        {icon}
        {label}
      </div>
      <div className="t-number mt-2 text-[1.75rem] text-ink">
        <Counter value={value} />
      </div>
    </div>
  );
}

/** One ring per difficulty, each drawn to its share of everything solved. */
function DifficultyRings({ easy, medium, hard }: { easy: number; medium: number; hard: number }) {
  const reduce = useReducedMotion();
  const total = Math.max(1, easy + medium + hard);
  const rings = [
    { v: easy, r: 70, c: "var(--success)" },
    { v: medium, r: 55, c: "var(--accent-3)" },
    { v: hard, r: 40, c: "var(--danger)" },
  ];
  return (
    <svg viewBox="0 0 160 160" className="h-44 w-44 -rotate-90" aria-hidden>
      {rings.map((ring) => {
        const len = 2 * Math.PI * ring.r;
        return (
          <g key={ring.r}>
            <circle cx="80" cy="80" r={ring.r} fill="none" stroke="var(--surface-2)" strokeWidth="10" />
            <motion.circle
              cx="80"
              cy="80"
              r={ring.r}
              fill="none"
              stroke={ring.c}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={len}
              initial={{ strokeDashoffset: reduce ? len * (1 - ring.v / total) : len }}
              whileInView={{ strokeDashoffset: len * (1 - ring.v / total) }}
              viewport={{ once: true }}
              transition={reduce ? fade : { ...spring, duration: 1.2 }}
            />
          </g>
        );
      })}
    </svg>
  );
}

function Heatmap({ calendar }: { calendar: Record<string, number> }) {
  const weeks = 26;
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const byDay = new Map<number, number>();
  for (const [ts, n] of Object.entries(calendar)) {
    const d = Math.floor(Number(ts) / 86400);
    byDay.set(d, (byDay.get(d) ?? 0) + n);
  }
  const todayIdx = Math.floor(today.getTime() / 86400000);
  const start = todayIdx - (weeks * 7 - 1) - ((today.getUTCDay() + 1) % 7) + 1;
  const cells = Array.from({ length: weeks * 7 }, (_, i) => byDay.get(start + i) ?? 0);
  const max = Math.max(1, ...cells);
  const shade = (n: number) => (n === 0 ? "var(--surface-2)" : `rgba(var(--heat), ${0.3 + (n / max) * 0.7})`);
  return (
    <div className="grid grid-flow-col grid-rows-7 gap-[3px]" role="img" aria-label="LeetCode submissions over the last 26 weeks">
      {cells.map((n, i) => (
        <span key={i} title={`${n} submissions`} className="h-[11px] w-[11px] rounded-[3px] md:h-3 md:w-3" style={{ background: shade(n) }} />
      ))}
    </div>
  );
}

function Sparkline({ data }: { data: number[] }) {
  const reduce = useReducedMotion();
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 200},${60 - ((v - min) / (max - min || 1)) * 52 - 4}`);
  return (
    <svg viewBox="0 0 200 60" className="h-16 w-full" aria-hidden>
      <motion.polyline
        points={pts.join(" ")}
        fill="none"
        stroke="var(--accent-2)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: reduce ? 1 : 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={reduce ? fade : { ...spring, duration: 1.2 }}
      />
    </svg>
  );
}

export default function Dashboard({ stats }: { stats: AllStats }) {
  const reduce = useReducedMotion();
  const { leetcode: lc, codeforces: cf, github: gh } = stats;
  const vit = education[0];
  const totalLang = gh.languages.reduce((s, l) => s + l.count, 0) || 1;
  const synced = new Date(stats.fetchedAt).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });

  return (
    <section id="dashboard" className="scroll-mt-20 px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          kicker="Live dashboard"
          title="Numbers that update themselves."
          sub="Pulled from LeetCode, Codeforces and GitHub on the server and refreshed every hour."
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-5">
          <Tile className="md:col-span-4" icon={<Icons.leetcode className="h-4 w-4" />} title="LeetCode" href={links.leetcode} live={lc.live}>
            <div className="flex flex-col items-center gap-8 sm:flex-row">
              <div className="relative grid shrink-0 place-items-center">
                <DifficultyRings easy={lc.easy} medium={lc.medium} hard={lc.hard} />
                <div className="absolute text-center">
                  <div className="t-number text-[2.5rem] text-ink">
                    <Counter value={lc.solved} />
                  </div>
                  <div className="t-caption text-muted">solved</div>
                </div>
              </div>
              <div className="grid w-full flex-1 grid-cols-3 gap-3">
                <Stat label="Easy" value={lc.easy} className="text-success" />
                <Stat label="Medium" value={lc.medium} className="text-accent3" />
                <Stat label="Hard" value={lc.hard} className="text-danger" />
                <div className="t-callout col-span-3 flex flex-wrap gap-x-5 gap-y-1.5 pt-1 text-muted">
                  {lc.ranking && (
                    <span className="flex items-center gap-1.5">
                      <Trophy className="h-4 w-4 text-accent3" /> Global rank #{lc.ranking.toLocaleString("en-IN")}
                    </span>
                  )}
                  {lc.streak > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Flame className="h-4 w-4 text-accent" /> {lc.streak}-day streak
                    </span>
                  )}
                  {lc.contestRating && <span>Contest rating {lc.contestRating}</span>}
                  {lc.activeDays > 0 && <span>{lc.activeDays} active days this year</span>}
                </div>
              </div>
            </div>
          </Tile>

          <Tile className="md:col-span-2" icon={<GraduationCap className="h-4 w-4" />} title="VIT Vellore" delay={0.05}>
            <div className="mt-auto">
              <div className="t-number text-[4.5rem] text-ink">
                <Counter value={Number(vit.score)} decimals={2} />
              </div>
              <p className="t-callout mt-2 text-muted">CGPA · B.Tech CSE · Class of 2027</p>
              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-surface2">
                <motion.div
                  className="h-full origin-left rounded-full bg-accent2"
                  initial={{ scaleX: reduce ? Number(vit.score) / 10 : 0 }}
                  whileInView={{ scaleX: Number(vit.score) / 10 }}
                  viewport={{ once: true }}
                  transition={reduce ? fade : { ...spring, duration: 1.2 }}
                />
              </div>
            </div>
          </Tile>

          <Tile className="md:col-span-3" icon={<Flame className="h-4 w-4" />} title="Submission activity" live={lc.live}>
            {Object.keys(lc.calendar).length > 0 ? (
              <div className="no-scrollbar -mx-1 overflow-x-auto px-1 pb-1">
                <Heatmap calendar={lc.calendar} />
              </div>
            ) : (
              <div className="t-callout grid h-28 place-items-center rounded-2xl bg-surface2 text-faint">
                The heatmap appears once LeetCode syncs.
              </div>
            )}
            <p className="t-caption mt-auto pt-4 text-faint">Last 26 weeks of LeetCode submissions.</p>
          </Tile>

          <Tile className="md:col-span-3" icon={<Icons.codeforces className="h-4 w-4" />} title="Codeforces" href={links.codeforces} live={cf.live} delay={0.05}>
            {cf.rating ? (
              <div className="flex items-end justify-between gap-6">
                <div>
                  <div className="t-number text-[3rem] text-ink">
                    <Counter value={cf.rating} />
                  </div>
                  <div className="t-callout mt-2 capitalize text-muted">
                    {cf.rank} · max {cf.maxRating}
                  </div>
                </div>
                <div className="w-1/2">
                  <Sparkline data={cf.history.map((h) => h.rating)} />
                </div>
              </div>
            ) : (
              <div>
                <div className="t-title3 text-ink">Warming up</div>
                <p className="t-callout mt-1 text-muted">Unrated so far. The rating graph appears after the first rated contest.</p>
              </div>
            )}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Stat label="Problems solved" value={cf.solved} />
              <Stat label="Rated contests" value={cf.contests} />
            </div>
          </Tile>

          <Tile className="md:col-span-4" icon={<Icons.github className="h-4 w-4" />} title={`GitHub · ${handles.github}`} href={links.github} live={gh.live}>
            <div className="grid grid-cols-3 gap-3">
              <Stat label="Repos" value={gh.publicRepos} icon={<GitBranch className="h-3.5 w-3.5" />} />
              <Stat label="Stars" value={gh.stars} icon={<Star className="h-3.5 w-3.5" />} />
              <Stat label="Followers" value={gh.followers} icon={<Users className="h-3.5 w-3.5" />} />
            </div>
            <div className="mt-6 flex h-2 gap-[2px] overflow-hidden rounded-full" role="img" aria-label="Languages across public repositories">
              {gh.languages.map((l) => (
                <span key={l.name} style={{ width: `${(l.count / totalLang) * 100}%`, background: langColors[l.name] ?? otherLang }} />
              ))}
            </div>
            <div className="t-caption mt-3 flex flex-wrap gap-x-4 gap-y-1 text-muted">
              {gh.languages.map((l) => (
                <span key={l.name} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: langColors[l.name] ?? otherLang }} />
                  {l.name} {Math.round((l.count / totalLang) * 100)}%
                </span>
              ))}
            </div>
          </Tile>

          <Tile className="md:col-span-2" icon={<Award className="h-4 w-4" />} title="Credentials" delay={0.05}>
            <div className="t-number text-[4.5rem] text-ink">
              <Counter value={certifications.length} />
            </div>
            <p className="t-callout mt-2 text-muted">Verified Google Cloud & Oracle certifications</p>
            <a href="#credentials" className="t-callout pressable mt-auto inline-flex items-center gap-1 self-start pt-5 font-medium text-accent-ink">
              See all <ArrowUpRight className="h-4 w-4" />
            </a>
          </Tile>
        </div>

        <p className="t-caption mt-5 text-faint">Last synced {synced} IST</p>
      </div>
    </section>
  );
}
