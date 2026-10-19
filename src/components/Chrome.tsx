"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const sections = [
  ["stats", "Stats"],
  ["work", "Work"],
  ["experience", "Experience"],
  ["skills", "Skills"],
  ["credentials", "Credentials"],
  ["contact", "Contact"],
] as const;

type Theme = "light" | "dark";


export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);
  useEffect(() => {
    setTheme((document.documentElement.dataset.theme as Theme) ?? "light");
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
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="grid h-9 w-9 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-line-strong hover:text-ink"
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

export function Nav() {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      obs.disconnect();
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors ${
        scrolled ? "border-line bg-bg/85 backdrop-blur-md" : "border-transparent bg-bg"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-6 md:px-12">
        <a href="#top" className="font-semibold tracking-tight text-ink">
          Yash Sehrawat
        </a>
        <nav className="flex items-center gap-1">
          {sections.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className={`hidden rounded-md px-3 py-1.5 text-sm transition-colors md:block ${
                active === id ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {label}
              <span className={`mx-auto mt-0.5 block h-px bg-accent transition-all ${active === id ? "w-full" : "w-0"}`} />
            </a>
          ))}
          <div className="ml-3">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
