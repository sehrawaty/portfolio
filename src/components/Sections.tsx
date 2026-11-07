"use client";

import { ArrowUpRight, BadgeCheck, ChevronRight, Crown, Heart, Mail, Shield, Target } from "lucide-react";
import { beyond, certifications, education, experience, links, profile, skills } from "@/lib/data";
import { Chip, Icons, Reveal, SectionHeader } from "./ui";

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-20 px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader kicker="Experience" title="Where I've worked." />
        {experience.map((e) => (
          <Reveal key={e.company} className="card grid gap-8 p-7 md:grid-cols-[1fr_1.6fr] md:gap-12 md:p-10">
            <div>
              <p className="t-caption text-muted">
                {e.period} · {e.mode}
              </p>
              <h3 className="t-title2 mt-2 text-ink">{e.role}</h3>
              <p className="t-callout mt-1 text-accent-ink">{e.company}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {e.stack.map((s) => (
                  <Chip key={s}>{s}</Chip>
                ))}
              </div>
            </div>
            <ul className="divide-y divide-line">
              {e.points.map((p) => (
                <li key={p} className="flex gap-3 py-4 text-ink first:pt-0 last:pb-0">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span className="text-muted">{p}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-20 px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader kicker="Toolkit" title="What I work with." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((g, i) => (
            <Reveal key={g.group} delay={i * 0.04} className={`card p-6 ${i === 0 ? "lg:row-span-2" : ""}`}>
              <h3 className="t-headline text-ink">{g.group}</h3>
              <ul className={`mt-4 ${i === 0 ? "grid grid-cols-2 gap-x-4 lg:grid-cols-1" : "flex flex-wrap gap-2"}`}>
                {g.items.map((s) =>
                  i === 0 ? (
                    <li key={s} className="t-title3 border-b border-line py-2.5 text-ink last:border-0 lg:text-[1.5rem]">
                      {s}
                    </li>
                  ) : (
                    <li key={s}>
                      <Chip size="md">{s}</Chip>
                    </li>
                  ),
                )}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Credentials() {
  const groups = Array.from(new Set(certifications.map((c) => c.group)));
  return (
    <section id="credentials" className="scroll-mt-20 px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader kicker="Credentials" title="Verified, not claimed." sub="Each one links to its public verification page." />
        <div className="grid gap-8 lg:grid-cols-2">
          {groups.map((g) => (
            <Reveal key={g}>
              <h3 className="t-caption mb-2 px-5 font-medium text-muted">{g}</h3>
              <ul className="overflow-hidden rounded-[1.5rem] border border-line bg-surface">
                {certifications
                  .filter((c) => c.group === g)
                  .map((c) => (
                    <li key={c.name} className="border-b border-line last:border-0">
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface2 active:bg-surface3"
                      >
                        <span
                          className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl font-mono text-[0.6875rem] font-semibold ${
                            c.issuer === "Google Cloud" ? "bg-accent2/15 text-accent2" : "bg-accent/15 text-accent-ink"
                          }`}
                        >
                          {c.issuer === "Google Cloud" ? "GCP" : "OCI"}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="t-callout block font-medium text-ink">{c.name}</span>
                          <span className="t-caption flex items-center gap-1 text-muted">
                            <BadgeCheck className="h-3.5 w-3.5 text-success" /> {c.issuer}
                          </span>
                        </span>
                        <span className="t-caption flex shrink-0 items-center gap-0.5 text-faint group-hover:text-ink">
                          Verify <ChevronRight className="h-4 w-4" />
                        </span>
                      </a>
                    </li>
                  ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const beyondIcons = { crown: Crown, shield: Shield, target: Target, heart: Heart };

export function About() {
  return (
    <section id="about" className="scroll-mt-20 px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader kicker="Background" title="Education & beyond code." />
        <Reveal>
          <ul className="overflow-hidden rounded-[1.75rem] border border-line bg-surface">
            {education.map((e) => (
              <li key={e.school} className="grid gap-2 border-b border-line px-6 py-6 last:border-0 md:grid-cols-[10rem_1fr_auto] md:items-center md:gap-8 md:px-8">
                <span className="t-caption text-muted">{e.period}</span>
                <span>
                  <span className="t-title3 block text-ink">{e.school}</span>
                  <span className="t-callout text-muted">
                    {e.detail} · {e.place}
                  </span>
                </span>
                <span className="flex items-baseline gap-2 md:justify-end">
                  <span className="t-number text-[2.25rem] text-ink">{e.score}</span>
                  <span className="t-caption text-muted">{e.scoreLabel}</span>
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {beyond.map((b, i) => {
            const I = beyondIcons[b.icon];
            return (
              <Reveal key={b.title} delay={i * 0.04} className="card p-6">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-success/12 text-success">
                  <I className="h-5 w-5" />
                </span>
                <h3 className="t-headline mt-5 text-ink">{b.title}</h3>
                <p className="t-callout mt-1.5 text-muted">{b.text}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const channels = [
    { label: "Email", value: profile.email, href: links.email, icon: <Mail className="h-5 w-5" /> },
    { label: "LinkedIn", value: "in/sehrawatyash", href: links.linkedin, icon: <Icons.linkedin className="h-5 w-5" /> },
    { label: "GitHub", value: "@sehrawaty", href: links.github, icon: <Icons.github className="h-5 w-5" /> },
    { label: "LeetCode", value: "YashSehrawat01", href: links.leetcode, icon: <Icons.leetcode className="h-5 w-5" /> },
    { label: "Codeforces", value: "YashSehrawat01", href: links.codeforces, icon: <Icons.codeforces className="h-5 w-5" /> },
  ];
  return (
    <section id="contact" className="scroll-mt-20 px-5 pb-12 pt-20 md:px-8 md:pt-28">
      <div className="mx-auto max-w-6xl">
        {/* Radial tints instead of a blur filter. */}
        <Reveal className="relative overflow-hidden rounded-[2.25rem] border border-line p-8 md:p-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(70% 90% at 0% 0%, color-mix(in srgb, var(--accent) 20%, transparent) 0%, transparent 60%), radial-gradient(60% 80% at 100% 100%, color-mix(in srgb, var(--accent-2) 14%, transparent) 0%, transparent 60%), var(--surface)",
            }}
          />
          <div className="relative">
            <p className="t-headline text-accent-ink">Contact</p>
            <h2 className="t-title1 mt-2 max-w-3xl text-ink">Let&apos;s build something that scales.</h2>
            <p className="t-lead mt-5 max-w-xl text-muted">Open to backend and applied-AI roles. The fastest way to reach me is email.</p>
            <a
              href={links.email}
              className="pressable mt-9 inline-flex items-center gap-2.5 rounded-full bg-accent-fill px-7 py-3.5 text-[1.0625rem] font-medium text-on-accent hover:brightness-110"
            >
              <Mail className="h-5 w-5" /> Say hello
            </a>
            <ul className="mt-12 grid gap-px overflow-hidden rounded-[1.25rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {channels.map((c, i) => (
                <li key={c.label} className={`bg-surface ${i === 0 ? "sm:col-span-2 lg:col-span-4" : ""}`}>
                  <a
                    href={c.href}
                    target={c.href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noreferrer"
                    className="group flex h-full items-center gap-3 p-4 transition-colors hover:bg-surface2 active:bg-surface3"
                  >
                    <span className="text-muted group-hover:text-ink">{c.icon}</span>
                    <span className="min-w-0 flex-1">
                      <span className="t-caption block text-muted">{c.label}</span>
                      <span className="t-callout block truncate text-ink">{c.value}</span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-faint" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <footer className="t-caption mt-10 flex flex-col items-center justify-between gap-2 text-faint md:flex-row">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <span>Built with Next.js and Framer Motion · Deployed on Vercel</span>
        </footer>
      </div>
    </section>
  );
}
