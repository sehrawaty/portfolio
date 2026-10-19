"use client";

import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

/** Fade and rise once when scrolled into view. Transform + opacity only, so it stays on the compositor. */
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({ label, title, sub }: { label: string; title: string; sub?: string }) {
  return (
    <Reveal className="mb-10 max-w-2xl md:mb-14">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.12em] text-muted">{label}</p>
      <h2 className="text-3xl font-semibold tracking-[-0.025em] text-ink md:text-[2.5rem] md:leading-[1.1]">{title}</h2>
      {sub && <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted">{sub}</p>}
    </Reveal>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-line bg-surface ${className}`}>{children}</div>;
}

export function Counter({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);
  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(0, value, { duration: 1.2, ease: [0.25, 0.1, 0.25, 1], onUpdate: setDisplay });
    return () => c.stop();
  }, [inView, value, reduce]);
  return (
    <span ref={ref} className="tabular-nums">
      {display.toFixed(decimals)}
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
