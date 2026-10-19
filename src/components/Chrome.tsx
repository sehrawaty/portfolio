"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
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
      <motion.div className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-gradient-to-r from-cyan-300 via-violet-400 to-pink-400" style={{ scaleX: progress }} />
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-5 z-40 flex justify-center px-4"
      >
        <nav className="flex items-center gap-1 rounded-full border border-white/10 bg-[#0a0a1f]/60 p-1.5 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <a href="#top" className="mr-1 grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 text-sm font-bold text-white">
            YS
          </a>
          {sections.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className={`relative hidden rounded-full px-4 py-2 text-sm transition-colors sm:block ${active === id ? "text-white" : "text-white/55 hover:text-white"}`}
            >
              {active === id && (
                <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-white/10" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
              )}
              <span className="relative">{label}</span>
            </a>
          ))}
          <a href="#contact" className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black sm:hidden">
            Contact
          </a>
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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1b1150_0%,#07071a_55%,#03030c_100%)]" />
      {ok && (
        <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}>
          <Scene />
        </motion.div>
      )}
      <div className="grain absolute inset-0 opacity-[0.07] mix-blend-overlay" />
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
      className="pointer-events-none fixed left-0 top-0 z-0 hidden h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-[80px] md:block"
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
          className="fixed inset-0 z-[100] grid place-items-center bg-[#03030c]"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="text-center">
            <motion.div
              className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-400 to-cyan-300"
              animate={{ rotate: [0, 90, 180, 270, 360], borderRadius: ["20%", "50%", "20%", "50%", "20%"] }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
            />
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.4em] text-white/50">Booting yashsehrawat.in</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
