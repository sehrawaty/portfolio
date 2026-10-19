"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { links, profile } from "@/lib/data";
import { Icons, Magnetic } from "./ui";

const roles = ["Backend Engineer", "API Architect", "Applied-AI Builder", "Problem Solver"];

export default function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % roles.length), 2600);
    return () => clearInterval(t);
  }, []);

  const words = profile.name.split(" ");

  return (
    <section id="top" className="relative flex min-h-[100svh] items-center px-6 pt-28 md:px-12">
      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-4 py-1.5 text-sm text-emerald-200/90 backdrop-blur"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          {profile.status}
        </motion.div>

        <h1 className="max-w-4xl text-[clamp(3rem,9vw,7.5rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-white">
          {words.map((word, w) => (
            <span key={w} className="inline-block whitespace-nowrap pr-[0.22em]">
              {word.split("").map((ch, idx) => (
                <motion.span
                  key={idx}
                  className="inline-block"
                  initial={{ opacity: 0, y: 80, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.3 + (w * 5 + idx) * 0.04, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: "bottom" }}
                >
                  {ch}
                </motion.span>
              ))}
            </span>
          ))}
        </h1>

        <div className="mt-6 flex h-12 items-center gap-3 text-2xl text-white/70 md:text-3xl">
          <span className="font-mono text-cyan-300">&gt;</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={roles[i]}
              className="text-gradient font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45 }}
            >
              {roles[i]}
            </motion.span>
          </AnimatePresence>
          <span className="h-7 w-[3px] animate-pulse bg-cyan-300/80" />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-6 max-w-xl text-lg leading-relaxed text-white/60"
        >
          {profile.tagline} {profile.intro}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Magnetic>
            <a
              href="#contact"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-7 py-3.5 font-medium text-black"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-violet-400 via-cyan-300 to-pink-300 transition-transform duration-500 group-hover:translate-x-0" />
              <span className="relative">Get in touch</span>
              <ArrowUpRight className="relative h-4 w-4 transition-transform group-hover:rotate-45" />
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href="#dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 font-medium text-white backdrop-blur transition hover:bg-white/10"
            >
              Live dashboard
            </a>
          </Magnetic>
          <div className="ml-1 flex items-center gap-2">
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
                <Magnetic key={k}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 backdrop-blur transition hover:border-white/30 hover:text-white"
                  >
                    <I className="h-[18px] w-[18px]" />
                  </a>
                </Magnetic>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="mt-14 flex items-center gap-2 text-sm text-white/40"
        >
          <MapPin className="h-4 w-4" /> {profile.location}
        </motion.div>
      </div>

      <motion.a
        href="#dashboard"
        aria-label="Scroll down"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ArrowDown className="h-5 w-5" />
      </motion.a>
    </section>
  );
}
