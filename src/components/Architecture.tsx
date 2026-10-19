"use client";

import { Reveal, SectionHeading } from "./ui";

// Request flow through the authenticated project-management API from the Ayuka internship.
// One accent path (the primary request); a single packet travels it.
const nodes = [
  { id: "client", x: 60, y: 130, label: "Client", sub: "React" },
  { id: "api", x: 220, y: 130, label: "API", sub: "Express" },
  { id: "auth", x: 380, y: 50, label: "Auth", sub: "JWT · RBAC" },
  { id: "service", x: 380, y: 210, label: "Service", sub: "Node.js" },
  { id: "db", x: 540, y: 210, label: "Database", sub: "MongoDB" },
];

const edges: { from: string; to: string; primary?: boolean }[] = [
  { from: "client", to: "api", primary: true },
  { from: "api", to: "auth" },
  { from: "api", to: "service", primary: true },
  { from: "service", to: "db", primary: true },
];

const at = (id: string) => nodes.find((n) => n.id === id)!;
const primaryPath = "M60,130 L220,130 L380,210 L540,210";

export default function Architecture() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-[1120px] px-6 py-24 md:px-12 md:py-32">
        <SectionHeading
          label="How a request moves"
          title="An authenticated API, end to end."
          sub="The request path behind the project-management platform: token check and role guard before any data is touched."
        />
        <Reveal>
          <div className="overflow-x-auto rounded-xl border border-line bg-surface p-6 md:p-10">
            <svg viewBox="0 0 600 260" className="mx-auto w-full min-w-[560px] max-w-[860px]" role="img">
              <title>Client to API to auth and service layer to MongoDB</title>
              {edges.map((e) => {
                const a = at(e.from);
                const b = at(e.to);
                return (
                  <line
                    key={e.from + e.to}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke={e.primary ? "var(--accent)" : "var(--line-strong)"}
                    strokeWidth={e.primary ? 1.5 : 1}
                    strokeDasharray={e.primary ? undefined : "3 4"}
                  />
                );
              })}
              <circle r="3.5" fill="var(--accent)">
                <animateMotion dur="3.2s" repeatCount="indefinite" path={primaryPath} keyPoints="0;1;1" keyTimes="0;0.7;1" calcMode="linear" />
              </circle>
              {nodes.map((n) => (
                <g key={n.id} transform={`translate(${n.x - 46},${n.y - 22})`}>
                  <rect width="92" height="44" rx="8" fill="var(--surface)" stroke="var(--line-strong)" />
                  <text x="46" y="19" textAnchor="middle" fill="var(--ink)" fontSize="11" fontWeight="600" fontFamily="var(--font-geist-mono)">
                    {n.label}
                  </text>
                  <text x="46" y="33" textAnchor="middle" fill="var(--muted)" fontSize="9" fontFamily="var(--font-geist-mono)">
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
