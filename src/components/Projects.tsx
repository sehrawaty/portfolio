"use client";

import { ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/data";
import { Card, Icons, Reveal, SectionHeading } from "./ui";

export default function Projects() {
  return (
    <section id="work" className="border-t border-line">
      <div className="mx-auto max-w-[1120px] px-6 py-24 md:px-12 md:py-32">
        <SectionHeading label="Selected work" title="Things I've built." />
        <div className="grid gap-4 lg:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.06}>
              <Card className="group flex h-full flex-col p-6 transition-colors hover:border-line-strong md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs text-faint">{p.period}</p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-ink">{p.name}</h3>
                  </div>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${p.name} source on GitHub`}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-line-strong hover:text-ink"
                  >
                    <Icons.github className="h-4 w-4" />
                  </a>
                </div>
                <p className="mt-3 leading-relaxed text-muted">{p.summary}</p>

                <div className="mt-8 flex items-baseline gap-3 border-y border-line py-5">
                  <span className="text-4xl font-semibold tracking-[-0.03em] text-accent">{p.metric.value}</span>
                  <span className="text-sm text-muted">{p.metric.label}</span>
                </div>

                <ul className="mt-6 space-y-3 text-[0.95rem] leading-relaxed text-ink/85">
                  {p.highlights.map((h) => (
                    <li key={h} className="flex gap-3">
                      <span className="mt-[0.7em] h-px w-3 shrink-0 bg-faint" />
                      {h}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-8">
                  <ul className="flex flex-wrap gap-1.5">
                    {p.tech.map((t) => (
                      <li key={t} className="rounded-md bg-subtle px-2 py-1 font-mono text-xs text-muted">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <a href={p.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-accent">
                    Source <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
