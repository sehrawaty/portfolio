"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { fade, springQuick } from "@/lib/motion";

const sections = [
  ["dashboard", "Dashboard"],
  ["work", "Work"],
  ["experience", "Experience"],
  ["skills", "Skills"],
  ["credentials", "Credentials"],
  ["about", "About"],
] as const;

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const reduce = useReducedMotion();
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);
  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;
    // Ease the swap so the whole page doesn't jump in brightness in one frame.
    root.classList.add("theme-easing");
    root.dataset.theme = next;
    window.setTimeout(() => root.classList.remove("theme-easing"), 400);
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setTheme(next);
  };
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light appearance" : "Switch to dark appearance"}
      className="pressable relative grid h-9 w-9 place-items-center overflow-hidden rounded-full text-muted hover:bg-surface2 hover:text-ink"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={theme}
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6, rotate: -60 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6, rotate: 60 }}
          transition={reduce ? fade : springQuick}
          className="grid place-items-center"
        >
          {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

function useActiveSection() {
  const [active, setActive] = useState("");
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    const ids = ["top", ...sections.map(([id]) => id), "contact"];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);
  return active;
}

/** The mobile menu grows out of its button and shrinks back into it (same path in and out). */
function MobileMenu() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <div ref={wrap} className="relative md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="pressable grid h-9 w-9 place-items-center rounded-full text-ink hover:bg-surface2"
      >
        <span className="relative block h-3 w-4">
          <motion.span
            className="absolute left-0 top-0 h-[1.5px] w-4 rounded-full bg-current"
            animate={open ? { y: 5.25, rotate: 45 } : { y: 0, rotate: 0 }}
            transition={springQuick}
          />
          <motion.span
            className="absolute bottom-0 left-0 h-[1.5px] w-4 rounded-full bg-current"
            animate={open ? { y: -5.25, rotate: -45 } : { y: 0, rotate: 0 }}
            transition={springQuick}
          />
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Sections"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.85, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.85, y: -6 }}
            transition={reduce ? fade : springQuick}
            style={{ transformOrigin: "top right" }}
            className="absolute right-0 top-12 w-56 overflow-hidden rounded-2xl border border-line bg-elevated p-1.5"
          >
            <div style={{ boxShadow: "var(--shadow-lg)" }} className="pointer-events-none absolute inset-0 rounded-2xl" />
            {[...sections, ["contact", "Contact"] as const].map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setOpen(false)}
                className="pressable relative block rounded-xl px-3.5 py-2.5 text-[1.0625rem] text-ink active:bg-surface2"
              >
                {label}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Nav() {
  const active = useActiveSection();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="material relative">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-5 md:px-8">
          <a href="#top" className="t-headline pressable rounded-lg text-ink">
            Yash Sehrawat
          </a>
          <nav aria-label="Sections" className="hidden items-center md:flex">
            {sections.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                aria-current={active === id ? "true" : undefined}
                className={`t-callout relative rounded-full px-3.5 py-1.5 transition-colors ${
                  active === id ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {active === id && (
                  <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-surface2" transition={springQuick} />
                )}
                <span className="relative">{label}</span>
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <a
              href="#contact"
              className="t-callout pressable hidden rounded-full bg-accent-fill px-4 py-1.5 font-medium text-on-accent hover:brightness-110 md:inline-block"
            >
              Contact
            </a>
            <MobileMenu />
          </div>
        </div>
        {/* Scroll edge effect: a soft fade where content meets the bar, not a hard 1px divider. */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 top-full h-6 transition-opacity duration-300 ${scrolled ? "opacity-100" : "opacity-0"}`}
          style={{ background: "linear-gradient(to bottom, color-mix(in srgb, var(--bg) 55%, transparent), transparent)" }}
        />
      </div>
    </header>
  );
}
