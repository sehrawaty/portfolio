"use client";

import { ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/data";
import { Icons, Reveal, SectionHeading, TiltCard } from "./ui";

export default function Projects() {
  return (
    <section id="work" className="relative px-6 py-32 md:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="02 / Selected work" title="Things I've built." sub="Pipelines, payments and retrieval: systems with numbers behind them." />
        <div className="grid gap-6 lg:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.12}>
              <TiltCard className="h-full overflow-hidden p-8 md:p-10" glow={`color-mix(in srgb, ${p.accent} 25%, transparent)`} intensity={7}>
                <div
                  className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-50 transition-opacity duration-700 group-hover:opacity-90"
                  style={{ background: `radial-gradient(circle, color-mix(in srgb, ${p.accent} 30%, transparent) 0%, transparent 65%)` }}
                />
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-ink/40">{p.period}</p>
                    <h3 className="mt-2 text-4xl font-semibold tracking-tight text-ink">{p.name}</h3>
                  </div>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-ink/15 bg-ink/5 text-ink transition hover:bg-ink hover:text-bg"
                    aria-label={`${p.name} on GitHub`}
                  >
                    <Icons.github className="h-5 w-5" />
                  </a>
                </div>
                <p className="relative mt-4 text-lg leading-relaxed text-ink/60">{p.summary}</p>

                <div className="relative my-8 flex items-baseline gap-3">
                  <span className="text-6xl font-semibold tracking-tight" style={{ color: p.accent }}>
                    {p.metric.value}
                  </span>
                  <span className="text-ink/50">{p.metric.label}</span>
                </div>

                <ul className="relative space-y-3">
                  {p.highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-ink/70">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: p.accent }} />
                      {h}
                    </li>
                  ))}
                </ul>

                <div className="relative mt-8 flex flex-wrap gap-2">
                  {p.tech.map((t) => (
                    <span key={t} className="rounded-full border border-ink/10 bg-ink/5 px-3 py-1 font-mono text-xs text-ink/70">
                      {t}
                    </span>
                  ))}
                </div>
                <a href={p.url} target="_blank" rel="noreferrer" className="relative mt-8 inline-flex items-center gap-1 text-sm text-ink/60 hover:text-ink">
                  View source <ArrowUpRight className="h-4 w-4" />
                </a>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
