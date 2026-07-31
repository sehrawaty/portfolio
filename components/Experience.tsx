import { experience } from "@/content/experience";

export default function Experience() {
  return (
    <div className="space-y-12">
      {experience.map((role) => (
        <article key={role.company}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="t-h3">{role.company}</h3>
            <span className="t-small t-metric text-muted">{role.period}</span>
          </div>

          <p className="t-small mt-1 text-muted">
            {role.title} · {role.location}
          </p>

          <ul className="measure mt-6 space-y-3">
            {role.bullets.map((bullet) => (
              <li key={bullet} className="t-small flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-2.5 h-px w-3 shrink-0"
                  style={{ background: "var(--line-input)" }}
                />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
