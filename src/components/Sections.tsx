"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, BarChart3, CreditCard, Play, RotateCcw } from "lucide-react";
import { useState } from "react";
import type { AllStats, Repo } from "@/lib/stats";
import {
  certifications,
  experience,
  links,
  moments,
  originalsMeta,
  portrait,
  profile,
  projects,
  seasons,
  series,
  skillGenres,
  topPicks,
} from "@/lib/data";
import { Logo } from "./Chrome";
import { useSeries } from "./Series";
import { Counter, Icons, Reveal, SeriesHeading } from "./ui";

const ease = [0.22, 1, 0.36, 1] as const;
const shell = "mx-auto w-full max-w-[1500px] px-4 md:px-10";
const section = "relative scroll-mt-24 py-16 md:py-24";
const poster = (c: string) => ({ background: `linear-gradient(140deg, ${c}, color-mix(in srgb, ${c} 30%, var(--poster-shade)))` });

/* ---------------------------------------------------------------- Box Office (live stats) */

function LiveBadge({ live }: { live: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-sm bg-ink/5 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted">
      <span className={`h-1.5 w-1.5 rounded-full ${live ? "animate-pulse bg-success" : "bg-muted"}`} />
      {live ? "Live" : "Cached"}
    </span>
  );
}

function StatCard({ title, href, live, children }: { title: string; href: string; live: boolean; children: React.ReactNode }) {
  return (
    <Reveal>
      <div className="h-full rounded-md border border-line bg-surface p-5 transition duration-300 hover:-translate-y-1 hover:border-accent/50 md:p-6">
        <div className="mb-5 flex items-center justify-between">
          <a href={href} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-display text-2xl tracking-wide text-ink hover:text-accent">
            {title} <ArrowUpRight className="h-4 w-4" />
          </a>
          <LiveBadge live={live} />
        </div>
        {children}
      </div>
    </Reveal>
  );
}

function Bar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-muted">
        <span>{label}</span>
        <span className="tabular-nums text-ink">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-ink/10">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${Math.max(2, (value / Math.max(total, 1)) * 100)}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease }}
        />
      </div>
    </div>
  );
}

function Activity({ calendar, fetchedAt }: { calendar: Record<string, number>; fetchedAt: string }) {
  const perDay = new Map<number, number>();
  for (const [ts, n] of Object.entries(calendar)) perDay.set(Math.floor(Number(ts) / 86400), n);
  if (perDay.size === 0) return null;
  const today = Math.floor(new Date(fetchedAt).getTime() / 86400000);
  const weeks = 26;
  const start = today - weeks * 7 + 1;
  const max = Math.max(...perDay.values(), 1);
  return (
    <Reveal className="mt-4 rounded-md border border-line bg-surface p-5 md:p-6">
      <p className="mb-3 text-sm text-muted">LeetCode activity · last 6 months</p>
      <div className="no-scrollbar overflow-x-auto">
        <div className="grid w-max grid-flow-col grid-rows-7 gap-1">
          {Array.from({ length: weeks * 7 }, (_, i) => {
            const n = perDay.get(start + i) ?? 0;
            return (
              <span
                key={i}
                title={`${n} submissions`}
                className="h-3 w-3 rounded-[2px]"
                style={{ background: n ? `rgba(var(--glow), ${0.25 + 0.75 * (n / max)})` : "color-mix(in srgb, var(--ink) 8%, transparent)" }}
              />
            );
          })}
        </div>
      </div>
    </Reveal>
  );
}

