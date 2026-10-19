"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const Scene = dynamic(() => import("./three/Scene"), { ssr: false });

const sections = [
  ["dashboard", "Dashboard"],
  ["work", "Work"],
  ["experience", "Experience"],
  ["skills", "Skills"],
  ["credentials", "Credentials"],
  ["contact", "Contact"],
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
      className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full text-ink/70 transition-colors hover:bg-ink/10 hover:text-ink"
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

export function Nav() {
  const [active, setActive] = useState<string>("");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <motion.div className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-gradient-to-r from-accent2 via-accent to-accent3" style={{ scaleX: progress }} />
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-5 z-40 flex justify-center px-4"
      >
        <nav className="flex items-center gap-1 rounded-full border border-ink/10 bg-surface-solid/85 p-1.5 shadow-xl shadow-black/10 dark:shadow-black/40">
          <a href="#top" className="mr-1 grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-accent to-accent3 text-sm font-bold text-white">
            YS
          </a>
          {sections.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className={`relative hidden rounded-full px-4 py-2 text-sm transition-colors sm:block ${active === id ? "text-ink" : "text-ink/55 hover:text-ink"}`}
            >
              {active === id && (
                <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-ink/10" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
              )}
              <span className="relative">{label}</span>
            </a>
          ))}
          <a href="#contact" className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg sm:hidden">
            Contact
          </a>
          <span className="mx-1 h-5 w-px bg-ink/10" />
          <ThemeToggle />
        </nav>
      </motion.header>
    </>
  );
}

/** Fixed 3D background. Skipped when WebGL is missing; calmer when reduced motion is set. */
export function Backdrop() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      setOk(!!(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      setOk(false);
    }
  }, []);
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--halo)_0%,var(--bg)_55%,var(--bg-deep)_100%)]" />
      {ok && (
        <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}>
          <Scene />
        </motion.div>
      )}
    </div>
  );
}

export function CursorGlow() {
  const x = useSpring(-500, { stiffness: 150, damping: 25 });
  const y = useSpring(-500, { stiffness: 150, damping: 25 });
  useEffect(() => {
    const move = (e: PointerEvent) => {
      x.set(e.clientX - 200);
      y.set(e.clientY - 200);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-0 hidden h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent)_12%,transparent)_0%,transparent_65%)] md:block"
      style={{ x, y }}
    />
  );
}

export function Intro() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1400);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-bg"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="text-center">
            <motion.div
              className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-accent via-accent3 to-accent2"
              animate={{ rotate: [0, 90, 180, 270, 360], borderRadius: ["20%", "50%", "20%", "50%", "20%"] }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
            />
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.4em] text-ink/50">Booting yashsehrawat.in</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
