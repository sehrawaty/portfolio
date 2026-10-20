"use client";

import { AnimatePresence, motion, useMotionValue, useScroll, useSpring } from "framer-motion";
import { ChevronDown, Moon, Play, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useSeries } from "./Series";

const links = [
  ["top", "Home"],
  ["originals", "Originals"],
  ["moments", "Moments"],
  ["skills", "Skills"],
  ["about", "About"],
  ["journey", "Journey"],
  ["picks", "Top Picks"],
  ["stats", "Box Office"],
] as const;

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);
  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setTheme(next);
  };
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full text-ink/75 transition-colors hover:bg-ink/10 hover:text-ink"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ y: 14, opacity: 0, rotate: -45 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -14, opacity: 0, rotate: 45 }}
          transition={{ duration: 0.25 }}
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-1.5 font-display leading-none ${className}`}>
      <span className="text-[1.6em] text-accent">Y</span>
      <span className="tracking-[0.35em] text-ink">SERIES</span>
    </span>
  );
}

export function Nav() {
  const { profile, switchProfile } = useSeries();
  const [active, setActive] = useState("top");
  const [solid, setSolid] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    links.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      obs.disconnect();
    };
  }, []);

  return (
    <>
      <motion.div className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-accent" style={{ scaleX: progress }} />
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${solid ? "bg-bg shadow-lg shadow-black/20" : ""}`}
        style={solid ? undefined : { background: "linear-gradient(to bottom, rgba(var(--shade),0.85), transparent)" }}
      >
        <nav className="mx-auto flex max-w-[1500px] flex-col gap-2 px-4 pb-2 pt-3 md:flex-row md:items-center md:gap-8 md:px-10 md:py-4">
          <div className="flex items-center justify-between">
            <a href="#top" aria-label="Back to the top" className="text-lg">
              <Logo />
            </a>
            <div className="flex items-center gap-1 md:hidden">
              <Controls profileGlyph={profile.glyph} tile={profile.tile} onProfile={switchProfile} />
            </div>
          </div>
          <ul className="no-scrollbar -mx-4 flex gap-5 overflow-x-auto px-4 text-sm md:mx-0 md:px-0">
            {links.map(([id, label]) => (
              <li key={id} className="shrink-0">
                <a
                  href={`#${id}`}
                  className={`relative block py-1 transition-colors ${active === id ? "font-semibold text-ink" : "text-ink/70 hover:text-ink"}`}
                >
                  {label}
                  {active === id && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-0 -bottom-0.5 h-[2px] bg-accent"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>
          <div className="ml-auto hidden items-center gap-2 md:flex">
            <Controls profileGlyph={profile.glyph} tile={profile.tile} onProfile={switchProfile} />
          </div>
        </nav>
      </header>
    </>
  );
}

function Controls({ profileGlyph, tile, onProfile }: { profileGlyph: string; tile: string; onProfile: () => void }) {
  return (
    <>
      <a
        href="#contact"
        className="hidden font-display text-base tracking-[0.2em] text-ink/80 transition hover:text-accent sm:block"
      >
        Let&apos;s build
      </a>
      <ThemeToggle />
      <button type="button" onClick={onProfile} aria-label="Switch viewer profile" className="group flex items-center gap-1">
        <span
          className="grid h-8 w-8 place-items-center rounded font-display text-sm text-poster-ink"
          style={{ background: `linear-gradient(145deg, ${tile}, color-mix(in srgb, ${tile} 45%, var(--poster-shade)))` }}
        >
          {profileGlyph}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-ink/70 transition group-hover:rotate-180" />
      </button>
    </>
  );
}

/** A small ring that follows the pointer and turns into a red play button over anything clickable. */
export function Cursor() {
  const [on, setOn] = useState(false);
  const [hot, setHot] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 600, damping: 40 });
  const sy = useSpring(y, { stiffness: 600, damping: 40 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || calm) return;
    setOn(true);
    document.documentElement.dataset.cursor = "1";
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHot(!!(e.target as Element | null)?.closest?.("a, button"));
    };
    const leave = () => {
      x.set(-100);
      y.set(-100);
    };
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    return () => {
      delete document.documentElement.dataset.cursor;
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, [x, y]);

  if (!on) return null;
  return (
    <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[100]" style={{ x: sx, y: sy }}>
      <motion.div
        className="grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
        animate={
          hot
            ? { width: 40, height: 40, backgroundColor: "var(--accent)", borderColor: "var(--accent)" }
            : { width: 26, height: 26, backgroundColor: "transparent", borderColor: "var(--muted)" }
        }
        style={{ borderWidth: 2, borderStyle: "solid", boxShadow: hot ? "0 0 24px rgba(var(--glow),0.6)" : "none" }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {hot && <Play className="ml-0.5 h-3.5 w-3.5 fill-white text-white" />}
      </motion.div>
    </motion.div>
  );
}
