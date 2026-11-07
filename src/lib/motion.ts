/**
 * Motion vocabulary for the whole site, taken from Apple's "Designing Fluid Interfaces"
 * and translated to Framer Motion. Every animated value in a component should come from here.
 */
import type { Transition } from "framer-motion";

/** Default UI spring: critically damped (no overshoot). Apple: damping 1.0, response ~0.4. */
export const spring: Transition = { type: "spring", bounce: 0, duration: 0.4 };

/** Snappier critically damped spring for small UI (pills, toggles, menus). */
export const springQuick: Transition = { type: "spring", bounce: 0, duration: 0.3 };

/** Only after a gesture that carried momentum (flick, throw, release). Apple: damping ~0.8. */
export const springMomentum: Transition = { type: "spring", bounce: 0.2, duration: 0.4 };

/** Sheets and drawers. Apple: damping 0.8, response 0.3. */
export const springSheet: Transition = { type: "spring", bounce: 0.15, duration: 0.35 };

/** Short cross-fade used everywhere motion is reduced. */
export const fade: Transition = { duration: 0.2, ease: "easeOut" };

/**
 * Where a flick will come to rest, using Apple's exponential-decay projection
 * (UIScrollView deceleration). Velocity in px/s, result in px.
 */
export function project(velocity: number, decelerationRate = 0.998) {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

/** Progressive resistance past a boundary, so edges feel soft instead of frozen. */
export function rubberband(overshoot: number, dimension: number, constant = 0.55) {
  if (dimension <= 0) return 0;
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}

/** Clamp `value` into [min, max], rubber-banding whatever spills over. */
export function rubberClamp(value: number, min: number, max: number, dimension: number) {
  if (value < min) return min - rubberband(min - value, dimension);
  if (value > max) return max + rubberband(value - max, dimension);
  return value;
}

/**
 * Keeps the last ~100ms of pointer samples so the release velocity matches
 * what the finger was actually doing, not just the final event.
 */
export class VelocityTracker {
  private samples: { t: number; x: number; y: number }[] = [];

  reset() {
    this.samples = [];
  }

  add(x: number, y: number, t = performance.now()) {
    this.samples.push({ t, x, y });
    const cutoff = t - 100;
    while (this.samples.length > 2 && this.samples[0].t < cutoff) this.samples.shift();
  }

  /** Velocity in px/s. Zero if the pointer stopped before release. */
  velocity(now = performance.now()) {
    const recent = this.samples.filter((s) => s.t >= now - 100);
    if (recent.length < 2) return { x: 0, y: 0 };
    const a = recent[0];
    const b = recent[recent.length - 1];
    const dt = (b.t - a.t) / 1000;
    if (dt <= 0) return { x: 0, y: 0 };
    return { x: (b.x - a.x) / dt, y: (b.y - a.y) / dt };
  }
}

/** Movement (px) before a press becomes a drag. Apple uses ~10pt of hysteresis. */
export const DRAG_SLOP = 10;
