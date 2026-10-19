"use client";

import { ArrowUpRight, Copy, Check } from "lucide-react";
import { useState } from "react";
import { beyond, certifications, education, experience, links, profile, skills } from "@/lib/data";
import { Icons, Reveal, SectionHeading } from "./ui";

function Shell({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="border-t border-line">
      <div className="mx-auto max-w-[1120px] px-6 py-24 md:px-12 md:py-32">{children}</div>
    </section>
  );
}

export function Experience() {
  return (
    <Shell id="experience">
      <SectionHeading label="Experience" title="Where I've worked." />
      {experience.map((e) => (
        <Reveal key={e.company}>
          <article className="grid gap-6 border-t border-line pt-8 md:grid-cols-[240px_1fr] md:gap-12">
            <div>
              <p className="font-mono text-xs text-faint">{e.period}</p>
              <p className="mt-1 text-sm text-muted">{e.mode}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold tracking-[-0.015em] text-ink">{e.role}</h3>
              <p className="mt-1 text-muted">{e.company}</p>
              <ul className="mt-6 space-y-3 leading-relaxed text-ink/85">
                {e.points.map((p) => (
                  <li key={p} className="flex gap-3">
                    <span className="mt-[0.75em] h-px w-3 shrink-0 bg-faint" />
                    {p}
                  </li>
                ))}
              </ul>
              <ul className="mt-6 flex flex-wrap gap-1.5">
                {e.stack.map((s) => (
                  <li key={s} className="rounded-md bg-subtle px-2 py-1 font-mono text-xs text-muted">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </Reveal>
      ))}
    </Shell>
  );
}

export function Skills() {
  return (
    <Shell id="skills">
      <SectionHeading label="Skills" title="What I work with." />
      <dl className="divide-y divide-line border-y border-line">
        {skills.map((g, i) => (
          <Reveal key={g.group} delay={i * 0.03}>
            <div className="grid gap-3 py-5 md:grid-cols-[240px_1fr] md:gap-12">
              <dt className="text-sm text-muted">{g.group}</dt>
              <dd className="flex flex-wrap gap-x-5 gap-y-1.5 text-ink">
                {g.items.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </dd>
            </div>
          </Reveal>
        ))}
      </dl>
    </Shell>
  );
}

export function Credentials() {
  return (
    <Shell id="credentials">
      <SectionHeading label="Credentials" title="Verified certifications." sub="Each one links to its public verification page." />
      <ul className="divide-y divide-line border-y border-line">
        {certifications.map((c, i) => (
          <Reveal key={c.name} delay={i * 0.03}>
            <li>
              <a href={c.url} target="_blank" rel="noreferrer" className="group grid items-center gap-1 py-5 md:grid-cols-[240px_1fr_auto] md:gap-12">
                <span className="text-sm text-muted">{c.issuer}</span>
                <span className="text-ink transition-colors group-hover:text-accent">{c.name}</span>
                <span className="inline-flex items-center gap-1 text-sm text-faint transition-colors group-hover:text-accent">
                  Verify <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </a>
            </li>
          </Reveal>
        ))}
      </ul>
    </Shell>
  );
}

export function Background() {
  return (
    <Shell id="background">
      <SectionHeading label="Background" title="Education and beyond code." />
      <ul className="divide-y divide-line border-y border-line">
        {education.map((e, i) => (
          <Reveal key={e.school} delay={i * 0.04}>
            <li className="grid gap-2 py-6 md:grid-cols-[240px_1fr_auto] md:items-baseline md:gap-12">
              <span className="font-mono text-xs text-faint">{e.period}</span>
              <span>
                <span className="block font-medium text-ink">{e.school}</span>
                <span className="block text-sm text-muted">
                  {e.detail} · {e.place}
                </span>
              </span>
              <span className="text-ink">
                <span className="text-xl font-semibold tracking-tight">{e.score}</span>
                <span className="ml-1.5 text-sm text-muted">{e.scoreLabel}</span>
              </span>
            </li>
          </Reveal>
        ))}
      </ul>
      <div className="mt-12 grid gap-x-12 gap-y-8 sm:grid-cols-2">
        {beyond.map((b, i) => (
          <Reveal key={b.title} delay={i * 0.04}>
            <h3 className="font-medium text-ink">{b.title}</h3>
            <p className="mt-1.5 leading-relaxed text-muted">{b.text}</p>
          </Reveal>
        ))}
      </div>
    </Shell>
  );
}

export function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };
  const channels = [
    { label: "LinkedIn", value: "in/sehrawatyash", href: links.linkedin, icon: Icons.linkedin },
    { label: "GitHub", value: "sehrawaty", href: links.github, icon: Icons.github },
    { label: "LeetCode", value: "YashSehrawat01", href: links.leetcode, icon: Icons.leetcode },
    { label: "Codeforces", value: "YashSehrawat01", href: links.codeforces, icon: Icons.codeforces },
  ];
  return (
    <section id="contact" className="border-t border-line">
      <div className="mx-auto max-w-[1120px] px-6 pb-12 pt-24 md:px-12 md:pt-32">
        <Reveal>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.12em] text-muted">Contact</p>
          <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.035em] text-ink md:text-6xl md:leading-[1.05]">
            Open to backend and applied-AI roles.
          </h2>
          <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-muted">The fastest way to reach me is email.</p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a href={links.email} className="text-xl font-medium text-ink underline decoration-line-strong decoration-1 underline-offset-[6px] transition-colors hover:decoration-accent md:text-2xl">
              {profile.email}
            </a>
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 text-xs text-muted transition-colors hover:border-line-strong hover:text-ink"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <ul className="mt-16 grid divide-y divide-line border-y border-line sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
            {channels.map((c) => (
              <li key={c.label} className="sm:border-l sm:border-line sm:first:border-l-0 sm:first:[&>a]:pl-0">
                <a href={c.href} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-3 py-5 sm:px-5">
                  <span className="flex items-center gap-3">
                    <c.icon className="h-4 w-4 text-muted" />
                    <span>
                      <span className="block text-xs text-muted">{c.label}</span>
                      <span className="block text-sm text-ink">{c.value}</span>
                    </span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-faint transition-colors group-hover:text-accent" />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
        <footer className="mt-20 flex flex-col justify-between gap-2 text-sm text-faint md:flex-row">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>Built with Next.js and React Three Fiber · Deployed on Vercel</span>
        </footer>
      </div>
    </section>
  );
}
