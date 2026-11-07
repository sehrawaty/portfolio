"use client";

import { ArrowUpRight, ChevronRight, Star } from "lucide-react";
import { useState } from "react";
import { projects, type Project } from "@/lib/data";
import type { Repo } from "@/lib/stats";
import Carousel from "./Carousel";
import Sheet from "./Sheet";
import { Chip, Icons, Reveal, SectionHeader } from "./ui";

function ProjectCard({ p, onOpen }: { p: Project; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className="card pressable group relative flex h-full w-full flex-col overflow-hidden p-7 text-left hover:border-line-strong md:p-9"
      style={{
        background: `radial-gradient(90% 60% at 100% 0%, color-mix(in srgb, ${p.accent} 14%, transparent) 0%, transparent 65%), var(--surface)`,
      }}
    >
      <p className="t-caption text-muted">{p.period}</p>
      <h3 className="t-title1 mt-2 text-ink">{p.name}</h3>
      <p className="t-lead mt-4 text-muted">{p.summary}</p>
      <div className="mt-10 flex items-baseline gap-3">
        <span className="t-number text-[clamp(3.5rem,8vw,5rem)]" style={{ color: p.accent }}>
          {p.metric.value}
        </span>
        <span className="t-callout text-muted">{p.metric.label}</span>
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        {p.tech.map((t) => (
          <Chip key={t}>{t}</Chip>
        ))}
      </div>
      <span className="t-callout mt-auto inline-flex items-center gap-1 pt-8 font-medium text-accent-ink">
        How it works <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </button>
  );
}

function RepoCard({ r }: { r: Repo }) {
  return (
    <a
      href={r.url}
      target="_blank"
      rel="noreferrer"
      draggable={false}
      className="card pressable flex h-44 w-[16.5rem] flex-col p-5 hover:border-line-strong md:w-[18rem]"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="truncate font-mono text-[0.9375rem] font-medium text-ink">{r.name}</span>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-faint" />
      </div>
      <p className="t-callout mt-2 line-clamp-3 text-muted">{r.description ?? "No description yet."}</p>
      <div className="t-caption mt-auto flex items-center gap-4 text-faint">
        {r.language && <span>{r.language}</span>}
        <span className="inline-flex items-center gap-1">
          <Star className="h-3.5 w-3.5" /> {r.stars}
        </span>
      </div>
    </a>
  );
}

export default function Projects({ repos }: { repos: Repo[] }) {
  const [open, setOpen] = useState<Project | null>(null);

  return (
    <section id="work" className="scroll-mt-20 px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader kicker="Selected work" title="Things I've built." sub="Pipelines, payments and retrieval: systems with numbers behind them." />

        <div className="grid gap-5 lg:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.06} className="h-full">
              <ProjectCard p={p} onOpen={() => setOpen(p)} />
            </Reveal>
          ))}
        </div>

        {repos.length > 0 && (
          <Reveal className="mt-16">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h3 className="t-title3 text-ink">More on GitHub</h3>
                <p className="t-callout mt-1 text-muted">Recently pushed repositories. Drag or flick through them.</p>
              </div>
            </div>
            <Carousel label="Recent GitHub repositories">
              {repos.map((r) => (
                <RepoCard key={r.name} r={r} />
              ))}
            </Carousel>
          </Reveal>
        )}
      </div>

      {open && (
        <Sheet key={open.name} title={open.name} subtitle={open.period} onClose={() => setOpen(null)}>
          <p className="t-lead text-muted">{open.summary}</p>
          <div className="mt-8 rounded-3xl bg-surface2 p-6">
            <span className="t-number text-[3.5rem]" style={{ color: open.accent }}>
              {open.metric.value}
            </span>
            <p className="t-callout mt-2 text-muted">{open.metric.label}</p>
          </div>
          <h4 className="t-headline mt-8 text-ink">Highlights</h4>
          <ul className="mt-3 divide-y divide-line">
            {open.highlights.map((h) => (
              <li key={h} className="t-callout flex gap-3 py-3.5 text-ink">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: open.accent }} />
                {h}
              </li>
            ))}
          </ul>
          <h4 className="t-headline mt-8 text-ink">Built with</h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {open.tech.map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </div>
          <a
            href={open.url}
            target="_blank"
            rel="noreferrer"
            className="pressable mt-10 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-medium text-bg"
          >
            <Icons.github className="h-[18px] w-[18px]" /> View source on GitHub
          </a>
        </Sheet>
      )}
    </section>
  );
}
