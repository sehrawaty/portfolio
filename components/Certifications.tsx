import { ArrowUpRight } from "lucide-react";
import { certifications } from "@/content/certifications";

export default function Certifications() {
  return (
    <div className="space-y-14">
      {certifications.map((group) => (
        <div key={group.label}>
          <p className="t-label">{group.label}</p>

          <ul className="mt-6 divide-y" style={{ borderColor: "var(--line)" }}>
            {group.items.map((cert) => (
              <li
                key={cert.name}
                className="border-t py-6 first:border-t-0 first:pt-0"
                style={{ borderColor: "var(--line)" }}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3 className="t-body font-medium text-ink">{cert.name}</h3>
                  <a
                    href={cert.verify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="t-small inline-flex items-center gap-1 font-medium text-accent transition-colors hover:text-accent-ink"
                    style={{ transitionDuration: "var(--dur-hover)" }}
                  >
                    Verify
                    <ArrowUpRight size={14} aria-hidden="true" />
                    <span className="sr-only"> {cert.name}</span>
                  </a>
                </div>

                <p className="t-small mt-1 text-muted">{cert.issuer}</p>

                <ul className="mt-4 flex flex-wrap gap-2" aria-label="Covers">
                  {cert.skills.map((skill) => (
                    <li
                      key={skill}
                      className="t-metric border border-line px-2.5 py-1 text-[0.75rem] text-muted"
                      style={{ borderRadius: "6px" }}
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
