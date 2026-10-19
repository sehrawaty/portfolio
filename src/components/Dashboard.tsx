"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { AllStats } from "@/lib/stats";
import { certifications, links } from "@/lib/data";
import { Card, Counter, Icons, Reveal, SectionHeading } from "./ui";

function Status({ live }: { live: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-faint">
      <span className={`h-1.5 w-1.5 rounded-full ${live ? "bg-easy" : "bg-faint"}`} />
      {live ? "Live" : "Cached"}
    </span>
  );
}

function Head({ icon, title, href, live }: { icon?: React.ReactNode; title: string; href?: string; live?: boolean }) {
  return (
    <div className="mb-6 flex items-center justify-between gap-3">
      <h3 className="flex items-center gap-2 text-sm font-medium text-ink">
        {icon}
        {title}
      </h3>
      <div className="flex items-center gap-3">
        {live !== undefined && <Status live={live} />}
        {href && (
          <a href={href} target="_blank" rel="noreferrer" aria-label={`Open ${title}`} className="text-faint transition-colors hover:text-ink">
            <ArrowUpRight className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, decimals, tone }: { label: string; value: number; decimals?: number; tone?: string }) {
  return (
    <div>
      <div className={`text-2xl font-semibold tracking-tight ${tone ?? "text-ink"}`}>
        <Counter value={value} decimals={decimals} />
      </div>
      <div className="mt-0.5 text-xs text-muted">{label}</div>
    </div>
  );
}

function Heatmap({ calendar }: { calendar: Record<string, number> }) {
  const weeks = 26;
  const byDay = new Map<number, number>();
  for (const [ts, n] of Object.entries(calendar)) {
    const d = Math.floor(Number(ts) / 86400);
    byDay.set(d, (byDay.get(d) ?? 0) + n);
  }
  const now = new Date();
  const todayIdx = Math.floor(now.getTime() / 86400000);
  const start = todayIdx - (weeks - 1) * 7 - now.getUTCDay();
  const cells = Array.from({ length: weeks * 7 }, (_, i) => (start + i <= todayIdx ? byDay.get(start + i) ?? 0 : -1));
  const max = Math.max(1, ...cells);
  return (
    <div className="grid grid-flow-col grid-rows-7 gap-[3px]">
      {cells.map((n, i) => (
        <span
          key={i}
          title={n >= 0 ? `${n} submissions` : undefined}
          className="aspect-square w-full min-w-[8px] rounded-[2px]"
          style={{
            background: n <= 0 ? "var(--subtle)" : "var(--accent)",
            opacity: n <= 0 ? (n < 0 ? 0 : 1) : 0.3 + (n / max) * 0.7,
          }}
        />
      ))}
    </div>
  );
}

export default function Dashboard({ stats }: { stats: AllStats }) {
  const { leetcode: lc, codeforces: cf, github: gh } = stats;
  const solvedSum = Math.max(1, lc.easy + lc.medium + lc.hard);
  const totalLang = gh.languages.reduce((s, l) => s + l.count, 0) || 1;
  const synced = new Date(stats.fetchedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });
  const hasCalendar = Object.keys(lc.calendar).length > 0;

  return (
    <section id="stats" className="border-t border-line">
      <div className="mx-auto max-w-[1120px] px-6 py-24 md:px-12 md:py-32">
        <SectionHeading
          label="Live stats"
          title="Practice, in numbers."
          sub="Pulled from LeetCode, Codeforces and GitHub on the server and refreshed every hour."
        />

        <div className="grid gap-4 md:grid-cols-3 [&>*]:min-w-0">
          {/* LeetCode */}
          <Reveal className="md:col-span-2">
            <Card className="h-full p-6 md:p-8">
              <Head icon={<Icons.leetcode className="h-4 w-4" />} title="LeetCode" href={links.leetcode} live={lc.live} />
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <div className="text-6xl font-semibold tracking-[-0.04em] text-ink">
                    <Counter value={lc.solved} />
                  </div>
                  <div className="mt-1 text-sm text-muted">problems solved</div>
                </div>
                <div className="grid grid-cols-3 gap-8">
                  <Stat label="Easy" value={lc.easy} tone="text-easy" />
                  <Stat label="Medium" value={lc.medium} tone="text-medium" />
                  <Stat label="Hard" value={lc.hard} tone="text-hard" />
                </div>
              </div>
              <div className="mt-6 flex h-2 overflow-hidden rounded-full bg-subtle">
                {(
                  [
                    [lc.easy, "var(--easy)"],
                    [lc.medium, "var(--medium)"],
                    [lc.hard, "var(--hard)"],
                  ] as const
                ).map(([v, c], i) => (
                  <motion.span
                    key={i}
                    style={{ background: c }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(v / solvedSum) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.1 + i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                  />
                ))}
              </div>
              <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted">
                {lc.ranking && (
                  <div>
                    <dt className="inline">Global rank </dt>
                    <dd className="inline font-medium text-ink">#{lc.ranking.toLocaleString("en-IN")}</dd>
                  </div>
                )}
                {lc.streak > 0 && (
                  <div>
                    <dt className="inline">Current streak </dt>
                    <dd className="inline font-medium text-ink">{lc.streak} days</dd>
                  </div>
                )}
                {lc.contestRating && (
                  <div>
                    <dt className="inline">Contest rating </dt>
                    <dd className="inline font-medium text-ink">{lc.contestRating}</dd>
                  </div>
                )}
              </dl>
            </Card>
          </Reveal>

          {/* Codeforces */}
          <Reveal delay={0.05}>
            <Card className="flex h-full flex-col p-6 md:p-8">
              <Head icon={<Icons.codeforces className="h-4 w-4" />} title="Codeforces" href={links.codeforces} live={cf.live} />
              {cf.rating ? (
                <div>
                  <div className="text-6xl font-semibold tracking-[-0.04em] text-ink">
                    <Counter value={cf.rating} />
                  </div>
                  <div className="mt-1 text-sm capitalize text-muted">
                    {cf.rank} · max {cf.maxRating}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-2xl font-semibold tracking-tight text-ink">Unrated</div>
                  <p className="mt-2 text-sm leading-relaxed text-muted">A rating appears here after the first rated contest.</p>
                </div>
              )}
              <div className="mt-auto pt-8">
                <div className="grid grid-cols-2 gap-6 border-t border-line pt-6">
                <Stat label="Problems solved" value={cf.solved} />
                <Stat label="Rated contests" value={cf.contests} />
                </div>
              </div>
            </Card>
          </Reveal>

          {/* Activity */}
          <Reveal className="md:col-span-2">
            <Card className="h-full p-6 md:p-8">
              <Head title="Submission activity · last 26 weeks" live={lc.live} />
              {hasCalendar ? (
                <Heatmap calendar={lc.calendar} />
              ) : (
                <p className="rounded-lg border border-dashed border-line-strong px-4 py-10 text-center text-sm text-muted">
                  The activity grid fills in once LeetCode responds.
                </p>
              )}
              {lc.activeDays > 0 && <p className="mt-4 text-sm text-muted">{lc.activeDays} active days in the past year.</p>}
            </Card>
          </Reveal>

          {/* Academics */}
          <Reveal delay={0.05}>
            <Card className="flex h-full flex-col p-6 md:p-8">
              <Head title="VIT Vellore" />
              <div className="text-6xl font-semibold tracking-[-0.04em] text-ink">
                <Counter value={9.17} decimals={2} />
              </div>
              <div className="mt-1 text-sm text-muted">CGPA · B.Tech CSE · 2027</div>
              <div className="mt-auto pt-8">
                <div className="border-t border-line pt-6">
                  <Stat label="Verified certifications" value={certifications.length} />
                </div>
              </div>
            </Card>
          </Reveal>

          {/* GitHub */}
          <Reveal className="md:col-span-3">
            <Card className="p-6 md:p-8">
              <Head icon={<Icons.github className="h-4 w-4" />} title="GitHub · sehrawaty" href={links.github} live={gh.live} />
              <div className="grid gap-8 md:grid-cols-[220px_1fr] [&>*]:min-w-0">
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4 md:grid-cols-1">
                    <Stat label="Public repos" value={gh.publicRepos} />
                    <Stat label="Stars" value={gh.stars} />
                    <Stat label="Followers" value={gh.followers} />
                  </div>
                  <div>
                    <div className="mb-2 flex h-1.5 overflow-hidden rounded-full bg-subtle">
                      {gh.languages.map((l, i) => (
                        <span key={l.name} style={{ width: `${(l.count / totalLang) * 100}%`, background: "var(--ink)", opacity: 0.85 - i * 0.18 }} />
                      ))}
                    </div>
                    <ul className="space-y-1 text-xs text-muted">
                      {gh.languages.slice(0, 4).map((l) => (
                        <li key={l.name} className="flex justify-between">
                          <span>{l.name}</span>
                          <span className="tabular-nums">{Math.round((l.count / totalLang) * 100)}%</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <ul className="divide-y divide-line border-y border-line md:border-t-0">
                  {gh.repos.map((r) => (
                    <li key={r.name}>
                      <a href={r.url} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-4 py-3">
                        <span className="min-w-0">
                          <span className="block truncate font-mono text-sm text-ink group-hover:text-accent">{r.name}</span>
                          <span className="block truncate text-sm text-muted">{r.description ?? "No description"}</span>
                        </span>
                        <span className="flex shrink-0 items-center gap-3 text-xs text-faint">
                          {r.language}
                          <ArrowUpRight className="h-3.5 w-3.5 transition-colors group-hover:text-accent" />
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </Reveal>
        </div>

        <p className="mt-5 font-mono text-xs text-faint">Last synced {synced} IST</p>
      </div>
    </section>
  );
}
