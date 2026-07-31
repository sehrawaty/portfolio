import { site } from "@/content/site";
import ArchitectureDiagram from "./ArchitectureDiagram";

export default function Hero() {
  return (
    <section id="top" className="shell section-y">
      <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-[8%]">
        <div>
          <h1 className="t-h1 measure text-balance">{site.positioning}</h1>

          <p className="t-body measure mt-6 text-muted">{site.subline}</p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href={site.resumePath}
              className="inline-flex min-h-11 items-center justify-center px-6 py-3 text-[0.9375rem] font-medium text-white transition-colors"
              style={{
                background: "var(--accent-fill)",
                borderRadius: "var(--radius-control)",
                transitionDuration: "var(--dur-hover)",
              }}
            >
              View résumé (PDF)
            </a>
            <a
              href="#contact"
              className="inline-flex min-h-11 items-center justify-center border border-line px-6 py-3 text-[0.9375rem] font-medium text-ink transition-colors hover:border-muted"
              style={{
                borderRadius: "var(--radius-control)",
                transitionDuration: "var(--dur-hover)",
              }}
            >
              Get in touch
            </a>
          </div>
        </div>

        <div className="lg:pl-8">
          <ArchitectureDiagram />
          <p className="t-small mt-6 text-muted">
            Request flow through an internal project-management platform —
            authentication and role-scoped authorization ahead of the service
            layer.
          </p>
        </div>
      </div>
    </section>
  );
}
