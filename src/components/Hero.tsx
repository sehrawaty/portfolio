"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { links, profile } from "@/lib/data";
import { Icons } from "./ui";

const Globe = dynamic(() => import("./three/Globe"), { ssr: false });

const socials = [
  ["github", links.github, "GitHub"],
  ["linkedin", links.linkedin, "LinkedIn"],
  ["leetcode", links.leetcode, "LeetCode"],
  ["codeforces", links.codeforces, "Codeforces"],
] as const;

export default function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] as const },
  });

  return (
    <section id="top" className="mx-auto grid max-w-[1120px] items-center gap-10 px-6 pb-20 pt-14 md:grid-cols-[1.1fr_1fr] md:px-12 md:pb-28 md:pt-24">
      <div>
        <motion.p {...rise(0)} className="mb-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {profile.status}
        </motion.p>
        <motion.h1 {...rise(0.05)} className="text-[clamp(2.75rem,7vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-ink">
          {profile.name}
        </motion.h1>
        <motion.p {...rise(0.1)} className="mt-6 max-w-[34rem] text-xl leading-snug tracking-[-0.01em] text-ink md:text-2xl">
          {profile.tagline}
        </motion.p>
        <motion.p {...rise(0.15)} className="mt-4 max-w-[34rem] text-[1.0625rem] leading-relaxed text-muted">
          {profile.intro}
        </motion.p>

        <motion.div {...rise(0.2)} className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href={links.email}
            className="group inline-flex items-center gap-2 rounded-lg bg-ink px-5 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-85"
          >
            Email me
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#work"
            className="inline-flex items-center rounded-lg border border-line-strong px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-subtle"
          >
            See my work
          </a>
        </motion.div>

        <motion.div {...rise(0.25)} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted">
          {socials.map(([k, href, label]) => {
            const I = Icons[k];
            return (
              <a key={k} href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-ink">
                <I className="h-4 w-4" />
                {label}
              </a>
            );
          })}
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {profile.location}
          </span>
        </motion.div>
      </div>

      <motion.figure
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="relative mx-auto aspect-square w-full max-w-[520px]"
        aria-label="A rotating globe of service nodes with requests travelling between them"
      >
        <Globe />
      </motion.figure>
    </section>
  );
}
