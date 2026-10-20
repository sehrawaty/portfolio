"use client";

import { animate, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  className = "",
  y = 28,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Section title in the streaming style: a red eyebrow with a rule, then a big condensed title card. */
export function SeriesHeading({ eyebrow, title, aside }: { eyebrow: string; title: string; aside?: ReactNode }) {
  return (
    <Reveal className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="mb-2 flex items-center gap-3 font-display text-sm tracking-[0.3em] text-accent md:text-base">
          <span className="block h-[3px] w-8 bg-accent" aria-hidden />
          {eyebrow}
        </p>
        <h2 className="title-card text-[3.4rem] uppercase text-ink sm:text-7xl md:text-8xl">{title}</h2>
      </div>
      {aside && <div className="max-w-xs text-sm text-muted md:text-right">{aside}</div>}
    </Reveal>
  );
}

export function Counter({ value, decimals = 0, suffix = "" }: { value: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, value, { duration: 1.8, ease: [0.22, 1, 0.36, 1], onUpdate: setDisplay });
    return () => c.stop();
  }, [inView, value]);
  return (
    <span ref={ref} className="tabular-nums">
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* Brand marks (lucide no longer ships brand icons). */
export const Icons = {
  github: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={p.className} aria-hidden>
      <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.2-3.1-.1-.4-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.6.2 2.8.1 3.2.8.8 1.2 1.9 1.2 3.1 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
    </svg>
  ),
  linkedin: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={p.className} aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  ),
  leetcode: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={p.className} aria-hidden>
      <path d="M13.48 0a1.37 1.37 0 0 0-.96.44L7.12 6.2l-2.9 3.1a5.27 5.27 0 0 0-1.2 2.1 5.7 5.7 0 0 0 0 2.73 5.2 5.2 0 0 0 1.3 2.4l4.3 4.42a5.6 5.6 0 0 0 7.6.24l2.62-2.42a1.38 1.38 0 0 0-1.88-2.02l-2.6 2.42a2.84 2.84 0 0 1-3.78-.12l-4.3-4.41a2.6 2.6 0 0 1-.66-1.2 2.9 2.9 0 0 1 0-1.36c.1-.4.32-.78.6-1.08l7.06-7.56A1.38 1.38 0 0 0 13.48 0Zm-2.87 12.8a1.38 1.38 0 1 0 0 2.75h10.04a1.38 1.38 0 1 0 0-2.75Z" />
    </svg>
  ),
  codeforces: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={p.className} aria-hidden>
      <path d="M4.5 7.5C5.33 7.5 6 8.17 6 9v10.5c0 .83-.67 1.5-1.5 1.5h-3C.67 21 0 20.33 0 19.5V9c0-.83.67-1.5 1.5-1.5h3Zm9-4.5c.83 0 1.5.67 1.5 1.5v15c0 .83-.67 1.5-1.5 1.5h-3c-.83 0-1.5-.67-1.5-1.5v-15c0-.83.67-1.5 1.5-1.5h3Zm9 7.5c.83 0 1.5.67 1.5 1.5v7.5c0 .83-.67 1.5-1.5 1.5h-3c-.83 0-1.5-.67-1.5-1.5V12c0-.83.67-1.5 1.5-1.5h3Z" />
    </svg>
  ),
};
