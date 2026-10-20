"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Play } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { series, viewerProfiles, type SectionKey, type ViewerProfile } from "@/lib/data";
import { PROFILE_KEY } from "@/lib/theme";

type Stage = "splash" | "who" | "leaving";

type SeriesState = {
  profile: ViewerProfile;
  choose: (p: ViewerProfile) => void;
  replayOpening: () => void;
  switchProfile: () => void;
};

const SeriesContext = createContext<SeriesState | null>(null);

export function useSeries() {
  const ctx = useContext(SeriesContext);
  if (!ctx) throw new Error("useSeries must be used inside SeriesProvider");
  return ctx;
}

const ease = [0.22, 1, 0.36, 1] as const;

export function SeriesProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ViewerProfile>(viewerProfiles[0]);
  const [stage, setStage] = useState<Stage>("splash");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = viewerProfiles.find((p) => p.id === sessionStorage.getItem(PROFILE_KEY));
      if (saved) setProfile(saved);
    } catch {}
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4200);
    return () => clearTimeout(t);
  }, [toast]);

  const choose = useCallback((p: ViewerProfile) => {
    setProfile(p);
    try {
      sessionStorage.setItem(PROFILE_KEY, p.id);
    } catch {}
    window.scrollTo({ top: 0 });
    setStage("leaving");
    setToast(`Now watching as ${p.name}: ${p.watching}.`);
  }, []);

  const open = (s: Stage) => {
    document.documentElement.dataset.intro = "1";
    setStage(s);
  };

  return (
    <SeriesContext.Provider
      value={{ profile, choose, replayOpening: () => open("splash"), switchProfile: () => open("who") }}
    >
      {children}
      <IntroLayer
        stage={stage}
        setStage={setStage}
        choose={choose}
        onGone={() => {
          delete document.documentElement.dataset.intro;
          setStage("splash");
        }}
      />
      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.4, ease }}
            className="fixed bottom-5 left-1/2 z-[60] w-[calc(100%-32px)] max-w-md -translate-x-1/2 rounded-md border border-line bg-surface2 px-4 py-3 text-center text-sm text-ink shadow-2xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </SeriesContext.Provider>
  );
}

/** Renders the sections in the order the chosen viewer profile prefers. */
export function SeriesSections({ sections }: { sections: Record<SectionKey, ReactNode> }) {
  const { profile } = useSeries();
  return (
    <>
      {profile.order.map((key) => (
        <div key={key}>{sections[key]}</div>
      ))}
    </>
  );
}

function IntroLayer({
  stage,
  setStage,
  choose,
  onGone,
}: {
  stage: Stage;
  setStage: (s: Stage) => void;
  choose: (p: ViewerProfile) => void;
  onGone: () => void;
}) {
  return (
    <motion.div
      className="intro-layer fixed inset-0 z-[70] overflow-y-auto bg-bg-deep"
      animate={stage === "leaving" ? { opacity: 0, scale: 1.08 } : { opacity: 1, scale: 1 }}
      transition={{ duration: stage === "leaving" ? 0.7 : 0, ease }}
      onAnimationComplete={() => stage === "leaving" && onGone()}
      aria-modal="true"
      role="dialog"
      aria-label="Opening sequence"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(60% 50% at 50% 60%, rgba(var(--glow),0.22), transparent 70%)" }}
        aria-hidden
      />
      <AnimatePresence mode="wait">
        {stage === "who" ? (
          <WhoIsWatching key="who" choose={choose} />
        ) : (
          <Splash key="splash" onPlay={() => setStage("who")} onSkip={() => choose(viewerProfiles[0])} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Splash({ onPlay, onSkip }: { onPlay: () => void; onSkip: () => void }) {
  const letters = series.title.toUpperCase().split("");
  return (
    <motion.div
      className="relative flex min-h-full flex-col items-center justify-center px-4 py-16 text-center"
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, ease }}
    >
      <h1 className="title-card flex text-[34vw] text-ink sm:text-[13rem] md:text-[16rem]" aria-label={series.title}>
        {letters.map((l, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 40, scale: 1.25 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.15 + i * 0.09, ease }}
            aria-hidden
          >
            {l}
          </motion.span>
        ))}
      </h1>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.9, delay: 0.7, ease }}
        className="mt-2 h-[2px] w-40 origin-center bg-accent sm:w-64"
        aria-hidden
      />
      <motion.p
        initial={{ opacity: 0, letterSpacing: "0.1em" }}
        animate={{ opacity: 1, letterSpacing: "0.55em" }}
        transition={{ duration: 1.2, delay: 0.8, ease }}
        className="mt-4 font-display text-lg text-accent sm:text-2xl"
      >
        THE SERIES
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.3 }}
        className="mt-10 font-mono text-[11px] uppercase tracking-[0.3em] text-muted sm:text-xs"
      >
        {series.roleLine.join(" • ")}
      </motion.p>
      <motion.button
        type="button"
        onClick={onPlay}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.5, ease }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.97 }}
        className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3 text-sm font-semibold uppercase tracking-widest text-bg"
        autoFocus
      >
        <span className="absolute inset-0 rounded-full border border-ink motion-safe:animate-[pulse-ring_2s_ease-out_infinite]" aria-hidden />
        <Play className="h-4 w-4 fill-current" /> Play
      </motion.button>
      <button
        type="button"
        onClick={onSkip}
        className="absolute bottom-6 right-4 rounded border border-line px-4 py-2 text-xs uppercase tracking-widest text-muted transition hover:border-ink hover:text-ink sm:right-8"
      >
        Skip intro
      </button>
    </motion.div>
  );
}

function WhoIsWatching({ choose }: { choose: (p: ViewerProfile) => void }) {
  return (
    <motion.div
      className="relative flex min-h-full flex-col items-center justify-center px-4 py-16 text-center"
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease }}
    >
      <h2 className="text-4xl font-medium tracking-tight text-ink sm:text-6xl">Who&apos;s watching?</h2>
      <ul className="mt-10 grid grid-cols-2 gap-5 sm:mt-14 sm:flex sm:gap-8">
        {viewerProfiles.map((p, i) => (
          <motion.li
            key={p.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 + i * 0.08, ease }}
          >
            <button type="button" onClick={() => choose(p)} className="group flex w-36 flex-col items-center sm:w-40">
              <span
                className="relative grid aspect-square w-full place-items-center overflow-hidden rounded-lg font-display text-6xl text-poster-ink ring-0 ring-ink transition duration-300 group-hover:scale-105 group-hover:ring-4 group-focus-visible:ring-4"
                style={{ background: `linear-gradient(145deg, ${p.tile}, color-mix(in srgb, ${p.tile} 45%, var(--poster-shade)))` }}
              >
                <span
                  className="absolute inset-0"
                  style={{ background: "radial-gradient(80% 60% at 30% 20%, rgba(255,255,255,0.22), transparent 60%)" }}
                  aria-hidden
                />
                <span className="relative">{p.glyph}</span>
                {p.id === "yash" && (
                  <span className="absolute right-2 top-2 rounded-sm bg-accent px-1.5 py-0.5 font-sans text-[10px] font-bold tracking-wider text-white">
                    MAIN
                  </span>
                )}
              </span>
              <span className="mt-3 text-base text-muted transition group-hover:text-ink">{p.name}</span>
              <span className="mt-1 text-xs leading-snug text-muted/80">{p.blurb}</span>
            </button>
          </motion.li>
        ))}
      </ul>
      <p className="mt-12 max-w-md text-sm text-muted">
        Every profile watches the same true story of Yash Sehrawat. It only changes what plays first.
      </p>
    </motion.div>
  );
}
