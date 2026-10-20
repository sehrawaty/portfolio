"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Info, Play, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { certifications, episodes, portrait, profile, projects, series } from "@/lib/data";
import { useSeries } from "./Series";

const ease = [0.22, 1, 0.36, 1] as const;

function Portrait() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 w-full md:w-[55%]" aria-hidden={!portrait}>
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(55% 60% at 62% 45%, rgba(var(--glow),0.42), transparent 70%)" }}
      />
      {portrait ? (
        <Image
          src={portrait}
          alt={profile.name}
          fill
          priority
          sizes="(min-width: 768px) 55vw, 100vw"
          className="object-contain object-bottom opacity-40 md:opacity-100"
          style={{ maskImage: "linear-gradient(to bottom, #000 70%, transparent)" }}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease }}
          className="absolute inset-0 flex items-end justify-center overflow-hidden opacity-[0.12] md:justify-end md:pr-[8%] md:opacity-100"
        >
          <span
            className="font-display leading-[0.78] text-[70vw] md:text-[38rem]"
            style={{
              backgroundImage:
                "linear-gradient(170deg, color-mix(in srgb, var(--ink) 90%, transparent) 10%, rgba(var(--glow),0.85) 55%, transparent 92%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Y
          </span>
        </motion.div>
      )}
      <div className="absolute inset-x-0 bottom-0 h-1/2" style={{ background: "linear-gradient(to top, var(--bg), transparent)" }} />
      <div
        className="absolute inset-y-0 left-0 hidden w-1/3 md:block"
        style={{ background: "linear-gradient(to right, var(--bg), transparent)" }}
      />
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.1, duration: 0.8, ease }}
        className="absolute right-[6%] top-[24%] hidden rounded border border-line bg-surface/80 px-3 py-2 text-xs md:block"
      >
        <p className="font-display text-lg leading-none text-ink">CGPA 9.17</p>
        <p className="mt-1 text-muted">B.Tech CSE · VIT</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.3, duration: 0.8, ease }}
        className="absolute left-[18%] top-[40%] hidden rounded border border-line bg-surface/80 px-3 py-2 text-xs lg:block"
      >
        <p className="font-display text-lg leading-none text-ink">Google Cloud</p>
        <p className="mt-1 text-muted">Associate Cloud Engineer</p>
      </motion.div>
    </div>
  );
}

export function Billboard() {
  const { replayOpening } = useSeries();
  const meta = [series.years, series.degree, `${projects.length} Originals`, `${certifications.length} Certifications`];
  return (
    <section id="top" className="relative flex min-h-[92svh] items-end overflow-hidden pb-40 pt-32 md:items-center md:pb-48">
      <Portrait />
      <div className="relative mx-auto w-full max-w-[1500px] px-4 md:px-10">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-2 flex items-baseline gap-1.5 font-display"
          >
            <span className="text-2xl text-accent">Y</span>
            <span className="text-sm tracking-[0.4em] text-muted">SERIES</span>
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25, ease }}
            className="title-card name-sweep text-[34vw] uppercase sm:text-[12rem] md:text-[13rem] xl:text-[15rem]"
          >
            {series.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.5em" }}
            transition={{ duration: 1.2, delay: 0.5, ease }}
            className="mt-1 font-display text-xl text-accent md:text-2xl"
          >
            THE SERIES
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease }}
          >
            <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
              <span className="rounded-sm border border-ink/40 px-1.5 py-0.5 text-xs font-semibold text-ink">{series.badge}</span>
              {meta.map((m, i) => (
                <span key={m} className="flex items-center gap-3">
                  {i > 0 && <span className="h-1 w-1 rounded-full bg-muted" aria-hidden />}
                  {m}
                </span>
              ))}
            </p>
            <p className="mt-4 font-display text-lg tracking-[0.25em] text-ink md:text-xl">
              {series.roleLine.join(" • ")}
            </p>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-ink/85 md:text-lg">
              {profile.tagline} {profile.intro}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={replayOpening}
                className="inline-flex items-center gap-2 rounded bg-ink px-6 py-2.5 font-semibold text-bg transition hover:bg-ink/80"
              >
                <Play className="h-5 w-5 fill-current" /> Play Intro
              </button>
              <a
                href="#originals"
                className="inline-flex items-center gap-2 rounded bg-muted/30 px-6 py-2.5 font-semibold text-ink transition hover:bg-muted/45"
              >
                <Plus className="h-5 w-5" /> My Work
              </a>
              <a
                href="#about"
                aria-label="More about Yash"
                className="grid h-11 w-11 place-items-center rounded-full border-2 border-ink/50 text-ink transition hover:border-ink"
              >
                <Info className="h-5 w-5" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/** "Continue Exploring": one episode card per section, in the viewer's order, each with a scroll-progress bar. */
