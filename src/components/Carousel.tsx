"use client";

import { animate, motion, useMotionValue, useReducedMotion, type AnimationPlaybackControls } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { DRAG_SLOP, VelocityTracker, fade, project, rubberClamp, spring, springMomentum } from "@/lib/motion";

/**
 * Horizontal carousel with real momentum: a flick is projected forward (Apple's deceleration
 * curve), the nearest card to that landing point wins, and the release velocity carries into
 * the snap spring. Edges rubber-band. Vertical swipes still scroll the page.
 */
export default function Carousel({ label, children }: { label: string; children: ReactNode[] }) {
  const reduce = useReducedMotion();
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const anim = useRef<AnimationPlaybackControls | null>(null);
  const tracker = useRef(new VelocityTracker());
  const drag = useRef<{ sx: number; sy: number; bx: number; active: boolean; locked: boolean; id: number } | null>(null);
  const dragged = useRef(false);
  const [bounds, setBounds] = useState({ min: 0, canPrev: false, canNext: false });

  const snaps = useCallback(() => {
    const v = viewport.current;
    const t = track.current;
    if (!v || !t) return [0];
    const min = Math.min(0, v.clientWidth - t.scrollWidth);
    const pts = Array.from(t.children).map((c) => Math.max(min, -(c as HTMLElement).offsetLeft));
    return Array.from(new Set([...pts, min])).sort((a, b) => b - a);
  }, []);

  const updateBounds = useCallback(() => {
    const s = snaps();
    const min = s[s.length - 1] ?? 0;
    const cur = x.get();
    setBounds({ min, canPrev: cur < -1, canNext: cur > min + 1 });
  }, [snaps, x]);

  const go = useCallback(
    (target: number, velocity = 0) => {
      anim.current?.stop();
      const t = reduce ? fade : Math.abs(velocity) > 250 ? springMomentum : spring;
      anim.current = animate(x, target, { ...t, velocity, onComplete: updateBounds });
      const s = snaps();
      const min = s[s.length - 1] ?? 0;
      setBounds({ min, canPrev: target < -1, canNext: target > min + 1 });
    },
    [reduce, snaps, updateBounds, x],
  );

  const nearest = (value: number) => snaps().reduce((best, p) => (Math.abs(p - value) < Math.abs(best - value) ? p : best), 0);

  useEffect(() => {
    updateBounds();
    const ro = new ResizeObserver(() => {
      const s = snaps();
      const min = s[s.length - 1] ?? 0;
      if (x.get() < min) x.set(min);
      updateBounds();
    });
    if (viewport.current) ro.observe(viewport.current);
    if (track.current) ro.observe(track.current);
    return () => ro.disconnect();
  }, [snaps, updateBounds, x]);

  // Trackpad horizontal scrolling moves the track directly, then settles on a card.
  useEffect(() => {
    const v = viewport.current;
    if (!v) return;
    let timer: number | undefined;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      anim.current?.stop();
      const s = snaps();
      const min = s[s.length - 1] ?? 0;
      x.set(rubberClamp(x.get() - e.deltaX, min, 0, v.clientWidth));
      window.clearTimeout(timer);
      timer = window.setTimeout(() => go(nearest(x.get())), 90);
    };
    v.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      v.removeEventListener("wheel", onWheel);
      window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [go, snaps, x]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    anim.current?.stop(); // catch it mid-glide
    dragged.current = false;
    drag.current = { sx: e.clientX, sy: e.clientY, bx: x.get(), active: false, locked: false, id: e.pointerId };
    tracker.current.reset();
    tracker.current.add(e.clientX, 0);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.locked) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (!d.active) {
      if (Math.hypot(dx, dy) < DRAG_SLOP) return;
      // Decide the direction once, then commit: vertical belongs to the page.
      if (Math.abs(dy) > Math.abs(dx)) {
        d.locked = true;
        return;
      }
      d.active = true;
      dragged.current = true;
      viewport.current?.setPointerCapture(d.id);
    }
    tracker.current.add(e.clientX, 0);
    x.set(rubberClamp(d.bx + dx, bounds.min, 0, viewport.current?.clientWidth ?? 400));
  };

  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    if (!d?.active) {
      if (d) go(nearest(x.get()));
      return;
    }
    const v = tracker.current.velocity().x;
    go(nearest(x.get() + project(v)), v);
  };

  const step = (dir: 1 | -1) => {
    const s = snaps();
    const cur = x.get();
    const next = dir === 1 ? s.find((p) => p < cur - 1) : [...s].reverse().find((p) => p > cur + 1);
    go(next ?? (dir === 1 ? s[s.length - 1] : 0));
  };

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label}>
      <div
        ref={viewport}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDragStart={(e) => e.preventDefault()}
        onClickCapture={(e) => {
          // A drag that ends over a link must not open it.
          if (dragged.current) {
            e.preventDefault();
            e.stopPropagation();
            dragged.current = false;
          }
        }}
        onFocusCapture={(e) => {
          const item = (e.target as HTMLElement).closest("[data-carousel-item]") as HTMLElement | null;
          const v = viewport.current;
          if (!item || !v) return;
          const left = item.offsetLeft + x.get();
          if (left < 0 || left + item.offsetWidth > v.clientWidth) go(nearest(-item.offsetLeft));
          v.scrollLeft = 0;
        }}
        className="-mx-5 overflow-hidden px-5 md:-mx-8 md:px-8"
        style={{
          touchAction: "pan-y",
          // Scroll edge effect: cards fade out at the edges instead of being sliced off.
          maskImage: "linear-gradient(to right, transparent, #000 20px, #000 calc(100% - 20px), transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, #000 20px, #000 calc(100% - 20px), transparent)",
        }}
      >
        <motion.div ref={track} style={{ x }} className="relative flex w-max gap-4 select-none">
          {children.map((child, i) => (
            <div key={i} data-carousel-item className="shrink-0" draggable={false}>
              {child}
            </div>
          ))}
        </motion.div>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        {(
          [
            [-1, bounds.canPrev, "Previous", ChevronLeft],
            [1, bounds.canNext, "Next", ChevronRight],
          ] as const
        ).map(([dir, enabled, name, Icon]) => (
          <button
            key={name}
            type="button"
            aria-label={name}
            disabled={!enabled}
            onClick={() => step(dir)}
            className="pressable grid h-10 w-10 place-items-center rounded-full bg-surface2 text-ink hover:bg-surface3 disabled:opacity-35 disabled:active:scale-100"
          >
            <Icon className="h-5 w-5" />
          </button>
        ))}
      </div>
    </div>
  );
}
