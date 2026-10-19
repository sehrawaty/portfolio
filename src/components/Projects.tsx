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
              <TiltCard className="h-full overflow-hidden p-8 md:p-10" glow={`${p.accent}40`} intensity={7}>
                <div
                  className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-40 blur-3xl transition-opacity duration-700 group-hover:opacity-70"
                  style={{ background: p.accent }}
                />
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-white/40">{p.period}</p>
                    <h3 className="mt-2 text-4xl font-semibold tracking-tight text-white">{p.name}</h3>
                  </div>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white hover:text-black"
                    aria-label={`${p.name} on GitHub`}
                  >
                    <Icons.github className="h-5 w-5" />
                  </a>
                </div>
                <p className="relative mt-4 text-lg leading-relaxed text-white/60">{p.summary}</p>

                <div className="relative my-8 flex items-baseline gap-3">
                  <span className="text-6xl font-semibold tracking-tight" style={{ color: p.accent }}>
                    {p.metric.value}
                  </span>
                  <span className="text-white/50">{p.metric.label}</span>
                </div>

                <ul className="relative space-y-3">
                  {p.highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-white/70">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: p.accent }} />
                      {h}
                    </li>
                  ))}
                </ul>

                <div className="relative mt-8 flex flex-wrap gap-2">
                  {p.tech.map((t) => (
                    <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-white/70">
                      {t}
                    </span>
                  ))}
                </div>
                <a href={p.url} target="_blank" rel="noreferrer" className="relative mt-8 inline-flex items-center gap-1 text-sm text-white/60 hover:text-white">
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