export function BoxOffice({ stats }: { stats: AllStats }) {
  const { leetcode: lc, codeforces: cf, github: gh } = stats;
  const langTotal = gh.languages.reduce((s, l) => s + l.count, 0) || 1;
  const langColors = ["var(--accent)", "var(--gold)", "var(--poster-teal)", "var(--poster-violet)", "var(--success)"];
  return (
    <section id="stats" className={section}>
      <div className={shell}>
        <SeriesHeading
          eyebrow="Ratings & reviews"
          title="Box Office"
          aside="Live numbers from LeetCode, Codeforces and GitHub, refreshed every hour."
        />
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard title="LeetCode" href={links.leetcode} live={lc.live}>
            <p className="font-display text-7xl leading-none text-ink">
              <Counter value={lc.solved} />
            </p>
            <p className="mb-5 mt-1 text-sm text-muted">problems solved</p>
            <div className="space-y-3">
              <Bar label="Easy" value={lc.easy} total={lc.totalEasy} color="var(--success)" />
              <Bar label="Medium" value={lc.medium} total={lc.totalMedium} color="var(--gold)" />
              <Bar label="Hard" value={lc.hard} total={lc.totalHard} color="var(--accent)" />
            </div>
            {(lc.streak > 0 || lc.contestRating) && (
              <p className="mt-5 flex gap-4 text-xs text-muted">
                {lc.streak > 0 && <span>{lc.streak}-day streak</span>}
                {lc.activeDays > 0 && <span>{lc.activeDays} active days</span>}
                {lc.contestRating && <span>Contest {lc.contestRating}</span>}
              </p>
            )}
          </StatCard>
          <StatCard title="Codeforces" href={links.codeforces} live={cf.live}>
            <p className="font-display text-7xl leading-none text-ink">{cf.rating ? <Counter value={cf.rating} /> : "Unrated"}</p>
            <p className="mb-5 mt-1 text-sm capitalize text-muted">{cf.rank ?? "rating"}</p>
            <dl className="grid grid-cols-3 gap-3 text-center">
              {[
                ["Max", cf.maxRating ?? "—"],
                ["Contests", cf.contests],
                ["Solved", cf.solved],
              ].map(([k, v]) => (
                <div key={k} className="rounded bg-ink/5 py-3">
                  <dd className="font-display text-3xl leading-none text-ink">{v}</dd>
                  <dt className="mt-1 text-[11px] uppercase tracking-wider text-muted">{k}</dt>
                </div>
              ))}
            </dl>
            {cf.history.length > 1 && <Sparkline points={cf.history.map((h) => h.rating)} />}
          </StatCard>
          <StatCard title="GitHub" href={links.github} live={gh.live}>
            <p className="font-display text-7xl leading-none text-ink">
              <Counter value={gh.publicRepos} />
            </p>
            <p className="mb-5 mt-1 text-sm text-muted">public repositories</p>
            <div className="flex h-2 overflow-hidden rounded-full">
              {gh.languages.slice(0, 5).map((l, i) => (
                <span key={l.name} style={{ width: `${(l.count / langTotal) * 100}%`, background: langColors[i] }} />
              ))}
            </div>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
              {gh.languages.slice(0, 5).map((l, i) => (
                <li key={l.name} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: langColors[i] }} />
                  {l.name}
                </li>
              ))}
            </ul>
            <p className="mt-5 flex gap-4 text-xs text-muted">
              <span>{gh.stars} stars</span>
              <span>{gh.followers} followers</span>
            </p>
          </StatCard>
        </div>
        <Activity calendar={lc.calendar} fetchedAt={stats.fetchedAt} />
      </div>
    </section>
  );
}

