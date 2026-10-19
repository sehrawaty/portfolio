"use client";

import { Reveal, SectionHeading } from "./ui";

// An animated request flowing through an authenticated API: the kind of system
// built during the Ayuka internship. Packets ride along the edges with SMIL.
const nodes = [
  { id: "client", x: 70, y: 150, label: "Client", sub: "React dashboard", c: "var(--accent-2)" },
  { id: "gateway", x: 250, y: 150, label: "API Gateway", sub: "Express · REST", c: "var(--accent)" },
  { id: "auth", x: 430, y: 60, label: "Auth", sub: "JWT · RBAC", c: "var(--accent-3)" },
  { id: "service", x: 430, y: 240, label: "Service", sub: "Node.js · FastAPI", c: "var(--accent)" },
  { id: "db", x: 620, y: 240, label: "MongoDB", sub: "Tasks · Projects", c: "var(--success)" },
  { id: "rag", x: 620, y: 60, label: "RAG", sub: "Retrieval · LLM", c: "var(--accent-3)" },
];

const edges: [string, string, number][] = [
  ["client", "gateway", 0],
  ["gateway", "auth", 0.5],
  ["auth", "service", 1.1],
  ["gateway", "service", 1.4],
  ["service", "db", 1.8],
  ["service", "rag", 2.3],
];

const find = (id: string) => nodes.find((n) => n.id === id)!;

export default function Architecture() {
  return (
    <section className="relative px-6 py-24 md:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="03 / How I think" title="A request, end to end." sub="Authenticated, role-aware, and grounded in real data." />
        <Reveal>
          <div className="overflow-x-auto rounded-3xl border border-ink/10 bg-ink/[0.02] p-6">
            <svg viewBox="0 0 700 300" className="min-w-[640px]">
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {edges.map(([a, b, delay]) => {
                const A = find(a);
                const B = find(b);
                const mx = (A.x + B.x) / 2;
                const d = `M${A.x},${A.y} C${mx},${A.y} ${mx},${B.y} ${B.x},${B.y}`;
                return (
                  <g key={a + b}>
                    <path d={d} fill="none" stroke="color-mix(in srgb, var(--ink) 18%, transparent)" strokeWidth="1.5" strokeDasharray="4 6">
                      <animate attributeName="stroke-dashoffset" from="20" to="0" dur="1s" repeatCount="indefinite" />
                    </path>
                    <circle r="4" fill={B.c} filter="url(#glow)">
                      <animateMotion dur="2.4s" begin={`${delay}s`} repeatCount="indefinite" path={d} />
                    </circle>
                  </g>
                );
              })}
              {nodes.map((n) => (
                <g key={n.id} transform={`translate(${n.x},${n.y})`}>
                  <circle r="34" fill="var(--surface-solid)" stroke={n.c} strokeOpacity="0.5" strokeWidth="1.5" />
                  <circle r="34" fill="none" stroke={n.c} strokeWidth="1.5" opacity="0.6">
                    <animate attributeName="r" values="34;44;34" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <text textAnchor="middle" y="-2" fill="var(--ink)" fontSize="11" fontWeight="600">
                    {n.label}
                  </text>
                  <text textAnchor="middle" y="13" fill="color-mix(in srgb, var(--ink) 55%, transparent)" fontSize="8">
                    {n.sub}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
