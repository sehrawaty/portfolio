import { education } from "@/content/education";
import { extracurriculars } from "@/content/extracurriculars";

export default function Education() {
  return (
    <div>
      <ul className="space-y-6">
        {education.map((entry) => (
          <li
            key={entry.institution}
            className={
              entry.primary ? "" : "border-t border-line pt-6 first:border-t-0"
            }
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <p
                className={
                  entry.primary
                    ? "t-body font-medium text-ink"
                    : "t-small font-medium text-ink"
                }
              >
                {entry.institution}
              </p>
              <span className="t-small t-metric text-muted">
                {entry.period}
              </span>
            </div>
            <p className="t-small mt-1 text-muted">
              {entry.qualification} ·{" "}
              <span className="t-metric">{entry.result}</span>
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-14 border-t border-line pt-10">
        <p className="t-label">Beyond code</p>
        <dl className="mt-6 grid gap-x-12 gap-y-5 sm:grid-cols-2">
          {extracurriculars.map((item) => (
            <div key={item.title}>
              <dt className="t-small font-medium text-ink">{item.title}</dt>
              <dd className="t-small measure mt-0.5 text-muted">
                {item.detail}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