function Sparkline({ points }: { points: number[] }) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const d = points
    .map((p, i) => `${(i / (points.length - 1)) * 100},${30 - ((p - min) / Math.max(max - min, 1)) * 28}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 32" className="mt-5 h-12 w-full" preserveAspectRatio="none" aria-label="Codeforces rating history">
      <polyline points={d} fill="none" stroke="var(--accent)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/* ---------------------------------------------------------------- Top Moments */

function Laurel({ flip = false }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 24 48" className="h-12 w-6 shrink-0 text-gold" style={flip ? { transform: "scaleX(-1)" } : undefined} aria-hidden>
      <path d="M18 46 C6 38 4 22 12 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      {[8, 15, 22, 29, 36].map((y, i) => (
        <ellipse key={y} cx={i < 2 ? 9 : 7 + i * 0.4} cy={y} rx="4.2" ry="1.8" fill="currentColor" transform={`rotate(-35 ${7 + i * 0.4} ${y})`} />
      ))}
    </svg>
  );
}

export function Moments({ stats }: { stats: AllStats }) {
  const lc = stats.leetcode;
  const cards = [
    moments[0],
    {
      category: "Problem solving",
      title: `${lc.solved} Problems Solved`,
      sub: lc.live ? "LeetCode · live" : "LeetCode",
      text: `${lc.easy} easy, ${lc.medium} medium and ${lc.hard} hard, with the count updated hourly.`,
      url: links.leetcode,
    },
    ...moments.slice(1),
  ];
  return (
    <section id="moments" className={section}>
      <div className={shell}>
        <SeriesHeading eyebrow="Award season" title="Top Moments" />
        <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-3 md:px-0 xl:grid-cols-6">
          {cards.map((m, i) => (
            <motion.article
              key={m.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.07, ease }}
              whileHover={{ y: -6 }}
              className="flex w-[78vw] max-w-[300px] shrink-0 snap-start flex-col items-center rounded-lg border border-gold/40 p-5 text-center md:w-auto md:max-w-none"
              style={{ background: "linear-gradient(180deg, color-mix(in srgb, var(--gold) 14%, var(--surface)), var(--surface) 70%)" }}
            >
              <div className="flex items-center gap-1">
                <Laurel />
                <span className="max-w-[9rem] text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">{m.category}</span>
                <Laurel flip />
              </div>
              <h3 className="title-card mt-4 text-3xl uppercase text-ink">{m.title}</h3>
              <p className="mt-1 font-display text-sm tracking-[0.2em] text-gold">{m.sub}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{m.text}</p>
              {"url" in m && m.url && (
                <a href={m.url} target="_blank" rel="noreferrer" className="mt-auto pt-4 text-xs font-semibold text-ink underline-offset-4 hover:underline">
                  View <ArrowUpRight className="inline h-3 w-3" />
                </a>
              )}
            </motion.article>
          ))}
        </div>

        <Reveal className="mt-12">
          <h3 className="mb-3 text-xl font-semibold text-ink md:text-2xl">
            Certified <span className="text-muted">· {certifications.length} credentials</span>
          </h3>
          <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:px-0 xl:grid-cols-6">
            {certifications.map((c) => (
              <a
                key={c.name}
                href={c.url}
                target="_blank"
                rel="noreferrer"
                className="group flex min-h-32 w-[62vw] max-w-[240px] shrink-0 snap-start flex-col justify-between rounded-md border border-line bg-surface p-4 transition hover:-translate-y-1 hover:border-accent md:w-auto md:max-w-none"
              >
                <span className="flex items-center justify-between font-display text-sm tracking-[0.2em] text-accent">
                  {c.issuer}
                  <ArrowUpRight className="h-4 w-4 text-muted transition group-hover:text-ink" />
                </span>
                <span className="text-sm font-medium leading-snug text-ink">{c.name}</span>
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Skill Universe */

export function SkillUniverse() {
  const [active, setActive] = useState(0);
  const g = skillGenres[active];
  return (
    <section id="skills" className={section}>
      <div className={shell}>
        <SeriesHeading eyebrow="Genres" title="My Skill Universe" aside="Pick a genre to see every title in it." />
        <div className="grid gap-6 md:grid-cols-[300px_1fr] md:gap-10">
          <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-col md:gap-1 md:overflow-visible md:px-0" role="tablist">
            {skillGenres.map((s, i) => (
              <li key={s.genre} className="shrink-0">
                <button
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className="relative w-full rounded px-4 py-2 text-left md:py-3"
                >
                  {i === active && (
                    <motion.span layoutId="genre" className="absolute inset-0 rounded border-l-4 border-accent bg-surface2" transition={{ type: "spring", stiffness: 400, damping: 34 }} />
                  )}
                  <span className={`relative block font-display text-2xl leading-none transition md:text-3xl ${i === active ? "text-ink" : "text-muted"}`}>
                    {s.genre}
                  </span>
                  <span className="relative mt-1 hidden text-xs text-muted md:block">
                    {s.items.length} skills · {s.note}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div className="min-h-[260px]">
            <p className="mb-4 text-sm text-muted">
              <span className="font-semibold text-ink">{g.genre}</span> · {g.note}
            </p>
            <AnimatePresence mode="wait">
              <motion.ul
                key={g.genre}
                className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
                initial="hidden"
                animate="show"
                exit="hidden"
                variants={{ show: { transition: { staggerChildren: 0.04 } }, hidden: {} }}
              >
                {g.items.map((item) => (
                  <motion.li
                    key={item}
                    variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
                    transition={{ duration: 0.35, ease }}
                    className="group flex items-center gap-3 rounded-md border border-line bg-surface p-3 transition hover:-translate-y-0.5 hover:border-accent/60 md:p-4"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded bg-accent/15 font-display text-xl text-accent transition group-hover:bg-accent group-hover:text-white">
                      {item[0]}
                    </span>
                    <span className="text-sm font-medium text-ink">{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Originals (projects) */

export function Originals({ repos }: { repos: Repo[] }) {
  return (
    <section id="originals" className={section}>
      <div className={shell}>
        <SeriesHeading
          eyebrow="Y Series presents"
          title="Originals"
          aside="Two productions so far: a finance insight engine with RAG, and a payment flow on Android. Every one ships from GitHub."
        />
        <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:px-0">
          {projects.map((p, i) => {
            const meta = originalsMeta[p.name];
            const Icon = meta?.icon === "card" ? CreditCard : BarChart3;
            return (
              <motion.article
                key={p.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, delay: i * 0.12, ease }}
                className="group relative flex min-h-[520px] w-[86vw] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-lg p-5 text-poster-ink shadow-2xl shadow-black/30 md:w-auto md:p-8"
                style={poster(meta?.poster ?? "var(--poster-red)")}
              >
                <Icon
                  className="absolute -right-8 top-6 h-72 w-72 text-poster-ink/15 transition duration-700 group-hover:scale-110 group-hover:text-poster-ink/25 md:h-96 md:w-96"
                  strokeWidth={0.6}
                  aria-hidden
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, color-mix(in srgb, var(--poster-shade) 85%, transparent), transparent 65%)" }}
                  aria-hidden
                />
                <div className="absolute left-5 right-5 top-5 flex items-center justify-between md:left-8 md:right-8 md:top-8">
                  <span className="flex items-baseline gap-1 font-display text-sm tracking-[0.3em]">
                    <span className="text-lg text-poster-ink">Y</span> ORIGINAL
                  </span>
                  <span className="rounded-sm bg-poster-ink px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-poster-shade">
                    {p.metric.value} {p.metric.label}
                  </span>
                </div>
                <div className="relative">
                  <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-poster-ink/75">
                    {meta?.codename} · {p.period}
                  </p>
                  <h3 className="title-card mt-2 text-6xl uppercase md:text-7xl">{p.name}</h3>
                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-poster-ink/85 md:text-base">{p.summary}</p>
                  <ul className="mt-4 space-y-1.5 text-sm text-poster-ink/80">
                    {p.highlights.map((h) => (
                      <li key={h} className="flex gap-2">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-poster-ink" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs uppercase tracking-[0.2em] text-poster-ink/70">{p.tech.join(" · ")}</p>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-2 rounded bg-poster-ink px-5 py-2.5 text-sm font-semibold text-poster-shade transition hover:opacity-85"
                  >
                    <Play className="h-4 w-4 fill-current" /> View Project
                  </a>
                </div>
              </motion.article>
            );
          })}
        </div>

        {repos.length > 0 && (
          <Reveal className="mt-12">
            <h3 className="mb-3 text-xl font-semibold text-ink md:text-2xl">
              More from the studio <span className="text-muted">· on GitHub</span>
            </h3>
            <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:px-0">
              {repos.map((r) => (
                <a
                  key={r.name}
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex w-[72vw] max-w-[300px] shrink-0 snap-start flex-col rounded-md border border-line bg-surface p-4 transition hover:-translate-y-1 hover:border-accent md:w-auto md:max-w-none"
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate font-medium text-ink">{r.name}</span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted transition group-hover:text-ink" />
                  </span>
                  <span className="mt-1 line-clamp-2 text-sm text-muted">{r.description ?? "No description yet."}</span>
                  {r.language && <span className="mt-3 text-xs uppercase tracking-wider text-accent">{r.language}</span>}
                </a>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- The Pilot (about) */

export function Pilot() {
  const job = experience[0];
  const facts = [
    ["Now", "B.Tech CSE, final year", "VIT Vellore · CGPA 9.17"],
    ["Previously", `${job.role}`, `${job.company.replace(" (OPC) Pvt. Ltd.", "")} · ${job.period}`],
    ["Primary stack", "Java · Spring Boot", "Node.js, FastAPI, Python"],
    ["Based in", profile.location, profile.status],
  ];
  return (
    <section id="about" className={section}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, var(--accent), transparent)" }} />
      <div className={shell}>
        <SeriesHeading eyebrow="The pilot" title="About Me" />
        <div className="grid items-center gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-14">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg" style={poster("var(--poster-red)")}>
              {portrait ? (
                <Image src={portrait} alt={profile.name} fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover object-top" />
              ) : (
                <span
                  className="absolute inset-0 grid place-items-center font-display text-[16rem] leading-none text-poster-ink/20 md:text-[20rem]"
                  aria-hidden
                >
                  YS
                </span>
              )}
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, color-mix(in srgb, var(--poster-shade) 80%, transparent), transparent 55%)" }} />
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between text-poster-ink">
                <div>
                  <p className="font-display text-sm tracking-[0.3em] text-accent-soft">Starring</p>
                  <p className="font-display text-4xl leading-none">{profile.name}</p>
                </div>
                <span className="rounded-sm border border-poster-ink/60 px-2 py-0.5 font-mono text-[11px]">S01 · E01</span>
              </div>
            </div>
          </Reveal>
          <div>
            <Reveal>
              <blockquote className="font-serif text-3xl leading-snug text-ink md:text-[2.6rem] md:leading-[1.2]">
                &ldquo;{series.quote}&rdquo;
              </blockquote>
              <p className="mt-4 text-sm text-muted">— {profile.name}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <dl className="mt-8 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2">
                {facts.map(([k, v, sub]) => (
                  <div key={k} className="bg-surface p-4">
                    <dt className="text-[11px] uppercase tracking-[0.2em] text-muted">{k}</dt>
                    <dd className="mt-1 font-semibold text-ink">{v}</dd>
                    <dd className="text-sm text-muted">{sub}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-muted">Off-screen</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {skillGenres[skillGenres.length - 1].items.map((i) => (
                  <li key={i} className="rounded-full border border-line bg-surface px-3 py-1 text-sm text-ink">
                    {i}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- My Journey */

export function Journey() {
  const [active, setActive] = useState(seasons.length - 2);
  const s = seasons[active];
  return (
    <section id="journey" className={section}>
      <div className={shell}>
        <SeriesHeading eyebrow={`${seasons.length} seasons`} title="My Journey" aside="Every stage of the story so far, season by season." />
        <div className="no-scrollbar -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0" role="tablist">
          {seasons.map((x, i) => (
            <button
              key={x.code}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={`relative shrink-0 rounded-full px-4 py-2 text-left transition ${i === active ? "text-bg" : "text-muted hover:text-ink"}`}
            >
              {i === active && <motion.span layoutId="season" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
              <span className="relative block font-mono text-[10px] uppercase tracking-[0.2em] opacity-75">Season {x.code.slice(1)}</span>
              <span className="relative block text-sm font-semibold">{x.title}</span>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={s.code} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.45, ease }}>
            <div className="mb-6 flex flex-wrap items-end gap-x-4 gap-y-1">
              <span className="outline-num text-6xl leading-none md:text-7xl">{s.code}</span>
              <h3 className="title-card text-4xl uppercase text-ink md:text-5xl">{s.title}</h3>
              <span className="pb-1 text-sm text-muted">
                {s.span} · {s.episodes.length} episode{s.episodes.length > 1 ? "s" : ""}
              </span>
            </div>
            <p className="mb-6 max-w-2xl text-muted">{s.logline}</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {s.episodes.map((e, i) => (
                <motion.article
                  key={e.code}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.08 * i, ease }}
                  whileHover={{ y: -6 }}
                  className="overflow-hidden rounded-md border border-line bg-surface transition-colors hover:border-accent"
                >
                  <div className="relative h-32 overflow-hidden p-4 text-poster-ink" style={poster(e.poster)}>
                    <span className="absolute -bottom-6 right-1 font-display text-[6.5rem] leading-none text-poster-ink/15" aria-hidden>
                      {e.code}
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.2em] text-poster-ink/75">
                      {s.code} · {e.code}
                    </span>
                    <h4 className="title-card absolute bottom-3 left-4 text-3xl uppercase">{e.title}</h4>
                  </div>
                  <div className="p-4">
                    <p className="font-mono text-[11px] uppercase tracking-wider text-accent">{e.when}</p>
                    <p className="mt-2 text-sm leading-relaxed text-ink/85">{e.text}</p>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {e.tags.map((t) => (
                        <li key={t} className="rounded-sm bg-ink/5 px-2 py-0.5 text-[11px] text-muted">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Top Picks */

export function TopPicks() {
  return (
    <section id="picks" className={section}>
      <div className={shell}>
        <SeriesHeading eyebrow="Top 5 · this season" title="Yash's Top Picks" />
        <ol className="no-scrollbar -mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-5 md:gap-0 md:px-0">
          {topPicks.map((p, i) => (
            <motion.li
              key={p.title}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease }}
              className="flex shrink-0 snap-start items-end"
            >
              <span className="outline-num -mr-3 text-[10rem] leading-[0.75] md:-mr-4 md:text-[12rem]" aria-hidden>
                {i + 1}
              </span>
              <a
                href={p.href}
                className="group relative z-10 flex aspect-[2/3] w-32 flex-col justify-end overflow-hidden rounded-md p-3 text-poster-ink shadow-xl shadow-black/30 transition duration-300 hover:scale-105 md:w-[8.5rem] xl:w-40"
                style={poster(p.poster)}
              >
                <span className="absolute left-2 top-2 font-display text-lg text-poster-ink">Y</span>
                <span className="title-card text-2xl uppercase">{p.title}</span>
                <span className="mt-1 text-[11px] text-poster-ink/80">{p.note}</span>
              </a>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Finale (contact) */

export function Finale() {
  const { replayOpening } = useSeries();
  const buttons = [
    { label: "LinkedIn", href: links.linkedin, icon: Icons.linkedin },
    { label: "GitHub", href: links.github, icon: Icons.github },
    { label: "LeetCode", href: links.leetcode, icon: Icons.leetcode },
    { label: "Codeforces", href: links.codeforces, icon: Icons.codeforces },
  ];
  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden pb-16 pt-24 md:pt-36">
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(60% 55% at 50% 95%, rgba(var(--glow),0.32), transparent 70%)" }} aria-hidden />
      <div className={`${shell} relative text-center`}>
        <Reveal>
          <p className="font-display text-sm tracking-[0.4em] text-accent md:text-base">The next episode</p>
          <h2 className="title-card mt-3 text-[16vw] uppercase text-ink md:text-[9rem] lg:text-[11rem]">
            To be{" "}
            <span className="whitespace-nowrap">
              continued
              <span className="inline-flex">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{ opacity: [0.15, 1, 0.15] }}
                  transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.25 }}
                >
                  .
                </motion.span>
              ))}
              </span>
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 font-display text-2xl tracking-[0.25em] text-ink md:text-3xl">{profile.name}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.4em] text-muted">{profile.role}</p>
          <p className="mx-auto mt-4 max-w-md text-sm text-muted">{profile.status}. The fastest way to reach me is email.</p>
        </Reveal>
        <Reveal delay={0.2} className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={links.email}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:scale-105"
            style={{ boxShadow: "0 0 32px rgba(var(--glow),0.55)" }}
          >
            <Play className="h-4 w-4 fill-current" /> Let&apos;s build
          </a>
          {buttons.map(({ label, href, icon: I }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-5 py-3 text-sm font-semibold uppercase tracking-wider text-ink transition hover:border-ink hover:bg-ink/5"
            >
              <I className="h-4 w-4" /> {label}
            </a>
          ))}
        </Reveal>
        <Reveal delay={0.25}>
          <a href={links.email} className="mt-5 inline-block text-sm text-muted underline-offset-4 hover:text-ink hover:underline">
            {profile.email}
          </a>
        </Reveal>
        <div className="mt-8 flex justify-center gap-6 text-xs uppercase tracking-[0.25em] text-muted">
          <a href="#top" className="inline-flex items-center gap-1.5 hover:text-ink">
            <RotateCcw className="h-3.5 w-3.5" /> Watch again
          </a>
          <button type="button" onClick={replayOpening} className="inline-flex items-center gap-1.5 uppercase hover:text-ink">
            <Play className="h-3.5 w-3.5" /> Replay opening
          </button>
        </div>
        <footer className="mt-20 flex flex-col items-center gap-3 border-t border-line pt-8 text-xs text-muted">
          <Logo className="text-base" />
          <p>
            © {new Date().getFullYear()} {profile.name} · {profile.location}. A personal portfolio styled after a streaming app; not affiliated with any
            streaming service.
          </p>
        </footer>
      </div>
    </section>
  );
}
