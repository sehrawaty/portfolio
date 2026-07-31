import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/content/projects";

/**
 * Vercel card reference (plan §2): 32px padding, 1px hairline, 12px radius,
 * no shadow. Hover changes border color only.
 *
 * Metrics inside bullets are wrapped in <Metric> by the content layer's
 * convention: any run of digits with a unit is set in mono (plan §6.4).
 */
export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      className="border border-line bg-surface p-6 transition-colors hover:border-muted sm:p-8"
      style={{
        borderRadius: "var(--radius-card)",
        transitionDuration: "var(--dur-hover)",
      }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="t-h3">{project.title}</h3>
        <span className="t-small t-metric text-muted">{project.period}</span>
      </div>

      <p className="t-body measure mt-3 text-muted">{project.problem}</p>

      <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tech stack">
        {project.stack.map((tech) => (
          <li
            key={tech}
            className="t-metric border border-line px-2.5 py-1 text-[0.75rem] text-muted"
            style={{ borderRadius: "6px" }}
          >
            {tech}
          </li>
        ))}
      </ul>

      <ul className="measure mt-8 space-y-3">
        {project.bullets.map((bullet) => (
          <li key={bullet} className="t-small flex gap-3 text-ink">
            <span
              aria-hidden="true"
              className="mt-2.5 h-px w-3 shrink-0"
              style={{ background: "var(--line-input)" }}
            />
            <span>{renderWithMetrics(bullet)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
        {project.demo && (
          <CardLink href={project.demo}>Live demo</CardLink>
        )}
        <CardLink href={project.repo}>GitHub</CardLink>
      </div>
    </article>
  );
}

function CardLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="t-small inline-flex items-center gap-1 font-medium text-accent transition-colors hover:text-accent-ink"
      style={{ transitionDuration: "var(--dur-hover)" }}
    >
      {children}
      <ArrowUpRight size={14} aria-hidden="true" />
    </a>
  );
}

/**
 * Sets numeric runs in mono so metrics read as scannable objects.
 * Matches 94%, 1,500, 7-stage, 60fps, 500+, and arrow pairs.
 */
const METRIC_SOURCE = String.raw`\d[\d,.]*\s*(?:→\s*\d[\d,.]*)?\s*(?:%|fps|\+|-stage)?`;

function renderWithMetrics(text: string) {
  // Split keeps the captured metric runs as alternating odd-index parts,
  // so no stateful .test() is needed to tell them apart.
  const parts = text.split(new RegExp(`(${METRIC_SOURCE})`));
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="t-metric text-ink">
        {part}
      </span>
    ) : (
      part
    ),
  );
}
