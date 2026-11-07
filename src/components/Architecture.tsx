"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import { fade, springQuick } from "@/lib/motion";
import { Reveal, SectionHeader } from "./ui";

// A request flowing through an authenticated API: the kind of system built during the
// Ayuka internship. Tap a node to trace what it talks to.
const nodes = [
  { id: "client", x: 70, y: 150, label: "Client", sub: "React dashboard", c: "var(--accent-2)" },
  { id: "gateway", x: 250, y: 150, label: "API Gateway", sub: "Express · REST", c: "var(--accent)" },
  { id: "auth", x: 430, y: 60, label: "Auth", sub: "JWT · RBAC", c: "var(--accent-3)" },
  { id: "service", x: 430, y: 240, label: "Service", sub: "Node.js · FastAPI", c: "var(--accent)" },
  { id: "db", x: 620, y: 240, label: "MongoDB", sub: "Tasks · Projects", c: "var(--success)" },
  { id: "rag", x: 620, y: 60, label: "RAG", sub: "Retrieval · LLM", c: "var(--accent-3)" },
] as const;

type NodeId = (typeof nodes)[number]["id"];

const edges: [NodeId, NodeId, number][] = [
  ["client", "gateway", 0],
  ["gateway", "auth", 0.5],
  ["auth", "service", 1.1],
  ["gateway", "service", 1.4],
  ["service", "db", 1.8],
  ["service", "rag", 2.3],
];

type Layout = "wide" | "tall";

function pos(n: (typeof nodes)[number], layout: Layout) {
  if (layout === "wide") return { x: n.x, y: n.y };
  // Rotate the flow so it reads top-to-bottom on a phone.
  return { x: 70 + ((n.y - 60) / 180) * 220, y: 60 + ((n.x - 70) / 550) * 560 };
}

function edgePath(a: NodeId, b: NodeId, layout: Layout) {
  const A = pos(nodes.find((n) => n.id === a)!, layout);
  const B = pos(nodes.find((n) => n.id === b)!, layout);
  if (layout === "wide") {
    const mx = (A.x + B.x) / 2;
    return `M${A.x},${A.y} C${mx},${A.y} ${mx},${B.y} ${B.x},${B.y}`;
  }
  const my = (A.y + B.y) / 2;
  return `M${A.x},${A.y} C${A.x},${my} ${B.x},${my} ${B.x},${B.y}`;
}

function Diagram({
  layout,
  selected,
  onSelect,
  flowing,
}: {
  layout: Layout;
  selected: NodeId | null;
  onSelect: (id: NodeId) => void;
  flowing: boolean;
}) {
  const linked = (a: NodeId, b: NodeId) => !selected || a === selected || b === selected;
  const viewBox = layout === "wide" ? "0 0 700 300" : "0 0 360 680";
  return (
    <svg viewBox={viewBox} className="h-auto w-full" role="group" aria-label="Request flow diagram">
      {edges.map(([a, b, delay]) => {
        const d = edgePath(a, b, layout);
        const on = linked(a, b);
        const to = nodes.find((n) => n.id === b)!;
        return (
          <g key={a + b} style={{ opacity: on ? 1 : 0.18, transition: "opacity 200ms ease" }}>
            <path d={d} fill="none" stroke="var(--line-strong)" strokeWidth="1.5" />
            {flowing && on && (
              <circle r="4" fill={to.c}>
                <animateMotion dur="2.4s" begin={`${delay}s`} repeatCount="indefinite" path={d} />
              </circle>
            )}
          </g>
        );
      })}
      {nodes.map((n) => {
        const p = pos(n, layout);
        const on = !selected || selected === n.id || edges.some(([a, b]) => (a === selected && b === n.id) || (b === selected && a === n.id));
        const isSel = selected === n.id;
        return (
          <g
            key={n.id}
            transform={`translate(${p.x},${p.y})`}
            role="button"
            tabIndex={0}
            aria-pressed={isSel}
            aria-label={`${n.label}: ${n.sub}`}
            onClick={() => onSelect(n.id)}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onSelect(n.id))}
            className="cursor-pointer outline-none [&:focus-visible>circle:first-child]:stroke-[3]"
            style={{ opacity: on ? 1 : 0.3, transition: "opacity 200ms ease" }}
          >
            <circle r="38" fill="var(--surface)" stroke={n.c} strokeWidth={isSel ? 3 : 1.5} style={{ transition: "stroke-width 150ms ease" }} />
            <text textAnchor="middle" y="-2" fill="var(--ink)" fontSize="11.5" fontWeight="600" letterSpacing="-0.01em">
              {n.label}
            </text>
            <text textAnchor="middle" y="13" fill="var(--muted)" fontSize="8.5">
              {n.sub}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Architecture() {
  const [selected, setSelected] = useState<NodeId | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-80px" });
  const reduce = useReducedMotion();
  const flowing = inView && !reduce;
  const node = nodes.find((n) => n.id === selected);
  const neighbours = selected
    ? edges.filter(([a, b]) => a === selected || b === selected).map(([a, b]) => nodes.find((n) => n.id === (a === selected ? b : a))!.label)
    : [];
  const toggle = (id: NodeId) => setSelected((s) => (s === id ? null : id));

  return (
    <section id="architecture" className="scroll-mt-20 px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader kicker="How I think" title="A request, end to end." sub="Authenticated, role-aware, and grounded in real data. Tap a node to trace it." />
        <Reveal>
          <div ref={ref} className="card p-4 md:p-8">
            <div className="hidden md:block">
              <Diagram layout="wide" selected={selected} onSelect={toggle} flowing={flowing} />
            </div>
            <div className="mx-auto max-w-[22rem] md:hidden">
              <Diagram layout="tall" selected={selected} onSelect={toggle} flowing={flowing} />
            </div>
            <div className="mt-4 min-h-[3.5rem] border-t border-line px-2 pt-4" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={selected ?? "none"}
                  initial={{ opacity: 0, y: reduce ? 0 : 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduce ? 0 : -4 }}
                  transition={reduce ? fade : springQuick}
                  className="t-callout text-muted"
                >
                  {node ? (
                    <>
                      <span className="font-semibold text-ink">{node.label}</span> · {node.sub}. Talks to {neighbours.join(", ")}.
                    </>
                  ) : (
                    "Client → gateway → auth check → service → MongoDB, with retrieval feeding the LLM."
                  )}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
