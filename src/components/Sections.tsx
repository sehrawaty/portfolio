"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, BadgeCheck, Crown, Heart, Mail, Shield, Target } from "lucide-react";
import { useRef } from "react";
import { beyond, certifications, education, experience, links, profile, skills } from "@/lib/data";
import { Icons, Magnetic, Reveal, SectionHeading, TiltCard } from "./ui";

const SkillSphere = dynamic(() => import("./three/SkillSphere"), { ssr: false });

export function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="experience" className="relative px-6 py-32 md:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="04 / Experience" title="Where I've worked." />
        <div ref={ref} className="relative pl-10 md:pl-16">
          <div className="absolute left-3 top-0 h-full w-px bg-white/10 md:left-6" />
          <motion.div className="absolute left-3 top-0 w-px bg-gradient-to-b from-cyan-300 via-violet-400 to-pink-400 md:left-6" style={{ height }} />
          {experience.map((e) => (
            <Reveal key={e.company} className="relative">
              <span className="absolute -left-[34px] top-2 h-4 w-4 rounded-full border-2 border-cyan-300 bg-[#07071a] shadow-[0_0_20px_#22d3ee] md:-left-[46px]" />
              <TiltCard intensity={3} className="p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-semibold text-white">{e.role}</h3>
                    <p className="mt-1 text-lg text-cyan-200/80">{e.company}</p>
                  </div>
                  <p className="font-mono text-sm text-white/40">
                    {e.period} · {e.mode}
                  </p>
                </div>
                <ul className="mt-6 space-y-3">
                  {e.points.map((p) => (
                    <li key={p} className="flex gap-3 text-white/65">
                      <span className="mt-2.5 h-1 w-3 shrink-0 rounded-full bg-violet-400" />
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-2">
                  {e.stack.map((s) => (
                    <span key={s} className="rounded-full bg-violet-400/10 px-3 py-1 font-mono text-xs text-violet-200">
                      {s}
                    </span>
                  ))}
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Skills() {
  const words = skills.flatMap((s) => s.items);
  return (
    <section id="skills" className="relative px-6 py-32 md:px-12">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="05 / Toolkit" title="What I work with." sub="Drag the sphere. Hover a word." />
          <div className="space-y-6">
            {skills.map((g, i) => (
              <Reveal key={g.group} delay={i * 0.06}>
                <p className="mb-2 font-mono text-xs uppercase tracking-widest text-white/40">{g.group}</p>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((s) => (
                    <motion.span
                      key={s}
                      whileHover={{ y: -3, scale: 1.05 }}
                      className="cursor-default rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-sm text-white/80 backdrop-blur transition-colors hover:border-cyan-300/40 hover:text-white"
                    >
                      {s}
                    </motion.span>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal className="relative aspect-square w-full cursor-grab active:cursor-grabbing">
          <div className="absolute inset-[15%] rounded-full bg-violet-600/20 blur-[90px]" />
          <SkillSphere words={words} />
        </Reveal>
      </div>
    </section>
  );
}

export function Credentials() {
  return (
    <section id="credentials" className="relative px-6 py-32 md:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="06 / Credentials" title="Verified, not claimed." sub="Each badge links to its public verification page." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.06}>
              <a href={c.url} target="_blank" rel="noreferrer" className="block h-full">
                <TiltCard className="h-full p-6" glow={c.issuer === "Google Cloud" ? "rgba(96,165,250,0.3)" : "rgba(248,113,113,0.25)"}>
                  <div className="flex items-start justify-between">
                    <span
                      className={`rounded-lg px-2.5 py-1 font-mono text-[11px] font-semibold ${
                        c.issuer === "Google Cloud" ? "bg-blue-400/15 text-blue-200" : "bg-red-400/15 text-red-200"
                      }`}
                    >
                      {c.issuer}
                    </span>
                    <BadgeCheck className="h-5 w-5 text-emerald-300" />
                  </div>
                  <h3 className="mt-6 text-lg font-medium leading-snug text-white">{c.name}</h3>
                  <div className="mt-6 flex items-center justify-between text-sm text-white/40">
                    <span>{c.group}</span>
                    <span className="flex items-center gap-1 transition group-hover:text-white">
                      Verify <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </TiltCard>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const beyondIcons = { crown: Crown, shield: Shield, target: Target, heart: Heart };

export function Background() {
  return (
    <section id="background" className="relative px-6 py-32 md:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="07 / Background" title="Education & beyond code." />
        <div className="grid gap-5 lg:grid-cols-3">
          {education.map((e, i) => (
            <Reveal key={e.school} delay={i * 0.08}>
              <TiltCard className="h-full p-7">
                <p className="font-mono text-xs text-white/40">{e.period}</p>
                <h3 className="mt-3 text-xl font-semibold text-white">{e.school}</h3>
                <p className="text-white/50">{e.place}</p>
                <p className="mt-4 text-white/70">{e.detail}</p>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-gradient text-4xl font-semibold">{e.score}</span>
                  <span className="text-sm text-white/40">{e.scoreLabel}</span>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {beyond.map((b, i) => {
            const I = beyondIcons[b.icon];
            return (
              <Reveal key={b.title} delay={i * 0.06}>
                <TiltCard className="h-full p-6" glow="rgba(52,211,153,0.2)">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400/20 to-cyan-400/10 text-emerald-200">
                    <I className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-semibold text-white">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{b.text}</p>
                </TiltCard>
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
    <section id="contact" className="relative px-6 pb-16 pt-32 md:px-12">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-violet-600/20 via-[#0b0b25]/80 to-cyan-500/10 p-10 backdrop-blur-xl md:p-16">
            <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 animate-blob rounded-full bg-violet-500/30 blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 animate-blob rounded-full bg-cyan-400/20 blur-[100px] [animation-delay:-4s]" />
            <p className="relative font-mono text-xs uppercase tracking-[0.3em] text-cyan-300/80">08 / Contact</p>
            <h2 className="relative mt-4 max-w-3xl text-5xl font-semibold tracking-tight text-white md:text-7xl">
              Let&apos;s build something <span className="text-gradient">that scales.</span>
            </h2>
            <p className="relative mt-6 max-w-xl text-lg text-white/60">
              Open to backend and applied-AI roles. The fastest way to reach me is email.
            </p>
            <div className="relative mt-10">
              <Magnetic>
                <a
                  href={links.email}
                  className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-lg font-medium text-black transition hover:shadow-[0_0_60px_rgba(167,139,250,0.6)]"
                >
                  <Mail className="h-5 w-5" /> Say hello
                </a>
              </Magnetic>
            </div>
            <div className="relative mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {channels.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noreferrer"
                  className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-white/30 hover:bg-white/5"
                >
                  <span className="text-white/60 transition group-hover:text-white">{c.icon}</span>
                  <span className="min-w-0">
                    <span className="block text-xs text-white/40">{c.label}</span>
                    <span className="block truncate text-sm text-white/85">{c.value}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </Reveal>
        <footer className="mt-12 flex flex-col items-center justify-between gap-3 text-sm text-white/30 md:flex-row">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>Built with Next.js, React Three Fiber & Framer Motion · Deployed on Vercel</span>
        </footer>
      </div>
    </section>
  );
}
