"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Award, Flame, GitBranch, GraduationCap, Star, Trophy, Users } from "lucide-react";
import type { AllStats } from "@/lib/stats";
import { certifications, links } from "@/lib/data";
import { Counter, Icons, Reveal, SectionHeading, TiltCard } from "./ui";

const langColors: Record<string, string> = {
  Python: "#60a5fa",
  TypeScript: "#22d3ee",
  JavaScript: "#facc15",
  Kotlin: "#a78bfa",
  Java: "#f97316",
  HTML: "#f472b6",
  "Jupyter Notebook": "#fb923c",
};

function LiveBadge({ live }: { live: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest ${
        live ? "bg-emerald-400/10 text-emerald-300" : "bg-white/5 text-white/40"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${live ? "animate-pulse bg-emerald-400" : "bg-white/30"}`} />
      {live ? "live" : "cached"}
    </span>
  );
}

function CardHeader({
  icon,
  title,
  href,
  live,
}: {
  icon: React.ReactNode;
  title: string;
  href?: string;
  live?: boolean;
}) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3 text-white/80">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 text-white">{icon}</span>
        <span className="font-medium">{title}</span>
      </div>
      <div className="flex items-center gap-2">
        {live !== undefined && <LiveBadge live={live} />}
        {href && (
          <a href={href} target="_blank" rel="noreferrer" aria-label={`Open ${title}`} className="text-white/40 transition hover:text-white">
            <ArrowUpRight className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  );
}

/** Three concentric arcs, one per difficulty, drawn in when scrolled into view. */
function DifficultyRings({ easy, medium, hard }: { easy: number; medium: number; hard: number }) {
  const rings = [
    { v: easy, r: 70, c: "#2dd4bf" },
    { v: medium, r: 56, c: "#fbbf24" },
    { v: hard, r: 42, c: "#f43f5e" },
  ];
  return (
    <svg viewBox="0 0 160 160" className="h-44 w-44 -rotate-90">
      {rings.map((ring) => {
        const len = 2 * Math.PI * ring.r;
        // Each arc shows that difficulty's share of everything solved.
        const frac = ring.v / Math.max(1, easy + medium + hard);
        return (
          <g key={ring.r}>
            <circle cx="80" cy="80" r={ring.r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="9" />
            <motion.circle
              cx="80"
              cy="80"
              r={ring.r}
              fill="none"
              stroke={ring.c}
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={len}
              initial={{ strokeDashoffset: len }}
              whileInView={{ strokeDashoffset: len * (1 - frac) }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ filter: `drop-shadow(0 0 6px ${ring.c}88)` }}
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
  const shade = (n: number) => {
    if (n === 0) return "rgba(255,255,255,0.05)";
    const a = 0.25 + (n / max) * 0.75;
    return `rgba(124, 92, 255, ${a})`;
  };
  return (
    <div className="grid grid-flow-col grid-rows-7 gap-[3px]">
      {cells.map((n, i) => (
        <motion.span
          key={i}
          title={`${n} submissions`}
          className="h-2.5 w-2.5 rounded-[3px] md:h-3 md:w-3"
          style={{ background: shade(n), boxShadow: n ? "0 0 8px rgba(124,92,255,0.5)" : undefined }}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: (i / cells.length) * 0.8, duration: 0.3 }}
        />
      ))}
    </div>
  );
}

function Sparkline({ data }: { data: number[] }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 200},${60 - ((v - min) / (max - min || 1)) * 52 - 4}`);
  return (
    <svg viewBox="0 0 200 60" className="h-16 w-full">
      <motion.polyline
        points={pts.join(" ")}
        fill="none"
        stroke="url(#cfGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6 }}
      />
      <defs>
        <linearGradient id="cfGrad" x1="0" x2="1">
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset="1" stopColor="#f472b6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Dashboard({ stats }: { stats: AllStats }) {
  const { leetcode: lc, codeforces: cf, github: gh } = stats;
  const totalLang = gh.languages.reduce((s, l) => s + l.count, 0) || 1;
  const synced = new Date(stats.fetchedAt).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });

  return (
    <section id="dashboard" className="relative px-6 py-32 md:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="01 / Live dashboard"
          title="Numbers that update themselves."
          sub="Pulled straight from LeetCode, Codeforces and GitHub, refreshed every hour."
        />

        <div className="grid auto-rows-[minmax(0,auto)] grid-cols-1 gap-5 md:grid-cols-6">
          {/* LeetCode */}
          <Reveal className="md:col-span-4">
            <TiltCard intensity={4} className="h-full p-7" glow="rgba(251,191,36,0.18)">
              <CardHeader icon={<Icons.leetcode className="h-4 w-4" />} title="LeetCode" href={links.leetcode} live={lc.live} />
              <div className="flex flex-col items-center gap-8 sm:flex-row">
                <div className="relative grid place-items-center">
                  <DifficultyRings easy={lc.easy} medium={lc.medium} hard={lc.hard} />
                  <div className="absolute text-center">
                    <div className="text-4xl font-semibold text-white">
                      <Counter value={lc.solved} />
                    </div>
                    <div className="text-xs uppercase tracking-widest text-white/40">solved</div>
                  </div>
                </div>
                <div className="grid w-full flex-1 grid-cols-3 gap-3">
                  {(
                    [
                      ["Easy", lc.easy, "text-teal-300"],
                      ["Medium", lc.medium, "text-amber-300"],
                      ["Hard", lc.hard, "text-rose-400"],
                    ] as const
                  ).map(([label, v, color]) => (
                    <div key={label} className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                      <div className={`text-sm ${color}`}>{label}</div>
                      <div className="mt-1 text-3xl font-semibold text-white">
                        <Counter value={v} />
                      </div>
                    </div>
                  ))}
                  <div className="col-span-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/50">
                    {lc.ranking && (
                      <span className="flex items-center gap-1.5">
                        <Trophy className="h-4 w-4 text-amber-300" /> Global rank #{lc.ranking.toLocaleString("en-IN")}
                      </span>
                    )}
                    {lc.streak > 0 && (
                      <span className="flex items-center gap-1.5">
                        <Flame className="h-4 w-4 text-orange-400" /> {lc.streak}-day streak
                      </span>
                    )}
                    {lc.contestRating && <span>Contest rating {lc.contestRating}</span>}
                    {lc.activeDays > 0 && <span>{lc.activeDays} active days this year</span>}
                  </div>
                </div>
              </div>
            </TiltCard>
          </Reveal>

          {/* CGPA */}
          <Reveal className="md:col-span-2" delay={0.1}>
            <TiltCard className="flex h-full flex-col p-7" glow="rgba(34,211,238,0.22)">
              <CardHeader icon={<GraduationCap className="h-4 w-4" />} title="VIT Vellore" />
              <div className="mt-auto">
                <div className="text-7xl font-semibold tracking-tight text-white">
                  <Counter value={9.17} decimals={2} />
                </div>
                <div className="mt-2 text-white/50">CGPA · B.Tech CSE · Class of 2027</div>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-400"
                    initial={{ width: 0 }}
                    whileInView={{ width: "91.7%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            </TiltCard>
          </Reveal>

          {/* Activity heatmap */}
          <Reveal className="md:col-span-3" delay={0.05}>
            <TiltCard intensity={4} className="h-full p-7">
              <CardHeader icon={<Flame className="h-4 w-4" />} title="Submission activity" live={lc.live} />
              {Object.keys(lc.calendar).length > 0 ? (
                <div className="overflow-x-auto pb-1">
                  <Heatmap calendar={lc.calendar} />
                </div>
              ) : (
                <div className="grid h-28 place-items-center rounded-2xl border border-dashed border-white/10 text-sm text-white/40">
                  Activity heatmap appears once LeetCode syncs.
                </div>
              )}
              <p className="mt-4 text-sm text-white/40">Last 26 weeks of LeetCode submissions.</p>
            </TiltCard>
          </Reveal>

          {/* Codeforces */}
          <Reveal className="md:col-span-3" delay={0.1}>
            <TiltCard intensity={4} className="h-full p-7" glow="rgba(96,165,250,0.22)">
              <CardHeader icon={<Icons.codeforces className="h-4 w-4" />} title="Codeforces" href={links.codeforces} live={cf.live} />
              {cf.rating ? (
                <div className="flex items-end justify-between gap-6">
                  <div>
                    <div className="text-5xl font-semibold text-white">
                      <Counter value={cf.rating} />
                    </div>
                    <div className="mt-1 capitalize text-white/50">
                      {cf.rank} · max {cf.maxRating}
                    </div>
                  </div>
                  <div className="w-1/2">
                    <Sparkline data={cf.history.map((h) => h.rating)} />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-3xl font-semibold text-white">Warming up</div>
                  <div className="mt-1 text-white/50">Unrated so far. The rating graph appears after the first rated contest.</div>
                </div>
              )}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                  <div className="text-sm text-white/40">Problems solved</div>
                  <div className="mt-1 text-2xl font-semibold text-white">
                    <Counter value={cf.solved} />
                  </div>
                </div>
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                  <div className="text-sm text-white/40">Rated contests</div>
                  <div className="mt-1 text-2xl font-semibold text-white">
                    <Counter value={cf.contests} />
                  </div>
                </div>
              </div>
            </TiltCard>
          </Reveal>

          {/* GitHub */}
          <Reveal className="md:col-span-4" delay={0.05}>
            <TiltCard intensity={3} className="h-full p-7" glow="rgba(167,139,250,0.22)">
              <CardHeader icon={<Icons.github className="h-4 w-4" />} title="GitHub · sehrawaty" href={links.github} live={gh.live} />
              <div className="mb-6 grid grid-cols-3 gap-3">
                {(
                  [
                    [<GitBranch key="r" className="h-4 w-4" />, gh.publicRepos, "repos"],
                    [<Star key="s" className="h-4 w-4" />, gh.stars, "stars"],
                    [<Users key="f" className="h-4 w-4" />, gh.followers, "followers"],
                  ] as const
                ).map(([icon, v, label]) => (
                  <div key={label} className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                    <div className="flex items-center gap-1.5 text-sm text-white/40">
                      {icon} {label}
                    </div>
                    <div className="mt-1 text-2xl font-semibold text-white">
                      <Counter value={v} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mb-2 flex h-2.5 overflow-hidden rounded-full bg-white/5">
                {gh.languages.map((l, i) => (
                  <motion.span
                    key={l.name}
                    style={{ background: langColors[l.name] ?? "#94a3b8" }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(l.count / totalLang) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: i * 0.1 }}
                  />
                ))}
              </div>
              <div className="mb-6 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/50">
                {gh.languages.map((l) => (
                  <span key={l.name} className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: langColors[l.name] ?? "#94a3b8" }} />
                    {l.name} {Math.round((l.count / totalLang) * 100)}%
                  </span>
                ))}
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {gh.repos.map((r) => (
                  <a
                    key={r.name}
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group/repo rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 transition hover:border-violet-400/40 hover:bg-violet-400/5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-mono text-sm text-white/85">{r.name}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-white/30 transition group-hover/repo:rotate-45 group-hover/repo:text-white" />
                    </div>
                    <div className="mt-1 line-clamp-1 text-xs text-white/40">{r.description ?? r.language ?? "Repository"}</div>
                  </a>
                ))}
              </div>
            </TiltCard>
          </Reveal>

          {/* Credentials count */}
          <Reveal className="md:col-span-2" delay={0.1}>
            <TiltCard className="flex h-full flex-col p-7" glow="rgba(244,114,182,0.22)">
              <CardHeader icon={<Award className="h-4 w-4" />} title="Verified credentials" />
              <div className="text-7xl font-semibold text-white">
                <Counter value={certifications.length} />
              </div>
              <div className="mt-2 text-white/50">Google Cloud & Oracle certifications</div>
              <div className="mt-auto flex -space-x-2 pt-6">
                {certifications.map((c, i) => (
                  <span
                    key={c.name}
                    className="grid h-10 w-10 place-items-center rounded-full border-2 border-[#07071a] font-mono text-[10px] font-semibold text-black"
                    style={{ background: i === 0 ? "#60a5fa" : ["#f87171", "#fb7185", "#f472b6", "#e879f9", "#c084fc"][i - 1] }}
                    title={c.name}
                  >
                    {c.issuer === "Google Cloud" ? "GCP" : "OCI"}
                  </span>
                ))}
              </div>
              <a href="#credentials" className="mt-4 text-sm text-pink-300/80 hover:text-pink-200">
                See all →
              </a>
            </TiltCard>
          </Reveal>
        </div>

        <p className="mt-6 font-mono text-xs text-white/30">Last synced {synced} IST</p>
      </div>
    </section>
  );
}
