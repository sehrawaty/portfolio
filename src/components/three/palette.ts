"use client";

import { useEffect, useState } from "react";

export type Palette = { dark: boolean; ink: string; accent: string; accent2: string; accent3: string };

function read(): Palette {
  const s = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: string) => s.getPropertyValue(name).trim() || fallback;
  return {
    dark: document.documentElement.dataset.theme !== "light",
    ink: v("--ink", "#f2f1ee"),
    accent: v("--accent", "#ff7a45"),
    accent2: v("--accent-2", "#8fb3d1"),
    accent3: v("--accent-3", "#e8b34b"),
  };
}

/** Theme colors from the CSS tokens, re-read whenever the theme toggles. */
export function usePalette() {
  const [palette, setPalette] = useState<Palette | null>(null);
  useEffect(() => {
    setPalette(read());
    const obs = new MutationObserver(() => setPalette(read()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);
  return palette;
}
