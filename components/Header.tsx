import { nav, site } from "@/content/site";

/**
 * Sticky, translucent, hairline-bottomed. 64px tall with a 12px backdrop
 * blur — the Linear reference (plan §2). The one Apple borrow that earns
 * its place (CLAUDE.md §4).
 */
export default function Header() {
  return (
    <header
      className="sticky top-0 z-50 border-b border-line"
      style={{
        height: "var(--header-h)",
        backdropFilter: "blur(12px) saturate(180%)",
        WebkitBackdropFilter: "blur(12px) saturate(180%)",
        backgroundColor: "color-mix(in srgb, var(--bg) 72%, transparent)",
      }}
    >
      <div className="shell flex h-full items-center justify-between gap-4">
        <a
          href="#top"
          className="t-small font-medium tracking-tight text-ink transition-opacity hover:opacity-60"
          style={{ transitionDuration: "var(--dur-hover)" }}
        >
          {site.name}
        </a>

        <nav aria-label="Sections" className="flex items-center gap-1 sm:gap-2">
          <ul className="hidden items-center gap-1 sm:flex">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="t-small block px-3 py-2 text-muted transition-colors hover:text-ink"
                  style={{ transitionDuration: "var(--dur-hover)" }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href={site.resumePath}
            className="t-small ml-1 inline-flex items-center px-3 py-2 font-medium text-accent transition-colors hover:text-accent-ink"
            style={{ transitionDuration: "var(--dur-hover)" }}
          >
            Résumé
          </a>
        </nav>
      </div>
    </header>
  );
}