export function ContinueRow() {
  const { profile: viewer } = useSeries();
  const rail = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const next: Record<string, number> = {};
      for (const key of viewer.order) {
        const el = document.getElementById(key);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        next[key] = Math.min(1, Math.max(0, (window.innerHeight - r.top) / (r.height + window.innerHeight * 0.5)));
      }
      setProgress(next);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    if (rail.current) rail.current.scrollLeft = 0;
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [viewer]);

  const scrollBy = (dir: number) => rail.current?.scrollBy({ left: dir * rail.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <section aria-label="Continue exploring" className="relative z-10 -mt-32 md:-mt-40">
      <div className="mx-auto max-w-[1500px] px-4 md:px-10">
        <h2 className="mb-3 text-xl font-semibold text-ink md:text-2xl">Continue Exploring</h2>
      </div>
      <div className="group/rail relative mx-auto max-w-[1500px]">
        <div ref={rail} className="no-scrollbar flex snap-x gap-3 overflow-x-auto scroll-px-4 px-4 pb-6 pt-2 md:scroll-px-10 md:gap-4 md:px-10">
          {viewer.order.map((key, i) => {
            const ep = episodes[key];
            return (
              <motion.a
                key={key}
                href={`#${key}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 + i * 0.07, ease }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="group relative block aspect-video w-[72vw] max-w-[300px] shrink-0 snap-start overflow-hidden rounded-md text-poster-ink shadow-lg shadow-black/30 sm:w-[300px]"
                style={{ background: `linear-gradient(135deg, ${ep.poster}, color-mix(in srgb, ${ep.poster} 35%, var(--poster-shade)))` }}
              >
                <span
                  className="absolute -right-2 -top-4 font-display text-[7rem] leading-none text-poster-ink/10 transition duration-500 group-hover:text-poster-ink/20"
                  aria-hidden
                >
                  {ep.mark}
                </span>
                <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-white/60 bg-poster-shade/20 transition group-hover:bg-poster-ink group-hover:text-poster-shade">
                  <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
                </span>
                <span className="absolute inset-x-0 bottom-0 p-3">
                  <span className="block font-display text-xs tracking-[0.25em] text-poster-ink/80">
                    Episode {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="block font-display text-2xl leading-none md:text-3xl">{ep.title}</span>
                  <span className="mt-1 block text-[11px] text-poster-ink/75">{ep.meta}</span>
                </span>
                <span className="absolute inset-x-0 bottom-0 h-1 bg-white/20">
                  <span
                    className="block h-full origin-left bg-accent transition-transform duration-300"
                    style={{ transform: `scaleX(${progress[key] ?? 0})` }}
                  />
                </span>
              </motion.a>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label="Scroll episodes left"
          className="absolute inset-y-2 left-0 hidden w-10 place-items-center bg-bg/60 text-ink opacity-0 transition group-hover/rail:opacity-100 md:grid"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label="Scroll episodes right"
          className="absolute inset-y-2 right-0 hidden w-10 place-items-center bg-bg/60 text-ink opacity-0 transition group-hover/rail:opacity-100 md:grid"
        >
          <ChevronRight className="h-7 w-7" />
        </button>
      </div>
    </section>
  );
}
