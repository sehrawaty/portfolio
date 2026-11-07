"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Award, Briefcase, GraduationCap, MapPin, Sparkles } from "lucide-react";
import { certifications, education, experience, links, profile, projects } from "@/lib/data";
import type { LeetCodeStats } from "@/lib/stats";
import { fade, spring } from "@/lib/motion";
import FlickStack, { type StackItem } from "./FlickStack";
import { Icons } from "./ui";

function CardFace({
  icon,
  kicker,
  value,
  label,
  foot,
}: {
  icon: React.ReactNode;
  kicker: string;
  value: React.ReactNode;
  label: string;
  foot: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="t-caption flex items-center gap-2 font-medium text-muted">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-surface2 text-ink">{icon}</span>
        {kicker}
      </div>
      <div className="mt-auto">
        <div className="t-number text-[clamp(4rem,14vw,5.5rem)] text-ink">{value}</div>
        <p className="t-headline mt-3 text-ink">{label}</p>
        <div className="t-caption mt-4 text-muted">{foot}</div>
      </div>
    </div>
  );
}

export default function Hero({ leetcode }: { leetcode: LeetCodeStats }) {
  const reduce = useReducedMotion();
  const vit = education[0];
  const intern = experience[0];
  const lead = projects[0];

  const items: StackItem[] = [
    {
      id: "leetcode",
      label: "LeetCode problems solved",
      tint: "var(--accent-3)",
      content: (
        <CardFace
          icon={<Icons.leetcode className="h-3.5 w-3.5" />}
          kicker="LeetCode"
          value={leetcode.solved}
          label="Problems solved"
          foot={`${leetcode.easy} easy · ${leetcode.medium} medium · ${leetcode.hard} hard`}
        />
      ),
    },
    {
      id: "cgpa",
      label: "CGPA at VIT Vellore",
      tint: "var(--accent-2)",
      content: (
        <CardFace
          icon={<GraduationCap className="h-3.5 w-3.5" />}
          kicker={vit.school}
          value={vit.score}
          label={vit.scoreLabel}
          foot={`${vit.detail} · ${vit.period}`}
        />
      ),
    },
    {
      id: "smarthq",
      label: `${lead.name}: ${lead.metric.value} ${lead.metric.label}`,
      tint: "var(--accent)",
      content: (
        <CardFace
          icon={<Sparkles className="h-3.5 w-3.5" />}
          kicker={lead.name}
          value={lead.metric.value}
          label={lead.metric.label[0].toUpperCase() + lead.metric.label.slice(1)}
          foot={lead.highlights[2]}
        />
      ),
    },
    {
      id: "intern",
      label: `Internship at ${intern.company}`,
      tint: "var(--success)",
      content: (
        <CardFace
          icon={<Briefcase className="h-3.5 w-3.5" />}
          kicker={intern.role}
          value="3"
          label="User roles behind JWT + RBAC"
          foot={`${intern.company} · ${intern.period}`}
        />
      ),
    },
    {
      id: "certs",
      label: `${certifications.length} verified certifications`,
      tint: "var(--accent-3)",
      content: (
        <CardFace
          icon={<Award className="h-3.5 w-3.5" />}
          kicker="Verified credentials"
          value={certifications.length}
          label="Cloud & AI certifications"
          foot="Google Cloud Associate Cloud Engineer, plus five from Oracle"
        />
      ),
    },
  ];

  const enter = (i: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    transition: reduce ? fade : { ...spring, duration: 0.6, delay: 0.05 + i * 0.06 },
  });

  return (
    <section id="top" className="relative px-5 pb-20 pt-32 md:px-8 md:pb-28 md:pt-40">
      {/* Soft halo: a radial gradient, not a blur filter. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[46rem]"
        style={{ background: "radial-gradient(60% 50% at 70% 10%, color-mix(in srgb, var(--accent) 16%, transparent) 0%, transparent 70%)" }}
      />
      <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
        <div>
          <motion.p {...enter(0)} className="t-callout inline-flex items-center gap-2 rounded-full bg-success/12 px-3.5 py-1.5 font-medium text-success">
            <span className="h-2 w-2 rounded-full bg-success" aria-hidden />
            {profile.status}
          </motion.p>

          <motion.h1 {...enter(1)} className="t-display mt-7 text-ink">
            {profile.name}
          </motion.h1>

          <motion.p {...enter(2)} className="t-lead mt-6 max-w-xl text-muted">
            <span className="font-semibold text-ink">{profile.role}.</span> {profile.tagline}
          </motion.p>
          <motion.p {...enter(3)} className="t-callout mt-3 max-w-xl text-faint">
            {profile.intro}
          </motion.p>

          <motion.div {...enter(4)} className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              className="pressable inline-flex items-center gap-2 rounded-full bg-accent-fill px-6 py-3 font-medium text-on-accent hover:brightness-110"
            >
              Get in touch
            </a>
            <a
              href="#dashboard"
              className="pressable group inline-flex items-center gap-1.5 rounded-full px-4 py-3 font-medium text-accent-ink hover:bg-accent/10"
            >
              Live dashboard <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </motion.div>

          <motion.div {...enter(5)} className="mt-10 flex flex-wrap items-center gap-2">
            {(
              [
                ["github", links.github, "GitHub"],
                ["linkedin", links.linkedin, "LinkedIn"],
                ["leetcode", links.leetcode, "LeetCode"],
                ["codeforces", links.codeforces, "Codeforces"],
              ] as const
            ).map(([k, href, label]) => {
              const I = Icons[k];
              return (
                <a
                  key={k}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="pressable grid h-11 w-11 place-items-center rounded-full bg-surface2 text-muted hover:bg-surface3 hover:text-ink"
                >
                  <I className="h-[18px] w-[18px]" />
                </a>
              );
            })}
            <span className="t-caption ml-3 inline-flex items-center gap-1.5 text-faint">
              <MapPin className="h-3.5 w-3.5" /> {profile.location}
            </span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 24, scale: reduce ? 1 : 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={reduce ? fade : { ...spring, duration: 0.7, delay: 0.2 }}
        >
          <FlickStack items={items} />
        </motion.div>
      </div>
    </section>
  );
}
