"use client";

import { animate, motion, useMotionValue, useReducedMotion, useTransform, type AnimationPlaybackControls } from "framer-motion";
import { X } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { DRAG_SLOP, VelocityTracker, project, rubberband, springSheet } from "@/lib/motion";

/**
 * Bottom sheet. Rises from the bottom and leaves the same way. Its header tracks the finger 1:1,
 * rubber-bands when pulled up, and on release uses projected momentum to decide between
 * dismissing and settling. The scrim follows the sheet's position continuously, and a sheet
 * that is mid-dismiss can be grabbed again.
 */
export default function Sheet({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const height = useRef(800);
  const y = useMotionValue(typeof window === "undefined" ? 1000 : window.innerHeight);
  const opacity = useMotionValue(reduce ? 0 : 1);
  const scrim = useTransform(y, (v) => Math.max(0, Math.min(1, 1 - v / height.current)));
  const anim = useRef<AnimationPlaybackControls | null>(null);
  const tracker = useRef(new VelocityTracker());
  const drag = useRef<{ sy: number; by: number; active: boolean } | null>(null);
  const closing = useRef(false);

  const run = (a: AnimationPlaybackControls) => {
    anim.current?.stop();
    anim.current = a;
  };

  const close = useCallback(
    (velocity = 0) => {
      closing.current = true;
      if (reduce) {
        run(animate(opacity, 0, { duration: 0.18, onComplete: onClose }));
        return;
      }
      run(animate(y, height.current + 40, { type: "spring", bounce: 0, duration: 0.35, velocity, onComplete: onClose }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onClose, reduce],
  );

  // Enter.
  useLayoutEffect(() => {
    height.current = panel.current?.offsetHeight ?? 800;
    if (reduce) {
      y.set(0);
      run(animate(opacity, 1, { duration: 0.2 }));
    } else {
      y.set(height.current + 40);
      run(animate(y, 0, springSheet));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Escape to close, lock page scroll, move focus in and give it back afterwards.
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus({ preventScroll: true });
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      html.style.overflow = prevOverflow;
      prev?.focus({ preventScroll: true });
    };
  }, [close]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (reduce || (e.target as HTMLElement).closest("button")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    anim.current?.stop(); // grab it mid-flight, even mid-dismiss
    closing.current = false;
    drag.current = { sy: e.clientY, by: y.get(), active: false };
    tracker.current.reset();
    tracker.current.add(0, e.clientY);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dy = e.clientY - d.sy;
    if (!d.active && Math.abs(dy) < DRAG_SLOP) return;
    d.active = true;
    tracker.current.add(0, e.clientY);
    const raw = d.by + dy;
    y.set(raw < 0 ? -rubberband(-raw, height.current) : raw);
  };

  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    const v = tracker.current.velocity().y;
    const landing = y.get() + project(v);
    if (landing > height.current * 0.4) close(v);
    else run(animate(y, 0, { ...springSheet, velocity: v }));
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center" role="presentation">
      <motion.button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        onClick={() => close()}
        className="absolute inset-0 cursor-default"
        style={{ background: "var(--scrim)", opacity: reduce ? opacity : scrim }}
      />
      <motion.div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{ y, opacity, boxShadow: "var(--shadow-lg)" }}
        className="relative flex max-h-[88svh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[2rem] bg-elevated md:mb-6 md:rounded-[2rem]"
      >
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="shrink-0 cursor-grab touch-none px-6 pb-4 pt-3 active:cursor-grabbing md:px-8"
        >
          <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-line-strong" aria-hidden />
          <div className="flex items-start justify-between gap-4">
            <div>
              {subtitle && <p className="t-caption text-muted">{subtitle}</p>}
              <h3 className="t-title2 mt-1 text-ink">{title}</h3>
            </div>
            <button
              ref={closeBtn}
              type="button"
              onClick={() => close()}
              aria-label="Close"
              className="pressable grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface2 text-muted hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="overflow-y-auto overscroll-contain px-6 pb-10 md:px-8">{children}</div>
      </motion.div>
    </div>,
    document.body,
  );
}
