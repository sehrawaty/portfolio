"use client";

import { animate, motion, useMotionValue, useReducedMotion, useTransform, type AnimationPlaybackControls } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { DRAG_SLOP, VelocityTracker, fade, project, rubberband, spring, springMomentum } from "@/lib/motion";

export type StackItem = { id: string; label: string; tint: string; content: ReactNode };

type Dismiss = (direction: number, velocity: number) => void;

/**
 * A deck of cards you can flick away. Built on the fluid-interface rules:
 * 1:1 tracking from the grab point, release velocity handed to the spring, landing point
 * chosen by momentum projection, rubber-banded vertical travel, and nothing ever locks input:
 * the next card is grabbable while the previous one is still flying.
 */
export default function FlickStack({ items }: { items: StackItem[] }) {
  const [order, setOrder] = useState(() => items.map((i) => i.id));
  const registry = useRef<Record<string, Dismiss>>({});

  const sendToBack = useCallback((id: string) => {
    setOrder((o) => [...o.filter((x) => x !== id), id]);
  }, []);

  const next = (direction = 1) => registry.current[order[0]]?.(direction, 1800);
  const top = items.find((i) => i.id === order[0]);

  return (
    <div className="mx-auto w-full max-w-[22rem]">
      <div
        role="group"
        aria-roledescription="card stack"
        aria-label={`Highlights. Showing ${top?.label.replace(/\.$/, "")}. Swipe, or use the arrow keys.`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") next(1);
          if (e.key === "ArrowLeft") next(-1);
        }}
        className="relative h-[24rem] rounded-[2rem] select-none"
      >
        {items.map((item) => (
          <StackCard
            key={item.id}
            item={item}
            index={order.indexOf(item.id)}
            total={items.length}
            onDismiss={sendToBack}
            registry={registry}
          />
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5" aria-hidden>
          {items.map((i) => (
            <motion.span
              key={i.id}
              className="h-1.5 rounded-full bg-ink"
              animate={{ width: i.id === order[0] ? 18 : 6, opacity: i.id === order[0] ? 0.9 : 0.25 }}
              transition={spring}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => next(1)}
          className="t-caption pressable inline-flex items-center gap-1.5 rounded-full bg-surface2 px-3.5 py-2 font-medium text-ink hover:bg-surface3"
        >
          Next <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
      <p className="t-caption mt-3 px-1 text-faint">Flick the card. It goes where your finger throws it.</p>
    </div>
  );
}

function StackCard({
  item,
  index,
  total,
  onDismiss,
  registry,
}: {
  item: StackItem;
  index: number;
  total: number;
  onDismiss: (id: string) => void;
  registry: React.RefObject<Record<string, Dismiss>>;
}) {
  const reduce = useReducedMotion();
  const el = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-320, 0, 320], reduce ? [0, 0, 0] : [-14, 0, 14]);
  const [flying, setFlying] = useState(false);
  const anims = useRef<AnimationPlaybackControls[]>([]);
  const tracker = useRef(new VelocityTracker());
  const drag = useRef<{ sx: number; sy: number; bx: number; by: number; active: boolean } | null>(null);
  const isTop = index === 0;

  const stop = () => {
    anims.current.forEach((a) => a.stop());
    anims.current = [];
  };

  const settle = useCallback(
    (vx: number, vy: number) => {
      stop();
      // Bounce only when the release actually carried momentum.
      const t = Math.hypot(vx, vy) > 250 ? springMomentum : spring;
      anims.current = [animate(x, 0, { ...t, velocity: vx }), animate(y, 0, { ...t, velocity: vy })];
    },
    [x, y],
  );

  const dismiss = useCallback<Dismiss>(
    (direction, velocity) => {
      stop();
      onDismiss(item.id);
      if (reduce) {
        x.set(0);
        y.set(0);
        return;
      }
      const width = el.current?.offsetWidth ?? 340;
      setFlying(true);
      anims.current = [
        animate(x, direction * width * 1.3, {
          type: "spring",
          bounce: 0,
          duration: 0.4,
          velocity,
          onComplete: () => {
            // Once clear of the deck, tuck in behind it along the same path it left.
            setFlying(false);
            anims.current = [animate(x, 0, spring), animate(y, 0, spring)];
          },
        }),
      ];
    },
    [item.id, onDismiss, reduce, x, y],
  );

  useEffect(() => {
    const reg = registry.current;
    reg[item.id] = dismiss;
    return () => {
      delete reg[item.id];
    };
  }, [dismiss, item.id, registry]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!isTop || flying) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    stop(); // Interrupt any settle in progress and continue from the live on-screen value.
    drag.current = { sx: e.clientX, sy: e.clientY, bx: x.get(), by: y.get(), active: false };
    tracker.current.reset();
    tracker.current.add(e.clientX, e.clientY);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (!d.active && Math.hypot(dx, dy) < DRAG_SLOP) return;
    d.active = true;
    tracker.current.add(e.clientX, e.clientY);
    const h = el.current?.offsetHeight ?? 380;
    x.set(d.bx + dx);
    y.set(rubberband(d.by + dy, h, 0.35)); // vertical travel is allowed but resists
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d?.active) return;
    const v = tracker.current.velocity();
    const width = el.current?.offsetWidth ?? 340;
    // Decide from where the throw is going, not where the finger let go.
    const landing = x.get() + project(v.x);
    if (Math.abs(landing) > width * 0.5) dismiss(Math.sign(landing), v.x);
    else settle(v.x, v.y);
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  const onPointerCancel = () => {
    if (!drag.current) return;
    drag.current = null;
    settle(0, 0);
  };

  const depth = Math.min(index, 3);
  return (
    <motion.div
      className="absolute inset-0"
      style={{ zIndex: flying ? 50 : total - index }}
      initial={false}
      animate={{ scale: 1 - depth * 0.055, y: depth * 16, opacity: index > 2 ? 0 : 1 }}
      transition={reduce ? fade : spring}
      aria-hidden={!isTop}
    >
      <motion.div
        ref={el}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        style={{
          x,
          y,
          rotate,
          touchAction: "pan-y",
          boxShadow: "var(--shadow-lg)",
          background: `radial-gradient(120% 70% at 100% 0%, color-mix(in srgb, ${item.tint} 22%, transparent) 0%, transparent 60%), var(--surface)`,
        }}
        className={`relative h-full overflow-hidden rounded-[2rem] border border-line p-7 ${isTop ? "cursor-grab active:cursor-grabbing" : ""}`}
      >
        {item.content}
      </motion.div>
    </motion.div>
  );
}
